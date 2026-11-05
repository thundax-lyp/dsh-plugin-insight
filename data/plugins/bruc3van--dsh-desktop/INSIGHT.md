# DSH Desktop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[94200db](https://github.com/bruc3van/dsh-desktop/tree/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd)

<!-- BEGIN META -->
[![GitHub ★ 97](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=97&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bruc3van/dsh-desktop)
<!-- END META -->

> **功能**：独立 Electron 客户端，发现或启动 DSH 并呈现 Web UI。

> **亮点**：[Q01](#research-q01) 希望用桌面窗口访问 DSH 的用户可在智能模式选择现有或内置运行时，也能指定自行部署的 Web 地址。manager 在同一代存在时返回其 ready，在 spawn 前建立运行时锁，再启动 child。相比终端手工启动，客户端统一发现和窗口入口。

> **主要限制**：[Q02](#research-q02) Electron 窗口启用 contextIsolation、sandbox 并关闭 Node。模型与工具执行仍依赖实际 DSH 部署，远端自定义地址认证需用户配置。默认共享和独立 home 有不同数据路径，切换不复制数据；运行时锁的进程存活与跨进程互斥仍需故障验证。

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
  - [Q01 · 桌面客户端怎样连接 DSH？](#detail-section-11)
  - [Q02 · 桌面沙箱与宿主数据如何限定？](#detail-section-12)
  - [Q03 · 如何试用与退出？](#detail-section-13)
  - [Q04 · 怎样验证跨客户端不会双写同一 home？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想统一管理桌面连接和运行时的 DSH 用户。

终端启动 DSH 再开浏览器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面 | 访问 DSH | 依赖服务 |
| 运行时 | 发现和启动 | 所有权需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 平台制品 | 必需 | Electron入口 | 原浏览器 |
| DSH实例 | 必需 | 会话执行 | 核对运行时 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立数据 | 核对来源 |
| 验证 | 启动和复用 | 惰性任务 |
| 退出 | 明确退出 | 查进程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本机资源未知 | 准备制品 | 未测 |
| 持续 | 更新成本未知 | 维护来源 | 按平台 |
| 退出 | 恢复时间未知 | 检查目录 | 读回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面入口 | manager 与窗口 | 制品兼容 |
| 数据环境 | 配置路径 | 实际隔离 |

> **思考**：[Q02](#research-q02) Electron 窗口启用 contextIsolation、sandbox 并关闭 Node。模型与工具执行仍依赖实际 DSH 部署，远端自定义地址认证需用户配置。默认共享和独立 home 有不同数据路径，切换不复制数据；运行时锁的进程存活与跨进程互斥仍需故障验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 希望用桌面窗口访问 DSH 的用户可在智能模式选择现有或内置运行时，也能指定自行部署的 Web 地址。manager 在同一代存在时返回其 ready，在 spawn 前建立运行时锁，再启动 child。相比终端手工启动，客户端统一发现和窗口入口。

[Q02](#research-q02) Electron 窗口启用 contextIsolation、sandbox 并关闭 Node。模型与工具执行仍依赖实际 DSH 部署，远端自定义地址认证需用户配置。默认共享和独立 home 有不同数据路径，切换不复制数据；运行时锁的进程存活与跨进程互斥仍需故障验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Electron 窗口启用 contextIsolation、sandbox 并关闭 Node。模型与工具执行仍依赖实际 DSH 部署，远端自定义地址认证需用户配置。默认共享和独立 home 有不同数据路径，切换不复制数据；运行时锁的进程存活与跨进程互斥仍需故障验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 选择固定平台制品，在独立数据环境用合成配置试启动和连接。先确认来源和版本，再做一次惰性任务。关闭窗口会留后台，应使用明确退出命令并检查自有 child、复用实例及目录。维护成本来自客户端和运行时版本，未量化。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码及作者说明，未执行目标。

- 已检查：作者 README、包清单、源码路径 README.md、src/main/main-window.ts、src/main/web-ui-manager.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定身份及其直接依赖的代表实现。
- 下一步：核对锁、身份及后台退出。

**分析版本**

- **仓库**：[bruc3van/dsh-desktop](https://github.com/bruc3van/dsh-desktop)
- **版本号**：0.5.29（[固定提交 94200db](https://github.com/bruc3van/dsh-desktop/tree/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 同时启动两个测试客户端，在锁写入、子进程落盘和退出阶段注入故障。以真正运行的 child 数量与 home 写入代为准，对照是否出现双写；若仅 UI 阻止而进程仍双开则改进锁协议。

核对锁、身份及后台退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1728 | — | — | 44820 |
| .mjs | source | 60 | 13284 | 10809 | 1913 | — |
| .cjs | source | 5 | 497 | 426 | 65 | — |
| .mjs | example | 1 | 80 | 50 | 21 | — |
| .ts | source | 78 | 14948 | 11207 | 2941 | — |

</details>

**活跃度**

[![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/bruc3van/dsh-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话地图如何组织和传递上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面客户端怎样连接 DSH？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望用桌面窗口访问 DSH 的用户可在智能模式选择现有或内置运行时，也能指定自行部署的 Web 地址。manager 在同一代存在时返回其 ready，在 spawn 前建立运行时锁，再启动 child。相比终端手工启动，客户端统一发现和窗口入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:86-113](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/README.md#L86-L113)

作者说明连接模式

<details>
<summary>查看原文（28行）</summary>

```text
## 连接方式

| 模式 | 行为 |
|---|---|
| **智能模式**（默认） | 按顺序尝试：正在运行的官方实例 → PATH 上的 `dsh` → npx 缓存 → 内置运行时。 |
| **自定义** | 连接指定的 Web UI 地址，不启动本地运行时。 |

智能模式只使用本机已有的运行时，不下载或安装 Node.js。连接设置可关闭任一来源，但至少保留一种。独立数据环境不复用共享环境中已运行的实例，需保留本机已安装、npx 缓存或内置运行时之一。来源选择先暂存，点击“应用并重新连接”后生效；也可撤销未应用的更改。

客户端启动本地服务时，自动尝试 3080、13080，再使用系统分配的端口。也可以设置固定端口。固定端口被占用时不会自动换端口。

共享数据环境下，如果客户端检测到官方实例仍在运行，但当前设置不允许复用，会拒绝另起进程，也不会结束用户启动的进程。请先在终端停止该实例，或切换到独立数据环境。

可从托盘菜单、macOS/Linux 应用菜单或主窗口快捷键打开“桌面设置”：macOS 使用 `Cmd+,`，Windows/Linux 使用 `Ctrl+,`。

![桌面设置：连接方式、运行时来源、安全市场和版本信息](docs/images/dsh-desktop-setting.png)

连接状态说明：

| 状态 | 含义 |
|---|---|
| 本机已运行 | 复用用户启动的实例 |
| 客户端启动·客户端内置 | 使用安装包内置运行时 |
| 客户端启动·npx 缓存 | 使用 npx 缓存运行时 |
| 客户端启动·本机已安装 | 使用 PATH 上的 `dsh` |
| 自定义地址 | 连接指定地址，不启动运行时 |

客户端启动的 Web UI 使用本机回环地址。自定义地址可连接自行维护的 Web UI，认证和网络可达性需由该部署保证；地址按协议、主机和端口保存，不保留路径、查询参数或片段。跨机器连接的部署方式请参照所用版本的[官方文档](https://github.com/deepseek-ai/deepseek-harness)。
```

</details>

**依据 2 · 源码核查**：[src/main/web-ui-manager.ts:79-108](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/src/main/web-ui-manager.ts#L79-L108)

复用代与预留锁

<details>
<summary>查看原文（30行）</summary>

```text
  /** The current generation's readiness, or a fresh spawn when none exists. */
  async ready(): Promise<string> {
    await this.stopping
    if (this.fatalError !== undefined) throw this.fatalError
    const gen = this.generation
    if (gen !== undefined) return gen.ready
    this.spawn()
    const spawned = this.generation
    if (spawned === undefined) return Promise.reject(new Error('dsh web spawn failed'))
    return spawned.ready
  }

  /** The current child's pid, when one is running. */
  pid(): number | undefined {
    const gen = this.generation
    return gen !== undefined && gen.child.exitCode === null && gen.child.signalCode === null ? gen.child.pid : undefined
  }

  spawn(): void {
    // A generation already owns the manager. Respawns race through here from
    // both the exit ladder and `ready()` — the ladder's timer and a waiter
    // released by `stopping` both believe they are the one to respawn — and
    // spawning over a live child is a second writer on one DSH_HOME, which is
    // the one thing this manager exists to prevent. Whoever lost the race
    // finds the winner through `ready()` instead.
    if (this.fatalError !== undefined || this.generation !== undefined) return
    try {
      mkdirSync(this.options.home(), { recursive: true })
      writeRuntimeLock(this.options.home(), {
        childPid: process.pid, desktopPid: process.pid, startedAt: Date.now(), launchPending: true,
```

</details>

**依据 3 · 源码核查**：[src/main/web-ui-manager.ts:145-175](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/src/main/web-ui-manager.ts#L145-L175)

进程和 PID 锁

<details>
<summary>查看原文（31行）</summary>

```text
    }
    console.log('[desktop] dsh runtime: ' + dsh.source + ' (' + dsh.label + ')')
    this.lastError = null
    this.lastDiagnostic = null
    this.lastSource = dsh.source
    this.lastCommand = dsh
    const child = spawn(dsh.command, [...dsh.args, ...prepared.args], {
      cwd: this.options.home(),
      env: prepared.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      ...SPAWN_NO_WINDOW,
      ...dsh.shell === true && { shell: true },
    })
    let resolveReady: (url: string) => void = () => {}
    let rejectReady: (error: Error) => void = () => {}
    const ready = new Promise<string>((resolve, reject) => {
      resolveReady = resolve
      rejectReady = reject
    })
    const gen: WebUiGeneration = { child, ready, readyReported: false, stopped: false }
    let exitReported = false
    let readinessProbeStarted = false
    let stdoutTail = ''
    let stderrTail = ''

    this.generation = gen
    // Keep the pre-spawn reservation until the child PID has been persisted.
    const lockReady = (async () => {
      if (child.pid === undefined) return
      writeRuntimeLock(this.options.home(), {
        childPid: child.pid, desktopPid: process.pid, startedAt: Date.now(), source: dsh.source,
```

</details>

#### 缺口

- 未运行平台制品
  **影响**：现有实例识别和多客户端竞争未知
  **进一步探讨**：测试两客户端及独立环境

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桌面沙箱与宿主数据如何限定？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Electron 窗口启用 contextIsolation、sandbox 并关闭 Node。模型与工具执行仍依赖实际 DSH 部署，远端自定义地址认证需用户配置。默认共享和独立 home 有不同数据路径，切换不复制数据；运行时锁的进程存活与跨进程互斥仍需故障验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/main/main-window.ts:100-112](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/src/main/main-window.ts#L100-L112)

窗口配置

<details>
<summary>查看原文（13行）</summary>

```text
      backgroundColor: windowBackgroundColor(),
      // The official Web UI carries its own header; a hiddenInset title bar
      // would overlap it. The standard title bar keeps the traffic lights away
      // from the page on macOS and renders the official icon on Windows/Linux.
      titleBarStyle: 'default',
      icon: options.windowIcon(),
      show: false,
      webPreferences: {
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false,
        preload: fileURLToPath(new URL('./preload.cjs', import.meta.url)),
      },
```

</details>

**依据 2 · 作者声明**：[README.md:113-136](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/README.md#L113-L136)

数据路径与安全说明

<details>
<summary>查看原文（24行）</summary>

```text
客户端启动的 Web UI 使用本机回环地址。自定义地址可连接自行维护的 Web UI，认证和网络可达性需由该部署保证；地址按协议、主机和端口保存，不保留路径、查询参数或片段。跨机器连接的部署方式请参照所用版本的[官方文档](https://github.com/deepseek-ai/deepseek-harness)。

运行时选择、端口和认证细节见[开发指南](docs/development.zh.md#从源码运行)。

## 数据与安全

| 数据 | 默认位置 | 管理方 |
|---|---|---|
| 共享环境的会话、凭据、模型配置和插件 | `~/.dsh` | 官方 dsh |
| 桌面端设置、命令 shim 和更新下载 | `~/.bruc3van-dsh-desktop` | 桌面客户端 |
| 独立环境的会话、凭据、模型配置和插件 | `~/.bruc3van-dsh-desktop/dsh` | 官方 dsh |

设置中的“数据环境”可以在共享环境和桌面端独立环境之间切换，重启后生效。切换不会复制原环境中的会话或插件。

旧版 `~/.dsh-desktop` 会在新目录不存在时迁移到 `~/.bruc3van-dsh-desktop`。移动失败时会复制数据并保留旧目录。

主要安全措施：

- 通过官方 `dsh web` CLI 启动服务，通过 Web UI 的 `/api` 接口交互；内置市场接入还会调用运行时的配置加载模块并调整插件配置。
- Electron 启用沙箱和上下文隔离，关闭 Node 集成。
- 页面导航限制在当前 Web UI 源站，外部链接使用系统浏览器打开。
- 打包版本默认忽略覆盖更新源、数据目录或连接探测设置的环境变量；显式启用不安全调试模式时例外。
- 更新清单和安装包文件名会进行校验，安装包会校验 SHA-256。
- 客户端管理的本机 Web UI 可使用文件选择、语音输入等权限；复用的实例和自定义地址采用更受限的权限策略。跨域子框架、USB/HID/串口、定位、屏幕捕获和存储权限升级默认拒绝。
```

</details>

**依据 3 · 源码核查**：[src/main/web-ui-manager.ts:97-108](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/src/main/web-ui-manager.ts#L97-L108)

单代与锁入口

<details>
<summary>查看原文（12行）</summary>

```text
  spawn(): void {
    // A generation already owns the manager. Respawns race through here from
    // both the exit ladder and `ready()` — the ladder's timer and a waiter
    // released by `stopping` both believe they are the one to respawn — and
    // spawning over a live child is a second writer on one DSH_HOME, which is
    // the one thing this manager exists to prevent. Whoever lost the race
    // finds the winner through `ready()` instead.
    if (this.fatalError !== undefined || this.generation !== undefined) return
    try {
      mkdirSync(this.options.home(), { recursive: true })
      writeRuntimeLock(this.options.home(), {
        childPid: process.pid, desktopPid: process.pid, startedAt: Date.now(), launchPending: true,
```

</details>

#### 缺口

- 未验证 IPC、远端认证和崩溃恢复
  **影响**：不能保证用户与实例隔离
  **进一步探讨**：模拟旧锁、外部实例和远端登录

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

选择固定平台制品，在独立数据环境用合成配置试启动和连接。先确认来源和版本，再做一次惰性任务。关闭窗口会留后台，应使用明确退出命令并检查自有 child、复用实例及目录。维护成本来自客户端和运行时版本，未量化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:117-127](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/README.md#L117-L127)

数据位置

<details>
<summary>查看原文（11行）</summary>

```text
## 数据与安全

| 数据 | 默认位置 | 管理方 |
|---|---|---|
| 共享环境的会话、凭据、模型配置和插件 | `~/.dsh` | 官方 dsh |
| 桌面端设置、命令 shim 和更新下载 | `~/.bruc3van-dsh-desktop` | 桌面客户端 |
| 独立环境的会话、凭据、模型配置和插件 | `~/.bruc3van-dsh-desktop/dsh` | 官方 dsh |

设置中的“数据环境”可以在共享环境和桌面端独立环境之间切换，重启后生效。切换不会复制原环境中的会话或插件。

旧版 `~/.dsh-desktop` 会在新目录不存在时迁移到 `~/.bruc3van-dsh-desktop`。移动失败时会复制数据并保留旧目录。
```

</details>

**依据 2 · 作者声明**：[README.md:143-168](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/README.md#L143-L168)

后台行为与内置环境

<details>
<summary>查看原文（26行）</summary>

```text
## 桌面端行为

- 关闭主窗口后继续后台运行；从托盘或菜单栏可重新打开。Linux 无托盘时，再次从应用菜单启动或打开同一 AppImage 可恢复窗口；使用窗口菜单“DSH Desktop → 退出”或 `Ctrl+Q` 结束客户端。
- “重启客户端”会重启客户端管理的本地运行时，不会结束用户在终端启动的 `dsh web`。
- 本地 Web UI 意外退出时会进行有限次数的重启。
- 系统唤醒或长时间后台运行后，页面异常时会在服务可用后重新加载。
- 智能模式复用的实例失联时，可回退到其他已启用来源。自定义地址失败时不会自动切换。
- 客户端通过运行时锁和本机服务探测，避免为同一 `DSH_HOME` 重复启动运行时。无法安全接管或停止旧进程时，会拒绝启动新进程；这些检查不能阻止用户从其他终端或工具启动额外实例。
- 共享环境因插件失败而无法启动时，可卸载确认存在的问题插件后重试，或保留插件并切换到独立环境。

发布版启动后会检查 GitHub Releases，12 小时内不重复自动检查。也可从设置、托盘菜单或 macOS/Linux 应用菜单手动检查。更新窗口显示下载、校验和后续操作；下载失败可重试，关闭窗口后下载可以继续。

macOS 可在应用目录可写时自动替换并重启应用。更新失败时会尝试恢复旧应用。更新会中断客户端管理的本地任务，请选择合适的时间执行。

Linux 更新会按当前安装格式下载并校验 DEB 或 AppImage，然后打开文件位置；DEB 请在退出客户端后用 `sudo apt install ./实际文件名.deb` 安装新版，AppImage 则手动替换原文件；下载期间任务继续运行。请通过“DSH Desktop → 退出”或 `Ctrl+Q` 退出客户端，再按安装格式完成更新并重新打开。关闭主窗口仅隐藏窗口，不能代替退出。已校验的下载在客户端重启后仍可复用。

## 内置运行环境

- 发布版在启动本地运行时时，于 `~/.bruc3van-dsh-desktop/bin` 生成 `node`、`dsh` 和 `pnpm` 命令入口，并将该目录追加到运行时及其 Agent 命令的 PATH。已有 PATH 中的用户工具优先；客户端不修改系统 PATH。
- `node` 使用 Electron 自带的 Node.js 执行能力，`pnpm` 随安装包提供；客户端未内置 `npm` 和 `npx`。如需使用这两个命令，请另行安装包含 npm/npx 的完整 Node.js 发行版，并确保命令在客户端启动的运行时 PATH 中可用。
- 内置 `dsh` 入口支持插件管理、版本查询和配置导出，会拒绝再次启动 `dsh web` 等运行时实例。
- 客户端启动运行时时会清理内部的 `ELECTRON_RUN_AS_NODE` 设置，避免普通 Agent shell 命令误用 Electron 的 Node 模式。
- 应用未启用 macOS App Sandbox。Electron 窗口沙箱不等同于 Agent 命令沙箱；Agent 操作还受所用运行时的权限策略、沙箱配置和操作系统授权约束。
- 内置运行时随客户端发布，不能单独升级。

实现细节见[桌面客户端架构](docs/desktop-client-architecture.zh.md)和[开发指南](docs/development.zh.md)。
```

</details>

#### 缺口

- 未安装、升级或退出
  **影响**：实际残留和资源未知
  **进一步探讨**：测试独立 home 的进程及文件差异

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证跨客户端不会双写同一 home？

**研究主题**：新假设与验证

#### 完整回答

同时启动两个测试客户端，在锁写入、子进程落盘和退出阶段注入故障。以真正运行的 child 数量与 home 写入代为准，对照是否出现双写；若仅 UI 阻止而进程仍双开则改进锁协议。

#### 证据与依据

**依据 1 · 源码核查**：[src/main/web-ui-manager.ts:97-108](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/src/main/web-ui-manager.ts#L97-L108)

单代与锁

<details>
<summary>查看原文（12行）</summary>

```text
  spawn(): void {
    // A generation already owns the manager. Respawns race through here from
    // both the exit ladder and `ready()` — the ladder's timer and a waiter
    // released by `stopping` both believe they are the one to respawn — and
    // spawning over a live child is a second writer on one DSH_HOME, which is
    // the one thing this manager exists to prevent. Whoever lost the race
    // finds the winner through `ready()` instead.
    if (this.fatalError !== undefined || this.generation !== undefined) return
    try {
      mkdirSync(this.options.home(), { recursive: true })
      writeRuntimeLock(this.options.home(), {
        childPid: process.pid, desktopPid: process.pid, startedAt: Date.now(), launchPending: true,
```

</details>

**依据 2 · 源码核查**：[src/main/web-ui-manager.ts:164-175](https://github.com/bruc3van/dsh-desktop/blob/94200dbe59a1a1476f7f1fe10cf924ab4d6f68bd/src/main/web-ui-manager.ts#L164-L175)

进程 PID 持久化

<details>
<summary>查看原文（12行）</summary>

```text
    const gen: WebUiGeneration = { child, ready, readyReported: false, stopped: false }
    let exitReported = false
    let readinessProbeStarted = false
    let stdoutTail = ''
    let stderrTail = ''

    this.generation = gen
    // Keep the pre-spawn reservation until the child PID has been persisted.
    const lockReady = (async () => {
      if (child.pid === undefined) return
      writeRuntimeLock(this.options.home(), {
        childPid: child.pid, desktopPid: process.pid, startedAt: Date.now(), source: dsh.source,
```

</details>

#### 缺口

- 锁是否具备跨进程原子语义待核
  **影响**：验证可能暴露恢复缺陷
  **进一步探讨**：先查锁实现再并发测试

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
