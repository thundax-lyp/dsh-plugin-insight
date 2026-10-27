# Minke

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b33abcc](https://github.com/lencx/Minke/tree/b33abcc7170e0e2efd14932db3997cdc75cab472)

<!-- BEGIN META -->
[![GitHub ★ 693](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=693&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lencx/Minke)
<!-- END META -->

> **功能**：基于 DeepSeek Harness 的本地桌面工作区，整合会话、文件、终端与共享浏览器。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)增量在可见桌面工作区与私有浏览器桥；[Q03](#research-q03)先关动作入场门和修订校验可借鉴，DSH代理基础与CDP归上游。

> **主要限制**：[Q03](#research-q03)控制权不等于用户认证，接管不能撤销外部副作用；[Q04](#research-q04)迁移整个客户端的负担可能大于局部便利，源码与发行包不能互认。

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
  - [Q01 · Minke是可安装插件还是替代桌面工作区，主要增量是什么？](#detail-section-11)
  - [Q02 · 桌面Host怎样启动DSH并把浏览器工具接到可见窗口？](#detail-section-12)
  - [Q03 · 人类接管与会话owner能保证什么，哪些不是身份或业务验收？](#detail-section-13)
  - [Q04 · 迁入独立客户端能否抵消安装、数据与恢复负担？](#detail-section-14)
  - [Q05 · 共享浏览器控制权链能否抽成独立DSH插件机会？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Minke是独立Electron桌面客户端，内嵌DeepSeek Harness及产品overlay，不是装进已有DSH的一项npm插件。它面向需要把代码会话、文件、终端和浏览器放在同一窗口的开发者/知识工作者，合格结果是从对话到工具操作的上下文连贯且能人工接管，不是面板数量。相对原DSH加外部编辑器/浏览器，它把可见共享浏览器、文件终端和本地模型/远程入口组织进一个客户端；预设、Skill、子Agent和模型执行基础归属DSH，不能算Minke新代理引擎。作者明确当前源码与打包发行可能不同，所以本轮固定0.9.0源码不自动代表可下载版本。

原DSH加现有编辑器/终端/浏览器是完整可行基线；桌面整合不能自动证明更好的任务正确性或商业价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 独立桌面客户端 | 集中会话与工作区 | 需要完整安装及数据迁移 |
| 共享浏览器 | 代理操作与人类接管 | 私有IPC/owner/revision，非网页副作用撤销 |
| 远程/IM入口 | 作者声明多设备访问 | 本轮未完成身份链核查 |

**流程与依赖**

| 依赖 | 是否必需 | 用途 | 缺失后果 |
|---|---|---|---|
| Electron与 staged Harness产品包 | 启动必需 | 主窗与代理宿主 | 元数据/入口检查失败 |
| 私有IPC与overlay | 共享浏览器必需 | 工具到CDP | 无私有IPC不注册桌面工具 |
| 模型/账号及项目权限 | 任务必需 | 原DSH执行 | 按宿主失败或审批 |
| Tailnet/Access/IM配置 | 远程可选 | 外部设备接入 | 本轮未审授权链，默认不启用 |

| 步骤 | 执行者与动作 | 验收/退路 |
|---|---|---|
| 准备 | 用户核包与独立数据副本 | 原目录保留 |
| 配置 | 绑定模型和无敏感测试项目 | 宿主/插件版本可定位 |
| 任务 | 模型在可见浏览器操作、人类接管 | 旧revision拒绝且真实任务完成 |
| 退出 | 停用/恢复原工具组合 | 对照会话数据和已发生网页动作 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 | 未知 |
|---|---|---|---|
| 首次 | 客户端/浏览器/构建资源 | 配置模型、复制数据和插件 | 安装迁移未测 |
| 持续 | 内存、本地或云模型费用 | 维护宿主/插件/浏览器状态 | 无全链资源账单 |
| 失败退出 | 副本、重试与备份资源 | 对照已发生网页动作、恢复原目录 | 不自动撤销外部写入 |

| 效果 | 源码支持 | 尚不能确定 |
|---|---|---|
| 集中工作区 | Electron与DSH子进程 | 净切换时间 |
| 接管 | pending入场门与revision | 各平台真实竞态 |
| 本地数据 | 独立dshHome | 远程模型数据去向/迁移完整性 |

> **思考**：[Q03](#research-q03)控制权不等于用户认证，接管不能撤销外部副作用；[Q04](#research-q04)迁移整个客户端的负担可能大于局部便利，源码与发行包不能互认。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)增量在可见桌面工作区与私有浏览器桥；[Q03](#research-q03)先关动作入场门和修订校验可借鉴，DSH代理基础与CDP归上游。

[Q02](#research-q02)运行元数据、进程IPC和主界面权限分层；[Q03](#research-q03)owner/revision把接管责任显式化。复用需保留进程退出清理、挂载实际调用与权限约束，不能只复制契约类型或用sandbox选项替代业务工具授权。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)控制权不等于用户认证，接管不能撤销外部副作用；[Q04](#research-q04)迁移整个客户端的负担可能大于局部便利，源码与发行包不能互认。

<a id="detail-section-6"></a>

### 1.5 使用建议

首次成本比小插件更大：下载匹配OS架构的完整客户端，迁移或配置模型凭据、工作区和插件，确认其内嵌DSH版本；源码开发还需pnpm、Electron及多workspace产品包构建。持续成本有桌面/Chromium内存、模型服务、本地模型算力、插件兼容和升级，现金与时间没有本轮测量。本地保存会话设置不等于模型请求留在本机，远程入口开启后仍能操作这台机器已授权工具，应单独核清访问策略。退出需要保留原DSH数据与备份，不把卸载客户端当作自动回滚网页副作用或恢复跨版本数据。当前适合观察，若只需要聊天或偶尔浏览，原DSH加现有浏览器更简单；有明确多面板需求的人可在独立数据目录准备小范围验收，尚无同版本运行材料支持持续迁入。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认独立Electron客户端与Harness子进程、浏览器控制权主链；实际发行包、跨平台/远程身份及效果未执行；抽离插件是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、desktop/main/harness-launch.ts、desktop/main/harness-runtime.ts、desktop/main/agent-browser/process-channel.ts、desktop/main/agent-browser/runtime.ts、desktop/main/harness-permission-policy.ts、desktop/main/main-window.ts、packages/harness-overlay/src/host/agent-browser-tools.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根仓库client源码级，重点主进程/Harness启动与共享浏览器owner/revision/渲染权限；未逐项审计全部CDP、远程Access/IM、更新器和迁移，未执行应用/目标测试。
- 下一步：固定发行包和产品bundle，在复制项目/测试网站核启动、导航、接管时旧修订、退出重开与原目录恢复；跨平台和远程身份另行验收，未执行。

**分析版本**

- **仓库**：[lencx/Minke](https://github.com/lencx/Minke)
- **版本号**：0.9.0（[固定提交 b33abcc](https://github.com/lencx/Minke/tree/b33abcc7170e0e2efd14932db3997cdc75cab472)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可提出未验证的窄范围适配假设：将当前私有IPC背后的可见浏览器控制权、revision和停止语义做成宿主可插拔能力，使已有DSH用户无需迁移整个客户端也能获得人机交接。相对通用浏览器MCP的差异候选是同屏接管及旧修订拒绝，而不是把CDP或owner字段当原创。现有实现强依赖Electron主进程、WebContents、overlay与生命周期，抽离会新增浏览器宿主分发、认证和数据维护成本；本次没有充分需求或替代比较，不能据代码可拆就认定值得生产。最小验证先找到五个经常人工接管网页任务的现有DSH用户，以原浏览器办法、现成可见浏览器工具和窄适配做同任务比较，观察接管后误继续、完成率与迁移意愿；若现成方案已足够或无人愿意配置宿主，就否定独立插件机会。 [Q05](#research-q05)

固定发行包和产品bundle，在复制项目/测试网站核启动、导航、接管时旧修订、退出重开与原目录恢复；跨平台和远程身份另行验收，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 24 | 2045 | — | — | 26150 |
| .mts | source | 8 | 560 | 482 | 43 | — |
| .ts | source | 326 | 91465 | 85453 | 1685 | — |
| .tsx | source | 68 | 16003 | 15356 | 119 | — |
| .js | source | 1 | 3 | 2 | 0 | — |
| .mjs | source | 31 | 8064 | 7546 | 159 | — |
| .cjs | source | 1 | 88 | 80 | 0 | — |
| .mjs | test | 115 | 72414 | 69171 | 732 | — |
| .cjs | test | 21 | 6574 | 6267 | 125 | — |
| .js | example | 3 | 211 | 207 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/lencx/Minke/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/lencx/Minke/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/lencx/Minke/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：识别独立客户端的宿主集成贡献，沿共享浏览器核查接管与实际采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Minke是可安装插件还是替代桌面工作区，主要增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Minke是独立Electron桌面客户端，内嵌DeepSeek Harness及产品overlay，不是装进已有DSH的一项npm插件。它面向需要把代码会话、文件、终端和浏览器放在同一窗口的开发者/知识工作者，合格结果是从对话到工具操作的上下文连贯且能人工接管，不是面板数量。相对原DSH加外部编辑器/浏览器，它把可见共享浏览器、文件终端和本地模型/远程入口组织进一个客户端；预设、Skill、子Agent和模型执行基础归属DSH，不能算Minke新代理引擎。作者明确当前源码与打包发行可能不同，所以本轮固定0.9.0源码不自动代表可下载版本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-33](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/README.md#L23-L33)

独立桌面工作区与作者列出的增量；发布包可能不同。

<details>
<summary>查看原文（11行）</summary>

```text

> Minke is an independent community project under active development. Packaged releases may differ from the current source.

## Highlights

- **Shared browser control** — Watch the agent work in visible browser tabs, take over at any time, and send annotated page context back to the conversation.
- **One workspace** — Keep conversations, files, and terminals side by side. Organize work with split views and a bottom panel; edit files, preview documents, and review changes in place.
- **Access across devices** — Reach your workspace through Web / PWA on a phone or another computer, or start tasks through WeChat, Telegram, and Discord.
- **Cloud and local models** — Use cloud providers or custom endpoints, discover LM Studio and Ollama models, and optionally start local services.
- **Agents and plugins** — Use DSH's presets, skills, subagents, and scheduled tasks, and extend the workspace through native plugin management.

```

</details>

**依据 2 · 源码核查**：[package.json:16-20](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/package.json#L16-L20)

private Electron包与桌面入口确认client身份。

```text
  "private": true,
  "version": "0.9.0",
  "packageManager": "pnpm@11.28.5",
  "main": ".vite/build/main.js",
  "scripts": {
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桌面Host怎样启动DSH并把浏览器工具接到可见窗口？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

主进程先读dsh-runtime.json及产品bundle元数据、检查入口/pnpm/bin/patch存在，再以Electron可执行文件启动私有Harness子进程，传IPC并绑定agentBrowser。Host的agent-browser-tools只在有process.send且连接未断时注册，避免独立/PWA宿主宣称具备桌面专属能力。工具请求带ownerSessionId，经独立协议解析与pending映射到主进程AgentBrowserRuntime；后者验证会话所有者、按状态排队并转到CDP执行导航等操作，结果回传宿主。主窗口设置contextIsolation、关闭nodeIntegration并开启sandbox/webSecurity是渲染边界，但并不限制已授权的宿主文件/终端/浏览器工具。浏览器执行已追主链，未逐项审计全部CDP动作与所有产品overlay。

#### 证据与依据

**依据 1 · 源码核查**：[desktop/main/harness-launch.ts:22-60](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/harness-launch.ts#L22-L60)

运行布局schema和产品patch校验。

<details>
<summary>查看原文（39行）</summary>

```text
): Promise<HarnessRuntimeLayout> {
  const metadata = JSON.parse(
    await readFile(join(runtimeRoot, "dsh-runtime.json"), "utf8"),
  ) as RuntimeMetadata;
  const packageName = metadata.productBundle?.packageName;
  const patch = metadata.productBundle?.patch;
  if (
    metadata.schemaVersion !== 3 ||
    typeof packageName !== "string" ||
    !/^@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/u.test(packageName) ||
    typeof patch !== "string" ||
    !/^[a-z0-9][a-z0-9._-]*$/u.test(patch)
  ) {
    throw new Error("staged Harness runtime has invalid product bundle metadata");
  }
  return {
    entryPath: join(runtimeRoot, "index.mjs"),
    pnpmEntry: join(runtimeRoot, "node_modules", "pnpm", "bin", "pnpm.cjs"),
    productPackageName: packageName,
    productPatch: join(
      runtimeRoot,
      "node_modules",
      ...packageName.split("/"),
      patch,
    ),
    runtimeBin: join(runtimeRoot, "bin"),
  };
}

export function harnessHostArguments(
  layout: Pick<HarnessRuntimeLayout, "entryPath" | "productPatch" | "pnpmEntry">,
): string[] {
  return [
    "--expose-internals",
    layout.entryPath,
    "--minke-desktop-host",
    layout.productPatch,
    layout.pnpmEntry,
  ];
```

</details>

**依据 2 · 源码核查**：[desktop/main/harness-runtime.ts:232-275](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/harness-runtime.ts#L232-L275)

真实子进程启动和浏览器IPC绑定。

<details>
<summary>查看原文（44行）</summary>

```text
  async #start(): Promise<HarnessRuntimeEndpoint> {
    const layout = await readHarnessRuntimeLayout(this.#options.runtimeRoot);
    if (this.#stopping) throw new Error("Harness stopped during startup");
    await Promise.all([
      access(layout.entryPath),
      access(layout.pnpmEntry),
      access(layout.runtimeBin),
      access(layout.productPatch),
    ]);
    await mkdir(this.#options.dshHome, { recursive: true });
    if (this.#stopping) throw new Error("Harness stopped during startup");

    this.#output = "";
    this.#rawOutput = "";
    this.#ready = false;

    const child = spawn(
      this.#options.electronExecutable,
      harnessHostArguments(layout),
      {
        cwd: this.#options.dshHome,
        detached: process.platform !== "win32",
        env: harnessRuntimeEnvironment(layout, {
          ...this.#options,
          modelRuntimes: this.#modelRuntimes,
        }, this.#options.environment),
        stdio: ["ignore", "pipe", "pipe", "ipc"],
        windowsHide: true,
      },
    );
    this.#child = child;
    const host = new HarnessHostChannel(child, this.#startupTimeoutMs, () => this.#output);
    this.#host = host;
    this.#control = new HarnessControlChannel(
      child,
      this.#options.controlTimeoutMs,
      this.#options.modelRuntimeControlTimeoutMs,
      this.#options.agentTurnTimeoutMs,
    );
    const agentBrowserBinding =
      this.#options.agentBrowser?.bindChild(child);
    this.#agentBrowserBinding = agentBrowserBinding;

    child.stdout?.setEncoding("utf8");
```

</details>

**依据 3 · 源码核查**：[packages/harness-overlay/src/host/agent-browser-tools.ts:2132-2150](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/packages/harness-overlay/src/host/agent-browser-tools.ts#L2132-L2150)

桌面私有IPC缺失时不注册工具。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(
  ctx: AgentBrowserToolsContext,
  config: Config = {},
  port: AgentBrowserProcessPort =
    process as unknown as AgentBrowserProcessPort,
): boolean {
  // The same host package also runs in standalone/PWA Harness deployments.
  // Do not advertise desktop-only tools when no private parent IPC exists.
  if (
    typeof port.send !== "function" ||
    port.connected === false
  ) {
    return false;
  }
  const resolved = resolveConfig(config);
  const client = new AgentBrowserProcessClient(port);
  const progressPolicy = new AgentBrowserProgressPolicy();
  const concludeNoProgress = (
    exec: AgentBrowserToolExecution,
```

</details>

**依据 4 · 源码核查**：[desktop/main/agent-browser/process-channel.ts:74-108](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/agent-browser/process-channel.ts#L74-L108)

独立进程协议、pending生命周期和事件监听。

<details>
<summary>查看原文（35行）</summary>

```text
 * has an independent discriminator, parser, pending map, and lifecycle.
 */
export class AgentBrowserProcessChannel {
  readonly #child: AgentBrowserProcessChild;
  readonly #handler: AgentBrowserProcessHandler;
  readonly #onDispose: (() => void) | undefined;
  readonly #pending =
    new Map<number, PendingProcessRequest>();
  readonly #owners = new Set<string>();
  readonly #ownerClosures = new Map<string, Promise<void>>();
  #disposed = false;

  constructor(
    child: AgentBrowserProcessChild,
    handler: AgentBrowserProcessHandler,
    onDispose?: () => void,
  ) {
    this.#child = child;
    this.#handler = handler;
    this.#onDispose = onDispose;
    child.on("message", this.#handleMessage);
    child.on("error", this.#handleFailure);
    child.on("exit", this.#handleExit);
    child.on("disconnect", this.#handleExit);
  }

  get disposed(): boolean {
    return this.#disposed;
  }

  publishControlChanged(
    ownerSessionId: string,
    sessionId: string,
    owner: AgentBrowserOwner,
    controlRevision: number,
```

</details>

**依据 5 · 源码核查**：[desktop/main/agent-browser/runtime.ts:845-888](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/agent-browser/runtime.ts#L845-L888)

请求解析、owner归属及排队进入实际CDP。

<details>
<summary>查看原文（44行）</summary>

```text
  async handleProcessRequest(
    request: AgentBrowserRequest,
    signal: AbortSignal,
  ): Promise<AgentBrowserOperationResult> {
    this.#ensureAvailable();
    const parsed = parseAgentBrowserProcessRequest(request);
    if (parsed.type !== "request") {
      throw new AgentBrowserError(
        "bad_request",
        "Expected an Agent Browser operation request",
      );
    }

    if (parsed.operation === "open") {
      return await this.#open(
        parsed.ownerSessionId,
        requiredString(parsed.payload, "url"),
        signal,
      );
    }

    const sessionId = requiredString(
      parsed.payload,
      "sessionId",
    );
    const state = this.#stateForAgent(
      sessionId,
      parsed.ownerSessionId,
    );
    if (parsed.operation === "close") {
      return await this.#enqueue(state, signal, async () => {
        await this.closeSession(state.sessionId);
        return {
          sessionId: state.sessionId,
          closed: true as const,
        };
      });
    }

    return await this.#enqueue(state, signal, async () => {
      const cdp = this.#activeCdp(state);
      switch (parsed.operation) {
        case "navigate": {
          const url = requiredString(parsed.payload, "url");
```

</details>

**依据 6 · 源码核查**：[desktop/main/main-window.ts:149-167](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/main-window.ts#L149-L167)

主窗口隔离选项而非工具沙箱。

<details>
<summary>查看原文（19行）</summary>

```text
      minkeConfigFilePath(app.getPath("userData")),
      (bounds) => new BrowserWindow({
        title: PRODUCT_NAME,
        icon: this.#appIconPath(),
        ...bounds,
        minWidth: 960,
        minHeight: 640,
        show: false,
        backgroundColor: BACKGROUND_COLOR,
        ...macOSWindowOptions(),
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          preload: join(__dirname, "desktop-preload.js"),
          sandbox: true,
          session: this.#surfaceSession,
          webSecurity: true,
          webviewTag: true,
          transparent: process.platform === "darwin",
```

</details>

#### 缺口

- 浏览器所有动作、全部overlay及打包产物未逐项核查。
  **影响**：只确认所述启动/控制主链，不声明全客户端功能都已可用。
  **进一步探讨**：固定实际包和DSH产品bundle，选只读导航、截图和一次可撤销输入做完整IPC对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 人类接管与会话owner能保证什么，哪些不是身份或业务验收？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

AgentBrowserRuntime的stateForAgent校验ownerSessionId，并在owner不是agent或humanTakeoverPending时拒绝新代理动作；setControl在人类接管意图发生时同步关闭入场门、递增controlRevision，再处理已接纳工作。claimControl拒绝被更新人类意图替代的旧修订，减少模型晚到恢复夺回控制的竞态。这些是同一桌面进程内的会话归属和操作交接，不是多用户身份认证，也不能撤销已经送到网页的提交。沙箱主窗口不等于所有网页/工具无风险；权限策略还只给活动Harness渲染器、同origin的有限剪贴板/音频权利。网页业务成功、登录cookie暴露、远程Access与IM身份链、跨平台崩溃恢复本轮未验收，不能由owner字段和本地存储宣称已安全多租户。

#### 证据与依据

**依据 1 · 源码核查**：[desktop/main/agent-browser/runtime.ts:1904-1935](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/agent-browser/runtime.ts#L1904-L1935)

会话owner校验及human状态拒绝。

<details>
<summary>查看原文（32行）</summary>

```text
  #stateForAgent(
    sessionId: string,
    ownerSessionId: string,
  ): AgentBrowserSessionState {
    const state = this.#states.get(sessionId);
    if (
      state === undefined ||
      state.closing ||
      state.ownerSessionId !== ownerSessionId
    ) {
      throw new AgentBrowserError(
        "session_not_found",
        "Agent Browser session was not found",
      );
    }
    if (
      state.owner !== "agent" ||
      state.humanTakeoverPending
    ) {
      throw new AgentBrowserError(
        "session_paused",
        "Agent Browser session is under human control",
      );
    }
    if (state.status === "crashed") {
      throw new AgentBrowserError(
        "target_gone",
        state.error ?? "Agent Browser target crashed",
      );
    }
    return state;
  }
```

</details>

**依据 2 · 源码核查**：[desktop/main/agent-browser/runtime.ts:1159-1198](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/agent-browser/runtime.ts#L1159-L1198)

旧控制修订被更新人类意图替代时拒绝。

<details>
<summary>查看原文（40行）</summary>

```text
  async claimControl(
    ownerSessionId: string,
    sessionId: string,
    expectedControlRevision: number,
    signal: AbortSignal,
  ): Promise<AgentBrowserClaimControlResult> {
    this.#ensureAvailable();
    if (signal.aborted) throw abortError(signal);
    const state = this.#states.get(sessionId);
    if (
      state === undefined ||
      state.closing ||
      state.ownerSessionId !== ownerSessionId
    ) {
      throw new AgentBrowserError(
        "session_not_found",
        "Agent Browser session was not found",
      );
    }
    if (state.status === "crashed") {
      throw new AgentBrowserError(
        "target_gone",
        state.error ?? "Agent Browser target crashed",
      );
    }
    if (
      state.controlRevision !== expectedControlRevision &&
      (
        state.controlRevision <= expectedControlRevision ||
        state.owner !== "agent" ||
        state.humanTakeoverPending ||
        !state.snapshotRequired
      )
    ) {
      throw new AgentBrowserError(
        "control_superseded",
        "A newer human control intent superseded the automatic Agent Browser claim",
      );
    }
    let cancellation: Promise<void> | undefined;
```

</details>

**依据 3 · 源码核查**：[desktop/main/agent-browser/runtime.ts:1263-1308](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/agent-browser/runtime.ts#L1263-L1308)

接管先关入场门，再做转换。

<details>
<summary>查看原文（46行）</summary>

```text
  async setControl(
    sessionId: string,
    owner: AgentBrowserOwner,
    expectedControlRevision?: number,
  ): Promise<AgentBrowserProjection> {
    this.#ensureAvailable();
    const state = this.#states.get(sessionId);
    if (state === undefined || state.closing) {
      throw new AgentBrowserError(
        "session_not_found",
        "Agent Browser session was not found",
      );
    }
    if (
      expectedControlRevision !== undefined &&
      state.controlRevision !== expectedControlRevision
    ) {
      throw new AgentBrowserError(
        "control_superseded",
        "Agent Browser control changed before the automatic claim was admitted",
      );
    }
    const controlRevision = state.controlRevision + 1;
    if (!Number.isSafeInteger(controlRevision)) {
      throw new AgentBrowserError(
        "control_revision_exhausted",
        "Agent Browser control revision space is exhausted",
      );
    }
    state.controlRevision = controlRevision;
    if (owner === "human") {
      // Close the admission gate synchronously. The transition is projected
      // only after already-admitted work reaches a terminal result.
      state.humanTakeoverPending = true;
      state.cdp?.interruptNavigationForHumanTakeover();
      if (this.#clearCursor(state)) this.#publish();
      for (const channel of this.#processChannels) {
        channel.publishControlChanged(
          state.ownerSessionId,
          state.sessionId,
          "human",
          controlRevision,
        );
      }
    }
    const transition = state.controlTail
```

</details>

**依据 4 · 源码核查**：[desktop/main/harness-permission-policy.ts:23-62](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/harness-permission-policy.ts#L23-L62)

浏览器权限绑定活动webContents与同origin，只支持有限类别。

<details>
<summary>查看原文（40行）</summary>

```text
export function canGrantHarnessPermission(
  request: HarnessPermissionRequest,
): boolean {
  if (
    (request.permission !== HARNESS_CLIPBOARD_WRITE_PERMISSION &&
      !(request.permission === "media" &&
        request.isMainFrame === true &&
        request.mediaTypes?.length === 1 &&
        request.mediaTypes[0] === "audio")) ||
    request.candidateUrl === undefined ||
    request.harnessUrl === undefined ||
    request.requestingWebContents === null ||
    request.requestingWebContents === undefined ||
    request.requestingWebContents !== request.activeWebContents
  ) {
    return false;
  }

  try {
    return new URL(request.candidateUrl).origin ===
      new URL(request.harnessUrl).origin;
  } catch {
    return false;
  }
}

export interface HarnessPermissionSources {
  harnessUrl(): string | undefined;
  activeWebContents(): WebContents | undefined;
  microphone?: {
    isGranted(): boolean;
    request(): Promise<boolean>;
  };
}

/** Install the fail-closed main-renderer policy on one Electron session. */
export function installHarnessPermissionPolicy(
  target: Pick<
    Session,
    "setPermissionCheckHandler" | "setPermissionRequestHandler"
```

</details>

#### 缺口

- 远程/IM端到端身份、所有网页副作用及各平台接管时序未验证。
  **影响**：不能向共享或高影响业务场景作隔离/撤销保证。
  **进一步探讨**：先在测试网站注入接管、超时和过期revision，独立记录已接纳与已生效动作；远程身份另设审计。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 迁入独立客户端能否抵消安装、数据与恢复负担？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

首次成本比小插件更大：下载匹配OS架构的完整客户端，迁移或配置模型凭据、工作区和插件，确认其内嵌DSH版本；源码开发还需pnpm、Electron及多workspace产品包构建。持续成本有桌面/Chromium内存、模型服务、本地模型算力、插件兼容和升级，现金与时间没有本轮测量。本地保存会话设置不等于模型请求留在本机，远程入口开启后仍能操作这台机器已授权工具，应单独核清访问策略。退出需要保留原DSH数据与备份，不把卸载客户端当作自动回滚网页副作用或恢复跨版本数据。当前适合观察，若只需要聊天或偶尔浏览，原DSH加现有浏览器更简单；有明确多面板需求的人可在独立数据目录准备小范围验收，尚无同版本运行材料支持持续迁入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-95](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/README.md#L49-L95)

远程页面是Host客户端、可用本机工具，并有完整客户端安装路径。

<details>
<summary>查看原文（47行）</summary>

```text
## Remote access from another device

Minke remote access is a responsive Web client backed by Minke Host—not a
video stream or touch-controlled projection of the Electron window. From a
phone you can continue conversations, start agent tasks, manage project files,
and use a terminal that runs on the Minke computer.

![Minke remote workspace on mobile and desktop](./assets/minke-remote.gif)

> [!NOTE]
> **Tailscale Serve over HTTPS**, **Tailscale Direct IP**, and
> **Cloudflare Access** have all completed end-to-end regression testing and
> are currently available.

- **Tailscale Serve over HTTPS (recommended)** — Best for devices already joined to the same tailnet. It provides a secure HTTPS address and supports PWA installation.
- **Tailscale Direct IP (advanced)** — Binds only to the current device's Tailscale IPv4. Traffic remains end-to-end encrypted by Tailscale, but the address uses HTTP and is not a browser secure context.
- **Cloudflare Access** — Exposes a named tunnel protected by an identity policy, without requiring Tailscale on the phone. It requires a configured Cloudflare Tunnel, Access application, and an explicit allow policy.

### Recommended setup: Tailscale Serve

Minke can expose its Web UI privately through [Tailscale Serve](https://tailscale.com/docs/reference/tailscale-cli/serve). It keeps Harness on the local loopback address, does not bind it to the LAN, and does not enable the public Tailscale Funnel.

1. Install Tailscale on the Minke computer and the phone, sign both into the
   same tailnet, and confirm the computer is connected.
2. In Minke, open **Connections → Device access → Remote access**, select
   **HTTPS Serve**, and enable remote access. Minke connects in the
   background; no restart is required.
3. Copy or open the displayed
   `https://…ts.net` address on the phone.

### Install as a PWA

Open a Tailscale Serve or Cloudflare Access HTTPS address, choose
**Install Minke** in the sidebar, and accept the browser install prompt. On
iPhone or iPad, use **Share → Add to Home Screen**. The installed app launches
in standalone mode; when connectivity is poor it shows connection or offline
feedback instead of silently presenting cached workspace content.

Minke activates only one remote route at a time, owns its foreground proxy
while the app is running, and stops it on exit. The remote page can start
agent tasks and use local tools already authorized in Minke, so grant access
only to trusted tailnet members or Cloudflare Access identities.

## Installation

Download Minke only from the official [GitHub Releases](https://github.com/lencx/Minke/releases) page. The links below always point to the latest stable release.

```

</details>

**依据 2 · 源码核查**：[package.json:21-25](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/package.json#L21-L25)

多workspace类型检查与产品包/preload构建依赖。

```text
    "icons:generate": "node scripts/forge/generate-icons.mjs",
    "typecheck": "tsc --noEmit && pnpm --filter @lencx/minke-remote-access typecheck && pnpm --filter @lencx/minke-model-runtime typecheck && pnpm --filter @lencx/minke-im-weixin typecheck && pnpm --filter @lencx/minke-im-telegram typecheck && pnpm --filter @lencx/minke-im-discord typecheck && pnpm --filter @lencx/minke-im-gateway typecheck && pnpm --filter @lencx/minke-harness-overlay typecheck",
    "build:product-packages": "node scripts/harness/build-product-packages.mjs",
    "build:preload": "vite build --config vite.preload.config.mts && vite build --config vite.tabs-web-preload.config.mts",
    "test:assertions": "node --test tests/assertion-policy.test.mjs",
```

**依据 3 · 源码核查**：[desktop/main/harness-runtime.ts:232-258](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/harness-runtime.ts#L232-L258)

独立dshHome与真实宿主进程资源。

<details>
<summary>查看原文（27行）</summary>

```text
  async #start(): Promise<HarnessRuntimeEndpoint> {
    const layout = await readHarnessRuntimeLayout(this.#options.runtimeRoot);
    if (this.#stopping) throw new Error("Harness stopped during startup");
    await Promise.all([
      access(layout.entryPath),
      access(layout.pnpmEntry),
      access(layout.runtimeBin),
      access(layout.productPatch),
    ]);
    await mkdir(this.#options.dshHome, { recursive: true });
    if (this.#stopping) throw new Error("Harness stopped during startup");

    this.#output = "";
    this.#rawOutput = "";
    this.#ready = false;

    const child = spawn(
      this.#options.electronExecutable,
      harnessHostArguments(layout),
      {
        cwd: this.#options.dshHome,
        detached: process.platform !== "win32",
        env: harnessRuntimeEnvironment(layout, {
          ...this.#options,
          modelRuntimes: this.#modelRuntimes,
        }, this.#options.environment),
        stdio: ["ignore", "pipe", "pipe", "ipc"],
```

</details>

#### 缺口

- 实际安装迁移、升级/退出数据完整性、任务时间和资源账单未知。
  **影响**：不能判断相对原工具组合的净收益，也不推荐直接替换生产数据目录。
  **进一步探讨**：用复制的无敏感项目比较会话→网页→人工接管完整任务，记录人工切换、合格率、内存/模型费用及退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 共享浏览器控制权链能否抽成独立DSH插件机会？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的窄范围适配假设：将当前私有IPC背后的可见浏览器控制权、revision和停止语义做成宿主可插拔能力，使已有DSH用户无需迁移整个客户端也能获得人机交接。相对通用浏览器MCP的差异候选是同屏接管及旧修订拒绝，而不是把CDP或owner字段当原创。现有实现强依赖Electron主进程、WebContents、overlay与生命周期，抽离会新增浏览器宿主分发、认证和数据维护成本；本次没有充分需求或替代比较，不能据代码可拆就认定值得生产。最小验证先找到五个经常人工接管网页任务的现有DSH用户，以原浏览器办法、现成可见浏览器工具和窄适配做同任务比较，观察接管后误继续、完成率与迁移意愿；若现成方案已足够或无人愿意配置宿主，就否定独立插件机会。

#### 证据与依据

**依据 1 · 源码核查**：[packages/harness-overlay/src/host/agent-browser-tools.ts:2132-2150](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/packages/harness-overlay/src/host/agent-browser-tools.ts#L2132-L2150)

私有IPC依赖给出抽离成本。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(
  ctx: AgentBrowserToolsContext,
  config: Config = {},
  port: AgentBrowserProcessPort =
    process as unknown as AgentBrowserProcessPort,
): boolean {
  // The same host package also runs in standalone/PWA Harness deployments.
  // Do not advertise desktop-only tools when no private parent IPC exists.
  if (
    typeof port.send !== "function" ||
    port.connected === false
  ) {
    return false;
  }
  const resolved = resolveConfig(config);
  const client = new AgentBrowserProcessClient(port);
  const progressPolicy = new AgentBrowserProgressPolicy();
  const concludeNoProgress = (
    exec: AgentBrowserToolExecution,
```

</details>

**依据 2 · 源码核查**：[desktop/main/agent-browser/runtime.ts:1263-1308](https://github.com/lencx/Minke/blob/b33abcc7170e0e2efd14932db3997cdc75cab472/desktop/main/agent-browser/runtime.ts#L1263-L1308)

先关入场与revision提供差异候选推导。

<details>
<summary>查看原文（46行）</summary>

```text
  async setControl(
    sessionId: string,
    owner: AgentBrowserOwner,
    expectedControlRevision?: number,
  ): Promise<AgentBrowserProjection> {
    this.#ensureAvailable();
    const state = this.#states.get(sessionId);
    if (state === undefined || state.closing) {
      throw new AgentBrowserError(
        "session_not_found",
        "Agent Browser session was not found",
      );
    }
    if (
      expectedControlRevision !== undefined &&
      state.controlRevision !== expectedControlRevision
    ) {
      throw new AgentBrowserError(
        "control_superseded",
        "Agent Browser control changed before the automatic claim was admitted",
      );
    }
    const controlRevision = state.controlRevision + 1;
    if (!Number.isSafeInteger(controlRevision)) {
      throw new AgentBrowserError(
        "control_revision_exhausted",
        "Agent Browser control revision space is exhausted",
      );
    }
    state.controlRevision = controlRevision;
    if (owner === "human") {
      // Close the admission gate synchronously. The transition is projected
      // only after already-admitted work reaches a terminal result.
      state.humanTakeoverPending = true;
      state.cdp?.interruptNavigationForHumanTakeover();
      if (this.#clearCursor(state)) this.#publish();
      for (const channel of this.#processChannels) {
        channel.publishControlChanged(
          state.ownerSessionId,
          state.sessionId,
          "human",
          controlRevision,
        );
      }
    }
    const transition = state.controlTail
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
