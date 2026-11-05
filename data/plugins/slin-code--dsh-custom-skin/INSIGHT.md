# dsh-custom-skin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[03d3117](https://github.com/SLin-code/dsh-custom-skin/tree/03d3117fa426d14df4e7a58248adfce094e94633)

<!-- BEGIN META -->
[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SLin-code/dsh-custom-skin)
<!-- END META -->

> **功能**：在 DSH Web 设置中管理本地壁纸和面板外观。

> **亮点**：[Q01](#research-q01) 提供可持久化图片库与设置页。

> **主要限制**：[Q02](#research-q02) 当前显示可能没有持久化，且换origin不迁移。

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
  - [Q01 · 本地壁纸怎样保存和显示？](#detail-section-11)
  - [Q02 · 个人试用有什么失败与退出条件？](#detail-section-12)
  - [Q03 · 多个标签会不会显示不同的图片库？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在个人浏览器定制DSH背景并保留图片的用户。

默认背景或临时CSS样式。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 壁纸库 | 上传切换删除图片 | 浏览器配额和origin限制 |
| 外观 | 遮罩与模糊等设置 | 先核对代码可读性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH Web槽位 | 必需 | 挂载设置 | 默认界面 |
| 浏览器IndexedDB | 图片库必需 | 保存Blob | 显示storage错误 |
| 同一origin | 恢复需要 | 复用本地库 | 新origin重新导入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 测试页面和小图 | 记录默认可读性 |
| 保存 | 上传并刷新 | 检查选择与图片 |
| 退出 | 删除测试图并禁用 | 核对默认界面 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器磁盘未知 | 选图调遮罩 | 无模型调用路径 |
| 持续使用 | 内存及渲染未知 | 升级后核对可读性 | 按图片 |
| 失败恢复 | 清理成本未知 | 删图库或恢复默认 | 持久偏好可能失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 图片库 | 事务完成后更新显示 | 配额和解码 |
| 恢复 | IndexedDB及localStorage | 重开持久化 |
| 禁用 | 撤销URL并清展示 | 真实默认恢复 |

> **思考**：[Q02](#research-q02) 当前显示可能没有持久化，且换origin不迁移。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供可持久化图片库与设置页。

[Q01](#research-q01) 事务完成后才展示；[Q02](#research-q02) 偏好失败的可见性较弱。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 当前显示可能没有持久化，且换origin不迁移。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q02](#research-q02) 同origin小图先验证刷新和删除。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

客户端存储和清理已静态核查，视觉及配额未实测。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.ts、src/client/skin-controller.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定客户端入口、存储和清理，未运行。
- 下一步：核对配额、刷新、默认样式和双标签。

**分析版本**

- **仓库**：[SLin-code/dsh-custom-skin](https://github.com/SLin-code/dsh-custom-skin)
- **版本号**：0.1.0（[固定提交 03d3117](https://github.com/SLin-code/dsh-custom-skin/tree/03d3117fa426d14df4e7a58248adfce094e94633)）
- **版本日期**：2026-09-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 若多标签出现陈旧库，可验证跨标签同步。

核对配额、刷新、默认样式和双标签。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 841 | 804 | 81 | — |
| .md | source | 2 | 156 | — | — | 884 |
| .mjs | source | 2 | 72 | 66 | 0 | — |
| .ts | source | 7 | 731 | 639 | 22 | — |
| .tsx | source | 1 | 170 | 157 | 2 | — |
| .ts | test | 2 | 193 | 175 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/SLin-code/dsh-custom-skin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地壁纸的浏览器存储、显示与恢复是否适合个人试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本地壁纸怎样保存和显示？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望给个人DSH界面换背景的用户，可在设置页导入图片。客户端创建SkinController并注册设置区，初始化从IndexedDB取Blob，用object URL显示；偏好保存在localStorage。上传先按MIME和20MB限制筛选，再在串行队列内按容量截断，以一个readwrite事务保存，事务完成后才更新内存和显示。相较只注入一段CSS，图片库可在同源浏览器重开时恢复，未增加宿主文件存储。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:14-31](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/src/client/index.ts#L14-L31)

设置与生命周期

<details>
<summary>查看原文（18行）</summary>

```text
/** Register the settings page and begin restoring this browser's wallpaper. */
export function apply(ctx: ClientContext): void {
  const controller = new SkinController()
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-custom-skin: dictionaries')
  ctx.effect(() => installStyles(), 'dsh-custom-skin: global styles')
  ctx.effect(() => {
    void controller.initialize()
    return () => { controller.dispose() }
  }, 'dsh-custom-skin: local wallpaper runtime')
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'custom-skin',
    order: 12,
    label: () => t('nav'),
    locale: NS,
    inject: () => ({ controller, locale: ctx.locale, hooks: { skin: controller } }),
  }, SkinSection))
```

</details>

**依据 2 · 源码核查**：[src/client/skin-controller.ts:149-168](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/src/client/skin-controller.ts#L149-L168)

恢复及存储错误

<details>
<summary>查看原文（20行）</summary>

```text
  private async load(): Promise<void> {
    try {
      this.database = await openDatabase()
      const transaction = this.database.transaction(STORE, 'readonly')
      const records = await requestResult(transaction.objectStore(STORE).getAll()) as WallpaperRecord[]
      const wallpapers = records
        .sort((left, right) => right.createdAt - left.createdAt)
        .map(record => ({
          id: record.id,
          name: record.name,
          createdAt: record.createdAt,
          url: this.createUrl(record.id, record.blob),
        }))
      const activeId = wallpapers.some(item => item.id === this.snapshot.activeId)
        ? this.snapshot.activeId
        : wallpapers[0]?.id
      this.publish({ ...this.snapshot, activeId, ready: true, wallpapers })
      this.persist()
    } catch {
      this.publish({ ...this.snapshot, ready: true, error: 'storage' })
```

</details>

**依据 3 · 源码核查**：[src/client/skin-controller.ts:173-211](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/src/client/skin-controller.ts#L173-L211)

上传事务到显示

<details>
<summary>查看原文（39行）</summary>

```text
  addFiles(files: readonly File[]): Promise<void> {
    const valid = files.filter(file => IMAGE_TYPES.has(file.type) && file.size > 0 && file.size <= MAX_IMAGE_BYTES)
    const skipped = valid.length !== files.length
    return this.enqueue(async () => {
      await this.initialization
      if (valid.length === 0) {
        if (skipped) this.publish({ ...this.snapshot, error: 'invalid-file' })
        return
      }
      if (this.database === undefined) {
        this.publish({ ...this.snapshot, error: 'storage' })
        return
      }
      const capacity = Math.max(0, MAX_IMAGES - this.snapshot.wallpapers.length)
      const accepted = valid.slice(0, capacity)
      const transaction = this.database.transaction(STORE, 'readwrite')
      const records = accepted.map((file, index): WallpaperRecord => ({
        id: makeId(),
        name: file.name,
        type: file.type,
        blob: file,
        createdAt: Date.now() + index,
      }))
      for (const record of records) transaction.objectStore(STORE).put(record)
      await transactionDone(transaction)
      const added = records.map(record => ({
        id: record.id,
        name: record.name,
        createdAt: record.createdAt,
        url: this.createUrl(record.id, record.blob),
      })).reverse()
      this.publish({
        ...this.snapshot,
        activeId: this.snapshot.activeId ?? added[0]?.id,
        error: skipped || accepted.length !== valid.length ? 'invalid-file' : undefined,
        wallpapers: [...added, ...this.snapshot.wallpapers],
      })
      this.persist()
    }, 'upload')
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1-7](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/src/index.ts#L1-L7)

空宿主实现

```text
/** Host half for the DSH Web skin client plugin. */

/** Cordis plugin name. */
export const name = 'dsh-custom-skin'

/** The feature is implemented entirely in the browser client. */
export function apply(): void {}
```

#### 缺口

- 实际浏览器配额和图片解码未测试
  **影响**：不能以声明容量推断所有图片都可保存
  **进一步探讨**：合成小图片验证刷新、删除和恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 个人试用有什么失败与退出条件？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、工程质量与复用、采用判断

#### 完整回答

壁纸按浏览器和origin隔离，换端口不会自动迁移。IndexedDB加载错误会发布storage状态，偏好写入失败则吞掉异常并只在当前页继续生效，因此本页看见设置不证明下次能恢复。关闭插件会断开观察器、关闭数据库、撤销object URL并清理展示，但持久图片需用户主动删除或清站点数据。

先在测试profile同源页面放一张合成图，核对浅深模式下代码、输入和弹窗可读；再刷新验证持久化，并做删除与禁用。无需额外模型费，浏览器内存和磁盘开销仍未知，人工主要是调整遮罩和对照页面。若刷新丢选择、配额错误或文字不可读，清除测试图、恢复默认并禁用。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/skin-controller.ts:149-168](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/src/client/skin-controller.ts#L149-L168)

加载失败状态

<details>
<summary>查看原文（20行）</summary>

```text
  private async load(): Promise<void> {
    try {
      this.database = await openDatabase()
      const transaction = this.database.transaction(STORE, 'readonly')
      const records = await requestResult(transaction.objectStore(STORE).getAll()) as WallpaperRecord[]
      const wallpapers = records
        .sort((left, right) => right.createdAt - left.createdAt)
        .map(record => ({
          id: record.id,
          name: record.name,
          createdAt: record.createdAt,
          url: this.createUrl(record.id, record.blob),
        }))
      const activeId = wallpapers.some(item => item.id === this.snapshot.activeId)
        ? this.snapshot.activeId
        : wallpapers[0]?.id
      this.publish({ ...this.snapshot, activeId, ready: true, wallpapers })
      this.persist()
    } catch {
      this.publish({ ...this.snapshot, ready: true, error: 'storage' })
```

</details>

**依据 2 · 源码核查**：[src/client/skin-controller.ts:269-308](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/src/client/skin-controller.ts#L269-L308)

释放和偏好持久化失败

<details>
<summary>查看原文（40行）</summary>

```text
  dispose(): void {
    this.disposed = true
    this.observer.disconnect()
    this.database?.close()
    for (const url of this.objectUrls.values()) URL.revokeObjectURL(url)
    this.objectUrls.clear()
    this.clearPresentation()
    this.listeners.clear()
  }

  private update(patch: Partial<SkinPreferences & Pick<SkinSnapshot, 'error'>>): void {
    this.publish({ ...this.snapshot, ...patch })
    this.persist()
  }

  private enqueue(operation: () => Promise<void>, error: 'upload' | 'mutation'): Promise<void> {
    this.queue = this.queue.catch(() => {}).then(async () => {
      if (this.disposed) return
      try {
        await operation()
      } catch {
        this.publish({ ...this.snapshot, error })
      }
    })
    return this.queue
  }

  private publish(snapshot: SkinSnapshot): void {
    if (this.disposed) return
    this.snapshot = Object.freeze({ ...snapshot, wallpapers: Object.freeze([...snapshot.wallpapers]) })
    this.applyPresentation()
    for (const listener of this.listeners) listener()
  }

  private persist(): void {
    const { activeId, enabled, fit, position, dim, blur, surface } = this.snapshot
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ activeId, enabled, fit, position, dim, blur, surface }))
    } catch {
      // Preferences remain live for this page when storage is unavailable.
```

</details>

**依据 3 · 作者声明**：[README.md:34-55](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/README.md#L34-L55)

安装与卸载

<details>
<summary>查看原文（22行）</summary>

````text
## Install in DSH Web

Run the following commands in the DeepSeek Harness repository:

```sh
pnpm dsh plugin --profile web add github:SLin-code/dsh-custom-skin
pnpm dsh web
```

Open **Settings** in the lower-left corner of the Web interface, then select **Personalization** to add a wallpaper or switch the interface between **English** and **Chinese**.

To install a local development copy instead:

```sh
pnpm dsh plugin --profile web add "/absolute/path/to/dsh-custom-skin"
pnpm dsh web
```

To uninstall:

```sh
pnpm dsh plugin --profile web remove dsh-custom-skin
````

</details>

**依据 4 · 作者声明**：[README.md:70-74](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/README.md#L70-L74)

容量和origin限制

```text
## Data and limitations

- Each image can be up to 20 MB, with a maximum of 24 saved images. The browser's storage quota may impose a lower practical limit.
- Wallpapers are isolated by browser and site origin. If you open DSH in another browser, on another port, or at a remote address, you will need to add the images again.
- Clearing the site's browser data also removes the saved wallpapers.
```

#### 缺口

- 真实加载性能、视觉效果及禁用恢复未执行
  **影响**：不能支持跨浏览器迁移或长期资源结论
  **进一步探讨**：在同一origin记录刷新前后选择、内存与默认界面

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多个标签会不会显示不同的图片库？

**研究主题**：新假设与验证

#### 完整回答

controller初始化后持有本页snapshot，上传在本controller队列内串行；这不构成跨标签更新通知。可先比较两个标签中上传、删除和刷新后的列表。如果确有陈旧项，再试验用广播或重读数据库同步，观察失效object URL和重复图片是否减少。若本来已由宿主刷新同步，或新增通知造成闪烁和错误选择，则不增加机制。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/skin-controller.ts:116-127](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/src/client/skin-controller.ts#L116-L127)

本实例snapshot与队列

<details>
<summary>查看原文（12行）</summary>

```text
/** Owns one browser's wallpaper library and presentation state. */
export class SkinController {
  private snapshot: SkinSnapshot = { ...parsePreferences(), ready: false, wallpapers: [] }
  private readonly listeners = new Set<() => void>()
  private readonly objectUrls = new Map<string, string>()
  private readonly originalTokens = new Map<string, { value: string; priority: string }>()
  private readonly writtenTokens = new Map<string, string>()
  private database?: IDBDatabase
  private initialization?: Promise<void>
  private queue: Promise<void> = Promise.resolve()
  private disposed = false
  private readonly observer: MutationObserver
```

</details>

**依据 2 · 源码核查**：[src/client/skin-controller.ts:173-211](https://github.com/SLin-code/dsh-custom-skin/blob/03d3117fa426d14df4e7a58248adfce094e94633/src/client/skin-controller.ts#L173-L211)

事务后更新本页状态

<details>
<summary>查看原文（39行）</summary>

```text
  addFiles(files: readonly File[]): Promise<void> {
    const valid = files.filter(file => IMAGE_TYPES.has(file.type) && file.size > 0 && file.size <= MAX_IMAGE_BYTES)
    const skipped = valid.length !== files.length
    return this.enqueue(async () => {
      await this.initialization
      if (valid.length === 0) {
        if (skipped) this.publish({ ...this.snapshot, error: 'invalid-file' })
        return
      }
      if (this.database === undefined) {
        this.publish({ ...this.snapshot, error: 'storage' })
        return
      }
      const capacity = Math.max(0, MAX_IMAGES - this.snapshot.wallpapers.length)
      const accepted = valid.slice(0, capacity)
      const transaction = this.database.transaction(STORE, 'readwrite')
      const records = accepted.map((file, index): WallpaperRecord => ({
        id: makeId(),
        name: file.name,
        type: file.type,
        blob: file,
        createdAt: Date.now() + index,
      }))
      for (const record of records) transaction.objectStore(STORE).put(record)
      await transactionDone(transaction)
      const added = records.map(record => ({
        id: record.id,
        name: record.name,
        createdAt: record.createdAt,
        url: this.createUrl(record.id, record.blob),
      })).reverse()
      this.publish({
        ...this.snapshot,
        activeId: this.snapshot.activeId ?? added[0]?.id,
        error: skipped || accepted.length !== valid.length ? 'invalid-file' : undefined,
        wallpapers: [...added, ...this.snapshot.wallpapers],
      })
      this.persist()
    }, 'upload')
```

</details>

#### 缺口

- 真实多标签陈旧状态未复现
  **影响**：同步收益与冲突处理未知
  **进一步探讨**：两标签用合成图片逐项比较

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
