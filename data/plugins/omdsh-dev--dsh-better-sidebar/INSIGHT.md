# DSH Better Sidebar

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[83faf70](https://github.com/omdsh-dev/DSH-better-sidebar/tree/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6)

<!-- BEGIN META -->
[![GitHub ★ 4,528](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C528&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/DSH-better-sidebar) [![npm 30d 182,354](https://img.shields.io/static/v1?label=npm+30d&message=182%2C354&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar)
<!-- END META -->

> **功能**：为DSH提供文件编辑预览、Git、任务和侧聊工作台，并开放标签页与预览器扩展接口。

> **亮点**：[Q03](#research-q03)识别出把会话目录、编辑和Git入口结合的工作流贡献，以及内外部页面共用的注册契约。相对IDE不是能力普遍领先，只有频繁在DSH会话中核对修改时同上下文整合才有增量。

> **主要限制**：[Q04](#research-q04)核实workspace围栏已移除，路由准入不能收窄已准入用户的文件权限。当前版本又要求明确宿主版本，不能将会话作用域或latest安装命令理解成隔离或兼容保证。

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
  - [Q01 · 谁需要在会话中同时看文件、Git和任务，怎样算办结？](#detail-section-11)
  - [Q02 · 会话作用域、路由准入和扩展页怎样连接？](#detail-section-12)
  - [Q03 · 相对原生预览和外部IDE，贡献在哪里？](#detail-section-13)
  - [Q04 · 最大的权限边界与兼容风险是什么？](#detail-section-14)
  - [Q05 · 哪些条件决定工作台能安全完成修改？](#detail-section-15)
  - [Q06 · 首次、持续与误操作恢复分别付出什么？](#detail-section-16)
  - [Q07 · 哪些模块可复用，为什么不能由保护代码推出安全沙箱？](#detail-section-17)
  - [Q08 · 能否把工作台操作范围变成显式能力而非沿用宿主全权限？](#detail-section-18)
  - [Q09 · 什么人可控试用，如何识别退出信号？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向以DSH Web进行软件修改并频繁在聊天、编辑器、Git终端之间切换的开发者。合格结果是在正确会话目录核对改动、预览/编辑文件并明确提交动作，而非仅打开面板。原办法是IDE和终端；插件提供双工作台与会话作用域入口，但成熟IDE用户可能无须替换。README的终端能力明确由宿主提供，不能把插件界面当独立PTY实现。

相对只读预览，增加编辑、Git变更入口以及插件tab/viewer扩展；相对外部IDE，主要增量是会话任务与工作目录在同一上下文切换，可减少手工定位，尚未测得节时。注册机制让内置与外部页面共用契约，比每插件独立悬浮窗更易组织。它不是完整IDE替代，也不是终端或Git算法创新；价值主要是宿主内工作流整合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件预览编辑 | 在会话中核对并修改文件 | 权限等同宿主用户，非workspace沙箱 |
| Git面板与只读图 | 查看变更和历史 | 图筛选不切分支，写操作须备份 |
| 扩展页注册 | 为插件共享工作台 | 需匹配ctx.betterSidebar契约 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH0.2.1-rc.1+与connection | 当前版必需 | 路由准入和会话服务 | 换匹配版本，不能双latest |
| 宿主文件权限 | 必需 | 编辑和上传 | 无workspace隔离 |
| 原生终端控制器 | 终端必需 | PTY功能 | 面板不能自行提供终端 |
| dsh-context | 可选 | 上下文跳转 | 不显示对应入口 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 核对宿主/插件并加载刷新 | 无重复挂载且版本匹配 |
| 2 | 在低权限副本预览与编辑 | 路径及内容正确 |
| 3 | 核对Git和备份 | 错误写入立即停止恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 隔离宿主与备份 | 版本核对/挂载/刷新 | 时间未知 |
| 持续 | 文件监测/预览资源 | 操作复核和升级 | 节时未测 |
| 失败恢复 | 文件备份或Git | 核对实际目标和写入 | 非所有文件可恢复 |
| 退出 | 修改仍保留 | 禁用插件并另恢复文件 | 不能靠停用撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话工作台 | 文件/Git/扩展接口存在 | 相比IDE净节时 |
| 上传可靠性 | 临时写和失败清理 | 并发/断电全覆盖 |
| 隔离 | 浏览器准入存在 | 不提供workspace文件沙箱 |

> **思考**：[Q04](#research-q04)核实workspace围栏已移除，路由准入不能收窄已准入用户的文件权限。当前版本又要求明确宿主版本，不能将会话作用域或latest安装命令理解成隔离或兼容保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03)识别出把会话目录、编辑和Git入口结合的工作流贡献，以及内外部页面共用的注册契约。相对IDE不是能力普遍领先，只有频繁在DSH会话中核对修改时同上下文整合才有增量。

可借鉴同步快照注册表、HMR disposer、tab去重策略和独立文件上传流式提交。文件根删除保护通过dev+ino识别同一目录而非只比路径拼写，解决别名绕过；这只是保护当前root，不是整个文件权限策略。移植应重新建立路径与准入威胁模型，旧函数名ensureWorkspacePath容易误导调用者。测试覆盖定义多但本轮未执行，不用文件数证明可靠。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)核实workspace围栏已移除，路由准入不能收窄已准入用户的文件权限。当前版本又要求明确宿主版本，不能将会话作用域或latest安装命令理解成隔离或兼容保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合希望减少DSH与IDE切换且能核对版本的开发者，先在独立低权限宿主和可丢弃目录只试文件预览、一个文本修改及只读Git图。确认实际目标路径和权限后再考虑写操作；若要求workspace隔离、出现错目录写入或版本不匹配，则停止并退回IDE/终端。停插件不撤销文件修改，已有写入用独立备份或Git核对恢复。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/client/service.ts、src/path-security.ts、src/fs-operations.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是为已准入会话另发只读/可写路径能力，绝对路径和symlink解析后都校验，危险动作展示实际目标。由Connection身份准入与无containment分离推得，目标是在保留跨目录便利时减少误操作半径。用同样的跨目录、symlink和root别名任务对照，比较合法办结率与越界拒绝率；若跨项目任务被大量破坏而用户仍绕过限制，则需否定默认严格范围策略。它不是当前已实现保护。

**分析版本**

- **仓库**：[omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)
- **版本号**：0.28.0（[固定提交 83faf70](https://github.com/omdsh-dev/DSH-better-sidebar/tree/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的路径能力边界，以真实目标与symlink一致校验减小误操作范围，需用合法跨目录任务和越界拒绝的取舍对照证伪。

未验证假设是为已准入会话另发只读/可写路径能力，绝对路径和symlink解析后都校验，危险动作展示实际目标。由Connection身份准入与无containment分离推得，目标是在保留跨目录便利时减少误操作半径。用同样的跨目录、symlink和root别名任务对照，比较合法办结率与越界拒绝率；若跨项目任务被大量破坏而用户仍绕过限制，则需否定默认严格范围策略。它不是当前已实现保护。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 90 | 14178 | — | — | 292547 |
| .mjs | source | 4 | 497 | 373 | 99 | — |
| .js | source | 1 | 91 | 57 | 31 | — |
| .ts | source | 158 | 47427 | 32153 | 13595 | — |
| .tsx | source | 64 | 22362 | 15338 | 6208 | — |
| .ts | test | 153 | 37799 | 28666 | 6515 | — |
| .tsx | test | 87 | 26976 | 20881 | 3951 | — |
| .mjs | test | 1 | 213 | 138 | 55 | — |
| .js | example | 1 | 4 | 1 | 3 | — |
| .md | example | 1 | 57 | — | — | 240 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/omdsh-dev/DSH-better-sidebar/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断DSH Better Sidebar的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要在会话中同时看文件、Git和任务，怎样算办结？

**研究主题**：场景与需求

#### 完整回答

面向以DSH Web进行软件修改并频繁在聊天、编辑器、Git终端之间切换的开发者。合格结果是在正确会话目录核对改动、预览/编辑文件并明确提交动作，而非仅打开面板。原办法是IDE和终端；插件提供双工作台与会话作用域入口，但成熟IDE用户可能无须替换。README的终端能力明确由宿主提供，不能把插件界面当独立PTY实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-33](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/README.md#L21-L33)

文件、Git、任务和终端功能声明

<details>
<summary>查看原文（13行）</summary>

```text
## ✨ Features

| | |
|---|---|
| **🗂️ File Management**<br/>Lazy-loading tree, git status colors, live directory watch, global search, drag-and-drop upload, multi-select batch actions, dual-source "Open with" menu.<br/><img alt="File tree with git colors" src="./docs/screenshots/files-tree.png" /><br/><img alt="Context menu: Open with + Zip and download" src="./docs/screenshots/files-menu-openwith.png" /> | **🌿 Git**<br/>Source Control (Merge / Staged / Changes groups, message box with Generate, branch + sync footer) plus a this-session AI-changes lens, with a **read-only commit graph** (lanes, ref badges, branch filter, commit details) in one tab.<br/><img alt="Git: hierarchical tree" src="./docs/screenshots/changes-tree.png" /> |
| **📝 Editable Editor & Previews**<br/>An editable CodeMirror (the stock preview is read-only), Markdown + Mermaid + floating outline, sandboxed HTML preview, `.jsonl` record cards, paged preview for huge files, streaming transfers with no size caps.<br/><img alt="Markdown + Mermaid preview" src="https://github.com/user-attachments/assets/fe0e5182-55bb-45cc-b98b-a2877c2bdd38" /> | **🧩 Tasks**<br/>Live subagent topology (workflow graph / tree modes) + background task list: exit codes, live output, force-kill.<br/><img alt="Tasks: subagent topology" src="https://github.com/user-attachments/assets/dcd8ed2f-59fa-405b-937b-2d250f5034dd" /> |
| **💬 Side Chat (beta)**<br/>Codex-style side threads: inherit the full parent context and run independently, realtime push, visible & revocable queue, per-thread model selection, one-click promotion to a top-level session.<br/><img alt="Side Chat" src="https://github.com/user-attachments/assets/3a338c36-f5de-4000-95f3-4b1cd04f60fc" /> | **🖥️ Bottom Workbench**<br/>A self-drawn bottom panel that coexists with the native right sidebar: drag-to-split panes, multiple terminal tabs, per-session persisted layout.<br/><img alt="Dual workbench" src="https://github.com/user-attachments/assets/dfdb875e-a1a8-4d4b-8340-353736b1708f" /> |

**Also**: 📂 the `sidebar_open` tool lets the model open the sidebar itself · ⚡ ~325KB core at startup, heavy chunks load on demand · 🌏 i18n follows DSH · 📱 narrow screens switch to a full-width drawer

### 🌿 Git Graph (read-only commit graph)

Switch to **Git Graph** at the top of the Git panel for commit nodes, forks and merge edges across local branches, remote-tracking branches and HEAD. The branch selector only filters history — it **never checks out or fetches**; each commit is one line (lane edges + ref pills + subject), hover shows the author and short hash, and selecting one opens its full message and diff in the bottom pane. History loads in pages; reference changes during pagination prompt a refresh; reads are bounded (200 commits per page, offset 10,000, 1,000 branches) and report an explicit error past a limit. This first version shows no tags and offers no history-changing actions.
```

</details>

**依据 2 · 作者声明**：[README.md:87-95](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/README.md#L87-L95)

终端依赖宿主而非自带

```text
| Symptom | Cause & fix |
|---|---|
| `Ignored build scripts` error | pnpm 11 blocked a transitive dependency's build script. Run `pnpm approve-builds` in the profile directory (`~/.dsh/profiles/web`) — this plugin itself has no build-script dependencies. |
| `minimum release age` / version younger than 24h | The release is less than 24 hours old. Wait 24h or re-run (pnpm auto-adds `minimumReleaseAgeExclude`). |
| "Profile directory not found" | Run `dsh web` once to initialize `~/.dsh/profiles/web`. |
| **Two sidebars** on the page | Double mounting. Remove the legacy manual mount line (`- insert: ... better-sidebar ...`) from `~/.dsh/profiles/web/cordis.patch.yml`; aggregate packages mounting this package under a different id are auto-yielded, no action needed. |
| Settings values gone after upgrade | Since DSH 0.1.7, preferences live on this plugin's mount row in the profile (default entry id `better-sidebar`). The plugin migrates your old `settings.yaml` values once on first start and never overwrites newer values. |
| Terminal unavailable | Terminals are provided by **DSH itself** (this plugin ships no PTY) — see DSH docs; "host provides no terminal capability" in the bottom terminal means this deployment has no terminal controller mounted. |
| `dsh: command not found` | Install DSH first; or use `npx -y --package @deepseek-ai/dsh@0.2.1-rc.1 dsh plugin --profile web add dsh-better-sidebar@0.28.0`. |
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话作用域、路由准入和扩展页怎样连接？

**研究主题**：功能与机制

#### 完整回答

Host将文件、Git、侧聊等拆为路由模块，依赖webServer、sessions、connection、tools。请求sessionId用于取权威cwd；入口使用connection.requestRejection检查浏览器准入。客户端betterSidebar服务用注册表为tab/viewer供插件扩展，并用disposer随生命周期卸载。这里的会话目录是路径解析基准，不是文件权限沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-10](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/index.ts#L1-L10)

路由准入与会话cwd设计

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-better-sidebar host half: the /sidebar JSON API (explorer listing, file
 * read/write, git), the /sidebar/file media route (images), the /sidebar/html
 * preview route, the /sidebar/bundle lazy-chunk route (client code splits),
 * and the WebSocket upgrades. Every route delegates admission to the same
 * public Connection service as the /api gateway (Host/Origin and browser
 * authentication), read per request.
 *
 * All operations are conversation-scoped: requests carry a sessionId and the
 * session's authoritative cwd comes from the session store.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:111-112](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/index.ts#L111-L112)

必需注入服务

```text
/** Services required before mounting: routes, sessions, native request admission, and tools. */
export const inject = ['webServer', 'sessions', 'connection', 'tools']
```

**依据 3 · 源码核查**：[src/index.ts:1310-1321](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/index.ts#L1310-L1321)

实际connection准入调用

<details>
<summary>查看原文（12行）</summary>

```text
 * {@link resolveSidebarConfig}.
 */
export function apply(ctx: Context, config?: SidebarConfig): void {
  const resolved = resolveSidebarConfig(config)
  // Connection owns both deployment trust and authentication; never infer or
  // bypass its policy from invocation flags or a copied trust list.
  const fence = (req: SidebarHttpRequest): boolean => ctx.connection.requestRejection(req) === undefined
  // The model-facing open-request registry: queues `sidebar_open` requests
  // per session and pushes them to connected sidebar views over the
  // `/sidebar/ws/agent-opens` socket.
  const agentOpenRegistry = new AgentOpenRegistry()

```

</details>

**依据 4 · 源码核查**：[src/client/service.ts:1-20](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/client/service.ts#L1-L20)

注册表与disposer

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * The BetterSidebar client service: a registry that external plugins use
 * to contribute sidebar tab types and file previewers. The service is
 * published to the cordis context as `ctx.betterSidebar` (see
 * {@link ../context-types.ts}); consumers declare it in `inject` and call
 * `registerTab` / `registerFileViewer`, both returning a disposer that
 * cordis auto-invokes on fiber disposal (HMR-safe).
 *
 * Design notes:
 * - The registry is synchronous-snapshot (Map + listener set) so React
 *   can read it through `useSyncExternalStore` without tearing.
 * - `dedupeKey` unifies the three open-tab strategies the builtins used to
 *   hardcode: single-instance (`() => type`), per-path (`tab => tab.path`),
 *   and per-id (`tab => tab.id` for diff tabs whose id is change-derived).
 *   `single: true` is sugar for `dedupeKey: () => id`.
 * - `createTab` lets a descriptor own tab instantiation (the side chat
 *   builtin uses it to mint one `sidechat:<threadId>` tab per thread).
 * - `matchFileViewer` walks descriptors in priority order (desc, stable):
 *   per descriptor it tries `detect` first (when `head` bytes are given),
 *   then `exts`; `exts: []` is a catch-all that matches any path.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生预览和外部IDE，贡献在哪里？

**研究主题**：贡献与相对优势

#### 完整回答

相对只读预览，增加编辑、Git变更入口以及插件tab/viewer扩展；相对外部IDE，主要增量是会话任务与工作目录在同一上下文切换，可减少手工定位，尚未测得节时。注册机制让内置与外部页面共用契约，比每插件独立悬浮窗更易组织。它不是完整IDE替代，也不是终端或Git算法创新；价值主要是宿主内工作流整合。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-29](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/README.md#L25-L29)

对比原生只读与工作台

```text
| **🗂️ File Management**<br/>Lazy-loading tree, git status colors, live directory watch, global search, drag-and-drop upload, multi-select batch actions, dual-source "Open with" menu.<br/><img alt="File tree with git colors" src="./docs/screenshots/files-tree.png" /><br/><img alt="Context menu: Open with + Zip and download" src="./docs/screenshots/files-menu-openwith.png" /> | **🌿 Git**<br/>Source Control (Merge / Staged / Changes groups, message box with Generate, branch + sync footer) plus a this-session AI-changes lens, with a **read-only commit graph** (lanes, ref badges, branch filter, commit details) in one tab.<br/><img alt="Git: hierarchical tree" src="./docs/screenshots/changes-tree.png" /> |
| **📝 Editable Editor & Previews**<br/>An editable CodeMirror (the stock preview is read-only), Markdown + Mermaid + floating outline, sandboxed HTML preview, `.jsonl` record cards, paged preview for huge files, streaming transfers with no size caps.<br/><img alt="Markdown + Mermaid preview" src="https://github.com/user-attachments/assets/fe0e5182-55bb-45cc-b98b-a2877c2bdd38" /> | **🧩 Tasks**<br/>Live subagent topology (workflow graph / tree modes) + background task list: exit codes, live output, force-kill.<br/><img alt="Tasks: subagent topology" src="https://github.com/user-attachments/assets/dcd8ed2f-59fa-405b-937b-2d250f5034dd" /> |
| **💬 Side Chat (beta)**<br/>Codex-style side threads: inherit the full parent context and run independently, realtime push, visible & revocable queue, per-thread model selection, one-click promotion to a top-level session.<br/><img alt="Side Chat" src="https://github.com/user-attachments/assets/3a338c36-f5de-4000-95f3-4b1cd04f60fc" /> | **🖥️ Bottom Workbench**<br/>A self-drawn bottom panel that coexists with the native right sidebar: drag-to-split panes, multiple terminal tabs, per-session persisted layout.<br/><img alt="Dual workbench" src="https://github.com/user-attachments/assets/dfdb875e-a1a8-4d4b-8340-353736b1708f" /> |

**Also**: 📂 the `sidebar_open` tool lets the model open the sidebar itself · ⚡ ~325KB core at startup, heavy chunks load on demand · 🌏 i18n follows DSH · 📱 narrow screens switch to a full-width drawer
```

**依据 2 · 源码核查**：[src/client/service.ts:1-20](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/client/service.ts#L1-L20)

统一页面与viewer注册策略

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * The BetterSidebar client service: a registry that external plugins use
 * to contribute sidebar tab types and file previewers. The service is
 * published to the cordis context as `ctx.betterSidebar` (see
 * {@link ../context-types.ts}); consumers declare it in `inject` and call
 * `registerTab` / `registerFileViewer`, both returning a disposer that
 * cordis auto-invokes on fiber disposal (HMR-safe).
 *
 * Design notes:
 * - The registry is synchronous-snapshot (Map + listener set) so React
 *   can read it through `useSyncExternalStore` without tearing.
 * - `dedupeKey` unifies the three open-tab strategies the builtins used to
 *   hardcode: single-instance (`() => type`), per-path (`tab => tab.path`),
 *   and per-id (`tab => tab.id` for diff tabs whose id is change-derived).
 *   `single: true` is sugar for `dedupeKey: () => id`.
 * - `createTab` lets a descriptor own tab instantiation (the side chat
 *   builtin uses it to mint one `sidechat:<threadId>` tab per thread).
 * - `matchFileViewer` walks descriptors in priority order (desc, stable):
 *   per descriptor it tries `detect` first (when `head` bytes are given),
 *   then `exts`; `exts: []` is a catch-all that matches any path.
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 最大的权限边界与兼容风险是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

path-security明确取消workspace containment，ensureWorkspacePath只是路径解析，允许到宿主OS用户可达路径，写目的地可穿过symlink。这是已核实设计边界，不可称会话隔离。Connection准入只约束谁访问，不能限制已准入用户读写范围；敏感或多用户场景需要独立低权限宿主。README还明确插件0.28与宿主latest不兼容，不能随意双latest升级。

#### 证据与依据

**依据 1 · 源码核查**：[src/path-security.ts:1-18](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/path-security.ts#L1-L18)

明确取消路径围栏

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Lexical path resolution for the sidebar's filesystem routes.
 *
 * ⚠️ **This module no longer enforces workspace containment.** It used to
 * canonicalize through `realpath` and reject anything outside the session
 * workspace; the user asked for that guard to be removed, so the sidebar fs
 * routes now reach any path the HOST USER can reach, bounded only by OS
 * permissions (and by the browser-trust fence on the routes themselves).
 *
 * What remains is the part every caller still needs: turn the client's
 * (possibly session-relative) target into one absolute, lexically-normalized
 * path. `resolveSessionPath` joins it under the session cwd, `resolve()`
 * collapses `.` / `..` segments, and {@link requireAbsolute} rejects
 * non-absolute input. No `realpath`, no `isWithin`, no 403.
 *
 * Kept as one module (and the old names kept) so the call sites read the same
 * way they did with the fence: the change is the SEMANTICS — "resolve" rather
 * than "guard".
```

</details>

**依据 2 · 源码核查**：[src/path-security.ts:38-57](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/path-security.ts#L38-L57)

读写旧guard名称实际只解析

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[README.md:39-62](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/README.md#L39-L62)

宿主/插件版本匹配表

<details>
<summary>查看原文（24行）</summary>

````text
## 🚀 Installation

```sh
dsh plugin --profile web add dsh-better-sidebar@latest
```

Then **hard-refresh the browser** (Cmd/Ctrl+Shift+R). Requires DSH **0.2.1-rc.1+**.

> **Compatibility warning — v0.28.0 will take over this plugin's npm `latest`.** DSH's own npm `latest` still points to **0.2.0-rc.2**, which is **not compatible** with v0.28.0. On that host, pin `dsh-better-sidebar@0.26.1` instead of using the command above. DSH 0.2.1-alpha.5 users must pin `dsh-better-sidebar@0.28.0-alpha.0`. Upgrade the host explicitly to `0.2.1-rc.1` before installing v0.28.0; the two packages' `latest` tags are independent.

<details>
<summary><b>Pick the plugin version for your DSH version</b></summary>

| Your DSH version | Install command |
| --- | --- |
| **0.2.1-rc.1+** | `dsh plugin --profile web add dsh-better-sidebar@0.28.0` |
| **0.2.1-alpha.5** | `dsh plugin --profile web add dsh-better-sidebar@0.28.0-alpha.0` |
| **0.2.0-rc.2** | `dsh plugin --profile web add dsh-better-sidebar@0.26.1` |
| **0.2.0-rc.1** | `dsh plugin --profile web add dsh-better-sidebar@0.24.1` |
| **0.1.7-rc.1 ~ 0.1.7 stable** | `dsh plugin --profile web add dsh-better-sidebar@0.22.1` |
| 0.1.7-alpha.x | No compatible release — upgrade DSH to rc.1 first |
| 0.1.6 and earlier (incl. the 0.1.5 line) | `dsh plugin --profile web add dsh-better-sidebar@0.19.1` |

Always pin **exact versions** for older releases (`latest` moves forward with each new stable). Replace `web` with your own profile name.
````

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些条件决定工作台能安全完成修改？

**研究主题**：依赖、兼容与流程

#### 完整回答

必须匹配DSH0.2.1-rc.1+这组宿主API与connection服务，老宿主需要对应插件旧版而非当前固定版。终端控制器、可选dsh-context和其它消费插件分别是特定能力依赖。文件操作权限等同宿主进程，用户应在隔离低权限工作目录试用；Git、编辑和删除需要自己的备份/版本控制。安装后hard-refresh，不应把客户端缓存残留当源码问题。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-62](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/README.md#L35-L62)

可选context与安装版本条件

<details>
<summary>查看原文（28行）</summary>

````text
### 🧭 dsh-context diagnostics (optional)

With the `dsh-context` plugin installed, three places offer a one-click jump into that conversation's **Context** view: an agent node's detail card on the Tasks page, a background job's output window (the job's real owner session — never merely the session its row was watched under), and the session header. The entries **appear only** while dsh-context's `Context` page is actually registered: a deployment without it (or with that page hidden) shows no control at all, and while one jump is in flight every entry point is disabled. A failed jump is reported once, in a dismissible alert at the frame's bottom edge; nothing is polled while idle.

## 🚀 Installation

```sh
dsh plugin --profile web add dsh-better-sidebar@latest
```

Then **hard-refresh the browser** (Cmd/Ctrl+Shift+R). Requires DSH **0.2.1-rc.1+**.

> **Compatibility warning — v0.28.0 will take over this plugin's npm `latest`.** DSH's own npm `latest` still points to **0.2.0-rc.2**, which is **not compatible** with v0.28.0. On that host, pin `dsh-better-sidebar@0.26.1` instead of using the command above. DSH 0.2.1-alpha.5 users must pin `dsh-better-sidebar@0.28.0-alpha.0`. Upgrade the host explicitly to `0.2.1-rc.1` before installing v0.28.0; the two packages' `latest` tags are independent.

<details>
<summary><b>Pick the plugin version for your DSH version</b></summary>

| Your DSH version | Install command |
| --- | --- |
| **0.2.1-rc.1+** | `dsh plugin --profile web add dsh-better-sidebar@0.28.0` |
| **0.2.1-alpha.5** | `dsh plugin --profile web add dsh-better-sidebar@0.28.0-alpha.0` |
| **0.2.0-rc.2** | `dsh plugin --profile web add dsh-better-sidebar@0.26.1` |
| **0.2.0-rc.1** | `dsh plugin --profile web add dsh-better-sidebar@0.24.1` |
| **0.1.7-rc.1 ~ 0.1.7 stable** | `dsh plugin --profile web add dsh-better-sidebar@0.22.1` |
| 0.1.7-alpha.x | No compatible release — upgrade DSH to rc.1 first |
| 0.1.6 and earlier (incl. the 0.1.5 line) | `dsh plugin --profile web add dsh-better-sidebar@0.19.1` |

Always pin **exact versions** for older releases (`latest` moves forward with each new stable). Replace `web` with your own profile name.
````

</details>

**依据 2 · 作者声明**：[README.md:87-95](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/README.md#L87-L95)

重复挂载与终端缺失排障

```text
| Symptom | Cause & fix |
|---|---|
| `Ignored build scripts` error | pnpm 11 blocked a transitive dependency's build script. Run `pnpm approve-builds` in the profile directory (`~/.dsh/profiles/web`) — this plugin itself has no build-script dependencies. |
| `minimum release age` / version younger than 24h | The release is less than 24 hours old. Wait 24h or re-run (pnpm auto-adds `minimumReleaseAgeExclude`). |
| "Profile directory not found" | Run `dsh web` once to initialize `~/.dsh/profiles/web`. |
| **Two sidebars** on the page | Double mounting. Remove the legacy manual mount line (`- insert: ... better-sidebar ...`) from `~/.dsh/profiles/web/cordis.patch.yml`; aggregate packages mounting this package under a different id are auto-yielded, no action needed. |
| Settings values gone after upgrade | Since DSH 0.1.7, preferences live on this plugin's mount row in the profile (default entry id `better-sidebar`). The plugin migrates your old `settings.yaml` values once on first start and never overwrites newer values. |
| Terminal unavailable | Terminals are provided by **DSH itself** (this plugin ships no PTY) — see DSH docs; "host provides no terminal capability" in the bottom terminal means this deployment has no terminal controller mounted. |
| `dsh: command not found` | Install DSH first; or use `npx -y --package @deepseek-ai/dsh@0.2.1-rc.1 dsh plugin --profile web add dsh-better-sidebar@0.28.0`. |
```

**依据 3 · 源码核查**：[src/index.ts:111-112](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/index.ts#L111-L112)

宿主服务依赖

```text
/** Services required before mounting: routes, sessions, native request admission, and tools. */
export const inject = ['webServer', 'sessions', 'connection', 'tools']
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与误操作恢复分别付出什么？

**研究主题**：效果与总成本

#### 完整回答

首次要核对宿主版本、profile和重复挂载，刷新浏览器；持续承担编辑/Git操作及插件适配成本。上传用唯一临时文件和rename，失败清理临时文件，但成功的覆盖与普通删除不因此具备历史恢复。目标文件可在workspace外，风险损失不能视为低成本；退出可以关插件但文件已变需要独立备份/Git恢复。耗时、内存和收益未测，README性能数不视为本次结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/fs-operations.ts:58-118](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/fs-operations.ts#L58-L118)

上传临时文件与最后rename，失败清理

<details>
<summary>查看原文（61行）</summary>

```text
/**
 * Stream `chunks` into `dir/relativePath` atomically: a uniquely named temp
 * sibling receives the bytes, then is renamed over the target. The parent
 * directory is created on demand (recursive), so folder uploads work before
 * any level exists. The unique temp name keeps concurrent uploads to the same
 * target independent (each writes and renames its own file; the last rename
 * wins) and never blocks later uploads after a crashed process.
 *
 * There is NO size cap: the bytes flow through a bounded write stream, so a
 * 100 GB upload costs the host the same memory as a 1 KB one. A failed or
 * aborted upload still leaves neither a partial target nor a temp file.
 *
 * @throws SidebarError with a wire code for shape failures; the temp file is
 * always removed on failure.
 */
export async function writeWorkspaceUpload(input: WorkspaceUploadInput): Promise<{ path: string; size: number }> {
  const { cwd, dir, relativePath, chunks } = input
  // The shared resolution contract: an absolute `dir` normalizes, a
  // session-relative one joins the cwd, `~` expands against the home (#713).
  const base = resolveTarget(cwd, dir)
  if (relativePath === '' || relativePath.startsWith('/') || relativePath.startsWith('\\')) {
    throw new SidebarError('bad-request', 'relativePath must stay below the upload directory', 400)
  }
  const segments = relativePath.split(/[\\/]/)
  if (segments.some(part => part === '' || part === '.' || part === '..')) {
    throw new SidebarError('bad-request', 'relativePath must stay below the upload directory', 400)
  }
  const target = join(base, ...segments)
  const safeTarget = await ensureWorkspaceWritePath(cwd, target)
  const tmp = join(dirname(safeTarget), `.${basename(safeTarget)}.dsh-upload-${randomUUID()}.tmp`)
  await mkdir(dirname(safeTarget), { recursive: true })
  const stream = createWriteStream(tmp, { flags: 'wx' })
  // Resolves once the stream fully closes; created up front so a stream that
  // already closed (successful end, later failure) cannot leave the wait hanging.
  const closed = new Promise<void>((resolve) => { stream.once('close', () => resolve()) })
  let streamError: unknown
  // A permanent 'error' listener keeps a failing disk from crashing the host:
  // every await below surfaces the failure through the promise chain instead.
  stream.on('error', (error) => { streamError = error })
  try {
    for await (const chunk of chunks) {
      const buffer = Buffer.from(chunk)
      if (!stream.write(buffer)) await once(stream, 'drain')
      if (streamError !== undefined) throw streamError
    }
    await new Promise<void>((resolve, reject) => {
      stream.end((error?: Error | null) => (error === undefined || error === null ? resolve() : reject(error)))
    })
    if (streamError !== undefined) throw streamError
    await rename(tmp, safeTarget)
    const info = await stat(safeTarget)
    // The target's level (and, for a new folder, its parent) is now stale.
    invalidateDirectoryCache(dirname(safeTarget))
    return { path: target, size: info.size }
  } catch (error) {
    // Wait for the stream to fully close before unlinking (Windows locks open
    // files), then remove our own uniquely named temp file.
    stream.destroy()
    await closed.catch(() => {})
    await rm(tmp, { force: true }).catch(() => {})
    throw error
```

</details>

**依据 2 · 源码核查**：[src/path-security.ts:43-57](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/path-security.ts#L43-L57)

写路径不做containment

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 3 · 作者声明**：[README.md:87-95](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/README.md#L87-L95)

安装排障与状态迁移

```text
| Symptom | Cause & fix |
|---|---|
| `Ignored build scripts` error | pnpm 11 blocked a transitive dependency's build script. Run `pnpm approve-builds` in the profile directory (`~/.dsh/profiles/web`) — this plugin itself has no build-script dependencies. |
| `minimum release age` / version younger than 24h | The release is less than 24 hours old. Wait 24h or re-run (pnpm auto-adds `minimumReleaseAgeExclude`). |
| "Profile directory not found" | Run `dsh web` once to initialize `~/.dsh/profiles/web`. |
| **Two sidebars** on the page | Double mounting. Remove the legacy manual mount line (`- insert: ... better-sidebar ...`) from `~/.dsh/profiles/web/cordis.patch.yml`; aggregate packages mounting this package under a different id are auto-yielded, no action needed. |
| Settings values gone after upgrade | Since DSH 0.1.7, preferences live on this plugin's mount row in the profile (default entry id `better-sidebar`). The plugin migrates your old `settings.yaml` values once on first start and never overwrites newer values. |
| Terminal unavailable | Terminals are provided by **DSH itself** (this plugin ships no PTY) — see DSH docs; "host provides no terminal capability" in the bottom terminal means this deployment has no terminal controller mounted. |
| `dsh: command not found` | Install DSH first; or use `npx -y --package @deepseek-ai/dsh@0.2.1-rc.1 dsh plugin --profile web add dsh-better-sidebar@0.28.0`. |
```

#### 缺口

- 当前宿主版本的全周期操作耗时、误改恢复率未知
  **影响**：无法证明工作台比IDE端到端更省且可恢复
  **进一步探讨**：在可丢弃目录执行改名/覆盖/删除与断网，比较IDE任务及备份恢复

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些模块可复用，为什么不能由保护代码推出安全沙箱？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴同步快照注册表、HMR disposer、tab去重策略和独立文件上传流式提交。文件根删除保护通过dev+ino识别同一目录而非只比路径拼写，解决别名绕过；这只是保护当前root，不是整个文件权限策略。移植应重新建立路径与准入威胁模型，旧函数名ensureWorkspacePath容易误导调用者。测试覆盖定义多但本轮未执行，不用文件数证明可靠。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/service.ts:1-20](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/client/service.ts#L1-L20)

快照和去重设计

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * The BetterSidebar client service: a registry that external plugins use
 * to contribute sidebar tab types and file previewers. The service is
 * published to the cordis context as `ctx.betterSidebar` (see
 * {@link ../context-types.ts}); consumers declare it in `inject` and call
 * `registerTab` / `registerFileViewer`, both returning a disposer that
 * cordis auto-invokes on fiber disposal (HMR-safe).
 *
 * Design notes:
 * - The registry is synchronous-snapshot (Map + listener set) so React
 *   can read it through `useSyncExternalStore` without tearing.
 * - `dedupeKey` unifies the three open-tab strategies the builtins used to
 *   hardcode: single-instance (`() => type`), per-path (`tab => tab.path`),
 *   and per-id (`tab => tab.id` for diff tabs whose id is change-derived).
 *   `single: true` is sugar for `dedupeKey: () => id`.
 * - `createTab` lets a descriptor own tab instantiation (the side chat
 *   builtin uses it to mint one `sidechat:<threadId>` tab per thread).
 * - `matchFileViewer` walks descriptors in priority order (desc, stable):
 *   per descriptor it tries `detect` first (when `head` bytes are given),
 *   then `exts`; `exts: []` is a catch-all that matches any path.
```

</details>

**依据 2 · 源码核查**：[src/fs-operations.ts:245-275](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/fs-operations.ts#L245-L275)

root身份保护

<details>
<summary>查看原文（31行）</summary>

```text
/**
 * Whether `target` IS the workspace root. Comparing the two SPELLINGS is not
 * enough: the resolution above is deliberately lexical (a symlink row must
 * keep addressing the LINK, not its target), and one directory has many
 * spellings — a case variant, a `\\?\` prefix, an 8.3 short name, a mapped
 * drive. Each of them walked straight past this guard and turned "delete this
 * row" into a recursive delete of the whole project. `dev`+`ino` is the
 * identity the filesystem itself uses, and it does not care how the path is
 * spelled — read as `bigint`, because the file id is 64-bit and a JS number
 * rounds it above 2^53, at which point two unrelated entries compare equal and
 * a legitimate delete is refused as "the workspace root".
 *
 * `lstat` (not `stat`) is deliberate, and so is the removal below using the
 * same call: the question is whether THIS ENTRY is the root, so a symlink is
 * its own identity, never its target's. A link pointed at the root therefore
 * stays deletable — only the link goes, no recursion — which is what the
 * string compare did. The spellings above, the actual way a project was lost,
 * are all still refused. A target that cannot be lstat'ed (it may legitimately
 * be gone) falls back to the spelling.
 */
async function isWorkspaceRoot(target: string, root: string): Promise<boolean> {
  try {
    const [entry, base] = await Promise.all([
      lstat(target, { bigint: true }),
      lstat(root, { bigint: true }),
    ])
    // No inode = no identity: fall back to the spelling.
    if (entry.ino === 0n || base.ino === 0n) return sameSpelling(target, root)
    return entry.dev === base.dev && entry.ino === base.ino
  } catch {
    return sameSpelling(target, root)
```

</details>

**依据 3 · 源码核查**：[src/path-security.ts:25-57](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/path-security.ts#L25-L57)

guard旧名但语义已改变

<details>
<summary>查看原文（33行）</summary>

```text
/**
 * Resolve an existing path to one absolute, lexically-normalized target.
 *
 * @param cwd - Session workspace directory (the base of relative targets).
 * @param target - Client-supplied absolute or session-relative path.
 * @param _fence - IGNORED. Kept as a positional parameter so every call site
 *  (and the route tests) did not have to change shape in the same commit; the
 *  containment decision it used to carry is gone for good. New code should
 *  omit it.
 * @returns The absolute path used for the filesystem operation.
 * @deprecated The name is historical — this is now plain resolution. Use
 *  {@link resolveTarget} in new code.
 */
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
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否把工作台操作范围变成显式能力而非沿用宿主全权限？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为已准入会话另发只读/可写路径能力，绝对路径和symlink解析后都校验，危险动作展示实际目标。由Connection身份准入与无containment分离推得，目标是在保留跨目录便利时减少误操作半径。用同样的跨目录、symlink和root别名任务对照，比较合法办结率与越界拒绝率；若跨项目任务被大量破坏而用户仍绕过限制，则需否定默认严格范围策略。它不是当前已实现保护。

#### 证据与依据

**依据 1 · 源码核查**：[src/path-security.ts:1-18](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/path-security.ts#L1-L18)

准入不等于路径隔离

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Lexical path resolution for the sidebar's filesystem routes.
 *
 * ⚠️ **This module no longer enforces workspace containment.** It used to
 * canonicalize through `realpath` and reject anything outside the session
 * workspace; the user asked for that guard to be removed, so the sidebar fs
 * routes now reach any path the HOST USER can reach, bounded only by OS
 * permissions (and by the browser-trust fence on the routes themselves).
 *
 * What remains is the part every caller still needs: turn the client's
 * (possibly session-relative) target into one absolute, lexically-normalized
 * path. `resolveSessionPath` joins it under the session cwd, `resolve()`
 * collapses `.` / `..` segments, and {@link requireAbsolute} rejects
 * non-absolute input. No `realpath`, no `isWithin`, no 403.
 *
 * Kept as one module (and the old names kept) so the call sites read the same
 * way they did with the fence: the change is the SEMANTICS — "resolve" rather
 * than "guard".
```

</details>

**依据 2 · 源码核查**：[src/fs-operations.ts:245-275](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/fs-operations.ts#L245-L275)

对象身份保护可作设计线索

<details>
<summary>查看原文（31行）</summary>

```text
/**
 * Whether `target` IS the workspace root. Comparing the two SPELLINGS is not
 * enough: the resolution above is deliberately lexical (a symlink row must
 * keep addressing the LINK, not its target), and one directory has many
 * spellings — a case variant, a `\\?\` prefix, an 8.3 short name, a mapped
 * drive. Each of them walked straight past this guard and turned "delete this
 * row" into a recursive delete of the whole project. `dev`+`ino` is the
 * identity the filesystem itself uses, and it does not care how the path is
 * spelled — read as `bigint`, because the file id is 64-bit and a JS number
 * rounds it above 2^53, at which point two unrelated entries compare equal and
 * a legitimate delete is refused as "the workspace root".
 *
 * `lstat` (not `stat`) is deliberate, and so is the removal below using the
 * same call: the question is whether THIS ENTRY is the root, so a symlink is
 * its own identity, never its target's. A link pointed at the root therefore
 * stays deletable — only the link goes, no recursion — which is what the
 * string compare did. The spellings above, the actual way a project was lost,
 * are all still refused. A target that cannot be lstat'ed (it may legitimately
 * be gone) falls back to the spelling.
 */
async function isWorkspaceRoot(target: string, root: string): Promise<boolean> {
  try {
    const [entry, base] = await Promise.all([
      lstat(target, { bigint: true }),
      lstat(root, { bigint: true }),
    ])
    // No inode = no identity: fall back to the spelling.
    if (entry.ino === 0n || base.ino === 0n) return sameSpelling(target, root)
    return entry.dev === base.dev && entry.ino === base.ino
  } catch {
    return sameSpelling(target, root)
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 什么人可控试用，如何识别退出信号？

**研究主题**：采用判断

#### 完整回答

适合希望减少DSH与IDE切换且能核对版本的开发者，先在独立低权限宿主和可丢弃目录只试文件预览、一个文本修改及只读Git图。确认实际目标路径和权限后再考虑写操作；若要求workspace隔离、出现错目录写入或版本不匹配，则停止并退回IDE/终端。停插件不撤销文件修改，已有写入用独立备份或Git核对恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-62](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/README.md#L31-L62)

只读Git图与明确版本矩阵

<details>
<summary>查看原文（32行）</summary>

````text
### 🌿 Git Graph (read-only commit graph)

Switch to **Git Graph** at the top of the Git panel for commit nodes, forks and merge edges across local branches, remote-tracking branches and HEAD. The branch selector only filters history — it **never checks out or fetches**; each commit is one line (lane edges + ref pills + subject), hover shows the author and short hash, and selecting one opens its full message and diff in the bottom pane. History loads in pages; reference changes during pagination prompt a refresh; reads are bounded (200 commits per page, offset 10,000, 1,000 branches) and report an explicit error past a limit. This first version shows no tags and offers no history-changing actions.

### 🧭 dsh-context diagnostics (optional)

With the `dsh-context` plugin installed, three places offer a one-click jump into that conversation's **Context** view: an agent node's detail card on the Tasks page, a background job's output window (the job's real owner session — never merely the session its row was watched under), and the session header. The entries **appear only** while dsh-context's `Context` page is actually registered: a deployment without it (or with that page hidden) shows no control at all, and while one jump is in flight every entry point is disabled. A failed jump is reported once, in a dismissible alert at the frame's bottom edge; nothing is polled while idle.

## 🚀 Installation

```sh
dsh plugin --profile web add dsh-better-sidebar@latest
```

Then **hard-refresh the browser** (Cmd/Ctrl+Shift+R). Requires DSH **0.2.1-rc.1+**.

> **Compatibility warning — v0.28.0 will take over this plugin's npm `latest`.** DSH's own npm `latest` still points to **0.2.0-rc.2**, which is **not compatible** with v0.28.0. On that host, pin `dsh-better-sidebar@0.26.1` instead of using the command above. DSH 0.2.1-alpha.5 users must pin `dsh-better-sidebar@0.28.0-alpha.0`. Upgrade the host explicitly to `0.2.1-rc.1` before installing v0.28.0; the two packages' `latest` tags are independent.

<details>
<summary><b>Pick the plugin version for your DSH version</b></summary>

| Your DSH version | Install command |
| --- | --- |
| **0.2.1-rc.1+** | `dsh plugin --profile web add dsh-better-sidebar@0.28.0` |
| **0.2.1-alpha.5** | `dsh plugin --profile web add dsh-better-sidebar@0.28.0-alpha.0` |
| **0.2.0-rc.2** | `dsh plugin --profile web add dsh-better-sidebar@0.26.1` |
| **0.2.0-rc.1** | `dsh plugin --profile web add dsh-better-sidebar@0.24.1` |
| **0.1.7-rc.1 ~ 0.1.7 stable** | `dsh plugin --profile web add dsh-better-sidebar@0.22.1` |
| 0.1.7-alpha.x | No compatible release — upgrade DSH to rc.1 first |
| 0.1.6 and earlier (incl. the 0.1.5 line) | `dsh plugin --profile web add dsh-better-sidebar@0.19.1` |

Always pin **exact versions** for older releases (`latest` moves forward with each new stable). Replace `web` with your own profile name.
````

</details>

**依据 2 · 源码核查**：[src/path-security.ts:1-18](https://github.com/omdsh-dev/DSH-better-sidebar/blob/83faf70940160e5cd4c5332f5400aa8f4dbbb6d6/src/path-security.ts#L1-L18)

退出条件来自实际权限边界

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Lexical path resolution for the sidebar's filesystem routes.
 *
 * ⚠️ **This module no longer enforces workspace containment.** It used to
 * canonicalize through `realpath` and reject anything outside the session
 * workspace; the user asked for that guard to be removed, so the sidebar fs
 * routes now reach any path the HOST USER can reach, bounded only by OS
 * permissions (and by the browser-trust fence on the routes themselves).
 *
 * What remains is the part every caller still needs: turn the client's
 * (possibly session-relative) target into one absolute, lexically-normalized
 * path. `resolveSessionPath` joins it under the session cwd, `resolve()`
 * collapses `.` / `..` segments, and {@link requireAbsolute} rejects
 * non-absolute input. No `realpath`, no `isWithin`, no 403.
 *
 * Kept as one module (and the old names kept) so the call sites read the same
 * way they did with the fence: the change is the SEMANTICS — "resolve" rather
 * than "guard".
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
