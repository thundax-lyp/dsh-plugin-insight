# DSH Desktop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[0e24939](https://github.com/anywhere-labs/dsh-desktop/tree/0e249397f8ae66dbb674ba85570f59bd0ecab14a)

<!-- BEGIN META -->
[![GitHub ★ 33,842](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33%2C842&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anywhere-labs/dsh-desktop)
<!-- END META -->

> **功能**：独立社区桌面客户端，将上游Host/Web与原生窗口、profile/数据目录、访问载体和恢复维护组织成桌面工作环境。

> **亮点**：实际原生Host独立的设置/恢复面、进程/目录profile与载体门卫、备份/更新维护组织；已有日志/checkpoint可复用，不是只加图标窗口。见[Q01](#research-q01)至[Q04](#research-q04)。

> **主要限制**：active beta不能继承stable旧owner锁/ABI上下文结论；备份的partial非所有写者一致/外链自包含。更新严格stop参数未在所核链启用，退出失败/timeout仍可能launcher handoff；局部门/ready不等全包签名或任务退出。见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 当前桌面对象、通道和真实增量是什么？](#detail-section-11)
  - [Q02 · beta实际怎样选择目录/profile、启动和切换Host？](#detail-section-12)
  - [Q03 · 原生renderer与普通浏览器的活动门卫/权限是什么？](#detail-section-13)
  - [Q04 · 备份、恢复与更新退出有哪些实接线和具体缺口？](#detail-section-14)
  - [Q05 · 如何限制首次试用并算清成本和效果？](#detail-section-15)
  - [Q06 · 已有诊断后，还应验证什么而不是再造看板？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为不想手管Node/Host的桌面用户组织原生启动、配置选择和恢复维护；根是社区客户端，核心Agent/Web归上游。见[Q01](#research-q01)。

对照同模型/插件条件的上游dsh web与手工启动/备份清单，不把upstream/Vendor、插件和模型本身算桌面原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 原生壳/Host | 设置恢复可独立于Host，主任务由上游 | active beta代表链，不泛化三通道/Agent正确性 |
| home/profile | 选择/初始化迁移与切换 | 持久选择优先env，ensure会写，非全事务 |
| app/browser载体 | native能力/owner frame/旧browser流撤销 | 缺access/peer条件明确，非全插件或OS工具隔离 |
| 备份/恢复 | 停owned Host、partial改名、日志checkpoint | 非所有writer一致/外链自包含或加密保证 |
| 更新/退出 | 用户下载确认/owned dispose/Host IPC和信号等待 | timeout失败可handoff，真签名/完整安装与全任务退出未验 |

**流程与依赖**

匹配beta包/runtime/平台与构建、实际home/profile和写权限、模型授权/预算、无外部writer及物理退出/读回必需；网络/市场/远控/更新按模式另审。表见[Q05](#research-q05)。

新账户/明确全新home核channel/profile→私有默认向导/正常启动→一个无敏感任务独立验产物→停owned Host做备份/外链还原核验→显式quit核物理退出；主数据/更新另审。执行者表见[Q05](#research-q05)。

**效果与成本**

安装/构建和Electron+Host常驻、模型/插件网络与日志、备份空间和多阶段恢复人工分开；有默认更新检查，关窗不一定停，金额/净节时/TCO未测。表见[Q05](#research-q05)。

源码支持桌面组织、实际owned生命周期/访问门及部分备份恢复；不证明开箱/所有插件、全目录可还原、真包更新/全任务停或优于Web。效果表见[Q05](#research-q05)。

> **思考**：active beta不能继承stable旧owner锁/ABI上下文结论；备份的partial非所有写者一致/外链自包含。更新严格stop参数未在所核链启用，退出失败/timeout仍可能launcher handoff；局部门/ready不等全包签名或任务退出。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：实际原生Host独立的设置/恢复面、进程/目录profile与载体门卫、备份/更新维护组织；已有日志/checkpoint可复用，不是只加图标窗口。见[Q01](#research-q01)至[Q04](#research-q04)。

可借鉴owned attempt cleanup保所有权、能力/owner frame与过期boot检查、普通browser旧流撤销、备份partial；全局锁/严格退出参数/签名需看真caller，不以helper/注释代替。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

active beta不能继承stable旧owner锁/ABI上下文结论；备份的partial非所有写者一致/外链自包含。更新严格stop参数未在所核链启用，退出失败/timeout仍可能launcher handoff；局部门/ready不等全包签名或任务退出。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有本地Agent经验且想减启动维护者，只在独立OS账户/明确全新beta home和无敏感副本先试一任务，核实际持久home选择/profile/版本，保持browserAccess=false/loopback、remoteControl/market=false，不导入主数据/生产凭据或触发内置更新安装。分别核原生壳/Host ready、上游任务产物、备份外链和恢复、显式quit后的Host/外部工作，不把X、checkpoint或partial完成当全通过。身份/目录/权限、费用/备份或退出不明立即停并人工读回，要求主数据迁移、生产公网或内置更新的安全保证者先观察。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根/三通道声明及当前active beta的native入口、目录/profile/owned Host、窗口/IPC/app/WS/浏览器门卫、整目录备份和更新退出重要支路已核；非三通道全实现/Vendor Agent/全插件市场远控/安全/签名安装/所有恢复矩阵审计，未运行。真实entry_type=client。仅建议独立账户/全新明确beta目录、无敏感副本、默认私有开关且不触发内置更新安装的小样；不交主profile/生产凭据或据此开公网。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-desktop-next/package.json、dsh-plugin-desktop-beta/host.cordis.patch.yml、dsh-plugin-desktop-beta/package.json、dsh-plugin-desktop-beta/scripts/start.mjs、dsh-plugin-desktop-beta/src/backend-controller.ts、dsh-plugin-desktop-beta/src/data-backup.ts、dsh-plugin-desktop-beta/src/data-directory.ts、dsh-plugin-desktop-beta/src/desktop-browser-access.ts、dsh-plugin-desktop-beta/src/desktop-contract.ts、dsh-plugin-desktop-beta/src/desktop-runtime.ts、dsh-plugin-desktop-beta/src/host-process.ts、dsh-plugin-desktop-beta/src/host/index.ts、dsh-plugin-desktop-beta/src/main.ts、dsh-plugin-desktop-beta/src/preload-app.ts、dsh-plugin-desktop-beta/src/profiles.ts、dsh-plugin-desktop-beta/src/runtime-tree.ts、dsh-plugin-desktop-beta/src/update-installer.ts、dsh-plugin-desktop-beta/src/updates.ts、dsh-plugin-desktop-beta/src/web-document.ts、dsh-plugin-desktop-beta/src/webserver.ts、dsh-plugin-desktop/package.json、package.json、upstream.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根/三个子包版本与upstream声明、active beta开发入口/native main、home/profile ensure/select/load、backend attempt与Host spawn/ready/IPC/shutdown、窗口/preload/frame/header/app/WS/NextWebServer实际门、默认偏好、数据备份caller/copy/链接、局部profile repair锁、诊断/checkpoint、updater检查/下载入口/dispose及安装退出到Mac launch caller。未全审全部稳定/Next实现、Vendor Agent/工具、所有环境准备/权限/guest/LAN/远控市场插件、下载签名/安装脚本/平台恢复/数据迁移；未执行。
- 下一步：未来隔离同条件对照Web，测实际home优先/坏profile/runtime、Host/renderer故障、旧流/门卫、备份外链/并发writer/还原、退出超时与假installer handoff，记录误判/正确恢复、资源/工时与任务费用；不在主数据和真安装上直接试。

**分析版本**

- **仓库**：[anywhere-labs/dsh-desktop](https://github.com/anywhere-labs/dsh-desktop)
- **版本号**：根未声明统一版本；stable 2.0.18，active beta 2.0.21-beta.1，next 2.0.21-next（[固定提交 0e24939](https://github.com/anywhere-labs/dsh-desktop/tree/0e249397f8ae66dbb674ba85570f59bd0ecab14a)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

已有原生诊断/恢复记录，不再造看板；先验证备份包含/外链/退化清单与恢复后正确home/profile的独立验收，现有功能/人工清单够用就否定独立产品。见[Q06](#research-q06)。

未来隔离同条件对照Web，测实际home优先/坏profile/runtime、Host/renderer故障、旧流/门卫、备份外链/并发writer/还原、退出超时与假installer handoff，记录误判/正确恢复、资源/工时与任务费用；不在主数据和真安装上直接试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | test | 363 | 74544 | 66536 | 2810 | — |
| .ts | source | 504 | 84945 | 69564 | 10299 | — |
| .md | source | 143 | 19568 | — | — | 282175 |
| .mjs | source | 68 | 9918 | 9015 | 666 | — |
| .tsx | source | 61 | 12930 | 12109 | 248 | — |
| .tsx | test | 3 | 2208 | 2016 | 43 | — |
| .ts | example | 1 | 158 | 122 | 17 | — |
| .mjs | example | 5 | 144 | 128 | 12 | — |
| .mjs | test | 12 | 1078 | 943 | 55 | — |
| .js | example | 1 | 20 | 14 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 308](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=308&color=737b86&logo=github)](https://github.com/anywhere-labs/dsh-desktop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 127](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=127&color=737b86&logo=github)](https://github.com/anywhere-labs/dsh-desktop/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 75](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=75&color=737b86&logo=github)](https://github.com/anywhere-labs/dsh-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定根对象的active beta真实启动/访问/备份及退出链能支持什么桌面采用，哪里不能沿旧稳定插件或状态作保证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前桌面对象、通道和真实增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根deepseek-harness-desktop是private工作区、MIT、Node ^22.19或>=24、Yarn 4.18.0，未声明统一version；独立社区桌面客户端而非官方背书产品/根DSH插件。三个子包各有版本：stable dsh-plugin-desktop 2.0.18，active beta dsh-plugin-desktop-beta 2.0.21-beta.1，next dsh-desktop-next 2.0.21-next；不能把子包/安装包/上游runtime和根版本混成一个发布号。package.json约339KiB，准备器作者摘录因256KiB上限为空，已单独读固定原文件，不是源码不可得。

upstream.json当前activeChannel=beta：stable pin1f81c047…/0.2.1-rc.3，beta pinf3803c96…/0.2.2-alpha.2，next pin504a01a9…/0.2.1-rc.4。它们是本项目声明的构建来源/运行包口径，不是本轮已验证全部vendor无修改、真实发行已签名可运行，也不把beta f380当正式Host22ddee研究同版。核心模型/Agent/会话/Web由所选上游和插件提供，不把fork历史/代码量算桌面原创。

面向不想手管Node/Host启动、窗口/托盘、配置和恢复的桌面用户，相对直接dsh web，实际增量是原生壳、独立Host进程生命周期、本地profile/数据目录、访问载体、备份与更新/恢复组织。合格结果要是正确通道/目录/profile启动、能继续工作且可核退出/恢复，不是窗口出现或Agent任务完成。源码开发入口start.mjs先检查lib/main/host/client/preloads及Market构建，再spawn Electron；本轮没有构建/启动或安装发布包，不能作开箱体验验收。

本轮代表选择当前active beta，不沿用旧正式092e2ecef750d10db43cedbab8e81fd48c8de38e对稳定插件的profile-context/data-operation-lock/update-lifecycle等判断。旧四题、全部findings/自代码依赖及9路径已完整只读；当前beta是Host-independent native shell+独立Host子进程，不能将stable机制自动算到beta或next。仅核beta启动/profile、原生载体/门卫、备份和更新退出重要支路；未全审所有通道、Vendor Agent/协议、插件/市场/远控、平台签名/安装、权限/guest/全部UI或数据迁移，未执行目标。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-10](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/package.json#L1-L10)

根private/许可/引擎/包管理口径，无统一版本。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "deepseek-harness-desktop",
  "private": true,
  "description": "DSH Desktop product workspace",
  "license": "MIT",
  "packageManager": "yarn@4.18.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "workspaces": [
```

</details>

**依据 2 · 源码核查**：[upstream.json:1-27](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/upstream.json#L1-L27)

三个声明pin、版本、active beta。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "repository": "https://github.com/deepseek-ai/deepseek-harness.git",
  "activeChannel": "beta",
  "channels": {
    "stable": {
      "commit": "1f81c047fc48fa190a683e469daa699857e9afe8",
      "sourceVersion": "0.2.1-rc.3",
      "runtimePackageVersion": "0.2.1-rc.3",
      "runtimeSource": "vendor/dsh-runtime/0.2.1-rc.3/manifest.json",
      "package": "dsh-plugin-desktop"
    },
    "beta": {
      "commit": "f3803c96974ad4a94195fb97e5c637e9c2a3afe3",
      "sourceVersion": "0.2.2-alpha.2",
      "runtimePackageVersion": "0.2.2-alpha.2",
      "runtimeSource": "vendor/dsh-runtime/0.2.2-alpha.2/manifest.json",
      "package": "dsh-plugin-desktop-beta"
    },
    "next": {
      "commit": "504a01a9578abc2c6f1fb896b1dc322c9fe24f66",
      "sourceVersion": "0.2.1-rc.4",
      "runtimePackageVersion": "0.2.1-rc.4",
      "runtimeSource": "vendor/dsh-runtime/0.2.1-rc.4/manifest.json",
      "package": "dsh-desktop-next"
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[dsh-plugin-desktop/package.json:1-7](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop/package.json#L1-L7)

stable子包版本。

```text
{
  "name": "dsh-plugin-desktop",
  "version": "2.0.18",
  "description": "DSH Desktop: an Electron shell composed as a DeepSeek Harness Cordis plugin",
  "desktopName": "dsh-desktop.desktop",
  "license": "MIT",
  "publishConfig": {
```

**依据 4 · 源码核查**：[dsh-plugin-desktop-beta/package.json:1-7](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/package.json#L1-L7)

active beta子包版本。

```text
{
  "name": "dsh-plugin-desktop-beta",
  "version": "2.0.21-beta.1",
  "private": true,
  "description": "Desktop Beta integration for the DeepSeek Harness",
  "desktopName": "dsh-desktop-beta.desktop",
  "license": "MIT",
```

**依据 5 · 源码核查**：[dsh-desktop-next/package.json:1-7](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-desktop-next/package.json#L1-L7)

next子包版本。

```text
{
  "name": "dsh-desktop-next",
  "version": "2.0.21-next",
  "private": true,
  "description": "Experimental upstream-inspired DSH Desktop with Profiles, recovery, remote control and Community Market",
  "desktopName": "dsh-desktop-next.desktop",
  "license": "MIT",
```

**依据 6 · 作者声明**：[README.md:17-17](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/README.md#L17-L17)

作者明确独立社区无官方背书。

```text
<p align="center"><sub>独立的社区开源项目，与深度求索不存在隶属、合作、授权或背书关系。<br>本仓库目前无深度求索员工或 DeepSeek Harness 上游官方团队成员参与；GitHub Contributors 中显示的上游贡献者来自 fork 继承和同步的提交历史。<br>中文 · <a href="README.en.md">English</a></sub></p>
```

**依据 7 · 作者声明**：[README.md:30-33](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/README.md#L30-L33)

作者桌面/上游定位，非独立vendor diff证明。

```text
</p>

DSH Desktop 将 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的本地 Web UI、Host 服务和插件系统集成到原生桌面应用中。项目固定并原样运行特定上游版本；DSH Desktop 提供窗口、托盘、终端、更新和工作配置，并通过 DeepSeek Harness 提供的插件机制与上游能力组合。

```

**依据 8 · 源码核查**：[dsh-plugin-desktop-beta/scripts/start.mjs:1-19](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/scripts/start.mjs#L1-L19)

实际构建检查→Electron开发入口。

<details>
<summary>查看原文（19行）</summary>

```text
/** Explicit GUI entry; build/check never calls this script. */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('..', import.meta.url))
const require = createRequire(join(root, 'package.json'))
for (const file of ['lib/main.js', 'lib/host.js', 'lib/client.js', 'lib/preload-app.cjs', 'lib/preload-shell.cjs']) {
  if (!existsSync(join(root, file))) throw new Error('Run corepack yarn dev:next from the repository root to build Next first.')
}
const market = dirname(require.resolve('dsh-community-market/package.json'))
if (!existsSync(join(market, 'lib/client.js'))) throw new Error('Build the Community Market first: corepack yarn workspace dsh-community-market build')
const electron = require('electron')
const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE
const child = spawn(electron, [root], { cwd: root, env, stdio: 'inherit' })
child.once('error', error => { console.error(error); process.exitCode = 1 })
child.once('exit', code => { process.exitCode = code ?? 1 })
```

</details>

**依据 9 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1028-1057](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1028-L1057)

原生shell协议和启动实际入口。

<details>
<summary>查看原文（30行）</summary>

```text
async function main(): Promise<void> {
  await app.whenReady()
  if (quitting) return
  let inputRevision = 0
  let inputBlocked = false
  desktopShortcuts = installDesktopShortcuts(() => mainWindow, app.getPath('userData'),
    process.platform === 'darwin' ? 'macos' : process.platform === 'win32' ? 'windows' : 'linux', () => {}, () => {
      const blocked = runtime.recoveryMode || onboarding || onboardingSurfaceActive
      if (blocked !== inputBlocked) { inputBlocked = blocked; inputRevision++ }
      return { revision: inputRevision, blocked }
    })
  app.once('will-quit', () => { desktopShortcuts?.dispose() })
  if (process.platform === 'darwin' && !app.isPackaged) app.dock?.setIcon(join(root, 'build', 'app-icon-mac.png'))
  // Recovery can open without a Host; Chromium's app locale may differ from the OS language.
  windowsLanguage = preferredDesktopLocale([...app.getPreferredSystemLanguages(), app.getLocale()])
  // Before any Profile is read or set up in a directory this launch may give up.
  if (!await confirmDataDirectory()) return
  protocol.handle('dsh-app', async request => {
    const url = new URL(request.url)
    if (url.hostname === 'shell') {
      const response = await serveWebDocument(request, join(root, 'lib/native-ui'), false)
      response.headers.set('content-security-policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-src 'none'; base-uri 'none'")
      return response
    }
    if (url.hostname !== 'app') return new Response(null, { status: 404 })
    if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname.startsWith('/assets/')
      || ['/favicon.svg', '/manifest.webmanifest'].includes(url.pathname)) return serveWebDocument(request, webRoot)
    const auth = runtime.auth
    if (!runtime.backend.host || !auth) return new Response(null, { status: 503 })
    return forwardWebRequest(request, auth.url, auth.cookie, auth.token)
```

</details>

#### 缺口

- 真实发行/签名/全vendor差异、平台安装/桌面减负和完整插件兼容未验
  **影响**：只能评价固定beta代表链，不给三通道/任意发布包或官方品质保证
  **进一步探讨**：后续独立无敏感数据目录/账户固定beta包，与上游Web同模型/插件条件比较正确启动、恢复分钟和资源。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · beta实际怎样选择目录/profile、启动和切换Host？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

数据目录必须看代码/真实状态。legacy变量名仍DSH_DESKTOP_NEXT_HOME，实际defaultDataDirectory返回~/.dsh-beta，文件头说~/.dsh已过时；readDataDirectory先用持久应用选择，否则env/default，读取异常会带error回fallback。仅临时设env未必覆盖已有选择，profile名字/通道图标不等数据隔离，应核home/source。profile.active取desktop-next.json；selectable只读manifest/features和必要Web bundles，不为画列表先加载插件。ensure会初始化/迁移、备份旧bundle并写manifest/schedule，第一次显示向导前亦可能ensure，不是查看即零写。

main app.whenReady后先确认目录、检查packaged runtime descriptor的壳版本/已装dshVersion/platform/arch；失败进入recovery。这个identity函数是元数据对齐，本处不据此声称每文件hash或OS签名全验。未完成onboarding只开原生设置壳，recovery亦不走普通Host启动；正常分支才runtime.start/openMain。Safe Mode创建独立临时home、固定偏好、关闭remoteControl/market，并保原home供修复工具；不是给所有桌面功能或模型工具加OS沙箱。

NextDesktopRuntime.start→BackendController.start，先环境准备/ensure，再创建owned host attempt；pending/replacing/stopping会防并行替换，cancelled在prepare/start之后检查，失败先cleanup，cleanup失败保owner可重试，不直接用新Host盖旧进程。createHost每次randomBytes32生成能力token，传actualHome/profile目录、effective prefs、trustedHosts等给DesktopHostProcess。后者实际spawn node/Electron Node环境、IPC stdio、项目cwd与host entry；Host端loadNextProfile检查目录属于给定home、ensure后runProfile with resolvedProfile/patches/包管理调用，上游Agent/工具循环不在本轮重审。

start race对host.start设60秒，ready还要求http://127.0.0.1和Web injections，再authenticateWebHost、保存只在main的cookie/token、按显式browserAccess+lan开可选边缘。只有随后记checkpoint/Host ready，checkpoint失败只warn；不是设计/任务验收。60秒只包这一Host start，不是全部环境准备、更新或模型费用时限。

profile switch实际先select写指针再app.quit/relaunch，先有用户确认；是应用重启边界，不是旧稿中原地换generation的泛用接口，更非跨文件事务/任务回滚。普通runtime.restart先await backend.stop再change/start；stop wrapper先清auth/停LAN再host.stop。主窗口默认closeToTray，托盘可用时X只是隐藏，不等退出；显式quit才进入清理。host.stop先shutdown IPC、默认等3秒后TERM/KILL及等待，超时抛错；严格requireGraceful参数存在但本轮实际runtime.stop caller未传true，不能用其定义作所有更新强制保障，详Q04。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin-desktop-beta/src/data-directory.ts:12-29](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/data-directory.ts#L12-L29)

实际legacy变量名和~/.dsh-beta函数，非文件头默认说法。

<details>
<summary>查看原文（18行）</summary>

```text
export const DATA_DIRECTORY_VARIABLE = 'DSH_DESKTOP_NEXT_HOME'
const LOCATION_FILE = 'desktop-next-location.json'
const LAST_HOME_FILE = 'desktop-next-last-home.json'

export type DataDirectorySource = 'desktop' | 'environment' | 'default'

export interface DataDirectoryLocation {
  home: string
  source: DataDirectorySource
  /** The directory used without an in-app choice: the variable when set, otherwise the default. */
  fallback: string
  error?: string
}

export function defaultDataDirectory(userHome = homedir()): string { return join(userHome, '.dsh-beta') }

export function dataDirectoryLocationRoot(packaged: boolean, appData: () => string, packageRoot: string): string {
  return packaged ? join(appData(), 'DSH Desktop Beta', 'home') : join(packageRoot, '.desktop-next', 'home')
```

</details>

**依据 2 · 源码核查**：[dsh-plugin-desktop-beta/src/data-directory.ts:45-53](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/data-directory.ts#L45-L53)

应用内持久home优先与fallback/error。

```text
export function readDataDirectory(locationRoot: string, environmentHome?: string, userHome?: string): DataDirectoryLocation {
  const fallback = fallbackDirectory(environmentHome, userHome)
  const source = environmentHome ? 'environment' : 'default'
  try {
    const home = readHome(dataDirectoryLocationFile(locationRoot))
    if (home === undefined) return { home: fallback, source, fallback }
    privateDirectory(home)
    return { home, source: 'desktop', fallback }
  } catch (error) { return { home: fallback, source, fallback, error: String(error) } }
```

**依据 3 · 源码核查**：[dsh-plugin-desktop-beta/src/profiles.ts:89-107](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/profiles.ts#L89-L107)

active/select/selectable真实逻辑。

<details>
<summary>查看原文（19行）</summary>

```text
  get active(): string {
    const file = join(this.home, 'desktop-next.json')
    const text = readPrivateFile(file)
    if (text === undefined) return DEFAULT_PROFILE
    return profileName((JSON.parse(text) as { active?: unknown }).active)
  }
  select(name: string): void {
    if (!this.selectable(name)) throw new Error('Profile is unavailable for Desktop Next')
    atomicJson(join(this.home, 'desktop-next.json'), { version: 1, active: name })
  }
  /** Read configuration only; never load plugins just to render the native selector. */
  selectable(name: string): boolean {
    try {
      const value = JSON.parse(readPrivateFile(join(this.directory(name), 'package.json')) ?? 'null') as { dsh?: { profile?: { bundles?: unknown } } } | null
      const bundles = value?.dsh?.profile?.bundles
      this.features(name)
      return Array.isArray(bundles) && bundles.every(item => typeof item === 'string')
        && PROFILE_TEMPLATES.web!.bundles.every(bundle => bundles.includes(bundle))
    } catch { return false }
```

</details>

**依据 4 · 源码核查**：[dsh-plugin-desktop-beta/src/profiles.ts:117-134](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/profiles.ts#L117-L134)

ensure实际初始化/迁移/备份写。

<details>
<summary>查看原文（18行）</summary>

```text
  ensure(name: string): string {
    const dir = this.directory(name)
    const existing = existsSync(join(dir, 'package.json'))
    if (!existing) initProfile(dir, WEB_BUNDLES)
    if (existing) {
      const manifest = this.manifest(name)
      if (manifest.dsh.profile.bundles.includes('dsh-plugin-desktop-beta')) {
        // Retire the former Next-specific selection from the shared manifest.
        // Other launchers must not inherit this application's capability.
        new NextRecovery(this).backup(name, 'before-next-bundle-removal')
        this.migrateFeatures(name)
        const migrated = this.manifest(name)
        migrated.dsh.profile.bundles = migrated.dsh.profile.bundles.filter(bundle => bundle !== 'dsh-plugin-desktop-beta')
        atomicJson(join(dir, 'package.json'), migrated)
      }
    } else this.setFeatures(name, DEFAULT_FEATURES)
    this.migrateSchedule(name)
    return dir
```

</details>

**依据 5 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1207-1227](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1207-L1227)

packaged identity、ensure/onboarding和更新启动。

<details>
<summary>查看原文（21行）</summary>

```text
  void prepareHostEnvironment()
  if (dataLocation.error && !runtime.safeMode) { runtime.recoveryMode = true; runtime.report(dataLocation.error, 'runtime-bootstrap') }
  if (app.isPackaged) {
    // Packaging sealed the payload with the shell, dsh, platform and architectures it was released for.
    try { verifyPackagedRuntimeIdentity(join(root, DESKTOP_RUNTIME_FILE), { version, dshVersion: readInstalledPackageVersion(root, '@deepseek-ai/dsh'), platform: process.platform, arch: process.arch }) }
    catch (error) { runtime.recoveryMode = true; runtime.report(error, 'runtime-bootstrap') }
  }
  if (!runtime.safeMode && !runtime.recoveryMode) {
    try {
      runtime.profiles.ensure(runtime.selected)
      onboarding = process.argv.includes(ONBOARDING_ARGUMENT) || runtime.profiles.onboardingRequired(runtime.selected)
      if (onboarding) onboardingComputerUse = runtime.profiles.computerUseEnabled(runtime.selected)
    } catch (error) {
      onboarding = false
      runtime.recoveryMode = true
      runtime.report(error, 'profile-composition')
    }
  }
  native.createTray()
  updates.start()
  Menu.setApplicationMenu(process.platform === 'win32' ? null : Menu.buildFromTemplate([
```

</details>

**依据 6 · 源码核查**：[dsh-plugin-desktop-beta/src/runtime-tree.ts:430-442](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/runtime-tree.ts#L430-L442)

identity真正比较的元数据。

<details>
<summary>查看原文（13行）</summary>

```text
export function verifyPackagedRuntimeIdentity(descriptorFile: string, identity: PackagedRuntimeIdentity): DesktopRuntimeDescriptor {
  const descriptor = readDesktopRuntime(descriptorFile)
  if (descriptor.release.version !== identity.version) {
    throw new Error(`desktop runtime: payload ${descriptor.release.version} does not belong to DSH Desktop Beta ${identity.version}`)
  }
  if (descriptor.release.dshVersion !== identity.dshVersion) {
    throw new Error(`desktop runtime: payload declares dsh ${descriptor.release.dshVersion} but ${identity.dshVersion} is installed`)
  }
  if (descriptor.platform !== identity.platform || !descriptor.archs.includes(identity.arch)) {
    throw new Error(`desktop runtime: payload for ${descriptor.platform} ${descriptor.archs.join('/')} cannot run on ${identity.platform} ${identity.arch}`)
  }
  return descriptor
}
```

</details>

**依据 7 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1261-1265](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1261-L1265)

recovery/onboarding与正常Host启动分支。

```text
  if (runtime.recoveryMode) openControls('recovery')
  else if (onboarding) openControls('onboarding')
  else { void runtime.start().catch(() => {}); openMain() }
  app.on('activate', openMain)
  app.on('window-all-closed', () => { if (process.platform !== 'darwin' && !native.available && !replacingWindow) app.quit() })
```

**依据 8 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:127-161](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L127-L161)

safe环境准备/start及restart停止先行。

<details>
<summary>查看原文（35行）</summary>

```text
  start(): Promise<void> {
    this.recoveryMode = false
    this.failure = ''
    this.failureStage = undefined
    this.failureExit = undefined
    this.startup = this.backend.start(async () => {
      this.hostStage = 'shell-environment'
      await this.options.prepareEnvironment?.()
      this.hostStage = 'profile-composition'
      if (this.safeMode && !this.safeHome) {
        privateDirectory(this.recovery.directory)
        this.safeHome = mkdtempSync(join(this.recovery.directory, 'safe-runtime-'))
        const safe = new NextProfiles(this.safeHome)
        safe.ensure(DEFAULT_PROFILE)
        safe.setFeatures(DEFAULT_PROFILE, { remoteControl: false, market: false })
      }
      if (this.safeMode) this.preferences = { ...SAFE_MODE_PREFERENCES }
      if (!this.safeMode) this.profiles.ensure(this.selected)
      this.hostStage = 'host-boot'
    })
    // The backend publishes failures after owned process cleanup.
    void this.startup.catch(() => {})
    return this.startup
  }

  async restart(change: () => void | Promise<void> = () => {}): Promise<void> {
    await this.backend.stop()
    if (this.closing) return
    const wasSafe = this.safeMode
    await change()
    if (!this.safeMode) {
      this.cleanupSafeHome()
      if (wasSafe) this.preferences = new DesktopPreferenceStore(this.options.home).read()
    }
    await this.start()
```

</details>

**依据 9 · 源码核查**：[dsh-plugin-desktop-beta/src/backend-controller.ts:60-103](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/backend-controller.ts#L60-L103)

attempt/pending/替换/失败cleanup实际链。

<details>
<summary>查看原文（44行）</summary>

```text
  start(prepare: () => Promise<void>): Promise<void> {
    if (this.closed) return Promise.reject(new Error('desktop backend is closed'))
    if (this.stopping !== undefined) return Promise.reject(new Error('desktop backend is stopping'))
    if (this.pending !== undefined) return this.pending
    if (this.current.phase === 'ready') return Promise.resolve()
    const previous = this.attempt
    const attempt: Attempt<Host> = { cancelled: false,
      ...(previous?.host === undefined ? {} : { host: previous.host }),
      ...(previous?.cleanup === undefined ? {} : { cleanup: previous.cleanup }) }
    this.attempt = attempt
    this.update({ phase: 'starting' })
    const pending = Promise.resolve().then(async () => {
      let replacing = previous !== undefined
      try {
        if (replacing) await this.cleanup(attempt)
        delete attempt.cleanup
        delete attempt.host
        replacing = false
        if (attempt.cancelled) return
        await prepare()
        // stop() can cancel this attempt while preparation is pending.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (attempt.cancelled) return
        const host = this.createHost((error) => { this.failed(attempt, error) })
        attempt.host = host
        await host.start()
        if (attempt.failure !== undefined) throw attempt.failure
        // stop() can cancel this attempt while the child starts.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!attempt.cancelled) this.update({ phase: 'ready' })
      } catch (error) {
        // Inherited cleanup belongs to the previous attempt; its rejection
        // must also release this attempt's cache while retaining the same Host.
        if (replacing) delete attempt.cleanup
        const cancelled = attempt.cancelled
        attempt.cancelled = true
        let failure = error
        try { if (!replacing) await this.cleanup(attempt) } catch (cleanupError) {
          if (cleanupError !== error) failure = new AggregateError([error, cleanupError], 'desktop backend startup and cleanup failed')
        }
        if (!cancelled) this.update(errorState(failure))
        throw failure
      }
    }).finally(() => { if (this.pending === pending) this.pending = undefined })
```

</details>

**依据 10 · 源码核查**：[dsh-plugin-desktop-beta/src/backend-controller.ts:113-149](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/backend-controller.ts#L113-L149)

stop等待pending、cleanup失败保owner。

<details>
<summary>查看原文（37行）</summary>

```text
    if (this.stopping !== undefined) return this.stopping
    const attempt = this.attempt
    if (attempt !== undefined) attempt.cancelled = true
    if (!this.closed) this.update({ phase: 'starting' })
    const pending = this.pending
    const stopping = Promise.allSettled([
      attempt === undefined ? Promise.resolve() : this.cleanup(attempt),
      pending,
    ]).then((results) => {
      const cleanup = results[0]
      if (cleanup.status === 'rejected') throw cleanup.reason
      if (this.attempt === attempt) this.attempt = undefined
    }).finally(() => { if (this.stopping === stopping) this.stopping = undefined })
    this.stopping = stopping
    return stopping
  }

  /**
   * Permanently prevent startup and suppress further availability notifications.
   * @returns Completion of pending work and child exit; rejects if cleanup fails.
   */
  close(): Promise<void> {
    this.closed = true
    return this.stop()
  }

  private cleanup(attempt: Attempt<Host>): Promise<void> {
    if (attempt.cleanup === undefined) {
      const cleanup = Promise.resolve().then(async () => { await attempt.host?.stop() }).catch((error: unknown) => {
        // A failed termination retains Host ownership but permits another stop
        // attempt. Never start a replacement until that stop actually succeeds.
        if (attempt.cleanup === cleanup) delete attempt.cleanup
        throw error
      })
      attempt.cleanup = cleanup
    }
    return attempt.cleanup
```

</details>

**依据 11 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:309-358](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L309-L358)

token/Host caller、ready限时/loopback/auth/边缘/checkpoint。

<details>
<summary>查看原文（50行）</summary>

```text
    const { options } = this
    const actualHome = this.safeMode ? this.safeHome! : options.home
    const profile = this.safeMode ? DEFAULT_PROFILE : this.selected
    const effective = this.safeMode ? { ...SAFE_MODE_PREFERENCES } : this.preferences
    const addresses = options.addresses()
    const token = randomBytes(32).toString('base64url')
    const lan = new DesktopLanHttpsRuntime({ addresses, requestedPort: effective.lanPort,
      prepareCertificate: async () => ({ certificate: await options.certificate(addresses) }) })
    this.lan = lan
    let stopped = false
    const host = new DesktopHostProcess(options.executable, options.root, new NextProfiles(actualHome).directory(profile), undefined,
      { ...process.env, DSH_HOME: actualHome, DSH_NEXT_NATIVE_TOKEN: token,
        DSH_NEXT_PREFERENCES: JSON.stringify(effective), DSH_NEXT_TRUSTED_HOSTS: JSON.stringify(addresses),
        [SYSTEM_PROXY_ENV]: JSON.stringify(options.systemProxy?.() ?? {}),
        ...(this.safeMode ? { DSH_TELEMETRY_DISABLED: '1' } : {}) },
      onFailure, options.primaryRuntime, undefined, join(options.root, 'lib', 'host.js'), options.onRestart, options.onNotification,
      (chunk, stream, pid) => this.diagnostics.hostChunk(chunk, stream, pid), options.onTerminal, options.onPermission, undefined, options.onPlatformLogin,
      input => { if (input.event === 'exit') this.diagnostics.hostClosed(input.pid); this.diagnostics.record(input) },
      { memory: (usage, pid) => { this.memory.hostMemory(usage, pid) }, exited: (exit, pid) => { this.memory.hostExited(exit, pid) } })
    this.hostProcess = host
    return {
      start: async (): Promise<void> => {
        let timer: ReturnType<typeof setTimeout> | undefined
        const started = this.diagnostics.operation('desktop', 'host.start', { profile, safeMode: this.safeMode })
        try {
          const ready = await Promise.race([host.start(), new Promise<never>((_resolve, reject) => {
            timer = setTimeout(() => reject(new Error('Host startup exceeded 60 seconds')), 60_000)
            timer.unref()
          })]).finally(() => clearTimeout(timer))
          const url = new URL(ready.url)
          if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1') throw new Error('Next Host must use loopback HTTP')
          if (!ready.injections) throw new Error('Next Host omitted Web boot injections')
          const cookie = await authenticateWebHost(ready.url, token)
          if (stopped) { started(); return }
          this.auth = { url: ready.url, cookie, token, injections: ready.injections }
          lan.attach(Number(url.port))
          if (effective.browserAccess && effective.networkExposure === 'lan') {
            const edge = await lan.setEnabled(true)
            if (stopped) { await lan.stop(); started(); return }
            // The optional LAN edge must not turn a ready loopback Host into recovery mode.
            if (edge.state === 'failed') this.diagnostics.append(`LAN HTTPS: ${edge.errorCode}`, 'warn')
          }
          if (!this.safeMode) {
            try { this.recovery.checkpoint(this.selected) } catch (error) { this.diagnostics.append(`Recovery checkpoint: ${String(error)}`, 'warn') }
          }
          started()
          // From here a Host failure stops a running Desktop rather than its startup.
          this.hostStage = 'host-runtime'
          this.diagnostics.append(`Host ready: ${profile}${this.safeMode ? ' (safe mode)' : ''}`)
        } catch (error) { started(error); throw error }
```

</details>

**依据 12 · 源码核查**：[dsh-plugin-desktop-beta/src/host-process.ts:267-284](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/host-process.ts#L267-L284)

真实spawn/cwd/env/IPC。

<details>
<summary>查看原文（18行）</summary>

```text
  async start(): Promise<DesktopHostReady> {
    if (this.child !== undefined) return this.readyPromise
    const entry = this.hostEntry ?? join(this.runtimeDir, 'node_modules', '@deepseek-ai', 'dsh-desktop-host', 'lib', 'index.js')
    const child = spawn(this.node, [
      '--expose-internals',
      ...(this.inspectPort === undefined ? [] : [`--inspect=127.0.0.1:${String(this.inspectPort)}`]),
      entry,
      this.runtimeDir,
      this.projectDir,
      this.primaryRuntime ?? join(this.runtimeDir, '..', 'runtime', 'primary-runtime'),
      ...this.packageManager === undefined ? [] : [this.packageManager.pnpm, this.packageManager.nodeBin],
    ], {
      cwd: this.projectDir,
      env: desktopNodeEnvironment(this.node, undefined, this.environment),
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    })
    this.child = child
    this.diagnostic({ source: 'host.process', event: 'spawn', pid: child.pid })
```

</details>

**依据 13 · 源码核查**：[dsh-plugin-desktop-beta/src/profiles.ts:291-294](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/profiles.ts#L291-L294)

Host加载profile的home归属检查。

```text
export function loadNextProfile(projectDir: string, home: string, installAnchor = NEXT_PACKAGE): Profile {
  const manager = new NextProfiles(home)
  if (manager.directory(basename(projectDir)) !== resolve(projectDir)) throw new Error('Profile must belong to Next home')
  manager.ensure(basename(projectDir))
```

**依据 14 · 源码核查**：[dsh-plugin-desktop-beta/src/host/index.ts:54-76](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/host/index.ts#L54-L76)

正常token配置/清env与runProfile真实caller。

<details>
<summary>查看原文（23行）</summary>

```text
  configureNextBrowserAccess(process.env.DSH_NEXT_NATIVE_TOKEN, preferences.browserAccess)
  delete process.env.DSH_NEXT_NATIVE_TOKEN
  delete process.env.DSH_NEXT_PREFERENCES
  delete process.env.DSH_NEXT_TRUSTED_HOSTS
  delete process.env[SYSTEM_PROXY_ENV]
  const profile = loadNextProfile(projectDir, home)
  const runtimePatch = join(projectDir, 'desktop-next.runtime.patch.json')
  atomicJson(runtimePatch, [
    { id: 'desktop-next-webserver', config: { host: '127.0.0.1', port: preferences.port } },
    { id: 'connection', config: { trustedHosts } },
  ])
  // runProfile installs the outbound proxy policy from this environment before any plugin mounts.
  const { environment, resolution: proxy } = withSystemProxy(loadLayeredEnv('dsh-plugin-desktop-beta'), systemProxy, trustedHosts as string[])
  // One line on every start, direct included: a connectivity report cannot be answered without it.
  for (const line of [proxy.summary, ...proxy.diagnostics]) process.stderr.write(`dsh-plugin-desktop-beta: ${maskSecrets(line)}\n`)
  const application = runProfile({
    environment, profile: basename(projectDir),
    resolvedProfile: { profile, installAnchor: NEXT_PACKAGE,
      readPatches: profilePatches => readNextProfilePatches(projectDir, home,
        [join(runtimeDir, 'host.cordis.patch.yml'), join(projectDir, 'desktop-next.cordis.patch.json'), runtimePatch], profilePatches) },
    patchFiles: [join(runtimeDir, 'host.cordis.patch.yml'), join(projectDir, 'desktop-next.cordis.patch.json'), runtimePatch], args: ['--no-open', '--port', String(preferences.port)],
    packageManager: bundledPnpmInvocation(runtimeDir),
  })
```

</details>

**依据 15 · 源码核查**：[dsh-plugin-desktop-beta/src/host/index.ts:137-145](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/host/index.ts#L137-L145)

Host实际ready producer发送authenticatedUrl和boot表。

```text
    const mounted = hostOperation('host', 'office.mount', { source: office.source })
    try { await ctx.plugin(desktopOffice, office); mounted() } catch (error) { mounted(error); throw error }
  }
  hostLog({ source: 'host', event: 'process.ready' })
  await send({ type: 'ready', url: ctx.connection.authenticatedUrl(`http://127.0.0.1:${ctx.webServer.port}`),
    injections: webIndexInjections(ctx) })
  auditHostPlugins(ctx)
  const account = ctx.get('deepseekAccount') as PlatformLoginAccount | undefined
  if (account !== undefined && !stopping) {
```

**依据 16 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:729-748](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L729-L748)

切换确认/指针写/应用退出。

<details>
<summary>查看原文（20行）</summary>

```text
    if (!['switch', 'features', 'restart', 'recover', 'safe-mode', 'normal-mode', 'rollback', 'repair-global'].includes(String(type))) throw new Error('Invalid Next command')
    const next = type === 'switch' ? profileName(input.name) : runtime.selected
    if (type === 'switch' && next === runtime.selected && !runtime.safeMode && !runtime.recoveryMode && runtime.backend.state.phase === 'ready') return
    if (type === 'switch' && !runtime.profiles.selectable(next)) throw new Error('Profile is unavailable for Desktop Next')
    const features = type === 'features' ? parseFeatures(input.features) : undefined
    if (type === 'rollback' && !runtime.recovery.latest(next)) throw new Error(t('尚无成功启动的配置备份。', 'No successful-start configuration is available.'))
    const messages: Record<string, string> = {
      switch: t(`切换到 Profile「${next}」并重启应用？`, `Switch to Profile “${next}” and restart the application?`),
      recover: t('备份并修复当前 Profile？将禁用第三方插件、远控和市场。', 'Back up and repair this Profile? Third-party plugins, remote control and Market will be disabled.'),
      'repair-global': t('备份并停用全局补丁？这会影响所有 Next Profile。', 'Back up and disable the global patch? This affects every Next Profile.'),
      rollback: t('恢复最近成功启动的 Profile 配置？当前配置会先备份。', 'Restore the last successful-start Profile configuration? The current configuration will be backed up first.'),
      'safe-mode': t('在独立的临时环境中进入安全模式？原有数据和配置会保留。', 'Enter safe mode in a separate temporary environment? Existing data and configuration are preserved.'),
      'normal-mode': t('退出安全模式并重启原 Profile？', 'Exit Safe Mode and restart the original Profile?'),
    }
    if (!await confirmed(messages[String(type)] ?? t('重启工作环境以应用更改？', 'Restart the environment to apply this change?'))) return
    if (type === 'switch') {
      runtime.profiles.select(next)
      relaunch = relaunchArguments(process.argv.slice(1), false, false)
      app.quit()
      return
```

</details>

**依据 17 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:360-368](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L360-L368)

stop先auth/LAN后Host。

```text
      stop: async (): Promise<void> => {
        stopped = true
        this.auth = undefined
        const edgeStopped = this.diagnostics.operation('desktop', 'lan.stop')
        try { await lan.stop(); edgeStopped() } catch (error) { edgeStopped(error); throw error }
        const hostStopped = this.diagnostics.operation('desktop', 'host.stop')
        try { await host.stop(); hostStopped() } catch (error) { hostStopped(error); throw error }
        if (this.hostProcess === host) this.hostProcess = undefined
        if (this.lan === lan) this.lan = undefined
```

**依据 18 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-contract.ts:42-47](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-contract.ts#L42-L47)

默认closeToTray与访问偏好。

```text
export const DEFAULT_PREFERENCES: Readonly<DesktopPreferences> = Object.freeze({
  closeToTray: true, macosMaterial: 'transparent', windowsMaterial: 'off', linuxMaterial: 'off',
  browserAccess: false, networkExposure: 'loopback', port: 0, lanPort: 0, logLevel: 'info', developerLogging: false,
  sidebarFooterCompat: true, sidebarFooterBalanced: true, notifications: true, turnCompleted: true, turnFailed: true, jobCompleted: false, jobFailed: false,
  scheduleCompleted: true, scheduleFailed: true,
})
```

**依据 19 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:341-344](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L341-L344)

窗口关闭确实可隐藏。

```text
    window.on('close', event => {
      if (!quitting && runtime.preferences.closeToTray && native.available) { event.preventDefault(); window.hide() }
      else if (!quitting) { event.preventDefault(); app.quit() }
    })
```

**依据 20 · 源码核查**：[dsh-plugin-desktop-beta/src/host-process.ts:465-487](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/host-process.ts#L465-L487)

真实Host shutdown/升级signal/严格参数。

<details>
<summary>查看原文（23行）</summary>

```text
  async stop(requireGraceful = false): Promise<void> {
    const child = this.child
    if (child === undefined) return
    this.stopping = true
    this.diagnostic({ source: 'host.process', event: 'shutdown.request', pid: child.pid })
    this.onPlatformSession?.(null)
    if (child.connected) child.send({ type: 'shutdown' }, (error) => { if (error !== null) this.fail(error) })
    const exited = this.exitPromise ?? Promise.resolve()
    const graceful = await exitsWithin(exited, requireGraceful ? 10_000 : 3_000)
    const signalTimeoutMs = requireGraceful ? 5_000 : 750
    if (!graceful) { this.diagnostic({ source: 'host.process', event: 'shutdown.escalate', level: 'warn', pid: child.pid, fields: { signal: 'SIGTERM' } }); child.kill('SIGTERM') }
    if (!await exitsWithin(exited, signalTimeoutMs)) {
      this.diagnostic({ source: 'host.process', event: 'shutdown.escalate', level: 'warn', pid: child.pid, fields: { signal: 'SIGKILL' } })
      child.kill('SIGKILL')
      if (!await exitsWithin(exited, signalTimeoutMs)) {
        throw new Error('dsh desktop host did not exit after SIGKILL')
      }
    }
    this.child = undefined
    if (requireGraceful && (!graceful || child.exitCode !== 0 || !this.shutdownCompleted)) {
      // This diagnostic reaches expandable UI; arbitrary plugin stderr can contain credentials.
      throw new DesktopHostUncleanExitError(`desktop update: Host did not complete graceful task teardown (exit ${String(child.exitCode)}, signal ${String(child.signalCode)}, shutdown acknowledged ${String(this.shutdownCompleted)}, graceful deadline exceeded ${String(!graceful)})`)
    }
```

</details>

#### 缺口

- 真实平台spawn/ready、目录迁移和任务退出未运行；上游运行与全部准备支路未全审
  **影响**：不能把元数据/ready/checkpoint当完整任务正确性或全部进程/费用已停止；切主数据前仍需隔离验收
  **进一步探讨**：后续新账户/明确独立home核首次向导、坏descriptor、启动超时/切换中断/停Host失败，读回profile/目录/进程，不靠X或阶段绿灯。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 原生renderer与普通浏览器的活动门卫/权限是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

主窗口实际contextIsolation:true、sandbox:true、nodeIntegration:false，primary才webviewTag；preload只对app origin暴露contextBridge的状态/boot/权限/command/目录选择与文件路径桥，不是给renderer原始ipcMain/Electron对象。也不能因此称所有guest、权限、模型工具、插件或OS都已隔离；桥能触发真实桌面操作、文件path暴露给工作流，当前主界面/插件仍是高信任区域。

实际main注册dsh-app protocol：shell是本地原生页面并设CSP，app静态资产本地提供，其他请求在有Host/auth时forwardWebRequest。onBeforeSendHeaders先删外来native header，仅给匹配app目标、owned webContents/live同源frame且非mainFrame请求贴能力；forward再核scheme/host/无userinfo/token相等/Origin，才剥原host/origin/cookie等，用main的Host cookie/token重塑loopback同源请求。WS另核127.0.0.1目标同auth host、owned contents与dsh-app://app Origin，再附cookie/token。原生能力token/内层cookie由main/Host持有，Host configure后删敏感env；但开启普通浏览器访问时，preload的browserLinks接口可返回Host提供的authenticatedUrl完整链接及改写LAN链接，不能概称所有登录材料永不进入renderer。不把loopback/同源重塑误当请求原本就是物理本机用户。

IPC也有实际sender门：owner窗口/当前mainFrame/URL前缀；boot取documentId后await startup/injections再重验sender/id，过期document拒返。state/command亦实际经assertDesktopSender。它是本应用/文档所有权校验，不等任意脚本都无权操作、更非多用户RBAC或原生工具最小权限全审。

Host侧NextWebServer实际重写register/fallback/resource/upgrade，用DesktopBrowserAccess分类：32-byte base64url token/精确格式和timingSafeEqual的renderer请求优先；普通browser必须开关允许且URL无desktop marker。正常launcher每次创建token并configure，构成局部门；但access不存在时permits/permitsFetch返回true，resource带peer时当caller已准入，不可泛称所有直接启动/所有Peer/RPC都默认fail-closed。Market handler还另要求connection.requestRejection，普通browser开关不是全部API免认证。

与只挡新握手不同，当前beta确实有旧流撤销机制：registerUpgrade把分类browser的socket加入集合，setBrowserAccess(false)逐个destroy并清表，native流保留。活动caller为runtime.applyPreferences→HostProcess.setBrowserAccess IPC→host/index→NextWebServer.setBrowserAccess，再调LAN enable并写偏好；失败尝试恢复旧偏好，连旧策略都无法确认时backend.stop。不能沿用别的组件rawpipe结论说这里完全不关旧流，也不能扩大为关闭所有外部工作/所有插件自建listener、既有HTTP任务或宿主其他凭据。

默认browserAccess=false、networkExposure=loopback、remoteControl/market新profile均false；用户显式开启才走对应面。本轮未全审LAN证书/edge、guest leases、所有permission handler、远程插件组合和上游认证，不给公网/恶意插件的整体安全保证。

装载链也需闭合：Host runProfile的readPatches/patchFiles实际列入host.cordis.patch.yml；该完整补丁禁用原webserver，insert desktop-next-webserver、name为dsh-plugin-desktop-beta/webserver并inject webStartup，包exports的./webserver指向./lib/webserver.js。因此上述NextWebServer在本beta启动组合中有实际装载接线，不只是独立类定义。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:294-311](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L294-L311)

真实主窗webPreferences。

<details>
<summary>查看原文（18行）</summary>

```text
function createWindow(preload: string, primary = false): BrowserWindow {
  const window = new BrowserWindow({ width: 1280, height: 840, minWidth: 800, minHeight: 580,
    show: false, title: 'DSH Desktop Beta',
    ...(process.platform !== 'darwin' ? { icon: unpackedPath(join(root, 'build', process.platform === 'win32' ? 'app-icon.ico' : 'app-icon.png')) } : {}),
    ...(!primary ? auxiliaryWindowChromeOptions() : {}),
    ...(process.platform === 'win32' && primary ? {
      titleBarStyle: 'hidden' as const,
      titleBarOverlay: { height: WINDOWS_TITLEBAR_HEIGHT, color: WINDOWS_CAPTION_FILL,
        symbolColor: nativeTheme.shouldUseDarkColors ? '#f9fafb' : '#0f1115' },
    } : {}),
    ...(process.platform === 'darwin' ? {
      ...(primary ? { titleBarStyle: 'hiddenInset' as const, trafficLightPosition: { x: 16, y: 18 } } : {}),
      vibrancy: runtime.preferences.macosMaterial === 'transparent' ? 'sidebar' as const : undefined,
      visualEffectState: 'active' as const, backgroundColor: '#00000000',
    } : {}),
    // `webviewTag` only on the application document: every attachment is still refused unless
    // `DesktopBrowserGuests` issued the lease, and the guest itself never gets the tag.
    webPreferences: { preload: join(root, 'lib', preload), contextIsolation: true, sandbox: true, nodeIntegration: false, webviewTag: primary },
```

</details>

**依据 2 · 源码核查**：[dsh-plugin-desktop-beta/src/preload-app.ts:14-57](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/preload-app.ts#L14-L57)

实际窄桥但有command/path等能力。

<details>
<summary>查看原文（44行）</summary>

```text
if (location.protocol === 'dsh-app:' && location.hostname === 'app') {
  let documentId: string | undefined
  let profile = ''
  markDocumentPlatform()
  syncNativeTheme()
  syncNativeLocale()
  syncWindowsAppearance()
  syncWindowMaterial()
  contextBridge.exposeInMainWorld('dshOnboarding', {
    setActive: (active: boolean) => { void ipcRenderer.invoke('dsh-desktop:setup-onboarding', { action: 'active', active }).catch(() => {}) },
  })
  contextBridge.exposeInMainWorld('dshDesktopSetup', {
    read: () => ipcRenderer.invoke('dsh-desktop:setup-onboarding', { action: 'read' }),
    dismissAccount: (profile: string) => ipcRenderer.invoke('dsh-desktop:setup-onboarding', { action: 'dismiss-account', profile }),
    finish: (profile: string, selection?: unknown) => ipcRenderer.invoke('dsh-desktop:setup-onboarding', { action: 'finish', profile, selection }),
  })
  contextBridge.exposeInMainWorld('desktopNext', {
    renderer: {
      profile: () => profile,
      report: (status: unknown) => ipcRenderer.invoke(IPC.rendererStatus, documentId, status),
    },
    permissions: permissionBridge(),
    onOpenSettings,
    state: () => ipcRenderer.invoke(IPC.state),
    browserLinks: () => ipcRenderer.invoke(IPC.browserLinks),
    command: (command: unknown) => ipcRenderer.invoke(IPC.command, command),
  })
  // dsh 0.1.7 implements the native Sidebar browser itself and reads its transport from this
  // carrier; without `browser` the official plugin silently falls back to the sandboxed iframe.
  contextBridge.exposeInMainWorld('dshDesktop', { protocolVersion: 1, browser: createDesktopBrowserBridge(), ...createDesktopKeyboardBridge() })
  contextBridge.exposeInMainWorld('dshDesktopBoot', {
    ready: async () => {
      const boot = await ipcRenderer.invoke(IPC.boot)
      documentId = boot.documentId
      profile = boot.profile
      return boot
    },
    failed: (message: string) => ipcRenderer.invoke(IPC.failed, message, documentId),
  })
  contextBridge.exposeInMainWorld('__DSH_DIRECTORY_PICKER__', { pick: () => ipcRenderer.invoke(IPC.directory) })
  // The official composer cites dropped, picked, and pasted files and folders that have a
  // real path as `@path` references instead of uploading them, and refuses folders outright
  // when this bridge is absent; a File without a path (pasted bytes) answers '' and uploads.
  contextBridge.exposeInMainWorld('__DSH_HOST_PATHS__', { pathFor: (file: File) => webUtils.getPathForFile(file) })
```

</details>

**依据 3 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1045-1068](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1045-L1068)

protocol/forward和boot document复核。

<details>
<summary>查看原文（24行）</summary>

```text
  protocol.handle('dsh-app', async request => {
    const url = new URL(request.url)
    if (url.hostname === 'shell') {
      const response = await serveWebDocument(request, join(root, 'lib/native-ui'), false)
      response.headers.set('content-security-policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-src 'none'; base-uri 'none'")
      return response
    }
    if (url.hostname !== 'app') return new Response(null, { status: 404 })
    if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname.startsWith('/assets/')
      || ['/favicon.svg', '/manifest.webmanifest'].includes(url.pathname)) return serveWebDocument(request, webRoot)
    const auth = runtime.auth
    if (!runtime.backend.host || !auth) return new Response(null, { status: 503 })
    return forwardWebRequest(request, auth.url, auth.cookie, auth.token)
  })
  ipcMain.handle(IPC.boot, async event => {
    assertSender(event, mainWindow, APP_URL)
    const documentId = rendererDocumentId
    await runtime.startup
    if (!runtime.backend.host || !runtime.auth) throw new Error('Next Host is unavailable')
    const injections = await runtime.injections()
    assertSender(event, mainWindow, APP_URL)
    if (documentId !== rendererDocumentId || quitting || runtime.recoveryMode) throw new Error('Next document was superseded')
    rendererRecovery?.booted()
    return { injections, streamBaseUrl: new URL(runtime.auth.url).origin, documentId, profile: runtime.selected }
```

</details>

**依据 4 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:260-266](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L260-L266)

sender/mainFrame/URL门。

```text
function assertSender(event: Pick<IpcMainInvokeEvent, 'sender' | 'senderFrame'>, owner: BrowserWindow | undefined, origin: string): void {
  if (!owner || owner.isDestroyed() || event.sender !== owner.webContents
    || event.senderFrame !== owner.webContents.mainFrame || !event.senderFrame.url.startsWith(origin)) throw new Error('Rejected Next IPC sender')
}
function assertDesktopSender(event: Pick<IpcMainInvokeEvent, 'sender' | 'senderFrame'>): void {
  if (event.sender === mainWindow?.webContents) assertSender(event, mainWindow, APP_URL)
  else assertSender(event, shellWindow, 'dsh-app://shell/')
```

**依据 5 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1082-1085](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1082-L1085)

state实际sender校验。

```text
  ipcMain.handle(IPC.state, event => { assertDesktopSender(event); return state() })
  ipcMain.handle('dsh-desktop:setup-onboarding', async (event, request: unknown) => {
    assertSender(event, mainWindow, APP_URL)
    if (!request || typeof request !== 'object' || Array.isArray(request)) throw new Error('Invalid setup request')
```

**依据 6 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1157-1157](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1157-L1157)

command真实sender校验。

```text
  ipcMain.handle(IPC.command, (event, value: unknown) => { assertDesktopSender(event); return command(value, event.sender === shellWindow?.webContents ? 'shell' : 'app') })
```

**依据 7 · 源码核查**：[dsh-plugin-desktop-beta/src/web-document.ts:42-54](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/web-document.ts#L42-L54)

header删旧/仅owned live app frame贴token。

<details>
<summary>查看原文（13行）</summary>

```text
export function appRequestHeaders(
  request: Pick<OnBeforeSendHeadersListenerDetails, 'url' | 'webContentsId' | 'webContents' | 'frame' | 'resourceType' | 'requestHeaders'>,
  owner: Pick<WebContents, 'id' | 'mainFrame'> | undefined,
  nativeToken: string | undefined,
): Record<string, string> {
  const headers = Object.fromEntries(Object.entries(request.requestHeaders)
    .filter(([name]) => name.toLowerCase() !== NATIVE_ACCESS_HEADER))
  const target = new URL(request.url)
  if (target.protocol === 'dsh-app:' && target.host === 'app' && !target.username && !target.password && owner && nativeToken
    && request.webContentsId === owner.id && (!request.webContents || request.webContents.id === owner.id)
    && request.resourceType !== 'mainFrame' && request.frame
    && !request.frame.detached && request.frame.origin === 'dsh-app://app') headers[NATIVE_ACCESS_HEADER] = nativeToken
  return headers
```

</details>

**依据 8 · 源码核查**：[dsh-plugin-desktop-beta/src/web-document.ts:122-130](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/web-document.ts#L122-L130)

forward真正校验。

```text
export async function forwardWebRequest(request: Request, host: string, cookie: string, nativeToken: string): Promise<Response> {
  const source = new URL(request.url)
  const origin = request.headers.get('origin')
  // Custom-protocol fetches can omit Origin. The native session marks only
  // requests from live same-origin frames in our owned window; an HTTP header or referrer alone is
  // insufficient. Keep this compatible with the upstream's Electron 44.0 ABI.
  if (source.protocol !== 'dsh-app:' || source.host !== 'app' || source.username || source.password
    || !nativeToken || request.headers.get(NATIVE_ACCESS_HEADER) !== nativeToken) return new Response(null, { status: 403 })
  if (origin !== null && origin !== 'dsh-app://app') return new Response(null, { status: 403 })
```

**依据 9 · 源码核查**：[dsh-plugin-desktop-beta/src/web-document.ts:151-168](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/web-document.ts#L151-L168)

附main cookie/token同源转发。

<details>
<summary>查看原文（18行）</summary>

```text
  const target = new URL(host)
  target.pathname = source.pathname
  target.search = source.search
  const headers = new Headers(request.headers)
  for (const name of ['host', 'origin', 'cookie', 'sec-fetch-site', NATIVE_ACCESS_HEADER]) headers.delete(name)
  headers.set('cookie', cookie)
  headers.set(NATIVE_ACCESS_HEADER, nativeToken)
  // Preserve same-origin semantics for every owned plugin route, including
  // /dsh-market/*. Translate only after validating the native frame marker and
  // source origin; the HTTP client supplies Host from this owned target URL.
  headers.set('origin', target.origin)
  headers.set('sec-fetch-site', 'same-origin')
  const init = { method: request.method, headers, body: request.body, signal: request.signal, duplex: 'half', redirect: 'manual' as const }
  const response = await fetch(target, init)
  const outgoing = new Headers(response.headers)
  for (const name of WITHHELD_RESPONSE_HEADERS) outgoing.delete(name)
  if (PLUGIN_BUNDLE_PATH.test(source.pathname)) outgoing.set('cache-control', 'no-store')
  return new Response(response.body, { status: response.status, headers: outgoing })
```

</details>

**依据 10 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1167-1178](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1167-L1178)

WS真实同Host/owner/origin门与凭据附加。

<details>
<summary>查看原文（12行）</summary>

```text
  session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['<all_urls>'] }, (details, callback) => {
    const auth = runtime.auth
    const owner = mainWindow && !mainWindow.isDestroyed() ? mainWindow.webContents : undefined
    const requestHeaders = appRequestHeaders(details, owner, auth?.token)
    const target = new URL(details.url)
    if (target.protocol !== 'ws:' || target.hostname !== '127.0.0.1'
      || !auth || details.webContentsId !== owner?.id) return callback({ requestHeaders })
    const host = new URL(auth.url)
    if (target.host !== host.host) return callback({ requestHeaders })
    const headers = Object.fromEntries(Object.entries(requestHeaders).map(([key, value]) => [key.toLowerCase(), value]))
    if (headers.origin !== 'dsh-app://app') return callback({ cancel: true })
    callback({ requestHeaders: { ...headers, origin: host.origin, cookie: auth.cookie, [NATIVE_ACCESS_HEADER]: auth.token, 'sec-fetch-site': 'same-origin' } })
```

</details>

**依据 11 · 源码核查**：[dsh-plugin-desktop-beta/src/host/index.ts:54-58](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/host/index.ts#L54-L58)

Host capability配置与清环境。

```text
  configureNextBrowserAccess(process.env.DSH_NEXT_NATIVE_TOKEN, preferences.browserAccess)
  delete process.env.DSH_NEXT_NATIVE_TOKEN
  delete process.env.DSH_NEXT_PREFERENCES
  delete process.env.DSH_NEXT_TRUSTED_HOSTS
  delete process.env[SYSTEM_PROXY_ENV]
```

**依据 12 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:259-269](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L259-L269)

显式开browser才返回完整本地/LAN登录链接。

<details>
<summary>查看原文（11行）</summary>

```text
  browserLinks(): DesktopBrowserLinks {
    if (!this.auth || this.closing || this.recoveryMode || this.backend.state.phase !== 'ready' || !this.preferences.browserAccess || this.safeMode) return { localUrl: null, lanUrls: [] }
    const localUrl = new URL(this.auth.url).href
    const edge = this.lan?.snapshot()
    const lanUrls = this.preferences.networkExposure === 'lan' && edge?.state === 'ready' && edge.actualPort
      ? edge.addresses.map(address => {
        const url = new URL(localUrl)
        url.protocol = 'https:'; url.hostname = address; url.port = String(edge.actualPort)
        return url.href
      }) : []
    return { localUrl, lanUrls }
```

</details>

**依据 13 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-browser-access.ts:41-74](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-browser-access.ts#L41-L74)

32-byte格式/精确header/constant-time比较。

<details>
<summary>查看原文（34行）</summary>

```text
export function createDesktopBrowserAccess(
  ordinaryBrowserEnabled: boolean,
  token: string = randomBytes(ACCESS_TOKEN_BYTES).toString('base64url'),
): DesktopBrowserAccess {
  if (typeof ordinaryBrowserEnabled !== 'boolean') {
    throw new TypeError('dsh-plugin-desktop-beta: ordinary browser access must be a boolean')
  }
  if (!ACCESS_TOKEN_PATTERN.test(token)) {
    throw new TypeError('dsh-plugin-desktop-beta: renderer access token must be 32 base64url bytes')
  }
  let enabled = ordinaryBrowserEnabled
  return Object.freeze({
    get ordinaryBrowserEnabled() { return enabled },
    rendererHeader: Object.freeze({
      name: DESKTOP_RENDERER_ACCESS_HEADER,
      value: token,
    }),
    setOrdinaryBrowserEnabled(next: boolean) {
      if (typeof next !== 'boolean') {
        throw new TypeError('dsh-plugin-desktop-beta: ordinary browser access must be a boolean')
      }
      enabled = next
    },
  })
}

function exactHeaderValue(headers: IncomingHttpHeaders): string | undefined {
  const value = headers[DESKTOP_RENDERER_ACCESS_HEADER]
  return typeof value === 'string' ? value : undefined
}

function sameToken(actual: string | undefined, expected: string): boolean {
  if (actual === undefined || !ACCESS_TOKEN_PATTERN.test(actual) || actual.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
```

</details>

**依据 14 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-browser-access.ts:78-95](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-browser-access.ts#L78-L95)

marker/renderer/browser决策。

<details>
<summary>查看原文（18行）</summary>

```text
export function desktopBrowserUrlHasRendererMarkers(rawUrl: string | undefined): boolean {
  let url: URL
  try {
    url = new URL(rawUrl ?? '/', 'http://dsh.invalid')
  } catch {
    return true
  }
  return [...url.searchParams.keys()].some(key => key.startsWith(DESKTOP_MARKER_PREFIX))
}

/** Classify one HTTP or upgrade request without exposing the renderer token. */
export function decideDesktopBrowserAccess(
  access: DesktopBrowserAccess,
  request: { readonly headers: IncomingHttpHeaders; readonly url?: string | undefined },
): DesktopBrowserAccessDecision {
  if (sameToken(exactHeaderValue(request.headers), access.rendererHeader.value)) return 'renderer'
  if (!access.ordinaryBrowserEnabled || desktopBrowserUrlHasRendererMarkers(request.url)) return 'denied'
  return 'browser'
```

</details>

**依据 15 · 源码核查**：[dsh-plugin-desktop-beta/src/webserver.ts:16-35](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/webserver.ts#L16-L35)

真实关旧browser socket与无access分支。

<details>
<summary>查看原文（20行）</summary>

```text
  /** Revoke existing browser streams as well as new requests; native streams stay alive. */
  setBrowserAccess(enabled: boolean): void {
    const access = nextBrowserAccess()
    if (!access) throw new Error('Native browser-access policy is unavailable')
    access.setOrdinaryBrowserEnabled(enabled)
    if (!enabled) {
      for (const socket of this.browserSockets) socket.destroy()
      this.browserSockets.clear()
    }
  }

  private permits(request: Parameters<WebRoute['handler']>[0]): boolean {
    const access = nextBrowserAccess()
    return !access || decideDesktopBrowserAccess(access, request) !== 'denied'
  }

  /** The same decision for a Fetch request, which carries the client's headers but no socket. */
  private permitsFetch(request: Request): boolean {
    const access = nextBrowserAccess()
    return !access || decideDesktopBrowserAccess(access, { headers: Object.fromEntries(request.headers), url: request.url }) !== 'denied'
```

</details>

**依据 16 · 源码核查**：[dsh-plugin-desktop-beta/src/webserver.ts:38-75](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/webserver.ts#L38-L75)

register/fallback/resource实际门与peer/Market条件。

<details>
<summary>查看原文（38行）</summary>

```text
  override register(route: WebRegistration): () => void {
    return super.register(wrapRegistration(route, this.policy(route.path)))
  }

  override registerFallback(fallback: WebFallback): () => void {
    return super.registerFallback(wrapFallback(fallback, this.policy('fallback')))
  }

  private policy(route: string): ResponderWrappers {
    return {
      handler: inner => this.observeHttp(route, async (request, response) => {
        if (!this.permits(request)) { response.writeHead(403, { 'cache-control': 'no-store' }); response.end('Browser access is disabled'); return }
        if (!isMarketRoute(route)) {
          await inner(request, response); return
        }
        const connection = this.ctx.get('connection')
        const rejection = connection === undefined ? 503 : connection.requestRejection(request)
        if (rejection !== undefined) {
          response.writeHead(rejection, { 'cache-control': 'no-store' })
          response.end('Market request authentication required')
          return
        }
        await inner(request, response)
      }),
      resource: (inner) => {
        // Market credentials are checked on the request socket, which only a handler sees.
        if (isMarketRoute(route)) throw new Error(`Market route ${route} must be a handler`)
        return async (request, peer) => {
          const end = hostOperation('host.http', 'request', { route, method: request.method }, true)
          try {
            // An HTTP request arrives without a Peer; an in-process read was admitted by its caller.
            if (peer === undefined && !this.permitsFetch(request)) {
              end(undefined, { status: 403 })
              return new Response('Browser access is disabled', { status: 403, headers: { 'cache-control': 'no-store' } })
            }
            const response = await inner(request, peer)
            end(undefined, { status: response.status })
            return response
```

</details>

**依据 17 · 源码核查**：[dsh-plugin-desktop-beta/src/webserver.ts:91-102](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/webserver.ts#L91-L102)

升级先gate再跟踪browser sockets。

<details>
<summary>查看原文（12行）</summary>

```text
  override registerUpgrade(route: WebUpgradeRoute): () => void {
    return super.registerUpgrade({ ...route, handler: (request, socket, head) => {
      hostLog({ source: 'host.http', event: 'upgrade', fields: { route: route.path }, developer: true })
      if (!this.permits(request)) { socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Length: 0\r\n\r\n'); return }
      const access = nextBrowserAccess()
      if (access && decideDesktopBrowserAccess(access, request) === 'browser') {
        this.browserSockets.add(socket)
        socket.once('close', () => this.browserSockets.delete(socket))
      }
      return route.handler(request, socket, head)
    } })
  }
```

</details>

**依据 18 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:200-232](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L200-L232)

实际偏好切换/IPC/rollback失败停后端。

<details>
<summary>查看原文（33行）</summary>

```text
  /** Apply access toggles without stopping conversations or changing the renderer capability. */
  async applyPreferences(value: unknown): Promise<void> {
    const next = parsePreferences(value)
    // A Host already being spawned has captured its boot policy. Apply after
    // readiness instead of only saving a value that the running Host never sees.
    if (this.backend.state.phase === 'starting' && !this.recoveryMode && !this.safeMode) await this.startup.catch(() => {})
    if (this.closing) throw new Error('Next is shutting down')
    const previous = this.preferences
    const host = this.hostProcess
    const lan = this.lan
    if (!host || !lan || !this.auth || this.safeMode || this.backend.state.phase !== 'ready') {
      this.writePreferences(next); return
    }
    const loggingChanged = next.developerLogging !== previous.developerLogging || next.logLevel !== previous.logLevel
    const changed = next.browserAccess !== previous.browserAccess || next.networkExposure !== previous.networkExposure
    try {
      if (loggingChanged) await host.setLogging(next)
      if (!changed) { this.writePreferences(next); return }
      await host.setBrowserAccess(next.browserAccess)
      const edge = await lan.setEnabled(next.browserAccess && next.networkExposure === 'lan')
      if (this.closing) throw new Error('Next is shutting down')
      this.writePreferences(next)
      if (edge.state === 'failed') this.diagnostics.append(`LAN HTTPS: ${edge.errorCode}`, 'warn')
    } catch (error) {
      if (!this.closing) {
        try {
          if (loggingChanged) await host.setLogging(previous)
          await host.setBrowserAccess(previous.browserAccess)
          await lan.setEnabled(previous.browserAccess && previous.networkExposure === 'lan')
        } catch {
          // An unacknowledged access policy must never remain publicly reachable.
          await this.backend.stop()
        }
```

</details>

**依据 19 · 源码核查**：[dsh-plugin-desktop-beta/src/host/index.ts:121-129](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/host/index.ts#L121-L129)

Host IPC实际callee。

```text
    if (typeof value !== 'object' || value === null || !('type' in value) || value.type !== 'browser-access') return
    const request = value as { requestId?: unknown; enabled?: unknown }
    if (!Number.isSafeInteger(request.requestId) || typeof request.enabled !== 'boolean') return
    const enabled = request.enabled
    void application.then(async ({ ctx }) => {
      if (stopping) throw new Error('Next Host is stopping')
      ;(ctx.webServer as NextWebServer).setBrowserAccess(enabled)
      await send({ type: 'browser-access', requestId: request.requestId })
    }).catch(async () => { await send({ type: 'browser-access', requestId: request.requestId, error: 'Could not update browser access' }) }).catch(fatal)
```

**依据 20 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-contract.ts:42-54](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-contract.ts#L42-L54)

普通/安全模式访问默认。

<details>
<summary>查看原文（13行）</summary>

```text
export const DEFAULT_PREFERENCES: Readonly<DesktopPreferences> = Object.freeze({
  closeToTray: true, macosMaterial: 'transparent', windowsMaterial: 'off', linuxMaterial: 'off',
  browserAccess: false, networkExposure: 'loopback', port: 0, lanPort: 0, logLevel: 'info', developerLogging: false,
  sidebarFooterCompat: true, sidebarFooterBalanced: true, notifications: true, turnCompleted: true, turnFailed: true, jobCompleted: false, jobFailed: false,
  scheduleCompleted: true, scheduleFailed: true,
})

/** Fixed startup defaults matching Beta's disposable Safe Mode settings. */
export const SAFE_MODE_PREFERENCES: Readonly<DesktopPreferences> = Object.freeze({
  ...DEFAULT_PREFERENCES, macosMaterial: 'off', windowsMaterial: 'off', linuxMaterial: 'off',
  browserAccess: false, networkExposure: 'loopback', port: 0, lanPort: 0, logLevel: 'info', developerLogging: false,
  sidebarFooterCompat: true, sidebarFooterBalanced: true, notifications: false, turnCompleted: false, turnFailed: false, jobCompleted: false, jobFailed: false,
  scheduleCompleted: false, scheduleFailed: false,
```

</details>

**依据 21 · 源码核查**：[dsh-plugin-desktop-beta/src/profiles.ts:26-28](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/profiles.ts#L26-L28)

新profile扩展默认false。

```text
export interface Features { remoteControl: boolean; market: boolean; dshMarket?: boolean; officialMarket?: boolean }
export interface OnboardingChoices { features: Features; computerUse: boolean }
export const DEFAULT_FEATURES: Readonly<Features> = { remoteControl: false, market: false }
```

**依据 22 · 源码核查**：[dsh-plugin-desktop-beta/src/host/index.ts:69-75](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/host/index.ts#L69-L75)

runProfile实际readPatches和patchFiles包含host.cordis.patch.yml。

```text
  const application = runProfile({
    environment, profile: basename(projectDir),
    resolvedProfile: { profile, installAnchor: NEXT_PACKAGE,
      readPatches: profilePatches => readNextProfilePatches(projectDir, home,
        [join(runtimeDir, 'host.cordis.patch.yml'), join(projectDir, 'desktop-next.cordis.patch.json'), runtimePatch], profilePatches) },
    patchFiles: [join(runtimeDir, 'host.cordis.patch.yml'), join(projectDir, 'desktop-next.cordis.patch.json'), runtimePatch], args: ['--no-open', '--port', String(preferences.port)],
    packageManager: bundledPnpmInvocation(runtimeDir),
```

**依据 23 · 源码核查**：[dsh-plugin-desktop-beta/host.cordis.patch.yml:1-10](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/host.cordis.patch.yml#L1-L10)

完整补丁禁旧webserver、插入desktop-next-webserver，指定包/webserver并inject webStartup及loopback ephemeral配置。

<details>
<summary>查看原文（10行）</summary>

```text
# A private, ephemeral loopback port allows Next to coexist with other editions.
- id: webserver
  disabled: true
- insert:
    - id: desktop-next-webserver
      name: dsh-plugin-desktop-beta/webserver
      inject: [webStartup]
      config:
        host: 127.0.0.1
        port: 0
```

</details>

**依据 24 · 源码核查**：[dsh-plugin-desktop-beta/package.json:307-307](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/package.json#L307-L307)

实际exports ./webserver到lib/webserver.js。

```text
    "./webserver": "./lib/webserver.js"
```

#### 缺口

- 真实浏览器/IPC/旧流/失败回滚与全部网络/权限/恶意输入未验
  **影响**：支持局部有条件原生载体门，不支持全插件/公网/多用户或模型工具OS隔离承诺
  **进一步探讨**：后续隔离测非法frame/header、旧document/WS、开关期间故障/撤销、无access直启与原生桥；只保默认私有面，不用不可信插件扩展验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 备份、恢复与更新退出有哪些实接线和具体缺口？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

本轮闭合整个数据目录备份代表操作：main command分发backup-data-directory后确认外部目标与暂停任务，runtime.restart先backend.stop，再copyDataDirectory，之后start/reload；copy错误被保存，恢复后才报告失败，而不是偷偷把失败当成功。helper拒现存目标/源内目标，写destination.partial、复制完rename，异常删partial；跳electron-user-data及desktop-next-location.json，正常不跟随目录symlink，内部链接重定向到副本。外部链接仍指原外路径；Windows文件链接建立失败且目标是文件时会复制内容，断链/特殊项并非全保。这些不能统称全目录自包含镜像，恢复到别机/新位置还需验外部依赖。

这是stopped-owned-Host的文件复制，不是所有外部写者的全局一致快照。选定backup caller/Runtime.restart/Backend cleanup链未取旧stable数据owner lease；beta另有profile修复withFileLock+原字节备份/atomic写，但不能归纳所有操作/外部CLI共享同锁。先确保无其他app/CLI写者，不因destination无partial就认为源没变/数据库逻辑一致/凭据安全。普通文件可含配置/会话/凭据，备份非加密证明；诊断虽maskSecrets仍不保证所有插件文本全脱敏，分享前人工核查。

恢复也非只有旧DOM标题脚本：beta原生recovery可在Host未启动时显示failureStage/failureExit、checkpoint和diagnostics snapshot；safe mode独立临时home，成功Host启动后checkpoint有实际caller，profile.ensure迁移也备份旧manifest。已有这些记录与原生助手，不应把“加诊断页/收据”再当本轮新发明。它们不等完整还原/所有任务恢复，部分checkpoint失败仅warn，其他修复/迁移全矩阵未审。

更新是另一条必须收窄的活动链。packaged Mac/Win启动约30秒后检查，之后6小时poll；check只设available/current及通知，用户通知点击弹下载确认，download和install是另动作。download前重新query、传expectedSha256/一小时abort与dispose controller；本轮未全审其callee的哈希必需性、签名/完整安装/脚本回滚，不根据参数/注释宣布全包可信或下载完成即已安装。

实际install callback先updateInstaller.stage再installingUpdate=true/app.quit。before-quit同时dispose更新/恢复并runtime.close→backend.close→createHost.stop wrapper→host.stop()，这里没有传requireGraceful=true；严格参数/拒非零或无shutdown-complete的helper存在，不证明它被本更新链启用。更关键，cleanup失败或总退出timeout调用completeShutdown(false)，而其if(installingUpdate)仍先await updateInstaller.launch，clean标志不作前置门；Mac launch实际spawn独立脚本并给Electron主PID。故不能从“Called after Host…shutting down”注释声称不干净Host必拒交接，也不能由此断言更新一定损坏：完整native script/签名和OS结果未审/未运行。先不要在重要任务/主数据上试内置更新。

Host graceful shutdown确有IPC→running.shutdown.shutdown→shutdown-complete再exit，普通close有TERM/KILL/等待且失败抛错；这是正面机制，但不证明所有孙进程/已提交网络工作均停或还原。正常退出、隐藏托盘、Host进程退出、任务资源、备份和安装成功分别验收，不能共享一个green状态。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:679-683](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L679-L683)

备份command真实分支。

```text
    if (type === 'change-data-directory' || type === 'backup-data-directory') {
      if (runtime.safeMode || runtime.recoveryMode) throw new Error(t('安全模式和恢复模式下请使用恢复助手。', 'In Safe Mode or recovery mode, use the recovery assistant.'))
      if (type === 'change-data-directory') await changeDataDirectory(false)
      else await backupDataDirectory()
      return
```

**依据 2 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:974-1004](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L974-L1004)

备份确认→runtime.restart→copy→恢复后成功/失败可见。

<details>
<summary>查看原文（31行）</summary>

```text
async function backupDataDirectory(): Promise<void> {
  const owner = raiseDialogOwner()
  const options: OpenDialogOptions = { title: t('选择备份保存位置', 'Choose where to save the backup'), properties: ['openDirectory', 'createDirectory'] }
  const choice = await (owner === undefined ? dialog.showOpenDialog(options) : dialog.showOpenDialog(owner, options))
  const parent = choice.canceled ? undefined : choice.filePaths[0]
  if (!parent || !isAbsolute(parent)) return
  const destination = join(parent, backupDirectoryName(home))
  try { assertBackupLocation(home, destination) } catch { throw new Error(t('请选择当前数据目录以外的位置。', 'Choose a location outside the current data directory.')) }
  if (!await confirmed(t('备份当前数据目录？', 'Back up the current data directory?'),
    t(`备份位置：${destination}\n复制期间工作环境会暂停，正在运行的任务会中断，完成后自动恢复。electron-user-data 中的窗口和浏览器缓存不会备份。`,
      `Backup location: ${destination}\nThe environment pauses while copying, interrupting running tasks, and resumes afterwards. Window and browser caches in electron-user-data are not included.`))) return
  rendererRecovery?.stop()
  await recoveryStopping
  let failure: Error | undefined
  // The taskbar or Dock shows the copy is running while the Host, and with it the window content, is down.
  const progress = (value: number): void => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setProgressBar(value) }
  progress(2)
  try {
    await runtime.restart(async () => {
      try { await copyDataDirectory(home, destination) } catch (error) { failure = error instanceof Error ? error : new Error(String(error)) }
    })
  } finally { progress(-1) }
  await reloadMain()
  if (failure) throw new Error(t('备份未完成：', 'Backup failed: ') + failure.message)
  runtime.diagnostics.append(`Backed up the data directory to ${destination}`)
  const done = raiseDialogOwner()
  const notice = { type: 'info' as const, title: 'DSH Desktop Beta', message: t('数据目录已备份', 'Data directory backed up'), detail: destination,
    buttons: [t('在文件夹中显示', 'Show in folder'), t('完成', 'Done')], defaultId: 1, cancelId: 1, noLink: true }
  void (done === undefined ? dialog.showMessageBox(notice) : dialog.showMessageBox(done, notice))
    .then(result => { if (result.response === 0) shell.showItemInFolder(destination) })
    .catch(error => runtime.diagnostics.append(String(error), 'warn'))
```

</details>

**依据 3 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:152-161](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L152-L161)

restart先停再copy/change再start。

<details>
<summary>查看原文（10行）</summary>

```text
  async restart(change: () => void | Promise<void> = () => {}): Promise<void> {
    await this.backend.stop()
    if (this.closing) return
    const wasSafe = this.safeMode
    await change()
    if (!this.safeMode) {
      this.cleanupSafeHome()
      if (wasSafe) this.preferences = new DesktopPreferenceStore(this.options.home).read()
    }
    await this.start()
```

</details>

**依据 4 · 源码核查**：[dsh-plugin-desktop-beta/src/data-backup.ts:6-9](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/data-backup.ts#L6-L9)

明确跳过和copy mode。

```text
/** Chromium keeps live, machine-bound state there and rebuilds it; a former choice file would redirect the copy. */
const SKIPPED = new Set(['electron-user-data', 'desktop-next-location.json'])
/** Clone where the file system can (APFS, ReFS, btrfs); never replace an existing file. */
const COPY_MODE = constants.COPYFILE_EXCL | constants.COPYFILE_FICLONE
```

**依据 5 · 源码核查**：[dsh-plugin-desktop-beta/src/data-backup.ts:22-74](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/data-backup.ts#L22-L74)

partial/rename、特殊项与外链/Windows fallback真正行为。

<details>
<summary>查看原文（53行）</summary>

```text
export function assertBackupLocation(home: string, destination: string): void {
  if (contains(resolve(home), resolve(destination))) throw new Error('Choose a backup location outside the current data directory')
}

/**
 * Copy files, directories and links without following links. Links into the data directory are
 * retargeted into the copy, so the backup never depends on the original; on Windows, directory
 * links become junctions, which need no privilege. The copy is written beside the destination
 * under a `.partial` name and renamed only when complete, so an interrupted backup is never
 * mistaken for a whole one; a failed copy removes it.
 */
export async function copyDataDirectory(source: string, destination: string): Promise<void> {
  const from = resolve(source), to = resolve(destination)
  assertBackupLocation(from, to)
  if (await lstat(to).then(() => true, () => false)) throw new Error(`Backup destination already exists: ${to}`)
  const partial = `${to}.partial`
  await mkdir(partial, { mode: 0o700 })
  try {
    await copyEntries(from, partial, to, from, to)
    await rename(partial, to)
  } catch (error) {
    await rm(partial, { recursive: true, force: true })
    throw error
  }
}

/** `written` is where an entry is copied now; `final` is where it lives after the rename. */
async function copyEntries(directory: string, written: string, final: string, from: string, to: string): Promise<void> {
  for (const name of await readdir(directory)) {
    if (directory === from && SKIPPED.has(name)) continue
    const path = join(directory, name), copy = join(written, name)
    const info = await lstat(path)
    if (info.isSymbolicLink()) await copyLink(path, copy, join(final, name), from, to)
    else if (info.isDirectory()) {
      await mkdir(copy, { mode: (info.mode & 0o777) | 0o700 })
      await copyEntries(path, copy, join(final, name), from, to)
    } else if (info.isFile()) await copyFile(path, copy, COPY_MODE)
    // Sockets, pipes and devices belong to running processes, not to the data.
  }
}

async function copyLink(path: string, copy: string, final: string, from: string, to: string): Promise<void> {
  const link = await readlink(path)
  const resolved = resolve(dirname(path), link)
  const target = !contains(from, resolved) ? resolved : isAbsolute(link) ? join(to, relative(from, resolved)) : link
  if (process.platform !== 'win32') { await symlink(target, copy); return }
  const directory = await stat(path).then(info => info.isDirectory(), () => undefined)
  if (directory === true) { await symlink(resolve(dirname(final), target), copy, 'junction'); return }
  try { await symlink(target, copy, 'file') } catch {
    // File links need Developer Mode on Windows, so keep the content; a dangling link has none.
    if (directory === false) await copyFile(path, copy, COPY_MODE)
  }
}
```

</details>

**依据 6 · 源码核查**：[dsh-plugin-desktop-beta/src/backend-controller.ts:113-149](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/backend-controller.ts#L113-L149)

owned cleanup等待与失败所有权。

<details>
<summary>查看原文（37行）</summary>

```text
    if (this.stopping !== undefined) return this.stopping
    const attempt = this.attempt
    if (attempt !== undefined) attempt.cancelled = true
    if (!this.closed) this.update({ phase: 'starting' })
    const pending = this.pending
    const stopping = Promise.allSettled([
      attempt === undefined ? Promise.resolve() : this.cleanup(attempt),
      pending,
    ]).then((results) => {
      const cleanup = results[0]
      if (cleanup.status === 'rejected') throw cleanup.reason
      if (this.attempt === attempt) this.attempt = undefined
    }).finally(() => { if (this.stopping === stopping) this.stopping = undefined })
    this.stopping = stopping
    return stopping
  }

  /**
   * Permanently prevent startup and suppress further availability notifications.
   * @returns Completion of pending work and child exit; rejects if cleanup fails.
   */
  close(): Promise<void> {
    this.closed = true
    return this.stop()
  }

  private cleanup(attempt: Attempt<Host>): Promise<void> {
    if (attempt.cleanup === undefined) {
      const cleanup = Promise.resolve().then(async () => { await attempt.host?.stop() }).catch((error: unknown) => {
        // A failed termination retains Host ownership but permits another stop
        // attempt. Never start a replacement until that stop actually succeeds.
        if (attempt.cleanup === cleanup) delete attempt.cleanup
        throw error
      })
      attempt.cleanup = cleanup
    }
    return attempt.cleanup
```

</details>

**依据 7 · 源码核查**：[dsh-plugin-desktop-beta/src/profiles.ts:253-267](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/profiles.ts#L253-L267)

特定修复才有fileLock/backup/atomic，不泛化。

<details>
<summary>查看原文（15行）</summary>

```text
    const dir = this.directory(name)
    mkdirSync(dir, { recursive: true, mode: 0o700 })
    return withFileLock(join(dir, 'lock'), async () => {
      const backup = new NextRecovery(this).backup(name, 'before-profile-repair')
      let manifest: Record<string, unknown> = { name, private: true }
      try {
        const value: unknown = JSON.parse(readPrivateFile(join(dir, 'package.json')) ?? '{}')
        if (value && typeof value === 'object' && !Array.isArray(value)) manifest = value as Record<string, unknown>
      } catch { /* The original bytes have already been backed up. */ }
      // Keep installed dependencies, but remove malformed activation metadata.
      const onboarding = (manifest.dsh as Partial<ProfileManifest['dsh']> | undefined)?.desktopNextOnboarding
      manifest.dsh = { profile: { bundles: WEB_BUNDLES },
        ...(onboarding?.version === 1 && ['completed', 'skipped'].includes(onboarding.outcome) ? { desktopNextOnboarding: onboarding } : {}) }
      atomicJson(join(dir, 'package.json'), manifest)
      atomicText(join(dir, 'cordis.patch.yml'), '[]\n')
```

</details>

**依据 8 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:250-256](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L250-L256)

已有原生恢复/日志/checkpoint状态。

```text
    if (!this.safeMode) try { features = this.profiles.features(this.selected) } catch (error) { unreadable(error) }
    try { const saved = this.recovery.latest(this.selected); if (saved) checkpoint = { created: saved.created } } catch { /* Recovery remains usable without backups. */ }
    return { selected: this.selected, profiles, unavailableProfiles: profiles.filter(name => !this.profiles.selectable(name)), features, preferences: { ...this.preferences }, phase: this.recoveryMode ? 'recovery' : !this.auth && failure ? 'error' : this.backend.state.phase,
      busy: this.busy, failure, ...(failureStage === undefined ? {} : { failureStage }), ...(this.failureExit === undefined ? {} : { failureExit: this.failureExit }),
      safeMode: this.safeMode, home: this.options.home,
      browserUrl: this.auth && this.preferences.browserAccess && !this.safeMode ? new URL(this.auth.url).origin : null,
      lan: this.lan?.snapshot() ?? null, checkpoint, logs: this.diagnostics.snapshot() }
```

**依据 9 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:350-357](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L350-L357)

真实checkpoint caller且失败warn。

```text
          }
          if (!this.safeMode) {
            try { this.recovery.checkpoint(this.selected) } catch (error) { this.diagnostics.append(`Recovery checkpoint: ${String(error)}`, 'warn') }
          }
          started()
          // From here a Host failure stops a running Desktop rather than its startup.
          this.hostStage = 'host-runtime'
          this.diagnostics.append(`Host ready: ${profile}${this.safeMode ? ' (safe mode)' : ''}`)
```

**依据 10 · 源码核查**：[dsh-plugin-desktop-beta/src/updates.ts:68-86](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/updates.ts#L68-L86)

packaged平台poll/owned controller。

<details>
<summary>查看原文（19行）</summary>

```text
  start(): void {
    if (!this.options.packaged || !['darwin', 'win32'].includes(this.options.platform) || this.timer || this.disposed) return
    void this.initializeCache().catch(this.options.log)
    const poll = (): void => {
      if (this.disposed) return
      if (['idle', 'current', 'error'].includes(this.state.phase)) void this.check(true)
      this.timer = setTimeout(poll, 6 * 60 * 60_000); this.timer.unref()
    }
    this.timer = setTimeout(poll, 30_000); this.timer.unref()
  }
  private run(task: (signal: AbortSignal) => Promise<void>): Promise<void> {
    if (this.disposed) return Promise.resolve()
    if (this.operation) return this.operation
    this.controller = new AbortController()
    const signal = this.controller.signal
    this.operation = (async () => {
      try { await this.initializeCache(); signal.throwIfAborted(); await task(signal) }
      catch (error) { if (!signal.aborted) { this.options.log(error); this.set({ phase: 'error', error: 'download' }) } }
    })().finally(() => { this.operation = undefined; this.controller = undefined })
```

</details>

**依据 11 · 源码核查**：[dsh-plugin-desktop-beta/src/updates.ts:97-140](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/updates.ts#L97-L140)

check与download分开、重query及期望hash/abort。

<details>
<summary>查看原文（44行）</summary>

```text
  check(background = false): Promise<void> {
    if (this.state.phase === 'ready' || this.state.phase === 'installing') return Promise.resolve()
    return this.run(async signal => {
      this.set({ phase: 'checking' })
      try {
        this.result = await this.query(signal) ?? undefined
        if (!this.result) { this.set({ phase: 'error', error: 'service', version: undefined }); return }
        this.set({ phase: this.result.status === 'update-available' ? 'available' : 'current', version: this.result.latestVersion })
        if (this.result.status === 'update-available') {
          if (background && this.state.installable && this.result.latestVersion !== this.notifiedVersion) {
            this.recordNotifiedVersion(this.result.latestVersion)
            if (!this.disposed) this.options.available?.(this.result.latestVersion)
          } else if (!background && this.result.latestVersion !== this.notifiedVersion) {
            this.recordNotifiedVersion(this.result.latestVersion)
          }
        }
      } catch (error) { this.options.log(error); this.set({ phase: 'error', error: 'service' }) }
    })
  }
  download(): Promise<void> {
    if (!this.state.installable) {
      this.set({ phase: 'error', error: this.options.packaged ? 'unsupported' : 'development' }); return Promise.resolve()
    }
    if (this.state.phase === 'ready' || this.state.phase === 'installing') return Promise.resolve()
    return this.run(async signal => {
      let preparing = false
      try {
        // Recheck before a counted download; the service also pins targetVersion across races.
        this.set({ phase: 'checking' })
        const result = await this.query(signal)
        if (!result) { this.set({ phase: 'error', error: 'service' }); return }
        this.result = result
        if (result.status !== 'update-available') { this.set({ phase: 'current', version: result.latestVersion }); return }
        if (result.latestVersion !== this.notifiedVersion) this.recordNotifiedVersion(result.latestVersion)
        const platform = this.options.platform as 'darwin' | 'win32'
        const cache = join(this.options.userData, 'next-updates'); privateDirectory(cache)
        if (this.directory) await rm(this.directory, { recursive: true, force: true })
        const directory = this.directory = await mkdtemp(join(cache, 'download-'))
        this.set({ phase: 'downloading', version: result.latestVersion, received: 0, total: undefined })
        let lastProgress = 0
        const path = await downloadDesktopUpdate({ platform, version: result.latestVersion, channel: 'beta',
          destinationPath: join(directory, desktopUpdateFilename(platform, result.latestVersion, 'beta')),
          request: this.options.artifactRequest, expectedSha256: result.installerSha256?.[platform],
          signal: AbortSignal.any([signal, AbortSignal.timeout(60 * 60_000)]), onProgress: (received, total) => {
```

</details>

**依据 12 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:219-237](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L219-L237)

真实通知与install→stage→quit。

<details>
<summary>查看原文（19行）</summary>

```text
const updates = new NextUpdates({ version, platform: process.platform, packaged: app.isPackaged, userData: electronData,
  request: (url, init) => net.fetch(url, { ...init, credentials: 'omit' }),
  artifactRequest: createArtifactRequest(),
  changed: () => { if (app.isReady() && !quitting) native.refresh() },
  available: nextVersion => {
    if (app.isReady() && !quitting) {
      native.notifyUpdate(nextVersion, () => {
        void promptAvailableUpdate().catch(error => runtime.diagnostics.append(String(error), 'warn'))
      })
    }
  },
  log: error => runtime.diagnostics.append(String(error), 'warn'),
  prepare: (path, nextVersion, directory, signal) => updateInstaller.prepare(path, nextVersion, directory, signal),
  install: async () => {
    runtime.busy = true; native.refresh()
    try {
      await updateInstaller.stage()
      if (!quitting) { installingUpdate = true; app.quit() }
    } finally { runtime.busy = false; if (!quitting) native.refresh() }
```

</details>

**依据 13 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:537-552](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L537-L552)

用户点击下载确认，不称静默auto-install。

<details>
<summary>查看原文（16行）</summary>

```text
async function promptAvailableUpdate(): Promise<void> {
  if (quitting || runtime.busy) return
  const snapshot = updates.snapshot()
  if (snapshot.phase !== 'available' || !snapshot.installable) return
  const owner = raiseDialogOwner()
  const options = {
    type: 'info' as const,
    title: 'DSH Desktop Beta',
    message: updateLabel(snapshot, windowsLanguage),
    buttons: [t('下载更新', 'Download update'), t('稍后', 'Later')],
    defaultId: 0,
    cancelId: 1,
    detail: t('下载完成后可一键安装并重启。', 'When the download finishes, choose Install and restart.'),
  }
  const choice = await (owner === undefined ? dialog.showMessageBox(options) : dialog.showMessageBox(owner, options))
  if (choice.response === 0 && !quitting && !runtime.busy) void updates.download()
```

</details>

**依据 14 · 源码核查**：[dsh-plugin-desktop-beta/src/updates.ts:161-167](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/updates.ts#L161-L167)

dispose真正abort/await/清缓存条件。

```text
  async dispose(keepInstaller = false): Promise<void> {
    this.disposed = true
    clearTimeout(this.timer)
    this.controller?.abort()
    await this.operation
    if (this.directory && !keepInstaller) await rm(this.directory, { recursive: true, force: true }).catch(this.options.log)
  }
```

**依据 15 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1277-1303](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1277-L1303)

退出超时和completeShutdown(false)仍可进入installer。

<details>
<summary>查看原文（27行）</summary>

```text
  // Bound the whole shutdown, including cleanup before Host termination starts.
  let finished = false
  const timeout = setTimeout(() => {
    if (finish()) {
      runtime.diagnostics.record({ source: 'electron', event: 'shutdown.timeout', level: 'error', message: 'Shutdown exceeded five seconds', fields: { pending: JSON.stringify(runtime.diagnostics.pendingOperations()) } })
      void completeShutdown(false)
    }
  }, DESKTOP_SHUTDOWN_TIMEOUT_MS)
  timeout.unref()
  function finish(): boolean {
    if (finished) return false
    finished = true
    clearTimeout(timeout)
    return true
  }
  async function completeShutdown(clean: boolean): Promise<void> {
    if (installingUpdate) {
      const installerDone = runtime.diagnostics.operation('electron', 'installer.launch')
      try { await updateInstaller.launch(); installerDone() }
      catch (error) {
        installerDone(error)
        runtime.diagnostics.record({ source: 'electron', event: 'installer.failed', level: 'error', error })
        runtime.diagnostics.end(clean)
        dialog.showErrorBox(t('更新未能安装', 'Update could not be installed'), t('应用将重新打开，请在设置中重试更新。', 'The application will reopen. Retry the update in Settings.'))
        relaunchApp(app, relaunchArguments(process.argv.slice(1), false, false))
        if (clean) app.quit()
        else app.exit(1)
```

</details>

**依据 16 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1318-1330](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1318-L1330)

实际runtime.close与失败handoff caller。

<details>
<summary>查看原文（13行）</summary>

```text
  const updatesDone = runtime.diagnostics.operation('electron', 'updates.dispose')
  const recoveryDone = runtime.diagnostics.operation('electron', 'recovery.dispose')
  void Promise.all([updates.dispose(installingUpdate).then(() => updatesDone(), error => { updatesDone(error); throw error }), (async () => { try { await recoveryRunner?.dispose(); recoveryDone() } catch (error) { recoveryDone(error); throw error }; await runtime.close() })()]).then(async () => {
    if (!finish()) return
    // A staged installer must survive until handoff; the next boot removes it.
    if (safeModeRequested && !installingUpdate) {
      // Windows may still hold Chromium files until process exit; a normal boot
      // retries the same bounded, junction-safe cleanup when those locks are gone.
      try { cleanupDisposableTree(safeElectronData) }
      catch (error) { runtime.diagnostics.append(`Safe Mode desktop state cleanup failed: ${String(error)}`, 'warn'); runtime.diagnostics.flush() }
    }
    await completeShutdown(true)
  }).catch(error => { if (finish()) { runtime.diagnostics.record({ source: 'electron', event: 'shutdown.failed', level: 'error', error }); void completeShutdown(false) } })
```

</details>

**依据 17 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:285-292](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L285-L292)

close实际backend关闭。

```text
  async close(): Promise<void> {
    this.closing = true
    // Before the Host stops: a Host that dies of OOM while stopping is still recorded.
    this.memory.stop()
    const end = this.diagnostics.operation('desktop', 'backend.close')
    try { await this.backend.close(); end() } catch (error) { end(error); throw error }
    this.cleanupSafeHome()
    this.diagnostics.flush()
```

**依据 18 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:360-368](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L360-L368)

owned stop调host.stop无strict参数。

```text
      stop: async (): Promise<void> => {
        stopped = true
        this.auth = undefined
        const edgeStopped = this.diagnostics.operation('desktop', 'lan.stop')
        try { await lan.stop(); edgeStopped() } catch (error) { edgeStopped(error); throw error }
        const hostStopped = this.diagnostics.operation('desktop', 'host.stop')
        try { await host.stop(); hostStopped() } catch (error) { hostStopped(error); throw error }
        if (this.hostProcess === host) this.hostProcess = undefined
        if (this.lan === lan) this.lan = undefined
```

**依据 19 · 源码核查**：[dsh-plugin-desktop-beta/src/host-process.ts:465-487](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/host-process.ts#L465-L487)

strict helper存在但本caller默认及signal等待。

<details>
<summary>查看原文（23行）</summary>

```text
  async stop(requireGraceful = false): Promise<void> {
    const child = this.child
    if (child === undefined) return
    this.stopping = true
    this.diagnostic({ source: 'host.process', event: 'shutdown.request', pid: child.pid })
    this.onPlatformSession?.(null)
    if (child.connected) child.send({ type: 'shutdown' }, (error) => { if (error !== null) this.fail(error) })
    const exited = this.exitPromise ?? Promise.resolve()
    const graceful = await exitsWithin(exited, requireGraceful ? 10_000 : 3_000)
    const signalTimeoutMs = requireGraceful ? 5_000 : 750
    if (!graceful) { this.diagnostic({ source: 'host.process', event: 'shutdown.escalate', level: 'warn', pid: child.pid, fields: { signal: 'SIGTERM' } }); child.kill('SIGTERM') }
    if (!await exitsWithin(exited, signalTimeoutMs)) {
      this.diagnostic({ source: 'host.process', event: 'shutdown.escalate', level: 'warn', pid: child.pid, fields: { signal: 'SIGKILL' } })
      child.kill('SIGKILL')
      if (!await exitsWithin(exited, signalTimeoutMs)) {
        throw new Error('dsh desktop host did not exit after SIGKILL')
      }
    }
    this.child = undefined
    if (requireGraceful && (!graceful || child.exitCode !== 0 || !this.shutdownCompleted)) {
      // This diagnostic reaches expandable UI; arbitrary plugin stderr can contain credentials.
      throw new DesktopHostUncleanExitError(`desktop update: Host did not complete graceful task teardown (exit ${String(child.exitCode)}, signal ${String(child.signalCode)}, shutdown acknowledged ${String(this.shutdownCompleted)}, graceful deadline exceeded ${String(!graceful)})`)
    }
```

</details>

**依据 20 · 源码核查**：[dsh-plugin-desktop-beta/src/host/index.ts:88-99](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/host/index.ts#L88-L99)

真实Host shutdown callee/ack。

<details>
<summary>查看原文（12行）</summary>

```text
  let stopping: Promise<void> | undefined
  const accountWatch = new AbortController()
  const stop = (): Promise<void> => stopping ??= (async () => {
    const end = hostOperation('host', 'shutdown')
    clearInterval(memory)
    accountWatch.abort()
    const running = await application.catch(() => undefined)
    try { await running?.shutdown.shutdown(0); end() } catch (error) { end(error); throw error }
    await send({ type: 'shutdown-complete' })
    if (process.connected) process.disconnect()
    process.exit(0)
  })()
```

</details>

**依据 21 · 源码核查**：[dsh-plugin-desktop-beta/src/update-installer.ts:135-169](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/update-installer.ts#L135-L169)

stage/launch实际条件与Mac child/mainPID。

<details>
<summary>查看原文（35行）</summary>

```text
  async stage(): Promise<void> {
    const prepared = this.prepared
    if (!prepared) throw new Error('No prepared Next update')
    if (this.options.platform === 'win32') return
    if (this.nativeReady) return
    if (!prepared.bundle || !prepared.installed || !prepared.directory) throw new Error('No prepared Next update')
    const stat = await lstat(prepared.bundle)
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Prepared Next application bundle is unavailable')
    await access(dirname(prepared.installed), constants.W_OK)
    await access(prepared.installed, constants.W_OK)
    this.nativeReady = true
  }
  /** Called after the Host and windows have finished shutting down. */
  async launch(): Promise<void> {
    if (this.options.platform === 'darwin') {
      const prepared = this.prepared
      if (!this.nativeReady || !prepared?.bundle || !prepared.installed || !prepared.directory) throw new Error('No prepared update installer')
      const zh = (this.options.language?.() ?? 'en').toLowerCase().startsWith('zh')
      const message = zh ? `正在更新 DSH Desktop Beta 至 ${prepared.version}，请稍候…` : `Updating DSH Desktop Beta to ${prepared.version}, please wait…`
      await new Promise<void>((resolve, reject) => {
        const child = spawn('/bin/sh', ['-c', MAC_UPDATE_SCRIPT], {
          detached: true, stdio: 'ignore', shell: false, cwd: '/',
          env: {
            ...process.env,
            DSH_UPDATE_PID: String(process.pid),
            DSH_UPDATE_STAGED: prepared.bundle!,
            DSH_UPDATE_INSTALLED: prepared.installed!,
            DSH_UPDATE_DIR: prepared.directory!,
            DSH_UPDATE_TITLE: 'DSH Desktop Beta',
            DSH_UPDATE_MESSAGE: message,
            DSH_UPDATE_UI_SCRIPT: MAC_PROGRESS_UI_SCRIPT,
          },
        })
        child.once('error', reject)
        child.once('spawn', () => { child.off('error', reject); child.on('error', this.options.log); child.unref(); resolve() })
```

</details>

#### 缺口

- 真实备份还原/外部写者/权限、安装签名/脚本回滚和全进程/资源退出未验
  **影响**：只认stopped-owned Host的局部可恢复组织，不用备份/清理状态支持主数据迁移或不干净退出后安全更新
  **进一步探讨**：后续可弃置home做外链/断链/Windows fallback/途中写/复制失败和退出超时/更新模拟，读回恢复副本及旧Host；涉及真实安装先另审完整链。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何限制首次试用并算清成本和效果？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

仅熟悉本地Agent/配置且想减少启动维护的人，在独立OS账户/可弃置环境和明确全新beta数据目录试用一次本地任务。启动前核版本/通道、实际home/source和profile，保持browserAccess=false/loopback、remoteControl/market=false，不导入主profile/生产凭据、不触发内置更新安装。默认目录是~/.dsh-beta，legacy DSH_DESKTOP_NEXT_HOME仅在无应用内选择时生效，不能只设变量就以为隔离；必要时直接用新账户避免旧选择。模型/网络数据授权及预算另管，桌面壳不封顶Host工具与第三方费用。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配beta构建/发布与平台 | 本项试用必需 | 当前beta2.0.21-beta.1与pin0.2.2-alpha.2；Electron声明44.7.0、Node ^22.19或>=24，构建lib/Market资产 | 未验发布签名/实际安装；缺构建入口先退出，stable/next不自动有同实现/数据契约 |
| 正确独立home/profile | 必需 | 实际home/source、profile bundles，允许ensure创建/迁移 | 持久选择可覆盖env；主数据/其他writer不明先停，不以通道名当隔离 |
| 模型/账号/工具权限 | 做Agent任务必需 | 上游及插件自己的provider、凭据、网络/OS授权 | root不是新Agent，window sandbox非其OS权限；无授权/预算则只核本地壳，不验证真实任务 |
| 本地状态/磁盘/退出 | 持久和恢复必需 | Electron/Host/日志、备份外部空间、物理停进程与读回 | X可隐藏托盘；多写者/链接/半途退出和外部任务另核，备份非全自包含保证 |
| 浏览器/LAN/远控/市场 | 仅选用必需，试验关闭 | 显式开关、Host能力、网络/证书/第三方治理 | 有局部gate和旧browser流关闭但非全部自建端点/任务撤回，不据此开公网 |
| 更新服务/安装器 | 仅更新相关 | packaged Mac/Win默认定时检查、用户下载/安装 | 检查存在外联；签名/完整脚本/不干净handoff未知，不在试验重要任务时触发 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备独立环境 | 用户/管理员核beta包/来源，新账户或确认无旧choice的全新home，先保恢复副本 | 状态展示真实home/profile/版本，出现主数据路径或未知权限立即停 |
| 初始启动 | 用户完成/跳过向导前看实际选择，保持私有开关/功能默认关闭，必要时安全模式 | 区分原生壳、Host ready和任务正确；profile ensure会写，非只读看界面 |
| 一项无敏感任务 | 用户配置授权的临时模型/素材，在可弃置目录由上游Agent执行并独立验产物 | 正确profile/路径与结果，窗口ready/checkpoint不算任务通过；预算不清不发请求 |
| 撤销/备份/恢复 | 用户显式关browser测试矩阵后保持关闭；无其他writer时备份并在另一可弃置位置核外链/可读回/还原 | 不拿partial不存在或成功dialog当完全可还原；失败先核原home与部分输出，不重复覆盖 |
| 退出 | 用户显式退出菜单，不只按X；管理员核Host/相关任务/网络，再保必要成果/清测试账户与凭据 | 有超时/失败或外部资源不明人工停并对账，内置更新和主数据迁移延后另审 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Electron/固定runtime/构建或安装包、独立磁盘/模型环境，金额未知 | 核通道、home选择、profile/签名来源/模型权限和向导，工时未知 | 源码未执行，实际平台安装/Node兼容和首启减负未测 |
| 持续使用 | Electron+Host常驻、模型/插件网络与日志、更新检查/可选下载 | 插件/版本维护、授权/备份与独立任务复核 | 关窗可仍跑，浏览器默认关闭不等完全离线；资源峰值/TCO/净节时未知 |
| 失败恢复 | 备用home/备份/临时safe数据、重启/可能重复请求 | 区分准备/Host/renderer、查退出/副作用、外链与多写者/还原验证 | owned cleanup/partial有措施，非全事务或孙进程/网络回滚；失败费用未知 |
| 退出/更新扩展 | 进程尾资源/第三方调用、可选安装/缓存与备份保留 | 明确quit、核Host/任务，另审native更新/签名/迁移及敏感备份 | 退出timeout不必然阻installer handoff；不凭strict helper名称给安全结论 |

| 效果 | 当前材料支持 | 未证明/验收条件 |
|---|---|---|
| 桌面组织 | 原生壳/向导、独立Host/目录profile及恢复展示 | 实际开箱成功、相对Web节时与所有插件兼容未测 |
| 访问载体 | 能力/owner frame/文档复核、普通browser关旧流、默认私有 | 非全部RPC/无access直启/恶意插件/OS工具隔离，LAN公网全链未审 |
| 备份/恢复 | 停owned Host、partial改名/清理、局部repair锁/日志与checkpoint | 非所有writer一致、自包含外链/全数据无损恢复或凭据加密保证 |
| 退出/更新 | Host IPC/TERM/KILL/等待、owned update dispose/用户下载确认 | 不干净handoff仍可能发生，真实签名/安装/全部任务停与费用未知 |

对照上游Web在同模型/插件/任务下的正确启动、切错profile、恢复分钟、常驻资源和总人工成本；若只增加桌面维护/迁移风险而没减少配置恢复，就不扩到主数据。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin-desktop-beta/package.json:264-268](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/package.json#L264-L268)

声明Electron44.7.0，不是实际运行版本。

```text
    "clsx": "^2.1.1",
    "diff": "^9.0.0",
    "electron": "44.7.0",
    "electron-builder": "26.15.7",
    "extract-zip": "2.0.1",
```

**依据 2 · 源码核查**：[dsh-plugin-desktop-beta/src/data-directory.ts:12-29](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/data-directory.ts#L12-L29)

真实隔离变量/默认与location根。

<details>
<summary>查看原文（18行）</summary>

```text
export const DATA_DIRECTORY_VARIABLE = 'DSH_DESKTOP_NEXT_HOME'
const LOCATION_FILE = 'desktop-next-location.json'
const LAST_HOME_FILE = 'desktop-next-last-home.json'

export type DataDirectorySource = 'desktop' | 'environment' | 'default'

export interface DataDirectoryLocation {
  home: string
  source: DataDirectorySource
  /** The directory used without an in-app choice: the variable when set, otherwise the default. */
  fallback: string
  error?: string
}

export function defaultDataDirectory(userHome = homedir()): string { return join(userHome, '.dsh-beta') }

export function dataDirectoryLocationRoot(packaged: boolean, appData: () => string, packageRoot: string): string {
  return packaged ? join(appData(), 'DSH Desktop Beta', 'home') : join(packageRoot, '.desktop-next', 'home')
```

</details>

**依据 3 · 源码核查**：[dsh-plugin-desktop-beta/src/data-directory.ts:45-53](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/data-directory.ts#L45-L53)

持久选择优先。

```text
export function readDataDirectory(locationRoot: string, environmentHome?: string, userHome?: string): DataDirectoryLocation {
  const fallback = fallbackDirectory(environmentHome, userHome)
  const source = environmentHome ? 'environment' : 'default'
  try {
    const home = readHome(dataDirectoryLocationFile(locationRoot))
    if (home === undefined) return { home: fallback, source, fallback }
    privateDirectory(home)
    return { home, source: 'desktop', fallback }
  } catch (error) { return { home: fallback, source, fallback, error: String(error) } }
```

**依据 4 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-contract.ts:42-54](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-contract.ts#L42-L54)

普通/safe偏好默认。

<details>
<summary>查看原文（13行）</summary>

```text
export const DEFAULT_PREFERENCES: Readonly<DesktopPreferences> = Object.freeze({
  closeToTray: true, macosMaterial: 'transparent', windowsMaterial: 'off', linuxMaterial: 'off',
  browserAccess: false, networkExposure: 'loopback', port: 0, lanPort: 0, logLevel: 'info', developerLogging: false,
  sidebarFooterCompat: true, sidebarFooterBalanced: true, notifications: true, turnCompleted: true, turnFailed: true, jobCompleted: false, jobFailed: false,
  scheduleCompleted: true, scheduleFailed: true,
})

/** Fixed startup defaults matching Beta's disposable Safe Mode settings. */
export const SAFE_MODE_PREFERENCES: Readonly<DesktopPreferences> = Object.freeze({
  ...DEFAULT_PREFERENCES, macosMaterial: 'off', windowsMaterial: 'off', linuxMaterial: 'off',
  browserAccess: false, networkExposure: 'loopback', port: 0, lanPort: 0, logLevel: 'info', developerLogging: false,
  sidebarFooterCompat: true, sidebarFooterBalanced: true, notifications: false, turnCompleted: false, turnFailed: false, jobCompleted: false, jobFailed: false,
  scheduleCompleted: false, scheduleFailed: false,
```

</details>

**依据 5 · 源码核查**：[dsh-plugin-desktop-beta/src/profiles.ts:26-28](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/profiles.ts#L26-L28)

新profile扩展默认。

```text
export interface Features { remoteControl: boolean; market: boolean; dshMarket?: boolean; officialMarket?: boolean }
export interface OnboardingChoices { features: Features; computerUse: boolean }
export const DEFAULT_FEATURES: Readonly<Features> = { remoteControl: false, market: false }
```

**依据 6 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:341-344](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L341-L344)

X和退出不同。

```text
    window.on('close', event => {
      if (!quitting && runtime.preferences.closeToTray && native.available) { event.preventDefault(); window.hide() }
      else if (!quitting) { event.preventDefault(); app.quit() }
    })
```

**依据 7 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:974-997](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L974-L997)

备份会中断/恢复当前工作。

<details>
<summary>查看原文（24行）</summary>

```text
async function backupDataDirectory(): Promise<void> {
  const owner = raiseDialogOwner()
  const options: OpenDialogOptions = { title: t('选择备份保存位置', 'Choose where to save the backup'), properties: ['openDirectory', 'createDirectory'] }
  const choice = await (owner === undefined ? dialog.showOpenDialog(options) : dialog.showOpenDialog(owner, options))
  const parent = choice.canceled ? undefined : choice.filePaths[0]
  if (!parent || !isAbsolute(parent)) return
  const destination = join(parent, backupDirectoryName(home))
  try { assertBackupLocation(home, destination) } catch { throw new Error(t('请选择当前数据目录以外的位置。', 'Choose a location outside the current data directory.')) }
  if (!await confirmed(t('备份当前数据目录？', 'Back up the current data directory?'),
    t(`备份位置：${destination}\n复制期间工作环境会暂停，正在运行的任务会中断，完成后自动恢复。electron-user-data 中的窗口和浏览器缓存不会备份。`,
      `Backup location: ${destination}\nThe environment pauses while copying, interrupting running tasks, and resumes afterwards. Window and browser caches in electron-user-data are not included.`))) return
  rendererRecovery?.stop()
  await recoveryStopping
  let failure: Error | undefined
  // The taskbar or Dock shows the copy is running while the Host, and with it the window content, is down.
  const progress = (value: number): void => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setProgressBar(value) }
  progress(2)
  try {
    await runtime.restart(async () => {
      try { await copyDataDirectory(home, destination) } catch (error) { failure = error instanceof Error ? error : new Error(String(error)) }
    })
  } finally { progress(-1) }
  await reloadMain()
  if (failure) throw new Error(t('备份未完成：', 'Backup failed: ') + failure.message)
```

</details>

**依据 8 · 源码核查**：[dsh-plugin-desktop-beta/src/data-backup.ts:22-74](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/data-backup.ts#L22-L74)

实际保真/链接范围。

<details>
<summary>查看原文（53行）</summary>

```text
export function assertBackupLocation(home: string, destination: string): void {
  if (contains(resolve(home), resolve(destination))) throw new Error('Choose a backup location outside the current data directory')
}

/**
 * Copy files, directories and links without following links. Links into the data directory are
 * retargeted into the copy, so the backup never depends on the original; on Windows, directory
 * links become junctions, which need no privilege. The copy is written beside the destination
 * under a `.partial` name and renamed only when complete, so an interrupted backup is never
 * mistaken for a whole one; a failed copy removes it.
 */
export async function copyDataDirectory(source: string, destination: string): Promise<void> {
  const from = resolve(source), to = resolve(destination)
  assertBackupLocation(from, to)
  if (await lstat(to).then(() => true, () => false)) throw new Error(`Backup destination already exists: ${to}`)
  const partial = `${to}.partial`
  await mkdir(partial, { mode: 0o700 })
  try {
    await copyEntries(from, partial, to, from, to)
    await rename(partial, to)
  } catch (error) {
    await rm(partial, { recursive: true, force: true })
    throw error
  }
}

/** `written` is where an entry is copied now; `final` is where it lives after the rename. */
async function copyEntries(directory: string, written: string, final: string, from: string, to: string): Promise<void> {
  for (const name of await readdir(directory)) {
    if (directory === from && SKIPPED.has(name)) continue
    const path = join(directory, name), copy = join(written, name)
    const info = await lstat(path)
    if (info.isSymbolicLink()) await copyLink(path, copy, join(final, name), from, to)
    else if (info.isDirectory()) {
      await mkdir(copy, { mode: (info.mode & 0o777) | 0o700 })
      await copyEntries(path, copy, join(final, name), from, to)
    } else if (info.isFile()) await copyFile(path, copy, COPY_MODE)
    // Sockets, pipes and devices belong to running processes, not to the data.
  }
}

async function copyLink(path: string, copy: string, final: string, from: string, to: string): Promise<void> {
  const link = await readlink(path)
  const resolved = resolve(dirname(path), link)
  const target = !contains(from, resolved) ? resolved : isAbsolute(link) ? join(to, relative(from, resolved)) : link
  if (process.platform !== 'win32') { await symlink(target, copy); return }
  const directory = await stat(path).then(info => info.isDirectory(), () => undefined)
  if (directory === true) { await symlink(resolve(dirname(final), target), copy, 'junction'); return }
  try { await symlink(target, copy, 'file') } catch {
    // File links need Developer Mode on Windows, so keep the content; a dangling link has none.
    if (directory === false) await copyFile(path, copy, COPY_MODE)
  }
}
```

</details>

**依据 9 · 源码核查**：[dsh-plugin-desktop-beta/src/updates.ts:68-86](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/updates.ts#L68-L86)

默认更新检查的外联条件。

<details>
<summary>查看原文（19行）</summary>

```text
  start(): void {
    if (!this.options.packaged || !['darwin', 'win32'].includes(this.options.platform) || this.timer || this.disposed) return
    void this.initializeCache().catch(this.options.log)
    const poll = (): void => {
      if (this.disposed) return
      if (['idle', 'current', 'error'].includes(this.state.phase)) void this.check(true)
      this.timer = setTimeout(poll, 6 * 60 * 60_000); this.timer.unref()
    }
    this.timer = setTimeout(poll, 30_000); this.timer.unref()
  }
  private run(task: (signal: AbortSignal) => Promise<void>): Promise<void> {
    if (this.disposed) return Promise.resolve()
    if (this.operation) return this.operation
    this.controller = new AbortController()
    const signal = this.controller.signal
    this.operation = (async () => {
      try { await this.initializeCache(); signal.throwIfAborted(); await task(signal) }
      catch (error) { if (!signal.aborted) { this.options.log(error); this.set({ phase: 'error', error: 'download' }) } }
    })().finally(() => { this.operation = undefined; this.controller = undefined })
```

</details>

**依据 10 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1277-1295](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1277-L1295)

退出timeout与installer路径。

<details>
<summary>查看原文（19行）</summary>

```text
  // Bound the whole shutdown, including cleanup before Host termination starts.
  let finished = false
  const timeout = setTimeout(() => {
    if (finish()) {
      runtime.diagnostics.record({ source: 'electron', event: 'shutdown.timeout', level: 'error', message: 'Shutdown exceeded five seconds', fields: { pending: JSON.stringify(runtime.diagnostics.pendingOperations()) } })
      void completeShutdown(false)
    }
  }, DESKTOP_SHUTDOWN_TIMEOUT_MS)
  timeout.unref()
  function finish(): boolean {
    if (finished) return false
    finished = true
    clearTimeout(timeout)
    return true
  }
  async function completeShutdown(clean: boolean): Promise<void> {
    if (installingUpdate) {
      const installerDone = runtime.diagnostics.operation('electron', 'installer.launch')
      try { await updateInstaller.launch(); installerDone() }
```

</details>

#### 缺口

- 实际用户需求、各平台安装/模型和恢复效果、资源及现金/TCO未测
  **影响**：仅独立无敏感beta小样，不能据source提升为主数据/公网/内置更新生产推荐
  **进一步探讨**：固定隔离任务/故障对照Web，核home/进程/成果/外链与费用；任一关键事实或回退不可识别即保持观察。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 已有诊断后，还应验证什么而不是再造看板？

**研究主题**：新假设与验证

#### 完整回答

旧稿设想把profile/generation和恢复检查点做用户诊断收据，但当前beta已有原生recovery、failureStage/exit、operation日志、memory/Host事件和checkpoint。不能把诊断入口本身再计创新。候选收窄到本轮整目录backup链的可还原验收：partial完成只是复制提交，未独立证明外链/跳过项/Windows fallback与恢复后正确profile/任务可用；不把未全审其他恢复工具理解成全应用绝无相同能力。

先查现有诊断/备份/支持导出是否已有足够事实，再做最小原组件增强或人工清单：备份给出来源home/profile/channel、源是否已停、包含/跳过项与外链依赖、Windows退化/未知，恢复到另一受控位置后读回并启动最小无敏感任务，而非只看backup dialog/checkpoint。哈希/签名和被控模型/外部任务另列，不把文件复制回执承诺成全部资源退出。

最小对照在可弃置home构造普通文件/配置、内部和外部链接、断链、复制途中失败/外部writer、Host退出不确认和不同data choice；比较当前备份+人工手册、明确外链清单/恢复核验的小补丁与上游Web手工备份。记录误判“可恢复”、恢复后正确home/profile/制品、数据/外部依赖遗漏、恢复分钟、额外读盘/停机。更新timeout后handoff另用假installer/故障演练，不把它和真包安装混作一项；本轮全部未执行。

如果现有日志/原生助手和一份人工还原清单足够，就只补原组件/文档，不做独立诊断平台。只有真实用户持续误判备份/退出，轻量核验稳定减少遗漏且不造成更大停机/隐私/维护成本，才考虑可复用方向；否则否定，不能从Electron复杂度或恢复按钮推出需求/付费。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:250-256](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L250-L256)

现有原生恢复/日志/checkpoint，非未来新量。

```text
    if (!this.safeMode) try { features = this.profiles.features(this.selected) } catch (error) { unreadable(error) }
    try { const saved = this.recovery.latest(this.selected); if (saved) checkpoint = { created: saved.created } } catch { /* Recovery remains usable without backups. */ }
    return { selected: this.selected, profiles, unavailableProfiles: profiles.filter(name => !this.profiles.selectable(name)), features, preferences: { ...this.preferences }, phase: this.recoveryMode ? 'recovery' : !this.auth && failure ? 'error' : this.backend.state.phase,
      busy: this.busy, failure, ...(failureStage === undefined ? {} : { failureStage }), ...(this.failureExit === undefined ? {} : { failureExit: this.failureExit }),
      safeMode: this.safeMode, home: this.options.home,
      browserUrl: this.auth && this.preferences.browserAccess && !this.safeMode ? new URL(this.auth.url).origin : null,
      lan: this.lan?.snapshot() ?? null, checkpoint, logs: this.diagnostics.snapshot() }
```

**依据 2 · 源码核查**：[dsh-plugin-desktop-beta/src/desktop-runtime.ts:350-357](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/desktop-runtime.ts#L350-L357)

当前checkpoint只在启动后尝试。

```text
          }
          if (!this.safeMode) {
            try { this.recovery.checkpoint(this.selected) } catch (error) { this.diagnostics.append(`Recovery checkpoint: ${String(error)}`, 'warn') }
          }
          started()
          // From here a Host failure stops a running Desktop rather than its startup.
          this.hostStage = 'host-runtime'
          this.diagnostics.append(`Host ready: ${profile}${this.safeMode ? ' (safe mode)' : ''}`)
```

**依据 3 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:974-1004](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L974-L1004)

备份活动链/可见成功。

<details>
<summary>查看原文（31行）</summary>

```text
async function backupDataDirectory(): Promise<void> {
  const owner = raiseDialogOwner()
  const options: OpenDialogOptions = { title: t('选择备份保存位置', 'Choose where to save the backup'), properties: ['openDirectory', 'createDirectory'] }
  const choice = await (owner === undefined ? dialog.showOpenDialog(options) : dialog.showOpenDialog(owner, options))
  const parent = choice.canceled ? undefined : choice.filePaths[0]
  if (!parent || !isAbsolute(parent)) return
  const destination = join(parent, backupDirectoryName(home))
  try { assertBackupLocation(home, destination) } catch { throw new Error(t('请选择当前数据目录以外的位置。', 'Choose a location outside the current data directory.')) }
  if (!await confirmed(t('备份当前数据目录？', 'Back up the current data directory?'),
    t(`备份位置：${destination}\n复制期间工作环境会暂停，正在运行的任务会中断，完成后自动恢复。electron-user-data 中的窗口和浏览器缓存不会备份。`,
      `Backup location: ${destination}\nThe environment pauses while copying, interrupting running tasks, and resumes afterwards. Window and browser caches in electron-user-data are not included.`))) return
  rendererRecovery?.stop()
  await recoveryStopping
  let failure: Error | undefined
  // The taskbar or Dock shows the copy is running while the Host, and with it the window content, is down.
  const progress = (value: number): void => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setProgressBar(value) }
  progress(2)
  try {
    await runtime.restart(async () => {
      try { await copyDataDirectory(home, destination) } catch (error) { failure = error instanceof Error ? error : new Error(String(error)) }
    })
  } finally { progress(-1) }
  await reloadMain()
  if (failure) throw new Error(t('备份未完成：', 'Backup failed: ') + failure.message)
  runtime.diagnostics.append(`Backed up the data directory to ${destination}`)
  const done = raiseDialogOwner()
  const notice = { type: 'info' as const, title: 'DSH Desktop Beta', message: t('数据目录已备份', 'Data directory backed up'), detail: destination,
    buttons: [t('在文件夹中显示', 'Show in folder'), t('完成', 'Done')], defaultId: 1, cancelId: 1, noLink: true }
  void (done === undefined ? dialog.showMessageBox(notice) : dialog.showMessageBox(done, notice))
    .then(result => { if (result.response === 0) shell.showItemInFolder(destination) })
    .catch(error => runtime.diagnostics.append(String(error), 'warn'))
```

</details>

**依据 4 · 源码核查**：[dsh-plugin-desktop-beta/src/data-backup.ts:22-74](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/data-backup.ts#L22-L74)

partial和真实外链/Windows条件。

<details>
<summary>查看原文（53行）</summary>

```text
export function assertBackupLocation(home: string, destination: string): void {
  if (contains(resolve(home), resolve(destination))) throw new Error('Choose a backup location outside the current data directory')
}

/**
 * Copy files, directories and links without following links. Links into the data directory are
 * retargeted into the copy, so the backup never depends on the original; on Windows, directory
 * links become junctions, which need no privilege. The copy is written beside the destination
 * under a `.partial` name and renamed only when complete, so an interrupted backup is never
 * mistaken for a whole one; a failed copy removes it.
 */
export async function copyDataDirectory(source: string, destination: string): Promise<void> {
  const from = resolve(source), to = resolve(destination)
  assertBackupLocation(from, to)
  if (await lstat(to).then(() => true, () => false)) throw new Error(`Backup destination already exists: ${to}`)
  const partial = `${to}.partial`
  await mkdir(partial, { mode: 0o700 })
  try {
    await copyEntries(from, partial, to, from, to)
    await rename(partial, to)
  } catch (error) {
    await rm(partial, { recursive: true, force: true })
    throw error
  }
}

/** `written` is where an entry is copied now; `final` is where it lives after the rename. */
async function copyEntries(directory: string, written: string, final: string, from: string, to: string): Promise<void> {
  for (const name of await readdir(directory)) {
    if (directory === from && SKIPPED.has(name)) continue
    const path = join(directory, name), copy = join(written, name)
    const info = await lstat(path)
    if (info.isSymbolicLink()) await copyLink(path, copy, join(final, name), from, to)
    else if (info.isDirectory()) {
      await mkdir(copy, { mode: (info.mode & 0o777) | 0o700 })
      await copyEntries(path, copy, join(final, name), from, to)
    } else if (info.isFile()) await copyFile(path, copy, COPY_MODE)
    // Sockets, pipes and devices belong to running processes, not to the data.
  }
}

async function copyLink(path: string, copy: string, final: string, from: string, to: string): Promise<void> {
  const link = await readlink(path)
  const resolved = resolve(dirname(path), link)
  const target = !contains(from, resolved) ? resolved : isAbsolute(link) ? join(to, relative(from, resolved)) : link
  if (process.platform !== 'win32') { await symlink(target, copy); return }
  const directory = await stat(path).then(info => info.isDirectory(), () => undefined)
  if (directory === true) { await symlink(resolve(dirname(final), target), copy, 'junction'); return }
  try { await symlink(target, copy, 'file') } catch {
    // File links need Developer Mode on Windows, so keep the content; a dangling link has none.
    if (directory === false) await copyFile(path, copy, COPY_MODE)
  }
}
```

</details>

**依据 5 · 源码核查**：[dsh-plugin-desktop-beta/src/main.ts:1277-1295](https://github.com/anywhere-labs/dsh-desktop/blob/0e249397f8ae66dbb674ba85570f59bd0ecab14a/dsh-plugin-desktop-beta/src/main.ts#L1277-L1295)

退出/更新未知是独立核验项。

<details>
<summary>查看原文（19行）</summary>

```text
  // Bound the whole shutdown, including cleanup before Host termination starts.
  let finished = false
  const timeout = setTimeout(() => {
    if (finish()) {
      runtime.diagnostics.record({ source: 'electron', event: 'shutdown.timeout', level: 'error', message: 'Shutdown exceeded five seconds', fields: { pending: JSON.stringify(runtime.diagnostics.pendingOperations()) } })
      void completeShutdown(false)
    }
  }, DESKTOP_SHUTDOWN_TIMEOUT_MS)
  timeout.unref()
  function finish(): boolean {
    if (finished) return false
    finished = true
    clearTimeout(timeout)
    return true
  }
  async function completeShutdown(clean: boolean): Promise<void> {
    if (installingUpdate) {
      const installerDone = runtime.diagnostics.operation('electron', 'installer.launch')
      try { await updateInstaller.launch(); installerDone() }
```

</details>

#### 缺口

- 可还原回执/清单的增量效果、完整既有诊断功能和真实需求经济性未知
  **影响**：只是待证伪方向，不宣称现有备份已坏/增强已实现或有独立市场
  **进一步探讨**：先排查已有功能，再隔离对照人工清单；减少不了误判/恢复工时或增加停机与维护则否定。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
