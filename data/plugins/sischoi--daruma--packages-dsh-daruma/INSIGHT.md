# dsh-daruma

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b705e73](https://github.com/SISCHOI/daruma/tree/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma)

<!-- BEGIN META -->
[![GitHub ★ 116](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=116&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SISCHOI/daruma) [![npm 30d 1,307](https://img.shields.io/static/v1?label=npm+30d&message=1%2C307&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-daruma) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-daruma)
<!-- END META -->

> **功能**：在 DSH 请求路径内按故障与预算切换模型通道。

> **亮点**：[Q01](#research-q01) 将有预算的切换接入模型请求生命周期。

> **主要限制**：[Q02](#research-q02) 需核对成功推断和备用供应商输入。

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
  - [Q01 · Daruma 怎样恢复模型请求？](#detail-section-11)
  - [Q02 · 何时仍会给出错误健康信号或放弃？](#detail-section-12)
  - [Q03 · 如何评估采用成本？](#detail-section-13)
  - [Q04 · 请求完成信号能否改善健康归因？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有多条可用模型通道并希望降低故障中断的 DSH 用户。

依赖宿主默认重试，失败后手动更换模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 切换 | 失败后重试备用模型 | 需要可达通道 |
| 诊断 | 日志及可选 Web UI | 受宿主传输限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 请求生命周期 | 必需 | 执行切换 | 沿用默认重试 |
| 模型备用通道 | 必需 | 接收重试 | 人工恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离 profile 和模拟模型 | 核对通道 |
| 验证 | 触发失败和恢复 | 对照实际调用 |
| 退出 | 禁用并核对日志和路由 | 恢复原流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模拟模型资源未知 | 配置备用及日志 | 未测 |
| 持续 | 请求计费未知 | 检查通道健康 | 需实测 |
| 退出 | 恢复费用未知 | 禁用并保留必要日志 | 核对状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 故障恢复 | 源码有切换预算和事件接线 | 实际恢复率 |
| 可追溯 | 日志包含决策 | 日志完整性 |

> **思考**：[Q02](#research-q02) 需核对成功推断和备用供应商输入。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将有预算的切换接入模型请求生命周期。

[Q02](#research-q02) 区分切换、健康推断与请求完成。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 需核对成功推断和备用供应商输入。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用可计数的模拟模型。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包源码与作者文档，未执行。

- 已检查：作者 README、包清单、源码路径 packages/dsh-daruma/README.md、packages/dsh-daruma/src/index.ts 及固定范围 inventory；组件：packages/dsh-daruma。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 monorepo 下 packages/dsh-daruma。
- 下一步：核对真实模型请求目标、次数和释放。

**分析版本**

- **仓库**：[SISCHOI/daruma](https://github.com/SISCHOI/daruma)
- **版本号**：0.1.11（[固定提交 b705e73](https://github.com/SISCHOI/daruma/tree/b705e73030b61e8cb27f7106e900d00f4ef50930)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 真实请求完成事件可能改善归因。

核对真实模型请求目标、次数和释放。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 217 | — | — | 1591 |
| .ts | test | 16 | 1998 | 1643 | 126 | — |
| .ts | source | 21 | 2467 | 1660 | 604 | — |
| .tsx | source | 3 | 475 | 375 | 56 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SISCHOI/daruma/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/SISCHOI/daruma/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SISCHOI/daruma/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模型故障切换如何工作且应怎样验证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Daruma 怎样恢复模型请求？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

配置多个已注册模型的用户可在宿主内置重试退出后走备用通道。错误事件把故障和重试状态交给引擎，FAILOVER 时按 agent 暂存目标并返回 retry，下一次 agent/request 重新组装模型配置。相比用户发现失败后手工切模型，该设计在请求路径内触发备援。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-daruma/src/index.ts:123-157](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/src/index.ts#L123-L157)

实际事件与待用目标

<details>
<summary>查看原文（35行）</summary>

```text
  ctx.on('agent/request', async (payload, next) => {
    // A new request attempt supersedes any recorded failure attribution.
    failedSinceRequest.delete(payload.agent.id)
    const current: LlmCallConfig = await next()
    const armed = pending.get(payload.agent.id)
    if (armed) {
      pending.delete(payload.agent.id)
      const { config: swapped, effort } = await toFailoverConfig(current, armed, ctx.llm)
      currentChannel.set(payload.agent.id, channelIdOfConfig(swapped))
      ctx.logger.warn(
        `dsh-daruma: switching ${current.provider}/${current.model} -> ${swapped.provider}/${swapped.model}`,
      )
      logEffortDisposition(ctx, armed, effort)
      return swapped
    }
    currentChannel.set(payload.agent.id, channelIdOfConfig(current))
    return current
  })

  ctx.on('agent/request-error', async (payload, next): Promise<RequestErrorAction> => {
    failedSinceRequest.add(payload.agent.id)
    const channel = currentChannel.get(payload.agent.id) ?? channelIdOf(payload.provider, '')
    // Reaching this listener already means the in-box retry declined the code;
    // for a code its own policy calls retryable, that is a spent budget rather
    // than a single attempt.
    const signal = toFailureSignal(
      payload.failure,
      channel,
      Date.now(),
      isRetryExhausted(payload.failure.code, payload.retryPolicy),
    )
    const plan = engine.onFailure(signal, backupChannel(), payload.agent.id)

    if (plan.verdict.kind === 'FAILOVER') {
      pending.set(payload.agent.id, plan.verdict.target)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-daruma/src/index.ts:173-198](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/src/index.ts#L173-L198)

仅切换分支接管重试

<details>
<summary>查看原文（26行）</summary>

```text
      })
      ctx.logger.warn(
        `dsh-daruma: failover ${channel} -> ${plan.verdict.target.id} (${signal.code}) agent=${payload.agent.id} turn=${payload.turn} step=${payload.step}`,
      )
      return { kind: 'retry' }
    }

    if (plan.verdict.kind === 'GIVE_UP') {
      const reason = plan.verdict.reason === 'no-routable-fallback' ? 'no-routable-fallback' : 'give-up-budget-exhausted'
      failoverLog.append({
        kind: 'give-up',
        t: Date.now(),
        agentId: payload.agent.id,
        from: channel,
        reason,
        status: payload.failure.status,
        turn: payload.turn,
        step: payload.step,
        failoverCount: plan.failoverCount,
        giveUpBudget: engine.giveUpBudget,
      })
      ctx.logger.error(`dsh-daruma: giving up (${plan.verdict.reason})`)
    }

    // RETRY_NOW / GIVE_UP: delegate downstream (retry may still own it).
    return next()
```

</details>

**依据 3 · 作者声明**：[packages/dsh-daruma/README.md:148-170](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/README.md#L148-L170)

作者列出候选与预算

<details>
<summary>查看原文（23行）</summary>

````text
Add a `dsh-daruma` entry to your profile's `cordis.patch.yml` (or rely on the
bundle defaults) with an ordered failover chain:

```yaml
- id: dsh-daruma
  name: dsh-daruma
  config:
    channels:
      - provider: mt
        model: glm-5.3
      - provider: mt
        model: deepseek-v4-flash
      - provider: mt-cc
        model: claude-3-5-haiku-latest
    failureBudget: 3     # consecutive failures before a channel trips
    cooldownMs: 30000    # how long a tripped channel stays unroutable
    giveUpBudget: 8      # per-agent failover budget before giving up
    # stateFile: /path/to/isolated/health.json   # REQUIRED for test profiles
    # logFile: /path/to/isolated/failover-log.jsonl
```

Each channel is a `{ provider, model }` pair reachable by the LLM adapter
registry (same names you use in the settings model selector).
````

</details>

#### 缺口

- 未触发真实故障
  **影响**：不能量化恢复率或请求次数
  **进一步探讨**：用双模拟适配器触发限流和正常重试

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 何时仍会给出错误健康信号或放弃？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

插件从下一步及轮次结束推断成功，失败集合会屏蔽已记录的未续发失败，不能等同宿主给出的请求成功回执。无可路由目标或预算用尽时记录 give-up 并交还宿主。备用 Provider 会接收下一次模型请求，应先确认它可以处理这类数据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-daruma/src/index.ts:180-218](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/src/index.ts#L180-L218)

放弃及成功推断

<details>
<summary>查看原文（39行）</summary>

```text
    if (plan.verdict.kind === 'GIVE_UP') {
      const reason = plan.verdict.reason === 'no-routable-fallback' ? 'no-routable-fallback' : 'give-up-budget-exhausted'
      failoverLog.append({
        kind: 'give-up',
        t: Date.now(),
        agentId: payload.agent.id,
        from: channel,
        reason,
        status: payload.failure.status,
        turn: payload.turn,
        step: payload.step,
        failoverCount: plan.failoverCount,
        giveUpBudget: engine.giveUpBudget,
      })
      ctx.logger.error(`dsh-daruma: giving up (${plan.verdict.reason})`)
    }

    // RETRY_NOW / GIVE_UP: delegate downstream (retry may still own it).
    return next()
  })

  // The host exposes no request-success event. Two adjacent host events prove
  // "the previous model request completed without erroring":
  //   1. `agent/pre-step` — the loop proposes the next step;
  //   2. `agent/turn-stopping` — the turn is about to close.
  // At either point, `currentChannel` still names the channel of the last
  // request, so it earns a success record — unless a failure is still
  // un-attributed (`failedSinceRequest`), which gates the false-positive
  // where the turn died on an error and never sent another request.
  // The turn-stopping arm is what makes single-step tasks (headless one-shot
  // prompts) reset health: their only pre-step fires before any request.
  // Never blocks the host loop: errors are logged and swallowed; the
  // pre-step waterfall always calls through.
  const recordInferredSuccess = (agentId: string): void => {
    const channel = currentChannel.get(agentId)
    if (channel !== undefined && !failedSinceRequest.has(agentId)) {
      engine.onSuccess(channel)
    }
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-daruma/src/index.ts:220-242](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/src/index.ts#L220-L242)

事件及释放清理

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.on('agent/pre-step', async (payload, next) => {
    try {
      recordInferredSuccess(payload.agent.id)
    } catch (error) {
      ctx.logger.warn(`dsh-daruma: success recording failed: ${String(error)}`)
    }
    return next()
  })

  ctx.on('agent/turn-stopping', ({ agent }) => {
    try {
      recordInferredSuccess(agent.id)
    } catch (error) {
      ctx.logger.warn(`dsh-daruma: success recording failed: ${String(error)}`)
    }
  })

  ctx.on('agent/disposed', ({ agent }) => {
    currentChannel.delete(agent.id)
    pending.delete(agent.id)
    failedSinceRequest.delete(agent.id)
    engine.clearScope(agent.id)
  })
```

</details>

**依据 3 · 作者声明**：[packages/dsh-daruma/README.md:162-173](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/README.md#L162-L173)

预算、模型可用性和隔离

<details>
<summary>查看原文（12行）</summary>

````text
    failureBudget: 3     # consecutive failures before a channel trips
    cooldownMs: 30000    # how long a tripped channel stays unroutable
    giveUpBudget: 8      # per-agent failover budget before giving up
    # stateFile: /path/to/isolated/health.json   # REQUIRED for test profiles
    # logFile: /path/to/isolated/failover-log.jsonl
```

Each channel is a `{ provider, model }` pair reachable by the LLM adapter
registry (same names you use in the settings model selector).

> ⚠️ Every chain channel must exist in your `settings.yaml` providers — a
> channel whose provider is missing gets armed on failover, burns one budget
````

</details>

#### 缺口

- 未验证取消、请求中断及模型替换后的实际输入
  **影响**：不能证明健康状态准确或备用模型合规
  **进一步探讨**：测中断、不可达目标和跨供应商输入

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何评估采用成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在隔离 profile 配两条合成模型通道、独立状态和日志，先测失败、成功、耗尽及退出。上游调用费取决于各供应商和重试次数，预算与可见性需实测。禁用插件后读回宿主默认模型和已留日志。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-daruma/README.md:122-149](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/README.md#L122-L149)

日志、安装和配置

<details>
<summary>查看原文（28行）</summary>

````text
## Audit log

Every failover / give-up / boot decision is appended to
`~/.dsh/daruma/failover-log.jsonl` (rotates at 2 MiB to one `.1` generation;
write failures are swallowed — a lost line never breaks recovery):

```jsonl
{"kind":"boot","t":1788860215489,"pid":38660,"channels":["mt::glm-5.3","mt::deepseek-v4-flash","mt-cc::claude-3-5-haiku-latest"],"failureBudget":3,"cooldownMs":30000,"giveUpBudget":8}
{"kind":"failover","t":1788850743199,"agentId":"session-2c50…","from":"mt::glm-5.3","to":"mt::deepseek-v4-flash","reason":"RATE_LIMIT","turn":1,"step":1,"failoverCount":1,"giveUpBudget":8}
{"kind":"give-up","t":1788850876140,"agentId":"session-295a…","from":"mt::deepseek-v4-flash","reason":"no-routable-fallback","turn":1,"step":1,"failoverCount":1,"giveUpBudget":8}
```

`reason` is the failure code for failovers (`RATE_LIMIT`, `QUOTA`, …) or the
give-up cause (`give-up-budget-exhausted` / `no-routable-fallback`);
`failoverCount` / `giveUpBudget` capture the budget state at the decision.

## Install

```bash
dsh plugin --profile web add dsh-daruma   # from npm
# or from a checkout:
dsh plugin --profile web add link:./packages/daruma-core link:./packages/dsh-daruma
```

## Configure

Add a `dsh-daruma` entry to your profile's `cordis.patch.yml` (or rely on the
bundle defaults) with an ordered failover chain:
````

</details>

**依据 2 · 作者声明**：[packages/dsh-daruma/README.md:156-173](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/README.md#L156-L173)

备用目标和隔离文件

<details>
<summary>查看原文（18行）</summary>

````text
      - provider: mt
        model: glm-5.3
      - provider: mt
        model: deepseek-v4-flash
      - provider: mt-cc
        model: claude-3-5-haiku-latest
    failureBudget: 3     # consecutive failures before a channel trips
    cooldownMs: 30000    # how long a tripped channel stays unroutable
    giveUpBudget: 8      # per-agent failover budget before giving up
    # stateFile: /path/to/isolated/health.json   # REQUIRED for test profiles
    # logFile: /path/to/isolated/failover-log.jsonl
```

Each channel is a `{ provider, model }` pair reachable by the LLM adapter
registry (same names you use in the settings model selector).

> ⚠️ Every chain channel must exist in your `settings.yaml` providers — a
> channel whose provider is missing gets armed on failover, burns one budget
````

</details>

**依据 3 · 作者声明**：[packages/dsh-daruma/README.md:196-210](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/README.md#L196-L210)

宿主 Web 传输兼容条件

<details>
<summary>查看原文（15行）</summary>

```text
The web transport is bound **late, from an injection callback**
(`src/host-mount.ts`): the host's `dsh-client-connection` provides its
`connection` service synchronously through `0.1.0-rc.x`, but awaits browser-auth
setup first on `0.1.5-rc.1`/`0.1.5-rc.2`, so the service may not exist yet when
this plugin's `apply` runs. Reading it with a synchronous `ctx.get('connection')`
skipped the `/dsh-daruma` RPC channel — and with it the status dock and backup
picker — on those hosts, so the mount waits for the service and records the
capability snapshot at that point. Hosts without a web transport (headless)
simply never fire the callback.

> Known host limitation: on `0.1.5-rc.1`/`0.1.5-rc.2` the channel still cannot
> register — those hosts dropped `webServer` from the connection plugin's own
> inject list while `rpc.handle()` registers its route through the service
> context, so every caller gets `cannot get property "webServer" without
> inject`. daruma logs that failure loudly and keeps failover working; the
```

</details>

#### 缺口

- 没有供应商计费或真实宿主验证
  **影响**：成本及状态 UI 可用性未知
  **进一步探讨**：先进行计数的本地模拟

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 请求完成信号能否改善健康归因？

**研究主题**：新假设与验证

#### 完整回答

若宿主能提供携带 request ID 的成功事件，可替代相邻生命周期事件推断。对照失败后取消、正常停止和两次快速重试，用真实完成数核对误记；若没有显著降低误记，则保留当前实现。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-daruma/src/index.ts:201-242](https://github.com/SISCHOI/daruma/blob/b705e73030b61e8cb27f7106e900d00f4ef50930/packages/dsh-daruma/src/index.ts#L201-L242)

现有推断及状态清理

<details>
<summary>查看原文（42行）</summary>

```text
  // The host exposes no request-success event. Two adjacent host events prove
  // "the previous model request completed without erroring":
  //   1. `agent/pre-step` — the loop proposes the next step;
  //   2. `agent/turn-stopping` — the turn is about to close.
  // At either point, `currentChannel` still names the channel of the last
  // request, so it earns a success record — unless a failure is still
  // un-attributed (`failedSinceRequest`), which gates the false-positive
  // where the turn died on an error and never sent another request.
  // The turn-stopping arm is what makes single-step tasks (headless one-shot
  // prompts) reset health: their only pre-step fires before any request.
  // Never blocks the host loop: errors are logged and swallowed; the
  // pre-step waterfall always calls through.
  const recordInferredSuccess = (agentId: string): void => {
    const channel = currentChannel.get(agentId)
    if (channel !== undefined && !failedSinceRequest.has(agentId)) {
      engine.onSuccess(channel)
    }
  }

  ctx.on('agent/pre-step', async (payload, next) => {
    try {
      recordInferredSuccess(payload.agent.id)
    } catch (error) {
      ctx.logger.warn(`dsh-daruma: success recording failed: ${String(error)}`)
    }
    return next()
  })

  ctx.on('agent/turn-stopping', ({ agent }) => {
    try {
      recordInferredSuccess(agent.id)
    } catch (error) {
      ctx.logger.warn(`dsh-daruma: success recording failed: ${String(error)}`)
    }
  })

  ctx.on('agent/disposed', ({ agent }) => {
    currentChannel.delete(agent.id)
    pending.delete(agent.id)
    failedSinceRequest.delete(agent.id)
    engine.clearScope(agent.id)
  })
```

</details>

#### 缺口

- 宿主事件兼容性未知
  **影响**：该改进可能要求上游支持
  **进一步探讨**：先梳理事件契约再用模拟序列比较

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
