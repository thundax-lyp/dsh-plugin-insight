# dsh-remote-ssh

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8c35099](https://github.com/ZhangFengshun/dsh-remote-ssh/tree/8c35099d467669a4dcaaafc21cf77d566b21de2f)

<!-- BEGIN META -->
[![GitHub ★ 56](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=56&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZhangFengshun/dsh-remote-ssh) [![npm 30d 7,255](https://img.shields.io/static/v1?label=npm+30d&message=7%2C255&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhangfengshun/dsh-remote-ssh) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhangfengshun/dsh-remote-ssh)
<!-- END META -->

> **功能**：在DSH内集成SSH连接、远程工作区、文件/终端界面与模型远程工具。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)将连接、工作区上下文、原生目录/终端/文件及模型工具串起来，池化/缓存降低重复连接步骤；未测性能收益。

> **主要限制**：[Q02](#research-q02)exec的cd失败仍继续、显式write直接覆盖且与README原子主张不符；[Q03](#research-q03)、[Q04](#research-q04)路径非权限界、超时不杀远端/取消尽力HUP，不能用于未核敏感写/计算。

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
  - [Q01 · 这个SSH插件相对原生SSH完成哪段工作？](#detail-section-11)
  - [Q02 · 模型工具如何绑定远端目录，写文件是否原子？](#detail-section-12)
  - [Q03 · API、SSH信任与秘密如何划界？](#detail-section-13)
  - [Q04 · 超时、取消、kill与退出的远端效果是什么？](#detail-section-14)
  - [Q05 · 什么能让远程工作区成为可核任务边界？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：这是原生DSH双面插件2.4.44，面向已有SSH服务器/超算账号、想在DSH同一会话操作远端工作区的人。Host接SSH工具/工作区和文件路由，客户端提供连接设置与远程目录流程，betterSidebar软注入才有远程编辑器页签；patch同时配置better-sidebar及新版terminal-controller的shell wrapper。因此不是新的SSH协议/沙箱，也不是仅把ssh命令提示给模型。成功须所选远端/目录真正收到命令和文件、模型/文件页/终端一致，结果与取消可核，不是工作区名字显示远程。

原生OpenSSH/scp/rsync、VSCode Remote-SSH与DSH现有SSH服务组合；不新增远端沙箱/作业调度器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作区SSH工具 | 自动连接/相对目录 | 显式连接优先，cd失败继续缺陷 |
| 文件读写 | 直接远端内容 | write直接覆盖非原子、路径非安全界 |
| 终端/编辑器 | 原生页面联动 | wrapper/可选sidebar按版本 |
| 池/取消 | 减重复连接与恢复 | timeout不杀远端，HUP尽力 |
| sync/push | 镜像搬运 | 本次未全面验护栏，不作起步任务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/subprocess/tools/workspaceRegistry | 必需 | 原生Host接线 | 不替代Host审批/身份 |
| Node>=20/OpenSSH/远端sshd | 必需 | 真远程执行 | 依远端shell/文件工具 |
| 密钥/agent或sshpass/Windows askpass | 认证按需 | 登录SSH | 首次hostkey需独立核；密码有进程/设置面 |
| betterSidebar | 文件编辑路径可选依赖 | 编辑器/文件API | 缺失软降级，非全部界面仍可用 |
| 远端最小权限账号和可丢弃目录 | 研究前提 | 收窄路径/副作用 | 工作区本身非安全边界 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核SSH指纹、账号和Host版本 | 用无秘密目录/保留审批 |
| 接线 | 配连接/目录，核工具/终端/文件 | 不看工作区名字代目标 |
| 只读 | pwd/list对照实际远端 | cd失败应停，显式profile改变默认路径 |
| 故障 | 分别timeout/abort/kill，查远端进程 | 本地返回不等已停止 |
| 退出 | 停池/终端、核作业、撤profile和wrapper | 已写文件/作业不自动回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 机器/SSH/HPC金额未知 | 指纹/凭据/目录/UI依赖配置 | 不等一键远端隔离 |
| 持续 | 模型/连接/镜像/算力未知 | 版本联动、缓存/远端结果人审 | 性能/净节时未测 |
| 故障 | 可能继续的远端作业资源 | 路径/写入/进程和重试核对 | 不得自动重提副作用 |
| 退出 | 镜像/备份留存未知 | 停池/终端、撤凭据、核wrapper | 远端作业与文件单独处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生远程上下文 | 工具/设置/目录真实接线 | 全Host版本/界面一致与收益 |
| 文件 | 直接SSH读取/覆盖工具 | 原子写主张不适用当前write |
| 取消 | 独立HUP/不重放取消命令 | 远端真实终止/nohup等 |
| 同步 | 代码有另一路sync/push | 本次未完整审防护，不能默认安全 |

> **思考**：[Q02](#research-q02)exec的cd失败仍继续、显式write直接覆盖且与README原子主张不符；[Q03](#research-q03)、[Q04](#research-q04)路径非权限界、超时不杀远端/取消尽力HUP，不能用于未核敏感写/计算。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)将连接、工作区上下文、原生目录/终端/文件及模型工具串起来，池化/缓存降低重复连接步骤；未测性能收益。

真实exec.signal传递、取消不自动重放、超时/尽力HUP分层与软注入界面可借鉴；目标失败应闭锁，文件原子/权限和整组sync需要独立验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)exec的cd失败仍继续、显式write直接覆盖且与README原子主张不符；[Q03](#research-q03)、[Q04](#research-q04)路径非权限界、超时不杀远端/取消尽力HUP，不能用于未核敏感写/计算。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前观察，仅无秘密fixture只读起步，先核所有界面实际远端/目录。修复cd失败继续与显式write非原子后再扩大写；长作业用远端调度器ID/timeout并查结果，失败不盲重试。回原生SSH可退。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认原生多界面SSH接线及具体目标/写入限制；当前观察，真实远端/Host兼容、完整sync和任务收益未验。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/client.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package/patch、client实际软注入/设置/目录槽，Host toolContext/路径/exec/write/池timeout/abort/HUP/kill、SSH argv、API围栏、旧settings失败；未全审8千行所有路由、sync/镜像写回、补全/上传、终端wrapper全部平台与Host外层认证。
- 下一步：只读固定源码，未连SSH/运行目标或测试；一般冒烟为scope_boundary，目标/写入分支静态确认但未复现损害，真实恢复/收益未知。

**分析版本**

- **仓库**：[ZhangFengshun/dsh-remote-ssh](https://github.com/ZhangFengshun/dsh-remote-ssh)
- **版本号**：2.4.44（[固定提交 8c35099](https://github.com/ZhangFengshun/dsh-remote-ssh/tree/8c35099d467669a4dcaaafc21cf77d566b21de2f)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的canonical目标拒绝、临时写版本/rename和远端operation/job回执，在既有SSH/调度器上核错目录/损坏/重复与人审。

只读固定源码，未连SSH/运行目标或测试；一般冒烟为scope_boundary，目标/写入分支静态确认但未复现损害，真实恢复/收益未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 2863 | — | — | 96828 |
| .js | source | 2 | 10141 | 7267 | 2585 | — |
| .mjs | source | 3 | 522 | 402 | 82 | — |
| .mjs | test | 43 | 11682 | 9529 | 1343 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/ZhangFengshun/dsh-remote-ssh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核原生SSH工作区接线、目标路径/写入与远端取消恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个SSH插件相对原生SSH完成哪段工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH双面插件2.4.44，面向已有SSH服务器/超算账号、想在DSH同一会话操作远端工作区的人。Host接SSH工具/工作区和文件路由，客户端提供连接设置与远程目录流程，betterSidebar软注入才有远程编辑器页签；patch同时配置better-sidebar及新版terminal-controller的shell wrapper。因此不是新的SSH协议/沙箱，也不是仅把ssh命令提示给模型。成功须所选远端/目录真正收到命令和文件、模型/文件页/终端一致，结果与取消可核，不是工作区名字显示远程。

基线是本地SSH终端、scp/rsync、VSCode Remote-SSH与DSH原生SSH能力组合。本插件贡献是原生工作区上下文自动补连接/路径、共享连接池与文件/终端界面联动，减少人工搬运/切工具；OpenSSH认证、远端shell/文件权限与Host工具审批为继承依赖。README展示超算/SLURM不能当已实现作业调度或跨节点隔离。

未装better-sidebar可保留设置/工具/终端/补全，但文件编辑相关路径不能全部复用内核侧边栏，不能概括为零依赖。站点/高性能与跨平台声明没有本次实测，采用仍看真实任务和维护成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-18](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/README.md#L5-L18)

作者定位与能力。

<details>
<summary>查看原文（14行）</summary>

```text
类 **VSCode Remote-SSH** 的 **DSH** 插件：通过 SSH 连接远程超算 / 服务器，在 DSH 内置「文件」「终端」页签中直接操作远程文件和终端。

**目录**：[功能](#功能) · [截图](#截图) · [安装](#安装) · [使用](#使用) · [代码示例](#代码示例) · [模型工具](#模型工具) · [命令超时与恢复](#命令超时与恢复) · [兼容性](#兼容性) · [故障排查](#故障排查) · [原理](#原理) · [缓存与一致性](#缓存与一致性) · [许可证](#许可证)

## 功能

| 能力 | 说明 |
| --- | --- |
| 🔌 SSH 连接 | 密钥 / 密码认证，ProxyJump 跳板机，`~/.ssh/config` 一键导入 |
| 📂 远程文件 | 内置「文件」页签直接 SSH 读写远程文件，无需同步 |
| 💻 远程终端 | 内置「终端」页签自动检测远程工作区，SSH 交互式终端，**落在工作区对应的远程目录**（与 VSCode Remote-SSH 一致） |
| 🌐 远程工作区 | 选择远程目录创建原生工作区，一键进入远程环境 |
| 🤖 模型工具 | 13 个 `remote_ssh_*` 工具，会话感知免填连接参数；命令级超时 + `remote_ssh_kill` 兜底恢复 |
| 🗂️ `@` 引用补全 | 远程工作区会话里 `@` 补全列**远端**文件（git 仓库走 `git ls-files`，实测 0.1s；非 git 用有界 `find`；索引缓存 + 900ms 查询预算，超时降级不卡输入框） |
```

</details>

**依据 2 · 作者声明**：[README.md:35-54](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/README.md#L35-L54)

依赖及软注入退化。

<details>
<summary>查看原文（20行）</summary>

````text
## 安装

**前置要求**

| 项 | 要求 |
| --- | --- |
| DSH | ≥ 0.1.5-rc.1，**含 0.2.0-rc.1**（最新官方线；0.1.2 稳定线请用 v0.18.1 时代的插件版本）。插件声明的 peer 范围显式列出每条已验证版本线，因此新版 harness 的兼容性门（见[安装](#安装)）不会拦住它 |
| dsh-better-sidebar | ≥ 0.15（本插件依赖其 `/sidebar/api/` 文件 API 与 0.24 的 `open.external`「打开方式」端点；0.23 起文件树改为批量 `fs.trees` 并新增 `fs.mkdir`，**2.4.18 起已适配**）。**可以只装本插件**：2.4.18 起未安装它时不再卡住 web boot（见下方说明），但「文件」页签的远程读写与编辑器页签也随之不可用 |
| 本机 SSH 客户端 | Windows：系统自带 OpenSSH（`%SystemRoot%\System32\OpenSSH\ssh.exe`）；Linux/macOS：openssh-client |
| 远程主机 | 任意标准 sshd（超算 / 服务器 / 跳板机均可） |

**一条命令安装**（无需 token、API Key 或额外配置）：

```bash
dsh plugin --profile <name> add @zhangfengshun/dsh-remote-ssh@2.4.44
```

安装后**重启 DSH**。`@zhangfengshun/dsh-remote-ssh` 必须在 bundles 列表中排在 `dsh-better-sidebar` **之后**。

> **只装本插件、不装 `dsh-better-sidebar`（或它加载失败）会怎样？** 2.4.18 起可以正常启动：客户端只把内核服务（`slots`/`locale`）声明为硬依赖，better-sidebar 改走**子 fiber 软注入** —— 装了才注册远程文件编辑器页签，没装就静默降级。此时**能用**：设置页「远程连接」（SSH 连接与远程工作区）、模型工具（`remote_ssh_*`）、远程终端集成、`@` 远程文件补全；**不能用**：「文件」页签的远程读写与编辑器页签 —— 那套 `/sidebar/api/fs.*` 通道属于 better-sidebar（内核原生侧边栏走的是它自己的 `/api/*`，本插件不接管）。1.0.0 之前的旧版插件在这里会**永久 pending**，前端直接报 `web boot: 1 entry did not activate` / `pending (waiting for service: betterSidebar)`（issue [#18](https://github.com/ZhangFengshun/dsh-remote-ssh/issues/18)）。另外 better-sidebar 缺席时宿主会打一条 `patch: entry "better-sidebar" not found` 的 warn —— `dsh-app-boot` 对缺席的 patch 目标无条件告警，**属正常，可忽略**。
````

</details>

**依据 3 · 源码核查**：[package.json:29-80](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/package.json#L29-L80)

真实Host/client/bundle与依赖。

<details>
<summary>查看原文（52行）</summary>

```text
  },
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-modules",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-primitives"
      ],
      "platform": "web"
    }
  },
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.4",
    "yaml": "^2.9.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.6 || ^0.1.5-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.1-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.1.0-rc.6 || ^0.1.5-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.1-rc.1",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6 || ^0.1.5-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.1-rc.1"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "cordis.patch.yml",
    "README.md",
    "README_EN.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT"
}
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:1-41](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/cordis.patch.yml#L1-L41)

插入插件及两类terminal shell wrapper配置。

<details>
<summary>查看原文（41行）</summary>

```text
# @zhangfengshun/dsh-remote-ssh bundle patch
#
# 通过官方 CLI 安装时会依据此声明把 `@zhangfengshun/dsh-remote-ssh` 追加到 profile 的 bundle 栈：
#   dsh plugin --profile <name> add @zhangfengshun/dsh-remote-ssh@<version>
- insert:
    - id: remote-ssh
      name: '@zhangfengshun/dsh-remote-ssh'
# 自动覆盖 better-sidebar 的 shell 配置，指向本插件生成的 shell wrapper。
# wrapper 脚本在插件 apply() 时写入 ~/.dsh/remote-ssh/dsh-remote-shell[.cmd]：
#   - 远程工作区（cwd 含 .remote-ssh.json 且 keyPath 非空）→ ssh -tt 连远程
#   - 本地工作区 → 照常启动本地 shell
# 路径用 !!js 动态计算，适配不同平台和用户主目录。
- id: better-sidebar
  config:
    shell: !!js |
      (() => {
        var homedir = process.env.USERPROFILE || process.env.HOME || process.env.HOMEDRIVE + process.env.HOMEPATH;
        var isWin = process.platform === 'win32';
        var sep = isWin ? '\\' : '/';
        var dir = homedir + sep + '.dsh' + sep + 'remote-ssh';
        return isWin ? dir + sep + 'dsh-remote-shell.cmd' : dir + sep + 'dsh-remote-shell';
      })()
# DSH 0.1.7-rc.2 起，侧边栏终端改由宿主原生的 `terminal-controller`
# （@deepseek-ai/dsh-api-terminal-controller）管理，它只读自己的 `config.shell`
# （{ path, name, args }），不再读 better-sidebar 的 shell 配置 —— 因此远程工作区
# 会静默打开本地 shell。这里把**同一个 wrapper** 也交给原生终端。
# 旧版 DSH 没有该 entry，patch 目标不存在时会被忽略（无害）。
- id: terminal-controller
  config:
    shell: !!js |
      (() => {
        var homedir = process.env.USERPROFILE || process.env.HOME || process.env.HOMEDRIVE + process.env.HOMEPATH;
        var isWin = process.platform === 'win32';
        var sep = isWin ? '\\' : '/';
        var dir = homedir + sep + '.dsh' + sep + 'remote-ssh';
        return {
          path: isWin ? dir + sep + 'dsh-remote-shell.cmd' : dir + sep + 'dsh-remote-shell',
          name: 'Auto SSH / Local',
          args: []
        };
      })()
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1901-1945](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/client.js#L1901-L1945)

真实软注入editor、设置与目录槽。

<details>
<summary>查看原文（45行）</summary>

```text
      ctx.inject(["betterSidebar"], function (bsCtx) {
        var bs = bsCtx.betterSidebar;
        if (!bs || typeof bs.registerTab !== "function") return;
        // 远程文件编辑器页签（隐藏页签，仅由代码打开，每个远程文件单开一栏）。
        // remssh:files 和 remssh:term 已移除：远程文件由内置「文件」页签直接 SSH 读写，
        // 远程终端由内置「终端」页签提供（shell wrapper 自动 SSH）。
        bsCtx.effect(function () {
          return bs.registerTab({
            id: "remssh:editor",
            title: function () { return i18n.t("tabs.files"); },
            hidden: true,
            dedupeKey: function (tab) { return (tab && tab.meta && tab.meta.profileId || "") + "\u0000" + (tab && tab.path || ""); },
            icon: function () { return h("span", null, "📄"); },
            component: function (props) {
              return h(RemoteEditor, { tab: props && props.tab, ctx: props && props.ctx, scope: props && props.scope });
            }
          });
        });
      });

      if (slots) {
        slots.inject("settings.section", function () {
          return slots.register({
            name: "settings.section",
            id: "remote-ssh",
            order: 200,
            label: function () { return i18n.t("settings.nav"); },
            locale: NS
          }, SettingsSection);
        });

        // 接管原生「添加工作区」流程：用明显更低的优先级覆盖内置的本地目录选择器，
        // 弹窗内提供「本地目录（DSH browse）/ 远程目录（SSH）」两种浏览。
        var flowInject = function () { return { workspaces: ctx.get("workspaces") }; };
        ctx.effect(function () {
          return slots.inject("conversation.hero.workspace.directoryFlow", function () {
            return slots.register({ name: "conversation.hero.workspace.directoryFlow", priority: -100, inject: flowInject }, RemoteWorkspaceFlow);
          });
        });
        ctx.effect(function () {
          return slots.inject("sidebar.workspaces.directoryFlow", function () {
            return slots.register({ name: "sidebar.workspaces.directoryFlow", priority: -100, inject: flowInject }, RemoteWorkspaceFlow);
          });
        });
      }
```

</details>

#### 缺口

- 真实Host版本/远端环境和任务收益未独立执行。
  **影响**：不能把截图/工具/超算字样当端到端验收。
  **进一步探讨**：选可丢弃远端目录，对照SSH+原生DSH组合核执行/文件/终端一致及人审时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型工具如何绑定远端目录，写文件是否原子？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

toolContext显式连接参数优先，其次从当前DSH会话识别远程工作区profile与remotePath，并带exec.signal；显式profile时remotePath为undefined，不能认为当前工作区仍限定路径。remote_ssh_exec实际经runPooled到OpenSSH会话，返回stdout/stderr/exitCode并失效读缓存。它拼接cd <quoted path> 2>/dev/null; command，使用分号而非成功才继续；目标目录不存在/无权时cd失败被隐藏，后续命令仍在旧shell目录执行，是源码确认的目标位置缺陷，不是已运行事故。

文件路径解析仅把相对参数拼base，绝对、~、盘符原样通过，../没有canonical containment，因此工作区是便利默认值而非文件权限边界。write工具调用remoteWriteFile：上限用JS字符串length判断，内容转UTF8/base64，远端base64 -d > 目标，写后无论成功失败失效缓存。这个模型显式写入路径直接覆盖目标，并没有临时文件/rename，失败可先截断旧文件。README第109行“原子写入”不能套在当前函数上；另有chunked写回桥是不同路径，不可相互替代解释。

runPooled正常用持久会话，超时/取消不自动重放；其他异常会丢池后尝试一次性runRemote，连接结果不明的写/命令应回查真实状态，不能承诺exactly-once。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4465-4478](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L4465-L4478)

真实连接/路径/取消上下文。

<details>
<summary>查看原文（14行）</summary>

```text
  function toolContext(args, exec) {
    const signal = (exec && exec.signal) || undefined;
    const explicit = resolveProfile(args);
    if (explicit) return { profile: explicit, remotePath: undefined, signal: signal };
    const rc = remoteContextFor(exec);
    if (rc) return { profile: getProfile(rc.profileId), remotePath: rc.remotePath, signal: signal };
    return { profile: null, remotePath: undefined, signal: signal };
  }

  /** 把 exec.signal 绑进 runner（issue #35）：工具原本把 runPooled 直接交给各 helper，
   *  换成这个包装后，经 runner 发出的每一条 SSH 命令都自动带上取消信号，helper 无需改签名。 */
  function signalRunner(signal) {
    return function (p, cmd, stdinData, maxBytes, split, timeoutMs, role) {
      return runPooled(p, cmd, stdinData, maxBytes, split, timeoutMs, role, signal);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:5193-5221](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L5193-L5221)

真实exec拼cd分号/池调用/返回。

<details>
<summary>查看原文（29行）</summary>

```text

  register({
    name: "remote_ssh_exec",
    description: "通过 SSH 在远程主机（超算/服务器）上执行一条命令。用 profileId 引用已保存配置，或直接给 host/user。在当前远程工作区会话中可不填连接参数，自动用该工作区的连接并在其远程目录下执行。返回 stdout/stderr/exitCode。命令默认 120 秒超时（环境变量 DSH_REMOTE_SSH_CMD_TIMEOUT_MS 可覆盖），超时后相关池化会话被自动丢弃重建，不影响后续命令；长时间任务（构建/训练）用 timeoutMs 显式放宽或置 0 禁用。按停止键可取消：取消会丢弃池化会话、尽力给远端进程组发 SIGHUP 并在秒级返回，且**不会**把命令再执行一遍。`timeoutMs` 只是本地等待预算，到点只放弃等待、**不会终止远端命令**（需要远端硬时限请用远端的 `timeout`）。Run a command on a remote host (HPC/server) over SSH; returns stdout/stderr/exitCode; cancelling also SIGHUPs the remote process group, while a timeout only abandons the wait.",
    parameters: Object.assign({}, CONN_PARAMS, {
      command: { type: "string", required: true, description: "要执行的远程命令。" },
      stdin: { type: "string", description: "可选，写入远程命令的标准输入。" },
      timeoutMs: { type: "number", description: "本地等待预算（毫秒），默认 120000；0 表示不限。到点只放弃等待并丢弃池化会话（下次自动重建），**不会终止远端命令**（远端进程可能继续运行）；需要远端硬时限请用远端的 timeout 命令。按停止键才是取消：会尽力终止远端进程组。" }
    }),
    output: {
      schema: execSchema(),
      render: textRender(function (a, v) { return v.ok ? (v.stdout || "ok") : (v.error || v.stderr || v.stdout || "failed"); })
    },
    execute: async function (args, exec) {
      const tc = toolContext(args, exec);
      if (!tc.profile) return normExec({ ok: false, error: "需要 profileId 或 host+user（当前会话非远程工作区时必填）" });
      if (!args.command) return normExec({ ok: false, error: "command 为必填项" });
      let cmd = String(args.command);
      if (tc.remotePath) cmd = "cd " + shellQuotePath(tc.remotePath) + " 2>/dev/null; " + cmd;
      // 走持久会话池（stderr 分离，双哨兵协议）：首次调用完成建连后，
      // 后续调用不再重复 TCP 握手 + 认证，单次耗时从秒级降到毫秒级；
      // 会话异常时 runPooled 自动重建并降级一次性连接。命令级超时（issue #5）：
      // 挂起的命令到点被丢弃（连带重置该池化会话），不会无限阻塞队列。
      // 远程命令可能改任意文件（插件不可见）→ 整代失效读/列举缓存（findings §4.3a）。
      const r = await runPooled(tc.profile, cmd, args.stdin, undefined, true, args.timeoutMs, undefined, tc.signal);
      bumpCacheEpoch(tc.profile);
      return normExec(r);
    }
  });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4502-4508](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L4502-L4508)

路径只拼接不做工作区containment。

```text
  function resolveRemotePath(path, base) {
    if (!base) return path || "";
    if (!path) return base;
    const ch = String(path).charAt(0);
    if (ch === "/" || ch === "~" || /^[A-Za-z]:[\\/]/.test(String(path))) return String(path);
    return base.replace(/\/+$/, "") + "/" + String(path);
  }
```

**依据 4 · 源码核查**：[lib/index.js:5275-5297](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L5275-L5297)

write工具真实调用。

<details>
<summary>查看原文（23行）</summary>

```text
  register({
    name: "remote_ssh_write",
    description: "通过 SSH 把内容写入远程主机上的一个文件（覆盖写入）。用 profileId 引用已保存配置，或直接给 host/user。在当前远程工作区会话中可不填连接参数，相对路径基于该工作区远程目录解析。Write content to a file on a remote host over SSH (overwrite).",
    parameters: Object.assign({}, CONN_PARAMS, {
      path: { type: "string", required: true, description: "远程文件路径。" },
      content: { type: "string", required: true, description: "要写入的完整内容。" }
    }),
    output: {
      schema: execSchema(),
      render: textRender(function (a, v) { return v.ok ? "已写入" : (v.error || v.stderr || "写入失败"); })
    },
    execute: async function (args, exec) {
      const tc = toolContext(args, exec);
      if (!tc.profile) return normExec({ ok: false, error: "需要 profileId 或 host+user（当前会话非远程工作区时必填）" });
      const rp = resolveRemotePath(args.path, tc.remotePath);
      const wr = await remoteWriteFile(signalRunner(tc.signal), tc.profile, rp, args.content);
      // 模型显式写了远端 → 那一份就是"当前版本"，护栏 B 的记录作废（避免下一次误报"远端被改过"）
      if (wr && wr.ok && rp) freshnessForget(wrapperDir, tc.profile.id, rp);
      return normExec(wr);
    }
  });

  // 同步：把远程工作区的文件同步到本地镜像目录（syncDown），或把本地镜像改动推回远端（syncUp）。
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1891-1905](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L1891-L1905)

实际base64直接覆盖而非rename，失败可截断。

<details>
<summary>查看原文（15行）</summary>

```text
async function remoteWriteFile(runner, p, path, content) {
  if (!path) return { ok: false, error: "path 为必填项" };
  const c = content !== undefined ? String(content) : "";
  if (c.length > MAX_BYTES) {
    return { ok: false, exitCode: -1, stdout: "", stderr: "", error: "写入内容超过 " + MAX_BYTES + " 字节上限", truncated: false };
  }
  // base64 -d 写入（heredoc stdin）：heredoc 帧固定补一个尾随 \n，base64 解码会忽略它，
  // 从而字节级精确 —— 修复旧 `cat > file` 写法“每次保存尾随 +1 字节”的 quirk
  // （findings §3⑦），且对 NUL/二进制安全。内容 ≤4MB → base64 ≤5.6MB，内存可控。
  const r = await runner(p, "base64 -d > " + shellQuotePath(path), Buffer.from(c, "utf8").toString("base64"), MAX_BYTES, true);
  // 写后失效：成功与否都失效（失败的写也可能已截断旧文件）。
  invalidateRemoteCaches(p, path, { subtree: false });
  return r;
}

```

</details>

**依据 6 · 作者声明**：[README.md:109-109](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/README.md#L109-L109)

作者原子写入主张与当前路径不符。

```text
`remote_ssh_cat` 走 base64 传输（二进制安全），`remote_ssh_write` 为原子写入（写临时文件再 rename）。
```

**依据 7 · 源码核查**：[lib/index.js:4272-4291](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L4272-L4291)

超时/取消与其他异常fallback。

<details>
<summary>查看原文（20行）</summary>

```text
    } catch (e) {
      // 远端 PGID 必须在 close 之前取：withTimeout 的 onTimeout 已经 dropSession 过一次。
      const remotePgid = sess ? sess.remotePid : 0;
      dropSession();
      // 超时不走一次性连接回退：重试一条挂起的命令只会再次挂起（issue #5）。
      if (e && e.isTimeout) {
        await settleWithin(execP, 3000);
        return { ok: false, exitCode: -1, stdout: "", stderr: "", truncated: false, isTimeout: true, error: e.message };
      }
      // 取消同样不能回退（issue #35）：一次性连接会把刚被取消的命令**再执行一遍**。
      if (e && e.isAbort) {
        // 取消 = 终止：本地停稳与远端 SIGHUP 并行，取消返回不会被多等一个 RTT 拖长。
        // HUP 走独立一次性通道（绝不复用已取消的 exec.signal），失败只影响远端是否被清掉。
        await Promise.all([settleWithin(execP, 3000), hupRemoteGroup(p, remotePgid)]);
        return aborted();
      }
      // 会话挂了 —— 清理并回退到一次性连接（相当于自动重连一次）
      const r2 = await runRemote(subprocess, p, cmd, stdinData, maxBytes, undefined, tms, signal);
      if (!r2.ok && r2.exitCode === 255) r2.error = sshErrorHint(r2.stdout || r2.stderr || r2.error, p);
      return r2;
```

</details>

#### 缺口

- 实际坏cwd、写中断/回退重复和全部工作区识别语义未执行。
  **影响**：不能断言已丢数据或所有异常都会重复，仍需阻止敏感操作。
  **进一步探讨**：在fixture测不存在cwd仅pwd/无副作用任务、写中断保旧和连接丢响应；目录失败应拒绝而非继续。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · API、SSH信任与秘密如何划界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

SSH argv用StrictHostKeyChecking=accept-new，首次未知主机自动接受，已知改变仍由OpenSSH检查；不等预先核host fingerprint。非TTY密钥走BatchMode/publickey，需无交互或ssh-agent可用；密码POSIX用sshpass -p，Windows用askpass脚本和环境RSSH_ASKPASS_PW，存在进程/环境/备份可见性责任，不能从UI隐藏密码推出secret vault。publicProfiles确实剥password只给passwordConfigured，但运行时settingsFace仍保存原值，Host设置持久权限需单独核。

管理API实际每请求requestTrust(req,true)：要求Host回环或宿主trustedHosts、拒cross-site、Origin有时按hostname比不比端口，另外强制X-Requested-With XMLHttpRequest；正文有MAX_BYTES上限。没有在这些自有检查内核独立用户身份，非浏览器可自构头，真正谁能接DSH由外层Host认证/监听负责，不能把CSRF围栏当多用户授权，亦不能据此称已验证匿名公网执行。

工具可显式连接任意可达host/user、exec任意shell，远程账号权限就是实际权限。Host本机沙箱不自动变远端文件/命令隔离；工作区路径、缓存key与会话profile也不代表租户。高风险命令/敏感目录应保留原生工具审批、最小远端账号与独立fingerprint核验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:898-959](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L898-L959)

SSH选项、hostkey、认证与密码传递实际。

<details>
<summary>查看原文（62行）</summary>

```text
  // Windows 密码认证经环境变量传给 ssh.exe（SSH_ASKPASS）；POSIX 仍走 sshpass 前缀。
  // 调用方（runRemote / CommandSession / 会话池）把它合并进 subprocess.spawn 的 env。
  let passwordEnv = undefined;
  const opts = [sshExecutablePath()];
  if (tty) opts.push("-tt");
  opts.push("-p", String(p.port || 22));
  opts.push("-o", "StrictHostKeyChecking=accept-new");
  opts.push("-o", "ConnectTimeout=15");
  opts.push("-o", "ServerAliveInterval=30");
  opts.push("-o", "ServerAliveCountMax=3");
  // 插件内部连接（文件读写/工具/同步）不需要端口转发；
  // 清除 ssh config 里的 RemoteForward/LocalForward，避免端口被占时连接直接失败。
  opts.push("-o", "ClearAllForwardings=yes");
  // 性能 t3：非 tty 通道开启 SSH 内建压缩 —— 文件树/文件读取的 base64/文本载荷在高延迟
  // 公网链路（超算登录节点）上压缩收益显著（源码类 50%+），密文/二进制收益为零但无害；
  // tty（交互终端）保持默认，不给交互通道引入任何变量。
  if (!tty) opts.push("-o", "Compression=yes");
  if (p.proxyJump) opts.push("-o", "ProxyJump=" + String(p.proxyJump));
  if (p.authMethod === "key" && p.keyPath) opts.push("-i", expandSshPath(p.keyPath));
  // 密钥认证的非交互连接（会话池 / 工具 / 同步）要求一次性无提示完成：
  // BatchMode 禁用 passphrase/确认交互（有口令的密钥立即报错而不是挂到超时），
  // PreferredAuthentications=publickey 跳过无谓的认证方法协商，缩短建连时间。
  if (!tty && p.authMethod === "key") {
    opts.push("-o", "BatchMode=yes");
    opts.push("-o", "PreferredAuthentications=publickey");
  }
  if (Array.isArray(extraOpts) && extraOpts.length) opts.push(...extraOpts);
  const target = String(p.user || "") + "@" + String(p.host || "");
  // 密码认证的前置条件：没有口令就地报错，绝不让 ssh 在管道上干等密码提示（那是 120s 超时的来源）。
  if (p.authMethod === "password" && !p.password && !tty) {
    throw new Error("密码认证需要已保存的口令：请在「设置 → 远程连接」里编辑该连接并保存密码。");
  }
  // POSIX 保持 sshpass（发行版包管理器可装，语义不变）；Windows 没有 sshpass，改走 OpenSSH
  // 原生 SSH_ASKPASS 机制：写一个一次性的 .cmd 助手到 wrapper 目录，通过环境变量把口令
  // 交给系统 ssh.exe。这比编译垫片干净——零依赖、零构建、可审计（口令只经环境变量与
  // 用户级临时文件传递，不出进程边界）。
  let head = [];
  if (p.authMethod === "password" && p.password) {
    if (process.platform === "win32") {
      const askpass = ensureWindowsAskpass();
      if (!askpass.ascii) {
        throw new Error("Windows 密码认证无法启用：OpenSSH 要求 askpass 助手位于**纯 ASCII 路径**，" +
          "而插件找不到可用的落点（" + askpass.file + "）。最常见原因是 Windows 用户名含中文/其他非 ASCII 字符" +
          "（%USERPROFILE% 会跟着变成非 ASCII，%TEMP% 也在它下面，都不能用），或 ProgramData / Public 不可写。处理：" +
          "① 设置环境变量 DSH_REMOTE_SSH_ASKPASS 指向纯 ASCII 目录下的 .cmd 助手（内容：两行，" +
          "第一行 @<nul set /p x=\"%RSSH_ASKPASS_PW%\"、第二行 @echo.）；② 该连接改用密钥认证。");
      }
      // SSH_ASKPASS_REQUIRE=force 让 ssh 在有/无 TTY 时都调用助手；DISPLAY 是历史遗留的
      // 触发条件，无 X11 也照设。Windows OpenSSH 8.4+ 支持（Win10 20H2+ 自带 8.6+）。
      passwordEnv = {
        SSH_ASKPASS: askpass.file,
        SSH_ASKPASS_REQUIRE: "force",
        DISPLAY: "localhost:0",
        RSSH_ASKPASS_PW: String(p.password)
      };
    } else {
      head = ["sshpass", "-p", String(p.password)];
    }
  }
  const argv = head.concat(opts, [target]);
  if (remoteCmd !== undefined) argv.push(remoteCmd);
  return { argv, env: passwordEnv };
```

</details>

**依据 2 · 源码核查**：[lib/index.js:35-40](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L35-L40)

UI/模型配置视图剥密码。

```text
/** 出口脱敏：一切对外视图（设置面板 / listProfiles / remote_ssh_profiles / save/delete 回显）
 *  都不再携带明文口令，只回 passwordConfigured 布尔。运行时 settingsFace 保留原值。 */
function publicProfiles(profiles) {
  return profiles.map(({ password, ...rest }) => ({ ...rest, passwordConfigured: !!password }));
}

```

**依据 3 · 源码核查**：[lib/index.js:3067-3094](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L3067-L3094)

Host/Origin/Sec-Fetch信任判断。

<details>
<summary>查看原文（28行）</summary>

```text
      : entryUrl.host === hostUrl.host;
  });
}

/** 本插件额外要求的非简单头（PR #4 的 CSRF 加固）。 */
function hasRequestedWithHeader(req) {
  return String(req.headers["x-requested-with"] || "").trim() === "XMLHttpRequest";
}

/** 判定一次请求是否可信：返回 "ok" 或具体拒绝原因（供调用方给出准确文案）。 */
function trustVerdict(req, trustedHosts) {
  const host = req.headers["host"];
  if (!host) return "no-host";
  const hostUrl = parseAuthority(host);
  if (hostUrl === undefined) return "bad-host";
  if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return "bad-host";
  if (req.headers["sec-fetch-site"] === "cross-site") return "cross-site";
  // Origin 围栏：浏览器带 Origin 时必须与本请求 hostname 一致（比较 hostname 而非 host ——
  // 部分 Chromium（Edge 151）对非默认端口的 loopback 页面会把 Origin 序列化成不带端口）。
  // 无 Origin 视为通过（Host 围栏已限定 authority）；字面量 "null"（沙箱 iframe / file:）拒绝。
  const origin = req.headers["origin"];
  if (origin === undefined) return "ok";
  try {
    return new URL(origin).hostname === hostUrl.hostname ? "ok" : "bad-origin";
  } catch (e) {
    return "bad-origin";
  }
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4171-4182](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L4171-L4182)

requestTrust再核非简单头。

<details>
<summary>查看原文（12行）</summary>

```text
  function requestTrust(req, requireRequestedWith) {
    const verdict = trustVerdict(req, trustedHostsNow());
    if (verdict !== "ok") return verdict;
    if (requireRequestedWith && !hasRequestedWithHeader(req)) return "header";
    return "ok";
  }

  /** 统一的 403 输出（带准确原因，避免把 Host 不可信误报成缺头）。 */
  function denyRequest(res, reason) {
    writeJson(res, 403, { ok: false, error: { code: reason === "header" ? "csrf" : "forbidden", message: trustErrorMessage(reason) } });
  }

```

</details>

**依据 5 · 源码核查**：[lib/index.js:5092-5116](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L5092-L5116)

真实管理API套guard/正文分发。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: "/remote-ssh/api",
    handler: async (req, res) => {
      // CSRF 加固：/remote-ssh/api/* 仅由本插件客户端调用，强制校验其必带的
      // x-requested-with 头（跨站攻击者无法在 no-cors POST 中携带非简单头）。
      // 信任判定走宿主 webRuntime.trustedHosts（issue #12），失败时回传具体原因。
      const apiTrust = requestTrust(req, true);
      if (apiTrust !== "ok") { denyRequest(res, apiTrust); return; }
      if (req.method !== "POST") { writeError(res, new Error("method not allowed"), 405); return; }
      const pathname = new URL(req.url || "/", "http://dsh.internal").pathname;
      if (!pathname.startsWith(API_BASE)) { writeError(res, new Error("not-found"), 404); return; }
      const method = pathname.slice(API_BASE.length);
      if (!method || method.includes("/")) { writeError(res, new Error("not-found"), 404); return; }
      try {
        const handler = api[method];
        if (!handler) throw new Error("unknown api method: " + method);
        const payload = await readJsonBody(req);
        const result = await handler(payload);
        writeOk(res, result);
      } catch (error) {
        writeError(res, error);
      }
    }
  }), "dsh-remote-ssh: /remote-ssh/api routes");
```

</details>

**依据 6 · 源码核查**：[lib/index.js:4465-4472](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L4465-L4472)

显式连接优先。

```text
  function toolContext(args, exec) {
    const signal = (exec && exec.signal) || undefined;
    const explicit = resolveProfile(args);
    if (explicit) return { profile: explicit, remotePath: undefined, signal: signal };
    const rc = remoteContextFor(exec);
    if (rc) return { profile: getProfile(rc.profileId), remotePath: rc.remotePath, signal: signal };
    return { profile: null, remotePath: undefined, signal: signal };
  }
```

#### 缺口

- Host外层认证、settings秘密落盘和全部终端/上传路由的授权未全审。
  **影响**：不能当多租户远程执行平台或证明密码无泄露面。
  **进一步探讨**：隔离profile核未认证HTTP/跨站拒绝及最小SSH账号，记录凭据存储/备份并先核指纹。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 超时、取消、kill与退出的远端效果是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

默认命令120秒本地等待预算，超时dropSession、最多等旧promise3秒返回isTimeout，不发远端HUP，也不回退重试；远端任务可能继续。取消则取remotePid、dropSession并平行等待本地settle与独立SSH kill -HUP -pgid（4秒预算），失败返回false，取消回执仍是aborted。nohup/setsid可存活，命令true尾缀也让“发起HUP成功”不等所有子进程消失，需远端结果查证。手动kill all同样收池和尽力HUP，明确不影响交互终端/保存配置，下次工具可重建。

新版settings按loader Config存储、旧版register兼容；注册失败可只读配置，迁移错误日志提示重新添加，不保证所有版本持久成功。软件只停插件也不自动清远端作业/文件和已保存密钥。初次需OpenSSH、远端标准sshd/shell/工具、Host服务/可选sidebar、hostkey及凭据配置；持续有模型/远端算力/连接/镜像磁盘、人审与版本联动，金额和净节时未量化。整树sync/push另有大文件/删除/路径复杂性，本次未完整审其防护，不建议作为第一任务。

当前观察，在无秘密远端目录先核pwd/列表和取消/超时区别；目录已失效就拒绝命令。退出先在远端确认真实进程/作业，停交互终端和池、撤profile/凭据、核shell wrapper/原生设置恢复，再按归属处理镜像/缓存，回原生SSH和本地DSH。不能凭kill“已关闭”再次提交计算/写任务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4245-4291](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L4245-L4291)

超时/取消/回退真实分支。

<details>
<summary>查看原文（47行）</summary>

```text
  async function runPooled(p, cmd, stdinData, maxBytes, split, timeoutMs, role, signal) {
    const tms = resolveTimeoutMs(timeoutMs);
    const skey = sessionKeyOf(p, role);
    const dropSession = () => {
      const old = sessions.get(skey);
      if (old) { old.close(); sessions.delete(skey); }
    };
    const aborted = () => ({ ok: false, exitCode: -1, stdout: "", stderr: "", truncated: false, isAbort: true, error: "已取消" });
    // 取消（issue #35）：进来就已是取消态 → 不建连、不发命令，直接返回。
    if (signal && signal.aborted) return aborted();
    let execP;
    let sess = null;
    try {
      sess = getSession(p, role);
      execP = sess.exec(cmd, stdinData, split);
      const r = await withTimeout(execP, tms, "池化命令", function () {
        dropSession();
      }, signal);
      const stderr = split ? String(r.stderr || "") : "";
      if (r.exitCode === 0) return { ok: true, exitCode: 0, stdout: r.stdout, stderr: stderr, error: "", truncated: false };
      // exit 255 = ssh 连接层失败（非远程命令失败）：会话作废，下次调用重建。
      if (r.exitCode === 255) dropSession();
      const errSource = String(stderr || r.stdout || "");
      const error = r.exitCode === 255
        ? sshErrorHint(errSource, p)
        : (errSource.trim().slice(0, 500) || ("ssh 退出码 " + r.exitCode));
      return { ok: false, exitCode: r.exitCode, stdout: r.stdout, stderr: stderr, error: error, truncated: false };
    } catch (e) {
      // 远端 PGID 必须在 close 之前取：withTimeout 的 onTimeout 已经 dropSession 过一次。
      const remotePgid = sess ? sess.remotePid : 0;
      dropSession();
      // 超时不走一次性连接回退：重试一条挂起的命令只会再次挂起（issue #5）。
      if (e && e.isTimeout) {
        await settleWithin(execP, 3000);
        return { ok: false, exitCode: -1, stdout: "", stderr: "", truncated: false, isTimeout: true, error: e.message };
      }
      // 取消同样不能回退（issue #35）：一次性连接会把刚被取消的命令**再执行一遍**。
      if (e && e.isAbort) {
        // 取消 = 终止：本地停稳与远端 SIGHUP 并行，取消返回不会被多等一个 RTT 拖长。
        // HUP 走独立一次性通道（绝不复用已取消的 exec.signal），失败只影响远端是否被清掉。
        await Promise.all([settleWithin(execP, 3000), hupRemoteGroup(p, remotePgid)]);
        return aborted();
      }
      // 会话挂了 —— 清理并回退到一次性连接（相当于自动重连一次）
      const r2 = await runRemote(subprocess, p, cmd, stdinData, maxBytes, undefined, tms, signal);
      if (!r2.ok && r2.exitCode === 255) r2.error = sshErrorHint(r2.stdout || r2.stderr || r2.error, p);
      return r2;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4294-4314](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L4294-L4314)

settle与独立best-effort HUP。

<details>
<summary>查看原文（21行）</summary>

```text
  /** 等一个可能永远不 settle 的 promise 落地，最多 ms（用于取消/超时后的「停稳」窗口）。 */
  function settleWithin(prom, ms) {
    if (!prom || typeof prom.then !== 'function') return Promise.resolve();
    return Promise.race([prom.then(function () {}, function () {}),
      new Promise(function (r) { setTimeout(r, ms); })]);
  }

  /** 给远端进程组发 SIGHUP（issue #35 复测建议）：只断开本地 ssh 不会结束远端命令，
   *  「按停止」的语义更接近「关终端」→ HUP。用 HUP 而非 TERM：nohup / setsid 起的长任务
   *  照常存活，与关终端一致。必须走**独立的一次性连接**（不能复用已 abort 的 signal），
   *  并给短超时：这是 best-effort 收尾，不能让它拖住取消返回。 */
  async function hupRemoteGroup(p, pgid) {
    const pid = Number(pgid);
    if (!Number.isInteger(pid) || pid <= 1 || pid > 0x7fffffff) return false;
    try {
      const r = await runRemote(subprocess, p, "kill -HUP -" + pid + " 2>/dev/null; true", undefined, 16 * 1024, undefined, 4000);
      return !!(r && r.ok);
    } catch (e) {
      return false;
    }
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:5143-5188](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L5143-L5188)

kill all/单profile实际作用范围。

<details>
<summary>查看原文（46行）</summary>

```text
  register({
    name: "remote_ssh_kill",
    description: "强制关闭 Remote-SSH 插件的池化 SSH 会话（issue #5 的兜底恢复手段）。当某条远端命令挂起、或想强制断开并重新建立连接时使用：关闭某个连接配置的持久会话，或关闭全部会话。关闭本地会话的同时会尽力（最多等 4s）给远端 shell 所在的进程组发 SIGHUP，让远端正在跑的命令一起停下 —— 与「按停止键取消」同义；nohup / setsid 起的任务不受影响。仅影响插件内部的命令会话与连接缓存，不影响交互式终端与已保存的连接配置；下次调用工具时会自动重建会话。Force-close pooled SSH sessions of the Remote-SSH plugin (recovery hatch for hung commands); it also best-effort SIGHUPs the remote process group so the remote command stops too.",
    parameters: Object.assign({}, CONN_PARAMS, {
      all: { type: "boolean", description: "关闭全部 profile 的池化会话（此时忽略 profileId/host 等连接参数）。" }
    }),
    output: {
      schema: {
        type: "object", additionalProperties: false, properties: {
          ok: { type: "boolean", required: true },
          killed: { type: "number", required: true },
          active: { type: "number", required: true },
          message: { type: "string", required: true }
        }
      },
      render: textRender(function (a, v) { return v.message || (v.ok ? "ok" : "failed"); })
    },
    execute: async function (args, exec) {
      if (args && args.all) {
        const n = sessions.size;
        const pgs = [];
        sessions.forEach(function (s) {
          if (s.remotePid) pgs.push(hupRemoteGroup(s.profile, s.remotePid));
          try { s.close(); } catch (e) {}
        });
        sessions.clear();
        await Promise.all(pgs);
        return { ok: true, killed: n, active: 0, message: "已关闭全部 " + n + " 个池化会话" + (pgs.length ? "，并尽力向 " + pgs.length + " 个远端进程组发了 SIGHUP" : "") + "（下次调用工具时按需重建）。" };
      }
      const tc = toolContext(args, exec);
      if (!tc.profile) {
        return { ok: false, killed: 0, active: sessions.size, message: "需要 profileId 或 host+user（当前会话非远程工作区时必填），或传 all: true 关闭全部会话。" };
      }
      const key = profileKey(tc.profile);
      const s = sessions.get(key);
      let hup = null;
      if (s) {
        if (s.remotePid) hup = hupRemoteGroup(tc.profile, s.remotePid);
        s.close();
        sessions.delete(key);
      }
      await Promise.all(hup ? [hup] : []);
      return {
        ok: true,
        killed: s ? 1 : 0,
        active: sessions.size,
```

</details>

**依据 4 · 作者声明**：[README.md:121-123](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/README.md#L121-L123)

作者当前超时/远端语义说明。

```text
`timeoutMs: 0` 禁用本次超时；环境变量 `DSH_REMOTE_SSH_CMD_TIMEOUT_MS=600000` 可改全局默认。超时后池化会话自动丢弃重建，`remote_ssh_kill` 是随时可用的手动兜底。

**远端语义（2.4.44 起写清）**：`timeoutMs` 只是**本地等待预算** —— 到点只放弃等待并丢弃会话，**不会终止远端命令**（远端进程可能继续运行，输出不再回传；断开连接 / 退出 DSH 同理）。需要远端硬时限请用远端自己的 `timeout <秒> <命令>`。**按停止键取消**与 `remote_ssh_kill` 才代表「终止」：插件会给远端 shell 所在的进程组发 SIGHUP（最多等 4s；与关终端同义，`nohup` / `setsid` 起的任务不受影响）。
```

**依据 5 · 源码核查**：[lib/index.js:4374-4410](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L4374-L4410)

legacy settings注册失败/持久路径。

<details>
<summary>查看原文（37行）</summary>

```text
    // ---- 旧版（≤0.1.6）：register(ns, schema) + scope.get()/update() ----
    // 说明：能走到这里有两种可能 —— 只有 register（真正的旧宿主）、或两套都有但新路径读不到本插件
    // 命名空间（0.1.5 / 0.1.6，issue #34）。
    if (settingsApi === "legacy") {
      // settings 命名空间直接传插件 id（匹配 /^[a-z][a-z0-9-]*$/）。不再依赖
      // @deepseek-ai/dsh-settings 的 legacy `settingsNamespace` 构造器（该导出仅为
      // alpha.2 之前的插件保留，未来可能移除）；恒等语义下两种写法存储键完全一致。
      // register 也可能抛（命名空间已被别处注册 / 服务实现变了）：那时退到只读 config，
      // 插件照常挂载（连接列表可看、改不动），比让 apply 抛错、整个插件不加载要好。
      let scope = null;
      try {
        scope = svc.register(NS, PrefsSchema);
      } catch (e) {
        try { ctx.logger?.warn?.("[dsh-remote-ssh] settings.register 失败，本次以只读配置运行: " + String(e && e.message ? e.message : e)); } catch (e2) {}
      }
      if (scope) {
        settingsFace = {
          read: () => {
            const v = scope.get();
            return {
              profiles: prefsArray(v && v.profiles),
              workspaces: prefsArray(v && v.workspaces),
              nodePath: String(prefsScalar("", v && v.nodePath) || ""),
              writeBackFailure: String(prefsScalar("error", v && v.writeBackFailure) || "error"),
              writeBackFreshness: prefsScalar(true, v && v.writeBackFreshness) !== false,
              // 全局默认同步范围（issue #28）
              defaultSyncPaths: normalizeSyncList(prefsArray(v && v.defaultSyncPaths)),
              defaultSyncExclude: normalizeSyncList(prefsArray(v && v.defaultSyncExclude)),
              defaultSyncMaxBytes: prefsNumber(0, v && v.defaultSyncMaxBytes)
            };
          },
          updateProfiles: async (profiles) => { await scope.update({ profiles: profiles }); },
          updateWorkspaces: async (workspaces) => { await scope.update({ workspaces: workspaces }); },
          updatePrefs: async (patch) => { await scope.update(patch); }
        };
        return;
      }
```

</details>

#### 缺口

- 远端PGID/信号实际终止、全部sync/镜像护栏、跨版本升级恢复和费用未知。
  **影响**：不得宣称硬截止、无损同步或生产净收益。
  **进一步探讨**：无副作用进程测timeout/abort/HUP/daemon，观察远端真实状态；sync另做可丢弃fixture专项。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么能让远程工作区成为可核任务边界？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可检验方向是将远端目标与操作状态变为显式契约：命令必须确认canonical cwd且cd失败立即拒绝；写先临时文件与可核版本再rename；为远端operation记录已接收/运行/完成/未知，取消只报告已请求信号，另查进程/作业结果。基线是当前方便上下文、cd分号、直接覆盖和本地超时/尽力HUP，而非重造SSH。

最小实验在无秘密账号/fixture目录中对照现版与改版，测目录消失/权限变化、文件并发改动、写流中断、命令已起后断线、timeout/abort、nohup和SLURM提交丢响应。指标是错目录执行、旧文件损坏、重复提交/未核终止次数，以及恢复时间/人审成本。可接远端现成timeout/调度器jobId和原子文件机制，不用自建通用工作流引擎。

若用户只需只读浏览且原生SSH组合已够，机制成本可能无收益；不能获得作业/操作ID时保留未知并人工核验，不宣称exactly-once或远端kill保证。此为未验证方向，不算当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:5193-5221](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L5193-L5221)

cwd/命令真实基线。

<details>
<summary>查看原文（29行）</summary>

```text

  register({
    name: "remote_ssh_exec",
    description: "通过 SSH 在远程主机（超算/服务器）上执行一条命令。用 profileId 引用已保存配置，或直接给 host/user。在当前远程工作区会话中可不填连接参数，自动用该工作区的连接并在其远程目录下执行。返回 stdout/stderr/exitCode。命令默认 120 秒超时（环境变量 DSH_REMOTE_SSH_CMD_TIMEOUT_MS 可覆盖），超时后相关池化会话被自动丢弃重建，不影响后续命令；长时间任务（构建/训练）用 timeoutMs 显式放宽或置 0 禁用。按停止键可取消：取消会丢弃池化会话、尽力给远端进程组发 SIGHUP 并在秒级返回，且**不会**把命令再执行一遍。`timeoutMs` 只是本地等待预算，到点只放弃等待、**不会终止远端命令**（需要远端硬时限请用远端的 `timeout`）。Run a command on a remote host (HPC/server) over SSH; returns stdout/stderr/exitCode; cancelling also SIGHUPs the remote process group, while a timeout only abandons the wait.",
    parameters: Object.assign({}, CONN_PARAMS, {
      command: { type: "string", required: true, description: "要执行的远程命令。" },
      stdin: { type: "string", description: "可选，写入远程命令的标准输入。" },
      timeoutMs: { type: "number", description: "本地等待预算（毫秒），默认 120000；0 表示不限。到点只放弃等待并丢弃池化会话（下次自动重建），**不会终止远端命令**（远端进程可能继续运行）；需要远端硬时限请用远端的 timeout 命令。按停止键才是取消：会尽力终止远端进程组。" }
    }),
    output: {
      schema: execSchema(),
      render: textRender(function (a, v) { return v.ok ? (v.stdout || "ok") : (v.error || v.stderr || v.stdout || "failed"); })
    },
    execute: async function (args, exec) {
      const tc = toolContext(args, exec);
      if (!tc.profile) return normExec({ ok: false, error: "需要 profileId 或 host+user（当前会话非远程工作区时必填）" });
      if (!args.command) return normExec({ ok: false, error: "command 为必填项" });
      let cmd = String(args.command);
      if (tc.remotePath) cmd = "cd " + shellQuotePath(tc.remotePath) + " 2>/dev/null; " + cmd;
      // 走持久会话池（stderr 分离，双哨兵协议）：首次调用完成建连后，
      // 后续调用不再重复 TCP 握手 + 认证，单次耗时从秒级降到毫秒级；
      // 会话异常时 runPooled 自动重建并降级一次性连接。命令级超时（issue #5）：
      // 挂起的命令到点被丢弃（连带重置该池化会话），不会无限阻塞队列。
      // 远程命令可能改任意文件（插件不可见）→ 整代失效读/列举缓存（findings §4.3a）。
      const r = await runPooled(tc.profile, cmd, args.stdin, undefined, true, args.timeoutMs, undefined, tc.signal);
      bumpCacheEpoch(tc.profile);
      return normExec(r);
    }
  });
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1891-1905](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L1891-L1905)

直接写基线。

<details>
<summary>查看原文（15行）</summary>

```text
async function remoteWriteFile(runner, p, path, content) {
  if (!path) return { ok: false, error: "path 为必填项" };
  const c = content !== undefined ? String(content) : "";
  if (c.length > MAX_BYTES) {
    return { ok: false, exitCode: -1, stdout: "", stderr: "", error: "写入内容超过 " + MAX_BYTES + " 字节上限", truncated: false };
  }
  // base64 -d 写入（heredoc stdin）：heredoc 帧固定补一个尾随 \n，base64 解码会忽略它，
  // 从而字节级精确 —— 修复旧 `cat > file` 写法“每次保存尾随 +1 字节”的 quirk
  // （findings §3⑦），且对 NUL/二进制安全。内容 ≤4MB → base64 ≤5.6MB，内存可控。
  const r = await runner(p, "base64 -d > " + shellQuotePath(path), Buffer.from(c, "utf8").toString("base64"), MAX_BYTES, true);
  // 写后失效：成功与否都失效（失败的写也可能已截断旧文件）。
  invalidateRemoteCaches(p, path, { subtree: false });
  return r;
}

```

</details>

**依据 3 · 源码核查**：[lib/index.js:4272-4314](https://github.com/ZhangFengshun/dsh-remote-ssh/blob/8c35099d467669a4dcaaafc21cf77d566b21de2f/lib/index.js#L4272-L4314)

超时/取消/尽力HUP基线。

<details>
<summary>查看原文（43行）</summary>

```text
    } catch (e) {
      // 远端 PGID 必须在 close 之前取：withTimeout 的 onTimeout 已经 dropSession 过一次。
      const remotePgid = sess ? sess.remotePid : 0;
      dropSession();
      // 超时不走一次性连接回退：重试一条挂起的命令只会再次挂起（issue #5）。
      if (e && e.isTimeout) {
        await settleWithin(execP, 3000);
        return { ok: false, exitCode: -1, stdout: "", stderr: "", truncated: false, isTimeout: true, error: e.message };
      }
      // 取消同样不能回退（issue #35）：一次性连接会把刚被取消的命令**再执行一遍**。
      if (e && e.isAbort) {
        // 取消 = 终止：本地停稳与远端 SIGHUP 并行，取消返回不会被多等一个 RTT 拖长。
        // HUP 走独立一次性通道（绝不复用已取消的 exec.signal），失败只影响远端是否被清掉。
        await Promise.all([settleWithin(execP, 3000), hupRemoteGroup(p, remotePgid)]);
        return aborted();
      }
      // 会话挂了 —— 清理并回退到一次性连接（相当于自动重连一次）
      const r2 = await runRemote(subprocess, p, cmd, stdinData, maxBytes, undefined, tms, signal);
      if (!r2.ok && r2.exitCode === 255) r2.error = sshErrorHint(r2.stdout || r2.stderr || r2.error, p);
      return r2;
    }
  }
  /** 等一个可能永远不 settle 的 promise 落地，最多 ms（用于取消/超时后的「停稳」窗口）。 */
  function settleWithin(prom, ms) {
    if (!prom || typeof prom.then !== 'function') return Promise.resolve();
    return Promise.race([prom.then(function () {}, function () {}),
      new Promise(function (r) { setTimeout(r, ms); })]);
  }

  /** 给远端进程组发 SIGHUP（issue #35 复测建议）：只断开本地 ssh 不会结束远端命令，
   *  「按停止」的语义更接近「关终端」→ HUP。用 HUP 而非 TERM：nohup / setsid 起的长任务
   *  照常存活，与关终端一致。必须走**独立的一次性连接**（不能复用已 abort 的 signal），
   *  并给短超时：这是 best-effort 收尾，不能让它拖住取消返回。 */
  async function hupRemoteGroup(p, pgid) {
    const pid = Number(pgid);
    if (!Number.isInteger(pid) || pid <= 1 || pid > 0x7fffffff) return false;
    try {
      const r = await runRemote(subprocess, p, "kill -HUP -" + pid + " 2>/dev/null; true", undefined, 16 * 1024, undefined, 4000);
      return !!(r && r.ok);
    } catch (e) {
      return false;
    }
  }
```

</details>

#### 缺口

- 显式operation状态能否在HPC环境稳定取得并降低返工未知。
  **影响**：不将安全修复和新方向预支为现有价值。
  **进一步探讨**：先fixture与一个真实只读任务对照；维护比原生SSH更重就停止。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
