# Next AI Draw.io DSH

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[c9dc5f5](https://github.com/DayuanJiang/next-ai-draw-io/tree/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 36,548](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C548&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DayuanJiang/next-ai-draw-io) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@next-ai-drawio/dsh)
<!-- END META -->

> **功能**：将 draw.io MCP 工具与可手工编辑、带版本和撤销的实时画布接入 DSH 侧栏。

> **亮点**：[Q01](#research-q01) 原生bundle的默认接线成立；并发编辑/版本由复用MCP提供，不能归为bundle新算法。

> **主要限制**：[Q03](#research-q03) latest使固定bundle不锁实际server；[Q02](#research-q02)内存提交/自动存档/业务图正确性是不同结果，不能互代。

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
  - [Q01 · DSH画图bundle增加了什么，归因谁？](#detail-section-11)
  - [Q02 · AI和手工并发、撤销与保存如何工作？](#detail-section-12)
  - [Q03 · 固定bundle为什么仍有版本与全周期成本？](#detail-section-13)
  - [Q04 · 何种试用有退路，怎样验证额外设计？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH用户让Agent读仓库画架构图并在人机共同画布修订。

手动配置同一MCP和浏览器或直接draw.io，bundle减少安装配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP挂载 | Agent绘图/编辑 | 实际server为latest需钉版本 |
| 侧栏画布 | 人工和AI共同修图 | 需点击预览，非所有profile |
| 编辑门/历史 | 拒陈旧编辑/恢复版本 | 由MCP提供，不证语义正确 |
| 自动保存/导出 | 留可继续编辑图 | 磁盘失败不等内存失败，需重开验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH MCP client/sidebar | 接入必需 | 工具与画布 | 非sidebar profile外开链接 |
| Node/npx/registry | 必需 | 下载server | 首次网络/latest漂移 |
| 可见浏览器/图像模型 | 截图验收必需 | 视觉反馈 | 文本模型仅说明 |
| 可写数据目录/导出 | 恢复前提 | 存图和历史 | 内存成功非磁盘成功 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户钉包版本/装bundle | 核实际server/配置 |
| 开图 | Agent start_session用户点链接 | 预览可见 |
| 编辑 | AI读当前图后改/用户手改 | 409重新读取，不盲覆盖 |
| 验收 | 用户审语义/截图/导出重开 | 不符另存回手动 |
| 退出 | 导出/核恢复后移除 | 数据与侧栏设置另核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | npm下载/浏览器 | 配置/钉版本/预览核对 | 时间未知 |
| 持续 | server/画布/模型上下文与截图 | 审图/并发冲突处理 | 价格/延迟未测 |
| 失败恢复 | 存档/导出副本 | 区分内存/磁盘/历史 | 强退恢复未验 |
| 退出 | 保留数据目录 | 导出重开/移除配置 | 不等清全部数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集成画布 | bundle MCP+sidebar | 宿主真实兼容 |
| 并发防护 | 队列/门/409与history | 实际浏览器冲突恢复 |
| 持久化 | 监听/rename写盘 | 硬退和写错恢复 |
| 图质量 | 可截图/人工编辑入口 | 语义正确与净节时 |

> **思考**：[Q03](#research-q03) latest使固定bundle不锁实际server；[Q02](#research-q02)内存提交/自动存档/业务图正确性是不同结果，不能互代。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 原生bundle的默认接线成立；并发编辑/版本由复用MCP提供，不能归为bundle新算法。

[Q02](#research-q02) 串行写队列、fingerprint门和浏览器stateId/baseVersion409防护真实接线；存档失败独立于工具内存成功。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) latest使固定bundle不锁实际server；[Q02](#research-q02)内存提交/自动存档/业务图正确性是不同结果，不能互代。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 钉实际MCP版本，非敏感图核并发/撤销/重开/导出，异常另存并回手动draw.io。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核固定bundle与同提交MCP核心/同步/存档关键段；未运行浏览器/模型/发布包，限定钉版本小图试用。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin/README.md、packages/dsh-plugin/package.json、packages/dsh-plugin/cordis.patch.yml、packages/mcp-server/src/index.ts、packages/mcp-server/src/edit-gate.ts、packages/mcp-server/src/persistence.ts、packages/mcp-server/src/http-server.ts、packages/mcp-server/shell/mcp-sync-core.ts 及固定范围 inventory；组件：packages/dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：component inventory仅README不代表实际bundle范围；保存同提交SUPPLEMENT原件并读配置/清单、MCP index/edit-gate/http/persistence/sync关键段。未全面审根Web app/导出导入/全部XML安全，不执行目标。
- 下一步：固定包摘要/宿主/图像模型后核并发、409、保存失败/强退/导出重开与人工图义，计全程资源。

**分析版本**

- **仓库**：[DayuanJiang/next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io)
- **版本号**：0.1.0（[固定提交 c9dc5f5](https://github.com/DayuanJiang/next-ai-draw-io/tree/c9dc5f5cc62e7e5a327a62b39027d80033e1548c)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 绑定实际server版本和画布/磁盘/导出阶段收据；若已有导出流程等价或提示误导即否定。

固定包摘要/宿主/图像模型后核并发、409、保存失败/强退/导出重开与人工图义，计全程资源。

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

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/DayuanJiang/next-ai-draw-io/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查薄bundle的真实贡献、MCP并发/恢复机制及latest依赖边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH画图bundle增加了什么，归因谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在DSH读仓库/说明系统架构的用户，它把MCP绘图工具和可手改的draw.io画布嵌入右侧栏，减少复制XML到另一编辑器。合格结果是用户确认语义/布局并导出可继续编辑的图，而不是工具返回已绘制。bundle本身只有配置：插入原生mcp-client运行外部stdio server，并启用宿主sidebar browser。原生工具接入/侧栏归DSH，画布/历史/编辑门归MCP，薄bundle贡献是默认接线与分发，不能把整套算法计为它原创。

README说明点击start_session链接才有预览，截图需预览打开且模型接图；文本模型只收到说明。因此侧栏启用不等画布已开，更不等视觉质量确认。手工挂同一MCP和打开浏览器是直接替代，bundle降低配置而非独占能力。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/cordis.patch.yml:10-28](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/dsh-plugin/cordis.patch.yml#L10-L28)

真实配置插入与启用侧栏。

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

**依据 2 · 源码核查**：[packages/dsh-plugin/README.md:13-25](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/dsh-plugin/README.md#L13-L25)

使用步骤与图片模型条件。

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

- 宿主侧栏及图质量/人工编辑任务未验。
  **影响**：不能证明画图正确或比手动MCP节时。
  **进一步探讨**：固定模型/任务比较手动挂载与bundle直到导出验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · AI和手工并发、撤销与保存如何工作？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

同提交MCP核心将写工具/start_session串行，syncFromBrowser先采纳浏览器XML，edit_diagram比较模型lastSeen与live的内容fingerprint，拒绝未见或陈旧状态并返回当前页；这不是没有并发防护。浏览器push确实带stateId/baseVersion，服务重建/旧版本返回409，落后人工改动可存history，客户端409后poll并通知，不能据轮询就断言会静默覆盖。

commit保前状态与新history，restore_version选其他内容版本并保存未入账人工改动，恢复后清lastSeen要求先get。自动保存监听state变化、延迟schedule，落盘临时文件rename，再写history；错误只log，工具提交内存成功不证明磁盘成功，硬退出保存窗/历史独立文件的恢复仍待验。内容门与版本保护不保证图的业务语义、任意多人协同或全宿主隔离。

HTTP有127.0.0.1监听、Host/Origin与API token防护，bundle允许本机origin嵌入而非任意网站；本轮未穿透全部导入/导出/XML解析和会话路径边界，不宣称服务全面安全。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp-server/src/index.ts:238-278](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/index.ts#L238-L278)

写队列真实注册。

<details>
<summary>查看原文（41行）</summary>

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
 */
function registerTool<Args extends ZodRawShapeCompat | undefined = undefined>(
    name: string,
    config: {
        title?: string
        description?: string
        inputSchema?: Args
        annotations?: ToolAnnotations
    },
    handler: ToolCallback<Args>,
    { write = false, needsSession = false } = {},
) {
    const run = async (...args: unknown[]) => {
        if (needsSession && !currentSession) return fail(NO_SESSION)
        try {
            return await (handler as (...a: unknown[]) => unknown)(...args)
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error)
            log.error(`${name} failed:`, message)
            return fail(message)
        }
    }
    server.registerTool(
        name,
        config,
        (write ? exclusive(run) : run) as ToolCallback<Args>,
    )
}
```

</details>

**依据 2 · 源码核查**：[packages/mcp-server/src/index.ts:340-367](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/index.ts#L340-L367)

同步与提交历史。

<details>
<summary>查看原文（28行）</summary>

```text
function syncFromBrowser(session: Session) {
    const browserState = sessionState(session.id)
    if (browserState?.xml) {
        session.xml = normalizeToMxfile(browserState.xml) ?? browserState.xml
    }
    return browserState
}

/**
 * Make xml the session's document: the previous one goes to History (with
 * the browser's image of it), the new one is pushed to the preview and
 * recorded in History (its image comes later, from the browser). seen: the
 * model wrote this exact XML knowing the state it built on, so edit_diagram
 * may follow without a get_diagram round-trip. source: what the version
 * cards call the entry (an opened file, an added page).
 */
function commitDocument(
    session: Session,
    xml: string,
    seen: boolean,
    browserSvg?: string,
    source?: HistorySource,
) {
    if (session.xml) keepInHistory(session.id, session.xml, browserSvg)
    session.xml = xml
    setState(session.id, xml)
    session.lastSeenXml = seen ? xml : ""
    addHistory(session.id, xml, "", source)
```

</details>

**依据 3 · 源码核查**：[packages/mcp-server/src/index.ts:840-919](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/index.ts#L840-L919)

编辑门与失败不提交。

<details>
<summary>查看原文（80行）</summary>

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
        }

        log.info(
            `Editing diagram with ${operations.length} operation(s) on ${describeSelector(pageSelector)}`,
        )

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
```

</details>

**依据 4 · 源码核查**：[packages/mcp-server/src/edit-gate.ts:143-165](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/edit-gate.ts#L143-L165)

fingerprint陈旧判据。

<details>
<summary>查看原文（23行）</summary>

```text
export function checkEditGate(
    lastSeenXml: string,
    liveXml: string,
): EditGateResult {
    // Model never fetched or produced any diagram state in this session.
    if (!lastSeenXml) return { ok: false, reason: "no-context" }
    // Browser state moved since the model last looked (e.g. manual user
    // edits): force a re-fetch so update/delete operations don't build on
    // stale cell contents. An empty liveXml means the store has no entry to
    // compare against, so there is nothing newer to have missed.
    if (liveXml && liveXml !== lastSeenXml) {
        // A bare <mxGraphModel> on either side carries no page name, so
        // comparing names would mismatch against anything not called
        // "Page-1". Compare cell trees only in that case.
        const includeNames =
            !isMxGraphModel(liveXml) && !isMxGraphModel(lastSeenXml)
        if (
            contentFingerprint(liveXml, includeNames) !==
            contentFingerprint(lastSeenXml, includeNames)
        )
            return { ok: false, reason: "stale" }
    }
    return { ok: true }
```

</details>

**依据 5 · 源码核查**：[packages/mcp-server/src/http-server.ts:886-962](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/http-server.ts#L886-L962)

服务版本/重建拒绝并留人工历史。

<details>
<summary>查看原文（77行）</summary>

```text
                ensureSessionStateInitialized(sessionId)
                const current = stateStore.get(sessionId)

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
                        return
                    }
                }

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
```

</details>

**依据 6 · 源码核查**：[packages/mcp-server/shell/mcp-sync-core.ts:561-617](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/shell/mcp-sync-core.ts#L561-L617)

客户端实际版本传递和409处理。

<details>
<summary>查看原文（57行）</summary>

```text
    async function pushState(
        xml: string,
        svg = "",
        baseVersion = currentVersion,
        source: "edit" | "sync" | "recover" = "edit",
        sid = stateId,
    ): Promise<void> {
        pushesInFlight.push(xml)
        try {
            const r = await postJson("/state", {
                sessionId,
                xml,
                svg,
                baseVersion,
                source,
                stateId: sid,
            })
            pushFailing = false
            if (r.ok) {
                const d = await r.json()
                // An answer about a state this tab has left since, or one
                // that comes after a newer version was loaded or saved
                if (sid !== stateId || d.version < currentVersion) return
                currentVersion = d.version
                lastXml = xml
                noteHistory(d.historyKey ?? String(d.version), stateId)
                // The canvas changed while this edit was on its way, to
                // something no pending autosave will send (an undo back to
                // the previous version): send it now. A sync reply is
                // draw.io's export of the canvas, in another format than its
                // autosave.
                if (
                    latestXml &&
                    latestXml !== xml &&
                    pendingSvgExport !== latestXml &&
                    source === "edit"
                ) {
                    pushState(latestXml)
                }
            } else if (r.status === 413) {
                // Over the server's size limit: the image is most of it, so
                // try once without it
                if (svg) pushState(xml, "", baseVersion, source, sid)
                else onNotice("tooLarge")
            } else if (r.status === 409) {
                // The AI wrote a newer version, or the server lost the state
                // this push was based on; the next poll sorts it out
                const d = await r.json().catch(() => ({}))
                if (d.savedToHistory) {
                    onNotice(
                        source === "recover" ? "restoredFromFile" : "aiChanged",
                    )
                    // History grew without a new version
                    emitChange()
                }
                poll()
            }
```

</details>

**依据 7 · 源码核查**：[packages/mcp-server/src/index.ts:1890-1935](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/index.ts#L1890-L1935)

恢复与重新读取。

<details>
<summary>查看原文（46行）</summary>

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

        log.info(
            `Restored the version ${stepsBack} step(s) back (entry ${entry.id})`,
        )

        const manualNote = hadManual
            ? " Your manual changes were kept in History (steps_back=1 brings them back)."
            : ""
        const next =
            describeVersions(
                session.id,
                otherVersions(session.id, entry.xml),
                true,
            ) || "none"
        return ok(
            `Restored the version ${stepsBack} step(s) back.${manualNote}\n\n${describePages(entry.xml)}\n\nVersions you can go to now: ${next}\n\nCall get_diagram before edit_diagram.\n\n${outlineNote()}`,
        )
    },
    { write: true, needsSession: true },
```

</details>

**依据 8 · 源码核查**：[packages/mcp-server/src/persistence.ts:190-241](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/persistence.ts#L190-L241)

延迟/临时rename/失败只log。

<details>
<summary>查看原文（52行）</summary>

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
        if (this.unreadable.has(path)) {
            // Deleted meanwhile: nothing left to protect
            if (isGone(path)) {
                this.unreadable.delete(path)
            } else {
                log.warn(
                    `Not saving ${path}: it could not be read, so it may hold work this session does not show`,
                )
                return
            }
        }
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

**依据 9 · 源码核查**：[packages/mcp-server/src/http-server.ts:646-653](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/http-server.ts#L646-L653)

本机Host/Origin。

```text
// no CORS preflight.
function isLocalRequest(req: http.IncomingMessage): boolean {
    const host = req.headers.host ?? ""
    const origin = req.headers.origin
    return (
        /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) &&
        (origin === undefined || origin === `http://${host}`)
    )
```

**依据 10 · 源码核查**：[packages/mcp-server/src/http-server.ts:718-724](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/http-server.ts#L718-L724)

API token。

```text
    if (
        url.pathname.startsWith("/api/") &&
        req.headers["x-drawio-token"] !== API_TOKEN
    ) {
        res.writeHead(403)
        res.end("Forbidden")
        return
```

#### 缺口

- 真实浏览器并发/强退恢复及完整安全面未验。
  **影响**：不能承诺无丢图或可公开多人服务。
  **进一步探讨**：脱敏画布测试人工并发、409恢复、保存失败/强退，另审文件导入导出权限。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 固定bundle为什么仍有版本与全周期成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

bundle运行npx -y @next-ai-drawio/mcp-server@latest，不锁本轮源码提交；本报告审的同提交MCP机制不能自动外推到以后下载包。第一次需网络/registry、Node与匹配DSH/MCP、浏览器预览；截图另需打开且可见画布/图像模型，不能把120秒tool budget当截图验收。profile覆盖整config须保留原字段。

首次下载/配置与预览核对，持续有stdio/HTTP/浏览器、XML/历史存储和模型绘图/截图上下文成本，未测现金/延迟。自动存档在本机不代表永不出网：依赖下载、模型请求与可能外部素材另核。失败要分内存画布、磁盘保存和导出，先另存再重启，不盲重复编辑；退出导出并核可重开，移除插件不会等于清理全部MCP数据/恢复宿主侧栏设置。无生产任务收益或服务价证据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/cordis.patch.yml:10-28](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/dsh-plugin/cordis.patch.yml#L10-L28)

latest/预算/嵌入默认。

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

**依据 2 · 源码核查**：[packages/dsh-plugin/README.md:25-43](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/dsh-plugin/README.md#L25-L43)

整config覆盖和env。

<details>
<summary>查看原文（19行）</summary>

````text
The plugin runs `npx -y @next-ai-drawio/mcp-server@latest`. To pass more settings such as `DRAWIO_LANG`, override the `mcp-drawio` row in your profile's `cordis.patch.yml`:

```yaml
- id: mcp-drawio
  config:
    serverName: drawio
    transport: stdio
    command: npx
    args: ['-y', '@next-ai-drawio/mcp-server@latest']
    toolCallTimeoutMs: 120000
    env:
      DRAWIO_ALLOW_EMBED: 'true'
      BROWSER: none
      DRAWIO_LANG: zh
```

A row override replaces the whole `config`, so keep the other fields. `DRAWIO_ALLOW_EMBED` lets the sidebar show the preview, and `BROWSER: none` stops the server from opening a separate browser tab.

## Remove
````

</details>

**依据 3 · 源码核查**：[packages/mcp-server/src/index.ts:116-139](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/index.ts#L116-L139)

持久化接线。

<details>
<summary>查看原文（24行）</summary>

```text
    port: parseInt(process.env.PORT || "6002", 10),
    // Attach a screenshot to every create_new_diagram and edit_diagram
    // result unless the call says otherwise
    autoScreenshot: process.env.DRAWIO_AUTO_SCREENSHOT === "true",
}

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
```

</details>

**依据 4 · 源码核查**：[packages/mcp-server/src/persistence.ts:190-241](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/persistence.ts#L190-L241)

持久化失败边界。

<details>
<summary>查看原文（52行）</summary>

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
        if (this.unreadable.has(path)) {
            // Deleted meanwhile: nothing left to protect
            if (isGone(path)) {
                this.unreadable.delete(path)
            } else {
                log.warn(
                    `Not saving ${path}: it could not be read, so it may hold work this session does not show`,
                )
                return
            }
        }
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

#### 缺口

- npm实际运行版本、宿主兼容、数据目录退出与模型资源未验。
  **影响**：下载漂移可能使源码结论不适用。
  **进一步探讨**：先钉版本和包摘要，用副本核可见预览/保存/导出/退出，量完整任务资源。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种试用有退路，怎样验证额外设计？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议固定MCP版本后以非敏感小图试用DSH侧栏；先手改/AI并发、撤销和重开核一致，再做真实架构图并人工审语义。若版本不符、409未恢复或保存/导出不一致，停止编辑、另存现图并退回draw.io手动或独立MCP，不把自动截图当业务正确。

可探索端到端画布收据：绑定实际MCP版本、session/stateId/内容指纹、内存提交/磁盘/导出确认状态。现有版本门、history和自动保存不能被说成不存在，增量是让用户区分其阶段并核本轮审查版本。用包更新漂移、保存权限失败、并发编辑和强退四类对照，比较错误版本采用、误认已保存、恢复时间和收据负担；若导出/现有日志已等价或收据过时而误导，就否定。未实现，不计已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/cordis.patch.yml:16-19](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/dsh-plugin/cordis.patch.yml#L16-L19)

实际latest是版本绑定动机。

```text
        command: npx
        args: ['-y', '@next-ai-drawio/mcp-server@latest']
        # Screenshots and exports can take longer than the 60 s default.
        toolCallTimeoutMs: 120000
```

**依据 2 · 源码核查**：[packages/mcp-server/src/index.ts:356-367](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/index.ts#L356-L367)

内存提交基线。

<details>
<summary>查看原文（12行）</summary>

```text
function commitDocument(
    session: Session,
    xml: string,
    seen: boolean,
    browserSvg?: string,
    source?: HistorySource,
) {
    if (session.xml) keepInHistory(session.id, session.xml, browserSvg)
    session.xml = xml
    setState(session.id, xml)
    session.lastSeenXml = seen ? xml : ""
    addHistory(session.id, xml, "", source)
```

</details>

**依据 3 · 源码核查**：[packages/mcp-server/src/persistence.ts:233-241](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/persistence.ts#L233-L241)

磁盘结果与内存分离。

```text
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

**依据 4 · 源码核查**：[packages/mcp-server/src/http-server.ts:893-962](https://github.com/DayuanJiang/next-ai-draw-io/blob/c9dc5f5cc62e7e5a327a62b39027d80033e1548c/packages/mcp-server/src/http-server.ts#L893-L962)

现有state/version不可忽略。

<details>
<summary>查看原文（70行）</summary>

```text
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
                        return
                    }
                }

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
```

</details>

#### 缺口

- 统一收据和用户对照未实现。
  **影响**：不能承诺恢复效率改善。
  **进一步探讨**：先比较钉版本+手动导出的简单替代。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
