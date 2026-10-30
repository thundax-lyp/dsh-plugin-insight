# Skill Explorer

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer)

<!-- BEGIN META -->
[![GitHub ★ 9,728](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C728&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 129,281](https://img.shields.io/static/v1?label=npm+30d&message=129%2C281&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)
<!-- END META -->

> **功能**：DSH 技能管理插件，按来源浏览、搜索、新建、编辑和导入 Skill 文件，并提供文件开关、面板偏好与回收站。

> **亮点**：来源合并、同名rank、管理GUI及fresh名称/路径、wx导入等改善文件维护；真实注入/权限仍归宿主，未证明每会话全覆盖或净节时。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：provider关闭只是面板偏好，汇总不等目标会话事实；编辑会丢额外frontmatter，链接识别有限、批量导入可半完成，限额有后验条件。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 它替谁减少哪类维护，实际入口与贡献属于谁？](#detail-section-11)
  - [Q02 · 目录、工作区与开关如何汇总，界面状态是不是模型事实？](#detail-section-12)
  - [Q03 · 写入、链接、导入与访问失败的真正边界是什么？](#detail-section-13)
  - [Q04 · 谁可先用，启动/持续/恢复和退出代价是什么？](#detail-section-14)
  - [Q05 · 哪些改进值得验证而非重复已有功能？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为经常在多个Skill根维护普通文件的DSH用户集中浏览、编辑与导入；验收看正确文件和目标会话，非统一权限控制。见[Q01](#research-q01)。

对照终端/文件管理器逐目录编辑及宿主官方skill目录；本包是GUI管理层，加载/注入、共享认证和遥测实现不全归本组件原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多源浏览 | 文件与registry合并、搜索筛选 | 跨workspace汇总/preset覆盖不等每会话完整目录 |
| 文件开关/编辑 | 更新frontmatter或正文 | 需真实目标/备份；provider开关仅面板偏好 |
| 新建/导入 | 可信Skill正文写入 | 资源文件不复制；整批失败可部分落盘 |
| 回收/界面偏好 | .trash与筛选记录 | 非编辑版本史/撤销全部副作用 |

**流程与依赖**

需要兼容DSH host/client服务、准确根与备份；远程paired路径依赖另一个服务，目标会话目录回读另核。表见[Q04](#research-q04)。

选根备份→只读对照官方目录→一次写入/小批可信导入核diff→失败查真实文件再恢复，卸载不撤文件。步骤见[Q04](#research-q04)。

**效果与成本**

扫描/编辑/导入、备份与实际会话对账成本未知；半完成、原地编辑和链接布局增加恢复负担，非把接口成功数当收益。表见[Q04](#research-q04)。

管理入口/文件操作有源码链；会话一致性、原子恢复和净节时未验，provider偏好不是模型撤权。效果表见[Q04](#research-q04)。

> **思考**：provider关闭只是面板偏好，汇总不等目标会话事实；编辑会丢额外frontmatter，链接识别有限、批量导入可半完成，限额有后验条件。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：来源合并、同名rank、管理GUI及fresh名称/路径、wx导入等改善文件维护；真实注入/权限仍归宿主，未证明每会话全覆盖或净节时。见[Q01](#research-q01)、[Q02](#research-q02)。

fresh身份、rank、随机wx原子toggle和wx导入值得复用；不能把它们推成内容CAS/全链接识别/整批原子。访问围栏与心跳是共享代码复用。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

provider关闭只是面板偏好，汇总不等目标会话事实；编辑会丢额外frontmatter，链接识别有限、批量导入可半完成，限额有后验条件。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只需支持字段的普通Skill文件维护者在备份测试根、确认无链接/并发写时单项试用，可信小导入逐项对账；字段丢失/错目标/状态未知/导入错误即停并查文件恢复备份，权限治理需求保持原办法。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包源码完成host/UI/采集、写路由及导入关键失败支路核查；非全monorepo或认证/zip安全审计，未运行。仅推荐备份测试根、无链接/无并发写、可信小型导入的仅含编辑器支持字段的普通文件管理试用；不能当模型撤权或完整会话catalog，未来对账机制未实现。

- 已检查：作者 README、包清单、源码路径 packages/dsh-skill-explorer/README.zh.md、packages/dsh-skill-explorer/cordis.patch.yml、packages/dsh-skill-explorer/package.json、packages/dsh-skill-explorer/src/access.ts、packages/dsh-skill-explorer/src/client/api.ts、packages/dsh-skill-explorer/src/client/index.ts、packages/dsh-skill-explorer/src/client/locales.ts、packages/dsh-skill-explorer/src/client/native-panel.tsx、packages/dsh-skill-explorer/src/client/panel/SkillsTab.tsx、packages/dsh-skill-explorer/src/client/telemetry.ts、packages/dsh-skill-explorer/src/collect.ts、packages/dsh-skill-explorer/src/frontmatter.ts、packages/dsh-skill-explorer/src/import.ts、packages/dsh-skill-explorer/src/index.ts、packages/dsh-skill-explorer/src/loopback.ts、packages/dsh-skill-explorer/src/pair-access.ts、packages/dsh-skill-explorer/src/provider-toggles.ts、packages/dsh-skill-explorer/src/routes.ts 及固定范围 inventory；组件：packages/dsh-skill-explorer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核子包manifest/bundle、host/client/原生slots/API、来源扫描/rank/registry/两种toggle、写读/导入、共享fence与客户端心跳。未全审monorepo远程/SSH/Git、全部host鉴权/配对服务、整个zip格式/平台文件系统或真实会话刷新，不执行目标。
- 下一步：授权后备份隔离根对照手工与面板任务，核同名跨workspace/preset实际目录、叶文件链接、并发/导入第N项失败的真实落盘及恢复；记录错误与人工，不用面板状态代替有效策略。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.12（[固定提交 de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是预览版本/真实文件实体与导入实际结果对账，比较错目标、丢更新和失败恢复；已有fresh路径/wx/原子toggle与提示保留，简单补丁够用则否定独立插件。见[Q05](#research-q05)。

授权后备份隔离根对照手工与面板任务，核同名跨workspace/preset实际目录、叶文件链接、并发/导入第N项失败的真实落盘及恢复；记录错误与人工，不用面板状态代替有效策略。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 478 | — | — | 6400 |
| .ts | source | 23 | 3917 | 2400 | 1277 | — |
| .tsx | source | 6 | 1148 | 886 | 201 | — |
| .ts | test | 16 | 4073 | 2981 | 661 | — |
| .tsx | test | 2 | 1026 | 780 | 159 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 183](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=183&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 182](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=182&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本子组件的真实管理链、实际会话状态差异与写入/导入边界是否支持可回退采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它替谁减少哪类维护，实际入口与贡献属于谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本项是monorepo内的原生DSH插件子包@linxin666/dsh-client-ui-skill-explorer 0.4.12，manifest有host入口、/client和bundle patch，要求DSH>=0.2.1-rc.3；不是独立Agent或Skill内容库。用户面对的是散落在项目、用户、自定义与provider中的技能文件，需要找来源、改正文、导入或删除，而非用它执行任务。基线是终端/文件管理器逐目录编辑SKILL.md；合格结果是文件写在正确目录、内容可读、目标会话实际技能目录可核，不能只看面板开关。

host apply实际makeRoutes并逐条webServer.register，effect卸载时释放；inject要求webServer/skills/sessions。client apply创建SkillApi与PanelController，经registerSkillExplorerPanel注册sidebar.panellist与main原生页面；UI行内调用浏览器API再到host，不是README里一个未接线mock。slots缺失可不出现页面，注册失败被捕获以免拖垮GUI，不能据host加载就断言用户看到面板。

本组件增量是来源汇总/同名rank、文件元数据与registry合并、普通文件的创建/导入/编辑/回收，以及前后端管理链。Skill解析/加载/实际注入归宿主，配对、loopback围栏和心跳是同仓库共享模块的生成副本，不把整个dsh-web的远程、SSH、Git或认证产品能力归此子包，也不把SDK和共享实现都算原创。已有provider-only提示明确其开关只影响面板，不能假设作者完全没有说明。

真实用户反复维护的频率、扫描/编辑比手工省多少时间以及安装兼容未实测；目前只能从有备份、无链接和无并发写入的普通文件管理小样验证价值。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/package.json:1-37](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/package.json#L1-L37)

包版本、双入口和最低DSH。

<details>
<summary>查看原文（37行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-skill-explorer",
  "description": "DSH skill center: browse loaded skills by source (bundled / project / user / custom / runtime), enable or disable, create and delete, in a web GUI panel.",
  "version": "0.4.12",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
  },
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/cordis.patch.yml:1-7](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/cordis.patch.yml#L1-L7)

host bundle注册本子包。

```text
# bundle patch for the skill-explorer plugin: inserts its plugin row into the web
# profile roster. Applied as a profile bundle layer (the `dsh.bundle.patch`
# manifest field); install with
# `dsh plugin --profile web add link:<repo>/packages/dsh-skill-explorer`.
- insert:
    - id: ui-skill-explorer
      name: '@linxin666/dsh-client-ui-skill-explorer'
```

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:105-128](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/index.ts#L105-L128)

makeRoutes注册及卸载effect、mountOnce。

<details>
<summary>查看原文（24行）</summary>

```text
  const routes = makeRoutes(ctx, {
    dshHome,
    agentsHome,
    customSkillDirs,
    registry: skillCtx.skills,
    activeSessionCwds,
    logger: { warn: (error: unknown) => ctx.logger.warn(error) },
  })

  ctx.effect(() => {
    const disposers = routes.map((route) => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'skill-explorer: routes')
}

/**
 * Single-instance guard shared by the plugin family: the aggregate bundle
 * (dsh-web-all) and a standalone install of this package can coexist in
 * one profile, so the second host apply must be a no-op instead of
 * re-registering the same routes and failing the boot.
 */
export const apply = mountOnce('@linxin666/dsh-client-ui-skill-explorer', applyImpl)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/client/index.ts:50-85](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/index.ts#L50-L85)

client真实创建API和注册页面。

<details>
<summary>查看原文（36行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-client-ui-skill-explorer' }])

  ctx.effect(() => {
    try {
      return ctx.locale.register(NS, { zh, en })
    } catch {
      return () => {}
    }
  }, 'skill-explorer: dictionaries')

  // Wire the SDK translate seat into the module-level tt (panel chrome and
  // other plain-DOM callers): reads the active locale at call time, so they
  // follow the Language setting without a reload.
  try { setRuntimeTranslate(ctx.locale.bind(NS)) } catch { /* locale missing: document-language fallback stays */ }

  const api = new SkillApi()
  // Panel navigation belongs to the layout service: the panel asks it to
  // select its own panel id (or the conversation) instead of taking over the
  // center column at the DOM level. The lookup stays lazy so a selection
  // issued before the service settles still lands once it does, and the face
  // throws by contract before the layout root entry mounts, which the
  // controller tolerates.
  const controller = new PanelController({
    panel: {
      select: panelId => {
        const layout = (ctx as unknown as { get?(name: string): unknown }).get?.('layout') as { selectPanel?: (id: string | null) => void } | undefined
        layout?.selectPanel?.(panelId)
      },
    },
  })
  const disposers: Array<() => void> = []
  try {
    disposers.push(registerSkillExplorerPanel(ctx, controller, api))
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/client/native-panel.tsx:100-124](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/native-panel.tsx#L100-L124)

sidebar/main实际slots注册与释放。

<details>
<summary>查看原文（25行）</summary>

```text
export function registerSkillExplorerPanel(ctx: ClientContext, controller: PanelController, api: SkillApi): () => void {
  const slots = ctx.slots as {
    inject(key: string, callback: () => () => void): () => void
    register(options: Record<string, unknown>, component: unknown): () => void
  }
  const disposers: Array<() => void> = []

  disposers.push(slots.inject('sidebar.panellist', () => slots.register({
    name: 'sidebar.panellist',
    id: SKILL_EXPLORER_PANEL_ID,
    order: PANEL_ORDER,
    // The shell resolves this through resolveSlotLabel on every locale change,
    // so the module-level translate reads the active language at call time.
    label: () => tt('entry.label'),
  }, SkillExplorerPanelIcon)))

  disposers.push(slots.inject('main', () => slots.register({
    name: 'main',
    key: SKILL_EXPLORER_PANEL_ID,
    inject: (): PanelFace => ({ controller, api }),
  }, SkillExplorerPanelPage as never)))

  return () => {
    for (const dispose of disposers.splice(0)) dispose()
  }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/client/locales.ts:39-40](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/locales.ts#L39-L40)

已有provider面板开关限制提示。

```text
  'list.providerFileTooltip': '该技能的文件由插件 provider 提供，未落在本面板扫描的技能根目录下',
  'list.providerFileHint': '该技能由插件提供、确有 SKILL.md 文件，但不在本面板扫描的技能根目录下，因此无法在此编辑或删除；开关只改变本面板的可调用视图，不会改变模型实际加载的技能。',
```

**依据 7 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:49-67](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/README.zh.md#L49-L67)

作者承诺的管理层/来源，不替运行验证。

<details>
<summary>查看原文（19行）</summary>

```text
- 数据来自按官方 dsh-skill-filesystem 根约定的文件系统扫描，并与
  `ctx.skills` 注册表（bundled / runtime 条目）合并。扫描既读本插件自己的
  `customSkillDirs`，也读每一条在用的 `skill-filesystem` loader 行的同名
  配置，因此官方文档推荐的配法（写在 profile patch 的 provider 行上）同样可管理。
  本插件不改变 skill 的加载/注入语义——纯 GUI 管理层。
- 写路由无法操作的技能会按它实际的本地形态打标，而不是静默缺失控件：
  插件 provider 报告了真实指令文件（官方 `SkillSummary.path`）的技能显示为
  **「由插件提供」**——文件确实存在，只是不在本面板扫描的技能根目录下；
  只有完全没有文件的注册项才显示为 **「无本地文件」**。两者都不带可写路径，
  因此都不会出现必然 404 的编辑/删除控件。**「由插件提供」**的行带有启用/
  禁用开关（#1854）：文件属于 provider，因此宿主把开关记在面板自己的存储里，
  该行显示为已停用（见「已知限制」）；只有**「无本地文件」**的行完全没有开关。
- 只有官方 provider 会加载的技能才被列出：SKILL.md 必须声明非空的 `name`
  与 `description`，且 name 满足官方技能名文法。被官方 provider 丢弃的文件
  在面板里同样不出现，面板不会展示模型收不到的技能。
- 同名技能按官方来源 rank 决出胜者（项目 `.dsh/skills` 100、项目
  `.agents/skills` 200、运行时 250、自定义目录 300、用户 `~/.dsh/skills`
  400、用户 `~/.agents/skills` 500、内置 600），因此面板所示与模型所得是
  同一个技能。
```

</details>

#### 缺口

- 维护频率、安装兼容与节时收益未实测
  **影响**：不能以页面/功能数量证明值得持续使用
  **进一步探讨**：备份测试根按相同找技能、改正文和导入任务对比文件管理器/终端的错目标、工时和返工。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录、工作区与开关如何汇总，界面状态是不是模型事实？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

host把插件自有customSkillDirs和loader里活动skill-filesystem行的配置合并；loader取不到降为自有配置，session列表失败也降为空。list先选显式cwd、再第一个活动session cwd、再process.cwd。collect并发扫描项目.dsh/.agents、用户、自定义根，校验name/description和名称文法，按来源rank在统一byName Map竞争；低rank优先，同rank已有活动workspace时不被非活动项覆盖。再按cwd/项目根查询registry，较强来源可替换扫描行，同rank补provider/调用标记，最后才套provider面板开关。

这是跨工作区汇总，不是每个会话独立的完整catalog：所有项目共用byName，同名不同workspace会竞争；同rank优先活动只是一层规则，非活动项目更强rank仍能胜出。比如当前项目仅project-agents同名项、另一项目有project-dsh项，按代码的100/200全局rank会保留后者；这是静态条件推导，未运行复现。preset专有目录/作用域provider也不在完整覆盖内。面板中没有、或别的workspace的项胜出，不证明当前模型同样没有/同样选中它。

普通文件set-enabled经fresh scan解析名称与预期path，匹配才setFrontmatterField写disable-model-invocation，并返回文件声明的状态；没有在该请求里等待目标agent的真实catalog回读，因此文件写成功不是会话生效验收。provider-file没有面板可写path，set-provider-enabled只按(provider,name)写本地JSON；collect尾部applyProviderToggles只改返回行的modelInvocable，既不改registry也不改userInvocable。它是持久面板偏好，模型仍会加载该provider技能。启用操作可清理已经卸载行的旧记录，禁用则必须fresh collection仍为同一provider-file；这一身份边界有实际实现。

客户端SkillRow.toggle按是否有path分派上述两API，成功后onChanged刷新。已有文案明确provider面板偏好，不应把同一视觉开关推成统一授权。Skill列表load用序号阻止旧响应覆盖，刷新失败保留last-good并显示错误；这不等实时状态。后端complete只追踪registry snapshot是否完整/抛错，文件root的readdir/readFile失败是跳过，不使它false；当前client对complete只声明类型，未见用它显示完整性。因此complete=true也不是全文件/全作用域已扫描、面板可见即有效的证明。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:76-102](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/index.ts#L76-L102)

loader/session失败降级以及活动cwd来源。

<details>
<summary>查看原文（27行）</summary>

```text
  const customSkillDirs = (): string[] => {
    const own = Array.isArray(config?.customSkillDirs) ? config.customSkillDirs : []
    let fromRows: string[] = []
    try {
      // Non-strict read: the loader is present in every real composition but
      // is not a declared dependency of this plugin, so a shell without one
      // must degrade to the plugin's own config instead of failing the mount.
      const loader = (ctx as unknown as { get(name: string, strict?: boolean): unknown }).get('loader', false) as LoaderSurface | undefined
      if (typeof loader?.entries === 'function') fromRows = customSkillDirsFromLoader(loader.entries())
    } catch {
      fromRows = []
    }
    return normalizeSkillRoots([...own, ...fromRows])
  }

  /** Active session workspace cwds (degraded to [] when the registry is unavailable). */
  const activeSessionCwds = (): string[] => {
    try {
      const sessions = skillCtx.sessions as SessionList | undefined
      if (typeof sessions?.list !== 'function') return []
      return sessions
        .list()
        .map((session) => session.header?.cwd)
        .filter((cwd): cwd is string => typeof cwd === 'string' && cwd !== '')
    } catch {
      return []
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:169-195](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L169-L195)

统一采集选项及cwd优先级。

<details>
<summary>查看原文（27行）</summary>

```text
  const collectOptions = async (cwd: string): Promise<CollectOptions> => ({
    cwd,
    projectRoots: sessionProjectRoots(),
    customSkillDirs: resolveCustomSkillDirs(),
    dshHome,
    agentsHome,
    registry,
    providerDisabledSkills: (await readProviderToggles(dshHome)).disabled,
  })

  /**
   * The workspace the panel is showing, resolved exactly like the list route:
   * an explicit override, then the active session workspace, then the process
   * cwd. The write routes used the process cwd alone, so on a host whose cwd
   * is the DSH install directory they scanned a different project root than
   * the list route had just served and reported 409 for a skill the panel was
   * displaying.
   */
  const panelCwd = (override?: string): string =>
    (override !== undefined && override.trim() !== '' ? override : undefined)
    ?? safeSessionCwds()[0]
    ?? DEFAULT_CWD()

  /** Find a skill by name from a fresh collection pass (trusts scanned paths only). */
  const findSkill = async (name: string, cwd: string): Promise<SkillEntry | undefined> => {
    const { skills } = await collectSkills(await collectOptions(cwd))
    return skills.find((candidate) => candidate.name === name)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:70-78](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L70-L78)

来源rank固定值。

```text
export const SKILL_SOURCE_RANK: ReadonlyMap<string, number> = new Map([
  ['project-dsh', 100],
  ['project-agents', 200],
  ['runtime', 250],
  ['custom', 300],
  ['user-dsh', 400],
  ['user-agents', 500],
  ['bundled', 600],
])
```

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:296-308](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L296-L308)

根读取失败跳过，不报全量覆盖。

<details>
<summary>查看原文（13行）</summary>

```text
async function scanSkillRoot(
  root: string,
  level: string,
  into: Map<string, SkillEntry>,
  workspaceInfo?: { root: string; name: string; active: boolean },
  skipSystem = false,
): Promise<void> {
  if (!existsSync(root)) return
  let entries
  try {
    entries = await readdir(root, { withFileTypes: true })
  } catch {
    return
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:345-387](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L345-L387)

文件接受规则、rank及活动workspace tie-break。

<details>
<summary>查看原文（43行）</summary>

```text
    if (!existsSync(file)) continue
    let content: string
    try {
      content = await readFile(file, 'utf8')
    } catch {
      continue
    }
    const parsed = parseFrontmatter(content)
    // Official acceptance: a skill file must declare a non-empty name and
    // description in frontmatter, and that name must satisfy the skill-name
    // grammar (the official provider's stringField requires length > 0 and
    // parseSkillFile discards the rest). A file the official provider drops —
    // missing frontmatter, missing or empty either field, invalid name — is
    // not a loaded skill, so the panel must not show it; otherwise the panel
    // lists a skill the model never receives.
    if (parsed.name === undefined || parsed.name === '') continue
    if (parsed.description === undefined || parsed.description === '') continue
    if (!isSkillName(parsed.name)) continue
    const priority = rankOf(level)
    const existing = into.get(parsed.name)
    if (existing !== undefined) {
      const existingPriority = rankOf(existing.level)
      if (existingPriority < priority) continue
      if (existingPriority === priority && existing.isActiveWorkspace && !workspaceInfo?.active) {
        continue
      }
    }
    into.set(parsed.name, {
      name: parsed.name,
      description: parsed.description,
      whenToUse: parsed.whenToUse,
      provider: 'filesystem',
      level,
      path: file,
      fileState: 'editable',
      linked,
      // Official frontmatter invocation policy.
      modelInvocable: parsed.disableModelInvocation !== true,
      userInvocable: parsed.userInvocable !== false,
      workspaceRoot: workspaceInfo?.root,
      workspaceName: workspaceInfo?.name,
      isActiveWorkspace: workspaceInfo?.active,
    })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:492-523](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L492-L523)

跨roots单Map扫描、多个cwd查询。

<details>
<summary>查看原文（32行）</summary>

```text
export async function collectSkills(options: CollectOptions): Promise<CollectResult> {
  const { cwd, customSkillDirs, dshHome, agentsHome, registry } = options
  const byName = new Map<string, SkillEntry>()
  const activeProjectRoot = findProjectRoot(cwd)
  const roots = new Set<string>(options.projectRoots !== undefined && options.projectRoots.length > 0 ? [activeProjectRoot, ...options.projectRoots] : [activeProjectRoot])
  // Each root scans independently, in parallel (Map writes are atomic under the single thread).
  const scanTasks: Array<Promise<void>> = []
  for (const root of roots) {
    const isActive = root === activeProjectRoot || root === cwd
    const wsInfo = {
      root,
      name: basename(root) || root,
      active: isActive,
    }
    scanTasks.push(scanSkillRoot(join(root, '.dsh', 'skills'), 'project-dsh', byName, wsInfo))
    scanTasks.push(scanSkillRoot(join(root, '.agents', 'skills'), 'project-agents', byName, wsInfo))
  }
  for (const dir of normalizeSkillRoots(customSkillDirs ?? [])) scanTasks.push(scanSkillRoot(dir, 'custom', byName))
  scanTasks.push(scanSkillRoot(join(dshHome, 'skills'), 'user-dsh', byName, undefined, true))
  scanTasks.push(scanSkillRoot(join(agentsHome, 'skills'), 'user-agents', byName))
  await Promise.all(scanTasks)

  // Registry supplement: same-name skills get whenToUse / invocation flags
  // filled in; registry-only skills (bundled / runtime) join as-is.
  // Query the registry for primary cwd and any other active project roots so
  // project-level providers are captured.
  const snapshotCwds = new Set<string>([cwd, ...roots])
  let complete = true
  for (const snapshotCwd of snapshotCwds) {
    try {
      const snapshot = await registry.snapshot({ cwd: snapshotCwd })
      if (snapshot.complete !== true) complete = false
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:524-559](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L524-L559)

registry合并、complete失败与最后面板toggle。

<details>
<summary>查看原文（36行）</summary>

```text
      for (const skill of snapshot.skills) {
        const existing = byName.get(skill.name)
        const serialized = serializeRegistry(skill)
        if (existing === undefined) {
          byName.set(skill.name, serialized)
          continue
        }
        // The registry outranks a scanned entry of a weaker source, the way
        // the official registry resolves a duplicate by rank. Without this an
        // unquestioned filesystem entry would win even when the official
        // winner is a runtime registration, so the panel would name a different
        // skill than the model receives.
        if (rankOf(serialized.level) < rankOf(existing.level)) {
          byName.set(skill.name, serialized)
          continue
        }
        if (rankOf(serialized.level) > rankOf(existing.level)) continue
        if (serialized.whenToUse !== undefined) existing.whenToUse = serialized.whenToUse
        if (serialized.provider !== undefined) existing.provider = serialized.provider
        // Only let the registry refine invocation when it actually states a
        // policy. scanSkillRoot() already resolved the file frontmatter with
        // the official rule (omitted => allowed), so overwriting it with the
        // serialized default would re-introduce the false-negative that made
        // every skill render as not invocable.
        if (skill.invocation?.modelInvocable !== undefined) existing.modelInvocable = skill.invocation.modelInvocable
        if (skill.invocation?.userInvocable !== undefined) existing.userInvocable = skill.invocation.userInvocable
      }
    } catch {
      // Registry unavailable: the filesystem result still stands.
      complete = false
    }
  }
  // The panel's own provider-skill switches close the collection: a row the
  // user switched off reads as not model invocable here, exactly like a
  // skill whose own frontmatter disables model invocation.
  applyProviderToggles(byName.values(), options.providerDisabledSkills ?? [])
```

</details>

**依据 8 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:292-318](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L292-L318)

普通文件开关只返回写入声明。

<details>
<summary>查看原文（27行）</summary>

```text
      path: ROUTES.setEnabled,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req, { maxBytes: 128 * 1024, objectOnly: true })
          if (body === null) {
            writeJson(res, 400, { error: 'invalid JSON body' })
            return
          }
          const payload = body as Record<string, unknown>
          const { name, path, enabled } = payload
          if (typeof name !== 'string' || !isSkillName(name) || typeof path !== 'string' || path.trim() === '' || typeof enabled !== 'boolean') {
            writeJson(res, 400, { error: 'expected { name, path, enabled }' })
            return
          }
          // The client path is only an identity claim: a fresh scan must
          // resolve the same effective skill before any file is touched.
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // Disabled = disable-model-invocation: true; enabled = false.
          const frontmatter = setFrontmatterField(skill.path, 'disable-model-invocation', enabled ? false : true)
          writeJson(res, 200, {
            name,
            enabled: frontmatter.disableModelInvocation !== true,
            modelInvocable: frontmatter.disableModelInvocation !== true,
            path: skill.path,
          })
```

</details>

**依据 9 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:347-366](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L347-L366)

provider开关清记录/新禁用身份重查。

<details>
<summary>查看原文（20行）</summary>

```text
          if (enabled) {
            // Enabling only ever drops a record, so it stays allowed for a
            // skill the panel no longer lists: a plugin can be uninstalled
            // while its record is still stored, and that record must remain
            // removable. Nothing is written when it is already absent.
            await setProviderSkillEnabled(dshHome, identity, true)
            writeJson(res, 200, { ok: true, name: identity.name, provider: identity.provider, disabled: false })
            return
          }
          // Disabling creates a record the panel will honor from the next list
          // on, so it must address a skill a fresh collection still lists as
          // plugin-provided — the same "only what the panel showed" rule the
          // file write routes follow, here with the identity instead of a path.
          const skill = await findProviderSkill(identity, panelCwd())
          if (skill === undefined) {
            writeJson(res, 404, { error: `skill ${identity.name} is not a plugin-provided skill with a local file` })
            return
          }
          await setProviderSkillEnabled(dshHome, identity, false)
          writeJson(res, 200, { ok: true, name: identity.name, provider: identity.provider, disabled: true })
```

</details>

**依据 10 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:436-444](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L436-L444)

只改provider-file返回行modelInvocable。

```text
export function applyProviderToggles(skills: Iterable<SkillEntry>, disabled: readonly ProviderSkillIdentity[]): void {
  if (disabled.length === 0) return
  const keys = new Set(disabled.map((identity) => JSON.stringify([identity.provider, identity.name])))
  for (const skill of skills) {
    if (skill.fileState !== 'provider-file') continue
    if (!keys.has(JSON.stringify([skill.provider ?? '', skill.name]))) continue
    skill.modelInvocable = false
  }
}
```

**依据 11 · 源码核查**：[packages/dsh-skill-explorer/src/client/panel/SkillsTab.tsx:135-146](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/panel/SkillsTab.tsx#L135-L146)

UI实际分派两个开关。

<details>
<summary>查看原文（12行）</summary>

```text
  const toggle = async (): Promise<void> => {
    if (busyRef.current || !canToggle(skill)) return
    busyRef.current = true
    setBusy(true)
    setError(undefined)
    try {
      // Two identities, one switch: a row with a file certifies the path the
      // write routes re-scan, a plugin-provided row certifies the
      // (provider, name) pair the host records in the panel's own store.
      if (skill.path !== undefined) await api.setEnabled(skill.name, skill.path, !skill.modelInvocable)
      else await api.setProviderEnabled(skill.name, skill.provider, !skill.modelInvocable)
      onChanged()
```

</details>

**依据 12 · 源码核查**：[packages/dsh-skill-explorer/src/client/panel/SkillsTab.tsx:297-314](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/panel/SkillsTab.tsx#L297-L314)

load序号与last-good状态。

<details>
<summary>查看原文（18行）</summary>

```text
  const load = async (): Promise<void> => {
    const seq = ++loadSeq.current
    setLoading(true)
    try {
      const next = await api.list()
      if (seq !== loadSeq.current) return
      setPayload(next)
      setError(undefined)
    } catch (err) {
      if (seq !== loadSeq.current) return
      setError(tt('list.loadFailed', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      // A newer load owns the flag while it runs.
      if (seq === loadSeq.current) setLoading(false)
    }
  }

  useEffect(() => { void load() }, [api])
```

</details>

**依据 13 · 源码核查**：[packages/dsh-skill-explorer/src/client/api.ts:75-82](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/api.ts#L75-L82)

complete仅类型声明，非会话验收。

```text
/** List payload served by the host. */
export interface ListPayload {
  cwd: string
  projectRoots: string[]
  complete: boolean
  groups: GroupPayload[]
  workspaces?: WorkspaceItem[]
}
```

**依据 14 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:153-168](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/README.zh.md#L153-L168)

作者说明preset覆盖/面板偏好/链接语义。

<details>
<summary>查看原文（16行）</summary>

```text
- frontmatter 解析为零依赖轻量实现（块标量、布尔、input 嵌套块）；不支持的
  生僻 YAML 特性以官方 dsh-skill-filesystem 提供方为准。
- 面板覆盖它扫描的文件系统根，加上 `ctx.skills` 注册表的全局层（bundled 与
  runtime 条目）。配在 host 平面 `skill-filesystem` 行上的 `customSkillDirs`
  会被扫描，因为宿主会读取该行配置；仅通过**某个 agent preset 自己的**
  `customSkillDirs` 或 preset 作用域提供方到达 agent 的技能不在此覆盖范围内，
  因为面板读取注册表时不带 viewing scope。因此面板里没有的技能，不一定模型也没有：
  会话能加载什么，以官方 `skill` 工具目录为准。
- **「由插件提供」**行的开关是**仅本面板生效**的视图决定：它改变的是本面板
  列出的可调用状态，宿主注册表照旧加载该技能，模型仍会收到它。要真正让这类
  技能不再进入模型，需要在它的 provider 获取它的位置（插件配置或随包文件）
  移除或停用它。
- 链接技能不可删除、不可编辑（见安全模型）；启用/禁用对链接技能正常（改写目标
  `SKILL.md` frontmatter）。目录型与「单文件」链接都能正常列出；「单文件」
  符号链接（指向单个 `.md`）在原子改写（rename）时会被替换为一个普通文件
  （链接不再保留），目标文件本身不受影响。
```

</details>

#### 缺口

- 目标会话/多workspace实际选中与文件刷新时序未验
  **影响**：目录和开关不构成会话有效策略或全量权限证明
  **进一步探讨**：用同名跨workspace/preset/provider样本，写后回读目标会话官方skill目录；不一致保未知，不据面板撤权。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 写入、链接、导入与访问失败的真正边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

各host handler先guard，复用本包access→共享pair-access：直接loopback要socket、Host、同源标记与无代理标记等条件；否则仅可由可选remoteWebUiPairing服务的isPairedDevice返回true放行，无该服务维持loopback。故不是“远程请求一概无权限”，也不是本组件自己实现整套设备认证。所核路由未另加细分项目白名单；配对服务内部授权与代理部署未在本项全审，访问边界不能等同文件OS沙箱。

读取/更新/删除与toggle先fresh scan按name解析，再核path字符串完全等于面板预期，陈旧同名路径409，有效减少随意提交路径或同名切换写错文件。它没有文件内容版本、inode或原子读改CAS：扫描到实际读写之间仍可变化。创建writeSkillFile先existsSync再普通writeFile，竞态中不能据exists检查保证不覆盖；导入则真正用wx独占创建。普通toggle用随机临时文件wx后rename，避免半写及猜测临时链接；编辑overwriteSkillFile是writeFile原地覆盖，不提供自动前像/每次编辑版本史；删除rename进同目录.trash，只保SKILL.md而非所有资源目录，用户还需人工恢复。

编辑还不是frontmatter保真改写：read接口把frontmatter剥掉，仅给表单name/description/whenToUse和正文；update只另读当前disable-model-invocation，overwrite再用buildSkillContent重建这几个字段。其它字段不会被复制，例如user-invocable:false会消失，按本扫描器的默认规则又成为可手动调用；input等设置也会丢。不能以“保留启用状态”推全部调用策略/元数据都保留。实际目标会话是否及何时反映变化仍需回读；复杂frontmatter应继续用保真的文件编辑方法。

链接保护必须按真实识别范围说。scanSkillRoot仅当根目录列出的entry自身是symbolic link时置linked=true，routes.update/delete拒绝这些标记项；它允许目录链接toggle按父路径触及目标，单文件链接toggle以rename替换链接本身，目标保持不变，README也说明后者。但普通技能目录内的SKILL.md本身若是链接，entry走isDirectory分支，后续readFile跟随且linked仍false；update的writeFile会沿叶文件链接写目标。所核路径未lstat该SKILL.md或核真实目标再拒绝，不能概括“任何链接均不可编辑”。这是有明确文件布局条件的源码缺口，不是任意远程可写漏洞实证；外部并发换链和所有平台行为未运行。目录导入也只跳过直接entry链接，普通子目录中的叶SKILL.md同样被readFile跟随，不能称递归检查全部链接。

导入正面约束真实：先解析/校验候选，按name/rank裁定duplicate/exists/shadowed，wx只写新SKILL.md、保留逐项跳过理由，不复制zip其他资源。zip入参最多4MiB、512 entries，候选正文64KiB、解压累计4MiB，但实现先inflateRawSync(compressed)，之后才比较声明长度和累计长度，单候选大小更在解析时检查；本项不能据此证明解压峰值内存严格不超4MiB。目录导入一层、不递归，没有同等条数/总读入量预限，单文件也先readFile再校验64KiB，只能用小型可信源，不把资源声明当恶意归档完备防护。

计划校验不等整批事务。executeImport循环先落每个新文件，遇到并发wx冲突/I/O错误没有逐项catch或回滚，route会返回500；此前文件仍可能已创建，不能以请求失败推全没做，更不能盲重试。provider开关JSON采用tmp/fsync/rename，坏/缺文档读成空禁用列表，但读取—修改—写回没有队列/CAS，两个不同开关并发仍可能覆盖彼此偏好；它原本就不是模型权限库。以上失败恢复成本要在采用前计入。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:131-140](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L131-L140)

每个handler复用的访问/方法guard。

<details>
<summary>查看原文（10行）</summary>

```text
  const guard = (req: IncomingMessage, res: ServerResponse, method: string): boolean => {
    if (!isSkillExplorerAllowed(ctx, req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: `method not allowed: ${req.method}` })
      return false
    }
    return true
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/access.ts:18-20](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/access.ts#L18-L20)

实际访问wrapper接共享fence。

```text
export function isSkillExplorerAllowed(ctx: Context, request: IncomingMessage): boolean {
  return isPairedOrLoopbackAllowed(ctx, request)
}
```

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/pair-access.ts:39-41](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/pair-access.ts#L39-L41)

loopback或可选paired服务。

```text
  if (isLoopbackRequest(request)) return true
  return lookupPairing(ctx)?.isPairedDevice(request) === true
}
```

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/pair-access.ts:56-70](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/pair-access.ts#L56-L70)

非strict服务查找，无服务不放行paired。

<details>
<summary>查看原文（15行）</summary>

```text
  if (typeof ctx.get === 'function') {
    const viaGet = ctx.get('remoteWebUiPairing', false)
    return isPairingAccess(viaGet) ? viaGet : undefined
  }
  try {
    const viaProperty = ctx.remoteWebUiPairing
    return isPairingAccess(viaProperty) ? viaProperty : undefined
  } catch {
    return undefined
  }
}

function isPairingAccess(value: unknown): value is PairingAccess {
  return value !== undefined
    && value !== null
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/loopback.ts:76-100](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/loopback.ts#L76-L100)

直接请求socket/代理/Host/Origin实查。

<details>
<summary>查看原文（25行）</summary>

```text
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}

/**
 * Whether a forwarded request landed on this machine's loopback upstream: a
 * forwarding header (the proxy's own stamp), a loopback socket address (the
 * proxy dials 127.0.0.1:<port>), and a loopback Host header (the proxy rewrote
 * the authority to its upstream literal).
 *
 * This is a fact about the route, not a trust decision. A public request to a
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:218-233](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L218-L233)

fresh name/path字符串身份，不是文件版本CAS。

<details>
<summary>查看原文（16行）</summary>

```text
  const resolveScannedSkill = async (
    name: string,
    expectedPath: string,
    cwd: string,
    res: ServerResponse,
  ): Promise<(SkillEntry & { path: string }) | undefined> => {
    const skill = await findSkill(name, cwd)
    if (skill?.path === undefined) {
      writeJson(res, 404, { error: `skill ${name} has no editable file` })
      return undefined
    }
    if (skill.path !== expectedPath) {
      writeJson(res, 409, { error: `skill ${name} changed since the panel loaded; refresh and retry` })
      return undefined
    }
    return skill as SkillEntry & { path: string }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:502-514](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L502-L514)

标linked拒编辑，普通路径实际overwrite。

<details>
<summary>查看原文（13行）</summary>

```text
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // A linked skill lives behind a symlink: rewriting it would edit a
          // file outside this skill root, so the panel must not offer it.
          if (skill.linked === true) {
            writeJson(res, 400, { error: `skill ${name} is a linked skill and cannot be edited` })
            return
          }
          // The enabled state is not part of the edit form: carry it over so an
          // edit never silently re-enables a disabled skill.
          const disabled = parseFrontmatter(readFileSync(skill.path, 'utf8')).disableModelInvocation === true
          const target = await overwriteSkillFile(skill.path, name, description.trim(), typeof whenToUse === 'string' ? whenToUse : undefined, content, disabled)
          writeJson(res, 200, { ok: true, name, path: target, disabled })
```

</details>

**依据 8 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:538-548](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L538-L548)

标linked拒删除，rename回收。

<details>
<summary>查看原文（11行）</summary>

```text
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // A linked skill lives behind a symlink (mount-of-intent content, not
          // created under this root). Deleting it would move the target's real
          // SKILL.md out of place, escaping this skill root — refuse deletion.
          if (skill.linked === true) {
            writeJson(res, 400, { error: `skill ${name} is a linked skill and cannot be deleted` })
            return
          }
          const moved = await trashSkillFile(skill.path)
          writeJson(res, 200, { ok: true, name, moved })
```

</details>

**依据 9 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:315-341](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L315-L341)

只根entry的链接设置linked，普通目录叶文件另路。

<details>
<summary>查看原文（27行）</summary>

```text
    let file: string
    let linked = false
    if (entry.isDirectory()) {
      file = join(root, name, 'SKILL.md')
    } else if (entry.isFile() && name.endsWith('.md')) {
      file = join(root, name)
    } else if (entry.isSymbolicLink()) {
      // A symlink's dirent is neither a directory nor a file, so a plain
      // readdir() skips it and linked-out skills never show up. Follow the
      // target with stat() (cross-platform: Windows symlink/junction, Linux and
      // macOS symlink all resolve the same way) to classify it, then resolve
      // the file path like a real entry — the scan path stays on the link, so
      // the write route (set-enabled) reaches the linked target via the normal
      // fs follow semantics. Dangling or unreadable links are skipped.
      // A linked skill is mount-of-intent content, not created under this root:
      // it stays listable and toggleable, but deletion is refused (see routes).
      linked = true
      let linkedFile: string
      try {
        const target = await stat(join(root, name))
        if (target.isDirectory()) linkedFile = join(root, name, 'SKILL.md')
        else if (target.isFile() && name.endsWith('.md')) linkedFile = join(root, name)
        else continue
      } catch {
        continue
      }
      file = linkedFile
```

</details>

**依据 10 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:345-350](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L345-L350)

读取叶SKILL.md会跟随文件路径。

```text
    if (!existsSync(file)) continue
    let content: string
    try {
      content = await readFile(file, 'utf8')
    } catch {
      continue
```

**依据 11 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:578-602](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L578-L602)

create exists后普通写、edit覆盖和trash仅文件。

<details>
<summary>查看原文（25行）</summary>

```text
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
}

/** Move a skill file into its .trash sibling directory (recoverable delete). */
export async function trashSkillFile(path: string): Promise<string> {
  const trashDir = join(dirname(path), '.trash')
  await mkdir(trashDir, { recursive: true })
  const trashTarget = join(trashDir, `${Date.now()}-SKILL.md`)
  await rename(path, trashTarget)
```

</details>

**依据 12 · 源码核查**：[packages/dsh-skill-explorer/src/frontmatter.ts:120-142](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/frontmatter.ts#L120-L142)

toggle实际随机wx临时文件再rename。

<details>
<summary>查看原文（23行）</summary>

```text
export function setFrontmatterField(file: string, field: string, value: boolean): Frontmatter {
  const content = readFileSync(file, 'utf8')
  const match = /^---\r?\n([\s\S]*?)\r?\n---([\s\S]*)$/.exec(content)
  if (match === null) throw new Error(`setFrontmatterField: ${file} has no frontmatter`)
  const blockLines = match[1].split(/\r?\n/)
  const linePattern = new RegExp(`^${field}:`)
  let replaced = false
  const next = blockLines.map((line) => {
    if (linePattern.test(line)) {
      replaced = true
      return `${field}: ${value}`
    }
    return line
  })
  if (!replaced) next.push(`${field}: ${value}`)
  const rewritten = `---\n${next.join('\n')}\n---${match[2]}`
  // Atomic write: tmp file + rename, so a watcher never reads a half-written
  // state. The tmp name is unpredictable and created with O_EXCL ('wx'), so a
  // planted symlink at a guessable name can never redirect the write.
  const tmp = `${file}.${Date.now().toString(36)}.${randomBytes(6).toString('hex')}.tmp`
  try {
    writeFileSync(tmp, rewritten, { encoding: 'utf8', flag: 'wx' })
    renameSync(tmp, file)
```

</details>

**依据 13 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:97-106](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L97-L106)

archive请求4MiB约束。

<details>
<summary>查看原文（10行）</summary>

```text
  if (record.kind === 'archive') {
    const data = record.data
    if (typeof data !== 'string' || data === '') return 'source.data is required for an archive import'
    if (!BASE64_PATTERN.test(data)) return 'source.data must be a base64 string'
    const decoded = Buffer.from(data, 'base64')
    if (decoded.length === 0) return 'source.data decoded to an empty archive'
    if (decoded.length > IMPORT_LIMITS.archiveBytes) {
      return `archive exceeds the ${IMPORT_LIMITS.archiveBytes} byte import limit`
    }
    return { kind: 'archive', data: decoded }
```

</details>

**依据 14 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:36-45](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/import.ts#L36-L45)

各导入声明限额。

<details>
<summary>查看原文（10行）</summary>

```text
export const IMPORT_LIMITS = {
  /** Largest archive the route accepts (a base64 body is larger on the wire). */
  archiveBytes: 4 * 1024 * 1024,
  /** Most entries one archive may carry. */
  entries: 512,
  /** Largest one imported SKILL.md (the same cap the create/edit routes use). */
  skillBytes: 64 * 1024,
  /** Largest total uncompressed skill text one import may produce. */
  totalBytes: 4 * 1024 * 1024,
} as const
```

</details>

**依据 15 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:223-239](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/import.ts#L223-L239)

inflate在长度/总量后验之前，不能证明峰值。

<details>
<summary>查看原文（17行）</summary>

```text
    const compressed = archive.subarray(dataStart, dataEnd)
    let data: Buffer
    if (method === 0) {
      data = Buffer.from(compressed)
    } else {
      try {
        data = inflateRawSync(compressed)
      } catch {
        throw new ImportRequestError(`corrupt zip archive: cannot inflate ${rawName}`)
      }
    }
    if (data.length > uncompressedSize) {
      throw new ImportRequestError(`corrupt zip archive: ${rawName} inflates past its declared size`)
    }
    totalBytes += data.length
    if (totalBytes > IMPORT_LIMITS.totalBytes) {
      throw new ImportRequestError(`archive expands past the ${IMPORT_LIMITS.totalBytes} byte import limit`)
```

</details>

**依据 16 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:275-298](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/import.ts#L275-L298)

目录先读取、一层entry跳链接而非所有叶文件。

<details>
<summary>查看原文（24行）</summary>

```text
export async function candidatesFromDirectory(dir: string): Promise<RawCandidate[]> {
  let info
  try {
    info = await lstat(dir)
  } catch {
    throw new ImportRequestError(`import source is not a readable directory: ${dir}`)
  }
  if (!info.isDirectory()) throw new ImportRequestError(`import source is not a directory: ${dir}`)
  const entries = await readdir(dir, { withFileTypes: true })
  const candidates: RawCandidate[] = []
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory()) {
      const file = join(dir, entry.name, 'SKILL.md')
      if (!existsSync(file)) continue
      candidates.push({ origin: file, content: await readFile(file, 'utf8') })
      continue
    }
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) continue
    const file = join(dir, entry.name)
    candidates.push({ origin: file, content: await readFile(file, 'utf8') })
  }
  return candidates
```

</details>

**依据 17 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:310-321](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/import.ts#L310-L321)

单Skill正文大小在读取后校验。

<details>
<summary>查看原文（12行）</summary>

```text
export function parseCandidate(raw: RawCandidate): { candidate?: ImportCandidate; name: string; reason?: ImportSkipReason } {
  if (Buffer.byteLength(raw.content, 'utf8') > IMPORT_LIMITS.skillBytes) {
    return { name: basename(dirname(raw.origin)), reason: 'too-large' }
  }
  const frontmatter = parseFrontmatter(raw.content)
  const declared = frontmatter.name ?? ''
  const name = declared === '' ? basename(dirname(raw.origin)) : declared
  if (declared === '' || frontmatter.description === undefined || frontmatter.description === '') {
    return { name, reason: 'invalid-frontmatter' }
  }
  if (!isSkillName(declared)) return { name, reason: 'invalid-name' }
  return { name: declared, candidate: { name: declared, content: raw.content, origin: raw.origin } }
```

</details>

**依据 18 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:338-365](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/import.ts#L338-L365)

同名/rank先计划。

<details>
<summary>查看原文（28行）</summary>

```text
export function planImport(
  candidates: readonly ImportCandidate[],
  existing: readonly SkillEntry[],
  targetLevel: string,
): ImportPlanItem[] {
  const targetRank = rankOf(targetLevel)
  const byName = new Map(existing.map(skill => [skill.name, skill]))
  const seen = new Set<string>()
  const plan: ImportPlanItem[] = []
  for (const candidate of candidates) {
    if (seen.has(candidate.name)) {
      plan.push({ candidate, decision: 'skip', reason: 'duplicate' })
      continue
    }
    seen.add(candidate.name)
    const current = byName.get(candidate.name)
    if (current !== undefined) {
      const currentRank = rankOf(current.level)
      if (currentRank < targetRank) {
        plan.push({ candidate, decision: 'skip', reason: 'shadowed' })
        continue
      }
      if (currentRank === targetRank) {
        plan.push({ candidate, decision: 'skip', reason: 'exists' })
        continue
      }
    }
    plan.push({ candidate, decision: 'import' })
```

</details>

**依据 19 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:379-401](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/import.ts#L379-L401)

wx独占创建但整批无catch/rollback。

<details>
<summary>查看原文（23行）</summary>

```text
export async function executeImport(plan: readonly ImportPlanItem[], baseDir: string): Promise<ImportOutcome[]> {
  const outcomes: ImportOutcome[] = []
  for (const item of plan) {
    const { candidate } = item
    if (item.decision === 'skip') {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: item.reason })
      continue
    }
    const targetDir = join(baseDir, candidate.name)
    const target = join(targetDir, 'SKILL.md')
    if (existsSync(target)) {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: 'exists' })
      continue
    }
    // The name is a validated kebab-case skill name, so this can only ever
    // create one directory directly under the target root. The write itself
    // uses O_EXCL ('wx'), so two concurrent imports of the same name cannot
    // both win even if both pass the existsSync check above.
    await mkdir(targetDir, { recursive: true })
    await writeFile(target, candidate.content, { encoding: 'utf8', flag: 'wx' })
    outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'imported', path: target })
  }
  return outcomes
```

</details>

**依据 20 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:455-469](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L455-L469)

实际导入调用和失败500，不附已落盘清单。

<details>
<summary>查看原文（15行）</summary>

```text
          const workspace = panelCwd(cwd)
          const targetLevel = root === 'user' ? 'user-dsh' : 'project-dsh'
          const baseDir = root === 'user' ? userSkillRoot(dshHome) : projectSkillRoot(findProjectRoot(cwd))
          const { skills } = await collectSkills(await collectOptions(workspace))
          const report = await importSkills({ baseDir, targetLevel, source: resolved, existing: skills })
          writeJson(res, 200, { ok: true, ...report })
        } catch (error) {
          // A malformed archive or an unreadable source directory is the
          // request's problem, not the host's: say so instead of a 500.
          if (error instanceof ImportRequestError) {
            writeJson(res, 400, { error: error.message })
            return
          }
          logger.warn(error)
          writeJson(res, 500, { error: error instanceof Error ? error.message : String(error) })
```

</details>

**依据 21 · 源码核查**：[packages/dsh-skill-explorer/src/provider-toggles.ts:195-209](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/provider-toggles.ts#L195-L209)

面板偏好read-modify-write未序列化。

<details>
<summary>查看原文（15行）</summary>

```text
export async function setProviderSkillEnabled(
  dshHome: string,
  identity: ProviderSkillIdentity,
  enabled: boolean,
): Promise<ProviderToggleDocument> {
  const doc = await readProviderToggles(dshHome)
  const stored = doc.disabled.some((entry) => keyOf(entry) === keyOf(identity))
  if (stored === !enabled) return doc
  const disabled = (enabled
    ? doc.disabled.filter((entry) => keyOf(entry) !== keyOf(identity))
    : [...doc.disabled, identity]
  ).sort(compareIdentities)
  const next: ProviderToggleDocument = { version: 1, disabled }
  await writeJsonAtomic(providerToggleFile(dshHome), serializeProviderToggles(next))
  return next
```

</details>

**依据 22 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:273-283](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L273-L283)

编辑读取只给剥去frontmatter的正文及少数元数据。

<details>
<summary>查看原文（11行）</summary>

```text
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          const raw = readFileSync(skill.path, 'utf8')
          const frontmatter = parseFrontmatter(raw)
          writeJson(res, 200, {
            name,
            path: skill.path,
            description: frontmatter.description ?? skill.description,
            ...(frontmatter.whenToUse === undefined ? {} : { whenToUse: frontmatter.whenToUse }),
            content: stripFrontmatter(raw).trim(),
          })
```

</details>

**依据 23 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:510-514](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L510-L514)

更新只额外保留disable-model-invocation。

```text
          // The enabled state is not part of the edit form: carry it over so an
          // edit never silently re-enables a disabled skill.
          const disabled = parseFrontmatter(readFileSync(skill.path, 'utf8')).disableModelInvocation === true
          const target = await overwriteSkillFile(skill.path, name, description.trim(), typeof whenToUse === 'string' ? whenToUse : undefined, content, disabled)
          writeJson(res, 200, { ok: true, name, path: target, disabled })
```

**依据 24 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:568-594](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L568-L594)

编辑以限定字段重建，非保留所有frontmatter。

<details>
<summary>查看原文（27行）</summary>

```text
/** Build the new skill file content (create route). */
export function buildSkillContent(name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): string {
  const lines = ['---', `name: ${name}`, `description: ${yamlQuote(description.replace(/[\r\n]/gu, ' '))}`]
  if (typeof whenToUse === 'string' && whenToUse.trim() !== '') lines.push(`whenToUse: ${yamlQuote(whenToUse.replace(/[\r\n]/gu, ' '))}`)
  if (disabled === true) lines.push('disable-model-invocation: true')
  lines.push('---', '', content.trim(), '')
  return lines.join('\n')
}

/** Create a skill file (mkdir -p + write). Returns the absolute target path. */
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
```

</details>

**依据 25 · 源码核查**：[packages/dsh-skill-explorer/src/frontmatter.ts:94-98](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/frontmatter.ts#L94-L98)

user-invocable有独立语义。

```text
    else if (key === 'whenToUse') out.whenToUse = unquote(rest)
    else if (key === 'disable-model-invocation') out.disableModelInvocation = parseYamlBool(rest)
    else if (key === 'user-invocable') out.userInvocable = parseYamlBool(rest)
    else if (key === 'recordInput') out.recordInput = parseYamlBool(rest)
  }
```

**依据 26 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:381-383](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L381-L383)

遗漏user-invocable后本扫描默认true。

```text
      // Official frontmatter invocation policy.
      modelInvocable: parsed.disableModelInvocation !== true,
      userInvocable: parsed.userInvocable !== false,
```

#### 缺口

- 叶文件链接/并发、解压资源峰值与批量半完成未运行复现
  **影响**：限制链接/可信导入和单写小样，不能承诺完整事务、所有链接保护或资源硬上限
  **进一步探讨**：后续隔离副本用无害链接、并发同名创建/不同开关、导入第N项失败核真实目标和落盘结果；未知先停重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁可先用，启动/持续/恢复和退出代价是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

有多根普通Skill文件维护需求、文件只含本编辑器支持的frontmatter字段、能看完整文件diff与目标会话目录的人可在备份测试根有限试用：先只读核来源，再一次创建/编辑/删除或小批可信导入；不用它管理全局权限。禁用provider或preset技能要从真实provider/会话配置处理，不能依靠面板开关。本轮未装包、运行作者测试或访问真实宿主，声明最低版本与slots接线不等安装验收。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH>=0.2.1-rc.3与webServer/skills/sessions | host必需 | API及registry/workspace来源 | 缺注入不挂载；registry异常只给部分结果 |
| Web renderer/locale/layout及原生slot seats | GUI必需 | 页面/导航与本地化 | 无seat可无入口，注册错误降级不等可用 |
| 已备份、已核根目录/写权限 | 写管理前提 | 真实Skill文件改动 | cwd/路径字符串不是全文件隔离或版本史 |
| 小型可信目录/zip、所需资源另保 | 导入前提 | 只复制Skill正文文件 | 其它scripts/资源不复制，导入可能语义不完整 |
| 受信本地浏览器，或另核配对服务 | 访问前提 | 请求fence | 额外paired路径不由本包独立认证 |
| 官方目标会话skill目录回读能力 | 判断生效必需 | 对账实际可调用项 | 面板显示/complete不替该判断 |

#### 使用步骤

| 阶段 | 动作与执行者 | 判据及失败处理 |
|---|---|---|
| 配置和备份 | 用户核DSH/插件版本、当前workspace、用户/自定义根和链接 | 备份文件与资源，试用前不让不可信仓库链接导向真实资料 |
| 只读对照 | 比面板与目标会话官方目录，同名/不同workspace各一项 | 不把全局Map或preset缺项当模型事实 |
| 单写 | 写前确认字段范围，一次编辑/开关后核完整diff与真实目标 | 非支持字段用原文件编辑器；provider偏好另记，409先刷新，不同时多窗口写 |
| 可信小批导入/回收 | 核每项写入、资源依赖与.trash位置 | 500先查已有文件；不盲重试、不导入未知大包 |
| 退出 | 停插件/释放页面路由，保文件/偏好备份 | 停插件不撤已写文件；编辑靠外部备份恢复，provider能力另管 |

#### 全周期成本

| 阶段 | 现金与资源 | 人工与时间 | 条件与未知 |
|---|---|---|---|
| 首次 | 插件/扫描/备份存储；金额未知 | 选正确根、版本/slot和目录可信度 | 未测安装兼容/配置耗时 |
| 持续 | 全根扫描/读文件及导入资源；未知 | 编辑/冲突、真实会话可用性对账 | 未测扫描延迟与净维护节时 |
| 失败恢复 | 可能部分导入、旧文件备份/.trash | 核实际目标/已写项/并发丢偏好，再决定恢复 | 编辑可能丢额外frontmatter且无自动前像，恢复时间未知 |
| 升级退出 | 偏好/文件保留与迁移成本未知 | 停配对授权/插件、保资源和备份 | 禁用/卸载不撤文件或宿主provider技能 |

#### 效果

| 效果项 | 当前材料支持 | 未确认的效果 |
|---|---|---|
| 管理目录 | 来源/rank/registry与原生GUI接线 | 每个会话全覆盖、跨workspace同名一一对应 |
| 写目标校验 | fresh name/path、标linked拒写、原子toggle | 叶文件链接、内容版本CAS、所有并发写正确 |
| 导入和恢复 | wx不覆盖、逐项计划、.trash移动 | 整批失败原子、解压峰值和编辑完整回滚 |
| 调用策略 | 文件声明及provider面板偏好可改 | 等价实际模型撤权或preset全视图 |

浏览器apply还实际调用共享心跳到https://dsh-market.com/api/telemetry/event，载荷含localStorage随机visitor和本包名，构建版本存在时也附version。它不是完全离线；DNT或family opt-out抑制、storage不可用不发，失败静默。本项只核客户端实际载荷/开关，不把注释中服务端“不存IP/加盐”等声明写成独立隐私审计。

输出/目标不符、来源或会话状态未知、导入500、链接布局未核或多个窗口争写时，停止写入与重复导入，查实际文件、diff、.trash和目录再人工回退备份；需要完整权限治理、全Scope catalog或恶意包隔离者保持原办法/先观察。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/package.json:23-37](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/package.json#L23-L37)

DSH/client服务平台声明。

<details>
<summary>查看原文（15行）</summary>

```text
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
  },
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:23-24](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/index.ts#L23-L24)

host真实必需注入。

```text
/** Services required before the skill center routes can mount. */
export const inject = ['webServer', 'skills', 'sessions']
```

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/client/native-panel.tsx:100-124](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/native-panel.tsx#L100-L124)

slot就绪才挂载，effect释放。

<details>
<summary>查看原文（25行）</summary>

```text
export function registerSkillExplorerPanel(ctx: ClientContext, controller: PanelController, api: SkillApi): () => void {
  const slots = ctx.slots as {
    inject(key: string, callback: () => () => void): () => void
    register(options: Record<string, unknown>, component: unknown): () => void
  }
  const disposers: Array<() => void> = []

  disposers.push(slots.inject('sidebar.panellist', () => slots.register({
    name: 'sidebar.panellist',
    id: SKILL_EXPLORER_PANEL_ID,
    order: PANEL_ORDER,
    // The shell resolves this through resolveSlotLabel on every locale change,
    // so the module-level translate reads the active language at call time.
    label: () => tt('entry.label'),
  }, SkillExplorerPanelIcon)))

  disposers.push(slots.inject('main', () => slots.register({
    name: 'main',
    key: SKILL_EXPLORER_PANEL_ID,
    inject: (): PanelFace => ({ controller, api }),
  }, SkillExplorerPanelPage as never)))

  return () => {
    for (const dispose of disposers.splice(0)) dispose()
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/client/index.ts:97-103](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/index.ts#L97-L103)

注册失败降级与释放。

```text
  } catch (error) {
    // Registration failures degrade the panel, never the GUI.
    console.warn('[skill-explorer] panel registration failed:', error)
  }
  ctx.effect(() => () => {
    for (const dispose of disposers.splice(0)) dispose()
  }, 'skill-explorer: ui mounts')
```

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/client/locales.ts:39-40](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/locales.ts#L39-L40)

已有provider视图偏好提示。

```text
  'list.providerFileTooltip': '该技能的文件由插件 provider 提供，未落在本面板扫描的技能根目录下',
  'list.providerFileHint': '该技能由插件提供、确有 SKILL.md 文件，但不在本面板扫描的技能根目录下，因此无法在此编辑或删除；开关只改变本面板的可调用视图，不会改变模型实际加载的技能。',
```

**依据 6 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:153-171](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/README.zh.md#L153-L171)

作者明示preset/链接/导入非资源包。

<details>
<summary>查看原文（19行）</summary>

```text
- frontmatter 解析为零依赖轻量实现（块标量、布尔、input 嵌套块）；不支持的
  生僻 YAML 特性以官方 dsh-skill-filesystem 提供方为准。
- 面板覆盖它扫描的文件系统根，加上 `ctx.skills` 注册表的全局层（bundled 与
  runtime 条目）。配在 host 平面 `skill-filesystem` 行上的 `customSkillDirs`
  会被扫描，因为宿主会读取该行配置；仅通过**某个 agent preset 自己的**
  `customSkillDirs` 或 preset 作用域提供方到达 agent 的技能不在此覆盖范围内，
  因为面板读取注册表时不带 viewing scope。因此面板里没有的技能，不一定模型也没有：
  会话能加载什么，以官方 `skill` 工具目录为准。
- **「由插件提供」**行的开关是**仅本面板生效**的视图决定：它改变的是本面板
  列出的可调用状态，宿主注册表照旧加载该技能，模型仍会收到它。要真正让这类
  技能不再进入模型，需要在它的 provider 获取它的位置（插件配置或随包文件）
  移除或停用它。
- 链接技能不可删除、不可编辑（见安全模型）；启用/禁用对链接技能正常（改写目标
  `SKILL.md` frontmatter）。目录型与「单文件」链接都能正常列出；「单文件」
  符号链接（指向单个 `.md`）在原子改写（rename）时会被替换为一个普通文件
  （链接不再保留），目标文件本身不受影响。
- 目录导入只读取一层、不递归：嵌套的目录树需要指向真正存放技能的那个目录。
  `.zip` 导入接受任意深度的 `SKILL.md`，因此「把技能目录压缩成包」可用，但压缩包里的
  其他文件会被忽略，而不会作为资源一并复制。
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:379-401](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/import.ts#L379-L401)

小批失败可能已落盘。

<details>
<summary>查看原文（23行）</summary>

```text
export async function executeImport(plan: readonly ImportPlanItem[], baseDir: string): Promise<ImportOutcome[]> {
  const outcomes: ImportOutcome[] = []
  for (const item of plan) {
    const { candidate } = item
    if (item.decision === 'skip') {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: item.reason })
      continue
    }
    const targetDir = join(baseDir, candidate.name)
    const target = join(targetDir, 'SKILL.md')
    if (existsSync(target)) {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: 'exists' })
      continue
    }
    // The name is a validated kebab-case skill name, so this can only ever
    // create one directory directly under the target root. The write itself
    // uses O_EXCL ('wx'), so two concurrent imports of the same name cannot
    // both win even if both pass the existsSync check above.
    await mkdir(targetDir, { recursive: true })
    await writeFile(target, candidate.content, { encoding: 'utf8', flag: 'wx' })
    outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'imported', path: target })
  }
  return outcomes
```

</details>

**依据 8 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:578-602](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L578-L602)

编辑/回收实际范围。

<details>
<summary>查看原文（25行）</summary>

```text
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
}

/** Move a skill file into its .trash sibling directory (recoverable delete). */
export async function trashSkillFile(path: string): Promise<string> {
  const trashDir = join(dirname(path), '.trash')
  await mkdir(trashDir, { recursive: true })
  const trashTarget = join(trashDir, `${Date.now()}-SKILL.md`)
  await rename(path, trashTarget)
```

</details>

**依据 9 · 源码核查**：[packages/dsh-skill-explorer/src/client/index.ts:50-53](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/index.ts#L50-L53)

真实apply调用共享心跳。

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-client-ui-skill-explorer' }])
```

**依据 10 · 源码核查**：[packages/dsh-skill-explorer/src/client/telemetry.ts:29-34](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/telemetry.ts#L29-L34)

退出key与远端endpoint。

```text
/** localStorage key carrying the family-wide telemetry opt-out ('1' = off). */
export const TELEMETRY_OPT_OUT_KEY = 'dsh-web-ui-telemetry-opt-out'

const VISITOR_KEY = 'dsh-web-ui-telemetry-visitor'
const DAY_KEY_PREFIX = 'dsh-web-ui-telemetry-day:'
const ENDPOINT = 'https://dsh-market.com/api/telemetry/event'
```

**依据 11 · 源码核查**：[packages/dsh-skill-explorer/src/client/telemetry.ts:71-96](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/telemetry.ts#L71-L96)

DNT与storage条件。

<details>
<summary>查看原文（26行）</summary>

```text
/** Whether the browser itself asks not to be tracked; a failed read means no signal. */
function doNotTrackRequested(): boolean {
  try {
    // '1' per the DNT header spec, 'yes' from older Firefox builds.
    return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes'
  } catch {
    return false
  }
}

/** Whether a heartbeat must be suppressed right now: opt-out stored, or the browser asks not to be tracked. */
export function isTelemetrySuppressed(): boolean {
  return isTelemetryOptedOut() || doNotTrackRequested()
}

/** Read or lazily create the anonymous visitor id; null when storage is unavailable. */
function visitorId(): string | null {
  try {
    const existing = localStorage.getItem(VISITOR_KEY)
    if (existing && /^[A-Za-z0-9_-]{16,64}$/.test(existing)) return existing
    const fresh = crypto.randomUUID().replaceAll('-', '')
    localStorage.setItem(VISITOR_KEY, fresh)
    return fresh
  } catch {
    // Storage unavailable (privacy mode, sandboxed frame): report nothing.
    return null
```

</details>

**依据 12 · 源码核查**：[packages/dsh-skill-explorer/src/client/telemetry.ts:119-149](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/telemetry.ts#L119-L149)

实际visitor/pkg/version载荷、成功才标日与静默失败。

<details>
<summary>查看原文（31行）</summary>

```text
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
```

</details>

#### 缺口

- 真实宿主、扫描时延、管理节时和恢复成功率未测
  **影响**：只能限定普通文件管理小样，不支持安装或全局策略推荐
  **进一步探讨**：授权后备份测试根对比手工同任务，计错目标/冲突/实际生效误判/恢复工时和所需资源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些改进值得验证而非重复已有功能？

**研究主题**：新假设与验证

#### 完整回答

待验证方向是给多来源Skill文件变更加“预览版本/真实文件实体—实际落盘结果”对账收据，而不是再造文件浏览器或再加一个含义不明的总开关。现组件已经有fresh name/path重查、来源rank、原子toggle、wx导入、provider提示和回收站；不能假设这些都不存在。新增问题在路径字符串不能证明叶文件真实实体/内容未变，编辑还会重建限定字段而丢额外frontmatter，编辑与创建并发没有版本CAS，整批导入中途错误可能没有实际已创建列表。

最小方案先针对当前组件做上游改进试验：预览保存内容版本与lstat/真实目标身份，提交前在明确支持的文件系统条件下再核；预览展示完整frontmatter差异，未知字段不默默丢；目录中SKILL.md自身链接明确拒绝或显式展示目标；每项导入写前/写后留可读结果，错误返回保留已落盘/未执行/未知区分。它不因为写了receipt就自动回滚外部目标、不替宿主会话权限，也不把尚未实现的原子性当现功能。

用同样备份小样比较现fresh路径校验与新对账机制：未知/调用策略frontmatter、叶链接、预览后外部改文件、两个创建者竞争、导入第N项I/O失败、刷新失败保旧页，测字段丢失、错目标、丢更改、请求失败却误判全没做、恢复工时和额外操作。若简单补丁或版本控制已足够、机制不能可靠识别未知，或人工成本更高，就否定独立插件产品，优先改当前组件。当前没有真实用户需求/收益对照，不给这个假设已有创新分。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:218-233](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/routes.ts#L218-L233)

现有fresh字符串路径身份。

<details>
<summary>查看原文（16行）</summary>

```text
  const resolveScannedSkill = async (
    name: string,
    expectedPath: string,
    cwd: string,
    res: ServerResponse,
  ): Promise<(SkillEntry & { path: string }) | undefined> => {
    const skill = await findSkill(name, cwd)
    if (skill?.path === undefined) {
      writeJson(res, 404, { error: `skill ${name} has no editable file` })
      return undefined
    }
    if (skill.path !== expectedPath) {
      writeJson(res, 409, { error: `skill ${name} changed since the panel loaded; refresh and retry` })
      return undefined
    }
    return skill as SkillEntry & { path: string }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:315-341](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L315-L341)

叶文件与根entry链接识别差异。

<details>
<summary>查看原文（27行）</summary>

```text
    let file: string
    let linked = false
    if (entry.isDirectory()) {
      file = join(root, name, 'SKILL.md')
    } else if (entry.isFile() && name.endsWith('.md')) {
      file = join(root, name)
    } else if (entry.isSymbolicLink()) {
      // A symlink's dirent is neither a directory nor a file, so a plain
      // readdir() skips it and linked-out skills never show up. Follow the
      // target with stat() (cross-platform: Windows symlink/junction, Linux and
      // macOS symlink all resolve the same way) to classify it, then resolve
      // the file path like a real entry — the scan path stays on the link, so
      // the write route (set-enabled) reaches the linked target via the normal
      // fs follow semantics. Dangling or unreadable links are skipped.
      // A linked skill is mount-of-intent content, not created under this root:
      // it stays listable and toggleable, but deletion is refused (see routes).
      linked = true
      let linkedFile: string
      try {
        const target = await stat(join(root, name))
        if (target.isDirectory()) linkedFile = join(root, name, 'SKILL.md')
        else if (target.isFile() && name.endsWith('.md')) linkedFile = join(root, name)
        else continue
      } catch {
        continue
      }
      file = linkedFile
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:578-602](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/collect.ts#L578-L602)

创建/编辑/回收实际操作。

<details>
<summary>查看原文（25行）</summary>

```text
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
}

/** Move a skill file into its .trash sibling directory (recoverable delete). */
export async function trashSkillFile(path: string): Promise<string> {
  const trashDir = join(dirname(path), '.trash')
  await mkdir(trashDir, { recursive: true })
  const trashTarget = join(trashDir, `${Date.now()}-SKILL.md`)
  await rename(path, trashTarget)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:379-401](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/import.ts#L379-L401)

已有wx但批量错误未回滚/对账。

<details>
<summary>查看原文（23行）</summary>

```text
export async function executeImport(plan: readonly ImportPlanItem[], baseDir: string): Promise<ImportOutcome[]> {
  const outcomes: ImportOutcome[] = []
  for (const item of plan) {
    const { candidate } = item
    if (item.decision === 'skip') {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: item.reason })
      continue
    }
    const targetDir = join(baseDir, candidate.name)
    const target = join(targetDir, 'SKILL.md')
    if (existsSync(target)) {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: 'exists' })
      continue
    }
    // The name is a validated kebab-case skill name, so this can only ever
    // create one directory directly under the target root. The write itself
    // uses O_EXCL ('wx'), so two concurrent imports of the same name cannot
    // both win even if both pass the existsSync check above.
    await mkdir(targetDir, { recursive: true })
    await writeFile(target, candidate.content, { encoding: 'utf8', flag: 'wx' })
    outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'imported', path: target })
  }
  return outcomes
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/frontmatter.ts:135-142](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/frontmatter.ts#L135-L142)

已有原子toggle，非假设缺失。

```text
  const rewritten = `---\n${next.join('\n')}\n---${match[2]}`
  // Atomic write: tmp file + rename, so a watcher never reads a half-written
  // state. The tmp name is unpredictable and created with O_EXCL ('wx'), so a
  // planted symlink at a guessable name can never redirect the write.
  const tmp = `${file}.${Date.now().toString(36)}.${randomBytes(6).toString('hex')}.tmp`
  try {
    writeFileSync(tmp, rewritten, { encoding: 'utf8', flag: 'wx' })
    renameSync(tmp, file)
```

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/client/locales.ts:39-40](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-skill-explorer/src/client/locales.ts#L39-L40)

已有provider提示，方向不重复提示。

```text
  'list.providerFileTooltip': '该技能的文件由插件 provider 提供，未落在本面板扫描的技能根目录下',
  'list.providerFileHint': '该技能由插件提供、确有 SKILL.md 文件，但不在本面板扫描的技能根目录下，因此无法在此编辑或删除；开关只改变本面板的可调用视图，不会改变模型实际加载的技能。',
```

#### 缺口

- 版本/实体收据未实现，目标文件系统条件与需求未测
  **影响**：只是待证伪方向，不证明新插件必要
  **进一步探讨**：先上述故障小样对照，简单上游修正足够或额外负担更高则停止独立产品。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
