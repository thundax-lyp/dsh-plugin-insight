# dsh-russian-lang

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[efc8984](https://github.com/GooDAnDReaDY/dsh-russian-lang/tree/efc89845f1baafbb95dd54bd2b08840592a35ffa)

<!-- BEGIN META -->
[![GitHub ★ 73](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=73&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GooDAnDReaDY/dsh-russian-lang) [![npm 30d 15,231](https://img.shields.io/static/v1?label=npm+30d&message=15%2C231&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@goodandready/dsh-russian-lang) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@goodandready/dsh-russian-lang)
<!-- END META -->

> **功能**：为 DeepSeek Harness 核心及社区插件提供俄语界面词典、输入辅助和可选翻译。

> **亮点**：[Q01](#research-q01) 通过固定命名空间和宿主字典路由交付俄语 UI。[Q04](#research-q04) 个人词典与版本状态帮助定位某个安装组合的缺口。

> **主要限制**：[Q02](#research-q02) 关闭补译不会逐节点恢复旧文本，共享命名空间冲突的 disposer 为空。[Q03](#research-q03) 可选翻译和代理信任需要独立核对。

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
  - [Q01 · 俄语使用者如何获得核心和社区插件的翻译，覆盖数能说明什么？](#detail-section-11)
  - [Q02 · 切换语言或卸载时，原生 locale 和 DOM 补译能恢复到哪里？](#detail-section-12)
  - [Q03 · 反向代理兼容如何改变翻译和本机副作用的请求边界？](#detail-section-13)
  - [Q04 · 新版依赖、个人词典和斜杠别名能降低哪类排障成本？](#detail-section-14)
  - [Q05 · 怎样验证俄语适配值得保留，同时降低误操作和退出成本？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：俄语使用者希望理解 DSH 设置、社区插件、审批和错误提示，同时保留查原文的路径。

原生英语保留原始术语，整页翻译可临时覆盖陌生文案；专门词典可按宿主命名空间处理，但要跟随版本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 原生词典 | 俄语菜单和设置 | 以实际宿主与命名空间为准 |
| DOM 补译 | 补齐部分非原生文本 | 退出后必要时刷新 |
| 可选翻译 | 翻译聊天正文 | 依配置向服务发送文字 |
| 词典诊断 | 核对用户覆盖与版本 | 发布基准和实际版本须核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web locale 与设置插槽 | 核心必需 | 注册词典与设置 | 缺失需核对宿主与包版本 |
| 外部模型或翻译引擎 | 可选 | 翻译聊天正文 | 保持关闭时无需该服务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 隔离环境启用俄语词典 | 固定宿主与插件版本 |
| 核查 | 对照设置、任务、审批提示 | 含义明确且正文不误改 |
| 退出 | 切回英语，刷新或禁用 | 恢复原文并核对辅助状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 词典与安装资源 | 核对术语和兼容范围 | 耗时待测 |
| 持续 | 观察器与缓存，翻译费用依引擎 | 核对版本、词条与页面 | 没有节时实测 |
| 失败 | 可选容器和外部请求成本 | 刷新或卸载及核查原文 | 容器需独立退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 俄语界面 | 宿主词典和补译真实接线 | 完整覆盖与语义 |
| 恢复原文 | 语言观察器会退出 | 已有 DOM 恢复和刷新成本 |

> **思考**：[Q02](#research-q02) 关闭补译不会逐节点恢复旧文本，共享命名空间冲突的 disposer 为空。[Q03](#research-q03) 可选翻译和代理信任需要独立核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 通过固定命名空间和宿主字典路由交付俄语 UI。[Q04](#research-q04) 个人词典与版本状态帮助定位某个安装组合的缺口。

词典可按命名空间注册和增量加载。合并已有字典与正常注册退出方式不同，DOM 覆盖应记录来源以便恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 关闭补译不会逐节点恢复旧文本，共享命名空间冲突的 disposer 为空。[Q03](#research-q03) 可选翻译和代理信任需要独立核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先用隔离 DSH 配置验收包内词条和关键权限提示，关闭可选翻译。误改正文或术语不清时切回英语刷新，必要时停用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持词典与界面接线，也显示直接替换和外部翻译边界。覆盖、语义及真实宿主表现需实测。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.md、cordis.patch.yml、lib/client.js、lib/commands.js、lib/index.js、lib/locales.js、lib/plugin-updater.js、lib/translator.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽查核心与社区字典、原生和 DOM 边界、命令及翻译网络。未逐词审稿或执行插件。
- 下一步：在固定宿主比较俄英关键任务、旧节点和原文恢复。反代与外部引擎另用无敏感内容验证。

**分析版本**

- **仓库**：[GooDAnDReaDY/dsh-russian-lang](https://github.com/GooDAnDReaDY/dsh-russian-lang)
- **版本号**：0.4.26（[固定提交 efc8984](https://github.com/GooDAnDReaDY/dsh-russian-lang/tree/efc89845f1baafbb95dd54bd2b08840592a35ffa)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 为关键任务保存带来源的双语验收卡并锁定版本，比较它能否比键覆盖多识别严重误译，且维护成本可接受。

在固定宿主比较俄英关键任务、旧节点和原文恢复。反代与外部引擎另用无敏感内容验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 520 | 462 | 12 | — |
| .md | source | 5 | 1184 | — | — | 11587 |
| .js | source | 22 | 5261 | 4681 | 307 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/GooDAnDReaDY/dsh-russian-lang/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/GooDAnDReaDY/dsh-russian-lang/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/GooDAnDReaDY/dsh-russian-lang/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：俄语使用者能否在固定 DSH 与社区插件组合下读懂关键操作，并控制补译、远程翻译和退出成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 俄语使用者如何获得核心和社区插件的翻译，覆盖数能说明什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向经常使用 DSH 设置、审批和社区插件的俄语使用者。合格结果是能理解同一任务的菜单、动作和失败原因，并知道翻译缺失时如何查原文。原有办法是使用原生英语或翻译整页。插件将俄语命名空间注册给宿主，可让调用 locale 的组件直接消费词条，比整页临时翻译更贴近应用的占位符和动态渲染。不同组件若未调用宿主 locale，还需要另外核查。

Host 以分片或组合形式供给核心字典。客户端先注册包内词条，随后使用缓存和 HTTP 字典注册更多命名空间；核心请求失败时尝试全量接口，社区词典可以按名称加载。新版作者报告 schedule.catalog 合并并保留旧 schedule.manager。覆盖分母会随上游版本、已安装组合和可用英语基准改变。固定 package 描述写 85 个插件和 13,055 键，作者更新记录另有 89 个及 15,673 键等数字；不能将不同出处的统计直接当作当前任务全覆盖。固定 Git 未跟踪 supported-inventory.json，package files 还排除 plugins-en 目录，发布构建是否补齐 inventory 需独立回读，不能从词典文件直接算同一分母。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-12](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/package.json#L1-L12)

固定包描述与 Web 导出。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "@goodandready/dsh-russian-lang",
  "version": "0.4.26",
  "description": "Полная русская локализация DeepSeek Harness (DSH): ядро v0.2.2-rc.1 + 85 плагинов экосистемы, 13,055 UI keys, 100% покрытие экосистемы, естественный русский язык",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "import": "./lib/index.js"
    },
    "./client": "./lib/client.js",
```

</details>

**依据 2 · 源码核查**：[package.json:33-48](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/package.json#L33-L48)

声明发布文件及英语基准排除。

<details>
<summary>查看原文（16行）</summary>

```text
  "files": [
    "lib",
    "!lib/client.template.js",
    "!lib/locales/plugins-en",
    "!lib/locales/core.json",
    "bin",
    "glossary.json",
    "cordis.patch.yml",
    "README.md",
    "README.ru.md",
    "README.zh.md",
    "DESIGN.md",
    "NOTICE",
    "LICENSE",
    "supported-inventory.json"
  ],
```

</details>

**依据 3 · 源码核查**：[lib/client.js:550-574](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/client.js#L550-L574)

注册、合并命名空间并维护本地缓存。

<details>
<summary>查看原文（25行）</summary>

```text
const registerOrUpdateNamespace = (ns,dict) => {if (disposed || !ns || typeof dict !== 'object' || !dict) return
if (!RU[ns]){RU[ns] = Object.assign({},dict)} else if (RU[ns] !== dict){Object.assign(RU[ns],dict)}
const prevDisposer = ownDisposers.get(ns)
if (typeof prevDisposer === 'function'){try { prevDisposer() } catch (_err){ void _err }
ownDisposers.delete(ns)}
try {const disposer = ctx.locale.register(ns, 'ru', RU[ns])
if (typeof disposer === 'function'){ownDisposers.set(ns,disposer)}} catch (err){console.warn('[dsh-russian-lang] Failed to register core locale for namespace:',ns,err)}}
ctx.effect(() => {disposed = false
for (const ns of Object.keys(RU)){registerOrUpdateNamespace(ns,RU[ns])}
return () => {disposed = true
for (const [ns,d] of ownDisposers.entries()){try { d() } catch (_err){ void _err }}
ownDisposers.clear()}},'dsh-russian-lang: locale-registrations')
ctx.effect(() => {if (disposed) return () => {}
try { return ctx.locale.register(SETTINGS_NS_NAME, 'en', CARD_EN) } catch (err) {console.warn('[dsh-russian-lang] Failed to register en card fallback:', err)
return () => {}}},'dsh-russian-lang: russian-lang-en')
const registerDictMap = (dictMap) => {if (disposed || !dictMap || typeof dictMap !== 'object') return
for (const ns of Object.keys(dictMap)){if (disposed) return
if (ns === 'zhRu' || ns === 'plugins' || ns === 'core') continue
const dict = dictMap[ns]
if (typeof dict !== 'object' || !dict) continue
registerOrUpdateNamespace(ns,dict)}}
const CACHE_NAME = 'dsh-ru-cache-v1'
const loadLocalDict = (key) => {try {const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('dsh_ru_' + key) :null
return raw ? JSON.parse(raw) :null} catch (_){ return null }}
const saveLocalDict = (key,etag,data) => {try {if (typeof localStorage !== 'undefined'){localStorage.setItem('dsh_ru_' + key,JSON.stringify({ etag,data }))}} catch (_e){ void _e }}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:618-655](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/client.js#L618-L655)

按插件请求、核心加载与全量回退。

<details>
<summary>查看原文（38行）</summary>

```text
const loadPluginDictionaries = (names) => {if (disposed || typeof fetch !== 'function') return
const isSelective = Array.isArray(names) && names.length > 0
const toLoad = []
if (isSelective){for (const raw of names){const n = String(raw).trim()
if (!n || loadedPluginNames.has(n) || inFlightPluginNames.has(n)) continue
toLoad.push(n)
inFlightPluginNames.add(n)}
if (toLoad.length === 0) return}
const qs = toLoad.length > 0 ? ('?names=' + encodeURIComponent(toLoad.join(','))) :''
const url = '/api/dsh-russian-lang/dict/plugins' + qs
const cacheKey = toLoad.length > 0 ? ('plugins_' + toLoad.slice().sort().join('_')) :'plugins_all'
fetchCachedResource(url,cacheKey,(data) => {if (data && data.plugins){registerDictMap(data.plugins)
if (toLoad.length > 0){for (const n of toLoad) loadedPluginNames.add(n)} else if (data.plugins){for (const n of Object.keys(data.plugins)) loadedPluginNames.add(n)}}}).catch(() => {}).finally(() => {for (const n of toLoad) inFlightPluginNames.delete(n)})}
const schedulePluginLoad = (name) => {if (!name) return
const n = String(name).trim()
if (!n || loadedPluginNames.has(n) || inFlightPluginNames.has(n) || queuedPluginNames.has(n)) return
queuedPluginNames.add(n)
if (pluginBatchTimer) clearTimeout(pluginBatchTimer)
pluginBatchTimer = setTimeout(() => {pluginBatchTimer = null
const batch = Array.from(queuedPluginNames)
queuedPluginNames.clear()
if (batch.length > 0) loadPluginDictionaries(batch)},50)}
fetchCachedResource('/api/dsh-russian-lang/dict/core','core',(data) => {if (disposed || !data) return
if (data.core) registerDictMap(data.core)
if (disposed) return
if (data.zhRu && typeof ZH_RU === 'object') {Object.assign(ZH_RU, data.zhRu)
if (typeof updateZhRu === 'function') updateZhRu(data.zhRu)}
if (typeof syncZhDom === 'function') syncZhDom()
if (!disposed){corePreloadTimer = setTimeout(() => {corePreloadTimer = null
if (!disposed) loadPluginDictionaries([])},100)}}).catch((coreErr) => {if (disposed || typeof fetch !== 'function') return
fetch('/api/dsh-russian-lang/dict/all',{ headers:{ 'Accept':'application/json' } }).then((res) => {if (disposed) return null
if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
return res.json()}).then((data) => {if (disposed || !data) return
const allDicts = Object.assign({},data.core || {},data.plugins || {},data)
if (data.zhRu && typeof ZH_RU === 'object') {Object.assign(ZH_RU, data.zhRu)
if (typeof updateZhRu === 'function') updateZhRu(data.zhRu)}
if (!disposed) registerDictMap(allDicts)
if (typeof syncZhDom === 'function') syncZhDom()}).catch((allErr) => {if (disposed) return
```

</details>

**依据 5 · 源码核查**：[lib/index.js:256-286](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/index.js#L256-L286)

Host 实际分片与 ETag 响应。

<details>
<summary>查看原文（31行）</summary>

```text
            unregsDict.push(ws.register({
              kind: 'exact',
              path: '/api/dsh-russian-lang/dict/core',
              handler: async (request, response) => {
                try {
                  if (request.method !== 'GET' && request.method !== 'HEAD') {
                    response.writeHead(405, { allow: 'GET, HEAD', 'content-type': 'application/json; charset=utf-8' })
                    response.end(JSON.stringify({ error: 'Method not allowed' }))
                    return
                  }
                  if (!isTrustedLocalRequest(request, wctx)) {
                    response.writeHead(403, { 'content-type': 'application/json; charset=utf-8' })
                    response.end(JSON.stringify({ error: 'Rejected cross-origin or untrusted host request.' }))
                    return
                  }
                  const url = new URL(request.url, 'http://localhost')
                  const shard = url.searchParams.get('shard')
                  if (shard === 'base') {
                    const core = getCoreBaseDictionaries()
                    const zhRu = getZhRuMap()
                    sendJsonWithEtag(request, response, { core, zhRu, shard: 'base' })
                    return
                  }
                  if (shard === 'extra') {
                    const core = getCoreExtraDictionaries()
                    sendJsonWithEtag(request, response, { core, shard: 'extra' })
                    return
                  }
                  const core = getCoreDictionaries()
                  const zhRu = getZhRuMap()
                  sendJsonWithEtag(request, response, { core, zhRu, shards: ['base', 'extra'] })
```

</details>

**依据 6 · 作者声明**：[CHANGELOG.md:41-46](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/CHANGELOG.md#L41-L46)

作者对命名空间与覆盖的说明。

```text
### Полный перенос пространства имён `schedule.catalog` (Issue #38 / Gitea #594)
- **Устранено выпадение перевода страницы «Задачи автоматизации»**: ядро DSH регистрирует экран как `schedule.catalog` (143 ключа), тогда как ранее часть переводов находилась под старым именем `schedule.manager`.
- В пространство `schedule.catalog` объединены все 143 ключа расписания и каталога задач.
- Пространство имён `schedule.manager` (134 ключа) полностью сохранено для обратной совместимости со старыми версиями ядра DSH.
- Размер шардов ядра остаётся в строгих пределах DSH Store (< 241 KiB из лимита 256 KiB).
- Общий объём словарей: **15,673 ключа** (100.0% покрытие, 0 непереведённых, 0 черновиков).
```

**依据 7 · 作者声明**：[CHANGELOG.md:50-63](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/CHANGELOG.md#L50-L63)

另一条作者口径。

<details>
<summary>查看原文（14行）</summary>

```text
### Комплексная локализация экосистемы плагинов и новых релизов (Fixes: #578, #579, #581, #582, #583, #584, #585, #586, #587, #588, #589, #590, #591, #592)
- **Полная локализация новых версий Mixture-of-Agents (`@goodandready/dsh-moa` v0.2.73-v0.2.86, +144 ключа, всего 386)**:
  - Пакетно переведены и выверены все ключи UI и параметров моделей для 12 последовательных релизов MoA (Fixes: #578, #582, #583, #584, #585, #586, #587, #588, #589, #590, #591, #592).
  - Локализованы: адаптивная валидация синтаксиса, настраиваемые пороги схожести, динамическое распределение весов, телеметрия сессий арбитража, детализация расхождений ответов, матрица консенсуса моделей.
- **Интеграция новых плагинов экосистемы DSH (+1 563 ключа, общее число поддерживаемых плагинов достигло 89)**:
  - `@ebony-vinyl/dsh-our-free-model` v2.8.0 (+775 ключей, неймспейс `settings.ourFreeModel`): полный перевод параметров бесплатного пула моделей, управление локальным портом OpenAI, мониторинг квот, расписания доступности, расширенная маршрутизация.
  - `@morehao/dsh-github-trending` v0.9.15 (+570 ключей, неймспейсы `dsh-github-trending` и `@morehao/dsh-github-trending`): дайджест трендов GitHub, фильтрация по языкам, звёздам и периодам, аналитические карточки репозиториев, уведомления и автосводки.
  - `@nanmicoder/dsh-agent-teams` v0.1.29 (+218 ключей, неймспейсы `agentTeams`, `@nanmicoder/dsh-agent-teams`, `dsh-agent-teams`): полная локализация рабочего пространства команд агентов, визуализация графа зависимостей задач, входящие капитана, статусы исполнителей и сводки активности.
- **Контроль совместимости и качества**:
  - Подтверждена стабильность и актуальность `@goodandready/dsh-image-gen` v0.12.26 (Fixes: #579) и устойчивость конфигурации ядра DSH 0.2.2-rc.1 (Fixes: #581).
  - Соблюдена 100% точность плейсхолдеров (0 bad PH) и отсутствие непроверенного машинного перевода (0 MT).
- **Метрики и визуальное оформление**:
  - Общий объём переведённых ключей UI вырос с 13 270 до **15 546** ключей (3 659 ключей ядра + 11 887 ключей плагинов) в 133 пространствах имён при **100.0%** покрытии UI и 0 непереведённых ключей.
  - Поддерживается **89** плагинов экосистемы DSH.
```

</details>

#### 缺口

- 发布 tarball 的 inventory 与用户实际安装版本覆盖未核验
  **影响**：不能承诺全生态或关键任务语义正确
  **进一步探讨**：先固定包与 Host 版本，再抽查审批、自动任务目录及三个实际安装插件

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 切换语言或卸载时，原生 locale 和 DOM 补译能恢复到哪里？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

插件保存正常 locale.register 返回的 disposer，重注册同一命名空间时先调用旧引用，卸载时逐项执行。冲突回退则对共享 locale.register 进行包装，遇到 already has locale 时直接合并共享字典并返回空 disposer。该清理区段没有恢复 wrapper 或逐条回滚合并数据，因此命名空间冲突路径和正常注册的退出边界不同。

DOM 补译直接写 nodeValue 或 title、placeholder、aria-label。它避开多数代码、可编辑、流式、选中文字，并通常避开聊天正文。自定义 exact override 的写入出现在聊天正文判断之前，只要通过首层保护就可能改写已完成的聊天文本；浏览器的属性补译也是另一条路径。切走俄语时取消观察、定时器与事件，没有逐节点恢复原字节。切换后重渲染可覆盖旧节点，但不能假设所有页面都重绘。俄语输入的排版和布局辅助另有设置，验证时须与词典和 DOM 补译区分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:537-561](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/client.js#L537-L561)

包装共享注册函数，重复注册回退返回空 disposer，正常路径单独清理。

<details>
<summary>查看原文（25行）</summary>

```text
const installSafeLocaleRegistration = (ls) => {if (!ls || ls.__safeLocaleInstalled || typeof ls.register !== 'function') return ls
const orig = ls.register
ls.register = function (ns,lOrObj,dict){try { return orig.call(ls,ns,lOrObj,dict) } catch (err){if (!String(err?.message || err).includes('already has locale') || !(ls.dicts instanceof Map)) throw err
const pairs = typeof lOrObj === 'string' ? [[lOrObj,dict]] :Object.entries(lOrObj || {})
let m = ls.dicts.get(ns) || (ls.dicts.set(ns,new Map()),ls.dicts.get(ns))
for (const [loc,d] of pairs){const cur = m.get(loc)
if (cur && typeof cur === 'object' && d && typeof d === 'object') Object.assign(cur,d)
else m.set(loc,d)}
if (typeof ls.publish === 'function' && ls.snapshot){ try { ls.publish(ls.snapshot.active,false) } catch { } }
return () => {}}}
ls.__safeLocaleInstalled = true
return ls}
installSafeLocaleRegistration(ctx.locale)
const registerOrUpdateNamespace = (ns,dict) => {if (disposed || !ns || typeof dict !== 'object' || !dict) return
if (!RU[ns]){RU[ns] = Object.assign({},dict)} else if (RU[ns] !== dict){Object.assign(RU[ns],dict)}
const prevDisposer = ownDisposers.get(ns)
if (typeof prevDisposer === 'function'){try { prevDisposer() } catch (_err){ void _err }
ownDisposers.delete(ns)}
try {const disposer = ctx.locale.register(ns, 'ru', RU[ns])
if (typeof disposer === 'function'){ownDisposers.set(ns,disposer)}} catch (err){console.warn('[dsh-russian-lang] Failed to register core locale for namespace:',ns,err)}}
ctx.effect(() => {disposed = false
for (const ns of Object.keys(RU)){registerOrUpdateNamespace(ns,RU[ns])}
return () => {disposed = true
for (const [ns,d] of ownDisposers.entries()){try { d() } catch (_err){ void _err }}
ownDisposers.clear()}},'dsh-russian-lang: locale-registrations')
```

</details>

**依据 2 · 源码核查**：[lib/client.js:818-848](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/client.js#L818-L848)

保护顺序、自定义覆盖与原地修改。

<details>
<summary>查看原文（31行）</summary>

```text
const isProtectedTextNode = (node) => {const p = node.parentElement
if (!p) return true
if (p.closest('[data-no-translate],[data-no-translation],.no-translate')) return true
if (p.closest('code, pre, script, style, textarea, input, select, kbd, samp, [contenteditable="true"], [data-composer-input], [role="textbox"]')) return true
if (p.closest('.katex, [data-latex], math')) return true
if (p.closest('[data-chat-flow-status="running"], [data-turn-running], [data-turn-tail], [data-streaming="true"], .dsw-turn-running, [class*="streaming"], [class*="Streaming"]')) return true
const sel = typeof window !== 'undefined' && window.getSelection && window.getSelection()
if (sel && !sel.isCollapsed && sel.rangeCount > 0){try {const range = sel.getRangeAt(0)
if (range.intersectsNode ? range.intersectsNode(node) :(sel.containsNode && sel.containsNode(node,true))){return true}} catch (e){ void e;}}
return false}
const ZH_WALKER = (root) => {try {if (runtime.getLocale && runtime.getLocale().active !== 'ru') return
const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT)
const hits = []
const curOverrides = getOverrides()
for (let node = walker.nextNode();node;node = walker.nextNode()){const val = node.nodeValue
if (!val) continue
const trimmed = val.trim()
if (!trimmed) continue
if (isProtectedTextNode(node)) continue
if (curOverrides[trimmed] !== undefined){node.nodeValue = val.replace(trimmed,curOverrides[trimmed])
continue}
const p = node.parentElement
const isProtectedContent = p && p.closest('.chat-message, .markdown-body')
if (trimmed.length >= 1 && ZH_CJK.test(val)) {if (!isProtectedContent) hits.push(node)} else if (trimmed.length >= 1 && DOM_EN_TEXT[trimmed]) {if (!isProtectedContent) {node.nodeValue = val.replace(trimmed, DOM_EN_TEXT[trimmed])}}}
for (const node of hits){const next = zhTranslateText(node.nodeValue)
if (next && next !== node.nodeValue) node.nodeValue = next}
for (const el of root.querySelectorAll ? root.querySelectorAll('[title],[placeholder],[aria-label]') :[]){if (el.closest && el.closest('[data-no-translate],[data-no-translation],.no-translate')) continue
for (const attr of ['title','placeholder','aria-label']){const v = el.getAttribute && el.getAttribute(attr)
if (v){const tr = v.trim()
if (DOM_EN_TEXT[tr]) {el.setAttribute(attr, v.replace(tr, DOM_EN_TEXT[tr]))} else if (DOM_EN_ATTRS[tr]) {el.setAttribute(attr, v.replace(tr, DOM_EN_ATTRS[tr]))} else if (ZH_CJK.test(v)) {const next = zhTranslateText(v)
if (next) el.setAttribute(attr,next)}}}}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:861-885](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/client.js#L861-L885)

切语言停止观察，未逐节点恢复；随后进入输入排版逻辑。

<details>
<summary>查看原文（25行）</summary>

```text
let unsubZhObserver = null
const syncZhDom = () => {try {if (typeof document === 'undefined') return
const ru = runtime.getLocale().active === 'ru'
if (!ru){if (unsubZhObserver){ unsubZhObserver();unsubZhObserver = null }
if (zhDebounceTimer){ clearTimeout(zhDebounceTimer);zhDebounceTimer = null }
document.removeEventListener('pointerup',onInteraction)
document.removeEventListener('click',onInteraction)
return}
if (!unsubZhObserver){unsubZhObserver = domMultiplexer.subscribe('zh-dom',(nodes) => {for (let i = 0;i < nodes.length;i++){if (nodes[i].nodeType === 1){queueZhWalk()
return}}},{ skipStreaming:true })
document.addEventListener('pointerup',onInteraction,{ passive:true })
document.addEventListener('click',onInteraction,{ passive:true })}
queueZhWalk()} catch (err){ void err;}}
const unsubscribeZh = runtime.subscribe(syncZhDom)
ctx.effect(() => {return () => {unsubscribeZh()
if (unsubZhObserver){ unsubZhObserver();unsubZhObserver = null }
if (zhDebounceTimer){ clearTimeout(zhDebounceTimer);zhDebounceTimer = null }
if (typeof document !== 'undefined'){document.removeEventListener('pointerup',onInteraction)
document.removeEventListener('click',onInteraction)}}},'dsh-russian-lang: zh-dom')
syncZhDom()
const TYPO_YO_PAIRS = [["еще","ещё"],["ее","её"],["черный","чёрный"],["черная","чёрная"],["черные","чёрные"],["зеленый","зелёный"],["желтый","жёлтый"],["легкий","лёгкий"],["тяжелый","тяжёлый"],["надежный","надёжный"],["дешевый","дешёвый"],["идет","идёт"],["дает","даёт"],["ведет","ведёт"],["несет","несёт"],["живет","живёт"],["привел","привёл"],["шел","шёл"],["нее","неё"],["мое","моё"],["серьезно","серьёзно"],["придется","придётся"],["насчет","насчёт"],["твое","твоё"],["свое","своё"],["пойдем","пойдём"],["пришел","пришёл"],["нашел","нашёл"],["идем","идём"],["вперед","вперёд"],["пошел","пошёл"],["ребенка","ребёнка"],["ребенок","ребёнок"],["счет","счёт"],["своем","своём"],["придет","придёт"],["ушел","ушёл"],["ждет","ждёт"],["мертв","мёртв"],["твоем","твоём"],["вернется","вернётся"],["днем","днём"],["найдем","найдём"],["пойдет","пойдёт"],["начнем","начнём"],["вернемся","вернёмся"],["остается","остаётся"],["принес","принёс"],["идешь","идёшь"],["трех","трёх"],["ребенком","ребёнком"],["самолет","самолёт"],["определенно","определённо"],["пойдешь","пойдёшь"],["умрет","умрёт"],["прием","приём"],["прошел","прошёл"],["убьет","убьёт"],["тетя","тётя"],["провел","провёл"],["произойдет","произойдёт"],["семьей","семьёй"],["пойдемте","пойдёмте"],["пройдет","пройдёт"],["возьмем","возьмём"],["вернешься","вернёшься"],["найдешь","найдёшь"],["живешь","живёшь"],["отчет","отчёт"],["займет","займёт"],["ждем","ждём"],["сошел","сошёл"],["вдвоем","вдвоём"],["найдет","найдёт"],["вел","вёл"],["живем","живём"],["зашел","зашёл"],["начнется","начнётся"],["путем","путём"],["подойдет","подойдёт"],["режиссер","режиссёр"],["уйдет","уйдёт"],["придешь","придёшь"],["идемте","идёмте"],["ведешь","ведёшь"],["пес","пёс"],["умрешь","умрёшь"],["ждешь","ждёшь"],["найдете","найдёте"],["найдется","найдётся"],["клево","клёво"],["поймешь","поймёшь"],["разберемся","разберёмся"],["времен","времён"],["введен","введён"],["включен","включён"],["включенных","включённых"],["возьмется","возьмётся"],["завершен","завершён"],["завершенного","завершённого"],["задает","задаёт"],["задается","задаётся"],["заменен","заменён"],["звезд","звёзд"],["звезды","звёзды"],["изменен","изменён"],["истек","истёк"],["незавершенная","незавершённая"],["неподтвержденные","неподтверждённые"],["несохраненные","несохранённые"],["обновлен","обновлён"],["обновленные","обновлённые"],["определен","определён"],["отклонен","отклонён"],["отменен","отменён"],["очередность","очерёдность"],["поврежден","повреждён"],["повторен","повторён"],["подключен","подключён"],["подтвержденные","подтверждённые"],["приемки","приёмки"],["раздает","раздаёт"],["разрешенная","разрешённая"],["разрешенные","разрешённые"],["создаем","создаём"],["сойдется","сойдётся"],["сохранен","сохранён"],["сохраненный","сохранённый"],["счету","счёту"],["тяжелые","тяжёлые"],["темная","тёмная"],["уберет","уберёт"],["удален","удалён"],["учетные","учётные"],["учетных","учётных"],["емкости","ёмкости"],["емкость","ёмкость"]]
const typoYo = makeTypoYo(TYPO_YO_PAIRS)
const getTypoConf = () => {try {const t = resolveTypography(scope.getSnapshot().value)
if (!t.enabled) return null
return { yo:t.yo }} catch (err){ return null }}
```

</details>

#### 缺口

- 真实宿主的重绘和不同插件共用命名空间的退出效果未测试
  **影响**：俄语残留和覆盖边界需实际验证
  **进一步探讨**：切回英语比较现有文本、属性和已完成消息，必要时刷新或卸载后再核对

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 反向代理兼容如何改变翻译和本机副作用的请求边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、功能与机制

#### 完整回答

新版从 webStartup 取 trustedHosts 和 publicUrl 并归一为主机名，允许配置域名上的字典和翻译端点通过同源检查。Host 必须属于本机、允许的局域网或额外主机；明确 cross-site 会拒绝，Origin 缺失或为 null 可放行，已知客户端协议也有例外。翻译 POST 另要自定义请求头。该头和主机检查是请求边界，源码未在这些检查中证明登录用户身份。

启用机器翻译后，Google 按块把文字放在请求查询参数，服务失败或达到预算可能拼回原文并仍随整体 HTTP 200 返回。LibreTranslate 向配置地址发正文，LLM 发给当前宿主模型服务，实际数据去向由部署决定。默认 off 拒绝翻译请求。配置容器的 POST 还要求 socket 对端为回环，反代本地连接也可能满足这一条件，须核对上游鉴权与实际客户端到达性。升级状态 GET 使用新版域名信任路径，安装 POST 另走 isTrustedUpdateRequest 并执行安装后提示重启。不能把读取字典成功当成容器、更新或翻译权限验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/translator.js:178-246](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/translator.js#L178-L246)

读取额外可信主机、拒绝 cross-site 并列出 Origin 例外。

<details>
<summary>查看原文（69行）</summary>

```text
export function trustedHostnames(ctx) {
  const out = new Set()
  let startup = null
  try {
    startup = typeof ctx?.get === 'function' ? ctx.get('webStartup') : ctx?.webStartup
  } catch {
    startup = null
  }
  if (!startup || typeof startup !== 'object') return []
  const declared = Array.isArray(startup.trustedHosts) ? startup.trustedHosts : []
  for (const entry of declared) {
    const hostname = normalizeTrustedHostname(entry)
    if (hostname) out.add(hostname)
  }
  const publicHostname = normalizeTrustedHostname(startup.publicUrl)
  if (publicHostname) out.add(publicHostname)
  return [...out]
}

export function isTrustedLocalRequest(request, ctx) {
  const host = header(request, 'host')
  if (typeof host !== 'string' || host === '') return false
  let hostUrl
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }

  const extraHosts = trustedHostnames(ctx)

  // 1. Host hostname MUST be allowed loopback or LAN host (DNS Rebinding protection: #536)
  //    or a host this deployment explicitly declared trustworthy.
  if (!isAllowedLocalOrLanHost(hostUrl.hostname, extraHosts)) {
    return false
  }



  // 3. Защита от межсайтовых запросов (Same-Origin / Cross-Site)
  const site = header(request, 'sec-fetch-site')
  const origin = header(request, 'origin')

  if (site === 'cross-site') {
    return false
  }

  if (origin === undefined || origin === 'null') {
    return true
  }

  try {
    const url = new URL(origin)
    if (
      url.protocol === 'file:' ||
      url.protocol === 'vscode-file:' ||
      url.protocol === 'dsh:' ||
      url.protocol === 'app:'
    ) {
      return true
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false

    // Origin hostname также обязан быть в доверенном local/LAN списке
    if (!isAllowedLocalOrLanHost(url.hostname, extraHosts)) {
      return false
    }

    if (url.host === hostUrl.host) return true
```

</details>

**依据 2 · 源码核查**：[lib/translator.js:363-368](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/translator.js#L363-L368)

翻译自定义头和主机检查。

```text
export const TRANSLATOR_HEADER = 'x-dsh-translator'

export function isTrustedTranslatorRequest(request, ctx) {
  if (header(request, TRANSLATOR_HEADER) !== '1') return false
  return isTrustedLocalRequest(request, ctx)
}
```

**依据 3 · 源码核查**：[lib/translator.js:503-542](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/translator.js#L503-L542)

Google 分块回退和 LibreTranslate 正文请求。

<details>
<summary>查看原文（40行）</summary>

```text
      const transSents = []
      for (const batch of batches) {
        if (!batch.trim()) continue
        if (totalRequests >= MAX_REQUESTS) {
          transSents.push(batch)
          continue
        }
        totalRequests++
        const gurl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + encodeURIComponent(targetLang) + '&dt=t&q=' + encodeURIComponent(batch)
        try {
          const res = await fetch(gurl, { signal: AbortSignal.timeout(6000) })
          if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data) && Array.isArray(data[0])) {
              transSents.push(data[0].map((it) => it[0]).join(''))
              continue
            }
          }
        } catch (_) { /* bestEffort */ void _; }
        transSents.push(batch)
      }
      transParas.push(transSents.join(''))
    }
    resultParts.push(transParas.join('\n\n'))
  }
  return resultParts.join('')
}

async function translateLibre(text, targetLang = 'ru', localUrl = 'http://127.0.0.1:5000') {
  const endpoint = localUrl.replace(/\/+$/, '') + '/translate'
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'auto',
      target: targetLang,
      format: 'text'
    }),
    signal: AbortSignal.timeout(15000)
```

</details>

**依据 4 · 源码核查**：[lib/translator.js:600-625](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/translator.js#L600-L625)

Docker setup 使用回环 socket 和翻译信任检查。

<details>
<summary>查看原文（26行）</summary>

```text
  // 2. Setup endpoint: POST /api/dsh-russian-lang/translator/setup
  unregs.push(
    ws.register({
      kind: 'exact',
      path: '/api/dsh-russian-lang/translator/setup',
      handler: async (request, response) => {
        try {
          if (request.method !== 'POST') {
            response.writeHead(405, { 'content-type': 'application/json' })
            response.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }
          if (!isTrustedTranslatorRequest(request, wctx) || !isLoopback(request?.socket?.remoteAddress)) {
            response.writeHead(403, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store'
            })
            response.end(JSON.stringify({ error: 'Rejected non-local or cross-origin translator setup request.' }))
            return
          }
          const result = await setupLibreTranslateContainer()
          response.writeHead(200, {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store'
          })
          response.end(JSON.stringify(result))
```

</details>

**依据 5 · 源码核查**：[lib/translator.js:636-675](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/translator.js#L636-L675)

翻译 POST 及默认关闭。

<details>
<summary>查看原文（40行）</summary>

```text
  // 3. Translation gateway: POST /api/dsh-russian-lang/translate
  unregs.push(
    ws.register({
      kind: 'exact',
      path: '/api/dsh-russian-lang/translate',
      handler: async (request, response) => {
        try {
          if (request.method !== 'POST') {
            response.writeHead(405, { 'content-type': 'application/json' })
            response.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }
          if (!isTrustedTranslatorRequest(request, wctx)) {
            response.writeHead(403, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store'
            })
            response.end(JSON.stringify({ error: 'Rejected non-local or cross-origin translation request.' }))
            return
          }

          const body = await readJsonBody(request)
          const text = body.text
          const target = body.target || 'ru'

          if (!text || typeof text !== 'string') {
            response.writeHead(400, { 'content-type': 'application/json; charset=utf-8' })
            response.end(JSON.stringify({ error: 'Параметр "text" обязателен для перевода.' }))
            return
          }

          const settings = resolveTranslatorSettings(settingsSource)
          const engine = settings.translateEngine || 'off'
          const localUrl = settings.localApiUrl || 'http://127.0.0.1:5000'

          if (engine === 'off') {
            response.writeHead(403, { 'content-type': 'application/json; charset=utf-8' })
            response.end(JSON.stringify({
              error: 'Машинный перевод отключен в настройках плагина. Включите локальный сервер (LibreTranslate) или Google Translate в настройках dsh-russian-lang.'
            }))
```

</details>

**依据 6 · 源码核查**：[lib/translator.js:679-720](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/translator.js#L679-L720)

三种引擎与统一响应。

<details>
<summary>查看原文（42行）</summary>

```text
          let translatedText = ''
          const currentLlm = (typeof getLlm === 'function' ? getLlm() : null) || wctx?.llm
          if (engine === 'llm' || (engine === 'auto' && currentLlm)) {
            if (!currentLlm) {
              response.writeHead(503, { 'content-type': 'application/json; charset=utf-8' })
              response.end(JSON.stringify({
                error: 'Сервис ctx.llm в данный момент недоступен. Проверьте настройку провайдера моделей в DSH.'
              }))
              return
            }
            try {
              translatedText = await translateLLM(currentLlm, text, target)
            } catch (err) {
              response.writeHead(503, { 'content-type': 'application/json; charset=utf-8' })
              response.end(JSON.stringify({
                error: 'Перевод через ctx.llm завершился ошибкой: ' + err.message
              }))
              return
            }
          } else if (engine === 'local') {
            try {
              translatedText = await translateLibre(text, target, localUrl)
            } catch (err) {
              response.writeHead(503, { 'content-type': 'application/json; charset=utf-8' })
              response.end(JSON.stringify({
                error: 'Локальный переводчик LibreTranslate недоступен (' + err.message + '). Проверьте состояние контейнера в настройках плагина.'
              }))
              return
            }
          } else if (engine === 'google') {
            translatedText = await translateGoogle(text, target)
          } else {
            response.writeHead(400, { 'content-type': 'application/json; charset=utf-8' })
            response.end(JSON.stringify({ error: 'Неизвестный движок перевода: ' + engine }))
            return
          }

          response.writeHead(200, {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store'
          })
          response.end(JSON.stringify({ translatedText, engine }))
```

</details>

**依据 7 · 源码核查**：[lib/plugin-updater.js:347-396](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/plugin-updater.js#L347-L396)

状态与额外更新门槛、安装和重启回执。

<details>
<summary>查看原文（50行）</summary>

```text
  return ws.register({
    kind: 'exact',
    path: options.endpoint,
    handler: async (request, response) => {
      try {
        if (!isTrustedLocalRequest(request, host)) {
          response.writeHead(403, { 'content-type': 'application/json; charset=utf-8' })
          response.end(JSON.stringify({ error: 'Rejected cross-origin or untrusted host request.' }))
          return
        }
        const target = runtime()
        if (request.method === 'GET' || request.method === 'HEAD') {
          const payload = await status(options, target)
          response.writeHead(200, {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store',
          })
          response.end(request.method === 'HEAD' ? undefined : JSON.stringify(payload))
          return
        }
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'GET, HEAD, POST' })
          response.end()
          return
        }
        if (!isTrustedUpdateRequest(request)) {
          json(response, 403, { error: 'Rejected non-local or cross-origin update request.' })
          return
        }
        if (installing) {
          json(response, 409, { error: 'This plugin is already updating.' })
          return
        }
        installing = true
        try {
          const before = await status(options, target)
          if (before.latestVersion === undefined) {
            json(response, 503, { error: 'The latest version is temporarily unavailable.' })
            return
          }
          if (!before.updateAvailable) {
            json(response, 200, before)
            return
          }
          await installExact(target, `${options.packageName}@${before.latestVersion}`, options)
          json(response, 200, {
            ...before,
            updatedVersion: before.latestVersion,
            restartRequired: true,
          })
```

</details>

#### 缺口

- 生产反代的对端、认证拦截及真实引擎去向未验证
  **影响**：无法承诺敏感正文不外发或副作用路由隔离
  **进一步探讨**：仅在隔离网络用无敏感文本检查路由与出站，覆盖允许域名、缺 Origin 和本地代理

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 新版依赖、个人词典和斜杠别名能降低哪类排障成本？

**研究主题**：工程质量与复用、效果与总成本、依赖、兼容与流程

#### 完整回答

0.4.26 固定清单扩展 Cordis peer 到 4.1 系列并声明 Node 22+ 与多段 DSH 预发布范围。作者记录称完成干净 npm ci 和测试，但固定仓库没有跟踪 package-lock.json，清单 scripts.test 仅做两入口语法检查。作者可能使用其他发布或开发环境，本轮没有证据复现其完整依赖和界面测试。升级需要按实际 Host 和包版本重新核对。

用户词典加载会过滤危险属性名和非字符串值，损坏的 JSON 现在发 UserLocaleWarning 并继续处理其他文件。统计函数可注入 inventory、英语目录和包文件路径，避免用重命名原文件来模拟缺失；版本面板仍需要正确的发布材料和 profile 信息。斜杠命令将 commands.view 的查询与真正执行分开，handler 异常不再吞掉并落到其他执行分支。不过更早的 commands.execute 分支仍在异常时尝试另一调用签名，异常若发生于有副作用的执行后，不能静态保证无第二次尝试。对照原生命令和一个无副作用别名更容易查明版本差异。

#### 证据与依据

**依据 1 · 作者声明**：[CHANGELOG.md:3-14](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/CHANGELOG.md#L3-L14)

作者的依赖修复、测试和隔离声明。

<details>
<summary>查看原文（12行）</summary>

```text
### Расширение диапазона cordis и изоляция тестов (Fixes: #604, #605, #606)
- **Расширение диапазона peer cordis под DSH 0.2.2-rc.1 (Fix: #604)**:
  - В `peerDependencies` диапазон `@deepseek-ai/cordis` расширен до `~4.0.4 || ~4.0.5 || ~4.0.6-alpha.1 || ~4.1.0`.
  - В `devDependencies` cordis обновлён до `~4.1.0`, устраняя конфликт `ERESOLVE` с `dsh-client-locale@0.2.2-rc.1`.
- **Восстановление чистого npm ci и актуализация зависимостей (Fix: #605)**:
  - Пакеты `react` и `react-dom` (`^18.2.0`) явно добавлены в `devDependencies` для тестов рендеринга.
  - Актуализирован `package-lock.json` со всеми `devDependencies` проекта; `npm ci` и `npm test` успешно проходят с чистого клона.
  - Добавлены `overrides` для уязвимостей `zod` (>=4.6.6) и `fast-uri` (>=3.1.9); `npm audit --omit=dev` показывает 0 уязвимостей.
- **Изоляция тестовой среды и устранение сайд-эффектов на диске (Fix: #606)**:
  - `getPluginsLocalizationOverview` поддерживает опции и переменные окружения для путей (`pluginsEnFile`, `inventoryFile`).
  - Устранено переименование корневого файла `plugins-en.json` на диске в тесте v0.3.45.
  - Обеспечена полная параллельная воспроизводимость тестов в конкурентных запусках.
```

</details>

**依据 2 · 源码核查**：[package.json:82-99](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/package.json#L82-L99)

固定清单声明的运行范围和测试入口。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "node": ">=22",
    "dsh": "0.2.0-rc.2 || >=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-0 <0.2.3-0"
  },
  "scripts": {
    "test": "node --check lib/index.js && node --check lib/client.js"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4 || ~4.0.5 || ~4.0.6-alpha.1 || ~4.1.0",
    "@deepseek-ai/dsh-client-locale": "0.2.0-rc.2 || >=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-0 <0.2.3-0",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.0-rc.2 || >=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-0 <0.2.3-0",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.0-rc.2 || >=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-0 <0.2.3-0",
    "@deepseek-ai/dsh-commands": ">=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-0 <0.3.0",
    "@deepseek-ai/dsh-home-paths": "0.2.0-rc.2 || >=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-0 <0.2.3-0",
    "@deepseek-ai/dsh-host-webserver": "0.2.0-rc.2 || >=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-0 <0.2.3-0",
    "@deepseek-ai/dsh-settings": "0.2.0-rc.2 || >=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-0 <0.2.3-0",
    "@deepseek-ai/schemastery": "~3.18.4 || ~3.18.5 || ~3.18.6-alpha.1 || ~3.19.0",
    "react": "^18.2.0"
```

</details>

**依据 3 · 源码核查**：[lib/locales.js:20-46](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/locales.js#L20-L46)

覆盖文件字段过滤与解析告警。

<details>
<summary>查看原文（27行）</summary>

```text
      if (!file.endsWith(".json")) continue
      try {
        const data = JSON.parse(readFileSync(join(userLocalesDir, file), "utf8"))
        if (!data || typeof data !== "object") continue
        for (const [ns, entries] of Object.entries(data)) {
          // #558: Защита от Prototype Pollution
          if (!ns || ns === "__proto__" || ns === "constructor" || ns === "prototype") continue
          if (typeof ns !== "string" || !/^[a-zA-Z0-9@_./-]+$/.test(ns)) continue
          if (!entries || typeof entries !== "object" || Array.isArray(entries)) continue

          if (!result[ns]) {
            result[ns] = Object.create(null)
          }
          for (const [k, v] of Object.entries(entries)) {
            if (!k || k === "__proto__" || k === "constructor" || k === "prototype") continue
            if (typeof v === "string") {
              result[ns][k] = v
            }
          }
        }
      } catch (err) {
        if (typeof process !== "undefined" && typeof process.emitWarning === "function") { process.emitWarning(`[dsh-russian-lang] Не удалось загрузить пользовательский словарь ${file}: ${err?.message || err}`, "UserLocaleWarning") }
      }
    }
  } catch (err) {
    if (typeof process !== "undefined" && typeof process.emitWarning === "function") { process.emitWarning(`[dsh-russian-lang] Не удалось прочитать каталог пользовательских словарей: ${err?.message || err}`, "UserLocaleWarning") }
  }
```

</details>

**依据 4 · 源码核查**：[lib/locales.js:248-283](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/locales.js#L248-L283)

统计输入可由路径替换。

<details>
<summary>查看原文（36行）</summary>

```text
export function getPluginsLocalizationOverview(options = {}) {
  ensurePluginCache()
  let inventory = null
  let pluginsEn = null
  let pkg = null

  const invFile = options.inventoryFile || process.env.DSH_INVENTORY_FILE || INVENTORY_FILE
  const enFile = options.pluginsEnFile || process.env.DSH_PLUGINS_EN_FILE || PLUGINS_EN_FILE
  const enDir = options.pluginsEnDir || process.env.DSH_PLUGINS_EN_DIR || PLUGINS_EN_DIR
  const pkgFile = options.pkgFile || PKG_FILE

  if (existsSync(invFile)) {
    try { inventory = JSON.parse(readFileSync(invFile, "utf8")) } catch (_) { /* bestEffort */ void _; }
  }
  // #537: Если в inventory есть plugins_coverage, исключаем чтение каталога с 50 JSON-файлами
  if (!inventory || !inventory.plugins_coverage) {
    if (existsSync(enFile)) {
      try { pluginsEn = JSON.parse(readFileSync(enFile, "utf8")) } catch (_) { /* bestEffort */ void _; }
    } else if (existsSync(enDir)) {
      pluginsEn = {}
      try {
        for (const file of readdirSync(enDir).sort()) {
          if (!file.endsWith(".json")) continue
          try {
            const data = JSON.parse(readFileSync(join(enDir, file), "utf8"))
            Object.assign(pluginsEn, data)
          } catch (_) { /* bestEffort */ void _; }
        }
      } catch (_) { /* bestEffort */ void _; }
    }
  }
  if (existsSync(pkgFile)) {
    try { pkg = JSON.parse(readFileSync(pkgFile, "utf8")) } catch (_) { /* bestEffort */ void _; }
  }

  const getStatus = makePluginLocalizationStatus(_pluginCache, pluginsEn, inventory)
```

</details>

**依据 5 · 源码核查**：[lib/commands.js:58-102](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/commands.js#L58-L102)

签名回退及新版 view 查询、执行分离。

<details>
<summary>查看原文（45行）</summary>

```text
            // Support both official 4-arg DSH API and 2-arg mock execute(target, invocation)
            if (commands.execute.length === 2) {
              execRes = await commands.execute(alias.target, invocation)
            } else {
              try {
                execRes = await commands.execute(agent, line, attachments, signal)
              } catch (e) {
                try {
                  execRes = await commands.execute(alias.target, invocation)
                } catch (_) {
                  throw e
                }
              }
            }
            if (execRes && typeof execRes === 'object') {
              if (execRes.result && typeof execRes.result === 'object') return execRes.result
              return execRes
            }
            return { kind: 'success', text: String(execRes || '') }
          }

          // 2. Direct lookup via commands.view(agent)
          if (typeof commands.view === 'function') {
            let targetCmd = null
            try {
              const view = commands.view(agent)
              targetCmd = view?.get ? view.get(alias.target) : null
            } catch {
              /* ignore view lookup error and try fallbacks */
            }
            if (targetCmd?.definition?.handler) {
              return await targetCmd.definition.handler({
                agent,
                rawInput: raw,
                attachments,
                signal
              })
            }
          }

          // 3. session.executeCommand
          const session = invocation?.session || invocation?.agent?.session
          if (typeof session?.executeCommand === 'function') {
            return await session.executeCommand(alias.target, raw)
          }
```

</details>

#### 缺口

- 不同宿主版本中命令失败与重复尝试的实机情况未知
  **影响**：语言别名不应替代关键命令的权限核查
  **进一步探讨**：用一次无副作用命令记录两个兼容分支、错误与调用次数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证俄语适配值得保留，同时降低误操作和退出成本？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

俄语为主的用户可在隔离 DSH 配置里先验证包内词条，不启用机器翻译和容器。选择实际使用的设置、只读任务和权限拒绝三个流程，记录每一步显示的原文对应项及是否理解正确。对照原生英语，比较完成次数、严重误解数、恢复至英语所需步骤和耗时。若审批或错误含义不明确、原文不能恢复、内容被误改，就切回英语刷新，必要时禁用插件。机器翻译、Docker 和更新各自有外部调用或安装成本，应在单独条件下评价。

未验证的设计假设是为设置、审批、失败恢复建立按 Host 与插件版本固定的术语验收卡，同时显示源词条和最终文案。对照现有键覆盖与版本面板，记录其新增发现的危险误译数、维护耗时和跨版本失效。若不能多发现影响操作的错误，或升级维护耗时持续超过收益，则收窄到关键审批流程或放弃。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:818-879](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/client.js#L818-L879)

给出需对照的保护、替换和回退路径。

<details>
<summary>查看原文（62行）</summary>

```text
const isProtectedTextNode = (node) => {const p = node.parentElement
if (!p) return true
if (p.closest('[data-no-translate],[data-no-translation],.no-translate')) return true
if (p.closest('code, pre, script, style, textarea, input, select, kbd, samp, [contenteditable="true"], [data-composer-input], [role="textbox"]')) return true
if (p.closest('.katex, [data-latex], math')) return true
if (p.closest('[data-chat-flow-status="running"], [data-turn-running], [data-turn-tail], [data-streaming="true"], .dsw-turn-running, [class*="streaming"], [class*="Streaming"]')) return true
const sel = typeof window !== 'undefined' && window.getSelection && window.getSelection()
if (sel && !sel.isCollapsed && sel.rangeCount > 0){try {const range = sel.getRangeAt(0)
if (range.intersectsNode ? range.intersectsNode(node) :(sel.containsNode && sel.containsNode(node,true))){return true}} catch (e){ void e;}}
return false}
const ZH_WALKER = (root) => {try {if (runtime.getLocale && runtime.getLocale().active !== 'ru') return
const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT)
const hits = []
const curOverrides = getOverrides()
for (let node = walker.nextNode();node;node = walker.nextNode()){const val = node.nodeValue
if (!val) continue
const trimmed = val.trim()
if (!trimmed) continue
if (isProtectedTextNode(node)) continue
if (curOverrides[trimmed] !== undefined){node.nodeValue = val.replace(trimmed,curOverrides[trimmed])
continue}
const p = node.parentElement
const isProtectedContent = p && p.closest('.chat-message, .markdown-body')
if (trimmed.length >= 1 && ZH_CJK.test(val)) {if (!isProtectedContent) hits.push(node)} else if (trimmed.length >= 1 && DOM_EN_TEXT[trimmed]) {if (!isProtectedContent) {node.nodeValue = val.replace(trimmed, DOM_EN_TEXT[trimmed])}}}
for (const node of hits){const next = zhTranslateText(node.nodeValue)
if (next && next !== node.nodeValue) node.nodeValue = next}
for (const el of root.querySelectorAll ? root.querySelectorAll('[title],[placeholder],[aria-label]') :[]){if (el.closest && el.closest('[data-no-translate],[data-no-translation],.no-translate')) continue
for (const attr of ['title','placeholder','aria-label']){const v = el.getAttribute && el.getAttribute(attr)
if (v){const tr = v.trim()
if (DOM_EN_TEXT[tr]) {el.setAttribute(attr, v.replace(tr, DOM_EN_TEXT[tr]))} else if (DOM_EN_ATTRS[tr]) {el.setAttribute(attr, v.replace(tr, DOM_EN_ATTRS[tr]))} else if (ZH_CJK.test(v)) {const next = zhTranslateText(v)
if (next) el.setAttribute(attr,next)}}}}
if (root.getAttribute){for (const attr of ['title','placeholder','aria-label']){const v = root.getAttribute(attr)
if (v){const tr = v.trim()
if (DOM_EN_TEXT[tr]) root.setAttribute(attr, v.replace(tr, DOM_EN_TEXT[tr]))
else if (DOM_EN_ATTRS[tr]) root.setAttribute(attr,v.replace(tr,DOM_EN_ATTRS[tr]))}}}} catch (err){ void err;}}
let zhObserver = null
let zhWalking = false
const queueZhWalk = () => {if (zhDebounceTimer) return
zhDebounceTimer = setTimeout(() => {zhDebounceTimer = null
if (zhWalking) return
zhWalking = true
try {ZH_WALKER(document.body)} finally {zhWalking = false}},80)}
const onInteraction = () => queueZhWalk()
let unsubZhObserver = null
const syncZhDom = () => {try {if (typeof document === 'undefined') return
const ru = runtime.getLocale().active === 'ru'
if (!ru){if (unsubZhObserver){ unsubZhObserver();unsubZhObserver = null }
if (zhDebounceTimer){ clearTimeout(zhDebounceTimer);zhDebounceTimer = null }
document.removeEventListener('pointerup',onInteraction)
document.removeEventListener('click',onInteraction)
return}
if (!unsubZhObserver){unsubZhObserver = domMultiplexer.subscribe('zh-dom',(nodes) => {for (let i = 0;i < nodes.length;i++){if (nodes[i].nodeType === 1){queueZhWalk()
return}}},{ skipStreaming:true })
document.addEventListener('pointerup',onInteraction,{ passive:true })
document.addEventListener('click',onInteraction,{ passive:true })}
queueZhWalk()} catch (err){ void err;}}
const unsubscribeZh = runtime.subscribe(syncZhDom)
ctx.effect(() => {return () => {unsubscribeZh()
if (unsubZhObserver){ unsubZhObserver();unsubZhObserver = null }
if (zhDebounceTimer){ clearTimeout(zhDebounceTimer);zhDebounceTimer = null }
if (typeof document !== 'undefined'){document.removeEventListener('pointerup',onInteraction)
document.removeEventListener('click',onInteraction)}}},'dsh-russian-lang: zh-dom')
```

</details>

**依据 2 · 源码核查**：[lib/locales.js:283-321](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/locales.js#L283-L321)

现有覆盖及安装版本状态作为基线。

<details>
<summary>查看原文（39行）</summary>

```text
  const getStatus = makePluginLocalizationStatus(_pluginCache, pluginsEn, inventory)
  const supportedPlugins = (inventory && inventory.supported_plugins) || {}

  const profileDir = resolveProfileDir()
  let installedDeps = {}
  try {
    const webPkgPath = join(profileDir, "package.json")
    if (existsSync(webPkgPath)) {
      const wp = JSON.parse(readFileSync(webPkgPath, "utf8"))
      installedDeps = wp.dependencies || {}
    }
  } catch (_) { /* bestEffort */ void _; }

  const pluginsList = []

  for (const [pkgName, ver] of Object.entries(supportedPlugins)) {
    const declared = installedDeps[pkgName] || null
    const installedVer = getInstalledPluginVersion(profileDir, pkgName, declared)
    const cleanVer = String(ver).replace(/^(\^|~|>=)?(file:[^#]+#?)?/, "").replace(/^.*-(\d+\.\d+\.\d+).tgz$/, "$1")

    if (HEADLESS_PLUGINS.has(pkgName) || (inventory && Array.isArray(inventory.headless_plugins) && inventory.headless_plugins.includes(pkgName))) {
      pluginsList.push({
        packageName: pkgName,
        namespace: null,
        installedVersion: installedVer,
        verifiedVersion: cleanVer,
        status: "headless",
        count: 0,
        total: 0,
        percent: 100,
        label: "Серверный плагин (без UI)",
        missingKeys: []
      })
      continue
    }

    const resolvedNs = resolvePluginNamespace(pkgName, _pluginCache)
    const ns = resolvedNs || _pluginIndex.get(pkgName.replace(/^@[^/]+\//, "").toLowerCase()) || pkgName
    const stat = getStatus(ns, pkgName, installedVer)
```

</details>

**依据 3 · 源码核查**：[lib/translator.js:667-680](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/efc89845f1baafbb95dd54bd2b08840592a35ffa/lib/translator.js#L667-L680)

可将默认关闭的机器翻译排除在初次试验之外。

<details>
<summary>查看原文（14行）</summary>

```text
          const settings = resolveTranslatorSettings(settingsSource)
          const engine = settings.translateEngine || 'off'
          const localUrl = settings.localApiUrl || 'http://127.0.0.1:5000'

          if (engine === 'off') {
            response.writeHead(403, { 'content-type': 'application/json; charset=utf-8' })
            response.end(JSON.stringify({
              error: 'Машинный перевод отключен в настройках плагина. Включите локальный сервер (LibreTranslate) или Google Translate в настройках dsh-russian-lang.'
            }))
            return
          }

          let translatedText = ''
          const currentLlm = (typeof getLlm === 'function' ? getLlm() : null) || wctx?.llm
```

</details>

#### 缺口

- 缺少真实俄语用户术语验收与对照时间
  **影响**：目前只能支持小范围试用路径
  **进一步探讨**：用固定任务和真实俄语使用者复核关键提示，再考虑扩展

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
