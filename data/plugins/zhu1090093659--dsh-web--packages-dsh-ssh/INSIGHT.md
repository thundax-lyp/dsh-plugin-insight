# dsh-ssh

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh)

<!-- BEGIN META -->
[![GitHub ★ 10,117](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C117&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 102,561](https://img.shields.io/static/v1?label=npm+30d&message=102%2C561&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh)
<!-- END META -->

> **功能**：在 DSH 中共享 SSH 主机配置与连接，提供终端、命令、文件传输、隧道和集群工具。

> **亮点**：[Q02](#research-q02)和[Q04](#research-q04)确认GUI与六工具共享真实引擎、按alias共享acquire、inFlight避免扫活动连接、可detach/attach的Host PTY以及共享tunnel最后释放，形成可解释组合；SSH协议/认证/OS权限继承ssh2与部署，不以功能数量或测试文件证明运维效果。

> **主要限制**：[Q03](#research-q03) 本机门/alias不等于身份pin和每次批准，明文配置和本机路径处于Host权限；[Q02](#research-q02)断线可能重放且关闭channel不撤副作用；[Q04](#research-q04)发送close即true使删tab不是远端停止验收，停用/删host也不能直接推所有资源撤销。

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
  - [Q01 · DSH 内 SSH 为谁提供什么增量，固定版本条件是什么？](#detail-section-11)
  - [Q02 · 命令如何实际执行，取消、重试和输出证明什么？](#detail-section-12)
  - [Q03 · 本地准入、凭据和主机身份构成什么信任边界？](#detail-section-13)
  - [Q04 · 文件、终端、隧道与集群的结果和关闭可信吗？](#detail-section-14)
  - [Q05 · 试用、持续、失败和退出需要什么责任与成本？](#detail-section-15)
  - [Q06 · 已有贡献与目标身份/作业对账候选如何区分？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 熟悉SSH的用户在DSH内人工核目标、只读排障与受控传输；成功是预期身份和远端状态，不是connected或发送完成。

[Q01](#research-q01) OpenSSH/known_hosts、SFTP、ssh -L与并发脚本已有任务能力；本项给DSH共享别名/连接与持久PTY接缝，未证明节时或更安全。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 实际接线 | 使用边界 |
|---|---|---|
| 主机配置 | GUI CRUD/导入，工具只读摘要 | 明文密码口令；alias非身份pin |
| 命令 | client.exec，stdout/stderr/exit | 断线可重放；取消不回滚 |
| 终端 | 独立PTY与Host session attach | detach保留；send关闭非完成ACK |
| 文件 | fastPut/Get及GUI staging | Host任意本机路径权限，失败可部分文件 |
| 隧道/集群 | loopback listener/forwardOut；selector并发 | forwarding非服务成功，逐host非事务 |

**流程与依赖**

| 依赖或条件 | 具体要求 | 缺失/边界 |
|---|---|---|
| 本插件 | @linxin666/dsh-ssh 0.4.15，Apache-2.0 | 安装产物未验 |
| Node/Host | Node>=24.9.0，DSH>=0.2.2-rc.1 | 正确profile/client，不能沿用旧版本声明 |
| 运行库 | ssh2^1.17.0、ws^8.18.0、xterm^6.0.0，React/DOM^18.2.0 | 库契约/实际握手未验 |
| SSH服务器/网络 | 受限账号、可独立核公钥 | 插件层没hostVerifier/known_hosts |
| Host OS权限 | 本地文件/agent/proxy shell | 非bash沙箱，forwardAgent另明确信任 |
| 模型/工具权限 | 仅Agent工具需要 | GUI只读无需模型轮次，公告不等于审批 |

| 阶段 | 操作 | 核对与失败处理 |
|---|---|---|
| 首次 | 固定版本/profile，独立home/测试机临时key | 禁forwardAgent/代理/批量，核公钥 |
| 只读试用 | 人工审命令、唯一alias | 独立SSH核真实目标/输出 |
| 传输/批量 | 有授权后再核路径/selector | 部分文件/逐host结果，失败不自动重放写 |
| 中断 | 保留结果未知并读回 | 不将timeout/close当撤销 |
| 退出 | 停tunnel/terminal并核远端 | 开关撤面非全部连接清零，清临时/备份/凭据 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | 测试机/网络/存储价格未知 | 身份/版本/权限配置分钟未知 |
| 持续 | 远端CPU/带宽/磁盘、连接/缓冲，可选模型费未知 | 核目标/输出及密钥管理未知 |
| 失败恢复 | 重放/部分文件/连接残留资源未知 | 独立对账/恢复分钟未知，无续传承诺 |
| 退出 | 已耗远端/模型资源不可假定退款 | 核进程/端口/文件/配置备份，未测 |

| 目标 | 当前支持 | 未证结果 |
|---|---|---|
| DSH集成 | 共用engine/配置和工具 | 相对OpenSSH净节时 |
| 控制取消 | channel KILL/close及局部cancel结果 | 远端停止/撤销与绝不重放 |
| 文件传输 | 实际SFTP和finally清channel | 原子文件、hash正确、断点恢复 |
| 终端关闭 | 明确close帧/失败保留tab | send成功非Host/远端完成ACK |
| 多机/隧道 | selector/并发/loopback | 服务可用/批量原子与生产隔离 |

> **思考**：[Q03](#research-q03) 本机门/alias不等于身份pin和每次批准，明文配置和本机路径处于Host权限；[Q02](#research-q02)断线可能重放且关闭channel不撤副作用；[Q04](#research-q04)发送close即true使删tab不是远端停止验收，停用/删host也不能直接推所有资源撤销。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)和[Q04](#research-q04)确认GUI与六工具共享真实引擎、按alias共享acquire、inFlight避免扫活动连接、可detach/attach的Host PTY以及共享tunnel最后释放，形成可解释组合；SSH协议/认证/OS权限继承ssh2与部署，不以功能数量或测试文件证明运维效果。

[Q02](#research-q02)共享acquire/inFlight与有条件重试；[Q04](#research-q04)SFTP finally、Host PTY重附着、共享tunnel生命周期有局部价值。pool signal接线、关闭发送与回执、不同资源撤销边界必须分别核；不以测试规模等同安全验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 本机门/alias不等于身份pin和每次批准，明文配置和本机路径处于Host权限；[Q02](#research-q02)断线可能重放且关闭channel不撤副作用；[Q04](#research-q04)发送close即true使删tab不是远端停止验收，停用/删host也不能直接推所有资源撤销。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 固定Host/Node与独立home，临时低权限key先人工只读并独立核公钥；停用forwardAgent/ProxyCommand及批量/模型入口直到另有明确授权。断线/关闭未知先对账，退出逐项核进程、端口和文件，不依赖删tab或删host。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持DSH SSH集成与关键副作用链；仅建议熟悉SSH者在低权限隔离机人工审核只读试用，不能作为身份pin、沙箱或关闭完成保证；未运行目标/账号/远端。

- 已检查：作者 README、包清单、源码路径 packages/dsh-ssh/README.md、packages/dsh-ssh/package.json、packages/dsh-ssh/src/client/api.ts、packages/dsh-ssh/src/client/index.ts、packages/dsh-ssh/src/client/panel/TerminalTab.tsx、packages/dsh-ssh/src/client/panel/controller.ts、packages/dsh-ssh/src/client/telemetry.ts、packages/dsh-ssh/src/engine.ts、packages/dsh-ssh/src/engine/cluster.ts、packages/dsh-ssh/src/engine/connection-pool.ts、packages/dsh-ssh/src/engine/proxy-command.ts、packages/dsh-ssh/src/engine/pty.ts、packages/dsh-ssh/src/engine/sftp.ts、packages/dsh-ssh/src/engine/terminal-sessions.ts、packages/dsh-ssh/src/engine/tunnel.ts、packages/dsh-ssh/src/index.ts、packages/dsh-ssh/src/loopback.ts、packages/dsh-ssh/src/routes.ts、packages/dsh-ssh/src/store.ts、packages/dsh-ssh/src/tools.ts 及固定范围 inventory；组件：packages/dsh-ssh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整复核前稿六题/12findings；当前子包版本、Host/client挂载、GUI/工具命令执行、loopback/配置/凭据/多跳与代理关键路径、SFTP本机/远端副作用、PTY attach/关闭回执、tunnel/cluster及心跳。未全审ssh_config解析、全部UI/所有平台/Host或ssh2内部与服务端心跳。
- 下一步：仅固定源码静态阅读与自有研究装配/校验，未安装/运行目标及测试、握手、模型、远端命令或真实资料。缺真实需求、身份/关闭契约与效果费用对照，未来限隔离机另授权核。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.15（[固定提交 1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)冻结公钥/配置版本/批准/可查询作业ID，断线和取消后先unknown对账，并把发送与Host处理回执分开；对照known_hosts+日志及最小修补，在可丢弃机核误目标/重复写/恢复分钟，等价可替代或确认成本更高就推翻。未实现未验。

仅固定源码静态阅读与自有研究装配/校验，未安装/运行目标及测试、握手、模型、远端命令或真实资料。缺真实需求、身份/关闭契约与效果费用对照，未来限隔离机另授权核。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 292 | — | — | 6017 |
| .ts | source | 29 | 6515 | 4523 | 1664 | — |
| .tsx | source | 8 | 1972 | 1570 | 305 | — |
| .ts | test | 23 | 5058 | 3901 | 645 | — |
| .tsx | test | 7 | 1881 | 1417 | 242 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 158](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=158&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 153](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=153&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核SSH真实执行与身份、取消、远端副作用和关闭回执边界，判断隔离采用及生产方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 内 SSH 为谁提供什么增量，固定版本条件是什么？

**研究主题**：场景与需求、依赖、兼容与流程、贡献与相对优势

#### 完整回答

本项是 @linxin666/dsh-ssh 0.4.15，Apache-2.0，Host 与 web 客户端插件；Node>=24.9.0、DSH>=0.2.2-rc.1，React/DOM^18.2.0，运行依赖ssh2^1.17.0/ws^8.18.0。它不是SSH服务器、DSH执行沙箱或受限文件适配器。目标是熟悉SSH、希望在DSH里管理测试机并人工核远端结果的用户；成功标准应是连到预期身份、命令/文件达到预期状态，而不是面板显示connected。

基线是OpenSSH配置/终端、SFTP客户端、ssh -L及脚本并发，成熟工具已能执行这些任务。实际增量是HostStore/SshEngine由GUI和六个Agent工具共同使用、池化连接、Host持有的可重新附着PTY、主机筛选集群；没有证据说明它比原方案更安全、省时或适合不懂服务器权限的人。

作者清单和实际apply接线一致：创建store/engine，挂HTTP与upgrade、ssh_list/exec/upload/download/tunnel/cluster；announceToAgent默认false，enabled默认true。README安装段称自动注入，但设置和运行实现以默认false且工具可见性限制为准；关闭公告不等于关闭工具。启用解析还有兼容旧用户例外：resolved enabled=false而profile未显式声明、store有记录时仍启用，不能把聚合profile继承false一概当停用成功。此次完整复核前稿六题和12findings，只读当前组件实际关键链。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/package.json:1-20](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/package.json#L1-L20)

包名版本/Node与Host/client入口。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "@linxin666/dsh-ssh",
  "description": "Remote SSH operations for the dsh web GUI: host config store (~/.dsh/dsh-ssh.json, import from ~/.ssh/config), a persistent ssh2 connection pool with jump-host support, exec / PTY web terminal / SFTP transfer / local port-forward tunnels / cluster execution, plus agent tools (ssh_list, ssh_exec, ssh_upload, ssh_download, ssh_tunnel, ssh_cluster). Hot-pluggable — mounted via ~/.dsh/cordis.patch.yml + a profile node_modules symlink, no dsh source changes.",
  "version": "0.4.15",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": ">=24.9.0"
  },
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/package.json:27-62](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/package.json#L27-L62)

DSH及React具体要求、ssh2/ws依赖。

<details>
<summary>查看原文（36行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json && tsdown",
    "bundle": "tsdown",
    "watch": "tsdown --watch",
    "typecheck": "tsgo --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.19.0",
    "@xterm/addon-fit": "^0.11.0",
    "@xterm/xterm": "^6.0.0",
    "ssh2": "^1.17.0",
    "ws": "^8.18.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/package.json:100-109](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/package.json#L100-L109)

Apache-2.0声明。

<details>
<summary>查看原文（10行）</summary>

```text
    "README.md",
    "icon.svg",
    "locale"
  ],
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/zhu1090093659/dsh-web.git"
  }
}
```

</details>

**依据 4 · 作者声明**：[packages/dsh-ssh/README.md:18-35](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/README.md#L18-L35)

作者列出SSH场景和GUI/工具共用能力。

<details>
<summary>查看原文（18行）</summary>

```text
A dedicated remote Linux server operations and cluster management plugin for DeepSeek Harness (DSH) Web GUI and official desktop client: in-process persistent connection pool, Web GUI host inventory management, xterm.js terminal, visual SFTP file transfer, port forwarding tunnels, and 6 dedicated agent tools implemented on top of official NPM SDKs without modifying DSH core source code.

## Capabilities

| Capability | Description |
| --- | --- |
| Host management | CRUD, search, connection test; collapsible grouping by environment / tags with per-group batch test; config stored in `~/.dsh/dsh-ssh.json`; supports key / password / ssh-agent auth (OpenSSH agent, with Pageant still selectable on Windows), passphrase keys, ProxyJump jump hosts (multi-level) and OpenSSH `ProxyCommand` transports (bastion clients) |
| Config import | One-click parse of a standard `~/.ssh/config` (Host/HostName/User/Port/IdentityFile/IdentityAgent/ForwardAgent/ProxyJump/ProxyCommand, `Include` files, blocks without HostName); `ForwardAgent yes|true|on` imports as enabled and `no|false|off` (or no directive) as disabled; skipped blocks are listed with their reason (wildcard pattern, existing alias, Match block, invalid fields) |
| Persistent connection pool | Reuses a long-lived connection per host (opposite of the ssh-skill daemon), automatically disconnects after 30 minutes idle, auto-reconnects on disconnect (up to 3 times) |
| Agent forwarding | Opt-in per host through the `forwardAgent` flag (`ssh -A`); the form has an "Enable agent forwarding" checkbox, the host list shows an agent-forwarding badge for enabled hosts, and `ssh_list` reports `forwardAgent` with a forward column in its table. The endpoint is the host's configured agent path, otherwise `SSH_AUTH_SOCK`, otherwise the native OpenSSH named pipe (`\\.\pipe\openssh-ssh-agent`) on Windows; a host with no local endpoint fails with an explicit error instead of connecting without forwarding. A server that refuses the request (`AllowAgentForwarding no`) surfaces its own error and is never downgraded to a silent non-forwarded session. The flag never touches the stored profile when it is off |
| Command execution | exec with a timeout (default 60s), stdout/stderr separated, output truncation guard (2MB) |
| Web terminal | xterm.js + WebSocket PTY terminal, auto-sizing, real-time output; the panel holds several terminal tabs, each with its own host PTY — switch, close one at a time, run several tabs against the same host, and the "+" control opens another tab on the host the toolbar shows |
| File transfer | SFTP upload (browser file picker, NDJSON progress stream), download (progress bar + browser save); remote directory browsing |
| Port forwarding | Local port-forward tunnel (listens on 127.0.0.1 only) to reach a remote database / intranet service; list / stop supported |
| Cluster execution | One command run concurrently across many hosts (filter by alias / environment / tag, default concurrency 8) |
| Agent tools | `ssh_list` / `ssh_exec` / `ssh_upload` / `ssh_download` / `ssh_tunnel` / `ssh_cluster`; GUI and Agent share the same host config |

The panel loads its contents on first open. Closing and reopening it preserves the selected tab, form drafts and every terminal tab. A terminal tab that is not on screen keeps its remote shell in the Host: the view detaches, and returning to the tab reattaches by session id and replays the host's scrollback into the single xterm. A remote shell that exits keeps its tab and its last screen instead of vanishing, and a tab closed in the background is only removed once the Host confirms the close — a close that cannot be delivered keeps the tab and says so. The tunnel list refreshes every five seconds while its tab, panel and browser page are visible; automatic reads pause when hidden, resume immediately on return, and do not overlap slow reads. Port forwarding itself continues in the Host.
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/index.ts:92-102](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/index.ts#L92-L102)

announce默认false、enabled默认true。

<details>
<summary>查看原文（11行）</summary>

```text
export const Config = z.object({
  announceToAgent: z.boolean().default(false).volatile(),
  enabled: z.boolean().default(true).volatile(),
  terminalFontFamily: z.string().default('').volatile(),
  connectTimeoutMs: z.number().step(1).min(1_000).max(600_000).default(DEFAULT_CONNECT_TIMEOUT_MS).volatile()
    .description('TCP connect, SSH key exchange and user authentication timeout in milliseconds; raise it for hosts whose authentication is slow.'),
})

/** Schema defaults, re-read for hand-built test contexts (the loader applies them normally). */
const DEFAULT_ANNOUNCE = false
const DEFAULT_ENABLED = true
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/index.ts:148-179](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/index.ts#L148-L179)

实际共享引擎、兼容启用例外与六工具。

<details>
<summary>查看原文（32行）</summary>

```text
function applyImpl(ctx: Context, config?: ResolvedConfig): void {
  const store = new HostStore()
  const engine = new SshEngine(store, { connectTimeoutMs: readConfigField(config?.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS) })
  ctx.effect(() => () => { engine.dispose() }, 'dsh-ssh: engine')

  const resolve = (): { announceToAgent: boolean; enabled: boolean } => {
    let enabled = readConfigField(config?.enabled, DEFAULT_ENABLED)
    // When dsh-ssh was seeded with enabled: false (e.g. from an aggregate profile
    // line), but the profile's own entry config never set the switch AND the user
    // already has active host records in dsh-ssh.json, keep the plugin enabled so
    // existing users are not broken upon upgrade (#1250).
    if (enabled === false && profileConfig(ctx)?.enabled === undefined && store.list().length > 0) {
      enabled = true
    }
    return {
      announceToAgent: readConfigField(config?.announceToAgent, DEFAULT_ANNOUNCE),
      enabled,
    }
  }

  // The /api/dsh-ssh route family + terminal upgrade.
  const { routes, upgrade, terminalSessions } = makeRoutes({ store, engine })
  let disposeRoutes: (() => void) | undefined

  // Agent tools + their prompt sections.
  const tools = [
    sshListTool(engine),
    sshExecTool(engine),
    sshUploadTool(engine),
    sshDownloadTool(engine),
    sshTunnelTool(engine),
    sshClusterTool(engine),
```

</details>

**依据 7 · 源码核查**：[packages/dsh-ssh/src/index.ts:189-239](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/index.ts#L189-L239)

开关接线、工具可见公告及路由清理。

<details>
<summary>查看原文（51行）</summary>

```text
  const sync = (): void => {
    // A settings edit reaches this instance without a remount; apply the
    // connection ceiling before re-deriving the surfaces so connections opened
    // by the request that follows use the new value.
    engine.setConnectTimeout(readConfigField(config?.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS))
    const value = resolve()
    if (disposeSection !== undefined) {
      disposeSection()
      disposeSection = undefined
    }
    if (disposeRoutes !== undefined) {
      disposeRoutes()
      disposeRoutes = undefined
    }
    if (disposeTools !== undefined) {
      disposeTools()
      disposeTools = undefined
    }
    if (!value.enabled) return
    if (value.announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: 'plugin:dsh-ssh',
        order: SECTION_ORDER,
        // The announcement names the ssh_* tools, so it renders only while at
        // least one of them is reachable: a restriction that removes the tool
        // surface must take the guidance with it, instead of telling the model
        // to call tools this session cannot see.
        text: visibleToolText(ctx.tools, SSH_TOOL_NAMES, SSH_GUIDANCE),
      })
    }
    disposeRoutes = ctx.effect(
      () => {
        const disposers = routes.map(route => ctx.webServer.register(route))
        const upgradeDisposer = ctx.webServer.registerUpgrade(upgrade)
        return () => {
          for (const dispose of disposers) dispose()
          upgradeDisposer()
          // Dropping the routes also ends the terminal sessions they served:
          // a live shell must not outlive the surface that can reach it.
          terminalSessions.dispose()
        }
      },
      'dsh-ssh: routes',
    )
    disposeTools = ctx.effect(
      () => {
        const disposers = tools.map(tool => ctx.tools.register(tool))
        return () => { for (const dispose of disposers) dispose() }
      },
      'dsh-ssh: tools',
    )
```

</details>

#### 缺口

- 缺同任务OpenSSH对照、发行包与Host安装验收。
  **影响**：不能由集成清单推需求强度、净节时或完整兼容。
  **进一步探讨**：低权限隔离环境先比较相同只读排障任务与目标核对成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命令如何实际执行，取消、重试和输出证明什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

ssh_exec execute直接await engine.exec(alias,command,timeout,exec.signal)，失败转success:false及error；GUI POST /exec通过loopback guard后同样调用engine.exec但不传signal。引擎转execCommand，按alias取池或acquire共享一次在途连接；store不存在alias即报错。记录以alias为键，连接坏才重建；单次调用inFlight防空闲回收，但不等于远端命令互斥或作业去重。

execCommand真实client.exec(command)。默认命令预算60秒是连接ready后的channel预算，连接/认证另30秒可配置；默认stdout/stderr各按2MiB截断。exitCode=0才success，非零仍返回结果；close无数值exit且非timeout会拒绝，只有record.broken时withClient才最多三次总尝试，健康连接逻辑错误不重放。断线发生在远端已写之后仍可能重放，三次是总attempts不是初次后再三次；没有远端job ID、幂等键或对账。

Abort signal会监听并尝试stream.signal KILL、close；abort在exec回调前到达也待channel出现再kill。已有close/error且aborted时返回cancelled避免重放，是局部保护；withClient调用末尾仍没传它的第五参数signal，连接错误拒绝与broken竞态仍不能借池的signal判断宣称取消绝不重试。已aborted也没有在acquire前拒绝，连接/认证未受同一signal中止；abort只kill而没有立即finish，若peer不close/error还等预算timer。timeout会硬settle，不等peer ACK，且不能撤销远端子进程/已写副作用。

输出是远端原文，不做秘密脱敏；工具render把stdout/stderr/error带入对话，截断不是数据泄漏防护。命令成功只说明该通道退出码，不等于业务目标正确或远端进程全部停止。所有结论为静态条件核查，未连接服务器或复现竞态。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/tools.ts:66-76](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/tools.ts#L66-L76)

render原样拼stdout/stderr/error。

<details>
<summary>查看原文（11行）</summary>

```text
/** Render one exec result (mirrors the bash-tool exit-code convention). */
function renderExec(result: ExecResult): string {
  const marker = result.timedOut
    ? '[timed out]'
    : `[exit code: ${result.exitCode ?? 'null'}]`
  const parts = [marker]
  if (result.stdout !== '') parts.push('stdout:\n' + result.stdout)
  if (result.stderr !== '') parts.push('stderr:\n' + result.stderr)
  if (result.error !== undefined) parts.push('error: ' + result.error)
  parts.push(`duration: ${result.durationMs} ms`)
  return parts.join('\n')
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/tools.ts:145-186](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/tools.ts#L145-L186)

工具直接执行/转signal及失败结果。

<details>
<summary>查看原文（42行）</summary>

```text
export function sshExecTool(engine: SshEngine) {
  return defineTool({
    name: 'ssh_exec',
    description: 'Execute a shell command on a REMOTE SSH host by alias; the command runs on the remote host, never on this machine. For commands on this machine, use the local bash tool. Prefer combining independent read-only queries into one command.',
    parameters: {
      alias: { type: 'string', required: true, description: 'Host alias from ssh_list.' },
      command: { type: 'string', required: true, description: 'The shell command to run remotely.' },
      timeoutMs: { type: 'integer', description: 'Remote command execution timeout in milliseconds (default 60000); it starts after the connection is ready. The connection and authentication ceiling is the dsh-ssh connectTimeoutMs setting, not this argument.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', required: true },
          exitCode: { oneOf: [{ type: 'integer' }, { type: 'null' }], required: true },
          timedOut: { type: 'boolean', required: true },
          stdout: { type: 'string', required: true },
          stderr: { type: 'string', required: true },
          durationMs: { type: 'integer', required: true },
          error: { type: 'string' },
        },
      },
      render: (_args, value: ExecResult) => text(renderExec(value)),
    },
    async execute(args, exec) {
      try {
        // Forward the caller's cancellation: aborting closes the remote channel
        // instead of leaving the command running on the host.
        return await engine.exec(args.alias, args.command, args.timeoutMs, exec.signal)
      } catch (error) {
        return {
          success: false,
          exitCode: null,
          timedOut: false,
          stdout: '',
          stderr: '',
          durationMs: 0,
          error: error instanceof Error ? error.message : String(error),
        }
      }
    },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/routes.ts:190-207](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/routes.ts#L190-L207)

GUI exec直接调用且无signal。

<details>
<summary>查看原文（18行）</summary>

```text
    {
      kind: 'exact',
      path: SSH_API.exec,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        const body = (await readJsonBody(req)) as Record<string, unknown> | null
        const alias = typeof body?.alias === 'string' ? body.alias : ''
        const command = typeof body?.command === 'string' ? body.command : ''
        if (alias === '' || command === '') {
          writeJson(res, 400, { error: 'alias and command are required' })
          return
        }
        const timeoutMs = typeof body?.timeoutMs === 'number' ? body.timeoutMs : undefined
        try {
          writeJson(res, 200, { result: await engine.exec(alias, command, timeoutMs) })
        } catch (error) {
          writeJson(res, 500, { error: error instanceof Error ? error.message : String(error) })
        }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/engine.ts:86-89](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine.ts#L86-L89)

facade真实转execCommand。

```text
  /** Run one command on `alias` (reusing the pooled connection). */
  async exec(alias: string, command: string, timeoutMs?: number, signal?: AbortSignal): Promise<ExecResult> {
    return execCommand(this, alias, command, timeoutMs, signal)
  }
```

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:42-49](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/connection-pool.ts#L42-L49)

默认连接/输出/命令/并发预算。

```text
export const DEFAULTS: Required<EngineOptions> = {
  idleTimeoutMs: 30 * 60_000,
  connectTimeoutMs: DEFAULT_CONNECT_TIMEOUT_MS,
  keepaliveIntervalMs: 15_000,
  maxOutputBytes: 2 * 1024 * 1024,
  defaultExecTimeoutMs: 60_000,
  defaultMaxWorkers: 8,
  sftpConcurrency: 8,
```

**依据 6 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:434-455](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/connection-pool.ts#L434-L455)

alias acquire共享flight和store查找。

<details>
<summary>查看原文（22行）</summary>

```text
/** Connect (or reuse) the pooled chain for one alias; pins nothing. */
export async function acquire(engine: PoolEngine, alias: string): Promise<PoolRecord> {
  const pending = engine.acquireQueue.get(alias)
  if (pending !== undefined) return pending
  const task = doAcquire(engine, alias)
  engine.acquireQueue.set(alias, task)
  try {
    return await task
  } finally {
    if (engine.acquireQueue.get(alias) === task) engine.acquireQueue.delete(alias)
  }
}

async function doAcquire(engine: PoolEngine, alias: string): Promise<PoolRecord> {
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry)
  const record: PoolRecord = { client, hops, idleAt: Date.now(), pinned: false, broken: false, inFlight: 0 }
  client.on('error', () => { record.broken = true })
  client.on('close', () => { record.broken = true })
  engine.pool.set(alias, record)
  return record
```

</details>

**依据 7 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:493-523](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/connection-pool.ts#L493-L523)

三次总attempt及broken/signal判据。

<details>
<summary>查看原文（31行）</summary>

```text
export async function withClient<T>(engine: PoolEngine, alias: string, fn: (client: Client) => Promise<T>, attempts = 3, signal?: AbortSignal): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let record = engine.pool.get(alias)
    if (record === undefined || record.broken) {
      if (record !== undefined) disposeRecord(engine, alias, record)
      record = await acquire(engine, alias)
    }
    record.idleAt = Date.now()
    record.inFlight += 1
    try {
      const result = await fn(record.client)
      record.idleAt = Date.now()
      return result
    } catch (error) {
      lastError = error
      // A cancelled call is never replayed: the caller asked for it to stop,
      // and a retry would re-run a command that may not be idempotent.
      if (signal?.aborted === true) throw error
      // Retry only when the connection actually broke mid-flight: drop the
      // corpse and let the next attempt reconnect (a reconnect may replay a
      // non-idempotent command — the documented trade-off). A failure on a
      // healthy connection is a logic error and is rethrown, not replayed.
      if (!record.broken) throw error
      disposeRecord(engine, alias, record)
    } finally {
      record.inFlight -= 1
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}
```

</details>

**依据 8 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:526-553](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/connection-pool.ts#L526-L553)

exec/abort信号与KILL。

<details>
<summary>查看原文（28行）</summary>

```text
export async function execCommand(engine: PoolEngine, alias: string, command: string, timeoutMs?: number, signal?: AbortSignal): Promise<ExecResult> {
  const started = Date.now()
  const budget = timeoutMs !== undefined && timeoutMs > 0 ? timeoutMs : engine.opts.defaultExecTimeoutMs
  return withClient(engine, alias, async (client) => {
    return await new Promise<ExecResult>((resolve, reject) => {
      // Caller cancellation is cooperative and quiescent: aborting closes the
      // remote channel and settles this call like a timeout does, so the
      // command stops without the pool replaying it. The channel is captured
      // in a mutable slot because abort may fire before client.exec calls back.
      let aborted = signal !== undefined && signal.aborted
      let kill = (): void => { /* channel not open yet */ }
      const onAbort = (): void => {
        aborted = true
        kill()
      }
      if (signal !== undefined && !signal.aborted) signal.addEventListener('abort', onAbort, { once: true })
      client.exec(command, (error, stream) => {
        if (error !== undefined) {
          signal?.removeEventListener('abort', onAbort)
          reject(error)
          return
        }
        kill = (): void => {
          try { stream.signal('KILL') } catch { /* channel gone */ }
          try { stream.close() } catch { /* channel gone */ }
        }
        // The abort may already have arrived while this channel opened.
        if (aborted) kill()
```

</details>

**依据 9 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:568-634](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/connection-pool.ts#L568-L634)

硬超时/退出码/取消/断线及未传池signal。

<details>
<summary>查看原文（67行）</summary>

```text
        const finish = (): void => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          resolve({
            success: false,
            exitCode: null,
            timedOut,
            stdout: stdout.text,
            stderr: stderr.text,
            durationMs: Date.now() - started,
            error: timedOut ? 'command timed out after ' + budget + ' ms' : undefined,
          })
        }
        const timer = setTimeout(() => {
          timedOut = true
          try { stream.signal('KILL') } catch { /* channel gone */ }
          try { stream.close() } catch { /* channel gone */ }
          // Hard deadline: settle now even if the peer never acks the
          // channel close (the stream 'close' handler is then a no-op).
          finish()
        }, budget)
        stream.on('data', (chunk: Buffer) => appendOutput(stdout, chunk, engine.opts.maxOutputBytes))
        stream.stderr.on('data', (chunk: Buffer) => appendOutput(stderr, chunk, engine.opts.maxOutputBytes))
        stream.on('close', (code: number | null) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          // A caller cancellation settles as cancelled, never as a broken
          // connection: the latter would send withClient into a retry that
          // re-runs a command the caller asked to stop.
          if (aborted) {
            resolve(cancelledResult())
            return
          }
          if (typeof code !== 'number' && !timedOut) {
            // The channel closed without an exit status: the connection
            // dropped mid-flight. Reject so withClient can reconnect and
            // retry within the attempt budget.
            reject(new Error('ssh: connection lost mid-flight (channel closed without an exit status)'))
            return
          }
          resolve({
            success: code === 0,
            exitCode: code,
            timedOut,
            stdout: stdout.text,
            stderr: stderr.text,
            durationMs: Date.now() - started,
          })
        })
        stream.on('error', (streamError: Error) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          if (aborted) {
            resolve(cancelledResult())
            return
          }
          reject(streamError)
        })
      })
    })
  })
```

</details>

#### 缺口

- 未进行真实握手、取消/断线重放或业务结果验证。
  **影响**：不能证明远端未执行、停止成功、重试不重复或输出不敏感。
  **进一步探讨**：用隔离测试机和可计数只读/虚构作业核连接、abort时序及对账，写操作需另授权。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地准入、凭据和主机身份构成什么信任边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

路由和terminal upgrade用isLoopbackRequest：socket需127/8或::1/映射，拒绝CF-Connecting-IP/X-Forwarded-For，Host需loopback，cross-site拒绝，Origin存在须host一致；无Origin的本机请求允许。它是本机请求边界，没有每DSH会话/主机的独立能力凭据或二次确认。Agent工具不经HTTP loopback门，靠Host工具权限和用户已配置alias；execute没有等待批准的程序分支，“先确认”是公告指导，不能保证模型每次会问。

HostStore把password/passphrase直接写JSON，同目录.tmp以0600写再rename，目录不存在才以0700创建；不是加密、不能保证既有目录/既有tmp模式或多进程写都安全。load仅按mtime/size缓存，坏JSON尝试移为.corrupt后返回空表，恢复需人工；没有跨进程锁或原子配置版本compare。工具主机列表删掉ProxyCommand原文仅给boolean，但执行输出仍原样。密钥文件读取、SFTP本机路径和ProxyCommand都在Host进程OS权限下，不受bash沙箱围栏。

buildConnectConfig包含目标/用户/认证与forwardAgent，却没有hostVerifier或known_hosts检查；本轮未重新验证ssh2安装产物或上游默认握手契约，因此只确认插件层没有身份pin，不能承诺连到预期公钥。forwardAgent默认只在entry明确true启用，解析不到agent端点会throw，不静默降级；这仍把本机签名能力交给被信任远端。ProxyJump实际逐跳forwardOut，地址hop复用目标auth但不继承forwardAgent；仅首跳可ProxyCommand，目标不能同时配jump与command。

ProxyCommand经shell -c/cmd执行，占Host环境和权限；POSIX独立进程组TERM后KILL，Windows只杀shell，不保证其子进程都结束。GUI PATCH连接字段会dropAlias关池和隧道；该函数未遍历独立PTY registry，所以改配置/删除alias不代表既有shell已撤销，也不能推在途acquire与重配具事务一致性。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/loopback.ts:72-91](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/loopback.ts#L72-L91)

本机socket/Host、代理及browser markers实际门。

<details>
<summary>查看原文（20行）</summary>

```text
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  if (isProxiedRequest(request)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/routes.ts:122-150](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/routes.ts#L122-L150)

配置更新/删除与dropAlias。

<details>
<summary>查看原文（29行）</summary>

```text
        if (method === 'PATCH') {
          const body = (await readJsonBody(req)) as Record<string, unknown> | null
          if (body === null) {
            writeJson(res, 400, { error: 'invalid JSON body' })
            return
          }
          try {
            const entry = store.update(alias, body as unknown as Partial<HostPayload>)
            // Connection-relevant changes invalidate the pooled connection:
            // without this the pool would keep running commands on the old
            // host/credentials until the idle sweep (up to 30 min later).
            // Agent forwarding belongs here too: it is fixed per connection
            // (ssh2 negotiates it when the channel opens), so toggling it must
            // reconnect or the new setting silently never takes effect.
            const patch = body as Record<string, unknown>
            if (['host', 'port', 'user', 'auth', 'proxyJump', 'proxyCommand', 'forwardAgent'].some(key => patch[key] !== undefined)) {
              engine.dropAlias(alias)
            }
            writeJson(res, 200, { host: store.summarize(entry) })
          } catch (error) {
            writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) })
          }
          return
        }
        if (method === 'DELETE') {
          try {
            engine.dropAlias(alias)
            store.delete(alias)
            writeJson(res, 200, { ok: true })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine.ts:154-163](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine.ts#L154-L163)

dropAlias只处理tunnel和pool。

<details>
<summary>查看原文（10行）</summary>

```text
  /**
   * Drop every live artifact bound to one alias: stop its tunnels and close
   * the pooled connection. Host entries that are deleted or whose connection
   * fields change must never keep serving a stale, previously authenticated
   * connection — the next operation re-connects from the current config.
   */
  dropAlias(alias: string): void {
    stopAllTunnels(this, alias)
    disposeRecord(this, alias)
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/store.ts:162-188](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/store.ts#L162-L188)

明文auth存entry并save。

<details>
<summary>查看原文（27行）</summary>

```text
    const entry: SshHostEntry = {
      alias,
      host: payload.host.trim(),
      port: payload.port ?? 22,
      user: payload.user.trim(),
      auth: {
        kind: payload.auth.kind,
        keyPath: payload.auth.kind === 'key' ? expandHome(payload.auth.keyPath?.trim() ?? '') : undefined,
        passphrase: payload.auth.kind === 'key' ? payload.auth.passphrase ?? undefined : undefined,
        password: payload.auth.kind === 'password' ? payload.auth.password : undefined,
        agentPath: payload.auth.kind === 'agent' ? normalizeAgentPath(payload.auth.agentPath) : undefined,
      },
      proxyJump: [...(payload.proxyJump ?? [])],
      proxyCommand: normalizeProxyCommand(payload.proxyCommand),
      description: payload.description?.trim() || undefined,
      environment: payload.environment?.trim() || undefined,
      tags: [...(payload.tags ?? [])].map(tag => tag.trim()).filter(tag => tag !== ''),
      location: payload.location?.trim() || undefined,
      // Stored only when enabled, so a store file written without agent
      // forwarding stays byte-identical to the pre-feature format.
      forwardAgent: payload.forwardAgent === true ? true : undefined,
      createdAt: now,
      updatedAt: now,
    }
    file.hosts.push(entry)
    this.save(file)
    return entry
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/store.ts:373-403](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/store.ts#L373-L403)

mtime缓存、坏文件恢复、固定tmp及mode/rename。

<details>
<summary>查看原文（31行）</summary>

```text
    if (this.cache !== undefined && this.cache.mtimeMs === stats.mtimeMs && this.cache.size === stats.size) {
      return this.cache.file
    }
    try {
      const parsed = JSON.parse(readFileSync(this.path, 'utf8')) as StoreFile
      if (typeof parsed !== 'object' || parsed === null || !Array.isArray(parsed.hosts)) {
        throw new Error('store file shape invalid')
      }
      this.cache = { mtimeMs: stats.mtimeMs, size: stats.size, file: parsed }
      return parsed
    } catch {
      // A corrupt store must not brick the plugin — and must not be silently
      // overwritten by the next save: rename it aside for manual recovery
      // (the plugin then starts from an empty list).
      this.cache = undefined
      try {
        renameSync(this.path, `${this.path}.corrupt-${Date.now()}`)
      } catch { /* best effort */ }
      return { version: FORMAT_VERSION, hosts: [] }
    }
  }

  private save(file: StoreFile): void {
    const dir = dirname(this.path)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
    const tmp = this.path + '.tmp'
    // Secrets live in this file: keep it readable by the owner only. The
    // tmp file carries the 0600 mode through the rename.
    writeFileSync(tmp, JSON.stringify(file, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    renameSync(tmp, this.path)
    this.cache = undefined
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/tools.ts:40-44](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/tools.ts#L40-L44)

代理原文投影boolean。

```text
/** Project one summary onto the agent-facing row shape. */
export function toAgentHostRow(host: SshHostSummary): AgentHostRow {
  const { proxyCommand, ...rest } = host
  return { ...rest, proxyCommandConfigured: proxyCommand !== undefined }
}
```

**依据 7 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:77-125](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/connection-pool.ts#L77-L125)

连接config完整构建无身份pin且forwardAgent opt-in。

<details>
<summary>查看原文（49行）</summary>

```text
export function buildConnectConfig(entry: SshHostEntry, sock: ConnectConfig['sock'] | undefined, opts: Required<EngineOptions>): ConnectConfig {
  const config: ConnectConfig = {
    host: entry.host,
    port: entry.port,
    username: entry.user,
    readyTimeout: opts.connectTimeoutMs,
    keepaliveInterval: opts.keepaliveIntervalMs,
    keepaliveCountMax: 3,
    tryKeyboard: true,
  }
  if (sock !== undefined) config.sock = sock
  if (entry.auth.kind === 'password') {
    config.password = entry.auth.password
  } else if (entry.auth.kind === 'agent') {
    const agentPath = resolveAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      throw new Error('ssh-agent is not available: set SSH_AUTH_SOCK or configure an agent path (use \'pageant\' for PuTTY Pageant on Windows)')
    }
    config.agent = agentPath
  } else {
    const keyPath = entry.auth.keyPath === undefined ? undefined : expandHome(entry.auth.keyPath)
    if (keyPath === undefined || !existsSync(keyPath)) {
      throw new Error('private key not found: ' + (entry.auth.keyPath ?? '(unset)'))
    }
    config.privateKey = readFileSync(keyPath, 'utf8')
    if (entry.auth.passphrase !== undefined && entry.auth.passphrase !== '') {
      config.passphrase = entry.auth.passphrase
    }
  }
  // Agent forwarding is additive: it never changes how the host
  // authenticates, it only lets this connection broker signatures from the
  // local agent for the remote side (OpenSSH ForwardAgent / ssh -A).
  if (entry.forwardAgent === true) {
    // Agent auth already resolved an endpoint, and reusing it keeps the
    // forwarded agent identical to the one that authenticated.
    const agentPath = typeof config.agent === 'string'
      ? config.agent
      : resolveForwardAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      // ssh2's own message for this case ("You must set a valid agent path to
      // allow agent forwarding") names neither the host nor a way out, so the
      // engine refuses first with an actionable one.
      throw new Error('agent forwarding is enabled for this host but no ssh-agent endpoint is available: '
        + 'set SSH_AUTH_SOCK, start Pageant on Windows, or configure an agent path')
    }
    config.agent = agentPath
    config.agentForward = true
  }
  return config
```

</details>

**依据 8 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:324-342](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/connection-pool.ts#L324-L342)

地址hop复用auth不继承forwardAgent。

<details>
<summary>查看原文（19行）</summary>

```text
export function resolveHop(engine: PoolEngine, entry: SshHostEntry, spec: string): SshHostEntry {
  const configured = engine.store.find(spec)
  if (configured !== undefined) return configured
  const parsed = parseJumpSpec(spec)
  if (parsed === undefined) {
    throw new Error('proxyJump \'' + spec + '\' is neither a configured alias nor a [user@]host[:port] address')
  }
  const now = Date.now()
  return {
    alias: spec,
    host: parsed.host,
    port: parsed.port ?? 22,
    user: parsed.user ?? process.env.USER ?? entry.user,
    auth: entry.auth,
    proxyJump: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
  }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:354-417](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/connection-pool.ts#L354-L417)

跳链/ProxyCommand真实启动与失败清理。

<details>
<summary>查看原文（64行）</summary>

```text
export async function connectChain(
  engine: PoolEngine,
  entry: SshHostEntry,
  onKeyboardInteractive?: KeyboardInteractiveHandler,
): Promise<{ client: Client; hops: Client[] }> {
  const hops: Client[] = []
  const chain = entry.proxyJump
  // The store rejects both transports on one entry; a hand-edited store file
  // can still carry both, and silently picking one would hide the mistake.
  if (chain.length > 0 && entry.proxyCommand !== undefined) {
    throw new Error('entry \'' + entry.alias + '\' declares both proxyCommand and proxyJump — pick one transport per host')
  }
  /** Transports this call started; destroyed on every failure path. */
  const transports: Duplex[] = []
  const startTransport = (owner: SshHostEntry): ConnectConfig['sock'] => {
    const { stream } = startProxyCommand(owner.proxyCommand as string, proxyTargetOf(owner))
    transports.push(stream)
    return stream
  }
  let sock: ConnectConfig['sock'] = entry.proxyCommand !== undefined ? startTransport(entry) : undefined
  try {
    for (let index = 0; index < chain.length; index += 1) {
      const spec = chain[index]
      const hop = resolveHop(engine, entry, spec)
      if (index > 0 && hop.proxyCommand !== undefined) {
        throw new Error('proxyJump hop \'' + spec + '\' declares a proxyCommand, which is only supported on the first hop')
      }
      const hopSock = index === 0 && hop.proxyCommand !== undefined ? startTransport(hop) : sock
      let hopClient: Client
      try {
        hopClient = await connectClient(buildConnectConfig(hop, hopSock, engine.opts), onKeyboardInteractive)
      } catch (error) {
        // Name the hop: an address hop (or a typo'd alias) must stay
        // diagnosable from the error alone.
        throw new Error('proxyJump hop \'' + spec + '\' (' + hop.user + '@' + hop.host + ':' + hop.port + '): '
          + (error instanceof Error ? error.message : String(error)))
      }
      hops.push(hopClient)
      const next = index + 1 < chain.length ? resolveHop(engine, entry, chain[index + 1]) : undefined
      const nextHost = next !== undefined ? next.host : entry.host
      const nextPort = next !== undefined ? next.port : entry.port
      sock = await new Promise<ConnectConfig['sock']>((resolve, reject) => {
        hopClient.forwardOut('127.0.0.1', 0, nextHost, nextPort, (error, stream) => {
          if (error !== undefined) {
            reject(new Error('proxyJump hop \'' + spec + '\' could not forward to ' + nextHost + ':' + nextPort + ': ' + error.message))
          } else {
            resolve(stream)
          }
        })
      })
    }
  } catch (error) {
    // A missing alias, a failed hop connect, or a failed forwardOut must all
    // close the hops already connected — and the proxy commands behind them —
    // so a failed ProxyJump never leaks either.
    for (const client of hops) client.end()
    for (const stream of transports) {
      try { stream.destroy() } catch { /* already closed */ }
    }
    throw error
  }
  let target: Client | undefined
  try {
    target = await connectClient(buildConnectConfig(entry, sock, engine.opts), onKeyboardInteractive)
```

</details>

**依据 10 · 源码核查**：[packages/dsh-ssh/src/engine/proxy-command.ts:54-62](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/proxy-command.ts#L54-L62)

使用Host shell。

```text
function spawnSpec(command: string): SpawnSpec {
  if (process.platform === 'win32') {
    return {
      file: process.env.ComSpec ?? 'cmd.exe',
      args: ['/d', '/s', '/c', '"' + command + '"'],
      windowsVerbatimArguments: true,
    }
  }
  return { file: process.env.SHELL ?? '/bin/sh', args: ['-c', command] }
```

**依据 11 · 源码核查**：[packages/dsh-ssh/src/engine/proxy-command.ts:81-114](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/proxy-command.ts#L81-L114)

实际spawn与进程组回收差别。

<details>
<summary>查看原文（34行）</summary>

```text
export function startProxyCommand(rawCommand: string, target: ProxyTarget): ProxyCommandProcess {
  const command = expandProxyTokens(rawCommand, target)
  const spec = spawnSpec(command)
  const child = spawn(spec.file, spec.args, {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
    ...(spec.windowsVerbatimArguments === true ? { windowsVerbatimArguments: true } : {}),
    // POSIX only: own process group, so a chained client
    // (`ssh -W %h:%p bastion`) dies with the transport instead of leaking.
    ...(process.platform === 'win32' ? {} : { detached: true }),
  })

  let stderr = ''
  child.stderr?.on('data', (chunk: Buffer) => {
    stderr = (stderr + chunk.toString('utf8')).slice(-MAX_STDERR)
  })

  let killed = false
  const kill = (): void => {
    if (killed) return
    killed = true
    const pid = child.pid
    const group = process.platform !== 'win32' && pid !== undefined
    try {
      if (group) process.kill(-pid, 'SIGTERM')
      else child.kill()
    } catch { /* already gone */ }
    const escalate = setTimeout(() => {
      try {
        if (group) process.kill(-pid, 'SIGKILL')
        else child.kill('SIGKILL')
      } catch { /* already gone */ }
    }, KILL_GRACE_MS)
    escalate.unref()
```

</details>

#### 缺口

- 未验Host工具授权/多账户部署、ssh2具体主机密钥契约、既有权限与跨进程重配。
  **影响**：不能将loopback/alias视为生产身份隔离或完整凭据撤销。
  **进一步探讨**：先核安装版本公钥验证和Host实际权限；隔离home测试重配、仍活PTY与在途连接，不访问真实凭据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 文件、终端、隧道与集群的结果和关闭可信吗？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑、效果与总成本

#### 完整回答

上传工具直接engine.upload(localPath,remotePath,false)，下载直接engine.download，无exec.signal、目录沙箱或覆盖批准；本机resolvePath后按Host权限访问。SFTP上传要求远端绝对路径、创建父目录并fastPut，目录walk跳过内部symlink但根路径先stat，不能外推任意输入绝不跟链接；下载拒绝远端目录，mkdir本机父目录后fastGet到目标。没有temp+commit、hash验收或续传，失败可留部分文件，withClient遇broken会重新整个操作。withSftp finally endOnce保护通道资源，不回滚文件。

GUI上传先临时0600落盘，按声明和实际字节上限4GiB，NDJSON HTTP200之后仍须看result.ok。断开会fail并清本机tmp，但SFTP已启动调用无signal，不能保证远端停止或部分字节消失；下载先Host临时文件再响应，最后清tmp，浏览器保存另一个结果。浏览器showSaveFilePicker取消被catch并回落blob，不是中止远端下载；用户需要区别文件选择取消与网络取消。

终端真实独立connectChain/client.shell，不复用池；Host registry存id、输出和连接，detach仅去socket，默认10分钟无附着回收，退出结果默认留60秒；attach按sessionId重放，未绑定单个DSH会话身份，依赖共同loopback/Host信任。close帧到Host才end并shell.close/end连接，路由释放dispose全部terminal；已经启动远端后台进程仍不保证随shell结束。

关键是关闭回执：背景tab调用closeTerminalSession，socket onopen里send(close)不抛错便立即finish(true)，或收到exit也true，超时/错误false；UI true删除tab，false保留sessionId及closeError。README“Host confirms”强于这个门，发送成功不是接收、shell已退出或远端清理完成的ACK。前景tab也发close后立即移tab；连接中tab由controller保留close意图，ready现读意图后close，避免早detach无id。当前核的是边界，不宣称实际泄漏已复现。

隧道127.0.0.1 listen后state forwarding只表示本机listener与SSH连接就绪，真实每socket才forwardOut；远端拒绝会关socket但隧道可继续列在表。坏link回收listener和socket；stop最后共享record才dispose。集群必须至少非空selector，各过滤取交集、tags全满足，workers最多8，结果逐host追加、不回滚此前成功；signal传每个exec，但worker循环没有abort即停止取队列门，不能把cancel当剩余主机绝不会尝试连接。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/tools.ts:215-221](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/tools.ts#L215-L221)

上传工具直接调用无signal。

```text
    async execute(args) {
      try {
        const outcome = await engine.upload(args.alias, args.localPath, args.remotePath, false)
        return { ok: true, transferredBytes: outcome.bytes, files: outcome.files }
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) }
      }
```

**依据 2 · 源码核查**：[packages/dsh-ssh/src/tools.ts:250-256](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/tools.ts#L250-L256)

下载直接调用无signal。

```text
    async execute(args) {
      try {
        const outcome = await engine.download(args.alias, args.remotePath, args.localPath)
        return { ok: true, bytes: outcome.bytes }
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) }
      }
```

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:14-29](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/sftp.ts#L14-L29)

内部目录walk lstat跳symlink。

<details>
<summary>查看原文（16行）</summary>

```text
export function walkLocalDir(root: string): string[] {
  const files: string[] = []
  const visit = (dir: string): void => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      // lstat, not stat: a symlink must never be followed — a link cycle
      // (ln -s . self) recurses forever under stat, and a link to a file
      // would silently upload the target's bytes.
      const stat = lstatSync(full)
      if (stat.isSymbolicLink()) continue
      if (stat.isDirectory()) visit(full)
      else if (stat.isFile()) files.push(relative(root, full).replaceAll('\\', '/'))
    }
  }
  visit(root)
  return files
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:33-91](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/sftp.ts#L33-L91)

本机resolve、目录处理与实际fastPut/Get。

<details>
<summary>查看原文（59行）</summary>

```text
export async function upload(
  engine: PoolEngine,
  alias: string,
  localPath: string,
  remotePath: string,
  recursive: boolean,
  onProgress?: (progress: TransferProgress) => void,
): Promise<{ bytes: number; files: number }> {
  // Remote paths must be absolute: the mkdir chain and fastPut must agree
  // on one resolution (relative paths previously created dirs at the root).
  if (!remotePath.startsWith('/')) {
    throw new Error('remotePath must be an absolute path (got \'' + remotePath + '\')')
  }
  const local = resolvePath(localPath)
  if (!existsSync(local)) throw new Error('local path not found: \'' + localPath + '\'')
  return withClient(engine, alias, (client) => withSftp(client, async (sftp) => {
    const stat = statSync(local)
    let files: string[]
    if (stat.isDirectory()) {
      if (!recursive) throw new Error('\'' + localPath + '\' is a directory — enable recursive upload')
      files = walkLocalDir(local)
      await ensureRemoteDir(sftp, remotePath)
    } else {
      files = ['']
      await ensureRemoteDir(sftp, dirname(remotePath))
    }
    let bytes = 0
    for (const rel of files) {
      const src = rel === '' ? local : join(local, rel)
      // Remote paths always use forward slashes; normalize any OS separators.
      const remoteRel = rel.split(/[\\/]/).join('/')
      const dst = rel === '' ? remotePath : remotePath.replace(/\/$/, '') + '/' + remoteRel
      await fastPut(sftp, src, dst, engine.opts.sftpConcurrency, onProgress)
      bytes += statSync(src).size
    }
    return { bytes, files: files.length }
  }))
}

/** Download one remote file to a local path. */
export async function download(
  engine: PoolEngine,
  alias: string,
  remotePath: string,
  localPath: string,
  onProgress?: (progress: TransferProgress) => void,
): Promise<{ bytes: number }> {
  return withClient(engine, alias, (client) => withSftp(client, async (sftp) => {
    const stat = await new Promise<{ isDirectory: () => boolean }>((resolve, reject) => {
      sftp.stat(remotePath, (error, stats) => error !== undefined ? reject(error) : resolve(stats))
    })
    if (stat.isDirectory()) {
      throw new Error('\'' + remotePath + '\' is a directory — directory download is not supported yet (download individual files)')
    }
    const local = resolvePath(localPath)
    if (!existsSync(dirname(local))) mkdirSync(dirname(local), { recursive: true })
    await fastGet(sftp, remotePath, local, engine.opts.sftpConcurrency, onProgress)
    return { bytes: statSync(local).size }
  }))
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:122-137](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/sftp.ts#L122-L137)

finally释放通道非文件回滚。

<details>
<summary>查看原文（16行）</summary>

```text
async function withSftp<T>(client: Client, run: (sftp: SFTPWrapper) => Promise<T>): Promise<T> {
  const sftp = await sftpChannel(client)
  let ended = false
  const endOnce = (): void => {
    if (ended) return
    ended = true
    try { sftp.end() } catch { /* channel already closed */ }
  }
  // The channel can also close underneath us (peer reset, timeout); the
  // guard makes the finally below a no-op instead of ending it twice.
  sftp.once('close', endOnce)
  try {
    return await run(sftp)
  } finally {
    endOnce()
  }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:206-216](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/sftp.ts#L206-L216)

实际传输回调成功/错误。

<details>
<summary>查看原文（11行）</summary>

```text
    const done = (error: unknown): void => {
      if (error !== undefined) {
        onProgress?.({ phase: 'error', file, transferred: 0, total: 0, percent: 0, error: String(error) })
        reject(error)
      } else {
        onProgress?.({ phase: 'done', file, transferred: finalSize(), total: finalSize(), percent: 100 })
        resolve()
      }
    }
    if (kind === 'put') sftp.fastPut(src, dst, { concurrency, step }, done)
    else sftp.fastGet(src, dst, { concurrency, step }, done)
```

</details>

**依据 7 · 源码核查**：[packages/dsh-ssh/src/routes.ts:321-336](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/routes.ts#L321-L336)

上传上限与临时文件。

<details>
<summary>查看原文（16行）</summary>

```text
        const declared = Number(req.headers['content-length'])
        if (Number.isFinite(declared) && declared > maxUploadBytes) {
          writeJson(res, 413, { error: 'upload body too large' })
          return
        }
        res.writeHead(200, {
          'content-type': 'application/x-ndjson; charset=utf-8',
          'cache-control': 'no-cache',
          'referrer-policy': 'no-referrer',
        })
        const emit = (line: unknown): void => {
          try { res.write(JSON.stringify(line) + '\n') } catch { /* client gone */ }
        }
        // Stage the uploaded bytes, then SFTP them out with progress frames.
        const tmp = join(staging, `upload-${randomBytes(6).toString('hex')}`)
        const sink = createWriteStream(tmp, { mode: 0o600 })
```

</details>

**依据 8 · 源码核查**：[packages/dsh-ssh/src/routes.ts:366-400](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/routes.ts#L366-L400)

断开/字节计数与SFTP实际调用不带signal。

<details>
<summary>查看原文（35行）</summary>

```text
        sink.on('error', (error) => fail(error))
        req.on('error', (error) => fail(error))
        req.on('aborted', () => fail('upload aborted by the client'))
        res.on('error', () => fail('response stream closed'))
        res.on('close', () => { if (!res.writableEnded) fail('connection closed') })
        // The content-length pre-check above can be bypassed by chunked or
        // header-less requests: count the bytes as they actually arrive and
        // abort the moment the cap is exceeded.
        let received = 0
        let capped = false
        req.on('data', (chunk: Buffer) => {
          received += chunk.byteLength
          if (received > maxUploadBytes && !capped) {
            capped = true
            fail('upload body too large')
            // Keep the socket alive until the response flush finishes:
            // destroying the request here races res.end() and the client
            // sees a hang-up instead of the result frame. Drain the rest of
            // the body so the socket can close cleanly afterwards.
            res.on('finish', () => { try { req.destroy() } catch { /* closed */ } })
            req.resume()
          }
        })
        req.pipe(sink)
        sink.on('finish', async () => {
          if (settled) return
          emit({ type: 'progress', progress: { phase: 'connecting', file: remotePath, transferred: 0, total: 0, percent: 0 } })
          try {
            const outcome = await engine.upload(alias, tmp, remotePath, false, progress => emit({ type: 'progress', progress }))
            emit({ type: 'result', ok: true, transferredBytes: outcome.bytes })
          } catch (error) {
            emit({ type: 'result', ok: false, error: error instanceof Error ? error.message : String(error) })
          } finally {
            await unlink(tmp).catch(() => undefined)
            done()
```

</details>

**依据 9 · 源码核查**：[packages/dsh-ssh/src/routes.ts:418-446](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/routes.ts#L418-L446)

下载temp/response/最后清理。

<details>
<summary>查看原文（29行）</summary>

```text
        const tmp = join(staging, `download-${randomBytes(6).toString('hex')}`)
        try {
          // Pre-create with 0600: ssh2's fastGet opens the destination with
          // umask-default permissions and a pre-created file keeps the mode.
          closeSync(openSync(tmp, 'w', 0o600))
          const outcome = await engine.download(alias, remotePath, tmp)
          res.writeHead(200, {
            'content-type': 'application/octet-stream',
            'content-length': String(outcome.bytes),
            'content-disposition': `attachment; filename="${basename(remotePath).replace(/"/g, '')}"`,
            'referrer-policy': 'no-referrer',
          })
          await new Promise<void>((resolve, reject) => {
            const source = createReadStream(tmp)
            source.on('error', reject)
            res.on('error', reject)
            source.pipe(res)
            source.on('end', resolve)
          })
        } catch (error) {
          if (!res.headersSent) {
            writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) })
          } else {
            // Mid-stream failure after headers: destroy so the browser does
            // not hang waiting for the promised content-length bytes.
            res.destroy()
          }
        } finally {
          await unlink(tmp).catch(() => undefined)
```

</details>

**依据 10 · 源码核查**：[packages/dsh-ssh/src/client/api.ts:452-479](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/client/api.ts#L452-L479)

保存框取消回落blob非下载取消。

<details>
<summary>查看原文（28行）</summary>

```text
    try {
      if (picker !== undefined) {
        const handle = await picker.call(window, { suggestedName: filename })
        writable = await handle.createWritable()
        streamed = true
      }
    } catch {
      // User cancelled the save dialog or the API is unavailable: fall back.
    }
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (writable !== undefined) {
        await writable.write(value as Uint8Array)
      } else {
        chunks.push(value as Uint8Array<ArrayBuffer>)
      }
      received += value.length
      progress()
    }
    if (writable !== undefined) await writable.close()
    onProgress?.({ phase: 'done', file: remotePath, transferred: received, total: received > 0 ? received : total, percent: 100 })
    return {
      blob: streamed ? undefined : new Blob(chunks),
      filename,
      streamed,
      bytes: received,
    }
```

</details>

**依据 11 · 源码核查**：[packages/dsh-ssh/src/engine/pty.ts:38-75](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/pty.ts#L38-L75)

独立shell连接与close清理。

<details>
<summary>查看原文（38行）</summary>

```text
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry, onKeyboardInteractive)
  return await new Promise<ShellSession>((resolve, reject) => {
    client.shell({ term: 'xterm-256color', cols: size.cols, rows: size.rows }, (error, stream) => {
      if (error !== undefined) {
        try { client.end() } catch { /* closed */ }
        for (const hop of hops) { try { hop.end() } catch { /* closed */ } }
        reject(error)
        return
      }
      let tornDown = false
      const teardown = (): void => {
        if (tornDown) return
        tornDown = true
        try { client.end() } catch { /* closed */ }
        for (const hop of hops) { try { hop.end() } catch { /* closed */ } }
      }
      const session: ShellSession = {
        send: (data) => { try { stream.write(data) } catch { /* channel gone */ } },
        resize: (cols, rows) => { try { stream.setWindow(rows, cols, rows, cols) } catch { /* channel gone */ } },
        close: () => {
          try { stream.close() } catch { /* channel gone */ }
          teardown()
        },
        pause: () => { try { stream.pause() } catch { /* channel gone */ } },
        resume: () => { try { stream.resume() } catch { /* channel gone */ } },
      }
      stream.on('data', (chunk: Buffer) => { session.onData?.(chunk) })
      stream.on('close', (code: number | null) => {
        teardown()
        session.onExit?.(code)
      })
      stream.on('error', (streamError: Error) => {
        teardown()
        session.onExit?.(null, streamError instanceof Error ? streamError.message : String(streamError))
      })
      resolve(session)
```

</details>

**依据 12 · 源码核查**：[packages/dsh-ssh/src/engine/terminal-sessions.ts:24-30](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/terminal-sessions.ts#L24-L30)

回收和缓冲默认。

```text
const DEFAULT_MAX_BUFFER_BYTES = 256 * 1024

/** A detached session is reaped after this long. */
const DEFAULT_IDLE_MS = 10 * 60 * 1000

/** An exited session is kept this long for a reattaching view. */
const DEFAULT_EXIT_GRACE_MS = 60 * 1000
```

**依据 13 · 源码核查**：[packages/dsh-ssh/src/engine/terminal-sessions.ts:113-134](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/terminal-sessions.ts#L113-L134)

attach按id与dispose。

<details>
<summary>查看原文（22行）</summary>

```text
  attach(ws: WebSocket, sessionId: string, size: { cols: number; rows: number }): boolean {
    const session = this.sessions.get(sessionId)
    if (session === undefined) return false
    this.bind(ws, session)
    this.clearReap(session)
    for (const chunk of session.buffer) this.sendTo(session, ws, { type: 'output', data: chunk })
    this.sendTo(session, ws, { type: 'ready', alias: session.alias, sessionId: session.id })
    if (session.exited) {
      this.sendTo(session, ws, { type: 'exit', code: session.exit?.code ?? null, error: session.exit?.error })
      // Re-arm the grace window: this socket now holds the exited session open.
      this.scheduleReap(session, this.exitGraceMs)
    } else {
      session.shell?.resize(Math.max(2, size.cols), Math.max(1, size.rows))
      session.shell?.resume()
    }
    return true
  }

  /** End every session (host teardown, plugin dispose). */
  dispose(): void {
    for (const session of [...this.sessions.values()]) this.end(session, false)
    this.sessions.clear()
```

</details>

**依据 14 · 源码核查**：[packages/dsh-ssh/src/engine/terminal-sessions.ts:152-195](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/terminal-sessions.ts#L152-L195)

帧处理、detach保shell、end关闭。

<details>
<summary>查看原文（44行）</summary>

```text
      if (frame.type === 'input') {
        session.shell?.send(frame.data ?? '')
      } else if (frame.type === 'resize') {
        session.shell?.resize(Math.max(2, frame.cols ?? 80), Math.max(1, frame.rows ?? 24))
      } else if (frame.type === 'auth_response') {
        const finish = session.pendingAuthFinish
        session.pendingAuthFinish = undefined
        try { finish?.(frame.responses ?? []) } catch { /* the connect already failed */ }
      } else if (frame.type === 'close') {
        this.end(session, true)
      } else if (frame.type === 'detach') {
        this.detach(ws)
      }
    })
    ws.on('close', () => { this.detach(ws) })
    ws.on('error', () => { this.detach(ws) })
  }

  /** Remove a socket from its session, keeping the shell alive. */
  private detach(ws: WebSocket): void {
    for (const session of this.sessions.values()) {
      if (!session.sockets.delete(ws)) continue
      if (session.sockets.size === 0) {
        // Nobody is watching: give the view a window to come back before the
        // remote shell is torn down (or, for an exited one, before its final
        // screen is dropped).
        this.scheduleReap(session, session.exited ? this.exitGraceMs : this.idleMs)
      }
      return
    }
  }

  /** End the session a socket is attached to (explicit close from the view). */
  private end(session: HostedTerminal, notify: boolean): void {
    this.clearReap(session)
    if (this.sessions.delete(session.id) && notify) {
      if (session.pendingAuthFinish !== undefined) {
        const finish = session.pendingAuthFinish
        session.pendingAuthFinish = undefined
        try { finish([]) } catch { /* the connect already failed */ }
      }
    }
    try { session.shell?.close() } catch { /* channel gone */ }
  }
```

</details>

**依据 15 · 源码核查**：[packages/dsh-ssh/src/client/api.ts:526-572](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/client/api.ts#L526-L572)

send成功即true，无停止ACK；错误超时false。

<details>
<summary>查看原文（47行）</summary>

```text
  closeTerminalSession(sessionId: string, timeoutMs = 5000): Promise<boolean> {
    const target = terminalSocketUrl(
      window.location,
      query({ session: sessionId, cols: 2, rows: 1 }),
      transportStreamBaseUrl(),
    )
    if (target === undefined) return Promise.resolve(false)
    let socket: WebSocket
    try {
      socket = new WebSocket(target)
    } catch {
      return Promise.resolve(false)
    }
    return new Promise<boolean>((resolve) => {
      let settled = false
      let timer: ReturnType<typeof setTimeout> | undefined
      const finish = (gone: boolean): void => {
        if (settled) return
        settled = true
        if (timer !== undefined) clearTimeout(timer)
        try { socket.close() } catch { /* already closed */ }
        resolve(gone)
      }
      timer = setTimeout(() => { finish(false) }, timeoutMs)
      socket.onopen = () => {
        const closeFrame: TerminalClientFrame = { type: 'close' }
        try {
          socket.send(JSON.stringify(closeFrame))
          finish(true)
        } catch {
          // The frame never left, which proves nothing either way: wait for the
          // host's own answer (an exit frame for an id that no longer exists),
          // for the socket to fail, or for the bounded wait to expire.
        }
      }
      socket.onmessage = (event: MessageEvent<string>) => {
        let frame: TerminalServerFrame
        try {
          frame = JSON.parse(event.data) as TerminalServerFrame
        } catch {
          return
        }
        // Exit (expired id or an ended shell) means there is nothing left to end.
        if (frame.type === 'exit') finish(true)
      }
      socket.onerror = () => { finish(false) }
      socket.onclose = () => { finish(false) }
```

</details>

**依据 16 · 源码核查**：[packages/dsh-ssh/src/client/panel/TerminalTab.tsx:395-435](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/client/panel/TerminalTab.tsx#L395-L435)

前景/背景关闭分别处理与false保留。

<details>
<summary>查看原文（41行）</summary>

```text
  const closeTab = (tabId: string): void => {
    const tab = controller.terminalTab(tabId)
    if (tab === undefined) return
    const bound = linkRef.current
    if (bound !== null && bound.tabId === tabId) {
      linkRef.current = null
      const connection = bound.connection
      connection.onReady = undefined
      connection.onOutput = undefined
      connection.onExit = undefined
      connection.onAuthPrompt = undefined
      if (tab.status === 'connecting') controller.adoptTerminalLink(tabId, connection, 'close')
      else connection.close()
      controller.closeTerminalTab(tabId)
      return
    }
    if (tab.status === 'connected' && tab.sessionId !== undefined) {
      // One attempt at a time: a second click while the attach is in flight
      // would open another socket for the same session and could report the
      // later outcome over the earlier one.
      if (closingRef.current.has(tabId)) return
      closingRef.current.add(tabId)
      const sessionId = tab.sessionId
      void (async () => {
        try {
          const gone = await api.closeTerminalSession(sessionId)
          if (gone) {
            controller.closeTerminalTab(tabId)
            return
          }
          // Not delivered: the session may still be running, so the tab stays
          // with its session id. Recovery is the same control (retry) or the
          // tab in front, whose own socket can end the shell for certain.
          controller.markTerminalCloseFailed(tabId, 'undelivered')
        } finally {
          closingRef.current.delete(tabId)
        }
      })()
      return
    }
    controller.closeTerminalTab(tabId)
```

</details>

**依据 17 · 源码核查**：[packages/dsh-ssh/src/client/panel/controller.ts:435-464](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/client/panel/controller.ts#L435-L464)

connecting ready时现读close/detach意图。

<details>
<summary>查看原文（30行）</summary>

```text
  adoptTerminalLink(tabId: string, connection: TerminalConnection, intent: TerminalLinkIntent): void {
    const entry = { connection, intent }
    this.adoptedLinks.set(tabId, entry)
    // Output that arrives while no view is bound still belongs to the tab, so it
    // goes into the retained screen: reclaiming the socket then replays the
    // whole adopt window instead of showing a gap. A tab that was closed in the
    // meantime stays closed — appending would recreate its retained entry and
    // hand a deleted tab a screen again.
    connection.onOutput = (data) => {
      if (this.terminalTab(tabId) === undefined) return
      this.appendTerminalOutput(tabId, data)
    }
    connection.onAuthPrompt = (name, instructions, prompts) => {
      if (this.terminalTab(tabId) === undefined) return
      this.setTerminalAuthPrompt(tabId, { name, instructions, prompts })
    }
    connection.onReady = (sessionId) => {
      // The intent is read now, not when the socket was adopted: closing the tab
      // while it connects retargets the entry to `close`, and a detach here
      // would leave a host PTY nobody owns.
      const decided = this.adoptedLinks.get(tabId)?.intent ?? entry.intent
      this.adoptedLinks.delete(tabId)
      this.readyTerminalTab(tabId, sessionId)
      if (decided === 'close') connection.close()
      else connection.detach()
    }
    connection.onExit = (_code, error) => {
      this.adoptedLinks.delete(tabId)
      this.failTerminalTab(tabId, error ?? 'connection closed')
    }
```

</details>

**依据 18 · 源码核查**：[packages/dsh-ssh/src/engine/tunnel.ts:84-111](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/tunnel.ts#L84-L111)

每socket实际forwardOut及拒绝不撤listener。

<details>
<summary>查看原文（28行）</summary>

```text
  const server = createServer((socket) => {
    sockets.add(socket)
    socket.on('close', () => { sockets.delete(socket) })
    // The link can die between taking the record above and this connection.
    if (record.broken) {
      destroyQuietly(socket)
      abortTunnel(engine, id)
      return
    }
    try {
      client.forwardOut('127.0.0.1', 0, remoteHost, options.remotePort, (error, stream) => {
        if (error !== undefined) {
          // A refused remote channel is the remote service's answer, not a
          // dead SSH link: the tunnel itself stays up for the next attempt.
          destroyQuietly(socket)
          return
        }
        // Both ends of the pipe can die independently; destroy the pair so an
        // unhandled 'error' event can never crash the host process.
        const destroy = (): void => {
          destroyQuietly(socket)
          try { stream.close() } catch { /* gone */ }
        }
        stream.on('error', destroy)
        socket.on('error', destroy)
        stream.on('close', destroy)
        socket.on('close', destroy)
        stream.pipe(socket).pipe(stream)
```

</details>

**依据 19 · 源码核查**：[packages/dsh-ssh/src/engine/tunnel.ts:121-151](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/tunnel.ts#L121-L151)

监听loopback/state及linkdeath门。

<details>
<summary>查看原文（31行）</summary>

```text
  try {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(options.localPort ?? 0, '127.0.0.1', () => {
        server.removeListener('error', reject)
        resolve()
      })
    })
  } catch (error) {
    // Roll back: never leave an unpinned orphan connection behind.
    if (!record.pinned && record.inFlight === 0) disposeRecord(engine, alias, record)
    throw error
  }
  record.pinned = true
  const address = server.address()
  info.localPort = typeof address === 'object' && address !== null ? address.port : 0
  info.state = 'forwarding'
  engine.tunnels.set(id, { info, server, alias, record, sockets, detachLink })
  // A dead link must not keep a listener alive: without this hook the tunnel
  // outlives its connection and every later local connection hits the dead
  // forwardOut path above.
  client.once('close', onLinkClosed)
  if (record.broken) {
    // A link that died while the listener was binding already emitted 'close',
    // so the pool's broken flag is the only signal left for that window. The
    // tunnel retires right away, and the start reports that instead of
    // handing the caller a forwarding tunnel that no longer exists.
    info.state = 'failed'
    info.error = 'ssh link closed while the tunnel was starting'
    abortTunnel(engine, id)
  }
```

</details>

**依据 20 · 源码核查**：[packages/dsh-ssh/src/engine/tunnel.ts:161-180](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/tunnel.ts#L161-L180)

stop清listener/socket并最后共享连接关闭。

<details>
<summary>查看原文（20行）</summary>

```text
export function stopTunnel(engine: TunnelEngine, id: string): boolean {
  const tunnel = engine.tunnels.get(id)
  if (tunnel === undefined) return false
  engine.tunnels.delete(id)
  // Drop the link-death hook first: a stop is never the link's death, and a
  // long-lived pooled client outlives many tunnels.
  try { tunnel.detachLink?.() } catch { /* already detached */ }
  try { tunnel.server.close() } catch { /* already closed */ }
  for (const socket of tunnel.sockets) {
    destroyQuietly(socket)
  }
  tunnel.sockets.clear()
  // Sibling tunnels on the same alias share the pinned connection: release it
  // only once the last tunnel using it is gone. A record the pool has since
  // replaced (e.g. after a broken-connection recycle) is ended directly.
  const shared = [...engine.tunnels.values()].some(candidate => candidate.record === tunnel.record)
  if (!shared) {
    if (engine.pool.get(tunnel.alias) === tunnel.record) disposeRecord(engine, tunnel.alias, tunnel.record)
    else endRecordChain(tunnel.record)
  }
```

</details>

**依据 21 · 源码核查**：[packages/dsh-ssh/src/engine/cluster.ts:21-59](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/cluster.ts#L21-L59)

selector/交集/最多8worker/逐host结果与无abort出队门。

<details>
<summary>查看原文（39行）</summary>

```text
export async function cluster(engine: PoolEngine, options: ClusterOptions): Promise<ClusterResult[]> {
  const hasAliases = Array.isArray(options.aliases) && options.aliases.some(alias => typeof alias === 'string' && alias.trim() !== '')
  const hasEnvironment = typeof options.environment === 'string' && options.environment.trim() !== ''
  const hasTags = Array.isArray(options.tags) && options.tags.some(tag => typeof tag === 'string' && tag.trim() !== '')
  if (!hasAliases && !hasEnvironment && !hasTags) {
    throw new Error('ssh_cluster requires aliases, environment, or tags to limit the target set')
  }

  let targets = engine.store.list()
  if (options.aliases !== undefined && options.aliases.length > 0) {
    targets = targets.filter(entry => options.aliases!.includes(entry.alias))
  }
  if (options.environment !== undefined && options.environment !== '') {
    targets = targets.filter(entry => entry.environment === options.environment)
  }
  if (options.tags !== undefined && options.tags.length > 0) {
    // ALL semantics (matches the ssh_cluster tool description).
    targets = targets.filter(entry => options.tags!.every(tag => entry.tags.includes(tag)))
  }
  if (targets.length === 0) return []
  if (options.maxWorkers !== undefined && (!Number.isInteger(options.maxWorkers) || options.maxWorkers < 1)) {
    throw new Error('maxWorkers must be a positive integer')
  }
  const workers = Math.min(engine.opts.defaultMaxWorkers, options.maxWorkers ?? engine.opts.defaultMaxWorkers, targets.length)
  const results: ClusterResult[] = []
  const queue = [...targets]
  const run = async (): Promise<void> => {
    while (queue.length > 0) {
      const entry = queue.shift()!
      try {
        const result = await execCommand(engine, entry.alias, options.command, options.timeoutMs, options.signal)
        results.push({ alias: entry.alias, ok: result.success, exitCode: result.exitCode, timedOut: result.timedOut, stdout: result.stdout, stderr: result.stderr, durationMs: result.durationMs })
      } catch (error) {
        results.push({ alias: entry.alias, ok: false, error: error instanceof Error ? error.message : String(error) })
      }
    }
  }
  await Promise.all(Array.from({ length: workers }, () => run()))
  return results
```

</details>

#### 缺口

- 未做断网、部分文件、PTY关闭送达、远端后台进程或集群取消实验。
  **影响**：不能承诺完成/关闭/回滚，关闭tab尤其不能当远端停止验收。
  **进一步探讨**：隔离主机验证不确定关闭、失败后文件hash/进程/listener以及多主机部分结果，保留独立OpenSSH读回。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 试用、持续、失败和退出需要什么责任与成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

首次需Node>=24.9.0和DSH>=0.2.2-rc.1，正确profile加载0.4.15及web客户端，另有SSH服务器、网络、受限凭据和用户能够核主机公钥的方案。安装包/握手未运行；不能沿用前稿旧Node/Host声明。仅GUI只读命令无需模型轮次，Agent工具另由Host模型/权限决定。建议独立可弃置DSH_HOME、临时低权限key/测试机，先禁forwardAgent/ProxyCommand/cluster与模型工具，只核alias、目标和一次人工审过的只读输出；硬要求known_hosts pin的用户先使用成熟SSH方案。

持续现金/资源有远端CPU/带宽/磁盘、本机连接和临时文件、终端缓冲及可选模型token，单价/总额未知；人工配置、核目标和失败对账分钟未知。断线重试可能重复、部分传输未恢复/续传，不能用GUI减少切换推净节时或经济结构创新。多个终端、隧道与cluster会放大远端资源和人工清理面。

浏览器client apply还实际调用daily heartbeat，向dsh-market.com传visitor随机本地id和包name，可附baked version；DNT、共享opt-out、webdriver和storage失败会阻止发送，日标记只在HTTP ok后写。README称只包名过窄，服务端盐化/不留IP是作者声明而非本轮服务器验证，不能把心跳请求当必要运维成本为零。

若不能核目标身份/Host准入，取消后状态未知或远端不是可丢弃环境，就停止并回OpenSSH/SFTP人工对账，不重放写操作。退出要逐个关terminal并独立确认远端进程、停隧道、核部分文件/临时数据与配置备份；enabled=false会卸路由/工具并dispose terminal，但同一engine池和隧道仅在插件总dispose才统一关，不能将开关撤面等于全部连接清零。删除host也不删除远端文件、作业或本机配置备份，卸载无法退还已用资源。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/package.json:1-10](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/package.json#L1-L10)

当前包/Node条件。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "@linxin666/dsh-ssh",
  "description": "Remote SSH operations for the dsh web GUI: host config store (~/.dsh/dsh-ssh.json, import from ~/.ssh/config), a persistent ssh2 connection pool with jump-host support, exec / PTY web terminal / SFTP transfer / local port-forward tunnels / cluster execution, plus agent tools (ssh_list, ssh_exec, ssh_upload, ssh_download, ssh_tunnel, ssh_cluster). Hot-pluggable — mounted via ~/.dsh/cordis.patch.yml + a profile node_modules symlink, no dsh source changes.",
  "version": "0.4.15",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": ">=24.9.0"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/package.json:27-62](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/package.json#L27-L62)

DSH和运行依赖。

<details>
<summary>查看原文（36行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json && tsdown",
    "bundle": "tsdown",
    "watch": "tsdown --watch",
    "typecheck": "tsgo --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.19.0",
    "@xterm/addon-fit": "^0.11.0",
    "@xterm/xterm": "^6.0.0",
    "ssh2": "^1.17.0",
    "ws": "^8.18.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/index.ts:149-151](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/index.ts#L149-L151)

引擎总effect释放。

```text
  const store = new HostStore()
  const engine = new SshEngine(store, { connectTimeoutMs: readConfigField(config?.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS) })
  ctx.effect(() => () => { engine.dispose() }, 'dsh-ssh: engine')
```

**依据 4 · 源码核查**：[packages/dsh-ssh/src/index.ts:189-239](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/index.ts#L189-L239)

enabled撤surface和terminal而非engine.dispose。

<details>
<summary>查看原文（51行）</summary>

```text
  const sync = (): void => {
    // A settings edit reaches this instance without a remount; apply the
    // connection ceiling before re-deriving the surfaces so connections opened
    // by the request that follows use the new value.
    engine.setConnectTimeout(readConfigField(config?.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS))
    const value = resolve()
    if (disposeSection !== undefined) {
      disposeSection()
      disposeSection = undefined
    }
    if (disposeRoutes !== undefined) {
      disposeRoutes()
      disposeRoutes = undefined
    }
    if (disposeTools !== undefined) {
      disposeTools()
      disposeTools = undefined
    }
    if (!value.enabled) return
    if (value.announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: 'plugin:dsh-ssh',
        order: SECTION_ORDER,
        // The announcement names the ssh_* tools, so it renders only while at
        // least one of them is reachable: a restriction that removes the tool
        // surface must take the guidance with it, instead of telling the model
        // to call tools this session cannot see.
        text: visibleToolText(ctx.tools, SSH_TOOL_NAMES, SSH_GUIDANCE),
      })
    }
    disposeRoutes = ctx.effect(
      () => {
        const disposers = routes.map(route => ctx.webServer.register(route))
        const upgradeDisposer = ctx.webServer.registerUpgrade(upgrade)
        return () => {
          for (const dispose of disposers) dispose()
          upgradeDisposer()
          // Dropping the routes also ends the terminal sessions they served:
          // a live shell must not outlive the surface that can reach it.
          terminalSessions.dispose()
        }
      },
      'dsh-ssh: routes',
    )
    disposeTools = ctx.effect(
      () => {
        const disposers = tools.map(tool => ctx.tools.register(tool))
        return () => { for (const dispose of disposers) dispose() }
      },
      'dsh-ssh: tools',
    )
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine.ts:180-185](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine.ts#L180-L185)

总dispose才遍历tunnel/pool。

```text
  /** Close every pooled connection and tunnel. */
  dispose(): void {
    if (this.sweepTimer !== undefined) clearInterval(this.sweepTimer)
    for (const id of [...this.tunnels.keys()]) stopTunnel(this, id)
    for (const alias of [...this.pool.keys()]) disposeRecord(this, alias)
  }
```

**依据 6 · 源码核查**：[packages/dsh-ssh/src/client/index.ts:75-77](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/client/index.ts#L75-L77)

客户端真实心跳调用。

```text
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-ssh' }])
```

**依据 7 · 源码核查**：[packages/dsh-ssh/src/client/telemetry.ts:29-34](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/client/telemetry.ts#L29-L34)

共享opt-out和目标endpoint。

```text
/** localStorage key carrying the family-wide telemetry opt-out ('1' = off). */
export const TELEMETRY_OPT_OUT_KEY = 'dsh-web-ui-telemetry-opt-out'

const VISITOR_KEY = 'dsh-web-ui-telemetry-visitor'
const DAY_KEY_PREFIX = 'dsh-web-ui-telemetry-day:'
const ENDPOINT = 'https://dsh-market.com/api/telemetry/event'
```

**依据 8 · 源码核查**：[packages/dsh-ssh/src/client/telemetry.ts:117-148](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/client/telemetry.ts#L117-L148)

DNT/自动化/storage、payload含版本与HTTP ok后日去重。

<details>
<summary>查看原文（32行）</summary>

```text
export function reportDailyHeartbeat(items: readonly TelemetryItem[]): void {
  try {
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
```

</details>

**依据 9 · 作者声明**：[packages/dsh-ssh/README.md:87-101](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/README.md#L87-L101)

作者恢复/平台限制与心跳声明，非运行验证。

<details>
<summary>查看原文（15行）</summary>

```text
## Known limitations

- The remote target path of an upload must be an absolute path (relative paths are rejected).
- Download does not support a whole directory yet (download files individually); upload supports recursive directories (walks the local directory and transfers file by file).
- exec auto-reconnect on disconnect (up to 3 times) may re-execute non-idempotent commands — watch out for side effects on long commands.
- A ProxyJump hop is either a host alias configured in this plugin or an OpenSSH `[user@]host[:port]` address; an address hop has no stored credentials, so it reuses the target host's authentication (configure a host entry when the hop needs its own).
- `proxyCommand` and `proxyJump` cannot be combined on one host (OpenSSH resolves them by "whichever appears first in the config"; a stored entry has no order, so the plugin rejects the pair), and only the first hop of a chain may declare a ProxyCommand.
- A ProxyCommand is executed through the user's shell, so it inherits the DSH process's `PATH` and environment. On Windows the shell is killed without its process group, so a client it spawned may outlive the transport.
- The ssh_config import expands `Include` (globs, `~`, several pathnames, relative to the config directory) but not environment variables or `%` tokens, and a multi-pattern `Host a b` line still imports only its first pattern.
- Resume (broken-transfer continuation) is not implemented yet.
- The transfer of Agent tools is a host-machine local path (same semantics as ssh-skill).

## Telemetry

The browser half sends one anonymous install heartbeat per UTC day to dsh-market.com: a random localStorage id plus this package's name, nothing else. The server stores only a salted hash of that id, never IP addresses, and exposes aggregate counts only. See [docs/telemetry.md](../../docs/telemetry.md) for the full contract.
```

</details>

#### 缺口

- 没有同任务费用/人时对照、完整退出与远端恢复数据，心跳服务端未审。
  **影响**：不能保证净收益或停用后资源已释放。
  **进一步探讨**：未来另授权隔离试用记录读回、恢复分钟、连接/进程/文件残留与心跳网络，比较成熟SSH基线。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 已有贡献与目标身份/作业对账候选如何区分？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

已有贡献是GUI与工具共用真实连接引擎、可重新附着Host PTY、受筛选的并发执行与共享tunnel record清理，提供DSH内具体接缝；ssh2、SSH/SFTP/Git式工具及OS权限都是继承能力，不是新远端协议。相对OpenSSH脚本和终端可解释复用便利，未改变服务供给/收费、运维责任归属或此前受限人群。

关键质疑是“本机可调用/已配置alias/发送close”分别不证明目标身份、逐次授权、远端结束。候选可将主机公钥、配置版本、操作批准与远端可查询job ID冻结，再对断线/取消结果标unknown并先对账；关闭另需Host已处理及必要远端读回。当前实现没有此闭环，不能计已有创新或把多一步确认当安全证明。

先与OpenSSH known_hosts+作业ID/日志及简单修复池signal/关闭ACK比较。在隔离机中重配alias、连接断开、cancel前后、后台作业和重复写计数，记录错误目标/重复副作用、unknown持续时间和恢复负担；若标准工具组合已等价，远端job不可可靠查、批准与目标仍可漂移，或确认增加工作多于减少错误，就放弃新插件方向。未做原型或实验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/index.ts:148-179](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/index.ts#L148-L179)

既有共享GUI/工具接缝。

<details>
<summary>查看原文（32行）</summary>

```text
function applyImpl(ctx: Context, config?: ResolvedConfig): void {
  const store = new HostStore()
  const engine = new SshEngine(store, { connectTimeoutMs: readConfigField(config?.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS) })
  ctx.effect(() => () => { engine.dispose() }, 'dsh-ssh: engine')

  const resolve = (): { announceToAgent: boolean; enabled: boolean } => {
    let enabled = readConfigField(config?.enabled, DEFAULT_ENABLED)
    // When dsh-ssh was seeded with enabled: false (e.g. from an aggregate profile
    // line), but the profile's own entry config never set the switch AND the user
    // already has active host records in dsh-ssh.json, keep the plugin enabled so
    // existing users are not broken upon upgrade (#1250).
    if (enabled === false && profileConfig(ctx)?.enabled === undefined && store.list().length > 0) {
      enabled = true
    }
    return {
      announceToAgent: readConfigField(config?.announceToAgent, DEFAULT_ANNOUNCE),
      enabled,
    }
  }

  // The /api/dsh-ssh route family + terminal upgrade.
  const { routes, upgrade, terminalSessions } = makeRoutes({ store, engine })
  let disposeRoutes: (() => void) | undefined

  // Agent tools + their prompt sections.
  const tools = [
    sshListTool(engine),
    sshExecTool(engine),
    sshUploadTool(engine),
    sshDownloadTool(engine),
    sshTunnelTool(engine),
    sshClusterTool(engine),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/terminal-sessions.ts:113-128](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/terminal-sessions.ts#L113-L128)

既有attach/replay局部机制。

<details>
<summary>查看原文（16行）</summary>

```text
  attach(ws: WebSocket, sessionId: string, size: { cols: number; rows: number }): boolean {
    const session = this.sessions.get(sessionId)
    if (session === undefined) return false
    this.bind(ws, session)
    this.clearReap(session)
    for (const chunk of session.buffer) this.sendTo(session, ws, { type: 'output', data: chunk })
    this.sendTo(session, ws, { type: 'ready', alias: session.alias, sessionId: session.id })
    if (session.exited) {
      this.sendTo(session, ws, { type: 'exit', code: session.exit?.code ?? null, error: session.exit?.error })
      // Re-arm the grace window: this socket now holds the exited session open.
      this.scheduleReap(session, this.exitGraceMs)
    } else {
      session.shell?.resize(Math.max(2, size.cols), Math.max(1, size.rows))
      session.shell?.resume()
    }
    return true
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:493-523](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/connection-pool.ts#L493-L523)

断线重放与取消条件为候选依据。

<details>
<summary>查看原文（31行）</summary>

```text
export async function withClient<T>(engine: PoolEngine, alias: string, fn: (client: Client) => Promise<T>, attempts = 3, signal?: AbortSignal): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let record = engine.pool.get(alias)
    if (record === undefined || record.broken) {
      if (record !== undefined) disposeRecord(engine, alias, record)
      record = await acquire(engine, alias)
    }
    record.idleAt = Date.now()
    record.inFlight += 1
    try {
      const result = await fn(record.client)
      record.idleAt = Date.now()
      return result
    } catch (error) {
      lastError = error
      // A cancelled call is never replayed: the caller asked for it to stop,
      // and a retry would re-run a command that may not be idempotent.
      if (signal?.aborted === true) throw error
      // Retry only when the connection actually broke mid-flight: drop the
      // corpse and let the next attempt reconnect (a reconnect may replay a
      // non-idempotent command — the documented trade-off). A failure on a
      // healthy connection is a logic error and is rethrown, not replayed.
      if (!record.broken) throw error
      disposeRecord(engine, alias, record)
    } finally {
      record.inFlight -= 1
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/client/api.ts:549-572](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/client/api.ts#L549-L572)

send与回执缺口为候选依据。

<details>
<summary>查看原文（24行）</summary>

```text
      timer = setTimeout(() => { finish(false) }, timeoutMs)
      socket.onopen = () => {
        const closeFrame: TerminalClientFrame = { type: 'close' }
        try {
          socket.send(JSON.stringify(closeFrame))
          finish(true)
        } catch {
          // The frame never left, which proves nothing either way: wait for the
          // host's own answer (an exit frame for an id that no longer exists),
          // for the socket to fail, or for the bounded wait to expire.
        }
      }
      socket.onmessage = (event: MessageEvent<string>) => {
        let frame: TerminalServerFrame
        try {
          frame = JSON.parse(event.data) as TerminalServerFrame
        } catch {
          return
        }
        // Exit (expired id or an ended shell) means there is nothing left to end.
        if (frame.type === 'exit') finish(true)
      }
      socket.onerror = () => { finish(false) }
      socket.onclose = () => { finish(false) }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/cluster.ts:29-59](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-ssh/src/engine/cluster.ts#L29-L59)

已有筛选并发与逐host结果，非作业对账。

<details>
<summary>查看原文（31行）</summary>

```text
  let targets = engine.store.list()
  if (options.aliases !== undefined && options.aliases.length > 0) {
    targets = targets.filter(entry => options.aliases!.includes(entry.alias))
  }
  if (options.environment !== undefined && options.environment !== '') {
    targets = targets.filter(entry => entry.environment === options.environment)
  }
  if (options.tags !== undefined && options.tags.length > 0) {
    // ALL semantics (matches the ssh_cluster tool description).
    targets = targets.filter(entry => options.tags!.every(tag => entry.tags.includes(tag)))
  }
  if (targets.length === 0) return []
  if (options.maxWorkers !== undefined && (!Number.isInteger(options.maxWorkers) || options.maxWorkers < 1)) {
    throw new Error('maxWorkers must be a positive integer')
  }
  const workers = Math.min(engine.opts.defaultMaxWorkers, options.maxWorkers ?? engine.opts.defaultMaxWorkers, targets.length)
  const results: ClusterResult[] = []
  const queue = [...targets]
  const run = async (): Promise<void> => {
    while (queue.length > 0) {
      const entry = queue.shift()!
      try {
        const result = await execCommand(engine, entry.alias, options.command, options.timeoutMs, options.signal)
        results.push({ alias: entry.alias, ok: result.success, exitCode: result.exitCode, timedOut: result.timedOut, stdout: result.stdout, stderr: result.stderr, durationMs: result.durationMs })
      } catch (error) {
        results.push({ alias: entry.alias, ok: false, error: error instanceof Error ? error.message : String(error) })
      }
    }
  }
  await Promise.all(Array.from({ length: workers }, () => run()))
  return results
```

</details>

#### 缺口

- 身份/批准/作业对账方案无原型、远端契约及替代对照。
  **影响**：不能证明比known_hosts和简单修补更必要或减少副作用。
  **进一步探讨**：先按断线/重配/关闭矩阵比较现有工具与最小原型，明确重复和恢复指标及推翻条件。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
