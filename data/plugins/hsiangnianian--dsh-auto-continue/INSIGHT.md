# dsh-auto-continue

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2239036](https://github.com/HsiangNianian/dsh-auto-continue/tree/2239036452037e31bbfa04be3504212c3c7e335b)

<!-- BEGIN META -->
[![GitHub ★ 185](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=185&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HsiangNianian/dsh-auto-continue) [![npm 30d 10,820](https://img.shields.io/static/v1?label=npm+30d&message=10%2C820&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-client-auto-continue) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-client-auto-continue)
<!-- END META -->

> **功能**：在 DSH 宿主中按会话状态和恢复条件自动发送续跑消息。

> **亮点**：[Q01](#research-q01) 将一类中断恢复搬到宿主定时与消息队列。

> **主要限制**：[Q02](#research-q02) 工具护栏是提示文本，不能证明远程动作可安全重复。

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
  - [Q01 · 从中断到续跑怎样接线？](#detail-section-11)
  - [Q02 · 什么情况下会重复外部动作？](#detail-section-12)
  - [Q03 · 如何限制试用和退出成本？](#detail-section-13)
  - [Q04 · 如何处理未知外部结果？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中长时间运行任务并需要处理短暂中断的操作者。

用户观察失败并手工发送继续，核查上次动作状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 恢复 | 在中断后自动续跑 | 受模式、退避与上限控制 |
| 工具提示 | 提示上次动作未确认 | 依赖模型遵循并主动核查 |
| 成功循环 | 继续已完成回合 | 需开启，成功回合不占失败上限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH agents 与 webServer | 宿主路径必需 | 调度及发送 | 手工恢复 |
| 可恢复会话 | 自动发送必需 | 定位 live Agent | 无 Agent 时跳过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户用独立 profile 打开恢复模式 | 保持成功循环关闭 |
| 验证 | 操作者模拟纯文本故障 | 只收到预期续跑 |
| 退出 | 用户暂停并移除测试组件 | 检查队列与配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主资源未知 | 核对兼容与配置 | 未测试 |
| 持续 | 恢复模型调用 | 核对异常 | 频次未知 |
| 失败恢复 | 重复调用可能增加费用 | 查外部动作及队列 | 不明时停 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动恢复 | 按状态和退避入队 | 真实成功率 |
| 工具提示 | 向模型提供未确认状态 | 远端幂等 |
| 暂停 | 发送前复查 | 宿主实际竞争条件 |

> **思考**：[Q02](#research-q02) 工具护栏是提示文本，不能证明远程动作可安全重复。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将一类中断恢复搬到宿主定时与消息队列。

[Q01](#research-q01) 引擎把调度和发送拆开并重查配置。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 工具护栏是提示文本，不能证明远程动作可安全重复。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从纯文本验证，[Q02](#research-q02) 涉及外部动作时先人工确认。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持宿主调度和发送条件，实际恢复效果与副作用未测试。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/engine.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件代表宿主和队列逻辑，未执行目标代码。
- 下一步：隔离 profile 核对退避、暂停与外部动作回执丢失。

**分析版本**

- **仓库**：[HsiangNianian/dsh-auto-continue](https://github.com/HsiangNianian/dsh-auto-continue)
- **版本号**：0.17.3（[固定提交 2239036](https://github.com/HsiangNianian/dsh-auto-continue/tree/2239036452037e31bbfa04be3504212c3c7e335b)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对未知外部结果新增等待人工或状态查询的门。

隔离 profile 核对退避、暂停与外部动作回执丢失。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 402 | 308 | 59 | — |
| .md | source | 11 | 1399 | — | — | 19358 |
| .js | source | 2 | 11333 | 10573 | 839 | — |
| .tsx | source | 6 | 924 | 797 | 69 | — |
| .ts | source | 12 | 4421 | 3527 | 664 | — |
| .mjs | test | 28 | 7358 | 6630 | 373 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/HsiangNianian/dsh-auto-continue/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/HsiangNianian/dsh-auto-continue/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/HsiangNianian/dsh-auto-continue/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：宿主自动续跑如何判断重试、停止和不明副作用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从中断到续跑怎样接线？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

长任务遇到短暂故障时，操作者通常重新打开会话并发送继续。插件在宿主以 agents 与 webServer 服务挂载单个引擎，配置重入先释放旧引擎。自动路径检查子代理、暂停、连续上限和冷却，未到冷却期限会延期，之后经过宽限期。发送前再次读取开关，并通过 live agent.followup 发送模板消息；启动另有扫描任务处理近期中断。这样续跑不依赖浏览器始终打开，但仍需宿主及 Agent 可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:77-87](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/README.md#L77-L87)

作者描述宿主流程与启动恢复

<details>
<summary>查看原文（11行）</summary>

```text
## How It Works

The host-side engine subscribes to the session event firehose inside the dsh host process — one engine shared by every browser tab. On an interruption it waits a **grace period** (default 3 s) — if the host starts a new turn by itself (`turn/start`), the auto-continue is cancelled — then sends the configured text through the agent registry (`agent.followup`, the same queue the Send button uses). When that queue already contains turns, the engine promotes only its newly inserted continuation before the host wakes the agent; it does not remove or reorder the queued user turns.

On host boot it also scans the live sessions: a session whose last turn ended with a non-human reason **within the scan window** (default 15 minutes), with no later `turn/start` or user message, gets resumed automatically too (e.g. the host crashed while the browser was closed — the agent-loop resumes the session and the engine picks it up). Persisted sessions the host never reloaded are enumerated from session storage and materialized into the registry first; a journal that stopped mid-turn is completed with an interrupted marker on read, so restart-orphaned turns are recovered the same way.

Storage scanning runs separately from live-session recovery. Each storage read has a five-second timeout, and the scan yields every 16 observations without waiting for the next polling interval. This lets recently interrupted sessions deep in the storage listing be reached within the startup window. Recovery restores the session's preset and recorded model; stopping the plugin cancels pending storage work.

Startup recovery isolates failures per session. If history cannot be read or contains invalid events, that session is skipped for the current startup scan and an error is logged; other sessions can still recover, without losing a recovery slot. Invalid entries are not silently removed, since they could hide a manual stop or a newer turn. Valid empty histories and a registry that is still loading remain retryable within the scan window. Reloading a repaired session as a new session object also makes it eligible for scanning again. See [#58](https://github.com/HsiangNianian/dsh-auto-continue/issues/58).

The browser provides the settings card and the composer switch and mode menu, plus a status bridge that shows notifications (with Resume now / Pause this session 1h buttons, routed back to the host engine) and feeds the card's stats / paused-sessions panels.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:154-170](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/index.ts#L154-L170)

宿主实际注册及重入清理

<details>
<summary>查看原文（17行）</summary>

```text
  // 引擎引用: inject 回调可能重入(依赖组合变化), 顶层 effect 在 fiber 卸载时必跑。
  // dispose 绑定必须挂在 apply 的顶层 ctx 上——挂 inject 派生 ctx 的 effect 在 config HMR
  // 替换行时不会执行, 悬空定时器会撞上 inactive context 炸掉整个进程。
  let disposeEngine: (() => void) | undefined;

  // 单实例引擎: host 进程内监听会话事件, 所有标签页共享同一个引擎。
  ctx.inject(['agents', 'webServer'], (engineCtx) => {
    // 回调重入时先清理旧引擎, 避免定时器与监听器叠加。
    disposeEngine?.();
    const readConfig = () => resolveConfig(legacyConfig?.() ?? readEntry());
    const runner = new AutoContinueRunner(engineCtx, readConfig);
    const writableSettings = () => {
      const settings = engineCtx.get('settings');
      return settings?.writable && typeof settings.mutate === 'function' ? settings : undefined;
    };

    // 状态桥: browser 侧订阅通知与运行时状态(SSE)。
```

</details>

**依据 3 · 源码核查**：[src/host/engine.ts:1061-1104](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1061-L1104)

调度与宽限期

<details>
<summary>查看原文（44行）</summary>

```text
  private schedule(sessionId: SessionId, reason: string, force = false): void {
    const state = this.state(sessionId);
    const config = this.sessionConfig(sessionId);
    if (isLoopReason(reason) && !config.resumeCompletedTurns) return;
    if (this.isSubagent(sessionId, state)) return; // 子代理会话由父代理处理, 不抢跑
    if (config.paused) {
      this.log(`跳过 ${sessionId}(${reason}): 自动继续已暂停`);
      return;
    }
    if (Date.now() < (this.pauseUntil.get(sessionId) ?? 0)) {
      this.log(`跳过 ${sessionId}(${reason}): 会话暂停中`);
      return;
    }
    if (state.pendingTimer !== undefined) return; // 已有待发送
    // 连续上限优先于冷却: 已经放弃的会话不该再安排冷却后的重试。
    // 自主循环的完成续跑(force)不受二者约束。
    if (!force && state.consecutive >= config.maxConsecutive) {
      this.log(
        `跳过 ${sessionId}(${reason}): 已连续自动继续 ${state.consecutive} 次, 等待用户介入或成功回合`,
      );
      return;
    }
    // 冷却(含失败尝试, 自适应退避): 不能直接丢弃这次恢复, 否则一次瞬时失败
    // 会把会话搁置到用户手动介入为止。
    if (!force) {
      const remaining = this.cooldownFor(state) - (Date.now() - state.lastAttemptAt);
      if (remaining > 0) {
        this.deferCooldownRetry(sessionId, reason, remaining);
        return;
      }
    }
    const timer = setTimeout(() => {
      if (state.pendingTimer !== timer) return;
      state.pendingTimer = undefined;
      state.pendingReason = undefined;
      // 保险丝: 定时器回调内任何异常(含 inactive context)都不得成为未捕获异常炸掉进程。
      try {
        void this.fire(sessionId, reason, force);
      } catch (error) {
        console.error(`[auto-continue] 定时发送异常 ${sessionId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }, config.graceMs);
    state.pendingTimer = timer;
    state.pendingReason = reason;
```

</details>

**依据 4 · 源码核查**：[src/host/engine.ts:1192-1221](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1192-L1221)

经 Agent 送入模板和记账

<details>
<summary>查看原文（30行）</summary>

```text
    // 模板填充: continueText 可含 {code}/{message}/{status}/{tool}/{turn}/{errorCount}/{sessionTitle}/{elapsed} 占位符
    const template = this.templateFor(config, reason);
    const text = this.buildContinueText(config, state, template);
    // 发送: followup 负责唤醒; 同步 inbox 插入事件会在唤醒前把本消息移到已有队列之前。
    const agent = this.ctx.agents.get(sessionId);
    if (agent === undefined) {
      this.log(`跳过 ${sessionId}(${reason}): 无 live agent`);
      return;
    }
    state.lastAttemptAt = Date.now(); // 先记账: 无论成败, 本次尝试都进入冷却
    try {
      const message = createUserMessage({
        content: [{ type: 'text', text }],
        source: { kind: 'user' },
      });
      // `followup` may publish the matching session event synchronously.
      trackPendingEcho(state, message.id);
      if (agent.inbox.nextTurn.length > 0) this.prioritizedFollowups.add(message.id);
      try {
        agent.followup(message);
      } catch (error) {
        forgetPendingEcho(state, message.id);
        throw error;
      } finally {
        this.prioritizedFollowups.delete(message.id);
      }
      const now = Date.now();
      // 自主循环的成功续跑不计入连续上限: 上限只约束失败(网络中断等)。
      if (reason !== LOOP_COMPLETED_REASON) state.consecutive += 1;
      state.pendingRecoveryAt = now; // 等待窗口内的下一个回合结束来判定恢复结果
```

</details>

**依据 5 · 源码核查**：[src/host/engine.ts:1300-1315](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1300-L1315)

启动扫描调度

<details>
<summary>查看原文（16行）</summary>

```text
  private async bootScanLoop(): Promise<void> {
    // Sessions restored after this window are too old for startup recovery.
    // Keep polling only within that window, including while globally paused.
    const deadline = Date.now() + this.getConfig().freshMs;
    for (let attempt = 0; !this.disposed; attempt += 1) {
      if (attempt > 0 && Date.now() >= deadline) return;
      try {
        if (await this.scanInterrupted()) return;
        const config = this.getConfig();
        if (!config.paused && config.scanOnBoot && this.storedSweep === undefined) {
          this.storedSweep = this.sweepStoredSessions(config, deadline)
            .catch(error => {
              if (!this.disposed) this.ctx.logger.error(`Stored session scan failed: ${String(error)}`);
            })
            .finally(() => { this.storedSweep = undefined; });
        }
```

</details>

#### 缺口

- 未做多标签页、宿主崩溃与多次中断测试
  **影响**：无法确认真实触发频率或净节省
  **进一步探讨**：用隔离宿主注入短暂故障与人工抢先发送，对比每次队列

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 什么情况下会重复外部动作？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

所谓工具守卫把未确认或已完成的工具状态加入续跑提示，实际仍生成 user 消息交给 Agent。提示约束不能让外部动作具备事务幂等，也不能证明远程命令没有执行。自动发送前会复查暂停和上限，但通知里的立即续跑会取消现有定时器，并以手动原因绕过暂停、冷却与上限。自主循环成功续跑也不计入连续失败计数。试用应区分显式人类恢复和无人循环，避免未知外部状态下凭提示判定可重做。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/engine.ts:1034-1047](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1034-L1047)

手动立即续跑

<details>
<summary>查看原文（14行）</summary>

```text
  /** 立即为该会话发送一次自动继续(无视冷却与连续上限; 由通知按钮触发)。 */
  async resumeNow(sessionId: SessionId): Promise<void> {
    if (this.disposed) return;
    const state = this.state(sessionId);
    if (this.isSubagent(sessionId, state)) return;
    if (state.pendingTimer !== undefined) {
      clearTimeout(state.pendingTimer);
      state.pendingTimer = undefined;
    }
    try {
      await this.fire(sessionId, MANUAL_NOTIFICATION_REASON, true);
    } catch (error) {
      console.error(`[auto-continue] 手动续跑异常 ${sessionId}: ${error instanceof Error ? error.message : String(error)}`);
    }
```

</details>

**依据 2 · 源码核查**：[src/host/engine.ts:1165-1190](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1165-L1190)

发送前状态检查和人工旁路

<details>
<summary>查看原文（26行）</summary>

```text
  private fire(sessionId: SessionId, reason: string, force = false): void {
    if (this.disposed) return;
    const state = this.state(sessionId);
    const config = this.sessionConfig(sessionId);
    const manualResume = force && reason === MANUAL_NOTIFICATION_REASON;
    if (reason.endsWith(':silent') && !config.resumeSilentTurns) return;
    // 宽限期内循环被关闭: 发送前必须重新检查开关, 与 :silent 恢复同样处理。
    // 否则「关掉循环」后仍会多发出一次续跑。
    if (isLoopReason(reason) && !config.resumeCompletedTurns) return;
    if (this.isSubagent(sessionId, state)) return; // 子代理会话由父代理处理, 不抢跑
    if (config.paused && !manualResume) {
      this.log(`跳过 ${sessionId}(${reason}): 自动继续已暂停`);
      return;
    }
    if (!manualResume && Date.now() < (this.pauseUntil.get(sessionId) ?? 0)) {
      this.log(`跳过 ${sessionId}(${reason}): 会话暂停中`);
      return;
    }
    // 冷却(自适应退避)与连续上限; 通知按钮的强制续跑不受约束
    if (!force && Date.now() - state.lastAttemptAt < this.cooldownFor(state)) {
      this.log(`跳过 ${sessionId}(${reason}): 处于冷却期`);
      return;
    }
    if (!force && state.consecutive >= config.maxConsecutive) {
      this.log(`跳过 ${sessionId}(${reason}): 已连续自动继续 ${state.consecutive} 次, 等待用户介入或成功回合`);
      return;
```

</details>

**依据 3 · 源码核查**：[src/host/engine.ts:1201-1221](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1201-L1221)

消息与计数

<details>
<summary>查看原文（21行）</summary>

```text
    state.lastAttemptAt = Date.now(); // 先记账: 无论成败, 本次尝试都进入冷却
    try {
      const message = createUserMessage({
        content: [{ type: 'text', text }],
        source: { kind: 'user' },
      });
      // `followup` may publish the matching session event synchronously.
      trackPendingEcho(state, message.id);
      if (agent.inbox.nextTurn.length > 0) this.prioritizedFollowups.add(message.id);
      try {
        agent.followup(message);
      } catch (error) {
        forgetPendingEcho(state, message.id);
        throw error;
      } finally {
        this.prioritizedFollowups.delete(message.id);
      }
      const now = Date.now();
      // 自主循环的成功续跑不计入连续上限: 上限只约束失败(网络中断等)。
      if (reason !== LOOP_COMPLETED_REASON) state.consecutive += 1;
      state.pendingRecoveryAt = now; // 等待窗口内的下一个回合结束来判定恢复结果
```

</details>

**依据 4 · 源码核查**：[src/host/engine.ts:1270-1298](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1270-L1298)

未确认和已完成状态只拼接文本

<details>
<summary>查看原文（29行）</summary>

```text
    config: AutoContinueConfig,
    state: SessionState,
    template: string,
  ): string {
    let text = fillTemplate(template, {
      facts: state.lastFailure,
      tool: state.tools.lastTool(),
      turn: state.lastTurn,
      errorCount: state.consecutive + 1,
      elapsedMs: state.lastFailureAt > 0 ? Date.now() - state.lastFailureAt : undefined,
    });
    if (!config.guardTools) return text;
    const guard = this.currentGuard(state);
    if (guard.kind === 'pending') {
      text += ` ${fillTemplate(config.guardPendingText, { tool: guard.tool, result: guard.result })}`;
    } else if (guard.kind === 'done') {
      text += ` ${fillTemplate(config.guardDoneText, { tool: guard.tool, result: guard.result })}`;
    }
    return text;
  }

  /** 上一步工具调用的护栏状态(实时路径, 由 mux 帧维护)。 */
  private currentGuard(state: SessionState): {
    kind: 'none' | 'pending' | 'done' | 'failed';
    tool?: string;
    result?: string;
  } {
    return state.tools.guard();
  }
```

</details>

#### 缺口

- 未核对目标宿主各工具自己的幂等或外部状态查询
  **影响**：不能保证失败后的重复操作不会产生副作用
  **进一步探讨**：用一次性测试工具模拟已提交但回执丢失，记录是否重放

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何限制试用和退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者为 0.17.3 标记 0.2.1-rc.2 已验证，并强调 Desktop 嵌入版本与应用版本不同。包为宿主及 Web 客户端 bundle。低风险范围是独立 profile 中的纯文本可恢复故障，先用 Recovery only 并检查暂停后的待发消息。额外恢复会消耗模型请求，成功循环不受失败上限。若出现无确认外部结果或停止后仍发消息，暂停后按实际 profile 移除组件并核查组合配置、活动任务与日志。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-46](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/package.json#L20-L46)

包及 bundle 声明

<details>
<summary>查看原文（27行）</summary>

```text
  "files": [
    "lib",
    "src",
    "locale",
    "cordis.patch.yml",
    "scripts",
    "docs",
    "tsconfig.json",
    "tsconfig.build.json",
    "README.md",
    "README.zh.md",
    "CHANGELOG.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-plugins"
      ]
    }
```

</details>

**依据 2 · 作者声明**：[README.md:95-113](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/README.md#L95-L113)

作者宿主验证范围

<details>
<summary>查看原文（19行）</summary>

```text
## Quick Start

DSH plugins install into a **profile** (`dsh web` → `web` profile). The commands below install into the web profile; restart `dsh web` after installation. In the desktop app, install through its **Plugins** page instead.

### Compatibility

| DSH runtime | Plugin version | Configuration entry point |
| --- | --- | --- |
| **0.2.1-rc.2** | **0.17.3 verified** | **Plugins → dsh-client-auto-continue** |
| **0.2.1-alpha.1** | **0.17.2 verified** | **Plugins → dsh-client-auto-continue** |
| **0.2.0-rc.1** | **0.12.1 or newer** | **Plugins → dsh-client-auto-continue** |
| **0.1.7-rc.2** | **0.11.9 or newer** | Same Plugins page |
| Older hosts with the legacy settings API | Legacy UI retained | **Settings → Plugins → Plugin configuration** |

DSH 0.1.0-rc.6 and earlier are unsupported. Automated settings and compatibility checks cover **0.1.7-rc.2**, **0.2.0-rc.1**, **0.2.1-alpha.1** and **0.2.1-rc.2**; startup failure isolation is also checked against **0.2.0-rc.2** and **0.2.1-alpha.1**. Desktop app versions and embedded DSH runtime versions are different; use the runtime version when checking compatibility. For the CLI, run `dsh --version`; see [official DSH releases](https://github.com/deepseek-ai/deepseek-harness/releases) for available versions.

**Plugins 0.11.9 and 0.12.0 are rejected by DSH 0.2.0-rc.1’s version check.** Upgrade the plugin to 0.12.1 or newer; its existing configuration-form integration works on this runtime. See [#50](https://github.com/HsiangNianian/dsh-auto-continue/issues/50).

On current DSH, **Settings → Built-in plugins** is a component inventory, not the configuration editor. Use the main **Plugins** page. The screenshots below show plugin **0.14.0** on **DSH 0.2.1-alpha.1**. If you previously installed with a symlink or hand-written loader entry, see [Migrating an older installation](#migrating-an-older-installation).
```

</details>

**依据 3 · 作者声明**：[README.md:180-191](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/README.md#L180-L191)

组合检查和退出

<details>
<summary>查看原文（12行）</summary>

````text
### Verify & uninstall

```bash
dsh --profile web --dump-config | grep -A 4 'id: auto-continue'
```

The composed config should contain one `id: auto-continue` entry. In **Plugins → dsh-client-auto-continue**, check that the component is **Running** and that the **General** category shows editable fields. With verbose logging enabled, engine activity appears in the terminal running DSH.

```bash
dsh plugin --profile web remove dsh-client-auto-continue   # npm / repo install
# also remove this plugin's config override from cordis.patch.yml, if present
dsh web
````

</details>

**依据 4 · 源码核查**：[src/host/engine.ts:1165-1190](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1165-L1190)

暂停与发送边界

<details>
<summary>查看原文（26行）</summary>

```text
  private fire(sessionId: SessionId, reason: string, force = false): void {
    if (this.disposed) return;
    const state = this.state(sessionId);
    const config = this.sessionConfig(sessionId);
    const manualResume = force && reason === MANUAL_NOTIFICATION_REASON;
    if (reason.endsWith(':silent') && !config.resumeSilentTurns) return;
    // 宽限期内循环被关闭: 发送前必须重新检查开关, 与 :silent 恢复同样处理。
    // 否则「关掉循环」后仍会多发出一次续跑。
    if (isLoopReason(reason) && !config.resumeCompletedTurns) return;
    if (this.isSubagent(sessionId, state)) return; // 子代理会话由父代理处理, 不抢跑
    if (config.paused && !manualResume) {
      this.log(`跳过 ${sessionId}(${reason}): 自动继续已暂停`);
      return;
    }
    if (!manualResume && Date.now() < (this.pauseUntil.get(sessionId) ?? 0)) {
      this.log(`跳过 ${sessionId}(${reason}): 会话暂停中`);
      return;
    }
    // 冷却(自适应退避)与连续上限; 通知按钮的强制续跑不受约束
    if (!force && Date.now() - state.lastAttemptAt < this.cooldownFor(state)) {
      this.log(`跳过 ${sessionId}(${reason}): 处于冷却期`);
      return;
    }
    if (!force && state.consecutive >= config.maxConsecutive) {
      this.log(`跳过 ${sessionId}(${reason}): 已连续自动继续 ${state.consecutive} 次, 等待用户介入或成功回合`);
      return;
```

</details>

#### 缺口

- 未执行目标宿主和真实失败恢复
  **影响**：实际耗时、残留与重试费用未知
  **进一步探讨**：用独立 profile 验证恢复上限、暂停、关闭和移除

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何处理未知外部结果？

**研究主题**：新假设与验证

#### 完整回答

在现有提示之前，可对有外部副作用而回执未知的工具标记等待人工或状态查询，允许明确无副作用的恢复照常走。对照当前提示和该门，模拟提交后断连、失败前未提交及纯文本失败，记录重复动作、恢复耗时与错误阻断。若副作用未减少或正常恢复被明显拖慢，则不采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/engine.ts:1192-1214](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1192-L1214)

发送位置可观察

<details>
<summary>查看原文（23行）</summary>

```text
    // 模板填充: continueText 可含 {code}/{message}/{status}/{tool}/{turn}/{errorCount}/{sessionTitle}/{elapsed} 占位符
    const template = this.templateFor(config, reason);
    const text = this.buildContinueText(config, state, template);
    // 发送: followup 负责唤醒; 同步 inbox 插入事件会在唤醒前把本消息移到已有队列之前。
    const agent = this.ctx.agents.get(sessionId);
    if (agent === undefined) {
      this.log(`跳过 ${sessionId}(${reason}): 无 live agent`);
      return;
    }
    state.lastAttemptAt = Date.now(); // 先记账: 无论成败, 本次尝试都进入冷却
    try {
      const message = createUserMessage({
        content: [{ type: 'text', text }],
        source: { kind: 'user' },
      });
      // `followup` may publish the matching session event synchronously.
      trackPendingEcho(state, message.id);
      if (agent.inbox.nextTurn.length > 0) this.prioritizedFollowups.add(message.id);
      try {
        agent.followup(message);
      } catch (error) {
        forgetPendingEcho(state, message.id);
        throw error;
```

</details>

**依据 2 · 源码核查**：[src/host/engine.ts:1270-1298](https://github.com/HsiangNianian/dsh-auto-continue/blob/2239036452037e31bbfa04be3504212c3c7e335b/src/host/engine.ts#L1270-L1298)

现有工具状态分类与文本限制

<details>
<summary>查看原文（29行）</summary>

```text
    config: AutoContinueConfig,
    state: SessionState,
    template: string,
  ): string {
    let text = fillTemplate(template, {
      facts: state.lastFailure,
      tool: state.tools.lastTool(),
      turn: state.lastTurn,
      errorCount: state.consecutive + 1,
      elapsedMs: state.lastFailureAt > 0 ? Date.now() - state.lastFailureAt : undefined,
    });
    if (!config.guardTools) return text;
    const guard = this.currentGuard(state);
    if (guard.kind === 'pending') {
      text += ` ${fillTemplate(config.guardPendingText, { tool: guard.tool, result: guard.result })}`;
    } else if (guard.kind === 'done') {
      text += ` ${fillTemplate(config.guardDoneText, { tool: guard.tool, result: guard.result })}`;
    }
    return text;
  }

  /** 上一步工具调用的护栏状态(实时路径, 由 mux 帧维护)。 */
  private currentGuard(state: SessionState): {
    kind: 'none' | 'pending' | 'done' | 'failed';
    tool?: string;
    result?: string;
  } {
    return state.tools.guard();
  }
```

</details>

#### 缺口

- 未测试提议，也未穷尽宿主内建授权
  **影响**：不能确认额外门的收益
  **进一步探讨**：用惰性工具和固定故障对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
