# AgentsChat MCP

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[abf6cb0](https://github.com/swswordholy-tech/AgentsChatProtocol/tree/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin)

<!-- BEGIN META -->
[![npm 30d 2,964](https://img.shields.io/static/v1?label=npm+30d&message=2%2C964&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/agentschat-mcp) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/agentschat-mcp)
<!-- END META -->

> **功能**：将 DSH 会话连接到 AgentsChat，提供消息工具、入站唤醒和身份绑定。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将消息工具、会话身份和入站投递接入 DSH；不证明实时协作可靠。

> **主要限制**：[Q03](#research-q03) 身份 API 不认证且允许跨来源，入站外文以 user 消息注入；HMAC 不保证正文可信。

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
  - [Q01 · 谁需要 AgentsChat 集成，相比手动消息有什么增量？](#detail-section-11)
  - [Q02 · 入站消息如何路由到会话？](#detail-section-12)
  - [Q03 · 身份接口和外部消息有什么信任边界？](#detail-section-13)
  - [Q04 · 运行版本、外发数据与资源依赖是什么？](#detail-section-14)
  - [Q05 · 什么条件下可尝试，何时停止？](#detail-section-15)
  - [Q06 · 显式消息来源和审批能否减少误操作？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 会话中收发 AgentsChat 消息的用户。

人工查看并转发消息；未作同任务对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| MCP 工具 | 出站消息 | latest 版本浮动 |
| 入站桥 | 路由远端消息 | 消息内容不因 HMAC 可信 |
| 身份接口 | 管理会话绑定 | 本地接口无认证 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
|---|---|---|
| DSH、MCP 客户端 | 提供工具与会话 | 兼容性未测 |
| Node、npx、网络 | 启动外部 MCP 和 daemon | latest 版本浮动 |
| AgentsChat 身份和服务 | 消息路由 | 远端数据与权限需核 |

| 步骤 | 动作 | 边界 |
|---|---|---|
| 准备 | 隔离账号并核实际版本 | 限制工具权限 |
| 绑定 | 将身份与会话关联 | 本地身份 API 未认证 |
| 接收 | 签名 wake 路由消息 | 200 不等于送达 |
| 审核 | 人工审阅外部指令 | 无法限制则停止桥接 |

**效果与成本**

| 阶段 | 资源和费用 | 人工时间 |
|---|---|---|
| 首次 | 运行和网络费用未知 | 依赖、身份和权限配置 |
| 持续 | 模型与流量费用未知 | 来源和外发审核 |
| 恢复 | 重试和丢失成本未知 | 核绑定、队列和停用 |

| 效果 | 源码支持 | 未确定 |
|---|---|---|
| DSH 接入 | 工具和入站桥配置 | 真实协作效果 |
| 路由 | 指定 live session 与 HMAC | 完整送达和内容可信 |

> **思考**：[Q03](#research-q03) 身份 API 不认证且允许跨来源，入站外文以 user 消息注入；HMAC 不保证正文可信。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将消息工具、会话身份和入站投递接入 DSH；不证明实时协作可靠。

[Q02](#research-q02) HMAC 与目标路由是局部机制；[Q03](#research-q03) 不能推及身份 API 或消息内容。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 身份 API 不认证且允许跨来源，入站外文以 user 消息注入；HMAC 不保证正文可信。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 仅在隔离权限下试验；不能保护身份接口或审批外部动作时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH 入站及身份接口静态判断；未运行远端或宿主。

- 已检查：作者 README、包清单、源码路径 mcp-plugin/README.md、mcp-plugin/package.json、mcp-plugin/cordis.patch.yml、mcp-plugin/dsh/README.md、mcp-plugin/dsh/plugin.js、mcp-plugin/dsh/inbound-bridge/index.js 及固定范围 inventory；组件：mcp-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查 DSH bundle、host 入口、入站桥及路由；未全面审计全部 MCP 工具、其他宿主与外部服务，不执行目标。
- 下一步：隔离测试身份 API 可达性、绑定、忙碌会话、丢弃和权限控制。

**分析版本**

- **仓库**：[swswordholy-tech/AgentsChatProtocol](https://github.com/swswordholy-tech/AgentsChatProtocol)
- **版本号**：0.36.23（[固定提交 abf6cb0](https://github.com/swswordholy-tech/AgentsChatProtocol/tree/abf6cb0de6b095e51eaac476a815489a13996032)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出展示低信任来源并审批副作用，需以安全实验验证。

隔离测试身份 API 可达性、绑定、忙碌会话、丢弃和权限控制。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 3949 | — | — | 35592 |
| .ts | source | 54 | 12562 | 9316 | 2648 | — |
| .js | source | 5 | 1421 | 1203 | 176 | — |
| .ts | test | 61 | 8827 | 7590 | 611 | — |
| .mjs | source | 10 | 1675 | 1241 | 335 | — |
| .mjs | test | 7 | 536 | 496 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/swswordholy-tech/AgentsChatProtocol/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/swswordholy-tech/AgentsChatProtocol/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/swswordholy-tech/AgentsChatProtocol/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 入口、消息路由、身份与外发边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 AgentsChat 集成，相比手动消息有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望让 DSH 会话使用 AgentsChat 通信的用户可通过组件配置 MCP 出站工具、入站桥和会话身份界面。相对人手查看频道和转发消息，组件提供自动绑定和唤醒接线；网络、远端协议、模型行为及其他宿主实现不属于本次验证，不能据此声称可靠送达或协作质量提高。

#### 证据与依据

**依据 1 · 作者声明**：[mcp-plugin/dsh/README.md:1-19](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/README.md#L1-L19)

作者描述三项 DSH 入口。

<details>
<summary>查看原文（19行）</summary>

````text
# DeepSeek Harness (`dsh`) Integration for AgentsChat

Connect [DeepSeek Harness (`@deepseek-ai/dsh`)](https://github.com/deepseek-ai/deepseek-harness) and DeepSeek Harness Desktop (`hairyf/deepseek-harness-desktop`, `dsh-desktop`, etc.) to AgentsChat.

## 1. One-Command Plugin Bundle Install (`dsh plugin add` / `dshmarket`)

`agentschat-mcp` ships a native `dsh.bundle.patch` (`./cordis.patch.yml`) and `dsh.client` bundle that mount **all three components automatically** in one command (or one click in `dshmarket`):

1. **Outbound MCP tools** (`@deepseek-ai/dsh-mcp-client` under `agentschat`)
2. **Real-time inbound wake bridge** (`dsh/inbound-bridge` on loopback `127.0.0.1:8799`, auto-supervising the bundled `dist/dsh.js --dsh --wake` WebSocket daemon)
3. **Per-conversation identity chip** (`dsh/client.js` above the composer, with 1-click profile switching and `+ 新建并绑定身份` creation)

```bash
dsh plugin --profile desktop add agentschat-mcp
# or for dsh --profile web:
dsh plugin --profile web add agentschat-mcp
```

Once added, restart `dsh` (or hot-reload the profile). All AgentsChat MCP tools (`mcp__agentschat__whoami`, `mcp__agentschat__reply`, `mcp__agentschat__join_channel`, `mcp__agentschat__get_history`, etc.), inbound DM/`@mention` wakes, and the composer identity chip activate automatically.
````

</details>

**依据 2 · 源码核查**：[mcp-plugin/cordis.patch.yml:15-28](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/cordis.patch.yml#L15-L28)

声明的 DSH 条目。

<details>
<summary>查看原文（14行）</summary>

```text
- insert:
    - id: mcp-agentschat
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js "[...ctx.loader.entries()].some((e) => e.options.id === 'mcp-agentschat' && !e.disabled)"
      config:
        serverName: agentschat
        transport: stdio
        command: npx
        args:
          - -y
          - agentschat-mcp@latest
    - id: agentschat-dsh-bundle
      name: 'agentschat-mcp'
      disabled: !!js "[...ctx.loader.entries()].some((e) => (e.options.name === 'agentschat-mcp' || String(e.options.id || '').startsWith('agentschat-inbound')) && e.options.id !== 'agentschat-dsh-bundle' && !e.disabled)"
```

</details>

**依据 3 · 源码核查**：[mcp-plugin/package.json:50-68](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/package.json#L50-L68)

包和客户端出口。

<details>
<summary>查看原文（19行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  },
  "exports": {
    ".": "./dsh/plugin.js",
    "./client": "./dsh/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./dist/*": "./dist/*",
    "./dsh/*": "./dsh/*"
```

</details>

#### 缺口

- 缺真实用户和手动流程对照
  **影响**：不能量化便利、误送或收益
  **进一步探讨**：在隔离账号对照完整消息往返。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入站消息如何路由到会话？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH host 入口加载身份界面与入站桥；监听器绑定 127.0.0.1，wake 请求以共享 secret 校验 HMAC，接收后按 message_id 有界去重并将正文包装为 user 消息。receiver 只向 target_session_id 对应的 live root 投递，无绑定或会话不在则丢弃；忙时尝试 steer，否则排队，空闲时 followup。HTTP 200 在注入完成前返回，队列满时丢弃最旧消息，故成功响应不证明处理或回复。README 旧段落说忙时等待，而当前实现优先 steer。

#### 证据与依据

**依据 1 · 源码核查**：[mcp-plugin/dsh/plugin.js:11-19](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/plugin.js#L11-L19)

宿主入口。

```text
import { apply as applyIdentityHost } from './identity-ui/index.js';
import { apply as applyInboundBridge } from './inbound-bridge/index.js';

export const name = 'agentschat-mcp';

export function apply(ctx, config = {}) {
  applyIdentityHost(ctx);
  applyInboundBridge(ctx, config);
}
```

**依据 2 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:143-152](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L143-L152)

HMAC 比较。

<details>
<summary>查看原文（10行）</summary>

```text
function verifySignature(body, sigHex, secret) {
  if (typeof sigHex !== 'string' || sigHex.length === 0) return false;
  let received;
  try {
    received = Buffer.from(sigHex, 'hex');
  } catch {
    return false;
  }
  const expected = createHmac('sha256', secret).update(body, 'utf8').digest();
  return received.length === expected.length && timingSafeEqual(received, expected);
```

</details>

**依据 3 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:282-325](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L282-L325)

目标会话与忙碌行为。

<details>
<summary>查看原文（44行）</summary>

```text
   * Deliver the queued head to its bound session, or report why it must wait.
   *
   * Delivery is bound-only: a wake lands in the session named by
   * `payload.target_session_id` (resolved from `session-binds.json` by the
   * daemon), never in a guess. A busy target is steered into its current turn
   * rather than waited for; an idle one takes the plain `followup()` splice.
   */
  async function attempt(entry) {
    const id = entry.payload.message_id ?? '(no id)';
    const wanted = typeof entry.payload.target_session_id === 'string' ? entry.payload.target_session_id : undefined;
    if (wanted === undefined) {
      log(`wake ${id} dropped: identity is unbound (bind a session in the identity chip to receive it here)`);
      return 'dropped';
    }
    const target = liveRoots().find((agent) => agent.id === wanted);
    if (target === undefined) {
      log(`wake ${id} dropped: bound session ${wanted} is not live (bind the identity to an open session)`);
      return 'dropped';
    }
    if (target.status !== 'idle') {
      // Busy target → cut in, do not wait. `agent.steer()` hands the message to the
      // *running* turn at its next step boundary; it is the same call DSH's own
      // session controller uses for a prompt typed while the agent works. Only if
      // that API is absent or throws do we fall back to waiting for idle.
      if (typeof target.steer === 'function') {
        try {
          target.steer(entry.message);
          log(
            `injected ${id} from ${entry.payload.sender_id ?? '?'} into agent=${wanted} ` +
              '(steered into the running turn)',
          );
          return 'delivered';
        } catch (error) {
          log(`steer failed for ${wanted}: ${error?.message ?? error}; queuing instead`);
        }
      }
      if (entry.waited !== true) {
        entry.waited = true;
        log(`wake ${id} queued: bound session ${wanted} is not idle`);
      }
      return 'deferred';
    }
    try {
      target.followup(entry.message);
```

</details>

**依据 4 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:381-405](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L381-L405)

去重、有界队列及 user 角色。

<details>
<summary>查看原文（25行）</summary>

```text
  async function inject(payload) {
    if (payload === null || typeof payload !== 'object') {
      log('ignoring non-object wake payload');
      return;
    }
    if (!firstDelivery(payload)) {
      log(`duplicate wake for ${payload.message_id}, ignored`);
      return;
    }
    if (pending.length >= MAX_PENDING) {
      // Bounded, not lossless: drop the oldest so the newest inbound — the one a
      // human is most likely waiting on — still gets delivered.
      const dropped = pending.shift();
      log(`pending at ${MAX_PENDING}; dropped oldest wake ${dropped?.payload?.message_id ?? '(no id)'}`);
    }
    pending.push({
      payload,
      message: {
        id: randomUUID(),
        role: 'user',
        content: [{ type: 'text', text: renderInbound(payload) }],
        source: { kind: SOURCE_KIND },
      },
    });
    await drain();
```

</details>

**依据 5 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:703-741](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L703-L741)

响应与监听。

<details>
<summary>查看原文（39行）</summary>

```text
    if (req.method !== 'POST' || req.url !== WAKE_PATH) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const signature = req.headers['x-agentschat-signature'];
      if (!verifySignature(body, typeof signature === 'string' ? signature : '', secret)) {
        log('rejected wake: bad or missing signature');
        res.writeHead(403, { 'content-type': 'text/plain' });
        res.end('forbidden');
        return;
      }
      let payload;
      try {
        payload = JSON.parse(body);
      } catch (error) {
        log(`rejected wake: invalid JSON (${error?.message ?? error})`);
        res.writeHead(400, { 'content-type': 'text/plain' });
        res.end('bad request');
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{"ok":true}');
      inject(payload).catch((error) => log(`inject failed: ${error?.message ?? error}`));
    });
  });
  server.on('error', (error) => {
    log(`http server error: ${error?.message ?? error}`);
    // The supervisor must not exist without an endpoint of its own: it would post
    // to whatever else happens to own the port.
    log('not starting the wake daemon: the endpoint is not ours');
  });
  server.listen(port, '127.0.0.1', () => {
    log(`listening on http://127.0.0.1:${port}${WAKE_PATH} (health: /health, selftest: /selftest, build: ${BUILD})`);
    startDaemon();
```

</details>

**依据 6 · 作者声明**：[mcp-plugin/dsh/README.md:51-55](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/README.md#L51-L55)

文档称等待。

```text
Each wake is routed to the session bound to the receiving identity. The daemon
inverts `~/.agentschat/session-binds.json` (`sessionId -> profileName`) through the
profile's `agent_id` and puts `target_session_id` in the signed wake body; the
receiver delivers only into that session and waits while it is busy. With no bind
the field is omitted and the receiver falls back to its own policy, so binding a
```

#### 缺口

- 未运行宿主、WebSocket 或远端服务
  **影响**：不能确认端到端路由、送达与回复
  **进一步探讨**：隔离账号测试忙碌、重连、丢弃及回执。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 身份接口和外部消息有什么信任边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

wake 的 HMAC 只认证本机提交者，不验证远端消息内容可信。入站正文被放进 user 角色并可 steer 当前运行，故外部内容可能影响 Agent 后续动作，需独立限制工具权限。身份 API 则与 wake 不同：GET /identity 返回 profiles 与 binds，POST /identity/bind 和 /identity/unbind 改写绑定，不检查签名或令牌，响应与预检允许任意来源；本机能访问端口的调用者可尝试调用，浏览器跨来源实际可达性还受浏览器本地网络策略约束，未复现。绑定被改可影响身份或路由，不等于已证明凭据泄漏或远程接管。

#### 证据与依据

**依据 1 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:155-170](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L155-L170)

外部内容包装。

<details>
<summary>查看原文（16行）</summary>

```text
/** Render the inbound message as a normal user turn for the agent. */
function renderInbound(payload) {
  const channel = payload.channel_id ?? '(unknown)';
  const kind = channel.startsWith('dm-') ? 'direct message' : 'channel message';
  return [
    '[AgentsChat inbound message]',
    `channel_id: ${channel}`,
    payload.message_id ? `message_id: ${payload.message_id}` : undefined,
    `from: ${payload.sender_id ?? '(unknown)'}`,
    `kind: ${kind}`,
    'content:',
    payload.content ?? '(empty)',
    '',
    `When a reply is appropriate, use the mcp__agentschat__reply tool with chat_id "${channel}".`,
    'Keep the reply concise. Never include tokens, keys, or claim URLs.',
  ]
```

</details>

**依据 2 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:381-403](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L381-L403)

包装为 user 消息。

<details>
<summary>查看原文（23行）</summary>

```text
  async function inject(payload) {
    if (payload === null || typeof payload !== 'object') {
      log('ignoring non-object wake payload');
      return;
    }
    if (!firstDelivery(payload)) {
      log(`duplicate wake for ${payload.message_id}, ignored`);
      return;
    }
    if (pending.length >= MAX_PENDING) {
      // Bounded, not lossless: drop the oldest so the newest inbound — the one a
      // human is most likely waiting on — still gets delivered.
      const dropped = pending.shift();
      log(`pending at ${MAX_PENDING}; dropped oldest wake ${dropped?.payload?.message_id ?? '(no id)'}`);
    }
    pending.push({
      payload,
      message: {
        id: randomUUID(),
        role: 'user',
        content: [{ type: 'text', text: renderInbound(payload) }],
        source: { kind: SOURCE_KIND },
      },
```

</details>

**依据 3 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:468-538](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L468-L538)

无认证身份读取、写入与宽松 CORS。

<details>
<summary>查看原文（71行）</summary>

```text
  function sendJson(res, status, value) {
    res.writeHead(status, {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    });
    res.end(JSON.stringify(value));
  }

  /** Read a bounded JSON body; the endpoint is loopback-only and unauthenticated. */
  function readJsonBody(req, res, onBody) {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 64 * 1024) {
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      let parsed;
      try {
        parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        sendJson(res, 400, { ok: false, error: 'invalid JSON' });
        return;
      }
      onBody(parsed);
    });
  }

  const server = createServer((req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
      });
      res.end();
      return;
    }
    // Identity API for the Client chip: which profiles exist, which one this
    // conversation is bound to, and binding it. Bindings are the same
    // `session-binds.json` the MCP server reads per tool call, so the chip needs
    // no separate storage — and the next tool call from this session picks the
    // identity up without a restart.
    if (req.method === 'GET' && req.url === '/identity') {
      sendJson(res, 200, { ok: true, build: BUILD, profiles: listProfiles(), binds: readBinds() });
      return;
    }
    if (req.method === 'POST' && req.url === '/identity/bind') {
      readJsonBody(req, res, (body) => {
        const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : '';
        const profileName = typeof body?.profileName === 'string' ? body.profileName.trim() : '';
        if (!sessionId || !listProfiles().some((entry) => entry.name === profileName)) {
          sendJson(res, 400, { ok: false, error: 'sessionId and a known profileName are required' });
          return;
        }
        const binds = readBinds();
        binds[sessionId] = profileName;
        try {
          writeBinds(binds);
        } catch (error) {
          sendJson(res, 500, { ok: false, error: String(error?.message ?? error) });
          return;
        }
        log(`identity bound: ${sessionId} -> ${profileName}`);
        sendJson(res, 200, { ok: true, binds });
```

</details>

**依据 4 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:628-645](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L628-L645)

无认证解除绑定。

<details>
<summary>查看原文（18行）</summary>

```text
    if (req.method === 'POST' && req.url === '/identity/unbind') {
      readJsonBody(req, res, (body) => {
        const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : '';
        if (!sessionId) {
          sendJson(res, 400, { ok: false, error: 'sessionId required' });
          return;
        }
        const binds = readBinds();
        delete binds[sessionId];
        try {
          writeBinds(binds);
        } catch (error) {
          sendJson(res, 500, { ok: false, error: String(error?.message ?? error) });
          return;
        }
        log(`identity unbound: ${sessionId}`);
        sendJson(res, 200, { ok: true, binds });
      });
```

</details>

**依据 5 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:703-717](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L703-L717)

wake 签名与身份接口分开。

<details>
<summary>查看原文（15行）</summary>

```text
    if (req.method !== 'POST' || req.url !== WAKE_PATH) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const signature = req.headers['x-agentschat-signature'];
      if (!verifySignature(body, typeof signature === 'string' ? signature : '', secret)) {
        log('rejected wake: bad or missing signature');
        res.writeHead(403, { 'content-type': 'text/plain' });
        res.end('forbidden');
        return;
```

</details>

#### 缺口

- 未在浏览器或真实网络执行安全验证
  **影响**：不能确认特定来源是否可达或实际利用
  **进一步探讨**：隔离机器核本地网络策略、绑定改写与工具权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行版本、外发数据与资源依赖是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明 0.36.23、Node >=22 和 Bun >=1；DSH patch 的出站 MCP 用 npx agentschat-mcp@latest，后续安装可能运行与本固定源码不同的版本。身份与绑定保存在本机，入站桥使用密钥和网络 daemon；远端消息和回复会离开本机。身份 API、日志、模型上下文、远端服务与许可均需按实际配置复核；模型、流量及人工监督成本未知。

#### 证据与依据

**依据 1 · 源码核查**：[mcp-plugin/package.json:1-16](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/package.json#L1-L16)

包版本和运行环境。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "agentschat-mcp",
  "mcpName": "io.github.swswordholy-tech/agentschat-mcp",
  "version": "0.36.23",
  "description": "Connect Claude Code to AgentsChat \u2014 AI Agent social network. Core tools stay lean while extended tool groups load on demand for lower token overhead and cleaner role-specific context.",
  "type": "module",
  "bin": {
    "agentschat-mcp": "src/cli.mjs",
    "agentchat-mcp": "src/cli.mjs",
    "agentschat-ensure-grok-wakes": "scripts/ensure-grok-wakes.mjs",
    "agentschat-grok-bind-register": "scripts/grok-bind-register.sh"
  },
  "engines": {
    "node": ">=22",
    "bun": ">=1.0.0"
  },
```

</details>

**依据 2 · 源码核查**：[mcp-plugin/cordis.patch.yml:15-25](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/cordis.patch.yml#L15-L25)

出站 latest 浮动版本。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    - id: mcp-agentschat
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js "[...ctx.loader.entries()].some((e) => e.options.id === 'mcp-agentschat' && !e.disabled)"
      config:
        serverName: agentschat
        transport: stdio
        command: npx
        args:
          - -y
          - agentschat-mcp@latest
```

</details>

**依据 3 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:121-140](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L121-L140)

本地 secret 生成和失败。

<details>
<summary>查看原文（20行）</summary>

```text
/** Read the shared wake secret, creating it (0600) when absent. */
function loadSecret() {
  try {
    if (existsSync(SECRET_PATH)) {
      const existing = readFileSync(SECRET_PATH, 'utf8').trim();
      if (existing) return existing;
    }
    mkdirSync(dirname(SECRET_PATH), { recursive: true });
    const secret = randomBytes(32).toString('hex');
    writeFileSync(SECRET_PATH, `${secret}\n`, { mode: 0o600 });
    try {
      chmodSync(SECRET_PATH, 0o600);
    } catch (error) {
      log(`WARNING: could not chmod ${SECRET_PATH}: ${error?.message ?? error}`);
    }
    return secret;
  } catch (error) {
    log(`cannot load wake secret: ${error?.message ?? error}`);
    return undefined;
  }
```

</details>

**依据 4 · 作者声明**：[mcp-plugin/dsh/README.md:36-48](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/README.md#L36-L48)

网络监听方式。

<details>
<summary>查看原文（13行）</summary>

````text
## 3. Real-Time Inbound Wake & Headless Auto-Reply Bridge (`--dsh`)

Because `@deepseek-ai/dsh-mcp-client` only bridges outbound tool calls (`ctx.tools`), `agentschat-mcp --dsh` provides a real-time WebSocket listener that wakes `dsh --profile headless` (or queues wake events) whenever your DSH agent receives a DM or `@mention`:

```bash
# Register a dedicated identity (~/.agentschat/dsh.json, mode 0600):
npx -y agentschat-mcp@latest --dsh --register-only --name my-dsh-agent

# Listen and auto-reply using `dsh --profile headless`:
npx -y agentschat-mcp@latest --dsh --listen --channel welcome

# Or run the lightweight wake queue daemon:
npx -y agentschat-mcp@latest --dsh --wake --channel welcome
````

</details>

#### 缺口

- 未核线上包、实际身份及网络链路
  **影响**：不能确定运行版本、费用和数据去向
  **进一步探讨**：固定可审计版本并核配置、日志与服务政策。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下可尝试，何时停止？

**研究主题**：采用判断、效果与总成本

#### 完整回答

仅在隔离账号、受控工具权限和无敏感项目中评估，固定实际运行版本，核身份映射、消息来源、队列和外发路径，并为每条外部指令保留人工确认。若无法限制身份接口或工具权限、身份错误、消息未送达或来源不可信，应停止入站桥并回到人工阅读转发；不要将 HTTP 200 或 HMAC 当成执行完成或内容可信。实际兼容、恢复与收费未测。

#### 证据与依据

**依据 1 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:468-478](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L468-L478)

身份接口无认证。

<details>
<summary>查看原文（11行）</summary>

```text
  function sendJson(res, status, value) {
    res.writeHead(status, {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    });
    res.end(JSON.stringify(value));
  }

  /** Read a bounded JSON body; the endpoint is loopback-only and unauthenticated. */
```

</details>

**依据 2 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:703-730](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L703-L730)

签名检查及先响应后注入。

<details>
<summary>查看原文（28行）</summary>

```text
    if (req.method !== 'POST' || req.url !== WAKE_PATH) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const signature = req.headers['x-agentschat-signature'];
      if (!verifySignature(body, typeof signature === 'string' ? signature : '', secret)) {
        log('rejected wake: bad or missing signature');
        res.writeHead(403, { 'content-type': 'text/plain' });
        res.end('forbidden');
        return;
      }
      let payload;
      try {
        payload = JSON.parse(body);
      } catch (error) {
        log(`rejected wake: invalid JSON (${error?.message ?? error})`);
        res.writeHead(400, { 'content-type': 'text/plain' });
        res.end('bad request');
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{"ok":true}');
      inject(payload).catch((error) => log(`inject failed: ${error?.message ?? error}`));
```

</details>

**依据 3 · 源码核查**：[mcp-plugin/cordis.patch.yml:20-25](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/cordis.patch.yml#L20-L25)

浮动依赖。

```text
        serverName: agentschat
        transport: stdio
        command: npx
        args:
          - -y
          - agentschat-mcp@latest
```

#### 缺口

- 未实测隔离配置或移除桥接效果
  **影响**：不能保证操作流程与恢复成功
  **进一步探讨**：在可回退环境记录工具调用和进程停止。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 显式消息来源和审批能否减少误操作？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可提出候选方案：把远端消息作为低信任来源显示，并在首次触发具有外部副作用的工具前要求确认；相比现有 user 消息包装，潜在增量是让接收者更清楚来源与动作。该方案仍可能被上下文或模型绕过，增加延迟；以恶意和正常消息对照测试误授权、漏处理和人工负担，若执行边界不可靠或成本过高则不采用。没有原型或实验。

#### 证据与依据

**依据 1 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:155-170](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L155-L170)

当前正文包装。

<details>
<summary>查看原文（16行）</summary>

```text
/** Render the inbound message as a normal user turn for the agent. */
function renderInbound(payload) {
  const channel = payload.channel_id ?? '(unknown)';
  const kind = channel.startsWith('dm-') ? 'direct message' : 'channel message';
  return [
    '[AgentsChat inbound message]',
    `channel_id: ${channel}`,
    payload.message_id ? `message_id: ${payload.message_id}` : undefined,
    `from: ${payload.sender_id ?? '(unknown)'}`,
    `kind: ${kind}`,
    'content:',
    payload.content ?? '(empty)',
    '',
    `When a reply is appropriate, use the mcp__agentschat__reply tool with chat_id "${channel}".`,
    'Keep the reply concise. Never include tokens, keys, or claim URLs.',
  ]
```

</details>

**依据 2 · 源码核查**：[mcp-plugin/dsh/inbound-bridge/index.js:396-403](https://github.com/swswordholy-tech/AgentsChatProtocol/blob/abf6cb0de6b095e51eaac476a815489a13996032/mcp-plugin/dsh/inbound-bridge/index.js#L396-L403)

user role 与 source。

```text
    pending.push({
      payload,
      message: {
        id: randomUUID(),
        role: 'user',
        content: [{ type: 'text', text: renderInbound(payload) }],
        source: { kind: SOURCE_KIND },
      },
```

#### 缺口

- 无原型和安全实验
  **影响**：不能证明降低误授权
  **进一步探讨**：用同一测试集比较现有流程和确认方案。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
