# dsh-feishu-bot

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[f4d5216](https://github.com/452926826/dsh-feishu-bot/tree/f4d521615a9ca7ff7cbe2953a2a84074a7768091)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-feishu-bot) [![npm 30d 884](https://img.shields.io/static/v1?label=npm+30d&message=884&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feishu-bot) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feishu-bot)
<!-- END META -->

> **实现功能**：通过飞书WebSocket操作DSH项目与会话，支持扫码绑定、聊天审批和完成通知。

> **核心亮点**：把扫码创建应用、WebSocket、项目/会话选择和一次审批接到DSH，省手接远程入口；交付仍为原Agent文本。详见[Q01](#research-q01)。

> **风险与缺陷**：授权与审批按chat共享、空ACL放行，晚批准不绑定请求；内存去重、广播与失败写队列不能保证任务/收件人一致。详见[Q04](#research-q04)。

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
  - [Q01 · 飞书入口实际完成什么任务，相比手动桥接有何增量？](#detail-section-11)
  - [Q02 · 扫码凭证与状态界面是否形成可信绑定？](#detail-section-12)
  - [Q03 · 选择按聊天保存是否意味着项目/会话隔离，并发失败怎样处理？](#detail-section-13)
  - [Q04 · 审批能确认原始发起者批准了正确操作吗？](#detail-section-14)
  - [Q05 · 回复、完成广播与重连保证何种交付？](#detail-section-15)
  - [Q06 · 启动与三阶段成本需要哪些真实条件？](#detail-section-16)
  - [Q07 · 采用与可证伪改进方向是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：从飞书远程操作本机DSH，需受信聊天及最低权限Profile。详见[Q01](#research-q01)。

DSH本地Web或手写飞书/DSH桥接；本项把设备绑定、远程选择、审批和回复统一。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 飞书命令/聊天 | 项目会话选择与Agent操作 | 非DSH用户命令，chat共享 |
| 扫码应用绑定 | 免手抄App Secret | 受权扫码/QR保密 |
| 宿主审批桥 | 一次approve/reject | chat级、signal依宿主 |
| 回复与完成广播 | 聊天继续操作 | 全文扩散需独立授权 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Node20+/DSH服务/SDK | Agent、WS与审批 | 固定peer/host契约 |
| 飞书应用权限与可达网络 | 扫码/发消息/收事件 | 发布及owner字段需成立 |
| 允许聊天与最低Profile | 控制远程权限 | 空集合开放，群成员共享 |
| 可写凭证/状态目录 | 重启复用 | 明文秘密、备份与写失败恢复 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 最低权限与允许群配置 | 维护者 | 独立广播收件人授权 |
| 扫码/本地凭证启动 | 有创建权限者 | 身份/连通与bound分别核 |
| 选项目/会话发文本 | 聊天成员 | 确认目标与共享上下文 |
| 审批/查看最终回复 | 受信审批人 | 不把旧批准用于新请求 |
| 故障核接受/投递状态 | 维护者 | 结果未知不盲重发任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/DSH、飞书应用和SDK、凭证/QR本地存储 | 有权限者扫码创建授权、发布bot、配置允许聊天及最低宿主权限 | 飞书/模型实际费用与安装工时未知 |
| 持续使用 | WebSocket与模型请求、历史/selection文件、通知发送额度 | 维护聊天成员/审批职责，核广播收件人与对话目标 | 不提供费用统计，长回复/重复通知增加消息数，净节省未量化 |
| 失败恢复 | 凭证/selection备份、重连/再绑定、重发可能重复执行 | 核消息是否已入Agent、审批是否过期及回答是否仅投递失败，修磁盘后重启store | 无持久消息收据/幂等重放，工时取决于故障，不填0 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 远程操作 | chat选择与conversation串行 | 项目ACL/并发选择一致性 |
| 一次审批 | 原chat路由及abort取消 | 原sender/请求nonce/本地超时 |
| 消息返回 | 占位更新/Unicode分片 | 持久幂等与逐目标投递 |

> **思考**：授权与审批按chat共享、空ACL放行，晚批准不绑定请求；内存去重、广播与失败写队列不能保证任务/收件人一致。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把扫码创建应用、WebSocket、项目/会话选择和一次审批接到DSH，省手接远程入口；交付仍为原Agent文本。详见[Q01](#research-q01)。

把扫码创建应用、WebSocket、项目/会话选择和一次审批接到DSH，省手接远程入口；交付仍为原Agent文本。详见[Q01](#research-q01)。

coordinator/bridge/store职责分开和会话队列有价值；连接重连不等任务正好一次。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

授权与审批按chat共享、空ACL放行，晚批准不绑定请求；内存去重、广播与失败写队列不能保证任务/收件人一致。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，受信owner/允许群与最低权限Profile，审批/广播分别明确，未知投递不重放任务。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

扫码/远程操作组合有源码增量；群级审批与状态/投递边界限制可信多人使用；身份收据设计未验证。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、package.json、lib/index.js、lib/approval.js、lib/binding-status.js、lib/client.js、lib/controller.js、lib/feishu.js、lib/harness.js、lib/notifications.js、lib/registration.js、lib/state.js、test/approval.test.js、test/notifications.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读发布lib全部host模块及client、作者文档与代表mock测试；不执行目标/宿主/飞书账号。
- 下一步：以同群异人、旧批准、并发选择/完成、磁盘失败、崩溃接受和分片半投递检查身份与任务收据。

**分析版本**

- **仓库**：[452926826/dsh-feishu-bot](https://github.com/452926826/dsh-feishu-bot)
- **版本号**：0.1.4（[固定提交 f4d5216](https://github.com/452926826/dsh-feishu-bot/tree/f4d521615a9ca7ff7cbe2953a2a84074a7768091)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

持久远程任务身份与callID/nonce/TTL审批、逐收件人投递收据，未知结果不重放，按同群错批/崩溃反例证伪。详见[Q07](#research-q07)。

以同群异人、旧批准、并发选择/完成、磁盘失败、崩溃接受和分片半投递检查身份与任务收据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 535 | — | — | 7372 |
| .js | source | 11 | 1192 | 1174 | 10 | — |
| .mjs | source | 3 | 80 | 72 | 0 | — |
| .ts | source | 9 | 1218 | 1105 | 1 | — |
| .js | test | 10 | 560 | 509 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/452926826/dsh-feishu-bot/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/452926826/dsh-feishu-bot/issues?q=is%3Aissue+created%3A2026-09-22T10%3A29%3A01.036Z..2026-10-22T10%3A29%3A01.036Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/452926826/dsh-feishu-bot/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A29%3A01.036Z..2026-10-22T10%3A29%3A01.036Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版扫码绑定与远程会话/审批/投递能否形成可解释可信流程。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 飞书入口实际完成什么任务，相比手动桥接有何增量？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向需要从飞书操作本机DSH项目/对话的用户。WebSocket免公网callback，文本被包装成source=user提交到现有Profile权限的Agent，得到最后assistant文本；支持项目/会话选择、两条历史、创建对话、聊天内一次审批与完成提醒。合格结果是目标会话处理输入且回复可返回原聊天，不能把whenIdle等同任务业务验收。原替代为在DSH本地Web操作或手接飞书事件/DSH API，本项的增量是扫码创建应用、保存选择、host审批和回复/通知串起完整远程操作流程，并未创造新Agent推理或新任务产物。

发布入口lib/index.js实际注册approval/request、一个绑定状态HTTP路由及异步bot生命周期。输入只接受飞书text事件，文件/图片/语音不支持；没有注册DSH模型工具、Skill或Host用户命令，/lp等是飞书controller解析文本。项目列表来自全部workspaceRegistry，不只projectsRoot；root仅约束新建项目位置，不是会话访问沙箱。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-25](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/README.md#L5-L25)

作者用途/绑定。

<details>
<summary>查看原文（21行）</summary>

````text
Use DeepSeek Harness through a Feishu application bot over a WebSocket long connection, without exposing a public callback URL. On first start, the plugin can create and bind a Feishu application through a QR code, so App ID and App Secret do not need to be copied manually.

## QR-code binding

When no credentials are available, the plugin starts Feishu's OAuth 2.0 Device Authorization Grant application-creation flow, renders a QR code in the DSH terminal, and writes it to:

```text
~/.dsh/feishu-bot/feishu-bind-qr.png
```

Scan the code in Feishu and create and authorize the application on the confirmation page. The scanning user must have permission to create a custom application in the tenant. The QR code normally expires after about ten minutes; restart DSH to generate another one.

After confirmation, the plugin:

1. Requests the `im:message:send_as_bot` permission.
2. Subscribes to `im.message.receive_v1` events.
3. Saves the returned credentials and the scanner's `open_id` to `~/.dsh/feishu-bot/credentials.json` with mode `0600`, then validates them with the tenant token API. A post-creation validation failure is logged but does not discard the credentials or create another bot.
4. Allows only the scanning user by default. Additional group chats can be allowed through `FEISHU_ALLOWED_CHATS`.
5. Deletes the consumed QR code and connects to Feishu WebSocket immediately.

Publish the application as instructed by Feishu, then add the bot to a group or start a direct conversation. No public callback URL is required.
````

</details>

**依据 2 · 源码核查**：[lib/index.js:10-39](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/index.js#L10-L39)

服务及审批监听。

<details>
<summary>查看原文（30行）</summary>

```text
export const name = 'feishu-bot';
export const inject = ['agents', 'sessions', 'sessionPersistence', 'workspaceRegistry', 'webServer', 'approval'];
function csv(value) {
    return new Set((value ?? '').split(',').map(item => item.trim()).filter(Boolean));
}
function completionTargets() {
    return csv(process.env.FEISHU_NOTIFY_CHATS ?? process.env.FEISHU_ALLOWED_CHATS);
}
export function apply(ctx) {
    const logger = ctx.logger('feishu-bot');
    const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '.', '.dsh');
    const pluginHome = join(home, 'feishu-bot');
    const credentialsPath = process.env.FEISHU_CREDENTIALS_PATH ?? join(pluginHome, 'credentials.json');
    const qrPath = process.env.FEISHU_QR_PATH ?? join(pluginHome, 'feishu-bind-qr.png');
    const projectsRoot = resolveProjectsRoot(process.env.FEISHU_PROJECTS_ROOT ?? process.cwd());
    const statePath = process.env.FEISHU_STATE_PATH ?? join(pluginHome, 'state.json');
    const abort = new AbortController();
    let bot;
    let websocket = 'disconnected';
    const activeChats = new Set();
    const approvals = new ApprovalCoordinator(async (chatId, text) => {
        if (bot === undefined)
            throw new Error('Feishu bot is not ready');
        await bot.sendText(chatId, text);
    });
    ctx.on('approval/request', (request, next) => {
        return handleApprovalRequest(approvals, request, next);
    }, { prepend: true });
    ctx.effect(() => ctx.webServer.register({
        kind: 'exact',
```

</details>

**依据 3 · 源码核查**：[lib/feishu.js:43-78](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/feishu.js#L43-L78)

只收文本。

<details>
<summary>查看原文（36行）</summary>

```text
            return;
        const senderOpenId = data.sender?.sender_id?.open_id;
        if (!isSenderAllowed(message.chat_id, senderOpenId, this.options.allowedChats, this.options.allowedUsers))
            return;
        if (this.seen.has(message.message_id))
            return;
        this.seen.add(message.message_id);
        if (this.seen.size > 1000)
            this.seen.delete(this.seen.values().next().value);
        let text;
        try {
            const content = JSON.parse(message.content ?? '{}');
            text = typeof content.text === 'string' ? content.text.trim() : '';
        }
        catch {
            text = '';
        }
        if (text.length === 0)
            return;
        await runWithThinkingMessage({
            onMessage: () => this.options.onMessage({
                chatId: message.chat_id,
                messageId: message.message_id,
                ...(senderOpenId === undefined ? {} : { senderOpenId }),
                text,
            }),
            sendThinking: () => this.sendOne(message.chat_id, '思考中…'),
            update: (messageId, reply) => this.update(messageId, message.chat_id, reply),
            send: reply => this.send(message.chat_id, reply),
            onError: this.options.onError,
        });
    }
    async send(chatId, text) {
        for (const chunk of splitText(text, 3500))
            await this.sendOne(chatId, chunk);
    }
```

</details>

**依据 4 · 源码核查**：[lib/harness.js:72-96](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/harness.js#L72-L96)

项目/会话来源。

<details>
<summary>查看原文（25行）</summary>

```text
    async listProjects() {
        return this.ctx.workspaceRegistry.list().map(workspace => ({
            id: workspace.id,
            name: workspace.title,
            path: workspace.path,
        }));
    }
    async createProject(name) {
        const safe = this.safeProjectName(name);
        const path = join(this.projectsRoot, safe);
        await mkdir(path, { recursive: false });
        const workspace = await this.ctx.workspaceRegistry.create(path, safe);
        return { id: workspace.id, name: workspace.title, path: workspace.path };
    }
    async listConversations(projectId) {
        const workspace = this.ctx.workspaceRegistry.list().find(item => item.id === projectId);
        if (workspace === undefined)
            throw new Error('当前项目不存在，请重新使用 /up 选择项目。');
        const rows = [];
        for (const id of workspace.sessionIds) {
            const session = this.ctx.agents.get(id)?.session;
            const events = session?.events ?? (await this.ctx.sessionPersistence.inspect(id)).events;
            rows.push({ id, name: titleFor(id, events) });
        }
        return rows;
```

</details>

**依据 5 · 源码核查**：[lib/harness.js:138-154](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/harness.js#L138-L154)

运行/回复。

<details>
<summary>查看原文（17行）</summary>

```text
    async runConversation(conversationId, text, chatId) {
        const route = this.approvals.bind(conversationId, chatId);
        try {
            const id = asSessionId(conversationId);
            const agent = await this.ensureAgent(id);
            const fromSeq = agent.session.seq;
            agent.followup(userMessage(text));
            await agent.whenIdle();
            await this.ctx.sessions.flush(agent.session);
            const reply = lastAssistantText(agent.session.events, fromSeq);
            try {
                await this.onCompleted?.({ conversationId, chatId, reply });
            }
            catch {
                // Completion notifications are best-effort and must not hide a completed answer.
            }
            return reply;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 扫码凭证与状态界面是否形成可信绑定？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

启动优先环境App ID+Secret，再读本地凭证，否则用SDK registerApp createOnly申请发消息权限和接收事件；扫码者需创建应用权限，凭证临时文件0600后rename，QR写后chmod0600，消费后删除QR。tenant token验证失败仅warn并保留凭证，避免重复建bot，但bound是凭证存在/已保存，并非验证成功或连通保证。错误expired_token可无限续发QR，其他错误最多三次、access_denied/abort不重试；QR渲染异步未等待授权完成，存在晚写QR的竞争，不能将删除当确定无残留。绑定完整短时URL也进入logger，日志接触者同样需受信。

GET状态路由未检查method/Origin/peer/调用者，未绑定状态会返回含device authorization的完整QR data URL；宿主webServer的外层访问控制必须成立，不能说本路由自带管理员鉴权，也不据此声称公网已暴露。已绑定只回masked ID不回Secret，这是有益最小展示。

readBindingView先stored再environment，实际start却environment优先，因此两者同时存在时UI可能展示旧应用/owner；readStored只检查appId不要求Secret，损坏凭证也可呈bound。ownerOpenId缺失而allowedChats为空时允许集合均空，bot放行任何可联系聊天；QR默认扫码者限制成立需SDK确实返回open_id，手动环境凭证不附owner且不会加载旧owner。配置与实际身份应分别核。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:39-76](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/index.js#L39-L76)

状态路由及启动优先级。

<details>
<summary>查看原文（38行）</summary>

```text
        kind: 'exact',
        path: '/api/plugins/feishu-binding/status',
        handler: async (_request, response) => {
            try {
                const environment = environmentCredentials();
                const view = await readBindingView({
                    credentialsPath,
                    qrPath,
                    websocket,
                    ...(environment === undefined ? {} : { environmentCredentials: environment }),
                });
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.setHeader('Cache-Control', 'no-store');
                response.end(JSON.stringify(view));
            }
            catch (error) {
                logger.error(error instanceof Error ? error.stack ?? error.message : String(error));
                response.statusCode = 500;
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(JSON.stringify({ error: 'Failed to read Feishu binding status' }));
            }
        },
    }), 'feishu-bot: binding status route');
    const start = async () => {
        const environment = environmentCredentials();
        if (environment === undefined && process.env.FEISHU_REBIND === 'true') {
            await removeCredentials(credentialsPath);
            logger.info('removed saved Feishu credentials; starting a new QR binding');
        }
        const credentials = environment ?? await loadCredentials(credentialsPath) ?? await registerUntilComplete({
            credentialsPath,
            qrPath,
            logger,
            signal: abort.signal,
        });
        if (abort.signal.aborted)
            return;
```

</details>

**依据 2 · 源码核查**：[lib/registration.js:9-16](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/registration.js#L9-L16)

重试分类。

```text
}
export function shouldRetryRegistration(error, attempt) {
    const code = registrationErrorCode(error);
    if (code === 'access_denied' || code === 'abort')
        return false;
    if (code === 'expired_token')
        return true;
    return attempt < 3;
```

**依据 3 · 源码核查**：[lib/registration.js:48-109](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/registration.js#L48-L109)

创建/保存/QR异步及验证。

<details>
<summary>查看原文（62行）</summary>

```text
    }
}
export async function saveCredentials(path, credentials, userInfo) {
    await mkdir(dirname(path), { recursive: true });
    const temporary = `${path}.tmp`;
    const stored = {
        appId: credentials.appId,
        appSecret: credentials.appSecret,
        createdAt: new Date().toISOString(),
        ...(userInfo?.open_id === undefined && credentials.ownerOpenId === undefined
            ? {}
            : { userOpenId: userInfo?.open_id ?? credentials.ownerOpenId }),
        ...(userInfo?.tenant_brand === undefined ? {} : { tenantBrand: userInfo.tenant_brand }),
    };
    await writeFile(temporary, `${JSON.stringify(stored, null, 2)}\n`, { mode: 0o600 });
    await rename(temporary, path);
}
export async function registerByQrCode(options) {
    const result = await lark.registerApp({
        source: 'dsh-feishu-bot',
        ...(options.signal === undefined ? {} : { signal: options.signal }),
        createOnly: true,
        appPreset: {
            name: 'DeepSeek Harness',
            desc: '通过飞书与本机 DeepSeek Harness 对话',
        },
        addons: {
            preset: false,
            scopes: { tenant: ['im:message:send_as_bot'] },
            events: { items: { tenant: ['im.message.receive_v1'] } },
        },
        onQRCodeReady: info => {
            void Promise.all([
                writeQrCode(options.qrPath, info.url),
                process.env.FEISHU_QR_TERMINAL === 'false' ? Promise.resolve(undefined) : renderTerminalQr(info.url),
            ]).then(([, terminal]) => {
                options.logger.info(`scan Feishu QR code: ${options.qrPath}`);
                if (terminal !== undefined)
                    options.logger.info(`\n${terminal}`);
                options.logger.info(`binding link (expires in ${info.expireIn}s): ${info.url}`);
            }).catch(error => options.logger.warn(`failed to render QR code: ${String(error)}`));
        },
        onStatusChange: info => {
            options.logger.info(`Feishu binding status: ${info.status}`);
        },
    });
    const credentials = {
        appId: result.client_id,
        appSecret: result.client_secret,
        ...(result.user_info?.open_id === undefined ? {} : { ownerOpenId: result.user_info.open_id }),
    };
    await saveCredentials(options.credentialsPath, credentials, result.user_info);
    await rm(options.qrPath, { force: true });
    options.logger.info(`Feishu binding complete; credentials saved to ${options.credentialsPath}`);
    try {
        await validateCredentials(credentials);
        options.logger.info('Feishu credentials validated with the tenant token API');
    }
    catch (error) {
        options.logger.warn(`Feishu credentials were saved but tenant token validation failed: ${String(error)}`);
    }
    return credentials;
```

</details>

**依据 4 · 源码核查**：[lib/registration.js:115-122](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/registration.js#L115-L122)

QR权限。

```text
    await mkdir(dirname(path), { recursive: true });
    await QRCode.toFile(path, url, {
        type: 'png',
        width: 512,
        margin: 2,
        errorCorrectionLevel: 'M',
    });
    await chmod(path, 0o600);
```

**依据 5 · 源码核查**：[lib/binding-status.js:8-36](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/binding-status.js#L8-L36)

状态优先级与QR返回。

<details>
<summary>查看原文（29行）</summary>

```text
    const stored = await readStoredCredentials(options.credentialsPath);
    const credentials = stored ?? (options.environmentCredentials === undefined ? undefined : {
        appId: options.environmentCredentials.appId,
        userOpenId: options.environmentCredentials.ownerOpenId,
        createdAt: undefined,
        tenantBrand: undefined,
    });
    if (credentials !== undefined) {
        return {
            state: 'bound',
            appIdMasked: maskIdentifier(credentials.appId),
            ...(credentials.userOpenId === undefined ? {} : { ownerOpenIdMasked: maskIdentifier(credentials.userOpenId) }),
            ...(credentials.tenantBrand === undefined ? {} : { tenantBrand: credentials.tenantBrand }),
            boundAt: credentials.createdAt ?? 'environment',
            websocket: options.websocket,
        };
    }
    try {
        const [image, info] = await Promise.all([readFile(options.qrPath), stat(options.qrPath)]);
        return {
            state: 'waiting',
            qrDataUrl: `data:image/png;base64,${image.toString('base64')}`,
            qrUpdatedAt: info.mtime.toISOString(),
            websocket: options.websocket,
        };
    }
    catch (error) {
        if (error.code !== 'ENOENT')
            throw error;
```

</details>

**依据 6 · 源码核查**：[lib/binding-status.js:40-53](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/binding-status.js#L40-L53)

只检查appId。

<details>
<summary>查看原文（14行）</summary>

```text
async function readStoredCredentials(path) {
    try {
        const parsed = JSON.parse(await readFile(path, 'utf8'));
        if (typeof parsed.appId !== 'string' || parsed.appId.length === 0)
            return undefined;
        return {
            appId: parsed.appId,
            ...(typeof parsed.userOpenId === 'string' ? { userOpenId: parsed.userOpenId } : {}),
            ...(typeof parsed.tenantBrand === 'string' ? { tenantBrand: parsed.tenantBrand } : {}),
            ...(typeof parsed.createdAt === 'string' ? { createdAt: parsed.createdAt } : {}),
        };
    }
    catch (error) {
        if (error.code === 'ENOENT')
```

</details>

**依据 7 · 源码核查**：[lib/feishu.js:137-142](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/feishu.js#L137-L142)

空ACL放行。

```text
export function isSenderAllowed(chatId, senderOpenId, allowedChats, allowedUsers) {
    if (allowedChats.size === 0 && allowedUsers.size === 0)
        return true;
    if (allowedChats.has(chatId))
        return true;
    return senderOpenId !== undefined && allowedUsers.has(senderOpenId);
```

#### 缺口

- 宿主webServer访问控制与SDK扫码user_info契约
  **影响**：未绑定QR的可读人群、默认owner限制与状态展示可信度依赖这两项
  **进一步探讨**：核固定宿主路由认证及SDK确切返回字段，比较环境/本地凭证并存、缺owner及仅appId损坏文件

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 选择按聊天保存是否意味着项目/会话隔离，并发失败怎样处理？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

选择以chat_id保存，controller无sender维度，群成员共享项目/会话上下文；allowedChats是授权整个群，owner用户可在其他聊天操作，二者是OR不是双重校验。允许聊天可列出所有DSH项目并读选中会话历史，选择隔离只是界面状态隔离，没有每聊天资源ACL。/uc不带参数可进入lastCompleted会话但保留旧projectId，后续/lc和/nc仍用旧项目，当前project与conversation可不一致。索引选择重新列实时数据，不保留/lp或/lc快照，列表变化可能选到不同对象。

converse按conversation串行并catch前项失败避免毒化，这是同会话执行顺序保护；同chat的选择命令、完成标记和多conversation不串行。JsonSelectionStore.get拿copy后set整份，两个请求可覆盖对方选择/lastCompleted；activeChats只是Set，一条先完成会delete即使同chat另条仍运行，不能准确实现忙中免打扰。

selection内存先更新，再writeTail.then(persist)，若一次persist拒绝，后续then不设rejection恢复，会一直拒绝不再写盘，内存却继续变更；临时文件固定名且无跨进程锁，坏JSONload Promise亦缓存失败。不能把rename原子替换等同业务读改写事务。createProject mkdir成功registry失败会留目录，createConversation在attach失败前存handle，没有补偿dispose。这些是失败恢复/身份条件，不是普通没实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/feishu.js:137-142](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/feishu.js#L137-L142)

OR授权。

```text
export function isSenderAllowed(chatId, senderOpenId, allowedChats, allowedUsers) {
    if (allowedChats.size === 0 && allowedUsers.size === 0)
        return true;
    if (allowedChats.has(chatId))
        return true;
    return senderOpenId !== undefined && allowedUsers.has(senderOpenId);
```

**依据 2 · 源码核查**：[lib/controller.js:52-60](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/controller.js#L52-L60)

完成标记读改写。

```text
    async markConversationCompleted(chatId, conversationId) {
        const selection = await this.selections.get(chatId);
        await this.selections.set(chatId, { ...selection, lastCompletedConversationId: conversationId });
    }
    async handle(chatId, input) {
        const text = input.trim();
        if (text.length === 0)
            return { text: HELP };
        if (text === '/approve' || text === '/批准') {
```

**依据 3 · 源码核查**：[lib/controller.js:111-150](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/controller.js#L111-L150)

uc保留project及普通消息目标。

<details>
<summary>查看原文（40行）</summary>

```text
        if (text.startsWith('/uc')) {
            const rawIndex = argumentAfter(text, '/uc');
            if (rawIndex.length === 0) {
                if (selection.lastCompletedConversationId === undefined)
                    return { text: '还没有可进入的已完成对话。请使用 /uc + 索引进入对话。' };
                const conversation = await this.bridge.conversationInfo(selection.lastCompletedConversationId);
                if (conversation === undefined)
                    return { text: '最近完成的对话已不存在，请使用 /lc 查看当前项目对话。' };
                const next = { ...selection, conversationId: conversation.id };
                delete next.lastCompletedConversationId;
                await this.selections.set(chatId, next);
                const history = await this.bridge.recentMessages(conversation.id, 2);
                const suffix = history.length === 0 ? '\n暂无历史记录。' : `\n最近 2 条记录：\n${history.join('\n')}`;
                return { text: `已进入对话：${conversation.name}${suffix}`, selection: next };
            }
            if (selection.projectId === undefined)
                return { text: '请先使用 /up + 项目名或索引 进入项目。' };
            const index = Number(rawIndex);
            if (!Number.isSafeInteger(index) || index < 1)
                return { text: '用法：/uc + 索引，例如 /uc + 1' };
            const conversations = await this.bridge.listConversations(selection.projectId);
            const conversation = conversations[index - 1];
            if (conversation === undefined)
                return { text: `对话索引超出范围：${rawIndex}` };
            const next = { ...selection, conversationId: conversation.id };
            delete next.lastCompletedConversationId;
            await this.selections.set(chatId, next);
            const history = await this.bridge.recentMessages(conversation.id, 2);
            const suffix = history.length === 0 ? '\n暂无历史记录。' : `\n最近 2 条记录：\n${history.join('\n')}`;
            return { text: `已进入对话：${conversation.name}${suffix}`, selection: next };
        }
        if (text === '/nc') {
            if (selection.projectId === undefined)
                return { text: '请先使用 /up + 项目名或索引 进入项目。' };
            const conversation = await this.bridge.createConversation(selection.projectId);
            const next = { ...selection, conversationId: conversation.id };
            await this.selections.set(chatId, next);
            return { text: `已创建并进入对话：${conversation.name}`, selection: next };
        }
        if (text.startsWith('/'))
```

</details>

**依据 4 · 源码核查**：[lib/harness.js:72-105](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/harness.js#L72-L105)

全局列表/创建与attach。

<details>
<summary>查看原文（34行）</summary>

```text
    async listProjects() {
        return this.ctx.workspaceRegistry.list().map(workspace => ({
            id: workspace.id,
            name: workspace.title,
            path: workspace.path,
        }));
    }
    async createProject(name) {
        const safe = this.safeProjectName(name);
        const path = join(this.projectsRoot, safe);
        await mkdir(path, { recursive: false });
        const workspace = await this.ctx.workspaceRegistry.create(path, safe);
        return { id: workspace.id, name: workspace.title, path: workspace.path };
    }
    async listConversations(projectId) {
        const workspace = this.ctx.workspaceRegistry.list().find(item => item.id === projectId);
        if (workspace === undefined)
            throw new Error('当前项目不存在，请重新使用 /up 选择项目。');
        const rows = [];
        for (const id of workspace.sessionIds) {
            const session = this.ctx.agents.get(id)?.session;
            const events = session?.events ?? (await this.ctx.sessionPersistence.inspect(id)).events;
            rows.push({ id, name: titleFor(id, events) });
        }
        return rows;
    }
    async createConversation(projectId) {
        const workspace = this.ctx.workspaceRegistry.list().find(item => item.id === projectId);
        if (workspace === undefined)
            throw new Error('当前项目不存在，请重新使用 /up 选择项目。');
        const sessionId = asSessionId(`session-${randomUUID()}`);
        const handle = await this.ctx.agents.create({ sessionId, meta: { cwd: workspace.path } });
        this.handles.set(sessionId, handle);
        await workspace.attachSession(sessionId);
```

</details>

**依据 5 · 源码核查**：[lib/harness.js:123-133](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/harness.js#L123-L133)

conversation串行。

<details>
<summary>查看原文（11行）</summary>

```text
    async converse(conversationId, text, chatId) {
        const previous = this.queues.get(conversationId) ?? Promise.resolve();
        const task = previous.catch(() => undefined).then(() => this.runConversation(conversationId, text, chatId));
        this.queues.set(conversationId, task);
        try {
            return await task;
        }
        finally {
            if (this.queues.get(conversationId) === task)
                this.queues.delete(conversationId);
        }
```

</details>

**依据 6 · 源码核查**：[lib/state.js:10-35](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/state.js#L10-L35)

内存/毒化writeTail。

<details>
<summary>查看原文（26行）</summary>

```text
    async get(chatId) {
        const state = await this.load();
        return { ...(state.chats[chatId] ?? {}) };
    }
    async set(chatId, selection) {
        const state = await this.load();
        state.chats[chatId] = { ...selection };
        this.writeTail = this.writeTail.then(() => this.persist(state));
        await this.writeTail;
    }
    load() {
        this.loaded ??= readFile(this.path, 'utf8')
            .then(text => JSON.parse(text))
            .catch((error) => {
            if (error.code === 'ENOENT')
                return { chats: {} };
            throw error;
        });
        return this.loaded;
    }
    async persist(state) {
        await mkdir(dirname(this.path), { recursive: true });
        const temporary = `${this.path}.tmp`;
        await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
        await rename(temporary, this.path);
    }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:94-103](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/index.js#L94-L103)

active Set。

<details>
<summary>查看原文（10行）</summary>

```text
            allowedChats: csv(process.env.FEISHU_ALLOWED_CHATS),
            allowedUsers: new Set(credentials.ownerOpenId === undefined ? [] : [credentials.ownerOpenId]),
            onMessage: async (message) => {
                activeChats.add(message.chatId);
                try {
                    return (await controller.handle(message.chatId, message.text)).text;
                }
                finally {
                    activeChats.delete(message.chatId);
                }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 审批能确认原始发起者批准了正确操作吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

有实质安全流程增量。runConversation期间bind session→chat，第二chat不能抢已绑定session route；pending按chat最多一个，respond只匹配该chat，信号abort会cancel，route dispose也cancel，缺路由/忙/发送抛错返回undefined交下一宿主审批通道。工具参数按callId在event里找并截前2000字符，给读者操作上下文。

但审批授权仅chat不是原始sender；入群白名单后任何群成员可/approve，controller从未把senderOpenId传给coordinator。文本/approve没有callID/nonce/过期时刻，晚到针对旧请求的批准可被当前pending消费。coordinator没有自己的timeout，只依request.signal，README的超时拒绝需宿主提供取消时限，不能当本地定时保证。send成功也只以Promise不抛为依据，Feishu sendOne未检查response.code/缺message_id，业务失败可能不抛导致pending等待。

原始参数可能带秘密且没有脱敏，截断不等完整审查；一chat同时操多个session时第二审批退给其它通道，不是自动拒绝或安全通过。可继续核可信单用户/群内统一管理员场景，但不能宣称只原始发起人能批或所有超时自拒。

#### 证据与依据

**依据 1 · 源码核查**：[lib/approval.js:8-40](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/approval.js#L8-L40)

路由/信号/发送。

<details>
<summary>查看原文（33行）</summary>

```text
    bind(sessionId, chatId) {
        const existing = this.routes.get(sessionId);
        if (existing !== undefined && existing !== chatId)
            return { dispose: () => undefined };
        this.routes.set(sessionId, chatId);
        return {
            dispose: () => {
                if (this.routes.get(sessionId) !== chatId)
                    return;
                this.routes.delete(sessionId);
                this.settle(chatId, 'cancelled');
            },
        };
    }
    async request(prompt) {
        const chatId = this.routes.get(prompt.sessionId);
        if (chatId === undefined || this.pending.has(chatId))
            return undefined;
        if (prompt.signal?.aborted === true)
            return 'cancelled';
        let resolve;
        const answer = new Promise(settle => { resolve = settle; });
        const pending = { resolve, ...(prompt.signal === undefined ? {} : { signal: prompt.signal }) };
        const onAbort = () => this.settle(chatId, 'cancelled');
        pending.onAbort = onAbort;
        this.pending.set(chatId, pending);
        prompt.signal?.addEventListener('abort', onAbort, { once: true });
        try {
            await this.send(chatId, formatApprovalPrompt(prompt));
        }
        catch {
            this.pending.delete(chatId);
            prompt.signal?.removeEventListener('abort', onAbort);
```

</details>

**依据 2 · 源码核查**：[lib/approval.js:43-59](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/approval.js#L43-L59)

chat级settle。

<details>
<summary>查看原文（17行）</summary>

```text
        return answer;
    }
    respond(chatId, decision) {
        const pending = this.pending.get(chatId);
        if (pending === undefined)
            return '当前没有待审批操作。';
        this.settle(chatId, decision === 'approve' ? 'allowed-once' : 'rejected');
        return decision === 'approve' ? '已批准本次操作。' : '已拒绝本次操作。';
    }
    settle(chatId, outcome) {
        const pending = this.pending.get(chatId);
        if (pending === undefined)
            return;
        this.pending.delete(chatId);
        if (pending.signal !== undefined && pending.onAbort !== undefined) {
            pending.signal.removeEventListener('abort', pending.onAbort);
        }
```

</details>

**依据 3 · 源码核查**：[lib/approval.js:61-92](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/approval.js#L61-L92)

callId取参/截断。

<details>
<summary>查看原文（32行）</summary>

```text
    }
}
export async function handleApprovalRequest(approvals, request, next) {
    const call = request.callId === undefined ? undefined : request.agent.session.events.find(event => {
        if (event.type !== 'tool/call')
            return false;
        return (event.data ?? {}).callId === request.callId;
    });
    const args = (call?.data ?? {});
    const outcome = await approvals.request({
        sessionId: request.agent.session.id,
        toolName: request.toolName,
        ...(request.reason === undefined ? {} : { reason: request.reason }),
        ...(typeof args?.arguments === 'string' ? { arguments: args.arguments } : {}),
        ...(request.signal === undefined ? {} : { signal: request.signal }),
    });
    return outcome ?? next();
}
export function formatApprovalPrompt(prompt) {
    const lines = [
        'Harness 请求审批',
        `工具：${prompt.toolName}`,
    ];
    if (prompt.reason !== undefined && prompt.reason.trim().length > 0)
        lines.push(`原因：${prompt.reason.trim()}`);
    if (prompt.arguments !== undefined && prompt.arguments.trim().length > 0) {
        const value = Array.from(prompt.arguments.trim()).slice(0, 2000).join('');
        lines.push(`参数：\n${value}${Array.from(prompt.arguments.trim()).length > 2000 ? '\n…' : ''}`);
    }
    lines.push('', '回复 /approve 批准本次操作，或 /reject 拒绝。');
    return lines.join('\n');
}
```

</details>

**依据 4 · 源码核查**：[lib/controller.js:62-67](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/controller.js#L62-L67)

审批仅chat。

```text
        }
        if (text === '/reject' || text === '/拒绝') {
            return { text: this.bridge.respondToApproval(chatId, 'reject') };
        }
        const selection = await this.selections.get(chatId);
        if (text === '/help')
```

**依据 5 · 源码核查**：[lib/index.js:94-101](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/index.js#L94-L101)

丢sender身份。

```text
            allowedChats: csv(process.env.FEISHU_ALLOWED_CHATS),
            allowedUsers: new Set(credentials.ownerOpenId === undefined ? [] : [credentials.ownerOpenId]),
            onMessage: async (message) => {
                activeChats.add(message.chatId);
                try {
                    return (await controller.handle(message.chatId, message.text)).text;
                }
                finally {
```

**依据 6 · 源码核查**：[lib/feishu.js:83-95](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/feishu.js#L83-L95)

send未核code。

<details>
<summary>查看原文（13行）</summary>

```text
                receive_id: chatId,
                msg_type: 'text',
                content: JSON.stringify({ text }),
            },
        });
        return response.data?.message_id;
    }
    async update(messageId, chatId, text) {
        const [first, ...rest] = splitText(text, 3500);
        await this.client.im.message.update({
            path: { message_id: messageId },
            data: { msg_type: 'text', content: JSON.stringify({ text: first ?? '' }) },
        });
```

</details>

**依据 7 · 源码核查**：[test/approval.test.js:72-97](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/test/approval.test.js#L72-L97)

跨chat抢路由与fallback断言。

<details>
<summary>查看原文（26行）</summary>

```text
  assert.equal(await pending, 'allowed-once')
  assert.equal(nextCalls, 0)
})

test('does not let a second chat steal an active session route', async () => {
  const approvals = new ApprovalCoordinator(async () => undefined)
  const first = approvals.bind('session-1', 'chat-1')
  const second = approvals.bind('session-1', 'chat-2')
  const pending = approvals.request({ sessionId: 'session-1', toolName: 'bash' })
  await Promise.resolve()

  assert.equal(approvals.respond('chat-2', 'approve'), '当前没有待审批操作。')
  assert.equal(approvals.respond('chat-1', 'reject'), '已拒绝本次操作。')
  assert.equal(await pending, 'rejected')
  second.dispose()
  first.dispose()
})

test('passes approvals without a Feishu route to the next answerer', async () => {
  const approvals = new ApprovalCoordinator(async () => undefined)
  const outcome = await handleApprovalRequest(approvals, {
    agent: { session: { id: 'other-session', events: [] } },
    toolName: 'edit',
  }, async () => 'rejected')
  assert.equal(outcome, 'rejected')
})
```

</details>

#### 缺口

- 宿主审批signal的超时/撤回契约和飞书SDK业务失败是否reject
  **影响**：本地没有超时且不核code，不能保证未投递/过期审批一定退出
  **进一步探讨**：核固定宿主取消语义及SDK错误形态，按延迟旧批准、同chat两session和返回非0 code反例检验

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 回复、完成广播与重连保证何种交付？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

接收message_id在执行前写内存seen，最多1000个FIFO，重启清空；失败已经消费不能同进程重试，旧ID被挤出/重启则可重做，没有持久事件收据/幂等key。WebSocket SDK autoReconnect及90s ping帮助恢复连接，不证明消息正好一次处理。

thinking占位后运行Agent，update失败回落send完整回复；如果update第一段成功但后续分片失败，fallback可能重复已经发出的内容。API create/update未核业务code，send的message_id只用于占位更新，不是读者收到或业务验收。回复按Unicode code point 3500分片，避免拆代理对但不是字节/平台总大小保证。失败文字含error.message，可能带路径/SDK细节。

完成通知只由本bot runConversation调用onCompleted，不是全局agent completion事件，README“每个对话完成”不能外推本地Web或别插件会话。目标为FEISHU_NOTIFY_CHATS，否则回退FEISHU_ALLOWED_CHATS，加原chat再排除其它活跃chat；会把完整reply广播到其它允许群，是配置层明确的数据扩散。先mark lastCompleted再send，发送失败仍可改选择；Promise.all一个失败由bridge吞，其他发送仍继续，无持久重试或逐收件人投递状态。源chat同时收到完成通知与最终回复，是两个路径，不能视为去重投递。stop仅关WS，不cancel在途Agent/queue或dispose保留handles，reload前必须辨认旧任务是否仍在运行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/feishu.js:43-78](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/feishu.js#L43-L78)

seen与接收。

<details>
<summary>查看原文（36行）</summary>

```text
            return;
        const senderOpenId = data.sender?.sender_id?.open_id;
        if (!isSenderAllowed(message.chat_id, senderOpenId, this.options.allowedChats, this.options.allowedUsers))
            return;
        if (this.seen.has(message.message_id))
            return;
        this.seen.add(message.message_id);
        if (this.seen.size > 1000)
            this.seen.delete(this.seen.values().next().value);
        let text;
        try {
            const content = JSON.parse(message.content ?? '{}');
            text = typeof content.text === 'string' ? content.text.trim() : '';
        }
        catch {
            text = '';
        }
        if (text.length === 0)
            return;
        await runWithThinkingMessage({
            onMessage: () => this.options.onMessage({
                chatId: message.chat_id,
                messageId: message.message_id,
                ...(senderOpenId === undefined ? {} : { senderOpenId }),
                text,
            }),
            sendThinking: () => this.sendOne(message.chat_id, '思考中…'),
            update: (messageId, reply) => this.update(messageId, message.chat_id, reply),
            send: reply => this.send(message.chat_id, reply),
            onError: this.options.onError,
        });
    }
    async send(chatId, text) {
        for (const chunk of splitText(text, 3500))
            await this.sendOne(chatId, chunk);
    }
```

</details>

**依据 2 · 源码核查**：[lib/feishu.js:83-134](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/feishu.js#L83-L134)

发送/更新及fallback。

<details>
<summary>查看原文（52行）</summary>

```text
                receive_id: chatId,
                msg_type: 'text',
                content: JSON.stringify({ text }),
            },
        });
        return response.data?.message_id;
    }
    async update(messageId, chatId, text) {
        const [first, ...rest] = splitText(text, 3500);
        await this.client.im.message.update({
            path: { message_id: messageId },
            data: { msg_type: 'text', content: JSON.stringify({ text: first ?? '' }) },
        });
        for (const chunk of rest)
            await this.sendOne(chatId, chunk);
    }
}
export async function runWithThinkingMessage(options) {
    let thinkingId;
    try {
        thinkingId = await options.sendThinking();
    }
    catch (error) {
        options.onError(error);
    }
    try {
        const reply = await options.onMessage();
        if (thinkingId !== undefined) {
            try {
                await options.update(thinkingId, reply);
                return;
            }
            catch (error) {
                options.onError(error);
            }
        }
        await options.send(reply);
    }
    catch (error) {
        options.onError(error);
        const detail = error instanceof Error ? error.message : String(error);
        const failure = `操作失败：${detail}`;
        if (thinkingId !== undefined) {
            try {
                await options.update(thinkingId, failure);
                return;
            }
            catch (updateError) {
                options.onError(updateError);
            }
        }
        await options.send(failure).catch(options.onError);
```

</details>

**依据 3 · 源码核查**：[lib/feishu.js:143-161](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/feishu.js#L143-L161)

分片。

<details>
<summary>查看原文（19行）</summary>

```text
}
export function splitText(text, maxLength) {
    const characters = Array.from(text);
    if (characters.length <= maxLength)
        return [text];
    const chunks = [];
    let offset = 0;
    while (characters.length - offset > maxLength) {
        const window = characters.slice(offset, offset + maxLength);
        const newline = window.lastIndexOf('\n');
        const length = newline > maxLength / 2 ? newline : maxLength;
        chunks.push(characters.slice(offset, offset + length).join(''));
        offset += length;
        if (characters[offset] === '\n')
            offset++;
    }
    if (offset < characters.length)
        chunks.push(characters.slice(offset).join(''));
    return chunks;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:15-16](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/index.js#L15-L16)

通知默认。

```text
function completionTargets() {
    return csv(process.env.FEISHU_NOTIFY_CHATS ?? process.env.FEISHU_ALLOWED_CHATS);
```

**依据 5 · 源码核查**：[lib/index.js:80-88](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/index.js#L80-L88)

先mark后发完整回复。

```text
        const notify = async ({ conversationId, chatId, reply }) => {
            const targets = completionNotificationTargets(completionTargets(), chatId, activeChats);
            const info = await bridge.conversationInfo(conversationId);
            const title = info?.name ?? conversationId;
            const text = `对话已完成：${title}\n${reply}\n\n回复 /uc 可直接进入最近完成的对话。`;
            await Promise.all([...targets].map(async (target) => {
                await controller.markConversationCompleted(target, conversationId);
                await bot?.sendText(target, text);
            }));
```

**依据 6 · 源码核查**：[lib/notifications.js:1-8](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/notifications.js#L1-L8)

目标排除。

```text
export function completionNotificationTargets(configured, originatingChatId, activeChats) {
    const targets = new Set(configured);
    targets.add(originatingChatId);
    for (const chatId of activeChats) {
        if (chatId !== originatingChatId)
            targets.delete(chatId);
    }
    return targets;
```

**依据 7 · 源码核查**：[lib/harness.js:138-166](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/harness.js#L138-L166)

completion局部调用与handles。

<details>
<summary>查看原文（29行）</summary>

```text
    async runConversation(conversationId, text, chatId) {
        const route = this.approvals.bind(conversationId, chatId);
        try {
            const id = asSessionId(conversationId);
            const agent = await this.ensureAgent(id);
            const fromSeq = agent.session.seq;
            agent.followup(userMessage(text));
            await agent.whenIdle();
            await this.ctx.sessions.flush(agent.session);
            const reply = lastAssistantText(agent.session.events, fromSeq);
            try {
                await this.onCompleted?.({ conversationId, chatId, reply });
            }
            catch {
                // Completion notifications are best-effort and must not hide a completed answer.
            }
            return reply;
        }
        finally {
            route.dispose();
        }
    }
    async ensureAgent(id) {
        const live = this.ctx.agents.get(id);
        if (live !== undefined)
            return live;
        const handle = await this.ctx.agents.resume({ resumeSessionId: id });
        this.handles.set(id, handle);
        return handle.agent;
```

</details>

**依据 8 · 源码核查**：[lib/index.js:122-136](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/index.js#L122-L136)

stop范围。

<details>
<summary>查看原文（15行）</summary>

```text
    ctx.effect(() => {
        void start().catch(error => {
            if (!abort.signal.aborted)
                logger.error(error instanceof Error ? error.stack ?? error.message : String(error));
        });
        return async () => {
            abort.abort();
            await bot?.stop();
            websocket = 'disconnected';
        };
    }, 'feishu-bot: binding and websocket');
}
async function registerUntilComplete(options) {
    let attempt = 0;
    while (true) {
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 启动与三阶段成本需要哪些真实条件？

**研究主题**：效果与总成本、依赖、兼容与流程、工程质量与复用

#### 完整回答

Node>=20、Cordis/DSH peer区间、Lark SDK和QR库，硬注入agents/sessions/persistence/workspace/webServer/approval，即使只用bot也依赖这些服务。Webclient需要module loader/React/locale/slots，读取状态不自动轮询、需刷新。凭证/selection使用DSH_HOME默认目录，环境配置路径可改；QR/Secret和历史都要求主机文件与日志权限，0600是新建权限并非所有环境上通用加密。飞书应用创建/发布/聊天可达、网络与Profile能力是采用条件，不能按免公网callback误解为本地离线。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/DSH、飞书应用和SDK、凭证/QR本地存储 | 有权限者扫码创建授权、发布bot、配置允许聊天及最低宿主权限 | 飞书/模型实际费用与安装工时未知 |
| 持续使用 | WebSocket与模型请求、历史/selection文件、通知发送额度 | 维护聊天成员/审批职责，核广播收件人与对话目标 | 不提供费用统计，长回复/重复通知增加消息数，净节省未量化 |
| 失败恢复 | 凭证/selection备份、重连/再绑定、重发可能重复执行 | 核消息是否已入Agent、审批是否过期及回答是否仅投递失败，修磁盘后重启store | 无持久消息收据/幂等重放，工时取决于故障，不填0 |

检查发布lib全部host模块及client，代表测试是mock SDK/host/store断言，覆盖路由不能抢、允许聊天、通知排除等，无本轮目标执行。源码分层利于替换fake依赖，Promise队列和Unicode分片可借鉴；但测试成功/源码结构不等端到端身份或投递合同。金额/人时/节省无数据，按减少本地切换和可解释审批判断，不据Star/包存在推效果。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:53-74](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/package.json#L53-L74)

运行/peer/依赖。

<details>
<summary>查看原文（22行）</summary>

```text
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-session": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-session-persistence": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-session-title": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-workspace": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-user-approval": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0"
  },
  "dependencies": {
    "@larksuiteoapi/node-sdk": "^1.57.0",
    "qrcode": "^1.5.4"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": "0.1.1-rc.2",
    "@deepseek-ai/dsh-host-webserver": "0.1.1-rc.2",
    "@deepseek-ai/dsh-llm": "0.1.1-rc.2",
    "@deepseek-ai/dsh-session": "0.1.1-rc.2",
    "@deepseek-ai/dsh-session-persistence": "0.1.1-rc.2",
    "@deepseek-ai/dsh-session-title": "0.1.1-rc.2",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:10-24](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/index.js#L10-L24)

服务/路径。

<details>
<summary>查看原文（15行）</summary>

```text
export const name = 'feishu-bot';
export const inject = ['agents', 'sessions', 'sessionPersistence', 'workspaceRegistry', 'webServer', 'approval'];
function csv(value) {
    return new Set((value ?? '').split(',').map(item => item.trim()).filter(Boolean));
}
function completionTargets() {
    return csv(process.env.FEISHU_NOTIFY_CHATS ?? process.env.FEISHU_ALLOWED_CHATS);
}
export function apply(ctx) {
    const logger = ctx.logger('feishu-bot');
    const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '.', '.dsh');
    const pluginHome = join(home, 'feishu-bot');
    const credentialsPath = process.env.FEISHU_CREDENTIALS_PATH ?? join(pluginHome, 'credentials.json');
    const qrPath = process.env.FEISHU_QR_PATH ?? join(pluginHome, 'feishu-bind-qr.png');
    const projectsRoot = resolveProjectsRoot(process.env.FEISHU_PROJECTS_ROOT ?? process.cwd());
```

</details>

**依据 3 · 源码核查**：[lib/client.js:29-48](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/client.js#L29-L48)

手动加载/刷新。

<details>
<summary>查看原文（20行）</summary>

```text

    let clientContext
    function FeishuSettingsTab() {
      const [state, setState] = React.useState({ kind: "loading" })
      const [reload, setReload] = React.useState(0)
      React.useEffect(() => {
        let live = true
        const load = async () => {
          try {
            const response = await fetch('/api/plugins/feishu-binding/status', { cache: 'no-store' })
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            const value = await response.json()
            if (!live) return
            setState({ kind: "ready", value })
          } catch (error) {
            if (live) setState({ kind: "error", message: String(error) })
          }
        }
        void load()
        return () => { live = false }
```

</details>

**依据 4 · 源码核查**：[test/approval.test.js:1-29](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/test/approval.test.js#L1-L29)

mock审批断言。

<details>
<summary>查看原文（29行）</summary>

```text
import test from 'node:test'
import assert from 'node:assert/strict'
import { ApprovalCoordinator, handleApprovalRequest } from '../lib/approval.js'

test('routes an approval to the originating chat and allows it once', async () => {
  const sent = []
  const approvals = new ApprovalCoordinator(async (chatId, text) => sent.push({ chatId, text }))
  const route = approvals.bind('session-1', 'chat-1')

  const pending = approvals.request({
    sessionId: 'session-1',
    toolName: 'bash',
    reason: '需要写入工作区',
    arguments: '{"command":"npm install"}',
  })
  await Promise.resolve()

  assert.equal(sent.length, 1)
  assert.equal(sent[0].chatId, 'chat-1')
  assert.match(sent[0].text, /bash/u)
  assert.match(sent[0].text, /npm install/u)
  assert.equal(approvals.respond('chat-1', 'approve'), '已批准本次操作。')
  assert.equal(await pending, 'allowed-once')
  assert.equal(approvals.respond('chat-1', 'approve'), '当前没有待审批操作。')
  route.dispose()
})

test('rejects only the pending approval for that chat', async () => {
  const approvals = new ApprovalCoordinator(async () => undefined)
```

</details>

**依据 5 · 源码核查**：[test/notifications.test.js:1-14](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/test/notifications.test.js#L1-L14)

纯目标计算。

<details>
<summary>查看原文（14行）</summary>

```text
import assert from 'node:assert/strict'
import test from 'node:test'
import { completionNotificationTargets } from '../lib/notifications.js'

test('does not notify a chat while another conversation is active there', () => {
  assert.deepEqual(
    completionNotificationTargets(new Set(['chat-active', 'chat-idle']), 'chat-source', new Set(['chat-active'])),
    new Set(['chat-idle', 'chat-source']),
  )
})

test('always keeps the originating chat in completion targets', () => {
  assert.deepEqual(completionNotificationTargets(new Set(), 'chat-source', new Set()), new Set(['chat-source']))
})
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 采用与可证伪改进方向是什么？

**研究主题**：采用判断、贡献与相对优势、新假设与验证

#### 完整回答

建议观察，先限定可信owner与明确允许群、最小权限Profile、无敏感广播的任务。扫码免手抄密钥、私网长连接与项目/会话/审批串联是实际流程增量；最终交付仍是原Agent文本，新增聊天可达性不代表新业务验收物。关键限制是群级而非人级审批、默认空ACL开放、选择/广播跨项目、非持久去重及磁盘写队列毒化，读者需按共享群/多租户风险判断。不是因本轮不冒烟而降级。

可推未验证“远程任务与审批收据”。参照当前chat级pending和内存seen，入口持久化tenant/chat/sender/messageID与目标workspace/session/version，审批绑定callID/nonce/显示摘要与TTL，旧批准只匹配原请求；分别记录Agent已接收/执行结束/API接受/逐目标投递状态，未知投递不自动重放任务。配置改变需显式更新授权集合，broadcast是单独授权而非继承可操作群；selection用版本CAS并让失败队列可恢复。

最小反例包括同群另一人批准、旧批准到达新请求、同chat同时选项目与completion、磁盘失败再恢复、崩溃在Agent接受和发回复之间、分片半成功。若出现身份错批、目标串用或重放重复执行，则否定收据保证；持久/审批维护工时若超过减少的操作成本，则不支持经济性。未实现验证，不把该方向计入现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/approval.js:21-49](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/approval.js#L21-L49)

chat pending参照。

<details>
<summary>查看原文（29行）</summary>

```text
    }
    async request(prompt) {
        const chatId = this.routes.get(prompt.sessionId);
        if (chatId === undefined || this.pending.has(chatId))
            return undefined;
        if (prompt.signal?.aborted === true)
            return 'cancelled';
        let resolve;
        const answer = new Promise(settle => { resolve = settle; });
        const pending = { resolve, ...(prompt.signal === undefined ? {} : { signal: prompt.signal }) };
        const onAbort = () => this.settle(chatId, 'cancelled');
        pending.onAbort = onAbort;
        this.pending.set(chatId, pending);
        prompt.signal?.addEventListener('abort', onAbort, { once: true });
        try {
            await this.send(chatId, formatApprovalPrompt(prompt));
        }
        catch {
            this.pending.delete(chatId);
            prompt.signal?.removeEventListener('abort', onAbort);
            return undefined;
        }
        return answer;
    }
    respond(chatId, decision) {
        const pending = this.pending.get(chatId);
        if (pending === undefined)
            return '当前没有待审批操作。';
        this.settle(chatId, decision === 'approve' ? 'allowed-once' : 'rejected');
```

</details>

**依据 2 · 源码核查**：[lib/feishu.js:43-59](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/feishu.js#L43-L59)

内存去重参照。

<details>
<summary>查看原文（17行）</summary>

```text
            return;
        const senderOpenId = data.sender?.sender_id?.open_id;
        if (!isSenderAllowed(message.chat_id, senderOpenId, this.options.allowedChats, this.options.allowedUsers))
            return;
        if (this.seen.has(message.message_id))
            return;
        this.seen.add(message.message_id);
        if (this.seen.size > 1000)
            this.seen.delete(this.seen.values().next().value);
        let text;
        try {
            const content = JSON.parse(message.content ?? '{}');
            text = typeof content.text === 'string' ? content.text.trim() : '';
        }
        catch {
            text = '';
        }
```

</details>

**依据 3 · 源码核查**：[lib/state.js:14-18](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/state.js#L14-L18)

整份状态写入。

```text
    async set(chatId, selection) {
        const state = await this.load();
        state.chats[chatId] = { ...selection };
        this.writeTail = this.writeTail.then(() => this.persist(state));
        await this.writeTail;
```

**依据 4 · 源码核查**：[lib/index.js:80-103](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/lib/index.js#L80-L103)

广播/共享chat参照。

<details>
<summary>查看原文（24行）</summary>

```text
        const notify = async ({ conversationId, chatId, reply }) => {
            const targets = completionNotificationTargets(completionTargets(), chatId, activeChats);
            const info = await bridge.conversationInfo(conversationId);
            const title = info?.name ?? conversationId;
            const text = `对话已完成：${title}\n${reply}\n\n回复 /uc 可直接进入最近完成的对话。`;
            await Promise.all([...targets].map(async (target) => {
                await controller.markConversationCompleted(target, conversationId);
                await bot?.sendText(target, text);
            }));
        };
        bridge = new DshHarnessBridge(ctx, projectsRoot, approvals, notify);
        controller = new FeishuCommandController(bridge, selections);
        bot = new FeishuBot({
            ...credentials,
            allowedChats: csv(process.env.FEISHU_ALLOWED_CHATS),
            allowedUsers: new Set(credentials.ownerOpenId === undefined ? [] : [credentials.ownerOpenId]),
            onMessage: async (message) => {
                activeChats.add(message.chatId);
                try {
                    return (await controller.handle(message.chatId, message.text)).text;
                }
                finally {
                    activeChats.delete(message.chatId);
                }
```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
