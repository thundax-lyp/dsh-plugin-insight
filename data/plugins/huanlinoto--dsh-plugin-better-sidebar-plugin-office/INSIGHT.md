# dsh-better-sidebar-plugin-office

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[fbafdc6](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/tree/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75)

<!-- BEGIN META -->
[![GitHub ★ 63](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=63&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office) [![npm 30d 3,010](https://img.shields.io/static/v1?label=npm+30d&message=3%2C010&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huanlin/dsh-plugin-better-sidebar-plugin-office) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huanlin/dsh-plugin-better-sidebar-plugin-office)
<!-- END META -->

> **功能**：为 better-sidebar 注册 docx、xlsx 和 pptx 侧栏预览，失败时提供原件下载。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持通过稳定viewer描述符复用侧栏路由与设置，将三种Office预览独立分发。收益是依赖边界与查阅流程便利，不证明保真和性能节省。

> **主要限制**：[Q03](#research-q03)最影响价值的限制是渲染ready不代表内容完整，xlsx不保留样式、条件格式和图表，公式交给另一引擎重算。动态import仍在同bundle，客户端参数不证明Host文件隔离。

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
  - [Q01 · 拆分Office预览给谁带来什么增量？](#detail-section-11)
  - [Q02 · 三格式如何从会话文件变成预览并处理失败？](#detail-section-12)
  - [Q03 · 哪些格式与依赖边界决定它只是预览？](#detail-section-13)
  - [Q04 · 谁值得试用，如何避免把成功渲染当内容正确？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供已用better-sidebar的DSH Web用户在会话内查阅Office文件，需对关键数据与版式回原件核对，不作为完整编辑保存或精确核算工具。

相对外部Office减少离开会话步骤，相对旧内置viewer主要是把重依赖拆到按需安装包，底层库能力并非组件原创，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| docx预览与缩放 | 侧栏查阅Word文件 | 依赖docx-preview，不承诺完整版式 |
| xlsx数据预览 | 显示值、公式、合并和尺寸 | 不保留样式、条件格式与图表，公式重算需核对 |
| pptx翻页预览 | 侧栏查看幻灯片 | 有zip限制、取消与销毁，未验复杂素材保真 |
| 原件下载 | 失败或精确查阅时外部打开 | 访问权限由better-sidebar Host承担 |
| viewer注册清理 | 按需拆出Office重依赖 | 需sidebar>=0.6.0，未构建测体积 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web与better-sidebar>=0.6.0 | 必需 | viewer注册和媒体文件路由 | 旧内置同ID可能冲突，缺服务不能预览 |
| locale与React | 客户端必需 | 界面、字典与生命周期 | 包声明不等所有宿主兼容 |
| docx-preview、SheetJS/Univer、pptx-renderer | 各格式必需 | 浏览器解析与渲染 | 渲染失败回原件下载 |
| 原生Office或可信查看器 | 精确保真核对必需 | 复杂样式/图表/公式与原件对照 | 不应用侧栏预览做精确核算验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 接入 | 用户匹配sidebar后装包重启硬刷新 | 三viewer在设置可见，无重复注册 |
| 查阅 | 侧栏媒体URL取会话文件 | 逐格式显示且关键内容与原件一致 |
| 恢复 | 用户下载原件，关闭预览 | 格式失败不反复重开，改用外部查看器 |
| 退出 | 禁用对应viewer或卸载本包 | 核对原生下载/其他viewer仍可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 重库bundle下载资源未知 | 匹配版本、重启与逐格式样本核对 | 作者体积未本次独立测量 |
| 持续 | 完整文件取数、解析/画布资源未测 | 关键内容对照与库升级复核 | 动态import不等下载分包 |
| 失败恢复 | 重新下载/外部查看成本未知 | 禁用viewer并看原件 | 无保存写回链路，不期待修改自动保存 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话内查阅 | 三格式真实注册与渲染 | 实际节时、宿主兼容和权限 |
| 表格数据 | 值、公式文本、合并及尺寸映射 | Excel复杂公式与精确保真 |
| 错误恢复 | 下载与库销毁入口 | 大文件峰值、取消和跨格式可靠性 |

> **思考**：[Q03](#research-q03)最影响价值的限制是渲染ready不代表内容完整，xlsx不保留样式、条件格式和图表，公式交给另一引擎重算。动态import仍在同bundle，客户端参数不证明Host文件隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持通过稳定viewer描述符复用侧栏路由与设置，将三种Office预览独立分发。收益是依赖边界与查阅流程便利，不证明保真和性能节省。

稳定viewer描述符、生命周期dispose/destroy与原件下载减少集成重复；xlsx纯转换函数边界明确。Host权限、同bundle资源和格式重算仍需另核，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)最影响价值的限制是渲染ready不代表内容完整，xlsx不保留样式、条件格式和图表，公式交给另一引擎重算。动态import仍在同bundle，客户端参数不证明Host文件隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

先确认better-sidebar>=0.6.0，用非敏感代表文件逐格式比对关键内容。复杂xlsx图表/样式和公式不能只看侧栏，需原件核对；不期待界面改动写回文件。格式丢失、数值差异或卡顿就下载原件并禁用对应viewer。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认三格式渲染、注册与退路，不等真实宿主、权限或内容保真验收。特征提示是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.tsx、src/client/urls.ts、src/client/office-view.tsx、src/client/PptxView.tsx、src/client/xlsx-to-univer.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查三viewer注册、媒体/下载URL、docx/xlsx/pptx取数渲染与清理、xlsx转换范围和包/构建条件；未检查better-sidebar Host具体权限实现。
- 下一步：未打开真实私人文件，未运行目标代码/库/测试、安装或宿主。没有格式样本视觉验收、资源测量或同条件收益对照。

**分析版本**

- **仓库**：[HuanLinOTO/dsh-plugin-better-sidebar-plugin-office](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office)
- **版本号**：0.1.2（[固定提交 fbafdc6](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/tree/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75)）
- **版本日期**：2026-08-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)提出未验证的文件特征级保真提示，按可靠解析识别不保留内容并引导原件核对。对照误判和查阅耗时，若不降低错误或误报过多则放弃，不是当前能力。

未打开真实私人文件，未运行目标代码/库/测试、安装或宿主。没有格式样本视觉验收、资源测量或同条件收益对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 426210 | 399284 | 31329 | — |
| .md | source | 1 | 68 | — | — | 668 |
| .ts | source | 7 | 862 | 631 | 184 | — |
| .tsx | source | 4 | 546 | 409 | 112 | — |
| .ts | test | 2 | 119 | 100 | 10 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断拆分Office viewer是否适合DSH内查阅，并明确保真、资源与写回边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 拆分Office预览给谁带来什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已经使用better-sidebar、在DSH任务中频繁打开docx/xlsx/pptx查阅的用户。它通过betterSidebar.registerFileViewer注册三个mediaUrl viewer，Host侧apply为空；合格结果是文件在侧栏可读、错误能下载原件，而不是创建、修改和保存Office文档。相对下载后另开Office，它减少离开会话的步骤；相对旧better-sidebar内置viewer，本组件主要改变分发与依赖边界，而非新增三种渲染算法。

README说明重渲染库拆出后不需要Office的人可不装，实际client入口确实从本包导入三个viewer并注册。底层docx-preview、SheetJS/Univer与pptx-renderer提供格式能力，不应把其保真能力归为包装原创。作者给出的bundle大小没有在本次构建测量，不能作为独立已证节省。

偶发开文件或必须准确编辑/打印的人，外部Office仍可能更合适。模块化不表示装本包之后加载零成本；xlsx动态import注释明确codeSplitting:false时仍在同一bundle里，源码形式的懒调用不能当按文件下载分包。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-30](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/README.md#L9-L30)

作者定位、拆包理由和better-sidebar版本要求。

<details>
<summary>查看原文（22行）</summary>

```text
DSH web 插件：为 better-sidebar 的编辑器提供 Office 三件套文件预览（`.docx` / `.xlsx` / `.pptx`）。

## 背景

better-sidebar 曾内置这三个 viewer，但 docx-preview / Univer（+ SheetJS）/ pptx-renderer 会把 client bundle 撑到约 23MB。本插件把它们拆成独立 bundle，better-sidebar 本体不再内联 Office 渲染库（约 5.9MB 全套 → 2.2MB 压缩），需要 Office 预览的用户单独安装本插件即可。

## 功能

- 通过 `ctx.betterSidebar.registerFileViewer` 注册 3 个 viewer（id 与内置一致）：
  - `docx`：`.docx`，docx-preview 保真渲染（样式/图片/表格，Alt+滚轮缩放）
  - `xlsx`：`.xlsx`，Univer sheets 预设（数据 + 公式 + 合并单元格 + 列宽/行高）
  - `pptx`：`.pptx`，@aiden0z/pptx-renderer 浏览器原生预览（翻页导航）
- viewer 描述符形状与原内置完全一致（`mediaUrl` 策略、priority 0、title/icon），因此：
  - 既有文件路由行为不变（扩展名匹配优先于 binary-download / code 兜底）
  - Side card 设置页自动显示这三个 viewer 的启用开关
  - 加载/渲染失败回退到「下载查看」链接
- 客户端组件自包含：自带 locale（中/英）与 CSS，不依赖 better-sidebar 的 client 内部实现

## 依赖 better-sidebar 版本

需要 better-sidebar `>= 0.6.0`（已移除内置 office viewer 的版本），否则会与内置 `docx/xlsx/pptx` 注册冲突（`already registered`）。

```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:47-73](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/index.tsx#L47-L73)

三个媒体viewer真实描述符。

<details>
<summary>查看原文（27行）</summary>

```text
export function officeViewers(): readonly FileViewerDescriptor[] {
  return [
    {
      id: 'docx',
      title: () => t('viewerDocx'),
      icon: (size: number) => createElement(IconDocxOutline16, { size }),
      exts: ['docx'],
      fetchStrategy: 'mediaUrl',
      component: ({ scope, path, title }) => createElement(DocxView, { scope, path, title }),
    },
    {
      id: 'xlsx',
      title: () => t('viewerXlsx'),
      icon: (size: number) => createElement(IconXlsxOutline16, { size }),
      exts: ['xlsx'],
      fetchStrategy: 'mediaUrl',
      component: ({ scope, path, title }) => createElement(XlsxView, { scope, path, title }),
    },
    {
      id: 'pptx',
      title: () => t('viewerPptx'),
      icon: (size: number) => createElement(IconPptxOutline16, { size }),
      exts: ['pptx'],
      fetchStrategy: 'mediaUrl',
      component: ({ scope, path, title }) => createElement(PptxView, { scope, path, title }),
    },
  ]
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:119-128](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/index.tsx#L119-L128)

服务注册与effect清理。

<details>
<summary>查看原文（10行）</summary>

```text
  const betterSidebar = (ctx as unknown as {
    betterSidebar?: { registerFileViewer(descriptor: FileViewerDescriptor): () => void }
  }).betterSidebar
  if (betterSidebar === undefined) return
  // Register through the service; the disposer unregisters on fiber disposal
  // (HMR-safe). Skipped when better-sidebar is absent (the whole plugin is a
  // viewer provider for its editor).
  for (const viewer of officeViewers()) {
    ctx.effect(() => betterSidebar.registerFileViewer(viewer), `dsh-better-sidebar-plugin-office: viewer ${viewer.id}`)
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:18-28](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/index.ts#L18-L28)

Host无操作，能力在客户端。

<details>
<summary>查看原文（11行）</summary>

```text
/** No host services are required. */
export const inject: readonly string[] = []

/**
 * Apply the (empty) node half.
 * @param _ctx - host context, unused.
 * @param _config - see {@link Config}.
 */
export function apply(_ctx: unknown, _config: Config = {}): void {
  // Intentionally empty. See module doc.
}
```

</details>

**依据 5 · 源码核查**：[src/client/office-view.tsx:166-181](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/office-view.tsx#L166-L181)

动态导入不等分包与xlsx转换路径。

<details>
<summary>查看原文（16行）</summary>

```text
        // Dynamic imports — collapsed into the bundle by codeSplitting:false.
        // The dynamic form keeps the source readable: each lib is only pulled
        // in when an .xlsx is actually opened (semantically; the bundle still
        // contains all of them).
        const XLSX = await import('xlsx')
        const { createUniver, LocaleType, mergeLocales } = await import('@univerjs/presets')
        const { UniverSheetsCorePreset } = await import('@univerjs/preset-sheets-core')
        // Locales pick the browser language; falls back to en-US.
        const isZh = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')
        const localePack = await (isZh
          ? import('@univerjs/preset-sheets-core/locales/zh-CN').then(m => m.default).catch(() => null)
          : import('@univerjs/preset-sheets-core/locales/en-US').then(m => m.default).catch(() => null))

        const wb = XLSX.read(buf, { type: 'array' })
        const locale = isZh ? LocaleType.ZH_CN : LocaleType.EN_US
        const workbookData = xlsxWorkbookToUniver(wb, '0.25.1', locale)
```

</details>

#### 缺口

- 没有同条件构建体积与真实查阅任务节时记录。
  **影响**：不能将作者大小或入口便利当性能/效率已验证。
  **进一步探讨**：分别测不装、装本包与外部Office的首开资源和完成同一查阅任务的时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三格式如何从会话文件变成预览并处理失败？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

URL构造带sessionId、path与可选cwd，向better-sidebar的/sidebar/file取原始字节，下载加download=1。本组件不自己建立文件权限边界，路径访问是否受会话工作目录限制由未在本项展开的better-sidebar Host决定，不能把URL字段存在当隔离验收。

DocxView fetch后arrayBuffer，导入docx-preview并renderAsync到容器；卸载只置cancelled并清容器，逻辑避免后续设置状态但不对取数设置AbortController。XlsxView经SheetJS读workbook，转Univer数据后createWorkbook，失败和卸载dispose实例并清DOM，避免保留canvas/workers/listeners。Pptx使用AbortController、推荐zip限制、懒媒体/幻灯片并在取消或失败destroy，翻页失败落error，下载链接一直可达。

三种路径都有错误与下载退路，UI显示ready只能证明渲染调用返回，不能证明内容完整或与原生Office一致。大文件可能在取完整arrayBuffer后才由库解析；本组件没有统一预取字节上限。恢复应下载原件到可信查看器核对，而不是反复重开假定数据正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/urls.ts:15-30](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/urls.ts#L15-L30)

媒体与下载URL及会话参数。

<details>
<summary>查看原文（16行）</summary>

```text
/** Absolute URL of the media route for one path (raw bytes). */
export function mediaUrl(scope: SessionScope, path: string): string {
  return fileUrl(scope, path, false)
}

/** Absolute URL of the download route (Content-Disposition: attachment). */
export function downloadUrl(scope: SessionScope, path: string): string {
  return fileUrl(scope, path, true)
}

/** Shared URL builder for the /sidebar/file route (media vs download). */
function fileUrl(scope: SessionScope, path: string, download: boolean): string {
  const params = new URLSearchParams({ sessionId: scope.sessionId, path })
  if (scope.cwd !== undefined && scope.cwd !== '') params.set('cwd', scope.cwd)
  if (download) params.set('download', '1')
  return `/sidebar/file?${params.toString()}`
```

</details>

**依据 2 · 源码核查**：[src/client/office-view.tsx:60-91](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/office-view.tsx#L60-L91)

docx取字节、渲染、错误与清理。

<details>
<summary>查看原文（32行）</summary>

```text
    void (async () => {
      try {
        const response = await fetch(mediaUrl(scope, path))
        if (cancelled) return
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const buf = await response.arrayBuffer()
        if (cancelled) return
        // docx-preview ships its own CSS through the className option; the
        // wrapper div scopes its render output.
        const { renderAsync } = await import('docx-preview')
        await renderAsync(buf, wrap, undefined, {
          className: 'docx',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
          experimental: false,
        })
        if (!cancelled) setLoad({ status: 'ready' })
      } catch (error) {
        if (!cancelled) {
          setLoad({ status: 'error', message: error instanceof Error ? error.message : String(error) })
        }
      }
    })()
    return () => {
      cancelled = true
      // Tear down the rendered DOM so a reopen starts clean.
      if (wrap !== null) wrap.innerHTML = ''
    }
```

</details>

**依据 3 · 源码核查**：[src/client/office-view.tsx:156-190](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/office-view.tsx#L156-L190)

xlsx解析转换与Univer实际渲染。

<details>
<summary>查看原文（35行）</summary>

```text
    void (async () => {
      try {
        const response = await fetch(mediaUrl(scope, path))
        if (cancelled) return
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const buf = await response.arrayBuffer()
        if (cancelled) return

        // Dynamic imports — collapsed into the bundle by codeSplitting:false.
        // The dynamic form keeps the source readable: each lib is only pulled
        // in when an .xlsx is actually opened (semantically; the bundle still
        // contains all of them).
        const XLSX = await import('xlsx')
        const { createUniver, LocaleType, mergeLocales } = await import('@univerjs/presets')
        const { UniverSheetsCorePreset } = await import('@univerjs/preset-sheets-core')
        // Locales pick the browser language; falls back to en-US.
        const isZh = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')
        const localePack = await (isZh
          ? import('@univerjs/preset-sheets-core/locales/zh-CN').then(m => m.default).catch(() => null)
          : import('@univerjs/preset-sheets-core/locales/en-US').then(m => m.default).catch(() => null))

        const wb = XLSX.read(buf, { type: 'array' })
        const locale = isZh ? LocaleType.ZH_CN : LocaleType.EN_US
        const workbookData = xlsxWorkbookToUniver(wb, '0.25.1', locale)

        if (cancelled) return
        const { univer, univerAPI } = createUniver({
          locale,
          locales: localePack !== null ? { [locale]: mergeLocales(localePack) } : {},
          presets: [UniverSheetsCorePreset({ container: host })],
        })
        univerRef.current = univer
        univerAPI.createWorkbook(workbookData)
```

</details>

**依据 4 · 源码核查**：[src/client/office-view.tsx:205-227](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/office-view.tsx#L205-L227)

Univer卸载清理与错误退路。

<details>
<summary>查看原文（23行）</summary>

```text
    return () => {
      cancelled = true
      // Critical: dispose the Univer instance (canvas + workers + listeners).
      try {
        univerRef.current?.dispose()
      } catch {
        // Already torn down — ignore.
      }
      univerRef.current = null
      // Clear the host in case dispose left DOM behind.
      if (host !== null) host.innerHTML = ''
    }
  }, [scope.sessionId, scope.cwd, path])

  return (
    <div className={css.editorXlsx} aria-label={title}>
      {/* Univer exclusively owns this element's descendants. React only owns
          the sibling overlay, so Univer cannot remove a React child. */}
      <div className={css.editorUniverHost} ref={hostRef} />
      {load.status !== 'ready' && (
        <div className={css.editorOfficeOverlay}>
          {load.status === 'loading' && <div className={css.editorPlaceholder}>{t('loading')}</div>}
          {load.status === 'error' && <BinaryFallback scope={scope} path={path} message={load.message} />}
```

</details>

**依据 5 · 源码核查**：[src/client/PptxView.tsx:30-76](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/PptxView.tsx#L30-L76)

pptx取消、zip限制、懒渲染和destroy。

<details>
<summary>查看原文（47行）</summary>

```text
        const response = await fetch(mediaUrl(scope, path), { signal: controller.signal })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const bytes = await response.arrayBuffer()
        if (controller.signal.aborted) return
        const { PptxViewer, RECOMMENDED_ZIP_LIMITS } = await import('@aiden0z/pptx-renderer')
        if (controller.signal.aborted) return
        const viewer = await PptxViewer.open(bytes, host, {
          renderMode: 'slide',
          fitMode: 'contain',
          lazyMedia: true,
          lazySlides: true,
          pdfjs: false,
          signal: controller.signal,
          zipLimits: RECOMMENDED_ZIP_LIMITS,
          onSlideChange: (index) => {
            if (!controller.signal.aborted) setSlide(index)
          },
        })
        if (controller.signal.aborted) {
          viewer.destroy()
          return
        }
        viewerRef.current = viewer
        setSlide(viewer.currentSlideIndex)
        setLoad({ status: 'ready', count: viewer.slideCount })
      } catch (error) {
        if (controller.signal.aborted) return
        try {
          viewerRef.current?.destroy()
        } catch {
          // Partially initialized viewer — ignore disposal errors.
        }
        viewerRef.current = null
        host.innerHTML = ''
        setLoad({ status: 'error', message: error instanceof Error ? error.message : String(error) })
      }
    })()
    return () => {
      controller.abort()
      try {
        viewerRef.current?.destroy()
      } catch {
        // Already destroyed.
      }
      viewerRef.current = null
      host.innerHTML = ''
    }
```

</details>

**依据 6 · 源码核查**：[src/client/PptxView.tsx:94-125](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/PptxView.tsx#L94-L125)

翻页与原件下载入口。

<details>
<summary>查看原文（32行）</summary>

```text
  return (
    <div className={css.editorPptx} aria-label={title}>
      <div className={css.editorPptxToolbar}>
        <button
          type="button"
          className={css.editorPptxButton}
          disabled={load.status !== 'ready' || slide <= 0 || navigating}
          onClick={() => { navigate(slide - 1) }}
        >
          {t('previousSlide')}
        </button>
        <span className={css.editorPptxPosition}>
          {load.status === 'ready' ? `${slide + 1} / ${load.count}` : '– / –'}
        </span>
        <button
          type="button"
          className={css.editorPptxButton}
          disabled={load.status !== 'ready' || slide >= load.count - 1 || navigating}
          onClick={() => { navigate(slide + 1) }}
        >
          {t('nextSlide')}
        </button>
        <a className={css.editorDownloadLink} href={downloadUrl(scope, path)} download>
          {t('downloadToView')}
        </a>
      </div>
      <div className={css.editorPptxStage}>
        <div className={css.editorPptxHost} ref={hostRef} />
        {load.status !== 'ready' && (
          <div className={css.editorOfficeOverlay}>
            {load.status === 'loading' && <div className={css.editorPlaceholder}>{t('loading')}</div>}
            {load.status === 'error' && <div className={css.editorError}>{load.message}</div>}
```

</details>

#### 缺口

- better-sidebar Host权限隔离、真实大文件资源及多格式渲染正确性未验证。
  **影响**：不能据客户端链路声称文件隔离、无内存问题或格式完全保真。
  **进一步探讨**：在授权环境用非敏感文件分别核对会话权限、大文件取消、失败下载和原件视觉对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些格式与依赖边界决定它只是预览？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

xlsx转换明确只覆盖表名顺序、类型值、公式文本、合并单元格及行列尺寸，不保留字体、填色、边框、对齐、条件格式与图表。公式文本交给Univer重算，不能从源公式存在推断所有Excel函数、外部引用和缓存值一致；日期/格式值映射也可能受SheetJS解析配置影响。需要财务精确核算、图表或版式时必须回到原件，不能用侧栏画面作为交付验收。

依赖better-sidebar>=0.6.0，否则旧内置同id注册可能冲突；locale是客户端必需，better-locale只是额外语言覆盖。包包含多种重库，动态调用不等下载时分包，浏览器兼容还依赖构建对jszip/xlsx browser入口的处理。升级渲染库应重新查纯浏览器产物与格式边界，README的typecheck/test命令不表示本次已通过。

首次需确认宿主与sidebar版本、重启硬刷新并逐格式开公开样本；持续消耗文档下载、解析和画布资源，具体内存/耗时未知。失败可禁用对应viewer或卸载本包并下载外部查看，没有在所查代码中发现保存到原文件的链路，表格可交互不等Office编辑写回。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/xlsx-to-univer.ts:5-17](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/xlsx-to-univer.ts#L5-L17)

转换限定与不支持样式、条件格式和图表。

<details>
<summary>查看原文（13行）</summary>

```text
 * v1 scope (matches docs/plans/2026-08-10-office-preview-design.md §3.6):
 * - Sheet names + order
 * - Cell values, typed (string / number / boolean / error → force-string)
 * - Cell formulas (text form; Univer's formula engine computes them)
 * - Merged cells (!merges → mergeData)
 * - Column widths (!cols → columnData) and row heights (!rows → rowData)
 *
 * Out of scope for v1 (SheetJS community edition does not parse them and the
 * Pro edition is commercial): cell styles (font/fill/border/alignment),
 * conditional formatting, charts. Users who need style fidelity get the
 * download button on the binary placeholder.
 *
 * The function is pure (no DOM, no Univer imports) so it is unit-testable
```

</details>

**依据 2 · 源码核查**：[src/client/xlsx-to-univer.ts:139-170](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/xlsx-to-univer.ts#L139-L170)

单元格类型、格式值与公式文本映射。

<details>
<summary>查看原文（32行）</summary>

```text
  const out: ICellData = {}
  // Type mapping: b→BOOLEAN, n→NUMBER, s→STRING, d→STRING, e→FORCE_STRING, z→skip
  switch (cell.t) {
    case 'b':
      out.t = CellValueType.BOOLEAN
      out.v = cell.v === true
      break
    case 'n':
      out.t = CellValueType.NUMBER
      out.v = typeof cell.v === 'number' ? cell.v : Number(cell.v)
      break
    case 'e':
      // Excel error strings like #REF! — display verbatim, no formula engine.
      out.t = CellValueType.FORCE_STRING
      out.v = String(cell.w ?? cell.v ?? '')
      break
    case 's':
    case 'd':
    case 'z':
    default:
      // String / date / stub. SheetJS renders dates as ISO strings in `w`
      // when cellDates is on; otherwise `v` is the serial number. Use `w`
      // (formatted text) when present so users see what Excel showed.
      out.t = CellValueType.STRING
      out.v = cell.w ?? (cell.v !== undefined ? String(cell.v) : '')
      break
  }
  // Formula: keep as text; Univer's formula engine computes on load.
  if (typeof cell.f === 'string' && cell.f !== '') {
    out.f = cell.f
  }
  return out
```

</details>

**依据 3 · 源码核查**：[package.json:47-58](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/package.json#L47-L58)

渲染库和sidebar peer版本。

<details>
<summary>查看原文（12行）</summary>

```text
  "dependencies": {
    "@aiden0z/pptx-renderer": "^1.2.4",
    "@univerjs/preset-sheets-core": "^0.25.1",
    "@univerjs/presets": "^0.25.1",
    "docx-preview": "^0.4.0",
    "xlsx": "^0.18.5"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-client-runtime": "^0.0.1-rc.1",
    "cordis": "^4.0.0-rc.7",
    "dsh-better-sidebar": "^0.6.0",
    "react": "^18.2.0"
```

</details>

**依据 4 · 源码核查**：[src/client/office-view.tsx:166-181](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/office-view.tsx#L166-L181)

同bundle和重算入口。

<details>
<summary>查看原文（16行）</summary>

```text
        // Dynamic imports — collapsed into the bundle by codeSplitting:false.
        // The dynamic form keeps the source readable: each lib is only pulled
        // in when an .xlsx is actually opened (semantically; the bundle still
        // contains all of them).
        const XLSX = await import('xlsx')
        const { createUniver, LocaleType, mergeLocales } = await import('@univerjs/presets')
        const { UniverSheetsCorePreset } = await import('@univerjs/preset-sheets-core')
        // Locales pick the browser language; falls back to en-US.
        const isZh = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')
        const localePack = await (isZh
          ? import('@univerjs/preset-sheets-core/locales/zh-CN').then(m => m.default).catch(() => null)
          : import('@univerjs/preset-sheets-core/locales/en-US').then(m => m.default).catch(() => null))

        const wb = XLSX.read(buf, { type: 'array' })
        const locale = isZh ? LocaleType.ZH_CN : LocaleType.EN_US
        const workbookData = xlsxWorkbookToUniver(wb, '0.25.1', locale)
```

</details>

**依据 5 · 作者声明**：[README.md:28-46](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/README.md#L28-L46)

作者版本冲突与构建浏览器入口说明。

<details>
<summary>查看原文（19行）</summary>

````text

需要 better-sidebar `>= 0.6.0`（已移除内置 office viewer 的版本），否则会与内置 `docx/xlsx/pptx` 注册冲突（`already registered`）。

## 开发

```powershell
pnpm install
pnpm run typecheck   # 类型门禁（需先构建 DSH-better-sidebar 的 lib/types）
pnpm test            # vitest（xlsx→Univer 转换 + 注册描述符）
pnpm run build       # tsdown 双产物（lib/index.js + lib/client.js）
```

> `tsdown.config.ts` 含 `jszip` / `xlsx` 的 browser-entry alias（SheetJS/JSZip 在 CJS 降级后残留 Node builtin 引用）与 `import.meta.resolve` 空定义（pptx-renderer 的 PDF.js 探测）。改动这些库版本时需一并验证 client bundle 不含 Node builtin。

## 安装（profile）

```powershell
# 从 npm 安装（推荐）：
dsh plugin --profile web add @huanlin/dsh-plugin-better-sidebar-plugin-office
````

</details>

#### 缺口

- 复杂公式、文档布局和库升级后的实际保真及成本未知。
  **影响**：不能替代Office编辑器，也不能证明预览可用于精确审计。
  **进一步探讨**：用合并/日期/外部引用公式、图表、复杂docx和pptx样本对比原件，记录不支持与资源峰值。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，如何避免把成功渲染当内容正确？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议已用better-sidebar>=0.6.0、主要需快速查阅普通Office文件的人逐格式试用。先核对一个代表docx、一个含合并/公式xlsx和一个多页pptx，比较原生Office关键数据与布局，再确认错误下载和关闭释放；不用敏感文件证明权限，单独核对Host访问范围。若字体/图表丢失影响判断、公式值不一致、卡顿或注册冲突，应下载原件并禁用对应viewer，不在侧栏继续修改后期待保存。

由渲染ready与内容保真之间的差距，可提出未验证假设：在预览页按解析到的实际特征显示“此文件包含当前未保留的图表/样式/公式能力”提示并附原件下载，可能比笼统格式声明更少让用户误判内容完整。需要可靠识别能力与映射，误报会增加警告疲劳，不可仅按扩展名猜。

对相同公开样本比较当前预览与特征提示，测关键内容误判、回原件比例和查阅完成时间。若提示不减少错误判断或大多误报导致用户全部退出，就收窄或放弃。该功能未实现，现有建议仍靠人工对照。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/xlsx-to-univer.ts:5-17](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/xlsx-to-univer.ts#L5-L17)

实际不保留特征是提示假设的依据。

<details>
<summary>查看原文（13行）</summary>

```text
 * v1 scope (matches docs/plans/2026-08-10-office-preview-design.md §3.6):
 * - Sheet names + order
 * - Cell values, typed (string / number / boolean / error → force-string)
 * - Cell formulas (text form; Univer's formula engine computes them)
 * - Merged cells (!merges → mergeData)
 * - Column widths (!cols → columnData) and row heights (!rows → rowData)
 *
 * Out of scope for v1 (SheetJS community edition does not parse them and the
 * Pro edition is commercial): cell styles (font/fill/border/alignment),
 * conditional formatting, charts. Users who need style fidelity get the
 * download button on the binary placeholder.
 *
 * The function is pure (no DOM, no Univer imports) so it is unit-testable
```

</details>

**依据 2 · 源码核查**：[src/client/office-view.tsx:239-247](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/office-view.tsx#L239-L247)

原件下载是明确退路。

```text
function BinaryFallback(props: { scope: SessionScope; path: string; message: string }): JSX.Element {
  const { scope, path, message } = props
  return (
    <div className={css.editorBinary}>
      <span className={css.editorBinaryNotice}>{message}</span>
      <a className={css.editorDownloadLink} href={downloadUrl(scope, path)} download>
        {t('downloadToView')}
      </a>
    </div>
```

**依据 3 · 源码核查**：[src/client/PptxView.tsx:94-125](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/PptxView.tsx#L94-L125)

幻灯片导航和下载并存。

<details>
<summary>查看原文（32行）</summary>

```text
  return (
    <div className={css.editorPptx} aria-label={title}>
      <div className={css.editorPptxToolbar}>
        <button
          type="button"
          className={css.editorPptxButton}
          disabled={load.status !== 'ready' || slide <= 0 || navigating}
          onClick={() => { navigate(slide - 1) }}
        >
          {t('previousSlide')}
        </button>
        <span className={css.editorPptxPosition}>
          {load.status === 'ready' ? `${slide + 1} / ${load.count}` : '– / –'}
        </span>
        <button
          type="button"
          className={css.editorPptxButton}
          disabled={load.status !== 'ready' || slide >= load.count - 1 || navigating}
          onClick={() => { navigate(slide + 1) }}
        >
          {t('nextSlide')}
        </button>
        <a className={css.editorDownloadLink} href={downloadUrl(scope, path)} download>
          {t('downloadToView')}
        </a>
      </div>
      <div className={css.editorPptxStage}>
        <div className={css.editorPptxHost} ref={hostRef} />
        {load.status !== 'ready' && (
          <div className={css.editorOfficeOverlay}>
            {load.status === 'loading' && <div className={css.editorPlaceholder}>{t('loading')}</div>}
            {load.status === 'error' && <div className={css.editorError}>{load.message}</div>}
```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:119-128](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office/blob/fbafdc6f8b1bb55a95fdd66f3f7ad9974b8aea75/src/client/index.tsx#L119-L128)

注册可卸载，支持对应viewer回退。

<details>
<summary>查看原文（10行）</summary>

```text
  const betterSidebar = (ctx as unknown as {
    betterSidebar?: { registerFileViewer(descriptor: FileViewerDescriptor): () => void }
  }).betterSidebar
  if (betterSidebar === undefined) return
  // Register through the service; the disposer unregisters on fiber disposal
  // (HMR-safe). Skipped when better-sidebar is absent (the whole plugin is a
  // viewer provider for its editor).
  for (const viewer of officeViewers()) {
    ctx.effect(() => betterSidebar.registerFileViewer(viewer), `dsh-better-sidebar-plugin-office: viewer ${viewer.id}`)
  }
```

</details>

#### 缺口

- 有效查阅收益和特征提示能否减少误判未知。
  **影响**：有条件试用不等完整保真或长期安装推荐。
  **进一步探讨**：固定样本和判定任务，比较误判与耗时；无改善或误报过高则退出。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
