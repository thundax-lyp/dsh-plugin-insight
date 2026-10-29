# dsh-claude-style

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9ed81a8](https://github.com/Nwflower/dsh-claude-style/tree/9ed81a8350c59c4cd34695c9cf3681998e2797ef)

<!-- BEGIN META -->
[![GitHub ★ 369](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=369&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nwflower/dsh-claude-style) [![npm 30d 28,349](https://img.shields.io/static/v1?label=npm+30d&message=28%2C349&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-style) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-style)
<!-- END META -->

> **功能**：重做 DSH Web 的 Claude/DeepSeek 风格与交互，含会话搜索、权限切换及规则改写。

> **亮点**：把主题与复杂交互组织在统一feature生命周期中，支持动态退让、故障清理及指定CSS规则可报告恢复。实际收益取决于用户偏好与宿主契约。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：外观选择同时带来权限快捷命令及归档目录永久删除；UI退出不能撤销这些写入。命令侧授权、制品对应与恢复缺实证，不足整体日常采用。见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 谁用这款皮肤完成什么任务，增量是什么？](#detail-section-11)
  - [Q02 · 页面接管、退让和Sodium究竟怎样工作？](#detail-section-12)
  - [Q03 · 哪些操作真实写权限或删除历史，边界是什么？](#detail-section-13)
  - [Q04 · 源码怎样变成可用插件，实际使用如何验收？](#detail-section-14)
  - [Q05 · 完整成本与效果有什么证据？](#detail-section-15)
  - [Q06 · 当前怎样采用，未来什么假设值得验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：对DSH默认UI不满意且偏好Claude/DeepSeek外观的人是明确对象，但主题也重组真实操作，验收单位应是界面任务正确完成。见[Q01](#research-q01)。

参照默认DSH或仅替换CSS的主题。这里增量是偏好、资源和交互统一接线，也增加页面契约及高影响写入责任；未证实任务或性能优势。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：Claude/DeepSeek风格与feature生命周期接管。
- **后台**：Sodium适配表改写CSS并尝试恢复，未测性能收益。
- **Host 路由**：本地会话搜索与归档目录删除，需分别核验结果。
- **用户命令**：客户端权限控件调用宿主 /permission 命令，需核实际权限变化。

**流程与依赖**

构建/发布、宿主服务、peer、字体与搜索缓存集中在[Q04](#research-q04)。源码仓无lib，不能混同推荐的npm或dist安装物。

先核制品与备份，再一次性profile分项验收，界面退回与业务状态回滚分别核对。执行者、成功标准与失败动作见[Q04](#research-q04)。

**效果与成本**

成本关键在兼容维护与状态写入核对，主题并无已测token或渲染节省。分阶段成本与效果边界见[Q05](#research-q05)。

对明确偏好者可能改善日常阅读与找会话；比纯CSS更广的操作责任使体验验收必须包含误操作与恢复。取舍及可证伪方向见[Q06](#research-q06)。

> **思考**：外观选择同时带来权限快捷命令及归档目录永久删除；UI退出不能撤销这些写入。命令侧授权、制品对应与恢复缺实证，不足整体日常采用。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把主题与复杂交互组织在统一feature生命周期中，支持动态退让、故障清理及指定CSS规则可报告恢复。实际收益取决于用户偏好与宿主契约。见[Q01](#research-q01)、[Q02](#research-q02)。

提前注册清理、倒序隔离失败与selector恢复提供工程思路；宿主命令、会话存储与CSS适配表仍受外部契约约束。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

外观选择同时带来权限快捷命令及归档目录永久删除；UI退出不能撤销这些写入。命令侧授权、制品对应与恢复缺实证，不足整体日常采用。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，以一次性profile试验作为后续证据，不整体替换重要历史环境；逐项核权限和删除，回默认UI不等于撤销业务写入。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持生命周期、规则改写、权限命令和目录删除路径。发布制品、宿主行为、性能与恢复未运行验证，解耦设计为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/client/src/entry.ts、packages/client/src/features/permissions/permissions.ts、packages/client/src/features/sodium/sodium-engine.ts、packages/client/src/features/sodium/sodium.ts、packages/client/src/features/workspace/workspace-view.ts、packages/engine/node/http.ts、packages/host/src/index.ts、packages/host/src/routes.ts、packages/host/src/search.ts、scripts/build.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向审host/client入口、build映射、Sodium、权限、归档删除、路由门禁和搜索缓存；未全审其他feature、远程价格/账号/品牌接口、所有资产及宿主实现。
- 下一步：未构建、安装或运行目标；后续核可追溯制品、一次性权限/删除/恢复、长会话性能、主题退让和缓存清理，按[Q04](#research-q04)至[Q06](#research-q06)验收。

**分析版本**

- **仓库**：[Nwflower/dsh-claude-style](https://github.com/Nwflower/dsh-claude-style)
- **版本号**：0.19.5（[固定提交 9ed81a8](https://github.com/Nwflower/dsh-claude-style/tree/9ed81a8350c59c4cd34695c9cf3681998e2797ef)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将外观与高影响写入分项授权，验证能否降低误权限/误删且不显著降低任务完成；现有源码不证明这一分离收益。见[Q06](#research-q06)。

未构建、安装或运行目标；后续核可追溯制品、一次性权限/删除/恢复、长会话性能、主题退让和缓存清理，按[Q04](#research-q04)至[Q06](#research-q06)验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 34 | 5648 | — | — | 128074 |
| .mjs | source | 104 | 21617 | 14929 | 5843 | — |
| .ts | source | 321 | 53062 | 31714 | 18115 | — |
| .js | source | 55 | 7365 | 5642 | 1656 | — |
| .mjs | test | 39 | 3550 | 2580 | 738 | — |
| .mjs | example | 6 | 361 | 217 | 121 | — |
| .ts | example | 7 | 233 | 136 | 77 | — |
| .ts | test | 58 | 5977 | 4494 | 897 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/Nwflower/dsh-claude-style/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：主题的外观与交互收益是否足以覆盖页面接管、权限和历史写入的维护风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用这款皮肤完成什么任务，增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-claude-style面向已经使用DSH Web界面、希望用Claude Desktop或DeepSeek风格组织日常聊天的人。原办法是宿主默认界面，或只替换配色/背景的皮肤；这里除令牌化外观、字体和宠物，还重组权限、会话、搜索等交互。合格结果是读者能在偏好外观下继续准确选权限、找会话和阅读聊天，并可退出；外观相似不代表接入Claude服务，也不改变模型本身能力。

原生插件由host注册服务、client接管页面，包描述也是visual & interaction overhaul。host提供本地会话搜索与使用量等能力，client通过生成的feature注册表统一生命周期。可确认它超出CSS主题：权限切换会走宿主命令，归档删除会调用插件后端删除存储目录。这些差异可能减少点击，也扩大维护和误操作代价；不能只以截图评估。

主题偏好与宠物带来的陪伴属于待验证体验收益，不推为任务完成率。只想换配色、已经满意原生权限和会话入口的用户，用简单主题或默认UI更容易控制变更范围。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-7](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/package.json#L2-L7)

包声明visual & interaction overhaul及host主入口。

```text
  "name": "dsh-claude-style",
  "description": "Claude Code Desktop theme for DeepSeek Harness (dsh) web GUI — visual & interaction overhaul",
  "version": "0.19.5",
  "type": "module",
  "main": "lib/host/index.js",
  "icon": "lib/claude-mark.svg",
```

**依据 2 · 源码核查**：[packages/host/src/index.ts:53-67](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/host/src/index.ts#L53-L67)

host注册路由、设置与widget usage。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx: DshContext) {
  // Always register through inject, never on the bare ctx. `ctx.get()` reads a
  // service leniently (no inject declaration needed), but the PROPERTY access
  // inside registerRoutes (`scope.webServer`) is gated by the fiber's inject
  // declaration, and a host half re-applies while the web server is already
  // running (a generation relink after a client-bundle rebuild). inject()
  // waits for the service and hands registerRoutes a scope that HAS the
  // declaration, so both a boot-time apply and a hot relink register. A host
  // without a web server simply waits here, and the skin still activates.
  if (typeof ctx.inject === 'function') ctx.inject(['webServer'], (scope: DshScope) => { registerRoutes(ctx, scope) })
  else registerRoutes(ctx, ctx as DshScope)

  registerSettings(ctx)
  registerWidgetUsage(ctx)
}
```

</details>

**依据 3 · 源码核查**：[packages/client/src/entry.ts:390-431](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/entry.ts#L390-L431)

偏好加载、生成feature注册表和页面所有权分支。

<details>
<summary>查看原文（42行）</summary>

```text
  }

  setHostContext(ctx)
  // Bind the official settings form before anything reads a preference:
  // the host serves namespaces through `ctx.configForms`. Bound once here,
  // and retried when the settings page installs.
  adoptSettingsForm(ctx)
  // The service can mount after this plugin: wait for it declaratively and
  // bind then, so the first settings change never meets an unbound store.
  if (typeof ctx.inject === 'function') ctx.inject(['configForms'], () => { adoptSettingsForm(ctx) })
  loadModelCopy()
  loadUsername()
  loadHdsl()
  // Preferences are read asynchronously from the host settings namespace;
  // applying the defaults first keeps every gated rule in a defined state
  // for the frames before that read settles, and is exactly the shipped
  // behaviour when it never does. This runs while yielded too, so the page
  // comes back wearing the reader's own values (D74).
  adoptPrefs(prefs)

  setFeatureRegistry(FEATURES)
  const live = FEATURES.filter(isLive)
  const handleNames = FEATURES.map(handleName)
  // Keep the presence watch alive for the page's lifetime: another plugin
  // arriving or leaving re-runs the preference stream, which brings the
  // features that yield to it in or out (packages/client/src/shared/peer-plugin.ts). The
  // subscription itself carries no logic.
  offPeerWatch = subscribePeerPresence(() => {})
  // An owner can arrive or leave whichever way the page booted; the
  // verdict is read again on every change rather than remembered (D74).
  offOwnerWatch = subscribePageOwner(next => {
    if (next === owner) return
    owner = next
    if (next === null) own()
    else yieldTo(next)
  })

  // Another owner already has this page (D74): adoptPrefs mirrors nothing
  // onto it, and the release leaves the owner's KEPT_FOR features alone.
  if (owner !== null) yieldTo(owner)
  else own()
}
```

</details>

#### 缺口

- 缺使用者任务对照、偏好保留与误操作数据。
  **影响**：无法确认复杂界面替换比默认UI更适合目标用户。
  **进一步探讨**：同一用户完成查会话、选权限和阅读任务，记录偏好、错误、时间与撤回。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 页面接管、退让和Sodium究竟怎样工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

client按feature清单安装功能，通过偏好及其他插件存在性开关动态安装/清理；另一个页面所有者出现时保留指定功能并release其余，接回时挂自己的样式、part标记和scheduler。teardown先注册到ctx.effect，release倒序清理，即使某个stop抛错也继续清理后续，随后去偏好属性、样式、缩放层与part标记；scheduler不能装时回滚整皮肤。源码支持有退出设计，不等于每个feature都在真实宿主无残留。

Sodium当前不是虚拟列表或模型计算加速。它读取已知插件/宿主release，在适配表覆盖的版本中找CSS规则，用属性维护替代原选择器的部分工作，并记录改写供恢复。初始undecided时会survey，发现匹配规则便保存ON；这意味着部分环境下它会自动从未决定变为开启，不是用户必须先手动打开。

stop会restoreRewrite并移除keepers；若其他写者已改变规则，恢复器会留下相关selector并报告stranded。代码明确承认这一冲突边界。表驱动选择器改写及可报告恢复是可借鉴的局部机制，但更低style recalculation或更顺滑仍需同会话浏览器测量，不能据“渲染引擎”名称推出性能收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/client/src/entry.ts:106-175](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/entry.ts#L106-L175)

倒序release和提前注册teardown。

<details>
<summary>查看原文（70行）</summary>

```text
  function release(keep: string[] = []) {
    // First, so no preference flip installs a feature mid-release.
    if (offSwitches !== null) {
      offSwitches()
      offSwitches = null
    }
    const kept = []
    for (let i = installed.length - 1; i >= 0; i--) {
      if (keep.includes(installed[i].id)) {
        kept.push(installed[i])
        continue
      }
      // One teardown must not block the rest (D12); a failing one is reported.
      try { installed[i].stop() } catch (error) { reportError(error) }
    }
    installed = kept.reverse()
    // Each body attribute goes with whoever writes it: a feature's own with
    // its teardown above, the preference mirror's here, the stamps last.
    clearPrefsAttributes()
    body.removeAttribute('data-dsh-claude-style')
    body.removeAttribute(HANDOFF_ATTR)
    // The visibility mark is the sheet's to read, so it goes before the sheet does.
    if (stopVisibility !== null) {
      stopVisibility()
      stopVisibility = null
    }
    // This generation's own sheet, handed over rather than taken away when a
    // newer generation has mounted after it (mountStylesheet). The carried layer
    // goes with it: it is this sheet's own zoom those cards are carried under.
    if (stopScale !== null) {
      stopScale()
      stopScale = null
    }
    if (stopStylesheet !== null) {
      stopStylesheet()
      stopStylesheet = null
    }
    // Last: the part marks name host elements for the sheet, and the features
    // above may have stamped a menu card the pass had marked (D3).
    if (stopParts !== null) {
      stopParts()
      stopParts = null
    }
  }

  /**
   * Undo everything this generation installed. Idempotent: the host runs it
   * on dispose (the effect below), and own() runs it itself when the
   * scheduler cannot be installed.
   */
  function teardown() {
    if (disposed) return
    disposed = true
    if (offOwnerWatch !== null) {
      offOwnerWatch()
      offOwnerWatch = null
    }
    release()
    if (offPeerWatch !== null) {
      offPeerWatch()
      offPeerWatch = null
    }
    setHostContext(null)
    disposePrefsBinding()
  }

  // Registered before anything is installed: registered last, a feature that
  // threw half-way through left the stylesheet and every listener installed
  // so far on the page with no teardown the host could ever run.
  ctx.effect(() => teardown, 'dsh-claude-style: Claude Code desktop theme')
```

</details>

**依据 2 · 源码核查**：[packages/client/src/entry.ts:343-389](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/entry.ts#L343-L389)

页面接管安装样式与scheduler失败回滚。

<details>
<summary>查看原文（47行）</summary>

```text
  function own() {
    // The value is the build id (scripts/build.mjs): the stylesheet keys on
    // the attribute alone, and a live page reads which lib/client.js it runs.
    body.setAttribute('data-dsh-claude-style', BUILD_ID)
    // The handoff marker rides the live stamp: its presence is what lets the
    // skin center offer this theme as a selectable look (D74).
    body.setAttribute(HANDOFF_ATTR, BUILD_ID)
    adoptPrefs(prefs)
    // The sheet carries this package's own tags and is unmounted by
    // release(); the features install onto a page that already wears it.
    if (stopStylesheet === null) stopStylesheet = mountStylesheet()
    // The page's visibility, mirrored for the sheet just mounted and for the
    // clocks in script that stop with it (core/page-visibility.ts).
    if (stopVisibility === null) stopVisibility = installPageVisibility()
    // Before the features: every rule they and the theme's own sheets write
    // reads the part names this pass puts on the host's elements (D3). A batch
    // that moved a mark asks for one more pass, so a feature that measures what
    // the marks style reads the settled numbers; the scheduler is installed
    // below, so `schedule` is looked up when the batch runs.
    if (stopParts === null) {
      stopParts = installParts({
    part: PART_ATTR,
    holds: HOLDS_ATTR,
    regions: { account: ACCOUNT_MENU_ATTR, hero: HERO_MENU_ATTR, more: MORE_MENU_ATTR },
  }, () => {
        if (typeof ui.schedule === 'function') ui.schedule()
      })
    }
    // With the sheet: the page is drawn at the reader's own scale from here on,
    // and the host's floating cards are carried under it (engine/src/scaled-layer.ts).
    if (stopScale === null) stopScale = installPageScale()
    for (const feature of FEATURES) {
      if (failed.has(feature.id) || installed.some(entry => entry.id === feature.id)) continue
      if (isLive(feature)) applySwitch(feature)
      else installFeature(feature)
    }
    if (offSwitches === null) {
      offSwitches = subscribePrefs(() => {
        for (const feature of live) applySwitch(feature)
        if (typeof ui.schedule === 'function') ui.schedule()
      })
    }
    // Last: its passes read the `ui` handles lazily. Without it nothing syncs,
    // and a live stylesheet over overrides that never run is worse than no
    // skin at all — so if it cannot install, the whole skin rolls back.
    if (installed.some(entry => entry.id === 'scheduler')) return
    if (!install('scheduler', null, () => installScheduler(ctx, ui, handleNames))) teardown()
```

</details>

**依据 3 · 源码核查**：[packages/client/src/features/sodium/sodium.ts:25-54](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/features/sodium/sodium.ts#L25-L54)

探测并保存开关、订阅与stop。

<details>
<summary>查看原文（30行）</summary>

```text

  function probe() {
    if (probing || !prefsFromForm() || readPrefs().sodium !== SODIUM_UNDECIDED) return
    probing = true
    engine.survey().then((count) => {
      if (disposed || count === 0 || readPrefs().sodium !== SODIUM_UNDECIDED) return null
      return savePrefs({ sodium: SODIUM_ON })
    }).finally(() => { probing = false })
  }

  function follow() {
    if (readPrefs().sodium === SODIUM_ON) engine.start()
    else engine.stop()
    probe()
  }

  const stopPrefs = subscribePrefs(follow)
  const stopHead = subscribeMutations(document.head, { childList: true, subtree: true }, () => {
    engine.refresh()
    probe()
  })
  follow()

  return () => {
    disposed = true
    stopPrefs()
    stopHead()
    engine.stop()
  }
}
```

</details>

**依据 4 · 源码核查**：[packages/client/src/features/sodium/sodium-engine.ts:55-69](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/features/sodium/sodium-engine.ts#L55-L69)

按成员版本覆盖过滤。

<details>
<summary>查看原文（15行）</summary>

```text
export function createSodiumEngine(ctx: HostContext) {
  const releases = readReleases(ctx)
  let on = false
  let held: HeldSheet[] = []
  /** The sheets the table held on the last report, and whether their loss has been reported since. */
  let lastSheets: readonly string[] = []
  let reportedLoss = false
  /** Each adapter's attribute keeper, with the captured classes it keeps them for. */
  const keepers = new Map<SodiumAdapter, { key: string, stop: () => void }>()

  /** The members whose release the table covers. */
  const coveredMembers = () => releases.then((known) => SODIUM_MEMBERS.filter((member) => {
    const release = known.get(member)
    return release !== null && release !== undefined && versionAtLeast(release, member.since)
  }))
```

</details>

**依据 5 · 源码核查**：[packages/client/src/features/sodium/sodium-engine.ts:136-182](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/features/sodium/sodium-engine.ts#L136-L182)

规则改写、恢复和冲突报告实际路径。

<details>
<summary>查看原文（47行）</summary>

```text
  function sync(members: readonly SodiumMember[]) {
    if (!on) return
    held = held.filter(({ sheet }) => sheet.ownerNode instanceof HTMLStyleElement && sheet.ownerNode.isConnected && sheet.ownerNode.sheet === sheet)
    const fresh: HeldSheet[] = []
    for (const member of members) {
      for (const adapter of member.adapters) {
        for (const sheet of sheetsOf(adapter)) {
          if (held.some((entry) => entry.sheet === sheet && entry.adapter === adapter)) continue
          const rules = planRewrite(sheet, adapter, takenIn(sheet, [...held, ...fresh]))
          if (rules.length > 0) fresh.push({ sheet, member, adapter, rules })
        }
      }
    }
    keep([...held, ...fresh])
    // Each sheet is held as it is written: a sheet the browser refuses takes its
    // own rules back, and the sheets taken before it stay restorable.
    for (const entry of fresh) held.push({ ...entry, rules: applyRewrite(entry.rules) })
    publish()
  }

  return {
    start() {
      if (on) return
      on = true
      coveredMembers().then(sync).catch(reportWrite)
    },
    /** Follow the sheets in `<head>` while on. */
    refresh() {
      if (on) coveredMembers().then(sync).catch(reportWrite)
    },
    stop() {
      if (!on) return
      on = false
      // A rule another writer changed since keeps its rewritten selector, and the
      // marks come off below: from here on it matches nothing, so it is named.
      const stranded = held.flatMap(({ adapter, rules }) => restoreRewrite(rules).map((entry) => `${adapter.sheet} · ${entry.rewritten}`))
      held = []
      keep([])
      publish()
      if (stranded.length > 0) reportError(new Error(`sodium: ${stranded.join('; ')} no longer read as the rewrite left them and stay written`))
    },
    /** How many rules the rewrite would take on the page as it stands. */
    survey() {
      return coveredMembers().then((members) => members.reduce((count, member) => count + member.adapters.reduce(
        (sum, adapter) => sum + sheetsOf(adapter).reduce((rules, sheet) => rules + planRewrite(sheet, adapter).length, 0),
        0,
      ), 0))
```

</details>

#### 缺口

- 尚未验证覆盖表与当前宿主DOM/CSS匹配、退让后的无残留与性能差异。
  **影响**：可运行路径不证明主题共存或性能改进。
  **进一步探讨**：固定DSH版本与长会话，采集样式计算、帧时、开关前后规则和卸载残留。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些操作真实写权限或删除历史，边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

权限控件点击preset后调用session.command(`/permission ${preset}`)，同值不写。它检查异步返回ok和matched，失败在后续sync报告并退让。源码注释明确这条路径略过宿主原菜单的风险确认框；真实宿主是否另有命令侧确认仍取决于宿主实现，本轮未核对，不能宣称已复现权限绕过。但把高权限选项直接呈为快捷切换是实质交互差异，不应仅作为主题装饰接受。

归档行的垃圾桶点击直接进入removeArchived，以same-origin POST发送sessionId，没有在已核前端链加入二次确认。后端限定ID、转存储目录名，检查session是否live，扫描会话根下候选，再用realpath确认仍在根内，临删除前再查live，然后rmSync递归删目录，随后unarchive注册表。成功刷新会话列表；拒绝保留行并提示。它是永久目录删除路径，未见回收站；卸载主题不恢复已删历史。

双live检查减少正在写会话被删的窗口，但第二次检查与rmSync之间没有共同锁。目录删除和注册表unarchive也非一个事务，后者失败可返回500而目录已消失，重试miss分支可清注册记录。这些是源码可见失败边界，不是本轮复现的数据丢失。路由用宿主requestRejection鉴权；缺服务时退化为loopback peer/Host/Origin等检查，不能当多用户身份授权的等价证明。

因此正式历史应先备份，权限快捷切换与删除必须单独验收；关闭主题只能撤销界面接管，不能撤销已发命令或删除。

#### 证据与依据

**依据 1 · 源码核查**：[packages/client/src/features/permissions/permissions.ts:73-109](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/features/permissions/permissions.ts#L73-L109)

真实命令、结果判定与同值不写；注释说明略过原确认。

<details>
<summary>查看原文（37行）</summary>

```text
  /**
   * Request the preset switch through the host's `/permission` command —
   * the same write the shipped picker's confirmation dialog ends in, minus
   * the dialog. The command validates the preset against the host's own
   * catalog, writes the sandbox mode and the approval policy, and appends
   * the preset event, so the next sync re-renders the control from the
   * projection alone.
   */
  function submitPreset(preset: string) {
    const session = currentSession(ctx)
    if (session === null) return
    const settled = session.command(`/permission ${preset}`)
    if (settled === undefined || settled === null) return
    settled.then((result) => {
      if (result === null || typeof result !== 'object' || result.ok !== true) {
        submitError = new Error(`permission: the /permission ${preset} command was refused`)
      } else if (result.value === null || typeof result.value !== 'object' || result.value.matched !== true) {
        submitError = new Error('permission: the host offers no /permission command')
      } else {
        submitError = null
      }
      ui.schedule!()
    }, () => {
      submitError = new Error(`permission: the /permission ${preset} command failed`)
      ui.schedule!()
    })
  }

  /**
   * Request the switch for every row, gated presets included. A same-value
   * pick writes nothing.
   */
  function pick(preset: string | null) {
    const session = currentSession(ctx)
    if (session === null || preset === null) return
    if (preset === currentPreset(session)) return
    submitPreset(preset)
```

</details>

**依据 2 · 源码核查**：[packages/client/src/features/workspace/workspace-view.ts:257-276](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/features/workspace/workspace-view.ts#L257-L276)

直接POST与错误提示，无此链二次确认。

<details>
<summary>查看原文（20行）</summary>

```text
  function removeArchived(id: string) {
    fetch(SESSION_DELETE_ROUTE, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId: id }),
    }).then(response => response.json().then((result: HostAnswer) => ({ status: response.status, result }))).then(({ status, result }) => {
      if (result?.ok === true || (status === 404 && result?.error === 'session not found')) {
        refreshSessions()
        return
      }
      const refusal: Error & { status?: number } = new Error(String(result?.error || `HTTP ${status}`))
      refusal.status = status
      throw refusal
    }).catch((reason: { status?: number, message?: string }) => {
      console.warn('dsh-claude-style: session delete rejected:', reason)
      notifyToast(reason?.status === 409
        ? copy('archiveDeleteOpen')
        : copy('archiveDeleteFailed', { detail: reason?.message ?? String(reason) }))
    })
```

</details>

**依据 3 · 源码核查**：[packages/client/src/features/workspace/workspace-view.ts:304-323](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/features/workspace/workspace-view.ts#L304-L323)

垃圾桶按钮直接removeArchived。

<details>
<summary>查看原文（20行）</summary>

```text
  function DeleteArchivedSession({ sessionId }: { sessionId: string }) {
    const archived = React.useSyncExternalStore(subscribeView, archivedView)
    if (!archived) return null
    const label = copy('archiveDelete')
    return React.createElement(primitives.Tooltip, {
      label,
      side: 'bottom',
      align: 'end',
      delayMs: 500,
      portal: true,
      children: React.createElement('button', {
        type: 'button',
        className: 'dsh-claude-ws-delete',
        'aria-label': label,
        title: label,
        onClick: (event: React.MouseEvent) => {
          event.stopPropagation()
          removeArchived(sessionId)
        },
      }, React.createElement(primitives.IconTrashOutlineRegular, { size: 14 })),
```

</details>

**依据 4 · 源码核查**：[packages/host/src/routes.ts:173-220](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/host/src/routes.ts#L173-L220)

ID、live、realpath、递归删除和unarchive。

<details>
<summary>查看原文（48行）</summary>

```text
  const sessionId = request !== null && typeof request.sessionId === 'string' ? request.sessionId : ''
  if (!SESSION_ID_RE.test(sessionId)) {
    sendJson(res, 400, { ok: false, error: 'invalid session id' })
    return
  }
  // The id is looked up under the name the storage holds it under, never under
  // its own spelling: `:` and `@` in a plugin-generated id are escaped there.
  const storedName = sessionDirectoryName(sessionId)
  if (sessionIsLive(ctx, sessionId)) {
    sendJson(res, 409, { ok: false, error: 'session is open' })
    return
  }
  const root = resolve(harnessPath(ctx, 'sessions'))
  let dir = null
  // The root listing is the storage's own answer, so a failure there is a
  // fault and propagates to the route's 500 answer; a candidate that does not
  // exist is "not under this entry", and the scan moves past it.
  for (const entry of readdirSync(root)) {
    const candidate = join(root, entry, storedName)
    if (statSync(candidate, { throwIfNoEntry: false })?.isDirectory() === true) {
      dir = candidate
      break
    }
  }
  if (dir === null) {
    await unarchiveSession(ctx, sessionId)
    sendJson(res, 200, { ok: true, ghost: true })
    return
  }
  // The comparison has to be between resolved paths: an entry inside the root
  // that is itself a symlink carries a recursive removal out of it, and
  // `resolve` only normalizes the spelling (D75).
  const realRoot = realpathSync(root)
  if (!realpathSync(dir).startsWith(realRoot + sep)) {
    sendJson(res, 403, { ok: false, error: 'session directory outside the sessions root' })
    return
  }
  // A session opened while the scan above ran is live by now, and the first
  // check could not see it: asking again leaves only the gap between this check
  // and the removal.
  if (sessionIsLive(ctx, sessionId)) {
    sendJson(res, 409, { ok: false, error: 'session is open' })
    return
  }
  // A storage fault propagates to the route's 500 answer, carrying the OS error.
  rmSync(dir, { recursive: true, force: true })
  await unarchiveSession(ctx, sessionId)
  sendJson(res, 200, { ok: true, ghost: false })
```

</details>

**依据 5 · 源码核查**：[packages/engine/node/http.ts:29-45](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/engine/node/http.ts#L29-L45)

优先宿主鉴权，否则loopback门禁。

<details>
<summary>查看原文（17行）</summary>

```text
export function refusalOf(ctx: DshContext, req: DshRequest) {
  const connection = ctx.get('connection')
  if (typeof connection?.requestRejection === 'function') return connection.requestRejection(req)
  if (!isLoopbackPeer(req.socket.remoteAddress)) return 403
  const host = req.headers.host
  if (host !== undefined) {
    // A Host header that is no host name at all is refused.
    if (!URL.canParse(`http://${host}`)) return 403
    const name = new URL(`http://${host}`).hostname
    if (name !== 'localhost' && name !== '[::1]' && !/^127\.\d+\.\d+\.\d+$/.test(name)) return 403
  }
  const site = req.headers['sec-fetch-site']
  if (site !== undefined && site !== 'same-origin' && site !== 'none') return 403
  const origin = req.headers.origin
  if (origin === undefined) return undefined
  if (!URL.canParse(origin)) return 403
  return new URL(origin).host === host ? undefined : 403
```

</details>

#### 缺口

- 宿主/permission命令完整授权、多个进程竞态与删除故障恢复未验证。
  **影响**：不能把界面更快当权限选择更安全，也不能保证历史可恢复。
  **进一步探讨**：用一次性会话与备份验证高权限选择、live拒绝、目录已删但注册失败和未确认命令结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 源码怎样变成可用插件，实际使用如何验收？

**研究主题**：依赖、兼容与流程

#### 完整回答

固定0.19.5包声明host主入口lib/host/index.js、Web client以及DSH>=0.1.7。本checkout没有lib；build脚本从packages/client/src/entry.ts打浏览器包，调用buildHostHalf并组装lib。package在prepublishOnly触发build，README推荐npm包或GitHub #dist，所以源码仓、发布分支、npm制品是不同交付物。本轮没有构建或取发布包，不能证明任一发布物与固定提交字节一致，也不能说普通Git checkout直接能加载。

| 依赖 | 作用与门槛 | 失败边界 |
|---|---|---|
| DSH Web与client primitives/React | plugin、页面、slots、命令及投影 | 版本声明不是所有宿主DOM契约兼容证明 |
| 构建与发布产物 | TS/虚拟feature表生成lib | 固定源码无lib，需可核对构建或同版本制品 |
| host webServer、设置、会话与connection | 字体、搜索、统计、删除和授权 | 服务缺失可退默认外观或拒绝，不等于全部功能成功 |
| 本地字体与资源 | 字体fallback、动画资产 | README明确Anthropic字体不随公开发行，另有独立资产边界 |
| 本地搜索缓存 | 提取会话文字并落磁盘JSON | 增加会话内容副本，不因只读路由而无存储副作用 |

| 步骤/执行者 | 合格结果 | 失败动作 |
|---|---|---|
| 维护者核制品与备份 | 版本、lib、数据备份可追溯 | 不用当前源码可读替代安装验收 |
| 用户在一次性profile启用 | 默认交谈、开关、主题退让仍正常 | 停用，回默认UI核残留 |
| 用户试查已知会话 | 命中正确内容，缓存位置可查 | 停搜索并核缓存，不向主题统计推送敏感原文 |
| 用户核权限及一次性删除 | 实际权限与意图一致、删除目标正确 | 停相关入口，保留故障前后状态 |
| 维护者重载/停用 | 样式与功能退回，业务状态可解释 | 已删历史由备份恢复，不能靠重装主题 |

许可证也不能用package的MIT一词覆盖全部：README把Sodium列为PolyForm Shield、Clawd帧图另行说明。这里只记录材料范围，不作再分发许可推断。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:31-65](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/package.json#L31-L65)

发布构建hook、client、DSH版本与files表。

<details>
<summary>查看原文（35行）</summary>

```text
    "prepublishOnly": "npm run build"
  },
  "exports": {
    ".": "./lib/host/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./locale/*": "./locale/*"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.1.7"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
  "files": [
    "lib",
    "!lib/**/*.map",
    "!lib/assets/*.map.br",
    "locale",
    "skin.json",
    "cordis.patch.yml",
    "docs/STYLE.md",
    "docs/CHANGELOG.md",
    "README.md",
    "README.en.md",
    "LICENSE",
    "docs/NOTICE.md",
    "packages/client/src/features/sodium/LICENSE",
    "docs/THIRD_PARTY_NOTICES.md"
```

</details>

**依据 2 · 源码核查**：[package.json:90-95](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/package.json#L90-L95)

运行peer声明。

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.5-rc.1",
    "@deepseek-ai/schemastery": ">=3.18.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
```

**依据 3 · 源码核查**：[scripts/build.mjs:474-478](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/scripts/build.mjs#L474-L478)

真实客户端构建入口。

```text
  const clientOptions = (chunkUrls, shared) => ({
    entryPoints: [path.join(SRC, 'entry.ts')],
    bundle: true,
    format: 'cjs',
    platform: 'browser',
```

**依据 4 · 源码核查**：[scripts/build.mjs:550-553](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/scripts/build.mjs#L550-L553)

源码无lib为作者明确设计。

```text
  // Everything is validated before anything is written: a refusal anywhere in
  // this build must not leave lib/ holding one half of a new build beside the
  // other half of the previous one. lib/ is not in version control (D47), so a
  // fresh clone has no directory to write into yet.
```

**依据 5 · 源码核查**：[scripts/build.mjs:597-597](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/scripts/build.mjs#L597-L597)

host构建接入。

```text
  const host = await buildHostHalf({ outDir: LIB })
```

**依据 6 · 源码核查**：[packages/host/src/search.ts:230-245](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/host/src/search.ts#L230-L245)

搜索语料缓存写入本地JSON。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Hold one session's corpus in memory and, at the write interval, on disk. */
  function adopt(sessionId: string, entry: CachedSession, force: boolean) {
    // A corpus rebuilt after the routes left belongs to no page: it must not
    // write the cache file of a plugin that is no longer installed.
    if (disposed) return
    cache.set(sessionId, entry)
    lower.set(sessionId, entry.messages.map(message => message.text.toLowerCase()))
    const now = Date.now()
    if (!force && now - (writtenAt.get(sessionId) ?? 0) < CACHE_WRITE_INTERVAL_MS) return
    writtenAt.set(sessionId, now)
    writeJsonDocument(ctx, cacheFile(sessionId), 'session search cache', {
      version: CACHE_VERSION,
      revision: entry.revision,
      lastSeq: entry.lastSeq,
      messages: entry.messages,
    })
```

</details>

**依据 7 · 作者声明**：[README.md:71-88](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/README.md#L71-L88)

作者安装与字体说明。

<details>
<summary>查看原文（18行）</summary>

````text

```
dsh-claude-style
```

```bash
dsh plugin --profile web add dsh-claude-style                    # npm 包（推荐）
dsh plugin --profile web add Nwflower/dsh-claude-style#dist      # GitHub 发布分支
```

也可从[插件市场](https://github.com/dsh-market/dsh-market)或 dsh-web-all 的皮肤中心安装。同一时刻只启用一个主题，装好后重启 DeepSeek Harness。

## 字体

> Anthropic 没有公开发行这三款字体；本仓库只提供下载与研究的[副本](https://github.com/Nwflower/dsh-claude-style/tree/master/packages/assets/src/fonts/anthropic)。


启用时二选一：装进系统，或把 `.ttf` 复制到 `$DSH_HOME/dsh-claude-style/fonts/`。
````

</details>

**依据 8 · 作者声明**：[README.md:101-111](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/README.md#L101-L111)

Sodium及角色图的独立许可范围说明。

<details>
<summary>查看原文（11行）</summary>

```text
除特别说明，本仓库以 MIT 授权。

钠（Sodium）渲染引擎以 [PolyForm Shield 1.0.0](packages/client/src/features/sodium/LICENSE) 授权。

## 鸣谢

- 「钠 / Sodium」取名自 Minecraft 的 [Sodium](https://github.com/CaffeineMC/sodium) 渲染优化模组，本插件与它没有关联。
- 消息导航参考 SherUnlocked-4869 的 [dsh-plugin-msg-nav](https://github.com/SherUnlocked-4869/dsh-plugin-msg-nav)（MIT）。
- Deepy 的动画帧图来自 calmly-eating-bugs（[@wp3171216237](https://github.com/wp3171216237)）绘制的 Deepy 小鲸鱼主题包。
- 聊天区的增强动效改自 [dsh-chat-ux](https://github.com/alm-allen/dsh-chat-ux)（MIT）。
- Clawd是 Anthropic 的角色形象。帧图不适用 MIT 许可（见 [LICENSE](LICENSE)）。本插件是非官方爱好者作品，与 Anthropic 没有关联。
```

</details>

#### 缺口

- 同版本npm/dist制品、宿主契约与磁盘缓存清理未验收。
  **影响**：不能据源码安装声明给生产可用保证。
  **进一步探讨**：独立核固定构建的制品映射、宿主版本、缓存内容与停用后清理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 完整成本与效果有什么证据？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 资源与人工 | 目前边界 |
|---|---|---|
| 启用 | 制品核验、备份、主题冲突与字体配置 | 比仅换CSS多host/client依赖 |
| 日常 | DOM监听、scheduler、动画、CSS改写、会话索引与本地缓存 | 没有实测CPU/内存/磁盘上界或节省比例 |
| 核对 | 权限真实状态、搜索正确性、删除对象、主题退让 | 减点击可能增加误操作核对 |
| 维护 | 宿主DOM契约、功能表、选择器适配、字体和混合许可 | 声明最低版本不保证后续升级免调整 |
| 退出 | 清理视觉层、缓存核对与数据恢复 | UI清理不能撤回权限写入或永久删除 |

#### 效果

| 效果 | 当前支持 | 仍未知 |
|---|---|---|
| 风格与功能组织 | 原生插件统一feature生命周期、偏好和资源 | 偏好、留存、任务完成率 |
| 搜索与会话操作 | 本地消息索引、真实删除和刷新 | 查找质量及误删/误切权限率 |
| Sodium | 指定规则改写及恢复路径 | 同页style计算、帧时是否降低 |

这些主链没有新增LLM调用作为主题工作前提；这只说明本轮审阅范围的成本形态，不能扩为整个仓库绝无网络或模型调用。也不把视觉阅读流畅推成token节省。合格单位应是一组日常界面任务正确完成且可退出，不是截图相似度或功能数量。

#### 证据与依据

**依据 1 · 源码核查**：[packages/client/src/entry.ts:343-389](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/entry.ts#L343-L389)

日常接管与scheduler。

<details>
<summary>查看原文（47行）</summary>

```text
  function own() {
    // The value is the build id (scripts/build.mjs): the stylesheet keys on
    // the attribute alone, and a live page reads which lib/client.js it runs.
    body.setAttribute('data-dsh-claude-style', BUILD_ID)
    // The handoff marker rides the live stamp: its presence is what lets the
    // skin center offer this theme as a selectable look (D74).
    body.setAttribute(HANDOFF_ATTR, BUILD_ID)
    adoptPrefs(prefs)
    // The sheet carries this package's own tags and is unmounted by
    // release(); the features install onto a page that already wears it.
    if (stopStylesheet === null) stopStylesheet = mountStylesheet()
    // The page's visibility, mirrored for the sheet just mounted and for the
    // clocks in script that stop with it (core/page-visibility.ts).
    if (stopVisibility === null) stopVisibility = installPageVisibility()
    // Before the features: every rule they and the theme's own sheets write
    // reads the part names this pass puts on the host's elements (D3). A batch
    // that moved a mark asks for one more pass, so a feature that measures what
    // the marks style reads the settled numbers; the scheduler is installed
    // below, so `schedule` is looked up when the batch runs.
    if (stopParts === null) {
      stopParts = installParts({
    part: PART_ATTR,
    holds: HOLDS_ATTR,
    regions: { account: ACCOUNT_MENU_ATTR, hero: HERO_MENU_ATTR, more: MORE_MENU_ATTR },
  }, () => {
        if (typeof ui.schedule === 'function') ui.schedule()
      })
    }
    // With the sheet: the page is drawn at the reader's own scale from here on,
    // and the host's floating cards are carried under it (engine/src/scaled-layer.ts).
    if (stopScale === null) stopScale = installPageScale()
    for (const feature of FEATURES) {
      if (failed.has(feature.id) || installed.some(entry => entry.id === feature.id)) continue
      if (isLive(feature)) applySwitch(feature)
      else installFeature(feature)
    }
    if (offSwitches === null) {
      offSwitches = subscribePrefs(() => {
        for (const feature of live) applySwitch(feature)
        if (typeof ui.schedule === 'function') ui.schedule()
      })
    }
    // Last: its passes read the `ui` handles lazily. Without it nothing syncs,
    // and a live stylesheet over overrides that never run is worse than no
    // skin at all — so if it cannot install, the whole skin rolls back.
    if (installed.some(entry => entry.id === 'scheduler')) return
    if (!install('scheduler', null, () => installScheduler(ctx, ui, handleNames))) teardown()
```

</details>

**依据 2 · 源码核查**：[packages/client/src/features/sodium/sodium-engine.ts:136-175](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/features/sodium/sodium-engine.ts#L136-L175)

改写维护与退出冲突。

<details>
<summary>查看原文（40行）</summary>

```text
  function sync(members: readonly SodiumMember[]) {
    if (!on) return
    held = held.filter(({ sheet }) => sheet.ownerNode instanceof HTMLStyleElement && sheet.ownerNode.isConnected && sheet.ownerNode.sheet === sheet)
    const fresh: HeldSheet[] = []
    for (const member of members) {
      for (const adapter of member.adapters) {
        for (const sheet of sheetsOf(adapter)) {
          if (held.some((entry) => entry.sheet === sheet && entry.adapter === adapter)) continue
          const rules = planRewrite(sheet, adapter, takenIn(sheet, [...held, ...fresh]))
          if (rules.length > 0) fresh.push({ sheet, member, adapter, rules })
        }
      }
    }
    keep([...held, ...fresh])
    // Each sheet is held as it is written: a sheet the browser refuses takes its
    // own rules back, and the sheets taken before it stay restorable.
    for (const entry of fresh) held.push({ ...entry, rules: applyRewrite(entry.rules) })
    publish()
  }

  return {
    start() {
      if (on) return
      on = true
      coveredMembers().then(sync).catch(reportWrite)
    },
    /** Follow the sheets in `<head>` while on. */
    refresh() {
      if (on) coveredMembers().then(sync).catch(reportWrite)
    },
    stop() {
      if (!on) return
      on = false
      // A rule another writer changed since keeps its rewritten selector, and the
      // marks come off below: from here on it matches nothing, so it is named.
      const stranded = held.flatMap(({ adapter, rules }) => restoreRewrite(rules).map((entry) => `${adapter.sheet} · ${entry.rewritten}`))
      held = []
      keep([])
      publish()
      if (stranded.length > 0) reportError(new Error(`sodium: ${stranded.join('; ')} no longer read as the rewrite left them and stay written`))
```

</details>

**依据 3 · 源码核查**：[packages/host/src/search.ts:230-245](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/host/src/search.ts#L230-L245)

索引副本落盘成本。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Hold one session's corpus in memory and, at the write interval, on disk. */
  function adopt(sessionId: string, entry: CachedSession, force: boolean) {
    // A corpus rebuilt after the routes left belongs to no page: it must not
    // write the cache file of a plugin that is no longer installed.
    if (disposed) return
    cache.set(sessionId, entry)
    lower.set(sessionId, entry.messages.map(message => message.text.toLowerCase()))
    const now = Date.now()
    if (!force && now - (writtenAt.get(sessionId) ?? 0) < CACHE_WRITE_INTERVAL_MS) return
    writtenAt.set(sessionId, now)
    writeJsonDocument(ctx, cacheFile(sessionId), 'session search cache', {
      version: CACHE_VERSION,
      revision: entry.revision,
      lastSeq: entry.lastSeq,
      messages: entry.messages,
    })
```

</details>

**依据 4 · 源码核查**：[packages/host/src/routes.ts:217-220](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/host/src/routes.ts#L217-L220)

删除与注册状态真实副作用。

```text
  // A storage fault propagates to the route's 500 answer, carrying the OS error.
  rmSync(dir, { recursive: true, force: true })
  await unarchiveSession(ctx, sessionId)
  sendJson(res, 200, { ok: true, ghost: false })
```

#### 缺口

- 没有统一界面任务对照、性能测量和恢复工时。
  **影响**：无法证明体验收益覆盖接管维护成本。
  **进一步探讨**：默认UI/主题各跑同一任务，记录错误、操作时间、帧时、缓存大小和退出修正。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前怎样采用，未来什么假设值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前宜观察。它值得需要这种风格的用户在一次性profile做探索，但还不足以推荐整体替换保存重要历史的日常界面。特别是权限快捷切换略过原UI确认、归档删除直接递归移除目录，承担了超过视觉偏好的状态变更责任；本轮缺真实宿主行为和恢复验收，不能用源码工程完整度填补。

最小试验应先核构建制品和宿主版本，用复制/一次性会话验证所有入口，单独记录权限意图与实际preset、一次性删除及失败恢复，再测样式/动画负担。不接受快捷权限交互或无法恢复备份时回默认UI；卸载前记录当前权限和已删除项，避免把视觉回滚当数据回滚。

未来可验证“外观接管与高影响写入解耦”假设：保留主题、搜索和Sodium，把权限写入与永久删除默认交还宿主或要求明确分项开启及可审阅结果。相对整体接管，可减少用户因选外观而同时接受状态写入的隐性负担，代价是多开关、额外点击和双入口维护。

用固定界面任务对比当前整体方案与分项方案，记录误权限选择、意外删除、完成率、偏好、点击数及恢复时间；如果错误不降且任务明显变慢，假设不成立或仅适用于新用户。Sodium性能对照另测，不能用交互安全改善冒充渲染收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/client/src/features/permissions/permissions.ts:81-109](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/features/permissions/permissions.ts#L81-L109)

现有真实写入入口构成解耦参照。

<details>
<summary>查看原文（29行）</summary>

```text
  function submitPreset(preset: string) {
    const session = currentSession(ctx)
    if (session === null) return
    const settled = session.command(`/permission ${preset}`)
    if (settled === undefined || settled === null) return
    settled.then((result) => {
      if (result === null || typeof result !== 'object' || result.ok !== true) {
        submitError = new Error(`permission: the /permission ${preset} command was refused`)
      } else if (result.value === null || typeof result.value !== 'object' || result.value.matched !== true) {
        submitError = new Error('permission: the host offers no /permission command')
      } else {
        submitError = null
      }
      ui.schedule!()
    }, () => {
      submitError = new Error(`permission: the /permission ${preset} command failed`)
      ui.schedule!()
    })
  }

  /**
   * Request the switch for every row, gated presets included. A same-value
   * pick writes nothing.
   */
  function pick(preset: string | null) {
    const session = currentSession(ctx)
    if (session === null || preset === null) return
    if (preset === currentPreset(session)) return
    submitPreset(preset)
```

</details>

**依据 2 · 源码核查**：[packages/client/src/features/workspace/workspace-view.ts:304-323](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/features/workspace/workspace-view.ts#L304-L323)

删除一击入口构成独立开关参照。

<details>
<summary>查看原文（20行）</summary>

```text
  function DeleteArchivedSession({ sessionId }: { sessionId: string }) {
    const archived = React.useSyncExternalStore(subscribeView, archivedView)
    if (!archived) return null
    const label = copy('archiveDelete')
    return React.createElement(primitives.Tooltip, {
      label,
      side: 'bottom',
      align: 'end',
      delayMs: 500,
      portal: true,
      children: React.createElement('button', {
        type: 'button',
        className: 'dsh-claude-ws-delete',
        'aria-label': label,
        title: label,
        onClick: (event: React.MouseEvent) => {
          event.stopPropagation()
          removeArchived(sessionId)
        },
      }, React.createElement(primitives.IconTrashOutlineRegular, { size: 14 })),
```

</details>

**依据 3 · 源码核查**：[packages/client/src/entry.ts:294-312](https://github.com/Nwflower/dsh-claude-style/blob/9ed81a8350c59c4cd34695c9cf3681998e2797ef/packages/client/src/entry.ts#L294-L312)

feature按偏好安装/清理提供局部分项机制参照。

<details>
<summary>查看原文（19行）</summary>

```text
  function applySwitch(feature: Feature) {
    const handle = handleName(feature)
    const wanted = isWanted(feature)
    const index = installed.findIndex(entry => entry.id === feature.id)
    if (wanted && index === -1 && !failed.has(feature.id)) {
      installFeature(feature)
      return
    }
    if (wanted || index === -1) return
    const stop = installed[index].stop
    installed.splice(index, 1)
    delete ui[handle]
    // Isolation (D12): a teardown that throws is reported, and the feature
    // stays off for the rest of the generation.
    try {
      stop()
    } catch (error) {
      reportFeatureFailure(feature.id, error)
      failed.add(feature.id)
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
