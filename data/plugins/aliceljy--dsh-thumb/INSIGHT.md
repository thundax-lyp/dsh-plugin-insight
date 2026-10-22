# dsh-thumb

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[cde1359](https://github.com/AliceLJY/dsh-thumb/tree/cde135922e5fdd8729b163c634dd811294555d36)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb)
<!-- END META -->

> **实现功能**：将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。

> **核心亮点**：集中语义定位、自有样式标记和公共layout关闭接口，把成熟抽屉模式接到DSH；以未被自身CSS覆盖的上游意图判断展开是可借鉴处，免hash不等于免DOM耦合。详见[Q02](#research-q02)。

> **风险与缺陷**：定位只取首个匹配且逐节点打标，没有唯一性和整体健康门控；语义后缀会改名，热卸载清理还存在静态边界。未复现误匹配或残留，不能据此称升级安全。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 手机使用者实际获得什么，合格结果是什么？](#detail-section-11)
  - [Q02 · 语义定位、状态检测、抽屉和关闭如何实现？](#detail-section-12)
  - [Q03 · 免hash是否消除兼容风险，可借鉴什么？](#detail-section-13)
  - [Q04 · 安装、关闭、恢复的条件及负担是什么？](#detail-section-14)
  - [Q05 · 布局收益和全程成本有什么证据？](#detail-section-15)
  - [Q06 · 后续可探索什么，以及适合谁采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人手机或平板用户在窄屏DSH web切会话、阅读与改设置；需要抽屉能关且轨迹与桌面不受误伤。

手动折叠侧栏、使用宽屏或调整原生宿主布局是直接替代；插件增加会话切换后的自动收起和集中手机样式。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 覆盖式侧栏 | 展开时避免挤压聊天列 | max-width 1023px与展开状态，依赖列定位 |
| 遮罩和自动关闭 | 点遮罩或会话后收起侧栏 | 调layout.toggleSidebar，依赖行语义识别 |
| 手机设置布局 | 单列全屏设置并限制溢出 | 设置叠层启发式匹配，导航不完全横排 |
| 对话密度 | 缩文字、间距和动作按钮 | 仅窄屏FLOW范围，24px触控目标是取舍 |
| 加载前关闭 | URL或localStorage停用并重载 | 不是实时撤销已有全局样式 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH web客户端模块加载器、React | 启动必需 | 注册客户端与渲染overlay | 纯宿主/CLI不会得到界面功能 |
| client-runtime、client-ui-layout包 | 包清单声明必需 | 模块加载顺序 | 与服务注入名称不可混用 |
| slots、layout服务 | 客户端注入必需 | 挂overlay和关闭侧栏 | 入口可能等待服务，关闭接口不可用 |
| 语义后缀、frame内联网格 | 效果必需 | 标记节点和检测展开 | 上游结构变化需调整定位器 |
| matchMedia、MutationObserver、rAF、CSS :has | 分支需要 | 窄屏监听、DOM同步和密度范围 | :has不可用时对应密度规则不生效；其他兼容未核实 |
| GitHub来源 | 作者分发路径 | 获取private包的仓库版本 | 不按npm包存在推断可用性 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 用户按固定GitHub来源加入web profile并重启 | bundle存在且客户端服务激活 |
| 使用 | 窄屏展开侧栏、点目标会话或遮罩 | 会话正确切换、抽屉可关、聊天可读 |
| 临时关闭 | 加?thumb=0或localStorage置0后重载 | CSS与打标在加载前检查disabled |
| 退出恢复 | 移除bundle并重启，必要时核对node_modules链接 | 只还原package.json可能留下链接状态 |

作者不承诺维护或Issue响应，适配责任需由用户考虑。不能把“改四个定位器只需几分钟”的作者估计写成保证。开关是在URL/存储读取并重新加载时生效，没有专门的实时设置订阅。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地宿主和浏览器资源，现金未知 | 安装、重启、确认bundle与目标布局 | 作者8.9秒冷安装不是本轮测量，也非通用耗时 |
| 持续使用 | 全body观察及设置扫描的CPU/布局开销未测 | 适应密度和24px按钮，检查误触 | 没有真实用户任务成本数据 |
| 失败恢复 | 重新加载和安装链接修复的资源未知 | 用开关退回原生、核对定位器或移除 | 作者不承诺长期维护，耗时未知 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 抽屉及自动关闭 | CSS和公共layout调用可查；作者报告窄屏宽度收益 | 本次没有独立复测或任务正确率 |
| 更紧凑正文 | CSS设14px/21px与10px间距；作者报告高度610降至490px | 阅读速度、疲劳和触控错误代价 |
| 桌面范围 | 样式在max-width 1023px内；作者报告1440px回归 | 所有桌面缩放/浏览器下兼容性 |

smoke源码有具体布局断言及开关对照，但若没有现有会话会跳过密度断言，脚本存在也不是完整通过证据。本轮只读脚本，既没有将作者报告转成host_acceptance，也没有执行宿主冒烟。不能用列宽增幅替代端到端效率或收益率。

> **思考**：定位只取首个匹配且逐节点打标，没有唯一性和整体健康门控；语义后缀会改名，热卸载清理还存在静态边界。未复现误匹配或残留，不能据此称升级安全。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：集中语义定位、自有样式标记和公共layout关闭接口，把成熟抽屉模式接到DSH；以未被自身CSS覆盖的上游意图判断展开是可借鉴处，免hash不等于免DOM耦合。详见[Q02](#research-q02)。

集中语义定位、自有样式标记和公共layout关闭接口，把成熟抽屉模式接到DSH；以未被自身CSS覆盖的上游意图判断展开是可借鉴处，免hash不等于免DOM耦合。详见[Q02](#research-q02)。

免完整hash没有消除DOM契约风险。LOCATORS仍依赖class子串，stampFrame用querySelector取得第一个匹配，没有注释所说的唯一性判定，也没有歧义时停止或报警。缺少某个匹配只是不打标；若部分frame/sidebar匹配成功、其他列未匹配，可能只应用一部分布局规则。因此不能把“集中定位”提升成“升级失败会可靠暴露”的保证。作者已记录detailsCol变为rightbarCol的适配，说明语义后缀也会改名。

设置定位每次遍历div/section/dialog，计算样式和几何，再选全视口fixed flex且含_nav的第一个容器。这个启发式比全局_nav更窄，但仍可能遇到另一个满足条件的叠层。观察器监听整个body的子树、style和class变化，rAF合并避免同帧重复调度，却不证明长对话下没有明显开销。

值得借鉴的是意图与渲染值解耦、FLOW把密度规则限制在包含消息的列、观察器和resize/rAF在React cleanup中释放。边界是全局style和data-thumb标记在所读清理路径中没有删除，运行中卸载后是否残留密度样式不能仅凭cleanup推定；完整刷新和加载前关闭开关更明确。按钮缩到24px、提示溢出与设置导航不完全横排是作者明确承认的取舍。这里未复现误匹配或卸载残留。

<a id="detail-section-5"></a>

### 1.4 主要限制

定位只取首个匹配且逐节点打标，没有唯一性和整体健康门控；语义后缀会改名，热卸载清理还存在静态边界。未复现误匹配或残留，不能据此称升级安全。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人窄屏用户可受控试用，先检查会话切换、设置与轨迹，保留?thumb=0后重载的退出路径；定位或触控出现影响任务的问题就停用。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

现有贡献为源码支持的布局与状态接线；作者像素测量未独立复测；健康门控为未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、src/client.js、cordis.patch.yml、test/smoke.mjs、test/measure-widths.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码阅读客户端主链路、空宿主入口、包清单、README及测量/冒烟脚本；作者运行数据不转写为本轮执行，未运行目标代码。
- 下一步：进一步探讨可从重复/缺失DOM节点和开关恢复的故障输入入手，再用同文本真实阅读任务比较误触、理解与主线程成本。

**分析版本**

- **仓库**：[AliceLJY/dsh-thumb](https://github.com/AliceLJY/dsh-thumb)
- **版本号**：0.1.0（[固定提交 cde1359](https://github.com/AliceLJY/dsh-thumb/tree/cde135922e5fdd8729b163c634dd811294555d36)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索定位器组合完整性与唯一性检查，通过故障输入比较部分样式污染、误伤和探测开销；当前未实现，不把这个设想计入现有贡献。详见[Q06](#research-q06)。

进一步探讨可从重复/缺失DOM节点和开关恢复的故障输入入手，再用同文本真实阅读任务比较误触、理解与主线程成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 276 | — | — | 4922 |
| .js | source | 2 | 483 | 262 | 190 | — |
| .mjs | test | 2 | 335 | 236 | 82 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb/issues?q=is%3Aissue+created%3A2026-09-22T04%3A45%3A48.993Z..2026-10-22T04%3A45%3A48.993Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A45%3A48.993Z..2026-10-22T04%3A45%3A48.993Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本移动侧栏壳的集成贡献、兼容边界与个人采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手机使用者实际获得什么，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向用手机浏览器访问DSH web、需要切换会话和读长对话的人。作者描述原侧栏展开后占用固定宽度，导致中心聊天列狭窄；插件把它改成覆盖式抽屉，选择会话后自动关闭，同时把设置面板改成手机单列并压缩正文密度。合格结果不是抽屉出现，而是能切到目标会话、关闭侧栏、继续阅读和使用设置，且相邻轨迹页面和桌面布局不被破坏。

原有办法是手工折叠侧栏、换用宽屏或调整宿主本身布局。插件的实际增量是减少切会话后再手工关侧栏的步骤，并避免抽屉展开时挤压中心列。它没有新增Agent、模型或任务执行能力。1023px以下视口才应用CSS，抽屉布局又要求侧栏展开；密度规则则在窄屏、抽屉关闭时也生效，不能把所有样式都说成只影响展开状态。

README中的393px、113px和337px有具体测量情境，但属于作者数据。抽屉打开时保留完整中心列与切会话后保留56px图标轨是两个不同测量阶段，不应混用为同一指标。对需要更大触控目标、辅助阅读或其他宿主布局的人，紧凑密度未必有净收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-31](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/README.md#L13-L31)

作者给出手机场景、展开侧栏和测量条件。

<details>
<summary>查看原文（19行）</summary>

```text
On a phone, dsh's **first screen is fine** — the sidebar auto-collapses to a 56px icon rail and the composer fits. Everything breaks only after the sidebar is expanded, which happens to be the one path you must take to switch sessions.

Measured on an iPhone 14 Pro viewport (393×660), dsh `0.1.0-rc.6`, before this plugin:

| Situation | Before | After |
|---|---|---|
| Collapsed rail | fine | **untouched** |
| Sidebar expanded | takes 71% of the screen and **squeezes** chat to 113px | overlays; chat keeps its full **393px** |
| After tapping a session | stays open, so you read in the 113px slot | closes itself |
| Dismissing it | only via the collapse button | tap anywhere on the scrim |
| Settings sheet | 800px two-column layout crammed into 393px; every English word wraps; value pickers fall off-screen | full-screen single column, text wraps normally, pickers on-screen |
| Clipped elements in settings | 7 | 1 |
| Transcript height (3-turn session) | 610px — sized for a desktop reading distance | **490px**, a fifth shorter |

This is not a bug upstream — it is a stated contract. From the column solver in `@deepseek-ai/dsh-client-ui-layout`:

> The sidebar never concedes: its rendered width is always the drag preference (or the collapsed rail), and **center absorbs any remaining deficit as the last resort**.

With `SIDEBAR_DEFAULT = 280`, a 393px viewport gives exactly `393 − 280 = 113`. The concession chain shrinks the details panel, then closes it, and then the center column eats whatever is left. Reasonable in a narrow desktop window with a few hundred pixels to spare; not on a phone.
```

</details>

**依据 2 · 作者声明**：[README.md:78-95](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/README.md#L78-L95)

明确到达会话后的宽度与密度例外，作者数据不冒充独立测量。

<details>
<summary>查看原文（18行）</summary>

```text
What matters is the state you are left in *after tapping a session*, since that is the path you have to take to switch sessions. Stock leaves the sidebar open, so the transcript stays at `width − 280`. The shell closes it, leaving the 56px rail and `width − 56`:

| viewport | stock | with the shell | gain |
|---:|---:|---:|---:|
| 393px | 113px | 337px | **+198%** |
| 480px | 200px | 424px | +112% |
| 604px | 324px | 548px | +69% |
| 768px | 488px | 712px | **+46%** |
| 900px | 620px | 844px | +36% |
| 1023px | 743px | 967px | **+30%** |

Regenerate that table with `node test/measure-widths.mjs`; the file also explains why it measures the width you are left with rather than the width the drawer covers, which is what the first attempt got wrong.

The gain shrinks with width, as expected — but it never inverts anywhere inside the supported range. Lowering the breakpoint would switch off something still worth 30–46% at the sizes it was supposed to help. The 1023px breakpoint stays.

**The density rules are the one deliberate exception**: they apply at ≤1023px with the drawer shut, because that is the state you read a transcript in. On the measured session that is 610px of column down to 490px — 60px of it from the gap between turns alone (16px → 10px), which costs nothing to interact with. Body text goes 16px/28px → 14px/21px and the action buttons 28px → 24px; the buttons were already under the 44px iOS touch target, so that last one is a trade, and `--thumb-hit` at the top of the stylesheet puts it back.

Desktop is verified unchanged: sidebar 280px, center 1160px, `position: static`, no scrim, settings still an 800px two-column sheet.
```

</details>

**依据 3 · 源码核查**：[src/client.js:217-240](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L217-L240)

14px正文和窄屏密度规则并不依赖drawer open属性。

<details>
<summary>查看原文（24行）</summary>

```text
  :root {
    --thumb-text: 14px;
    --thumb-leading: 1.5;
    --thumb-meta: 12px;
    --thumb-turn-gap: 10px;
    /* Action buttons ship at 28px, already under the 44px iOS touch target.
       24px is the deliberate trade: it buys 6px on every assistant turn at the
       cost of a slightly smaller tap area. Raise it back to 28px here if the
       buttons start getting missed. */
    --thumb-hit: 24px;
  }

  /* The single biggest win, and the one with no interaction cost: the gap
     between turns. 16px -> 10px is 60px back on a three-turn session.
     Scoped through FLOW like everything else here; if :has() is ever
     unavailable the whole block drops out and the transcript returns to
     upstream sizing, which is the right way for it to fail. */
  ${FLOW} {
    gap: var(--thumb-turn-gap) !important;
  }

  ${FLOW} [class*="_markdown"] {
    font-size: var(--thumb-text) !important;
    line-height: var(--thumb-leading) !important;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 语义定位、状态检测、抽屉和关闭如何实现？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

插件由空宿主入口确保客户端模块被扫描，实际逻辑在__ModuleLoader__注册的客户端工厂。apply注入shell.overlay，等待slots和layout服务，加载CSS并挂载ThumbShell。运行时按LOCATORS寻找frame/sidebar/center/details，打data-thumb标记；CSS只针对自己的标记和窄屏媒体查询。

侧栏是否展开读取frame内联grid-template-columns的第一轨，而非已经被插件CSS改成固定宽度的sidebar盒子。这样判断输入与自身样式副作用分离，避免“覆盖成320px后永远判断展开”的自锁。MutationObserver与resize事件经requestAnimationFrame合并，刷新标记和展开状态，再把data-thumb-drawer反映到html。遮罩按钮以及会话行点击都调用layout.toggleSidebar，后者延迟160ms并排除项目分组行。

贡献是对成熟响应式抽屉模式的局部集成。用语义后缀集中定位、再以自有属性写CSS，减少依赖完整CSS Modules hash；读取上游意图而非自身改写的渲染值是一项可复用设计。关闭行为使用公共layout接口，比模拟点击按钮更少依赖控件结构。但CSS后缀、frame内联布局和会话行类名仍耦合上游，不构成完全公开API适配。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1-2](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/index.js#L1-L2)

宿主入口为空，实际能力是客户端界面。

```text
/** Host loader entry. Client-only plugin — the shell lives in src/client.js. */
export function apply() {}
```

**依据 2 · 源码核查**：[src/client.js:60-89](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L60-L89)

集中定位器及限定对话流的FLOW选择器。

<details>
<summary>查看原文（30行）</summary>

```text
		const LOCATORS = {
			frame: '[class*="_frame"]',
			sidebar: '[class*="sidebarCol"]',
			center: '[class*="centerCol"]',
			details: '[class*="rightbarCol"], [class*="detailsCol"]',
		};

		/** Settings sheet parts, resolved only while the sheet is mounted. */
		const SETTINGS_LOCATORS = {
			'settings-panel': '[class*="_panel"]',
			'settings-nav': '[class*="_nav"]',
			'settings-content': '[class*="_content"]',
		};

		/**
		 * Scope for every density rule below.
		 *
		 * The center pane mounts more than the transcript — the trace view lives
		 * there too, with its own toolbar of buttons. Selectors written against
		 * message parts therefore have to say so, or they reach the trace view as
		 * well. That is not hypothetical: a first cut of these rules sized
		 * `[class*="_actions"] > button` to 24px square, which is right for the
		 * icon buttons under a reply and wrong for the trace toolbar's text
		 * buttons, which collapsed into an unreadable overlap. Reported from a
		 * phone, and only then reproduced here.
		 *
		 * The column is identified by the message items it holds rather than by
		 * its own class, since `_column` alone is not unique to it.
		 */
		const FLOW = '[data-thumb="center"] [class*="_column"]:has([class*="_flowItem"])';
```

</details>

**依据 3 · 源码核查**：[src/client.js:359-377](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L359-L377)

内联第一轨检测及媒体查询生命周期。

<details>
<summary>查看原文（19行）</summary>

```text
		function sidebarIsExpanded() {
			const frame = document.querySelector('[data-thumb="frame"]') || document.querySelector(LOCATORS.frame);
			if (!frame) return false;
			const firstTrack = String(frame.style.gridTemplateColumns || '').trim().split(/\s+/)[0];
			const px = Number.parseFloat(firstTrack);
			return Number.isFinite(px) && px > RAIL_PX + 4;
		}

		function useIsPhone() {
			const [phone, setPhone] = React.useState(
				() => typeof window !== 'undefined' && window.matchMedia(PHONE_MQ).matches && !disabled(),
			);
			React.useEffect(() => {
				if (typeof window === 'undefined') return undefined;
				const mq = window.matchMedia(PHONE_MQ);
				const update = () => setPhone(mq.matches && !disabled());
				update();
				mq.addEventListener('change', update);
				return () => mq.removeEventListener('change', update);
```

</details>

**依据 4 · 源码核查**：[src/client.js:432-475](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L432-L475)

会话自动关闭、shell overlay注册及服务注入。

<details>
<summary>查看原文（44行）</summary>

```text
			React.useEffect(() => {
				if (!phone) return undefined;
				const onTap = (e) => {
					const target = e.target;
					if (!(target instanceof Element)) return;
					const row = target.closest('[role="treeitem"]');
					if (!row) return;
					const cls = typeof row.className === 'string' ? row.className : '';
					if (!/sessionRow|searchResultRow/.test(cls)) return;   // project/group rows: leave open
					if (row.closest('[data-thumb="sidebar"]') === null) return;
					setTimeout(() => { if (sidebarIsExpanded()) closeDrawer?.(); }, 160);
				};
				document.addEventListener('click', onTap, true);
				return () => document.removeEventListener('click', onTap, true);
			}, [phone, closeDrawer]);

			if (!phone || !open) return null;
			return jsx('button', {
				type: 'button',
				className: 'dsh-thumb-scrim',
				'aria-label': 'Close sidebar',
				onClick: () => closeDrawer?.(),
			});
		}

		function apply(ctx) {
			ensureStyle();
			ctx.slots.inject('shell.overlay', () => ctx.slots.register({
				name: 'shell.overlay',
				id: 'dsh-thumb',
				inject: () => ({ closeDrawer: () => ctx.layout?.toggleSidebar?.() }),
			}, ThumbShell));
		}

		/**
		 * Cordis SERVICE names — not package names. The two `inject` fields in this
		 * plugin look alike and mean different things: package.json's
		 * `dsh.client.inject` lists packages (module load order), while this one
		 * lists services the apply world waits for. Getting it wrong does not fail
		 * loudly at the plugin level: the entry just never activates, and the shell
		 * reports "web boot: 1 entry did not activate" while the whole page stays
		 * blank. Mirrors what ui-sidebar injects to reach the same layout face.
		 */
		const inject = ['slots', 'layout'];
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 免hash是否消除兼容风险，可借鉴什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

免完整hash没有消除DOM契约风险。LOCATORS仍依赖class子串，stampFrame用querySelector取得第一个匹配，没有注释所说的唯一性判定，也没有歧义时停止或报警。缺少某个匹配只是不打标；若部分frame/sidebar匹配成功、其他列未匹配，可能只应用一部分布局规则。因此不能把“集中定位”提升成“升级失败会可靠暴露”的保证。作者已记录detailsCol变为rightbarCol的适配，说明语义后缀也会改名。

设置定位每次遍历div/section/dialog，计算样式和几何，再选全视口fixed flex且含_nav的第一个容器。这个启发式比全局_nav更窄，但仍可能遇到另一个满足条件的叠层。观察器监听整个body的子树、style和class变化，rAF合并避免同帧重复调度，却不证明长对话下没有明显开销。

值得借鉴的是意图与渲染值解耦、FLOW把密度规则限制在包含消息的列、观察器和resize/rAF在React cleanup中释放。边界是全局style和data-thumb标记在所读清理路径中没有删除，运行中卸载后是否残留密度样式不能仅凭cleanup推定；完整刷新和加载前关闭开关更明确。按钮缩到24px、提示溢出与设置导航不完全横排是作者明确承认的取舍。这里未复现误匹配或卸载残留。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:50-65](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L50-L65)

定位器注释期待唯一节点，但本段只声明子串规则。

<details>
<summary>查看原文（16行）</summary>

```text
		/**
		 * Runtime locators. Key is the data-thumb value we stamp; value is the
		 * selector used to find the node once. Selectors use the semantic suffix
		 * that survives CSS-Modules hashing (`pI_x6G_sidebarCol` -> `sidebarCol`),
		 * never a full hashed class.
		 *
		 * Each of these resolved to exactly one node when probed on rc.6, so an
		 * ambiguous match means upstream restructured and we should stop rather
		 * than style the wrong element.
		 */
		const LOCATORS = {
			frame: '[class*="_frame"]',
			sidebar: '[class*="sidebarCol"]',
			center: '[class*="centerCol"]',
			details: '[class*="rightbarCol"], [class*="detailsCol"]',
		};
```

</details>

**依据 2 · 源码核查**：[src/client.js:303-337](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L303-L337)

querySelector首匹配与设置启发式，没有唯一性校验。

<details>
<summary>查看原文（35行）</summary>

```text
		/**
		 * Stamp data-thumb on the nodes we style.
		 *
		 * Re-run on DOM mutations because the shell remounts columns across route
		 * changes; stamping is idempotent and cheap (four querySelector calls).
		 * A locator that matches nothing is left unstamped and its rules simply
		 * never apply — degrading to stock behaviour rather than to a broken one.
		 */
		function stampFrame() {
			if (disabled()) return;
			for (const [name, selector] of Object.entries(LOCATORS)) {
				const el = document.querySelector(selector);
				if (el && el.getAttribute('data-thumb') !== name) el.setAttribute('data-thumb', name);
			}
		}

		/**
		 * The settings sheet is transient, and its parts are only unambiguous
		 * *inside* the sheet's own overlay — `[class*="_nav"]` would collide with
		 * unrelated nodes if queried against the whole document. So we find the
		 * sheet first (a fixed, full-viewport flex-row layer) and scope from there.
		 */
		function stampSettings() {
			const sheet = Array.from(document.querySelectorAll('div,section,dialog')).find((el) => {
				const cs = getComputedStyle(el);
				if (cs.position !== 'fixed' || cs.display !== 'flex') return false;
				const r = el.getBoundingClientRect();
				return r.width >= window.innerWidth - 2 && r.height >= window.innerHeight - 2
					&& el.querySelector('[class*="_nav"]') !== null;
			});
			if (!sheet) return;
			for (const [name, selector] of Object.entries(SETTINGS_LOCATORS)) {
				const el = sheet.querySelector(selector);
				if (el && el.getAttribute('data-thumb') !== name) el.setAttribute('data-thumb', name);
			}
```

</details>

**依据 3 · 源码核查**：[src/client.js:392-420](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L392-L420)

全body观察和cleanup释放事件/rAF，未删除style与data标记。

<details>
<summary>查看原文（29行）</summary>

```text
			// Stamp + track. One rAF-coalesced observer drives both.
			React.useEffect(() => {
				if (typeof document === 'undefined') return undefined;
				ensureStyle();
				let raf = 0;
				const tick = () => {
					raf = 0;
					stampFrame();
					stampSettings();
					setOpen(phone && sidebarIsExpanded());
				};
				const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
				tick();
				const obs = new MutationObserver(schedule);
				obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
				window.addEventListener('resize', schedule);
				return () => {
					obs.disconnect();
					window.removeEventListener('resize', schedule);
					if (raf) cancelAnimationFrame(raf);
				};
			}, [phone]);

			// Reflect state onto <html> so the CSS above can key off it.
			React.useEffect(() => {
				const de = document.documentElement;
				if (phone && open) de.setAttribute(DRAWER_ATTR, 'open');
				else de.removeAttribute(DRAWER_ATTR);
				return () => de.removeAttribute(DRAWER_ATTR);
```

</details>

**依据 4 · 作者声明**：[README.md:97-103](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/README.md#L97-L103)

作者列出触控/导航及布局维护限制。

```text
## Known limitations

- **Hover tooltips can still overflow the right edge** (the dark card when hovering a workspace row). Deliberately not fixed: its classes (`_card` / `_copyable`) are too generic to target safely, and doing it properly would mean scanning every `position: fixed` layer each frame and clamping them back into the viewport — an unclear blast radius for what is a cosmetic issue that blocks nothing. The right fix belongs upstream, in the tooltip's own touch handling.
- **Measured at 393, 480, 560, 604, 640, 700, 768, 900 and 1023px, plus desktop 1440×900** — see the table under [Scope](#scope). Phone sizes are the ones used daily; the rest were measured once, not lived in.
- **The settings nav still stacks vertically** instead of scrolling horizontally. The `flex-direction: row` rule lands on a wrapper that is not the one actually laying those items out, so it costs some vertical space at the top of the sheet. Left as is: the sheet went from unusable to usable, and chasing the exact nav container is polish, not repair.
- **The action rows under assistant replies keep their 28px** while the ones under user messages shrink to 24px. They sit in a second flex wrapper and moved for none of `height`, `align-self` or `min-height`, and no rule naming those classes sets a height at all — so whatever sizes them needs a wider probe than a class-name scan. Left alone deliberately: it is 12px on a three-turn session, roughly 2% of the column.
- **A change to how upstream lays out its columns means updating this.** The locators are the four entries in `LOCATORS` at the top of `src/client.js` — a minutes-long edit.
```

#### 缺口

- 没有在DOM歧义、局部匹配和宿主热禁用场景中的行为材料。
  **影响**：无法承诺升级后只会完整退回原生布局，或禁用即清除所有样式。
  **进一步探讨**：继续探讨可从构造重复后缀节点、部分缺列和热禁用序列入手，检查是否局部污染和是否可恢复。
- 没有长对话与多叠层下全body观察和样式探测的性能数据。
  **影响**：rAF合并只说明调度控制，不能证明低资源成本。
  **进一步探讨**：可对同一长会话比较开关前后的布局计算次数、主线程占用和交互延迟。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、关闭、恢复的条件及负担是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH web客户端模块加载器、React | 启动必需 | 注册客户端与渲染overlay | 纯宿主/CLI不会得到界面功能 |
| client-runtime、client-ui-layout包 | 包清单声明必需 | 模块加载顺序 | 与服务注入名称不可混用 |
| slots、layout服务 | 客户端注入必需 | 挂overlay和关闭侧栏 | 入口可能等待服务，关闭接口不可用 |
| 语义后缀、frame内联网格 | 效果必需 | 标记节点和检测展开 | 上游结构变化需调整定位器 |
| matchMedia、MutationObserver、rAF、CSS :has | 分支需要 | 窄屏监听、DOM同步和密度范围 | :has不可用时对应密度规则不生效；其他兼容未核实 |
| GitHub来源 | 作者分发路径 | 获取private包的仓库版本 | 不按npm包存在推断可用性 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 用户按固定GitHub来源加入web profile并重启 | bundle存在且客户端服务激活 |
| 使用 | 窄屏展开侧栏、点目标会话或遮罩 | 会话正确切换、抽屉可关、聊天可读 |
| 临时关闭 | 加?thumb=0或localStorage置0后重载 | CSS与打标在加载前检查disabled |
| 退出恢复 | 移除bundle并重启，必要时核对node_modules链接 | 只还原package.json可能留下链接状态 |

作者不承诺维护或Issue响应，适配责任需由用户考虑。不能把“改四个定位器只需几分钟”的作者估计写成保证。开关是在URL/存储读取并重新加载时生效，没有专门的实时设置订阅。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-33](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/package.json#L23-L33)

web平台和包级注入条件。

<details>
<summary>查看原文（11行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-layout"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[src/client.js:91-98](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L91-L98)

URL及localStorage关闭逻辑，存储异常时维持开启。

```text
		function disabled() {
			try {
				if (typeof location !== 'undefined'
					&& new URLSearchParams(location.search).get('thumb') === '0') return true;
				if (localStorage.getItem('dsh-thumb') === '0') return true;
			} catch (_) { /* private mode / blocked storage: stay enabled */ }
			return false;
		}
```

**依据 3 · 源码核查**：[src/client.js:285-317](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L285-L317)

插CSS与打标都检查disabled，但不是实时移除已有样式。

<details>
<summary>查看原文（33行）</summary>

```text
		function ensureStyle() {
			if (typeof document === 'undefined') return;
			/* The off switch has to be checked here, not only in useIsPhone.
			   Until the density rules landed, every rule was gated on the drawer
			   attribute, which only a live component ever sets — so disabling the
			   component was enough to neutralise the stylesheet. The density rules
			   apply with the drawer shut, by design, which means an injected
			   stylesheet is now load-bearing on its own and the switch has to
			   reach it directly. Caught by test/smoke.mjs on its first run. */
			if (disabled()) return;
			if (document.getElementById(STYLE_ID)) return;
			const tag = document.createElement('style');
			tag.id = STYLE_ID;
			tag.dataset.plugin = 'dsh-thumb';
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}

		/**
		 * Stamp data-thumb on the nodes we style.
		 *
		 * Re-run on DOM mutations because the shell remounts columns across route
		 * changes; stamping is idempotent and cheap (four querySelector calls).
		 * A locator that matches nothing is left unstamped and its rules simply
		 * never apply — degrading to stock behaviour rather than to a broken one.
		 */
		function stampFrame() {
			if (disabled()) return;
			for (const [name, selector] of Object.entries(LOCATORS)) {
				const el = document.querySelector(selector);
				if (el && el.getAttribute('data-thumb') !== name) el.setAttribute('data-thumb', name);
			}
		}
```

</details>

**依据 4 · 作者声明**：[README.md:33-60](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/README.md#L33-L60)

作者给出安装、移除、链接回退与重载开关。

<details>
<summary>查看原文（28行）</summary>

````text
## Install / remove / switch off

```bash
# install
dsh plugin --profile web add github:AliceLJY/dsh-thumb
# confirm "dsh-thumb" is in dsh.profile.bundles in ~/.dsh/profiles/web/package.json, then restart the service

# remove
dsh plugin --profile web remove dsh-thumb
# again, confirm it is gone from the bundles array, then restart
```

There is no npm package: `dsh plugin add` hands its arguments to pnpm, so a
`github:` specifier installs the repository directly. Measured at 8.9s on a
cold store, and dsh appends it to `dsh.profile.bundles` on its own.

Working on it locally instead? Point the same command at a path:

```bash
dsh plugin --profile web add link:/absolute/path/to/dsh-thumb
```

⚠️ **Rolling back means undoing two things**: `package.json` *and* the link in `node_modules`. Restore only the former and the next `pnpm add` sees the link still present, decides "Already up to date", and **writes nothing while reporting success** — it looks installed but isn't.

To switch off without restarting anything:

- append `?thumb=0` to the URL, or
- run `localStorage.setItem('dsh-thumb','0')` in the console and reload
````

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 布局收益和全程成本有什么证据？

**研究主题**：效果与总成本

#### 完整回答

本插件的合格任务是用户在窄屏切换到目标会话后能读内容并操作必要设置，而不是只量中心列宽。README给出多视口宽度和同会话高度数据；test/measure-widths按打开会话后的落点测量，避免把抽屉遮挡面积当作最终阅读收益。这个口径本身值得借鉴，但更宽、更密并不自动等于更易阅读或更少误触。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地宿主和浏览器资源，现金未知 | 安装、重启、确认bundle与目标布局 | 作者8.9秒冷安装不是本轮测量，也非通用耗时 |
| 持续使用 | 全body观察及设置扫描的CPU/布局开销未测 | 适应密度和24px按钮，检查误触 | 没有真实用户任务成本数据 |
| 失败恢复 | 重新加载和安装链接修复的资源未知 | 用开关退回原生、核对定位器或移除 | 作者不承诺长期维护，耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 抽屉及自动关闭 | CSS和公共layout调用可查；作者报告窄屏宽度收益 | 本次没有独立复测或任务正确率 |
| 更紧凑正文 | CSS设14px/21px与10px间距；作者报告高度610降至490px | 阅读速度、疲劳和触控错误代价 |
| 桌面范围 | 样式在max-width 1023px内；作者报告1440px回归 | 所有桌面缩放/浏览器下兼容性 |

smoke源码有具体布局断言及开关对照，但若没有现有会话会跳过密度断言，脚本存在也不是完整通过证据。本轮只读脚本，既没有将作者报告转成host_acceptance，也没有执行宿主冒烟。不能用列宽增幅替代端到端效率或收益率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:78-95](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/README.md#L78-L95)

作者测量最终会话阅读宽度及密度取舍，不是本次执行。

<details>
<summary>查看原文（18行）</summary>

```text
What matters is the state you are left in *after tapping a session*, since that is the path you have to take to switch sessions. Stock leaves the sidebar open, so the transcript stays at `width − 280`. The shell closes it, leaving the 56px rail and `width − 56`:

| viewport | stock | with the shell | gain |
|---:|---:|---:|---:|
| 393px | 113px | 337px | **+198%** |
| 480px | 200px | 424px | +112% |
| 604px | 324px | 548px | +69% |
| 768px | 488px | 712px | **+46%** |
| 900px | 620px | 844px | +36% |
| 1023px | 743px | 967px | **+30%** |

Regenerate that table with `node test/measure-widths.mjs`; the file also explains why it measures the width you are left with rather than the width the drawer covers, which is what the first attempt got wrong.

The gain shrinks with width, as expected — but it never inverts anywhere inside the supported range. Lowering the breakpoint would switch off something still worth 30–46% at the sizes it was supposed to help. The 1023px breakpoint stays.

**The density rules are the one deliberate exception**: they apply at ≤1023px with the drawer shut, because that is the state you read a transcript in. On the measured session that is 610px of column down to 490px — 60px of it from the gap between turns alone (16px → 10px), which costs nothing to interact with. Body text goes 16px/28px → 14px/21px and the action buttons 28px → 24px; the buttons were already under the 44px iOS touch target, so that last one is a trade, and `--thumb-hit` at the top of the stylesheet puts it back.

Desktop is verified unchanged: sidebar 280px, center 1160px, `position: static`, no scrim, settings still an 800px two-column sheet.
```

</details>

**依据 2 · 源码核查**：[test/measure-widths.mjs:35-53](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/test/measure-widths.mjs#L35-L53)

脚本按展开和选择会话后的状态读取中心宽度。

<details>
<summary>查看原文（19行）</summary>

```text
/** Walk the path a user has to take to switch sessions, then measure. */
async function transcriptWidthAfterOpeningASession(width, { stock }) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL_BASE + (stock ? '?thumb=0' : ''), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  const toggle = await page.$('[class*="_toggle"]');
  if (toggle) { await toggle.click().catch(() => {}); await page.waitForTimeout(1200); }
  for (const row of await page.$$('[class*="_sessionRow"]')) {
    const t = (await row.textContent() || '').trim();
    if (t && t !== '新会话' && t !== 'New session') { await row.click().catch(() => {}); break; }
  }
  await page.waitForTimeout(3000);
  const w = await page.evaluate(() => {
    const c = document.querySelector('[class*="centerCol"]');
    return c ? Math.round(c.getBoundingClientRect().width) : null;
  });
  await ctx.close();
  return w;
```

</details>

**依据 3 · 源码核查**：[test/smoke.mjs:108-143](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/test/smoke.mjs#L108-L143)

没有会话时跳过密度断言，存在有具体对照但需真实运行。

<details>
<summary>查看原文（36行）</summary>

```text
// ----------------------------------------------------------------- density
{
  console.log('\nreading density (phone viewport)');
  const ctx = await browser.newContext({ viewport: PHONE });
  const page = await ctx.newPage();
  const opened = await openSession(page);
  if (!opened) {
    console.log('  skip  no existing session to read — density not asserted');
  } else {
    const m = await page.evaluate(() => {
      const cs = (sel, p) => { const e = document.querySelector(sel); return e ? getComputedStyle(e)[p] : null; };
      const col = document.querySelector('[class*="_column"]');
      return {
        font: cs('[data-thumb="center"] [class*="_markdown"]', 'fontSize'),
        lh: cs('[data-thumb="center"] [class*="_markdown"]', 'lineHeight'),
        bubblePad: cs('[data-thumb="center"] [class*="_bubble"]', 'padding'),
        colGap: col ? getComputedStyle(col).gap : null,
        scroll: col ? col.scrollHeight : null,
      };
    });
    ok('body text is 14px', m.font === '14px', m.font);
    ok('body leading is 21px', m.lh === '21px', m.lh);
    ok('bubble padding tightened', m.bubblePad === '7px 12px', m.bubblePad);
    ok('turn gap tightened to 10px', m.colGap === '10px', m.colGap);

    // End-to-end: the same transcript with the shell off must be taller.
    const off = await browser.newContext({ viewport: PHONE });
    const offPage = await off.newPage();
    await openSession(offPage, { thumbOff: true });
    const stock = await offPage.evaluate(() => {
      const col = document.querySelector('[class*="_column"]');
      return col ? col.scrollHeight : null;
    });
    const saved = stock && m.scroll ? (stock - m.scroll) / stock : 0;
    ok('transcript is at least 15% shorter than stock',
       saved >= 0.15, 'stock=' + stock + ' thumb=' + m.scroll + ' saved=' + (saved * 100).toFixed(1) + '%');
```

</details>

#### 缺口

- 没有独立阅读任务、触控错误及浏览器资源对照。
  **影响**：不能把像素收益解释成用户效率提升或成本净降低。
  **进一步探讨**：可在相同文本和设备上比较切会话时间、阅读理解、误触和布局计算开销，避免只看列宽。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 后续可探索什么，以及适合谁采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前建议为试用，限于愿意自行维护的个人窄屏DSH web用户。功能定位明确，源码有开关与公开layout关闭路径，因而存在可撤回试用方式；但语义后缀与DOM布局耦合、首匹配及清理边界不能忽略。先核对自己的宿主版本、手机视口、会话选择、设置、轨迹页面和关闭开关，出现错误节点被样式命中、抽屉不能关或关键按钮误触即停用并重载。

可以提出未验证的定位器健康门控。当前集中定位器方便修订，但没有唯一性与父子关系检查。若在完整且一致的frame/sidebar/center组合被识别后才整体启用，并展示兼容诊断，或许能降低升级后部分应用CSS的风险。它会增加探测与诊断复杂度，也可能对合法多窗口误判，不能直接算已有能力。

最小对照可把同一宿主页面的后缀改名、重复节点、局部缺列和设置叠层作为故障输入，比较当前首匹配与门控版本是否误污染、是否明确退出以及恢复是否可解释。若误伤合法布局或性能开销高于避免的失效，则否定净价值。现有作者测试报告不等于本轮同版本安装、功能与卸载验收，因此不足以给值得安装结论。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:303-337](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L303-L337)

首匹配且逐节点打标，是整体门控假设的具体起点。

<details>
<summary>查看原文（35行）</summary>

```text
		/**
		 * Stamp data-thumb on the nodes we style.
		 *
		 * Re-run on DOM mutations because the shell remounts columns across route
		 * changes; stamping is idempotent and cheap (four querySelector calls).
		 * A locator that matches nothing is left unstamped and its rules simply
		 * never apply — degrading to stock behaviour rather than to a broken one.
		 */
		function stampFrame() {
			if (disabled()) return;
			for (const [name, selector] of Object.entries(LOCATORS)) {
				const el = document.querySelector(selector);
				if (el && el.getAttribute('data-thumb') !== name) el.setAttribute('data-thumb', name);
			}
		}

		/**
		 * The settings sheet is transient, and its parts are only unambiguous
		 * *inside* the sheet's own overlay — `[class*="_nav"]` would collide with
		 * unrelated nodes if queried against the whole document. So we find the
		 * sheet first (a fixed, full-viewport flex-row layer) and scope from there.
		 */
		function stampSettings() {
			const sheet = Array.from(document.querySelectorAll('div,section,dialog')).find((el) => {
				const cs = getComputedStyle(el);
				if (cs.position !== 'fixed' || cs.display !== 'flex') return false;
				const r = el.getBoundingClientRect();
				return r.width >= window.innerWidth - 2 && r.height >= window.innerHeight - 2
					&& el.querySelector('[class*="_nav"]') !== null;
			});
			if (!sheet) return;
			for (const [name, selector] of Object.entries(SETTINGS_LOCATORS)) {
				const el = sheet.querySelector(selector);
				if (el && el.getAttribute('data-thumb') !== name) el.setAttribute('data-thumb', name);
			}
```

</details>

**依据 2 · 源码核查**：[src/client.js:285-300](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js#L285-L300)

加载前开关提供退回路径，未证明热禁用完整清理。

<details>
<summary>查看原文（16行）</summary>

```text
		function ensureStyle() {
			if (typeof document === 'undefined') return;
			/* The off switch has to be checked here, not only in useIsPhone.
			   Until the density rules landed, every rule was gated on the drawer
			   attribute, which only a live component ever sets — so disabling the
			   component was enough to neutralise the stylesheet. The density rules
			   apply with the drawer shut, by design, which means an injected
			   stylesheet is now load-bearing on its own and the switch has to
			   reach it directly. Caught by test/smoke.mjs on its first run. */
			if (disabled()) return;
			if (document.getElementById(STYLE_ID)) return;
			const tag = document.createElement('style');
			tag.id = STYLE_ID;
			tag.dataset.plugin = 'dsh-thumb';
			tag.textContent = CSS;
			document.head.appendChild(tag);
```

</details>

**依据 3 · 作者声明**：[README.md:7-9](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/README.md#L7-L9)

作者明确个人工具与维护责任，并报告一次上游改名。

```text
> **Personal tool, published as-is.** Written for one person's phone and one dsh version (`0.1.0-rc.6`). No maintenance and no issue response are promised. If a dsh upgrade breaks it, the four entries in `LOCATORS` at the top of `src/client.js` are where to look — that is a minutes-long edit.
>
> Re-checked 2026-10-21 against dsh `0.2.1-rc.2` (same 393×660 viewport, Playwright): the drawer and the scrim still work, and stock still squeezes the chat to 113px. The one thing that had broken was the right-panel locator — upstream renamed `detailsCol` to `rightbarCol` — so `LOCATORS.details` now matches both names.
```

#### 缺口

- 定位器健康门控能否减少部分样式失效尚无结果。
  **影响**：仍属设计假设，不计现有创新或增加采用成熟度。
  **进一步探讨**：可从具体DOM故障输入与合法多窗口对照入手，同时记录误伤和探测成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
