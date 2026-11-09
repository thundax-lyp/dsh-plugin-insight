# DrawAI

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[128f86e](https://github.com/fourzkw/dsh-drawai/tree/128f86e97b053e3f3784c9acb2735c73a7b65766)

<!-- BEGIN META -->
[![GitHub ★ 280](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=280&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fourzkw/dsh-drawai) [![npm 30d 6,816](https://img.shields.io/static/v1?label=npm+30d&message=6%2C816&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-drawai) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-drawai)
<!-- END META -->

> **功能**：在 DSH 右侧栏编辑工作区画布，并用语义工具读写原生 .drawai 或兼容 .drawio 的插件。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，工作区文件可在 DSH 右侧栏手动调整，模型也能按节点与边的结构读取和更新同一份文档。

> **主要限制**：[Q03](#research-q03) 普通版本检查与撤销保护并不对称。撤销遇到版本变化仍可把旧文本整份写回，只在后台任务节点变化时停下。

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
  - [Q01 · 可编辑流程图相比手工绘制或静态图片增加什么？](#detail-section-11)
  - [Q02 · 语义操作怎样转成并写入 DrawAI 文件？](#detail-section-12)
  - [Q03 · 路径与同时编辑时的保护边界在哪里？](#detail-section-13)
  - [Q04 · 怎样小范围采用并恢复？](#detail-section-14)
  - [Q05 · 往返导入与修改能否保留人工编辑？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：软件维护者在 DSH 讨论发布或故障流程，需要把讨论整理成可复核并能继续人工调整的工作区流程图。

在独立 draw.io 编辑器手工绘图并维护文件，或将会话图例作为静态图嵌入文档。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：diagram_read 和 diagram_apply
- **界面**：DSH 右侧栏 .drawai 和 .drawio 画布
- **Host 路由**：Web 读取、迁移、保存及撤销

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 20 及以上和匹配的 DSH Tools、FS、会话、沙箱、Web 服务 | 启动必需 | 注册读写工具与画布后端 | 无法完整加载或操作 |
| 匹配的 Web 右侧栏和工作区文件接口 | 画布入口必需 | 打开并编辑工作区画布 | 右侧栏不可用或文件不可见 |
| 可写副本及有明确权限的会话 | 写入时必需 | 保存画布、迁移或恢复 | 写入失败或停留旧格式 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者保留原稿及媒体并打开副本 | 能区分旧文件、迁移文件和活动路径 |
| 加载 | DSH 挂载插件，维护者打开右侧栏 | 工具可读指定路径及页面 |
| 执行 | 模型按读回指纹修改一个节点 | 无冲突且只有预期改变 |
| 验收 | 维护者读回、打开并核对相关页面 | 保留未改内容，异常时回原稿 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH 环境、工作区副本及媒体空间 | 核对格式、迁移与活动路径 | Host 兼容及迁移人时未知 |
| 持续使用 | 会话模型请求和文件存储 | 按页复核结构、布局及导出 | 图复杂度与人工返工未量化 |
| 失败恢复 | 原稿、媒体副本、原编辑器 | 比对冲突，恢复并重新应用必要改动 | 进程外竞争与恢复人时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可编辑交付 | 有工作区文档和语义读写路径 | 节时、样式渲染和任务质量 |
| 同步编辑 | 进程内写入协调，带旧版本可被拒绝 | 外部进程并发和普通改动撤销后是否保留 |
| 旧图迁移 | 有来源身份、内容检查及原 XML 模板 | 复杂多页、媒体和扩展样式往返保真 |

> **思考**：[Q03](#research-q03) 普通版本检查与撤销保护并不对称。撤销遇到版本变化仍可把旧文本整份写回，只在后台任务节点变化时停下。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，工作区文件可在 DSH 右侧栏手动调整，模型也能按节点与边的结构读取和更新同一份文档。

真正的执行入口包住语义 apply 并按文档路径协调。普通写入、旧图迁移、后台任务及快照撤销的条件不同，尤其不能把撤销当成独立备份。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 普通版本检查与撤销保护并不对称。撤销遇到版本变化仍可把旧文本整份写回，只在后台任务节点变化时停下。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 有独立原稿的维护者可在副本上先改一条流程标签，再从右侧栏核对节点和页面。[Q03](#research-q03) 若发生版本冲突或模型修改后又有人工编辑，停止写入和撤销，留存两个版本并回原编辑器核对。[Q04](#research-q04) 使用旧图时分别检查文档和媒体迁移。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认画布与语义工具接线、格式迁移及冲突边界。实际渲染、多人编辑和往返保真待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/client.js、lib/index.js、lib/canvas-format.js、lib/task-coordinator.js、docs/native-canvas.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根插件的模型读写、工作区画布、兼容格式与恢复链。图像生成、视频、远端素材和所有绘图格式未深入核查。
- 下一步：仅固定源码。用有独立原稿的两页小图测试旧指纹拒绝、普通人工标签变化后的撤销和一次兼容导出，再比对节点、边、未编辑页与文件哈希。

**分析版本**

- **仓库**：[fourzkw/dsh-drawai](https://github.com/fourzkw/dsh-drawai)
- **版本号**：0.4.2（[固定提交 128f86e](https://github.com/fourzkw/dsh-drawai/tree/128f86e97b053e3f3784c9acb2735c73a7b65766)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对小图做迁移、带指纹写入及外部编辑后的撤销对照，可以区分语义可编辑与往返保真。

仅固定源码。用有独立原稿的两页小图测试旧指纹拒绝、普通人工标签变化后的撤销和一次兼容导出，再比对节点、边、未编辑页与文件哈希。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 558 | 42680 | — | — | 787630 |
| .js | source | 294 | 134425 | 112827 | 18293 | — |
| .mjs | source | 125 | 29195 | 25307 | 2508 | — |
| .jsx | source | 6 | 249 | 225 | 15 | — |
| .tsx | source | 549 | 132882 | 110547 | 21846 | — |
| .ts | source | 21 | 924 | 741 | 144 | — |
| .md | example | 1 | 5 | — | — | 193 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-09），可前往 [GitHub Issues](https://github.com/fourzkw/dsh-drawai/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断使用 DSH 整理软件流程的维护者，能否从语义操作得到可继续编辑的流程图，并识别目标绑定和失败后恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可编辑流程图相比手工绘制或静态图片增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

写技术文档的人可以让模型修改工作区流程图并在同一画布上手工继续。作者以从右侧栏建画布、画节点、让模型编辑为主路径。固定 manifest 和浏览器源文件有宿主接线，识别 `.drawai` 与 `.drawio`。相对粘贴静态图或跳到外部编辑器，交付物保留节点、边和页面，可回读和修改。线条审美、导出保真和节时要在任务上另测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-65](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/README.md#L49-L65)

作者描述手工与模型共编及默认格式

<details>
<summary>查看原文（17行）</summary>

```text
1. 打开右侧栏「DrawAI 画布」，选择 **文件 → 新建画布…**，输入名称并创建。也可以通过 **文件 → 打开…** 选择工作区中的 `.drawai` 或 `.drawio`。
2. 从画布右侧元素条选择形状，在画布上放置；双击节点编辑文字。拖动节点、连接关系，或使用图层和对齐工具整理版面。
3. 在对话里提出需求，例如：

   > 在当前画布画一个用户登录流程：输入账号密码，验证成功进入首页，失败时提示重试。

4. 模型完成后，可以继续手动调整，或选中节点后说「把这些步骤改成蓝色」；需要时通过画布的编辑菜单撤销 AI 改动。

画布文件保存在当前工作区。新建默认使用 `.drawai`；界面打开旧 `.drawio` 时会迁移到 `.drawai`，并保留原文件。格式、媒体目录和迁移限制见[原生画布与兼容说明](docs/native-canvas.md)。

## 常用工作流

### 画图和改图

画布支持形状、独立文字、表格、SVG 和位图节点，以及直线、折线、曲线、自环和悬空连线。可用多选、图层、顺序、对齐和页面切换整理内容；双击文字或表格编辑。

模型通过 `diagram_read` 读取结构、样式、选区与文件版本，通过 `diagram_apply` 增删或修改节点和边。对于并发编辑，`expectRevision` 可在文件版本不匹配时阻止写入。
```

</details>

**依据 2 · 源码核查**：[package.json:53-78](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/package.json#L53-L78)

包的宿主入口和运行条件

<details>
<summary>查看原文（26行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "@babel/parser": "7.28.5",
    "@babel/traverse": "7.28.5",
    "@resvg/resvg-js": "^2.6.2",
    "parse5": "7.3.0",
    "postcss": "8.5.32",
    "npm": "10.9.4"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.1 <0.1.0 || >=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-api-workspace-files"
      ]
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:12-14](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/cordis.patch.yml#L12-L14)

挂载根插件

```text
- insert:
    - id: drawai
      name: 'dsh-drawai'
```

**依据 4 · 源码核查**：[src/client.js:14981-15005](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/src/client.js#L14981-L15005)

浏览器源代码注册画布标签和文件类型

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.effect(() =>
    ctx.sidebarRightTabs.register({
      id: ID,
      kind: KIND,
      patterns: ['**/*.drawai', '**/*.drawio'],
      title: (address) => {
        const name = basename(address)
        return name.length > 0 && name !== KIND ? name : 'DrawAI 画布'
      },
      guide: [
        {
          order: 30,
          title: () => 'DrawAI 画布',
          description: () => '打开 .drawai / .drawio 画布；AI 与用户共同编辑，旧画布自动迁移',
        },
      ],
    }),
  )

  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({ name: 'sidebar.right.pane.tab', key: ID }, CanvasBody)))
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({ name: 'sidebar.right.pane.tab.title', key: ID }, CanvasTitle)))
}

exports.name = 'drawai'
exports.inject = ['slots', 'sidebarRightTabs', 'sidebarRight', 'timer', 'remote', 'remote.workspaceFiles']
```

</details>

#### 缺口

- 缺用户反复维护同一张图的对照。
  **影响**：不能估计维持文档更新或人工制图时间。
  **进一步探讨**：以一张发布流程图比较手工与会话共编的完成、修订和交接成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 语义操作怎样转成并写入 DrawAI 文件？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host effect 注册 read 和 apply。读取可按显式目标或会话焦点，回传真实路径、内容指纹、页面、节点、连线和选区。apply 本体要求显式路径和非空操作，装载文件后执行结构化操作，用户钉住的布局有保留机制，写回时按文件格式选择原生 JSON 或兼容 XML。原生编码更新指定页面并序列化整个项目，不能以关于旧 XML 的源码注释推断 JSON 字节保持不变。宿主文件服务实际执行写入，错误带策略上下文返回。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:6571-6573](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L6571-L6573)

读工具注册接线

```text
  })))
  ctx.effect(() => registerHostTool(readTool))
  ctx.effect(() => registerHostTool(defineTool({
```

**依据 2 · 源码核查**：[lib/index.js:7686-7694](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L7686-L7694)

写工具通过文档协调器注册

```text
  ctx.effect(() => registerHostTool({ ...applyTool, execute: async (args, exec) => {
    const sessionId = sessionIdOf(exec)
    const path = typeof args.path === 'string' && args.path ? args.path : focusedPathFor(sessionId) || DEFAULT_PATH
    const target = await resolveTarget(path, sessionId)
    return documents.run(absoluteHint(target, path), async () => {
      const current = await resolveTarget(path, sessionId)
      return documents.run(absoluteHint(current, path), () => applyTool.execute(args, exec))
    })
  } }))
```

**依据 3 · 源码核查**：[lib/index.js:3490-3499](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L3490-L3499)

读取目标来源

<details>
<summary>查看原文（10行）</summary>

```text
    async execute(args, exec) {
      // 读写都只接受显式路径或当前会话的焦点；未知目标时不猜 demo。
      const focus = focusedPathFor(sessionIdOf(exec))
      const path =
        typeof args.path === 'string' && args.path.trim().length > 0 ? args.path : focus
      if (!path) throw new Error('未指定画布路径且当前会话没有聚焦画布，请传入 path 或先打开目标画布')
      assertCanvasPath(path)
      const pageArg =
        Number.isFinite(Number(args.page)) ? Number(args.page) : focusedPageFor(sessionIdOf(exec))
      const loaded = await loadDoc(path, sessionIdOf(exec), pageArg)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3714-3737](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L3714-L3737)

真实路径、版本、页面、内容和选区

<details>
<summary>查看原文（24行）</summary>

```text
      return {
        path: loaded.absolute,
        revision: doc.revision,
        ...(doc.page !== undefined && doc.page !== null ? { page: { w: Number(doc.page.w), h: Number(doc.page.h) } } : {}),
        pageIndex: loaded.pageIndex,
        pageCount: loaded.pageCount,
        pageNames: Array.isArray(loaded.pageNames) ? loaded.pageNames : [],
        ...(filtered ? { filtered: true, totalNodes: doc.nodes.length, totalEdges: doc.edges.length } : {}),
        ...(lookState !== undefined ? { look: lookState } : {}),
        ...(imageValue !== undefined ? { image: imageValue } : {}),
        notes: loaded.notes,
        nodes: nodes,
        edges: edges,
        ...(exportState !== undefined ? { export: exportState } : {}),
        highlight: Array.isArray(pendingHighlight) ? pendingHighlight : [],
        canRevert: revertDepth(snapshotKey(sessionIdOf(exec), loaded.absolute)) > 0,
        // 还能退回几步（栈深）：模型据此告诉用户"可以连按几次撤销"。
        revertSteps: revertDepth(snapshotKey(sessionIdOf(exec), loaded.absolute)),
        // 用户当前的选区（按文件配对、按存在过滤）：用户说"把这几个…"时指的就是它们。
        // 过滤过也要照旧回 —— "用户选中的那几个"正是最该看的东西。
        selection: selectionForCanvas(sessionIdOf(exec), loaded.absolute, doc),
        // 图层表（顺序 = 叠放顺序）：加层/移层/改名看 diagram_apply 的 addLayer/setLayer/setLayerProps。
        layers: (Array.isArray(doc.layers) ? doc.layers : []).map((l) => ({
          id: String(l.id),
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3998-4034](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L3998-L4034)

写入路径、操作及前置版本检查

<details>
<summary>查看原文（37行）</summary>

```text
    async execute(args, exec) {
      // 写入必须显式给路径，避免聚焦上报延迟或缺失时误改另一张画布。
      const path = typeof args.path === 'string' && args.path.trim().length > 0 ? args.path : ''
      if (!path) throw new Error('未指定画布路径：请先用 diagram_read 确认目标画布，再显式传入 path')
      // **入参是宿主深冻结的**：dsh-tools 在 execute 之前把整份 arguments 深冻结
      // （`arguments: deepFreeze(snapshotJsonValue(exec.arguments))`，见 dsh-tools 的 tool 执行器），
      // 数组和里面的 op 对象都是 non-extensible。所以这里必须**复制成一份可扩展的数组**再用：
      // traceImage 会往 ops 里插一条合成的 addNode（见下面 applyOps 里的 `ops.splice`），
      // 就地改冻结数组会抛 `Cannot add property N, object is not extensible`。
      // op 落盘语义不受影响 —— 复制出来的数组里元素仍是原来那些（本文件只读它们，从不写回）。
      const ops = Array.isArray(args.ops) ? args.ops.slice() : []
      if (ops.length === 0) throw new Error('ops must contain at least one operation')

      const sessionId = sessionIdOf(exec)
      assertCanvasPath(path)
      const pageArg = Number.isFinite(Number(args.page)) ? Number(args.page) : focusedPageFor(sessionId)
      const loaded = await loadDoc(path, sessionId, pageArg)
      const doc = loaded.doc

      // 乐观锁：`revision` 是**文件内容指纹**（见 loadDoc），把它传给 expectRevision 就能保证
      // "我读到的那一版"和"我现在要改的那一版"是同一份。
      //
      // 为什么需要：read 返回的 revision 原来在 AI 侧**没有任何用处**（409 只存在于画布保存那条
      // 路由上），于是"AI 读 → 用户在 drawio 里改 → AI 写"这条时序会把用户的改动**静默**覆盖掉。
      // 现在基线对不上就直接报错、**一个字节都不写**，让模型重读一次再改。
      const expect = typeof args.expectRevision === 'string' && args.expectRevision.length > 0 ? args.expectRevision : undefined
      if (expect !== undefined && expect !== doc.revision) {
        throw new Error(
          'revision conflict：你给的是 ' + expect + '，"' + loaded.absolute + '" 现在是 ' +
            (loaded.exists === true ? doc.revision : '(文件不存在)') +
            ' —— 别覆盖别人的改动。重新 diagram_read 一次，拿新的 revision 再改。',
        )
      }

      // 人工摆过的文档（meta.pinned）默认不再自动重排 —— 否则 AI 一改图，
      // 人手工调好的位置就被 dagre 全冲掉了。想重排必须显式指定 layout。
      const pinned = doc.meta !== null && typeof doc.meta === 'object' && doc.meta.pinned === true
```

</details>

**依据 6 · 源码核查**：[lib/index.js:4179-4216](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L4179-L4216)

布局选择、格式渲染、快照与 Host 文件写入

<details>
<summary>查看原文（38行）</summary>

```text
      if (mode === 'none') placeMissing(doc)
      else {
        const before = nodePositions(doc)
        autoLayout(doc, mode)
        const dropped = invalidateStalePoints(doc, before)
        if (dropped > 0) notes.push('~ 重排后端点位置变了，将重算 ' + dropped + ' 条自动路线')
      }
      // 写回：**在原文件上做无损写回**（只改我们拥有的单元，其余原文逐字节保留）。
      // revision 由文件内容算出来，不再是"我们自己 +1"—— 载体即真相，没有第二个计数器。
      // meta.pinned 的合并规则见下面那句注释。
      //
      // 这里曾经写的是 doc.meta = { engine, layout }，于是**第一次 AI 改图就把 pinned 擦掉了**：
      // 那一次没事（mode 已经是 'none'，人不人的位置都保住了），但从第二次起 pinned 读不到，
      // mode 回落到 'dagre-tb'，人手工摆好的版面被整张重排 —— 正是上面那个判断要防的事。
      // 教训：用整体赋值覆盖 meta 时，"没被显式处理"的字段会静默消失；新增 meta 字段时先看这里。
      const routingResult = documentRouter.update(routingBefore, doc)
      if (routingResult.unavailable !== undefined) {
        // 引擎整体不可用（最常见：从 git 装的包少了 lib/routing/vendor/*）时，写回照常进行，
        // 只是这次没有自动路线。回执里必须说清楚，否则模型会以为"改完就是没走线"。
        notes.push('~ 自动避障不可用（' + routingResult.unavailable + '）：这次保留现有折点，新画的边按直线写回')
      } else if (routingResult.failed.length) notes.push('~ 自动避障暂无可用通道：' + routingResult.failed.join(', '))
      doc.meta = Object.assign({}, doc.meta, { layout: mode }, pinned ? { pinned: true } : {})
      const rendered = renderDocText(loaded.text, doc, { page: loaded.pageIndex, format: isNativeCanvasPath(loaded.absolute) ? 'drawai' : 'drawio' })
      doc.revision = rendered.revision
      if (rendered.dropped.length > 0) notes.push('~ ' + rendered.dropped.length + ' 条边的两端都没有落点，已略过：' + rendered.dropped.join(', '))
      const policy = policyFor(sessionId)
      // 落盘前留一份"上一版"：AI 的改动**不在客户端的撤销历史里**（服务端推新版本时
      // 客户端会清空本地历史，免得一次 Ctrl+Z 把 AI 的改动悄悄顶掉），
      // 所以这边给一个一层的回退点，界面上对应「编辑 → 撤销 AI 改动」。
      if (loaded.exists === true && typeof loaded.text === 'string') {
        pushRevertSnapshot(snapshotKey(sessionId, loaded.absolute), { text: loaded.text, revision: doc.revision })
      }
      try {
        if (policy === undefined) await ctx.fs.writeText(loaded.target, rendered.text)
        else await ctx.fs.writeText(loaded.target, rendered.text, undefined, undefined, policy)
      } catch (error) {
        const scope = policy === undefined ? 'unresolved policy' : policy.mode + ' @ ' + String(policy.workspaceRoot)
        throw new Error('write "' + loaded.absolute + '" failed: ' + messageOf(error) + ' [sandbox: ' + scope + ']')
```

</details>

**依据 7 · 源码核查**：[lib/canvas-format.js:44-62](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/canvas-format.js#L44-L62)

原生文件指纹和指定页面的 JSON 序列化

<details>
<summary>查看原文（19行）</summary>

```text
export function parseCanvas(text, options = {}) {
  if (!nativeText(text)) return parseMxfile(text, options)
  const project = decode(text)
  const index = Math.max(0, Math.min(project.pages.length - 1, Math.floor(Number(options.page) || 0)))
  const page = project.pages[index]
  const doc = normalizeDocument(page.doc)
  doc.revision = contentHash(text)
  doc.meta = { ...doc.meta, pageIndex: index, pageCount: project.pages.length, pageNames: project.pages.map((item) => item.name) }
  return { doc, notes: page.notes || [], pageCount: project.pages.length, pageIndex: index,
    pageNames: project.pages.map((item) => item.name), pageId: page.id, pageIds: project.pages.map((item) => item.id) }
}

export function applyCanvas(text, doc, options = {}) {
  if (!nativeText(text)) return applyDocToMxfile(text, doc, options)
  const project = decode(text)
  const index = options.page === undefined ? 0 : Number(options.page)
  if (!Number.isInteger(index) || !project.pages[index]) throw new Error('页面不存在')
  project.pages[index].doc = stored(normalizeDocument(doc))
  return { text: encode(project), dropped: [] }
```

</details>

#### 缺口

- 未验证复杂样式和跨格式文件的可编辑保真。
  **影响**：读取结构成功不代表原编辑器能显示全部单元。
  **进一步探讨**：以含两页、定制边和标签的旧文件导入再导出，读回布局与内容。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径与同时编辑时的保护边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

工具相对路径以会话工作区解析，给定绝对路径时实际写权限取决于 Host 文件服务和解析出的策略。不能将 Web 读路由的工作区检查泛化成所有工具路径的同层前置检查。普通 apply 以非空 expectRevision 拒绝已过期内容，省略会跳过。进程内协调器对接入的写操作串行，不能覆盖外部编辑器在检查与写入之间的并发。撤销快照在写之前入栈。撤销若发现版本变化，只在后台任务节点不一致时拒绝，普通人工标签、位置等变化未被这道条件覆盖，随后可能被旧文档整份写回。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3013-3032](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L3013-L3032)

会话策略及工作区的选择

<details>
<summary>查看原文（20行）</summary>

```text
  function policyFor(sessionId) {
    try {
      const session = sessionOf(sessionId)
      return session === undefined ? ctx.sandboxPolicy.resolve() : ctx.sandboxPolicy.resolve({ session: session })
    } catch (error) {
      return undefined
    }
  }

  function workspaceRootOf(sessionId) {
    try {
      const policy = policyFor(sessionId)
      if (policy !== undefined && typeof policy.workspaceRoot === 'string' && policy.workspaceRoot.length > 0) {
        return policy.workspaceRoot
      }
      const session = sessionOf(sessionId)
      if (session === undefined) return undefined
      const header = session.header
      if (header === undefined || header === null) return undefined
      return typeof header.cwd === 'string' && header.cwd.length > 0 ? header.cwd : undefined
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3057-3074](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L3057-L3074)

目标路径及旧路径重定向范围

<details>
<summary>查看原文（18行）</summary>

```text
  async function resolveTarget(path, sessionId) {
    const root = workspaceRootOf(sessionId)
    const target = root === undefined ? await ctx.fs.resolve(path) : await ctx.fs.resolve(path, { cwd: root })
    // A retained legacy path continues to address its migrated document for tools
    // and queued tasks, including after a host restart. Never adopt an unrelated sibling.
    if (root !== undefined && typeof ctx.fs.stat === 'function' && /\.drawio$/i.test(String(path))) {
      const native = await ctx.fs.resolve(nativeCanvasPath(path), { cwd: root })
      const rootTarget = await ctx.fs.resolve(root)
      if (ctx.fs.contains(rootTarget, target) && ctx.fs.contains(rootTarget, native) && await ctx.fs.stat(native)) {
        let project
        try { project = JSON.parse(await ctx.fs.readText(native)) } catch {}
        if (project?.format === 'dsh-drawai' && project.migration?.sourcePath === absoluteHint(target, path)) {
          if (await ctx.fs.stat(target) && contentHash(await ctx.fs.readText(target)) !== project.migration.sourceHash) throw new Error('旧画布已在迁移后更改，请处理两个版本')
          return native
        }
      }
    }
    return target
```

</details>

**依据 3 · 源码核查**：[lib/index.js:5212-5219](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L5212-L5219)

Web 读路由的显式工作区检查

```text
        if (!ctx.fs.contains(rootTarget, readTarget)) {
          sendJson(res, 403, { ok: false, error: 'path escapes the workspace root: ' + absoluteHint(readTarget, rawPath) })
          return
        }
      } catch (error) {
        sendJson(res, 403, { ok: false, error: 'containment check failed: ' + messageOf(error) })
        return
      }
```

**依据 4 · 源码核查**：[lib/index.js:4011-4030](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L4011-L4030)

apply 本体的可选内容指纹检查

<details>
<summary>查看原文（20行）</summary>

```text
      const sessionId = sessionIdOf(exec)
      assertCanvasPath(path)
      const pageArg = Number.isFinite(Number(args.page)) ? Number(args.page) : focusedPageFor(sessionId)
      const loaded = await loadDoc(path, sessionId, pageArg)
      const doc = loaded.doc

      // 乐观锁：`revision` 是**文件内容指纹**（见 loadDoc），把它传给 expectRevision 就能保证
      // "我读到的那一版"和"我现在要改的那一版"是同一份。
      //
      // 为什么需要：read 返回的 revision 原来在 AI 侧**没有任何用处**（409 只存在于画布保存那条
      // 路由上），于是"AI 读 → 用户在 drawio 里改 → AI 写"这条时序会把用户的改动**静默**覆盖掉。
      // 现在基线对不上就直接报错、**一个字节都不写**，让模型重读一次再改。
      const expect = typeof args.expectRevision === 'string' && args.expectRevision.length > 0 ? args.expectRevision : undefined
      if (expect !== undefined && expect !== doc.revision) {
        throw new Error(
          'revision conflict：你给的是 ' + expect + '，"' + loaded.absolute + '" 现在是 ' +
            (loaded.exists === true ? doc.revision : '(文件不存在)') +
            ' —— 别覆盖别人的改动。重新 diagram_read 一次，拿新的 revision 再改。',
        )
      }
```

</details>

**依据 5 · 源码核查**：[lib/task-coordinator.js:6-24](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/task-coordinator.js#L6-L24)

同进程内按路径串行

<details>
<summary>查看原文（19行）</summary>

```text
export function createDocumentCoordinator() {
  const tails = new Map(), local = new AsyncLocalStorage()
  const keyOf = (path) => {
    let key = resolve(path)
    try { key = realpathSync(key) } catch {}
    return process.platform === 'win32' ? key.toLowerCase() : key
  }
  return { keyOf, async run(path, action) {
    const key = keyOf(path)
    if (local.getStore() === key) return action()
    const previous = tails.get(key) || Promise.resolve()
    let release
    const gate = new Promise((resolve) => { release = resolve })
    const tail = previous.catch(() => {}).then(() => gate)
    tails.set(key, tail)
    await previous.catch(() => {})
    try { return await local.run(key, action) }
    finally { release(); if (tails.get(key) === tail) tails.delete(key) }
  } }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:4204-4217](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L4204-L4217)

快照先于文件写入

<details>
<summary>查看原文（14行）</summary>

```text
      const policy = policyFor(sessionId)
      // 落盘前留一份"上一版"：AI 的改动**不在客户端的撤销历史里**（服务端推新版本时
      // 客户端会清空本地历史，免得一次 Ctrl+Z 把 AI 的改动悄悄顶掉），
      // 所以这边给一个一层的回退点，界面上对应「编辑 → 撤销 AI 改动」。
      if (loaded.exists === true && typeof loaded.text === 'string') {
        pushRevertSnapshot(snapshotKey(sessionId, loaded.absolute), { text: loaded.text, revision: doc.revision })
      }
      try {
        if (policy === undefined) await ctx.fs.writeText(loaded.target, rendered.text)
        else await ctx.fs.writeText(loaded.target, rendered.text, undefined, undefined, policy)
      } catch (error) {
        const scope = policy === undefined ? 'unresolved policy' : policy.mode + ' @ ' + String(policy.workspaceRoot)
        throw new Error('write "' + loaded.absolute + '" failed: ' + messageOf(error) + ' [sandbox: ' + scope + ']')
      }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:5425-5453](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L5425-L5453)

撤销的版本变化判断及整份写回

<details>
<summary>查看原文（29行）</summary>

```text
      const key = snapshotKey(sessionId, revertAbsolute)
      const stack = revertSnapshots.get(key)
      const snapshot = stack === undefined || stack.length === 0 ? undefined : stack[stack.length - 1]
      if (snapshot === undefined) {
        sendJson(res, 200, { ok: false, error: '这张画布没有可退回的 AI 改动了' })
        return
      }
      if (contentHash(revertCurrent) !== snapshot.revision) {
        const taskNodes = (text) => {
          const first = parseMxfile(text), nodes = []
          for (let page = 0; page < first.pageCount; page++) nodes.push(...parseMxfile(text, { page }).doc.nodes.filter((node) => node.data?.drawaiTaskId))
          return nodes
        }
        if (stableValue(taskNodes(revertCurrent)) !== stableValue(taskNodes(snapshot.text))) {
          sendJson(res, 409, { ok: false, error: 'AI 改动后已有后台生成或编辑的结果，请先在任务队列中撤销生成，避免整页回退丢失结果' }); return
        }
      }
      const policy = policyFor(sessionId)
      try {
        if (policy === undefined) await ctx.fs.writeText(revertTarget, snapshot.text)
        else await ctx.fs.writeText(revertTarget, snapshot.text, undefined, undefined, policy)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: 'write failed: ' + messageOf(error) })
        return
      }
      // 退一步：把这一层弹掉（界面上的「撤销 AI 改动」可以接着按，read 的 revertSteps 是剩余步数）。
      stack.pop()
      if (stack.length === 0) revertSnapshots.delete(key)
      sendJson(res, 200, { ok: true, revision: contentHash(snapshot.text), path: revertAbsolute, stepsLeft: revertDepth(key) })
```

</details>

#### 缺口

- 跨进程竞争的具体窗口和不同 Host 策略的行为尚未运行。
  **影响**：不能保证异步编辑无丢失，撤销后可能失去普通人工改动。
  **进一步探讨**：在副本用外部编辑器改标签，分别核对带旧版本的 apply 和 UI 撤销结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样小范围采用并恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Node 与相应 DSH 工具、文件、会话、沙箱和 Web 服务构成根接线。建议把验证限定到单一工作区副本。打开旧 `.drawio` 时 Web 可能迁移到同目录 `.drawai`，迁移校验源路径及指纹，源改动或目标冲突时停止。媒体可能先复制，之后才核对和写文档，两者应分别检查。显式记下文件路径、页码和指纹，发现冲突、绘图不可读或人工修改未纳入时暂停，从保留原稿恢复并用原编辑器继续。避免把插件撤销当成独立备份。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:53-78](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/package.json#L53-L78)

Node 及宿主范围

<details>
<summary>查看原文（26行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "@babel/parser": "7.28.5",
    "@babel/traverse": "7.28.5",
    "@resvg/resvg-js": "^2.6.2",
    "parse5": "7.3.0",
    "postcss": "8.5.32",
    "npm": "10.9.4"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.1 <0.1.0 || >=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-api-workspace-files"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2457-2459](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L2457-L2459)

Host 注入的服务

```text
export const name = 'drawai'
export const inject = ['tools', 'fs', 'sessions', 'sandboxPolicy', 'webServer']

```

**依据 3 · 源码核查**：[lib/index.js:5226-5252](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L5226-L5252)

Web 打开的迁移触发、阻塞及目标

<details>
<summary>查看原文（27行）</summary>

```text
        let openPath = rawPath
        let migratedTo
        if (body.autoMigrate === true && policyFor(sessionId)?.mode !== 'read-only' && /\.drawio$/i.test(rawPath)) {
          const sourceAbsolute = absoluteHint(readTarget, rawPath)
          const destination = await resolveTarget(nativeCanvasPath(rawPath), sessionId)
          const rootTarget = await ctx.fs.resolve(readRoot)
          if (!ctx.fs.contains(rootTarget, destination)) throw new Error('迁移目标超出工作区')
          const destinationAbsolute = absoluteHint(destination, nativeCanvasPath(rawPath))
          const scope = { sessionId, workspaceRoot: readRoot, path: rawPath, drawioAbs: sourceAbsolute }
          await documents.run(sourceAbsolute, () => documents.run(destinationAbsolute, async () => {
            if (existsSync(sourceAbsolute)) {
              if (!drawingTasks.canMigrateCanvas(scope, sourceAbsolute) || !videoExports.canMigrateCanvas(scope)) {
                return
              }
            }
            await migrateCanvasFile({ fs: ctx.fs, source: readTarget, destination,
              sourcePath: sourceAbsolute, destinationPath: destinationAbsolute, policy: policyFor(sessionId) })
            if (existsSync(sourceAbsolute)) {
              drawingTasks.migrateCanvas(scope, sourceAbsolute, destinationAbsolute)
              videoExports.migrateCanvas(scope, destinationAbsolute)
            }
            openPath = nativeCanvasPath(rawPath)
            migratedTo = destinationAbsolute
          }))
        }
        const loaded = await loadDoc(openPath, sessionId, body.page)
        if (body.autoMigrate && /\.drawio$/i.test(openPath)) loaded.notes.push('本次因只读模式或后台任务继续使用旧格式；任务结束后重新打开可迁移')
```

</details>

**依据 4 · 源码核查**：[lib/canvas-format.js:90-104](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/canvas-format.js#L90-L104)

媒体后续校验与文档提交的先后

<details>
<summary>查看原文（15行）</summary>

```text
/** Runs through the host filesystem service, preserving its workspace/policy checks. */
export async function migrateCanvasFile({ fs, source, destination, sourcePath, destinationPath, policy }) {
  const original = await fs.readText(source)
  if (await fs.stat(destination)) {
    const existing = await fs.readText(destination)
    const project = decode(existing)
    if (project.migration?.sourcePath !== sourcePath || project.migration.sourceHash !== contentHash(original)) throw new Error('迁移目标已存在或旧画布已更改；请先处理两个版本')
    return { text: existing, reused: true }
  }
  const text = migrateMxfile(original, sourcePath)
  if (destinationPath) copyMigrationMedia(sourcePath, destinationPath, contentHash(original))
  if (await fs.readText(source) !== original) throw new Error('迁移期间源画布已更改，请重新打开')
  if (await fs.stat(destination)) throw new Error('迁移目标已存在')
  await fs.writeText(destination, text, undefined, undefined, policy)
  return { text, reused: false }
```

</details>

**依据 5 · 作者声明**：[docs/native-canvas.md:17-28](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/docs/native-canvas.md#L17-L28)

作者的迁移和往返边界

<details>
<summary>查看原文（12行）</summary>

```text
原 `.drawio` 和原媒体目录保留。完整原 XML 存放在原生文件的 `compat.drawio` 字段中，包括未识别的单元、包装属性和页面设置；这些内容保留不代表渲染器新增了对它们的支持。兼容导出把已编辑的页面应用到原 XML 模板，继续保留未知内容。

再次打开原路径时，根据来源路径与源指纹复用已迁移文档。已有的同名非迁移文档不会被覆盖；源文件迁移后被外部编辑时，报告冲突，由用户处理两个版本。AI 工具遇到已迁移的旧路径时也会解析到新文件。

运行中、排队中或等待交付的绘制任务，以及进行中的视频导出，会推迟迁移，当前仍打开旧画布。任务结束后关闭并重新打开画布即可迁移。已加载的历史绘制/导出记录随后更新到新路径。迁移不在用户正在编辑时通过轮询触发。

媒体先在同目录临时目录完成复制，再重命名发布；拒绝媒体目录中的符号链接和不属于本次迁移的已有目标。复制或提交失败可能留下临时目录或带来源标记的媒体副本，重试不会覆盖原稿。文档与媒体属于两个文件系统对象，本阶段不提供跨进程的多文件原子事务。

## 兼容与验证

- `.drawai` 和 `.drawio` 都可以打开、保存和作为工具操作目标；不填扩展名默认 `.drawai`。
- “另存为”保留来源文档的多页结构；指定 `.drawio` 可导出已有绘图内容。创作扩展 JSON 字段不属于 drawio 格式，不能通过 drawio 往返保留。
```

</details>

#### 缺口

- 缺人工审核、格式迁移与恢复的人时。
  **影响**：多人编辑和使用复杂媒体时维护成本难以判断。
  **进一步探讨**：记录首次导入、普通改图以及冲突后恢复到独立原稿所需的时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 往返导入与修改能否保留人工编辑？

**研究主题**：新假设与验证

#### 完整回答

准备两页样图，保留原稿哈希，安排一项 AI 改标签和一项外部人工改位置。先用旧指纹尝试 apply，预期按错误处理；重新读后改标签，再外部改一个普通标签并尝试撤销，观察是否丢失改动。最后导出 `.drawio` 回原工具，比较未触碰页、节点、边和版面。只要预定义的人工修改丢失或未知样式不可接受，便不能支持无监督往返编辑。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4023-4030](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L4023-L4030)

旧指纹的触发条件

```text
      const expect = typeof args.expectRevision === 'string' && args.expectRevision.length > 0 ? args.expectRevision : undefined
      if (expect !== undefined && expect !== doc.revision) {
        throw new Error(
          'revision conflict：你给的是 ' + expect + '，"' + loaded.absolute + '" 现在是 ' +
            (loaded.exists === true ? doc.revision : '(文件不存在)') +
            ' —— 别覆盖别人的改动。重新 diagram_read 一次，拿新的 revision 再改。',
        )
      }
```

**依据 2 · 源码核查**：[lib/index.js:5432-5445](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/index.js#L5432-L5445)

撤销可能回写旧快照

<details>
<summary>查看原文（14行）</summary>

```text
      if (contentHash(revertCurrent) !== snapshot.revision) {
        const taskNodes = (text) => {
          const first = parseMxfile(text), nodes = []
          for (let page = 0; page < first.pageCount; page++) nodes.push(...parseMxfile(text, { page }).doc.nodes.filter((node) => node.data?.drawaiTaskId))
          return nodes
        }
        if (stableValue(taskNodes(revertCurrent)) !== stableValue(taskNodes(snapshot.text))) {
          sendJson(res, 409, { ok: false, error: 'AI 改动后已有后台生成或编辑的结果，请先在任务队列中撤销生成，避免整页回退丢失结果' }); return
        }
      }
      const policy = policyFor(sessionId)
      try {
        if (policy === undefined) await ctx.fs.writeText(revertTarget, snapshot.text)
        else await ctx.fs.writeText(revertTarget, snapshot.text, undefined, undefined, policy)
```

</details>

**依据 3 · 源码核查**：[lib/canvas-format.js:71-80](https://github.com/fourzkw/dsh-drawai/blob/128f86e97b053e3f3784c9acb2735c73a7b65766/lib/canvas-format.js#L71-L80)

兼容导出使用 XML 模板或单页构造

<details>
<summary>查看原文（10行）</summary>

```text
export function exportCanvasToMxfile(text) {
  if (!nativeText(text)) return text
  const project = decode(text)
  if (!project.compat?.drawio) {
    if (project.pages.length !== 1) throw new Error('缺少多页 drawio 兼容模板')
    return buildMxfile(project.pages[0].doc, { name: project.pages[0].name }).text
  }
  let xml = project.compat.drawio
  for (let page = 0; page < project.pages.length; page++) xml = applyDocToMxfile(xml, project.pages[page].doc, { page }).text
  return xml
```

</details>

#### 缺口

- 尚无带外部编辑和复杂原格式的对照。
  **影响**：可编辑性机制存在，往返保持与恢复效果仍无实测。
  **进一步探讨**：固定两页小图和一个不涉后台任务的人工标签，先比较撤销前后的文件差异。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
