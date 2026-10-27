# dsh-web-all

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[dbf0248](https://github.com/zhu1090093659/dsh-web/tree/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all)

<!-- BEGIN META -->
[![GitHub ★ 9,562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C562&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 91,620](https://img.shields.io/static/v1?label=npm+30d&message=91%2C620&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all)
<!-- END META -->

> **功能**：聚合安装 dsh-web 家族功能插件，并提供可选的界面兼容与响应式补丁层。

> **亮点**：统一家族依赖、行名和默认配置，当前真实子包拥有各自客户端与生命周期；不重复计算子包功能贡献。见[Q01](#research-q01)。

> **主要限制**：当前patch直挂真实子包，旧故障隔离注释不构成现行保证；一键安装仍有多版本、DOM和状态维护负担。见[Q02](#research-q02)。

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
  - [Q01 · 聚合包为谁减少哪类安装摩擦？](#detail-section-11)
  - [Q02 · 当前patch、shell和compat实际怎样加载？](#detail-section-12)
  - [Q03 · 多包、默认配置和恢复负担怎样限制一键承诺？](#detail-section-13)
  - [Q04 · 如何试用并检验最小安装集假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已需要多个家族模块的DSH维护者可集中安装并按行管理。

逐个安装需要的固定版本独立包为简单基线；聚合仅在多模块需求下有组织便利。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 聚合依赖/patch | 一次安装多家族模块 | 子功能由真实包提供 |
| compat补丁 | 对接旧语义DOM与移动布局 | 可独立关，依宿主结构 |
| 行级启停 | 缩小运行模块集 | 停用不删除依赖；默认SSH/skill-explorer关 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH与profile布局 | 必需 | 解析真实子包 | 行加载失败需核hoist |
| 家族及外部npm包 | 必需 | 子功能 | 聚合不替代各包依赖 |
| 宿主DOM形态 | compat需要 | 语义钩子 | 退回关闭compat/原生界面 |
| 子包权限/账号/模型 | 对应功能需要 | 兑现子任务 | 安装不等于可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选两项需求并备份profile | 保存实际包/启用行 |
| 安装 | 正确profile管理者装聚合并重启 | 真实行加载，无重复来源 |
| 使用 | 用户逐模块核功能和停用 | 不把菜单出现当全验收 |
| 恢复 | 停问题行或换固定独立包 | 恢复profile和模块状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 全家族依赖下载；金额未知 | 备份profile、核布局和行 | 只需单功能时多余 |
| 持续使用 | 多包更新与兼容资源 | 管启用集、版本和状态 | 停用仍保留代码 |
| 失败恢复 | 回退包/配置资源 | 按行日志定位并恢复profile | 多模块迁移效果未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集中安装 | aggregate生成依赖与真实行 | 净安装/升级时间 |
| compat | 语义钩子、响应式与清理 | 跨版本DOM兼容 |
| 故障边界 | 当前真实包拥有生命周期 | 全包启动隔离保证不成立 |

> **思考**：当前patch直挂真实子包，旧故障隔离注释不构成现行保证；一键安装仍有多版本、DOM和状态维护负担。见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一家族依赖、行名和默认配置，当前真实子包拥有各自客户端与生命周期；不重复计算子包功能贡献。见[Q01](#research-q01)。

以aggregate清单集中生成依赖和patch、compat effect清理可借鉴；需持续核生成产物与注释一致，不据旧壳文案外推当前隔离，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

当前patch直挂真实子包，旧故障隔离注释不构成现行保证；一键安装仍有多版本、DOM和状态维护负担。见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

临时profile只启明确需要的模块，记录实际依赖和退出结果；无多模块需求优先独立包。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

聚合与compat接线有源码支持，不能继承旧壳全包故障隔离主张；组合净成本未测，最小选集为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-web-all/README.zh.md、packages/dsh-web-all/package.json、packages/dsh-web-all/aggregate.yml、packages/dsh-web-all/cordis.patch.yml、packages/dsh-web-all/src/index.ts、packages/dsh-web-all/src/shell.ts、packages/dsh-web-all/src/client/index.ts 及固定范围 inventory；组件：packages/dsh-web-all。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅研究聚合/compat边界，不验每个家族功能；不执行目标代码或宿主。
- 下一步：比较同一两模块任务的安装、升级、停用与恢复投入，并对失败模块观察其他行状态；不从旧壳注释推断隔离。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.11（[固定提交 dbf0248](https://github.com/zhu1090093659/dsh-web/tree/dbf0248fd8b2a77a3aeb44ae9688d936ba143303)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是任务驱动的最小模块依赖/权限预览；若版本组合维护超过安装恢复收益就保留现有全包/单包。见[Q04](#research-q04)。

比较同一两模块任务的安装、升级、停用与恢复投入，并对失败模块观察其他行状态；不从旧壳注释推断隔离。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 270 | — | — | 5277 |
| .js | source | 7 | 3088 | 2622 | 498 | — |
| .ts | source | 9 | 1363 | 760 | 547 | — |
| .ts | test | 10 | 1918 | 1262 | 507 | — |
| .ts | example | 4 | 52 | 22 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 192](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=192&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-09-27T02%3A07%3A32.447Z..2026-10-27T02%3A07%3A32.447Z) [![近30天关闭 195](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=195&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A07%3A32.447Z..2026-10-27T02%3A07%3A32.447Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查聚合装载、兼容补丁及相对逐项安装的运维价值

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聚合包为谁减少哪类安装摩擦？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已经确定要使用多个dsh-web家族功能的DSH维护者，可以一次安装依赖并通过每行启停选择任务板、Git、远程等模块。合格结果是所需子包真实加载、配置归属可解释且不重复挂载，而不是下载数或菜单数量。相对逐个安装，聚合清单统一依赖、行名和默认配置；相对只需要一个插件的人，它增加无关下载和升级面，单包更简单。聚合包的贡献是安装/装载组织和兼容补丁，不能把任务板、SSH或皮肤的实现重新归为此包贡献。作者“全家桶”代表打包范围，不代表全部功能已运行验收。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-web-all/README.zh.md:20-33](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/README.zh.md#L20-L33)

一次安装、compat边界、默认关闭与逐行管理

<details>
<summary>查看原文（14行）</summary>

```text
DeepSeek Harness（DSH）Web UI 与官方桌面客户端全家桶聚合插件：一键安装家族的全部功能插件（任务看板 / Git 图谱 / 桌面宠物 / 移动端远程 / 远程桥接 / SSH 运维 / 会话归档 / 皮肤中心 / 设置区 / 社区插件，完整清单以本包 `aggregate.yml` 为准）。compat 桥接层已并入本包（`src/client`），因此无需独立的 compat npm 包。

> 注（alpha 分支，2026-09-17）：本分支不内置任何外部插件。

## 是什么

- **一次安装、全部到位**：其 dependencies 引入家族的全部子插件包（任务看板 / Git 图谱 / 宠物 / 移动端远程 / 远程桥接 / SSH / 皮肤 / 设置区 / 社区插件 等，完整清单以 `aggregate.yml` 为准），且本分支不内置任何外部 npm 插件。`@mlgbnb/dsh-archive-manager`（社区归档管理：按项目分组、搜索筛选、预览对话、一键恢复与删除）未内置——其上游构建仍 import 已移除的 `@deepseek-ai/dsh-client-runtime` 面。
- **聚合载具**：`cordis.patch.yml` 汇总各子插件的 `insert` 行与外部插件行，经 dsh 插件 profile 机制挂载。外部 profile bundle 由生成器展开：其 patch 行变成可导入的聚合行，bundle 自身的 harness-row patch 原样保留；标记了 `"inactive": true` 的外部行会在产物之后统一追加 `disabled: true` 覆盖行，未主动启用前不会挂载。
- **家族行直挂真实包**：每个家族插件的行 `name` 就是它自己的 npm 包名，官方 `dsh-client-modules` 因此直接下发该包的浏览器半区——装哪个插件就只下载哪个插件的界面，不必为了一块面板承担一份整份副本（issue #1901：旧做法把 13 个家族界面内联进本包 `lib/client.js`，单文件 2.9 MB）。行 id 仍是 `web-ui-*`，老 profile 里的行级开关照样命中；行的 `disabled` 直接由 loader 决定该家族装不装，开关不再需要浏览器端二次门控。旧 profile 里记录的子路径行名（`@linxin666/dsh-web-all/<family>`）仍保留导出空壳，升级后照常解析。
- **compat 是可选补丁层**：`web-ui-compat` 行现在只提供兼容补丁——给当前 shell 打上插件与皮肤依赖的 `data-pane` / `data-dsh-frame` 语义钩子、响应式契约与启动遮罩，不含任何家族插件代码。需要这些补丁时保持开启，不需要时可以在插件管理里按行关掉。
- **插件列表里的自有图标**：本包内置 `icon.svg` 并在 `package.json` 顶层声明 `icon`——官方插件列表（设置 → 插件列表）读取的展示元信息字段，因此已安装卡片与详情页在明暗两种主题下都显示家族鲸鱼，而不是默认插画；家族每个包都带同一份素材，单独安装某一个也会显示。DSH 0.2.1 起子路径元信息经导出资源读取，因此聚合的每个家族行导出 `<family>/icon` 与本地化 `locale/*.json`，在 `web-all/<family>` 标题旁显示同一份家族图标。
- **host-only 子插件**：Windows 私有 shell 插件（`dsh-win-bash`，行 `web-ui-win-bash`）不带浏览器半区，并把它自己的平台守卫一路带进聚合 patch，因此在任何非 Windows 宿主上该行都是 disabled、不产生任何开销。它的可用性还跟随梁神预设的声明：`liangshen` 行停用时，工具不注册并如实记录原因。
- **按需开启行**：低频家族插件在聚合包中出厂默认关闭（目前是 SSH、skill-explorer，即 `aggregate.yml` 的 `inactive` 清单；liangshen 不在该清单内，梁神模式拨杆在新装环境即在位）。它们不加载、设置入口也不出现，需要时在 设置 → 插件 → 插件管理 中按行开启；独立包安装不受影响。聚合行还可携带与独立包默认值不同的播种配置（`patches` 清单），用户改动设置后以设置为准。
- **逐行管理**：每个家族插件都可单独启停——设置 → 插件 → 插件管理 中本包行展开为子插件列表，逐行开关即时写入 profile 覆盖层。停用的行由 loader 直接跳过：它既不挂载，也不再向浏览器下发自己的界面。停用即不再加载，代码仍随全家桶更新；需要独立版本管理的插件可另行安装独立包（双挂载保护下独立安装优先）。
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/aggregate.yml:1-13](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/aggregate.yml#L1-L13)

聚合顺序与顶层解析布局的意图

<details>
<summary>查看原文（13行）</summary>

```text
# 聚合包清单：patchFrom 的包其 cordis.patch.yml insert 行会被汇总进本包 patch
# deps 的包进 package.json dependencies（workspace:*）：children 作为 dependencies
# 安装，DSH loader 从 profile 顶层解析 patch 行；严格（isolated）布局需在
# profile 配 hoist（nodeLinker: hoisted 或 public-hoist-pattern，见根 README）
# dsh-skins 的 patch 行只有 skin-center，汇总后展开为 web-ui-skin-center
# 所有子插件行 id 统一加 web-ui- 命名空间（生成器剥掉子包 ui- 前缀后加 web-ui-），
# 与独立包安装共存，不再触发 loader duplicate entry id
# self: 聚合包自身也作为插件加载（compat shim 的 host/client 已并入本包，
# 不再需要独立的 dsh-web-compat npm 包 —— npm 对新包名收费）
# 顺序注意：ui-web-ui-settings 排在最前（self 之后），先声明
# web-ui.plugin.item 子槽位，其余插件的设置卡再注入（slots.inject 声明感知，
# 但更早的声明让设置组在任何卡片之前就位，避免观感上的注册顺序歧义）。
# remote-web-ui 排在 pet 前，确保非 loopback 页面先安装配对门控的远程通道，
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 当前patch、shell和compat实际怎样加载？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

当前生成patch把web-ui-compat指向聚合包自身，其余家族行直接指向各自真实包，例如task-board、git-graph、remote-web-ui。浏览器apply也明确不再内联家族代码，只装响应式样式、启动遮罩与语义DOM钩子，订阅body invalidation并在effect退出清理。这比一个大客户端内联所有模块更清楚地跟随行级生命周期。src/index.ts与shell.ts前部仍描述故障隔离壳，但不能据此说当前所有行经壳：实际patch没有把家族行指向壳，shell.ts自身也说明家族现直挂真实包。兼容层给当前DOM打属性，避免改宿主源码，但依赖宿主结构能识别，不能等价稳定官方插件API。可借鉴的是聚合真相源和真实行归属，而非从历史注释继承隔离保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:5-29](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/cordis.patch.yml#L5-L29)

真实包直接加载而非shell包裹

<details>
<summary>查看原文（25行）</summary>

```text
# Family rows mount the real plugin package: the loader then serves that package's
# own browser half, and one family switch is one loader switch.

# from self
- insert:
    - id: web-ui-compat
      name: '@linxin666/dsh-web-all'

# from ../dsh-web-settings
- insert:
    - id: web-ui-settings
      name: '@linxin666/dsh-client-ui-web-ui-settings'

# from ../dsh-plugin-manager
- insert:
    - id: web-ui-plugin-manager
      name: '@linxin666/dsh-client-ui-plugin-manager'

# from ../dsh-market
- insert:
    - id: web-ui-market
      name: '@linxin666/dsh-client-ui-market'

# from ../dsh-task-board
- insert:
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:507-550](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/src/client/index.ts#L507-L550)

compat独立挂载、重打钩子及清理

<details>
<summary>查看原文（44行）</summary>

```text
export function apply(ctx: Context): void {
  // This half is the compat layer only. Every family plugin mounts through its
  // own loader row and brings its own browser half, so nothing is imported or
  // mounted here: the bundle used to carry an inlined copy of all 13 family
  // clients, which made the page download and evaluate 2.9 MB before any
  // family surface could render (issue #1901).
  ctx.effect(() => {
    const responsiveStyle = ensureResponsiveStyle()
    const bootShield = installBootShield()
    applyShims()
    let removeMobileDismiss = (): void => {}
    let dismissFrame: HTMLElement | null = null
    let resolvedFrame: HTMLElement | null = null
    const ensureMobileDismiss = (): void => {
      // The frame element is stable for the page lifetime; re-query only when
      // the cached one is gone. A document.querySelector per mutation batch
      // was paid for every streaming commit even though the answer never
      // changed.
      if (resolvedFrame !== null && !resolvedFrame.isConnected) resolvedFrame = null
      const frame = resolvedFrame ?? document.querySelector<HTMLElement>('[data-dsh-frame]')
      resolvedFrame = frame
      if (frame === null) return
      bootShield.dismiss()
      if (frame === dismissFrame) return
      removeMobileDismiss()
      removeMobileDismiss = installMobileSidebarDismiss(frame)
      dismissFrame = frame
    }
    ensureMobileDismiss()
    // The shell renders after boot settlement and React can re-create the
    // columns on re-render. The hub already coalesces callbacks per frame;
    // scheduling another frame here would delay hooks and leave work alive
    // after this effect is disposed. Attribute writes remain idempotent.
    const unsubscribeBody = subscribeBodyInvalidations(() => {
      applyShims()
      ensureMobileDismiss()
    })
    return () => {
      unsubscribeBody()
      bootShield.remove()
      responsiveStyle.remove()
      removeMobileDismiss()
    }
  })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/src/shell.ts:49-52](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/src/shell.ts#L49-L52)

shell文档本身说明当前真实包挂载

```text
 * The shell no longer has a row-state surface. Family rows mount their real
 * packages now (issue #1901), so the loader's own entry state is the answer to
 * "is this family mounted", and the browser half has no inlined children left
 * to gate: /api/dsh-web-all/rows and its ledger were removed with the
```

#### 缺口

- DOM结构变动对语义钩子和家族加载的影响未全面核查
  **影响**：不能保证跨宿主版本兼容或单包故障总被隔离
  **进一步探讨**：固定目标宿主检查真实行状态、缺服务/失败子包和DOM变动的退出行为

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多包、默认配置和恢复负担怎样限制一键承诺？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

依赖清单混合workspace内包与外部^0.4.11的皮肤、宠物和社区等包，发布后解析实际版本取决于发行物和profile锁；同聚合版本不自动证明所有来源同提交。aggregate.yml要求profile解析布局能从顶层找到子依赖，严格isolated布局需hoist条件，安装成功但行不可解析是需排查的边界。SSH和skill-explorer默认inactive，其余行仍有自己的模型、网络、状态和权限；聚合开关不是一个安全策略。首次要备份profile、核所有要启用行；持续统一升级会扩大兼容与迁移面，低频行停用仍保留依赖代码；失败应按行状态、真实包日志与锁文件定位，停用问题模块或恢复profile。现金/耗时和共存成本没有测量，不能把一条命令叫零维护。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/package.json:183-208](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/package.json#L183-L208)

workspace与外部分发版本依赖

<details>
<summary>查看原文（26行）</summary>

```text
  },
  "dependencies": {
    "@linxin666/dsh-client-ui-plugin-manager": "workspace:*",
    "@linxin666/dsh-client-ui-market": "workspace:*",
    "@linxin666/dsh-client-ui-task-board": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-github": "workspace:*",
    "@linxin666/dsh-agents": "workspace:*",
    "@linxin666/dsh-client-ui-git-graph": "workspace:*",
    "@linxin666/dsh-remote-web-ui": "workspace:*",
    "@linxin666/dsh-update": "workspace:*",
    "@linxin666/dsh-remote-bridge": "workspace:*",
    "@linxin666/dsh-task-board-remote": "workspace:*",
    "@linxin666/dsh-ssh": "workspace:*",
    "@linxin666/dsh-liangshen": "workspace:*",
    "@linxin666/dsh-client-ui-skill-explorer": "workspace:*",
    "@linxin666/dsh-usage": "workspace:*",
    "@linxin666/dsh-session-archive": "workspace:*",
    "@linxin666/dsh-client-ui-message-edit": "workspace:*",
    "@linxin666/dsh-win-bash": "workspace:*",
    "@linxin666/dsh-client-ui-web-ui-settings": "workspace:*",
    "@linxin666/dsh-i18n": "workspace:*",
    "@linxin666/dsh-client-ui-browser-view": "workspace:*",
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.11",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.11",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.11",
    "@linxin666/dsh-pet": "^0.4.11"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/aggregate.yml:1-7](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/aggregate.yml#L1-L7)

top-level解析与hoist前提

```text
# 聚合包清单：patchFrom 的包其 cordis.patch.yml insert 行会被汇总进本包 patch
# deps 的包进 package.json dependencies（workspace:*）：children 作为 dependencies
# 安装，DSH loader 从 profile 顶层解析 patch 行；严格（isolated）布局需在
# profile 配 hoist（nodeLinker: hoisted 或 public-hoist-pattern，见根 README）
# dsh-skins 的 patch 行只有 skin-center，汇总后展开为 web-ui-skin-center
# 所有子插件行 id 统一加 web-ui- 命名空间（生成器剥掉子包 ui- 前缀后加 web-ui-），
# 与独立包安装共存，不再触发 loader duplicate entry id
```

**依据 3 · 源码核查**：[packages/dsh-web-all/aggregate.yml:180-187](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/aggregate.yml#L180-L187)

默认inactive范围

```text
# 开启即写入用户层 disabled:false 覆盖（优先于本默认），停用回写 disabled:true。
# 锁定的核心行（compat/settings/plugin-manager）不可列入本清单。
# liangshen 不列入本清单（2026-10-10 决策）：梁神模式是新会话首页的常驻模式开关，
# 默认启动才让新装用户看到它；理由与取舍见 Agent Note
# .agents/notes/implemented/architecture/2026-10-10-liangshen-row-enabled-by-default.md。
inactive:
  - web-ui-ssh
  - web-ui-skill-explorer
```

**依据 4 · 作者声明**：[packages/dsh-web-all/README.zh.md:32-33](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/README.zh.md#L32-L33)

停用仍随全包更新，独立版本需独立安装

```text
- **按需开启行**：低频家族插件在聚合包中出厂默认关闭（目前是 SSH、skill-explorer，即 `aggregate.yml` 的 `inactive` 清单；liangshen 不在该清单内，梁神模式拨杆在新装环境即在位）。它们不加载、设置入口也不出现，需要时在 设置 → 插件 → 插件管理 中按行开启；独立包安装不受影响。聚合行还可携带与独立包默认值不同的播种配置（`patches` 清单），用户改动设置后以设置为准。
- **逐行管理**：每个家族插件都可单独启停——设置 → 插件 → 插件管理 中本包行展开为子插件列表，逐行开关即时写入 profile 覆盖层。停用的行由 loader 直接跳过：它既不挂载，也不再向浏览器下发自己的界面。停用即不再加载，代码仍随全家桶更新；需要独立版本管理的插件可另行安装独立包（双挂载保护下独立安装优先）。
```

#### 缺口

- 完整发布依赖树与多模块升级恢复未核
  **影响**：不能保证聚合版本即可复现运行范围
  **进一步探讨**：保存实际lockfile、启用行及包版本，先临时profile升级再迁移工作配置

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用并检验最小安装集假设？

**研究主题**：采用判断、新假设与验证

#### 完整回答

需要多个家族模块且能维护profile的人可在临时环境试用聚合，先只启用已明确需要的两项，核包版本、行状态和各自退出。与逐个装包相比，统一清单减少漏项属于源码支持的组织增量，真实节时未知。若单独插件与聚合重复、停用仍有界面/后台副作用或依赖解析不一致，应停问题行并退回明确版本的独立包。由依赖统一但需求稀疏可推导未验证方向：安装前按用户具体任务生成最小模块集及依赖/权限预览，保持原单包和全包作为退路。对相同两项任务比较逐个安装、全包停用和预览选集的可复现性、安装/升级人工时间与失败恢复；若选集维护引入更多版本组合且未降低负担，就继续使用现有聚合/单包。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-web-all/README.zh.md:26-33](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/README.zh.md#L26-L33)

全包与独立版本管理的现有取舍

```text
- **一次安装、全部到位**：其 dependencies 引入家族的全部子插件包（任务看板 / Git 图谱 / 宠物 / 移动端远程 / 远程桥接 / SSH / 皮肤 / 设置区 / 社区插件 等，完整清单以 `aggregate.yml` 为准），且本分支不内置任何外部 npm 插件。`@mlgbnb/dsh-archive-manager`（社区归档管理：按项目分组、搜索筛选、预览对话、一键恢复与删除）未内置——其上游构建仍 import 已移除的 `@deepseek-ai/dsh-client-runtime` 面。
- **聚合载具**：`cordis.patch.yml` 汇总各子插件的 `insert` 行与外部插件行，经 dsh 插件 profile 机制挂载。外部 profile bundle 由生成器展开：其 patch 行变成可导入的聚合行，bundle 自身的 harness-row patch 原样保留；标记了 `"inactive": true` 的外部行会在产物之后统一追加 `disabled: true` 覆盖行，未主动启用前不会挂载。
- **家族行直挂真实包**：每个家族插件的行 `name` 就是它自己的 npm 包名，官方 `dsh-client-modules` 因此直接下发该包的浏览器半区——装哪个插件就只下载哪个插件的界面，不必为了一块面板承担一份整份副本（issue #1901：旧做法把 13 个家族界面内联进本包 `lib/client.js`，单文件 2.9 MB）。行 id 仍是 `web-ui-*`，老 profile 里的行级开关照样命中；行的 `disabled` 直接由 loader 决定该家族装不装，开关不再需要浏览器端二次门控。旧 profile 里记录的子路径行名（`@linxin666/dsh-web-all/<family>`）仍保留导出空壳，升级后照常解析。
- **compat 是可选补丁层**：`web-ui-compat` 行现在只提供兼容补丁——给当前 shell 打上插件与皮肤依赖的 `data-pane` / `data-dsh-frame` 语义钩子、响应式契约与启动遮罩，不含任何家族插件代码。需要这些补丁时保持开启，不需要时可以在插件管理里按行关掉。
- **插件列表里的自有图标**：本包内置 `icon.svg` 并在 `package.json` 顶层声明 `icon`——官方插件列表（设置 → 插件列表）读取的展示元信息字段，因此已安装卡片与详情页在明暗两种主题下都显示家族鲸鱼，而不是默认插画；家族每个包都带同一份素材，单独安装某一个也会显示。DSH 0.2.1 起子路径元信息经导出资源读取，因此聚合的每个家族行导出 `<family>/icon` 与本地化 `locale/*.json`，在 `web-all/<family>` 标题旁显示同一份家族图标。
- **host-only 子插件**：Windows 私有 shell 插件（`dsh-win-bash`，行 `web-ui-win-bash`）不带浏览器半区，并把它自己的平台守卫一路带进聚合 patch，因此在任何非 Windows 宿主上该行都是 disabled、不产生任何开销。它的可用性还跟随梁神预设的声明：`liangshen` 行停用时，工具不注册并如实记录原因。
- **按需开启行**：低频家族插件在聚合包中出厂默认关闭（目前是 SSH、skill-explorer，即 `aggregate.yml` 的 `inactive` 清单；liangshen 不在该清单内，梁神模式拨杆在新装环境即在位）。它们不加载、设置入口也不出现，需要时在 设置 → 插件 → 插件管理 中按行开启；独立包安装不受影响。聚合行还可携带与独立包默认值不同的播种配置（`patches` 清单），用户改动设置后以设置为准。
- **逐行管理**：每个家族插件都可单独启停——设置 → 插件 → 插件管理 中本包行展开为子插件列表，逐行开关即时写入 profile 覆盖层。停用的行由 loader 直接跳过：它既不挂载，也不再向浏览器下发自己的界面。停用即不再加载，代码仍随全家桶更新；需要独立版本管理的插件可另行安装独立包（双挂载保护下独立安装优先）。
```

**依据 2 · 源码核查**：[packages/dsh-web-all/aggregate.yml:180-187](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/aggregate.yml#L180-L187)

已有inactive默认可作为选集起点

```text
# 开启即写入用户层 disabled:false 覆盖（优先于本默认），停用回写 disabled:true。
# 锁定的核心行（compat/settings/plugin-manager）不可列入本清单。
# liangshen 不列入本清单（2026-10-10 决策）：梁神模式是新会话首页的常驻模式开关，
# 默认启动才让新装用户看到它；理由与取舍见 Agent Note
# .agents/notes/implemented/architecture/2026-10-10-liangshen-row-enabled-by-default.md。
inactive:
  - web-ui-ssh
  - web-ui-skill-explorer
```

#### 缺口

- 用户常用组合与组合维护成本未知
  **影响**：不能从模块多推断新的组合安装产品需求
  **进一步探讨**：先收集真实两模块任务与安装故障，手工预览验证后再考虑自动化

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
