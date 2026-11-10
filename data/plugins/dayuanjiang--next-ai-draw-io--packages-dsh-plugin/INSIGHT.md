# Next AI Draw.io DSH

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[04b1de9](https://github.com/DayuanJiang/next-ai-draw-io/tree/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 36,815](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C815&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DayuanJiang/next-ai-draw-io) [![npm 30d 925](https://img.shields.io/static/v1?label=npm+30d&message=925&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@next-ai-drawio/dsh) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@next-ai-drawio/dsh)
<!-- END META -->

> **功能**：在 DSH 接入 draw.io MCP 工具和可手工编辑、带版本与撤销的侧栏画布。

> **亮点**：把模型工具和可编辑画布接到 DSH 对话，同提交服务检查过期编辑并保留部分冲突版本。相对手工接入，同一侧栏便于继续编辑。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：子包固定版本仍会解析 @latest。图已更新、图与历史已落盘、导出含最新手工内容分别有不同结果。见 [Q01](#research-q01) 与 [Q03](#research-q03)。

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
  - [Q01 · 子包如何接入 DSH，哪些能力来自 MCP？](#detail-section-11)
  - [Q02 · 手工编辑与模型编辑冲突时怎样处理？](#detail-section-12)
  - [Q03 · 工具成功、自动保存与导出之间有哪些差别？](#detail-section-13)
  - [Q04 · 预览和反馈的信任边界是什么，怎样试用？](#detail-section-14)
  - [Q05 · 怎样验证分阶段结果确认能减少错误交付？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 讨论架构或流程的开发者，可让模型起草 draw.io 图，在同一画布手动修订并导出。

可以手动配置同一 MCP，再用浏览器打开预览，或完全手工绘图。子包提供宿主接线，编辑和版本机制沿用 MCP 服务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP 装配 | 将图编辑工具接入 DSH | 默认版本可变化 |
| 可编辑预览 | 用户和模型查看并修改同一图 | 检查来源与冲突恢复 |
| 导出与撤销 | 保存并重开可编辑文件 | 显式导出仍需核对最新改动 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- |
| DSH MCP client 与 Node/npx | 必需 | 启动 stdio 服务 | 查宿主接口与包解析 |
| 可打开的浏览器预览 | 手工协作和截图需用 | 加载可编辑图 | 回本地编辑器 |
| 图像输入模型 | 模型看截图时需要 | 视觉检查 | 用户自行检查 |
| 可写保存和导出目录 | 文件交付需用 | 恢复及独立交付 | 另存并重开核查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户固定实际服务版本，核对 profile 和预览来源 | 工具与预览可打开 |
| 2 | 用户与模型交错修改非敏感样本 | 确认画布内容和冲突响应 |
| 3 | 用户导出并重开文件 | 图义和全部页面一致，异常回本地编辑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载和运行资源，费用未知 | 核版本、浏览器和目录 | 环境适配耗时未知 |
| 持续 | 模型调用、截图和存档，金额未知 | 检查图义、处理冲突 | 每份合格图成本未知 |
| 退出 | 导出和备份开销未知 | 重开、确认并回本地编辑 | 自动保存与卸载路径需分别核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 侧栏绘图 | DSH 连接 MCP 并启用浏览器 | 实际分发和宿主表现 |
| 人机修改 | 过期保护、历史与撤销 | 竞争下合格图比例 |
| 文件交付 | 能导出当前 XML，并在同步失败时提示 | 重开完整性与节时 |

> **思考**：子包固定版本仍会解析 @latest。图已更新、图与历史已落盘、导出含最新手工内容分别有不同结果。见 [Q01](#research-q01) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把模型工具和可编辑画布接到 DSH 对话，同提交服务检查过期编辑并保留部分冲突版本。相对手工接入，同一侧栏便于继续编辑。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

声明式宿主配置与服务逻辑分离。服务用串行写入、状态比较和版本历史处理冲突，磁盘保存另走延迟队列。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

子包固定版本仍会解析 @latest。图已更新、图与历史已落盘、导出含最新手工内容分别有不同结果。见 [Q01](#research-q01) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先固定实际运行的 MCP 和预览来源，用隔离 profile 试一张小图。手改后导出并重开，缺最新内容时另存可核对版本后切回本地 draw.io。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持宿主接线及同提交 MCP 的主要编辑、恢复和导出路径。实际运行版本、宿主兼容与收益待验，分阶段确认尚属假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin/README.md、packages/dsh-plugin/cordis.patch.yml、packages/dsh-plugin/package.json、packages/mcp-server/package.json、packages/mcp-server/shell/canvas-shell.tsx、packages/mcp-server/shell/feedback.ts、packages/mcp-server/src/http-server.ts、packages/mcp-server/src/index.ts、packages/mcp-server/src/persistence.ts、packages/mcp-server/src/preview/preview.js 及固定范围 inventory；组件：packages/dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅 DSH 子包及同提交 MCP 核心接线、编辑、保存和预览路径。未运行候选包或检查完整 Web 应用。
- 下一步：用同版本宿主测试图像预览、多页冲突、保存错误、重启及导出重开，并核实际 MCP 和 frame 来源。

**分析版本**

- **仓库**：[DayuanJiang/next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io)
- **版本号**：0.1.0（[固定提交 04b1de9](https://github.com/DayuanJiang/next-ai-draw-io/tree/04b1de949f9f2f14971bf2e26f4a7fd8cc392626)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

给画布版本、磁盘保存和实际导出各留一条可回读结果，可能减少漏改图被当成合格交付。以故障注入和重开文件验证。见 [Q05](#research-q05)。

用同版本宿主测试图像预览、多页冲突、保存错误、重启及导出重开，并核实际 MCP 和 frame 来源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 47 | — | — | 392 |

</details>

**活跃度**

[![Issue 未关闭 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=32&color=737b86&logo=github)](https://github.com/DayuanJiang/next-ai-draw-io/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/DayuanJiang/next-ai-draw-io/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/DayuanJiang/next-ai-draw-io/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户与模型共编 draw.io 图时，如何核实实际运行的 MCP、编辑冲突与交付文件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 子包如何接入 DSH，哪些能力来自 MCP？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程、贡献与相对优势

#### 完整回答

使用 DSH 讨论架构或流程的开发者，可在对话中让模型起草图，再到侧栏人工修订。子包声明 DSH bundle 和 patch，patch 通过宿主 MCP 客户端以 stdio 启动 npx，注册服务器名 drawio，设置工具超时和允许嵌入，并开启 Web 侧栏浏览器。BROWSER=none 让同提交服务在 start_session 生成预览地址时跳过主动打开浏览器，用户仍需实际打开链接。组件本身主要交付配置，不实现画布、历史或导出算法。相对手工配置同一 MCP，这减少宿主接线步骤，图形行为来自复用的服务器。默认参数是 @latest，因此固定子包 0.1.0 不会固定下载的服务。同提交服务源码声明 0.4.13，本报告后续分析针对该快照，真实使用时要先核对解析到的服务器版本和工作环境。截图判断还需浏览器和能接收图像的模型，子包 README 只提供使用说明。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/package.json:2-4](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/dsh-plugin/package.json#L2-L4)

子包身份和声明版本。

```text
    "name": "@next-ai-drawio/dsh",
    "version": "0.1.0",
    "description": "draw.io diagrams in DeepSeek Harness: the AI draws on a live canvas in the sidebar that you can also edit by hand, with versions and undo",
```

**依据 2 · 源码核查**：[packages/dsh-plugin/package.json:27-41](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/dsh-plugin/package.json#L27-L41)

仅分发配置、资源和说明，并声明 DSH bundle。

<details>
<summary>查看原文（15行）</summary>

```text
    "icon": "./icon.png",
    "files": [
        "cordis.patch.yml",
        "icon.png",
        "locale",
        "README.md"
    ],
    "publishConfig": {
        "access": "public"
    },
    "dsh": {
        "bundle": {
            "patch": "./cordis.patch.yml"
        }
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/cordis.patch.yml:10-28](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/dsh-plugin/cordis.patch.yml#L10-L28)

实际 stdio 依赖、可变版本、超时和侧栏。

<details>
<summary>查看原文（19行）</summary>

```text
- insert:
    - id: mcp-drawio
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: drawio
        transport: stdio
        command: npx
        args: ['-y', '@next-ai-drawio/mcp-server@latest']
        # Screenshots and exports can take longer than the 60 s default.
        toolCallTimeoutMs: 120000
        env:
          # Let DSH's sidebar browser frame the preview page
          DRAWIO_ALLOW_EMBED: 'true'
          # Give the link in the chat instead of opening a browser tab
          BROWSER: none

# The sidebar browser is off by default in the web profile
- id: ui-sidebar-browser
  disabled: false
```

</details>

**依据 4 · 源码核查**：[packages/mcp-server/src/index.ts:477-499](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L477-L499)

会话初始化、预览地址和 BROWSER 行为。

<details>
<summary>查看原文（23行）</summary>

```text
        currentSession = { id: sessionId, xml: "", lastSeenXml: "" }

        // Open the browser. BROWSER=none (the convention of CRA and Vite
        // dev servers) skips it: the e2e tests and headless hosts set it
        const browserUrl = previewUrl(port, sessionId)
        if (process.env.BROWSER !== "none") await openBrowser(browserUrl)

        // A saved diagram comes back from its file. lastSeenXml stays
        // empty, so edit_diagram asks for get_diagram first.
        const restored = sessionState(sessionId)
        let intro = "Session started successfully!"
        if (session_id) {
            // blank: the browser asked first and nothing was saved
            if (restored && !restored.blank) {
                intro = `Resumed session ${sessionId}.\n\n${describePages(restored.xml)}\n\nCall get_diagram before edit_diagram.`
            } else {
                intro = `No saved diagram for ${sessionId}; starting blank.`
            }
        }

        const savePath = autosaver.pathFor(sessionId)
        const saveNote = savePath
            ? `\n\nAuto-save: after every change the diagram is saved to ${savePath}. Never edit that file or load a changed copy of it; change the diagram with edit_diagram. To continue this diagram in a later conversation, call start_session with session_id=${sessionId}. list_saved_diagrams lists older diagrams.`
```

</details>

**依据 5 · 源码核查**：[packages/mcp-server/package.json:1-12](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/package.json#L1-L12)

同提交服务声明版本及编译入口。

<details>
<summary>查看原文（12行）</summary>

```text
{
    "name": "@next-ai-drawio/mcp-server",
    "version": "0.4.13",
    "description": "draw.io MCP server for Claude Code, Cursor, Codex and VS Code: the AI draws on a live browser canvas you can also edit by hand, with versions and undo",
    "mcpName": "io.github.DayuanJiang/next-ai-drawio",
    "type": "module",
    "main": "dist/index.js",
    "bin": {
        "next-ai-drawio-mcp": "./dist/index.js"
    },
    "scripts": {
        "build": "tsc && tsc -p shell && node scripts/copy-assets.mjs && node scripts/fetch-drawio.mjs && node scripts/build-shell.mjs",
```

</details>

**依据 6 · 作者声明**：[packages/dsh-plugin/README.md:13-25](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/dsh-plugin/README.md#L13-L25)

作者描述截图、非侧栏和工具使用前提。

<details>
<summary>查看原文（13行）</summary>

```text
## Use

Ask, for example, "Read this repo and draw its architecture". The agent calls `start_session` and replies with the preview link. Click it: the preview opens in DSH's right sidebar, and the diagram appears as it is drawn. The plugin turns on DSH's sidebar browser, which the web profile leaves off by default.

The agent checks its drawing with `screenshot_diagram`. That works once the preview is open, and only with a model that accepts images; with a text-only model, DSH passes a short note instead of the picture.

The tools are named `mcp__drawio__<tool>`: `start_session`, `create_new_diagram`, `edit_diagram`, `get_diagram`, `screenshot_diagram`, `export_diagram`, `restore_version` and more. See the [MCP server README](https://github.com/DayuanJiang/next-ai-draw-io/tree/main/packages/mcp-server#readme) for the full list and its settings.

Profiles without the sidebar, such as `tui` and `headless`, print `patch: entry "ui-sidebar-browser" not found` at start; it does no harm. There, open the preview link in your browser.

## Settings

The plugin runs `npx -y @next-ai-drawio/mcp-server@latest`. To pass more settings such as `DRAWIO_LANG`, override the `mcp-drawio` row in your profile's `cordis.patch.yml`:
```

</details>

#### 缺口

- 真实 npm 分发和宿主解析出的服务未验证。
  **影响**：固定子包结论不能覆盖任意解析结果。
  **进一步探讨**：在隔离 profile 记录实际 MCP 构建、调用入口和预览，再核对简单图。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 手工编辑与模型编辑冲突时怎样处理？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

服务把写图工具与会话切换串行，避免同一服务内两次写都基于同一状态。模型做局部编辑时先同步浏览器状态，再用上次见到的 XML 比较。如果内容已变或模型尚未读图，就拒绝编辑并返回当前选定页；其他页面也变动时要求重新读取。通过检查后才应用按 ID 的操作，操作错误会整批返回，成功提交将前后状态写入历史。浏览器反向推送时会检查 stateId，过期版本则回复 409。带 XML 的普通手工修改在特定竞争分支可放进历史，过期同步回复不会把旧内容当作最新。这是冲突检测和事后找回，不能保证没有丢失或自动合并人工与模型的意图。恢复旧版会设置当前状态并清空模型已见记录，后续局部编辑仍需先读。成功提示说明服务接受 XML，也可能记录未改变的操作。图的关系、标签和布局仍应由用户看画布核对。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp-server/src/index.ts:238-249](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L238-L249)

同一服务的写入与会话切换排队。

<details>
<summary>查看原文（12行）</summary>

```text
// The tools that write the diagram, and start_session, run one at a time:
// two writes at once would both build on the same document, and the second
// would drop the first one's change. start_session in the queue keeps a
// session switch from landing in the middle of a write.
const exclusive = createExclusive()

/**
 * Register a tool. The handler returns its result or throws: an exception
 * comes back as a tool error (the SDK would report it too, without the
 * "Error: " prefix and the log line). With needsSession the handler runs
 * only when a session is active, so it can take activeSession() for
 * granted; write puts it in the queue above.
```

</details>

**依据 2 · 源码核查**：[packages/mcp-server/src/index.ts:844-895](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L844-L895)

基于当前内容和模型已见状态拒绝。

<details>
<summary>查看原文（52行）</summary>

```text
    async ({ operations, page_id, page_name, page_index, screenshot }) => {
        const session = activeSession()

        // Fetch latest state from browser
        const browserState = syncFromBrowser(session)
        if (browserState?.xml) {
            log.info("Fetched latest diagram state from browser")
        }

        if (!session.xml) {
            return fail(
                "No diagram to edit. Please create a diagram first with create_new_diagram.",
            )
        }

        const pageSelector: PageSelector = { page_id, page_name, page_index }

        // Enforce workflow: the model must have seen the current diagram
        // state. Content comparison instead of a wall-clock timeout —
        // slow reasoning between get_diagram and edit_diagram is fine as
        // long as nothing changed in the browser meanwhile (#885).
        const gate = checkEditGate(session.lastSeenXml, browserState?.xml ?? "")
        if (!gate.ok) {
            log.warn(
                gate.reason === "stale"
                    ? "edit_diagram rejected: the browser has changes the model has not seen"
                    : "edit_diagram rejected: the model has not seen the diagram yet",
            )
            // The error carries the current page, so the model has now
            // seen it and can retry without a get_diagram round-trip,
            // unless other pages changed too.
            const liveXml = browserState?.xml || session.xml
            // What the model saw, before markPageSeen records the live state
            const before = session.lastSeenXml
            session.lastSeenXml = markPageSeen(
                session.lastSeenXml,
                liveXml,
                pageSelector,
            )
            const reason =
                gate.reason === "stale"
                    ? "The diagram changed in the browser since you last saw it (e.g. manual user edits). No changes were made."
                    : "You have not seen this diagram yet, so no changes were made."
            // Per-cell summary of the user's changes, when they can be compared
            const summary = describeChanges(before, liveXml)
            const next =
                session.lastSeenXml === liveXml
                    ? "Build your operations on this XML and retry."
                    : `${OTHER_PAGES_UNSEEN} Call get_diagram without a page selector, then retry.`
            return fail(
                `${reason}\n\n${summary ? `${summary}\n\n` : ""}Current XML of ${describeSelector(pageSelector)}:\n\n${foldCells(targetPageXml(session.xml, pageSelector))}\n\n${next}`,
            )
```

</details>

**依据 3 · 源码核查**：[packages/mcp-server/src/index.ts:902-937](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L902-L937)

检查操作并提交历史，区分未改变。

<details>
<summary>查看原文（36行）</summary>

```text
        const outcome = editDiagram(
            session.xml,
            operations as DiagramOperation[],
            pageSelector,
        )
        if (!outcome.ok) {
            log.warn(`Edit rejected: ${outcome.errors.join("; ")}`)
            return fail(
                outcome.pageError
                    ? outcome.errors[0]
                    : `No changes were made because ${outcome.errors.length} operation(s) failed:\n${outcome.errors.map((e) => `- ${e}`).join("\n")}\n\nCurrent XML of ${describeSelector(pageSelector)}:\n\n${foldCells(targetPageXml(session.xml, pageSelector))}\n\nFix the operations against this XML and retry.`,
            )
        }
        if (outcome.fixes.length > 0) {
            log.info(`new_xml auto-fixed: ${outcome.fixes.join("; ")}`)
        }
        const result = outcome.xml

        // The pre-edit state goes to History for undo, only once the edit
        // applied: a rejected edit returns above without leaving a phantom
        // history entry.
        commitDocument(session, result, true, browserState?.svg)

        log.info(`Diagram edited successfully`)

        // The preview's version card counts only real changes: say which
        // updates changed nothing, so the model can tell the user
        const { unchanged } = outcome
        const unchangedNote =
            unchanged.length > 0
                ? ` ${unchanged.length} of them changed nothing (id ${unchanged.join(", ")} already matched), so ${outcome.applied - unchanged.length} operation(s) changed the diagram.`
                : ""
        const content: CallToolResult["content"] = [
            {
                type: "text",
                text: `Diagram edited successfully!\n\nApplied ${outcome.applied} operation(s) on ${describeSelector(pageSelector)}.${unchangedNote}\n\n${outlineNote()}`,
```

</details>

**依据 4 · 源码核查**：[packages/mcp-server/src/http-server.ts:940-978](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/http-server.ts#L940-L978)

会话状态冲突和恢复分支。

<details>
<summary>查看原文（39行）</summary>

```text
                // A tab of this version names the state its push is based
                // on. Another state (the server lost the one it knew, or
                // the tab has not polled yet): refused, and the tab's next
                // poll decides whose diagram wins.
                if (current && "stateId" in data) {
                    if (data.stateId !== current.stateId) {
                        res.writeHead(409, {
                            "Content-Type": "application/json",
                        })
                        res.end(
                            JSON.stringify({ error: "Session was recreated" }),
                        )
                        return
                    }
                    // What a recovering tab showed: kept in history only
                    if (data.source === "recover") {
                        const saved =
                            typeof data.xml === "string" &&
                            !!data.xml &&
                            data.xml !== current.xml
                        if (saved) {
                            addHistory(
                                sessionId,
                                data.xml,
                                data.svg || "",
                                "recover",
                            )
                            // Saved with the History, as after any change
                            stateListener?.(sessionId, current.xml)
                        }
                        res.writeHead(409, {
                            "Content-Type": "application/json",
                        })
                        res.end(
                            JSON.stringify({
                                error: "Diagram changed on the server",
                                savedToHistory: saved,
                            }),
                        )
```

</details>

**依据 5 · 源码核查**：[packages/mcp-server/src/http-server.ts:983-1014](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/http-server.ts#L983-L1014)

过期版本拒绝及手工内容可留历史。

<details>
<summary>查看原文（32行）</summary>

```text
                // The browser edited a version older than the latest AI write
                // (it has not loaded that write yet). Keep the AI write; the
                // browser loads it on its next poll. A sync reply is also
                // stale after a newer write of the browser's own (a user
                // edit saved while the export ran).
                if (
                    typeof data.baseVersion === "number" &&
                    (data.baseVersion < (current?.serverVersion ?? 0) ||
                        (data.source === "sync" &&
                            data.baseVersion < (current?.version ?? 0)))
                ) {
                    let savedToHistory = false
                    if (data.source === "sync") {
                        // A stale sync reply: the store already holds the
                        // newer AI write, so the sync is done.
                        if (current) current.syncRequested = undefined
                    } else if (typeof data.xml === "string" && data.xml) {
                        // A user edit lost the race with an AI write. Keep
                        // it in history so the user can restore it.
                        addHistory(sessionId, data.xml, data.svg || "", "user")
                        savedToHistory = true
                        if (current) stateListener?.(sessionId, current.xml)
                    }
                    res.writeHead(409, { "Content-Type": "application/json" })
                    res.end(
                        JSON.stringify({
                            error: "Diagram changed on the server",
                            savedToHistory,
                        }),
                    )
                    return
                }
```

</details>

**依据 6 · 源码核查**：[packages/mcp-server/src/index.ts:1902-1928](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L1902-L1928)

恢复历史并重新要求读图。

<details>
<summary>查看原文（27行）</summary>

```text
    async ({ steps_back: stepsBack = 1 }) => {
        const session = activeSession()

        // The canvas, with the user's manual edits, is the state store
        const current = sessionState(session.id)?.xml || session.xml
        const candidates = otherVersions(session.id, current)
        if (candidates.length === 0) {
            return fail("No other version in History.")
        }
        if (candidates.length < stepsBack) {
            return fail(
                `Only ${candidates.length} other version(s) in History: ${describeVersions(session.id, candidates)}`,
            )
        }
        const entry = candidates[stepsBack - 1]

        // Manual edits since the last entry are not in History yet;
        // restoreHistoryEntry keeps them (a blank page excepted)
        const hadManual =
            contentFingerprint(current) !== contentFingerprint(BLANK_MXFILE) &&
            !isInHistory(session.id, current)

        restoreHistoryEntry(session.id, entry.id)
        session.xml = entry.xml
        // As load_diagram: the model may never have seen this XML, so
        // the edit gate requires one get_diagram before edits
        session.lastSeenXml = ""
```

</details>

#### 缺口

- 没有在同版本浏览器中重现竞争、恢复与多页编辑。
  **影响**：不能保证浏览器使用的路径与源中所有保护吻合。
  **进一步探讨**：在两方交错修改同一页和不同页，核对 409、历史记录及最终 XML。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工具成功、自动保存与导出之间有哪些差别？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

写图成功先更新会话状态，状态通知触发自动保存。默认目录在用户主目录下，配置为 off 可以关闭。自动保存按会话重置约一秒的延迟，正常退出钩子会尝试立即刷新。图文件先写临时文件后重命名，历史文件单独写入。失败写日志，不能把即时工具回执当成磁盘图与历史一同提交的凭证。默认保留自建会话文件数量有限，恢复时从该目录分别读取图与历史，重要结果应另存交付文件。导出 drawio 时先尝试请求浏览器同步，如果未接通或等待超时仍可写当前已知 XML，返回警告；导出成功可能缺最近的手工修改。导出指定路径后需要重新打开并检查应有页面和改动。截图用于视觉检查，截图失败可以附加到已成功的编辑结果，不会自动撤回它。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp-server/src/index.ts:122-140](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L122-L140)

内存变更触发保存，恢复读取两种文件。

<details>
<summary>查看原文（19行）</summary>

```text
// Keep each session's latest diagram and its History on disk, so they
// survive this process
const autosaver = new Autosaver(defaultDataDir(), undefined, undefined, (id) =>
    getHistory(id),
)
onStateChange((sessionId, xml) => autosaver.schedule(sessionId, xml))
onSessionRecreate((sessionId) => {
    const saved = autosaver.load(sessionId)
    if (!saved) return null
    // A file draw.io saved (compressed pages) comes back as plain XML, as
    // with load_diagram
    const loaded = parseDrawioFileContent(saved)
    // History comes back with the diagram (addHistory drops consecutive
    // duplicates)
    for (const e of autosaver.loadHistory(sessionId)) {
        addHistory(sessionId, e.xml, "", e.source)
    }
    return loaded.ok ? loaded.xml : saved
})
```

</details>

**依据 2 · 源码核查**：[packages/mcp-server/src/persistence.ts:61-66](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/persistence.ts#L61-L66)

数据目录和关闭条件。

```text
/** DRAWIO_DATA_DIR, default ~/.next-ai-drawio; "off" disables saving. */
export function defaultDataDir(): string | null {
    const dir = process.env.DRAWIO_DATA_DIR
    if (dir === "off") return null
    return dir ? expandHome(dir) : join(homedir(), ".next-ai-drawio")
}
```

**依据 3 · 源码核查**：[packages/mcp-server/src/persistence.ts:190-211](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/persistence.ts#L190-L211)

延迟、退出刷新及待写队列。

<details>
<summary>查看原文（22行）</summary>

```text
    schedule(sessionId: string, xml: string): void {
        if (!this.dir) return
        const previous = this.pending.get(sessionId)
        if (previous) clearTimeout(previous.timer)
        const timer = setTimeout(() => this.write(sessionId), this.delayMs)
        timer.unref()
        this.pending.set(sessionId, { xml, timer })
    }

    /** Write every pending save now (on shutdown). */
    flush(): void {
        for (const [sessionId, { timer }] of this.pending) {
            clearTimeout(timer)
            this.write(sessionId)
        }
    }

    private write(sessionId: string): void {
        const entry = this.pending.get(sessionId)
        this.pending.delete(sessionId)
        const path = this.pathFor(sessionId)
        if (!entry || !this.dir || !path) return
```

</details>

**依据 4 · 源码核查**：[packages/mcp-server/src/persistence.ts:223-241](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/persistence.ts#L223-L241)

主文件替换和日志失败路径。

<details>
<summary>查看原文（19行）</summary>

```text
        try {
            const isNew = !existsSync(path)
            // A blank page the browser shows before any drawing: nothing to
            // keep (unless the diagram was cleared before its first save)
            if (
                isNew &&
                isBlank(entry.xml) &&
                this.history(sessionId).every((e) => isBlank(e.xml))
            )
                return
            mkdirSync(this.dir, { recursive: true })
            // Write to a temporary file first so a crash never leaves half a file
            writeFileSync(`${path}.tmp`, entry.xml, "utf-8")
            renameSync(`${path}.tmp`, path)
            this.writeHistory(sessionId)
            if (isNew) this.removeOldest()
        } catch (error) {
            log.warn(`Auto-save failed for ${path}: ${error}`)
        }
```

</details>

**依据 5 · 源码核查**：[packages/mcp-server/src/persistence.ts:254-284](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/persistence.ts#L254-L284)

历史独立保存及会话保留。

<details>
<summary>查看原文（31行）</summary>

```text
    private writeHistory(sessionId: string): void {
        const path = this.historyPathFor(sessionId)
        const entries = this.history(sessionId)
        if (!path || entries.length === 0) return
        const key = `${entries.length}:${entries[entries.length - 1].id}`
        if (this.historyKeys.get(sessionId) === key) return
        try {
            const saved: SavedHistoryEntry[] = entries.map((e) => ({
                xml: e.xml,
                ...(e.source && { source: e.source }),
            }))
            const json = JSON.stringify(saved)
            writeFileSync(`${path}.tmp`, json, "utf-8")
            renameSync(`${path}.tmp`, path)
            this.historyKeys.set(sessionId, key)
        } catch (error) {
            log.warn(`Saving the History failed for ${path}: ${error}`)
        }
    }

    private removeOldest(): void {
        // Only our own session files (mcp-<time in base 36>-<random>, made
        // by start_session): DRAWIO_DATA_DIR may be a folder that also holds
        // the user's diagrams
        const own = this.files(/^mcp-[0-9a-z]{8}-[0-9a-z]{1,6}\.drawio$/)
        for (const { name, path } of own.slice(this.maxFiles)) {
            unlinkSync(path)
            // Its History goes with it (there may be none), and is written
            // again if the session saves once more
            rmSync(path.replace(/\.drawio$/, ".history.json"), { force: true })
            this.historyKeys.delete(name.slice(0, -".drawio".length))
```

</details>

**依据 6 · 源码核查**：[packages/mcp-server/src/index.ts:943-960](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L943-L960)

截图失败和编辑结果可以并存。

<details>
<summary>查看原文（18行）</summary>

```text
        if (screenshot ?? config.autoScreenshot) {
            const shot = await captureScreenshot(
                session.id,
                result,
                hasPageSelector(pageSelector)
                    ? pageSelector
                    : { page_index: 0 },
                AFTER_WRITE_NEXT,
            )
            content.push(
                ...(shot.ok
                    ? shot.content
                    : [
                          {
                              type: "text" as const,
                              text: `Screenshot skipped: ${shot.note}`,
                          },
                      ]),
```

</details>

**依据 7 · 源码核查**：[packages/mcp-server/src/index.ts:1400-1433](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L1400-L1433)

同步失败仍继续导出现有 XML。

<details>
<summary>查看原文（34行）</summary>

```text
        let syncNote = ""
        if (detectedFormat === "drawio") {
            restoreSavedSession(session.id)
            if (!requestSync(session.id)) {
                syncNote =
                    "\n\nNote: the preview was not reachable, so the file may not include the user's latest manual edits."
            } else if (!(await waitForSync(session.id))) {
                log.warn("export_diagram: sync timeout - state may be stale")
                syncNote =
                    "\n\nNote: the browser did not respond, so the file may not include the user's latest manual edits (is the preview tab open?)."
            }
        }

        // Fetch latest state, so a page selector works on a bare
        // <mxGraphModel> pushed by the browser
        const browserState = syncFromBrowser(session)
        // A change while the file is written leaves it behind the preview
        const changesBefore = changeCount(session.id)

        if (!session.xml) {
            return fail("No diagram to export. Please create a diagram first.")
        }

        const pageSelector: PageSelector = { page_id, page_name, page_index }

        // .drawio path - write XML directly (no browser round-trip).
        if (detectedFormat === "drawio") {
            let filePath = path
            if (!filePath.toLowerCase().endsWith(".drawio")) {
                filePath = `${filePath}.drawio`
            }
            const absolutePath = resolve(filePath)

            let outXml = session.xml
```

</details>

**依据 8 · 源码核查**：[packages/mcp-server/src/index.ts:1446-1459](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L1446-L1459)

实际写文件与返回警告。

<details>
<summary>查看原文（14行）</summary>

```text
            await mkdir(dirname(absolutePath), { recursive: true })
            await writeFile(absolutePath, outXml, "utf-8")
            log.info(`Diagram exported to ${absolutePath}`)
            // The whole diagram is in this file now: the preview names it
            if (!hasPageSelector(pageSelector)) {
                setSessionFile(
                    session.id,
                    absolutePath,
                    changeCount(session.id) !== changesBefore,
                )
            }
            return ok(
                `Diagram exported successfully!\n\nFile: ${absolutePath}\nSize: ${outXml.length} characters\n${describePages(outXml)}${syncNote}`,
            )
```

</details>

**依据 9 · 源码核查**：[packages/mcp-server/src/index.ts:1950-1967](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L1950-L1967)

正常退出触发 flush。

<details>
<summary>查看原文（18行）</summary>

```text
// Graceful shutdown handler
let isShuttingDown = false
function gracefulShutdown(reason: string) {
    if (isShuttingDown) return
    isShuttingDown = true
    log.info(`Shutting down: ${reason}`)
    autosaver.flush()
    shutdown()
    process.exit(0)
}

// Handle stdin close (primary method - works on all platforms including Windows)
process.stdin.on("close", () => gracefulShutdown("stdin closed"))
process.stdin.on("end", () => gracefulShutdown("stdin ended"))

// Handle signals (may not work reliably on Windows)
process.on("SIGINT", () => gracefulShutdown("SIGINT"))
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
```

</details>

#### 缺口

- 未重现磁盘错误、强杀或导出与手工写入竞争。
  **影响**：无法用成功文案证明文件完整性。
  **进一步探讨**：让目标路径不可写，再在有手工变动时断开预览，独立重开导出文件核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 预览和反馈的信任边界是什么，怎样试用？

**研究主题**：依赖、兼容与流程、采用判断、缺陷与关键质疑

#### 完整回答

预览服务默认监听 loopback，请求根据 Host 和 Origin 与本地地址或明确配置的预览地址匹配。API 需要进程 token，页面会包含这个 token，所以反向代理公开页面时不能单靠 API token 推导用户身份隔离。编辑器既可从同源包内加载，也可按配置使用外部来源。旧预览实现向编辑器 frame 传入图 XML，这至少表明采用外部编辑器时需要检查实际加载路径及数据边界，不能把 MCP 本地监听等同于图内容只在本机。另一个有界行为是 Shell 的反馈链接：它把 MCP 版本、编辑器地址类型和浏览器 User-Agent 填进新 issue 的 URL，点击后会打开 GitHub。所查构造没有把 XML 或 token 填进链接。适合先在隔离 profile 固定实际服务版本，使用非敏感小图核对页面来源、并发、截图、保存和独立导出。若预览暴露范围或导出内容无法确认，先保存可验证版本，再退回本地 draw.io。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp-server/src/http-server.ts:619-625](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/http-server.ts#L619-L625)

HTTP 监听在 loopback。

```text
        server.listen(port, "127.0.0.1", () => {
            serverPort = port
            log.info(`HTTP server running on http://localhost:${port}`)
            if (!EXTERNAL_DRAWIO && drawioDir === null) {
                log.warn(
                    "No bundled draw.io (dist/drawio missing); the preview loads it from embed.diagrams.net",
                )
```

**依据 2 · 源码核查**：[packages/mcp-server/src/http-server.ts:692-721](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/http-server.ts#L692-L721)

Host/Origin 判断及拒绝。

<details>
<summary>查看原文（30行）</summary>

```text
function isLocalRequest(req: http.IncomingMessage): boolean {
    const host = req.headers.host ?? ""
    const origin = req.headers.origin
    if (PREVIEW_ORIGIN && host === new URL(PREVIEW_ORIGIN).host) {
        return origin === undefined || origin === PREVIEW_ORIGIN
    }
    return (
        /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) &&
        (origin === undefined || origin === `http://${host}`)
    )
}

function routeRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
): void {
    let url: URL
    try {
        url = new URL(req.url || "/", `http://localhost:${serverPort}`)
    } catch {
        // e.g. "//" is not a valid URL path
        res.writeHead(400)
        res.end("Bad Request")
        return
    }

    if (!isLocalRequest(req)) {
        res.writeHead(403)
        res.end("Forbidden")
        return
```

</details>

**依据 3 · 源码核查**：[packages/mcp-server/src/http-server.ts:769-776](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/http-server.ts#L769-L776)

API token 检查。

```text
    if (
        url.pathname.startsWith("/api/") &&
        req.headers["x-drawio-token"] !== API_TOKEN
    ) {
        res.writeHead(403)
        res.end("Forbidden")
        return
    }
```

**依据 4 · 源码核查**：[packages/mcp-server/src/http-server.ts:837-853](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/http-server.ts#L837-L853)

页面带 token 并禁止缓存。

<details>
<summary>查看原文（17行）</summary>

```text
    const html = render(sessionId)
    if (html === null) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
        res.end(
            "The canvas shell is not built (dist/shell is missing); run npm run build in packages/mcp-server",
        )
        return
    }
    ensureSessionStateInitialized(sessionId)

    // The page holds this process's token: never served from a cache
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        ...htmlSecurityHeaders(),
    })
    res.end(req.method === "HEAD" ? undefined : html)
```

</details>

**依据 5 · 源码核查**：[packages/mcp-server/src/http-server.ts:1322-1327](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/http-server.ts#L1322-L1327)

选择同源或外部编辑器。

```text
/** Where the iframe loads the editor from (without its query) */
function drawioEditorUrl(): string {
    return isSameOriginDrawio()
        ? "/drawio/index.html"
        : `${normalizeUrl(DRAWIO_BASE_URL)}/`
}
```

**依据 6 · 源码核查**：[packages/mcp-server/src/preview/preview.js:164-169](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/preview/preview.js#L164-L169)

旧预览直接传 XML 给编辑器 frame。

```text
function loadDiagram(xml, capturePreview = false) {
    if (!isReady) { pendingXml = xml; return; }
    lastXml = xml;
    latestXml = xml;
    iframe.contentWindow.postMessage(JSON.stringify({ action: 'load', xml, autosave: 1 }), '*');
    if (capturePreview) {
```

**依据 7 · 源码核查**：[packages/mcp-server/shell/feedback.ts:9-30](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/shell/feedback.ts#L9-L30)

反馈链接仅构造选定环境字段。

<details>
<summary>查看原文（22行）</summary>

```text
export function feedbackIssueUrl(
    config: ShellConfig,
    userAgent: string,
): string {
    const drawio = config.drawioBaseUrl.startsWith("/")
        ? "bundled copy"
        : config.drawioBaseUrl
    const body = [
        "## What happened",
        "",
        "",
        "## What you expected",
        "",
        "",
        "## Environment",
        `- MCP server: ${config.version || "unknown"}`,
        "- MCP client (Claude Code, Cursor, Codex, VS Code...): ",
        `- draw.io: ${drawio}`,
        `- Browser: ${userAgent}`,
    ].join("\n")
    return `${ISSUES_URL}?${new URLSearchParams({ title: "[MCP] ", body })}`
}
```

</details>

**依据 8 · 源码核查**：[packages/mcp-server/shell/canvas-shell.tsx:168-177](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/shell/canvas-shell.tsx#L168-L177)

链接按用户动作打开。

<details>
<summary>查看原文（10行）</summary>

```text
                    <a
                        href={feedbackIssueUrl(config, navigator.userAgent)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={dict.shell.feedback}
                        title={dict.shell.feedback}
                        className={iconButton}
                        data-testid="feedback"
                    >
                        <MessageSquareWarning />
```

</details>

#### 缺口

- 实际浏览器加载路径、远程反代身份边界和外部编辑器行为未验。
  **影响**：不能据此批准向共享代理暴露图或处理敏感内容。
  **进一步探讨**：核对本机监听和非授权访问，记录实际 frame 来源及请求，再使用样本图测试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证分阶段结果确认能减少错误交付？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

可以把一次图修改的实际服务版本、画布确认版本、磁盘保存时间及显式导出摘要做成可回读的结果记录。当前编辑成功、延迟自动保存和有警告的导出分属不同路径，额外记录能否帮助用户识别哪一步缺失仍是未验证假设。与现有输出及纯手工 draw.io 各做同一组小图任务，逐项注入浏览器超时、写入失败、强退出和多页改动。以重开后页面和边关系正确的文件为合格任务，比较误交付次数、重新修改的时间、额外模型回合和磁盘开销。若无法减少漏改或结果记录常被误读为图义正确，应保留人工核对和原始文件比对。服务端记录必须只描述自己确认到的状态。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp-server/src/index.ts:920-937](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L920-L937)

编辑回执紧跟内存提交。

<details>
<summary>查看原文（18行）</summary>

```text
        // The pre-edit state goes to History for undo, only once the edit
        // applied: a rejected edit returns above without leaving a phantom
        // history entry.
        commitDocument(session, result, true, browserState?.svg)

        log.info(`Diagram edited successfully`)

        // The preview's version card counts only real changes: say which
        // updates changed nothing, so the model can tell the user
        const { unchanged } = outcome
        const unchangedNote =
            unchanged.length > 0
                ? ` ${unchanged.length} of them changed nothing (id ${unchanged.join(", ")} already matched), so ${outcome.applied - unchanged.length} operation(s) changed the diagram.`
                : ""
        const content: CallToolResult["content"] = [
            {
                type: "text",
                text: `Diagram edited successfully!\n\nApplied ${outcome.applied} operation(s) on ${describeSelector(pageSelector)}.${unchangedNote}\n\n${outlineNote()}`,
```

</details>

**依据 2 · 源码核查**：[packages/mcp-server/src/persistence.ts:223-241](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/persistence.ts#L223-L241)

自动保存失败可能只到日志。

<details>
<summary>查看原文（19行）</summary>

```text
        try {
            const isNew = !existsSync(path)
            // A blank page the browser shows before any drawing: nothing to
            // keep (unless the diagram was cleared before its first save)
            if (
                isNew &&
                isBlank(entry.xml) &&
                this.history(sessionId).every((e) => isBlank(e.xml))
            )
                return
            mkdirSync(this.dir, { recursive: true })
            // Write to a temporary file first so a crash never leaves half a file
            writeFileSync(`${path}.tmp`, entry.xml, "utf-8")
            renameSync(`${path}.tmp`, path)
            this.writeHistory(sessionId)
            if (isNew) this.removeOldest()
        } catch (error) {
            log.warn(`Auto-save failed for ${path}: ${error}`)
        }
```

</details>

**依据 3 · 源码核查**：[packages/mcp-server/src/index.ts:1400-1410](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L1400-L1410)

导出存在浏览器同步警告。

<details>
<summary>查看原文（11行）</summary>

```text
        let syncNote = ""
        if (detectedFormat === "drawio") {
            restoreSavedSession(session.id)
            if (!requestSync(session.id)) {
                syncNote =
                    "\n\nNote: the preview was not reachable, so the file may not include the user's latest manual edits."
            } else if (!(await waitForSync(session.id))) {
                log.warn("export_diagram: sync timeout - state may be stale")
                syncNote =
                    "\n\nNote: the browser did not respond, so the file may not include the user's latest manual edits (is the preview tab open?)."
            }
```

</details>

**依据 4 · 源码核查**：[packages/mcp-server/src/index.ts:1446-1459](https://github.com/DayuanJiang/next-ai-draw-io/blob/04b1de949f9f2f14971bf2e26f4a7fd8cc392626/packages/mcp-server/src/index.ts#L1446-L1459)

导出回执可带同步警告。

<details>
<summary>查看原文（14行）</summary>

```text
            await mkdir(dirname(absolutePath), { recursive: true })
            await writeFile(absolutePath, outXml, "utf-8")
            log.info(`Diagram exported to ${absolutePath}`)
            // The whole diagram is in this file now: the preview names it
            if (!hasPageSelector(pageSelector)) {
                setSessionFile(
                    session.id,
                    absolutePath,
                    changeCount(session.id) !== changesBefore,
                )
            }
            return ok(
                `Diagram exported successfully!\n\nFile: ${absolutePath}\nSize: ${outXml.length} characters\n${describePages(outXml)}${syncNote}`,
            )
```

</details>

#### 缺口

- 没有同任务的错误交付和用时记录。
  **影响**：无法认定新回执设计或现有功能节省时间。
  **进一步探讨**：用固定服务和画布版本做配对比较，从导出文件与运行日志取实际值。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
