# dsh-auto-reviewer

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[4eff126](https://github.com/AntaresCorn/dsh-auto-reviewer/tree/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AntaresCorn/dsh-auto-reviewer)
<!-- END META -->

> **实现功能**：为 DSH 增加 auto-review 权限预设，按规则与可选 LLM 裁决提权并显示通知。

> **核心亮点**：为DSH组合预设、逐次审批与可读通知，提供规则到LLM再到人工的路由；价值在减少打断的机制，未证明与任何官方产品保障等价。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：最近用户文本命中英语肯定词就标用户确认，没有绑定当前操作；参数缺失仍可能因未命中风险规则走默认自动放行。加载还会改宿主客户端文件，均需独立核查。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 自动审批改变什么分工？](#detail-section-11)
  - [Q02 · 决策和审计如何进入审批链？](#detail-section-12)
  - [Q03 · 用户确认和未命中规则能证明授权吗？](#detail-section-13)
  - [Q04 · 安装、使用与恢复的总成本如何？](#detail-section-14)
  - [Q05 · 可否用操作绑定授权代替关键词？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望减少重复审批提示的开发者可研究单次自动裁决，但合格结果必须保留具体操作的用户授权。[Q01](#research-q01)

人工逐次确认保留操作决定权，完全放开减少打断但失去逐次门；本插件处于两者之间，必须测授权准确性而非只测提示数量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| auto-review预设 | 选择自动审批策略 | ask模式并由插件裁决 |
| 规则审批 | 单次放行、拒绝或转人工 | 未命中规则不证明安全 |
| 可选LLM审查 | 处理模糊请求 | 模型费用、失败回退与误判未知 |
| 审批通知 | 解释风险与依据 | 命令截断，非完整审计存证 |
| 图标补丁 | 显示新预设图标 | 会写已安装宿主文件，无自动回滚证据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH审批与预设服务 | 核心必需 | 拦截提权和识别模式 | 无自动裁决或转人工 |
| 会话工具调用格式 | 正确判断必需 | 取得参数与用户文本 | 可能未知输入，需核查 |
| provider/model | LLM分支可选 | 模糊决策 | 失败转人工或拒绝 |
| 宿主客户端文件写权限 | 图标补丁条件 | 改写权限图标 | 记录跳过，不等于审批失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份可恢复宿主并安装 | 依赖和预设加载正确 |
| 评估 | 隔离会话测试无副作用审批 | 决策和人工基准一致 |
| 复核 | 用户检查通知与回退 | 有错即恢复人工并检查补丁 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主环境，金额未知 | 依赖接线、重启和恢复准备 | 加载会写宿主客户端文件 |
| 持续使用 | 可选LLM费用与时延未知 | 维护规则、复核通知 | 减提示不等于授权正确 |
| 失败恢复 | 重装与排查资源未知 | 恢复人工策略和宿主文件 | 无补丁自动回滚证据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 单次自动裁决 | allowed-once/rejected与next | 真实审批链兼容 |
| 审计提示 | 规则依据和命令摘要 | 完整审计、误判频率 |
| 减少打断 | 默认快路径 | 安全收益、节时与LLM成本 |

> **思考**：最近用户文本命中英语肯定词就标用户确认，没有绑定当前操作；参数缺失仍可能因未命中风险规则走默认自动放行。加载还会改宿主客户端文件，均需独立核查。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：为DSH组合预设、逐次审批与可读通知，提供规则到LLM再到人工的路由；价值在减少打断的机制，未证明与任何官方产品保障等价。[Q01](#research-q01) [Q02](#research-q02)

为DSH组合预设、逐次审批与可读通知，提供规则到LLM再到人工的路由；价值在减少打断的机制，未证明与任何官方产品保障等价。[Q01](#research-q01) [Q02](#research-q02)

来源为user的消息过滤、单次结果与异常next有明确目的；但授权与风险被近似词规则混合，未知参数不阻止快路径，宿主bundle直接补丁扩大维护范围。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

最近用户文本命中英语肯定词就标用户确认，没有绑定当前操作；参数缺失仍可能因未命中风险规则走默认自动放行。加载还会改宿主客户端文件，均需独立核查。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在可恢复的宿主副本用无副作用样本比较决策，特别检查旧确认、新目标和参数缺失。关键工作区先保留人工审批，明确图标文件恢复办法。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

审批接线与通知有源码支持；授权绑定不足、参数未知快路径和宿主文件修改限制采用，未运行安全验收。授权凭据方案为假设。

- 已检查：作者 README、包清单、源码路径 src/index.ts、cordis.patch.yml、client/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定审批实现、预设及图标补丁源码；未安装、运行审批、调用LLM或修改任何宿主文件。
- 下一步：用无副作用桩比较旧确认、否定句、目标变化、参数缺失及LLM失败，并核查宿主文件恢复，未执行。

**分析版本**

- **仓库**：[AntaresCorn/dsh-auto-reviewer](https://github.com/AntaresCorn/dsh-auto-reviewer)
- **版本号**：0.2.0（[固定提交 4eff126](https://github.com/AntaresCorn/dsh-auto-reviewer/tree/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用绑定工具、参数、工作区和期限的授权凭据，未知操作转人工；以无副作用桩检验旧确认和目标变更，若碰撞或大量误阻塞则否定。未实现。[Q05](#research-q05)

用无副作用桩比较旧确认、否定句、目标变化、参数缺失及LLM失败，并核查宿主文件恢复，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 750 | 627 | 115 | — |
| .md | source | 2 | 267 | — | — | 3128 |
| .ts | source | 1 | 610 | 482 | 84 | — |
| .mjs | test | 2 | 469 | 425 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AntaresCorn/dsh-auto-reviewer/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验自动审批的操作分工、授权证据与安装副作用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 自动审批改变什么分工？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向在 DSH 沙箱中频繁收到提权请求、希望低风险操作少打断的开发者。合格结果必须同时满足应放行的操作继续执行、需要用户决定的操作仍保留决定权，并可回溯为何裁决。相对始终人工确认，它把部分审核交给规则和可选LLM；相对完全放开权限，它试图保留逐次裁决与审计消息。实现减少提示的机制明确，但没有同任务误放行率、漏拒绝率和节时对照。名字引用类似 Codex 的模式不能证明其策略或保障等价，贡献应限定为社区实现的DSH审批接线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-13](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/README.md#L3-L13)

作者定义减少权限打断与人工回退目标。

<details>
<summary>查看原文（11行）</summary>

```text
# dsh-auto-reviewer — Codex-style "approve for me" permission mode

为 DeepSeek Harness 提供类似 Codex Auto Reviewer / "approve for me" 的权限模式：

- 在现有 **Permissions** 列表中新增 **auto-review** 选项；
- 模型在沙箱中请求提权时，插件自动判断这次操作是否危险、是否已被用户明确确认；
- 安全操作自动同意（`allowed-once`），危险/模糊操作转交用户确认，明显恶意/破坏性操作直接拒绝；
- 模糊场景可选调用 LLM 进行自动审查，LLM 不可用或拿不准时安全地退回人工确认。

> 这是一个社区项目，与 DeepSeek 官方无关。

```

</details>

**依据 2 · 源码核查**：[src/index.ts:527-552](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/src/index.ts#L527-L552)

在指定预设下直接返回单次审批结果，是分工变化的实现。

<details>
<summary>查看原文（26行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  applyPermissionIconPatch(ctx)

  // Prepend so this reviewer runs before the interactive UI answerer.
  ctx.on('approval/request', async (req: ApprovalRequest, next: () => Promise<ApprovalOutcome>): Promise<ApprovalOutcome> => {
    try {
      const permission = ctx.permissionPresets
      if (!permission || permission.current(req.agent.session) !== config.presetName) {
        return next()
      }

      const input = buildReviewInput(req, config)
      const noticeBase = {
        authorization: (input.hasExplicitUserConfirmation ? 'user-confirmed' : 'unknown') as ApprovalNotice['authorization'],
        toolName: input.toolName,
        mode: input.requestedMode,
        request: input.justification ? oneLine(input.justification, NOTICE_DETAIL_MAX_CHARS) : undefined,
        command: input.commandSummary,
      }
      const approve = (risk: ApprovalNotice['risk'], basis: string): ApprovalOutcome => {
        injectApprovalNotice(req, { ...noticeBase, outcome: 'approved', risk, basis })
        return 'allowed-once'
      }
      const deny = (risk: ApprovalNotice['risk'], basis: string): ApprovalOutcome => {
        injectApprovalNotice(req, { ...noticeBase, outcome: 'denied', risk, basis })
        return 'rejected'
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 决策和审计如何进入审批链？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

patch 增加 auto-review 预设并保留 ask 策略；handler 以 prepend 注册 approval/request，先确认当前预设，再从历史找工具参数和最近真实用户消息。黑名单先执行，高风险和critical规则后执行，再尝试workspace-write或danger-full-access快路径、用户确认快路径，最后才调用LLM。approve/deny注入通知并返回allowed-once/rejected；异常和模糊可调用next交还交互链。通知带工具、模式、规则依据和截断命令，支持事后理解但不是完整审计存证。可借鉴的是单次结果、来源过滤和失败转交链；依赖宿主预设、审批、消息格式和LLM API，实际兼容需运行核查。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:555-609](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/src/index.ts#L555-L609)

规则、快路径、LLM与next的顺序可核查。

<details>
<summary>查看原文（55行）</summary>

```text
      // Blocklist: user-configured hard rules.
      let blocklistIndex = -1
      for (let index = 0; index < config.blocklist.length; index += 1) {
        // Invalid patterns still fail safe through the outer catch.
        if (new RegExp(config.blocklist[index], 'i').test(input.commandText)) {
          blocklistIndex = index
          break
        }
      }
      if (blocklistIndex >= 0) {
        if (config.blocklistMode === 'reject') {
          return deny('high', `blocklist rule #${blocklistIndex + 1}: ${oneLine(config.blocklist[blocklistIndex], 80)}`)
        }
        return next()
      }

      const highRiskRule = firstRuleMatch(input.commandText, HIGH_RISK_RULES)
      const criticalRule = firstRuleMatch(input.commandText, CRITICAL_RISK_RULES)

      // Critical destructive operations: reject unless the user explicitly confirmed.
      if (criticalRule && !input.hasExplicitUserConfirmation && config.rejectCritical) {
        return deny('critical', `critical rule: ${criticalRule.name}; no explicit user confirmation`)
      }

      // Fast auto-approve paths.
      if (input.requestedMode === 'workspace-write' && config.autoApproveWorkspaceWrite && !highRiskRule) {
        return approve('low', 'auto-approve: workspace-write escalation without a high-risk rule')
      }
      if (input.requestedMode === 'danger-full-access' && config.autoApproveDangerFullAccess && !highRiskRule) {
        return approve('low', 'auto-approve: danger-full-access escalation without a high-risk rule')
      }
      if (input.hasExplicitUserConfirmation && config.autoApproveUserConfirmed && !criticalRule) {
        return approve(highRiskRule ? 'medium' : 'low', 'auto-approve: explicit user confirmation in recent messages')
      }

      // Ambiguous middle ground: ask the reviewer LLM.
      const decision = await runLlmReview(ctx, req, input, config)
      const llmReason = decision?.reason ? `: ${decision.reason}` : ''
      if (decision?.action === 'allow') {
        return approve(highRiskRule ? 'medium' : 'low', `llm review (allow)${llmReason}`)
      }
      if (decision?.action === 'reject') {
        return deny(criticalRule || highRiskRule ? 'high' : 'medium', `llm review (reject)${llmReason}`)
      }
      if (decision?.action === 'ask') {
        if (config.askOnAmbiguous) return next()
        return deny(highRiskRule ? 'high' : 'medium', `llm review (ask)${llmReason}; askOnAmbiguous=false`)
      }
      if (config.askOnAmbiguous) return next()
      return deny(highRiskRule ? 'high' : 'medium', 'llm reviewer unavailable or inconclusive; askOnAmbiguous=false')
    } catch {
      // Any reviewer failure must fail safe: ask the user.
      return next()
    }
  }, true)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:281-298](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/src/index.ts#L281-L298)

通知包含依据和截断显示，限定审计范围。

<details>
<summary>查看原文（18行）</summary>

```text
export function formatApprovalNotice(notice: ApprovalNotice): string {
  const lines = [
    `Automatic approval review ${notice.outcome} (risk: ${notice.risk}, authorization: ${notice.authorization})`,
    `tool: ${notice.toolName}`,
  ]
  if (notice.mode) lines.push(`mode: ${notice.mode}`)
  lines.push(`basis: ${notice.basis}`)
  if (notice.request) lines.push(`request: ${notice.request}`)
  lines.push(`command: ${notice.command || '(unavailable)'}`)
  return lines.join('\n')
}

/** One-line collapsed-row summary for the same decision. */
export function approvalNoticeSummary(notice: ApprovalNotice): string {
  const parts = [`${notice.outcome}(${notice.risk})`, notice.toolName]
  if (notice.mode) parts.push(notice.mode)
  parts.push(notice.command || notice.basis)
  return oneLine(parts.join(' · '), 200)
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:20-39](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/cordis.patch.yml#L20-L39)

预设与默认自动放行设置属于实际分发配置。

<details>
<summary>查看原文（20行）</summary>

```text
        name: workspace-write
        description: Write inside the workspace and permitted temporary directories; wider retries require approval.
      auto-review:
        sandbox: workspace-write
        approval: ask
        name: auto-review
        description: Codex-style approve for me — safe sandbox escalations are approved automatically, risky ones ask the user.
      danger-full-access:
        sandbox: danger-full-access
        approval: never
        name: danger-full-access
        description: Full file access without approval prompts.

- insert:
    - id: dsh-auto-reviewer
      name: '@dsh-external/dsh-auto-reviewer'
      config:
        presetName: auto-review
        autoApproveWorkspaceWrite: true
        autoApproveDangerFullAccess: true
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 用户确认和未命中规则能证明授权吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。确认判断把最近若干条用户文本拼接，只要命中please run、approved、yes等英语模式就设hasExplicitUserConfirmation，没有把肯定词绑定本次工具、参数、目标与时间。此前允许测试的yes可能影响后续另一请求，中文确认又可能不命中；这是授权证据过粗的设计限制。工具参数解析失败返回null，commandText仍可能只剩reason；若reason声明workspace-write或danger-full-access且未命中高风险正则，默认快路径可放行，不要求参数完整或LLM复核。规则未命中不是安全证明。这里描述静态可达分支，未构造绕过或执行危险动作，真实请求格式和宿主外层约束仍须核查。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:86-90](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/src/index.ts#L86-L90)

确认模式为广义英语词，无对象绑定。

```text
const CONFIRM_PATTERNS = [
  /please (go ahead|run|do|execute|install|delete|remove|push|publish|apply|proceed)/i,
  /\b(i confirm|user (asked|requested|approved|wants|confirmed|said)|go ahead|approved|allow(ed)?|confirm|do it|please proceed|proceed)\b/i,
  /^\s*(yes|y|ok|okay|sure|fine)\b/i,
]
```

**依据 2 · 源码核查**：[src/index.ts:180-237](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/src/index.ts#L180-L237)

参数缺失返回null，确认来自多条用户文本整体匹配。

<details>
<summary>查看原文（58行）</summary>

```text
function findToolCallArguments(session: any, callId?: string, toolName?: string): Record<string, unknown> | null {
  const messages = session.deriveMessages?.() ?? []
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    for (const block of message.content ?? []) {
      if (block.type !== 'tool-call') continue
      if (callId !== undefined && block.id !== callId) continue
      if (toolName !== undefined && block.name !== toolName) continue
      try {
        const parsed = JSON.parse(block.arguments)
        return typeof parsed === 'object' && parsed !== null ? parsed : null
      } catch {
        return null
      }
    }
  }
  return null
}

function collectRecentUserText(session: any, max: number): string {
  const messages = session.deriveMessages?.() ?? []
  const lines: string[] = []
  for (let index = messages.length - 1; index >= 0 && lines.length < max; index -= 1) {
    const message = messages[index]
    if (message.role !== 'user' || message.source?.kind !== 'user') continue
    const text = textOfMessage(message).trim()
    if (text) lines.unshift(text)
  }
  return lines.join('\n---\n')
}

function buildReviewInput(req: ApprovalRequest, config: Config): ReviewInput {
  const session = req.agent.session
  const args = findToolCallArguments(session, req.callId, req.toolName)
  const commandText = [
    args ? JSON.stringify(args) : '',
    req.reason ?? '',
  ].filter(Boolean).join('\n')
  const commandSummary = summarizeToolArguments(req.toolName, args)

  const reason = req.reason ?? ''
  const requestedMode = /escalate sandbox to (workspace-write|danger-full-access)/.exec(reason)?.[1]
  const justification = reason.replace(/^escalate sandbox to (workspace-write|danger-full-access):\s*/i, '')

  const recentUserText = collectRecentUserText(session, config.maxContextMessages)
  const hasExplicitUserConfirmation = recentUserText.length > 0 && matchesAny(recentUserText, CONFIRM_PATTERNS)

  return {
    toolName: req.toolName,
    callId: req.callId,
    reason: req.reason,
    requestedMode,
    justification,
    commandText,
    commandSummary,
    recentUserText,
    hasExplicitUserConfirmation,
  }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:571-587](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/src/index.ts#L571-L587)

未命中高风险即进入默认放行快路径，参数完整性未作门槛。

<details>
<summary>查看原文（17行）</summary>

```text
      const highRiskRule = firstRuleMatch(input.commandText, HIGH_RISK_RULES)
      const criticalRule = firstRuleMatch(input.commandText, CRITICAL_RISK_RULES)

      // Critical destructive operations: reject unless the user explicitly confirmed.
      if (criticalRule && !input.hasExplicitUserConfirmation && config.rejectCritical) {
        return deny('critical', `critical rule: ${criticalRule.name}; no explicit user confirmation`)
      }

      // Fast auto-approve paths.
      if (input.requestedMode === 'workspace-write' && config.autoApproveWorkspaceWrite && !highRiskRule) {
        return approve('low', 'auto-approve: workspace-write escalation without a high-risk rule')
      }
      if (input.requestedMode === 'danger-full-access' && config.autoApproveDangerFullAccess && !highRiskRule) {
        return approve('low', 'auto-approve: danger-full-access escalation without a high-risk rule')
      }
      if (input.hasExplicitUserConfirmation && config.autoApproveUserConfirmed && !criticalRule) {
        return approve(highRiskRule ? 'medium' : 'low', 'auto-approve: explicit user confirmation in recent messages')
```

</details>

#### 缺口

- 真实宿主请求参数缺失和跨轮确认误判的发生率未知。
  **影响**：不能量化误放行风险。
  **进一步探讨**：用无副作用fixture核对参数丢失、否定句、旧确认与不同操作目标的决策。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、使用与恢复的总成本如何？

**研究主题**：效果与总成本、采用判断

#### 完整回答

除审查调用外，apply会执行权限图标补丁，读取宿主客户端文件、写临时检查脚本、运行Node语法检查并直接改写已安装客户端bundle。该副作用超过单纯审批决策，停用插件没有对应回滚文件的路径，升级后又可能需要重补。首次需配置宿主依赖、重启与选择预设，持续需维护规则并支付可选LLM调用资源，失败时还要检查宿主文件和恢复人工审批；费用、延迟与节时未知。成本单位应是一次正确保留用户授权边界的审批，而非提示减少次数。鉴于默认快速放行和确认绑定不足，建议观察并在隔离环境核查，而非直接替换关键工作区的人工门。可从关闭自动放行快路径、记录决策的受控评估开始，但不把这一配置视为已验证安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:499-528](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/src/index.ts#L499-L528)

加载时直接改写宿主客户端文件，语法检查不等于回滚。

<details>
<summary>查看原文（30行）</summary>

```text
function applyPermissionIconPatch(ctx: Context): void {
  const failures: string[] = []
  for (const file of permissionIconClientPaths()) {
    try {
      const source = readFileSync(file, 'utf8')
      const patched = patchPermissionIconSource(source)
      if (patched === source) return // already patched
      const dir = mkdtempSync(join(tmpdir(), 'dsh-auto-reviewer-icon-'))
      const check = join(dir, 'client-check.mjs')
      copyFileSync(file, check)
      try {
        writeFileSync(check, patched)
        execFileSync(process.execPath, ['--check', check], { stdio: 'pipe' })
      } finally {
        unlinkSync(check)
      }
      writeFileSync(file, patched)
      ctx.logger?.warn?.('[dsh-auto-reviewer] permission icon patch applied: %s', file)
      return
    } catch (error) {
      failures.push(`${file}: ${String(error)}`)
    }
  }
  if (failures.length > 0) {
    ctx.logger?.warn?.('[dsh-auto-reviewer] permission icon patch skipped: %s', failures.join(' | '))
  }
}

export function apply(ctx: Context, config: Config): void {
  applyPermissionIconPatch(ctx)
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:34-47](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/cordis.patch.yml#L34-L47)

自动放行和LLM默认配置影响持续负担。

<details>
<summary>查看原文（14行）</summary>

```text
    - id: dsh-auto-reviewer
      name: '@dsh-external/dsh-auto-reviewer'
      config:
        presetName: auto-review
        autoApproveWorkspaceWrite: true
        autoApproveDangerFullAccess: true
        autoApproveUserConfirmed: true
        askOnAmbiguous: true
        rejectCritical: true
        useLlm: true
        timeoutMs: 10000
        blocklist: []
        blocklistMode: reject
        extraInstructions: ''
```

</details>

#### 缺口

- 没有真实审批数据集、LLM费用或图标补丁恢复验证。
  **影响**：不能确认授权准确性和总维护代价。
  **进一步探讨**：用脱敏审批样本比较人工与插件决策，并在可恢复宿主副本验证安装停用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否用操作绑定授权代替关键词？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的操作授权凭据，把用户确认绑定到工具类型、规范化参数摘要、工作区和有效期；参数不可取得、语义不明或目标变更一律转人工。低风险快路径也先要求完整操作结构和范围证明，规则或LLM只提供风险意见。推导来自Q03的对象失配，新增成本是参数规范化、复合命令分析、凭据存储及失效解释。最小验证只使用无副作用桩操作，覆盖旧yes、新目标、否定确认、参数缺失和合法重复，要求未授权不放行且合法授权不会被广泛阻塞。若规范化碰撞或人工回退过多，方案不能证明改善。当前插件没有这种契约，不能作为现有贡献计分。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:211-237](https://github.com/AntaresCorn/dsh-auto-reviewer/blob/4eff126d8687c7a5cdf9273f7d9ca1b5e6b9a14e/src/index.ts#L211-L237)

文本确认未绑定参数，为授权凭据提供推导依据。

<details>
<summary>查看原文（27行）</summary>

```text
function buildReviewInput(req: ApprovalRequest, config: Config): ReviewInput {
  const session = req.agent.session
  const args = findToolCallArguments(session, req.callId, req.toolName)
  const commandText = [
    args ? JSON.stringify(args) : '',
    req.reason ?? '',
  ].filter(Boolean).join('\n')
  const commandSummary = summarizeToolArguments(req.toolName, args)

  const reason = req.reason ?? ''
  const requestedMode = /escalate sandbox to (workspace-write|danger-full-access)/.exec(reason)?.[1]
  const justification = reason.replace(/^escalate sandbox to (workspace-write|danger-full-access):\s*/i, '')

  const recentUserText = collectRecentUserText(session, config.maxContextMessages)
  const hasExplicitUserConfirmation = recentUserText.length > 0 && matchesAny(recentUserText, CONFIRM_PATTERNS)

  return {
    toolName: req.toolName,
    callId: req.callId,
    reason: req.reason,
    requestedMode,
    justification,
    commandText,
    commandSummary,
    recentUserText,
    hasExplicitUserConfirmation,
  }
```

</details>

#### 缺口

- 操作规范化和凭据机制未实现。
  **影响**：误放行与额外阻塞之间的取舍未知。
  **进一步探讨**：先在无副作用决策数据集验证精确绑定和失效规则。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
