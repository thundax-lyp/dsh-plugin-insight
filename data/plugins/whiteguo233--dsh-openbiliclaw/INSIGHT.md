# OpenBiliClaw DSH

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[06dc9c8](https://github.com/whiteguo233/dsh-openbiliclaw/tree/06dc9c8b02423b0583f9cf6cfec23309a7e028db)

<!-- BEGIN META -->
[![GitHub ★ 73](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=73&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whiteguo233/dsh-openbiliclaw)
<!-- END META -->

> **功能**：把推荐、收藏、画像对话及后端设置接入DSH侧栏和模型工具

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 宿主内面板和固定工具接线，不新增推荐算法。

> **主要限制**：[Q03](#research-q03) [Q03](#research-q03) UI含真实同步和管理写操作；鉴权与取消边界在外部后端。

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
  - [Q01 · DSH插件贡献和推荐引擎怎样分界？](#detail-section-11)
  - [Q02 · 工具、网络与用户状态怎样连接？](#detail-section-12)
  - [Q03 · 哪些权限与副作用超出面板便利？](#detail-section-13)
  - [Q04 · 部署、费用与退出要做什么？](#detail-section-14)
  - [Q05 · 怎样证伪集成提高体验？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：OpenBiliClaw用户希望在DSH内消费推荐、反馈和管理收藏。

切独立后端页面或手工API。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| HTTP工具桥 | 将推荐、画像、反馈和本地收藏命令交后台 | Host无独立推荐引擎；请求超时不回滚 |
| 消费及同步面板 | 同宿主推荐、对话、收藏和同步任务状态 | UI直连可覆盖Host地址，账号动作在后端 |
| 布局与设置 | 保留侧栏空间并配置后台 | 涉及重启/初始化管理；DOM卸载不取消任务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH^0.2.1-rc.2及Web服务注入 | 面板必需 | 渲染器/主题/侧栏/布局 | 其他宿主版本需核 |
| 可运行可信OpenBiliClaw serve-api | 必需 | 推荐、画像、聊天、同步 | 服务不可用抛错，插件不能离线生成 |
| 自己的workdir/skillPath | Skill注册 | 加载外部adapter契约 | 默认作者路径须改，缺文件只跳Skill |
| 后端模型/账号/鉴权 | 按功能 | 推荐及真实同步与管理 | 独立配置和授权，组件不实现认证隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 统一Host row和面板localStorage地址，校验后端版本 | 先无账号测试数据 |
| 消费写入 | 看推荐/反馈和task_id，核同步terminal后刷新 | 超时先后台查状态，不盲重试 |
| 管理退出 | 备份核实后用更新/重建；卸载恢复DOM | 后台任务和数据库/凭据另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | DSH和独立后端运行资源未知 | 配置地址、契约、账号和测试数据耗时未知 | 首次准备费用与耗时未知 |
| 持续 | 后台模型/推荐/画像、WS/轮询资源未知 | 复核反馈和部分同步失败耗时未知 | 真实用量及净便利未测 |
| 恢复 | 后台task、模型调用和数据留存未知 | 停止任务、撤凭据、清localStorage及核布局耗时未知 | 卸载不回滚同步/重建，恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集成接线 | 工具实际HTTP、面板REST与轮询存在 | 体验步骤和完成率未测 |
| 失败展示 | HTTP错误与乐观回退可查 | 后台成功但请求失败的一致性未验 |
| 退出 | 恢复DOM样式、移除observer | 后台任务取消与数据回滚不由此保证 |

> **思考**：[Q03](#research-q03) [Q03](#research-q03) UI含真实同步和管理写操作；鉴权与取消边界在外部后端。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 宿主内面板和固定工具接线，不新增推荐算法。

HTTP、同步轮询、乐观回退、管理操作和DOM退出均已核内部实现。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) [Q03](#research-q03) UI含真实同步和管理写操作；鉴权与取消边界在外部后端。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) [Q04](#research-q04) 仅可信本机测试后端，统一地址，写操作先核后台状态与备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的核对消费端插件的推荐反馈链、真实同步副作用与后台依赖。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/client/library.tsx、src/client/settings.tsx、src/bridge.ts、src/client/api.ts、src/client/dialogue.tsx、package.json、src/client/layout.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的核对消费端插件的推荐反馈链、真实同步副作用与后台依赖。未执行目标代码或实际宿主验证。
- 下一步：保留同后端任务、请求ID、数据变化与用户观察，按错误副作用停用

**分析版本**

- **仓库**：[whiteguo233/dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw)
- **版本号**：0.6.4（[固定提交 06dc9c8](https://github.com/whiteguo233/dsh-openbiliclaw/tree/06dc9c8b02423b0583f9cf6cfec23309a7e028db)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) [Q05](#research-q05) 集成便利需同后端对照，当前没有体验收益证据。

保留同后端任务、请求ID、数据变化与用户观察，按错误副作用停用

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 528 | — | — | 6097 |
| .js | source | 24 | 15322 | 13861 | 1510 | — |
| .ts | source | 13 | 3544 | 2739 | 575 | — |
| .tsx | source | 10 | 4819 | 4214 | 352 | — |
| .mjs | test | 2 | 529 | 424 | 57 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/whiteguo233/dsh-openbiliclaw/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对消费端插件的推荐反馈链、真实同步副作用与后台依赖

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH插件贡献和推荐引擎怎样分界？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根组件为同时包含Host工具桥和Web面板的plugin。已有OpenBiliClaw后端用户可在DSH侧栏看推荐、收藏、画像、对话与设置，Agent通过固定命令工具读推荐、反馈和本地收藏。推荐生成、画像推断及平台爬取属于外部后端，不是本仓算法成果。相比切换独立页面/手写API，这里增加宿主面板、工具参数和反馈接线。虽然Host工具不暴露sync-account/sync-saved，浏览器确有收藏同步和后端管理操作，不能把整个包说成只读或绝不管平台数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-25](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/index.ts#L1-L25)

Host定位与工具不含同步

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * OpenBiliClaw DeepSeek Harness plugin — node half.
 *
 * Registers the agent-bridge tool set (recommend / delight / probes / chat /
 * profile / saved / feedback — the user-consumption loop) and the canonical
 * openbiliclaw-adapter skill, so the DSH agent can operate a running
 * OpenBiliClaw backend in a closed loop. Crawling/source-management features
 * are intentionally NOT exposed: the bridge's sync-account / sync-saved
 * commands are absent here.
 *
 * The row config is the single source of truth for the backend address. The
 * tools use it directly; the browser half reads it back from
 * {@link CONNECTION_ROUTE} on first load, so the panel and the tools target
 * the same backend instead of the panel silently falling back to its built-in
 * default. An address saved in the panel's own settings still wins.
 *
 * Config (row config in cordis.patch.yml; all optional):
 *   apiUrl         OpenBiliClaw serve-api base URL (default: http://127.0.0.1:8420)
 *   workdir        OpenBiliClaw checkout dir (config.toml + data live here; default: /Users/white/workspace/OpenBiliClaw)
 *   skillPath      adapter SKILL.md path (default: <workdir>/skills/openbiliclaw-adapter/SKILL.md)
 *   timeoutMs      per-command budget in ms (default 300000)
 * @module @openbiliclaw/dsh-plugin
 */
import { readFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
```

</details>

**依据 2 · 源码核查**：[src/client/library.tsx:316-344](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/library.tsx#L316-L344)

UI实际提交收藏同步

<details>
<summary>查看原文（29行）</summary>

```text
  const runSync = useCallback(async (itemKeys: string[]) => {
    if (syncing || removing !== '') return
    setSyncing(true)
    setSyncError('')
    setSyncResults(null)
    setSyncMessage(itemKeys.length === 0 ? '正在提交同步任务…' : '正在同步这条内容…')
    try {
      const batch = await syncSavedItems(base, listKind, itemKeys)
      if (!mountedRef.current) return
      setSyncResults(batch.items)
      if (batch.items.length === 0) {
        setSyncing(false)
        setSyncMessage('没有需要同步的条目。')
        await reload()
      } else if (batch.items.every(item => SYNC_TERMINAL_STATUSES.has(item.status))) {
        setSyncing(false)
        setSyncMessage(syncResultSummary(batch.items))
        await reload()
      } else {
        setSyncMessage(`同步任务已提交 · ${batch.items.length} 项`)
        void pollTask(batch.task_id)
      }
    } catch (err) {
      if (!mountedRef.current) return
      setSyncing(false)
      setSyncMessage('')
      setSyncError(err instanceof Error ? err.message : String(err))
    }
  }, [base, listKind, pollTask, reload, removing, syncing])
```

</details>

**依据 3 · 源码核查**：[src/client/settings.tsx:1254-1278](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/settings.tsx#L1254-L1278)

UI实际重新初始化入口

<details>
<summary>查看原文（25行）</summary>

```text
  }, [base, toast])

  const reinit = useCallback(async () => {
    if (!init.loaded || init.running || !init.initialized) return
    const confirmed = window.confirm(
      '将重新拉取所选平台的数据、重建完整画像并补足首轮发现池。现有推荐池会按新画像清空重建；现有事件、收藏、对话历史与手动编辑保留。重新初始化前会自动创建备份（数据库 + 画像/认知层）到 data/backups/。并消耗较多 AI 调用。继续吗？' +
      (resetCognition ? '\n\n已勾选「同时清空旧认知观察与洞察」：旧的 LLM 观察笔记与洞察将被删除（已包含在自动备份中），本轮重新生成。' : ''),
    )
    if (!confirmed) return
    setReinitBusy(true)
    try {
      const payload: { force: boolean; reset_cognition?: boolean; llm_concurrency?: number; init_timeout_minutes?: number } = { force: true }
      if (resetCognition) payload.reset_cognition = true
      const concurrency = reinitLlmConcurrency
      if (Number.isFinite(concurrency) && concurrency >= 1) payload.llm_concurrency = concurrency
      const timeoutMinutes = reinitInitTimeoutMinutes
      if (Number.isFinite(timeoutMinutes) && timeoutMinutes >= 1 && timeoutMinutes <= 1440) payload.init_timeout_minutes = timeoutMinutes
      await startInit(base, payload)
      toast('重新初始化已开始，正在重新拉取数据并重建画像')
      setInit(prev => ({ ...prev, running: true, currentStage: 1, totalStages: prev.totalStages || 4 }))
    } catch (err) {
      toast('重新初始化没能启动：' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setReinitBusy(false)
    }
```

</details>

#### 缺口

- 后端推荐质量、画像准确及本轮完整UI呈现未运行
  **影响**：不能从猜测分数或卡片存在推个性化效果，管理操作也需单独验收
  **进一步探讨**：用脱敏测试后端验推荐、反馈和同步实际状态，另做推荐效果对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具、网络与用户状态怎样连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host resolveConfig给apiUrl默认127.0.0.1:8420、timeout300000；每工具不spawn CLI，而向/api/agent-bridge POST{command,argv}，超时abort、HTTP非2xx或ok非true抛错误。工具按schema构造argv，写反馈要求稳定requestId，但幂等落实在后端。浏览器先同源bootstrap取Host地址，localStorage保存地址优先，可能与Agent的Host地址分叉；REST直连后端credentials:omit、默认15s超时并整理错误。收藏同步POST保存列表sync得到task_id，每1.5s轮询至terminal再刷新，出错停止轮询并显示error。画像假设按钮乐观更新，响应state/verdict优先，失败回原turn状态；不是已持久化证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/bridge.ts:80-99](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/bridge.ts#L80-L99)

HTTP桥真实请求与超时错误

<details>
<summary>查看原文（20行）</summary>

```text
      const timer = setTimeout(() => controller.abort(), config.timeoutMs)
      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ command, argv: args }),
          signal: controller.signal,
        })
        const text = await resp.text()
        if (!resp.ok) {
          throw new Error(`openbiliclaw bridge HTTP ${resp.status}: ${text.slice(-1500)}`)
        }
        const reply = parseBridgeLine(text)
        return reply.data as JsonValue
      } finally {
        clearTimeout(timer)
      }
    },
  }
}
```

</details>

**依据 2 · 源码核查**：[src/client/api.ts:23-52](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/api.ts#L23-L52)

浏览器地址优先级

<details>
<summary>查看原文（30行）</summary>

```text
 * Adopt the host row's backend address as the fallback for {@link readApiBase}.
 * @param base - address from the host bootstrap route, or null.
 */
export function setHostApiBase(base: string | null): void {
  const trimmed = base?.trim() ?? ''
  hostApiBase = trimmed === '' ? null : trimmed.replace(/\/+$/, '')
}

/**
 * Read the API base URL: the panel's own saved setting first, then the host
 * row's configured address, then the built-in default.
 */
export function readApiBase(): string {
  try {
    const saved = localStorage.getItem(API_BASE_KEY)
    if (saved !== null && saved.trim() !== '') return saved.trim().replace(/\/+$/, '')
  } catch {
    // localStorage unavailable (private mode etc.) — fall through.
  }
  return hostApiBase ?? DEFAULT_API_BASE
}

/** Persist the API base URL. */
export function writeApiBase(base: string): void {
  try {
    localStorage.setItem(API_BASE_KEY, base.trim().replace(/\/+$/, ''))
  } catch {
    // ignore persistence failures
  }
}
```

</details>

**依据 3 · 源码核查**：[src/client/api.ts:334-358](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/api.ts#L334-L358)

直连凭据与请求处理

<details>
<summary>查看原文（25行）</summary>

```text
export async function requestJson(
  base: string,
  path: string,
  options: { method?: string; body?: unknown; headers?: Record<string, string>; timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<unknown> {
  const { method = 'GET', body, headers, timeoutMs = 15_000, signal } = options
  const timeout = withTimeout(timeoutMs, signal)
  try {
    const res = await fetch(`${base}${path}`, {
      method,
      credentials: 'omit',
      signal: timeout.signal,
      headers: body === undefined && headers === undefined ? undefined : { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    if (!res.ok) {
      let detail: unknown = null
      try { detail = await res.json() } catch { detail = null }
      throw new ApiError(path, res.status, detail)
    }
    return res.json()
  } finally {
    timeout.cleanup()
  }
}
```

</details>

**依据 4 · 源码核查**：[src/client/library.tsx:283-311](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/library.tsx#L283-L311)

同步轮询真实状态

<details>
<summary>查看原文（29行）</summary>

```text
  const pollTask = useCallback(async (taskId: string) => {
    while (mountedRef.current) {
      await new Promise<void>(resolve => {
        pollTimerRef.current = window.setTimeout(resolve, 1500)
      })
      if (!mountedRef.current) return
      try {
        const batch = await pollSavedSyncTask(base, taskId)
        if (!mountedRef.current) return
        setSyncResults(batch.items)
        if (batch.items.length === 0) {
          setSyncing(false)
          setSyncMessage('没有需要同步的条目。')
          await reload()
          return
        }
        if (batch.items.every(item => SYNC_TERMINAL_STATUSES.has(item.status))) {
          setSyncing(false)
          setSyncMessage(syncResultSummary(batch.items))
          await reload()
          return
        }
        setSyncMessage(`正在同步 ${batch.items.length} 项…`)
      } catch (err) {
        if (!mountedRef.current) return
        setSyncing(false)
        setSyncMessage('')
        setSyncError(err instanceof Error ? err.message : String(err))
        return
```

</details>

**依据 5 · 源码核查**：[src/client/dialogue.tsx:162-183](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/dialogue.tsx#L162-L183)

乐观更新与失败回退

<details>
<summary>查看原文（22行）</summary>

```text

  const act = useCallback(async (action: string) => {
    setBusy(action)
    // Optimistic flip, then let the response state/verdict be authoritative.
    setState(OPTIMISTIC_STATE[action] ?? cardState(turn))
    try {
      const response = await actOnChatCard(base, turn.turn_id, action)
      const verdict = typeof response === 'object' && response !== null
        ? String((response as Record<string, unknown>).state ?? (response as Record<string, unknown>).verdict ?? '').toLowerCase()
        : ''
      if (verdict !== '') setState(verdict)
      if (action === 'discuss') onDiscuss(turn)
      onChanged()
    } catch (err) {
      setState(cardState(turn))
      onError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy('')
    }
  }, [base, onChanged, onDiscuss, onError, turn])

  return (
```

</details>

#### 缺口

- 跨UI与工具同一后端、请求超时后的真实持久化和幂等未运行
  **影响**：界面回滚或请求失败可能后台已写，重试不能假定无重复效果
  **进一步探讨**：固定Host/面板地址，复用同动作requestId并在后台核任务状态后重试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些权限与副作用超出面板便利？

**研究主题**：缺陷与关键质疑

#### 完整回答

本仓没有提供后端认证中间件；Host桥只发Content-Type，浏览器credentials:omit也不代表服务端访问控制，安全边界须看后端。地址可自定义，不限定本机，个人画像、聊天与账号数据可能发向所配服务。设置页不仅展示，还连接LAN密码管理、自启动、后端更新和强制重初始化；更新有window.confirm，重初始化提示较多AI调用与可清旧认知，但备份/保留行为是前端文案，外部后端不在本固定源码内不能核实。关闭面板/abort请求不能取消已接受同步或重建；真实收藏及账号侧效果需后台核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/settings.tsx:1033-1043](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/settings.tsx#L1033-L1043)

后端更新确认后请求

<details>
<summary>查看原文（11行）</summary>

```text
  const apply = useCallback(async () => {
    const tag = update?.latestTag ?? ''
    if (!window.confirm(`将后端更新到 ${tag !== '' ? tag : '最新版本'}，更新完成后后端会自动重启。继续吗？`)) return
    setUpdateBusy('apply')
    try {
      await applyBackendUpdate(base, tag)
      toast('后端更新已开始，稍后会重启')
      const status = await fetchUpdateStatus(base)
      setUpdate({
        current: status.current_version,
        latest: status.latest_version !== '' ? status.latest_version : status.latest_tag,
```

</details>

**依据 2 · 源码核查**：[src/client/settings.tsx:1222-1278](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/settings.tsx#L1222-L1278)

密码、自启动和重建调用

<details>
<summary>查看原文（57行）</summary>

```text
  const saveAuth = useCallback(async () => {
    if (authEnabled && authPassword.trim() === '') {
      toast('启用局域网访问密码时必须填写密码')
      return
    }
    setAuthBusy(true)
    try {
      const ok = await setLanAuth(base, authEnabled, authPassword.trim())
      if (!ok) throw new Error('后端拒绝了密码设置')
      toast('密码设置已保存。')
      setAuthPassword('')
      const status = await fetchAuthStatus(base)
      setAuth({ loaded: true, enabled: status.enabled })
      setAuthEnabled(status.enabled)
    } catch (err) {
      toast('密码设置失败：' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setAuthBusy(false)
    }
  }, [authEnabled, authPassword, base, toast])

  const toggleAutostart = useCallback(async (enabled: boolean) => {
    setAutostart(prev => ({ ...prev, busy: true }))
    try {
      const ok = await applyAutostart(base, enabled)
      if (!ok) throw new Error('后端拒绝了开机自启动设置')
      setAutostart(prev => ({ ...prev, busy: false, enabled }))
      toast(enabled ? '开机自启动已开启。' : '开机自启动已关闭。')
    } catch (err) {
      setAutostart(prev => ({ ...prev, busy: false }))
      toast('设置失败：' + (err instanceof Error ? err.message : String(err)))
    }
  }, [base, toast])

  const reinit = useCallback(async () => {
    if (!init.loaded || init.running || !init.initialized) return
    const confirmed = window.confirm(
      '将重新拉取所选平台的数据、重建完整画像并补足首轮发现池。现有推荐池会按新画像清空重建；现有事件、收藏、对话历史与手动编辑保留。重新初始化前会自动创建备份（数据库 + 画像/认知层）到 data/backups/。并消耗较多 AI 调用。继续吗？' +
      (resetCognition ? '\n\n已勾选「同时清空旧认知观察与洞察」：旧的 LLM 观察笔记与洞察将被删除（已包含在自动备份中），本轮重新生成。' : ''),
    )
    if (!confirmed) return
    setReinitBusy(true)
    try {
      const payload: { force: boolean; reset_cognition?: boolean; llm_concurrency?: number; init_timeout_minutes?: number } = { force: true }
      if (resetCognition) payload.reset_cognition = true
      const concurrency = reinitLlmConcurrency
      if (Number.isFinite(concurrency) && concurrency >= 1) payload.llm_concurrency = concurrency
      const timeoutMinutes = reinitInitTimeoutMinutes
      if (Number.isFinite(timeoutMinutes) && timeoutMinutes >= 1 && timeoutMinutes <= 1440) payload.init_timeout_minutes = timeoutMinutes
      await startInit(base, payload)
      toast('重新初始化已开始，正在重新拉取数据并重建画像')
      setInit(prev => ({ ...prev, running: true, currentStage: 1, totalStages: prev.totalStages || 4 }))
    } catch (err) {
      toast('重新初始化没能启动：' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setReinitBusy(false)
    }
```

</details>

**依据 3 · 源码核查**：[src/client/api.ts:1198-1247](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/api.ts#L1198-L1247)

管理API操作

<details>
<summary>查看原文（50行）</summary>

```text
  return {
    ok: row.ok === true,
    provider: str(row.provider),
    model: str(row.model),
    message: str(row.message),
    error: str(row.error),
    latencyMs: num(row.latency_ms),
  }
}

/** List models for one submitted instance without saving config.toml. */
export async function discoverConfigModels(
  base: string,
  instanceId: string,
  config: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<ModelDiscoveryResult> {
  const data = await requestJson(base, '/api/config/discover-models', {
    method: 'POST',
    timeoutMs: 60_000,
    signal,
    body: { instance_id: instanceId, config },
  })
  const row = typeof data === 'object' && data !== null ? data as Record<string, unknown> : {}
  const models = Array.isArray(row.models) ? row.models.map(item => String(item)) : []
  const reasoningEfforts = Array.isArray(row.reasoning_efforts) ? row.reasoning_efforts.map(item => String(item)) : []
  return {
    ok: row.ok === true,
    models,
    reasoningEfforts,
    error: str(row.error),
  }
}

/** Read the LAN password-gate status. */
export async function fetchAuthStatus(base: string, signal?: AbortSignal): Promise<{ enabled: boolean }> {
  const data = await requestJson(base, '/api/auth/status', { timeoutMs: 10_000, signal })
  const row = typeof data === 'object' && data !== null ? data as Record<string, unknown> : {}
  return { enabled: row.enabled === true }
}

/** Enable/disable the LAN password gate (local-only admin surface). */
export async function setLanAuth(base: string, enabled: boolean, password: string, signal?: AbortSignal): Promise<boolean> {
  const data = await requestJson(base, '/api/auth/admin', {
    method: 'POST',
    timeoutMs: 15_000,
    signal,
    headers: { 'X-OBC-Auth': '1' },
    body: enabled ? { enabled: true, password } : { enabled: false },
  })
```

</details>

**依据 4 · 源码核查**：[src/bridge.ts:89-99](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/bridge.ts#L89-L99)

工具桥未附独立认证

<details>
<summary>查看原文（11行）</summary>

```text
        if (!resp.ok) {
          throw new Error(`openbiliclaw bridge HTTP ${resp.status}: ${text.slice(-1500)}`)
        }
        const reply = parseBridgeLine(text)
        return reply.data as JsonValue
      } finally {
        clearTimeout(timer)
      }
    },
  }
}
```

</details>

#### 缺口

- 外部后端鉴权、备份、账号同步权限和已提交任务取消不在组件内验证
  **影响**：不能将本插件UI提示当授权隔离、可回滚或备份已成功的证据
  **进一步探讨**：仅可信本机测试服务起步，独立核后端认证/备份，管理员操作前保留数据库与配置

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、费用与退出要做什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

DSH要求^0.2.1-rc.2的Web注入服务，Host另需tools/skills，webServer可选；没有后端时面板和工具都不能产推荐。workdir默认作者本机绝对目录，需改为自己的checkout并配置skillPath；缺Skill只warn跳过注册，工具仍在。浏览器保存API地址会覆盖Host row，首次应统一检查。DOM侧通过frame padding保留侧栏空间，dispose恢复记录的paddingRight/boxSizing/position、移除column/handle并断observer；这不回滚后台数据。持续成本由后端推荐/画像/聊天的模型、同步账号和轮询产生，插件未核金额。退出先查后台同步/初始化任务，停止或保留相应后端，撤账号/模型凭据，再卸载插件；清localStorage地址和面板状态，后端数据另按保留策略处理。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-38](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/package.json#L23-L38)

DSH客户端兼容线

<details>
<summary>查看原文（16行）</summary>

```text
  "engines": {
    "dsh": "^0.2.1-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:63-82](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/index.ts#L63-L82)

配置默认与目录

<details>
<summary>查看原文（20行）</summary>

```text
      ? config.apiUrl
      : 'http://127.0.0.1:8420',
    workdir,
    skillPath: config?.skillPath?.trim() !== '' && config?.skillPath !== undefined
      ? config.skillPath
      : `${workdir}/skills/openbiliclaw-adapter/SKILL.md`,
    timeoutMs: typeof config?.timeoutMs === 'number' && config.timeoutMs > 0 ? config.timeoutMs : 300_000,
  }
}

/**
 * Answer the browser half's bootstrap request with the resolved backend
 * address. GET/HEAD only; no secrets are exposed (the address is already
 * visible to anyone who can reach the panel).
 * @param config - the resolved bridge config.
 * @param req - incoming request.
 * @param res - response to complete.
 */
export function serveConnection(config: BridgeConfig, req: IncomingMessage, res: ServerResponse): void {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:99-116](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/index.ts#L99-L116)

Skill缺失降级

<details>
<summary>查看原文（18行）</summary>

```text
export function apply(ctx: Context, config?: OpenBiliClawRowConfig): void {
  const resolved = resolveConfig(config)
  const bridge = createBridge(resolved)
  const logger = ctx.logger('openbiliclaw')
  ctx.effect(() => registerBridgeTools(ctx, bridge), 'openbiliclaw: bridge tools')

  // The adapter skill is read synchronously at activation: the file lives in
  // the checkout and is the canonical contract the bridge tools implement.
  let skillText: string | null = null
  try {
    skillText = readFileSync(resolved.skillPath, 'utf8')
  } catch {
    logger.warn('adapter SKILL.md not found at %s — skill registration skipped', resolved.skillPath)
  }
  if (skillText !== null) {
    const skill = loadAdapterSkill(skillText, resolved.skillPath)
    ctx.effect(() => ctx.skills.register(skill), 'openbiliclaw: adapter skill')
  }
```

</details>

**依据 4 · 源码核查**：[src/client/layout.ts:439-468](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/layout.ts#L439-L468)

实际DOM恢复

<details>
<summary>查看原文（30行）</summary>

```text
  /** Detach from the frame, restoring every style this controller wrote. */
  private detach(): void {
    this.restoreFrameStyles()
    this.styleObserver?.disconnect()
    this.styleObserver = null
    this.sizeObserver?.disconnect()
    this.sizeObserver = null
    for (const dispose of this.disposers) dispose()
    this.disposers = []
    this.column?.remove()
    this.handle?.remove()
    this.frame = null
    this.column = null
    this.handle = null
  }

  /** Put the frame's inline style back exactly as the host left it. */
  private restoreFrameStyles(): void {
    const frame = this.frame
    if (frame === null) return
    if (frame.style.paddingRight !== this.shellStyle.paddingRight) frame.style.paddingRight = this.shellStyle.paddingRight
    if (frame.style.boxSizing !== this.shellStyle.boxSizing) frame.style.boxSizing = this.shellStyle.boxSizing
    if (frame.style.position !== this.shellStyle.position) frame.style.position = this.shellStyle.position
  }

  /** Detach everything (plugin unload). */
  dispose(): void {
    this.waitObserver?.disconnect()
    this.waitObserver = null
    this.detach()
```

</details>

**依据 5 · 源码核查**：[src/client/api.ts:866-885](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/api.ts#L866-L885)

同步任务与poll端点

<details>
<summary>查看原文（20行）</summary>

```text
export async function syncSavedItems(
  base: string,
  listKind: 'favorite' | 'watch_later',
  itemKeys: string[] = [],
  signal?: AbortSignal,
): Promise<SavedSyncBatch> {
  const data = await requestJson(base, `/api/saved/${listKind}/sync`, {
    method: 'POST',
    body: { item_keys: itemKeys.map(key => key.trim()).filter(key => key !== '') },
    timeoutMs: 20_000,
    signal,
  })
  return toSyncBatch(data)
}

/** GET /api/saved-sync/tasks/{task_id} — poll one durable native-sync batch. */
export async function pollSavedSyncTask(base: string, taskId: string, signal?: AbortSignal): Promise<SavedSyncBatch> {
  const data = await requestJson(base, `/api/saved-sync/tasks/${encodeURIComponent(taskId.trim())}`, { timeoutMs: 15_000, signal })
  return toSyncBatch(data)
}
```

</details>

#### 缺口

- 本轮未装宿主/后端，DOM冲突、真实费用、后台任务终止和退出耗时未测
  **影响**：不能保证换版本仍正确恢复布局或卸载即止费/撤账号效果
  **进一步探讨**：先用隔离DSH和无真实账号数据的后端，验证地址分叉、失败反馈、同步与卸载布局

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪集成提高体验？

**研究主题**：新假设与验证

#### 完整回答

固定相同后端和用户任务，比较独立OpenBiliClaw页面与DSH面板，记录找推荐、反馈、收藏的完成率及人工步骤；推荐内容相同，不能把后端提升归因插件。注入地址分叉、超时但后台成功、同步部分失败、关闭面板时后台运行和布局变更。若错写到另一个后端、重复反馈或退出后任务不可控，则停用相应写功能，回独立后端界面核状态。画像/心理推断需独立准确性与用户理解验证，不由分数UI得出。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/api.ts:23-52](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/api.ts#L23-L52)

地址覆盖可构造对照

<details>
<summary>查看原文（30行）</summary>

```text
 * Adopt the host row's backend address as the fallback for {@link readApiBase}.
 * @param base - address from the host bootstrap route, or null.
 */
export function setHostApiBase(base: string | null): void {
  const trimmed = base?.trim() ?? ''
  hostApiBase = trimmed === '' ? null : trimmed.replace(/\/+$/, '')
}

/**
 * Read the API base URL: the panel's own saved setting first, then the host
 * row's configured address, then the built-in default.
 */
export function readApiBase(): string {
  try {
    const saved = localStorage.getItem(API_BASE_KEY)
    if (saved !== null && saved.trim() !== '') return saved.trim().replace(/\/+$/, '')
  } catch {
    // localStorage unavailable (private mode etc.) — fall through.
  }
  return hostApiBase ?? DEFAULT_API_BASE
}

/** Persist the API base URL. */
export function writeApiBase(base: string): void {
  try {
    localStorage.setItem(API_BASE_KEY, base.trim().replace(/\/+$/, ''))
  } catch {
    // ignore persistence failures
  }
}
```

</details>

**依据 2 · 源码核查**：[src/client/library.tsx:316-344](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/library.tsx#L316-L344)

任务状态可核

<details>
<summary>查看原文（29行）</summary>

```text
  const runSync = useCallback(async (itemKeys: string[]) => {
    if (syncing || removing !== '') return
    setSyncing(true)
    setSyncError('')
    setSyncResults(null)
    setSyncMessage(itemKeys.length === 0 ? '正在提交同步任务…' : '正在同步这条内容…')
    try {
      const batch = await syncSavedItems(base, listKind, itemKeys)
      if (!mountedRef.current) return
      setSyncResults(batch.items)
      if (batch.items.length === 0) {
        setSyncing(false)
        setSyncMessage('没有需要同步的条目。')
        await reload()
      } else if (batch.items.every(item => SYNC_TERMINAL_STATUSES.has(item.status))) {
        setSyncing(false)
        setSyncMessage(syncResultSummary(batch.items))
        await reload()
      } else {
        setSyncMessage(`同步任务已提交 · ${batch.items.length} 项`)
        void pollTask(batch.task_id)
      }
    } catch (err) {
      if (!mountedRef.current) return
      setSyncing(false)
      setSyncMessage('')
      setSyncError(err instanceof Error ? err.message : String(err))
    }
  }, [base, listKind, pollTask, reload, removing, syncing])
```

</details>

**依据 3 · 源码核查**：[src/client/dialogue.tsx:162-183](https://github.com/whiteguo233/dsh-openbiliclaw/blob/06dc9c8b02423b0583f9cf6cfec23309a7e028db/src/client/dialogue.tsx#L162-L183)

乐观失败可测

<details>
<summary>查看原文（22行）</summary>

```text

  const act = useCallback(async (action: string) => {
    setBusy(action)
    // Optimistic flip, then let the response state/verdict be authoritative.
    setState(OPTIMISTIC_STATE[action] ?? cardState(turn))
    try {
      const response = await actOnChatCard(base, turn.turn_id, action)
      const verdict = typeof response === 'object' && response !== null
        ? String((response as Record<string, unknown>).state ?? (response as Record<string, unknown>).verdict ?? '').toLowerCase()
        : ''
      if (verdict !== '') setState(verdict)
      if (action === 'discuss') onDiscuss(turn)
      onChanged()
    } catch (err) {
      setState(cardState(turn))
      onError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy('')
    }
  }, [base, onChanged, onDiscuss, onError, turn])

  return (
```

</details>

#### 缺口

- 没有本轮体验对照、推荐质量或同步实测
  **影响**：不能宣称减少步骤、改善画像或可靠同步
  **进一步探讨**：保留同后端任务、请求ID、数据变化与用户观察，按错误副作用停用

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
