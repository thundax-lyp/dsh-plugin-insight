# DSH Android

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3363a85](https://github.com/ZSeven-W/dsh-android/tree/3363a85b1bbeefe994d42d52bd8e792c1527e9ec)

<!-- BEGIN META -->
[![GitHub ★ 213](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=213&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-android) [![npm 30d 3,219](https://img.shields.io/static/v1?label=npm+30d&message=3%2C219&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-android) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-android)
<!-- END META -->

> **功能**：通过 adb 在 DSH 会话内构建运行 Android 应用、查看设备画面并操作与调试。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将设备身份、画面、语义选择与构建调试整合，减少跨窗口手填。

> **主要限制**：[Q03](#research-q03) 路由Origin/HMAC非调用者身份，观察匹配不等业务完成；安装启动信号未续传，取消非无副作用；[Q04](#research-q04)设备设置/应用不随卸载回滚。

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
  - [Q01 · 对话内Android操作比终端adb增加什么？](#detail-section-11)
  - [Q02 · 正确设备和构建/交互结果如何保持？](#detail-section-12)
  - [Q03 · 路由与模型操作授权、安全完成的边界？](#detail-section-13)
  - [Q04 · 依赖和退出是否只是关侧栏？](#detail-section-14)
  - [Q05 · 值得怎样试，新的收据要解决什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Android开发者让DSH在测试设备构建/查看/操作并排错。

终端adb/模拟器/Android Studio；继承编译/系统树/OCR，新增会话内接线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 设备画面/目标 | 选择模拟器/真机并观察 | 单stream槽非每会话隔离 |
| 构建安装启动 | Gradle到APK运行 | 可信项目/设备，launched非业务验收 |
| tree/OCR/row动作 | 降低盲点坐标与歧义 | 匹配/计数变化非持久业务结果 |
| 截图附件 | 图像模型看屏幕 | routed能力/attachment可选，隐私另核 |
| 签名路由 | 防远程/跨源/路径滥用 | 代理还需身份认证，工具另走Host权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=24.11/匹配DSH | 必需 | Host/工具/UI | 兼容未复现 |
| adb/授权设备或AVD | 必需 | 观察/行动 | 不可用仍注册但调用失败 |
| Gradle/JDK/SDK/可信项目 | 构建需要 | 执行项目脚本 | 不是workspace sandbox |
| OCR/attachment/图像模型 | 对应路径可选 | 找文本/看截图 | 缺失降级/失败需区分 |
| 代理逐路由鉴权 | 公开部署前提 | 建立用户身份 | Origin/allowlist不替代 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户独立AVD/备份/显式serial | 目标与授权清楚 |
| 构建 | Agent跑可信项目/安装 | 核APK/包/前台非只launched |
| 操作 | 新树/OCR选择并tap | 匹配后再核业务结果 |
| 异常 | 用户停动作查最终设备 | 不盲重试/卸载真app |
| 退出 | 等在途/关stream/恢复设置快照 | 清附件另授权，不随插件回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | SDK/AVD/设备/构建依赖 | USB/权限/环境核对 | 工时未知 |
| 持续 | PNG/浏览器/编译/模型/存储 | 核目标/业务后果 | 性能价格未测 |
| 失败恢复 | 构建/安装/截图副本 | 查实际设备/恢复快照 | 取消非回滚 |
| 退出 | 应用/设置/材料仍在 | 恢复旋转/清理附件 | 停用不撤销行为 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话整合 | 工具/Host/流/路由 | 真实Host兼容/净节时 |
| 目标保护 | 歧义拒绝/serial/新树 | 动态竞态/多会话隔离 |
| 结果观察 | 图像附件/OCR/计数后验 | 持久业务完成 |
| 防护/恢复 | loopback/HMAC/路径/清理 | 反代身份/取消最终设备状态 |

> **思考**：[Q03](#research-q03) 路由Origin/HMAC非调用者身份，观察匹配不等业务完成；安装启动信号未续传，取消非无副作用；[Q04](#research-q04)设备设置/应用不随卸载回滚。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将设备身份、画面、语义选择与构建调试整合，减少跨窗口手填。

[Q02](#research-q02)、[Q03](#research-q03) 多设备歧义拒绝、HMAC/路径防护与fresh tree/计数前置门真实；这些仍非会话隔离/交易验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 路由Origin/HMAC非调用者身份，观察匹配不等业务完成；安装启动信号未续传，取消非无副作用；[Q04](#research-q04)设备设置/应用不随卸载回滚。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 本地可信Host/可丢弃AVD/显式serial，核真实业务状态；未知先停并回adb/Studio/快照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核Host/路由/构建/树行和图像接线，未运行adb/SDK/设备/模型；限定可恢复无敏感账号设备试用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/android-host.ts、src/adb.ts、src/frame-source.ts、src/build-run.ts、src/stream-routes.ts、src/stream-access.ts、src/tool-support.ts、src/tool-apps.ts、src/tool-uitree.ts、src/tool-list-rows.ts、src/list-rows.ts、src/uitree.ts、src/vision.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读README/package与index真实注册；定向Host目标/动作/stream、adb执行、frame-loop、buildRun、stream access/routes、UI树/row选择/核验及vision附件；非全92文件审计，未全面读client/OCR/debug/QA-driver或Host权限，不运行目标。
- 下一步：独立AVD与可信项目比较adb基线，核两会话/多设备、UI动画/重复目标、取消后安装/前台、反代鉴权和退出设置/文件恢复。

**分析版本**

- **仓库**：[ZSeven-W/dsh-android](https://github.com/ZSeven-W/dsh-android)
- **版本号**：0.1.0-rc.12（[固定提交 3363a85](https://github.com/ZSeven-W/dsh-android/tree/3363a85b1bbeefe994d42d52bd8e792c1527e9ec)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) serial/前台/采样时点/目标与最终状态收据可探索；若现有结果等效或负担更大即否定。

独立AVD与可信项目比较adb基线，核两会话/多设备、UI动画/重复目标、取消后安装/前台、反代鉴权和退出设置/文件恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 4051 | — | — | 74102 |
| .mjs | source | 19 | 6375 | 4683 | 1413 | — |
| .ts | source | 40 | 14789 | 10818 | 3022 | — |
| .tsx | source | 15 | 5090 | 3972 | 908 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/ZSeven-W/dsh-android/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查对话内Android观察/行动链、正确设备与授权/结果/恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对话内Android操作比终端adb增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向开发Android应用并反复构建、查看、点击和排错的DSH用户，它把adb设备/构建运行/截图与UI-tree、OCR、日志等工具和侧栏画面放进会话。相对终端adb+模拟器窗口，减少切换与手填目标坐标；相对Android Studio不提供新的编译器、应用逻辑或自动业务验收。合格结果是指定测试设备跑正确构建、操作命中预期控件并核业务后果，不是工具返回launched或截图可见。

index真实创建共享AndroidHostController并注册20工具/可选Skill、路由和卸载清理，是原生插件而非手机客户端。流是一个adb exec-out连续screencap，主机拆PNG并缓冲，不起额外stream server。多模态实际有routed image能力/attachment门，成功render image，缺服务降文本；README旧段“never image blocks”与新段冲突应以源码条件为准。现成adb/系统UI树是继承能力，贡献是会话内观察-行动组合。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:249-299](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/index.ts#L249-L299)

Host及20工具主体挂载。

<details>
<summary>查看原文（51行）</summary>

```text
/** Plugin entry: mount every model-facing contribution. */
export function apply(ctx: Context, config: AndroidTrustConfig = {}): () => Promise<void> {
  const hostCtx = ctx as HostContext
  const host = new AndroidHostController()
  // Native multimodal delivery: when the host mounts the attachment store
  // and the routed model declares image input, the capture tools attach the
  // screenshot itself as an image block (vision.ts; absent services simply
  // keep the text-only behavior).
  const vision = resolveVisionServices(ctx)
  const tools = createAndroidTools(host, { vision })
  const uiTools = createAndroidUiTools(host, { vision })
  const ocrTools = createAndroidOcrTools(host, { vision })
  const rowTools = createAndroidRowTools(host, { vision })
  const logTools = createAndroidLogTools(host)
  // Debugging & memory diagnostics: created once so the same disposer can
  // stop new calls from starting while the plugin tears down.
  const debugTools = createAndroidDebugTools(host)
  // Keep the frame loop alive across crashes; an intentional stop (or the
  // idle timeout) is never fought.
  host.startKeepAlive()

  const disposers: Array<() => void | Promise<void>> = []
  // The bundled playbook: what the tool descriptions cannot say, because it is
  // about the workflow BETWEEN the tools. A host without the skill service
  // simply does not advertise it.
  disposers.push(registerAndroidSkill(ctx))
  disposers.push(ctx.effect(() => hostCtx.tools.register(tools.androidDevices), 'dsh-android:android_devices'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(tools.androidBoot), 'dsh-android:android_boot'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(tools.androidShutdown), 'dsh-android:android_shutdown'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(tools.androidScreenshot), 'dsh-android:android_screenshot'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(tools.androidInteract), 'dsh-android:android_interact'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(tools.androidListApps), 'dsh-android:android_list_apps'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(tools.androidLaunchApp), 'dsh-android:android_launch_app'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(tools.androidBuildRun), 'dsh-android:android_build_run'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(uiTools.androidUiTree), 'dsh-android:android_ui_tree'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(uiTools.androidTapElement), 'dsh-android:android_tap_element'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(rowTools.androidUiRows), 'dsh-android:android_ui_rows'))
  disposers.push(ctx.effect(() => hostCtx.tools.register(rowTools.androidTapRow), 'dsh-android:android_tap_row'))
  // The OCR trio registers as ONE effect: they share a backend, and a partial
  // registration (dsh-ios shipped one for a while) advertises a verb in the
  // playbook that has no implementation behind it.
  disposers.push(ctx.effect(() => {
    const disposeFind = hostCtx.tools.register(ocrTools.androidFindText)
    const disposeTap = hostCtx.tools.register(ocrTools.androidTapText)
    const disposeWait = hostCtx.tools.register(ocrTools.androidWaitFor)
    return () => {
      disposeWait()
      disposeTap()
      disposeFind()
    }
  }, 'dsh-android:android_ocr'))
```

</details>

**依据 2 · 源码核查**：[src/index.ts:300-329](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/index.ts#L300-L329)

其余工具/路由/清理。

<details>
<summary>查看原文（30行）</summary>

```text
  disposers.push(ctx.effect(() => hostCtx.tools.register(logTools.androidLogs), 'dsh-android:android_logs'))
  disposers.push(ctx.effect(() => {
    const disposeProcesses = hostCtx.tools.register(debugTools.androidProcesses)
    const disposeBacktrace = hostCtx.tools.register(debugTools.androidBacktrace)
    const disposeMeminfo = hostCtx.tools.register(debugTools.androidMeminfo)
    const disposeAppInfo = hostCtx.tools.register(debugTools.androidAppInfo)
    return () => {
      disposeAppInfo()
      disposeMeminfo()
      disposeBacktrace()
      disposeProcesses()
      debugTools.dispose()
    }
  }, 'dsh-android:debug-tools'))

  // Signed web routes (stream, screenshot, grant, control, …): mounted on the
  // optional webServer service; headless profiles skip them entirely.
  installStreamRoutes(ctx, host, config)

  const adb = host.toolchain.binary
  ctx.logger.info(
    `dsh-android mounted (${ANDROID_TOOL_NAMES.join(' + ')} + ${ANDROID_UI_TOOL_NAMES.join(' + ')} + `
    + `${ANDROID_ROW_TOOL_NAMES.join(' + ')} + ${ANDROID_OCR_TOOL_NAMES.join(' + ')} + android_logs + `
    + `${ANDROID_DEBUG_TOOL_NAMES.join(' + ')}; adb: `
    + `${adb.available ? `${adb.command ?? 'adb'} (${adb.source})` : `unavailable — ${adb.reason ?? '?'}`})`,
  )
  return async () => {
    for (const dispose of disposers.reverse()) await dispose()
    await host.dispose()
  }
```

</details>

**依据 3 · 源码核查**：[src/frame-source.ts:154-171](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/frame-source.ts#L154-L171)

真实无内端口帧来源。

<details>
<summary>查看原文（18行）</summary>

```text
  start(): void {
    if (this.running || this.#stopped) return
    // `exec-out` skips the pty (binary-safe); the single-string command runs
    // through the device shell, so one child produces frames forever.
    const child = this.toolchain.spawnExecOut(this.serial, ['while :; do screencap -p; done'])
    this.#child = child
    child.stdout?.on('data', (chunk: Buffer) => {
      for (const png of this.#splitter.push(chunk)) this.#acceptFrame(png)
    })
    child.stderr?.on('data', (chunk: Buffer) => this.#recordStderr(chunk))
    child.once('error', error => {
      this.#recordStderr(Buffer.from(`spawn error: ${error.message}\n`))
    })
    child.once('close', (code, signal) => {
      if (this.#child !== child) return
      this.#child = undefined
      const detail = signal !== null ? `killed by ${signal}` : `exit ${String(code)}`
      if (!this.#stopped) this.events.onExit?.(detail)
```

</details>

**依据 4 · 源码核查**：[src/vision.ts:150-159](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/vision.ts#L150-L159)

图像路由门。

<details>
<summary>查看原文（10行）</summary>

```text
export async function imageInputActive(services: AndroidVisionServices, exec: VisionExecLike): Promise<boolean> {
  const llm = services.llm
  if (llm === undefined || services.attachments === undefined) return false
  try {
    const routed = exec.agent?.session?.requestHeader?.()?.config
    const provider = routed?.provider ?? exec.agent?.options?.provider
    const model = routed?.model ?? exec.agent?.options?.model
    if (provider === undefined || model === undefined) return false
    const info = await llm.resolveModelInfo(provider, model, exec.signal)
    return info.inputModalities?.includes('image') === true
```

</details>

**依据 5 · 源码核查**：[src/vision.ts:170-195](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/vision.ts#L170-L195)

attachment提交/降级。

<details>
<summary>查看原文（26行）</summary>

```text
export async function saveScreenshotAttachment(
  services: AndroidVisionServices,
  png: Uint8Array,
  name: string,
): Promise<AndroidImageRef | undefined> {
  const attachments = services.attachments
  if (attachments === undefined) return undefined
  try {
    const input = { data: png, mediaType: 'image/png', name }
    // Prefer the documented batch entry; fall back to the single-image one,
    // which the local backend also exposes.
    const ref = typeof attachments.saveImages === 'function'
      ? (await attachments.saveImages([input]))?.[0]
      : await attachments.saveImage?.(input)
    if (typeof ref?.attachmentId !== 'string' || ref.attachmentId === '') return undefined
    return {
      attachmentId: ref.attachmentId,
      mediaType: ref.mediaType,
      bytes: ref.bytes,
      width: ref.width,
      height: ref.height,
      ...(ref.name === undefined ? {} : { name: ref.name }),
    }
  } catch {
    return undefined
  }
```

</details>

**依据 6 · 源码核查**：[src/vision.ts:221-227](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/vision.ts#L221-L227)

实际image渲染。

```text
export function renderJsonWithImage(_args: unknown, value: unknown): Array<{ type: 'text'; text: string }> {
  const blocks: unknown[] = [{ type: 'text', text: JSON.stringify(value, null, 2) }]
  const image = (value as { image?: AndroidImageRef } | undefined)?.image
  if (image !== undefined && typeof image.attachmentId === 'string') {
    blocks.push({ type: 'image', attachment: image })
  }
  return blocks as Array<{ type: 'text'; text: string }>
```

**依据 7 · 源码核查**：[README.md:35-46](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/README.md#L35-L46)

作者文档多模态矛盾。

<details>
<summary>查看原文（12行）</summary>

```text
| 📱 **Live device in the conversation** | A `multipart/x-mixed-replace` PNG stream produced **in-process** and served straight from the latest-frame buffer through signed `/_dsh/dsh-android/*` routes. |
| 🔌 **No external stream helper, no inner port** | One persistent `adb exec-out` child runs `while :; do screencap -p; done`; the host splits the concatenated PNGs into frames itself. There is no loopback stream server to proxy, no port range to manage, and nothing to adopt after an ungraceful exit. |
| 🧩 **One adb code path** | Emulators and phones are the same thing to adb and to this plugin. No `simctl`/WebDriverAgent dual stack, no build-and-trust dance before a physical device works. |
| 🛠️ **20 agent tools** | Devices, boot/shutdown, screenshot, interact, Gradle build &amp; run, app listing/launching, `uiautomator` UI tree + tap-by-element, list/feed row actions, Vision OCR find/tap/wait, logcat, processes, ANR/crash backtrace, meminfo, app info. |
| 👆 **Three-button navigation panel** | Tap and drag on the live video; a toolbar with **◁ Back · ○ Home · □ Recents** plus rotate, screenshot, and refresh; a device menu for the notification shade, quick settings, lock, wake, and the assistant. |
| 🖼️ **Native multimodal** | On an image-capable model every capture tool (screenshot, interact, tap_element, tap_text, tap_row) returns the screenshot ITSELF as an image block — the model sees the screen directly. OCR stays for pixel-precise text taps and text-only routes; text-only models keep the plain JSON summary. |
| 🔐 **Signed loopback-only routes** | Every route requires a loopback peer, a loopback `Host` (DNS rebinding rejected), and Fetch-Metadata/Origin checks — before any capability is consulted. HMAC-SHA256 capabilities expire within 10 minutes. |
| 🔍 **Semantic + visual automation** | `android_ui_tree` dumps the `uiautomator` hierarchy and `android_tap_element` taps by `resource-id`, text, or content-description; when the tree is empty or the text is baked into an image, `android_find_text` / `android_tap_text` OCR the screen instead of guessing coordinates. |

## Tools

All 20 tools are registered on every host and return plain JSON — visual bytes reach the UI only through `presentationMeta` + signed routes, never as image blocks. When adb cannot be resolved the tools stay registered and every call fails with an explanatory error naming the fix.
```

</details>

#### 缺口

- 真实设备/宿主/模型任务对照未验。
  **影响**：不能证明减少调试工时或成功率更高。
  **进一步探讨**：可丢弃模拟器上比较同一构建/点击/验收任务与adb/Studio，计人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 正确设备和构建/交互结果如何保持？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

target显式serial优先；匹配当前活帧且足够新的设备证明可快速返回，否则查询adb，省serial时取当前stream或唯一在线，多设备歧义拒绝。这比随便选第一台稳妥，但Host只有一个stream槽，跨会话不是每人独占设备。ensureStreaming新设备串行替换旧loop；grant拒绝抢其他设备，switch-device显式切换，旧token帧回调检查serial不送新设备画面。

build工具禁止并发且把exec.signal传buildRun；Gradle按wrapper/项目构建、找APK/applicationId、install -r并检查输出Failure，monkey也检查已知错误，不能说只信exit0。但buildRun最终state=launched不验证应用前台/业务，底层注释也区分monkey原输出。UI tree目标用新dump、精确再包含并处理歧义；tap_element直接树像素避免先normalize再错旋转，可选OCR expectation。row工具点前确认counter key、越界拒绝，点后比计数且检测row是否移动；已有保护不能忽略，仍只是可见标签/计数变化而非业务持久完成。

#### 证据与依据

**依据 1 · 源码核查**：[src/android-host.ts:455-498](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/android-host.ts#L455-L498)

目标解析与歧义拒绝。

<details>
<summary>查看原文（44行）</summary>

```text
  async resolveTarget(serial?: string): Promise<AndroidDevice> {
    const loop = this.#loop
    const proof = this.#streamDevice
    const frame = loop?.latestFrame
    const age = frame === undefined ? Infinity : Date.now() - frame.at
    if (!this.#disposed && serial !== undefined && serial !== ''
      && loop?.running === true && loop.serial === serial
      && proof?.loop === loop && age >= 0 && age <= STREAM_DEVICE_PROOF_MAX_AGE_MS) {
      // This exact stream was started after a real online-device query and
      // is still receiving frames. Return a copy so callers cannot mutate
      // the retained descriptor. Unnamed, different, stale or dead streams
      // continue through the real adb query below.
      return { ...proof.device }
    }
    const online = await this.toolchain.onlineDevices()
    if (serial !== undefined && serial !== '') {
      const match = online.find(device => device.serial === serial)
      if (match === undefined) {
        const all = await this.toolchain.listDevices()
        const known = all.find(device => device.serial === serial)
        if (known !== undefined) {
          throw new AdbError(
            `dsh-android: device ${serial} is ${known.state}${known.state === 'unauthorized' ? ' — accept the USB debugging prompt on the device' : ''}`,
            [],
          )
        }
        throw new AdbError(`dsh-android: no connected device has the serial ${serial} (run android_devices)`, [])
      }
      return match
    }
    const streamed = this.streamedSerial
    if (streamed !== undefined) {
      const match = online.find(device => device.serial === streamed)
      if (match !== undefined) return match
    }
    if (online.length === 1) return online[0]!
    if (online.length === 0) {
      throw new AdbError('dsh-android: no device is connected — start an emulator or plug in a phone with USB debugging enabled, then run android_devices', [])
    }
    throw new AdbError(
      `dsh-android: ${online.length} devices are connected (${online.map(device => device.serial).join(', ')}); pass the serial explicitly`,
      [],
    )
  }
```

</details>

**依据 2 · 源码核查**：[src/android-host.ts:199-239](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/android-host.ts#L199-L239)

单槽串行切换。

<details>
<summary>查看原文（41行）</summary>

```text
  async ensureStreaming({ serial }: { serial: string }): Promise<AndroidStreamInfo> {
    if (this.#disposed) throw new Error('dsh-android: the host is disposed')
    if (typeof serial !== 'string' || serial === '') throw new TypeError('dsh-android: ensureStreaming requires a non-empty serial')
    const startFor = async (): Promise<AndroidStreamInfo> => {
      const current = this.#loop
      if (current !== undefined && current.running && current.serial === serial) {
        return this.#infoOf(current)
      }
      if (current !== undefined && current.serial !== serial) {
        current.stop()
        this.#loop = undefined
        this.#streamDevice = undefined
      }
      return this.#startFor(serial)
    }
    let starting = this.#starting
    if (starting !== undefined) {
      try {
        await starting
      } catch {
        // A failed shared launch is settled; retry below.
      }
      if (this.running && this.#loop?.serial === serial) {
        this.#armIdle()
        return this.#infoOf(this.#loop!)
      }
      starting = undefined
    }
    starting = this.#serializeLaunch(startFor)
    this.#starting = starting
    try {
      const info = await starting
      this.#lastError = undefined
      this.#armIdle()
      return info
    } catch (error) {
      this.#lastError = errorMessage(error)
      throw error
    } finally {
      if (this.#starting === starting) this.#starting = undefined
    }
```

</details>

**依据 3 · 源码核查**：[src/stream-routes.ts:249-279](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/stream-routes.ts#L249-L279)

token绑定设备与帧过滤。

<details>
<summary>查看原文（31行）</summary>

```text
      const payload = await this.access.verifyStreamToken(token)
      if (payload === undefined) throw new RouteError(403, 'the stream token is invalid or expired', 'forbidden')
      if (this.host.streamedSerial !== payload.serial) {
        throw new RouteError(503, 'the device stream is not running; request a fresh grant', 'stream_not_running')
      }
      const release = this.host.acquire()
      try {
        await this.host.ensureStreaming({ serial: payload.serial })
      } catch (error) {
        release()
        throw new RouteError(502, `the device stream failed to start: ${errorMessage(error)}`, 'stream_failed')
      }
      if (this.#disposed) {
        release()
        res.destroy()
        return
      }
      const writer = new MultipartFrameWriter(res)
      let finished = false
      const teardown = (): void => {
        if (finished) return
        finished = true
        this.#streamTeardowns.delete(teardown)
        unsubscribe()
        writer.close()
        release()
      }
      const unsubscribe = this.host.subscribeFrames(frame => {
        // Frames for a different serial (after a device switch) must not
        // leak into a capability minted for the old device.
        if (this.host.streamedSerial === payload.serial) writer.writeFrame(frame)
```

</details>

**依据 4 · 源码核查**：[src/stream-routes.ts:333-352](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/stream-routes.ts#L333-L352)

grant拒绝抢槽。

<details>
<summary>查看原文（20行）</summary>

```text
  async handleGrant(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const value = await this.#readJson(req, res)
      if (value === undefined) return
      const kind = value.kind
      if (kind === 'stream') {
        const serial = await this.#resolveGrantSerial(value.device)
        const status = this.host.status()
        if (status.running && status.serial !== serial) {
          throw new RouteError(409, `another device is streaming (${status.serial}); switch devices instead of re-granting`, 'device_busy')
        }
        if (!status.running) {
          await this.#requireOnline(serial)
        }
        try {
          await this.host.ensureStreaming({ serial })
        } catch (error) {
          throw new RouteError(502, `the device stream failed to start: ${errorMessage(error)}`, 'stream_failed')
        }
        const signed = await this.access.signStreamToken(serial)
```

</details>

**依据 5 · 源码核查**：[src/stream-routes.ts:389-410](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/stream-routes.ts#L389-L410)

显式切换。

<details>
<summary>查看原文（22行）</summary>

```text
  async handleSwitchDevice(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const value = await this.#readJson(req, res)
      if (value === undefined) return
      const serial = value.device
      if (typeof serial !== 'string' || !SERIAL_PATTERN.test(serial)) {
        throw new RouteError(400, 'device must be an adb device serial', 'bad_request')
      }
      const device = await this.#requireOnline(serial)
      try {
        await this.host.ensureStreaming({ serial })
      } catch (error) {
        throw new RouteError(502, `the device stream failed to start: ${errorMessage(error)}`, 'stream_failed')
      }
      const signed = await this.access.signStreamToken(serial)
      sendJson(res, 200, {
        ok: true,
        streamUrl: `${STREAM_ROUTE_PREFIX}/${signed.token}`,
        expiresAt: signed.expiresAt,
        device: serial,
        deviceName: device.model ?? serial,
      })
```

</details>

**依据 6 · 源码核查**：[src/tool-apps.ts:330-346](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/tool-apps.ts#L330-L346)

非并发构建/信号。

<details>
<summary>查看原文（17行）</summary>

```text
    isConcurrencySafe: () => false,
    async execute(
      args: { projectPath: string; module?: string; device?: string; variant?: string; relaunch?: boolean },
      exec,
    ) {
      const project = detectProject(args.projectPath)
      const { device, summary } = await resolveTarget(host, 'android_build_run', args.device)
      return buildRun({
        project,
        toolchain: host.toolchain,
        device,
        deviceSummary: summary,
        ...(args.module === undefined ? {} : { module: args.module }),
        ...(args.variant === undefined ? {} : { variant: args.variant }),
        ...(args.relaunch === undefined ? {} : { relaunch: args.relaunch }),
        signal: exec.signal,
      })
```

</details>

**依据 7 · 源码核查**：[src/build-run.ts:416-472](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/build-run.ts#L416-L472)

构建安装输出检查及launched。

<details>
<summary>查看原文（57行）</summary>

```text
export async function buildRun(options: BuildRunOptions): Promise<AndroidBuildRunResult> {
  const { project, toolchain, device, deviceSummary, signal } = options
  const variant = options.variant === undefined || options.variant.trim() === '' ? 'debug' : options.variant.trim()
  const task = assembleTask(variant, options.module)
  const { exitCode, lines } = await runGradleBuild(project, assembleGradleArgs(task), signal)
  if (exitCode !== 0) {
    throw new Error(
      `android_build_run: ${basename(project.gradleCommand)} ${task} failed (exit ${String(exitCode)}) in `
      + `${project.root}:\n${buildFailureDetail(lines)}`,
    )
  }
  const apk = findBuiltApk(project.root, variant)
  if (apk === undefined) {
    throw new Error(
      `android_build_run: ${task} succeeded but no APK was found under ${project.root}`
      + `/**/build/outputs/apk/${variant}/ — check that the module applies the com.android.application `
      + `plugin (a library module produces an .aar, which cannot be installed) and that the variant name `
      + `"${variant}" exists.`,
    )
  }
  const { packageName, source } = resolveApplicationId(apk, project.root)
  try {
    const install = await toolchain.exec(['install', '-r', apk.path], {
      serial: device.serial,
      timeoutMs: INSTALL_TIMEOUT_MS,
    })
    const combined = `${install.stdout}\n${install.stderr}`
    // `adb install` exits 0 even when the device refuses the package, printing
    // `Failure [INSTALL_FAILED_…]` — treat that as the failure it is.
    const failure = /Failure \[([^\]]+)\]/u.exec(combined)
    if (failure !== null) {
      throw new Error(
        `the device refused the package (${failure[1]}) — an INSTALL_FAILED_UPDATE_INCOMPATIBLE or `
        + `SIGNATURE mismatch means an app with the same id is already installed from a different build; `
        + `uninstall it on the device first (adb -s ${device.serial} uninstall ${packageName})`,
      )
    }
  } catch (error) {
    throw new Error(`android_build_run: installing ${apk.path} on ${device.serial} failed: ${errorMessage(error)}`)
  }
  const relaunch = options.relaunch === true
  if (relaunch) {
    await toolchain.shell(device.serial, ['am', 'force-stop', packageName], { timeoutMs: LAUNCH_TIMEOUT_MS })
      .catch(() => undefined)
  }
  await launchPackage(toolchain, device.serial, packageName)
  return {
    device: deviceSummary,
    state: 'launched',
    packageName,
    apkPath: apk.path,
    projectPath: project.root,
    task,
    variant,
    packageSource: source,
    ...(relaunch ? { relaunched: true as boolean } : {}),
  }
```

</details>

**依据 8 · 源码核查**：[src/build-run.ts:490-512](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/build-run.ts#L490-L512)

monkey失败/成功语义。

<details>
<summary>查看原文（23行）</summary>

```text
export async function launchPackage(
  toolchain: { shell: AdbToolchain['shell'] },
  serial: string,
  packageName: string,
  options: { timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<string> {
  const output = await toolchain.shell(serial, launchPackageCommand(packageName), {
    timeoutMs: options.timeoutMs ?? LAUNCH_TIMEOUT_MS,
    ...(options.signal === undefined ? {} : { signal: options.signal }),
  })
  if (/No activities found|Error:|monkey aborted/u.test(output)) {
    // Some packages (services, or apps whose entry point is not a LAUNCHER
    // activity) have nothing monkey can start — say which case this is.
    throw new Error(
      `could not launch ${packageName} on ${serial}: ${output.trim().split('\n').slice(0, 4).join(' ')} — `
      + 'the package may have no launcher activity (a service-only or library package), or it may not be '
      + 'installed; run android_list_apps to check',
    )
  }
  // Honest receipt: the raw monkey output is returned verbatim. A clean exit 0
  // is NOT translated into "the app launched" — the QA wrapper verifies via
  // its own foreground-app read instead.
  return output
```

</details>

**依据 9 · 源码核查**：[src/uitree.ts:787-835](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/uitree.ts#L787-L835)

新树选择规则。

<details>
<summary>查看原文（49行）</summary>

```text
export function resolveTapTarget(
  roots: readonly UiTreeNode[],
  selector: UiSelector,
  options: ResolveTapOptions = {},
): ResolvedUiTarget {
  const tool = options.tool ?? 'android_tap_element'
  const identifier = selector.identifier !== undefined && selector.identifier.trim() !== ''
    ? selector.identifier.trim()
    : undefined
  const label = selector.label !== undefined && selector.label.trim() !== '' ? selector.label.trim() : undefined
  if (identifier === undefined && label === undefined) {
    throw new Error(
      `${tool} requires an element selector: identifier (the resource-id) and/or label `
      + '(the text or content-desc). Run android_ui_tree to see what the screen exposes.',
    )
  }
  const flat = flattenNodes(roots)
  const matchesValue = (actual: string | undefined, wantedValue: string, mode: UiMatchMode): boolean => {
    if (actual === undefined) return false
    return mode === 'exact' ? actual === wantedValue : actual.toLowerCase().includes(wantedValue.toLowerCase())
  }
  const matchesNode = (node: FlatUiNode, mode: UiMatchMode): boolean => {
    if (identifier !== undefined && !matchesValue(node.resourceId, identifier, mode)) return false
    if (label !== undefined
      && !matchesValue(node.text, label, mode)
      && !matchesValue(node.contentDesc, label, mode)) return false
    return true
  }
  let candidates = flat.filter(node => matchesNode(node, 'exact'))
  let matchedBy: UiMatchMode = 'exact'
  if (candidates.length === 0) {
    candidates = flat.filter(node => matchesNode(node, 'contains'))
    matchedBy = 'contains'
  }
  const wantedParts: string[] = []
  if (identifier !== undefined) wantedParts.push(`identifier ${JSON.stringify(identifier)}`)
  if (label !== undefined) wantedParts.push(`label ${JSON.stringify(label)}`)
  const wanted = wantedParts.join(' and ')
  if (candidates.length === 0) {
    throw new Error(
      `${tool}: no node matches ${wanted} on the current screen — run android_ui_tree to inspect what is `
      + 'actually there, or android_find_text to OCR labels the view hierarchy does not carry '
      + '(Compose/Flutter/WebView/game canvases often expose none).',
    )
  }
  // Drop exact box duplicates of the same class (a wrapper listed twice).
  const unique = candidates.filter((node, index) => !candidates
    .slice(0, index)
    .some(other => other.type === node.type && sameBounds(other.bounds, node.bounds)))
```

</details>

**依据 10 · 源码核查**：[src/tool-uitree.ts:810-866](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/tool-uitree.ts#L810-L866)

树像素/后验OCR接线。

<details>
<summary>查看原文（57行）</summary>

```text
      const device = await host.resolveTarget(args.serial)
      let roots: UiTreeNode[]
      try {
        // No rotation is read any more: the tap no longer normalizes, so there
        // is no axis to swap. `screen` below is only a zero-size guard.
        roots = (await readUiTree(host.toolchain, device.serial)).roots
      } catch (error) {
        throw new Error(`android_tap_element: ${errorMessage(error)}`)
      }
      const { node } = resolveTapTarget(roots, { identifier: args.identifier, label: args.label }, {
        allowOffscreen: args.allow_offscreen === true,
        tool: 'android_tap_element',
      })
      const screen = screenBoundsOf(roots)
      if (screen.width <= 0 || screen.height <= 0) {
        throw new Error(
          'android_tap_element: the dump reported a zero-size display, so a tap cannot be placed — '
          + 're-run android_ui_tree once the screen is on and settled',
        )
      }
      const center = boundsCenter(node.bounds)
      // Send the node's own pixel straight to `input tap`.
      //
      // A tree coordinate IS an input coordinate, so normalize-and-multiply-
      // back is a round trip that can only lose. It used to lose exactly the
      // system-bar inset: the dump reports the APP frame (2560x1500) while
      // `input` addresses the FULL display (2560x1536), so a target at y=1472
      // normalized to 0.9813 and tapped at 1507 — past the app frame, inside
      // the gesture strip, swallowed. Keeping both halves on the same space
      // fixed that, but it needed `#pixels` to rotate as well, which it did
      // not; with no stream running a landscape tree reached it with swapped
      // axes. A pixel has no second half to disagree with.
      const tap = { x: round4(center.x), y: round4(center.y) }
      try {
        await host.tapPixels(device.serial, tap.x, tap.y)
      } catch (error) {
        throw new Error(`android_tap_element: the tap at (${center.x}, ${center.y}) px failed: ${errorMessage(error)}`)
      }
      await sleep(TAP_SETTLE_MS)
      const screenshot = await captureScreenshot('android_tap_element', screenshots, host, device,
        vision === undefined ? undefined : { services: vision, exec })
      const expected = expectation === undefined
        ? undefined
        : await runTapExpectation('android_tap_element', screenshots, host, device, expectation.text, expectation.mode, exec.signal)
      return {
        action: 'tap-element',
        element: {
          type: node.type,
          ...(node.text === undefined ? {} : { text: node.text }),
          ...(node.contentDesc === undefined ? {} : { contentDesc: node.contentDesc }),
          ...(node.resourceId === undefined ? {} : { resourceId: node.resourceId }),
          bounds: { ...node.bounds },
        },
        center,
        tap,
        ...screenshot,
        ...(expected === undefined ? {} : { expected }),
```

</details>

**依据 11 · 源码核查**：[src/tool-list-rows.ts:401-451](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/tool-list-rows.ts#L401-L451)

计数点前拒绝与后验。

<details>
<summary>查看原文（51行）</summary>

```text
      const device = await host.resolveTarget(args.serial)
      const sample = await readRows('android_tap_row', device.serial)
      const plan = planRowTap(sample.rows, args.row, fractionX, fractionY, sample.screen)
      // The probe-guard runs BEFORE the tap: an unverifiable expectation is a
      // refusal, not a "tap and see".
      if (expectation !== undefined) requireCountKey(plan.row, expectation.key)
      if (sample.screen.width <= 0 || sample.screen.height <= 0) {
        throw new Error(
          'android_tap_row: the dump reported a zero-size display, so a tap cannot be placed — re-run '
          + 'android_ui_rows once the screen is on and settled',
        )
      }
      // A row-relative position is already computed in tree pixels, and a tree
      // pixel IS an input pixel — so it goes straight through, for the reasons
      // spelled out on AndroidToolHost.tapPixels.
      const tap = { x: round4(plan.tap.x), y: round4(plan.tap.y) }
      try {
        await host.tapPixels(device.serial, tap.x, tap.y)
      } catch (error) {
        throw new Error(`android_tap_row: the tap at (${plan.tap.x}, ${plan.tap.y}) px failed: ${errorMessage(error)}`)
      }

      let countCheck: CountCheckResult | undefined
      if (expectation !== undefined) {
        await sleep(TAP_VERIFY_SETTLE_MS)
        const after = await readRows('android_tap_row', device.serial)
        const afterRow = after.rows.find(row => row.index === plan.row.index)
        countCheck = afterRow === undefined
          ? {
              key: expectation.key,
              delta: expectation.delta,
              verified: false,
              changed: false,
              reason: 'the re-read hierarchy no longer contains the row (the screen changed)',
            }
          : verifyCountChange(plan.row, afterRow, expectation.key, expectation.delta)
      }
      const screenshot = await captureScreenshot('android_tap_row', screenshots, host, device,
        vision === undefined ? undefined : { services: vision, exec })
      return {
        action: 'tap-row',
        row: toOutputRow(plan.row),
        inRow: plan.inRow,
        center: plan.tap,
        tap,
        ...(countCheck === undefined ? {} : { countCheck }),
        ...screenshot,
        ...(expectation === undefined
          ? {
              note: 'No expect_count was given, so nothing was verified — re-run android_ui_rows and compare '
                + 'the row counters if confirmation matters.',
```

</details>

**依据 12 · 源码核查**：[src/list-rows.ts:460-503](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/list-rows.ts#L460-L503)

计数与行移动防护。

<details>
<summary>查看原文（44行）</summary>

```text
export function verifyCountChange(before: ListRow, after: ListRow, key: string, delta: 1 | -1): CountCheckResult {
  const normalized = normalizeCountKey(key)
  const beforeValue = rowCountFor(before, normalized)
  const afterValue = rowCountFor(after, normalized)
  if (beforeValue === undefined) {
    return {
      key: normalized,
      delta,
      ...(afterValue === undefined ? {} : { after: afterValue }),
      verified: false,
      changed: afterValue !== undefined,
      reason: 'the key was absent from the before label',
    }
  }
  if (afterValue === undefined) {
    return {
      key: normalized,
      delta,
      before: beforeValue,
      verified: false,
      changed: false,
      reason: 'the key is absent from the re-read label (the row text changed)',
    }
  }
  if (!rowsStayedPut(before, after)) {
    return {
      key: normalized,
      delta,
      before: beforeValue,
      after: afterValue,
      verified: false,
      changed: afterValue !== beforeValue,
      reason: 'the row moved after the action, so the counters are not comparable',
    }
  }
  const moved = afterValue - beforeValue
  return {
    key: normalized,
    delta,
    before: beforeValue,
    after: afterValue,
    verified: moved === delta,
    changed: moved !== 0,
    ...(moved === delta ? {} : { reason: `the counter moved by ${moved}, not the expected ${delta > 0 ? '+' : ''}${delta}` }),
```

</details>

#### 缺口

- 真实UI竞态、不同会话抢设备与端到端业务持久状态未验。
  **影响**：不保证不误点或业务完成。
  **进一步探讨**：两个session同/异设备核选择，动画/列表重排/重复标签和前台app状态对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路由与模型操作授权、安全完成的边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

路由先验实际loopback peer，再Host/trustedAuthority与Origin/Fetch Metadata；POST全部要求Origin。流/截图GET另HMAC token有类型/到期，截图lstat拒symlink、realpath/O_NOFOLLOW/尺寸和读后重验，是真实防护，不应套泛泛“未隔离”忽略。trustedAuthorities只允许代理名称，不建立用户身份；本机非浏览器可伪造头，公开反代必须对每插件路由另鉴权，README也明说。模型工具直接adb不靠浏览器token，该防线不代Host批准/设备用户授权，设备截图/日志可含私密信息。

动作读树/图到tap仍有时间窗，OCR出现/消失和row计数不能证明收款/发帖/后端提交或正确账户；必须在允许操作前明确业务目标。截图可进入附件并发给图像模型，非纯本地可见。取消链有部分真实支持（adb execFile支持signal、Gradle listener kill子进程、OCR expectation传signal），但buildRun安装/force-stop/launch未继续传signal，底层主机tap也只有timeout；不能由外层取消宣称设备副作用未发生。Gradle kill不是已停止全部daemon/远端动作证明，未复现具体误操作。

#### 证据与依据

**依据 1 · 源码核查**：[src/stream-access.ts:373-425](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/stream-access.ts#L373-L425)

传输/Host/Origin真实防护。

<details>
<summary>查看原文（53行）</summary>

```text
function isTrustedTransportRequest(req: IncomingMessage): boolean {
  // Half one is unchanged and not configurable: the peer must be loopback, so a
  // LAN client on the web port cannot pass however it writes its Host header.
  if (!isLoopbackRemoteAddress(req.socket?.remoteAddress)) return false
  const authority = requestAuthority(req)
  if (authority === undefined) return false
  // Half two: either the Host itself is loopback, or the operator listed the
  // authority their reverse proxy forwards.
  return isLoopbackHostname(authority.hostname) || trustedEntriesForHost(authority, req.headers.host as string).length > 0
}

function isTrustedBrowserRequest(req: IncomingMessage, requireOrigin: boolean, entries: readonly MintedAuthority[] | undefined): boolean {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = req.headers.origin
  if (origin === undefined) return !requireOrigin
  if (typeof origin !== 'string') return false
  const authority = requestAuthority(req)
  if (authority === undefined) return false
  try {
    const parsed = new URL(origin)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false
    if (parsed.hostname === '' || parsed.username !== '' || parsed.password !== ''
      || parsed.pathname !== '/' || parsed.search !== '' || parsed.hash !== '') return false
    // A configured authority is compared against the origin the operator listed
    // for it, which is the only way a proxied deployment can be checked at all:
    // the browser sends the PUBLIC origin (usually with no port, because 443 is
    // implicit) while the proxy forwards its own Host, so comparing the two
    // headers with each other refuses a same-origin request. It is not a reason
    // to drop the port from the comparison — see `matchesTrustedOrigin`.
    if (entries !== undefined) return entries.some(entry => matchesTrustedOrigin(entry, parsed))
    // A loopback Host is a specific origin, so the port has to agree: the DSH
    // webserver answers on one port, and another application on the same
    // hostname must not be able to drive these routes.
    return hostMatchesOrigin(authority, parsed, req.headers.host as string)
  } catch {
    return false
  }
}

/** The transport fence applied to every dsh-android route. */
export function isTrustedRequest(req: IncomingMessage, requireOrigin: boolean): boolean {
  // The transport decides first, and it is the half that actually refuses a
  // remote caller; the header checks are only meaningful after it passes.
  if (!isTrustedTransportRequest(req)) return false
  const authority = requestAuthority(req)
  // A loopback Host is the local-browser case and is judged on its own: letting
  // an allowlist entry (an operator may well list `localhost` for an SSH tunnel)
  // redirect it into the configured-origin branch would make listing an entry
  // NARROW the fence, refusing the local panel on its own port.
  const entries = authority === undefined || isLoopbackHostname(authority.hostname)
    ? undefined
    : trustedEntriesForHost(authority, req.headers.host as string)
  return isTrustedBrowserRequest(req, requireOrigin, entries)
```

</details>

**依据 2 · 源码核查**：[src/stream-access.ts:297-317](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/stream-access.ts#L297-L317)

HMAC/到期校验。

<details>
<summary>查看原文（21行）</summary>

```text
  async #verify<Payload>(token: string, parse: (value: unknown) => Payload | undefined): Promise<Payload | undefined> {
    if (token.length === 0 || token.length > MAX_TOKEN_LENGTH || !TOKEN_PATTERN.test(token)) return undefined
    const [encoded, signature] = token.split('.')
    if (encoded === undefined || signature === undefined) return undefined
    const key = await this.#key().catch(() => undefined)
    if (key === undefined) return undefined
    let supplied: Buffer
    try {
      supplied = Buffer.from(signature, 'base64url')
    } catch {
      return undefined
    }
    if (!safeEqual(mac(key, encoded), supplied)) return undefined
    try {
      const payload = parse(JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')))
      if (payload === undefined) return undefined
      const now = Date.now()
      const expiresAt = (payload as { exp?: unknown }).exp
      if (typeof expiresAt !== 'number' || expiresAt <= now) return undefined
      if (expiresAt - now > TOKEN_TTL_MS + CLOCK_SKEW_MS) return undefined
      return payload
```

</details>

**依据 3 · 源码核查**：[src/stream-access.ts:436-461](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/stream-access.ts#L436-L461)

截图symlink/realpath。

<details>
<summary>查看原文（26行）</summary>

```text
export async function classifyScreenshotPath(path: string): Promise<ScreenshotVerdict> {
  const root = screenshotDir()
  await mkdir(root, { recursive: true, mode: 0o700 }).catch(() => {})
  if (!isAbsolute(path)) return 'outside'
  const rel = relative(root, path)
  if (rel === '' || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) return 'outside'
  let current = root
  const parts = rel.split(sep)
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]
    if (part === undefined || part.length === 0 || part === '.' || part === '..') return 'outside'
    current = join(current, part)
    let info
    try {
      info = await lstat(current)
    } catch {
      return 'missing'
    }
    if (info.isSymbolicLink()) return 'outside'
    const final = index === parts.length - 1
    if (final ? !info.isFile() : !info.isDirectory()) return 'missing'
  }
  const [realRoot, realFile] = await Promise.all([realpath(root), realpath(path)])
  const relReal = relative(realRoot, realFile)
  if (relReal === '..' || relReal.startsWith(`..${sep}`) || isAbsolute(relReal)) return 'outside'
  return 'ok'
```

</details>

**依据 4 · 源码核查**：[src/stream-access.ts:469-482](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/stream-access.ts#L469-L482)

open/尺寸/读后重验。

<details>
<summary>查看原文（14行）</summary>

```text
export async function openVerifiedScreenshot(path: string): Promise<{ bytes: Buffer } | undefined> {
  const verdict = await classifyScreenshotPath(path)
  if (verdict !== 'ok') return undefined
  const noFollow = typeof fsConstants.O_NOFOLLOW === 'number' ? fsConstants.O_NOFOLLOW : 0
  const handle = await open(path, fsConstants.O_RDONLY | noFollow).catch(() => undefined)
  if (handle === undefined) return undefined
  try {
    const info = await handle.stat()
    if (!info.isFile() || info.size <= 0 || info.size > MAX_SCREENSHOT_BYTES) return undefined
    const bytes = await handle.readFile()
    if (await classifyScreenshotPath(path) !== 'ok') return undefined
    return { bytes }
  } finally {
    await handle.close().catch(() => {})
```

</details>

**依据 5 · 源码核查**：[src/stream-routes.ts:675-679](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/stream-routes.ts#L675-L679)

所有POST先Origin。

```text
  /** Trusted-fence + method + JSON envelope shared by every POST route. */
  async #readJson(req: IncomingMessage, res: ServerResponse): Promise<Record<string, unknown> | undefined> {
    this.#requireTrusted(req, true)
    if (req.method !== 'POST') {
      sendJson(res, 405, { ok: false, error: 'this route only accepts POST' }, { allow: 'POST' })
```

**依据 6 · 源码核查**：[README.md:123-127](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/README.md#L123-L127)

作者明确反代非认证。

```text
  **Configure public authorities only behind a proxy that authenticates every plugin route.** Origin is a browser protection, not authentication: an API client can forge both Host and Origin and send taps, text or rotations. The plugin does not establish that caller's identity. All POST routes, including `/grant` and `/status`, require Origin; token-gated stream/screenshot GETs do not. The peer-address fence remains mandatory, so direct non-loopback clients are refused regardless of headers. An empty list keeps public authorities refused.

- **HMAC-SHA256 capabilities expiring within 10 minutes**, formatted `base64url(payload).base64url(mac)` and signed with a 32-byte per-DSH-home key (`<DSH_HOME>/cache/dsh-android/stream-access.key`, mode 0600, created atomically). A capability minted for one device stops working the moment another device takes the stream slot, and a screenshot capability cannot be replayed against the stream route.
- **The screenshot route serves exactly one directory.** Paths are walked with `lstat` (any symbolic link is refused), finished with a `realpath` containment check, opened with `O_NOFOLLOW`, size-bounded, and re-validated after the read — so a file swapped for a symlink between minting and fetching is never served.
- **`/grant` never boots anything.** It only starts the frame loop for a device that is already online, and it refuses (409 `device_busy`) to yank the stream away from another device. Switching devices requires the explicit `/switch-device` gesture; booting an AVD stays with the `android_boot` tool.
```

**依据 7 · 源码核查**：[src/adb.ts:185-195](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/adb.ts#L185-L195)

底层支持signal。

<details>
<summary>查看原文（11行）</summary>

```text
export interface ExecOptions {
  /** Target device serial (`adb -s <serial> …`). */
  serial?: string
  timeoutMs?: number
  maxBuffer?: number
  /**
   * Aborts the child and rejects with an `AbortError`-named error when fired.
   * Forwarded straight to `child_process.execFile`; callers that do not own a
   * signal simply omit it.
   */
  signal?: AbortSignal
```

</details>

**依据 8 · 源码核查**：[src/build-run.ts:176-207](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/build-run.ts#L176-L207)

Gradle取消真实存在。

<details>
<summary>查看原文（32行）</summary>

```text
  project: AndroidProject,
  args: readonly string[],
  signal: AbortSignal,
): Promise<{ exitCode: number | null; lines: string[] }> {
  const child: GradleChild = spawn(project.gradleCommand, [...args], {
    cwd: project.root,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const lines: string[] = []
  const collect = (chunk: Buffer): void => {
    for (const line of chunk.toString('utf8').split('\n')) {
      lines.push(line.trimEnd())
      if (lines.length > OUTPUT_TAIL_LINES) lines.shift()
    }
  }
  child.stdout.on('data', collect)
  child.stderr.on('data', collect)
  const onAbort = (): void => { child.kill('SIGKILL') }
  signal.addEventListener('abort', onAbort, { once: true })
  try {
    return await new Promise<{ exitCode: number | null; lines: string[] }>((resolveRun, rejectRun) => {
      child.once('error', error => rejectRun(new Error(
        `android_build_run: could not run ${project.gradleCommand}: ${errorMessage(error)}`
        + (project.gradleSource === 'path'
          ? ' — this project has no ./gradlew wrapper and no `gradle` was found on PATH; install Gradle or '
            + 'add the wrapper (gradle wrapper)'
          : ''),
      )))
      child.once('close', code => resolveRun({ exitCode: code, lines }))
    })
  } finally {
    signal.removeEventListener('abort', onAbort)
```

</details>

**依据 9 · 源码核查**：[src/build-run.ts:436-461](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/build-run.ts#L436-L461)

后续安装/启动未传signal。

<details>
<summary>查看原文（26行）</summary>

```text
  const { packageName, source } = resolveApplicationId(apk, project.root)
  try {
    const install = await toolchain.exec(['install', '-r', apk.path], {
      serial: device.serial,
      timeoutMs: INSTALL_TIMEOUT_MS,
    })
    const combined = `${install.stdout}\n${install.stderr}`
    // `adb install` exits 0 even when the device refuses the package, printing
    // `Failure [INSTALL_FAILED_…]` — treat that as the failure it is.
    const failure = /Failure \[([^\]]+)\]/u.exec(combined)
    if (failure !== null) {
      throw new Error(
        `the device refused the package (${failure[1]}) — an INSTALL_FAILED_UPDATE_INCOMPATIBLE or `
        + `SIGNATURE mismatch means an app with the same id is already installed from a different build; `
        + `uninstall it on the device first (adb -s ${device.serial} uninstall ${packageName})`,
      )
    }
  } catch (error) {
    throw new Error(`android_build_run: installing ${apk.path} on ${device.serial} failed: ${errorMessage(error)}`)
  }
  const relaunch = options.relaunch === true
  if (relaunch) {
    await toolchain.shell(device.serial, ['am', 'force-stop', packageName], { timeoutMs: LAUNCH_TIMEOUT_MS })
      .catch(() => undefined)
  }
  await launchPackage(toolchain, device.serial, packageName)
```

</details>

**依据 10 · 源码核查**：[src/android-host.ts:320-349](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/android-host.ts#L320-L349)

主机tap只有timeout。

<details>
<summary>查看原文（30行）</summary>

```text
  async tap(serial: string, x: number, y: number): Promise<void> {
    requireNormalized(x, y)
    const point = await this.#pixels(serial, x, y)
    await this.toolchain.shell(serial, ['input', 'tap', String(point.x), String(point.y)], { timeoutMs: CONTROL_TIMEOUT_MS })
  }

  /**
   * Tap at PIXEL coordinates of the input space — the same space a UI tree
   * reports its bounds in.
   *
   * This is the honest form of a tap that came from a tree node. A tree
   * coordinate is already an input coordinate (verified on hardware: tapping a
   * node's own pixel lands on it), so a caller that holds one should not
   * normalize it by one size and multiply it back by another. That round trip
   * is where the drift lived, and it needed BOTH halves to agree on the space:
   * `inputSpace()` rotates for rotation 1/3 while `#pixels` does not, so with
   * no stream running a landscape tree came back with its axes swapped and
   * `input tap` received a y past the bottom of the display. Sending the pixel
   * straight through has no second half to disagree with.
   *
   * It also drops a `wm size` call per tap and removes the race between two
   * reads of `latestFrame`.
   */
  async tapPixels(serial: string, x: number, y: number): Promise<void> {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new AdbError(`dsh-android: tapPixels needs finite pixels, got ${x}, ${y}`, [])
    }
    await this.toolchain.shell(serial, [
      'input', 'tap', String(Math.round(x)), String(Math.round(y)),
    ], { timeoutMs: CONTROL_TIMEOUT_MS })
```

</details>

#### 缺口

- 反代实际认证/Host批准、恶意UI/取消后的最终设备状态未验。
  **影响**：不能用于生产账号无人值守或多租户控制。
  **进一步探讨**：隔离模拟器核路由拒绝和取消后安装/前台/业务状态，再按Host权限审工具。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖和退出是否只是关侧栏？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要Node>=24.11及匹配DSH工具/Web服务，adb与授权USB设备或SDK/AVD，Gradle/JDK/SDK是构建必需；非ASCII文本依ADBKeyboard而非静默降错字。OCR后端/模型附件是可选路径，缺失不能推成没有所有工具；本轮未核各OS OCR后端/Android版本兼容，文档实测帧率是作者单设备记录不是本轮性能。

首次SDK/AVD/USB授权和独立账号/项目准备，持续screencap PNG、浏览器/设备/编译CPU内存、截图/附件/日志存储及模型token；费用/时延未知。Gradle项目执行其自身脚本，projectPath resolve/climb不等Host工作区sandbox；只对可信项目和测试设备采用。失败核APK/install/前台/数据，不按错误提示直接卸载真实app清数据。rotate会关闭自动旋转并写user_rotation，关侧栏不恢复；停插件清工具/loop不撤销安装、输入、业务或设置。退出需核在途、导出调试证据、恢复测试快照/旋转并授权清截图/附件，不能把shutdown当通用真机关机。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:21-34](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/package.json#L21-L34)

Node/host-client入口。

<details>
<summary>查看原文（14行）</summary>

```text
  "engines": {
    "node": ">=24.11.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
```

</details>

**依据 2 · 源码核查**：[src/android-host.ts:384-408](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/android-host.ts#L384-L408)

输入依赖/持久旋转设置。

<details>
<summary>查看原文（25行）</summary>

```text
  async type(serial: string, text: string): Promise<void> {
    if (typeof text !== 'string' || text === '') throw new TypeError('dsh-android: type requires a non-empty text')
    if (isInputTextSafe(text)) {
      await this.toolchain.shell(serial, ['input', 'text', escapeInputText(text)], { timeoutMs: CONTROL_TIMEOUT_MS })
      return
    }
    const imes = await this.toolchain.shell(serial, ['ime', 'list', '-s'], { timeoutMs: CONTROL_TIMEOUT_MS }).catch(() => '')
    if (!imes.includes('com.android.adbkeyboard')) {
      throw new AdbError(`dsh-android: ${NON_ASCII_TYPE_HINT}`, [])
    }
    // ADBKeyboard base64 mode survives quoting for every unicode payload.
    const encoded = Buffer.from(text, 'utf8').toString('base64')
    await this.toolchain.shell(serial, [
      'am', 'broadcast', '-a', 'ADB_INPUT_B64', '--es', 'msg', encoded,
    ], { timeoutMs: CONTROL_TIMEOUT_MS })
  }

  /** Force the display rotation (Surface.ROTATION_0..3). */
  async rotate(serial: string, rotation: number): Promise<void> {
    if (!ROTATION_CYCLE.some(known => known === rotation)) {
      throw new RangeError('dsh-android: rotation must be 0, 1, 2 or 3')
    }
    // Auto-rotate would fight the explicit value; pin it first.
    await this.toolchain.shell(serial, ['settings', 'put', 'system', 'accelerometer_rotation', '0'], { timeoutMs: CONTROL_TIMEOUT_MS })
    await this.toolchain.shell(serial, ['settings', 'put', 'system', 'user_rotation', String(rotation)], { timeoutMs: CONTROL_TIMEOUT_MS })
```

</details>

**依据 3 · 源码核查**：[src/build-run.ts:116-130](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/build-run.ts#L116-L130)

项目resolve/上查root。

<details>
<summary>查看原文（15行）</summary>

```text
export function detectProject(projectPath: string): AndroidProject {
  const absolute = resolve(projectPath)
  if (!isDirectory(absolute)) {
    throw new Error(
      `android_build_run: projectPath is not a directory: ${projectPath} — pass the Android project root `
      + '(the directory containing settings.gradle or settings.gradle.kts)',
    )
  }
  // Climb to the Gradle root: `settings.gradle[.kts]` is what defines one.
  let current = absolute
  for (;;) {
    const settings = firstExisting(current, SETTINGS_FILES)
    if (settings !== undefined) return { ...gradleCommandFor(current), root: current, buildFile: settings }
    const parent = dirname(current)
    if (parent === current) break
```

</details>

**依据 4 · 源码核查**：[src/frame-source.ts:175-185](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/frame-source.ts#L175-L185)

帧进程退出。

<details>
<summary>查看原文（11行）</summary>

```text
  /** Kill the child; the loop object can be started again later. */
  stop(): void {
    this.#stopped = true
    const child = this.#child
    this.#child = undefined
    if (child !== undefined && child.exitCode === null && child.signalCode === null) {
      child.kill('SIGTERM')
      const hardKill = setTimeout(() => {
        if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL')
      }, 2_000)
      hardKill.unref?.()
```

</details>

**依据 5 · 源码核查**：[src/index.ts:326-329](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/index.ts#L326-L329)

插件清理。

```text
  return async () => {
    for (const dispose of disposers.reverse()) await dispose()
    await host.dispose()
  }
```

**依据 6 · 源码核查**：[README.md:54-61](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/README.md#L54-L61)

shutdown/构建作者说明。

```text
| `android_devices` | List every device `adb devices -l` reports (serial, state, emulator/physical, model, Android version, API level, AVD name) plus the machine's AVD names under `avds`. Use it to discover the serial the other tools take. A failed enumeration throws instead of returning an empty list. | — |
| `android_boot` | Start the live stream. Pass an ONLINE serial to stream it immediately, or an AVD name to launch that emulator first and stream it once it finishes booting (minutes on a cold start). The stream stays alive for the conversation so the panel can show the device live. | `device` (required — a serial or an AVD name) |
| `android_shutdown` | Shut an emulator down (`adb emu kill`) and stop the stream when it targets that device. A physical device is refused with the reason: adb cannot power off a phone. | `device` |
| `android_screenshot` | Capture a PNG and return a small JSON summary (path, bytes, dimensions, device); the image renders in the card and the panel, never as an image block. | `device` (optional — streamed device, else the only online one) |
| `android_interact` | Interact with the streamed device: tap at normalized 0..1 coordinates, type text, press a navigation or hardware button (`back`, `home`, `recents`, `power`, `volume_up`, `volume_down`, `menu`, `enter`, `delete`), send a swipe gesture, or scroll. After the action settles (~300 ms) a fresh screenshot shows the effect. | `action` (required — `tap`/`type`/`button`/`gesture`/`scroll`), `x`/`y`, `text`, `name`, `json`, `device` |
| `android_list_apps` | List the packages installed on the device (`pm list packages`), with the version name from `dumpsys package` and a human label when one is resolvable — a third-party package name cannot be guessed, so list it or pass `name` to `android_launch_app`. | `device`, `query` (case-insensitive substring, CJK included), `include_system` (default false) |
| `android_launch_app` | Launch an installed app by `packageName`, or by `name` (a case-insensitive label substring resolved through the same listing). Exactly one of the two. `relaunch` force-stops the app first. | `packageName` or `name` (exactly one), `device`, `relaunch` |
| `android_build_run` | Build a Gradle project (`./gradlew assembleDebug`), install the resulting debug APK (`adb install -r`), and launch it. Takes minutes for a full build; on failure the result carries the tail of the Gradle error output. | `projectPath` (required), `device` |
```

#### 缺口

- 全套OS/SDK/OCR、资源及设备恢复未知。
  **影响**：总成本可能超过窗口整合收益。
  **进一步探讨**：可丢弃AVD+可信样例项目测完整构建/动作/恢复，核文件与设置。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 值得怎样试，新的收据要解决什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议可信本地Host、可恢复AVD/测试机、无敏感账号的副本试用，显式serial并人工确认包/画面/动作后果；共享/公开代理、真实付款/发帖等另需具体授权与结果核对。多设备/来源不清或取消状态不明时停动作，查设备最终状态，回adb/Android Studio和模拟器快照；不把数值verified当业务授权。

可探索设备-屏幕状态收据：绑定serial、foreground package、帧/树采样时点、选择目标与最终业务核查状态，并分清动作发送/观察匹配/持久提交。现有serial证明、fresh dump、HMAC、expectation和row移动检测是基线，增量是跨这些观察的一致身份/时序与明确UNKNOWN，而非再加截图。用两session切槽、动画重排/同文本、安装后取消和延迟业务提交样例，与当前工具/原生adb对照错设备/错控件、误信完成和人工恢复时间。若现有结果足够或新收据仍无法关联业务且加大隐私/耗时，就否定；未实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/android-host.ts:455-490](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/android-host.ts#L455-L490)

已有serial证明作基线。

<details>
<summary>查看原文（36行）</summary>

```text
  async resolveTarget(serial?: string): Promise<AndroidDevice> {
    const loop = this.#loop
    const proof = this.#streamDevice
    const frame = loop?.latestFrame
    const age = frame === undefined ? Infinity : Date.now() - frame.at
    if (!this.#disposed && serial !== undefined && serial !== ''
      && loop?.running === true && loop.serial === serial
      && proof?.loop === loop && age >= 0 && age <= STREAM_DEVICE_PROOF_MAX_AGE_MS) {
      // This exact stream was started after a real online-device query and
      // is still receiving frames. Return a copy so callers cannot mutate
      // the retained descriptor. Unnamed, different, stale or dead streams
      // continue through the real adb query below.
      return { ...proof.device }
    }
    const online = await this.toolchain.onlineDevices()
    if (serial !== undefined && serial !== '') {
      const match = online.find(device => device.serial === serial)
      if (match === undefined) {
        const all = await this.toolchain.listDevices()
        const known = all.find(device => device.serial === serial)
        if (known !== undefined) {
          throw new AdbError(
            `dsh-android: device ${serial} is ${known.state}${known.state === 'unauthorized' ? ' — accept the USB debugging prompt on the device' : ''}`,
            [],
          )
        }
        throw new AdbError(`dsh-android: no connected device has the serial ${serial} (run android_devices)`, [])
      }
      return match
    }
    const streamed = this.streamedSerial
    if (streamed !== undefined) {
      const match = online.find(device => device.serial === streamed)
      if (match !== undefined) return match
    }
    if (online.length === 1) return online[0]!
```

</details>

**依据 2 · 源码核查**：[src/tool-uitree.ts:810-853](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/tool-uitree.ts#L810-L853)

fresh tree与expectation。

<details>
<summary>查看原文（44行）</summary>

```text
      const device = await host.resolveTarget(args.serial)
      let roots: UiTreeNode[]
      try {
        // No rotation is read any more: the tap no longer normalizes, so there
        // is no axis to swap. `screen` below is only a zero-size guard.
        roots = (await readUiTree(host.toolchain, device.serial)).roots
      } catch (error) {
        throw new Error(`android_tap_element: ${errorMessage(error)}`)
      }
      const { node } = resolveTapTarget(roots, { identifier: args.identifier, label: args.label }, {
        allowOffscreen: args.allow_offscreen === true,
        tool: 'android_tap_element',
      })
      const screen = screenBoundsOf(roots)
      if (screen.width <= 0 || screen.height <= 0) {
        throw new Error(
          'android_tap_element: the dump reported a zero-size display, so a tap cannot be placed — '
          + 're-run android_ui_tree once the screen is on and settled',
        )
      }
      const center = boundsCenter(node.bounds)
      // Send the node's own pixel straight to `input tap`.
      //
      // A tree coordinate IS an input coordinate, so normalize-and-multiply-
      // back is a round trip that can only lose. It used to lose exactly the
      // system-bar inset: the dump reports the APP frame (2560x1500) while
      // `input` addresses the FULL display (2560x1536), so a target at y=1472
      // normalized to 0.9813 and tapped at 1507 — past the app frame, inside
      // the gesture strip, swallowed. Keeping both halves on the same space
      // fixed that, but it needed `#pixels` to rotate as well, which it did
      // not; with no stream running a landscape tree reached it with swapped
      // axes. A pixel has no second half to disagree with.
      const tap = { x: round4(center.x), y: round4(center.y) }
      try {
        await host.tapPixels(device.serial, tap.x, tap.y)
      } catch (error) {
        throw new Error(`android_tap_element: the tap at (${center.x}, ${center.y}) px failed: ${errorMessage(error)}`)
      }
      await sleep(TAP_SETTLE_MS)
      const screenshot = await captureScreenshot('android_tap_element', screenshots, host, device,
        vision === undefined ? undefined : { services: vision, exec })
      const expected = expectation === undefined
        ? undefined
        : await runTapExpectation('android_tap_element', screenshots, host, device, expectation.text, expectation.mode, exec.signal)
```

</details>

**依据 3 · 源码核查**：[src/tool-list-rows.ts:401-436](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/tool-list-rows.ts#L401-L436)

已有计数保护。

<details>
<summary>查看原文（36行）</summary>

```text
      const device = await host.resolveTarget(args.serial)
      const sample = await readRows('android_tap_row', device.serial)
      const plan = planRowTap(sample.rows, args.row, fractionX, fractionY, sample.screen)
      // The probe-guard runs BEFORE the tap: an unverifiable expectation is a
      // refusal, not a "tap and see".
      if (expectation !== undefined) requireCountKey(plan.row, expectation.key)
      if (sample.screen.width <= 0 || sample.screen.height <= 0) {
        throw new Error(
          'android_tap_row: the dump reported a zero-size display, so a tap cannot be placed — re-run '
          + 'android_ui_rows once the screen is on and settled',
        )
      }
      // A row-relative position is already computed in tree pixels, and a tree
      // pixel IS an input pixel — so it goes straight through, for the reasons
      // spelled out on AndroidToolHost.tapPixels.
      const tap = { x: round4(plan.tap.x), y: round4(plan.tap.y) }
      try {
        await host.tapPixels(device.serial, tap.x, tap.y)
      } catch (error) {
        throw new Error(`android_tap_row: the tap at (${plan.tap.x}, ${plan.tap.y}) px failed: ${errorMessage(error)}`)
      }

      let countCheck: CountCheckResult | undefined
      if (expectation !== undefined) {
        await sleep(TAP_VERIFY_SETTLE_MS)
        const after = await readRows('android_tap_row', device.serial)
        const afterRow = after.rows.find(row => row.index === plan.row.index)
        countCheck = afterRow === undefined
          ? {
              key: expectation.key,
              delta: expectation.delta,
              verified: false,
              changed: false,
              reason: 'the re-read hierarchy no longer contains the row (the screen changed)',
            }
          : verifyCountChange(plan.row, afterRow, expectation.key, expectation.delta)
```

</details>

**依据 4 · 源码核查**：[src/build-run.ts:436-472](https://github.com/ZSeven-W/dsh-android/blob/3363a85b1bbeefe994d42d52bd8e792c1527e9ec/src/build-run.ts#L436-L472)

动作/业务结果分层动机。

<details>
<summary>查看原文（37行）</summary>

```text
  const { packageName, source } = resolveApplicationId(apk, project.root)
  try {
    const install = await toolchain.exec(['install', '-r', apk.path], {
      serial: device.serial,
      timeoutMs: INSTALL_TIMEOUT_MS,
    })
    const combined = `${install.stdout}\n${install.stderr}`
    // `adb install` exits 0 even when the device refuses the package, printing
    // `Failure [INSTALL_FAILED_…]` — treat that as the failure it is.
    const failure = /Failure \[([^\]]+)\]/u.exec(combined)
    if (failure !== null) {
      throw new Error(
        `the device refused the package (${failure[1]}) — an INSTALL_FAILED_UPDATE_INCOMPATIBLE or `
        + `SIGNATURE mismatch means an app with the same id is already installed from a different build; `
        + `uninstall it on the device first (adb -s ${device.serial} uninstall ${packageName})`,
      )
    }
  } catch (error) {
    throw new Error(`android_build_run: installing ${apk.path} on ${device.serial} failed: ${errorMessage(error)}`)
  }
  const relaunch = options.relaunch === true
  if (relaunch) {
    await toolchain.shell(device.serial, ['am', 'force-stop', packageName], { timeoutMs: LAUNCH_TIMEOUT_MS })
      .catch(() => undefined)
  }
  await launchPackage(toolchain, device.serial, packageName)
  return {
    device: deviceSummary,
    state: 'launched',
    packageName,
    apkPath: apk.path,
    projectPath: project.root,
    task,
    variant,
    packageSource: source,
    ...(relaunch ? { relaunched: true as boolean } : {}),
  }
```

</details>

#### 缺口

- 一致设备状态收据未实现/用户对照。
  **影响**：不能计为已提高安全或自动验收。
  **进一步探讨**：先用当前结果+人工确认作基线，测最小额外身份/时序字段。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
