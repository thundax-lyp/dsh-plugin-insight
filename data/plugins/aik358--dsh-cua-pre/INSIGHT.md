# dsh-cua-pre

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[6b64708](https://github.com/Aik358/dsh-cua-pre/tree/6b64708e2514ef4a1b9cb6004adb4838d4b114bb)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-cua-pre)
<!-- END META -->

> **实现功能**：Windows UI Automation 优先的 DSH 桌面控制插件，包含 Python worker、30 工具和 Web 面板。

> **核心亮点**：把UIA元素目标/坐标后备、状态失效及部分未知效果提示封装为DSH工具，并附可视面板；未知效果提示不等统一收据或硬重放阻断。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：作者强调完整安全治理，但默认 allowedPids 空、审计落盘失败静默、急停写盘失败不保证重启后持续；真实安全性须在配置与故障下验收。详见[Q03](#research-q03)。

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
  - [Q01 · 桌面控制的交付入口和适用边界是什么？](#detail-section-11)
  - [Q02 · 观察-动作门禁和不确定结果如何实现？](#detail-section-12)
  - [Q03 · 白名单、急停和审计能提供怎样的治理保证？](#detail-section-13)
  - [Q04 · 安装运行与故障恢复要消耗什么？](#detail-section-14)
  - [Q05 · 怎样把默认治理提升到可验证安全边界？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：让 DSH 在 Windows 桌面观察 UI 元素并执行有状态的鼠标键盘操作。

常见截图/坐标桌面自动化也可点按；此项在 UIA 目标、状态失效及可选治理上增量，但不能由源码推出更低误操作率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模型工具 | Windows观察/指针/键盘/语义动作 | confirm参数不等人类审批 |
| 界面 | 设置、状态卡片与实况/帧 | 状态/日志不等业务完成 |
| Python worker | 驻留执行原生动作 | 请求timeout不等取消原生动作 |
| Host路由 | 状态/配置/帧与安装/bootstrap | socket loopback过滤非用户身份/Origin绑定，外层Host准入另核 |

**流程与依赖**

| 类型 | 条件 | 限制 |
| --- | --- | --- |
| 必需 | Windows、DSH/Cordis、Python UIA/Pillow | 跨平台不可用 |
| 可选 | 视觉模型/附件服务 | 截图描述与帧卡 |
| 治理 | 可写配置与审计目录、目标 PID | 未配置默认广域 |

| 步骤 | 动作 | 验收 |
| --- | --- | --- |
| 准备 | 安装依赖/隔离配置并选择目标 | worker、白名单/日志可用 |
| 观察 | list_apps/get_app_state | state_id/元素准确 |
| 操作 | 元素优先、动作后重观察 | 目标变化确认，故障勿盲重放 |

**效果与成本**

| 阶段 | 现金/计算/外部资源 | 人工/时间 | 未知与恢复 |
| --- | --- | --- | --- |
| 首次 | 包 MIT；Windows/DSH/Python 和依赖资源，金额未知 | 核安装脚本、配置 venv/目标应用、重启，工时未知 | 兼容性/依赖下载耗时未知 |
| 持续 | worker、屏幕帧/附件、可选视觉模型 token 和存储，费用未知 | 逐动作观察、核验与授权，工时未知 | 单任务调用次数/成功率未知 |
| 失败恢复 | 重启 worker、重观测/重试和日志存储，费用未知 | 处理 stale/timeout、核是否已动作、急停恢复，工时未知 | 故障率、误操作损失和审计缺口未知 |

| 已实现 | 潜在收益 | 边界 |
| --- | --- | --- |
| UIA+坐标工具 | 自动桌面操作 | 未实测成功率 |
| state/epoch | 降低旧观察误点 | 模型仍须守流程 |
| 审计/急停 | 运维可控 | 写盘失败非强制 |

> **思考**：作者强调完整安全治理，但默认 allowedPids 空、审计落盘失败静默、急停写盘失败不保证重启后持续；真实安全性须在配置与故障下验收。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把UIA元素目标/坐标后备、状态失效及部分未知效果提示封装为DSH工具，并附可视面板；未知效果提示不等统一收据或硬重放阻断。详见[Q01](#research-q01)、[Q02](#research-q02)。

把UIA元素目标/坐标后备、状态失效及部分未知效果提示封装为DSH工具，并附可视面板；未知效果提示不等统一收据或硬重放阻断。详见[Q01](#research-q01)、[Q02](#research-q02)。

Host注入工具并管理Python sidecar，动作按state_id/PID预检，先发帧后立即作废旧状态；timeout文字提示可能已发生，但无统一可见ambiguous字段，timer/noop不取消原生动作。日志异步追加失败静默。

<a id="detail-section-5"></a>

### 1.4 主要限制

作者强调完整安全治理，但默认 allowedPids 空、审计落盘失败静默、急停写盘失败不保证重启后持续；真实安全性须在配置与故障下验收。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离 Windows profile 开始，以最小目标 PID 配白名单并检查日志可写；非幂等动作结果不明时先重观察/人工核，避免自动重放。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码显示多层动作门禁；默认白名单空、审计 fail-open、急停持久化失败可降为进程内停止；未实测 Windows。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/cua-tools-pre.js、lib/cua-sidecar-client-pre.js、lib/cua-session-pre.js、python/worker_cua_v2.py、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 SHA 静态审阅 README、package、lib Host/工具/sidecar；未运行插件、目标脚本或 Windows 桌面。
- 下一步：Windows 隔离环境以等任务比较坐标基线与 UIA 策略的成功/误操作率；故障注入 timeout、日志只读、急停重启并核状态。

**分析版本**

- **仓库**：[Aik358/dsh-cua-pre](https://github.com/Aik358/dsh-cua-pre)
- **版本号**：0.6.2（[固定提交 6b64708](https://github.com/Aik358/dsh-cua-pre/tree/6b64708e2514ef4a1b9cb6004adb4838d4b114bb)）
- **版本日期**：2026-09-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

既有默认范围开放和审计/急停故障分支，若启用时强制绑定目标并使审计与急停持久化 fail-closed，可减少越界/无记录动作；依赖稳定 PID 与可写存储，会增加阻断与延迟。比较越界、漏审计、重启恢复和正常任务，若缺口不降或阻断超阈值则证伪。详见[Q05](#research-q05)。

Windows 隔离环境以等任务比较坐标基线与 UIA 策略的成功/误操作率；故障注入 timeout、日志只读、急停重启并核状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 303 | — | — | 4104 |
| .js | source | 6 | 3372 | 2990 | 220 | — |
| .mjs | source | 4 | 514 | 382 | 74 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Aik358/dsh-cua-pre/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Aik358/dsh-cua-pre/issues?q=is%3Aissue+created%3A2026-09-22T08%3A06%3A33.222Z..2026-10-22T08%3A06%3A33.222Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aik358/dsh-cua-pre/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A06%3A33.222Z..2026-10-22T08%3A06%3A33.222Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核 Windows CUA 工具实现、默认治理边界和运行/恢复成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面控制的交付入口和适用边界是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向 Windows DSH 的 UI Automation 优先桌面控制，包入口 lib/index.js 注册观察、鼠标/键盘、语义动作、截图/视觉与急停等 30 工具，并以 Python worker 执行；Web 客户端呈现卡片/面板。README 对“同业标准、安全完整、可靠”的说法是作者表述；本轮只核固定源码，未运行 Windows 桌面。macOS/Linux 不支持，截图不是唯一控制基础。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-47](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/README.md#L29-L47)

作者功能/安全陈述。

<details>
<summary>查看原文（19行）</summary>

```text
## What is this

A self-built computer-use plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): an **accessibility-first** observe → act → verify loop with 30 desktop-automation tools (the same names you'd expect from an industry-standard Computer Use toolset), full safety semantics, reimplemented on a Windows Python worker.

The agent operates your desktop the way a careful human would: it **reads the UI Automation tree first** (exact, focus-free, resolution-independent) and only falls back to pixel coordinates when the tree cannot express a target. Screenshots are a describing aid, never the operating premise.

<p align="center">
  <img src="docs/images/panel-live-tight.png" width="300" alt="control panel — live ops tab" />
  <img src="docs/images/panel-frames-tight.png" width="300" alt="control panel — frames tab" />
</p>
<p align="center"><sub>The floating panel: live operation feed (left) and captured frame wall (right). FAB sits at the bottom-right corner, decoupled from any sidebar layout.</sub></p>

## Highlights

- **30 tools, standard names** — `get_app_state` / `left_click` / `type` / `key` / `scroll` / `screenshot` / `zoom` / `clipboard` … with `element`/`coordinate` dual targets, `auto`/`a11y`/`event` strategy routing, and `return_state`.
- **Safety semantics ported, not improvised** — observations are invalidated after every mutation (`superseded` + refresh lock); timeouts mean *"may have happened"* and are never replayed blindly; `stop_computer_control` is a **persistent** kill switch; element addressing validates RuntimeId / type+name / rect drift and fails closed (`stale_tree`) instead of clicking the wrong thing.
- **Presentation layer** — tool calls render as chat cards; a fixed floating panel shows the live operation feed and a wall of captured frames; a dedicated settings page with **environment auto-detection** (Python candidates probed for real, one-click dependency install, bundled worker auto-resolve, vision-model dropdown with heuristic vision flags).
- **Tiled vision for small-resolution models** — screenshots are grid-tiled (≤768 px per tile, overlap, capped count) so DeepSeek-flash-class models can still read the screen; full-frame and per-tile caches make repeated looks nearly free; images travel as durable attachment refs, never base64 in text.
- **Governance** — append-only JSONL audit trail of every tool call; pid allowlist (strict/relaxed) with instant effect; loopback-only HTTP surface.
```

</details>

**依据 2 · 作者声明**：[README.md:99-107](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/README.md#L99-L107)

30 工具分类。

```text
## Tools — 30 desktop-automation tools

| Group | Tools |
|---|---|
| Observe & resolve | `request_access` `list_apps` `open_application` `list_windows` `get_app_state` `screenshot` `zoom` `list_displays` `switch_display` `cursor_position` |
| Pointer | `left_click` `double_click` `triple_click` `right_click` `middle_click` `scroll` `left_click_drag` `mouse_move` `left_mouse_down` `left_mouse_up` |
| Keyboard | `type` `set_value` `select_text` `key` `hold_key` |
| Semantic | `perform_action` |
| Runtime | `stop_computer_control` `wait` `read_clipboard` `write_clipboard` |
```

**依据 3 · 源码核查**：[package.json:2-35](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/package.json#L2-L35)

打包入口/客户端。

<details>
<summary>查看原文（34行）</summary>

```text
  "name": "@a9i5k4/dsh-cua-pre",
  "description": "DSH 桌面自动化插件：无障碍树优先的观察-动作回路，30 个标准电脑控制工具（元素/坐标双目标、auto/a11y/event 策略），写后作废/禁重放/持久急停等安全语义，对话卡片+悬浮面板+环境自检设置页，分块识图，JSONL 审计与 pid 白名单。默认关闭。",
  "version": "0.6.2",
  "private": false,
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "python",
    "!python/__pycache__",
    "!python/*.pyc",
    "!python/worker_cua_v1.py",
    "cordis.patch.yml",
    "LICENSE",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:320-390](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L320-L390)

工具注册和执行包装。

<details>
<summary>查看原文（71行）</summary>

```text
  /** cordis 注册；撞名时回退前缀名（默认 cua_）。 */
  function registerWithFallback() {
    const registeredNames = []
    for (const t of tools) {
      const schema = toToolParameters(t.inputSchema)
      const def = {
        name: (config.toolNamePrefix || '') + t.name,
        description: t.description,
        parameters: schema,
        output: {
          schema: { type: 'string' },
          render(_args, value) { return [{ type: 'text', text: String(value) }] },
          // 纯投影：从返回文本解析卡片附件标记 att=<id>|b=<bytes>|w=<w>|h=<h>，随会话日志持久化。
          // 只挂在会产生 att= 的工具上——宿主要求 presentationMeta 返回 lossless JSON，
          // 无标记时返回 undefined 会让所有工具输出被判 invalid。
          ...(t.name === 'screenshot' || t.name === 'get_app_state' ? {
            presentationMeta: (_args, value) => {
              const m = String(value).match(/att=(sha256:[0-9a-f]+)\|b=(\d+)\|w=(\d+)\|h=(\d+)/)
              // null 是合法 JsonValue 兜底（如截图失败无 att= 时）；undefined 会被宿主判 non-lossless
              if (!m) return null
              return { image: { attachmentId: m[1], mediaType: 'image/jpeg', bytes: Number(m[2]), width: Number(m[3]), height: Number(m[4]) } }
            },
          } : {}),
        },
        // 会话卡片（provider-neutral render intent）：标题来自 args（纯函数，replay 安全）
        presentCall: (args) => ({
          card: 'generic',
          title: callTitleFor(t.name, args),
          kind: ['get_app_state', 'screenshot', 'zoom', 'read_clipboard', 'cursor_position', 'list_apps', 'list_windows', 'list_displays'].includes(t.name) ? 'read' : 'other',
          rawInput: undefined,
        }),
        presentResult: (args, result) => {
          try {
            const text = (result.content || []).filter((b) => b && b.type === 'text').map((b) => b.text).join('\n')
            const firstLine = text.split('\n').find((l) => l.trim()) || ''
            const content = []
            // 卡片嵌图：meta 由 presentationMeta 持久化投影而来（replay 安全）。UI-facing，
            // 不进模型上下文——模型侧仍只读 render() 的纯文本。
            const img = result && result.meta && result.meta.image
            if (img && !result.isError && img.attachmentId) {
              content.push({ type: 'image', attachment: { attachmentId: img.attachmentId, mediaType: img.mediaType || 'image/jpeg', bytes: img.bytes || 0, width: img.width || 0, height: img.height || 0 } })
            }
            content.push({ type: 'text', text: (result.isError ? '✗ ' : '✓ ') + firstLine.slice(0, 220) })
            return { card: 'generic', title: callTitleFor(t.name, args), content }
          } catch (_) { return undefined }
        },
        async execute(args, exec) {
          const started = Date.now()
          try {
            if (exec && exec.agent) lastAgent = exec.agent
            const out = await t.handler(args || {})
            recordOp({
              ts: started, tool: t.name,
              title: callTitleFor(t.name, args || {}),
              ok: !/\berror\]/.test(String(out).slice(0, 80)),
              brief: String(out).split('\n')[0].slice(0, 220),
              ms: Date.now() - started,
            })
            return out
          } catch (e) {
            recordOp({ ts: started, tool: t.name, title: callTitleFor(t.name, args || {}), ok: false, brief: (e.message || String(e)).slice(0, 200), ms: Date.now() - started })
            const msg = e && e.message ? e.message : String(e)
            const sentFalse = e && e.extra && e.extra.action_sent === false
            return '[' + t.name + ' error] code=' + (e.code || 'internal') + ': ' + msg + (sentFalse ? ' (action_sent=false)' : '')
          }
        },
      }
      try {
        ctx.tools.register(def)
        registeredNames.push(def.name)
      } catch (_) {
```

</details>

**依据 5 · 源码核查**：[lib/cua-sidecar-client-pre.js:75-99](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-sidecar-client-pre.js#L75-L99)

Python worker 启动。

<details>
<summary>查看原文（25行）</summary>

```text
    if (child) return { ok: true }
    const scriptPath = String(opt('scriptPath') || '')
    const command = String(opt('command') || 'python')
    if (!scriptPath) return { ok: false, code: 'unavailable' }
    epoch = 'cua_pre_' + randomBytes(16).toString('hex')
    let proc
    try {
      proc = spawn(command, [scriptPath, '--expect-epoch', epoch], {
        shell: false, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'],
      })
    } catch (_) {
      epoch = null
      noteFailure('unavailable')
      return { ok: false, code: 'unavailable' }
    }
    child = proc
    stats.starts++
    if (!exitHookInstalled) {
      // 兜底保险：宿主进程退出而 dispose 未被调用时（如崩溃/遗漏），同步杀树防孤儿。
      exitHookInstalled = true
      process.on('exit', () => {
        if (!child) return
        try { spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { timeout: 3000 }) } catch (_) {}
      })
    }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 观察-动作门禁和不确定结果如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

元素动作要求state_id/index，过期或superseded拒绝并要求重观察；指针元素分支先call(element_action)，sidecar.request在Promise构造器同步writeFrame，随后markDispatched作废旧状态，再await响应。因此是派发后立即作废，不能说进入worker前作废。坐标路径同样先call再mark；坐标帧为软绑定，过期在frame_note显示，不等所有旧坐标都拒绝。坐标a11y未命中明确action_sent=false，event走原始输入，element目标反而拒event。

sidecar有no-shell spawn、epoch、JSONL帧/断路器。timeout后settle本地请求、移pending并发送另一noop帧，未携原动作取消标识/原生中断机制，不能推停止原动作；迟到响应会失去pending接收者。timeout的workerMsg文字提醒动作可能已发生、先重观察勿盲重放；crashed仅提示worker退出/下次重生，不证明旧动作没发生。

多处ToolError.extra.ambiguous只对timeout置true，另有部分分支置true，但wrapErr及最终index错误输出都不投影该字段，返回模型的是错误字符串，含可选action_sent=false，非统一可见ambiguous收据。现实现也不按未知结果硬阻止后续重放。保守核实际效果是使用流程要求，须外围模型/人员约束；worker真实UIA漂移与注入成功率仍无本轮独立结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/cua-tools-pre.js:160-183](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-tools-pre.js#L160-L183)

元素刷新门禁与坐标帧软绑定。

<details>
<summary>查看原文（24行）</summary>

```text
  function resolveElementTarget(target) {
    if (!target || target.type !== 'element') throw new ToolError('bad_target', '此工具的 target 必须是 element 形态 {type:"element",state_id,index}', { action_sent: false })
    const st = session.get(target.state_id)
    if (!st) {
      const why = session.isSuperseded(target.state_id) ? '已被后续变更作废(superseded)' : '无效或已过期'
      throw new ToolError('element_stale', 'state_id ' + target.state_id + ' ' + why + '。请重新 get_app_state。', { action_sent: false })
    }
    if (session.requiresRefresh(st.sel.pid)) {
      throw new ToolError('refresh_required', '该应用存在未确认的变更，写入被锁定(refresh_required)。先 get_app_state 完成完整观察后再操作。', { action_sent: false, state_sync_status: 'refresh_required' })
    }
    const el = st.elements[target.index]
    if (!el) throw new ToolError('index_oob', 'index 越界（该 state 共 ' + st.elements.length + ' 个元素）', { action_sent: false })
    return { st, el }
  }

  function resolveCoordinateTarget(target, field = 'target') {
    if (!target || target.type !== 'coordinate') {
      throw new ToolError('bad_target', field + ' 必须是 coordinate 形态 {type:"coordinate",x,y}', { action_sent: false })
    }
    const x = Math.round(Number(target.x)); const y = Math.round(Number(target.y))
    if (!Number.isFinite(x) || !Number.isFinite(y)) throw new ToolError('bad_target', '坐标必须是有限数字', { action_sent: false })
    const latest = session.latestFrame()
    const stale = latest && Date.now() > latest.expires_at_ms
    return { x, y, frame: latest, frame_stale: stale }
```

</details>

**依据 2 · 源码核查**：[lib/cua-tools-pre.js:186-203](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-tools-pre.js#L186-L203)

call与错误字符串不投影ambiguous。

<details>
<summary>查看原文（18行）</summary>

```text
  /** 变更派发标记：除"确定未发出"的结果外一律按已派发处理。 */
  function markDispatched(pid, result) {
    const notSentCodes = new Set(['unavailable', 'backpressure', 'disposed', 'circuit-open'])
    if (!result || !notSentCodes.has(result.code)) session.markMutationDispatched(pid)
  }

  async function call(op, payload, opts) {
    return sidecar.request(op, payload, opts)
  }

  function wrapErr(e, toolName) {
    if (e instanceof ToolError) {
      let s = '[' + toolName + ' error] code=' + e.code + ': ' + e.message +
        (e.extra.action_sent === false ? ' (action_sent=false)' : '')
      if (e.extra.state_sync_status) s += ' state_sync_status=' + e.extra.state_sync_status
      return s
    }
    return '[' + toolName + ' 失败] ' + (e.message || String(e))
```

</details>

**依据 3 · 源码核查**：[lib/cua-tools-pre.js:470-522](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-tools-pre.js#L470-L522)

先call再mark及坐标/元素分支。

<details>
<summary>查看原文（53行）</summary>

```text
      if (args.target.type === 'element') {
        if (args.strategy === 'event') throw new ToolError('strategy_conflict', 'element 目标不支持 strategy=event', { action_sent: false })
        const { st, el } = resolveElementTarget(args.target)
        checkPid(st.sel.pid)
        scopeSel = st.sel
        const req = call('element_action', {
          sel: st.sel, path: el.p, action: 'click', button: spec.button || 'left',
          double: !!spec.double, triple: !!spec.triple, modifiers: mods,
          expectT: el.k, expectN: el.n || null,
          expectRid: el.rid || null, expectRect: el.r || null,
          allowFocus: !!(args.allowFocus || !config().preferBackground),
        }, {})
        checkPid(st.sel.pid)
        markDispatched(st.sel.pid, null) // 进入原生调用前冻结
        const r = await req
        markDispatched(st.sel.pid, r)
        if (!r.ok && r.reason === 'needs_foreground') {
          throw new ToolError('needs_foreground',
            '语义动作不可用且目标窗口不在前台。重试传 allowFocus:true（会置前窗口），或改用 set_value 等后台语义工具。',
            { action_sent: false })
        }
        if (!r.ok) throw new ToolError(r.code === 'worker-error' ? r.reason : r.code, workerMsg(r), { ambiguous: r.code === 'timeout' })
        resultPayload = r.payload
      } else {
        if (args.target.type === 'coordinate') requireUnscopedAllowed('坐标' + name)
        const c = resolveCoordinateTarget(args.target)
        const mode = args.strategy === 'a11y' ? 'semantic_only' : (args.strategy === 'event' ? 'raw' : 'auto')
        const req = call('hit_click', {
          x: c.x, y: c.y, button: spec.button || 'left', double: !!spec.double,
          triple: !!spec.triple, modifiers: mods, mode,
        }, {})
        markDispatched(-1, null)
        const r = await req
        markDispatched(-1, r)
        if (!r.ok && r.reason === 'needs_foreground') {
          throw new ToolError('needs_foreground',
            '目标窗口不在前台且语义动作不可用。选项：(1) 重试并传 allowFocus:true（会把窗口带到前台）；'
            + '(2) 改用键盘/Value 语义工具。', { action_sent: false })
        }
        if (!r.ok) throw new ToolError(r.code === 'worker-error' ? r.reason : r.code, workerMsg(r), { ambiguous: r.code === 'timeout' })
        if (mode === 'semantic_only' && r.payload.clicked === false) {
          throw new ToolError('a11y_miss', 'strategy=a11y：坐标处无可按压元素，已 fail-closed 未注入任何输入。改用 auto/event 或重新观察。', { action_sent: false })
        }
        resultPayload = r.payload
        resultPayload.frame_note = c.frame ? ('bound_frame=' + c.frame.frame_id + (c.frame_stale ? ' (stale!)' : '')) : ''
      }
      let out = name + ' 完成: strategy=' + (resultPayload.strategy || []).join('→') +
        (resultPayload.hit ? ' hit=' + JSON.stringify(resultPayload.hit) : '') +
        (resultPayload.point ? ' point=' + JSON.stringify(resultPayload.point) : '') +
        (resultPayload.frame_note ? ' ' + resultPayload.frame_note : '')
      out += '\n旧观察已全部作废（superseded）。'
      out += await postStateBlock(args, scopeSel, scopeSel ? 'compact' : 'none')
      return out
```

</details>

**依据 4 · 源码核查**：[lib/cua-sidecar-client-pre.js:180-220](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-sidecar-client-pre.js#L180-L220)

同步发帧与timeout settle/noop，非原生取消。

<details>
<summary>查看原文（41行）</summary>

```text
  function writeFrame(frame) {
    if (!child || !child.stdin || child.stdin.destroyed) return false
    const line = Buffer.from(JSON.stringify(frame) + '\n', 'utf8')
    child.stdin.write(line)
    return true
  }

  /**
   * 结构化请求：resolve({ok:true,payload}) 或 resolve({ok:false,code,...})；永不 reject。
   * worker-error 时附带 code='worker-error', reason=业务错误码, reasonText=可读信息。
   */
  function request(op, payload, rOpts = {}) {
    if (disposed) return Promise.resolve({ ok: false, code: 'disposed' })
    if (breakerOpen()) {
      stats.failed.circuitopen++
      return Promise.resolve({ ok: false, code: 'circuit-open', retryInMs: breaker.openUntil - Date.now() })
    }
    const started = ensureStarted()
    if (!started.ok) {
      stats.failed[started.code] = (stats.failed[started.code] || 0) + 1
      return Promise.resolve({ ok: false, code: started.code })
    }
    if (pending.size >= Number(opt('maxPendingRequests') ?? DEFAULTS.maxPendingRequests)) {
      stats.failed.backpressure++
      return Promise.resolve({ ok: false, code: 'backpressure' })
    }
    const requestId = 'cq_' + randomBytes(9).toString('hex') + (++reqCounter).toString(36)
    const frame = { v: 1, dir: 'req', requestId, epoch, op, payload: payload ?? {} }
    return new Promise((resolve) => {
      const entry = { requestId, expectedOp: op, resolve, settled: false, timer: null }
      pending.set(requestId, entry)
      stats.requests++
      const written = writeFrame(frame)
      if (!written) { settle(entry, { ok: false, code: 'unavailable' }); return }
      const timeoutMs = Math.max(1, Number(rOpts.timeoutMs) || Number(opt('requestTimeoutMs') ?? DEFAULTS.requestTimeoutMs))
      entry.timer = setTimeout(() => {
        settle(entry, { ok: false, code: 'timeout', timeoutMs })
        // cancel 通知：同 requestId 的 no-op 请求让 worker 跳过慢操作的结果写入
        writeFrame({ v: 1, dir: 'req', requestId: 'cx_' + randomBytes(8).toString('hex'), epoch, op: 'noop', payload: {} })
      }, timeoutMs)
    })
```

</details>

**依据 5 · 源码核查**：[lib/cua-tools-pre.js:100-114](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-tools-pre.js#L100-L114)

timeout提醒与crashed重生文案。

<details>
<summary>查看原文（15行）</summary>

```text
  function workerMsg(r) {
    if (r.code === 'worker-error') {
      let m = String(r.reasonText || r.reason)
      if (r.reason === 'stale_tree') m += ' —— 立即重新 get_app_state 获取新 state_id。'
      if (r.reason === 'CUA_DEP_MISSING') m += ' （.venv 缺依赖：pip install -r python/requirements.txt）'
      if (r.reason === 'needs_foreground') m = '后台优先：语义动作不可用且窗口非前台。重试传 allowFocus:true，或改用 set_value 等后台语义。'
      if (r.reason === 'needs_foreground') m += ' （后台优先模式；重试传 allowFocus:true 可置前操作）'
      return m
    }
    if (r.code === 'timeout') return 'timeout(' + r.timeoutMs + 'ms)。若是变更类操作，动作可能已发生：先重新观察确认，勿盲目重放。'
    if (r.code === 'crashed') return 'Python worker 崩溃退出，下次调用自动重生。'
    if (r.code === 'unavailable') return '无法启动 Python worker（检查 config.pythonExecutable）。'
    if (r.code === 'circuit-open') return '断路器熔断中，' + Math.ceil((r.retryInMs || 0) / 1000) + 's 后自动半开。'
    return r.code || 'unknown'
  }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:379-383](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L379-L383)

最终字符串只附action_sent=false。

```text
          } catch (e) {
            recordOp({ ts: started, tool: t.name, title: callTitleFor(t.name, args || {}), ok: false, brief: (e.message || String(e)).slice(0, 200), ms: Date.now() - started })
            const msg = e && e.message ? e.message : String(e)
            const sentFalse = e && e.extra && e.extra.action_sent === false
            return '[' + t.name + ' error] code=' + (e.code || 'internal') + ': ' + msg + (sentFalse ? ' (action_sent=false)' : '')
```

**依据 7 · 源码核查**：[lib/cua-sidecar-client-pre.js:75-99](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-sidecar-client-pre.js#L75-L99)

worker启动。

<details>
<summary>查看原文（25行）</summary>

```text
    if (child) return { ok: true }
    const scriptPath = String(opt('scriptPath') || '')
    const command = String(opt('command') || 'python')
    if (!scriptPath) return { ok: false, code: 'unavailable' }
    epoch = 'cua_pre_' + randomBytes(16).toString('hex')
    let proc
    try {
      proc = spawn(command, [scriptPath, '--expect-epoch', epoch], {
        shell: false, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'],
      })
    } catch (_) {
      epoch = null
      noteFailure('unavailable')
      return { ok: false, code: 'unavailable' }
    }
    child = proc
    stats.starts++
    if (!exitHookInstalled) {
      // 兜底保险：宿主进程退出而 dispose 未被调用时（如崩溃/遗漏），同步杀树防孤儿。
      exitHookInstalled = true
      process.on('exit', () => {
        if (!child) return
        try { spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { timeout: 3000 }) } catch (_) {}
      })
    }
```

</details>

**依据 8 · 源码核查**：[lib/index.js:35-40](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L35-L40)

模型使用指令并非重放门禁。

```text
export const GUIDANCE = [
  '[dsh-cua-pre 电脑控制] 已启用桌面自动化工具面。核心循环=观察一次→动作一次→验证：',
  '1. request_access 探测就绪；list_apps 找应用；get_app_state 读无障碍树获得 state_id（主路径，语义精确、不抢焦点、无需截图）。目标一律用 {type:"element",state_id,index}。',
  '2. 仅当无障碍表达不了目标才截图（screenshot / get_app_state include_screenshot），坐标只能取自最近返回帧的整数像素 {type:"coordinate",x,y}；zoom 裁剪放大不重截。坐标动作 strategy 默认 auto（先无障碍命中）；a11y=够不到即拒绝；event=强制裸输入，仅限无障碍不可用时。',
  '3. 动作后旧 state 全部作废(superseded)+写入锁(refresh_required)：必须重新 get_app_state 才能再写。响应可能自带重观察结果(return_state)。',
  '4. action_sent 纪律：预检失败=未发生可安全重试；timeout/crashed=可能已发生——先重新观察确认实际状态，绝不原样重放非幂等操作（发送/删除/支付）。',
```

#### 缺口

- 未测 worker 实际 UIA/注入。
  **影响**：失败后是否误重试、漂移误点率未知。
  **进一步探讨**：故障注入及状态变化后重试对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 白名单、急停和审计能提供怎样的治理保证？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

默认 enabled 关闭且仅 Windows 过 gate；killSwitch 尝试把 stoppedByUser 写配置并关 worker，但配置写失败时只保持本进程内停用，重启持久性不保证。allowedPids 默认空，等于未开启范围约束；启用非空且 strict 时才拒绝无 pid 作用域的坐标/剪贴板等。审计 JSONL 追加失败被静默吞掉，主调用继续，所以“每次工具调用都有持久审计”并非 fail-closed。loopback过滤实际检查socket.remoteAddress，state/config/安装deps/bootstrap等入口没有本层用户身份或Origin绑定；外层Host准入未核，不宣称公网可达或已越权。confirm字段及付款/外发先问的GUIDANCE都是工具参数/提示纪律，不是人类授权事实。timeout本地settle/noop不停止原生动作，不确定结果后停止/取消须外围约束，不能用重生提示当可安全重放。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:55-69](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L55-L69)

白名单默认空。

<details>
<summary>查看原文（15行）</summary>

```text
  maxStates: 16,
  frameTtlMs: 60000,
  toolNamePrefix: '',
  // ---- vision ----
  visionEnabled: false,
  visionModel: '',
  visionAutoDescribe: true,
  tileMaxPx: 768,
  tileOverlapPx: 64,
  visionMaxTiles: 4,
  visionTimeoutMs: 90000,
  // ---- pid 白名单 ----
  allowedPids: [],
  whitelistRelaxed: false,
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:195-225](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L195-L225)

启用、急停/持久化失败处理。

<details>
<summary>查看原文（31行）</summary>

```text
  function gate() {
    if (!config) return '插件配置尚未加载完成，请稍后重试。'
    if (platform() !== 'win32') return '本插件原型仅支持 Windows（UIA/SendInput）。'
    if (!effConfig().enabled) return '电脑控制当前未启用。请在 ' + config._file + ' 写入 {"enabled": true} 后重启 dsh web（默认关闭是安全设计）。'
    if (stoppedByUserPersisted) return '电脑控制已被 stop_computer_control 紧急停止且持久生效（防循环失控）。恢复：删除 ' + config._file + ' 的 stoppedByUser 字段并重启 dsh web。'
    return null
  }

  async function killSwitch(reason) {
    if (!config || !config._file) return '电脑控制尚未完成初始化，无需停止。'
    try {
      const raw = await readFile(config._file, 'utf8').catch(() => '{}')
      const obj = JSON.parse(raw)
      obj.stoppedByUser = true
      await writeFile(config._file, JSON.stringify(obj, null, 2), 'utf8')
    } catch (_) { /* 配置不可写也照停（内存态已停） */ }
    stoppedByUserPersisted = true
    sidecar.restart('stop_computer_control' + (reason ? ': ' + reason : ''))
    session.clearAll()
    return '电脑控制已紧急停止并持久化' + (reason ? '（原因: ' + reason + '）' : '') +
      '。所有工具现在拒绝执行。恢复方法：删除 ' + config._file + ' 中 stoppedByUser 字段并重启 dsh web。'
  }

  // ---------- pid 白名单门禁 ----------
  function pidGate(pid) {
    const c = effConfig()
    const list = Array.isArray(c.allowedPids) ? c.allowedPids.map(Number).filter(Number.isFinite) : []
    if (!list.length) return null
    if (pid === null || pid === undefined || !Number.isFinite(Number(pid))) return null
    return list.includes(Number(pid))
      ? null
```

</details>

**依据 3 · 源码核查**：[lib/cua-tools-pre.js:50-67](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-tools-pre.js#L50-L67)

strict 白名单作用域门禁。

<details>
<summary>查看原文（18行）</summary>

```text
  function whitelistActive() {
    const list = config().allowedPids || []
    return Array.isArray(list) && list.length > 0
  }

  /** 作用域化操作的 pid 门禁。 */
  function checkPid(pid) {
    const reason = pidGate(pid)
    if (reason) throw new ToolError('pid_blocked', reason, { action_sent: false })
  }

  /** 无作用域可查的全局效果操作（坐标/剪贴板/全屏截图/open）在白名单下的默认拒绝。 */
  function requireUnscopedAllowed(kind) {
    if (!whitelistActive()) return
    if (config().whitelistRelaxed) return
    throw new ToolError('pid_scope_required',
      'PID 白名单启用中（strict 模式）：' + kind + ' 无法确认目标归属，已被拒绝。' +
      '改用元素目标(element target)，在设置页添加对应 pid，或开启「白名单宽松模式」。', { action_sent: false })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:291-303](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L291-L303)

审计失败静默。

<details>
<summary>查看原文（13行）</summary>

```text
  const auditChain = { p: Promise.resolve() }
  function recordOp(entry) {
    opLog.push(entry)
    while (opLog.length > OP_LOG_CAP) opLog.shift()
    // 审计落盘：JSONL 按天追加，失败静默不影响主链路
    auditChain.p = auditChain.p.then(async () => {
      try {
        const dir = path.join(effConfig()._artifactsDir || expandHome(DEFAULT_CONFIG.artifactsDir), 'audit')
        await mkdir(dir, { recursive: true })
        const day = new Date(entry.ts).toISOString().slice(0, 10)
        await appendFile(path.join(dir, day + '.jsonl'), JSON.stringify(entry) + '\n', 'utf8')
      } catch (_) {}
    })
```

</details>

**依据 5 · 源码核查**：[lib/index.js:102-105](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L102-L105)

loopback 判定。

```text
function isLoopbackRequest(req) {
  const address = req.socket && req.socket.remoteAddress
  return address === '127.0.0.1' || address === '::1' || address === 'ffff:127.0.0.1' ||
    address === '::ffff:127.0.0.1'
```

**依据 6 · 源码核查**：[lib/index.js:510-550](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L510-L550)

状态/配置loopback控制面。

<details>
<summary>查看原文（41行）</summary>

```text
    {
      kind: 'exact', path: API.state, handler: async (req, res) => {
        if (!isLoopbackRequest(req)) return writeJson(res, 403, { error: 'loopback-only' })
        const everEnabled = !!(effConfig().enabled)
        writeJson(res, 200, {
          plugin: 'dsh-cua-pre', version: 3,
          enabled: everEnabled,
          firstRun: !everEnabled && !stoppedByUserPersisted,
          stoppedByUser: stoppedByUserPersisted,
          visionEnabled: !!(config && config.visionEnabled),
          whitelist: { active: (effConfig().allowedPids || []).length > 0, size: (effConfig().allowedPids || []).length, relaxed: !!effConfig().whitelistRelaxed },
          platform: platform(),
          worker: sidecar.debugView(),
          session: { states: session.stateCount(), refreshLocks: session.refreshLockCount(), busyVision: vision.busy() },
          lastOps: opLog.slice(-20).reverse(),
          pendingUrl: pendingUrls.length ? pendingUrls[pendingUrls.length - 1] : null,
          lastOperated: lastOperated,
        })
      },
    },
    {
      kind: 'exact', path: API.config, handler: async (req, res) => {
        if (!isLoopbackRequest(req)) return writeJson(res, 403, { error: 'loopback-only' })
        if ((req.method || 'GET') === 'GET') {
          if (!config) return writeJson(res, 503, { error: 'loading' })
          const pub = {}
          for (const k of Object.keys(DEFAULT_CONFIG)) pub[k] = config[k]
          return writeJson(res, 200, { config: pub, file: config._file, needsRestartNote: '修改保存后需重启 dsh web 生效' })
        }
        if (req.method !== 'POST') return writeJson(res, 405, { error: 'method not allowed' })
        if (!config || !config._file) return writeJson(res, 503, { error: 'config not loaded yet' })
        const body = await readJsonBody(req).catch(() => null)
        if (!body || typeof body !== 'object') return writeJson(res, 400, { error: 'invalid json' })
        try {
          const raw = await readFile(config._file, 'utf8').catch(() => '{}')
          const obj = JSON.parse(raw)
          for (const k of Object.keys(DEFAULT_CONFIG)) {
            if (body[k] !== undefined) {
              obj[k] = body[k]
              overrides[k] = body[k] // 白名单等即时生效；pythonExecutable 等进程级项重启完全生效
            }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:625-668](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L625-L668)

安装与bootstrap的进程副作用。

<details>
<summary>查看原文（44行）</summary>

```text
      kind: 'exact', path: API['install-deps'], handler: async (req, res) => {
        if (!isLoopbackRequest(req)) return writeJson(res, 403, { error: 'loopback-only' })
        if (req.method !== 'POST') return writeJson(res, 405, { error: 'method not allowed' })
        const body = await readJsonBody(req).catch(() => ({}))
        const py = String(body.python || '').trim()
        if (!py) return writeJson(res, 400, { error: 'missing python' })
        const runPip = async (extra) => {
          try {
            const r = await execFileP(py, ['-m', 'pip', 'install', '--quiet', 'uiautomation', 'pillow'].concat(extra || []),
              { timeout: 240000, windowsHide: true, maxBuffer: 4 * 1024 * 1024 })
            return { ok: true, tail: String(r.stdout || '').slice(-400) }
          } catch (e) {
            return { ok: false, tail: String((e && (e.stderr || e.message)) || e).slice(-400) }
          }
        }
        let r = await runPip()
        if (!r.ok) r = await runPip(['-i', 'https://pypi.tuna.tsinghua.edu.cn/simple'])
        detectCache.pythons = null // 依赖装完失效缓存，下次 detect 重新探测
        writeJson(res, 200, r)
      },
    },
    {
      kind: 'exact', path: API.bootstrap, handler: async (req, res) => {
        if (!isLoopbackRequest(req)) return writeJson(res, 403, { error: 'loopback-only' })
        if (req.method !== 'POST') return writeJson(res, 405, { error: 'method not allowed' })
        const body = await readJsonBody(req).catch(() => ({}))
        // 探测可用 Python：优先显式指定的；否则取第一个 ready 的候选
        let py = String(body.python || '').trim()
        if (!py) {
          const pythons = await detectPythons().catch(() => [])
          const ready = pythons.find((x) => x.status === 'ready') || pythons.find((x) => x.status === 'no-deps')
          if (ready) py = ready.path
        }
        if (!py) return writeJson(res, 400, { error: '未检测到可用 Python。请先在系统安装 Python 3.9+，或手动填写 pythonExecutable。' })
        // 若该 Python 缺依赖，自动尝试安装（默认源失败切清华镜像）
        const probe = await probePython(py, ['-c', 'import uiautomation, PIL; print("deps-ok")'])
        let installedDeps = false
        if (!probe.ok || probe.out.indexOf('deps-ok') === -1) {
          const runPip = async (extra) => {
            try {
              const r = await execFileP(py, ['-m', 'pip', 'install', '--quiet', 'uiautomation', 'pillow'].concat(extra || []),
                { timeout: 240000, windowsHide: true, maxBuffer: 4 * 1024 * 1024 })
              return { ok: true, tail: String(r.stdout || '').slice(-300) }
            } catch (e) { return { ok: false, tail: String((e && (e.stderr || e.message)) || e).slice(-300) } }
```

</details>

#### 缺口

- 未测试本机 HTTP 访问及配置不可写/重启。
  **影响**：本地边界、急停持久性和审计缺口频率未知。
  **进一步探讨**：隔离 Windows profile 故障注入与本机请求测试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装运行与故障恢复要消耗什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需 Windows 10+、DSH web、Python 3.9+ 和 uiautomation/pillow，安装脚本/配置/重启，现金价格未见，人工检查自动安装远端脚本和依赖环境。持续使用要 worker 常驻/屏幕帧与附件存储、可选视觉模型 token，以及逐动作观察/复核人工；耗量无实测。失败恢复包括 Python 不可用、stale_tree/refresh_required、timeout 不可盲重放、审计/急停写盘失败，须重观察和人工核验已发生效果；重试时间/费用未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-95](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/README.md#L69-L95)

作者安装与依赖说明。

<details>
<summary>查看原文（27行）</summary>

````text
## Quick start

> Prerequisites: Windows 10+, [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh web`), Python 3.9+ on PATH.

```powershell
# 1) install into the web profile + patch the bundle roster
irm https://raw.githubusercontent.com/Aik358/dsh-cua-pre/main/install.ps1 | iex

# 2) restart `dsh web` (port 3080 stays a manual, user-owned step)

# 3) enable + (recommended) point the plugin at a venv with worker deps
#    ~/.dsh/cua-pre.json
{ "enabled": true, "pythonExecutable": "C:/path/to/venv/Scripts/python.exe" }
```

Or pick the interpreter visually: after restart, open **Settings → 电脑控制** — the page auto-probes every candidate Python, shows which ones have `uiautomation`+`pillow` ready, installs missing deps in one click (official PyPI, Tsinghua mirror fallback), and lets you switch with one click (takes effect immediately, no restart).

<details>
<summary><b>Enable vision (optional) / 开启识图（可选）</b></summary>

```json
{ "visionEnabled": true, "visionModel": "" }
```

`visionModel` left empty follows the harness default route; the settings dropdown lists every configured provider's models with a heuristic ✔ on likely-vision names (you can override manually). Every `screenshot` / `get_app_state(include_screenshot)` then appends a `[vision]` description built from grid tiles — each tile small enough for low-resolution models to read faithfully.

Install worker deps for the chosen interpreter: `pip install uiautomation pillow` (or use the settings page button).
````

</details>

**依据 2 · 源码核查**：[package.json:2-49](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/package.json#L2-L49)

包结构/许可。

<details>
<summary>查看原文（48行）</summary>

```text
  "name": "@a9i5k4/dsh-cua-pre",
  "description": "DSH 桌面自动化插件：无障碍树优先的观察-动作回路，30 个标准电脑控制工具（元素/坐标双目标、auto/a11y/event 策略），写后作废/禁重放/持久急停等安全语义，对话卡片+悬浮面板+环境自检设置页，分块识图，JSONL 审计与 pid 白名单。默认关闭。",
  "version": "0.6.2",
  "private": false,
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "python",
    "!python/__pycache__",
    "!python/*.pyc",
    "!python/worker_cua_v1.py",
    "cordis.patch.yml",
    "LICENSE",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
  },
  "keywords": [
    "dsh",
    "deepseek-harness",
    "cua",
    "computer-use",
    "uia",
    "vision"
  ],
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "license": "MIT"
}
```

</details>

**依据 3 · 源码核查**：[lib/cua-sidecar-client-pre.js:18-33](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-sidecar-client-pre.js#L18-L33)

请求/断路器参数。

<details>
<summary>查看原文（16行）</summary>

```text
const DEFAULTS = {
  requestTimeoutMs: 20000,
  maxLineBytes: 256 * 1024,
  breakerFailureThreshold: 3,
  breakerCooldownMs: 30000,
  maxPendingRequests: 4,
}

/** 捆绑 worker 的默认绝对路径（python/worker_cua_v2.py）。 */
export function defaultWorkerScriptPathPre() {
  try {
    return path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'python', 'worker_cua_v2.py')
  } catch (_) { return '' }
}

const FAILURE_CODES = new Set(['timeout', 'crashed', 'unavailable', 'protocol', 'line-oversize'])
```

</details>

**依据 4 · 源码核查**：[lib/cua-tools-pre.js:160-171](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-tools-pre.js#L160-L171)

刷新要求。

<details>
<summary>查看原文（12行）</summary>

```text
  function resolveElementTarget(target) {
    if (!target || target.type !== 'element') throw new ToolError('bad_target', '此工具的 target 必须是 element 形态 {type:"element",state_id,index}', { action_sent: false })
    const st = session.get(target.state_id)
    if (!st) {
      const why = session.isSuperseded(target.state_id) ? '已被后续变更作废(superseded)' : '无效或已过期'
      throw new ToolError('element_stale', 'state_id ' + target.state_id + ' ' + why + '。请重新 get_app_state。', { action_sent: false })
    }
    if (session.requiresRefresh(st.sel.pid)) {
      throw new ToolError('refresh_required', '该应用存在未确认的变更，写入被锁定(refresh_required)。先 get_app_state 完成完整观察后再操作。', { action_sent: false, state_sync_status: 'refresh_required' })
    }
    const el = st.elements[target.index]
    if (!el) throw new ToolError('index_oob', 'index 越界（该 state 共 ' + st.elements.length + ' 个元素）', { action_sent: false })
```

</details>

**依据 5 · 源码核查**：[lib/index.js:203-215](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L203-L215)

急停恢复。

<details>
<summary>查看原文（13行）</summary>

```text
  async function killSwitch(reason) {
    if (!config || !config._file) return '电脑控制尚未完成初始化，无需停止。'
    try {
      const raw = await readFile(config._file, 'utf8').catch(() => '{}')
      const obj = JSON.parse(raw)
      obj.stoppedByUser = true
      await writeFile(config._file, JSON.stringify(obj, null, 2), 'utf8')
    } catch (_) { /* 配置不可写也照停（内存态已停） */ }
    stoppedByUserPersisted = true
    sidecar.restart('stop_computer_control' + (reason ? ': ' + reason : ''))
    session.clearAll()
    return '电脑控制已紧急停止并持久化' + (reason ? '（原因: ' + reason + '）' : '') +
      '。所有工具现在拒绝执行。恢复方法：删除 ' + config._file + ' 中 stoppedByUser 字段并重启 dsh web。'
```

</details>

#### 缺口

- 无实测安装/任务账单与工时。
  **影响**：整体拥有成本未知。
  **进一步探讨**：固定 Windows 环境记录安装、任务、失败恢复耗时/模型费。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样把默认治理提升到可验证安全边界？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已知：默认白名单空、审计失败可继续、急停写盘失败仅进程有效；对照已有明确允许的单应用 CUA 流程，当前广域默认更易越界。假设增量是首次启用必须绑定目标 PID/窗口，变更动作前审计预写失败即停，并把急停状态原子持久化/启动时验证；可能减少越界与无记录动作。条件是稳定目标归属、可写安全存储和用户明确授权；代价是多次范围选择、日志 I/O、跨应用合法任务受阻与故障修复。最小对照：同一 Windows 用例在现版与强制配置版执行越界、日志目录只读、kill 后重启、正常跨应用任务，比较越界动作数、漏审计数、正常阻断率、延迟；若缺口未下降或正常阻断/时延超预注册阈值则证伪。目前这属于未实现改造，不能把现有 strict 可选配置当默认保障。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:55-69](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L55-L69)

白名单缺省。

<details>
<summary>查看原文（15行）</summary>

```text
  maxStates: 16,
  frameTtlMs: 60000,
  toolNamePrefix: '',
  // ---- vision ----
  visionEnabled: false,
  visionModel: '',
  visionAutoDescribe: true,
  tileMaxPx: 768,
  tileOverlapPx: 64,
  visionMaxTiles: 4,
  visionTimeoutMs: 90000,
  // ---- pid 白名单 ----
  allowedPids: [],
  whitelistRelaxed: false,
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:203-215](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L203-L215)

急停写盘失败分支。

<details>
<summary>查看原文（13行）</summary>

```text
  async function killSwitch(reason) {
    if (!config || !config._file) return '电脑控制尚未完成初始化，无需停止。'
    try {
      const raw = await readFile(config._file, 'utf8').catch(() => '{}')
      const obj = JSON.parse(raw)
      obj.stoppedByUser = true
      await writeFile(config._file, JSON.stringify(obj, null, 2), 'utf8')
    } catch (_) { /* 配置不可写也照停（内存态已停） */ }
    stoppedByUserPersisted = true
    sidecar.restart('stop_computer_control' + (reason ? ': ' + reason : ''))
    session.clearAll()
    return '电脑控制已紧急停止并持久化' + (reason ? '（原因: ' + reason + '）' : '') +
      '。所有工具现在拒绝执行。恢复方法：删除 ' + config._file + ' 中 stoppedByUser 字段并重启 dsh web。'
```

</details>

**依据 3 · 源码核查**：[lib/index.js:291-303](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js#L291-L303)

审计失败分支。

<details>
<summary>查看原文（13行）</summary>

```text
  const auditChain = { p: Promise.resolve() }
  function recordOp(entry) {
    opLog.push(entry)
    while (opLog.length > OP_LOG_CAP) opLog.shift()
    // 审计落盘：JSONL 按天追加，失败静默不影响主链路
    auditChain.p = auditChain.p.then(async () => {
      try {
        const dir = path.join(effConfig()._artifactsDir || expandHome(DEFAULT_CONFIG.artifactsDir), 'audit')
        await mkdir(dir, { recursive: true })
        const day = new Date(entry.ts).toISOString().slice(0, 10)
        await appendFile(path.join(dir, day + '.jsonl'), JSON.stringify(entry) + '\n', 'utf8')
      } catch (_) {}
    })
```

</details>

**依据 4 · 源码核查**：[lib/cua-tools-pre.js:61-67](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-tools-pre.js#L61-L67)

strict 仅启用后生效。

```text
  /** 无作用域可查的全局效果操作（坐标/剪贴板/全屏截图/open）在白名单下的默认拒绝。 */
  function requireUnscopedAllowed(kind) {
    if (!whitelistActive()) return
    if (config().whitelistRelaxed) return
    throw new ToolError('pid_scope_required',
      'PID 白名单启用中（strict 模式）：' + kind + ' 无法确认目标归属，已被拒绝。' +
      '改用元素目标(element target)，在设置页添加对应 pid，或开启「白名单宽松模式」。', { action_sent: false })
```

#### 缺口

- 强制策略未实现且未做对照。
  **影响**：安全收益/可用性代价未知。
  **进一步探讨**：预注册缺口和正常阻断阈值后故障注入。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
