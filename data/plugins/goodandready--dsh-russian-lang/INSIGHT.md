# dsh-russian-lang

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4b2c773](https://github.com/GooDAnDReaDY/dsh-russian-lang/tree/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GooDAnDReaDY/dsh-russian-lang) [![npm 30d 12,751](https://img.shields.io/static/v1?label=npm+30d&message=12%2C751&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@goodandready/dsh-russian-lang) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@goodandready/dsh-russian-lang)
<!-- END META -->

> **功能**：为 DSH Web 提供俄语界面词典、排版与键盘布局辅助、会话翻译和本地化检查。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持将原生俄语词典、插件版本状态与输入辅助组合成宿主语言体验。贡献是多层本地化适配，底层locale、缓存和DOM观察均为既有技术；字典数量不等于全生态任务验证。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03)最影响可靠性的边界是原生locale、DOM直接替换与机器翻译混在同一语言体验中。停止观察不逐节点恢复全部补译，Google分块失败可混回原文，用户不能把页面俄语或200响应当全部正确。

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
  - [Q01 · 俄语本地化解决什么问题，覆盖率是否代表可用性？](#detail-section-11)
  - [Q02 · 原生词典、DOM补译与语言切换如何挂载和退出？](#detail-section-12)
  - [Q03 · 机器翻译和一键更新会执行什么额外动作？](#detail-section-13)
  - [Q04 · 哪些成本和退出条件决定是否值得试用？](#detail-section-14)
  - [Q05 · 怎样把词条覆盖改成可验证的任务覆盖？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：俄语用户在核心与社区插件间操作时，通过同一语言理解设置、按钮和报错；合格结果包括关键审批语义明确且代码与输入不被误改。

相对只要求模型说俄语，本组件覆盖界面与操作；相对整页浏览器翻译，增加命名空间、安装版本和个人override，但不保证语义正确，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生俄语词典 | 翻译宿主和已适配插件界面 | 键覆盖不证明语义或任务覆盖 |
| DOM补译与排版输入辅助 | 补充非原生词条和俄语输入 | 依赖DOM，退出不保证逐节点恢复 |
| 本地化检查与个人override | 查看来源并修订措辞 | 需人工核对关键语义 |
| 会话翻译与Markdown导出入口 | 辅助处理对话 | 翻译默认关闭，外发与部分译文需复核 |
| 可选容器setup及更新 | 管理本地翻译器与插件版本 | 会启动容器或安装包，须独立选择 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web及locale、slots、configForms | 界面本地化必需 | 注册字典与设置 | 缺少时不能据包安装成功认为显示正常 |
| Node >=22及包声明的宿主依赖 | Host必需 | 字典路由、配置与CLI | 版本声明未等同实际兼容 |
| LLM、Google或LibreTranslate | 机器翻译才需 | 处理会话正文 | 默认关闭；外发、费用与准确性需另核 |
| Docker与本机5000端口 | 一键本地翻译setup才需 | 创建或启动独立容器 | 不可用则setup失败，禁用插件不自动清容器 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主、Web profile与包 | 保留原语言和关键术语对照 |
| 加载 | Host供词典、客户端注册ru | 关键设置正确，不依据100%标签放行 |
| 使用 | 用户先只开静态词典 | 观察审批含义、输入和代码未误改 |
| 恢复 | 切回en刷新，按需禁用或卸载 | 核对原生文本恢复，曾开容器则另行管理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 安装与字典资源，金额未知 | 核对版本与关键术语，耗时未知 | 不需默认启用外部机器翻译 |
| 持续 | DOM观察与缓存占用未知；可选模型/服务费用未知 | 升级后复核词条、布局和动态路径 | 没有节时对照 |
| 失败恢复 | 刷新排障与可选容器占用未知 | 切回语言、禁用override、核对安装版本 | 不以200响应保证全文已译 |
| 退出 | 可选容器不随插件禁用自动移除 | 卸载与独立清理容器，工时未知 | 无长期总成本测量 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 俄语操作 | 原生字典与DOM补译有真实接线 | 语义、实际页面覆盖和用户错误率 |
| 输入辅助 | 界面注册和排版/布局模块存在 | 对真实代码输入的干扰和节时 |
| 机器翻译 | 多引擎可选且默认关闭 | 服务质量、费用、混回原文的比例 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03)最影响可靠性的边界是原生locale、DOM直接替换与机器翻译混在同一语言体验中。停止观察不逐节点恢复全部补译，Google分块失败可混回原文，用户不能把页面俄语或200响应当全部正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持将原生俄语词典、插件版本状态与输入辅助组合成宿主语言体验。贡献是多层本地化适配，底层locale、缓存和DOM观察均为既有技术；字典数量不等于全生态任务验证。

原生locale注册保留disposer、字典分层、版本状态与个人override有可复用价值；补译观察器退出与原文恢复是两件事。可选翻译和更新路由会产生外部调用或安装副作用，不能以本地化名称忽略，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03)最影响可靠性的边界是原生locale、DOM直接替换与机器翻译混在同一语言体验中。停止观察不逐节点恢复全部补译，Google分块失败可混回原文，用户不能把页面俄语或200响应当全部正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

先只使用静态界面词典，保留英语术语对照，核对审批和错误含义。暂不启用机器翻译、Docker设置或一键更新，除非已了解正文去向及本机安装副作用。发现含义模糊或代码输入被改时，切回英语刷新并关闭相关辅助，必要时卸载；曾开翻译容器要单独处理。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持多层俄语适配与控制入口，不证明宣传覆盖率、俄语质量和所有宿主版本可用。任务路径验收是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、lib/locales.js、lib/core/status.js、lib/translator.js、lib/plugin-updater.js、lib/pure.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交源码抽读原生locale、词典供给、DOM补译与恢复、翻译网关、容器和更新关键路径；未逐条审阅俄语词典语义。
- 下一步：仅源码与作者说明；未运行插件、测试、安装、机器翻译、Docker或更新。宣传覆盖与兼容未独立实测，未获取任务收益记录。

**分析版本**

- **仓库**：[GooDAnDReaDY/dsh-russian-lang](https://github.com/GooDAnDReaDY/dsh-russian-lang)
- **版本号**：0.4.22（[固定提交 4b2c773](https://github.com/GooDAnDReaDY/dsh-russian-lang/tree/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证方向，把key覆盖扩展为固定设置、审批、恢复路径的来源与语义验收。对照同安装组合的额外严重错误发现和维护时间，若不优于键报告或维护过重则放弃；这不是已有贡献。

仅源码与作者说明；未运行插件、测试、安装、机器翻译、Docker或更新。宣传覆盖与兼容未独立实测，未获取任务收益记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 520 | 462 | 12 | — |
| .md | source | 5 | 1101 | — | — | 10672 |
| .js | source | 22 | 5228 | 4666 | 287 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/GooDAnDReaDY/dsh-russian-lang/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断词典、DOM补译与可选机器翻译能否给俄语用户提供可控语言体验。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 俄语本地化解决什么问题，覆盖率是否代表可用性？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

俄语用户在DSH核心与多个社区插件之间工作时，单靠模型用俄语回答并不能翻译设置、按钮和错误；浏览器整页翻译又缺少宿主命名空间和版本意识。本组件把静态词典注册为原生locale，再补充未走原生词条的DOM文本与输入辅助，增量是界面和操作层的语言适配，不是训练更强俄语模型。合格结果应包括关键设置、审批语义、错误提示可理解，同时代码与用户内容不被误改。

作者声称大量词条与人工校对，但固定版本的README、中文说明和package描述列出的词条/插件数并不一致，因此不能选一个宣传数当实测覆盖。status方法比较字典键，并以支持清单与已装版本标记full、partial、unverified或headless；无界面插件可以显示100%，不等于存在可翻译界面或全部路径已验收。字典存在只证明可提供对应文本，不证明俄语语义、占位符、复数、动态生成路径与实际页面布局都正确。

适合俄语为主要工作语言且愿意核对关键术语的人；熟悉原文且使用未适配插件的人可能得不到足够增益。没有独立用户任务对照，不能把消除语言摩擦的合理机制推断写成已测节时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-53](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/README.md#L49-L53)

作者的本地化、人工校对和输入辅助主张。

```text
## ⚡ Обзор

**`dsh-russian-lang`** — официальный, всеобъемлющий пакет русской локализации для веб-интерфейса [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh).

Пакет не просто переводит интерфейс ядра и всех популярных плагинов экосистемы, но и добавляет интеллектуальные функции для комфортной русскоязычной работы: **100% ручная вычитка терминов**, **грамматические формы множественного числа (plural)**, автоматическую **расстановку экранной типографики** («ёлочки», длинные тире, неразрывные пробелы) и **исправление ошибочно набранного текста** на неверной раскладке по горячей клавише <kbd>Alt+L</kbd>.
```

**依据 2 · 源码核查**：[lib/core/status.js:151-175](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/core/status.js#L151-L175)

headless分支直接给100%，其含义不同于界面质量。

<details>
<summary>查看原文（25行）</summary>

```text
export const makePluginLocalizationStatus = (dicts, enCatalog, inventory) => (ns, pkgName, installedVersion) => {
  const supp = inventory && (inventory.supported_plugins || inventory)
  const verifiedVersion = (supp && (supp[pkgName] || (ns && (supp[ns] || supp['@goodandready/' + ns] || supp['@goodandready-private/' + ns])))) || null

  if (pkgName && (HEADLESS_PLUGINS.has(pkgName) || (inventory && Array.isArray(inventory.headless_plugins) && inventory.headless_plugins.includes(pkgName)))) {
    return {
      status: 'headless',
      count: 0,
      total: 0,
      percent: 100,
      missingKeys: [],
      verifiedVersion,
      installedVersion: installedVersion || null,
      label: 'Серверный плагин (без UI)'
    }
  }

  const none = { status: 'none', count: 0, total: 0, percent: 0, missingKeys: [], verifiedVersion, installedVersion: installedVersion || null, label: 'RU отсутствует' }
  if (!ns) return none
  const ruMap = (dicts && dicts[ns]) || {}
  const rawCount = Object.keys(ruMap).length

  const ret = (st, c, tot, pct, mk, lbl) => ({
    status: st, count: c, total: tot, percent: pct, missingKeys: mk, verifiedVersion, installedVersion: installedVersion || null, label: lbl
  })
```

</details>

**依据 3 · 源码核查**：[lib/locales.js:287-323](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/locales.js#L287-L323)

支持插件清单、实际安装版本与状态的关联。

<details>
<summary>查看原文（37行）</summary>

```text
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

    pluginsList.push({
      packageName: pkgName,
      namespace: ns,
      installedVersion: installedVer,
      verifiedVersion: cleanVer,
      status: stat.status,
      count: stat.count,
      total: stat.total,
      percent: stat.percent,
      label: stat.label,
      missingKeys: stat.missingKeys
    })
```

</details>

#### 缺口

- 尚无俄语使用者的关键任务覆盖与语义审查记录。
  **影响**：不能将字典键数或宣传100%当作任务可用性。
  **进一步探讨**：由俄语用户在固定宿主和插件组合执行设置、审批、报错任务，记录误解与缺词。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 原生词典、DOM补译与语言切换如何挂载和退出？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

客户端通过ctx.locale.register将命名空间字典加入ru语言，并保存各注册的disposer用于卸载；核心字典请求成功后注册并延迟预加载插件词典，失败才走all字典退路。语言设置默认启用，配置ready后激活ru，快捷开关调用runtime.setLocale。真实设置页、快捷开关、助手翻译与Markdown导出均由slots注册，不是只有导出函数的静态候选。

原生locale之外，DOM遍历对文本和title、placeholder、aria-label做补译。代码排除code、pre、输入控件、数学和正在流式输出的区域，且通常避开聊天正文；自定义override优先于部分正文保护，因此不宜把它当绝不会触碰用户内容的保证。退出ru时停止补译观察器和事件，已被直接改写的DOM文本在所查退出分支没有原文逐节点恢复，通常要等宿主重绘或刷新；这一范围与原生locale自动重绘不同，可能出现临时混合语言，属于源码可见恢复边界，未实际复现。

拼写属性另有保存与恢复逻辑，说明插件并非所有DOM修改都不可逆。采用时应区分这些机制，不把一个可恢复路径外推为全体替换都能恢复。最影响使用的是重要审批或错误词语可能被补译替换而用户难以立即返回原文；原生key、DOM映射和个人override应分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:549-570](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/client.js#L549-L570)

真实原生locale注册及卸载函数。

<details>
<summary>查看原文（22行）</summary>

```text
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
ctx.effect(() => {if (disposed) return () => {}
try { return ctx.locale.register(SETTINGS_NS_NAME, 'en', CARD_EN) } catch (err) {console.warn('[dsh-russian-lang] Failed to register en card fallback:', err)
return () => {}}},'dsh-russian-lang: russian-lang-en')
const registerDictMap = (dictMap) => {if (disposed || !dictMap || typeof dictMap !== 'object') return
for (const ns of Object.keys(dictMap)){if (disposed) return
if (ns === 'zhRu' || ns === 'plugins' || ns === 'core') continue
const dict = dictMap[ns]
if (typeof dict !== 'object' || !dict) continue
registerOrUpdateNamespace(ns,dict)}}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:625-656](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/client.js#L625-L656)

核心、插件和all字典请求的接线与退路。

<details>
<summary>查看原文（32行）</summary>

```text
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
if (typeof console !== 'undefined' && console.warn){console.warn('[dsh-russian-lang] Dict fetch error',coreErr,allErr)}})})
```

</details>

**依据 3 · 源码核查**：[lib/client.js:820-841](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/client.js#L820-L841)

保护区域与override优先次序。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/client.js:842-879](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/client.js#L842-L879)

直接改写文本和属性；退出分支停止观察但未逐节点恢复原文。

<details>
<summary>查看原文（38行）</summary>

```text
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

**依据 5 · 源码核查**：[lib/client.js:745-776](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/client.js#L745-L776)

拼写属性明确保存恢复，与文本替换边界不同。

<details>
<summary>查看原文（32行）</summary>

```text
const spellOn = (el) => {if (el.hasAttribute(SPELL_ON) || isMonoField(el)) return
el.setAttribute(SPELL_ON,'1')
el.setAttribute(SPELL_WAS,el.getAttribute('spellcheck') ?? '')
el.setAttribute(LANG_WAS,el.getAttribute('lang') ?? '')
el.setAttribute('spellcheck','true')
el.setAttribute('lang','ru-RU')}
const spellOff = (el) => {if (!el.hasAttribute(SPELL_ON)) return
const was = el.getAttribute(SPELL_WAS)
if (was === '') el.removeAttribute('spellcheck')
else el.setAttribute('spellcheck',was)
const lang = el.getAttribute(LANG_WAS)
if (lang === '') el.removeAttribute('lang')
else el.setAttribute('lang',lang)
el.removeAttribute(SPELL_ON)
el.removeAttribute(SPELL_WAS)
el.removeAttribute(LANG_WAS)}
let unsubSpellObserver = null
const syncSpell = () => {try {if (typeof document === 'undefined') return
const ru = runtime.getLocale().active === 'ru'
if (!ru){if (unsubSpellObserver){ unsubSpellObserver();unsubSpellObserver = null }
document.querySelectorAll('[' + SPELL_ON + ']').forEach(spellOff)
return}
document.querySelectorAll(EDITABLE).forEach(spellOn)
if (unsubSpellObserver) return
unsubSpellObserver = domMultiplexer.subscribe('spell',(nodes) => {for (let i = 0;i < nodes.length;i++){const node = nodes[i]
if (node.nodeType !== 1) continue
if (node.matches && node.matches(EDITABLE)) spellOn(node)
if (node.querySelectorAll) node.querySelectorAll(EDITABLE).forEach(spellOn)}},{ skipStreaming:true })} catch (err){ void err;}}
const unsubscribeSpell = runtime.subscribe(syncSpell)
ctx.effect(() => {return () => {unsubscribeSpell()
if (unsubSpellObserver){ unsubSpellObserver();unsubSpellObserver = null }
try { document.querySelectorAll('[' + SPELL_ON + ']').forEach(spellOff) } catch (err){ void err;}}},'dsh-russian-lang: spellcheck')
```

</details>

**依据 6 · 源码核查**：[lib/client.js:1325-1333](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/client.js#L1325-L1333)

设置、快捷语言切换、翻译和导出按钮真实挂载。

```text
if (!ctx.slots || !React) return
const toggleRu = (wantRu) => {try {if (runtime.getLocale().active === wantRu) return
runtime.setLocale(wantRu ? 'ru' :'en')} catch (err){ console.warn('dsh-russian-lang: toggle failed',err) }}
const registerPluginsItem = () => {return ctx.slots.inject('plugins.item',() => ctx.slots.register({name:'plugins.item',id:FORM_NS,order:60,label:() => 'Russian language',locale:SETTINGS_NS_NAME,inject:() => ({ scope,runtime,toggleRu }),},SettingsCard),)}
if (typeof configForms?.whileServed === 'function'){ctx.effect(() => configForms.whileServed([FORM_NS],registerPluginsItem),'dsh-russian-lang: plugins.item')}else{registerPluginsItem()}
ctx.slots.inject('plugins.row.config',() => ctx.slots.register({name:'plugins.row.config',key:ROW_CONFIG_KEY,locale:SETTINGS_NS_NAME,inject:() => ({ scope,runtime,toggleRu }),},SettingsCard),)
try {ctx.slots.inject('conversation.session.header.utilities',() => ctx.slots.register({name:'conversation.session.header.utilities',id:'dsh-russian-lang-quick-switch',order:100,locale:SETTINGS_NS_NAME,inject:() => ({ scope,runtime,toggleRu }),},QuickLangSwitch),)} catch (err){ void err;}
try {ctx.slots.inject('conversation.chat.assistant-actions',() => ctx.slots.register({name:'conversation.chat.assistant-actions',id:'dsh-russian-lang-translate-action',order:50,locale:SETTINGS_NS_NAME,inject:() => ({ runtime }),},TranslateTurnAction),)} catch (err){ void err;}
try {ctx.slots.inject('conversation.session.header.utilities',() => ctx.slots.register({name:'conversation.session.header.utilities',id:'dsh-russian-lang-md-export',order:101,locale:SETTINGS_NS_NAME,inject:() => ({ runtime }),},ExportMarkdownButton),)} catch (err){ void err;}
```

#### 缺口

- 未在固定宿主中观察混合语言和override对正文的实际影响。
  **影响**：不能将静态恢复边界升级为已复现严重故障，也不能承诺无误改。
  **进一步探讨**：在包含代码、审批、动态插件和自定义override的页面切换ru/en，逐字段比较重绘前后及刷新结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 机器翻译和一键更新会执行什么额外动作？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

静态UI词典不需要机器翻译服务。机器翻译路由默认engine=off，启用后按llm、local或google选择不同外部依赖；llm调用宿主模型，local向所配LibreTranslate地址POST正文，google将分块正文放进translate.googleapis.com请求。Google路径某块失败或超过请求上限会把原片段塞回结果，因此HTTP成功和translatedText存在并不保证全部已译。需要人工检查混合原文与译文，敏感对话不应在不了解目标服务时点击翻译。

设置页的本地翻译setup不是单纯设置开关，它会调用docker启动已有libretranslate容器或创建固定镜像v1.5.3，映射127.0.0.1:5000并设unless-stopped。禁用本插件不等于停止或删除这个容器。更新入口也会在用户POST后调用DSH CLI将精确最新包版本加到当前profile，并要求重启；这改变本机安装状态，不只是检查版本。

请求入口检查允许的本机/局域网Host、Origin和跨站标记，翻译还要求自定义头。它们能缩小浏览器跨站请求范围，不能自动证明强身份认证或任意部署下安全。可信代理、共享宿主和局域网访问仍依赖宿主整体配置，本次未做安全利用验证。首次应只启用词典，机器翻译、容器和更新都作为独立选择。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:237-248](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/index.js#L237-L248)

Host实际挂载更新和翻译服务。

<details>
<summary>查看原文（12行）</summary>

```text
  // Web endpoints: One-click plugin updater, modular lazy-plugin dictionary serving, & translator gateway
  if (typeof ctx.inject === 'function') {
    ctx.inject(['webServer'], (wctx) => {
      try {
        const mount = () => {
          const unregUpdater = registerPluginUpdater(wctx, {
            endpoint: '/api/dsh-russian-lang/update',
            packageName: '@goodandready/dsh-russian-lang',
            manifestUrl: new URL('../package.json', import.meta.url),
          })

          const unregTranslator = registerTranslator(wctx, readSettings, () => ctx.get('llm') || ctx.llm)
```

</details>

**依据 2 · 源码核查**：[lib/translator.js:626-703](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/translator.js#L626-L703)

POST、可信请求检查、默认off和三个引擎实际分派。

<details>
<summary>查看原文（78行）</summary>

```text
          if (request.method !== 'POST') {
            response.writeHead(405, { 'content-type': 'application/json' })
            response.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }
          if (!isTrustedTranslatorRequest(request)) {
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
            return
          }

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

**依据 3 · 源码核查**：[lib/translator.js:481-511](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/translator.js#L481-L511)

Google分块失败或上限回传原文，可能部分译文。

<details>
<summary>查看原文（31行）</summary>

```text
          currentBatch += s
        }
      }
      if (currentBatch) batches.push(currentBatch)

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
```

</details>

**依据 4 · 源码核查**：[lib/translator.js:419-447](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/translator.js#L419-L447)

Docker启动或创建、固定端口和重启策略，实际有本机副作用。

<details>
<summary>查看原文（29行）</summary>

```text
export async function setupLibreTranslateContainer() {
  // Check if container exists
  try {
    const nameOut = await execPromise('docker', [
      'ps', '-a', '--filter', 'name=^libretranslate$', '--format', '{{.Names}}'
    ], 3000)
    if (nameOut && nameOut.trim() === 'libretranslate') {
      // Start stopped container
      await execPromise('docker', ['start', 'libretranslate'], 10000)
      return { ok: true, action: 'started', message: 'Контейнер libretranslate запущен.' }
    }
  } catch (err) {
    throw new Error('Docker недоступен или нет прав на выполнение: ' + err.message)
  }

  // Run new container
  try {
    await execPromise('docker', [
      'run', '-d',
      '--name', 'libretranslate',
      '--restart', 'unless-stopped',
      '-p', '127.0.0.1:5000:5000',
      'libretranslate/libretranslate:v1.5.3',
      '--load-only', 'en,ru,zh'
    ], 30000)
    return { ok: true, action: 'created', message: 'Контейнер libretranslate создан и запускается (~600 МБ RAM).' }
  } catch (err) {
    throw new Error('Ошибка запуска контейнера libretranslate: ' + err.message)
  }
```

</details>

**依据 5 · 源码核查**：[lib/plugin-updater.js:277-301](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/plugin-updater.js#L277-L301)

启动DSH CLI执行plugin add，而非只有查询。

<details>
<summary>查看原文（25行）</summary>

```text
async function installExact(target, packageSpec, options) {
  if (target.cliEntry === undefined) {
    throw new Error('Automatic update is unavailable in this runtime.')
  }
  await new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      [
        target.cliEntry,
        'plugin',
        '--profile',
        target.profileName,
        'add',
        packageSpec,
        `--registry=${options.registry ?? 'https://registry.npmjs.org/'}`,
      ],
      {
        cwd: target.profileDir,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          NO_COLOR: '1',
          ELECTRON_RUN_AS_NODE: '1',
        },
```

</details>

**依据 6 · 源码核查**：[lib/plugin-updater.js:372-398](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/plugin-updater.js#L372-L398)

更新请求限制、互斥、精确版本和重启要求。

<details>
<summary>查看原文（27行）</summary>

```text
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
        } finally {
          installing = false
```

</details>

**依据 7 · 源码核查**：[lib/translator.js:140-180](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/translator.js#L140-L180)

Host与Origin检查的边界。

<details>
<summary>查看原文（41行）</summary>

```text
export function isTrustedLocalRequest(request) {
  const host = header(request, 'host')
  if (typeof host !== 'string' || host === '') return false
  let hostUrl
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }

  // 1. Host hostname MUST be allowed loopback or LAN host (DNS Rebinding protection: #536)
  if (!isAllowedLocalOrLanHost(hostUrl.hostname)) {
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

```

</details>

#### 缺口

- 未验证外部引擎质量、真实费用及代理部署下路由隔离。
  **影响**：不宜无条件开启对话外发、Docker或远程更新。
  **进一步探讨**：先确认数据可离开宿主及目标服务身份，另行审核实际部署权限；本轮不运行这些操作。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些成本和退出条件决定是否值得试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

对每天使用同一组已适配DSH界面的俄语用户，原生词典能减少逐项查原文的操作，具备小范围试用理由；这个建议仅限静态界面翻译，不涵盖机器翻译、容器设置或自动更新。首次需核对Node与宿主版本、安装Web profile、验证关键按钮与审批语义，并保留英语原文对照；持续需要跟随宿主与插件升级复核字典、命名空间及布局。没有实测耗时、内存或费用，不能把静态词典称为零总成本。

失败时先切回en并刷新，以清除DOM补译可能留下的显示状态；禁用额外输入修改、个人override与agentPrompt，必要时卸载并返回原生语言。如果曾经启动LibreTranslate容器，用户还需独立处理容器；外部模型调用费用也不会随UI语言关闭而撤销。更新失败应查宿主日志和当前实际安装版本，不反复点击推断成功。

试用成功应是关键任务含义清楚、代码和输入未被误改、语言切换后恢复可接受。出现关键审批含义歧义、混合语言妨碍判断或必须依靠不透明外发才能使用时停止。源码支持控制入口和有限退出路径，不支持长期安装推荐或宣称全生态已验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:44-59](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/package.json#L44-L59)

Web和peer声明构成启动条件，版本声明不是实际兼容。

<details>
<summary>查看原文（16行）</summary>

```text
    "DESIGN.md",
    "NOTICE",
    "LICENSE",
    "supported-inventory.json"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-slots"
      ]
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1325-1333](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/client.js#L1325-L1333)

语言切换与设置入口提供用户退路。

```text
if (!ctx.slots || !React) return
const toggleRu = (wantRu) => {try {if (runtime.getLocale().active === wantRu) return
runtime.setLocale(wantRu ? 'ru' :'en')} catch (err){ console.warn('dsh-russian-lang: toggle failed',err) }}
const registerPluginsItem = () => {return ctx.slots.inject('plugins.item',() => ctx.slots.register({name:'plugins.item',id:FORM_NS,order:60,label:() => 'Russian language',locale:SETTINGS_NS_NAME,inject:() => ({ scope,runtime,toggleRu }),},SettingsCard),)}
if (typeof configForms?.whileServed === 'function'){ctx.effect(() => configForms.whileServed([FORM_NS],registerPluginsItem),'dsh-russian-lang: plugins.item')}else{registerPluginsItem()}
ctx.slots.inject('plugins.row.config',() => ctx.slots.register({name:'plugins.row.config',key:ROW_CONFIG_KEY,locale:SETTINGS_NS_NAME,inject:() => ({ scope,runtime,toggleRu }),},SettingsCard),)
try {ctx.slots.inject('conversation.session.header.utilities',() => ctx.slots.register({name:'conversation.session.header.utilities',id:'dsh-russian-lang-quick-switch',order:100,locale:SETTINGS_NS_NAME,inject:() => ({ scope,runtime,toggleRu }),},QuickLangSwitch),)} catch (err){ void err;}
try {ctx.slots.inject('conversation.chat.assistant-actions',() => ctx.slots.register({name:'conversation.chat.assistant-actions',id:'dsh-russian-lang-translate-action',order:50,locale:SETTINGS_NS_NAME,inject:() => ({ runtime }),},TranslateTurnAction),)} catch (err){ void err;}
try {ctx.slots.inject('conversation.session.header.utilities',() => ctx.slots.register({name:'conversation.session.header.utilities',id:'dsh-russian-lang-md-export',order:101,locale:SETTINGS_NS_NAME,inject:() => ({ runtime }),},ExportMarkdownButton),)} catch (err){ void err;}
```

**依据 3 · 源码核查**：[lib/client.js:862-879](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/client.js#L862-L879)

退出DOM观察的范围要求切回后核对和刷新。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/translator.js:419-447](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/translator.js#L419-L447)

可选容器是独立长期资源。

<details>
<summary>查看原文（29行）</summary>

```text
export async function setupLibreTranslateContainer() {
  // Check if container exists
  try {
    const nameOut = await execPromise('docker', [
      'ps', '-a', '--filter', 'name=^libretranslate$', '--format', '{{.Names}}'
    ], 3000)
    if (nameOut && nameOut.trim() === 'libretranslate') {
      // Start stopped container
      await execPromise('docker', ['start', 'libretranslate'], 10000)
      return { ok: true, action: 'started', message: 'Контейнер libretranslate запущен.' }
    }
  } catch (err) {
    throw new Error('Docker недоступен или нет прав на выполнение: ' + err.message)
  }

  // Run new container
  try {
    await execPromise('docker', [
      'run', '-d',
      '--name', 'libretranslate',
      '--restart', 'unless-stopped',
      '-p', '127.0.0.1:5000:5000',
      'libretranslate/libretranslate:v1.5.3',
      '--load-only', 'en,ru,zh'
    ], 30000)
    return { ok: true, action: 'created', message: 'Контейнер libretranslate создан и запускается (~600 МБ RAM).' }
  } catch (err) {
    throw new Error('Ошибка запуска контейнера libretranslate: ' + err.message)
  }
```

</details>

**依据 5 · 源码核查**：[lib/plugin-updater.js:391-404](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/plugin-updater.js#L391-L404)

更新成功需重启，失败只给错误并查日志。

<details>
<summary>查看原文（14行）</summary>

```text
          await installExact(target, `${options.packageName}@${before.latestVersion}`, options)
          json(response, 200, {
            ...before,
            updatedVersion: before.latestVersion,
            restartRequired: true,
          })
        } finally {
          installing = false
        }
      } catch (error) {
        if (ctx.logger && typeof ctx.logger.warn === 'function') {
          ctx.logger.warn(`plugin updater failed: ${String(error)}`)
        }
        json(response, 503, { error: 'Plugin update failed; see server logs.' })
```

</details>

#### 缺口

- 没有同条件俄语任务的误解率、维护工时与完整成本数据。
  **影响**：无法确认长期收益抵消升级与复核负担。
  **进一步探讨**：用一组固定日常任务对照原生英语界面，记录错误理解、查词、恢复和升级复核时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样把词条覆盖改成可验证的任务覆盖？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可借鉴的设计是原生命名空间优先、核心与插件字典分层供给、缓存及个人override，以及对未适配版本明确标unverified。它们把本地化对象与版本联系起来，比整页盲译更便于归因；但DOM补译与动态机器翻译增加了原生词典以外的变化来源，键覆盖不能涵盖实际任务语义。

未验证假设是为设置、审批、失败恢复各建立一组固定界面路径，记录每处文本的原生key、DOM来源或override以及实际安装版本，并由俄语用户核对关键含义，可能比单一100%标签更早发现会改变操作的错误。相对现有status，它增加的是任务路径与语义验收，不是扩大字典数量；维护截图、安装组合和人工复核会增加成本。

最小实验在同一宿主与插件组合上比较键覆盖报告与任务路径报告发现的严重语义错误，统计额外维护时间。若路径报告找不到任何额外重要问题，或每次更新的维护时间超过减少的排障时间，就收窄或放弃该机制。没有执行实验，不把它列为插件已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core/status.js:151-175](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/core/status.js#L151-L175)

现有覆盖模型按键与版本定义，headless特殊分支。

<details>
<summary>查看原文（25行）</summary>

```text
export const makePluginLocalizationStatus = (dicts, enCatalog, inventory) => (ns, pkgName, installedVersion) => {
  const supp = inventory && (inventory.supported_plugins || inventory)
  const verifiedVersion = (supp && (supp[pkgName] || (ns && (supp[ns] || supp['@goodandready/' + ns] || supp['@goodandready-private/' + ns])))) || null

  if (pkgName && (HEADLESS_PLUGINS.has(pkgName) || (inventory && Array.isArray(inventory.headless_plugins) && inventory.headless_plugins.includes(pkgName)))) {
    return {
      status: 'headless',
      count: 0,
      total: 0,
      percent: 100,
      missingKeys: [],
      verifiedVersion,
      installedVersion: installedVersion || null,
      label: 'Серверный плагин (без UI)'
    }
  }

  const none = { status: 'none', count: 0, total: 0, percent: 0, missingKeys: [], verifiedVersion, installedVersion: installedVersion || null, label: 'RU отсутствует' }
  if (!ns) return none
  const ruMap = (dicts && dicts[ns]) || {}
  const rawCount = Object.keys(ruMap).length

  const ret = (st, c, tot, pct, mk, lbl) => ({
    status: st, count: c, total: tot, percent: pct, missingKeys: mk, verifiedVersion, installedVersion: installedVersion || null, label: lbl
  })
```

</details>

**依据 2 · 源码核查**：[lib/locales.js:287-323](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/locales.js#L287-L323)

已装版本与支持清单为任务版本绑定提供基础。

<details>
<summary>查看原文（37行）</summary>

```text
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

    pluginsList.push({
      packageName: pkgName,
      namespace: ns,
      installedVersion: installedVer,
      verifiedVersion: cleanVer,
      status: stat.status,
      count: stat.count,
      total: stat.total,
      percent: stat.percent,
      label: stat.label,
      missingKeys: stat.missingKeys
    })
```

</details>

**依据 3 · 源码核查**：[lib/client.js:820-841](https://github.com/GooDAnDReaDY/dsh-russian-lang/blob/4b2c773f2b75b6e7007bb4710ca6c97afb0b4383/lib/client.js#L820-L841)

DOM保护及override额外路径说明仅有key不足。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

#### 缺口

- 任务路径验收能发现多少额外重要错误尚未知。
  **影响**：不能认定这是已验证的本地化质量方案。
  **进一步探讨**：对照相同安装组合，测额外发现与维护时间，若收益不抵成本则否定。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
