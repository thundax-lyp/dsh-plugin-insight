# DSH Desktop

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a8b9865](https://github.com/anywhere-labs/dsh-desktop/tree/a8b98656fd8bcaa888bcc63489b2ecda68a61084)

<!-- BEGIN META -->
[![GitHub ★ 34,996](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34%2C996&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anywhere-labs/dsh-desktop)
<!-- END META -->

> **功能**：将 DeepSeek Harness 的本地 Web、Host 与插件系统整合进桌面窗口，提供工作配置、终端、更新与恢复入口。

> **亮点**：组合独立Host认证、本代窗口/健康恢复与失败后数据操作，用户可看到并控制桌面生命周期；配置checkpoint、整根备份与切数据根有不同明确实现，见 [Q02](#research-q02)至 [Q04](#research-q04)。

> **主要限制**：健康不是任务成功，renderer sandbox不是Host执行隔离；强杀不撤外部效果，配置恢复非会话回滚，多文件恢复非共同事务，整根备份仍有外链/排除边界，见 [Q03](#research-q03)/[Q04](#research-q04)。

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
  - [Q01 · 根产品与多个桌面通道是什么关系，上游能力怎样归因？](#detail-section-11)
  - [Q02 · 从Electron到可用工作窗口的真实启动与就绪是什么？](#detail-section-12)
  - [Q03 · 窗口、IPC和浏览器门禁保护到哪里，是否等于执行沙箱？](#detail-section-13)
  - [Q04 · 停止、配置恢复、整目录备份与换目录分别改变什么？](#detail-section-14)
  - [Q05 · 怎样试用及退出，哪些成本尚不知道？](#detail-section-15)
  - [Q06 · 独有增量与可证伪方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地DSH用户希望桌面管理Host/窗口与工作配置，可用新数据根的小任务核行为；Agent能力属上游，见 [Q01](#research-q01)。

已有DSH CLI/Web和手工管理进程/配置。桌面提供生命周期和本机操作入口，不是重新提供模型推理或改变所有工具权限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 原生桌面 | 上游Web与Host组合 | 根多通道，本次NEXT代表 |
| 进程管理 | 启停/错误/健康恢复 | ready非任务完成 |
| 本机认证 | token/cookie/IPC代际 | 非OS/模型工具权限保证 |
| 配置还原 | 三文件hash核验后逐写 | 共享会话不回滚 |
| 数据备份 | 停Host后partial复制 | 排除Chromium/外链另核 |
| 选择数据根 | 明示归属并重启 | 不自动迁移旧数据 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 缺失/边界 |
| --- | --- | --- |
| 平台NEXT成品/Electron/Node | 原生窗口和子Host | 发行hash/签名未验 |
| DSH0.2.2-rc.1 | Agent/Web/插件上游 | 不能将其他版本结论导入 |
| 模型与权限 | 实际任务 | 桌面不提供免费推理 |
| home/profile/本地凭据 | 配置/状态归属 | 换根不搬数据 |
| 可写磁盘/备份 | 配置和整根复制 | 外链/排除非完整独立副本 |
| 本机token/普通browser设置 | Web通路 | 不等工具或OS授权 |

#### 步骤

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 固定NEXT/新home/脱敏任务 | 不导唯一生产数据 |
| 限范围 | 关browser/LAN/远控扩展 | 不据此称整部署只读 |
| 启动 | 查home/profile/Host pid/界面 | ready分层、非任务验收 |
| 一任务 | 单模型只读问题核答案 | Agent能力上游另验 |
| 备份 | 停Host复制副本并离线原目录核 | 看外链/排除和配置范围 |
| 退出 | 停任务/Host，核pid和日志 | 回CLI/Web/保留原件 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工 | 未知/限制 |
| --- | --- | --- | --- |
| 首次 | 安装包/运行时/备份磁盘 | 选择数据根/模型/权限 | 未验成品与耗时 |
| 持续 | Electron+Host/模型/历史 | 更新/插件/任务复核 | 未测性能或净省费 |
| 失败 | 重试/partial副本/外部影响 | 进程/日志/实际目标核 | 强杀非回滚 |
| 退出 | 原文/凭据/导出备份 | 停进程/撤权限/保留清理 | 数据外发不可收回 |

#### 效果

| 项目 | 当前支持 | 未确认 |
| --- | --- | --- |
| 本机生命周期 | 独立Host/认证/健康恢复 | 实际跨平台成功率 |
| 主窗口通路 | sender/代际/marker | 全部IPC/guest与工具安全 |
| 配置恢复 | 三文件hash预校/逐写 | 跨文件事务/任务回滚 |
| 数据备份 | partial→rename/链接策略 | 外链数据和完整离线还原 |
| 用户效率 | 本机操作入口 | 同任务节时与采用需求 |

> **思考**：健康不是任务成功，renderer sandbox不是Host执行隔离；强杀不撤外部效果，配置恢复非会话回滚，多文件恢复非共同事务，整根备份仍有外链/排除边界，见 [Q03](#research-q03)/[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：组合独立Host认证、本代窗口/健康恢复与失败后数据操作，用户可看到并控制桌面生命周期；配置checkpoint、整根备份与切数据根有不同明确实现，见 [Q02](#research-q02)至 [Q04](#research-q04)。

代际窗口/Host认证、stop失败保留所有权、有界renderer恢复与partial备份有实现；应明确健康/业务、配置/整根/换根、单文件原子/整事务以及强杀/回滚差异，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

健康不是任务成功，renderer sandbox不是Host执行隔离；强杀不撤外部效果，配置恢复非会话回滚，多文件恢复非共同事务，整根备份仍有外链/排除边界，见 [Q03](#research-q03)/[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只选目标平台固定NEXT成品、新home与脱敏只读任务，先关外部浏览器/LAN/远控并核pid/结果/退出；数据归属或恢复不明就停并保留原件回CLI/Web，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根为桌面client/private workspace且无统一version；本次代表NEXT2.0.22-next/DSH0.2.2-rc.1。定向核独立Host/认证转发/IPC/健康/停止与备份恢复；stable2.0.18/beta2.0.22-beta.1及其他社区组件未完整验收。未运行/安装或实际恢复。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-desktop-next/package.json、dsh-desktop-next/src/backend-controller.ts、dsh-desktop-next/src/data-backup.ts、dsh-desktop-next/src/desktop-browser-access.ts、dsh-desktop-next/src/desktop-runtime.ts、dsh-desktop-next/src/host-process.ts、dsh-desktop-next/src/host/index.ts、dsh-desktop-next/src/main.ts、dsh-desktop-next/src/recovery.ts、dsh-desktop-next/src/renderer-recovery.ts、dsh-desktop-next/src/web-document.ts、dsh-desktop-next/src/webserver.ts、dsh-plugin-desktop-beta/package.json、dsh-plugin-desktop/package.json、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根身份/README、三桌面包版本；定向NEXT main/desktop-runtime/backend-controller/host-process与host入口、Web auth/forward/token门禁、renderer健康、recovery三配置/整根data-backup与位置切换。未运行/成品签名一致/上游Agent全核/stable-beta完整链/market-fabric/LAN远控终端电脑控制/全部IPC-preload-guest/真实模型和恢复实验。
- 下一步：- 下一步目标平台固定包hash，新home单脱敏任务，分记Host/界面/模型/退出状态。
- 停止失败、外链备份、配置恢复中断仅副本验证；先保留原始目录。
- 原目录离线后的还原对照与成本尚未执行。

**分析版本**

- **仓库**：[anywhere-labs/dsh-desktop](https://github.com/anywhere-labs/dsh-desktop)
- **版本号**：未声明（[固定提交 a8b9865](https://github.com/anywhere-labs/dsh-desktop/tree/a8b98656fd8bcaa888bcc63489b2ecda68a61084)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

备份范围/外链排除/配置与数据快照差别的可校验收据，用离线原目录的脱敏还原对照；无净增益或路径隐私负担抵消即放弃，见 [Q06](#research-q06)。

- 下一步目标平台固定包hash，新home单脱敏任务，分记Host/界面/模型/退出状态。
- 停止失败、外链备份、配置恢复中断仅副本验证；先保留原始目录。
- 原目录离线后的还原对照与成本尚未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 143 | 19688 | — | — | 293222 |
| .mjs | source | 73 | 10619 | 9559 | 811 | — |
| .ts | source | 579 | 93176 | 75237 | 12384 | — |
| .tsx | source | 67 | 14008 | 12977 | 418 | — |
| .ts | test | 428 | 85336 | 76239 | 3475 | — |
| .tsx | test | 3 | 2208 | 2016 | 43 | — |
| .ts | example | 1 | 158 | 122 | 17 | — |
| .mjs | example | 5 | 144 | 128 | 12 | — |
| .mjs | test | 21 | 1695 | 1453 | 123 | — |
| .js | example | 1 | 20 | 14 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 309](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=309&color=737b86&logo=github)](https://github.com/anywhere-labs/dsh-desktop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 125](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=125&color=737b86&logo=github)](https://github.com/anywhere-labs/dsh-desktop/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 81](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=81&color=737b86&logo=github)](https://github.com/anywhere-labs/dsh-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分多通道根client身份，定向核NEXT Electron→Host→认证/健康与停止、配置恢复、整根备份/换目录边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根产品与多个桌面通道是什么关系，上游能力怎样归因？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根private workspace无version，包含stable dsh-plugin-desktop 2.0.18、beta 2.0.22-beta.1、NEXT2.0.22-next及社区组件；根条目应分类桌面client，不因子包可导出插件就称根原生插件。README声明独立社区项目，不是DeepSeek官方授权产品；将上游DSH Host/Web/插件系统集成到窗口、托盘、终端、更新和工作配置。模型推理、Agent/工具/会话语义主要来自固定上游，不能把桌面界面归为重新实现Agent。

本次定向NEXT2.0.22-next实际Electron→Host→认证Web/健康/停止与数据备份；NEXT package明确experimental，依赖DSH0.2.2-rc.1。stable/beta/market/fabric完整能力和它们与NEXT发布关系未全审，不能由根收录把每包独立验收。面向不想自行管理Web启动/Host进程且愿核数据和插件的本地DSH用户，参照CLI/Web和自行Electron壳：桌面承担本地生命周期/故障入口，但用户仍负责模型/工具授权和任务结果。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-17](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/package.json#L1-L17)

根private/Node与多个workspace，无根version。

<details>
<summary>查看原文（17行）</summary>

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
    "dsh-plugin-desktop",
    "dsh-plugin-desktop-beta",
    "dsh-desktop-next",
    "dsh-community-fabric",
    "dsh-community-market"
  ],
  "resolutions": {
```

</details>

**依据 2 · 源码核查**：[dsh-plugin-desktop/package.json:1-7](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-plugin-desktop/package.json#L1-L7)

stable包版本。

```text
{
  "name": "dsh-plugin-desktop",
  "version": "2.0.18",
  "description": "DSH Desktop: an Electron shell composed as a DeepSeek Harness Cordis plugin",
  "desktopName": "dsh-desktop.desktop",
  "license": "MIT",
  "publishConfig": {
```

**依据 3 · 源码核查**：[dsh-plugin-desktop-beta/package.json:1-7](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-plugin-desktop-beta/package.json#L1-L7)

beta包版本。

```text
{
  "name": "dsh-plugin-desktop-beta",
  "version": "2.0.22-beta.1",
  "private": true,
  "description": "Desktop Beta integration for the DeepSeek Harness",
  "desktopName": "dsh-desktop-beta.desktop",
  "license": "MIT",
```

**依据 4 · 源码核查**：[dsh-desktop-next/package.json:1-17](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/package.json#L1-L17)

NEXT版本/experimental/Electron入口。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "dsh-desktop-next",
  "version": "2.0.22-next",
  "private": true,
  "description": "Experimental upstream-inspired DSH Desktop with Profiles, recovery, remote control and Community Market",
  "desktopName": "dsh-desktop-next.desktop",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/anywhere-labs/deepseek-harness-desktop.git",
    "directory": "dsh-desktop-next"
  },
  "type": "module",
  "main": "lib/main.js",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

</details>

**依据 5 · 源码核查**：[dsh-desktop-next/package.json:55-63](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/package.json#L55-L63)

NEXT固定上游DSH依赖。

```text
    "@deepseek-ai/cordis-plugin-loader": "1.1.0",
    "@deepseek-ai/cordis-plugin-timer": "1.2.0",
    "@deepseek-ai/dsh": "0.2.2-rc.1",
    "@deepseek-ai/dsh-agent": "0.2.2-rc.1",
    "@deepseek-ai/dsh-agent-default-model": "0.2.2-rc.1",
    "@deepseek-ai/dsh-agent-instructions": "0.2.2-rc.1",
    "@deepseek-ai/dsh-agent-loop": "0.2.2-rc.1",
    "@deepseek-ai/dsh-agent-preset-registry": "0.2.2-rc.1",
    "@deepseek-ai/dsh-agent-tool-presentation": "0.2.2-rc.1",
```

**依据 6 · 作者声明**：[README.md:5-17](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/README.md#L5-L17)

作者桌面定位与独立社区身份。

<details>
<summary>查看原文（13行）</summary>

```text
<h1 align="center">DSH Desktop</h1>

<p align="center">
  <strong>基于 DeepSeek Harness 构建的 Windows、macOS 和 Linux 开源桌面客户端。</strong>
</p>

<h3 align="center"><a href="https://dshdesktop.cn">一键下载，开箱即用。</a></h3>

<p align="center">
  万物皆「插件」，桌面本身也是「插件」。
</p>

<p align="center"><sub>独立的社区开源项目，与深度求索不存在隶属、合作、授权或背书关系。<br>本仓库目前无深度求索员工或 DeepSeek Harness 上游官方团队成员参与；GitHub Contributors 中显示的上游贡献者来自 fork 继承和同步的提交历史。<br>中文 · <a href="README.en.md">English</a></sub></p>
```

</details>

**依据 7 · 作者声明**：[README.md:30-38](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/README.md#L30-L38)

上游/桌面归因与平台安装自述。

```text
</p>

DSH Desktop 将 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的本地 Web UI、Host 服务和插件系统集成到原生桌面应用中。项目固定并原样运行特定上游版本；DSH Desktop 提供窗口、托盘、终端、更新和工作配置，并通过 DeepSeek Harness 提供的插件机制与上游能力组合。

<a id="run"></a>

## 下载与安装

当前正式安装包支持 Windows x64、macOS Universal 和 Linux（x64 与 arm64）。无需额外环境，下载安装，一键使用。
```

#### 缺口

- 没有比较当前CLI/Web同任务操作和维护成本，也未核发行包与源码一致。
  **影响**：只能判断NEXT代表机制，不把整个仓或安装承诺当验收。
  **进一步探讨**：固定目标平台/NEXT成品与依赖，独立数据根做一个脱敏任务并与现有Web比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从Electron到可用工作窗口的真实启动与就绪是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

runtime.start在backend controller共享一次attempt，先准备shell环境/profile；safe mode新建临时home关remoteControl/market并固定偏好，普通模式ensure所选profile。createHost每代random32字节token，指定DSH_HOME、偏好、trustedHosts和系统代理环境；HostProcess真的spawn独立Node，cwd为profile，stdio含IPC，不是renderer内直接跑Agent。Host入口配置browser access后删继承的token等环境项，运行真实runProfile并叠加runtime patch，将Webserver限制127.0.0.1，返回ctx.connection.authenticatedUrl与Web injections。继承process.env仍可能含其他秘密，删特定token不等完整环境脱敏。

父runtime限60秒等待ready，校http+127.0.0.1且必须有injections，authenticateWebHost实际fetch launch URL要求303/set-cookie，保存cookie/token在main侧；可选LAN edge失败warn不使loopback已就绪失败。profile checkpoint是Host-ready后尽力保存，失败亦warn；不等renderer已健康或数据完整。

窗口boot IPC校所属mainFrame，等待本代startup并核documentId没被替换才返回injections；renderer status亦核本代id。健康判断是documentLoaded和clientHealthy同时为真，超30秒按0/1/3秒最多三次reload，稳定60秒后重置次数。健康证明界面挂载，不证明模型可用、插件每功能或文件任务完成；backend ready也与renderer ready分层。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-desktop-next/src/desktop-runtime.ts:162-187](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/desktop-runtime.ts#L162-L187)

真实profile准备和safe mode。

<details>
<summary>查看原文（26行）</summary>

```text
  start(): Promise<void> {
    this.recoveryMode = false
    this.failure = ''
    this.failureStage = undefined
    this.failureExit = undefined
    this.failureReport = undefined
    this.actionFailure = ''
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
```

</details>

**依据 2 · 源码核查**：[dsh-desktop-next/src/desktop-runtime.ts:385-405](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/desktop-runtime.ts#L385-L405)

每代token/home/环境与Host构造。

<details>
<summary>查看原文（21行）</summary>

```text
  }

  private createHost(onFailure: (error: Error) => void) {
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
      (chunk, stream, pid) => this.diagnostics.hostChunk(chunk, stream, pid), options.onTerminal, options.onPermission, options.onPlatformSession, options.onPlatformLogin,
      input => { if (input.event === 'exit') this.diagnostics.hostClosed(input.pid); this.diagnostics.record(input) },
```

</details>

**依据 3 · 源码核查**：[dsh-desktop-next/src/host-process.ts:297-319](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/host-process.ts#L297-L319)

真正spawn独立Node与IPC。

<details>
<summary>查看原文（23行）</summary>

```text
  async start(): Promise<DesktopHostReady> {
    if (this.child !== undefined) return this.readyPromise
    const entry = this.hostEntry ?? join(this.runtimeDir, 'node_modules', '@deepseek-ai', 'dsh-desktop-host', 'lib', 'index.js')
    const child = spawn(this.node, [
      '--expose-internals',
      `--max-http-header-size=${String(MAX_HEADER_BYTES)}`,
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
    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => { this.stderr = (this.stderr + chunk).slice(-MAX_HOST_DIAGNOSTIC_CHARS); this.onLog?.(chunk, 'stderr', child.pid) })
    child.stdout?.setEncoding('utf8')
    child.stdout?.on('data', (chunk: string) => { this.onLog?.(chunk, 'stdout', child.pid) })
```

</details>

**依据 4 · 源码核查**：[dsh-desktop-next/src/host/index.ts:36-85](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/host/index.ts#L36-L85)

Host环境/loopback patch和runProfile真实调用。

<details>
<summary>查看原文（50行）</summary>

```text
  const primaryRuntime = process.argv[4]
  const home = process.env.DSH_HOME
  if (!runtimeDir || !projectDir || !home || !process.send) throw new Error('Next Host requires runtime, profile, home and IPC')
  // The Office engine runs as a native child process, so an archived payload resolves it to its unpacked copy.
  installOfficeEngineResolution(runtimeDir)
  // The Creator preset reads its skills through the Host's filesystem service, which cannot stat inside the archive.
  installAgentPresetResolution(runtimeDir)
  // The computer-use driver hands its library path to the system loader, which reads no archive.
  installCuaDriverResolution(runtimeDir)
  // The badge skill tells the model to take its PNG from the directory it announces, which shells and the Host's filesystem service cannot read inside the archive.
  installSkillBadgeResolution(runtimeDir)
  // Linux sharp must not load its native backends beside the GLib Electron links; it runs its WebAssembly build instead.
  installSharpWasmResolution(runtimeDir)
  const preferences = parsePreferences(JSON.parse(process.env.DSH_NEXT_PREFERENCES ?? '{}'))
  configureHostLogging(preferences)
  hostLog({ source: 'host', event: 'process.start', fields: { profile: basename(projectDir), node: process.version } })
  const trustedHosts = JSON.parse(process.env.DSH_NEXT_TRUSTED_HOSTS ?? '[]') as unknown
  if (!Array.isArray(trustedHosts) || trustedHosts.some(host => typeof host !== 'string')) throw new Error('Invalid Next trusted hosts')
  const systemProxy = parseSystemProxyProbe(process.env[SYSTEM_PROXY_ENV])
  configureNextBrowserAccess(process.env.DSH_NEXT_NATIVE_TOKEN, preferences.browserAccess)
  delete process.env.DSH_NEXT_NATIVE_TOKEN
  delete process.env.DSH_NEXT_PREFERENCES
  delete process.env.DSH_NEXT_TRUSTED_HOSTS
  delete process.env[SYSTEM_PROXY_ENV]
  const packageManager = bundledPnpmInvocation(runtimeDir)
  const profile = loadNextProfile(projectDir, home, NEXT_PACKAGE, packageManager)
  const runtimePatch = join(projectDir, 'desktop-next.runtime.patch.json')
  atomicJson(runtimePatch, [
    { id: 'desktop-next-webserver', config: { host: '127.0.0.1', port: preferences.port } },
    { id: 'connection', config: { trustedHosts } },
  ])
  // runProfile installs the outbound proxy policy from this environment before any plugin mounts.
  const { environment, resolution: proxy } = withSystemProxy(loadLayeredEnv('dsh-desktop-next'), systemProxy, trustedHosts as string[])
  // One line on every start, direct included: a connectivity report cannot be answered without it.
  for (const line of [proxy.summary, ...proxy.diagnostics]) process.stderr.write(`dsh-desktop-next: ${maskSecrets(line)}\n`)
  const send = (value: object): Promise<void> => new Promise((resolveSend, reject) => {
    if (!process.connected || !process.send) return resolveSend()
    process.send(value, error => error ? reject(error) : resolveSend())
  })
  // Announced before the profile starts, so a startup failure and this run's plugin operations share one run identity.
  const operations = hostOperationDiagnostics?.(send)
  const application = runProfile({
    environment, profile: basename(projectDir),
    resolvedProfile: { profile, installAnchor: NEXT_PACKAGE,
      readPatches: profilePatches => readNextProfilePatches(projectDir, home,
        [join(runtimeDir, 'host.cordis.patch.yml'), join(projectDir, 'desktop-next.cordis.patch.json'), runtimePatch], profilePatches) },
    patchFiles: [join(runtimeDir, 'host.cordis.patch.yml'), join(projectDir, 'desktop-next.cordis.patch.json'), runtimePatch], args: ['--no-open', '--port', String(preferences.port)],
    packageManager,
  })
  // Native file drags borrow only the workspace files this Host authorizes, where the followed DSH release drags
```

</details>

**依据 5 · 源码核查**：[dsh-desktop-next/src/host/index.ts:144-155](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/host/index.ts#L144-L155)

Host ready与认证URL。

<details>
<summary>查看原文（12行）</summary>

```text
  if (!stopping) installPlatformSessionPublisher(ctx, (session) => { void send({ type: 'platform-session', session }).catch(() => {}) })
  // Office skills and the workspace dependency tool need the bundled payload; a packaged Host without it fails here.
  const office = resolveOfficeConfig(runtimeDir, primaryRuntime, home)
  if (office === undefined) hostLog({ source: 'host', event: 'office.unavailable', level: 'warn', fields: { source: primaryRuntime } })
  else {
    const mounted = hostOperation('host', 'office.mount', { source: office.source })
    try { await ctx.plugin(desktopOffice, office); mounted() } catch (error) { mounted(error); throw error }
  }
  hostLog({ source: 'host', event: 'process.ready' })
  await send({ type: 'ready', url: ctx.connection.authenticatedUrl(`http://127.0.0.1:${ctx.webServer.port}`),
    injections: webIndexInjections(ctx) })
  auditHostPlugins(ctx)
```

</details>

**依据 6 · 源码核查**：[dsh-desktop-next/src/desktop-runtime.ts:410-438](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/desktop-runtime.ts#L410-L438)

60秒/URL检查/认证/可选LAN和checkpoint。

<details>
<summary>查看原文（29行）</summary>

```text
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

**依据 7 · 源码核查**：[dsh-desktop-next/src/web-document.ts:82-94](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/web-document.ts#L82-L94)

认证URL换cookie的真实303门禁。

<details>
<summary>查看原文（13行）</summary>

```text

/**
 * Exchange the Host launch URL for an authority-bound browser cookie.
 * @param url - Authenticated URL reported by the owned Host process.
 * @returns Cookie header for requests forwarded to that Host.
 */
export async function authenticateWebHost(url: string, nativeToken?: string): Promise<string> {
  const response = await fetch(url, { redirect: 'manual', ...(nativeToken ? { headers: { [NATIVE_ACCESS_HEADER]: nativeToken } } : {}) })
  const cookie = response.headers.get('set-cookie')
  await response.body?.cancel()
  if (response.status !== 303 || cookie === null) throw new Error('Desktop Host authentication failed')
  const end = cookie.indexOf(';')
  return end < 0 ? cookie : cookie.slice(0, end)
```

</details>

**依据 8 · 源码核查**：[dsh-desktop-next/src/main.ts:1250-1272](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L1250-L1272)

boot/状态的mainFrame和document generation。

<details>
<summary>查看原文（23行）</summary>

```text
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
  })
  ipcMain.handle(IPC.rendererStatus, (event, documentId: unknown, status: unknown) => {
    assertSender(event, mainWindow, APP_URL)
    if (!isDesktopRendererStatus(status)) throw new Error('Invalid renderer status')
    if (documentId !== rendererDocumentId || !documentId) return
    rendererRecovery?.report(status)
  })
  ipcMain.handle(IPC.failed, (event, message: unknown, documentId: unknown) => {
    assertSender(event, mainWindow, APP_URL)
    if (typeof message !== 'string') throw new Error('Invalid boot error')
    if (documentId !== undefined && documentId !== rendererDocumentId) return
    failRenderer(mainWindow!, new Error(message.slice(0, 4096)))
  })
```

</details>

**依据 9 · 源码核查**：[dsh-desktop-next/src/renderer-recovery.ts:19-23](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/renderer-recovery.ts#L19-L23)

恢复延迟/健康超时和稳定期。

```text
const RETRY_DELAYS_MS = [0, 1000, 3000] as const
const HEALTH_TIMEOUT_MS = 30_000
const STABLE_PERIOD_MS = 60_000

export class NextRendererRecovery {
```

**依据 10 · 源码核查**：[dsh-desktop-next/src/renderer-recovery.ts:67-108](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/renderer-recovery.ts#L67-L108)

有界reload与旧导航结果隔离。

<details>
<summary>查看原文（42行）</summary>

```text
  }

  fail(detail: string): void {
    if (!this.available() || this.phase === 'scheduled') return
    this.clearTimer()
    this.clearStableTimer()
    this.clientHealthy = false
    const delay = RETRY_DELAYS_MS[this.attempts]
    if (delay === undefined) {
      this.phase = 'exhausted'
      this.options.record('renderer.recovery.exhausted', { attempt: this.attempts, detail })
      this.options.exhausted(detail)
      return
    }
    this.phase = 'scheduled'
    this.options.record('renderer.recovery.scheduled', { attempt: this.attempts + 1, delayMs: delay, detail })
    this.timer = setTimeout(() => {
      this.timer = undefined
      if (!this.available()) return
      this.phase = 'waiting'
      this.documentLoaded = false
      this.attempts++
      this.options.record('renderer.recovery.reload', { attempt: this.attempts })
      this.armDeadline()
      // loadURL starts navigation synchronously; navigating() fences this promise
      // when a later reload or a native reload supersedes it.
      const loading = this.options.reload()
      const navigation = this.navigation
      void loading.catch(error => {
        if (navigation === this.navigation) this.fail(error instanceof Error ? error.message : String(error))
      })
    }, delay)
    this.timer.unref()
  }

  stop(): void {
    this.phase = 'stopped'
    this.navigation++
    this.clearTimer()
    this.clearStableTimer()
  }

```

</details>

**依据 11 · 源码核查**：[dsh-desktop-next/src/renderer-recovery.ts:128-145](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/renderer-recovery.ts#L128-L145)

双健康条件及稳定后次数重置。

<details>
<summary>查看原文（18行）</summary>

```text
  private acceptHealth(): void {
    if (!this.documentLoaded || !this.clientHealthy || this.phase === 'scheduled') return
    if (this.phase === 'idle' && this.stableTimer !== undefined) return
    this.clearTimer()
    this.phase = 'idle'
    if (this.cause === 'recovery') this.options.record('renderer.recovery.healthy', { attempt: this.attempts })
    else this.options.record('renderer.ready', { cause: this.cause })
    this.options.healthy()
    this.clearStableTimer()
    this.stableTimer = setTimeout(() => {
      this.stableTimer = undefined
      if (this.available()) this.attempts = 0
    }, STABLE_PERIOD_MS)
    this.stableTimer.unref()
  }

  private clearTimer(): void { clearTimeout(this.timer); this.timer = undefined }
  private clearStableTimer(): void { clearTimeout(this.stableTimer); this.stableTimer = undefined }
```

</details>

#### 缺口

- 未运行实际Electron/Node成品、全部平台打包和上游runProfile内部。
  **影响**：ready/健康只支持桌面生命周期，不能称生产任务可用。
  **进一步探讨**：目标平台记录进程pid、数据根/profile、Host ready、UI健康和一个模型任务结果各状态，故障分别定位。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 窗口、IPC和浏览器门禁保护到哪里，是否等于执行沙箱？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

BrowserWindow实际contextIsolation=true、sandbox=true、nodeIntegration=false，preload受控桥接；IPC assertSender要求owner webContents、mainFrame和应用URL前缀匹配，boot与数据/权限等handler使用它。窗口open通常转http/https/mailto系统浏览器并deny，Relay登录popup有特例；will-navigate/redirect挡应用前缀外导航。不是只靠页面传confirmed标志，但尚未全审每个IPC/preload/guest登录分支。

普通browserAccess是Host generation门禁：32字节base64url native token用timingSafeEqual校，浏览器开关关闭或伪造desktop marker query则deny；Webserver真wrap handler，拒403，market另走connection.requestRejection。nextAccess缺失时permits为true，因此保证限定启动链确已配置token，不能抽函数说任意宿主都受此闸。

Electron转发只接受dsh-app://app、有native frame marker并且Origin缺失或匹配的请求，main侧清外来host/origin/cookie并用所持Host cookie/token重写、manual redirect，响应strip set-cookie。这个代际凭证属于本机页面/Host通路权限，不是OS文件权限、模型工具审批或多租户隔离；已信任插件可能有Host能力，终端/电脑控制/远程LAN另有执行面，本轮未全面审这些能力，不建议据renderer sandbox称整个部署只读/安全。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-desktop-next/src/main.ts:297-304](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L297-L304)

IPC实际sender/mainFrame/URL校验。

```text
function assertSender(event: Pick<IpcMainInvokeEvent, 'sender' | 'senderFrame'>, owner: BrowserWindow | undefined, origin: string): void {
  if (!owner || owner.isDestroyed() || event.sender !== owner.webContents
    || event.senderFrame !== owner.webContents.mainFrame || !event.senderFrame.url.startsWith(origin)) throw new Error('Rejected Next IPC sender')
}
function assertDesktopSender(event: Pick<IpcMainInvokeEvent, 'sender' | 'senderFrame'>): void {
  if (event.sender === mainWindow?.webContents) assertSender(event, mainWindow, APP_URL)
  else assertSender(event, shellWindow, 'dsh-app://shell/')
}
```

**依据 2 · 源码核查**：[dsh-desktop-next/src/main.ts:389-395](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L389-L395)

真实BrowserWindow隔离配置。

```text
      visualEffectState: 'active' as const, backgroundColor: '#00000000',
    } : {}),
    // `webviewTag` only on the application document: every attachment is still refused unless
    // `DesktopBrowserGuests` issued the lease, and the guest itself never gets the tag.
    webPreferences: { preload: join(root, 'lib', preload), contextIsolation: true, sandbox: true, nodeIntegration: false, webviewTag: primary },
  })
  let intervalStart = Date.now()
```

**依据 3 · 源码核查**：[dsh-desktop-next/src/main.ts:438-458](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L438-L458)

外链/登录popup例外与导航限制。

<details>
<summary>查看原文（21行）</summary>

```text
  const openExternal = (url: string): void => {
    try { if (['https:', 'http:', 'mailto:'].includes(new URL(url).protocol)) void shell.openExternal(url).catch(error => runtime.report(error)) } catch { /* Ignore malformed external links. */ }
  }
  // Pages open their windows in the system browser, except the Relay sign-in popup the LiveShare owner page opens.
  const ownerLogin = primary ? liveshareOwnerLogin : undefined
  window.webContents.setWindowOpenHandler((details) => {
    if (ownerLogin?.accepts(details)) return { action: 'allow', overrideBrowserWindowOptions: ownerLogin.windowOptions(window) }
    openExternal(details.url)
    return { action: 'deny' }
  })
  if (ownerLogin !== undefined) {
    window.webContents.on('did-create-window', (child) => {
      ownerLogin.guard(child.webContents, { hostOrigin: () => runtime.auth === undefined ? undefined : new URL(runtime.auth.url).origin, openExternal })
    })
  }
  window.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(primary ? APP_URL : SHELL_URL)) { event.preventDefault(); openExternal(url) }
  })
  window.webContents.on('will-redirect', (event, url) => { if (!url.startsWith(primary ? APP_URL : SHELL_URL)) event.preventDefault() })
  // The official Desktop pops the same editing menu: native roles without shortcut
  // labels, availability from Chromium, and Windows labels in the application language.
```

</details>

**依据 4 · 源码核查**：[dsh-desktop-next/src/desktop-browser-access.ts:40-64](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/desktop-browser-access.ts#L40-L64)

真实token配置/校验和开关。

<details>
<summary>查看原文（25行）</summary>

```text
/** Create one unpredictable renderer capability for a Desktop Host generation. */
export function createDesktopBrowserAccess(
  ordinaryBrowserEnabled: boolean,
  token: string = randomBytes(ACCESS_TOKEN_BYTES).toString('base64url'),
): DesktopBrowserAccess {
  if (typeof ordinaryBrowserEnabled !== 'boolean') {
    throw new TypeError('dsh-desktop-next: ordinary browser access must be a boolean')
  }
  if (!ACCESS_TOKEN_PATTERN.test(token)) {
    throw new TypeError('dsh-desktop-next: renderer access token must be 32 base64url bytes')
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
        throw new TypeError('dsh-desktop-next: ordinary browser access must be a boolean')
      }
      enabled = next
    },
  })
```

</details>

**依据 5 · 源码核查**：[dsh-desktop-next/src/desktop-browser-access.ts:71-100](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/desktop-browser-access.ts#L71-L100)

timingSafe token与browser/marker判定。

<details>
<summary>查看原文（30行）</summary>

```text

function sameToken(actual: string | undefined, expected: string): boolean {
  if (actual === undefined || !ACCESS_TOKEN_PATTERN.test(actual) || actual.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
}

/** Whether an uncredentialed URL is attempting to activate Desktop-only client effects. */
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
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Launcher-owned request gate present only in a Desktop Host generation. */
```

</details>

**依据 6 · 源码核查**：[dsh-desktop-next/src/webserver.ts:28-68](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/webserver.ts#L28-L68)

门禁真实wrap且market另认证。

<details>
<summary>查看原文（41行）</summary>

```text
  private permits(request: Parameters<WebRoute['handler']>[0]): boolean {
    const access = nextBrowserAccess()
    return !access || decideDesktopBrowserAccess(access, request) !== 'denied'
  }

  /** The same decision for a Fetch request, which carries the client's headers but no socket. */
  private permitsFetch(request: Request): boolean {
    const access = nextBrowserAccess()
    return !access || decideDesktopBrowserAccess(access, { headers: Object.fromEntries(request.headers), url: request.url }) !== 'denied'
  }

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
        // A token exchange's own writeHead replaces these; the request its redirect causes expires them instead.
        const expiries = surplusSessionExpiries(request.headers.cookie, request.headers.host)
        if (expiries.length > 0) response.setHeader('set-cookie', expiries)
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
```

</details>

**依据 7 · 源码核查**：[dsh-desktop-next/src/web-document.ts:121-132](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/web-document.ts#L121-L132)

转发前应用origin/marker门禁。

<details>
<summary>查看原文（12行）</summary>

```text
 */
export async function forwardWebRequest(request: Request, host: string, cookie: string, nativeToken: string): Promise<Response> {
  const source = new URL(request.url)
  const origin = request.headers.get('origin')
  // Custom-protocol fetches can omit Origin. The native session marks only
  // requests from live same-origin frames in our owned window; an HTTP header or referrer alone is
  // insufficient. Keep this compatible with the upstream's Electron 44.0 ABI.
  if (source.protocol !== 'dsh-app:' || source.host !== 'app' || source.username || source.password
    || !nativeToken || request.headers.get(NATIVE_ACCESS_HEADER) !== nativeToken) return new Response(null, { status: 403 })
  if (origin !== null && origin !== 'dsh-app://app') return new Response(null, { status: 403 })
  // The official connect.js accepts an explicit ws query. Its same-origin
  // fallback would otherwise derive ws://app from this custom-protocol iframe.
```

</details>

**依据 8 · 源码核查**：[dsh-desktop-next/src/web-document.ts:41-55](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/web-document.ts#L41-L55)

仅所属活frame发native marker，其余先剥离。

<details>
<summary>查看原文（15行）</summary>

```text
/** Mark live same-origin frames in the owned window; strip the marker from other targets and redirects. */
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
}
```

</details>

**依据 9 · 源码核查**：[dsh-desktop-next/src/main.ts:1376-1392](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L1376-L1392)

真实session beforeSendHeaders调用marker函数。

<details>
<summary>查看原文（17行）</summary>

```text
    picking ??= pickOutsideProgramDirectory(
      () => dialog.showOpenDialog(window, { properties: ['openDirectory', 'createDirectory'] }).then(result => result.canceled ? undefined : result.filePaths[0]),
      choice => refusedProgramDirectoryOverlap('workspace', choice, program), overlap => chooseAgain('workspace', overlap, window))
      .then(path => path ?? null).finally(() => { picking = undefined })
    return picking
  })
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
```

</details>

**依据 10 · 源码核查**：[dsh-desktop-next/src/web-document.ts:151-168](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/web-document.ts#L151-L168)

使用main持有的凭据转发与strip响应。

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

#### 缺口

- 未全审预加载/guest/Relay登录、LAN HTTPS/远程、终端/电脑控制权限和上游工具安全。
  **影响**：只能陈述本机主窗口/认证代表链，不称全系统安全或每调用人批。
  **进一步探讨**：只在禁browser/LAN/远控的脱敏本机试；核外部frame/缺marker/旧代token拒绝，再单独审需要开放的执行面。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 停止、配置恢复、整目录备份与换目录分别改变什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

backend将prepare/start/stop串行，stop标cancelled并等待cleanup，cleanup失败保留Host所有权且允许再stop，不在旧进程未停时另起替代。HostProcess先发shutdown等退出，普通3秒后升级SIGTERM/750ms再SIGKILL；requireGraceful更新交接则10秒/5秒且必须收到shutdown-complete、exit0，否则虽已退出也拒交接。子进程真实stop清内存timer/账户watch、等上游shutdown、再ack/disconnect/exit。强制kill不等业务事务回滚，外部副作用仍查目标。

recovery checkpoint只备三个配置文件（package.json/cordis.patch.yml/features），不是会话/凭据/整个数据快照。restore持profile lock，完整校三个文件hash后先备当前，再逐文件atomicText/unlink；完整预校与逐文件原子不等整个多文件替换一个事务，中途IO失败可能部分还原，未复现。UI确认后等停止/stop再恢复，说明共享数据不回滚；需后续安装依赖与重启验证，不把“配置备份存在”当完整任务恢复。

整数据目录备份另一个动作：native对话框选择目录/确认任务会被中断，runtime.restart先stop再copy，复制失败仍尝试重启并显示失败。copy用同级.partial，完成rename；拒已存在目标、禁止放源目录内，lstat不跟随链接，内部link改向复制根；外部link仍指外部位置，不是把外部数据也备进去，Windows文件link不能建时可能复制目标内容。跳过electron-user-data/location选择文件，sockets等不复制；没有独立完整还原验证/备份加密证明。

换数据根只写location并quit/relaunch，不自动搬数据；已有两次启动根不同弹本次/上次确认，这已是现成功能，不能重提为新假设。安全模式是隔离临时home且native修复可指原profile，不是自动修好原数据。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-desktop-next/src/backend-controller.ts:62-107](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/backend-controller.ts#L62-L107)

共享attempt与失败cleanup。

<details>
<summary>查看原文（46行）</summary>

```text
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
    this.pending = pending
    return pending
  }

```

</details>

**依据 2 · 源码核查**：[dsh-desktop-next/src/backend-controller.ts:113-153](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/backend-controller.ts#L113-L153)

stop/close与失败保留Host。

<details>
<summary>查看原文（41行）</summary>

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
  }

  private failed(attempt: Attempt<Host>, error: Error): void {
    if (this.attempt !== attempt || attempt.cancelled) return
```

</details>

**依据 3 · 源码核查**：[dsh-desktop-next/src/host-process.ts:494-525](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/host-process.ts#L494-L525)

有界停止/强杀及graceful交接门禁。

<details>
<summary>查看原文（32行）</summary>

```text
    }
  }

  /**
   * Request teardown and await child exit, escalating termination when needed.
   * @param requireGraceful - Reject update handoff after forced termination or unsuccessful child exit.
   * @returns Completion of owned process teardown. DesktopHostUncleanExitError confirms exit but refuses installation;
   * other failures do not confirm exit.
   */
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

**依据 4 · 源码核查**：[dsh-desktop-next/src/host/index.ts:94-107](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/host/index.ts#L94-L107)

真实上游shutdown与ack/退出。

<details>
<summary>查看原文（14行）</summary>

```text
  memory.unref()
  let stopping: Promise<void> | undefined
  const accountWatch = new AbortController()
  const stop = (): Promise<void> => stopping ??= (async () => {
    const end = hostOperation('host', 'shutdown')
    clearInterval(memory)
    accountWatch.abort()
    await dragResources?.stop()
    const running = await application.catch(() => undefined)
    try { await running?.shutdown.shutdown(0); end() } catch (error) { end(error); throw error }
    await send({ type: 'shutdown-complete' })
    if (process.connected) process.disconnect()
    process.exit(0)
  })()
```

</details>

**依据 5 · 源码核查**：[dsh-desktop-next/src/recovery.ts:10-18](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/recovery.ts#L10-L18)

checkpoint仅三个配置文件。

```text
const FILES = ['package.json', 'cordis.patch.yml', 'desktop-next.features.json'] as const
type ConfigFile = typeof FILES[number]
interface Snapshot {
  version: 1
  profile: string
  created: string
  reason: string
  healthy: boolean
  files: Record<ConfigFile, { sha256: string } | null>
```

**依据 6 · 源码核查**：[dsh-desktop-next/src/recovery.ts:120-139](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/recovery.ts#L120-L139)

先校hash/备份，再逐文件原子替换。

<details>
<summary>查看原文（20行）</summary>

```text
  async restore(name: string, id?: string): Promise<void> {
    const latest = id === undefined ? this.latest(name) : this.find(name, id)
    if (!latest) throw new Error('No successful-start configuration is available')
    const dir = this.profiles.directory(name)
    await withFileLock(join(dir, 'lock'), async () => {
      const snapshot = this.readSnapshot(latest.directory, name)
      // Verify the complete snapshot before making any change.
      const contents = FILES.map(file => {
        const text = readPrivateFile(join(latest.directory, file))
        const saved = snapshot.files[file]
        if (saved === null ? text !== undefined : text === undefined || !matchesBackup(text, saved.sha256)) throw new Error('Recovery backup checksum mismatch')
        return [file, text] as const
      })
      this.backup(name, 'before-rollback')
      for (const [file, text] of contents) {
        const path = join(dir, file)
        if (text !== undefined) atomicText(path, text)
        else if (readPrivateFile(path) !== undefined) unlinkSync(path)
      }
    })
```

</details>

**依据 7 · 源码核查**：[dsh-desktop-next/src/main.ts:1005-1019](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L1005-L1019)

用户确认后停Host/恢复与共享数据不回滚。

<details>
<summary>查看原文（15行）</summary>

```text
    const checkpoint = typeof input.id === 'string' ? runtime.recovery.find(runtime.selected, input.id) : undefined
    if (!checkpoint) throw new Error('Recovery checkpoint is no longer available')
    if (action === 'open-checkpoint') { await openPath(checkpoint.directory); return }
    const undo = runtime.recovery.repairBackup(runtime.selected)?.id === checkpoint.id
    if (!await confirmed(undo ? t('撤销修复，恢复修复前的配置？', 'Undo the repair and restore the previous configuration?') : t('还原所选配置备份？', 'Restore the selected configuration backup?'),
      undo ? t(`修复时间：${checkpoint.created}。当前配置会先备份，然后恢复修复前的配置并安装所需插件依赖；导致故障的插件可能随之恢复。共享数据不会回滚。`, `Repaired: ${checkpoint.created}. Current configuration will be backed up, then the configuration from before the repair and its required plugin dependencies will be restored; a plugin that caused the failure may return with it. Shared data is not rolled back.`)
        : t(`备份时间：${checkpoint.created}。当前配置会先备份，然后恢复配置并安装所需插件依赖。共享数据不会回滚。`, `Saved: ${checkpoint.created}. Current configuration will be backed up, then the saved configuration and required plugin dependencies will be restored. Shared data is not rolled back.`))) return
    await recoveryStopping
    if (!runtime.safeMode) await runtime.backend.stop()
    await restoreCheckpoint(checkpoint.id)
    return
  }
  if (action === 'preview-disable' || action === 'preview-enable') {
    const enable = action === 'preview-enable'
    const bundle = runtime.recovery.bundles(runtime.selected).find(item => item.bundleId === input.id)
```

</details>

**依据 8 · 源码核查**：[dsh-desktop-next/src/main.ts:1151-1178](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L1151-L1178)

整目录备份UI确认和stop/copy/restart接线。

<details>
<summary>查看原文（28行）</summary>

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
  const notice = { type: 'info' as const, title: 'DSH NEXT', message: t('数据目录已备份', 'Data directory backed up'), detail: destination,
    buttons: [t('在文件夹中显示', 'Show in folder'), t('完成', 'Done')], defaultId: 1, cancelId: 1, noLink: true }
```

</details>

**依据 9 · 源码核查**：[dsh-desktop-next/src/data-backup.ts:26-74](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/data-backup.ts#L26-L74)

partial/rename、链接/排除及失败清理。

<details>
<summary>查看原文（49行）</summary>

```text
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

**依据 10 · 源码核查**：[dsh-desktop-next/src/main.ts:1094-1116](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L1094-L1116)

启动数据根变更提示已存在。

<details>
<summary>查看原文（23行）</summary>

```text
  confirmingDataDirectory = true
  const { response } = await dialog.showMessageBox({ type: 'warning', title: 'DSH NEXT', noLink: true,
    message: t('数据目录与上次不同', 'The data directory differs from the last launch'),
    detail: [
      t(`本次：${home}（${source}）`, `This launch: ${home} (${source})`),
      t(`上次：${previous}${reachable ? '' : '（当前无法访问）'}`, `Last launch: ${previous}${reachable ? '' : ' (unavailable now)'}`),
      '',
      t('继续使用本次目录不会移动或删除上次目录中的数据。', 'Continuing does not move or delete data in the last directory.'),
      ...reachable ? [] : [t('上次的目录如在移动硬盘或网络位置上，请先连接，再选择“改用上次的目录”。', 'If the last directory is on a removable or network drive, connect it before choosing “Use the last directory”.')],
      t(`如果刚修改了 ${DATA_DIRECTORY_VARIABLE}：应用内重启会沿用修改前的环境变量，请完全退出后再重新打开。`,
        `If you just changed ${DATA_DIRECTORY_VARIABLE}: an in-app restart keeps the previous environment, so quit completely and open the app again.`),
    ].join('\n'),
    buttons: [t('改用上次的目录', 'Use the last directory'), t('继续使用本次目录', 'Continue with this directory'), t('退出', 'Quit')], defaultId: 0, cancelId: 2 })
    .finally(() => { confirmingDataDirectory = false })
  if (response === 1) { rememberLaunchDirectory(home); return true }
  if (response === 0) {
    // An in-app choice no longer depends on the inherited environment.
    atomicJson(locationFile, { home: previous })
    rememberLaunchDirectory(previous)
    relaunchApp(app, process.argv.slice(1))
  }
  runtime.diagnostics.end(true)
  app.exit(0)
```

</details>

**依据 11 · 源码核查**：[dsh-desktop-next/src/main.ts:1132-1147](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L1132-L1147)

换根只更位置重启，不移动旧数据。

<details>
<summary>查看原文（16行）</summary>

```text
  }
  const destination = validateDataDirectory(target, home, dataLocation.fallback)
  // A broken choice is replaced through a restart, which also leaves recovery.
  if (sameDirectory(destination, home) && !dataLocation.error) {
    // The directory stays; restoring the default only forgets how it was chosen.
    if (restoreDefault && dataSource === 'desktop') { rmSync(locationFile, { force: true }); dataSource = environmentHome ? 'environment' : 'default' }
    return
  }
  if (!await confirmed(t('切换数据目录并重启？', 'Change data directory and restart?'),
    t(`新目录：${destination}。原目录的数据会保留，不会自动迁移。`, `New directory: ${destination}. Existing data remains in its original directory and is not moved.`))) return
  // Forgetting the choice lets DSH_DESKTOP_NEXT_HOME or the default apply again.
  if (restoreDefault) rmSync(locationFile, { force: true })
  else atomicJson(locationFile, { home: destination })
  rememberLaunchDirectory(destination)
  relaunch = relaunchArguments(process.argv.slice(1), false, false)
  app.quit()
```

</details>

#### 缺口

- 未测强杀/磁盘满/恢复中断/多平台link、完整还原或外部任务恢复。
  **影响**：配置恢复/目录备份/换根不能互相冒充，备份存在不代表可独立恢复所有外部引用。
  **进一步探讨**：脱敏副本备份后断开原目录/外部link，逐文件/会话核还原；另测停止失败拒变更、逐文件恢复中断，保留原件且不盲重试任务。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用及退出，哪些成本尚不知道？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要原生窗口/托盘管理本地DSH的用户，可选目标平台固定NEXT2.0.22-next成品，用新数据根、脱敏工作区与单一模型，只做一个非关键只读任务；先关普通浏览器/LAN和远程/社区扩展，查当前home/profile/Host pid，再核模型答案、窗口健康和正常退出pid消失。不能把关闭界面当Host及所有工具已停，也不把本项限定试用扩大为全部署只读。出错保留原始数据，回现有CLI/Web。

成品含Electron/Node/DSH依赖，源码Node范围^22.19或>=24，构建/发行/代码签名与完整安装包一致未验证；README跨平台可下载是作者说明，Linux需手动更新也不等本轮平台实测。模型账户/配额/网络与Host权限另配，桌面不提供免费推理或保证所有插件兼容。首次下载/备份/选择根/配置模型和权限，持续Electron+Host+工具内存CPU、会话/备份磁盘、模型费用及更新维护；失败查日志/进程/partial备份/配置和任务副作用，人工工时/现金未知。复制整根可能包含凭据和会话，应按本机权限/自定保留保护，不把0700目录当内容加密。退出停止任务/Host并核pid，保留原始日志与备份，清凭据/数据按用户策略；已发送数据/外部写入不可由卸载收回。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-desktop-next/package.json:1-17](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/package.json#L1-L17)

NEXT身份与Node范围。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "dsh-desktop-next",
  "version": "2.0.22-next",
  "private": true,
  "description": "Experimental upstream-inspired DSH Desktop with Profiles, recovery, remote control and Community Market",
  "desktopName": "dsh-desktop-next.desktop",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/anywhere-labs/deepseek-harness-desktop.git",
    "directory": "dsh-desktop-next"
  },
  "type": "module",
  "main": "lib/main.js",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

</details>

**依据 2 · 作者声明**：[README.md:36-63](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/README.md#L36-L63)

作者平台包与Linux手动更新说明。

<details>
<summary>查看原文（28行）</summary>

```text
## 下载与安装

当前正式安装包支持 Windows x64、macOS Universal 和 Linux（x64 与 arm64）。无需额外环境，下载安装，一键使用。

| 平台 | 下载 | 安装方式 |
| --- | --- | --- |
| Windows x64 | [下载安装程序](https://www.dshdesktop.cn/api/downloads/windows) | 运行 NSIS 安装程序并按提示完成安装 |
| macOS Universal | [下载 DMG](https://www.dshdesktop.cn/api/downloads/mac) | 打开 DMG，将 DSH Desktop 拖入 Applications |
| Linux x64 / arm64 | [GitHub Release](https://github.com/anywhere-labs/dsh-desktop/releases/latest) | 按发行版选择 deb、AppImage 或 tar.gz，见下方 [Linux 安装](#linux) |

<a id="linux"></a>

### Linux 安装

Linux 安装包只在 GitHub Release 发布，x64 与 arm64 各有三种格式：

| 格式 | 适用 | 安装与启动 |
| --- | --- | --- |
| deb | Debian、Ubuntu 及其衍生发行版 | `sudo apt install ./DSH-NEXT-<版本>-amd64.deb`（arm64 为 `-arm64.deb`），之后从应用菜单启动 |
| AppImage | 其他发行版，免安装 | `chmod +x DSH-NEXT-<版本>-x86_64.AppImage`（arm64 为 `-arm64.AppImage`）后直接运行 |
| tar.gz | 自行管理文件 | 解压 `DSH-NEXT-<版本>-linux-x64.tar.gz`（arm64 为 `-linux-arm64.tar.gz`），运行其中的 `dsh-desktop-next`；不会创建应用菜单入口 |

Ubuntu 24.04 及以上推荐使用 deb，它会安装 Chromium 沙箱需要的 AppArmor 配置。发布页的 `SHA256SUMS.txt` 可用于核验下载的文件。

Linux 版不能在应用内安装更新：发现新版本时应用会提示，并可直接打开该版本的发布页；请下载与当前安装方式相同的格式手动更新。deb 用同样的 `sudo apt install` 命令覆盖安装，AppImage 用新文件替换旧文件。

详细步骤、插件命令和故障排查见[用户指南](docs/user-guide.md)与[常见问题](docs/faq.md)。

```

</details>

**依据 3 · 源码核查**：[dsh-desktop-next/src/desktop-runtime.ts:335-347](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/desktop-runtime.ts#L335-L347)

退出真实backend close与诊断结算。

<details>
<summary>查看原文（13行）</summary>

```text
  async close(): Promise<void> {
    this.closing = true
    // Before the Host stops: a Host that dies of OOM while stopping is still recorded.
    this.memory.stop()
    const end = this.diagnostics.operation('desktop', 'backend.close')
    try { await this.backend.close(); end() } catch (error) { end(error); throw error }
    this.cleanupSafeHome()
    // A report started just before quitting is completed, not left partially written.
    await this.failureReportWrite
    await this.operationHistory?.close()
    this.diagnostics.flush()
  }

```

</details>

**依据 4 · 源码核查**：[dsh-desktop-next/src/host-process.ts:494-525](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/host-process.ts#L494-L525)

进程停止与graceful区别。

<details>
<summary>查看原文（32行）</summary>

```text
    }
  }

  /**
   * Request teardown and await child exit, escalating termination when needed.
   * @param requireGraceful - Reject update handoff after forced termination or unsuccessful child exit.
   * @returns Completion of owned process teardown. DesktopHostUncleanExitError confirms exit but refuses installation;
   * other failures do not confirm exit.
   */
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

**依据 5 · 源码核查**：[dsh-desktop-next/src/data-backup.ts:35-45](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/data-backup.ts#L35-L45)

备份partial和目录权限，不是加密。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[dsh-desktop-next/src/desktop-runtime.ts:310-315](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/desktop-runtime.ts#L310-L315)

browserAccess/safeMode/网络偏好约束展示链接。

```text
    if (!this.auth || this.closing || this.recoveryMode || this.backend.state.phase !== 'ready' || !this.preferences.browserAccess || this.safeMode) return { localUrl: null, lanUrls: [] }
    const localUrl = new URL(this.auth.url).href
    const edge = this.lan?.snapshot()
    const lanUrls = this.preferences.networkExposure === 'lan' && edge?.state === 'ready' && edge.actualPort
      ? edge.addresses.map(address => {
        const url = new URL(localUrl)
```

#### 缺口

- 无实际安装包/模型任务/性能/费用/退出多平台验收。
  **影响**：建议局限隔离非关键小试，不能承诺桌面更省时省钱或可恢复生产数据。
  **进一步探讨**：固定平台与包hash后记录一次任务/正常退出、内存与usage，再用可还原备份决定是否导入正式数据。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 独有增量与可证伪方向是什么？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

桌面增量在本机产品生命周期：持有并认证独立Host、围绕代际窗口/IPC与renderer健康恢复组织故障、停止后提供配置恢复/数据备份和明确的换根语义；上游Agent/模型/工具不算桌面独创。它比“打开Web链接”多承担进程与数据操作，却仍需用户核模型任务/外部影响。单应用便捷没有证据证明新责任分工、此前受限人群或新业务服务结构。

候选是备份完成时给可验证的范围收据：列已复制目录/跳过的Chromium状态、外部链接目标未纳入、配置checkpoint和整根备份的不同范围，并允许离线副本校验，而不只显示destination完成。现有UI已提示任务中断与electron缓存排除、已有换根确认，不把这些现成功能再当假设。用含外链/会话/凭据假数据的副本，比较现有提示与收据的独立还原成功率、误以为已备份的判断和耗时；若现有提示与手动查验已足够、收据无增益或暴露敏感路径负担更大，就推翻。未实现/未执行，不算当前备份完整性保证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-desktop-next/src/main.ts:1158-1178](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L1158-L1178)

现有备份确认与成功范围提示。

<details>
<summary>查看原文（21行）</summary>

```text
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
  const notice = { type: 'info' as const, title: 'DSH NEXT', message: t('数据目录已备份', 'Data directory backed up'), detail: destination,
    buttons: [t('在文件夹中显示', 'Show in folder'), t('完成', 'Done')], defaultId: 1, cancelId: 1, noLink: true }
```

</details>

**依据 2 · 源码核查**：[dsh-desktop-next/src/data-backup.ts:49-74](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/data-backup.ts#L49-L74)

真实排除/链接复制边界。

<details>
<summary>查看原文（26行）</summary>

```text
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

**依据 3 · 源码核查**：[dsh-desktop-next/src/recovery.ts:10-18](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/recovery.ts#L10-L18)

配置快照范围与整根不同。

```text
const FILES = ['package.json', 'cordis.patch.yml', 'desktop-next.features.json'] as const
type ConfigFile = typeof FILES[number]
interface Snapshot {
  version: 1
  profile: string
  created: string
  reason: string
  healthy: boolean
  files: Record<ConfigFile, { sha256: string } | null>
```

**依据 4 · 源码核查**：[dsh-desktop-next/src/main.ts:1094-1116](https://github.com/anywhere-labs/dsh-desktop/blob/a8b98656fd8bcaa888bcc63489b2ecda68a61084/dsh-desktop-next/src/main.ts#L1094-L1116)

换根归属提示已实现，非新方向。

<details>
<summary>查看原文（23行）</summary>

```text
  confirmingDataDirectory = true
  const { response } = await dialog.showMessageBox({ type: 'warning', title: 'DSH NEXT', noLink: true,
    message: t('数据目录与上次不同', 'The data directory differs from the last launch'),
    detail: [
      t(`本次：${home}（${source}）`, `This launch: ${home} (${source})`),
      t(`上次：${previous}${reachable ? '' : '（当前无法访问）'}`, `Last launch: ${previous}${reachable ? '' : ' (unavailable now)'}`),
      '',
      t('继续使用本次目录不会移动或删除上次目录中的数据。', 'Continuing does not move or delete data in the last directory.'),
      ...reachable ? [] : [t('上次的目录如在移动硬盘或网络位置上，请先连接，再选择“改用上次的目录”。', 'If the last directory is on a removable or network drive, connect it before choosing “Use the last directory”.')],
      t(`如果刚修改了 ${DATA_DIRECTORY_VARIABLE}：应用内重启会沿用修改前的环境变量，请完全退出后再重新打开。`,
        `If you just changed ${DATA_DIRECTORY_VARIABLE}: an in-app restart keeps the previous environment, so quit completely and open the app again.`),
    ].join('\n'),
    buttons: [t('改用上次的目录', 'Use the last directory'), t('继续使用本次目录', 'Continue with this directory'), t('退出', 'Quit')], defaultId: 0, cancelId: 2 })
    .finally(() => { confirmingDataDirectory = false })
  if (response === 1) { rememberLaunchDirectory(home); return true }
  if (response === 0) {
    // An in-app choice no longer depends on the inherited environment.
    atomicJson(locationFile, { home: previous })
    rememberLaunchDirectory(previous)
    relaunchApp(app, process.argv.slice(1))
  }
  runtime.diagnostics.end(true)
  app.exit(0)
```

</details>

#### 缺口

- 未验证收据对用户误判/恢复成功的净效果。
  **影响**：不能从源码备份实现推断新增方案有需求或生产收益。
  **进一步探讨**：先脱敏外链备份任务对照，记录具体误判与原始目录离线后的结果，无增益则不新增界面。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
