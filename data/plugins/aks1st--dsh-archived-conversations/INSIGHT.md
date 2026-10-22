# dsh-archived-conversations

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[cb1afc3](https://github.com/AKS1st/dsh-archived-conversations/tree/cb1afc38e44c58da2d3e50954b83430cac6e1c12)

<!-- BEGIN META -->
[![npm 30d 804](https://img.shields.io/static/v1?label=npm+30d&message=804&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-archived-conversations) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-archived-conversations)
<!-- END META -->

> **实现功能**：在DSH设置页列归档会话并只读预览最近六条用户/助手文本，不切换或恢复会话。

> **核心亮点**：不绕domain状态owner增加归档辨认入口。详见[Q01](#research-q01)。

> **风险与缺陷**：小预览仍全读日志，归档成员只读前核，客户端无请求序号可错配标题/正文，限本地HTTP。详见[Q03](#research-q03)。

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
  - [Q01 · 归档预览提供什么能力？](#detail-section-11)
  - [Q02 · 列表到预览请求怎样工作？](#detail-section-12)
  - [Q03 · 来源检查和异步状态有哪些边界？](#detail-section-13)
  - [Q04 · 工程证据和成本如何判断？](#detail-section-14)
  - [Q05 · 适合怎样采用，进一步探讨什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地用户辨认归档曾讨论内容。详见[Q01](#research-q01)。

手工看归档日志或宿主阅读入口，预览便利不等恢复API。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 归档列表 | 找旧对话 | 宿主hooks |
| 六条文本预览 | 快速辨认 | 全日志读/截断 |
| 本地守卫 | 限制范围 | 非多用户认证 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| webServer匹配host字段 | 来源检查 | 仅本地HTTP支持面 |
| registry archived IDs | 范围 | 非用户认证 |
| sessionQuery | 全日志读取 | 长档案/慢调用 |
| settings hooks/React | 列表预览 | ABI/旧响应 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 设置页选归档 | 用户 | 本机可信入口 |
| 看标题与预览 | 用户 | 六条非完整全文 |
| 快切核归属 | 用户 | 正文确为选中项 |
| 需恢复走宿主 | 用户 | 不直接改domain |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配web profile/local HTTP | 核ID/归档/面板 | 需匹配web/local HTTP/归档ID；准备工时未知 |
| 持续使用 | 全日志读取与列表渲染；无新增模型调用 | 检查预览归属与敏感文本 | 无额外模型调用或持久副本；全日志/无分页列表延迟未知 |
| 失败恢复 | 原宿主归档 | 回列表核错配，不改domain | 不改domain但网页/截图可暴露敏感文本；纠错工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 归档可辨认 | 标题与六条文本 | 非全文/恢复 |
| 少暴露正文 | 400字符纯文本 | 非秘密脱敏 |
| 不扰当前会话 | 只读route | 异步归属需核 |

> **思考**：小预览仍全读日志，归档成员只读前核，客户端无请求序号可错配标题/正文，限本地HTTP。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：不绕domain状态owner增加归档辨认入口。详见[Q01](#research-q01)。

不绕domain状态owner增加归档辨认入口。详见[Q01](#research-q01)。

小型只读入口、真实peer/成员与固定错误可借鉴，需请求时序与有界读取。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

小预览仍全读日志，归档成员只读前核，客户端无请求序号可错配标题/正文，限本地HTTP。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本地HTTP单用户只读辨认可试用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只读与来源/归档成员守卫可查；全量读取和旧请求覆盖仍有具体边界。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.js、tests/host.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整host、client列表/预览交互、72行mock测试与README，不重建lib。
- 下一步：进一步从A慢B快/取消归档/大档案/HTTPS研究读取与归属。

**分析版本**

- **仓库**：[AKS1st/dsh-archived-conversations](https://github.com/AKS1st/dsh-archived-conversations)
- **版本号**：0.3.2（[固定提交 cb1afc3](https://github.com/AKS1st/dsh-archived-conversations/tree/cb1afc38e44c58da2d3e50954b83430cac6e1c12)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究有限倒序读取、成员版本与请求序号/abort，比较错配与读取峰值。当前未验证。详见[Q05](#research-q05)。

进一步从A慢B快/取消归档/大档案/HTTPS研究读取与归属。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 987 | 779 | 196 | — |
| .md | source | 1 | 70 | — | — | 1007 |
| .ts | source | 1 | 270 | 188 | 64 | — |
| .ts | test | 1 | 72 | 65 | 3 | — |
| .mjs | source | 1 | 30 | 29 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dsh-archived-conversations/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dsh-archived-conversations/issues?q=is%3Aissue+created%3A2026-09-22T06%3A41%3A28.266Z..2026-10-22T06%3A41%3A28.266Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dsh-archived-conversations/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A41%3A28.266Z..2026-10-22T06%3A41%3A28.266Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**受限归档预览怎样在不改宿主状态下提供阅读，其范围/归属/读取成本如何？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 归档预览提供什么能力？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

在DSH Web设置页列归档会话标题/时间，点击查看最近六条真实user或assistant纯文本，每条400 UTF16 code units再加省略号；它不切当前会话、不恢复、不写会话状态。适合归档后只想辨认曾讨论内容的个人用户，不是全量检索、导出或恢复归档。贡献是在尊重宿主工作区状态owner的前提下增加受限阅读入口，较直接改domain state降低侵入。

README“无unarchive API”是固定作者宿主理解，本次不核当前DSH全部版本，不将其当永恒产品限制；“安全审核”也是作者报告，推荐只用可查代码依据。六条/400字符保证客户端少收到正文，不保证宿主只读六条日志或敏感信息自动脱敏。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-24](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/README.md#L3-L24)

作者范围与宿主说明。

<details>
<summary>查看原文（22行）</summary>

```text
在 DSH Web **设置**页显示**已归档对话**列表，点击条目可**只读预览**最近的用户/助手消息。独立插件，通过 `dsh plugin` 安装进 web profile。

## 为什么是"只读预览"

DSH 产品有意禁止打开归档会话：客户端 `workspaces` 服务有一条强制规则——归档会话一旦成为当前会话就被立即清除回"新对话"状态（"隐藏的行不能保持打开"），且当前 Host 端**没有取消归档（unarchive）API**。因此本插件不尝试打开或恢复归档会话，而是提供安全的只读预览：

- 入口在**设置**面板（`settings.section`，id `archived-conversations`，导航项"已归档对话"）；
- 页面顶部固定一行**能力提示**：当前不支持取消归档（原因见下），避免用户在不知情的情况归档后无法取回；
- 页面列出所有已归档对话（标题 + 相对时间 + 数量徽标）；
- 点击某条 → Host 读取该会话日志，提取**最近 6 条**用户/助手文本消息（每条截断 400 字符）返回展示；
- 完全不切换当前会话、不修改任何状态、不暴露完整日志。

### 为什么现在不能"移出归档"

DSH 目前没有取消归档 API：`workspace-controller` 只暴露 `@Remote('archiveSession')`，全仓无 `unarchiveSession` / `removeArchivedSession`。且插件侧**无法自行实现**——`WorkspaceRegistry.setState` 与 `enqueueOperation` 都是 `private`，registry 的公开写入口只有 `archiveSession`，没有可安全移除元素的公开方法。绕过私有方法直接写权威 domain state 会与 registry 的写队列和 `pendingMutation` 恢复逻辑并发竞争，等于让插件成为状态的第二个 owner，因此本插件不做这件事。

好消息是 harness 侧留了门：`workspaceDomainSpec` 的注释明确写着 *"an archived session keeps its `sessionIds` slot (unarchiving must restore the position)"*，所以一旦上游补上 `unarchiveSession`，恢复后位置可以还原。参见 issue #2。

## 工作方式

- **Host 半部**（`src/index.ts`）：注册 webServer 精确路由 `GET /__archived-conversations/preview?sessionId=<id>`，通过 `sessionQuery.readSession`（live-preferred，冷会话走持久化）读取日志，只提取 `user/message`（真实用户来源）与 `assistant/message` 的纯文本块，限量返回 JSON。
- **Client 半部**（`src/client/index.js`）：`window.__ModuleLoader__.load` 静态 bundle，`require('react')`，注册 `settings.section` 条目，用 fetch 调 Host 预览路由；列表数据来自槽位标准 props（`useSessions`/`useWorkspaces`）。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:98-149](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L98-L149)

实际抽取与截断。

<details>
<summary>查看原文（52行）</summary>

```text
function previewFromEvent(ev: unknown): PreviewMessage | null {
  if (ev === null || typeof ev !== 'object') return null
  const event = ev as { type?: unknown; data?: unknown; time?: unknown }
  const data = event.data
  if (data === null || typeof data !== 'object') return null
  const record = data as Record<string, unknown>

  let role: PreviewMessage['role'] | null = null
  let content: unknown
  if (event.type === 'user/message') {
    const source = record.source
    if (source !== null && typeof source === 'object'
      && (source as { kind?: unknown }).kind === 'user') {
      role = 'user'
      content = record.content
    }
  } else if (event.type === 'assistant/message') {
    const msg = record.message
    if (msg !== null && typeof msg === 'object') {
      role = 'assistant'
      content = (msg as { content?: unknown }).content
    }
  }
  if (role === null) return null

  const text = extractText(content)
  if (text === '') return null
  return {
    role,
    text: text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}…` : text,
    time: typeof event.time === 'number' ? event.time : 0,
  }
}

/** Read the preview for one session through the session-query service. */
async function readPreview(
  sessionQuery: SessionQueryLike,
  sessionId: string,
): Promise<{ ok: true; messages: PreviewMessage[] } | { ok: false; error: string }> {
  try {
    const snapshot = await sessionQuery.readSession(sessionId)
    const events = snapshot !== null && typeof snapshot === 'object' && Array.isArray(snapshot.events)
      ? snapshot.events
      : []
    const messages: PreviewMessage[] = []
    for (const ev of events) {
      const message = previewFromEvent(ev)
      if (message !== null) messages.push(message)
    }
    return { ok: true, messages: messages.slice(-MAX_MESSAGES) }
  } catch {
    return { ok: false, error: ERR_INTERNAL }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 列表到预览请求怎样工作？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

client的settings.section通过标准useWorkspaces取archivedSessionIds、useSessions取byId，按更新时间排序；fetch同源preview GET。host先核来源、方法和session ID形状，再查workspaceRegistry.archivedSessionIds成员，最后sessionQuery.readSession取得全部events，过滤真实source.kind=user与assistant.message文本块，跳过推理/工具块，最近六条返回。固定错误、no-store/nosniff和React文本节点有明确降暴露作用。

依赖webServer.host只识别127.0.0.1或0.0.0.0、workspaceRegistry与sessionQuery读接口及客户端slot hooks，package Node^22.19或>=24；无这些结构契约会拒绝或不可用，不能由无npm运行库推出跨宿主通用。id只接受session-UUID/计数，若其他宿主ID格式变化会拒绝，成员关系仍是范围判断关键。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:79-112](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/client/index.js#L79-L112)

列表与请求。

<details>
<summary>查看原文（34行）</summary>

```text
function fetchPreview(sessionId) {
  return fetch(`${API_PREVIEW}?sessionId=${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
    .then((res) => res.json())
    .catch((error) => ({ ok: false, error: error instanceof Error ? error.message : String(error) }))
}

/**
 * The settings-page entry: list / preview for the archived conversations.
 * Data comes from the framework hooks (`useSessions`, `useWorkspaces`)
 * provided as standard props by the settings section slot.
 */
function ArchivedSection(props) {
  const useSessions = props.useSessions
  const useWorkspaces = props.useWorkspaces
  const t = props.t
  const archivedIds = useWorkspaces((state) => state.archivedSessionIds)
  const byId = useSessions((state) => state.byId)
  const [selectedId, setSelectedId] = React.useState(null)
  const [preview, setPreview] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const rows = React.useMemo(() => {
    const result = []
    for (const id of archivedIds) {
      const summary = byId[id]
      result.push({
        id,
        title: summary !== undefined && summary.displayTitle !== '' ? summary.displayTitle : id,
        updatedAt: summary !== undefined ? summary.updatedAt : 0,
      })
    }
    result.sort((a, b) => b.updatedAt - a.updatedAt)
    return result
  }, [archivedIds, byId])
```

</details>

**依据 2 · 源码核查**：[src/client/index.js:173-178](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/client/index.js#L173-L178)

React文本。

```text
              : React.createElement('div', { className: 'dsa-preview' },
                messages.map((msg, index) => React.createElement('div', { key: String(index), className: 'dsa-msg' },
                  React.createElement('span', { className: 'dsa-msgRole' },
                    msg.role === 'user' ? t('role.user') : t('role.assistant')),
                  React.createElement('span', { className: 'dsa-msgText' }, String(msg.text)),
                )),
```

**依据 3 · 源码核查**：[src/index.ts:48-48](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L48-L48)

ID形状。

```text
const SESSION_ID_RE = /^session-(?:[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}|[0-9a-f]{32}|\d+)$/i
```

**依据 4 · 源码核查**：[src/index.ts:176-181](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L176-L181)

归档成员。

```text
function isArchived(ctx: ArchivedHostContext, sessionId: string): boolean {
  const registry = ctx.get('workspaceRegistry') as
    | { archivedSessionIds: readonly string[] }
    | undefined
  if (registry === undefined) return false
  return registry.archivedSessionIds.includes(sessionId)
```

**依据 5 · 源码核查**：[src/index.ts:234-269](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L234-L269)

host分派。

<details>
<summary>查看原文（36行）</summary>

```text
export function apply(ctx: ArchivedHostContext & {
  effect(setup: () => (() => void), label?: string): void
}): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/__archived-conversations/preview',
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (!isTrustedRequest(ctx, req)) {
        sendJson(res, { ok: false, error: ERR_BAD_REQUEST }, 403)
        return
      }
      if (req.method !== 'GET') {
        sendJson(res, { ok: false, error: ERR_BAD_REQUEST }, 405)
        return
      }
      const sessionId = sessionIdFrom(req.url)
      if (sessionId === null) {
        sendJson(res, { ok: false, error: ERR_BAD_REQUEST }, 400)
        return
      }
      // IDOR guard: only archived conversations are readable through this route.
      if (!isArchived(ctx, sessionId)) {
        sendJson(res, { ok: false, error: ERR_NOT_ARCHIVED }, 404)
        return
      }
      const sessionQuery = ctx.get('sessionQuery') as SessionQueryLike | undefined
      if (sessionQuery === undefined) {
        sendJson(res, { ok: false, error: ERR_UNAVAILABLE }, 503)
        return
      }
      readPreview(sessionQuery, sessionId).then(
        (result) => { sendJson(res, result) },
        () => { sendJson(res, { ok: false, error: ERR_INTERNAL }, 500) },
      )
    },
  }), 'archived-conversations: preview route')
```

</details>

**依据 6 · 源码核查**：[package.json:43-46](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/package.json#L43-L46)

Node。

```text
  "engines": {
    "node": "^22.19 || >=24"
  },
  "keywords": [
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源检查和异步状态有哪些边界？

**研究主题：**缺陷与关键质疑

#### 完整回答

来源检查同时核实际socket回环、loopback Host、跨站元数据和存在时的Origin/Referer，优于只看Host；但无独立本地用户身份，缺浏览器marker也允许，边界是可信单用户本机，而不是多租户权限。归档集合只在读前检查，readSession异步期间移出归档不重查；代码也没单独判断subagent，README“子代理一律不可读”实际取决其是否进入归档集合，不宜扩成独立规则。

Origin比较固定用http构造Host URL，因此本地HTTPS部署有https Origin/Referer会拒绝，是限制支持面而非放宽。readPreview先收全部消息再slice，整个日志由sessionQuery读入，无插件timeout/abort或并发额度，超长冷归档/慢service可能让小预览也耗较多资源。client openPreview无AbortController/request序号，返回列表后选B时旧A请求晚到可覆盖preview而标题仍B；需要防旧响应混归属。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:199-227](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L199-L227)

来源检查。

<details>
<summary>查看原文（29行）</summary>

```text
/** Reject remote sockets, DNS-rebinding Hosts, and cross-origin browser markers. */
function isTrustedRequest(ctx: ArchivedHostContext, req: IncomingMessage): boolean {
  // The current webServer contract exposes the bind host; regardless of whether
  // it binds loopback or all interfaces, this private preview stays loopback-only.
  if (ctx.webServer.host !== '127.0.0.1' && ctx.webServer.host !== '0.0.0.0') return false
  if (!isLoopbackAddress(req.socket.remoteAddress)) return false
  const host = req.headers.host
  if (host === undefined) return false
  let hostUrl: URL
  try {
    hostUrl = new URL(`http://${host}`)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const requestMarkerMatches = (marker: string): boolean => {
    try {
      const markerUrl = new URL(marker)
      return markerUrl.protocol === hostUrl.protocol && markerUrl.host === hostUrl.host
    } catch {
      return false
    }
  }
  const origin = req.headers.origin
  if (origin !== undefined && !requestMarkerMatches(origin)) return false
  const referer = req.headers.referer
  if (referer !== undefined && !requestMarkerMatches(referer)) return false
  return true
```

</details>

**依据 2 · 源码核查**：[src/index.ts:254-266](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L254-L266)

检查在await前。

<details>
<summary>查看原文（13行）</summary>

```text
      // IDOR guard: only archived conversations are readable through this route.
      if (!isArchived(ctx, sessionId)) {
        sendJson(res, { ok: false, error: ERR_NOT_ARCHIVED }, 404)
        return
      }
      const sessionQuery = ctx.get('sessionQuery') as SessionQueryLike | undefined
      if (sessionQuery === undefined) {
        sendJson(res, { ok: false, error: ERR_UNAVAILABLE }, 503)
        return
      }
      readPreview(sessionQuery, sessionId).then(
        (result) => { sendJson(res, result) },
        () => { sendJson(res, { ok: false, error: ERR_INTERNAL }, 500) },
```

</details>

**依据 3 · 源码核查**：[src/index.ts:137-147](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L137-L147)

全日志遍历后slice。

<details>
<summary>查看原文（11行）</summary>

```text
  try {
    const snapshot = await sessionQuery.readSession(sessionId)
    const events = snapshot !== null && typeof snapshot === 'object' && Array.isArray(snapshot.events)
      ? snapshot.events
      : []
    const messages: PreviewMessage[] = []
    for (const ev of events) {
      const message = previewFromEvent(ev)
      if (message !== null) messages.push(message)
    }
    return { ok: true, messages: messages.slice(-MAX_MESSAGES) }
```

</details>

**依据 4 · 源码核查**：[src/client/index.js:114-127](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/client/index.js#L114-L127)

异步无版本guard。

<details>
<summary>查看原文（14行）</summary>

```text
  const openPreview = (id) => {
    setSelectedId(id)
    setLoading(true)
    setPreview(null)
    fetchPreview(id).then((result) => {
      setPreview(result)
    }).finally(() => { setLoading(false) })
  }
  const backToList = () => {
    setSelectedId(null)
    setPreview(null)
    setLoading(false)
  }

```

</details>

**依据 5 · 作者声明**：[README.md:28-32](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/README.md#L28-L32)

作者子代理与数据限制主张。

```text
本插件的预览路由在发布前经过独立安全审核，并做了如下加固：

- **IDOR 防护**：预览路由只在 `sessionId` 属于 registry 归档集合（`workspaceRegistry.archivedSessionIds`）时才响应，活动会话、子代理会话一律不可读（404）；
- **会话 id 校验**：`sessionId` 必须是 DSH 会话 id 形态（`session-` 前缀 + UUID/计数器），否则拒绝；
- **最小数据**：只返回最近 6 条、每条 ≤400 字符的纯文本消息；不返回推理内容、工具调用、文件内容或完整日志；
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程证据和成本如何判断？

**研究主题：**工程质量与复用、效果与总成本

#### 完整回答

TypeScript host、client source与lib发布产物并存，代码小且职责清楚，route通过effect卸载；tests/host.spec使用mock服务检查来源/host若干路径，末段正常请求case只断言200和end调用，没有断言正文六条/字段/归档竞态。测试仅72行，不足以证明所有安全宣传；本次只读未运行，未重建对照产物字节。

首次装进匹配web profile、确认local HTTP来源与归档ID格式；持续没有模型调用或额外持久副本，主要是会话读取/遍历和浏览器渲染，数千条归档列表无分页。失败恢复只需回列表重选/对照真实归档，不会修改domain state；但敏感文本被本机网页展示/截图仍是数据暴露成本，截断不是秘密过滤。辨认旧对话节时未量化，不能承诺找回全文。

#### 证据与依据

**依据 1 · 源码核查**：[tests/host.spec.ts:1-72](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/tests/host.spec.ts#L1-L72)

mock检查范围。

<details>
<summary>查看原文（72行）</summary>

```text
import { describe, expect, it, vi } from 'vitest'
import { apply } from '../src/index.ts'

function request(headers: Record<string, string>, remoteAddress = '127.0.0.1', url = '/__archived-conversations/preview?sessionId=session-123'): any {
  return { method: 'GET', url, headers, socket: { remoteAddress } }
}

function response(): any {
  return {
    headers: {} as Record<string, unknown>,
    setHeader(name: string, value: unknown) { this.headers[name] = value },
    end: vi.fn(),
  }
}

describe('archived preview route security', () => {
  function setup() {
    let handler: any
    const dispose = vi.fn()
    const effect = vi.fn((setup: () => () => void) => setup())
    const ctx: any = {
      webServer: { host: '127.0.0.1', register: vi.fn((route: any) => { handler = route.handler; return dispose }) },
      get: vi.fn((name: string) => name === 'workspaceRegistry' ? { archivedSessionIds: ['session-123'] } : { readSession: vi.fn(async () => ({ events: [] })) }),
      effect,
    }
    apply(ctx)
    return { ctx, handler, effect, dispose }
  }

  it('registers through the current effect contract and disposes the route', () => {
    const { effect, dispose } = setup()
    expect(effect).toHaveBeenCalledOnce()
    const teardown = effect.mock.results[0]?.value as (() => void)
    teardown()
    expect(dispose).toHaveBeenCalledOnce()
  })

  it.each([
    ['remote socket', request({ host: '127.0.0.1:3080' }, '192.168.1.5')],
    ['rebinding Host', request({ host: 'attacker.test:3080' })],
    ['cross-origin Origin', request({ host: '127.0.0.1:3080', origin: 'http://attacker.test:3080' })],
    ['mismatched-scheme Origin', request({ host: '127.0.0.1:3080', origin: 'https://127.0.0.1:3080' })],
    ['mismatched-scheme Referer', request({ host: '127.0.0.1:3080', referer: 'https://127.0.0.1:3080/settings' })],
    ['cross-site metadata', request({ host: '127.0.0.1:3080', 'sec-fetch-site': 'cross-site' })],
  ])('rejects %s before reading the archive', (_name, req) => {
    const { handler, ctx } = setup()
    const res = response()
    handler(req, res)
    expect(res.statusCode).toBe(403)
    expect(ctx.get).not.toHaveBeenCalledWith('sessionQuery')
  })

  it.each([
    ['malformed session id', '/__archived-conversations/preview?sessionId=live-123', 400],
    ['non-archived session id', '/__archived-conversations/preview?sessionId=session-456', 404],
  ])('preserves the %s guard', (name, url, status) => {
    const { handler } = setup()
    const res = response()
    handler(request({ host: '127.0.0.1:3080' }, '127.0.0.1', url), res)
    expect(res.statusCode, name).toBe(status)
  })

  it('serves an archived preview from a loopback same-origin request', async () => {
    const { handler } = setup()
    const res = response()
    handler(request({ host: 'localhost:3080' }), res)
    await Promise.resolve()
    await Promise.resolve()
    expect(res.statusCode).toBe(200)
    expect(res.end).toHaveBeenCalledOnce()
  })
})
```

</details>

**依据 2 · 源码核查**：[src/index.ts:237-269](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L237-L269)

effect路由生命周期。

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/__archived-conversations/preview',
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (!isTrustedRequest(ctx, req)) {
        sendJson(res, { ok: false, error: ERR_BAD_REQUEST }, 403)
        return
      }
      if (req.method !== 'GET') {
        sendJson(res, { ok: false, error: ERR_BAD_REQUEST }, 405)
        return
      }
      const sessionId = sessionIdFrom(req.url)
      if (sessionId === null) {
        sendJson(res, { ok: false, error: ERR_BAD_REQUEST }, 400)
        return
      }
      // IDOR guard: only archived conversations are readable through this route.
      if (!isArchived(ctx, sessionId)) {
        sendJson(res, { ok: false, error: ERR_NOT_ARCHIVED }, 404)
        return
      }
      const sessionQuery = ctx.get('sessionQuery') as SessionQueryLike | undefined
      if (sessionQuery === undefined) {
        sendJson(res, { ok: false, error: ERR_UNAVAILABLE }, 503)
        return
      }
      readPreview(sessionQuery, sessionId).then(
        (result) => { sendJson(res, result) },
        () => { sendJson(res, { ok: false, error: ERR_INTERNAL }, 500) },
      )
    },
  }), 'archived-conversations: preview route')
```

</details>

**依据 3 · 源码核查**：[src/client/index.js:100-112](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/client/index.js#L100-L112)

全量列表。

<details>
<summary>查看原文（13行）</summary>

```text
  const rows = React.useMemo(() => {
    const result = []
    for (const id of archivedIds) {
      const summary = byId[id]
      result.push({
        id,
        title: summary !== undefined && summary.displayTitle !== '' ? summary.displayTitle : id,
        updatedAt: summary !== undefined ? summary.updatedAt : 0,
      })
    }
    result.sort((a, b) => b.updatedAt - a.updatedAt)
    return result
  }, [archivedIds, byId])
```

</details>

**依据 4 · 源码核查**：[src/client/index.js:155-178](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/client/index.js#L155-L178)

逐行渲染和纯文本。

<details>
<summary>查看原文（24行）</summary>

```text
          : React.createElement('ul', { className: 'dsa-list' },
            rows.map((row) => React.createElement('li', { key: row.id },
              React.createElement('button', {
                type: 'button',
                className: 'dsa-row',
                onClick: () => openPreview(row.id),
              },
                React.createElement('span', { className: 'dsa-rowTitle', title: row.title }, row.title),
                React.createElement('span', { className: 'dsa-rowTime' }, relativeTime(row.updatedAt, now, t)),
              ),
            )),
          ))
        : (loading
          ? React.createElement('div', { className: 'dsa-loading' }, '…')
          : previewError !== null
            ? React.createElement('div', { className: 'dsa-error' }, previewError)
            : messages.length === 0
              ? React.createElement('div', { className: 'dsa-empty' }, t('preview.empty'))
              : React.createElement('div', { className: 'dsa-preview' },
                messages.map((msg, index) => React.createElement('div', { key: String(index), className: 'dsa-msg' },
                  React.createElement('span', { className: 'dsa-msgRole' },
                    msg.role === 'user' ? t('role.user') : t('role.assistant')),
                  React.createElement('span', { className: 'dsa-msgText' }, String(msg.text)),
                )),
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适合怎样采用，进一步探讨什么？

**研究主题：**新假设与验证、采用判断

#### 完整回答

可信本地HTTP单用户、只想辨认归档内容者可试用，明确不能恢复/全文阅读，先核真实归档标题与预览一致；不用于远程面向多用户或把归档当保密区的部署。若快切后标题/正文错配、长档案迟迟不回或合法ID被拒，回列表并用受支持宿主途径核查，不直接改domain文件恢复。

继续可研究host倒序有限提取/流式sessionQuery预算、读前后归档成员版本一致，client请求序号+abort和选中ID核对，来源协议由真实server契约取得。基线为全量读取后slice/无请求序号，反例包括A慢B快、返回列表旧响应、读中取消归档、超大日志和HTTPS本机。比较错归属、读取量、可用性与恢复工时，当前未验证，仍保持只读职责。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:137-147](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L137-L147)

读取基线。

<details>
<summary>查看原文（11行）</summary>

```text
  try {
    const snapshot = await sessionQuery.readSession(sessionId)
    const events = snapshot !== null && typeof snapshot === 'object' && Array.isArray(snapshot.events)
      ? snapshot.events
      : []
    const messages: PreviewMessage[] = []
    for (const ev of events) {
      const message = previewFromEvent(ev)
      if (message !== null) messages.push(message)
    }
    return { ok: true, messages: messages.slice(-MAX_MESSAGES) }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:254-266](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts#L254-L266)

成员时序。

<details>
<summary>查看原文（13行）</summary>

```text
      // IDOR guard: only archived conversations are readable through this route.
      if (!isArchived(ctx, sessionId)) {
        sendJson(res, { ok: false, error: ERR_NOT_ARCHIVED }, 404)
        return
      }
      const sessionQuery = ctx.get('sessionQuery') as SessionQueryLike | undefined
      if (sessionQuery === undefined) {
        sendJson(res, { ok: false, error: ERR_UNAVAILABLE }, 503)
        return
      }
      readPreview(sessionQuery, sessionId).then(
        (result) => { sendJson(res, result) },
        () => { sendJson(res, { ok: false, error: ERR_INTERNAL }, 500) },
```

</details>

**依据 3 · 源码核查**：[src/client/index.js:114-127](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/client/index.js#L114-L127)

请求基线。

<details>
<summary>查看原文（14行）</summary>

```text
  const openPreview = (id) => {
    setSelectedId(id)
    setLoading(true)
    setPreview(null)
    fetchPreview(id).then((result) => {
      setPreview(result)
    }).finally(() => { setLoading(false) })
  }
  const backToList = () => {
    setSelectedId(null)
    setPreview(null)
    setLoading(false)
  }

```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
