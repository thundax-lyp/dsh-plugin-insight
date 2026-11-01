# DSH Ego Browser

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[50d3d87](https://github.com/Fisfzy/dsh-ego-browser/tree/50d3d8782521904af12157a0399bf563a8130299)

<!-- BEGIN META -->
[![GitHub ★ 361](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=361&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fisfzy/dsh-ego-browser) [![npm 30d 14,386](https://img.shields.io/static/v1?label=npm+30d&message=14%2C386&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser)
<!-- END META -->

> **功能**：为 DSH 提供浏览器操作、会话空间和实时观察入口。

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 将浏览器动作及分类重试接入 DSH；是否避免重复仍需核查，页面和浏览器不属插件原创。

> **主要限制**：[Q02](#research-q02) 空间 ID 截取可能碰撞；[Q03](#research-q03) 冷启动签名可触发回退，其确实无副作用未独立证明。

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
  - [Q01 · 谁需要浏览器工具，相对人工浏览有什么变化？](#detail-section-11)
  - [Q02 · 会话空间如何关联工具，是否绝对隔离？](#detail-section-12)
  - [Q03 · 操作重试和 HTTP 入口有什么边界？](#detail-section-13)
  - [Q04 · 使用与退出需要承担什么？](#detail-section-14)
  - [Q05 · 如何验证空间隔离和外部操作状态？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要 Agent 操作网页且愿意监督和核对外部结果的用户。

人工浏览及其他自动化已能完成网页任务；插件集中宿主调用和观看，但引入登录与外部状态管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 网页操作 | Agent 控制浏览器 | 外部作用需授权 |
| 会话空间 | 分配 tab 和 cursor | 截断名称可能碰撞 |
| resident | 复用进程 | 冷启动分类结果仍可回退，副作用未知 |
| 观察 | 用户监督与接管 | 画面不证明任务成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 和浏览器 runtime | 必需 | 工具与页面操作 | 无法调用 |
| 授权站点和独立 profile | 必需 | 限定访问数据 | 停止操作 |
| 人工监督 | 外部操作需要 | 判断目标和结果 | 不提交 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选隔离站点与 profile | 确认授权 |
| 操作 | Agent 调用只读工具 | 检查会话空间 |
| 监督 | 用户观察页面及后置条件 | 未确认不提交 |
| 失败 | 核查站点状态 | 不盲重放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 浏览器和宿主 | 配置 profile | 未运行 |
| 持续 | 浏览器与录屏资源 | 监督及登录 | 净效率未知 |
| 失败 | 可能产生网站作用 | 核对后置条件 | 重试风险 |
| 退出 | profile 数据 | 停止进程并核查 cookie | 不能撤销网站动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 网页工具 | 注册与执行入口 | 真实任务成功率 |
| 会话空间 | 按前缀分配 | 无碰撞隔离 |
| resident | 传输异常与冷启动分类分别处理 | 网站恰好执行一次 |

> **思考**：[Q02](#research-q02) 空间 ID 截取可能碰撞；[Q03](#research-q03) 冷启动签名可触发回退，其确实无副作用未独立证明。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 将浏览器动作及分类重试接入 DSH；是否避免重复仍需核查，页面和浏览器不属插件原创。

[Q02](#research-q02) 空间名使用清洗后的8字符前缀；[Q03](#research-q03) 冷启动错误文本触发一次性回退，未证明其无副作用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 空间 ID 截取可能碰撞；[Q03](#research-q03) 冷启动签名可触发回退，其确实无副作用未独立证明。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从隔离只读操作开始，外部状态不明时人工核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定源码的空间、resident 和 gateway；未运行 DSH 或浏览器。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src/index.ts、src/resident.ts、src/gateway.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态检查代表工具注册、会话空间、resident 和 gateway；已核查冷启动分类回退例外，未运行浏览器或网络。
- 下一步：模拟同前缀会话、未发送和已发送后各种冷启动签名，在受控站点核查提交、数据隔离及是否重复执行。

**分析版本**

- **仓库**：[Fisfzy/dsh-ego-browser](https://github.com/Fisfzy/dsh-ego-browser)
- **版本号**：0.9.7（[固定提交 50d3d87](https://github.com/Fisfzy/dsh-ego-browser/tree/50d3d8782521904af12157a0399bf563a8130299)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 以完整会话随机映射和结果未知状态试验隔离及重复提交，尚未验证。

模拟同前缀会话、未发送和已发送后各种冷启动签名，在受控站点核查提交、数据隔离及是否重复执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 18 | 12071 | 8779 | 2932 | — |
| .md | source | 21 | 3230 | — | — | 47563 |
| .js | source | 9 | 11586 | 10898 | 734 | — |
| .ts | source | 39 | 14096 | 11775 | 1867 | — |
| .ts | test | 47 | 5068 | 4315 | 337 | — |
| .cjs | example | 1 | 32 | 24 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Fisfzy/dsh-ego-browser/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=13&color=737b86&logo=github)](https://github.com/Fisfzy/dsh-ego-browser/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/Fisfzy/dsh-ego-browser/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查浏览器工具、会话空间和操作重试边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要浏览器工具，相对人工浏览有什么变化？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望 Agent 操作网页并可观察或接管的 DSH 用户。人工浏览和其他浏览器自动化已能完成网页任务；本插件把浏览器动作、会话空间及实时观察接入宿主，减少上下文搬运，但不创造浏览器能力或证明页面动作正确。观看到页面不等于用户目标或外部提交已成功，仍需检查后置条件。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-15](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/package.json#L1-L15)

插件身份与入口。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "dsh-ego-browser",
  "version": "0.9.7",
  "description": "ego-browser (ego-lite) integration plugin for DSH: structured browser-automation tools (34 ego_*) that drive the vendored ego runtime through ctx.subprocess, plus a realtime watch panel (live SSE screencast + direct mouse interaction + download capture + human-verification notice). Web shell: native right sidebar tab (dsh-better-sidebar fallback; no floating panel). TUI hosts (optional services): settings page, activity status bar, text-only side panel. Login import: Chrome extension bridge (modern Chrome/Edge) or non-destructive profile copy. Headless hosts: tools-only. [0.1.2-rc.1: verified compatible with DSH v0.1.2-rc.1 and v0.1.3-alpha.1]",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./dsh-plugin.json": "./dsh-plugin.json",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/",
    "bin/",
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1393-1408](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L1393-L1408)

宿主 apply。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx: EgoContext, config: RawConfig = {}): void {
  // Install the settings bridge first: the live config source (composition
  // entry + user-layer overrides) feeds `chromePath` + cast settings into cfg
  // via getters so every spawn reads the latest value without re-registration.
  const settingKeys = [
    'chromePath', 'captureBackend', 'streamProfile', 'cdpFps', 'cdpQuality',
    'cdpMaxWidth', 'cdpBackstopIntervalMs', 'ffmpegFps', 'ffmpegMaxWidth', 'ffmpegBitrateKbps',
    'ffmpegEncoder', 'ffmpegPath', 'githubMirror', 'egoCliArgs', 'chromeArgs',
    'castFpsCap', 'screencastQuality', 'screencastMaxWidth', 'backstopIntervalMs',
    'idleTimeoutMin',
    'disableFrameRelay',
    'tuiAutoOpenPanel',
    'residentExecutor',
    'residentIdleMin',
  ]
  const entry = Object.fromEntries(settingKeys.filter((key) => config[key] !== undefined).map((key) => [key, config[key]]))
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1500-1518](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L1500-L1518)

工具注册。

<details>
<summary>查看原文（19行）</summary>

```text
      return value
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      browserState.finishTool(token, { ok: false, error: message })
      throw error
    }
  }
  const reg = (tool: ToolHandle): void => {
    // These standalone tools do not take the shared browser lock.
    if (['ego_cli', 'ego_script', 'ego_help', 'ego_doctor'].includes(tool.name)) {
      const execute = tool.execute
      tool.execute = (args, exec) => observeEgoTool(cfg, tool.name, args as Record<string, unknown>, () => execute(args, exec))
    }
    const dispose = ctx.tools.register(tool) as unknown as () => void
    // Cordis lifecycle: unregister the tool when the plugin unmounts.
    ctx.effect?.(() => dispose)
  }
  registerEgoStatus(ctx, cfg, reg)
  registerAuthFlush(ctx, cfg, reg)
```

</details>

#### 缺口

- 未执行真实浏览器任务
  **影响**：无法证明结果、速度和兼容
  **进一步探讨**：在受控测试站点比较人工与插件的正确率及耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话空间如何关联工具，是否绝对隔离？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

源码为每个会话维护 tracker，默认空间名称由 session ID 清洗后截取前 8 字符并加 base；若两个不同 ID 清洗后前缀相同，则名称可能相同，因而不能将其称为严格无碰撞的安全隔离。没有 session ID 或关闭 scoped 设置时回退 base；显式共享空间也可能共享页面。该条件是静态推导，未复现冲突，也不代表已发生跨会话泄露。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:181-190](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L181-L190)

当前调用会话标识。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * The session whose tool call is currently being prepared. Set for the whole
 * `execute` of a tool (buildScript runs synchronously inside it), so the space
 * tracker can answer "what is THIS session's default space?" without threading
 * a parameter through 30 buildScript closures.
 */
let pendingSessionId: string | undefined

/** The session id a tool call belongs to (undefined for host-initiated runs). */
export function currentSessionId(): string | undefined {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:194-214](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L194-L214)

清洗截断 ID 和默认空间。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * Per-session default space name.
 *
 * Two DSH sessions (or two subagents) that both omit `space` used to share one
 * task space — and therefore one tab set and one cursor — so they stole each
 * other's pages. With session-scoped spaces each session gets its own space
 * (`dsh-agent-<sid8>`), hence its own browser context and window.
 */
export function spaceNameForSession(
  sessionId: string | undefined,
  baseDefault: string | number,
  scoped: boolean,
): string | number {
  if (!scoped || sessionId === undefined || sessionId === '') return baseDefault
  const short = String(sessionId)
    .replace(/^session-/, '')
    .replace(/[^A-Za-z0-9_-]/g, '')
    .slice(0, 8)
  if (short === '') return baseDefault
  return `${String(baseDefault)}-${short}`
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:216-240](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L216-L240)

会话 cursor 与 tracker。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * Cursor key for the tab tracker. The session is part of the key so two
 * sessions sharing one space (session scoping off) still keep their own tab.
 */
export function scopedTargetKey(sessionId: string | undefined, space: string | number): string {
  return `${sessionId ?? ''}\u0000${String(space)}`
}

export interface SessionScopedSpaceTracker extends ActiveSpaceTracker {
  forSession(sessionId: string | undefined): ActiveSpaceTracker
}

/**
 * A space tracker per DSH session, lazily created.
 *
 * `isScoped` is a live getter: the setting can be flipped without rebuilding
 * the tracker map, and existing sessions keep the space they already selected.
 */
export function createSessionScopedSpaceTracker(
  baseDefault: string | number = DEFAULT_SPACE,
  isScoped: () => boolean = () => true,
): SessionScopedSpaceTracker {
  const bySession = new Map<string, ActiveSpaceTracker>()
  const trackerFor = (sessionId: string | undefined): ActiveSpaceTracker => {
    const key = sessionId ?? ''
```

</details>

#### 缺口

- 未运行并发会话和同前缀情况
  **影响**：无法判断宿主 ID 实际冲突概率及影响
  **进一步探讨**：用模拟同前缀 ID 和真实隔离会话核对空间及 tab。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 操作重试和 HTTP 入口有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

resident 抛出 ResidentNotRunningError 时，调用方按未写入处理并回退一次性进程；已写入后抛出其他失败或超时则返回错误而不走该回退。但成功收到 resident frame 且 result.ok=false 时，若错误文本匹配冷启动签名（CDP 未开、DevTools 端口/超时、连接失败、浏览器未就绪、target closed/not found/detached/crashed、ECONNREFUSED），调用方停止 resident 后仍走一次性路径。代码注释判断这类故障未到浏览器，但文本分类本身不是对每个请求无副作用的独立证明。gateway 仅在 Origin 存在时比较 host；不是完整鉴权。网站提交不能因超时视为未发生。

#### 证据与依据

**依据 1 · 源码核查**：[src/resident.ts:13-20](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/resident.ts#L13-L20)

未写入与已写入后失败区分。

```text
 * Two failure rules matter:
 *
 *  - A request that was never written (process already dead) throws
 *    `ResidentNotRunningError`; the caller MAY retry it through the one-shot
 *    path, because nothing ran.
 *  - A request that was written and then failed/timeout is NOT retryable: the
 *    script may have half-executed, and replaying a click would double-fire it.
 *    The process is killed instead — a wedged resident is worse than none.
```

**依据 2 · 源码核查**：[src/index.ts:903-925](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L903-L925)

resident 真实调用和 signal。

<details>
<summary>查看原文（23行）</summary>

```text

async function runEgoScript(subprocess: SubprocessService, script: string, exec: ExecLike, cfg: EgoRuntimeConfig, graceOverrideMs?: number): Promise<WarmupResult> {
  // #87: egoBin is executed as `node <egoBin>`; fail before spawning when it
  // points at a Windows executable (e.g. the official ego-browser.exe).
  const egoBinCheck = validateEgoBinPath(cfg.egoBin)
  if (!egoBinCheck.ok) return { ok: false, error: `egoBin is not usable: ${egoBinCheck.reason}`, stdout: '', stderr: '' }
  // Resident path (opt-in, issue #56). Only a request that was never written
  // falls back to the one-shot spawn below: once written, a retry could
  // double-execute a click/fill, so the resident reports the failure instead.
  if (cfg.residentExecutor && Date.now() >= residentCooldownUntil) {
    let transport: ResidentProcess | null = null
    try {
      transport = ensureResidentTransport(cfg)
    } catch {
      transport = null // spawn failed; the one-shot path below reports it
    }
    if (transport !== null) {
      try {
        const frame = await transport.run(script, {
          ...(exec.signal !== undefined ? { signal: exec.signal } : {}),
          ...(Number.isFinite(graceOverrideMs) && graceOverrideMs! > 0 ? { graceMs: graceOverrideMs! } : {}),
        })
        const result = residentFrameToResult(frame)
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:84-109](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/gateway.ts#L84-L109)

方法、Origin 与 JSON 检查。

<details>
<summary>查看原文（26行）</summary>

```text
    return webServer.register({
      kind: 'prefix',
      path: API_PREFIX,
      handler: async (reqRaw: unknown, resRaw: unknown) => {
        const req = reqRaw as IncomingMessage
        const res = resRaw as ServerResponse
        if (req.method !== 'POST') {
          writeJson(res, 405, envelopeError('method-not-allowed', 'POST only'))
          return
        }
        const origin = req.headers.origin
        if (origin) {
          let originHost: string
          try {
            originHost = new URL(origin).host
          } catch {
            writeJson(res, 400, envelopeError('invalid-origin', 'invalid Origin header'))
            return
          }
          if (!req.headers.host || originHost !== req.headers.host) {
            writeJson(res, 403, envelopeError('origin-not-allowed', 'same-origin requests only'))
            return
          }
        }
        if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
          writeJson(res, 415, envelopeError('content-type-not-supported', 'application/json required'))
```

</details>

**依据 4 · 源码核查**：[src/index.ts:558-577](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L558-L577)

冷启动错误文本匹配列表。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Error signatures that indicate a TRANSIENT browser cold-start / channel
 * not-yet-ready problem rather than a real defect. The ego-lite host is a
 * single persistent Chromium that cold-starts on the first tool call of a
 * session; a probe that arrives while the DevTools/CDP channel is still
 * coming up can fail with one of these. Such failures are safe to retry
 * briefly (the browser keeps warming up in the background). Anything else
 * must pass through immediately — never mask a genuine error.
 */
const COLD_START_SIGNS = [
  /CDP channel is not open/i,
  /DevTools.*(port|timeout|active)/i,
  /could not connect to/i,
  /browser (was |is )?not (reachable|running|ready)/i,
  /target.*(closed|not found|detached|crashed)/i,
  /ECONNREFUSED/i,
]
/** @internal exported for tests (also the contract the resident error relies on) */
export function isColdStartError(message: string): boolean {
  return COLD_START_SIGNS.some((re) => re.test(message))
```

</details>

**依据 5 · 源码核查**：[src/index.ts:920-958](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L920-L958)

resident frame 的冷启动分类及未运行错误进入一次性回退，其他异常返回。

<details>
<summary>查看原文（39行）</summary>

```text
      try {
        const frame = await transport.run(script, {
          ...(exec.signal !== undefined ? { signal: exec.signal } : {}),
          ...(Number.isFinite(graceOverrideMs) && graceOverrideMs! > 0 ? { graceMs: graceOverrideMs! } : {}),
        })
        const result = residentFrameToResult(frame)
        if (result.ok) {
          residentConsecutiveFailures = 0
          residentParkReason = null
          return result
        }
        if (!isColdStartError(result.error ?? '')) return result
        // Cold-start failure: the script never reached the browser (dead CDP
        // channel, or a relaunch that has not settled). Safe to retry — park
        // the resident and let the one-shot path below (with its launch
        // retries) run this call. Three consecutive failures park it for good
        // (until the setting is toggled or the plugin restarts), so we stop
        // alternating park -> one-shot -> respawn (issue #73).
        const supervision = superviseResidentFailure(residentConsecutiveFailures, result.error ?? 'cold start')
        residentConsecutiveFailures = supervision.failures
        residentLastRebuildReason = `cold-start failure: ${result.error ?? 'unknown'}`
        if (supervision.parkReason !== null) {
          residentParkReason = supervision.parkReason
          residentCooldownUntil = Number.MAX_SAFE_INTEGER
        } else {
          residentCooldownUntil = Date.now() + 10_000
        }
        stopResidentTransport()
      } catch (err) {
        if (!(err instanceof ResidentNotRunningError)) {
          return {
            ok: false,
            error: err instanceof Error ? err.message : String(err),
            stdout: '',
            stderr: '',
          }
        }
        // not written → retry through the one-shot path
      }
```

</details>

#### 缺口

- 未测试冷启动签名是否总在页面动作前产生，也未运行站点及宿主鉴权
  **影响**：不能证明分类回退不重复提交或端点全面安全
  **进一步探讨**：受控站点对每类错误注入并核查请求是否产生外部作用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用与退出需要承担什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、浏览器 runtime、可访问站点和用户授权；持久登录会扩大可访问的数据范围，工具或录屏还需本机资源。首次配置与登录、持续监督和 CAPTCHA/2FA 人工接管、失败后核对页面状态均有成本；应在隔离测试站点开始，涉及提交前明确用户授权。退出时分别停止工具、关闭浏览器并按用户需要处理 profile/cookie，不能假定插件卸载会撤销网站操作。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:294-294](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/README.md#L294-L294)

作者说明浏览器全局、观看与接管。

```text
`tuiPanels` adds the **◎ Agent Browser** panel, using the host's React and UI components. The browser is global across sessions. The panel shows running/headless state, the active page, real task-space groups joined by persisted target ids, verification warnings and recent action results. Missing membership metadata falls back to an explicitly labeled global group; unassigned tabs remain visible. With focus, use `↑/↓` to select a tab, `o` to open the existing browser takeover window, `x` to close the selected tab, `f` to flush cookies, and `r` to refresh. `tuiDialogs` provides close confirmation when present; otherwise press `x` twice consecutively. The first browser-tool call adds a badge without opening the panel unless auto-open is explicitly enabled.
```

**依据 2 · 源码核查**：[README.md:313-313](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/README.md#L313-L313)

作者列出登录和人工等待工具。

```text
| 会话/安全 | `ego_auth_flush`（登录落盘） `ego_login_import`（登录态导入：`source=extension` 扩展桥接，或 `chrome/edge/brave` 安全复制） `ego_captcha` `ego_dialog` `ego_wait_for_human`（CAPTCHA/登录/2FA 阻塞等待） |
```

**依据 3 · 源码核查**：[src/resident.ts:13-20](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/resident.ts#L13-L20)

已写入操作不可安全重放。

```text
 * Two failure rules matter:
 *
 *  - A request that was never written (process already dead) throws
 *    `ResidentNotRunningError`; the caller MAY retry it through the one-shot
 *    path, because nothing ran.
 *  - A request that was written and then failed/timeout is NOT retryable: the
 *    script may have half-executed, and replaying a click would double-fire it.
 *    The process is killed instead — a wedged resident is worse than none.
```

#### 缺口

- 未测实际登录、录屏、清理或费用
  **影响**：无法保证 profile 已清除或操作撤销
  **进一步探讨**：测试独立 profile，核查关闭后的进程、存储和站点记录。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证空间隔离和外部操作状态？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有 session tracker、传输异常时不重放已写入请求，以及依错误文本分类的冷启动回退；因后者仍会回退，不能把 resident 头注释当成全部路径。未验证方案是以完整会话身份建立随机空间映射，为写操作记录发送与目标后置状态，并要求冷启动分类也核对实际站点状态后才由用户决定重试。用同前缀会话和各冷启动签名故障，对照跨会话混用、重复提交、误拒和延迟；若无改善或识别误差过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:194-221](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L194-L221)

当前名称及 cursor 生成。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Per-session default space name.
 *
 * Two DSH sessions (or two subagents) that both omit `space` used to share one
 * task space — and therefore one tab set and one cursor — so they stole each
 * other's pages. With session-scoped spaces each session gets its own space
 * (`dsh-agent-<sid8>`), hence its own browser context and window.
 */
export function spaceNameForSession(
  sessionId: string | undefined,
  baseDefault: string | number,
  scoped: boolean,
): string | number {
  if (!scoped || sessionId === undefined || sessionId === '') return baseDefault
  const short = String(sessionId)
    .replace(/^session-/, '')
    .replace(/[^A-Za-z0-9_-]/g, '')
    .slice(0, 8)
  if (short === '') return baseDefault
  return `${String(baseDefault)}-${short}`
}

/**
 * Cursor key for the tab tracker. The session is part of the key so two
 * sessions sharing one space (session scoping off) still keep their own tab.
 */
export function scopedTargetKey(sessionId: string | undefined, space: string | number): string {
  return `${sessionId ?? ''}\u0000${String(space)}`
```

</details>

**依据 2 · 源码核查**：[src/resident.ts:13-20](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/resident.ts#L13-L20)

当前已写入禁止重放。

```text
 * Two failure rules matter:
 *
 *  - A request that was never written (process already dead) throws
 *    `ResidentNotRunningError`; the caller MAY retry it through the one-shot
 *    path, because nothing ran.
 *  - A request that was written and then failed/timeout is NOT retryable: the
 *    script may have half-executed, and replaying a click would double-fire it.
 *    The process is killed instead — a wedged resident is worse than none.
```

**依据 3 · 源码核查**：[src/index.ts:920-958](https://github.com/Fisfzy/dsh-ego-browser/blob/50d3d8782521904af12157a0399bf563a8130299/src/index.ts#L920-L958)

冷启动结果另有一次性回退，不能只看 resident 注释。

<details>
<summary>查看原文（39行）</summary>

```text
      try {
        const frame = await transport.run(script, {
          ...(exec.signal !== undefined ? { signal: exec.signal } : {}),
          ...(Number.isFinite(graceOverrideMs) && graceOverrideMs! > 0 ? { graceMs: graceOverrideMs! } : {}),
        })
        const result = residentFrameToResult(frame)
        if (result.ok) {
          residentConsecutiveFailures = 0
          residentParkReason = null
          return result
        }
        if (!isColdStartError(result.error ?? '')) return result
        // Cold-start failure: the script never reached the browser (dead CDP
        // channel, or a relaunch that has not settled). Safe to retry — park
        // the resident and let the one-shot path below (with its launch
        // retries) run this call. Three consecutive failures park it for good
        // (until the setting is toggled or the plugin restarts), so we stop
        // alternating park -> one-shot -> respawn (issue #73).
        const supervision = superviseResidentFailure(residentConsecutiveFailures, result.error ?? 'cold start')
        residentConsecutiveFailures = supervision.failures
        residentLastRebuildReason = `cold-start failure: ${result.error ?? 'unknown'}`
        if (supervision.parkReason !== null) {
          residentParkReason = supervision.parkReason
          residentCooldownUntil = Number.MAX_SAFE_INTEGER
        } else {
          residentCooldownUntil = Date.now() + 10_000
        }
        stopResidentTransport()
      } catch (err) {
        if (!(err instanceof ResidentNotRunningError)) {
          return {
            ok: false,
            error: err instanceof Error ? err.message : String(err),
            stdout: '',
            stderr: '',
          }
        }
        // not written → retry through the one-shot path
      }
```

</details>

#### 缺口

- 方案未实现且未测冲突
  **影响**：不能声称已修复或保证网页幂等
  **进一步探讨**：在可丢弃站点模拟同前缀并对照提交次数。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
