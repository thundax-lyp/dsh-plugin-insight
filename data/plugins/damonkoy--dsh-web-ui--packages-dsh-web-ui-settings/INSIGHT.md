# DSH Web UI 设置（DamonKoy 分叉）

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui)
<!-- END META -->

> **功能**：在 DSH Web 设置页集中展示 Web UI 系列插件的开关与配置表单，并列出社区插件链接。

> **亮点**：[Q01](#research-q01) 把其他插件贡献的设置表单放到同一位置。[Q02](#research-q02) 优先选择可用的官方设置路径，需要时切换到宿主兼容桥并回读。

> **主要限制**：[Q03](#research-q03) 的空或不可解析名单会回退到家族名单，空列表不能表示全关。[Q02](#research-q02) 的密钥清除和复合值回执应独立确认。

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
  - [Q01 · 设置分组和社区索引实际给用户增加了什么？](#detail-section-11)
  - [Q02 · 哪些设置会经过兼容桥，保存后怎样确认真实值？](#detail-section-12)
  - [Q03 · 回环保护与 allowlist 能保证哪种拒绝？](#detail-section-13)
  - [Q04 · 何时值得采用，怎样验证兼容桥提高确定性？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：装有多个 Web UI 系列插件的 DSH Web 维护者，可以在设置页集中找到同系列配置和社区入口。

以宿主原生插件列表和单插件表单为基线。熟悉配置的维护者还可用备份与已有文档对照手工修改。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 设置分组 | 收拢同系列配置卡 | 需要父槽和其他插件实际注册 |
| 回环兼容桥 | 读写已注册且允许的设置 | 依赖官方主绑定与宿主设置服务 |
| 修订号与回读 | 检查宿主配置状态 | 密钥标志和结构值比较有限 |
| 社区索引 | 从设置页打开贡献者仓库 | 仅链接，安装另行完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web runtime、设置槽、locale | 必需 | 分组与客户端绑定 | 分组或子卡无法显示 |
| 官方 settingsScope | 兼容绑定必需 | 决定优先设置路径 | 缺失时 bind 抛错 |
| 宿主 webServer、settings 与回环 | 备用路径必需 | 接受请求并保存 | 路由缺失或拒绝 |
| 已注册且匹配名单的命名空间 | 对应表单必需 | 获得描述与写入 | 分组不承担注册其他插件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者备份隔离 profile | 确认预期配置卡出现 |
| 核对范围 | 在本机检查有效名单、主备值 | 空名单会回退，逐个核对 |
| 保存 | 修改非敏感字段并读回 | 宿主值实际变化才算完成 |
| 退出 | 停用插件并按需恢复设置 | 检查备用路由已释放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 隔离配置和备份占用未知 | 核对槽位、连接与允许范围 | 仅回环支持备用 HTTP |
| 持续 | 重连和设置写入开销未测 | 查看保存回执及宿主状态 | 空名单回退，冲突率未知 |
| 恢复 | 恢复配置的资源成本未知 | 停止备用桥并核对旧值 | 已保存配置不会因关闭卡片自动复原 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 查找设置 | 子卡可分组折叠 | 浏览器表现与实际耗时 |
| 兼容编辑 | 通过回环读写并回读 | 真实服务、代理和冲突处理 |
| 社区发现 | 显示构建清单的仓库链接 | 目录完整性及使用结果 |

> **思考**：[Q03](#research-q03) 的空或不可解析名单会回退到家族名单，空列表不能表示全关。[Q02](#research-q02) 的密钥清除和复合值回执应独立确认。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把其他插件贡献的设置表单放到同一位置。[Q02](#research-q02) 优先选择可用的官方设置路径，需要时切换到宿主兼容桥并回读。

[Q02](#research-q02) 的主备投影和版本回读适合单独验证。[Q03](#research-q03) 的命名空间交集收窄范围，但需要明确空输入会恢复哪组默认项。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的空或不可解析名单会回退到家族名单，空列表不能表示全关。[Q02](#research-q02) 的密钥清除和复合值回执应独立确认。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先观察，后续在临时 Web profile 验证一个非敏感开关和实际名单。出现意外范围或保存回读不符时退回宿主原设置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持卡片分组、受限回环兼容桥和回读。宿主代理、支持版本、并行保存和实际字段回执仍待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-web-ui-settings/README.md、packages/dsh-web-ui-settings/src/client/index.ts、packages/dsh-web-ui-settings/src/client/WebUIPluginsCard.tsx、packages/dsh-web-ui-settings/src/client/CommunityPluginsCard.tsx、packages/dsh-web-ui-settings/src/client/community-guard.ts、packages/dsh-web-ui-settings/src/index.ts、packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts、packages/dsh-web-ui-settings/src/bridge.ts、packages/dsh-web-ui-settings/src/allowlist.ts、packages/dsh-web-ui-settings/package.json、packages/dsh-web-ui-settings/cordis.patch.yml、packages/dsh-web-ui-settings/tsdown.config.ts、shared/tsdown.client.ts 及固定范围 inventory；组件：packages/dsh-web-ui-settings。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查分叉固定设置子包的双入口、设置分组、范围保护、兼容桥与回读。未执行构建、安装、目标代码、测试或真实宿主，未全面审核家族插件和宿主资料。
- 下一步：按 [Q04](#research-q04) 对照官方路径和备用路径，同一任务检查空名单、过期版本及回环代理的处理。重读宿主证明配置是否生效。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出区分缺省和空名单，显示生效命名空间及当前设置来源。对照是否减少误判和核对时间，决定是否增加这层界面。

按 [Q04](#research-q04) 对照官方路径和备用路径，同一任务检查空名单、过期版本及回环代理的处理。重读宿主证明配置是否生效。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 66 | — | — | 408 |
| .ts | source | 12 | 1203 | 795 | 328 | — |
| .tsx | source | 2 | 159 | 121 | 33 | — |
| .ts | test | 4 | 546 | 466 | 42 | — |
| .tsx | test | 1 | 60 | 45 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：当维护者要在 DSH Web 中管理多个兼容插件的设置时，分组卡和兼容桥分别改变哪一步，如何确认写入落地且没有扩大本机配置范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设置分组和社区索引实际给用户增加了什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标用户是在 DSH Web profile 装了多件 Web UI 家族插件、经常需要调整它们的维护者。对照宿主原有的插件配置列表，当前子包在 settings.plugin.item 里放入一张可折叠分组卡，再声明 web-ui.plugin.item 子槽。展开后渲染其他组件贡献到该槽的卡片。宿主没有外层槽就没有分组，子组件未注册就没有对应设置；分组自身的界面不会遍历所有已安装包，也没有代替每个插件提供开关。

社区卡从构建数据里取条目，校验作者与 HTTPS 链接等字段，展示仓库入口及可选 npm 名称。点击仓库链接打开外部页面，没有安装动作。这个设计减少在插件之间找表单或出处的操作，核到的是导航和内容组合能力。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-web-ui-settings/README.md:5-10](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/README.md#L5-L10)

作者声明分组卡和社区索引。

```text
The dsh web UI plugin group for the DSH settings page: it adds a single card that groups the dsh web UI family settings, hosting the enable switches and configuration forms of the family plugins.

## What it is

- **One card for the family**: on the DSH settings page it registers a card that hosts the enable switches and configuration forms of the dsh web UI family plugins.
- **Community plugin index**: a card inside the group lists community-contributed plugins and links to each contributor's own repository (registry in `community.json`, regenerated with `scripts/community-index`).
```

**依据 2 · 源码核查**：[packages/dsh-web-ui-settings/src/client/index.ts:53-85](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/index.ts#L53-L85)

接入 DSH 必需服务，注册外层与社区子卡。

<details>
<summary>查看原文（33行）</summary>

```text
/** Required services. */
export const inject = ['slots', 'locale', 'connection', 'settingsScope', 'remote']

/**
 * Register the Web UI plugin group.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register('web-ui-plugins', { zh, en }), 'web-ui-settings: dictionaries')

  // The rc.6 compatibility binder: family plugins read ctx.get('webUiSettings')
  // and fall back to the official settings scope on hosts that expose their
  // namespaces natively.
  new WebUiSettingsBinder(ctx)

  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    id: 'web-ui-plugins',
    order: 90,
    locale: 'web-ui-plugins',
    children: { 'web-ui.plugin.item': { kind: 'list', scope: 'root' } },
  }, WebUIPluginsCard))

  // Community plugin index: one card inside the group that lists contributor
  // plugins and links to their own repositories.
  ctx.effect(() => ctx.locale.register('community-plugins', { zh: communityPluginsZh, en: communityPluginsEn }), 'web-ui-settings: community-plugins dictionaries')
  ctx.slots.inject('web-ui.plugin.item', () => ctx.slots.register({
    name: 'web-ui.plugin.item',
    id: 'community-plugins',
    order: 120,
    locale: 'community-plugins',
    inject: () => ({}),
  }, CommunityPluginsCard))
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-ui-settings/src/client/WebUIPluginsCard.tsx:63-71](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/WebUIPluginsCard.tsx#L63-L71)

展开后调用宿主子槽渲染。

```text
      {open
        ? (
          <div className={css.body}>
            <ul className={css.subcards}>
              {renderSlot('web-ui.plugin.item', {})}
            </ul>
          </div>
        )
        : null}
```

**依据 4 · 源码核查**：[packages/dsh-web-ui-settings/src/client/CommunityPluginsCard.tsx:27-33](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/CommunityPluginsCard.tsx#L27-L33)

读取构建时数据并过滤条目。

```text
export function CommunityPluginsCard(props: CommunityPluginsCardProps): ReactNode {
  const { t } = props
  const plugins = (props.plugins ?? COMMUNITY_PLUGINS).filter(isCommunityPluginEntry)
  const [open, setOpen] = useState(false)
  return (
    <li className={open ? `${css.groupCard} ${css.groupCardOpen}` : css.groupCard}>
      <button
```

**依据 5 · 源码核查**：[packages/dsh-web-ui-settings/src/client/CommunityPluginsCard.tsx:61-79](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/CommunityPluginsCard.tsx#L61-L79)

渲染链接与包名，没有安装调用。

<details>
<summary>查看原文（19行）</summary>

```text
            <ul className={css.entries}>
              {plugins.length === 0
                ? <li className={css.empty} role="status">{t('empty')}</li>
                : plugins.map((plugin) => (
                  <li key={plugin.id} className={css.entry}>
                    <span className={css.entryHead}>
                      <span className={css.entryName} title={plugin.name}>{plugin.name}</span>
                      <span className={css.entryAuthor} title={plugin.author}>{t('author')}: {plugin.author}</span>
                    </span>
                    {plugin.description ? <p className={css.entryDescription}>{plugin.description}</p> : null}
                    {plugin.descriptionEn ? <p className={css.entryDescriptionEn}>{plugin.descriptionEn}</p> : null}
                    <span className={css.entryLinks}>
                      <a className={css.entryLink} href={plugin.repo} target="_blank" rel="noreferrer">{t('repository')}</a>
                      {plugin.npm ? <code className={css.entryNpm}>{plugin.npm}</code> : null}
                    </span>
                  </li>
                ))}
            </ul>
            <p className={css.notice} role="note">{t('notice')}</p>
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-ui-settings/src/client/community-guard.ts:11-21](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/community-guard.ts#L11-L21)

仅执行条目结构和 HTTPS 前缀检查。

<details>
<summary>查看原文（11行）</summary>

```text
export function isCommunityPluginEntry(value: unknown): value is CommunityPluginEntry {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  if (typeof entry.id !== 'string' || entry.id === '') return false
  if (typeof entry.name !== 'string' || typeof entry.nameEn !== 'string') return false
  if (typeof entry.author !== 'string' || entry.author === '') return false
  if (typeof entry.repo !== 'string' || !entry.repo.startsWith('https://')) return false
  if (entry.description !== undefined && typeof entry.description !== 'string') return false
  if (entry.descriptionEn !== undefined && typeof entry.descriptionEn !== 'string') return false
  if (entry.npm !== undefined && typeof entry.npm !== 'string') return false
  return true
```

</details>

#### 缺口

- 缺同版本卡片装载与使用者任务记录
  **影响**：难以量化节省多少找表单操作
  **进一步探讨**：使用相同子卡和任务，比对原有列表、单插件表单与分组卡三条路径。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些设置会经过兼容桥，保存后怎样确认真实值？

**研究主题**：依赖、兼容与流程、工程质量与复用、功能与机制

#### 完整回答

宿主 WebServer 可用且 settings 服务注入后，组件注册精确的 describe 和 mutate HTTP 路由。浏览器依赖官方 settingsScope 来创建主绑定，如果官方绑定服务完全缺失，bind 会抛出；回环连接时额外创建备用控制器。主绑定 ready 时展示它的状态并向它发写，unavailable 后启动兼容读；连接重置和设置文档更新还会触发刷新，所以即便主绑定 ready 时，也可能产生备用读请求。浏览器仍用 ready 的主绑定选择实际写入目标。

备用控制器在单实例内排队，单字段和批量写会携带已知 revision 交给宿主 settings.mutate，失败后重新读宿主。批量路径还对照返回的用户层和密钥已设置标志逐字段回报。对照严格等号适合标量，独立解码出来的复合对象可能无法直接匹配。同一个已设置标志也无法区分替换前后的两个非空密钥值。标志为 false 的密钥在清除后仍会报告未落地，因为密钥分支没有按 op 区分清除与设置；目前只可将该结果作为回读线索。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-ui-settings/src/index.ts:19-45](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/index.ts#L19-L45)

成功注入后装载并在退出时注销路由。

<details>
<summary>查看原文（27行）</summary>

```text
/** Required services before the bridge routes can mount. */
export const inject = ['webServer'] as const

/**
 * Mount the settings bridge when a settings seam exists (the seam is what the
 * bridge serves, so without one there is nothing to expose).
 * @param ctx - host plugin context.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (sctx) => {
    const settingsYamlPath = sctx.settings.documentPath ?? join(homedir(), '.dsh', 'settings.yaml')
    sctx.effect(() => {
      const disposers = makeBridgeRoutes({
        settings: sctx.settings,
        readSettingsYaml: () => {
          try {
            return readFileSync(settingsYamlPath, 'utf8')
          } catch {
            return ''
          }
        },
      }).map(route => sctx.webServer.register(route))
      return () => {
        for (const dispose of disposers) dispose()
      }
    }, 'web-ui-settings: settings bridge')
  })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts:318-367](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts#L318-L367)

主绑定和桥接的选择、读状态与写入口。

<details>
<summary>查看原文（50行）</summary>

```text
export function createCompatScope<T>(options: CompatScopeOptions<T>): SettingsScope<T> & { load(): Promise<void> } & { mutate?: (fields: BridgeBatchOp[]) => Promise<BridgeBatchResult> } {
  const { namespace, primary } = options
  const fallback = options.fetchFn === undefined
    ? undefined
    : new BridgeScopeController<T>(createBridgeApi(options.fetchFn), { namespace })
  const store = createSnapshotStore<SettingsScopeSnapshot<T>>(project())
  let fallbackStarted = false
  const publish = (): void => { store.set(project()) }
  const startFallback = (): void => {
    if (fallback === undefined || fallbackStarted) return
    fallbackStarted = true
    void fallback.load()
  }
  function project(): SettingsScopeSnapshot<T> {
    const primarySnapshot = primary.getSnapshot()
    if (primarySnapshot.status === 'ready' || fallback === undefined) return primarySnapshot
    if (primarySnapshot.status === 'loading') return primarySnapshot
    const bridgeSnapshot = fallback.getSnapshot()
    if (bridgeSnapshot.status === 'ready') return bridgeSnapshot
    if (bridgeSnapshot.status === 'loading') return { ...primarySnapshot, status: 'loading' }
    return primarySnapshot
  }
  primary.subscribe(() => {
    publish()
    if (primary.getSnapshot().status === 'unavailable') startFallback()
  })
  fallback?.subscribe(publish)
  if (primary.getSnapshot().status === 'unavailable') startFallback()
  return {
    getSnapshot: () => store.getSnapshot(),
    subscribe: listener => store.subscribe(listener),
    set: (field, value) => active().set(field, value),
    unset: field => active().unset(field),
    load: async () => {
      fallbackStarted = true
      await fallback?.load()
    },
    // The batch surface exists only while the bridge controller is the active
    // transport; the official scope path still writes per-field (its writes
    // are out of our reach, so the card's duck-typed detection falls back to
    // the per-field loop there). A getter keeps the capability decision at
    // call time instead of freezing it when the wrapper is built.
    get mutate() {
      const backend = active()
      if (fallback !== undefined && backend === fallback && typeof fallback.mutate === 'function') return fallback.mutate.bind(fallback)
      return undefined
    },
  }
  function active(): SettingsScope<T> {
    return primary.getSnapshot().status === 'ready' ? primary : fallback ?? primary
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts:387-421](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts#L387-L421)

官方绑定缺失报错，回环连接才提供 HTTP 备用，设置更新与重连触发刷新。

<details>
<summary>查看原文（35行）</summary>

```text
  bind<T>(spec: SettingsScopeSpec<T>): SettingsScope<T> {
    const ctx = this.ctx
    const official = ctx.get('settingsScope')
    if (!isBinderFace(official)) {
      // The official binder is a product seam every dsh web host carries;
      // when it is absent the bind must not crash the card's activation.
      throw new Error('webUiSettings: the official settingsScope binder is unavailable')
    }
    const primary = official.bind(spec)
    const connectionValue = ctx.get('connection')
    const connection = isConnectionHandle(connectionValue) ? connectionValue : undefined
    const loopback = connection?.isLoopback === true
    const scope = createCompatScope<T>({
      namespace: spec.namespace,
      primary,
      fetchFn: loopback ? ((input, init) => fetch(input, init)) : undefined,
    })
    // Bridge refreshes ride the same invalidation edges as the official
    // scope: forwarded settings-document updates and connection resets.
    ctx.effect(() => {
      const remoteValue = ctx.get('remote')
      const remote = isRemoteFace(remoteValue) ? remoteValue : undefined
      const disposers: Array<() => void> = []
      if (remote !== undefined) {
        disposers.push(remote.$on('settings/document-updated', (namespace) => {
          if (namespace !== undefined && namespace !== spec.namespace) return
          void scope.load()
        }))
      }
      disposers.push(ctx.on('connection/reset', () => { void scope.load() }))
      return () => {
        for (const dispose of disposers) dispose()
      }
    }, 'web-ui-settings: compat scope invalidation')
    return scope
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts:174-189](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts#L174-L189)

控制器实例使用 promise 队列。

<details>
<summary>查看原文（16行）</summary>

```text

  /** Stop queued operations and wait for the current bridge call to settle. */
  async dispose(): Promise<void> {
    this.disposed = true
    await this.tail
  }

  private enqueue<U>(operation: () => Promise<U>): Promise<U> {
    if (this.disposed) return Promise.resolve(undefined as U)
    const task = this.tail.then(async () => {
      if (this.disposed) return undefined as U
      return operation()
    })
    this.tail = task.catch(() => {})
    return task
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts:222-264](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts#L222-L264)

保存携带 revision，失败重新读，批量返回按字段判断。

<details>
<summary>查看原文（43行）</summary>

```text
  private async write(op: { op: 'set' | 'unset'; path: string[]; value?: unknown }): Promise<void> {
    const revision = this.getSnapshot().revision
    let response: { result: BridgeMutateResult }
    try {
      response = await this.api.settings.mutate({
        ns: this.spec.namespace,
        ops: [op],
        ...revision === undefined ? {} : { expectedRevision: revision },
      })
    } catch {
      await this.read()
      return
    }
    if (!response.result.ok || this.disposed) {
      await this.read()
      return
    }
    this.accept(response.result.value.value, response.result.value, undefined)
  }

  private async writeBatch(fields: BridgeBatchOp[]): Promise<BridgeBatchResult> {
    const revision = this.getSnapshot().revision
    const ops = fields.map(({ field, op, value }) => op === 'set'
      ? { op, path: [field], value }
      : { op, path: [field] })
    let response: { result: BridgeMutateResult }
    try {
      response = await this.api.settings.mutate({
        ns: this.spec.namespace,
        ops,
        ...revision === undefined ? {} : { expectedRevision: revision },
      })
    } catch {
      await this.read()
      return { ok: false, fields: [], code: 'internal', message: 'settings bridge unreachable' }
    }
    if (!response.result.ok || this.disposed) {
      const refusal = response.result.ok === false ? response.result : { code: 'internal', message: 'settings bridge unreachable' }
      await this.read()
      return { ok: false, fields: [], code: refusal.code, message: refusal.message }
    }
    this.accept(response.result.value.value, response.result.value, undefined)
    return { ok: true, fields: this.landedFields(fields, response.result.value) }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts:267-283](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts#L267-L283)

非密钥用严格等号，密钥直接返回标志不检查 op。

<details>
<summary>查看原文（17行）</summary>

```text
  /**
   * Judge each requested field against the read-back view. A secret field is
   * redacted from the user layer, so it is judged by the view's secret-set
   * marker; every other field is judged by user-layer presence/value.
   */
  private landedFields(fields: BridgeBatchOp[], view: { user?: unknown; secrets?: { path: string[]; set: boolean }[] }): BridgeBatchFieldResult[] {
    const secretSet = new Map<string, boolean>()
    for (const secret of view.secrets ?? []) secretSet.set(secret.path.join('.'), secret.set)
    const user = view.user as Record<string, unknown> | undefined
    return fields.map(({ field, op, value }) => {
      const secretFlag = secretSet.get(field)
      if (secretFlag !== undefined) return { field, landed: secretFlag }
      if (op === 'set') {
        return { field, landed: user !== undefined && Object.hasOwn(user, field) && user[field] === value }
      }
      return { field, landed: user === undefined || !Object.hasOwn(user, field) }
    })
```

</details>

**依据 7 · 源码核查**：[packages/dsh-web-ui-settings/src/bridge.ts:138-158](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/bridge.ts#L138-L158)

宿主白名单、版本参数与回读。

<details>
<summary>查看原文（21行）</summary>

```text
    async mutate(request) {
      const body = request as Partial<BridgeMutateRequest> | null
      if (body === null || typeof body !== 'object' || typeof body.ns !== 'string' || !Array.isArray(body.ops)) {
        return { ok: false, code: 'settings-rejected', message: 'malformed bridge settings request' }
      }
      const { ns } = body
      const allowlist = allowlisted()
      if (!allowlist.includes(ns)) {
        return { ok: false, code: 'settings-not-exposed', message: 'settings namespace "' + ns + '" is not exposed to configuration clients' }
      }
      const expectedRevision = typeof body.expectedRevision === 'number' ? body.expectedRevision : undefined
      try {
        await deps.settings.mutate(settingsNamespace(ns) as SettingsNamespace, body.ops as SettingsPathOp[], expectedRevision)
      } catch (error) {
        return failureOf(error)
      }
      const descriptor = deps.settings.describe({ redactSecrets: true }).find(candidate => String(candidate.ns) === ns)
      if (descriptor === undefined) {
        return { ok: false, code: 'internal', message: 'settings namespace "' + ns + '" was disposed after the mutate' }
      }
      return { ok: true, value: toView(descriptor) }
```

</details>

#### 缺口

- 官方及备用桥上的并行编辑和字段形状未实测
  **影响**：过期版本及复杂值可能让保存结果与界面标志不一致
  **进一步探讨**：使用一条标量、一条结构值和一个可丢弃的测试密钥，对照保存、清除及两窗口冲突。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回环保护与 allowlist 能保证哪种拒绝？

**研究主题**：缺陷与关键质疑、工程质量与复用、效果与总成本

#### 完整回答

两条路由仅接受 POST，且检查连接对端为明确的回环地址、Host 是回环字面量或 localhost。请求自报 cross-site 时拒绝，浏览器提供 Origin 时还核对 authority；没有 Origin 时仍可在满足回环条件后进入。因此这是来源保护和命名空间过滤，未看到路由自身再校验用户会话或鉴权令牌。若经反向代理，应实测代理的本机连接和 Host 重写是否仍符合预期。JSON 请求体上限 64 KiB，写入在宿主 settings seam 完成。读请求依赖宿主 redactSecrets 返回脱敏描述符，插件传送配置层和已设置标志，不能从接口输入推断宿主所有变量均正确标为密钥。

描述和修改都会重新由配置文件解析名单，然后同已经注册的族内命名空间求交。未知别名被丢弃。名单在解析前为空，例如文件读不到、键不存在、解析不出来或显式写了空列表，会采用内置族名单，因而空名单不等于全部关闭。非空的未知名字才会在映射阶段变成空集合。这一差异可能令管理者误判暴露范围，应该用返回的 describe 命名空间实测配置结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-ui-settings/src/index.ts:27-40](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/index.ts#L27-L40)

配置文件读取失败使用空字符串。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (sctx) => {
    const settingsYamlPath = sctx.settings.documentPath ?? join(homedir(), '.dsh', 'settings.yaml')
    sctx.effect(() => {
      const disposers = makeBridgeRoutes({
        settings: sctx.settings,
        readSettingsYaml: () => {
          try {
            return readFileSync(settingsYamlPath, 'utf8')
          } catch {
            return ''
          }
        },
      }).map(route => sctx.webServer.register(route))
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-ui-settings/src/bridge.ts:23-45](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/bridge.ts#L23-L45)

回环、Host 和浏览器标记限制。

<details>
<summary>查看原文（23行）</summary>

```text
const MAX_JSON_BODY_BYTES = 64 * 1024

/** Loopback literal check plus browser same-origin markers (mirrors the dsh-ssh route fence). */
function isLoopbackRequest(request: IncomingMessage): boolean {
  const address = request.socket.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-ui-settings/src/bridge.ts:55-85](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/bridge.ts#L55-L85)

请求体上限和脱敏视图投影。

<details>
<summary>查看原文（31行）</summary>

```text
/** Read a JSON request body (undefined when too large or unparseable). */
async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = chunk as Buffer
    size += buffer.length
    if (size > MAX_JSON_BODY_BYTES) return undefined
    chunks.push(buffer)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch {
    return undefined
  }
}

/** Project one settings descriptor onto the bridge wire view. */
function toView(descriptor: SettingsDescriptor): BridgeNamespaceView {
  return {
    ns: String(descriptor.ns),
    schema: descriptor.schema,
    value: descriptor.value,
    ...descriptor.base === undefined ? {} : { base: descriptor.base },
    ...descriptor.user === undefined ? {} : { user: descriptor.user },
    ...descriptor.secrets === undefined ? {} : {
      secrets: descriptor.secrets.map(secret => ({ path: [...secret.path], set: secret.set })),
    },
    revision: descriptor.revision,
  }
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-ui-settings/src/bridge.ts:119-158](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/bridge.ts#L119-L158)

每次读取与写入通过注册名单和宿主设置。

<details>
<summary>查看原文（40行）</summary>

```text
export function makeBridgeHandlers(deps: BridgeDeps): BridgeHandlers {
  const allowlisted = (): string[] => {
    const descriptors = deps.settings.describe({ redactSecrets: true })
    const registered = descriptors.map(descriptor => String(descriptor.ns))
    return composeAllowlist(extractWebSettingsNamespaces(deps.readSettingsYaml()), registered)
  }
  return {
    async describe() {
      const descriptors = deps.settings.describe({ redactSecrets: true })
      const allowlist = allowlisted()
      const namespaces = allowlist
        .map(ns => descriptors.find(descriptor => String(descriptor.ns) === ns))
        .filter((descriptor): descriptor is SettingsDescriptor => descriptor !== undefined)
        .map(toView)
      return {
        ok: true,
        value: { namespaces, writable: deps.settings.writable !== false },
      }
    },
    async mutate(request) {
      const body = request as Partial<BridgeMutateRequest> | null
      if (body === null || typeof body !== 'object' || typeof body.ns !== 'string' || !Array.isArray(body.ops)) {
        return { ok: false, code: 'settings-rejected', message: 'malformed bridge settings request' }
      }
      const { ns } = body
      const allowlist = allowlisted()
      if (!allowlist.includes(ns)) {
        return { ok: false, code: 'settings-not-exposed', message: 'settings namespace "' + ns + '" is not exposed to configuration clients' }
      }
      const expectedRevision = typeof body.expectedRevision === 'number' ? body.expectedRevision : undefined
      try {
        await deps.settings.mutate(settingsNamespace(ns) as SettingsNamespace, body.ops as SettingsPathOp[], expectedRevision)
      } catch (error) {
        return failureOf(error)
      }
      const descriptor = deps.settings.describe({ redactSecrets: true }).find(candidate => String(candidate.ns) === ns)
      if (descriptor === undefined) {
        return { ok: false, code: 'internal', message: 'settings namespace "' + ns + '" was disposed after the mutate' }
      }
      return { ok: true, value: toView(descriptor) }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-web-ui-settings/src/bridge.ts:168-201](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/bridge.ts#L168-L201)

精确 POST 路由，标明方法和来源拒绝。

<details>
<summary>查看原文（34行）</summary>

```text
export function makeBridgeRoutes(deps: BridgeDeps): WebRoute[] {
  const handlers = makeBridgeHandlers(deps)
  const guard = (req: IncomingMessage, res: ServerResponse): boolean => {
    if (!isLoopbackRequest(req)) {
      writeJson(res, 403, { error: 'loopback requests only' })
      return false
    }
    if (req.method !== 'POST') {
      writeJson(res, 405, { error: 'method not allowed: ' + (req.method ?? '') })
      return false
    }
    return true
  }
  return [
    {
      kind: 'exact',
      path: WEB_UI_SETTINGS_BRIDGE_PREFIX + '/describe',
      handler: async (req, res) => {
        if (!guard(req, res)) return
        writeJson(res, 200, await handlers.describe())
      },
    },
    {
      kind: 'exact',
      path: WEB_UI_SETTINGS_BRIDGE_PREFIX + '/mutate',
      handler: async (req, res) => {
        if (!guard(req, res)) return
        const body = await readJsonBody(req)
        if (body === undefined) {
          writeJson(res, 400, { ok: false, code: 'settings-rejected', message: 'unreadable JSON body' })
          return
        }
        writeJson(res, 200, await handlers.mutate(body))
      },
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-ui-settings/src/allowlist.ts:65-90](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/allowlist.ts#L65-L90)

映射已知别名，空输入回退族名单，再与注册项相交。

<details>
<summary>查看原文（26行）</summary>

```text
export function resolveNamespaceEntry(entry: string): string | undefined {
  const key = entry.trim()
  if (key === '') return undefined
  if (Object.hasOwn(NAMESPACE_ALIASES, key)) return NAMESPACE_ALIASES[key] ?? undefined
  if ((FAMILY_NAMESPACES as readonly string[]).includes(key)) return key
  return undefined
}

/**
 * Compose the effective bridge allowlist.
 * @param userEntries - normalized web_settings_namespaces entries; the empty
 *   list selects the built-in family fallback list.
 * @param registered - namespaces currently registered in the host settings
 *   seam (the only namespaces a form or write can target).
 * @returns the allowlist: resolved entries intersected with the registered
 *   set, sorted for a stable wire view.
 */
export function composeAllowlist(userEntries: readonly string[], registered: readonly string[]): string[] {
  const requested = userEntries.length === 0 ? (FAMILY_NAMESPACES as readonly string[]) : userEntries
  const resolved = new Set<string>()
  for (const entry of requested) {
    const ns = resolveNamespaceEntry(entry)
    if (ns !== undefined) resolved.add(ns)
  }
  const registeredSet = new Set(registered)
  return [...resolved].filter(ns => registeredSet.has(ns)).sort()
```

</details>

**依据 7 · 源码核查**：[packages/dsh-web-ui-settings/src/allowlist.ts:114-145](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/allowlist.ts#L114-L145)

简化提取器返回空列表或解析有限形态。

<details>
<summary>查看原文（32行）</summary>

```text
/**
 * Extract the web_settings_namespaces entries from raw settings.yaml text.
 * Accepts a block list, a block map, and an inline flow list — the shapes
 * users have actually tried. Returns the empty list when the key is absent
 * or unparseable.
 * @param text - raw settings.yaml content (the empty string is fine).
 * @returns the configured entries in document order.
 */
export function extractWebSettingsNamespaces(text: string): string[] {
  if (text.trim() === '') return []
  const inline = /(?:^|\n)\s*web_settings_namespaces\s*:\s*\[([^\]]*)\]/m.exec(text)
  if (inline !== null) {
    const entries: string[] = []
    for (const part of inline[1].split(',')) {
      const name = stripQuotes(part)
      if (name !== '') entries.push(name)
    }
    return entries
  }
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex(line => /^\s*web_settings_namespaces\s*:\s*$/.test(line.trim()))
  if (start < 0) return []
  const entries: string[] = []
  for (const line of lines.slice(start + 1)) {
    if (line.trim() === '') break
    if (!/^\s/.test(line)) break
    const trimmed = line.trim()
    if (trimmed.startsWith('#')) continue
    const name = entryOfItem(trimmed)
    if (name !== undefined) entries.push(name)
  }
  return entries
```

</details>

#### 缺口

- 实际 settings.yaml 及宿主秘密标记未校验
  **影响**：无法把插件边界等同于用户授权或全量密钥保护
  **进一步探讨**：以空名单、单一白名单、无权非回环请求和同源反向代理构造正反用例，核对响应字段。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得采用，怎样验证兼容桥提高确定性？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

有多个兼容 Web UI 插件且官方 scope 无法读取族内设置的维护者，可以先观察这一方案。已有可用官方设置的 profile 从分组获得导航便利，而额外 HTTP 入口需要独立确认名单和回读行为。如果只想修改单件插件，官方表单或备份后直接修改明确的设置项可以作为对照。初始成本集中在宿主版本、族内卡片、回环来源和名单核对，日常成本集中在保存结果与实际宿主 revision 的比对。故障时可回到原表单、备份与配置恢复；尚无相同任务的时长或失败率。

待验证设计是显式区分缺省名单和空名单，并在分组中显示生效的命名空间以及主绑定、备用桥当前来源。验证应在同一个隔离 profile，用同一项开关编辑，对照现有版本与带生效名单提示的版本，注入空名单、卸载设置服务及两窗口重载，测误把空名单当关闭的次数和正确诊断所花的时间。若使用者已经能从原面板判定回退，或新提示引发更多误操作，则没有证据给配置页增加这项内容。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-ui-settings/src/allowlist.ts:82-90](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/allowlist.ts#L82-L90)

区分输入为空回退和映射为零。

```text
export function composeAllowlist(userEntries: readonly string[], registered: readonly string[]): string[] {
  const requested = userEntries.length === 0 ? (FAMILY_NAMESPACES as readonly string[]) : userEntries
  const resolved = new Set<string>()
  for (const entry of requested) {
    const ns = resolveNamespaceEntry(entry)
    if (ns !== undefined) resolved.add(ns)
  }
  const registeredSet = new Set(registered)
  return [...resolved].filter(ns => registeredSet.has(ns)).sort()
```

**依据 2 · 源码核查**：[packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts:331-346](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts#L331-L346)

官方状态和备用状态具备独立来源。

<details>
<summary>查看原文（16行）</summary>

```text
  function project(): SettingsScopeSnapshot<T> {
    const primarySnapshot = primary.getSnapshot()
    if (primarySnapshot.status === 'ready' || fallback === undefined) return primarySnapshot
    if (primarySnapshot.status === 'loading') return primarySnapshot
    const bridgeSnapshot = fallback.getSnapshot()
    if (bridgeSnapshot.status === 'ready') return bridgeSnapshot
    if (bridgeSnapshot.status === 'loading') return { ...primarySnapshot, status: 'loading' }
    return primarySnapshot
  }
  primary.subscribe(() => {
    publish()
    if (primary.getSnapshot().status === 'unavailable') startFallback()
  })
  fallback?.subscribe(publish)
  if (primary.getSnapshot().status === 'unavailable') startFallback()
  return {
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts:242-264](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/client/compat-settings-scope.ts#L242-L264)

桥接批量回读提供冲突和故障对照入口。

<details>
<summary>查看原文（23行）</summary>

```text
  private async writeBatch(fields: BridgeBatchOp[]): Promise<BridgeBatchResult> {
    const revision = this.getSnapshot().revision
    const ops = fields.map(({ field, op, value }) => op === 'set'
      ? { op, path: [field], value }
      : { op, path: [field] })
    let response: { result: BridgeMutateResult }
    try {
      response = await this.api.settings.mutate({
        ns: this.spec.namespace,
        ops,
        ...revision === undefined ? {} : { expectedRevision: revision },
      })
    } catch {
      await this.read()
      return { ok: false, fields: [], code: 'internal', message: 'settings bridge unreachable' }
    }
    if (!response.result.ok || this.disposed) {
      const refusal = response.result.ok === false ? response.result : { code: 'internal', message: 'settings bridge unreachable' }
      await this.read()
      return { ok: false, fields: [], code: refusal.code, message: refusal.message }
    }
    this.accept(response.result.value.value, response.result.value, undefined)
    return { ok: true, fields: this.landedFields(fields, response.result.value) }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-ui-settings/src/index.ts:27-45](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-web-ui-settings/src/index.ts#L27-L45)

可用宿主接线决定路由存在和退场。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (sctx) => {
    const settingsYamlPath = sctx.settings.documentPath ?? join(homedir(), '.dsh', 'settings.yaml')
    sctx.effect(() => {
      const disposers = makeBridgeRoutes({
        settings: sctx.settings,
        readSettingsYaml: () => {
          try {
            return readFileSync(settingsYamlPath, 'utf8')
          } catch {
            return ''
          }
        },
      }).map(route => sctx.webServer.register(route))
      return () => {
        for (const dispose of disposers) dispose()
      }
    }, 'web-ui-settings: settings bridge')
  })
```

</details>

#### 缺口

- 没有受控可用性与故障恢复验证
  **影响**：不能判断桥接是否值得增加维护路径
  **进一步探讨**：对照同任务并记录成功、误放行、误拒绝及人工核对时间。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
