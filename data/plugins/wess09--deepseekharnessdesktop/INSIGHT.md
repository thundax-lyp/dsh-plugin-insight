# DeepSeek Harness 桌面版

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5f282de](https://github.com/wess09/DeepSeekHarnessDesktop/tree/5f282defdda49b8a63cbc56458005d508943ba95)

<!-- BEGIN META -->
[![GitHub ★ 130](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=130&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wess09/DeepSeekHarnessDesktop)
<!-- END META -->

> **功能**：将 Harness Web 与 Node 打包进独立 Electron 桌面应用。

> **亮点**：[Q01](#research-q01) 整合运行时、服务启动和桌面窗口。

> **主要限制**：[Q02](#research-q02) 关闭和实际停止不同，探测也未验证服务归属。

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
  - [Q01 · 桌面启动简化什么？](#detail-section-11)
  - [Q02 · 服务归属和关闭如何判定？](#detail-section-12)
  - [Q03 · 如何验证发行物与回退？](#detail-section-13)
  - [Q04 · 怎样减少关闭误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望从桌面启动 DSH Web 的开发者。

独立安装 Node 和 DSH 后手工运行 Web。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面入口 | 启动和打开 DSH | 依赖完整平台制品 |
| 进程管理 | 停止自启服务 | 关闭窗口仅隐藏 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 完整平台制品 | 必需 | 提供 Electron 与 Node | 保留 CLI |
| 可用 DSH 服务 | 界面必需 | 提供页面 | 检查日志 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对制品及上游版本 | 隔离数据 |
| 验证 | 操作者检查启动和复用 | 记录进程 |
| 退出 | 从托盘退出并查端口 | 保留原 CLI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 运行时资源未知 | 核对包及平台 | 未实测 |
| 持续 | 本地进程与日志 | 维护版本 | 真实占用未知 |
| 恢复 | 重装成本未知 | 确认端口和资料 | 不只关闭窗口 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面启动 | 内置运行时与窗口 | 制品可靠性 |
| 退出 | 记录进程可停 | 异常退出覆盖 |

> **思考**：[Q02](#research-q02) 关闭和实际停止不同，探测也未验证服务归属。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 整合运行时、服务启动和桌面窗口。

[Q02](#research-q02) 启动就绪与进程所有权需要分别记录。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 关闭和实际停止不同，探测也未验证服务归属。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先核对制品。[Q02](#research-q02) 区分关闭与退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定外壳和构建代表源码，未运行制品。

- 已检查：作者 README、包清单、源码路径 README.md、app/main.js、build/build-harness.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定桌面外壳及构建源码，未执行。
- 下一步：核对资源、端口复用、关闭和退出。

**分析版本**

- **仓库**：[wess09/DeepSeekHarnessDesktop](https://github.com/wess09/DeepSeekHarnessDesktop)
- **版本号**：0.1.0（[固定提交 5f282de](https://github.com/wess09/DeepSeekHarnessDesktop/tree/5f282defdda49b8a63cbc56458005d508943ba95)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 让进程归属和退出动作可见。

核对资源、端口复用、关闭和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 366 | 310 | 20 | — |
| .md | source | 1 | 101 | — | — | 763 |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/wess09/DeepSeekHarnessDesktop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/wess09/DeepSeekHarnessDesktop/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/wess09/DeepSeekHarnessDesktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面包装怎样管理 Harness 启动和退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面启动简化什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

想从桌面打开 DSH 而不手工准备 Node 或运行命令的人，可使用独立 Electron 包装。主进程从应用资源目录查找 Node 与 Harness，启动内置 Web CLI，并等待回环页面探测后加载窗口。浏览器关闭 Node 集成并隔离上下文。包装减少手工启动步骤，模型与工具来自被打包的上游。

#### 证据与依据

**依据 1 · 源码核查**：[app/main.js:28-38](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L28-L38)

内置资源与日志

<details>
<summary>查看原文（11行）</summary>

```text
function appResourcesDir() {
  return path.join(path.dirname(process.execPath), 'resources')
}
function nodeExe() {
  // Windows 内置 node.exe，macOS/Linux 为无扩展名可执行文件
  const name = process.platform === 'win32' ? 'node.exe' : 'node'
  return path.join(appResourcesDir(), 'node', name)
}
function harnessDir() { return path.join(appResourcesDir(), 'harness') }
function logFile() { return path.join(app.getPath('userData'), 'harness-server.log') }
function errFile() { return path.join(app.getPath('userData'), 'harness-server.err.log') }
```

</details>

**依据 2 · 源码核查**：[app/main.js:80-117](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L80-L117)

启动和等待

<details>
<summary>查看原文（38行）</summary>

```text
async function startHarness() {
  // 端口上已有一个可用实例则直接复用
  if (await probeServer()) return true

  const node = nodeExe()
  const cwd = harnessDir()
  if (!fs.existsSync(node)) { showError(`Node 运行时缺失：${node}`); return false }
  if (!fs.existsSync(path.join(cwd, 'apps', 'cli', 'src', 'bin.ts'))) { showError(`harness 目录不完整：${cwd}`); return false }

  stopRequested = false
  fs.mkdirSync(path.dirname(logFile()), { recursive: true })
  // 用 openSync 立即拿到文件描述符，spawn 的 stdio 才能使用
  const fdOut = fs.openSync(logFile(), 'a')
  const fdErr = fs.openSync(errFile(), 'a')
  fs.writeSync(fdOut, `\n===== ${new Date().toISOString()} DeepSeek Harness 启动 =====\n`)

  let child
  try {
    child = spawn(node, ['--import', 'tsx/esm', 'apps/cli/src/bin.ts', 'web'], {
      cwd, stdio: ['ignore', fdOut, fdErr], windowsHide: true,
    })
  } catch (e) { showError(`无法启动进程：${String(e.message || e)}`); return false }
  serverProcess = child

  child.on('error', (e) => { if (!stopRequested) showError(`进程错误：${String(e.message || e)}`) })
  child.on('exit', (code) => {
    if (serverProcess === child) serverProcess = null
    if (!stopRequested) showError(`harness 进程退出（码 ${code ?? 'unknown'}），见日志`)
  })

  const deadline = Date.now() + START_TIMEOUT_MS
  while (true) {
    if (await probeServer()) return true
    if (stopRequested) return false
    if (child.exitCode !== null) { showError(`harness 启动失败（码 ${child.exitCode}），见日志`); return false }
    if (Date.now() > deadline) { showError(`启动超时（${START_TIMEOUT_MS / 1000}s），见日志`); return false }
    await delay(1000)
  }
```

</details>

**依据 3 · 源码核查**：[app/main.js:180-195](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L180-L195)

WebUI 窗口

<details>
<summary>查看原文（16行）</summary>

```text
function openUi() {
  uiWindow = new BrowserWindow({
    width: 1280, height: 860,
    minWidth: 800, minHeight: 600,
    title: 'DeepSeek Harness',
    icon: appIcon(),
    frame: false, // 完全无边框，UI 铺满窗口
    webPreferences: {
      preload: path.join(__dirname, 'titlebar-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  uiWindow.loadURL(`http://127.0.0.1:${HARNESS_PORT}`)
  uiWindow.on('page-title-updated', (e) => e.preventDefault())
  uiWindow.on('closed', () => { uiWindow = null })
```

</details>

**依据 4 · 作者声明**：[README.md:3-15](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/README.md#L3-L15)

作者定位

<details>
<summary>查看原文（13行）</summary>

```text
将 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 打包成三平台桌面应用：
**Electron 桌面壳 + 内置 Node 运行时 + 完整 Harness 环境**，双击即用。

![DeepSeek](log.svg)

## ✨ 特性

- **一键启动**：双击 `DeepSeekHarness.exe` → 自动拉起后端 → 直接打开 DeepSeek Harness Web UI
- **内置 Node 24**：自包含运行时，用户无需安装 Node.js
- **完整环境**：打包了 Harness 全部依赖（链接已物化为真实文件）
- **无边框窗口**：UI 铺满窗口，右上角内嵌最小化 / 最大化 / 关闭按钮
- **单实例**：重复启动不会拉起多个后端
- **免管理员**：Windows 安装到 `%LocalAppData%\Programs\DeepSeek Harness`
```

</details>

#### 缺口

- 未运行打包应用
  **影响**：无法证明资源完整、启动成功或兼容
  **进一步探讨**：核验固定制品后启动并读回版本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 服务归属和关闭如何判定？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

就绪探测只检查固定回环端口的页面是否含启动标记，匹配时复用现有实例而不创建子进程。停止函数只处理已记录的进程。README 写关闭窗口即停止，但实际 close 事件在正常情况下隐藏窗口，托盘继续；托盘退出明确调用停止。不能把窗体消失或网页成功当作服务已停或属当前发行物。

#### 证据与依据

**依据 1 · 源码核查**：[app/main.js:55-68](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L55-L68)

页面标记检测

<details>
<summary>查看原文（14行）</summary>

```text
function probeServer() {
  return new Promise((resolve) => {
    const req = http.get(
      { host: '127.0.0.1', port: HARNESS_PORT, path: '/', timeout: 3000 },
      (res) => {
        let body = ''
        res.on('data', (c) => { body += c })
        res.on('end', () => resolve(body.includes(BOOT_MARKER)))
        res.resume()
      },
    )
    req.on('error', () => resolve(false))
    req.on('timeout', () => { req.destroy(); resolve(false) })
  })
```

</details>

**依据 2 · 源码核查**：[app/main.js:80-87](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L80-L87)

既有服务复用

```text
async function startHarness() {
  // 端口上已有一个可用实例则直接复用
  if (await probeServer()) return true

  const node = nodeExe()
  const cwd = harnessDir()
  if (!fs.existsSync(node)) { showError(`Node 运行时缺失：${node}`); return false }
  if (!fs.existsSync(path.join(cwd, 'apps', 'cli', 'src', 'bin.ts'))) { showError(`harness 目录不完整：${cwd}`); return false }
```

**依据 3 · 源码核查**：[app/main.js:120-131](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L120-L131)

只停止记录进程

<details>
<summary>查看原文（12行）</summary>

```text
function stopHarness() {
  stopRequested = true
  if (serverProcess && serverProcess.pid) {
    try {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(serverProcess.pid), '/T', '/F'], { windowsHide: true })
      } else {
        process.kill(serverProcess.pid, 'SIGTERM')
      }
    } catch { /* 忽略 */ }
    serverProcess = null
  }
```

</details>

**依据 4 · 源码核查**：[app/main.js:160-170](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L160-L170)

托盘退出

<details>
<summary>查看原文（11行）</summary>

```text
  tray.setToolTip('DeepSeek Harness')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '打开界面', click: () => showUi() },
    { type: 'separator' },
    { label: '退出', click: () => {
      isQuitting = true
      stopHarness()
      app.quit()
    } },
  ]))
  tray.on('click', () => showUi())
```

</details>

**依据 5 · 源码核查**：[app/main.js:193-201](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L193-L201)

关闭隐藏

```text
  uiWindow.loadURL(`http://127.0.0.1:${HARNESS_PORT}`)
  uiWindow.on('page-title-updated', (e) => e.preventDefault())
  uiWindow.on('closed', () => { uiWindow = null })
  // 点关闭（✕）不退出，隐藏到托盘，服务继续运行
  uiWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      uiWindow.hide()
    }
```

**依据 6 · 作者声明**：[README.md:94-97](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/README.md#L94-L97)

文档描述差异

```text
## ⚠️ 注意

- 用户数据存放在 `~/.dsh`（与安装目录分离），卸载后保留
- 服务监听 `http://127.0.0.1:3080`，关闭窗口即停止
```

#### 缺口

- 未验证正常退出和异常系统关闭
  **影响**：实际进程清理与复用范围未知
  **进一步探讨**：用受控端口分别核对自启、复用和退出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何验证发行物与回退？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者提供三平台打包方式。构建阶段下载 Node、拉取上游并物化依赖，脚本按 master 拉取，固定外壳提交不能独立证明上游内容。核对具体制品、内置版本与校验后再用隔离数据。启动使用本机资源和日志，卸载后作者说明数据仍保留。退出时从托盘停止并检查端口，保留原 CLI 作退路。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-28](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/README.md#L17-L28)

作者平台产物

<details>
<summary>查看原文（12行）</summary>

```text
## 📦 产物

| 平台 | 文件 | 说明 |
|------|------|------|
| Windows | `installers/DeepSeekHarnessSetup-*.exe` | Inno Setup 一键安装包 |
| Windows | `build/DeepSeekHarnessApp/DeepSeekHarness.exe` | 免安装版（直接运行） |
| macOS | `installers/DeepSeekHarness-macOS-<arch>-<ver>.dmg` | 应用镜像（.app，ad-hoc 签名） |
| Linux | `installers/DeepSeekHarness-linux-<arch>-<ver>.tar.gz` | 免安装压缩包（解压即用） |
| Linux | `installers/deepseek-harness_<ver>_<arch>.deb` | Debian/Ubuntu 安装包 |

> 三平台均由 GitHub Actions 自动构建（`.github/workflows/build.yml` 矩阵），
> 推送 `v*` 标签时自动发布到 Release；也可 `workflow_dispatch` 手动触发。
```

</details>

**依据 2 · 作者声明**：[README.md:49-75](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/README.md#L49-L75)

构建依赖与步骤

<details>
<summary>查看原文（27行）</summary>

````text
## 🔧 构建流程

> 本地需要：Node.js ≥ 22、[pnpm 10](https://pnpm.io/)（注意：**必须用 pnpm 10**，
> pnpm 11 移除了 hoisted linker）；Windows 额外需要 [Inno Setup 7](https://jrsoftware.org/isdl.php)。
> CI 三平台全自动，无需本地环境。

### 1. 准备 Harness 依赖（pnpm 10 + hoisted）

```bash
node build/build-harness.js        # 克隆 → 删 packageManager → .npmrc(hoisted) → pnpm install → pnpm build
```

### 2. 物化链接 + 精简

```bash
node build/materialize3.js resources/harness   # junction/符号链接 → 真实文件
node build/trim.js                             # 删除冗余 @deepseek-ai 副本、拷贝 web 前端
```

### 3. 运行时 + 组装

```bash
node build/download-node.js v24.14.0           # 内置 Node（按当前平台/架构）
npm install                                    # electron + sharp + png-to-ico
node build/convert-icon.js log.svg build/app.ico
node build/assemble.js                         # 组装到 build/DeepSeekHarnessApp
```
````

</details>

**依据 3 · 源码核查**：[build/build-harness.js:20-32](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/build/build-harness.js#L20-L32)

构建克隆目标

<details>
<summary>查看原文（13行）</summary>

```text
    process.exit(1)
  }
}

if (!fs.existsSync(path.join(h, 'package.json'))) {
  run('git', ['clone', '--depth', '1', '--branch', 'master',
    'https://github.com/deepseek-ai/deepseek-harness.git', h], proj)
}

const pkgPath = path.join(h, 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
delete pkg.packageManager
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
```

</details>

**依据 4 · 作者声明**：[README.md:88-97](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/README.md#L88-L97)

使用与数据条件

<details>
<summary>查看原文（10行）</summary>

```text
## 🚀 使用

1. 双击 `DeepSeekHarnessSetup-*.exe` 安装（免管理员，自动建桌面快捷方式）
2. 双击桌面「DeepSeek Harness」图标
3. 首次使用：在 Web 界面设置 **DeepSeek API Key**

## ⚠️ 注意

- 用户数据存放在 `~/.dsh`（与安装目录分离），卸载后保留
- 服务监听 `http://127.0.0.1:3080`，关闭窗口即停止
```

</details>

#### 缺口

- 未检查发行物、三平台或原生签名
  **影响**：不能给出可安装性和真实成本
  **进一步探讨**：用固定制品记录版本及进程

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少关闭误判？

**研究主题**：新假设与验证

#### 完整回答

可在托盘和窗口标出外壳自启或复用实例，并明确关闭会隐藏、退出才尝试停止自启服务。用同一环境对照关闭和退出两类任务，测误以为已停止及恢复耗时；若误判没有改善则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[app/main.js:80-87](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L80-L87)

已有复用判据

```text
async function startHarness() {
  // 端口上已有一个可用实例则直接复用
  if (await probeServer()) return true

  const node = nodeExe()
  const cwd = harnessDir()
  if (!fs.existsSync(node)) { showError(`Node 运行时缺失：${node}`); return false }
  if (!fs.existsSync(path.join(cwd, 'apps', 'cli', 'src', 'bin.ts'))) { showError(`harness 目录不完整：${cwd}`); return false }
```

**依据 2 · 源码核查**：[app/main.js:120-131](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L120-L131)

已有停止边界

<details>
<summary>查看原文（12行）</summary>

```text
function stopHarness() {
  stopRequested = true
  if (serverProcess && serverProcess.pid) {
    try {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(serverProcess.pid), '/T', '/F'], { windowsHide: true })
      } else {
        process.kill(serverProcess.pid, 'SIGTERM')
      }
    } catch { /* 忽略 */ }
    serverProcess = null
  }
```

</details>

**依据 3 · 源码核查**：[app/main.js:193-201](https://github.com/wess09/DeepSeekHarnessDesktop/blob/5f282defdda49b8a63cbc56458005d508943ba95/app/main.js#L193-L201)

关闭隐藏

```text
  uiWindow.loadURL(`http://127.0.0.1:${HARNESS_PORT}`)
  uiWindow.on('page-title-updated', (e) => e.preventDefault())
  uiWindow.on('closed', () => { uiWindow = null })
  // 点关闭（✕）不退出，隐藏到托盘，服务继续运行
  uiWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      uiWindow.hide()
    }
```

#### 缺口

- 未检查用户实际理解
  **影响**：提示效果未知
  **进一步探讨**：用两类进程做盲测

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
