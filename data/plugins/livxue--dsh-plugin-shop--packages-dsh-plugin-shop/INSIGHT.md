# DSH Plugin Shop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6dabe49](https://github.com/LivXue/dsh-plugin-shop/tree/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop)

<!-- BEGIN META -->
[![GitHub ★ 664](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=664&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LivXue/dsh-plugin-shop) [![npm 30d 5,635](https://img.shields.io/static/v1?label=npm+30d&message=5%2C635&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-shop) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-shop)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中浏览插件目录、安装候选并管理已安装插件。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将目录与现有 profile 状态放进同一页面，宿主依据同名身份和版本构造安装 spec。

> **主要限制**：[Q02](#research-q02) 发现 Release 资产预检与包管理器下载之间可能出现差异。[Q03](#research-q03) 的安装回执也需要核查实际挂载。

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
  - [Q01 · 目录页给已有 Plugins 页面增加什么？](#detail-section-11)
  - [Q02 · 点一条记录如何决定安装哪份字节？](#detail-section-12)
  - [Q03 · 写进 profile 后怎样判断安装、启用与退出？](#detail-section-13)
  - [Q04 · 试用与维持成本怎样核对？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在同一 DSH profile 比较插件来源和安装状态的维护者，可以先在隔离环境用 Shop 浏览并核对候选。

原办法是从网页查项目与版本，再在 DSH 内置 Plugins 页或 CLI 安装和核对该 profile。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 商店目录 | 查看插件候选及来源 | 索引和缓存覆盖可能不同 |
| 安装与管理 | 请求宿主修改对应 profile | 需机制可用且身份通过 |
| 记录与回滚 | 识别激活、回退之前版本 | 桌面回滚入口受限，状态应另查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH、Web 客户端与 Typert | 目录界面必需 | 注册 RPC 和侧栏 | 不提供商店界面 |
| 可用目录与缓存 | 浏览必需 | 取行与版本 | 网络异常可能读旧缓存，解析失败拒绝 |
| 宿主管理器或 CLI | 安装必需 | 写 profile | 桌面缺管理器时拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 管理者打开隔离 profile | 核对目标和来源 |
| 验收 | 把候选与包标识对应 | 记录安装与实际挂载差异 |
| 退出 | 如有异常停用测试插件并回到宿主管理页 | 核对原版本和运行状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 索引和制品下载 | 核对管理器与 profile | 耗时未知 |
| 持续使用 | 缓存、请求与重载 | 复核包来源和版本变化 | 单次开销未知 |
| 失败恢复 | 可能重新取包 | 查激活与回滚是否适用 | 状态恢复实际成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 目录 | 本地缓存及校验规则 | 实时覆盖和来源审核 |
| 安装 | 固定 spec 与冲突保护 | 最终制品和宿主可用 |
| 退出 | 部分场景提供回滚 | 全量配置与状态恢复 |

> **思考**：[Q02](#research-q02) 发现 Release 资产预检与包管理器下载之间可能出现差异。[Q03](#research-q03) 的安装回执也需要核查实际挂载。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将目录与现有 profile 状态放进同一页面，宿主依据同名身份和版本构造安装 spec。

[Q02](#research-q02) 的宿主 spec 构造减少客户端传入不当参数，[Q03](#research-q03) 的回执区分安装操作和激活。剩余风险是制品复取及恢复边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 发现 Release 资产预检与包管理器下载之间可能出现差异。[Q03](#research-q03) 的安装回执也需要核查实际挂载。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先浏览并核对身份，只有来源、版本与可退出条件均可查时才在隔离 profile 验证安装。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持目录、安装选项及部分错误分支。目录作者审核、实际包字节、宿主兼容和恢复未获得实测。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-shop/cordis.patch.yml、packages/dsh-plugin-shop/src/client/index.ts、packages/dsh-plugin-shop/src/host/catalog.ts、packages/dsh-plugin-shop/src/host/install.ts、packages/dsh-plugin-shop/src/host/index.ts、packages/dsh-plugin-shop/src/host/executor.ts、packages/dsh-plugin-shop/src/host/activation.ts、packages/dsh-plugin-shop/README.md、packages/dsh-plugin-shop/package.json 及固定范围 inventory；组件：packages/dsh-plugin-shop。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：当前子包的目录、安装、激活与回滚路径。未运行市场、宿主、目标包、实际 CLI、网络和发布产物。
- 下一步：以隔离 profile 比较原生管理器和 Shop 的候选查找、错误拒绝、有效挂载和退出，另对 [Q04](#research-q04) 的不可变制品设想加可变 URL 对照。

**分析版本**

- **仓库**：[LivXue/dsh-plugin-shop](https://github.com/LivXue/dsh-plugin-shop)
- **版本号**：0.9.4（[固定提交 6dabe49](https://github.com/LivXue/dsh-plugin-shop/tree/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 建议让安装使用同一份校验后的不可变制品，验证能否减少错装并控制缓存与恢复成本。

以隔离 profile 比较原生管理器和 Shop 的候选查找、错误拒绝、有效挂载和退出，另对 [Q04](#research-q04) 的不可变制品设想加可变 URL 对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 422 | — | — | 5159 |
| .ts | source | 51 | 15112 | 7287 | 7075 | — |
| .tsx | source | 6 | 3720 | 2169 | 1568 | — |
| .ts | test | 56 | 26381 | 18189 | 6486 | — |
| .tsx | test | 6 | 8615 | 6400 | 1626 | — |
| .ts | example | 8 | 867 | 449 | 391 | — |
| .js | example | 8 | 110 | 25 | 81 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/LivXue/dsh-plugin-shop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/LivXue/dsh-plugin-shop/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/LivXue/dsh-plugin-shop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：日常核对 DSH 候选时，Shop 能否把目录与安装路径接起来，并准确表达来源、可见权限及退出边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录页给已有 Plugins 页面增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要在 DSH 中反复按来源挑选几个候选、核对安装状态的管理员，可以用同一侧栏页查看目录并发起操作。原办法是在浏览器查项目，再切到 DSH 内置 Plugins 页或 CLI，手工填写来源和版本。Bundle 插入 ShopGateway，客户端接到同一 Typert shop 服务并注册宿主槽。目录加载器对公开索引的指针和数据做校验，验证 SHA-256 及条目内 tarball URL 与仓库、一致的 schema；下载失败时可用已读缓存并标 stale，格式或校验异常不会一概吃掉。缓存可帮助查看历史内容，未证明它仍含全部新撤销或当前状态。哈希来自同一来源指针，能约束内部一致性，无法独立认证维护者。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-shop/cordis.patch.yml:4-9](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/cordis.patch.yml#L4-L9)

宿主接线与可配置目录源。

```text
- insert:
    - id: shop
      name: 'dsh-plugin-shop'
      config:
        catalogUrl: !!js process.env.DSH_SHOP_CATALOG_URL ?? 'https://LivXue.github.io/dsh-plugin-shop/v1/'
        cacheDir: !!js dshHomePath('shop')
```

**依据 2 · 源码核查**：[packages/dsh-plugin-shop/src/client/index.ts:160-189](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/client/index.ts#L160-L189)

客户端挂载 Typert 服务并检查缺失。

<details>
<summary>查看原文（30行）</summary>

```text
export async function apply(ctx: ClientContext): Promise<void> {
  // What this instance replaces (design 2026-10-16-shop-sidebar-page §6),
  // read before anything below puts a store of its own on the page.
  const predecessor = readPredecessor()
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-plugin-shop: dictionaries')

  // `ctx.on('dispose')` never fires in cordis 4.0.1; an effect whose body
  // returns the mount disposer is what actually runs it on teardown. The
  // restart path registered below is withdrawn in that same teardown, and
  // FIRST: disposing the mount aborts a restart call still in flight on it
  // (dsh binds every call to its mount), and that abort has to find a
  // request the page already knows to ask again, not one it would report as
  // undeliverable (restart-monitor.ts).
  const dispose = await ctx.remote.$mount(shopRemote)
  let withdrawRestart = (): void => {}
  ctx.effect(() => () => {
    withdrawRestart()
    return dispose()
  }, 'dsh-plugin-shop: shop remote mount')

  // The mount registered the `remote.shop` service on the gateway's fiber;
  // `ctx.remote.shop` would still refuse it here ("cannot get property
  // remote.shop without inject"), because cordis hands a mounted namespace
  // out through the facade only to a fiber whose inject face names it. The
  // reflect shop has no such gate: `ctx.get` reads a registered service from
  // any fiber, and the mount above has settled, so the strict availability
  // check passes.
  const ns = ctx.get('remote.shop') as ShopRemoteNamespace | undefined
  if (ns === undefined) {
    throw new Error('dsh-plugin-shop: the shop remote did not register (service "remote.shop" missing after $mount)')
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-shop/src/client/index.ts:479-490](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/client/index.ts#L479-L490)

实际注册侧栏和插件详情入口。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: SHOP_PANEL,
    order: 5,
    label: () => ctx.locale.bind(NS)('title'),
    locale: NS,
  }, ShopGlyph))
  // The Plugins page's two buttons (0.1.7-rc.2 and later; design
  // 2026-10-16-shop-sidebar-page §7). They open the page through the layout
  // service, so without one that can select it they do not render
  // (`canOpen`).
  ctx.slots.inject('plugins.detail.actions', () => ctx.slots.register({
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-shop/src/host/catalog.ts:651-667](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/catalog.ts#L651-L667)

缓存新鲜条件和传输失败退路。

<details>
<summary>查看原文（17行）</summary>

```text
    const cached = readCached()
    if (cached !== null) {
      const fetchedAt = freshnessTimeOf(cached.builtAt)
      if (fetchedAt !== null && now().getTime() - fetchedAt < FRESH_MS) {
        return { snapshot: cached, stale: false }
      }
    }
  }

  // Transport failures only (fetch threw, or a non-2xx response) degrade to
  // the cached snapshot with `stale: true`. Everything that interprets the
  // fetched bytes — pointer parse, schemaVersion checks, sha256 comparison,
  // data parse — throws on any irregularity, cache or no cache (§9.2, §10).
  const cachedOrThrow = (error: unknown): CatalogResult => {
    const cached = readCached()
    if (cached !== null) return { snapshot: cached, stale: true }
    throw error
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-shop/src/host/catalog.ts:713-743](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/catalog.ts#L713-L743)

拒绝错误来源、校验摘要及数据关系。

<details>
<summary>查看原文（31行）</summary>

```text
  // handle.file resolves (and refuses absolute/cross-origin) URLs internally
  // now, so a refused URL surfaces as a plain Error, never a TransportError —
  // the instanceof guard below is what keeps that refusal a loud throw like
  // the other pointer-interpretation failures, instead of a stale fallback.
  let dataText: string
  try {
    dataText = await withCommitBudget(
      handle.id,
      `serve ${pointer.plugins.url}`,
      signal => handle!.file(pointer.plugins.url, signal),
    )
  } catch (error) {
    if (!(error instanceof TransportError)) throw error
    return cachedOrThrow(error)
  }

  const actual = createHash('sha256').update(dataText).digest('hex')
  if (actual !== pointer.plugins.sha256) {
    throw new Error(`catalog data failed integrity check: expected ${pointer.plugins.sha256}, got ${actual}`)
  }

  const data = dataSchema.parse(JSON.parse(dataText))
  if (data.schemaVersion > SUPPORTED_SCHEMA_VERSION) {
    throw new Error(
      `catalog schemaVersion ${data.schemaVersion} is newer than this build supports (${SUPPORTED_SCHEMA_VERSION})`,
    )
  }
  // Same coherence gate as the cached path: a tarball URL bound to anything
  // but the entry's own repo is refused loudly whether it came from the wire
  // or the cache — before any install spec could be built from it.
  validateEntryCoherence(data.plugins)
```

</details>

#### 缺口

- 没有同一个候选搜索在原生界面与 Shop 的对照
  **影响**：只能解释路径变化，无法量化目录节时
  **进一步探讨**：用同一索引和 profile 测找对候选所需步骤及身份误选

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 点一条记录如何决定安装哪份字节？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主先拿目录快照和 profile 中现有 spec。无 source 的旧请求仅在名字唯一时继续，带来源者按来源、名称、仓库和子目录选唯一项；版本不合拒绝，现有 spec 属于别的或无法识别也拒绝。社区和旧版审核的条目需要 acknowledged 参数，已标记 verified 的版本走不同流程。确认本身说明客户端提供了同意标志，不能代替签名或源码审计。宿主从已验证字段拼出 npm 固定版本、Git 固定提交及子目录选项。Release 资产会在 install 前拉取并验证摘要，但交给包管理器的是 URL，安装过程会再取一次，两个时点之间存在资产替换窗口。控制客户端不能直接传任意 spec 可以挡住一种错误输入，但不能由此推断发行包字节必然等于验证时的字节。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-shop/src/host/install.ts:78-114](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/install.ts#L78-L114)

判拒清单、身份匹配与版本。

<details>
<summary>查看原文（37行）</summary>

```text
export function validateInstall(
  snapshot: CatalogSnapshot,
  args: InstallArgs,
  installedSpec?: string,
): ValidateResult {
  const denied = snapshot.denied.find(d => d.name === args.name)
  if (denied !== undefined) {
    return { ok: false, code: 'denied', detail: `dsh-plugin-shop: installation of ${args.name} is blocked: ${denied.detail}` }
  }

  let entry: CatalogEntry | undefined
  if (args.source === undefined) {
    // Compatibility with an old client: unique names remain answerable, but
    // guessing among duplicate repositories would install the wrong code.
    const named = snapshot.entries.filter(e => e.name === args.name)
    if (named.length > 1) {
      return {
        ok: false,
        code: 'ambiguous-identity',
        detail: `dsh-plugin-shop: the catalog has ${named.length} plugins named ${args.name}. Refresh the shop and select the one you want to install.`,
      }
    }
    entry = named[0]
  } else {
    const wanted = identityKey({ source: args.source, name: args.name, repo: args.repo, subdir: args.subdir })
    entry = snapshot.entries.find(candidate => identityKey(candidate) === wanted)
    if (entry === undefined) {
      return { ok: false, code: 'not-in-catalog', detail: `dsh-plugin-shop: ${wanted} is not in the catalog` }
    }
  }

  if (entry === undefined) {
    return { ok: false, code: 'not-in-catalog', detail: `dsh-plugin-shop: ${args.name} is not in the catalog` }
  }
  if (entry.version !== args.version) {
    return { ok: false, code: 'version-mismatch', detail: `dsh-plugin-shop: you requested ${args.name}@${args.version}, but the catalog lists ${entry.version}. Refresh the shop and try again.` }
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-shop/src/host/install.ts:123-148](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/install.ts#L123-L148)

保护已占名称和提示审核边界。

<details>
<summary>查看原文（26行）</summary>

```text
  if (installedSpec !== undefined) {
    const verdict = specVerdict(entry, installedSpec)
    if (verdict !== 'same') {
      const holder = holderLabel(installedSpec, args.name)
      // `unknown` is a spec the grammar does not cover — a git remote, a
      // `file:` checkout, an `npm:` alias. Refusing it is the point: the shop
      // must not overwrite something it cannot identify, and saying which
      // string is in the way is the only honest thing left to say about it.
      const what = verdict === 'unknown'
        ? `dsh-plugin-shop: ${args.name} is already installed from ${holder}. The shop could not match it to a catalog entry.`
        : `dsh-plugin-shop: ${args.name} is already installed from ${holder}.`
      return {
        ok: false,
        code: 'name-taken',
        detail: `${what} Installing this plugin would replace it, since a profile can hold only one plugin of each name.`
          + ' To switch, uninstall the existing plugin first.',
      }
    }
  }
  if (entry.tier !== 'verified' && !args.acknowledged) {
    const detail = entry.tier === 'verified-stale'
      ? `dsh-plugin-shop: a different version of ${args.name} was reviewed. The current version has not been reviewed. Confirm the installation to continue.`
      : `dsh-plugin-shop: ${args.name} is a community plugin and has not been reviewed. Confirm the installation to continue.`
    return { ok: false, code: 'needs-acknowledgement', detail }
  }
  return { ok: true, entry }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-shop/src/host/index.ts:1511-1554](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/index.ts#L1511-L1554)

宿主生成 spec 和 Release 摘要时点。

<details>
<summary>查看原文（44行）</summary>

```text
  async install(args: InstallArgs): Promise<ShopInstallResult> {
    // Read once, before the awaits: the desktop gate and the choice of path
    // must see the same service (see `pluginManager`).
    const manager = this.pluginManager()
    if (isDesktopProfile(this.profile) && manager === null) return { ok: false, code: 'desktop-profile', detail: DESKTOP_PROFILE_DETAIL }
    const snapshot = await this.snapshotNow()
    // The manifest's dependency for this name, when it has one: the gate needs
    // it to tell an update of THIS plugin from a replacement of a different one
    // that shares the name. Read once, here, and reused for `isUpdate` below —
    // two reads straddling the tarball fetch could see two different manifests.
    const installedSpec = this.installedSpecOf(args.name)
    const verdict = validateInstall(snapshot, args, installedSpec)
    if (!verdict.ok) return { ok: false, code: verdict.code, detail: verdict.detail }
    // The validator resolved the row by identity. Re-finding it by name is
    // what installed another repository's commit when names collided.
    const entry = verdict.entry
    // The Host builds the spec itself: npm entries become `name@version`,
    // github entries become `github:owner/slug#commit` (subpackage entries
    // `github:owner/slug#commit&path:<subdir>`) — all from fields the
    // snapshot validated, never from a client-supplied string (§7.2).
    let spec: string
    if (entry.source === 'github' && entry.tarball !== undefined) {
      // Release-rescued entry: the spec is the prebuilt tarball URL the
      // snapshot validated (https github.com releases of this very repo).
      // No git, no commit pin — the recorded tag is the version.
      // The recorded sha256 is enforced before anything spawns: fetch the
      // tarball now and verify its bytes. The install itself re-fetches
      // through pnpm, so an asset swapped between this check and pnpm's
      // fetch is a TOCTOU window — this check catches passive MITM and
      // asset tampering at the check instant, and the catalog chain
      // (pointer sha256 + validateEntryCoherence) already pins the URL
      // itself.
      const integrity = await verifyTarballSha256(
        this.fetchTarball,
        entry.tarball.url,
        entry.tarball.sha256,
      )
      if (integrity !== null) {
        return { ok: false, code: 'tarball-integrity', detail: integrity }
      }
      spec = entry.tarball.url
    } else if (entry.source === 'github') {
      if (entry.repo === undefined || !/^[0-9a-f]{40}$/.test(args.version)) {
        return { ok: false, code: 'version-mismatch', detail: `dsh-plugin-shop: ${args.name} has no installable commit` }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-shop/src/host/index.ts:1566-1569](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/index.ts#L1566-L1569)

仓库及 npm 固定 spec。

```text
      spec = `github:${entry.repo}#${args.version}${entry.subdir !== undefined ? `&path:${entry.subdir}` : ''}`
    } else {
      spec = `${args.name}@${args.version}`
    }
```

#### 缺口

- 没有实际 CLI 取件代理或包管理器缓存对照
  **影响**：不能确认二次下载的字节同一性
  **进一步探讨**：用受控 URL 先返回一致字节，校验后提供不同字节，核对安装是否真的阻止替换

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 写进 profile 后怎样判断安装、启用与退出？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

桌面 profile 安装需要可用宿主管理器，否则入口拒绝。桌面 npm 更新在 updateBundle 存在时走该方法，非桌面已安装项目在宿主拒绝原位更新时仍可按分支走 CLI，而桌面不走这一后备。进程内同 profile 队列对管理器和 CLI 操作排序；是否实际生效取决于 Host 和客户端层，可能当场可用、需要客户端重载或需要重启。成功返回 installId 表示创建了安装记录，后续运行状态和实际载入需要另查。回滚仅支持非桌面路径，需要存在可读取的旧记录且条目仍在目录中，若同名身份已换则拒绝。旧 pin/回退记录只在运行状态 done 后更新，无法据此承诺依赖状态和插件自己的数据回到旧版本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-shop/src/host/index.ts:1511-1524](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/index.ts#L1511-L1524)

桌面缺管理器的入口阻断。

<details>
<summary>查看原文（14行）</summary>

```text
  async install(args: InstallArgs): Promise<ShopInstallResult> {
    // Read once, before the awaits: the desktop gate and the choice of path
    // must see the same service (see `pluginManager`).
    const manager = this.pluginManager()
    if (isDesktopProfile(this.profile) && manager === null) return { ok: false, code: 'desktop-profile', detail: DESKTOP_PROFILE_DETAIL }
    const snapshot = await this.snapshotNow()
    // The manifest's dependency for this name, when it has one: the gate needs
    // it to tell an update of THIS plugin from a replacement of a different one
    // that shares the name. Read once, here, and reused for `isUpdate` below —
    // two reads straddling the tarball fetch could see two different manifests.
    const installedSpec = this.installedSpecOf(args.name)
    const verdict = validateInstall(snapshot, args, installedSpec)
    if (!verdict.ok) return { ok: false, code: verdict.code, detail: verdict.detail }
    // The validator resolved the row by identity. Re-finding it by name is
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-shop/src/host/index.ts:1590-1630](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/index.ts#L1590-L1630)

管理器更新与非桌面后备条件。

<details>
<summary>查看原文（41行）</summary>

```text
    const harness = await this.runningHarness()
    if (manager !== null) {
      // The desktop profile has no CLI continuation (dsh refuses that profile
      // outright), so an update there takes dsh's own update operation
      // instead: check, remove, install, and restore the old version when the
      // install fails — the sequence dsh's Plugins page runs (`updateBundle`,
      // 0.2.2 on). Only npm entries: `updateBundle` is a registry-version
      // operation, while a github update installs a new commit spec, which
      // dsh's `already-installed` guard already lets through. Design
      // 2026-11-06-desktop-updates.
      const updateInPlace = isUpdate && entry.source === 'npm' && isDesktopProfile(this.profile)
        ? manager.updateBundle?.bind(manager)
        : undefined
      if (updateInPlace !== undefined) {
        const running = this.startManagerUpdate(
          updateInPlace,
          manager,
          entry.name,
          entry.version,
          `update ${spec}`,
          raw => this.updateOutcome(raw, this.outcomeContext(args.name, 'update', alreadyImported, this.packageHasClientHalf(args.name))),
          () => this.postInstallHazard(args.name, harness, ' It is on disk: uninstall it from the shop to undo this install.'),
        )
        this.track(running)
        this.recordGithubPin(entry)
        this.rememberOnDone(running, entry, args.name, replaced)
        return { ok: true, installId: running.installId, state: running.status().state }
      }
      // An update dsh's plugin manager refuses in place continues through
      // dsh's CLI, in this same record (design 2026-10-19-dsh-021-readiness
      // §2): from dsh 0.2.1 (dsh-plugin-manager 0.2.1-alpha.3 on) the manager
      // answers `already-installed` for a spec naming a package the profile
      // depends on, and has no other way to update one, while `dsh plugin add`
      // over it updates it as before (§2 says what was read and what was
      // measured). Keyed on dsh's code, never on its version or the spec's
      // form, so a dsh that updates in place again keeps being used. Not for a
      // fresh install: the shop saw no such name installed while dsh refuses
      // one as installed, so the two disagree about what the profile holds,
      // and refusing is the safe side. Not on the desktop profile, which dsh's
      // CLI refuses.
      const continues = isUpdate && !isDesktopProfile(this.profile)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-shop/src/host/executor.ts:89-97](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/executor.ts#L89-L97)

同一 profile 调度的串行范围。

```text
/** Run `task` in `profile`'s queue, after every command already in it: the
 * queue `spawnPluginCli` uses, shared with the plugin manager's runner so the
 * two paths are never concurrent in one profile. `ahead` is how many commands
 * were queued or running when the slot was taken. */
export function inProfileQueue<T>(profile: string, task: () => Promise<T>): { ahead: number; finished: Promise<T> } {
  const ahead = enterQueue(profile)
  const finished = chain(profile, task).finally(() => { leaveQueue(profile) })
  return { ahead, finished }
}
```

**依据 4 · 源码核查**：[packages/dsh-plugin-shop/src/host/activation.ts:55-58](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/activation.ts#L55-L58)

区分实时生效、重载与重启。

```text
export function activationOf(input: { hostLive: boolean; clientLive: boolean; hasClientHalf: boolean }): Activation {
  if (!input.hostLive) return 'restart'
  if (!input.hasClientHalf) return 'live'
  return input.clientLive ? 'reload' : 'restart'
```

**依据 5 · 源码核查**：[packages/dsh-plugin-shop/src/host/index.ts:2157-2199](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/index.ts#L2157-L2199)

回滚可用性和同名身份检查。

<details>
<summary>查看原文（43行）</summary>

```text
  async rollbackStart(args: { key: string }): Promise<ShopInstallResult> {
    // The desktop profile refuses the CLI this path spawns, manager or no
    // manager: the install path's `isDesktopProfile && manager === null` test
    // exists because a manager can serve it, and a rollback never goes
    // through one.
    if (isDesktopProfile(this.profile)) return { ok: false, code: 'desktop-profile', detail: DESKTOP_PROFILE_DETAIL }
    let record: ShopRollbackRecord | undefined
    try {
      const state = readShopState(this.stateFs, this.profileDirResolved())
      record = Object.hasOwn(state.previous, args.key) ? state.previous[args.key] : undefined
    } catch {
      return { ok: false, code: 'not-in-catalog', detail: 'dsh-plugin-shop: the profile\'s rollback records could not be read, so there is nothing to roll back to.' }
    }
    if (record === undefined) {
      return { ok: false, code: 'not-in-catalog', detail: 'dsh-plugin-shop: there is no earlier version recorded for this plugin.' }
    }
    const spec = rollbackSpec(record)
    if (spec === undefined) {
      return { ok: false, code: 'version-mismatch', detail: `dsh-plugin-shop: the recorded earlier version of ${record.name} cannot be installed.` }
    }
    // The name may have changed hands since the record was written: the
    // profile's dependency for it must still be THIS identity, or the
    // rollback would replace a different plugin (the rule `installStart`s
    // gate holds through `validateInstall`).
    const snapshot = await this.snapshotNow()
    const current = snapshot.entries.find(entry => identityKey(entry) === args.key)
    if (current === undefined) {
      return { ok: false, code: 'not-in-catalog', detail: `dsh-plugin-shop: ${record.name} is no longer listed, so its earlier version cannot be restored.` }
    }
    const holder = this.installedSpecOf(record.name)
    if (holder !== undefined && !installedSpecMatches(current, holder)) {
      return { ok: false, code: 'name-taken', detail: `dsh-plugin-shop: ${record.name} is now installed from a different source, so rolling back would replace it.` }
    }
    const harness = await this.runningHarness()
    const running = this.startCliInstall(record.name, spec, harness, true)
    this.track(running)
    // Both the pin and the record move only once the host says done. Writing
    // the pin before that left a failed rollback reporting the version it
    // never restored; keeping the record left the offer pointing at what is
    // already installed, for npm whose row carries a spec and never the exact
    // version it was compared against.
    void running.finished.then(status => {
      if (status.state !== 'done') return
```

</details>

#### 缺口

- 同版本宿主的管理器与 CLI 差异、真实加载及数据回滚未验证
  **影响**：不承诺回滚安全覆盖或正在运行的完整状态
  **进一步探讨**：使用非生产 profile 做成功、占名拒绝、需重启、回滚缺记录四种验收

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用与维持成本怎样核对？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先在隔离 profile 只做目录浏览和身份对照。确实需要验证安装时，只选择一项已有独立证据的测试插件，分别核对安装记录、实际挂载以及停用。作者说明 CLI 工作流需 Node、dsh 与 pnpm 及正确 profile；根组件还声明宿主同伴依赖。持续需要下载目录与包、检查版本和来源、重启或处理诊断。现金支出未测，失败恢复还耗费排查并可能需要原生管理页。目录陈旧、身份不明、版本切换后加载不符或无法复原时，应停止由 Shop 变更并回到宿主内置 Plugins 页检查。改进设想是将已校验制品落地到受控缓存，安装交给同一份不可变字节，连同来源和摘要纳入记录；需用可变资产、缓存损坏和多 profile 对照确认是否降低错装且维护可接受。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-plugin-shop/README.md:25-48](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/README.md#L25-L48)

作者说明启动入口、依赖和重启。

<details>
<summary>查看原文（24行）</summary>

````text
### 🧑 For people

**Prerequisites:** Node.js. Running the harness itself needs no install — the
upstream-documented form is `npx -y @deepseek-ai/dsh web`. Plugin management
goes through `dsh plugin`, which spawns both the `dsh` command and `pnpm` —
install them once with `npm install -g @deepseek-ai/dsh pnpm` and verify with
`dsh --version` and `pnpm --version`.

```sh
# dsh on PATH (global install). The explicit version pin matters: pnpm 11
# holds back very recent releases, so a bare `add dsh-plugin-shop` can hand
# you an older version for a while. Pin the current release — refresh it
# with `npm view dsh-plugin-shop version`.
dsh plugin --profile web add dsh-plugin-shop@0.9.4
# or straight through npx, nothing installed:
npx -y @deepseek-ai/dsh plugin --profile web add dsh-plugin-shop@0.9.4
```

Replace `web` with your profile if you use another one. Then restart `dsh` once — a
newly added bundle is not applied to a running process — and open

> **Plugin shop** in the left sidebar

You land on a shelf of plugin cards with a search box. The first load reads the catalog
````

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-shop/package.json:65-76](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/package.json#L65-L76)

Node 与 DSH 声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
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

**依据 3 · 源码核查**：[packages/dsh-plugin-shop/package.json:84-95](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/package.json#L84-L95)

运行依赖与宿主同伴范围。

<details>
<summary>查看原文（12行）</summary>

```text
  "dependencies": {
    "js-yaml": "^4.2.0",
    "semver": "^7.6.3",
    "yaml": "^2.5.1",
    "zod": "^4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/cordis-plugin-include": "^1.0.6",
    "@deepseek-ai/dsh-app-boot": ">=0.1.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-home-paths": ">=0.1.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-typert-protocol": ">=0.1.1-rc.2 <0.3.0-0"
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-shop/src/host/index.ts:1532-1551](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/index.ts#L1532-L1551)

核对制品后将 URL 交给安装的边界是改进依据。

<details>
<summary>查看原文（20行）</summary>

```text
    if (entry.source === 'github' && entry.tarball !== undefined) {
      // Release-rescued entry: the spec is the prebuilt tarball URL the
      // snapshot validated (https github.com releases of this very repo).
      // No git, no commit pin — the recorded tag is the version.
      // The recorded sha256 is enforced before anything spawns: fetch the
      // tarball now and verify its bytes. The install itself re-fetches
      // through pnpm, so an asset swapped between this check and pnpm's
      // fetch is a TOCTOU window — this check catches passive MITM and
      // asset tampering at the check instant, and the catalog chain
      // (pointer sha256 + validateEntryCoherence) already pins the URL
      // itself.
      const integrity = await verifyTarballSha256(
        this.fetchTarball,
        entry.tarball.url,
        entry.tarball.sha256,
      )
      if (integrity !== null) {
        return { ok: false, code: 'tarball-integrity', detail: integrity }
      }
      spec = entry.tarball.url
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-shop/src/host/index.ts:2157-2188](https://github.com/LivXue/dsh-plugin-shop/blob/6dabe49a72e70ea61f91f9a1b164a28d9ab12d50/packages/dsh-plugin-shop/src/host/index.ts#L2157-L2188)

卸载与失效后无法依赖的回退条件。

<details>
<summary>查看原文（32行）</summary>

```text
  async rollbackStart(args: { key: string }): Promise<ShopInstallResult> {
    // The desktop profile refuses the CLI this path spawns, manager or no
    // manager: the install path's `isDesktopProfile && manager === null` test
    // exists because a manager can serve it, and a rollback never goes
    // through one.
    if (isDesktopProfile(this.profile)) return { ok: false, code: 'desktop-profile', detail: DESKTOP_PROFILE_DETAIL }
    let record: ShopRollbackRecord | undefined
    try {
      const state = readShopState(this.stateFs, this.profileDirResolved())
      record = Object.hasOwn(state.previous, args.key) ? state.previous[args.key] : undefined
    } catch {
      return { ok: false, code: 'not-in-catalog', detail: 'dsh-plugin-shop: the profile\'s rollback records could not be read, so there is nothing to roll back to.' }
    }
    if (record === undefined) {
      return { ok: false, code: 'not-in-catalog', detail: 'dsh-plugin-shop: there is no earlier version recorded for this plugin.' }
    }
    const spec = rollbackSpec(record)
    if (spec === undefined) {
      return { ok: false, code: 'version-mismatch', detail: `dsh-plugin-shop: the recorded earlier version of ${record.name} cannot be installed.` }
    }
    // The name may have changed hands since the record was written: the
    // profile's dependency for it must still be THIS identity, or the
    // rollback would replace a different plugin (the rule `installStart`s
    // gate holds through `validateInstall`).
    const snapshot = await this.snapshotNow()
    const current = snapshot.entries.find(entry => identityKey(entry) === args.key)
    if (current === undefined) {
      return { ok: false, code: 'not-in-catalog', detail: `dsh-plugin-shop: ${record.name} is no longer listed, so its earlier version cannot be restored.` }
    }
    const holder = this.installedSpecOf(record.name)
    if (holder !== undefined && !installedSpecMatches(current, holder)) {
      return { ok: false, code: 'name-taken', detail: `dsh-plugin-shop: ${record.name} is now installed from a different source, so rolling back would replace it.` }
```

</details>

#### 缺口

- 成本及实际安全改善缺少同任务对照
  **影响**：只适合观察目录与候选，不能推断载入安全
  **进一步探讨**：并列核对同一插件的索引、校验制品、安装后来源及版本和禁用退出

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
