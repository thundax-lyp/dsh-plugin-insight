# dsh-approval-gate

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[8419bc3](https://github.com/moon09300731/dsh-approval-gate/tree/8419bc3722a237a85c033565be6ac06074f05d92)

<!-- BEGIN META -->
[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/moon09300731/dsh-approval-gate) [![npm 30d 3,936](https://img.shields.io/static/v1?label=npm+30d&message=3%2C936&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-approval-gate) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-approval-gate)
<!-- END META -->

> **功能**：按会话预设、规则和 Flash 判断处理 DSH 审批，附审查和快照界面。

> **亮点**：[Q01](#research-q01) 对专用预设加入规则和模型分流。

> **主要限制**：[Q02](#research-q02) SAFE 子串可放行 UNSAFE，且撤销仅投递指令。

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
  - [Q01 · 哪种会话会被自动审批，判断顺序是什么？](#detail-section-11)
  - [Q02 · 分类器失败、非协议输出和撤销各有什么边界？](#detail-section-12)
  - [Q03 · 怎样决定是否值得接入？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常处理沙箱越界审批的用户希望减少重复确认。

由宿主人工审批全部越界请求。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 自动审批 | 减少常规确认 | 专用预设与模型能力 |
| 审查 | 查看快照及差异 | 撤销仍由 Agent 处理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 权限和审批服务 | 必需 | 选择预设并处理请求 | 不匹配则交下游 |
| Flash 模型路由 | 模型分流依赖 | 判风险和同类 | 失败转人工 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 隔离 | 配置测试预设与最小权限 | 用合成数据 |
| 演练 | 注入越界理由与模型输出 | 观察结果 |
| 回退 | 关闭自动预设并保留人工 | 另核对文件快照 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型资源未知 | 配置预设与测试用例 | 审阅规则先后 |
| 持续 | 调用成本未知 | 核对学习结果和误放行 | 模型表现随输入变 |
| 失败 | 恢复成本未知 | 核对人工状态和真实文件 | 撤销只投递指令 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 重复审批 | 规则和模型分流 | 净节时和危险误放行 |

> **思考**：[Q02](#research-q02) SAFE 子串可放行 UNSAFE，且撤销仅投递指令。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 对专用预设加入规则和模型分流。

[Q02](#research-q02) 实际解析用 SAFE 子串，失败退路和撤销与执行分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) SAFE 子串可放行 UNSAFE，且撤销仅投递指令。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只做隔离对照，确认严格解析前维持人工。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核对接线、顺序与解析缺陷；无实际运行证据。

- 已检查：作者 README、包清单、源码路径 src/index.mjs、README.md、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定审批钩子、解析及客户端代码，未运行模型或宿主。
- 下一步：模拟非协议输出、规则冲突和快照后文件恢复。

**分析版本**

- **仓库**：[moon09300731/dsh-approval-gate](https://github.com/moon09300731/dsh-approval-gate)
- **版本号**：0.5.2（[固定提交 8419bc3](https://github.com/moon09300731/dsh-approval-gate/tree/8419bc3722a237a85c033565be6ac06074f05d92)）
- **版本日期**：2026-08-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 比较严格协议和当前解析的误放行与等待。

模拟非协议输出、规则冲突和快照后文件恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1002 | 911 | 50 | — |
| .md | source | 5 | 478 | — | — | 6275 |
| .mjs | source | 1 | 1508 | 1240 | 198 | — |

</details>

**活跃度**

[![Issue 未关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/moon09300731/dsh-approval-gate/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/moon09300731/dsh-approval-gate/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/moon09300731/dsh-approval-gate/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自动审批能否在减少打断时保留危险操作的人工判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪种会话会被自动审批，判断顺序是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

只有权限预设命中 auto-approve 才进入插件。源码先用危险词转人工，再匹配无类别白名单，之后调用 Flash。SAFE 直接放行，失败、硬风险类别或未知类别转下游。历史拒绝规则位于中立分支，不能拦住先前的 SAFE 或白名单。相对手工审批，该插件能减少打断，但效果取决于规则和模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.mjs:1283-1307](https://github.com/moon09300731/dsh-approval-gate/blob/8419bc3722a237a85c033565be6ac06074f05d92/src/index.mjs#L1283-L1307)

预设匹配与审批理由、路径的来源。

<details>
<summary>查看原文（25行）</summary>

```text
    ctx.on('approval/request', async (req, next) => {
      try {
        reloadConfig()
        const session = req.agent && req.agent.session
        if (!session) return next()
        let preset
        try {
          preset = permissionPresets.current(session.events)
        } catch (error) {
          console.error(`[${NAME}] permissionPresets.current failed`, error)
          return next()
        }
        if (preset !== PRESET_NAME) return next()
        if (req.signal && req.signal.aborted) return next()

        const toolName = String(req.toolName || 'unknown')
        const reason = String(req.reason || '')
        const { mode, justification } = parseReason(reason)
        const sessionId = typeof session.id === 'string' ? session.id : ''
        // 会话工作目录：相对路径快照解析的基准（DSH SessionHeader.cwd）
        const sessionCwd = (typeof session.cwd === 'string' && session.cwd) ? session.cwd : ''
        // B 层：callId 回溯 tool/call 事件取结构化真实路径（edit/write 的 file_path / bash 的 command）
        // C 层兜底：未命中时 recordApprovalEvent 内部回退 extractFiles(justification)
        const toolFiles = resolveToolCallFiles(req.callId, session.events)
        const filesOpt = toolFiles ? { files: toolFiles, baseDir: sessionCwd } : { baseDir: sessionCwd }
```

</details>

**依据 2 · 源码核查**：[src/index.mjs:1321-1369](https://github.com/moon09300731/dsh-approval-gate/blob/8419bc3722a237a85c033565be6ac06074f05d92/src/index.mjs#L1321-L1369)

真正的分支次序。

<details>
<summary>查看原文（49行）</summary>

```text
        // 1. DENY 层：不可逆危险词 → 转人工（fail-safe，最高优先）
        if (looksDeny(toolName + ' ' + reason)) {
          audit(`DENY    ${toolName} mode=${mode || 'none'} | ${reason.slice(0, 160)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, '', 'deny')
        }

        // 2. 白名单层：命中规则 → 直接放行（确定性，不过 flash）
        const matchedRule = matchRule(config.allowRules, toolName, mode, null, justification)
        if (matchedRule) {
          audit(`ALLOW   ${toolName} mode=${mode || 'none'} (rule: ${matchedRule.description || 'matched'})`)
          recordAutoAllow(sessionId, toolName, mode, reason, justification, 'rule', filesOpt)
          return 'allowed-once'
        }

        // 3. flash 判定
        const { verdict, category, timedOut, failed } = await judgeWithFlash(toolName, mode, justification)

        if (verdict === 'safe') {
          audit(`ALLOW   ${toolName} mode=${mode || 'none'} (flash-safe${timedOut ? '，重试后' : ''})`)
          recordAutoAllow(sessionId, toolName, mode, reason, justification, 'flash-safe', filesOpt)
          return 'allowed-once'
        }

        const cat = category || 'neutral'

        // 4a. flash 完全失败（超时×2/异常×2）→ 转人工（fail-safe：无法判断绝不自动放行）
        if (failed) {
          audit(`FAILED  ${toolName} mode=${mode || 'none'} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'flash-failed')
        }

        // 4b. 硬风险类别（deletion/credential/remote/system/bulk）→ 直接转人工（必须人工确认，不计数不学习）
        const hard = config.hardCategories || DEFAULT_HARD_CATEGORIES
        if (hard.includes(cat)) {
          audit(`HARD    ${toolName} mode=${mode || 'none'} category=${cat} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'hard-category')
        }

        // 4c. 协议外类别（模型输出未知类别）→ 判定不可靠，fail-safe 转人工
        if (cat !== 'neutral') {
          audit(`UNKNOWN ${toolName} mode=${mode || 'none'} category=${cat} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'unknown-category')
        }

        // 4d. denyRules 命中（此前用户裁决拒绝过的 key）→ 直接转人工（拒绝优先于沉淀）
        if (matchRule(config.denyRules, toolName, mode, cat, justification)) {
          audit(`DENYRULE ${toolName} mode=${mode || 'none'} category=${cat} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'deny-rule')
        }
```

</details>

**依据 3 · 作者声明**：[README.md:40-48](https://github.com/moon09300731/dsh-approval-gate/blob/8419bc3722a237a85c033565be6ac06074f05d92/README.md#L40-L48)

安装、预设与会话入口。

````text
## 🚀 快速开始

```sh
dsh plugin --profile web add dsh-approval-gate
```

1. **配置权限预设**：在 `~/.dsh/profiles/web/cordis.patch.yml` 添加 `auto-approve` 预设（[详见指南](docs/GUIDE.md#%E5%AE%89%E8%A3%85%E5%90%8E%E5%BF%85%E9%A1%BB%E6%89%8B%E5%8A%A8%E9%85%8D%E7%BD%AE%E6%9D%83%E9%99%90%E9%A2%84%E8%AE%BE%E5%85%B3%E9%94%AE%E6%AD%A5%E9%AA%A4)）
2. **重启** `dsh web`
3. **选择预设**：会话权限下拉选中「自动审批（Flash）」
````

#### 缺口

- 没有真实操作分布
  **影响**：无法判断减少多少打断或漏拦截
  **进一步探讨**：用有冲突白名单及相同工具不同风险的请求对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 分类器失败、非协议输出和撤销各有什么边界？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Flash 收到工具名、目标模式和操作理由，解析接受包含 SAFE 的任意文本。若模型仅输出 UNSAFE，且无先命中的 RISKY，则按当前解析进入 safe；这由字符串判断推导，未运行验证。正常超时或未知类别有下游人工退路。客户端撤销只发送一条指令，实际复原仍由 Agent 执行和确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.mjs:1145-1167](https://github.com/moon09300731/dsh-approval-gate/blob/8419bc3722a237a85c033565be6ac06074f05d92/src/index.mjs#L1145-L1167)

Flash 输入和宽松协议解析。

<details>
<summary>查看原文（23行）</summary>

```text
    const judgeOnce = async (toolName, mode, justification, signal) => {
      const user = [
        `工具: ${toolName}`,
        `目标沙箱模式: ${mode || '(非越界审批)'}`,
        `操作理由: ${justification || '(无说明)'}`,
        '',
        '请判断：执行该操作是否会造成无法回补的后果或触碰敏感资源？输出 SAFE 或 RISKY:<类别>。'
      ].join('\n')
      const text = await callFlash(user, SYSTEM_PROMPT, signal)
      const trimmed = text.trim().toUpperCase()
      const riskyMatch = trimmed.match(/RISKY\s*[:：]\s*([A-Z_]+)/)
      if (riskyMatch) {
        const category = riskyMatch[1].toLowerCase()
        return { verdict: 'risky', category }
      }
      // 裸 RISKY（无类别，旧协议残留）→ 按中立处理（有计数/裁决兜底）
      if (trimmed.includes('RISKY')) return { verdict: 'risky', category: 'neutral' }
      if (trimmed.includes('SAFE')) return { verdict: 'safe' }
      // 模型表达不确定/无法判断（而非复述 prompt）→ 按中立处理（走确认制，fail-safe）
      if (/无法判断|无法确定|不确定|不能确定|无法评估|UNCERTAIN|CANNOT (JUDGE|DETERMINE|ASSESS)/i.test(text)) {
        return { verdict: 'risky', category: 'neutral' }
      }
      throw new Error('flash 输出无法解析: ' + JSON.stringify(text.slice(0, 120)))
```

</details>

**依据 2 · 源码核查**：[src/index.mjs:1335-1363](https://github.com/moon09300731/dsh-approval-gate/blob/8419bc3722a237a85c033565be6ac06074f05d92/src/index.mjs#L1335-L1363)

safe 返回与异常类别。

<details>
<summary>查看原文（29行）</summary>

```text
        // 3. flash 判定
        const { verdict, category, timedOut, failed } = await judgeWithFlash(toolName, mode, justification)

        if (verdict === 'safe') {
          audit(`ALLOW   ${toolName} mode=${mode || 'none'} (flash-safe${timedOut ? '，重试后' : ''})`)
          recordAutoAllow(sessionId, toolName, mode, reason, justification, 'flash-safe', filesOpt)
          return 'allowed-once'
        }

        const cat = category || 'neutral'

        // 4a. flash 完全失败（超时×2/异常×2）→ 转人工（fail-safe：无法判断绝不自动放行）
        if (failed) {
          audit(`FAILED  ${toolName} mode=${mode || 'none'} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'flash-failed')
        }

        // 4b. 硬风险类别（deletion/credential/remote/system/bulk）→ 直接转人工（必须人工确认，不计数不学习）
        const hard = config.hardCategories || DEFAULT_HARD_CATEGORIES
        if (hard.includes(cat)) {
          audit(`HARD    ${toolName} mode=${mode || 'none'} category=${cat} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'hard-category')
        }

        // 4c. 协议外类别（模型输出未知类别）→ 判定不可靠，fail-safe 转人工
        if (cat !== 'neutral') {
          audit(`UNKNOWN ${toolName} mode=${mode || 'none'} category=${cat} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'unknown-category')
        }
```

</details>

**依据 3 · 源码核查**：[client.js:337-355](https://github.com/moon09300731/dsh-approval-gate/blob/8419bc3722a237a85c033565be6ac06074f05d92/client.js#L337-L355)

客户端只记录已发送撤销指令。

<details>
<summary>查看原文（19行）</summary>

```text
      }, [eventId, path])

      const doRevert = function () {
        // 防重复：同一事件只允许投递一次撤销指令（v0.5.0 事故中同一 event 被重复撤销 4 次）
        if (reverting || revertDone) return
        setReverting(true)
        setRevertMsg(null)
        fetch('/api/auto-approve/revert', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionId, eventId: eventId }),
        }).then(function (r) { return r.json() }).then(function (res) {
          if (res && res.ok) {
            setRevertMsg('撤销指令已发送到对话框，AI 将按指令恢复文件')
            setRevertDone(true)
          } else {
            setRevertMsg((res && res.error) || '发送失败')
          }
        }).catch(function (e) {
```

</details>

#### 缺口

- 未运行模型输出与真实文件恢复
  **影响**：不能确定误放行频率和恢复成功率
  **进一步探讨**：构造 UNSAFE、NOT SAFE、超时及实际命令与理由不符，另比对文件哈希

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样决定是否值得接入？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

目前应观察，在专用测试 profile 把 Flash 输出和实际命令并排记录，禁止接触真实高权限资源。对照手工审批，量化确认次数、等待和危险样本误放行。先验证严格输出协议和已拒规则在冲突时的优先级；任一危险样本误放行就保持手工审批。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.mjs:1145-1167](https://github.com/moon09300731/dsh-approval-gate/blob/8419bc3722a237a85c033565be6ac06074f05d92/src/index.mjs#L1145-L1167)

理由及协议解析会决定误判。

<details>
<summary>查看原文（23行）</summary>

```text
    const judgeOnce = async (toolName, mode, justification, signal) => {
      const user = [
        `工具: ${toolName}`,
        `目标沙箱模式: ${mode || '(非越界审批)'}`,
        `操作理由: ${justification || '(无说明)'}`,
        '',
        '请判断：执行该操作是否会造成无法回补的后果或触碰敏感资源？输出 SAFE 或 RISKY:<类别>。'
      ].join('\n')
      const text = await callFlash(user, SYSTEM_PROMPT, signal)
      const trimmed = text.trim().toUpperCase()
      const riskyMatch = trimmed.match(/RISKY\s*[:：]\s*([A-Z_]+)/)
      if (riskyMatch) {
        const category = riskyMatch[1].toLowerCase()
        return { verdict: 'risky', category }
      }
      // 裸 RISKY（无类别，旧协议残留）→ 按中立处理（有计数/裁决兜底）
      if (trimmed.includes('RISKY')) return { verdict: 'risky', category: 'neutral' }
      if (trimmed.includes('SAFE')) return { verdict: 'safe' }
      // 模型表达不确定/无法判断（而非复述 prompt）→ 按中立处理（走确认制，fail-safe）
      if (/无法判断|无法确定|不确定|不能确定|无法评估|UNCERTAIN|CANNOT (JUDGE|DETERMINE|ASSESS)/i.test(text)) {
        return { verdict: 'risky', category: 'neutral' }
      }
      throw new Error('flash 输出无法解析: ' + JSON.stringify(text.slice(0, 120)))
```

</details>

**依据 2 · 源码核查**：[src/index.mjs:1321-1369](https://github.com/moon09300731/dsh-approval-gate/blob/8419bc3722a237a85c033565be6ac06074f05d92/src/index.mjs#L1321-L1369)

先匹配与后续人工路径。

<details>
<summary>查看原文（49行）</summary>

```text
        // 1. DENY 层：不可逆危险词 → 转人工（fail-safe，最高优先）
        if (looksDeny(toolName + ' ' + reason)) {
          audit(`DENY    ${toolName} mode=${mode || 'none'} | ${reason.slice(0, 160)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, '', 'deny')
        }

        // 2. 白名单层：命中规则 → 直接放行（确定性，不过 flash）
        const matchedRule = matchRule(config.allowRules, toolName, mode, null, justification)
        if (matchedRule) {
          audit(`ALLOW   ${toolName} mode=${mode || 'none'} (rule: ${matchedRule.description || 'matched'})`)
          recordAutoAllow(sessionId, toolName, mode, reason, justification, 'rule', filesOpt)
          return 'allowed-once'
        }

        // 3. flash 判定
        const { verdict, category, timedOut, failed } = await judgeWithFlash(toolName, mode, justification)

        if (verdict === 'safe') {
          audit(`ALLOW   ${toolName} mode=${mode || 'none'} (flash-safe${timedOut ? '，重试后' : ''})`)
          recordAutoAllow(sessionId, toolName, mode, reason, justification, 'flash-safe', filesOpt)
          return 'allowed-once'
        }

        const cat = category || 'neutral'

        // 4a. flash 完全失败（超时×2/异常×2）→ 转人工（fail-safe：无法判断绝不自动放行）
        if (failed) {
          audit(`FAILED  ${toolName} mode=${mode || 'none'} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'flash-failed')
        }

        // 4b. 硬风险类别（deletion/credential/remote/system/bulk）→ 直接转人工（必须人工确认，不计数不学习）
        const hard = config.hardCategories || DEFAULT_HARD_CATEGORIES
        if (hard.includes(cat)) {
          audit(`HARD    ${toolName} mode=${mode || 'none'} category=${cat} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'hard-category')
        }

        // 4c. 协议外类别（模型输出未知类别）→ 判定不可靠，fail-safe 转人工
        if (cat !== 'neutral') {
          audit(`UNKNOWN ${toolName} mode=${mode || 'none'} category=${cat} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'unknown-category')
        }

        // 4d. denyRules 命中（此前用户裁决拒绝过的 key）→ 直接转人工（拒绝优先于沉淀）
        if (matchRule(config.denyRules, toolName, mode, cat, justification)) {
          audit(`DENYRULE ${toolName} mode=${mode || 'none'} category=${cat} → 人工 | ${reason.slice(0, 120)}`)
          return forwardToHuman(sessionId, toolName, mode, reason, justification, cat, 'deny-rule')
        }
```

</details>

**依据 3 · 源码核查**：[src/index.mjs:1412-1438](https://github.com/moon09300731/dsh-approval-gate/blob/8419bc3722a237a85c033565be6ac06074f05d92/src/index.mjs#L1412-L1438)

语义相似判断也能产生自动放行。

<details>
<summary>查看原文（27行）</summary>

```text
          if (samples.length > 0) {
            // 指纹未命中 → flash 第三方同类验证：把本次操作背景 + 用户确认样本给 flash，
            // 语义判断是否属于已确认的同类操作（不依赖关键词）
            const sim = await verifySimilarityWithRetry(toolName, mode, justification, samples)
            if (sim.verdict === 'same') {
              // 判同类 → 自动放行；有指纹则沉淀规则（无指纹不沉淀，保留样本供后续验证）
              if (learning.enabled && fingerprint) {
                const rule = { tool: toolName, category: cat, contains: fingerprint }
                if (mode) rule.mode = mode
                if (!config.allowRules.some((r) => r.tool === rule.tool && r.mode === rule.mode && r.category === rule.category && r.contains === rule.contains)) {
                  rule.description = `自动沉淀：${cat === 'neutral' ? '中立' : CATEGORY_LABELS[cat] || cat} flash 同类验证`
                  config.allowRules.push(rule)
                  saveJson(ALLOWLIST_PATH, config)
                  audit(`LEARN   ${key} flash 判同类，已沉淀白名单 ${JSON.stringify(rule)}`)
                }
                delete learning.stats[key]
                delete learning.history[key]
                saveJson(LEARNING_PATH, learning)
              } else {
                // 无指纹：不沉淀，保留样本与阈值位（下次同操作仍靠 flash 验证放行）
                audit(`SAME    ${toolName} mode=${mode || 'none'} category=${cat} flash 判同类（无指纹，未沉淀）| ${reason.slice(0, 100)}`)
              }
              audit(`ALLOW   ${toolName} mode=${mode || 'none'} (flash-same) | ${reason.slice(0, 100)}`)
              recordAutoAllow(sessionId, toolName, mode, reason, justification, 'flash-same', filesOpt)
              return 'allowed-once'
            }
            // 判 DIFFERENT / 验证失败 → 落人工确认
```

</details>

#### 缺口

- 未评估模型成本和人类确认耗时
  **影响**：净节时未知
  **进一步探讨**：在隔离配置比较两组且分开测模型异常输出

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
