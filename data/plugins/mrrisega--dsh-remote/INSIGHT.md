# dsh-remote

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3c48a5f](https://github.com/mrRisega/dsh-remote/tree/3c48a5fdc41b8e64c0523ab2d146e78d1528effd)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mrRisega/dsh-remote) [![npm 30d 7,936](https://img.shields.io/static/v1?label=npm+30d&message=7%2C936&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mrrisega/dsh-remote) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mrrisega/dsh-remote)
<!-- END META -->

> **功能**：为DSH提供手机公网远程访问的CLI、受控机bridge、中继与原生Web配置插件套件。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)整套统一安装/设备选择/公网代理、Host会话接续及原生手机入口；root是CLI工具套件，原生插件仅子组件。

> **主要限制**：[Q03](#research-q03)自建所有key同local身份、设备ID可被有效JWT替换且仅告警，E2EE条件失败仍可v1；[Q04](#research-q04)局部目录切换不等整组安装/退出事务，不能推广为多租户或全程保密保证。

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
  - [Q01 · 整仓交付是什么，何时比VPN/SSH有用？](#detail-section-11)
  - [Q02 · 从安装到真实Host请求走哪条链？](#detail-section-12)
  - [Q03 · 自建身份、设备归属与E2EE究竟保护什么？](#detail-section-13)
  - [Q04 · 升级/后台与退出有什么可恢复性和维护代价？](#detail-section-14)
  - [Q05 · 整套系统值得验证的增量应落在哪里？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：根包@mrrisega/dsh-remote0.7.9是可发布CLI/远程访问工具套件，bin为dsh-setup.mjs；包含原生Web子插件、受控机bridge、开放relay-router和手机PWA，根条目应为tool而非把整个仓库称原生插件。目标是已有DSH电脑、要从手机异地继续原生对话、工具/审批/设置的人。合格结果应是连接正确机器、真实任务正确完成、审批/文件属于当前授权者且撤销后不可再用，不只是手机显示在线设备。

VPN/SSH访问原生Web、远程桌面和人工部署反向代理；Host模型/工具、TLS/WS与商业账号为依赖。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| CLI安装 | 配置/自启/原生子插件 | 多步骤部分成功，非事务 |
| relay设备/路由 | 公网选设备与HTTP/WS | JWT/sub核验，device自述可替换 |
| bridge | 请求到实际Host | Host权限/代持Cookie，非新沙箱 |
| 条件E2EE | 端到端内容保护 | 自建禁用/失败仍v1，TLS另配 |
| 自建/云模式 | 单信任域或外部账号服务 | local key同身份，商业系统未审 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node/DSH原生Host与模型 | 必需 | CLI/bridge/实际工具任务 | 根Node>=20，自建指南要求>=22；工具权在Host |
| 公网TLS端点/relay或SaaS | 公网必需 | HTTP/WS隧道与设备身份 | router自身非TLS，云身份未审 |
| 自建access key/JWT secrets或云账号 | 必需 | 注册/手机访问 | local key同subject，非独立租户 |
| 原生子插件/Host Cookie | 新Host接续按需 | 设置与已授权上游 | Cookie相当完整Host访问 |
| 系统自启、磁盘/备份访问控制 | 常驻必需 | 机器在线与密钥留存 | 停一个面板不等全停 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 一台隔离Host、单信任域、选SaaS/自建 | 核许可/身份/TLS和原生权限 |
| 安装 | 操作者审固定setup再部署 | 配置/服务/插件部分成功分别核 |
| 连接 | bridge注册、手机登录选设备 | JWT/sub/Host authority一致 |
| 任务 | 只读请求对原生审批/结果 | 不用online或200代替任务验收 |
| 恢复/退出 | 核原机效果，停服务撤key/设备并核旧手机失效 | 未知副作用不盲重试，留存按归属清 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | SaaS或公网服务器/域名/模型金额未知 | 安装/TLS/密钥与scope核验 | README固定报价非当前价格 |
| 持续 | 在线机器/带宽/token/日志未知 | 平台升级、成员和模式核对 | 净节时无对照 |
| 故障 | 重连/补装资源未知 | 多层状态/原机效果/回滚核查 | 局部原子切换非全事务 |
| 退出 | 备份/远端留存未知 | 停服务、撤设备/密钥/profile清理 | 插件卸载不等整套撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 公网接续 | 实际安装/代理/Host链 | 所有手机和真实任务收益 |
| 设备授权 | JWT/sub核验与帧归属 | SaaS撤销/自建设备独立身份 |
| 加密 | 条件E2EE派生/模式 | 全协议密码学/对端脚本信任 |
| 恢复 | stage检查与尽力rollback | 全组跨平台恢复/退出失效 |

> **思考**：[Q03](#research-q03)自建所有key同local身份、设备ID可被有效JWT替换且仅告警，E2EE条件失败仍可v1；[Q04](#research-q04)局部目录切换不等整组安装/退出事务，不能推广为多租户或全程保密保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)整套统一安装/设备选择/公网代理、Host会话接续及原生手机入口；root是CLI工具套件，原生插件仅子组件。

流cap协商、帧回包device归属和stage自检可借鉴；设备自述替换与共享local身份是关键边界，升级/会话/传输成功不能代业务结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)自建所有key同local身份、设备ID可被有效JWT替换且仅告警，E2EE条件失败仍可v1；[Q04](#research-q04)局部目录切换不等整组安装/退出事务，不能推广为多租户或全程保密保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人单信任域非敏感Host受限试用，先一台电脑/手机、只读任务与撤销失效验证。自建多key仍同身份，不能拿来多人分权；明确实际E2EE与TLS条件。故障回原生Web查效果，无法核撤销/身份则停整套回VPN。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态确认整套公网桥接与安装/归属/模式边界；个人单信任域非敏感任务受限试用，商业服务/完整密码学和手机全功能未验。

- 已检查：作者 README、包清单、源码路径 README.md、clients/dsh-remote/dsh-bridge.mjs、clients/dsh-remote/e2ee-client.mjs、docs/self-hosting.md、dsh-setup.mjs、package.json、packages/dsh-remote-web/lib/index.js、packages/relay-router/src/index.mjs、packages/relay-router/src/jwt.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：独立核根README/package/setup默认与安装/卸载/目录切换、relay JWT/local登录/设备注册替换/HTTP/WS/帧归属、bridge路径/headers/Host Cookie/E2EE条件与E2eeService工厂/KDF；Web半部补装/遥测/秘密作依赖复核。未全审手机PWA/所有帧/部署脚本/商业API、密码学和全部平台恢复。
- 下一步：只读固定源码，未执行目标/安装器/中继/手机/攻击或测试；一般冒烟为scope_boundary，实际任务收益/端到端授权与恢复仍缺独立结果。

**分析版本**

- **仓库**：[mrRisega/dsh-remote](https://github.com/mrRisega/dsh-remote)
- **版本号**：0.7.9（[固定提交 3c48a5f](https://github.com/mrRisega/dsh-remote/tree/3c48a5fdc41b8e64c0523ab2d146e78d1528effd)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的principal设备归属绑定、按需独立自建subject与可核撤销/加密状态，用双用户抢占/撤销和故障对照验证净收益。

只读固定源码，未执行目标/安装器/中继/手机/攻击或测试；一般冒烟为scope_boundary，实际任务收益/端到端授权与恢复仍缺独立结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 3896 | — | — | 59190 |
| .mjs | source | 20 | 23609 | 15638 | 7349 | — |
| .js | source | 6 | 17017 | 11872 | 5088 | — |
| .mjs | test | 118 | 40272 | 31529 | 6562 | — |
| .cjs | source | 1 | 49 | 28 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/mrRisega/dsh-remote/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/mrRisega/dsh-remote/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mrRisega/dsh-remote/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立核整套CLI/bridge/router的交付与身份、加密、恢复和成本边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 整仓交付是什么，何时比VPN/SSH有用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根包@mrrisega/dsh-remote0.7.9是可发布CLI/远程访问工具套件，bin为dsh-setup.mjs；包含原生Web子插件、受控机bridge、开放relay-router和手机PWA，根条目应为tool而非把整个仓库称原生插件。目标是已有DSH电脑、要从手机异地继续原生对话、工具/审批/设置的人。合格结果应是连接正确机器、真实任务正确完成、审批/文件属于当前授权者且撤销后不可再用，不只是手机显示在线设备。

CLI默认setup，支持run/plugin/repair/doctor/status，统一安装/配置和后台生命周期；原生Web插件只是其中配置/会话接续一环。相对VPN/SSH访问Web或远程桌面，整套减少公网接入/设备选择与移动交互拼接；成熟反向代理、WebSocket和DSH本体是继承技术，不把模型/所有工具算自创。开放版提供访问密钥自建，SaaS账号/套餐/后台是外部商业依赖，不能从开源JWT兼容宣称审过整套商业身份系统。

README的手机100%与E2EE主张尚无独立结果，且同页安全段注明分阶段开启、默认HTTPS。价格只属固定README作者报价，本报告不作为当前购买依据；没有用户/任务对照可证明它胜过已经部署好的VPN。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-35](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/README.md#L1-L35)

作者用途/功能与架构。

<details>
<summary>查看原文（35行）</summary>

````text
# dsh-remote — 手机远程控制 DeepSeek Harness（全功能 · App 级体验）

<p align="left">
  <a href="https://github.com/mrRisega/dsh-remote/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/mrRisega/dsh-remote?style=flat-square&label=Stars"></a>
  <img alt="npm downloads" src="https://img.shields.io/npm/dt/@mrrisega/dsh-remote?style=flat-square&label=npm%20downloads">
  <img alt="DeepSeek Harness" src="https://img.shields.io/badge/DeepSeek%20Harness-plugin-4f8cff?style=flat-square">
  <img alt="dsh-plugin" src="https://img.shields.io/badge/topic-dsh--plugin-blueviolet?style=flat-square">
  <img alt="Node" src="https://img.shields.io/badge/Node.js-%3E%3D20-339933?style=flat-square&logo=node.js&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-PolyForm%20Noncommercial-2ea44f?style=flat-square">
</p>

> **离开电脑也能用手机 100% 全功能接管电脑上的 DeepSeek Harness（`dsh web`）**——发消息、看工具执行、审批权限、改设置、管凭据，体验与坐在电脑前一致。免内网穿透，局域网即连。
>
> **一条命令安装**：`npx @mrrisega/dsh-remote`

## 核心功能

- **100% 全功能接管**：`dsh web` 的 HTTP / WebSocket 全量透传 —— 对话、工具执行与输出、审批、设置、凭据（含特权操作）都能在手机上完成，不是阉割版。
- **免内网穿透**：电脑端 bridge 主动连中继注册为在线设备，手机浏览器打开 PWA 即可用；不需要公网 IP，也不用配路由器。
- **端到端加密（E2EE）**：内容在离开手机前用你的账号密码派生密钥加密、进入电脑后才解密；中继只见路由元数据（路径、大小、时间），读不到内容。
- **微信机器人通道**：任务完成 / 出错 / 需要拍板时推到微信；在微信里**回一个数字**就能完成审批，会员还能直接派活、切换会话。
- **两端体验一致**：手机 PWA 还原电脑端界面；电脑端 `dsh web` 侧栏新增「📱 远程访问」入口。
- **一条命令 + 开机自启**：自动装好 bridge 与 dsh web 插件，并按平台配置自启动与崩溃自愈（macOS launchd / Linux systemd --user / Windows 任务计划程序）。
- **两种模式随时切**：官方云服务（手机号登录、含超管后台）或自建 relay（访问密钥认证），面板一键切换，互不影响。
- **插件市场可装**：在 dsh 插件市场搜索 **`dsh-remote-web`** 即可；桌面运行环境由插件在后台自动补齐。

```
手机浏览器
  └─ /app/ (PWA) 登录 → /_devices 设备列表 → 选择设备
       │
  nginx (HTTPS)
    ├─ /app/     → 静态 PWA
    ├─ /_devices /_login /remote/ → relay-router
    └─ /_bridge  → relay-router (WebSocket)
                     └→ bridge (电脑端) → 127.0.0.1:3080 (dsh web)
````

</details>

**依据 2 · 作者声明**：[README.md:48-84](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/README.md#L48-L84)

开放/SaaS和加密条件。

<details>
<summary>查看原文（37行）</summary>

````text
## 两个版本

| | 开源版（本仓库） | SaaS 云服务版 |
|---|---|---|
| 服务器 | 你自己部署（任意有公网 IP 的机器） | 由服务商托管 |
| 账号体系 | 无需账号：访问密钥认证 | 手机号 + 短信验证码 |
| 后台管理 | 无（密钥即实例管理员） | 超管后台（用户 / 套餐 / 审计） |
| 许可证 | 本仓库（见下文 License） | 商业授权，闭源 |

> 👉 **不想自建服务器 / 没有公网 IP？** 直接用**官方云服务版**（无公网、4G、异地都稳定，多设备 + 超管后台）：
> **https://n.risegao.cn:13443/app/** —— 免费版 + PRO ¥19/月 + Pro Max ¥49/月，新用户送 7 天 PRO。
> 客户端仍是同一条安装命令，登录后选「云服务模式」即可。

## 安装

需要 Node.js ≥ 20（macOS / Linux / Windows 均可）。电脑端**一条命令**：

```bash
npx @mrrisega/dsh-remote
```

装完**无需任何命令**：打开 `dsh web` → 设置 → 「远程访问」，注册 / 登录手机号即可
（注册在手机端完成；登录后 bridge 自动启动）。自建用户在同一个面板切「自建服务」标签。

自建模式（已部署 relay-router，无需账号体系）：

```bash
npx @mrrisega/dsh-remote setup --server wss://<你的域名>:端口 --key <访问密钥>
```

其他命令：`status` 查看状态、`run` 前台调试、`plugin` 重装 / 卸载 dsh web 插件；`--help` 看完整说明。
升级与卸载都在面板里：dsh web → 设置 → 「远程访问」→「🔄 版本与更新」（检测新版 / 一键在线更新 / 彻底卸载）。

## 安全与隐私

- **传输**：全程 HTTPS / WSS；远程访问需先在电脑端登录你的账号，一次性扫码链接 30 分钟有效、访问一次即失效、可随时取消配对。
- **端到端加密（E2EE）**：开启后内容在中继侧不可读（中继只见路径、大小、时间）。这是**分阶段开启**的功能（服务端开关逐步放量，默认关闭 = 走 HTTPS），面板会显示当前加密状态与原因，不会静默降级。服务端只保存密码经不可逆 KDF 派生的校验值，**不保存明文密码、也不保存解密密钥**——请牢记密码，改密会使旧设备会话全部失效。协议见 [docs/e2ee-protocol.md](docs/e2ee-protocol.md)。
````

</details>

**依据 3 · 源码核查**：[package.json:1-52](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/package.json#L1-L52)

根CLI/发行范围/Node而非原生Host入口。

<details>
<summary>查看原文（52行）</summary>

```text
{
  "name": "@mrrisega/dsh-remote",
  "version": "0.7.9",
  "description": "手机远程控制 DeepSeek Harness · Remote control DeepSeek Harness (dsh web) from any phone browser — 100% 全功能 App 级体验：发消息、看工具执行、审批权限、改设置、管凭据，含特权操作，免内网穿透。一条命令安装 npx @mrrisega/dsh-remote。Mobile remote control for DSH, self-host or SaaS, no server needed on LAN.",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "remote-control",
    "mobile",
    "手机远程控制",
    "远程控制",
    "反向代理",
    "pwa",
    "reverse-proxy",
    "self-hosted",
    "phone",
    "web-remote"
  ],
  "type": "module",
  "license": "PolyForm-Noncommercial-1.0.0",
  "private": false,
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mrRisega/dsh-remote.git"
  },
  "bugs": {
    "url": "https://github.com/mrRisega/dsh-remote/issues"
  },
  "homepage": "https://github.com/mrRisega/dsh-remote#readme",
  "bin": {
    "dsh-remote": "dsh-setup.mjs"
  },
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "dsh-setup.mjs",
    "clients/dsh-remote",
    "packages/dsh-remote-web",
    "docs/self-hosting.md",
    "docs/telemetry.md",
    "scripts/test-net-guard.cjs"
  ],
  "workspaces": [
    "packages/*",
    "clients/*"
  ],
  "engines": {
    "node": ">=20"
  },
  "scripts": {
```

</details>

**依据 4 · 源码核查**：[dsh-setup.mjs:3675-3688](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/dsh-setup.mjs#L3675-L3688)

真实CLI默认与分支。

<details>
<summary>查看原文（14行）</summary>

```text
const raw = process.argv[2];
const cmd = raw && !raw.startsWith("-") ? raw : "setup";
const args = raw && !raw.startsWith("-") ? process.argv.slice(3) : process.argv.slice(2);
if (cmd === "setup" || cmd === "install") await setup(args);
else if (cmd === "settings") settingsHint();
else if (cmd === "run") await runBridge();
else if (cmd === "plugin") await pluginCmd(process.argv.slice(3));
else if (cmd === "repair") repairProfile(process.argv.slice(3));
else if (cmd === "doctor") await doctorCmd(process.argv.slice(3));
else if (cmd === "status") {
  const cfg = loadConfig();
  const local = Boolean(cfg.local_key);
  console.log("配置文件:", CONFIG_PATH);
  console.log("连接模式:", local ? `自建服务（${cfg.tunnel_url || "未设置服务器地址"}）` : `SaaS 云端服务（${cfg.phone || "未配置账号"}）`);
```

</details>

#### 缺口

- 手机完整交互、真实公网效果和用户是否需多设备入口未独立验。
  **影响**：不能把100%或套餐报价当运行/需求证明。
  **进一步探讨**：用同一个非敏感任务对照已有VPN与整套，记录真实结果、人审/恢复和退出访问。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从安装到真实Host请求走哪条链？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

setup识别--server/--key自建参数，先写tunnel_url/local_key并删云账号，再POST /_login校验密钥，失败退出；所以验证失败也可能已改变本地配置，安装不是整组事务。云模式保存API/tunnel，缺bridge_secret时取public-config；随后探测上游并安装自启，再尝试原生子插件，插件失败仅警告不阻断。只有确认实际Host激活/bridge在线/手机请求结果才能称可用。

开放中继/_bridge接WS tunnel-register，校验JWT和deviceId格式，把设备存入实时Map。手机HTTP与WS均authorizeRemote：Cookie JWT有效、设备online且dev.userId等claims.sub；HTTP经帧ID登记待回包到bridge，WS同样注册pendingUpgrade。bridge校验safePath仅允许以/开头、禁止控制符/反斜杠/协议相对和scheme路径，然后向已选UPSTREAM代理。HTTP/WS剥手机Origin/Cookie等头，附代持的Host Cookie；原生Host继续负责工具、审批与沙箱。

流式能力由router在注册ack声明http-stream，旧relay可降为整包。响应帧会逐分支核pending记录deviceId归属，避免另一设备猜帧ID插包；这是真实工程边界，不是证明所有授权/加密无缺陷。设备断线/超时/取消需原生结果复核，代理失败不等Host动作未发生。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-setup.mjs:2212-2261](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/dsh-setup.mjs#L2212-L2261)

先写配置后自建校验/失败。

<details>
<summary>查看原文（50行）</summary>

```text
async function setup(argv) {
  const api = argValue(argv, "--api");
  const server = argValue(argv, "--server");
  const key = argValue(argv, "--key");
  const noAutostart = hasFlag(argv, "--no-autostart");
  const noPlugin = hasFlag(argv, "--no-plugin");
  const noRestart = hasFlag(argv, "--no-restart");
  const selfHosted = Boolean(server || key);

  let cfg = loadConfig();
  // 接入标识（可选）：本次带合法 `--ref <数字>`（或环境变量 DSH_REF）才写入；没带/非法 →
  // **保留**配置里已有的值。⚠️ saveConfig 是整对象覆盖写，所以必须在刚 loadConfig() 的这份
  // 对象上合并再写回 —— 绝不能新建对象，否则升级装一次就把上一次的归因清空了。
  // 非法值静默忽略：归因是附加信息，绝不能因此让安装失败。
  cfg = applyRefCodeToConfig(cfg, argv);

  if (selfHosted) {
    if (!server || !key) {
      console.error("❌ 自建模式需要 --server（wss://host:port）与 --key（访问密钥）两个参数。");
      process.exit(1);
    }
    cfg.tunnel_url = normalizeTunnelUrl(server);
    cfg.local_key = String(key).trim();
    delete cfg.phone; delete cfg.password;
    saveConfig(cfg);

    // 校验：用访问密钥向 router 换本地 JWT（连不通立即报错）
    const u = new URL(cfg.tunnel_url);
    u.protocol = u.protocol === "wss:" ? "https:" : "http:";
    u.pathname = "/_login";
    try {
      const r = await fetch(u.toString(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: cfg.local_key }),
        signal: AbortSignal.timeout(8000)
      });
      const d = await r.json().catch(() => ({}));
      if (r.status !== 200 || !d.token) {
        console.error(`❌ 访问密钥校验失败（${r.status}）: ${d.error?.message || "未知错误"}`);
        process.exit(1);
      }
      console.log("✅ 已连接你的 relay-router，访问密钥有效。");
    } catch (e) {
      console.error(`❌ 无法连接 ${u.toString()}: ${e.message}`);
      console.error("   请确认服务器地址、端口与 TLS 配置（自建需 https/wss 入口）。");
      process.exit(1);
    }
  } else {
    // 默认云端服务：无需任何参数；登录在设置页完成
```

</details>

**依据 2 · 源码核查**：[dsh-setup.mjs:2262-2312](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/dsh-setup.mjs#L2262-L2312)

云模式、服务与非致命插件安装。

<details>
<summary>查看原文（51行）</summary>

```text
    cfg.api_url = (api || cfg.api_url || DEFAULT_API).replace(/\/+$/, "");
    if (!cfg.tunnel_url) cfg.tunnel_url = deriveTunnelUrl(cfg.api_url);
    // 自动获取服务端下发的 bridge_secret（device-login 共享密钥，一键安装开箱即用）
    if (!cfg.bridge_secret) {
      const pub = await fetchPublicConfig(cfg.api_url);
      if (pub.bridge_secret) cfg.bridge_secret = String(pub.bridge_secret);
    }
    saveConfig(cfg);
  }

  let svc = { path: null, status: { ok: true, status: "skipped", detail: "--no-autostart" } };
  if (!noAutostart) {
    // ⚠️ 顺序要紧：**先**探测并钉住上游，**再**写自启动文件 ——
    // 否则 plist 里不会带上 DSH_BRIDGE_UPSTREAM（实测踩到：打印说已钉住，plist 里却没有）。
    try {
      const pluginTargets = targetProfileDirs(argv);
      if (!PINNED_UPSTREAM && pluginTargets.some((t) => t.name === "desktop")) {
        const p = desktopAppPort();
        if (p) {
          // 🔴 2026-10-25：这里只能写运行时端口文件；**不能**回填 PINNED_UPSTREAM ——
          // 它会被写进 launchd plist 变成永久显式指定，dsh 换端口后守护/桥永远连旧端口
          // （用户实测 upstream_unreachable）。
          try { fs.writeFileSync(path.join(CONFIG_DIR, UPSTREAM_FILE), `http://127.0.0.1:${p}` + "\n"); } catch { /* 忽略 */ }
          console.log(`ℹ 桌面端在 127.0.0.1:${p} 监听 → 已写入运行时上游端口（不再钉进自启动配置）`);
        }
      }
    } catch { /* 探测失败不阻断安装 */ }
    svc = installAutostart();
  } else {
    console.log("ℹ --no-autostart：跳过自启动服务安装（可用 `dsh-remote run` 手动运行 bridge）。");
  }
  const st = svc.status;

  // 自动安装 dsh web 插件（非致命：失败只提示，不阻断安装）
  let pluginResult = null;
  if (!noPlugin) {
    try {
      // ⚠️ 必须把 `--profile` **透传下去**：否则 `--profile desktop`（桌面端）会被静默忽略，
      // 插件装进 Web 版 profile，而用户面对的是桌面端 —— 面板永远不出现。
      // 未指定 --profile 时目标是本机全部 profile：桌面端提醒与后续判定都要按同一份列表来
      const pluginTargets = targetProfileDirs(argv);
      for (const t of pluginTargets) warnIfDesktopProfile(t.dir);
      pluginResult = await pluginCmd(profileArgvOf(argv));
    } catch (e) {
      console.warn(`⚠️ 插件安装未完成：${e.message}`);
    }
  }

  // 插件是**进程启动时**装载的：刚装进 profile 的插件，运行中的 dsh web 里并没有
  // （既没有 /dsh-remote/* 路由，也没有「设置 → 远程访问」面板项）。
  // 这里做一个确定性判断：进程启动时间早于插件落盘时间 → 必须重启 dsh web 才生效。
```

</details>

**依据 3 · 源码核查**：[packages/relay-router/src/index.mjs:990-1013](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L990-L1013)

bridge注册实际JWT/格式。

<details>
<summary>查看原文（24行）</summary>

```text
  ws.on("message", (raw) => {
    receive(raw, (frame) => {
      if (!frame || typeof frame !== "object") return;
      if (frame.type === "tunnel-register") {
        const { deviceId, token, name, caps } = frame;
        const claims = verifyAnyJwt(token);
        if (!claims) {
          try {
            ws.send(JSON.stringify({ type: "tunnel-register-err", code: "bad_token", message: "JWT 无效或过期" }));
            ws.close(4003, "bad token");
          } catch {
            ws.terminate();
          }
          return;
        }
        if (typeof deviceId !== "string" || !DEVICE_ID_RE.test(deviceId)) {
          try {
            ws.send(JSON.stringify({ type: "tunnel-register-err", code: "bad_device", message: "deviceId 格式非法" }));
            ws.close(4002, "bad deviceId");
          } catch {
            ws.terminate();
          }
          return;
        }
```

</details>

**依据 4 · 源码核查**：[packages/relay-router/src/index.mjs:1040-1057](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L1040-L1057)

设备Map和能力ack。

<details>
<summary>查看原文（18行）</summary>

```text
          ws,
          deviceId,
          userId: String(claims.sub),
          plan: claims.plan || "free",
          name: typeof name === "string" ? name : deviceId,
          caps: Array.isArray(caps) ? caps.map(String).filter(Boolean) : [], // E2EE caps 原样记录(§6.2)
          connectedAt: Date.now()
        };
        devices.set(deviceId, dev);
        clearTimeout(regTimer);
        try {
          // caps:告诉 bridge 本中继支持哪些**追加**帧协议。
          // 为什么要有这一步:新 bridge 的 SSE 流式帧(http-chunk/http-end)对旧中继是不认识的,
          // 旧中继会把"仅头部"帧当成完整响应直接 end → SSE 变成"秒断+狂重连",比原来的
          // 120s 挂起更糟。所以能力由**中继**声明,bridge 没有这个 caps 就退回旧的整包缓冲行为。
          ws.send(JSON.stringify({ type: "tunnel-register-ok", deviceId, caps: ROUTER_FRAME_CAPS }));
        } catch {
          /* ignore */
```

</details>

**依据 5 · 源码核查**：[packages/relay-router/src/index.mjs:803-810](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L803-L810)

真实远程授权。

```text
function authorizeRemote(req, deviceId) {
  const claims = verifyAnyJwt(getCookie(req, "dsh_token"));
  if (!claims) return { error: "unauthorized" };
  const dev = devices.get(deviceId);
  if (!dev || dev.ws.readyState !== WebSocket.OPEN) return { error: "offline" };
  if (String(dev.userId) !== String(claims.sub)) return { error: "forbidden" };
  return { claims, dev };
}
```

**依据 6 · 源码核查**：[packages/relay-router/src/index.mjs:894-950](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L894-L950)

HTTP授权错误/帧pending发送。

<details>
<summary>查看原文（57行）</summary>

```text
  const { deviceId, path } = parsed;
  const auth = authorizeRemote(req, deviceId);
  if (auth.error === "unauthorized") {
    // 页面导航 → 回 APP 外壳（设备列表或登录页）；接口/子资源 → JSON 401（不再 302 成 HTML）
    if (isDocNavigation(req)) {
      guideToApp(res, "expired");
      return;
    }
    const r = jsonBody(401, { error: { code: "unauthorized", message: "登录状态无效或已过期" } });
    res.writeHead(r.status, r.headers);
    res.end(r.body);
    return;
  }
  if (auth.error === "offline") {
    if (isDocNavigation(req)) {
      guideToApp(res, "offline", { device: deviceId, name: devices.get(deviceId)?.name || "" });
      return;
    }
    errorPage(req, res, 502, "电脑端未连接", `设备 ${deviceId} 的 bridge 当前离线。请先在电脑上运行 dsh-bridge 隧道模式,再刷新本页。`);
    return;
  }
  if (auth.error === "forbidden") {
    if (isDocNavigation(req)) {
      guideToApp(res, "forbidden", { device: deviceId });
      return;
    }
    errorPage(req, res, 403, "无权访问", "该设备不属于当前账号。");
    return;
  }
  const { claims, dev } = auth;

  // E2EE:信封即信号 —— 标记头存在即说明正文是密文(透明转发,不解析;计数观测)
  if (isE2eeMarked(req.headers)) noteE2ee(dev, "http");

  // 读请求体(上限内)→ 发帧给 bridge
  let bodyBuf = Buffer.alloc(0);
  try {
    bodyBuf = await readBody(req);
  } catch {
    res.writeHead(413, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: { code: "body_too_large", message: "请求体超过 64MB" } }));
    return;
  }

  const id = nextFrameId();
  const frame = {
    id,
    type: "http",
    method: req.method || "GET",
    path,
    headers: sanitizeFwdHeaders(req.headers),
    ...(bodyBuf.length ? { body: bodyBuf.toString("base64"), bodyBase64: true } : {})
  };
  pendingHttp.set(id, { res, method: req.method || "GET", path, deviceId, userId: claims.sub, plan: claims.plan, t0: Date.now() });
  if (!sendToBridge(dev, frame)) {
    pendingHttp.delete(id);
    errorPage(req, res, 502, "电脑端未连接", `设备 ${deviceId} 的 bridge 连接已断开。`);
```

</details>

**依据 7 · 源码核查**：[packages/relay-router/src/index.mjs:1273-1308](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L1273-L1308)

WS也用相同授权与pending。

<details>
<summary>查看原文（36行）</summary>

```text
  // 手机 WS 隧道:/remote/<deviceId>/<path>
  const parsed = resolveRoute(req, url);
  if (!parsed) {
    rejectUpgrade(socket, 404, "not found");
    return;
  }
  const { deviceId, path } = parsed;
  const auth = authorizeRemote(req, deviceId);
  if (auth.error === "unauthorized") {
    rejectUpgrade(socket, 302, "未登录,请先 /login/ 登录");
    return;
  }
  if (auth.error === "offline") {
    rejectUpgrade(socket, 502, "电脑端未连接(设备 " + deviceId + " 的 bridge 当前离线)");
    return;
  }
  if (auth.error === "forbidden") {
    rejectUpgrade(socket, 403, "无权访问该设备");
    return;
  }
  const { claims, dev } = auth;

  // E2EE 标记数据流(ws-open query 带 e2ee=,§4.6):router 把参数原样透传给 bridge(它负责剥离),
  // 这里仅识别 + 计数观测,不解析任何载荷。
  if (url.searchParams.get("e2ee")) noteE2ee(dev, "ws");

  const id = nextFrameId();
  const pu = {
    req,
    socket,
    head,
    deviceId,
    userId: claims.sub,
    plan: claims.plan,
    timer: null,
    path
```

</details>

**依据 8 · 源码核查**：[packages/relay-router/src/index.mjs:1120-1138](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L1120-L1138)

实际HTTP回应归属校验。

<details>
<summary>查看原文（19行）</summary>

```text
function onBridgeFrame(dev, frame) {
  const { id, type } = frame;
  if (id === undefined || id === null) return;

  // 🔴 这里查到的每一条待回包记录都必须校验**归属**（2026-09-27 安全审计 F-01）。
  //    `pendingHttp` / `pendingUpgrade` / `tunnelSessions` 都是**全局** Map，键是帧号；
  //    而帧号原先是全局自增可猜的。若不校验，任意账号的 bridge 只要回一帧同 id 的响应，
  //    就能把 body 写进**别人**的 HTTP 响应（在 relay 源上执行任意脚本 → 读走非 HttpOnly 的
  //    dsh_token → 以受害者身份驱动其电脑）、或往别人的 WS 隧道里塞数据。
  //    判据统一为 `x.deviceId === dev.deviceId`（与本文件 cleanupDevice 早已在做的比对一致）。
  //    ⚠️ 每个分支各自查不同的表，所以校验必须**分别写**，不要在函数开头统一拦。

  if (type === "http") {
    const p = pendingHttp.get(id);
    if (!p) return;
    if (p.deviceId !== dev.deviceId) return; // 归属校验(F-01)：不许回别人的包

    // ── SSE 流式响应(2026-09-23)────────────────────────────────────────────
    // bridge 遇到 `text/event-stream` 时不再整包缓冲:先发**仅头部**帧(streaming:true),
```

</details>

**依据 9 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:963-968](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L963-L968)

代理实际路径过滤。

```text
function safePath(path) {
  if (typeof path !== "string" || !path.startsWith("/")) return null;
  if (/[\x00-\x1f\x7f\\]/.test(path)) return null;        // 控制字符/反斜杠(SSRF:无前导 / 已在上面拒绝,@ 在路径段里无害,如 /plugins/@deepseek-ai/)
  if (path.startsWith("//") || /^\/[^/]*:/.test(path)) return null; // 协议相对或 scheme
  return path;
}
```

**依据 10 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:899-933](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L899-L933)

请求头清洗与WS Host Cookie。

<details>
<summary>查看原文（35行）</summary>

```text
/** 清洗手机发来的请求头:剥离浏览器标记,保留其余(供 fetch 转发)。 */
export function sanitizeRequestHeaders(headers) {
  const out = {};
  for (const [k, v] of Object.entries(headers || {})) {
    const lk = k.toLowerCase();
    if (STRIP_REQ_HEADERS.has(lk)) continue;
    if (v === undefined || v === null || v === "") continue;
    out[k] = Array.isArray(v) ? v.join(", ") : String(v);
  }
  return out;
}

/** 清洗上游响应头:剥离实体/传输头,避免误导浏览器解码。 */
export function sanitizeResponseHeaders(headers) {
  const out = {};
  for (const [k, v] of Object.entries(headers || {})) {
    const lk = k.toLowerCase();
    if (STRIP_RES_HEADERS.has(lk)) continue;
    if (v === undefined || v === null || v === "") continue;
    out[k] = Array.isArray(v) ? v.join(", ") : String(v);
  }
  return out;
}

/** ws 库用的请求头:Host 显式写成上游 authority(loopback),其余同 sanitize。 */
export function buildWsHeaders(headers) {
  const up = new URL(UPSTREAM);
  const out = sanitizeRequestHeaders(headers);
  out.Host = up.host; // e.g. "127.0.0.1:3080"
  const ck = harnessCookieOf(); // 新版 dsh web 的浏览器会话 Cookie
  if (ck) out.Cookie = ck;
  return out;
}

// ============================================================
```

</details>

**依据 11 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:1172-1187](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L1172-L1187)

HTTP实际附cookie代理。

<details>
<summary>查看原文（16行）</summary>

```text
 */
async function doHttpStream(send, id, method, path, reqHeaders) {
  const safe = safePath(path);
  if (safe === null) throw new Error("非法路径");
  const reqHdrs = sanitizeRequestHeaders(reqHeaders);
  const ck = harnessCookieOf(); // 新版 dsh web 的浏览器会话 Cookie(否则 401 白页)
  if (ck) reqHdrs.Cookie = ck;
  const controller = new AbortController();
  streamAborts.set(id, controller);

  let res;
  try {
    res = await fetch(`${UPSTREAM}${safe}`, { method, headers: reqHdrs, signal: controller.signal });
  } catch (e) {
    streamAborts.delete(id);
    throw e; // 头部都还没发出去 → 交给调用方回一个普通错误帧
```

</details>

#### 缺口

- 全部帧类型/超时、Host效果及云API真实返回未执行。
  **影响**：不能承诺恰好一次任务或全协议安全。
  **进一步探讨**：在本地可丢弃Host/中继对照断线、旧cap和重投，核原机效果再恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自建身份、设备归属与E2EE究竟保护什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

自建/_login只判断key是否在LOCAL_ACCESS_KEYS，所有有效key都signLocalJwt("local","pro_max")。因此多把key并不形成独立用户/租户；同一sub可见/访问同信任域设备，需把访问密钥看成实例根凭据。真实本地JWT默认30天、最短7天，续签还设绝对期限；旧self-hosting仍写2小时，不能照文档作为短期凭据保证。verifyJwt实际核HMAC恒时比较、alg=HS256、exp；密钥/令牌留存与撤销是不同问题。

设备ID由bridge自述，中继发现已有同ID就关闭旧WS并替换，即使跨账号也仅告警。随后每次远程请求核sub，所以这不能直接断言会把受害请求转给攻击者；但拥有有效JWT并知道ID者可顶掉连接，属于源码确认的可用性/归属绑定缺口，未进行攻击。不能因deviceId难猜就当身份所有权已验证。

E2EE是条件能力而非默认所有模式：bridge自建local_key或显式关闭令allowed=false，E2eeService还要求token、密码和成功参数，派生失败禁用；未启用时继续v1隧道。PBKDF2从规范化密码与带标签salt派生MK，具体对端协议/页面密钥交付与商业服务未完整审计，不能认定中继绝无读取能力。v1是未端到端加密内容，不等HTTPS传输裸奔。生产TLS需nginx/Caddy，router自身HTTP/WS，不能直接公网明文部署。

#### 证据与依据

**依据 1 · 源码核查**：[packages/relay-router/src/index.mjs:79-113](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L79-L113)

本地认证和实际30天/最短7天配置。

<details>
<summary>查看原文（35行）</summary>

```text
// v2 开源本地认证(自部署模式):DSH_LOCAL_JWT_SECRET 与 DSH_LOCAL_ACCESS_KEYS 同时设置时启用。
//   - 自部署者不依赖闭源 enterprise 账号体系:bridge/App 用访问密钥调 POST /_login 换本地 JWT;
//   - router 校验 JWT 时依次尝试 enterprise 密钥与本地密钥;
//   - 开源自部署与 SaaS 可随时切换(客户端连接模式配置,见 dsh-remote-web)。
const LOCAL_JWT_SECRET = process.env.DSH_LOCAL_JWT_SECRET || "";
const LOCAL_ACCESS_KEYS = (process.env.DSH_LOCAL_ACCESS_KEYS || "")
  .split(",").map((s) => s.trim()).filter(Boolean);
const LOCAL_AUTH_ENABLED = Boolean(LOCAL_JWT_SECRET && LOCAL_ACCESS_KEYS.length);
if (LOCAL_JWT_SECRET && !LOCAL_ACCESS_KEYS.length) {
  logger.warn("[router] 已设 DSH_LOCAL_JWT_SECRET 但无 DSH_LOCAL_ACCESS_KEYS,本地认证未启用");
}
if (LOCAL_AUTH_ENABLED) logger.info("[router] 本地认证已启用(开源自部署模式,POST /_login)");

// 本地会话时长(自部署模式)。用户反馈「手机端一天要登录好多次」的根因之一:
// 本地 JWT 曾写死 2 小时(exp: now + 7200)且**没有任何续签** —— 自建用户每 2 小时就得重新输一次访问密钥。
// 为什么默认 30 天:与 SaaS 侧 auth_session_ttl_ms 的默认口径对齐,同一产品不该有两套时长。
// 为什么硬夹 [7 天, 1 年]:用户明确要求「至少保留 7 天以上」,配置漂移(手滑写成 1h/1ms)也不许低于它;
//   上限 1 年是因为更长的会话没有安全收益 —— 滑动续签 + sat 绝对锚已经解决了「老掉线」。
// 为什么非法值(NaN / ≤0)回落**默认**而不是夹到下限:写错的值通常是笔误,回落默认最不意外。
const LOCAL_SESSION_TTL_DEFAULT_MS = 30 * 24 * 60 * 60 * 1000;
const LOCAL_SESSION_TTL_MIN_MS = 7 * 24 * 60 * 60 * 1000;
const LOCAL_SESSION_TTL_MAX_MS = 365 * 24 * 60 * 60 * 1000;

/** 解析毫秒环境变量:非法/≤0 → 回落 def,再夹到 [min, max]。 */
function clampMsEnv(raw, def, min, max) {
  const n = Number(raw);
  const v = Number.isFinite(n) && n > 0 ? n : def;
  return Math.min(max, Math.max(min, v));
}

const LOCAL_SESSION_TTL_MS = clampMsEnv(
  process.env.DSH_LOCAL_SESSION_TTL_MS,
  LOCAL_SESSION_TTL_DEFAULT_MS,
  LOCAL_SESSION_TTL_MIN_MS,
  LOCAL_SESSION_TTL_MAX_MS
```

</details>

**依据 2 · 源码核查**：[packages/relay-router/src/index.mjs:825-852](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L825-L852)

所有key签同local身份。

<details>
<summary>查看原文（28行）</summary>

```text
  if (req.method === "POST" && url.pathname === "/_login") {
    if (!LOCAL_AUTH_ENABLED) {
      res.writeHead(404, { "content-type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: { code: "not_found", message: "本地认证未启用(本服务为 SaaS 模式)" } }));
      return;
    }
    let body = {};
    try {
      const raw = await readBody(req);
      if (raw.length) body = JSON.parse(raw.toString("utf8"));
    } catch {
      const r = jsonBody(400, { error: { code: "bad_json", message: "请求体必须是 JSON" } });
      res.writeHead(r.status, r.headers);
      res.end(r.body);
      return;
    }
    const key = typeof body.key === "string" ? body.key.trim() : "";
    if (!LOCAL_ACCESS_KEYS.includes(key)) {
      const r = jsonBody(401, { error: { code: "invalid_access_key", message: "访问密钥无效" } });
      res.writeHead(r.status, r.headers);
      res.end(r.body);
      return;
    }
    const token = signLocalJwt("local", "pro_max");
    const r = jsonBody(200, { token, plan: "pro_max", mode: "local" });
    res.writeHead(r.status, r.headers);
    res.end(r.body);
    return;
```

</details>

**依据 3 · 作者声明**：[docs/self-hosting.md:17-29](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/docs/self-hosting.md#L17-L29)

作者旧2h和TLS终结条件。

<details>
<summary>查看原文（13行）</summary>

```text

- **relay-router** is the only server component. It registers bridges over
  WebSocket (`/_bridge`), serves the real-time device list (`/_devices`), and
  proxies HTTP/WS traffic to the right device (`/remote/<deviceId>/…`).
- Authentication: `DSH_LOCAL_ACCESS_KEYS` (comma-separated) → `POST /_login`
  → 2h local JWT. The router also accepts SaaS JWTs if
  `DSH_ENTERPRISE_JWT_SECRET` is set, so a router can serve both modes at once.

## Requirements

- A server with Node.js ≥ 22 and a public HTTPS endpoint (your own domain +
  certificate). The router itself speaks plain HTTP/WS; terminate TLS at nginx
  or Caddy in front of it.
```

</details>

**依据 4 · 源码核查**：[packages/relay-router/src/jwt.mjs:15-37](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/jwt.mjs#L15-L37)

实际HS256/exp检查。

<details>
<summary>查看原文（23行）</summary>

```text
export function verifyJwt(token, secret) {
  if (typeof token !== "string" || token === "" || typeof secret !== "string" || secret === "") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const h = JSON.parse(Buffer.from(header, "base64url").toString("utf8"));
    if (h?.alg !== "HS256") return null;
  } catch {
    return null;
  }
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (typeof payload?.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
```

</details>

**依据 5 · 源码核查**：[packages/relay-router/src/index.mjs:1014-1048](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L1014-L1048)

跨账号同ID仅告警/替换，归属缺口。

<details>
<summary>查看原文（35行）</summary>

```text
        const existing = devices.get(deviceId);
        if (existing && existing.ws !== ws) {
          // 跨账号抢占 deviceId 的观测（2026-09-27 安全审计）。
          // `deviceId` 在 tunnel-register 里是**自述**的（只校验格式），任何有效 JWT 都能用
          // 别人的 deviceId 注册并把现有隧道顶掉。影响仅限 DoS：HTTP/WS 两侧都会校验
          // `dev.userId === claims.sub`（见 authorizeRemote），受害者只会拿到 403/offline，
          // 请求**不会**被路由到攻击者的 bridge；且 deviceId 是 48bit CSPRNG
          // （bridge: "dev-"+randomBytes(6)），跨用户不可枚举。
          // 这里只观测不改语义——真正的修法是"deviceId 归属绑定"，需要企业端内部接口 + fail-open
          // 设计，改错会让全体设备注册失败，不能顺手改。
          const fromUser = String(existing.userId);
          const toUser = String(claims.sub);
          if (fromUser !== toUser) {
            logger.warn(
              `[router] ⚠️ 跨账号顶掉隧道: deviceId=${deviceId} 原属 user=${fromUser} → 新连接 user=${toUser}` +
              ` (原连接存活 ${Math.round((Date.now() - (existing.connectedAt || Date.now())) / 1000)}s)`
            );
          }
          try {
            existing.ws.close(4000, "replaced by new connection");
          } catch {
            existing.ws.terminate();
          }
          cleanupDevice(existing);
        }
        dev = {
          ws,
          deviceId,
          userId: String(claims.sub),
          plan: claims.plan || "free",
          name: typeof name === "string" ? name : deviceId,
          caps: Array.isArray(caps) ? caps.map(String).filter(Boolean) : [], // E2EE caps 原样记录(§6.2)
          connectedAt: Date.now()
        };
        devices.set(deviceId, dev);
```

</details>

**依据 6 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:2615-2633](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L2615-L2633)

E2EE allowed/自建和配置条件。

<details>
<summary>查看原文（19行）</summary>

```text
 * E2EE 启动初始化(账号模式):拉取服务端参数 → 用本机账号密码派生 MK(仅内存)。
 * 任何一步不满足都禁用 E2EE(reason 记录),bridge 走原 v1 明文路径,不影响隧道。
 * 启用结果写入 relayDir/.e2ee-state.json(供 Phase-4 UI 读取:{enabled, reason, ...})。
 * 状态文件路径策略:显式 DSH_BRIDGE_CONFIG / DSH_BRIDGE_E2EE_STATE 时落盘(生产必设),
 * 否则只打日志(避免污染仓库/非托管目录)。
 */
async function initE2ee(token) {
  const cfg = loadLocalConfig();
  const localMode = Boolean(process.env.DSH_BRIDGE_LOCAL_KEY); // 自建模式不启用(§6.6)
  const userDisabled = process.env.DSH_BRIDGE_E2EE === "0" || cfg.e2ee === false;
  const allowed = !localMode && !userDisabled;
  // 密码与 device-login 同源:env 优先,其次 .dsh-config.json(本机 0600 保存的账号密码)
  const password = PASSWORD || (typeof cfg.password === "string" && cfg.password ? cfg.password : "");
  e2ee = await E2eeService.init({ apiBase: API_BASE, token, password, allowed });
  const st = e2ee.state();
  const stateFileDir = process.env.DSH_BRIDGE_E2EE_STATE || path.dirname(CONFIG_PATH);
  if (process.env.DSH_BRIDGE_CONFIG || process.env.DSH_BRIDGE_E2EE_STATE) {
    writeE2eeStateFile(stateFileDir, { enabled: st.enabled, reason: st.reason, profile: st.profile, epoch: st.epoch, caps: e2ee.caps() });
  }
```

</details>

**依据 7 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:2650-2662](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L2650-L2662)

未enabled仍v1。

<details>
<summary>查看原文（13行）</summary>

```text
      // 丢弃 = 手机手里的旧票必然对不上：后续 ws-open/HTTP 会带 retryable 的 rehandshake 信号，
      // 手机自动重建会话而不是让用户去输密码。
      console.log(`[bridge] E2EE 会话存储已作废(${store.discarded})，手机端将自动重新握手`);
    }
    if (storeDir && storeEnabled) {
      console.log(`[bridge] 🔒 E2EE 已启用(caps=[${e2ee.caps().join(",")}], profile=${st.profile}, epoch=${st.epoch});MK 仅驻内存,会话库加密落盘`);
    } else {
      console.log(`[bridge] 🔒 E2EE 已启用(caps=[${e2ee.caps().join(",")}], profile=${st.profile}, epoch=${st.epoch});MK 仅驻内存(会话库未落盘)`);
    }
  } else {
    console.log(`[bridge] e2ee 未启用(${st.reason}) → 明文 v1 路径照常(能力不上报)`);
  }
}
```

</details>

**依据 8 · 源码核查**：[clients/dsh-remote/e2ee-client.mjs:100-118](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/e2ee-client.mjs#L100-L118)

实际MK派生。

<details>
<summary>查看原文（19行）</summary>

```text
 */
export function deriveMasterKey(password, saltB64, kdf = null) {
  const salt = decodeSalt(saltB64);
  if (!salt) throw new Error(`e2ee: salt 非法(须为 16B base64url),got=${JSON.stringify(saltB64)}`);
  const { iter, dkLen, hash } = normalizeKdf(kdf);
  const kdfInput = Buffer.concat([Buffer.from(E2EE_MK_LABEL, "utf8"), salt]);
  return pbkdf2Sync(normalizePassword(password), kdfInput, iter, dkLen, hash);
}

/** 把任意 kdf 参数容错归一(兼容 iterations/iter 两种写法);非法抛错。 */
export function normalizeKdf(kdf) {
  if (!kdf || typeof kdf !== "object") return { ...DEFAULT_MK_KDF };
  const iter = Number(kdf.iter ?? kdf.iterations);
  const dkLen = Number(kdf.dkLen ?? kdf.keyLen ?? kdf.length ?? MK_BYTES);
  const hash = typeof kdf.hash === "string" && kdf.hash ? kdf.hash : "sha256";
  if (!Number.isInteger(iter) || iter < 1) throw new Error("e2ee: kdf.iter 非法");
  if (!Number.isInteger(dkLen) || dkLen < 1 || dkLen > 64) throw new Error("e2ee: kdf.dkLen 非法");
  if (!/^sha(256|384|512)$/.test(hash)) throw new Error(`e2ee: kdf.hash 不受支持: ${hash}`);
  return { alg: typeof kdf.alg === "string" && kdf.alg ? kdf.alg : "pbkdf2-sha256", iter, dkLen, hash };
```

</details>

**依据 9 · 源码核查**：[clients/dsh-remote/e2ee-client.mjs:655-678](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/e2ee-client.mjs#L655-L678)

实际工厂要求与禁用结果。

<details>
<summary>查看原文（24行）</summary>

```text
  static async init({ apiBase, token, password, allowed = true, profileHint = "" } = {}) {
    if (!allowed) return new E2eeService({ enabled: false, reason: "disabled_by_config" });
    if (String(token || "") === "") return new E2eeService({ enabled: false, reason: "no_token" });
    if (String(password ?? "") === "") return new E2eeService({ enabled: false, reason: "no_password" });
    const params = await fetchE2eeParams(apiBase, token);
    if (!params.enabled) return new E2eeService({ enabled: false, reason: params.reason });
    let mk;
    try {
      mk = deriveMasterKey(password, params.salt, params.kdf);
    } catch {
      return new E2eeService({ enabled: false, reason: "derive_failed" });
    }
    return new E2eeService({
      enabled: true,
      reason: "ok",
      mk,
      profile: profileHint || params.profile || DEFAULT_MK_PROFILE.profile,
      salt: params.salt,
      epoch: params.epoch || 0,
      kdf: params.kdf
    });
  }

  caps() {
```

</details>

#### 缺口

- SaaS完整会话撤销、移动端所有密钥/脚本信任与密码学实现未完整核验。
  **影响**：不把开源JWT验证等同商业身份或独立E2EE审计。
  **进一步探讨**：两账号/两设备测试错误归属和撤销，自建多个key应明确同信任域；完整协议另审后才承诺保密。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 升级/后台与退出有什么可恢复性和维护代价？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

安装器插件目录采用stage拷贝→检查必需文件→旧dest改名backup→stage改dest，第二次rename失败尽力恢复，成功后清backup。这降低半包毁Host风险，但不是配置、服务、Cookie、账号和网络一起原子切换；setup自建校验前已写配置、插件安装失败非致命都证明了整组有部分成功。uninstall分支清patch、本地插件/链接、dependencies和bundle条目，不能据此宣称bridge服务、配对凭据、远端设备/数据也全部退出。

Web半部加载会自动补装runtime（本地copy优先，npx回退）和默认遥测，Host Cookie代持相当完整访问权，配置明文密码与本地密钥需权限/备份保护。个人使用要承担跨平台常驻服务、端口发现、Cookie重发、TLS、更新和支持日志，人力未量化。默认遥测可环境关闭，不等所有云API不再联网。包许可PolyForm非商业，商业内部或对外用途要核授权；SaaS或自建的现金取决账号、带宽、服务器、模型和在线机器，现价/总额未知，不记零成本。

建议从一台可丢弃Host+一台手机+单信任域只读任务开始，选定SaaS或自建，分别核身份/模式/任务和停止。退出需停受控机服务与relay暴露、撤账号设备/密钥、核旧手机失效，再按归属清profile、Cookie/配置和备份。遇到原机效果不明保留状态先回原生Web查，不重复远程提交副作用。当前受限试用，不作为多人隔离或敏感商用的现成保证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-setup.mjs:2906-2946](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/dsh-setup.mjs#L2906-L2946)

插件stage/检查/rename及尽力回滚。

<details>
<summary>查看原文（41行）</summary>

```text
      const inBundledRuntime = segs[0] === "runtime";
      if (!inBundledRuntime && segs.some((seg) => seg === "node_modules")) return false;
      return true;
    }
  };

  // 0) 清掉上次被强杀（或本次同 pid 重入）留下的临时目录
  for (const d of [stage, backup]) { try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ } }

  // 1) 拷到 staging —— **绝不动 dest**
  try {
    fs.cpSync(pluginDir, stage, cpOpts);
  } catch (e) {
    try { fs.rmSync(stage, { recursive: true, force: true }); } catch { /* ignore */ }
    throw new Error(`插件拷贝失败（已保留原目录不动）：${e && e.message ? e.message : e}`);
  }

  // 2) 自检：必需文件一个都不能少（这一步就是 23:46 那次故障的闸门）
  const missing = missingPluginFiles(stage);
  if (missing.length > 0) {
    try { fs.rmSync(stage, { recursive: true, force: true }); } catch { /* ignore */ }
    throw new Error(
      `插件拷贝不完整，缺少必需文件：${missing.join("、")}（已保留原目录不动，避免宿主读 overlay 失败起不来）`
    );
  }

  // 3) 原子切换
  try {
    if (fs.existsSync(dest)) fs.renameSync(dest, backup);
    try {
      fs.renameSync(stage, dest);
    } catch (e) {
      if (fs.existsSync(backup)) { try { fs.renameSync(backup, dest); } catch { /* 尽力回滚 */ } }
      throw e;
    }
    try { fs.rmSync(backup, { recursive: true, force: true }); } catch { /* ignore */ }
  } catch (e) {
    try { fs.rmSync(stage, { recursive: true, force: true }); } catch { /* ignore */ }
    throw new Error(`插件切换失败（旧版仍在原位）：${e && e.message ? e.message : e}`);
  }
  return dest;
```

</details>

**依据 2 · 源码核查**：[dsh-setup.mjs:3388-3414](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/dsh-setup.mjs#L3388-L3414)

插件卸载实际范围。

<details>
<summary>查看原文（27行）</summary>

```text
  if (uninstall) {
    // 移除 patch 中的插件条目（兼容旧版无标记条目；旧名 dsh-remote-ui 一并清理）
    // 用原子写回:卸载同样不能在 profile 配置上留下半截文件
    if (!stripIncludeEntries(patchFile, patch, "卸载清理")) {
      console.log(`ℹ patch 中未发现 ${PLUGIN_ID}（或历史名）条目。`);
    }
    // 清理本地目录与链接：当前名 + 历史名(dsh-remote-ui-plugin / node_modules/dsh-remote-ui)
    for (const id of PLUGIN_ALL_IDS) {
      fs.rmSync(path.join(profileDir, `${id}-plugin`), { recursive: true, force: true });
      fs.rmSync(path.join(profileDir, "node_modules", id), { recursive: true, force: true });
    }
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
      let removed = false;
      for (const id of PLUGIN_ALL_IDS) {
        if (pkg.dependencies && pkg.dependencies[id] !== undefined) { delete pkg.dependencies[id]; removed = true; }
      }
      if (removed) fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + "\n");
    } catch { /* ignore */ }
    // 同步移除 bundles 声明，避免“bundles 引用已删除包 → dsh web 启动报错”
    try {
      if (removeBundleEntry(pkgFile)) console.log(`✅ 已从 dsh.profile.bundles 移除 ${PLUGIN_ID}`);
    } catch { /* ignore */ }
    console.log("✅ 卸载完成。重启 dsh web 生效。");
    return;
  }

```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web/lib/index.js:2198-2267](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L2198-L2267)

runtime自动复制/回退。

<details>
<summary>查看原文（70行）</summary>

```text
/**
 * 本插件自带的运行环境目录（lib/ → ../runtime）；仓库开发形态/未打包时返回 null。
 * DSH_RELAY_BUNDLED_RUNTIME 可显式指定（测试/诊断用；指向不存在的目录 = 强制走 npx 兜底分支）。
 */
function readBundledRuntime() {
  const override = String(process.env.DSH_RELAY_BUNDLED_RUNTIME || "").trim();
  if (override) return existsSync(join(override, "dsh-setup.mjs")) ? override : null;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const cand = join(here, "..", "runtime");
    return existsSync(join(cand, "dsh-setup.mjs")) ? cand : null;
  } catch { return null; }
}

/** 自带运行环境拷贝失败的退避（避免每次面板轮询都重试同一件不可能的事）。 */
const bundledCopyFails = new Map(); // relayDir → nextAt

/**
 * 用插件自带的运行环境就地补装（纯本地拷贝）。
 * @returns {{ok:boolean, reason?:string, detail?:string, missing?:string[]}}
 */
function provisionFromBundledRuntime(relayDir) {
  const src = readBundledRuntime();
  if (!src) return { ok: false, reason: "no-bundled-runtime" };
  if (skipsSystemOps()) return { ok: false, reason: "skipped" };
  if (Date.now() < (bundledCopyFails.get(relayDir) || 0)) return { ok: false, reason: "backoff" };
  try {
    mkdirSync(relayDir, { recursive: true });
    copyFileSync(join(src, "dsh-setup.mjs"), join(relayDir, "dsh-setup.mjs"));
    for (const dir of ["clients", "node_modules"]) {
      const from = join(src, dir);
      if (!existsSync(from)) continue;
      cpSync(from, join(relayDir, dir), { recursive: true, force: true });
    }
    // 版本标记：与插件同版（诊断据此显示「运行时 x.y.z」）
    try { writeFileSync(join(relayDir, ".dsh-setup-version"), `${PLUGIN_VERSION}\n`); } catch { /* 非关键 */ }
    const missing = missingRuntimeFiles(relayDir);
    if (missing.length) {
      bundledCopyFails.set(relayDir, Date.now() + 60_000);
      return { ok: false, reason: "incomplete", missing };
    }
    bundledCopyFails.delete(relayDir);
    return { ok: true };
  } catch (e) {
    bundledCopyFails.set(relayDir, Date.now() + 60_000);
    return { ok: false, reason: "copy-failed", detail: e.message };
  }
}

function ensureRuntime(relayDir) {
  if (UNINSTALLED_DIRS.has(relayDir)) return false; // 已彻底卸载：不再自动安装运行环境
  if (runtimeReady(relayDir)) return true;
  if (skipsSystemOps()) return false; // 测试隔离：绝不在用例里 spawn 真实 npx 安装
  // ① 插件自带的运行环境优先：本地拷贝即可，**不经过 npx、不联网**。
  //    这一条同时治好「半装运行环境」（runtimeReady 为假 → 整份重拷 → 自检通过才算成功）。
  const local = provisionFromBundledRuntime(relayDir);
  if (local.ok) {
    appendLogLine(relayDir, AUTO_INSTALL_LOG,
      `[dsh-remote-web] 已用插件自带的运行环境就地补齐（v${PLUGIN_VERSION}，本地拷贝，未使用 npx）`);
    backupConfigFile(relayDir); // 安装完成后备份配对信息（文件不存在则静默跳过；内容绝不写日志）
    telemetryRuntimeReady(relayDir);
    return true;
  }
  if (local.reason === "incomplete") {
    appendLogLine(relayDir, AUTO_INSTALL_LOG,
      `[dsh-remote-web] 自带运行环境拷贝后仍不完整（缺 ${local.missing.slice(0, 3).join(", ")}）→ 转 npx 补装`);
    telemetryRecord(relayDir, "install_failed", { fail_code: "install_script_missing" });
  }
  // ② 兜底：npx 补装（老路径保持不变；仓库开发形态、或没打包 runtime/ 的安装形态走这里）
  const gate = provisionRetryGate(relayDir);
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web/lib/index.js:8621-8639](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L8621-L8639)

加载端口与默认遥测。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(ctx, config = {}) {
  const relayDir = config.relayDir || process.env.DSH_RELAY_DIR || DEFAULT_RELAY_DIR;
  // 记住宿主 ctx：上游地址要问 dsh web 自己的监听端口（见 upstreamUrl）。
  // 存 ctx 而不是当场取端口：apply 可能早于 webServer.listen 完成，端口那时还是 0/undefined。
  webServerCtx = ctx;
  // 上游地址落盘（0.6.12）：系统自启拉起的守护没有本进程的 env，只认这个文件。
  publishUpstream(relayDir);
  // 【0.6.15】问不到自己监听端口时（飞牛/NAS 实测就是这种情况）主动发现一次并固化：
  // watcher/bridge 是独立进程，只有这里知道 dsh web 真实在哪个端口。fire-and-forget，
  // 发现完 /dsh-remote/bridge-status 的下一轮轮询与自愈就会用上正确地址。
  void discoverUpstreamSelf(relayDir).catch(() => FALLBACK_UPSTREAM);
  // 全新激活（dsh web 重启后插件重新加载，或卸载后再次安装）→ 解除上次的「已卸载」停摆标记
  UNINSTALLED_DIRS.delete(relayDir);
  // 匿名遥测：装载即初始化（读回上次进程遗留的磁盘队列，例如重启前那条 harness_restart，
  // 并启动 60s 发送心跳），随后记一条 plugin_loaded（每进程一次）。
  // DSH_REMOTE_TELEMETRY=0 → 这里连读都不读：零文件、零请求、零 install_id。
  telemetryStart(relayDir);
  telemetryOnce(relayDir, "plugin_loaded");
  // 清理上次进程残留的安装/更新 marker（宿主被重启/强杀时子进程清理回调会丢失）
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web/lib/index.js:1130-1165](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L1130-L1165)

Cookie换取/留存。

<details>
<summary>查看原文（36行）</summary>

```text
async function mintHarnessCookie(ctx, relayDir) {
  if (UNINSTALLED_DIRS.has(relayDir)) return false; // 已彻底卸载：不再代持会话、不再重建配置目录
  try {
    const port = ctx.webServer?.port;
    if (!port) return false;
    // 不能把 "connection" 写进 inject(0.1.1 无该服务会拖死激活),只能运行时 try 获取
    let holder;
    try { holder = ctx.get("connection"); } catch { holder = void 0; }
    if (!holder && ctx.connection !== void 0) { try { holder = ctx.connection; } catch { /* ignore */ } }
    const svc = holder && typeof holder.authenticatedUrl === "function"
      ? holder
      : holder && holder.connection && typeof holder.connection.authenticatedUrl === "function"
        ? holder.connection
        : null;
    if (!svc) return false; // 老版本无浏览器鉴权 → 无需 cookie
    const tokenUrl = svc.authenticatedUrl(`http://127.0.0.1:${port}`);
    const res = await fetch(tokenUrl, { redirect: "manual", signal: AbortSignal.timeout(6000) });
    const cookie = setCookieOf(res).split(";")[0].trim();
    if (!cookie || !cookie.startsWith("dsh-auth-")) return false;
    // 竞态兜底：fetch 期间用户点击了「彻底卸载」→ 不得重建已被清空的配置目录
    if (UNINSTALLED_DIRS.has(relayDir)) return false;
    const out = { authority: `127.0.0.1:${port}`, cookie, mintedAt: Date.now() };
    mkdirSync(dirname(configPathOf(relayDir)), { recursive: true });
    // ① 本宿主专属文件(权威,两个宿主互不覆盖 —— 故障根治点)
    const ownPath = join(relayDir, harnessCookieFileFor(out.authority));
    writeFileSync(ownPath, JSON.stringify(out, null, 2), { mode: 0o600 });
    hardenFile(ownPath); // 会话 Cookie ≈ dsh web 的完整访问权，同样要收紧
    // ② 旧版共享文件镜像:只为还跑着旧桥(<0.7.0-beta.2)的机器保留 —— 新桥优先读 ①,
    //    且对 authority 不符的镜像**直接跳过**,所以这里写镜像不会再引发乒乓。
    const legacyPath = join(relayDir, HARNESS_COOKIE_FILE);
    writeFileSync(legacyPath, JSON.stringify(out, null, 2), { mode: 0o600 });
    hardenFile(legacyPath);
    return true;
  } catch {
    return false;
  }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web/lib/index.js:714-728](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L714-L728)

配置明文持久与权限收紧。

<details>
<summary>查看原文（15行）</summary>

```text
function loadConfig(relayDir) {
  try {
    return JSON.parse(readFileSync(configPathOf(relayDir), "utf8"));
  } catch {
    return {};
  }
}

function saveConfig(relayDir, cfg) {
  mkdirSync(dirname(configPathOf(relayDir)), { recursive: true });
  // mode 0o600：与 dsh-setup.mjs 一致（文件已存在时 writeFileSync 不改权限，显式 chmod 兜底）
  writeFileSync(configPathOf(relayDir), JSON.stringify(cfg, null, 2), { mode: 0o600 });
  hardenFile(configPathOf(relayDir)); // Windows 上 mode 是空操作 → 显式收紧 ACL（内含明文账号密码）
  try {
    chmodSync(configPathOf(relayDir), 0o600);
```

</details>

**依据 7 · 源码核查**：[packages/dsh-remote-web/lib/index.js:6465-6475](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L6465-L6475)

遥测开关。

<details>
<summary>查看原文（11行）</summary>

```text
 * 遥测开关：DSH_REMOTE_TELEMETRY=0/false/off/no → 完全关闭（不生成 install_id、不落文件、不发请求）；
 * 默认开启（=1/true 显式开启）。
 * 另外：DSH_RELAY_SKIP_SERVICE=1（测试/诊断隔离，见 skipsSystemOps）时同样不发送——
 * 本仓库的测试脚本全局设了该变量，用例绝不能把匿名事件发到真实生产端点。
 */
function telemetryEnabled() {
  if (skipsSystemOps()) return false;
  const v = String(process.env.DSH_REMOTE_TELEMETRY ?? "").trim().toLowerCase();
  return !(v === "0" || v === "false" || v === "off" || v === "no");
}

```

</details>

**依据 8 · 作者声明**：[README.md:139-142](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/README.md#L139-L142)

作者商业许可边界。

```text
## License

本仓库使用 **PolyForm Noncommercial 1.0.0**（[LICENSE](LICENSE)）：个人、研究与非商业用途免费；
商业用途（含内部自用与对外服务）需要商业授权，见 [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md)。
```

#### 缺口

- 跨平台安装/升级回滚、退出实际失效、价格与全部故障恢复成本未运行。
  **影响**：不能说一键无维护或全组可回滚。
  **进一步探讨**：记录每一步磁盘/服务/远端状态，在可丢弃profile测掉盘、失败安装、断网和撤销，按效果决定是否推广。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 整套系统值得验证的增量应落在哪里？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

最值得验证的是设备归属与远程能力的可核撤销：中继将设备首次登记绑定真实principal，替换需旧owner确认或可审计重新配对；自建明确单信任域或签发每key独立subject，控制界面同时显示Host authority、Cookie/设备授权与E2EE模式。基线是当前deviceId自述替换、所有local key同subject与兼容v1，不是泛泛提高加密强度。

最小实验用两个隔离用户/两台无秘密Host，比较当前与绑定方案，测同ID抢占、错误key/旧JWT、端口变化、E2EE禁用、掉线和撤销后重连。指标为错路由/越权和顶掉次数、撤销后成功请求、错误在线提示、恢复耗时与新增运维步骤。原生工具副作用必须另有结果证据，不能用HTTP200/设备online冒充任务成功。

若开源目标始终单用户且VPN更省维护，设备绑定的商业价值可能不成立；若云服务不能提供可信撤销回执，保持未知并限制敏感任务。该方向未实现、未计现有创新，也不能用潜在节时给经济创新加分。

#### 证据与依据

**依据 1 · 源码核查**：[packages/relay-router/src/index.mjs:825-852](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L825-L852)

共享local subject的实验基线。

<details>
<summary>查看原文（28行）</summary>

```text
  if (req.method === "POST" && url.pathname === "/_login") {
    if (!LOCAL_AUTH_ENABLED) {
      res.writeHead(404, { "content-type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: { code: "not_found", message: "本地认证未启用(本服务为 SaaS 模式)" } }));
      return;
    }
    let body = {};
    try {
      const raw = await readBody(req);
      if (raw.length) body = JSON.parse(raw.toString("utf8"));
    } catch {
      const r = jsonBody(400, { error: { code: "bad_json", message: "请求体必须是 JSON" } });
      res.writeHead(r.status, r.headers);
      res.end(r.body);
      return;
    }
    const key = typeof body.key === "string" ? body.key.trim() : "";
    if (!LOCAL_ACCESS_KEYS.includes(key)) {
      const r = jsonBody(401, { error: { code: "invalid_access_key", message: "访问密钥无效" } });
      res.writeHead(r.status, r.headers);
      res.end(r.body);
      return;
    }
    const token = signLocalJwt("local", "pro_max");
    const r = jsonBody(200, { token, plan: "pro_max", mode: "local" });
    res.writeHead(r.status, r.headers);
    res.end(r.body);
    return;
```

</details>

**依据 2 · 源码核查**：[packages/relay-router/src/index.mjs:1014-1048](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/relay-router/src/index.mjs#L1014-L1048)

自述设备替换基线。

<details>
<summary>查看原文（35行）</summary>

```text
        const existing = devices.get(deviceId);
        if (existing && existing.ws !== ws) {
          // 跨账号抢占 deviceId 的观测（2026-09-27 安全审计）。
          // `deviceId` 在 tunnel-register 里是**自述**的（只校验格式），任何有效 JWT 都能用
          // 别人的 deviceId 注册并把现有隧道顶掉。影响仅限 DoS：HTTP/WS 两侧都会校验
          // `dev.userId === claims.sub`（见 authorizeRemote），受害者只会拿到 403/offline，
          // 请求**不会**被路由到攻击者的 bridge；且 deviceId 是 48bit CSPRNG
          // （bridge: "dev-"+randomBytes(6)），跨用户不可枚举。
          // 这里只观测不改语义——真正的修法是"deviceId 归属绑定"，需要企业端内部接口 + fail-open
          // 设计，改错会让全体设备注册失败，不能顺手改。
          const fromUser = String(existing.userId);
          const toUser = String(claims.sub);
          if (fromUser !== toUser) {
            logger.warn(
              `[router] ⚠️ 跨账号顶掉隧道: deviceId=${deviceId} 原属 user=${fromUser} → 新连接 user=${toUser}` +
              ` (原连接存活 ${Math.round((Date.now() - (existing.connectedAt || Date.now())) / 1000)}s)`
            );
          }
          try {
            existing.ws.close(4000, "replaced by new connection");
          } catch {
            existing.ws.terminate();
          }
          cleanupDevice(existing);
        }
        dev = {
          ws,
          deviceId,
          userId: String(claims.sub),
          plan: claims.plan || "free",
          name: typeof name === "string" ? name : deviceId,
          caps: Array.isArray(caps) ? caps.map(String).filter(Boolean) : [], // E2EE caps 原样记录(§6.2)
          connectedAt: Date.now()
        };
        devices.set(deviceId, dev);
```

</details>

**依据 3 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:2615-2633](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L2615-L2633)

模式前提基线。

<details>
<summary>查看原文（19行）</summary>

```text
 * E2EE 启动初始化(账号模式):拉取服务端参数 → 用本机账号密码派生 MK(仅内存)。
 * 任何一步不满足都禁用 E2EE(reason 记录),bridge 走原 v1 明文路径,不影响隧道。
 * 启用结果写入 relayDir/.e2ee-state.json(供 Phase-4 UI 读取:{enabled, reason, ...})。
 * 状态文件路径策略:显式 DSH_BRIDGE_CONFIG / DSH_BRIDGE_E2EE_STATE 时落盘(生产必设),
 * 否则只打日志(避免污染仓库/非托管目录)。
 */
async function initE2ee(token) {
  const cfg = loadLocalConfig();
  const localMode = Boolean(process.env.DSH_BRIDGE_LOCAL_KEY); // 自建模式不启用(§6.6)
  const userDisabled = process.env.DSH_BRIDGE_E2EE === "0" || cfg.e2ee === false;
  const allowed = !localMode && !userDisabled;
  // 密码与 device-login 同源:env 优先,其次 .dsh-config.json(本机 0600 保存的账号密码)
  const password = PASSWORD || (typeof cfg.password === "string" && cfg.password ? cfg.password : "");
  e2ee = await E2eeService.init({ apiBase: API_BASE, token, password, allowed });
  const st = e2ee.state();
  const stateFileDir = process.env.DSH_BRIDGE_E2EE_STATE || path.dirname(CONFIG_PATH);
  if (process.env.DSH_BRIDGE_CONFIG || process.env.DSH_BRIDGE_E2EE_STATE) {
    writeE2eeStateFile(stateFileDir, { enabled: st.enabled, reason: st.reason, profile: st.profile, epoch: st.epoch, caps: e2ee.caps() });
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web/lib/index.js:1130-1165](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L1130-L1165)

Host authority/Cookie核验条件。

<details>
<summary>查看原文（36行）</summary>

```text
async function mintHarnessCookie(ctx, relayDir) {
  if (UNINSTALLED_DIRS.has(relayDir)) return false; // 已彻底卸载：不再代持会话、不再重建配置目录
  try {
    const port = ctx.webServer?.port;
    if (!port) return false;
    // 不能把 "connection" 写进 inject(0.1.1 无该服务会拖死激活),只能运行时 try 获取
    let holder;
    try { holder = ctx.get("connection"); } catch { holder = void 0; }
    if (!holder && ctx.connection !== void 0) { try { holder = ctx.connection; } catch { /* ignore */ } }
    const svc = holder && typeof holder.authenticatedUrl === "function"
      ? holder
      : holder && holder.connection && typeof holder.connection.authenticatedUrl === "function"
        ? holder.connection
        : null;
    if (!svc) return false; // 老版本无浏览器鉴权 → 无需 cookie
    const tokenUrl = svc.authenticatedUrl(`http://127.0.0.1:${port}`);
    const res = await fetch(tokenUrl, { redirect: "manual", signal: AbortSignal.timeout(6000) });
    const cookie = setCookieOf(res).split(";")[0].trim();
    if (!cookie || !cookie.startsWith("dsh-auth-")) return false;
    // 竞态兜底：fetch 期间用户点击了「彻底卸载」→ 不得重建已被清空的配置目录
    if (UNINSTALLED_DIRS.has(relayDir)) return false;
    const out = { authority: `127.0.0.1:${port}`, cookie, mintedAt: Date.now() };
    mkdirSync(dirname(configPathOf(relayDir)), { recursive: true });
    // ① 本宿主专属文件(权威,两个宿主互不覆盖 —— 故障根治点)
    const ownPath = join(relayDir, harnessCookieFileFor(out.authority));
    writeFileSync(ownPath, JSON.stringify(out, null, 2), { mode: 0o600 });
    hardenFile(ownPath); // 会话 Cookie ≈ dsh web 的完整访问权，同样要收紧
    // ② 旧版共享文件镜像:只为还跑着旧桥(<0.7.0-beta.2)的机器保留 —— 新桥优先读 ①,
    //    且对 authority 不符的镜像**直接跳过**,所以这里写镜像不会再引发乒乓。
    const legacyPath = join(relayDir, HARNESS_COOKIE_FILE);
    writeFileSync(legacyPath, JSON.stringify(out, null, 2), { mode: 0o600 });
    hardenFile(legacyPath);
    return true;
  } catch {
    return false;
  }
```

</details>

#### 缺口

- 独立设备绑定是否提高目标人群净收益及运维接受度未知。
  **影响**：安全方向不能代替真实需求。
  **进一步探讨**：完成双用户故障对照和任务成本记录；无收益就保留单信任域定位。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
