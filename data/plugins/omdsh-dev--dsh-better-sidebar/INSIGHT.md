# DSH Better Sidebar

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0b6293f](https://github.com/omdsh-dev/DSH-better-sidebar/tree/0b6293f05145d6852428a05035d5ea0f370992be)

<!-- BEGIN META -->
[![GitHub ★ 4,925](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C925&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/DSH-better-sidebar) [![npm 30d 269,118](https://img.shields.io/static/v1?label=npm+30d&message=269%2C118&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar)
<!-- END META -->

> **功能**：在 DSH 会话中提供文件、编辑、Git 与侧聊工作台，并开放扩展页与预览器接口。

> **亮点**：[Q02](#research-q02) 至 [Q05](#research-q05) 的增量是会话/工作树与编辑、Git和可注销扩展服务接线，并让侧聊成为继承上下文、独立继续且持久的子会话；保存条件冲突与registry按原对象注销给具体局部防护。上下文并置有维护价值，但不是目录沙箱、动作全确认或运行可靠性证据。

> **主要限制**：[Q03](#research-q03) 会话目录不是权限围栏，已获准请求可达Host OS权限范围；[Q04](#research-q04) push/pull等并无统一二次确认，partial sync不回滚；[Q05](#research-q05) 关面板/取消/释放Agent不等于删除历史或终止shell。若用户据“会话工作台”误判隔离与退出，损失可能大于少切窗口的便利。

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
  - [Q01 · 会话工作台为谁而设，当前版本与 IDE 基线是什么？](#detail-section-11)
  - [Q02 · 编辑保存如何从会话路径到落盘和冲突结果？](#detail-section-12)
  - [Q03 · 会话目录是不是访问围栏，Host准入和取消意味着什么？](#detail-section-13)
  - [Q04 · Git 的本地/远端动作是否都确认，失败后会恢复吗？](#detail-section-14)
  - [Q05 · 扩展生命周期与代表侧聊是否实际执行，关闭会删除吗？](#detail-section-15)
  - [Q06 · 怎样控制首次、持续、恢复和退出的负担？](#detail-section-16)
  - [Q07 · 已有贡献与值得验证的路径授权方向分别是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 在DSH会话内反复查改文件、核Git和独立追问的开发者，需知道真实目录、变更与支线结果，而不只是打开工作台。

[Q01](#research-q01) IDE+终端与单独Agent会话可完成同类工作；本项将当前会话上下文、文件/Git和侧聊/扩展接缝集中，继承Host模型/Agent/terminal和Git，不证明全面替代或净节时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件/编辑器 | 会话内读写目标文件 | 可选mtime；无工作区包含围栏 |
| Git工作台 | 查看、暂存、提交、分支与远端同步 | 部分动作直接执行；远端需单独授权 |
| 扩展registry | 内置/外部tab及viewer注册注销 | Host强耦合；消费者未验 |
| 可续侧聊 | 继承参考上下文，独立Agent继续 | accepted非完成，cancel保队列/历史 |
| 底部terminal | 同会话附加shell界面 | Host提供PTY；view卸载不停止进程 |

**流程与依赖**

| 依赖 | 作用 | 版本或条件 |
|---|---|---|
| Better Sidebar | 本插件 | 0.30.1，MIT；Node>=20，pnpm11.8.0 |
| DSH核心与client | Host/会话/原生surface | 多peer ^0.2.2-rc.1；Cordis^4.0.5，React/DOM^18.2.0 |
| webServer/sessions/connection/tools | Host挂载 | 实际必需inject；具体部署准入另核 |
| Git与账号权限 | 本地/远端仓库操作 | 正确repo和凭据；Host OS可达范围非cwd围栏 |
| agents/persistence/preset/模型 | 侧聊和可选LLM草稿 | 按功能需要；继承上下文可能有费用/资料外发 |
| Host webTerminals | 底部shell | 可选，缺能力不启动，内部停止未验 |

| 步骤 | 操作 | 核对与失败处理 |
|---|---|---|
| 首次 | 固定匹配Host/profile并备份低权限repo | 0.2.1线不可按latest猜兼容 |
| 查改文件 | 读目标/编码/mtime，保存后看实际diff | 冲突保草稿，路径不明停 |
| Git | 先只读，后有明确授权才本地/远端动作 | partial sync可能已pull，失败不回滚 |
| 侧聊 | 虚构内容小预算建线程，核结果所属 | accepted只入队，取消与关闭不同 |
| 退出 | 保存草稿、查盘/索引，关闭不需shell/Agent | 历史/已写/远端内容不会随卸载还原 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与状态责任 |
|---|---|---|
| 首次 | Host/存储资源未知 | 核版本、分块资源、profile和备份；分钟未知 |
| 持续 | 轮询/连接、shell、可选侧聊和LLM token费未知 | 核目录、Git与支线结果，节时未测 |
| 失败恢复 | 追加模型/Git/存储资源未知 | mtime竞态、部分sync、持久线程需人工核 |
| 退出 | 已发生远端/模型用量是否可退未核 | 草稿/文件/索引、shell/Agent/历史分开处理 |

| 效果项 | 当前源码支持 | 尚不支持 |
|---|---|---|
| 会话保存 | 当前目录回退与条件mtime/temp替换 | 目录授权/所有并发无损 |
| Git | 实际argv与UI错误/刷新 | 统一二次确认、远端回滚 |
| 扩展 | 重复ID拒绝/原对象注销 | 全生态与热重载可靠性 |
| 侧聊/terminal | 真实Agent/Host终端接线与不同关闭语义 | 工具完成、低成本、无残留 |
| 采用 | 低权限副本试用可设计 | IDE对照净收益与长期价值 |

> **思考**：[Q03](#research-q03) 会话目录不是权限围栏，已获准请求可达Host OS权限范围；[Q04](#research-q04) push/pull等并无统一二次确认，partial sync不回滚；[Q05](#research-q05) 关面板/取消/释放Agent不等于删除历史或终止shell。若用户据“会话工作台”误判隔离与退出，损失可能大于少切窗口的便利。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 至 [Q05](#research-q05) 的增量是会话/工作树与编辑、Git和可注销扩展服务接线，并让侧聊成为继承上下文、独立继续且持久的子会话；保存条件冲突与registry按原对象注销给具体局部防护。上下文并置有维护价值，但不是目录沙箱、动作全确认或运行可靠性证据。

[Q02](#research-q02)保存保留检测格式、条件mtime与独占temp有具体边界；[Q03](#research-q03)原生Host准入不等于真实路径围栏；[Q04](#research-q04)部分sync与[Q05](#research-q05)registry/sidechat/terminal生命周期不同，不以功能清单或测试文件数证明可靠性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 会话目录不是权限围栏，已获准请求可达Host OS权限范围；[Q04](#research-q04) push/pull等并无统一二次确认，partial sync不回滚；[Q05](#research-q05) 关面板/取消/释放Agent不等于删除历史或终止shell。若用户据“会话工作台”误判隔离与退出，损失可能大于少切窗口的便利。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 先固定Host版本与低权限副本，核实际cwd/path再单文件保存；Git从只读开始，远端/模型动作另确认。用小预算虚构侧聊核持久化和keepInbox/dispose区别，退出核shell/Agent与已写字节；[Q07](#research-q07)路径能力候选先做对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持会话工作台、Git/扩展与代表侧聊执行链；建议低权限可丢弃仓库先读/单文件试用，不作为强目录隔离或远端写授权；未运行Host/模型/Git，候选路径能力未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/active-worktree.ts、src/client/TextEditor.tsx、src/client/api.ts、src/client/builtins/index.ts、src/client/builtins/tabs.tsx、src/client/changes/GitLens.tsx、src/client/index.tsx、src/client/service.ts、src/client/terminal-client.ts、src/fs-operations.ts、src/git.ts、src/index.ts、src/path-security.ts、src/sidechat-core.ts、src/sidechat-routes.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根插件代表链：版本/Host与client入口、当前会话/worktree文件保存、词法路径/准入、常见Git写及push/pull和可选LLM草稿、扩展tab/viewer、侧聊create/resume/cancel/dispose及Host terminal关闭callee。未全审所有文件操作/viewer/task/team/workflow/媒体/外部插件和完整Host服务。前稿七题与全部findings重核。
- 下一步：未安装/运行目标测试/Host、Git写命令、模型、远端或真实账户资料。只读源码可支持机制/失败解释；未来可丢弃环境验证路径/并发/partial sync、扩展生命周期、侧聊与terminal退出，再比较IDE成本。

**分析版本**

- **仓库**：[omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)
- **版本号**：0.30.1（[固定提交 0b6293f](https://github.com/omdsh-dev/DSH-better-sidebar/tree/0b6293f05145d6852428a05035d5ea0f370992be)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 提议按真实目标与操作类别提供可审查、可撤销的单次写/远端能力，区分已提交与可回退状态；对照当前工作台+备份，在链接/切会话/mtime竞争/partial sync中核落点、误拒绝和恢复分钟，若阻合法工作或仍越界就推翻。候选尚未实现验收。

未安装/运行目标测试/Host、Git写命令、模型、远端或真实账户资料。只读源码可支持机制/失败解释；未来可丢弃环境验证路径/并发/partial sync、扩展生命周期、侧聊与terminal退出，再比较IDE成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 106 | 15968 | — | — | 340087 |
| .mjs | source | 7 | 1133 | 892 | 199 | — |
| .js | source | 1 | 91 | 57 | 31 | — |
| .ts | source | 169 | 51187 | 34512 | 14854 | — |
| .tsx | source | 66 | 23728 | 16186 | 6678 | — |
| .ts | test | 168 | 42781 | 32559 | 7238 | — |
| .tsx | test | 100 | 30470 | 23528 | 4518 | — |
| .mjs | test | 1 | 227 | 150 | 56 | — |
| .js | example | 1 | 4 | 1 | 3 | — |
| .md | example | 1 | 57 | — | — | 240 |

</details>

**活跃度**

[![Issue 未关闭 161](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=161&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 129](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=129&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 97](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=97&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话工作台能否对正确目录完成文件/Git/侧聊任务，扩展与授权/失败边界支持什么采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话工作台为谁而设，当前版本与 IDE 基线是什么？

**研究主题**：场景与需求、依赖、兼容与流程、贡献与相对优势

#### 完整回答

本条是原生 DSH Host+web客户端插件 dsh-better-sidebar 0.30.1，MIT、Node>=20、pnpm@11.8.0；peer要求Cordis^4.0.5、多个DSH模块^0.2.2-rc.1及React^18.2.0。README明确当前构建需要0.2.2-rc.1+，旧Host需固定对应旧插件，不能按双方latest名称推兼容。本轮未安装发行包或Host，包声明与真实运行分开。

目标是长期在DSH对话中查文件、核Git和追问支线的开发者，合格任务是在正确目录读取/保存、理解本地与远端副作用，并知道支线结果在哪个会话。基线是成熟IDE+终端+单独Agent会话；本插件的增量是与DSH当前会话及工作树并置、开放可注销扩展服务和上下文侧聊，不是IDE全面替代或新的编码模型。

当前根提供原生右侧栏与插件自绘底部工作台，文件/编辑/Git/任务/侧聊为作者功能清单。此次复核正式前稿七题、报告及12findings，实际核文件保存/路径、常见Git写与远端、扩展注册及代表侧聊创建/续话/关闭链；不全审全部viewer、任务/team/workflow、图形渲染/媒体、所有文件变更和外部生态插件。终端使用Host服务，插件不提供自己的PTY；不能把它作为任意部署均有终端的证明。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-22](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/package.json#L1-L22)

根版本、服务/客户端入口和描述。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "dsh-better-sidebar",
  "version": "0.30.1",
  "description": "Better Sidebar for DSH — file tree, editor, changes, tasks and side chat in one column, separate for every conversation. Also exposes a service other plugins use to register sidebar tabs and file viewers.",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "https://github.com/omdsh-dev/DSH-better-sidebar"
  },
  "publishConfig": {
    "access": "public"
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

**依据 2 · 源码核查**：[package.json:38-57](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/package.json#L38-L57)

Node最低和客户端注入。

<details>
<summary>查看原文（20行）</summary>

```text
    "node": ">=20"
  },
  "packageManager": "pnpm@11.8.0",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-modules"
      ],
      "platform": "web"
    },
    "manifestVersion": 1
  },
  "files": [
```

</details>

**依据 3 · 源码核查**：[package.json:94-121](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/package.json#L94-L121)

MIT与Host/React peers和optional说明。

<details>
<summary>查看原文（28行）</summary>

```text
  "license": "MIT",
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/dsh-agent": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-locale": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-input-trigger": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-settings": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-sidebar-right": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-llm": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-session": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-settings": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-subagent": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-tools": "^0.2.2-rc.1",
    "@huanlin/dsh-plugin-better-locale": "^0.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@huanlin/dsh-plugin-better-locale": {
      "optional": true
    },
    "@deepseek-ai/dsh-client-ui-sidebar-right": {
      "optional": true
    }
```

</details>

**依据 4 · 作者声明**：[README.md:21-29](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/README.md#L21-L29)

作者工作台任务清单，不是独立效果证据。

```text
## ✨ Features

| | |
|---|---|
| **🗂️ File Management**<br/>Lazy-loading tree, git status colors, live directory watch, global search, drag-and-drop upload, multi-select batch actions, dual-source "Open with" menu.<br/><img alt="File tree with git colors" src="./docs/screenshots/files-tree.png" /><br/><img alt="Context menu: Open with + Zip and download" src="./docs/screenshots/files-menu-openwith.png" /> | **🌿 Git**<br/>Source Control (Merge / Staged / Changes groups, message box with Generate, branch + sync footer) plus a this-session AI-changes lens, with a **read-only commit graph** (lanes, branch and tag badges, branch filter, commit details) in one tab.<br/><img alt="Git: changes and commit graph with tags" src="./docs/screenshots/changes-tree.png" /> |
| **📝 Editable Editor & Previews**<br/>An editable CodeMirror (the stock preview is read-only), Markdown + Mermaid + floating outline, sandboxed HTML preview, `.jsonl` record cards, paged preview for huge files, streaming transfers with no size caps.<br/><img alt="Markdown + Mermaid preview" src="https://github.com/user-attachments/assets/fe0e5182-55bb-45cc-b98b-a2877c2bdd38" /> | **🧩 Tasks**<br/>Live subagent topology (workflow graph / tree modes) + background task list: exit codes, live output, force-kill.<br/><img alt="Tasks: subagent topology" src="https://github.com/user-attachments/assets/dcd8ed2f-59fa-405b-937b-2d250f5034dd" /> |
| **💬 Side Chat (beta)**<br/>Codex-style side threads: inherit the full parent context and run independently, realtime push, visible & revocable queue, per-thread model selection, one-click promotion to a top-level session.<br/><img alt="Side Chat" src="https://github.com/user-attachments/assets/3a338c36-f5de-4000-95f3-4b1cd04f60fc" /> | **🖥️ Bottom Workbench**<br/>A self-drawn bottom panel that coexists with the native right sidebar: drag-to-split panes, multiple terminal tabs, per-session persisted layout.<br/><img alt="Dual workbench" src="https://github.com/user-attachments/assets/dfdb875e-a1a8-4d4b-8340-353736b1708f" /> |

**Also**: 📂 the `sidebar_open` tool lets the model open the sidebar itself · ⚡ ~325KB core at startup, heavy chunks load on demand · 🌏 i18n follows DSH · 📱 narrow screens switch to a full-width drawer
```

**依据 5 · 作者声明**：[README.md:45-55](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/README.md#L45-L55)

当前与旧Host版本线必须匹配。

<details>
<summary>查看原文（11行）</summary>

```text
Then **hard-refresh the browser** (Cmd/Ctrl+Shift+R). Requires DSH **0.2.2-rc.1+**.

> **Compatibility warning — match the plugin to the host line.** As of 2026-11-04, DSH's npm `latest` is **0.2.1-rc.5** and `next` is **0.2.2-rc.1**. **v0.30.0 requires DSH 0.2.2-rc.1+**; hosts on the 0.2.1 line (**0.2.1-rc.1 ~ rc.5**, i.e. today's `latest`) must pin `dsh-better-sidebar@0.28.2` — v0.29.0 was never published to npm. DSH 0.2.1-alpha.5 users must pin `dsh-better-sidebar@0.28.0-alpha.0`, and hosts still on **0.2.0-rc.2** must pin `dsh-better-sidebar@0.26.1`. A 0.x caret never spans a minor version, so one plugin build cannot serve two host lines. The marketplace installer picks the plugin's `latest` regardless of host version, so an old host gets a version-rejection error — upgrade the host or pin the version explicitly. The two packages' `latest` tags are independent.

<details>
<summary><b>Pick the plugin version for your DSH version</b></summary>

| Your DSH version | Install command |
| --- | --- |
| **0.2.2-rc.1+** | `dsh plugin --profile web add dsh-better-sidebar@0.30.1` |
| **0.2.1-rc.1 ~ 0.2.1-rc.5** | `dsh plugin --profile web add dsh-better-sidebar@0.28.2` |
```

</details>

**依据 6 · 源码核查**：[src/index.ts:114-115](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L114-L115)

Host必需webServer/sessions/connection/tools。

```text
/** Services required before mounting: routes, sessions, native request admission, and tools. */
export const inject = ['webServer', 'sessions', 'connection', 'tools']
```

**依据 7 · 源码核查**：[src/client/builtins/tabs.tsx:292-304](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/builtins/tabs.tsx#L292-L304)

底部终端绘制与Host能力分工。

<details>
<summary>查看原文（13行）</summary>

```text
      // terminal: the plugin owns no PTY, this page is a self-drawn xterm
      // driven by the host's session-scoped terminal service
      // (src/client/terminal-client.ts), and the two terminals are separate
      // processes on purpose. `bottomOnly` is what keeps this type out of the
      // host's guide — a second "Terminal" capsule there would be the
      // shadowing the mount lane pins as absent.
      id: 'terminal-bottom',
      title: () => t('terminal'),
      description: () => t('guideDescTerminal'),
      icon: terminalTabIcon,
      // Below the four host-facing pages (10..35) and above the hidden diff
      // tab: the terminal is a secondary tool, but a visible menu row.
      order: 40,
```

</details>

#### 缺口

- 缺同版本目标用户/IDE对照与Host发行包验收。
  **影响**：不能推断反复切换负担实际降低、所有功能可用或值得持续采用。
  **进一步探讨**：用同一可丢弃修改任务对照IDE/终端，记录正确目标、修复和人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 编辑保存如何从会话路径到落盘和冲突结果？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

TextEditor 捕获提交时文本，以读取到的mtime调用fsWrite，成功采用Host新mtime、清草稿与冲突状态；fs-conflict保留冲突提示而不是强制覆盖。API实际POST文本及sessionId/path/可选cwd/mtime到/sidebar/write；Host先connection准入和POST检查，按session工作目录和活动worktree解析目标，然后readTextBody交writeWorkspaceText，错误统一wire返回。

sessionCwdOf优先附着会话的workingDirectory已提交值，其次header，冷会话读存储header，再Host默认目录、客户端绝对cwd、最后进程cwd；因此sessionId/目录切换不是以一个前端字符串永久锁定。活动worktree另按该基准解析，未附着会话直接用base。选择错误/缺失会话并不自动带来目录访问拒绝，下一题区分授权。

writeWorkspaceText先检测磁盘编码/EOL并按检测结果编码，若有expectedMtime则stat不同或文件已删除都409；基准缺失不启用该门。用随机UUID临时同级文件、wx写、rename替换，异常清临时文件，成功stat新mtime。这能避免读到半写及部分旧基准覆盖，但stat与rename分开，两个同时通过基准的写仍非原子compare-and-swap；编码检测也不等于全类型无损编辑。客户端关闭/网络断开没有此文件路由的事务回滚保证，已写字节应按磁盘核实。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/TextEditor.tsx:807-841](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/TextEditor.tsx#L807-L841)

真实提交、采用mtime、清草稿及fs-conflict分支。

<details>
<summary>查看原文（35行）</summary>

```text
    // once the host accepts it (the draft may keep changing while in flight).
    const text = view.state.doc.toString()
    savingRef.current = true
    setSaveState('saving')
    // Optimistic concurrency: the draft was based on the bytes read at
    // `mtimeMs`; a file that changed on disk since is REFUSED (fs-conflict)
    // instead of clobbering whatever wrote it (the model, another tab, an
    // external editor). `null` = the file did not exist when loaded.
    api.fsWrite(scope, path, text, mtimeRef.current ?? null).then((result) => {
      savingRef.current = false
      // Adopt the fresh baseline the host reports (absent on a stat failure —
      // keep the old one, the next save just re-checks).
      if (typeof result.mtimeMs === 'number') mtimeRef.current = result.mtimeMs
      savedTextRef.current = text
      setDraft(null)
      setDirty(false)
      setConflict(false)
      setSaveState('saved')
      // Saved: nothing is unsaved any more, so the durable backup must not
      // offer itself back on the next open.
      clearDraftBackup(scope.sessionId, path)
      // The saved bytes are a new revision of the uncommitted diff: re-read
      // the change set (the file's XY status code usually stays the same, so
      // the status store alone would never wake the gutter up again).
      setGitRevision(value => value + 1)
    }).catch((error: unknown) => {
      savingRef.current = false
      if (error instanceof SidebarApiError && error.code === 'fs-conflict') {
        setConflict(true)
        setSaveState('idle')
        return
      }
      setSaveState('failed')
    })
  }
```

</details>

**依据 2 · 源码核查**：[src/client/api.ts:338-357](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/api.ts#L338-L357)

真实文本POST与可选mtime/cwd，无保存完成前回滚协议。

<details>
<summary>查看原文（20行）</summary>

```text
async function fetchWrite(
  scope: SessionScope,
  path: string,
  content: string,
  expectedMtimeMs?: number,
): Promise<{ ok: true; mtimeMs?: number }> {
  const params = new URLSearchParams({ sessionId: scope.sessionId, path })
  if (scope.cwd !== undefined && scope.cwd !== '') params.set('cwd', scope.cwd)
  if (expectedMtimeMs !== undefined) params.set('expectedMtimeMs', String(expectedMtimeMs))
  let response: Response
  try {
    response = await fetch(hostRouteUrl(`sidebar/write?${params.toString()}`).href, {
      method: 'POST',
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      body: content,
    })
  } catch (error) {
    throw new SidebarApiError('network', error instanceof Error ? error.message : String(error))
  }
  return readEnvelope<{ ok: true; mtimeMs?: number }>(response)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1735-1772](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L1735-L1772)

Host准入/方法/session目录/mtime到实际writer与错误。

<details>
<summary>查看原文（38行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/sidebar/write',
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
        return
      }
      try {
        const url = new URL(req.url ?? '/', 'http://dsh.internal')
        const sessionId = url.searchParams.get('sessionId')
        const path = url.searchParams.get('path')
        if (sessionId === null || path === null || path === '') {
          throw new SidebarError('bad-request', 'sessionId and path are required')
        }
        const cwd = await activeWorktreeRootOf(ctx, sessionId, await sessionCwdOf(ctx, sessionId, url.searchParams.get('cwd') ?? undefined))
        // Optimistic concurrency: the client sends the mtime its draft was
        // based on. Absent = no gate (a brand-new file has no baseline).
        const raw = url.searchParams.get('expectedMtimeMs')
        const parsed = raw === null ? Number.NaN : Number(raw)
        const expectedMtimeMs = Number.isFinite(parsed) ? parsed : undefined
        const content = await readTextBody(req, WRITE_BODY_GUARD_BYTES)
        const result = await writeWorkspaceText({
          cwd,
          path,
          content,
          ...(expectedMtimeMs === undefined ? {} : { expectedMtimeMs }),
        })
        writeOk(res, { ok: true, ...result })
      } catch (error) {
        writeError(res, error)
      }
    },
  }), 'dsh-better-sidebar: /sidebar/write route')
```

</details>

**依据 4 · 源码核查**：[src/index.ts:226-255](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L226-L255)

真实会话与冷存储/default/client/process cwd优先级。

<details>
<summary>查看原文（30行）</summary>

```text
async function sessionCwdOf(ctx: Context, sessionId: string, clientCwd?: string): Promise<string> {
  const session = ctx.sessions.get(sessionId)
  // The immutable header here is the fallback, not the authority: the host's
  // committed value tracks `cd` and wins whenever it is available.
  if (session !== undefined) {
    const cwd = ctx.get('workingDirectory')?.get(session) ?? session.header.cwd
    if (cwd !== undefined && cwd !== '') return cwd
  }
  const stored = await storedHeaderCwdOf(ctx, sessionId)
  if (stored !== undefined) {
    // A corrupt relative cwd must be refused here: resolving it against the
    // host process cwd is exactly the "outside workspace" misclassification
    // the header read exists to avoid.
    try {
      return requireAbsolute(stored)
    } catch {
      throw new SidebarError('bad-request', `invalid working directory "${stored}"`)
    }
  }
  const defaultDirectory = ctx.get('workingDirectory')?.defaultDirectory
  if (defaultDirectory !== undefined && defaultDirectory !== '') return requireAbsolute(defaultDirectory)
  if (clientCwd !== undefined && clientCwd !== '') {
    try {
      return requireAbsolute(clientCwd)
    } catch {
      throw new SidebarError('bad-request', `invalid working directory "${clientCwd}"`)
    }
  }
  return process.cwd()
}
```

</details>

**依据 5 · 源码核查**：[src/active-worktree.ts:465-474](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/active-worktree.ts#L465-L474)

活动worktree解析，未附着会话用基准。

<details>
<summary>查看原文（10行）</summary>

```text
 */
export async function activeWorktreeRootOf(ctx: Context, sessionId: string, base: string): Promise<string> {
  if (base === '') return base
  const override = (process.env[ACTIVE_ROOT_OVERRIDE_ENV] ?? '').trim()
  if (override !== '' && isAbsolute(override)) return requireAbsolute(override)
  // A detached session has no live event log, and folding its STORED one means
  // decoding the whole artifact (39 MB here) for a follow-the-agent nicety the
  // workspace address already answers: while cold, the session's header cwd IS
  // the root. Attaching the session re-enables the fold on the next ask.
  if (ctx.sessions.get(sessionId) === undefined) return base
```

</details>

**依据 6 · 源码核查**：[src/fs-operations.ts:223-261](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/fs-operations.ts#L223-L261)

实际格式检测、条件mtime、独占temp/rename、异常清理与新mtime。

<details>
<summary>查看原文（39行）</summary>

```text
export async function writeWorkspaceText(input: WorkspaceWriteInput): Promise<{ mtimeMs?: number }> {
  const { cwd, path, content, expectedMtimeMs } = input
  const absolute = await ensureWorkspaceWritePath(cwd, path)
  // Detect the byte encoding AND the line ending BEFORE the temp write, so the
  // save round-trips what the file already used.
  const { encoding, eol } = await fileFormatOf(absolute)
  if (expectedMtimeMs !== undefined) {
    const current = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
    // A NUMERIC baseline can only come from a successful read of a file that
    // existed, so "no stat" is not "nothing to compare" — it means the path was
    // removed (or renamed away) while the draft was open. Reading that as "no
    // gate" wrote the draft back over the user's own deletion and re-created
    // the file (and its parent directory) with no prompt. Creating a file is a
    // different intent with its own entry points (`fs.createFile`, the upload
    // writer), so refusing here costs nothing.
    if (current !== expectedMtimeMs) {
      const why = current === undefined
        ? `no longer exists on disk (expected mtime ${expectedMtimeMs})`
        : `changed on disk since it was loaded (expected mtime ${expectedMtimeMs}, found ${current})`
      throw new SidebarError('fs-conflict', `"${absolute}" ${why}`, 409)
    }
  }
  // Per-request temp name (same pattern as writeWorkspaceUpload): a
  // pid-suffixed name is shared by every concurrent save to the same path,
  // letting two writers interleave into one temp file — and the failure-path
  // rm could delete the other writer's in-flight temp.
  const tmp = join(dirname(absolute), `.${basename(absolute)}.dsh-sidebar-tmp-${randomUUID()}.tmp`)
  try {
    await mkdir(dirname(absolute), { recursive: true })
    await writeFile(tmp, encodeText(restoreEol(content, eol), encoding), { flag: 'wx' })
    await rename(tmp, absolute)
  } catch (error) {
    await rm(tmp, { force: true }).catch(() => {})
    throw new SidebarError('fs-error', `cannot write "${absolute}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  invalidateDirectoryCache(dirname(absolute))
  // The fresh baseline the client adopts after a successful save.
  const mtimeMs = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
  return { ...(mtimeMs !== undefined ? { mtimeMs } : {}) }
```

</details>

#### 缺口

- 未执行并发、文件删除/编码或会话目录切换实验。
  **影响**：静态条件门不能证明所有竞态与Host保存结果，需要可还原副本。
  **进一步探讨**：在隔离Host使两保存同基准竞争、外部删除/改编码并切session，核目标与字节、冲突及草稿。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 会话目录是不是访问围栏，Host准入和取消意味着什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

当前ensureWorkspacePath/ensureWorkspaceWritePath的名字仍像围栏，但实现仅resolveTarget：展开~、保留绝对路径、相对路径以会话cwd拼接并词法规范化。没有realpath包含检查，_fence参数被忽略，父目录跳转和符号链接路径受OS文件权限而不是工作区限制。保存用temp rename可能替换单文件链接自身，父目录链接仍按文件系统解析；不能笼统说所有写都写到链接目标或所有会话文件都局限repo。

Host统一fence直接用ctx.connection.requestRejection，只有undefined放行；/sidebar/api还要求POST、方法必须为dispatch表自有函数。该Host准入判断与session/path授权不是同一层：此插件没有给每次文件保存另签一个目录能力凭据，也不根据会话ID证明调用者只能访问该目录。具体账号/远程会话边界由Host和OS承担，本轮未独立审Host requestRejection实现。

文件写与Git的HTTP响应关闭不统一取消：dispatcher仅对changes.ops建立随response.close中止的controller，不代表每个handler的网络取消都停止底层动作；/sidebar/write在读完正文后照常await写入。临时文件和mtime可降低部分失败损坏，但不能撤销已经rename、git commit/push或Agent工具副作用。需要严格项目隔离或共享高权限Host时，不应把“每会话工作台”当安全边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/path-security.ts:38-77](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/path-security.ts#L38-L77)

真实函数忽略fence并按lexical目标解析，不含工作区包含检查。

<details>
<summary>查看原文（40行）</summary>

```text
export async function ensureWorkspacePath(cwd: string, target: string, _fence?: boolean): Promise<string> {
  return resolveTarget(cwd, target)
}

/**
 * Resolve a path for a WRITE destination (which may not exist yet).
 *
 * Lexical only, exactly like {@link ensureWorkspacePath}: a missing target is
 * returned as the caller composed it (its parent is created on demand), and an
 * existing symlink in the path is NOT resolved — the caller writes through it,
 * which is what "no containment policy" means.
 *
 * @param cwd - Session workspace directory (the base of relative targets).
 * @param target - Client-supplied absolute or session-relative path.
 * @param _fence - IGNORED (see {@link ensureWorkspacePath}).
 * @returns The absolute destination path.
 * @deprecated The name is historical — this is now plain resolution.
 */
export async function ensureWorkspaceWritePath(cwd: string, target: string, _fence?: boolean): Promise<string> {
  return resolveTarget(cwd, target)
}

/**
 * The single resolution primitive: session-relative targets resolve under the
 * session cwd, absolute targets stay absolute, and the result is `resolve()`d
 * (lexical `..` collapse). Throws fs-error for a non-absolute result.
 */
export function resolveTarget(cwd: string, target: string): string {
  // #713: `~` names the user's home directory, not a session-relative path —
  // expand it before the join so it is not pasted after the cwd (ENOENT).
  const homeExpanded = target === '~' || target.startsWith('~/') || target.startsWith('~\\')
    ? join(homedir(), target.slice(1))
    : target
  // #646: the ecosystem passes session-relative targets (e.g. `openFile(scope,
  // 'pastes/x.txt')` keeps `pastes/x.txt` in the tab). Join them onto the
  // session cwd before the absolute check so every entry point (fs.read /
  // write / rename / remove / upload, media, html) shares ONE contract.
  const joined = isAbsolute(homeExpanded) ? homeExpanded : join(cwd, homeExpanded)
  return requireAbsolute(resolveSessionPath(cwd, joined))
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1425-1425](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L1425-L1425)

实际Host原生requestRejection准入。

```text
  const fence = (req: SidebarHttpRequest): boolean => ctx.connection.requestRejection(req) === undefined
```

**依据 3 · 源码核查**：[src/index.ts:1613-1638](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L1613-L1638)

API准入/POST/方法解析及仅changes.ops建controller。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/sidebar/api',
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname
      const method = pathname.startsWith('/sidebar/api/') ? pathname.slice('/sidebar/api/'.length) : undefined
      if (method === undefined || method.includes('/')) {
        writeError(res, new SidebarError('not-found', 'unknown sidebar API method', 404))
        return
      }
      const imagePrompt = method === 'sidechat.prompt'
      let releaseImagePrompt: (() => void) | undefined
      const admitLargePrompt = (): void => { releaseImagePrompt ??= reserveLargePrompt() }
      const controller = method === 'changes.ops' ? new AbortController() : undefined
      const response = controller === undefined ? undefined : res as ServerResponse
      const abort = (): void => { controller?.abort() }
      response?.once('close', abort)
      try {
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1648-1668](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L1648-L1668)

仅调用自有handler、按controller状态回复和移除关闭监听。

<details>
<summary>查看原文（21行）</summary>

```text
          // A chunked (or lying-header) body is counted as soon as the bytes
          // it delivered could hold an image.
          imagePrompt ? total => { if (total > SIDECHAT_METADATA_BYTES) admitLargePrompt() } : undefined,
        )
        // Own properties only. The dispatch table is an object literal, so a
        // bare lookup resolved Object.prototype members as "methods":
        // POST /sidebar/api/constructor answered 200 {}, toString answered
        // 200 "[object Undefined]", valueOf/hasOwnProperty answered 500.
        // The typeof guard also rejects a non-function own value.
        const handler = Object.hasOwn(api, method) ? api[method] : undefined
        if (typeof handler !== 'function') {
          throw new SidebarError('not-found', `unknown sidebar API method "${method}"`, 404)
        }
        const result = await handler(payload, controller?.signal)
        if (controller?.signal.aborted !== true) writeOk(res, result)
      } catch (error) {
        if (controller?.signal.aborted !== true) writeError(res, error)
      } finally {
        releaseImagePrompt?.()
        response?.off('close', abort)
      }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1754-1768](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L1754-L1768)

文件写读正文后执行writer，不接response取消事务。

<details>
<summary>查看原文（15行）</summary>

```text
        const cwd = await activeWorktreeRootOf(ctx, sessionId, await sessionCwdOf(ctx, sessionId, url.searchParams.get('cwd') ?? undefined))
        // Optimistic concurrency: the client sends the mtime its draft was
        // based on. Absent = no gate (a brand-new file has no baseline).
        const raw = url.searchParams.get('expectedMtimeMs')
        const parsed = raw === null ? Number.NaN : Number(raw)
        const expectedMtimeMs = Number.isFinite(parsed) ? parsed : undefined
        const content = await readTextBody(req, WRITE_BODY_GUARD_BYTES)
        const result = await writeWorkspaceText({
          cwd,
          path,
          content,
          ...(expectedMtimeMs === undefined ? {} : { expectedMtimeMs }),
        })
        writeOk(res, { ok: true, ...result })
      } catch (error) {
```

</details>

#### 缺口

- 目标Host的账号权限、远程请求门与跨账户隔离未核。
  **影响**：不能对共享/隧道/高权限部署承诺工作区隔离；采用限低权限本地可丢弃环境。
  **进一步探讨**：核Host实际准入与OS可达目录，隔离测试绝对/父路径及父目录链接，不用真实敏感文件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Git 的本地/远端动作是否都确认，失败后会恢复吗？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

GitLens stage/unstage逐路径调用，commit在有message/canCommit时直接api，push/pull和sync也直接runAction，没有在这些函数里二次确认；checkout同样直接发。另一些discard/revert/cherry-pick使用confirm状态，不能将它的对话框外推全部Git。runAction的锁与generation避免当前面板重复/旧作用域更新，finally在失败也刷新，因为sync可能pull成功后push失败；这不是跨客户端/外部Git的事务锁或回滚。

API消息经Host统一dispatch，git.stage/unstage/commit/push/pull/checkout解析会话cwd及可选selectedRepo，再调用git模块；stage=git add -A，unstage=reset -q，commit=commit -m，push没有额外force选项，pull --ff-only，checkout带--end-of-options防分支值当选项。runGit实际spawn git并把stderr/非零抛给调用者；部分输出查询有截断策略，不把查询guard当变更安全验证。Dubious ownership会按本次命令safe.directory重试一次，不写全局配置，但也不是保持Git首次拒绝不动。

远端push/pull会使用宿主Git配置/凭据和网络，成功不可由面板关闭撤销；--ff-only减少隐式合并但仍可改本地工作树，失败要终端人工处理。optional生成提交说明另取staged优先diff/文件列表，调用Host LLM得到草稿，UI填可编辑文本，不会因为生成就自动commit；它意味着代码差异可能发送所选模型并产生费用。这里核的是实际静态调用和UI门，不是运行了任何Git或模型操作。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/changes/GitLens.tsx:766-794](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/changes/GitLens.tsx#L766-L794)

stage/commit真实直接API调用。

<details>
<summary>查看原文（29行）</summary>

```text
  const stageEntry = (path: string | undefined, staged: boolean, merge = false): void => {
    const gitScope = gitScopeNow()
    const target = selectedWorktree
    // With conflicts, directory/all actions must only touch their own group:
    // git add/reset on the whole directory would silently resolve/reset Merge.
    const rows = staged ? stagedEntries : merge || mergeEntries.some(entry => entry.path === path) ? mergeEntries : unstagedEntries
    const paths = mergeEntries.length === 0 ? [path] : rows
      .filter(entry => path === undefined || entry.path === path || entry.path.startsWith(`${path}/`))
      .map(entry => entry.path)
    void runAction(async () => {
      for (const selectedPath of paths) {
        if (staged) await api.gitUnstage(gitScope, selectedPath, target)
        else await api.gitStage(gitScope, selectedPath, target)
      }
    }, stageError)
  }

  const stageAll = (staged: boolean, merge = false): void => { stageEntry(undefined, staged, merge) }

  const commit = (): void => {
    const message = commitMsg.trim()
    if (!canCommit || actionLock.current) return
    setCommitting(true)
    void runAction(
      () => api.gitCommit(gitScopeNow(), message, selectedWorktree),
      errorMessage,
      () => { writeDraft('') },
    )
  }
```

</details>

**依据 2 · 源码核查**：[src/client/changes/GitLens.tsx:829-851](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/changes/GitLens.tsx#L829-L851)

push/pull/sync直接调用，不统一二次确认。

<details>
<summary>查看原文（23行）</summary>

```text
  /** Push the selected checkout's branch. Local commits and the remote ride the
   *  SAME status line as every other git action — the failures share one cause
   *  (no upstream, auth, divergence), so a second error channel would only
   *  split the user's attention. */
  const push = (): void => {
    void runAction(() => api.gitPush(gitScopeNow(), selectedWorktree), pushError)
  }

  /** Pull into the selected checkout (fast-forward only host-side). */
  const pull = (): void => {
    void runAction(() => api.gitPull(gitScopeNow(), selectedWorktree), pullError)
  }

  const sync = (): void => {
    if (!canSync) return
    const gitScope = gitScopeNow()
    const target = selectedWorktree
    void runAction(async () => {
      try { await api.gitPull(gitScope, target) } catch (reason) { throw new Error(pullError(reason), { cause: reason }) }
      try { await api.gitPush(gitScope, target) } catch (reason) { throw new Error(pushError(reason), { cause: reason }) }
    })
  }

```

</details>

**依据 3 · 源码核查**：[src/client/changes/GitLens.tsx:879-913](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/changes/GitLens.tsx#L879-L913)

checkout直接执行；另有confirmPending仅用于选择的破坏动作。

<details>
<summary>查看原文（35行）</summary>

```text
  const checkout = async (branch: string): Promise<void> => {
    if (branch === (snapshot?.branch ?? '') || actionLock.current !== null) return
    const lock = Symbol()
    actionLock.current = lock
    const generation = scopeGen.current
    setBusy(true)
    setViewError(null)
    try {
      await api.gitCheckout(gitScopeNow(), branch, selectedWorktree)
      invalidateGitStatus(scope.sessionId)
      if (generation === scopeGen.current) await refresh(false)
    } catch (reason) {
      if (generation === scopeGen.current) setViewError(`${t('checkoutError')}: ${errorMessage(reason)}`)
    } finally {
      if (actionLock.current === lock) {
        actionLock.current = null
        setBusy(false)
      }
    }
  }

  /** Run one destructive operation after the confirm dialog, then refresh. */
  const runConfirmed = (confirmState: ConfirmState): void => {
    setConfirm(confirmState)
  }

  const confirmPending = (): void => {
    const pending = confirm
    if (pending === null) return
    setConfirm(null)
    void runAction(pending.onConfirm)
  }


  /** Copy `text` to the clipboard (best-effort; no visual feedback needed — the menu closes). */
```

</details>

**依据 4 · 源码核查**：[src/client/changes/GitLens.tsx:727-756](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/changes/GitLens.tsx#L727-L756)

面板action锁/generation与失败也刷新，非事务回滚。

<details>
<summary>查看原文（30行）</summary>

```text
  usePolling(visible && active, pollInventory, { intervalMs: WORKTREE_POLL_MS, mode: 'self-scheduling' })

  /** Lock one target's mutation and refresh even a partially failed sync. */
  const runAction = async (
    action: () => Promise<unknown>,
    failure: (reason: unknown) => string = errorMessage,
    onSuccess?: () => void,
  ): Promise<void> => {
    if (actionLock.current !== null) return
    const lock = Symbol()
    actionLock.current = lock
    const generation = scopeGen.current
    const sessionId = scope.sessionId
    setBusy(true)
    setActionError(null)
    try {
      await action()
      if (generation === scopeGen.current) onSuccess?.()
    } catch (reason) {
      if (generation === scopeGen.current) setActionError(failure(reason))
    } finally {
      // A Pull can succeed before Push fails: refresh on failure too.
      invalidateGitStatus(sessionId)
      if (generation === scopeGen.current) await refresh(false)
      if (actionLock.current === lock) {
        actionLock.current = null
        setBusy(false)
        setCommitting(false)
      }
    }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:954-996](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L954-L996)

真实Git写与远端Host handlers。

<details>
<summary>查看原文（43行）</summary>

```text
    'git.stage': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      const record = payload as { path?: unknown }
      const path = record.path === undefined ? undefined : requireString(payload, 'path')
      await git.stage(cwd, path, selectedRepoOf(payload))
      return { ok: true }
    },
    'git.unstage': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      const record = payload as { path?: unknown }
      const path = record.path === undefined ? undefined : requireString(payload, 'path')
      await git.unstage(cwd, path, selectedRepoOf(payload))
      return { ok: true }
    },
    'git.commit': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      const message = requireString(payload, 'message')
      await git.commit(cwd, message, selectedRepoOf(payload))
      return { ok: true }
    },
    // Ship a commit without leaving the panel. Both target the selected
    // checkout through gitCwdOf/selectedRepoOf like every other git route, and
    // both report git's own stderr: a missing upstream (push) or a diverged
    // branch (pull is --ff-only) is the user's to resolve in a terminal.
    'git.push': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      await git.push(cwd, selectedRepoOf(payload))
      return { ok: true }
    },
    'git.pull': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      await git.pull(cwd, selectedRepoOf(payload))
      return { ok: true }
    },
    'git.branch': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      return git.branches(cwd, selectedRepoOf(payload))
    },
    'git.checkout': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      await git.checkout(cwd, requireString(payload, 'branch'), selectedRepoOf(payload))
      return { ok: true }
    },
```

</details>

**依据 6 · 源码核查**：[src/git.ts:1038-1051](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/git.ts#L1038-L1051)

git add/reset/commit实际argv。

<details>
<summary>查看原文（14行）</summary>

```text
/** Stage paths (all when path is undefined). */
export async function stage(cwd: string, path: string | undefined, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['add', '-A', ...(path !== undefined ? ['--', path] : [])])
}

/** Unstage paths (all when path is undefined). */
export async function unstage(cwd: string, path: string | undefined, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['reset', '-q', ...(path !== undefined ? ['--', path] : [])])
}

/** Commit the staged changes with a message (global identity untouched). */
export async function commit(cwd: string, message: string, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['commit', '-m', message])
}
```

</details>

**依据 7 · 源码核查**：[src/git.ts:1064-1071](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/git.ts#L1064-L1071)

checkout --end-of-options。

```text
/** Switch to an existing branch.
 *  `--end-of-options` precedes the operand: without it a caller-supplied
 *  branch beginning with `-` is parsed as an OPTION, so `-f` force-discarded
 *  the worktree changes and `--work-tree=…` redirected the checkout. Same
 *  guard as show / commitDiff / revert / cherryPick (4100e16). */
export async function checkout(cwd: string, branch: string, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['checkout', '--end-of-options', branch])
}
```

**依据 8 · 源码核查**：[src/git.ts:1128-1142](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/git.ts#L1128-L1142)

实际push与ff-only pull。

<details>
<summary>查看原文（15行）</summary>

```text
/** Push the current branch to its upstream (`git push`). A branch without a
 *  tracking remote fails loudly with git's own message — the panel shows it and
 *  the user fixes the tracking in a terminal. No operands, so there is nothing
 *  for a caller-supplied value to smuggle in as an option. */
export async function push(cwd: string, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['push'])
}

/** Pull upstream changes into the current branch (`git pull --ff-only`).
 *  Fast-forward-only keeps a headless panel out of merge/conflict editors: a
 *  diverged branch fails with git's own message instead of opening an
 *  interactive merge, so the user resolves it in a terminal. */
export async function pull(cwd: string, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['pull', '--ff-only'])
}
```

</details>

**依据 9 · 源码核查**：[src/git.ts:416-432](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/git.ts#L416-L432)

真实spawn git参数与环境。

<details>
<summary>查看原文（17行）</summary>

```text
    '-C', cwd, '--no-pager', '-c', 'color.ui=false',
    // `core.quotePath=false`: emit paths verbatim instead of C-quoting them
    // (git's default turns a CJK/space path into an octal-escaped, quoted
    // string, and every diff surface renders that string as the file name).
    // The `-z`-framed porcelain callers are unaffected: git never quotes
    // NUL-framed output.
    '-c', 'core.quotePath=false',
    ...safe.flatMap(dir => ['-c', `safe.directory=${dir}`]),
    ...args,
  ]
  const maxBytes = options.maxBytes ?? GIT_OUTPUT_MAX_BYTES
  const maxNulFields = options.maxNulFields
  return new Promise<string>((resolvePromise, reject) => {
    const child = spawn('git', full, {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      env: { ...process.env, ...GIT_ENV },
```

</details>

**依据 10 · 源码核查**：[src/git.ts:502-539](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/git.ts#L502-L539)

非零失败/本次safe.directory重试。

<details>
<summary>查看原文（38行）</summary>

```text
          `git ${args[0] ?? ''} stderr exceeded ${maxBytes} bytes`,
          'git-error',
          args.join(' '),
        ))
      }
    })
    child.on('error', (error) => {
      clearTimeout(timer)
      reject(new GitCommandError(`cannot run git: ${error.message}`, 'git-error', args.join(' ')))
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      if (fieldCapped || code === 0) {
        resolvePromise(stdout)
      } else {
        reject(new GitCommandError(stderr.trim() || `git exited with ${String(code)}`, 'git-error', args.join(' ')))
      }
    })
  })
}

/**
 * Run one git command; resolves with stdout, rejects with GitCommandError.
 *
 * A dubious-ownership refusal is retried ONCE with the refused repository
 * (plus the cwd, which is the answer when the message named no path) trusted
 * for that invocation only. Anything else — including a second refusal — is
 * reported as-is, so a repository git cannot be talked into reading still
 * surfaces its real error instead of a misleading "not a git repository".
 */
export function runGit(cwd: string, args: string[], timeoutMs = 30_000, options: RunGitOptions = {}): Promise<string> {
  return spawnGit(cwd, args, timeoutMs, [], options).catch((error: unknown) => {
    if (!(error instanceof GitCommandError) || !DUBIOUS_OWNERSHIP.test(error.message)) throw error
    const refused = refusedRepository(error.message)
    const trust = refused === undefined || refused === cwd ? [cwd] : [refused, cwd]
    return spawnGit(cwd, args, timeoutMs, trust, options)
  })
}
```

</details>

**依据 11 · 源码核查**：[src/index.ts:389-423](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L389-L423)

实际Host llm.stream，含模型路由、消息及超时；非只生成计划。

<details>
<summary>查看原文（35行）</summary>

```text
 */
async function streamCommitMessage(
  ctx: Context,
  route: CommitModelRoute,
  system: string,
  user: string,
): Promise<string> {
  const llm = ctx.get('llm') as LlmServiceFace | undefined
  if (llm === undefined) {
    throw new SidebarError('git-suggest-error', 'the harness LLM service is unavailable', 503)
  }
  // Reasoning capability is read from the model itself: requesting an effort
  // a non-reasoning model does not support is rejected by the harness
  // (UNSUPPORTED_REASONING_EFFORT), so the field is omitted in that case.
  const effort = await commitReasoningEffort(llm, route)
  const assembler = new BlockAssembler()
  try {
    for await (const chunk of llm.stream({
      provider: route.provider,
      model: route.model,
      messages: [createUserMessage({
        content: [{ type: 'text', text: user }],
        // The plugin's producer-owned source kind (0.1.7 removed the shared
        // `plugin` catch-all): see SIDE_INJECTION_SOURCE_KIND.
        source: { kind: 'plugin:dsh-better-sidebar' },
      })],
      system,
      maxTokens: SUGGEST_MAX_TOKENS,
      signal: AbortSignal.timeout(SUGGEST_TIMEOUT_MS),
      ...(effort === undefined ? {} : { reasoningEffort: effort as GenerateOptions['reasoningEffort'] }),
    })) {
      assembler.push(chunk)
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
```

</details>

**依据 12 · 源码核查**：[src/index.ts:1083-1110](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L1083-L1110)

可选commit-message LLM草稿由diff/模型路由调用。

<details>
<summary>查看原文（28行）</summary>

```text
    'git.suggest-message': async (payload) => {
      const { cwd, sessionId } = await gitCwdOf(payload)
      const repoRoot = selectedRepoOf(payload)
      const language = normalizeLanguage((payload as { language?: unknown }).language)
      // Pinned first, then the conversation's own route, then the harness
      // default: a session that has not sent its first message has no
      // `request/header` yet, but the default selection is still usable.
      const route = pinnedCommitRouteOf(getSettings)
        ?? conversationModelRoute(ctx, sessionId)
        ?? defaultModelRoute(ctx)
      if (route === undefined) {
        throw new SidebarError('git-suggest-error', 'cannot resolve a model route for this conversation', 503)
      }
      const status = await git.status(cwd, repoRoot)
      const staged = status.entries.filter(entry => entry.xy[0] !== ' ' && entry.xy[0] !== '?')
      const untracked = status.entries.filter(entry => entry.xy === '??')
      const unstaged = status.entries.filter(entry => entry.xy !== '??' && entry.xy[1] !== ' ' && entry.xy[1] !== '?')
      if (staged.length === 0 && unstaged.length === 0 && untracked.length === 0) {
        throw new SidebarError('git-suggest-empty', 'no pending changes', 400)
      }
      const focus = staged.length > 0
        ? { diff: await git.diff(cwd, undefined, true, repoRoot), files: staged }
        : unstaged.length > 0
          ? { diff: await git.diff(cwd, undefined, false, repoRoot), files: unstaged }
          : { diff: '', files: untracked }
      const prompt = buildCommitPrompt(language, focus.files.map(entry => entry.path), truncateDiff(focus.diff))
      const message = await streamCommitMessage(ctx, route, prompt.system, prompt.user)
      return { message, provider: route.provider, model: route.model }
```

</details>

**依据 13 · 源码核查**：[src/client/changes/GitLens.tsx:803-823](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/changes/GitLens.tsx#L803-L823)

生成说明只写草稿，错误显示，不自动commit。

<details>
<summary>查看原文（21行）</summary>

```text
   *  fill the message box (still editable; regenerating is allowed). */
  const suggestMessage = async (): Promise<void> => {
    if (actionLock.current !== null || entries.length === 0) return
    const lock = Symbol()
    actionLock.current = lock
    const generation = scopeGen.current
    setSuggesting(true)
    setActionError(null)
    try {
      const { message } = await api.gitSuggestMessage(gitScopeNow(), isZh() ? 'zh' : 'en', selectedWorktree)
      if (generation === scopeGen.current) writeDraft(message)
    } catch (reason) {
      if (generation !== scopeGen.current) return
      if (reason instanceof SidebarApiError && reason.code === 'git-suggest-empty') {
        setActionError(t('suggestCommitEmpty'))
      } else {
        setActionError(`${t('suggestCommitError')}: ${errorMessage(reason)}`)
      }
    } finally {
      if (actionLock.current === lock) {
        actionLock.current = null
```

</details>

#### 缺口

- 未运行Git、远端认证、失败恢复或生成说明的模型/费用验收。
  **影响**：不能承诺动作可撤销或相对IDE更可靠；试用应先只读/本地单文件，远端另有明确用户授权。
  **进一步探讨**：隔离无真实remote仓库核按钮、命令失败和部分sync，另授权后才核服务与费用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 扩展生命周期与代表侧聊是否实际执行，关闭会删除吗？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

客户端每次activation新建store/service，provide betterSidebar后挂原生surface；内置tab/viewer通过与外部消费者相同register入口。registerTab/registerFileViewer拒绝重复ID，disposer只移除仍是原descriptor的条目并通知，避免旧注销误删后来者；内置注册收集disposer，Host effect释放。源码支持可复用扩展接口，不证明第三方所有插件/热重载可靠或数量等于可用性。

侧聊不是一个静态聊天框：start要求live parent，继承parent当前模型路由/已提交cwd并构造上下文seed和continuable sidechat descriptor，实际agents.create附origin=subagent、parentSession、inheritedEventCount和创建timeout；创建后clear继承ghost inbox，再inject边界上下文和followup用户问题。边界提示要求旧历史只作参考，是模型行为说明，不是文件/工具OS权限围栏。首次空问题先停在待输入状态，之后prompt可cold-resume原记录的preset，去继承ghost并按childId共享一次在途resume。

prompt返回accepted/messageId表示已入Agent输入，非回答/工具完成。cancel对live Agent调cancel({kind:user},{keepInbox:true})，保留队列；dispose标记在途admission/cold-resume取消并释放已知Agent handle，返回accepted，但会话仍持久存在且可恢复，不删除历史。普通liveThreadAgent按ID取得Agent，这层cancel并未再验证sidechat descriptor；不要把childId参数或只对image路径使用的ownedThread检查解释成每个操作都有独立子线程权限校验。Host准入仍是共同前提，未证明跨用户隔离。

底部terminal由Host webTerminals提供，available检查缺服务就不提供，onClose实际调用service.close；仅view卸载刻意保留shell以便重连，关面板不等于终止进程。终端服务内部停止/模型运行与sidechat冷恢复未执行，单独核副作用和退出后状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:166-188](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/index.tsx#L166-L188)

实际新建store/service并provide和surface。

<details>
<summary>查看原文（23行）</summary>

```text
  // then hands it to the mounted panel and closes over it in the slot
  // registrations (the official createXXXStore() factory rule — no
  // module-level singleton).
  const sidebarStore = createSidebarStore()
  // The sidebar registry service: external plugins register tab types and
  // file previewers through `ctx.betterSidebar.registerTab/registerFileViewer`.
  // Published before the panel mounts so consumers injecting 'betterSidebar'
  // are ready by the time the sidebar renders.
  const service = createBetterSidebarService(sidebarStore)
  ctx.provide('betterSidebar', service)
  ctx.effect(() => () => { disposeSidechatSurfaces(service) }, 'dsh-better-sidebar: sidechat surface adapters')
  // The native right-Sidebar surface: the plugin's content is registered as
  // DSH tab types (one per descriptor) and every open routes there, so the
  // right column belongs to the host and only the bottom workbench stays
  // plugin-owned. Both halves live for this fiber's lifetime.
  const nativeRecords = createNativeTabRecords()
  const nativeSurface = createNativeSurface(ctx, nativeRecords)
  service.setSurface(nativeSurface)
  // The optional dsh-context diagnostics: ONE controller per activation. It
  // re-proves the optional runtime faces itself, so the plugin needs no new
  // inject entry; it is threaded explicitly into the three consumers (the two
  // host slots by closure, the plugin's own React tree through the provider,
  // and the native tab bodies through the native surface's deps). On a
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:217-223](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/index.tsx#L217-L223)

内置注册通过effect管理。

```text
  // Register the plugin's own built-in tabs and viewers through the same
  // service (eating our own dogfood). The disposer unregisters them on
  // fiber disposal (HMR-safe).
  ctx.effect(
    () => registerBuiltins(ctx, service),
    'dsh-better-sidebar: register built-in tabs and viewers',
  )
```

**依据 3 · 源码核查**：[src/client/builtins/index.ts:20-37](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/builtins/index.ts#L20-L37)

内置同服务注册及返回清理。

<details>
<summary>查看原文（18行）</summary>

```text
 */
export function registerBuiltins(
  ctx: Context,
  service: BetterSidebarService,
): () => void {
  const disposers: (() => void)[] = []
  for (const tab of builtinTabs(ctx)) {
    disposers.push(service.registerTab(tab))
  }
  for (const viewer of builtinViewers()) {
    disposers.push(service.registerFileViewer(viewer))
  }
  return () => {
    for (const d of disposers) {
      try { d() } catch { /* already disposed */ }
    }
  }
}
```

</details>

**依据 4 · 源码核查**：[src/client/service.ts:953-981](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/service.ts#L953-L981)

注册重复ID拒绝与按原对象注销。

<details>
<summary>查看原文（29行）</summary>

```text
  const registerTab = (descriptor: TabDescriptor): (() => void) => {
    if (tabs.has(descriptor.id)) {
      throw new Error(`[dsh-better-sidebar] tab type "${descriptor.id}" already registered`)
    }
    tabs.set(descriptor.id, descriptor)
    notify()
    return () => {
      if (tabs.get(descriptor.id) === descriptor) {
        tabs.delete(descriptor.id)
        notify()
      }
    }
  }

  const registerFileViewer = (descriptor: FileViewerDescriptor): (() => void) => {
    if (viewers.has(descriptor.id)) {
      throw new Error(`[dsh-better-sidebar] file viewer "${descriptor.id}" already registered`)
    }
    viewers.set(descriptor.id, descriptor)
    notify()
    return () => {
      if (viewers.get(descriptor.id) === descriptor) {
        viewers.delete(descriptor.id)
        notify()
      }
    }
  }

  const getTabs = (): readonly TabDescriptor[] => Array.from(tabs.values())
```

</details>

**依据 5 · 源码核查**：[src/sidechat-routes.ts:648-673](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-routes.ts#L648-L673)

start实际live parent及当前模型/cwd继承。

<details>
<summary>查看原文（26行）</summary>

```text
    'sidechat.start': async (payload: unknown) => {
      const sessionId = requireString(payload, 'sessionId')
      const rawQuestion = (payload as { question?: unknown }).question
      const question = typeof rawQuestion === 'string' ? rawQuestion.trim() : ''
      const parent = liveThreadAgent(ctx, sessionId)
      if (parent === undefined) {
        throw new SidebarError('sidechat-error', `parent session "${sessionId}" is not running`, 409)
      }
      const parentSession = parent.session
      const workingDirectory = ctx.get('workingDirectory')
      const parentCwd = workingDirectory?.get(parentSession) ?? parentSession.header.cwd
      // The parent's CURRENT model route. agent.options freezes the
      // creation-time deployment default — a composer model switch rides
      // `model/selection` events + the session-local selection and never
      // rewrites options — so the child inherits the durable projection
      // (falling back to the options snapshot only when the log carries no
      // selection at all). Inheriting parent.options verbatim silently
      // shipped the stale default instead of the model the user sees
      // selected in the parent composer (#368).
      const parentSelection = parentModelSelection(
        parentSession.snapshotEvents() as unknown as readonly SidechatLogEvent[],
      )
      const routeProvider = parentSelection?.provider ?? parent.options.provider
      const routeModel = parentSelection?.model ?? parent.options.model
      const inheritance = buildSidechatInheritance(
        parentSession.snapshotEvents() as unknown as readonly SidechatLogEvent[],
```

</details>

**依据 6 · 源码核查**：[src/sidechat-routes.ts:735-764](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-routes.ts#L735-L764)

真实agents.create选项与失败。

<details>
<summary>查看原文（30行）</summary>

```text
      const options: CreateAgentOptions = {
        sessionId: childId,
        meta: {
          ...(parentCwd === undefined ? {} : { cwd: parentCwd }),
          parentSession: parentSession.id,
          isSeeded: true,
          origin: 'subagent',
          delegationDepth: (parentSession.header.delegationDepth ?? 0) + 1,
          ...(agentPreset === undefined ? {} : { agentPreset }),
        },
        seed: seed as unknown as readonly SessionEvent[],
        // Branded number, compile-time only: DSH Desktop's plugin-facing
        // `@deepseek-ai/dsh-session` surface carries the type but not the runtime
        // stamp, so importing the value aborts the whole host half at load time.
        // `Array#length` is a non-negative safe integer by construction — exactly
        // what the upstream stamp asserts — so the cast is lossless here.
        inheritedEventCount: seed.length as SessionLogOffset,
        agentOptions: childAgentOptions,
        setup,
        signal: AbortSignal.timeout(CREATE_TIMEOUT_MS),
      }
      const agents = ctx.get('agents') as { create(options: CreateAgentOptions): Promise<{ agent: Agent; dispose(): Promise<void> }> } | undefined
      if (agents?.create === undefined) {
        throw new SidebarError('sidechat-error', 'the agents service is unavailable', 503)
      }
      let handle: { agent: Agent; dispose(): Promise<void> }
      try {
        handle = await agents.create(options)
      } catch (error) {
        throw new SidebarError('sidechat-error', `thread creation failed: ${error instanceof Error ? error.message : String(error)}`, 500)
```

</details>

**依据 7 · 源码核查**：[src/sidechat-routes.ts:778-810](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-routes.ts#L778-L810)

清继承inbox及首个边界/问题提交。

<details>
<summary>查看原文（33行）</summary>

```text
      // costs nothing. A COLD resume cannot do this (the user may have queued
      // legitimate input before a restart) and sweeps by identity instead —
      // see dropInheritedGhosts / ensureLiveThread.
      // See docs/plans/2026-09-13-sidechat-inbox-projection-leak.md and
      // docs/plans/2026-10-12-sidechat-native-surface.md.
      handle.agent.inbox.clear()
      // Give the thread the same model-selection seam the host's composer
      // installs, seeded from the parent route it just inherited, so a later
      // per-thread switch is a ref update rather than a second install.
      ensureModelSelection(handle.agent, childId)
      // Pin the thread label so the client can identify its threads by
      // title prefix (the rename is a live-session op, no RPC fence).
      const titles = ctx.get('sessionTitle') as SidebarSessionTitleService | undefined
      const pinTitle = (label: string): void => {
        if (titles === undefined) return
        try {
          titles.rename(handle.agent.session, label)
        } catch {
          // Keep the auto-generated title; the thread stays usable.
        }
      }
      if (question === '') {
        // Codex-style immediate create: no prompt yet — the composer owns
        // the first message; the snapshot waits for it.
        if (inheritance.snapshot !== null) pendingSnapshots.set(childId, inheritance.snapshot)
        pinTitle(SIDE_NEW_THREAD_TITLE)
      } else {
        const promptParts = [SIDE_BOUNDARY_PROMPT]
        if (inheritance.snapshot !== null) promptParts.push(inheritance.snapshot)
        admitFirstContact(handle.agent, promptParts.join('\n\n'), question)
        pinTitle(sideLabel(question))
      }
      return { childId }
```

</details>

**依据 8 · 源码核查**：[src/sidechat-routes.ts:243-272](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-routes.ts#L243-L272)

实际inject与followup，异常只处理同步入队路径。

<details>
<summary>查看原文（30行）</summary>

```text
/** Admit one user message to a live agent through the stock followup path. */
function admitFollowup(agent: Agent, blocks: ContentBlock[]): string {
  const message: UserMessage = createUserMessage({ content: blocks, source: { kind: 'user' } })
  agent.followup(message)
  return message.id
}

/**
 * Deliver the thread's FIRST contact as TWO log-separated messages: the
 * boundary prompt (+ the parked in-progress snapshot) rides `agent.inject`
 * — queued model-facing context that does NOT wake the driver and is
 * claimed FIRST at the opening step (Inbox.claim drains next-step before
 * next-turn) — and the user's question is the follow-up that wakes it. The
 * log therefore records two user/message events (injection, then question)
 * instead of one wrapped blob: the transcript shows the question as a user
 * bubble and collapses the injection as a context row. The injection source
 * carries the plugin's producer-owned kind (`plugin:dsh-better-sidebar` —
 * session format v4 refuses the retired bare `kind: 'plugin'`) so recognition
 * is structural; its text still opens with SIDE_BOUNDARY_PREFIX, keeping
 * boundaryDelivered intact.
 */
function admitFirstContact(agent: Agent, injectionText: string, content: string | ContentBlock[]): string {
  const boundary = createUserMessage({ content: textPrompt(injectionText), source: { kind: SIDE_INJECTION_SOURCE_KIND } })
  agent.inject(boundary)
  try {
    return admitFollowup(agent, typeof content === 'string' ? textPrompt(content) : content)
  } catch (error) {
    agent.inbox.remove(boundary.id)
    throw error
  }
```

</details>

**依据 9 · 源码核查**：[src/sidechat-routes.ts:510-556](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-routes.ts#L510-L556)

cold resume实际preset/setup/取消及每child共用flight。

<details>
<summary>查看原文（47行）</summary>

```text
async function resumeThread(ctx: Context, childId: string, cancelled: () => boolean): Promise<Agent> {
  const live = liveThreadAgent(ctx, childId)
  if (live !== undefined) return live
  const agents = ctx.get('agents') as
    | { resume(options: ResumeAgentOptions): Promise<{ agent: Agent; dispose(): Promise<void> }> }
    | undefined
  if (agents?.resume === undefined) {
    throw new SidebarError('sidechat-error', 'the agents service is unavailable', 503)
  }
  const setup = await composePersistedSetup(ctx, childId)
  try {
    const handle = await agents.resume({ resumeSessionId: childId as SessionId, setup })
    if (cancelled()) {
      await handle.dispose()
      throw new SidebarError('sidechat-error', 'Thread was closed while resuming', 409)
    }
    threadDisposers.set(childId, () => handle.dispose())
    // A cold resume rebuilds the runtime inbox by folding the full log, so an
    // inherited prefix can resurrect the parent's already-claimed input here
    // even though the create path fenced it. Sweep it by identity BEFORE any
    // delivery — never blanket-clear, which would discard input the user
    // queued in this thread themselves.
    dropInheritedGhosts(handle.agent)
    ensureModelSelection(handle.agent, childId)
    return handle.agent
  } catch (error) {
    throw new SidebarError(
      'sidechat-error',
      `thread resume failed: ${error instanceof Error ? error.message : String(error)}`,
      500,
    )
  }
}

interface ThreadResume { promise: Promise<Agent>; cancel(): void }
const resuming = new WeakMap<Context, Map<string, ThreadResume>>()
async function ensureLiveThread(ctx: Context, childId: string): Promise<Agent> {
  const live = liveThreadAgent(ctx, childId)
  if (live !== undefined) return live
  let flights = resuming.get(ctx)
  if (flights === undefined) { flights = new Map(); resuming.set(ctx, flights) }
  const pending = flights.get(childId)
  if (pending !== undefined) return pending.promise
  let cancelled = false
  const promise = resumeThread(ctx, childId, () => cancelled).finally(() => { flights.delete(childId) })
  flights.set(childId, { promise, cancel() { cancelled = true } })
  return promise
```

</details>

**依据 10 · 源码核查**：[src/sidechat-routes.ts:836-879](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-routes.ts#L836-L879)

prompt accepted、cancel keepInbox、dispose保留持久会话。

<details>
<summary>查看原文（44行）</summary>

```text
        }
        if (signal?.aborted || activation.disposed) throw new SidebarError('sidechat-error', 'Thread was closed while sending', 409)
        const first = !boundaryDelivered(agent.session.snapshotEvents() as unknown as readonly SidechatLogEvent[]) && !boundaryPending(agent)
        const snapshot = pendingSnapshots.get(childId)
        const messageId = first
          ? admitFirstContact(agent, [SIDE_BOUNDARY_PROMPT, ...(snapshot === undefined ? [] : [snapshot])].join('\n\n'), blocks)
          : admitFollowup(agent, blocks)
        if (first) {
          pendingSnapshots.delete(childId)
          tryRenameThread(ctx, agent, sideLabel(text || 'Image'))
        }
        return { accepted: true as const, messageId }
      } finally {
        attempts.delete(activation)
        if (attempts.size === 0) admissions.delete(childId)
      }
    },

    'sidechat.cancel': async (payload: unknown) => {
      const childId = requireString(payload, 'childId')
      const agent = liveThreadAgent(ctx, childId)
      if (agent !== undefined) {
        agent.cancel({ kind: 'user' }, { keepInbox: true })
      }
      return { accepted: true as const }
    },

    'sidechat.dispose': async (payload: unknown) => {
      const childId = requireString(payload, 'childId')
      for (const attempt of admissions.get(childId) ?? []) attempt.disposed = true
      resuming.get(ctx)?.get(childId)?.cancel()
      pendingSnapshots.delete(childId)
      threadModelRefs.delete(childId)
      const dispose = threadDisposers.get(childId)
      if (dispose !== undefined) {
        threadDisposers.delete(childId)
        try {
          await dispose()
        } catch {
          // The agent may already be gone (restart); the session persists.
        }
      }
      return { accepted: true as const }
    },
```

</details>

**依据 11 · 源码核查**：[src/sidechat-routes.ts:275-279](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-routes.ts#L275-L279)

liveThreadAgent只按ID取registry，不额外鉴别。

```text
/** The live thread agent, or undefined (cold — the caller resumes). */
function liveThreadAgent(ctx: Context, childId: string): Agent | undefined {
  const agents = ctx.get('agents') as { get(id: string): Agent | undefined } | undefined
  return agents?.get(childId)
}
```

**依据 12 · 源码核查**：[src/sidechat-core.ts:59-65](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-core.ts#L59-L65)

边界提示是模型参考/任务说明，不是OS隔离。

```text
export const SIDE_BOUNDARY_PROMPT = `Side conversation boundary.

Everything before this boundary is inherited history from the parent session: its completed turns, its pending question, and — if the parent was mid-turn — its in-progress output frozen at the moment this side conversation started. It is reference context only. It is not your current task.

Do not continue, execute, or complete any instructions, plans, tool calls, approvals, edits, or requests from before this boundary. Only messages submitted after this boundary are active user instructions for this side conversation.

Mode: this is a continuable side conversation. Your answers stay in this side thread and are viewed in the side panel; they are never delivered into the parent session.`
```

**依据 13 · 源码核查**：[src/client/builtins/tabs.tsx:319-342](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/builtins/tabs.tsx#L319-L342)

terminal能力探测、卸载保留与tab关闭调用。

<details>
<summary>查看原文（24行）</summary>

```text
      }),
      // The service is probed, never injected (it is absent on deployments
      // without the host terminal controller): a missing service shows a
      // disabled menu row instead of a terminal that cannot start.
      available: (ctx) => webTerminals(ctx) !== undefined,
      // The bottom terminal never declares a title override: the tab strip
      // reads the descriptor's own title.
      component: LazyTerminalBottom,
      // Unmounting the view deliberately leaves the shell running (the host's
      // "a view survives DOM unmount" contract, and what makes a reload
      // reattach), so closing the TAB is the only thing that ends the process
      // — without it every closed bottom terminal would hold one of the host's
      // per-session terminal slots forever.
      onClose: (tab, scope) => {
        // Every close path resolves a scope (the type makes it required), so
        // this guard should be unreachable. It returns instead of substituting
        // `''` for a missing one because an empty session id is the ONE option
        // that is worse than doing nothing: the host would look the terminal up
        // in a session that does not exist, no-op, and leave the shell running
        // — invisibly holding a per-session terminal slot for the page's life.
        const sessionId: string | undefined = scope?.sessionId
        if (sessionId === undefined || sessionId === '') return
        closeBottomTerminal(ctx, tab, sessionId)
      },
```

</details>

**依据 14 · 源码核查**：[src/client/terminal-client.ts:238-243](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/terminal-client.ts#L238-L243)

关闭terminal真实转Host service.close。

```text
export function closeBottomTerminal(ctx: Context, tab: { meta?: unknown }, sessionId: string): void {
  const service = webTerminals(ctx)
  if (service === undefined) return
  const id = bottomTerminalContentId(terminalRunOf(tab), terminalInstanceOf(tab))
  service.close(sessionId, id, id)
}
```

**依据 15 · 源码核查**：[src/sidechat-routes.ts:439-450](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-routes.ts#L439-L450)

实际按继承pending IDs移除ghost，非仅helper名称。

<details>
<summary>查看原文（12行）</summary>

```text
function dropInheritedGhosts(agent: Agent): number {
  const log = agent.session.snapshotEvents() as unknown as readonly SidechatLogEvent[]
  const ghosts = new Set(inheritedPendingIds(log, Number(agent.session.inheritedEventCount)))
  if (ghosts.size === 0) return 0
  let removed = 0
  for (const message of [...agent.inbox.nextStep, ...agent.inbox.nextTurn]) {
    const id = pendingInputId(message)
    if (id === undefined || !ghosts.has(id)) continue
    if (agent.inbox.remove(id as MessageId)) removed++
  }
  return removed
}
```

</details>

**依据 16 · 源码核查**：[src/client/index.tsx:190-208](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/index.tsx#L190-L208)

原生surface实际注册与fiber释放。

<details>
<summary>查看原文（19行）</summary>

```text
  // entry point stays absent.
  const diagnostics = createContextDiagnosticsHost(ctx)
  ctx.effect(
    () => registerNativeSurface({
      ctx, store: sidebarStore, service, records: nativeRecords, diagnostics,
      reportFailure: (phase, error) => { fail(`native ${phase}`, error) },
    }),
    'dsh-better-sidebar: native right-Sidebar registrations',
  )
  // The bottom workbench's expand/collapse button in DSH's session header
  // (the header's corner seat belongs to the native sidebar's own control).
  ctx.effect(
    () => registerBottomToggle(ctx, sidebarStore),
    'dsh-better-sidebar: bottom-workbench toggle',
  )
  ctx.effect(
    () => () => { nativeSurface.dispose(); service.setSurface(undefined) },
    'dsh-better-sidebar: native right-Sidebar surface',
  )
```

</details>

#### 缺口

- 未运行外部扩展/热重载、真实Agent工具/冷恢复或terminal停止，服务端权限依赖Host。
  **影响**：只能支持接口和代表执行链判断，不能承诺子任务完成/退出无残留或账号隔离。
  **进一步探讨**：隔离Host核重复注册/注销、首轮/续聊/冷resume、keepInbox与dispose后历史，再查terminal和实际工具副作用。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样控制首次、持续、恢复和退出的负担？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

首次要核0.30.1与DSH0.2.2-rc.1系列一致、Node>=20及分块client资源能加载，正确profile并刷新。仅做文件/只读Git不需要启用模型功能，但侧聊和生成提交草稿会使用Host模型/凭据，terminal另需Host服务，外部tab/viewer还有各自依赖。本轮不把可选service存在当已可用。

持续成本包括文件监听/轮询/连接、运行的shell、多个Agent上下文/推理及人工核目录/Git状态，现金和人工分钟未知；侧聊继承上下文并另跑模型可能增加tokens，不按“少切窗口”推经济创新。文件mtime/temp降低部分损坏，但仍需Git或独立备份；远端push、terminal/Agent工具外部副作用不一定可逆。取消、关tab、停用插件作用不同：保存不回滚，sidechat cancel保inbox/持久历史，terminal仅view卸载不停止shell。

建议能确认路径和OS权限的开发者，在低权限Host和可丢弃repo先试读取、单文件编辑及只读Git，备份后比实际diff/目录和编码；需要侧聊再用虚构内容/小预算确认独立thread结果和持久状态，不直接启远端写/批量变更。版本、路径或请求门不明，或需求是强工作区隔离，就停用并回IDE/终端；退出前保存草稿、核已写文件/索引、终止不需shell/Agent并查持久会话，不把卸载当还原。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:38-57](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/package.json#L38-L57)

Node、包管理器与client注入。

<details>
<summary>查看原文（20行）</summary>

```text
    "node": ">=20"
  },
  "packageManager": "pnpm@11.8.0",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-modules"
      ],
      "platform": "web"
    },
    "manifestVersion": 1
  },
  "files": [
```

</details>

**依据 2 · 源码核查**：[package.json:94-121](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/package.json#L94-L121)

具体DSH/Cordis/React peers与optional。

<details>
<summary>查看原文（28行）</summary>

```text
  "license": "MIT",
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/dsh-agent": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-locale": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-input-trigger": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-settings": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-sidebar-right": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-llm": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-session": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-settings": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-subagent": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-tools": "^0.2.2-rc.1",
    "@huanlin/dsh-plugin-better-locale": "^0.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@huanlin/dsh-plugin-better-locale": {
      "optional": true
    },
    "@deepseek-ai/dsh-client-ui-sidebar-right": {
      "optional": true
    }
```

</details>

**依据 3 · 作者声明**：[README.md:45-55](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/README.md#L45-L55)

Host版本线和插件版本需固定匹配。

<details>
<summary>查看原文（11行）</summary>

```text
Then **hard-refresh the browser** (Cmd/Ctrl+Shift+R). Requires DSH **0.2.2-rc.1+**.

> **Compatibility warning — match the plugin to the host line.** As of 2026-11-04, DSH's npm `latest` is **0.2.1-rc.5** and `next` is **0.2.2-rc.1**. **v0.30.0 requires DSH 0.2.2-rc.1+**; hosts on the 0.2.1 line (**0.2.1-rc.1 ~ rc.5**, i.e. today's `latest`) must pin `dsh-better-sidebar@0.28.2` — v0.29.0 was never published to npm. DSH 0.2.1-alpha.5 users must pin `dsh-better-sidebar@0.28.0-alpha.0`, and hosts still on **0.2.0-rc.2** must pin `dsh-better-sidebar@0.26.1`. A 0.x caret never spans a minor version, so one plugin build cannot serve two host lines. The marketplace installer picks the plugin's `latest` regardless of host version, so an old host gets a version-rejection error — upgrade the host or pin the version explicitly. The two packages' `latest` tags are independent.

<details>
<summary><b>Pick the plugin version for your DSH version</b></summary>

| Your DSH version | Install command |
| --- | --- |
| **0.2.2-rc.1+** | `dsh plugin --profile web add dsh-better-sidebar@0.30.1` |
| **0.2.1-rc.1 ~ 0.2.1-rc.5** | `dsh plugin --profile web add dsh-better-sidebar@0.28.2` |
```

</details>

**依据 4 · 源码核查**：[src/fs-operations.ts:223-261](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/fs-operations.ts#L223-L261)

保存副作用与条件恢复边界。

<details>
<summary>查看原文（39行）</summary>

```text
export async function writeWorkspaceText(input: WorkspaceWriteInput): Promise<{ mtimeMs?: number }> {
  const { cwd, path, content, expectedMtimeMs } = input
  const absolute = await ensureWorkspaceWritePath(cwd, path)
  // Detect the byte encoding AND the line ending BEFORE the temp write, so the
  // save round-trips what the file already used.
  const { encoding, eol } = await fileFormatOf(absolute)
  if (expectedMtimeMs !== undefined) {
    const current = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
    // A NUMERIC baseline can only come from a successful read of a file that
    // existed, so "no stat" is not "nothing to compare" — it means the path was
    // removed (or renamed away) while the draft was open. Reading that as "no
    // gate" wrote the draft back over the user's own deletion and re-created
    // the file (and its parent directory) with no prompt. Creating a file is a
    // different intent with its own entry points (`fs.createFile`, the upload
    // writer), so refusing here costs nothing.
    if (current !== expectedMtimeMs) {
      const why = current === undefined
        ? `no longer exists on disk (expected mtime ${expectedMtimeMs})`
        : `changed on disk since it was loaded (expected mtime ${expectedMtimeMs}, found ${current})`
      throw new SidebarError('fs-conflict', `"${absolute}" ${why}`, 409)
    }
  }
  // Per-request temp name (same pattern as writeWorkspaceUpload): a
  // pid-suffixed name is shared by every concurrent save to the same path,
  // letting two writers interleave into one temp file — and the failure-path
  // rm could delete the other writer's in-flight temp.
  const tmp = join(dirname(absolute), `.${basename(absolute)}.dsh-sidebar-tmp-${randomUUID()}.tmp`)
  try {
    await mkdir(dirname(absolute), { recursive: true })
    await writeFile(tmp, encodeText(restoreEol(content, eol), encoding), { flag: 'wx' })
    await rename(tmp, absolute)
  } catch (error) {
    await rm(tmp, { force: true }).catch(() => {})
    throw new SidebarError('fs-error', `cannot write "${absolute}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  invalidateDirectoryCache(dirname(absolute))
  // The fresh baseline the client adopts after a successful save.
  const mtimeMs = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
  return { ...(mtimeMs !== undefined ? { mtimeMs } : {}) }
```

</details>

**依据 5 · 源码核查**：[src/sidechat-routes.ts:854-879](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/sidechat-routes.ts#L854-L879)

不同cancel/dispose意义，非数据删除。

<details>
<summary>查看原文（26行）</summary>

```text
    'sidechat.cancel': async (payload: unknown) => {
      const childId = requireString(payload, 'childId')
      const agent = liveThreadAgent(ctx, childId)
      if (agent !== undefined) {
        agent.cancel({ kind: 'user' }, { keepInbox: true })
      }
      return { accepted: true as const }
    },

    'sidechat.dispose': async (payload: unknown) => {
      const childId = requireString(payload, 'childId')
      for (const attempt of admissions.get(childId) ?? []) attempt.disposed = true
      resuming.get(ctx)?.get(childId)?.cancel()
      pendingSnapshots.delete(childId)
      threadModelRefs.delete(childId)
      const dispose = threadDisposers.get(childId)
      if (dispose !== undefined) {
        threadDisposers.delete(childId)
        try {
          await dispose()
        } catch {
          // The agent may already be gone (restart); the session persists.
        }
      }
      return { accepted: true as const }
    },
```

</details>

**依据 6 · 源码核查**：[src/client/builtins/tabs.tsx:319-342](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/builtins/tabs.tsx#L319-L342)

terminal视图卸载与关闭tab不同。

<details>
<summary>查看原文（24行）</summary>

```text
      }),
      // The service is probed, never injected (it is absent on deployments
      // without the host terminal controller): a missing service shows a
      // disabled menu row instead of a terminal that cannot start.
      available: (ctx) => webTerminals(ctx) !== undefined,
      // The bottom terminal never declares a title override: the tab strip
      // reads the descriptor's own title.
      component: LazyTerminalBottom,
      // Unmounting the view deliberately leaves the shell running (the host's
      // "a view survives DOM unmount" contract, and what makes a reload
      // reattach), so closing the TAB is the only thing that ends the process
      // — without it every closed bottom terminal would hold one of the host's
      // per-session terminal slots forever.
      onClose: (tab, scope) => {
        // Every close path resolves a scope (the type makes it required), so
        // this guard should be unreachable. It returns instead of substituting
        // `''` for a missing one because an empty session id is the ONE option
        // that is worse than doing nothing: the host would look the terminal up
        // in a session that does not exist, no-op, and leave the shell running
        // — invisibly holding a per-session terminal slot for the page's life.
        const sessionId: string | undefined = scope?.sessionId
        if (sessionId === undefined || sessionId === '') return
        closeBottomTerminal(ctx, tab, sessionId)
      },
```

</details>

**依据 7 · 源码核查**：[src/index.ts:389-423](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L389-L423)

实际Host llm.stream，含模型路由、消息及超时；非只生成计划。

<details>
<summary>查看原文（35行）</summary>

```text
 */
async function streamCommitMessage(
  ctx: Context,
  route: CommitModelRoute,
  system: string,
  user: string,
): Promise<string> {
  const llm = ctx.get('llm') as LlmServiceFace | undefined
  if (llm === undefined) {
    throw new SidebarError('git-suggest-error', 'the harness LLM service is unavailable', 503)
  }
  // Reasoning capability is read from the model itself: requesting an effort
  // a non-reasoning model does not support is rejected by the harness
  // (UNSUPPORTED_REASONING_EFFORT), so the field is omitted in that case.
  const effort = await commitReasoningEffort(llm, route)
  const assembler = new BlockAssembler()
  try {
    for await (const chunk of llm.stream({
      provider: route.provider,
      model: route.model,
      messages: [createUserMessage({
        content: [{ type: 'text', text: user }],
        // The plugin's producer-owned source kind (0.1.7 removed the shared
        // `plugin` catch-all): see SIDE_INJECTION_SOURCE_KIND.
        source: { kind: 'plugin:dsh-better-sidebar' },
      })],
      system,
      maxTokens: SUGGEST_MAX_TOKENS,
      signal: AbortSignal.timeout(SUGGEST_TIMEOUT_MS),
      ...(effort === undefined ? {} : { reasoningEffort: effort as GenerateOptions['reasoningEffort'] }),
    })) {
      assembler.push(chunk)
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
```

</details>

**依据 8 · 源码核查**：[src/index.ts:1083-1110](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/index.ts#L1083-L1110)

可选LLM草稿的diff外发入口。

<details>
<summary>查看原文（28行）</summary>

```text
    'git.suggest-message': async (payload) => {
      const { cwd, sessionId } = await gitCwdOf(payload)
      const repoRoot = selectedRepoOf(payload)
      const language = normalizeLanguage((payload as { language?: unknown }).language)
      // Pinned first, then the conversation's own route, then the harness
      // default: a session that has not sent its first message has no
      // `request/header` yet, but the default selection is still usable.
      const route = pinnedCommitRouteOf(getSettings)
        ?? conversationModelRoute(ctx, sessionId)
        ?? defaultModelRoute(ctx)
      if (route === undefined) {
        throw new SidebarError('git-suggest-error', 'cannot resolve a model route for this conversation', 503)
      }
      const status = await git.status(cwd, repoRoot)
      const staged = status.entries.filter(entry => entry.xy[0] !== ' ' && entry.xy[0] !== '?')
      const untracked = status.entries.filter(entry => entry.xy === '??')
      const unstaged = status.entries.filter(entry => entry.xy !== '??' && entry.xy[1] !== ' ' && entry.xy[1] !== '?')
      if (staged.length === 0 && unstaged.length === 0 && untracked.length === 0) {
        throw new SidebarError('git-suggest-empty', 'no pending changes', 400)
      }
      const focus = staged.length > 0
        ? { diff: await git.diff(cwd, undefined, true, repoRoot), files: staged }
        : unstaged.length > 0
          ? { diff: await git.diff(cwd, undefined, false, repoRoot), files: unstaged }
          : { diff: '', files: untracked }
      const prompt = buildCommitPrompt(language, focus.files.map(entry => entry.path), truncateDiff(focus.diff))
      const message = await streamCommitMessage(ctx, route, prompt.system, prompt.user)
      return { message, provider: route.provider, model: route.model }
```

</details>

#### 缺口

- 安装、费用/人时、真实节时、故障恢复和卸载残留没有实测。
  **影响**：不能保证净收益或长期持续采用，限可丢弃低权限试用。
  **进一步探讨**：对同一修改任务记录Host版本、正确目标、模型/终端资源、人工恢复和退出后差异，比较IDE基线。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 已有贡献与值得验证的路径授权方向分别是什么？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

可确认贡献是将DSH当前会话、文件/Git与可注销的tab/viewer接口接在同一工作台，并让侧聊实际成为继承上下文但独立继续的子会话；相对手动复制到另一个窗口，增加了会话组织和扩展接缝。工具、文件系统、Git/terminal、Agent循环均继承Host或成熟工具，不能宣称全新编码/版本控制或以生态数量证明效果。

关键质疑是Q03的准入没有真实路径范围；有mtime也不能限制已授权调用者改哪里。候选生产方向可为单次写/远端动作生成可审查目标与作用范围，基于真实路径和操作类别给可撤销能力，同时明确哪些动作已提交、哪些可回退；不是把现有sessionId或边界prompt包装成安全授权。当前代码未实现该细粒度门。

最小验证限定低权限repo：合法跨目录、父目录链接、并发mtime/rename、切会话、sidechat关闭时在途写及Git pull成功push失败，比较当前工作台+备份与候选授权。核真实落点、误拒绝、残留副作用、用户确认负担和恢复分钟；若合法跨目录任务被大面积阻断、链接仍越过批准范围或人工更难恢复，就推翻。无原型/对照，候选不计现有贡献或收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/path-security.ts:38-77](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/path-security.ts#L38-L77)

当前词法路径/无containment是候选真实路径能力方向依据。

<details>
<summary>查看原文（40行）</summary>

```text
export async function ensureWorkspacePath(cwd: string, target: string, _fence?: boolean): Promise<string> {
  return resolveTarget(cwd, target)
}

/**
 * Resolve a path for a WRITE destination (which may not exist yet).
 *
 * Lexical only, exactly like {@link ensureWorkspacePath}: a missing target is
 * returned as the caller composed it (its parent is created on demand), and an
 * existing symlink in the path is NOT resolved — the caller writes through it,
 * which is what "no containment policy" means.
 *
 * @param cwd - Session workspace directory (the base of relative targets).
 * @param target - Client-supplied absolute or session-relative path.
 * @param _fence - IGNORED (see {@link ensureWorkspacePath}).
 * @returns The absolute destination path.
 * @deprecated The name is historical — this is now plain resolution.
 */
export async function ensureWorkspaceWritePath(cwd: string, target: string, _fence?: boolean): Promise<string> {
  return resolveTarget(cwd, target)
}

/**
 * The single resolution primitive: session-relative targets resolve under the
 * session cwd, absolute targets stay absolute, and the result is `resolve()`d
 * (lexical `..` collapse). Throws fs-error for a non-absolute result.
 */
export function resolveTarget(cwd: string, target: string): string {
  // #713: `~` names the user's home directory, not a session-relative path —
  // expand it before the join so it is not pasted after the cwd (ENOENT).
  const homeExpanded = target === '~' || target.startsWith('~/') || target.startsWith('~\\')
    ? join(homedir(), target.slice(1))
    : target
  // #646: the ecosystem passes session-relative targets (e.g. `openFile(scope,
  // 'pastes/x.txt')` keeps `pastes/x.txt` in the tab). Join them onto the
  // session cwd before the absolute check so every entry point (fs.read /
  // write / rename / remove / upload, media, html) shares ONE contract.
  const joined = isAbsolute(homeExpanded) ? homeExpanded : join(cwd, homeExpanded)
  return requireAbsolute(resolveSessionPath(cwd, joined))
}
```

</details>

**依据 2 · 源码核查**：[src/fs-operations.ts:223-261](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/fs-operations.ts#L223-L261)

mtime比较与rename分开是并发边界基线。

<details>
<summary>查看原文（39行）</summary>

```text
export async function writeWorkspaceText(input: WorkspaceWriteInput): Promise<{ mtimeMs?: number }> {
  const { cwd, path, content, expectedMtimeMs } = input
  const absolute = await ensureWorkspaceWritePath(cwd, path)
  // Detect the byte encoding AND the line ending BEFORE the temp write, so the
  // save round-trips what the file already used.
  const { encoding, eol } = await fileFormatOf(absolute)
  if (expectedMtimeMs !== undefined) {
    const current = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
    // A NUMERIC baseline can only come from a successful read of a file that
    // existed, so "no stat" is not "nothing to compare" — it means the path was
    // removed (or renamed away) while the draft was open. Reading that as "no
    // gate" wrote the draft back over the user's own deletion and re-created
    // the file (and its parent directory) with no prompt. Creating a file is a
    // different intent with its own entry points (`fs.createFile`, the upload
    // writer), so refusing here costs nothing.
    if (current !== expectedMtimeMs) {
      const why = current === undefined
        ? `no longer exists on disk (expected mtime ${expectedMtimeMs})`
        : `changed on disk since it was loaded (expected mtime ${expectedMtimeMs}, found ${current})`
      throw new SidebarError('fs-conflict', `"${absolute}" ${why}`, 409)
    }
  }
  // Per-request temp name (same pattern as writeWorkspaceUpload): a
  // pid-suffixed name is shared by every concurrent save to the same path,
  // letting two writers interleave into one temp file — and the failure-path
  // rm could delete the other writer's in-flight temp.
  const tmp = join(dirname(absolute), `.${basename(absolute)}.dsh-sidebar-tmp-${randomUUID()}.tmp`)
  try {
    await mkdir(dirname(absolute), { recursive: true })
    await writeFile(tmp, encodeText(restoreEol(content, eol), encoding), { flag: 'wx' })
    await rename(tmp, absolute)
  } catch (error) {
    await rm(tmp, { force: true }).catch(() => {})
    throw new SidebarError('fs-error', `cannot write "${absolute}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  invalidateDirectoryCache(dirname(absolute))
  // The fresh baseline the client adopts after a successful save.
  const mtimeMs = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
  return { ...(mtimeMs !== undefined ? { mtimeMs } : {}) }
```

</details>

**依据 3 · 源码核查**：[src/client/service.ts:953-981](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/service.ts#L953-L981)

已有注册/注销机制是独立贡献而非未来假设。

<details>
<summary>查看原文（29行）</summary>

```text
  const registerTab = (descriptor: TabDescriptor): (() => void) => {
    if (tabs.has(descriptor.id)) {
      throw new Error(`[dsh-better-sidebar] tab type "${descriptor.id}" already registered`)
    }
    tabs.set(descriptor.id, descriptor)
    notify()
    return () => {
      if (tabs.get(descriptor.id) === descriptor) {
        tabs.delete(descriptor.id)
        notify()
      }
    }
  }

  const registerFileViewer = (descriptor: FileViewerDescriptor): (() => void) => {
    if (viewers.has(descriptor.id)) {
      throw new Error(`[dsh-better-sidebar] file viewer "${descriptor.id}" already registered`)
    }
    viewers.set(descriptor.id, descriptor)
    notify()
    return () => {
      if (viewers.get(descriptor.id) === descriptor) {
        viewers.delete(descriptor.id)
        notify()
      }
    }
  }

  const getTabs = (): readonly TabDescriptor[] => Array.from(tabs.values())
```

</details>

**依据 4 · 源码核查**：[src/client/changes/GitLens.tsx:727-756](https://github.com/omdsh-dev/DSH-better-sidebar/blob/0b6293f05145d6852428a05035d5ea0f370992be/src/client/changes/GitLens.tsx#L727-L756)

部分远端sync失败仍刷新的既有状态处理。

<details>
<summary>查看原文（30行）</summary>

```text
  usePolling(visible && active, pollInventory, { intervalMs: WORKTREE_POLL_MS, mode: 'self-scheduling' })

  /** Lock one target's mutation and refresh even a partially failed sync. */
  const runAction = async (
    action: () => Promise<unknown>,
    failure: (reason: unknown) => string = errorMessage,
    onSuccess?: () => void,
  ): Promise<void> => {
    if (actionLock.current !== null) return
    const lock = Symbol()
    actionLock.current = lock
    const generation = scopeGen.current
    const sessionId = scope.sessionId
    setBusy(true)
    setActionError(null)
    try {
      await action()
      if (generation === scopeGen.current) onSuccess?.()
    } catch (reason) {
      if (generation === scopeGen.current) setActionError(failure(reason))
    } finally {
      // A Pull can succeed before Push fails: refresh on failure too.
      invalidateGitStatus(sessionId)
      if (generation === scopeGen.current) await refresh(false)
      if (actionLock.current === lock) {
        actionLock.current = null
        setBusy(false)
        setCommitting(false)
      }
    }
```

</details>

#### 缺口

- 细粒度路径/远端能力授权没有实现、用户对照或故障实验。
  **影响**：不能推断其能减少事故且不阻合法工作。
  **进一步探讨**：先按上述可丢弃故障矩阵测落点/误拒绝/恢复成本，再决定实现。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
