# DSH for VS Code

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b1243ba](https://github.com/Fengze233/dsh-vscode/tree/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86)

<!-- BEGIN META -->
[![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fengze233/dsh-vscode)
<!-- END META -->

> **功能**：在 VS Code 侧栏嵌入 DSH Web，管理自启与外部服务，提供本机认证代理和配套文件桥。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 让 DSH Web 的启动与认证进入编辑器，并接原生文件和剪贴板动作。体验与时间收益未实测。

> **主要限制**：[Q03](#research-q03) 代办认证的环回端口、可信 iframe 和可写 cwd 构成实际权限边界。[Q04](#research-q04) 的自动桥接会改宿主配置和目录。

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
  - [Q01 · 何种编辑场景需要嵌入，与浏览器使用有何差别？](#detail-section-11)
  - [Q02 · 扩展怎样启停 DSH，并把授权界面带入侧栏？](#detail-section-12)
  - [Q03 · 环回代理、远程和原生消息的实际边界是什么？](#detail-section-13)
  - [Q04 · 依赖、桥接写入和退出成本如何盘点？](#detail-section-14)
  - [Q05 · 启动阶段回执能否更容易定位认证和桥接故障？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 频繁往返 DSH Web 和 VS Code 的开发者可把会话放在编辑器旁，基线是在独立浏览器使用。

[Q01](#research-q01) 对比浏览器、纯 iframe 和完整桥，检查任务切换、文件打开和恢复。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 编辑器嵌入 | 在侧栏查看 DSH | 需要可用服务与认证 |
| 服务管理 | 自启或复用 | 只尝试停止本次自启子进程 |
| 配套桥 | 文件和剪贴板 | 权限边界依赖可信页面和目录 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| VS Code 1.91 线和 DSH | 基础使用需要 | 启动或复用 Web | 核对 CLI 或桌面位置 |
| 可用的启动会话 | 新版认证需要 | 兑换并代理 | 提供新启动 URL |
| 可写 Profile 和工作区 | 仅桥接需要 | 安装与缓存 | 关闭桥接 |
| VS Code 远程能力 | 仅隧道部署 | 访问远端环回 | 回到本机试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择工作区和 profile | 明确是否打开桥及远程 |
| 打开 | 扩展探测、启动和认证 | 服务 ready 后再核对登录与桥 |
| 退出 | 用户关闭面板或移除桥 | 检查服务、代理、缓存和会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | VS Code、DSH 进程与磁盘，实际未知 | 安装、调试端口及 profile | 桥接默认配置需核对 |
| 持续使用 | 代理、浏览器及缓存开销未知 | 维护登录、桥和目录 | 远程连接依宿主 |
| 失败恢复 | 重启和重复缓存资源未知 | 区分启动、认证、代理和握手 | patch 跨目录更新非原子 |
| 退出 | 已留副本和会话记录空间未知 | 停用、清理缓存和检查共享桥 | 会话可留存在 globalState |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 编辑器内操作 | 真正嵌入 DSH Web 并接桥 | 切换节时和完成率 |
| 认证与复用 | 有兑换、探测及代理 | 同机与远程可达和实际可靠性 |
| 失败恢复 | 有端口、会话、桥各状态 | 实际恢复时间及退出后残留 |

> **思考**：[Q03](#research-q03) 代办认证的环回端口、可信 iframe 和可写 cwd 构成实际权限边界。[Q04](#research-q04) 的自动桥接会改宿主配置和目录。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 让 DSH Web 的启动与认证进入编辑器，并接原生文件和剪贴板动作。体验与时间收益未实测。

[Q02](#research-q02) 分开服务 ready 与认证。[Q03](#research-q03) 环回绑定不隔离同机进程。[Q04](#research-q04) 退出分别检查桥、进程和持久会话。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 代办认证的环回端口、可信 iframe 和可写 cwd 构成实际权限边界。[Q04](#research-q04) 的自动桥接会改宿主配置和目录。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用专用 profile 比较桥关闭和打开，再检查目录变化及登录。无法核对权限时停用桥和代理，恢复浏览器。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 VS Code 激活、DSH 生命周期、代理和桥接。真实远程暴露、启动和恢复效果未验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/panel/provider.ts、src/panel/html.ts、bridge-client/package.json、src/service/manager.ts、src/extension.ts、src/service/session.ts、src/service/proxy.ts、src/remote.ts、src/bridge/host.ts、src/bridge/installer.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根扩展的入口、代理、桥与代表设置。配套 bridge-client 只用于界定接线，不作独立子包评分。未执行 VS Code、DSH、扩展、测试或网络。
- 下一步：[Q05](#research-q05) 用隔离宿主注入端口冲突、令牌失效和桥未加载，记录定位和恢复，并查退出后的实际状态。

**分析版本**

- **仓库**：[Fengze233/dsh-vscode](https://github.com/Fengze233/dsh-vscode)
- **版本号**：0.4.4（[固定提交 b1243ba](https://github.com/Fengze233/dsh-vscode/tree/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设脱敏的阶段回执可降低误重启与恢复用时。以已有分散的启动、认证和桥接状态作对照。

[Q05](#research-q05) 用隔离宿主注入端口冲突、令牌失效和桥未加载，记录定位和恢复，并查退出后的实际状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 8098 | — | — | 72708 |
| .js | source | 3 | 1370 | 906 | 406 | — |
| .mjs | source | 2 | 119 | 72 | 38 | — |
| .ts | source | 20 | 5111 | 3404 | 1526 | — |
| .ts | test | 29 | 5937 | 4964 | 703 | — |

</details>

**活跃度**

[![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/Fengze233/dsh-vscode/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/Fengze233/dsh-vscode/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在编辑器中复用 DSH Web 时，进程、认证代理和原生文件桥接怎样运作和恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何种编辑场景需要嵌入，与浏览器使用有何差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

反复在编辑器改代码和 DSH 会话间切换的用户，可在 VS Code Webview 看同一 Web 界面，配套桥可打开文件、复制和转发图片。浏览器独立运行更容易隔离浏览器会话，仍需切换上下文。根 manifest 是 VS Code 扩展，视图打开调用 service manager。DSH 客户端入口另在 bridge-client，由根扩展安装，不能把子包身份赋给根。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:50-59](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/README.md#L50-L59)

作者给出的 VS Code 和浏览器场景。

<details>
<summary>查看原文（10行）</summary>

```text
## 🎯 Why DSH in VS Code?

| | |
|---|---|
| **Stay in the editor** | DSH lives in the sidebar or a side panel. Review code, run commands and talk to the agent without switching to a terminal or browser. |
| **Zero-config lifecycle** | The extension detects the port, reuses an existing `dsh web`, or starts one silently and loads it once ready. Closing the window stops only the service it started. |
| **Native editor integration** | A small bridge makes file paths clickable in VS Code, opens external links in your browser, routes copy buttons through the extension host, and restores undo/redo in the embedded page. |
| **Auth that just works** | DSH ≥ 0.1.2 prints a one-time launch URL; the extension exchanges it for a 30-day session and serves the panel through a local loopback relay, so the cross-site iframe keeps working. |
| **Works where you work** | Local, WSL, SSH Remote, Dev Containers and Codespaces (remote scenarios are opt-in via `dsh.remote.enabled`). |
| **Private by design** | Loopback addresses only (`127.0.0.1` / `localhost` / `[::1]`); no credentials are read; the relay is not exposed to the network. |
```

</details>

**依据 2 · 源码核查**：[package.json:10-29](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/package.json#L10-L29)

VS Code 入口、宿主与激活。

<details>
<summary>查看原文（20行）</summary>

```text
  "engines": {
    "vscode": "^1.91.0"
  },
  "extensionKind": [
    "workspace",
    "ui"
  ],
  "categories": [
    "AI",
    "Chat",
    "Other"
  ],
  "main": "./out/extension.js",
  "uninstall": "node ./out/uninstall.js",
  "activationEvents": [
    "onView:dsh.panel",
    "onView:dsh.panel.secondary",
    "onCommand:dsh.openPanel",
    "onCommand:dsh.openSecondary",
    "onCommand:dsh.openExternal",
```

</details>

**依据 3 · 源码核查**：[src/panel/provider.ts:80-95](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/panel/provider.ts#L80-L95)

打开面板时确保运行。

<details>
<summary>查看原文（16行）</summary>

```text
  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    // enableScripts 允许占位页的内联按钮脚本（nonce 放行）运行。
    // 注意：retainContextWhenHidden 不在这里设置——它不是 WebviewOptions 字段，
    // 由 Task 10 注册视图时通过第三参数传入（隐藏面板时保留 iframe 会话）。
    view.webview.options = { enableScripts: true };
    view.webview.onDidReceiveMessage((msg: PanelMessage) => this.onMessage(msg));
    if (!this.openedOnce) {
      this.openedOnce = true;
      this.onFirstOpen?.(); // 首次打开：触发一次性引导（如"移到右侧栏"提示）
    }
    this.render();
    // 远程窗口且未启用远程支持：仅显示占位页，绝不在此窗口启动远端 dsh 服务。
    if (this.remoteWindowDisabled()) return;
    // 面板打开即确保服务运行：复用已有或自动启动。
    void this.manager.ensureRunning();
```

</details>

**依据 4 · 源码核查**：[src/panel/html.ts:377-395](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/panel/html.ts#L377-L395)

Webview 嵌入的实际 iframe。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx: PageCtx,
  bridge?: { token: string; enabled: boolean; imageFallback?: boolean },
  zoomLevel = 1,
): string {
  // 桥接启用时注入握手脚本；未传入或 enabled=false 时保持向后兼容，不注入
  const extraScripts = bridge?.enabled
    ? `<script nonce="${ctx.nonce}">${bridgeHandshakeScript(bridge.token, new URL(url).origin, bridge.imageFallback === true)}</script>`
    : '';
  // 缩放：只对非 1 的档位写入内联变量（1 时保持历史 DOM，零行为变化）
  const zoomAttr =
    zoomLevel !== undefined && zoomLevel !== 1
      ? ` style="--dshv-zoom:${zoomLevel}"`
      : '';
  return shell(
    ctx,
    'DSH',
    'frame-body',
    `<div class="frame-zoom"${zoomAttr}><iframe id="dsh-frame" class="frame" allow="clipboard-write" src="${url}"></iframe></div>`,
    extraScripts,
```

</details>

**依据 5 · 源码核查**：[bridge-client/package.json:2-16](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/bridge-client/package.json#L2-L16)

子包另有 DSH 客户端导出。

<details>
<summary>查看原文（15行）</summary>

```text
  "name": "dsh-vscode-bridge",
  "version": "0.4.4",
  "description": "VS Code 面板桥接客户端（由 dsh-vscode-panel 扩展安装进 DSH web profile 的官方 client 插件）",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "client": {
      "inject": [],
      "platform": "web"
    }
```

</details>

#### 缺口

- 未量化编辑切换、同步、路径打开和任务完成的实际收益。
  **影响**：可证实真实嵌入，但工作流收益依赖宿主和桥接是否成功。
  **进一步探讨**：用同一工作区对比浏览器、纯嵌入和桥接三组打开文件、返回会话及失败处理。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 扩展怎样启停 DSH，并把授权界面带入侧栏？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Manager 探测到外部 DSH 就标为不归自己，端口冲突可临时换端口。自启后等探测或截止，停止仅处理自己登记的 child，停失败记日志再清状态，因此界面 idle 不证明进程一定停止。扩展获取启动 URL 后由扩展端交换一次性令牌，只有 303 且拿到 DSH cookie 才保存成功，旧 200 走无鉴权。会话按 authority 存 globalState，代理改上游 Host 和 Cookie，剥离上游 cookie 响应，401 触发丢弃并重新判定。

#### 证据与依据

**依据 1 · 源码核查**：[src/service/manager.ts:178-204](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/manager.ts#L178-L204)

只尝试停止自己持有的 child，失败后记录。

<details>
<summary>查看原文（27行）</summary>

```text
  /** 停止：仅停止插件自己启动的服务；启动流程进行中也会立即停掉已 spawn 的子进程 */
  async stop(): Promise<void> {
    this.stopRequested = true;
    this.clearHealthWatch(); // 复用外部服务时也要清掉健康探测定时器
    if (this.child) {
      await this.stopOwned();
    } else {
      this.set({ state: 'idle', url: null, owned: false, error: null });
    }
  }

  /** 停掉自启子进程并回到 idle */
  private async stopOwned(): Promise<void> {
    this.clearHealthWatch();
    if (!this.child) {
      this.set({ state: 'idle', url: null, owned: false, error: null });
      return;
    }
    this.set({ state: 'stopping' });
    const child = this.child;
    this.child = null;
    try {
      await this.deps.processRunner.stopChild(child);
    } catch (err) {
      this.deps.log(`[process] 停止子进程失败: ${String(err)}`);
    }
    this.set({ state: 'idle', url: null, owned: false, error: null });
```

</details>

**依据 2 · 源码核查**：[src/service/manager.ts:213-233](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/manager.ts#L213-L233)

复用与端口冲突。

<details>
<summary>查看原文（21行）</summary>

```text
  private async doStart(portFallbackRounds = 0): Promise<ServiceSnapshot> {
    this.set({ state: 'detecting', error: null });
    const probe = await this.deps.probeService(this.opts.host, this.opts.port, this.opts.timeoutMs);
    if (probe === 'dsh') {
      // 已有服务在跑：直接复用
      if (this.stopRequested) return this.getSnapshot(); // 探测期间被叫停，不覆盖用户的停止意图
      this.set({ state: 'ready', url: this.url(), owned: false });
      this.startHealthWatch(); // 复用外部服务也要周期探测，失联时回 idle
      return this.getSnapshot();
    }
    if (probe === 'foreign') {
      // 端口被其他程序占用：自动临时替换为第一个空闲端口（仅本次会话生效，不写配置）。
      // 不自动启动时替换端口没有意义，保持原「端口被占用」提示。
      if (this.opts.autoStart) {
        const fallback = await findFreePort(
          this.opts.host, this.opts.port, PORT_FALLBACK_ATTEMPTS, this.deps.probeService, this.opts.timeoutMs,
        );
        if (fallback !== null) {
          if (this.stopRequested) return this.getSnapshot(); // 探测候选期间被叫停，不覆盖用户的停止意图
          this.deps.log(`[process] 端口 ${this.opts.port} 被其他程序占用，本次会话临时改用端口 ${fallback}`);
          this.deps.onPortFallback?.(this.opts.port, fallback);
```

</details>

**依据 3 · 源码核查**：[src/service/manager.ts:408-448](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/manager.ts#L408-L448)

启动后复用、临时换端口与超时。

<details>
<summary>查看原文（41行）</summary>

```text
        this.child = null;
        const reuse = await this.deps.probeService(this.opts.host, this.opts.port, this.opts.timeoutMs);
        // 自愈探测期间被叫停：保留 stop() 已设置的状态（idle），绝不覆盖为 failed
        if (this.stopRequested) return this.getSnapshot();
        if (reuse === 'dsh') {
          this.deps.log('[process] 子进程退出，但端口已有 dsh 服务在运行（残留实例占端口自愈），改为复用');
          this.set({ state: 'ready', url: this.url(), owned: false });
          this.startHealthWatch();
          return this.getSnapshot();
        }
        // 换端口重启：端口在启动期间被抢占，自动改用第一个空闲端口（仅本次会话，
        // 弹窗告知）；带轮数上限防死循环（每次崩溃都换新端口重启，最多 3 轮）。
        if (this.opts.autoStart && portFallbackRounds < PORT_FALLBACK_MAX_ROUNDS) {
          const fallback = await findFreePort(
            this.opts.host, this.opts.port, PORT_FALLBACK_ATTEMPTS, this.deps.probeService, this.opts.timeoutMs,
          );
          if (fallback !== null && !this.stopRequested) {
            this.deps.log(`[process] 子进程退出（端口 ${this.opts.port} 启动期间被抢占），本次会话临时改用端口 ${fallback} 重启`);
            this.deps.onPortFallback?.(this.opts.port, fallback);
            this.opts.port = fallback; // 运行时替换：本次会话内 URL/探测/重启均使用新端口
            return this.doStart(portFallbackRounds + 1); // 递归重启（新端口重新探测 + 启动）
          }
        }
        this.set({ state: 'failed', error: 'err.startCrashed' });
        return this.getSnapshot();
      }
      const result = await this.deps.probeService(this.opts.host, this.opts.port, this.opts.timeoutMs);
      if (result === 'dsh') {
        this.set({ state: 'ready', url: this.url(), owned: true });
        this.startHealthWatch();
        return this.getSnapshot();
      }
      // 'foreign' 表示子进程没能绑定端口（被占）——继续等待会让用户困惑，
      // 但可能只是服务尚未就绪的瞬间，保守起见继续轮询直到超时。
      if (Date.now() >= deadline) {
        this.set({
          state: 'failed',
          error: 'err.startTimeout',
          errorVars: { seconds: Math.round(startTimeoutMs / 1000) },
        });
        return this.getSnapshot();
```

</details>

**依据 4 · 源码核查**：[src/extension.ts:628-642](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/extension.ts#L628-L642)

实际捕获启动 URL。

<details>
<summary>查看原文（15行）</summary>

```text
  manager = new ServiceManager(toManagerOptions(config), {
    probeService,
    processRunner: createProcessRunner(),
    log: (line) => appendLog(line),
    // 端口被占用自动临时替换成功：弹窗告知用户新端口（仅本次会话，配置未变）
    onPortFallback: (requested, fallback) => {
      void vscode.window.showInformationMessage(t('msg.portFallback', { port: requested, fallback }));
    },
    // 捕获子进程 stdout 打印的启动网址（dsh web: http://…/?token=…）→ 自动会话兑换
    onLaunchUrl: (url) => {
      latestLaunchUrl = url;
      appendLog('[auth] 已捕获 DSH 启动网址（含登录 token），将自动完成登录');
      if (manager?.getSnapshot().state === 'ready') void runAuthOnce();
      // 未就绪：ready 的 onChange 里统一执行 runAuthOnce
    },
```

</details>

**依据 5 · 源码核查**：[src/service/session.ts:115-143](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/session.ts#L115-L143)

兑换、旧版与拒绝路径。

<details>
<summary>查看原文（29行）</summary>

```text
  const target = parseLaunchTarget(launchUrl);
  if (target === null) {
    // 不回显原文：启动网址含一次性 token，避免经错误提示/日志扩散
    return { status: 'rejected', authority: '(unknown)', reason: '启动网址无法解析（缺少有效的 token 参数）' };
  }
  const now = deps.now?.() ?? Date.now();
  const res = await deps.fetchImpl(launchUrl, { redirect: 'manual' });
  if (res.status === 200) return { status: 'no-auth', authority: target.authority }; // 旧版 dsh
  if (res.status === 303) {
    const cookie = extractDshCookie(res);
    if (cookie !== null) {
      const expiresAt = now + (cookie.maxAgeMs ?? FALLBACK_MAX_AGE_MS);
      const record: StoredSession = {
        cookie: `${cookie.name}=${cookie.value}`,
        expiresAt,
        authority: target.authority,
        issuedAt: now,
      };
      deps.store.set(SESSION_KEY_PREFIX + target.authority, record);
      return { status: 'ok', authority: target.authority, expiresAt };
    }
    // 303 但没有 dsh cookie：非预期（可能是别的 303 落点），保守拒绝
    return { status: 'rejected', authority: target.authority, reason: '303 响应未携带 dsh 会话 cookie' };
  }
  return {
    status: 'rejected',
    authority: target.authority,
    reason: `兑换请求返回 HTTP ${res.status}（token 可能已随服务重启失效，请提供最新的启动网址）`,
  };
```

</details>

**依据 6 · 源码核查**：[src/extension.ts:403-408](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/extension.ts#L403-L408)

按 authority 持久状态。

```text
  /** 会话存储适配：VS Code globalState（按 authority 分条，支持多 DSH 实例）。
   * 写入为 fire-and-forget，但必须兜底 rejection——Memento 写入失败不应变成未处理拒绝。 */
  const sessionStore: SessionStore = {
    get: (key) => context.globalState.get<StoredSession>(key),
    set: (key, value) => void context.globalState.update(key, value).then(undefined, () => {}),
    delete: (key) => void context.globalState.update(key, undefined).then(undefined, () => {}),
```

**依据 7 · 源码核查**：[src/service/proxy.ts:81-109](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/proxy.ts#L81-L109)

代理重写认证请求及过滤响应。

<details>
<summary>查看原文（29行）</summary>

```text
  const u = new URL(target.url);
  const headers: Record<string, string | string[]> = {};
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    const lower = name.toLowerCase();
    if (STRIP_REQUEST_HEADERS.has(lower)) continue;
    headers[lower] = value;
  }
  // Host 必须与 cookie 绑定的 authority 一致（服务端按 Host 校验），cookie 用会话记录覆盖
  headers.host = u.host;
  if (target.cookie !== undefined && target.cookie !== '') headers.cookie = target.cookie;
  return {
    hostname: u.hostname,
    port: u.port === '' ? (u.protocol === 'https:' ? 443 : 80) : Number(u.port),
    path: req.url ?? '/',
    method: req.method ?? 'GET',
    headers,
  };
}

/** 过滤响应头（剥离 set-cookie 等由本层管理的字段） */
export function filterResponseHeaders(raw: http.IncomingHttpHeaders): http.OutgoingHttpHeaders {
  const out: http.OutgoingHttpHeaders = {};
  for (const [name, value] of Object.entries(raw)) {
    if (value === undefined) continue;
    if (STRIP_RESPONSE_HEADERS.has(name.toLowerCase())) continue;
    out[name] = value;
  }
  return out;
```

</details>

**依据 8 · 源码核查**：[src/extension.ts:433-449](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/extension.ts#L433-L449)

401 删除会话并回到待判。

<details>
<summary>查看原文（17行）</summary>

```text
    const proxy = createDshProxy({
      getTarget: () => {
        if (manager!.getSnapshot().state !== 'ready') return null;
        const { host, port } = manager!.getTarget();
        const session = getValidSession(`${host}:${port}`, { fetchImpl: fetch, store: sessionStore });
        return { url: `http://${host}:${port}`, cookie: session?.cookie };
      },
      // 上游 401（会话失效/凭据被重置）：丢弃会话并回到 pending → runAuthOnce 重判
      // （自启且有可用启动网址则自动重兑；外部服务则落到「需要登录」引导页，不永久卡 401）
      onAuthFailure: () => {
        if (authSessionState !== 'ok') return; // 防抖：只在 ok 状态下降级
        appendLog('[auth] 上游返回 401：会话失效，重新判定…');
        const { host, port } = manager!.getTarget();
        dropSession(`${host}:${port}`, { fetchImpl: fetch, store: sessionStore });
        authSessionState = 'pending';
        refreshPanels();
        setTimeout(() => void runAuthOnce(), 500);
```

</details>

#### 缺口

- 未运行 VS Code/DSH，实际探测识别、认证刷新及状态竞态未知。
  **影响**：当前服务 ready、认证有效和桥接成功分别需要验证。
  **进一步探讨**：用受控端口模拟外部服务、子进程失败、303 缺 cookie 和失效后重新登录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 环回代理、远程和原生消息的实际边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

代理本机随机端口监听，其 HTTP 请求处理未见面板专属认证，并向已就绪上游附带持有的 cookie。环回绑定不构成同机调用者隔离。远程隧道默认按开关控制，WSL 有不同路径，隧道可达性要看实际 VS Code。桥接 Webview 校验消息窗口和来源，兼容 vscode-webview 及同端口回环别名，回执确认并不作为后续操作门禁。Host 支持打开绝对或相对路径，保存图片接受消息所给绝对 cwd 并校验缓存名，未把 cwd 限在工作区根。剪贴板通过 VS Code 权限读写，所信任的 iframe 与 DSH 页面因此是权限边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/service/proxy.ts:19-21](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/proxy.ts#L19-L21)

源码明示同机访问面。

```text
// 安全模型（重要，供维护者评估）：本代理把一个「已带 30 天会话 cookie 的 DSH API」暴露在
// 本机随机端口上，任意能连 127.0.0.1 的进程（含同机其他用户）都可驱动该会话——威胁面与
// DSH ≤0.1.1（127.0.0.1:3080 裸服务、无任何鉴权）相同或更窄（随机端口需先扫描），
```

**依据 2 · 源码核查**：[src/service/proxy.ts:125-136](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/proxy.ts#L125-L136)

无目标拒绝，准备好则代办。

<details>
<summary>查看原文（12行）</summary>

```text
  const handleRequest = (req: http.IncomingMessage, res: http.ServerResponse): void => {
    const target = deps.getTarget();
    if (target === null) {
      res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('DSH 代办目标未就绪（服务未启动或尚未完成登录）。');
      return;
    }
    const up = buildUpstreamRequest(req, target);
    const upReq = http.request(up, (upRes) => {
      // 会话失效信号（401 由服务端凭据/会话状态决定）：透传的同时通知调用方自愈
      if (upRes.statusCode === 401) deps.onAuthFailure?.();
      res.writeHead(upRes.statusCode ?? 502, filterResponseHeaders(upRes.headers));
```

</details>

**依据 3 · 源码核查**：[src/service/proxy.ts:213-231](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/proxy.ts#L213-L231)

监听地址与随机端口。

<details>
<summary>查看原文（19行）</summary>

```text
    start: async () => {
      if (server !== null) return; // 幂等
      const s = http.createServer(handleRequest);
      s.on('upgrade', handleUpgrade);
      server = s;
      await new Promise<void>((resolve, reject) => {
        s.once('error', reject);
        s.listen(0, '127.0.0.1', () => resolve());
      });
      const address = s.address();
      if (address === null || typeof address === 'string') throw new Error('proxy listen 失败');
      if (closed) {
        // 停用竞态：start 期间 stop() 已被调用，立即关掉刚完成的监听
        s.closeAllConnections?.();
        await new Promise<void>((resolve) => s.close(() => resolve()));
        return;
      }
      state.port = address.port;
      state.baseUrl = `http://127.0.0.1:${state.port}/`;
```

</details>

**依据 4 · 源码核查**：[src/panel/provider.ts:91-103](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/panel/provider.ts#L91-L103)

默认拦截隧道远程启动。

<details>
<summary>查看原文（13行）</summary>

```text
    this.render();
    // 远程窗口且未启用远程支持：仅显示占位页，绝不在此窗口启动远端 dsh 服务。
    if (this.remoteWindowDisabled()) return;
    // 面板打开即确保服务运行：复用已有或自动启动。
    void this.manager.ensureRunning();
  }

  /**
   * 当前窗口是否处于「远程隧道但未启用」状态：仅 SSH Remote/容器等需要隧道的远程窗口
   * （remoteKind='tunneled'）且 dsh.remote.enabled=false 时成立。
   * WSL（issue #13-3）不是隧道远程：vscode-server/dsh 同在一台 WSL 内、靠 localhost 转发直连，
   * 不需要（也不支持）asExternalUri——WSL 窗口与本地窗口同样默认可用，不拦。
   * 该状态下不拉起远端服务、不建隧道，仅展示引导占位页。
```

</details>

**依据 5 · 源码核查**：[src/remote.ts:62-89](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/remote.ts#L62-L89)

WSL 地址与远程解析逻辑。

<details>
<summary>查看原文（28行）</summary>

```text
export function toLocalhostUrl(url: string): string {
  try {
    const u = new URL(url);
    if (!LOOPBACK_HOSTS.has(u.hostname)) return url;
    u.hostname = 'localhost';
    return u.href;
  } catch {
    return url;
  }
}

/** asExternalUri 注入接口（生产接 vscode.env，测试注入假实现） */
export interface ExternalUriApp {
  asExternalUri(uri: UriLike): Promise<UriLike>;
}

/**
 * 构造「URL → 本地可达 URL」的解析器。
 * - 本地：asExternalUri 原样返回；
 * - 远程：VS Code 自动建隧道并返回本地 URI；
 * - asExternalUri 抛错时回退原 URL（不中断面板，本地可达场景仍可用）。
 */
export function createUrlResolver(app: ExternalUriApp) {
  return async (url: string): Promise<string> => {
    try {
      const r = await app.asExternalUri({ toString: () => url } as UriLike);
      return r.toString();
    } catch {
```

</details>

**依据 6 · 源码核查**：[src/panel/html.ts:119-129](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/panel/html.ts#L119-L129)

允许的来源。

<details>
<summary>查看原文（11行）</summary>

```text
  function isAllowedBridgeOrigin(o) {
    if (typeof o !== 'string') return false;
    if (o === ALLOWED_ORIGIN) return true;
    // webview SW 重写后的载体 origin（remote 场景实测；source 已限定为本 iframe，可接受）
    if (o.startsWith('vscode-webview://')) return true;
    // 127.0.0.1 / localhost 同端口互换（隧道/WSL 场景 host 替换后 src 与回流 origin 可能不同）
    try {
      const a = new URL(ALLOWED_ORIGIN);
      const b = new URL(o);
      const loopback = (h) => h === '127.0.0.1' || h === 'localhost' || h === '::1';
      return loopback(a.hostname) && loopback(b.hostname) && a.port === b.port;
```

</details>

**依据 7 · 源码核查**：[src/panel/html.ts:166-191](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/panel/html.ts#L166-L191)

窗口/来源守卫，回执与动作。

<details>
<summary>查看原文（26行）</summary>

```text
    // —— 上行：iframe 发来的消息，source + origin 双重校验 ——
    if (e.source !== iframeEl.contentWindow || !isAllowedBridgeOrigin(e.origin)) return;
    // 握手回执：统一形状 { kind:'bridgeAck', ok }（不带 token 字段），只读 ok
    if (d && d.kind === 'bridgeAck') {
      bridgeAcked = true;
      vscode.postMessage({
        type: 'bridgeAck',
        ok: d.ok === true,
        ...(typeof d.version === 'string' ? { version: d.version } : {}),
      });
      return;
    }
    // 打开外链：转发给扩展 → vscode.env.openExternal
    if (d && d.kind === 'openExternal' && typeof d.url === 'string') { vscode.postMessage({ type: 'bridgeOpenExternal', url: d.url }); return; }
    // 打开文件：转发给扩展 → showTextDocument（携带可选 cwd）
    if (d && d.kind === 'openFile' && typeof d.path === 'string') {
      vscode.postMessage({
        type: 'bridgeOpenFile', path: d.path,
        cwd: typeof d.cwd === 'string' ? d.cwd : undefined,
        missReason: typeof d.missReason === 'string' ? d.missReason : undefined,
      });
      return;
    }
    // 复制文本：转发给扩展 → vscode.env.clipboard.writeText（跨源 iframe 原生剪贴板 API 被 VS Code 拦截）
    if (d && d.kind === 'copyText' && typeof d.text === 'string' && typeof d.requestId === 'string') {
      vscode.postMessage({ type: 'bridgeCopyText', text: d.text, requestId: d.requestId });
```

</details>

**依据 8 · 源码核查**：[src/bridge/host.ts:188-200](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/bridge/host.ts#L188-L200)

文件绝对和相对路径。

<details>
<summary>查看原文（13行）</summary>

```text
export function resolveBridgePath(raw: string, sessionCwd: string | undefined, workspaceRoot: string | undefined):
  { kind: 'abs'; path: string } | { kind: 'invalid' } {
  // 路径形似 URL 一律拒绝（协议串）；Windows 盘符不属于协议，予以放行
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw) && !/^[a-zA-Z]:[\\/]/.test(raw)) {
    return { kind: 'invalid' };
  }
  // 绝对路径直接采用（跨平台：Windows 盘符与 POSIX / 开头都算绝对）
  if (isAbsolute(raw)) return { kind: 'abs', path: raw };
  // 相对路径：优先用会话 cwd，缺失时退回工作区根；两者都无则无法解析
  const base = sessionCwd ?? workspaceRoot;
  if (base === undefined) return { kind: 'invalid' };
  return { kind: 'abs', path: resolve(base, raw) };
}
```

</details>

**依据 9 · 源码核查**：[src/bridge/host.ts:45-71](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/bridge/host.ts#L45-L71)

绝对 cwd 和名字校验。

<details>
<summary>查看原文（27行）</summary>

```text
export async function saveImageToCwd(
  deps: ImageFileDeps,
  req: { cwd?: string; name: string; dataB64: string },
  registry: ImageRegistry = sharedImageRegistry,
): Promise<{ ok: boolean; path?: string; error?: string }> {
  if (typeof req.cwd !== 'string' || req.cwd === '' || !isAbsolute(req.cwd)) {
    return { ok: false, error: 'invalid cwd' };
  }
  // 文件名必须是普通名称（无路径分隔符/穿越）、符合白名单
  if (typeof req.name !== 'string' || basename(req.name) !== req.name || !IMAGE_CACHE_NAME_RE.test(req.name)) {
    return { ok: false, error: 'invalid filename' };
  }
  const target = join(req.cwd, req.name);
  // 防御：产物必须是 cwd 内的精确拼接（join 结果）
  if (target !== resolve(req.cwd, req.name)) {
    return { ok: false, error: 'path mismatch' };
  }
  if (typeof req.dataB64 !== 'string' || req.dataB64 === '') {
    return { ok: false, error: 'empty data' };
  }
  try {
    await deps.writeFile(target, req.dataB64);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
  registry.add(target);
  return { ok: true, path: target };
```

</details>

**依据 10 · 源码核查**：[src/bridge/host.ts:237-249](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/bridge/host.ts#L237-L249)

消息 cwd 可决定图片落盘位置。

<details>
<summary>查看原文（13行）</summary>

```text
  if (msg.type === 'bridgeSaveImage') {
    // 图片缓存落盘：白名单校验 + 路径安全由 saveImageToCwd 保证；回执 success/路径给 iframe
    // cwd 兜底：客户端通常不传会话 cwd（DSH 无轻量接口可取），回退到工作区根目录（=dsh 会话 cwd 的常用值）
    const r = await saveImageToCwd(
      { writeFile: deps.writeFile ?? (async () => {}), rmFile: deps.rmFile ?? (async () => {}) },
      { cwd: msg.sessionCwd ?? deps.workspaceRoot, name: msg.name, dataB64: msg.dataB64 },
    );
    await deps.reply?.({
      type: 'bridgeSaveImageAck',
      requestId: msg.requestId,
      ok: r.ok,
      ...(r.path === undefined ? {} : { path: r.path }),
    });
```

</details>

**依据 11 · 源码核查**：[src/panel/provider.ts:203-235](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/panel/provider.ts#L203-L235)

剪贴板实调用。

<details>
<summary>查看原文（33行）</summary>

```text
  private async copyTextToClipboard(msg: Extract<PanelMessage, { type: 'bridgeCopyText' }>): Promise<void> {
    let ok = false;
    try {
      await vscode.env.clipboard.writeText(msg.text);
      ok = true;
    } catch {
      // 写剪贴板失败：回执 ok=false，iframe 侧会 reject writeText，
      // DSH 会继续走自己的 execCommand('copy') 回退路径。
    }
    try {
      await this.view?.webview.postMessage({ type: 'bridgeCopyTextAck', requestId: msg.requestId, ok });
    } catch {
      // 面板可能已隐藏/销毁，回执发不出去也不影响扩展其它功能。
    }
  }

  /** 剪贴板桥接：扩展宿主读系统剪贴板，完成后回执给 webview（由顶层脚本转发给 iframe） */
  private async readTextFromClipboard(msg: Extract<PanelMessage, { type: 'bridgeReadText' }>): Promise<void> {
    let ok = false;
    let text: string | undefined;
    try {
      // 读取失败或内容为空时都回执 ok=false，iframe 侧放弃本次粘贴
      text = await vscode.env.clipboard.readText();
      ok = typeof text === 'string' && text !== '';
    } catch {
      // 读剪贴板失败（如系统无剪贴板权限）：回执 ok=false，iframe 侧静默放弃
    }
    try {
      await this.view?.webview.postMessage({
        type: 'bridgeReadTextAck',
        requestId: msg.requestId,
        ok,
        text,
```

</details>

#### 缺口

- 未测试同机其他进程、远程端口可见性、iframe 导航或工作区权限的组合。
  **影响**：接口规则可以被静态核对，但实际远程曝光不能只根据 README 的环回描述断言。
  **进一步探讨**：在隔离账户测试环回请求、隧道策略、合法及非法消息、非工作区 cwd。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、桥接写入和退出成本如何盘点？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根扩展需 VS Code 1.91 线和 DSH CLI 或兼容桌面入口，桥接启用时激活就尝试向指定 DSH profile 写 patch 和复制随包桥。目标跳过部分外来目录，复制失败尽力清理并写回旧 patch，非原子跨目录操作。卸载按标记移除且尝试清理副本，仍被其他 profile 用的共享副本保留。停用会尽力清图像缓存并关闭代理，是否停自启进程取决于 stopOnExit，globalState 会话继续保留。先用隔离工作区和 profile，比较桥关闭及开启后产生的目录变化。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:10-23](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/package.json#L10-L23)

VS Code 引擎与卸载入口。

<details>
<summary>查看原文（14行）</summary>

```text
  "engines": {
    "vscode": "^1.91.0"
  },
  "extensionKind": [
    "workspace",
    "ui"
  ],
  "categories": [
    "AI",
    "Chat",
    "Other"
  ],
  "main": "./out/extension.js",
  "uninstall": "node ./out/uninstall.js",
```

</details>

**依据 2 · 作者声明**：[README.md:21-37](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/README.md#L21-L37)

作者给出 DSH CLI 与外部分发条件。

<details>
<summary>查看原文（17行）</summary>

````text
## 🚀 Quick start

1. **Install the extension** from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=Fengze233.dsh-vscode-panel), or run:

   ```bash
   code --install-extension Fengze233.dsh-vscode-panel
   ```

2. **Click the DSH whale** in the left Activity Bar or the right Secondary Side Bar.
3. **Done.** The extension starts (or reuses) `dsh web`, signs the panel in, and shows DSH next to your code. No terminal, no browser tab, no manual login for a service it started itself.

**Prerequisite:** install the `dsh` CLI from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) and put it on your PATH — or install DSH Desktop on Windows. If `dsh` is missing, the extension shows a hint; `DSH: Show Logs` prints the detected path, source and version.

<details>
<summary><b>Other ways to install (VSIX / from source)</b></summary>

**VSIX package:** download the latest `dsh-vscode.vsix` from [Releases](https://github.com/Fengze233/dsh-vscode/releases), then in VS Code run `Extensions: Install from VSIX...` and reload the window.
````

</details>

**依据 3 · 源码核查**：[src/extension.ts:251-276](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/extension.ts#L251-L276)

激活安装桥接及降级。

<details>
<summary>查看原文（26行）</summary>

```text
  /** 桥接安装参数（dshHome / bridgeSourceDir 全插件共用，避免三处重复拼接；Windows 装配第三安装目标） */
  const installOpts = {
    profile: config.profile,
    dshHome: process.env.DSH_HOME ?? join(homedir(), '.dsh'),
    bridgeSourceDir: join(__dirname, 'bridge-client'),
    fs: createNodeFs(),
    npmGlobalNodeModules: resolveNpmGlobalNodeModules(config),
  };

  /**
   * 安全安装桥接：installBridge 的 IO 异常会直接抛出（Task 2 已知局限），
   * 此处 try/catch 捕获后按 degraded 处理（原因写入日志），绝不影响面板其它功能。
   */
  function safeInstallBridge(): BridgeInstallResult {
    try {
      return installBridge(installOpts);
    } catch (err) {
      appendLog(`[bridge] install failed: ${String(err)}`);
      return { status: 'degraded', reason: String(err) };
    }
  }

  // 激活时安装桥接：bridge.enabled=false 时不安装、不注入握手脚本、不评估、不弹警告
  if (config.bridgeEnabled) {
    install = safeInstallBridge();
  }
```

</details>

**依据 4 · 源码核查**：[src/bridge/installer.ts:198-213](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/bridge/installer.ts#L198-L213)

找到 profile 和过滤复制目标。

<details>
<summary>查看原文（16行）</summary>

```text
export function installBridge(opts: BridgeInstallOptions): BridgeInstallResult {
  const profileDir = detectProfileDir(opts.dshHome, opts.fs, opts.profile);
  if (profileDir === null) {
    return { status: 'degraded', reason: `${opts.profile ?? 'web'} profile not found` };
  }
  const patchPath = join(profileDir, 'cordis.patch.yml');
  const allTargets = bridgeTargetDirs(profileDir, opts.npmGlobalNodeModules);
  // 写入前的白名单校验（issue #20）：按**父目录**判定——父目录里已有非本扩展产物就跳过该目标。
  // 典型受害目录是 DSH Desktop 的私有命令目录（只允许它自己的 dsh.cmd）：哪怕目标子目录
  // 还不存在，只要往那里新建 `dsh-vscode-bridge/`，桌面下次启动就会硬失败。
  const targets = allTargets.filter((t) => !shouldSkipForeignTarget(dirname(t), opts.fs));
  // primary 路径保持兼容语义（BridgeInstallResult.bridgeDir）
  const bridgeDir = targets[0] ?? allTargets[0];

  // 读取现有 patch（不存在视为空，避免真实环境首次运行时 readFile 抛错）
  const existing = opts.fs.exists(patchPath) ? opts.fs.readFile(patchPath) : '';
```

</details>

**依据 5 · 源码核查**：[src/bridge/installer.ts:245-264](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/bridge/installer.ts#L245-L264)

首次安装顺序及失败回写。

<details>
<summary>查看原文（20行）</summary>

```text
  // 首次安装：写条目前保存原文，供 copyDir 失败时回滚，绝不残留「有条目但包不可用」。
  const originalPatch = existing;
  writePatchEntry(opts.fs, patchPath, existing);
  let failedTarget = '';
  try {
    // 全部目标位置复制：每处都成功才算安装成功。
    for (const t of targets) {
      failedTarget = t;
      copyBridgeDir(opts, t);
    }
  } catch (e) {
    // 任一处复制失败：尽力清理已复制的目录 + 还原 patch 原文，返回 degraded。
    // 清理为尽力而为（rmDir 可能同样抛错），核心是还原 patch 绝不残留「有条目但包不可用」。
    for (const t of targets) {
      try { opts.fs.rmDir(t); } catch { /* 忽略清理失败 */ }
    }
    opts.fs.writeFile(patchPath, originalPatch);
    // failedTarget 即失败时正在复制的目标路径，写入 reason 便于日志定位。
    return { status: 'degraded', reason: `copy failed at ${failedTarget}: ${errMsg(e)}`, profileDir, bridgeDir };
  }
```

</details>

**依据 6 · 源码核查**：[src/bridge/installer.ts:321-359](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/bridge/installer.ts#L321-L359)

标记移除与共享复制保留。

<details>
<summary>查看原文（39行）</summary>

```text
export function uninstallBridge(opts: BridgeInstallOptions): void {
  const profileDir = detectProfileDir(opts.dshHome, opts.fs, opts.profile);
  if (profileDir === null) return;
  const patchPath = join(profileDir, 'cordis.patch.yml');
  if (!opts.fs.exists(patchPath)) return;
  const patch = opts.fs.readFile(patchPath);
  const begin = patch.indexOf(BRIDGE_BEGIN_MARK);
  const end = patch.indexOf(BRIDGE_END_MARK);
  if (begin === -1 || end === -1) return;
  // 判断是否为空数组改写分支：begin 标记行携带 was-empty-array 元数据。
  // 只扫描 begin~end 之间的条目段，避免误判用户自身内容里的同名文本。
  const wasEmptyArray = patch.slice(begin, end).includes(BRIDGE_WAS_EMPTY_ARRAY_FLAG);
  // 删除 begin 标记行到 end 标记行（含两行及其后随换行），剩余前后内容拼接
  const restored = patch.slice(0, begin) + patch.slice(end + BRIDGE_END_MARK.length + 1);
  if (wasEmptyArray) {
    // 空数组改写分支：restored 即安装前的注释头，补回 []\n 实现字节级还原
    opts.fs.writeFile(patchPath, `${restored}[]\n`);
  } else {
    // 用户内容分支：归一化（去掉因追加/删除引入的多余空行与尾随空白）
    const normalized = restored.trim();
    if (normalized === '') {
      // 删除后仅剩空白：原为空数组/空文件，还原为 []
      opts.fs.writeFile(patchPath, '[]\n');
    } else {
      // 用户内容：去尾随空白后补单个换行，与安装前一致
      opts.fs.writeFile(patchPath, `${normalized}\n`);
    }
  }
  const targets = bridgeTargetDirs(profileDir, opts.npmGlobalNodeModules);
  // 当前 profile 的私有副本始终删除，共享副本仅在最后一个使用者卸载后删除。
  const removableTargets = hasOtherBridgeProfile(opts, profileDir) ? targets.slice(0, 1) : targets;
  // 全部目标目录删除均为尽力而为：权限锁死等场景下 rmDir 可能抛错，
  // 卸载的核心是回滚 patch 条目（保证 DSH 可干净启动），目录删除失败不应中断卸载。
  for (const dir of removableTargets) {
    if (opts.fs.exists(dir)) {
      try {
        opts.fs.rmDir(dir);
      } catch {
        // 忽略：目录残留不影响 DSH 启动，用户可后续手工清理
```

</details>

**依据 7 · 源码核查**：[src/extension.ts:850-871](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/extension.ts#L850-L871)

缓存、代理与进程退出策略。

<details>
<summary>查看原文（22行）</summary>

```text
export async function deactivate(): Promise<void> {
  // v0.3.0：图片缓存兜底清理（关闭 VS Code/停用扩展时，页面 pagehide 不必然触发）
  try {
    await cleanupAllImageCaches({ writeFile: async () => {}, rmFile: async (p) => { await nodeFs.unlink(p); } });
  } catch {
    // 清理失败不影响停用流程
  }
  // 停用本地代办代理（无条件：覆盖 start() 仍在进行中的停用窗口；会话 cookie 保留在
  // globalState，下次激活继续有效）
  if (authProxy !== null) {
    const proxy = authProxy;
    authProxy = null;
    authProxyStarted = false;
    try {
      await proxy.stop();
    } catch {
      // 停用清理失败不影响扩展退出
    }
  }
  const config = readConfig().config;
  if (config.stopOnExit) await manager?.stop();
  manager?.dispose();
```

</details>

#### 缺口

- 未确认发行 VSIX、实际宿主版本、缓存清理与并发恢复。
  **影响**：扩展的卸载、桥接移除、缓存清理与会话到期是四个操作边界。
  **进一步探讨**：盘点配置和目录 diff、修复人时、单次图像占用和退出后残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动阶段回执能否更容易定位认证和桥接故障？

**研究主题**：新假设与验证

#### 完整回答

现有管理器给启动、ready 和失败，认证和桥接有各自状态及日志。可试验在一处显示探测、spawn、认证兑换、代理和桥握手的阶段与最新失败类别，隐藏令牌和会话 cookie。比较原有分散状态与阶段视图在端口占用、失效会话和桥未装时的定位时间和重复尝试。

#### 证据与依据

**依据 1 · 源码核查**：[src/service/manager.ts:213-233](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/manager.ts#L213-L233)

管理器首段状态。

<details>
<summary>查看原文（21行）</summary>

```text
  private async doStart(portFallbackRounds = 0): Promise<ServiceSnapshot> {
    this.set({ state: 'detecting', error: null });
    const probe = await this.deps.probeService(this.opts.host, this.opts.port, this.opts.timeoutMs);
    if (probe === 'dsh') {
      // 已有服务在跑：直接复用
      if (this.stopRequested) return this.getSnapshot(); // 探测期间被叫停，不覆盖用户的停止意图
      this.set({ state: 'ready', url: this.url(), owned: false });
      this.startHealthWatch(); // 复用外部服务也要周期探测，失联时回 idle
      return this.getSnapshot();
    }
    if (probe === 'foreign') {
      // 端口被其他程序占用：自动临时替换为第一个空闲端口（仅本次会话生效，不写配置）。
      // 不自动启动时替换端口没有意义，保持原「端口被占用」提示。
      if (this.opts.autoStart) {
        const fallback = await findFreePort(
          this.opts.host, this.opts.port, PORT_FALLBACK_ATTEMPTS, this.deps.probeService, this.opts.timeoutMs,
        );
        if (fallback !== null) {
          if (this.stopRequested) return this.getSnapshot(); // 探测候选期间被叫停，不覆盖用户的停止意图
          this.deps.log(`[process] 端口 ${this.opts.port} 被其他程序占用，本次会话临时改用端口 ${fallback}`);
          this.deps.onPortFallback?.(this.opts.port, fallback);
```

</details>

**依据 2 · 源码核查**：[src/service/manager.ts:434-448](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/service/manager.ts#L434-L448)

探测成功和超时分离。

<details>
<summary>查看原文（15行）</summary>

```text
      const result = await this.deps.probeService(this.opts.host, this.opts.port, this.opts.timeoutMs);
      if (result === 'dsh') {
        this.set({ state: 'ready', url: this.url(), owned: true });
        this.startHealthWatch();
        return this.getSnapshot();
      }
      // 'foreign' 表示子进程没能绑定端口（被占）——继续等待会让用户困惑，
      // 但可能只是服务尚未就绪的瞬间，保守起见继续轮询直到超时。
      if (Date.now() >= deadline) {
        this.set({
          state: 'failed',
          error: 'err.startTimeout',
          errorVars: { seconds: Math.round(startTimeoutMs / 1000) },
        });
        return this.getSnapshot();
```

</details>

**依据 3 · 源码核查**：[src/extension.ts:474-499](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/extension.ts#L474-L499)

缓存登录、兑换与引导。

<details>
<summary>查看原文（26行）</summary>

```text
    if (authBusy) return;
    authBusy = true;
    try {
      const authority = serviceAuthority();
      if (getValidSession(authority, { fetchImpl: fetch, store: sessionStore }) !== undefined) {
        authSessionState = 'ok';
        ensureProxyStarted();
        refreshPanels();
        return;
      }
      const launch = latestLaunchUrl;
      if (launch !== null && parseLaunchTarget(launch) === null) {
        // 旧版 dsh（≤0.1.1）：启动网址无 token，无鉴权，直接可用
        appendLog('[auth] dsh 无浏览器鉴权（≤0.1.1），无需会话');
        authSessionState = 'ok';
      } else if (launch !== null) {
        const r = await exchangeSession(launch, { fetchImpl: fetch, store: sessionStore });
        if (r.status === 'ok') {
          appendLog(`[auth] 会话兑换成功（${r.authority}，有效期至 ${new Date(r.expiresAt).toLocaleString()}）`);
          authSessionState = 'ok';
        } else if (r.status === 'no-auth') {
          appendLog('[auth] dsh 无浏览器鉴权，无需会话');
          authSessionState = 'ok';
        } else {
          appendLog(`[auth] 启动网址兑换失败：${r.reason}`);
          authSessionState = 'needed'; // 网址已失效：面板引导用户粘贴最新启动网址
```

</details>

**依据 4 · 源码核查**：[src/panel/html.ts:166-175](https://github.com/Fengze233/dsh-vscode/blob/b1243baf6cda8de7f8a229e3c08a4f5a7e0fbc86/src/panel/html.ts#L166-L175)

桥回执单独。

<details>
<summary>查看原文（10行）</summary>

```text
    // —— 上行：iframe 发来的消息，source + origin 双重校验 ——
    if (e.source !== iframeEl.contentWindow || !isAllowedBridgeOrigin(e.origin)) return;
    // 握手回执：统一形状 { kind:'bridgeAck', ok }（不带 token 字段），只读 ok
    if (d && d.kind === 'bridgeAck') {
      bridgeAcked = true;
      vscode.postMessage({
        type: 'bridgeAck',
        ok: d.ok === true,
        ...(typeof d.version === 'string' ? { version: d.version } : {}),
      });
```

</details>

#### 缺口

- 新界面没有用户对照，额外状态可能只是重复日志。
  **影响**：成功标准是更快定位实际失败阶段并降低泄漏，不能只看启动。
  **进一步探讨**：同一组故障分别计定位准确、恢复分钟和错误重试。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
