# Live2D 桌宠

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6af6f02](https://github.com/cyanfish-x/dsh-live2d-pets/tree/6af6f021354afbf30394e363f23caafc800f2b28)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cyanfish-x/dsh-live2d-pets) [![npm 30d 3,448](https://img.shields.io/static/v1?label=npm+30d&message=3%2C448&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-live2d-pets) [![最新发布 2026-09-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-live2d-pets)
<!-- END META -->

> **功能**：在 DSH Web 界面挂载 Live2D 桌宠，以动画和人设台词反映 Agent 状态并支持自定义模型。

> **亮点**：将审批、执行与交付事件上映射为可自定义的桌宠动画，用现有会话状态旁边的视觉提示减少来回观察。[Q01](#research-q01)

> **主要限制**：同一桌宠实例不区分会话，动画不代表当前任务结果。本地素材路由只按文本路径检查越界，部署权限和链接隔离待验证。[Q02](#research-q02)

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
  - [Q01 · 长任务中的用户如何从桌宠看出正在执行或等待审批？](#detail-section-11)
  - [Q02 · 多个会话同时运行或使用本地素材时，插件的状态和文件服务是否隔离？](#detail-section-12)
  - [Q03 · 如何判断视觉陪伴值得继续使用，有什么低成本的故障退路？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH Web 的用户可以为单一长任务增加视觉状态提示，浏览器里切换角色和模型。

原生会话与审批页面已经显示任务进展。桌宠将状态重复呈现给另一个显示区域，并可自定义视觉反应。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌宠状态 | 显示执行、等待及交付提示 | 以原生任务记录核对 |
| 模型配置 | 选择默认、外部或本地模型 | 依赖素材加载与 Host 路由 |
| Web 渲染 | 展示 Live2D 与静态降级 | 缺少相应插槽时不显示 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Web Host、webServer、settings、slots | 是 | 加载双端和显示 | 没有 slots 就不渲染 |
| 模型素材和 WebGL | 动态渲染需要 | 加载 Live2D 模型 | 失败时静态头像 |
| Host 可读模型目录 | 本地模型需要 | 提供同源 HTTP 资源 | 不可读或找不到时 404 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 挂载 | 用户在隔离 Web profile 安装 | 右下角出现默认组件 |
| 对照 | 用短任务、审批、交付事件 | 原生状态和动画无明显错归 |
| 回退 | 关闭桌宠并使用原生视图 | 普通会话继续可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 素材网络和本地渲染，金额未知 | 准备 Host、模型和浏览器 | 最新部署兼容未知 |
| 持续 | SSE、动画、CPU 与 GPU 用量未测 | 排查多个会话的状态归属 | 浏览器性能变化未知 |
| 恢复 | 未量化 | 关闭桌宠并从原生视图核对 | 本地素材目录约束仍需管理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 旁路状态提示 | 事件映射及独立显示已实现 | 能否更快发现待审批 |
| 自定义模型 | 支持同源文件或远端模型地址 | 实际环境渲染与授权条件 |

> **思考**：同一桌宠实例不区分会话，动画不代表当前任务结果。本地素材路由只按文本路径检查越界，部署权限和链接隔离待验证。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将审批、执行与交付事件上映射为可自定义的桌宠动画，用现有会话状态旁边的视觉提示减少来回观察。[Q01](#research-q01)

服务快照和浏览器视觉分离，路由卸载会关闭已登记 SSE。路径检查是词法范围，不能作为目标文件隔离保证。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

同一桌宠实例不区分会话，动画不代表当前任务结果。本地素材路由只按文本路径检查越界，部署权限和链接隔离待验证。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用单会话和默认模型对照实际状态。远程或共享部署使用自选本地模型前，先核对访问权限与目录边界。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定版本的双端挂载、状态更新及本地文件处理。未复现真实会话归属、路由权限或性能。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、src/index.ts、src/service.ts、src/routes.ts、src/client/index.ts、src/local-models.ts、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本静态检查组件和 Host 接线。未运行真实 Host、浏览器、模型、网络服务、现有测试或文件隔离用例。
- 下一步：比较相同浏览器会话启用和禁用桌宠时的等待、审批与交付提示，重点测双会话归属、模型加载失败和 SSE 断开。用无敏感样例复核本地模型权限。

**分析版本**

- **仓库**：[cyanfish-x/dsh-live2d-pets](https://github.com/cyanfish-x/dsh-live2d-pets)
- **版本号**：0.3.0（[固定提交 6af6f02](https://github.com/cyanfish-x/dsh-live2d-pets/tree/6af6f021354afbf30394e363f23caafc800f2b28)）
- **版本日期**：2026-09-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可尝试按当前会话过滤状态推送，用同时运行两项任务测试能否减少错误提示且不漏掉审批。[Q03](#research-q03)

比较相同浏览器会话启用和禁用桌宠时的等待、审批与交付提示，重点测双会话归属、模型加载失败和 SSE 断开。用无敏感样例复核本地模型权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 22 | 1283 | — | — | 16877 |
| .md | test | 2 | 170 | — | — | 5619 |
| .ts | source | 17 | 5038 | 3940 | 794 | — |
| .ts | test | 6 | 848 | 753 | 40 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-14），可前往 [GitHub Issues](https://github.com/cyanfish-x/dsh-live2d-pets/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Web 怎样将 Agent 事件交给桌宠呈现，状态和模型素材各有什么边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长任务中的用户如何从桌宠看出正在执行或等待审批？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

根补丁给 Web profile 插入桌宠模块。Host 注入 webServer 和 settings，将用户设置与事件处理交给 PetService。该服务把 agent/status 的 running 改为 thinking，approval/request 改为 waiting 后继续传递审批链，错误进入 error，交付事件进入短暂 delivered；停止轮次也可能触发 done，不能把该动画当任务通过。路由通过 SSE 先发当前快照、随变化再推送，并处理断开；浏览器 EventSource 订阅同一接口，再把 PetAnchor 注册到 shell.overlay。相比读取原生状态文本，增量在另一块视觉反馈区域和自定义角色表达，Host 原有结果与审批仍需查看。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:34-48](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/package.json#L34-L48)

根 manifest 声明 profile patch 与 Web 客户端。

<details>
<summary>查看原文（15行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:5-11](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/cordis.patch.yml#L5-L11)

插入固定入口及默认配置。

```text
- insert:
    - id: live2d-pet
      name: dsh-live2d-pets
      config:
        model: hiyori
        persona: tsundere
        debug: false
```

**依据 3 · 源码核查**：[src/index.ts:95-107](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/index.ts#L95-L107)

宿主服务注入、设置注册。

<details>
<summary>查看原文（13行）</summary>

```text
/** 依赖服务：webServer（同源路由）、settings（namespace 注册与解析）。 */
export const inject = ['webServer', 'settings']

/** 注册宠物服务、settings namespace 及其 API + 素材路由。 */
export function apply(ctx: Context, config: Config): void {
  // 注册 settings namespace：base = 本条 cordis.yml 条目 config 子集，
  // 用户层（settings.yaml）覆盖其上；注册随插件 fiber 自动清理。
  ctx.settings.register(NS, Config, { base: config })

  // 解析值优先（三层：schema 默认 → base → 用户层），未注册时回落 entry config。
  const resolveConfig = (): Config => {
    const resolved = ctx.settings.get(NS) as Config | undefined
    return resolved ?? config
```

</details>

**依据 4 · 源码核查**：[src/service.ts:68-112](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/service.ts#L68-L112)

单个 PetService 的事件和状态变化。

<details>
<summary>查看原文（45行）</summary>

```text
export class PetService {
  private state: PetState = 'idle'
  private agent = 'idle'
  private version = 0
  private display: PetDisplay
  private holdTimerId: ReturnType<typeof setTimeout> | undefined
  private listeners = new Set<ChangeListener>()

  constructor(
    private readonly ctx: Context,
    private readonly getConfig: () => Config,
    private readonly personasStore?: PersonasStore,
    private readonly customModelsStore?: CustomModelsStore,
  ) {
    this.display = loadPetPersist()
    // 卸载时清理"完成/交付"保持计时器
    ctx.effect(() => () => {
      if (this.holdTimerId) clearTimeout(this.holdTimerId)
    })

    ctx.on('agent/status', (payload) => {
      const status = payload?.status
      if (!status) return
      this.agent = String(status)
      if (status === 'running') {
        this.set('thinking')
      } else if (status === 'idle' && this.state !== 'done' && this.state !== 'delivered') {
        // done/delivered 保持期内到达的 idle 不打断庆祝（由保持计时器负责回收）
        this.set('idle')
      }
    })
    ctx.on('agent/error', () => this.set('error'))
    ctx.on('agent/turn-stopping', () => {
      // 交付保持期内紧随的轮次结束不打断交付庆祝（交付是更强的完成时刻，ADR-012）
      if (this.state !== 'delivered') this.setDone()
    })
    // approval/request 是 waterfall 事件：必须调用 next() 放行审批链
    ctx.on('approval/request', (_req, next) => {
      this.set('waiting')
      return next()
    })
    // 模型经 present 工具交付文件（会话事件总线，ADR-012）
    ctx.on('session/event', (_session, event) => {
      if (event?.type === 'deliverables/presented') this.setDelivered()
    })
```

</details>

**依据 5 · 源码核查**：[src/routes.ts:169-197](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/routes.ts#L169-L197)

SSE 初始快照、增量通知、心跳与关闭。

<details>
<summary>查看原文（29行）</summary>

```text
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (req.method !== 'GET') {
        json(res, 405, { ok: false, error: 'method-not-allowed' })
        return
      }
      res.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-store',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      })
      // 断线后写入会抛错，吞掉避免未处理异常
      res.on('error', () => {})
      res.write('retry: 3000\n\n')
      const send = () => { res.write(`data: ${JSON.stringify(service.snapshot())}\n\n`) }
      send()
      const unsubscribe = service.onChange(send)
      const heartbeat = setInterval(() => { res.write(': ping\n\n') }, SSE_HEARTBEAT_MS)
      let closed = false
      const close = () => {
        if (closed) return
        closed = true
        unsubscribe()
        clearInterval(heartbeat)
        try { res.end() } catch { /* 连接已关闭 */ }
      }
      req.on('close', close)
      res.on('close', close)
      onStream?.(close)
```

</details>

**依据 6 · 源码核查**：[src/client/index.ts:253-269](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/client/index.ts#L253-L269)

浏览器实际订阅接口。

<details>
<summary>查看原文（17行）</summary>

```text
/** JSON 响应读取:非 2xx 抛错——错误响应不得当作合法视图/结果解析。 */
async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`http ${res.status}`)
  return await res.json() as T
}

const api = {
  state: (): Promise<PetStateView> => fetch(`${PET_API}/state`).then((res) => readJson<PetStateView>(res)),
  /** SSE 状态订阅（ADR-006）：每次推送回调最新快照；断线由 EventSource
   *  自动重连（服务端 retry 3s），重连后首帧即全量快照。返回退订函数。 */
  events: (onState: (view: PetStateView) => void, onError: () => void): (() => void) => {
    const es = new EventSource(`${PET_API}/events`)
    es.onmessage = (ev: MessageEvent<string>) => {
      try {
        onState(JSON.parse(ev.data) as PetStateView)
      } catch {
        // 忽略坏帧，等待下一条
```

</details>

**依据 7 · 源码核查**：[src/client/index.ts:1344-1351](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/client/index.ts#L1344-L1351)

挂到视频界面 overlay。

```text
/** 插件入口。 */
export function apply(ctx: ClientContext): void {
  const slots = ctx.get('slots') as SlotsLike | undefined
  if (slots === undefined) return
  slots.inject('shell.overlay', () => slots.register(
    { name: 'shell.overlay', id: 'live2d-pet' },
    () => createElement(PetAnchor),
  ))
```

#### 缺口

- 缺少真实 Web Host 和事件顺序验证
  **影响**：不同宿主事件兼容和画面更新延迟未知
  **进一步探讨**：用已知执行、审批、错误和交付四个可控事件验证动画与真实视图对应

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多个会话同时运行或使用本地素材时，插件的状态和文件服务是否隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程、功能与机制

#### 完整回答

PetService 每个实例维护一组 state 和 agent 字段，session/event 回调忽略会话参数，SSE 直接推同一服务快照。在无另外宿主作用域隔离的情况下，同一实例中的其他会话事件可改变当前页面桌宠状态。素材方面，配置里的本地入口可解析为一个目录。请求按模型 ID 查到对应配置，使用 resolve/relative 检查路径越界和文件是否存在，再由 Host 读取文件并返回。这个检查只保证词法路径留在该目录，没有 realpath 核对目标。若目录内有指向外部的符号链接、Host 可读且请求能到达该路由，代码路径可能绕过词法限制。未核对真实部署的认证、路由 ACL 和文件系统隔离，因此不对远程或其他用户的访问作已复现结论。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:68-75](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/service.ts#L68-L75)

实例仅维护一组状态字段。

```text
export class PetService {
  private state: PetState = 'idle'
  private agent = 'idle'
  private version = 0
  private display: PetDisplay
  private holdTimerId: ReturnType<typeof setTimeout> | undefined
  private listeners = new Set<ChangeListener>()

```

**依据 2 · 源码核查**：[src/service.ts:88-112](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/service.ts#L88-L112)

对事件读取状态，无会话归属映射。

<details>
<summary>查看原文（25行）</summary>

```text
    ctx.on('agent/status', (payload) => {
      const status = payload?.status
      if (!status) return
      this.agent = String(status)
      if (status === 'running') {
        this.set('thinking')
      } else if (status === 'idle' && this.state !== 'done' && this.state !== 'delivered') {
        // done/delivered 保持期内到达的 idle 不打断庆祝（由保持计时器负责回收）
        this.set('idle')
      }
    })
    ctx.on('agent/error', () => this.set('error'))
    ctx.on('agent/turn-stopping', () => {
      // 交付保持期内紧随的轮次结束不打断交付庆祝（交付是更强的完成时刻，ADR-012）
      if (this.state !== 'delivered') this.setDone()
    })
    // approval/request 是 waterfall 事件：必须调用 next() 放行审批链
    ctx.on('approval/request', (_req, next) => {
      this.set('waiting')
      return next()
    })
    // 模型经 present 工具交付文件（会话事件总线，ADR-012）
    ctx.on('session/event', (_session, event) => {
      if (event?.type === 'deliverables/presented') this.setDelivered()
    })
```

</details>

**依据 3 · 源码核查**：[src/local-models.ts:22-38](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/local-models.ts#L22-L38)

本地模型目录和入口解析。

<details>
<summary>查看原文（17行）</summary>

```text
export function localModelTarget(modelUrl: string): LocalModelTarget | null {
  if (!isLocalModelPath(modelUrl)) return null
  const p = modelUrl.trim()
  try {
    const st = statSync(p)
    if (st.isDirectory()) {
      const files = readdirSync(p).filter((f) => f.toLowerCase().endsWith('.model3.json'))
      if (files.length === 0) return null
      return { root: p, fileName: files[0] }
    }
    if (st.isFile()) {
      return { root: dirname(p), fileName: basename(p) }
    }
  } catch {
    return null
  }
  return null
```

</details>

**依据 4 · 源码核查**：[src/local-models.ts:48-57](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/local-models.ts#L48-L57)

边界使用词法路径和 existsSync。

<details>
<summary>查看原文（10行）</summary>

```text
/** 把本地模型路由的相对路径安全解析为真实文件路径；越界返回 null。 */
export function resolveLocalModelFile(modelUrl: string, relativePath: string): string | null {
  const target = localModelTarget(modelUrl)
  if (!target) return null
  const root = resolve(target.root)
  const file = resolve(root, relativePath)
  const rel = relative(root, file)
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) return null
  if (!existsSync(file)) return null
  return file
```

</details>

**依据 5 · 源码核查**：[src/routes.ts:262-307](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/routes.ts#L262-L307)

模型 ID 校验、路径解析和 Host 读取分支。

<details>
<summary>查看原文（46行）</summary>

```text
  const localModelRoute: WebRoute = {
    kind: 'prefix',
    path: PET_LOCAL_MODELS_PREFIX,
    handler: (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405)
        res.end()
        return Promise.resolve()
      }
      const url = new URL(req.url ?? '/', 'http://localhost')
      const parts = url.pathname.split('/').filter(Boolean)
      // /pet-local-models/<id>/<relative...>
      if (parts.length < 3) {
        res.writeHead(404)
        res.end()
        return Promise.resolve()
      }
      const id = decodeURIComponent(parts[1])
      const relativePath = parts.slice(2).map(decodeURIComponent).join('/')
      const entry = service.listCustomModels().find((c) => c.id === id)
      if (!entry || !isLocalModelPath(entry.modelUrl)) {
        res.writeHead(404)
        res.end()
        return Promise.resolve()
      }
      const file = resolveLocalModelFile(entry.modelUrl, relativePath)
      if (!file) {
        res.writeHead(404)
        res.end()
        return Promise.resolve()
      }
      return readFile(file).then((body) => {
        res.writeHead(200, {
          'content-type': mimeForFile(file),
          'content-length': String(body.byteLength),
          'cache-control': 'no-cache',
        })
        if (req.method === 'HEAD') {
          res.end()
          return
        }
        res.end(body)
      }, () => {
        res.writeHead(404)
        res.end()
      })
```

</details>

#### 缺口

- Host 实际作用域和同源路由访问策略待验证
  **影响**：无法将状态混用或本地文件读出扩大为所有部署事实
  **进一步探讨**：在隔离环境用两个无敏感会话和空白样例目录，验证 SSE 归属及软链接拒绝条件

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何判断视觉陪伴值得继续使用，有什么低成本的故障退路？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

对同一浏览器主要观察一个 DSH 会话的人，可先选默认角色，只对无敏感短任务和一项审批核对桌宠提示；以原生任务记录作为结果来源。首次需要匹配 Host 与浏览器，可联网加载默认模型或自备合法模型。持续成本来自模型文件、动画渲染和事件长连接，CPU、网络、注意力和延迟未测。找不到 slot 时客户端退出，模型加载异常用静态头像；桌宠状态与可验证任务记录偏离时关闭插件并使用原生视图。可探索按会话标识过滤 SSE 快照，用切换两个会话的对照考察错归事件数。若宿主已隔离监听，或插件加入筛选后漏发审批信号，应停止此设计。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-71](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/README.md#L45-L71)

默认模型来源、网络与自定义条件。

<details>
<summary>查看原文（27行）</summary>

````text
### 方式二：手动安装

在终端执行（`web` profile 首次使用时自动初始化）：

```sh
dsh plugin --profile web add dsh-live2d-pets
```

安装后插件默认启用。启动 DSH：

```sh
dsh web
```

浏览器打开后，右下角会出现默认宠物（尺寸 160px）。当前默认模型为 Hiyori（Live2D 官方示例模型），首次加载需联网。

### 互动

- **鼠标跟随**：默认开启。鼠标在页面任意位置移动时，宠物的头、眼睛、身体会平滑看向鼠标；鼠标移出页面后复位正视前方。拖拽中不跟随，隐藏或页面失焦时自动暂停。
- **触摸互动**：摸头 / 摸腿 / 摸手 / 摸身体各有专属台词与动作；模型 HitArea 不足时按包围盒空间分区回退。
- **拖动**：按住宠物拖动到任意位置，松手后停靠并持久化。

自定义模型：打开设置 →「桌宠配置」→「我的模型」，填写名称与 `.model3.json` 地址（外网 CDN、自建静态站、本机 HTTP 服务，或**本机绝对路径**如 `C:/models/foo/foo.model3.json` 均可；本地路径由插件 Host 通过 `/pet-local-models/...` 同源路由加载）。可展开 **「空间分区覆盖」** 按字段微调五矩形（头/身/腿居中列 + 左右臂；0–1，留空用默认），或展开 **「动画映射」** 实时解析模型动作组，为状态/互动部位选择动作组；建议配合开发者选项「显示点击分区」对照色块。内置 Hiyori 已带居中分区预设。

### 配置设置

打开 **DSH 设置 →「桌宠配置」**，改完立刻生效，无需重启。
````

</details>

**依据 2 · 源码核查**：[src/client/index.ts:1334-1351](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/client/index.ts#L1334-L1351)

客户端失败降级与插槽预检。

<details>
<summary>查看原文（18行）</summary>

```text
      }
    } catch (error) {
      // 静态头像降级（WebGL 不可用 / 模型加载失败，spec §7）
      showFallback()
    }
  })()

  return () => { for (const fn of cleanup) { try { fn() } catch { /* 忽略清理错误 */ } } }
}

/** 插件入口。 */
export function apply(ctx: ClientContext): void {
  const slots = ctx.get('slots') as SlotsLike | undefined
  if (slots === undefined) return
  slots.inject('shell.overlay', () => slots.register(
    { name: 'shell.overlay', id: 'live2d-pet' },
    () => createElement(PetAnchor),
  ))
```

</details>

**依据 3 · 源码核查**：[src/index.ts:128-143](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/index.ts#L128-L143)

路由卸载清理和 SSE 关闭。

<details>
<summary>查看原文（16行）</summary>

```text
  // 路由随插件生命周期注册/清理；配置变更（HMR / settings 热更新）经 resolveConfig 即时反映。
  // 插件卸载时同时关闭全部活跃 SSE 流（onStream），避免旧流在路由注销后空转心跳。
  ctx.effect(() => {
    const openStreams = new Set<() => void>()
    const routes = makePetRoutes({
      service,
      packageRoot: petPackageRoot(import.meta.url),
      settings: settingsApi,
      onStream: (close) => { openStreams.add(close) },
    })
    const disposers = routes.map((route) => ctx.webServer.register(route))
    return () => {
      for (const close of openStreams) close()
      for (const dispose of disposers) dispose()
    }
  }, 'live2d-pet: routes')
```

</details>

**依据 4 · 源码核查**：[src/service.ts:88-112](https://github.com/cyanfish-x/dsh-live2d-pets/blob/6af6f021354afbf30394e363f23caafc800f2b28/src/service.ts#L88-L112)

目前使用全局事件视图的代码位置。

<details>
<summary>查看原文（25行）</summary>

```text
    ctx.on('agent/status', (payload) => {
      const status = payload?.status
      if (!status) return
      this.agent = String(status)
      if (status === 'running') {
        this.set('thinking')
      } else if (status === 'idle' && this.state !== 'done' && this.state !== 'delivered') {
        // done/delivered 保持期内到达的 idle 不打断庆祝（由保持计时器负责回收）
        this.set('idle')
      }
    })
    ctx.on('agent/error', () => this.set('error'))
    ctx.on('agent/turn-stopping', () => {
      // 交付保持期内紧随的轮次结束不打断交付庆祝（交付是更强的完成时刻，ADR-012）
      if (this.state !== 'delivered') this.setDone()
    })
    // approval/request 是 waterfall 事件：必须调用 next() 放行审批链
    ctx.on('approval/request', (_req, next) => {
      this.set('waiting')
      return next()
    })
    // 模型经 present 工具交付文件（会话事件总线，ADR-012）
    ctx.on('session/event', (_session, event) => {
      if (event?.type === 'deliverables/presented') this.setDelivered()
    })
```

</details>

#### 缺口

- 没有同版本浏览器负载或多会话用户对照
  **影响**：缺少对提示准确性、分心和资源开销的结果
  **进一步探讨**：在同一浏览器对照只用原生状态和打开桌宠，记录错归、CPU 和中断次数

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
