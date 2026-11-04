# cc-notify-hooks

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8adc9ee](https://github.com/MarioZZJ/cc-notify-hooks/tree/8adc9ee1711c1a1c3c531477df7e5440d8d1092c)

<!-- BEGIN META -->
[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MarioZZJ/cc-notify-hooks)
<!-- END META -->

> **功能**：为多个 Agent 宿主提供可配置的分级事件通知与待发送取消。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 在多个 Agent 接口复用渠道和待发送状态，提供分级触达；各宿主的接线与效果仍须分别验证。

> **主要限制**：[Q03](#research-q03) 的异步创建与清理可能交错，同延迟渠道不逐次检查 pending；[Q04](#research-q04) 正常运行记录完整事件并可能向外发送摘要，需要用户确认内容和接收者。

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
  - [Q01 · 该仓库面向谁，与宿主已有提醒相比增加什么？](#detail-section-11)
  - [Q02 · DSH 事件如何变为通知，取消机制如何接通？](#detail-section-12)
  - [Q03 · 哪些边界会让取消或等待通知与用户理解不同？](#detail-section-13)
  - [Q04 · 通知内容、凭据和失败信息会到哪里，如何降低采用负担？](#detail-section-14)
  - [Q05 · 带世代的状态机和默认脱敏是否能减少误发与数据暴露？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：离开终端但需要知道审批、提问和轮次结束的用户可观察分级通知，见 [Q01](#research-q01)。

比较对象为宿主本地提示和分别配置的渠道通知；本工具整合它们，无法由源码证明可靠送达。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 宿主事件桥接 | 接收审批、提问和结束事件 | 各宿主的事件形状和接线不同 |
| 分级渠道发送 | 按延迟发送摘要 | 依赖配置和渠道；实际送达未验证 |
| 待发送取消 | 用户响应后删除 pending | 独立进程及同延迟渠道存在条件性交错 |
| DSH Host 插件 | 把宿主事件转给共用脚本 | scriptsDir 必需；自身不批准或回答 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容宿主事件或 hook | 事件来源必需 | 触发提醒与清理 | 不触发则无对应通知 |
| Bash 与 jq | 脚本必需 | 解析事件与调度 | jq 缺失时安静退出 |
| scriptsDir | DSH 子插件必需 | 找共用脚本 | 未配置则禁用子插件 |
| curl、渠道凭据和网络 | 外部渠道条件 | 发送推送 | 失败可能无明确回执 |
| 可写状态目录 | 延迟取消条件 | 保存 pending 与节流 | 不满足时通知过程可能失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户检查宿主、脚本路径、权限和接收者 | 先使用合成文本与受控渠道 |
| 触发 | 宿主产生审批、提问或结束事件 | 核对事件字段和对应通知 |
| 响应 | 用户回复后检查后续待发状态 | 发现误发或漏发时停用相关渠道 |
| 核查 | 用户检查日志、配置和接收范围 | 敏感内容不适合外发时回宿主提示 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 渠道及服务费用未知 | 安装依赖、配置权限和接收者 | 宿主兼容未测 |
| 持续使用 | 网络请求与渠道资源未知 | 监控送达、误发和日志内容 | 通知可靠性未知 |
| 失败恢复 | 重发或人工检查成本未知 | 核对待发送状态与服务日志 | 渠道错误可能被吞掉 |
| 退出 | 配置和日志残留未知 | 停用 hook 并检查本机数据 | 远端已发送消息的处置依渠道 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分级提醒 | 延迟队列与多渠道脚本 | 实际送达率和响应时间 |
| 待发取消 | 按 Session 清除文件 | 并发交错下无误发 |
| 数据保护 | 可选择启用渠道 | 日志权限、远端保留和接收范围 |

> **思考**：[Q03](#research-q03) 的异步创建与清理可能交错，同延迟渠道不逐次检查 pending；[Q04](#research-q04) 正常运行记录完整事件并可能向外发送摘要，需要用户确认内容和接收者。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 在多个 Agent 接口复用渠道和待发送状态，提供分级触达；各宿主的接线与效果仍须分别验证。

[Q02](#research-q02) DSH waterfall 持续委托，通知进程不等待；[Q03](#research-q03) 的分离进程与条件检查使取消语义需要受控验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的异步创建与清理可能交错，同延迟渠道不逐次检查 pending；[Q04](#research-q04) 正常运行记录完整事件并可能向外发送摘要，需要用户确认内容和接收者。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用合成内容检查日志、凭据权限和接收者；发现隐私或取消异常时停用外部渠道。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持多宿主接线和延迟发送意图；并发取消、发送结果及数据保护未实测。世代屏障为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、plugins/cc-notify-hooks/hooks/codex-hooks.json、plugins/cc-notify-hooks/reasonix-plugin.json、plugins/cc-notify-hooks/dsh-plugin/package.json、plugins/cc-notify-hooks/dsh-plugin/index.js、plugins/cc-notify-hooks/scripts/notify.sh、plugins/cc-notify-hooks/scripts/clear_pending.sh、plugins/cc-notify-hooks/scripts/pre_tool_use.sh、plugins/cc-notify-hooks/scripts/lib/notify_format.sh、plugins/cc-notify-hooks/scripts/channels/slack.sh、plugins/cc-notify-hooks/scripts/channels/telegram.sh、install/dsh.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查仓库根 README、多宿主声明、DSH 适配器、核心调度/清理和代表渠道；未审全部渠道、所有宿主实现或安装影响。
- 下一步：以合成事件、受控假渠道和并发时钟核查取消、日志、权限及失败；本次未运行目标代码、安装、发送通知或连接外部服务。

**分析版本**

- **仓库**：[MarioZZJ/cc-notify-hooks](https://github.com/MarioZZJ/cc-notify-hooks)
- **版本号**：未声明（[固定提交 8adc9ee](https://github.com/MarioZZJ/cc-notify-hooks/tree/8adc9ee1711c1a1c3c531477df7e5440d8d1092c)）
- **版本日期**：2026-08-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设原子通知世代与默认不记录原始 payload 可减少误发和暴露；尚未实现或验证。

以合成事件、受控假渠道和并发时钟核查取消、日志、权限及失败；本次未运行目标代码、安装、发送通知或连接外部服务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1194 | — | — | 8458 |
| .js | source | 1 | 200 | 148 | 35 | — |
| .mjs | test | 1 | 244 | 201 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/MarioZZJ/cc-notify-hooks/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/MarioZZJ/cc-notify-hooks/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/MarioZZJ/cc-notify-hooks/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查跨宿主通知调度、取消条件和数据传输边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 该仓库面向谁，与宿主已有提醒相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

离开终端但需要知道 Agent 是否等待审批、提问或结束的用户，可配置短延迟通知与较晚的消息渠道。仓库根是跨 Claude Code、Codex CLI、Reasonix 和 DSH 的脚本及集成工具集合；其中 DSH 适配器是 plugins/cc-notify-hooks/dsh-plugin 下的独立 Host 插件，不应把仓库根误称为单一 DSH 插件。相较只看终端或分别配置各渠道，它复用调度脚本与会话状态，试图在用户响应后取消后续通知；是否可靠送达或降低打扰需实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/README.md#L1-L15)

作者描述四类宿主和分级通知。

<details>
<summary>查看原文（15行）</summary>

```text
# cc-notify-hooks

**Claude Code**、**Codex CLI**、**Reasonix** 与 **dsh（DeepSeek Harness）** 的分级推送通知系统。支持 **11 个通知渠道**，可作为插件或独立脚本使用，各 agent 共享同一份配置。

## 为什么需要分级通知？

Claude Code、Codex、Reasonix 和 dsh 的任务常常需要几秒到几十分钟不等。你不会一直盯着终端，但又需要在合适的时候回来操作。

**cc-notify-hooks 将通知分为两级**：

**短通知（秒级）** — 你可能只是切到了浏览器或聊天窗口。系统通知、手机推送这类**即时触达**的渠道会在几秒内提醒你"Claude 需要你"。如果你看到通知并回来操作了，后续推送自动取消——不会再打扰你。

**长通知（分钟级）** — 你可能离开了电脑、在开会、甚至不在手机旁。企业微信群、飞书群、Slack 频道这类**团队/异步渠道**会在几分钟后兜底通知。即使你错过了短通知，最终也能从工作沟通工具里看到任务状态。

**核心机制**：每次推送前检查用户是否已响应（pending 文件是否还在）。用户一旦回来操作，当前 Session 排队中的推送自动作废，其他并行 Session 不受影响。短通知解决了问题，长通知就不会再发。
```

</details>

**依据 2 · 源码核查**：[plugins/cc-notify-hooks/hooks/codex-hooks.json:1-21](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/hooks/codex-hooks.json#L1-L21)

Codex hook 指向共用脚本。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${PLUGIN_ROOT}/scripts/notify.sh\" notification",
            "timeout": 5
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${PLUGIN_ROOT}/scripts/notify.sh\" stop",
```

</details>

**依据 3 · 源码核查**：[plugins/cc-notify-hooks/reasonix-plugin.json:1-24](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/reasonix-plugin.json#L1-L24)

Reasonix 插件声明和脚本路径。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "apiVersion": "reasonix.io/plugin/v2",
  "name": "cc-notify-hooks",
  "version": "2.4.0",
  "description": "Tiered push notifications for Reasonix — macOS, Bark, Telegram, Feishu, DingTalk, Slack, Discord, Pushover, ntfy, Gotify",
  "homepage": "https://github.com/MarioZZJ/cc-notify-hooks",
  "repository": "https://github.com/MarioZZJ/cc-notify-hooks",
  "hooks": {
    "Notification": [
      {
        "command": "bash",
        "args": ["${REASONIX_PLUGIN_ROOT}/scripts/notify.sh", "notification"],
        "payloadFormat": "claude",
        "timeout": 5000,
        "description": "等待工具审批/用户注意时推送通知"
      }
    ],
    "Stop": [
      {
        "command": "bash",
        "args": ["${REASONIX_PLUGIN_ROOT}/scripts/notify.sh", "stop"],
        "payloadFormat": "claude",
        "timeout": 5000,
        "description": "一轮对话结束时推送任务完成通知"
```

</details>

**依据 4 · 源码核查**：[plugins/cc-notify-hooks/dsh-plugin/package.json:1-12](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/dsh-plugin/package.json#L1-L12)

DSH 私有子包有独立 Host 入口。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-cc-notify",
  "version": "2.4.0",
  "description": "cc-notify-hooks bridge for the DeepSeek Harness (dsh): tiered push notifications for approvals, turns, and questions, reusing the cc-notify-hooks bash scripts and channels.",
  "private": true,
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json"
  },
  "license": "MIT"
```

</details>

#### 缺口

- 未运行任一宿主或渠道的实际通知
  **影响**：不能证明送达、节时或减少打扰
  **进一步探讨**：用合成事件及受控测试渠道对照普通宿主提醒与本工具。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 事件如何变为通知，取消机制如何接通？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH 子插件要求配置 scriptsDir，随后订阅审批、轮次停止、Agent pre-step 和工具前后事件，将数据作为 JSON 交给独立脚本进程，并在 waterfall 上继续 next；自身不替用户批准或回答。notify.sh 按 session 和事件构造状态键，执行节流，清除本 Session 旧 pending 后创建新标记，按渠道延迟排序，在正等待结束后检查标记再调用渠道；clear_pending.sh 按 Session 或事件种类删除标记。其意图是响应后取消后续发送，但子进程脱离并发执行，不能单凭源码认为清理一定晚于创建或所有发送前均检查。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/cc-notify-hooks/dsh-plugin/index.js:33-40](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/dsh-plugin/index.js#L33-L40)

未设置 scriptsDir 时不注册。

```text
export function apply(ctx, config = {}) {
  const scriptsDir = typeof config.scriptsDir === 'string' ? config.scriptsDir.trim() : ''
  if (!scriptsDir) {
    ctx.logger.warn(
      '[dsh-cc-notify] scriptsDir is not configured; plugin disabled. '
      + 'Set config.scriptsDir to the cc-notify-hooks scripts directory.',
    )
    return
```

**依据 2 · 源码核查**：[plugins/cc-notify-hooks/dsh-plugin/index.js:57-81](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/dsh-plugin/index.js#L57-L81)

异步 detached 启动脚本并传 JSON。

<details>
<summary>查看原文（25行）</summary>

```text
  /** Spawn one cc-notify-hooks script with the hook payload on stdin, detached. */
  function runScript(script, args, payload) {
    let child
    try {
      child = spawn(script, args, {
        env: hookEnv,
        stdio: ['pipe', 'ignore', 'ignore'],
        detached: true,
      })
    } catch (error) {
      ctx.logger.warn(`[dsh-cc-notify] failed to start ${script}: ${String(error)}`)
      return
    }
    child.on('error', (error) => {
      ctx.logger.warn(`[dsh-cc-notify] ${script} failed: ${String(error)}`)
    })
    child.stdin.on('error', () => {})
    child.stdin.end(payload === undefined ? '' : JSON.stringify(payload))
    child.unref()
  }

  const notify = (payload) => runScript(`${scriptsDir}/notify.sh`, ['notification'], payload)
  const notifyStop = (payload) => runScript(`${scriptsDir}/notify.sh`, ['stop'], payload)
  const clear = (payload, args = []) => runScript(`${scriptsDir}/clear_pending.sh`, args, payload)
  const preTool = (payload) => runScript(`${scriptsDir}/pre_tool_use.sh`, [], payload)
```

</details>

**依据 3 · 源码核查**：[plugins/cc-notify-hooks/dsh-plugin/index.js:115-161](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/dsh-plugin/index.js#L115-L161)

审批和 turn/pre-step 接线及继续执行。

<details>
<summary>查看原文（47行）</summary>

```text
  // Pending approval → "需要确认" push. Always delegate: never answer.
  ctx.on('approval/request', (request, next) => {
    try {
      notify({
        ...base(request?.agent, 'Notification'),
        notification_type: 'permission_prompt',
        message: typeof request?.reason === 'string' && request.reason
          ? request.reason
          : `approval requested for ${request?.toolName ?? 'tool'}`,
        tool_name: typeof request?.toolName === 'string' ? request.toolName : '',
      })
    } catch (error) {
      ctx.logger.warn(`[dsh-cc-notify] approval notification failed: ${String(error)}`)
    }
    return next()
  })

  // Natural turn end → "任务完成" push.
  ctx.on('agent/turn-stopping', (payload) => {
    try {
      const agent = payload?.agent
      const sessionId = typeof agent?.session?.header?.id === 'string' ? agent.session.header.id : ''
      const text = sessionId ? lastAssistantText.get(sessionId) : undefined
      if (sessionId) lastAssistantText.delete(sessionId)
      notifyStop({
        ...base(agent, 'Stop'),
        stop_hook_active: false,
        last_assistant_message: typeof text === 'string' ? text : '',
      })
    } catch (error) {
      ctx.logger.warn(`[dsh-cc-notify] stop notification failed: ${String(error)}`)
    }
  })

  // User prompt submitted → cancel queued pushes (and mark /exit).
  ctx.on('agent/pre-step', async (payload, next) => {
    try {
      const agent = payload?.agent
      const text = blocksToText((payload?.messages ?? []).flatMap((message) => message.content ?? []))
      clear({
        ...base(agent, 'UserPromptSubmit'),
        prompt: text,
      })
    } catch (error) {
      ctx.logger.warn(`[dsh-cc-notify] pre-step clear failed: ${String(error)}`)
    }
    return next()
```

</details>

**依据 4 · 源码核查**：[plugins/cc-notify-hooks/dsh-plugin/index.js:164-196](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/dsh-plugin/index.js#L164-L196)

工具前后监听及继续执行。

<details>
<summary>查看原文（33行）</summary>

```text
  // Tool about to run: questions trigger a "waiting for reply" push, other
  // tools cancel queued pushes. Never blocks the tool call.
  ctx.on('tools/pre-execute', (exec, next) => {
    try {
      const agent = exec?.agent
      const toolName = typeof exec?.name === 'string' ? exec.name : ''
      const payload = {
        ...base(agent, 'PreToolUse'),
        tool_name: QUESTION_TOOLS.has(toolName) ? 'request_user_input' : toolName,
        tool_input: exec?.arguments ?? {},
        tool_use_id: typeof exec?.callId === 'string' ? exec.callId : '',
      }
      preTool(payload)
    } catch (error) {
      ctx.logger.warn(`[dsh-cc-notify] pre-tool dispatch failed: ${String(error)}`)
    }
    return next()
  })

  // Question tool returned → clear the user_input pending marker.
  ctx.on('tools/post-execute', (exec, _result, next) => {
    try {
      if (QUESTION_TOOLS.has(exec?.name)) {
        clear({
          ...base(exec?.agent, 'PostToolUse'),
          tool_name: 'request_user_input',
          tool_use_id: typeof exec?.callId === 'string' ? exec.callId : '',
        }, ['user_input'])
      }
    } catch (error) {
      ctx.logger.warn(`[dsh-cc-notify] post-tool clear failed: ${String(error)}`)
    }
    return next()
```

</details>

**依据 5 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:153-168](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L153-L168)

按 session 与事件节流。

<details>
<summary>查看原文（16行）</summary>

```text
    # 防重复：状态按 session + event kind 隔离。
    # request_user_input 用 tool_use_id 精确去重，不吞掉紧接着出现的新问题。
    RATE_FILE="${STATE_DIR}/last_${SESSION_KEY}_${EVENT_KIND_KEY}"
    if [ -f "$RATE_FILE" ]; then
        LAST=0
        LAST_TOOL_USE_KEY=""
        IFS=$'\t' read -r LAST LAST_TOOL_USE_KEY < "$RATE_FILE" || true
        [[ "$LAST" =~ ^[0-9]+$ ]] || LAST=0

        if [ "$EVENT_KIND" = "user_input" ] && [ -n "$TOOL_USE_ID" ]; then
            [ "$LAST_TOOL_USE_KEY" = "$TOOL_USE_KEY" ] && exit 0
        elif [ $((NOW - LAST)) -lt "$RATE_LIMIT" ]; then
            exit 0
        fi
    fi
    printf '%s\t%s\n' "$NOW" "$TOOL_USE_KEY" > "$RATE_FILE"
```

</details>

**依据 6 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:310-315](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L310-L315)

替换旧 pending 并新建标记。

```text
# ============================================================
#  创建 pending 标记
# ============================================================
rm -f "${STATE_DIR}/pending_${SESSION_KEY}_"* 2>/dev/null || true
PENDING_FILE="${STATE_DIR}/pending_${SESSION_KEY}_${EVENT_KIND_KEY}_${TOOL_USE_KEY}_${NOW}_$$"
echo "$EVENT_KIND" > "$PENDING_FILE"
```

**依据 7 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:354-379](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L354-L379)

按延迟等待和渠道发送。

<details>
<summary>查看原文（26行）</summary>

```text
# 后台子 shell 执行 pipeline
(
    elapsed=0

    echo "$QUEUE" | while read -r ch_name ch_delay; do
        # 计算需要等待的时间
        wait_time=$((ch_delay - elapsed))
        if [ "$wait_time" -gt 0 ]; then
            sleep "$wait_time"
            # 等待后检查 pending
            if [ ! -f "$PENDING_FILE" ]; then
                exit 0
            fi
            elapsed=$ch_delay
        fi

        # 加载并调用 channel
        source "${CHANNELS_DIR}/${ch_name}.sh"
        ch_config=$(jq -c ".channels.\"${ch_name}\"" "$CONFIG_FILE" 2>/dev/null || echo "{}")
        "send_${ch_name}" "$TITLE" "$BODY" "$ch_config" "$EVENT_JSON"
    done

    rm -f "$PENDING_FILE"

) </dev/null >/dev/null 2>&1 &
disown
```

</details>

**依据 8 · 源码核查**：[plugins/cc-notify-hooks/scripts/clear_pending.sh:21-40](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/clear_pending.sh#L21-L40)

按会话或类别删除 pending。

<details>
<summary>查看原文（20行）</summary>

```text
HOOK_EVENT=$(printf '%s' "$EVENT_DATA" | jq -r '.hook_event_name // empty' 2>/dev/null || true)
SESSION_ID=$(printf '%s' "$EVENT_DATA" | jq -r '.session_id // empty' 2>/dev/null || true)
TURN_ID=$(printf '%s' "$EVENT_DATA" | jq -r '.turn_id // empty' 2>/dev/null || true)
SESSION_KEY=$(safe_state_key "${SESSION_ID:-${TURN_ID:-unknown}}")
CLEAR_KIND="${1:-}"

if [ "$HOOK_EVENT" = "UserPromptSubmit" ]; then
    MESSAGE=$(printf '%s' "$EVENT_DATA" | jq -r '.message // .prompt // empty' 2>/dev/null || true)
    if [[ "$MESSAGE" =~ ^[[:space:]]*/exit[[:space:]]*$ ]]; then
        touch "${STATE_DIR}/exiting_${SESSION_KEY}"
    else
        rm -f "${STATE_DIR}/exiting_${SESSION_KEY}" 2>/dev/null || true
    fi
fi

if [ -n "$CLEAR_KIND" ]; then
    KIND_KEY=$(safe_state_key "$CLEAR_KIND")
    rm -f "${STATE_DIR}/pending_${SESSION_KEY}_${KIND_KEY}_"* 2>/dev/null || true
else
    rm -f "${STATE_DIR}/pending_${SESSION_KEY}_"* 2>/dev/null || true
```

</details>

#### 缺口

- 未控制进程调度或实际发送
  **影响**：不能保证取消、排序及多 Session 行为在宿主中成立
  **进一步探讨**：使用假渠道和可控进程调度测试发送前后响应、并发事件及会话隔离。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些边界会让取消或等待通知与用户理解不同？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

等待标记只在渠道的 wait_time 大于零且 sleep 完成后检查；零延迟渠道或与上一渠道相同延迟的后续渠道不会再次检查，用户在同一批发送之间响应仍可能收到后续通知。DSH 的 notify 和 clear 分别 detached；如果清理先运行而通知脚本随后才创建 pending，后续通知仍可能排队，这是源码允许的交错，尚未复现。DSH pre-step 无条件发清理脚本，不能仅从事件名证明每次都是用户明确回复；提问通知还要求 tool_input.questions 是非空数组。Session ID 缺失时脚本使用 unknown，多个无身份事件可能共享键，且键经替换与截断可能碰撞。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:120-129](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L120-L129)

空身份回退与状态键净化截断。

<details>
<summary>查看原文（10行）</summary>

```text
safe_state_key() {
    local value="${1:-unknown}"
    value=$(printf '%s' "$value" | LC_ALL=C tr -c '[:alnum:]_.-' '_' | cut -c1-96)
    printf '%s' "${value:-unknown}"
}

SESSION_SCOPE="${SESSION_ID:-${TURN_ID:-unknown}}"
SESSION_KEY=$(safe_state_key "$SESSION_SCOPE")
EVENT_KIND_KEY=$(safe_state_key "$EVENT_KIND")
TOOL_USE_KEY=$(safe_state_key "${TOOL_USE_ID:-no-call}")
```

</details>

**依据 2 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:354-373](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L354-L373)

只有正等待后检查 pending。

<details>
<summary>查看原文（20行）</summary>

```text
# 后台子 shell 执行 pipeline
(
    elapsed=0

    echo "$QUEUE" | while read -r ch_name ch_delay; do
        # 计算需要等待的时间
        wait_time=$((ch_delay - elapsed))
        if [ "$wait_time" -gt 0 ]; then
            sleep "$wait_time"
            # 等待后检查 pending
            if [ ! -f "$PENDING_FILE" ]; then
                exit 0
            fi
            elapsed=$ch_delay
        fi

        # 加载并调用 channel
        source "${CHANNELS_DIR}/${ch_name}.sh"
        ch_config=$(jq -c ".channels.\"${ch_name}\"" "$CONFIG_FILE" 2>/dev/null || echo "{}")
        "send_${ch_name}" "$TITLE" "$BODY" "$ch_config" "$EVENT_JSON"
```

</details>

**依据 3 · 源码核查**：[plugins/cc-notify-hooks/dsh-plugin/index.js:57-75](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/dsh-plugin/index.js#L57-L75)

每个事件独立启动 detached 进程。

<details>
<summary>查看原文（19行）</summary>

```text
  /** Spawn one cc-notify-hooks script with the hook payload on stdin, detached. */
  function runScript(script, args, payload) {
    let child
    try {
      child = spawn(script, args, {
        env: hookEnv,
        stdio: ['pipe', 'ignore', 'ignore'],
        detached: true,
      })
    } catch (error) {
      ctx.logger.warn(`[dsh-cc-notify] failed to start ${script}: ${String(error)}`)
      return
    }
    child.on('error', (error) => {
      ctx.logger.warn(`[dsh-cc-notify] ${script} failed: ${String(error)}`)
    })
    child.stdin.on('error', () => {})
    child.stdin.end(payload === undefined ? '' : JSON.stringify(payload))
    child.unref()
```

</details>

**依据 4 · 源码核查**：[plugins/cc-notify-hooks/dsh-plugin/index.js:149-161](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/dsh-plugin/index.js#L149-L161)

所有 pre-step 触发清理。

<details>
<summary>查看原文（13行）</summary>

```text
  // User prompt submitted → cancel queued pushes (and mark /exit).
  ctx.on('agent/pre-step', async (payload, next) => {
    try {
      const agent = payload?.agent
      const text = blocksToText((payload?.messages ?? []).flatMap((message) => message.content ?? []))
      clear({
        ...base(agent, 'UserPromptSubmit'),
        prompt: text,
      })
    } catch (error) {
      ctx.logger.warn(`[dsh-cc-notify] pre-step clear failed: ${String(error)}`)
    }
    return next()
```

</details>

**依据 5 · 源码核查**：[plugins/cc-notify-hooks/scripts/pre_tool_use.sh:14-28](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/pre_tool_use.sh#L14-L28)

提问须有非空 questions 数组。

<details>
<summary>查看原文（15行）</summary>

```text
TOOL_NAME=$(printf '%s' "$EVENT_DATA" | jq -r '.tool_name // empty' 2>/dev/null || true)

case "$TOOL_NAME" in
    request_user_input|ask|AskUserQuestion)
        QUESTION_COUNT=$(printf '%s' "$EVENT_DATA" | jq -r '
            if (.tool_input.questions? | type) == "array"
            then (.tool_input.questions | length)
            else 0
            end
        ' 2>/dev/null || echo "0")

        [ "$QUESTION_COUNT" -gt 0 ] 2>/dev/null || exit 0
        printf '%s' "$EVENT_DATA" \
            | bash "${SCRIPT_DIR}/notify.sh" notification user_input \
            || true
```

</details>

#### 缺口

- 调度竞态、无身份和相同延迟的实际频率未测
  **影响**：无法量化误发或漏发
  **进一步探讨**：用假时钟与无网络渠道控制创建、清理和相同延迟发送顺序。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 通知内容、凭据和失败信息会到哪里，如何降低采用负担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

调度脚本在正常运行时把完整输入事件追加到固定 /tmp/claude-hooks-debug.log，代码此处未设置专用权限、轮换或脱敏；其内容取决于输入，DSH 审批原因、问题内容和最后一条助手文本可能进入日志。推送摘要可包含项目名、问题、选项、工作目录、主机名和 Session；Slack、Telegram 等渠道使用配置中的 webhook 或 token 将内容发送至外部服务。安装脚本将配置写入 JSON，但所读写入路径未显式设置文件权限；实际权限取决环境及已有文件。渠道 curl 失败被吞掉且后台输出忽略，不能把无报错当送达。首次应审查内容与接收者、配置权限和日志，先用合成文本验证；内容敏感或无法确认取消、保留和送达时应停用外部渠道并回到宿主本地提示。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:74-85](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L74-L85)

未脱敏事件追加固定临时日志。

<details>
<summary>查看原文（12行）</summary>

```text
EVENT_DATA=$(cat)
EVENT_TYPE="${1:-unknown}"
EVENT_KIND="${2:-$EVENT_TYPE}"

# 调试日志
DEBUG_LOG="/tmp/claude-hooks-debug.log"
if [ "${CC_NOTIFY_RENDER_ONLY:-}" != "1" ]; then
    {
        echo "[$(date)] EVENT_TYPE=$EVENT_TYPE"
        echo "$EVENT_DATA"
        echo "---"
    } >> "$DEBUG_LOG"
```

</details>

**依据 2 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:252-301](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L252-L301)

构造含摘要、项目、cwd、主机和 Session 的事件。

<details>
<summary>查看原文（50行）</summary>

```text
SUMMARY_SHORT=$(truncate_text "$(trim_text "$(first_line "$SUMMARY_SOURCE")")" 120)
[ -n "$SUMMARY_SHORT" ] || SUMMARY_SHORT="${EVENT_NAME:-有新事件}"
SESSION_SHORT=$(short_session_id "$SESSION_SCOPE")

TITLE="${AGENT_NAME} · ${STATUS_LABEL}"
if [ "$EVENT_KIND" = "user_input" ]; then
    BODY="[$PROJECT] $SUMMARY_SHORT · ${QUESTION_COUNT} 个问题 · Session ${SESSION_SHORT:-unknown}"
else
    BODY="[$PROJECT] $SUMMARY_SHORT"
    [ -n "$TOOL_NAME" ] && BODY="${BODY} · ${TOOL_NAME}"
fi

EVENT_JSON=$(
    jq -n \
        --arg title "$TITLE" \
        --arg body "$BODY" \
        --arg agent "$AGENT_NAME" \
        --arg project "$PROJECT" \
        --arg status_label "$STATUS_LABEL" \
        --arg status_color "$STATUS_COLOR" \
        --arg summary_short "$SUMMARY_SHORT" \
        --arg event_name "$EVENT_NAME" \
        --arg event_kind "$EVENT_KIND" \
        --arg tool_name "$TOOL_NAME" \
        --arg model "$MODEL" \
        --arg cwd "$CWD" \
        --arg hostname "$HOSTNAME_SHORT" \
        --arg session_id "$SESSION_ID" \
        --arg session_short "$SESSION_SHORT" \
        --argjson question_count "$QUESTION_COUNT" \
        --argjson option_labels "$OPTION_LABELS" \
        '{
            schema_version: 1,
            title: $title,
            body: $body,
            agent: $agent,
            project: $project,
            status_label: $status_label,
            status_color: $status_color,
            summary_short: $summary_short,
            event_name: $event_name,
            event_kind: $event_kind,
            tool_name: $tool_name,
            model: $model,
            cwd: $cwd,
            hostname: $hostname,
            session_id: $session_id,
            session_short: $session_short,
            question_count: $question_count,
            option_labels: $option_labels
```

</details>

**依据 3 · 源码核查**：[plugins/cc-notify-hooks/scripts/lib/notify_format.sh:17-44](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/lib/notify_format.sh#L17-L44)

长通知包含问题选项及环境信息。

<details>
<summary>查看原文（28行）</summary>

```text
notify_long_markdown() {
    local event_json="$1"
    printf '%s' "$event_json" | jq -r '
        def present: . != null and . != "";
        def note: [.model, .cwd, .hostname] | map(select(. != null and . != "")) | join(" · ");
        def session_value:
            if .event_kind == "user_input" and (.session_id | present)
            then .session_id
            else .session_short
            end;
        (
            [
                (.summary_short // ""),
                "",
                "**项目**: " + (.project // "unknown"),
                "**事件**: " + (.event_name // "unknown")
            ]
            + (if (.tool_name | present) then ["**工具**: " + .tool_name] else [] end)
            + (if (.event_kind == "user_input" and (.question_count // 0) > 0)
               then ["**问题数**: " + ((.question_count // 0) | tostring)]
               else [] end)
            + (if (.event_kind == "user_input" and ((.option_labels // []) | length) > 0)
               then ["**选项**: " + ((.option_labels // []) | join(" / "))]
               else [] end)
            + (if (session_value | present) then ["**Session**: " + session_value] else [] end)
            + (if (note != "") then ["", note] else [] end)
        )
        | join("\n")
```

</details>

**依据 4 · 源码核查**：[plugins/cc-notify-hooks/scripts/channels/slack.sh:25-40](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/channels/slack.sh#L25-L40)

向配置 webhook 发送内容并吞掉失败。

<details>
<summary>查看原文（16行）</summary>

```text
    local text
    text=$(notify_long_markdown "$event_json" | sed 's/\*\*/\*/g')

    curl -sf --max-time 10 \
        -H "Content-Type: application/json" \
        -d "$(jq -n \
            --arg title "$title" \
            --arg text "$text" \
            '{
                text: ($title + "\n" + $text),
                blocks: [
                    {type:"section", text:{type:"mrkdwn", text:("*" + $title + "*")}},
                    {type:"section", text:{type:"mrkdwn", text:$text}}
                ]
            }')" \
        "$webhook" >/dev/null 2>&1 || true
```

</details>

**依据 5 · 源码核查**：[plugins/cc-notify-hooks/scripts/channels/telegram.sh:4-17](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/channels/telegram.sh#L4-L17)

token 与消息用于 Telegram 请求，失败被吞掉。

<details>
<summary>查看原文（14行）</summary>

```text
send_telegram() {
    local title="$1" body="$2" config="$3"
    local bot_token chat_id
    bot_token=$(echo "$config" | jq -r '.bot_token')
    chat_id=$(echo "$config" | jq -r '.chat_id')

    curl -sf --max-time 10 \
        -H "Content-Type: application/json" \
        -d "$(jq -n \
            --arg chat_id "$chat_id" \
            --arg text "$title
$body" \
            '{chat_id:$chat_id, text:$text}')" \
        "https://api.telegram.org/bot${bot_token}/sendMessage" >/dev/null 2>&1 || true
```

</details>

**依据 6 · 源码核查**：[install/dsh.sh:240-265](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/install/dsh.sh#L240-L265)

配置写入 JSON，所示路径未显式设置权限。

<details>
<summary>查看原文（26行）</summary>

```text
    if [ -n "$fields" ]; then
        IFS=';' read -ra FIELD_DEFS <<< "$fields"
        for fdef in "${FIELD_DEFS[@]}"; do
            IFS=':' read -r fkey fdesc <<< "$fdef"
            val="${CHANNEL_CONFIGS["${name}.${fkey}"]:-}"

            if [ -z "$val" ] && [ -f "$CONFIG_FILE" ]; then
                val=$(jq -r ".channels.\"${name}\".\"${fkey}\" // empty" "$CONFIG_FILE" 2>/dev/null) || true
            fi

            if [ -z "$val" ] && [[ "$fdesc" =~ \[(.+)\] ]]; then
                val="${BASH_REMATCH[1]}"
            fi

            if [ -n "$val" ]; then
                ch_json=$(echo "$ch_json" | jq --arg v "$val" --arg k "$fkey" '.[$k] = $v')
            fi
        done
    fi

    CONFIG_JSON=$(echo "$CONFIG_JSON" | jq --argjson ch "$ch_json" --arg name "$name" '.channels[$name] = $ch')
done

mkdir -p "$INSTALL_DIR"
echo "$CONFIG_JSON" | jq '.' > "$CONFIG_FILE"
echo -e "  ${GREEN}✓${NC} 配置已写入 $CONFIG_FILE"
```

</details>

#### 缺口

- 实际文件权限、日志保留、外部服务策略和接收对象未核验
  **影响**：无法判断当前环境的隐私和送达保证
  **进一步探讨**：在隔离配置用无敏感合成内容检查权限、日志、网络请求及接收后再决定启用渠道。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 带世代的状态机和默认脱敏是否能减少误发与数据暴露？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：为每个 Session 的通知创建单调世代，在创建、响应和每次渠道发送前共享地验证当前世代，且默认不记录原始 payload，可能减少旧通知误发及日志暴露。世代读写必须原子化并覆盖相同延迟及零延迟渠道，否则只是重命名现有文件标记。最小实验用假时钟、假文件系统和假渠道构造清理先于创建、渠道同延迟和无身份三类交错，并对比发送次数和日志；若仍出现旧通知或误取消新通知，或日志泄露敏感合成字段，假设不成立。当前实现没有共同世代屏障。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:310-315](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L310-L315)

pending 文件按事件建立和替换。

```text
# ============================================================
#  创建 pending 标记
# ============================================================
rm -f "${STATE_DIR}/pending_${SESSION_KEY}_"* 2>/dev/null || true
PENDING_FILE="${STATE_DIR}/pending_${SESSION_KEY}_${EVENT_KIND_KEY}_${TOOL_USE_KEY}_${NOW}_$$"
echo "$EVENT_KIND" > "$PENDING_FILE"
```

**依据 2 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:358-373](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L358-L373)

仅在正等待后检查文件。

<details>
<summary>查看原文（16行）</summary>

```text
    echo "$QUEUE" | while read -r ch_name ch_delay; do
        # 计算需要等待的时间
        wait_time=$((ch_delay - elapsed))
        if [ "$wait_time" -gt 0 ]; then
            sleep "$wait_time"
            # 等待后检查 pending
            if [ ! -f "$PENDING_FILE" ]; then
                exit 0
            fi
            elapsed=$ch_delay
        fi

        # 加载并调用 channel
        source "${CHANNELS_DIR}/${ch_name}.sh"
        ch_config=$(jq -c ".channels.\"${ch_name}\"" "$CONFIG_FILE" 2>/dev/null || echo "{}")
        "send_${ch_name}" "$TITLE" "$BODY" "$ch_config" "$EVENT_JSON"
```

</details>

**依据 3 · 源码核查**：[plugins/cc-notify-hooks/scripts/notify.sh:78-85](https://github.com/MarioZZJ/cc-notify-hooks/blob/8adc9ee1711c1a1c3c531477df7e5440d8d1092c/plugins/cc-notify-hooks/scripts/notify.sh#L78-L85)

正常运行记录完整事件。

```text
# 调试日志
DEBUG_LOG="/tmp/claude-hooks-debug.log"
if [ "${CC_NOTIFY_RENDER_ONLY:-}" != "1" ]; then
    {
        echo "[$(date)] EVENT_TYPE=$EVENT_TYPE"
        echo "$EVENT_DATA"
        echo "---"
    } >> "$DEBUG_LOG"
```

#### 缺口

- 新的状态机和脱敏方案未实现或对照
  **影响**：不能断言误发或泄漏已减少
  **进一步探讨**：使用受控进程交错与合成敏感字段测试，再检查实际渠道输出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
