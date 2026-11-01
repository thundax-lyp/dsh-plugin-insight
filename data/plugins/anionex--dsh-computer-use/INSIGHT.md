# DSH Computer Use

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d3fd041](https://github.com/Anionex/dsh-computer-use/tree/d3fd041c15bba6e8859098e466c21e4186d1dbb4)

<!-- BEGIN META -->
[![GitHub ★ 85](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=85&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 4,746](https://img.shields.io/static/v1?label=npm+30d&message=4%2C746&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-computer-use)
<!-- END META -->

> **功能**：为 DSH 提供面向应用的桌面观察与操作工具。

> **亮点**：[Q02](#research-q02) 串接观察、目标校验、租约和动作后观察。

> **主要限制**：[Q03](#research-q03) 确认门依赖调用方敏感标记，并非自动识别所有高风险动作。

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
  - [Q01 · 何时使用目标应用控制而不是手工操作？](#detail-section-11)
  - [Q02 · 观察、目标校验和动作如何串接？](#detail-section-12)
  - [Q03 · 敏感操作确认是否自动发现所有高风险动作？](#detail-section-13)
  - [Q04 · 部署及出现不确定结果后如何处理？](#detail-section-14)
  - [Q05 · 怎样帮助用户处理动作结果不确定？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望让 DSH 协助操作 macOS 应用的用户。

用户可手工操作目标应用并自行确认。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 应用观察 | 获取状态和目标 | 需 read 租约和系统权限 |
| 桌面动作 | 操作目标 | 需 control 租约 |
| 敏感确认 | 绑定单次动作 | 依赖敏感标记 |
| 动作后观察 | 获取新状态 | 观察失败不能撤销动作 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 宿主及 macOS helper | 运行必需 | 暴露工具及执行 | 不可用 |
| macOS 系统权限 | 观察及输入必需 | 系统授权 | 用户需自行授权 |
| 应用租约 | 应用访问必需 | 限制访问范围 | 拒绝或请求授权 |
| 敏感标记及确认 | 敏感动作必需 | 单次操作授权 | 标记动作缺 token 时拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置宿主、系统权限及应用租约 | 权限不足则停止 |
| 观察 | 代理读取目标应用状态 | 确认 app 和目标匹配 |
| 确认与操作 | 用户授权敏感动作，代理提交绑定动作 | 拒绝或目标变化时重新观察 |
| 验收与恢复 | 用户核对动作后的真实状态 | 观察失败先检查应用，避免盲目重复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 设备和软件费用未知 | 配置权限与租约时间未知 | 依赖 macOS 与宿主 |
| 持续使用 | 模型及计算消耗未知 | 观察与敏感动作审核时间未知 | 取决于应用和任务 |
| 失败恢复 | 重试资源费用未知 | 应用状态核对与恢复时间未知 | 可能已有外部副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 目标绑定 | 静态源码约束观察和目标 | 实机误操作率 |
| 敏感确认 | 标记动作需一次性 token | 高风险动作标记完整性 |
| 结果观察 | 动作后请求新观察 | 动作已发生时观察失败的恢复效果 |

> **思考**：[Q03](#research-q03) 确认门依赖调用方敏感标记，并非自动识别所有高风险动作。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 串接观察、目标校验、租约和动作后观察。

[Q02](#research-q02) 操作后观察失败不能证明动作未发生；[Q03](#research-q03) 敏感门依赖标记。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 确认门依赖调用方敏感标记，并非自动识别所有高风险动作。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从隔离可逆任务开始，敏感操作显式授权并复核。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查；未运行 macOS helper、宿主或目标应用。

- 已检查：作者 README、包清单、源码路径 README.md、src/service.ts、src/confirmations.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件静态分析；未运行设备或断言完整 native 路径。
- 下一步：隔离 app 测审批、状态变更、动作成功后观察失败和用户复核。

**分析版本**

- **仓库**：[Anionex/dsh-computer-use](https://github.com/Anionex/dsh-computer-use)
- **版本号**：0.3.7（[固定提交 d3fd041](https://github.com/Anionex/dsh-computer-use/tree/d3fd041c15bba6e8859098e466c21e4186d1dbb4)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 动作后观察失败显式提示不确定，须对照已有检查验证。

隔离 app 测审批、状态变更、动作成功后观察失败和用户复核。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1411 | — | — | 20753 |
| .js | source | 20 | 4174 | 3939 | 217 | — |
| .mjs | source | 9 | 1034 | 954 | 14 | — |
| .ts | source | 20 | 4911 | 4249 | 296 | — |
| .tsx | source | 1 | 580 | 546 | 6 | — |
| .ts | test | 24 | 7104 | 6499 | 118 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/Anionex/dsh-computer-use/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查桌面观察动作、授权及不确定结果边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时使用目标应用控制而不是手工操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH 用户可通过观察、目标解析和应用动作辅助桌面任务；用户也可直接手工完成，自动操作能否省时取决于任务和 UI 稳定性。此组件不证明任务结果正确，也未验证特定 macOS 应用。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:205-222](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/README.md#L205-L222)

访问租约与敏感动作说明。

<details>
<summary>查看原文（18行）</summary>

```text
An observation contains an opaque id and expiry, exact app identity, frontmost/window metadata, bounded tree text, current elements with opaque target handles, optional screenshot metadata, and permission state. Target handles expose no provider object reference or native identifier. Secure text values are emitted as `[secure]`; they do not enter target descriptors, tree text, Tool results, screenshot metadata, or native errors. A screenshot can still contain other visible application data and should be treated as sensitive.

For Electron applications, the helper requests document accessibility through AXManualAccessibility and waits a bounded time for web controls to appear. For a web element in an app that supports this writable attribute, allowCoordinateFallback=true opts into one target-process pointer click at the element center before any AX press. Other apps (including WebKit web areas), native controls, and calls without this opt-in keep the semantic AX path. A successful AX press is never retried based on an unchanged tree: its effect may be delayed or external. Host pointer and activation policies still apply.

Coordinate actions accept three spaces: `window` and `screen` are measured in points, the unit of Accessibility frames, while `screenshot` is measured in the observation screenshot's pixels. A screenshot is captured at the window's backing scale without the drop shadow, so the image is a direct rendering of the window frame and `screenshot.pixelScale` reports pixels per point (normally `2` on Retina). Coordinates read off the screenshot image must therefore be passed as `coordinateSpace: 'screenshot'`; passing them as `window` points offsets the click by the pixel scale — on a 2x display a click intended for the middle of a window lands at twice its offset and can miss the control entirely. The service converts screenshot pixels to window points before any input is sent, and rejects window coordinates that exceed the frame but fit the screenshot with an error naming the scale.

The technical access model has two exact-bundle-id leases:

- `read`: inspect Accessibility state and a requested screenshot;
- `control`: send UI input to the selected application.

Without a configured grant, DSH asks for approval. Read approval lasts for the Session; control approval lasts for the current turn. A user rejection is final for that app and scope for the rest of the Session.

The Bundle keeps Session-wide read grants and rejected app/scope decisions in its own `computer_use_state` storage-domain sidecar, fenced by the Session header's `createdAt` and `cwd`. It does not add Computer Use events to the official Session log or modify DSH Core. The Web Profile already composes `@deepseek-ai/dsh-storage-domain`; a custom Profile must compose it before this Bundle if interactive read grants or durable rejections are needed. Exact grants configured in Settings remain available without storage-domain, and an allowed control decision remains process-local for the current turn. When a durable interactive decision cannot be stored, the operation fails clearly instead of silently weakening its lifetime.

The DSH `danger-full-access` preset uses `approval/policy: never`, so an ungranted app is policy-blocked before any prompt. The plugin reports an actionable `COMPUTER_PERMISSION_REQUIRED` error and does not record that outcome as a user rejection. Add the exact bundle id in Computer Use Settings or use a preset whose approval policy is `ask`.

High-impact communication, sensitive-data transmission, irreversible deletion, account/security/privacy changes, unrequested installation, legal acceptance, and financial completion beyond explicit authorization require `computer_confirm` immediately before execution. The token is short-lived, one-use, and bound to the exact app, process, observation, target handle, and action. Grants do not bypass it. If resolution moves beyond the exact locator, the token is invalidated and a fresh observation plus confirmation is required.
```

</details>

**依据 2 · 源码核查**：[src/service.ts:408-413](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L408-L413)

观察前解析应用并检查 read 租约。

```text
  /** Obtain a fresh, scoped observation after enforcing the app read lease. */
  async observe(request: ComputerObserveRequest, context: ComputerUseContext): Promise<ComputerObservation> {
    const signal = AbortSignal.any([context.signal, this.lifecycle.signal])
    const app = await this.backend.resolveApp(request.app, signal)
    await this.leases.ensure(context.agent, app, 'read', 'computer_observe', context.callId, signal)
    return await this.capture(app, request, context, 'computer_observe')
```

#### 缺口

- 未与手工任务对照
  **影响**：不能量化效率和错误率
  **进一步探讨**：相同应用和任务比较时间、误操作和人工恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 观察、目标校验和动作如何串接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

observe 先解析 app 并请求 read 租约，act 引用持有者 observation、归一坐标并按 app 排队；动作再次检查目标、control 租约，敏感目标重绑定时撤销 token 拒绝执行。后端动作发生后再捕获新观察；动作后观察失败不证明动作未发生，不能盲目重试。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:408-413](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L408-L413)

观察入口。

```text
  /** Obtain a fresh, scoped observation after enforcing the app read lease. */
  async observe(request: ComputerObserveRequest, context: ComputerUseContext): Promise<ComputerObservation> {
    const signal = AbortSignal.any([context.signal, this.lifecycle.signal])
    const app = await this.backend.resolveApp(request.app, signal)
    await this.leases.ensure(context.agent, app, 'read', 'computer_observe', context.callId, signal)
    return await this.capture(app, request, context, 'computer_observe')
```

**依据 2 · 源码核查**：[src/service.ts:434-464](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L434-L464)

观察绑定及每进程排队。

<details>
<summary>查看原文（31行）</summary>

```text
  /** Execute one observation-bound action and always return a fresh post-action observation. */
  async act(action: ComputerActionRequest, context: ComputerUseContext): Promise<ComputerActionResult> {
    const signal = AbortSignal.any([context.signal, this.lifecycle.signal])
    const stored = this.requireObservation(action.observationId, context.agent)
    if (action.kind === 'wait') return await this.wait(stored, action, context, signal)
    const normalized = normalizeActionCoordinates(action, stored.backend)
    return await this.enqueueAction(stored.backend.app, async () => {
      signal.throwIfAborted()
      return await this.actNow(normalized, context, signal)
    })
  }

  /** Keep this service's actions for one process ordered through post-action observation. */
  private async actNow(
    action: Exclude<ComputerActionRequest, { kind: 'wait' }>,
    context: ComputerUseContext,
    signal: AbortSignal,
  ): Promise<ComputerActionResult> {
    const stored = this.requireObservation(action.observationId, context.agent)
    const index = targetIndex(action)
    const handle = targetHandle(action)
    const originalElement = index === undefined ? undefined : stored.backend.elements.find(candidate => candidate.index === index)
    if (index !== undefined && originalElement === undefined) {
      throw new ComputerUseError('COMPUTER_ELEMENT_UNAVAILABLE', `element ${index} is not part of observation ${String(action.observationId)}`)
    }
    if (allowsTargetRebind(action) && handle === undefined) {
      throw new ComputerUseError('COMPUTER_TARGET_UNAVAILABLE', 'allowRebind requires a targetHandle from the referenced observation')
    }
    const descriptor = handle === undefined ? undefined : stored.targets.get(handle)
    if (handle !== undefined && descriptor === undefined) {
      throw new ComputerUseError('COMPUTER_TARGET_UNAVAILABLE', 'targetHandle is unknown or does not belong to the referenced observation')
```

</details>

**依据 3 · 源码核查**：[src/service.ts:486-492](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L486-L492)

应用 control 租约。

```text
    if (requiresForegroundPermission(action) && this.config.interaction.focusPolicy === 'preserve') {
      throw new ComputerUseError(
        'COMPUTER_ACTION_BLOCKED',
        'AXRaise may raise the target window, which interaction.focusPolicy preserve denies; enable explicit activation in host Settings before using this action',
      )
    }
    await this.leases.ensure(context.agent, stored.backend.app, 'control', `computer_${action.kind}`, context.callId, signal)
```

**依据 4 · 源码核查**：[src/service.ts:535-547](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L535-L547)

敏感目标变化须重新确认。

<details>
<summary>查看原文（13行）</summary>

```text
      if (descriptor !== undefined) {
        const resolved = resolveComputerTarget(stored.backend, actionObservation, descriptor, allowsTargetRebind(action))
        actionObservation = resolved.observation
        element = resolved.element
        resolution = resolved.resolution
      }
    }
    if (action.sensitive === true && resolution?.targetChanged === true) {
      this.confirmations.invalidate(context.agent, action.confirmationToken)
      throw new ComputerUseError(
        'COMPUTER_TARGET_REBIND_REQUIRES_CONFIRMATION',
        'the sensitive target rebound to a fresh element; observe the current UI and request a new one-use confirmation before acting',
      )
```

</details>

**依据 5 · 源码核查**：[src/service.ts:598-611](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L598-L611)

消耗 token 后调用 backend。

<details>
<summary>查看原文（14行）</summary>

```text
      ...(actionObservation.window === undefined ? {} : { window: actionObservation.window }),
    }
    try {
      this.confirmations.consume(context.agent, stored.backend.app, action)
      if (cursorStarted && visualization?.kind === 'drag') {
        const tracked = await this.backend.actDragWithCursor(
          request,
          visualization as BackendCursorAction & { kind: 'drag' },
          signal,
        )
        recordCursor(tracked.cursor)
        outcome = tracked.action
      } else {
        outcome = await this.backend.act(request, signal)
```

</details>

**依据 6 · 源码核查**：[src/service.ts:640-654](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L640-L654)

动作后捕获观察。

<details>
<summary>查看原文（15行）</summary>

```text
    do {
      if (this.config.settleMs > 0) await delay(this.config.settleMs, undefined, { signal })
      latest = await this.backend.observe(stored.backend.app, {
        screenshot: 'none',
        maxNodes: this.config.maxNodes,
        maxDepth: this.config.maxDepth,
        maxTextBytes: this.config.maxTextBytes,
      }, signal)
      if (latest.stateHash !== actionObservation.stateHash) { settled = true; break }
    } while (Date.now() - started < this.config.maxSettleMs)
    const observation = await this.capture(
      stored.backend.app,
      { app: { bundleId: stored.backend.app.bundleId, pid: stored.backend.app.pid }, screenshot: stored.public.screenshot === undefined ? 'none' : 'optional' },
      context,
      'computer_action',
```

</details>

#### 缺口

- 未运行 native 后端或触发 post-observation 失败
  **影响**：不能保证设备上动作和恢复行为
  **进一步探讨**：隔离应用注入动作成功后观察失败，复查状态再决定重试。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 敏感操作确认是否自动发现所有高风险动作？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

README 要求高影响操作确认；实际 consume 仅在 action.sensitive=true 时要求 token，false 或缺省不触发此门。请求确认时审批未允许或取消失败，token 为一次性并绑定 app、进程、观察和 action hash；不能声称源码自动识别所有敏感操作。其他权限租约和平台限制仍独立生效。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:220-226](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/README.md#L220-L226)

产品指引及权限限制。

```text
The DSH `danger-full-access` preset uses `approval/policy: never`, so an ungranted app is policy-blocked before any prompt. The plugin reports an actionable `COMPUTER_PERMISSION_REQUIRED` error and does not record that outcome as a user rejection. Add the exact bundle id in Computer Use Settings or use a preset whose approval policy is `ask`.

High-impact communication, sensitive-data transmission, irreversible deletion, account/security/privacy changes, unrequested installation, legal acceptance, and financial completion beyond explicit authorization require `computer_confirm` immediately before execution. The token is short-lived, one-use, and bound to the exact app, process, observation, target handle, and action. Grants do not bypass it. If resolution moves beyond the exact locator, the token is invalidated and a fresh observation plus confirmation is required.

## macOS permissions and native integrity

The Web Settings section reports helper integrity, Accessibility and Screen Recording status, active generation, interaction policy, limits, and exact application grants. Its buttons can open the relevant macOS privacy pane after a user click; the plugin cannot grant TCC permission itself.
```

**依据 2 · 源码核查**：[src/confirmations.ts:55-84](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/confirmations.ts#L55-L84)

审批请求和 token 绑定。

<details>
<summary>查看原文（30行）</summary>

```text
      throw new ComputerUseError(
        'COMPUTER_CONFIRMATION_REQUIRED',
        'sensitive action confirmation is blocked because approval prompts are disabled in this Session (approval/policy: never); do not execute the action, and ask the user to switch the permission preset to one with approval ask or run it manually',
      )
    }
    const outcome = await this.ctx.approval.request({
      agent,
      toolName: 'computer_confirm',
      ...(callId === undefined ? {} : { callId }),
      reason: `${request.reason} Target: ${request.target}.${request.dataSummary === undefined ? '' : ` Data: ${request.dataSummary}.`}`,
      signal,
    })
    if (outcome === 'cancelled') throw new ComputerUseError('COMPUTER_CANCELLED', 'sensitive action confirmation was cancelled')
    if (outcome !== 'allowed-once') {
      throw new ComputerUseError('COMPUTER_CONFIRMATION_REQUIRED', `sensitive action was not confirmed (${outcome})`)
    }
    const token = ComputerConfirmationToken(randomUUID())
    const expiresAt = Date.now() + this.config().confirmationTtlMs
    let agentRecords = this.records.get(agent)
    if (agentRecords === undefined) {
      agentRecords = new Map()
      this.records.set(agent, agentRecords)
    }
    agentRecords.set(token, {
      app,
      observationId: request.action.observationId,
      actionHash: actionHash(request.action),
      expiresAt,
    })
    return { token, observationId: request.action.observationId, app, expiresAt: new Date(expiresAt).toISOString() }
```

</details>

**依据 3 · 源码核查**：[src/confirmations.ts:87-110](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/confirmations.ts#L87-L110)

敏感标记门与单次消耗。

<details>
<summary>查看原文（24行）</summary>

```text
  /** Require and consume the one matching token when an action is marked sensitive. */
  consume(agent: Agent, app: ComputerAppIdentity, action: ComputerActionRequest): void {
    if (action.sensitive !== true) {
      if (action.confirmationToken !== undefined) {
        throw new ComputerUseError('COMPUTER_CONFIRMATION_REQUIRED', 'confirmationToken is valid only when sensitive is true')
      }
      return
    }
    const token = action.confirmationToken
    if (token === undefined) {
      throw new ComputerUseError('COMPUTER_CONFIRMATION_REQUIRED', 'sensitive action requires a token from computer_confirm')
    }
    const agentRecords = this.records.get(agent)
    const record = agentRecords?.get(token)
    if (record === undefined) {
      throw new ComputerUseError('COMPUTER_CONFIRMATION_REQUIRED', 'confirmation token is unknown, expired, or already consumed')
    }
    agentRecords?.delete(token)
    if (record.expiresAt < Date.now()) {
      throw new ComputerUseError('COMPUTER_CONFIRMATION_REQUIRED', 'confirmation token expired')
    }
    if (record.app.bundleId !== app.bundleId || record.app.pid !== app.pid
      || record.observationId !== action.observationId || record.actionHash !== actionHash(action)) {
      throw new ComputerUseError('COMPUTER_CONFIRMATION_REQUIRED', 'confirmation token does not match this app, observation, or action')
```

</details>

#### 缺口

- 未验证宿主对模型指示与实际标记
  **影响**：无法保证高风险动作总被标记
  **进一步探讨**：在隔离宿主复核 false、true、取消、token 失效及目标变化。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署及出现不确定结果后如何处理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、macOS helper 和系统辅助功能/屏幕录制权限，按 app 配 read/control 授权；不能自行授予系统权限。对不可逆动作应先明确用户授权并显式确认，后端或观察失败先人工核对实际应用，再决定是否重试；依赖、隐私和使用成本未实测。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:205-226](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/README.md#L205-L226)

租约、确认和系统权限。

<details>
<summary>查看原文（22行）</summary>

```text
An observation contains an opaque id and expiry, exact app identity, frontmost/window metadata, bounded tree text, current elements with opaque target handles, optional screenshot metadata, and permission state. Target handles expose no provider object reference or native identifier. Secure text values are emitted as `[secure]`; they do not enter target descriptors, tree text, Tool results, screenshot metadata, or native errors. A screenshot can still contain other visible application data and should be treated as sensitive.

For Electron applications, the helper requests document accessibility through AXManualAccessibility and waits a bounded time for web controls to appear. For a web element in an app that supports this writable attribute, allowCoordinateFallback=true opts into one target-process pointer click at the element center before any AX press. Other apps (including WebKit web areas), native controls, and calls without this opt-in keep the semantic AX path. A successful AX press is never retried based on an unchanged tree: its effect may be delayed or external. Host pointer and activation policies still apply.

Coordinate actions accept three spaces: `window` and `screen` are measured in points, the unit of Accessibility frames, while `screenshot` is measured in the observation screenshot's pixels. A screenshot is captured at the window's backing scale without the drop shadow, so the image is a direct rendering of the window frame and `screenshot.pixelScale` reports pixels per point (normally `2` on Retina). Coordinates read off the screenshot image must therefore be passed as `coordinateSpace: 'screenshot'`; passing them as `window` points offsets the click by the pixel scale — on a 2x display a click intended for the middle of a window lands at twice its offset and can miss the control entirely. The service converts screenshot pixels to window points before any input is sent, and rejects window coordinates that exceed the frame but fit the screenshot with an error naming the scale.

The technical access model has two exact-bundle-id leases:

- `read`: inspect Accessibility state and a requested screenshot;
- `control`: send UI input to the selected application.

Without a configured grant, DSH asks for approval. Read approval lasts for the Session; control approval lasts for the current turn. A user rejection is final for that app and scope for the rest of the Session.

The Bundle keeps Session-wide read grants and rejected app/scope decisions in its own `computer_use_state` storage-domain sidecar, fenced by the Session header's `createdAt` and `cwd`. It does not add Computer Use events to the official Session log or modify DSH Core. The Web Profile already composes `@deepseek-ai/dsh-storage-domain`; a custom Profile must compose it before this Bundle if interactive read grants or durable rejections are needed. Exact grants configured in Settings remain available without storage-domain, and an allowed control decision remains process-local for the current turn. When a durable interactive decision cannot be stored, the operation fails clearly instead of silently weakening its lifetime.

The DSH `danger-full-access` preset uses `approval/policy: never`, so an ungranted app is policy-blocked before any prompt. The plugin reports an actionable `COMPUTER_PERMISSION_REQUIRED` error and does not record that outcome as a user rejection. Add the exact bundle id in Computer Use Settings or use a preset whose approval policy is `ask`.

High-impact communication, sensitive-data transmission, irreversible deletion, account/security/privacy changes, unrequested installation, legal acceptance, and financial completion beyond explicit authorization require `computer_confirm` immediately before execution. The token is short-lived, one-use, and bound to the exact app, process, observation, target handle, and action. Grants do not bypass it. If resolution moves beyond the exact locator, the token is invalidated and a fresh observation plus confirmation is required.

## macOS permissions and native integrity

The Web Settings section reports helper integrity, Accessibility and Screen Recording status, active generation, interaction policy, limits, and exact application grants. Its buttons can open the relevant macOS privacy pane after a user click; the plugin cannot grant TCC permission itself.
```

</details>

**依据 2 · 源码核查**：[src/service.ts:598-611](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L598-L611)

动作调用后端。

<details>
<summary>查看原文（14行）</summary>

```text
      ...(actionObservation.window === undefined ? {} : { window: actionObservation.window }),
    }
    try {
      this.confirmations.consume(context.agent, stored.backend.app, action)
      if (cursorStarted && visualization?.kind === 'drag') {
        const tracked = await this.backend.actDragWithCursor(
          request,
          visualization as BackendCursorAction & { kind: 'drag' },
          signal,
        )
        recordCursor(tracked.cursor)
        outcome = tracked.action
      } else {
        outcome = await this.backend.act(request, signal)
```

</details>

**依据 3 · 源码核查**：[src/service.ts:640-654](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L640-L654)

随后重新观察。

<details>
<summary>查看原文（15行）</summary>

```text
    do {
      if (this.config.settleMs > 0) await delay(this.config.settleMs, undefined, { signal })
      latest = await this.backend.observe(stored.backend.app, {
        screenshot: 'none',
        maxNodes: this.config.maxNodes,
        maxDepth: this.config.maxDepth,
        maxTextBytes: this.config.maxTextBytes,
      }, signal)
      if (latest.stateHash !== actionObservation.stateHash) { settled = true; break }
    } while (Date.now() - started < this.config.maxSettleMs)
    const observation = await this.capture(
      stored.backend.app,
      { app: { bundleId: stored.backend.app.bundleId, pid: stored.backend.app.pid }, screenshot: stored.public.screenshot === undefined ? 'none' : 'optional' },
      context,
      'computer_action',
```

</details>

#### 缺口

- 未执行安装或目标任务
  **影响**：兼容性和恢复成本未知
  **进一步探讨**：隔离 app 验证权限撤销、关闭窗口、审批取消和观察中断。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样帮助用户处理动作结果不确定？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

源码已有动作后新观察及目标重绑定时撤销确认，是直接反证；不能说完全没有动作后检查。假设当后端已返回成功但后续观察失败时，显式展示“动作可能已发生、先核对再重试”帮助用户决策。对照现有错误呈现，在隔离应用注入 backend 成功后 capture 失败、backend 明确失败、超时及正常路径，比较重复动作、漏执行、判断时间与人工复核成本；若重复率不降、误报导致漏执行或成本抵消收益则否定。完整 UI 错误展示未穷尽。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:598-611](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L598-L611)

后端调用在捕获前。

<details>
<summary>查看原文（14行）</summary>

```text
      ...(actionObservation.window === undefined ? {} : { window: actionObservation.window }),
    }
    try {
      this.confirmations.consume(context.agent, stored.backend.app, action)
      if (cursorStarted && visualization?.kind === 'drag') {
        const tracked = await this.backend.actDragWithCursor(
          request,
          visualization as BackendCursorAction & { kind: 'drag' },
          signal,
        )
        recordCursor(tracked.cursor)
        outcome = tracked.action
      } else {
        outcome = await this.backend.act(request, signal)
```

</details>

**依据 2 · 源码核查**：[src/service.ts:640-654](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L640-L654)

后续 capture。

<details>
<summary>查看原文（15行）</summary>

```text
    do {
      if (this.config.settleMs > 0) await delay(this.config.settleMs, undefined, { signal })
      latest = await this.backend.observe(stored.backend.app, {
        screenshot: 'none',
        maxNodes: this.config.maxNodes,
        maxDepth: this.config.maxDepth,
        maxTextBytes: this.config.maxTextBytes,
      }, signal)
      if (latest.stateHash !== actionObservation.stateHash) { settled = true; break }
    } while (Date.now() - started < this.config.maxSettleMs)
    const observation = await this.capture(
      stored.backend.app,
      { app: { bundleId: stored.backend.app.bundleId, pid: stored.backend.app.pid }, screenshot: stored.public.screenshot === undefined ? 'none' : 'optional' },
      context,
      'computer_action',
```

</details>

**依据 3 · 源码核查**：[src/service.ts:535-547](https://github.com/Anionex/dsh-computer-use/blob/d3fd041c15bba6e8859098e466c21e4186d1dbb4/src/service.ts#L535-L547)

目标变化已有确认失效控制。

<details>
<summary>查看原文（13行）</summary>

```text
      if (descriptor !== undefined) {
        const resolved = resolveComputerTarget(stored.backend, actionObservation, descriptor, allowsTargetRebind(action))
        actionObservation = resolved.observation
        element = resolved.element
        resolution = resolved.resolution
      }
    }
    if (action.sensitive === true && resolution?.targetChanged === true) {
      this.confirmations.invalidate(context.agent, action.confirmationToken)
      throw new ComputerUseError(
        'COMPUTER_TARGET_REBIND_REQUIRES_CONFIRMATION',
        'the sensitive target rebound to a fresh element; observe the current UI and request a new one-use confirmation before acting',
      )
```

</details>

#### 缺口

- 未穷尽 UI 错误展示及设备实际失败语义
  **影响**：不能认定该提示不存在或有改善
  **进一步探讨**：隔离环境对照现有输出及原型并核实后端返回。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
