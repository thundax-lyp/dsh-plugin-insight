# dsh-auto-shutdown

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a2af408](https://github.com/873360545/dsh-auto-shutdown/tree/a2af408455e31a0acf4021e3383d1384dcb7aebc)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：Windows 专用设置开关，在根对话结束时安排一次性关机并弹出取消倒计时。

> **核心亮点**：将宿主对话边界、Settings 开关和 Windows 系统关机/撤销做成低操作负担的个人流程；增量在连接和一次性 UX，不在关机命令本身。详见[Q01](#research-q01)。

> **风险与缺陷**：Settings disarm 写失败仍排关机，重启可能保留 enabled；shutdown 异步启动错误后仍可拉起取消弹窗。作者一次性与可取消承诺因此依赖未保证的路径。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要对话结束自动关机，插件相比手动命令的真实增量是什么？](#detail-section-11)
  - [Q02 · 从开关到关机与取消的调用顺序及控制边界是什么？](#detail-section-12)
  - [Q03 · 一次性安全承诺在写入失败或进程启动失败时成立吗？](#detail-section-13)
  - [Q04 · 安装依赖、持续使用与失败恢复分别要付出什么成本？](#detail-section-14)
  - [Q05 · 哪些工程设计值得借鉴，如何最小化一次性状态与系统命令的不一致？](#detail-section-15)
  - [Q06 · 当前版本在何种范围可采用，哪类场景应避免？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供 Windows 用户长对话结束后离开电脑时使用；合格结果是按根回合完成排关机、可撤销且不丢数据。详见[Q01](#research-q01)。

手工 shutdown /s /t 加 shutdown /a 可完成同类 OS 操作；本插件的附加价值取决于宿主边界与一次性状态可靠性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 一次性开关 | 关机意图配置 | Settings 写失败仍继续排程 |
| 回合边界触发 | 根对话结束时排关机 | 仅按当时其他 agent running 状态判断 |
| 倒计时撤销 | 点击运行 shutdown /a | 弹窗可失败，取消成功需核 OS |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows shutdown.exe | 必需 | 排关机和撤销 | 无法执行系统命令 |
| DSH agents/settings 与 client configForms/slots | 必需 | 事件和设置开关 | 无法构成触发链路 |
| PowerShell 5.1/WinForms | 弹窗必需 | 倒计时取消 | 只能手动 shutdown /a |
| 工作已保存 | 安全前提 | 避免关机丢数据 | 需延后启用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在 Windows 安装、重启 Host、设延时并先 dry-run | 配置可写且事件路径符合预期 |
| 启用 | 用户保存工作后打开 Settings 通用页开关 | enabled 已保存 |
| 结束 | 根对话结束后核关机计划和弹窗 | 若异常及时 shutdown /a |
| 撤销/复盘 | 按取消或手工 shutdown /a，核状态 | 不以弹窗出现代替 OS 排程证据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Windows/DSH 机器，金额未知 | 安装、重启、设延时与 dry-run；耗时未知 | 宿主兼容未测 |
| 持续使用 | 额外弹窗进程、延时等待；金额未知 | 保存工作、决定撤销；耗时未知 | 默认 60 秒 |
| 失败恢复 | 未保存数据和重复关机风险；损失未知 | shutdown /a、检查状态与恢复工作；耗时未知 | 写入/进程失败无统一回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 回合边界触发 | 根 agent 和 running 过滤源码 | 宿主实际事件时机与保存完成 |
| 一次性开关 | 内存 fired 和 Settings 复位 | 写失败后重启是否重触发 |
| 可取消关机 | WinForms 按钮调用 shutdown /a | 真实 OS 排程、弹窗启动与取消成功率 |

> **思考**：Settings disarm 写失败仍排关机，重启可能保留 enabled；shutdown 异步启动错误后仍可拉起取消弹窗。作者一次性与可取消承诺因此依赖未保证的路径。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将宿主对话边界、Settings 开关和 Windows 系统关机/撤销做成低操作负担的个人流程；增量在连接和一次性 UX，不在关机命令本身。详见[Q01](#research-q01)。

将宿主对话边界、Settings 开关和 Windows 系统关机/撤销做成低操作负担的个人流程；增量在连接和一次性 UX，不在关机命令本身。详见[Q01](#research-q01)。

宿主配置表单、同步 latch 与可隔离 dry-run 值得借鉴；复位写入和进程启动应有可核状态，再开放真实关机。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Settings disarm 写失败仍排关机，重启可能保留 enabled；shutdown 异步启动错误后仍可拉起取消弹窗。作者一次性与可取消承诺因此依赖未保证的路径。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅建议在隔离 Windows 测试机以 dry-run 和可保存任务观察；关键工作或无人值守场景待一致性故障修正和实测后再评估。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可确认事件/配置/系统命令接线；一次性持久保证与错误反馈存在缺口，未实测 Windows 或目标宿主。改进状态机仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、lib/popup.js、assets/notify.ps1、test-dry-run.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、Host/Client、弹窗脚本、package 与作者测试；未执行目标代码、Windows 命令或宿主验收；旧 META 仅复用。
- 下一步：隔离 Windows/DSH 环境先 dry-run 后真实小样，覆盖 Settings 写失败、spawn 异步 error、弹窗故障、取消失败、重启及并发 agent；核 UI/持久状态/OS 排程一致性。

**分析版本**

- **仓库**：[873360545/dsh-auto-shutdown](https://github.com/873360545/dsh-auto-shutdown)
- **版本号**：0.3.0（[固定提交 a2af408](https://github.com/873360545/dsh-auto-shutdown/tree/a2af408455e31a0acf4021e3383d1384dcb7aebc)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是持久 request id/状态机，确认复位和 OS 排程结果后给出真实 UI 状态，故障注入验证重复触发、错误提示与取消一致性。详见[Q05](#research-q05)。

隔离 Windows/DSH 环境先 dry-run 后真实小样，覆盖 Settings 写失败、spawn 异步 error、弹窗故障、取消失败、重启及并发 agent；核 UI/持久状态/OS 排程一致性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 363 | 282 | 53 | — |
| .md | source | 1 | 148 | — | — | 1020 |
| .mjs | source | 1 | 130 | 111 | 7 | — |
| .mjs | test | 1 | 78 | 68 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/873360545/dsh-auto-shutdown/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/873360545/dsh-auto-shutdown/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/873360545/dsh-auto-shutdown/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows 对话结束后一次性关机是否可靠且可取消，异常路径是否守住用户预期？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要对话结束自动关机，插件相比手动命令的真实增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

场景是 Windows 用户提交一项长对话后离开电脑，希望当前根会话结束才关机并在最后时刻可取消。合格交付需确认用户启用、根回合结束、其他 agent 不再运行、系统成功排定关机且有可见撤销入口。手动 shutdown /s /t 可定时，却不知 DSH 回合边界；本插件的可辨增量是把 Settings 开关、agent/turn-stopping、一次性配置复位及 WinForms 倒计时组合到宿主。它不是新的关机机制，Windows shutdown 命令和宿主事件由外部提供。作者宣称关机和单击取消；固定源码可确认接线，不能确认真实机器执行成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-40](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/README.md#L5-L40)

作者说明一次性开关、关机和取消流程。

<details>
<summary>查看原文（36行）</summary>

````text
A DeepSeek Harness plugin that adds **one switch in Settings → General**: turn it on, and
the computer shuts itself down when the next conversation finishes — with a native
Windows dialog that can cancel the pending shutdown with a single click.

## Install

```powershell
dsh plugin add github:873360545/dsh-auto-shutdown
```

Or install a prebuilt tarball from a GitHub Release:

```powershell
dsh plugin add https://github.com/873360545/dsh-auto-shutdown/releases/latest/download/dsh-auto-shutdown.tgz
```

Then restart the Harness (Host restart is enough) and look for the plugin entry
`auto-shutdown` in the profile.

## Use

1. Open **Settings → General** and find **“Power off after the conversation finishes”**.
2. Turn it on.
3. Finish a conversation: when that turn ends, the plugin
   - resets the switch to off (it is a one-shot trigger, never re-armed by a reboot),
   - schedules `shutdown.exe /s /t <delaySeconds>`,
   - opens a desktop countdown dialog.

The dialog offers:

| Button | Result |
| --- | --- |
| **Cancel shutdown** | runs `shutdown /a`; the machine stays up |
| **Keep shutdown** / close / countdown reaching zero | the planned shutdown happens |

You can also cancel from any terminal with `shutdown /a`.
````

</details>

**依据 2 · 源码核查**：[lib/index.js:70-110](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/index.js#L70-L110)

宿主事件、根 agent 筛选、配置复位及命令调用。

<details>
<summary>查看原文（41行）</summary>

```text
export function apply(ctx, config) {
  const logger = ctx.logger
  let fired = false

  /** Only a user-facing root conversation may arm the shutdown, never a teammate. */
  function isRootAgent(agent) {
    return ctx.agents.roots().some((root) => root.id === agent.id)
  }

  /** Another live agent still running means this is not the last conversation. */
  function anotherAgentRunning(self) {
    return ctx.agents.list().some((agent) => agent.id !== self.id && agent.status === 'running')
  }

  /** Persist enabled=false so a reboot cannot re-arm the one-shot trigger. */
  async function disarm() {
    try {
      await ctx.settings.mutate(name, [{ op: 'set', path: ['enabled'], value: false }])
    } catch (error) {
      logger.warn(`auto-shutdown: could not reset enabled: ${error.message}`)
    }
  }

  // A listener that never objects, so it must not hold the turn boundary open:
  // latch the fact synchronously, then do the write and the spawns off the event.
  ctx.on('agent/turn-stopping', ({ agent }) => {
    if (fired || !config.enabled.get()) return
    if (!isRootAgent(agent)) return
    if (anotherAgentRunning(agent)) return
    fired = true
    const delaySeconds = Math.max(5, Math.round(config.delaySeconds.get()))
    const dryRun = isDryRun()
    const popup = config.popup.get() === true
    void (async () => {
      await disarm()
      scheduleShutdown(logger, delaySeconds, dryRun)
      if (popup) schedulePopup(logger, delaySeconds, dryRun)
    })().catch((error) => {
      logger.error(`auto-shutdown: failed to arm the shutdown: ${error.message}`)
    })
  })
```

</details>

**依据 3 · 源码核查**：[lib/client.js:126-155](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/client.js#L126-L155)

Settings 通用页开关挂载。

<details>
<summary>查看原文（30行）</summary>

```text
    /** Services used by the browser companion. */
    const inject = ['slots', 'locale', 'configForms']

    /**
     * Register the preference row while the Host serves its namespace.
     * @param ctx - browser plugin context.
     */
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(locale, { en, zh }))
      const form = ctx.configForms.get(namespace)
      const face = () => ({
        hooks: { config: form },
        setEnabled: (value) => form.set('enabled', value),
      })
      ctx.effect(() =>
        ctx.configForms.whileServed([namespace], () =>
          ctx.slots.inject('settings.general.item', () =>
            ctx.slots.register(
              {
                name: 'settings.general.item',
                id: namespace,
                order: 18,
                locale,
                inject: face,
              },
              AutoShutdownRow,
            ),
          ),
        ),
      )
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从开关到关机与取消的调用顺序及控制边界是什么？

**研究主题**：功能与机制

#### 完整回答

客户端通过宿主 configForms 的 auto-shutdown namespace 写 enabled。Host 读取 volatile Config，在 agent/turn-stopping 同步判断 enabled、root 身份和其他 running agent，再置内存 fired。随后异步 mutate enabled=false，调用 spawn(shutdown.exe,/s,/t,秒数)，若 popup 为 true 则另起 powershell.exe 加载 notify.ps1。脚本用 Windows Forms 倒计时；取消按钮通过 cmd /c shutdown /a 中止计划，继续/关闭则不执行取消。配置允许 5–86400 秒，默认 60 秒；弹窗可关闭。开关一次性只由内存 fired 与持久 enabled 复位共同保证，后者写失败时仍会继续排关机。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:69-86](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/client.js#L69-L86)

开关保存回执与可写状态。

<details>
<summary>查看原文（18行）</summary>

```text
    function AutoShutdownRow({ useConfig, setEnabled, t }) {
      const config = useConfig((value) => value)
      const [busy, setBusy] = React.useState(false)
      const [notice, setNotice] = React.useState(null)
      const ready = config.status === 'ready'
      const writable = config.writable === true
      const enabled = ready && config.value?.enabled === true
      const toggle = async (event) => {
        event.preventDefault()
        if (busy || !ready || !writable) return
        setBusy(true)
        setNotice(null)
        let accepted = false
        try {
          accepted = await setEnabled(!enabled)
        } catch (_error) {}
        setBusy(false)
        setNotice(accepted ? 'saved' : 'failed')
```

</details>

**依据 2 · 源码核查**：[lib/client.js:133-155](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/client.js#L133-L155)

配置表单向 Settings 写 enabled。

<details>
<summary>查看原文（23行）</summary>

```text
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(locale, { en, zh }))
      const form = ctx.configForms.get(namespace)
      const face = () => ({
        hooks: { config: form },
        setEnabled: (value) => form.set('enabled', value),
      })
      ctx.effect(() =>
        ctx.configForms.whileServed([namespace], () =>
          ctx.slots.inject('settings.general.item', () =>
            ctx.slots.register(
              {
                name: 'settings.general.item',
                id: namespace,
                order: 18,
                locale,
                inject: face,
              },
              AutoShutdownRow,
            ),
          ),
        ),
      )
```

</details>

**依据 3 · 源码核查**：[lib/index.js:17-21](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/index.js#L17-L21)

配置默认值和范围。

```text
export const Config = z.object({
  enabled: z.boolean().default(false).volatile(),
  delaySeconds: z.number().step(1).min(5).max(86400).default(60).volatile(),
  popup: z.boolean().default(true).volatile(),
})
```

**依据 4 · 源码核查**：[lib/index.js:84-110](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/index.js#L84-L110)

先复位后排关机和弹窗。

<details>
<summary>查看原文（27行）</summary>

```text
  /** Persist enabled=false so a reboot cannot re-arm the one-shot trigger. */
  async function disarm() {
    try {
      await ctx.settings.mutate(name, [{ op: 'set', path: ['enabled'], value: false }])
    } catch (error) {
      logger.warn(`auto-shutdown: could not reset enabled: ${error.message}`)
    }
  }

  // A listener that never objects, so it must not hold the turn boundary open:
  // latch the fact synchronously, then do the write and the spawns off the event.
  ctx.on('agent/turn-stopping', ({ agent }) => {
    if (fired || !config.enabled.get()) return
    if (!isRootAgent(agent)) return
    if (anotherAgentRunning(agent)) return
    fired = true
    const delaySeconds = Math.max(5, Math.round(config.delaySeconds.get()))
    const dryRun = isDryRun()
    const popup = config.popup.get() === true
    void (async () => {
      await disarm()
      scheduleShutdown(logger, delaySeconds, dryRun)
      if (popup) schedulePopup(logger, delaySeconds, dryRun)
    })().catch((error) => {
      logger.error(`auto-shutdown: failed to arm the shutdown: ${error.message}`)
    })
  })
```

</details>

**依据 5 · 源码核查**：[assets/notify.ps1:114-201](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/assets/notify.ps1#L114-L201)

倒计时、取消与保持路径。

<details>
<summary>查看原文（88行）</summary>

```text
$countdownTimer = New-Object System.Windows.Forms.Timer
$countdownTimer.Interval = 1000
$countdownTimer.add_Tick({
    $script:remaining = [Math]::Max(0, $script:remaining - 1)
    $headline.Text = ($HeadlineFormat -f $script:remaining)
    if ($script:remaining -le 0) {
      $countdownTimer.Stop()
      $form.Close()
    }
  })

$closeTimer = New-Object System.Windows.Forms.Timer
$closeTimer.Interval = 1800
$closeTimer.add_Tick({
    $closeTimer.Stop()
    $form.Close()
  })

$selfTestTimer = New-Object System.Windows.Forms.Timer
$selfTestTimer.Interval = 2200
$selfTestTimer.add_Tick({
    $selfTestTimer.Stop()
    Write-ProbeLog 'selftest closing'
    $countdownTimer.Stop()
    $form.Close()
  })

function Invoke-Cancel {
  if ($script:cancelHandled) { return }
  $script:cancelHandled = $true
  Write-ProbeLog 'cancel clicked'
  $command = $CancelCommand
  if ($SimulateCancel -and $TestCancelCommand -ne '') {
    $command = $TestCancelCommand
  }
  Write-ProbeLog ('running: ' + $command)
  try {
    $process = Start-Process -FilePath $env:ComSpec -ArgumentList @('/c', $command) -WindowStyle Hidden -PassThru -Wait
    Write-ProbeLog ('exit code: ' + $process.ExitCode)
    if ($process.ExitCode -eq 0) {
      $status.Text = $CancelledText
    } else {
      $status.Text = ($CancelFailedFormat -f $process.ExitCode)
    }
  } catch {
    Write-ProbeLog ('cancel failed: ' + $_.Exception.Message)
    $status.Text = ($CancelFailedFormat -f $_.Exception.Message)
  }
  $countdownTimer.Stop()
  $headline.Text = $TitleText
  $closeTimer.Start()
}

$cancelButton.Add_Click({ Invoke-Cancel })

$keepButton.Add_Click({
    Write-ProbeLog 'keep clicked'
    $countdownTimer.Stop()
    $status.Text = $ClosedText
    $closeTimer.Start()
  })

$form.Add_Shown({
    Write-ProbeLog ('form shown; seconds=' + $script:remaining)
    $form.Activate()
    $countdownTimer.Start()
    if ($SelfTest) {
      $selfTestTimer.Start()
    }
    if ($SimulateCancel) {
      $countdownTimer.Stop()
      $headline.Text = ($HeadlineFormat -f $script:remaining)
      $cancelButton.PerformClick()
    }
  })

$form.Add_FormClosing({
    Write-ProbeLog ('form closing; cancelHandled=' + $script:cancelHandled)
  })

$form.Add_FormClosed({
    $countdownTimer.Stop()
    $closeTimer.Stop()
    $selfTestTimer.Stop()
    Write-ProbeLog 'form closed'
  })

[void]$form.ShowDialog()
```

</details>

#### 缺口

- 真实宿主 volatile 配置回写及回合事件语义未验证
  **影响**：不能保证 UI 状态与 Host 实际状态同步
  **进一步探讨**：在目标宿主观察配置写入、事件时机和重启后开关状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 一次性安全承诺在写入失败或进程启动失败时成立吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键缺口是 disarm 捕获 Settings mutate 错误只记 warning，调用方仍排关机；如果持久 enabled 仍为 true，重启后可能重新触发，这与 README 的“重启不会重新启用”有条件冲突。scheduleShutdown 对 spawn 的异步 error 只日志，但同步返回 true；即便关机进程启动失败，仍会启动弹窗，用户可能看到虚假的可取消倒计时。若 popup 进程失败或用户设置 popup=false，撤销入口只剩手动 shutdown /a。另一个 agent 运行状态只在事件当下判断；未见等待所有写入完成或操作系统会话保存的证明。这些是源码路径风险，未在 Windows 复现频率和结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-60](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/README.md#L24-L60)

作者一次性和可取消安全承诺。

<details>
<summary>查看原文（37行）</summary>

```text
## Use

1. Open **Settings → General** and find **“Power off after the conversation finishes”**.
2. Turn it on.
3. Finish a conversation: when that turn ends, the plugin
   - resets the switch to off (it is a one-shot trigger, never re-armed by a reboot),
   - schedules `shutdown.exe /s /t <delaySeconds>`,
   - opens a desktop countdown dialog.

The dialog offers:

| Button | Result |
| --- | --- |
| **Cancel shutdown** | runs `shutdown /a`; the machine stays up |
| **Keep shutdown** / close / countdown reaching zero | the planned shutdown happens |

You can also cancel from any terminal with `shutdown /a`.

## Configuration

All three fields are editable live from the Settings page and the Plugins page — no restart.

| Field | Default | Meaning |
| --- | --- | --- |
| `enabled` | `false` | The switch. It is set back to `false` right before a shutdown is scheduled, so the trigger fires exactly once. |
| `delaySeconds` | `60` | Shutdown delay in seconds (5–86400). The dialog countdown mirrors it. |
| `popup` | `true` | Whether to show the cancel dialog at all. |

## Safety notes

- No administrator rights are required; `shutdown /s /t` is available to the logged-in user.
- Only a **root** conversation can trigger it: turns of subagents/teammates are ignored, and
  if another agent is still running the trigger waits for the next turn boundary.
- `DSH_AUTO_SHUTDOWN_DRYRUN=1` in the Host environment logs the two commands instead of
  running them — useful for testing the wiring.
- `DSH_AUTO_SHUTDOWN_POPUP_LOG=<file>` makes the dialog append its user actions to a file.
- The dialog only ever runs `shutdown /a`; it never schedules anything.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:37-60](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/index.js#L37-L60)

spawn 异步 error 与同步成功记录分离。

<details>
<summary>查看原文（24行）</summary>

```text
/** Schedule the Windows shutdown, or only log it in dry-run mode. */
function scheduleShutdown(logger, delaySeconds, dryRun) {
  const args = ['/s', '/t', String(delaySeconds), '/c', COMMENT]
  const command = `"${shutdownExecutable()}" ${args.join(' ')}`
  if (dryRun) {
    logger.warn(`auto-shutdown: dry run, would execute ${command}`)
    return false
  }
  try {
    const child = spawn(shutdownExecutable(), args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    })
    child.on('error', (error) => {
      logger.error(`auto-shutdown: could not start shutdown: ${error.message}`)
    })
    child.unref()
    logger.info(`auto-shutdown: executed ${command}`)
    return true
  } catch (error) {
    logger.error(`auto-shutdown: could not start shutdown: ${error.message}`)
    return false
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:84-109](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/index.js#L84-L109)

复位失败仍继续关机并启动弹窗。

<details>
<summary>查看原文（26行）</summary>

```text
  /** Persist enabled=false so a reboot cannot re-arm the one-shot trigger. */
  async function disarm() {
    try {
      await ctx.settings.mutate(name, [{ op: 'set', path: ['enabled'], value: false }])
    } catch (error) {
      logger.warn(`auto-shutdown: could not reset enabled: ${error.message}`)
    }
  }

  // A listener that never objects, so it must not hold the turn boundary open:
  // latch the fact synchronously, then do the write and the spawns off the event.
  ctx.on('agent/turn-stopping', ({ agent }) => {
    if (fired || !config.enabled.get()) return
    if (!isRootAgent(agent)) return
    if (anotherAgentRunning(agent)) return
    fired = true
    const delaySeconds = Math.max(5, Math.round(config.delaySeconds.get()))
    const dryRun = isDryRun()
    const popup = config.popup.get() === true
    void (async () => {
      await disarm()
      scheduleShutdown(logger, delaySeconds, dryRun)
      if (popup) schedulePopup(logger, delaySeconds, dryRun)
    })().catch((error) => {
      logger.error(`auto-shutdown: failed to arm the shutdown: ${error.message}`)
    })
```

</details>

**依据 4 · 源码核查**：[lib/popup.js:69-89](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/popup.js#L69-L89)

弹窗启动错误只记录。

<details>
<summary>查看原文（21行）</summary>

```text
export function schedulePopup(logger, delaySeconds, dryRun) {
  const args = buildPopupArgs(delaySeconds, popupLogPath())
  const command = `"${popupExecutable()}" ${args.join(' ')}`
  if (dryRun) {
    logger.warn(`auto-shutdown: dry run, would show the cancel dialog (${command})`)
    return
  }
  try {
    const child = spawn(popupExecutable(), args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    })
    child.on('error', (error) => {
      logger.error(`auto-shutdown: could not show the cancel dialog: ${error.message}`)
    })
    child.unref()
    logger.info('auto-shutdown: cancel dialog shown; clicking it runs shutdown /a')
  } catch (error) {
    logger.error(`auto-shutdown: could not show the cancel dialog: ${error.message}`)
  }
```

</details>

**依据 5 · 源码核查**：[test-dry-run.mjs:116-128](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/test-dry-run.mjs#L116-L128)

作者测试还刻意断言 Settings 写失败仍排关机。

<details>
<summary>查看原文（13行）</summary>

```text
// 6. A failing settings write must not stop the shutdown scheduling.
{
  const ctx = makeContext({
    roots: [root],
    mutate: async () => {
      throw new Error('settings offline')
    },
  })
  apply(ctx, makeConfig(true, 5))
  await ctx.emit('agent/turn-stopping', { agent: root, turn: 7 })
  assert.match(warns.join('\n'), /could not reset enabled: settings offline/)
  assert.match(warns.join('\n'), /\/s \/t 5/)
}
```

</details>

#### 缺口

- 真实 Settings 错误及 spawn 错误发生频率未测
  **影响**：不能量化重复关机或误导弹窗概率
  **进一步探讨**：隔离环境注入持久写失败与两种 spawn 失败，验证重启后状态和 UI 提示

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装依赖、持续使用与失败恢复分别要付出什么成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要 Windows、DSH 宿主 agent/settings 及客户端 slots/configForms、Node>=20、Windows shutdown.exe 和 PowerShell 5.1/WinForms。首次需安装、重启 Host、配置延时与测试 dry-run；维护用户应确认正在编辑的对话和其他进程不会丢数据。持续成本主要是延时等待、额外弹窗进程、用户决定是否撤销；金额可视为系统内置工具但时间/数据风险不可填零。失败恢复要识别 Settings 写失败、shutdown spawn/popup spawn 失败、取消命令非零退出、掉电前未保存，及时用 shutdown /a 或重新保存工作。仓库有 dry-run 与弹窗测试脚本，但本轮未执行；测试路径不等于目标系统验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-55](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/package.json#L1-L55)

平台说明、Node 引擎和客户端注入。

<details>
<summary>查看原文（55行）</summary>

```text
{
  "name": "@873360545/dsh-auto-shutdown",
  "version": "0.3.0",
  "type": "module",
  "main": "lib/index.js",
  "description": "Windows-only DSH plugin: a switch in Settings \u2192 General that shuts the computer down when the current conversation finishes, with a native countdown dialog that cancels the shutdown in one click.",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "shutdown",
    "windows",
    "automation"
  ],
  "license": "MIT",
  "author": "873360545",
  "homepage": "https://github.com/873360545/dsh-auto-shutdown#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/873360545/dsh-auto-shutdown.git"
  },
  "bugs": {
    "url": "https://github.com/873360545/dsh-auto-shutdown/issues"
  },
  "engines": {
    "node": ">=20"
  },
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  "files": [
    "lib/index.js",
    "lib/popup.js",
    "lib/client.js",
    "assets/notify.ps1",
    "cordis.patch.yml",
    "locale/*.json",
    "icon.svg"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:5-21](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/index.js#L5-L21)

宿主服务和配置。

<details>
<summary>查看原文（17行）</summary>

```text
/** Cordis plugin name (also the Settings namespace of this entry). */
export const name = 'auto-shutdown'

/** Host services required by the one-shot shutdown trigger. */
export const inject = ['agents', 'settings']

/**
 * Validated configuration. Every field is volatile: the Settings row and the
 * Plugins page can edit them while the Host keeps running, without a reload.
 * `enabled` is reset to false right before a shutdown is scheduled, so the
 * plugin fires exactly once and never re-arms itself after a reboot.
 */
export const Config = z.object({
  enabled: z.boolean().default(false).volatile(),
  delaySeconds: z.number().step(1).min(5).max(86400).default(60).volatile(),
  popup: z.boolean().default(true).volatile(),
})
```

</details>

**依据 3 · 源码核查**：[lib/popup.js:19-25](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/popup.js#L19-L25)

Windows PowerShell 路径。

```text
/** Windows PowerShell 5.1 is the only host guaranteed to ship WinForms. */
export function popupExecutable() {
  const root = process.env.SystemRoot || process.env.windir
  return root
    ? `${root}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
    : 'powershell.exe'
}
```

**依据 4 · 源码核查**：[assets/notify.ps1:141-165](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/assets/notify.ps1#L141-L165)

取消命令和失败提示。

<details>
<summary>查看原文（25行）</summary>

```text
function Invoke-Cancel {
  if ($script:cancelHandled) { return }
  $script:cancelHandled = $true
  Write-ProbeLog 'cancel clicked'
  $command = $CancelCommand
  if ($SimulateCancel -and $TestCancelCommand -ne '') {
    $command = $TestCancelCommand
  }
  Write-ProbeLog ('running: ' + $command)
  try {
    $process = Start-Process -FilePath $env:ComSpec -ArgumentList @('/c', $command) -WindowStyle Hidden -PassThru -Wait
    Write-ProbeLog ('exit code: ' + $process.ExitCode)
    if ($process.ExitCode -eq 0) {
      $status.Text = $CancelledText
    } else {
      $status.Text = ($CancelFailedFormat -f $process.ExitCode)
    }
  } catch {
    Write-ProbeLog ('cancel failed: ' + $_.Exception.Message)
    $status.Text = ($CancelFailedFormat -f $_.Exception.Message)
  }
  $countdownTimer.Stop()
  $headline.Text = $TitleText
  $closeTimer.Start()
}
```

</details>

**依据 5 · 作者声明**：[README.md:74-88](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/README.md#L74-L88)

作者说明 dry-run 与 popup 测试。

<details>
<summary>查看原文（15行）</summary>

````text
## Development

```powershell
# schemastery is only resolvable through a junction when testing outside the profile
New-Item -ItemType Junction -Path node_modules\@deepseek-ai\schemastery `
  -Target "C:\Users\<you>\AppData\Roaming\DSH\data\versions\<version>\node_modules\@deepseek-ai\schemastery"

$env:DSH_AUTO_SHUTDOWN_DRYRUN = '1'
node test-dry-run.mjs        # host logic: filtering, disarm, argv, one-shot
node tests/popup-test.mjs    # real window: self-close, cancel path, failure path, shutdown /a
Remove-Item -Recurse -Force node_modules
```

`tests/popup-test.mjs` uses `-SimulateCancel -TestCancelCommand 'cmd /c exit 0'` style test
switches, so it never touches a real pending shutdown.
````

</details>

#### 缺口

- 安装兼容性、关机耗时和数据恢复成本未测
  **影响**：不能估算真实总成本与可靠性
  **进一步探讨**：目标 Windows/DSH 版本测安装、撤销、保存边界并记录人工处置时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些工程设计值得借鉴，如何最小化一次性状态与系统命令的不一致？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

把设置开关映射到真实宿主配置、同步 latch 防重复和 dry-run 模式是可借鉴设计；PowerShell 文案作为 argv 传入避开编码差异。未验证的改进是假设“关机意图”需要状态机：先持久写入带 request id 的 pending 状态，确认保存，再异步调 shutdown，等待子进程启动/退出结果后展示已排定与明确取消入口；失败恢复时以 OS 查询或明确复位使状态一致。另要在触发前核会话持久化或给用户可操作的保存提醒。最小验证以 Settings 写失败、shutdown 找不到、弹窗失败、取消失败、重启/重复事件和其他 agent 活跃为夹具，比对 UI、持久标志、真实 OS 计划。状态机并非现有功能。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:70-110](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/index.js#L70-L110)

内存 latch、配置复位和两个进程的当前顺序。

<details>
<summary>查看原文（41行）</summary>

```text
export function apply(ctx, config) {
  const logger = ctx.logger
  let fired = false

  /** Only a user-facing root conversation may arm the shutdown, never a teammate. */
  function isRootAgent(agent) {
    return ctx.agents.roots().some((root) => root.id === agent.id)
  }

  /** Another live agent still running means this is not the last conversation. */
  function anotherAgentRunning(self) {
    return ctx.agents.list().some((agent) => agent.id !== self.id && agent.status === 'running')
  }

  /** Persist enabled=false so a reboot cannot re-arm the one-shot trigger. */
  async function disarm() {
    try {
      await ctx.settings.mutate(name, [{ op: 'set', path: ['enabled'], value: false }])
    } catch (error) {
      logger.warn(`auto-shutdown: could not reset enabled: ${error.message}`)
    }
  }

  // A listener that never objects, so it must not hold the turn boundary open:
  // latch the fact synchronously, then do the write and the spawns off the event.
  ctx.on('agent/turn-stopping', ({ agent }) => {
    if (fired || !config.enabled.get()) return
    if (!isRootAgent(agent)) return
    if (anotherAgentRunning(agent)) return
    fired = true
    const delaySeconds = Math.max(5, Math.round(config.delaySeconds.get()))
    const dryRun = isDryRun()
    const popup = config.popup.get() === true
    void (async () => {
      await disarm()
      scheduleShutdown(logger, delaySeconds, dryRun)
      if (popup) schedulePopup(logger, delaySeconds, dryRun)
    })().catch((error) => {
      logger.error(`auto-shutdown: failed to arm the shutdown: ${error.message}`)
    })
  })
```

</details>

**依据 2 · 源码核查**：[lib/popup.js:4-17](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/popup.js#L4-L17)

弹窗文案通过参数传入。

<details>
<summary>查看原文（14行）</summary>

```text
/** Desktop dialog copy; kept here so the PowerShell script stays ASCII-only. */
export const POPUP_COPY = {
  TitleText: 'DSH 自动关机',
  HeadlineFormat: '电脑将在 {0} 秒后自动关机',
  BodyText: '对话已完成。点击「取消关机」可中止本次关机，点击「继续关机」保持计划。',
  CancelLabel: '取消关机',
  KeepLabel: '继续关机',
  CancelledText: '已发送取消指令，电脑将保持开机。',
  CancelFailedFormat: '取消失败（代码 {0}）。',
  ClosedText: '保持计划，将按计划关机。',
}

/** Absolute path of the dialog script shipped next to this module. */
export const POPUP_SCRIPT = fileURLToPath(new URL('../assets/notify.ps1', import.meta.url))
```

</details>

**依据 3 · 源码核查**：[test-dry-run.mjs:83-128](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/test-dry-run.mjs#L83-L128)

测试覆盖一次性和写失败继续执行，未覆盖真实 OS 一致性。

<details>
<summary>查看原文（46行）</summary>

```text
// 4. Enabled, last conversation finished: disarm once, then dry-run both actions.
{
  const writes = []
  const ctx = makeContext({
    roots: [root],
    mutate: async (ns, ops) => writes.push([ns, ops]),
  })
  apply(ctx, makeConfig(true, 30))
  await ctx.emit('agent/turn-stopping', { agent: root, turn: 3 })
  const lines = warns.join('\n')
  assert.deepEqual(writes, [
    ['auto-shutdown', [{ op: 'set', path: ['enabled'], value: false }]],
  ])
  assert.match(lines, /dry run/)
  assert.match(lines, /\/s \/t 30/)
  assert.match(lines, /would show the cancel dialog/)
  assert.match(lines, /-CancelLabel/)
  assert.match(lines, /notify\.ps1/)
  await ctx.emit('agent/turn-stopping', { agent: root, turn: 4 })
  assert.equal(writes.length, 1)
}

// 5. popup: false schedules the shutdown but never opens the dialog.
{
  warns.length = 0
  live.length = 0
  const ctx = makeContext({ roots: [root], mutate: async () => {} })
  apply(ctx, makeConfig(true, 15, false))
  await ctx.emit('agent/turn-stopping', { agent: root, turn: 5 })
  assert.match(warns.join('\n'), /\/s \/t 15/)
  assert.doesNotMatch(warns.join('\n'), /cancel dialog/)
}

// 6. A failing settings write must not stop the shutdown scheduling.
{
  const ctx = makeContext({
    roots: [root],
    mutate: async () => {
      throw new Error('settings offline')
    },
  })
  apply(ctx, makeConfig(true, 5))
  await ctx.emit('agent/turn-stopping', { agent: root, turn: 7 })
  assert.match(warns.join('\n'), /could not reset enabled: settings offline/)
  assert.match(warns.join('\n'), /\/s \/t 5/)
}
```

</details>

#### 缺口

- 提议的状态机和 OS 确认逻辑未实现
  **影响**：不能把一致性提升计入当前贡献
  **进一步探讨**：对比故障注入前后的重复关机、错误提示和恢复耗时

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前版本在何种范围可采用，哪类场景应避免？

**研究主题**：采用判断

#### 完整回答

可在可丢失风险低且 Windows 工作已保存的个人非关键任务中，以 dry-run 先核事件过滤和设置写入，再在专门测试机试真实 60 秒倒计时及取消。若有未保存数据、其他后台工作、远程无人值守或依赖一次性持久保证，不宜直接用；Settings 写失败仍会排关机是明确的源码缺口。建议 observe，待复位写入故障和 spawn 错误显示得到修正并经真实 Windows/宿主验收后再评估安装。即使宿主 dry-run 脚本可运行，本轮未执行目标代码或真实系统命令。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:84-109](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/index.js#L84-L109)

失败仍继续关机的主路径。

<details>
<summary>查看原文（26行）</summary>

```text
  /** Persist enabled=false so a reboot cannot re-arm the one-shot trigger. */
  async function disarm() {
    try {
      await ctx.settings.mutate(name, [{ op: 'set', path: ['enabled'], value: false }])
    } catch (error) {
      logger.warn(`auto-shutdown: could not reset enabled: ${error.message}`)
    }
  }

  // A listener that never objects, so it must not hold the turn boundary open:
  // latch the fact synchronously, then do the write and the spawns off the event.
  ctx.on('agent/turn-stopping', ({ agent }) => {
    if (fired || !config.enabled.get()) return
    if (!isRootAgent(agent)) return
    if (anotherAgentRunning(agent)) return
    fired = true
    const delaySeconds = Math.max(5, Math.round(config.delaySeconds.get()))
    const dryRun = isDryRun()
    const popup = config.popup.get() === true
    void (async () => {
      await disarm()
      scheduleShutdown(logger, delaySeconds, dryRun)
      if (popup) schedulePopup(logger, delaySeconds, dryRun)
    })().catch((error) => {
      logger.error(`auto-shutdown: failed to arm the shutdown: ${error.message}`)
    })
```

</details>

**依据 2 · 源码核查**：[lib/popup.js:69-89](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/popup.js#L69-L89)

取消窗口为可失败的独立进程。

<details>
<summary>查看原文（21行）</summary>

```text
export function schedulePopup(logger, delaySeconds, dryRun) {
  const args = buildPopupArgs(delaySeconds, popupLogPath())
  const command = `"${popupExecutable()}" ${args.join(' ')}`
  if (dryRun) {
    logger.warn(`auto-shutdown: dry run, would show the cancel dialog (${command})`)
    return
  }
  try {
    const child = spawn(popupExecutable(), args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    })
    child.on('error', (error) => {
      logger.error(`auto-shutdown: could not show the cancel dialog: ${error.message}`)
    })
    child.unref()
    logger.info('auto-shutdown: cancel dialog shown; clicking it runs shutdown /a')
  } catch (error) {
    logger.error(`auto-shutdown: could not show the cancel dialog: ${error.message}`)
  }
```

</details>

**依据 3 · 作者声明**：[README.md:52-59](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/README.md#L52-L59)

作者平台和 dry-run 安全说明。

```text
## Safety notes

- No administrator rights are required; `shutdown /s /t` is available to the logged-in user.
- Only a **root** conversation can trigger it: turns of subagents/teammates are ignored, and
  if another agent is still running the trigger waits for the next turn boundary.
- `DSH_AUTO_SHUTDOWN_DRYRUN=1` in the Host environment logs the two commands instead of
  running them — useful for testing the wiring.
- `DSH_AUTO_SHUTDOWN_POPUP_LOG=<file>` makes the dialog append its user actions to a file.
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
