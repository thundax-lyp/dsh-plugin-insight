# DSH Browser CDP

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0f93d7b](https://github.com/drscrewdriver/dsh-browser-cdp/tree/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/drscrewdriver/dsh-browser-cdp) [![npm 30d 30,270](https://img.shields.io/static/v1?label=npm+30d&message=30%2C270&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-browser-cdp) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-browser-cdp)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中接入结构化浏览器工具和可交互的页面观察窗。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 说明，可以把按需浏览工具和人能看见的页面输入放进一个宿主流程，便于记录任务目标和人工接手。

> **主要限制**：[Q02](#research-q02) 的输入门禁只检查 cookie 键形状，部分 CLI 帧有回退。[Q03](#research-q03) 的评审终止只是回执，仍需核实目标页面和外发边界。

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
  - [Q01 · DSH 的浏览工具怎样出现和收回？](#detail-section-11)
  - [Q02 · 人能否看见实际目标并接过鼠标？](#detail-section-12)
  - [Q03 · 自动评审回路给出什么结论，传送哪些材料？](#detail-section-13)
  - [Q04 · 观察试用的成本、数据边界与退出怎么核查？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要用 DSH 操作测试网页且希望随时查看真实标签页的开发者，可以先在空白浏览空间核对现状。

原办法是用普通浏览器手工打开、截图、操作和汇报结果，必要时另用 CLI 或 DevTools。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 浏览工具 | 发出浏览及页面读取指令 | 工具深度按活动与配置 |
| 观察及接手 | 从 DSH 看帧和发送输入 | 核对实时目标与图像 |
| 评审回路 | 在预算内尝试网页任务 | 可向配置服务送页面状态，回执需要验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 与浏览器工具服务 | 必需 | 挂载模型工具 | 工具不可用于会话 |
| Web Server 与可用浏览器后端 | 观察和接管必需 | 承载图像和输入 | 无观察或通道降级 |
| FFmpeg 或远程评审 | 对应可选能力需要 | 编码或评审 | 对应能力不可用或回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者创建空白测试空间 | 无复用登录 |
| 观察 | 核对 URL、目标和新帧 | 标签与当前任务一致 |
| 接手 | 在公开页面试一次动作 | 页面状态确实改变 |
| 退出 | 断开观察和浏览连接 | 回到普通浏览器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器进程和构建资源 | 核对兼容与空间 | 安装耗时未知 |
| 持续使用 | 截图与评审开销 | 验证目标及外发条件 | 单任务成本未知 |
| 失败恢复 | 重新连线或重新登录 | 核对误操作并恢复手工 | 停止和复原时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工具分层 | 按活动和配置注册 | 模型上下文净降幅 |
| 人工接手 | 实际输入转发并查目标 | 错帧、焦点和更新延迟 |
| 评审回路 | 有限预算及停止回执 | 正确结束及数据边界 |

> **思考**：[Q02](#research-q02) 的输入门禁只检查 cookie 键形状，部分 CLI 帧有回退。[Q03](#research-q03) 的评审终止只是回执，仍需核实目标页面和外发边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 说明，可以把按需浏览工具和人能看见的页面输入放进一个宿主流程，便于记录任务目标和人工接手。

[Q02](#research-q02) 的 worker 复核目标存活与独立错误回执，便于区分画面和输入；[Q03](#research-q03) 的预算仍需要最终页面验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的输入门禁只检查 cookie 键形状，部分 CLI 帧有回退。[Q03](#research-q03) 的评审终止只是回执，仍需核实目标页面和外发边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先观察空白测试空间的公开页面，目标或状态不能确认时断开连接并退回手工操作。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持宿主注册、Web 转发和有限动作路径。实际通道隔离、安全性、输出质量与控制效果等待独立验证。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、lib/index.js、src/index.ts、src/cast-server.ts、src/worker/cdp-cast-worker.ts、src/jev/attempt.ts、src/jev/judge.ts、package.json、src/cdp/capabilities.ts、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主注册、Web 输入及帧代理、目标保护、任务作用域和有限评审路径。未执行宿主、浏览器、外部服务、下载、登录搬迁或内置运行时审计。
- 下一步：用公开页面对照手工与插件浏览，以目标 ID、URL 和截图核对动作，再测试 [Q03](#research-q03) 所列数据约束能否减少误报。

**分析版本**

- **仓库**：[drscrewdriver/dsh-browser-cdp](https://github.com/drscrewdriver/dsh-browser-cdp)
- **版本号**：1.9.51（[固定提交 0f93d7b](https://github.com/drscrewdriver/dsh-browser-cdp/tree/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出限定评审可送的数据类别，并分别核对模型停止决定与只读页面事实；用误报和额外调用成本检验。

用公开页面对照手工与插件浏览，以目标 ID、URL 和截图核对动作，再测试 [Q03](#research-q03) 所列数据约束能否减少误报。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 23 | 14251 | 10604 | 3230 | — |
| .md | source | 33 | 7907 | — | — | 137126 |
| .js | source | 10 | 32759 | 29263 | 3512 | — |
| .ts | source | 76 | 32227 | 23131 | 7634 | — |
| .ts | test | 94 | 15477 | 12523 | 1718 | — |
| .mjs | test | 1 | 21 | 11 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/drscrewdriver/dsh-browser-cdp/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/drscrewdriver/dsh-browser-cdp/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/drscrewdriver/dsh-browser-cdp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器交给 DSH 后，人能否看清实际页面并可靠接管，同时核实会话与工具范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 的浏览工具怎样出现和收回？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

有一组公开网页测试、希望在 DSH 内发出浏览指令并观察页面的开发者，可以把手工切浏览器的步骤搬到同一宿主。补丁挂载根模块，工具注册根据活动、后端和配置分层，lazy 模式用 bcdp_status 作引导入口，闲置回收后重新收窄。若启用会话脉冲，工具注册深度取多个会话的最大值，单会话显示另依赖宿主 restrict，如果函数缺失或调用抛错则可能同时看到已经全局注册的工具。浏览空间由活动会话和配置派生，自动命名使用去掉前缀后的短 token，调用无会话时使用共享默认空间，明确的名称也可共享。命名与持久化是不同机制，遇到短前缀碰撞或后端附着差异不能用配置文字保证隔离。相比手工切窗，实际增量是可按需进入的工具分层和任务关联。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:15-17](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/cordis.patch.yml#L15-L17)

挂载包名对应的根模块。

```text
- insert:
    - id: dsh-browser-cdp
      name: "dsh-browser-cdp"
```

**依据 2 · 源码核查**：[lib/index.js:12248-12264](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/lib/index.js#L12248-L12264)

实际发布文件接入工具注册。

<details>
<summary>查看原文（17行）</summary>

```text
	const maxSessionDepth = () => {
		let m = 0;
		for (const d of sessionDepth.values()) if (d > m) m = d;
		return m;
	};
	const tiers = createTierInjector({
		register: (tool) => {
			const dispose = ctx.tools.register(tool);
			ctx.effect?.(() => dispose);
			return dispose;
		},
		policy: () => ({
			injection: cfg.toolInjection,
			toolBrowse: cfg.toolBrowse,
			toolExtended: cfg.toolExtended,
			toolEscape: cfg.toolEscape,
			toolJudge: cfg.toolJudge,
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2553-2588](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/index.ts#L2553-L2588)

按配置、后端和活动设置工具面。

<details>
<summary>查看原文（36行）</summary>

```text
  let browserActive = false
  // ── Per-session depth tracking ──────────────────────────────────────────
  // When sessionScopedPulse is ON: each session's pulse advances only its own
  // depth; the global browseBatchDepth (which drives tierAllowed/registration)
  // is the MAX across all sessions. Visibility isolation requires host-level
  // restrict; without it, registration stays process-wide but per-session
  // idle sealing still works correctly.
  const sessionDepth = new Map<string, number>()
  let browseBatchDepth = 0

  /** Compute max depth from all tracked sessions, or 0 if none. */
  const maxSessionDepth = (): number => {
    let m = 0
    for (const d of sessionDepth.values()) if (d > m) m = d
    return m
  }

  const tiers: TierInjector = createTierInjector({
    register: (tool) => {
      const dispose = ctx.tools.register(tool) as unknown as () => void
      // Cordis lifecycle: unregister the tool when the plugin unmounts.
      ctx.effect?.(() => dispose)
      return dispose
    },
    policy: () => ({
      injection: cfg.toolInjection,
      toolBrowse: cfg.toolBrowse,
      toolExtended: cfg.toolExtended,
      toolEscape: cfg.toolEscape,
      toolJudge: cfg.toolJudge,
      judgeConfigured: judgeConfigured({ jevKey: cfg.jevKey, layaKey: cfg.layaKey }),
      active: browserActive,
      batchDepth: browseBatchDepth,
      // kind 闸：链路类型是设置里的静态值（volatile），冷启动即可收窄；
      // 未知 kind 走 'cdp'（全开），宁可多给不可误封。
      backendKind: backendKindOf(resolveEffectiveLink(cfg.links, cfg.activeTargetId)?.link?.kind),
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2618-2649](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/index.ts#L2618-L2649)

全局注册深度和可选会话限制。

<details>
<summary>查看原文（32行）</summary>

```text
      // Only restrict among tools that are ALREADY globally registered;
      // the filter hides those this session hasn't earned.
      for (const name of tiers.surface().live) {
        if (toolAllowed(name, pol)) allowed.add(name)
      }
      const restrictFn = (ctx.tools as unknown as Record<string, unknown>).restrict
      if (typeof restrictFn === 'function') {
        (restrictFn as (f: { allow: string[] }) => void)({ allow: [...allowed] })
      }
    } catch {
      // Restrict unavailable from plugin fiber scope; degrade silently.
    }
  }

  /**
   * Activity pulse: advance browse batch depth. When sessionScopedPulse is ON
   * and a sessionId is given, only that session's depth advances; the global
   * depth = max across sessions drives tier registration. Without restrict
   * support the effect is still beneficial for per-session sealAfterReap.
   */
  const pulseActivity = (sessionId?: string): void => {
    const before = browseBatchDepth
    browserActive = true
    if (cfg.sessionScopedPulse && sessionId) {
      const cur = Math.min(BATCH_ORDER.length, (sessionDepth.get(sessionId) ?? 0) + 1)
      sessionDepth.set(sessionId, cur)
      browseBatchDepth = Math.max(browseBatchDepth, maxSessionDepth())
    } else {
      browseBatchDepth = Math.min(BATCH_ORDER.length, browseBatchDepth + 1)
    }
    if (before !== browseBatchDepth) tiers.reapply()
    if (cfg.sessionScopedPulse && sessionId) tryRestrictSession(sessionId)
```

</details>

**依据 5 · 源码核查**：[src/index.ts:2661-2673](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/index.ts#L2661-L2673)

闲置时重置所启用的工具。

<details>
<summary>查看原文（13行）</summary>

```text
  const sealAfterReap = (): void => {
    if (cfg.toolInjection !== 'lazy' || !browserActive) return
    if (cfg.sessionScopedPulse && sessionDepth.size > 0) {
      // All sessions idle → reset global; individual session reset handled by
      // per-session timestamps in the reaper (simplified: bulk reset here).
      sessionDepth.clear()
      browseBatchDepth = 0
    } else {
      browseBatchDepth = 0
    }
    browserActive = false
    tiers.reapply()
  }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:288-319](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/index.ts#L288-L319)

自动空间、无会话的共享和会话短 token。

<details>
<summary>查看原文（32行）</summary>

```text
export function deriveSlotDefaultName(
  rc: { defaultSpace: string; isolateSpaces: boolean },
  sessionKey: string,
): string {
  const name = rc.defaultSpace
  if (name === AUTO_SPACE_SENTINEL) {
    if (sessionKey === GLOBAL_SESSION_KEY) return DEFAULT_SPACE
    return AUTO_SPACE_PREFIX + sessionSpaceToken(sessionKey)
  }
  return name
}

/**
 * A stable, space-name-safe 8-char token for a DSH session id.
 *
 * DSH session ids look like `session-52adc205-3251-…`, so the old
 * `slice(0, 8)` yielded the literal `session-` for EVERY session — silently
 * collapsing all sessions into one space, i.e. exactly the failure this
 * feature exists to prevent. The known prefix is stripped and
 * hyphens kept, other non-alphanumerics dropped, then sliced to 8; a short id
 * is used as-is (still unique), and only a degenerate/empty id falls back to a
 * deterministic FNV-1a hash so the name is never empty.
 * @internal exported for tests
 */
export function sessionSpaceToken(sessionId: string): string {
  // Keep hyphens (a space name may contain them, and it stays readable);
  // drop everything else so the token is always a legal space name.
  const bare = sessionId.replace(/^session-/, '').replace(/[^A-Za-z0-9-]/g, '')
  if (bare.length > 0) return bare.slice(0, 8)
  // An empty/degenerate id still needs a non-empty, deterministic token.
  let h = 0x811c9dc5
  for (let i = 0; i < sessionId.length; i += 1) {
```

</details>

#### 缺口

- 缺同任务、宿主工具列表及共享空间的实测
  **影响**：无法验证各会话的配置行为或上下文用量
  **进一步探讨**：使用两个无凭据样例会话对照工具可见性及页面状态，再设置共享名和缺少 restrict 的宿主模拟

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 人能否看见实际目标并接过鼠标？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

宿主提供 webServer 才挂观察路由。观察输入经过 Host POST 转给浏览器 worker，worker 另查浏览器已连接、客户端有目标 ID 并且目标仍存在，然后派发输入。无浏览器、旧目标或失败都给不同状态，收到画面只能证明当前显示的帧可用。命名的 API 保护通过 cookie 头中是否有 dsh-auth- 前缀的键作启发式，代码没有验证 cookie 值；无 cookie 会拒绝，要验证监听能否被不受信网络访问以及值伪造时行为，才能扩大使用范围。CLI 帧路由在无原生帧时可转播缓存，按目标请求找不到确切画面时还可能挑当前圈内第一帧。对用户而言接手前应核实 URL、目标标识和截图，旧帧和动作回执不能单独证明操作落到正确目标。

#### 证据与依据

**依据 1 · 源码核查**：[src/cast-server.ts:966-1003](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/cast-server.ts#L966-L1003)

Web 服务存在性与插件路由 cookie 键检查。

<details>
<summary>查看原文（38行）</summary>

```text
  // The web shell exposes `webServer` — the only HTTP host surface the plugin
  // uses. It is NOT a required inject (TUI / headless hosts have none), so we
  // resolve it opportunistically via ctx.get('webServer'); if absent here there
  // is nothing to register, so exit cleanly.
  const rawServer = (ctx as EgoContext).get?.('webServer') as WebServerLike | undefined
  if (!rawServer || typeof rawServer.register !== 'function') {
    return
  }

  // ── trust fence for /api/bcdp/* ────────────────────────────────────────────
  // Exact-path routes match BEFORE the host's `/api` prefix trust-fence route,
  // so every handler below would otherwise answer unauthenticated requests.
  // The host issues a `dsh-auth-<processKey>` cookie that is HttpOnly AND
  // SameSite=Strict: a cross-site page (CSRF driver-by) never carries it, so
  // requiring its mere presence closes the remote surface. A local process can
  // still forge the header, but that is the same threat tier as the host's own
  // token fence (a local process can read the process token too).
  const isTrustedRequest = (req: IncomingMessage): boolean =>
    /(?:^|;\s*)dsh-auth-[^=]+=/.test(String(req.headers.cookie ?? ''))
  const guardHandler = (handler: NonNullable<RegisterRouteOptions['handler']>) =>
    async (req: unknown, resRaw: unknown) => {
      const res = resRaw as ServerResponse
      if (!isTrustedRequest(req as IncomingMessage)) {
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end('{"ok":false,"error":"unauthorized"}')
        return
      }
      return handler(req, res)
    }
  // Scope the guard to THIS plugin's registrations only: never patch the host
  // webServer singleton in place — other plugins' routes registered through the
  // same service instance must keep their own (unguarded) semantics.
  const rawRegister = rawServer.register.bind(rawServer) as (opts: RegisterRouteOptions) => () => void
  const server = Object.assign(Object.create(Object.getPrototypeOf(rawServer)), rawServer, {
    register: (opts: RegisterRouteOptions) => rawRegister({
      ...opts,
      handler: opts.handler ? guardHandler(opts.handler) : opts.handler,
```

</details>

**依据 2 · 源码核查**：[src/cast-server.ts:1114-1143](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/cast-server.ts#L1114-L1143)

CLI 帧和 Tabbit 缓存回退。

<details>
<summary>查看原文（30行）</summary>

```text
  // GET /api/bcdp/cli-frame — the ego-cli degraded frame source. Serves the
  // newest CLI-captured viewport PNG (image/png) so the watch panel's <img> can
  // load it directly; 204 when the poller has no frame yet (cold start, switch
  // off, or a space with no active page). Local read-only, no SSE image mirror.
  const disposeCliFrame = server.register({
    kind: 'exact',
    path: EGO_CLI_FRAME_ROUTE,
    handler: async (reqRaw: unknown, resRaw: unknown) => {
      const req = reqRaw as IncomingMessage
      const res = resRaw as ServerResponse
      const url = new URL(req.url ?? '/', 'http://127.0.0.1')
      const want = url.searchParams.get('targetId') ?? ''
      const pollerFrame = cliPoller && cliPoller.isRunning() ? cliPoller.getFrame() : null
      let body: Buffer | null = pollerFrame?.png ?? null
      let contentType = 'image/png'
      let seq = String(pollerFrame?.seq ?? 0)
      let servedTarget = ''
      // tabbit frames never reach `cliPoller` — they are broadcast per tab and land
      // in `lastCliFrames`. Serving only the poller left every tabbit panel on 204
      // ("有图也不显示"), so fall back to the broadcast ring: exact target when
      // asked, otherwise the newest frame of the last cycle.
      if (body === null && lastCliFrames !== null && lastCliFrames.length > 0) {
        const exact = want === '' ? undefined : lastCliFrames.find((img) => img.targetId === want)
        const pick = exact ?? lastCliFrames[0]
        if (pick !== undefined) {
          body = pick.png
          contentType = pick.fmt === 'jpeg' ? 'image/jpeg' : 'image/png'
          seq = String(lastCliFrameAt)
          servedTarget = pick.targetId
        }
```

</details>

**依据 3 · 源码核查**：[src/cast-server.ts:1161-1176](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/cast-server.ts#L1161-L1176)

Host 输入入口转发到 worker。

<details>
<summary>查看原文（16行）</summary>

```text
  // POST /api/bcdp/input — forward a watch-panel pointer/wheel intention to the
  // real agent page. Coordinates are already in browser CSS pixels (the panel
  // maps them). The web shell passes the raw body through to the worker.
  const disposeInput = server.register({
    kind: 'exact',
    path: EGO_INPUT_ROUTE,
    handler: async (reqRaw: unknown, resRaw: unknown) => {
      const req = reqRaw as IncomingMessage
      const res = resRaw as ServerResponse
      const port = await ensureWorker()
      if (port === null) return sendJson(res, 400, { ok: false, error: 'no live agent browser' })
      const body = await readJsonBody(req).catch(() => ({}) as Record<string, unknown>)
      const result = await proxyPost(port, '/api/input', body)
      if (!result) return sendJson(res, 502, { ok: false, error: 'input worker unavailable' })
      return sendJson(res, result.status, result.body)
    },
```

</details>

**依据 4 · 源码核查**：[src/worker/cdp-cast-worker.ts:517-529](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/worker/cdp-cast-worker.ts#L517-L529)

worker 重新识别实时 targetId 和派发条件。

<details>
<summary>查看原文（13行）</summary>

```text
      if (req.method === 'POST' && url.pathname === '/api/input') {
        const body = await readJson(req)
        if (!active) return sendJson(res, 409, { ok: false, code: 'browser-disconnected', error: 'no live browser' })
        if (!body.targetId) return sendJson(res, 400, { ok: false, code: 'target-required', error: 'targetId required' })
        const targets = await listTargets()
        if (!targets.some((target) => target.targetId === body.targetId)) {
          return sendJson(res, 409, { ok: false, code: 'capture-target-stale', error: 'target is no longer available' })
        }
        try {
          return sendJson(res, 200, await active.sessions.sendInput(body.targetId as string, body))
        } catch (error) {
          return sendJson(res, 503, { ok: false, code: 'input-dispatch-failed', error: (error as Error).message || String(error) })
        }
```

</details>

#### 缺口

- 没有界面适配、端口访问和不匹配目标的实测
  **影响**：不推断实际 Web 信任边界或鼠标控制时延
  **进一步探讨**：在只含测试标签页的环境比较过期帧、关页后输入和伪造 cookie 值，检查实际目标变化

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动评审回路给出什么结论，传送哪些材料？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用、新假设与验证

#### 完整回答

可选 bcdp_jev_attempt 先运行附着检查、解析任务与限制动作预算，导航成功后让评审在候选编号和 end 中选择。构造状态时纳入任务目标、成功条件、实际页面 URL、元素角色和名称，以及前序动作标签；内容可能含网站数据。已配置 HTTP 评审时向指定服务提交状态和问题，源码中的标题白名单约束状态结构，不能证明里面的内容没有敏感信息。end 也可能是页面没有进一步动作，结果回执明确要求再用目标截图或 CDP 确认。可以在派发前为目标设置允许接收的数据类别，再以单独只读验收器检查最终页面；比较误报、图像读取和多一步调用成本，若接收方提示不准或无法减少虚假完成，则否定设计。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:6034-6067](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/index.ts#L6034-L6067)

实际评审工具和动作数范围。

<details>
<summary>查看原文（34行）</summary>

```text
      name: 'bcdp_jev_attempt',
      description:
        "Open a URL and let the decision model attempt one goal: each round it picks from the page's DOM candidates plus `end`, up to N actions. Returns a receipt; verify yourself via bcdp_cdp/bcdp_screenshot (a receipt is a report, not proof).",
      parameters: {
        url: { type: 'string', required: true, description: 'Absolute URL to open.' },
        goal: { type: 'string', required: true, description: 'The goal, in your own words.' },
        successCriteria: { type: 'string', description: 'Success condition per line; helps the model decide when to stop.' },
        maxActions: { type: 'integer', description: 'Action budget (default 5, max 20).' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: { ok: { type: 'boolean', required: true }, text: { type: 'string', required: true } },
        },
        render: renderText,
      },
      timeoutMs: TOOL_TIMEOUT_MS,
      execute: async (args: Record<string, unknown>, exec: ToolExec) => {
        cfg.spaceTracker.setCurrentSession(callingSessionId(exec), resolveEffectiveLink(cfg.links, cfg.activeTargetId)?.link.id ?? ''); markEgoToolCall(callingSessionId(exec))
          pendingViewport = cfg
        const blocked = attachGate()
        if (blocked !== '') return { ok: false, text: blocked }
        const url = str(args.url, '')
        const goal = str(args.goal, '')
        if (url === '') return { ok: false, text: 'bcdp_jev_attempt: url is required' }
        if (goal === '') return { ok: false, text: 'bcdp_jev_attempt: goal is required' }
        const maxActions = Math.min(20, Math.max(1, num(args.maxActions, 5)))

        const judge = judgeCfg()
        const runtime = judgeRuntimeOf()
        const effects = effectsOf(runtime)
        const criteria = str(args.successCriteria, '')
        const intent: IntentSpec = {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:6076-6087](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/index.ts#L6076-L6087)

导航、执行回路和不得以回执代替复核。

<details>
<summary>查看原文（12行）</summary>

```text
        const started = Date.now()
        const nav = await effects.navigate(url)
        if (!nav.ok) return { ok: false, text: `bcdp_jev_attempt: navigation failed �?${nav.error ?? 'unknown error'}` }

        const result = await runAttempt({ intent, effects, maxActions })

        const lines: string[] = [
          `status     : ${result.status.toUpperCase()}  actions=${result.actions.length}/${maxActions}`,
          `reason     : ${result.reason}`,
          `page       : ${result.lastUrl || nav.url}`,
          `elapsed    : ${Date.now() - started}ms  candidates(last round)=${result.candidates}`,
          `verify via : bcdp_cdp / bcdp_screenshot on targetId=${effects.frames().at(-1)?.target.targetId ?? 'unknown'} �?the receipt is a report, not a proof`,
```

</details>

**依据 3 · 源码核查**：[src/jev/attempt.ts:93-122](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/jev/attempt.ts#L93-L122)

end 含义、状态字段和结构检查。

<details>
<summary>查看原文（30行）</summary>

```text
function endOptionText(): string {
  return 'the goal is already achieved, or nothing on this page can advance it — stop and report back'
}

export function buildAttemptState(frame: Frame, intent: IntentSpec, actions: readonly AttemptStep[], maxActions: number): string {
  const nodes = frame.dom.nodes
  const lines: string[] = []
  lines.push('# INTENT')
  lines.push(`goal: ${intent.goal}`)
  for (const criterion of intent.successCriteria) lines.push(`success criterion: ${criterion}`)
  lines.push(`actions left: ${Math.max(0, maxActions - actions.length)}`)
  lines.push('')
  lines.push('# FRAME')
  lines.push(`url: ${frame.target.url}`)
  if (frame.dom.truncated) {
    lines.push(`(candidate list truncated: showing ${nodes.length} of ${frame.dom.total})`)
  }
  for (const node of nodes) lines.push(`${node.n}. ${candidateLine(node)}`)
  if (actions.length > 0) {
    lines.push('')
    lines.push('# HISTORY')
    for (const step of actions) {
      lines.push(`${step.ok ? 'ok' : 'FAILED'}: ${step.label}`)
    }
  }
  const state = lines.join('\n')
  // Same guard the narrowing loop uses: if a heading ever leaks in that is not
  // one of the whitelisted sections, this throws BEFORE anything is sent.
  assertJudgeIsolation(state)
  return state
```

</details>

**依据 4 · 源码核查**：[src/jev/judge.ts:150-189](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/jev/judge.ts#L150-L189)

HTTP 评审将状态与问题发至配置服务。

<details>
<summary>查看原文（40行）</summary>

```text
      // The whole reason this check exists: laya-api has no anonymous branch, so
      // sending anyway guarantees a 401 and burns a round trip to learn nothing.
      return { ok: false, reason: `${this.name}-no-api-key` }
    }
    if (this.config.model.trim() === '') return { ok: false, reason: `${this.name}-no-model` }
    return { ok: true, reason: '' }
  }

  async decide(req: JudgeRequest, deps: JudgeDeps): Promise<JudgeResponse> {
    const started = deps.now()
    const issues = validateQuestions(req.questions)
    const fatal = issues.filter((issue) => issue.code !== 'choice-criteria-over-limit')
    if (fatal.length > 0) {
      // Reject locally. A 422 says "bad request" and reads to a human as "the
      // model refused", which is the most expensive kind of false signal.
      return refuse(this.name, started, deps.now(), fatal.map((issue) => `${issue.code}:${issue.questionId}`))
    }

    const body = buildSystemOneRequest(req.state, req.questions, this.config.model)
    const url = `${this.config.baseUrl.replace(/\/+$/, '')}/v1/systemone`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs)
    try {
      const response = await deps.fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          // Always sent. For jev this is the user's key; for laya it is the
          // shared local key. An empty one was already caught by available().
          authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      if (!response.ok) {
        return refuse(this.name, started, deps.now(), [`http-${response.status}`])
      }
      const payload = (await response.json()) as SystemOneEnvelope
      const normalized = normalizeAnswers(payload.answers, Object.keys(req.questions))
      const latencyMs = deps.now() - started
```

</details>

#### 缺口

- 没有基准任务、实际配置或外发数据检查
  **影响**：不能证明回路任务成功或发送边界符合具体环境
  **进一步探讨**：用仿真服务记录出站字段、模拟每种停止原因并独立回读页面状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 观察试用的成本、数据边界与退出怎么核查？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

最适合先观察无登录态、可随时销毁的公开测试页。用手工浏览器作对照，分别让 DSH 打开同一页面、核对目标标题并由人点击一次。CDP 观察依赖图形宿主 Web 和可附着浏览器；Lightpanda 会降级视图与元素选取，未知标识投影完整功能不保证存在，CLI 图像可能只是低频截图。切到直播 FFmpeg 或外部评审会增加资源、平台权限和可能的服务成本，均无同任务数据。日常费用还包括核对附着对象、登录态、手动退出和保存结果。出现携带旧页面状态、目标 ID 与实际画面不符，或同一输入在错误标签出现时，应断开连接、关闭插件的观察窗口并退回手工操作。考虑 cookie 导入的作者声明和 Host 路由验证能力，建议先保留观察结论，使用测试空间验证关联和退出。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:36-48](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/package.json#L36-L48)

DSH 版本范围与 Web 依赖。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.1.0-rc.2 <0.3.0-0"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale"
      ]
    },
```

</details>

**依据 2 · 源码核查**：[src/cdp/capabilities.ts:69-108](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/cdp/capabilities.ts#L69-L108)

不同浏览引擎的能力投影。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * The capability projection per engine. `chrome` / `unknown` → full
 * capabilities (bit-for-bit today's behavior); `lightpanda` → the analysis
 * (docs/plans/2026-10-04-lightpanda-backend-analysis.md §7) projection;
 * `tabbit` → CLI-protocol limitations (no download events, no overlay pick,
 * no raw CDP screencast through the plugin's usual path).
 */
export function capabilitiesFor(engine: EngineId): BackendCapabilities {
  if (engine === 'lightpanda') {
    return {
      engine: 'lightpanda',
      screencast: false, // no screencast methods at all
      overlay: false, // no Overlay domain (UnknownMethod on enable)
      bindingCalled: false, // addBinding exists, the event never fires
      imageFormat: 'png', // captureScreenshot rejects other formats (-32000)
      loadEvent: false, // lifecycleEvent(load) replaces loadEventFired
      downloadEvents: false, // no downloadWillBegin / downloadProgress
      browserClose: false,
    }
  }
  if (engine === 'tabbit') {
    // Tabbit browser IS Chromium (CDP fully present), but the tabbit-cli
    // connection model restricts what the plugin can reach:
    //   - Browser.* and Target.* domains rejected (no tab enumeration)
    //   - Playwright download events unavailable (connection-mode limit)
    //   - Overlay/bindingCalled work only via newCDPSession (page-scoped)
    //   - Screencast available (Page domain allowed) but needs 2nd CDP session
    // The plugin gate uses these flags to skip tools that would hang/fail.
    return {
      engine: 'tabbit',
      screencast: true,       // Page.startScreencast allowed via newCDPSession
      overlay: false,         // Overlay domain works but plugin pick path needs Browser.*
      bindingCalled: false,   // Runtime.addBinding not reliably reachable
      imageFormat: 'jpeg',    // Tabbit is Chromium, jpeg native
      loadEvent: true,        // Playwright handles load waiting
      downloadEvents: false,  // SKILL.md: "download events unavailable"
      browserClose: false,    // Browser.* rejected
    }
  }
  return { ...FULL, engine }
```

</details>

**依据 3 · 作者声明**：[README.md:353-361](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/README.md#L353-L361)

作者说明帧模式、权限和 FFmpeg 条件。

```text
### 画面后端

- `cdp`：`Page.startScreencast` JPEG，默认 20 FPS。每个源帧立即按 Chrome 提供的帧 ID ACK，只保留最新待发帧；仅捕获当前观看标签，静态页恢复截图默认 3 秒一次。
- `ffmpeg`：Windows 以 `gfxcapture(hwnd)` 直接采集目标 Chrome 窗口的 D3D11 surface；其他平台使用显示来源 crop。随后编码 H.264 fragmented MP4 → HTTP 二进制 chunk → MediaSource `<video>`，不经过 Base64/SSE。
- `auto`：默认选择 CDP，不检测成功也不会自动下载 FFmpeg。FFmpeg 安装并通过能力检查后才可选择；已保存的 FFmpeg 后端若后来失效，本次观察会回退 CDP 并展示原因。
- **非 CDP 连接模式（本机 ego CLI / 本机 Tabbit CLI）**：这两类通道拿不到 `Page.startScreencast` 直推，观察窗改走**后台轮询拍帧**——每 3s 一次，帧写到临时文件后由 host 读回再广播（回执只带路径，不带字节）。因此它是“看快照”而不是“看直播”：静态页约 3s 一帧，重页面（单帧接近 8s 截止线）会明显低于这个频率；拿不到帧时以 `skipped` 标记跳过，不会挂死面板。
- Windows FFmpeg 必须包含 `gfxcapture`。插件按 browser PID、target title 和 CDP window bounds 匹配 HWND；窗口移动或被遮挡时仍捕获目标页面，并且不允许回退到桌面录制。若 target 是同一 Chrome 窗口里的后台 tab，会明确报错而不是展示当前可见 tab 或抢用户焦点。macOS 首次使用需要“屏幕录制”权限；X11 需要 Chromium 与 FFmpeg 共享 `DISPLAY`；Wayland 缺少 Portal/PipeWire 输入时会提示切回 CDP。

托管 FFmpeg 安装到 `~/.dsh/cache/ego-browser/ffmpeg/`，不会写入插件目录。Windows/Linux 使用固定 BtbN release tag；macOS 使用固定的 `ffmpeg-static` GitHub release 资产（其 Intel/Apple Silicon 二进制分别来源于 Evermeet/OSXExperts）。所有下载均固定资源 SHA-256，只提取 FFmpeg 主程序，不安装 `ffprobe` 或 `ffplay`。Windows/Linux 解包使用系统 `tar`；缺少时会在下载前明确报错。
```

**依据 4 · 作者声明**：[README.md:418-430](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/README.md#L418-L430)

作者说明附着能力与 Cookie 落盘边界。

<details>
<summary>查看原文（13行）</summary>

```text
- **安装环境**：本仓库的 DSH peer 包不全在公共 npm registry。普通 `pnpm install` 可能在解析 `@deepseek-ai/*` peer 时失败；DSH profile 安装应提供这些 peer。CDP 不依赖 FFmpeg，也不会在插件安装阶段下载二进制。
- **快照质量**：Linux 用 CDP `DOMSnapshot` 重建语义树，非 macOS 内核级，复杂 iframe/画布场景可能降级。
- **宿主可靠性（Linux）**：未合并的社区 PR，跨 CLI 调用间可能丢 tab/空间状态；插件已内置防御，简单流程稳定，复杂流程可能需重试。
- **登录态持久化**：Chrome 运行期 Cookie 仅优雅关闭时落盘，强杀重启需重登。
- **Tabbit 通道覆盖面**：仅 `space` / `navigate` / `snapshot` / `click` / `fill` / `screenshot` / `tab op=list` 已接入，其余工具返回明确错误而不回落其他后端；观察窗只能看帧、不能点选元素引用，无下载事件（`capabilities.ts` 的 `tabbit` 投影：`overlay` / `bindingCalled` / `downloadEvents` / `browserClose` 均为 false）。`bcdp_jev_*` 评审链在 Tabbit 下没有接入分发器，调用返回“尚未支持”而不是错驱另一个浏览器。
- 输出 schema 为宽松 `additionalProperties: true`，客户端以实际返回值为准。

## macOS 开箱与 Cookie 排查

- **开箱可用**：macOS 上 Chrome 从不在 `PATH`，而在 `.app` 包内。本版自动探测 `/Applications` 与 `~/Applications` 下的 Chrome / Chromium / Edge / Brave / Tungsten Edge，并注入运行时；headed 启动不依赖 X11/Xvfb（macOS 图形栈是 Aqua/Quartz，本就无 `$DISPLAY`）。无需手动填 `chromePath`。
- **Cookie 落盘路径**：macOS（与 Linux）用 `Default/Cookies`；**不是** Windows Chrome 127+ 的 `Default/Network/Cookies`。
- **Cookie 不落盘诊断（macOS 27 + Chrome 156+，issue #93）**：若 `bcdp_auth_flush` 报告的 cookie jar 非空但 `Default/Cookies` 未变，可临时用 mock keychain 对照：设环境变量 `EGO_LINUX_USE_MOCK_KEYCHAIN=1`，或在设置页 `chromeArgs` 填 `--use-mock-keychain`，然后冷启动浏览器重测。**默认关闭**——它会降低静态加密强度，仅用于诊断。
- **登录导入**：`bcdp_login_import` 在 macOS 从 `~/Library/Application Support/{Google/Chrome,Chromium,Microsoft Edge,BraveSoftware/Brave-Browser}` 定位源 profile。
```

</details>

**依据 5 · 源码核查**：[src/worker/cdp-cast-worker.ts:517-528](https://github.com/drscrewdriver/dsh-browser-cdp/blob/0f93d7bfa9ec760a4a0045993a3bda7e8de2f808/src/worker/cdp-cast-worker.ts#L517-L528)

失败或旧目标有可观察拒绝。

<details>
<summary>查看原文（12行）</summary>

```text
      if (req.method === 'POST' && url.pathname === '/api/input') {
        const body = await readJson(req)
        if (!active) return sendJson(res, 409, { ok: false, code: 'browser-disconnected', error: 'no live browser' })
        if (!body.targetId) return sendJson(res, 400, { ok: false, code: 'target-required', error: 'targetId required' })
        const targets = await listTargets()
        if (!targets.some((target) => target.targetId === body.targetId)) {
          return sendJson(res, 409, { ok: false, code: 'capture-target-stale', error: 'target is no longer available' })
        }
        try {
          return sendJson(res, 200, await active.sessions.sendInput(body.targetId as string, body))
        } catch (error) {
          return sendJson(res, 503, { ok: false, code: 'input-dispatch-failed', error: (error as Error).message || String(error) })
```

</details>

#### 缺口

- 无同任务时延、资源或退出清理数据
  **影响**：观察价值可提出，兼容、安全与实际成本不能外推
  **进一步探讨**：用空白浏览 profile 对照手工和插件完成公开流程的目标、错误和复位步骤

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
