# DSH Desktop

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3460867](https://github.com/vibeinging/dsh-desktop/tree/346086747039398fb0cb8075ca1941b7cb1b4bc0)

<!-- BEGIN META -->
[![GitHub ★ 486](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=486&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vibeinging/dsh-desktop)
<!-- END META -->

> **功能**：运行官方 DSH Web 与固定社区 Bundle 的 Electron 桌面发行版，提供启动、更新和恢复。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 固定离线包、profile暂存发布和桌面生命周期整合，复用官方会话/Web而不建第二插件真相源。

> **主要限制**：[Q03](#research-q03) safe是另home不证原数据恢复，外层三次不等内层退避有限，远程/在途权限另核。

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
  - [Q01 · 社区Desktop相对官方Web增加什么？](#detail-section-11)
  - [Q02 · 桌面启动和离线profile怎么形成？](#detail-section-12)
  - [Q03 · safe模式和重启是不是原数据恢复？](#detail-section-13)
  - [Q04 · 怎样可控采用，改进怎样证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望少拼DSH Web及社区插件环境的桌面用户。

直接官方DSH CLI/Web及手装同bundle；根贡献部署/状态组织。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 官方Web桌面 | 统一会话/插件体验 | 功能多归上游bundle |
| 固定离线初始化 | 新profile默认环境 | 外部模型/市场/远程非离线 |
| 恢复/safe | 隔离诊断 | 另home非原数据修复 |
| 分层重启 | 恢复进程连接 | 外层有界，内层退避无次数限 |
| 远程bundle | 可选继续同Host任务 | 第三方身份/权限单独核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持平台/打包Electron | 必需 | 桌面/后端 | 平台声明未验 |
| 官方runtime/固定tgz/可写数据根 | 必需 | profile/会话 | hash/初始化失败需停 |
| 模型与独立bundle服务 | 对应能力需要 | Agent/工作台 | 不由根保证效果 |
| 第三方远程账号/身份 | 远程可选 | 跨端控制 | 另核授权撤销 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 首跑 | 用户独立根/模型配置 | 核profile/固定包 |
| 使用 | 官方Web会话 | 只按授权工具 |
| 故障 | 区分Server/runtime/safe | safe不当原恢复 |
| 退出 | 导出核路径/凭据 | 回官方Web/CLI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 客户端/bundle磁盘 | 下载配置profile | 节时未知 |
| 持续 | 模型/Electron/后台 | 跟随runtime升级 | 总成本未测 |
| 失败恢复 | 备份/safe/重启资源 | 分层查会话与在途 | 不证无损 |
| 退出 | DSH数据/身份保留 | 迁移核路径/停远程 | 卸载不删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 默认环境 | 固定包/暂存校验 | 实际首跑/升级节时 |
| 桌面能力 | 官方Web与Host组织 | 全bundle正确性 |
| 恢复 | 分层重启/独立safe | 原任务完整性 |
| 退出 | 数据根独立 | 全凭据撤销/迁移 |

> **思考**：[Q03](#research-q03) safe是另home不证原数据恢复，外层三次不等内层退避有限，远程/在途权限另核。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 固定离线包、profile暂存发布和桌面生命周期整合，复用官方会话/Web而不建第二插件真相源。

[Q02](#research-q02)暂存校验/固定tgz/隔离窗口可取；[Q03](#research-q03)必须分正常/safe与两层restart，不能把诊断当恢复验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) safe是另home不证原数据恢复，外层三次不等内层退避有限，远程/在途权限另核。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 独立根核正常/升级/safe和旧会话，不清停迁真实资料并回官方CLI/Web。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核桌面后端/官方runtime/profile与恢复关键链，未安装/运行发行物或远程服务；独立数据根试用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、electron/main.js、electron/runtime-recovery.js、server/src/engine/dsh_runtime/client.js、server/src/engine/dsh_runtime/profile_initialization.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：README/package/main启动/窗口/恢复、runtime-recovery及同提交client/profile_initialization关键段；复核旧findings。未全面审updater/所有预装bundle/远程协议/平台发布物，不执行目标。
- 下一步：独立根核首次/升级保留/失败staging、两层重启、safe旧会话和退出路径；远程另经授权验身份撤销。

**分析版本**

- **仓库**：[vibeinging/dsh-desktop](https://github.com/vibeinging/dsh-desktop)
- **版本号**：0.2.5（[固定提交 3460867](https://github.com/vibeinging/dsh-desktop/tree/346086747039398fb0cb8075ca1941b7cb1b4bc0)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 展示home/版本/bundle/会话与重启层差异收据；误重置/定位时间不改善或诱误迁移即否定。

独立根核首次/升级保留/失败staging、两层重启、safe旧会话和退出路径；远程另经授权验身份撤销。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 2522 | — | — | 57108 |
| .js | source | 304 | 87603 | 75282 | 6493 | — |
| .mjs | source | 111 | 22858 | 21044 | 464 | — |
| .cjs | source | 2 | 474 | 442 | 9 | — |
| .js | example | 1 | 95 | 90 | 2 | — |
| .cjs | example | 1 | 249 | 239 | 0 | — |
| .mjs | test | 156 | 32189 | 30078 | 300 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/vibeinging/dsh-desktop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/vibeinging/dsh-desktop/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/vibeinging/dsh-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查桌面发行启动/离线profile/分层恢复与真实数据归属。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 社区Desktop相对官方Web增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是Electron桌面客户端/发行版，不是根级DSH插件。面向希望少拼环境、用官方Web和社区插件的用户，整合窗口、原生文件选择/更新/恢复、固定Bundle与同一profile管理。官方Session/Agent/工具和Web本身仍由上游提供，侧栏/远程/任务能力由独立bundle继承，不能把预装数量当根原创能力或真实用户成功。

合格结果是正常/升级/故障后仍可辨同一profile和会话并执行授权任务，比手工官方CLI/Web多的是发行/状态组织，非新的Agent推理。README平台签名与远程加密是作者声明，本轮不下载验证发行物/远程协议；离线初始化不等所有模型、市场和远程功能离线。已有稳定官方Web环境用户可继续原办法。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:24-39](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/README.md#L24-L39)

作者社区发行与数据目录。

<details>
<summary>查看原文（16行）</summary>

```text
DSH Desktop（插件集成版 / Bundle Edition）是一个社区维护的桌面发行版。它直接运行官方 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) npm 运行时与官方 `dsh-web-app`，并预装一组经过固定和验证的社区 Bundle。你不需要先搭环境、找插件或维护另一套插件状态，打开应用即可从同一个 Profile 开始工作。

[官网](https://dshdesktopstation.com/) · [下载最新版](https://github.com/vibeinging/dsh-desktop/releases/latest) · [手机远程](https://dshdesktopstation.com/remote/) · [开始使用](#开始使用) · [安装插件](#安装更多插件)

## 下载

| 平台 | 安装方式 | 状态 |
| --- | --- | --- |
| macOS Apple Silicon | 下载 `.dmg`，拖入“应用程序” | Developer ID 签名并完成 Apple 公证 |
| Windows x64 | 下载 `.exe`，选择安装范围与客户端目录 | 以当前 [Release](https://github.com/vibeinging/dsh-desktop/releases/latest) 页面提供的产物为准 |
| Linux x64 | AppImage | 测试邀请阶段，见 [Linux 支持跟踪 Issue #19](https://github.com/vibeinging/dsh-desktop/issues/19) |
| macOS Intel | 暂无正式安装包 | 可以从源码运行 |

各平台直链与文件大小见[官网下载页](https://dshdesktopstation.com/#download)；首跑常见问题（Gatekeeper、SmartScreen、API Key、国内下载）见[官网 FAQ](https://dshdesktopstation.com/#faq)。

客户端安装目录只保存应用程序。Profile、插件、Session 和其他 DSH 数据由独立的数据目录管理；更换客户端安装位置不会迁移或删除这些数据。
```

</details>

**依据 2 · 源码核查**：[README.md:43-81](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/README.md#L43-L81)

官方Web/插件/恢复/第三方服务归因。

<details>
<summary>查看原文（39行）</summary>

```text
<table>
  <tr>
    <td width="50%" valign="top">
      <h3>官方对话与 Agent</h3>
      <p>主窗口就是官方 DSH Web。Session、Agent、Tool、Skill、MCP、设置和历史由 DSH 自己管理，没有第二套 Chat 页面。</p>
    </td>
    <td width="50%" valign="top">
      <h3>Better Sidebar 工作台</h3>
      <p>内置文件树、代码与 Markdown 编辑、Git、终端、网页与扩展 Tab。0.18.0-alpha.0 对接当前 alpha SDK，并保留多仓库、Worktree、Vue 文件和本地 Markdown 图片等能力。</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>插件市场</h3>
      <p>在官方设置页里发现、安装、更新、停用和卸载插件。界面、CLI 和应用重启都以同一个 Profile 为准。</p>
    </td>
    <td width="50%" valign="top">
      <h3>任务、附件与 Worktree</h3>
      <p>任务看板、文件和文件夹附件、Git Worktree、项目工具、Office 与结构化结果都由独立 Bundle 提供，可以按需组合。</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>桌面 Host 与恢复</h3>
      <p>应用负责窗口、原生文件选择、更新、启动和恢复。正式安装包通过右上角按钮提示更新，悬停可看更新日志，点击后才下载、预检 Profile 并安装；Profile 或 Client 出错时进入恢复页。</p>
    </td>
    <td width="50%" valign="top">
      <h3>可复现的默认环境</h3>
      <p>新 Profile 从随包固定产物离线初始化；普通启动不重写已有 Profile，也不会把用户卸载的插件悄悄装回来。</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>手机远程</h3>
      <p>登录并启用当前电脑后，可以从 Android、Remote Web 或另一台 Desktop 继续同一 Workspace 和 Session。Host 只建立出站连接，不开放公网监听端口。</p>
    </td>
    <td width="50%" valign="top">
      <h3>明确的服务边界</h3>
      <p>当前账号、设备目录、信令和中继由第三方服务提供；连接方式、安全边界和停用方法见<a href="https://dshdesktopstation.com/remote/">手机远程说明</a>。</p>
```

</details>

**依据 3 · 源码核查**：[package.json:1-9](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/package.json#L1-L9)

Electron根入口和版本。

```text
{
  "name": "dsh-desktop",
  "private": true,
  "version": "0.2.5",
  "license": "MIT",
  "productName": "DSH Desktop",
  "main": "electron/main.js",
  "engines": {
    "node": ">=24"
```

#### 缺口

- 发行物/平台与真实任务/升级对照未验。
  **影响**：不能证明打开即用或完整平台安全。
  **进一步探讨**：独立数据根对比官方Web首跑/升级/会话恢复和人工步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桌面启动和离线profile怎么形成？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Electron生产用自身Node模式起本地Server，经IPC通道等ready；Server runtime client解析官方分发，设置DSH_HOME/profile web并ensure初始化，再启动官方CLI --patch --profile web --no-open获取client surface。主窗口contextIsolation/nodeIntegration=false/sandbox存在，不是直接授渲染器Node权限。

新profile在临时staging home初始化，固定tgz输入哈希校验，add带save-exact/offline/ignore-scripts，manifest/dump-config通过后rename发布并重定位链接，失败清staging；已有profile走reconcile而非无条件覆盖。进程内按home/profile队列和最后存在性拒绝竞争有实防护，不等跨进程全事务。统一profile避免另建插件数据库，但预装多bundle扩大兼容/权限面，应逐插件审查。

#### 证据与依据

**依据 1 · 源码核查**：[electron/main.js:731-778](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/electron/main.js#L731-L778)

生产后端启动/IPC/数据home。

<details>
<summary>查看原文（48行）</summary>

```text
  const entryAbs = path.join(SERVER_DIR, entryRel);
  if (!fs.existsSync(entryAbs)) return Promise.reject(new Error(`Server 入口不存在: ${entryAbs}`));
  // dev: system node; prod: Electron runs backend in Node mode (self-contained, requires electron-rebuild for native modules)
  const cmd = isDev ? (process.env.DSH_NODE_BIN || 'node') : process.execPath;
  const args = isDev ? [entryRel] : [entryAbs];
  const env = { ...process.env };
  env.DSH_DATA_ROOT = DATA_ROOT;
  env.DSH_APP_ROOT = APP_ROOT;
  env.DSH_RUNTIME_HOME = runtimeHomeOverride;
  env.DSH_DESKTOP_PROFILE_NAME = 'web';
  env.DSH_PROFILE_PLUGIN_LIBRARY = path.join(runtimeHomeOverride, 'plugin-library');
  env.DSH_FEATURED_PLUGIN_TARBALL_DIR = FEATURED_PLUGIN_ARTIFACT_DIR;
  env.DSH_FEATURED_PLUGIN_MANIFEST = path.join(FEATURED_PLUGIN_ARTIFACT_DIR, 'manifest.json');
  env.DSH_PNPM_BIN_DIR = PNPM_BIN_DIR;
  if (!isDev) env.DSH_PNPM_REQUIRED = '1';
  env.DSH_APP_VERSION = app.getVersion();
  env.DSH_APP_NAME = runtimeAppName; // 构建身份只用于 DSH 运行时标识，不接受用户输入
  env.DSH_RUNTIME_DISTRIBUTION = process.env.DSH_RUNTIME_DISTRIBUTION || 'npm';
  if (!isDev) env.DSH_NPM_PACKAGE_ROOT = path.join(SERVER_DIR, 'node_modules', '@deepseek-ai', 'dsh');
  env.DSH_DESKTOP_WEB_PORT = String(rendererSurfacePort);
  if (profileInitializationMode === 'safe') env.DSH_PROFILE_INITIALIZATION_MODE = 'safe';
  else delete env.DSH_PROFILE_INITIALIZATION_MODE;
  if (isDev) {
    env.DSH_SOURCE_ROOT = process.env.DSH_SOURCE_ROOT || path.resolve(APP_ROOT, '..', 'test-vibeinging');
    env.DSH_FEATURED_PLUGIN_SOURCE_ROOT = APP_ROOT;
    env.DSH_FEATURED_PLUGIN_ALLOW_SOURCE = '1';
  }
  applyNetworkEnv(env);
  if (isDev) env.DSH_TCP = '1'; // dev: backend also listens on TCP so eval can reuse running instance; prod: process channel only (portless)
  if (!isDev) env.ELECTRON_RUN_AS_NODE = '1';

  backendState = 'starting';
  backendReadyPromise = new Promise((resolve, reject) => {
    backendReadyResolve = resolve;
    backendReadyReject = reject;
  });
  backendReadyTimer = setTimeout(() => {
    const error = new Error(`本地 Server 启动超时(${BACKEND_START_TIMEOUT_MS}ms)`);
    backendReadyReject?.(error);
    backendReadyResolve = null;
    backendReadyReject = null;
    backendState = 'failed';
    forceKillBackend(backendProc);
  }, BACKEND_START_TIMEOUT_MS);

  try {
    // stdio fd 4 uses 'ipc' to build process message channel (process.send/on('message')), no socket or port transport
    const child = spawn(cmd, args, { cwd: SERVER_DIR, env, stdio: ['ignore', 'inherit', 'inherit', 'ipc'] });
```

</details>

**依据 2 · 源码核查**：[server/src/engine/dsh_runtime/client.js:308-366](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/server/src/engine/dsh_runtime/client.js#L308-L366)

官方runtime/profile/CLI链。

<details>
<summary>查看原文（59行）</summary>

```text
  async #start() {
    const resolved = resolveDshRuntimeDistribution({ env: this.env });
    if (!resolved) throw new Error("DSH 运行时未启用");
    this.clientSurface = null;
    this.clientLaunchUrl = null;
    this.clientSurfaceError = null;
    this.clientAuthCookie = null;
    this.runtimeVersion = null;
    this.remoteStreamProtocol = false;
    this.clientReadyPromise = new Promise((resolve, reject) => {
      this.clientReadyResolve = resolve;
      this.clientReadyReject = reject;
    });
    void this.clientReadyPromise.catch(() => {});
    const dshHome = this.env.DSH_RUNTIME_HOME || dataRoot();
    const childEnv = {
      ...process.env,
      ...this.env,
      DSH_RUNTIME_DISTRIBUTION: resolved.distribution,
      DSH_RUNTIME_VERSION: resolved.version || "",
      DSH_HOME: dshHome,
      DSH_DESKTOP_PROFILE_NAME: "web",
      DSH_TELEMETRY_DISABLED: this.env.DSH_TELEMETRY_DISABLED || "1",
      DSH_APP_BOOT_PATH: resolved.appBootPath,
      DSH_RUNTIME_INSTALL_ANCHOR: resolved.installAnchor,
      ...(resolved.profileBootPath ? { DSH_PROFILE_BOOT_PATH: resolved.profileBootPath } : {}),
    };
    await ensureDshProfileInitialized({
      resolved,
      dshHome,
      env: childEnv,
      appRoot: this.env.DSH_APP_ROOT,
    });
    const profileNodeModules = join(dshHome, "profiles", "web", "node_modules");
    const electronProfileLoader = resolved.distribution === "npm"
      && process.versions.electron
      && existsSync(profileNodeModules);
    const execArgv = resolved.execArgv;
    if (electronProfileLoader) {
      childEnv.DSH_PROFILE_NODE_MODULES = profileNodeModules;
      childEnv.DSH_PROFILE_MODULE_LOADER_PATH = PROFILE_MODULE_LOADER_PATH;
    }
    let launchPath = CHILD_PATH;
    let launchArgs = [];
    if (resolved.launch === "cli") {
      launchPath = NPM_RUNTIME_CHILD_PATH;
      childEnv.DSH_CLI_ENTRY_PATH = resolved.entryPath;
      // DSH 0.1.5's launcher parses its own flags first and hands everything
      // after the profile token to the booted app, so --patch must precede the
      // profile; --no-open is the web app's own flag and suppresses the
      // auto-opened browser (the desktop app renders the surface itself).
      launchArgs = ["--patch", CLIENT_PATCH_PATH, "--profile", "web", "--no-open"];
    }
    const child = this.spawn(launchPath, launchArgs, {
      execPath: process.execPath,
      execArgv,
      cwd: resolved.root,
      env: childEnv,
      stdio: ["ignore", "inherit", "inherit", "ipc"],
```

</details>

**依据 3 · 源码核查**：[server/src/engine/dsh_runtime/profile_initialization.js:218-253](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/server/src/engine/dsh_runtime/profile_initialization.js#L218-L253)

固定tgz校验。

<details>
<summary>查看原文（36行）</summary>

```text
  if (env.DSH_PROFILE_INITIALIZATION_MODE === "safe") return [];
  const generated = artifactManifest(env);
  const artifactDir = String(env.DSH_FEATURED_PLUGIN_TARBALL_DIR || "").trim();
  const artifactMode = Boolean(generated) || Boolean(artifactDir && existsSync(artifactDir));
  return featuredPlugins().map((plugin) => {
    const artifact = generated?.get(plugin.name);
    if (artifact) {
      if (typeof artifact.tarball !== "string" || typeof artifact.sha256 !== "string" || typeof artifact.version !== "string") {
        throw profileError(`${plugin.name} 的精选插件产物记录不完整`, "DSH_FEATURED_PLUGIN_MANIFEST_INVALID");
      }
      const artifactRoot = resolve(artifactDir || dirname(env.DSH_FEATURED_PLUGIN_MANIFEST));
      const filename = artifact.tarball;
      if (!/^[A-Za-z0-9._+-]+\.tgz$/.test(filename)) {
        throw profileError(`${plugin.name} 的固定 tarball 文件名无效`, "DSH_FEATURED_PLUGIN_TARBALL_INVALID");
      }
      const sourcePath = resolve(artifactRoot, filename);
      const sourceRelative = relative(artifactRoot, sourcePath);
      if (sourceRelative === ".." || sourceRelative.startsWith(`..${sep}`) || isAbsolute(sourceRelative)) {
        throw profileError(`${plugin.name} 的固定 tarball 路径越出产物目录`, "DSH_FEATURED_PLUGIN_TARBALL_INVALID");
      }
      if (!existsSync(sourcePath)) {
        throw profileError(`${plugin.name} 的固定 tarball 不存在：${sourcePath}`, "DSH_FEATURED_PLUGIN_TARBALL_MISSING");
      }
      if (sha256(sourcePath) !== artifact.sha256) {
        throw profileError(`${plugin.name} 的 tarball SHA-256 校验失败`, "DSH_FEATURED_PLUGIN_TARBALL_HASH_MISMATCH");
      }
      return {
        source: `file:${sourcePath}`,
        tarball: sourcePath,
        tarballName: filename,
        sha256: artifact.sha256,
        version: artifact.version,
      };
    }
    if (artifactMode) {
      throw profileError(`${plugin.name} 缺少固定 tarball 产物记录`, "DSH_FEATURED_PLUGIN_MANIFEST_MISSING");
```

</details>

**依据 4 · 源码核查**：[server/src/engine/dsh_runtime/profile_initialization.js:528-632](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/server/src/engine/dsh_runtime/profile_initialization.js#L528-L632)

staging/校验/发布/队列。

<details>
<summary>查看原文（105行）</summary>

```text
async function initializeUnlocked({
  resolved,
  dshHome,
  env = process.env,
  appRoot,
  profileApi,
  commandRunner = defaultCommandRunner,
} = {}) {
  if (!resolved || !dshHome) throw profileError("缺少 DSH Profile 初始化上下文", "DSH_PROFILE_INIT_CONTEXT_MISSING");
  const api = profileApi || await import(pathToFileURL(resolved.appBootPath).href);
  const home = resolve(dshHome);
  const finalProfileDir = profilePath(api, home);
  const finalManifestPath = join(finalProfileDir, "package.json");
  if (existsSync(finalManifestPath)) {
    return reconcileExistingProfile({
      resolved,
      home,
      env,
      appRoot: appRoot || resolve(env.DSH_APP_ROOT || process.cwd()),
      api,
      profileDir: finalProfileDir,
      commandRunner,
    });
  }
  if (existsSync(finalProfileDir)) {
    throw profileError(`DSH Profile 目录存在但缺少 manifest：${finalProfileDir}`, "DSH_PROFILE_INCOMPLETE");
  }

  const libraryRoot = resolve(env.DSH_PROFILE_PLUGIN_LIBRARY || join(home, "plugin-library"));
  mkdirSync(home, { recursive: true });
  const inputs = pluginInputs(env, appRoot || resolve(env.DSH_APP_ROOT || process.cwd()));
  const sources = inputs.map((input, index) => materializeTarball(input, featuredPlugins()[index], libraryRoot));
  const stagingHome = mkdtempSync(join(dirname(home), ".dsh-profile-init-"));
  const commandEnv = controlledDshPluginEnvironment({
    ...env,
    DSH_PROFILE_INITIALIZATION: "1",
    DSH_HOME: stagingHome,
    pnpm_config_lockfile: "false",
  }, { dshHome: stagingHome, libraryRoot });
  try {
    const stagingProfileDir = profilePath(api, stagingHome);
    const profileTemplate = api.PROFILE_TEMPLATES?.web;
    const templateBundles = Array.isArray(profileTemplate)
      ? profileTemplate
      : profileTemplate?.bundles || api.DEFAULT_PROFILE_BUNDLES || OFFICIAL_PROFILE_BUNDLES;
    const templatePatchReload = Array.isArray(profileTemplate) ? undefined : profileTemplate?.patchReload;
    await api.initProfile(stagingProfileDir, templateBundles, templatePatchReload);
    if (env.DSH_PROFILE_INITIALIZATION_MODE !== "safe") {
      for (const source of sources) {
        await commandRunner(resolved, [
          "plugin", "--profile", PROFILE_NAME, "add", "-w", source,
          "--save-exact", "--offline", "--ignore-scripts",
        ], commandEnv);
      }
    }
    const manifest = api.readProfileManifest("dsh-work", stagingProfileDir);
    const expectedBundles = env.DSH_PROFILE_INITIALIZATION_MODE === "safe"
      ? OFFICIAL_PROFILE_BUNDLES
      : featuredPlugins().map((plugin) => plugin.name);
    assertInitialProfile(manifest, expectedBundles, {
      requireDependencies: env.DSH_PROFILE_INITIALIZATION_MODE !== "safe",
    });
    await commandRunner(resolved, ["--profile", PROFILE_NAME, "--dump-config"], commandEnv);
    writeFeaturedState(
      stagingProfileDir,
      env.DSH_PROFILE_INITIALIZATION_MODE === "safe" ? [] : featuredPlugins().map((plugin) => plugin.name),
      new Map(inputs.flatMap((input, index) => {
        const state = artifactState(input);
        return state ? [[featuredPlugins()[index].name, state]] : [];
      })),
    );
    mkdirSync(dirname(finalProfileDir), { recursive: true });
    if (existsSync(finalManifestPath) || existsSync(finalProfileDir)) {
      throw profileError("DSH Profile 在初始化期间被其他操作创建", "DSH_PROFILE_INIT_RACE");
    }
    renameSync(stagingProfileDir, finalProfileDir);
    try {
      rebasePublishedProfileLinks(finalProfileDir, stagingProfileDir, finalProfileDir);
    } catch (error) {
      renameSync(finalProfileDir, stagingProfileDir);
      throw error;
    }
    return Object.freeze({
      created: true,
      initialized: true,
      profileDir: finalProfileDir,
      pluginLibrary: libraryRoot,
      bundles: Object.freeze([...(manifest.dsh?.profile?.bundles || [])]),
    });
  } finally {
    unlinkStagingProfileFallbacks(stagingHome);
    rmSync(stagingHome, { recursive: true, force: true });
  }
}

/** Initialize a new Web Profile or offer newly bundled defaults to an existing Profile once. */
export function ensureDshProfileInitialized(options = {}) {
  const key = `${resolve(options.dshHome || ".")}\u0000${PROFILE_NAME}`;
  const previous = initializationQueues.get(key) || Promise.resolve();
  const current = previous.catch(() => {}).then(() => initializeUnlocked(options));
  initializationQueues.set(key, current);
  return current.finally(() => {
    if (initializationQueues.get(key) === current) initializationQueues.delete(key);
  });
}
```

</details>

**依据 5 · 源码核查**：[electron/main.js:1419-1424](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/electron/main.js#L1419-L1424)

窗口隔离基线。

```text
      // Node, ipcRenderer, or a product preload. Native capabilities must be
      // reached through an explicit DSH Host service or a trusted native page.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      navigateOnDragDrop: false,
```

#### 缺口

- 真实打包模块/官方版本与跨进程竞争未验。
  **影响**：源码组织不等发行物/升级无损。
  **进一步探讨**：验证包摘要/固定依赖后核新建、已有profile变更保留与中途失败。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · safe模式和重启是不是原数据恢复？

**研究主题**：缺陷与关键质疑

#### 完整回答

safeProfileHome明确dataRoot/safe-profile，恢复动作先停后端并把runtimeHome切这个独立home，safe初始化只官方基础bundles；安全页能启动不能证明原profile损坏已修、旧会话找回或插件恢复。恢复记录resolved也记录action而非原数据完整性验收。诊断文本有长度/敏感字段模式过滤和0600写盘，属于降披露措施不是所有自由文本都已匿名。

必须分两层重启：Electron本地Server连续失败最多三次且稳定60秒重置；内层DSH runtime client是1/2/4到8秒上限的退避，失败再次schedule无次数上限。不能把外层有界外推所有子运行时都三次停止。重启重挂Session和回放审批仍需最终任务对账，超时/断连不证明旧工具远端停止。README新增默认远程会用第三方账号/中继/长期设备身份，未启用前和启用后条件不同；本轮未审协议不把出站连接当无远程权限风险。

#### 证据与依据

**依据 1 · 源码核查**：[electron/runtime-recovery.js:81-99](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/electron/runtime-recovery.js#L81-L99)

resolved动作/独立safe home。

<details>
<summary>查看原文（19行）</summary>

```text
function recordRecoveryResult({ userDataPath, action, message = null, fsImpl = fs }) {
  const previous = loadRecoveryState(userDataPath, fsImpl);
  return saveRecoveryState(userDataPath, {
    ...previous,
    status: 'resolved',
    last_result: {
      action: text(action, 80) || 'unknown',
      message: message ? text(message, MAX_FAILURE_MESSAGE_LENGTH) : null,
      at: new Date().toISOString(),
    },
  }, fsImpl);
}

function safeProfileHome(dataRoot) {
  return path.join(path.resolve(dataRoot), 'safe-profile');
}

function profilePathForHome(dshHome) {
  return path.join(path.resolve(dshHome), 'profiles', 'web');
```

</details>

**依据 2 · 源码核查**：[electron/main.js:1314-1322](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/electron/main.js#L1314-L1322)

恢复切home真实接线。

```text
    if (action === 'retry' || action === 'safe-profile') {
      await stopBackendGracefully();
      forceStopBackend();
      const safe = action === 'safe-profile';
      runtimeHomeOverride = safe ? safeProfileHome(DATA_ROOT) : DATA_ROOT;
      profileInitializationMode = safe ? 'safe' : 'normal';
      recordRecoveryResult({ userDataPath: app.getPath('userData'), action });
      destroyMainWindowImmediately();
      await startApplicationWindow({ runtimeHome: runtimeHomeOverride, profileMode: profileInitializationMode });
```

**依据 3 · 源码核查**：[server/src/engine/dsh_runtime/profile_initialization.js:574-589](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/server/src/engine/dsh_runtime/profile_initialization.js#L574-L589)

safe基础组成。

<details>
<summary>查看原文（16行）</summary>

```text
    await api.initProfile(stagingProfileDir, templateBundles, templatePatchReload);
    if (env.DSH_PROFILE_INITIALIZATION_MODE !== "safe") {
      for (const source of sources) {
        await commandRunner(resolved, [
          "plugin", "--profile", PROFILE_NAME, "add", "-w", source,
          "--save-exact", "--offline", "--ignore-scripts",
        ], commandEnv);
      }
    }
    const manifest = api.readProfileManifest("dsh-work", stagingProfileDir);
    const expectedBundles = env.DSH_PROFILE_INITIALIZATION_MODE === "safe"
      ? OFFICIAL_PROFILE_BUNDLES
      : featuredPlugins().map((plugin) => plugin.name);
    assertInitialProfile(manifest, expectedBundles, {
      requireDependencies: env.DSH_PROFILE_INITIALIZATION_MODE !== "safe",
    });
```

</details>

**依据 4 · 源码核查**：[electron/main.js:907-926](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/electron/main.js#L907-L926)

外层三次重启。

<details>
<summary>查看原文（20行）</summary>

```text
function scheduleBackendRestart() {
  clearTimeout(backendStableTimer);
  backendStableTimer = null;
  if (backendRestartAttempts >= 3) {
    notifyBackendState({ state: 'failed', error: '本地服务连续恢复失败，请重启应用' });
    if (mainWindowKind !== 'recovery') {
      showRecoveryFailure('backend_restart', new Error('本地服务连续恢复失败'));
    }
    return;
  }
  const delay = 1_000 * (2 ** backendRestartAttempts);
  backendRestartAttempts += 1;
  notifyBackendState({ state: 'restarting' });
  setTimeout(() => {
    if (isQuitting || backendState === 'ready' || backendState === 'starting') return;
    startBackend().catch((error) => {
      console.error('[electron] Server 自动恢复失败:', error?.message || error);
      notifyBackendState({ state: 'failed', error: error?.message || String(error) });
    });
  }, delay).unref?.();
```

</details>

**依据 5 · 源码核查**：[server/src/engine/dsh_runtime/client.js:861-882](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/server/src/engine/dsh_runtime/client.js#L861-L882)

内层退避无计数停止。

<details>
<summary>查看原文（22行）</summary>

```text
   * Schedule an automatic restart with exponential backoff (1s → 2s → 4s, cap
   * 8s, reset on successful start). The restart re-opens the mux stream so the
   * DSH baseline replays pending approval/question frames to the resident
   * subscriber. Only one restart timer is active at a time.
   */
  #scheduleRestart() {
    if (this.restartTimer !== null) return;
    const delay = Math.min(1000 * 2 ** this.restartAttempt, 8000);
    this.restartAttempt += 1;
    console.info(`[dsh-runtime] 自动重启中（${delay}ms 后，第 ${this.restartAttempt} 次）`);
    this.restartTimer = setTimeout(() => {
      this.restartTimer = null;
      this.start().then(() => {
        this.restartAttempt = 0;
        console.info("[dsh-runtime] 自动重启成功");
        return this.reattachSessions();
      }).catch((error) => {
        console.error("[dsh-runtime] 自动重启失败:", error?.message || error);
        this.#scheduleRestart();
      });
    }, delay);
    this.restartTimer.unref?.();
```

</details>

**依据 6 · 源码核查**：[electron/runtime-recovery.js:8-15](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/electron/runtime-recovery.js#L8-L15)

诊断redaction有界。

```text
function text(value, limit = MAX_FAILURE_MESSAGE_LENGTH) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
    .replace(/\b(api[_-]?key|token|password|secret|authorization|cookie|credential)\b\s*[:=]\s*(?:Bearer\s+)?[^\s,;]+/ig, (_match, key) => `${key}=[redacted]`)
    .replace(/\bBearer\s+[^\s]+/ig, 'Bearer [redacted]')
    .replace(/\b(DEEPSEEK_API_KEY|NPM_TOKEN|DSH_[A-Z0-9_]+)\s*=\s*[^\s,;]+/g, (_match, key) => `${key}=[redacted]`)
    .trim()
    .slice(0, limit);
```

**依据 7 · 源码核查**：[electron/runtime-recovery.js:107-132](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/electron/runtime-recovery.js#L107-L132)

诊断内容/落盘。

<details>
<summary>查看原文（26行）</summary>

```text
function diagnosticsPayload({ state, appVersion, platform, arch, backendState, runtimeHome }) {
  return {
    schema_version: STATE_VERSION,
    generated_at: new Date().toISOString(),
    product: 'DSH Desktop',
    app_version: text(appVersion, 80) || null,
    platform: text(platform, 40) || null,
    arch: text(arch, 40) || null,
    backend_state: text(backendState, 40) || null,
    runtime_home_name: runtimeHome ? path.basename(path.resolve(runtimeHome)) : null,
    recovery: {
      status: state?.status || 'none',
      attempts: state?.attempts || 0,
      last_failure: state?.last_failure || null,
      last_result: state?.last_result || null,
    },
    omitted: ['环境变量', '凭据', 'Session 内容', '用户文件内容', '完整堆栈'],
  };
}

function writeDiagnostics({ userDataPath, payload, fsImpl = fs }) {
  const directory = path.join(userDataPath, 'diagnostics');
  fsImpl.mkdirSync(directory, { recursive: true });
  const file = path.join(directory, `runtime-${Date.now()}.json`);
  fsImpl.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
  try { fsImpl.chmodSync(file, 0o600); } catch { /* Windows has no POSIX mode bits. */ }
```

</details>

**依据 8 · 源码核查**：[README.md:106-113](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/README.md#L106-L113)

远程第三方及身份条件。

```text
## 默认内置：手机远程

新 Profile 默认包含精确固定的 [`ds-harness-remote@0.4.1`](https://github.com/liguobao/ds-harness-remote/tree/v0.4.1)，与 DSH `0.1.5-rc.1` 试用线一起随包提供。打开侧栏 Remote，登录并为当前电脑启用远程访问后，就可以从 [Remote Web](https://dsh.r2049.cn/app)、Android App 或另一台 Desktop 打开同一 Host 的 Workspace 和 Session，继续对话、发送图片和处理权限请求。

- **网络边界**：Host 只建立出站连接，不开放公网监听端口；Remote 依次尝试 LAN、P2P、TURN 与 Relay，所有路径都承载 Noise IK 加密后的业务流量。
- **账号与数据**：当前默认连接 `dsh.r2049.cn` 的第三方账号、设备目录、信令和中继服务；设备身份与凭据保存在 `DSH_HOME`。未登录并启用当前电脑时不会提供远程访问。
- **已授权设备**：通过固定 Harness API 白名单控制当前 Harness，Agent 仍可按原权限运行工具；不开放直接 Shell、PTY 或通用文件 RPC。
- **卸载**：升级后的现有 Profile 会补充一次这个默认 Bundle；如果你停用或卸载，应用更新不会再次恢复。
```

#### 缺口

- 原profile恢复/内层反复失败影响和远程实际权限未验。
  **影响**：不可宣称无损/重试安全或完整隐私。
  **进一步探讨**：副本制造runtime失败，区分home/会话/在途操作；远程另单审身份/授权/退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样可控采用，改进怎样证伪？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

需要对应平台发行物/Node24开发线、固定官方runtime/插件tarball、可写数据根和模型配置；本轮未核当前签名/价格/服务可用。首次下载/模型/profile核对，持续Electron/后端/Agent资源与bundle升级，失败需辨normal/safe及在途操作；人工时间和现金未测，开源和省安装步骤不算经济创新。退出导出/核原home会话和插件状态，回官方Web/CLI使用正确路径；卸客户端不迁/删数据或撤远程凭据。建议独立数据根试正常任务、已有profile升级和safe，数据归属不清先停迁入真实资料。

可探索恢复页的状态差异收据：显示正常/safe home、bundle/版本差异、旧会话入口与每层重启状态，把“诊断环境可用”和“原任务已恢复”分开。已有诊断/动作记录与safe隔离是基线，增量是减少用户误认已复原。对原profile坏插件、runtime循环失败、safe有新会话和升级插件移除做任务对照，比较误重置、找旧会话时间、数据完整和界面负担；若原页面已等效或差异提示诱发误迁移则否定，未实现。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:39-39](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/README.md#L39-L39)

安装位置与独立数据。

```text
客户端安装目录只保存应用程序。Profile、插件、Session 和其他 DSH 数据由独立的数据目录管理；更换客户端安装位置不会迁移或删除这些数据。
```

**依据 2 · 源码核查**：[README.md:67-81](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/README.md#L67-L81)

作者恢复/离线/远程条件。

<details>
<summary>查看原文（15行）</summary>

```text
      <p>应用负责窗口、原生文件选择、更新、启动和恢复。正式安装包通过右上角按钮提示更新，悬停可看更新日志，点击后才下载、预检 Profile 并安装；Profile 或 Client 出错时进入恢复页。</p>
    </td>
    <td width="50%" valign="top">
      <h3>可复现的默认环境</h3>
      <p>新 Profile 从随包固定产物离线初始化；普通启动不重写已有 Profile，也不会把用户卸载的插件悄悄装回来。</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>手机远程</h3>
      <p>登录并启用当前电脑后，可以从 Android、Remote Web 或另一台 Desktop 继续同一 Workspace 和 Session。Host 只建立出站连接，不开放公网监听端口。</p>
    </td>
    <td width="50%" valign="top">
      <h3>明确的服务边界</h3>
      <p>当前账号、设备目录、信令和中继由第三方服务提供；连接方式、安全边界和停用方法见<a href="https://dshdesktopstation.com/remote/">手机远程说明</a>。</p>
```

</details>

**依据 3 · 源码核查**：[electron/runtime-recovery.js:107-123](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/electron/runtime-recovery.js#L107-L123)

已有诊断信息基线。

<details>
<summary>查看原文（17行）</summary>

```text
function diagnosticsPayload({ state, appVersion, platform, arch, backendState, runtimeHome }) {
  return {
    schema_version: STATE_VERSION,
    generated_at: new Date().toISOString(),
    product: 'DSH Desktop',
    app_version: text(appVersion, 80) || null,
    platform: text(platform, 40) || null,
    arch: text(arch, 40) || null,
    backend_state: text(backendState, 40) || null,
    runtime_home_name: runtimeHome ? path.basename(path.resolve(runtimeHome)) : null,
    recovery: {
      status: state?.status || 'none',
      attempts: state?.attempts || 0,
      last_failure: state?.last_failure || null,
      last_result: state?.last_result || null,
    },
    omitted: ['环境变量', '凭据', 'Session 内容', '用户文件内容', '完整堆栈'],
```

</details>

**依据 4 · 源码核查**：[electron/main.js:1314-1322](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/electron/main.js#L1314-L1322)

safe切换。

```text
    if (action === 'retry' || action === 'safe-profile') {
      await stopBackendGracefully();
      forceStopBackend();
      const safe = action === 'safe-profile';
      runtimeHomeOverride = safe ? safeProfileHome(DATA_ROOT) : DATA_ROOT;
      profileInitializationMode = safe ? 'safe' : 'normal';
      recordRecoveryResult({ userDataPath: app.getPath('userData'), action });
      destroyMainWindowImmediately();
      await startApplicationWindow({ runtimeHome: runtimeHomeOverride, profileMode: profileInitializationMode });
```

**依据 5 · 源码核查**：[server/src/engine/dsh_runtime/client.js:861-882](https://github.com/vibeinging/dsh-desktop/blob/346086747039398fb0cb8075ca1941b7cb1b4bc0/server/src/engine/dsh_runtime/client.js#L861-L882)

内层状态可区分。

<details>
<summary>查看原文（22行）</summary>

```text
   * Schedule an automatic restart with exponential backoff (1s → 2s → 4s, cap
   * 8s, reset on successful start). The restart re-opens the mux stream so the
   * DSH baseline replays pending approval/question frames to the resident
   * subscriber. Only one restart timer is active at a time.
   */
  #scheduleRestart() {
    if (this.restartTimer !== null) return;
    const delay = Math.min(1000 * 2 ** this.restartAttempt, 8000);
    this.restartAttempt += 1;
    console.info(`[dsh-runtime] 自动重启中（${delay}ms 后，第 ${this.restartAttempt} 次）`);
    this.restartTimer = setTimeout(() => {
      this.restartTimer = null;
      this.start().then(() => {
        this.restartAttempt = 0;
        console.info("[dsh-runtime] 自动重启成功");
        return this.reattachSessions();
      }).catch((error) => {
        console.error("[dsh-runtime] 自动重启失败:", error?.message || error);
        this.#scheduleRestart();
      });
    }, delay);
    this.restartTimer.unref?.();
```

</details>

#### 缺口

- 全周期成本/退出迁移/差异收据尚未验。
  **影响**：不能保证省维护或恢复理解更好。
  **进一步探讨**：副本完整任务对照，含normal/safe和外部凭据停用核验。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
