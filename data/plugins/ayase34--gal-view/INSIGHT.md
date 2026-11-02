# gal-view

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d002fe0](https://github.com/Ayase34/gal-view/tree/d002fe0e7051c618a2665af3c653f9838cd6aa8a)

<!-- BEGIN META -->
[![GitHub ★ 212](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=212&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ayase34/gal-view)
<!-- END META -->

> **功能**：为DSH会话提供Galgame风格舞台、台词阅读与场景编辑，本地保存素材和进度，原对话仍需核重要信息。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 真前端插件用宿主槽和输入机复用会话，分离视觉场景/素材/进度并可导出；不是静态资源包，不把宿主会话智能算自身创新。

> **主要限制**：[Q03](#research-q03) 台词有损且隐藏工具结果，不能代替轨迹；存储失败静默、同DB版本1各建单store可使新库字体仅内存、IDB请求成功非事务提交，导入字体family直接拼CSS且JSON资源无同文件大小限制，需可信场景和备份。

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
  - [Q01 · GAL视图面向谁，真实条目类型与增量是什么？](#detail-section-11)
  - [Q02 · 会话、场景、素材与输入怎样接线？](#detail-section-12)
  - [Q03 · 信息完整性、持久化和导入可信性有什么具体限制？](#detail-section-13)
  - [Q04 · 怎样试用、备份和验证不牺牲正确性的视觉改造？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好角色化视觉阅读/展示的个人DSH用户，场景编辑不等模型能力或工具结果验收，需能回原视图。

普通DSH聊天/轨迹和手工界面装饰；增量为个性化视觉与可编辑场景，不改变原模型任务执行。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| GAL会话 | 角色视觉阅读与输入 | 走宿主输入，工具/Markdown有损须原视图 |
| 场景编辑 | 拖拽/图层/可信素材 | 非模型工具控制，未全审所有编辑交互 |
| 本地保存/历史 | 场景与素材复用 | silent内存降级，刷新回读才核 |
| 导入导出 | 便携当前引用资源 | 字体CSS/大小信任边界，不是完整库/进度备份 |
| 设置开关 | 隐藏GAL回原视图 | 不清浏览器数据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web/loader/slots/共享React | 必需 | 注册视图/宿主会话输入 | 具体版本未宿主验收 |
| localStorage/IndexedDB | 持久化需要 | 场景/素材/进度 | 失败退内存且静默，不保证刷新保留 |
| 可信图片/字体/场景 | 编辑需要 | 自定义视觉 | JSON不是惰性安全格式，未知来源不导 |
| 原对话/轨迹 | 正确性前提 | 核工具/链接/图片 | GAL不能等价替代 |
| esbuild | 开发重建需要 | 生成client.js/检查 | 缺失check可SKIP，不当已校验 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 安装重启核GAL标签/正确会话 | 保留原对话可回 |
| 小试 | 可信预设/小素材，发测试消息 | 宿主发送/错误/等待符合 |
| 备份 | 导出并刷新回读 | 不仅看界面变更，引用素材之外另保 |
| 核结果 | 链接图像工具回原轨迹 | 不按台词宣称执行成功 |
| 退出 | 关设置/卸载并明确处理浏览器数据 | 不随手清整站数据，先备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与素材/字体资源 | 安装/兼容/场景编辑与许可 | 独立收费未见，总金额未知 |
| 持续 | 解码/IDB/100快照/模型原流程 | 分页阅读/回轨迹核结果 | 性能/效率收益未测 |
| 失败恢复 | 重新导入/恢复素材和场景 | 查配额/刷新缺失/备份 | 内存降级无持久成功收据 |
| 退出 | 数据保留占浏览器空间 | 明确备份/隐私清理 | 卸载不自动清场景/进度 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 视觉阅读 | 舞台/台词/宿主会话接线 | 用户偏好/真实效率 |
| 场景编辑 | 历史/资源/导入导出 | 大场景性能与无损持久 |
| 信息呈现 | 文本/错误系统行 | 图/URL/工具完整性，需原视图 |
| 保存 | 本地存储/内存降级 | 事务提交/配额故障刷新后恢复 |

> **思考**：[Q03](#research-q03) 台词有损且隐藏工具结果，不能代替轨迹；存储失败静默、同DB版本1各建单store可使新库字体仅内存、IDB请求成功非事务提交，导入字体family直接拼CSS且JSON资源无同文件大小限制，需可信场景和备份。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 真前端插件用宿主槽和输入机复用会话，分离视觉场景/素材/进度并可导出；不是静态资源包，不把宿主会话智能算自身创新。

[Q02](#research-q02) 宿主输入机/槽位生命周期与纯转录/存储拆分可复用；[Q03](#research-q03) 持久完成应等事务、显示失败，导入字符串不能直接当CSS安全，避免把内存更新当保存。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 台词有损且隐藏工具结果，不能代替轨迹；存储失败静默、同DB版本1各建单store可使新库字体仅内存、IDB请求成功非事务提交，导入字体family直接拼CSS且JSON资源无同文件大小限制，需可信场景和备份。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 视觉偏好用户限可信预设/小自制场景试，导出并刷新核恢复，自定义字体先视为不可靠持久，保留原对话/轨迹；未知场景、存储失败或关键信息缺失停用回原视图。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定前端注册/会话映射/存储/导入导出与生成物关键代码静态核查；未运行宿主/浏览器/构建/攻击或目标测试，视觉收益与故障恢复未知。

- 已检查：作者 README、包清单、源码路径 .dsh-plugin/client.js、.dsh-plugin/client/GalView.jsx、.dsh-plugin/client/assets.mjs、.dsh-plugin/client/fonts.mjs、.dsh-plugin/client/index.mjs、.dsh-plugin/client/store.mjs、.dsh-plugin/client/transcript.mjs、.dsh-plugin/index.mjs、README.md、package.json、scripts/build-client.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根DSH插件，源码client入口/转录/存储/素材字体、GalView会话输入与生成物关键段；未全审Editor/StageView/分页算法、全部预设艺术许可与宿主实现。
- 下一步：[Q04](#research-q04) 可信副本验会话/持久与原视图保真，隔离配额/IDB/大场景与导入预检，测恢复/漏判/总成本，尚未执行。

**分析版本**

- **仓库**：[Ayase34/gal-view](https://github.com/Ayase34/gal-view)
- **版本号**：0.3.3（[固定提交 d002fe0](https://github.com/Ayase34/gal-view/tree/d002fe0e7051c618a2665af3c653f9838cd6aa8a)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证保存/导入收据与关键事件回原视图标记，参照已有导出/history/错误行，比较恢复完整性与漏判和额外负担。

[Q04](#research-q04) 可信副本验会话/持久与原视图保真，隔离配额/IDB/大场景与导入预检，测恢复/漏判/总成本，尚未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 3561 | 3430 | 188 | — |
| .mjs | source | 13 | 3530 | 2937 | 398 | — |
| .jsx | source | 4 | 1720 | 1508 | 149 | — |
| .md | source | 2 | 152 | — | — | 1195 |
| .mjs | test | 9 | 792 | 685 | 75 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Ayase34/gal-view/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Ayase34/gal-view/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Ayase34/gal-view/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：视觉会话与场景编辑如何接宿主，信息与保存边界支持怎样采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · GAL视图面向谁，真实条目类型与增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是有真实前端实现的原生DSH插件，不是仅图片资源包：package经bundle插插件，client注册conversation.view的gal标签和设置，Node half无后端行为。用户可将同一DSH会话以Galgame舞台、人物/台词、打字机/分页呈现，并在编辑模式调整布局/图层/素材。面对偏好角色对话、演示或个性化阅读的人，相对普通聊天增加表现和场景编辑；不新增模型/角色智能或游戏剧情执行器。

默认预设内嵌图片/字体，已有浏览器场景优先；没有服务端工作区、多人共享或模型工具控制场景的已审接线。合格结果是会话身份和输入正确、阅读不丢重要信息、刷新后可恢复自建场景；美观/沉浸提升属于用户偏好，不能据预设截图宣称效率或任务质量提高。严肃工具审查仍需原对话/轨迹。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-16](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/README.md#L5-L16)

作者视觉阅读/编辑/预设。

<details>
<summary>查看原文（12行）</summary>

```text
DSH Web GUI 会话页的 **Galgame 风格对话视图 + 场景元素可视化编辑器**（官方 bundle 插件格式）。

在会话标签页栏（「对话」/「轨迹」）中间加入 **「GAL视窗」** 标签，点开之后会话视窗变成
16:9 Galgame 舞台：占位立绘、大对话框、打字机台词、玩家输入；内置「编辑模式」可像场景
编辑器一样拖拽/改属性/换图层，编辑结果实时同步回游戏模式。

![image.png](image.png)


## 默认预设

仓库根 [`gal-scene.json`](gal-scene.json) 是随包分发的**默认预设场景**（编辑器导出的格式，内嵌被引用的图片/字体）：首次打开「GAL视窗」且本地没有存档场景时自动加载，编辑模式的「重置」也回到该预设。更新预设：编辑场景 → `Ctrl+S` 导出 → 用导出的 `gal-scene.json` 替换仓库根同名文件 → `npm run build:client` 并提交。
```

</details>

**依据 2 · 源码核查**：[package.json:1-31](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/package.json#L1-L31)

发布入口与bundle/client类型。

<details>
<summary>查看原文（31行）</summary>

```text
{
  "name": "gal-view",
  "version": "0.3.3",
  "private": true,
  "type": "module",
  "description": "DSH Web GUI 会话页的 GAL 视窗：Galgame 风格对话视图 + 场景元素可视化编辑器",
  "scripts": {
    "test": "node --test 'tests/*.test.mjs'",
    "build:client": "node scripts/build-client.mjs",
    "check:client": "node scripts/build-client.mjs --check",
    "smoke": "node scripts/smoke.mjs"
  },
  "main": "./.dsh-plugin/index.mjs",
  "exports": {
    ".": "./.dsh-plugin/index.mjs",
    "./client": "./.dsh-plugin/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "slots"
      ]
    }
  },
  "devDependencies": {
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/index.mjs:1-13](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/index.mjs#L1-L13)

Node half无行为。

<details>
<summary>查看原文（13行）</summary>

```text
// gal-view Node half：极简。GAL 视窗完全运行在浏览器 half——
// 场景状态、编辑历史存 localStorage，符合「完全前端运行、不需要后端」的 Demo 形态。
// 本文件只为满足官方 bundle 插件契约（name/inject/apply），不消费宿主服务。
// 契约：官方 bundle 插件的 Node half（仓库根 package.json 的 dsh.bundle + dsh.client；
// client 产物 .dsh-plugin/client.js 由 scripts/build-client.mjs 生成）。

export const name = 'gal-view'

export const inject = []

export function apply() {
  // 无宿主侧行为：client half 自行注册视图并持久化场景。
}
```

</details>

**依据 4 · 源码核查**：[.dsh-plugin/client/index.mjs:504-545](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/index.mjs#L504-L545)

实际会话和设置槽注册。

<details>
<summary>查看原文（42行）</summary>

```text
  // slots.inject 等待槽位声明，声明崩溃时随纤维一起移除标签页。
  // 响应开关：禁用时注销条目（标签页消失），启用时重新注册。
  ctx.slots.inject('conversation.view', () => {
    let dispose = null
    const sync = () => {
      if (dispose !== null) {
        dispose()
        dispose = null
      }
      if (enabledSource.getSnapshot() !== true) return
      dispose = ctx.slots.register({
        name: 'conversation.view',
        id: 'gal',
        order: 5,
        label: () => 'GAL视窗',
        store: createReadStore(),
        inject: () => ({
          hooks: { scene: sceneSource, history: historySource, assets: assetsSource, fonts: fontsSource },
          api,
        }),
      }, GalView)
    }
    sync()
    const unsubscribe = enabledSource.subscribe(sync)
    return () => {
      unsubscribe()
      if (dispose !== null) dispose()
    }
  })

  // 设置面板「插件」分区下的 GAL 视窗选项卡（启用/停用开关）。
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'gal-view',
    order: 20,
    label: () => 'GAL 视窗',
    inject: () => ({
      hooks: { enabled: enabledSource },
      setEnabled,
    }),
  }, GalViewSettingsTab))
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话、场景、素材与输入怎样接线？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

client只注入slots，经slot收到useSession/inputActions；GalView订阅nodes/partial/running/pending/promptError，输入先setDraft再submit宿主输入机，不自己调用模型网络。阅读进度按scopeKey写gal-view.read.<session>，场景却用固定gal-view:scene:v1为同浏览器站点共享；场景和启用开关localStorage，图片/字体IndexedDB，内存可观察源供React更新。

scene API修改即saveJSON，历史为最多100个完整场景快照；导入normalizeScene后提取内嵌assets/fonts，异步put并立即更新scene，导出只嵌当前元素引用的素材/字体，不含整个未用素材库或阅读进度。重置回预设并种素材；不是删除原会话或重置模型。可复用的模式是宿主会话/输入与视觉状态分开、槽位生命周期/启用注销、纯转录/分页/场景函数和可注入存储。

构建脚本将源码打成已提交client.js且React external用宿主实例，运行需DSH web槽位/loader/React与浏览器存储；根private不影响Git来源安装。build --check在esbuild缺失时可SKIP并退出0，不能把命令名或CI绿色当生成物必校验；本次未运行构建，但定向核生成物的存储/字体关键实现与源码一致。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/client/GalView.jsx:20-28](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/GalView.jsx#L20-L28)

输入走宿主管线。

```text
/** 发送玩家输入：走宿主输入机（adjudication/claim/默认 sink 同一管线）。 */
function useSend(inputActions, draft, setDraft) {
  return useCallback(() => {
    const text = draft.trim()
    if (text === '') return
    inputActions.setDraft(text)
    inputActions.submit()
    setDraft('')
  }, [draft, inputActions, setDraft])
```

**依据 2 · 源码核查**：[.dsh-plugin/client/GalView.jsx:157-189](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/GalView.jsx#L157-L189)

会话数据来源。

<details>
<summary>查看原文（33行）</summary>

```text
export function GalView({ useSession, inputActions, useScene, useHistory, useAssets, useFonts, useStore, actions, api }) {
  const scene = useScene(s => s)
  const history = useHistory(h => h)
  const assets = useAssets(a => a)
  const fonts = useFonts(f => f)
  const readState = useStore(s => s)
  const nodes = useSession(s => s.nodes)
  const partial = useSession(s => s.partial)
  const running = useSession(s => s.running)
  const blank = useSession(s => s.blank)
  const runningCalls = useSession(s => s.runningCalls)
  const pending = useSession(s => s.pending)
  const promptError = useSession(s => s.promptError)

  const [mode, setMode] = useState('game')
  const [auto, setAuto] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [type, setType] = useState(createTypeState)
  const [pages, setPages] = useState([])
  const [pageIndex, setPageIndex] = useState(0)
  const rootRef = useRef(null)
  // 阅读状态恢复/保存（标签页切换与刷新后不从头渲染）。
  const readStateRef = useRef(readState)
  readStateRef.current = readState
  const restoredKeyRef = useRef(null)
  useFillSessionArea(rootRef)

  const lines = useMemo(() => nodesToLines(nodes), [nodes])
  const liveText = running ? partialToText(partial) : ''
  const lastLine = lines.length > 0 ? lines[lines.length - 1] : null
  const aiStatus = deriveStatus({ running, partial, pending, lastLine, promptError })
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/client/index.mjs:34-75](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/index.mjs#L34-L75)

全局场景key和按scope进度。

<details>
<summary>查看原文（42行）</summary>

```text
const PERSIST_KEY = 'gal-view:scene:v1'
const ENABLED_KEY = 'gal-view:enabled'
const HISTORY_LIMIT = 100

/**
 * 每会话阅读状态（经槽位 store 声明，框架按会话调用 create(scopeKey) 实例化）：
 * 标签页切换/刷新后恢复当前行、页码与打字进度，对话不再从头渲染。
 * 手写 handle 契约（spec + create），避免引入 runtime 模块依赖。
 */
function createReadStore() {
  return {
    spec: {
      init: () => ({ lineKey: null, pageIndex: 0, shown: '', done: true, dwellSince: null, statusHold: false }),
      persist: 'gal-view.read',
      actions: {
        saveProgress: (draft, progress) => {
          draft.lineKey = progress.lineKey
          draft.pageIndex = progress.pageIndex
          draft.shown = progress.shown
          draft.done = progress.done
          draft.dwellSince = progress.dwellSince
          draft.statusHold = progress.statusHold
        },
      },
    },
    create(scopeKey) {
      const persistKey = scopeKey === undefined
        ? 'gal-view.read'
        : 'gal-view.read.' + String(scopeKey)
      let state = { lineKey: null, pageIndex: 0, shown: '', done: true, dwellSince: null, statusHold: false }
      try {
        const raw = window.localStorage.getItem(persistKey)
        if (raw !== null) {
          const parsed = JSON.parse(raw)
          if (parsed !== null && typeof parsed === 'object') state = parsed
        }
      } catch {
        // 隐私模式/坏数据：用初始状态。
      }
      const listeners = new Set()
      const persist = () => {
        try { window.localStorage.setItem(persistKey, JSON.stringify(state)) } catch { /* 忽略 */ }
```

</details>

**依据 4 · 源码核查**：[.dsh-plugin/client/index.mjs:229-278](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/index.mjs#L229-L278)

导入/重置/历史/导出。

<details>
<summary>查看原文（50行）</summary>

```text
    replaceScene(raw) {
      const next = normalizeScene(raw)
      if (next === null) return false
      const embedded = extractAssets(raw)
      if (embedded.length > 0) {
        const map = new Map(assetsSource.getSnapshot().map)
        for (const record of embedded) {
          map.set(record.id, record)
          void idb.put(record).catch(() => {})
        }
        assetsSource.update({ map })
      }
      const embeddedFonts = extractFonts(raw)
      if (embeddedFonts.length > 0) {
        const map = new Map(fontsSource.getSnapshot().map)
        for (const record of embeddedFonts) {
          map.set(record.id, record)
          void fontIdb.put(record).catch(() => {})
        }
        fontsSource.update({ map })
      }
      pushAndCommit(next)
      return true
    },

    /** 重置为默认预设场景（自带历史；预设素材同步还原进库）。 */
    resetScene() {
      seedPresetAssets()
      pushAndCommit(presetBase())
    },

    /** 撤销 / 重做（真正的 history stack）。 */
    undo() {
      const prev = history.undoStep(snapshotScene())
      if (prev === null) return
      commit(prev)
      historySource.update(history.info())
    },
    redo() {
      const next = history.redoStep(snapshotScene())
      if (next === null) return
      commit(next)
      historySource.update(history.info())
    },

    /** 导出场景 JSON：内嵌被引用的素材与字体 dataURL（组件负责 Blob 下载）。 */
    exportScene() {
      const withAssets = embedAssets(current(), assetsSource.getSnapshot().map)
      return JSON.stringify(embedFonts(withAssets, fontsSource.getSnapshot().map), null, 2)
    },
```

</details>

**依据 5 · 源码核查**：[.dsh-plugin/client/index.mjs:411-448](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/index.mjs#L411-L448)

素材/字体初始化与合并。

<details>
<summary>查看原文（38行）</summary>

```text
export function apply(ctx) {
  // 幂等守卫：重复执行（HMR/loader 重跑）不重复注入样式。
  if (document.querySelector('style[data-gal-view-style]') !== null) return

  const styleEl = document.createElement('style')
  styleEl.setAttribute('data-gal-view-style', '')
  styleEl.setAttribute('data-plugin', 'gal-view')
  styleEl.textContent = CSS
  document.head.append(styleEl)

  const storage = createStorage()
  // 素材库：IndexedDB 持久 + 内存可观察镜像（图片 dataURL 不进 localStorage）。
  const assetsSource = createObservable({ map: new Map() })
  const idb = createIdbAssets()
  void idb.getAll().then(records => {
    // 合并而非替换：预设种子素材（同步种入内存镜像）可能尚未落库，替换会丢。
    if (records.length > 0) {
      const map = new Map(assetsSource.getSnapshot().map)
      for (const record of records) map.set(record.id, record)
      assetsSource.update({ map })
    }
  }).catch(() => {})
  // 字体库：IndexedDB 持久 + @font-face 动态注册。
  const fontsSource = createObservable({ map: new Map() })
  const fontIdb = createIdbFonts()
  const fontStyleEl = document.createElement('style')
  fontStyleEl.setAttribute('data-gal-view-fonts', '')
  fontStyleEl.setAttribute('data-plugin', 'gal-view')
  document.head.append(fontStyleEl)
  const syncFontStyles = () => {
    const faces = [...fontsSource.getSnapshot().map.values()].map(buildFontFace)
    fontStyleEl.textContent = faces.join('\n')
  }
  syncFontStyles()
  fontsSource.subscribe(syncFontStyles)
  void fontIdb.getAll().then(records => {
    // 合并而非替换：预设种子字体（同步种入内存镜像）可能尚未落库，替换会丢。
    if (records.length > 0) {
```

</details>

**依据 6 · 源码核查**：[.dsh-plugin/client/store.mjs:31-58](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/store.mjs#L31-L58)

100快照栈是进程内。

<details>
<summary>查看原文（28行）</summary>

```text
/** 撤销/重做历史栈（快照为完整场景深拷贝，上限裁剪最旧）。 */
export function createHistory(limit = 100) {
  let undo = []
  let redo = []
  return {
    push(snapshot) {
      undo.push(snapshot)
      if (undo.length > limit) undo.shift()
      redo.length = 0
    },
    undoStep(current) {
      if (undo.length === 0) return null
      redo.push(current)
      return undo.pop()
    },
    redoStep(current) {
      if (redo.length === 0) return null
      undo.push(current)
      return redo.pop()
    },
    info() {
      return { undo: undo.length, redo: redo.length }
    },
    reset() {
      undo.length = 0
      redo.length = 0
    },
  }
```

</details>

**依据 7 · 源码核查**：[scripts/build-client.mjs:55-63](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/scripts/build-client.mjs#L55-L63)

无esbuild跳过。

```text
 * @param {{ check?: boolean, root?: string }} opts
 * @returns {{ ok: boolean, errors?: string[], skipped?: string }}
 */
export function generate({ check = false, root = ROOT } = {}) {
  const esbuildBin = resolveEsbuildBin()
  if (esbuildBin === null) {
    return { ok: true, skipped: 'esbuild 不可用：项目内 pnpm install 安装 devDependencies，或设置 DSH_CHECKOUT 指向 dsh checkout' }
  }
  const tmpDir = mkdtempSync(join(tmpdir(), 'gal-view-'))
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 信息完整性、持久化和导入可信性有什么具体限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

视觉转录刻意只取assistant text，reasoning/tool-call/tool-result不入台词；Markdown图片删除、链接仅留文字、代码/列表等去标记。运行状态将工具/未知归“编写代码中”、正文流式期归“思考中”，有pending显示等待，但不是工具详情/审批面板的等价替代。用户可能看不到引用URL、图像和执行结果，应回原视图核验，不能因台词顺畅当工作完成。

localStorage失败静默忽略，IndexedDB失败退内存；put先写memory，再await吞错tx，tx在request.onsuccess便resolve而非等transaction.oncomplete/abort，所以“已加素材/界面变了”不构成落盘成功收据。另有具体schema缺陷：assets和fonts默认都open同名gal-view、版本1，onupgradeneeded仅创建各自store；首次assets getAll先打开，之后fonts同版本不会升级建store，缺fonts时事务异常被吞，字体只留内存。已有同时具备两store的数据库不受此条件影响，未在浏览器复现；默认预设重种字体还可能掩盖自定义字体刷新丢失。导入场景/素材与scene不是跨存储原子提交。刷新/清站点数据可失去未持久化自建内容；README重装不丢是正常存储条件下主张，不是任何配额/隐私模式保证。

单图片文件导入有8MiB与MIME限制，但JSON embedded的normalizeAsset仅验data:image...base64前缀，无同样大小/完整性限制；字体normalizeFont接受原family，buildFontFace直接拼CSS引号字符串，apply把它放style.textContent。生成client.js也同样代码，故不可信场景可影响样式语法/资源行为，不能当安全惰性JSON；未构造攻击/运行浏览器，不扩大为已证脚本执行或网络窃取。大内嵌场景/字体还占解码、内存、导出和存储配额，范围应限可信小材料。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/client/transcript.mjs:8-38](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/transcript.mjs#L8-L38)

Markdown有损映射。

<details>
<summary>查看原文（31行）</summary>

````text
/**
 * 剥离 Markdown 语法标记（只去标记、保留正文；不触碰正常标点与数学符号）：
 * 代码围栏、图片、链接、加粗、删除线、斜体、行内代码、标题、引用、分割线、列表序号。
 */
export function stripMarkdown(text) {
  if (typeof text !== 'string') return ''
  return text
    // 代码围栏：去掉 ``` 行与语言标记，保留内部内容
    .replace(/^```[^\n]*$/gm, '')
    // 图片：![...](...) 无正文可显示，整体移除
    .replace(/!\[[^\]\n]*\]\([^)\n]*\)/g, '')
    // 链接：[文字](url) → 文字
    .replace(/\[([^\]\n]+)\]\([^)\n]*\)/g, '$1')
    // 加粗 **text** → text
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    // 删除线 ~~text~~ → text
    .replace(/~~([^~\n]+)~~/g, '$1')
    // 斜体 *text* → text（前后守卫：不吞掉 2*3、孤星号等正常字符）
    .replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\*)(?![*\w])/g, '$1$2')
    // 行内代码 `text` → text
    .replace(/`([^`\n]+)`/g, '$1')
    // 标题：# / ## / … → 去掉井号
    .replace(/^#{1,6}[ \t]+/gm, '')
    // 引用：行首 > → 去掉
    .replace(/^>[ \t]?/gm, '')
    // 分割线：--- / *** / ___ → 去掉
    .replace(/^[ \t]*(?:-{3,}|\*{3,}|_{3,})[ \t]*$/gm, '')
    // 无序列表标记：行首 - / * / + → 去掉
    .replace(/^[-*+][ \t]+/gm, '')
    // 有序列表标记：行首 1. / 2. → 去掉
    .replace(/^\d+\.[ \t]+/gm, '')
````

</details>

**依据 2 · 源码核查**：[.dsh-plugin/client/transcript.mjs:70-81](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/transcript.mjs#L70-L81)

助手只text。

<details>
<summary>查看原文（12行）</summary>

```text
export function assistantToText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return cleanDialogueText(blocks
    .map(block => {
      if (block === null || typeof block !== 'object') return ''
      if (block.kind === 'text' && typeof block.text === 'string') return block.text
      return ''
    })
    .filter(text => text !== '')
    .join('\n'))
}

```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/client/transcript.mjs:108-125](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/transcript.mjs#L108-L125)

粗粒度状态语义。

<details>
<summary>查看原文（18行）</summary>

```text
 * 完整状态推导（归类所有会话状态）：
 * - 非运行：最后一行是错误（turn-error）→ '出错'；发送失败（promptError op=send）→ '发送失败'。
 * - 运行中：有待回应（批准/提问）→ '等待回应'；正在生成正文 → '思考中'（流式期间不渲染正文，
 *   定稿后才渲染）；思考 → '思考中'；其余（工具调用/工具执行/未知/空）统一 → '编写代码中'（不再附注工具名）。
 */
export function deriveStatus({ running, partial, pending = [], lastLine = null, promptError = null }) {
  if (!running) {
    if (lastLine !== null && lastLine.error === true) return '出错'
    if (promptError !== null && typeof promptError === 'object' && promptError.op === 'send') return '发送失败'
    return null
  }
  if (Array.isArray(pending) && pending.length > 0) return '等待回应'
  const hasText = partial !== null && typeof partial === 'object' && Array.isArray(partial.blocks)
    && partial.blocks.some(b => b !== null && typeof b === 'object' && b.kind === 'text' && (b.text ?? '') !== '')
  // 生成正文期间状态页显示「思考中」（流式不渲染正文，定稿后才渲染回复）。
  if (hasText) return '思考中'
  // 工具调用与工具执行合并为一个状态（不再附注工具名）。
  return partialStatus(partial) ?? '编写代码中'
```

</details>

**依据 4 · 源码核查**：[.dsh-plugin/client/transcript.mjs:159-173](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/transcript.mjs#L159-L173)

错误保留但tool-result跳过。

<details>
<summary>查看原文（15行）</summary>

```text
    case 'turn-error': {
      return { key, kind: 'system', text: '[错误] ' + String(node.message ?? '回合失败'), error: true }
    }
    case 'model-retry': {
      return { key, kind: 'system', text: '[等待模型重试]' }
    }
    case 'turn-max-tokens': {
      return { key, kind: 'system', text: '[已达到输出上限]' }
    }
    case 'unknown': {
      return { key, kind: 'system', text: '[未知事件 ' + String(node.type ?? '') + ']' }
    }
    default:
      // tool-result 等：不进台词。
      return null
```

</details>

**依据 5 · 源码核查**：[.dsh-plugin/client/store.mjs:61-92](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/store.mjs#L61-L92)

localStorage失败静默。

<details>
<summary>查看原文（32行）</summary>

```text
/** localStorage 包装：隐私模式/配额异常返回 null（无持久化，功能照常）。 */
export function createStorage() {
  try {
    const key = '__gal-view-probe__'
    window.localStorage.setItem(key, '1')
    window.localStorage.removeItem(key)
    return window.localStorage
  } catch {
    return null
  }
}

/** 读取持久化 JSON；任何失败返回 null。 */
export function loadJSON(storage, key) {
  if (storage === null) return null
  try {
    const raw = storage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** 写入持久化 JSON；失败静默（场景仅本次会话内有效）。 */
export function saveJSON(storage, key, value) {
  if (storage === null) return
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // 配额/隐私模式：忽略。
  }
```

</details>

**依据 6 · 源码核查**：[.dsh-plugin/client/store.mjs:99-145](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/store.mjs#L99-L145)

同DB版本1各建单store、request成功与吞错/内存。

<details>
<summary>查看原文（47行）</summary>

```text
export function createIdbStore(dbName, storeName) {
  const memory = new Map()
  let openPromise = null

  const open = () => {
    if (typeof indexedDB === 'undefined') return Promise.reject(new Error('indexedDB 不可用'))
    if (openPromise === null) {
      openPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, 1)
        req.onupgradeneeded = () => {
          const db = req.result
          if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: 'id' })
        }
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error ?? new Error('indexedDB 打开失败'))
      })
    }
    return openPromise
  }

  /** 单次事务；不可用/失败返回 undefined（调用方降级到内存镜像）。 */
  const tx = async (mode, fn) => {
    try {
      const db = await open()
      return await new Promise((resolve, reject) => {
        const t = db.transaction(storeName, mode)
        const req = fn(t.objectStore(storeName))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error ?? new Error('indexedDB 操作失败'))
      })
    } catch {
      return undefined
    }
  }

  return {
    async getAll() {
      const rows = await tx('readonly', store => store.getAll())
      return Array.isArray(rows) && rows.length > 0 ? rows : [...memory.values()]
    },
    async put(record) {
      memory.set(record.id, record)
      await tx('readwrite', store => store.put(record))
    },
    async remove(id) {
      memory.delete(id)
      await tx('readwrite', store => store.delete(id))
```

</details>

**依据 7 · 源码核查**：[.dsh-plugin/client/assets.mjs:71-74](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/assets.mjs#L71-L74)

assets默认DB同名。

```text
/** IndexedDB 驱动：内存镜像 + 异步落库；indexedDB 不可用时退化为纯内存（不持久）。 */
export function createIdbAssets(dbName = 'gal-view') {
  return createIdbStore(dbName, 'assets')
}
```

**依据 8 · 源码核查**：[.dsh-plugin/client/fonts.mjs:89-92](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/fonts.mjs#L89-L92)

fonts默认同名DB与版本1冲突。

```text
/** IndexedDB 字体库驱动（store 'fonts'；内存镜像 + 异步落库，不可用时纯内存）。 */
export function createIdbFonts(dbName = 'gal-view') {
  return createIdbStore(dbName, 'fonts')
}
```

**依据 9 · 源码核查**：[.dsh-plugin/client/assets.mjs:8-27](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/assets.mjs#L8-L27)

JSON记录归一化未同大小检查。

<details>
<summary>查看原文（20行）</summary>

```text
/** 接受的图片类型（文件 import 校验 + dataURL 校验共用）。 */
export const ASSET_MIME = /^image\/(png|jpe?g|webp|gif)$/i

/** 单张素材大小上限（dataURL 内存/JSON 内嵌开销考虑）。 */
export const MAX_ASSET_BYTES = 8 * 1024 * 1024

/** 归一化素材记录；非法（非对象/非图片 dataURL）返回 null。 */
export function normalizeAsset(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null
  const dataUrl = typeof raw.dataUrl === 'string' ? raw.dataUrl : ''
  if (!/^data:image\/[a-z0-9.+-]+;base64,/i.test(dataUrl)) return null
  return {
    id: typeof raw.id === 'string' && raw.id !== '' ? raw.id : makeId('asset'),
    name: typeof raw.name === 'string' && raw.name !== '' ? raw.name : '素材',
    mime: typeof raw.mime === 'string' ? raw.mime : 'image/png',
    dataUrl,
    width: typeof raw.width === 'number' && Number.isFinite(raw.width) ? raw.width : 0,
    height: typeof raw.height === 'number' && Number.isFinite(raw.height) ? raw.height : 0,
    createdAt: typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : 0,
  }
```

</details>

**依据 10 · 源码核查**：[.dsh-plugin/client/fonts.mjs:47-65](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/fonts.mjs#L47-L65)

未转义family及CSS拼接。

<details>
<summary>查看原文（19行）</summary>

```text
export function normalizeFont(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null
  const dataUrl = typeof raw.dataUrl === 'string' ? raw.dataUrl : ''
  if (!/^data:[^;]+;base64,/i.test(dataUrl)) return null
  const family = typeof raw.family === 'string' && raw.family !== '' ? raw.family : fontFamilyFromName(raw.name)
  const format = FONT_FORMATS[raw.format] ?? 'truetype'
  return {
    id: typeof raw.id === 'string' && raw.id !== '' ? raw.id : makeId('font'),
    name: typeof raw.name === 'string' && raw.name !== '' ? raw.name : '字体',
    family,
    format,
    dataUrl,
    createdAt: typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : 0,
  }
}

/** 生成 @font-face 规则。 */
export function buildFontFace(record) {
  return '@font-face { font-family: "' + record.family + '"; src: url("' + record.dataUrl + '") format("' + record.format + '"); }'
```

</details>

**依据 11 · 源码核查**：[.dsh-plugin/client/index.mjs:437-448](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/index.mjs#L437-L448)

生成CSS置style。

<details>
<summary>查看原文（12行）</summary>

```text
  fontStyleEl.setAttribute('data-gal-view-fonts', '')
  fontStyleEl.setAttribute('data-plugin', 'gal-view')
  document.head.append(fontStyleEl)
  const syncFontStyles = () => {
    const faces = [...fontsSource.getSnapshot().map.values()].map(buildFontFace)
    fontStyleEl.textContent = faces.join('\n')
  }
  syncFontStyles()
  fontsSource.subscribe(syncFontStyles)
  void fontIdb.getAll().then(records => {
    // 合并而非替换：预设种子字体（同步种入内存镜像）可能尚未落库，替换会丢。
    if (records.length > 0) {
```

</details>

**依据 12 · 源码核查**：[.dsh-plugin/client.js:1828-1845](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client.js#L1828-L1845)

生成物字体同样实现。

<details>
<summary>查看原文（18行）</summary>

```text
function normalizeFont(raw) {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const dataUrl = typeof raw.dataUrl === "string" ? raw.dataUrl : "";
  if (!/^data:[^;]+;base64,/i.test(dataUrl)) return null;
  const family = typeof raw.family === "string" && raw.family !== "" ? raw.family : fontFamilyFromName(raw.name);
  const format = FONT_FORMATS[raw.format] ?? "truetype";
  return {
    id: typeof raw.id === "string" && raw.id !== "" ? raw.id : makeId("font"),
    name: typeof raw.name === "string" && raw.name !== "" ? raw.name : "\u5B57\u4F53",
    family,
    format,
    dataUrl,
    createdAt: typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt) ? raw.createdAt : 0
  };
}
function buildFontFace(record) {
  return '@font-face { font-family: "' + record.family + '"; src: url("' + record.dataUrl + '") format("' + record.format + '"); }';
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用、备份和验证不牺牲正确性的视觉改造？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

偏好视觉角色阅读的个人DSH用户可限可信预设/自制小素材试，先确认版本槽位、发送到正确会话、错误/等待状态及切回原对话。先导出场景备份并刷新回读，勿仅凭“导入成功/素材出现”认已存；导出只含引用素材，未用库和阅读进度另处理。未知来源场景尤其自定义字体不导入，配额/隐私模式或重要信息缺失时回原视图。

首次有安装重启、场景编辑/素材授权和兼容核验；持续有浏览器解码/IDB/localStorage、100全快照内存、打字分页与模型原会话成本，未见插件独立服务收费不等零总成本。失败可能导出/恢复原素材、重新配置或丢阅读进度，清站点数据会影响本插件以外同站资料，不能当随手退出步骤。禁用设置可撤GAL标签、保留原会话；卸载不清浏览器数据，隐私清除与备份由用户明确执行。

未验证方向是明确“内存可用/已持久化/失败待备份”的保存收据及导入预检，与可回原轨迹的关键事件标记组合；不是重新增加已有export/history/错误行。对照满配额、IDB中断、恶构字体/大JSON和含图/链接/工具失败的会话，测刷新恢复完整率、重要事件漏判与编辑/阅读时间。若回原视图已足够、收据漂移或额外操作抵消收益则不扩展，当前未实验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-56](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/README.md#L49-L56)

卸载和浏览器数据作者说明。

````text
### 卸载

```sh
dsh plugin --profile web remove gal-view
# 卸载后同样要重启 web
```

> 说明：场景布局、素材图片、字体与阅读进度都保存在你的**浏览器**里（localStorage / IndexedDB），重装或卸载插件不会丢失；清除浏览器站点数据才会重置它们。
````

**依据 2 · 源码核查**：[.dsh-plugin/client/index.mjs:494-532](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/index.mjs#L494-L532)

设置开关和槽位移除。

<details>
<summary>查看原文（39行）</summary>

```text
  // 插件开关：设置选项卡控制会话页「GAL视窗」标签的显隐。
  const enabledSource = createObservable(loadJSON(storage, ENABLED_KEY) !== false)
  const setEnabled = value => {
    enabledSource.update(value === true)
    saveJSON(storage, ENABLED_KEY, value === true)
  }

  ctx.effect(() => () => { styleEl.remove(); fontStyleEl.remove() }, 'gal-view: styles')

  // 注册 conversation.view 列表条目：order 5 落在「对话」(0) 与「轨迹」(10) 之间。
  // slots.inject 等待槽位声明，声明崩溃时随纤维一起移除标签页。
  // 响应开关：禁用时注销条目（标签页消失），启用时重新注册。
  ctx.slots.inject('conversation.view', () => {
    let dispose = null
    const sync = () => {
      if (dispose !== null) {
        dispose()
        dispose = null
      }
      if (enabledSource.getSnapshot() !== true) return
      dispose = ctx.slots.register({
        name: 'conversation.view',
        id: 'gal',
        order: 5,
        label: () => 'GAL视窗',
        store: createReadStore(),
        inject: () => ({
          hooks: { scene: sceneSource, history: historySource, assets: assetsSource, fonts: fontsSource },
          api,
        }),
      }, GalView)
    }
    sync()
    const unsubscribe = enabledSource.subscribe(sync)
    return () => {
      unsubscribe()
      if (dispose !== null) dispose()
    }
  })
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/client/store.mjs:119-145](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/store.mjs#L119-L145)

保存收据假设来源。

<details>
<summary>查看原文（27行）</summary>

```text
  /** 单次事务；不可用/失败返回 undefined（调用方降级到内存镜像）。 */
  const tx = async (mode, fn) => {
    try {
      const db = await open()
      return await new Promise((resolve, reject) => {
        const t = db.transaction(storeName, mode)
        const req = fn(t.objectStore(storeName))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error ?? new Error('indexedDB 操作失败'))
      })
    } catch {
      return undefined
    }
  }

  return {
    async getAll() {
      const rows = await tx('readonly', store => store.getAll())
      return Array.isArray(rows) && rows.length > 0 ? rows : [...memory.values()]
    },
    async put(record) {
      memory.set(record.id, record)
      await tx('readwrite', store => store.put(record))
    },
    async remove(id) {
      memory.delete(id)
      await tx('readwrite', store => store.delete(id))
```

</details>

**依据 4 · 源码核查**：[.dsh-plugin/client/index.mjs:275-278](https://github.com/Ayase34/gal-view/blob/d002fe0e7051c618a2665af3c653f9838cd6aa8a/.dsh-plugin/client/index.mjs#L275-L278)

已有导出不重复计新贡献。

```text
    exportScene() {
      const withAssets = embedAssets(current(), assetsSource.getSnapshot().map)
      return JSON.stringify(embedFonts(withAssets, fontsSource.getSnapshot().map), null, 2)
    },
```

#### 缺口

- 无真实DSH loader/会话发送/浏览器刷新与配额/大场景验收，也无阅读收益对照
  **影响**：不能持续采用、保证持久化或称沉浸提高效率
  **进一步探讨**：可信副本验发送/恢复/信息保真，再隔离故障与原视图比较漏判/操作负担，未授权不执行攻击/目标。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
