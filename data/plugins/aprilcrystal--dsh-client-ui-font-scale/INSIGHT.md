# DSH 会话字号控制

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8b2d199](https://github.com/AprilCrystal/dsh-client-ui-font-scale/tree/8b2d199906f400a0e6403b21c743b0f5ce577f4a)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：为 DSH 会话字号添加输入栏步进器、快捷键和 Ctrl 滚轮。

> **亮点**：[Q01](#research-q01) 新增输入栏、按键和滚轮操作面。

> **主要限制**：[Q03](#research-q03) 全局滚轮截获不等同于全页缩放。

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
  - [Q01 · 已有字号设置时为什么还需要？](#detail-section-11)
  - [Q02 · 按钮、快捷键和滚轮如何同步？](#detail-section-12)
  - [Q03 · 对全页缩放有什么影响？](#detail-section-13)
  - [Q04 · 怎样试用并退出？](#detail-section-14)
  - [Q05 · 仅输入栏范围截获会更合适吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复调会话字号的人可直接使用输入栏控件。

原生设置可调字号，但需进入设置页。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 字号 | 调整会话文字 | 依赖主题服务 |
| 滚轮 | 加速调节 | 会覆盖对应全页手势 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 及主题服务 | 必需 | 挂载并写字号 | 使用原设置 |
| 快捷键服务 | 按键需要 | 注册动作 | 用按钮 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 启用 | 核对原生读数 | 看是否同步 |
| 调整 | 测快捷键与滚轮 | 验证缩放边界 |
| 退出 | 移除插件 | 必要时重置宿主字号 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 安装耗时未知 | 支持角色 API |
| 持续 | 运行开销未知 | 操作耗时未知 | 主题写入 |
| 恢复 | 恢复开销未知 | 排查耗时未知 | 可使用原设置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话字号 | 多入口写同一角色 | 真实兼容和无障碍体验 |

> **思考**：[Q03](#research-q03) 全局滚轮截获不等同于全页缩放。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 新增输入栏、按键和滚轮操作面。

字号存储复用宿主，监听在 effect 退场。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 全局滚轮截获不等同于全页缩放。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先测试按钮和已有浏览器缩放习惯。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的字号写入宿主、按键范围与滚轮拦截。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的字号写入宿主、按键范围与滚轮拦截。未执行目标代码或实际宿主验证。
- 下一步：用鼠标与触控板分别对照

**分析版本**

- **仓库**：[AprilCrystal/dsh-client-ui-font-scale](https://github.com/AprilCrystal/dsh-client-ui-font-scale)
- **版本号**：0.1.1（[固定提交 8b2d199](https://github.com/AprilCrystal/dsh-client-ui-font-scale/tree/8b2d199906f400a0e6403b21c743b0f5ce577f4a)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 验证限定滚轮作用域。

用鼠标与触控板分别对照

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 268 | 175 | 77 | — |
| .md | source | 1 | 195 | — | — | 1291 |
| .mjs | source | 1 | 157 | 113 | 30 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AprilCrystal/dsh-client-ui-font-scale/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AprilCrystal/dsh-client-ui-font-scale/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AprilCrystal/dsh-client-ui-font-scale/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：字号写入宿主、按键范围与滚轮拦截

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有字号设置时为什么还需要？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它把控制放进输入栏，减少离开会话打开设置的操作。源码仍向同一个 theme 服务写 text 角色，与宿主设置共享当前值；增量在控制位置和快捷方式。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-35](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/README.md#L10-L35)

已有设置、按钮和替代

<details>
<summary>查看原文（26行）</summary>

```text
## Why this exists

DSH already ships a conversation font-size setting — **Settings → General → 字号大小 / Font size**,
contributed by `@deepseek-ai/dsh-client-ui-theme`. Its copy is explicit that it *"only affects
conversation content"*, which is exactly the right scope.

This plugin does not replace or reimplement it. It adds the input surfaces that setting lacks:

- reaching it takes four clicks, so it is easy to forget it exists;
- there is no keyboard shortcut for it anywhere in the shipped shortcuts registry;
- there is no wheel gesture for it.

Every control here writes through the **same** `theme.setFontSize('text', px)` entry point the shipped
row uses, so the two can never disagree.

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

**依据 2 · 源码核查**：[lib/client.js:119-132](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/lib/client.js#L119-L132)

读取与写入宿主字号

<details>
<summary>查看原文（14行）</summary>

```text
      const ROLE = 'text'

      const current = () => themeOf()?.getTheme().fontSizes?.[ROLE] ?? DEFAULT
      const write = (px) => {
        const theme = themeOf()
        if (theme === undefined) return
        const next = clamp(px)
        if (next === current()) return
        // `setFontSize(role, px)`, not `setFontSize(px)`: a bare number is read as the
        // role, and the service then throws while formatting its own error message
        // (`spec.min` on an undefined spec), so every click died before writing.
        theme.setFontSize(ROLE, next)
      }
      const step = (delta) => write(current() + delta)
```

</details>

**依据 3 · 源码核查**：[lib/client.js:247-257](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/lib/client.js#L247-L257)

注册输入栏插槽

<details>
<summary>查看原文（11行）</summary>

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
    }
```

</details>

#### 缺口

- 未测实际节时
  **影响**：不知道使用频率
  **进一步探讨**：比较一次调节的步骤

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 按钮、快捷键和滚轮如何同步？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

控制从同一主题快照读数，写入会先 clamp 并略过未变化值。快捷键经宿主注册，滚轮在非被动监听中按间隔步进，释放 effect 时移除监听。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:119-132](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/lib/client.js#L119-L132)

同步入口

<details>
<summary>查看原文（14行）</summary>

```text
      const ROLE = 'text'

      const current = () => themeOf()?.getTheme().fontSizes?.[ROLE] ?? DEFAULT
      const write = (px) => {
        const theme = themeOf()
        if (theme === undefined) return
        const next = clamp(px)
        if (next === current()) return
        // `setFontSize(role, px)`, not `setFontSize(px)`: a bare number is read as the
        // role, and the service then throws while formatting its own error message
        // (`spec.min` on an undefined spec), so every click died before writing.
        theme.setFontSize(ROLE, next)
      }
      const step = (delta) => write(current() + delta)
```

</details>

**依据 2 · 源码核查**：[lib/client.js:155-169](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/lib/client.js#L155-L169)

滚轮与解绑

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

**依据 3 · 源码核查**：[lib/client.js:179-202](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/lib/client.js#L179-L202)

快捷键注册

<details>
<summary>查看原文（24行）</summary>

```text
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
        }
      }
      if (typeof ctx.inject === 'function') ctx.inject(['shortcuts'], registerShortcuts)
      else registerShortcuts(ctx)
```

</details>

#### 缺口

- 未运行不同宿主
  **影响**：按键冲突未知
  **进一步探讨**：测试按键和默认设置互改

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 对全页缩放有什么影响？

**研究主题**：缺陷与关键质疑

#### 完整回答

滚轮处理在检查冷却及是否实际写入前调用 preventDefault。因此 Ctrl 滚轮即使处于字号上限或 theme 尚未就绪，也可能被吞掉。插件只写 text，不替代终端、代码和页面整体缩放。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:119-131](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/lib/client.js#L119-L131)

只写 text 角色

<details>
<summary>查看原文（13行）</summary>

```text
      const ROLE = 'text'

      const current = () => themeOf()?.getTheme().fontSizes?.[ROLE] ?? DEFAULT
      const write = (px) => {
        const theme = themeOf()
        if (theme === undefined) return
        const next = clamp(px)
        if (next === current()) return
        // `setFontSize(role, px)`, not `setFontSize(px)`: a bare number is read as the
        // role, and the service then throws while formatting its own error message
        // (`spec.min` on an undefined spec), so every click died before writing.
        theme.setFontSize(ROLE, next)
      }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:155-169](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/lib/client.js#L155-L169)

先阻止默认动作

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

- 未测不同浏览器缩放
  **影响**：不能判断无障碍体验
  **进一步探讨**：在字号边界对照浏览器手势

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

用有角色字号 API 的 DSH Web profile，核对按钮、快捷键和原设置读数。若需要保留浏览器 Ctrl 滚轮语义，移除包并使用原生设置。代码有解绑，字号最终值是否保留按宿主设置核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-57](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/README.md#L37-L57)

版本和卸载

<details>
<summary>查看原文（21行）</summary>

````text
## Requirements

- DeepSeek Harness with the Web client (the `desktop` profile, or any profile mounting
  `@deepseek-ai/dsh-web-app`).
- A theme service that exposes `setFontSize(role, px)` — i.e. `@deepseek-ai/dsh-client-ui-theme`,
  which ships in the default composition. **DSH 0.2.1 or newer**: that release split the single font
  size into the `text` / `code` / `terminal` roles, and this plugin drives `text`.
- No build step and no runtime dependencies beyond the browser module table.

## Install

This package is a **dsh bundle**: `package.json` declares `dsh.bundle.patch`, so dsh treats
[`cordis.patch.yml`](cordis.patch.yml) as a composition layer and mounts it for you.

```sh
dsh plugin --profile <profile> add dsh-client-ui-font-scale
```

That installs the package into the profile and appends it to the profile's bundle list. The profile
is watched, so dsh recomposes without a restart. Remove it with
`dsh plugin --profile <profile> remove dsh-client-ui-font-scale`.
````

</details>

**依据 2 · 源码核查**：[lib/client.js:148-169](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/lib/client.js#L148-L169)

样式与事件清理

<details>
<summary>查看原文（22行）</summary>

```text
      ctx.effect(() => {
        const el = document.createElement('style')
        el.textContent = CSS
        document.head.appendChild(el)
        return () => el.remove()
      }, `${NS}: styles`)

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

- 未运行安装卸载
  **影响**：持久状态及冲突未知
  **进一步探讨**：在测试 profile 先改回默认再移除

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 仅输入栏范围截获会更合适吗？

**研究主题**：新假设与验证

#### 完整回答

比较当前窗口级监听与限定会话区域的方案，记录调字成功率及浏览器缩放误触。如果限定区域使用户常常无法调整而误触下降很少，就保持现有行为。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:155-169](https://github.com/AprilCrystal/dsh-client-ui-font-scale/blob/8b2d199906f400a0e6403b21c743b0f5ce577f4a/lib/client.js#L155-L169)

窗口级滚轮

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

- 无用户操作样本
  **影响**：价值未知
  **进一步探讨**：用鼠标与触控板分别对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
