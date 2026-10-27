# DSHCode

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[058e9f9](https://github.com/whitelonng/dshcode/tree/058e9f949ca15bcd973164d4d4e9218923f4eb26)

<!-- BEGIN META -->
[![GitHub ★ 703](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=703&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whitelonng/dshcode)
<!-- END META -->

> **功能**：将 DeepSeek Harness 的 Web UI 和插件运行时打包为 macOS、Windows 桌面应用。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把原Harness Web和运行时交付成桌面入口；[Q03](#research-q03)故障候选与safeMode降低黑屏后无路可退的风险，但代理执行能力主要继承上游。

> **主要限制**：[Q03](#research-q03)错误文字和安装时间只给嫌疑，非根因；[Q02](#research-q02)窗口关闭可能仅隐藏、启动超时不自动取消，不能以UI入口推断树已停止或恢复已成功。

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
  - [Q01 · DSHCode给不想配置Node与终端的人增加什么，哪些继承上游？](#detail-section-11)
  - [Q02 · 启动、窗口导航与真正退出如何接到Harness服务？](#detail-section-12)
  - [Q03 · 插件失败归因与安全模式是不是自动修复保证？](#detail-section-13)
  - [Q04 · 免费桌面分发是否足以替代原工具链，总负担怎么验？](#detail-section-14)
  - [Q05 · 怎样把故障候选交接给Agent而不把猜测当定因？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：这是把Harness Web UI与运行时包装为Electron的独立客户端，不能作为插件装进已有DSH。目标是希望直接安装macOS/Windows应用、使用模型和插件而不管理Node/启动命令的人，合格结果是可启动、明确数据目录并在插件出错时仍有恢复路径。模型、Skill、子Agent、工作流和大部分Web UI继承Harness，不是外壳新发明。相对手工安装CLI并打开浏览器，桌面层增加单实例、托盘、精确loopback导航和启动失败对话；本轮重点核查这些链路，不用全仓规模证明原创。固定apps/desktop包写1.1.0而根monorepo写0.1.2-alpha.4，二者不是同一个版本标识，固定源码也不等于已下载发行包。

原Harness CLI+浏览器以及手工禁用故障插件；外壳提供便利和恢复入口，不新增模型推理或保证安全。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面外壳 | 安装后直接启动Harness | 内置包及模型配置 |
| 故障恢复 | 候选禁用/安全模式 | 嫌疑非根因，须用户确认 |
| 原DSH能力 | Skill/子Agent等作者声明 | 继承上游，未逐项验 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 失效处理 |
|---|---|---|---|
| Electron与内置Harness包 | 必需 | 原Web UI/工具 | 启动失败对话 |
| 模型凭据与权限 | 真实任务必需 | 代理执行 | 沿宿主配置/审批 |
| 可写profile与启动标记 | 恢复必需 | 状态/禁用/safeMode | 标记异常降级首次，禁用失败可能继续重启 |
| Node/pnpm与workspace构建 | 仅源码必需 | 开发打包 | 不等同安装版使用条件 |

| 步骤 | 动作 | 验收与退路 |
|---|---|---|
| 准备 | 用户核平台并复制数据 | 原profile保留 |
| 启动 | 主进程runProfile+精确origin | 模型和原会话可读 |
| 故障 | 用户选禁用候选/安全模式 | 核实际patch及重启结果 |
| 退出 | 托盘/应用退出触发shutdown | 不只关闭窗口 |

**效果与成本**

| 阶段 | 现金与资源 | 人工时间 | 未知 |
|---|---|---|---|
| 首次 | 完整Electron/模型资源 | 安装和复制profile | 发行/迁移未验 |
| 持续 | 内存、后台与模型费用 | 插件兼容与目录管理 | 无实测账单 |
| 恢复退出 | 重启/备份资源 | 核候选禁用、safeMode、真正退出 | 窗口hide不是shutdown |

| 效果 | 源码支持 | 未知 |
|---|---|---|
| 免手工启动 | 主进程runProfile | 发行包开箱通过 |
| 恢复 | 故障候选及安全模式 | 误归因与恢复率 |
| 退出 | shutdown后exit | 所有平台资源完全释放 |

> **思考**：[Q03](#research-q03)错误文字和安装时间只给嫌疑，非根因；[Q02](#research-q02)窗口关闭可能仅隐藏、启动超时不自动取消，不能以UI入口推断树已停止或恢复已成功。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把原Harness Web和运行时交付成桌面入口；[Q03](#research-q03)故障候选与safeMode降低黑屏后无路可退的风险，但代理执行能力主要继承上游。

[Q02](#research-q02)精确loopback、导航策略与退出合并器便于移植；[Q03](#research-q03)在safeMode仍失败时停止归咎用户插件是有价值边界。移植仍要重验宿主树、托盘与文件状态，不能仅靠UI错误消息认证修复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)错误文字和安装时间只给嫌疑，非根因；[Q02](#research-q02)窗口关闭可能仅隐藏、启动超时不自动取消，不能以UI入口推断树已停止或恢复已成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

首次需要匹配平台架构的完整安装包和模型凭据，源码开发另需Node、pnpm及工作区构建；包装免终端不等于模型/API费用为零。持续负担包含Electron内存、模型费、插件版本和数据目录维护；失败时需人工辨认嫌疑插件、安全模式与真正退出，窗口隐藏后后台仍可能活动。未测迁移、更新或卸载后的数据一致性，不能建议覆盖既有生产目录。适合观察后在独立profile小范围验证启动、插件失败恢复和原会话保留；若已有CLI+浏览器稳定而不需要桌面管理，简单基线仍足够。金额、耗时和合格任务收益均未知，README对未签名包“软件安全”的表述不能由缺签名解释本身证明，本轮不继承该保证。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子集源码支持loopback桌面启动、安全窗口与用户确认的插件恢复；未安装/运行客户端、发行包和恢复结果未验；诊断交付包是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、apps/desktop/package.json、apps/desktop/src/main.ts、apps/desktop/src/lifecycle.ts、apps/desktop/src/recovery.ts、apps/desktop/src/boot-marker.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已核查源码子集：README、根与桌面package、main/lifecycle/recovery/boot-marker；inventory来自INSPECTED-SNAPSHOT，仅子集、不报全仓LOC或完整上游审计；未构建安装或执行。
- 下一步：在复制profile核发行安装、单实例、关闭hide与真正退出；注入错误/挂起/禁用写失败/核心故障，对照原会话和文件状态，未执行。

**分析版本**

- **仓库**：[whitelonng/dshcode](https://github.com/whitelonng/dshcode)
- **版本号**：0.1.2-alpha.4（[固定提交 058e9f9](https://github.com/whitelonng/dshcode/tree/058e9f949ca15bcd973164d4d4e9218923f4eb26)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是把恢复对话中的候选、归因依据、固定包版本和只读诊断组成交付包，明确“名字命中/安装时间嫌疑/已复现”三类；Agent只能提修复方案，真正禁用或改包后另做独立启动与原会话回查。它基于现有启动标记与嫌疑收集，增量是证据等级和修复后验收责任，不是再做一个自动重试按钮。最小验证用同名插件、依赖错误、核心故障和加载挂起案例比较误禁比例、恢复成功与人工耗时；若证据标签不减少误禁或所需人工大于直接安全模式，则否定插件化诊断机会。当前没有独立需求与效果材料，保持机会假设。 [Q05](#research-q05)

在复制profile核发行安装、单实例、关闭hide与真正退出；注入错误/挂起/禁用写失败/核心故障，对照原会话和文件状态，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：8b84bc67217eefdbb8d5e5b0d0415a89174f155fd5386f9d33c0e5921d61713f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 229 | — | — | 3413 |
| .ts | source | 4 | 1032 | 688 | 276 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/whitelonng/dshcode/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/whitelonng/dshcode/issues?q=is%3Aissue+created%3A2026-09-27T08%3A28%3A34.000Z..2026-10-27T08%3A28%3A34Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/whitelonng/dshcode/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A28%3A34.000Z..2026-10-27T08%3A28%3A34Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查桌面包装的真实新增贡献与启动恢复、退出和版本边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSHCode给不想配置Node与终端的人增加什么，哪些继承上游？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是把Harness Web UI与运行时包装为Electron的独立客户端，不能作为插件装进已有DSH。目标是希望直接安装macOS/Windows应用、使用模型和插件而不管理Node/启动命令的人，合格结果是可启动、明确数据目录并在插件出错时仍有恢复路径。模型、Skill、子Agent、工作流和大部分Web UI继承Harness，不是外壳新发明。相对手工安装CLI并打开浏览器，桌面层增加单实例、托盘、精确loopback导航和启动失败对话；本轮重点核查这些链路，不用全仓规模证明原创。固定apps/desktop包写1.1.0而根monorepo写0.1.2-alpha.4，二者不是同一个版本标识，固定源码也不等于已下载发行包。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-17](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/README.md#L3-L17)

桌面包装和继承关系由作者说明。

<details>
<summary>查看原文（15行）</summary>

```text
[English](README.zh.md) | 中文

DSHCode 是一款面向 macOS 和 Windows 的免费开源桌面 AI Agent 应用。它将 DeepSeek 官方开源项目 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 Web UI 与插件运行时打包成一个可直接安装的 Electron 应用——无需 Node.js、无需终端、无需命令行。

<p align="center"><a href="https://github.com/whitelonng/dshcode/releases"><img src="https://img.shields.io/github/v/release/whitelonng/dshcode?style=flat-square&label=release" alt="Release"></a> <a href="LICENSE"><img src="https://img.shields.io/github/license/whitelonng/dshcode?style=flat-square" alt="License"></a> <a href="https://github.com/whitelonng/dshcode/releases"><img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows-4D6BFE?style=flat-square" alt="Platform"></a>  <a href="https://github.com/deepseek-ai/deepseek-harness"><img src="https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white" alt="Powered by dsh"></a></p>

<p align="center"><img src="apps/desktop/assets/icon.svg" alt="DSHCode 应用图标" width="180"></p>

<p align="center"><img src="assets/readme/dshcode-dark.png" alt="DSHCode 深色主题" width="49%"> <img src="assets/readme/dshcode-light.png" alt="DSHCode 浅色主题" width="49%"></p>

## 功能特性

DSHCode 继承了 DeepSeek Harness 的完整能力，并加上了开箱即用的桌面体验。

**Agent 核心** — 插件化框架，内置 bash、文件系统、网页搜索/抓取、终端、LSP 与子进程工具；支持沙箱隔离与逐操作审批提示。
```

</details>

**依据 2 · 源码核查**：[apps/desktop/package.json:2-24](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/package.json#L2-L24)

独立private Electron桌面包1.1.0。

<details>
<summary>查看原文（23行）</summary>

```text
  "name": "@dshcode/desktop",
  "productName": "DSHCode",
  "description": "Electron desktop shell for the DeepSeek Harness Web UI",
  "version": "1.1.0",
  "author": "DSHCode contributors",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/whitelonng/dshcode.git",
    "directory": "apps/desktop"
  },
  "private": true,
  "type": "module",
  "main": "lib/main.js",
  "scripts": {
    "dev": "electron .",
    "stage": "node scripts/prepare-package.mjs",
    "package": "node scripts/build-package.mjs --dir",
    "dist": "node scripts/build-package.mjs",
    "dist:mac:arm64": "node scripts/build-package.mjs --mac --arm64",
    "dist:mac:x64": "node scripts/build-package.mjs --mac --x64",
    "dist:win:x64": "node scripts/build-package.mjs --win --x64"
  },
  "license": "MIT",
```

</details>

**依据 3 · 源码核查**：[package.json:2-10](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/package.json#L2-L10)

根monorepo版本与Node约束，不能当桌面发行版本。

```text
  "name": "@deepseek-ai/dsh-root",
  "version": "0.1.2-alpha.4",
  "license": "MIT",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动、窗口导航与真正退出如何接到Harness服务？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

桌面调用runProfile web，参数固定127.0.0.1、端口0及no-open，并检查实际激活服务确实绑定该地址和有效端口，再让Electron加载精确origin。导航策略只容许自身origin留在应用、外部HTTPS交系统浏览器，其他协议拒绝；主窗口启用contextIsolation/sandbox，关闭nodeIntegration、webview及不安全内容。正常退出由QuitCoordinator合并请求，等待Harness.shutdown后才本地exit；但有托盘时窗口关闭只是hide，不能把关窗口等同服务停止。启动超时60秒只让等待promise失败，底层树仍由调用方负责清理，不是自动取消。宿主与工具仍有其自身权限，Electron渲染沙箱不能替代文件/终端审批。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src/lifecycle.ts:25-46](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/lifecycle.ts#L25-L46)

固定loopback与端口0、激活地址核对。

<details>
<summary>查看原文（22行）</summary>

```text
 * @returns Arguments that bind only to loopback, request an ephemeral port, and suppress the external browser.
 */
export function desktopWebArguments(): readonly string[] {
  return ['--host', DESKTOP_WEB_HOST, '--port', String(DESKTOP_WEB_PORT), '--no-open']
}

/**
 * Convert the activated WebServer address into the renderer URL while enforcing desktop isolation.
 * @param host - host reported by the activated WebServer service.
 * @param port - actual listening port reported after the operating system binds the socket.
 * @returns The local application URL.
 * @throws when the service did not bind the required loopback host or still reports an invalid port.
 */
export function desktopApplicationUrl(host: string, port: number): string {
  if (host !== DESKTOP_WEB_HOST) {
    throw new Error(`desktop web service bound unexpected host ${JSON.stringify(host)}`)
  }
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`desktop web service reported invalid port ${String(port)}`)
  }
  return `http://${DESKTOP_WEB_HOST}:${String(port)}/`
}
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src/lifecycle.ts:67-104](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/lifecycle.ts#L67-L104)

导航分类与等待shutdown再exit。

<details>
<summary>查看原文（38行）</summary>

```text
 */
export function navigationDisposition(
  rawUrl: string,
  applicationOrigin: string,
): NavigationDisposition {
  let destination: URL
  try {
    destination = new URL(rawUrl)
  } catch {
    return 'blocked'
  }
  if (destination.origin === applicationOrigin) return 'application'
  if (destination.protocol === 'https:') return 'external'
  return 'blocked'
}

/**
 * Coordinate native quit requests around the Harness disposer.
 * @param shutdown - controller for the booted Harness tree.
 * @param exit - native process exit callback, called only after disposal settles.
 * @returns A controller that coalesces repeated quit requests.
 */
export function createQuitCoordinator(
  shutdown: DesktopShutdown,
  exit: (code: number) => void,
): QuitCoordinator {
  let pending: Promise<void> | undefined
  return {
    get requested() {
      return pending !== undefined
    },
    request(code) {
      pending ??= shutdown.shutdown(code).then(() => { exit(code) })
      return pending
    },
  }
}

```

</details>

**依据 3 · 源码核查**：[apps/desktop/src/main.ts:179-212](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/main.ts#L179-L212)

实际窗口安全设置与有托盘时关闭隐藏。

<details>
<summary>查看原文（34行）</summary>

```text
      : {}),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      navigateOnDragDrop: false,
      preload: join(mainDir, 'preload.cjs'),
      additionalArguments: customFrame
        ? [DESKTOP_FRAME_ARG, ...desktopLaunchArguments(PRODUCT_NAME, app.getVersion())]
        : desktopLaunchArguments(PRODUCT_NAME, app.getVersion()),
    },
  })
  mainWindow = window
  installRendererPolicy(window, origin)
  window.on('page-title-updated', (event) => {
    event.preventDefault()
    window.setTitle(PRODUCT_NAME)
  })
  // Closing the window hides to the tray unless a real quit owns teardown;
  // without a tray host (some Linux desktops) the close really closes.
  window.on('close', (event) => {
    if (tray !== undefined && windowCloseDisposition(quitArmed) === 'hide') {
      event.preventDefault()
      window.hide()
    }
  })
  window.once('ready-to-show', () => { window.show() })
  window.on('closed', () => {
    if (mainWindow === window) mainWindow = undefined
  })
  await window.loadURL(rawUrl)
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src/main.ts:383-410](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/main.ts#L383-L410)

runProfile与safeMode参数及退出协调器。

<details>
<summary>查看原文（28行）</summary>

```text
  let running: Awaited<ReturnType<typeof runProfile>>
  try {
    running = await withBootTimeout(runProfile({
      environment: loadLayeredEnv('dsh'),
      profile: 'web',
      patchFiles: [],
      args: desktopWebArguments(),
      watchUserPatches: false,
      skipUserPatches: safeMode,
      failLoud: reportLateRejection,
    }), DESKTOP_BOOT_TIMEOUT_MS)
  } catch (error) {
    await handleStartupFailure(error, {
      home,
      profilePatchPath,
      lastOkAt: previousMarker?.state === 'ok' ? previousMarker.at : undefined,
      bootAttempts: marker?.bootAttempts ?? 1,
      safeMode,
    })
    return
  }
  await writeBootMarker(home, 'ok').catch((error: unknown) => {
    console.error(`${PRODUCT_NAME}: failed to write boot marker`, error)
  })
  await clearResolvedFailures(home, profilePatchPath).catch((error: unknown) => {
    console.error(`${PRODUCT_NAME}: failed to clear resolved boot failures`, error)
  })
  quitCoordinator = createQuitCoordinator(running.shutdown, finishNativeExit)
```

</details>

**依据 5 · 源码核查**：[apps/desktop/src/recovery.ts:26-53](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/recovery.ts#L26-L53)

启动看门狗不取消底层启动promise。

<details>
<summary>查看原文（28行）</summary>

```text
 * a timeout; the caller owns teardown (the desktop exits or relaunches).
 * @param promise - the boot operation.
 * @param ms - timeout in milliseconds.
 * @returns the boot result.
 * @throws {BootHangError} when the promise does not settle within `ms`.
 */
export function withBootTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      reject(new BootHangError(`desktop boot did not settle within ${String(ms)} ms`))
    }, ms)
    promise.then(
      (value) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        // Reject with the original Error so callers keep its identity; a
        // non-Error rejection reason becomes a labelled Error.
        reject(error instanceof Error ? error : new Error(String(error)))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 插件失败归因与安全模式是不是自动修复保证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

恢复器对显式加载错误用message/stack包含已安装插件名作归因，挂起则把上次成功启动后安装/更新者列为嫌疑；没有成功参考时不猜挂起插件。它只是故障候选，不是复现证明：名字子串、连带依赖和安装时刻不能确定根因。实际对话让用户选择禁用候选并重启、安全模式或退出；安全模式只跳过用户patch层，内置组件坏仍可失败，此时仅重试/退出，不继续乱禁用户插件。连续启动失败三次只使默认选项建议安全模式，不会自动修复源码。disable写失败会记错误然后仍重启，故用户应核对插件实际状态；“让Agent修复”的作者入口也不代表补丁已正确或已验收。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src/recovery.ts:80-108](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/recovery.ts#L80-L108)

字符串与安装时间启发式归因，不是因果确认。

<details>
<summary>查看原文（29行）</summary>

```text
export function attributeLoadFailure(
  error: unknown,
  installed: readonly InstalledPluginRecord[],
): string[] {
  const { message, stack } = failureMessage(error)
  const text = `${message}\n${stack}`
  return installed
    .map(plugin => plugin.name)
    .filter(name => name !== '' && text.includes(name))
}

/**
 * The plugins suspected of a boot hang: those installed or updated after the
 * last successful boot. Without a known-ok reference no plugin is suspected.
 * @param installed - the recorded installed plugins.
 * @param lastOkAt - ISO timestamp of the last successful boot, when known.
 * @returns the suspect plugin ids, in installed-list order.
 */
export function hangSuspects(
  installed: readonly InstalledPluginRecord[],
  lastOkAt: string | undefined,
): string[] {
  if (lastOkAt === undefined) return []
  const lastOk = Date.parse(lastOkAt)
  if (Number.isNaN(lastOk)) return []
  return installed
    .filter(plugin => Date.parse(plugin.installedAt) > lastOk)
    .map(plugin => plugin.name)
}
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src/main.ts:276-341](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/main.ts#L276-L341)

真实恢复对话、安全模式失败、禁用失败处理。

<details>
<summary>查看原文（66行）</summary>

```text
  const { home, profilePatchPath, lastOkAt, bootAttempts, safeMode } = context
  const decision = recoveryDecision({ error, installed: readPluginState(home).plugins, lastOkAt })

  // Safe mode failing still means a broken bundle layer or overlay, not a
  // user plugin; retry or exit, without disabling anything.
  if (safeMode) {
    const { response } = await dialog.showMessageBox({
      type: 'error',
      title: `${PRODUCT_NAME} 启动失败`,
      message: '安全模式下仍无法启动',
      detail: `${decision.message}\n\n安全模式已跳过用户插件配置，问题可能来自内置组件或安装本身。请重试，或退出后检查安装。`,
      buttons: ['重启应用', '退出'],
      defaultId: 0,
      cancelId: 1,
      noLink: true,
    })
    if (response === 0) {
      app.relaunch()
      requestQuit(0)
      return
    }
    requestQuit(1)
    return
  }

  const attributable = decision.kind === 'attributable'
  if (attributable) await recordBootFailures(home, decision)
  const crashLoopHint = bootAttempts >= CONSECUTIVE_FAILURE_THRESHOLD
    ? '\n\n连续多次启动失败，建议使用安全模式。'
    : ''
  const detail = attributable
    ? `以下插件未能正常加载：${decision.pluginIds.join('、')}\n\n${decision.message}${crashLoopHint}`
    : `无法确定是哪个插件导致启动失败。${crashLoopHint}\n\n${decision.message}`
  const safeModeIndex = attributable ? 1 : 0
  const buttons = attributable ? ['继续（禁用插件并重启）', '安全模式启动', '退出'] : ['安全模式启动', '退出']
  const { response } = await dialog.showMessageBox({
    type: 'error',
    title: `${PRODUCT_NAME} 启动失败`,
    message: '插件启动失败',
    detail,
    buttons,
    defaultId: crashLoopHint !== '' ? safeModeIndex : 0,
    cancelId: buttons.length - 1,
    noLink: true,
  })
  if (attributable && response === 0) {
    for (const pluginId of decision.pluginIds) {
      try {
        await setPluginRowEnabled(profilePatchPath, pluginId, false)
      } catch (disableError) {
        console.error(`${PRODUCT_NAME}: failed to disable ${pluginId}`, disableError)
      }
    }
    app.relaunch()
    requestQuit(0)
    return
  }
  if (response === safeModeIndex) {
    await setSafeMode(home, true)
    app.relaunch()
    requestQuit(0)
    return
  }
  requestQuit(1)
}

```

</details>

**依据 3 · 源码核查**：[apps/desktop/src/boot-marker.ts:68-80](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/boot-marker.ts#L68-L80)

持久started/ok与连续失败计数。

<details>
<summary>查看原文（13行）</summary>

```text
export async function writeBootMarker(home: string, state: 'started' | 'ok'): Promise<BootMarker> {
  const previous = readBootMarker(home)
  const marker: BootMarker = {
    state,
    at: new Date().toISOString(),
    pid: process.pid,
    bootAttempts: state === 'ok'
      ? 0
      : previous === undefined || previous.state === 'ok'
        ? 1
        : previous.bootAttempts + 1,
  }
  const path = bootMarkerPath(home)
```

</details>

#### 缺口

- 未在真实Electron注入启动挂起、同名插件误归因或禁用写失败。
  **影响**：无法证明各平台恢复实际成功率，不能把恢复入口称为自动修复保证。
  **进一步探讨**：在复制profile中故障注入并比对候选归因、禁用后的patch、原数据和最终重启状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 免费桌面分发是否足以替代原工具链，总负担怎么验？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

首次需要匹配平台架构的完整安装包和模型凭据，源码开发另需Node、pnpm及工作区构建；包装免终端不等于模型/API费用为零。持续负担包含Electron内存、模型费、插件版本和数据目录维护；失败时需人工辨认嫌疑插件、安全模式与真正退出，窗口隐藏后后台仍可能活动。未测迁移、更新或卸载后的数据一致性，不能建议覆盖既有生产目录。适合观察后在独立profile小范围验证启动、插件失败恢复和原会话保留；若已有CLI+浏览器稳定而不需要桌面管理，简单基线仍足够。金额、耗时和合格任务收益均未知，README对未签名包“软件安全”的表述不能由缺签名解释本身证明，本轮不继承该保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:67-81](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/README.md#L67-L81)

作者分发和签名说明，独立安全保证未验证。

<details>
<summary>查看原文（15行）</summary>

````text
预览版安装包尚未进行代码签名或公证，因此 macOS Gatekeeper 与 Windows SmartScreen 可能在首次启动前发出警告。软件本身是安全的；警告只是因为二进制文件缺少付费签名证书：

- **macOS**：在访达中右键点击应用并选择**打开**，然后在弹窗中确认。或者在终端执行一次 `xattr -cr /Applications/DSHCode.app`。
- **Windows**：在 SmartScreen 弹窗中点击**更多信息**，然后选择**仍要运行**。

## 快速开始

安装 DSHCode 安装包后，从 macOS“应用程序”文件夹或 Windows“开始”菜单打开 `DSHCode`。应用会自行启动和停止内置 Web profile；安装版用户无需运行终端命令。

### 从源码运行

开发者仍可从仓库源码运行上游 Web 入口：

```sh
git clone https://github.com/whitelonng/dshcode.git
````

</details>

**依据 2 · 源码核查**：[apps/desktop/src/main.ts:196-202](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/main.ts#L196-L202)

有托盘关闭只隐藏，持续资源不能省略。

```text
  window.on('page-title-updated', (event) => {
    event.preventDefault()
    window.setTitle(PRODUCT_NAME)
  })
  // Closing the window hides to the tray unless a real quit owns teardown;
  // without a tray host (some Linux desktops) the close really closes.
  window.on('close', (event) => {
```

**依据 3 · 源码核查**：[apps/desktop/package.json:16-24](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/package.json#L16-L24)

源码与打包构建命令，不能把免Node体验推广到源码开发。

```text
    "dev": "electron .",
    "stage": "node scripts/prepare-package.mjs",
    "package": "node scripts/build-package.mjs --dir",
    "dist": "node scripts/build-package.mjs",
    "dist:mac:arm64": "node scripts/build-package.mjs --mac --arm64",
    "dist:mac:x64": "node scripts/build-package.mjs --mac --x64",
    "dist:win:x64": "node scripts/build-package.mjs --win --x64"
  },
  "license": "MIT",
```

#### 缺口

- 发行包完整性、真实安装/升级/退出和现有数据迁移未验收。
  **影响**：不能证明桌面包装降低全周期负担，不能升级持续采用。
  **进一步探讨**：复制数据profile比较CLI+浏览器与桌面启动、故障恢复、日常资源及用户继续意愿。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样把故障候选交接给Agent而不把猜测当定因？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把恢复对话中的候选、归因依据、固定包版本和只读诊断组成交付包，明确“名字命中/安装时间嫌疑/已复现”三类；Agent只能提修复方案，真正禁用或改包后另做独立启动与原会话回查。它基于现有启动标记与嫌疑收集，增量是证据等级和修复后验收责任，不是再做一个自动重试按钮。最小验证用同名插件、依赖错误、核心故障和加载挂起案例比较误禁比例、恢复成功与人工耗时；若证据标签不减少误禁或所需人工大于直接安全模式，则否定插件化诊断机会。当前没有独立需求与效果材料，保持机会假设。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src/recovery.ts:80-108](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/recovery.ts#L80-L108)

两类启发式支持把候选与已复现分开。

<details>
<summary>查看原文（29行）</summary>

```text
export function attributeLoadFailure(
  error: unknown,
  installed: readonly InstalledPluginRecord[],
): string[] {
  const { message, stack } = failureMessage(error)
  const text = `${message}\n${stack}`
  return installed
    .map(plugin => plugin.name)
    .filter(name => name !== '' && text.includes(name))
}

/**
 * The plugins suspected of a boot hang: those installed or updated after the
 * last successful boot. Without a known-ok reference no plugin is suspected.
 * @param installed - the recorded installed plugins.
 * @param lastOkAt - ISO timestamp of the last successful boot, when known.
 * @returns the suspect plugin ids, in installed-list order.
 */
export function hangSuspects(
  installed: readonly InstalledPluginRecord[],
  lastOkAt: string | undefined,
): string[] {
  if (lastOkAt === undefined) return []
  const lastOk = Date.parse(lastOkAt)
  if (Number.isNaN(lastOk)) return []
  return installed
    .filter(plugin => Date.parse(plugin.installedAt) > lastOk)
    .map(plugin => plugin.name)
}
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src/main.ts:276-341](https://github.com/whitelonng/dshcode/blob/058e9f949ca15bcd973164d4d4e9218923f4eb26/apps/desktop/src/main.ts#L276-L341)

用户确认与失败分支为独立验收责任提供推导。

<details>
<summary>查看原文（66行）</summary>

```text
  const { home, profilePatchPath, lastOkAt, bootAttempts, safeMode } = context
  const decision = recoveryDecision({ error, installed: readPluginState(home).plugins, lastOkAt })

  // Safe mode failing still means a broken bundle layer or overlay, not a
  // user plugin; retry or exit, without disabling anything.
  if (safeMode) {
    const { response } = await dialog.showMessageBox({
      type: 'error',
      title: `${PRODUCT_NAME} 启动失败`,
      message: '安全模式下仍无法启动',
      detail: `${decision.message}\n\n安全模式已跳过用户插件配置，问题可能来自内置组件或安装本身。请重试，或退出后检查安装。`,
      buttons: ['重启应用', '退出'],
      defaultId: 0,
      cancelId: 1,
      noLink: true,
    })
    if (response === 0) {
      app.relaunch()
      requestQuit(0)
      return
    }
    requestQuit(1)
    return
  }

  const attributable = decision.kind === 'attributable'
  if (attributable) await recordBootFailures(home, decision)
  const crashLoopHint = bootAttempts >= CONSECUTIVE_FAILURE_THRESHOLD
    ? '\n\n连续多次启动失败，建议使用安全模式。'
    : ''
  const detail = attributable
    ? `以下插件未能正常加载：${decision.pluginIds.join('、')}\n\n${decision.message}${crashLoopHint}`
    : `无法确定是哪个插件导致启动失败。${crashLoopHint}\n\n${decision.message}`
  const safeModeIndex = attributable ? 1 : 0
  const buttons = attributable ? ['继续（禁用插件并重启）', '安全模式启动', '退出'] : ['安全模式启动', '退出']
  const { response } = await dialog.showMessageBox({
    type: 'error',
    title: `${PRODUCT_NAME} 启动失败`,
    message: '插件启动失败',
    detail,
    buttons,
    defaultId: crashLoopHint !== '' ? safeModeIndex : 0,
    cancelId: buttons.length - 1,
    noLink: true,
  })
  if (attributable && response === 0) {
    for (const pluginId of decision.pluginIds) {
      try {
        await setPluginRowEnabled(profilePatchPath, pluginId, false)
      } catch (disableError) {
        console.error(`${PRODUCT_NAME}: failed to disable ${pluginId}`, disableError)
      }
    }
    app.relaunch()
    requestQuit(0)
    return
  }
  if (response === safeModeIndex) {
    await setSafeMode(home, true)
    app.relaunch()
    requestQuit(0)
    return
  }
  requestQuit(1)
}

```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
