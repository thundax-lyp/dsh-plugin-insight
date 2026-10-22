# 插件名片

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c7d92ef](https://github.com/3Tiga3/dsh-plugin-namecards/tree/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3Tiga3/dsh-plugin-namecards) [![npm 30d 860](https://img.shields.io/static/v1?label=npm+30d&message=860&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards)
<!-- END META -->

> **实现功能**：为DSH插件换图标、中文备注和说明，支持文件夹、收藏、排序、导入导出及启停卸载。

> **核心亮点**：以稳定包/子行键把本地显示覆盖、整理与可搬运名片交付接入官方页和独立管理页，减少手改元数据。详见[Q01](#research-q01)。

> **风险与缺陷**：只显示的定位遗漏真实卸载路由；回环peer不等用户授权，图标内容和整包恢复边界尚不闭合。详见[Q02](#research-q02)。

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
  - [Q01 · 名片管理解决谁的什么任务，“只改显示”准确吗？](#detail-section-11)
  - [Q02 · 本地路由和图标链有哪些保护，可信边界在哪里？](#detail-section-12)
  - [Q03 · 持久化、导入导出和页面更新是否构成可靠恢复闭环？](#detail-section-13)
  - [Q04 · 启动、使用与三阶段成本怎么核算？](#detail-section-14)
  - [Q05 · 推荐边界与未来可证伪改进是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：插件多且需本地中文备注与分组查找的单用户场景。详见[Q01](#research-q01)。

官方插件列表、外部备注清单或手改元数据；本项提供本地覆盖和组织资产，不改变插件功能。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 官方列表装饰 | 中文名/说明/图标覆盖 | 包名与rowId定位，内部pm ABI |
| 名片管理页 | 分组收藏排序和两视图 | 本地HOME共享，不能视为profile隔离 |
| 导入导出 | 搬运名片与引用图标 | 4MiB导入预算，非事务恢复 |
| 启停/卸载 | 调官方管理器 | 真实副作用，卸载要求removable |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH webServer/pluginManager | 路由/官方管理与装饰 | 内部ABI，版本声明无上界 |
| Web React/slots | 名片管理页和详情区块 | 官方刷新部分依DOM/中文文本 |
| 本地HOME可写 | JSON/图标持久化 | 默认不含profile，旧目录复制 |
| 可信图标/导入JSON | 样式与恢复 | peer不是身份；SVG不净化 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 备份旧数据并核宿主 | 用户 | HOME/profile与内部ABI明确 |
| 安装并重启 | 宿主/用户 | host路由和UI注册可用 |
| 整理并保存名片 | 用户 | 原包名/子行身份可对照 |
| 导出与管理操作 | 用户 | 备份预算可恢复，卸载确认目标 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地DSH Web/桌面宿主、名片JSON和图标磁盘，金额未知 | 核兼容、备份既有数据、整理备注/文件夹，工时未知 | 需webServer/pluginManager/slots内部契约；不自带模型或云账户 |
| 持续使用 | 同步磁盘读写与本地HTTP、图标空间 | 维护分类/原名对照，导出备份，耗时未知 | 本插件无外部模型调用；列表规模和图标数量影响开销，无测量 |
| 失败恢复 | 旧目录/导出JSON及图标备份、重装宿主插件资源 | 恢复损坏JSON、比对导入结果、重核实际启停/删除状态，工时未知 | 导入4MiB上限可能拒收大导出；没有自动历史回退或多进程冲突合并 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 按备注/文件夹找插件 | 本地名片与两视图 | 检索工时和误操作减少幅度 |
| 真实管理 | 官方开关与removable核查后卸载 | 宿主授权/重启生效契约 |
| 迁移整理资产 | JSON带引用图标base64 | 大包/损坏/部分写失败恢复 |

> **思考**：只显示的定位遗漏真实卸载路由；回环peer不等用户授权，图标内容和整包恢复边界尚不闭合。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：以稳定包/子行键把本地显示覆盖、整理与可搬运名片交付接入官方页和独立管理页，减少手改元数据。详见[Q01](#research-q01)。

以稳定包/子行键把本地显示覆盖、整理与可搬运名片交付接入官方页和独立管理页，减少手改元数据。详见[Q01](#research-q01)。

safe键/路径、有限正文、原子rename及条件恢复wrapper可借鉴；身份认证、活动SVG、事务导入与生命周期清理各有具体限制。详见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

只显示的定位遗漏真实卸载路由；回环peer不等用户授权，图标内容和整包恢复边界尚不闭合。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，继续研究从授权边界、可信图标和可恢复备份着手。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

展示/管理增量已由源码确认；权限与备份边界需收窄，分权可验证备份为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js、test/run-host.mjs、test/run-client.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整1038行发布host；客户端的数据模型、编辑、启停卸载、导入导出、刷新和注册关键链；host测试与client注册测试只读，未执行目标。
- 下一步：比较固定插件集合检索/误操作，按代理peer、活动图标、坏JSON、超预算导出和多profile反例核边界。

**分析版本**

- **仓库**：[3Tiga3/dsh-plugin-namecards](https://github.com/3Tiga3/dsh-plugin-namecards)
- **版本号**：0.6.2（[固定提交 c7d92ef](https://github.com/3Tiga3/dsh-plugin-namecards/tree/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分离显示与管理授权，并用按profile的hash manifest和事务导入确保备份可恢复；按越权/坏图/超预算/竞争反例证伪，未验证。详见[Q05](#research-q05)。

比较固定插件集合检索/误操作，按代理peer、活动图标、坏JSON、超预算导出和多profile反例核边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2136 | 1892 | 83 | — |
| .md | source | 1 | 70 | — | — | 840 |
| .mjs | test | 2 | 449 | 403 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3Tiga3/dsh-plugin-namecards/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/3Tiga3/dsh-plugin-namecards/issues?q=is%3Aissue+created%3A2026-09-22T09%3A38%3A34.514Z..2026-10-22T09%3A38%3A34.514Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3Tiga3/dsh-plugin-namecards/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A38%3A34.514Z..2026-10-22T09%3A38%3A34.514Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**固定版名片管理能否可信、可恢复地降低插件查找与管理负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 名片管理解决谁的什么任务，“只改显示”准确吗？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

适合本机插件较多、希望按熟悉中文名/用途和文件夹找回工具的用户。合格结果是原包/子行身份仍可定位，备注、说明、图标和排序重启后保留，官方列表可显示本地名片。相比记包名、手改插件元数据或外部清单，本项以包名和包名#rowId组织展示覆盖，新增收藏、拖拽、两视图与含图标导入导出，把找插件和整理接到同一页面。它不更改插件功能或翻译插件代码。

“只改显示”须限定为listBundles包装器这一条链。decorateMeta复制meta、row按组合键覆盖，unload仅当仍是自己的wrapped才恢复原方法，避免直接写插件源码。但decorateList在无包级名片时next仍是原pkg，随后给next.rows重新赋数组，故不是所有返回对象都完全无共享修改。独立管理页还有真实setBundleEnabled/setPluginEnabled，且发布源码与UI提供removeBundle卸载，不止README所谓唯一启用开关写操作。该管理能力是实际交付增量，也使名片工具具备真实管理权限，不能按纯皮肤理解。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-19](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/README.md#L1-L19)

用途与两个页面的作者说明。

<details>
<summary>查看原文（19行）</summary>

```text
# 插件名片（dsh-plugin-namecards）

给 DSH「插件」页里的插件换**图标**、**中文名（备注）**和**中文说明**，并用文件夹、收藏、拖拽排序、列表/铺陈两种视图来管理。只改显示：不修改插件文件、不写 cordis 配置；唯一的写操作是你在界面里拨动的启用开关（转调官方插件管理器）。

## 两个页签

| 页签 | 作用 |
| --- | --- |
| 已安装 | 官方页面；列表里的图标/名称/说明会被名片覆盖 |
| 插件管理 | 编辑名片 + 文件夹 + 收藏 + 排序 + 列表/铺陈 + 启停开关 |

## 插件管理

- 工具栏：搜索 · 列表/铺陈 · ＋新建文件夹 · 按备注名排序 · 启用名片覆盖 · **导入** · **导出** · 刷新；
- **列表**：收藏 → 自定义文件夹 → 未分组；组合包行可展开子行；行上可收藏、开关、更多操作；
- **按备注名排序**：对所有文件夹与文件夹弹窗生效（备注名拼音）；关闭后回到拖拽顺序；
- **铺陈**：图标网格（72px），图标下是开关和备注名；文件夹是缩略方块，点开后只有图标，点弹窗外空白退出；
- 点插件行/图标 → 右侧「编辑名片」抽屉：图标、**中文说明**（支持多行，列表只显示单行省略号）、**备注（显示名称）**、**所在文件夹**；点抽屉外空白或 Esc 关闭；
- 「**恢复预设**」：一键清空自定义名片与布局，重新生成默认图标、实验性插件文件夹、子代理插件文件夹与官方中文备注；
```

</details>

**依据 2 · 源码核查**：[lib/index.js:499-539](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L499-L539)

meta/rows装饰边界。

<details>
<summary>查看原文（41行）</summary>

```text
}

/* ------------------------------------------------------------------ */
/* 名片 → meta 装饰                                                    */
/* ------------------------------------------------------------------ */

function iconUrl(icon) {
  if (typeof icon !== 'string') return undefined
  if (icon.startsWith('builtin:')) return ROUTE + '/icon/builtin/' + icon.slice(8) + '.svg'
  if (icon.startsWith('file:')) return ROUTE + '/icon/file/' + icon.slice(5)
  return undefined
}

function decorateMeta(meta, card) {
  const source = meta && typeof meta === 'object' ? meta : {}
  const next = { ...source }
  // 备注 = 显示名称（取代原包名）；中文说明 = 名称下面那一行介绍。
  if (card.note) next.title = card.note
  if (card.description) next.description = card.description
  const icon = iconUrl(card.icon)
  if (icon && !(card.autoAssigned === true && typeof source.icon === 'string' && source.icon.length > 0)) next.icon = icon
  return next
}

function decorateList(list, store) {
  if (!Array.isArray(list)) return list
  if (store.enabled === false) return list
  const cards = store.cards || {}
  return list.map((pkg) => {
    if (!pkg || typeof pkg !== 'object' || typeof pkg.name !== 'string') return pkg
    const own = cards[pkg.name]
    const next = own === undefined ? pkg : { ...pkg, meta: decorateMeta(pkg.meta, own) }
    if (Array.isArray(next.rows) && next.rows.length > 0) {
      next.rows = next.rows.map((row) => {
        if (!row || typeof row !== 'object' || typeof row.rowId !== 'string') return row
        const card = cards[pkg.name + '#' + row.rowId]
        return card === undefined ? row : { ...row, meta: decorateMeta(row.meta, card) }
      })
    }
    return next
  })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:972-999](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L972-L999)

包装及条件恢复。

<details>
<summary>查看原文（28行）</summary>

```text
function installWrap(sub, originalList) {
  const pm = realService(sub.pluginManager)
  if (!pm || typeof pm.listBundles !== 'function' || pm[PATCHED] === true) return
  const original = pm.listBundles
  originalList.current = original
  const wrapped = async function (...args) {
    const result = await original.apply(pm, args)
    try {
      ensureAutoIcons(result)
      return decorateList(result, loadStore())
    } catch (error) {
      log('warn', '名片装饰失败，返回原始数据：', String(error))
      return result
    }
  }
  try {
    pm.listBundles = wrapped
    pm[PATCHED] = true
  } catch (error) {
    log('warn', '无法包装 pluginManager.listBundles：', String(error))
    return
  }
  sub.effect(() => () => {
    if (pm.listBundles === wrapped) {
      try { pm.listBundles = original } catch {}
    }
    try { delete pm[PATCHED] } catch {}
  }, 'dsh-plugin-namecards: restore listBundles')
```

</details>

**依据 4 · 源码核查**：[lib/index.js:884-900](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L884-L900)

真实卸载路由。

<details>
<summary>查看原文（17行）</summary>

```text
      if (path === ROUTE + '/remove') {
        const name = typeof body.name === 'string' ? body.name : ''
        if (!SAFE_KEY.test(name)) return sendJson(res, 400, { ok: false, error: 'bad name' })
        const pm = managerOf(ctx)
        if (!pm || typeof pm.removeBundle !== 'function') return sendJson(res, 400, { ok: false, error: 'removeBundle unavailable' })
        const list = await listOriginal()
        const bundle = Array.isArray(list) ? list.find((item) => item && item.name === name) : undefined
        if (!bundle || bundle.removable !== true) return sendJson(res, 400, { ok: false, error: '该插件不可卸载' })
        try {
          const result = await pm.removeBundle(name)
          log('removed bundle', name)
          return sendJson(res, 200, { ok: true, result })
        } catch (error) {
          log('warn', '卸载插件失败：', String(error))
          return sendJson(res, 500, { ok: false, error: String(error && error.message ? error.message : error) })
        }
      }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:556-574](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/client.js#L556-L574)

卸载确认和官方调用。

<details>
<summary>查看原文（19行）</summary>

```text
      function confirmRemove(target) {
        const name = target.bundleName
        setDialog({
          kind: "confirm", title: "删除插件",
          text: "将把「" + target.title + "」从当前 profile 中卸载（" + name + "）。插件文件会从 profile 移除，可随时重新安装。",
          okText: "删除插件",
          onOk: async () => {
            try {
              const result = await apiPost("/remove", { name })
              if (result && result.ok === false) throw new Error(result.error || "卸载失败")
              setSelected(null)
              notify("已删除插件：" + name)
              await reload()
              setTimeout(function () { clickOfficialRefresh() }, 250)
            } catch (error) { notify("删除失败：" + msg(error)) }
          }
        })
      }

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地路由和图标链有哪些保护，可信边界在哪里？

**研究主题：**功能与机制、缺陷与关键质疑

#### 完整回答

所有handle路由先看socket.remoteAddress，明确非回环拒绝，4MiB body、safe key/folder/file格式、上传600KiB和类型白名单、文件路径前缀核查可限制常见超大正文和路径穿越。row开关先从官方列表找entryId，卸载要求bundle.removable=true，UI有删除/清预设确认，正向控制真实存在。

这不是调用者认证。remoteAddress缺失时isLoopback返回true；没有Origin/Host/会话/token验证。前置反代若转成本地连接会通过peer关，其他本机进程也能直调，不需UI确认。POST不校验Content-Type而直接JSON.parse，不能依赖客户端自带application/json头当服务端防跨站措施；外站可否到达取决浏览器和宿主整体策略，未据此声称已利用。toggle bundle不在本层核readOnlyReason，依官方方法执行权限；remove已查removable也仍依宿主真实语义。

上传按声明MIME接收原字节，不校验图片格式或净化SVG；import只看安全文件名和data字符串，既不核内容哈希匹配文件名，也不沿用upload的600KiB单图上限。随后SVG按同源image/svg+xml直接提供，无本层CSP/attachment/nosniff。img内嵌执行规则不能等同顶层打开或其他嵌入上下文；应仅导入可信图标，实际脚本执行仍受宿主响应策略制约。路径白名单并不解决活动内容信任。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:25-39](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L25-L39)

资源限制与允许图像。

<details>
<summary>查看原文（15行）</summary>

```text
const LIMIT = { text: 300, name: 40, body: 4 * 1024 * 1024, icon: 600 * 1024, keys: 2000 }
const MIME = {
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif'
}
const UPLOAD_MIME_EXT = { 'image/svg+xml': '.svg', 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' }
const SAFE_KEY = /^[A-Za-z0-9@][A-Za-z0-9@/_.:#-]{0,200}$/
const SAFE_FOLDER = /^[a-z0-9_-]{4,40}$/i
const SAFE_BUILTIN = /^[a-z0-9][a-z0-9-]{0,40}$/
const SAFE_FILE = /^[a-f0-9]{12,64}\.(?:svg|png|jpg|jpeg|webp|gif)$/
const ORIGINAL = Symbol.for('cordis.original')
```

</details>

**依据 2 · 源码核查**：[lib/index.js:701-728](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L701-L728)

正文读取与peer判断。

<details>
<summary>查看原文（28行）</summary>

```text
function readBody(req) {
  return new Promise((resolvePromise, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > LIMIT.body) {
        reject(new Error('body too large'))
        try { req.destroy() } catch {}
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolvePromise(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}
async function readJson(req) {
  const buf = await readBody(req)
  if (buf.length === 0) return {}
  return JSON.parse(buf.toString('utf8'))
}
function isLoopback(req) {
  const address = req.socket && req.socket.remoteAddress
  if (typeof address !== 'string' || address === '') return true
  return address === '::1' || address === '127.0.0.1' || address.startsWith('::ffff:127.') || address.startsWith('127.')
}

```

</details>

**依据 3 · 源码核查**：[lib/index.js:793-818](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L793-L818)

开关/统一路由入口。

<details>
<summary>查看原文（26行）</summary>

```text
  async function toggle(body) {
    const pm = managerOf(ctx)
    if (!pm) throw new Error('pluginManager unavailable')
    const name = typeof body.name === 'string' ? body.name : ''
    const enabled = body.enabled === true
    if (!SAFE_KEY.test(name)) throw new Error('bad name')
    if (body.kind === 'row') {
      const rowId = typeof body.rowId === 'string' ? body.rowId : ''
      const list = await listOriginal()
      const pkg = list.find((item) => item.name === name)
      const row = pkg && Array.isArray(pkg.rows) ? pkg.rows.find((item) => item.rowId === rowId) : undefined
      if (!row || typeof row.entryId !== 'string') throw new Error('这一行不能单独开关')
      if (typeof pm.setPluginEnabled !== 'function') throw new Error('setPluginEnabled unavailable')
      await pm.setPluginEnabled(row.entryId, enabled)
      return { target: 'row' }
    }
    if (typeof pm.setBundleEnabled !== 'function') throw new Error('setBundleEnabled unavailable')
    await pm.setBundleEnabled(name, enabled)
    return { target: 'bundle' }
  }

  async function handle(req, res, path) {
    if (!isLoopback(req)) return sendJson(res, 403, { ok: false, error: 'loopback only' })
    const method = (req.method || 'GET').toUpperCase()

    if (method === 'GET' && path === ROUTE + '/state') return sendJson(res, 200, await state())
```

</details>

**依据 4 · 源码核查**：[lib/index.js:831-847](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L831-L847)

图标文件响应。

<details>
<summary>查看原文（17行）</summary>

```text
    if (method === 'GET' && path.startsWith(ROUTE + '/icon/builtin/')) {
      const id = path.slice((ROUTE + '/icon/builtin/').length).replace(/\.svg$/, '')
      if (!SAFE_BUILTIN.test(id)) return sendText(res, 404, 'not found')
      return sendFile(res, join(ASSETS_DIR, 'icons', id + '.svg'), MIME['.svg'])
    }

    if (method === 'GET' && path.startsWith(ROUTE + '/icon/file/')) {
      const name = path.slice((ROUTE + '/icon/file/').length)
      if (!SAFE_FILE.test(name)) return sendText(res, 404, 'not found')
      const file = join(iconsDir(), name)
      if (!resolve(file).startsWith(resolve(iconsDir()) + sep)) return sendText(res, 404, 'not found')
      return sendFile(res, file, MIME[extname(name).toLowerCase()] || 'application/octet-stream')
    }

    if (method === 'POST') {
      let body
      try { body = await readJson(req) } catch (error) { return sendJson(res, 400, { ok: false, error: 'bad json: ' + String(error) }) }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:902-917](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L902-L917)

上传字节。

<details>
<summary>查看原文（16行）</summary>

```text
      if (path === ROUTE + '/upload') {
        const key = typeof body.key === 'string' ? body.key : ''
        const dataUrl = typeof body.dataUrl === 'string' ? body.dataUrl : ''
        if (!SAFE_KEY.test(key)) return sendJson(res, 400, { ok: false, error: 'bad key' })
        const match = /^data:([a-z0-9.+-]+\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/i.exec(dataUrl)
        if (match === null) return sendJson(res, 400, { ok: false, error: 'bad data url' })
        const ext = UPLOAD_MIME_EXT[match[1].toLowerCase()]
        if (ext === undefined) return sendJson(res, 400, { ok: false, error: 'unsupported image type' })
        const bytes = Buffer.from(match[2], 'base64')
        if (bytes.length === 0) return sendJson(res, 400, { ok: false, error: 'empty image' })
        if (bytes.length > LIMIT.icon) return sendJson(res, 400, { ok: false, error: 'image too large (max 600 KiB)' })
        ensureDirs()
        const token = createHash('sha256').update(bytes).digest('hex').slice(0, 16) + ext
        writeFileSync(join(iconsDir(), token), bytes)
        return sendJson(res, 200, { ok: true, token: 'file:' + token, url: iconUrl('file:' + token) })
      }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:946-959](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L946-L959)

导入图标与存储。

<details>
<summary>查看原文（14行）</summary>

```text
      if (path === ROUTE + '/import') {
        const raw = body.store && typeof body.store === 'object' ? body.store : body
        // 导出的 JSON 里带着上传图标的 base64：先落盘，卡片里的 file: token 才能继续用
        if (raw && raw.icons && typeof raw.icons === 'object') {
          ensureDirs()
          for (const [name, item] of Object.entries(raw.icons)) {
            if (!SAFE_FILE.test(name) || !item || typeof item.data !== 'string') continue
            try { writeFileSync(join(iconsDir(), name), Buffer.from(item.data, 'base64')) } catch {}
          }
        }
        const store = normalizeStore(raw)
        writeStore(store)
        return sendJson(res, 200, { ok: true, cards: store.cards, layout: store.layout })
      }
```

</details>

#### 缺口

- 部署webServer的调用者认证、反代peer和SVG内容响应策略
  **影响：**本地peer过滤无法独立证明只有当前用户能修改或管理插件
  **进一步探讨：**对照宿主固定安全契约核Origin/认证/反代入口与SVG顶层内容处理

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 持久化、导入导出和页面更新是否构成可靠恢复闭环？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

数据位置由专用HOME覆盖、DSH_HOME或~/.dsh决定，再加dsh-plugin-namecards，不含profile。不同profile共享同一HOME时会共享备注/布局和图标；不等当前profile隔离。旧plugin-cards在目标目录不存在时递归复制并保留旧目录，失败日志后继续。每次load重新读盘，writeStore同步写pid.tmp再rename；单进程无await的load→modify→write段不会因普通并发HTTP中途交错，可避免误称每请求必丢更新，但多宿主进程无锁/CAS，同pid临时名也没有跨进程事务。读坏JSON捕获为空，后续自动补图标/保存可覆盖原文件，rename不提供历史回退。

导出仅打包当前被cards引用的上传图标，图标读失败静默略过；导入先逐图写盘再整体normalize/write，无事务回滚，图标写失败吞异常仍可能返回ok且卡片指向缺失图标。export没有总尺寸上限，而import正文最多4MiB，多张合法600KiB图片base64即可超过，故“能导出”不必然“能整包恢复”。重复上传未保存/换图留下文件，只有恢复预设会清安全文件名图标，无常规引用垃圾回收；preset破坏性操作需要导出和原文件备份。

客户端每次请求完再reload但无请求序号/AbortController，较旧GET可后到覆盖新画面；跨多窗口没有版本冲突提示。useCardsState失败保留旧数据，ManagerTab先判!model返回“正在读取”，初次错误时无model会遮住后面的错误分支。全局popstate/hashchange/click监听无unload清理，官方刷新依中文按钮/aria文本与DOM相邻结构，热重载及宿主改版有累积和失效条件。宿主条件restore可借鉴，生命周期/恢复闭环仍有缺口。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:56-82](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L56-L82)

共享路径与迁移。

<details>
<summary>查看原文（27行）</summary>

```text

function dshHome() {
  const override = (process.env.DSH_PLUGIN_NAMECARDS_HOME || process.env.DSH_PLUGIN_CARDS_HOME)
  if (override && override.trim()) return resolve(override)
  const envHome = process.env.DSH_HOME
  if (envHome && envHome.trim()) return resolve(envHome)
  return join(homedir(), '.dsh')
}
function dataDir() { return join(dshHome(), 'dsh-plugin-namecards') }
function legacyDataDir() { return join(dshHome(), 'plugin-cards') }

/** 旧版本数据目录（~/.dsh/plugin-cards）自动迁移到新目录，只做一次。 */
function ensureDataMigrated() {
  try {
    const target = dataDir()
    const legacy = legacyDataDir()
    if (existsSync(target) || !existsSync(legacy)) return
    cpSync(legacy, target, { recursive: true })
    log('migrated data', legacy, '->', target)
  } catch (error) {
    log('warn', '迁移旧数据目录失败：', String(error))
  }
}
function storeFile() { return join(dataDir(), 'cards.json') }
function iconsDir() { return join(dataDir(), 'icons') }
function ensureDirs() {
  ensureDataMigrated()
```

</details>

**依据 2 · 源码核查**：[lib/index.js:219-276](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L219-L276)

加载、导出与原子替换。

<details>
<summary>查看原文（58行）</summary>

```text
  try {
    if (!existsSync(file)) {
      const created = seedStore()
      ensureDirs()
      writeStore(created)
      return created
    }
    return normalizeStore(JSON.parse(readFileSync(file, 'utf8')))
  } catch (error) {
    log('warn', '读取名片数据失败，按空数据处理：', String(error))
    return emptyStore()
  }
}

function exportStore() {
  ensureDataMigrated()
  const store = loadStore()
  const icons = {}
  for (const card of Object.values(store.cards)) {
    if (!card || typeof card.icon !== 'string' || !card.icon.startsWith('file:')) continue
    const name = card.icon.slice(5)
    if (!SAFE_FILE.test(name)) continue
    try {
      const bytes = readFileSync(join(iconsDir(), name))
      icons[name] = {
        mime: MIME[extname(name).toLowerCase()] || 'application/octet-stream',
        data: bytes.toString('base64')
      }
    } catch {}
  }
  return {
    app: 'dsh-plugin-namecards',
    schema: 2,
    exportedAt: new Date().toISOString(),
    cards: store.cards,
    layout: store.layout,
    icons
  }
}

function writeStore(store) {
  ensureDataMigrated()
  const file = storeFile()
  ensureDirs()
  const tmp = file + '.' + process.pid + '.tmp'
  writeFileSync(tmp, JSON.stringify(store, null, 2) + '\n', 'utf8')
  renameSync(tmp, file)
}

/* ------------------------------------------------------------------ */
/* 内置图标                                                            */
/* ------------------------------------------------------------------ */

let builtinCache
function builtinIcons() {
  if (builtinCache !== undefined) return builtinCache
  const list = []
  try {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:872-882](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L872-L882)

恢复预设清图标。

<details>
<summary>查看原文（11行）</summary>

```text
      if (path === ROUTE + '/preset') {
        // 一键恢复预设：清空名片/布局/上传图标，随后由下一次读取自动重新生成预设
        const store = emptyStore()
        writeStore(store)
        try {
          for (const name of readdirSync(iconsDir())) {
            if (SAFE_FILE.test(name)) unlinkSync(join(iconsDir(), name))
          }
        } catch (error) {}
        return sendJson(res, 200, { ok: true })
      }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:946-959](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L946-L959)

先图后JSON非事务导入。

<details>
<summary>查看原文（14行）</summary>

```text
      if (path === ROUTE + '/import') {
        const raw = body.store && typeof body.store === 'object' ? body.store : body
        // 导出的 JSON 里带着上传图标的 base64：先落盘，卡片里的 file: token 才能继续用
        if (raw && raw.icons && typeof raw.icons === 'object') {
          ensureDirs()
          for (const [name, item] of Object.entries(raw.icons)) {
            if (!SAFE_FILE.test(name) || !item || typeof item.data !== 'string') continue
            try { writeFileSync(join(iconsDir(), name), Buffer.from(item.data, 'base64')) } catch {}
          }
        }
        const store = normalizeStore(raw)
        writeStore(store)
        return sendJson(res, 200, { ok: true, cards: store.cards, layout: store.layout })
      }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:190-205](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/client.js#L190-L205)

无世代的reload。

<details>
<summary>查看原文（16行）</summary>

```text
      const [state, setState] = useState({ status: "loading", data: null, error: null })
      const load = useCallback(async () => {
        setState((prev) => ({ status: prev.data ? "refreshing" : "loading", data: prev.data, error: null }))
        try {
          const data = await apiGet("/state")
          setState({ status: "ready", data, error: null })
        } catch (error) {
          setState((prev) => ({ status: "error", data: prev.data, error: String(error && error.message ? error.message : error) }))
        }
      }, [])
      useEffect(() => { load() }, [load])
      return { state, reload: load }
    }

    function cardOf(data, key) { return data && data.cards ? data.cards[key] : undefined }

```

</details>

**依据 6 · 源码核查**：[lib/client.js:146-169](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/client.js#L146-L169)

DOM刷新启发式。

<details>
<summary>查看原文（24行）</summary>

```text
        if (typeof document === 'undefined') return false
        const roots = searchRoots()
        const all = []
        for (const root of roots) {
          if (!root || typeof root.querySelectorAll !== 'function') continue
          for (const btn of Array.from(root.querySelectorAll('button'))) all.push(btn)
        }
        const addBtn = all.find((btn) => {
          const text = (btn.textContent || '').replace(/\s+/g, '')
          return text === '添加插件' || text === '＋添加插件' || text === '+添加插件'
        })
        if (addBtn && addBtn.parentElement) {
          const siblings = Array.from(addBtn.parentElement.querySelectorAll('button'))
          const index = siblings.indexOf(addBtn)
          const before = (index < 0 ? siblings : siblings.slice(0, index)).filter((btn) => !(btn.textContent || '').trim())
          if (before.length > 0) { before[before.length - 1].click(); return true }
        }
        const hit = all.find((btn) => {
          try { if (btn.closest('.dpc-root')) return false } catch (error) {}
          const label = String(btn.getAttribute('aria-label') || '') + ' ' + String(btn.getAttribute('title') || '')
          return /刷新|refresh/i.test(label)
        })
        if (hit) { hit.click(); return true }
      } catch (error) {}
```

</details>

**依据 7 · 源码核查**：[lib/client.js:984-986](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/client.js#L984-L986)

错误展示顺序。

```text
      if (state.status === "loading" || !model) return jsx("div", { className: "dpc-empty", children: "正在读取…" })
      if (state.status === "error" && !data) return jsx("div", { className: "dpc-empty", children: "读取失败：" + state.error })

```

**依据 8 · 源码核查**：[lib/client.js:1066-1085](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/client.js#L1066-L1085)

全局监听未清理。

<details>
<summary>查看原文（20行）</summary>

```text

    function apply(ctx) {
      installStyles()
      try {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          const scheduleRefresh = (delay) => { setTimeout(function () { clickOfficialRefresh() }, delay || 300) }
          // 返回（后退）或切回「已安装」页签时，自动刷新官方插件列表
          window.addEventListener('popstate', function () { scheduleRefresh(350) })
          window.addEventListener('hashchange', function () { scheduleRefresh(350) })
          document.addEventListener('click', function (event) {
            try {
              const target = event.target
              const item = target && target.closest ? target.closest('button, a, [role="tab"]') : null
              if (!item) return
              const text = (item.textContent || '').replace(/\s+/g, '')
              if (text === '已安装' || text === '插件') scheduleRefresh(300)
            } catch (error) {}
          }, true)
        }
      } catch (error) {}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、使用与三阶段成本怎么核算？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

发布入口lib/index.js注入webServer，再动态注入pluginManager；浏览器bundle用__ModuleLoader__加载React与slots，注册plugins.tab和plugins.detail.section，patch插入插件。engines只声明DSH>=0.2.0rc1、无上界；README所述0.2.1rc2通过是作者声明，不能外推所有后续ABI。旧/新包目录自动复制是数据迁移，不是配置迁移保证。安装后宿主重启，客户端更新刷新按README办理。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地DSH Web/桌面宿主、名片JSON和图标磁盘，金额未知 | 核兼容、备份既有数据、整理备注/文件夹，工时未知 | 需webServer/pluginManager/slots内部契约；不自带模型或云账户 |
| 持续使用 | 同步磁盘读写与本地HTTP、图标空间 | 维护分类/原名对照，导出备份，耗时未知 | 本插件无外部模型调用；列表规模和图标数量影响开销，无测量 |
| 失败恢复 | 旧目录/导出JSON及图标备份、重装宿主插件资源 | 恢复损坏JSON、比对导入结果、重核实际启停/删除状态，工时未知 | 导入4MiB上限可能拒收大导出；没有自动历史回退或多进程冲突合并 |

计量单位应是整理后能够正确找回并操作的一组插件，而不是新图标数。此项本地静态规则猜图标，不调用LLM；没有额外模型服务账单不等总体无成本或已节时。导出前核数据量和备份原cards/icons，启停删除需认原包名与当前profile。host测试以mock manager和临时目录覆盖装饰/布局/开关/导入导出；client测试只mockReact/DOM检查注册与样式，未覆盖真实拖拽、全局监听清理、peer缺失和大备份恢复。本轮只读，不执行这些测试。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:5-32](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/package.json#L5-L32)

发布入口与Web声明。

<details>
<summary>查看原文（28行）</summary>

```text
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./icon": "./icon.svg",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "files": [
    "lib",
    "assets",
    "seed",
    "locale",
    "cordis.patch.yml",
    "icon.svg",
    "README.md",
```

</details>

**依据 2 · 源码核查**：[package.json:53-57](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/package.json#L53-L57)

宿主版本。

```text
  "engines": {
    "dsh": ">=0.2.0-rc.1"
  },
  "author": "3Tiga3"
}
```

**依据 3 · 源码核查**：[cordis.patch.yml:1-8](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/cordis.patch.yml#L1-L8)

配置插入。

```text
# dsh-plugin-namecards 的 bundle patch：把「插件名片」挂进 DSH 配置树。
#
# insert 的 id 与包名一致，方便按行寻址；name 解析到本包入口 lib/index.js。
# package.json 同时声明了 dsh.client，DSH 会把本包当作浏览器插件，
# 提供 /plugins/dsh-plugin-namecards/client.js 给页面。
- insert:
    - id: dsh-plugin-namecards
      name: 'dsh-plugin-namecards'
```

**依据 4 · 源码核查**：[lib/index.js:1002-1038](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L1002-L1038)

入口与依赖。

<details>
<summary>查看原文（37行）</summary>

```text
/* ------------------------------------------------------------------ */
/* 插件入口                                                            */
/* ------------------------------------------------------------------ */

export function apply(ctx) {
  const originalList = { current: undefined }
  const { handle } = makeHandlers(ctx, originalList)

  ctx.effect(() => {
    try {
      return ctx.webServer.register({
        kind: 'prefix',
        path: ROUTE,
        handler: async (req, res) => {
          try {
            const url = new URL(req.url || ROUTE, 'http://localhost')
            await handle(req, res, url.pathname)
          } catch (error) {
            log('warn', '路由处理失败：', String(error))
            try { sendJson(res, 500, { ok: false, error: String(error) }) } catch {}
          }
        }
      })
    } catch (error) {
      log('warn', '注册 /dsh-plugin-namecards 路由失败：', String(error))
      return () => {}
    }
  }, 'dsh-plugin-namecards: routes')

  try {
    ctx.inject(['pluginManager'], (sub) => {
      installWrap(sub, originalList)
    })
  } catch (error) {
    log('warn', 'pluginManager 注入失败：', String(error))
  }
}
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1086-1098](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/client.js#L1086-L1098)

两个slot。

<details>
<summary>查看原文（13行）</summary>

```text
      ctx.slots.inject("plugins.tab", () => ctx.slots.register({
        name: "plugins.tab", id: "dsh-plugin-namecards", order: 20, label: () => "插件管理"
      }, ManagerTab))
      ctx.slots.inject("plugins.detail.section", () => ctx.slots.register({
        name: "plugins.detail.section", id: "dsh-plugin-namecards-section", order: 60
      }, DetailSection))
    }

    const module = { exports: {} }
    module.exports = { apply, inject, name }
    return module.exports
  }
})
```

</details>

**依据 6 · 源码核查**：[test/run-host.mjs:44-86](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/test/run-host.mjs#L44-L86)

官方方法与HTTP mock。

<details>
<summary>查看原文（43行）</summary>

```text
}

function makeHarness(initialList) {
  const list = initialList || baseList()
  const calls = []
  const removed = []
  const pm = {
    listBundles: async () => list,
    removeBundle: async (bundleName) => { removed.push(bundleName); return { ok: true } },
    setBundleEnabled: async (bundleName, enabled) => { calls.push(['bundle', bundleName, enabled]); return {} },
    setPluginEnabled: async (id, enabled) => { calls.push(['row', id, enabled]); return {} }
  }
  const routes = []
  const ctx = {
    webServer: { register(entry) { routes.push(entry); return () => {} } },
    effect(fn) { const disposer = fn(); return () => { if (typeof disposer === 'function') disposer() } },
    inject(deps, callback) { callback({ pluginManager: pm, effect: ctx.effect }) },
    get(key) { return key === 'pluginManager' ? pm : undefined }
  }
  apply(ctx)
  const route = routes[0]
  async function call(method, path, body) {
    const payload = body === undefined ? '' : JSON.stringify(body)
    const res = { statusCode: 0, body: undefined, setHeader() {}, end(b) { this.body = b } }
    const listeners = {}
    const req = {
      url: path, method, socket: { remoteAddress: '127.0.0.1' },
      on(event, cb) { listeners[event] = cb },
      destroy() {}
    }
    const done = route.handler(req, res)
    if (payload && listeners.data) listeners.data(Buffer.from(payload))
    if (listeners.end) listeners.end()
    await done
    return { status: res.statusCode, data: JSON.parse(res.body) }
  }
  return { pm, routes, route, call, calls, removed }
}

async function main() {
  console.log('dsh-plugin-namecards host tests')

  await test('包装 listBundles：替换 description / icon，并处理行', async (home) => {
```

</details>

**依据 7 · 源码核查**：[test/run-host.mjs:310-357](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/test/run-host.mjs#L310-L357)

导出和图标恢复样例。

<details>
<summary>查看原文（48行）</summary>

```text

  await test('保存 / 重置 / 上传 / 导入', async (home) => {
    const h = makeHarness()
    const saved = await h.call('POST', '/dsh-plugin-namecards/save', { key: 'demo-bundle', card: { description: '保存后的说明', icon: 'builtin:tool' } })
    assert.equal(saved.status, 200)
    assert.equal(saved.data.cards['demo-bundle'].description, '保存后的说明')

    const upload = await h.call('POST', '/dsh-plugin-namecards/upload', { key: 'demo-bundle', dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' })
    assert.equal(upload.status, 200)
    assert.match(upload.data.token, /^file:[a-f0-9]{16}\.png$/)
    assert.ok(existsSync(join(home, 'dsh-plugin-namecards', 'icons', upload.data.token.slice(5))))

    const reset = await h.call('POST', '/dsh-plugin-namecards/reset', { key: 'demo-bundle' })
    assert.equal(reset.data.cards['demo-bundle'].autoIcon, false)

    const imported = await h.call('POST', '/dsh-plugin-namecards/import', { version: 2, enabled: false, cards: { x: { description: '导入' } }, layout: { folders: [{ id: 'f_abcd1234', name: '导入文件夹', sort: 'manual' }] } })
    assert.equal(imported.status, 200)
    assert.equal(imported.data.cards.x.description, '导入')
    assert.equal(imported.data.layout.folders.length, 1)
  })

  await test('全局导出：包含名片、布局与上传图标', async (home) => {
    const h = makeHarness()
    await h.call('POST', '/dsh-plugin-namecards/save', { key: 'demo-bundle', card: { note: '名片工坊', description: '说明', icon: 'builtin:memory' } })
    const upload = await h.call('POST', '/dsh-plugin-namecards/upload', { key: 'demo-bundle', dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' })
    await h.call('POST', '/dsh-plugin-namecards/save', { key: 'demo-bundle', card: { note: '名片工坊', description: '说明', icon: upload.data.token } })
    await h.call('POST', '/dsh-plugin-namecards/layout', { action: 'folder.create', name: '美化' })
    const { status, data } = await h.call('GET', '/dsh-plugin-namecards/export')
    assert.equal(status, 200)
    assert.equal(data.app, 'dsh-plugin-namecards')
    assert.equal(data.cards['demo-bundle'].note, '名片工坊')
    assert.equal(data.cards['demo-bundle'].description, '说明')
    assert.equal(data.layout.folders.length, 1)
    const tokenName = upload.data.token.slice(5)
    assert.ok(data.icons[tokenName], '导出应内嵌上传图标')
    assert.ok(data.icons[tokenName].data.length > 20)
  })

  await test('导入时恢复导出的上传图标', async (home) => {
    const h = makeHarness()
    const upload = await h.call('POST', '/dsh-plugin-namecards/upload', { key: 'demo-bundle', dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' })
    const token = upload.data.token
    await h.call('POST', '/dsh-plugin-namecards/save', { key: 'demo-bundle', card: { note: '名片工坊', description: '说明', icon: token } })
    const exported = await h.call('GET', '/dsh-plugin-namecards/export')
    const name = token.slice(5)
    rmSync(join(home, 'dsh-plugin-namecards', 'icons', name), { force: true })
    assert.equal(existsSync(join(home, 'dsh-plugin-namecards', 'icons', name)), false)
    const imported = await h.call('POST', '/dsh-plugin-namecards/import', { store: exported.data })
```

</details>

**依据 8 · 源码核查**：[test/run-client.mjs:27-76](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/test/run-client.mjs#L27-L76)

注册/样式mock范围。

<details>
<summary>查看原文（50行）</summary>

```text

const fakeReact = {
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useEffect: () => {},
  useCallback: (fn) => fn,
  useMemo: (fn) => fn(),
  useRef: (init) => ({ current: init })
}
const fakeJsx = (type, props) => ({ type, props })
const requireStub = (name) => {
  if (name === 'react') return fakeReact
  if (name === 'react/jsx-runtime') return { jsx: fakeJsx, jsxs: fakeJsx, Fragment: 'Fragment' }
  throw new Error('unexpected require: ' + name)
}

const exportsObj = captured.factory(requireStub)
assert.equal(exportsObj.name, 'dsh-plugin-namecards')
assert.deepEqual(Array.from(exportsObj.inject), ['slots'])
assert.equal(typeof exportsObj.apply, 'function')

const registrations = []
const ctx = {
  slots: {
    inject(slotName, callback) { callback() },
    register(options, component) {
      registrations.push({
        slot: options.name, id: options.id, order: options.order,
        label: typeof options.label === 'function' ? options.label() : options.label,
        component
      })
      return () => {}
    }
  }
}
exportsObj.apply(ctx)

assert.equal(registrations.length, 2, '应注册一个页签 + 一个详情区块')
const tab = registrations.find((item) => item.slot === 'plugins.tab' && item.id === 'dsh-plugin-namecards')
const section = registrations.find((item) => item.slot === 'plugins.detail.section')
assert.ok(tab, '缺少备注管理页签')
assert.ok(section, '缺少详情页区块')
assert.equal(tab.label, '插件管理')
assert.equal(typeof tab.component, 'function')
assert.equal(typeof section.component, 'function')
assert.equal(styleNodes.length, 1, '应注入一份内联样式表')
assert.equal(styleNodes[0].tagName, 'style')
assert.equal(styleNodes[0].attrs['data-dsh-plugin-namecards'], '1')
assert.ok(styleNodes[0].textContent.includes('.dpc-root'), '样式内容应内联在 client.js 中')
assert.ok(styleNodes[0].textContent.length > 5000)

```

</details>

#### 缺口

- 大目录/多profile下整理耗时、检索误操作率及完整备份体积
  **影响：**不能确认相对官方列表已减少多少管理成本，也不能保证全量导出必可恢复
  **进一步探讨：**以固定插件集合比较查找/启停任务错误与人工耗时，先核含图标导出是否落在4MiB恢复预算

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 推荐边界与未来可证伪改进是什么？

**研究主题：**采用判断、新假设与验证

#### 完整回答

建议先观察。用途和管理交付清楚，问题不是没有宿主实测，而是“仅显示”的描述低估真实卸载权限，本层peer不是身份认证、SVG导入和恢复非事务，再加共享HOME/损坏覆盖会影响整理资产。若继续探讨，可从可信单用户本地宿主、原数据备份及明确身份/图标政策入手；避免把唯一备份放在未经体积核对的导出文件，不给不可信来源的JSON或SVG。

可推导“分离展示编辑与受权管理，并提供可验证备份包”。参照当前一个路由prefix同时负责名片与管理、整包JSON导入。设计方向为展示侧只写限定profile名片，管理侧由官方授权能力显式确认目标；备份manifest记录profile/包身份、图片hash/大小、schema与revision，先校验总预算和所有内容再原子切换，失败保留旧版。用多profile同名包、代理回环、peer缺失、恶意/伪MIME SVG、缺图/坏hash、超过4MiB和进程竞争作最小反例。若新结构仍允许展示请求卸载、失败导入丢旧数据或正常整理操作工时大增却不减少错误，则否定收益。该方向未实现，不计已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:793-812](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L793-L812)

管理调用边界。

<details>
<summary>查看原文（20行）</summary>

```text
  async function toggle(body) {
    const pm = managerOf(ctx)
    if (!pm) throw new Error('pluginManager unavailable')
    const name = typeof body.name === 'string' ? body.name : ''
    const enabled = body.enabled === true
    if (!SAFE_KEY.test(name)) throw new Error('bad name')
    if (body.kind === 'row') {
      const rowId = typeof body.rowId === 'string' ? body.rowId : ''
      const list = await listOriginal()
      const pkg = list.find((item) => item.name === name)
      const row = pkg && Array.isArray(pkg.rows) ? pkg.rows.find((item) => item.rowId === rowId) : undefined
      if (!row || typeof row.entryId !== 'string') throw new Error('这一行不能单独开关')
      if (typeof pm.setPluginEnabled !== 'function') throw new Error('setPluginEnabled unavailable')
      await pm.setPluginEnabled(row.entryId, enabled)
      return { target: 'row' }
    }
    if (typeof pm.setBundleEnabled !== 'function') throw new Error('setBundleEnabled unavailable')
    await pm.setBundleEnabled(name, enabled)
    return { target: 'bundle' }
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:719-728](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L719-L728)

peer基线。

<details>
<summary>查看原文（10行）</summary>

```text
  const buf = await readBody(req)
  if (buf.length === 0) return {}
  return JSON.parse(buf.toString('utf8'))
}
function isLoopback(req) {
  const address = req.socket && req.socket.remoteAddress
  if (typeof address !== 'string' || address === '') return true
  return address === '::1' || address === '127.0.0.1' || address.startsWith('::ffff:127.') || address.startsWith('127.')
}

```

</details>

**依据 3 · 源码核查**：[lib/index.js:946-959](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L946-L959)

导入基线。

<details>
<summary>查看原文（14行）</summary>

```text
      if (path === ROUTE + '/import') {
        const raw = body.store && typeof body.store === 'object' ? body.store : body
        // 导出的 JSON 里带着上传图标的 base64：先落盘，卡片里的 file: token 才能继续用
        if (raw && raw.icons && typeof raw.icons === 'object') {
          ensureDirs()
          for (const [name, item] of Object.entries(raw.icons)) {
            if (!SAFE_FILE.test(name) || !item || typeof item.data !== 'string') continue
            try { writeFileSync(join(iconsDir(), name), Buffer.from(item.data, 'base64')) } catch {}
          }
        }
        const store = normalizeStore(raw)
        writeStore(store)
        return sendJson(res, 200, { ok: true, cards: store.cards, layout: store.layout })
      }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:259-265](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L259-L265)

存储替换基线。

```text
function writeStore(store) {
  ensureDataMigrated()
  const file = storeFile()
  ensureDirs()
  const tmp = file + '.' + process.pid + '.tmp'
  writeFileSync(tmp, JSON.stringify(store, null, 2) + '\n', 'utf8')
  renameSync(tmp, file)
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
