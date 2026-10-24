# dsh-client-ui-font-scale

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[af8976a](https://github.com/AprilCrystal/dsh-client-ui-font-scale/tree/af8976a87137a21cbe6fb527e5a38e19ffc4c596)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：为 DSH 对话字号提供输入区步进器、快捷键和 Ctrl 滚轮控制。

> **核心亮点**：原生字号能力之上增加就地入口，并将 theme 保留为唯一状态所有者，避免创建第二份持久化设置；便利来自减少导航，非新排版算法。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：全页 Ctrl 滚轮先阻止默认行为，再检查冷却和调用主题服务，会改变整页缩放语义；对依赖原生缩放的人可能抵消便利。该次序已核查，设备影响未实测。[Q03](#research-q03)

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
  - [Q01 · 用户为什么需要就地调字号，增量在哪里？](#detail-section-11)
  - [Q02 · 三类输入如何共享字号与持久化？](#detail-section-12)
  - [Q03 · 全页 Ctrl 滚轮的取舍和成本是什么，谁适合试用？](#detail-section-13)
  - [Q04 · 能否缩小手势作用域而保留便利？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复阅读与展示长对话的人可就地调整10至22像素字号；整页 UI 放大仍是另一任务。[Q01](#research-q01)

宿主原生设置已经能改变相同字号；浏览器缩放可放大整页，但影响范围不同。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 输入区字号步进器 | 就地增减与复位 | theme 服务可用，范围10至22像素 |
| 字号快捷键 | 输入焦点中调整字号 | shortcuts 服务及平台 primary 映射 |
| Ctrl 滚轮 | 鼠标或触控板调字号 | 全页拦截默认缩放，60毫秒冷却 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web、React 与 slots | 启动必需 | 加载与输入区控件 | 无控制入口 |
| theme.setFontSize | 调整必需 | 规范写入与宿主持久化 | 不写入字号 |
| shortcuts、locale | 对应入口必需 | 快捷键与文案 | 对应功能不注册 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装并重载 Web 页面 | 输入区出现步进器 |
| 调整 | 用户按钮或快捷键操作 | 数值与原生设置同步 |
| 检查 | 用户测试滚轮与重启 | 无不可接受冲突；否则停用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 设备与宿主，金额未知 | 安装重载与熟悉入口，耗时未知 | 依赖 theme 服务 |
| 持续使用 | 事件处理资源未测 | 注意手势与快捷键冲突 | 没有第二字号存储 |
| 失败恢复 | 排查资源未知 | 回原生设置或停用插件 | 宿主范围变化需维护 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 就地调字号 | slots、shortcuts 和 wheel 接线 | 实际宿主可用性 |
| 状态一致 | 共用 theme 写入口 | 重启持久化 |
| 阅读便利 | 减少导航的机制 | 节时、可读性与误触率 |

> **思考**：全页 Ctrl 滚轮先阻止默认行为，再检查冷却和调用主题服务，会改变整页缩放语义；对依赖原生缩放的人可能抵消便利。该次序已核查，设备影响未实测。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：原生字号能力之上增加就地入口，并将 theme 保留为唯一状态所有者，避免创建第二份持久化设置；便利来自减少导航，非新排版算法。[Q01](#research-q01) [Q02](#research-q02)

原生字号能力之上增加就地入口，并将 theme 保留为唯一状态所有者，避免创建第二份持久化设置；便利来自减少导航，非新排版算法。[Q01](#research-q01) [Q02](#research-q02)

按调用取服务与 inject 等待注册避免捕获早期缺失值；effect 清理监听体现生命周期意识。复制主题范围常量仍有版本同步负担，window 手势副作用须被用户知晓。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

全页 Ctrl 滚轮先阻止默认行为，再检查冷却和调用主题服务，会改变整页缩放语义；对依赖原生缩放的人可能抵消便利。该次序已核查，设备影响未实测。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用步进器与原生设置交替修改，确认数值一致，再检查输入焦点下快捷键及 Ctrl 滚轮是否符合习惯。需要整页放大或出现冲突时保留原生设置路径。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

快捷输入与共享状态的实现有源码支持；阅读收益、平台手势和宿主重启行为未执行验证。区域化手势为未验证假设。

- 已检查：作者 README、包清单、源码路径 lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定浏览器源码与作者说明；未安装、执行插件测试或验收真实宿主。
- 下一步：在匹配宿主核对主题同步、重启、边界值、快捷键平台映射和滚轮冲突；对照操作时间与误触，未执行。

**分析版本**

- **仓库**：[AprilCrystal/dsh-client-ui-font-scale](https://github.com/AprilCrystal/dsh-client-ui-font-scale)
- **版本号**：0.1.0（[固定提交 af8976a](https://github.com/AprilCrystal/dsh-client-ui-font-scale/tree/af8976a87137a21cbe6fb527e5a38e19ffc4c596)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可只在对话区域响应手势，保留其他区域原生缩放，以相同设备的两类缩放任务比较误触和耗时；若找区域负担更大则否定。尚未实现。[Q04](#research-q04)

在匹配宿主核对主题同步、重启、边界值、快捷键平台映射和滚轮冲突；对照操作时间与误触，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 250 | 174 | 62 | — |
| .md | source | 1 | 176 | — | — | 1103 |
| .mjs | source | 1 | 157 | 113 | 30 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/AprilCrystal/dsh-client-ui-font-scale/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验快捷字号控制相对原生设置的增量及全页手势的取舍。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户为什么需要就地调字号，增量在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

阅读长对话、临时远离屏幕或切换展示环境的人，需要反复调整对话内容字号。合格结果是内容字号达到所需大小、与原生设置一致且不改变无关页面缩放。README 明确宿主已有字号设置，因此贡献不在实现新排版能力，而在输入区步进器、快捷键和滚轮三种更近的操作入口。与打开设置相比减少了导航；与浏览器整页缩放相比保持内容字号的既定范围，但不能放大所有界面。实际点击节省与阅读改善没有测量，不能把入口便利写成可访问性效果已获验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-35](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/af8976a87137a21cbe6fb527e5a38e19ffc4c596/README.md#L12-L35)

作者承认原生设置并列明新增输入表面，限定相对贡献。

<details>
<summary>查看原文（24行）</summary>

```text
DSH already ships a conversation font-size setting — **Settings → General → 字号大小 / Font size**,
contributed by `@deepseek-ai/dsh-client-ui-theme`. Its copy is explicit that it *"only affects
conversation content"*, which is exactly the right scope.

This plugin does not replace or reimplement it. It adds the input surfaces that setting lacks:

- reaching it takes four clicks, so it is easy to forget it exists;
- there is no keyboard shortcut for it anywhere in the shipped shortcuts registry;
- there is no wheel gesture for it.

Every control here writes through the **same** `theme.setFontSize` entry point the shipped row uses,
so the two can never disagree.

## What it does

| Surface | Where | Behaviour |
|---|---|---|
| Stepper | composer tool row, before the submit action | `A−` / readout / `A+`, clamping at the ends |
| Reset | beside the stepper | `↺` restores the default; greys out when already there |
| Shortcuts | `Ctrl`+`=` / `Ctrl`+`-` / `Ctrl`+`0` | increase / decrease / restore default |
| Zoom | `Ctrl`+wheel over the page | wheel up enlarges, wheel down shrinks |

Both the readout and the reset button render the **live** size from the theme snapshot, so a change
made in the shipped settings row updates this control immediately, and vice versa.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三类输入如何共享字号与持久化？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

浏览器实现每次操作重新取 theme，current 读 getTheme().fontSize，write 将数值四舍五入并夹在10到22之间再调用 setFontSize。它不维护第二份字号存储，按钮显示依赖 theme/change 重渲染；因此一致性来自共享服务而不是本插件双向复制状态。locale 和 shortcuts 用 inject 等待挂载，输入区控制通过 slots 注册，样式和 wheel 监听均由 effect 返回清理函数。这种借用状态所有权的设计值得复用，但持久化仍由宿主 theme 服务负责，本次只核查调用方，不能证明宿主每次重启都兑现作者声明。范围常量在本插件复制，未来宿主范围变化仍需同步维护。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:94-114](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/af8976a87137a21cbe6fb527e5a38e19ffc4c596/lib/client.js#L94-L114)

统一写路径与按次服务解析支持状态所有权判断。

<details>
<summary>查看原文（21行）</summary>

```text
    function clamp(px) {
      const n = Math.round(Number(px))
      return Number.isFinite(n) ? Math.min(MAX, Math.max(MIN, n)) : DEFAULT
    }

    /**
     * Client plugin body: provide the four input surfaces over one write path.
     * @param ctx - client cordis context.
     */
    function apply(ctx) {
      // Resolved per call: this package may load before ui-theme provides it.
      const themeOf = () => ctx.get('theme')
      const current = () => themeOf()?.getTheme().fontSize ?? DEFAULT
      const write = (px) => {
        const theme = themeOf()
        if (theme === undefined) return
        const next = clamp(px)
        if (next === current()) return
        theme.setFontSize(next)
      }
      const step = (delta) => write(current() + delta)
```

</details>

**依据 2 · 源码核查**：[lib/client.js:186-200](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/af8976a87137a21cbe6fb527e5a38e19ffc4c596/lib/client.js#L186-L200)

Control 订阅主题事件并清理订阅。

<details>
<summary>查看原文（15行）</summary>

```text
      /** Composer-row stepper: read the snapshot, write through the service. */
      function Control() {
        const [, setTick] = React.useState(0)
        React.useEffect(() => {
          const bump = () => setTick((n) => n + 1)
          const offTheme = ctx.on('theme/change', bump)
          const locale = localeOf()
          const offLocale = locale !== undefined && typeof locale.subscribe === 'function'
            ? locale.subscribe(bump)
            : undefined
          return () => {
            offTheme()
            if (typeof offLocale === 'function') offLocale()
          }
        }, [])
```

</details>

**依据 3 · 源码核查**：[lib/client.js:229-238](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/af8976a87137a21cbe6fb527e5a38e19ffc4c596/lib/client.js#L229-L238)

输入区 slots 接线和必要服务声明。

<details>
<summary>查看原文（10行）</summary>

```text
      ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
        name: 'conversation.input.right',
        id: NS,
        order: 20,
      }, Control))
    }

    return {
      inject: ['slots'],
      apply,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 全页 Ctrl 滚轮的取舍和成本是什么，谁适合试用？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

wheel 监听挂在 window，凡 ctrlKey 且非零滚动就先 preventDefault，再按60毫秒冷却调整字号。因此用户在任何区域 Ctrl 滚轮都会失去原有整页缩放，甚至冷却期间和主题服务缺失时也先阻止默认动作。代码支持这一控制流边界，未测具体浏览器表现。成本单位应是一次达到目标字号且没有意外页面行为的调整。首次为安装、重新加载和学习快捷键；持续成本是记忆手势语义；故障时回原生设置或停用插件。没有独立 API 或模型调用机制，现金、人工耗时和触控板误触率仍未知。适合频繁调对话字号且接受整页缩放变化的人试用；需要全局放大 UI 或已有相同快捷键的人应先检查冲突。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:137-151](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/af8976a87137a21cbe6fb527e5a38e19ffc4c596/lib/client.js#L137-L151)

全局监听、先 preventDefault 和冷却次序解释冲突边界。

<details>
<summary>查看原文（15行）</summary>

```text
      // Ctrl+wheel. preventDefault suppresses the shell's own page zoom so the
      // gesture means one thing only.
      let lastWheel = 0
      ctx.effect(() => {
        const onWheel = (event) => {
          if (!event.ctrlKey || event.deltaY === 0) return
          event.preventDefault()
          const now = Date.now()
          if (now - lastWheel < WHEEL_COOLDOWN_MS) return
          lastWheel = now
          step(event.deltaY < 0 ? 1 : -1)
        }
        window.addEventListener('wheel', onWheel, { passive: false })
        return () => window.removeEventListener('wheel', onWheel)
      }, `${NS}: ctrl+wheel`)
```

</details>

**依据 2 · 源码核查**：[lib/client.js:156-180](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/af8976a87137a21cbe6fb527e5a38e19ffc4c596/lib/client.js#L156-L180)

快捷键使用 primary 修饰与可编辑区域，平台实际映射须核对。

<details>
<summary>查看原文（25行）</summary>

```text
      const commands = [
        { id: `${NS}.increase`, code: 'Equal', alias: 'increase conversation font size', label: () => t('increase'), run: () => step(1) },
        { id: `${NS}.decrease`, code: 'Minus', alias: 'decrease conversation font size', label: () => t('decrease'), run: () => step(-1) },
        { id: `${NS}.reset`, code: 'Digit0', alias: 'restore default conversation font size', label: () => t('reset'), run: () => write(DEFAULT) },
      ]
      const registerShortcuts = (scope) => {
        const shortcuts = scope.shortcuts ?? ctx.get('shortcuts')
        if (shortcuts === undefined) return
        for (const command of commands) {
          scope.effect(() => shortcuts.register({
            id: command.id,
            label: command.label,
            aliases: ['font size', command.alias],
            defaults: {
              'desktop:macos': { code: command.code, modifiers: ['primary'] },
              'desktop:windows': { code: command.code, modifiers: ['primary'] },
              'desktop:linux': { code: command.code, modifiers: ['primary'] },
              'web:macos': { code: command.code, modifiers: ['primary'] },
              'web:windows': { code: command.code, modifiers: ['primary'] },
            },
            // "editable" keeps the bindings alive while the composer has focus.
            regions: ['page', 'editable'],
            modals: [],
            resolve: () => ({ status: 'handled', run: command.run }),
          }), `${NS}: ${command.id}`)
```

</details>

#### 缺口

- 没有真实设备手势误触率和操作时间对照。
  **影响**：不能量化便利能否抵消全页缩放冲突。
  **进一步探讨**：比较原生设置、步进器及手势达到同目标字号的耗时和误操作。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否缩小手势作用域而保留便利？

**研究主题**：新假设与验证

#### 完整回答

由全页拦截可推导未验证的按区域启用方案。仅在对话内容区或步进器上方响应 Ctrl 滚轮，其余区域保留原生行为；状态仍由 theme 所有，新增职责只有命中区域判定与用户设置。代价是区域结构和触控板行为适配，可能降低手势可发现性。最小对照在同设备完成内容放大与整页缩放两类任务，观察错误触发、完成时间及目标字号正确率。若区域限制显著增加找控件时间，或仍抢占原生缩放而没有减少错误，方案不成立。该方向没有实现证据，不计入当前贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:137-151](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/af8976a87137a21cbe6fb527e5a38e19ffc4c596/lib/client.js#L137-L151)

window 级拦截是作用域设计的推导依据。

<details>
<summary>查看原文（15行）</summary>

```text
      // Ctrl+wheel. preventDefault suppresses the shell's own page zoom so the
      // gesture means one thing only.
      let lastWheel = 0
      ctx.effect(() => {
        const onWheel = (event) => {
          if (!event.ctrlKey || event.deltaY === 0) return
          event.preventDefault()
          const now = Date.now()
          if (now - lastWheel < WHEEL_COOLDOWN_MS) return
          lastWheel = now
          step(event.deltaY < 0 ? 1 : -1)
        }
        window.addEventListener('wheel', onWheel, { passive: false })
        return () => window.removeEventListener('wheel', onWheel)
      }, `${NS}: ctrl+wheel`)
```

</details>

#### 缺口

- 区域化手势未实现。
  **影响**：收益仅是假设。
  **进一步探讨**：以区域判定原型和全局版本进行同设备对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
