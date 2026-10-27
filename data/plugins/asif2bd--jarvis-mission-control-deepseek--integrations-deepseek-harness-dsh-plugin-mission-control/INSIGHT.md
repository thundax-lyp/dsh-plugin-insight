# dsh-plugin-mission-control

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[e109837](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/tree/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek) [![npm 30d 809](https://img.shields.io/static/v1?label=npm+30d&message=809&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-mission-control) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-mission-control)
<!-- END META -->

> **功能**：将 DSH 会话、消息与工具活动镜像到 JARVIS 看板，并把结束回合送入人工审查。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的贡献是把会话状态转成独立看板可审阅的工作流，并保留REVIEW到DONE的人类责任。真实调度和质量验证仍不属于这个镜像组件。

> **主要限制**：[Q03](#research-q03) 表明队列清空可包含失败丢弃，flush不证明送达；未知reason会默认REVIEW，重启跨日还可能重复任务。因此核心价值应限定best-effort可见性，不能宣传完整审计。

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
  - [Q01 · 活动镜像改善谁的任务交接？](#detail-section-11)
  - [Q02 · 会话事件如何进入外部看板？](#detail-section-12)
  - [Q03 · flush成功是否意味着看板收到全部事件？](#detail-section-13)
  - [Q04 · 镜像的隐私和运维负担是否支持试用？](#detail-section-14)
  - [Q05 · 持久序列确认可否改善镜像完整性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向想在独立JARVIS看板观察DSH多个会话、并由人确认完成的用户。合格结果是看板可定位对应会话、活动和待审状态，而任务是否真正满足需求仍由人工验收。原来需手动写任务状态，此插件把session建任务、消息和工具事件变活动日志，将正常turn结束送REVIEW，保留人从REVIEW批准DONE的责任。它是事件镜像集成，不是新的agent调度或交付验证器。

参照人工更新JARVIS看板和本地会话日志；没有把观察活动当作业务交付。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话建任务 | 独立看板追踪 | 内存映射，任务ID含日期 |
| 活动镜像 | 留消息摘录和工具事件 | 会外发文本，不是完整日志 |
| 结束状态映射 | 人工REVIEW接管 | 未知reason默认REVIEW |
| 重试队列 | 解耦看板网络 | 队满/失败会丢，flush不证送达 |

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 对应DSH事件契约 | 必需 | session及turn映射 | 可能漏记或误状态 |
| JARVIS REST服务和网络 | 必需 | 持久任务日志 | 重试后可能丢弃 |
| Bearer token | 服务启用认证时必需 | 外部写权限 | 4xx出队且记录错误 |
| 可信转发范围 | 采用必需 | 文本摘录隐私 | 截断不等于脱敏 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户设置可信看板与agent/token | 可用服务且范围明确 |
| 试运行 | 宿主监听无敏感会话 | 任务和活动对应 |
| 审查 | 人看REVIEW并验产物 | 人工决定DONE |
| 故障 | 用户看丢弃日志并对照源会话 | 补记，不把flush当送达 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 看板主机、宿主资源 | 配地址标识认证与隐私范围 | 费用耗时未知 |
| 持续使用 | REST请求、日志磁盘与重试 | 审REVIEW、升级事件映射 | 实际任务量和延迟未知 |
| 失败恢复 | 重试与补记存储 | 对照源会话找丢失/重复任务 | 内存队列不可离线重放 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 任务可见 | session创建POST任务 | 重启后一会话一任务 |
| 人工审核入口 | completed映射REVIEW | 实际产物质量 |
| 网络解耦 | 序列队列与超时 | 完整送达，flush含丢弃 |

> **思考**：[Q03](#research-q03) 表明队列清空可包含失败丢弃，flush不证明送达；未知reason会默认REVIEW，重启跨日还可能重复任务。因此核心价值应限定best-effort可见性，不能宣传完整审计。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的贡献是把会话状态转成独立看板可审阅的工作流，并保留REVIEW到DONE的人类责任。真实调度和质量验证仍不属于这个镜像组件。

事件映射与HTTP队列分离易于移植，超时和4xx不反复重试控制负担；更关键的是清空语义与送达语义应分开。移植要重新核对源事件状态和接收端幂等，不应只替换URL。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 表明队列清空可包含失败丢弃，flush不证明送达；未知reason会默认REVIEW，重启跨日还可能重复任务。因此核心价值应限定best-effort可见性，不能宣传完整审计。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有可信自托管JARVIS看板的用户可在无敏感信息的会话先试。首次需要独立看板、agent标识和可选token，持续转发用户与助手文本摘录、工具名和错误，虽截断280字符也不代表脱敏。资源成本包括看板主机、存储、请求和故障重试，金额、延迟与人工审查时间未知。成功需三种turn结果正确映射并保留人工REVIEW，401或队列溢出必须可察觉；若用于合规审计或无法接受摘录外流则暂不采用。故障后手工对照源会话补记，不能把flush=true作为完整数据保证。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

事件到REST队列的镜像有源码支持；完整送达、幂等和跨日恢复未验收；持久序列对账是假设。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/dsh-plugin-mission-control/README.md、integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js、integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js、integrations/deepseek-harness/dsh-plugin-mission-control/package.json 及固定范围 inventory；组件：integrations/deepseek-harness/dsh-plugin-mission-control。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅DSH集成组件固定源码；全JARVIS服务端不作为本项完整审计或LOC。
- 下一步：- 已检查固定集成组件源码及作者说明。
- 未发送外部消息、连接看板、执行测试或宿主。
- 幂等、队列故障和跨日重启一致性未知。

**分析版本**

- **仓库**：[Asif2BD/JARVIS-Mission-Control-DeepSeek](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek)
- **版本号**：0.2.1（[固定提交 e109837](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/tree/e1098371bee137a5676ddd8e7b82b9b222a55bb8)）
- **版本日期**：2026-08-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出稳定事件幂等键、持久outbox及确认水位，未验证；以丢失、重复、错状态与flush延迟共同检验，不能只看最终队列为空。

- 已检查固定集成组件源码及作者说明。
- 未发送外部消息、连接看板、执行测试或宿主。
- 幂等、队列故障和跨日重启一致性未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 62 | — | — | 417 |
| .js | source | 2 | 480 | 365 | 70 | — |
| .js | test | 3 | 300 | 257 | 21 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话活动镜像能否帮助人工跟踪交付并避免把传输状态当业务验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 活动镜像改善谁的任务交接？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向想在独立JARVIS看板观察DSH多个会话、并由人确认完成的用户。合格结果是看板可定位对应会话、活动和待审状态，而任务是否真正满足需求仍由人工验收。原来需手动写任务状态，此插件把session建任务、消息和工具事件变活动日志，将正常turn结束送REVIEW，保留人从REVIEW批准DONE的责任。它是事件镜像集成，不是新的agent调度或交付验证器。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/dsh-plugin-mission-control/README.md:24-36](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/README.md#L24-L36)

列出事件到board的映射与人工批准边界。

<details>
<summary>查看原文（13行）</summary>

```text
## What it does

| dsh event | Board effect |
|---|---|
| `session/created` | Task created (`IN_PROGRESS`, assigned to the harness agent) |
| `user/message`, `assistant/message` | Activity log excerpts |
| `tool/call`, `tool/result` | Activity log entries (tool name; error code on failure) |
| `turn/end` → `completed` | Task → `REVIEW` (humans approve to `DONE`) |
| `turn/end` → `blocked` / `failed` | Task → `BLOCKED`, structured error logged |
| `turn/end` → `aborted` / `interrupted` | Task → `ASSIGNED` |
| `session/flush` | Awaited bounded flush of the plugin's HTTP queue |

All Mission Control calls go through a serialized retry queue — an unreachable board never blocks the dsh agent loop.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话事件如何进入外部看板？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply注册agent并发送上线消息，监听session/created、session/event及session/flush。ensureTask为内存未见的session构造日期和清理后的sessionId任务ID并POST创建；消息按maxExcerpt截断，工具只记名称和错误；turn/end按reason映射REVIEW/BLOCKED/ASSIGNED。全部HTTP通过序列队列，Bearer可从配置或环境提供。看板服务、网络、认证和固定宿主事件数据形状都是必要条件；不只读取本地状态，还会主动写入外部任务、日志和群发消息。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js:81-120](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js#L81-L120)

内存映射、上线外写和事件监听。

<details>
<summary>查看原文（40行）</summary>

```text
  // sessionId → { taskId, turn } for sessions seen while this plugin is loaded
  const sessions = new Map();

  registerAgent(client, config);
  client.sendMessage({
    from: config.agentId,
    to: 'all',
    content: `${config.agentName} connected via dsh-plugin-mission-control.`,
    thread_id: 'chat-general',
    type: 'chat',
  });

  const guarded = (fn) => (...args) => {
    try {
      return fn(...args);
    } catch (err) {
      // Never let board mirroring break the agent loop.
      log('error', `event handling failed: ${err.message}`);
    }
  };

  const disposers = [
    ctx.on(config.events.sessionCreated, guarded((session) => {
      const sessionId = sessionIdOf(session);
      if (sessionId) ensureTask(sessionId, { client, config, sessions });
    })),

    ctx.on(config.events.sessionDisposed, guarded((session) => {
      const sessionId = sessionIdOf(session);
      const record = sessionId && sessions.get(sessionId);
      if (record) client.logActivity(config.agentId, 'SESSION_DISPOSED', `${record.taskId} session left the store`);
    })),

    ctx.on(config.events.channel, guarded((...args) => {
      handleSessionEvent(normalizeEvent(args), { client, config, sessions });
    })),

    // Awaited parallel durability checkpoint: dsh waits for every listener,
    // so our queued HTTP rides the same flush the session log does.
    ctx.on(config.events.sessionFlush, () => client.flush(config.flushTimeoutMs)),
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js:154-176](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js#L154-L176)

turn状态和通知。

<details>
<summary>查看原文（23行）</summary>

```text
    case e.turnEnd: {
      const record = sessions.get(sessionId);
      if (!record) return;
      const kind = data.reason?.kind || 'completed';
      const status = REASON_STATUS[kind] || 'REVIEW';
      client.patchTask(record.taskId, {
        status,
        updated_at: new Date().toISOString(),
      });
      let detail = `${record.taskId} turn ${record.turn} ended (${kind}) → ${status}`;
      if (kind === 'failed' && data.reason?.error) {
        const err = data.reason.error;
        detail += ` — ${err.code || 'UNKNOWN'}: ${String(err.message || '').slice(0, 160)}`;
      }
      client.logActivity(config.agentId, 'TURN_END', detail);
      if (status === 'REVIEW') {
        client.sendMessage({
          from: config.agentId,
          to: 'all',
          content: `Turn ${record.turn} of ${record.taskId} finished — awaiting review.`,
          thread_id: 'chat-general',
          type: 'chat',
        });
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js:212-238](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js#L212-L238)

任务ID及创建payload。

<details>
<summary>查看原文（27行）</summary>

```text
function ensureTask(sessionId, { client, config, sessions }) {
  let record = sessions.get(sessionId);
  if (record) return record;

  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const taskId = `task-${datePart}-dsh-${sanitizeId(sessionId)}`;
  record = { taskId, turn: 0 };
  sessions.set(sessionId, record);

  client.createTask({
    id: taskId,
    title: `dsh session ${sessionId}`,
    description: `Auto-created by dsh-plugin-mission-control for DeepSeek-Harness session "${sessionId}". Follow progress in the activity log.`,
    status: 'IN_PROGRESS',
    priority: 'medium',
    assignee: config.agentId,
    created_by: config.agentId,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    labels: ['dsh', 'auto-created'],
    comments: [],
    deliverables: [],
    dependencies: [],
    blocked_by: [],
  });
  client.logActivity(config.agentId, 'CREATED', `${taskId} for dsh session ${sessionId}`);
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js:37-59](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js#L37-L59)

具体写接口。

<details>
<summary>查看原文（23行）</summary>

```text
  registerAgent(agent) {
    return this.enqueue('PUT', `/api/agents/${encodeURIComponent(agent.id)}`, agent);
  }

  createTask(task) {
    return this.enqueue('POST', '/api/tasks', task);
  }

  patchTask(taskId, patch) {
    return this.enqueue('PATCH', `/api/tasks/${encodeURIComponent(taskId)}`, patch);
  }

  logActivity(actor, action, description) {
    return this.enqueue('POST', '/api/logs/activity', {
      timestamp: new Date().toISOString(),
      actor,
      action,
      description,
    });
  }

  sendMessage(message) {
    return this.enqueue('POST', '/api/messages', message);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · flush成功是否意味着看板收到全部事件？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不意味着。队列仅存内存，达到500会丢最老请求，最多3次尝试后丢弃；4xx记录错误但send返回true以出队。flush的true只表示队列清空，既可能送达也可能被丢掉，不能当外部持久成功凭证。session映射重启丢失，任务ID用当前日期，跨日重新见同会话可生成另一任务。未知或缺失reason默认REVIEW，预览API改动可能被误解为正常结束。序列化与bounded flush降低阻塞负担，但采取的是best-effort镜像，不能用于完整审计。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js:62-88](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js#L62-L88)

队列溢出与flush判定。

<details>
<summary>查看原文（27行）</summary>

```text
  enqueue(method, path, body) {
    if (this.stopped) {
      this.log('warn', `client stopped, ignoring ${method} ${path}`);
      return;
    }
    if (this.queue.length >= MAX_QUEUE) {
      this.queue.shift();
      this.log('warn', `queue full (${MAX_QUEUE}), dropping oldest request`);
    }
    this.queue.push({ method, path, body, attempts: 0 });
    void this.drain();
  }

  /**
   * Await delivery (or final drop) of everything queued so far, bounded by
   * `timeoutMs`. Resolves `true` when the queue fully drained, `false` when
   * the deadline hit first. Safe to call from dsh's awaited `session/flush`
   * durability checkpoint.
   */
  async flush(timeoutMs = 10_000) {
    const deadline = Date.now() + timeoutMs;
    while (this.queue.length > 0 && Date.now() < deadline) {
      const wait = this.drainPromise || this.drain();
      await Promise.race([wait, sleep(Math.max(1, deadline - Date.now()))]);
      if (this.queue.length > 0) await sleep(25);
    }
    return this.queue.length === 0;
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js:99-138](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js#L99-L138)

失败丢弃和4xx出队。

<details>
<summary>查看原文（40行）</summary>

```text
  async drainLoop() {
    while (this.queue.length > 0) {
      const item = this.queue[0];
      const ok = await this.send(item);
      if (ok) {
        this.queue.shift();
      } else if (item.attempts >= MAX_RETRIES) {
        this.queue.shift();
        this.log('error', `dropping ${item.method} ${item.path} after ${item.attempts} attempts`);
      } else {
        await sleep(BASE_BACKOFF_MS * 2 ** (item.attempts - 1));
      }
    }
  }

  async send(item) {
    item.attempts += 1;
    if (this.dryRun) {
      this.log('info', `[dry-run] ${item.method} ${item.path} ${JSON.stringify(item.body)}`);
      return true;
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const headers = { 'Content-Type': 'application/json' };
      if (this.authToken) headers.Authorization = `Bearer ${this.authToken}`;
      const res = await fetch(this.baseUrl + item.path, {
        method: item.method,
        headers,
        body: JSON.stringify(item.body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      // 4xx means the payload or credentials are wrong; retrying identical
      // bytes won't help.
      if (res.status >= 400 && res.status < 500) {
        this.log('error', `${item.method} ${item.path} → ${res.status}, not retrying`);
        return true;
      }
      return res.ok;
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js:154-158](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js#L154-L158)

unknown reason回退REVIEW。

```text
    case e.turnEnd: {
      const record = sessions.get(sessionId);
      if (!record) return;
      const kind = data.reason?.kind || 'completed';
      const status = REASON_STATUS[kind] || 'REVIEW';
```

**依据 4 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js:216-220](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js#L216-L220)

日期参与非持久任务ID。

```text
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const taskId = `task-${datePart}-dsh-${sanitizeId(sessionId)}`;
  record = { taskId, turn: 0 };
  sessions.set(sessionId, record);
```

#### 缺口

- 服务重复POST幂等语义、跨日重启和网络丢包下看板实际一致性未测。
  **影响**：不保证一会话一任务、无丢日志或flush送达。
  **进一步探讨**：模拟401、超时、500和重启，按原事件seq对照服务端持久结果并检查重复任务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 镜像的隐私和运维负担是否支持试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

已有可信自托管JARVIS看板的用户可在无敏感信息的会话先试。首次需要独立看板、agent标识和可选token，持续转发用户与助手文本摘录、工具名和错误，虽截断280字符也不代表脱敏。资源成本包括看板主机、存储、请求和故障重试，金额、延迟与人工审查时间未知。成功需三种turn结果正确映射并保留人工REVIEW，401或队列溢出必须可察觉；若用于合规审计或无法接受摘录外流则暂不采用。故障后手工对照源会话补记，不能把flush=true作为完整数据保证。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js:181-202](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js#L181-L202)

实际转发内容与工具事件范围。

<details>
<summary>查看原文（22行）</summary>

```text
    case e.userMessage: {
      const record = ensureTask(sessionId, { client, config, sessions });
      client.logActivity('human', 'USER_MESSAGE', `${record.taskId}: ${excerpt(data.content, config.maxExcerpt)}`);
      break;
    }

    case e.assistantMessage: {
      const record = ensureTask(sessionId, { client, config, sessions });
      client.logActivity(config.agentId, 'ASSISTANT_MESSAGE', `${record.taskId}: ${excerpt(data.message?.content, config.maxExcerpt)}`);
      break;
    }

    case e.toolCall: {
      const record = sessions.get(sessionId);
      client.logActivity(config.agentId, 'TOOL_CALL', `${record?.taskId || sessionId}: ${data.name || 'tool'}`);
      break;
    }

    case e.toolResult: {
      const record = sessions.get(sessionId);
      const status = data.error ? `error (${data.error.code || data.error.name || 'unknown'})` : 'ok';
      client.logActivity(config.agentId, 'TOOL_RESULT', `${record?.taskId || sessionId}: ${status}`);
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js:120-138](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js#L120-L138)

网络和认证行为。

<details>
<summary>查看原文（19行）</summary>

```text
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const headers = { 'Content-Type': 'application/json' };
      if (this.authToken) headers.Authorization = `Bearer ${this.authToken}`;
      const res = await fetch(this.baseUrl + item.path, {
        method: item.method,
        headers,
        body: JSON.stringify(item.body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      // 4xx means the payload or credentials are wrong; retrying identical
      // bytes won't help.
      if (res.status >= 400 && res.status < 500) {
        this.log('error', `${item.method} ${item.path} → ${res.status}, not retrying`);
        return true;
      }
      return res.ok;
```

</details>

**依据 3 · 作者声明**：[integrations/deepseek-harness/dsh-plugin-mission-control/README.md:38-58](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/README.md#L38-L58)

看板地址、摘录长度、dryRun和认证排障。

<details>
<summary>查看原文（21行）</summary>

````text
## Configuration

Override the bundle defaults per profile by addressing row id `mission-control` in the profile's `cordis.patch.yml`:

```yaml
- id: mission-control
  config:
    missionControlUrl: http://localhost:3000
    agentId: agent-dsh          # must match ^[a-zA-Z0-9-_]+$
    agentName: DeepSeek Harness
    authToken: null             # or set env MC_AGENT_TOKEN
    maxExcerpt: 280             # max chars of content forwarded to logs
    flushTimeoutMs: 10000       # bound for the awaited session/flush drain
    events: {}                  # override dsh event names after upstream renames
```

## Troubleshooting

- **Nothing on the board** — confirm the server is up (`curl $MISSION_CONTROL_URL/api/metrics`) and check dsh logs for `[mission-control]` lines. Set `dryRun: true` in the row config to print payloads instead of sending.
- **Unknown event warnings after a dsh upgrade** — map the renamed events via the `events` config block.
- **Auth failures (401/403)** — set the same token in the server env (`MC_AGENT_TOKEN`) and the plugin (`authToken` or env).
````

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 持久序列确认可否改善镜像完整性？

**研究主题**：新假设与验证

#### 完整回答

现有宿主事件自带seq，但镜像队列没有持久outbox或服务确认水位。未验证方向是以稳定sessionId+seq+事件类型作为幂等键，持久保存待送事件并记录服务确认，再定期对账；未知reason转为显式unknown而不是REVIEW。这样可能减少重启丢失与误完成，但需服务端幂等接口、数据保留与隐私策略，增加磁盘和迁移负担。最小实验在固定事件流上注入超时、4xx、掉电和跨日重启，比较丢失/重复/错状态数及宿主flush延迟；若对账仍不可解释或阻塞agent就否定优势。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js:5-18](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/index.js#L5-L18)

来源事件已有seq包络。

<details>
<summary>查看原文（14行）</summary>

```text
 * Mission Control board. Payload shapes follow @deepseek-ai/dsh 0.1.0-rc.7:
 * session events arrive as `{ type, seq, time, data }` wrappers on the
 * `session/event` channel with the listener signature `(session, event)`.
 *
 *   session/created               → task created (IN_PROGRESS)
 *   turn/start                    → task kept IN_PROGRESS + activity log
 *   user/message                  → activity log excerpt (data.content blocks)
 *   assistant/message             → activity log excerpt (data.message.content)
 *   tool/call, tool/result        → activity log entries (data.name / data.error)
 *   turn/end                      → status from data.reason.kind:
 *                                     completed → REVIEW (humans approve DONE)
 *                                     blocked | failed → BLOCKED
 *                                     aborted | interrupted → ASSIGNED
 *   session/flush                 → awaited bounded flush of the HTTP queue
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js:62-88](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek/blob/e1098371bee137a5676ddd8e7b82b9b222a55bb8/integrations/deepseek-harness/dsh-plugin-mission-control/src/mc-client.js#L62-L88)

当前内存队列和清空语义提供改进依据。

<details>
<summary>查看原文（27行）</summary>

```text
  enqueue(method, path, body) {
    if (this.stopped) {
      this.log('warn', `client stopped, ignoring ${method} ${path}`);
      return;
    }
    if (this.queue.length >= MAX_QUEUE) {
      this.queue.shift();
      this.log('warn', `queue full (${MAX_QUEUE}), dropping oldest request`);
    }
    this.queue.push({ method, path, body, attempts: 0 });
    void this.drain();
  }

  /**
   * Await delivery (or final drop) of everything queued so far, bounded by
   * `timeoutMs`. Resolves `true` when the queue fully drained, `false` when
   * the deadline hit first. Safe to call from dsh's awaited `session/flush`
   * durability checkpoint.
   */
  async flush(timeoutMs = 10_000) {
    const deadline = Date.now() + timeoutMs;
    while (this.queue.length > 0 && Date.now() < deadline) {
      const wait = this.drainPromise || this.drain();
      await Promise.race([wait, sleep(Math.max(1, deadline - Date.now()))]);
      if (this.queue.length > 0) await sleep(25);
    }
    return this.queue.length === 0;
```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
