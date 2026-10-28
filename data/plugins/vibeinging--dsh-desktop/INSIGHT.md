# DSH Desktop

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5160116](https://github.com/vibeinging/dsh-desktop/tree/51601168b14f307d87f377a6bb070d1fd5624998)

<!-- BEGIN META -->
[![GitHub ★ 485](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=485&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vibeinging/dsh-desktop)
<!-- END META -->

> **功能**：集成官方 DSH Web、固定社区 Bundle 与桌面启动恢复能力的社区客户端

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将固定插件发行物、离线profile初始化和桌面生命周期组合，实际增量是部署与状态组织。

> **主要限制**：[Q03](#research-q03) 安全profile是另一数据home的诊断环境，自动重启有界；两者都不能替代原profile无损恢复验收。

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
  - [Q01 · 谁需要这个发行版，能力属于谁？](#detail-section-11)
  - [Q02 · 启动怎样落到官方Profile与实际运行时？](#detail-section-12)
  - [Q03 · 初始化和自动恢复能证明无损吗？](#detail-section-13)
  - [Q04 · 什么条件下试用，如何判断打包便利值得维护负担？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望直接使用官方DSH Web与社区插件的桌面用户，提供统一profile的社区客户端。

手动安装官方DSH Web和相同插件集合；官方对话与社区Bundle能力归其各自实现。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面发行与profile | 预装固定运行时与Bundle | 兼容由整套发行物决定 |
| safe profile | 隔离故障诊断 | 独立home，不等于修复原数据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 适配平台与发行物 | 必需 | 运行桌面客户端 | 回官方Web/CLI |
| 官方DSH与固定Bundle | 必需 | 对话和插件功能 | 初始化失败进入恢复 |
| 模型凭据与网络 | 模型任务必需 | 完成对话 | 先保留本地状态 |
| 数据目录备份 | 重要使用必需 | 恢复和退出 | 先独立数据根试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份并选择匹配发行物 | 桌面启动且profile可读 |
| 2 | 客户端初始化后用户核会话/插件 | CLI和界面状态一致 |
| 3 | 用户演练后端失败与safe模式 | 识别独立home，原数据仍可回查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 客户端和插件磁盘 | 下载、配置模型与核对profile | 省时未测 |
| 持续 | 模型和客户端资源 | 跟随运行时/Bundle升级 | 总维护工时未知 |
| 失败恢复 | 备份及重试进程 | 辨认normal/safe home并核数据 | 恢复正确率未测 |
| 退出 | 保留DSH数据 | 回官方Web/CLI并核路径 | 并非卸客户端即迁移数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 环境拼装 | 离线固定包及初始化暂存 | 真实首次/升级节时 |
| 恢复路径 | 有界重启和独立safe profile | 无损恢复与跨平台表现 |

> **思考**：[Q03](#research-q03) 安全profile是另一数据home的诊断环境，自动重启有界；两者都不能替代原profile无损恢复验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将固定插件发行物、离线profile初始化和桌面生命周期组合，实际增量是部署与状态组织。

[Q02](#research-q02) 临时初始化和发布前校验可借鉴；[Q03](#research-q03) 进程内队列与安全环境需要和跨进程/原数据恢复区分。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 安全profile是另一数据home的诊断环境，自动重启有界；两者都不能替代原profile无损恢复验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用独立数据根验证正常会话、插件状态及safe模式；若数据归属或恢复后会话不清楚，停止迁入真实数据并回官方Web/CLI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

启动、初始化暂存与有界恢复有源码支持；真实跨平台发行、升级和数据恢复未验收。

- 已检查：作者 README、包清单、源码路径 README.md、electron/main.js、server/src/engine/dsh_runtime/client.js、server/src/engine/dsh_runtime/profile_initialization.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：重点检查桌面后台、官方运行时启动、profile初始化与恢复；未全面审计远程服务、全部预装插件或所有平台发行物。
- 下一步：在独立备份数据根，对照手装DSH同插件集合，测首次/升级/故障耗时、误重置与会话完整性；恢复状态可见性无改善则否定扩展。

**分析版本**

- **仓库**：[vibeinging/dsh-desktop](https://github.com/vibeinging/dsh-desktop)
- **版本号**：0.2.5（[固定提交 5160116](https://github.com/vibeinging/dsh-desktop/tree/51601168b14f307d87f377a6bb070d1fd5624998)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导恢复页展示home/bundle差异及原会话入口的未验证假设，用误重置、定位时间与会话完整性比较；无改善或引入误操作则推翻。

在独立备份数据根，对照手装DSH同插件集合，测首次/升级/故障耗时、误重置与会话完整性；恢复状态可见性无改善则否定扩展。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

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

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/vibeinging/dsh-desktop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/vibeinging/dsh-desktop/issues?q=is%3Aissue+created%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/vibeinging/dsh-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面发行版能否降低环境拼装成本，同时保留清晰的Profile和恢复状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这个发行版，能力属于谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是想在桌面窗口里使用DSH而不自行拼装运行时与社区插件的人。真实类型client；README明确运行官方DSH npm运行时与官方Web，文件、任务、Worktree等由独立Bundle提供。自身贡献是发行、桌面窗口、固定默认环境和生命周期恢复，不应把官方Agent、工具或社区插件原创计入本根项目。基线是用户自行安装DSH Web并配置同一组插件；合格结果是桌面/CLI对同一profile状态一致，出错可恢复而不重置用户数据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-39](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/README.md#L24-L39)

社区发行版与数据目录边界

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

**依据 2 · 作者声明**：[README.md:46-71](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/README.md#L46-L71)

官方Web、独立bundle与桌面职责

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动怎样落到官方Profile与实际运行时？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Electron startBackend设置数据根、运行时home、web profile及随包插件清单，生产以Electron Node模式启动本地server并用IPC通信。server client在启动官方CLI前调用ensureDshProfileInitialized，CLI参数明确--profile web和--no-open。初始化新profile在临时home执行官方initProfile，再离线、忽略脚本添加固定包，dump-config验证后rename到正式profile；链接重定向失败会移回暂存。这样把发行物和用户profile绑定到同一路径，减少另一套插件状态的漂移。

#### 证据与依据

**依据 1 · 源码核查**：[electron/main.js:725-760](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/electron/main.js#L725-L760)

真实后台环境与运行模式

<details>
<summary>查看原文（36行）</summary>

```text
// ── Backend lifecycle ──
function startBackend() {
  if (backendState === 'ready') return Promise.resolve();
  if (backendState === 'starting' && backendReadyPromise) return backendReadyPromise;

  const entryRel = path.join('src', 'index.js');
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
```

</details>

**依据 2 · 源码核查**：[electron/main.js:776-806](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/electron/main.js#L776-L806)

spawn、退出与通知

<details>
<summary>查看原文（31行）</summary>

```text
  try {
    // stdio fd 4 uses 'ipc' to build process message channel (process.send/on('message')), no socket or port transport
    const child = spawn(cmd, args, { cwd: SERVER_DIR, env, stdio: ['ignore', 'inherit', 'inherit', 'ipc'] });
    backendProc = child;
    child.on('error', (error) => {
      console.error('[electron] Server 启动失败:', error?.message || error);
      if (backendState === 'starting') backendReadyReject?.(error);
      rejectPending(error);
    });
    child.on('exit', (code, signal) => {
      if (backendProc !== child) {
        console.log(`[electron] 旧 Server 进程已退出 code=${code} signal=${signal}`);
        return;
      }
      const wasReady = backendState === 'ready';
      backendProc = null;
      clearTimeout(backendReadyTimer);
      backendReadyTimer = null;
      if (backendState === 'starting') {
        backendReadyReject?.(new Error(`本地 Server 提前退出(code=${code}, signal=${signal || 'none'})`));
      }
      backendReadyResolve = null;
      backendReadyReject = null;
      backendReadyPromise = null;
      backendState = isQuitting ? 'stopped' : 'failed';
      rejectPending(new Error('本地 Server 已退出'));
      backendShutdownResolve?.();
      backendShutdownResolve = null;
      notifyBackendState({ state: backendState, code, signal });
      console.log(`[electron] Server 退出 code=${code} signal=${signal}`);
      if (wasReady && !isQuitting) scheduleBackendRestart();
```

</details>

**依据 3 · 源码核查**：[server/src/engine/dsh_runtime/client.js:323-368](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/server/src/engine/dsh_runtime/client.js#L323-L368)

官方profile初始化与CLI启动

<details>
<summary>查看原文（46行）</summary>

```text
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
      serialization: "advanced",
    });
```

</details>

**依据 4 · 源码核查**：[server/src/engine/dsh_runtime/profile_initialization.js:556-608](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/server/src/engine/dsh_runtime/profile_initialization.js#L556-L608)

临时初始化、离线安装、校验及发布

<details>
<summary>查看原文（53行）</summary>

```text
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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 初始化和自动恢复能证明无损吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能把一次初始化或重启能力当无损保证。已有manifest走reconcile而不是新建；已有目录缺manifest直接报错，避免盲目覆盖。初始化队列按home/profile在当前进程串行，发布前检测其他操作已建目录，但这不等于跨进程全局锁。后台启动有超时，曾就绪后退出触发有界自动重试，三次后进入恢复页。safe-profile会改为独立safe home，启动不含社区默认bundle，是隔离诊断退路，不是原profile数据自动修复或迁移。 安全 home 只隔离诊断环境，不代表把原 profile 的会话复制进去；恢复界面空白不能直接判定原数据已删除。

#### 证据与依据

**依据 1 · 源码核查**：[server/src/engine/dsh_runtime/profile_initialization.js:536-553](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/server/src/engine/dsh_runtime/profile_initialization.js#L536-L553)

已有profile与不完整目录分支

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[server/src/engine/dsh_runtime/profile_initialization.js:599-631](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/server/src/engine/dsh_runtime/profile_initialization.js#L599-L631)

发布竞争检测与进程内串行

<details>
<summary>查看原文（33行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[electron/main.js:767-806](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/electron/main.js#L767-L806)

超时/退出处理

<details>
<summary>查看原文（40行）</summary>

```text
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
    backendProc = child;
    child.on('error', (error) => {
      console.error('[electron] Server 启动失败:', error?.message || error);
      if (backendState === 'starting') backendReadyReject?.(error);
      rejectPending(error);
    });
    child.on('exit', (code, signal) => {
      if (backendProc !== child) {
        console.log(`[electron] 旧 Server 进程已退出 code=${code} signal=${signal}`);
        return;
      }
      const wasReady = backendState === 'ready';
      backendProc = null;
      clearTimeout(backendReadyTimer);
      backendReadyTimer = null;
      if (backendState === 'starting') {
        backendReadyReject?.(new Error(`本地 Server 提前退出(code=${code}, signal=${signal || 'none'})`));
      }
      backendReadyResolve = null;
      backendReadyReject = null;
      backendReadyPromise = null;
      backendState = isQuitting ? 'stopped' : 'failed';
      rejectPending(new Error('本地 Server 已退出'));
      backendShutdownResolve?.();
      backendShutdownResolve = null;
      notifyBackendState({ state: backendState, code, signal });
      console.log(`[electron] Server 退出 code=${code} signal=${signal}`);
      if (wasReady && !isQuitting) scheduleBackendRestart();
```

</details>

**依据 4 · 源码核查**：[electron/main.js:907-925](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/electron/main.js#L907-L925)

有界重启及恢复页

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[electron/main.js:1314-1322](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/electron/main.js#L1314-L1322)

独立safe home

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

**依据 6 · 源码核查**：[server/src/engine/dsh_runtime/profile_initialization.js:574-588](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/server/src/engine/dsh_runtime/profile_initialization.js#L574-L588)

safe模式跳过社区包

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

#### 缺口

- 跨进程竞争、升级中断与会话恢复的实际结果缺少本轮运行证据
  **影响**：不能确认真实平台下无数据损失或每次恢复成功
  **进一步探讨**：在备份数据根并发启动/中断升级/模拟后端退出，核对profile与会话

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么条件下试用，如何判断打包便利值得维护负担？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

应由符合安装平台、愿意备份DSH数据的用户独立试用，先验证一次正常会话、插件状态和安全profile退路。README平台状态不完全相同，具体发行产物和签名是作者声明而非本轮验收。首次减少环境拼装的可能收益由固定包与离线初始化解释，但持续需跟随官方API和社区Bundle兼容，用户仍承担模型费用与数据复核。由safe与normal分离推导未验证假设：恢复界面展示当前home、bundle差异和原会话入口，可减少用户在safe模式误以为数据丢失。对相同后端故障比较定位时间、误重置次数与恢复后会话完整性；无改善或引入错误数据操作则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-39](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/README.md#L30-L39)

平台差异及数据独立

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 2 · 源码核查**：[server/src/engine/dsh_runtime/profile_initialization.js:574-588](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/server/src/engine/dsh_runtime/profile_initialization.js#L574-L588)

安全profile的bundle差异

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[electron/main.js:1314-1322](https://github.com/vibeinging/dsh-desktop/blob/51601168b14f307d87f377a6bb070d1fd5624998/electron/main.js#L1314-L1322)

恢复切换home的依据

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

#### 缺口

- 相对手装DSH的总配置/升级时间与恢复体验未测
  **影响**：无法确认发行版降低全周期人工成本
  **进一步探讨**：同一运行时和插件集合对照首次、升级及故障恢复耗时

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
