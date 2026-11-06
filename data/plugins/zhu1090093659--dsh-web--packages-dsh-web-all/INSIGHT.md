# dsh-web-all

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all)

<!-- BEGIN META -->
[![GitHub ★ 10,117](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C117&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 99,379](https://img.shields.io/static/v1?label=npm+30d&message=99%2C379&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all)
<!-- END META -->

> **功能**：聚合DSH家族插件的依赖与加载行，附Web布局兼容层和旧配置隔离壳。

> **亮点**：[Q01](#research-q01)集中依赖/patch；[Q02](#research-q02)Web DOM/响应布局兼容、observer共享与cleanup；[Q03](#research-q03)旧壳有真实失败记账但覆盖受限。

> **主要限制**：[Q03](#research-q03)当前直接row不受旧shell自动隔离，默认opt-in不代表所有远程面停用；[Q04](#research-q04)关键子包身份/副作用与恢复未验。

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
  - [Q01 · 聚合包替用户完成什么，哪些功能与官方能力不是自己的？](#detail-section-11)
  - [Q02 · 真正加载路径是直接子包还是隔离壳，自己的Web半部做什么？](#detail-section-12)
  - [Q03 · 哪些故障被隔离，degraded接口和默认停用能保证什么？](#detail-section-13)
  - [Q04 · 什么条件下值得聚合安装，退出怎样恢复？](#detail-section-14)
  - [Q05 · 比继续加包更有价值的组合方向如何证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：@linxin666/dsh-web-all 0.4.15是DSH原生插件聚合包和Web兼容层，路径packages/dsh-web-all，非独立Agent。README标题的Official是作者自称，不能据此当DSH官方维护包。目标是确实需要多项家族功能、能管理profile的用户，减少分别安装/更新和整理row的工作；基线是按需独立安装真正需要的子包及宿主现有能力，成功是所需row正确生效且无多余权限/布局故障。

按需独立安装子包与宿主已有功能、插件管理器，避免为少数需求引入整组依赖。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 聚合依赖/row | 多功能配置 | 真子包行为须独立核 |
| Web compat | 补DOM钩子/移动布局 | Host结构/样式耦合 |
| 旧shell/ledger | 旧配置失败记账 | 不覆盖当前直接row |
| 默认关闭 | SSH/skill opt-in | 非其它远程面保证 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| DSH>=0.2.2-rc.1/Loader/Web | 必需 | patch/真实row/client | 未运行组合 |
| workspace与外部子包 | 对应功能必需 | 实际功能 | caret/名称非固定行为验收 |
| 现Host DOM/MutationObserver | compat需要 | 补钩子/布局 | 匹配失效/no-op |
| 子包API/身份/存储权限 | 各自需要 | 远程/数据等 | 未全核，不作聚合保证 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 比较 | 列任务/所需row | 少数功能用独立包 |
| 准备 | 备份/隔离/核Host与实际版本 | 未需row停用 |
| 核查 | 真子包入口/身份/副作用 | 不凭UI或启动成功 |
| 恢复 | 停具体row/刷新/还原 | 核DOM/数据/远端残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 多依赖/Host未知 | row/权限/版本核对 | 非独立安装验收 |
| 持续 | 网络/存储/observer未知 | 整组更新/维护 | disabled仍有包依赖 |
| 故障 | 备份/远端恢复未知 | 查真实row/壳覆盖 | 不能保证启动隔离 |
| 退出 | 包/数据/连接留存未知 | 刷新/恢复/逐项核 | cleanup非全撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 聚合 | 真依赖/patch | npm实际依赖/功能质量 |
| compat | DOM样式/observer/cleanup | 当前Host布局/资源改善 |
| 故障记账 | 旧shell捕获/loopback路由 | 全直接row隔离 |
| 退出 | 自身部分清理 | 子包/远端副作用撤回 |

> **思考**：[Q03](#research-q03)当前直接row不受旧shell自动隔离，默认opt-in不代表所有远程面停用；[Q04](#research-q04)关键子包身份/副作用与恢复未验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)集中依赖/patch；[Q02](#research-q02)Web DOM/响应布局兼容、observer共享与cleanup；[Q03](#research-q03)旧壳有真实失败记账但覆盖受限。

[Q02](#research-q02)全局observer合帧和cleanup可借鉴；[Q03](#research-q03)当前row与历史壳路径必须分清，不把Map ledger当全局健康。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)当前直接row不受旧shell自动隔离，默认opt-in不代表所有远程面停用；[Q04](#research-q04)关键子包身份/副作用与恢复未验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)观察；少数功能优先独立包，组合先逐row核权限/真实执行/退出，未知关键依赖不连接生产。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Git支持聚合声明/当前row和compat/旧shell机制；核心子包/Host组合未全核，观察并优先按需安装。

- 已检查：作者 README、包清单、源码路径 packages/dsh-web-all/README.md、packages/dsh-web-all/aggregate.yml、packages/dsh-web-all/cordis.patch.yml、packages/dsh-web-all/package.json、packages/dsh-web-all/src/client/body-mutations.ts、packages/dsh-web-all/src/client/index.ts、packages/dsh-web-all/src/degraded.ts、packages/dsh-web-all/src/index.ts、packages/dsh-web-all/src/shell.ts、packages/dsh-web-all/src/state.ts 及固定范围 inventory；组件：packages/dsh-web-all。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧12findings完整重核；核当前聚合package/manifest/patch、host self/shell真实import/mount/失败/ledger与loopback、client DOM/style/observer/cleanup；旧git-graph已删除不复用旧跨组件依赖结论；未全审子包、外部npm实现、Host loader/认证/网络/写入与真实运行。
- 下一步：只读同提交Git对象，不运行安装/Host/browser/测试/真实账号远端；无性能/隔离/功能质量/经济效果或恢复独立验证。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.15（[固定提交 1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)以任务到真实row/权限/启动和退出收据对比现有管理器/清单，减少误配，尚未验证。

只读同提交Git对象，不运行安装/Host/browser/测试/真实账号远端；无性能/隔离/功能质量/经济效果或恢复独立验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 272 | — | — | 5352 |
| .js | source | 7 | 3084 | 2618 | 498 | — |
| .ts | source | 9 | 1374 | 758 | 560 | — |
| .ts | test | 10 | 2017 | 1326 | 542 | — |
| .ts | example | 4 | 52 | 22 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核当前直接row、真实compat副作用及旧shell失败边界，不把聚合包名当全部依赖验收。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聚合包替用户完成什么，哪些功能与官方能力不是自己的？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

@linxin666/dsh-web-all 0.4.15是DSH原生插件聚合包和Web兼容层，路径packages/dsh-web-all，非独立Agent。README标题的Official是作者自称，不能据此当DSH官方维护包。目标是确实需要多项家族功能、能管理profile的用户，减少分别安装/更新和整理row的工作；基线是按需独立安装真正需要的子包及宿主现有能力，成功是所需row正确生效且无多余权限/布局故障。

包声明DSH>=0.2.2-rc.1、Apache-2.0及host/client/patch。dependencies包括workspace子包及外部community/preset/skin/pet ^0.4.15；源码固定不等npm发布依赖锁定或外部完整可审计。Git变更功能已由作者说明交官方workspace-changes、原dsh-git-graph目录删除；保留git-graph子路径导出不能当当前功能仍在。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/package.json:1-23](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/package.json#L1-L23)

聚合包身份/版本/真实导出含旧git-graph。

<details>
<summary>查看原文（23行）</summary>

```text
{
  "name": "@linxin666/dsh-web-all",
  "description": "DSH Web UI 全家桶聚合插件：一键安装全部功能插件（task-board / pet / web-ui-settings / skin-center / community-plugins / compat shim）。compat 桥接层已并入本包（src/client），无需独立 compat npm 包。",
  "version": "0.4.15",
  "icon": "icon.svg",
  "type": "module",
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/package.json:110-135](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/package.json#L110-L135)

当前Host peer/许可/发布入口。

<details>
<summary>查看原文（26行）</summary>

```text
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "tsdown",
    "test": "vitest run",
    "prepare": "tsdown",
    "typecheck": "tsgo --noEmit",
    "watch": "tsdown --watch"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.1"
  },
  "license": "Apache-2.0",
  "files": [
    "lib",
    "cordis.patch.yml",
    "icon.svg",
    "locale",
    "shell-metadata"
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/package.json:162-185](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/package.json#L162-L185)

实际workspace与外部依赖。

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
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.15",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.15",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.15",
    "@linxin666/dsh-pet": "^0.4.15"
```

</details>

**依据 4 · 作者声明**：[packages/dsh-web-all/README.md:1-1](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/README.md#L1-L1)

Official仅标题作者自称。

```text
# dsh-web-all · Official All-in-One Plugin Bundle for DeepSeek Harness (DSH) Web GUI
```

**依据 5 · 作者声明**：[packages/dsh-web-all/aggregate.yml:34-38](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/aggregate.yml#L34-L38)

作者明确Git组件删除/官方能力承接/退役兼容。

```text
  # dsh-git-graph 已彻底移除（包目录删除）：Git 变更视图由官方 workspace-changes 插件
  # 承接，聚合不再挂载它的行、也不再依赖它；子路径导出按 tombstones 段留作退役空壳。
  # dsh-update 已整包移除（2026-11-06）：聚合此前就退役了它的自更新行，包目录与发布线一并
  # 删除，侧栏 footer action 席位上不再有任何家族行；`update` 子路径与 retiredPlugins
  # 登记保留，老 profile 的旧行名照旧静默解析。
```

**依据 6 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:8-35](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L8-L35)

实际self及真实子包row。

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

#### 缺口

- 发行物依赖解析/完整子包执行和多功能实际需求未验证。
  **影响**：不能把聚合当所有功能验收或外部能力背书。
  **进一步探讨**：先逐项需要/权限清单，比按需安装，再隔离profile核row。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 真正加载路径是直接子包还是隔离壳，自己的Web半部做什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

当前cordis.patch实际为每个web-ui-* row直接指定真实包，self row加载聚合本身；package dsh.bundle指patch，client指Web。自身host apply转shellApply，但self无plugin配置时返回no-op，不会把其它直接row自动包进shell。子插件的host/client由宿主loader按真实包负责，本轮未把它们的schema/名字算完整执行验收。

聚合自身client.apply通过ctx.effect插入responsive style、boot shield，applyShims查sidebar/center/details CSS类并加data-pane/data-dsh-frame和语义属性/根锁。subscribeBodyInvalidations在DOM变化后重apply并维护移动侧栏点击监听。共享observer用global Symbol注册，一帧合并，逐订阅catch避免一个抛错中断其它，最后订阅退出disconnect/取消frame/清records；不是独立隔离进程。

这实现现有Host DOM钩子/移动布局兼容，而不是新业务编排。DOM class/结构变化会让匹配失效；无DOM/MutationObserver时订阅no-op，不能当插件正确运行。自己的effect cleanup退订/移shield/style/侧栏监听，但未主动撤销所有已写data属性/根锁；停止后状态需刷新/核恢复。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:8-21](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L8-L21)

实际self/子包直接row而非shell config。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:47-65](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L47-L65)

Agents/remote/SSH实际直接row。

<details>
<summary>查看原文（19行）</summary>

```text
# from ../dsh-agents
- insert:
    - id: web-ui-agents
      name: '@linxin666/dsh-agents'

# from ../dsh-remote-bridge
- insert:
    - id: web-ui-remote-bridge
      name: '@linxin666/dsh-remote-bridge'

# from ../dsh-task-board-remote
- insert:
    - id: web-ui-task-board-remote
      name: '@linxin666/dsh-task-board-remote'

# from ../dsh-ssh
- insert:
    - id: web-ui-ssh
      name: '@linxin666/dsh-ssh'
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/package.json:110-117](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/package.json#L110-L117)

bundle/client真实声明。

```text
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
```

**依据 4 · 源码核查**：[packages/dsh-web-all/src/index.ts:11-20](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/index.ts#L11-L20)

self host真实转shellApply。

<details>
<summary>查看原文（10行）</summary>

```text
import type { Context } from '@deepseek-ai/cordis'
import { apply as shellApply } from './shell.ts'
import type { ShellConfigInput } from './shell.ts'

/** Required services: none — the shell must activate before anything else. */
export const inject = [] as const

/** Host plugin body: mount the configured real plugin behind the shell boundary. */
export function apply(ctx: Context, config: ShellConfigInput): Promise<void> {
  return shellApply(ctx, config)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-web-all/src/shell.ts:370-405](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/shell.ts#L370-L405)

无plugin/退役配置实际no-op，不为其它row兜底。

<details>
<summary>查看原文（36行）</summary>

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
    }
    if (RETIRED_PLUGINS.has(spec)) {
      // Stale row from an older profile whose plugin has been retired. Mount empty quietly.
      return
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:333-340](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/client/index.ts#L333-L340)

真实样式注入。

```text
function ensureResponsiveStyle(): HTMLStyleElement {
  const existing = document.querySelector<HTMLStyleElement>('style[data-dsh-compat="responsive"]')
  if (existing !== null) return existing
  const style = document.createElement('style')
  style.dataset.dshCompat = 'responsive'
  style.textContent = RESPONSIVE_CSS
  document.head.appendChild(style)
  return style
```

**依据 7 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:430-468](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/client/index.ts#L430-L468)

真实DOM属性/根锁改写。

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

**依据 8 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:507-550](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/client/index.ts#L507-L550)

实际effect/shim/订阅/cleanup链。

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

**依据 9 · 源码核查**：[packages/dsh-web-all/src/client/body-mutations.ts:73-130](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/client/body-mutations.ts#L73-L130)

实际observer全局共享/合帧/异常与释放。

<details>
<summary>查看原文（58行）</summary>

```text
export function subscribeBodyMutations(subscriber: (records: MutationRecord[]) => void): () => void {
  if (typeof globalThis === 'undefined' || typeof document === 'undefined') return () => {}
  if (typeof MutationObserver !== 'function') return () => {}
  const registry = globalThis as unknown as Record<symbol, unknown>
  let hub = registry[HUB_KEY] as BodyMutationHub | undefined
  if (hub === undefined) {
    const subscribers = new Set<(records: MutationRecord[]) => void>()
    const created: BodyMutationHub = {
      observer: undefined as unknown as MutationObserver,
      subscribers,
      pending: [],
      scheduled: false,
    }
    const flush = (): void => {
      created.frame = undefined
      created.scheduled = false
      const batch = created.pending
      created.pending = []
      for (const listener of [...subscribers]) {
        if (!subscribers.has(listener)) continue
        try {
          listener(batch)
        } catch {
          // One subscriber must never break the others; the next flush retries it.
        }
      }
    }
    const schedule = (): void => {
      if (created.scheduled) return
      created.scheduled = true
      if (typeof requestAnimationFrame === 'function') created.frame = requestAnimationFrame(flush)
      else flush()
    }
    created.observer = new MutationObserver((records) => {
      if (needsRecords(subscribers)) {
        for (const record of records) created.pending.push(record)
      }
      schedule()
    })
    created.observer.observe(document.body ?? document.documentElement, { childList: true, subtree: true })
    registry[HUB_KEY] = created
    hub = created
  }
  const active = hub
  active.subscribers.add(subscriber)
  let subscribed = true
  return () => {
    if (!subscribed) return
    subscribed = false
    active.subscribers.delete(subscriber)
    if (!needsRecords(active.subscribers)) active.pending = []
    if (active.subscribers.size === 0 && registry[HUB_KEY] === active) {
      active.observer.disconnect()
      if (active.frame !== undefined && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(active.frame)
      active.frame = undefined
      active.pending = []
      active.scheduled = false
      delete registry[HUB_KEY]
```

</details>

#### 缺口

- 真实Host DOM/移动交互/子包加载、重复安装与清理效果未测。
  **影响**：不能把静态兼容钩子等同全部子插件可用或零开销。
  **进一步探讨**：在固定Host核所需UI、流式消息/重渲染和禁用后刷新恢复，失败回独立包。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些故障被隔离，degraded接口和默认停用能保证什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

旧shell配置plugin时真动态import→形状检查→ctx.plugin，捕获import/同步apply/Promise和nested fiber deferred失败；配置变化串行sync，旧dispose失败仅warn继续。degraded把堆栈/reason保进globalThis Map，路由只按socket remoteAddress允许127.0.0.1/::1，no-store返回。它是进程内状态、非持久恢复日志或账户认证；loopback反代可能仍算本机，不能据此保证远程用户隔离。

关键反证是当前patch直接挂真实包而无plugin配置，所以这些shell catch/ledger不能保证全部直接row失败仍启动，也不自动捕获任意后台Promise/已发生副作用。README/源码注释仍混有旧壳叙述，结论以真实row为准。

patch末尾SSH和skill-explorer明确disabled:true，Windows bash有平台条件，原ui-settings-plugins也被关闭；其余直接row不因“只安装未启用”而自动无副作用，remote-bridge/看板等需各自核身份/网络/数据。disabled只表示请求loader跳过，代码依赖仍安装/更新，权限/文件/远端操作回滚由真正子包和Host负责，不是聚合撤销。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/src/shell.ts:407-443](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/shell.ts#L407-L443)

真实旧shell dispose/import/mount/catch。

<details>
<summary>查看原文（37行）</summary>

```text
    const family = familyConfigOf(row)
    if (mounted !== undefined && mounted.spec === spec && sameFamilyConfig(mounted.config, family)) return
    if (mounted !== undefined) {
      const previous = mounted
      mounted = undefined
      try {
        await previous.dispose?.()
      } catch (error) {
        // A failed unmount must never keep the new config from mounting.
        console.warn('[dsh-web-all] unmounting the previous family plugin failed:', error)
      }
    }
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
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/src/shell.ts:446-470](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/shell.ts#L446-L470)

真实串行sync/volatile与deferred监听。

<details>
<summary>查看原文（25行）</summary>

```text
  const schedule = (): Promise<void> => {
    tail = tail.then(() => sync().catch((error: unknown) => {
      // An async apply's rejection escapes the loader lifecycle as an
      // unhandled rejection (the host's fail-loud guard then kills the whole
      // process), so every path out of a sync is captured here.
      console.error('[dsh-web-all] applying the shell row config failed:', error)
    }))
    return tail
  }

  // A settings edit on this entry commits the new config into the reference
  // and reaches the family plugin through this listener, not through a remount.
  ctx.on('loader/volatile-update', () => { void schedule() })
  ctx.on('internal/status', (fiber: unknown) => {
    const current = mounted
    if (current?.fiber === undefined || !isNestedFiber(current.fiber, fiber)) return
    recordDeferredStartFailure(current.spec, current.fiber)
  })
  // A plugin that injects services starts LATER than this mount call: cordis
  // creates its fiber PENDING and runs the body only once every injected
  // service exists. A failure in that body therefore lands after the promise
  // above has already resolved, so the fiber's own lifecycle transitions are
  // watched as well. Transitions are rare and `await()` settles without
  // throwing for a fiber that is still waiting, so a healthy row costs nothing.
  await schedule()
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/src/degraded.ts:45-59](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/degraded.ts#L45-L59)

实际进程Map写与读取。

<details>
<summary>查看原文（15行）</summary>

```text
/** Record (or refresh) one plugin's degraded state. Errors are logged here once. */
export function recordDegraded(plugin: string, stage: DegradedRecord['stage'], error: unknown): void {
  const message = error instanceof Error ? error.stack ?? error.message : String(error)
  console.error(`[dsh-web-all] plugin degraded (${stage}): ${plugin}\n${message}`)
  shellState().degraded.set(plugin, { plugin, stage, message, reason: failureReason(error), at: new Date().toISOString() })
}

/** Clear one plugin's degraded record (successful start after a retry/HMR reload). */
export function clearDegraded(plugin: string): void {
  shellState().degraded.delete(plugin)
}

/** Snapshot of all currently degraded plugins. */
export function listDegraded(): DegradedRecord[] {
  return [...shellState().degraded.values()]
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/src/state.ts:24-33](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/state.ts#L24-L33)

global Symbol Map非持久日志。

<details>
<summary>查看原文（10行）</summary>

```text
const KEY = Symbol.for('dsh-web-all.shell-state')

/** The process-wide shared shell state (one instance across module copies). */
export function shellState(): ShellSharedState {
  const registry = globalThis as unknown as Record<symbol, ShellSharedState | undefined>
  return (registry[KEY] ??= {
    activeRows: new Set<string>(),
    degraded: new Map<string, DegradedRecord>(),
    healthRoutes: { count: 0 },
  })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-web-all/src/shell.ts:129-143](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/shell.ts#L129-L143)

真实socket loopback判断/堆栈ledger响应。

<details>
<summary>查看原文（15行）</summary>

```text
function makeDegradedRoute(): WebRoute {
  return {
    kind: 'exact',
    path: '/api/dsh-web-all/degraded',
    handler: async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      let remote = req.socket.remoteAddress ?? ''
      if (remote.startsWith('::ffff:')) remote = remote.slice(7)
      if (remote !== '127.0.0.1' && remote !== '::1') {
        res.writeHead(403, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'forbidden: loopback-only' }))
        return
      }
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
      res.end(JSON.stringify({ ok: true, degraded: listDegraded() }))
    },
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:47-65](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L47-L65)

当前直接挂包不会走shell配置。

<details>
<summary>查看原文（19行）</summary>

```text
# from ../dsh-agents
- insert:
    - id: web-ui-agents
      name: '@linxin666/dsh-agents'

# from ../dsh-remote-bridge
- insert:
    - id: web-ui-remote-bridge
      name: '@linxin666/dsh-remote-bridge'

# from ../dsh-task-board-remote
- insert:
    - id: web-ui-task-board-remote
      name: '@linxin666/dsh-task-board-remote'

# from ../dsh-ssh
- insert:
    - id: web-ui-ssh
      name: '@linxin666/dsh-ssh'
```

</details>

**依据 7 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:92-118](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L92-L118)

Windows条件及两项明确opt-in。

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

**依据 8 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:18-25](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L18-L25)

原设置row关闭。

```text
# from ../dsh-plugin-manager
- insert:
    - id: web-ui-plugin-manager
      name: '@linxin666/dsh-client-ui-plugin-manager'

# from ../dsh-plugin-manager (patch row ui-settings-plugins)
- id: ui-settings-plugins
  disabled: true
```

#### 缺口

- Host loader直接row故障/后台异常、远程bridge/看板身份副作用与默认部署未全核。
  **影响**：核心外部功能及恢复未知，整体采用仅观察，不以壳机制担保。
  **进一步探讨**：对所需单row独立审Host/API/权限；隔离样本测失败启动与实际撤回，再决定安装范围。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么条件下值得聚合安装，退出怎样恢复？

**研究主题**：采用判断、效果与总成本

#### 完整回答

当前建议观察；若只要少数功能优先独立按需安装，确需多项才先备份profile、列每row需求/默认状态/包版本与真实权限，在隔离Host比较组合。默认SSH停用不等其它远程组件全部停；未核网络身份、写入和恢复前不接账号/远端。不要只以能启动或侧栏有入口验收。

首次多依赖下载/Host服务/DOM兼容、持续整组更新/观察者/子包网络存储及维护，故障定位真实row与依赖版本，退出清profile/真实子包数据/连接的资源及工时都未知，不能按“全家桶”推节省。workspace与caret约束不等安装实际锁定，各子包停用并不自动卸依赖/撤数据。

布局错先停兼容row并刷新核data属性/滚动；功能故障停具体row再恢复备份或改独立包，核真正进程/远端请求/写入，旧shell日志只做线索。聚合卸载不被证明可自动还原子包已写状态，外部账号/数据的恢复/留存须独立验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/package.json:162-185](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/package.json#L162-L185)

多依赖及外部范围。

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
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.15",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.15",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.15",
    "@linxin666/dsh-pet": "^0.4.15"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:47-65](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L47-L65)

不同远程相关row。

<details>
<summary>查看原文（19行）</summary>

```text
# from ../dsh-agents
- insert:
    - id: web-ui-agents
      name: '@linxin666/dsh-agents'

# from ../dsh-remote-bridge
- insert:
    - id: web-ui-remote-bridge
      name: '@linxin666/dsh-remote-bridge'

# from ../dsh-task-board-remote
- insert:
    - id: web-ui-task-board-remote
      name: '@linxin666/dsh-task-board-remote'

# from ../dsh-ssh
- insert:
    - id: web-ui-ssh
      name: '@linxin666/dsh-ssh'
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:113-118](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L113-L118)

实际SSH/skill默认关闭。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 4 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:430-468](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/client/index.ts#L430-L468)

DOM写属性/根锁与实际副作用。

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

**依据 5 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:540-549](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/client/index.ts#L540-L549)

cleanup范围不含全部已写属性。

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 6 · 源码核查**：[packages/dsh-web-all/src/shell.ts:409-424](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/shell.ts#L409-L424)

旧shell清理失败继续与导入失败。

<details>
<summary>查看原文（16行）</summary>

```text
    if (mounted !== undefined) {
      const previous = mounted
      mounted = undefined
      try {
        await previous.dispose?.()
      } catch (error) {
        // A failed unmount must never keep the new config from mounting.
        console.warn('[dsh-web-all] unmounting the previous family plugin failed:', error)
      }
    }
    let mod: unknown
    try {
      mod = await import(/* @vite-ignore */ spec)
    } catch (error) {
      recordDegraded(spec, 'import', error)
      return
```

</details>

#### 缺口

- 真实安装/资源/维护节时、全子包权限/停用/恢复未知。
  **影响**：未满足有明确净收益的组合验收，不能推荐生产一键安装。
  **进一步探讨**：按需独立包作为基线，计配置/恢复/维护总人时，逐row验收再组合。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 比继续加包更有价值的组合方向如何证伪？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：以用户明确任务生成逐row需求/权限/默认状态/真实启动与退出收据，能减少把安装成功当功能验收、把旧壳等同现有隔离的误判。现有patch/manifest、插件管理器和ledger已有基础；增量必须是跨真实直接row的责任/副作用及恢复证据，不是假设所有子包共享隔离壳。

先和按需安装清单/现有插件管理器加说明的小修比较，固定一个组合需求，测试未需remote row、真实直接row启动失败、旧shell失败、禁用后DOM/远端状态残留。测多余启用、误报健康、配置/恢复时间和资源；若清单已足够或额外平台负担抵消收益则否定，不算已实现创新。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:47-65](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L47-L65)

直接row与远程能力需分开。

<details>
<summary>查看原文（19行）</summary>

```text
# from ../dsh-agents
- insert:
    - id: web-ui-agents
      name: '@linxin666/dsh-agents'

# from ../dsh-remote-bridge
- insert:
    - id: web-ui-remote-bridge
      name: '@linxin666/dsh-remote-bridge'

# from ../dsh-task-board-remote
- insert:
    - id: web-ui-task-board-remote
      name: '@linxin666/dsh-task-board-remote'

# from ../dsh-ssh
- insert:
    - id: web-ui-ssh
      name: '@linxin666/dsh-ssh'
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:113-118](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/cordis.patch.yml#L113-L118)

已有默认停用政策。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 3 · 源码核查**：[packages/dsh-web-all/src/shell.ts:419-443](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/shell.ts#L419-L443)

旧shell失败与实际覆盖范围。

<details>
<summary>查看原文（25行）</summary>

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
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:540-549](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-web-all/src/client/index.ts#L540-L549)

退出收据应核真实cleanup。

<details>
<summary>查看原文（10行）</summary>

```text
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

- 任务到row收据对误配/恢复人时的改善未验证。
  **影响**：方向不是现成依赖治理保证或业务机会证实。
  **进一步探讨**：现有管理器/清单对照并设多余启用与总人时反证门槛。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
