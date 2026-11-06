# @hyzyn/dsh-kit-settings

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings)

<!-- BEGIN META -->
[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 2,427](https://img.shields.io/static/v1?label=npm+30d&message=2%2C427&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-kit-settings) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-kit-settings)
<!-- END META -->

> **功能**：在 DSH 设置中提供插件配置宿主页，集中显示其他 kit 插件注册的配置卡片。

> **亮点**：相对逐个进入插件页，它将配置卡片放入统一设置宿主页，并保持供给方拥有表单逻辑。这是局部组合与导航便利，不是新配置引擎；净收益未知，见 [Q01](#research-q01)与[Q02](#research-q02)。

> **主要限制**：页面可加载不等于有卡片供给，更不等于配置保存正确。单装可能为空，其他插件仍须注册到指定子槽；重复入口也可能增加误选，见 [Q03](#research-q03)。

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
  - [Q01 · 谁需要第二个配置入口，相对原插件页增加什么？](#detail-section-11)
  - [Q02 · 页面如何注册并渲染卡片，出错会怎样？](#detail-section-12)
  - [Q03 · 为何单装可能为空，依赖与兼容边界是什么？](#detail-section-13)
  - [Q04 · 如何验证有用、退出及估计全周期成本？](#detail-section-14)
  - [Q05 · 是否有依据提出新的机制或产品假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 kit 插件用户可在设置页集中查找配置卡片；本包提供宿主页与组合入口，不提供卡片内部操作。用户习惯及替代办法见 [Q01](#research-q01)。

原办法是继续使用宿主插件页逐项配置。本包增加导航位置，不改变各卡片的配置字段与保存逻辑，也不声称原入口不可用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 插件配置宿主页 | 将已注册卡片集中显示 | 需要卡片供给，本包不生成配置功能 |
| 同步渲染错误提示 | 说明renderSlot抛错 | 不是全部异步或单卡片异常隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22.19.0与package声明的DSH版本 | 启动必需 | Loader与客户端发现 | 声明不等于本轮兼容验收 |
| React、ModuleLoader与slots | 页面必需 | 设置条目与子槽渲染 | Host日志不能证明界面加载 |
| 向settings.kit.item注册的卡片 | 有内容必需 | 提供实际配置表单 | 本包单独可能为空，不自动生成第三方表单 |
| locale服务 | 可选 | 中英语言目录 | 缺席时中文兜底 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户记下原插件页可访问的卡片 | 保留原入口作为对照 |
| 加载 | Host加载包，浏览器注册设置条目 | 设置页出现入口，不只看Host日志 |
| 查找 | 用户打开宿主页寻找同一卡片 | 空页先核对供给注册，不擅改配置 |
| 退出 | 用户停用本包并回到原插件页 | 检查条目和样式释放，本轮未实操 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包安装与客户端资源，金额未知 | 安装和核对卡片供给，耗时未知 | 必须已有需要的卡片 |
| 持续使用 | 客户端页面渲染，资源量未知 | 维护宿主兼容、识别重复入口 | 不据Host仅日志推算0成本 |
| 失败恢复 | 保留现有插件环境，金额未知 | 排查空槽或报错并回原入口 | 自同步try/catch不涵盖所有异步错误 |
| 退出 | 资源量未知 | 停用本包并核对页面移除 | 不改变各卡片自己的持久化规则 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集中入口 | 一行设置及列表子槽已接线 | 真实宿主显示和导航节时 |
| 配置正确性 | 页面转交卡片 | 各卡片保存、权限与状态一致性 |
| 异常提示 | 同步renderSlot抛错显示文本 | 异步错误隔离与空数组提示 |

> **思考**：页面可加载不等于有卡片供给，更不等于配置保存正确。单装可能为空，其他插件仍须注册到指定子槽；重复入口也可能增加误选，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对逐个进入插件页，它将配置卡片放入统一设置宿主页，并保持供给方拥有表单逻辑。这是局部组合与导航便利，不是新配置引擎；净收益未知，见 [Q01](#research-q01)与[Q02](#research-q02)。

把页面布局与卡片逻辑分离可减少表单复制；同步错误提示和样式effect清理有明确实现。但空态只检测null，子槽返回值及错误传播依赖宿主，不能宣称所有卡片异常均被隔离，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

页面可加载不等于有卡片供给，更不等于配置保存正确。单装可能为空，其他插件仍须注册到指定子槽；重复入口也可能增加误选，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有kit卡片的用户可以先只做查找任务，对照原插件页是否更容易找到正确表单。空页、误选或渲染报错出现时停用本入口并回原插件页；实际改配置仍按该卡片自己的边界处理。详细条件见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

宿主页注册与子槽渲染有源码支持；卡片供给、配置保存和导航节时未在本轮运行验证。没有新创新假设，不将后续导航观察当已有能力。

- 已检查：作者 README、包清单、源码路径 packages/kit-settings/README.md、packages/kit-settings/package.json、packages/kit-settings/cordis.patch.yml、packages/kit-settings/src/index.ts、packages/kit-settings/client.js 及固定范围 inventory；组件：packages/kit-settings。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已读本组件README、package、cordis补丁、Host TS与client.js全部逻辑。INVENTORY统计组件范围；没有用同仓其他插件的能力替代本包能力。
- 下一步：- 已检查固定版本源码。
- 未安装、运行目标代码或做真实宿主验收。
- 未验证其他供给卡片的保存逻辑，作者关于宿主迁移说明只作为背景。

**分析版本**

- **仓库**：[hyzyn/dsh-plugin-kit](https://github.com/hyzyn/dsh-plugin-kit)
- **版本号**：0.2.9（[固定提交 44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

本轮未形成新机制或产品假设。先比较原入口与集中入口的真实导航任务，若原入口同样快且更少误选，就应停止扩展入口功能；依据及边界见 [Q05](#research-q05)。

- 已检查固定版本源码。
- 未安装、运行目标代码或做真实宿主验收。
- 未验证其他供给卡片的保存逻辑，作者关于宿主迁移说明只作为背景。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 190 | 117 | 56 | — |
| .md | source | 1 | 49 | — | — | 557 |
| .ts | source | 1 | 28 | 5 | 20 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/hyzyn/dsh-plugin-kit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：配置宿主页是否为已有kit插件用户提供有用入口，入口存在与配置生效有何边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要第二个配置入口，相对原插件页增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它适合已经使用 kit 插件、习惯在设置页集中查看表单的人。作者把它定位为替代导航入口，简单基线是继续到宿主侧栏插件页配置。实际增量是一行设置大类及一个子槽，其他插件的卡片在这里被组合；它没有生成新的配置字段，也没有实现这些卡片的后台保存。

合格结果是用户在同一页找到已安装插件的卡片，并能与原入口识别为同一项设置；是否更少点击或更易理解没有测量。对只装一个插件或已经习惯原入口的人，多装一个入口可能只增加导航重复。README称两种入口指向同一配置，但本次只核实此宿主页的转交机制，不以这段说明代替每个卡片状态一致性的检查。

#### 证据与依据

**依据 1 · 作者声明**：[packages/kit-settings/README.md:3-12](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/README.md#L3-L12)

作者定位为习惯性设置入口。

<details>
<summary>查看原文（10行）</summary>

```text
在 DSH Web GUI 里补一行**「插件配置」页**，把 dsh-plugin-kit 插件族的配置表单收在一处。

## 为什么需要它

DSH ≥ `0.1.6-alpha.2` 把插件配置从「设置 → 插件 → 插件配置」搬到了侧边栏的「插件」页，
设置里那一行只剩只读清单（官方 `settings.plugin.item` 插槽已退役，见
[官方设计笔记](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/architecture/2026-09-16-plugin-configuration-on-the-plugins-page.zh.md)）。

如果你更习惯「设置里一行、点开就是各插件配置」的形态，装上本包即可恢复：它是官方支持的
`settings.section` 扩展点（官方的「通用设置 / 模型 / 内置插件 / Agent 预设 / 已归档会话」
```

</details>

**依据 2 · 作者声明**：[packages/kit-settings/README.md:20-34](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/README.md#L20-L34)

单包是宿主页，卡片来自其他插件。

<details>
<summary>查看原文（15行）</summary>

```text

单独装本包不会显示任何卡片——它只是一个**宿主页**。各插件把自己的配置卡片注册进本页声明的
子 slot `settings.kit.item`，所以：

- 装了本包 + 任意 kit 插件 → 设置里出现「插件配置」行，行内是该插件的卡片；
- 只装 kit 插件、不装本包 → 设置里没有这一行（插件照常工作，配置走侧边栏「插件」页）；
- 只装本包、不装任何 kit 插件 → 这一行会显示「暂无可用配置项」。

装 `@hyzyn/dsh-all` 全家桶会自动带上本包。

## 两种配置入口的关系

kit 插件同时提供两个入口，指向**同一份配置**：

| 入口 | 位置 | 形态 |
```

</details>

**依据 3 · 源码核查**：[packages/kit-settings/client.js:98-110](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/client.js#L98-L110)

页面将内容渲染交给子槽，无自有配置表单。

<details>
<summary>查看原文（13行）</summary>

```text
    function KitSettingsSection(props) {
      const renderSlot = props === undefined ? undefined : props.renderSlot
      let body = null
      if (typeof renderSlot === 'function') {
        try {
          body = renderSlot('settings.kit.item')
        } catch (error) {
          body = jsx('p', {
            className: 'kit_note',
            children: t('error.render') + String((error && error.message) || error),
          })
        }
      }
```

</details>

#### 缺口

- 没有已有用户导航任务的对照。
  **影响**：无法确认入口是否减少反复查找负担。
  **进一步探讨**：让已有kit用户分别从原插件页和宿主页找到同一设置，记录耗时和误选。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 页面如何注册并渲染卡片，出错会怎样？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host入口只导出名称、空依赖和一条加载日志；可见功能来自客户端。客户端经ModuleLoader导出apply，要求slots服务，然后向settings.section注册id为kit的条目，并在children里声明root范围的settings.kit.item列表子槽。KitSettingsSection通过props.renderSlot调用该子槽，将返回内容放到列表中。

渲染函数同步抛错会被捕获并显示错误文字；这不是每个子卡片的独立React错误边界，也不能证明异步渲染或事件处理异常都被隔离。无renderSlot时body保持null并显示空提示；如果宿主返回空数组而非null，当前分支会显示空列表而不是提示。这是返回值契约边界，未在宿主复现。样式通过effect插入且有移除回调，语言服务缺席有中文兜底。实现的可借鉴点是页面只拥有布局与槽、具体卡片由供给者负责，避免复制每个插件表单。

#### 证据与依据

**依据 1 · 源码核查**：[packages/kit-settings/src/index.ts:19-28](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/src/index.ts#L19-L28)

Host入口没有额外运行能力。

<details>
<summary>查看原文（10行）</summary>

```text
/** 稳定插件 id：等于 cordis.patch.yml 中 insert 行的 id。 */
export const name = 'kit-settings'

/** 不依赖任何宿主服务。 */
export const inject: string[] = []

/** 挂载：只在宿主日志留一行，方便排查「设置里那一行为什么没出现」。 */
export function apply(): void {
  console.log('[dsh-kit-settings] mounted（设置里的「插件配置」页由浏览器半体提供）')
}
```

</details>

**依据 2 · 源码核查**：[packages/kit-settings/client.js:98-131](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/client.js#L98-L131)

同步try/catch与严格body===null空态分支。

<details>
<summary>查看原文（34行）</summary>

```text
    function KitSettingsSection(props) {
      const renderSlot = props === undefined ? undefined : props.renderSlot
      let body = null
      if (typeof renderSlot === 'function') {
        try {
          body = renderSlot('settings.kit.item')
        } catch (error) {
          body = jsx('p', {
            className: 'kit_note',
            children: t('error.render') + String((error && error.message) || error),
          })
        }
      }
      return jsxs('section', {
        className: 'kit_section',
        children: [
          jsxs('header', {
            className: 'kit_head',
            children: [
              jsx('h2', { className: 'kit_title', children: t('section.title') }),
              jsx('p', {
                className: 'kit_intro',
                children: t('section.intro'),
              }),
            ],
          }),
          jsx('ul', {
            className: 'kit_list',
            children: body === null
              ? jsx('li', { className: 'kit_note', children: t('list.empty') })
              : body,
          }),
        ],
      })
```

</details>

**依据 3 · 源码核查**：[packages/kit-settings/client.js:136-159](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/client.js#L136-L159)

注册settings.section与root子槽，样式提供清理回调。

<details>
<summary>查看原文（24行）</summary>

```text
    exports.inject = ['slots']

    exports.apply = (ctx) => {
      installI18n(ctx)
      ctx.effect(() => {
        ensureStyle()
        return () => {
          styleEl?.remove()
          styleEl = undefined
        }
      })
      // 设置里的一行大类，与「通用设置」平级。
      // 官方契约：`settings.section` 是 list slot，注册项带 id / order / label；
      // 子 slot 通过本次注册的 children 声明，声明即拥有（只有本注册能渲染它）。
      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'kit',
        // 15 = 官方「内置插件」，20 = 「Agent 预设」；16 让本行紧随内置插件之后。
        order: 16,
        label: () => t('section.title'),
        children: {
          'settings.kit.item': { kind: 'list', scope: 'root' },
        },
      }, KitSettingsSection))
```

</details>

**依据 4 · 源码核查**：[packages/kit-settings/client.js:74-90](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/client.js#L74-L90)

中文兜底与locale注册/释放。

<details>
<summary>查看原文（17行）</summary>

```text
    }

    let t = i18nFallback

    /** 注册目录并绑定翻译函数（动态 inject：老宿主上保持中文兜底，卡片照挂）。 */
    function installI18n(ctx) {
      ctx.inject(['locale'], (i18nCtx) => {
        const disposeZh = i18nCtx.locale.register(I18N_NS, 'zh', I18N_ZH)
        const disposeEn = i18nCtx.locale.register(I18N_NS, 'en', I18N_EN)
        t = i18nCtx.locale.bind(I18N_NS)
        return () => {
          disposeEn()
          disposeZh()
          t = i18nFallback
        }
      })
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为何单装可能为空，依赖与兼容边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

本包可以声明并显示宿主页，但页面内容需要其他插件确实向settings.kit.item注册。单装不会凭空发现任意第三方配置，也不会从package元数据自动生成表单；README的插件族介绍不是已检查的卡片清单。本轮只给页面与子槽两项正向能力，不把其他包的配置、网络或管理操作计入本组件。

package声明Node>=22.19.0、宿主peer范围及React，bundle补丁挂Host，web client由宿主发现。Host日志出现不能证明浏览器已取到client、slots注入成功或卡片已注册。root子槽是同一宿主页面级组织，不提供逐用户权限隔离；每张卡片能改什么仍由供给者和宿主决定。若只有空页，应先区分宿主页是否加载、是否有卡片供给和供给注册是否与该槽一致，不能直接判整个插件族不可用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/kit-settings/package.json:6-35](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/package.json#L6-L35)

运行时、bundle/client与peer依赖声明。

<details>
<summary>查看原文（30行）</summary>

```text
  "engines": {
    "node": ">=22.19.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "engines": {
      "dsh": ">=0.1.7-rc.2"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": "^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.0-rc.2 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-alpha.5 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.3 || ^0.2.2-rc.1",
    "react": "^18.2.0"
  },
```

</details>

**依据 2 · 源码核查**：[packages/kit-settings/cordis.patch.yml:5-7](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/cordis.patch.yml#L5-L7)

Host挂载行。

```text
- insert:
    - id: kit-settings
      name: '@hyzyn/dsh-kit-settings'
```

**依据 3 · 源码核查**：[packages/kit-settings/client.js:150-159](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/client.js#L150-L159)

唯一被此页面声明的卡片入口。

<details>
<summary>查看原文（10行）</summary>

```text
      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'kit',
        // 15 = 官方「内置插件」，20 = 「Agent 预设」；16 让本行紧随内置插件之后。
        order: 16,
        label: () => t('section.title'),
        children: {
          'settings.kit.item': { kind: 'list', scope: 'root' },
        },
      }, KitSettingsSection))
```

</details>

**依据 4 · 作者声明**：[packages/kit-settings/README.md:20-28](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/README.md#L20-L28)

作者明确单装为空的条件。

```text

单独装本包不会显示任何卡片——它只是一个**宿主页**。各插件把自己的配置卡片注册进本页声明的
子 slot `settings.kit.item`，所以：

- 装了本包 + 任意 kit 插件 → 设置里出现「插件配置」行，行内是该插件的卡片；
- 只装 kit 插件、不装本包 → 设置里没有这一行（插件照常工作，配置走侧边栏「插件」页）；
- 只装本包、不装任何 kit 插件 → 这一行会显示「暂无可用配置项」。

装 `@hyzyn/dsh-all` 全家桶会自动带上本包。
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证有用、退出及估计全周期成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可以在已有兼容DSH和kit卡片的环境里做小范围入口试用，核心观察是“能否更快找到正确配置”，而不是一次加载就升级为效果证明。先从原入口记下要找的卡片，再打开设置页检查相同卡片出现；实际改配置应遵循该卡片自己的权限和恢复办法，不能用宿主页试用授权扩大到业务写入。

本包自有路径主要为客户端渲染与样式，不在Host入口中写持久配置或发起模型调用，因此首次负担集中在安装和确认页面，持续负担是额外界面与版本兼容。现金、内存及人工时间均未测量，不写免费或零成本。若页面无卡片、重复入口造成误选或宿主报错，就停用该包并继续原插件页；样式有明确清理回调，但槽回收和真实禁用仍需依赖宿主生命周期，本轮未实际验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/kit-settings/src/index.ts:19-28](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/src/index.ts#L19-L28)

Host实际工作只有日志。

<details>
<summary>查看原文（10行）</summary>

```text
/** 稳定插件 id：等于 cordis.patch.yml 中 insert 行的 id。 */
export const name = 'kit-settings'

/** 不依赖任何宿主服务。 */
export const inject: string[] = []

/** 挂载：只在宿主日志留一行，方便排查「设置里那一行为什么没出现」。 */
export function apply(): void {
  console.log('[dsh-kit-settings] mounted（设置里的「插件配置」页由浏览器半体提供）')
}
```

</details>

**依据 2 · 源码核查**：[packages/kit-settings/client.js:136-159](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/client.js#L136-L159)

本组件自己管理的样式与注册范围。

<details>
<summary>查看原文（24行）</summary>

```text
    exports.inject = ['slots']

    exports.apply = (ctx) => {
      installI18n(ctx)
      ctx.effect(() => {
        ensureStyle()
        return () => {
          styleEl?.remove()
          styleEl = undefined
        }
      })
      // 设置里的一行大类，与「通用设置」平级。
      // 官方契约：`settings.section` 是 list slot，注册项带 id / order / label；
      // 子 slot 通过本次注册的 children 声明，声明即拥有（只有本注册能渲染它）。
      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'kit',
        // 15 = 官方「内置插件」，20 = 「Agent 预设」；16 让本行紧随内置插件之后。
        order: 16,
        label: () => t('section.title'),
        children: {
          'settings.kit.item': { kind: 'list', scope: 'root' },
        },
      }, KitSettingsSection))
```

</details>

**依据 3 · 作者声明**：[packages/kit-settings/README.md:22-34](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/README.md#L22-L34)

原插件页仍是作者说明的替代入口。

<details>
<summary>查看原文（13行）</summary>

```text
子 slot `settings.kit.item`，所以：

- 装了本包 + 任意 kit 插件 → 设置里出现「插件配置」行，行内是该插件的卡片；
- 只装 kit 插件、不装本包 → 设置里没有这一行（插件照常工作，配置走侧边栏「插件」页）；
- 只装本包、不装任何 kit 插件 → 这一行会显示「暂无可用配置项」。

装 `@hyzyn/dsh-all` 全家桶会自动带上本包。

## 两种配置入口的关系

kit 插件同时提供两个入口，指向**同一份配置**：

| 入口 | 位置 | 形态 |
```

</details>

#### 缺口

- 未测宿主禁用后的槽回收及导航净收益。
  **影响**：只支持入口级试用，不保证全生命周期无残留或提高效率。
  **进一步探讨**：在可恢复profile内对照导航任务，并在禁用后检查设置项与样式是否消失。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 是否有依据提出新的机制或产品假设？

**研究主题**：新假设与验证

#### 完整回答

本轮未形成新的机制创新或可行产品方向。现有事实只支持一个可组合的设置宿主页，核心取舍是便利入口与导航重复；没有用户找不到配置的独立案例或误操作数据，不能由空槽和聚合能力推断市场需求。

最有价值的后续材料是具体导航任务对照，先判断集中入口究竟降低查找负担还是增加歧义。若原入口同样快且更少误选，就没有依据再增加自动分类、推荐或配置批量写入。这里给的是研究停止条件，不把候选设想计入插件已实现贡献。

#### 证据与依据

**依据 1 · 源码核查**：[packages/kit-settings/client.js:98-131](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/client.js#L98-L131)

页面只组合子槽内容，没有新的配置决策机制。

<details>
<summary>查看原文（34行）</summary>

```text
    function KitSettingsSection(props) {
      const renderSlot = props === undefined ? undefined : props.renderSlot
      let body = null
      if (typeof renderSlot === 'function') {
        try {
          body = renderSlot('settings.kit.item')
        } catch (error) {
          body = jsx('p', {
            className: 'kit_note',
            children: t('error.render') + String((error && error.message) || error),
          })
        }
      }
      return jsxs('section', {
        className: 'kit_section',
        children: [
          jsxs('header', {
            className: 'kit_head',
            children: [
              jsx('h2', { className: 'kit_title', children: t('section.title') }),
              jsx('p', {
                className: 'kit_intro',
                children: t('section.intro'),
              }),
            ],
          }),
          jsx('ul', {
            className: 'kit_list',
            children: body === null
              ? jsx('li', { className: 'kit_note', children: t('list.empty') })
              : body,
          }),
        ],
      })
```

</details>

**依据 2 · 源码核查**：[packages/kit-settings/client.js:150-159](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit-settings/client.js#L150-L159)

实现限定于一行设置与列表槽。

<details>
<summary>查看原文（10行）</summary>

```text
      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'kit',
        // 15 = 官方「内置插件」，20 = 「Agent 预设」；16 让本行紧随内置插件之后。
        order: 16,
        label: () => t('section.title'),
        children: {
          'settings.kit.item': { kind: 'list', scope: 'root' },
        },
      }, KitSettingsSection))
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
