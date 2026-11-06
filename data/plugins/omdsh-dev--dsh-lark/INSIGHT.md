# dsh-lark-channel

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[632807d](https://github.com/omdsh-dev/dsh-lark/tree/632807d9abafbb866a5e208a0298eff21c7856d1)

<!-- BEGIN META -->
[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-lark) [![npm 30d 2,790](https://img.shields.io/static/v1?label=npm+30d&message=2%2C790&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-channel) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-channel)
<!-- END META -->

> **功能**：将DSH接入飞书/Lark，支持聊天派任务、会话与工作区切换、执行结果和人机审批卡片。

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)支持把真实任务和原生人机决定带到聊天，并用原chat/操作者绑定、一次结算和群发送固定buffer收窄状态错配。相对只转答案有交接增量，未独立证明远程任务净收益。

> **主要限制**：[Q02](#research-q02)、[Q04](#research-q04)、[Q05](#research-q05)表明默认授权单位可为整间群，session分流不等文件租户隔离；文件默认收发、大小事后判定、secret可降级settings，且批准/Host执行/平台送达不是同一成功。部署须明确成员、目录、凭据和未决效果。

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
  - [Q01 · 飞书渠道为谁多完成什么，相对远程聊天增量是什么？](#detail-section-11)
  - [Q02 · 谁能驱动shell能力，群聊、会话和文件系统是否同一种隔离？](#detail-section-12)
  - [Q03 · 卡片决定怎样绑定真实审批，转发、重放和取消如何处理？](#detail-section-13)
  - [Q04 · 文件入站与出站如何保证归属、批准字节和失败状态？](#detail-section-14)
  - [Q05 · 凭据、常驻部署和恢复的全周期负担由谁承担？](#detail-section-15)
  - [Q06 · 渠道里什么交付机制值得独立验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-lark-channel是原生DSH渠道插件，同时有独立部署CLI。它把外部飞书/Lark消息变成可驱动本机Agent的入口，返回执行过程、最终答案和需人参与的卡片，支持切工作区/模型、接续会话及文件交付。适用者是已有可信DSH机器、需要离开终端继续监督任务的操作者；合格结果是原机器实际任务正确完成、审批对应真实调用、交付送到正确会话，而非机器人在线或有进度卡。

终端/远程桌面或仅转发答案的bot；复用DSH工具/沙箱/推理，不将IM入口、多bot数量或SDK重连当新Agent算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 飞书任务/原生过程 | 离终端派任务看结果 | 实际shell权限在Host，平台/模型外部依赖 |
| 会话/工作区/模型 | 持续上下文与原生命令 | 默认chat共享，非文件租户隔离 |
| 人机决定卡片 | 绑定原chat/有权操作者 | 默认群范围审批，已决定不等已执行 |
| 文件入站 | 工作区落盘供工具读 | 默认开，超限下载后删除 |
| 文件出站 | 发送固定buffer | 私聊直接/群每次批、每群最多3待审 |
| 凭据/常驻恢复 | 扫码配置及重连 | secret可降settings，环境secret可进unit |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH机器/Agent/原生工具与模型 | 必需 | 真正执行任务 | 渠道不替代沙箱/业务验收 |
| Node^22.19或>=24、飞书SDK/租户应用 | 必需 | 消息长连接 | 外部服务/权限未验，非扫码保证可用 |
| sender/group/approvers及目录收窄 | 本文试用必需 | 明确谁可驱动/批准/触及文件 | 默认群可整房授权，roots空不限制 |
| settings/credentials服务 | 持久/秘密按部署需 | state、epoch与secret引用 | 缺失可内存/secret回settings |
| 文件/视觉模型 | 文件/图像可选 | 入站落盘、出站buffer/像素推理 | 建议起步关闭，收发各有不同边界 |
| launchd/systemd | 常驻可选 | 关闭终端后运行 | 无supervisor退前台，停止需管服务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立应用、非敏感目录，限成员/approvers/roots | 不默认整群可驱动重要机器 |
| 加载 | 固定版本/Host，核秘密存储与服务 | 常驻/凭据位置明确 |
| 只读任务 | 消息进正确session，核结果与原机 | session分流不等租户沙箱 |
| 人机决定 | 原chat有权者批准，回查原生结果 | 卡片已决定不等预设/工具已完成 |
| 扩大/退出 | 文件另验，停supervisor撤应用权限 | 留存/secret/profile和外部消息单独处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型/机器/平台配额金额未知 | 应用/权限/成员/目录和服务配置 | 无公网回调不等无外部依赖 |
| 持续 | token/文件磁盘/buffer/消息资源未知 | 原机结果复核、卡片与升级 | 无端到端净节时实测 |
| 失败恢复 | SDK重连/重发资源未知 | 审批/Host/送达、epoch与坏历史核对 | 不明效果不盲重试 |
| 退出升级 | 凭据/设置/会话保留资源未知 | 停服务、撤应用/成员、按归属清留存 | remove不自动删secret/已发文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 远程参与 | 真Agent/原生卡片桥接 | 同任务质量和总人审 |
| 决定绑定 | 原chat/operator/open单次结算 | 平台延迟/重绘与Host真实时序 |
| 文件交付 | canonical和群批准固定buffer | SDK送达去重/并发文件竞态 |
| 恢复 | quota退避与epoch/会话状态 | 真实断网/坏历史无损恢复 |

> **思考**：[Q02](#research-q02)、[Q04](#research-q04)、[Q05](#research-q05)表明默认授权单位可为整间群，session分流不等文件租户隔离；文件默认收发、大小事后判定、secret可降级settings，且批准/Host执行/平台送达不是同一成功。部署须明确成员、目录、凭据和未决效果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)支持把真实任务和原生人机决定带到聊天，并用原chat/操作者绑定、一次结算和群发送固定buffer收窄状态错配。相对只转答案有交接增量，未独立证明远程任务净收益。

消息先授权、scope状态/generation、卡片发送竞态单次结算、固定buffer群批和quota重连可借鉴；SDK/Host与成员权限是实际依赖，不能把本地receipt当跨系统业务exactly-once。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q04](#research-q04)、[Q05](#research-q05)表明默认授权单位可为整间群，session分流不等文件租户隔离；文件默认收发、大小事后判定、secret可降级settings，且批准/Host执行/平台送达不是同一成功。部署须明确成员、目录、凭据和未决效果。

<a id="detail-section-6"></a>

### 1.5 使用建议

从独立应用、非敏感目录和指定sender/group/approvers/roots的私聊只读任务开始，先关文件和图像。卡片逐项对原机调用，文件与群扩展分别核；身份或效果不明就停服务撤应用权限，回终端确认。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持原生渠道、绑定审批和文件缓冲设计，外部SDK/租户/Host兼容与业务收益未执行验收；可在独立应用/非敏感目录受限试用，跨系统回执为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/authorization.ts、src/bridge.ts、src/clicks.ts、src/config.ts、src/credentials.ts、src/epoch.ts、src/files.ts、src/index.ts、src/liveness.ts、src/outbound-file.ts、src/permission.ts、src/provision.ts、src/runtime.ts、src/session.ts、src/workspace.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package、index/runtime、authorization/config、bridge入站/原生审批/决定/文件/卸载关键链、session acquire/恢复、epoch/workspace、outbound canonical/read、files下载限额、credentials、provision服务与liveness；未全审SDK、全部CLI/模型/交互卡片/原生Host。
- 下一步：只读固定源码，未运行注册、扫码、服务、模型、消息发送或目标测试；普通冒烟为scope_boundary，外部送达/身份/故障与任务净效益是具体研究缺口。

**分析版本**

- **仓库**：[omdsh-dev/dsh-lark](https://github.com/omdsh-dev/dsh-lark)
- **版本号**：0.0.7（[固定提交 632807d](https://github.com/omdsh-dev/dsh-lark/tree/632807d9abafbb866a5e208a0298eff21c7856d1)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)提出未验证的跨Host/IM分阶段任务回执，关联批准、原生效果与送达，故障对照误判/重复外发和人审成本；SDK事实不足就保持未知，无收益则停，不计已有贡献。

只读固定源码，未运行注册、扫码、服务、模型、消息发送或目标测试；普通冒烟为scope_boundary，外部送达/身份/故障与任务净效益是具体研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 547 | — | — | 9730 |
| .mjs | source | 3 | 96 | 69 | 18 | — |
| .ts | source | 40 | 13532 | 7294 | 5448 | — |
| .ts | test | 25 | 11639 | 9244 | 1231 | — |

</details>

**活跃度**

[![Issue 未关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-lark/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-lark/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-lark/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断飞书远程渠道的身份、原生审批与文件/恢复交付边界，以及可控试用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 飞书渠道为谁多完成什么，相对远程聊天增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-lark-channel是原生DSH渠道插件，同时有独立部署CLI。它把外部飞书/Lark消息变成可驱动本机Agent的入口，返回执行过程、最终答案和需人参与的卡片，支持切工作区/模型、接续会话及文件交付。适用者是已有可信DSH机器、需要离开终端继续监督任务的操作者；合格结果是原机器实际任务正确完成、审批对应真实调用、交付送到正确会话，而非机器人在线或有进度卡。

相对只把最终答案转发到IM的bot，它接入Host已有工具/命令和审批，不要求人回终端；相对远程桌面/SSH，操作词汇和人机交接更贴聊天，却依赖飞书应用权限、成员边界与外部消息平台。Agent推理、沙箱与工具是上游DSH能力，群内多bot与轮次上限不是新多Agent算法，也不证明任务协作质量。

源码入口实际导出runtime.apply，runtime创建SDK渠道并安装bridge；资料说明用长连接、无需公网回调，但SDK服务可用与租户配置不是源码就能保证。个人所有工作都在桌面的人未必需要第二条外部入口，不能因为远程方便就忽略文件/正文经过聊天平台和可能云模型的代价。无独立真实任务/人审时间对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-18](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/README.md#L7-L18)

作者远程任务/卡片与CLI定位。

<details>
<summary>查看原文（12行）</summary>

````text
**把你正在使用的 DeepSeek Harness（DSH）接进飞书。**

直接在聊天里给 Agent 派任务、看执行过程、切换工作区和模型。遇到提问、计划确认或工具审批，也不用回到终端，直接在飞书里处理。需要时，还能把多个 Agent 放进同一个群里协作。

## 快速开始

```sh
npm i -g dsh-lark-channel
dsh-lark-channel start
```

终端会显示二维码。用飞书扫码完成应用创建，然后私聊机器人，或在群里 @ 它即可开始。
````

</details>

**依据 2 · 作者声明**：[README.md:68-84](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/README.md#L68-L84)

作者会话/文件/审批能力。

<details>
<summary>查看原文（17行）</summary>

```text
| 接续已有会话 | `/sessions` 列出这个工作区里可以接续的会话——自己的历史，以及网页端/命令行开的——点一行就切过去；`/cd`、`/new` 会回到自动派生的会话 |
| 多工作区 | `/ws` 查看、`/cd` 切换；回到原工作区时继续之前的任务 |
| 模型切换 | `/model` 打开模型选择卡片；切换后保留当前会话，也可随时恢复默认模型 |
| 原生执行过程 | 在飞书中查看推理、工具调用和结果，最终答案单独发送 |
| 人机协作卡片 | 单选、多选或文字回答问题；批准计划或提出修改意见；允许或拒绝工具调用 |
| 权限预设 | `/permission` 打开预设卡片，写明每个预设能碰到什么、会不会弹审批；放开沙箱需要审批人权限，切回更安全的预设不需要 |
| 实时状态 | `/status` 展示工作区、模型、session 和当前权限预设；可用时还显示上下文占用与累计 token，并支持刷新 |
| 会话隔离 | 可按聊天、话题或群成员划分独立 Agent 会话 |
| 多 Agent 协作 | 多个机器人拥有独立设置、凭据和 session，可以在同一个群里对话与交接任务 |
| 斜杠命令 | 宿主自带的命令（`/plan`、`/compact` 等）直接进入 DSH 命令运行时 |
| 文件收发 | 人发文件进聊天，agent 在工作区里读；agent 的产物发回聊天，群聊里先弹审批卡 |

## 常用命令

| 命令 | 用途 |
|---|---|
| `/status` | 查看并刷新工作区、模型和 session；可用时包含上下文与 token 状态 |
```

</details>

**依据 3 · 源码核查**：[src/index.ts:8-19](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/index.ts#L8-L19)

原生插件入口及runtime导出。

<details>
<summary>查看原文（12行）</summary>

```text
/** Cordis plugin name; keep this stable after publishing. */
export const name = 'lark-channel'

/** Services that must exist before the plugin is applied. */
export const inject: string[] = ['agents']

export { Config } from './config.ts'
export type { ResolvedConfig } from './config.ts'
export { apply } from './runtime.ts'
export type { ChannelConfig } from './runtime.ts'
export type { ChannelPort } from './bridge.ts'
export type { LarkCredentials, RegisterAppPort } from './onboarding.ts'
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:55-85](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/runtime.ts#L55-L85)

SDK渠道参数与关闭混合不同sender的batch。

<details>
<summary>查看原文（31行）</summary>

```text
export function channelOptions(config: ChannelConfig, authorization: Authorization): LarkChannelOptions {
  // Transport-level defense in depth. The plugin's own inbound check is the
  // authority (it runs where the agent is driven), but leaving the transport at
  // its `dmMode: 'open'` default would let unauthorized traffic reach this
  // process at all — and an allowlist the transport enforces never depends on
  // this plugin's handler being reached.
  const policy: PolicyConfig = { requireMention: config.requireMention }
  // Only narrow when a deployment asked to. Who may open a conversation with
  // the bot at all is the app's visibility scope, set in the developer console;
  // restricting again here by default would duplicate that decision.
  if (authorization.directSenders.size > 0) {
    policy.dmMode = 'allowlist'
    policy.dmAllowlist = [...authorization.directSenders]
  }
  if (config.groupAllowlist.length > 0) policy.groupAllowlist = config.groupAllowlist
  const options: LarkChannelOptions = {
    appId: config.appId,
    appSecret: config.appSecret,
    policy,
    source: 'dsh-lark-channel',
    respectProxyEnv: true,
  }
  // The transport batches by CHAT: messages arriving within its window are
  // merged into one, `{...last, content: joined}` — the LAST sender's name on
  // everyone's words. This channel prefixes each group message with who said
  // it, so a merge does not just blur a burst, it misattributes it: A's
  // sentence reaches the model labelled B. Under a finer session scope it is
  // worse still, handing one conversation another's words. Nothing is lost by
  // closing the window: the agent's own inbox already drains several queued
  // messages into a single turn.
  options.safety = { batch: { text: { delayMs: 0 }, media: { delayMs: 0 } } }
```

</details>

**依据 5 · 源码核查**：[src/runtime.ts:200-214](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/runtime.ts#L200-L214)

实际创建渠道并installBridge。

<details>
<summary>查看原文（15行）</summary>

```text
  const start = (resolved: ChannelConfig): void => {
    if (!active || started) return
    started = true
    const authorization = resolveAuthorization(resolved)
    internals.notify(describeAuthorization(authorization))
    installBridge(
      ctx,
      resolved,
      internals.createPort(resolved, authorization),
      internals.notify,
      authorization,
      persistState,
      internals.reconnectDeadlineMs === undefined ? undefined : { deadlineMs: internals.reconnectDeadlineMs },
    )
  }
```

</details>

**依据 6 · 源码核查**：[package.json:1-25](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/package.json#L1-L25)

版本/Node及渠道包身份。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "dsh-lark-channel",
  "description": "Lark/Feishu IM bot channel for DeepSeek Harness: chats drive agents, replies and approvals return as messages and cards",
  "version": "0.0.7",
  "type": "module",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek",
    "deepseek-harness",
    "lark",
    "feishu",
    "larksuite",
    "channel",
    "chatbot",
    "im-bot",
    "cordis",
    "ai-agent"
  ],
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "tsc -b && tsdown",
```

</details>

#### 缺口

- 远程监督任务是否减少来回切换、人审返工以及真实租户兼容未有独立结果。
  **影响**：不能把渠道接线和作者使用说明当生产增效。
  **进一步探讨**：以同一可丢弃任务比较终端/远程桌面与飞书入口，记录全部审批、实际任务结果及恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 谁能驱动shell能力，群聊、会话和文件系统是否同一种隔离？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

消息先由插件refuseMessage过滤，再处理命令/Agent。默认私聊若senderAllowlist为空，则任何在应用可见范围内的人可驱动；群聊按groupAllowlist房间过滤，不逐群成员套私聊sender名单。requireMention默认true限定群消息寻址，但不是身份授权。默认approvers为空时，允许驱动该聊天者也可回答审批，群里通常是整间房；需要指定人决策必须显式配approvers，不能默认只有发起人或机器owner可批。机器人消息另按botPeers/hops限制，senderIsBot缺失按未知而非自动拒绝，依赖SDK提供可信身份。

会话key默认chat共享，同群成员共享上下文；chat-thread按topic拆分，普通群无thread仍按chat；chat-sender才按成员。稳定ID使重启可查同会话，acquire用当前generation与opening promise避免切换/释放期间用旧Agent；取已有live→resume→create。resume任何失败都会记录后尝试新建，不能把损坏/不可读历史等同“从未存在”，也不保证原上下文仍被接续。

会话分流不是操作系统或文件租户隔离。/cd走workspace探测与roots过滤，roots空允许任意满足其他检查的目录，部署default总可回；/sessions还可显式接续同工作区可访问的原生会话。每个机器人独立配置/secret/session也不等独立主机权限。应先把应用可见范围、群成员、approvers和workspaceRoots一并收窄。

#### 证据与依据

**依据 1 · 源码核查**：[src/authorization.ts:79-95](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/authorization.ts#L79-L95)

DM与群房间授权不同。

<details>
<summary>查看原文（17行）</summary>

```text
export function refuseMessage(
  authorization: Authorization,
  subject: MessageSubject,
): string | undefined {
  if (subject.chatType === 'p2p') {
    if (authorization.directSenders.size === 0) return undefined
    return authorization.directSenders.has(subject.senderId)
      ? undefined
      : `sender ${subject.senderId} is not in senderAllowlist`
  }
  // Group members are not gated individually: someone chose to put the bot in
  // this room, and `requireMention` already decides what counts as addressing it.
  if (authorization.groups.size > 0 && !authorization.groups.has(subject.chatId)) {
    return `group ${subject.chatId} is not in groupAllowlist`
  }
  return undefined
}
```

</details>

**依据 2 · 源码核查**：[src/authorization.ts:106-127](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/authorization.ts#L106-L127)

聊天/操作者核对与默认审批人。

<details>
<summary>查看原文（22行）</summary>

```text
export function refuseApprovalClick(
  authorization: Authorization,
  click: { readonly operatorId: string | undefined; readonly chatId: string },
  pending: { readonly chatId: string; readonly chatType: string },
): string | undefined {
  // The card carries its own correlation id, so a click from elsewhere did not
  // come from the card this question published.
  if (click.chatId !== pending.chatId) {
    return `click from chat ${click.chatId} does not match the card's chat ${pending.chatId}`
  }
  if (click.operatorId === undefined) return 'the click carries no operator id'
  if (authorization.approvers.size > 0) {
    return authorization.approvers.has(click.operatorId)
      ? undefined
      : `operator ${click.operatorId} is not in approvers`
  }
  return refuseMessage(authorization, {
    senderId: click.operatorId,
    chatId: pending.chatId,
    chatType: pending.chatType,
  })
}
```

</details>

**依据 3 · 源码核查**：[src/bridge.ts:1564-1606](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L1564-L1606)

真实消息先认证、bot信号分支。

<details>
<summary>查看原文（43行）</summary>

```text
  const handleMessage = async (msg: NormalizedMessage): Promise<void> => {
    // Authorization before anything else: a message here starts a
    // shell-capable agent. Refusals stay silent in the chat — answering would
    // turn the bot into an oracle for who is authorized — and name the sender
    // on the operator console, which is also how an owner finds their own id.
    const refusal = refuseMessage(authorization, msg)
    if (refusal !== undefined) {
      notify(`lark-channel: ignored a message in ${msg.chatId}: ${refusal}`)
      return
    }
    // A message from a bot is answered only where the deployment named that
    // bot and the exchange still has hops left. `undefined` means the event
    // omitted the sender kind, which is "unknown", not "not a bot" — and
    // refusing every unknown sender would refuse ordinary traffic, so only a
    // positive bot signal is judged here.
    const conversation = conversationKey(config.sessionScope, msg)
    if (msg.senderIsBot === true) {
      const verdict = judgeBotMessage(
        { senderId: msg.senderId, key: conversation, ownBotId: ownBotId() },
        botPeers,
        hops,
      )
      if (verdict.kind === 'stranger') {
        // Once per bot per chat: the id is what an operator needs to allow it,
        // and repeating it for every message would bury the rest of the log.
        const seen = `${msg.chatId}/${verdict.senderId}`
        if (!reportedBots.has(seen)) {
          reportedBots.add(seen)
          notify(strangerNotice(verdict.senderId, msg.chatId))
        }
        return
      }
      if (verdict.kind === 'self') return
      if (verdict.kind === 'answer') {
        // Named once per bot per chat: who can drive a shell-capable agent is
        // a fact worth seeing, and here the answer is "a bot".
        const seen = `${msg.chatId}/${msg.senderId}`
        if (!reportedBots.has(seen)) {
          reportedBots.add(seen)
          notify(servedNotice(msg.senderId, msg.chatId))
        }
      }
      if (verdict.kind === 'exhausted') {
```

</details>

**依据 4 · 源码核查**：[src/config.ts:309-325](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/config.ts#L309-L325)

默认chat、提及与文件开关。

<details>
<summary>查看原文（17行）</summary>

```text
  sessionScope: z.union(['chat', 'chat-thread', 'chat-sender'] as const).default('chat'),
  output: z.union(['cot', 'stream'] as const).default('cot'),
  showProcess: z.boolean().default(true),
  attachImages: z.boolean().default(false),
  receiveFiles: z.boolean().default(true),
  maxReceiveFileBytes: z.number().default(20 * 1024 * 1024),
  sendFiles: z.boolean().default(true),
  maxSendFileBytes: z.number().default(20 * 1024 * 1024),
  hideProcessWhenDone: z.boolean().default(false),
  syncSlashCommands: z.boolean().default(true),
  denyTools: z.array(String).default([...DEFAULT_DENY_TOOLS]),
  botPeers: z.array(String).default([]),
  botHops: z.number().default(DEFAULT_BOT_HOPS),
  requireMention: z.boolean().default(true),
  senderAllowlist: z.array(String),
  groupAllowlist: z.array(String),
  approvers: z.array(String),
```

</details>

**依据 5 · 源码核查**：[src/session.ts:65-95](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/session.ts#L65-L95)

会话scope键与稳定ID。

<details>
<summary>查看原文（31行）</summary>

```text
 */
export function conversationKey(scope: SessionScope, msg: NormalizedMessage): string {
  switch (scope) {
    case 'chat':
      return msg.chatId
    case 'chat-thread':
      // Only a topic group splits into threads; an ordinary group carries none,
      // and there the whole chat is the finest facet available.
      return msg.threadId === undefined
        ? msg.chatId
        : `${msg.chatId}${FACET_SEPARATOR}${msg.threadId}`
    case 'chat-sender':
      return `${msg.chatId}${FACET_SEPARATOR}${msg.senderId}`
    default: {
      const unhandled: never = scope
      throw new Error(`lark-channel: unknown session scope ${String(unhandled)}`)
    }
  }
}

/**
 * Brand a conversation key as the session id that owns it. Concatenation only,
 * so the mapping is injective by construction: two conversations can never
 * share one session, and one conversation resolves to the same durable session
 * on every boot.
 * @param key - a conversation key from {@link conversationKey}.
 * @returns the session id to look up, resume, or create.
 */
export function sessionIdFor(key: string, prefix: string = SESSION_PREFIX): string {
  return `${prefix}${key}`
}
```

</details>

**依据 6 · 源码核查**：[src/session.ts:225-260](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/session.ts#L225-L260)

generation/retiring/opening去重。

<details>
<summary>查看原文（36行）</summary>

```text
  /**
   * Resolve the agent for one conversation key. A loop rather than a single
   * walk: every await is a window for a release or a switch to move the
   * conversation on, and a result that no longer matches the key's current
   * state is retried under the new state instead of being handed out stale.
   * @param key - the conversation key.
   * @returns the bound session, the same object for every later call of its key.
   * @throws {Error} when this store is closed, or when creation genuinely fails.
   */
  async acquireKey(key: string): Promise<OpenedSession> {
    for (;;) {
      if (this.closed) throw new Error('lark-channel: sessions are closed')
      // Before the registry is consulted, not after: a teardown in flight is
      // exactly when `lookup` still answers with the agent being disposed.
      const retiring = this.retiring.get(key)
      if (retiring !== undefined) {
        await retiring
        continue
      }
      const generation = this.generation(key)
      const bound = this.opened.get(key)
      if (bound !== undefined) {
        // Reusable only while it still IS this key's session: a workspace
        // switch re-derives the id, and a stale binding is released — a second
        // release is a no-op — before walking under the new state.
        if (bound.handle.agent.session.id === this.idFor(key)) return bound
        await this.release(key)
        continue
      }
      let opening = this.opening.get(key)
      if (opening === undefined) {
        opening = this.bind(key, generation)
        this.opening.set(key, opening)
        // Failure clears the slot so the next message retries — but only the
        // failure that still owns the slot, never a successor's promise.
        opening.catch(() => {
```

</details>

**依据 7 · 源码核查**：[src/session.ts:414-438](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/session.ts#L414-L438)

live/resume/create与恢复异常后新建。

<details>
<summary>查看原文（25行）</summary>

```text
   * Reach the agent for one key: an already live one, else the stored session,
   * else a fresh one.
   * @param key - the conversation key.
   * @returns the first rung that yielded an agent, with its ownership.
   * @throws when creation — the last rung — also fails.
   */
  private async reach(key: string): Promise<OpenedSession> {
    const sessionId = this.idFor(key)
    const live = this.ladder.lookup(sessionId)
    // Whoever created a live agent still owns taking it down.
    if (live !== undefined) return { handle: live, owned: false }
    try {
      return { handle: await this.ladder.resume(sessionId), owned: true }
    } catch (error) {
      // The registry offers no existence probe, so a rejection is the only
      // signal that this conversation was never served here — and an unreadable
      // log looks exactly the same. Reporting it keeps a corrupt session log
      // from passing silently as first contact.
      this.ladder.report(
        `lark-channel: resuming session for ${key} failed, starting a new one: ${failureDetail(error)}`,
      )
    }
    return { handle: await this.ladder.create(sessionId), owned: true }
  }
}
```

</details>

**依据 8 · 源码核查**：[src/workspace.ts:86-93](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/workspace.ts#L86-L93)

roots空不限制路径。

```text
export function withinRoots(path: string, roots: readonly string[]): boolean {
  if (roots.length === 0) return true
  return roots.some((root) => {
    const resolved = resolve(root)
    return path === resolved || path.startsWith(resolved.endsWith(sep) ? resolved : `${resolved}${sep}`)
  })
}

```

**依据 9 · 源码核查**：[src/workspace.ts:251-285](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/workspace.ts#L251-L285)

实际cd探测、default与roots检查。

<details>
<summary>查看原文（35行）</summary>

```text
  async switch(key: string, input: string): Promise<SwitchResult> {
    const expanded = expandHome(input, this.home)
    let candidate: string
    if (isAbsolute(expanded)) {
      candidate = expanded
    } else {
      const matches = this.knownPaths().filter(path => basename(path) === expanded)
      if (matches.length === 1 && matches[0] !== undefined) {
        candidate = matches[0]
      } else if (matches.length > 1) {
        return { ok: false, reason: `名字 \`${input}\` 对应多个目录：\n${matches.map(m => `- \`${m}\``).join('\n')}\n请用完整路径。` }
      } else {
        return { ok: false, reason: `请提供绝对路径（可以 \`~\` 开头），或 \`/${WS_COMMAND}\` 列表里的名字。` }
      }
    }

    const probed = this.probe(candidate)
    if ('error' in probed) return { ok: false, reason: `\`${candidate}\` ${probed.error}。` }
    const canonical = probed.canonical
    // The deployment default is always reachable: the operator chose it, and
    // the guards below narrow what CHATS may add, not what the deployment runs.
    const toDefault = canonical === this.defaultCanonical
    if (!toDefault) {
      const forbidden = forbiddenReason(canonical, this.home)
      if (forbidden !== undefined) return { ok: false, reason: `${forbidden}。` }
      if (!withinRoots(canonical, this.roots)) {
        return { ok: false, reason: `\`${canonical}\` 不在允许的 workspaceRoots 内。` }
      }
    }

    const before = this.pathFor(key)
    const value = toDefault ? DEFAULT_MARKER : canonical
    const changed = (this.entries.get(key) ?? DEFAULT_MARKER) !== value
    this.entries.set(key, value)
    let durable = true
```

</details>

#### 缺口

- SDK身份/提及可信度、目标租户成员管理与历史恢复失败的端到端行为未核。
  **影响**：不能承诺默认owner-only、按人安全隔离或损坏历史无损续接。
  **进一步探讨**：用两个成员/群/话题和坏历史副本核授权与上下文，roots/approvers必须按真实操作职责设置。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 卡片决定怎样绑定真实审批，转发、重放和取消如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bridge仅抢答bySession已拥有Agent的原生approval/request，其他next，且prepend避免先被Web答复端认领。askViaCard在发送前复制callId对应的参数快照，随机UUID登记pending(state=sending)，再发卡；成功后open，只有open状态的点击能结算。点击必须来自原chat、带operator且符合approvers/聊天授权；settle先置settled、解除abort并resolve原promise，再删/重绘卡，所以按钮仍可见不等还有权限。

发送期间已取消/已决定时，卡返回会按已有决定补绘；send失败且非withdrawn则委托next原生答复端，而非假装用户拒绝。request.signal取消/插件卸载清pending；这保护审批promise，并不是撤销已经得到allowed-once并执行的工具。重启后进程内pending不恢复，旧按钮应成为过期，不是可续用批准。持续控制卡有变化的clickMark用来区分重绘后人重新点击与平台重复投递，这个标记不是秘密签名或独立授权。

“本次允许”结算Host allowed-once；某些升级卡的always选项还在结算后异步切危险全访问preset。代码按preset实际sandbox/approval属性判断是否放宽，读不到表时要求approver，优于只比名字。但切换还要等Agent空闲并可能失败，批准一次工具不等全会话预设已切成功。重要决定需要看原生结果和后续切换回执。

#### 证据与依据

**依据 1 · 源码核查**：[src/bridge.ts:2930-2946](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L2930-L2946)

自有session原生审批抢答与next。

<details>
<summary>查看原文（17行）</summary>

```text
  // Approval questions for owned agents become cards; everything else delegates.
  //
  // PREPEND is load-bearing. A host answerer may claim every audited request
  // rather than only the sessions its own clients own — the Web app's BFF does
  // exactly that, pushing the question to browser clients and never calling
  // `next()`. Registered in arrival order this plugin would sit behind it (its
  // rows mount during tree load, this bridge installs after the loader
  // settles), so a chat-driven approval would surface in a browser nobody is
  // watching while the chat waits forever. Answering first is correct on the
  // merits too: the human who typed the request is in the chat, and this
  // listener still delegates every session it does not own.
  ctx.on('approval/request', (request, next) => {
    const binding = bySession.get(request.agent.session.id)
    if (binding === undefined) return next()
    return askViaCard(binding, request, next)
  }, { prepend: true })

```

</details>

**依据 2 · 源码核查**：[src/bridge.ts:1865-1939](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L1865-L1939)

参数快照、随机pending、发送与失败委托。

<details>
<summary>查看原文（75行）</summary>

```text
  const askViaCard = async (
    binding: ChatBinding,
    request: HostApprovalRequest,
    next: () => Promise<HostApprovalOutcome>,
  ): Promise<HostApprovalOutcome> => {
    // A withdrawn question needs no card — and the abort event does not replay
    // for listeners added late, so the flag is the only signal that survives.
    // Read through a call: the flag mutates across awaits, which control-flow
    // narrowing would otherwise reason away.
    const withdrawn = (): boolean => request.signal?.aborted === true
    if (withdrawn()) return 'cancelled'

    // The call's facts are copied NOW: the source map is mutable shared state,
    // and the card must show exactly what the click will approve.
    const recorded = request.callId === undefined
      ? undefined
      : callSnapshots.get(request.agent.session.id)?.get(request.callId)
    const call: CallSnapshot | undefined = recorded === undefined || request.callId === undefined
      ? undefined
      : {
          sessionId: request.agent.session.id,
          turn: recorded.turn,
          callId: request.callId,
          arguments: recorded.arguments,
        }

    // Registered BEFORE the send: a click can arrive the moment the card
    // renders, and an abort can arrive while the send is in flight — both need
    // the question to already exist here.
    const id = randomUUID()
    let resolveOutcome!: (outcome: HostApprovalOutcome) => void
    const settled = new Promise<HostApprovalOutcome>((resolve) => { resolveOutcome = resolve })
    const onAbort = (): void => { settleApproval(id, 'cancelled') }
    const pending: PendingApproval = {
      chatId: binding.chatId,
      chatType: binding.chatType,
      toolName: request.toolName,
      agent: request.agent,
      call,
      paint: (outcome, decidedBy) => settledCard(request.toolName, outcome, decidedBy),
      state: 'sending',
      settle: resolveOutcome,
      removeAbort: () => { request.signal?.removeEventListener('abort', onAbort) },
    }
    pendingApprovals.set(id, pending)
    request.signal?.addEventListener('abort', onAbort, { once: true })

    const published = await sendApprovalCard(
      id,
      pending,
      approvalCard(
        request.toolName,
        request.reason,
        call?.arguments,
        id,
        // The host's request names the tool and the reason; the escalation it
        // asks for rides the call's own arguments, which were snapshotted when
        // the question was asked. The button is offered only where the switch
        // it promises can actually happen — a deployment may compose no
        // presets, no `/permission`, or no unconfined one, and a button that
        // grants this call and then fails forever is worse than none.
        canOpenSession(request.agent) ? requestedEscalation(call?.arguments) : undefined,
      ),
    )
    if (!published) {
      if (settleApproval(id, 'cancelled') && !withdrawn()) {
        // Nothing reached a human and nothing was withdrawn: let the next
        // composed answerer decide instead of silently cancelling the ask.
        pendingApprovals.delete(id)
        return next()
      }
      pendingApprovals.delete(id)
    }
    return settled
  }
```

</details>

**依据 3 · 源码核查**：[src/bridge.ts:1800-1833](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L1800-L1833)

一次结算与重绘时序。

<details>
<summary>查看原文（34行）</summary>

```text
   * Decide one approval exactly once. The asker is resolved immediately; the
   * card is painted here when it already exists, and by the send's return path
   * when the settlement raced the send — either way exactly one of them does.
   */
  const settleApproval = (
    id: string,
    outcome: HostApprovalOutcome,
    decidedBy?: string,
    repaint = true,
  ): boolean => {
    const pending = pendingApprovals.get(id)
    if (pending === undefined || pending.state === 'settled') return false
    pending.state = 'settled'
    pending.outcome = outcome
    pending.decidedBy = decidedBy
    pending.removeAbort?.()
    pending.settle(outcome)
    if (!repaint) {
      // The caller paints it — a click answers with the decided card, which is
      // the one repaint path that cannot fail unnoticed.
      pendingApprovals.delete(id)
      return true
    }
    if (pending.messageId !== undefined) {
      pendingApprovals.delete(id)
      spawn(port.updateCard(pending.messageId, pending.paint(outcome, decidedBy)).catch(reportSendFailure))
    }
    return true
  }

  /**
   * Publish one registered approval's card and settle the race the send itself
   * creates: a decision can arrive — an abort, a timeout, disposal — while the
   * platform is still rendering the card, and the asker is answered by then. The
```

</details>

**依据 4 · 源码核查**：[src/bridge.ts:2713-2754](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L2713-L2754)

open/chat/operator核对与always异步切换。

<details>
<summary>查看原文（42行）</summary>

```text
  const decideApproval = async (value: ApprovalActionValue, evt: CardActionEvent): Promise<CardActionResponse> => {
    const pending = pendingApprovals.get(value.id)
    // Only an OPEN question takes a click: `sending` has no real card yet (a
    // click claiming otherwise is forged or duplicated), and `settled` is
    // merely waiting for its card to be painted.
    if (pending === undefined || pending.state !== 'open') {
      return { toast: toast('info', TOAST.approvalGone) }
    }
    // Anyone who can see the card can press its button — a group may hold
    // people who are not authorized to run anything here, and one press grants
    // the escalation. The decision counts only from an authorized human, in
    // the chat this card was published to.
    const clickRefusal = refuseApprovalClick(
      authorization,
      { operatorId: evt.operator.openId, chatId: evt.chatId },
      pending,
    )
    if (clickRefusal !== undefined) {
      notify(`lark-channel: rejected an approval click: ${clickRefusal}`)
      return { toast: toast('error', TOAST.notApprover) }
    }
    const outcome: HostApprovalOutcome = value.decision === 'allow' ? 'allowed-once' : 'rejected'
    const decidedBy = await resolveApprovalDecider(evt)
    // Captured before settling, which drops the question from the map: what this
    // click paints is decided by the kind of question it answered, not by this
    // dispatch — a tool escalation and an outbound file settle differently.
    const paint = pending.paint
    if (!settleApproval(value.id, outcome, decidedBy, false)) {
      return { toast: toast('info', TOAST.approvalGone) }
    }
    // Settled BEFORE any switch: `danger-full-access` also sets the approval
    // policy to `never`, and `never` refuses what still needs approval — so
    // switching first could reject the very decision being made.
    if (value.always === true && value.decision === 'allow') spawn(openSession(pending, evt))
    return {
      toast: value.decision === 'allow' ? toast('success', TOAST.allowed) : toast('info', TOAST.rejected),
      // The decided card rides the click's own response. The patch API this
      // otherwise relies on reports refusals in a body the SDK discards, so a
      // failed repaint is invisible — a card left showing live buttons after
      // its decision is worse than any toast.
      card: { type: 'raw', data: paint(outcome, decidedBy) },
    }
```

</details>

**依据 5 · 源码核查**：[src/bridge.ts:2645-2667](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L2645-L2667)

全会话预设异步切换和结果消息。

<details>
<summary>查看原文（23行）</summary>

```text
  const openSession = async (pending: PendingApproval, evt: CardActionEvent): Promise<void> => {
    const agent = pending.agent
    if (agent === undefined) {
      notify('lark-channel: cannot open the session — the approval carried no agent')
      return
    }
    notify(`lark-channel: ${evt.operator.openId} opened ${pending.chatId} up to ${UNCONFINED_PRESET}`)
    // Said before it runs, because it runs from the agent's idle phase and an
    // approval is answered mid-turn by construction: the switch lands after
    // this turn does, and silence until then would read as nothing happening.
    await port.send(pending.chatId, { text: presetHeldText(UNCONFINED_PRESET) }).catch(reportSendFailure)
    const landed = await applyPreset(agent.session.id, agent, UNCONFINED_PRESET)
    // Dropped means the conversation moved on — `/new`, `/cd`, disposal — and
    // it has already been told what it asked for; a failure line here would be
    // about a switch nobody is still waiting for.
    if (landed.cancelled === true) return
    await port
      .send(pending.chatId, {
        text: landed.ok ? PRESET_OPENED : presetFailedText(UNCONFINED_PRESET, landed.detail),
      })
      .catch(reportSendFailure)
  }

```

</details>

**依据 6 · 源码核查**：[src/permission.ts:99-110](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/permission.ts#L99-L110)

按属性和未知表保守判放宽。

<details>
<summary>查看原文（12行）</summary>

```text
 */
export function loosensSandbox(preset: string, presets: HostPermissionPresets | undefined): boolean {
  if (presets === undefined) return true
  try {
    const spec = presets.resolve(preset)
    return spec.sandbox === UNCONFINED_SANDBOX || spec.approval === NEVER_ASK
  } catch {
    // An unknown name is not a safe name.
    return true
  }
}

```

</details>

**依据 7 · 源码核查**：[src/clicks.ts:20-44](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/clicks.ts#L20-L44)

重绘标记是去重区分而非授权。

<details>
<summary>查看原文（25行）</summary>

```text
let issued = 0

/**
 * One mark, unique across renderings and across restarts.
 * @returns the mark, short enough to leave the payload readable.
 */
export function clickMark(): string {
  issued += 1
  return `${Date.now().toString(36)}${issued.toString(36)}`
}

/**
 * Stamp a button payload with the rendering it belongs to.
 *
 * The mark is named `a` and inserted FIRST for one reason: the transport
 * identifies an action by the first 128 characters of the serialized payload,
 * and these payloads are longer than that. First by insertion order keeps it
 * inside that window as written, and first alphabetically keeps it there for
 * anything that re-serializes with sorted keys on the way back.
 * @param value - the payload the button carries.
 * @returns the same payload, marked.
 */
export function marked<T extends object>(value: T): T & { readonly a: string } {
  return { a: clickMark(), ...value }
}
```

</details>

**依据 8 · 源码核查**：[src/bridge.ts:2948-2960](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L2948-L2960)

卸载取消原生问询/状态。

<details>
<summary>查看原文（13行）</summary>

```text
  // closed, open streaming cards settled. The session store owns the agents, so
  // it does the disposing — and it leaves an adopted one running for its owner.
  ctx.effect(() => () => {
    unwound = true
    for (const id of [...pendingApprovals.keys()]) settleApproval(id, 'cancelled')
    pendingApprovals.clear()
    for (const sessionId of [...bySession.keys()]) questions.cancelSession(sessionId)
    const open = [...bySession.values()]
    bySession.clear()
    bindings.clear()
    compositions.clear()
    callSnapshots.clear()
    runningBySession.clear()
```

</details>

#### 缺口

- 平台重复/延迟回调、卡片重绘失败与Host决定后动作的真实时序未测。
  **影响**：不能把按钮toast或卡片外观当工具已执行/预设已切换/消息已撤回的证据。
  **进一步探讨**：在测试群用延迟send、转发卡、重复点击、取消/重启及切换失败核原promise只结算一次并回查原生权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 文件入站与出站如何保证归属、批准字节和失败状态？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

receiveFiles默认开，入站资源先在当前workspace的.dsh-lark/inbox按消息建目录，sanitize文件名，realpath落点后核canonical containment，再由SDK下载。单文件/每消息预算依bytesWritten在下载后判断，超限删文件并告知；它限制最终保留，不是下载前网络/磁盘硬限，删除本身也可能失败。文件只增不删，由操作者清理；receiveFiles关闭不等attachImages也关闭，图像可经另一路进入模型。

出站/get和send_file先resolve→canonical path→workspace内→regular file/大小，再readBuffer复查长度。私聊直接发送；群聊先读固定buffer再问房间，批准后送同一buffer，避免批准路径后内容换成另一份。每群待审最多3件，超额在读buffer前拒绝；审批过期、取消、send卡失败都不发送文件，并区分无人决定与拒绝。路径/错误对聊天和模型尽量隐藏Host绝对前缀，但这不等内容脱敏。

canonical检查与read仍不是基于不可替换文件句柄的全文件系统事务，源码也注明同长重写不被size检查发现；在读之前的攻击性并发替换未验。群审批保证当次读入buffer不在审批等待后改变，并不保证文件内容没有秘密或提示注入。port.send成功表示传输调用完成，平台持久送达/下载与丢响应重试去重依SDK/服务，不能宣称exactly-once业务交付或取消撤回已发消息。

#### 证据与依据

**依据 1 · 源码核查**：[src/files.ts:18-29](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/files.ts#L18-L29)

SDK无大小probe，事后判断与落点限制。

<details>
<summary>查看原文（12行）</summary>

```text
 * The per-file limit can only be judged AFTER the download. A
 * `ResourceDescriptor` carries no size and the transport offers no size probe,
 * so the verdict is `bytesWritten` and an over-limit file is unlinked the
 * moment it lands. The bytes really do touch the disk once; that is the
 * transport's surface, not a choice made here.
 *
 * Sanitization below buys filesystem safety and nothing else. A sanitized name
 * is still attacker-chosen text that rides into the model's prompt, and the
 * defense at that layer is the standing presence line, not this one. It also
 * cannot see a symlink, which is why the landing directory is canonicalized
 * before anything is written into it: the name is safe and the PATH still has
 * to be proven to be inside the workspace.
```

</details>

**依据 2 · 源码核查**：[src/files.ts:274-298](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/files.ts#L274-L298)

禁用落盘不等禁用图像另路。

<details>
<summary>查看原文（25行）</summary>

```text
export async function collectInboundFiles(
  msg: NormalizedMessage,
  port: InboundFilePort,
  options: InboundOptions,
): Promise<CollectedFiles> {
  const resources = msg.resources.filter(isLandableResource)
  if (resources.length === 0) return { landed: [], notes: [] }
  if (!options.enabled) {
    // Told, not hidden: someone who attaches a log is talking about the log.
    //
    // "Not saved" and not "not received": with `attachImages` on, an image this
    // switch keeps off the disk is STILL attached as a content block by
    // `images.ts` — a deliberate ruling — so a note claiming the channel never
    // received it would contradict the picture sitting right beside it. What
    // this switch actually costs the model is the path, and that is what it says.
    return {
      landed: [],
      notes: [`（用户发送了 ${resources.length} 个文件，本渠道未把它们存入工作区，因此没有可读取的路径：receiveFiles 未开启）`],
    }
  }

  const requested = inboxDirectoryFor(msg, options.workspace)
  // The PROVEN directory, and what every path below is built from. Spelled and
  // canonical are two different directories whenever a link sits between them,
  // and a proof taken on one of them says nothing about the other.
```

</details>

**依据 3 · 源码核查**：[src/files.ts:299-347](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/files.ts#L299-L347)

canonical落点、下载后超限删除。

<details>
<summary>查看原文（49行）</summary>

```text
  let directory: string
  try {
    // The transport streams into an existing directory; it does not make one.
    await mkdir(requested, { recursive: true })
    // And the directory it just made has to be PROVEN inside the workspace
    // rather than merely spelled that way. The sanitizer cannot see a symlink —
    // it judges one name, while `resolve` and `join` fold `..` and then answer
    // "inside the workspace" for a path whose own components lead anywhere at
    // all: a `.dsh-lark/inbox` pointing elsewhere takes `mkdir` with it, and
    // the sender's next file lands in the link's target under a name the sender
    // chose. So containment is asked of the filesystem and not of the string,
    // the same way outbound refuses to trust a path it has not canonicalized
    // (ADR 0004) — and a write earns that question at least as much as a read.
    //
    // The canonical form is then KEPT and joined onto, because a proof is only
    // worth anything on the path the bytes actually travel: writing through
    // `requested` after canonicalizing it would leave the same link free to be
    // swapped in between the check and the download, and the check would have
    // been about a directory nothing was written to.
    const landing = realpathSync(requested)
    const container = canonicalPathOf(options.workspace) ?? resolve(options.workspace)
    if (!isWithinContainer(landing, container)) {
      throw new Error('the inbox directory does not resolve inside the workspace')
    }
    directory = landing
  } catch (error) {
    const detail = failureDetail(error)
    // Nothing was downloaded, so whatever this attempt did create is an empty
    // directory nobody was promised — including one made through a link.
    await discardDirectory(requested)
    options.report(`lark-channel: could not create the inbox directory ${requested}: ${detail}`)
    return {
      landed: [],
      notes: [`（收到 ${resources.length} 个文件，但无法在工作区创建 ${CHANNEL_DIRECTORY}/${INBOX_DIRECTORY}/：${detail}）`],
    }
  }

  const landed: LandedFile[] = []
  const skipped: string[] = []
  const claimed = new Set<string>()
  // One name for the ceiling, so what the note quotes and what the loop
  // enforces cannot drift apart.
  const messageCeiling = options.maxFileBytes * MESSAGE_BYTES_FACTOR
  let budget = messageCeiling
  for (const [index, resource] of resources.entries()) {
    const fileName = claimFileName(claimed, sanitizeFileName(resource.fileName))
    const destination = join(directory, fileName)
    try {
      const { contentType, bytesWritten } = await port.downloadResourceToFile(
```

</details>

**依据 4 · 源码核查**：[src/outbound-file.ts:113-139](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/outbound-file.ts#L113-L139)

出站canonical/regular file/size检查。

<details>
<summary>查看原文（27行）</summary>

```text
  const requested = input.trim()
  // Naming no file at all is not "the workspace is not a file" — which is what
  // resolving an empty path against it would conclude — it is a missing path.
  if (requested === '') return { ok: false, refusal: { code: 'not_found' } }
  // A workspace that cannot be canonicalized still bounds the check: its
  // resolved form is what every path under it will be compared against.
  const container = canonicalPathOf(workspace) ?? resolve(workspace)
  const canonical = canonicalPathOf(resolve(container, requested))
  if (canonical === undefined) return { ok: false, refusal: { code: 'not_found' } }
  if (!isWithinContainer(canonical, container)) return { ok: false, refusal: { code: 'outside_workspace' } }
  const found = inspectFile(canonical)
  if (found === undefined) return { ok: false, refusal: { code: 'not_found' } }
  if (!found.isFile) return { ok: false, refusal: { code: 'not_a_file' } }
  if (found.bytes > maxBytes) {
    return { ok: false, refusal: { code: 'too_large', bytes: found.bytes, limit: maxBytes } }
  }
  return {
    ok: true,
    file: {
      path: canonical,
      fileName: basename(canonical),
      bytes: found.bytes,
      pathInWorkspace: relative(container, canonical),
      workspaceName: workspaceNameOf(container),
    },
  }
}
```

</details>

**依据 5 · 源码核查**：[src/outbound-file.ts:142-176](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/outbound-file.ts#L142-L176)

readBuffer长度与明确race边界。

<details>
<summary>查看原文（35行）</summary>

```text
 * Read the cleared file's bytes for `send({ file })`.
 *
 * The bytes come from the verdict's canonical path and never from the caller's
 * own input, so a link the check already followed cannot be followed a second
 * time to somewhere else.
 *
 * The size is checked again against the verdict, because `readFile` treats the
 * size it stats as a hint and reads to EOF regardless. A file still being
 * appended to when it was cleared — an agent's own background process writing
 * on — would otherwise come back BIGGER than the ceiling that just let it
 * through, and the ceiling is the whole reason this function exists.
 *
 * That check enforces the CEILING and closes no race: a rewrite to the same
 * length passes it unnoticed, and this function re-examines neither the
 * canonical path nor what it now points at. So it is not what makes a group's
 * approval mean anything — the caller's ORDER is. `deliverFile` reads the bytes
 * before it asks the room and sends the buffer it already holds, so the file the
 * card certified is the object that leaves.
 * @param file - a file {@link resolveOutboundFile} cleared.
 * @returns its contents.
 * @throws {Error} when the file vanished after it was cleared, or is no longer the size it cleared at.
 */
export async function readOutboundFile(file: OutboundFile): Promise<Buffer> {
  const bytes = await readFile(file.path)
  if (bytes.byteLength !== file.bytes) throw new Error(`${file.fileName} changed size after it was cleared`)
  return bytes
}

/**
 * Why a cleared file could not be read, said without spelling the host's path.
 *
 * `readFile`'s own failures quote the absolute path they were handed —
 * `ENOENT: no such file or directory, open '/Users/…/project/out/a.md'` — so
 * passing one straight through undoes in the failure branch exactly what every
 * other branch here is careful about: the model gets a map of the filesystem it
```

</details>

**依据 6 · 源码核查**：[src/bridge.ts:2076-2114](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L2076-L2114)

先读buffer、群问、同buffer发送。

<details>
<summary>查看原文（39行）</summary>

```text
  const offerFile = async (
    binding: ChatBinding,
    sessionId: string,
    file: OutboundFile,
    signal?: AbortSignal,
  ): Promise<string | undefined> => {
    // First, so that everything after this point is about bytes that exist.
    let bytes: Buffer
    try {
      bytes = await readOutboundFile(file)
    } catch (error) {
      // Scrubbed, because an fs failure quotes the absolute path it was given and
      // this sentence goes to the model — which `describeRefusalForModel` is
      // careful never to hand a path it did not type itself.
      return `That file could not be read: ${describeReadFailure(error, file)}`
    }
    if (binding.chatType !== 'p2p') {
      const refused = await askFileSend(binding, file, bytes, signal)
      if (refused !== undefined) return refused
    }
    try {
      // A buffer, never a path (ADR 0004), and through the transport's own media
      // path rather than a hand-rolled upload (ADR 0005).
      await port.send(
        binding.chatId,
        { file: { source: bytes, fileName: file.fileName } },
        replyOptions(aimBySession.get(sessionId)),
      )
    } catch (error) {
      // The SDK's own code is the actionable half — `rate_limited` invites a
      // retry, `permission_denied` never will — so it survives to the model
      // instead of being flattened into "the send failed".
      const code = channelErrorCode(error)
      const detail = failureDetail(error)
      notify(`lark-channel: sending ${file.fileName} to ${binding.chatId} failed [${code ?? 'unknown'}]: ${detail}`)
      return `The chat platform refused the upload [${code ?? 'unknown'}]: ${detail}`
    }
    return undefined
  }
```

</details>

**依据 7 · 源码核查**：[src/bridge.ts:1963-2019](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L1963-L2019)

群文件审批超时、取消和拒绝分支。

<details>
<summary>查看原文（57行）</summary>

```text
    sending: Buffer,
    signal?: AbortSignal,
  ): Promise<string | undefined> => {
    // Already cancelled: publishing a card here would ask a room to decide
    // something nobody is waiting for any more.
    if (signal?.aborted === true) {
      return 'That turn was cancelled before this chat could be asked, so the file was not sent.'
    }
    const id = randomUUID()
    let resolveOutcome!: (outcome: HostApprovalOutcome) => void
    const settled = new Promise<HostApprovalOutcome>((resolve) => { resolveOutcome = resolve })
    // A card nobody answers must not hold the model's turn open forever, and it
    // is NOT a refusal: the model is told which of the two happened, because
    // "they said no" and "nobody was looking" call for different next moves.
    let expired = false
    const timer = setTimeout(() => {
      expired = true
      notify(`lark-channel: a file approval in ${binding.chatId} went undecided; ${file.fileName} was not sent`)
      settleApproval(id, 'cancelled')
    }, QUESTION_TIMEOUT_MS)
    timer.unref?.()

    // The same shape the tool escalations use, so the settle is the one that
    // already guarantees a question closes once and its card stops offering
    // buttons — this path adds no judgement of its own about that.
    const onAbort = (): void => { settleApproval(id, 'cancelled') }
    const pending: PendingApproval = {
      chatId: binding.chatId,
      chatType: binding.chatType,
      toolName: SEND_FILE_TOOL,
      paint: (outcome, decidedBy) => settledFileCard(file, outcome, decidedBy),
      state: 'sending',
      settle: resolveOutcome,
      removeAbort: () => { signal?.removeEventListener('abort', onAbort) },
    }
    pendingApprovals.set(id, pending)
    signal?.addEventListener('abort', onAbort, { once: true })

    try {
      if (!await sendApprovalCard(id, pending, fileApprovalCard(file, sending.byteLength, id))) {
        settleApproval(id, 'cancelled')
        pendingApprovals.delete(id)
        return 'The approval card could not be sent to this chat, so the file was not sent either.'
      }
      const outcome = await settled
      if (outcome === 'allowed-once') return undefined
      if (expired) {
        return `Nobody in this chat approved sending that file within ${TIMEOUT_MINUTES} minutes, so it was `
          + 'not sent. It was not refused — say what the file contains in your reply instead.'
      }
      if (outcome === 'rejected') {
        return 'Someone in this chat rejected sending that file, so it was not sent. '
          + 'Do not offer it again unless they ask for it.'
      }
      return 'The request to send that file was withdrawn before anyone decided, so it was not sent.'
    } finally {
      clearTimeout(timer)
```

</details>

**依据 8 · 源码核查**：[src/bridge.ts:2028-2038](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L2028-L2038)

每群待审上限3。

<details>
<summary>查看原文（11行）</summary>

```text
  const holdFileSend = (chatId: string): boolean => {
    const held = heldFileSends.get(chatId) ?? 0
    if (held >= MAX_PENDING_FILE_SENDS) return false
    heldFileSends.set(chatId, held + 1)
    return true
  }

  /**
   * Give one slot back, once the buffer it accounted for is off the heap.
   * @param chatId - the chat the claim was taken against.
   */
```

</details>

**依据 9 · 源码核查**：[src/files.ts:340-389](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/files.ts#L340-L389)

下载返回bytesWritten后按单文件/消息预算检查、丢弃并扣预算；失败清残留。

<details>
<summary>查看原文（50行）</summary>

```text
  // enforces cannot drift apart.
  const messageCeiling = options.maxFileBytes * MESSAGE_BYTES_FACTOR
  let budget = messageCeiling
  for (const [index, resource] of resources.entries()) {
    const fileName = claimFileName(claimed, sanitizeFileName(resource.fileName))
    const destination = join(directory, fileName)
    try {
      const { contentType, bytesWritten } = await port.downloadResourceToFile(
        msg.messageId,
        resource.fileKey,
        downloadTypeOf(resource.type),
        destination,
      )
      if (bytesWritten > options.maxFileBytes) {
        await discardFile(destination, options.report)
        skipped.push(
          `（文件 ${fileName} 有 ${formatBytesForChat(bytesWritten)}，`
          + `超过单个文件上限 ${formatBytesForChat(options.maxFileBytes)}，未保存）`,
        )
        continue
      }
      if (bytesWritten > budget) {
        // The message total is a ceiling, not a hint: the file that would break
        // it goes back off the disk, and everything behind it stays undownloaded.
        await discardFile(destination, options.report)
        skipped.push(
          `（单条消息总量上限 ${formatBytesForChat(messageCeiling)} 已用尽，`
          + `还有 ${resources.length - index} 个文件未保存）`,
        )
        break
      }
      budget -= bytesWritten
      landed.push({
        fileKey: resource.fileKey,
        type: resource.type,
        path: destination,
        bytes: bytesWritten,
        ...contentType === undefined ? {} : { contentType },
        fileName,
      })
    } catch (error) {
      const detail = failureDetail(error)
      // A half-streamed file is indistinguishable from a complete one once it
      // sits in the workspace, so the remains of a failed download go away.
      await discardFile(destination, options.report)
      options.report(`lark-channel: downloading ${fileName} of message ${msg.messageId} failed: ${detail}`)
      skipped.push(`（文件 ${fileName} 下载失败：${detail}）`)
    }
  }

```

</details>

**依据 10 · 源码核查**：[src/files.ts:232-239](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/files.ts#L232-L239)

discardFile实际unlink，非ENOENT失败日志保留。

```text
async function discardFile(path: string, report: (line: string) => void): Promise<void> {
  await unlink(path).catch((error: unknown) => {
    // Nothing there is the outcome asked for, not a failure: a download that
    // died before it created the file leaves nothing to remove.
    if ((error as { code?: unknown } | null)?.code === 'ENOENT') return
    report(`lark-channel: removing ${path} failed, so it stays in the workspace: ${failureDetail(error)}`)
  })
}
```

#### 缺口

- SDK下载取消/硬资源限制、并发文件替换及平台丢响应后的真正送达去重没有独立材料。
  **影响**：不能将大小/路径校验当完整DLP或保证无重复外发，需控制目录和群边界。
  **进一步探讨**：在无秘密文件目录测超限/删失败/改文件/审批中取消及发送丢响应，比较原buffer与真正接收记录。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 凭据、常驻部署和恢复的全周期负担由谁承担？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

首次需要飞书/Lark应用/租户可见范围与权限、DSH机器与模型、Node^22.19或>=24及可用SDK连接。CLI可创建profile和扫码配置，macOS用launchd、有systemctl的Linux用systemd，否则前台；关闭终端后常驻的能力也意味着停止要管supervisor而非只关窗口。模型任务可执行shell，Host沙箱/审批仍是核心边界。README最低Host声明较宽，本次未逐Host验证结构接口，不能把任意新旧版本可用当结果。

App Secret有credentials服务时存引用，缺provider或set失败会明确降级保留settings；旧secret迁移只有引用写入/设置清空成功才完成。手工环境注入的App ID/Secret会传入serviceEnvironment，不能笼统称服务文件永不含应用secret；模型key不在这段unit变量中，但Host凭据实现未全审。/new epoch也有durable结果，无settings可仅内存，重启回旧epoch；resume失败会尝试新建并写日志，需要人核历史。

持续代价含模型/平台配额、出站buffer内存、入站磁盘、后台服务、卡片人审和版本/应用权限维护。watchdog在重连未完成时按退避和可补充quota重建，是可观察的恢复机制而非网络/平台永久可用。升级latest和实例remove保留设置/凭据都要另管。当前可受限试用，先独立应用/非敏感workspace、指定sender/group/approvers/roots，关文件和图像，测私聊只读任务到审批后再考虑群/文件；若非预期成员能驱动、回执无法对齐或恢复丢上下文就停服务/撤应用权限，回终端核任务。不把常驻、日志或命令颜色当验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:21-25](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/package.json#L21-L25)

Node条件。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "tsc -b && tsdown",
```

**依据 2 · 源码核查**：[src/provision.ts:293-316](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/provision.ts#L293-L316)

supervisor与unit路径。

<details>
<summary>查看原文（24行）</summary>

```text
export function supervisorKind(platform: NodeJS.Platform = process.platform): 'launchd' | 'systemd' | undefined {
  if (platform === 'darwin') return 'launchd'
  if (platform === 'linux' && whichSync('systemctl') !== undefined) return 'systemd'
  return undefined
}

/** The harness home the supervised process will read. */
export function dshHome(): string {
  return process.env.DSH_HOME ?? join(homedir(), '.dsh')
}

/** Where a supervised run writes its console output. */
export function logPath(): string {
  return join(homedir(), '.dsh-lark-channel.log')
}

/** Absolute path of the unit file this platform uses. */
export function unitPath(platform: NodeJS.Platform = process.platform): string {
  return platform === 'darwin'
    ? join(homedir(), 'Library', 'LaunchAgents', `${SERVICE_LABEL}.plist`)
    : join(homedir(), '.config', 'systemd', 'user', 'dsh-lark.service')
}

/**
```

</details>

**依据 3 · 源码核查**：[src/provision.ts:376-384](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/provision.ts#L376-L384)

环境输入App Secret可进入服务变量。

```text
/** Environment every unit sets, in a stable order so a rewrite is a no-op. */
function serviceEnvironment(spec: ServiceSpec): ReadonlyArray<readonly [string, string]> {
  const variables: Array<readonly [string, string]> = [['PATH', servicePath(spec.dsh)]]
  if (spec.dshHome !== undefined) variables.push(['DSH_HOME', spec.dshHome])
  if (spec.credentials !== undefined) {
    variables.push(['LARK_APP_ID', spec.credentials.appId], ['LARK_APP_SECRET', spec.credentials.appSecret])
  }
  return variables
}
```

**依据 4 · 源码核查**：[src/credentials.ts:122-138](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/credentials.ts#L122-L138)

缺provider/写失败降级settings。

<details>
<summary>查看原文（17行）</summary>

```text
export async function storeAppSecret(
  credentials: HostCredentials | undefined,
  secret: string,
  report: (line: string) => void,
  ref: string = APP_SECRET_REF,
): Promise<SecretStored> {
  if (credentials === undefined) return { inSettings: true }
  try {
    await credentials.set(ref, secret)
    return { ref, inSettings: false }
  } catch (error) {
    // Worth a line rather than a throw: a bot that onboarded is more use than
    // one that refused to, and the operator can move the secret later.
    report(`lark-channel: storing the app secret as "${ref}" failed (${String(error)}); keeping it in settings`)
    return { inSettings: true }
  }
}
```

</details>

**依据 5 · 源码核查**：[src/credentials.ts:155-172](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/credentials.ts#L155-L172)

迁移引用/清inline需持久成功。

<details>
<summary>查看原文（18行）</summary>

```text
  config: { readonly appSecret?: string | undefined; readonly appSecretRef?: string | undefined },
  persist: (patch: object) => Promise<boolean>,
  report: (line: string) => void,
  ref: string = APP_SECRET_REF,
): Promise<string | undefined> {
  const secret = config.appSecret
  if (secret === undefined || secret === '') return undefined
  if (credentials === undefined) return undefined
  const stored = await storeAppSecret(credentials, secret, report, ref)
  if (stored.ref === undefined) return undefined
  const persisted = await persist({ appSecret: '', appSecretRef: stored.ref }).catch((error: unknown) => {
    report(`lark-channel: moving the app secret out of settings failed: ${String(error)}`)
    return false
  })
  if (!persisted) return undefined
  report(`lark-channel: moved the app secret out of user settings; it is now the credential "${stored.ref}"`)
  return stored.ref
}
```

</details>

**依据 6 · 源码核查**：[src/epoch.ts:61-81](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/epoch.ts#L61-L81)

新epoch持久失败单独告知。

<details>
<summary>查看原文（21行）</summary>

```text

  constructor(options: ChatEpochsOptions = {}) {
    this.entries = new Map(Object.entries(options.entries ?? {}))
    this.persist = options.persist ?? (async () => false)
    this.report = options.report ?? (() => {})
  }

  /**
   * The epoch one base session id runs on.
   * @param baseId - the id that conversation derives at epoch zero.
   * @returns the epoch; zero for a conversation that never started over.
   */
  epochOf(baseId: string): number {
    const entry = this.entries.get(baseId)
    if (entry === undefined || entry === DEFAULT_MARKER) return 0
    const parsed = Number.parseInt(entry, 10)
    // A malformed entry reads as the first epoch rather than throwing: a
    // hand-edited settings file must not be able to break every message.
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 0
  }

```

</details>

**依据 7 · 源码核查**：[src/liveness.ts:123-175](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/liveness.ts#L123-L175)

重建/退避与quota隔离恢复。

<details>
<summary>查看原文（53行）</summary>

```text
 * One cycle: `reconnecting` arms a deadline; `reconnected` disarms it; a
 * deadline that fires with the transport still down starts rebuild attempts
 * under capped backoff that never stop on their own — the silent-give-up
 * being cured here must not be reintroduced by the cure. Every transition is
 * reported, because the incident this exists for was diagnosed off a log that
 * simply stopped.
 * @param options - deadline, backoff, and the transport operations.
 * @returns the watchdog handle.
 */
export function createReconnectWatchdog(options: WatchdogOptions): ReconnectWatchdog {
  let phase: Phase = 'idle'
  let timer: NodeJS.Timeout | undefined
  let attempt = 0
  let disposed = false

  const disarm = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  /** A pending watchdog timer must never be what keeps a process alive. */
  const schedule = (ms: number, task: () => void): void => {
    timer = setTimeout(task, ms)
    timer.unref?.()
  }

  const settle = (): void => {
    phase = 'idle'
    attempt = 0
    disarm()
  }

  const now = options.now ?? Date.now

  /**
   * Hold off until the budget refills. Not a give-up: the wake is scheduled,
   * the reason is stated, and the cycle resumes on its own.
   */
  const quarantine = (freeAt: number | undefined): void => {
    phase = 'quarantined'
    const waitMs = freeAt === undefined ? options.deadlineMs : Math.max(1000, freeAt - now())
    options.report(
      `lark-channel: rebuild budget exhausted — pausing reconnect attempts for `
      + `${Math.round(waitMs / 1000)}s to avoid burning the platform's connection quota`,
    )
    schedule(waitMs, () => {
      if (disposed || phase !== 'quarantined') return
      options.report('lark-channel: rebuild budget refilled; resuming')
      phase = 'rebuilding'
      void attemptRebuild()
    })
```

</details>

**依据 8 · 作者声明**：[README.md:106-138](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/README.md#L106-L138)

作者服务/升级/删除实例保留凭据。

<details>
<summary>查看原文（33行）</summary>

````text
dsh-lark-channel restart
dsh-lark-channel stop
```

用 `npx` 启动的话，这些命令同样要带 `npx dsh-lark-channel@latest` 前缀——工具会按你实际的启动方式打印提示，读到什么就能直接粘贴。

升级：

```sh
dsh-lark-channel upgrade
```

它会装上最新的 CLI 并在新版本上重启机器人。用 npx 的话不需要这一步，`npx dsh-lark-channel@latest start` 本来就是最新。有新版本时，`start` 和 `status` 会顺带提醒你一行。

连接异常时，插件会在限额和退避控制下自动重建 WebSocket，避免进程仍在但机器人已经静默离线。

### 添加更多 Agent

给第二个飞书应用添加一套独立的 Agent：

```sh
dsh-lark-channel add reviewer
```

命令会写入新实例、重启服务并显示二维码。扫码后，这个机器人拥有自己的设置、App Secret 和 session，不会与第一个机器人共享上下文。

把两个机器人加入同一个群后，它们可以通过 @ 把回合交给对方。例如，让一个 Agent 完成修改后 @ 另一个 Agent 复核，后者也可以 @ 回去要求调整。默认最多连续进行 6 个机器人轮次；任何人发言都会恢复额度。需要移除时：

```sh
dsh-lark-channel remove reviewer
```

移除会保留该实例的凭据和设置，之后用同一个名字重新添加即可恢复。
````

</details>

**依据 9 · 源码核查**：[src/epoch.ts:84-128](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/epoch.ts#L84-L128)

startNew先内存推进，persist失败false，durable返回；runNewCommand释放并告知非持久。

<details>
<summary>查看原文（45行）</summary>

```text
   * @param baseId - the id that conversation derives at epoch zero.
   * @returns the new epoch, and whether it will survive a restart.
   */
  async startNew(baseId: string): Promise<EpochChange> {
    const epoch = this.epochOf(baseId) + 1
    this.entries.set(baseId, String(epoch))
    const durable = await this.persist({ chatEpochs: { [baseId]: String(epoch) } }).catch((error: unknown) => {
      this.report(`lark-channel: persisting the new session failed: ${String(error)}`)
      return false
    })
    if (!durable && !this.warnedNotDurable) {
      this.warnedNotDurable = true
      this.report('lark-channel: new sessions are in-memory only (no settings service); they reset on restart')
    }
    return { epoch, durable }
  }
}

/**
 * Fold an epoch into the session id a conversation derives.
 * @param baseId - the id at epoch zero.
 * @param epoch - the conversation's epoch.
 * @returns the id, unchanged at epoch zero.
 */
export function epochSessionId(baseId: string, epoch: number): string {
  return epoch <= 0 ? baseId : `${baseId}--e${epoch}`
}

/**
 * Run `/new` and produce the chat reply.
 * @param baseId - the conversation's id at epoch zero.
 * @param epochs - the epoch state.
 * @param release - disposes the conversation's current agent; awaited first.
 * @returns markdown for the chat.
 */
export async function runNewCommand(
  baseId: string,
  epochs: ChatEpochs,
  release: () => Promise<void>,
): Promise<string> {
  const result = await epochs.startNew(baseId)
  await release()
  const durability = result.durable ? '' : '\n（本部署未组合 settings，重启后会回到上一个会话。）'
  return '🤖 已开新会话，下一条消息从空白上下文开始。\n之前的记录仍在，工作区和模型设置不变。' + durability
}
```

</details>

**依据 10 · 源码核查**：[src/bridge.ts:1683-1690](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L1683-L1690)

真实/new命令清pick并调用runNewCommand。

```text
          }
          reply = { markdown: await runWorkspaceCommand(channelCommand, msg.content, key, chatWorkspaces, moved) }
        } else if (channelCommand === NEW_COMMAND) {
          // Same reason, more bluntly: `/new` asks for a session that has no
          // history, which is the opposite of continuing one.
          await chatSessionPicks.set(key, undefined)
          reply = { markdown: await runNewCommand(chatWorkspaces.baseSessionIdFor(key), chatEpochs, release) }
        } else if (channelCommand === MODEL_COMMAND) {
```

**依据 11 · 源码核查**：[src/bridge.ts:768-774](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L768-L774)

ChatEpochs实际注入config.chatEpochs/persistState。

```text

  /** Which directory each conversation runs in, and the session id that pair owns. */
  const chatEpochs = new ChatEpochs({
    entries: config.chatEpochs,
    persist: persistState,
    report: notify,
  })
```

**依据 12 · 源码核查**：[src/runtime.ts:194-213](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/runtime.ts#L194-L213)

persistState默认false并传入installBridge。

<details>
<summary>查看原文（20行）</summary>

```text
   */
  // Durable plugin state (onboarded credentials, workspace switches) goes
  // through the settings section when one is composed; false tells the writer
  // the value lives in memory only.
  let persistState = async (_patch: object): Promise<boolean> => false

  const start = (resolved: ChannelConfig): void => {
    if (!active || started) return
    started = true
    const authorization = resolveAuthorization(resolved)
    internals.notify(describeAuthorization(authorization))
    installBridge(
      ctx,
      resolved,
      internals.createPort(resolved, authorization),
      internals.notify,
      authorization,
      persistState,
      internals.reconnectDeadlineMs === undefined ? undefined : { deadlineMs: internals.reconnectDeadlineMs },
    )
```

</details>

**依据 13 · 源码核查**：[src/runtime.ts:226-253](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/runtime.ts#L226-L253)

settings注册及scope.update成功返回true，注册失败保持入口配置。

<details>
<summary>查看原文（28行）</summary>

```text
    let persist = async (_app: OnboardedApp): Promise<boolean> => false
    const credentials = ctx.get('credentials') as HostCredentials | undefined
    const settings = ctx.get('settings') as HostSettings | undefined
    if (settings !== undefined) {
      try {
        const scope = settings.register(identity.settingsNamespace, Config, { base: config })
        resolved = resolveConfig(scope.get() as Config)
        persistState = async (patch) => {
          await scope.update(patch)
          return true
        }
        // Onboarding hands the secret to the credentials seam and records only
        // the reference, so the settings document never learns it.
        persist = async (app) => {
          const stored = await internals.storeSecret(credentials, app.appSecret, internals.notify, identity.secretRef)
          return persistState({
            ...app,
            ...stored.ref === undefined ? {} : { appSecretRef: stored.ref },
            // Blanked rather than omitted: the patch deep-merges, so a key is
            // overwritten and never removed, and an empty secret is an absent
            // one everywhere here.
            ...stored.inSettings ? {} : { appSecret: '' },
          })
        }
      } catch (error) {
        ctx.logger.error(
          'settings registration failed; continuing with entry config only: %s',
          error instanceof Error ? error.message : error,
```

</details>

#### 缺口

- 真实租户连接/常驻停止、升级恢复与每合格任务费用/人审开销未验。
  **影响**：不能推荐生产持续采用、任意版本兼容或宣称扫码即零配置/零维护。
  **进一步探讨**：用副本profile和独立应用核重启/撤权/断网/坏历史，统计模型、消息、文件与全部人审/恢复后再决定。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 渠道里什么交付机制值得独立验证？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

已有可复用贡献是消息鉴权先于Agent、聊天/会话绑定、卡片pending单次结算和批准固定buffer；这些是渠道接入上的责任组合，不等新推理或协作算法。关键未知是人能否从聊天回执区分已决定、Host已执行和外部已送达，尤其always预设异步切换与SDK发送丢响应。

未验证方向是把原调用、批准、Host效果和外部交付分别作为任务回执，向聊天只展示可核证据并保持未知；重连或重复消息先核状态，不直接重跑shell/文件发送。相对当前卡片状态/日志，增量是跨Host与IM的同一任务可回查交付，不是更多进度卡；需要SDK可用receipt和持久关联，增加留存隐私、去重及维护成本，不能凭本地ID实现全链exactly-once。

最小实验同任务/预算对照现有卡片与分阶段回执，注入批准后Host失败、预设切换延迟、发送成功后丢响应及重启。测重复执行/外发、误判已交付、人工核对时间和敏感信息留存；若SDK不能提供足够事实则明确未知交人，不自动重试，净收益不成立就停止。方向未实现不计当前贡献，也不能仅因IM渠道存在就推商业需求。

#### 证据与依据

**依据 1 · 源码核查**：[src/bridge.ts:1800-1833](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L1800-L1833)

本地单次批准事实。

<details>
<summary>查看原文（34行）</summary>

```text
   * Decide one approval exactly once. The asker is resolved immediately; the
   * card is painted here when it already exists, and by the send's return path
   * when the settlement raced the send — either way exactly one of them does.
   */
  const settleApproval = (
    id: string,
    outcome: HostApprovalOutcome,
    decidedBy?: string,
    repaint = true,
  ): boolean => {
    const pending = pendingApprovals.get(id)
    if (pending === undefined || pending.state === 'settled') return false
    pending.state = 'settled'
    pending.outcome = outcome
    pending.decidedBy = decidedBy
    pending.removeAbort?.()
    pending.settle(outcome)
    if (!repaint) {
      // The caller paints it — a click answers with the decided card, which is
      // the one repaint path that cannot fail unnoticed.
      pendingApprovals.delete(id)
      return true
    }
    if (pending.messageId !== undefined) {
      pendingApprovals.delete(id)
      spawn(port.updateCard(pending.messageId, pending.paint(outcome, decidedBy)).catch(reportSendFailure))
    }
    return true
  }

  /**
   * Publish one registered approval's card and settle the race the send itself
   * creates: a decision can arrive — an abort, a timeout, disposal — while the
   * platform is still rendering the card, and the asker is answered by then. The
```

</details>

**依据 2 · 源码核查**：[src/bridge.ts:2645-2667](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L2645-L2667)

批准后预设切换仍有独立结果。

<details>
<summary>查看原文（23行）</summary>

```text
  const openSession = async (pending: PendingApproval, evt: CardActionEvent): Promise<void> => {
    const agent = pending.agent
    if (agent === undefined) {
      notify('lark-channel: cannot open the session — the approval carried no agent')
      return
    }
    notify(`lark-channel: ${evt.operator.openId} opened ${pending.chatId} up to ${UNCONFINED_PRESET}`)
    // Said before it runs, because it runs from the agent's idle phase and an
    // approval is answered mid-turn by construction: the switch lands after
    // this turn does, and silence until then would read as nothing happening.
    await port.send(pending.chatId, { text: presetHeldText(UNCONFINED_PRESET) }).catch(reportSendFailure)
    const landed = await applyPreset(agent.session.id, agent, UNCONFINED_PRESET)
    // Dropped means the conversation moved on — `/new`, `/cd`, disposal — and
    // it has already been told what it asked for; a failure line here would be
    // about a switch nobody is still waiting for.
    if (landed.cancelled === true) return
    await port
      .send(pending.chatId, {
        text: landed.ok ? PRESET_OPENED : presetFailedText(UNCONFINED_PRESET, landed.detail),
      })
      .catch(reportSendFailure)
  }

```

</details>

**依据 3 · 源码核查**：[src/bridge.ts:2076-2114](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/bridge.ts#L2076-L2114)

外部send另有调用/失败面。

<details>
<summary>查看原文（39行）</summary>

```text
  const offerFile = async (
    binding: ChatBinding,
    sessionId: string,
    file: OutboundFile,
    signal?: AbortSignal,
  ): Promise<string | undefined> => {
    // First, so that everything after this point is about bytes that exist.
    let bytes: Buffer
    try {
      bytes = await readOutboundFile(file)
    } catch (error) {
      // Scrubbed, because an fs failure quotes the absolute path it was given and
      // this sentence goes to the model — which `describeRefusalForModel` is
      // careful never to hand a path it did not type itself.
      return `That file could not be read: ${describeReadFailure(error, file)}`
    }
    if (binding.chatType !== 'p2p') {
      const refused = await askFileSend(binding, file, bytes, signal)
      if (refused !== undefined) return refused
    }
    try {
      // A buffer, never a path (ADR 0004), and through the transport's own media
      // path rather than a hand-rolled upload (ADR 0005).
      await port.send(
        binding.chatId,
        { file: { source: bytes, fileName: file.fileName } },
        replyOptions(aimBySession.get(sessionId)),
      )
    } catch (error) {
      // The SDK's own code is the actionable half — `rate_limited` invites a
      // retry, `permission_denied` never will — so it survives to the model
      // instead of being flattened into "the send failed".
      const code = channelErrorCode(error)
      const detail = failureDetail(error)
      notify(`lark-channel: sending ${file.fileName} to ${binding.chatId} failed [${code ?? 'unknown'}]: ${detail}`)
      return `The chat platform refused the upload [${code ?? 'unknown'}]: ${detail}`
    }
    return undefined
  }
```

</details>

**依据 4 · 源码核查**：[src/session.ts:414-438](https://github.com/omdsh-dev/dsh-lark/blob/632807d9abafbb866a5e208a0298eff21c7856d1/src/session.ts#L414-L438)

恢复失败不等原任务未发生。

<details>
<summary>查看原文（25行）</summary>

```text
   * Reach the agent for one key: an already live one, else the stored session,
   * else a fresh one.
   * @param key - the conversation key.
   * @returns the first rung that yielded an agent, with its ownership.
   * @throws when creation — the last rung — also fails.
   */
  private async reach(key: string): Promise<OpenedSession> {
    const sessionId = this.idFor(key)
    const live = this.ladder.lookup(sessionId)
    // Whoever created a live agent still owns taking it down.
    if (live !== undefined) return { handle: live, owned: false }
    try {
      return { handle: await this.ladder.resume(sessionId), owned: true }
    } catch (error) {
      // The registry offers no existence probe, so a rejection is the only
      // signal that this conversation was never served here — and an unreadable
      // log looks exactly the same. Reporting it keeps a corrupt session log
      // from passing silently as first contact.
      this.ladder.report(
        `lark-channel: resuming session for ${key} failed, starting a new one: ${failureDetail(error)}`,
      )
    }
    return { handle: await this.ladder.create(sessionId), owned: true }
  }
}
```

</details>

#### 缺口

- 跨Host/SDK任务回执是否可获得充分后置事实与净人审收益未知。
  **影响**：不能承诺当前跨系统exactly-once或未来方向已成立。
  **进一步探讨**：预设重复执行/误判与隐私成本阈值做上述对照，事实不足保持未知并交人工。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
