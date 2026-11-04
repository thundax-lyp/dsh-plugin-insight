# DSH Memory Tiers Core

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[897c3df](https://github.com/1129742588/dsh-memory-tiers/tree/897c3dfda219a7fa61bb45c15df98a3afce74c32/core)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1129742588/dsh-memory-tiers) [![npm 30d 1,099](https://img.shields.io/static/v1?label=npm+30d&message=1%2C099&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-memory-tiers) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-memory-tiers)
<!-- END META -->

> **功能**：为 DSH 提供本地分层记忆、检索、上下文注入和历史替代。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示插件将捕获、检索和注入接入宿主；并不保证所有细节都可回读或节省费用。

> **主要限制**：[Q02](#research-q02) 默认捕获有截断且历史替代可全替，非空块不证明逐段覆盖；[Q03](#research-q03) 的模型配置可能将内容发送到远端。

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
  - [Q01 · 谁使用这个插件，它相比保留普通会话历史改变了什么？](#detail-section-11)
  - [Q02 · 会话如何捕获并形成注入，历史何时被替换？](#detail-section-12)
  - [Q03 · 整理、遗忘和模型调用有哪些保护及限制？](#detail-section-13)
  - [Q04 · 依赖、成本和试用退出条件是什么？](#detail-section-14)
  - [Q05 · 什么改进方向可通过对照否定？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望保留跨轮事实并调整上下文的 DSH 用户可以评估本地记忆和检索。

宿主原有历史与手工记录也能保留信息；本组件增加自动分层、检索及历史替代。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 对话捕获 | 保存用户、助手及工具记录 | 按配置截断，写入成功后才触发本轮替代 |
| 检索与关注 | 查找记忆并记录相关结果 | 召回与质量未实测 |
| 分层整理 | 协调迁移与遗忘 | 台账先行，容量限制仍可能删除原文 |
| 注入与历史替代 | 控制模型上下文 | 默认全替且非空检查不证明完整覆盖 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 会话、工具和提示接口 | 宿主集成需要 | 捕获、注入及历史替代 | 接口失败按启动步骤记录，实际兼容未知 |
| 可写本地存储 | 记录需要 | 保存分层数据和台账 | 写入失败时不应替代历史 |
| 配置的模型服务 | 摘要、融合或向量阶段需要 | 整理和检索 | 可能向远端发送内容，服务不可用时效果受限 |
| 可恢复原历史 | 试用历史替代需要 | 检查截断和恢复 | 缺备份时不宜依赖全替换 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份 profile 和数据并核模型目标 | 敏感内容或远端策略不明时停止 |
| 采集 | 在隔离会话关闭历史替代并写入样本 | 核对存储与截断 |
| 检索 | 用户查询已知事实 | 对照原文及缺失项 |
| 决定 | 用户核恢复和隐私后决定是否启用替代 | 找不到关键事实时保持原生历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地磁盘及模型服务费用未知 | 配置、备份、核端点 | 默认历史替代需核对 |
| 持续 | 摘要、向量与存储费用未知 | 审核记忆、遗漏和隐私 | 实际节省 token 未对照 |
| 失败恢复 | 备份和恢复资源未知 | 核层数据及原历史 | 不完整记录未必可重建 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 捕获与注入 | 会话事件和提示服务接线 | 实际召回与事实正确率 |
| 替代历史 | 写成功及非空块后替换 surface | 截断原文是否可恢复 |
| 遗忘保护 | 台账失败保留、锁身份检查 | 并发中断的真实可靠性 |

> **思考**：[Q02](#research-q02) 默认捕获有截断且历史替代可全替，非空块不证明逐段覆盖；[Q03](#research-q03) 的模型配置可能将内容发送到远端。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示插件将捕获、检索和注入接入宿主；并不保证所有细节都可回读或节省费用。

[Q03](#research-q03) 的锁身份及台账先行提供可检查保护；[Q02](#research-q02) 的写成功与非空块不能替代逐段覆盖验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 默认捕获有截断且历史替代可全替，非空块不证明逐段覆盖；[Q03](#research-q03) 的模型配置可能将内容发送到远端。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先在隔离 profile 关闭历史替代并验证非敏感样本；缺关键事实或不能恢复原历史时保持宿主历史。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已定向核查固定源码的记忆主链；宿主运行、召回、恢复和改进假设均未验证。

- 已检查：作者 README、包清单、源码路径 core/package.json、core/README.md、core/index.mjs、core/memory.mjs、core/settings.mjs、core/llm.mjs 及固定范围 inventory；组件：core。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 core 子包的捕获、系统提示注入、surface 替换、整理锁、遗忘台账、配置及模型调用；未运行宿主、模型、测试或断电并发场景，未全审其他层算法及仓库组件。
- 下一步：固定宿主与模型，在隔离 profile 注入超长文本、写失败、锁接管及历史替代，再回读记忆与原始会话。

**分析版本**

- **仓库**：[1129742588/dsh-memory-tiers](https://github.com/1129742588/dsh-memory-tiers)
- **版本号**：1.2.2（[固定提交 897c3df](https://github.com/1129742588/dsh-memory-tiers/tree/897c3dfda219a7fa61bb45c15df98a3afce74c32)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出替代前逐段覆盖清单和保留策略；如覆盖不可验证或成本过高则否定。

固定宿主与模型，在隔离 profile 注入超长文本、写失败、锁接管及历史替代，再回读记忆与原始会话。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 5 | 5680 | 4274 | 1116 | — |
| .md | source | 1 | 190 | — | — | 2388 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/1129742588/dsh-memory-tiers/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查分层记忆从捕获、整理到注入及历史替代的源码边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用这个插件，它相比保留普通会话历史改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望跨对话保留部分事实并控制上下文的 DSH 用户，可以配置本地分层记忆、检索、注入和历史替代。宿主原有对话历史和手工记录也能保留事实；本组件的增量是将捕获、分层、检索和可选历史替代接入宿主，而不是证明模型总能找到原话或减少费用。它是带 Host 和 Web 配置面的 DSH 插件，数据层本地存储不代表配置的模型调用一定在本机。

#### 证据与依据

**依据 1 · 源码核查**：[core/package.json:1-8](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/package.json#L1-L8)

子包身份与描述。

```text
{
  "name": "dsh-memory-tiers",
  "version": "1.2.2",
  "description": "dsh 的六层本地记忆：每轮收进 L1，安静后分流成摘要与原文档，长期层注入上下文，并用记忆替代对话历史。",
  "type": "module",
  "main": "index.mjs",
  "license": "MIT",
  "keywords": [
```

**依据 2 · 作者声明**：[core/README.md:3-16](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/README.md#L3-L16)

作者描述六层、注入与模型用途。

<details>
<summary>查看原文（14行）</summary>

```text
给 [DeepSeek Harness](https://github.com/deepseek-ai) 用的**六层本地记忆**插件：

- 每轮对话结束后，把「你问的 / 模型答的 / 工具做的」写进 **L1 即时层**；
- L1 字数超过上限，**下一轮整理就分流**成摘要与原文：被摘要引用的原文进 **DL2 原文库**，没被引用的进 **DL1 遗忘中**，少量留在 **L2 巩固层**；
- 摘要进 **DL3 摘要库**，按热度截出一份 **L3 长期视图**；
- 每轮把 `L3 + L2 + L1` 拼成一块注入上下文；
- 可选地把 dsh 自己的对话历史替换成一条占位——**用记忆替代历史**，聊再久上下文也不涨。

全部数据在本地，不依赖任何云端存储；模型只用来做分流（摘要）、融合（判关系）、算向量。

---

## 文件

```

</details>

**依据 3 · 源码核查**：[core/index.mjs:812-850](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L812-L850)

将记忆块注册到系统提示上下文。

<details>
<summary>查看原文（39行）</summary>

```text
  const buildInjectedBlock = () => {
    if (workMode) return ''
    if (cfg.inject.enabled === false) return ''
    try {
      return mem.buildBlock(Number(cfg.inject.maxChars) || 0, {
        notice: Number(cfg.compaction.keepTurns) === 0 && cfg.compaction.enabled !== false
          ? '（当前会话的对话历史已由记忆替代；需要原话细节请调用 memory_search）'
          : '',
        extra: semanticExtra(),
      })
    } catch (e) {
      audit('INJECT_FAIL', String(e?.message ?? e))
      return ''
    }
  }

  const injectBlock = (c, svcArg) => {
    const svc = svcArg || c?.systemPrompt || ctx.systemPrompt
    if (!svc) throw new Error('没有 systemPrompt 服务')
    if (workMode) {
      injection.mode = 'off'
      injection.ok = true
      injection.reason = 'work-mode'
      audit('INJECT_OFF', 'reason=work-mode')
      writeStatus(env, { inject: { enabled: false, mode: 'off', ok: true, reason: 'work-mode' } })
      return
    }
    if (cfg.inject.enabled === false) {
      injection.mode = 'off'
      injection.ok = true
      injection.reason = 'inject-disabled'
      audit('INJECT_OFF', 'reason=inject-disabled')
      writeStatus(env, { inject: { enabled: false, mode: 'off', ok: true, reason: 'inject-disabled' } })
      return
    }
    if (typeof svc.context === 'function') {
      svc.context({ name: 'memory-tiers', order: 250, text: buildInjectedBlock, interpolate: false })
      injection.mode = 'context'
    } else if (typeof svc.section === 'function') {
```

</details>

#### 缺口

- 没有相同长对话任务对照
  **影响**：不能量化召回、错误率或节省 token 与费用
  **进一步探讨**：以已知关键事实对照原生历史和记忆方案，核对遗漏与成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话如何捕获并形成注入，历史何时被替换？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件监听 session/event，按来源筛选用户消息并缓冲助手消息和工具结果，在 turn/end 写入记忆；写入不成功时不执行本次压缩。系统提示服务在构建时调用 buildBlock，聚合长期、近期与 L1 视图，并按预算截断。默认捕获每条用户消息最多 2000 字、一轮助手正文 400 字和单个工具输出 500 字；历史替代默认启用且保留轮数为零。全替换前检查记忆块非空，随后将 surface 中的旧节点替成占位；这一检查不证明被截断内容全部可找回。服务接线、事件顺序及历史恢复尚未在宿主运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[core/settings.mjs:87-104](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/settings.mjs#L87-L104)

默认捕获开关和截取上限。

<details>
<summary>查看原文（18行）</summary>

```text
    group: '抓取', path: 'capture.enabled', type: 'boolean', default: true,
    label: '自动记录对话',
    hint: '每轮结束把「你问的、模型答的、工具做的」写进 L1（即时层）。关掉就只读不写。',
  },
  {
    group: '抓取', path: 'capture.userChars', type: 'number', default: 2000, min: 100, max: 20000, step: 100,
    label: '单条用户消息上限（字）',
    hint: '一条消息太长时截断后再进 L1。',
  },
  {
    group: '抓取', path: 'capture.botChars', type: 'number', default: 400, min: 100, max: 5000, step: 50,
    label: '一轮回复上限（字）',
    hint: '一轮里模型的正文拼起来再截断（不是每条消息各截一次）。',
  },
  {
    group: '抓取', path: 'capture.toolChars', type: 'number', default: 500, min: 0, max: 5000, step: 50,
    label: '单条工具输出上限（字）',
    hint: '一次命令能吐几万字，进 L1 前先截断。',
```

</details>

**依据 2 · 源码核查**：[core/settings.mjs:289-303](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/settings.mjs#L289-L303)

默认历史替代和保留轮数。

<details>
<summary>查看原文（15行）</summary>

```text
  // —— 历史替代（第 7 步）——
  {
    group: '历史替代', path: 'compaction.enabled', type: 'boolean', default: true,
    label: '用记忆替代对话历史',
    hint: '每轮结束后把 dsh 自己的历史换成一条占位，模型只靠注入的记忆说话。',
  },
  {
    group: '历史替代', path: 'compaction.keepTurns', type: 'number', default: 0, min: 0, max: 50, step: 1,
    label: '保留最近几轮原文',
    hint: '0 = 全部替换（完全靠记忆）；1 = 留最近一轮，其余归档。',
  },
  {
    group: '历史替代', path: 'compaction.archiveChars', type: 'number', default: 1200, min: 100, max: 20000, step: 100,
    label: '每轮归档字数上限',
    hint: '替换前先把要丢的内容写进 L1，写成功才敢丢。',
```

</details>

**依据 3 · 源码核查**：[core/index.mjs:651-679](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L651-L679)

写入成功判断与本轮摘要行构造。

<details>
<summary>查看原文（29行）</summary>

```text
  const writeRows = async (rows, stat) => {
    if (!rows.length) { audit('WRITE_TURN_SKIP', `user=${stat.user} bot=${stat.bot} tool=${stat.tool}`); return false }
    const res = await mem.writeTurn(rows)
    const l1 = stats()?.count?.L1 ?? '?'
    if (res?.ok) {
      audit('WRITE_TURN', `user=${stat.user} bot=${stat.bot} tool=${stat.tool} rows=${rows.length} L1=${l1}`)
      return true
    }
    audit('WRITE_TURN_FAIL', `${res?.error || 'unknown'} rows=${rows.length}`)
    return false
  }

  const makeRows = (buf) => {
    const turnId = `${writer}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    const rows = []
    for (const t of buf.user) rows.push({ text: t, speaker: 'user', channel: 'dialog', scene: 'dsh', turnId })
    if (buf.bot.length) {
      const botText = buf.bot.join('\n').trim()
      if (botText) rows.push({ text: botText.slice(0, cap.bot), speaker: 'bot', channel: 'dialog', scene: 'dsh', turnId })
    }
    for (const c of buf.tools.values()) {
      const out = c.done ? (c.out || '（无输出）') : '（被中断，无结果）'
      const head = c.err ? '失败' : (c.done ? '完成' : '未完成')
      rows.push({
        text: `运行 ${c.name}「${String(c.args || '').slice(0, 120)}」→ ${head}：${out}`,
        speaker: 'bot', channel: 'action', scene: 'dsh', turnId,
      })
    }
    return rows
```

</details>

**依据 4 · 源码核查**：[core/index.mjs:726-795](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L726-L795)

会话事件捕获、写入及随后压缩。

<details>
<summary>查看原文（70行）</summary>

```text
  const captureOff = step('capture', () => {
    if (!captureOn) { audit('CAPTURE_OFF'); return }
    if (typeof ctx.on !== 'function') throw new Error('ctx.on 不可用')

    const handler = (sessionObj, event) => {
      const d = event?.data || {}
      const sid = sessionObj?.id || 'default'
      const buf = bufOf(sid)

      if (event.type === 'user/message') {
        // 只记真人输入：agent.inject / skill / cron 也走这个事件，但它们 source.kind 不是 'user'
        if (d.source?.kind !== 'user') return
        const t = takeText(d.content)
        if (!t) return
        buf.user.push(t.slice(0, cap.user))
        buf.chars += t.length
        prefetchSemantic(t.slice(0, 200))
        return
      }

      if (event.type === 'assistant/message') {
        // 一轮里可能有多条（工具循环），先全收，turn/end 时拼起来再截断
        const t = takeText(d.content ?? d.message?.content)
        if (t) { buf.bot.push(t); buf.chars += t.length }
        return
      }

      if (event.type === 'tool/call') {
        const cid = d.callId ?? d.id ?? d.message?.toolCallId
        if (cid) buf.tools.set(cid, { name: String(d.name || 'tool'), args: String(d.arguments ?? '') })
        return
      }

      if (event.type === 'tool/result') {
        // callId / isError 在 message 里，不在 data 顶层（踩过：写成 d.callId 会让所有 action 静默消失）
        const cid = d.callId ?? d.message?.toolCallId ?? d.message?.source?.callId
        const c = cid ? buf.tools.get(cid) : undefined
        if (c) {
          c.out = takeText(d.message?.content).slice(0, cap.tool)
          c.err = !!(d.isError ?? d.message?.isError)
          c.done = true
        }
        return
      }

      if (event.type !== 'turn/end') return

      // 缓冲上限：被遗弃的会话不该无限涨
      if (buf.chars > MAX_BUFFER_CHARS || buf.user.length + buf.bot.length + buf.tools.size > MAX_BUFFER_ROWS) {
        audit('BUFFER_TRUNCATED', `session=${sid} chars=${buf.chars}`)
        buf.user.length = Math.min(buf.user.length, 50)
      }

      const rows = makeRows(buf)
      const stat = { user: buf.user.length, bot: buf.bot.length, tool: buf.tools.size }
      buffers.delete(sid)

      Promise.resolve()
        .then(async () => {
          const ok = await writeRows(rows, stat)
          // 写入没成功就不压缩：历史丢了、记忆里又没有 = 真失忆
          if (!ok) return
          await compactTurn(sessionObj, { alreadyArchived: true })
        })
        .catch((e) => audit('WRITE_TURN_FAIL', String(e?.message ?? e)))
        // 端结束顺手试一次整理（拿不到钥匙会自己跳过；没有变化不会重写文件）
        .then(() => { Promise.resolve().then(() => mem.organize()).catch(() => {}) })
    }

    const off = ctx.on('session/event', handler)
```

</details>

**依据 5 · 源码核查**：[core/index.mjs:683-710](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L683-L710)

全替换的非空块检查。

<details>
<summary>查看原文（28行）</summary>

```text
  let compacting = false
  const compactTurn = async (sessionObj, { alreadyArchived }) => {
    // 工作模式：会话表现保持正常 —— 历史一点都不动
    if (workMode) {
      audit('COMPACT_SKIP', 'reason=work-mode')
      return null
    }
    if (cfg.compaction.enabled === false) return null
    if (!sessionObj) return null
    if (cfg.inject.enabled === false && (Number(cfg.compaction.keepTurns) || 0) === 0) {
      // 历史全替 + 不注入 = 模型什么都看不到，宁可不替
      audit('COMPACT_SKIP', 'reason=inject-disabled')
      return null
    }
    // 兜底：全替之前确认「记忆块」真的不是空的（没模型、库是空的、全在 DL1 等模型时，
    // 替掉历史就等于让模型失忆）。
    if ((Number(cfg.compaction.keepTurns) || 0) === 0) {
      let block = ''
      try { block = mem.buildBlock(Number(cfg.inject.maxChars) || 0, {}) } catch { block = '' }
      if (!block) { audit('COMPACT_SKIP', 'reason=no-context'); return null }
    }
    if (compacting) return null
    compacting = true
    try {
      return await compactSurface(sessionObj, mem, {
        keepTurns: Number(cfg.compaction.keepTurns) || 0,
        archiveChars: Number(cfg.compaction.archiveChars) || 1200,
        alreadyArchived,
```

</details>

**依据 6 · 源码核查**：[core/index.mjs:176-223](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L176-L223)

归档与 surface 替换。

<details>
<summary>查看原文（48行）</summary>

```text
export async function compactSurface(session, mem, opts = {}) {
  const audit = typeof opts.audit === 'function' ? opts.audit : () => {}
  const keepTurns = opts.keepTurns ?? 0
  const archiveChars = Math.max(100, Number(opts.archiveChars) || 1200)
  const alreadyArchived = opts.alreadyArchived === true

  const nodes = session?.surface?.nodes
  const plan = planCompaction(nodes, (s) => session.eventAt(s), keepTurns)
  if (plan.reason) return { compacted: false, reason: plan.reason }

  let archived = 0
  if (!alreadyArchived) {
    const { lines, dropped } = archiveLines(session, plan.slice, archiveChars)
    if (!lines.length) {
      // 这一段没有任何可归档的内容：宁可留着历史，也不做「删了但没记」
      audit('COMPACT_SKIP', `reason=no-archivable rounds=${plan.rounds} dropped=${dropped}`)
      return { compacted: false, reason: 'no-archivable' }
    }
    if (dropped > 0) lines.push(`…（另有 ${dropped} 条系统注入或过长内容未收录）`)
    const res = await mem.writeTurn([{
      text: `[归档] 前 ${plan.rounds} 轮对话（已被压缩出上下文）：\n${lines.join('\n')}`,
      speaker: 'archive',
      channel: 'dialog',
    }])
    if (!res?.ok) {
      audit('COMPACT_SKIP', `reason=archive-failed rounds=${plan.rounds}`)
      return { compacted: false, reason: 'archive-failed' }
    }
    archived = res.ids?.length || 0
  }

  const placeholder = `（此前 ${plan.rounds} 轮对话已归档到长期记忆，需要细节时检索即可）`
  try {
    session.append('user/message', {
      role: 'user',
      id: randomUUID(),
      content: [{ type: 'text', text: placeholder }],
      source: { kind: 'compaction', compactionId: `mem-tiers-${Date.now()}` },
    }, {
      surfaceOp: { op: 'replace', startSeq: plan.startSeq, endSeq: plan.endSeq },
      sourceEventSeqs: plan.slice,
    })
  } catch (e) {
    audit('COMPACT_SKIP', `reason=replace-failed ${e?.message ?? e}`)
    return { compacted: false, reason: 'replace-failed', archived }
  }
  audit('COMPACT_OK', `removed=${plan.slice.length} rounds=${plan.rounds} archived=${archived}`)
  return { compacted: true, removed: plan.slice.length, rounds: plan.rounds, archived }
```

</details>

**依据 7 · 源码核查**：[core/memory.mjs:1977-1990](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/memory.mjs#L1977-L1990)

构建长期、近期与即时层视图。

<details>
<summary>查看原文（14行）</summary>

```text
  function buildBlock(budget = 0, opts = {}) {
    // ★ 不再"读快照 → 空就现算"，而是"版本对得上才用快照"：
    //   对方刚整理完（DL3 变了、快照还没轮到它写）时，这里会现算一份，
    //   保证「对方写的东西，我下一轮注入就能看见」，不用等 30 分钟的刷新周期。
    //   现算不写盘——写快照是拿钥匙那一方的职责，否则又变成两个写者。
    let l3 = readL3Snapshot()
    if (l3 === null) l3 = computeL3(null)
    l3 = l3.filter((it) => !it.supersededBy)
    // L2 只读一次：既用来拼"最近沉淀的"，顺手当"已下沉"的 id 集合给 L1 视图去重
    let l2raw = []
    try { l2raw = readLayerCached('L2') } catch { l2raw = [] }
    const l2 = sortedL2(l2raw)
    const l1r = readL1View({ placed: new Set(l2raw.map((it) => it.id)) })
    const l1 = l1r.items.filter((it) => !it.supersededBy)
```

</details>

**依据 8 · 源码核查**：[core/memory.mjs:2026-2034](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/memory.mjs#L2026-L2034)

注入总预算截断。

```text
    let out = parts.join('\n')
    // 总量上限按整行裁：切在半句上，模型会以为那句话本来就没说完。
    // 只有一行都放不下（预算比首行还短）时才退化成硬切。
    if (budget > 0 && out.length > budget) {
      const cut = out.slice(0, budget)
      const nl = cut.lastIndexOf('\n')
      out = nl > 0 ? cut.slice(0, nl) + '\n…（记忆块到上限，已截断）' : cut + '…'
    }
    return wrapBlock(out)
```

#### 缺口

- 未执行宿主事件、截断和历史替代
  **影响**：不能确认所有历史可检索或恢复
  **进一步探讨**：在隔离会话用超长消息及附件核对 L1、注入、surface 和恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 整理、遗忘和模型调用有哪些保护及限制？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

整理器通过排他锁和心跳进行单写者协调，写入前核对锁身份，先保存数据再记录已应用信号并删除认领文件。DL1 按保持率和容量清理，删除前写遗忘台账，台账失败则保留；容量策略仍可能在其他候选不足时删除等待摘要的原文。记忆文件本地存储，但摘要、融合等模型阶段可以跟随会话模型，也可 POST 到配置的兼容 HTTP 服务，相关内容可能离开本机。锁和台账是源码设计，不能仅凭静态检查证明断电、并发和远端数据处理可靠。

#### 证据与依据

**依据 1 · 源码核查**：[core/memory.mjs:983-1019](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/memory.mjs#L983-L1019)

排他锁、过期接管和身份核对。

<details>
<summary>查看原文（37行）</summary>

```text
  function acquireLock() {
    try {
      const fd = openSync(lockPath, 'wx')
      lockToken = `${process.pid}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
      try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid, writer, at: Date.now(), tab: lockToken, phase: 'start' }))
      } finally { closeSync(fd) }
      lockHeld = true
      lockWriter = writer
      return true
    } catch (e) {
      if (e.code !== 'EEXIST') { audit(`LOCK_FAIL ${e.message}`); return false }
      let st = null
      try { st = statSync(lockPath) } catch { return acquireLock() }
      if (Date.now() - st.mtimeMs < cfg.staleLockMs) return false
      // 心跳过期：把旧锁改名（原子），再抢一次
      try { renameSync(lockPath, `${lockPath}.stale-${Date.now()}`) } catch { return false }
      return acquireLock()
    }
  }

  /**
   * 持锁期间确认"这把钥匙还是我的"。
   * 如果整理卡在模型调用里超过 staleLockMs，另一端会接管；接管后这边必须停手，
   * 否则两个写者同时改深层文件，会互相覆盖。
   */
  function checkLock() {
    if (!lockHeld) throw new Error('没有钥匙')
    const cur = readLock()
    if (!cur || cur.tab !== lockToken) throw new Error('钥匙被接管，放弃本轮')
  }

  function heartbeat() {
    if (!lockHeld) return
    const cur = readLock()
    if (cur && cur.tab && cur.tab !== lockToken) { lockHeld = false; return }  // 已被接管
    try { utimesSync(lockPath, new Date(), new Date()) } catch { /* 锁没了就下次再抢 */ }
```

</details>

**依据 2 · 源码核查**：[core/memory.mjs:1644-1655](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/memory.mjs#L1644-L1655)

遗忘前写台账，失败保留。

<details>
<summary>查看原文（12行）</summary>

```text
  function forgetDL1(db) {
    const now = tick()
    const keep = []
    let n = 0
    for (const it of db.DL1) {
      if (it.pinned) { keep.push(it); continue }
      // 等模型整理的原文：还没压过摘要，忘了就真丢了
      if (it.pendingDigest) { keep.push(it); continue }
      const r = retentionOf(it, now)
      if (r >= cfg.forgetThreshold) { keep.push(it); continue }
      if (!writeForgotten(it, now, r)) { keep.push(it); continue }   // 台账写不进去就不删
      vectors.delete(it.id); vectorsDirty = true
```

</details>

**依据 3 · 源码核查**：[core/memory.mjs:1663-1689](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/memory.mjs#L1663-L1689)

超容量时等待摘要条目排在最后而非绝对保留。

<details>
<summary>查看原文（27行）</summary>

```text
  /**
   * DL1 容量上限：遗忘曲线管「该不该忘」，这里管「库不能无限长」。
   *
   * 超过上限就按「越旧越先清」清到 80%；优先清已经整理过的（没有 pendingDigest），
   * 最后才动「等模型整理」的原文——那批还没压过摘要，忘了就真丢了。
   */
  function enforceDL1Cap(db) {
    const cap = Number(cfg.dl1MaxChars) || 0
    if (cap <= 0) return 0
    const total = chars(db.DL1)
    if (total <= cap) return 0
    const target = Math.floor(cap * 0.8)
    const now = tick()
    const cands = [...db.DL1]
      .filter((it) => !it.pinned)
      .sort((a, b) => {
        const pa = a.pendingDigest ? 1 : 0
        const pb = b.pendingDigest ? 1 : 0
        if (pa !== pb) return pa - pb
        return (a.createdAt || 0) - (b.createdAt || 0)
      })
    let used = total
    const drop = new Set()
    for (const it of cands) {
      if (used <= target) break
      const r = retentionOf(it, now)
      if (!writeForgotten(it, now, r, 'DL1 超容量')) continue   // 台账写不进去就不删
```

</details>

**依据 4 · 源码核查**：[core/memory.mjs:1844-1897](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/memory.mjs#L1844-L1897)

整理、锁验证、写数据和删除认领文件的顺序。

<details>
<summary>查看原文（54行）</summary>

```text
  async function organize() {
    if (busy) return { ok: false, skipped: 'running' }
    if (!acquireLock()) return { ok: false, skipped: 'busy' }
    busy = true
    const started = tick()
    const hb = setInterval(heartbeat, 30 * 1000)
    let claimed = []
    try {
      const db = loadDb()
      // 整理时对账（注入路径不再做这件事，见 readL1View 的说明）：
      // 清理崩溃留下的跨层交叉、DL2 孤儿。清掉的条目要能写回去，
      // 所以这里记下条数，最后并进 changed。
      const rec1 = reconcile(db)
      // DL3 的内容快照：用来判断"这轮到底动没动摘要"，没动就别重写文件。
      // 重写会让 mtime 变、让 L3 快照被判过期，白白打断一次前缀缓存。
      const dl3Before = JSON.stringify(db.DL3)
      const m = mergeTemps(db)
      claimed = m.claimed
      maybeReloadVectors()
      // 先消费信号：attend 可能把 DL1 升回 L2，别让 L2 摘要先把这条吃掉。
      const sg = applySignals(db)
      // 信号可能刚删了摘要；再对一次账，DL2 孤儿同轮就归位到 DL1。
      const rec2 = reconcile(db)
      checkTimeout(started)
      // 容量告警：单层过大时留痕（不改行为）
      const warnN = Number(cfg.warnLayerItems) || 200000
      const bigLayers = DATA_LAYERS.filter((l) => db[l].length > warnN)
      if (bigLayers.length) {
        audit('LAYER_WARN ' + bigLayers.map((l) => `${l}=${db[l].length}`).join(' ')
          + `（阈值 ${warnN}，建议检查整理是否卡住）`)
      }
      const n1 = await organizeL1(db, started)
      checkTimeout(started)
      // L2 只在有模型时跑：没有模型就别把缓冲层清空，留着等能压的时候
      const n2 = typeof o.summarizeWithSources === 'function' ? await organizeL2(db, started) : 0
      checkTimeout(started)
      const nf = forgetDL1(db)
      // DL1 容量上限：遗忘曲线管「该不该忘」，这里管「库不能无限长」
      const nt = enforceDL1Cap(db)
      // DL3 只淘汰「琐事」档；重要/一般的摘要只靠融合合并/作废
      const ns = forgetDL3(db)
      checkLock()          // 卡太久可能被接管；不是我的钥匙就不许写
      // ★ 没变化就不落盘：turn/end 之后每轮都会调一次 organize，
      //   无条件写五个文件会把"每轮尝试整理"变成"每轮全量重写"。
      const changed = m.merged > 0 || (sg?.ops || 0) > 0 || n1 > 0 || n2 > 0 || nf > 0 || nt > 0 ||
        (ns.summaries || 0) > 0 || (ns.sources || 0) > 0 || rec1 > 0 || rec2 > 0
      if (changed) {
        const dl3Changed = JSON.stringify(db.DL3) !== dl3Before
        saveDb(db, { skip: dl3Changed ? [] : ['DL3'] })
      }
      // 先存数据，再记 applied，再删源文件（崩在中间最多重放一次，不会丢）
      if (sg?.applied) atomicWrite(appliedPath, JSON.stringify(sg.applied, null, 1))
      for (const p of claimed) { try { unlinkSync(p) } catch { /* 已没 */ } }
      for (const p of sg?.claimed || []) { try { unlinkSync(p) } catch { /* 已没 */ } }
```

</details>

**依据 5 · 源码核查**：[core/llm.mjs:84-103](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/llm.mjs#L84-L103)

可向配置端点 POST 内容并携带凭据。

<details>
<summary>查看原文（20行）</summary>

```text
async function post(url, key, body, opts = {}) {
  const {
    timeoutMs = 20000, retries = 2, maxConcurrent = 6,
    rateLimitRetries = 5, rateLimitBaseMs = 900,
  } = opts

  await gateAcquire(maxConcurrent)
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  let netAttempt = 0
  let rlAttempt = 0
  try {
    while (true) {
      try {
        const headers = { 'Content-Type': 'application/json' }
        if (key) headers.Authorization = `Bearer ${key}`
        const r = await fetch(url, {
          method: 'POST', headers, body: JSON.stringify(body), signal: ctrl.signal,
        })
        const text = await r.text()      // 读 body 也在 signal 的覆盖范围内
```

</details>

**依据 6 · 源码核查**：[core/llm.mjs:580-610](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/llm.mjs#L580-L610)

会话模型失败后可能回落 HTTP。

<details>
<summary>查看原文（31行）</summary>

```text
   * 通用对话调用。
   * 先试会话模型（如果该阶段配置成跟随），失败安静回落 HTTP。
   */
  async function chat(system, user, opts = {}) {
    const {
      maxTokens = 400, temperature = 0, stage: stageName = 'chat',
      model, timeout = cfg.timeoutMs, thinking,
    } = opts
    const st = stage(stageName)
    const useModel = model || st.model
    const noThink = thinking === undefined
      ? cfg.noThink?.[stageName] === true
      : thinking === false

    if (st.wantSession) {
      const s = getSession()
      if (s?.available && typeof s.call === 'function') {
        const t0 = Date.now()
        try {
          const out = await s.call({ system, user, maxTokens, temperature, disableThinking: noThink, timeoutMs: timeout })
          const text = String(out?.text ?? out ?? '').trim()
          if (text) return text
          log('SESSION_EMPTY', `stage=${stageName} ms=${Date.now() - t0}`)
        } catch (err) {
          fail(`session:${stageName}`, err, Date.now() - t0)
        }
      }
    }

    if (!useModel) throw new Error(`阶段 ${stageName} 没有配置模型`)
    if (!st.apiKey && isCloudBase(st.base)) throw new Error(`阶段 ${stageName} 没有 API Key`)
```

</details>

#### 缺口

- 未执行并发、断电、配额和远端模型测试
  **影响**：无法确认持久性、遗漏率和服务方数据处理
  **进一步探讨**：在隔离数据副本注入锁接管、写失败和模型故障并核对每层。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、成本和试用退出条件是什么？

**研究主题**：效果与总成本、采用判断、缺陷与关键质疑

#### 完整回答

插件需要兼容 DSH 的事件、系统提示、会话 surface 和工具接口，以及可写本地目录；整理和向量等模型能力取决于实际配置。首次需选择本地存储、模型端点和替代策略并备份会话，持续需审查记忆内容、截断和服务费用，失败需恢复数据或原历史；具体费用和时间未知。默认历史替代配合截断会改变可用上下文，建议先观察并在隔离 profile 中关闭历史替代、使用非敏感样本验证捕获和检索；若找不到关键事实、替代前没有可恢复历史或模型端点不可接受，停止替代并回到宿主原生历史。

#### 证据与依据

**依据 1 · 源码核查**：[core/settings.mjs:87-104](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/settings.mjs#L87-L104)

捕获上限。

<details>
<summary>查看原文（18行）</summary>

```text
    group: '抓取', path: 'capture.enabled', type: 'boolean', default: true,
    label: '自动记录对话',
    hint: '每轮结束把「你问的、模型答的、工具做的」写进 L1（即时层）。关掉就只读不写。',
  },
  {
    group: '抓取', path: 'capture.userChars', type: 'number', default: 2000, min: 100, max: 20000, step: 100,
    label: '单条用户消息上限（字）',
    hint: '一条消息太长时截断后再进 L1。',
  },
  {
    group: '抓取', path: 'capture.botChars', type: 'number', default: 400, min: 100, max: 5000, step: 50,
    label: '一轮回复上限（字）',
    hint: '一轮里模型的正文拼起来再截断（不是每条消息各截一次）。',
  },
  {
    group: '抓取', path: 'capture.toolChars', type: 'number', default: 500, min: 0, max: 5000, step: 50,
    label: '单条工具输出上限（字）',
    hint: '一次命令能吐几万字，进 L1 前先截断。',
```

</details>

**依据 2 · 源码核查**：[core/settings.mjs:289-303](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/settings.mjs#L289-L303)

历史替代默认设置。

<details>
<summary>查看原文（15行）</summary>

```text
  // —— 历史替代（第 7 步）——
  {
    group: '历史替代', path: 'compaction.enabled', type: 'boolean', default: true,
    label: '用记忆替代对话历史',
    hint: '每轮结束后把 dsh 自己的历史换成一条占位，模型只靠注入的记忆说话。',
  },
  {
    group: '历史替代', path: 'compaction.keepTurns', type: 'number', default: 0, min: 0, max: 50, step: 1,
    label: '保留最近几轮原文',
    hint: '0 = 全部替换（完全靠记忆）；1 = 留最近一轮，其余归档。',
  },
  {
    group: '历史替代', path: 'compaction.archiveChars', type: 'number', default: 1200, min: 100, max: 20000, step: 100,
    label: '每轮归档字数上限',
    hint: '替换前先把要丢的内容写进 L1，写成功才敢丢。',
```

</details>

**依据 3 · 源码核查**：[core/index.mjs:683-702](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L683-L702)

注入关闭或记忆块为空时的全替换保护。

<details>
<summary>查看原文（20行）</summary>

```text
  let compacting = false
  const compactTurn = async (sessionObj, { alreadyArchived }) => {
    // 工作模式：会话表现保持正常 —— 历史一点都不动
    if (workMode) {
      audit('COMPACT_SKIP', 'reason=work-mode')
      return null
    }
    if (cfg.compaction.enabled === false) return null
    if (!sessionObj) return null
    if (cfg.inject.enabled === false && (Number(cfg.compaction.keepTurns) || 0) === 0) {
      // 历史全替 + 不注入 = 模型什么都看不到，宁可不替
      audit('COMPACT_SKIP', 'reason=inject-disabled')
      return null
    }
    // 兜底：全替之前确认「记忆块」真的不是空的（没模型、库是空的、全在 DL1 等模型时，
    // 替掉历史就等于让模型失忆）。
    if ((Number(cfg.compaction.keepTurns) || 0) === 0) {
      let block = ''
      try { block = mem.buildBlock(Number(cfg.inject.maxChars) || 0, {}) } catch { block = '' }
      if (!block) { audit('COMPACT_SKIP', 'reason=no-context'); return null }
```

</details>

**依据 4 · 源码核查**：[core/index.mjs:726-740](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L726-L740)

捕获用户消息。

<details>
<summary>查看原文（15行）</summary>

```text
  const captureOff = step('capture', () => {
    if (!captureOn) { audit('CAPTURE_OFF'); return }
    if (typeof ctx.on !== 'function') throw new Error('ctx.on 不可用')

    const handler = (sessionObj, event) => {
      const d = event?.data || {}
      const sid = sessionObj?.id || 'default'
      const buf = bufOf(sid)

      if (event.type === 'user/message') {
        // 只记真人输入：agent.inject / skill / cron 也走这个事件，但它们 source.kind 不是 'user'
        if (d.source?.kind !== 'user') return
        const t = takeText(d.content)
        if (!t) return
        buf.user.push(t.slice(0, cap.user))
```

</details>

**依据 5 · 源码核查**：[core/llm.mjs:580-610](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/llm.mjs#L580-L610)

模型来源及 HTTP 退路。

<details>
<summary>查看原文（31行）</summary>

```text
   * 通用对话调用。
   * 先试会话模型（如果该阶段配置成跟随），失败安静回落 HTTP。
   */
  async function chat(system, user, opts = {}) {
    const {
      maxTokens = 400, temperature = 0, stage: stageName = 'chat',
      model, timeout = cfg.timeoutMs, thinking,
    } = opts
    const st = stage(stageName)
    const useModel = model || st.model
    const noThink = thinking === undefined
      ? cfg.noThink?.[stageName] === true
      : thinking === false

    if (st.wantSession) {
      const s = getSession()
      if (s?.available && typeof s.call === 'function') {
        const t0 = Date.now()
        try {
          const out = await s.call({ system, user, maxTokens, temperature, disableThinking: noThink, timeoutMs: timeout })
          const text = String(out?.text ?? out ?? '').trim()
          if (text) return text
          log('SESSION_EMPTY', `stage=${stageName} ms=${Date.now() - t0}`)
        } catch (err) {
          fail(`session:${stageName}`, err, Date.now() - t0)
        }
      }
    }

    if (!useModel) throw new Error(`阶段 ${stageName} 没有配置模型`)
    if (!st.apiKey && isCloudBase(st.base)) throw new Error(`阶段 ${stageName} 没有 API Key`)
```

</details>

#### 缺口

- 未验证宿主兼容、数据保密和费用
  **影响**：不能判断安全部署与恢复成本
  **进一步探讨**：固定 profile 和模型，记录本地目录、网络请求、备份及恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么改进方向可通过对照否定？

**研究主题**：新假设与验证

#### 完整回答

可以探索在替代历史前建立每一段原文到记忆记录的覆盖清单，明确截断、附件未收录和可恢复位置，并在覆盖不满足用户阈值时保留原 surface。现有代码已有写入成功及非空记忆块检查，但这不检查逐段覆盖；新增的是对要被替换内容的完整性证明，而不是重复已有成功标志。用超长消息、多工具输出和写失败场景，比较关键事实可回读率、token 与人工恢复时间；若覆盖无法可靠验证或成本远超收益，则否定。该方案尚未实现或测试。

#### 证据与依据

**依据 1 · 源码核查**：[core/index.mjs:651-679](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L651-L679)

本轮捕获有上限。

<details>
<summary>查看原文（29行）</summary>

```text
  const writeRows = async (rows, stat) => {
    if (!rows.length) { audit('WRITE_TURN_SKIP', `user=${stat.user} bot=${stat.bot} tool=${stat.tool}`); return false }
    const res = await mem.writeTurn(rows)
    const l1 = stats()?.count?.L1 ?? '?'
    if (res?.ok) {
      audit('WRITE_TURN', `user=${stat.user} bot=${stat.bot} tool=${stat.tool} rows=${rows.length} L1=${l1}`)
      return true
    }
    audit('WRITE_TURN_FAIL', `${res?.error || 'unknown'} rows=${rows.length}`)
    return false
  }

  const makeRows = (buf) => {
    const turnId = `${writer}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    const rows = []
    for (const t of buf.user) rows.push({ text: t, speaker: 'user', channel: 'dialog', scene: 'dsh', turnId })
    if (buf.bot.length) {
      const botText = buf.bot.join('\n').trim()
      if (botText) rows.push({ text: botText.slice(0, cap.bot), speaker: 'bot', channel: 'dialog', scene: 'dsh', turnId })
    }
    for (const c of buf.tools.values()) {
      const out = c.done ? (c.out || '（无输出）') : '（被中断，无结果）'
      const head = c.err ? '失败' : (c.done ? '完成' : '未完成')
      rows.push({
        text: `运行 ${c.name}「${String(c.args || '').slice(0, 120)}」→ ${head}：${out}`,
        speaker: 'bot', channel: 'action', scene: 'dsh', turnId,
      })
    }
    return rows
```

</details>

**依据 2 · 源码核查**：[core/index.mjs:683-702](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L683-L702)

已有写入与非空块门槛。

<details>
<summary>查看原文（20行）</summary>

```text
  let compacting = false
  const compactTurn = async (sessionObj, { alreadyArchived }) => {
    // 工作模式：会话表现保持正常 —— 历史一点都不动
    if (workMode) {
      audit('COMPACT_SKIP', 'reason=work-mode')
      return null
    }
    if (cfg.compaction.enabled === false) return null
    if (!sessionObj) return null
    if (cfg.inject.enabled === false && (Number(cfg.compaction.keepTurns) || 0) === 0) {
      // 历史全替 + 不注入 = 模型什么都看不到，宁可不替
      audit('COMPACT_SKIP', 'reason=inject-disabled')
      return null
    }
    // 兜底：全替之前确认「记忆块」真的不是空的（没模型、库是空的、全在 DL1 等模型时，
    // 替掉历史就等于让模型失忆）。
    if ((Number(cfg.compaction.keepTurns) || 0) === 0) {
      let block = ''
      try { block = mem.buildBlock(Number(cfg.inject.maxChars) || 0, {}) } catch { block = '' }
      if (!block) { audit('COMPACT_SKIP', 'reason=no-context'); return null }
```

</details>

**依据 3 · 源码核查**：[core/index.mjs:783-788](https://github.com/1129742588/dsh-memory-tiers/blob/897c3dfda219a7fa61bb45c15df98a3afce74c32/core/index.mjs#L783-L788)

写成功后才触发本轮替代。

```text
      Promise.resolve()
        .then(async () => {
          const ok = await writeRows(rows, stat)
          // 写入没成功就不压缩：历史丢了、记忆里又没有 = 真失忆
          if (!ok) return
          await compactTurn(sessionObj, { alreadyArchived: true })
```

#### 缺口

- 逐段覆盖清单尚无实现
  **影响**：不能声称可以防止遗漏
  **进一步探讨**：用已知事实集及失败注入对照恢复率与资源成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
