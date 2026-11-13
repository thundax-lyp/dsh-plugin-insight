# DSH Web All

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all)

<!-- BEGIN META -->
[![GitHub ★ 10,353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 108,329](https://img.shields.io/static/v1?label=npm+30d&message=108%2C329&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all)
<!-- END META -->

> **功能**：在 DSH Web profile 聚合安装配套插件，并提供宿主界面兼容层。

> **亮点**：将成员依赖及带稳定行号的挂载放进同一聚合包，提供独立兼容层，并保留成员直挂，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：聚合依赖中的成员可以默认停用。旧壳捕获的加载异常也不能代表当前直挂成员的隔离效果，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

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
  - [Q01 · 聚合包相对逐个安装能为多 profile 管理增加什么？](#detail-section-11)
  - [Q02 · 当前成员行走原生加载还是聚合壳隔离？](#detail-section-12)
  - [Q03 · 自带客户端依赖哪些宿主界面形状？](#detail-section-13)
  - [Q04 · 哪类用户值得试聚合安装，怎样退出？](#detail-section-14)
  - [Q05 · 挂载预览能否减少把已安装、已启用和已可用混在一起？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在多个 DSH Web profile 维护同组插件的管理员，见 [Q01](#research-q01)。

按需逐包安装并独立固定成员版本。需要的成员少时，单包更容易管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 成员聚合 | 为 profile 集中配置扩展 | 两项可选成员默认停用 |
| Web 兼容 | 附加布局语义与样式 | 依赖宿主 DOM |
| 旧配置壳 | 支持旧子路径的动态挂载 | 仅适用于实际进入旧壳的行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配的 DSH Web profile | 必需 | 加载配置及浏览器出口 | 成员或兼容层缺失 |
| 成员依赖可解析 | 启用成员时 | 加载成员真实包 | 按实际行查故障 |
| 宿主 DOM 形状 | 兼容层所需 | 定位布局并打标 | 适配可能不完整 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 复制 profile 并记录启用范围 | 基线可恢复 |
| 加载 | 装入聚合包核对真实行 | 区分默认停用与失败 |
| 退出 | 恢复 profile 或改用单包 | 确认剩余扩展按需加载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包依赖及加载资源 | 核对成员、版本和覆盖 | 未测启动和安装耗时 |
| 持续 | 包升级及运行资源 | 逐行复核需要的成员 | 整组升级影响未知 |
| 失败恢复 | 可能重新加载依赖 | 区分直挂与旧壳后恢复 | 无法承诺直挂隔离 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 成员配置复用 | 聚合依赖与配置行 | 实际维护节省 |
| 界面兼容 | DOM 打标与样式 | 多宿主版本可靠性 |

> **思考**：聚合依赖中的成员可以默认停用。旧壳捕获的加载异常也不能代表当前直挂成员的隔离效果，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将成员依赖及带稳定行号的挂载放进同一聚合包，提供独立兼容层，并保留成员直挂，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

当前成员用独立包入口，兼容层负责 DOM 补丁。旧壳仅隔离进入它的行，判断故障需定位实际加载路径，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

聚合依赖中的成员可以默认停用。旧壳捕获的加载异常也不能代表当前直挂成员的隔离效果，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用独立 profile 记录所需成员及禁用项，加载后核对实际面板和宿主。失败时恢复原 profile 配置，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认组合配置及实际兼容层。完整成员可用性、宿主启动影响和性能需分别验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-web-all/README.md、packages/dsh-web-all/package.json、packages/dsh-web-all/cordis.patch.yml、packages/dsh-web-all/src/shell.ts、packages/dsh-web-all/tsdown.config.ts、packages/dsh-web-all/src/client/index.ts 及固定范围 inventory；组件：packages/dsh-web-all。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核对聚合包依赖、代表成员配置、旧壳分支及自带兼容层；成员各自运行效果、发布产物同源和宿主兼容未验。
- 下一步：复制 profile，逐行比对默认停用、覆盖、加载状态，并模拟一条直挂与一条旧壳失败。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.16（[固定提交 971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在安装与启用之间提供 profile 挂载预览，区分默认停用、旧壳和直挂失败，比较能否减少误诊，见 [Q05](#research-q05)。

复制 profile，逐行比对默认停用、覆盖、加载状态，并模拟一条直挂与一条旧壳失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 272 | — | — | 5352 |
| .js | source | 8 | 4321 | 3653 | 713 | — |
| .ts | source | 9 | 1397 | 759 | 582 | — |
| .ts | test | 10 | 2055 | 1339 | 562 | — |
| .ts | example | 4 | 52 | 22 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=155&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 156](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=156&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定聚合包如何配置成员与兼容层，以及默认停用、加载失败和配置回退的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聚合包相对逐个安装能为多 profile 管理增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在几个 DSH Web profile 维护同一组插件的管理员，可以用一个聚合包取得成员依赖及带命名空间的挂载行。这能减少逐个拼装配置的操作。源清单保留了成员实际包名与行号，也包含自带兼容层。依赖到位和加载启用分别由依赖表与补丁决定。固定补丁默认禁用 SSH 和 Skill Explorer，Windows 辅助项另有平台条件。README 有“一装全开”的表述，也在后文列出可选项，部署前应按补丁核对实际启用集合。只要一个成员、或要独立锁定版本时，单包安装仍有明确价值。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-web-all/README.md:24-33](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/README.md#L24-L33)

作者关于聚合、兼容和逐行启用的陈述。

<details>
<summary>查看原文（10行）</summary>

```text
## What it is

- **One install, everything on**: its dependencies pull in every sub-plugin package of the family (task board, pet, mobile remote, remote bridge, SSH, skins, settings, community plugins and the rest — `aggregate.yml` is the complete list), and this branch bundles no external npm plugin at all. `@mlgbnb/dsh-archive-manager` (the community archive manager: group by project, search and filter, preview conversations, restore and delete) is not bundled — its upstream build still imports the removed `@deepseek-ai/dsh-client-runtime` face.
- **Aggregation carrier**: `cordis.patch.yml` aggregates the `insert` lines of each sub-plugin plus the external plugin rows, mounted through the dsh plugin profile mechanism. External profile bundles are expanded by the generator: their patch rows become importable aggregate rows, the bundle's own harness-row patches are preserved, and an external row marked `"inactive": true` gains trailing `disabled: true` overrides so nothing mounts until you opt in.
- **Family rows mount the real packages**: each family row's `name` is the plugin's own npm package, so the official `dsh-client-modules` serves that package's browser half directly — enabling one panel downloads one panel, instead of one copy of every family UI (issue #1901: the old shape inlined 13 family clients into this package's `lib/client.js`, a single 2.9 MB file). Row ids stay `web-ui-*`, so per-row switches recorded in an existing profile keep applying, and the row's own `disabled` now decides the family at the loader — no browser-side gate is needed. Subpath row names an older profile recorded (`@linxin666/dsh-web-all/<family>`) still resolve to a compat shell export after the upgrade.
- **Compat is the optional patch layer**: the `web-ui-compat` row now only ships compatibility patches — the `data-pane` / `data-dsh-frame` semantic hooks plugins and skins rely on, the responsive contract, and the boot splash — and no family plugin code. Keep it on when you need those patches; it can be switched off per row in the plugin manager.
- **Its own icon in the plugin list**: the package ships `icon.svg` and declares it as the top-level `package.json.icon`, the display-metadata field the official Plugins list (Settings → Plugins) reads, so the installed card and detail page show the family whale in both themes instead of the default artwork. Every family package ships the same asset, so a standalone install of one shows it too. DSH 0.2.1 reads subpath metadata through exported resources instead of a nested package.json, so each aggregate family row exports `<family>/icon` plus localized `locale/*.json` metadata, displaying each family's own localized title and purpose description alongside the family icon.
- **Host-only child**: the Windows private-shell plugin (`dsh-win-bash`, row `web-ui-win-bash`) ships no browser half and carries its own platform guard into the aggregate patch, so its row is disabled on every non-Windows host and costs nothing there. It also follows the LiangShen preset's declaration: with the `liangshen` row disabled, the tool registers nothing and logs why.
- **Opt-in rows**: low-usage family plugins ship disabled by default in the aggregate (currently SSH and skill-explorer — the `inactive` list in `aggregate.yml`; liangshen stays out of it, so the LiangShen mode lever is present on a fresh install). They never load and their settings entries stay hidden until you enable the row under Settings → Plugins → Plugin manager; the standalone packages are unaffected. Bundle rows can also ship a seed config that differs from the standalone default (the `patches` list); a settings edit wins once made.
- **Per-row management**: every family plugin toggles individually — under Settings → Plugins → Plugin manager this package's row expands into a child list with one switch per family plugin, written to the profile override layer. A disabled row is skipped by the loader itself: it neither mounts nor serves its browser half to the page. A disabled child is never loaded while its code still updates with the bundle; install the standalone package when a plugin needs independent versioning (a standalone install wins over the aggregate row).
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/package.json:162-185](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/package.json#L162-L185)

依赖包含 workspace 及独立版本范围。

<details>
<summary>查看原文（24行）</summary>

```text
  "dependencies": {
    "@linxin666/dsh-client-ui-plugin-manager": "workspace:*",
    "@linxin666/dsh-client-ui-market": "workspace:*",
    "@linxin666/dsh-client-ui-task-board": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-github": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-team": "workspace:*",
    "@linxin666/dsh-agents": "workspace:*",
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
    "@linxin666/dsh-client-ui-diagrams": "workspace:*",
    "@linxin666/dsh-client-ui-browser-view": "workspace:*",
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.16",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.16",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.16",
    "@linxin666/dsh-pet": "^0.4.16"
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:8-35](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/cordis.patch.yml#L8-L35)

自带入口和成员包直接挂载。

<details>
<summary>查看原文（28行）</summary>

```text
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

# from ../dsh-plugin-manager (patch row ui-settings-plugins)
- id: ui-settings-plugins
  disabled: true

# from ../dsh-market
- insert:
    - id: web-ui-market
      name: '@linxin666/dsh-client-ui-market'

# from ../dsh-task-board
- insert:
    - id: web-ui-task-board
      name: '@linxin666/dsh-client-ui-task-board'
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:92-118](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/cordis.patch.yml#L92-L118)

平台与默认停用条件。

<details>
<summary>查看原文（27行）</summary>

```text
# from ../dsh-win-bash
- insert:
    - id: web-ui-win-bash
      name: '@linxin666/dsh-win-bash'
      disabled: !!js process.platform !== 'win32'

# from ../dsh-i18n
- insert:
    - id: web-ui-i18n
      name: '@linxin666/dsh-i18n'

# from ../dsh-diagrams
- insert:
    - id: web-ui-diagrams
      name: '@linxin666/dsh-client-ui-diagrams'

# from ../dsh-browser-view
- insert:
    - id: web-ui-browser-view
      name: '@linxin666/dsh-client-ui-browser-view'

# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

</details>

#### 缺口

- 不同 profile 实际启用集合未对照
  **影响**：单一安装命令不足以证明环境一致
  **进一步探讨**：在独立 profile 比对成员、启用行和宿主版本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 当前成员行走原生加载还是聚合壳隔离？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

生成补丁给常用成员直接填真实包名，包括设置、看板和 SSH。当前这些行因此走宿主加载器及成员自己的客户端出口。聚合包另保留旧子路径，导出指向共享壳。壳取 config.plugin，发现包名后动态加载、检查导出并捕获启动错误；空配置的自带行可安静返回。因此壳的降级记录适用于确实进入旧壳路径的行，不能从壳存在推断当前直挂成员逐个隔离。成员独立行有助于定位配置，加载失败对其他成员的影响仍由宿主行为决定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:1-21](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/cordis.patch.yml#L1-L21)

补丁注释及真实包名。

<details>
<summary>查看原文（21行）</summary>

```text
# AUTO-GENERATED by scripts/aggregate.mjs — do not edit
# This file is derived from the aggregate.yml manifest in this package;
# edit aggregate.yml and rerun `node scripts/aggregate.mjs`.
# Rows are namespaced web-ui-* so the bundle can coexist with standalone installs.
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:32-40](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/cordis.patch.yml#L32-L40)

看板两条成员行直接挂包。

```text
# from ../dsh-task-board
- insert:
    - id: web-ui-task-board
      name: '@linxin666/dsh-client-ui-task-board'

# from ../dsh-task-board-github
- insert:
    - id: web-ui-task-board-github
      name: '@linxin666/dsh-client-ui-task-board-github'
```

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:62-75](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/cordis.patch.yml#L62-L75)

SSH 与 Skill Explorer 也直挂包。

<details>
<summary>查看原文（14行）</summary>

```text
# from ../dsh-ssh
- insert:
    - id: web-ui-ssh
      name: '@linxin666/dsh-ssh'

# from ../dsh-liangshen
- insert:
    - id: web-ui-liangshen
      name: '@linxin666/dsh-liangshen'

# from ../dsh-skill-explorer
- insert:
    - id: web-ui-skill-explorer
      name: '@linxin666/dsh-client-ui-skill-explorer'
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/package.json:7-32](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/package.json#L7-L32)

主出口与旧壳子路径并存。

<details>
<summary>查看原文（26行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./shell": "./lib/shell.js",
    "./degraded": "./lib/degraded.js",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json",
    "./community-plugins": "./lib/shells/shell.js",
    "./git-graph": "./lib/shells/shell.js",
    "./plugin-manager": "./lib/shells/shell.js",
    "./skill-explorer": "./lib/shells/shell.js",
    "./preset-center": "./lib/shells/shell.js",
    "./liangshen": "./lib/shells/shell.js",
    "./market": "./lib/shells/shell.js",
    "./pet": "./lib/shells/shell.js",
    "./session-archive": "./lib/shells/shell.js",
    "./settings": "./lib/shells/shell.js",
    "./ssh": "./lib/shells/shell.js",
    "./task-board": "./lib/shells/shell.js",
    "./usage": "./lib/shells/shell.js",
    "./skin-center": "./lib/shells/shell.js",
    "./update": "./lib/shells/shell.js",
    "./task-board-github": "./lib/shells/shell.js",
    "./win-bash": "./lib/shells/shell.js",
```

</details>

**依据 5 · 源码核查**：[packages/dsh-web-all/src/shell.ts:370-401](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/src/shell.ts#L370-L401)

壳在配置含 plugin 时才进入相应路径。

<details>
<summary>查看原文（32行）</summary>

```text
export async function apply(ctx: Context, config: ShellConfigInput): Promise<void> {
  holdHealthRoutes(ctx)
  let mounted: MountedFamily | undefined
  /** Serializes config syncs: an update may land while a mount is still running. */
  let tail: Promise<void> = Promise.resolve()

  /** Mount the real plugin the current row config names, replacing any previous mount. */
  const sync = async (): Promise<void> => {
    const raw = liveRowConfig(config)
    const row = isRowConfig(raw) ? raw : undefined
    if (row === undefined) {
      if (raw === undefined) return
      recordDegraded('(no plugin)', 'shape', new Error(`shell row config is not a mapping (row config: ${describeConfig(raw)}); the entry mounted empty`))
      return
    }
    const spec = row.plugin
    if (typeof spec !== 'string' || spec === '') {
      // Two legitimate shapes land here and must mount QUIETLY (no degraded
      // record, no throw — an async apply's rejection escapes the loader
      // lifecycle as an unhandled rejection and the host's fail-loud guard
      // kills the whole process):
      // - the SELF row (web-ui-compat): no config at all (undefined or {}).
      //   The compat shim's host half has no host behavior; its browser half
      //   rides the package's ./client face.
      // - a USER bare-row override (`- id: <row>` + `config:` in a patch
      //   layer): patch overrides REPLACE the row config wholesale, so a
      //   hand-written tuning that drops the `plugin` key leaves this row
      //   with nothing to mount. Silence is the documented behavior for that
      //   shape; anything else still lands in the ledger for visibility.
      if (isOverrideShape(row)) return
      recordDegraded('(no plugin)', 'shape', new Error(`shell row config is missing the "plugin" package name (row config: ${describeConfig(row)}); the entry mounted empty`))
      return
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-all/src/shell.ts:419-442](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/src/shell.ts#L419-L442)

动态导入与启动错误捕获。

<details>
<summary>查看原文（24行）</summary>

```text
    let mod: unknown
    try {
      mod = await import(/* @vite-ignore */ spec)
    } catch (error) {
      recordDegraded(spec, 'import', error)
      return
    }
    const plugin = (mod as { default?: unknown; apply?: unknown })?.default ?? mod
    if (typeof plugin !== 'function' && !(typeof plugin === 'object' && plugin !== null && typeof (plugin as { apply?: unknown }).apply === 'function')) {
      recordDegraded(spec, 'shape', new Error(`module has no usable plugin shape (expected a function or { apply })`))
      return
    }
    try {
      // Sync application errors (invalid config, throwing apply) escape the
      // ctx.plugin() call itself; async ones settle on the returned fiber.
      // Both paths are captured here so the shell fiber never fails.
      const fiber = ctx.plugin(plugin as Parameters<Context['plugin']>[0], family)
      mounted = { spec, config: family, dispose: fiber.dispose, fiber: watchable(fiber) }
      void Promise.resolve(fiber).then(
        () => {},
        error => recordDegraded(spec, 'start', error),
      )
    } catch (error) {
      recordDegraded(spec, 'start', error)
```

</details>

#### 缺口

- 目标 DSH 版本遇到直挂成员导入失败后的启动结果未知
  **影响**：不能承诺其余成员或 Web 页面继续可用
  **进一步探讨**：用一个故意坏的直挂成员与一个壳路径分别观察故障传播

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自带客户端依赖哪些宿主界面形状？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

聚合包自带客户端通过 Web 出口应用响应式样式、启动提示与 DOM 语义标记。标记以宿主元素及其 class 选择器寻找侧栏和框架，对重复设置做检查。页面元素被替换后通过失效订阅再找。释放时停止订阅并移除样式、启动提示及移动交互监听。依赖宿主 DOM 形状意味着 class 变更可能导致框架找不到，或者只发生部分标记。需要在真实页面检查；构建入口可核对但包发版与宿主版本组合未验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/package.json:107-118](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/package.json#L107-L118)

声明最低 DSH 及 Web 客户端。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
    },
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

**依据 2 · 源码核查**：[packages/dsh-web-all/tsdown.config.ts:17-29](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/tsdown.config.ts#L17-L29)

聚合入口与旧壳构建。

<details>
<summary>查看原文（13行）</summary>

```text
import { clientBundle } from '../../shared/tsdown.client.ts'

export default clientBundle('@linxin666/dsh-web-all', ['src/index.ts'], {
  companions: [
    {
      name: '@linxin666/dsh-web-all/shell',
      // Object entries pin the output paths: the shells re-export must land
      // exactly at lib/shells/shell.js (the exports map and the scanner
      // marker both depend on that location).
      entry: { shell: 'src/shell.ts', degraded: 'src/degraded.ts', 'shells/shell': 'src/shells/shell.ts' },
      outDir: 'lib',
      format: ['esm'],
      platform: 'node',
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:453-491](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/src/client/index.ts#L453-L491)

用 DOM 选择器标记框架与锁定条件。

<details>
<summary>查看原文（39行）</summary>

```text
function applyShims(): boolean {
  let changed = false
  for (const [selector, attribute] of COLUMN_SHIMS) {
    const el = document.querySelector(selector)
    const eq = attribute.indexOf('=')
    const name = attribute.slice(0, eq)
    const value = attribute.slice(eq + 1).replace(/^"|"$/g, '')
    if (el !== null && el.getAttribute(name) !== value) {
      el.setAttribute(name, value)
      changed = true
    }
  }
  // The frame is the grid item that parents the sidebar column.
  const frame = document.querySelector('[class*="sidebarCol"]')?.parentElement ?? null
  if (frame !== null && frame.getAttribute('data-dsh-frame') !== '') {
    frame.setAttribute('data-dsh-frame', '')
    changed = true
  }
  if (frame !== null) changed = stampSemanticParts(frame) || changed
  // The viewport lock is scoped to this root attribute rather than to
  // `html:has([data-dsh-frame])`; see RESPONSIVE_CSS. It mirrors the frame's
  // presence, so it is cleared again when React replaces the shell and the
  // next pass finds no frame (the lock must never outlive the frame it locks).
  if (syncFrameLock(frame !== null)) changed = true
  return changed
}

/**
 * Mirror the shell frame's presence onto the document root.
 * @param present - whether a stamped frame is currently in the document.
 * @returns whether the root attribute changed.
 */
function syncFrameLock(present: boolean): boolean {
  const root = document.documentElement
  if (root === null) return false
  if (root.hasAttribute(FRAME_LOCK_ATTRIBUTE) === present) return false
  if (present) root.setAttribute(FRAME_LOCK_ATTRIBUTE, '')
  else root.removeAttribute(FRAME_LOCK_ATTRIBUTE)
  return true
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:530-572](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/src/client/index.ts#L530-L572)

应用、重新检测及释放兼容层。

<details>
<summary>查看原文（43行）</summary>

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
```

</details>

#### 缺口

- 宿主 UI 改版及窄屏下的界面兼容未知
  **影响**：聚合已加载也不保证导航正常
  **进一步探讨**：记录两个宿主版本的桌面和窄屏下语义标记与交互

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪类用户值得试聚合安装，怎样退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

多个 profile 确实需要同组看板、归档和设置时，有理由在一个可重建的 profile 先核对聚合挂载。先列出所需成员、禁用项、宿主版本与现有覆盖，启用后逐项检查面板及宿主状态。对照逐包装配相同能力，计依赖和首次加载资源、配置及版本维护、升级故障归因和退出时间。没有固定版本的启动性能实测，也不能把 README 的旧包体积当本轮性能。若成员缺失、宿主加载失败或升级需要独立锁版本，恢复配置或回到单包安装。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-web-all/README.md:32-49](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/README.md#L32-L49)

作者说明逐行开关与安装和重启。

<details>
<summary>查看原文（18行）</summary>

````text
- **Opt-in rows**: low-usage family plugins ship disabled by default in the aggregate (currently SSH and skill-explorer — the `inactive` list in `aggregate.yml`; liangshen stays out of it, so the LiangShen mode lever is present on a fresh install). They never load and their settings entries stay hidden until you enable the row under Settings → Plugins → Plugin manager; the standalone packages are unaffected. Bundle rows can also ship a seed config that differs from the standalone default (the `patches` list); a settings edit wins once made.
- **Per-row management**: every family plugin toggles individually — under Settings → Plugins → Plugin manager this package's row expands into a child list with one switch per family plugin, written to the profile override layer. A disabled row is skipped by the loader itself: it neither mounts nor serves its browser half to the page. A disabled child is never loaded while its code still updates with the bundle; install the standalone package when a plugin needs independent versioning (a standalone install wins over the aggregate row).

## Install

### From npm (recommended)

**DSH Web CLI (Browser)**:
```sh
dsh plugin --profile web add @linxin666/dsh-web-all@latest
# Restart dsh web
dsh web
```

**Official Desktop Client (DeepSeek Harness Desktop)**:
- Open the official desktop client and navigate to "Settings > Plugins" (or the sidebar plugins view)
- Enter `@linxin666/dsh-web-all` into the install input field and click Install
- Fully quit and restart the desktop client once installation completes
````

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:13-35](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/cordis.patch.yml#L13-L35)

实际挂载和宿主旧设置行停用。

<details>
<summary>查看原文（23行）</summary>

```text
# from ../dsh-web-settings
- insert:
    - id: web-ui-settings
      name: '@linxin666/dsh-client-ui-web-ui-settings'

# from ../dsh-plugin-manager
- insert:
    - id: web-ui-plugin-manager
      name: '@linxin666/dsh-client-ui-plugin-manager'

# from ../dsh-plugin-manager (patch row ui-settings-plugins)
- id: ui-settings-plugins
  disabled: true

# from ../dsh-market
- insert:
    - id: web-ui-market
      name: '@linxin666/dsh-client-ui-market'

# from ../dsh-task-board
- insert:
    - id: web-ui-task-board
      name: '@linxin666/dsh-client-ui-task-board'
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:113-118](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/cordis.patch.yml#L113-L118)

两个默认停用项。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 4 · 源码核查**：[packages/dsh-web-all/package.json:162-185](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/package.json#L162-L185)

聚合依赖规模及版本边界。

<details>
<summary>查看原文（24行）</summary>

```text
  "dependencies": {
    "@linxin666/dsh-client-ui-plugin-manager": "workspace:*",
    "@linxin666/dsh-client-ui-market": "workspace:*",
    "@linxin666/dsh-client-ui-task-board": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-github": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-team": "workspace:*",
    "@linxin666/dsh-agents": "workspace:*",
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
    "@linxin666/dsh-client-ui-diagrams": "workspace:*",
    "@linxin666/dsh-client-ui-browser-view": "workspace:*",
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.16",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.16",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.16",
    "@linxin666/dsh-pet": "^0.4.16"
```

</details>

#### 缺口

- 同等启用范围下的安装时间、启动延迟和故障恢复时间未知
  **影响**：不能量化维护收益
  **进一步探讨**：在两套可重建 profile 用同一成员清单比对资源、复核与退出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 挂载预览能否减少把已安装、已启用和已可用混在一起？

**研究主题**：新假设与验证

#### 完整回答

可让预览按 profile 列出实际依赖、启用行、匹配的覆盖、加载路径及宿主结果。与现有逐行开关相比，增量是区分默认未启用、当前直挂和旧配置壳，展示每项下一步从何核查。构造三个场景：默认禁用成员、旧壳漏配包名、直挂成员导入失败。比较现有插件列表与预览下的误诊率、恢复用时和重复安装次数。如果误诊没有减少，或预览带来更多无法验证的状态，就不推广。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:113-118](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/cordis.patch.yml#L113-L118)

提供默认禁用样例。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 2 · 源码核查**：[packages/dsh-web-all/src/shell.ts:376-401](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/src/shell.ts#L376-L401)

旧壳缺包名可无挂载。

<details>
<summary>查看原文（26行）</summary>

```text
  /** Mount the real plugin the current row config names, replacing any previous mount. */
  const sync = async (): Promise<void> => {
    const raw = liveRowConfig(config)
    const row = isRowConfig(raw) ? raw : undefined
    if (row === undefined) {
      if (raw === undefined) return
      recordDegraded('(no plugin)', 'shape', new Error(`shell row config is not a mapping (row config: ${describeConfig(raw)}); the entry mounted empty`))
      return
    }
    const spec = row.plugin
    if (typeof spec !== 'string' || spec === '') {
      // Two legitimate shapes land here and must mount QUIETLY (no degraded
      // record, no throw — an async apply's rejection escapes the loader
      // lifecycle as an unhandled rejection and the host's fail-loud guard
      // kills the whole process):
      // - the SELF row (web-ui-compat): no config at all (undefined or {}).
      //   The compat shim's host half has no host behavior; its browser half
      //   rides the package's ./client face.
      // - a USER bare-row override (`- id: <row>` + `config:` in a patch
      //   layer): patch overrides REPLACE the row config wholesale, so a
      //   hand-written tuning that drops the `plugin` key leaves this row
      //   with nothing to mount. Silence is the documented behavior for that
      //   shape; anything else still lands in the ledger for visibility.
      if (isOverrideShape(row)) return
      recordDegraded('(no plugin)', 'shape', new Error(`shell row config is missing the "plugin" package name (row config: ${describeConfig(row)}); the entry mounted empty`))
      return
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:13-35](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-web-all/cordis.patch.yml#L13-L35)

现行成员直挂，与旧壳区分。

<details>
<summary>查看原文（23行）</summary>

```text
# from ../dsh-web-settings
- insert:
    - id: web-ui-settings
      name: '@linxin666/dsh-client-ui-web-ui-settings'

# from ../dsh-plugin-manager
- insert:
    - id: web-ui-plugin-manager
      name: '@linxin666/dsh-client-ui-plugin-manager'

# from ../dsh-plugin-manager (patch row ui-settings-plugins)
- id: ui-settings-plugins
  disabled: true

# from ../dsh-market
- insert:
    - id: web-ui-market
      name: '@linxin666/dsh-client-ui-market'

# from ../dsh-task-board
- insert:
    - id: web-ui-task-board
      name: '@linxin666/dsh-client-ui-task-board'
```

</details>

#### 缺口

- 宿主是否能可靠提供直挂失败状态和覆盖优先级
  **影响**：缺少真实状态会让预览误导
  **进一步探讨**：用三类失败记录对照最终加载结果再测用户诊断

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
