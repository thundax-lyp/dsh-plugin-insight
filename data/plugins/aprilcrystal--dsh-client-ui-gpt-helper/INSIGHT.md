# dsh-client-ui-gpt-helper

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[bc18b1a](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/tree/bc18b1a14422f08ea36f7b0f57cf26da07807af0)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper)
<!-- END META -->

> **实现功能**：以桌面风格弹窗选择模型和思考级别，并提供配色与装饰性快速模式动画。

> **核心亮点**：将既有原型交互适配到 DSH 共享模型目录，用滑块表达模型广告的思考级别，避免 UI 自建第二套模型选择状态；增量为交互适配，非推理加速。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：fast 是动画却使用速度语义，可能使用户误判实际能力；同时每控件的全局配色快捷键会翻转同一 store，多挂载条件下可能相互抵消，实际宿主可达性待核查。[Q03](#research-q03)

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
  - [Q01 · 谁需要该界面，它比原生选择器多了什么？](#detail-section-11)
  - [Q02 · UI 如何接入会话模型目录和保存装饰状态？](#detail-section-12)
  - [Q03 · 替换与多会话快捷键有什么边界，采用负担如何？](#detail-section-13)
  - [Q04 · 可否让装饰和真实能力更清楚？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望用滑块选择思考级别的 DSH Web 用户可替换原模型控件；合格结果须核对真实请求状态。[Q01](#research-q01)

原生模型选择器和 /model 已提供真实选择能力；该插件主要改变交互和视觉表达。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型分组列表 | 选择供应商模型 | 共用每会话模型目录，受可用模型限制 |
| 思考级别滑块 | 选择 reasoningEffort | 仅模型广告的级别，须核对真实请求 |
| fast 动画及锁 | 控制装饰效果 | 不改变请求速度或服务模式 |
| 配色面板 | 本浏览器显示偏好 | 本地存储，多会话快捷键需验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web、slots 与 React | 启动必需 | 替换模型席位 | 控件不可用 |
| modelDirectories、sessions、remote.session | 选择必需 | 会话目录与提交 | 不能选择模型 |
| localStorage | 配色与 fast 锁持久化 | 保存显示偏好 | 偏好恢复受限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 安装 | 用户加载并重载页面 | 替换模型入口出现 |
| 选择 | 用户选模型及滑块级别 | 共享目录与请求一致 |
| 验收 | 用户检查失败提示与多会话 | 不一致则恢复原生控件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主设备，费用未知 | 安装重载和理解滑块 | fast 不影响服务速度 |
| 持续使用 | 动画资源与模型调用费用未知 | 核对真实模型和级别 | 模型费用由实际请求决定 |
| 失败恢复 | 排查与重载资源未知 | 禁用替换、恢复原生入口 | 检查本地配置残留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型与级别选择 | 共用目录 select | 实际请求正确性 |
| fast 动画 | 共享本地 FAST_STORE | 对用户理解的影响 |
| 交互便利 | 滑块和分组列表实现 | 耗时、误选及资源成本 |

> **思考**：fast 是动画却使用速度语义，可能使用户误判实际能力；同时每控件的全局配色快捷键会翻转同一 store，多挂载条件下可能相互抵消，实际宿主可达性待核查。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将既有原型交互适配到 DSH 共享模型目录，用滑块表达模型广告的思考级别，避免 UI 自建第二套模型选择状态；增量为交互适配，非推理加速。[Q01](#research-q01) [Q02](#research-q02)

将既有原型交互适配到 DSH 共享模型目录，用滑块表达模型广告的思考级别，避免 UI 自建第二套模型选择状态；增量为交互适配，非推理加速。[Q01](#research-q01) [Q02](#research-q02)

共享目录的 pending/error 和成功才关闭菜单值得借鉴；single slot 的负优先级接线与间接服务注入也构成维护约束。全局快捷键所有权与每会话组件生命周期应分别设计。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

fast 是动画却使用速度语义，可能使用户误判实际能力；同时每控件的全局配色快捷键会翻转同一 store，多挂载条件下可能相互抵消，实际宿主可达性待核查。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在非关键会话用控件与原生命令交替选择，核对下一次请求模型和思考级别；fast 只作动画偏好。打开多个会话检查配色快捷键，异常时恢复原生控件。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

选择接线与装饰状态有源码支持；请求与用户理解未运行验证，多控件快捷键存在条件风险。新方案未验证。

- 已检查：作者 README、包清单、源码路径 lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定浏览器源码选择、状态与注册路径；未执行目标代码、测试或宿主验收。
- 下一步：核对下一请求参数、选择失败、两会话快捷键、停用恢复与动画资源；未执行。

**分析版本**

- **仓库**：[AprilCrystal/dsh-client-ui-gpt-helper](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper)
- **版本号**：0.2.0（[固定提交 bc18b1a](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/tree/bc18b1a14422f08ea36f7b0f57cf26da07807af0)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将装饰与请求能力分层命名，并让单一生命周期管理快捷键。以多会话单次触发及用户参数预测验证，误解未下降或重载丢失监听则否定。未实现。[Q04](#research-q04)

核对下一请求参数、选择失败、两会话快捷键、停用恢复与动画资源；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3095 | 2371 | 533 | — |
| .md | source | 1 | 426 | — | — | 3560 |
| .mjs | source | 6 | 1530 | 1176 | 250 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验替换模型控件的真实状态链路、装饰性 fast 语义和多会话边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要该界面，它比原生选择器多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户在同一会话中选择供应商模型与可用思考级别时，希望获得更紧凑、熟悉的桌面交互。合格交付不是闪电动画亮起，而是下一次请求使用所选模型和 reasoningEffort，并能从原生命令看到一致状态。项目声明交互从仓库内原型移植；应把贡献归于 DSH 交互适配而非原创模型调度或推理算法。它新增可拖动思考滑块、分组模型列表、配色面板和装饰性快速模式。原生选择器已经完成模型选择，因此相对增量是操作表达与视觉偏好，未证明减少错误或加速推理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-29](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/blob/bc18b1a14422f08ea36f7b0f57cf26da07807af0/README.md#L3-L29)

README 将原型归属、模型选择、滑块及 visual only 快速模式同时说明，限定贡献范围。

<details>
<summary>查看原文（27行）</summary>

```text
A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) **client (browser) plugin**
that replaces the Web composer's model seat with a ChatGPT-desktop-style control: a popover with
the provider-grouped model list and an animated **thinking-level slider** carrying a particle
trail, plus a lightning **fast-mode** toggle.

The interaction design and every timing value are ported from a self-contained prototype that
ships in this repository — open [`docs/chatgpt-pc-ui-prototype.html`](docs/chatgpt-pc-ui-prototype.html)
in a browser to see the original.

## What it does

- **Model selection** — the real catalog, grouped by provider, searchable past four entries.
- **Thinking level** — the selected model's advertised levels become tick marks on a slider with
  a filled track and a 28px thumb. Drag, click a tick, or use the arrow keys; the value snaps to
  the nearest level and submits through the shared session directory.
- **Fast mode** — a bolt toggle that lights a particle trail. **Visual only:** DSH has no
  fast-mode concept, so it changes nothing except the animation. Turning it on ignites the trail
  and turning it off coasts it down (see [the ramp](#the-particle-ramp)).
- **Fast-mode lock** — hold the bolt for 600 ms to pin fast mode on. The hold is stored, so the
  bolt is lit again after a reload, in a new session and after restarting the app; the trigger
  grows a small lock badge and the popover swaps its bolt for a lock. A plain click is inert while
  the lock is held, and a second hold releases it (leaving fast mode on).
- **Colour configuration** — press `Ctrl+Shift+Alt+G` to open the colour panel and theme the
  control without editing this file (see [Colours](#colours)).

It **replaces** the shipped composer control rather than sitting beside it, and it reuses that
control's data layer, so the `/model` command and the next request stay in sync.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · UI 如何接入会话模型目录和保存装饰状态？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

插件以 priority -1 占据 conversation.input.model 的 single slot，保留原生模型目录服务。每个会话解析 directoryFor(sessionId)，读取共享 store，选择经 directory.select 提交。applyLevel 只提交 provider、model 和可选 reasoningEffort；fast 状态完全不在请求选择对象里。FastLock 在共享 FAST_STORE 中保持本地锁与动画开关，它与主题配置是界面状态，而不是模型速度设置。提交失败不关闭菜单的处理利用共享目录 pending/error，避免自建第二套请求状态。代价是注入链必须包含 remote.session 等间接服务，宿主服务或 slot 优先级变化会影响加载；没有执行来证明兼容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2481-2533](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/blob/bc18b1a14422f08ea36f7b0f57cf26da07807af0/lib/client.js#L2481-L2533)

提交字段与成功关闭逻辑解释模型请求状态边界。

<details>
<summary>查看原文（53行）</summary>

```text
      // The shared directory owns the in-flight state: it publishes `pending`
      // while the Host settles and writes `error` on failure. Close only on
      // success, so a rejected selection leaves the menu open with the reason
      // visible.
      const submit = (selection, closeAfter) => {
        Promise.resolve(select(selection)).then(
          (result) => {
            if ((result === undefined || result.ok === true) && closeAfter) close()
          },
          () => {},
        )
      }

      const showQuota = () => {
        clearTimeout(quotaShowRef.current)
        clearTimeout(quotaHideRef.current)
        quotaShowRef.current = setTimeout(() => {
          setQuota(true)
          quotaHideRef.current = setTimeout(() => setQuota(false), 1350)
        }, 145)
      }

      const applyLevel = (index, options) => {
        const choice = levels[index]
        if (choice === undefined || current === null) return
        if (options?.announceTop === true && levels.length > 1 && index === levels.length - 1) {
          showQuota()
        }
        submit(
          {
            provider: current.provider,
            model: current.model,
            ...(choice.effort === undefined ? {} : { reasoningEffort: choice.effort }),
          },
          false,
        )
      }

      const chooseModel = (group, model) => {
        if (busy) return
        const isCurrent = current?.provider === group.id && current.model === model.id
        const reasoningEffort = isCurrent
          ? (current?.reasoningEffort ?? model.reasoning?.defaultEffort)
          : model.reasoning?.defaultEffort
        submit(
          {
            provider: group.id,
            model: model.id,
            ...(reasoningEffort === undefined ? {} : { reasoningEffort }),
          },
          true,
        )
      }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:3028-3075](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/blob/bc18b1a14422f08ea36f7b0f57cf26da07807af0/lib/client.js#L3028-L3075)

服务注入、负优先级 slot 和共享模型目录形成真实接线。

<details>
<summary>查看原文（48行）</summary>

```text
      // `remote` and `remote.session` are required even though this plugin never
      // touches them directly: `ctx.modelDirectories.directoryFor()` resolves
      // `remote.session` internally, and the client context guard only resolves
      // a service that appears in the calling fiber's inject chain (otherwise:
      // `cannot get property "remote.session" without inject`). The shipped
      // control lists exactly these for the same reason.
      inject: ['slots', 'modelDirectories', 'sessions', 'locale', 'remote', 'remote.session'],
      apply(ctx) {
        // Development beacon: distinguishes "bundle never ran" from "ran but
        // failed to register", which is otherwise invisible because an
        // unoccupied `single` slot renders nothing at all.
        console.info(`[gpt-helper] client half applied — build ${BUILD}`)

        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'gpt-helper: dictionaries')

        ctx.slots.inject('conversation.input.model', () =>
          ctx.slots.register(
            {
              name: 'conversation.input.model',
              // Required: shadow the shipped composer control.
              //
              // For a `single` slot the registry sorts an occupied cell's
              // entries by priority ascending and renders the first, and two
              // entries at the SAME priority throw ("single slot ... already
              // has a registration"). The shipped control registers at the
              // default 0, and a boot-graph plugin like this one does NOT get a
              // priority allocated for it — the decreasing auto-allocation in
              // `dsh-cordis-client-runner` belongs to the separate
              // agent-authored runtime-plugin loader. So the negative priority
              // must be passed explicitly here, or registration throws and the
              // shipped control silently stays in place.
              priority: -1,
              locale: NS,
              // Per-session face, mirroring the shipped control so both entries
              // share one directory and one submission path.
              inject: (sessionId) => {
                const directory = ctx.modelDirectories.directoryFor(sessionId)
                const available = ctx.sessions.subagentAddress(sessionId) === undefined
                return {
                  available,
                  directory: directory.store,
                  load: () => {
                    if (available) directory.load().catch(() => {})
                  },
                  select: (selection) =>
                    available ? directory.select(selection) : Promise.resolve(undefined),
                }
              },
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2137-2160](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/blob/bc18b1a14422f08ea36f7b0f57cf26da07807af0/lib/client.js#L2137-L2160)

fast 锁只操作 FAST_STORE，支持装饰状态与请求状态区分。

<details>
<summary>查看原文（24行）</summary>

```text
      const state = React.useSyncExternalStore(
        (fn) => FAST_STORE.subscribe(fn),
        () => FAST_STORE.getSnapshot(),
      )

      const setFast = React.useCallback((next) => {
        FAST_STORE.update((current) => ({
          locked: current.locked,
          // While locked the value is not the user's to change.
          fast: current.locked ? true : typeof next === 'function' ? next(current.fast) : next === true,
        }))
      }, [])

      const toggleLock = React.useCallback(() => {
        FAST_STORE.update((current) => {
          const locked = !current.locked
          // Locking forces fast mode on — that IS the feature. Unlocking leaves
          // the toggle where it is, so unlocking never silently switches
          // anything off.
          return { locked, fast: locked ? true : current.fast }
        })
      }, [])

      return { fast: state.fast, locked: state.locked, setFast, toggleLock }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 替换与多会话快捷键有什么边界，采用负担如何？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

替换 single slot 会使用户依赖该插件渲染主模型入口，收益必须抵消额外界面维护。另一个源码可见边界在配色面板快捷键，每个已挂载 Control 都注册 document keydown，每次回调读取共享 PANEL_STORE.open 并取反，stopPropagation 不会阻止同一个 document 上其他回调。若有多个控件同时挂载，同一次按键可能连续翻转共享状态，偶数次会回到原值；这是一项有明确条件的静态风险，未确定宿主是否同时挂载这些控件，不能宣称已经发生。采用单位是一次正确完成的模型及级别选择。首次安装重载与学习滑块、持续确认真实级别、失败时移除替换并恢复原生入口均占人工，动画资源和时间未知。适合偏好该交互的人在非关键会话试用；期待 fast 按钮改变推理速度的人不应据此采用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2099-2129](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/blob/bc18b1a14422f08ea36f7b0f57cf26da07807af0/lib/client.js#L2099-L2129)

每控件注册捕获监听并翻转共享 store，说明多挂载条件风险。

<details>
<summary>查看原文（31行）</summary>

```text
     */
    function useConfigPanelHotkey() {
      const open = React.useSyncExternalStore(
        (fn) => PANEL_STORE.subscribe(fn),
        () => PANEL_STORE.getSnapshot().open,
      )
      const config = React.useSyncExternalStore(
        (fn) => CONFIG_STORE.subscribe(fn),
        () => CONFIG_STORE.getSnapshot(),
      )

      React.useEffect(() => {
        const parsed = parseHotkey(config.hotkey)
        const onKeyDown = (event) => {
          if (!hotkeyMatches(event, parsed)) return
          event.preventDefault()
          event.stopPropagation()
          PANEL_STORE.replace({ open: !PANEL_STORE.getSnapshot().open })
        }
        document.addEventListener('keydown', onKeyDown, true)
        return () => {
          document.removeEventListener('keydown', onKeyDown, true)
        }
      }, [config.hotkey])

      const close = React.useCallback(() => PANEL_STORE.replace({ open: false }), [])
      return [open, close]
    }

    /**
     * Fast mode plus its lock, shared across every mounted control.
```

</details>

**依据 2 · 源码核查**：[lib/client.js:3050-3075](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/blob/bc18b1a14422f08ea36f7b0f57cf26da07807af0/lib/client.js#L3050-L3075)

single slot 替换与按会话渲染是影响恢复与挂载条件的依据。

<details>
<summary>查看原文（26行）</summary>

```text
              // entries by priority ascending and renders the first, and two
              // entries at the SAME priority throw ("single slot ... already
              // has a registration"). The shipped control registers at the
              // default 0, and a boot-graph plugin like this one does NOT get a
              // priority allocated for it — the decreasing auto-allocation in
              // `dsh-cordis-client-runner` belongs to the separate
              // agent-authored runtime-plugin loader. So the negative priority
              // must be passed explicitly here, or registration throws and the
              // shipped control silently stays in place.
              priority: -1,
              locale: NS,
              // Per-session face, mirroring the shipped control so both entries
              // share one directory and one submission path.
              inject: (sessionId) => {
                const directory = ctx.modelDirectories.directoryFor(sessionId)
                const available = ctx.sessions.subagentAddress(sessionId) === undefined
                return {
                  available,
                  directory: directory.store,
                  load: () => {
                    if (available) directory.load().catch(() => {})
                  },
                  select: (selection) =>
                    available ? directory.select(selection) : Promise.resolve(undefined),
                }
              },
```

</details>

#### 缺口

- 宿主是否同时保留多个会话控件未实测。
  **影响**：无法判断快捷键多次翻转在实际界面中的可达性。
  **进一步探讨**：打开两个会话并记录挂载数及单次按键触发次数。
- 没有选型耗时、误选率及动画资源测量。
  **影响**：不能定量确认交互收益。
  **进一步探讨**：对同一批模型切换任务比较原生控件与替换控件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可否让装饰和真实能力更清楚？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的能力语义分层方案，将 fast 更名为动画效果并明确不影响请求速度，保留真实 reasoningEffort 滑块；配色快捷键由单一生命周期所有者注册，以一次按键设置显式目标状态而非多个控件竞争翻转。推导来自 Q02 的请求字段边界和 Q03 的共享 store。新增负担是状态迁移、全局监听释放与文案理解检查。最小验证覆盖两会话挂载、热重载与卸载，要求一次按键只开关一次；再让用户预测下一请求参数和速度，比较误解率。若改名仍让用户认为会加速请求，或单一监听在重载后丢失，则不能认为方案成立。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2503-2517](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/blob/bc18b1a14422f08ea36f7b0f57cf26da07807af0/lib/client.js#L2503-L2517)

实际请求字段不含 fast，是语义分层的依据。

<details>
<summary>查看原文（15行）</summary>

```text
      const applyLevel = (index, options) => {
        const choice = levels[index]
        if (choice === undefined || current === null) return
        if (options?.announceTop === true && levels.length > 1 && index === levels.length - 1) {
          showQuota()
        }
        submit(
          {
            provider: current.provider,
            model: current.model,
            ...(choice.effort === undefined ? {} : { reasoningEffort: choice.effort }),
          },
          false,
        )
      }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:2107-2126](https://github.com/AprilCrystal/dsh-client-ui-gpt-helper/blob/bc18b1a14422f08ea36f7b0f57cf26da07807af0/lib/client.js#L2107-L2126)

按控件注册全局监听是单一生命周期设计的推导依据。

<details>
<summary>查看原文（20行）</summary>

```text
        () => CONFIG_STORE.getSnapshot(),
      )

      React.useEffect(() => {
        const parsed = parseHotkey(config.hotkey)
        const onKeyDown = (event) => {
          if (!hotkeyMatches(event, parsed)) return
          event.preventDefault()
          event.stopPropagation()
          PANEL_STORE.replace({ open: !PANEL_STORE.getSnapshot().open })
        }
        document.addEventListener('keydown', onKeyDown, true)
        return () => {
          document.removeEventListener('keydown', onKeyDown, true)
        }
      }, [config.hotkey])

      const close = React.useCallback(() => PANEL_STORE.replace({ open: false }), [])
      return [open, close]
    }
```

</details>

#### 缺口

- 方案未实现，用户理解未测。
  **影响**：不能计入现有交互贡献。
  **进一步探讨**：制作文案与监听所有权原型，做参数理解及生命周期对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
