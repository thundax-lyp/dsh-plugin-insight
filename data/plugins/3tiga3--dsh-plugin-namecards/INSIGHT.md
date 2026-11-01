# dsh-plugin-namecards

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6d8b58c](https://github.com/3Tiga3/dsh-plugin-namecards/tree/6d8b58c292c372b9f70cad852a4873b779d87b1a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/3Tiga3/dsh-plugin-namecards) [![npm 30d 1,355](https://img.shields.io/static/v1?label=npm+30d&message=1%2C355&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-namecards) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-namecards)
<!-- END META -->

> **功能**：为 DSH 插件自定义显示名片、图标与分组。

> **亮点**：[Q01](#research-q01) 集中编辑名片和分组，[Q02](#research-q02) 在列表装饰并接入真实启停。

> **主要限制**：[Q03](#research-q03) 读档失败当空数据，导入替换与恢复预设可能丢自定义数据。

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
  - [Q01 · 插件名片相对官方插件列表解决什么？](#detail-section-11)
  - [Q02 · 展示覆盖、持久化与启停如何接线？](#detail-section-12)
  - [Q03 · 读档、导入与恢复预设的失败和数据丢失边界？](#detail-section-13)
  - [Q04 · 宿主、备份与采用条件是什么？](#detail-section-14)
  - [Q05 · 能否在覆盖或替换前帮助用户判断影响？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户整理较多插件并自定义名称和分组。

使用宿主原始插件列表并手工识别。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 名片覆盖 | 更改列表名称与图标 | 不改变插件实现 |
| 启停 | 调用宿主管理器 | 真实影响插件状态 |
| 导入导出 | 转移名片与布局 | 导入直接替换 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容 DSH Web | 必需 | 显示页签 | 无法使用界面 |
| pluginManager | 列表与启停需要 | 取得并修改插件状态 | 服务缺失报错 |
| 本地数据文件 | 保存自定义需要 | 名片与布局 | 读失败按空数据 |
| 导出备份 | 恢复重要 | 保留当前内容 | 恢复预设可能丢数据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 在隔离 profile 导出并保管备份 | 失败停止 |
| 编辑 | 修改一条不敏感名片 | 对照官方列表 |
| 启停 | 确认目标后调用宿主开关 | 核实实际插件状态 |
| 恢复 | 出错停止写入并核备份 | 确认后再导入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 准备 | 本地存储成本未知 | 备份与核版本 | 兼容未测 |
| 使用 | 图标存储未知 | 维护备注与布局 | 易用性未测 |
| 恢复 | 备份存储未知 | 人工检查和恢复 | 导入替换当前数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 名片 | 本地数据装饰列表 | 更易识别 |
| 开关 | 调用宿主管理器 | 宿主实际状态 |
| 导出 | 打包可读图标和布局 | 备份完全可恢复 |

> **思考**：[Q03](#research-q03) 读档失败当空数据，导入替换与恢复预设可能丢自定义数据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中编辑名片和分组，[Q02](#research-q02) 在列表装饰并接入真实启停。

[Q02](#research-q02) 区分显示装饰与真实启停，[Q03](#research-q03) 导入是替换而非合并。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 读档失败当空数据，导入替换与恢复预设可能丢自定义数据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在隔离 profile 先备份，试单条名片并核状态；读档异常时先保留原文件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态检查显示覆盖、启停、存储与导入代表路径；未运行宿主。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、包清单、客户端与宿主插件管理和存储代表路径；未运行 DSH 或浏览器。
- 下一步：[Q05](#research-q05) 核现有 UI 后比较差异预览和直接导入。

**分析版本**

- **仓库**：[3Tiga3/dsh-plugin-namecards](https://github.com/3Tiga3/dsh-plugin-namecards)
- **版本号**：0.6.6（[固定提交 6d8b58c](https://github.com/3Tiga3/dsh-plugin-namecards/tree/6d8b58c292c372b9f70cad852a4873b779d87b1a)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设替换前差异预览可减少误覆盖；尚未验证。

[Q05](#research-q05) 核现有 UI 后比较差异预览和直接导入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2177 | 1930 | 85 | — |
| .md | source | 1 | 78 | — | — | 1103 |
| .mjs | test | 2 | 474 | 427 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/3Tiga3/dsh-plugin-namecards/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查插件显示覆盖、启停及数据恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件名片相对官方插件列表解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:1-20 面向希望给 DSH 插件标注中文名、图标、说明和分组的用户；相对官方原始列表，提供自定义显示、收藏和布局。client.js:1096-1101 注册插件管理页签；index.js:543-570 对列表元数据作显示装饰，不是修改插件实现。是否更易识别和节省时间未做用户对照，默认名片也可能与真实功能不符。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/README.md#L1-L20)

作者描述显示与管理场景。

<details>
<summary>查看原文（20行）</summary>

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
- **铺陈**：图标网格（72px），图标下是开关和备注名；文件夹是缩略方块，点开后显示其中的插件（毛玻璃遮罩覆盖整个窗口）；
- 点插件行/图标 → 右侧「编辑名片」抽屉：图标、**中文说明**（支持多行，列表只显示单行省略号）、**备注（显示名称）**、**所在文件夹**；点抽屉外空白或 Esc 关闭；
- **文件夹弹窗内**：点插件打开编辑名片，名片浮在弹窗之上；点空白处先退出名片、文件夹保留，再点一下才退出文件夹；Esc 同样逐层退出；
- 「**恢复预设**」：一键清空自定义名片与布局，重新生成默认图标、实验性插件文件夹、子代理插件文件夹与官方中文备注；
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1096-1101](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/client.js#L1096-L1101)

注册管理页签。

```text
      ctx.slots.inject("plugins.tab", () => ctx.slots.register({
        name: "plugins.tab", id: "dsh-plugin-namecards", order: 20, label: () => "插件管理"
      }, ManagerTab))
      ctx.slots.inject("plugins.detail.section", () => ctx.slots.register({
        name: "plugins.detail.section", id: "dsh-plugin-namecards-section", order: 60
      }, DetailSection))
```

**依据 3 · 源码核查**：[lib/index.js:543-570](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L543-L570)

元数据显示装饰。

<details>
<summary>查看原文（28行）</summary>

```text
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

#### 缺口

- 未做识别和可访问性对照
  **影响**：不能保证节时或显示准确
  **进一步探讨**：用同插件清单对照原生列表。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 展示覆盖、持久化与启停如何接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.js:1003-1029 包装 pluginManager.listBundles，再加载名片装饰；包装失败或装饰异常回原始列表。225-238 读取本地存储，268-274 临时文件写入后 rename；client.js:472-480 请求 /toggle，index.js:824-842 按行或包调用宿主 setPluginEnabled/setBundleEnabled。显示覆盖与启停是两种操作：前者改变列表呈现，后者改变插件管理状态。未运行宿主，不能推断切换已真正生效或其他插件列表不受包装影响。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1003-1029](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L1003-L1029)

包装列表并在 dispose 时恢复。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:225-238](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L225-L238)

本地读档及失败回退。

<details>
<summary>查看原文（14行）</summary>

```text
function loadStore() {
  ensureDataMigrated()
  const file = storeFile()
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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:268-274](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L268-L274)

临时文件写入和 rename。

```text
function writeStore(store) {
  ensureDataMigrated()
  const file = storeFile()
  ensureDirs()
  const tmp = file + '.' + process.pid + '.tmp'
  writeFileSync(tmp, JSON.stringify(store, null, 2) + '\n', 'utf8')
  renameSync(tmp, file)
```

**依据 4 · 源码核查**：[lib/client.js:472-480](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/client.js#L472-L480)

客户端提交启停请求。

```text
    function useToggle(reload, notify) {
      return useCallback(async (kind, bundleName, rowId, enabled) => {
        try {
          await apiPost("/toggle", { kind, name: bundleName, rowId, enabled })
          notify(enabled ? "已启用，正在生效…" : "已停用，正在生效…")
          await new Promise((r) => setTimeout(r, 900))
          await reload()
        } catch (error) {
          notify("开关失败：" + (error && error.message ? error.message : String(error)))
```

**依据 5 · 源码核查**：[lib/index.js:824-842](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L824-L842)

调用宿主插件管理器。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

#### 缺口

- 未执行宿主切换及包装兼容测试
  **影响**：无法保证启停和显示完全一致
  **进一步探讨**：隔离 profile 对照原列表与宿主状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 读档、导入与恢复预设的失败和数据丢失边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

index.js:225-238 文件缺失时建立种子，读取或解析失败返回空数据；880-890 保存时先 loadStore 再写，故损坏文件若被当空数据后保存，可能覆盖原文件。977-989 导入将规范化后的整份 store 写入而不是合并；903-912 恢复预设清空名片/布局并尝试删除上传图标。虽然客户端支持导出，不能把它视为自动备份或保证包含每个丢失图标；应先导出并独立保存原始文件，失败时停止操作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:225-238](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L225-L238)

读档失败按空数据处理。

<details>
<summary>查看原文（14行）</summary>

```text
function loadStore() {
  ensureDataMigrated()
  const file = storeFile()
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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:880-890](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L880-L890)

保存会重新写 store。

<details>
<summary>查看原文（11行）</summary>

```text
      if (path === ROUTE + '/save') {
        const key = typeof body.key === 'string' ? body.key : ''
        if (!SAFE_KEY.test(key)) return sendJson(res, 400, { ok: false, error: 'bad key' })
        const store = loadStore()
        const card = normalizeCard(body.card)
        if (card === undefined) delete store.cards[key]
        else {
          delete card.autoAssigned
          store.cards[key] = card
        }
        writeStore(store)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:977-989](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L977-L989)

导入替换当前 store。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:903-912](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L903-L912)

恢复预设清空和删除图标。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/index.js:242-265](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L242-L265)

导出名片布局和可读图标。

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

#### 缺口

- 未做损坏恢复和并发写入测试
  **影响**：不能保证恢复所有数据
  **进一步探讨**：备份后注入损坏、导入与恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 宿主、备份与采用条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:17-23、53-55 声明 Web 客户端和 DSH >=0.2.0-rc.1；真实宿主兼容、权限和 UI 未验证。显示整理需人工录入和维护，导出可能包含备注与图标，需注意隐私和存储；开关调用真实插件管理器，可能影响正在使用的功能。先在隔离 profile 导出备份，用一条不敏感名片试显示与还原，若插件管理服务缺失、读档异常或启停结果不明则停止修改并核宿主状态。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:17-23](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/package.json#L17-L23)

Web 客户端。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

**依据 2 · 源码核查**：[package.json:53-55](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/package.json#L53-L55)

DSH 版本声明。

```text
  "engines": {
    "dsh": ">=0.2.0-rc.1"
  },
```

**依据 3 · 源码核查**：[lib/index.js:824-842](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L824-L842)

真实插件管理动作。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:242-265](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L242-L265)

导出内容。

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

#### 缺口

- 未测宿主、性能与用户操作成本
  **影响**：无法量化收益或恢复
  **进一步探讨**：隔离 profile 验证并备份。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否在覆盖或替换前帮助用户判断影响？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有导出、导入与恢复预设，重复增加备份按钮没有实质增量。设想先以本地差异预览呈现当前与待导入名片、布局、图标的新增、替换、删除及不可读取项，让用户选择取消或确认，并输出可验证的本地备份位置；不自动记录私密备注。对照现有直接导入，在重复 key、损坏图标、空布局和错误文件测试误覆盖率、恢复成功率与操作负担；若差异漏掉删除项、备份不可恢复或负担过高则否定。先核现有 UI 是否已有等价预览。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:977-989](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L977-L989)

现有导入直接替换。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:639-655](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/client.js#L639-L655)

客户端解析后直接发送导入。

<details>
<summary>查看原文（17行）</summary>

```text
      function doImport(file) {
        if (!file) return
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const parsed = JSON.parse(String(reader.result))
            await apiPost("/import", { store: parsed })
            if (parsed && parsed.settings && parsed.settings.nameSort !== undefined) {
              const on = parsed.settings.nameSort === true
              setNameSort(on)
              try { window.localStorage.setItem("dsh-plugin-namecards:nameSort", on ? "1" : "0") } catch {}
            }
            notify("已导入词库")
            await reload()
          } catch (error) { notify("导入失败：" + msg(error)) }
        }
        reader.readAsText(file)
```

</details>

**依据 3 · 源码核查**：[lib/client.js:658-667](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/client.js#L658-L667)

已有导出。

<details>
<summary>查看原文（10行）</summary>

```text
      async function exportAll() {
        try {
          const data = await apiGet("/export")
          data.settings = { nameSort, view }
          const text = JSON.stringify(data, null, 2)
          const blob = new Blob([text], { type: "application/json" })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = "dsh-plugin-namecards-全部导出.json"
```

</details>

**依据 4 · 源码核查**：[lib/index.js:903-912](https://github.com/3Tiga3/dsh-plugin-namecards/blob/6d8b58c292c372b9f70cad852a4873b779d87b1a/lib/index.js#L903-L912)

恢复预设会清空。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

#### 缺口

- 未穷尽全部 UI 和未做原型
  **影响**：增量与收益未经验证
  **进一步探讨**：核现有界面后做差异与恢复故障对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
