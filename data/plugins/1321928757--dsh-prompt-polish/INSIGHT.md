# dsh-prompt-polish

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c894ae3](https://github.com/1321928757/dsh-prompt-polish/tree/c894ae3de6590542f8353b76e314656a4a3fe3a0)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-prompt-polish) [![npm 30d 347](https://img.shields.io/static/v1?label=npm+30d&message=347&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish)
<!-- END META -->

> **实现功能**：DSH Web 输入栏提示词重写 UI；经 Typert RPC 调用宿主已配置模型，先展示结果再人工采用。

> **核心亮点**：在输入栏直接提供六模式重写、上下文与人工采用保护；详见[Q01](#research-q01)。

> **风险与缺陷**：上下文发往选定 provider；工作区映射缺失时设置回退到最近/首个工作区，且超时未显式 abort 流。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 用户如何优化并采用提示词？](#detail-section-11)
  - [Q02 · 上下文与设置如何跨越隐私和持久化边界？](#detail-section-12)
  - [Q03 · 失败、截断和取消的控制边界是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH Web 模型配置、希望改写草稿且保留人工审阅的用户。

手工将草稿复制到模型会话改写，再复制回输入栏；本插件内嵌相同步骤。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| UI | 草稿优化/确认 | 需 Web profile |
| Host RPC | 调用已配置模型 | provider 接收输入 |
| 设置同步 | localStorage/工作区文件 | 映射和沙箱影响 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH Web 0.2.x | Slot/Typert | UI/RPC 不兼容 |
| 已配置 LLM provider | 重写 | 无法优化 |
| 工作区文件服务 | L3 设置 | 降级 localStorage |

#### 试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 输入 | 非敏感草稿 | 原稿不自动改变 |
| 优化 | 看 provider/结果 | 人工可拒绝 |
| 设置 | 查看工作区路径 | 只写目标工作区 |

**效果与成本**

#### 成本

| 项 | 来源 | 边界 |
| --- | --- | --- |
| 模型调用 | 每次优化一次流式请求 | provider 定价未知 |
| 上下文 | 额外输入字符 | 敏感信息可能发出 |
| 运维 | Web/Host 版本适配 | DSH 0.2 契约 |

#### 效果

| 项 | 代码支持 | 待验证 |
| --- | --- | --- |
| 人工采用 | 原稿比较/确认 | 真实 UI 行为 |
| 上下文 | 目标/消息/工具摘要裁剪 | 质量增益 |
| 取消 | runId + AbortController | provider 资源释放 |

> **思考**：上下文发往选定 provider；工作区映射缺失时设置回退到最近/首个工作区，且超时未显式 abort 流。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：在输入栏直接提供六模式重写、上下文与人工采用保护；详见[Q01](#research-q01)。

在输入栏直接提供六模式重写、上下文与人工采用保护；详见[Q01](#research-q01)。

Host 提供 Typert 服务，按当前默认模型或首个 provider 组装请求；Client 注入输入栏与设置行。

<a id="detail-section-5"></a>

### 1.4 主要限制

上下文发往选定 provider；工作区映射缺失时设置回退到最近/首个工作区，且超时未显式 abort 流。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离 Web profile 用非敏感草稿、关闭历史试用；再按需开上下文并确认 provider 与工作区路径。详见[Q02](#research-q02)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 UI、RPC、确认与上下文裁剪；真实模型质量/兼容性未验，设置工作区回退与超时资源释放有边界。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、package.json、lib/index.js、lib/client.js、lib/shared.js、lib/typert.host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的 README、Host/Client 源码；未运行插件、Web profile 或真实模型。
- 下一步：隔离 DSH Web profile 检查 UI/服务兼容、provider 请求内容、工作区选择、低上限/慢流模型与超时取消。

**分析版本**

- **仓库**：[1321928757/dsh-prompt-polish](https://github.com/1321928757/dsh-prompt-polish)
- **版本号**：0.4.1（[固定提交 c894ae3](https://github.com/1321928757/dsh-prompt-polish/tree/c894ae3de6590542f8353b76e314656a4a3fe3a0)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

增加发送前 provider/上下文预览、只写确定关联工作区、超时主动 abort，可降低隐私与资源风险；待运行验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

隔离 DSH Web profile 检查 UI/服务兼容、provider 请求内容、工作区选择、低上限/慢流模型与超时取消。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1827 | — | — | 16263 |
| .js | source | 4 | 2333 | 2032 | 193 | — |
| .mjs | source | 1 | 115 | 112 | 2 | — |
| .mjs | test | 4 | 474 | 432 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1321928757/dsh-prompt-polish/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/1321928757/dsh-prompt-polish/issues?q=is%3Aissue+created%3A2026-09-22T06%3A31%3A04.362Z..2026-10-22T06%3A31%3A04.362Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1321928757/dsh-prompt-polish/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A31%3A04.362Z..2026-10-22T06%3A31%3A04.362Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实输入栏优化的模型/上下文数据边界、人工采用保护与失败/超时行为。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户如何优化并采用提示词？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件在 DSH Web 输入栏注入优化按钮、设置齿轮和结果弹窗，提供六种模式与语言选项。浏览器将草稿通过 Typert RPC 发给 Host 的 promptPolish 服务，由宿主已配置的 LLM provider/model 流式重写；不会自行发送草稿或自动采用。成功后原稿与结果并列，只有草稿未变化时采用按钮有效，用户也可保留原稿。这里的“更好提示词”是模型生成结果，源码能证明调用与交互设计，无法证明生成质量。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:5-27](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/README.zh-CN.md#L5-L27)

作者描述入口、六模式与确认。

<details>
<summary>查看原文（23行）</summary>

```text
DeepSeek Harness（DSH）输入栏提示词优化插件。点击 **优化**，将当前草稿交给 DSH 中配置的模型提供商处理，并在决定是否使用前先查看结果。

> **数据边界：** 插件不新增独立 API 端点；优化请求通过 DSH 已配置的模型提供商和模型完成。开启上下文后，请求可能包含最近消息、当前目标与任务清单、压缩摘要以及可选的工具调用结果摘要。因此，草稿和已开启的上下文对该模型提供商可见；将插件用于敏感会话前，请先查看提供商的隐私和数据留存政策。

## 功能入口

| 入口 | 提供的功能 |
| --- | --- |
| **输入栏 → 优化** | 重写当前草稿，展示结果供确认，或停止正在进行的优化。 |
| **输入栏 → 设置齿轮** | 配置上下文、工具摘要、模式和语言，并打开完整设置弹窗。 |
| **DSH 设置 → 通用** | 注册在 `settings.general.item` 的关联设置行，用于切换「参考聊天记录上下文」。其他选项仍在输入栏设置中。 |

## 功能特性

- 六种提示词重写模式：**默认**、**压缩精简**、**结构化**、**创意扩展**、**翻译并优化**、**代码请求**。
- 三种语言选择：**跟随原文**、**中文**、**英文**。显式语言选择会在自定义偏好之后生效；在「翻译并优化」模式中，**跟随原文**表示只优化、不翻译。
- 可选携带当前会话上下文：目标、任务清单、压缩摘要、最近消息，以及在两个上下文开关同时开启时的简短工具结果摘要。
- 结果弹窗会展示原稿和优化结果，并提供 **采用优化结果**、**保留原稿**、**稍后再看**。结果不会自动采用。
- 模型流式输出期间可以停止；当 DSH 会话 block API 可用时，输入栏阻塞会立即解除，迟到的取消结果会被丢弃。
- 失败结果会保留原稿并显示失败原因，支持 **重试**。
- 当前挂载组件内保存最近五次优化尝试。成功记录可查看或显式回填到输入栏；失败记录也会保留为失败记录。
- 设置会保存到本地，并尽力同步到工作区文件。
- 浏览器 UI 使用 DSH 主题令牌，跟随亮/暗主题，并支持键盘焦点、Escape/点击外部关闭、减少动效和高对比度边框。输入栏控件保持低噪声：**优化**按钮静止时透明，仅在悬浮、聚焦或按下时显示宿主交互背景，文字颜色也会贴近相邻 DSH 控件并降低强调度。
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1127-1157](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/client.js#L1127-L1157)

客户端构造 payload 并调用优化 RPC。

<details>
<summary>查看原文（31行）</summary>

```text
          try {
            const payload = {
              draft: snapshot,
              withHistory: settings.withHistory,
              options: {
                mode: settings.mode,
                language: settings.language,
                custom: settings.custom,
              },
              runId,
            }
            if (settings.withHistory) payload.history = ctxInfo.items
            const res = await host.call('optimizePrompt', payload)
            // 用户已点「停止」：迟到结果一律丢弃（宿主 abort 后正常返回 cancelled）
            if (cancelledRef.current === true) return
            // 已被取消或已有新一次优化取代本次：丢弃迟到结果，绝不串扰
            const cur = activeRunRef.current
            if (cur === null || cur.runId !== runId) return
            if (res && res.cancelled === true) {
              setInfo('已取消')
              return
            }
            if (res && res.ok === true && typeof res.text === 'string' && res.text.trim()) {
              const entry = { id: makeId(), time: Date.now(), draft: snapshot, result: res.text, failed: false, error: '', truncated: res.truncated === true }
              pushHistory(entry)
              setPending(entry)
            } else {
              const msg = (res && res.error) || '优化失败'
              const entry = { id: makeId(), time: Date.now(), draft: snapshot, result: '', failed: true, error: msg, truncated: false }
              pushHistory(entry)
              setPending(entry)
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1211-1215](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/client.js#L1211-L1215)

采用前比对草稿快照。

```text
        // 结果弹窗动作
        const canAdopt = pending !== null && pending.failed !== true
          && typeof pending.result === 'string' && pending.result.trim() !== ''
          && mirror.currentDraft === pending.draft

```

**依据 4 · 源码核查**：[lib/index.js:358-366](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/index.js#L358-L366)

Host 暴露 promptPolish Typert 服务。

```text
  // ---- 服务提供（Typert 网关经 ./typert 清单暴露给客户端）----
  const service = { getSettings, setSettings, optimizePrompt, cancelOptimize }
  Object.defineProperty(service, 'typertRemote', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: { service, serviceKey: 'promptPolish', namespace: 'promptPolish' },
  })
  ctx.provide('promptPolish', service)
```

#### 缺口

- 未连接目标 DSH Web 与实际模型进行端到端试用。
  **影响**：UI 兼容性及结果质量尚无独立验证。
  **进一步探讨**：在隔离 Web profile 输入不同草稿，核对重写和采用保护。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 上下文与设置如何跨越隐私和持久化边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

默认不携带历史；开启后客户端提取当前目标、任务清单、压缩摘要、最近消息以及可选工具结果摘要，并对长度做裁剪，再发送给宿主模型 provider。草稿及开启的上下文因此可被该 provider 接收。设置先写浏览器 localStorage，找到工作区后异步浅合并写入 .dsh/prompt-optimizer/settings.json，沙箱拒绝时标记 _hostBlocked 降级本地；下次拉取工作区设置可能覆盖本地值。工作区根目录由当前 session 关联工作区、最近工作区、首个工作区顺序回退，若会话映射缺失，设置可能写到并非用户意图的工作区。没有见到明示的 provider/上下文逐项预览确认门禁。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:615-734](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/client.js#L615-L734)

localStorage、工作区选择、异步同步与拉取。

<details>
<summary>查看原文（120行）</summary>

```text
      function loadSettings() {
        try {
          const raw = window.localStorage.getItem(SETTINGS_KEY)
          const parsed = raw ? JSON.parse(raw) : null
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
        } catch (err) { /* ignore */ }
        return {}
      }

      function normalizeSettings(s) {
        return {
          withHistory: !!(s && s.withHistory === true),
          withToolResults: !!(s && s.withToolResults === true),
          mode: (s && hasValue(MODE_OPTIONS, s.mode)) ? s.mode : 'precise',
          language: (s && hasValue(LANGUAGE_OPTIONS, s.language)) ? s.language : 'follow',
          custom: (s && typeof s.custom === 'string') ? s.custom.slice(0, 500) : '',
        }
      }

      function currentSessionId() {
        try {
          if (sessionsService && sessionsService.list && typeof sessionsService.list.getSnapshot === 'function') {
            const s = sessionsService.list.getSnapshot()
            return typeof s.current === 'string' ? s.current : undefined
          }
        } catch (err) { /* ignore */ }
        return undefined
      }

      function currentWorkspaceRoot() {
        try {
          const ws = workspacesService
          if (!ws || !ws.list || typeof ws.list.getSnapshot !== 'function') return null
          const snap = ws.list.getSnapshot()
          const items = Array.isArray(snap && snap.items) ? snap.items : []
          const sessionId = currentSessionId()
          let item
          if (typeof sessionId === 'string') {
            item = items.find((it) => it && Array.isArray(it.sessionIds) && it.sessionIds.includes(sessionId))
          }
          if (item === undefined && snap && snap.recentWorkspaceId !== undefined) {
            item = items.find((it) => it && it.workspaceId === snap.recentWorkspaceId)
          }
          if (item === undefined) item = items[0]
          return item && typeof item.path === 'string' && item.path.length > 0 ? item.path : null
        } catch (err) {
          return null
        }
      }

      function markHostBlocked(on) {
        try {
          const cur = loadSettings()
          if (on) cur._hostBlocked = true
          else delete cur._hostBlocked
          window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(cur))
        } catch (err) { /* ignore */ }
      }

      function saveSettings(patch) {
        const base = loadSettings()
        const next = { ...base, ...patch }
        const view = normalizeSettings(next)
        next.withHistory = view.withHistory
        next.withToolResults = view.withToolResults
        next.mode = view.mode
        next.language = view.language
        next.custom = view.custom
        try {
          window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
        } catch (err) { /* 存储被拒：降级为页面内存态 */ }
        for (const fn of listeners) { try { fn(view) } catch (e) { /* ignore */ } }
        try { window.dispatchEvent(new CustomEvent('ptopt:settings-changed', { detail: view })) } catch (e) { /* ignore */ }
        const root = currentWorkspaceRoot()
        if (root) {
          const sessionId = currentSessionId()
          host.call('setSettings', {
            root,
            sessionId,
            patch: {
              withHistory: view.withHistory,
              withToolResults: view.withToolResults,
              mode: view.mode,
              language: view.language,
              custom: view.custom,
            },
          }).then((res) => {
            if (res && res.ok === true) {
              if (next._hostBlocked === true) markHostBlocked(false)
            } else if (res && res.reason === 'sandbox') {
              // L3 写入被沙箱拒绝：标记后，启动拉取不再让旧文件覆盖本地（静默降级 L1）
              markHostBlocked(true)
            }
          }).catch(() => { /* 静默：L3 失败不影响 L1 */ })
        }
        return view
      }

      function pullHostSettings(root, sessionId) {
        host.call('getSettings', { root, sessionId }).then((res) => {
          if (!res || res.ok !== true) return
          const s = res.settings
          if (!s || typeof s !== 'object' || Array.isArray(s)) return
          const local = loadSettings()
          if (local._hostBlocked === true) return
          const hostView = normalizeSettings(s)
          const patch = {}
          let changed = false
          const keys = ['withHistory', 'withToolResults', 'mode', 'language', 'custom']
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            if (!Object.prototype.hasOwnProperty.call(s, key)) continue
            const hostVal = hostView[key]
            if (!Object.prototype.hasOwnProperty.call(local, key) || local[key] !== hostVal) {
              patch[key] = hostVal
              changed = true
            }
          }
          if (changed) saveSettings(patch)
        }).catch(() => { /* 拉取失败：只用 localStorage */ })
```

</details>

**依据 2 · 源码核查**：[lib/client.js:810-858](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/client.js#L810-L858)

上下文收集代码。

<details>
<summary>查看原文（49行）</summary>

```text
      function extractContext(session, settings, goalSnapshot) {
        const nodes = session && Array.isArray(session.nodes) ? session.nodes : []
        const items = []
        const stats = { messages: 0, hasGoal: false, hasTodo: false, chars: 0, toolSummaries: 0, hasCompaction: false }

        // goal：背景最前
        if (goalSnapshot && typeof goalSnapshot.objective === 'string') {
          let text = '当前任务目标（' + (GOAL_PHASE_LABEL[goalSnapshot.phase] || '进行中') + '）：' + goalSnapshot.objective
          if (goalSnapshot.phase === 'blocked' && goalSnapshot.blockedReason && goalSnapshot.blockedReason.message) {
            text += '（受阻原因：' + goalSnapshot.blockedReason.message + '）'
          }
          items.push({ kind: 'goal', text })
          stats.hasGoal = true
          stats.chars += text.length
        }

        // todo：当前任务清单
        const todoText = readTodoLines(session && session.sessionId, nodes)
        if (todoText) {
          const text = '当前任务清单：\n' + todoText
          items.push({ kind: 'todo', text })
          stats.hasTodo = true
          stats.chars += text.length
        }

        // tool-result 索引（仅开关开启时构建）
        const withTools = settings.withToolResults === true
        let resultByCallId = null
        if (withTools) {
          resultByCallId = new Map()
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i]
            if (n && n.kind === 'tool-result' && typeof n.callId === 'string' && !resultByCallId.has(n.callId)) {
              resultByCallId.set(n.callId, n)
            }
          }
        }

        // 消息回合（倒序 + 消息边界 + 预算早停）
        const turns = []
        let total = 0
        for (let i = nodes.length - 1; i >= 0 && turns.length < MAX_HISTORY_TURNS; i--) {
          const node = nodes[i]
          if (!node) continue
          // 压缩标记——注入摘要作为背景，并停止采集更旧的原始消息
          if (node.kind === 'compaction') {
            if (typeof node.summary === 'string' && node.summary.trim()) {
              const text = '更早对话的压缩摘要：\n' + node.summary.trim().slice(0, 2000)
              items.push({ kind: 'compaction-summary', text })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:74-134](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/index.js#L74-L134)

Host 读取/浅合并写入工作区设置。

<details>
<summary>查看原文（61行）</summary>

```text
  // ---- L3 设置读取 ----
  async function getSettings(args) {
    if (!fs || typeof fs.resolve !== 'function') return { ok: false, error: '文件服务不可用' }
    const root = args && typeof args.root === 'string' ? args.root : ''
    if (!root) return { ok: false, error: '缺少工作区根目录' }
    try {
      const target = await fs.resolve(root + SETTINGS_SUFFIX)
      let text
      try {
        text = await fs.readText(target)
      } catch (err) {
        if (err && err.code === 'FS_NOT_FOUND') return { ok: true, settings: {} }
        throw err
      }
      let parsed
      try {
        parsed = JSON.parse(text)
      } catch (err) {
        return { ok: true, settings: {} }
      }
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ok: true, settings: {} }
      return { ok: true, settings: parsed }
    } catch (err) {
      return { ok: false, error: String((err && err.message) || err) }
    }
  }

  // ---- L3 设置写入（浅合并）----
  async function setSettings(args) {
    if (!fs || typeof fs.resolve !== 'function') return { ok: false, error: '文件服务不可用' }
    const root = args && typeof args.root === 'string' ? args.root : ''
    const sessionId = args && typeof args.sessionId === 'string' ? args.sessionId : undefined
    const patch = args && args.patch && typeof args.patch === 'object' && !Array.isArray(args.patch) ? args.patch : null
    if (!root) return { ok: false, error: '缺少工作区根目录' }
    if (!patch) return { ok: false, error: '缺少设置补丁' }
    try {
      const target = await fs.resolve(root + SETTINGS_SUFFIX)
      let merged = {}
      try {
        const text = await fs.readText(target)
        const parsed = JSON.parse(text)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) merged = parsed
      } catch (err) {
        // 旧文件不存在/损坏：以空配置为基底
      }
      merged = { ...merged, ...patch }
      await fs.writeText(target, JSON.stringify(merged, null, 2), undefined, undefined, resolveCallPolicy(sessionId))
      return { ok: true }
    } catch (err) {
      const code = err && err.code
      console.error('[dsh-prompt-polish] setSettings failed', {
        root,
        sessionId: sessionId || null,
        code: code || null,
        message: (err && err.message) || String(err),
      })
      if (code === 'FS_SANDBOX_DENIED' || code === 'FS_PERMISSION_DENIED') {
        return { ok: false, reason: 'sandbox' }
      }
      return { ok: false, error: String((err && err.message) || err) }
    }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:150-214](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/index.js#L150-L214)

Host 再裁剪上下文并选 provider。

<details>
<summary>查看原文（65行）</summary>

```text
    const withHistory = !!(args && args.withHistory === true)

    // 按 kind 分类收集（兼容旧 payload：无 kind 视为消息项）
    const { goalItem, todoItem, compactionItem, summaryItems, messageItems } = classifyHistoryItems(
      withHistory && Array.isArray(args.history) ? args.history : [],
    )
    const message30 = messageItems.slice(-30)
    const summary60 = summaryItems.slice(-60)

    // 策略选项解析与归一
    const options = normalizeOptions(args && args.options)

    let provider = null
    let model = null
    const selection = defaultModel ? defaultModel.currentSelection() : undefined
    if (selection && typeof selection.provider === 'string' && typeof selection.model === 'string') {
      provider = selection.provider
      model = selection.model
    } else {
      const providers = llm.listProviders()
      if (providers.length === 0) return { ok: false, error: '没有可用的模型服务' }
      provider = providers[0].id
      const models = await llm.listModels(provider)
      if (models.length === 0) return { ok: false, error: '没有可用的模型' }
      model = models[0].id
    }

    // 模型能力探测：能拿到上下文/输出上限就用，拿不到按保守默认（65536 / 4000）
    let ctxLen = 65536
    let modelMaxOut = MAX_OUTPUT_TOKENS
    try {
      const modelsMeta = await llm.listModels(provider)
      const meta = Array.isArray(modelsMeta) ? modelsMeta.find((m) => m && m.id === model) : null
      if (meta) {
        if (typeof meta.contextLength === 'number' && meta.contextLength > 0) ctxLen = meta.contextLength
        const outCap = typeof meta.maxTokens === 'number' ? meta.maxTokens : meta.maxOutputTokens
        if (typeof outCap === 'number' && outCap > 0) modelMaxOut = outCap
      }
    } catch (err) { /* 元数据不可用：按保守默认 */ }

    // 输入预算（字符→token 启发式：字符/2，中文偏保守）：
    // 按可用上下文倒推输入上限，超预算时丢弃最旧/最不重要的背景与消息轮
    const inputCapChars = Math.max(4000, (ctxLen - MIN_OUTPUT_TOKENS - INPUT_BUDGET_MARGIN) * 2)
    const estimateSystem = buildSystem({
      withHistory: withHistory && (goalItem !== null || todoItem !== null || compactionItem !== null || summary60.length > 0 || message30.length > 0),
      mode: options.mode,
      language: options.language,
      custom: options.custom,
    })
    let usedChars = draft.length + estimateSystem.length + 400
    const bg = []
    if (goalItem !== null && usedChars + goalItem.length <= inputCapChars) { bg.push({ kind: 'goal', text: goalItem }); usedChars += goalItem.length }
    if (todoItem !== null && usedChars + todoItem.length <= inputCapChars) { bg.push({ kind: 'todo', text: todoItem }); usedChars += todoItem.length }
    if (compactionItem !== null && usedChars + compactionItem.length <= inputCapChars) { bg.push({ kind: 'compaction-summary', text: compactionItem }); usedChars += compactionItem.length }
    for (const s of summary60) {
      if (usedChars + s.length > inputCapChars) continue
      bg.push({ kind: 'tool-summary', text: s })
      usedChars += s.length
    }
    const msgs = []
    for (const m of message30) {
      if (usedChars + m.text.length > inputCapChars) break
      msgs.push(m)
      usedChars += m.text.length
    }
```

</details>

**依据 5 · 作者声明**：[README.zh-CN.md:5-7](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/README.zh-CN.md#L5-L7)

作者披露 provider 可见性。

```text
DeepSeek Harness（DSH）输入栏提示词优化插件。点击 **优化**，将当前草稿交给 DSH 中配置的模型提供商处理，并在决定是否使用前先查看结果。

> **数据边界：** 插件不新增独立 API 端点；优化请求通过 DSH 已配置的模型提供商和模型完成。开启上下文后，请求可能包含最近消息、当前目标与任务清单、压缩摘要以及可选的工具调用结果摘要。因此，草稿和已开启的上下文对该模型提供商可见；将插件用于敏感会话前，请先查看提供商的隐私和数据留存政策。
```

#### 缺口

- 没有实际 profile 的工作区映射/沙箱策略。
  **影响**：误选工作区风险及真实数据暴露范围未量测。
  **进一步探讨**：分别在单/多工作区与沙箱拒绝场景观察设置文件路径和请求内容。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败、截断和取消的控制边界是什么？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断、新假设与验证

#### 完整回答

Host 限空白/2 万字符草稿，设置 30 秒 chunk 空闲和 120 秒总耗时；客户端点击停止会调用 cancelOptimize 并立即解除输入阻塞。输出达 max-tokens 且已有文本时返回 truncated，并在结果弹窗提示可能不完整；仍可人工采用。源码中输出预算以 1200 token 为下限，即便模型元数据 maxTokens 或剩余上下文低于 1200，也会请求 1200，可能被 provider 拒绝。流式 Promise.race 超时仅停止等待并返回错误，超时路径没有显式 controller.abort 或 iterator.return；底层模型流能否及时终止取决于宿主实现。建议隔离试用不同模型上限、慢流和取消，观察实际调用成本与资源释放。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:137-148](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/index.js#L137-L148)

输入校验与 runId。

<details>
<summary>查看原文（12行）</summary>

```text
  // ---- 提示词优化 ----
  async function optimizePrompt(args) {
    const raw = (args && typeof args.draft === 'string') ? args.draft : ''
    const draft = raw.trim()
    if (!draft) return { ok: false, error: '输入为空' }
    if (draft.length > 20000) return { ok: false, error: '提示词过长' }
    if (llm === undefined) return { ok: false, error: '没有可用的模型服务' }

    // 取消通道：客户端带 runId，可经 cancelOptimize 中止；无 runId 请求不受影响
    const runId = (args && typeof args.runId === 'string' && args.runId) ? args.runId : undefined
    const controller = new AbortController()
    if (runId) activeRuns.set(runId, controller)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:216-219](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/index.js#L216-L219)

输出预算最低 1200。

```text
    // 输出上限：模型上限、请求上限与剩余上下文三者取小，且不低于 1200
    const estInputTokens = Math.ceil(usedChars / 2)
    const available = Math.max(MIN_OUTPUT_TOKENS, ctxLen - estInputTokens - INPUT_BUDGET_MARGIN)
    const maxTokens = Math.max(MIN_OUTPUT_TOKENS, Math.floor(Math.min(MAX_OUTPUT_TOKENS, modelMaxOut, available)))
```

**依据 3 · 源码核查**：[lib/index.js:284-344](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/index.js#L284-L344)

流式超时/截断/错误路径。

<details>
<summary>查看原文（61行）</summary>

````text
    try {
      const iterator = llm.stream({
        provider, model, messages, system: requestSystem,
        temperature: options.mode === 'creative' ? 0.7 : 0.3,
        maxTokens,
        signal: controller.signal,
      })[Symbol.asyncIterator]()
      const deadline = Date.now() + TOTAL_TIMEOUT_MS
      let text = ''
      let truncated = false
      while (true) {
        if (controller.signal.aborted) {
          return { ok: false, cancelled: true, error: '已取消' }
        }
        const outcome = await Promise.race([
          iterator.next(),
          ctx.timeout(IDLE_TIMEOUT_MS).then(() => ({ __timedOut: true })),
        ])
        if (controller.signal.aborted) {
          return { ok: false, cancelled: true, error: '已取消' }
        }
        if (outcome && outcome.__timedOut === true) {
          return { ok: false, error: '优化超时：模型长时间无响应，已停止等待（请重试）' }
        }
        if (Date.now() > deadline) {
          return { ok: false, error: '优化超时：整体耗时过长，已停止等待（请重试）' }
        }
        if (outcome.done) break
        const chunk = outcome.value
        if (chunk.type === 'text-delta') text += chunk.text
        else if (chunk.type === 'finish') {
          // 用户取消：中止后流以 aborted 收尾，走独立语义（不计失败）
          if (controller.signal.aborted) {
            return { ok: false, cancelled: true, error: '已取消' }
          }
          // stop：正常完成；max-tokens/length：输出达上限被截断——有文本按截断
          // 结果采纳（truncated 标记，界面提示），无文本视为错误；
          // content-filter 等其他 reason 保持原“模型调用异常”语义
          const cls = classifyFinishReason(chunk.reason && chunk.reason.kind, text.length > 0)
          if (cls.type === 'ok') continue
          if (cls.type === 'truncated') { truncated = true; break }
          return { ok: false, error: cls.message }
        }
      }
      let result = text.trim()
      const fenced = result.match(/^```[^\n]*\n([\s\S]*?)\n?```$/)
      if (fenced) result = fenced[1].trim()
      if (!result) return { ok: false, error: '模型返回为空' }
      const out = { ok: true, text: result }
      if (truncated) out.truncated = true
      return out
    } catch (err) {
      if (controller.signal.aborted) {
        return { ok: false, cancelled: true, error: '已取消' }
      }
      console.error('[dsh-prompt-polish] optimize failed', err)
      return { ok: false, error: String((err && err.message) || err) }
    } finally {
      // 无论成功/失败/取消，清理 runId 注册，避免泄漏
      if (runId !== undefined) activeRuns.delete(runId)
    }
````

</details>

**依据 4 · 源码核查**：[lib/client.js:1181-1195](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/client.js#L1181-L1195)

客户端取消与丢弃迟到结果。

<details>
<summary>查看原文（15行）</summary>

```text
        // 停止优化：本地即刻解除冻结，取消 RPC 负责中止宿主侧流
        const cancelRun = () => {
          if (!busy) return
          cancelledRef.current = true
          const runId = activeRunRef.current ? activeRunRef.current.runId : null
          activeRunRef.current = null
          if (conversation && typeof sessionId === 'string') {
            conversation.blocks.set(sessionId, undefined)
          }
          setBusy(false)
          setInfo('已取消')
          if (runId !== null) {
            host.call('cancelOptimize', { runId }).catch(() => { /* 竞态：忽略 */ })
          }
        }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1555-1586](https://github.com/1321928757/dsh-prompt-polish/blob/c894ae3de6590542f8353b76e314656a4a3fe3a0/lib/client.js#L1555-L1586)

截断提示但可采用。

<details>
<summary>查看原文（32行）</summary>

```text
                  pending.truncated === true
                    ? React.createElement('p', { className: 'dyn-opt-result-hint' }, '已达输出上限，结果可能不完整')
                    : null,
                ),
            (!pending.failed && !canAdopt)
              ? React.createElement('p', { className: 'dyn-opt-result-hint' }, '输入已变化，未回填结果')
              : null,
            pending.failed
              ? React.createElement('div', { className: 'dyn-opt-result-actions' },
                  React.createElement('button', {
                    type: 'button',
                    className: 'dyn-opt-btn dyn-opt-btn-primary',
                    onClick: retry,
                  }, '重试'),
                  React.createElement('button', {
                    type: 'button',
                    className: 'dyn-opt-btn dyn-opt-btn-ghost',
                    onClick: () => setPending(null),
                  }, '关闭'),
                )
              : React.createElement('div', { className: 'dyn-opt-result-actions' },
                  React.createElement('button', {
                    type: 'button',
                    className: 'dyn-opt-btn dyn-opt-btn-primary',
                    disabled: !canAdopt,
                    onClick: adopt,
                  }, '采用优化结果'),
                  React.createElement('button', {
                    type: 'button',
                    className: 'dyn-opt-btn dyn-opt-btn-ghost',
                    onClick: () => setPending(null),
                  }, '保留原稿'),
```

</details>

#### 缺口

- 未调用真实 provider 且未追踪超时后的流生命周期。
  **影响**：实际费用、失败模式和取消效果未知。
  **进一步探讨**：用隔离模型 stub/小上限模型测试 maxTokens、超时和 abort 后流释放。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
