# dsh-ui-enhancer

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[87f17fe](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/tree/87f17fe74076570023e01e5d0fc55c21affd2c23)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer) [![npm 30d 1,212](https://img.shields.io/static/v1?label=npm+30d&message=1%2C212&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-enhancer) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ui-enhancer)
<!-- END META -->

> **实现功能**：组合右侧文件预览、@文件引用、本地壁纸和活动宠物，增强DSH web桌面体验。

> **核心亮点**：保留官方槽位并组合上游右栏、受根限制文件引用与本地个性化，贡献在统一体验而非全部预览自实现。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：文件路由有loopback检查，独立活动GET却直接输出全局会话片段，未见同类检查/读者过滤；实际外层认证未知。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 适用什么场景，各能力由谁实现？](#detail-section-11)
  - [Q02 · 核心亮点和最关键权限缺口是什么？](#detail-section-12)
  - [Q03 · 启动、持久化和退出依赖什么？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复的成本和效果怎么量？](#detail-section-14)
  - [Q05 · 工程上可复用什么，活动最小化假设怎么验证？](#detail-section-15)
  - [Q06 · 当前推荐范围及停止条件是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在DSH web频繁查看/引用工作区文件并需要个性化布局的读者。

原生DSH界面加独立文件预览/个性化扩展可替代；组合减少入口切换，也增加依赖和跨会话数据面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 右侧工作区 | 文件树/多格式预览 | 上游依赖，未全面审计 |
| @文件 | 搜索并结构化引用 | 已注册根、有界搜索 |
| 壁纸/形象 | 本地个性化 | 浏览器数据需单独清理，URL另有网络 |
| 活动宠物 | 阶段/工具/回复片段 | 全局投影授权边界待核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH rc.6、Cordis4.0.1、React18及Node版本 | 主流程必需 | 官方slot、输入触发、工作区及Host API | 不匹配可能局部UI失效 |
| aionui-panel/settings桥0.1.20 | 默认组合必需 | 右侧工作区和配置兼容 | 非本插件自实现，需另审计 |
| workspaceRegistry/webServer | 文件/活动桥必需 | 注册根目录、预览和活动投影 | 无根目录不能搜索文件 |
| IndexedDB/localStorage及图像处理能力 | 个性化持久化必需 | 本地图像、偏好和形象 | 配额/禁用或清站点会影响恢复 |
| 远程图片网络 | 选用URL壁纸时 | 浏览器显示图片 | 本地上传与远程URL隐私边界不同 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者核对版本、依赖与Host活动路由保护 | 不从文件API推断全部路由受限 |
| 加载 | 安装web profile并重启刷新 | 槽位、右栏、个性化和输入触发接线 |
| 使用 | 读者选择本地图像或URL并搜索文件 | 引用来自预期工作区，图像/活动数据范围明确 |
| 退出 | 停用包并分别清理组合配置与浏览器数据 | 清除图像/偏好需用户主动处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装两个组合依赖与UI资源，金额未知 | 版本/槽位冲突核对、图像设置 | 不强制模型调用 |
| 持续使用 | 文件搜索/预览、图像解码与IndexedDB、活动轮询 | 管理图片/偏好及预览误差 | URL壁纸会有网络请求，实际内存/流畅度未测 |
| 失败恢复 | 缓存/图像重导入、依赖回退与配置修复 | 区分插件自实现与右栏上游故障 | 清站点数据可能失去偏好/形象库 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件引用便利 | 注册根目录搜索与结构化输入入口 | 同任务查找/引用时间及正确率 |
| 个性化体验 | 本地图像、壁纸与独立宠物实现链 | 易用性、无障碍及长期干扰程度 |
| 活动可见性 | 聚合会话阶段、工具与回复片段 | 跨会话可见是否符合部署权限 |

> **思考**：文件路由有loopback检查，独立活动GET却直接输出全局会话片段，未见同类检查/读者过滤；实际外层认证未知。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：保留官方槽位并组合上游右栏、受根限制文件引用与本地个性化，贡献在统一体验而非全部预览自实现。详见[Q01](#research-q01)与[Q02](#research-q02)。

保留官方槽位并组合上游右栏、受根限制文件引用与本地个性化，贡献在统一体验而非全部预览自实现。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是协议层与Host/Client分离，registered-root加realpath的多层路径检查，有界搜索/读取、raw的Range及CSP，以及effect清理UI和Host订阅。PET事件投影不持久化整段日志，显示片段也有实用性，但全局聚合仍要有权限边界；信息少不等信息无敏感性。

<a id="detail-section-5"></a>

### 1.4 主要限制

文件路由有loopback检查，独立活动GET却直接输出全局会话片段，未见同类检查/读者过滤；实际外层认证未知。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，优先核对活动路由授权与上游预览，明确边界后再评估个人本地小范围试用。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持上游右栏组合、文件桥与会话活动展示；文件路由的路径检查不能推广到pet活动接口，后者详情投影未见等效授权过滤。按读者授权的最小活动投影尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/index.ts、src/client/index.ts、src/host/routes.ts、src/host/pet-activity.ts、src/host/workspace-files.ts、package.json、src/client/wallpaper.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定本包Host文件/活动、Client入口和壁纸持久路径；未全面审计上游右栏、图像算法和全部UI，不启动宿主/浏览器。
- 下一步：进一步探讨可从双用户/会话假敏感片段、相同工作区引用任务与图像清理夹具入手，核对授权、准确率与留存。

**分析版本**

- **仓库**：[AlexYin-Tongji/dsh-ui-enhancer](https://github.com/AlexYin-Tongji/dsh-ui-enhancer)
- **版本号**：0.2.0（[固定提交 87f17fe](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/tree/87f17fe74076570023e01e5d0fc55c21affd2c23)）
- **版本日期**：2026-08-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨按读者授权的最小活动投影，默认只给phase/时间，详情显式选择并统一Host授权；会增加权限适配与总览成本，未验证。详见[Q05](#research-q05)。

进一步探讨可从双用户/会话假敏感片段、相同工作区引用任务与图像清理夹具入手，核对授权、准确率与留存。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 149 | — | — | 1755 |
| .ts | source | 17 | 3909 | 3430 | 160 | — |
| .tsx | source | 3 | 1430 | 1351 | 6 | — |
| .ts | test | 10 | 1068 | 946 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/issues?q=is%3Aissue+created%3A2026-09-22T05%3A25%3A53.691Z..2026-10-22T05%3A25%3A53.691Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A25%3A53.691Z..2026-10-22T05%3A25%3A53.691Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核查桌面体验组合、文件与跨会话活动数据边界及采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适用什么场景，各能力由谁实现？

**研究主题：**场景与需求、功能与机制

#### 完整回答

适合常在DSH web处理工作区文件并偏好桌面式布局/个性化的人。输入是已注册工作区、官方会话事件与读者图像/偏好，输出是右侧预览、@文件引用、壁纸和活动宠物。合格结果应保持原会话操作、引用正确文件且不扩大非预期数据可见范围，不能只以界面更丰富作成功依据。

patch组合社区aionui-panel与settings桥，所以文件树/Git与多格式预览主要来自上游依赖。插件Host自行提供受注册根限制的文件API与独立活动投影；Client通过官方settings/input触发注册，并用effect挂载/卸载宠物。壁纸与形象的本地持久化属于本包，不能把组合依赖全部能力计成原创。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-19](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/README.md#L9-L19)

作者功能与依赖归属说明。

<details>
<summary>查看原文（11行）</summary>

```text

- 左侧栏沿用官方会话栏，保留新会话、搜索、工作区分组、历史会话、收起和设置，并增加更接近桌面客户端的视觉处理。
- 右侧工作区使用 `@linxin666/dsh-client-ui-aionui-panel`，支持可缩放文件树、Git 变更，以及 Markdown、代码与 Diff、CSV、PDF、图片、HTML 和 URL 浏览器预览。
- 壁纸支持本地图片和 URL、填充方式、位置、模糊、遮罩、界面透明度，以及基于图片亮度的自适应文字和边框颜色。
- 桌面宠物由本插件渲染，可命名、拖动、隐藏/召唤、缩放、查看会话状态、互动和投喂；可在独立的“宠物”一级设置页上传 PNG、JPEG、WebP、GIF 或 AVIF 作为形象。上传的形象按名字保存在浏览器的形象库中（最多 12 个），可随时切换、重命名或删除，保存后即可删除磁盘上的原始照片；旧版本已上传的单张形象会自动迁移进形象库。上传的不透明图片会在浏览器本地自动提取主体（去背景），并以无圆框的透明形象显示。开始对话、完成任务和前台使用时长会获得星星，星星可兑换食物并提升亲密度。
- 点击宠物会触发它的主动搭话（如“你在干什么呢？”“好饿啊……”），以气泡形式短暂展示。宠物下方的活动详情面板展示各会话的标题、状态、最近工具调用与回复片段，与顶部状态气泡不同质化，并可一键隐藏（偏好随浏览器持久化）。
- 在输入框键入 `@` 可搜索当前会话工作区中的文件，并插入结构化文件引用。
- 运行时样式桥修复 `dsh-client-ui-aionui-panel` 文件栏中“最大化/还原”按钮与“折叠”按钮重叠、误触的问题。

右侧工作区和设置兼容桥由本包的 bundle patch 自动组合。宠物形象、状态、奖励和 Host 会话活动投影均由本插件独立实现，不会加载社区宠物的浏览器界面、旧设置或角色数据；用户仍可单独安装其他宠物插件。

```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-7](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/cordis.patch.yml#L1-L7)

组合两个上游模块和自身。

```text
- insert:
    - id: ui-enhancer-web-ui-settings
      name: '@linxin666/dsh-client-ui-web-ui-settings'
    - id: ui-enhancer-aionui-panel
      name: '@linxin666/dsh-client-ui-aionui-panel'
    - id: ui-enhancer
      name: dsh-ui-enhancer
```

**依据 3 · 源码核查**：[src/index.ts:9-22](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/index.ts#L9-L22)

Host桥注入与effect。

<details>
<summary>查看原文（14行）</summary>

```text
/** Host services needed by the file bridge and the companion activity route. */
export const inject = ['webServer', 'workspaceRegistry']

export function apply(ctx: Context): void {
  ctx.effect(
    () => registerPetActivity(ctx),
    'ui-enhancer: pet activity route',
  )

  const files = new WorkspaceFiles(ctx.workspaceRegistry)
  ctx.effect(
    () => registerUiEnhancerRoutes(ctx, files),
    'ui-enhancer: host file preview routes',
  )
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:38-72](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/client/index.ts#L38-L72)

设置、宠物挂载与文件触发。

<details>
<summary>查看原文（35行）</summary>

```text

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register('ui-enhancer', dictionaries), 'ui-enhancer: dictionaries')

  ctx.effect(() => installPanelInterop(), 'ui-enhancer: aionui panel interop')

  const wallpaper = new WallpaperController()
  ctx.effect(() => () => wallpaper.dispose(), 'ui-enhancer: wallpaper')

  const petAppearance = new PetAppearanceController()
  ctx.effect(() => () => petAppearance.dispose(), 'ui-enhancer: pet appearance')

  // rc.6 can expose a second runtime package identity through dependency
  // peers. The browser service still implements this exact public face.
  const pet = new PetController(ctx.sessions as unknown as ConstructorParameters<typeof PetController>[0])
  ctx.effect(() => () => pet.dispose(), 'ui-enhancer: pet controller')

  // The local rc.6 dependency graph may contain a second ui-slots identity
  // through runtime peers. This narrow adapter describes only the official
  // settings.section surface used here and has no effect on runtime dispatch.
  const settingsSlots = ctx.slots as unknown as SettingsSectionSlots
  const t = ctx.locale.bind('ui-enhancer')
  settingsSlots.inject('settings.section', () => {
    const disposePersonalization = settingsSlots.register({
      name: 'settings.section',
      id: 'ui-enhancer-personalization',
      order: 35,
      label: () => t('settings.title'),
      locale: 'ui-enhancer',
      inject: () => ({
        wallpaper,
        getCapabilities: () => ({
          panel: document.querySelector('[data-aionui-explorer-col], [data-aionui-preview-col]') !== null,
          pet: true,
        }),
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 核心亮点和最关键权限缺口是什么？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

亮点是保留官方槽位/会话基础，把成熟右栏、受根目录限制的文件引用、本地个性化与事件投影组合成统一体验；图像去背景与宠物奖励属于应用交互，未有证据说明比其他实现带来更高任务完成率。

最重要限制是不能将README的loopback声明推广到全部API。文件JSON和raw路由确实检查remoteAddress；独立pet-activity路由只检查GET就返回tracker.snapshot，没有同样的loopback、同源或调用会话限制。snapshot含所有未settled顶层session的ID、阶段、最近工具参数片段/回复文本，且不是按当前读者授权会话筛选。实际外部可达还依赖宿主外层认证与绑定，不能直接声称已发生泄露。

文件读取同时做词法与realpath边界、拒绝.git，优于仅字符串前缀；但注册工作区是全Host列表，不是用户身份授权。检查和实际open/stream分开，不能承诺面对恶意并发路径替换的OS级隔离。组合依赖预览HTML/URL等未在本轮全面审计，本包raw CSP保护不能替它们作安全背书。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/routes.ts:98-107](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/routes.ts#L98-L107)

文件JSON API loopback。

<details>
<summary>查看原文（10行）</summary>

```text
  const api = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!isLoopbackAddress(req.socket.remoteAddress)) {
      fail(res, 'bad-request', 'Loopback requests only', 403)
      return
    }
    if (req.method !== 'POST') {
      res.writeHead(405, { allow: 'POST' })
      res.end()
      return
    }
```

</details>

**依据 2 · 源码核查**：[src/host/routes.ts:148-156](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/routes.ts#L148-L156)

raw同类限制。

```text
  const raw = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!isLoopbackAddress(req.socket.remoteAddress)) {
      fail(res, 'bad-request', 'Loopback requests only', 403)
      return
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { allow: 'GET, HEAD' })
      res.end()
      return
```

**依据 3 · 源码核查**：[src/host/pet-activity.ts:243-261](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/pet-activity.ts#L243-L261)

活动GET返回全局投影无同类校验。

<details>
<summary>查看原文（19行）</summary>

```text
/** Mount the event projection and its plugin-owned, read-only browser route. */
export function registerPetActivity(ctx: Context): () => void {
  const tracker = new PetActivityTracker()
  const route: WebRoute = {
    kind: 'exact',
    path: PET_ACTIVITY_API_PATH,
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (req.method !== 'GET') {
        res.writeHead(405, { allow: 'GET' })
        res.end()
        return
      }
      respondJson(res, tracker.snapshot())
    },
  }
  const disposers = [
    ctx.on('session/event', (session, event) => tracker.accept(session, event)),
    ctx.on('session/disposed', (session) => tracker.forget(session)),
    ctx.webServer.register(route),
```

</details>

**依据 4 · 源码核查**：[src/host/pet-activity.ts:166-179](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/pet-activity.ts#L166-L179)

顶层会话活动数组未按调用者筛选。

<details>
<summary>查看原文（14行）</summary>

```text
  snapshot(nowMs = Date.now()): PetActivityView {
    const current = [...this.activity.values()]
      .reverse()
      .filter((entry) => !isSettled(entry, nowMs))
    const display = current[0]
    const sessions = current
      .filter((entry) => entry.topLevel && entry.bubble !== '')
      .slice(0, PET_ACTIVITY_SESSION_LIMIT)
      .map(({ sessionId, phase, bubble, detail, updatedAt }) => ({ sessionId, phase, bubble, detail, updatedAt }))
    return {
      phase: display?.phase ?? 'idle',
      bubble: display?.bubble ?? '',
      sessions,
      completedEventIds: [...this.completedEventIds],
```

</details>

**依据 5 · 源码核查**：[src/host/pet-activity.ts:91-111](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/pet-activity.ts#L91-L111)

回复文本及工具参数进入detail。

<details>
<summary>查看原文（21行）</summary>

```text
      case 'assistant/chunk': {
        if (event.data.chunk.type === 'reasoning-delta' && event.data.chunk.text.length > 0) {
          this.commit(this.activityOf(session, nowMs), 'thinking', '正在思考', nowMs)
        } else if (event.data.chunk.type === 'text-delta' && event.data.chunk.text.length > 0) {
          const activity = this.activityOf(session, nowMs)
          // A tool line followed by prose starts a fresh run of text detail.
          const previous = activity.detail.startsWith('调用 ') ? '' : activity.detail
          activity.detail = appendDetail(previous, event.data.chunk.text)
          this.commit(activity, 'review', '整理回复中', nowMs)
        }
        break
      }
      case 'assistant/message':
        this.commit(this.activityOf(session, nowMs), 'review', '整理回复中', nowMs)
        break
      case 'tool/call': {
        const activity = this.activityOf(session, nowMs)
        activity.activeTools.add(String(event.data.callId))
        activity.detail = toolDetail(event.data.name, event.data.arguments)
        this.commit(activity, 'tool', `正在使用 ${compactToolName(event.data.name)}`, nowMs)
        break
```

</details>

**依据 6 · 源码核查**：[src/host/workspace-files.ts:287-315](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/workspace-files.ts#L287-L315)

注册根与realpath边界。

<details>
<summary>查看原文（29行）</summary>

```text
  private async requireWorkspace(requestedRoot: string): Promise<FileResult<string>> {
    if (requestedRoot === '') return error('workspace-unknown', 'A workspace root is required')
    let canonical: string
    try {
      canonical = await realpath(requestedRoot)
    } catch {
      return error('workspace-unknown', 'The workspace root does not exist')
    }
    const owned = this.workspaces.list().find((workspace) => workspace.path === canonical)
    return owned === undefined
      ? error('workspace-unknown', 'The root is not a registered workspace')
      : canonical
  }

  private async resolveExisting(root: string, requestedPath: string): Promise<FileResult<string>> {
    if (requestedPath.includes('\0') || containsGitSegment(requestedPath)) {
      return error('path-outside-root', 'The requested path is not available')
    }
    const lexical = resolve(root, requestedPath)
    if (!isPathInside(root, lexical)) return error('path-outside-root', 'The requested path leaves the workspace')
    try {
      const canonical = await realpath(lexical)
      return isPathInside(root, canonical)
        ? canonical
        : error('path-outside-root', 'The requested path resolves outside the workspace')
    } catch {
      return error('not-found', `Cannot resolve ${requestedPath || '.'}`)
    }
  }
```

</details>

#### 缺口

- 宿主对插件路由的外层认证、远程绑定及多用户会话授权未确定。
  **影响：**插件级活动投影缺检查不等同已复现外部可读，但不能承诺所有API仅本地或按用户隔离。
  **进一步探讨：**可先核查固定宿主路由认证，再用不同授权会话检查活动/文件端点的过滤规则。
- 上游右栏多格式和URL预览没有在本轮逐项审计。
  **影响：**不能把本包文件桥保护推广到组合依赖。
  **进一步探讨：**可针对实际需要的预览类型固定上游版本，逐项检查iframe/链接和资源访问能力。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动、持久化和退出依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

包0.2.0固定DSH rc.6与两个社区0.1.20组合包，官方槽位契约不等跨版本自动兼容。Host需webServer/workspaceRegistry，Client需浏览器布局、输入、主题及设置服务。图片保存在浏览器并不等随profile迁移，也不等停用后擦除；URL壁纸是浏览器请求外部地址，与本地图片不上传的说法应分别阅读。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH rc.6、Cordis4.0.1、React18及Node版本 | 主流程必需 | 官方slot、输入触发、工作区及Host API | 不匹配可能局部UI失效 |
| aionui-panel/settings桥0.1.20 | 默认组合必需 | 右侧工作区和配置兼容 | 非本插件自实现，需另审计 |
| workspaceRegistry/webServer | 文件/活动桥必需 | 注册根目录、预览和活动投影 | 无根目录不能搜索文件 |
| IndexedDB/localStorage及图像处理能力 | 个性化持久化必需 | 本地图像、偏好和形象 | 配额/禁用或清站点会影响恢复 |
| 远程图片网络 | 选用URL壁纸时 | 浏览器显示图片 | 本地上传与远程URL隐私边界不同 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者核对版本、依赖与Host活动路由保护 | 不从文件API推断全部路由受限 |
| 加载 | 安装web profile并重启刷新 | 槽位、右栏、个性化和输入触发接线 |
| 使用 | 读者选择本地图像或URL并搜索文件 | 引用来自预期工作区，图像/活动数据范围明确 |
| 退出 | 停用包并分别清理组合配置与浏览器数据 | 清除图像/偏好需用户主动处理 |


#### 证据与依据

**依据 1 · 源码核查**：[package.json:77-96](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/package.json#L77-L96)

peer与两个固定组合依赖。

<details>
<summary>查看原文（20行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.1",
    "@deepseek-ai/dsh-client-locale": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-runtime": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-conversation": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-input-trigger": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-layout": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-settings": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-slots": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-theme": "0.1.0-rc.6",
    "@deepseek-ai/dsh-host-webserver": "0.1.0-rc.6",
    "@deepseek-ai/dsh-session": "0.1.0-rc.6",
    "@deepseek-ai/dsh-workspace": "0.1.0-rc.6",
    "react": ">=18.2.0 <19.0.0",
    "react-dom": ">=18.2.0 <19.0.0"
  },
  "dependencies": {
    "@linxin666/dsh-client-ui-aionui-panel": "0.1.20",
    "@linxin666/dsh-client-ui-web-ui-settings": "0.1.20"
  },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:9-22](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/index.ts#L9-L22)

Host注入。

<details>
<summary>查看原文（14行）</summary>

```text
/** Host services needed by the file bridge and the companion activity route. */
export const inject = ['webServer', 'workspaceRegistry']

export function apply(ctx: Context): void {
  ctx.effect(
    () => registerPetActivity(ctx),
    'ui-enhancer: pet activity route',
  )

  const files = new WorkspaceFiles(ctx.workspaceRegistry)
  ctx.effect(
    () => registerUiEnhancerRoutes(ctx, files),
    'ui-enhancer: host file preview routes',
  )
```

</details>

**依据 3 · 源码核查**：[src/client/wallpaper.ts:142-167](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/client/wallpaper.ts#L142-L167)

localStorage偏好与IndexedDB。

<details>
<summary>查看原文（26行）</summary>

```text
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<WallpaperSettings>
    return {
      source: parsed.source === 'url' || parsed.source === 'local' ? parsed.source : 'none',
      url: typeof parsed.url === 'string' ? parsed.url : '',
      fit: parsed.fit === 'contain' || parsed.fit === 'fill' || parsed.fit === 'auto' ? parsed.fit : 'cover',
      position: parsed.position === 'top' || parsed.position === 'bottom' || parsed.position === 'left' || parsed.position === 'right'
        ? parsed.position
        : 'center',
      blur: bounded(parsed.blur, DEFAULT_WALLPAPER_SETTINGS.blur, 0, 24),
      mask: bounded(parsed.mask, DEFAULT_WALLPAPER_SETTINGS.mask, 0, 0.8),
      surfaceOpacity: bounded(parsed.surfaceOpacity, DEFAULT_WALLPAPER_SETTINGS.surfaceOpacity, 0.55, 1),
      adaptive: typeof parsed.adaptive === 'boolean' ? parsed.adaptive : true,
    }
  } catch {
    return DEFAULT_WALLPAPER_SETTINGS
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) request.result.createObjectStore(DB_STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB is unavailable'))
```

</details>

**依据 4 · 源码核查**：[src/client/wallpaper.ts:632-636](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/client/wallpaper.ts#L632-L636)

URL/local背景均由浏览器背景显示。

```text
    const imageUrl = settings.source === 'url' ? settings.url.trim() : this.snapshot.imageUrl
    const active = settings.source !== 'none' && imageUrl !== ''
    document.body.dataset.uiEnhancerWallpaper = active ? 'true' : 'false'
    document.body.dataset.uiEnhancerWallpaperTone = settings.adaptive ? this.snapshot.tone : fallbackTone()
    this.imageLayer.style.backgroundImage = active ? cssBackgroundImage(imageUrl) : 'none'
```

**依据 5 · 作者声明**：[README.md:23-32](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/README.md#L23-L32)

作者要求与安装。

<details>
<summary>查看原文（10行）</summary>

````text

```bash
dsh plugin --profile web add dsh-ui-enhancer
dsh web
```

安装后需要让正在运行的 Web profile 重新加载。插件设置中的一级“个性化”页面用于调整壁纸，“宠物”页面用于设置桌面伙伴、上传形象和管理投喂。

### 升级

````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复的成本和效果怎么量？

**研究主题：**效果与总成本

#### 完整回答

同任务应比较查找并准确引用文件、查看变更与回到原会话的总过程，个性化偏好另作主观体验。搜索有扫描/深度/结果上限，文本有200000字符限制，所以结果截断不应解读成目录没有该文件或文件全文。图像去背景与解码可增加浏览器负担，本轮没有测设备性能。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装两个组合依赖与UI资源，金额未知 | 版本/槽位冲突核对、图像设置 | 不强制模型调用 |
| 持续使用 | 文件搜索/预览、图像解码与IndexedDB、活动轮询 | 管理图片/偏好及预览误差 | URL壁纸会有网络请求，实际内存/流畅度未测 |
| 失败恢复 | 缓存/图像重导入、依赖回退与配置修复 | 区分插件自实现与右栏上游故障 | 清站点数据可能失去偏好/形象库 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件引用便利 | 注册根目录搜索与结构化输入入口 | 同任务查找/引用时间及正确率 |
| 个性化体验 | 本地图像、壁纸与独立宠物实现链 | 易用性、无障碍及长期干扰程度 |
| 活动可见性 | 聚合会话阶段、工具与回复片段 | 跨会话可见是否符合部署权限 |


#### 证据与依据

**依据 1 · 源码核查**：[src/host/workspace-files.ts:14-20](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/workspace-files.ts#L14-L20)

读取与搜索上限。

```text
const TEXT_CHAR_LIMIT = 200_000
const TEXT_BYTE_BUDGET = TEXT_CHAR_LIMIT * 4 + 3
const SEARCH_HIT_LIMIT = 100
const SEARCH_SCAN_LIMIT = 20_000
const SEARCH_DEPTH_LIMIT = 32
const HIDDEN_TREE_DIRS = new Set(['.git'])
const SEARCH_IGNORED_DIRS = new Set(['.git', 'node_modules'])
```

**依据 2 · 源码核查**：[src/host/workspace-files.ts:179-202](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/workspace-files.ts#L179-L202)

有界读取和truncated标记。

<details>
<summary>查看原文（24行）</summary>

```text
        return error('binary-file', 'Use the raw preview URL for binary files')
      }
      const decoded = data.toString('utf8')
      const truncated = info.size > bytesRead || decoded.length > TEXT_CHAR_LIMIT
      return {
        path: portableRelativePath(relative(workspaceRoot, target)),
        content: truncated ? decoded.slice(0, TEXT_CHAR_LIMIT) : decoded,
        size: info.size,
        mtime: info.mtimeMs,
        mime: mimeForPath(requestedPath),
        truncated,
      }
    } catch {
      return error('read-failed', `Cannot read ${requestedPath}`)
    } finally {
      await handle.close().catch(() => undefined)
    }
  }

  async raw(root: string, requestedPath: string): Promise<FileResult<{ path: string; size: number; mtime: number; mime: string }>> {
    const workspaceRoot = await this.requireWorkspace(root)
    if (isHostError(workspaceRoot)) return workspaceRoot
    if (requestedPath === '' || containsGitSegment(requestedPath)) {
      return error('path-outside-root', 'The requested path is not available')
```

</details>

**依据 3 · 源码核查**：[src/client/wallpaper.ts:142-167](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/client/wallpaper.ts#L142-L167)

浏览器持久化成本来源。

<details>
<summary>查看原文（26行）</summary>

```text
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<WallpaperSettings>
    return {
      source: parsed.source === 'url' || parsed.source === 'local' ? parsed.source : 'none',
      url: typeof parsed.url === 'string' ? parsed.url : '',
      fit: parsed.fit === 'contain' || parsed.fit === 'fill' || parsed.fit === 'auto' ? parsed.fit : 'cover',
      position: parsed.position === 'top' || parsed.position === 'bottom' || parsed.position === 'left' || parsed.position === 'right'
        ? parsed.position
        : 'center',
      blur: bounded(parsed.blur, DEFAULT_WALLPAPER_SETTINGS.blur, 0, 24),
      mask: bounded(parsed.mask, DEFAULT_WALLPAPER_SETTINGS.mask, 0, 0.8),
      surfaceOpacity: bounded(parsed.surfaceOpacity, DEFAULT_WALLPAPER_SETTINGS.surfaceOpacity, 0.55, 1),
      adaptive: typeof parsed.adaptive === 'boolean' ? parsed.adaptive : true,
    }
  } catch {
    return DEFAULT_WALLPAPER_SETTINGS
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) request.result.createObjectStore(DB_STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB is unavailable'))
```

</details>

**依据 4 · 作者声明**：[README.md:13-15](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/README.md#L13-L15)

作者图像/宠物功能说明，非效果实测。

```text
- 桌面宠物由本插件渲染，可命名、拖动、隐藏/召唤、缩放、查看会话状态、互动和投喂；可在独立的“宠物”一级设置页上传 PNG、JPEG、WebP、GIF 或 AVIF 作为形象。上传的形象按名字保存在浏览器的形象库中（最多 12 个），可随时切换、重命名或删除，保存后即可删除磁盘上的原始照片；旧版本已上传的单张形象会自动迁移进形象库。上传的不透明图片会在浏览器本地自动提取主体（去背景），并以无圆框的透明形象显示。开始对话、完成任务和前台使用时长会获得星星，星星可兑换食物并提升亲密度。
- 点击宠物会触发它的主动搭话（如“你在干什么呢？”“好饿啊……”），以气泡形式短暂展示。宠物下方的活动详情面板展示各会话的标题、状态、最近工具调用与回复片段，与顶部状态气泡不同质化，并可一键隐藏（偏好随浏览器持久化）。
- 在输入框键入 `@` 可搜索当前会话工作区中的文件，并插入结构化文件引用。
```

#### 缺口

- 没有同工作区文件引用任务的人时、正确率、内存与交互体验对照。
  **影响：**不能推断桌面组合提高生产率或低内存开销。
  **进一步探讨：**可用相同目录/引用任务对照原生界面，单独记录检索截断、预览误差、图像处理耗时及人工满意度。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程上可复用什么，活动最小化假设怎么验证？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

可复用的是协议层与Host/Client分离，registered-root加realpath的多层路径检查，有界搜索/读取、raw的Range及CSP，以及effect清理UI和Host订阅。PET事件投影不持久化整段日志，显示片段也有实用性，但全局聚合仍要有权限边界；信息少不等信息无敏感性。

可以探讨未验证的“按读者会话授权的最小活动投影”。默认只显示当前授权会话的phase和时间，不暴露参数/回复；详细内容需明确选择并按Host同一会话授权过滤，所有插件端点共用认证边界。对照现有聚合，目标是保持状态可见而减少跨会话信息。代价是跨会话总览不再自动可见、需权限适配。可用两个用户/会话及带假密钥的工具参数/回复夹具，检查越权字段是否为零，同时比较完成状态识别率；若无法区分授权或过度隐藏影响核心任务，应改设计而非只加免责声明。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/workspace-files.ts:287-315](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/workspace-files.ts#L287-L315)

注册根与物理路径检查。

<details>
<summary>查看原文（29行）</summary>

```text
  private async requireWorkspace(requestedRoot: string): Promise<FileResult<string>> {
    if (requestedRoot === '') return error('workspace-unknown', 'A workspace root is required')
    let canonical: string
    try {
      canonical = await realpath(requestedRoot)
    } catch {
      return error('workspace-unknown', 'The workspace root does not exist')
    }
    const owned = this.workspaces.list().find((workspace) => workspace.path === canonical)
    return owned === undefined
      ? error('workspace-unknown', 'The root is not a registered workspace')
      : canonical
  }

  private async resolveExisting(root: string, requestedPath: string): Promise<FileResult<string>> {
    if (requestedPath.includes('\0') || containsGitSegment(requestedPath)) {
      return error('path-outside-root', 'The requested path is not available')
    }
    const lexical = resolve(root, requestedPath)
    if (!isPathInside(root, lexical)) return error('path-outside-root', 'The requested path leaves the workspace')
    try {
      const canonical = await realpath(lexical)
      return isPathInside(root, canonical)
        ? canonical
        : error('path-outside-root', 'The requested path resolves outside the workspace')
    } catch {
      return error('not-found', `Cannot resolve ${requestedPath || '.'}`)
    }
  }
```

</details>

**依据 2 · 源码核查**：[src/host/routes.ts:185-206](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/routes.ts#L185-L206)

raw Range/CSP。

<details>
<summary>查看原文（22行）</summary>

```text
    const responseRange = range ?? { start: 0, end: Math.max(0, result.size - 1) }
    const headers: Record<string, string | number> = {
      'content-type': result.mime,
      'content-length': result.size === 0 ? 0 : responseRange.end - responseRange.start + 1,
      'cache-control': 'no-cache',
      'content-disposition': 'inline',
      'x-content-type-options': 'nosniff',
      'accept-ranges': 'bytes',
      'content-security-policy': "sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:",
      etag,
    }
    if (range !== null) headers['content-range'] = `bytes ${range.start}-${range.end}/${result.size}`
    res.writeHead(range === null ? 200 : 206, headers)
    if (req.method === 'HEAD') {
      res.end()
      return
    }
    const stream = range === null
      ? createReadStream(result.path)
      : createReadStream(result.path, { start: range.start, end: range.end })
    stream.on('error', (caught) => {
      ctx.logger.warn(`ui-enhancer raw stream failed: ${String(caught)}`)
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:49-69](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/client/index.ts#L49-L69)

宠物effect卸载和输入触发。

<details>
<summary>查看原文（21行）</summary>

```text

  // rc.6 can expose a second runtime package identity through dependency
  // peers. The browser service still implements this exact public face.
  const pet = new PetController(ctx.sessions as unknown as ConstructorParameters<typeof PetController>[0])
  ctx.effect(() => () => pet.dispose(), 'ui-enhancer: pet controller')

  // The local rc.6 dependency graph may contain a second ui-slots identity
  // through runtime peers. This narrow adapter describes only the official
  // settings.section surface used here and has no effect on runtime dispatch.
  const settingsSlots = ctx.slots as unknown as SettingsSectionSlots
  const t = ctx.locale.bind('ui-enhancer')
  settingsSlots.inject('settings.section', () => {
    const disposePersonalization = settingsSlots.register({
      name: 'settings.section',
      id: 'ui-enhancer-personalization',
      order: 35,
      label: () => t('settings.title'),
      locale: 'ui-enhancer',
      inject: () => ({
        wallpaper,
        getCapabilities: () => ({
```

</details>

**依据 4 · 源码核查**：[src/host/pet-activity.ts:243-265](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/pet-activity.ts#L243-L265)

订阅及route清理，假设针对缺少统一授权。

<details>
<summary>查看原文（23行）</summary>

```text
/** Mount the event projection and its plugin-owned, read-only browser route. */
export function registerPetActivity(ctx: Context): () => void {
  const tracker = new PetActivityTracker()
  const route: WebRoute = {
    kind: 'exact',
    path: PET_ACTIVITY_API_PATH,
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (req.method !== 'GET') {
        res.writeHead(405, { allow: 'GET' })
        res.end()
        return
      }
      respondJson(res, tracker.snapshot())
    },
  }
  const disposers = [
    ctx.on('session/event', (session, event) => tracker.accept(session, event)),
    ctx.on('session/disposed', (session) => tracker.forget(session)),
    ctx.webServer.register(route),
  ]
  return () => {
    for (const dispose of disposers.reverse()) dispose()
  }
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前推荐范围及停止条件是什么？

**研究主题：**采用判断

#### 完整回答

推荐observe。文件引用和个性化组合有清楚用途，但活动投影未见同类loopback/会话授权检查，且默认组合上游右栏能力较广。先观察比把多会话内容默认暴露给桌面装饰更符合现有证据。个人本地部署也需分清Host外层保护和插件实际行为。

继续探讨可先确认活动端点可达/授权与数据最小化，再按固定上游版本逐项核对真正需要的预览。若非预期读者能看到别的会话片段、输入引用错工作区、预览权限不清或清理后敏感图像仍留存，应停止对应功能并盘点浏览器/Host数据。Q02权限边界明确后，再评估小范围trial；本轮没有启动浏览器或宿主。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/pet-activity.ts:243-261](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/pet-activity.ts#L243-L261)

活动端点缺少调用者范围。

<details>
<summary>查看原文（19行）</summary>

```text
/** Mount the event projection and its plugin-owned, read-only browser route. */
export function registerPetActivity(ctx: Context): () => void {
  const tracker = new PetActivityTracker()
  const route: WebRoute = {
    kind: 'exact',
    path: PET_ACTIVITY_API_PATH,
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (req.method !== 'GET') {
        res.writeHead(405, { allow: 'GET' })
        res.end()
        return
      }
      respondJson(res, tracker.snapshot())
    },
  }
  const disposers = [
    ctx.on('session/event', (session, event) => tracker.accept(session, event)),
    ctx.on('session/disposed', (session) => tracker.forget(session)),
    ctx.webServer.register(route),
```

</details>

**依据 2 · 源码核查**：[src/host/pet-activity.ts:166-179](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/pet-activity.ts#L166-L179)

全局顶层会话投影。

<details>
<summary>查看原文（14行）</summary>

```text
  snapshot(nowMs = Date.now()): PetActivityView {
    const current = [...this.activity.values()]
      .reverse()
      .filter((entry) => !isSettled(entry, nowMs))
    const display = current[0]
    const sessions = current
      .filter((entry) => entry.topLevel && entry.bubble !== '')
      .slice(0, PET_ACTIVITY_SESSION_LIMIT)
      .map(({ sessionId, phase, bubble, detail, updatedAt }) => ({ sessionId, phase, bubble, detail, updatedAt }))
    return {
      phase: display?.phase ?? 'idle',
      bubble: display?.bubble ?? '',
      sessions,
      completedEventIds: [...this.completedEventIds],
```

</details>

**依据 3 · 源码核查**：[package.json:93-96](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/package.json#L93-L96)

上游组合依赖。

```text
  "dependencies": {
    "@linxin666/dsh-client-ui-aionui-panel": "0.1.20",
    "@linxin666/dsh-client-ui-web-ui-settings": "0.1.20"
  },
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
