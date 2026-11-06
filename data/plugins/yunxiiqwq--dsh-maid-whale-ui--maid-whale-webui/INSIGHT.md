# 鲸鱼女仆主题与桌宠（子插件）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1678a16](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/tree/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui)

<!-- BEGIN META -->
[![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yunxiiQwQ/dsh-maid-whale-UI) [![npm 30d 1,547](https://img.shields.io/static/v1?label=npm+30d&message=1%2C547&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunxii/dsh-client-ui-skin-maid-whale-webui) [![最新发布 2026-09-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunxii/dsh-client-ui-skin-maid-whale-webui)
<!-- END META -->

> **功能**：为 DSH Web/桌面提供鲸鱼纸面亮暗主题、手绘边框与随 Host 事件变化的原生桌宠。

> **亮点**：美术/DOM主题适配与当前DSH配置接线，上游状态机/Qt/Host能力继承应扣除。见 [Q04](#research-q04)。

> **主要限制**：快捷开关乐观不等已停；全局Session摘要/布局诊断留存，PONG不证明Qt渲染；EXE未验签/运行。见 [Q03](#research-q03)。

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
  - [Q01 · 主题和设置怎样实际进入DSH，关闭是否完整恢复？](#detail-section-11)
  - [Q02 · DSH事件怎样变成原生宠物状态，进程失败/退出怎样处理？](#detail-section-12)
  - [Q03 · 本地配置和状态内容有哪些身份、持久与隐私边界？](#detail-section-13)
  - [Q04 · 相对原生主题与上游桌宠多什么，安装与资源成本归谁？](#detail-section-14)
  - [Q05 · 怎样有限试用，哪个改进最值得先证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢鲸鱼画风的本机DSH用户，先主题单独后可选Windows状态宠物。见 [Q01](#research-q01)。

DSH原生亮暗主题；需要状态伴侣时另用已有dafeiyu等桌宠。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 纸面主题 | 亮暗美术/背景 | DOM/CSS合同与偏好 |
| 边框/装饰 | 标记原生UI | 不保证第三方全匹配 |
| 桌宠状态 | 映射多Session | 非任务验收/默认排子Agent |
| 启停配置 | 管道进程管理 | 按钮off非已退出 |
| 布局/诊断 | 本机偏好与排障 | 退出后文件留存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 子包0.1.1/Node>=22.19/Cordis^4.0.1 | 声明 | Host/插件 | 根workspace非安装目标 |
| sessions/settings/configEditor/schemastery | Host必需 | 事件与配置 | 不保证启动 |
| Web slots/React/Host CSS模块 | 主题必需 | 渲染与DOM识别 | 升级/其他主题可能冲突 |
| Windows10/11 x64/包内EXE | 原生宠物默认范围 | Qt窗口 | 其他平台默认禁helper |
| PySide6==6.11.2/Pillow==12.3.0 | Python开发可选 | 源码运行 | 正常EXE不另装Python |
| 可信helper/素材权利 | 宠物/分发前提 | 本机执行/美术 | sha文件非运行验签 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立profile装子目录/备份布局 | 先enabled=false |
| 主题 | 亮暗/小窗口/长消息 | 输入与控件不遮挡 |
| 可选宠物 | Windows虚构todo | READY/归属/状态分开核 |
| 关闭 | 配置保存→SHUTDOWN/kill | 不只看快捷按钮off |
| 恢复 | 看diagnostic/Host日志 | 关宠物回原生 |
| 退出 | 移主题/核进程/按需清布局 | 不清DSH会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/备份资源费未知 | profile/素材/视觉核查 | 先仅主题 |
| 持续使用 | Qt/DOM/动画CPU内存未知 | HostCSS/事件升级维护 | 无模型链非零资源 |
| 失败恢复 | 重启资源/诊断磁盘未知 | 核READY/配置/Qt | 快捷off不证明停 |
| 退出 | 布局/诊断可能留存 | 核进程/恢复界面 | 需另清本地文件 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 主题 | 亮暗/标记/背景恢复 | 视觉可读/多主题兼容 |
| 状态 | 全局事件映射优先级 | 真实任务正确/当前窗口归属 |
| 配置 | loopback/Host/Origin检查 | Host值校验/跨窗口 |
| 进程 | READY/心跳/重启/stop | EXE一致/Qt主线程健康 |
| 本地持久 | 原子layout/diagnostic | 共享目录竞争/净收益 |

> **思考**：快捷开关乐观不等已停；全局Session摘要/布局诊断留存，PONG不证明Qt渲染；EXE未验签/运行。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：美术/DOM主题适配与当前DSH配置接线，上游状态机/Qt/Host能力继承应扣除。见 [Q04](#research-q04)。

显式生命周期/管道背压/启动诊断有用，但配置与进程状态需要分别回执。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

快捷开关乐观不等已停；全局Session摘要/布局诊断留存，PONG不证明Qt渲染；EXE未验签/运行。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先禁宠物试主题，可选Windows再核归属/ready/退出；失配回原生界面。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

主题/配置/事件reducer/Node进程到Python关键链已核；未运行目标/EXE或验视觉。

- 已检查：作者 README、包清单、源码路径 maid-whale-webui/NOTICE、maid-whale-webui/README.md、maid-whale-webui/package.json、maid-whale-webui/requirements.txt、maid-whale-webui/runtime/helper.py、maid-whale-webui/runtime/layout_store.py、maid-whale-webui/src/client/companion-settings.ts、maid-whale-webui/src/client/config-writes.ts、maid-whale-webui/src/client/frames.ts、maid-whale-webui/src/client/index.ts、maid-whale-webui/src/client/ornaments.ts、maid-whale-webui/src/host/companion-reducer.js、maid-whale-webui/src/host/helper-process.js、maid-whale-webui/src/host/windows-helper-env.js、maid-whale-webui/src/index.ts 及固定范围 inventory；组件：maid-whale-webui。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核子插件Client主题/frames/ornaments/config、Host reducer/helper launch/queue/restart/stop与固定Python协议/布局关键路径；未全审绘制/动画、二进制/所有CSS视觉，未运行目标。
- 下一步：独立profile先主题后Windows五条件，未执行。

**分析版本**

- **仓库**：[yunxiiQwQ/dsh-maid-whale-UI](https://github.com/yunxiiQwQ/dsh-maid-whale-UI)
- **版本号**：0.1.1（[固定提交 1678a16](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/tree/1678a1640a21705ca5f3520e2a81892e4616bd33)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用READY/配置回执区分保存、ready、Session归属与已关，并失败回滚，五条件证伪。见 [Q05](#research-q05)。

独立profile先主题后Windows五条件，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 4576 | 4356 | 197 | — |
| .md | source | 2 | 282 | — | — | 2373 |
| .mjs | source | 6 | 260 | 241 | 4 | — |
| .ts | source | 14 | 1921 | 1680 | 119 | — |
| .ts | test | 20 | 2683 | 2383 | 37 | — |
| .tsx | test | 1 | 107 | 95 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：主题撤回、事件到helper显示、配置授权/进程退出与本地数据边界如何成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主题和设置怎样实际进入DSH，关闭是否完整恢复？

**研究主题**：场景与需求、功能与机制

#### 完整回答

本组件是可安装主题插件，面向喜欢鲸鱼海洋纸面风格的DSH Web/桌面用户；基线是原生亮暗主题或单独桌宠。合格是阅读/输入仍清楚、切亮暗/窗口尺度不遮控制、禁用后可恢复；美术偏好不等任务生产力。根workspace另是资源入口，本题只把maid-whale-webui计为运行组件。

Client apply给body加主题标记，内嵌背景按data-ds-dark-theme切换，窄宽阈值960影响装饰。sidebar通过role=tree及宽度上溯选surface，frames/ornaments根据DOM与CSS模块类识别目标，Mutation/Resize与requestAnimationFrame合批刷新。它是实际样式和DOM层，不改模型请求，也不能由模板结构推断所有第三方UI都会正确匹配。浏览器改title/favicon，检测dshDesktopBoot时保留桌面原生chrome。

工作区鲸鱼按钮与插件设置卡走本地config endpoint，write queue在单Client串行PATCH，设置卡保存失败标unavailable。快捷按钮则乐观先翻，失败保留本地状态，不能将按钮off当helper已停；初始GET晚到也未用patchSeq防覆盖。设置只控制桌宠，主题仍保持；Host enabled默认true，想只用皮肤需另关桌宠。

Client teardown断observer/listener/RAF，dispose边框/装饰、移按钮/favicon/body标记并还原自己保存的背景属性，title仍等于皮肤名才恢复。并非对其他主题协同事务，Frame变量清理直接remove而不还原先前同名值；同页后来的其他主题改背景可能被旧快照覆盖。实际视觉/输入可用性及反复挂卸未运行验。

#### 证据与依据

**依据 1 · 源码核查**：[maid-whale-webui/src/client/index.ts:29-50](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/index.ts#L29-L50)

主题标记/桌面chrome区别。

<details>
<summary>查看原文（22行）</summary>

```text
export const inject = ['slots']

/** Apply the cloud-paper theme and register a complete retraction lifecycle. */
export function apply(ctx: Context): void {
  const body = document.body
  const originalTitle = document.title
  const previous = new Map<string, string>()
  for (const property of BACKDROP_PROPERTIES) {
    previous.set(property, body.style.getPropertyValue(property))
  }

  body.setAttribute(BODY_ATTR, '')
  body.style.setProperty('--dsw-paper-grain', PAPER_GRAIN)

  if (!isDesktopShell()) {
    const favicon = document.createElement('link')
    favicon.rel = 'icon'
    favicon.type = 'image/webp'
    favicon.href = MASCOT_ART
    favicon.dataset.deepseekWorkshopIcon = ''
    document.head.append(favicon)
  }
```

</details>

**依据 2 · 源码核查**：[maid-whale-webui/src/client/index.ts:96-122](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/index.ts#L96-L122)

快捷开关乐观写。

<details>
<summary>查看原文（27行）</summary>

```text
  let petEnabled = true
  let petPatchSeq = 0
  const syncPetToggle = (): void => {
    petToggle.dataset.petOn = petEnabled ? 'on' : 'off'
    petToggle.setAttribute('aria-pressed', String(petEnabled))
    petToggle.title = petEnabled ? '鲸鱼桌宠：开（点击关闭）' : '鲸鱼桌宠：关（点击开启）'
  }
  const patchPetEnabled = async (next: boolean): Promise<void> => {
    const seq = ++petPatchSeq
    petEnabled = next
    syncPetToggle()
    try {
      const config = (await writeCompanionConfig({ enabled: next })) as { enabled?: boolean }
      if (seq === petPatchSeq) {
        petEnabled = config.enabled !== false
      }
    } catch {
      // Host unreachable: keep the optimistic state; the next click retries.
    }
    if (seq === petPatchSeq) syncPetToggle()
  }
  petToggle.addEventListener('click', () => {
    void patchPetEnabled(!petEnabled)
  })
  const syncPetTogglePosition = (): void => {
    const footerClass = cssModuleClass(
      document,
```

</details>

**依据 3 · 源码核查**：[maid-whale-webui/src/client/index.ts:149-180](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/index.ts#L149-L180)

初始GET及亮暗背景。

<details>
<summary>查看原文（32行）</summary>

```text
  if (typeof fetch === 'function') {
    void fetch('/plugins/maid-whale-webui/config', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((config: { enabled?: boolean } | null) => {
        if (!config) return
        petEnabled = config.enabled !== false
        syncPetToggle()
      })
      .catch(() => {})
  }

  const ornaments = createOrnamentController(body, { wide: media?.matches ?? true })
  const frames = createFrameController(body)
  const setBackdrop = (): void => {
    const dark = body.hasAttribute('data-ds-dark-theme')
    const mode = dark ? 'dark' : 'light'
    const haze = dark
      ? 'linear-gradient(135deg, rgba(39, 56, 70, 0.64), rgba(46, 65, 79, 0.7) 52%, rgba(53, 75, 88, 0.66))'
      : 'linear-gradient(135deg, rgba(250, 247, 238, 0.58), rgba(250, 247, 238, 0.66) 52%, rgba(237, 242, 235, 0.6))'
    const paper = dark ? PAPER_BACKDROP_DARK : PAPER_BACKDROP_LIGHT
    body.style.setProperty('background-image', `${PAPER_GRAIN}, ${haze}, url("${ILLUSTRATED_BACKGROUND}"), ${paper}`)
    body.style.setProperty(
      'background-position',
      'left top, center, calc(50% + 140px) calc(50% - 60px), center, center, center',
    )
    body.style.setProperty('background-size', '192px 192px, cover, cover, cover, cover, cover')
    body.style.setProperty('background-attachment', 'fixed')
    body.style.setProperty('background-repeat', 'repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat')
    ornaments.setMode(mode)
    frames.setMode(mode)
  }

```

</details>

**依据 4 · 源码核查**：[maid-whale-webui/src/client/index.ts:195-241](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/index.ts#L195-L241)

合批观察与真实撤回。

<details>
<summary>查看原文（47行）</summary>

```text
    return window.setTimeout(() => callback(performance.now()), 0)
  }
  const cancelChromeFrame = (handle: number): void => {
    if (typeof window.cancelAnimationFrame === 'function') window.cancelAnimationFrame(handle)
    else window.clearTimeout(handle)
  }
  const scheduleChrome = (): void => {
    if (chromeFrame != null) return
    chromeFrame = requestChromeFrame(() => {
      chromeFrame = undefined
      syncChrome()
    })
  }
  const chromeObserver = new MutationObserver(scheduleChrome)
  chromeObserver.observe(body, { childList: true, subtree: true })
  window.addEventListener('resize', scheduleChrome)

  setBackdrop()
  if (!isDesktopShell()) document.title = SKIN_TITLE
  registerCompanionSettingsCard(ctx)

  const observer = new MutationObserver(setBackdrop)
  observer.observe(body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })
  media?.addEventListener('change', syncViewport)

  ctx.effect(
    () => () => {
      frames.dispose()
      ornaments.dispose()
      observer.disconnect()
      chromeObserver.disconnect()
      if (chromeFrame != null) cancelChromeFrame(chromeFrame)
      media?.removeEventListener('change', syncViewport)
      window.removeEventListener('resize', scheduleChrome)
      clearSidebarSurface()
      body.removeAttribute(BODY_ATTR)
      document.querySelector('link[data-deepseek-workshop-icon]')?.remove()
      petToggle.remove()
      for (const [property, value] of previous) {
        if (value === '') body.style.removeProperty(property)
        else body.style.setProperty(property, value)
      }
      if (document.title === SKIN_TITLE) document.title = originalTitle
    },
    'ui-skin-maid-whale-webui: cloud paper surface',
  )
}
```

</details>

**依据 5 · 源码核查**：[maid-whale-webui/src/client/frames.ts:374-423](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/frames.ts#L374-L423)

frame观察/清理。

<details>
<summary>查看原文（50行）</summary>

```text
  const schedule = (): void => {
    if (disposed || frame != null) return
    frame = requestFrame(() => {
      frame = undefined
      sync()
    })
  }

  const observer = new MutationObserver((mutations) => {
    if (mutationNeedsScan(mutations)) schedule()
  })
  observer.observe(body, {
    attributes: true,
    attributeFilter: [
      'aria-hidden',
      'aria-selected',
      'class',
      'data-variant',
      'disabled',
      'hidden',
      'open',
      'role',
      'style',
      'type',
    ],
    childList: true,
    subtree: true,
  })

  syncResources()
  sync()

  return {
    sync,
    setMode(nextMode) {
      if (disposed) return
      mode = nextMode
      syncResources()
      sync()
    },
    dispose() {
      if (disposed) return
      disposed = true
      if (frame != null) cancelFrame(frame)
      observer.disconnect()
      clearMarkers()
      for (const property of Object.values(FRAME_PROPERTIES)) body.style.removeProperty(property)
    },
  }
}
```

</details>

**依据 6 · 源码核查**：[maid-whale-webui/src/client/ornaments.ts:189-232](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/ornaments.ts#L189-L232)

装饰生命周期。

<details>
<summary>查看原文（44行）</summary>

```text
  const mutationObserver = new MutationObserver((mutations) => {
    const externalMutations = mutations.filter((mutation) => !layer.contains(mutation.target))
    if (mutationNeedsScan(externalMutations)) schedule()
  })
  mutationObserver.observe(body, {
    attributes: true,
    attributeFilter: ['aria-hidden', 'aria-selected', 'class', 'hidden', 'open', 'role', 'style'],
    childList: true,
    subtree: true,
  })

  const eventTypes = ['focusin', 'focusout', 'input', 'transitionend'] as const
  eventTypes.forEach((type) => {
    body.addEventListener(type, schedule)
  })
  window.addEventListener('scroll', schedule, true)
  window.addEventListener('resize', schedule)

  return {
    sync,
    setMode(nextMode) {
      mode = nextMode
      sync()
    },
    setWide(nextWide) {
      wide = nextWide
      sync()
    },
    dispose() {
      if (disposed) return
      disposed = true
      if (frame != null) cancelFrame(frame)
      mutationObserver.disconnect()
      resizeObserver?.disconnect()
      eventTypes.forEach((type) => {
        body.removeEventListener(type, schedule)
      })
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      clearTargetMarkers()
      layer.remove()
    },
  }
}
```

</details>

**依据 7 · 源码核查**：[maid-whale-webui/src/client/config-writes.ts:1-24](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/config-writes.ts#L1-L24)

单实例串行PATCH。

<details>
<summary>查看原文（24行）</summary>

```text
export type CompanionConfigPatch = Record<string, unknown>

export function createConfigWriteQueue(endpoint: string, fetcher?: typeof fetch) {
  let tail: Promise<unknown> = Promise.resolve()
  return (patch: CompanionConfigPatch): Promise<Record<string, unknown>> => {
    const execute = async () => {
      const response = await (fetcher ?? fetch)(endpoint, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!response.ok) throw new Error(`settings write failed: ${response.status}`)
      return (await response.json()) as Record<string, unknown>
    }
    const result = tail.then(execute, execute)
    tail = result.then(
      () => undefined,
      () => undefined,
    )
    return result
  }
}

export const writeCompanionConfig = createConfigWriteQueue('/plugins/maid-whale-webui/config')
```

</details>

**依据 8 · 源码核查**：[maid-whale-webui/src/client/companion-settings.ts:122-158](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/companion-settings.ts#L122-L158)

卡片读取/失败状态。

<details>
<summary>查看原文（37行）</summary>

```text
    React.useEffect(() => {
      let active = true
      fetch(CONFIG_ENDPOINT, { cache: 'no-store' })
        .then(async (response) => {
          if (!response.ok) throw new Error(`settings request failed: ${response.status}`)
          return (await response.json()) as CompanionConfig
        })
        .then((next) => {
          if (active) {
            setValue(next)
            setStatus('ready')
          }
        })
        .catch(() => {
          if (active) setStatus('unavailable')
        })
      return () => {
        active = false
        for (const timer of sliderTimers.current.values()) clearTimeout(timer)
        sliderTimers.current.clear()
      }
    }, [])
    const write = async (field: string, next: unknown) => {
      const seq = ++patchSeq.current
      setValue((prev) => ({ ...prev, [field]: next }))
      setBusy(true)
      try {
        const updated = (await writeCompanionConfig({ [field]: next })) as CompanionConfig
        if (seq === patchSeq.current) {
          setValue(updated)
          setStatus('ready')
        }
      } catch {
        if (seq === patchSeq.current) setStatus('unavailable')
      } finally {
        if (seq === patchSeq.current) setBusy(false)
      }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH事件怎样变成原生宠物状态，进程失败/退出怎样处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host需sessions/settings/configEditor，默认enabled=true、includeSubagents=false。mount启动HelperProcess与CompanionReducer，并在全局session/event和session/disposed订阅中catch错误，避免可选宠物异常打断其他监听。Reducer按turn/start/assistant/tool/approval/todo/turn-end映射思考/工作/等待/错误/短成功，多会话优先等待>错误>工作>思考>空闲，同优先级最近更新；工具活动由名字规则猜，不是执行诊断。maxSessions默认256且优先逐出idle；没有重放所有已有Session状态，重挂初始IDLE到新事件才更新。

Node通过stdin/stdout JSONL protocolVersion1与helper通信。Windows x64优先包内EXE，WSL可固定PowerShell表达式取env路径启动Windows EXE；其他平台无显式Python配置时禁helper，主题可继续。允许受信helper.command/args配置自定义程序，未见运行前校验随包sha256或签名，不能当任意不可信helper沙箱。启动spawn后等待READY（默认60秒），收到才flush snapshot；STATE/TASK/CONFIG按kind合并只保留最新，非持久事件队列默认64丢旧，名为durable实际在内存，不是磁盘重放日志。

READY后5秒PING、默认至少12秒且通常15秒无PONG就kill重启；启动失败最多5次，ready后崩溃则可持续重启。stderr启动诊断最多4096字符写本机JSON，Low完整性临时目录失败会查安全标签再用LocalLow重试一次。stop发送SHUTDOWN/关闭stdin并最多10秒kill，是异步尽力停，不返回已退出确认。用户Qt菜单退出发CLOSED使该bridge不再重启，隐藏窗口只是hide，不停Host。

补读固定Git中Python（加入正式source_paths）核到parse协议、Qt apply state/pulse/config、stdin线程PING→PONG与EOF退出，布局flush后结束；可选event-log录JSON，snapshot仅抓宠物自身窗口，不是屏幕截图。PONG在线程中回复，不能证明Qt主线程仍能渲染；源码符合协议意图，不认证EXE与源码一致或运行窗口已出现。

#### 证据与依据

**依据 1 · 源码核查**：[maid-whale-webui/src/index.ts:13-45](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/index.ts#L13-L45)

默认开关/硬依赖。

<details>
<summary>查看原文（33行）</summary>

```text
const PKG_VERSION = '0.1.1'

export const name = '@yunxii/dsh-client-ui-skin-maid-whale-webui'
// The companion is built on session events, and mounting requires the settings
// service (used to read live config). Keep the declared inject in sync with
// those real hard dependencies instead of listing a service that is never
// consumed directly.
export const inject = ['sessions', 'settings', 'configEditor']
export const CONFIG_ENDPOINT = '/plugins/maid-whale-webui/config'
export const Config = Schema.object({
  enabled: Schema.boolean().default(true).description('启用鲸鱼桌宠'),
  scale: Schema.number().min(0.4).max(1.4).step(0.0001).default(0.6552).role('slider').description('角色大小'),
  bubbleScale: Schema.number().min(0.6).max(1.2).step(0.01).default(0.78).role('slider').description('气泡大小'),
  activityLevel: Schema.union([
    Schema.const('quiet').description('安静'),
    Schema.const('normal').description('标准'),
    Schema.const('lively').description('活泼'),
  ])
    .default('normal')
    .description('空闲微动作频率'),
  reducedMotion: Schema.boolean().default(false).description('减少走动、循环帧和程序化晃动'),
  bubbleMode: Schema.union([
    Schema.const('always').description('常驻显示'),
    Schema.const('hidden').description('完全隐藏'),
    Schema.const('custom').description('自定义显示状态'),
  ])
    .default('always')
    .description('气泡显示模式'),
  bubbleStates: Schema.array(Schema.string())
    .default(['SUCCESS', 'ERROR', 'WAITING'])
    .description('自定义模式下显示气泡的状态'),
  includeSubagents: Schema.boolean().default(false).description('允许子 Agent 抢占宠物状态'),
}).description('由 DeepSeek Harness 状态驱动的鲸鱼桌宠')
```

</details>

**依据 2 · 源码核查**：[maid-whale-webui/src/index.ts:307-354](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/index.ts#L307-L354)

启动/全局监听与catch。

<details>
<summary>查看原文（48行）</summary>

```text
              : (config.webuiUrl ?? process.env.DSH_DAFEIYU_WEBUI_URL ?? 'http://127.0.0.1:3080/'),
          ),
        },
      },
      logger as unknown as Console,
    )
    reducer = new CompanionReducer({ includeSubagents: resolved.includeSubagents === true })
    bridge.start()
    bridge.send(
      createMessage(CompanionMessageKind.HELLO, {
        state: CompanionState.IDLE,
        host: 'deepseek-harness',
        pluginVersion: PKG_VERSION,
        message: 'Cloud whale connected to DSH',
      }),
    )
    bridge.send(
      createMessage(CompanionMessageKind.STATE, {
        state: CompanionState.IDLE,
        phase: 'plugin-start',
        stage: '等待任务',
        message: '鲸鲸在这儿等新任务哦',
        detail: 'DSH · 等待下一次任务',
      }),
    )
    logger.info?.('maid-whale companion bridge started')
  }

  startRuntime(settings.get())

  // The companion intentionally observes every DSH session. Loader entries may
  // live inside a scoped composition, so use the unscoped root bus and dispose
  // the registrations explicitly with this plugin's lifecycle.
  // Never let an exception from this optional companion escape into the shared
  // session bus: a throw here could stop every other subscriber from seeing
  // the event, which would look exactly like "installing the pet broke other
  // plugins".
  const offEvent = eventCtx.on(
    'session/event',
    ((session: unknown, event: unknown) => {
      if (!bridge || !reducer) return
      try {
        for (const message of reducer.handle(session, event)) bridge.send(message)
      } catch (error) {
        logger.error?.('maid-whale companion failed to handle session event', error)
      }
    }) as (...args: never[]) => void,
    { global: true },
```

</details>

**依据 3 · 源码核查**：[maid-whale-webui/src/host/companion-reducer.js:185-278](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/companion-reducer.js#L185-L278)

真实事件映射。

<details>
<summary>查看原文（94行）</summary>

```text
  handle(session, event) {
    if (!event || typeof event.type !== 'string') return []
    const subagent = isSubagent(session)
    if (!this.includeSubagents && subagent) return []

    const sessionId = sessionIdOf(session)
    const record = this.#record(sessionId)
    record.subagent = subagent
    record.lastSeq = Number(event.seq ?? record.lastSeq)
    record.project = projectNameOf(session, event) ?? record.project

    switch (event.type) {
      case 'turn/start':
        record.turnActive = true
        record.openTools.clear()
        record.waitingCallId = undefined
        record.waitingApprovalId = undefined
        record.task = undefined
        record.progress = undefined
        this.#update(record, CompanionState.THINKING, {
          phase: 'turn-start',
          stage: '准备阶段',
          message: statusCopy('preparing', event.seq),
        })
        return this.#render()

      case 'step/start':
      case 'assistant/chunk':
      case 'assistant/message':
        if (!record.turnActive || record.openTools.size > 0) return []
        if (record.state === CompanionState.THINKING && record.payload.phase === 'thinking') return []
        this.#update(record, CompanionState.THINKING, {
          phase: 'thinking',
          stage: '分析阶段',
          message: statusCopy('thinking', event.seq),
        })
        return this.#render()

      case 'tool/call': {
        const callId = toolCallIdOf(event, `seq-${String(event.seq ?? 'unknown')}`)
        const name = String(event.data?.name ?? event.data?.message?.name ?? 'tool')
        record.openTools.set(callId, name)
        if (isUserQuestionTool(name)) {
          record.waitingCallId = callId
          this.#update(record, CompanionState.WAITING, {
            phase: 'user-question',
            stage: '等待确认',
            toolName: name,
            message: statusCopy('waiting', event.seq),
          })
          return this.#render()
        }
        const activity = toolActivity(name)
        this.#update(record, CompanionState.WORKING, {
          phase: 'tool-call',
          activity,
          stage: activityStage(activity),
          toolName: name,
          message: activityCopy(activity, event.seq),
        })
        return this.#render()
      }

      case 'tool/result':
        return this.#toolResult(record, event)

      case 'user/message':
        return this.#userMessage(record, event)

      case 'todo/write':
        return this.#todo(record, event)

      case 'turn/end':
        return this.#turnEnd(record, event)

      case 'approval/asked': {
        const id = String(event.data?.id ?? '')
        const toolName = String(event.data?.toolName ?? 'approval')
        record.waitingApprovalId = id
        this.#update(record, CompanionState.WAITING, {
          phase: 'approval',
          stage: '等待审批',
          toolName,
          message: statusCopy('approval', event.seq),
        })
        return this.#render()
      }

      case 'approval/decided':
        return this.#approvalDecided(record, event)

      default:
        return []
    }
```

</details>

**依据 4 · 源码核查**：[maid-whale-webui/src/host/companion-reducer.js:163-177](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/companion-reducer.js#L163-L177)

默认子Agent过滤/256会话。

<details>
<summary>查看原文（15行）</summary>

```text
  constructor({ includeSubagents = false, maxSessions = 256 } = {}) {
    this.includeSubagents = includeSubagents
    this.sessions = new Map()
    this.maxSessions = maxSessions
    this.clock = 0
    this.selectedSessionId = undefined
    this.outputSignature = undefined
    this.tasksSignature = undefined
  }

  setIncludeSubagents(value) {
    const includeSubagents = value === true
    if (includeSubagents === this.includeSubagents) return []
    this.includeSubagents = includeSubagents
    if (!includeSubagents) {
```

</details>

**依据 5 · 源码核查**：[maid-whale-webui/src/host/companion-reducer.js:443-501](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/companion-reducer.js#L443-L501)

会话上限/多会话选择。

<details>
<summary>查看原文（59行）</summary>

```text
  #record(sessionId) {
    let record = this.sessions.get(sessionId)
    if (record) return record
    record = {
      id: sessionId,
      state: CompanionState.IDLE,
      payload: { phase: 'session-created', message: 'DSH 空闲中' },
      turnActive: false,
      openTools: new Map(),
      waitingCallId: undefined,
      waitingApprovalId: undefined,
      task: undefined,
      progress: undefined,
      project: undefined,
      subagent: false,
      lastSeq: -1,
      updatedAt: ++this.clock,
    }
    this.sessions.set(sessionId, record)
    // DSH normally disposes sessions, but never rely on it: cap the map so a
    // host that stops emitting `session/disposed` cannot leak memory forever.
    // The freshly-inserted record is still IDLE at this point, so keep it and
    // evict the oldest existing idle record (or the oldest overall).
    if (this.sessions.size > this.maxSessions && this.maxSessions > 0) this.#evictSessions(record)
    return record
  }

  #evictSessions(keep) {
    const records = [...this.sessions.values()].filter((record) => record !== keep)
    const idle = records
      .filter((record) => record.state === CompanionState.IDLE)
      .sort((left, right) => left.updatedAt - right.updatedAt)
    const victim = idle[0] ?? records.sort((left, right) => left.updatedAt - right.updatedAt)[0]
    if (victim) this.sessions.delete(victim.id)
  }

  #update(record, state, payload) {
    record.state = state
    record.payload = payload
    record.updatedAt = ++this.clock
  }

  #select() {
    const records = [...this.sessions.values()]
    if (records.length === 0) {
      return {
        record: {
          id: 'dsh-host',
          state: CompanionState.IDLE,
          payload: { phase: 'no-session', message: 'DSH 空闲中' },
          updatedAt: ++this.clock,
        },
      }
    }
    records.sort((left, right) => {
      const priority = (statePriority[right.state] ?? 0) - (statePriority[left.state] ?? 0)
      return priority || right.updatedAt - left.updatedAt || left.id.localeCompare(right.id)
    })
    return { record: records[0] }
```

</details>

**依据 6 · 源码核查**：[maid-whale-webui/src/host/helper-process.js:63-94](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/helper-process.js#L63-L94)

平台解析。

<details>
<summary>查看原文（32行）</summary>

```text
function resolveHelperLaunch({
  platform,
  arch = process.arch,
  isWslEnv,
  bundledPath,
  helperPath,
  pythonEnv,
  headless = false,
  fileExists = existsSync,
  windowsPath = toWindowsPath,
  powerShellExe = defaultPowerShellExe,
}) {
  const supportsBundledHelper = arch === 'x64' && (platform === 'win32' || (platform === 'linux' && isWslEnv))
  if (platform === 'win32' && supportsBundledHelper && fileExists(bundledPath)) {
    return { command: bundledPath, args: [] }
  }
  if (platform === 'linux' && isWslEnv && supportsBundledHelper && !headless && fileExists(bundledPath)) {
    // npm archives created on Windows store ordinary files as 0644. Launching
    // the EXE directly from WSL can therefore fail with EACCES. PowerShell
    // opens the Windows path without relying on the Linux executable bit and
    // keeps stdin/stdout attached for the companion protocol. The fixed
    // expression contains no path text, so shell metacharacters stay inert.
    return {
      command: powerShellExe(),
      args: ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', '& $env:DSH_DAFEIYU_HELPER_EXE'],
      env: { DSH_DAFEIYU_HELPER_EXE: windowsPath(bundledPath) },
    }
  }
  if (!supportsBundledHelper && !pythonEnv) return undefined
  const command = pythonEnv || (platform === 'win32' ? 'py' : 'python3')
  return { command, args: defaultArgs(command, helperPath) }
}
```

</details>

**依据 7 · 源码核查**：[maid-whale-webui/src/host/helper-process.js:151-188](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/helper-process.js#L151-L188)

自定义启动/进程管道。

<details>
<summary>查看原文（38行）</summary>

```text
      const headless = this.options.headless ?? process.env.DSH_DAFEIYU_HEADLESS === '1'
      const helperPath = this.options.helperPath || defaultHelperPath
      const launch = this.options.command
        ? { command: this.options.command, args: defaultArgs(this.options.command, helperPath) }
        : defaultLaunch(headless)
      if (!launch) {
        this.restartSuppressed = true
        this.logger.info?.('companion helper is disabled on this platform')
        return undefined
      }
      command = launch.command
      const args = this.options.args || launch.args
      const extraArgs = []
      const eventLog = this.options.eventLog || process.env.DSH_DAFEIYU_EVENT_LOG
      const snapshot = this.options.snapshot || process.env.DSH_DAFEIYU_SNAPSHOT
      if (headless) extraArgs.push('--headless')
      if (eventLog) extraArgs.push('--event-log', eventLog)
      if (snapshot) extraArgs.push('--snapshot', snapshot)

      env = { ...process.env, ...this.options.env, ...launch.env }
      // Recheck after a crash/restart: a replaced EXE may have a different label.
      if (this.recoveryEnv) this.recoveryEnv = lowIntegrityEnvironment(command, env)
      Object.assign(env, this.recoveryEnv)
      this.#recordDiagnostic({
        command,
        startedAt: new Date().toISOString(),
        temp: env.TMP || env.TEMP,
        readyAt: undefined,
        exitCode: undefined,
        signal: undefined,
        error: undefined,
      })
      child = spawn(command, [...args, ...extraArgs], {
        cwd: this.options.cwd || packageRoot,
        env,
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true,
      })
```

</details>

**依据 8 · 源码核查**：[maid-whale-webui/src/host/helper-process.js:279-296](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/helper-process.js#L279-L296)

内存合并/排队。

<details>
<summary>查看原文（18行）</summary>

```text
  send(message) {
    if (this.stopping || this.restartSuppressed) return
    const line = encodeMessage(message)
    const durable = DURABLE_MESSAGE_KINDS.has(message.kind)
    if (durable) this.snapshot.set(message.kind, line)
    if (
      !this.child ||
      !this.spawned ||
      !this.child.stdin.writable ||
      this.child.stdin.destroyed ||
      this.child.stdin.writableNeedDrain
    ) {
      if (durable) this.pending.set(message.kind, line)
      else this.#enqueue(line)
      return
    }
    this.child.stdin.write(line)
  }
```

</details>

**依据 9 · 源码核查**：[maid-whale-webui/src/host/helper-process.js:208-261](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/helper-process.js#L208-L261)

READY超时和Low恢复。

<details>
<summary>查看原文（54行）</summary>

```text
    child.once('spawn', () => {
      const startupTimeoutMs = this.options.startupTimeoutMs ?? 60000
      this.startupTimer = setTimeout(() => {
        if (this.child === child && !this.spawned) {
          this.logger.warn?.('companion helper readiness timed out')
          this.#recordDiagnostic({ error: 'readiness timed out' })
          child.kill()
        }
      }, startupTimeoutMs)
      this.startupTimer.unref?.()
    })
    child.once('error', (error) => {
      this.logger.error?.(`companion helper failed to start: ${error.message}`)
      this.#recordDiagnostic({ error: error.message })
      if (this.child !== child) return
      this.child = undefined
      this.spawned = false
      this.#clearHeartbeat()
      this.#clearStartupTimer()
      if (!this.stopping && !this.restartSuppressed) {
        this.#countStartFailure(`spawn error: ${error.message}`)
      }
    })
    // close follows stderr EOF, so even a fast bootloader failure is available
    // before deciding whether to retry with the Low-integrity environment.
    child.once('close', (code, signal) => {
      if (this.child !== child) return
      this.child = undefined
      const wasReady = this.spawned
      this.spawned = false
      this.#clearHeartbeat()
      this.#clearStartupTimer()
      this.#recordDiagnostic({ exitCode: code, signal })
      if (!this.stopping && !this.restartSuppressed) {
        if (!wasReady) {
          if (process.platform === 'win32' && tempDirectoryFailed && !this.recoveryAttempted) {
            this.recoveryAttempted = true
            try {
              this.recoveryEnv = lowIntegrityEnvironment(command, env)
              if (this.recoveryEnv) {
                this.#recordDiagnostic({ recovery: 'low-integrity-temp' })
                this.logger.info?.('companion helper has a Low integrity label; retrying with LocalLow storage')
                this.#scheduleRestart()
                return
              }
            } catch (error) {
              this.#recordDiagnostic({ recoveryError: error.message })
              this.logger.warn?.(`companion helper integrity check failed: ${error.message}`)
            }
          }
          // The helper never became ready during this attempt (crashed before
          // READY or timed out). Count it as a failed start so a broken
          // helper cannot restart forever.
          this.#countStartFailure(`exited before ready (code=${String(code)}, signal=${String(signal)})`)
```

</details>

**依据 10 · 源码核查**：[maid-whale-webui/src/host/windows-helper-env.js:50-72](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/windows-helper-env.js#L50-L72)

Low标签检查后设置LocalLow。

<details>
<summary>查看原文（23行）</summary>

```text
export function lowIntegrityEnvironment(executable, env) {
  const output = execFileSync(
    join(process.env.SystemRoot || 'C:\\Windows', 'System32/WindowsPowerShell/v1.0/powershell.exe'),
    ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', inspectLabel],
    {
      env: { ...process.env, DSH_HELPER_INSPECT_PATH: executable },
      encoding: 'utf8',
      windowsHide: true,
      timeout: 10000,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  ).trim()
  const localLow = output ? JSON.parse(output) : null
  if (!localLow) return undefined
  const directory = join(localLow, 'DSH', 'maid-whale-webui')
  const temp = join(directory, 'temp')
  mkdirSync(temp, { recursive: true })
  return {
    TMP: temp,
    TEMP: temp,
    DSH_DAFEIYU_LAYOUT_PATH: env.DSH_DAFEIYU_LAYOUT_PATH || join(directory, 'layout.json'),
  }
}
```

</details>

**依据 11 · 源码核查**：[maid-whale-webui/src/host/helper-process.js:309-369](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/helper-process.js#L309-L369)

停止/READY/PONG/CLOSED。

<details>
<summary>查看原文（61行）</summary>

```text
  stop(reason = 'plugin-disposed') {
    this.stopping = true
    this.#clearHeartbeat()
    if (this.restartTimer) clearTimeout(this.restartTimer)
    this.restartTimer = undefined
    const child = this.child
    if (!child) return
    this.pending.clear()
    this.queue = [encodeMessage(createMessage(CompanionMessageKind.SHUTDOWN, { reason }))]
    this.#flushOutgoing()
    const timer = setTimeout(() => {
      if (this.child === child) child.kill()
    }, this.options.shutdownTimeoutMs ?? 10000)
    timer.unref?.()
  }

  #enqueue(line) {
    const limit = Math.max(0, this.options.maxQueuedMessages ?? 64)
    if (limit === 0) return
    this.queue.push(line)
    if (this.queue.length > limit) this.queue.splice(0, this.queue.length - limit)
  }

  #flushOutgoing() {
    const child = this.child
    if (!this.spawned || !child?.stdin.writable || child.stdin.destroyed || child.stdin.writableNeedDrain) return
    // A false write result means the line was accepted, but subsequent lines
    // must wait for drain. Coalesce durable updates while that pipe is full.
    for (const [kind, line] of this.pending) {
      this.pending.delete(kind)
      if (!child.stdin.write(line)) return
    }
    while (this.queue.length) {
      if (!child.stdin.write(this.queue.shift())) return
    }
    if (this.stopping) this.#endInput(child)
  }

  #handleReply(line) {
    if (!line.trim()) return
    try {
      const reply = JSON.parse(line)
      if (reply?.protocolVersion === 1 && reply.kind === CompanionMessageKind.READY) {
        if (this.spawned) return
        this.spawned = true
        this.#recordDiagnostic({ readyAt: new Date().toISOString(), exitCode: undefined, signal: undefined })
        this.startFailures = 0
        this.lastPongAt = Date.now()
        this.#clearStartupTimer()
        this.pending = new Map(this.stopping ? [] : this.snapshot)
        this.#flushOutgoing()
        if (!this.stopping) this.#startHeartbeat()
        return
      }
      if (reply?.protocolVersion === 1 && reply.kind === CompanionMessageKind.PONG) {
        this.lastPongAt = Date.now()
        return
      }
      if (reply?.protocolVersion === 1 && reply.kind === CompanionMessageKind.CLOSED) {
        this.restartSuppressed = true
        return
```

</details>

**依据 12 · 源码核查**：[maid-whale-webui/src/host/helper-process.js:377-426](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/helper-process.js#L377-L426)

心跳/失败上限/重启。

<details>
<summary>查看原文（50行）</summary>

```text
  #startHeartbeat() {
    const heartbeatMs = this.options.heartbeatMs ?? 5000
    if (heartbeatMs <= 0) return
    const timeoutMs = this.options.heartbeatTimeoutMs ?? Math.max(heartbeatMs * 3, 12000)
    this.heartbeatTimer = setInterval(() => {
      const child = this.child
      if (!child || !this.spawned) return
      if (Date.now() - this.lastPongAt > timeoutMs) {
        this.logger.warn?.('companion helper heartbeat timed out')
        child.kill()
        return
      }
      this.send(createMessage(CompanionMessageKind.PING))
    }, heartbeatMs)
    this.heartbeatTimer.unref?.()
  }

  #clearHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer)
    this.heartbeatTimer = undefined
  }

  #clearStartupTimer() {
    if (this.startupTimer) clearTimeout(this.startupTimer)
    this.startupTimer = undefined
  }

  #countStartFailure(reason) {
    this.startFailures += 1
    const maxFailures = this.options.maxStartFailures ?? 5
    if (this.startFailures >= maxFailures) {
      this.restartSuppressed = true
      this.queue.length = 0
      this.logger.error?.(`companion helper failed to start ${this.startFailures} times; giving up (${reason})`)
      return
    }
    this.logger.warn?.(
      `companion helper failed to start; scheduling restart (${this.startFailures}/${maxFailures}) (${reason})`,
    )
    this.#scheduleRestart()
  }

  #scheduleRestart() {
    if (this.restartTimer || this.stopping || this.restartSuppressed) return
    const delay = this.options.restartDelayMs ?? 750
    this.restartTimer = setTimeout(() => {
      this.restartTimer = undefined
      this.start()
    }, delay)
    this.restartTimer.unref?.()
```

</details>

**依据 13 · 源码核查**：[maid-whale-webui/runtime/helper.py:281-346](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/runtime/helper.py#L281-L346)

Qt消费状态与自身诊断帧。

<details>
<summary>查看原文（66行）</summary>

```text

        def apply_message(self, message: dict[str, Any]) -> None:
            recorder.record(message)
            kind = message.get("kind")
            if kind == "shutdown":
                QApplication.quit()
                return
            previous_frame = self.model.frame
            previous_clip = self.model.active_clip_name
            if kind == "task":
                self.task = str(message.get("task", ""))
                self._show_status(
                    str(message.get("message", self.task)),
                    str(message.get("detail", "")),
                    self.model.base_state,
                    None if self.model.base_state in {"THINKING", "WORKING", "WAITING", "ERROR"} else 6000,
                )
            elif kind == "tasks":
                raw_tasks = message.get("tasks")
                self.tasks = raw_tasks if isinstance(raw_tasks, list) else []
                self._sync_bubble_size()
            elif kind == "config":
                self._apply_config(message)
            elif kind in {"state", "pulse"}:
                state = str(message.get("state", "IDLE"))
                self.display_state = state
                if kind == "pulse":
                    ttl_ms = max(250, int(message.get("ttlMs", 1800)))
                    resume_state = str(message.get("resumeState", self.model.base_state))
                    self.model.apply_pulse(
                        state,
                        ttl_ms,
                        self._now_ms(),
                        resume_state,
                        message.get("resumeActivity"),
                    )
                    self._show_status(
                        str(message.get("resumeMessage", self.LABELS.get(resume_state, resume_state))),
                        str(message.get("resumeDetail", "")),
                        resume_state,
                        None if resume_state in {"THINKING", "WORKING", "WAITING", "ERROR"} else ttl_ms + 2200,
                    )
                    self._show_overlay(
                        str(message.get("message", self.LABELS.get(state, state))),
                        str(message.get("detail", "")),
                        state,
                        ttl_ms,
                    )
                    if state in {"SUCCESS", "ERROR"}:
                        self._notify_alert(state)
                else:
                    activity = None if self.reduced_motion else message.get("activity")
                    self.model.apply_state(state, activity)
                    self._clear_overlay()
                    persistent = state in {"THINKING", "WORKING", "WAITING", "ERROR"}
                    self._show_status(
                        str(message.get("message", self.LABELS.get(state, state))),
                        str(message.get("detail", "")),
                        state,
                        None if persistent else 4200,
                    )
            self._sync_frame_transition(previous_frame, previous_clip)
            self._sync_bubble_size()
            self.update()
            if snapshot_path is not None and not self.snapshot_saved:
                QTimer.singleShot(180, self._save_snapshot)
```

</details>

**依据 14 · 源码核查**：[maid-whale-webui/runtime/helper.py:75-90](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/runtime/helper.py#L75-L90)

协议版本和state验证。

<details>
<summary>查看原文（16行）</summary>

```text
    message = json.loads(line)
    if not isinstance(message, dict):
        raise ValueError("message must be an object")
    if message.get("protocolVersion") != PROTOCOL_VERSION:
        raise ValueError("unsupported protocol version")
    kind = message.get("kind")
    if kind in {"state", "pulse"} and message.get("state") not in STATES:
        raise ValueError("unsupported companion state")
    return message


def emit_reply(kind: str, **payload: Any) -> None:
    print(
        json.dumps(
            {"protocolVersion": PROTOCOL_VERSION, "kind": kind, "timestamp": int(time.time() * 1000), **payload},
            ensure_ascii=False,
```

</details>

**依据 15 · 源码核查**：[maid-whale-webui/runtime/helper.py:1049-1086](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/runtime/helper.py#L1049-L1086)

打开URL/隐藏/退出/读线程与EOF。

<details>
<summary>查看原文（38行）</summary>

```text
            elif selected == open_webui_action:
                QDesktopServices.openUrl(QUrl(self.webui_url))
            elif selected == hide_action:
                self.hide()
            elif selected == exit_action:
                self._save_layout()
                emit_reply("closed", reason="user")
                QApplication.quit()

    application = QApplication(sys.argv[:1])
    application.setQuitOnLastWindowClosed(False)
    inbox = Inbox()
    window = CompanionWindow()
    inbox.message.connect(window.apply_message)
    inbox.closed.connect(application.quit)

    def read_stdin() -> None:
        for line in sys.stdin:
            if not line.strip():
                continue
            try:
                message = parse_message(line)
                if message.get("kind") == "ping":
                    emit_reply("pong")
                inbox.message.emit(message)
            except (ValueError, json.JSONDecodeError) as error:
                print(json.dumps({"kind": "error", "message": str(error)}), flush=True)
        inbox.closed.emit()

    reader = threading.Thread(target=read_stdin, name="dsh-bigfish-stdin", daemon=True)
    reader.start()
    window.show()
    emit_reply("ready")
    code = application.exec()
    try:
        window.layout_saver.flush()
    except OSError as error:
        print(f"Unable to save BigFish layout: {error}", file=sys.stderr)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地配置和状态内容有哪些身份、持久与隐私边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

配置HTTP要求socket为三种loopback、Host为localhost/127.0.0.1/[::1]并可带端口，若有Origin必须同Host，拒DNS重绑定外域；无Origin的受信同机请求仍可GET/PATCH，不是浏览器用户/租户认证。PATCH限8192字节和默认字段名，但本函数不直接校验值类型/数值范围，依赖Settings/schema或configEditor；fallback先await edit再更新内存，持久成功不等helper ready。单Client写队列非跨标签锁，原生宠物菜单的布局持久与Host配置是两个真相面，重启env可能重新覆盖本机菜单偏好。

全局事件含多个Session，默认过滤subagent不按当前窗口/用户任务过滤；宠物只显示选择状态不是完整成功验收。Reducer会把project目录最后段、todo.content当前任务/进度与Session ID送helper，bubbleMode hidden只隐藏显示，不阻止Node→helper数据传输；因此“只响应事件”不等无敏感数据。日志默认不录对话全文，但显式eventLog会保存协议中的这些摘要。持久layout保存位置/缩放/气泡偏好，默认DSH_HOME/dsh-dafeiyu或LOCALAPPDATA同名目录，与上游目录名共享可能互相覆盖；原子replace+fsync和线程锁是单进程保存保障，不是跨helper事务。

诊断包含本机路径/启动stderr，分享须按实际内容审；不介入模型请求不代表整个包零进程/零磁盘副作用。现有Python不见新增监听端口，打开DSH走QDesktopServices指定URL，但自定义helper/环境和打包EXE信任独立。未全审Qt绘制/动画所有分支，未运行Windows EXE或做二进制到源码可复现匹配，不能认证“无截图/遥测”的二进制全行为。禁用/卸载会尝试停进程但layout、diagnostic、显式eventLog/snapshot不会主动删除；退出不等清空本机资料。

快捷off失败仍显示off、Host仅日志started不等READY，且ready后崩溃重启无总上限，会使使用者误以为状态已应用。多会话等待/错误可长期压住其他任务，名字启发式可能误分类；把成功短动画当真实任务正确属于误用。

#### 证据与依据

**依据 1 · 源码核查**：[maid-whale-webui/src/index.ts:170-231](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/index.ts#L170-L231)

loopback/Host/Origin和PATCH边界。

<details>
<summary>查看原文（62行）</summary>

```text
function isLoopback(address: string | undefined): boolean {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
}

async function readPatch(req: ServerRequestLike): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []
  let bytes = 0
  const body = req as AsyncIterable<Buffer>
  for await (const chunk of body) {
    bytes += chunk.length
    if (bytes > 8192) throw new Error('request body is too large')
    chunks.push(Buffer.from(chunk))
  }
  const value = JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('patch must be an object')
  const allowed = new Set(Object.keys(defaults))
  if (Object.keys(value).some((key) => !allowed.has(key))) throw new Error('patch contains an unknown setting')
  return value as Record<string, unknown>
}

export function createConfigHandler(
  settings: SettingsScope,
): (req: ServerRequestLike, res: ServerResponseLike) => Promise<void> {
  return async (req, res) => {
    if (!isLoopback(req.socket?.remoteAddress)) {
      jsonResponse(res, 403, { error: 'local access only' })
      return
    }
    // Origin and Host can both name an attacker-controlled domain after DNS
    // rebinding. Require a loopback authority before comparing the two.
    if (!/^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(req.headers?.host ?? '')) {
      jsonResponse(res, 403, { error: 'untrusted host' })
      return
    }
    const origin = req.headers?.origin
    if (origin) {
      let originHost: string | undefined
      try {
        originHost = new URL(origin).host
      } catch {}
      if (!originHost || originHost !== req.headers?.host) {
        jsonResponse(res, 403, { error: 'origin mismatch' })
        return
      }
    }
    if (req.method === 'GET') {
      jsonResponse(res, 200, settings.get())
      return
    }
    if (req.method !== 'PATCH') {
      jsonResponse(res, 405, { error: 'method not allowed' })
      return
    }
    try {
      const patch = await readPatch(req)
      await settings.update?.(patch)
      jsonResponse(res, 200, settings.get())
    } catch (error) {
      jsonResponse(res, 400, { error: error instanceof Error ? error.message : String(error) })
    }
  }
}
```

</details>

**依据 2 · 源码核查**：[maid-whale-webui/src/index.ts:125-146](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/index.ts#L125-L146)

fallback先持久配置再通知。

<details>
<summary>查看原文（22行）</summary>

```text
function localSettingsScope(value: CompanionConfig, ctx: MinimalContext): SettingsScope {
  let listener: ((next: CompanionConfig) => void) | undefined
  return {
    get: () => value,
    watch: (nextListener) => {
      listener = nextListener
      return () => {
        listener = undefined
      }
    },
    update: async (patch) => {
      const entryId = ctx.fiber?.entry?.options.id
      const entry = ctx.configEditor?.entries().find((entry) => entry.options.id === entryId)
      if (!entry || !ctx.configEditor) throw new Error('companion settings require a DSH plugin entry')
      // Persist first, then notify the running companion if this scope survived
      // Loader reconciliation. Disposal clears the listener of an old scope.
      await ctx.configEditor.edit(entry, (raw) => ({ ...raw, ...patch }))
      Object.assign(value, patch)
      listener?.(value)
    },
  }
}
```

</details>

**依据 3 · 源码核查**：[maid-whale-webui/src/index.ts:356-408](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/index.ts#L356-L408)

禁用/配置变更与生命周期。

<details>
<summary>查看原文（53行）</summary>

```text
  const offDisposed = eventCtx.on('session/disposed', ((session: unknown) => {
    if (!bridge || !reducer) return
    try {
      for (const message of reducer.disposeSession(session)) bridge.send(message)
    } catch (error) {
      logger.error?.('maid-whale companion failed to dispose session', error)
    }
  }) as (...args: never[]) => void)

  const unwatch = settings.watch((next) => {
    // Disabling is the only path that tears the helper down. Every other
    // setting is applied live through a CONFIG message, so sliders never
    // restart the pet. Starting a previously-disabled runtime is debounced
    // to avoid spawning repeatedly while settings settle.
    if (next.enabled === false) {
      if (restartTimer) {
        clearTimeout(restartTimer)
        restartTimer = undefined
      }
      stopRuntime('settings-change')
      return
    }
    if (!bridge) {
      scheduleRestart(next)
      return
    }
    if (restartTimer) {
      clearTimeout(restartTimer)
      restartTimer = undefined
    }
    applyLiveSettings(next)
  })
  if (typeof ctx.inject === 'function') {
    ctx.inject(['webServer'], (webCtx) => {
      const server = webCtx as unknown as WebServerService
      server.effect(
        () =>
          server.webServer.register({ kind: 'exact', path: CONFIG_ENDPOINT, handler: createConfigHandler(settings) }),
        'maid-whale-webui: local companion settings endpoint',
      )
    })
  }
  ctx.effect?.(
    () => () => {
      if (restartTimer) clearTimeout(restartTimer)
      restartTimer = undefined
      offEvent?.()
      offDisposed?.()
      unwatch()
      stopRuntime('dsh-host-stop')
    },
    'ui-skin-maid-whale-webui: companion lifecycle',
  )
```

</details>

**依据 4 · 源码核查**：[maid-whale-webui/src/host/companion-reducer.js:113-160](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/companion-reducer.js#L113-L160)

项目/任务详情。

<details>
<summary>查看原文（48行）</summary>

```text
  if (!text) return undefined
  const pathParts = text.split(/[\\/]/u).filter(Boolean)
  const candidate = pathParts.length > 1 ? pathParts.at(-1) : text
  return candidate.replace(/\s+/gu, ' ').slice(0, 40) || undefined
}

function projectNameOf(session, event) {
  // Prefer the freshest "what am I working on" signal. The session header
  // (title/name/cwd) is frozen when the session starts, so after a project
  // folder is renamed mid-run the header still reports the old path/name while
  // the live working directory (or the step's own cwd/projectName) already
  // points at the new folder. Keeping the stale header at the front is why the
  // bubble kept showing the old name. Order: explicit step projectName, the
  // session's live cwd, then progressively older cwd snapshots, and only then
  // the human labels which can lag behind a rename.
  const candidates = [
    event?.data?.projectName,
    session?.cwd,
    session?.context?.cwd,
    session?.header?.cwd,
    event?.data?.cwd,
    session?.title,
    session?.name,
    session?.header?.title,
    session?.header?.name,
  ]
  return candidates.map(cleanProjectName).find(Boolean)
}

function progressOf(todos) {
  if (!Array.isArray(todos) || todos.length === 0) return undefined
  const completed = todos.filter((todo) => ['completed', 'complete', 'done'].includes(todo?.status)).length
  const currentIndex = todos.findIndex((todo) => todo?.status === 'in_progress')
  return {
    completed,
    total: todos.length,
    current: currentIndex >= 0 ? currentIndex + 1 : undefined,
  }
}

function detailFor(record, stage = record.payload.stage) {
  const parts = []
  if (record.project) parts.push(record.project)
  if (record.progress?.total) parts.push(`已完成 ${record.progress.completed}/${record.progress.total} 步`)
  if (record.task) parts.push(record.task)
  else if (stage) parts.push(stage)
  return parts.join(' · ') || stage || 'DSH 任务'
}
```

</details>

**依据 5 · 源码核查**：[maid-whale-webui/src/host/companion-reducer.js:351-377](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/companion-reducer.js#L351-L377)

todo文本送helper。

<details>
<summary>查看原文（27行）</summary>

```text
  #todo(record, event) {
    const todos = Array.isArray(event.data?.todos) ? event.data.todos : []
    const current =
      todos.find((todo) => todo?.status === 'in_progress') ?? todos.find((todo) => todo?.status === 'pending')
    const progress = progressOf(todos)
    if (!current?.content && !progress) return []
    const nextTask = current?.content ? String(current.content) : record.task
    const unchanged =
      nextTask === record.task &&
      progress?.completed === record.progress?.completed &&
      progress?.total === record.progress?.total
    if (unchanged) return []
    record.task = nextTask
    record.progress = progress
    record.updatedAt = ++this.clock
    const selection = this.#select()
    if (selection.record.id !== record.id) return this.#render(selection)
    return this.#withTasks([
      createMessage(CompanionMessageKind.TASK, {
        sessionId: record.id,
        sourceSeq: event.seq,
        task: record.task,
        progress: record.progress,
        project: record.project,
        message: taskCopy(record.task),
        detail: detailFor(record, '执行阶段'),
      }),
```

</details>

**依据 6 · 源码核查**：[maid-whale-webui/src/host/companion-reducer.js:505-560](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/companion-reducer.js#L505-L560)

多会话摘要消息。

<details>
<summary>查看原文（56行）</summary>

```text
    const messages = []
    const signature = this.#signature(selection.record)
    if (signature !== this.outputSignature) {
      this.#remember(selection)
      messages.push(
        createMessage(CompanionMessageKind.STATE, {
          sessionId: selection.record.id,
          state: selection.record.state,
          ...selection.record.payload,
          task: selection.record.task,
          progress: selection.record.progress,
          project: selection.record.project,
          detail: detailFor(selection.record),
        }),
      )
    }
    messages.push(...this.#taskMessages())
    return messages
  }

  #taskMessages() {
    const tasks = this.#activeTaskList()
    if (tasks.length < 2) {
      if (this.tasksSignature !== undefined) {
        this.tasksSignature = undefined
        return [createMessage(CompanionMessageKind.TASKS, { tasks: [] })]
      }
      return []
    }
    const signature = tasks
      .map((task) =>
        [task.sessionId, task.state, task.project ?? '', task.task ?? '', task.message ?? '', task.detail ?? ''].join(
          '|',
        ),
      )
      .join('~')
    if (signature === this.tasksSignature) return []
    this.tasksSignature = signature
    return [createMessage(CompanionMessageKind.TASKS, { tasks })]
  }

  #activeTaskList() {
    return [...this.sessions.values()]
      .filter((record) => record.state !== CompanionState.IDLE && record.state !== CompanionState.DISCONNECTED)
      .sort((left, right) => {
        const priority = (statePriority[right.state] ?? 0) - (statePriority[left.state] ?? 0)
        return priority || right.updatedAt - left.updatedAt || left.id.localeCompare(right.id)
      })
      .map((record) => ({
        sessionId: record.id,
        state: record.state,
        project: record.project,
        task: record.task,
        message: record.payload.message,
        detail: detailFor(record),
      }))
```

</details>

**依据 7 · 源码核查**：[maid-whale-webui/runtime/layout_store.py:27-90](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/runtime/layout_store.py#L27-L90)

默认布局路径/原子保存。

<details>
<summary>查看原文（64行）</summary>

```text

def default_layout_path() -> Path:
    override = os.environ.get("DSH_DAFEIYU_LAYOUT_PATH")
    if override:
        return Path(override)
    dsh_home = os.environ.get("DSH_HOME")
    if dsh_home:
        return Path(dsh_home) / "dsh-dafeiyu" / "layout.json"
    local_app_data = os.environ.get("LOCALAPPDATA")
    if local_app_data:
        return Path(local_app_data) / "DSH" / "dsh-dafeiyu" / "layout.json"
    return Path.home() / ".dsh" / "dsh-dafeiyu" / "layout.json"


def normalise_layout(value: Any) -> dict[str, Any]:
    layout = dict(DEFAULT_LAYOUT)
    if not isinstance(value, dict):
        return layout
    for key in ("x", "y", "petX", "petY"):
        coordinate = value.get(key)
        if isinstance(coordinate, int) and not isinstance(coordinate, bool):
            layout[key] = coordinate
    scale = value.get("scale")
    if isinstance(scale, (int, float)) and not isinstance(scale, bool):
        layout["scale"] = min(1.4, max(0.4, float(scale)))
    bubble_scale = value.get("bubbleScale")
    if isinstance(bubble_scale, (int, float)) and not isinstance(bubble_scale, bool):
        layout["bubbleScale"] = min(1.2, max(0.6, float(bubble_scale)))
    if isinstance(value.get("reducedMotion"), bool):
        layout["reducedMotion"] = value["reducedMotion"]
    if value.get("bubbleMode") in {"always", "hidden", "custom"}:
        layout["bubbleMode"] = value["bubbleMode"]
    if isinstance(value.get("bubbleStates"), list):
        layout["bubbleStates"] = [str(state) for state in value["bubbleStates"] if isinstance(state, str)]
    return layout


def load_layout(path: Path) -> dict[str, Any]:
    try:
        return normalise_layout(json.loads(path.read_text(encoding="utf-8")))
    except (OSError, ValueError):
        return dict(DEFAULT_LAYOUT)


def save_layout(path: Path, value: dict[str, Any]) -> None:
    layout = normalise_layout(value)
    path.parent.mkdir(parents=True, exist_ok=True)
    handle, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(handle, "w", encoding="utf-8", newline="\n") as stream:
            json.dump(layout, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary_name, path)
    finally:
        try:
            Path(temporary_name).unlink()
        except FileNotFoundError:
            pass


class DeferredLayoutSaver:
    def __init__(
```

</details>

**依据 8 · 源码核查**：[maid-whale-webui/runtime/helper.py:95-113](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/runtime/helper.py#L95-L113)

可选事件记录。

<details>
<summary>查看原文（19行）</summary>

```text

class EventRecorder:
    def __init__(self, path: Path | None) -> None:
        self.path = path
        self._stream: TextIO | None = None
        if path is not None:
            path.parent.mkdir(parents=True, exist_ok=True)
            self._stream = path.open("a", encoding="utf-8")

    def record(self, message: dict[str, Any]) -> None:
        if self._stream is None:
            return
        self._stream.write(json.dumps(message, ensure_ascii=False) + "\n")
        self._stream.flush()

    def close(self) -> None:
        if self._stream is not None:
            self._stream.close()

```

</details>

**依据 9 · 源码核查**：[maid-whale-webui/src/host/helper-process.js:268-305](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/helper-process.js#L268-L305)

启动stderr诊断保存。

<details>
<summary>查看原文（38行）</summary>

```text
    createInterface({ input: child.stdout }).on('line', (line) => this.#handleReply(line))
    createInterface({ input: child.stderr }).on('line', (line) => {
      if (line.trim()) this.logger.warn?.(`companion helper: ${line}`)
      if (!this.spawned) {
        tempDirectoryFailed ||= /\[PYI-\d+:ERROR\] Could not create temporary directory!/.test(line)
        this.#recordDiagnostic({ stderr: `${this.diagnostic.stderr}${line}\n`.slice(-4096) })
      }
    })
    return child
  }

  send(message) {
    if (this.stopping || this.restartSuppressed) return
    const line = encodeMessage(message)
    const durable = DURABLE_MESSAGE_KINDS.has(message.kind)
    if (durable) this.snapshot.set(message.kind, line)
    if (
      !this.child ||
      !this.spawned ||
      !this.child.stdin.writable ||
      this.child.stdin.destroyed ||
      this.child.stdin.writableNeedDrain
    ) {
      if (durable) this.pending.set(message.kind, line)
      else this.#enqueue(line)
      return
    }
    this.child.stdin.write(line)
  }

  #recordDiagnostic(fields) {
    Object.assign(this.diagnostic, fields)
    if (!this.diagnosticPath) return
    try {
      mkdirSync(dirname(this.diagnosticPath), { recursive: true })
      writeFileSync(this.diagnosticPath, `${JSON.stringify(this.diagnostic, null, 2)}\n`)
    } catch (error) {
      this.logger.warn?.(`companion helper diagnostic could not be saved: ${error.message}`)
```

</details>

**依据 10 · 源码核查**：[maid-whale-webui/src/client/index.ts:103-121](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/index.ts#L103-L121)

快捷失败仍乐观。

<details>
<summary>查看原文（19行）</summary>

```text
  const patchPetEnabled = async (next: boolean): Promise<void> => {
    const seq = ++petPatchSeq
    petEnabled = next
    syncPetToggle()
    try {
      const config = (await writeCompanionConfig({ enabled: next })) as { enabled?: boolean }
      if (seq === petPatchSeq) {
        petEnabled = config.enabled !== false
      }
    } catch {
      // Host unreachable: keep the optimistic state; the next click retries.
    }
    if (seq === petPatchSeq) syncPetToggle()
  }
  petToggle.addEventListener('click', () => {
    void patchPetEnabled(!petEnabled)
  })
  const syncPetTogglePosition = (): void => {
    const footerClass = cssModuleClass(
```

</details>

#### 缺口

- Host配置校验/授权、Windows真实启动/停机、EXE内容与源码一致性及视觉可用性未验。
  **影响**：不能保证按钮状态等进程状态、多用户隔离或二进制零出站；没有发生事故证据。
  **进一步探讨**：隔离Windows profile核失败PATCH/ready超时/Qt卡住/禁用退出/双窗口与布局残留，另核发行签名/构建。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 相对原生主题与上游桌宠多什么，安装与资源成本归谁？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

贡献主要是鲸鱼美术、纸面亮暗配色/手绘边框与DOM适配，加上将上游dafeiyu桌宠换形象并接当前DSH配置/事件。NOTICE明确Node伴侣/Python runtime来自QCYTSN/dsh-dafeiyu MIT，不能把状态机/Qt生命周期都算新创；原生主题加独立状态窗是直接替代。原图/角色素材来源与生成说明不自动授予第三方名称/形象权利，代码BSD-3-Clause不能概括素材所有权。

子包@yunxii/dsh-client-ui-skin-maid-whale-webui0.1.1，根workspace0.1.0另计。Node>=22.19、Cordis^4.0.1，静态import schemastery、Client需slots/HostCSS与React。Windows10/11 x64可用包内helper，源码Python需PySide6==6.11.2和Pillow==12.3.0；包manifest列EXE及sha256，固定Git有对应路径，但运行不自动检hash，没启动/验签。本次统计主要JS/TS/MD不包含Python全语言规模。

首次按正确web/desktop profile装子目录而非根，完全退出旧Host、备份布局，先设enabled=false只核亮暗/字体/点击/卸载，再单独Windows桌宠。持续成本有EXE/Qt内存与动画绘制、DOM扫描、磁盘布局/诊断和兼容维护，现金/工时未测；无新增模型链不等零资源。失败看READY/diagnostic和Host日志，关宠物或回原生主题；卸载需确认进程真正退出并按需清布局/诊断，而不删DSH会话。

同用户完成同DSH任务，仅显示/陪伴方式改变，未核任务分工/交接责任、新业务验收或受限群体准入；也未改变服务供给/计价/资源组织结构，不把界面入口、常驻进程或潜在舒适度计经济创新。

#### 证据与依据

**依据 1 · 源码核查**：[maid-whale-webui/package.json:1-21](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/package.json#L1-L21)

子插件版本与Web入口。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "name": "@yunxii/dsh-client-ui-skin-maid-whale-webui",
  "description": "Whale-maid theme for DeepSeek Harness desktop and Web UI with a native Windows companion",
  "version": "0.1.1",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./skin.json": "./skin.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[maid-whale-webui/package.json:40-57](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/package.json#L40-L57)

许可/仓库目录/Cordis。

<details>
<summary>查看原文（18行）</summary>

```text
  "license": "BSD-3-Clause",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yunxiiQwQ/dsh-maid-whale-UI.git",
    "directory": "maid-whale-webui"
  },
  "homepage": "https://github.com/yunxiiQwQ/dsh-maid-whale-UI#readme",
  "bugs": {
    "url": "https://github.com/yunxiiQwQ/dsh-maid-whale-UI/issues"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "packageManager": "pnpm@11.21.0",
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  },
```

</details>

**依据 3 · 源码核查**：[maid-whale-webui/package.json:86-95](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/package.json#L86-L95)

随包runtime/EXE清单。

<details>
<summary>查看原文（10行）</summary>

```text
    "README.md",
    "README.en.md",
    "LICENSE",
    "NOTICE",
    "runtime/__init__.py",
    "runtime/animation_model.py",
    "runtime/helper.py",
    "runtime/layout_store.py",
    "runtime/bin/win32-x64/dsw-drool-helper.exe",
    "runtime/bin/win32-x64/dsw-drool-helper.exe.sha256",
```

</details>

**依据 4 · 源码核查**：[maid-whale-webui/package.json:123-125](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/package.json#L123-L125)

实际Node声明。

```text
  "engines": {
    "node": ">=22.19"
  }
```

**依据 5 · 源码核查**：[maid-whale-webui/NOTICE:16-29](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/NOTICE#L16-L29)

素材不授第三方权利及上游继承。

<details>
<summary>查看原文（14行）</summary>

```text
This notice records the immediate development sources. It does not grant or
imply a license for third-party artwork, names, or marks depicted by them.

Desktop companion integration
-----------------------------

The desktop companion in `src/host/`, `src/index.ts`, `runtime/`, and
`scripts/build-helper.ps1` is vendored from QCYTSN/dsh-dafeiyu (MIT License,
https://github.com/QCYTSN/dsh-dafeiyu) and rebranded for this skin. The
companion's idle artwork is the first idle cell from the user's local
`deepseek-drool` Codex spritesheet, preserved at its original pixel scale.
The other 19 action poses were generated with OpenAI ImageGen using that
idle cell as the character reference, then fitted to the companion canvas.
None of the original dafeiyu character assets are redistributed here.
```

</details>

**依据 6 · 源码核查**：[maid-whale-webui/requirements.txt:1-2](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/requirements.txt#L1-L2)

Python真实依赖。

```text
PySide6==6.11.2
Pillow==12.3.0
```

**依据 7 · 源码核查**：[maid-whale-webui/README.md:23-27](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/README.md#L23-L27)

作者平台前提。

```text
### 环境要求

- 可正常运行的 DSH（DeepSeek Harness）桌面端或 Web UI。
- Windows 10/11 x64：原生桌宠仅支持 Windows；单独使用 Web UI 主题不受此限制。
- 无需另外安装 Python 或 Node：桌宠帮助程序已包含在插件包中。
```

**依据 8 · 源码核查**：[maid-whale-webui/README.md:37-84](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/README.md#L37-L84)

正确profile与诊断/卸载流程。

<details>
<summary>查看原文（48行）</summary>

````text
### 桌面端安装

完全退出 DSH（包括托盘进程），在可使用 DSH CLI 的终端中执行：

```powershell
git clone https://github.com/yunxiiQwQ/dsh-maid-whale-UI.git
cd dsh-maid-whale-UI
dsh plugin --profile desktop add ./maid-whale-webui
```

随后从桌面快捷方式打开 DeepSeek Harness。桌面端和 Web 端使用独立的 profile。桌宠菜单中的 **打开 DSH** 会通过 `dsh://open` 唤起桌面窗口，无需配置固定的本地端口。

### Web 端安装

```powershell
# 1. 完全退出 DSH（包括托盘进程）
# 2. 克隆仓库并添加插件
git clone https://github.com/yunxiiQwQ/dsh-maid-whale-UI.git
cd dsh-maid-whale-UI
dsh plugin --profile web add ./maid-whale-webui

# 3. 启动 DSH Web UI
dsh --profile web
```

主题会在启动后自动应用，桌宠也会自动出现。若桌宠未显示，请前往 **设置 → 插件 → 插件配置 → 鲸鱼桌宠** 检查启用开关。工作区面板右下角的鲸鱼按钮也可即时启停桌宠；同一时间建议只启用一个界面主题。

Windows 下，若 helper 因 Low 完整性标签无法创建临时目录，插件会检测标签并自动使用 `%USERPROFILE%\AppData\LocalLow\DSH\maid-whale-webui` 重试；该目录也用于保存桌宠布局。显式配置的 `DSH_DAFEIYU_LAYOUT_PATH` 仍优先使用，需指向 Low 进程可写的位置。

启动诊断保存在 `%LOCALAPPDATA%\DSH\maid-whale-webui\helper-startup.json`，每次启用桌宠时覆盖，记录程序路径、启动时间、ready 状态、退出码及最多 4096 字符的启动 stderr。排查启动失败时可将该文件附到 issue；其中包含本机路径，分享前可遮盖用户名。

### 更新与卸载

```powershell
# 更新任一版本：完全退出 DSH，在仓库目录拉取最新版本，再重新打开
git pull

# 卸载：先完全退出 DSH
# 桌面端
dsh plugin --profile desktop remove @yunxii/dsh-client-ui-skin-maid-whale-webui

# Web 端
dsh plugin --profile web remove @yunxii/dsh-client-ui-skin-maid-whale-webui
```

## Pet 动作和触发

| 动作 | 触发条件 |
````

</details>

#### 缺口

- 同版本安装/动画资源/多主题冲突与视觉收益未测，素材授权需具体用途另核。
  **影响**：不能推荐持续安装或声称更高生产效率/完全无负担。
  **进一步探讨**：与原生主题+无宠物比较阅读遮挡/操控错误/资源与退出，素材共享前核权利。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样有限试用，哪个改进最值得先证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可条件试用：偏好此画风的本机DSH用户在独立profile装子包，先在配置中关闭桌宠，只验证亮暗、输入、长消息与小窗口，禁用后核原背景/标题/控件可恢复。相对原生主题多美术与装饰，对不在意外观者没有必须采用理由。Windows桌宠单独先用虚构todo观察等待/错误/完成、失败PATCH和真实进程退出；快捷off或动画不能代替Host配置/任务验收，出现遮挡、状态失真或退出残留就关宠物并回原生主题。

可证伪方向是复用已有READY/PONG/CLOSED与配置回执，向设置卡呈现“配置已保存/进程ready/显示来自哪个Session/已关闭”的分别状态，并给快捷按钮失败回滚；不重造宠物协议。依据是现有HTTP只返回配置，界面乐观off与实际进程断开，global reducer又会选择其他会话。最小对照含写失败、helper不ready、Qt主线程卡住但pong、双会话优先级、关闭超时五条件，测关闭误判/错误任务归属与排障步骤。若Host已有统一本机进程状态面则直接复用；若只要皮肤，无需新状态面，保留禁宠物主题更简单。

#### 证据与依据

**依据 1 · 源码核查**：[maid-whale-webui/src/client/index.ts:103-121](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/client/index.ts#L103-L121)

快捷回滚方向。

<details>
<summary>查看原文（19行）</summary>

```text
  const patchPetEnabled = async (next: boolean): Promise<void> => {
    const seq = ++petPatchSeq
    petEnabled = next
    syncPetToggle()
    try {
      const config = (await writeCompanionConfig({ enabled: next })) as { enabled?: boolean }
      if (seq === petPatchSeq) {
        petEnabled = config.enabled !== false
      }
    } catch {
      // Host unreachable: keep the optimistic state; the next click retries.
    }
    if (seq === petPatchSeq) syncPetToggle()
  }
  petToggle.addEventListener('click', () => {
    void patchPetEnabled(!petEnabled)
  })
  const syncPetTogglePosition = (): void => {
    const footerClass = cssModuleClass(
```

</details>

**依据 2 · 源码核查**：[maid-whale-webui/src/host/helper-process.js:347-369](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/helper-process.js#L347-L369)

现有READY/PONG/CLOSED。

<details>
<summary>查看原文（23行）</summary>

```text
  #handleReply(line) {
    if (!line.trim()) return
    try {
      const reply = JSON.parse(line)
      if (reply?.protocolVersion === 1 && reply.kind === CompanionMessageKind.READY) {
        if (this.spawned) return
        this.spawned = true
        this.#recordDiagnostic({ readyAt: new Date().toISOString(), exitCode: undefined, signal: undefined })
        this.startFailures = 0
        this.lastPongAt = Date.now()
        this.#clearStartupTimer()
        this.pending = new Map(this.stopping ? [] : this.snapshot)
        this.#flushOutgoing()
        if (!this.stopping) this.#startHeartbeat()
        return
      }
      if (reply?.protocolVersion === 1 && reply.kind === CompanionMessageKind.PONG) {
        this.lastPongAt = Date.now()
        return
      }
      if (reply?.protocolVersion === 1 && reply.kind === CompanionMessageKind.CLOSED) {
        this.restartSuppressed = true
        return
```

</details>

**依据 3 · 源码核查**：[maid-whale-webui/src/host/companion-reducer.js:479-501](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/host/companion-reducer.js#L479-L501)

选择Session可呈现归属。

<details>
<summary>查看原文（23行）</summary>

```text
  #update(record, state, payload) {
    record.state = state
    record.payload = payload
    record.updatedAt = ++this.clock
  }

  #select() {
    const records = [...this.sessions.values()]
    if (records.length === 0) {
      return {
        record: {
          id: 'dsh-host',
          state: CompanionState.IDLE,
          payload: { phase: 'no-session', message: 'DSH 空闲中' },
          updatedAt: ++this.clock,
        },
      }
    }
    records.sort((left, right) => {
      const priority = (statePriority[right.state] ?? 0) - (statePriority[left.state] ?? 0)
      return priority || right.updatedAt - left.updatedAt || left.id.localeCompare(right.id)
    })
    return { record: records[0] }
```

</details>

**依据 4 · 源码核查**：[maid-whale-webui/src/index.ts:215-228](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/src/index.ts#L215-L228)

配置回执非进程状态。

<details>
<summary>查看原文（14行）</summary>

```text
    if (req.method === 'GET') {
      jsonResponse(res, 200, settings.get())
      return
    }
    if (req.method !== 'PATCH') {
      jsonResponse(res, 405, { error: 'method not allowed' })
      return
    }
    try {
      const patch = await readPatch(req)
      await settings.update?.(patch)
      jsonResponse(res, 200, settings.get())
    } catch (error) {
      jsonResponse(res, 400, { error: error instanceof Error ? error.message : String(error) })
```

</details>

#### 缺口

- 候选进程状态UI未实现/用户对照未做。
  **影响**：候选不计当前贡献。
  **进一步探讨**：先核Host已有进程状态面，再做五条件；没有误解收益就保留简单禁宠物方案。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
