# dsh-IDE

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[df62364](https://github.com/chenw2759-wq/dsh-IDE/tree/df62364bc386777edebcab96b55afa711271a0b0)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chenw2759-wq/dsh-IDE)
<!-- END META -->

> **功能**：提供 DSH Web 工作区面板、SSH 运维和远程工作区三个插件的源码套件。

> **亮点**：面板在 DSH Web 集中浏览和审查，EasySSH 通过模式门面让原生模型工具可以选择远端后端。见 [Q02](#research-q02)。

> **主要限制**：面板查 sshWorkspaceCore，EasySSH 提供 easysshCore，源码未见桥接。浏览器按 Session 记忆，宿主模式仍是实例全局。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 根仓库交付什么，如何组成 DSH Web 工作区？](#detail-section-11)
  - [Q02 · 面板、代理工具和命令如何选择本地或 SSH？](#detail-section-12)
  - [Q03 · 会话隔离、路径、连接和恢复边界在哪里？](#detail-section-13)
  - [Q04 · 怎样观察本地面板与 SSH 组合是否适用？](#detail-section-14)
  - [Q05 · 怎样验证统一工作区能减少跨工具切换？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 聊天旁浏览项目文件和 Git 变更，或从同一界面组织 SSH 远程开发。见 [Q01](#research-q01)。

DSH 配合独立编辑器和 SSH 客户端已有文件、命令和 Git 操作。套件尝试将入口放到同一 Web 会话，仍需核对每条链路实际目标。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 面板子包 | 在 DSH 浏览项目文件、预览和 Git | 远程委派需对应核心服务 |
| SSH 子包 | 命令、终端与文件操作 | 远端权限和结果需复核 |
| EasySSH 子包 | 在原生工具之间切换后端 | 宿主单一模式，需验并行目标 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与对应宿主服务 | 子包加载需要 | 主机路由、插槽和工具 | 核对 profile 接线 |
| 分别构建的私有包 | 对应能力需要 | 按组件装入 Web profile | 根目录不能替代子包 |
| 可控 SSH 账户和环境 | SSH 组合需要 | 连接和远端执行 | 保持本地模式 |
| 兼容的面板远端核心 | 面板远端路径需要 | 面板查模式并委派 | 分开验收面板和工具 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户固定组件和隔离 profile | 确认加载三项所需子包 |
| 2 | 用工作区副本先读写本地文件 | 校验 Git、冲突与退出 |
| 3 | 用测试账户比较面板、Agent 和命令 | 核对实际主机及目录 |
| 4 | 用户恢复原 profile | 复核本地服务和远端结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 构建依赖和 SSH 主机资源，金额未知 | 核对三个工件和宿主版本 | 尚无实际耗时 |
| 持续 | 网络、SSH 账户和远程资源 | 版本、凭据与目标复核 | 并行错配未测 |
| 失败恢复 | 工作区副本和隔离环境 | 核对不明操作和恢复文件 | 断线结果与删除恢复待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 本地工作区 | 文件、预览与 Git 服务分组 | 实际宿主交互与节省 |
| 远程工具 | 文件和进程门面委派 | 和面板同步及并发目标隔离 |
| 运维 | 独立 SSH 命令、终端及文件入口 | 异常恢复和访问控制 |

> **思考**：面板查 sshWorkspaceCore，EasySSH 提供 easysshCore，源码未见桥接。浏览器按 Session 记忆，宿主模式仍是实例全局。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：面板在 DSH Web 集中浏览和审查，EasySSH 通过模式门面让原生模型工具可以选择远端后端。见 [Q02](#research-q02)。

面板、SSH 引擎和模式门面边界清楚，但服务名不同且模式全局。文件与命令权限分支也需要分别验证。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

面板查 sshWorkspaceCore，EasySSH 提供 easysshCore，源码未见桥接。浏览器按 Session 记忆，宿主模式仍是实例全局。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议先观察个人隔离 profile 的本地面板，SSH 组合须核对服务桥接和所有入口的实际目标。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持三个子包及 Agent 门面设计，且发现面板服务名与 EasySSH 提供名不一致。真实组合、并行隔离、授权及收益待验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/dsh-aionui-panel/cordis.patch.yml、packages/dsh-aionui-panel/package.json、packages/dsh-aionui-panel/src/host/fs-service.ts、packages/dsh-aionui-panel/src/host/gate.ts、packages/dsh-aionui-panel/src/host/routes.ts、packages/dsh-aionui-panel/src/index.ts、packages/dsh-easyssh/cordis.patch.yml、packages/dsh-easyssh/package.json、packages/dsh-easyssh/src/client/session-memory.ts、packages/dsh-easyssh/src/client/state.ts、packages/dsh-easyssh/src/fs.ts、packages/dsh-easyssh/src/index.ts、packages/dsh-easyssh/src/routes.ts、packages/dsh-easyssh/src/store.ts、packages/dsh-easyssh/src/subprocess.ts、packages/dsh-easyssh/src/switch/switch-fs.ts、packages/dsh-easyssh/src/switch/switch-subprocess.ts、packages/dsh-ssh/cordis.patch.yml、packages/dsh-ssh/package.json、packages/dsh-ssh/src/engine.ts、packages/dsh-ssh/src/routes.ts、packages/dsh-ssh/src/store.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根资源研究覆盖三个子包的实际安装和代表性链路，未穷举所有编辑器、预览器和传输能力。未执行目标、测试、宿主或 SSH。
- 下一步：隔离 profile 和测试账户，以本地和远端标记验证文件、命令和工具；再测并行会话、路径拒绝及退出。

**分析版本**

- **仓库**：[chenw2759-wq/dsh-IDE](https://github.com/chenw2759-wq/dsh-IDE)
- **版本号**：0.2.0（[固定提交 df62364](https://github.com/chenw2759-wq/dsh-IDE/tree/df62364bc386777edebcab96b55afa711271a0b0)）
- **版本日期**：2026-09-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

集中入口可能减少同一改动在聊天、文件和终端之间的切换。试验须区分本地与 SSH，并把正确目标及可复核结果作为门槛。见 [Q05](#research-q05)。

隔离 profile 和测试账户，以本地和远端标记验证文件、命令和工具；再测并行会话、路径拒绝及退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 976 | — | — | 15990 |
| .ts | source | 67 | 14838 | 11520 | 2482 | — |
| .tsx | source | 30 | 7336 | 6185 | 758 | — |
| .ts | test | 24 | 3330 | 2780 | 275 | — |
| .tsx | test | 1 | 138 | 107 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/chenw2759-wq/dsh-IDE/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/chenw2759-wq/dsh-IDE/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/chenw2759-wq/dsh-IDE/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用 DSH 做本地和 SSH 开发时，仓库里的三份插件怎样安装和协作，用户怎样核对面板、Agent 和命令实际落到同一目标？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根仓库交付什么，如何组成 DSH Web 工作区？

**研究主题**：场景与需求、依赖、兼容与流程、功能与机制

#### 完整回答

已有 DSH Web、要在聊天旁核查文件与变更或操作隔离 SSH 环境的开发者，是此源码套件的目标人群。根 package.json 虽叫 dsh-easyssh、版本为 0.2.0，却是 private 的构建工作区，只有递归脚本，未声明 DSH bundle 或主机和客户端导出。三个 private 子包各自有导出和 DSH patch。面板包 @deepseek-ai/dsh-client-ui-aionui-panel 0.2.0 提供工作区文件、预览和 Git 路由，@deepseek-ai/dsh-ssh 0.1.1 提供 SSH 引擎、Web 工具与操作入口，dsh-easyssh 0.1.0 提供模式管理、远端工具和替换宿主文件系统及子进程的接缝。作者步骤要求分别构建并以三个子目录添加到 Web profile，重启。根版本、子包版本及宿主版本需分别追踪。只需要本地文件视图时可研究独立面板，不应按根名去寻找单件 npm 安装。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/package.json#L1-L16)

私有根工作区和递归脚本。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-easyssh",
  "version": "0.2.0",
  "private": true,
  "description": "DSH 远程 SSH 工作区插件：本地大脑、远程手脚（接缝切换 + Web GUI 前端）",
  "packageManager": "pnpm@11.7.0",
  "scripts": {
    "build": "pnpm -r build",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "lightningcss": "^1.32.0"
  },
  "license": "BSD-3-Clause"
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-aionui-panel/package.json:2-30](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/package.json#L2-L30)

面板包版本、导出与 Web bundle。

<details>
<summary>查看原文（29行）</summary>

```text
  "name": "@deepseek-ai/dsh-client-ui-aionui-panel",
  "description": "DSH web GUI right-panel system: a pixel-faithful re-implementation of AionUi's Explorer + Preview columns (file tree, filename search, git changes, multi-tab preview of 10+ formats) driven by real host-side fs/git services, hot-pluggable via a profile bundle without any dsh source changes",
  "version": "0.2.0",
  "private": true,
  "type": "module",
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
    },
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
```

</details>

**依据 3 · 源码核查**：[packages/dsh-easyssh/package.json:2-51](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/package.json#L2-L51)

EasySSH 包与多入口。

<details>
<summary>查看原文（50行）</summary>

```text
    "name":  "dsh-easyssh",
    "description":  "SSH remote workspace for the dsh web GUI: enter SSH mode from the session header (left of session log), browse/edit remote files in a new left panel, and let the local harness operate the remote server through remote_* agent tools. Reuses the dsh-ssh engine, host store, and loopback trust fence.",
    "version":  "0.1.0",
    "private":  true,
    "type":  "module",
    "keywords":  [
                     "dsh",
                     "deepseek-harness",
                     "dsh-plugin",
                     "ssh",
                     "remote-development",
                     "sftp"
                 ],
    "packageManager":  "pnpm@11.7.0",
    "engines":  {
                    "node":  "^22.19.0 || \u003e=24.0.0"
                },
    "main":  "lib/index.js",
    "types":  "lib/types/index.d.ts",
    "exports":  {
                    ".":  {
                              "types":  "./lib/types/index.d.ts",
                              "default":  "./lib/index.js"
                          },
                    "./fs":  {
                                 "types":  "./lib/types/fs.d.ts",
                                 "default":  "./lib/fs.js"
                             },
                    "./subprocess":  {
                                         "types":  "./lib/types/subprocess.d.ts",
                                         "default":  "./lib/subprocess.js"
                                     },
                    "./client":  {
                                     "types":  "./lib/types/client/index.d.ts",
                                     "default":  "./lib/client.js"
                                 },
                    "./src/*":  "./src/*",
                    "./package.json":  "./package.json"
                },
    "dsh":  {
                "bundle":  {
                               "patch":  "./cordis.patch.yml"
                           },
                "client":  {
                               "inject":  [
                                              "@deepseek-ai/dsh-client-runtime",
                                              "@deepseek-ai/dsh-client-connection",
                                              "@deepseek-ai/dsh-client-ui-settings"
                                          ],
                               "platform":  "web"
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/package.json:2-39](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-ssh/package.json#L2-L39)

SSH 引擎包版本与导出。

<details>
<summary>查看原文（38行）</summary>

```text
    "name":  "@deepseek-ai/dsh-ssh",
    "description":  "Remote SSH operations for the dsh web GUI: host config store (~/.dsh/dsh-ssh.json, import from ~/.ssh/config), a persistent ssh2 connection pool with jump-host support, exec / PTY web terminal / SFTP transfer / local port-forward tunnels / cluster execution, plus agent tools (ssh_list, ssh_exec, ssh_upload, ssh_download, ssh_tunnel, ssh_cluster). Hot-pluggable 鈥?mounted via ~/.dsh/cordis.patch.yml + a profile node_modules symlink, no dsh source changes.",
    "version":  "0.1.1",
    "private":  true,
    "type":  "module",
    "packageManager":  "pnpm@11.7.0",
    "engines":  {
                    "node":  "^22.19.0 || \u003e=24.0.0"
                },
    "main":  "lib/index.js",
    "types":  "lib/types/index.d.ts",
    "exports":  {
                    ".":  {
                              "types":  "./lib/types/index.d.ts",
                              "default":  "./lib/index.js"
                          },
                    "./invariant":  {
                                        "types":  "./lib/types/invariant.d.ts",
                                        "default":  "./lib/invariant.js"
                                    },
                    "./client":  {
                                     "types":  "./lib/types/client/index.d.ts",
                                     "default":  "./lib/client.js"
                                 },
                    "./src/*":  "./src/*",
                    "./package.json":  "./package.json"
                },
    "dsh":  {
                "bundle":  {
                               "patch":  "./cordis.patch.yml"
                           },
                "client":  {
                               "inject":  [
                                              "@deepseek-ai/dsh-client-runtime",
                                              "@deepseek-ai/dsh-client-connection",
                                              "@deepseek-ai/dsh-client-ui-settings"
                                          ],
                               "platform":  "web"
```

</details>

**依据 5 · 源码核查**：[packages/dsh-aionui-panel/cordis.patch.yml:6-13](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/cordis.patch.yml#L6-L13)

面板插件行。

```text
# The row is a bare plugin by package name: the node half (exports ".") runs
# in the host process (workspace-gated fs/git services + /aionui-panel routes),
# and the `dsh.client` declaration in package.json makes the browser half
# (exports "./client", served at /plugins/ui-dsh-aionui-panel/client.js) load
# in the web GUI.
- insert:
    - id: ui-dsh-aionui-panel
      name: '@deepseek-ai/dsh-client-ui-aionui-panel'
```

**依据 6 · 源码核查**：[packages/dsh-easyssh/cordis.patch.yml:11-26](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/cordis.patch.yml#L11-L26)

EasySSH 和两个切换门面的行。

<details>
<summary>查看原文（16行）</summary>

```text
- insert:
    - id: easyssh
      name: 'dsh-easyssh'

- id: fs-sandbox
  disabled: true

- id: subprocess
  disabled: true

- insert:
    - id: easyssh-fs
      name: 'dsh-easyssh/fs'

    - id: easyssh-subprocess
      name: 'dsh-easyssh/subprocess'
```

</details>

**依据 7 · 源码核查**：[packages/dsh-ssh/cordis.patch.yml:6-12](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-ssh/cordis.patch.yml#L6-L12)

SSH 插件行。

```text
# The row is a bare plugin by package name: the node half (exports ".") runs
# in the host process (SSH engine, /api/dsh-ssh routes, agent tools), and the
# `dsh.client` declaration in package.json makes the browser half
# (exports "./client", served at /plugins/<id>/client.js) load in the web GUI.
- insert:
    - id: ssh
      name: '@deepseek-ai/dsh-ssh'
```

**依据 8 · 作者声明**：[README.md:196-230](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/README.md#L196-L230)

作者的仓库角色与分别构建和安装步骤。

<details>
<summary>查看原文（35行）</summary>

````text
## 仓库结构

```
dsh-IDE/
├── packages/
│   ├── dsh-aionui-panel/ # 右侧面板系统：文件树/预览/终端/编辑 diff/类型色标签（IDE 工作区本体）
│   ├── dsh-ssh/          # SSH 引擎：ssh2 连接池、exec/PTY/SFTP/隧道/集群（SSH 远程模式依赖）
│   └── dsh-easyssh/      # SSH 远程工作区：模式状态机、接缝门面、远程实现、Web GUI 前端
└── README.md
```

> 右侧文件面板（文件树 / 预览 / 终端 / 右键菜单 / 编辑 diff）由 **dsh-aionui-panel**（DSH Web GUI 右侧
> 面板系统）提供，本仓库内与 dsh-IDE 配套维护；dsh-easyssh 通过 `sshWorkspaceMode` 跨插件服务驱动它
> 跟随 SSH 模式。SSH 远程开发只是 dsh-IDE 的能力之一——本地目录同样享受完整的 IDE 工作区。

## 安装

前置要求：Node.js ≥ 22、pnpm、已安装 dsh（`npx @deepseek-ai/dsh`）。

```sh
# 1) 克隆并构建
git clone https://github.com/chenw2759-wq/dsh-IDE.git
cd dsh-IDE
pnpm install
pnpm --filter "./packages/dsh-aionui-panel" build
pnpm --filter "./packages/dsh-ssh" build
pnpm --filter "./packages/dsh-easyssh" build

# 2) 把三个包安装到 web profile（注意用你自己的绝对路径）
dsh plugin --profile web add file:C:/你的路径/dsh-IDE/packages/dsh-aionui-panel
dsh plugin --profile web add file:C:/你的路径/dsh-IDE/packages/dsh-ssh
dsh plugin --profile web add file:C:/你的路径/dsh-IDE/packages/dsh-easyssh
```

> 仓库品牌为 dsh-IDE；核心插件包名沿用 `dsh-easyssh`（安装标识，不随品牌改名）。
````

</details>

#### 缺口

- 未构建子包，未验证真实宿主包解析和原生依赖安装。
  **影响**：根目录不能当作已可安装的独立 DSH 插件。
  **进一步探讨**：固定宿主与子包工件，在隔离 Web profile 检查每行加载和本地模式。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 面板、代理工具和命令如何选择本地或 SSH？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

EasySSH patch 禁用原配置里的 fs-sandbox 和 subprocess 行，插入自己的两个切换门面。门面从 easysshCore 的模式快照选后端，本地由隔离 scope 的 SandboxedFileSystem 和 LocalSubprocessRuntime 处理，远端使用 SSH 文件与进程实现。相比使用一次性 ssh_exec，现有模型工具可经同一服务接口进入远端分支。面板的本地文件和 Git 则走独立 /aionui-panel 路由。面板宿主从 ctx.get 读取 sshWorkspaceCore，远端文件只在其模式为 remote 且请求 root 等于 remoteRoot 时委派。固定仓库的 EasySSH 提供键是 easysshCore，源码检索未找到把该键桥接到 sshWorkspaceCore 的注册。只安装这三份源码不能用 Agent 接缝成立推断面板也能自动切换，需要宿主另有同名服务或补齐接线。面板自己的执行分支也读同一个可选服务，但本地路径仍调用 ctx.subprocess，此服务可能已被全局门面切换。面板文件、面板命令与 Agent 工具可能在不同执行侧。即使进入远程面板文件分支，Git 状态路由显式退化为空。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-easyssh/cordis.patch.yml:11-26](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/cordis.patch.yml#L11-L26)

关闭旧服务行并添加两份门面。

<details>
<summary>查看原文（16行）</summary>

```text
- insert:
    - id: easyssh
      name: 'dsh-easyssh'

- id: fs-sandbox
  disabled: true

- id: subprocess
  disabled: true

- insert:
    - id: easyssh-fs
      name: 'dsh-easyssh/fs'

    - id: easyssh-subprocess
      name: 'dsh-easyssh/subprocess'
```

</details>

**依据 2 · 源码核查**：[packages/dsh-easyssh/src/index.ts:60-94](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/index.ts#L60-L94)

宿主提供 easysshCore 和远端工具。

<details>
<summary>查看原文（35行）</summary>

```text
export function apply(ctx: Context, config?: Config): void {
  const resolved = {
    enabled: config?.enabled ?? true,
    announceToAgent: config?.announceToAgent ?? true,
  }

  const store = new RemoteModeStore()
  const hosts = new HostStore()
  const engine = new SshEngine(hosts)
  ctx.effect(() => () => {
    engine.dispose()
  }, 'dsh-easyssh: engine')

  // The shared core is ALWAYS provided: the seam-switch rows (./fs,
  // ./subprocess) inject it, and they replace the deployment's fs/subprocess
  // providers — starving them would break the model's file tools.
  const core: EasysshCore = { store, hosts, engine }
  ctx.provide('easysshCore', core)

  if (!resolved.enabled) return

  const routes = makeRoutes({ store, hosts, engine })
  // webServer is optional (headless profiles lack it): dynamic inject keeps
  // this plugin loadable everywhere, mounting routes only when it appears.
  // The inject callback receives a scoped Context with the service available.
  ctx.inject(['webServer'], (scoped) => {
    const disposers = routes.map(route => scoped.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
  })

  const tools = makeWorkspaceTools({ store, engine })
  ctx.effect(() => {
    const disposers = tools.map(tool => ctx.tools.register(tool))
```

</details>

**依据 3 · 源码核查**：[packages/dsh-easyssh/src/fs.ts:31-57](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/fs.ts#L31-L57)

本地沙箱与远端文件系统门面。

<details>
<summary>查看原文（27行）</summary>

```text
 * sandbox policy the local backend (`SandboxedFileSystem`) consumes. */
export const inject = ['easysshCore', 'sandboxPolicy']

/** Mount the switching filesystem facade. */
export function apply(ctx: Context): void {
  const core = ctx.easysshCore

  // The local backend lives in an isolated scope: its `fs` provide shadows
  // only below this scope, so consumers keep resolving our facade. Construct
  // the service directly (synchronous) and keep the instance — `ctx.plugin()`
  // only schedules an async fiber and does not make `localCtx.fs` readable here.
  const localCtx = ctx.isolate('fs')
  const localFs = new SandboxedFileSystem(localCtx, {
    cwd: process.env.DSH_CWD ?? process.cwd(),
    diffBasisMaxBytes: 10 * 1024 * 1024,
  })

  // The remote backend also needs a scope of its own: constructing it on the
  // row context would register a second `fs` provide here.
  const remoteCtx = ctx.isolate('fs')

  new SwitchFileSystem(ctx, {
    local: localFs,
    remote: new SshFileSystem(remoteCtx, core.engine, () => core.store.getSnapshot()),
    getState: () => core.store.getSnapshot(),
  })
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-easyssh/src/subprocess.ts:30-49](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/subprocess.ts#L30-L49)

本地进程与远端门面构造。

<details>
<summary>查看原文（20行）</summary>

```text
export const inject = ['easysshCore']

/** Mount the switching subprocess facade. */
export function apply(ctx: Context): void {
  const core = ctx.easysshCore

  // Local runtime in an isolated scope (its `subprocess` provide shadows only
  // below this scope). Construct directly and keep the instance.
  const localCtx = ctx.isolate('subprocess')
  const localSubprocess = new LocalSubprocessRuntime(localCtx)

  // Remote runtime in another isolated scope (no second provide here).
  const remoteCtx = ctx.isolate('subprocess')

  new SwitchSubprocessRuntime(ctx, {
    local: localSubprocess,
    remote: new SshSubprocessRuntime(remoteCtx, core.engine, () => core.store.getSnapshot()),
    getState: () => core.store.getSnapshot(),
  })
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-easyssh/src/switch/switch-fs.ts:36-68](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/switch/switch-fs.ts#L36-L68)

按当时模式决定文件后端。

<details>
<summary>查看原文（33行）</summary>

```text
export class SwitchFileSystem extends FileSystem {
  constructor(ctx: Context, private readonly deps: SwitchFsDeps) {
    super(ctx)
  }

  /** The active backend for the current mode. */
  private delegate(): FileSystem {
    return this.deps.getState().mode === 'remote' ? this.deps.remote : this.deps.local
  }

  /**
   * The capability fact the tool layer reads: the local backend's sandbox
   * default in local mode; no confinement in remote mode (remote execution
   * cannot be fenced by the local sandbox).
   */
  override get sandboxMode(): SandboxMode | undefined {
    return this.deps.getState().mode === 'remote' ? undefined : this.deps.local.sandboxMode
  }

  override resolve(path: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<FsTarget> {
    return this.delegate().resolve(path, opts)
  }

  override processPath(target: FsTarget): string {
    return this.delegate().processPath(target)
  }

  override fileUrl(target: FsTarget): string {
    return this.delegate().fileUrl(target)
  }

  override contains(parent: FsTarget, child: FsTarget): boolean {
    return this.delegate().contains(parent, child)
```

</details>

**依据 6 · 源码核查**：[packages/dsh-easyssh/src/switch/switch-subprocess.ts:33-58](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/switch/switch-subprocess.ts#L33-L58)

按模式选进程后端。

<details>
<summary>查看原文（26行）</summary>

```text
    super(ctx)
  }

  /** The active backend for the current mode. */
  private delegate(): SubprocessRuntime {
    return this.deps.getState().mode === 'remote' ? this.deps.remote : this.deps.local
  }

  /** @inheritdoc */
  resolveExecutable(
    command: string,
    env?: Readonly<Record<string, string>>,
    signal?: AbortSignal,
  ): Promise<string> {
    return this.delegate().resolveExecutable(command, env, signal)
  }

  /** @inheritdoc */
  spawn(spec: SubprocessSpawnSpec): SubprocessHandle {
    return this.delegate().spawn(spec)
  }

  /** @inheritdoc */
  spawnTerminal(spec: SubprocessTerminalSpawnSpec): Promise<SubprocessTerminalHandle> {
    return this.delegate().spawnTerminal(spec)
  }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-aionui-panel/src/index.ts:51-105](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/index.ts#L51-L105)

面板读取不同服务名，本地命令走 ctx.subprocess。

<details>
<summary>查看原文（55行）</summary>

```text
export function apply(ctx: Context): void {
  const gate = createWorkspaceGate(ctx)
  // Dynamic getter: the workspace plugin may load before or after this one;
  // the core is re-read on every operation, so SSH delegation always sees
  // the current mode without a hard cross-plugin inject.
  const getRemote = (): SshCoreLike | undefined => ctx.get('sshWorkspaceCore') as SshCoreLike | undefined
  const fs = new FsService(gate, getRemote)
  const git = new GitService(subprocessRunner(ctx), gate, (root, rel) => fs.delete(root, rel))

  // Command-run seam: remote mode rides the SSH engine; local mode uses the
  // managed subprocess seam (same as the git runner).
  const exec: ExecSeam = {
    async run(command, cwd, timeoutMs) {
      const remote = getRemote()
      const state = remote?.store.getSnapshot()
      if (remote !== undefined && state?.mode === 'remote' && state.alias !== undefined && state.remoteRoot !== undefined) {
        try {
          // Run inside the remote workspace root so relative paths resolve
          // there (the engine's login shell starts in $HOME, not remoteRoot).
          const wrapped = cwd !== undefined && cwd !== ''
            ? `cd ${shellQuote(cwd)} && ${command}`
            : command
          const result = await remote.engine.exec(
            state.alias as string,
            wrapped,
            timeoutMs ?? 60_000,
          )
          return { ok: result.success, code: result.success ? 0 : 1, stdout: result.stdout, stderr: result.stderr }
        } catch (error) {
          return { ok: false, code: 1, stdout: '', stderr: error instanceof Error ? error.message : String(error) }
        }
      }
      try {
        const spec: SubprocessSpawnSpec = {
          argv: process.platform === 'win32' ? ['cmd', '/c', command] : ['sh', '-c', command],
          cwd: cwd ?? process.cwd(),
          // UTF-8 everywhere: Windows cmd defaults to GBK, which crashes on
          // non-GBK output (emoji, CJK) — force UTF-8 so the terminal shows
          // the real bytes.
          env: process.platform === 'win32'
            ? { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' }
            : undefined,
          stdio: {
            stdin: 'ignore',
            stdout: { maxBytes: 4 << 20 },
            stderr: { maxBytes: 4 << 20 },
          },
          graceMs: 10_000,
        }
        const handle = ctx.subprocess.spawn(spec)
        const outcome = await handle.done
        const stdout = handle.collected.stdout?.readFrom(0).text ?? ''
        const stderr = handle.collected.stderr?.readFrom(0).text ?? ''
        return { ok: outcome.exitCode === 0, code: outcome.exitCode, stdout, stderr }
      } catch (error) {
```

</details>

**依据 8 · 源码核查**：[packages/dsh-aionui-panel/src/host/fs-service.ts:220-247](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/host/fs-service.ts#L220-L247)

远端文件委派条件。

<details>
<summary>查看原文（28行）</summary>

```text
  /** The active remote target when root is the SSH-mode remote root. */
  private remoteTarget(root: string): { alias: string; remoteRoot: string; engine: SshCoreLike['engine'] } | null {
    const core = this.getRemote?.()
    if (core === undefined) return null
    const state = core.store.getSnapshot()
    if (state.mode !== 'remote' || state.alias === undefined || state.remoteRoot === undefined) return null
    if (root !== state.remoteRoot) return null
    return { alias: state.alias, remoteRoot: state.remoteRoot, engine: core.engine }
  }

  /** True when root is the SSH-mode remote root (git is unavailable there). */
  isRemote(root: string): boolean {
    return this.remoteTarget(root) !== null
  }

  /** Verify a project root against the workspace gate (used by the SSE layer). */
  async verify(root: string): Promise<GateVerdict> {
    const remote = this.remoteTarget(root)
    if (remote !== null) return { ok: true, canonical: remote.remoteRoot }
    return this.gate(root)
  }

  /** Resolve a remote-relative path against the remote root (no traversal). */
  private remoteAbs(remoteRoot: string, rel: string): string | null {
    if (rel.includes('\0') || rel.split('/').includes('..')) return null
    if (rel === '') return remoteRoot
    return remoteRoot.endsWith('/') ? remoteRoot + rel : `${remoteRoot}/${rel}`
  }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-aionui-panel/src/host/routes.ts:296-326](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/host/routes.ts#L296-L326)

面板执行接口与远端 Git 退化。

<details>
<summary>查看原文（31行）</summary>

```text
      case '/aionui-panel/exec': {
        if (exec === undefined) {
          json(res, FAIL({ code: 'internal', message: 'exec seam unavailable' }))
          return
        }
        const command = strField(payload, 'command')
        const rawCwd = typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>).cwd
          : undefined
        const cwd = typeof rawCwd === 'string' && rawCwd !== '' ? rawCwd : undefined
        if (command === null) {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        try {
          const result = await exec.run(command, cwd, 60_000)
          json(res, OK(result))
        } catch (error: unknown) {
          json(res, FAIL({ code: 'internal', message: error instanceof Error ? error.message : String(error) }))
        }
        return
      }
      case '/aionui-panel/git-status': {
        // Over SSH the git service is unavailable: report "not a repository"
        // so the SCM tab degrades cleanly instead of erroring.
        if (fs.isRemote(root)) {
          json(res, OK(null))
          return
        }
        const result = await git.status(root)
        json(res, result === null ? OK(null) : 'root' in result ? OK(result) : FAIL(result))
```

</details>

#### 缺口

- 未验证宿主额外提供的服务或版本是否能补齐两个服务名。
  **影响**：不能把源码套件按 README 宣称视为自动统一远端模式。
  **进一步探讨**：在本地与合成 SSH 工作区放不同标记，分别观察面板文件、面板命令、模型工具及真实副作用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 会话隔离、路径、连接和恢复边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

客户端可以按 Session ID 在 localStorage 记忆设备和模式，切会话可能重放选择，但宿主 RemoteModeStore 在插件实例中只有一个 state，模式 API 写全局值，工具门面每次从全局值选后端。它不是并发 Session 的后端绑定。局部操作的实际连接还受远端账户约束，本机沙箱在 remote 模式下不作围栏。面板文件服务通常先查已注册工作区和 realpath，但文件目标 realpath 非 ENOENT 失败有继续操作分支，目录前缀统一转小写。面板 exec 路由要求 JSON 和非空 root 字段，命令 cwd 来自正文并直接传给执行器，此分支没有文件服务的工作区校验。SSH 与 EasySSH 路由另有 loopback 检查，不能把该检查移用于面板。密码和 passphrase 存在宿主 JSON，写入请求 0600 权限，应用层仍以明文存储。SSH 引擎的 withClient 可重试抛异常的操作，断线不能证明远端没有做过。远端删除直接调用引擎，本地 Windows 回收失败也会永久删除。目标身份、授权、文件备份及未知结果的核对都比界面模式标识更关键。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-easyssh/src/store.ts:1-33](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/store.ts#L1-L33)

宿主状态为实例单一状态。

<details>
<summary>查看原文（33行）</summary>

```text
/**
 * The plugin's mode store: a process-local singleton deciding whether the
 * workspace surfaces (left panel, remote_* tools) point at this machine or at
 * an SSH host. Pure state — no cordis dependency, unit-testable.
 */
import type { WorkspaceState } from './protocol.ts'

/** The default remote root: the login user's home, resolved on connect. */
export const DEFAULT_REMOTE_ROOT = '~'

export class RemoteModeStore {
  private state: WorkspaceState = { mode: 'local' }
  private readonly listeners = new Set<() => void>()

  /** The current state (routes/tools read this per request). */
  getSnapshot(): WorkspaceState {
    return this.state
  }

  /** Subscribe to state changes; returns the disposer. */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Replace the whole state (routes are the only writers). */
  set(state: WorkspaceState): void {
    this.state = state
    for (const listener of [...this.listeners]) listener()
  }
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-easyssh/src/client/session-memory.ts:1-37](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/client/session-memory.ts#L1-L37)

浏览器按 Session 记忆。

<details>
<summary>查看原文（37行）</summary>

```text
/**
 * Per-session SSH memory: each session remembers its own device and mode, so
 * switching sessions restores that session's SSH state (isolation). The host
 * mode store stays process-global (the fs/subprocess seams route on it), so
 * this is the client-side per-session view: session A stays remote on "prod"
 * while session B is local, and switching re-applies the remembered mode.
 */
import type { WorkspaceState } from '../protocol.ts'

const KEY_PREFIX = 'ssh-session-state:'

/** Load a session's remembered SSH state (null = never configured). */
export function loadSessionState(sessionId: string): WorkspaceState | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + sessionId)
    if (raw === null) return null
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>
    if (parsed.mode !== 'remote' && parsed.mode !== 'local') return null
    if (parsed.mode === 'remote' && typeof parsed.alias !== 'string') return null
    return {
      mode: parsed.mode,
      alias: parsed.mode === 'remote' ? parsed.alias : parsed.alias,
      remoteRoot: typeof parsed.remoteRoot === 'string' ? parsed.remoteRoot : undefined,
      remoteRootLabel: typeof parsed.remoteRootLabel === 'string' ? parsed.remoteRootLabel : undefined,
    }
  } catch {
    return null
  }
}

/** Remember a session's SSH state (call after every mode change). */
export function saveSessionState(sessionId: string, state: WorkspaceState): void {
  try {
    localStorage.setItem(KEY_PREFIX + sessionId, JSON.stringify(state))
  } catch {
    // best-effort
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-easyssh/src/client/state.ts:59-113](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/client/state.ts#L59-L113)

按客户端记忆校正全局宿主。

<details>
<summary>查看原文（55行）</summary>

```text
   * Reconcile the client view with the host's global mode. A session WITH its
   * own memory corrects the host when they disagree (isolation: switching
   * back restores each session's remembered device/mode). A session WITHOUT
   * memory only adopts a local VIEW — it never rewrites the global host mode,
   * because that global mode may belong to a different session/page that is
   * actively in SSH mode (yanking it back to local is what made "edit too
   * much" save attempts fail with "path does not resolve on disk": the panel
   * still showed the remote root, but the host had already been flipped local).
   */
  async refresh(): Promise<void> {
    let host: WorkspaceState
    try {
      host = await this.api.getState()
    } catch {
      return // transient network hiccup: keep the previous snapshot
    }
    const sessionId = this.sessionId
    if (sessionId === undefined) {
      this.state = host
      this.emit()
      return
    }
    const desired = this.desiredFor(sessionId)
    if (desired === null) {
      // Never configured: show the local view only, leave the global host
      // mode untouched.
      this.state = { mode: 'local' }
      this.emit()
      return
    }
    const same = desired.mode === host.mode
      && desired.alias === host.alias
      && desired.remoteRoot === host.remoteRoot
    if (same) {
      this.state = host
      this.emit()
      return
    }
    // The host disagrees with this session's memory: correct the host (and
    // adopt the corrected state once it settles). This is what keeps a
    // never-configured session local even when another session is remote.
    try {
      if (desired.mode === 'remote' && desired.alias !== undefined) {
        this.state = await this.api.setModeRemote(desired.alias, desired.remoteRoot)
      } else {
        this.state = await this.api.setModeLocal()
      }
      if (this.sessionId === sessionId) saveSessionState(sessionId, this.state)
    } catch {
      // Correction failed: still show the DESIRED view rather than a global
      // remote state that belongs to another session.
      this.state = desired
    }
    this.emit()
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-easyssh/src/routes.ts:111-153](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/routes.ts#L111-L153)

loopback 与模式 API。

<details>
<summary>查看原文（43行）</summary>

```text
  const guard = (req: IncomingMessage, res: ServerResponse, method: string): boolean => {
    if (!isLoopbackRequest(req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: `method not allowed: ${req.method}` })
      return false
    }
    return true
  }

  const stateRoute: WebRoute = {
    kind: 'exact',
    path: WORKSPACE_API.state,
    handler: async (req, res) => {
      const method = req.method ?? 'GET'
      if (method === 'GET') {
        if (!guard(req, res, 'GET')) return
        writeJson(res, 200, { state: store.getSnapshot() })
        return
      }
      if (method === 'POST') {
        if (!isLoopbackRequest(req)) {
          writeJson(res, 403, { error: 'forbidden: loopback-only' })
          return
        }
        const body = await readJsonBody(req)
        if (body === undefined) {
          writeJson(res, 400, { error: 'malformed JSON body' })
          return
        }
        const mode = body.mode
        if (mode !== 'local' && mode !== 'remote') {
          writeJson(res, 400, { error: 'mode must be "local" or "remote"' })
          return
        }
        const previous = store.getSnapshot()
        if (mode === 'local') {
          // Keep the last remote target so the toggle can return to it.
          store.set({ mode: 'local', alias: previous.alias, remoteRoot: previous.remoteRoot, remoteRootLabel: previous.remoteRootLabel })
          writeJson(res, 200, { state: store.getSnapshot() })
          return
```

</details>

**依据 5 · 源码核查**：[packages/dsh-easyssh/src/routes.ts:155-191](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/routes.ts#L155-L191)

设置远端路径和全局状态。

<details>
<summary>查看原文（37行）</summary>

```text
        const alias = typeof body.alias === 'string' ? body.alias.trim() : ''
        if (alias === '') {
          writeJson(res, 400, { error: 'alias is required for remote mode' })
          return
        }
        const entry = hosts.find(alias)
        if (entry === undefined) {
          writeJson(res, 404, { error: `alias '${alias}' not found — configure it in the SSH dialog first` })
          return
        }
        let remoteRoot = previous.remoteRoot
        let label: string | undefined = previous.remoteRootLabel
        const requested = typeof body.remoteRoot === 'string' && body.remoteRoot.trim() !== '' ? body.remoteRoot.trim() : DEFAULT_REMOTE_ROOT
        if (requested === DEFAULT_REMOTE_ROOT) {
          // Resolve the login home over the connection.
          try {
            const result = await engine.exec(alias, 'printf %s "$HOME"', 10_000)
            if (!result.success || result.stdout.trim() === '') {
              writeJson(res, 502, { error: `could not resolve remote home: ${result.stderr.trim() || 'empty $HOME'}` })
              return
            }
            remoteRoot = result.stdout.trim()
            label = DEFAULT_REMOTE_ROOT
          } catch (error) {
            writeJson(res, 502, { error: error instanceof Error ? error.message : String(error) })
            return
          }
        } else {
          if (!requested.startsWith('/')) {
            writeJson(res, 400, { error: `remoteRoot must be an absolute path or '~' (got '${requested}')` })
            return
          }
          remoteRoot = requested.replace(/\/+$/, '')
          label = requested
        }
        store.set({ mode: 'remote', alias, remoteRoot, remoteRootLabel: label })
        writeJson(res, 200, { state: store.getSnapshot() })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-easyssh/src/switch/switch-fs.ts:41-56](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/switch/switch-fs.ts#L41-L56)

远端不继承本机沙箱。

<details>
<summary>查看原文（16行）</summary>

```text
  /** The active backend for the current mode. */
  private delegate(): FileSystem {
    return this.deps.getState().mode === 'remote' ? this.deps.remote : this.deps.local
  }

  /**
   * The capability fact the tool layer reads: the local backend's sandbox
   * default in local mode; no confinement in remote mode (remote execution
   * cannot be fenced by the local sandbox).
   */
  override get sandboxMode(): SandboxMode | undefined {
    return this.deps.getState().mode === 'remote' ? undefined : this.deps.local.sandboxMode
  }

  override resolve(path: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<FsTarget> {
    return this.delegate().resolve(path, opts)
```

</details>

**依据 7 · 源码核查**：[packages/dsh-aionui-panel/src/host/gate.ts:21-57](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/host/gate.ts#L21-L57)

登记目录与大小写前缀规则。

<details>
<summary>查看原文（37行）</summary>

```text
/** The canonical prefix check: child must live inside (or equal) the root.
 * Windows paths use backslash separators (join() output) — the prefix must
 * match the root's own separator, and the comparison is case-insensitive. */
export function isPathInside(root: string, child: string): boolean {
  if (root === '' || child === '') return false
  if (child === root) return true
  const sep = root.includes('\\') ? '\\' : '/'
  const prefix = root.endsWith(sep) ? root : `${root}${sep}`
  return child.toLowerCase().startsWith(prefix.toLowerCase())
}

/**
 * Production gate: canonicalize the requested root and require it to be a
 * registered workspace path (or a subdirectory of one). The host's workspace
 * registry owns canonicalization, so an unowned path is rejected outright.
 * @param ctx - context carrying the workspace service.
 * @returns the gate.
 */
export function createWorkspaceGate(ctx: Context): WorkspaceGate {
  return async (root) => {
    if (typeof root !== 'string' || root === '') {
      return { ok: false, error: { code: 'workspace-unknown', message: 'empty project root' } }
    }
    let canonical: string
    try {
      canonical = await realpath(root)
    } catch {
      return { ok: false, error: { code: 'workspace-unknown', message: 'path does not resolve on disk' } }
    }
    const workspaces = ctx.workspaceRegistry.list()
    for (const workspace of workspaces) {
      if (isPathInside(workspace.path, canonical)) {
        return { ok: true, canonical }
      }
    }
    return { ok: false, error: { code: 'workspace-unknown', message: 'path is not inside a registered workspace' } }
  }
```

</details>

**依据 8 · 源码核查**：[packages/dsh-aionui-panel/src/host/fs-service.ts:69-98](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/host/fs-service.ts#L69-L98)

realpath 异常与路径判断。

<details>
<summary>查看原文（30行）</summary>

```text
async function resolveInsideRoot(root: string, rel: string): Promise<{ ok: true; abs: string } | { ok: false; error: PanelError }> {
  if (rel.includes('\0')) return { ok: false, error: { code: 'path-outside-root', message: 'invalid path' } }
  const abs = join(root, rel)
  if (!isPathInside(root, abs)) {
    return { ok: false, error: { code: 'path-outside-root', message: `path escapes root: ${rel}` } }
  }
  // Walk ancestors until we hit one that exists; validate its real path.
  let probe = abs
  for (let hop = 0; hop < 32; hop += 1) {
    let real: string
    try {
      real = await realpath(probe)
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      // Any other realpath failure (EACCES/ELOOP/...) lets the operation run;
      // the caller's own try/catch maps permission/IO problems to its normal
      // not-found / write-failed codes.
      if (code !== 'ENOENT') return { ok: true, abs }
      // Ancestor does not exist yet; realpath the parent instead.
      const parent = dirname(probe)
      if (parent === probe) return { ok: true, abs }
      probe = parent
      continue
    }
    if (!isPathInside(root, real)) {
      return { ok: false, error: { code: 'path-outside-root', message: `path resolves outside root: ${rel}` } }
    }
    return { ok: true, abs }
  }
  return { ok: false, error: { code: 'path-outside-root', message: `path cannot be resolved: ${rel}` } }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-aionui-panel/src/host/routes.ts:174-198](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/host/routes.ts#L174-L198)

JSON 和 root 字段要求。

<details>
<summary>查看原文（25行）</summary>

```text
    if (req.method !== 'POST') {
      res.writeHead(405)
      res.end()
      return
    }
    // Require an explicit JSON content-type: cross-site simple requests (no
    // preflight) cannot set application/json, so this blocks form-based CSRF
    // from driving the fs/git routes.
    const contentType = req.headers['content-type'] ?? ''
    if (!contentType.toLowerCase().startsWith('application/json')) {
      json(res, FAIL(BAD_REQUEST), 415)
      return
    }
    const pathname = new URL(req.url ?? '/', 'http://x').pathname
    const payload = await readJsonBody(req)
    if (payload === null) {
      json(res, FAIL(BAD_REQUEST))
      return
    }
    const root = strField(payload, 'root')
    if (root === null) {
      json(res, FAIL(BAD_REQUEST))
      return
    }
    switch (pathname) {
```

</details>

**依据 10 · 源码核查**：[packages/dsh-aionui-panel/src/host/routes.ts:296-316](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/host/routes.ts#L296-L316)

面板命令接受正文 cwd。

<details>
<summary>查看原文（21行）</summary>

```text
      case '/aionui-panel/exec': {
        if (exec === undefined) {
          json(res, FAIL({ code: 'internal', message: 'exec seam unavailable' }))
          return
        }
        const command = strField(payload, 'command')
        const rawCwd = typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>).cwd
          : undefined
        const cwd = typeof rawCwd === 'string' && rawCwd !== '' ? rawCwd : undefined
        if (command === null) {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        try {
          const result = await exec.run(command, cwd, 60_000)
          json(res, OK(result))
        } catch (error: unknown) {
          json(res, FAIL({ code: 'internal', message: error instanceof Error ? error.message : String(error) }))
        }
        return
```

</details>

**依据 11 · 源码核查**：[packages/dsh-ssh/src/routes.ts:117-145](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-ssh/src/routes.ts#L117-L145)

SSH 路由独立 loopback 校验。

<details>
<summary>查看原文（29行）</summary>

```text
  /** Guard helper: fence + method check. */
  const guard = (req: IncomingMessage, res: ServerResponse, method: string): boolean => {
    if (!isLoopbackRequest(req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: `method not allowed: ${req.method}` })
      return false
    }
    return true
  }

  const routes: WebRoute[] = [
    // ------------------------------------------------------------ hosts
    {
      kind: 'exact',
      path: SSH_API.hosts,
      handler: async (req, res) => {
        // One handler per path (the webserver keyed route registry rejects
        // duplicate (kind, path)); dispatch by HTTP method here.
        const method = req.method ?? 'GET'
        if (!isLoopbackRequest(req)) {
          writeJson(res, 403, { error: 'forbidden: loopback-only' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        if (method === 'GET') {
          writeJson(res, 200, { hosts: engine.list(queryParam(url, 'query')) })
```

</details>

**依据 12 · 源码核查**：[packages/dsh-ssh/src/store.ts:198-208](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-ssh/src/store.ts#L198-L208)

密码和 passphrase 进入主机条目。

<details>
<summary>查看原文（11行）</summary>

```text
        && expandHome(auth.keyPath.trim()) !== entry.auth.keyPath
      entry.auth = {
        kind: auth.kind,
        keyPath: auth.kind === 'key' ? expandHome(auth.keyPath?.trim() ?? '') : undefined,
        passphrase: auth.kind === 'key'
          ? (auth.passphrase !== undefined ? auth.passphrase : (keyChanged ? undefined : entry.auth.passphrase))
          : undefined,
        password: auth.kind === 'password' ? auth.password : undefined,
      }
    }
    if (patch.proxyJump !== undefined) entry.proxyJump = [...patch.proxyJump]
```

</details>

**依据 13 · 源码核查**：[packages/dsh-ssh/src/store.ts:328-335](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-ssh/src/store.ts#L328-L335)

明文 JSON 和权限。

```text
  private save(file: StoreFile): void {
    const dir = dirname(this.path)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
    const tmp = this.path + '.tmp'
    // Secrets live in this file: keep it readable by the owner only. The
    // tmp file carries the 0600 mode through the rename.
    writeFileSync(tmp, JSON.stringify(file, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    renameSync(tmp, this.path)
```

**依据 14 · 源码核查**：[packages/dsh-ssh/src/engine.ts:245-276](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-ssh/src/engine.ts#L245-L276)

SSH 异常后可能重做回调。

<details>
<summary>查看原文（32行）</summary>

```text
  /**
   * Run `fn` with a live client for `alias`, reconnecting (up to the
   * attempt budget) when the connection broke mid-flight.
   */
  private async withClient<T>(alias: string, fn: (client: Client) => Promise<T>, attempts = 3): Promise<T> {
    let lastError: unknown
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      let record = this.pool.get(alias)
      if (record === undefined || record.broken) {
        if (record !== undefined) this.disposeRecord(alias, record)
        record = await this.acquire(alias)
      }
      record.idleAt = Date.now()
      record.inFlight += 1
      try {
        const result = await fn(record.client)
        record.idleAt = Date.now()
        return result
      } catch (error) {
        lastError = error
        // A mid-flight failure on a pooled connection usually means the
        // connection died silently between operations (the 'error'/'close'
        // event may not have fired yet). Drop the record 鈥?but only when no
        // other operation is running on it 鈥?so the next attempt reconnects.
        if (record.broken || record.inFlight === 1) {
          this.disposeRecord(alias, record)
        }
      } finally {
        record.inFlight -= 1
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError))
```

</details>

**依据 15 · 源码核查**：[packages/dsh-aionui-panel/src/host/fs-service.ts:614-655](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/host/fs-service.ts#L614-L655)

远端删除与 Windows 回收失败回退。

<details>
<summary>查看原文（42行）</summary>

```text
   *  SendToRecycleBin); remote deletes stay permanent (SFTP has no bin). */
  async delete(root: string, rel: string): Promise<{ ok: true } | PanelError> {
    const remote = this.remoteTarget(root)
    if (remote !== null) {
      if (rel === '') return { code: 'path-outside-root', message: 'refusing to delete the root' }
      if (isGitPath(rel)) return { code: 'path-outside-root', message: 'refusing to touch .git' }
      const abs = this.remoteAbs(remote.remoteRoot, rel)
      if (abs === null) return { code: 'path-outside-root', message: 'path escapes root' }
      try {
        await remote.engine.rm(remote.alias, abs, true)
        return { ok: true }
      } catch {
        return { code: 'write-failed', message: `cannot delete ${rel}` }
      }
    }
    const gated = await this.gate(root)
    if (!gated.ok) return gated.error
    if (rel === '') return { code: 'path-outside-root', message: 'refusing to delete the root' }
    if (isGitPath(rel)) return { code: 'path-outside-root', message: 'refusing to touch .git' }
    const resolved = await resolveInsideRoot(gated.canonical, rel)
    if (!resolved.ok) return resolved.error
    // Windows: recycle instead of permanent removal (the item must still
    // exist; PowerShell receives the literal path via JSON-quoted string).
    if (process.platform === 'win32') {
      try {
        const literal = JSON.stringify(resolved.abs)
        const script = `Add-Type -AssemblyName Microsoft.VisualBasic; `
          + `if (Test-Path -LiteralPath ${literal}) { `
          + `$i = Get-Item -LiteralPath ${literal}; `
          + `if ($i.PSIsContainer) { [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($i.FullName, 'OnlyErrorDialogs', 'SendToRecycleBin') } `
          + `else { [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($i.FullName, 'OnlyErrorDialogs', 'SendToRecycleBin') } }`
        execFileSync('powershell', ['-NoProfile', '-Command', script], { timeout: 20_000, stdio: 'ignore' })
        return { ok: true }
      } catch {
        // fall through to the permanent rm when the recycle path fails
      }
    }
    try {
      await rm(resolved.abs, { recursive: true, force: true })
      return { ok: true }
    } catch {
      return { code: 'write-failed', message: `cannot delete ${rel}` }
```

</details>

#### 缺口

- 未执行实际身份校验、交叉 Session、断连重试、路径链接或删除恢复测试。
  **影响**：不能由浏览器隔离、JSON 请求或当前模式推断租户安全和远端结果。
  **进一步探讨**：在隔离账户验证两 Session 同时改模式、请求来源、不同 cwd 以及断开前后的只读和可复查操作。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样观察本地面板与 SSH 组合是否适用？

**研究主题**：采用判断、依赖、兼容与流程、效果与总成本

#### 完整回答

适合已有 DSH Web、经常在聊天和本地项目之间切换的个人开发者先观察本地面板。以单独 profile、干净 Git 副本和新文件验证预览、保存冲突、Git 状态以及退出恢复。SSH 先使用低权限测试账户和隔离远端目录，验证两个模式分别落到本地、远端，逐个对照 Explorer、面板命令、原生 read 和 bash 的目标标记。随后以两会话同时启动任务检验模式串扰。若服务名未桥接、目标标记对不上或命令去向无法确定，退出远端并回到原 profile 和单独 SSH 客户端。安装有三个工件及宿主依赖，使用仍需管理凭据、版本、文件副本和远端机器。未授权的环境不要用来验收修改、删除或命令重放。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:211-266](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/README.md#L211-L266)

作者的构建、分包添加和重启路径。

<details>
<summary>查看原文（56行）</summary>

````text
## 安装

前置要求：Node.js ≥ 22、pnpm、已安装 dsh（`npx @deepseek-ai/dsh`）。

```sh
# 1) 克隆并构建
git clone https://github.com/chenw2759-wq/dsh-IDE.git
cd dsh-IDE
pnpm install
pnpm --filter "./packages/dsh-aionui-panel" build
pnpm --filter "./packages/dsh-ssh" build
pnpm --filter "./packages/dsh-easyssh" build

# 2) 把三个包安装到 web profile（注意用你自己的绝对路径）
dsh plugin --profile web add file:C:/你的路径/dsh-IDE/packages/dsh-aionui-panel
dsh plugin --profile web add file:C:/你的路径/dsh-IDE/packages/dsh-ssh
dsh plugin --profile web add file:C:/你的路径/dsh-IDE/packages/dsh-easyssh
```

> 仓库品牌为 dsh-IDE；核心插件包名沿用 `dsh-easyssh`（安装标识，不随品牌改名）。

> 💡 **pnpm 构建放行（一行）**：dsh-ssh 依赖的原生库（ssh2 / cpu-features）需要构建。pnpm 10+
> 默认阻止依赖构建脚本，`dsh plugin add` 会报
> `ERR_PNPM_IGNORED_BUILDS: Ignored build scripts: cpu-features@0.0.10, ssh2@1.17.0`，并在
> `<profile>/pnpm-workspace.yaml` 里**自动写入占位**：
>
> ```yaml
> allowBuilds:
>   cpu-features: set this to true or false
>   ssh2: set this to true or false
> ```
>
> 把两个 `set this to true or false` 改成 `true`，然后**重新执行第 2 步的 `dsh plugin add`**
> （重复执行是幂等的）。这是 pnpm 的标准流程，任何带原生依赖的插件都一样。

### 第 3 步：接缝切换（自动，无需手动）

安装 dsh-easyssh 时，其自带的 `cordis.patch.yml`（经 `dsh.bundle.patch` 声明）会作为 profile
bundle 层**自动应用**：禁用部署自带的 `fs-sandbox` / `subprocess`，挂载模式路由门面
`easyssh-fs` / `easyssh-subprocess`（SSH 模式下模型工具透明地远程执行；本地模式委托回同一套
沙箱实现）。**不需要手动编辑 `<profile>/cordis.patch.yml`**。

> ⚠️ **升级用户必读**：手动写入接缝补丁只属于 **0.1.0 之前的旧版本**。若你按旧文档在
> `<profile>/cordis.patch.yml`（Windows 默认 `C:\Users\<你>\.dsh\profiles\web\cordis.patch.yml`）
> 里写过手写补丁，升级后必须把它**删除（恢复为 `[]`）**——否则自动补丁 + 手写补丁各插入一次
> 相同的 `ssh-workspace-fs` / `ssh-workspace-subprocess` 行，启动会报
> `duplicate loader entry id` 错误。删除后重启即可（自动补丁内容与旧手写补丁一致，行 id 相同）。

### 第 4 步：重启

```sh
# 重启 dsh
npx @deepseek-ai/dsh web
```

打开 `http://127.0.0.1:3080` → **Ctrl+F5 硬刷新**（浏览器缓存旧 client 包时必做）→ 右上角 SSH 按钮配置主机 → 进入 SSH 模式。
````

</details>

**依据 2 · 源码核查**：[packages/dsh-aionui-panel/src/host/fs-service.ts:419-462](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/host/fs-service.ts#L419-L462)

保存分支及可选 mtime 冲突检查。

<details>
<summary>查看原文（44行）</summary>

```text
  async write(
    root: string,
    rel: string,
    content: string,
    baseMtime?: number,
  ): Promise<{ mtime: number } | PanelError> {
    const remote = this.remoteTarget(root)
    if (remote !== null) {
      if (isGitPath(rel)) return { code: 'path-outside-root', message: 'refusing to touch .git' }
      const abs = this.remoteAbs(remote.remoteRoot, rel)
      if (abs === null) return { code: 'path-outside-root', message: 'path escapes root' }
      try {
        const result = await remote.engine.writeFile(remote.alias, abs, Buffer.from(content, 'utf8'), baseMtime)
        this.cacheSet(abs, content)
        return { mtime: result.mtime }
      } catch (error) {
        if (String(error).includes('mtime conflict')) {
          return { code: 'write-conflict', message: 'file changed on the remote since it was loaded' }
        }
        return { code: 'write-failed', message: `cannot write ${rel}` }
      }
    }
    const gated = await this.gate(root)
    if (!gated.ok) return gated.error
    if (isGitPath(rel)) return { code: 'path-outside-root', message: 'refusing to touch .git' }
    const resolved = await resolveInsideRoot(gated.canonical, rel)
    if (!resolved.ok) return resolved.error
    try {
      let current: Awaited<ReturnType<typeof stat>>
      try {
        current = await stat(resolved.abs)
      } catch {
        current = { mtimeMs: 0 } as Awaited<ReturnType<typeof stat>>
      }
      if (baseMtime !== undefined && Number(current.mtimeMs) !== 0 && Math.abs(Number(current.mtimeMs) - baseMtime) > 1) {
        return { code: 'write-conflict', message: 'file changed on disk since it was loaded' }
      }
      await mkdir(dirname(resolved.abs), { recursive: true })
      await writeFile(resolved.abs, content, 'utf8')
      const info = await stat(resolved.abs)
      this.cacheSet(resolved.abs, content)
      return { mtime: info.mtimeMs }
    } catch {
      return { code: 'write-failed', message: `cannot write ${rel}` }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-easyssh/src/index.ts:60-86](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/index.ts#L60-L86)

EasySSH 的依赖服务名。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx: Context, config?: Config): void {
  const resolved = {
    enabled: config?.enabled ?? true,
    announceToAgent: config?.announceToAgent ?? true,
  }

  const store = new RemoteModeStore()
  const hosts = new HostStore()
  const engine = new SshEngine(hosts)
  ctx.effect(() => () => {
    engine.dispose()
  }, 'dsh-easyssh: engine')

  // The shared core is ALWAYS provided: the seam-switch rows (./fs,
  // ./subprocess) inject it, and they replace the deployment's fs/subprocess
  // providers — starving them would break the model's file tools.
  const core: EasysshCore = { store, hosts, engine }
  ctx.provide('easysshCore', core)

  if (!resolved.enabled) return

  const routes = makeRoutes({ store, hosts, engine })
  // webServer is optional (headless profiles lack it): dynamic inject keeps
  // this plugin loadable everywhere, mounting routes only when it appears.
  // The inject callback receives a scoped Context with the service available.
  ctx.inject(['webServer'], (scoped) => {
    const disposers = routes.map(route => scoped.webServer.register(route))
```

</details>

**依据 4 · 源码核查**：[packages/dsh-aionui-panel/src/index.ts:51-105](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/index.ts#L51-L105)

面板各路径的后端选择。

<details>
<summary>查看原文（55行）</summary>

```text
export function apply(ctx: Context): void {
  const gate = createWorkspaceGate(ctx)
  // Dynamic getter: the workspace plugin may load before or after this one;
  // the core is re-read on every operation, so SSH delegation always sees
  // the current mode without a hard cross-plugin inject.
  const getRemote = (): SshCoreLike | undefined => ctx.get('sshWorkspaceCore') as SshCoreLike | undefined
  const fs = new FsService(gate, getRemote)
  const git = new GitService(subprocessRunner(ctx), gate, (root, rel) => fs.delete(root, rel))

  // Command-run seam: remote mode rides the SSH engine; local mode uses the
  // managed subprocess seam (same as the git runner).
  const exec: ExecSeam = {
    async run(command, cwd, timeoutMs) {
      const remote = getRemote()
      const state = remote?.store.getSnapshot()
      if (remote !== undefined && state?.mode === 'remote' && state.alias !== undefined && state.remoteRoot !== undefined) {
        try {
          // Run inside the remote workspace root so relative paths resolve
          // there (the engine's login shell starts in $HOME, not remoteRoot).
          const wrapped = cwd !== undefined && cwd !== ''
            ? `cd ${shellQuote(cwd)} && ${command}`
            : command
          const result = await remote.engine.exec(
            state.alias as string,
            wrapped,
            timeoutMs ?? 60_000,
          )
          return { ok: result.success, code: result.success ? 0 : 1, stdout: result.stdout, stderr: result.stderr }
        } catch (error) {
          return { ok: false, code: 1, stdout: '', stderr: error instanceof Error ? error.message : String(error) }
        }
      }
      try {
        const spec: SubprocessSpawnSpec = {
          argv: process.platform === 'win32' ? ['cmd', '/c', command] : ['sh', '-c', command],
          cwd: cwd ?? process.cwd(),
          // UTF-8 everywhere: Windows cmd defaults to GBK, which crashes on
          // non-GBK output (emoji, CJK) — force UTF-8 so the terminal shows
          // the real bytes.
          env: process.platform === 'win32'
            ? { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' }
            : undefined,
          stdio: {
            stdin: 'ignore',
            stdout: { maxBytes: 4 << 20 },
            stderr: { maxBytes: 4 << 20 },
          },
          graceMs: 10_000,
        }
        const handle = ctx.subprocess.spawn(spec)
        const outcome = await handle.done
        const stdout = handle.collected.stdout?.readFrom(0).text ?? ''
        const stderr = handle.collected.stderr?.readFrom(0).text ?? ''
        return { ok: outcome.exitCode === 0, code: outcome.exitCode, stdout, stderr }
      } catch (error) {
```

</details>

**依据 5 · 源码核查**：[packages/dsh-easyssh/src/store.ts:11-32](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/store.ts#L11-L32)

并发检查的宿主全局模式依据。

<details>
<summary>查看原文（22行）</summary>

```text
export class RemoteModeStore {
  private state: WorkspaceState = { mode: 'local' }
  private readonly listeners = new Set<() => void>()

  /** The current state (routes/tools read this per request). */
  getSnapshot(): WorkspaceState {
    return this.state
  }

  /** Subscribe to state changes; returns the disposer. */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Replace the whole state (routes are the only writers). */
  set(state: WorkspaceState): void {
    this.state = state
    for (const listener of [...this.listeners]) listener()
  }
```

</details>

#### 缺口

- 未验证目标 DSH 版本的 profile 恢复和真实 SSH 权限。
  **影响**：建议先观察单用户隔离场景，组合安装与持续使用均待验证。
  **进一步探讨**：固定版本和安全测试环境，记录四种入口实际目标、写后校验及退出后的本地服务。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证统一工作区能减少跨工具切换？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

假设同一 Web 面板可以减少从聊天定位文件、阅读 diff 到验证改动的跨工具切换。以 DSH 加独立编辑器和 SSH 客户端作为基线，用同一组只读定位、可还原的小文本改动与验证任务比较本地单面板和 SSH 组合。固定宿主、Git 初态和输入，并交错顺序。记录每项正确交付的时间、窗口切换次数、恢复时间、错误目标数与需要人工核对的命令数。结果必须可读回且出现在正确仓库和目标账户。若少切换但服务名不匹配、全局模式导致错主机或超时后结果不明，则无法支持 SSH 场景的净收益。可单独保留本地面板子实验的结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-aionui-panel/src/index.ts:51-78](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-aionui-panel/src/index.ts#L51-L78)

面板命令与文件可用不同接线。

<details>
<summary>查看原文（28行）</summary>

```text
export function apply(ctx: Context): void {
  const gate = createWorkspaceGate(ctx)
  // Dynamic getter: the workspace plugin may load before or after this one;
  // the core is re-read on every operation, so SSH delegation always sees
  // the current mode without a hard cross-plugin inject.
  const getRemote = (): SshCoreLike | undefined => ctx.get('sshWorkspaceCore') as SshCoreLike | undefined
  const fs = new FsService(gate, getRemote)
  const git = new GitService(subprocessRunner(ctx), gate, (root, rel) => fs.delete(root, rel))

  // Command-run seam: remote mode rides the SSH engine; local mode uses the
  // managed subprocess seam (same as the git runner).
  const exec: ExecSeam = {
    async run(command, cwd, timeoutMs) {
      const remote = getRemote()
      const state = remote?.store.getSnapshot()
      if (remote !== undefined && state?.mode === 'remote' && state.alias !== undefined && state.remoteRoot !== undefined) {
        try {
          // Run inside the remote workspace root so relative paths resolve
          // there (the engine's login shell starts in $HOME, not remoteRoot).
          const wrapped = cwd !== undefined && cwd !== ''
            ? `cd ${shellQuote(cwd)} && ${command}`
            : command
          const result = await remote.engine.exec(
            state.alias as string,
            wrapped,
            timeoutMs ?? 60_000,
          )
          return { ok: result.success, code: result.success ? 0 : 1, stdout: result.stdout, stderr: result.stderr }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-easyssh/src/switch/switch-fs.ts:41-56](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/switch/switch-fs.ts#L41-L56)

Agent 文件工具按全局模式走门面。

<details>
<summary>查看原文（16行）</summary>

```text
  /** The active backend for the current mode. */
  private delegate(): FileSystem {
    return this.deps.getState().mode === 'remote' ? this.deps.remote : this.deps.local
  }

  /**
   * The capability fact the tool layer reads: the local backend's sandbox
   * default in local mode; no confinement in remote mode (remote execution
   * cannot be fenced by the local sandbox).
   */
  override get sandboxMode(): SandboxMode | undefined {
    return this.deps.getState().mode === 'remote' ? undefined : this.deps.local.sandboxMode
  }

  override resolve(path: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<FsTarget> {
    return this.delegate().resolve(path, opts)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-easyssh/src/store.ts:11-32](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-easyssh/src/store.ts#L11-L32)

模式切换是可独立扰动变量。

<details>
<summary>查看原文（22行）</summary>

```text
export class RemoteModeStore {
  private state: WorkspaceState = { mode: 'local' }
  private readonly listeners = new Set<() => void>()

  /** The current state (routes/tools read this per request). */
  getSnapshot(): WorkspaceState {
    return this.state
  }

  /** Subscribe to state changes; returns the disposer. */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Replace the whole state (routes are the only writers). */
  set(state: WorkspaceState): void {
    this.state = state
    for (const listener of [...this.listeners]) listener()
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/engine.ts:245-276](https://github.com/chenw2759-wq/dsh-IDE/blob/df62364bc386777edebcab96b55afa711271a0b0/packages/dsh-ssh/src/engine.ts#L245-L276)

异常结果的重试机制。

<details>
<summary>查看原文（32行）</summary>

```text
  /**
   * Run `fn` with a live client for `alias`, reconnecting (up to the
   * attempt budget) when the connection broke mid-flight.
   */
  private async withClient<T>(alias: string, fn: (client: Client) => Promise<T>, attempts = 3): Promise<T> {
    let lastError: unknown
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      let record = this.pool.get(alias)
      if (record === undefined || record.broken) {
        if (record !== undefined) this.disposeRecord(alias, record)
        record = await this.acquire(alias)
      }
      record.idleAt = Date.now()
      record.inFlight += 1
      try {
        const result = await fn(record.client)
        record.idleAt = Date.now()
        return result
      } catch (error) {
        lastError = error
        // A mid-flight failure on a pooled connection usually means the
        // connection died silently between operations (the 'error'/'close'
        // event may not have fired yet). Drop the record 鈥?but only when no
        // other operation is running on it 鈥?so the next attempt reconnects.
        if (record.broken || record.inFlight === 1) {
          this.disposeRecord(alias, record)
        }
      } finally {
        record.inFlight -= 1
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError))
```

</details>

#### 缺口

- 没有配对任务、错目标率或跨工具时间数据。
  **影响**：当前只能描述验证假设和关键反例。
  **进一步探讨**：先跑本地单面板，再独立验收 SSH 组合的正确目标与并行隔离。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
