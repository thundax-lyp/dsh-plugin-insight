# NekroNXT

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[86d0710](https://github.com/NekroAI/nekro-nxt/tree/86d0710ed56f17f867cdf513a9bfcb487b2175b7)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NekroAI/nekro-nxt)
<!-- END META -->

> **功能**：以 DSH 为内核的群聊智能体系统，提供频道绑定、入站去重、按频道递交和带回执的外发流程。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持把群聊事件、绑定与递交集中管理。[Q03](#research-q03) 证明外发有分片状态和人工处理路径。运营节时、模型响应质量与平台实际送达待核。

> **主要限制**：[Q03](#research-q03) 发送未知仍可能被人工重复发送，部分已送达会出现在聚合状态内，核对须看每个分片。[Q04](#research-q04) 外部账号、管理权限和数据退出需要由运营方负责。

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
  - [Q01 · 哪类群聊协作需要 NekroNXT，与独立 DSH 会话有何区别？](#detail-section-11)
  - [Q02 · 一条入站群消息怎样被记录和送入 Agent？](#detail-section-12)
  - [Q03 · 外发、重试及权限能证明到什么程度？](#detail-section-13)
  - [Q04 · 部署和退出的模型、账号、数据与人时怎样盘点？](#detail-section-14)
  - [Q05 · 送达未知时怎样验证能否避免重复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 需要持续跟进多人频道对话的群运营或协作团队可设置绑定。以人工转贴到独立 DSH 会话作为对照。

[Q01](#research-q01) 比较人工转贴与频道绑定在遗漏、错投和人时上的差异。[Q05](#research-q05) 以当前人工确认及重试作为投递对账基线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 频道 Agent | 按绑定与触发递交 DSH | 需要可运行 Agent 和模型 |
| 入站持久化 | 按频道与去重键记录 | 稳定请求 ID 才能复用键 |
| 外发和恢复 | 按分片显示回执及未知 | 平台侧送达需另核，人工重试可重复 |
| 管理路由 | 设备认证和写请求核验 | 管理边依密钥配置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 宿主及数据根 | 服务端必需 | 承载运行时和持久数据 | 端口或租约失败则检查并停机 |
| 管理密钥 | 容器部署或非环回必需 | 挂载管理边与登录 | 服务拒绝公开启动 |
| 模型账号和 API Key | 模型对话需要 | 执行 Agent 轮次 | 检查供应商配置，暂停自动对话 |
| 适配器和平台账号 | 外部群需要 | 连接平台并匹配频道 | 先留在内置频道 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 运营者创建隔离根和模型配置 | 启动健康，管理入口符合绑定范围 |
| 对话 | 用户在内置频道发送，服务提交与递交 | 核对去重、绑定、Admission 和 DSH 消息 |
| 外发 | 智能体用通信工具，运营者核对回执 | 检查分片与真实频道，未知先对账 |
| 退出 | 运营者停服务、对账、清理与撤销 | 确认未结项归档及数据策略 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主、数据卷和模型账号，费用未测 | 配密钥、模型、权限、一个频道 | Compose 给出端口和卷，启动时间未知 |
| 持续 | 模型 token、数据和日志空间、平台账号 | 续期、看群内回复、审阅异常 | 没有账单或使用规模 |
| 失败恢复 | 重启、恢复副本、可能的模型重跑 | 查租约、连接、分片回执和重复 | 计划与未知区分可见，恢复人时未知 |
| 退出 | 备份和保留空间 | 停接入、停进程、保留或清除数据、撤销凭据 | 工具目录有备份例外，真实留存待查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多人上下文 | 频道入站、去重、绑定后递交 | 代表任务完成率、模型轮次延迟 |
| 送达可追踪 | 分片回执、未知和人工处理 | 平台真实送达、已读和误重发率 |
| 部署与退出 | 数据根租约、管理边和停止路径 | 资源、升级恢复和运营人时 |

> **思考**：[Q03](#research-q03) 发送未知仍可能被人工重复发送，部分已送达会出现在聚合状态内，核对须看每个分片。[Q04](#research-q04) 外部账号、管理权限和数据退出需要由运营方负责。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持把群聊事件、绑定与递交集中管理。[Q03](#research-q03) 证明外发有分片状态和人工处理路径。运营节时、模型响应质量与平台实际送达待核。

[Q02](#research-q02) 分离频道事实、接纳与 DSH 消息。[Q03](#research-q03) 外发先持久化，恢复明确区分 planned 和 sending。未知的人工重发有重复风险。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 发送未知仍可能被人工重复发送，部分已送达会出现在聚合状态内，核对须看每个分片。[Q04](#research-q04) 外部账号、管理权限和数据退出需要由运营方负责。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 限定内置频道和隔离数据根，先确认模型与停止流程。[Q03](#research-q03) 记录回执与真实频道差异，未知分片先人工核对；无法核对时停用外部连接。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表消息从内置入口到 DSH 及适配器回执。实际群聊响应、外部平台送达、多租户边界及部署恢复未验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、apps/server/package.json、apps/server/src/bootstrap.ts、apps/server/src/host-routes-workspace.ts、packages/adapter-web/src/index.ts、apps/server/src/connection-application.ts、packages/core/src/index.ts、packages/storage-sqlite/src/repositories/channels.ts、packages/channel-runtime/src/index.ts、apps/server/src/index.ts、packages/channel-runtime/src/channel-delivery.ts、apps/server/src/workspace-projections.ts、packages/storage-sqlite/src/repositories/projections.ts、apps/server/src/management-edge.ts、docker-compose.yml、apps/server/src/main.ts、docs/guide/server.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 0.8.1 根系统，检查代表 Web 入口、服务端、DSH 与投递。未运行容器、桌面、目标测试、模型或平台。独立扩展和外部适配器只纳入边界。
- 下一步：[Q05](#research-q05) 在隔离实例做入站重复、回执丢失、部分送达、重启和不可对账对照，采集远端写入次数及人工核对时间。

**分析版本**

- **仓库**：[NekroAI/nekro-nxt](https://github.com/NekroAI/nekro-nxt)
- **版本号**：0.8.1（[固定提交 86d0710](https://github.com/NekroAI/nekro-nxt/tree/86d0710ed56f17f867cdf513a9bfcb487b2175b7)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 若平台支持权威回执查询，按连接、频道与分片核对可能减少人工误重发；用回执丢失和部分送达注入验证。

[Q05](#research-q05) 在隔离实例做入站重复、回执丢失、部分送达、重启和不可对账对照，采集远端写入次数及人工核对时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 146 | 11411 | — | — | 283955 |
| .ts | test | 335 | 100306 | 93791 | 2458 | — |
| .mjs | source | 63 | 7876 | 7129 | 330 | — |
| .ts | source | 537 | 141552 | 127020 | 7219 | — |
| .js | source | 5 | 2898 | 2700 | 105 | — |
| .ts | example | 17 | 1808 | 1662 | 113 | — |
| .md | example | 1 | 11 | — | — | 203 |
| .mjs | example | 1 | 14 | 12 | 1 | — |
| .tsx | test | 13 | 9297 | 7245 | 1890 | — |
| .tsx | source | 122 | 39394 | 36755 | 1227 | — |
| .mjs | test | 20 | 2095 | 1935 | 16 | — |

</details>

**活跃度**

[![Issue 未关闭 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=25&color=737b86&logo=github)](https://github.com/NekroAI/nekro-nxt/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 137](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=137&color=737b86&logo=github)](https://github.com/NekroAI/nekro-nxt/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)

暂未获取：近30天关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对 DSH 如何在群聊产品中处理代表消息路径，以及部署和投递状态的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类群聊协作需要 NekroNXT，与独立 DSH 会话有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用对象是需要让智能体在多人频道中持续收集问题并跟进的群运营或协作团队。与用户手动把片段转贴到独立 DSH 会话的流程相比，NekroNXT 把频道绑定、入站记录、向 DSH 递交以及外发记录交给常驻服务。README 提及多平台、群短期上下文与工具期间收消息。固定源码确认的是私有根工作区构建服务端和桌面、服务直接启动并依赖 DSH Agent 库，以及代表频道的入站和工具接线。试用验收需要同一任务下记录哪些消息被纳入、是否进入正确频道、是否需要人工补救。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-21](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/README.md#L7-L21)

作者定位为多平台群聊，DSH 提供运行循环，根系统负责通信与界面。

<details>
<summary>查看原文（15行）</summary>

```text
NekroNXT 是 NekroAI 开发的群聊智能体系统。它把智能体接入你正在使用的即时通信平台。智能体面对的是群聊里持续发生的多人对话，可以理解上下文、使用工具并参与协作。

## 💬 为真实群聊而设计

### 用一套方式连接不同即时通信平台

平台适配器负责登录账号、收发消息和发现频道。你可以把同一个智能体绑定到多个群聊，也可以为不同群聊安排不同智能体。安装新的适配器后，仍按账号、频道和智能体的顺序完成连接。

### 跟得上多人对话

每个群聊拥有独立的消息记录和会话上下文。群成员可以通过提及或预设规则触发智能体。系统先记录工具执行期间到达的新消息，再把这些内容交给智能体的下一步思考。每个群聊只读取自己的短期上下文。

### 由 DSH 提供智能体运行内核

DSH 负责智能体的思考循环、工具执行、会话持久化、上下文压缩、模型接入和扩展运行。NekroNXT 负责即时通信接入、频道管理、消息投递记录和产品界面。
```

</details>

**依据 2 · 源码核查**：[package.json:2-19](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/package.json#L2-L19)

根 manifest 为私有工作区和产品构建入口，标称 0.8.1。

<details>
<summary>查看原文（18行）</summary>

```text
  "name": "nekro-nxt",
  "version": "0.8.1",
  "private": true,
  "license": "AGPL-3.0-only",
  "description": "NekroNXT：基于 DeepSeek Harness（DSH）的多平台群聊智能体系统｜A DSH-powered multi-platform group-chat agent system",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "dev": "pnpm -r --parallel --if-present run dev",
    "dsh:check-update": "node scripts/check-dsh-update.mjs",
    "desktop:preview": "node scripts/release-desktop.mjs preview",
    "desktop:stable": "node scripts/release-desktop.mjs stable",
    "release": "node scripts/stable-release.mjs",
    "packages:promote": "node scripts/promote-packages.mjs",
    "dist:server": "node scripts/build-server-image.mjs",
```

</details>

**依据 3 · 源码核查**：[apps/server/package.json:17-30](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/package.json#L17-L30)

服务端独立启动，直接依赖 DSH Agent 与 Agent Loop alpha 库。

<details>
<summary>查看原文（14行）</summary>

```text
  "scripts": {
    "build": "tsdown",
    "dev": "tsx watch --clear-screen=false --exclude '../../data/**' --include '../../package.json' --include '../../packages/*/dist/*.mjs' src/main.ts",
    "start": "node dist/main.mjs",
    "test": "vitest run --root ../.. apps/server/tests",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.5-alpha.1",
    "@deepseek-ai/cordis-plugin-loader": "1.0.6-alpha.1",
    "@deepseek-ai/dsh-agent": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-agent-loop": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-app-boot": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-atomic-write": "0.2.1-alpha.2",
```

</details>

**依据 4 · 源码核查**：[apps/server/src/bootstrap.ts:1543-1560](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/bootstrap.ts#L1543-L1560)

启动时创建 Channel Runtime，连接宿主驱动、命令与适配器实例。

<details>
<summary>查看原文（18行）</summary>

```text
      const channels = new ChannelRuntime(core, repository, repository, host, {
        inboundHooks,
        onOutboundSettled: (snapshot) => outboundReference.current?.settled(snapshot),
        sanitizeInbound: (event) => redactInboundEvent(secrets, event),
        commands: {
          commitInbound: (event) => commandReference.current?.commitInbound(event) ?? core.appendInbound(event),
          excludes: (event) => commandReference.current?.excludes(event) ?? false,
          project: (event) => commandReference.current?.project(event) ?? event,
        },
        deferAdmission: options.deferAdmission ?? false,
        canAdmitAgent: (agentId) => host.canRunAgent(agentId),
        now,
        nextUlid,
        idleRolloverMs: options.idleRolloverMs ?? 6 * 60 * 60 * 1000,
        pendingRollover: dataRootMoveRollover,
        messageGapMs: (_channelId, parts) =>
          messageGapMs(readMessagePacing({ get: (key) => repository.getSystemSetting(key) }), parts),
        resolveAdapter: (id): AdapterConnectionRuntime | undefined => adapterRuntimes.get(id),
```

</details>

#### 缺口

- 真实群聊任务完成率、群活跃度和运营时间未测。
  **影响**：能说明接线与新增工作流，收益仍取决于实际平台和群消息负载。
  **进一步探讨**：用同一组代表请求对比人工转贴与频道绑定，检查上下文遗漏、错投和用时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一条入站群消息怎样被记录和送入 Agent？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

内置 Web 消息入口检查资源并把客户端事件 ID 传给适配器，适配器生成 web-event 去重键。连接端口校验连接、频道及活动，核心追加路径还校验成员和资源。SQLite 在事务中按频道与去重键写入，冲突返回已有事件；客户端漏给 ID 时 HTTP 路由以当前毫秒代填，所以重复请求应复用一个稳定客户端 ID。运行时先提交，只有新插入且未排除的事件才走绑定和触发。实际交给 DSH 前重新核对绑定和事件是否仍存在，跳过只有隐藏事件的候选，记录 pending Admission。根据 DSH 会话当时状态选择 inject 或 followup，写入源事件 ID，并在 DSH 刷新会话后完成 Admission。入口确认事实已记录或流程已递交，群成员何时看到回复需单独核验。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/host-routes-workspace.ts:1236-1252](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/host-routes-workspace.ts#L1236-L1252)

内置频道 HTTP 入口实际调用 postMessage，缺失 ID 时用时间生成。

<details>
<summary>查看原文（17行）</summary>

```text
        validateComposerAssets(runtime, typedChannelId, parsed.parts)
        if (channel.kind === 'internal') {
          const result = await runtime.internalChannel.postMessage({
            channelId: typedChannelId,
            clientEventId: parsed.clientEventId ?? `http-${Date.now()}`,
            parts: parsed.parts,
            ...(parsed.senderMemberId === undefined ? {} : { senderMemberId: parsed.senderMemberId }),
          })
          writeJson(
            res,
            200,
            HostApiContracts.sendChannelMessage.parseResponse({
              channelEventId: result.channelEventId,
              inserted: result.inserted,
            }),
          )
          return
```

</details>

**依据 2 · 源码核查**：[packages/adapter-web/src/index.ts:101-122](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/adapter-web/src/index.ts#L101-L122)

Web 适配器校验运行状态与 ID，并构造频道事件及去重键。

<details>
<summary>查看原文（22行）</summary>

```text
  postMessage(message: WebInboundMessage): Promise<InboundCommitResult> {
    if (!this.#running) return Promise.reject(new Error('Web Adapter connection is not running.'))
    if (message.clientEventId.trim().length === 0)
      return Promise.reject(new Error('Web clientEventId must not be empty.'))
    const receivedAt = message.receivedAt ?? this.#context.now()
    return this.#context.acceptChannelInbound({
      connectionId: this.#context.connectionId,
      channelId: message.channelId,
      adapterKey: WEB_ADAPTER_KEY,
      platformEventId: message.clientEventId,
      platformMessageId: message.clientEventId,
      kind: 'message-created',
      ...(message.senderMemberId === undefined ? {} : { senderMemberId: message.senderMemberId }),
      parts: [...message.parts],
      assetOccurrences: message.parts.flatMap((part, partIndex) =>
        messagePartAssetIds(part).map((assetId) => ({ partIndex, assetId })),
      ),
      platformTimestamp: receivedAt,
      receivedAt,
      dedupeKey: `web-event:${message.clientEventId}`,
      ...(message.replyToBot === undefined ? {} : { facts: { replyToBot: message.replyToBot } }),
    })
```

</details>

**依据 3 · 源码核查**：[apps/server/src/connection-application.ts:1049-1073](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/connection-application.ts#L1049-L1073)

连接上下文检查连接与频道归属，拒绝停用中的适配器。

<details>
<summary>查看原文（25行）</summary>

```text
      acceptChannelInbound: async (event) => {
        if (event.connectionId !== connectionId) return rejectEvent('Channel event belongs to another connection.')
        const adapterKey = this.ports.core.getConnection(connectionId)?.adapterKey
        if (adapterKey && this.#quiescingAdapterKeys.has(adapterKey)) {
          throw new Error('Adapter is quiescing; event rejected.')
        }
        const descriptor = resolveOwnedDescriptor(event.adapterKey)
        const channel = this.ports.core.getChannel(event.channelId)
        if (!channel || channel.connectionId !== connectionId) {
          return rejectEvent('Channel event belongs to another connection.')
        }
        if (event.activityKey !== undefined) {
          const activity = descriptor.activities.find((candidate) => candidate.key === event.activityKey)
          if (activity?.scope !== 'channel') return rejectEvent(`Undeclared channel activity: ${event.activityKey}`)
          if (activity.channelKinds?.includes(channel.kind) !== true) {
            return rejectEvent(`Activity ${event.activityKey} does not apply to this channel kind.`)
          }
        }
        this.#lastInboundByConnection.set(connectionId, {
          channelId: event.channelId,
          ...(event.platformMessageId === undefined ? {} : { platformMessageId: event.platformMessageId }),
          receivedAt: event.receivedAt,
        })
        return this.ports.channels.acceptChannelInbound(event)
      },
```

</details>

**依据 4 · 源码核查**：[packages/core/src/index.ts:1737-1751](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/core/src/index.ts#L1737-L1751)

追加入口校验成员与频道归属。

<details>
<summary>查看原文（15行）</summary>

```text
  appendInbound(event: AdapterChannelInboundEvent): AppendChannelEventCommit {
    const connection = this.#repository.getConnection(event.connectionId)
    if (!connection || connection.adapterKey !== event.adapterKey) {
      throw new Error(`Inbound adapter does not own connection ${event.connectionId}.`)
    }
    const channel = this.#repository.getChannel(event.channelId)
    if (!channel || channel.connectionId !== event.connectionId) {
      throw new Error(`Inbound channel ${event.channelId} does not belong to connection ${event.connectionId}.`)
    }
    if (event.senderMemberId !== undefined) {
      const member = this.#repository.getChannelMember(event.senderMemberId)
      if (!member || member.channelId !== event.channelId) {
        throw new Error(`Inbound sender ${event.senderMemberId} does not belong to channel ${event.channelId}.`)
      }
    }
```

</details>

**依据 5 · 源码核查**：[packages/storage-sqlite/src/repositories/channels.ts:755-785](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/storage-sqlite/src/repositories/channels.ts#L755-L785)

SQLite 事务处理插入、资源关联和去重冲突。

<details>
<summary>查看原文（31行）</summary>

```text
    appendChannelEvent(candidate, occurrences = []): AppendChannelEventCommit {
      const inserted = database.transaction(
        (tx) => {
          const changed = tx
            .insert(channelEvents)
            .values(candidate)
            .onConflictDoNothing({ target: [channelEvents.channelId, channelEvents.dedupeKey] })
            .run().changes
          if (changed === 1 && occurrences.length > 0) {
            tx.insert(assetOccurrences)
              .values(
                occurrences.map(({ partIndex, assetId }) => ({
                  channelEventId: candidate.id,
                  partIndex,
                  assetId,
                })),
              )
              .run()
          }
          return changed === 1
        },
        { behavior: 'immediate' },
      )
      if (inserted) return { event: candidate, inserted: true }
      const row = database
        .select()
        .from(channelEvents)
        .where(and(eq(channelEvents.channelId, candidate.channelId), eq(channelEvents.dedupeKey, candidate.dedupeKey)))
        .get()
      if (row === undefined) throw new Error('Channel Event dedupe conflict has no existing row.')
      return { event: toEvent(row), inserted: false }
```

</details>

**依据 6 · 源码核查**：[packages/channel-runtime/src/index.ts:743-762](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/channel-runtime/src/index.ts#L743-L762)

提交后区分命令、重复、绑定和接纳状态。

<details>
<summary>查看原文（20行）</summary>

```text
  async acceptChannelInbound(input: AdapterChannelInboundEvent): Promise<InboundCommitResult> {
    const event = this.#sanitizeInbound(input)
    const commit = this.#commands?.commitInbound(event) ?? this.#core.appendInbound(event)
    if (this.#commands?.excludes(commit.event)) {
      this.#publishFact({ channelId: event.channelId, kind: 'inbound', sourceId: commit.event.id })
      return { channelEventId: commit.event.id, inserted: commit.inserted }
    }
    if (commit.inserted) {
      this.#publishFact({ channelId: event.channelId, kind: 'inbound', sourceId: commit.event.id })
      const bindings = this.#coreRepository
        .listBindings(event.channelId)
        .filter((binding) => this.#admissionState === 'open' && this.#canAdmitAgent(binding.agentId))
      // Hooks see the committed fact; their decision is stored before any Admission can reference the event.
      await Promise.all(bindings.map((binding) => this.#decideInboundHooks(binding, commit.event)))
      await Promise.all(bindings.map((binding) => this.#route(binding, commit.event)))
    }
    return {
      channelEventId: commit.event.id,
      inserted: commit.inserted,
    }
```

</details>

**依据 7 · 源码核查**：[packages/channel-runtime/src/index.ts:2029-2052](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/channel-runtime/src/index.ts#L2029-L2052)

递交前二次检查绑定与历史，隐藏事实无法单独触发 Admission。

<details>
<summary>查看原文（24行）</summary>

```text
    if (!this.#admissionAllowed(binding.agentId) || this.#commands?.excludes(event)) return
    const currentBinding = this.#coreRepository.getBinding(binding.channelId)
    if (!currentBinding || currentBinding.agentId !== binding.agentId || currentBinding.boundAt !== binding.boundAt)
      return
    // The channel's history may have been cleared while this message waited for the lane.
    if (this.#coreRepository.getChannelEvent(event.id) === undefined) return
    if (backlog !== undefined)
      backlog = backlog.filter(({ id }) => this.#coreRepository.getChannelEvent(id) !== undefined)
    binding = currentBinding
    let episode = await this.#ensureActiveEpisode(binding, event)
    if (!this.#admissionAllowed(binding.agentId)) return
    if (episode.status !== 'active' || episode.dshSessionId === undefined) {
      throw new Error(`Episode is not ready for admission: ${episode.id}`)
    }
    episode = await this.#rolloverIfNeeded(episode, event)
    episode = await this.#applyCurrentCompatibleRevision(episode)
    const dshSessionId = episode.dshSessionId
    if (dshSessionId === undefined) throw new Error(`Episode has no DSH Session after revision switch: ${episode.id}`)
    if (!this.#admissionAllowed(binding.agentId)) return
    const candidateEvents = (backlog ?? this.#candidateTriggeredEvents(binding, event, episode.id)).filter(
      (candidate) => !this.#commands?.excludes(candidate),
    )
    // Hidden facts still advance the Admission cursor with visible ones, but never form an Admission on their own.
    if (this.#visibleEvents(binding, candidateEvents).length === 0) return
```

</details>

**依据 8 · 源码核查**：[packages/channel-runtime/src/index.ts:2058-2076](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/channel-runtime/src/index.ts#L2058-L2076)

记录 pending Admission，按 DSH 是否运行确定递交模式。

<details>
<summary>查看原文（19行）</summary>

```text
    const existingAdmission = this.#runtimeRepository
      .listRecoverableAdmissions(episode.id)
      .find((candidate) => candidate.eventIds.includes(event.id))
    const admissionId = existingAdmission?.id ?? AdmissionIdSchema.parse(`adm_${this.#nextUlid()}`)
    if (existingAdmission === undefined) {
      this.#runtimeRepository.createAdmission({
        id: admissionId,
        episodeId: episode.id,
        eventIds: candidateEvents.map(({ id }) => id),
        mode: this.#sessionDriver.sessionStatus(dshSessionId) === 'running' ? 'inject' : 'followup',
        state: 'pending',
        createdAt: this.#timestamp(),
      })
    }
    const admission = this.#runtimeRepository
      .listRecoverableAdmissions(episode.id)
      .find((candidate) => candidate.id === admissionId)
    if (!admission) throw new Error(`Admission was not persisted in target Episode: ${admissionId}`)
    this.#runtimeRepository.claimAdmission(admission.id)
```

</details>

**依据 9 · 源码核查**：[packages/channel-runtime/src/index.ts:2097-2115](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/channel-runtime/src/index.ts#L2097-L2115)

把可见事件交给驱动，成功后记录最后事件和 DSH 消息 ID。

<details>
<summary>查看原文（19行）</summary>

```text
      if (wake.fromWait !== true && admission.mode === 'followup') this.#timing.unblock(lane)
      const result = await this.#sessionDriver.admit({
        dshSessionId,
        admissionId: admission.id,
        events: visible,
        mode: admission.mode,
        replyRequired: wake.replyRequired === true || this.#replyRequired(binding, visible),
        ...(annotations.size === 0 ? {} : { annotations }),
        ...(wake.note === undefined ? {} : { wakeNote: wake.note }),
      })
      const lastEventId = admission.eventIds.at(-1)
      if (lastEventId === undefined) throw new Error(`Admission has no events: ${admission.id}`)
      this.#runtimeRepository.completeAdmission(admission.id, result.dshMessageId, lastEventId)
      if (feedbackLeaseId !== undefined) {
        this.#feedback.finishWhenIdle(episode.id, this.#sessionDriver.whenIdle?.(dshSessionId) ?? Promise.resolve())
      }
    } catch (error) {
      if (feedbackLeaseId !== undefined) await this.#feedback.cleanupEpisodeFeedback(episode.id, 'error')
      throw error
```

</details>

**依据 10 · 源码核查**：[apps/server/src/index.ts:5241-5276](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/index.ts#L5241-L5276)

DSH 驱动携带频道事件来源并实际调用 inject 或 followup，再刷新会话。

<details>
<summary>查看原文（36行）</summary>

```text
    const message = freezeMessage({
      id: dshMessageId,
      role: 'user',
      content: projectedEvents,
      source: {
        kind: 'nekro-nxt-channel',
        admissionId: input.admissionId,
        channelEventIds: input.events.map(({ id }) => id),
      },
    }) satisfies UserMessage
    this.#channelReplyGuard.rememberAdmission(agent, input.admissionId, input.replyRequired)
    if (input.mode === 'inject') agent.inject(message)
    else {
      const channelId = input.events[0]!.channelId
      const origin = this.#feedbackTurns.get(input.dshSessionId)
      origin?.rememberWake(
        dshMessageId,
        feedbackAdmissionOrigin(channelId, this.#feedback?.isAdminClientChannel(channelId) === true, input.events),
      )
      this.#sessions.get(input.dshSessionId)?.dynamic?.runner.beginOrdinaryTurn()
      try {
        agent.followup(message)
      } catch (error) {
        origin?.discard(dshMessageId)
        throw error
      }
    }
    if (imageStats.imageCount > 0 || imageStats.skippedCount > 0) {
      agent.session.append('nekro-nxt/image-admission', {
        admissionId: input.admissionId,
        ...imageStats,
      })
    }
    await this.#context.sessions.flush(agent.session)
    this.#armIdleReview(input.dshSessionId, input.events[0]!.channelId)
    return { dshMessageId }
```

</details>

#### 缺口

- 未运行并发压测或 DSH alpha 的实际工具执行交错。
  **影响**：只能定位触发、去重和递交边界，无法给出下一步进入模型的实际延迟。
  **进一步探讨**：固定客户端事件 ID，记录渠道事件、Admission、DSH 消息和模型轮次的对应关系。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 外发、重试及权限能证明到什么程度？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

频道 Agent 工具按 Episode 注册，检查活跃 Agent 和附件频道访问，bootstrap 将它接到外发处理与 Channel Runtime。服务先落盘逻辑意图及物理分片，然后标记 sending 并调用适配器。适配器抛错与恢复时看到的 sending 分片均转为 unknown，恢复会继续处理其余 planned 分片。若部分分片已发送，聚合状态为 partially-sent，各分片回执仍应单看。内置 Web 适配器对监听者回调使用 allSettled 后就标为 sent，不能据此判断任一客户端已看见消息。管理路由允许人工确认或重试，重试只重排失败及未知分片，先前已送达但回执丢失时仍可能重复。配置管理密钥时，管理边检查设备会话和写请求来源；频道归属和资源检查提供数据路径约束，跨租户隔离与外部适配器权限需另行验证。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/index.ts:4587-4599](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/index.ts#L4587-L4599)

频道会话实际注册发送和结束轮次工具。

<details>
<summary>查看原文（13行）</summary>

```text
        agentContext.tools.register(
          audioTranscribeTool(input.channelId, this.#assets, this.#assetService, this.#speech),
        )
      }
      agentContext.tools.register(
        channelCommunicationTool(input.episodeId, input.channelId, this.#assets, this.#communication),
      )
      agentContext.tools.register(
        finishChannelTurnTool(
          (agent) => this.#channelReplyGuard.awaitingReply(agent),
          requestWait === undefined || !waitAvailable
            ? undefined
            : { episodeId: input.episodeId, request: requestWait },
```

</details>

**依据 2 · 源码核查**：[apps/server/src/index.ts:2372-2383](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/index.ts#L2372-L2383)

工具检查活跃 Agent、当前频道资源，并随请求 ID 调用通信端口。

<details>
<summary>查看原文（12行）</summary>

```text
    async execute(args, exec) {
      if (!exec.agent) throw new Error('send_channel_message requires a live DSH Agent execution.')
      const parts = normalizeChannelMessageParts(args.parts)
      assertChannelAssetAccess(parts, channelId, assets)
      const result = await communication.sendMessage({
        episodeId,
        parts,
        ...(args.replyTo === undefined ? {} : { replyTo: args.replyTo }),
        sourceTurnId: String(exec.callId),
        clientRequestId: args.clientRequestId ?? `${episodeId}:${exec.callId}`,
        signal: exec.signal,
      })
```

</details>

**依据 3 · 源码核查**：[apps/server/src/bootstrap.ts:1332-1344](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/bootstrap.ts#L1332-L1344)

通信端口接外发处理及运行时。

<details>
<summary>查看原文（13行）</summary>

```text
        communication: {
          sendMessage: (input) => {
            const runtime = settled.current
            if (!runtime) return Promise.reject(new Error('Channel Runtime is not ready.'))
            const episode = repository.getEpisode(input.episodeId)
            const outbound = outboundReference.current
            // Agent messages pass the agent's outbound processors after the asset checks and before pacing.
            return outbound === undefined || episode === undefined
              ? runtime.sendMessage(input)
              : outbound.send({ ...input, agentId: episode.agentId, channelId: episode.channelId }, (message) =>
                  runtime.sendMessage(message),
                )
          },
```

</details>

**依据 4 · 源码核查**：[packages/channel-runtime/src/channel-delivery.ts:230-249](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/channel-runtime/src/channel-delivery.ts#L230-L249)

分片和意图先持久化，再尝试调度。

<details>
<summary>查看原文（20行）</summary>

```text
    const deliveries: PhysicalDeliveryRecord[] = plans.map(
      ({ parts, adapterContext, consumesProcessingFeedback }, sequence) => ({
        id: PhysicalDeliveryIdSchema.parse(`phy_${this.#nextUlid()}`),
        intentId,
        sequence,
        parts,
        ...(adapterContext === undefined ? {} : { adapterContext }),
        ...(consumesProcessingFeedback === true && activeFeedback !== undefined
          ? { processingFeedbackLeaseId: activeFeedback.id }
          : {}),
        state: 'planned',
      }),
    )
    this.#runtimeRepository.createOutboundPlan(intent, deliveries)
    command?.onPlanned(intent.id)
    input.onIntentPlanned?.({ id: intent.id, logicalMessageId: intent.logicalMessageId })
    this.#publishFact({ channelId: channel.id, kind: 'outbound', sourceId: intent.id })
    const settled = await this.dispatchOutbound(intent.id, input.signal ?? new AbortController().signal)
    this.#lastSentAt.set(channel.id, this.#timestamp())
    return this.#sendResult(settled.snapshot)
```

</details>

**依据 5 · 源码核查**：[packages/channel-runtime/src/channel-delivery.ts:279-303](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/channel-runtime/src/channel-delivery.ts#L279-L303)

恢复发现 sending 时记录 unknown，继续到其它 planned 分片。

<details>
<summary>查看原文（25行）</summary>

```text
    if (snapshot.intent.state === 'planned') {
      this.#runtimeRepository.markIntentSending(id)
      snapshot = this.#runtimeRepository.getOutbound(id)
    }
    if (snapshot.intent.state !== 'sending') return { snapshot, unknownDeliveries: 0 }

    let unknownDeliveries = 0
    for (const delivery of snapshot.deliveries) {
      if (delivery.state === 'sending') {
        this.#runtimeRepository.recordDeliveryReceipt(
          delivery.id,
          {
            status: 'unknown',
            message: 'Host restarted after dispatch began and before an authoritative receipt was committed.',
          },
          this.#timestamp(),
        )
        if (delivery.processingFeedbackLeaseId !== undefined) {
          await this.#feedback.settleConsumedFeedback(delivery.processingFeedbackLeaseId)
        }
        unknownDeliveries += 1
        continue
      }
      if (delivery.state !== 'planned') continue
      this.#runtimeRepository.markDeliverySending(delivery.id)
```

</details>

**依据 6 · 源码核查**：[packages/channel-runtime/src/channel-delivery.ts:328-362](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/channel-runtime/src/channel-delivery.ts#L328-L362)

适配器异常转未知，聚合优先保留部分已发送。

<details>
<summary>查看原文（35行）</summary>

```text
        receipt = await adapter.deliver(request, signal)
      } catch (error) {
        receipt = {
          status: 'unknown',
          message: `Adapter delivery threw before an authoritative receipt: ${error instanceof Error ? error.message : String(error)}`,
        }
      }
      this.#runtimeRepository.recordDeliveryReceipt(delivery.id, receipt, this.#timestamp())
      if (delivery.processingFeedbackLeaseId !== undefined) {
        if (receipt.status === 'sent' || receipt.status === 'unknown') {
          await this.#feedback.settleConsumedFeedback(delivery.processingFeedbackLeaseId)
        } else {
          await this.#feedback.cleanupFeedbackLease(delivery.processingFeedbackLeaseId, 'error')
        }
      }
    }
    const state = this.#aggregate(this.#runtimeRepository.getOutbound(id).receipts)
    this.#runtimeRepository.completeOutboundIntent(id, state)
    this.#publishFact({ channelId: channel.id, kind: 'outbound', sourceId: id })
    const completed = this.#runtimeRepository.getOutbound(id)
    try {
      this.#settled?.(completed)
    } catch {
      // Observers keep their own error reporting; a failing one never affects delivery.
    }
    return { snapshot: completed, unknownDeliveries }
  }

  #aggregate(receipts: readonly DeliveryReceiptRecord[]): OutboundState {
    const statuses = receipts.map(({ receipt }) => receipt.status)
    const sent = statuses.filter((status) => status === 'sent').length
    if (sent === statuses.length) return 'sent'
    if (sent > 0) return 'partially-sent'
    if (statuses.includes('unknown')) return 'unknown'
    return 'failed'
```

</details>

**依据 7 · 源码核查**：[packages/adapter-web/src/index.ts:125-137](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/adapter-web/src/index.ts#L125-L137)

内置适配的 sent 仅跟随发布阶段完成。

<details>
<summary>查看原文（13行）</summary>

```text
  async deliver(request: PhysicalDeliveryRequest, signal: AbortSignal): Promise<AdapterDeliveryReceipt> {
    if (!this.#running) return Promise.reject(new Error('Web Adapter connection is not running.'))
    if (request.connectionId !== this.#context.connectionId) {
      return { status: 'failed', failure: { kind: 'invalid', message: 'Delivery targets another Connection.' } }
    }
    if (signal.aborted) {
      return { status: 'failed', failure: { kind: 'transient', message: 'Delivery aborted before publication.' } }
    }
    const platformMessageId = `web-message-${this.#nextMessage}`
    this.#nextMessage += 1
    const event = { platformMessageId, request }
    await Promise.allSettled([...this.#listeners].map((listener) => Promise.resolve().then(() => listener(event))))
    return { status: 'sent', platformMessageId }
```

</details>

**依据 8 · 源码核查**：[apps/server/src/workspace-projections.ts:256-275](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/workspace-projections.ts#L256-L275)

人工操作记录结果，重试显式重新派发。

<details>
<summary>查看原文（20行）</summary>

```text
  async resolveOutbound(
    outboundId: OutboundIntentId,
    action: 'retry' | 'confirm-delivered',
    viewerKey: string,
  ): Promise<HostApiResponse<'resolveOutbound'>> {
    if (action === 'retry') this.#runtime.channels.assertOutboundDispatchable(outboundId)
    const resolution = this.#runtime.repository.projections.resolveOutbound({
      id: `ores_${randomUUID()}`,
      intentId: outboundId,
      action,
      viewerKey,
      now: this.#now(),
    })
    if (action === 'retry') await this.#runtime.channels.redispatchOutbound(outboundId)
    else this.#runtime.channels.publishOutboundFact(outboundId)
    this.scheduleAttentionCheck()
    return {
      outboundId,
      action,
      deliveryState: this.#runtime.repository.getOutbound(outboundId).intent.state,
```

</details>

**依据 9 · 源码核查**：[packages/storage-sqlite/src/repositories/projections.ts:335-373](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/storage-sqlite/src/repositories/projections.ts#L335-L373)

保存操作人与旧状态，事务内只将 failed 或 unknown 重排。

<details>
<summary>查看原文（39行）</summary>

```text
          const record = {
            id: input.id,
            intentId: input.intentId,
            action: input.action,
            previousState: state,
            previousDeliveries,
            viewerKey: input.viewerKey,
            createdAt: input.now,
          }
          tx.insert(outboundResolutions).values(record).run()
          if (input.action === 'retry') {
            const retried = deliveries.filter((delivery) => delivery.state === 'failed' || delivery.state === 'unknown')
            if (retried.length === 0) throw new OutboundResolutionError('not-resolvable', '没有需要重新发送的内容。')
            for (const delivery of retried) {
              tx.update(physicalDeliveries)
                .set({
                  state: 'planned',
                  platformMessageId: null,
                  capabilityOutcomes: null,
                  failureKind: null,
                  resultMessage: null,
                  retryAfterMs: null,
                  completedAt: null,
                })
                .where(and(eq(physicalDeliveries.id, delivery.id), eq(physicalDeliveries.state, delivery.state)))
                .run()
            }
            if (
              tx
                .update(outboundIntents)
                .set({ state: 'planned' })
                .where(and(eq(outboundIntents.id, input.intentId), eq(outboundIntents.state, state)))
                .run().changes !== 1
            )
              throw new OutboundResolutionError('not-resolvable', '这条消息的状态已经变化，请刷新后重试。')
          }
          return toResolution(record)
        },
        { behavior: 'immediate' },
```

</details>

**依据 10 · 源码核查**：[apps/server/src/management-edge.ts:398-407](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/management-edge.ts#L398-L407)

管理边写请求检查 Origin、cookie 和请求头令牌。

<details>
<summary>查看原文（10行）</summary>

```text
  const validateMutation = (request: IncomingMessage, session: SessionRecord): boolean => {
    if (methodIsSafe(request.method)) return true
    const host = publicHost(request)
    const origin = request.headers.origin
    if (host === undefined || origin !== `${secureRequest(request) ? 'https' : 'http'}://${host}`) return false
    const cookieToken = parseCookies(request).get(CSRF_COOKIE)
    const headerToken = request.headers['x-nxt-csrf']
    return (
      typeof headerToken === 'string' && cookieToken === session.csrfToken && safeEqual(headerToken, session.csrfToken)
    )
```

</details>

**依据 11 · 源码核查**：[apps/server/src/management-edge.ts:618-632](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/management-edge.ts#L618-L632)

实际入口拒绝未登录或来源不合的请求。

<details>
<summary>查看原文（15行）</summary>

```text
      if (authenticated === undefined && !publicProxyPath(url.pathname)) {
        if (wantsPage(request, url.pathname)) {
          response.writeHead(302, {
            location: `/login?next=${encodeURIComponent(`${url.pathname}${url.search}`)}`,
            'cache-control': 'no-store',
          })
          response.end()
          return
        }
        writeProblem(response, 401, 'authentication_required', '请先登录。')
        return
      }
      if (authenticated !== undefined && !validateMutation(request, authenticated.session)) {
        writeProblem(response, 403, 'request_origin_invalid', '请求来源验证失败。')
        return
```

</details>

#### 缺口

- 缺少外部平台真实回执、已读数据和不同平台重复策略。
  **影响**：发送结果不能替代对账，人工重发未知结果可能造成重复群消息。
  **进一步探讨**：小范围先查平台侧历史，记录已送达但回执丢失的样本。
- 仅查看代表授权路径。
  **影响**：不能用管理边、资源检查与频道分流推导多租户隔离。
  **进一步探讨**：另测反向代理、管理会话和适配器账号权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署和退出的模型、账号、数据与人时怎样盘点？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先用隔离数据目录、环回监听、一个模型账号和内置频道，测试创建 Agent、稳定事件 ID 和停止后的状态。Docker 是作者给出的常驻部署路径，Compose 需管理密钥、端口和数据卷；服务端对非环回入口强制至少 32 字符管理密钥，并为数据根持有单实例租约。首次计量模型配置、启动到可用、端口和备份准备；持续计量 token、磁盘增长、外部账号续期和人工对账；失败计量重启、恢复、逐分片判断和重复核查。退出先停接入和服务，查未结投递，备份或按策略清理数据根及工具，撤销供应商和适配器凭据。升级恢复点是否包含全部所需数据及真实恢复时间仍需核验，作者指出工具目录不进入升级恢复点。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:52-74](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/README.md#L52-L74)

作者给出 Docker、模型凭据、内置频道和外部账号设置顺序。

<details>
<summary>查看原文（23行）</summary>

````text
### 服务端：用 Docker 长期运行

把 `<管理密钥>` 替换为至少 32 个字符的随机字符串，把 `<持久化目录>` 替换为宿主机上的数据目录：

```bash
docker run -d \
  --name nekro-nxt \
  --restart unless-stopped \
  -p 127.0.0.1:4960:4960 \
  -e NEKRO_MANAGEMENT_KEY='<管理密钥>' \
  -v '<持久化目录>:/data' \
  ghcr.io/nekroai/nekro-nxt:latest
```

启动后用浏览器打开 `http://127.0.0.1:4960`，输入管理密钥登录。

[查看网页登录、公网访问、Docker Compose 与备份说明](docs/guide/server.md)

## 三步开始使用

1. 在「设置 → 模型供应商」填写 API Key 并选择模型；
2. 创建一个智能体，设置名称、人设和可用能力；
3. 先在内置频道对话，或前往「连接」添加即时通信账号、选择群聊并绑定智能体。
````

</details>

**依据 2 · 源码核查**：[docker-compose.yml:1-17](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/docker-compose.yml#L1-L17)

镜像变量、密钥、环回端口及持久数据卷。

<details>
<summary>查看原文（17行）</summary>

```text
services:
  nekro-nxt:
    image: '${NEKRO_IMAGE:-ghcr.io/nekroai/nekro-nxt:latest}'
    environment:
      NEKRO_MANAGEMENT_KEY: '${NEKRO_MANAGEMENT_KEY:?请设置至少 32 个字符的 NEKRO_MANAGEMENT_KEY}'
      # 仅当容器位于终止 HTTPS 的反向代理之后、端口不直接暴露时设为 1。
      NEKRO_TRUST_PROXY: '${NEKRO_TRUST_PROXY:-0}'
      # 智能体看到的消息时间按此 IANA 时区书写，例如 Asia/Shanghai；未设置时为 UTC。
      TZ: '${TZ:-UTC}'
    ports:
      - '${NEKRO_BIND_ADDRESS:-127.0.0.1}:4960:4960'
    volumes:
      - nekro-nxt-data:/data
    restart: unless-stopped

volumes:
  nekro-nxt-data:
```

</details>

**依据 3 · 源码核查**：[apps/server/src/main.ts:66-88](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/main.ts#L66-L88)

绑定范围与管理密钥长度检查，反向代理信任需显式启用。

<details>
<summary>查看原文（23行）</summary>

```text
export const parseListenHost = (input: string | undefined): '127.0.0.1' | '0.0.0.0' => {
  if (input === undefined || input.trim() === '') return '127.0.0.1'
  if (input === '127.0.0.1' || input === '0.0.0.0') return input
  throw new TypeError(`NEKRO_HOST 无效：${input}`)
}

export const isLoopbackListenHost = (host: string): boolean =>
  host === 'localhost' || host === '::1' || (isIP(host) === 4 && host.split('.')[0] === '127')

export const parseManagementKey = (input: string | undefined, required = false): string | undefined => {
  if (input === undefined || input.trim() === '') {
    if (required) throw new TypeError('容器或公开监听必须设置 NEKRO_MANAGEMENT_KEY。')
    return undefined
  }
  if (input.length < 32) throw new TypeError('NEKRO_MANAGEMENT_KEY 至少需要 32 个字符。')
  return input
}

/** `NEKRO_TRUST_PROXY=1` (or `true`) only when a reverse proxy in front terminates HTTPS and sets forwarded headers. */
export const parseTrustProxy = (input: string | undefined): boolean => {
  if (input === undefined || input.trim() === '' || input === '0' || input === 'false') return false
  if (input === '1' || input === 'true') return true
  throw new TypeError(`NEKRO_TRUST_PROXY 只能是 1 或 0：${input}`)
```

</details>

**依据 4 · 源码核查**：[apps/server/src/main.ts:842-865](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/main.ts#L842-L865)

密钥存在时装管理边，失败时关闭已开启的组件。

<details>
<summary>查看原文（24行）</summary>

```text
    let managementEdge: ManagementEdgeHandle | undefined
    if (managementKey !== undefined) {
      try {
        managementEdge = await startManagementEdge({
          host,
          port,
          internalPort: webContext.webServer.port,
          dataRoot,
          managementKey,
          releaseId,
          productVersion: SERVER_PACKAGE_VERSION,
          repository: runtime.hostSecurity,
          ...(options.trustProxy === true ? { trustProxy: true } : {}),
        })
        owner.edge = managementEdge
      } catch (error) {
        disposeReady()
        disposeLive()
        disposeLoopbackDescriptor?.()
        api.dispose()
        disposeSpaRoutes()
        await webContext.fiber.dispose()
        await runtime.dispose()
        throw explainListenPermissionFailure(error, port)
```

</details>

**依据 5 · 源码核查**：[apps/server/src/main.ts:869-885](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/main.ts#L869-L885)

停止关闭 edge、宿主 API、Web 和运行时。

<details>
<summary>查看原文（17行）</summary>

```text
    let stopped = false
    const stop = async (): Promise<void> => {
      if (stopped) return
      stopped = true
      ready = false
      await managementEdge?.stop()
      disposeLoopbackDescriptor?.()
      disposeReady()
      disposeLive()
      api.dispose()
      disposeSpaRoutes()
      await webContext.fiber.dispose()
      await runtime.dispose()
    }

    options.signal?.throwIfAborted()
    return { port: managementEdge?.port ?? webContext.webServer.port, secure: managementEdge !== undefined, stop }
```

</details>

**依据 6 · 源码核查**：[apps/server/src/main.ts:889-913](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/main.ts#L889-L913)

非环回需管理密钥，按数据根取得并释放租约。

<details>
<summary>查看原文（25行）</summary>

```text
/** One lease covers backup, migration, serving, and quiescent teardown. */
export const startNekroServer = async (options: StartServerOptions): Promise<NekroServerHandle> => {
  const requestedHost = options.host ?? '127.0.0.1'
  parseManagementKey(options.managementKey, !isLoopbackListenHost(requestedHost))
  const recoveryHost = parseListenHost(requestedHost)
  const release = await acquireDataRootLease(resolveRoot(options.dataRoot))
  const owner: { runtime?: NekroRuntime; web?: Context; edge?: ManagementEdgeHandle; logs?: HostLogService } = {}
  let detachConsole: (() => void) | undefined
  const writeLifecycle = (level: 'info' | 'error', message: string, details?: Record<string, unknown>): void => {
    owner.logs?.write({ level, message, source: { kind: 'system', id: 'host', name: '服务' }, details })
  }
  const closeLogs = async (): Promise<void> => {
    detachConsole?.()
    detachConsole = undefined
    try {
      await owner.logs?.close()
    } catch {
      // Log storage must never retain the data-root lease after the business runtime has stopped.
    }
  }
  const releaseStoppedHost = async (): Promise<void> => {
    writeLifecycle('info', '服务已停止。')
    await closeLogs()
    await release()
  }
```

</details>

**依据 7 · 作者声明**：[docs/guide/server.md:99-112](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/docs/guide/server.md#L99-L112)

作者列出 /data 内容、工具备份例外、升级前完整备份和恢复点。

<details>
<summary>查看原文（14行）</summary>

````text
开了「完整访问」的智能体把自己需要的工具装到 `/data/tools`，容器重建后仍在：`npm install -g` 装到 `/data/tools/npm`，`pip install --user` 装到 `/data/tools/python`，虚拟环境建在 `/data/tools/venv/<名字>`，单个程序放进 `/data/tools/bin`；这几处的 `bin` 目录都在命令的 `PATH` 里。只能写工作区的智能体也能使用这里已装好的工具。`/data/tools` 不进升级恢复点；恢复后需要的工具重新安装即可。


智能体、会话、扩展、资源、证书和工作区都位于 `/data`。容器启动时会把 `/data` 交给运行用户（默认 UID/GID 10001），宿主机目录无需提前设置属主；需要与宿主机其他程序共用文件时，可用 `NEKRO_UID`、`NEKRO_GID` 指定运行用户。

升级时拉取新镜像并替换容器，不要在运行容器内执行 `git pull`：

```bash
docker pull ghcr.io/nekroai/nekro-nxt:latest   # 或 docker pull kromiose/nekro-nxt:latest
docker stop nekro-nxt
docker rm nekro-nxt
```

随后重新执行“启动容器”中的命令，继续挂载原持久化目录。升级前先备份完整 `/data`；详细恢复原则见[升级、备份与恢复](upgrade-backup.md)。新版本启动时会先在 `/data/backups/` 生成恢复点，可以用 `NEKRO_UPGRADE_BACKUP_DIR` 改到另一个挂载的目录，或用 `NEKRO_UPGRADE_BACKUP=off` 关闭。
````

</details>

#### 缺口

- 未执行容器、桌面或升级恢复。
  **影响**：资源账单、运维人时、凭据残留与退出备份覆盖率都待测。
  **进一步探讨**：在隔离实例实际记录启动、恢复、停用用时与数据留存，再判是否接外部群。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 送达未知时怎样验证能否避免重复？

**研究主题**：新假设与验证

#### 完整回答

现有冷启动在连接恢复后尝试未结投递；sending 分片置 unknown，由操作人员决定查证或重试。假设在平台允许权威对账时，增加以连接、频道和物理投递 ID 为范围的回执查询，能减少人工重发和重复消息。查不到或查询失败应继续未知。与现有人工处理作对照，分别模拟标为 sending 后未调用、平台已收但回执丢失、多分片只送达一部分、平台查不到和重复入站。记录远端实际写入次数、误重发、仍未解决的比例与核对用时。如果误判导致漏发，或重复、未决和用时均无改善，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/bootstrap.ts:2204-2215](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/apps/server/src/bootstrap.ts#L2204-L2215)

冷启动恢复调用实际装配，先挂载连接再恢复频道运行时。

<details>
<summary>查看原文（12行）</summary>

```text
  /** Resume persisted Episodes, Admissions, Outbounds and active Extensions after a cold start. */
  async recover(options: { readonly openAdmission?: boolean } = {}): Promise<void> {
    await this.extensions.restoreInstances()
    await this.#restoreDshHostUiPages()
    for (const connection of this.core.listConnections()) {
      await this.connections.mountAdapter(connection.id)
    }
    await this.checkAgentCompatibility()
    await this.channels.recoverProcessingFeedback()
    await this.extensions.restoreAttachments()
    await this.channels.recover()
    if (options.openAdmission !== false) await this.openAdmission()
```

</details>

**依据 2 · 源码核查**：[packages/channel-runtime/src/index.ts:1681-1687](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/channel-runtime/src/index.ts#L1681-L1687)

未结意图逐一进入外发派发。

```text
    if (onlyDeferred) return report
    for (const outboundId of this.#runtimeRepository.listUnsettledOutboundIds()) {
      if (!this.#runtimeAdmissionOpen()) break
      const result = await this.#delivery.dispatchOutbound(outboundId, new AbortController().signal)
      report.recoveredOutbounds += 1
      report.unknownDeliveries += result.unknownDeliveries
    }
```

**依据 3 · 源码核查**：[packages/channel-runtime/src/channel-delivery.ts:285-308](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/channel-runtime/src/channel-delivery.ts#L285-L308)

区分上次 in-flight 与仍 planned，物理投递请求已有 ID。

<details>
<summary>查看原文（24行）</summary>

```text
    let unknownDeliveries = 0
    for (const delivery of snapshot.deliveries) {
      if (delivery.state === 'sending') {
        this.#runtimeRepository.recordDeliveryReceipt(
          delivery.id,
          {
            status: 'unknown',
            message: 'Host restarted after dispatch began and before an authoritative receipt was committed.',
          },
          this.#timestamp(),
        )
        if (delivery.processingFeedbackLeaseId !== undefined) {
          await this.#feedback.settleConsumedFeedback(delivery.processingFeedbackLeaseId)
        }
        unknownDeliveries += 1
        continue
      }
      if (delivery.state !== 'planned') continue
      this.#runtimeRepository.markDeliverySending(delivery.id)
      let receipt: AdapterDeliveryReceipt
      try {
        const request: PhysicalDeliveryRequest = {
          deliveryId: delivery.id,
          logicalMessageId: snapshot.intent.logicalMessageId,
```

</details>

**依据 4 · 源码核查**：[packages/storage-sqlite/src/repositories/projections.ts:344-369](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/storage-sqlite/src/repositories/projections.ts#L344-L369)

显式重试重排未知或失败分片，保留已送达分片。

<details>
<summary>查看原文（26行）</summary>

```text
          tx.insert(outboundResolutions).values(record).run()
          if (input.action === 'retry') {
            const retried = deliveries.filter((delivery) => delivery.state === 'failed' || delivery.state === 'unknown')
            if (retried.length === 0) throw new OutboundResolutionError('not-resolvable', '没有需要重新发送的内容。')
            for (const delivery of retried) {
              tx.update(physicalDeliveries)
                .set({
                  state: 'planned',
                  platformMessageId: null,
                  capabilityOutcomes: null,
                  failureKind: null,
                  resultMessage: null,
                  retryAfterMs: null,
                  completedAt: null,
                })
                .where(and(eq(physicalDeliveries.id, delivery.id), eq(physicalDeliveries.state, delivery.state)))
                .run()
            }
            if (
              tx
                .update(outboundIntents)
                .set({ state: 'planned' })
                .where(and(eq(outboundIntents.id, input.intentId), eq(outboundIntents.state, state)))
                .run().changes !== 1
            )
              throw new OutboundResolutionError('not-resolvable', '这条消息的状态已经变化，请刷新后重试。')
```

</details>

**依据 5 · 源码核查**：[packages/storage-sqlite/src/repositories/channels.ts:755-785](https://github.com/NekroAI/nekro-nxt/blob/86d0710ed56f17f867cdf513a9bfcb487b2175b7/packages/storage-sqlite/src/repositories/channels.ts#L755-L785)

入站去重可作为对照中区分重复外发的独立基线。

<details>
<summary>查看原文（31行）</summary>

```text
    appendChannelEvent(candidate, occurrences = []): AppendChannelEventCommit {
      const inserted = database.transaction(
        (tx) => {
          const changed = tx
            .insert(channelEvents)
            .values(candidate)
            .onConflictDoNothing({ target: [channelEvents.channelId, channelEvents.dedupeKey] })
            .run().changes
          if (changed === 1 && occurrences.length > 0) {
            tx.insert(assetOccurrences)
              .values(
                occurrences.map(({ partIndex, assetId }) => ({
                  channelEventId: candidate.id,
                  partIndex,
                  assetId,
                })),
              )
              .run()
          }
          return changed === 1
        },
        { behavior: 'immediate' },
      )
      if (inserted) return { event: candidate, inserted: true }
      const row = database
        .select()
        .from(channelEvents)
        .where(and(eq(channelEvents.channelId, candidate.channelId), eq(channelEvents.dedupeKey, candidate.dedupeKey)))
        .get()
      if (row === undefined) throw new Error('Channel Event dedupe conflict has no existing row.')
      return { event: toEvent(row), inserted: false }
```

</details>

#### 缺口

- 未确认哪些外部平台允许按稳定投递 ID 权威查询。
  **影响**：若平台缺少可靠的关联和查询，不能安全自动确认为已送达。
  **进一步探讨**：先用故障注入适配器对照，再按平台验证受理、重复与查询权限。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
