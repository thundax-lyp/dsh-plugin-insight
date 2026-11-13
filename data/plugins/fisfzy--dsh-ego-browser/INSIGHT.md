# dsh-ego-browser

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[52a4a44](https://github.com/Fisfzy/dsh-ego-browser/tree/52a4a449b31d43cbe7a0235c520523a7a86f46b6)

<!-- BEGIN META -->
[![GitHub ★ 493](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=493&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fisfzy/dsh-ego-browser) [![npm 30d 31,344](https://img.shields.io/static/v1?label=npm+30d&message=31%2C344&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中驱动浏览器、观察网页并接收截图。

> **亮点**：[Q01](#research-q01) 同一工具可将截图接入宿主附件，并为 touch-first 页面提供同点触摸。浏览器能力仍由运行时提供。

> **主要限制**：[Q02](#research-q02) 空间短名前缀存在碰撞条件，错误类型及回退只提供线索，仍需看真实页面与副作用。

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
  - [Q01 · 图片观察和触摸如何接入会话？](#detail-section-11)
  - [Q02 · 空间和错误报告能否证明安全重试？](#detail-section-12)
  - [Q03 · 哪些最小测试能判断视觉链路是否值得使用？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要模型操作可视页面的用户，希望在 DSH 内观察 Canvas 或布局并确认动作结果。

人工在浏览器观察和点击，再将截图与结果转回会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 截图 | 观察可视页面 | 附件缺失退路径 |
| 触摸 | 操作 touch-first 页面 | 同点按下抬起 |
| 错误提示 | 指导观察和再试 | 需核真实副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Chromium | 必需 | 执行浏览器工具 | 回原浏览器 |
| 附件和可视模型 | 内联需要 | 模型接图 | 使用路径或人工观察 |
| 隔离浏览器和非敏感页面 | 试用条件 | 限定副作用 | 停止操作 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 用户 | 建立可计数测试页 | 不接真实账号 |
| 操作 | 用户与模型 | 先观察，再触摸 | 失败先核页面 |
| 退出 | 用户 | 关闭测试进程并清理图片 | 回原浏览器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览器和宿主 | 隔离 profile | 兼容未验 |
| 持续 | 截图、模型与进程资源 | 核目标和页面 | 总成本未测 |
| 恢复 | 可能已执行的网页动作 | 核后置条件 | 先观察 |
| 退出 | 残留截图 | 清理测试 profile | 站点副作用需独立处置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 截图 | 附件及降级 | 模型真实接图 |
| 网页动作 | 脚本和错误回执 | 实际动作次数 |
| 空间 | 前缀派生 | 同宿主严格隔离 |

> **思考**：[Q02](#research-q02) 空间短名前缀存在碰撞条件，错误类型及回退只提供线索，仍需看真实页面与副作用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 同一工具可将截图接入宿主附件，并为 touch-first 页面提供同点触摸。浏览器能力仍由运行时提供。

[Q01](#research-q01) 附件失败保留截图成功，[Q02](#research-q02) 错误分级需由页面核实补足。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 空间短名前缀存在碰撞条件，错误类型及回退只提供线索，仍需看真实页面与副作用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在本地测试页做非敏感试用，核视觉和目标标签，外部真实操作继续人工。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认截图内联、触摸、会话空间和回退。真实模型接图及网页副作用待验。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.md、src/errors.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读截图、触摸、空间派生和 resident，未审计浏览器隐私与所有跨域动作，未运行目标。
- 下一步：本地样例核附件缺失、错误后计数及触摸结果，再与人工路径比较。

**分析版本**

- **仓库**：[Fisfzy/dsh-ego-browser](https://github.com/Fisfzy/dsh-ego-browser)
- **版本号**：0.9.14（[固定提交 52a4a44](https://github.com/Fisfzy/dsh-ego-browser/tree/52a4a449b31d43cbe7a0235c520523a7a86f46b6)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 测试失败后显式提醒页面状态未知，是否能比已有 actionSent 减少误重试。

本地样例核附件缺失、错误后计数及触摸结果，再与人工路径比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 19 | 12481 | 9111 | 2989 | — |
| .md | source | 21 | 3395 | — | — | 52405 |
| .js | source | 9 | 12681 | 11824 | 912 | — |
| .ts | source | 42 | 15581 | 12910 | 2159 | — |
| .ts | test | 59 | 6206 | 5289 | 396 | — |
| .cjs | example | 1 | 32 | 24 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/Fisfzy/dsh-ego-browser/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=24&color=737b86&logo=github)](https://github.com/Fisfzy/dsh-ego-browser/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/Fisfzy/dsh-ego-browser/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 执行需要视觉判断的网页动作时，哪些证据能确认目标、实际副作用及故障后的下一步？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 图片观察和触摸如何接入会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要确认 Canvas 或布局的网页操作，原本要拿截图路径再读图或由人接管。ego_screenshot 由实际页面或元素截图得到路径，transformValue 读 PNG 并调用宿主附件存储。附件缺失、保存失败或 inline:false 时仍有路径，有附件时渲染图像块。宿主能否再将其送到可视模型有独立条件。触摸模式取目标点，发 touchStart、按需等最多五秒并发 touchEnd，没有发送移动事件。调用成功仍需另观测页面变化。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2880-2894](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/index.ts#L2880-L2894)

实际截图与 transform 接线。

<details>
<summary>查看原文（15行）</summary>

```text
        const shotOpts = options.length > 0 ? `{ ${options.join(', ')} }` : ''
        const shot =
          sel !== ''
            ? `await page.locator(${j(sel)}).screenshot(${shotOpts})`
            : `await page.screenshot(${shotOpts})`
        return (
          `${useSpace(str(args.space, cfg.defaultSpace))}${ensureRealTab()}` +
          `${hideCursor ? `try { if (ego && ego.hideCursor) await ego.hideCursor() } catch {}\nawait new Promise(r => setTimeout(r, 60))\n` : ''}` +
          `let path\n` +
          `try { path = ${shot} } finally { ${hideCursor ? `try { if (ego && ego.showCursor) await ego.showCursor() } catch {}` : ''} }\n` +
          `console.log('${SENTINEL}' + JSON.stringify({ ok: true, path, fullPage: ${fullPage} }))\n`
        )
      },
      transformValue: (args, value) => attachScreenshot(ctx, args, value),
      render: renderScreenshot,
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1665-1710](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/index.ts#L1665-L1710)

附件内联、降级及模型可见呈现。

<details>
<summary>查看原文（46行）</summary>

```text
 * Model-visible renderer for `ego_screenshot`: an inline image block when the
 * host saved the PNG as an attachment, otherwise the normal text/JSON render.
 * Pure: it only reads the canonical value.
 */
export function renderScreenshot(args: Record<string, unknown>, value: unknown): unknown[] {
  const v = value as
    | { ok?: unknown; path?: unknown; attachment?: ImageAttachmentRefLike }
    | null
  if (v !== null && v.ok === true && v.attachment !== undefined) {
    return [
      { type: 'image', attachment: v.attachment },
      { type: 'text', text: `screenshot saved: ${typeof v.path === 'string' ? v.path : ''}` },
    ]
  }
  return renderEgoToolText(args, value)
}

/**
 * Save a screenshot PNG through the host attachment service so the renderer can
 * return an image block. Feature-detected: without an attachment service (TUI /
 * headless / older host) the value keeps only the path, exactly as before.
 */
export async function attachScreenshot(
  ctx: EgoContext,
  args: Record<string, unknown>,
  value: unknown,
): Promise<unknown> {
  const v = value as { ok?: unknown; path?: unknown } | null
  if (v === null || v.ok !== true || typeof v.path !== 'string' || v.path === '') return value
  if (args.inline === false) return value
  const store = (() => {
    if (attachmentsStore !== undefined) return attachmentsStore
    try {
      return ctx.get?.('attachments') as AttachmentStoreLike | undefined
    } catch {
      return undefined
    }
  })()
  if (store === null || typeof store?.saveImage !== 'function') return value
  try {
    const data = await readFile(v.path)
    const attachment = await store.saveImage({ data, mediaType: 'image/png' })
    return { ...v, attachment }
  } catch (error) {
    // Inline is a convenience, never a reason for the screenshot to fail.
    return { ...v, inlineError: error instanceof Error ? error.message : String(error) }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1554-1582](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/index.ts#L1554-L1582)

holdMs 校验、触摸按下和抬起。

<details>
<summary>查看原文（29行）</summary>

```text
  const dbl = opts.double === true
  const touch = opts.touch === true
  const holdMs = opts.holdMs ?? 0
  if (typeof holdMs !== 'number' || !Number.isFinite(holdMs) || holdMs < 0 || holdMs > 5000) {
    throw new Error('ego_click: holdMs must be a number between 0 and 5000')
  }
  const taps = dbl ? 2 : 1
  const point =
    sel !== ''
      ? `await page.elementCenter(${j(sel)})`
      : `{ x: ${x}, y: ${y} }`
  const betweenTaps = taps > 1 ? `  await new Promise(r => setTimeout(r, 120))\n` : ''
  const pageInfo =
    `const pginfo = await page.info()\n` +
    `console.log('${SENTINEL}' + JSON.stringify({ ok: true, double: ${dbl}, touch: ${touch}, holdMs: ${holdMs}, page: pginfo }))\n`

  if (touch) {
    const hold = holdMs > 0 ? `  await new Promise(r => setTimeout(r, ${holdMs}))\n` : ''
    return (
      `${useSpace(opts.space)}${ensureRealTab()}` +
      `const __p = ${point}\n` +
      `for (let __i = 0; __i < ${taps}; __i++) {\n` +
      `  await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: __p.x, y: __p.y }] })\n` +
      hold +
      `  await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })\n` +
      betweenTaps +
      `}\n` +
      pageInfo
    )
```

</details>

**依据 4 · 作者声明**：[CHANGELOG.md:5-18](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/CHANGELOG.md#L5-L18)

作者说明开发候选、Canvas 和遮蔽体验。

<details>
<summary>查看原文（14行）</summary>

```text
## [0.9.14] - 2026-11-10 — 视觉观测与触摸操作增强（DEV1 开发中，未发布）

### 新增
- **`ego_screenshot` 默认内联图片**：截图同时返回 `{ path, attachment }`，渲染为 image block，模型当轮即可看到画面，不再需要额外 `read_image`。依赖宿主 `ctx.attachments.saveImage()`；没有附件服务（TUI/无头/旧宿主）或保存失败时自动退回“仅路径”，不影响截图本身。新增 `inline:false` 可只保留路径。
- **`ego_click` 新增 `touch` / `holdMs`**：`touch:true` 发 touchStart/touchEnd（4399 等 touch-first H5 游戏）；`holdMs` 在同一坐标按下→等待→抬起。两种模式都不发送 move，因此不会拖动页面或滚动；默认鼠标路径完全不变，拖拽仍只属于 `ego_drag`。
- **Canvas / iframe 观测边界写入文档**：`ego_snapshot` 描述与 `ego_help discipline/screenshots` 明确——Canvas/WebGL/自定义绘制内容不在语义树中，必须用 `ego_screenshot`；跨域 iframe 内元素用 snapshot 的 `ref` 点击/填写，CSS selector 只搜索主文档。

### 验证
- 实机确认：4399 跨域 age iframe 内的 `#btn_login` 通过 `ref` 点击成功（弹出登录框），说明 iframe 交互无需新增 frame 工具。
- 单元测试新增：截图在附件服务可用时返回 image block、`inline:false` 与无附件服务时自动降级。

### 修复
- 首次实机测试发现直接访问 `ctx.attachments` 会被 Cordis 的 inject 保护拒绝（`cannot get property "attachments" without inject`）。改为 `ctx.inject(['attachments'], ...)` 捕获服务 + `ctx.get` 兜底；TUI/无头宿主仍自动退回“仅路径”。
- **安全：snapshot 不再回显密码框明文**。`input[type=password]` 的 `value` 统一输出 `••••••`，避免浏览器自动填充把真实密码写进语义树、模型上下文和会话日志；文本/普通输入仍正常显示。已用本地页面实机验证（`pwMasked=true`，无明文）。
```

</details>

#### 缺口

- 未测不同宿主及模型的附件接收
  **影响**：图片回执未必满足模型观察
  **进一步探讨**：在本地 Canvas 页核对实际请求和附件缺失降级

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 空间和错误报告能否证明安全重试？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

空间名以清洗后 session ID 前八字符派生，短名前缀可能碰撞，也可回默认空间。动作工具记当前目标，并在 stale-space 文本出现时重置后重构脚本。resident 正常错误不自动回退，未写入异常或判为冷启动的错误会转一次性路径，连续失败会停用 resident。分类器根据工具名和错误模式推断 actionSent，这一标记不来自目标站。可能已提交的网站状态要靠业务后置条件核对。作者关于语义树密码遮蔽的说明不能推及可视输出脱敏。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:234-245](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/index.ts#L234-L245)

空间名取短前缀。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/index.ts:725-737](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/index.ts#L725-L737)

过期空间与冷启动可导致重建。

<details>
<summary>查看原文（13行）</summary>

```text
export async function runWithStaleSpaceRetry(  ctx: EgoContext,
  cfg: EgoRuntimeConfig,
  exec: ExecLike,
  buildScript: () => string,
  graceOverrideMs?: number,
): Promise<WarmupResult> {
  let result = await withWarmupRetry(() => runEgoScript(ctx.subprocess, buildScript(), exec, cfg, graceOverrideMs))
  if (!result.ok && /task space not found: \d+/.test(result.error ?? '')) {
    cfg.spaceTracker.resetToName()
    result = await withWarmupRetry(() => runEgoScript(ctx.subprocess, buildScript(), exec, cfg, graceOverrideMs))
  }
  if (!result.ok && isColdStartError(result.error ?? '')) cfg.onColdStartFailure?.()
  return result
```

</details>

**依据 3 · 源码核查**：[src/index.ts:984-1028](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/index.ts#L984-L1028)

resident 分类、停用和异常回退。

<details>
<summary>查看原文（45行）</summary>

```text
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

**依据 4 · 源码核查**：[src/index.ts:1782-1819](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/index.ts#L1782-L1819)

脚本执行及失败转换。

<details>
<summary>查看原文（38行）</summary>

```text
        // cursor and afterExecute hooks all read pendingSessionId.
        const sessionId = callingSessionId(exec)
        pendingSessionId = sessionId
        try {
          // Signal the client to auto-open the sidebar Tab on the first ego_*
          // tool call. markEgoToolCall() bumps a host-side counter surfaced via
          // /api/ego/spaces; the LivePreviewController transitions on 0 → >0 and
          // calls betterSidebar.openTab(). Idempotent: the client's transition
          // guard means only the first call per session opens the Tab.
          markEgoToolCall(sessionId)
          // Stale-space recovery (browser restart wiped the space table) is
          // handled inside runWithStaleSpaceRetry; the cold-start retry is one
          // level deeper.
          // The tab pin and the viewport are applied around buildScript only,
          // because both belong to the page tool that is about to run: the pin
          // is this space's remembered target, and the viewport must be applied
          // AFTER ensureRealTab() has switched to a tab (cdp has no session
          // before that). The script reports back the target it actually used.
          const spaceKey = scopedTargetKey(sessionId, str(args.space, cfg.defaultSpace))
          const buildScript = () => {
            pendingTargetPin = cfg.targetTracker.get(spaceKey)
            pendingViewport = cfg
            try {
              return opts.buildScript(args)
            } finally {
              pendingTargetPin = undefined
              pendingViewport = undefined
            }
          }
          const result = await runWithStaleSpaceRetry(ctx, cfg, exec, buildScript)
          // Domain failure is a canonical value, not an exception: the renderer
          // shows code/actionSent/retry/hint so the model can recover instead of
          // blindly replaying a non-idempotent action.
          if (!result.ok) return failureValue(opts.name, result.error ?? 'ego-browser call failed')
          recordPinnedTarget(cfg.targetTracker, spaceKey, result.stdout)
          const value =
            typeof opts.transformValue === 'function'
              ? await opts.transformValue(args, result.value, { sessionId, spaceKey })
```

</details>

**依据 5 · 源码核查**：[src/errors.ts:110-146](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/errors.ts#L110-L146)

错误提示靠文本分类和工具名。

<details>
<summary>查看原文（37行）</summary>

```text
export function classifyEgoFailure(tool: string, error: string): EgoFailure {
  const message = error.trim()
  let code: EgoFailureCode = 'UNKNOWN'
  if (/user is controlling|user-owned|not assigned to an agent|ownership/i.test(message)) {
    code = 'USER_CONTROLLING'
  } else if (/task space not found/i.test(message)) {
    code = 'SPACE_STALE'
  } else if (
    /cdp channel is not open|could not connect|econnrefused|browser (was |is )?not (reachable|running|ready)|failed to spawn|cli could not be started|enoent/i.test(
      message,
    )
  ) {
    code = 'BROWSER_DOWN'
  } else if (/^(ego_[a-z_]+:\s*)?(provide|url is required|missing|requires|invalid|expected )/i.test(message)) {
    // Our own pre-action validation. Checked before the locator patterns
    // because such a message often names a selector/x-y pair and would
    // otherwise be misread as a missing element.
    code = 'INVALID_ARGS'
  } else if (/captcha|human verification|turnstile|recaptcha|hcaptcha/i.test(message)) {
    code = 'CAPTCHA'
  } else if (/native dialog|javascript dialog|dialog (is|was) (open|blocking)|blocked by a dialog/i.test(message)) {
    code = 'DIALOG_BLOCKING'
  } else if (/timed? ?out|timeout|deadline exceeded/i.test(message)) {
    code = 'TIMEOUT'
  } else if (
    /not found|no element|unable to find|strict mode violation|selector|locator|element (is )?not|no node/i.test(
      message,
    )
  ) {
    code = 'LOCATOR_NOT_FOUND'
  } else if (/net::err|navigation|frame was detached|goto /i.test(message)) {
    code = 'NAVIGATION_FAILED'
  } else if (/no .*json payload|no @@ego|finished but no/i.test(message)) {
    code = 'NO_PAYLOAD'
  }
  const actionSent = ACTION_TOOLS.has(tool) && !PRE_ACTION_CODES.has(code)
  return { code, actionSent, retry: RETRY[code], hint: HINTS[code] }
```

</details>

#### 缺口

- 相同前缀和执行后超时的实际副作用未知
  **影响**：不能保证网页动作恰好一次
  **进一步探讨**：用本地计数页模拟同前缀和操作后超时，核页面计数

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些最小测试能判断视觉链路是否值得使用？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

用独立浏览器和非敏感 Canvas 页测试观察及同点触摸。合格结果包括模型取到预期帧、动作只在预期标签发生且状态可复核。首次需准备宿主和 profile，持续需核截图范围和接管，异常需对账，不能只计节约的模型步骤。可试在失败后显示页面状态尚待观察，以本地实验对照已有 actionSent 和人工观察。若误重试率和人工核对耗时无改善则保留现状。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1687-1710](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/index.ts#L1687-L1710)

附件可选且可关闭。

<details>
<summary>查看原文（24行）</summary>

```text
export async function attachScreenshot(
  ctx: EgoContext,
  args: Record<string, unknown>,
  value: unknown,
): Promise<unknown> {
  const v = value as { ok?: unknown; path?: unknown } | null
  if (v === null || v.ok !== true || typeof v.path !== 'string' || v.path === '') return value
  if (args.inline === false) return value
  const store = (() => {
    if (attachmentsStore !== undefined) return attachmentsStore
    try {
      return ctx.get?.('attachments') as AttachmentStoreLike | undefined
    } catch {
      return undefined
    }
  })()
  if (store === null || typeof store?.saveImage !== 'function') return value
  try {
    const data = await readFile(v.path)
    const attachment = await store.saveImage({ data, mediaType: 'image/png' })
    return { ...v, attachment }
  } catch (error) {
    // Inline is a convenience, never a reason for the screenshot to fail.
    return { ...v, inlineError: error instanceof Error ? error.message : String(error) }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1811-1819](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/index.ts#L1811-L1819)

执行与转换的观测点。

```text
          const result = await runWithStaleSpaceRetry(ctx, cfg, exec, buildScript)
          // Domain failure is a canonical value, not an exception: the renderer
          // shows code/actionSent/retry/hint so the model can recover instead of
          // blindly replaying a non-idempotent action.
          if (!result.ok) return failureValue(opts.name, result.error ?? 'ego-browser call failed')
          recordPinnedTarget(cfg.targetTracker, spaceKey, result.stdout)
          const value =
            typeof opts.transformValue === 'function'
              ? await opts.transformValue(args, result.value, { sessionId, spaceKey })
```

**依据 3 · 源码核查**：[src/errors.ts:132-146](https://github.com/Fisfzy/dsh-ego-browser/blob/52a4a449b31d43cbe7a0235c520523a7a86f46b6/src/errors.ts#L132-L146)

现有提示提供对照。

<details>
<summary>查看原文（15行）</summary>

```text
  } else if (/timed? ?out|timeout|deadline exceeded/i.test(message)) {
    code = 'TIMEOUT'
  } else if (
    /not found|no element|unable to find|strict mode violation|selector|locator|element (is )?not|no node/i.test(
      message,
    )
  ) {
    code = 'LOCATOR_NOT_FOUND'
  } else if (/net::err|navigation|frame was detached|goto /i.test(message)) {
    code = 'NAVIGATION_FAILED'
  } else if (/no .*json payload|no @@ego|finished but no/i.test(message)) {
    code = 'NO_PAYLOAD'
  }
  const actionSent = ACTION_TOOLS.has(tool) && !PRE_ACTION_CODES.has(code)
  return { code, actionSent, retry: RETRY[code], hint: HINTS[code] }
```

</details>

#### 缺口

- 单位合格任务的人时、图像上下文和重试成本未知
  **影响**：不能推断净效率
  **进一步探讨**：对同样本比较人工和工具流程，分别记录资源和耗时

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
