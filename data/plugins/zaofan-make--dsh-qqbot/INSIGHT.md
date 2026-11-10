# QQBot 增强版

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[584259d](https://github.com/zaofan-make/dsh-qqbot/tree/584259d91e6bfafe469118118421348706961483)

<!-- BEGIN META -->
[![GitHub ★ 237](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=237&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zaofan-make/dsh-qqbot) [![npm 30d 37,967](https://img.shields.io/static/v1?label=npm+30d&message=37%2C967&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zaofan/dsh-qqbot) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zaofan/dsh-qqbot)
<!-- END META -->

> **功能**：为 DeepSeek Harness 接入 QQ 群聊和单聊，支持管理会话、切换模型及发送交付文件。

> **亮点**：把 QQ 聊天映射到 DSH 会话，可在聊天里调整活动模型，并把宿主声明的文件送回任务对话。只改思考强度时保留会话标识，切模型时派生带历史的子会话。相对只做 QQ 收发或手工复制，主要增量是会话与交付接线。见 [Q01](#research-q01)、[Q02](#research-q02) 和 [Q03](#research-q03)。

> **主要限制**：最需要核对的是成功回执是否和实际状态一致。旧宿主可能只更新模型字段，文件路径又在上传完成前被登记用于去重。同群控制命令也存在与切模不同的权限路径。见 [Q02](#research-q02)、[Q03](#research-q03) 和 [Q04](#research-q04)。

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
  - [Q01 · 在 QQ 里下发任务怎样到达 DSH 会话，接入前置条件是什么？](#detail-section-11)
  - [Q02 · 远程切换模型与思考强度怎样同步到当前会话，出现冲突或旧宿主时如何表现？](#detail-section-12)
  - [Q03 · 文件如何发回 QQ，哪些失败会造成漏投或重复？](#detail-section-13)
  - [Q04 · 群内收到消息是否等于具备变更或审批权限，什么场景可以试用？](#detail-section-14)
  - [Q05 · 能否减少同一任务在 QQ 与 Web 间切换造成的状态漂移？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 QQ 里讨论任务、已有 DSH 工作流的操作者，可以从一对一聊天触发固定会话，并在聊天里核对非敏感任务的回复和附件。

直接使用 DSH Web 时，操作者需要把 QQ 任务复制进去，并将结果取回 QQ。已有 QQ Bot SDK 提供连接与事件收发，这里讨论的是插件把事件接入宿主会话和交付处理的增量。作者对第三方协议端的比较仅作为选型线索。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| QQ 渠道 | 在指定聊天发起宿主任务 | 依应用权限、名单与提及规则 |
| 模型选择 | 改当前 QQ 会话的模型或思考强度 | 强度生效依宿主与模型服务 |
| 文件直发 | 把宿主声明的产物送回原对话 | 依事件和平台媒体能力，需核对到账 |
| 审批 | 从 QQ 回复宿主待决权限请求 | 依编号、发起者或管理员及交互路径 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| QQ 应用凭据及对应事件权限 | 渠道必需 | WebSocket 建连与收发 | 网关不起或收不到相应事件 |
| 可加载 bundle 并提供 agents、systemPrompt 的 DSH | 必需 | 创建和继续会话 | 插件入口或任务失败 |
| 宿主模型选择 API 与提供方支持 | 思考强度实际变更所需 | 读写活动模型档 | 旧 options 回退仅改模型字段 |
| 宿主 present 事件及媒体能力 | 自动投递必需 | 把文件交给 QQ | 回宿主手工领取 |
| Web profile 的 settings 服务 | 设置页所需 | 可视化调整 | 走配置文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 操作者在专用 profile 配置 QQ 应用和明确访问名单 | 指定用户可连通，未授权用户无任务回执 |
| 2 | 操作者发送无敏感信息的短任务 | 在正确 DSH 会话出现一轮用户输入 |
| 3 | 操作者请求一个已知样本附件并核对 QQ 收件 | 文件内容、数量和对话均一致，异常则回宿主手工补发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现有宿主资源和模型账号，新增费用未知 | 配置 QQ 应用、名单和专用 profile | 具体配置耗时未知 |
| 持续使用 | 运行宿主、模型请求及附件上传，单位费用未知 | 核对模型与附件状态，维护会话配置 | 没有每份合格交付的运行账单 |
| 失败与退出 | 重试或补发可能增加请求与传输，金额未知 | 停用 QQ 渠道并回宿主确认与补发 | 漏投和重复发生率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 从聊天发起 DSH 任务 | 入站连接宿主会话 | 实际成功率和群事件覆盖 |
| 在两端调整模型 | 活跃 agent 选择与首步观察 | 两端交错时最终选择及实际强度 |
| 在原对话收到附件 | 交付事件会触发逐项上传 | 平台接受率、重复与节时 |

> **思考**：最需要核对的是成功回执是否和实际状态一致。旧宿主可能只更新模型字段，文件路径又在上传完成前被登记用于去重。同群控制命令也存在与切模不同的权限路径。见 [Q02](#research-q02)、[Q03](#research-q03) 和 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 QQ 聊天映射到 DSH 会话，可在聊天里调整活动模型，并把宿主声明的文件送回任务对话。只改思考强度时保留会话标识，切模型时派生带历史的子会话。相对只做 QQ 收发或手工复制，主要增量是会话与交付接线。见 [Q01](#research-q01)、[Q02](#research-q02) 和 [Q03](#research-q03)。

通过会话管理、网关中间件、出站路由和投递器分离核心路径。投递器接口可替换，便于验证部分发送失败。当前去重粒度和跨端模型观察仍受本地状态时序影响，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最需要核对的是成功回执是否和实际状态一致。旧宿主可能只更新模型字段，文件路径又在上传完成前被登记用于去重。同群控制命令也存在与切模不同的权限路径。见 [Q02](#research-q02)、[Q03](#research-q03) 和 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有 QQ 应用的 DSH 用户可以用专用单聊做一次低风险试用。先核对名单和收件对象，再分别对照宿主选中的模型与 QQ 实收的文件。任何一端的状态不一致时，暂停 QQ 入口并回 DSH 核查。 见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 QQ 会话接线、模型偏好切换和交付尝试的实现判断。跨端确认方案是待验证的设计假设，真实宿主和业务效果仍缺对应结果。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.md、README.md、cordis.patch.yml、entry.js、package.json、src/config.ts、src/features/model-switcher.ts、src/features/qq-approval.ts、src/gateway/bootstrap.ts、src/gateway/middleware-setup.ts、src/index.ts、src/session/session-manager.ts、src/transport/deliverables.ts、src/transport/inbound.ts、src/transport/outbound.ts、src/transport/rich-media.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读真实入口、网关和会话路径、模型卡片、文本与按钮审批，以及文件投递主分支。未做全部自定义扩展、群管理或本地模型的独立审计，平台权限只按固定实现记录。
- 下一步：在隔离 profile 比较模型变更、仅强度变更与交错操作，读取宿主最终 selection 和真实请求。用同名样本覆盖成功、超额、上传失败和提示失败，逐一核对实际收件与退路。

**分析版本**

- **仓库**：[zaofan-make/dsh-qqbot](https://github.com/zaofan-make/dsh-qqbot)
- **版本号**：1.12.12（[固定提交 584259d](https://github.com/zaofan-make/dsh-qqbot/tree/584259d91e6bfafe469118118421348706961483)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

若切模确认绑定实际请求版本、投递确认绑定远端收件结果，操作者或许能减少跨端返工。以交错切模和失败上传比较每份正确交付的人工步骤和误投，结果不明时由人核对再决定是否补发。见 [Q05](#research-q05)。

在隔离 profile 比较模型变更、仅强度变更与交错操作，读取宿主最终 selection 和真实请求。用同名样本覆盖成功、超额、上传失败和提示失败，逐一核对实际收件与退路。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 6492 | — | — | 98867 |
| .js | source | 4 | 15383 | 12000 | 3374 | — |
| .mjs | example | 24 | 6956 | 4532 | 2088 | — |
| .md | example | 6 | 746 | — | — | 8769 |
| .js | example | 2 | 349 | 292 | 42 | — |
| .mjs | source | 8 | 765 | 604 | 102 | — |
| .ts | source | 136 | 41203 | 28023 | 11395 | — |
| .ts | test | 37 | 4641 | 3725 | 556 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zaofan-make/dsh-qqbot/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=28&color=737b86&logo=github)](https://github.com/zaofan-make/dsh-qqbot/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/zaofan-make/dsh-qqbot/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：把 QQ 群或单聊作为 DSH 的入口时，哪些路由、切模与文件交付行为能从源码确认，什么条件下可以小范围试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在 QQ 里下发任务怎样到达 DSH 会话，接入前置条件是什么？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

已有 DSH 工作流、平时在 QQ 讨论任务的操作者，可以从 QQ 对话触发已配置的宿主会话，随后在原对话确认结果。基线是把消息复制进 DSH，再把正文或附件复制回 QQ。这个桥接在包清单中通过 bundle patch 挂到 DSH，入口导出 apply 并注入 agents 和 systemPrompt。连接需要 QQ 应用凭据，启动网关后用 QQBot SDK 建立 WebSocket，默认 API 指向腾讯机器人地址。到达本地的事件先过访问与群提及规则，再由网关交给入站处理器。普通唤醒路径按群或单聊对象取得会话，通过 agent.followup 提交用户消息。规则也允许某些消息只附加到历史，看到 QQ 事件并不必然启动一轮。合格的接入应能从一个指定私聊发送无敏感内容的任务，并在正确会话收到可核对回执。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:77-92](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/package.json#L77-L92)

包声明 DSH patch 与 Web 扩展，并给出宿主引擎声明。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "immediately": true
    },
    "engines": {
      "dsh": ">=0.1.5-rc.2"
    },
    "manifestVersion": 1
```

</details>

**依据 2 · 源码核查**：[src/index.ts:38-49](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/index.ts#L38-L49)

实际入口与服务注入。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = 'im-qqbot';
// ⚠️ 2026-09-13(主人验到注入没生效才发现): 用 ctx.systemPrompt.context() 注册运行时上下文贡献**必须**在此声明依赖,
//    否则 ctx.systemPrompt 拿不到 → 注册会走“宿主未提供”兜底, 小传注入等于没接上。
export const inject = ['agents', 'systemPrompt'];
export const Config = ConfigSchema;

export type { ImQQBotConfig } from './config.js';

// ── 插件主体 ──
export async function apply(ctx: Context, config: ImQQBotConfig): Promise<void> {
  const agents = (ctx as unknown as Record<string, unknown>).agents as DshAgentRegistry;
  const logger: Logger = ((ctx as unknown as Record<string, unknown>).logger as Logger) ?? console;
```

</details>

**依据 3 · 源码核查**：[src/index.ts:385-397](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/index.ts#L385-L397)

凭据齐全才启动网关。

<details>
<summary>查看原文（13行）</summary>

```text
  const tryStartGateway = async (): Promise<void> => {
    if (gatewayStarted) return;
    const cur = resolvedConfig as unknown as Record<string, unknown>;
    const id = String(cur.appId ?? '');
    const sec = String(cur.appSecret ?? '');
    if (!id || !sec) return;
    gatewayStarted = true;
    try {
      logger.info(`实例 ${ns}: 检测到凭据已就绪，开始启动网关…`);
      await bootstrapGateway(ctx, agents, resolvedConfig, logger, {
        // 拿到"拆卸本次网关"的函数 —— 保存了连接相关设置后要靠它先拆后建（否则永不重连）
        onDisposer: (d) => { gatewayDispose = d; },
      });
```

</details>

**依据 4 · 源码核查**：[src/gateway/bootstrap.ts:183-199](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/gateway/bootstrap.ts#L183-L199)

实际用 SDK 和 WebSocket 建连，并装配入站中间件。

<details>
<summary>查看原文（17行）</summary>

```text
  const bot = new QQBot({
    appId: config.appId,
    appSecret: config.appSecret,
    transport: 'websocket',
    baseUrl: process.env.QQBOT_BASE_URL?.replace(/\/+$/, '') || 'https://api.bot.qq.com',
    tokenBaseUrl: process.env.QQBOT_TOKEN_BASE_URL?.replace(/\/+$/, '') || 'https://api.bot.qq.com',
    userAgent,
    ...(watchJoinRequests ? { intents: FULL_INTENTS | (1 << 24) } : {}),
    // 调试隔离时可用 QQBOT_DEBUG_CONSOLE=1 让 QQBot 日志直出 stdout，便于定位
    logger: process.env.QQBOT_DEBUG_CONSOLE ? (console as typeof logger) : logger,
  } as ConstructorParameters<typeof QQBot>[0]);
  logger.info(`QQBot SDK initialized (UA: ${userAgent})${watchJoinRequests ? ' [watchJoinRequests: GROUP_MEMBER_EVENT 已订阅]' : ''}`);

  // ── 中间件链 ──
  await setupMiddlewares(bot, config, manager, logger, ctx);
  // 2026-10-20: 消息历史台账（落盘、按会话一个文件）
  initMsgHistory(dataRootOf(config));
```

</details>

**依据 5 · 源码核查**：[src/gateway/bootstrap.ts:380-384](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/gateway/bootstrap.ts#L380-L384)

中间件之后把消息交给入站处理。

```text
    if (config.debug) {
      logger.debug(`← message (post-middleware): ${JSON.stringify(msg, null, 2).slice(0, 500)}`);
    }
    await handleInbound(msg, manager, config, logger, mCtx.state);
  });
```

**依据 6 · 源码核查**：[src/transport/inbound.ts:423-437](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/transport/inbound.ts#L423-L437)

查找或创建会话并补注册工具。

<details>
<summary>查看原文（15行）</summary>

```text
  // ── 获取或创建会话 ──
  let record;
  try {
    record = await manager.getOrCreate(scope, peerId, msg.senderId, replyTarget);
  } catch (err) {
    logger.error(`ERROR creating session: ${err instanceof Error ? err.message : String(err)}`);
    return;
  }

  // ── 工具自愈：setup 竞态漏装时补注册通道工具(幂等,几乎零开销) ──
  try {
    await manager.ensureChannelTools(record);
  } catch (err) {
    logger.debug(`ensureChannelTools error: ${err instanceof Error ? err.message : String(err)}`);
  }
```

</details>

**依据 7 · 源码核查**：[src/transport/inbound.ts:1029-1052](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/transport/inbound.ts#L1029-L1052)

路径区分历史附加失败后的回退及 QQ 来源标记。

<details>
<summary>查看原文（24行）</summary>

```text
      } catch (err) {
        logger.warn(`[nothink] append 失败, 退回正常 followup: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      logger.warn(`[nothink] 会话无 append 能力, 退回正常 followup: key=${scope}:${peerId}`);
    }
    // 无 append 能力 → 兜底照常 followup(保证消息不丢, 但会唤醒; 罕见路径)
    record.lastInboundAt = Date.now();
    record.turnActive = true;
    record.agent.followup(message);
    logger.debug(`→ followup sent(nothink 兜底): key=${scope}:${peerId}`);
    return;
  }

  record.lastInboundAt = Date.now();
  // 置回合活跃(消息聚合, 2026-09-07): followup 发出即算回合开始, debounce 见忙攒消息; turn/end 由 outbound 复位
  record.turnActive = true;
  // ★ 2026-11-05：标记**本回合由 QQ 入站触发**（配合设置项 `webTurnSilent`：
  //   只有 `turnOrigin==='qq'` 的回合正文块才发 QQ；web/桌面界面发起的回合没有这一步 → 静默）。
  //   定时任务/面板任务那种伪造入站也走这里 ⇒ 它们照常发 QQ（不是"web 回合"）。
  //   顺手清掉"因插话解除静默"的标记 —— 新回合重新开始算。
  record.turnOrigin = 'qq';
  record.interjectLifted = false;
  record.turnStartAt = Date.now();
```

</details>

**依据 8 · 源码核查**：[src/transport/inbound.ts:1069-1077](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/transport/inbound.ts#L1069-L1077)

实际调用宿主 followup。

```text
  }

  record.agent.followup(message);
  logger.debug(`→ followup sent: key=${scope}:${peerId}`);

  // 群消息回复后清空历史缓存（避免下次 @ 时重复组包，对齐 openclaw-qqbot dispatch）
  if (scope === 'group') {
    clearGroupHistory(config.appId, msg.groupOpenid ?? msg.senderId);
  }
```

#### 缺口

- 应用可订阅事件与真实宿主组合未核实。
  **影响**：群消息到达和回复能力仍取决于应用权限及宿主服务。
  **进一步探讨**：用指定测试应用和目标宿主记录一条单聊和一条群提及的完整事件。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远程切换模型与思考强度怎样同步到当前会话，出现冲突或旧宿主时如何表现？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

QQ 端选模型后按聊天对象保存待选项，发第二张卡让操作者选强度。当前模型不变且强度相同则直接返回，只改强度则尝试修改活跃 agent 并保存会话偏好，模型改变才派生继承上下文的子会话。Web 端修改由首步钩子读取，按聊天对象比较上次观测到的 provider、model、effort 组合，出现不同值才把当前宿主值写入会话偏好。这让交替使用 QQ 与宿主界面的操作者有机会少做一次手动同步。它是值比较，不能判断变更来源或保证多端同时操作的顺序。选择默认档时，如果模型与当前一致，卡片分支直接返回，原强度可能保留。旧宿主回落到 options，只赋 provider 与 model，因此成功提示本身不能证明强度已经应用。强度按钮使用索引且回调重读档位列表，发卡到点击期间顺序若改变，可能应用不同值。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/model-switcher.ts:267-301](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/features/model-switcher.ts#L267-L301)

按聊天对象保存待选并生成索引按钮。

<details>
<summary>查看原文（35行）</summary>

```text
  /** 命令侧：外部选定模型后，登记 pending 并发强度卡 */
  async beginEffortPick(
    target: Parameters<QQBotSender['sendMarkdownWithKeyboard']>[0],
    scope: 'group' | 'c2c',
    peerId: string,
    pick: { provider: string; model: string; name: string },
  ): Promise<string> {
    pendingEffort.set(`${scope}:${peerId}`, pick);
    return this.sendEffortCard(target, scope, peerId);
  }

  /**
   * 发「思考强度」卡片（第二步）。
   * 档位来自宿主 `llm.reasoningEfforts()`，拿不到就 off/low/high/max。
   * 另给一个「默认(跳过)」——注意：默认 ≠ 关闭思考。
   */
  async sendEffortCard(
    target: Parameters<QQBotSender['sendMarkdownWithKeyboard']>[0],
    scope: 'group' | 'c2c',
    peerId: string,
  ): Promise<string> {
    const pending = pendingEffort.get(`${scope}:${peerId}`);
    if (!pending) return '没有待选强度的模型，先发 /model 选一个';
    let efforts: string[] = [];
    try { efforts = await this.manager.listReasoningEfforts(); } catch { /* ignore */ }
    if (!efforts.length) efforts = ['off', 'low', 'high', 'max'];
    const mk = (label: string, data: string, style: number) => ({
      id: data,
      render_data: { label: label.slice(0, 24), visited_label: label.slice(0, 24), style },
      action: { type: 1, permission: { type: 2 }, data, unsupport_tips: '请用 /model 重新选择' },
    });
    const rows: Array<{ buttons: unknown[] }> = [];
    const shown = efforts.slice(0, 5);
    rows.push({ buttons: shown.map((e, i) => mk(String(e), `${EFF_PREFIX}${i}`, 0)) });
    rows.push({ buttons: [mk('默认(跳过)', `${EFF_PREFIX}skip`, 1)] });
```

</details>

**依据 2 · 源码核查**：[src/features/model-switcher.ts:334-376](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/features/model-switcher.ts#L334-L376)

点击权限、默认分支、回调重取档位和成功提示。

<details>
<summary>查看原文（43行）</summary>

```text
    // ── 第二步：思考强度卡片（2026-11-08）──
    const effPick = parseEffortButton(e.data.resolved?.button_data);
    if (effPick !== null) {
      const gateE = this.clickerAllowed(e);
      if (!gateE.ok) {
        try { await this.sender.sendMarkdown(target, '⚠️ 切模型只有主人能点哦。'); } catch { /* ignore */ }
        return true;
      }
      const pending = pendingEffort.get(`${scope}:${peerId}`);
      if (!pending) {
        await this.sender.sendMarkdown(target, '这次的选择已过期，重新发 /model 选一次吧~');
        return true;
      }
      try {
        // 已经是这个模型（且这次不改强度）→ 不 fork、不折腾，直接回一句
        if (effPick === 'skip') {
          const curRoute = this.manager.getEffectiveModel(scope, peerId);
          if (curRoute && curRoute.provider === pending.provider && curRoute.model === pending.model) {
            pendingEffort.delete(`${scope}:${peerId}`);
            await this.sender.sendMarkdown(target, `ℹ️ 当前已经是 ${pending.name} 了，没有做任何改动。`);
            return true;
          }
        }
        if (effPick === 'skip') {
          await this.manager.setModelOverride(scope, peerId, { provider: pending.provider, model: pending.model });
          pendingEffort.delete(`${scope}:${peerId}`);
          await this.sender.sendMarkdown(target, `✅ 模型已切换: ${pending.name}
思考强度：模型默认档`);
          return true;
        }
        let efforts: string[] = [];
        try { efforts = await this.manager.listReasoningEfforts(); } catch { /* ignore */ }
        if (!efforts.length) efforts = ['off', 'low', 'high', 'max'];
        const effort = efforts[effPick.idx];
        if (!effort) {
          await this.sender.sendMarkdown(target, '这个档位已不在列表里了，重新发 /model 刷一下~');
          return true;
        }
        await this.manager.setModelOverride(scope, peerId, { provider: pending.provider, model: pending.model, effort });
        pendingEffort.delete(`${scope}:${peerId}`);
        await this.sender.sendMarkdown(target, `✅ 模型已切换: ${pending.name}
思考强度：${effort}
立即生效，对话上下文保留。`);
```

</details>

**依据 3 · 源码核查**：[src/session/session-manager.ts:295-328](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/session/session-manager.ts#L295-L328)

分别处理无活跃会话、同档、强度变化和模型变化。

<details>
<summary>查看原文（34行）</summary>

```text
  async setModelOverride(scope: ChatScope, peerId: string, route: ModelRoute): Promise<void> {
    const key = this.sessionKey(scope, peerId);

    const record = this.sessions.get(key);
    if (!record) {
      // 无活跃会话：挂到当前/派生 sessionId(下次 create/resume 会命中)
      const sid = this.currentSessionId(key);
      this.modelResolver.setOverride(key, sid, route);
      this.logger.info(`model pref saved (no active session): key=${key} sid=${sid} → ${route.provider}/${route.model}`);
      return;
    }

    // ★ 2026-11-08：**同模型同强度 → 什么都不用做**（原来会白 fork 一个新会话）。
    //   仅"思考强度"变化也不 fork —— 强度是随请求下发的，改活动 agent 的选择即可。
    const cur = this.getEffectiveModel(scope, peerId);
    if (cur && cur.provider === route.provider && cur.model === route.model) {
      const sameEffort = (cur.effort ?? '') === (route.effort ?? '');
      if (sameEffort) {
        this.logger.info(`model pref unchanged: key=${key} → ${route.provider}/${route.model}${route.effort ? ` effort=${route.effort}` : ''}`);
        return;
      }
      try {
        this.applyModelRoute(record.agent, route, 'effort-only');
      } catch { /* fail-soft：拿不到 agent 就走下面的 fork */ }
      this.modelResolver.setOverride(key, record.sessionId, route);
      this.logger.info(`model effort updated (no fork): key=${key} effort=${route.effort}`);
      return;
    }

    // fork 旧会话历史作为 seed → 子会话保留上下文继续聊(换模型不丢记忆)
    await this.forkCurrentSession(key, record, route, true);
    // fork 后 record.sessionId = childId；override 挂到新会话(会话级绑定)
    this.modelResolver.setOverride(key, record.sessionId, route);
    this.logger.info(`model pref saved (forked): key=${key} sid=${record.sessionId} → ${route.provider}/${route.model}`);
```

</details>

**依据 4 · 源码核查**：[src/session/session-manager.ts:1000-1038](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/session/session-manager.ts#L1000-L1038)

读宿主状态及按上次观测值回写。

<details>
<summary>查看原文（39行）</summary>

```text
  adoptHostModel(scope: ChatScope, peerId: string, agent: unknown): boolean {
    try {
      const a = agent as { model?: { current?: () => unknown } } | undefined;
      const cur = a?.model && typeof a.model.current === 'function'
        ? (a.model.current() as { provider?: string; model?: string; reasoningEffort?: string } | undefined)
        : undefined;
      if (!cur?.provider || !cur?.model) return false;

      // ⚠️ 必须和**偏好文件里存的**比，不能和 getEffectiveModel() 比 ——
      //   后者自己就会读 model.current()，两边永远相等 ⇒ 永远不采纳（第一版就这么写错的）。
      const key = this.sessionKey(scope, peerId);
      const rec = this.sessions.get(key);
      const sid = rec?.sessionId ?? this.currentSessionId(key);
      const stored = this.modelResolver.getEffectiveRoute(key, sid);
      const hostEffort = typeof cur.reasoningEffort === 'string' ? cur.reasoningEffort : undefined;

      // ★ 只认"宿主变了"：与上次看到的一致 → 说明不是用户在界面上切的，直接不动（防拉锯）
      const hostKey = `${cur.provider}/${cur.model}/${hostEffort ?? ''}`;
      const lastSeen = this.lastHostModel.get(key);
      if (lastSeen === hostKey) return false;
      this.lastHostModel.set(key, hostKey);

      const sameRoute = !!stored && stored.provider === cur.provider && stored.model === cur.model;
      const sameEffort = (stored?.effort ?? '') === (hostEffort ?? '');
      if (sameRoute && sameEffort) return false;

      const route: ModelRoute = {
        provider: cur.provider,
        model: cur.model,
        ...(hostEffort ? { effort: hostEffort } : {}),
      };
      // 直接写偏好：**不能走 setModelOverride** —— 它现在"同模型同强度就 return"（防白 fork），
      //   而这里正是要把宿主的新值落盘（含 effort 变化），所以绕过去，只写存储。
      this.modelResolver.setOverride(key, sid, route);
      this.logger.info(
        `[model-sync] 采纳宿主界面选择: ${cur.provider}/${cur.model}${hostEffort ? ` effort=${hostEffort}` : ''}`
        + `（原: ${stored ? `${stored.provider}/${stored.model}${stored.effort ? ` effort=${stored.effort}` : ''}` : '无'}）`,
      );
      return true;
```

</details>

**依据 5 · 源码核查**：[src/session/session-manager.ts:1062-1102](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/session/session-manager.ts#L1062-L1102)

新宿主传强度，旧 options 路径只写模型。

<details>
<summary>查看原文（41行）</summary>

```text
      if (m && typeof m.current === 'function' && typeof m.select === 'function') {
        const cur = m.current();
        // ★ 2026-11-08 修：这里原来只看 provider/model —— 同模型只改**思考强度**时直接 return，
        //   强度根本没写进宿主 ⇒ 下一轮 adoptHostModel 又按宿主的旧强度把偏好改回去（主人实测：切 high 又变回 low）。
        const sameEffort = (cur?.reasoningEffort ?? '') === (route.effort ?? '');
        if (cur?.provider === route.provider && cur?.model === route.model && sameEffort) return;
        // 保留宿主可能存在的其它字段（reasoningEffort 等），只换 provider/model
        // 2026-11-08：模型路由里带思考强度就一起写进去（宿主 ModelSelection 支持 reasoningEffort）
        m.select({
          ...(cur ?? {}),
          provider: route.provider,
          model: route.model,
          ...(route.effort ? { reasoningEffort: route.effort } : {}),
        });
        this.logger.info(
          `getOrCreate: ${label} 模型覆盖(agent.model.select) ${cur?.provider ?? '?'}/${cur?.model ?? '?'} -> ${route.provider}/${route.model}`,
        );
        return;
      }
    } catch (err) {
      this.logger.warn(
        `getOrCreate: ${label} agent.model 选择失败，回落 options: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // ② 旧宿主：直接改 options（原行为）
    const liveOpts = a.options;
    if (!liveOpts) {
      // ③ 两条路都没有 —— 别静默：这类失败在用户侧表现为"切了没反应"，极难排查
      this.logger.warn(`getOrCreate: ${label} 无法应用模型路由（agent 既无 model 也无 options）: ${route.provider}/${route.model}`);
      return;
    }
    if (liveOpts.provider !== route.provider || liveOpts.model !== route.model) {
      (agent as unknown as { options: { provider: string; model: string } }).options = {
        ...liveOpts,
        provider: route.provider,
        model: route.model,
      };
      this.logger.info(
        `getOrCreate: ${label} 模型覆盖(options) ${liveOpts.provider}/${liveOpts.model} -> ${route.provider}/${route.model}`,
      );
```

</details>

**依据 6 · 源码核查**：[src/session/session-manager.ts:1626-1632](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/session/session-manager.ts#L1626-L1632)

首步挂接反向同步。

```text
          // ── 反向同步：宿主界面切了模型 → 跟着改偏好（2026-11-08 主人要求）──
          try {
            if (!Number.isFinite(currentStep) || currentStep <= 1) {
              const recSync = this.findByAgent(agent as never) as { scope?: ChatScope; peerId?: string } | undefined;
              if (recSync?.scope && recSync.peerId) this.adoptHostModel(recSync.scope, recSync.peerId, agent);
            }
          } catch (e) { this.logger?.debug?.('[model-sync] 异常(已忽略): ' + (e instanceof Error ? e.message : String(e))); }
```

#### 缺口

- 宿主或模型服务是否接受所选强度、两端交错时的最终选择未核实。
  **影响**：不能用卡片成功文案替代真实请求证据。
  **进一步探讨**：记录切换前后宿主 selection、下一次模型请求和会话 ID，覆盖只改强度、同模型默认、宿主回写及同时操作。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文件如何发回 QQ，哪些失败会造成漏投或重复？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

支持宿主 present 事件时，出站路由会在非静默闸门路径启动异步发送，把文件引用解析为本地路径或 URL，逐个调用 sendMedia。默认每次 deliver 的列表上限为四项，超过上限或抛错的文件汇总发提示，提示本身失败只写日志。相比手动回到 DSH 下载再上传 QQ，这把交付尝试接到了任务输出，但上传前已将整批路径记入正文去重集合。因此同轮正文里同路径的文件标记即使原尝试失败或超额也可能被剔除，用户需要回宿主核查和手工补发。单次列表限制不直接约束同轮多事件总数，路径去重也不提供对 QQ API 确认丢失的处理。本地解析支持绝对路径和相对 cwd，这层没有目录边界检查，实际可传范围还取决于宿主 present 和发送适配器。

#### 证据与依据

**依据 1 · 源码核查**：[src/transport/outbound.ts:472-504](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/transport/outbound.ts#L472-L504)

事件路由、静默判断和发送前路径登记。

<details>
<summary>查看原文（33行）</summary>

```text
      case 'deliverables/presented':
        this.onDeliverables(record, event);
        break;
    }
  }

  /**
   * present 声明的交付物：轮末把文件逐个发到当前会话（2026-10-27）。
   *
   * 宿主在 turn/end **之前**发这个事件，所以直接投递即可；不 await（发送失败已内部降级）。
   * 闸门静默的回合不发（模型既然决定不出声，就别甩文件）。
   */
  private onDeliverables(record: SessionRecord, event: DeliverablesPresentedEvent): void {
    if (this.gateSilenced.has(record.sessionKey)) {
      this.logger.debug(`im-qqbot: 闸门静默回合 → 跳过 ${event.files.length} 个交付物`);
      return;
    }
    this.logger.debug(
      `im-qqbot: deliverables/presented turn=${event.turn} callId=${event.callId} files=${event.files.length}`,
    );
    // 登记已交付路径：正文里若还写了 [MEDIA:file|同一文件]，send() 会剔除，避免重复发送
    const key = record.sessionKey;
    let set = this.deliveredFiles.get(key);
    if (set === undefined) {
      set = new Set<string>();
      this.deliveredFiles.set(key, set);
    }
    for (const file of event.files) set.add(normalizePathForCompare(resolvePresentedPath(file.path, this.config.cwd)));
    void this.deliverables.deliver(record, event.files).catch((err: unknown) => {
      this.logger.error(
        `im-qqbot: deliverables deliver failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    });
```

</details>

**依据 2 · 源码核查**：[src/transport/outbound.ts:757-760](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/transport/outbound.ts#L757-L760)

正文过滤已经登记的路径。

```text
      // 2026-10-27: 已被 present 直发的文件，正文里同路径的 [MEDIA:file|…] 标记剔除，避免一份文件发两遍
      const deduped = stripDeliveredFileMarkers(text, this.deliveredFiles.get(_record.sessionKey), this.config.cwd);
      if (deduped.trim() === '') return; // 整段只剩"已被 present 的同一文件"→ 不再发空消息
      text = deduped;
```

**依据 3 · 源码核查**：[src/transport/deliverables.ts:39-85](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/transport/deliverables.ts#L39-L85)

以事件列表为单位执行上限、逐项发送及失败提示。

<details>
<summary>查看原文（47行）</summary>

```text
  /** 轮末投递一批声明文件：逐个发送，未送达的聚合为一条文字提示 */
  public async deliver(record: SessionRecord, files: PresentedFileRef[]): Promise<void> {
    const limit = Math.max(1, this.config.sendFile?.maxFiles ?? 4);
    const cwd = this.config.cwd || process.cwd();
    const missed: string[] = [];
    let sent = 0;

    for (const [index, file] of files.entries()) {
      // 宿主给的是绝对路径；兼容 file:// 与历史相对路径（交给 resolveSource 统一解析）
      const src = resolveSource(file.path, cwd);
      const absPath = src.kind === 'localPath' ? src.path : src.url;
      const display = basename(absPath);
      if (index >= limit) {
        missed.push(`${display}（超出单轮投递上限 ${limit} 个，未发送）`);
        continue;
      }
      const target = this.resolveTarget ? this.resolveTarget(record) : record.replyTarget;
      try {
        const out = await this.sender.sendMedia(
          target,
          'file',
          src.kind === 'url' ? { url: src.url } : { localPath: src.path },
        );
        const id = out?.id;
        sent += 1;
        this.logger.info(
          `im-qqbot: 交付物已发送 ${display}${id ? ` (id=${id})` : ''} → ${target.scope}:${target.targetId}`,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`im-qqbot: 交付物发送失败 ${display}: ${msg}`);
        missed.push(`${display}（${msg.slice(0, 80)}）`);
      }
    }

    if (missed.length > 0) {
      const text = ['📎 已生成文件（未能直接发送）：', ...missed.map((name) => `- ${name}`)].join('\n');
      for (const chunk of chunkMarkdownText(text, this.config.textChunkLimit)) {
        try {
          const target = this.resolveTarget ? this.resolveTarget(record) : record.replyTarget;
          await this.sender.sendMarkdown(target, chunk);
        } catch (err) {
          this.logger.error(
            `im-qqbot: deliverables notice failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
```

</details>

**依据 4 · 源码核查**：[src/transport/rich-media.ts:114-125](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/transport/rich-media.ts#L114-L125)

投递器使用的路径和 URL 解析，不负责目录授权。

<details>
<summary>查看原文（12行）</summary>

```text
export function resolveSource(source: string, cwd: string | undefined): { kind: 'url'; url: string } | { kind: 'localPath'; path: string } {
  const s = source.trim();
  if (/^https?:\/\//i.test(s)) return { kind: 'url', url: s };
  if (s.startsWith('file://')) {
    try { return { kind: 'localPath', path: fileURLToPath(s) }; }
    catch { return { kind: 'localPath', path: s.replace(/^file:\/\//, '') }; }
  }
  // Windows 盘符或绝对路径
  if (/^[a-zA-Z]:[\\/]/.test(s) || s.startsWith('/')) return { kind: 'localPath', path: s };
  // 相对 → 相对 cwd
  return { kind: 'localPath', path: cwd ? path.resolve(cwd, s) : s };
}
```

</details>

#### 缺口

- 宿主声明和媒体适配器组合下的最终路径约束及 QQ 接受结果未核实。
  **影响**：含敏感文件的工作区不能据本层代码判断安全发送范围。
  **进一步探讨**：在隔离目录用样本文件核对宿主拒绝边界、QQ 接收确认以及上传和提示分别失败时的补发操作。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 群内收到消息是否等于具备变更或审批权限，什么场景可以试用？

**研究主题**：缺陷与关键质疑、采用判断

#### 完整回答

访问规则、命令和审批分别约束不同动作。bundle 的单聊和群默认开放，群要求提及。中间件把 access 模式和 allow 数组交给 SDK，空名单变成通配输入，因此试用需明确填写非空白名单并核对 SDK 实际拦截。自建命令分发会执行已声明的 authorized 回调，但 stop 和 bot-stop 在这一段前直接查找同 peer 活跃 agent 并尝试 cancel，不能把模型按钮的身份规则当作群内所有控制命令的边界。文本审批按待决编号要求发起者或管理员名单，并校验原单聊对象或群；按钮处理另读回调点击者并检查待决项和名单，此方法里没有与文本路径等价的原 peer 比较，平台事件约束还需验证。可控试用范围是独立 DSH profile、一个可信单聊和无敏感信息的任务，手工确认收件对象和宿主状态。出现群外人员能操作、状态与提示不符或附件缺失时停用渠道，回宿主完成。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:13-32](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/cordis.patch.yml#L13-L32)

默认启用提及规则，但访问模式为 open。

<details>
<summary>查看原文（20行）</summary>

```text
- insert:
    - id: im-qqbot
      name: '@zaofan/dsh-qqbot'
      config:
        appId: __FROM_ENV__
        appSecret: __FROM_ENV__
        # provider/model 留空：从宿主默认模型路由继承
        # 用户可通过 /model 命令在聊天中切换
        requireMention: true
        textChunkLimit: 4500
        sessionIdleTimeout: 1800000
        maxQueue: 20
        processingTimeoutMs: 120000
        historyLimit: 10
        access:
          c2cMode: open
          c2cAllow: []
          groupMode: open
          groupAllow: []
        debug: false
```

</details>

**依据 2 · 源码核查**：[src/gateway/middleware-setup.ts:163-181](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/gateway/middleware-setup.ts#L163-L181)

访问配置转交 SDK，空名单回落通配输入。

<details>
<summary>查看原文（19行）</summary>

```text
  // 2. 消息过滤：bot 回声 + 消息去重
  bot.use(messageFilter({ skipSelfEcho: false }));

  // 3. 访问控制（白名单/开放/禁用）
  bot.use(accessPolicy({
    c2c: {
      mode: config.access.c2cMode,
      allow: config.access.c2cAllow.length > 0 ? config.access.c2cAllow : ['*'],
    },
    group: {
      mode: config.access.groupMode,
      allow: config.access.groupAllow.length > 0 ? config.access.groupAllow : ['*'],
    },
    onBlock: (_mCtx, reason) => {
      if (config.debug) {
        logger.debug(`Access blocked: ${reason}`);
      }
    },
  }));
```

</details>

**依据 3 · 源码核查**：[src/gateway/middleware-setup.ts:420-454](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/gateway/middleware-setup.ts#L420-L454)

停止命令在常规授权回调前独立处理。

<details>
<summary>查看原文（35行）</summary>

```text
    if (name === 'stop' || name === 'bot-stop') {
      // 真正打断: cancel 当前 peer 的活跃回合(不只是消费消息)
      try {
        const isGroup = ctx.message?.kind === 'group';
        const scope = isGroup ? 'group' : 'c2c';
        const peerId = isGroup ? ctx.message.groupOpenid : ctx.message.senderId;
        const rec = peerId ? manager.findByPeer(scope as never, peerId) : undefined;
        if (rec && rec.agent && typeof rec.agent.cancel === 'function') {
          rec.agent.cancel({ kind: 'user' });
          try { await ctx.bot?.sendText(ctx.replyTarget, '⏹ 已停止当前生成'); } catch { /* ignore */ }
        } else {
          try { await ctx.bot?.sendText(ctx.replyTarget, '当前没有在生成的回合'); } catch { /* ignore */ }
        }
      } catch (e) { /* ignore */ }
      if (typeof ctx.stop === 'function') { ctx.stop('command:' + name); return; }
    }
    const cmd = cmdMap.get(name);
    if (!cmd) return next(); // 未知命令放行

    // ★ 2026-10-30 修（主人报「别人用 /preset、/model 照样把卡片发出来」）：
    //   本插件有**两条命令通道** —— ① SDK 的 slashCommand 中间件（会检查 cmd.authorized）
    //   ② 下面这套自建分发（直接 cmd.handler）。② 以前完全不看 authorized，
    //   于是白名单外的用户照样触发了 handler（卡片就发出去了）。
    //   这里补上同一口径的检查，与 slash-command.js 的 `if (auth !== true) { 发提示 + stop }` 一致。
    {
      const authFn = (cmd as { authorized?: (c: unknown) => boolean | string }).authorized;
      if (typeof authFn === 'function') {
        let auth: boolean | string = true;
        try { auth = authFn(ctx); } catch { auth = false; }
        if (auth !== true) {
          const authMsg = typeof auth === 'string' ? auth : '⚠️ 无权限执行此命令';
          try { await ctx.bot?.sendText(ctx.replyTarget, authMsg); } catch { /* ignore */ }
          if (typeof ctx.stop === 'function') { ctx.stop('command:unauthorized:' + name); return; }
          return next();
        }
```

</details>

**依据 4 · 源码核查**：[src/features/qq-approval.ts:245-287](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/features/qq-approval.ts#L245-L287)

文本审批的允许名单与原会话校验。

<details>
<summary>查看原文（43行）</summary>

```text
  private allowedDeciders(rec: { senderId?: string } | undefined): Set<string> {
    const out = new Set<string>();
    const sid = String(rec?.senderId ?? '').trim();
    if (sid) out.add(sid);
    try {
      for (const x of this.manager.adminOwners()) {
        const s = String(x ?? '').trim();
        if (s) out.add(s);
      }
    } catch { /* ignore */ }
    return out;
  }

  /**
   * 入站拦截(挂在 bot.on('message') 最前): 命中 /approve|/deny CODE 则结算并消费消息。
   * @returns true = 消息已被审批逻辑消费(调用方不要再派发给 agent)
   */
  async handleInbound(msg: ApprovableMessage, replyTarget: ReplyTarget): Promise<boolean> {
    const command = parseApprovalCommand(msg.content ?? '');
    if (!command) return false;

    const pending = this.pending.get(command.code);
    if (!pending) {
      try { await this.sender.sendMarkdown(replyTarget, '该权限申请不存在或已过期。'); } catch { /* ignore */ }
      return true;
    }

    // 双校验: "发起者本人 **或 主人白名单**" 且 "同一会话"(群聊里其他人看到 CODE 也不能批)
    // ⚠️ 2026-10-08 修：白名单以前只进了"发卡片时的可点名单"，这里却只认 rec.senderId
    //   ⇒ 主人能发得出 /approve 却被回"你无权处理"。现统一走 allowedDeciders(rec)。
    const rec = pending.record;
    const allowed = this.allowedDeciders(rec);
    const sameSender = allowed.has(String(msg.senderId ?? ''));
    const samePeer = rec.scope === 'c2c'
      ? msg.kind === 'c2c' && msg.senderId === rec.peerId
      : msg.kind === 'group' && msg.groupOpenid === rec.peerId;
    if (!sameSender || !samePeer) {
      this.logger.warn?.(`[qq-approval] /approve 被拒(非授权者): sender=${tail(msg.senderId)} allowed=[${[...allowed].map((x) => tail(x)).join(', ')}] scope=${String(rec.scope)} peer=${tail(rec.peerId)} samePeer=${String(samePeer)} code=${command.code}`);
      try { await this.sender.sendMarkdown(replyTarget, '你无权处理这项权限申请。'); } catch { /* ignore */ }
      return true;
    }

    this.settleWithReceipt(command.code, command.outcome, pending, replyTarget);
```

</details>

**依据 5 · 源码核查**：[src/features/qq-approval.ts:296-321](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/features/qq-approval.ts#L296-L321)

按钮实际检查点击者，比较路径与文字分支不同。

<details>
<summary>查看原文（26行）</summary>

```text
  async handleInteraction(event: unknown, replyTarget: ReplyTarget): Promise<boolean> {
    const e = event as {
      data?: { type?: number; resolved?: { button_data?: string } };
      group_member_openid?: string;
      user_openid?: string;
    };
    if (e?.data?.type !== 11) return false;
    const parsed = parseApprovalButton(e.data.resolved?.button_data);
    if (!parsed) return false;

    const pending = this.pending.get(parsed.code);
    if (!pending) {
      try { await this.sender.sendMarkdown(replyTarget, '该权限申请不存在或已过期。'); } catch { /* ignore */ }
      return true;
    }
    // 校验: "发起者本人 **或 主人白名单**"(c2c 看 user_openid; group 看 group_member_openid)
    //   —— 与发卡片时的可点名单同一口径（2026-10-08 修，详见 allowedDeciders 注释）。
    const presserId = String(e.group_member_openid ?? e.user_openid ?? '');
    const allowed = this.allowedDeciders(pending.record);
    if (!presserId || !allowed.has(presserId)) {
      this.logger.warn?.(`[qq-approval] 按钮被拒(非授权点击者): presser=${tail(presserId)} allowed=[${[...allowed].map((x) => tail(x)).join(', ')}] code=${parsed.code}`);
      try { await this.sender.sendMarkdown(replyTarget, '你无权处理这项权限申请。'); } catch { /* ignore */ }
      return true;
    }
    this.settleWithReceipt(parsed.code, parsed.act === 'allow' ? 'allowed-once' : 'rejected', pending, replyTarget);
    return true;
```

</details>

#### 缺口

- 真实平台回调对会话绑定和跨群按钮转发的限制未确认。
  **影响**：不能把回调名单判定视为端到端跨会话隔离。
  **进一步探讨**：在同群和另一个测试群以发起者、管理员和普通成员分别验证文本与按钮审批。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否减少同一任务在 QQ 与 Web 间切换造成的状态漂移？

**研究主题**：新假设与验证、效果与总成本、工程质量与复用

#### 完整回答

值得验证一个窄假设：给切模和投递分配各自明确的结果确认，能减少跨界面工作中重复重试和错误会话。现有实现会在下一步观察宿主模型变化，且在上传前过滤同路径正文标记。两者都省掉部分重复操作，但一个值或路径已登记，并不足以判断真实请求或收件已成功。对照现有实现，可试验为每个会话记录待确认的选择版本并回读下一次实际请求，为每个文件分别记录待发送、已确认和结果不明。遇到请求超时，优先核对远端已有记录，结果不明时保留人工补发而非无条件自动重试。用同一模型和同一组样本任务，交错触发 Web 与 QQ 切模、模拟成功和失败上传，比较每份正确交付的操作者步骤、误投、重复和漏投次数。若额外确认没有减少错误，或其延迟与人工复核抵消少复制的收益，就保留现有流程加人工回退。当前没有实际用时、模型账单或成功率对照。

#### 证据与依据

**依据 1 · 源码核查**：[src/session/session-manager.ts:1010-1038](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/session/session-manager.ts#L1010-L1038)

反向同步依据本地快照，不携带变更来源版本。

<details>
<summary>查看原文（29行）</summary>

```text
      const key = this.sessionKey(scope, peerId);
      const rec = this.sessions.get(key);
      const sid = rec?.sessionId ?? this.currentSessionId(key);
      const stored = this.modelResolver.getEffectiveRoute(key, sid);
      const hostEffort = typeof cur.reasoningEffort === 'string' ? cur.reasoningEffort : undefined;

      // ★ 只认"宿主变了"：与上次看到的一致 → 说明不是用户在界面上切的，直接不动（防拉锯）
      const hostKey = `${cur.provider}/${cur.model}/${hostEffort ?? ''}`;
      const lastSeen = this.lastHostModel.get(key);
      if (lastSeen === hostKey) return false;
      this.lastHostModel.set(key, hostKey);

      const sameRoute = !!stored && stored.provider === cur.provider && stored.model === cur.model;
      const sameEffort = (stored?.effort ?? '') === (hostEffort ?? '');
      if (sameRoute && sameEffort) return false;

      const route: ModelRoute = {
        provider: cur.provider,
        model: cur.model,
        ...(hostEffort ? { effort: hostEffort } : {}),
      };
      // 直接写偏好：**不能走 setModelOverride** —— 它现在"同模型同强度就 return"（防白 fork），
      //   而这里正是要把宿主的新值落盘（含 effort 变化），所以绕过去，只写存储。
      this.modelResolver.setOverride(key, sid, route);
      this.logger.info(
        `[model-sync] 采纳宿主界面选择: ${cur.provider}/${cur.model}${hostEffort ? ` effort=${hostEffort}` : ''}`
        + `（原: ${stored ? `${stored.provider}/${stored.model}${stored.effort ? ` effort=${stored.effort}` : ''}` : '无'}）`,
      );
      return true;
```

</details>

**依据 2 · 源码核查**：[src/transport/outbound.ts:484-504](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/transport/outbound.ts#L484-L504)

交付路径先登记，发送结果未反馈进这次登记。

<details>
<summary>查看原文（21行）</summary>

```text
  private onDeliverables(record: SessionRecord, event: DeliverablesPresentedEvent): void {
    if (this.gateSilenced.has(record.sessionKey)) {
      this.logger.debug(`im-qqbot: 闸门静默回合 → 跳过 ${event.files.length} 个交付物`);
      return;
    }
    this.logger.debug(
      `im-qqbot: deliverables/presented turn=${event.turn} callId=${event.callId} files=${event.files.length}`,
    );
    // 登记已交付路径：正文里若还写了 [MEDIA:file|同一文件]，send() 会剔除，避免重复发送
    const key = record.sessionKey;
    let set = this.deliveredFiles.get(key);
    if (set === undefined) {
      set = new Set<string>();
      this.deliveredFiles.set(key, set);
    }
    for (const file of event.files) set.add(normalizePathForCompare(resolvePresentedPath(file.path, this.config.cwd)));
    void this.deliverables.deliver(record, event.files).catch((err: unknown) => {
      this.logger.error(
        `im-qqbot: deliverables deliver failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    });
```

</details>

**依据 3 · 源码核查**：[src/transport/deliverables.ts:67-87](https://github.com/zaofan-make/dsh-qqbot/blob/584259d91e6bfafe469118118421348706961483/src/transport/deliverables.ts#L67-L87)

上传失败与失败提示发送失败是两个可分别触发的观察点。

<details>
<summary>查看原文（21行）</summary>

```text
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`im-qqbot: 交付物发送失败 ${display}: ${msg}`);
        missed.push(`${display}（${msg.slice(0, 80)}）`);
      }
    }

    if (missed.length > 0) {
      const text = ['📎 已生成文件（未能直接发送）：', ...missed.map((name) => `- ${name}`)].join('\n');
      for (const chunk of chunkMarkdownText(text, this.config.textChunkLimit)) {
        try {
          const target = this.resolveTarget ? this.resolveTarget(record) : record.replyTarget;
          await this.sender.sendMarkdown(target, chunk);
        } catch (err) {
          this.logger.error(
            `im-qqbot: deliverables notice failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
    }
    this.logger.debug(`im-qqbot: deliverables delivered sent=${sent} missed=${missed.length}`);
```

</details>

#### 缺口

- 缺少同条件合格任务对照。
  **影响**：不能确认减少多少返工或是否覆盖确认开销。
  **进一步探讨**：记录每份正确送达附件的模型、出站次数、人工步骤和耗时，分别核对现金与人工。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
