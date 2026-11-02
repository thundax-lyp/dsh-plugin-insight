# dsh-remote

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bdee1f7](https://github.com/flymysql/dsh-remote/tree/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7)

<!-- BEGIN META -->
[![GitHub ★ 222](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=222&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/flymysql/dsh-remote) [![npm 30d 36,398](https://img.shields.io/static/v1?label=npm+30d&message=36%2C398&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote)
<!-- END META -->

> **功能**：通过 SSH 连接远程主机，在 DSH 会话中绑定远程工作区并提供文件、命令、镜像同步与隧道操作。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 会话镜像origin与可变当前机分离，并用三路状态提示冲突，使远程工作更可审阅。贡献是集成与身份组织，不能从工具数或协议声明推任务效果。

> **主要限制**：[Q03](#research-q03) workspace-write仅词法限制文件路径，任意远端命令仍按SSH账户权限执行；默认inherit在策略缺失/解析失败时会回退全权限。取消路径尝试SIGTERM后即可返回，文案“已停止”不证明远端子进程和副作用终止。

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
  - [Q01 · 远程工作区为谁减少什么接线，实际入口是什么？](#detail-section-11)
  - [Q02 · 会话怎样选机、绑定镜像，文件写和同步怎样走？](#detail-section-12)
  - [Q03 · remote sandbox与异步执行到底限制什么？](#detail-section-13)
  - [Q04 · 多层资源与恢复成本支持怎样的采用？](#detail-section-14)
  - [Q05 · 如何验证镜像一致性与远端结果的增量假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护SSH主机的开发者可在DSH中按会话操作远端代码与构建，合格结果是目标不串线、两端变更可回读且命令结果明确。

独立SSH/SFTP和手工同步是基线；插件增加宿主会话与镜像组织，不提供远端操作系统隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话远端绑定 | 按cwd/mirror origin选机 | 无上下文有配置fallback |
| SFTP写文件 | 直接写远端内容 | 账户权限与有效模式决定边界 |
| 三路镜像同步 | 默认跳过冲突，支持dryRun | 快速键size/mtime非内容保证 |
| SSH命令/job | 运行构建与采集输出 | 取消尝试不证明所有副作用已停 |
| 远端权限护栏 | 拒绝只读变更/约束文件路径 | 非远端内核隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH及插件API | 必需 | 会话/工具/工作区和job | 声明范围不等验收 |
| SSH/SFTP、身份与网络 | 必需 | 连接远端读写/命令 | 身份不明先停连 |
| 正确镜像origin与会话cwd | 会话操作必需 | 避免目标串线 | 明确本地会话拒绝 |
| 有效remoteSandbox模式 | 受限操作必需 | 文件/命令工具护栏 | inherit fallback可能全权限 |
| 远端低权限账户/隔离 | 不可信命令必需 | 真正限制远端权限 | 词法护栏不能替代 |
| 远端DSH与Node | 网页挂载才必需 | 起远端Web并隧道访问 | 普通工具不要求此网页进程 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份并核对SSH身份、权限与低权限副本 | 不依赖inherit字面值 |
| 绑定 | 连接/选目录，打开镜像会话 | 核对origin、cwd与目标机 |
| 读取/同步 | 先只读和dryRun，检查冲突/截断/跳过 | 不把完成当全目录一致 |
| 执行 | 明确账户权限与job/超时语义 | 取消后另核远端状态 |
| 恢复 | 停重跑，独立SSH只读对账 | 从副本恢复，未知保持未知 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 主机、镜像、网络与备份未知 | 身份/权限/profile接线 | 时长未知 |
| 持续 | 远端计算、本地副本、网络和模型未知 | 冲突、密钥、跨平台与版本维护 | 无总效率对照 |
| 失败恢复 | 重传、晚到命令与副本资源未知 | 两端对账、查进程、恢复配置/文件 | 取消不等已停止 |
| 退出 | 镜像/凭据与远端进程处理 | 独立确认远端任务和隧道 | 关闭本地插件不回滚远端效果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话绑定 | cwd到origin及本地会话拒绝 | 全部API/跨平台路由 |
| 冲突保护 | size/mtime三路状态、force/dryRun | 内容碰撞与并发完整一致性 |
| 权限护栏 | read-only/词法workspace-write | 不提供远端内核隔离 |
| 命令取消 | signal接线与job | 远端子进程树/副作用已停 |

> **思考**：[Q03](#research-q03) workspace-write仅词法限制文件路径，任意远端命令仍按SSH账户权限执行；默认inherit在策略缺失/解析失败时会回退全权限。取消路径尝试SIGTERM后即可返回，文案“已停止”不证明远端子进程和副作用终止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 会话镜像origin与可变当前机分离，并用三路状态提示冲突，使远程工作更可审阅。贡献是集成与身份组织，不能从工具数或协议声明推任务效果。

[Q02](#research-q02)、[Q03](#research-q03) 会话origin归属与显式冲突值得借鉴；权限默认与注释的fail-closed表述不一致，取消文案也强于信号尝试。移植需保留远端权限、结果未知与独立回读，不把本地sandbox名称当远端证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) workspace-write仅词法限制文件路径，任意远端命令仍按SSH账户权限执行；默认inherit在策略缺失/解析失败时会回退全权限。取消路径尝试SIGTERM后即可返回，文案“已停止”不证明远端子进程和副作用终止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 当前观察，先在低权限测试主机核对有效模式、会话绑定和dryRun/回读，再考虑有限写。权限不明、同步不完整或取消后结果未知时停止重跑，独立SSH只读核对两端和进程，不把词法护栏当隔离。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持会话绑定、文件/同步与权限/取消接线；未连接真实SSH或复现风险。内容/停止确认为假设，不是已有保证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/binding.js、lib/remote-sandbox.js、lib/sync.js、lib/exec-job.js、lib/pool.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定会话绑定、SFTP写、三路同步、remoteSandbox与SSH2取消/job代表链；未穷尽OpenSSH、hostkey/凭据、HTTP、更新和全工具，未执行目标或真实远端。
- 下一步：按 [Q05](#research-q05) 在隔离两端比较元数据碰撞、同步中断与忽略SIGTERM情况下的漏判和恢复成本；生产前独立核对有效权限。

**分析版本**

- **仓库**：[flymysql/dsh-remote](https://github.com/flymysql/dsh-remote)
- **版本号**：0.8.68（[固定提交 bdee1f7](https://github.com/flymysql/dsh-remote/tree/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是选择性内容回读与停止确认，补足现有size/mtime三路状态和取消信号的漏判；先排除等价实现，再比较漏判和网络/人工开销，无净收益不增加。

按 [Q05](#research-q05) 在隔离两端比较元数据碰撞、同步中断与忽略SIGTERM情况下的漏判和恢复成本；生产前独立核对有效权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 4395 | — | — | 72152 |
| .mjs | source | 26 | 2890 | 2214 | 450 | — |
| .js | source | 31 | 17894 | 12275 | 5163 | — |
| .cjs | source | 1 | 305 | 159 | 126 | — |
| .js | test | 92 | 19056 | 14652 | 2945 | — |
| .mjs | test | 2 | 45 | 11 | 32 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/flymysql/dsh-remote/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=26&color=737b86&logo=github)](https://github.com/flymysql/dsh-remote/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/flymysql/dsh-remote/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话绑定与镜像同步怎样支持远程开发，权限与取消结果何处仍需独立确认？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程工作区为谁减少什么接线，实际入口是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向维护SSH主机、希望DSH在远端读代码和构建的开发者，插件把机器连接、远程目录、本地镜像与会话组织在宿主内。合格结果是本会话始终指向预期机器/目录，修改和同步状态可回读，命令结果与远端实际状态相符。手工SSH/SFTP加本地浏览器已能做基本工作，本包的增量在会话绑定、原生工作区收养及冲突提示，不是发明SSH或提供远端操作系统隔离。

包有DSH bundle和客户端入口，21个rw工具是作者清单；本次重点跟读写、同步和执行代表链，不把清单数量当全部可用性。Desktop只读连接等验收是作者记录，完整GUI和跨平台仍标实验，本次没有独立复现。更需要命令行直接操作、或不愿维护双副本的人可继续原SSH流程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-23](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/README.md#L17-L23)

作者定义远程工作助手与主动连出模式。

```text
**为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）打造的远程工作助手。**

维护多台 SSH 机器，然后在「选择工作区」时选一个**远程工作区**（或**本地工作区**），Agent 就能在不离开 harness 的情况下直接操作——列文件、读代码、在远程主机上跑构建/命令，并把远程目录镜像成一个真实的本地工作区对象。

DSH 的 Web 界面刻意只监听 `127.0.0.1`（CLI 为安全拒绝 `--host 0.0.0.0`）。本插件反过来：**由你主动连出**到你维护的机器，选一个工作区，然后通过 DSH 原生的工作区 + 文件流来工作——**不改动 `dsh-workspace` 核心**。

反过来也成立：**你可以把远端那台机器的 DSH 网页界面，当成本机浏览器里的一个页面打开**——同样不需要在远端开放任何端口（详见 [在本地打开远程机器上的 DSH 界面](#在本地打开远程机器上的-dsh-界面)）。远端 dsh 需要你先装好（插件不再代装）。
```

**依据 2 · 作者声明**：[README.md:35-57](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/README.md#L35-L57)

镜像/工具/同步与配置目标。

<details>
<summary>查看原文（23行）</summary>

```text
- 路径框实时补全；Windows 主机根级显示「此电脑」多盘视图；「浏览…」浮层选中只回填、不直接提交。
- 确定后创建**真实本地镜像**并被 harness 收养，同时通过 SFTP 保持同步；所选工作区持久化到该机器。

---

## 功能

![核心能力总览 — 多机 SSH / 别名实时解析 / 双 tab 选择器 / 三路同步 / 远程 @ 补全 / 远端 DSH 界面挂到本机 / 安全审计 / 端口转发 / 侧栏编辑 / 自动更新，以及 21 个 rw_* 工具](docs/shots/features.png)

上图是能力总览；下面只列**上图没说清、但用起来需要知道**的部分。

其余要点：

- **21 个模型工具**（便于复制/检索）：`rw_info`、`rw_connect`、`rw_machines`、`rw_pick_workspace`、`rw_list_dir`、`rw_stat`、`rw_read_file`、`rw_write_file`、`rw_edit`、`rw_append`、`rw_mkdir`、`rw_remove`、`rw_move`、`rw_exec`、`rw_search`、`rw_download`、`rw_upload`、`rw_sync`、`rw_push`、`rw_forward`、`rw_disconnect`。
- **会话列表里区分本地/远程**（`0.8.43+`）—— 远程会话的行首有一个**绿点**，悬停显示 `user@host:port` 与远端路径；打开该会话后，标题栏还会常显一个主机标签（本地会话两者都没有）。判定只看会话 cwd 是否落在 `$DSH_HOME/remote-workspaces/…` 镜像里，所以「保存过但没在用」的机器不会给本地会话打标。
- **把远端机器的 DSH 界面挂到本机**（`0.8.36+`）—— 不用在远端开任何端口：插件主动 SSH 连过去，在远端**只监听 `127.0.0.1`** 地起一个 `dsh web`，再把端口经隧道搬回本机的一个 loopback 端口。地址带一次性登录令牌，只在本机这次跳转里用一次。
- **审计日志可以在本机直接打开** —— 面板里预览最近条目，另有「打开日志文件」「在文件夹中显示」直接调用本机程序打开那个日志（日志在运行 DSH 的机器上，浏览器打不开它）。
- **远端跨平台** —— 文件访问走 SFTP 协议层（不依赖 POSIX shell），Linux/macOS/Windows 远端都能列/读/写/搜索/同步。
- **Windows 主机** —— 自动探测平台并定位 Git Bash，命令经 `bash -s` 走 stdin 执行，不受引号/反斜杠转义困扰（`config.shell` 可指定或设 `native` 关闭）；`C:\Users\dev` 与 `/c/Users/dev` 两种写法都接受。
- **长任务异步化** —— `rw_sync`/`rw_push` 传 `async: true` 返回 `taskId`，可查询进度/结果/取消。
- **数据跟随 Harness 根目录** —— 机器清单与镜像在 `$DSH_HOME/remote-workspaces`；0.6 之前的数据首次启动自动迁移。
- **`~/.ssh/config` 是连接四字段的唯一来源**（`0.8.50+`，issue #50）—— 保存机器时把 主机/用户/端口/私钥 写入 `~/.ssh/config` 的受管块（`# dsh-remote: managed` 标记，只动自己的块；你手写的同名 Host 块绝不覆盖，会提示冲突）。之后**改这个文件立即生效**：任何 Host 块点名的主机（含字面 IP），连接都按文件解析（裸 `Host *` 是通用默认，不算点名）；机器记录里的副本只做兜底，插件自己的状态（最近工作区/延迟等）仍存注册表。
- **不改动 `dsh-workspace` 官方代码** —— 全部作为普通插件实现。
```

</details>

**依据 3 · 作者声明**：[README.md:71-87](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/README.md#L71-L87)

Desktop实验边界与Web侧栏可选条件。

<details>
<summary>查看原文（17行）</summary>

````text
### 官方 Desktop 兼容适配（实验性）

对 [DeepSeek 官方 Desktop](https://github.com/deepseek-ai/deepseek-harness) 的适配（以 `0.1.5-rc.2` Host 协议验证，不修改 Harness 核心）：

- 经 `ctx.connection.fetch` 注册 `/api/dsh-remote/*`，由 Desktop 的 `dsh-app:` 通道承载，不启动 Web Server。
- 经 `sidebarRightTabs` 提供原生「远程文件」入口，不把远端路径传给本地预览器。
- `dsh-better-sidebar` 不再内置；官方 Desktop 用原生右侧栏，不需要它。

已验证 Host 启动、IPC 请求、真实 SSH 的只读连接/列目录/读文件，以及双机会话路由（侧栏 `/ls` `/read` `/write` `/fs` 带 `sessionId` 时按会话选机）。原生文件 tab 的完整 GUI、失败/取消交互、非 macOS 宿主仍属实验性。Desktop 安装器可能需为 `ssh2` / `cpu-features` 可选构建脚本配置策略。

### 已发布的 Web bundle

```bash
dsh plugin add dsh-remote
```

自 **v0.8.18** 起只安装并挂载自身；Web 侧边栏（[dsh-better-sidebar](https://www.npmjs.com/package/dsh-better-sidebar)）改为可选。需要 Web 版远程文件浏览/编辑时再单独装它；不装时 `rw_*` 工具、设置页、同步、审计与转发均照常工作。
````

</details>

**依据 4 · 源码核查**：[lib/index.js:1553-1583](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/index.js#L1553-L1583)

源码按会话cwd定位remote绑定，支持会话集成贡献。

<details>
<summary>查看原文（31行）</summary>

```text
  const bindingFor = (exec) => {
    const cwd = exec?.agent?.session?.header?.cwd
    if (cwd) {
      const { remotePath, machine, mirrorDir } = resolveMirrorForLocal(String(cwd))
      if (remotePath && machine) {
        return {
          pool: poolForMachine(machine),
          ws: remotePath,
          host: machine.host,
          username: machine.username,
          port: machine.port,
          alias: machine.alias || '',
          mirrorDir,
          bound: true,
          local: false,
        }
      }
    }
    return {
      pool,
      ws: wsPath(),
      host: config.host,
      username: config.username,
      port: config.port,
      mirrorDir: wsPath() ? mirrorDirFor(wsPath(), config.host, config.username, config.port) : null,
      bound: false,
      // A caller that identified itself with a cwd, yet resolved to no mirror,
      // is definitively a LOCAL session. Distinguish it from "no caller
      // context at all", where the active machine is still the right answer.
      local: !!cwd,
    }
```

</details>

#### 缺口

- 无同任务SSH/SFTP基线的效率和错误率结果
  **影响**：不能证明整体远程开发更快或可靠
  **进一步探讨**：在低权限测试主机副本比较读改构建、冲突和恢复的完整投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话怎样选机、绑定镜像，文件写和同步怎样走？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

binding从本地cwd扫描镜像元数据，比较目录边界并选最长匹配；缺失或不可解析元数据不猜目标。index优先以该会话镜像的origin取得连接池和远端路径；明确本地会话在requireBinding中拒绝，不借另一个全局active machine。没有调用上下文仍有配置fallback，不能说所有调用都强制会话绑定。

远端写工具先解析机器、做remote sandbox检查，再取SFTP、创建目录并writeFile，返回字节数。同步维护每镜像上次size/mtime状态，对比远端、本地与基线；默认遇双边变化或远端单变时跳过并报冲突，force会改为覆盖，dryRun只计划。它并非内容哈希事务：快速键是size/mtime，同样大小和时间可能掩盖内容变化；首次无基线、传输中断、文件上限/跳过和不可写条目仍须看具体返回，不能把一个sync完成当全目录一致。

可借鉴的是把会话身份与可变当前机分离，以及把冲突作为一等结果。直接写和多文件同步都不提供跨主机事务或回滚保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/binding.js:18-37](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/binding.js#L18-L37)

分隔符边界与不猜缺失元数据的规则。

<details>
<summary>查看原文（20行）</summary>

```text
/** Strip trailing separators so a mirror root and a path inside it compare cleanly. */
const norm = (p) => path.resolve(String(p || '')).replace(/[\\/]+$/, '') || ''

/** Whether `base` is `dir` itself or nested under it (separator-aware, so
 *  `/a/mirror-2` is NOT treated as living inside `/a/mirror`). */
const isUnder = (base, dir) => base === dir || base.startsWith(dir + path.sep) || base.startsWith(dir + '/')

/**
 * Resolve which remote workspace a LOCAL path belongs to by scanning the mirror
 * registry for the mirror that contains it.
 *
 * Mirrors live exactly one level under the registry root as
 * `<host>-<user>-<port>/<basename>`, and `mirrorDirFor()` appends a short hash
 * when two remote paths share a basename, so containment is unambiguous. The
 * longest containing path still wins, which keeps the result stable if a
 * future layout ever nests them.
 *
 * A mirror whose meta is missing, unparsable, or has no `host` is skipped
 * rather than guessed at: reporting no binding makes the caller refuse loudly,
 * while guessing would send commands to an unintended host.
```

</details>

**依据 2 · 源码核查**：[lib/binding.js:47-80](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/binding.js#L47-L80)

实际扫描并读镜像origin。

<details>
<summary>查看原文（34行）</summary>

```text
export function resolveMirror(local, root) {
  let mirrorDir = null
  let remotePath = ''
  let machine = null
  if (!local || !root || !existsSync(root)) return { mirrorDir, remotePath, machine }
  const base = norm(local)
  let hostDirs
  try {
    hostDirs = readdirSync(root)
  } catch {
    return { mirrorDir, remotePath, machine }
  }
  for (const hostDir of hostDirs) {
    const hostPath = path.join(root, hostDir)
    if (!statSync(hostPath, { throwIfNoEntry: false })?.isDirectory?.()) continue
    let entries
    try {
      entries = readdirSync(hostPath)
    } catch {
      continue
    }
    for (const entry of entries) {
      const metaPath = path.join(hostPath, entry, '.dsh-remote-meta.json')
      if (!existsSync(metaPath)) continue
      const mirrorAbs = norm(path.join(hostPath, entry))
      if (!isUnder(base, mirrorAbs)) continue
      // Deepest match wins; an equal-length path cannot occur twice.
      if (mirrorDir && mirrorAbs.length <= mirrorDir.length) continue
      try {
        const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
        if (!meta || !meta.host) continue
        mirrorDir = mirrorAbs
        remotePath = String(meta.remotePath || '')
        machine = {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1553-1614](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/index.js#L1553-L1614)

会话绑定、无上下文fallback与本地拒绝。

<details>
<summary>查看原文（62行）</summary>

```text
  const bindingFor = (exec) => {
    const cwd = exec?.agent?.session?.header?.cwd
    if (cwd) {
      const { remotePath, machine, mirrorDir } = resolveMirrorForLocal(String(cwd))
      if (remotePath && machine) {
        return {
          pool: poolForMachine(machine),
          ws: remotePath,
          host: machine.host,
          username: machine.username,
          port: machine.port,
          alias: machine.alias || '',
          mirrorDir,
          bound: true,
          local: false,
        }
      }
    }
    return {
      pool,
      ws: wsPath(),
      host: config.host,
      username: config.username,
      port: config.port,
      mirrorDir: wsPath() ? mirrorDirFor(wsPath(), config.host, config.username, config.port) : null,
      bound: false,
      // A caller that identified itself with a cwd, yet resolved to no mirror,
      // is definitively a LOCAL session. Distinguish it from "no caller
      // context at all", where the active machine is still the right answer.
      local: !!cwd,
    }
  }

  /**
   * Binding for a tool that requires a remote workspace, with a diagnostic
   * refusal when none is resolvable. Failing loud here is the point: silently
   * falling back to the active machine is how a command reached the wrong host.
   * @param {object} exec - the tool's `ToolRunContext`.
   * @param {string} tool - tool name, used in the error message.
   * @returns {ReturnType<typeof bindingFor>} a binding with `bound: true`.
   */
  const requireBinding = (exec, tool) => {
    const b = bindingFor(exec)
    // A LOCAL session must be refused even when an active machine happens to
    // have a workspace: inheriting it is precisely how a command reaches a host
    // the caller never asked for. Checking only `!b.ws` missed this, because
    // the active machine's workspace is usually non-empty.
    if (b.local) {
      throw new Error(
        `${tool}: this session is LOCAL — its workspace is not a remote mirror, `
        + 'so there is no remote host to act on. Refusing rather than falling back to the active machine '
        + `(${config.username || '?'}@${config.host || '?'}), which belongs to a different session. `
        + 'Use rw_connect + rw_pick_workspace to bind a remote workspace, then open a session in its local mirror.',
      )
    }
    if (!b.ws) {
      throw new Error(
        `${tool}: no remote workspace set — call rw_connect then rw_pick_workspace first.`,
      )
    }
    if (!b.host) throw new Error(`${tool}: no remote host resolved for this session — run rw_connect first.`)
    return b
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2412-2435](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/index.js#L2412-L2435)

SFTP写入前的机器与权限接线。

<details>
<summary>查看原文（24行）</summary>

```text
      name: 'rw_write_file',
      description:
        'Write text to a file on the remote host (creating parent directories if needed). Path is absolute. Use this to create or overwrite a remote file directly, instead of round-tripping through a local mirror.',
      parameters: {
        path: { type: 'string', required: true, description: 'Absolute remote file path' },
        content: { type: 'string', required: true, description: 'File content to write (overwrites existing file)' },
        mkdir: { type: 'boolean', description: 'Create missing parent directories (default true)' },
        encoding: { type: 'string', description: 'Text encoding, e.g. utf-8 (default) or gbk' },
      },
      output: okOut,
      async execute(args, exec) {
        const b = requireMachine(exec, 'rw_write_file')
        // Remote sandbox fence: a write must be permitted by this session's resolved mode.
        requireRemoteSandbox(exec, 'write', { tool: 'rw_write_file', path: String(args.path || '') })
        const p = resolveRemoteArg(b, args.path)
        if (!p || p === '/') throw new Error('rw_write_file: a file path is required')
        const content = String(args.content == null ? '' : args.content)
        const sftp = await b.pool.sftp()
        if (args.mkdir !== false) await mkdirRemoteDirs(sftp, remoteDirname(p))
        const buf = encodeText(content, args.encoding || config.encoding)
        await sftp.writeFile(p, buf)
        const bytes = buf.byteLength
        audit('write_file', `write ${p} (${bytes}B)`, 0, b)
        return { ok: true, bytes, text: `wrote ${bytes} bytes to ${p}` }
```

</details>

**依据 5 · 源码核查**：[lib/sync.js:3-20](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/sync.js#L3-L20)

三路状态/force/dryRun约定。

<details>
<summary>查看原文（18行）</summary>

```text
// Why three-way: plain rsync-style pull/push silently clobbers whichever side
// changed while the other side was edited. We keep a per-mirror snapshot of the
// last-synced remote state (`.dsh-remote-sync-state.json`: relPath →
// {mtime,size}) and compare remote (R), local (L) and last-synced (S):
//
//   R==S && L==S          → unchanged, skip
//   R!=S && L==S          → remote changed → pull it (or push when pushing)
//   R==S && L!=S          → local changed, remote untouched
//                            • pull (rw_sync): would clobber local edit → conflict
//                            • push (rw_push): normal upload
//   R!=S && L!=S && R==L  → both changed to the same bytes → skip
//   R!=S && L!=S && R!=L  → BOTH changed differently → conflict (never clobber)
//
// `force: true` downgrades every conflict to a plain overwrite (rsync behavior).
// `dryRun: true` computes the full plan without writing anything.
// After a successful pull the local mtime is aligned to the remote mtime, and
// after a successful push the local mtime is aligned to the remote mtime the
// server assigned — so the invariant L==R==S holds and the next run is cheap.
```

</details>

**依据 6 · 源码核查**：[lib/sync.js:38-41](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/sync.js#L38-L41)

比较键为size和mtime而非内容哈希。

```text

const keyOf = (size, mtime) => `${size}:${Math.floor(mtime || 0)}`
const localKey = (st) => (st ? keyOf(st.size, st.mtimeMs / 1000) : null)
const remoteKey = (st) => (st ? keyOf(st.size, st.mtime) : null)
```

**依据 7 · 源码核查**：[lib/sync.js:173-210](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/sync.js#L173-L210)

具体冲突与写入分支，不可写catch跳过。

<details>
<summary>查看原文（38行）</summary>

```text
      let l
      try { l = statSync(lp) } catch { return }
      if (maxFileBytes > 0 && l.size > maxFileBytes) { stats.skippedLarge++; return }
      const lk = localKey(l)
      let r = null
      try { r = await sftp.stat(rp) } catch { /* absent → upload */ }
      const rk = remoteKey(r)
      const sk = state[rel] ? keyOf(state[rel].size, state[rel].mtime) : null
      if (r && sk && lk === sk && rk === sk) { stats.skippedUnchanged++; return }
      if (r && !force && sk && rk !== sk && lk !== sk && rk !== lk) {
        stats.conflicts.push({ path: rp, reason: 'both-modified（远端与本地都改过，跳过不覆盖）' })
        return
      }
      if (r && !force && sk && rk !== sk && lk === sk) {
        stats.conflicts.push({ path: rp, reason: 'remote-modified（远端改过而本地未变；如需覆盖请用 force / 先 rw_sync）' })
        return
      }
      if (r && !force && sk && rk === sk && lk && lk !== sk) {
        // Normal case: local edited since sync, remote untouched → push.
      }
      if (dryRun) {
        stats.files++
        stats.pushed.push(rp)
        return
      }
      try {
        const buf = readFileSync(lp)
        await sftp.writeFile(rp, buf)
        // Align local mtime to whatever the remote server assigned, so the
        // L==R==S invariant holds for the next run.
        let r2 = null
        try { r2 = await sftp.stat(rp) } catch {}
        const rmt = r2 ? r2.mtime : Math.floor(Date.now() / 1000)
        try { utimesSync(lp, new Date(rmt * 1000), new Date(rmt * 1000)) } catch {}
        stats.files++
        stats.pushed.push(rp)
        nextState[rel] = { size: l.size, mtime: rmt }
      } catch { /* skip unwritable */ }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · remote sandbox与异步执行到底限制什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

remote sandbox是工具边界词法护栏。read-only拒绝写、命令和隧道，workspace-write仅约束文件工具路径而允许任意命令/隧道；源码明确符号链接、TOCTOU和远端shell权限不在该护栏内。要隔离不可信任务必须在远端用低权限账户、ACL或容器，不可把本地会话sandbox名称直接当远端内核隔离。

模式解析还有重要默认：有可用sandboxPolicy.resolve结果时采用它，否则fallback读取配置；默认inherit不在三模式枚举里，最终变danger-full-access。resolve抛错也进入这个fallback，尽管附近注释说失败只读，实际实现并非无条件fail-closed。remoteSandbox=off也跳过检查。因此采用前必须核对有效模式，而不是只看配置字面inherit。

命令取消已向传输转发AbortSignal，后台job不只是丢弃等待；但pool对abort/timeout尝试stream.signal(SIGTERM)，忽略异常，立即settle并稍后关通道。formatter在ABORTED时写“remote command was stopped”，这个文本强于本次源码能保证的结果：发信号或关SSH通道不能证明远端子进程树/副作用已停止。取消后须远端核对，不应立刻重跑写任务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/remote-sandbox.js:19-27](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/remote-sandbox.js#L19-L27)

源码自己明确containment非安全边界。

```text
// Threat model (stated plainly, matching the official dsh-fs-sandbox header):
// this is CONTAINMENT, not a security boundary. Paths are compared lexically, so
// symlinks and TOCTOU races inside the remote host can escape; a remote command
// can `cd` anywhere once bash runs with the user's own privileges. What it does
// buy, and what the issue asked for: a confined session can no longer mutate a
// remote tree outside its workspace BY ACCIDENT through the file tools, and
// `rw_exec` refuses outright under read-only instead of silently running
// anything. Deployments needing a hard boundary must confine on the REMOTE side
// (containers, per-user accounts, filesystem ACLs).
```

**依据 2 · 源码核查**：[lib/remote-sandbox.js:102-146](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/remote-sandbox.js#L102-L146)

read-only与workspace-write实际判定。

<details>
<summary>查看原文（45行）</summary>

```text
export function checkRemoteSandbox({ mode, operation, path: target, workspaceRoot }) {
  const m = REMOTE_SANDBOX_MODES.includes(mode) ? mode : 'read-only'
  // Fail closed on an unknown mode, exactly like the official renderPolicyContext.
  const effective = m

  if (operation === 'read' || operation === 'connect') return { allowed: true, mode: effective }

  if (effective === 'danger-full-access') return { allowed: true, mode: effective }

  if (effective === 'read-only') {
    // read-only refuses every state-changing remote operation. This is the
    // strict reading of the official mode ("`read-only` permits only required
    // sinks such as /dev/null") and the one that keeps a confined session
    // honest on a machine whose filesystem it cannot police.
    return {
      allowed: false,
      mode: effective,
      subject: operation === 'exec' ? 'command' : operation === 'tunnel' ? 'tunnel' : 'operation',
      reason:
        operation === 'exec'
          ? 'read-only sessions may not run commands on a remote host'
          : operation === 'tunnel'
            ? 'read-only sessions may not open remote port forwards'
            : 'read-only sessions may not modify a remote host',
    }
  }

  // workspace-write: writes must stay inside the workspace; exec and tunnel are
  // allowed because a command's effects cannot be bounded lexically (and the
  // official bash tool under workspace-write DOES run commands, confining them
  // via the OS). Refusing exec here would make workspace-write useless for the
  // primary remote use case (builds, tests), while pretending to confine it
  // would be worse than saying we do not.
  if (operation === 'exec' || operation === 'tunnel') return { allowed: true, mode: effective }

  // A write with no resolvable workspace root cannot be proven inside it.
  if (!workspaceRoot) {
    return {
      allowed: false,
      mode: effective,
      subject: 'operation',
      reason: 'workspace-write needs a remote workspace root to fence writes; none is set',
    }
  }
  if (isInsideRemote(target, workspaceRoot)) return { allowed: true, mode: effective }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1643-1677](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/index.js#L1643-L1677)

默认inherit/resolve失败fallback和工具guard。

<details>
<summary>查看原文（35行）</summary>

```text
  const sandboxModeFor = (exec) => {
    if (!remoteSandboxEnabled()) return 'danger-full-access'
    try {
      const svc = ctx.get('sandboxPolicy')
      if (svc && typeof svc.resolve === 'function') {
        const session = exec && exec.agent ? exec.agent.session : undefined
        const resolved = svc.resolve(session ? { session } : {})
        if (resolved && REMOTE_SANDBOX_MODES.includes(resolved.mode)) return resolved.mode
      }
    } catch { /* fall through to the configured default */ }
    const fallback = String(config.remoteSandbox || 'inherit')
    return REMOTE_SANDBOX_MODES.includes(fallback) ? fallback : 'danger-full-access'
  }

  /**
   * Assert that one remote operation is permitted, throwing the official denial
   * shape when it is not.
   *
   * @param {object} exec - the tool run context.
   * @param {'read'|'write'|'exec'|'tunnel'|'connect'} operation
   * @param {object} [opts]
   * @param {string} [opts.path] - the remote path a `write` targets.
   * @param {string} [opts.tool] - tool name for the message.
   */
  const requireRemoteSandbox = (exec, operation, opts = {}) => {
    if (!remoteSandboxEnabled()) return
    const mode = sandboxModeFor(exec)
    if (mode === 'danger-full-access') return
    const b = (() => { try { return bindingFor(exec) } catch { return null } })()
    const workspaceRoot = (b && b.ws) || ''
    const verdict = checkRemoteSandbox({ mode, operation, path: opts.path, workspaceRoot })
    if (verdict.allowed) return
    const err = remoteSandboxDenial(verdict)
    if (opts.tool) err.message = `${opts.tool}: ${err.message}`
    throw err
```

</details>

**依据 4 · 源码核查**：[lib/exec-job.js:102-147](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/exec-job.js#L102-L147)

job的AbortSignal实际传给pool。

<details>
<summary>查看原文（46行）</summary>

```text
export function startExecJob(registry, { pool, command, label, owner, jobDeadlineMs, pty, env }) {
  let abort = null
  let cancelled = null
  const id = registry.start({
    kind: 'rw-exec',
    label: String(label || command || 'rw_exec'),
    ...(owner ? { owner } : {}),
    run: (job) => {
      const ac = new AbortController()
      abort = ac
      const done = (async () => {
        let res
        try {
          res = await pool.exec(command, {
            // 0/undefined ⇒ no transport deadline: the job outlives the call.
            ...(jobDeadlineMs ? { timeoutMs: jobDeadlineMs } : {}),
            pty: !!pty,
            env,
            signal: ac.signal,
            // Stream into the ring: a background job's value is its output, and
            // the model reads it later through job_output, not from a return
            // value it already lost.
            onData: (channel, chunk) => {
              const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk)
              if (!text) return
              try { job.append(text, { channel }) } catch { /* settled: ring closed */ }
            },
          })
        } catch (err) {
          return { status: 'failed', detail: String((err && err.message) || err) }
        }
        if (res.signal === 'ABORTED' || cancelled) return { status: 'killed', detail: cancelled || 'cancelled' }
        if (res.signal === 'TIMEOUT') return { status: 'killed', detail: `timed out after ${jobDeadlineMs}ms` }
        const code = res.code
        return {
          status: code === 0 ? 'completed' : 'failed',
          detail: code === 0 ? 'exit code: 0' : `exit code: ${code}`,
        }
      })()
      return {
        done,
        // Synchronous, idempotent, and it reaches the remote process: the
        // transport turns this abort into `stream.signal('SIGTERM')`.
        cancel: (reason) => {
          if (cancelled === null) cancelled = String(reason || 'cancelled')
          try { ac.abort() } catch { /* already aborted */ }
```

</details>

**依据 5 · 源码核查**：[lib/pool.js:615-648](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/pool.js#L615-L648)

发SIGTERM忽略错误并settle，不能证明远端停止。

<details>
<summary>查看原文（34行）</summary>

```text
              const timer = setTimeout(() => {
                if (settled) return
                exitCode = -1
                exitSignal = 'TIMEOUT'
                // Kill the remote command (SIGTERM) rather than just dropping the
                // channel, so a runaway process cannot keep running and holding
                // the SSH connection after we've given up on its output.
                try {
                  if (typeof stream.signal === 'function') stream.signal('SIGTERM')
                } catch {}
                const hardClose = setTimeout(() => {
                  try { stream.close() } catch {}
                }, 800)
                if (typeof hardClose.unref === 'function') hardClose.unref()
                settle()
              }, timeoutMs)
              if (signal) {
                if (signal.aborted) {
                  try { if (typeof stream.signal === 'function') stream.signal('SIGTERM') } catch {}
                  try { stream.close() } catch {}
                  exitCode = -1
                  exitSignal = 'ABORTED'
                  return settle()
                }
                onAbort = () => {
                  if (settled) return
                  exitCode = -1
                  exitSignal = 'ABORTED'
                  try { if (typeof stream.signal === 'function') stream.signal('SIGTERM') } catch {}
                  const hardClose = setTimeout(() => { try { stream.close() } catch {} }, 500)
                  if (typeof hardClose.unref === 'function') hardClose.unref()
                  settle()
                }
                signal.addEventListener('abort', onAbort, { once: true })
```

</details>

**依据 6 · 源码核查**：[lib/exec-job.js:61-70](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/exec-job.js#L61-L70)

取消文案强于可证结果，需收窄解读。

<details>
<summary>查看原文（10行）</summary>

```text
export function formatExecResult(res, { timeoutMs, cancelled = false } = {}) {
  const parts = []
  if (res.stdout) parts.push(String(res.stdout).replace(/\s+$/, ''))
  if (res.stderr) parts.push('-- stderr --\n' + String(res.stderr).replace(/\s+$/, ''))
  if (!parts.length) parts.push('(no output)')
  let text = parts.join('\n')
  if (res.signal === 'TIMEOUT') text += `\n[command timed out after ${timeoutMs}ms]`
  else if (cancelled || res.signal === 'ABORTED') text += '\n[cancelled — the remote command was stopped]'
  else if (res.code !== 0) text += `\n[exit code: ${res.code}]`
  return text
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 多层资源与恢复成本支持怎样的采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前观察，适合已有SSH运维能力的开发者先审有效权限，再在远端低权限测试账户和可丢弃目录核对。准备主机身份、密钥、hostkey策略、正确会话镜像和备份；先只读，再dryRun同步，并分别看conflicts、truncated、跳过与远端实际结果。需要远端DSH网页时另备远端DSH/Node，本插件不再代装；普通远程工具不应与网页挂载混为一个启动条件。

首次有SSH和镜像配置及备份，持续有远端计算/存储、网络传输、本地副本与模型成本；失败后需比对两端、查晚到命令和恢复凭据/配置。金额和时间未知，不能从主动连出或无开放端口推出部署无风险，也不能从三路冲突检查推零数据损失。

有效权限无法确认、sync结果不完整、会话目标不符或取消后远端状态未知时应停止写/重跑，改用独立SSH只读核对并从副本恢复。当前没有真实SSH、取消、Windows路径或同步冲突实验，不能给持续安装承诺。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:93-103](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/README.md#L93-L103)

保存不等激活、选镜像与会话remote context。

<details>
<summary>查看原文（11行）</summary>

```text
## 快速上手

1. **连接一台机器** —— 设置 → 远程工作区：页面**直接列出 `~/.ssh/config` 里的主机**（像 VSCode Remote-SSH），点「连接」即可（= 采用 + 设为当前 + 实测延迟，结果显示在这一行上）。
   要加一台配置里没有的机器，点「打开配置文件」写一个 Host 段，再点「刷新」。已保存的机器仍可「编辑」（密码、OpenSSH 后端、远端 dsh 命令这些 ssh 配置存不下的项）。
   > **保存 ≠ 激活**：保存只是备用连接；只有「连接」（或 Agent 调 `rw_connect`）才进入会话的 remote context。
2. **选工作区** —— 连上之后会自动弹出目录选择（也可以点机器行的「选目录」）：
   - **远程** → 浏览到远程目录（或输入 `/path`）→ 「设为远程工作区」⇒ 创建并收养本地镜像工作区。
   - **本机** → 系统文件夹选择（或手输路径）→ 本地工作区。宿主没有可用系统对话框时改用插件内置浏览器。
3. **让 Agent 工作** —— 当作普通工作区使用，例如 `rw_read_file` / `rw_write_file` / `rw_edit` / `rw_exec` / `rw_search` / `rw_sync` / `rw_push` / `rw_forward`（完整列表见上文）。

> **Remote context 是 session 级的**：只有当前 session 的工作区是某个远程镜像时，system prompt 才注入「Remote workspace」段落；普通本地 session 不受影响，模型也不会主动调 `rw_*`。
```

</details>

**依据 2 · 作者声明**：[README.md:119-143](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/README.md#L119-L143)

网页隧道/远端进程和DSH环境另有条件。

<details>
<summary>查看原文（25行）</summary>

```text
- 「断开」只关隧道，**不会**杀掉远端进程（它可能是你在别处也在用的实例）；
  要连远端进程一起停，用「断开并停止远端」——它只会结束**本次由插件启动**的那个进程。
- 若远端已经在跑一个界面（比如你自己在终端里起的），可以选机器后把它的
  `http://127.0.0.1:<端口>/?token=…` 粘进输入框，点「连接已有实例」，插件不会再去启第二个。
- 远端 `dsh` 不在 SSH 登录 PATH 时，用 `webAttachCommand` 指向它的绝对路径；
  想让它别污染远端用户自己的会话/设置，用 `webAttachDshHome` 指一个临时目录。
  **按机器设**：设置 → 远程工作区 → 机器卡片 → 展开「高级」→「远端 dsh 命令」，
  填绝对路径即可（例如
  `/home/you/.nvm/versions/node/v22.19.0/bin/node /home/you/.dsh-remote/dsh/node_modules/@deepseek-ai/dsh/lib/bin.js`）；
  留空则用全局的 `webAttachCommand`。
- 隧道跟着 SSH 连接走：连接断了界面会显示「连接已断开」，**不会**影响本机 DSH 进程；
  池自动重连后插件会重新解析远端端口（必要时重启它自己启动的那个远端进程），界面点「重连」即可继续用。
- 远端 node 需要 **≥ 20.12**（dsh 启动要用 `node:util` 的 `parseEnv`，该导出从 20.12 起才有）。
  更旧的 node 上 npm 只会给 EBADENGINE 警告、照样把包装完，直到启动才崩在
  `does not provide an export named 'parseEnv'`，所以装之前先确认版本。

### 连不上？远端的 dsh 需要你自己装好

**连不上大多不是插件的问题，而是远端 dsh 的版本或环境不对。** 最典型的一种：dsh 0.1.0-rc.6
依赖 `node-pty@1.1.0`，而**那个版本发布的包里没有 `linux-x64` 预编译产物** ⇒ `dsh web`
在 Linux 上根本起不来。这种情况以前只能看到「没拿到启动令牌」，无从判断。

远端如果没有可用的 `dsh`，需要你自己先装好（插件不再代装）：把 `webAttachCommand`
指向它的绝对路径即可（设置 → 远程工作区 → 机器行「编辑」→ 高级配置 → 远端 dsh 命令，
或全局 `webAttachCommand`）。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1643-1655](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/index.js#L1643-L1655)

有效权限需核对。

<details>
<summary>查看原文（13行）</summary>

```text
  const sandboxModeFor = (exec) => {
    if (!remoteSandboxEnabled()) return 'danger-full-access'
    try {
      const svc = ctx.get('sandboxPolicy')
      if (svc && typeof svc.resolve === 'function') {
        const session = exec && exec.agent ? exec.agent.session : undefined
        const resolved = svc.resolve(session ? { session } : {})
        if (resolved && REMOTE_SANDBOX_MODES.includes(resolved.mode)) return resolved.mode
      }
    } catch { /* fall through to the configured default */ }
    const fallback = String(config.remoteSandbox || 'inherit')
    return REMOTE_SANDBOX_MODES.includes(fallback) ? fallback : 'danger-full-access'
  }
```

</details>

**依据 4 · 源码核查**：[lib/sync.js:173-210](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/sync.js#L173-L210)

冲突/skip/force影响回读和恢复成本。

<details>
<summary>查看原文（38行）</summary>

```text
      let l
      try { l = statSync(lp) } catch { return }
      if (maxFileBytes > 0 && l.size > maxFileBytes) { stats.skippedLarge++; return }
      const lk = localKey(l)
      let r = null
      try { r = await sftp.stat(rp) } catch { /* absent → upload */ }
      const rk = remoteKey(r)
      const sk = state[rel] ? keyOf(state[rel].size, state[rel].mtime) : null
      if (r && sk && lk === sk && rk === sk) { stats.skippedUnchanged++; return }
      if (r && !force && sk && rk !== sk && lk !== sk && rk !== lk) {
        stats.conflicts.push({ path: rp, reason: 'both-modified（远端与本地都改过，跳过不覆盖）' })
        return
      }
      if (r && !force && sk && rk !== sk && lk === sk) {
        stats.conflicts.push({ path: rp, reason: 'remote-modified（远端改过而本地未变；如需覆盖请用 force / 先 rw_sync）' })
        return
      }
      if (r && !force && sk && rk === sk && lk && lk !== sk) {
        // Normal case: local edited since sync, remote untouched → push.
      }
      if (dryRun) {
        stats.files++
        stats.pushed.push(rp)
        return
      }
      try {
        const buf = readFileSync(lp)
        await sftp.writeFile(rp, buf)
        // Align local mtime to whatever the remote server assigned, so the
        // L==R==S invariant holds for the next run.
        let r2 = null
        try { r2 = await sftp.stat(rp) } catch {}
        const rmt = r2 ? r2.mtime : Math.floor(Date.now() / 1000)
        try { utimesSync(lp, new Date(rmt * 1000), new Date(rmt * 1000)) } catch {}
        stats.files++
        stats.pushed.push(rp)
        nextState[rel] = { size: l.size, mtime: rmt }
      } catch { /* skip unwritable */ }
```

</details>

**依据 5 · 源码核查**：[lib/pool.js:615-648](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/pool.js#L615-L648)

取消后状态仍需独立确认。

<details>
<summary>查看原文（34行）</summary>

```text
              const timer = setTimeout(() => {
                if (settled) return
                exitCode = -1
                exitSignal = 'TIMEOUT'
                // Kill the remote command (SIGTERM) rather than just dropping the
                // channel, so a runaway process cannot keep running and holding
                // the SSH connection after we've given up on its output.
                try {
                  if (typeof stream.signal === 'function') stream.signal('SIGTERM')
                } catch {}
                const hardClose = setTimeout(() => {
                  try { stream.close() } catch {}
                }, 800)
                if (typeof hardClose.unref === 'function') hardClose.unref()
                settle()
              }, timeoutMs)
              if (signal) {
                if (signal.aborted) {
                  try { if (typeof stream.signal === 'function') stream.signal('SIGTERM') } catch {}
                  try { stream.close() } catch {}
                  exitCode = -1
                  exitSignal = 'ABORTED'
                  return settle()
                }
                onAbort = () => {
                  if (settled) return
                  exitCode = -1
                  exitSignal = 'ABORTED'
                  try { if (typeof stream.signal === 'function') stream.signal('SIGTERM') } catch {}
                  const hardClose = setTimeout(() => { try { stream.close() } catch {} }, 500)
                  if (typeof hardClose.unref === 'function') hardClose.unref()
                  settle()
                }
                signal.addEventListener('abort', onAbort, { once: true })
```

</details>

#### 缺口

- 未做真实SSH/跨平台/冲突/取消副作用与总成本实验
  **影响**：不能认定端到端可用、无损或低负担
  **进一步探讨**：在低权限副本记录两端哈希、命令进程状态、冲突与恢复投入，再决定是否启写。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证镜像一致性与远端结果的增量假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是在现有size/mtime三路状态之外，对高价值变更加入选择性内容哈希或变更回读，并把取消请求与远端停止确认区分，可减少“元数据未变/已取消”带来的错误完成判断。不是项目没有冲突检查或后台job：这些已存在，增量只针对快速键漏判与停止语义。

在隔离两端制造同size/mtime不同内容、同步中断、远端忽略SIGTERM或派生子进程，比较现有状态与附加回读的漏判、恢复时间、网络/CPU和人工复核。先排除其他已有模块是否已做等价校验。若哈希开销超过规避损失、仍误判停止、或已有记录等价，则否定；不把实验用故障带到生产主机。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sync.js:38-41](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/sync.js#L38-L41)

快速比较键的推导依据。

```text

const keyOf = (size, mtime) => `${size}:${Math.floor(mtime || 0)}`
const localKey = (st) => (st ? keyOf(st.size, st.mtimeMs / 1000) : null)
const remoteKey = (st) => (st ? keyOf(st.size, st.mtime) : null)
```

**依据 2 · 源码核查**：[lib/sync.js:173-210](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/sync.js#L173-L210)

已有三路冲突是反证，不能宣称缺失。

<details>
<summary>查看原文（38行）</summary>

```text
      let l
      try { l = statSync(lp) } catch { return }
      if (maxFileBytes > 0 && l.size > maxFileBytes) { stats.skippedLarge++; return }
      const lk = localKey(l)
      let r = null
      try { r = await sftp.stat(rp) } catch { /* absent → upload */ }
      const rk = remoteKey(r)
      const sk = state[rel] ? keyOf(state[rel].size, state[rel].mtime) : null
      if (r && sk && lk === sk && rk === sk) { stats.skippedUnchanged++; return }
      if (r && !force && sk && rk !== sk && lk !== sk && rk !== lk) {
        stats.conflicts.push({ path: rp, reason: 'both-modified（远端与本地都改过，跳过不覆盖）' })
        return
      }
      if (r && !force && sk && rk !== sk && lk === sk) {
        stats.conflicts.push({ path: rp, reason: 'remote-modified（远端改过而本地未变；如需覆盖请用 force / 先 rw_sync）' })
        return
      }
      if (r && !force && sk && rk === sk && lk && lk !== sk) {
        // Normal case: local edited since sync, remote untouched → push.
      }
      if (dryRun) {
        stats.files++
        stats.pushed.push(rp)
        return
      }
      try {
        const buf = readFileSync(lp)
        await sftp.writeFile(rp, buf)
        // Align local mtime to whatever the remote server assigned, so the
        // L==R==S invariant holds for the next run.
        let r2 = null
        try { r2 = await sftp.stat(rp) } catch {}
        const rmt = r2 ? r2.mtime : Math.floor(Date.now() / 1000)
        try { utimesSync(lp, new Date(rmt * 1000), new Date(rmt * 1000)) } catch {}
        stats.files++
        stats.pushed.push(rp)
        nextState[rel] = { size: l.size, mtime: rmt }
      } catch { /* skip unwritable */ }
```

</details>

**依据 3 · 源码核查**：[lib/pool.js:615-648](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/pool.js#L615-L648)

取消仅信号/关通道，推导回读价值。

<details>
<summary>查看原文（34行）</summary>

```text
              const timer = setTimeout(() => {
                if (settled) return
                exitCode = -1
                exitSignal = 'TIMEOUT'
                // Kill the remote command (SIGTERM) rather than just dropping the
                // channel, so a runaway process cannot keep running and holding
                // the SSH connection after we've given up on its output.
                try {
                  if (typeof stream.signal === 'function') stream.signal('SIGTERM')
                } catch {}
                const hardClose = setTimeout(() => {
                  try { stream.close() } catch {}
                }, 800)
                if (typeof hardClose.unref === 'function') hardClose.unref()
                settle()
              }, timeoutMs)
              if (signal) {
                if (signal.aborted) {
                  try { if (typeof stream.signal === 'function') stream.signal('SIGTERM') } catch {}
                  try { stream.close() } catch {}
                  exitCode = -1
                  exitSignal = 'ABORTED'
                  return settle()
                }
                onAbort = () => {
                  if (settled) return
                  exitCode = -1
                  exitSignal = 'ABORTED'
                  try { if (typeof stream.signal === 'function') stream.signal('SIGTERM') } catch {}
                  const hardClose = setTimeout(() => { try { stream.close() } catch {} }, 500)
                  if (typeof hardClose.unref === 'function') hardClose.unref()
                  settle()
                }
                signal.addEventListener('abort', onAbort, { once: true })
```

</details>

**依据 4 · 源码核查**：[lib/exec-job.js:102-147](https://github.com/flymysql/dsh-remote/blob/bdee1f7b4be5d921f995d99bbab5e845cdad8bf7/lib/exec-job.js#L102-L147)

已有job生命周期和取消接线，限定新增范围。

<details>
<summary>查看原文（46行）</summary>

```text
export function startExecJob(registry, { pool, command, label, owner, jobDeadlineMs, pty, env }) {
  let abort = null
  let cancelled = null
  const id = registry.start({
    kind: 'rw-exec',
    label: String(label || command || 'rw_exec'),
    ...(owner ? { owner } : {}),
    run: (job) => {
      const ac = new AbortController()
      abort = ac
      const done = (async () => {
        let res
        try {
          res = await pool.exec(command, {
            // 0/undefined ⇒ no transport deadline: the job outlives the call.
            ...(jobDeadlineMs ? { timeoutMs: jobDeadlineMs } : {}),
            pty: !!pty,
            env,
            signal: ac.signal,
            // Stream into the ring: a background job's value is its output, and
            // the model reads it later through job_output, not from a return
            // value it already lost.
            onData: (channel, chunk) => {
              const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk)
              if (!text) return
              try { job.append(text, { channel }) } catch { /* settled: ring closed */ }
            },
          })
        } catch (err) {
          return { status: 'failed', detail: String((err && err.message) || err) }
        }
        if (res.signal === 'ABORTED' || cancelled) return { status: 'killed', detail: cancelled || 'cancelled' }
        if (res.signal === 'TIMEOUT') return { status: 'killed', detail: `timed out after ${jobDeadlineMs}ms` }
        const code = res.code
        return {
          status: code === 0 ? 'completed' : 'failed',
          detail: code === 0 ? 'exit code: 0' : `exit code: ${code}`,
        }
      })()
      return {
        done,
        // Synchronous, idempotent, and it reaches the remote process: the
        // transport turns this abort into `stream.signal('SIGTERM')`.
        cancel: (reason) => {
          if (cancelled === null) cancelled = String(reason || 'cancelled')
          try { ac.abort() } catch { /* already aborted */ }
```

</details>

#### 缺口

- 未排完其他模块等价校验，也无哈希/停止回读的同条件结果
  **影响**：不能认定方案净收益或现有实际数据损失
  **进一步探讨**：先查现有记录，再比较漏判与全资源/人工开销，无净收益则保持现状。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
