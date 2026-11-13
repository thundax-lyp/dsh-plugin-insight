# DSH Computer Use

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3760a60](https://github.com/copylee711/dsh-computer-use/tree/3760a60159de5a79d514329d5e676635b6e38348)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/copylee711/dsh-computer-use) [![npm 30d 10,051](https://img.shields.io/static/v1?label=npm+30d&message=10%2C051&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@copylee/dsh-computer-use) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@copylee/dsh-computer-use)
<!-- END META -->

> **功能**：通过 DSH 在 Windows 查看桌面并操控窗口、应用和浏览器。

> **亮点**：将截图、应用上下文和命名控件接入 DSH，并在部分窗口变化时停下，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：访问层对无法识别窗口无拒绝判定，批次中断也不会撤销先前动作，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 对需要可见界面的 Windows 检查，宿主工具能减少什么？](#detail-section-11)
  - [Q02 · 用户接管或动作失败时，已完成和剩余动作如何处理？](#detail-section-12)
  - [Q03 · 应用授权和共享浏览器保护究竟检查哪一层？](#detail-section-13)
  - [Q04 · 用什么任务检验动作可控，怎样恢复人工操作？](#detail-section-14)
  - [Q05 · 把无法确认目标变为输入前复核能否减少误操作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合有独立 Windows 测试桌面并需要复核 GUI 状态的开发者，见 [Q01](#research-q01)。

由人操作并核对屏幕，或对稳定流程用专用 GUI 测试脚本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面观察 | 截图和读窗口 | 视觉能力及系统限制 |
| 应用操作 | 点击、键盘与批次 | 应用许可和真实目标约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows 与声明版本 DSH | 必需 | 挂载宿主及 native helper | 非 Windows 不注册 |
| 应用会话许可 | 按配置 | 通过权限判断 | 未许可可能拒绝 |
| 可识别前景窗口 | 目标操作时 | 确认发送对象 | 需观察或人工 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 启用独立测试桌面 | 无真实账户资料 |
| 检查 | 做一次可逆任务并验证中断 | 独立确认画面 |
| 退出 | 无法确认结果就人工接管 | 查看先前动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Windows 环境及 helper | 核部署和权限 | 未知耗时 |
| 持续 | 截图和模型请求 | 复核目标及结果 | 费用未知 |
| 恢复 | 可能重做模型任务 | 查看实际桌面再决定 | 不假定批次回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| GUI 输入 | 有命名与坐标路径 | 真实目标命中率 |
| 接管 | 暂停和部分执行回报 | 实际焦点竞态 |

> **思考**：访问层对无法识别窗口无拒绝判定，批次中断也不会撤销先前动作，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将截图、应用上下文和命名控件接入 DSH，并在部分窗口变化时停下，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

命名操作在执行前复核窗口及命中目标，能收窄陈旧引用。工具无明确回执时应保留结果未知，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

访问层对无法识别窗口无拒绝判定，批次中断也不会撤销先前动作，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在无账户数据的独立 Windows 测试桌面检查一项可逆操作，失去目标就人工接管，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认 Windows 宿主挂载和输入检查。未验证系统权限、真实焦点时序和人工接管效果。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/computer.ts、src/tools.ts、package.json、src/access.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对 Windows 入口、代表性动作、批次、授权与浏览器条件。未运行系统、模型和 helper。
- 下一步：对计算器及测试浏览器模拟切窗和接管，独立检查输入是否停下和实际屏幕。

**分析版本**

- **仓库**：[copylee711/dsh-computer-use](https://github.com/copylee711/dsh-computer-use)
- **版本号**：0.8.3（[固定提交 3760a60](https://github.com/copylee711/dsh-computer-use/tree/3760a60159de5a79d514329d5e676635b6e38348)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

对高副作用输入增加可验证窗口和新鲜画面的约束，测试是否减少错投，见 [Q05](#research-q05)。

对计算器及测试浏览器模拟切窗和接管，独立检查输入是否停下和实际屏幕。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 612 | — | — | 13178 |
| .mjs | source | 3 | 332 | 286 | 31 | — |
| .ts | source | 27 | 5455 | 4462 | 583 | — |
| .ts | test | 12 | 1414 | 1262 | 31 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/copylee711/dsh-computer-use/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对 Windows 工具如何操作可见目标，辨别应用授权、批次停止和结果边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对需要可见界面的 Windows 检查，宿主工具能减少什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用者是有独立 Windows 测试桌面、要检查计算器结果或其他可逆 GUI 步骤的开发者。对照人工逐步点按，扩展把截图、命名控件和输入交给同一个 DSH 会话。宿主只在 Windows 注册，调用可交给原生 helper，浏览器设置只是控制面。比通用坐标动作多出的机制是用 UI Automation 找命名目标并核对窗口进程和遮挡。自绘区域缺少可匹配控件时仍要靠图像或人工。合格结果应是独立看到预期界面而非只读工具的成功文本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-38](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/README.md#L14-L38)

作者定位与测试任务。

<details>
<summary>查看原文（25行）</summary>

```text
## 可以用它做什么

| 场景 | 可以交给 DSH 的任务 |
| --- | --- |
| 浏览器 | 用当前已打开的 Chrome，在同一窗口的新标签打开网址，填写表单并检查确认提示。 |
| 办公软件 | 在 Word、WPS 或记事本中输入和整理内容，按指定位置保存，再确认文件名。 |
| 桌面应用 | 打开计算器、文件资源管理器等应用，操作菜单或对话框，再读出屏幕上的结果。 |

## 一次操作是怎么完成的

- **先看清界面。** 模型可以读截图，也可以通过 Windows UI Automation 获取按钮、输入框及其内容。例如，直接定位「按钮:提交报名」；同名控件还能用 AutomationId 区分。截图上的坐标由插件换算，适配 Windows 的缩放和多显示器。
- **连续完成几步。** 「填字段 → 提交 → 等成功提示」可以放进同一个批次。等待条件满足就继续，结束时等画面稳定再回传截图，也可以只读出窗口文字。
- **处理常用应用时参考操作笔记。** 插件内置 Word、Excel、Chrome 等应用的技能，模型打开对应应用时会收到常用快捷键和操作步骤。你可以在设置页查看或编辑这些笔记。

## 操控期间，你仍然掌握主动权

默认按应用授权，DSH 会在需要时请求操作目标应用。开始操控后，橙色光晕标出操控状态，迷你卡片上方显示 DSH 提供的思考内容，下方保留操作时间线。按 **Esc** 暂停或继续，点 **停止** 结束本轮。你也可以直接在卡片上输入新指令，或者亲自接手键盘。

正文一开始输出，就回到 DSH 对话阅读。桌面版会恢复窗口并切回前台，Web GUI 会尝试回到任务开始时识别到的活动 DSH 标签。可查看[暂停时的卡片](assets/demo-paused.png)和[任务结束的画面](assets/demo-complete.png)。授权范围、截图和剪贴板的处理规则见[数据与权限](docs/privacy.md)。

## 安装并试一次

需要 **Windows 10 2004+ 或 Windows 11**，以及 **DeepSeek Harness 0.2.0-rc.2 或更新版本**。在 DSH 桌面版的 **插件 → 添加插件** 中输入 `@copylee/dsh-computer-use`，安装后启用。

第一次可以试试「打开计算器，算 1234 × 5678，然后读出结果」。支持图片输入的模型可以看截图；纯文本模型可以读取应用提供的无障碍控件和窗口文字。游戏、画布和部分自绘界面可能需要截图定位。Web GUI 安装方式和常见问题见[安装与排障](docs/getting-started.md)。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:148-168](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/index.ts#L148-L168)

Windows 检查和 native helper 接线。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  if (process.platform !== 'win32') {
    ctx.logger.warn('dsh-computer-use only supports Windows; no tools registered.')
    return
  }
  const settings = (): Settings => {
    const resolved = resolveConfig(config)
    const port = ctx.get('webServer')?.port
    if (!resolved.harnessUrl && port) resolved.harnessUrl = `http://127.0.0.1:${port}`
    return resolved
  }
  const log = (message: string): void => ctx.logger.info(message)
  // Commands that koffi can take run in-process (no exe for Smart App Control to refuse); the rest go to the C# helper.
  const helper = new NativeHelper(new HelperClient(message => ctx.logger.warn(message)), message => ctx.logger.warn(message), () => settings().nativeHelper)
  const access = new AccessControl()
  const iconPath = helperAssetPath('deepseek-white.png')
  const overlay = new OverlayController(helper, settings, log, iconPath)
  const computer = new Computer(helper, access, overlay, settings)
  overlay.onRelease = () => computer.releaseHeld()
  ctx.effect(() => () => {
    void overlay.end().finally(() => helper.dispose())
```

</details>

**依据 3 · 源码核查**：[src/index.ts:220-228](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/index.ts#L220-L228)

实际注册模型工具。

```text
        session: exec.agent?.session.id ?? 'default',
        agent: exec.agent,
        signal: exec.signal,
        vision: await supportsVision(exec.agent, exec.signal),
        autoApprove: exec.agent !== undefined && approvalPolicy(exec.agent) === 'never',
      }
    },
  })
  for (const tool of tools) ctx.effect(() => ctx.tools.register(tool), `computer-use: tool ${tool.name}`)
```

**依据 4 · 源码核查**：[src/computer.ts:525-550](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/computer.ts#L525-L550)

命名目标再次核对身份。

<details>
<summary>查看原文（26行）</summary>

```text
  private async checkNamed(call: CallContext, win: WindowInfo): Promise<BrowserTab | undefined> {
    const current = await this.foreground()
    if (current?.hwnd !== win.hwnd || current.pid !== win.pid) throw new Error('The named target window changed. Look again before acting.')
    return this.assertAllowed(call, current, 'act on')
  }

  private async checkNamedPoint(call: CallContext, point: Point, window: WindowInfo, element: UiElement): Promise<WindowInfo> {
    this.checkWebContent(await this.checkNamed(call, window), point)
    const hit = await this.windowAt(point)
    if (!hit || hit.pid !== window.pid || hit.hwnd !== (element.windowHwnd ?? window.hwnd))
      throw new Error('Another window covers the named target. Look again before acting.')
    if (hit.hwnd !== window.hwnd && !isBrowser(window)) await this.assertAllowed(call, hit, 'click')
    return hit
  }

  private async semanticAction(call: CallContext, named: { window: WindowInfo; element: UiElement; point: Point }, action: 'focus' | 'invoke'): Promise<boolean> {
    const { window, element, point } = named
    const hit = await this.checkNamedPoint(call, point, window, element)
    if (!element.runtimeId || hit.hwnd !== window.hwnd) return false
    if (call.signal.aborted) throw new Error('Cancelled.')
    const result = await this.helper.call<{ performed: boolean }>('act', {
      hwnd: window.hwnd, pid: window.pid, ...point, runtimeId: element.runtimeId, action,
    }, 4000)
    if (result?.performed === true) return true
    if (result?.performed !== false) throw new Error('UI Automation did not confirm whether the action ran. Look again before retrying.')
    return false
```

</details>

#### 缺口

- 真实自绘应用中的定位率未知
  **影响**：无法判断可替代哪类重复测试
  **进一步探讨**：用可访问控件和自绘界面做相同检查对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 用户接管或动作失败时，已完成和剩余动作如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

批次逐步运行，最多三十项。检测用户输入或动作异常时停止剩余步骤，保留先前步骤的文本并拍当前屏幕。单步运行能检测显式暂停和前景窗口变化，返回 skipped 要求重新看图；接收不到 UI Automation 是否执行的确认也抛错。已经发出的动作没有事务回滚。恢复前需要对照屏幕及目标应用实际状态，尤其在提交、关闭或输入前后，不能仅因批次失败重跑整段。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:154-195](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/tools.ts#L154-L195)

逐步执行、停止与已完成清单。

<details>
<summary>查看原文（42行）</summary>

```text
    async execute(args, exec): Promise<Value> {
      const call = await host.context(exec)
      const actions = (args as { actions: ActionInput[] }).actions
      const finish = (args as { finish?: string }).finish ?? 'screenshot'
      let zoomed: Shot | undefined
      if (!Array.isArray(actions) || actions.length === 0) throw new Error('actions must be a non-empty array.')
      if (actions.length > 30) throw new Error('At most 30 actions per batch.')
      const lines: string[] = []
      let failure: string | undefined
      for (const [index, input] of actions.entries()) {
        if (input.action === 'screenshot' || (input.action === 'zoom' && index !== actions.length - 1)) {
          failure = `#${index + 1} ${input.action}: ${input.action === 'zoom' ? 'only allowed as the last action of a batch' : 'not allowed in a batch'}.`
          break
        }
        try {
          const stepStart = Date.now()
          // The zoom is of what the earlier actions left on screen, once it has settled.
          if (input.action === 'zoom' && index > 0) await computer.settle(call.signal)
          const outcome = await computer.run(input, call)
          if (input.action === 'zoom') zoomed = outcome.image
          if (outcome.skipped) { failure = `#${index + 1} ${input.action} skipped: the user was typing on the keyboard. Re-check the screen before continuing.`; break }
          lines.push(`#${index + 1} ${outcome.text}`)
          await sleep(60, undefined, { signal: call.signal })
          if (computer.settings().pauseOnUserInput && computer.overlay.userTypedSince(stepStart - 1)) {
            failure = `#${index + 1} done, but the user typed on the keyboard meanwhile; remaining actions stopped. Re-check the screen before continuing.`
            break
          }
        } catch (error) {
          if (call.signal.aborted) { await computer.releaseHeld(); throw error }
          failure = `#${index + 1} ${input.action} failed: ${error instanceof Error ? error.message : String(error)}`
          break
        }
      }
      const done = lines.join('\n')
      const summary = failure === undefined
        ? `All ${actions.length} actions done.\n${done}`
        : `Stopped: ${failure}${done ? `\nCompleted before it:\n${done}` : ''}\nRemaining actions were skipped.`
      if (zoomed !== undefined && failure === undefined) return withShot(host, summary, zoomed, call)
      // A failed batch always shows the screen: the model has to see where it stopped.
      if (failure === undefined && finish === 'none') return { text: `${summary}\n${await computer.describeForeground()}` }
      if (failure === undefined && finish === 'text') {
        await computer.settle(call.signal)
```

</details>

**依据 2 · 源码核查**：[src/computer.ts:633-665](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/computer.ts#L633-L665)

暂停、接管及窗口变更。

<details>
<summary>查看原文（33行）</summary>

```text
  async run(input: ActionInput, call: CallContext): Promise<ActionOutcome> {
    if (call.signal.aborted) throw new Error('Cancelled.')
    await this.overlay.begin(call.agent, Computer.statusOf(input))
    const { action } = input
    const s = this.settings()
    const wasPaused = this.overlay.paused
    if (await this.overlay.yieldToUser(call.signal, s.pauseOnUserInput && INPUT.has(action)) && INPUT.has(action)) {
      // The screen may have changed under the model's feet: re-plan from a fresh look.
      await this.overlay.begin(call.agent, Computer.statusOf(input))
      const why = wasPaused ? 'the user paused computer use (Esc) and has now resumed' : 'the user was typing on the keyboard, so you were paused until they stopped'
      return {
        text: `Not done: ${why}. ${action} was NOT performed. Look at the new screenshot and re-plan before acting.`,
        ...(call.vision ? { image: await this.screenshot() } : {}),
        skipped: true,
      }
    }
    if (s.pauseOnUserInput && INPUT.has(action)) {
      const changed = await this.foregroundChanged()
      // Clicking into the DeepSeek Harness card is the user reading the chat, not a new task.
      if (changed && !isHostWindow(changed) && !isTransientShell(changed)) {
        await this.overlay.status('检测到窗口切换，重新查看屏幕')
        const image = call.vision ? await this.screenshot() : undefined
        if (!image) this.seen = changed
        return {
          text: `Not done: since your last look the foreground window changed to ${changed.exe} ("${changed.title.slice(0, 60)}") without you acting, most likely the user opened it. ${action} was NOT performed. Look at the new screenshot and decide whether to continue there, switch back, or ask the user.`,
          ...(image ? { image } : {}),
          skipped: true,
        }
      }
    }
    // From here the agent itself may change the foreground; only a new look re-arms the check.
    if (INPUT.has(action)) this.seen = undefined
    if (KEYBOARD.has(action)) await this.refocusFromHost()
```

</details>

**依据 3 · 源码核查**：[src/computer.ts:540-550](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/computer.ts#L540-L550)

无明确结果时要求先重新看。

<details>
<summary>查看原文（11行）</summary>

```text
  private async semanticAction(call: CallContext, named: { window: WindowInfo; element: UiElement; point: Point }, action: 'focus' | 'invoke'): Promise<boolean> {
    const { window, element, point } = named
    const hit = await this.checkNamedPoint(call, point, window, element)
    if (!element.runtimeId || hit.hwnd !== window.hwnd) return false
    if (call.signal.aborted) throw new Error('Cancelled.')
    const result = await this.helper.call<{ performed: boolean }>('act', {
      hwnd: window.hwnd, pid: window.pid, ...point, runtimeId: element.runtimeId, action,
    }, 4000)
    if (result?.performed === true) return true
    if (result?.performed !== false) throw new Error('UI Automation did not confirm whether the action ran. Look again before retrying.')
    return false
```

</details>

#### 缺口

- 前景窗口和输入在检查到派发间的竞态未实测
  **影响**：不能把检查解释为所有动作都锁住目标
  **进一步探讨**：在一次性桌面注入切窗与中断，逐步核查结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 应用授权和共享浏览器保护究竟检查哪一层？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

工具可为会话保存应用许可，宿主预执行拦截将申请接到 DSH 审批，never 策略会通过。动作前按窗口身份、阻止项和会话许可判定。若没有窗口或 exe 为空，访问层没有给出拒绝，能否实际注入还取决于系统和后续操作路径。对配置了 Harness 地址的浏览器路径，还会拒绝 Harness 标签或无法验证的标签。该机制可减少特定误操作，屏幕和输入仍是宿主桌面资源，不能把会话应用列表当成桌面隔离。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:42-60](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/package.json#L42-L60)

平台与宿主声明。

<details>
<summary>查看原文（19行）</summary>

```text
  "os": [
    "win32"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "engines": {
      "dsh": ">=0.2.0-rc.2"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:488-505](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/tools.ts#L488-L505)

实际应用申请及会话记录。

<details>
<summary>查看原文（18行）</summary>

```text
  tools.push(defineTool({
    name: 'request_access',
    description: 'Ask the user to let you control specific apps in this session (they approve in DeepSeek Harness). Call it before acting on an app, listing every app the task needs, e.g. ["Chrome", "记事本"]. Input to apps that are not granted is refused.',
    parameters: {
      apps: { type: 'array', items: { type: 'string' }, required: true, description: 'App names (Start-menu names or .exe names).' },
      reason: { type: 'string', description: 'One sentence on why, shown to the user.' },
    },
    output,
    async execute(args, exec): Promise<Value> {
      const call = await host.context(exec)
      const apps = ((args as { apps: string[] }).apps ?? []).map(String).filter(app => app.trim() !== '')
      if (apps.length === 0) throw new Error('apps must list at least one app.')
      if (computer.settings().accessMode === 'allow-all') {
        return { text: 'Access mode is "allow all": every app except DeepSeek Harness and blocked apps can be controlled. No approval needed.' }
      }
      if (apps.some(app => normalizeApp(app).includes('deepseek harness'))) throw new Error('DeepSeek Harness itself cannot be controlled.')
      computer.access.grant(call.session, apps)
      return { text: `Granted for this session: ${computer.access.granted(call.session).join(', ')}. Open or focus them with open_application.` }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:231-247](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/index.ts#L231-L247)

宿主预执行审批及 never 分支。

<details>
<summary>查看原文（17行）</summary>

```text
  // request_access goes through DSH's own approval prompt.
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (exec.name !== 'request_access' || settings().accessMode !== 'per-app') return next()
    const agent = exec.agent as AgentLike | undefined
    const apps = ((exec.arguments as { apps?: unknown } | undefined)?.apps ?? []) as unknown[]
    const names = apps.map(String).filter(app => app.trim() !== '' && !normalizeApp(app).includes('deepseek harness'))
    const session = agent?.session.id ?? 'default'
    const missing = access.missing(session, names)
    if (missing.length === 0) return next()
    const approval = (ctx as unknown as { get(name: string): unknown }).get('approval') as { effectivePolicy?(session: unknown): string } | undefined
    // "never" comes from the full-access / auto presets: the user opted out of
    // prompts, so grant without asking (the host window and blocked apps stay off-limits).
    if (agent && approval?.effectivePolicy?.(agent.session) === 'never') return next()
    const reason = String((exec.arguments as { reason?: unknown } | undefined)?.reason ?? '').slice(0, 200)
    return {
      kind: 'ask',
      reason: `Control these apps with mouse and keyboard: ${missing.join(', ')}`,
```

</details>

**依据 4 · 源码核查**：[src/access.ts:132-142](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/access.ts#L132-L142)

应用拒绝条件以及窗口未知分支。

<details>
<summary>查看原文（11行）</summary>

```text
  denial(session: string, win: WindowLike | undefined, mode: AccessMode, blocked: readonly string[], action: string): string | undefined {
    if (!win || win.exe === '') return undefined // desktop background, secure desktop or an elevated window we cannot inspect
    const label = `${win.exe}${win.title ? ` ("${win.title.slice(0, 60)}")` : ''}`
    if (isHostWindow(win)) {
      return `Refused to ${action} ${label}: that is the DeepSeek Harness window you are chatting through. Bring the target app to the front first (open_application or windows focus), or minimize DeepSeek Harness.`
    }
    if ([...DEFAULT_BLOCKED, ...blocked].some(name => appMatches(name, win))) {
      return `Refused to ${action} ${label}: this app is blocked for computer use in the plugin settings. Ask the user to do this step themselves.`
    }
    if (mode === 'allow-all' || this.isGranted(session, win)) return undefined
    return `Refused to ${action} ${label}: the app is not granted for this session. Call request_access with this app's name first (granted so far: ${this.granted(session).join(', ') || 'none'}).`
```

</details>

**依据 5 · 源码核查**：[src/computer.ts:376-405](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/computer.ts#L376-L405)

浏览器与工作页内容检查。

<details>
<summary>查看原文（30行）</summary>

```text
  async assertAllowed(call: CallContext, win: WindowInfo | undefined, verb: string): Promise<BrowserTab | undefined> {
    const s = this.settings()
    const reason = this.access.denial(call.session, win, s.accessMode, s.blockedApps, verb)
    if (reason) throw new Error(reason)
    if (win && s.harnessUrl && isBrowser(win)) {
      const shared = this.overlay.isRememberedWebWindow(win)
      const tab = await readBrowserTab(this.helper, win, shared)
      if (isHarnessAddress(tab?.url, s.harnessUrl) || (shared && (!tab?.tab || !this.overlay.isWorkTab(tab.tab))))
        throw new Error('The DeepSeek Harness Web tab is protected. Use open_application with the target URL to open a work tab in the current browser.')
      if (typeof tab?.url !== 'string' || !tab.tab)
        throw new Error('Could not verify the active browser tab. Use open_application with the target URL or switch to a browser window with a visible address bar.')
      if (shared) return tab
    }
  }

  private checkWebContent(tab: BrowserTab | undefined, point: Point): void {
    if (tab && (!tab.content || !contains(tab.content, point)))
      throw new Error('Only the work tab’s page content can be operated in the window containing DeepSeek Harness.')
  }

  private async checkPointer(call: CallContext, point: Point | undefined, verb: string): Promise<void> {
    const target = point ?? await this.cursor()
    this.checkWebContent(await this.assertAllowed(call, await this.windowAt(target), verb), target)
  }

  private async checkKeyboard(call: CallContext, verb: string): Promise<WindowInfo | undefined> {
    const window = await this.foreground()
    const tab = await this.assertAllowed(call, window, verb)
    if (tab && !tab.contentFocused) throw new Error('Focus a control in the work tab’s page before sending keyboard input.')
    return window
```

</details>

#### 缺口

- 高权限窗口、远程桌面和无法识别进程时的操作结果未知
  **影响**：不能将默认授权当成隔离保证
  **进一步探讨**：在无个人数据桌面测试不可识别窗、拒绝及工作标签切换

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 用什么任务检验动作可控，怎样恢复人工操作？

**研究主题**：效果与总成本、采用判断

#### 完整回答

优先观察独立 Windows 桌面的可逆低风险任务。先用计算器检查一个已知结果并验证 Esc 或用户输入能停下后续动作，再与人工完成同一测试对照。按一个独立验收的界面结果记录时间、模型截图输入与人工复核，另记 native helper 部署和权限排查。若无窗口身份、切换后未停或工具不能确定动作是否完成，由人工接管并核对当前屏幕。证据不足以迁入带账户的实际业务桌面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-38](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/README.md#L28-L38)

作者举暂停、接管与计算器。

<details>
<summary>查看原文（11行）</summary>

```text
## 操控期间，你仍然掌握主动权

默认按应用授权，DSH 会在需要时请求操作目标应用。开始操控后，橙色光晕标出操控状态，迷你卡片上方显示 DSH 提供的思考内容，下方保留操作时间线。按 **Esc** 暂停或继续，点 **停止** 结束本轮。你也可以直接在卡片上输入新指令，或者亲自接手键盘。

正文一开始输出，就回到 DSH 对话阅读。桌面版会恢复窗口并切回前台，Web GUI 会尝试回到任务开始时识别到的活动 DSH 标签。可查看[暂停时的卡片](assets/demo-paused.png)和[任务结束的画面](assets/demo-complete.png)。授权范围、截图和剪贴板的处理规则见[数据与权限](docs/privacy.md)。

## 安装并试一次

需要 **Windows 10 2004+ 或 Windows 11**，以及 **DeepSeek Harness 0.2.0-rc.2 或更新版本**。在 DSH 桌面版的 **插件 → 添加插件** 中输入 `@copylee/dsh-computer-use`，安装后启用。

第一次可以试试「打开计算器，算 1234 × 5678，然后读出结果」。支持图片输入的模型可以看截图；纯文本模型可以读取应用提供的无障碍控件和窗口文字。游戏、画布和部分自绘界面可能需要截图定位。Web GUI 安装方式和常见问题见[安装与排障](docs/getting-started.md)。
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:168-193](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/tools.ts#L168-L193)

停止分支与已完成步骤。

<details>
<summary>查看原文（26行）</summary>

```text
        try {
          const stepStart = Date.now()
          // The zoom is of what the earlier actions left on screen, once it has settled.
          if (input.action === 'zoom' && index > 0) await computer.settle(call.signal)
          const outcome = await computer.run(input, call)
          if (input.action === 'zoom') zoomed = outcome.image
          if (outcome.skipped) { failure = `#${index + 1} ${input.action} skipped: the user was typing on the keyboard. Re-check the screen before continuing.`; break }
          lines.push(`#${index + 1} ${outcome.text}`)
          await sleep(60, undefined, { signal: call.signal })
          if (computer.settings().pauseOnUserInput && computer.overlay.userTypedSince(stepStart - 1)) {
            failure = `#${index + 1} done, but the user typed on the keyboard meanwhile; remaining actions stopped. Re-check the screen before continuing.`
            break
          }
        } catch (error) {
          if (call.signal.aborted) { await computer.releaseHeld(); throw error }
          failure = `#${index + 1} ${input.action} failed: ${error instanceof Error ? error.message : String(error)}`
          break
        }
      }
      const done = lines.join('\n')
      const summary = failure === undefined
        ? `All ${actions.length} actions done.\n${done}`
        : `Stopped: ${failure}${done ? `\nCompleted before it:\n${done}` : ''}\nRemaining actions were skipped.`
      if (zoomed !== undefined && failure === undefined) return withShot(host, summary, zoomed, call)
      // A failed batch always shows the screen: the model has to see where it stopped.
      if (failure === undefined && finish === 'none') return { text: `${summary}\n${await computer.describeForeground()}` }
```

</details>

**依据 3 · 源码核查**：[src/access.ts:132-142](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/access.ts#L132-L142)

授权边界。

<details>
<summary>查看原文（11行）</summary>

```text
  denial(session: string, win: WindowLike | undefined, mode: AccessMode, blocked: readonly string[], action: string): string | undefined {
    if (!win || win.exe === '') return undefined // desktop background, secure desktop or an elevated window we cannot inspect
    const label = `${win.exe}${win.title ? ` ("${win.title.slice(0, 60)}")` : ''}`
    if (isHostWindow(win)) {
      return `Refused to ${action} ${label}: that is the DeepSeek Harness window you are chatting through. Bring the target app to the front first (open_application or windows focus), or minimize DeepSeek Harness.`
    }
    if ([...DEFAULT_BLOCKED, ...blocked].some(name => appMatches(name, win))) {
      return `Refused to ${action} ${label}: this app is blocked for computer use in the plugin settings. Ask the user to do this step themselves.`
    }
    if (mode === 'allow-all' || this.isGranted(session, win)) return undefined
    return `Refused to ${action} ${label}: the app is not granted for this session. Call request_access with this app's name first (granted so far: ${this.granted(session).join(', ') || 'none'}).`
```

</details>

#### 缺口

- 缺实际 Windows 授权、接管与任务费用记录
  **影响**：尚不能量化长期适用性
  **进一步探讨**：同一无副作用任务按只读观察、手工、工具三种流程计量

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 把无法确认目标变为输入前复核能否减少误操作？

**研究主题**：新假设与验证

#### 完整回答

可以对会导致外部状态变更的输入要求可验证窗口身份和新近画面，并在不满足时只返回观察。相比现行应用授权，增量是无法识别目标时拒绝输入。对照正常控制、短暂切换和不可识别窗口三种条件，统计错误输入及合法动作被挡。若误操作无改善或正常动作阻断太多，应只对高副作用动作加门。

#### 证据与依据

**依据 1 · 源码核查**：[src/access.ts:132-142](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/access.ts#L132-L142)

未知窗口未在访问层拒绝。

<details>
<summary>查看原文（11行）</summary>

```text
  denial(session: string, win: WindowLike | undefined, mode: AccessMode, blocked: readonly string[], action: string): string | undefined {
    if (!win || win.exe === '') return undefined // desktop background, secure desktop or an elevated window we cannot inspect
    const label = `${win.exe}${win.title ? ` ("${win.title.slice(0, 60)}")` : ''}`
    if (isHostWindow(win)) {
      return `Refused to ${action} ${label}: that is the DeepSeek Harness window you are chatting through. Bring the target app to the front first (open_application or windows focus), or minimize DeepSeek Harness.`
    }
    if ([...DEFAULT_BLOCKED, ...blocked].some(name => appMatches(name, win))) {
      return `Refused to ${action} ${label}: this app is blocked for computer use in the plugin settings. Ask the user to do this step themselves.`
    }
    if (mode === 'allow-all' || this.isGranted(session, win)) return undefined
    return `Refused to ${action} ${label}: the app is not granted for this session. Call request_access with this app's name first (granted so far: ${this.granted(session).join(', ') || 'none'}).`
```

</details>

**依据 2 · 源码核查**：[src/computer.ts:525-550](https://github.com/copylee711/dsh-computer-use/blob/3760a60159de5a79d514329d5e676635b6e38348/src/computer.ts#L525-L550)

已有命名目标验证可作为比较。

<details>
<summary>查看原文（26行）</summary>

```text
  private async checkNamed(call: CallContext, win: WindowInfo): Promise<BrowserTab | undefined> {
    const current = await this.foreground()
    if (current?.hwnd !== win.hwnd || current.pid !== win.pid) throw new Error('The named target window changed. Look again before acting.')
    return this.assertAllowed(call, current, 'act on')
  }

  private async checkNamedPoint(call: CallContext, point: Point, window: WindowInfo, element: UiElement): Promise<WindowInfo> {
    this.checkWebContent(await this.checkNamed(call, window), point)
    const hit = await this.windowAt(point)
    if (!hit || hit.pid !== window.pid || hit.hwnd !== (element.windowHwnd ?? window.hwnd))
      throw new Error('Another window covers the named target. Look again before acting.')
    if (hit.hwnd !== window.hwnd && !isBrowser(window)) await this.assertAllowed(call, hit, 'click')
    return hit
  }

  private async semanticAction(call: CallContext, named: { window: WindowInfo; element: UiElement; point: Point }, action: 'focus' | 'invoke'): Promise<boolean> {
    const { window, element, point } = named
    const hit = await this.checkNamedPoint(call, point, window, element)
    if (!element.runtimeId || hit.hwnd !== window.hwnd) return false
    if (call.signal.aborted) throw new Error('Cancelled.')
    const result = await this.helper.call<{ performed: boolean }>('act', {
      hwnd: window.hwnd, pid: window.pid, ...point, runtimeId: element.runtimeId, action,
    }, 4000)
    if (result?.performed === true) return true
    if (result?.performed !== false) throw new Error('UI Automation did not confirm whether the action ran. Look again before retrying.')
    return false
```

</details>

#### 缺口

- 可靠判别高副作用动作和目标信息仍未知
  **影响**：影响误拒和漏拦
  **进一步探讨**：先固定几类可复现动作做对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
