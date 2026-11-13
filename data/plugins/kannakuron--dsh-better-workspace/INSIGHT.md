# dsh-better-workspace

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7a36604](https://github.com/KannaKuron/dsh-better-workspace/tree/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b)

<!-- BEGIN META -->
[![GitHub ★ 35](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KannaKuron/dsh-better-workspace) [![npm 30d 9,698](https://img.shields.io/static/v1?label=npm+30d&message=9%2C698&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-workspace) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-workspace)
<!-- END META -->

> **功能**：为 DeepSeek Harness 工作区侧栏与会话选择器提供按目录和名称分组的树。

> **亮点**：[Q01](#research-q01) 在原生目录语义上叠加名称组，并让侧栏和新会话选择器共享视图。

> **主要限制**：[Q02](#research-q02) 发现工作区组移动按全列表标题前缀选成员，可能跨磁盘容器；逐项改名中断会留下部分变更。

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
  - [Q01 · 磁盘树、名称组与标题来源怎样组成实际界面？](#detail-section-11)
  - [Q02 · 从可见的工作区组执行移动时，成员范围和失败语义是否一致？](#detail-section-12)
  - [Q03 · 如何试用浏览功能并验证安全改组的最小条件？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个代码仓库的 DSH 用户可以按磁盘目录和名称前缀定位工作区与会话。

用原生工作区浏览器管理目录与会话，保留宿主自己的选择、重命名和归档。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工作区树 | 按磁盘及名称定位 | 槽位和宿主版本需兼容 |
| 会话分组 | 基于用户标题分组 | 标题来源不足时回退文本规则 |
| 组操作 | 修改名称前缀 | 批量写入作用域与失败回执需验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=24.9.0 与 DSH >=0.2.2-rc.1 | 是 | 加载 Web 和宿主投影 | 原生工作区 |
| Web 插槽、Menu 与目录流 | 各入口需要 | 接管树和原生选择器 | 使用宿主原入口 |
| 工作区 ID 与原名记录 | 试验批量操作需要 | 回读及恢复部分变更 | 保持只读 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在隔离 profile 载入组件 | 核对侧栏和新会话选择器 |
| 观察 | 查看目录和手工名称层 | 校对两入口及自动标题 |
| 退出 | 禁用组件并核对原生界面 | 按原清单恢复已写标题 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与依赖费用未知 | 核对版本和槽位 | 同版兼容待验 |
| 持续 | 本地视图状态与浏览器资源 | 管理名称前缀和重命名 | 定位节时未测 |
| 失败恢复 | 无已核外部费用 | 回读部分写入与恢复原名 | 卸载及误改恢复待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工作区定位 | 磁盘和名称两层真实实现 | 真实节时和大列表性能 |
| 会话标题分类 | 来源投影与文本回退 | 冷缓存下正确率 |
| 批量组移动 | 逐项宿主 rename | 影响范围与回滚仍需核对 |

> **思考**：[Q02](#research-q02) 发现工作区组移动按全列表标题前缀选成员，可能跨磁盘容器；逐项改名中断会留下部分变更。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在原生目录语义上叠加名称组，并让侧栏和新会话选择器共享视图。

[Q01](#research-q01) 使投影与宿主动作分离；[Q02](#research-q02) 的批量写入应检查视图 scope 与实际成员的对应。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 发现工作区组移动按全列表标题前缀选成员，可能跨磁盘容器；逐项改名中断会留下部分变更。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先试只读树和选择器，依 [Q02](#research-q02) 用合成条目验证批量改名，保留原生侧栏和原名清单。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持槽位挂载、两层树和标题来源。真实宿主兼容、批量移动影响和退出仍待核对。

- 已检查：作者 README、包清单、源码路径 README.md、src/title-source.js、src/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定挂载、树投影、标题来源、工作区组移动及历史会话改名；未执行安装、目标代码、测试或宿主。
- 下一步：隔离验证目录和名称树、两层同名前缀、第二项写入失败、历史会话重命名和禁用复原。

**分析版本**

- **仓库**：[KannaKuron/dsh-better-workspace](https://github.com/KannaKuron/dsh-better-workspace)
- **版本号**：0.43.0（[固定提交 7a36604](https://github.com/KannaKuron/dsh-better-workspace/tree/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出按容器和 ID 锁定成员，并用双容器、同名前缀和中途拒绝验证回执。

隔离验证目录和名称树、两层同名前缀、第二项写入失败、历史会话重命名和禁用复原。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1886 | — | — | 77378 |
| .js | source | 5 | 12084 | 9455 | 2466 | — |
| .mjs | test | 1 | 3081 | 1833 | 1154 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/KannaKuron/dsh-better-workspace/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/KannaKuron/dsh-better-workspace/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/KannaKuron/dsh-better-workspace/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：有大量工作区和会话的 DSH 用户怎样用目录与名称树定位任务，批量改组究竟会改变哪些宿主记录？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 磁盘树、名称组与标题来源怎样组成实际界面？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

常在多个仓库和长会话间切换的用户，可按目录或名字找到项目。客户端用较低优先级注册 sidebar.workspaces，接管渲染。磁盘层在已登记工作区中按路径段边界找最近祖先，名称层再在每一层生成分组。新会话选择器在宿主有 Menu 时使用同一视图 store。宿主的 titleSource 投影只读 session/title 的来源类型，客户端对已知的非 user 标题保持整条显示，来源缺失时继续使用文本规则。这使包含斜杠的自动标题不会在来源明确时误变成分组。选择目录、打开和删除仍调用宿主能力，插件的增量是树投影和动作入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-40](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/README.md#L26-L40)

作者说明目录流、名称组和会话。

<details>
<summary>查看原文（15行）</summary>

```text
### 添加工作区:官方目录流

点「添加工作区」走的是 **DSH 官方的目录拾取流**(v0.12.0 起):webserver 只绑本机 loopback 且有显示会话时,弹出宿主桌面上的**原生选择器**;绑到 `0.0.0.0`(局域网访问)、SSH 转发或宿主没有可用显示会话时,自动切换为官方**应用内目录浏览器**(多栏目录、从根开始的面包屑、可编辑路径、行内新建文件夹、隐藏文件开关)——这正是 0.11.x 自绘浏览器打磨的场景,官方补齐后整体让位。选完目录即创建工作区并开始一个新会话,与官方浏览器行为一致;对话空态页的「添加工作区」用的是**同一套官方占用者**,只是入口由本插件渲染(见下)。

分组不靠添加时弹窗——**改名即归组**:新建后重命名工作区(名称里的 `/` 就是分组),或直接拖拽进分组行。

### 分组:名字的投影

分组由工作区名称里的 `/` 自然派生,没有第二份需要同步的数据——右键分组行可**重命名分组**(批量改写组内所有工作区名称的前缀),分组树即时重排;根分组 = 名称不带 `/` 的工作区。

### 会话也吃这套规则

工作区里的会话名称同样用 `/` 分层(如 `测试1/两个插件维护`)。会话分组用**次级配色且无文件夹图标**渲染,和工作区文件夹一眼可辨;会话分组可整组重命名(批量改写成员标题)。

**重启后标题不回退**:DSH 重启后的冷列表只为命中投影缓存的会话携带标题——分叉出的会话与从未写过检查点的会话会暂时没有标题,真实的标题其实还在会话日志里。本插件把每个会话**最近一次的真实标题**持久化在浏览器里(带防抖的本地缓存,变更合并整写一次),回退窗口内直接用记忆标题渲染,`/` 分级分组照常成立;打开会话后官方数据到位即自动纠正。**从未有过标题的会话**(例如只写了头部、零轮次的空会话)不再回退成「工作区名」,而是显示官方语义的「未命名」(v0.36.14,issue #16)。
```

</details>

**依据 2 · 源码核查**：[src/title-source.js:23-38](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/title-source.js#L23-L38)

标题来源投影。

<details>
<summary>查看原文（16行）</summary>

```text
export function titleSourceProjection(z) {
  const schema = z.string().nullable()
  return {
    key: TITLE_SOURCE_KEY,
    stateVersion: 1,
    stateSchema: schema,
    init: () => null,
    apply: (state, event) => {
      if (!event || event.type !== 'session/title') return state
      const kind = event.data && event.data.source && event.data.source.kind
      return typeof kind === 'string' && kind !== '' ? kind : state
    },
    // A summary unit by default: the list row needs this value. Eager
    // providers must stay cheap; this fold only reads session/title events.
    wire: { viewSchema: schema, view: (state) => state },
  }
```

</details>

**依据 3 · 源码核查**：[src/client.js:51-69](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L51-L69)

客户端何时允许标题分组。

<details>
<summary>查看原文（19行）</summary>

```text
    // Host-recorded title provenance (src/title-source.js). A fresh session's
    // fallback/provider title never becomes a hierarchy; only a user rename or
    // an explicit grouping action may form groups. Undefined means the host
    // projection is not there (old cold cache), so the display falls back to
    // the text heuristics below.
    const TITLE_SOURCE_KEY = 'betterWorkspace/titleSource'
    const titleSourceOf = (summary) => {
      const values = summary && summary.projectionValues
      return values && typeof values === 'object' ? values[TITLE_SOURCE_KEY] : undefined
    }
    const groupsAllowedFor = (summary) => {
      const source = titleSourceOf(summary)
      return source === undefined || source === 'user'
    }
    /**
     * Plain-text splitting with the URL tail kept opaque: a bare "/" split
     * shreds URLs ("https:" → empty → host → path...), so from the first
     * "://" onward the tail is ONE leaf; text before the marker splits
     * normally at the last "/" before it. This is the FALLBACK guard —
```

</details>

**依据 4 · 源码核查**：[src/client.js:792-809](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L792-L809)

按最近已注册目录生成父节点。

<details>
<summary>查看原文（18行）</summary>

```text
    const diskParentMapOf = (items) => {
      const list = items || []
      const idByPath = new Map()
      for (const w of list) idByPath.set(normDiskPath(w.path), w.workspaceId)
      const map = new Map()
      for (const w of list) {
        const child = normDiskPath(w.path)
        let ownerPath
        let length = -1
        for (const root of idByPath.keys()) {
          if (root.length > length && child !== root && child.startsWith(root + '/')) {
            ownerPath = root
            length = root.length
          }
        }
        map.set(w.workspaceId, ownerPath !== undefined ? idByPath.get(ownerPath) : undefined)
      }
      return map
```

</details>

**依据 5 · 源码核查**：[src/client.js:859-896](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L859-L896)

磁盘与名称两层。

<details>
<summary>查看原文（38行）</summary>

```text
    function buildTree(items, groupMode, explicitWs, folderOrder) {
      const list = items || []
      // Issue #7: 'disk' nests by disk only, 'disk-slash' adds the name
      // layer on top (the historical workspaceSlash-on shape), 'slash' runs
      // the name layer WITHOUT any disk nesting — an empty parent map puts
      // every workspace at the root level where "/" segments group them.
      const slashOn = groupMode !== 'disk'
      const diskOn = groupMode !== 'slash'
      const diskParentOf = diskOn ? diskParentMapOf(list) : new Map()
      const childrenOf = new Map()
      for (const w of list) {
        const parent = diskParentOf.get(w.workspaceId)
        if (parent === undefined) continue
        if (!childrenOf.has(parent)) childrenOf.set(parent, [])
        childrenOf.get(parent).push(w)
      }
      // NAME layer inside one level: SEGMENT-driven keys (never re-split a
      // joined path — URL authority segments would shred).
      const buildLevel = (wsList, idPrefix) => {
        const root = { path: '', name: '', folders: [], workspaces: [] }
        const byPath = new Map([['', root]])
        const ensure = (segs) => {
          let node = root
          let key = ''
          for (const seg of segs) {
            key = key === '' ? seg : key + '/' + seg
            let next = byPath.get(key)
            if (!next) {
              next = {
                path: key,
                name: seg,
                folders: [],
                workspaces: [],
                idPath: (idPrefix !== '' ? idPrefix + '//' : '') + key,
                // Declared-group scope of THIS level (v0.17.0): the exact key a
                // new child group must be filed under in folders.ws.
                scope: idPrefix,
              }
```

</details>

**依据 6 · 源码核查**：[src/client.js:7768-7784](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L7768-L7784)

打开、改名及删除用宿主动作。

<details>
<summary>查看原文（17行）</summary>

```text
        startSession: (workspaceId) => { uiWorkspace.startSession(workspaceId) },
        open: (sessionId) => { uiWorkspace.openSession(sessionId) },
        searchSessions,
        searchResultLimit: sessions.searchResultLimit !== undefined ? sessions.searchResultLimit : 20,
        renameSession,
        forkSession,
        renameWorkspace: (workspaceId, title) => workspaces.rename(workspaceId, title),
        deleteWorkspace: (workspaceId) => workspaces.delete(workspaceId),
        insertWorkspaceBefore: typeof workspaces.insertBefore === 'function'
          ? (workspaceId, beforeWorkspaceId) => workspaces.insertBefore(workspaceId, beforeWorkspaceId)
          : undefined,
        // Official contract exposes session reorder through the WORKSPACES
        // service (see dsh ui-workspace client index.ts); feature-probed so a
        // service without it degrades to "group-move only" instead of a TypeError.
        insertSessionBefore: typeof workspaces.insertSessionBefore === 'function'
          ? (workspaceId, sessionId, beforeSessionId) => workspaces.insertSessionBefore(workspaceId, sessionId, beforeSessionId)
          : undefined,
```

</details>

**依据 7 · 源码核查**：[src/client.js:7920-7936](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L7920-L7936)

注册侧栏位置。

<details>
<summary>查看原文（17行）</summary>

```text
      // the browser itself — lowest priority renders, shadowing the shipped
      // entry. NO children declaration here (v0.12.1): the child-hole
      // declaration is exclusive and the shipped entry already owns it —
      // re-declaring would throw and silently unregister this seat (the
      // v0.12.0 regression). The add flow rides the sidebar-hole occupation
      // registered above instead.
      slots.inject('sidebar.workspaces', guarded(
        'sidebar.workspaces',
        {
          name: 'sidebar.workspaces',
          priority: -1,
          store: viewStore,
          inject: browserInjected,
          locale: NS,
        },
        BetterBrowser,
      ))
```

</details>

**依据 8 · 源码核查**：[src/client.js:7966-7976](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L7966-L7976)

选择器与侧栏共享视图 store。

<details>
<summary>查看原文（11行）</summary>

```text
        slots.inject('conversation.hero.workspace', guarded(
          'conversation.hero.workspace',
          {
            name: 'conversation.hero.workspace',
            priority: -1,
            store: viewStore,
            inject: heroInjected,
            locale: NS,
          },
          HeroWorkspacePicker,
        ))
```

</details>

#### 缺口

- 目标宿主与其他侧栏插件的槽位优先级
  **影响**：影响实际生效的面板
  **进一步探讨**：隔离 profile 对照两个入口和禁用后的原生占位

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从可见的工作区组执行移动时，成员范围和失败语义是否一致？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

树内的名称组有当前磁盘层的 scope 和 idPath，因此两个目录容器可各有同名组。可见的“移到分组”操作中，工作区组分支却从整个 items 以标题 startsWith(target.path + "/") 找成员，没有把目标组的磁盘层带入匹配。若两个容器各有名称以 qa/ 开头的工作区，在该动作的 inputs 包含两层条目时，另一层同名前缀也会进入宿主重命名循环。循环逐个 await，后项失败只进入 catch，未看到对已完成前项的回滚。会话组分支先找到具体 workspace 再构造会话树，不能把两者的作用域混同。关闭的历史会话重命名优先探测私有 sessions.manager，缺失才走公开 using 加载历史，若该私有方法存在但返回失败，直接报错。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:859-896](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L859-L896)

分组 ID 包含当前磁盘容器，存在独立 scope。

<details>
<summary>查看原文（38行）</summary>

```text
    function buildTree(items, groupMode, explicitWs, folderOrder) {
      const list = items || []
      // Issue #7: 'disk' nests by disk only, 'disk-slash' adds the name
      // layer on top (the historical workspaceSlash-on shape), 'slash' runs
      // the name layer WITHOUT any disk nesting — an empty parent map puts
      // every workspace at the root level where "/" segments group them.
      const slashOn = groupMode !== 'disk'
      const diskOn = groupMode !== 'slash'
      const diskParentOf = diskOn ? diskParentMapOf(list) : new Map()
      const childrenOf = new Map()
      for (const w of list) {
        const parent = diskParentOf.get(w.workspaceId)
        if (parent === undefined) continue
        if (!childrenOf.has(parent)) childrenOf.set(parent, [])
        childrenOf.get(parent).push(w)
      }
      // NAME layer inside one level: SEGMENT-driven keys (never re-split a
      // joined path — URL authority segments would shred).
      const buildLevel = (wsList, idPrefix) => {
        const root = { path: '', name: '', folders: [], workspaces: [] }
        const byPath = new Map([['', root]])
        const ensure = (segs) => {
          let node = root
          let key = ''
          for (const seg of segs) {
            key = key === '' ? seg : key + '/' + seg
            let next = byPath.get(key)
            if (!next) {
              next = {
                path: key,
                name: seg,
                folders: [],
                workspaces: [],
                idPath: (idPrefix !== '' ? idPrefix + '//' : '') + key,
                // Declared-group scope of THIS level (v0.17.0): the exact key a
                // new child group must be filed under in folders.ws.
                scope: idPrefix,
              }
```

</details>

**依据 2 · 源码核查**：[src/client.js:4905-4931](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L4905-L4931)

“移到分组”路径构造目标名称。

<details>
<summary>查看原文（27行）</summary>

```text
      /**
       * Commit one "move to group" for all four row kinds. Batch kinds
       * (folder / sgroup) rewrite the prefix of every member, exactly like
       * the existing rename-group dialogs; single kinds just retitle the
       * entry. All paths are user-driven renames, so sessions go through
       * renameByUser, so the next snapshot records source "user" and the new
       * prefix becomes a real group.
       */
      const submitGroupMove = (target, rawGroup) => {
        if (!target) { setDialog(null); return }
        const group = normPath(String(rawGroup || ''))
        const leaf = target.allowGroups === false ? String(target.title || '') : leafOf(target.title)
        const safe = target.kind === 'session' ? leafForGroup(leaf, target.allowGroups === false) : leaf
        const next = group ? group + '/' + safe : safe
        if (next === '' || next === target.title) { setDialog(null); return }
        if (target.kind === 'workspace') {
          Promise.resolve()
            .then(() => renameWorkspace(target.id, next))
            // The host action is optional; the rename above is the move either
            // way. rc.1's browserInjected provides insertWorkspaceBefore.
            .then(() => { if (typeof insertWorkspaceBefore === 'function') insertWorkspaceBefore(target.id) })
            .then(() => setDialog(null))
            .catch(fail)
          return
        }
        if (target.kind === 'session') {
          Promise.resolve()
```

</details>

**依据 3 · 源码核查**：[src/client.js:4937-4963](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L4937-L4963)

工作区标题跨 items 匹配；会话组先限定 workspace；逐项写入。

<details>
<summary>查看原文（27行）</summary>

```text
        if (target.kind === 'folder') {
          const affected = (items || []).filter((w) => String(w.title || '').startsWith(target.path + '/'))
          Promise.resolve()
            .then(async () => {
              for (const w of affected) {
                await renameWorkspace(w.workspaceId, next + String(w.title).slice(target.path.length))
              }
            })
            .then(() => setDialog(null))
            .catch(fail)
          return
        }
        if (target.kind === 'sgroup') {
          const workspace = (items || []).find((w) => w.workspaceId === target.workspaceId)
          if (!workspace) { setDialog(null); return }
          const node = findSessionGroup(buildSessionTree(sessionsOf(workspace), sessionSlash, sessFolders, workspace.workspaceId), target.path)
          if (!node) { setDialog(null); return }
          const affected = collectSessionRows(node)
          Promise.resolve()
            .then(async () => {
              for (const row of affected) {
                if (row.blank) continue
                await renameByUser(row.id, next + row.title.slice(target.path.length))
              }
            })
            .then(() => setDialog(null))
            .catch(fail)
```

</details>

**依据 4 · 源码核查**：[src/client.js:7772-7778](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L7772-L7778)

宿主 rename 执行。

```text
        renameSession,
        forkSession,
        renameWorkspace: (workspaceId, title) => workspaces.rename(workspaceId, title),
        deleteWorkspace: (workspaceId) => workspaces.delete(workspaceId),
        insertWorkspaceBefore: typeof workspaces.insertBefore === 'function'
          ? (workspaceId, beforeWorkspaceId) => workspaces.insertBefore(workspaceId, beforeWorkspaceId)
          : undefined,
```

**依据 5 · 源码核查**：[src/client.js:7653-7700](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L7653-L7700)

历史会话重命名探测和失败边界。

<details>
<summary>查看原文（48行）</summary>

```text
      // Rename performance (issue #14): sessions.using retains the session and
      // awaits reference.ready FIRST, so renaming a closed 5MB row stalled ~6s
      // loading its whole history just to send a 20ms rename RPC (the rename
      // itself is independent of the transcript). Tiered, cheapest first:
      //
      // 1. Open session → borrow binding directly. binding(id) only sees
      //    retained scopes, so "a binding comes back" IS the open test. Same
      //    SessionBinding object the using path borrows, so title projection
      //    and list refresh behave exactly the same.
      // 2. Closed session → PRIVATE BRIDGE: sessions.manager.rename(id, title)
      //    is "Rename a Session ... without opening its history"
      //    (manager.ts:578). `manager` is a TS-private field of ClientSessions
      //    (service.d.ts:105), not part of ISessions; it is reachable at
      //    runtime, so this tier is feature-probed. It is kept because the
      //    public using() path below loads the whole history first (multi-second
      //    on a large closed session). This is the plugin's ONLY private-API
      //    reach; if the host ever stops exposing the field, tier 3 still
      //    renames correctly (just slower).
      // 3. Fallback → sessions.using with an explicit source: public, but slow
      //    (loads history). Then fail loud.
      // Fork and open go through the uiWorkspace navigation service: ISessions
      // no longer carries open() at all (navigation belongs to the view owner,
      // replaceMain).
      const renameSession = async (sessionId, title) => {
        const fail = (result) => new Error(result && result.error ? result.error.message : 'session rename failed')
        const binding = typeof sessions.binding === 'function' ? sessions.binding(sessionId) : undefined
        const face = binding ? binding.session : undefined
        if (face && typeof face.rename === 'function') {
          const result = await face.rename(title)
          if (!result || !result.ok) throw fail(result)
          return
        }
        const manager = sessions.manager
        if (manager && typeof manager.rename === 'function') {
          const result = await manager.rename(sessionId, title)
          if (!result || !result.ok) throw fail(result)
          return
        }
        if (typeof sessions.using === 'function') {
          const result = await sessions.using(
            sessionId,
            { source: 'workspaceOperation' },
            (reference) => reference.binding.session.rename(title),
          )
          if (!result || !result.ok) throw fail(result)
          return
        }
        throw new Error('session rename is unavailable on this host')
```

</details>

#### 缺口

- 真实界面具体动作对 items 的覆盖和部分失败状态未执行
  **影响**：不能断言任意入口一定跨容器或每个版本可复现
  **进一步探讨**：隔离环境建两层同前缀，再使第二个重命名拒绝，回读宿主实际标题

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用浏览功能并验证安全改组的最小条件？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

先在满足 Node 与 DSH 声明版本的隔离 Web profile 查看磁盘树，再用自动标题和手工斜杠标题核对来源投影。添加目录仍依赖宿主目录选择器和槽位账本，缺失时可继续使用原生视图。共享或重要工作区避免直接试批量写，先记录宿主工作区 ID 与标题，并在合成条目验证部分失败；禁用可恢复显示方式，已写标题需按原记录手工恢复。建议验证的改动是按组的 scope 与稳定工作区 ID 固定操作成员，先展示受影响行，再对写入部分失败给出逐项回执。双容器同名前缀的目标是不触碰另一组，刻意制造失败时要求能识别已写和待恢复项。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-37](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/package.json#L20-L37)

宿主版本与 Web 注入声明。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "node": ">=24.9.0",
    "dsh": ">=0.2.2-rc.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-modules",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-context-menu"
      ],
      "platform": "web"
```

</details>

**依据 2 · 源码核查**：[src/client.js:7791-7818](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L7791-L7818)

原生目录选择及目录流降级。

<details>
<summary>查看原文（28行）</summary>

```text
        createWorkspace: (input) => workspaces.create(input),
        // Issue #20: a workspace with no standing blank needs the official
        // blank path, which writes workspace membership and reveals the new
        // row. The service lives in this apply() scope, so expose it through
        // the same injection face as the other browser actions.
        openWorkspace: (workspaceId, beforeOpen, options) => uiWorkspace.openWorkspace(workspaceId, beforeOpen, options),
        pickDirectory: () => uiWorkspace.pickDirectory(),
        // Browse-side primitives: the in-app dialog needs them whenever the
        // Host composes the browse backend instead of the OS chooser.
        listDirectory: (path, signal) => uiWorkspace.listDirectory(path, signal),
        createDirectory: (path, name) => uiWorkspace.createDirectory(path, name),
        // v0.28.0: the shipped occupant's ledger entry for the SIDEBAR flow
        // hole (same read as the hero one, v0.22.0). The browse surface
        // registers into both holes, so its in-app dialog renders from the
        // sidebar too; a native entry read this way is renderless and would
        // only re-run the OS chooser the native branch already drives
        // directly, so the browse probe keeps choosing the path.
        sidebarFlowEntry: () => {
          try {
            const list = slots.entries('sidebar.workspaces.directoryFlow')
            const entry = Array.isArray(list) && list.length > 0 ? list[0] : null
            return entry && entry.component ? entry : null
          } catch (error) {
            return null
          }
        },
        hooks: {
          directoryFlow: flowSource(slots, 'sidebar.workspaces.directoryFlow'),
```

</details>

**依据 3 · 源码核查**：[src/client.js:4937-4963](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/src/client.js#L4937-L4963)

逐项改名与失败回执。

<details>
<summary>查看原文（27行）</summary>

```text
        if (target.kind === 'folder') {
          const affected = (items || []).filter((w) => String(w.title || '').startsWith(target.path + '/'))
          Promise.resolve()
            .then(async () => {
              for (const w of affected) {
                await renameWorkspace(w.workspaceId, next + String(w.title).slice(target.path.length))
              }
            })
            .then(() => setDialog(null))
            .catch(fail)
          return
        }
        if (target.kind === 'sgroup') {
          const workspace = (items || []).find((w) => w.workspaceId === target.workspaceId)
          if (!workspace) { setDialog(null); return }
          const node = findSessionGroup(buildSessionTree(sessionsOf(workspace), sessionSlash, sessFolders, workspace.workspaceId), target.path)
          if (!node) { setDialog(null); return }
          const affected = collectSessionRows(node)
          Promise.resolve()
            .then(async () => {
              for (const row of affected) {
                if (row.blank) continue
                await renameByUser(row.id, next + row.title.slice(target.path.length))
              }
            })
            .then(() => setDialog(null))
            .catch(fail)
```

</details>

**依据 4 · 作者声明**：[README.md:140-147](https://github.com/KannaKuron/dsh-better-workspace/blob/7a36604b1dfcb138b3bfbc23f1a6d9cab2159d3b/README.md#L140-L147)

作者的隔离检查和回到原浏览器路径。

````text
## 开发

```bash
npm test        # 冒烟测试:清单一致性 / 基线 require 白名单 / 21 门词典键集对齐 / 语法
npm pack        # 出 tarball 后可本地安装验证
```

本地验证:把 `npm pack` 产出的 tarball 装进 web profile 并手动挂载(见上),重启 DSH,验证:层级树渲染、添加工作区弹窗、重命名即时重排、新建分组、卸载后回到原浏览器。
````

#### 缺口

- 真实宿主的菜单共存、关闭和状态清理未验证
  **影响**：限制批量写操作和长期采用
  **进一步探讨**：在隔离 profile 验证只读树、同名前缀、失败恢复及禁用

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
