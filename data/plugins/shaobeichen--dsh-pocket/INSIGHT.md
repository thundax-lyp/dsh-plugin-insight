# DSH Pocket

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[aee3ae7](https://github.com/shaobeichen/dsh-pocket/tree/aee3ae7e97516206049394c7a37dc38778ffb6da)

<!-- BEGIN META -->
[![GitHub ★ 2,415](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C415&color=yellow&logo=github&style=flat)](https://github.com/shaobeichen/dsh-pocket) [![npm 30d 16,044](https://img.shields.io/static/v1?label=npm+30d&message=16%2C044&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pocket) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pocket)
<!-- END META -->

> **实现功能**：通过局域网代理、二维码和可选Cloudflare隧道，让手机同步访问电脑上的DSH界面。

> **核心亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的增量是将宿主兼容代理、扫码、移动布局和隧道管理收敛为设置页，减少个人远程访问的配置交接。移动布局来自dsh-web-mobile，公网由cloudflared提供，贡献为集成而非新协议。无同条件任务对照证明净节时。

> **风险与缺陷**：[Q03](#research-q03)指出同屏意味着PIN登录后进入广泛本机控制面，查看与写入没有已确认的独立角色。主动开隧道需要确认，但重启可按标记自动恢复，重启并非可靠撤销。对只想看状态的人，这个权限/持续授权取舍会改变采用判断；未运行复现，不把设计取舍称为认证绕过。

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
  - [Q01 · 手机同屏解决什么重复任务，是否另建一个Agent？](#detail-section-11)
  - [Q02 · PIN、cookie、反代与宿主认证如何串起来？](#detail-section-12)
  - [Q03 · PIN授权有多大，重启是否撤销公网访问？](#detail-section-13)
  - [Q04 · 怎样用小范围任务评估全周期负担并退出？](#detail-section-14)
  - [Q05 · 哪些生命周期设计值得复用，能否推导权限更窄的手机入口？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：它面向已有电脑端DSH Web、离开电脑后想查看输出或继续提交任务的人。手机扫码进入同一套Web界面，代理HTTP与WebSocket而不是迁移Agent、重建另一会话或在手机端执行模型。合格结果是手机看到并操作预期会话、确认需要的人为审批，再回电脑仍是同一状态。

等待回电脑、已有远程桌面或用户自行维护的VPN/反代。比较同一会话查看、提交、审批与退出，不将压缩样例或二维码存在当节时/安全证明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| LAN扫码 | 手机续接DSH Web | 电脑常驻、同网络，保留PIN |
| 访问凭据 | 区分LAN/公网并保持登录 | PIN授权广泛控制，自定义不自动轮换 |
| 公网隧道 | 外网接入同代理 | cloudflared与出站网络，named需账号域名 |
| 移动布局 | 手机侧栏/触控适配 | 上游移植，desktop advanced不支持 |
| 隧道控制 | 启停及恢复 | 主动stop清标记，重启可恢复 |
| 外部CLI | 命令行启动代理 | 与插件模式认证/退出分支分别验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web及Node>=22、Cordis | 是 | 原会话与设置/RPC | 需核对精确宿主API版本 |
| 常驻电脑和可达LAN | LAN需要 | 手机与代理连通 | 代理不迁移Agent到手机 |
| cloudflared及出站网络 | 公网需要 | 远程隧道 | 首次可能下载，失败回LAN |
| 账号/域名/Tunnel Token | named需要 | 固定公网地址 | 默认quick不用此配置，named凭据需管理 |
| desktop compatibility布局 | 桌面版手机需要 | 手机布局服务 | advanced不支持，不据扫码推断可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定宿主/包，在可信LAN保留PIN | 不先打开公网，记录退出动作 |
| 2 | 用户扫码登录并核对原会话 | 手机/电脑状态与任务一致 |
| 3 | 用户检查断线和主动关闭 | 未授权窗口不可继续操作 |
| 4 | 如有公网需要再配置隧道 | 区分quick/named、密码与自动恢复 |
| 5 | 不再使用时主动stop并关闭代理 | 检查监听/恢复标记，单重启不足 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/DSH、网络及可选cloudflared下载 | 安装重启、PIN、手机连通检查 | 金额/耗时未知，LAN不需隧道 |
| 持续使用 | 常驻电脑电力、网络、原模型任务 | 密码与域名/隧道管理 | named需账号域名，不承诺免费 |
| 失败恢复 | 重连/下载/重启资源 | 排端口、宿主布局、VPN/出站 | 金额/排障时间未知 |
| 退出 | 停隧道与代理 | 主动关闭并核对标记及监听 | 单重启可能恢复公网，不等撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 手机续接 | 同界面HTTP/WS代理和移动布局 | 实际兼容、断线和触控效率 |
| 公网访问 | cloudflared管理及认证接线 | 全链路可达、防护与网络成本 |
| 会话保持 | PIN+sessionKey派生cookie | 重启后实际撤销和终端体验 |
| 退出 | 主动stop清标记 | 单重启会恢复，不能当主动退出 |

> **思考**：[Q03](#research-q03)指出同屏意味着PIN登录后进入广泛本机控制面，查看与写入没有已确认的独立角色。主动开隧道需要确认，但重启可按标记自动恢复，重启并非可靠撤销。对只想看状态的人，这个权限/持续授权取舍会改变采用判断；未运行复现，不把设计取舍称为认证绕过。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的增量是将宿主兼容代理、扫码、移动布局和隧道管理收敛为设置页，减少个人远程访问的配置交接。移动布局来自dsh-web-mobile，公网由cloudflared提供，贡献为集成而非新协议。无同条件任务对照证明净节时。

[Q01](#research-q01)、[Q02](#research-q02)识别的增量是将宿主兼容代理、扫码、移动布局和隧道管理收敛为设置页，减少个人远程访问的配置交接。移动布局来自dsh-web-mobile，公网由cloudflared提供，贡献为集成而非新协议。无同条件任务对照证明净节时。

可借鉴的是service把代理和隧道生命周期分开：startTunnel复用进行中的Promise避免多次并发spawn，AbortController供停止取消，finally只清理自己的Promise引用以免旧启动覆盖新启动；进程退出回调更新error状态，主动停止与被动退出明确区分自动恢复标记。入口在ctx.effect中集中释放RPC及service，属于可解释的资源所有权。移植需要对齐子进程结束、宿主端口和恢复标记，不能只复制扫码页面。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)指出同屏意味着PIN登录后进入广泛本机控制面，查看与写入没有已确认的独立角色。主动开隧道需要确认，但重启可按标记自动恢复，重启并非可靠撤销。对只想看状态的人，这个权限/持续授权取舍会改变采用判断；未运行复现，不把设计取舍称为认证绕过。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)、[Q05](#research-q05)建议有常驻DSH Web的个人先在可信LAN保留密码试少量任务，核对同会话与主动关闭。不要把共享PIN当只读委派；需要公网时另验认证/网络/恢复边界。意外权限、无法关闭或不需要常驻管理时，停止代理并回电脑原界面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持代理、凭据和生命周期机制；同屏、移动兼容及公网认证未进行本轮运行验收，不将其当作安全保证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/proxy.mjs、lib/service.mjs、lib/web-rpc.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定入口、代理、service与RPC关键路径，不执行安装、目标测试、手机、真实DSH或公网隧道。本报告不是完整安全审计；同屏设计支持不等于认证防护已验收。
- 下一步：后续固定DSH、手机浏览器和网络，以同任务测试同步、断线、PIN轮换、WS和主动关闭/重启；独立核对公网信任转换后再决定是否持续使用。

**分析版本**

- **仓库**：[shaobeichen/dsh-pocket](https://github.com/shaobeichen/dsh-pocket)
- **版本号**：2.12.0（[固定提交 aee3ae7](https://github.com/shaobeichen/dsh-pocket/tree/aee3ae7e97516206049394c7a37dc38778ffb6da)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)推导未验证的只读手机入口：服务端及WS白名单配独立限时token，写操作临时升权并限制会话。比较查看、审批、提交与重连/过期/重启，若减少误授权且负担可接受才继续；稳定白名单无法成立或额外操作抵消便利则停止。

后续固定DSH、手机浏览器和网络，以同任务测试同步、断线、PIN轮换、WS和主动关闭/重启；独立核对公网信任转换后再决定是否持续使用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 17 | 17 | 0 | — |
| .mjs | source | 10 | 3060 | 2005 | 959 | — |
| .md | source | 5 | 1052 | — | — | 15857 |
| .js | source | 6 | 4184 | 3411 | 694 | — |
| .jsx | source | 1 | 694 | 565 | 100 | — |
| .ts | source | 3 | 1254 | 815 | 381 | — |
| .tsx | source | 5 | 850 | 617 | 185 | — |
| .js | test | 21 | 5108 | 4238 | 522 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/shaobeichen/dsh-pocket/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：手机同屏便利如何跨越DSH本机边界，权限和退出条件是否清楚？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手机同屏解决什么重复任务，是否另建一个Agent？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向已有电脑端DSH Web、离开电脑后想查看输出或继续提交任务的人。手机扫码进入同一套Web界面，代理HTTP与WebSocket而不是迁移Agent、重建另一会话或在手机端执行模型。合格结果是手机看到并操作预期会话、确认需要的人为审批，再回电脑仍是同一状态。

直接替代是等回电脑、远程桌面或自行配置VPN/反向代理。Pocket把代理、二维码、移动布局和可选cloudflared管理合为一个包和设置页，减少手工端口与隧道配置；不是新网络协议。移动布局明确移植自dsh-web-mobile，公网通道基于cloudflared，贡献应归于集成与宿主兼容接线。对已有成熟远程桌面、没有常驻电脑或宿主advanced桌面模式的人，额外代理不必然值得。实际手机任务节时与断线恢复未独立测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-59](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/README.md#L26-L59)

作者场景和同屏能力，包含桌面/网络前提。

<details>
<summary>查看原文（34行）</summary>

```text
## 这是什么

**你不在电脑前，也想用电脑上的 DeepSeek Harness。**

- 下班路上，agent 在电脑上跑任务，你想掏出手机看看它干到哪了、结果如何
- 出门在外，突然想让电脑上的 agent 查点资料、写段代码，但没有远程桌面、没有 SSH
- 电脑在宿舍/办公室，你人在外面，想随时"操控你的 DeepSeek Harness"——发任务、看输出、点审批

DSH Pocket 就是干这个的：**装上它，手机扫个码，就能实时看到并操控电脑上的 DeepSeek Harness 界面**——人在外面也能用。

实际效果——手机上的界面就是电脑上的界面，实时同步：

<p align="center">
  <img src="docs/interface.jpg" alt="手机上的 DSH 界面" width="100%">
</p>

## ✨ 特性

| 特性                    | 说明                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 📶 局域网扫码           | 装好即用：设置 → 手机访问，打开就有局域网二维码，手机连同一 WiFi 扫码即开（自动识别本机局域网 IP，**WSL 环境自动取 Windows 物理网卡 IP**）                                         |
| 🚪 局域网开关           | 设置页可**一键关闭/开启局域网访问**（切换时弹窗提醒）：关闭后局域网二维码/链接立即失效，仅公网可用                                                                                 |
| 🌐 公网扫码（人在外面） | 点「开启公网访问」→ cloudflared 隧道 → 出公网二维码，4G/任何网络都能访问                                                                                                           |
| 🏷️ 公网固定域名         | 可选「**命名隧道**」模式：填 Cloudflare Tunnel Token + 自己的域名，公网地址**固定不变**（重启不再变；见下方说明）                                                                  |
| 🔐 访问密码             | 公网链接默认使用 **8 位随机密码**（每次开启公网自动换新；**可自定义固定密码**——自定义后不再换新）；局域网有独立的默认 **8 位随机密码**（默认开启，设置页可**一键关闭**——关闭后局域网扫码直连） |
| 🔑 自定义密码           | 公网/局域网密码都可在设置页**设成自己固定的 8–64 位密码（英文字母大小写或数字）**（自定义后公网不再自动换新）                                                                         |
| 🧘 会话保持             | 手机输一次密码后**长期免输**（登录状态绑定电脑上的 dsh web 进程：只要它不重启，手机不用再输；**dsh web 重启/更新后需重新输入一次**）                                               |
| ⚡ 实时同步             | 流式输出走 WebSocket 全透传——**电脑上在输出，手机上同步在滚**，可双向操作；内置心跳保活（防路由器 NAT/省电机制静默断链，断线自动重连）                                             |
| 📱 移动端适配           | 窄屏自动变抽屉布局（移植 dsh-web-mobile，MIT）：侧栏抽屉、会话全宽、状态栏安全区、触控优化                                                                                         |
| 🧭 可选右边栏           | 手机端显示原生右边栏入口；普通手机可在设置中关闭以保持紧凑，折叠屏展开后可更方便地同时使用终端底栏和右边栏                                                                         |
| 📁 文件浏览             | 移动端「文件浏览」入口需要宿主提供 explorer 面板（dsh-web-ui 组件）；官方 DSH 未内置时入口自动隐藏，不会出现"点了没反应"                                                           |
| 🗜️ 传输压缩             | 大 JSON 响应自动 gzip/brotli（长会话 17MB → ~1MB，brotli 质量 6：快且省流量），手机加载更快、更省流量                                                                              |
| 🔁 隧道自动恢复         | DSH 重启后自动重新拉起之前开着的公网隧道，无需手动重开                                                                                                                             |
| 🧩 零依赖安装           | 一个 npm 包、一个设置页，没有核心/适配器要分开装；无需账号、无需服务器                                                                                                             |
```

</details>

**依据 2 · 作者声明**：[README.md:214-223](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/README.md#L214-L223)

移动适配与隧道上游归属。

<details>
<summary>查看原文（10行）</summary>

```text
## 🤝 致谢

- 移动端适配移植自 [mexiaosqwq/dsh-web-mobile](https://github.com/mexiaosqwq/dsh-web-mobile)（MIT）
- 公网隧道基于 [cloudflared](https://github.com/cloudflare/cloudflared)

## 📄 License

[GPL-2.0](LICENSE) —— 自由软件许可：可自由使用、修改、分发，但**修改版必须同样以 GPL 开源**并保留版权声明；商用同样适用。

> 说明：移动端适配部分移植自 [dsh-web-mobile](https://github.com/mexiaosqwq/dsh-web-mobile)（MIT 许可，兼容 GPL），其版权声明保留在 `client/mobile/LICENSE.dsh-web-mobile`。
```

</details>

**依据 3 · 源码核查**：[package.json:1-18](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/package.json#L1-L18)

同一包的插件、CLI和client入口。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-pocket",
  "description": "把 DeepSeek Harness 装进你的口袋：一个包、一个设置页，手机扫码即同步访问电脑上的 DSH（局域网 + 公网，实时同屏）。",
  "type": "module",
  "main": "lib/index.js",
  "bin": {
    "dsh-pocket": "bin/dsh-pocket.mjs"
  },
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": "./client/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "bin",
    "lib",
```

</details>

#### 缺口

- 手机查看与审批是否比既有远程桌面减少操作负担
  **影响**：集成便利不能推出端到端节时
  **进一步探讨**：在同一会话比较查看状态、提交任务和审批的成功率、触控步骤及人工时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · PIN、cookie、反代与宿主认证如何串起来？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件注入connection和webServer，自动启动面向0.0.0.0的代理，upstream指向本机DSH实际端口。认证配置按Host选择公网/局域网token；公网始终要求认证，局域网受独立开关控制。PIN使用randomInt生成，持久文件以0600创建，自定义值改变轮换政策；登录cookie由PIN与进程级sessionKey派生，重启后旧cookie失效。

代理不是普通只转发静态网页。loopbackAuthority把Host、Origin、Referer和Sec-Fetch-Site改为上游本机语义，让远程界面能够访问原本只信任本机的设置和凭据方法；入口还从connection.authenticatedUrl获取宿主启动token供代理使用。这解释了“手机看到并操作同一界面”的作用机制，也把认证后远端用户纳入本机权限范围。不能把头重写本身描述为漏洞，但外层Pocket认证成为关键边界。

源码含定时安全比较、登录限速、进程绑定cookie及HTTP/WS透传设计；它们支持机制存在，不是本轮安全审计结论。不同宿主预发布版本、WebSocket取消和移动浏览器API差异仍需实际验收。本轮没有运行源码或测试文件，不以测试数量当通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:26-27](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/index.js#L26-L27)

宿主服务依赖。

```text
const name = 'dsh-pocket';
const inject = ['connection', 'webServer'];
```

**依据 2 · 源码核查**：[lib/index.js:46-91](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/index.js#L46-L91)

token持久化、密码规则和轮换。

<details>
<summary>查看原文（46行）</summary>

```text
// ---------- 访问密码（issue #13 + #18 + #33） ----------
// 公网与局域网**分开**：各自 8 位，存本机 $DSH_HOME/dsh-pocket/。
// 公网密码（token）：默认每次开启公网时轮换（旧链接作废）；**用户自定义后不再轮换**；
// 局域网密码（token-lan）：默认手动刷新（设置页按钮）；自定义后刷新会换回随机值。
// 会话保持（issue #33）：登录 cookie 绑定进程级 sessionKey（见 apply）——
// dsh web 重启/更新后 sessionKey 变化 → 手机需重新输入。
// 默认 PIN 为 8 位数字；自定义 PIN 可使用 8–64 位英文字母（大小写）或数字。
const PIN_RE = /^[a-zA-Z0-9]{8,64}$/;
function writePinToFile(p, fresh) {
  try {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, fresh, { mode: 0o600 });
  } catch { /* 忽略 */ }
  return fresh;
}
function readPin(p) {
  try {
    const existing = readFileSync(p, 'utf8').trim();
    if (PIN_RE.test(existing)) return existing;
  } catch { /* 无文件 */ }
  return null;
}
/**
 * 生成 8 位访问 PIN（issue #90）。
 * 必须用 CSPRNG。语言内置的非加密随机数（V8 的 xorshift128+）是可预测的：拿到少量
 * 输出即可还原内部状态并推算后续值——用它生成访问密码，等于把 9×10⁷ 的搜索空间
 * 进一步压缩。`randomInt(min, max)` 上界开区间，取值 10000000..99999999。
 * test/auth-routing.test.js 有源码守卫，禁止这里再出现非加密随机数调用。
 */
function newPin() {
  return String(randomInt(10_000_000, 100_000_000));
}

// --- 公网密码 ---
const tokenRel = join('dsh-pocket', 'token');
function tokenPath() {
  return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), tokenRel);
}
/** 当前公网访问密码；文件不存在时生成一个。 */
export function getAccessToken() {
  return readPin(tokenPath()) ?? writePinToFile(tokenPath(), newPin());
}
/** 轮换公网密码（开启公网时调用）。用户自定义后不再轮换（尊重自定义值）。 */
export function rotateAccessToken() {
  if (pinCustom('public')) return getAccessToken();
  return writePinToFile(tokenPath(), newPin());
```

</details>

**依据 3 · 源码核查**：[lib/index.js:330-351](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/index.js#L330-L351)

外层认证与宿主启动token接线。

<details>
<summary>查看原文（22行）</summary>

```text
    auth: {
      // sessionKey：进程级随机密钥——登录 cookie 绑定它（会话保持，issue #33）：
      // dsh web 重启/更新后 sessionKey 变化 → 手机需重新输入
      sessionKey: randomBytes(16).toString('hex'),
      getToken: (host) => tokenForHost(host),
      getCredentialKind: (host) => credentialKindForHost(host),
      isProtected: (host) => {
        if (isLanOverrideHost(host)) return lanAuthEnabled();
        return classifyHost(host) === 'public' ? true : lanAuthEnabled();
      },
    },
    // dsh web 浏览器会话启动 token（issue #77）：新版 dsh（>= 0.1.2-alpha.1）要求根路径
    // 带一次 `?token=` 换 cookie，否则 /api 与 WebSocket 全 401。token 每次进程启动都变，
    // 所以每次请求实时从 connection 服务取；老版本没有这个方法 → 返回空，行为不变。
    launchToken: () => {
      try {
        const fn = ctx.connection?.authenticatedUrl;
        if (typeof fn !== 'function') return '';
        const url = new URL(fn.call(ctx.connection, `http://127.0.0.1:${dshPort}`));
        return url.searchParams.get('token') ?? '';
      } catch {
        return '';
```

</details>

**依据 4 · 源码核查**：[lib/service.mjs:274-290](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/service.mjs#L274-L290)

0.0.0.0代理到loopback上游。

<details>
<summary>查看原文（17行）</summary>

```text
    /** 启动局域网代理（幂等）。端口被占（EADDRINUSE，如桌面版与普通环境同时运行）时自动尝试下一个端口。 */
    async startProxy() {
      if (proxy) return proxy;
      let lastErr = null;
      for (let p = port; p < port + 10; p++) {
        try {
          proxy = await createProxy({
            port: p,
            host: '0.0.0.0',
            upstream: { host: '127.0.0.1', port: dshPort },
            ...(injectHtml ? { injectHtml } : {}),
            ...(auth ? { auth } : {}),
            // 每次请求实时读开关：设置页切换后立即生效，无需重启代理
            lanAccessEnabled: () => getLanEnabled(),
            // dsh web 浏览器会话启动 token（issue #77）：实时取，新版 dsh 才有
            ...(launchToken ? { launchToken } : {}),
          });
```

</details>

**依据 5 · 源码核查**：[lib/proxy.mjs:126-154](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/proxy.mjs#L126-L154)

cookie派生和限速设计。

<details>
<summary>查看原文（29行）</summary>

```text
// 登录成功后种 HttpOnly 持久 cookie（Max-Age 30 天）→ SPA 内部 API/WS 自动携带。
// 会话保持（issue #33）：cookie 值 = sha256(PIN:sessionKey)——sessionKey 是 dsh web
// 进程级随机密钥（lib/index.js 每次启动生成）。于是：
//   - 电脑 dsh web 一直开着 → 手机输一次密码后长期免输（持久 cookie）
//   - dsh web 重启/更新 → sessionKey 变化 → 旧 cookie 失效 → 手机重新输入
const TOKEN_COOKIE = 'dsh_pocket_token';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 天（秒）

/** cookie 校验值：有 sessionKey 时派生，无则退化为 PIN 本身（向后兼容）。 */
function cookieFor(token, sessionKey) {
  if (!sessionKey) return token;
  return createHash('sha256').update(`${token}:${sessionKey}`).digest('hex');
}

// ---------- 登录速率限制（issue #40，改进版方案 A） ----------
// 8 位数字密码（10^8 组合）本身可接受，真正风险是「无限制重试」让穷举可行。
// 这里做三层防护（内存态，随进程生命周期，与 sessionKey 一致）：
//   1) 单 IP 滑动窗口：60 秒内失败 ≥5 次 → 锁 60 秒（429）
//   2) 全局滑动窗口：1 分钟全局失败 > 50 次 → 全局锁 30 秒（防分布式扫描换 IP 绕过）
//   3) 成功登录清空该 IP 计数
// IP 识别：优先 cf-connecting-ip（Cloudflare 在隧道入口设置的**真实**客户端 IP，
// 可信）；无则回退 socket remoteAddress。**不信任客户端 x-forwarded-for**（可伪造）。
export const DEFAULT_RATE_LIMIT = {
  windowMs: 60_000,      // 失败计数滑动窗口
  maxFailures: 5,        // 窗口内失败阈值 → 触发单 IP 锁
  lockMs: 60_000,        // 单 IP 锁定时长
  globalMaxFailures: 50, // 全局失败阈值（同窗口）→ 触发全局锁
  globalLockMs: 30_000,  // 全局锁定时长
};
```

</details>

**依据 6 · 源码核查**：[lib/proxy.mjs:529-557](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/proxy.mjs#L529-L557)

头重写把认证后的远端请求变成上游本机权威。

<details>
<summary>查看原文（29行）</summary>

```text
 * 除 Host/Origin 外，还必须规范化 Referer 与 Sec-Fetch-Site：DSH 宿主的特权方法
 * 栅栏（settings.describe/credentials.* 等 PRIVILEGED_METHODS）会拒绝
 * sec-fetch-site === 'cross-site'，并校验 Origin 与 Host 匹配；远程访问的这两个头
 * 若不改写，设置/凭据平面会在宿主侧被 403（issue #58 的另一半）。
 * 统一小写化键名，避免 Node 原样转发时大小写键并存导致重复头。
 */
function loopbackAuthority(headers, upstream) {
  const authority = `${upstream.host}:${upstream.port}`;
  const out = {};
  for (const [k, v] of Object.entries(headers)) {
    const lk = k.toLowerCase();
    if (lk === 'host' || lk === 'origin' || lk === 'referer' || lk === 'sec-fetch-site') continue;
    out[lk] = v;
  }
  out.host = authority;
  out.origin = `http://${authority}`;
  const referer = headers.referer ?? headers.Referer;
  if (referer) {
    try {
      const ref = new URL(referer);
      ref.protocol = 'http:';
      ref.host = authority;
      out.referer = ref.toString();
    } catch {
      out.referer = `http://${authority}/`;
    }
  }
  out['sec-fetch-site'] = 'same-origin';
  return out;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · PIN授权有多大，重启是否撤销公网访问？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Pocket提供个人同屏控制，不提供由本轮材料确认的只读、仅某会话或仅审批角色。登录后的手机能经代理触及宿主原界面及允许的RPC，源码明确为设置/凭据平面重写本机信任头。共享PIN或含token链接等于共享广泛操作能力，不能把“只是看看输出”误解成权限已限制到只读。

主动开隧道RPC要求disclaimer=true，是一次设置动作的确认；服务同时保存autoTunnel标记，插件启动代理后会调用restoreTunnelIfNeeded。stopTunnel在用户主动关闭时默认清除标记，但dispose/重启可保留标记以便恢复。因此重启不是结束公开可达性的可靠停止动作。quick与named密码策略还不同，固定域名及自定义PIN不每次自动轮换。

这是一项便利与持续授权的设计取舍，不是本轮复现的绕过。需要临时查看、给他人有限审批或希望重启后自动失效的用户，应确认任务是否接受这一权限粒度；没有确认就不能把公网同屏推广成安全的多人委派。停止要主动关闭隧道并验证不可达，泄露凭据时另轮换，局域网开关也单独管理。

#### 证据与依据

**依据 1 · 源码核查**：[lib/proxy.mjs:529-557](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/proxy.mjs#L529-L557)

特权设置/凭据平面经过本机头重写。

<details>
<summary>查看原文（29行）</summary>

```text
 * 除 Host/Origin 外，还必须规范化 Referer 与 Sec-Fetch-Site：DSH 宿主的特权方法
 * 栅栏（settings.describe/credentials.* 等 PRIVILEGED_METHODS）会拒绝
 * sec-fetch-site === 'cross-site'，并校验 Origin 与 Host 匹配；远程访问的这两个头
 * 若不改写，设置/凭据平面会在宿主侧被 403（issue #58 的另一半）。
 * 统一小写化键名，避免 Node 原样转发时大小写键并存导致重复头。
 */
function loopbackAuthority(headers, upstream) {
  const authority = `${upstream.host}:${upstream.port}`;
  const out = {};
  for (const [k, v] of Object.entries(headers)) {
    const lk = k.toLowerCase();
    if (lk === 'host' || lk === 'origin' || lk === 'referer' || lk === 'sec-fetch-site') continue;
    out[lk] = v;
  }
  out.host = authority;
  out.origin = `http://${authority}`;
  const referer = headers.referer ?? headers.Referer;
  if (referer) {
    try {
      const ref = new URL(referer);
      ref.protocol = 'http:';
      ref.host = authority;
      out.referer = ref.toString();
    } catch {
      out.referer = `http://${authority}/`;
    }
  }
  out['sec-fetch-site'] = 'same-origin';
  return out;
```

</details>

**依据 2 · 源码核查**：[lib/web-rpc.js:368-379](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/web-rpc.js#L368-L379)

人工开启要求声明，停止为独立动作。

<details>
<summary>查看原文（12行）</summary>

```text
      if (endpoint === POCKET_ENDPOINTS.tunnelStart) {
        // 安全免责声明（issue #31）：每次开启公网都必须先确认（前端弹框勾选）。
        // 服务端强制校验，防止绕过前端直接调 RPC。
        if (payload?.disclaimer !== true) {
          return fail('bad-request', '开启公网前请先阅读并勾选安全免责声明 | please accept the security disclaimer before enabling public access');
        }
        await service.startTunnel();
        return await statusPayload();
      }
      if (endpoint === POCKET_ENDPOINTS.tunnelStop) {
        service.stopTunnel();
        return await statusPayload();
```

</details>

**依据 3 · 源码核查**：[lib/service.mjs:349-388](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/service.mjs#L349-L388)

自动恢复标记与主动关闭/被动退出区别。

<details>
<summary>查看原文（40行）</summary>

```text
          // 记录「隧道开启中」，供重启后自动恢复（issue #11）
          void persistAutoTunnel();
          // 公网隧道就绪 → 回调（快速模式轮换访问密码；命名模式不轮换，见 lib/index.js）
          try { onTunnelReady?.(cfg?.mode === 'named' ? 'named' : 'quick'); } catch { /* 忽略 */ }
          return tunnel.url;
        } catch (err) {
          // stopTunnel 触发的 abort 不算错误：保持 idle，别把状态刷成 error
          if (!controller.signal.aborted) {
            tunnelState.phase = 'error';
            tunnelState.detail = err?.message ?? String(err);
          }
          tunnelState.startedAt = null; // 失败后清掉计时，避免 UI 误显"启动中"
          throw err;
        } finally {
          // 只清自己的引用：stopTunnel 后立即 startTunnel 可能已建了新的 in-flight
          // （tunnelPromise=B），A 的 finally 不能把 B 清掉，否则第三次调用会并发 spawn
          if (tunnelPromise === p) tunnelPromise = null;
        }
      })();
      tunnelPromise = p;
      return p;
    },

    /**
     * 停止公网隧道（代理保持）。
     * @param {{ keepAutoMarker?: boolean }} [opts] - keepAutoMarker=true 用于进程退出/
     *   自重启（dispose / pocketRestart）：隧道是随进程被动消失的，不是用户主动关闭，
     *   必须保留 tunnel-auto.json，下次启动才能自动恢复（issue #11 的本意）。
     *   默认（设置页手动关闭、恢复出厂）删除标记。
     */
    stopTunnel({ keepAutoMarker = false } = {}) {
      tunnelAbort?.abort();
      tunnelAbort = null;
      tunnelPromise = null; // 丢弃已 abort 的 in-flight（其 finally 会再清一次，无害）
      if (tunnel) tunnel.kill();
      tunnel = null;
      tunnelState.phase = 'idle';
      tunnelState.detail = '';
      tunnelState.startedAt = null;
      if (!keepAutoMarker) void clearAutoTunnel(); // 手动关闭后不再自动恢复
```

</details>

**依据 4 · 源码核查**：[lib/index.js:405-417](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/index.js#L405-L417)

插件启动自动恢复及dispose释放。

<details>
<summary>查看原文（13行）</summary>

```text
  // 代理随插件自动启动（局域网二维码开箱即用，零配置）
  void service.startProxy().then((proxy) => {
    logger.info('dsh-pocket: proxy ready on :%d | 局域网代理已就绪', proxy.port);
    // 自动恢复上次开启的公网隧道（DSH 重启后 cloudflared 子进程被杀，issue #11）
    void service.restoreTunnelIfNeeded?.().catch(() => {});
  }).catch((err) => {
    logger.error('dsh-pocket: proxy start failed | 代理启动失败: %s', err?.message ?? err);
  });

  ctx.effect(() => async () => {
    for (const d of disposers.reverse()) { try { d(); } catch { /* 忽略 */ } }
    await service.dispose();
  }, 'dsh-pocket: stop proxy and tunnel');
```

</details>

**依据 5 · 作者声明**：[README.md:111-124](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/README.md#L111-L124)

作者明确固定凭据、适合个人及CLI认证边界。

<details>
<summary>查看原文（14行）</summary>

```text
注意：命名隧道模式下公网密码**不自动轮换**（地址固定，重启后密码不变），建议配合「自定义密码」主动管理；Tunnel Token 只存本机（`$DSH_HOME/dsh-pocket/settings.json`，仅本机可读），设置页不回显。

## ⚠️ 安全（必读）

- **DSH 能执行你电脑上的代码**。**局域网**二维码/URL 配上独立 **8 位密码**才是钥匙（密码**默认开启**，可关——关闭后局域网扫码直连，仅同一网络设备可访问），**请勿把局域网二维码、URL 或密码发给别人**
- **开启公网访问前必须阅读并勾选免责声明**（每次开启都会弹框；服务端强制校验，无法绕过）：公网 = 把能执行代码的 DSH 暴露到互联网，请使用强密码、用完即关、涉密网络勿用
- **公网**默认有 **8 位随机密码**保护：链接随机分配、默认每次开启换新密码、旧链接立即作废——泄露了也进不来，改密码/重开即可作废；**自定义密码可设为 8–64 位英文字母或数字，且不再自动换新**
- 手机登录状态与电脑上的 dsh web 进程绑定：**电脑 dsh web 一直开着就不用重复输入；重启/更新后需重新输入一次**
- **登录限速**（防暴力破解）：同一 IP 连续输错 **5 次**锁定 **60 秒**；全局失败超阈值时短暂全锁（防换 IP 分布式扫描）；输对密码后计数清零
- 公网 URL 由 cloudflared 随机分配，**每次重启会变化**（旧链接自动失效，相当于天然轮换）；**命名隧道固定域名**模式下地址不变、密码不自动轮换，请配合自定义密码管理
- **公网判定是 fail closed**（issue #66）：除本机（loopback）和局域网私网地址外，**一切陌生域名（包括你自建隧道/反向代理指向本机端口的固定域名）一律按公网处理、强制公网密码**——不存在「换域名绕过密码」的口子
- 局域网模式不暴露公网，只有同一网络内的设备能访问
- 适合个人自用；公网密码存本机 `$DSH_HOME/dsh-pocket/token`（默认每次开启公网自动换新，**自定义后不换**），局域网密码存 `$DSH_HOME/dsh-pocket/token-lan`（设置页手动刷新），开关/自定义标记存 `$DSH_HOME/dsh-pocket/settings.json`
- **CLI 模式（命令行直跑 `dsh-pocket`）也有密码**（issue #90 修复前这条路是无认证的）：默认随机生成 8 位密码，打印在终端、并已内嵌进二维码（**扫码体验不变**），手动敲地址时需要填写，本机访问免密。`--pin <值>` 或 `DSH_POCKET_PIN=<值>` 自定义（至少 6 位）；`--no-auth` 可关闭，**不推荐**——那等于把能执行代码的 DSH 裸暴露给任何能连上该端口的人
```

</details>

#### 缺口

- 实际读者是否只需要查看而不愿授权全部界面
  **影响**：会改变采用任务及是否应公开代理
  **进一步探讨**：让目标用户分别完成只读查看、审批和任务提交，记录必须开放的RPC及拒绝范围

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样用小范围任务评估全周期负担并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

启动需要可用DSH Web、匹配宿主服务、Node>=22和手机可达网络。LAN模式无需cloudflared但不是没有运行依赖：电脑需常驻、代理端口可达、浏览器与宿主布局可用；宿主desktop advanced模式没有手机所需layout，作者明确不支持。公网还要下载/运行cloudflared及可用出站网络；named模式另外需Cloudflare账号、域名和Tunnel Token。

先在个人可信LAN保留密码，用少量不涉及共享权限的任务检查会话一致、输出、断线重连和主动关闭。现有VPN若已满足需求，应比较它的维护负担，不因二维码方便就重复增加公开入口。随后是否试公网须单独决定，因其外层认证代替原宿主本机边界，不能由LAN一次可达推导公网链路可靠。

首次成本是安装重启、网络和可能的二进制下载；持续成本是电脑常驻、电力网络、隧道与密码管理，模型任务仍由原DSH计费；失败需排端口、宿主兼容、浏览器、代理/VPN及隧道出站。金额和耗时未知，README压缩比是作者特定样本，不当作普遍省流量结果。退出应主动停隧道、关闭LAN、停止/移除插件并检查监听与标记；单纯重启可恢复隧道。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:49-59](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/package.json#L49-L59)

Node及Cordis依赖。

<details>
<summary>查看原文（11行）</summary>

```text
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "mobile",
    "remote",
    "qr",
    "tunnel"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

**依据 2 · 作者声明**：[README.md:69-111](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/README.md#L69-L111)

LAN、公网和named条件。

<details>
<summary>查看原文（43行）</summary>

````text
**前提**：电脑上已装好 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)。如果终端提示 `dsh: command not found`（找不到 dsh 命令），先安装：

```sh
npm install -g @deepseek-ai/dsh     # 全局安装；验证：dsh --version
# 不想全局装？每次命令前加 npx：npx @deepseek-ai/dsh <命令>
```

```sh
# 1. 装插件（一个包全都有）
dsh plugin --profile web add dsh-pocket -w

# 2. 重启 dsh web
npx @deepseek-ai/dsh web
```

### 局域网（同一 WiFi）

设置 → **手机访问** → 手机扫「📶 局域网」二维码 → 打开链接**输入局域网密码**（显示在设置页局域网区块，点「刷新」可换新，或点「自定义」设成自己固定的 8–64 位密码——英文字母大小写或数字）→ 打开的就是电脑上的 DSH，实时同步。

> 「**局域网访问**」开关默认**开**：可一键**关闭/开启**（切换时弹窗提醒）——关闭后局域网二维码/链接立即失效（手机打不开），**公网不受影响**；想恢复时再点「开」即可。
>
> 局域网密码**默认开启**（安全优先）。如果只有自己用、嫌每次输密码麻烦，可在设置页局域网区块把「局域网访问密码」切到**关**——之后局域网扫码直连、无需密码（仅同一局域网设备可访问；**公网始终要密码**，不受影响）。
>
> 手机登录一次后**长期免输**：只要电脑上的 dsh web 不重启，再次打开手机不用再输入（**dsh web 重启/更新后需重新输入一次**）。
>
> 高级选项：自动识别在 Tailscale/VPN 等场景下可能选不到可达地址。可在「局域网地址」下拉框手动选择已检测到的 IP；一般不需要修改。

### 公网（人在外面）

同一页点「**开启公网访问**」→ **每次都会先弹出安全免责声明**，勾选「我已知情」后才能开启（公司/涉密网络请先确认合规）→ 等隧道建立（首次会下载 cloudflared，macOS/Linux 走清华镜像秒下）→ 手机扫「🌐 公网」二维码 → 打开链接**输入访问密码**（密码显示在设置页公网区块，默认是**每次开启公网变新的 8 位随机密码**，也可点「自定义」设成 8–64 位固定密码——英文字母大小写或数字，自定义后不再换新）→ 人在外面（4G/公司网）也能访问。

> 更新到新版本：`dsh plugin --profile web update dsh-pocket --latest -w`（跨大版本时 `--latest` 是必须的，`^0.x` 范围不会自动升到 1.x）。

### 公网固定域名（命名隧道，可选）

默认「快速隧道」的公网地址每次重启都会变（前缀随机）。想要**固定公网地址**，可用 Cloudflare **命名隧道**（需要 Cloudflare 账号 + 自己的域名）：

1. 在 [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) → **Networks → Tunnels** 创建一条 Tunnel，复制 **Tunnel Token**
2. 在该 Tunnel 的 **Public Hostname** 里把你的域名（如 `pocket.example.com`）的 Service 指向 `http://127.0.0.1:3081`
3. 回到设置页公网区块：模式切到「**命名隧道**」，粘贴 Tunnel Token、填写固定域名，保存
4. 点「开启公网访问」→ 公网地址固定为你的域名，**重启不再变化**

注意：命名隧道模式下公网密码**不自动轮换**（地址固定，重启后密码不变），建议配合「自定义密码」主动管理；Tunnel Token 只存本机（`$DSH_HOME/dsh-pocket/settings.json`，仅本机可读），设置页不回显。
````

</details>

**依据 3 · 作者声明**：[README.md:126-129](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/README.md#L126-L129)

桌面advanced模式限制。

```text
## 💻 DSH Desktop（桌面版）

- 桌面版里 dsh-pocket 的**扫码同屏**正常可用；**更新/重启由桌面版管理**（插件内这两项自动停用）
- ⚠️ 桌面端 **advanced 模式**暂不支持手机访问（该模式禁用网页布局、手机拿不到 layout 服务，会白屏）——请切回 **compatibility** 模式后重启；advanced 模式下手机打开会看到明确的提示层
```

**依据 4 · 源码核查**：[lib/service.mjs:274-308](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/service.mjs#L274-L308)

代理端口与隧道依赖。

<details>
<summary>查看原文（35行）</summary>

```text
    /** 启动局域网代理（幂等）。端口被占（EADDRINUSE，如桌面版与普通环境同时运行）时自动尝试下一个端口。 */
    async startProxy() {
      if (proxy) return proxy;
      let lastErr = null;
      for (let p = port; p < port + 10; p++) {
        try {
          proxy = await createProxy({
            port: p,
            host: '0.0.0.0',
            upstream: { host: '127.0.0.1', port: dshPort },
            ...(injectHtml ? { injectHtml } : {}),
            ...(auth ? { auth } : {}),
            // 每次请求实时读开关：设置页切换后立即生效，无需重启代理
            lanAccessEnabled: () => getLanEnabled(),
            // dsh web 浏览器会话启动 token（issue #77）：实时取，新版 dsh 才有
            ...(launchToken ? { launchToken } : {}),
          });
          if (p !== port) {
            logInfo(`dsh-pocket: port ${port} busy, proxy on ${p} | 端口 ${port} 被占用，代理改用 ${p}`);
          }
          break;
        } catch (err) {
          if (err?.code !== 'EADDRINUSE') throw err; // 非端口冲突直接失败
          lastErr = err;
        }
      }
      if (!proxy) throw lastErr ?? new Error('proxy start failed | 代理启动失败');
      return proxy;
    },

    /** 启动公网隧道（幂等；返回公网 URL）。进度写进 tunnelState。并发调用单飞。 */
    async startTunnel() {
      await this.startProxy();
      if (tunnel) return tunnel.url;
      if (tunnelPromise) return tunnelPromise; // 复用 in-flight，防孤儿 cloudflared
```

</details>

**依据 5 · 源码核查**：[lib/service.mjs:372-388](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/service.mjs#L372-L388)

主动停止删除自动恢复标记。

<details>
<summary>查看原文（17行）</summary>

```text
    /**
     * 停止公网隧道（代理保持）。
     * @param {{ keepAutoMarker?: boolean }} [opts] - keepAutoMarker=true 用于进程退出/
     *   自重启（dispose / pocketRestart）：隧道是随进程被动消失的，不是用户主动关闭，
     *   必须保留 tunnel-auto.json，下次启动才能自动恢复（issue #11 的本意）。
     *   默认（设置页手动关闭、恢复出厂）删除标记。
     */
    stopTunnel({ keepAutoMarker = false } = {}) {
      tunnelAbort?.abort();
      tunnelAbort = null;
      tunnelPromise = null; // 丢弃已 abort 的 in-flight（其 finally 会再清一次，无害）
      if (tunnel) tunnel.kill();
      tunnel = null;
      tunnelState.phase = 'idle';
      tunnelState.detail = '';
      tunnelState.startedAt = null;
      if (!keepAutoMarker) void clearAutoTunnel(); // 手动关闭后不再自动恢复
```

</details>

#### 缺口

- 目标网络及手机任务是否获得净便利，运行总成本未知
  **影响**：只能推荐小范围可核对试用，不能承诺随时可用或零成本
  **进一步探讨**：对固定手机/宿主/网络记录任务成功、断线恢复、常驻费用与人工排障时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些生命周期设计值得复用，能否推导权限更窄的手机入口？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

可借鉴的是service把代理和隧道生命周期分开：startTunnel复用进行中的Promise避免多次并发spawn，AbortController供停止取消，finally只清理自己的Promise引用以免旧启动覆盖新启动；进程退出回调更新error状态，主动停止与被动退出明确区分自动恢复标记。入口在ctx.effect中集中释放RPC及service，属于可解释的资源所有权。移植需要对齐子进程结束、宿主端口和恢复标记，不能只复制扫码页面。

未验证假设是增加默认只读手机模式，用单独受限token及RPC白名单访问任务状态，写操作临时升权并限制会话和有效期。由Q03“看看状态”和广泛代理授权不相等可推导，目标是让便利不必总伴随整个本机控制面开放。实现必须在服务端及WebSocket同时约束，纯隐藏按钮无效；代价是维护宿主方法列表与过期撤销。

最小验证以状态查看、审批、提交三个任务和重连/重启/过期三种边界，对比原全界面与受限入口，记录误授权、完成率、额外步骤和撤销是否生效。读任务无需写权限且操作负担可接受才支持；若宿主接口无法形成稳定白名单或额外确认抵消便利就停止。当前只建议个人可信LAN带密码小范围试用，出现意外权限、无法关闭或重复公开恢复就停止并回电脑原界面。

#### 证据与依据

**依据 1 · 源码核查**：[lib/service.mjs:304-369](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/service.mjs#L304-L369)

隧道单飞、取消和Promise所有权处理。

<details>
<summary>查看原文（66行）</summary>

```text
    /** 启动公网隧道（幂等；返回公网 URL）。进度写进 tunnelState。并发调用单飞。 */
    async startTunnel() {
      await this.startProxy();
      if (tunnel) return tunnel.url;
      if (tunnelPromise) return tunnelPromise; // 复用 in-flight，防孤儿 cloudflared
      const controller = new AbortController();
      tunnelAbort = controller;
      tunnelState.startedAt = Date.now();
      const onPhase = (phase) => {
        tunnelState.phase = phase;
        if (phase === 'downloading') tunnelState.detail = '首次下载 cloudflared（约 20MB）| first run downloads cloudflared (~20MB)';
        else if (phase === 'starting') tunnelState.detail = '启动隧道进程… | starting tunnel…';
        else if (phase === 'registering') tunnelState.detail = '连接 Cloudflare 边缘（通常 5-30 秒）| connecting to Cloudflare edge (usually 5-30s)';
        else if (phase === 'ready') tunnelState.detail = '隧道就绪 | ready';
      };
      // 先 `await null` 让函数体从微任务开始执行：否则在 `p` 初始化之前（getTunnelConfig
      // 之类的同步抛错）就会走到 finally，引用未初始化的 const 触发 TDZ 报错，
      // tunnelPromise 会永久停在 rejected —— 此后 startTunnel 一直复用这个失败的
      // promise，隧道再也起不来。
      const p = (async () => {
        await null;
        try {
          // 命名隧道（issue #66）：固定域名模式——URL 由设置里的域名拼出（cloudflared 不打印）
          const cfg = typeof getTunnelConfig === 'function' ? (getTunnelConfig() ?? {}) : {};
          if (cfg?.mode === 'named') {
            if (!cfg.token || !cfg.hostname) {
              throw new Error(
                '命名隧道未配置完整：需要 Tunnel Token 和固定域名（设置页「固定域名」里填写） | '
                + 'named tunnel is incomplete — set the Tunnel Token and the fixed hostname in Settings',
              );
            }
            const result = await startNamed({ token: cfg.token, home, signal: controller.signal, onPhase });
            tunnel = { url: `https://${cfg.hostname}`, kill: result.kill, onExit: result.onExit };
          } else {
            const result = await startTunnel({ port: proxy.port, home, signal: controller.signal, onPhase });
            // 归一化：startTunnel 契约返回 {url, kill}（字符串也兼容）
            tunnel = typeof result === 'string' ? { url: result, kill: () => {} } : result;
          }
          tunnelState.phase = 'ready';
          // M1：隧道进程运行中死亡（崩溃/被杀）→ 状态打回，别让 UI 永远显示"可用"
          tunnel.onExit?.((code) => {
            if (controller.signal.aborted) return; // 主动停止（stopTunnel）不算故障
            tunnelState.phase = 'error';
            tunnelState.detail = `隧道进程退出（code=${code}） | tunnel process exited (code=${code})`;
          });
          // 记录「隧道开启中」，供重启后自动恢复（issue #11）
          void persistAutoTunnel();
          // 公网隧道就绪 → 回调（快速模式轮换访问密码；命名模式不轮换，见 lib/index.js）
          try { onTunnelReady?.(cfg?.mode === 'named' ? 'named' : 'quick'); } catch { /* 忽略 */ }
          return tunnel.url;
        } catch (err) {
          // stopTunnel 触发的 abort 不算错误：保持 idle，别把状态刷成 error
          if (!controller.signal.aborted) {
            tunnelState.phase = 'error';
            tunnelState.detail = err?.message ?? String(err);
          }
          tunnelState.startedAt = null; // 失败后清掉计时，避免 UI 误显"启动中"
          throw err;
        } finally {
          // 只清自己的引用：stopTunnel 后立即 startTunnel 可能已建了新的 in-flight
          // （tunnelPromise=B），A 的 finally 不能把 B 清掉，否则第三次调用会并发 spawn
          if (tunnelPromise === p) tunnelPromise = null;
        }
      })();
      tunnelPromise = p;
      return p;
```

</details>

**依据 2 · 源码核查**：[lib/service.mjs:372-388](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/service.mjs#L372-L388)

停止与恢复标记的责任。

<details>
<summary>查看原文（17行）</summary>

```text
    /**
     * 停止公网隧道（代理保持）。
     * @param {{ keepAutoMarker?: boolean }} [opts] - keepAutoMarker=true 用于进程退出/
     *   自重启（dispose / pocketRestart）：隧道是随进程被动消失的，不是用户主动关闭，
     *   必须保留 tunnel-auto.json，下次启动才能自动恢复（issue #11 的本意）。
     *   默认（设置页手动关闭、恢复出厂）删除标记。
     */
    stopTunnel({ keepAutoMarker = false } = {}) {
      tunnelAbort?.abort();
      tunnelAbort = null;
      tunnelPromise = null; // 丢弃已 abort 的 in-flight（其 finally 会再清一次，无害）
      if (tunnel) tunnel.kill();
      tunnel = null;
      tunnelState.phase = 'idle';
      tunnelState.detail = '';
      tunnelState.startedAt = null;
      if (!keepAutoMarker) void clearAutoTunnel(); // 手动关闭后不再自动恢复
```

</details>

**依据 3 · 源码核查**：[lib/index.js:414-417](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/index.js#L414-L417)

宿主资源释放挂载。

```text
  ctx.effect(() => async () => {
    for (const d of disposers.reverse()) { try { d(); } catch { /* 忽略 */ } }
    await service.dispose();
  }, 'dsh-pocket: stop proxy and tunnel');
```

**依据 4 · 源码核查**：[lib/proxy.mjs:529-557](https://github.com/shaobeichen/dsh-pocket/blob/aee3ae7e97516206049394c7a37dc38778ffb6da/lib/proxy.mjs#L529-L557)

广泛信任转换是权限分层假设的起点。

<details>
<summary>查看原文（29行）</summary>

```text
 * 除 Host/Origin 外，还必须规范化 Referer 与 Sec-Fetch-Site：DSH 宿主的特权方法
 * 栅栏（settings.describe/credentials.* 等 PRIVILEGED_METHODS）会拒绝
 * sec-fetch-site === 'cross-site'，并校验 Origin 与 Host 匹配；远程访问的这两个头
 * 若不改写，设置/凭据平面会在宿主侧被 403（issue #58 的另一半）。
 * 统一小写化键名，避免 Node 原样转发时大小写键并存导致重复头。
 */
function loopbackAuthority(headers, upstream) {
  const authority = `${upstream.host}:${upstream.port}`;
  const out = {};
  for (const [k, v] of Object.entries(headers)) {
    const lk = k.toLowerCase();
    if (lk === 'host' || lk === 'origin' || lk === 'referer' || lk === 'sec-fetch-site') continue;
    out[lk] = v;
  }
  out.host = authority;
  out.origin = `http://${authority}`;
  const referer = headers.referer ?? headers.Referer;
  if (referer) {
    try {
      const ref = new URL(referer);
      ref.protocol = 'http:';
      ref.host = authority;
      out.referer = ref.toString();
    } catch {
      out.referer = `http://${authority}/`;
    }
  }
  out['sec-fetch-site'] = 'same-origin';
  return out;
```

</details>

#### 缺口

- 宿主RPC是否能稳定提供只读白名单及撤销语义
  **影响**：新入口仅为未验证设计，不计入已有能力
  **进一步探讨**：固定宿主验证读写任务、WS、重启与凭据过期，不能形成服务端约束则停止

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
