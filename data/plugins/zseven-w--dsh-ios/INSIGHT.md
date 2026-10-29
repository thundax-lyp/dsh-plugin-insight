# DSH iOS

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d9a9731](https://github.com/ZSeven-W/dsh-ios/tree/d9a9731ccd73b38858fcfbf2f35d7120a861654c)

<!-- BEGIN META -->
[![GitHub ★ 349](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=349&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-ios) [![npm 30d 1,695](https://img.shields.io/static/v1?label=npm+30d&message=1%2C695&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-ios) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-ios)
<!-- END META -->

> **功能**：在 macOS/Xcode 侧为 DSH 提供模拟器与 USB 测试 iPhone 的构建、观察和输入工具，并在会话中显示可交互实时画面。

> **亮点**：设备开发/观看链与fresh树+可比较计数验证，入口有MAC期限与loopback来源围栏，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：局部标签计数非业务成功，真机输入/构建有副作用且runner不因关面板停，未实测兼容/拒绝/恢复，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 是iPhone客户端还是macOS开发插件，实际执行链在哪里？](#detail-section-11)
  - [Q02 · 界面与路由有什么防线，动作验证能证明什么？](#detail-section-12)
  - [Q03 · 如何渐进采用并算清真机恢复成本？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：iOS开发者在Agent会话里构建/观察/操作自有测试App，用户可看和接管；非iPhone上的DSH客户端，见 [Q01](#research-q01)。

Xcode/simctl/WDA手工构建操作与单独截图/测试。当前集成Agent工具和观看，仍需业务断言/签名和设备管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模拟器/真机 | 开发/观察/输入 | macOS/Xcode，真机另签名USB |
| 实时面板 | 用户查看/操作 | 来源/token，非业务验收 |
| 行点击 | fresh树+可选计数检查 | 无expect明确未验证 |
| runner | WDA与本地转发 | 关面板不退出，需stop |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| macOS/完整Xcode/runtime | 必需 | 模拟器/构建 | 非macOS注册也不能操作 |
| DSH/Node>=24.11/serve-sim | 必需 | 工具与流 | Host/界面兼容另验 |
| AXe | 部分UI工具 | 模拟器树/点击 | 下载/版本与权限需核 |
| USB/信任/解锁/签名/WDA/iproxy | 真机必需 | 设备runner/转发 | 独立复杂恢复成本 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 自有测试项目/模拟器 | 核工具/版本/权限 |
| 观察 | 指定设备/树/实时流 | 核当前udid/前台App |
| 动作 | fresh定位并点击/构建 | 局部与业务断言分开 |
| 异常 | USB/锁屏/超时先查 | 不盲重复动作 |
| 退出 | stop/dispose/核进程 | 关面板非真机runner停 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Xcode/runtime/设备未知 | 签名/依赖/Host设置 | 未实际安装 |
| 持续使用 | 构建/流CPU内存/token未知 | USB解锁/项目/版本维护 | 无净节时对照 |
| 失败恢复 | 重建/设备状态未知 | 查runner/转发/动作后置 | 不盲抹设备 |
| 退出 | 缓存/App/runner未知 | 显式停并核资料/进程 | 卡片关闭非退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 开发集成 | 工具/WDA/Client接线 | 本机兼容/开发节时 |
| 输入验证 | fresh树/行可比/计数 | 正确业务对象/持久成功 |
| 数据围栏 | MAC/期限/来源 | 全程权限/设备隔离 |

> **思考**：局部标签计数非业务成功，真机输入/构建有副作用且runner不因关面板停，未实测兼容/拒绝/恢复，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：设备开发/观看链与fresh树+可比较计数验证，入口有MAC期限与loopback来源围栏，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) fresh定位与显式未验证、token期限/来源可借鉴；局部UI结果与业务验收分层。

<a id="detail-section-5"></a>

### 1.4 主要限制

局部标签计数非业务成功，真机输入/构建有副作用且runner不因关面板停，未实测兼容/拒绝/恢复，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

自有小App模拟器先测，真机独立授权/签名/恢复，失败核状态，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定原生工具/Client与WDA/局部验证链已核，建议自有测试App模拟器先有限试用，真机另验授权与恢复。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、src/client/index.tsx、src/index.ts、src/list-rows.ts、src/stream-routes.ts、src/tool-list-rows.ts、src/wda-host.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料身份/固定revision/作者摘要一致，catalog无旧研究。核package、Host/Client实际卡/dock、WDA进程、流token/来源、代表tap_row和count verification。未全审全部debug/build/输入/预览/sandbox或WDA供应链，不执行macOS设备/目标。
- 下一步：无Xcode/设备/DSH运行；测试App做路由过期/拒绝、行变化/重排、USB断开/锁屏/超时与停止矩阵，对照Xcode真实业务断言。

**分析版本**

- **仓库**：[ZSeven-W/dsh-ios](https://github.com/ZSeven-W/dsh-ios)
- **版本号**：0.1.0-rc.10（[固定提交 d9a9731](https://github.com/ZSeven-W/dsh-ios/tree/d9a9731ccd73b38858fcfbf2f35d7120a861654c)）
- **版本日期**：2026-09-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

设备/目标/构建身份与业务断言绑定，显示不确定执行并测误报/恢复成本，未实现，见 [Q03](#research-q03)。

无Xcode/设备/DSH运行；测试App做路由过期/拒绝、行变化/重排、USB断开/锁屏/超时与停止矩阵，对照Xcode真实业务断言。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 3622 | — | — | 86903 |
| .mjs | source | 30 | 20266 | 17502 | 2060 | — |
| .ts | source | 50 | 29791 | 22065 | 6032 | — |
| .tsx | source | 14 | 5940 | 4456 | 1269 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/ZSeven-W/dsh-ios/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话设备工具与实时画面能否支持可核iOS开发，局部UI验证和真机副作用在哪里分界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 是iPhone客户端还是macOS开发插件，实际执行链在哪里？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定@zseven-w/dsh-ios0.1.0-rc.10是DSH原生工具/Client插件，在macOS+完整Xcode上操作模拟器或USB测试iPhone，不是在iOS运行DSH。Host apply构造SimHostController与WdaController、注册模拟器/UI/OCR/行/调试等工具，挂可选Web路由；Client注册真实工具卡与input dock，连接常驻模拟器面板。相对手用simctl/WDA+独立截图，它把Agent开发操作和用户看/点设备放入会话。

真机路径不是概念图：#spawnRunner调用xcodebuild test形成独立进程组，#spawnTunnel启iproxy将设备端口转本地；需要设备解锁/信任、开发签名和USB。模拟器需simctl/runtime，AXe承担部分UI输入，serve-sim推流，Node要求>=24.11。注册成功/看到画面不证明App构建或功能测试成功，非macOS工具存在也不代表能操作设备。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-4](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/package.json#L2-L4)

固定包版本。

```text
  "name": "@zseven-w/dsh-ios",
  "version": "0.1.0-rc.10",
  "description": "DeepSeek Harness plugin for the iOS Simulator — build, run, and interact with a live simulator stream inside a conversation. Tested with DSH 0.1.5-rc.1.",
```

**依据 2 · 源码核查**：[package.json:21-23](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/package.json#L21-L23)

Node24.11。

```text
  "engines": {
    "node": ">=24.11.0"
  },
```

**依据 3 · 源码核查**：[src/index.ts:350-367](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/index.ts#L350-L367)

Host实际controller与各工具构造。

<details>
<summary>查看原文（18行）</summary>

```text
export function apply(ctx: Context): () => Promise<void> {
  const hostCtx = ctx as HostContext
  const host = new SimHostController()
  // Real-device host (WebDriverAgent over USB): constructed up front so its
  // keep-alive can hold a runner alive; routes/panel land in the next phase.
  // Idle reaping is DISABLED for the real device on purpose. The generic
  // 5-minute default fits a simulator stream, where a restart costs seconds;
  // on a phone the runner is an `xcodebuild … test` build that costs MINUTES
  // and needs the device unlocked, so reaping it the moment the panel stops
  // streaming turns every later screenshot/tap into a multi-minute rebuild —
  // observed in testing as "WDA keeps dying". The runner is still reaped by
  // an explicit stop, by plugin disposal, and by the phone going away.
  const wda = new WdaController({ idleTimeoutMs: 0 })
  const tools = createSimTools(host, { wda, onFrontmostAppChanged: invalidateWdaTreeDepthMemory })
  const uiTools = createSimUiTools(host, { wda })
  const rowTools = createSimRowTools(host, { wda })
  const ocrTools = createSimOcrTools(host, { wda })
  const previewTools = createSimPreviewTools(host, { logger: line => ctx.logger.info(line) })
```

</details>

**依据 4 · 源码核查**：[src/index.ts:431-442](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/index.ts#L431-L442)

调试注册/可选Web路由。

<details>
<summary>查看原文（12行）</summary>

```text
  const debugTools = createSimDebugTools(host)
  disposers.push(ctx.effect(() => {
    hostCtx.tools.register(debugTools.iosSimProcesses)
    hostCtx.tools.register(debugTools.iosSimBacktrace)
    hostCtx.tools.register(debugTools.iosSimLeaks)
    hostCtx.tools.register(debugTools.iosSimAppInfo)
    return () => debugTools.dispose()
  }, 'dsh-ios:debug-tools'))

  // Signed web routes (stream, screenshot, ws control, grant): mounted on the
  // optional webServer service; headless profiles skip them entirely.
  installStreamRoutes(ctx, host, wda)
```

</details>

**依据 5 · 源码核查**：[src/client/index.tsx:389-401](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/client/index.tsx#L389-L401)

真实卡与dock注册。

<details>
<summary>查看原文（13行）</summary>

```text
  registerCard(ctx, IOS_SIM_CARD_TOOLS.boot, SimStreamCard, autoOpenSource)
  registerCard(ctx, IOS_SIM_CARD_TOOLS.screenshot, SimScreenshotCard)
  registerCard(ctx, IOS_SIM_CARD_TOOLS.interact, SimScreenshotCard)
  registerCard(ctx, IOS_SIM_CARD_TOOLS.buildRun, SimBuildRunCard)
  registerCard(ctx, IOS_SIM_CARD_TOOLS.realStart, SimRealStartCard, autoOpenSource)

  // Stream-status capsule in the composer input dock (openpencil's
  // selection-chip seat, same `ctx.slots.inject` guard and entry shape):
  // a small pill above the input box while a stream is online and the panel
  // is closed. Clicking it opens the panel for the streamed device.
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register(
    { name: 'conversation.input.dock', id: 'dsh-ios-status', order: 40 },
    hostSyncedStatusCapsule(ctx),
```

</details>

**依据 6 · 源码核查**：[src/wda-host.ts:1904-1919](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/wda-host.ts#L1904-L1919)

真实xcodebuild runner。

<details>
<summary>查看原文（16行）</summary>

```text
  async #spawnRunner(device: RealDevice, hardwareUdid: string): Promise<void> {
    this.#lockedSignatureSeen = false
    const teamId = await this.#resolveTeamId()
    const args = assembleXcodebuildTestArgs(hardwareUdid, { teamId, bundleId: this.#options.bundleId })
    const child = spawn(this.tooling.xcodebuildCommand!, [...this.tooling.xcodebuildPrefix, ...args], {
      cwd: this.#options.wdaProjectDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      // Group leader so stop() reaps the whole xcodebuild process tree.
      detached: true,
    })
    this.#runner = { child, hardwareUdid }
    this.#noteStderr(`xcodebuild ${args.join(' ')} (pid ${child.pid ?? '?'})`)
    child.stderr.on('data', (chunk: Buffer) => {
      this.#recordStderr(chunk, 'wda')
      // The locked-device signature is surfaced as an actionable status while
      // the launch keeps waiting — it recovers by itself once unlocked.
```

</details>

**依据 7 · 源码核查**：[src/wda-host.ts:1989-2001](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/wda-host.ts#L1989-L2001)

真实USB转发进程。

<details>
<summary>查看原文（13行）</summary>

```text
    }
    const child = spawn(this.tooling.iproxyCommand!, assembleIproxyArgs(picked.port, devicePort, udid), {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    })
    this.#noteStderr(`iproxy ${picked.port} ${devicePort} ${udid} (pid ${child.pid ?? '?'})`)
    child.stderr.on('data', (chunk: Buffer) => this.#recordStderr(chunk, `iproxy(${picked.port})`))
    child.once('error', error => {
      this.#noteStderr(`iproxy ${picked.port} failed: ${errorMessage(error)}`)
    })
    return { child, localPort: picked.port, devicePort, udid, adopted: false }
  }

```

</details>

**依据 8 · 作者声明**：[README.zh.md:125-132](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/README.zh.md#L125-L132)

作者环境/AXe/serve-sim前提。

```text
## 环境要求

- **macOS + 完整版 Xcode**——仅装 Command Line Tools 不够。`xcodebuild`、`xcrun simctl` 和模拟器运行时都随 Xcode 提供。
- **Xcode 中至少安装一个 iOS 模拟器运行时**。
- **DSH ≥ 0.1.0-rc.6 且使用 Web 版**，才能显示面板。无头（headless）配置下插件同样可用：22 个工具照常工作，只是没有实时画面。
- **非 macOS 主机**：插件依然能加载，22 个工具也会注册，但每次调用都会返回明确的错误信息（`iOS Simulator requires macOS with Xcode …`）。
- **serve-sim** 作为本插件的 npm 依赖随包安装，正式安装时会从本地解析；开发目录则回退到 `npx -y serve-sim`（首次使用需要联网）。
- **AXe**（可选——只有基于 AXe 的工具需要：`ios_sim_ui_tree` / `ios_sim_tap_element`，以及模拟器上的 `ios_sim_ui_rows` / `ios_sim_tap_row`）：`brew install cameroncooke/axe/axe`，或让插件自动下载固定版本（v1.8.0，校验 SHA-256）到 `~/Library/Caches/dsh-ios/bin`。`DSHPLUGIN_IOS_AXE_BIN` 可覆盖解析结果；`DSHPLUGIN_IOS_AXE_OFFLINE=1` 可禁用下载。
```

#### 缺口

- 未独立运行macOS/Xcode/DSH或真机，签名与设备兼容未知。
  **影响**：只能确认macOS开发插件代码接线，不能保证本机可装、签名/USB可用或App任务完成。
  **进一步探讨**：自有测试项目先模拟器核启动/构建/动作，再在明确授权测试iPhone核USB/信任/签名和停止。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 界面与路由有什么防线，动作验证能证明什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

画面能力按udid/kind/exp签token，verify核MAC、结构和到期/最长TTL；路由另核peer loopback、Host及Origin/FetchMetadata，mutation需Origin。它们是源码支持的数据/操作入口围栏，不应扩张成多用户隔离、设备上任意业务安全或全程授权审计。Agent与面板输入会改变模拟器/真机，WDA/xcodebuild与被构建项目有真实本机/设备副作用。

代表tap_row先解析用户比例、fresh树定位与计数key，再WDA或AXe点击；无expect_count仍执行但明确没验证。有expect_count会新树复读，verifyCountChange先要求行仍可比较再验指定key恰好delta，缺键/位移返回未证，不能误称只看工具成功。它仍是标签/几何/计数的局部证据，不证明点击对应正确业务对象、数据已持久或所有App UI语义可靠。网络/USB超时后动作可能已发生，业务层应先重观察再决定重复。

#### 证据与依据

**依据 1 · 源码核查**：[src/stream-routes.ts:318-342](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/stream-routes.ts#L318-L342)

token绑定设备/kind/exp。

<details>
<summary>查看原文（25行）</summary>

```text
  async signStreamToken(udid: string, options: { ttlMs?: number } = {}): Promise<{ token: string; expiresAt: number }> {
    if (!UDID_PATTERN.test(udid)) throw new TypeError('dsh-ios: signStreamToken requires a simulator udid')
    return this.#sign({ v: 1, kind: 'sim-stream', udid, exp: Date.now() + this.#ttl(options.ttlMs) })
  }

  /** Mint a real-device MJPEG capability for one physical device. */
  async signRealStreamToken(udid: string, options: { ttlMs?: number } = {}): Promise<{ token: string; expiresAt: number }> {
    if (!UDID_PATTERN.test(udid)) throw new TypeError('dsh-ios: signRealStreamToken requires a real-device udid')
    return this.#sign({ v: 1, kind: 'sim-real-stream', udid, exp: Date.now() + this.#ttl(options.ttlMs) })
  }

  /** Mint a screenshot capability for one absolute path in the cache dir. */
  async signScreenshotToken(path: string, options: { ttlMs?: number } = {}): Promise<{ token: string; expiresAt: number }> {
    if (!isAbsolute(path)) throw new TypeError('dsh-ios: signScreenshotToken requires an absolute path')
    return this.#sign({ v: 1, kind: 'sim-screenshot', path, exp: Date.now() + this.#ttl(options.ttlMs) })
  }

  /** Verify and decode one stream capability without touching the filesystem. */
  verifyStreamToken(token: string): Promise<StreamTokenPayload | undefined> {
    return this.#verify(token, parseStreamPayload)
  }

  /** Verify and decode one real-device stream capability (no filesystem). */
  verifyRealStreamToken(token: string): Promise<RealStreamTokenPayload | undefined> {
    return this.#verify(token, parseRealStreamPayload)
```

</details>

**依据 2 · 源码核查**：[src/stream-routes.ts:368-389](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/stream-routes.ts#L368-L389)

MAC/结构/到期和最大期限检查。

<details>
<summary>查看原文（22行）</summary>

```text
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
    } catch {
      return undefined
```

</details>

**依据 3 · 源码核查**：[src/stream-routes.ts:438-467](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/stream-routes.ts#L438-L467)

peer/Host/Origin/FetchMetadata围栏。

<details>
<summary>查看原文（30行）</summary>

```text
/** Reject remote peers and DNS-rebinding Host headers before serving data. */
function isLoopbackRequest(req: IncomingMessage): boolean {
  if (!isLoopbackRemoteAddress(req.socket?.remoteAddress)) return false
  const authority = requestAuthority(req)
  return authority !== undefined && isLoopbackHostname(authority.hostname)
}

/** Apply Fetch-Metadata/Origin checks; mutations require an Origin. */
function isTrustedBrowserRequest(req: IncomingMessage, requireOrigin: boolean): boolean {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = req.headers.origin
  if (origin === undefined) return !requireOrigin
  if (typeof origin !== 'string') return false
  const authority = requestAuthority(req)
  if (authority === undefined) return false
  try {
    const parsed = new URL(origin)
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:')
      && parsed.host === authority.host
  } catch {
    return false
  }
}

/**
 * The transport fence applied to every dsh-ios route (mirrors dsh-noema's
 * status route: loopback peer + loopback Host, plus Fetch-Metadata/Origin).
 */
function isTrustedRequest(req: IncomingMessage, requireOrigin: boolean): boolean {
  return isLoopbackRequest(req) && isTrustedBrowserRequest(req, requireOrigin)
```

</details>

**依据 4 · 源码核查**：[src/tool-list-rows.ts:529-555](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/tool-list-rows.ts#L529-L555)

fresh树/计数key和真实WDA/AXe点击。

<details>
<summary>查看原文（27行）</summary>

```text
            key: (args.expect_count.key ?? '').trim(),
            delta: sanitizeCountDelta(args.expect_count.delta ?? 0),
          }
      if (expectation !== undefined && expectation.key === '') {
        throw new Error('ios_sim_tap_row: expect_count.key is required (the counter key exactly as ios_sim_ui_rows listed it)')
      }
      const target = await resolveToolTarget(host, wda, realDevices, args.udid, exec.signal)
      const sample = await readTreeForTarget('ios_sim_tap_row', target, wda, args.max_depth, exec.signal)
      const beforeRows = detectListRows(sample.roots, { bounds: sample.size }).rows
      const plan = planRowTap(beforeRows, args.row, fractionX, fractionY, sample.size)
      const beforeValue = expectation === undefined ? undefined : requireCountKey(plan.row, expectation.key)

      // Tap the FRESH frame — the row was just re-located in the current tree.
      if (target.kind === 'real') {
        try {
          await wda!.control.tap(plan.tap.x, plan.tap.y)
        } catch (error) {
          throw new Error(`ios_sim_tap_row: WebDriverAgent tap at (${plan.tap.x}, ${plan.tap.y}) failed: ${errorMessage(error)}`)
        }
      } else {
        const binary = await requireAxeBinary('ios_sim_tap_row')
        try {
          await execAxe(binary, ['tap', '-x', String(plan.tap.x), '-y', String(plan.tap.y), '--udid', target.device.udid], 60_000, exec.signal)
        } catch (error) {
          throw new Error(`ios_sim_tap_row: AXe tap at (${plan.tap.x}, ${plan.tap.y}) failed: ${errorMessage(error)}`)
        }
      }
```

</details>

**依据 5 · 源码核查**：[src/tool-list-rows.ts:557-586](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/tool-list-rows.ts#L557-L586)

点击后复读与未给expect_count明确未验证。

<details>
<summary>查看原文（30行）</summary>

```text
      let countCheck: CountCheckResult | undefined
      if (expectation !== undefined) {
        await sleep(TAP_VERIFY_SETTLE_MS)
        const afterSample = await readTreeForTarget('ios_sim_tap_row', target, wda, args.max_depth, exec.signal)
        const afterRows = detectListRows(afterSample.roots, { bounds: afterSample.size }).rows
        const afterRow = afterRows.find(row => row.index === plan.row.index)
        countCheck = afterRow === undefined
          ? {
              key: expectation.key,
              delta: expectation.delta,
              before: beforeValue,
              verified: false,
              changed: false,
              reason: 'the re-read tree no longer contains the row (the screen changed)',
            }
          : verifyCountChange(plan.row, afterRow, expectation.key, expectation.delta)
      }

      return {
        action: 'tap-row',
        row: toOutputRow(plan.row),
        inRow: plan.inRow,
        tap: plan.tap,
        device: sample.device,
        ...(sample.sampledDepth === undefined ? {} : { sampledDepth: sample.sampledDepth }),
        ...(sample.deepened === true ? { deepened: true } : {}),
        ...(sample.depthsTried === undefined ? {} : { depthsTried: sample.depthsTried }),
        ...(countCheck === undefined ? {} : { countCheck }),
        ...(expectation === undefined
          ? { note: 'No expect_count was given, so nothing was verified — re-run ios_sim_ui_rows and compare the row counters if confirmation matters.' }
```

</details>

**依据 6 · 源码核查**：[src/list-rows.ts:479-501](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/list-rows.ts#L479-L501)

行可比与精确计数变化而非任意成功。

<details>
<summary>查看原文（23行）</summary>

```text
export function verifyCountChange(before: ListRow, after: ListRow, key: string, delta: 1 | -1): CountCheckResult {
  const normalized = normalizeCountKey(key)
  const beforeValue = rowCountFor(before, normalized)
  const afterValue = rowCountFor(after, normalized)
  if (beforeValue === undefined) {
    return { key: normalized, delta, after: afterValue, verified: false, changed: afterValue !== undefined, reason: 'the key was absent from the before label' }
  }
  if (afterValue === undefined) {
    return { key: normalized, delta, before: beforeValue, verified: false, changed: false, reason: 'the key is absent from the re-read label (the row text changed)' }
  }
  if (!rowsStayedPut(before, after)) {
    return { key: normalized, delta, before: beforeValue, after: afterValue, verified: false, changed: afterValue !== beforeValue, reason: 'the row moved after the action, so the counters are not comparable' }
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
  }
```

</details>

#### 缺口

- 未验路由拒绝/过期、并发目标与超时后设备状态；局部证据与业务对象/持久结果对应未知。
  **影响**：不能从token/局部计数通过推到全程授权、目标正确或业务持久成功，超时后重做可能有副作用。
  **进一步探讨**：测试App造缺键/位移/重排/USB断开/失效token，核目标和业务后置条件，未知动作先查状态，不直接重试。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何渐进采用并算清真机恢复成本？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议iOS开发者在自有测试项目先模拟器有限试用，真机另核授权/签名，不从主账号或重要App开始。首次有macOS/Xcode/runtime磁盘下载、Node/DSH/serve-sim、可选AXe与签名配置；持续有构建CPU/RAM/图像流、模型token、设备解锁/USB/WebView/Host适配，金额和耗时未知。作者速度/深树耗时不是本轮测量，也不能从工具数量推自动化效果。

真机runner idleTimeoutMs=0有意不因关面板回收，避免每次重建；显式stop/插件dispose/设备断开才清，退出必须检查runner、iproxy和设备状态，关卡片不等停止。模拟器/预览项目、缓存截图、安装App和被修改代码分别保留/清理，失败不盲抹设备。只做少量开发操作时原Xcode/simctl更低配置。

生产方向是把业务断言与设备/目标身份、构建版本和局部UI证据绑定，动作不确定时显示待核而不是仅成功卡；沿当前fresh树、可比行和签名路由基础，让长期测试能复核同一对象。比较手工Xcode/当前/断言版的错设备、误报通过、恢复和人工时间/token，无改善或证据负担更高则停止，未实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:350-362](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/index.ts#L350-L362)

真机runner不空闲回收及明确清理条件。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx: Context): () => Promise<void> {
  const hostCtx = ctx as HostContext
  const host = new SimHostController()
  // Real-device host (WebDriverAgent over USB): constructed up front so its
  // keep-alive can hold a runner alive; routes/panel land in the next phase.
  // Idle reaping is DISABLED for the real device on purpose. The generic
  // 5-minute default fits a simulator stream, where a restart costs seconds;
  // on a phone the runner is an `xcodebuild … test` build that costs MINUTES
  // and needs the device unlocked, so reaping it the moment the panel stops
  // streaming turns every later screenshot/tap into a multi-minute rebuild —
  // observed in testing as "WDA keeps dying". The runner is still reaped by
  // an explicit stop, by plugin disposal, and by the phone going away.
  const wda = new WdaController({ idleTimeoutMs: 0 })
```

</details>

**依据 2 · 源码核查**：[src/wda-host.ts:1904-1919](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/wda-host.ts#L1904-L1919)

构建进程组与签名/解锁成本。

<details>
<summary>查看原文（16行）</summary>

```text
  async #spawnRunner(device: RealDevice, hardwareUdid: string): Promise<void> {
    this.#lockedSignatureSeen = false
    const teamId = await this.#resolveTeamId()
    const args = assembleXcodebuildTestArgs(hardwareUdid, { teamId, bundleId: this.#options.bundleId })
    const child = spawn(this.tooling.xcodebuildCommand!, [...this.tooling.xcodebuildPrefix, ...args], {
      cwd: this.#options.wdaProjectDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      // Group leader so stop() reaps the whole xcodebuild process tree.
      detached: true,
    })
    this.#runner = { child, hardwareUdid }
    this.#noteStderr(`xcodebuild ${args.join(' ')} (pid ${child.pid ?? '?'})`)
    child.stderr.on('data', (chunk: Buffer) => {
      this.#recordStderr(chunk, 'wda')
      // The locked-device signature is surfaced as an actionable status while
      // the launch keeps waiting — it recovers by itself once unlocked.
```

</details>

**依据 3 · 源码核查**：[src/tool-list-rows.ts:557-586](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/src/tool-list-rows.ts#L557-L586)

局部验证和未验证区别。

<details>
<summary>查看原文（30行）</summary>

```text
      let countCheck: CountCheckResult | undefined
      if (expectation !== undefined) {
        await sleep(TAP_VERIFY_SETTLE_MS)
        const afterSample = await readTreeForTarget('ios_sim_tap_row', target, wda, args.max_depth, exec.signal)
        const afterRows = detectListRows(afterSample.roots, { bounds: afterSample.size }).rows
        const afterRow = afterRows.find(row => row.index === plan.row.index)
        countCheck = afterRow === undefined
          ? {
              key: expectation.key,
              delta: expectation.delta,
              before: beforeValue,
              verified: false,
              changed: false,
              reason: 'the re-read tree no longer contains the row (the screen changed)',
            }
          : verifyCountChange(plan.row, afterRow, expectation.key, expectation.delta)
      }

      return {
        action: 'tap-row',
        row: toOutputRow(plan.row),
        inRow: plan.inRow,
        tap: plan.tap,
        device: sample.device,
        ...(sample.sampledDepth === undefined ? {} : { sampledDepth: sample.sampledDepth }),
        ...(sample.deepened === true ? { deepened: true } : {}),
        ...(sample.depthsTried === undefined ? {} : { depthsTried: sample.depthsTried }),
        ...(countCheck === undefined ? {} : { countCheck }),
        ...(expectation === undefined
          ? { note: 'No expect_count was given, so nothing was verified — re-run ios_sim_ui_rows and compare the row counters if confirmation matters.' }
```

</details>

**依据 4 · 作者声明**：[README.zh.md:125-132](https://github.com/ZSeven-W/dsh-ios/blob/d9a9731ccd73b38858fcfbf2f35d7120a861654c/README.zh.md#L125-L132)

作者环境/下载前提。

```text
## 环境要求

- **macOS + 完整版 Xcode**——仅装 Command Line Tools 不够。`xcodebuild`、`xcrun simctl` 和模拟器运行时都随 Xcode 提供。
- **Xcode 中至少安装一个 iOS 模拟器运行时**。
- **DSH ≥ 0.1.0-rc.6 且使用 Web 版**，才能显示面板。无头（headless）配置下插件同样可用：22 个工具照常工作，只是没有实时画面。
- **非 macOS 主机**：插件依然能加载，22 个工具也会注册，但每次调用都会返回明确的错误信息（`iOS Simulator requires macOS with Xcode …`）。
- **serve-sim** 作为本插件的 npm 依赖随包安装，正式安装时会从本地解析；开发目录则回退到 `npx -y serve-sim`（首次使用需要联网）。
- **AXe**（可选——只有基于 AXe 的工具需要：`ios_sim_ui_tree` / `ios_sim_tap_element`，以及模拟器上的 `ios_sim_ui_rows` / `ios_sim_tap_row`）：`brew install cameroncooke/axe/axe`，或让插件自动下载固定版本（v1.8.0，校验 SHA-256）到 `~/Library/Caches/dsh-ios/bin`。`DSHPLUGIN_IOS_AXE_BIN` 可覆盖解析结果；`DSHPLUGIN_IOS_AXE_OFFLINE=1` 可禁用下载。
```

#### 缺口

- 无真实开发者任务/资源与失败恢复对照，退出残留和测试准确率未验。
  **影响**：无法判断会话集成是否节省开发验收时间，或真机常驻/构建与退出清理成本是否可接受。
  **进一步探讨**：自有小App模拟器先测构建/目标/断言，真机再测USB/锁屏/超时/停止与资料残留；比较原Xcode人工验收。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
