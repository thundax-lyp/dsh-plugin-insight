# dsh-sessions-manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ad04522](https://github.com/TOBYCAI/dsh-sessions-manager/tree/ad0452298848386c4fd393ddb8a1a5fd552d90b2)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TOBYCAI/dsh-sessions-manager) [![npm 30d 4,126](https://img.shields.io/static/v1?label=npm+30d&message=4%2C126&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sessions-manager) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sessions-manager)
<!-- END META -->

> **功能**：管理 DSH 会话归档、恢复、工作区移动与回收站。

> **亮点**：[Q01](#research-q01) 将工作区整理集中到会话视图。[Q02](#research-q02) 将暂忙移动保留在队列。

> **主要限制**：[Q03](#research-q03) 的清理先写删除标记再物理处理，失败后仍需核文件和后代。

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
  - [Q01 · 会话积累后哪些整理操作可在一个入口完成？](#detail-section-11)
  - [Q02 · 活跃会话怎样识别，移动如何排队？](#detail-section-12)
  - [Q03 · 恢复与彻底删除怎样影响试用？](#detail-section-13)
  - [Q04 · 如何检验重启后状态与日志一致？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向多工作区积累大量 DSH 会话的人，在面板里整理会话和后代。

以原生会话列表、宿主存储和独立备份为参照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 归档与恢复 | 整理旧会话 | 核日志和后代 |
| 移动排队 | 等会话释放后迁移 | queued 不表示已完成 |
| 永久清理 | 物理删除日志 | 仅在备份和明确范围下验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与会话存储 | 必需 | 加载界面和日志操作 | 查看能力状态 |
| 独占副本与备份 | 试用需要 | 验证恢复 | 先不清理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 备份会话与工作区 | 测试目标可丢弃 |
| 核查 | 归档并恢复一条会话 | 读回工作区和日志 |
| 退出 | 停批处理并恢复备份 | 若有待移动，先核状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 备份空间未知 | 核宿主和目录 | 真实兼容未验 |
| 持续 | 索引资源未知 | 检查排队与历史 | 过期心跳有边界 |
| 恢复 | 重跑未知 | 按日志还原 | 清理可能不可逆 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集中操作 | 实际管理路由与队列 | 真实节时 |
| 恢复 | 先验证，后移除记录 | 真实故障和级联结果 |

> **思考**：[Q03](#research-q03) 的清理先写删除标记再物理处理，失败后仍需核文件和后代。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将工作区整理集中到会话视图。[Q02](#research-q02) 将暂忙移动保留在队列。

[Q02](#research-q02) 用新鲜活动报告阻止部分移动，[Q03](#research-q03) 在永久动作前保存标记并尽力同步索引。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的清理先写删除标记再物理处理，失败后仍需核文件和后代。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用备份副本先试可逆归档和恢复。移动排队后核真实位置，不在首轮启用批量清空。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核查归档、移动、恢复与清理，真实宿主和跨版本操作未验。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.js、src/active-session.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定会话路由、心跳、移动与回收链，未运行宿主或修改日志。
- 下一步：按 [Q04](#research-q04) 在可丢弃副本验证中断和恢复。

**分析版本**

- **仓库**：[TOBYCAI/dsh-sessions-manager](https://github.com/TOBYCAI/dsh-sessions-manager)
- **版本号**：3.7.10（[固定提交 ad04522](https://github.com/TOBYCAI/dsh-sessions-manager/tree/ad0452298848386c4fd393ddb8a1a5fd552d90b2)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照副本里的三个中断时点，若界面与日志不一致或误删则保留原流程。

按 [Q04](#research-q04) 在可丢弃副本验证中断和恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 5 | 1106 | 837 | 199 | — |
| .js | source | 24 | 16068 | 13881 | 2275 | — |
| .md | source | 2 | 487 | — | — | 12781 |
| .jsx | source | 1 | 4439 | 3656 | 729 | — |
| .js | test | 34 | 6214 | 5033 | 657 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/TOBYCAI/dsh-sessions-manager/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 会话整理如何使用宿主日志和工作区，怎样核排队、恢复及永久删除边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话积累后哪些整理操作可在一个入口完成？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

会在 DSH 多工作区留存历史会话的人可以从设置和侧栏查看、归档、恢复或移动会话。和手工切不同工作区或直接处理磁盘日志相比，面板把会话状态和后代关系带到同一入口。归档只改变可见状态，回收站与彻底删除分别有自己的服务流程。对少量会话而言保留原生列表更简单。合格结果是操作后目标会话、原工作区和子代理归属都能回查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-33](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/README.md#L21-L33)

作者描述面板、归档和批处理。

<details>
<summary>查看原文（13行）</summary>

```text
- **统一面板**：顶部提供「全部 / 活动 / 已归档」三个常驻视图，低频的「已收藏 / 空白 / 回收站」收进行尾的箭头按钮，点按横向滑出展开（低频视图处于选中态时自动保持展开）；支持按标题、会话 ID、工作区搜索，按工作区筛选，并按创建时间或标题排序。结果行合并为一句说明，如「显示 5 个会话，另有 4 个子代理折叠在父会话下」。筛选栏下方的维护栏收纳「存储占用」「标签管理」「自动归档」等按需展开的面板级工具，不占用视图位置。
- **收藏（星标）**：会话行左侧常驻星标按钮，单击即收藏 / 取消（乐观更新、失败回滚）；「已收藏」视图与 DSH 的活动 / 归档状态正交、可叠加；收藏索引为插件自有 schema v3，不触碰 DSH 日志，会话被彻底删除时自动清理。
- **标签与保存筛选**：给会话贴自定义标签（全局 ≤200、单会话 ≤10；支持重命名、合并、删除——**删除标签只删标签，绝不触碰会话**），并按标签筛选列表；「视图 + 工作区 + 排序 + 标签」的组合可保存为筛选预设（≤20 条）一键应用。标签与预设存在插件自有索引里（同星标索引纪律），跟随这台机器的 DSH 数据目录、不跟账号走。
- **冷态标题同步**：侧栏使用日志中最新的 `session/title` 修正冷启动缓存，改名后的会话无需先打开即可显示新名称；冷启动大库里标题先留空、后台分批补齐，补齐后**已经在屏幕上的侧栏行和「⑂ 分支」标记的悬停说明会跟着自动更新**，不必等页面重建。
- **侧栏跨工作区拖拽**：直接把会话拖到目标工作区标题即可切换工作区；目标高亮、同工作区拦截、失败反馈，并保留“更多 → 移动会话”作为键盘操作入口。拖到侧栏列表的上/下边缘会自动滚动列表（越靠边越快，到顶到底即停），视口外的工作区标题也能拖到。
- **归档 / 恢复**：归档把会话从侧栏隐藏；恢复取消归档并放回原工作区分组。
- **移动到工作区**：任选**已有工作区**或**新建目录路径**（自动创建），新建目录支持点击 **「浏览…」** 调用系统目录选择窗口。会话的工作目录与日志一起迁移。旧版 Runtime（`0.1.2-rc.1`）下已打开的会话也可立即移动；新版 Runtime 为会话日志引入**单写者所有权**（DSH 打开会话即持有、只在进程退出时释放），此时移动会**自动排队**而不是失败——释放后由插件自动完成，详见下文「移动活跃会话（排队移动）」。
- **会话详情**：展开单条会话查看**磁盘占用**、**轮次 / 步骤 / 用户·助手消息 / 工具调用 / 图片附件**统计、**工具使用分布**、**搜索·抓取记录**、**write/edit 写过的文件列表**（已过滤磁盘上已不存在的路径），以及**血缘**（父会话 / 子会话 / 子代理）。
- **血缘分层披露**：面板的「分组」下拉提供**血缘（折叠分组，默认）**与**平铺（全部并列）**两种视图。血缘视图下：子代理会话折叠在其父会话下（「▸ N 子代理」）；由同一来源会话派生的**分支（fork）自动聚拢成组**（「▸ N 分支」，组内按创建时间升序，来源父行原位保留；父会话被筛掉/归档/删除时降级为「来源：<短 ID>」组头，一行不丢——因此**「活动」视图里已归档父会话的分支会挂在「来源」组头下，这是设计不是 bug**）。注意：聚拢在设置面板的血缘视图；侧栏受官方 React 托管行 DOM 限制只打标记不重排。子代理会话同理不占顶层行：血缘视图下它们不计入「全部 / 活动 / 已归档 / 空白」的计数、不参与全选，只作为父行的「N 子代理」存在；父会话不在当前列表（已删除 / 已归档 / 被筛掉）的子代理统一收进列表末尾的**「未归属的子代理会话」**卡片（默认收起，展开后可逐条打开 / 归档 / 删除，搜索命中自动展开），不会再以「(无标题)」行铺满列表。切到**平铺视图**则与 DSH 原生一致，子代理逐行并列、可单独勾选。分支会话带绿色「⑂ 分支」标记（悬停显示来源父会话；父标题为后到数据，到达后自动刷新），空白会话带灰色标记并可进入「空白」视图统一查看与清理。空白会话识别采用**事件类型法**：`0.1.3` 起日志头部扩容且创建时恒写一帧生命周期元数据，旧体积阈值失效——插件对候选会话做官方解码精判，头部之外没有任何内容事件才判空白（解码失败按非空兜底）；**插件注入的上下文不算内容**——`agent/inbox/spliced` 只插入 `source.kind` 以 `plugin:` 开头或 `form: 'instructions'` 的消息、且未删除任何消息时，该会话仍判空白（真用户消息与无法识别的载荷照旧算内容）。3.7.0 起精判完全移出数据返回路径：侧栏数据**首拍即回**，空白与否先按「未知」处理（未知一律不隐藏、不计入空白分类），后台小队列逐条判定、结论落盘跨重启复用，后续拍自动收敛——「⑂ 分支」等零解码信息不再被任何精判解码挡住。
- **导出**：详情面板底部提供两个入口——「**下载原始日志 (ZIP)**」直接走 DSH 官方 `session.export` 端点（含子会话与附件，持久化后端不支持时自动隐藏）；「**导出 Markdown**」由本插件把会话渲染为人类可读对话记录（front matter + 按轮分节 + 用户 / 助手 / 工具调用摘要，流式增量不重复）。
- **存储占用分析**：维护栏的「存储占用」按钮按需展开，按工作区聚合会话日志的磁盘占用（占比条 + 会话数），并列出占用最大的会话 Top 10。纯只读统计，不修改任何数据；默认收起、展开时才统计，因此不会拖慢会话列表的加载。
- **自动归档**：可设为把 **30 / 60 / 90 天未活跃**的会话自动收进「已归档」，**默认关闭**。当前正在使用的会话与已收藏的会话（该保护可关闭）永不自动归档；只做归档标记，不删除任何数据，随时可恢复。检查在打开面板时惰性触发，每天最多一次，也可点「立即检查」手动执行。
- **批量多选**：全选 / 批量归档 / 恢复所选 / 删除所选（批量删除一次二次确认）。**全选只覆盖当前列表里真正占一行、可单独勾选的会话**——折叠中的子代理、聚拢的分支成员与「来源：」组头都不参与，避免选中界面上看不见的会话；批量删除同样按父会话级联子代理，提示会写明连带数量。勾选后批量操作栏**吸顶**钉在面板顶部，列表再长也无需滑回顶部操作；另提供「**移动所选…**」批量跨工作区移动（复用单移动面板：已有工作区 / 新建目录 / 系统目录浏览），单条失败不阻断整批，失败明细逐条回报。
```

</details>

**依据 2 · 源码核查**：[src/index.js:2098-2113](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L2098-L2113)

归档列表查询实际会话记录和回收状态。

<details>
<summary>查看原文（16行）</summary>

```text
    disposers.push(ctx.webServer.register({
      kind: 'exact',
      path: '/archived-sessions/list',
      handler: async (req, res) => {
        try {
          const state = await archivedState()
          const ids = state.archivedSessionIds || []
          // Only surface archived ids that still exist (materialized log or live).
          // Deleted sessions keep a hidden archive id but no log, so they drop out here.
          let materialized = new Set()
          let live = ctx.get('sessions')
          try {
            const entries = await persistence.listEntries()
            materialized = new Set(entries.map((entry) => entry.id))
          } catch (e) { /* best-effort */ }
          const trashStore = await readTrashStore()
```

</details>

**依据 3 · 源码核查**：[src/index.js:2287-2303](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L2287-L2303)

恢复路由及级联结果。

<details>
<summary>查看原文（17行）</summary>

```text
    disposers.push(ctx.webServer.register({
      kind: 'exact',
      path: '/archived-sessions/trash/restore',
      handler: async (req, res) => {
        try {
          const body = await readJsonBody(req)
          const sid = body && typeof body.sessionId === 'string' ? body.sessionId : null
          if (!sid) return json(res, { ok: false, error: 'missing sessionId' }, 400)
          const out = await restoreFromTrash(sid)
          metaCache.invalidate(sid)
          // 连带回收的子代理一起回来，父子生命周期保持一致。
          const cascaded = await cascadeTrashChildren(sid, (kid) => restoreFromTrash(kid))
          json(res, { ...out, cascaded: cascaded.filter((r) => r.ok).length, cascadedResults: cascaded.length ? cascaded : undefined })
        } catch (e) {
          json(res, { ok: false, code: e && e.code, error: String((e && e.message) || e) }, errorStatus(e))
        }
      },
```

</details>

#### 缺口

- 未比较真实整理时间和恢复准确率。
  **影响**：不能据集中界面推出效率。
  **进一步探讨**：对两个工作区的固定会话样本核操作与结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 活跃会话怎样识别，移动如何排队？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

宿主依赖 Web、工作区、会话持久化与存储服务。客户端按 clientId 上报当前会话，服务保留新鲜心跳。默认 45 秒，超过或清空后不再视为活跃，桶数还有上限，因此信号只能反映近期上报。移动读到活跃 ID 返回 409，由外层把占用类失败存入队列，后续尝试成功才从待处理表移除，仍忙时保留。心跳过期并不证明日志没有写者，实际移动是否安全仍受持久化与工作区语义影响。用户收到 queued 后应核任务是否真实完成。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:161-182](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L161-L182)

持久化、工作区和追踪初始化。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx) {
  const w = ctx.workspaceRegistry
  const sp = ctx.sessionPersistence
  const persistence = createPersistenceAdapter(sp)
  const capabilities = detectCapabilities({ persistence: sp, workspaceRegistry: w })
  const sq = ctx.sessionQuery
  const dom = () => ctx.storageDomain.get('workspace')
  const authorityTitleCache = new Map()
  // 会话原始元数据缓存（title / cwd / createdAt），按日志文件 (mtime, size) 指纹校验。
  // 见 src/session-meta-cache.js 的说明：列表构建原本每条会话都要整本解压日志，
  // 这个缓存让「日志没变」的会话直接跳过解码。
  const metaCache = createSessionMetaCache()
  // 持久标题索引（冷启动加速）：metaCache 是进程内的，重启即空——第一次列表
  // 仍要全库解码。索引按同样的 (mtime, size) 指纹存解码结果，指纹没变的会话
  // 重启后也直接复用。见 src/title-persist-index.js。
  const titleIndex = createTitleIndexStore({ dir: TRASH_DIR, file: join(TRASH_DIR, 'title-index.json') })
  // T1（3.7.0）：空白精判结论的持久层。只有**真解码成功**的判定落盘（unknown
  // 与失败兜底都不是结论），sz 指纹 + 14 天 TTL 双闸门防「同尺寸原地改写」。
  const emptyIndex = createEmptyScanStore({ dir: TRASH_DIR })
  // 活跃会话（客户端心跳上报，见 src/active-session.js）：0.1.7+ host 侧无法
  // 自行判断「用户正在看哪个会话」，靠客户端周期性上报。过期即失效。
  const activeTracker = createActiveSessionTracker()
```

</details>

**依据 2 · 源码核查**：[src/index.js:2083-2095](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L2083-L2095)

客户端心跳接入。

<details>
<summary>查看原文（13行）</summary>

```text
    disposers.push(ctx.webServer.register({
      kind: 'exact',
      path: '/archived-sessions/active-session',
      handler: async (req, res) => {
        const body = await readJsonBody(req)
        const clientId = body && typeof body.clientId === 'string' ? body.clientId : 'default'
        const sid = body && typeof body.sessionId === 'string' && body.sessionId ? body.sessionId : null
        const accepted = activeTracker.report(clientId, sid)
        json(res, {
          ok: accepted,
          activeSessionIds: [...activeTracker.activeIds()],
        })
      },
```

</details>

**依据 3 · 源码核查**：[src/active-session.js:19-46](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/active-session.js#L19-L46)

默认过期与限额。

<details>
<summary>查看原文（28行）</summary>

```text
export const DEFAULT_ACTIVE_TTL_MS = 45 * 1000
// 桶数量上限：clientId 由客户端生成，理论无限。超过就先清过期的，再清最旧的，
// 防止异常客户端（每次刷新换 id）把 Map 撑大。
export const MAX_ACTIVE_REPORTS = 32

// 与 host 侧会话 id 校验同源（src/index.js isSafeSessionId）：会话 id 会参与
// 日志路径拼接，含路径分隔符的脏数据必须挡在外面。
function isUsableSessionId(value) {
  return typeof value === 'string'
    && value.length > 0
    && value.length <= 200
    && !/[\\/\0]/.test(value)
    && value !== '.'
    && value !== '..'
}

export function createActiveSessionTracker(options = {}) {
  const ttl = Number.isFinite(options.ttlMs) ? Number(options.ttlMs) : DEFAULT_ACTIVE_TTL_MS
  const now = typeof options.now === 'function' ? options.now : () => Date.now()
  /** @type {Map<string, {id: string, at: number}>} */
  const reports = new Map()

  function trim(at) {
    for (const [key, value] of reports) if (at - value.at > ttl) reports.delete(key)
    while (reports.size > MAX_ACTIVE_REPORTS) {
      const oldest = reports.keys().next().value
      if (oldest === undefined) break
      reports.delete(oldest)
```

</details>

**依据 4 · 源码核查**：[src/active-session.js:56-78](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/active-session.js#L56-L78)

写入和读取活跃会话。

<details>
<summary>查看原文（23行）</summary>

```text
  function report(clientId, sessionId, at = now()) {
    const key = typeof clientId === 'string' && clientId ? clientId.slice(0, 64) : 'default'
    if (sessionId === null || sessionId === undefined || sessionId === '') {
      reports.delete(key)
      return true
    }
    if (!isUsableSessionId(sessionId)) return false
    reports.set(key, { id: String(sessionId), at })
    trim(at)
    return true
  }

  /**
   * Freshly reported active session ids (any connected client).
   * @returns {Set<string>}
   */
  function activeIds(at = now()) {
    const out = new Set()
    for (const [key, value] of reports) {
      if (at - value.at > ttl) { reports.delete(key); continue }
      out.add(value.id)
    }
    return out
```

</details>

**依据 5 · 源码核查**：[src/index.js:1074-1096](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L1074-L1096)

移动检查与 409。

<details>
<summary>查看原文（23行）</summary>

```text
  async function moveOne(sid, targetPath) {
    requireCapability(capabilities, 'move')
    // Only block the *active* conversation. ctx.sessions keeps instantiated
    // sessions alive after you switch away, so the old check (sessions.get(sid))
    // wrongly rejected every opened session — you could never move one you'd
    // merely looked at. When the host exposes no active-session accessor we
    // can't prove activeness, so we allow the move; the relocation below is
    // crash-safe (backup + rollback) and re-syncs the live object.
    const activeIds = getActiveSessionIds(ctx, activeTracker)
    const activeId = activeIds.values().next().value != null ? activeIds.values().next().value : null
    if (activeIds.has(String(sid)) || (activeId != null && String(activeId) === String(sid))) {
      const error = new Error('会话正被 DSH 打开，暂时无法移动；请重启 DSH 后再试。')
      error.status = 409
      error.code = 'DSM_SESSION_BUSY'
      throw error
    }
    const r = await persistence.readSession(sid, 0)
    if (!r || !r.meta) throw new Error('无法读取该会话的日志')
    const meta = r.meta
    const events = r.events
    const oldCwd = meta.cwd || null

    const { canonical, entity: target } = await moveTargetWorkspace(targetPath)
```

</details>

**依据 6 · 源码核查**：[src/index.js:1346-1380](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L1346-L1380)

队列登记与后续领取。

<details>
<summary>查看原文（35行）</summary>

```text
  async function moveOrQueue(sid, targetPath) {
    try {
      return await moveOne(sid, targetPath)
    } catch (e) {
      if (!isBusyError(e)) throw e
      await pendingMoves.queue(sid, targetPath)
      return { ok: true, moved: false, queued: true, notes: [QUEUE_NOTE] }
    }
  }

  // 启动后的「学步期」：这段时间内 moveOne 的非占用类失败只当环境未就绪，不计入
  // 「多次失败即放弃」的计数（否则 boot 竞态会把用户的排队项白白丢掉）。
  const BOOT_WARMUP_MS = 30000
  const bootedAt = Date.now()

  let queueRunning = false
  async function runPendingMoves(reason) {
    if (queueRunning) return { ran: false, moved: 0, kept: 0 }
    queueRunning = true
    let moved = 0
    const notes = []
    try {
      const items = await pendingMoves.list()
      for (const item of items) {
        try {
          await moveOne(item.sessionId, item.targetPath)
          await pendingMoves.remove([item.sessionId])
          metaCache.invalidate(item.sessionId)
          moved++
          notes.push(`排队中的移动已完成：${String(item.sessionId).slice(0, 18)}…`)
          // T2：通知落盘失败不吞掉移动结果本身（队列项已删，回滚代价不值——
          // 保留 console.warn 作最后兜底，这是刻意接受的静默缺口）。
          try { await moveNotices.append({ kind: 'moved', sessionId: item.sessionId, targetPath: item.targetPath, at: Date.now() }) } catch (e) { /* best-effort */ }
        } catch (e) {
          if (isBusyError(e)) continue // 仍被占用：留在队列里，等下一次触发
```

</details>

#### 缺口

- 未验证多客户端心跳超时和真实移动。
  **影响**：不能从排队成功认定跨工作区迁移已完成。
  **进一步探讨**：在测试工作区分别保持或停止心跳再查队列和日志。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 恢复与彻底删除怎样影响试用？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

恢复在移除回收站条目前先校验真实记录，必要时取消归档，失败保留回收记录。永久清理则先持久化删除标记，再尝试卸开活动会话和物理删除日志。拆卸或宿主能力缺失时可报 409。删除标记已落盘后，错误并不能证明操作完全没发生。父项恢复或清理可继续处理后代，单个父操作响应不保证每个后代成功。留存天数设置可触发到期清理，试用应先确保其值符合预期。

先在独占备份副本试单条归档、恢复，不做清空。首次要核宿主存储、备份、工作区与子代理，持续要检查待移动及回收条目，失败可能需人工还原，现金和时间未知。若工作区、后代状态或实际日志不符，就停用自动清理和批处理，改回宿主原生列表及备份。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:876-911](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L876-L911)

先验证恢复再移除持久回收记录。

<details>
<summary>查看原文（36行）</summary>

```text
  async function restoreFromTrash(sid) {
    requireSessionId(sid)
    requireCapability(capabilities, 'restoreIndexedSession')
    let outcome = null
    await mutateTrash(async (store) => {
      const entry = store.items.find((t) => String(t.sessionId) === sid)
      if (!entry) {
        if (store.purgedSessionIds.map(String).includes(sid)) {
          const error = new Error('该会话已彻底删除，无法从回收站恢复')
          error.status = 410
          error.code = 'DSM_SESSION_PURGED'
          throw error
        }
        const error = new Error('回收站中找不到该会话（可能已恢复过）')
        error.status = 404
        error.code = 'DSM_TRASH_NOT_FOUND'
        throw error
      }
      // Verify BEFORE removing the durable entry: if verification fails the
      // mutator throws, mutateTrash does not write, and the item remains
      // recoverable instead of disappearing into an inconsistent state.
      const verification = await verifyTrashRestore(sid)
      if (!verification.ok) {
        const error = new Error(verification.message)
        error.status = verification.status
        error.code = verification.code
        throw error
      }
      // Restore the pre-delete archive state before removing the durable trash
      // entry. If this fails, mutateTrash does not write and the item remains
      // recoverable instead of disappearing into an inconsistent state.
      if (entry.wasArchived === false) await restoreOne(sid)
      store.items = store.items.filter((t) => String(t.sessionId) !== sid)
      store.purgedSessionIds = store.purgedSessionIds.filter((id) => id !== sid)
      outcome = { ok: true, restored: true, workspaceGone: verification.workspaceGone, verified: verification.verified }
    })
```

</details>

**依据 2 · 源码核查**：[src/index.js:964-1009](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L964-L1009)

先写标记，再 detach、等待及删除。

<details>
<summary>查看原文（46行）</summary>

```text
        const error = new Error('日志路径与会话 ID 不匹配，已停止永久删除')
        error.status = 409
        throw error
      }
      // Persist the tombstone before any irreversible work. A crash after this
      // point may leave the trash item retryable, but can never resurrect the
      // session in a later list baseline.
      if (!store.purgedSessionIds.includes(sid)) store.purgedSessionIds.push(sid)
      await writeTrashStore(store)
      // A freshly-created or recently-opened Session can remain resident after
      // its file is unlinked. Flush once, then use SessionStore's entered-record
      // detach capability so DSH emits host/session-removed and the client list
      // drops the row instead of resurrecting it from live memory.
      try {
        const sessions = ctx.get('sessions')
        const liveSession = sessions && sessions.get && sessions.get(sid)
        if (liveSession && typeof sessions.flush === 'function') await sessions.flush(liveSession)
        const entered = sessions && sessions.store && sessions.store.get && sessions.store.get(sid)
        if (liveSession && (!entered || typeof entered.detach !== 'function')) throw new Error('宿主未提供 live Session detach 能力')
        if (entered && typeof entered.detach === 'function') entered.detach()
        // session/disposed starts an asynchronous persistence retirement. Wait
        // for it before unlinking, otherwise its final drain can race the file
        // deletion and briefly (or permanently) republish an orphan that the
        // official sidebar groups under “未分组”.
        const retirement = sp && sp.retirements && sp.retirements.get && sp.retirements.get(sid)
        if (retirement && typeof retirement.then === 'function') await retirement
      } catch (e) {
        const error = new Error('无法从宿主内存移除会话，已停止永久删除：' + String((e && e.message) || e))
        error.status = 409
        throw error
      }
      if (target && persistence.kind === 'session-handle' && locatedHeader) {
        // handle 时代：写所有权探测（活跃写者 409）→ 整目录删除 → 官方 stat 复核。
        // 内部复用与移动同一套路径守卫；删除失败会带 status 冒泡。
        await purgeSessionArtifacts(sp, sid, locatedHeader)
      } else if (target) {
        try { await unlink(target) } catch (e) { if (e && e.code !== 'ENOENT') throw new Error('删除文件失败：' + String((e && e.message) || e)) }
      }
      try { for (const ent of w.list()) { if (ent.sessionIds.includes(sid)) { try { await ent.detachSession(sid) } catch (e) {} } } } catch (e) {}
      try { if (w.sessionPaths && w.sessionPaths.delete) w.sessionPaths.delete(sid) } catch (e) {}
      try { if (w.headers && w.headers.delete) w.headers.delete(sid) } catch (e) {}
      await restoreOne(sid)
      // Rebuild from the post-unlink disk baseline before reporting success.
      // Merely deleting the two Maps above does not notify/rebuild Workspace
      // entities, leaving the client with an orphaned “未分组” snapshot.
      try { await reindexRegistry() } catch (e) { /* tombstone still prevents resurrection */ }
```

</details>

**依据 3 · 源码核查**：[src/index.js:1026-1047](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L1026-L1047)

留存天数和到期物理清理。

<details>
<summary>查看原文（22行）</summary>

```text
  async function trashSettings(next) {
    if (next === undefined) return (await readTrashStore()).settings
    const days = Number(next.retentionDays)
    if (!Number.isInteger(days) || ![0, 7, 30, 90].includes(days)) {
      const error = new Error('retentionDays 仅支持 0、7、30、90')
      error.status = 400
      throw error
    }
    await mutateTrash((store) => { store.settings = { retentionDays: days } })
    return (await readTrashStore()).settings
  }

  async function cleanupExpiredTrash() {
    if (!capabilities.actions.purge.available) return 0
    const store = await readTrashStore()
    const days = store.settings.retentionDays
    if (!days) return 0
    const cutoff = Date.now() - days * 86400000
    const ids = store.items.filter((item) => Number(item.deletedAt) > 0 && Number(item.deletedAt) < cutoff).map((item) => String(item.sessionId))
    let count = 0
    for (const sid of ids) { try { await purgeFromTrash(sid); count++ } catch (e) {} }
    return count
```

</details>

**依据 4 · 源码核查**：[src/index.js:2287-2326](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L2287-L2326)

恢复/删除的父与后代处理。

<details>
<summary>查看原文（40行）</summary>

```text
    disposers.push(ctx.webServer.register({
      kind: 'exact',
      path: '/archived-sessions/trash/restore',
      handler: async (req, res) => {
        try {
          const body = await readJsonBody(req)
          const sid = body && typeof body.sessionId === 'string' ? body.sessionId : null
          if (!sid) return json(res, { ok: false, error: 'missing sessionId' }, 400)
          const out = await restoreFromTrash(sid)
          metaCache.invalidate(sid)
          // 连带回收的子代理一起回来，父子生命周期保持一致。
          const cascaded = await cascadeTrashChildren(sid, (kid) => restoreFromTrash(kid))
          json(res, { ...out, cascaded: cascaded.filter((r) => r.ok).length, cascadedResults: cascaded.length ? cascaded : undefined })
        } catch (e) {
          json(res, { ok: false, code: e && e.code, error: String((e && e.message) || e) }, errorStatus(e))
        }
      },
    }))

    disposers.push(ctx.webServer.register({
      kind: 'exact',
      path: '/archived-sessions/trash/purge',
      handler: async (req, res) => {
        try {
          const body = await readJsonBody(req)
          const sid = body && typeof body.sessionId === 'string' ? body.sessionId : null
          if (!sid) return json(res, { ok: false, error: 'missing sessionId' }, 400)
          const out = await purgeFromTrash(sid)
          metaCache.invalidate(sid)
          // 彻底删除：持久标题索引里的条目一并清掉（issue #1 P4）。
          try { await titleIndex.remove([sid]) } catch (e) { /* 索引清理失败不阻塞删除结果 */ }
            try { await emptyIndex.remove([sid]) } catch (e) { /* 同上 */ }
          // 连带回收的子代理一并物理删除（否则父会话消失、子代理孤零零留在回收站）。
          const cascaded = await cascadeTrashChildren(sid, async (kid) => {
            const r = await purgeFromTrash(kid)
            try { await titleIndex.remove([kid]) } catch (e) {}
            try { await emptyIndex.remove([kid]) } catch (e) {}
            return r
          })
          json(res, { ...out, cascaded: cascaded.filter((r) => r.ok).length })
```

</details>

#### 缺口

- 未用真实宿主存储执行故障注入和备份恢复。
  **影响**：不能承诺物理删除可撤回或级联全成功。
  **进一步探讨**：仅在可丢弃副本核单条、级联与中途失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何检验重启后状态与日志一致？

**研究主题**：新假设与验证

#### 完整回答

假设集中整理能减少查看步骤，同时让用户准确知道哪些操作尚未完成。用两份隔离会话树，分别在登记移动队列后、回收记录写入后以及删除标记持久化后中断宿主。重启对照真实日志、会话面板、待移动队列和后代列表，记录是否重复移、错删或遗漏恢复。如果状态不一致需要大量人工查磁盘，或者误判可恢复范围，就保留原生和备份流程。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1346-1378](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L1346-L1378)

排队和成功后移除是不同步骤。

<details>
<summary>查看原文（33行）</summary>

```text
  async function moveOrQueue(sid, targetPath) {
    try {
      return await moveOne(sid, targetPath)
    } catch (e) {
      if (!isBusyError(e)) throw e
      await pendingMoves.queue(sid, targetPath)
      return { ok: true, moved: false, queued: true, notes: [QUEUE_NOTE] }
    }
  }

  // 启动后的「学步期」：这段时间内 moveOne 的非占用类失败只当环境未就绪，不计入
  // 「多次失败即放弃」的计数（否则 boot 竞态会把用户的排队项白白丢掉）。
  const BOOT_WARMUP_MS = 30000
  const bootedAt = Date.now()

  let queueRunning = false
  async function runPendingMoves(reason) {
    if (queueRunning) return { ran: false, moved: 0, kept: 0 }
    queueRunning = true
    let moved = 0
    const notes = []
    try {
      const items = await pendingMoves.list()
      for (const item of items) {
        try {
          await moveOne(item.sessionId, item.targetPath)
          await pendingMoves.remove([item.sessionId])
          metaCache.invalidate(item.sessionId)
          moved++
          notes.push(`排队中的移动已完成：${String(item.sessionId).slice(0, 18)}…`)
          // T2：通知落盘失败不吞掉移动结果本身（队列项已删，回滚代价不值——
          // 保留 console.warn 作最后兜底，这是刻意接受的静默缺口）。
          try { await moveNotices.append({ kind: 'moved', sessionId: item.sessionId, targetPath: item.targetPath, at: Date.now() }) } catch (e) { /* best-effort */ }
```

</details>

**依据 2 · 源码核查**：[src/index.js:968-998](https://github.com/TOBYCAI/dsh-sessions-manager/blob/ad0452298848386c4fd393ddb8a1a5fd552d90b2/src/index.js#L968-L998)

先写删除标记与真实删除的中断区间。

<details>
<summary>查看原文（31行）</summary>

```text
      // Persist the tombstone before any irreversible work. A crash after this
      // point may leave the trash item retryable, but can never resurrect the
      // session in a later list baseline.
      if (!store.purgedSessionIds.includes(sid)) store.purgedSessionIds.push(sid)
      await writeTrashStore(store)
      // A freshly-created or recently-opened Session can remain resident after
      // its file is unlinked. Flush once, then use SessionStore's entered-record
      // detach capability so DSH emits host/session-removed and the client list
      // drops the row instead of resurrecting it from live memory.
      try {
        const sessions = ctx.get('sessions')
        const liveSession = sessions && sessions.get && sessions.get(sid)
        if (liveSession && typeof sessions.flush === 'function') await sessions.flush(liveSession)
        const entered = sessions && sessions.store && sessions.store.get && sessions.store.get(sid)
        if (liveSession && (!entered || typeof entered.detach !== 'function')) throw new Error('宿主未提供 live Session detach 能力')
        if (entered && typeof entered.detach === 'function') entered.detach()
        // session/disposed starts an asynchronous persistence retirement. Wait
        // for it before unlinking, otherwise its final drain can race the file
        // deletion and briefly (or permanently) republish an orphan that the
        // official sidebar groups under “未分组”.
        const retirement = sp && sp.retirements && sp.retirements.get && sp.retirements.get(sid)
        if (retirement && typeof retirement.then === 'function') await retirement
      } catch (e) {
        const error = new Error('无法从宿主内存移除会话，已停止永久删除：' + String((e && e.message) || e))
        error.status = 409
        throw error
      }
      if (target && persistence.kind === 'session-handle' && locatedHeader) {
        // handle 时代：写所有权探测（活跃写者 409）→ 整目录删除 → 官方 stat 复核。
        // 内部复用与移动同一套路径守卫；删除失败会带 status 冒泡。
        await purgeSessionArtifacts(sp, sid, locatedHeader)
```

</details>

#### 缺口

- 未执行中断实验。
  **影响**：源码只提供可验证的边界。
  **进一步探讨**：保存阶段状态、真实日志和人工核对结果。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
