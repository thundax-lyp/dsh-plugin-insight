# DSH Chat Manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3bacad0](https://github.com/WSL043/dsh-chat-manager/tree/3bacad0ec81828efbf652920e7462dd816a32715)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSL043/dsh-chat-manager) [![npm 30d 11,726](https://img.shields.io/static/v1?label=npm+30d&message=11%2C726&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-manager) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-manager)
<!-- END META -->

> **功能**：在 DSH 中搜索已归档聊天，并对未加载的当前格式本机会话提供确认删除。

> **亮点**：在查询达到上限前限制归档范围，避免活动命中挤出结果，并保留官方取消归档。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：永久删除需核对物理记录和归档状态。移动后的隔离残留、删除后标记失败及客户端断开是不同结果。见 [Q03](#research-q03)。

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
  - [Q01 · 当前版在原生会话界面实际增加什么？](#detail-section-11)
  - [Q02 · 归档查询怎样避免被活动命中挤出？](#detail-section-12)
  - [Q03 · 永久删除怎样确认目标、隔离和失败结果？](#detail-section-13)
  - [Q04 · 谁适合隔离试用，验收与退出怎样做？](#detail-section-14)
  - [Q05 · 怎样判断归档内搜索节省检索时间？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有较多归档、记得正文而不记得标题的用户，可从设置直接定位历史会话。见 [Q01](#research-q01)。

DSH 自带会话、常规搜索及归档。可在原生结果中筛选归档或逐个读旧会话，插件增加有界归档正文定位和冷会话删除入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 归档搜索 | 找历史会话正文 | 内容最多 20 项，关闭索引时扫描 |
| 取消归档 | 恢复归档项在常规工作区的状态 | 复用 DSH 公开操作 |
| 确认删除 | 删除支持的冷会话记录 | 当前 JSONL、无持有者、不可逆 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、Web 插槽与 Node | 接入需要 | 页面、菜单和宿主路由 | 先核对 0.2.2-rc.1 和声明版本 |
| 官方 connection、注册表与查询服务 | 搜索和准入需要 | 认证并查询归档内容 | 请求拒绝或查询不可用 |
| 当前格式 JSONL 与独占写句柄 | 删除需要 | 锁定并确认存储 | 拒绝不支持或被占用目标 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户在隔离 profile 载入固定版本 | 核对设置与宿主服务 |
| 2 | 用户用正文词搜合成归档 | 核对片段、标题与目标 ID |
| 3 | 用户仅用一次性样本验收删除 | 比较拒绝、实际目录和标记 |
| 4 | 用户按需恢复原 profile | 核对备份、隔离残留和原生归档 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 兼容宿主和测试存储，费用未知 | 固定版本、准备合成会话 | 未量化 |
| 持续 | 查询与可能的事件扫描 | 复核片段和对象 | 并发为四，尾延迟未知 |
| 失败恢复 | 备份与隔离存储 | 核对目录、租约和标记 | 完成删除无法撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 归档正文定位 | 先限归档及索引关闭回退 | 查找速度、召回和负载 |
| 原生归档恢复 | 公开取消归档入口 | 各部署工件兼容 |
| 冷会话删除 | 目标校验、独占租约和隔离清理 | 真实故障路径和存储恢复 |

> **思考**：永久删除需核对物理记录和归档状态。移动后的隔离残留、删除后标记失败及客户端断开是不同结果。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在查询达到上限前限制归档范围，避免活动命中挤出结果，并保留官方取消归档。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

复用宿主准入、查询和写租约，操作后仍分开检查存储与标记。回退扫描受并发和结果条数控制，实际总工作量依归档规模。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

永久删除需核对物理记录和归档状态。移动后的隔离残留、删除后标记失败及客户端断开是不同结果。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有兼容 DSH 的用户可用合成归档试用正文检索，删除验收限一次性样本并检查磁盘和标记。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持真实插件、归档查询和租约保护的删除路径。真实宿主兼容、故障恢复和任务效果待验。

- 已检查：作者 README、包清单、源码路径 README.md、compatibility.json、cordis.patch.yml、lib/client.js、package.json、src/host/archive-manager.mjs、src/host/delete-session.mjs、src/host/plugin-request.mjs、src/index.js、tests/archive-manager-host.test.mjs、tests/delete-session-host.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根插件，覆盖设置、搜索、确认、删除、存储与代表性用例源码。未执行目标、测试、请求或宿主。
- 下一步：用独立 profile 核对索引启停、加载拒绝、旧格式、租约竞争、隔离残留、标记重试和卸载。

**分析版本**

- **仓库**：[WSL043/dsh-chat-manager](https://github.com/WSL043/dsh-chat-manager)
- **版本号**：2.0.1（[固定提交 3bacad0](https://github.com/WSL043/dsh-chat-manager/tree/3bacad0ec81828efbf652920e7462dd816a32715)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先限归档再查正文可能减少找回旧会话的时间，效果取决于索引、查询区分度及命中上限。见 [Q05](#research-q05)。

用独立 profile 核对索引启停、加载拒绝、旧格式、租约竞争、隔离残留、标记重试和卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 404 | — | — | 4530 |
| .js | source | 2 | 258 | 245 | 5 | — |
| .mjs | source | 11 | 1760 | 1610 | 63 | — |
| .mjs | test | 12 | 1666 | 1510 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/WSL043/dsh-chat-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/WSL043/dsh-chat-manager/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/WSL043/dsh-chat-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户如何在不逐个打开旧会话的情况下找到已归档内容，并区分可逆的取消归档、不可逆的删除和结果尚未确认？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前版在原生会话界面实际增加什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

适用已有较多历史归档、只记得正文关键词的 DSH 用户。固定根包 2.0.1 声明 Cordis bundle 和 Web 客户端。补丁只插入自己的宿主插件行，客户端注册设置区的归档清理、会话行上下文菜单和共享确认弹窗。归档行支持宿主公开的取消归档操作，活动和归档会话的行菜单均可申请删除。设置页只显示归档项，包含标题、工作区和命中正文片段。取消归档不删除 transcript，删除确认则显示名称并发送 ID 与预期归档状态。原生会话、归档和常规搜索仍由 DSH 提供，增量是归档范围内的正文找回以及对当前格式冷会话的额外删除入口。兼容清单仅列 0.2.2-rc.1，包还声明 Node ≥24.9.0。源码和作者验收记录不能单独证明其他版本或真实桌面工件已通过。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-24](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/package.json#L2-L24)

版本、入口和打包范围。

<details>
<summary>查看原文（23行）</summary>

```text
  "name": "dsh-chat-manager",
  "version": "2.0.1",
  "packageManager": "pnpm@11.19.0",
  "description": "DeepSeek Harness archive content search and confirmed cleanup of unloaded local sessions",
  "type": "module",
  "main": "./src/index.js",
  "icon": "./assets/icon.svg",
  "exports": {
    ".": "./src/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./locale/*": "./locale/*"
  },
  "files": [
    "assets/icon.svg",
    "locale/*.json",
    "compatibility.json",
    "cordis.patch.yml",
    "lib/client.js",
    "src/index.js",
    "src/host/archive-manager.mjs",
    "src/host/delete-session.mjs",
    "src/host/plugin-request.mjs",
```

</details>

**依据 2 · 源码核查**：[package.json:33-47](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/package.json#L33-L47)

DSH bundle 与 Web 注入。

<details>
<summary>查看原文（15行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-workspace",
        "@deepseek-ai/dsh-client-ui-primitives",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-session",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-context-menu"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[package.json:92-105](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/package.json#L92-L105)

Node 和 DSH peer。

<details>
<summary>查看原文（14行）</summary>

```text
  "engines": {
    "node": ">=24.9.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.1.0",
    "@deepseek-ai/dsh-client-locale": "0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-session": "0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-workspace": "0.2.2-rc.1",
    "react": "^18.2.0",
    "@deepseek-ai/dsh-client-ui-context-menu": "0.2.2-rc.1"
  },
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/cordis.patch.yml#L1-L4)

插入宿主插件行。

```text
# The official workspace keeps ownership of active sessions during plugin HMR.
- insert:
    - id: ui-workspace-session-delete
      name: dsh-chat-manager
```

**依据 5 · 源码核查**：[lib/client.js:24-64](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/lib/client.js#L24-L64)

确认后发送目标 ID 和预期归档状态。

<details>
<summary>查看原文（41行）</summary>

```text
  async function confirm() {
    if (disposed || state.busy || !state.target) return
    const target = state.target
    publish({ busy: true, error: '' })
    try {
      const response = await fetch('/plugins/dsh-session-delete/delete', {
        method: 'POST', signal: controller.signal,
        headers: { 'content-type': 'application/json', 'x-dsh-session-delete-confirmation': 'delete-session' },
        body: JSON.stringify({ sessionId: target.id, expectedArchived: target.archived }),
      })
      const result = await response.json()
      if (!response.ok || result?.ok !== true) throw Error(result?.error?.message || `HTTP ${response.status}`)
      if (disposed) return
      const sessions = ctx.get('sessions')
      // Archive changes arrive through the official observable; only sessions expose refresh.
      const refreshed = await Promise.allSettled([sessions.refresh()])
      if (result.value?.archiveReconciled === false) {
        publish({ error: text('记录已删除，但归档列表未完成更新。请刷新列表后重试清理归档标记。', 'The record was deleted, but its archive marker could not be cleared. Refresh and retry marker cleanup.') })
      }
      else if (result.value?.pinReconciled === false) {
        publish({ error: text('记录已删除，但置顶状态未能清理。', 'The record was deleted, but its pin could not be cleared.') })
      }
      else publish({ target: null })
      for (const item of refreshed) if (item.status === 'rejected') console.warn('Session deleted; list refresh failed:', item.reason)
    } catch (error) { publish({ error: error.message || String(error) }) }
    finally { publish({ busy: false }) }
  }
  function DeleteDialog() {
    const current = React.useSyncExternalStore(subscribe, snapshot, snapshot)
    if (!current.target) return null
    const close = () => { if (!state.busy) publish({ target: null, error: '' }) }
    return h(ui.Modal, {
      open: true, onClose: close, closeLabel: text('取消', 'Cancel'),
      title: text('永久删除会话？', 'Permanently delete session?'),
      description: text('只删除未加载的本机会话记录，无法恢复。已加载或运行中的会话会被拒绝。', 'Only an unloaded local session can be deleted. This cannot be undone. Loaded or running sessions are refused.'),
      footer: h('div', { style: { display: 'flex', gap: 8 } },
        h(ui.Button, { variant: 'outline', disabled: current.busy, onClick: close }, text('取消', 'Cancel')),
        h(ui.Button, { variant: 'outline', style: danger, disabled: current.busy, onClick: confirm },
          current.busy ? text('正在删除…', 'Deleting…') : text('确认永久删除', 'Confirm permanent deletion'))),
    }, h('p', null, current.target.title), current.error && h('p', { role: 'alert' }, current.error))
  }
```

</details>

**依据 6 · 源码核查**：[lib/client.js:70-95](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/lib/client.js#L70-L95)

会话菜单、弹窗与设置动作接线。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.effect(() => ctx.contextMenus.register({
    id: 'dsh-chat-manager.delete',
    target: 'session',
    order: 500,
    observe: () => [ctx.workspaces.list, ctx.locale],
    resolve({ sessionId, displayTitle }) {
      const ids = ctx.workspaces.list.getSnapshot().archivedSessionIds
      if (!Array.isArray(ids)) return []
      const archived = ids.includes(sessionId)
      return [{
        id: 'delete',
        label: text('永久删除', 'Delete permanently'),
        danger: true,
        afterContent: true,
        icon: { key: 'dsh-chat-manager.delete' },
        run: () => requestDelete({ id: sessionId, title: displayTitle || sessionId, archived }),
      }]
    },
  }))
  ctx.slots.inject('contextMenu.icon', () => ctx.slots.register({
    name: 'contextMenu.icon', key: 'dsh-chat-manager.delete',
  }, ui.IconTrashOutlineRegular))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'dsh-chat-manager.delete-dialog',
  }, DeleteDialog))
  registerArchiveSettings(ctx, React, ui, { requestDelete: row => requestDelete({ ...row, archived: true }) })
```

</details>

**依据 7 · 源码核查**：[lib/client.js:132-175](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/lib/client.js#L132-L175)

归档视图及公开取消归档。

<details>
<summary>查看原文（44行）</summary>

```text
    const owners = new Map()
    for (const workspace of workspaces.items) for (const id of workspace.sessionIds) owners.set(id, workspace.title)
    const snippets = new Map(result.items.map(item => [item.sessionId, item.snippet]))
    const rows = [...workspaces.archivedSessionIds].reverse().map(id => ({
      id, title: sessions.byId[id]?.displayTitle || id,
      workspace: owners.get(id) || text('未分组', 'Ungrouped'),
    })).filter(row => !normalized || (row.title + ' ' + row.workspace).toLowerCase().includes(normalized.toLowerCase())
      || snippets.has(row.id))
    async function restore(row) {
      if (restoring.current) return
      restoring.current = true
      setBusy(true); setError('')
      try {
        await ctx.workspaces.unarchiveSession(row.id)
      } catch (reason) { if (mounted.current) setError(String(reason.message || reason)) }
      finally { restoring.current = false; if (mounted.current) setBusy(false) }
    }
    const card = { border: '.5px solid var(--dsw-alias-settings-card-stroke)', background: 'var(--dsw-alias-settings-card-fill)', borderRadius: 'var(--dsw-radius-xl)', padding: '0 14px' }
    return h('div', { style: { display: 'grid', gap: 16 } },
      h('h2', { style: { margin: 0, fontSize: 16 } }, text('归档内容搜索与清理', 'Archive content search and cleanup')),
      h('p', { style: { margin: 0, fontSize: 14 } }, text('按归档范围搜索聊天内容。此处仅列出已归档的会话。已加载或运行中的会话会被拒绝删除。', 'Search messages within archives. Only archived sessions are listed here. Loaded or running sessions cannot be deleted.')),
      h('input', { type: 'search', value: query, maxLength: 500,
        'aria-label': text('搜索已归档会话', 'Search archived sessions'),
        placeholder: text('搜索名称、工作区或聊天内容', 'Search names, workspaces or messages'),
        onChange: e => { setQuery(e.target.value); setError('') },
        style: { width: '100%', boxSizing: 'border-box', height: 36, padding: '0 14px', borderRadius: 'var(--dsw-radius-md)', background: 'var(--dsw-alias-bg-base)', color: 'inherit', border: '1px solid var(--dsw-alias-border-l2)' } }),
      searching && h('p', { role: 'status' }, text('正在搜索归档内容…', 'Searching archived messages…')),
      result.hasMore && h('p', { role: 'status' }, text('仅显示前 20 条内容匹配，请缩小搜索范围。', 'Showing the first 20 content matches. Narrow your search.')),
      error && h('p', { role: 'alert' }, error),
      rows.length === 0 && h('p', null, text('暂无匹配的归档会话', 'No matching archived sessions')),
      rows.length > 0 && h('div', { style: card },
        ...rows.map((row, index) => h('div', { key: row.id, style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: '16px 0', borderBottom: index === rows.length - 1 ? 'none' : '.5px solid var(--dsw-alias-border-l2)' } },
          h('div', { style: { flex: '1 1 180px', minWidth: 0, overflowWrap: 'anywhere' } },
            h('div', null, row.title), h('div', { style: { fontSize: 12 } }, row.workspace),
            snippets.has(row.id) && h('p', { style: { margin: '6px 0 0', whiteSpace: 'pre-wrap' } }, snippets.get(row.id))),
          h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginLeft: 'auto', maxWidth: '100%' } },
            h(ui.Button, { variant: 'outline', size: 'sm', disabled: busy, onClick: () => restore(row), 'aria-label': text('取消归档 ', 'Unarchive ') + row.title }, text('取消归档', 'Unarchive')),
            h(ui.Button, { variant: 'outline', size: 'sm', disabled: busy, style: { color: 'var(--dsw-alias-state-error-primary)' }, onClick: () => requestDelete(row), 'aria-label': text('永久删除 ', 'Delete permanently ') + row.title }, text('永久删除', 'Delete permanently')))))))
  }
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'dsh-chat-manager.archive-search', order: 25,
    label: () => text('归档清理', 'Archive cleanup'),
  }, ArchiveSettings))
};
```

</details>

**依据 8 · 源码核查**：[compatibility.json:1-14](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/compatibility.json#L1-L14)

作者记录的唯一验收目标。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "releaseTargets": [
    "0.2.2-rc.1"
  ],
  "latestTested": "0.2.2-rc.1",
  "upstream": [
    {
      "version": "0.2.2-rc.1",
      "commit": "66491b05e3f05ad35bcdd4f6cd7ed26041d9e3db",
      "integrity": "sha512-ijR9UEVYkG15Q/Q79JzvzLBzQOQfc63VLr9n6flpwHPhr5IKn2UxthnSoto/P9l7qGd7pPvI1Ra6TW7LH3oKpg==",
      "cordis": "4.1.0"
    }
  ]
}
```

</details>

**依据 9 · 作者声明**：[README.md:5-17](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/README.md#L5-L17)

作者描述的宿主和功能范围。

<details>
<summary>查看原文（13行）</summary>

````text
在 DeepSeek Harness 的 **设置 → 归档清理** 中搜索已归档的聊天内容。从会话行菜单或归档搜索结果打开永久删除。两个入口都会显示会话名称，并要求再次确认。

工作区、常规搜索、归档、恢复和会话菜单由 DSH 提供。归档搜索在官方查询达到结果上限前限定归档范围。关闭全文索引时，使用有限并发的官方事件筛选。

## 安装与更新

在官方 DeepSeek Harness 0.2.2-rc.1 中打开 **插件 → 添加插件**，粘贴以下包名和版本：

```text
dsh-chat-manager@2.0.1
```

更新到后续 v2 版本前，可查看[已验收的 DSH 版本](compatibility.json)。旧版说明见 [v1 维护分支](https://github.com/WSL043/dsh-chat-manager/tree/stable)。
````

</details>

#### 缺口

- 未安装并核对官方桌面、Web 工件与插件端菜单。
  **影响**：不能把作者记录视为本次独立宿主验收。
  **进一步探讨**：在隔离 0.2.2-rc.1 核对两个删除入口、取消确认和原生取消归档。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 归档查询怎样避免被活动命中挤出？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

从 workspaceRegistry 复制归档 ID，调用官方 searchSessions 时就将这些 ID 作为 sessionFilters 并限制当前表面中的 user/message、assistant/message。搜索限 20，回包再校验命中归属、表面、类型和去重，因此活动会话不会先占掉 20 个位置。返回片段压缩空白，正文最多切取 240 个 JS 字符位置并可能加省略符，另回 hasMore。关闭全文索引且抛指定错误时，走 filterEvents，按每批四个归档并发，取每会话第一条有效文本命中，累计至 21 条用于判定是否还有。回退不提供下一页，未命中时可能检查全部归档，四并发不等同于总成本有固定上限。回退仅在批前后检查取消，不将 signal 传入已发起的 filterEvents。页面 250 毫秒防抖，检索后按反转的归档顺序显示，仍合并本地标题或工作区命中。20 限制内容命中，非屏幕所有行。相较逐个打开已归档会话，这条路径可先按正文定位，但索引与扫描的具体命中和延迟待测。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/archive-manager.mjs:21-54](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/archive-manager.mjs#L21-L54)

片段预算、回退批次、取消与结果上限。

<details>
<summary>查看原文（34行）</summary>

```text
const plainSnippet = (text, query) => {
  const compact = text.replace(/\s+/g, ' ').trim()
  if (compact.length <= 240) return compact
  const matchAt = compact.toLowerCase().indexOf(query.toLowerCase())
  const start = Math.max(0, (matchAt === -1 ? 0 : matchAt) - 80)
  const end = Math.min(compact.length, start + 240)
  return `${start > 0 ? '…' : ''}${compact.slice(start, end)}${end < compact.length ? '…' : ''}`
}

const scanArchivedEvents = async (sessionQuery, archivedSessionIds, query, signal) => {
  if (typeof sessionQuery?.filterEvents !== 'function') {
    throw new Error('archived history scan is unavailable')
  }
  const filters = [
    { kind: 'type', values: ['user/message', 'assistant/message'] },
    { kind: 'surface', values: ['current'] },
    { kind: 'text', text: query },
  ]
  const items = []
  for (let offset = 0; offset < archivedSessionIds.length && items.length <= SEARCH_LIMIT; offset += 4) {
    signal?.throwIfAborted()
    const batch = archivedSessionIds.slice(offset, offset + 4)
    const matches = await Promise.all(batch.map(sessionId => sessionQuery.filterEvents(sessionId, filters)))
    signal?.throwIfAborted()
    for (let index = 0; index < batch.length; index += 1) {
      const match = Array.isArray(matches[index])
        ? matches[index].find(event => typeof event?.text === 'string' && event.text.trim().length > 0)
        : undefined
      if (match !== undefined) items.push({ sessionId: batch[index], snippet: plainSnippet(match.text, query) })
      if (items.length > SEARCH_LIMIT) break
    }
  }
  return { items: items.slice(0, SEARCH_LIMIT), hasMore: items.length > SEARCH_LIMIT }
}
```

</details>

**依据 2 · 源码核查**：[src/host/archive-manager.mjs:87-139](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/archive-manager.mjs#L87-L139)

归档 ID 下推、搜索限制和回包校验。

<details>
<summary>查看原文（53行）</summary>

```text
/** Search current user/assistant message history inside the archive set only. */
export async function searchArchivedSessions({ workspaceRegistry, sessionQuery }, query, signal) {
  signal?.throwIfAborted()
  const normalized = typeof query === 'string' ? query.trim() : ''
  if (normalized.length === 0 || normalized.length > 500 || normalized.includes('\0')) {
    throw new TypeError('invalid archive search query')
  }
  if (typeof sessionQuery?.searchSessions !== 'function') {
    throw new Error('archived history search is unavailable')
  }

  const archivedSessionIds = archiveIds(workspaceRegistry)
  if (archivedSessionIds.length === 0) return { items: [], hasMore: false }

  let page
  try {
    page = await sessionQuery.searchSessions({
      query: normalized,
      sessionFilters: [{ kind: 'id', values: archivedSessionIds }],
      eventFilters: [
        { kind: 'type', values: ['user/message', 'assistant/message'] },
        { kind: 'surface', values: ['current'] },
      ],
      limit: SEARCH_LIMIT,
    }, { signal })
    signal?.throwIfAborted()
  } catch (error) {
    if (error?.code !== 'SESSION_QUERY_SEARCH_DISABLED') throw error
    return scanArchivedEvents(sessionQuery, archivedSessionIds, normalized, signal)
  }

  const archived = new Set(archivedSessionIds)
  const items = []
  const included = new Set()
  for (const hit of Array.isArray(page?.items) ? page.items : []) {
    const sessionId = hit?.header?.id
    const match = hit?.bestMatch
    if (
      typeof sessionId !== 'string'
      || !archived.has(sessionId)
      || included.has(sessionId)
      || match?.sessionId !== sessionId
      || match?.surface !== 'current'
      || !MESSAGE_TYPES.has(match?.type)
      || typeof match?.snippet !== 'string'
    ) continue
    included.add(sessionId)
    items.push({ sessionId, snippet: plainSnippet(match.snippet, normalized) })
    if (items.length >= SEARCH_LIMIT) break
  }

  return { items, hasMore: page?.nextCursor !== undefined }
}
```

</details>

**依据 3 · 源码核查**：[src/host/archive-manager.mjs:141-168](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/archive-manager.mjs#L141-L168)

客户端断开时停止回应和错误返回。

<details>
<summary>查看原文（28行）</summary>

```text
/** Same-origin HTTP boundary consumed by the native archive manager UI. */
export function createArchiveRequestHandlers({ search, warn = console.warn, isTrustedRequest = () => false }) {
  return {
    search: async (req, res) => {
      const body = await readPluginPost(req, res, isTrustedRequest)
      if (body === undefined) return
      const query = typeof body?.query === 'string' ? body.query.trim() : ''
      if (query.length === 0 || query.length > 500 || query.includes('\0')) {
        sendJson(res, 400, failure('invalid-query', '搜索内容无效。'))
        return
      }
      const controller = new AbortController()
      const abort = () => controller.abort(new Error('archive search request closed'))
      req.once('aborted', abort)
      if (typeof res.once === 'function') res.once('close', abort)
      try {
        const value = await search(query, controller.signal)
        if (controller.signal.aborted) return
        sendJson(res, 200, { ok: true, value })
      } catch (error) {
        if (controller.signal.aborted) return
        warn('archived history search failed:', error)
        sendJson(res, 503, failure('search-unavailable', '归档内容搜索暂不可用。'))
      } finally {
        req.off('aborted', abort)
        if (typeof res.off === 'function') res.off('close', abort)
      }
    },
```

</details>

**依据 4 · 源码核查**：[lib/client.js:111-139](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/lib/client.js#L111-L139)

防抖、取消、本地元数据匹配及页面排序。

<details>
<summary>查看原文（29行）</summary>

```text
    const normalized = query.trim()
    React.useEffect(() => {
      setResult({ items: [], hasMore: false })
      setSearching(false)
      if (!normalized) return
      const abort = new AbortController()
      const timer = setTimeout(async () => {
        setSearching(true)
        try {
          const response = await fetch('/plugins/dsh-session-delete/archive-search', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ query: normalized }), signal: abort.signal,
          })
          const body = await response.json()
          if (!response.ok || body?.ok !== true) throw Error(body?.error?.message || 'Content search unavailable')
          if (!abort.signal.aborted) setResult(body.value)
        } catch (reason) { if (!abort.signal.aborted) setError(String(reason.message || reason)) }
        finally { if (!abort.signal.aborted) setSearching(false) }
      }, 250)
      return () => { clearTimeout(timer); abort.abort() }
    }, [normalized])
    const owners = new Map()
    for (const workspace of workspaces.items) for (const id of workspace.sessionIds) owners.set(id, workspace.title)
    const snippets = new Map(result.items.map(item => [item.sessionId, item.snippet]))
    const rows = [...workspaces.archivedSessionIds].reverse().map(id => ({
      id, title: sessions.byId[id]?.displayTitle || id,
      workspace: owners.get(id) || text('未分组', 'Ungrouped'),
    })).filter(row => !normalized || (row.title + ' ' + row.workspace).toLowerCase().includes(normalized.toLowerCase())
      || snippets.has(row.id))
```

</details>

**依据 5 · 源码核查**：[lib/client.js:153-166](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/lib/client.js#L153-L166)

内容截断提示与片段显示。

<details>
<summary>查看原文（14行）</summary>

```text
      h('input', { type: 'search', value: query, maxLength: 500,
        'aria-label': text('搜索已归档会话', 'Search archived sessions'),
        placeholder: text('搜索名称、工作区或聊天内容', 'Search names, workspaces or messages'),
        onChange: e => { setQuery(e.target.value); setError('') },
        style: { width: '100%', boxSizing: 'border-box', height: 36, padding: '0 14px', borderRadius: 'var(--dsw-radius-md)', background: 'var(--dsw-alias-bg-base)', color: 'inherit', border: '1px solid var(--dsw-alias-border-l2)' } }),
      searching && h('p', { role: 'status' }, text('正在搜索归档内容…', 'Searching archived messages…')),
      result.hasMore && h('p', { role: 'status' }, text('仅显示前 20 条内容匹配，请缩小搜索范围。', 'Showing the first 20 content matches. Narrow your search.')),
      error && h('p', { role: 'alert' }, error),
      rows.length === 0 && h('p', null, text('暂无匹配的归档会话', 'No matching archived sessions')),
      rows.length > 0 && h('div', { style: card },
        ...rows.map((row, index) => h('div', { key: row.id, style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: '16px 0', borderBottom: index === rows.length - 1 ? 'none' : '.5px solid var(--dsw-alias-border-l2)' } },
          h('div', { style: { flex: '1 1 180px', minWidth: 0, overflowWrap: 'anywhere' } },
            h('div', null, row.title), h('div', { style: { fontSize: 12 } }, row.workspace),
            snippets.has(row.id) && h('p', { style: { margin: '6px 0 0', whiteSpace: 'pre-wrap' } }, snippets.get(row.id))),
```

</details>

**依据 6 · 源码核查**：[tests/archive-manager-host.test.mjs:382-403](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/tests/archive-manager-host.test.mjs#L382-L403)

源码用例覆盖活跃命中挤占与四并发。

<details>
<summary>查看原文（22行）</summary>

```text
test('archive ID pushdown finds archives beyond a full page of active matches', async () => {
  const corpus = [...Array.from({ length: 25 }, (_, index) => 'active-' + index), A]
  const result = await searchArchivedSessions({ workspaceRegistry: registry([A]), sessionQuery: {
    searchSessions: async request => {
      const allowed = request.sessionFilters?.find(filter => filter.kind === 'id')?.values
      const visible = corpus.filter(id => !allowed || allowed.includes(id))
      return { items: visible.slice(0, request.limit).map(id => ({ header: { id }, bestMatch: { sessionId: id, type: 'assistant/message', surface: 'current', snippet: 'needle' } })) }
    },
  } }, 'needle')
  assert.deepEqual(result.items, [{ sessionId: A, snippet: 'needle' }])
})

test('index-disabled fallback uses at most four concurrent scans and bounds results', async () => {
  let concurrent = 0, maximum = 0, calls = 0
  const result = await searchArchivedSessions({ workspaceRegistry: registry(Array.from({ length: 40 }, (_, i) => 'archive-' + i)), sessionQuery: {
    searchSessions: async () => { throw Object.assign(Error('disabled'), { code: 'SESSION_QUERY_SEARCH_DISABLED' }) },
    filterEvents: async id => { calls++; concurrent++; maximum = Math.max(maximum, concurrent); await Promise.resolve(); concurrent--
      return [{ sessionId: id, type: 'user/message', surface: 'current', text: 'needle' }] },
  } }, 'needle')
  assert.equal(maximum, 4); assert.equal(calls, 24)
  assert.equal(result.items.length, 20); assert.equal(result.hasMore, true)
})
```

</details>

#### 缺口

- 未测大档案中索引启停的命中差异、查询延迟和扫描 I/O。
  **影响**：20 个命中和有限并发只能说明页面及并行控制。
  **进一步探讨**：构造混合活动归档数据，测命中正确性、尾延迟、取消后的未完成工作及总扫描量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 永久删除怎样确认目标、隔离和失败结果？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

搜索和删除每次都调用宿主 connection.requestRejection，服务未就绪时默认拒绝。共同入口要求 JSON POST 和 8 KiB 请求上限，删除另需固定确认头。业务层只允许具备官方 stat、resolveCurrentLog、open(write) 的 JSONL 后端。它以同后端同 ID 预约阻止插件内重复，检查预期归档状态、加载的 Session 和 Agent。未归档还查询活动，归档分支跳过独立活动查询。取写租约之前拒绝旧格式，确认目录在配置根内且目标和日志路径、符号链接条件一致。租约后再对会话头、当前路径、可用修订、目录和 transcript 身份、归档和加载状态做核对。移动到根的同级隔离位置后再验身份，冲突且原路径空闲时尝试移回，然后才递归删除。隔离仍有内容会回 storage-partial，失败不会清归档标记。确认文件已删但归档或置顶更新失败会返回独立状态，归档标记仅在可核实物理不存在时才允许单独清理。UI 中止 fetch 并未传取消令牌给删除逻辑，断开或未确认回应时须核对真实目录和标记。删除范围是该本机会话目录，不覆盖外部附件、备份和其他副本。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:19-46](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/index.js#L19-L46)

动态宿主准入、持久化和活动输入。

<details>
<summary>查看原文（28行）</summary>

```text
export function apply(ctx) {
  const sessionRoot = ctx.sessionPersistence?.config?.root ?? ctx.sessionPersistence?.root
  if (typeof sessionRoot !== 'string' || sessionRoot.length === 0) {
    throw new Error('dsh-session-delete requires the per-session JSONL persistence backend')
  }

  const deleteSession = (sessionId, expectedArchived) => deleteSessionSafely({
    sessions: ctx.sessions,
    agents: ctx.agents,
    workspaceRegistry: ctx.workspaceRegistry,
    sessionPersistence: ctx.sessionPersistence,
    sessionActivity: sessionId => ctx.waterfall('workspace/session-activity', { sessionId }, async () => []),
    reconcileArchive: (id, result) => reconcileDeletedArchive({ workspaceRegistry: ctx.workspaceRegistry }, id, result),
  }, { sessionRoot, sessionId, expectedArchived })
  // The official fence also admits the desktop app's forwarded requests; see hostRequestFence.
  // `connection` is not injected: some hosts register it after this plugin applies, and reading an
  // uninjected property throws in Cordis 4. Resolve it per request so a late connection is honored.
  const isTrustedRequest = req => hostRequestFence(currentConnection(ctx))(req)
  const handler = createDeleteRequestHandler({
    isTrustedRequest,
    deleteSession,
  })
  const archiveHandlers = createArchiveRequestHandlers({
    isTrustedRequest,
    search: (query, signal) => searchArchivedSessions({
      workspaceRegistry: ctx.workspaceRegistry,
      sessionQuery: ctx.get('sessionQuery'),
    }, query, signal),
```

</details>

**依据 2 · 源码核查**：[src/host/plugin-request.mjs:14-46](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/plugin-request.mjs#L14-L46)

请求方法、准入、确认头及限制。

<details>
<summary>查看原文（33行）</summary>

```text
export async function readPluginPost(req, res, isTrustedRequest, confirmation) {
  if (req.method !== 'POST') {
    sendJson(res, 405, failure('method-not-allowed', '此操作仅接受 POST 请求。'))
    return
  }

  const admission = isTrustedRequest(req)
  if (admission !== true || (confirmation && req.headers['x-dsh-session-delete-confirmation'] !== confirmation)) {
    sendJson(res, admission === 401 ? 401 : 403, failure('forbidden', '请求未通过宿主认证或确认校验。'))
    return
  }

  const contentType = req.headers['content-type']
  if (typeof contentType !== 'string' || contentType.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    sendJson(res, 415, failure('unsupported-media-type', '此操作需要 JSON 请求。'))
    return
  }

  const chunks = []
  let size = 0
  try {
    for await (const chunk of req) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      size += buffer.length
      if (size > MAX_REQUEST_BYTES) {
        sendJson(res, 413, failure('request-too-large', '请求过大。'))
        return
      }
      chunks.push(buffer)
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    if (!res.headersSent) sendJson(res, 400, failure('invalid-json', '请求不是有效 JSON。'))
```

</details>

**依据 3 · 源码核查**：[src/host/delete-session.mjs:45-86](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/delete-session.mjs#L45-L86)

日志、目录与链接验证。

<details>
<summary>查看原文（42行）</summary>

```text
const locationPaths = (sessionRoot, location) => {
  if (location?.kind !== 'jsonl' || typeof location.path !== 'string') return undefined
  const root = resolve(sessionRoot)
  const transcript = resolve(location.path)
  if (!isAbsolute(root) || !isAbsolute(transcript) || !inside(root, transcript)) return undefined
  const parts = relative(root, transcript).split(sep).filter(Boolean)
  if (parts.length !== 3 || !/^session(?:\.v[1-9]\d*)?\.jsonl(?:\.zstd)?$/.test(parts[2])) return undefined
  return {
    root,
    projectDirectory: join(root, parts[0]),
    sessionDirectory: join(root, parts[0], parts[1]),
    transcript,
  }
}

const validateExistingLocation = async (paths) => {
  const [root, project, directory, transcript] = await Promise.all([
    realpath(paths.root),
    lstat(paths.projectDirectory, { bigint: true }),
    lstat(paths.sessionDirectory, { bigint: true }),
    lstat(paths.transcript, { bigint: true }),
  ])
  if (
    !project.isDirectory()
    || project.isSymbolicLink()
    || !directory.isDirectory()
    || directory.isSymbolicLink()
    || !transcript.isFile()
    || transcript.isSymbolicLink()
  ) return undefined

  const [resolvedProject, resolvedDirectory, resolvedTranscript] = await Promise.all([
    realpath(paths.projectDirectory),
    realpath(paths.sessionDirectory),
    realpath(paths.transcript),
  ])
  if (
    !inside(root, resolvedProject)
    || !inside(root, resolvedDirectory)
    || dirname(resolvedTranscript) !== resolvedDirectory
  ) return undefined
  return { root, resolvedDirectory, directory, transcript }
```

</details>

**依据 4 · 源码核查**：[src/host/delete-session.mjs:99-129](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/delete-session.mjs#L99-L129)

同后端预约、标记更新和租约释放。

<details>
<summary>查看原文（31行）</summary>

```text
// Reservations protect only concurrent requests made by this plugin. Official
// single-writer persistence ownership excludes host resume/create operations.
const pendingByBackend = new WeakMap()

/** Permanently delete only an unloaded, current-format JSONL session. */
export async function deleteSessionSafely(deps, { sessionRoot, sessionId, expectedArchived = true }) {
  const persistence = deps.sessionPersistence
  if (persistence?.name !== 'session-persistence-jsonl'
    || typeof persistence.open !== 'function' || typeof persistence.stat !== 'function'
    || typeof persistence.resolveCurrentLog !== 'function') {
    return failure('unsupported-backend', '当前存储不支持经过验证的 JSONL 独占写入句柄。')
  }
  let pending = pendingByBackend.get(persistence)
  if (!pending) pendingByBackend.set(persistence, pending = new Set())
  if (pending.has(sessionId)) return failure('deletion-in-progress', '该会话正在删除中，请等待当前操作完成。')
  pending.add(sessionId)
  let handle
  try {
    const result = await deleteReservedSession(deps, { sessionRoot, sessionId, expectedArchived }, acquired => { handle = acquired })
    if (!result.ok) return result
    if (expectedArchived) return deps.reconcileArchive ? await deps.reconcileArchive(sessionId, result) : result
    try {
      await deps.workspaceRegistry.unpinSession(sessionId)
      return result
    } catch {
      return { ok: true, value: { ...result.value, pinReconciled: false } }
    }
  } finally {
    try { await handle?.close() }
    finally { pending.delete(sessionId) }
  }
```

</details>

**依据 5 · 源码核查**：[src/host/delete-session.mjs:132-187](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/delete-session.mjs#L132-L187)

归档、活动、当前格式与单独标记清理条件。

<details>
<summary>查看原文（56行）</summary>

```text
async function deleteReservedSession(deps, { sessionRoot, sessionId, expectedArchived }, ownHandle) {
  const { sessionPersistence: persistence, workspaceRegistry } = deps
  const archiveMatches = () => {
    const ids = workspaceRegistry?.archivedSessionIds
    return Array.isArray(ids) && ids.includes(sessionId) === expectedArchived
  }
  const live = () => deps.sessions.get(sessionId) !== undefined || deps.agents.get(sessionId) !== undefined
  const archiveChanged = () => expectedArchived
    ? failure('session-not-archived', '该会话未归档或已取消归档，请从当前会话菜单重试。')
    : failure('archive-state-changed', '会话归档状态已变化，请从当前会话菜单重试。')
  const active = () => failure('session-active', '该会话仍被宿主加载或有活动，未删除任何内容。停止或归档不一定会释放宿主所有权。')
  const unsupportedActivity = () => failure('activity-unknown', '无法确认会话没有活动，未删除任何内容。')
  const checkActivity = async () => {
    if (expectedArchived) return
    try {
      const activity = await deps.sessionActivity(sessionId)
      if (!Array.isArray(activity)) return unsupportedActivity()
      if (activity.length || live()) return active()
    } catch {
      return unsupportedActivity()
    }
  }
  if (!archiveMatches()) return archiveChanged()
  if (live()) return active()
  if (!expectedArchived && (typeof deps.sessionActivity !== 'function' || typeof workspaceRegistry.unpinSession !== 'function')) {
    return failure('unsupported-workspace', '当前宿主不支持安全删除未归档会话。')
  }
  const activityRefusal = await checkActivity()
  if (activityRefusal) return activityRefusal
  const before = await persistence.stat(sessionId)
  if (before === undefined) {
    const parentEntries = await readdir(dirname(resolve(sessionRoot)))
    if (parentEntries.some(name => name.startsWith(quarantinePrefix(sessionId)))) {
      return failure('storage-partial', '会话仍在隔离区中，未确认永久删除。')
    }
    if (!expectedArchived) return failure('session-not-found', '会话不存在或已经删除。')
    // A stale archive marker is cleaned only after independent physical absence
    // checks. A corrupt or inaccessible directory must never count as absence.
    if (!/^[A-Za-z0-9_-]+$/.test(sessionId)) return failure('session-not-found', '无法验证会话是否已经不存在。')
    const projects = await readdir(sessionRoot, { withFileTypes: true })
    for (const project of projects) {
      if (project.isSymbolicLink()) return failure('storage-state-unknown', '无法确认会话存储状态。')
      if (!project.isDirectory()) continue
      const entries = await readdir(join(sessionRoot, project.name))
      if (entries.some(name => name === sessionId || name.startsWith(sessionId + '.'))) {
        return failure('storage-state-unknown', '会话目录仍然存在，未清理其归档标记。')
      }
    }
    if (await persistence.stat(sessionId) === undefined && !live() && archiveMatches()) {
      return { ok: true, value: { deleted: false, alreadyAbsent: true } }
    }
    return failure('storage-state-unknown', '无法确认会话存储状态。')
  }
  // open(write) may publish a migration. Refuse historical/unknown formats
  // before opening, and require the backend's current-generation raw location.
  if (before.formatStatus !== 'current') return failure('unsupported-format', '只支持当前格式的会话；不会为了删除而迁移会话。')
```

</details>

**依据 6 · 源码核查**：[src/host/delete-session.mjs:188-228](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/delete-session.mjs#L188-L228)

官方独占租约前后检查。

<details>
<summary>查看原文（41行）</summary>

```text
  const header = before.header
  if (header?.id !== sessionId) return failure('unsafe-location', '会话存储身份未通过校验。')
  const transcript = await persistence.resolveCurrentLog(sessionId)
  const paths = locationPaths(sessionRoot, { kind: 'jsonl', path: transcript })
  if (paths === undefined || (before.location !== undefined
    && (before.location.kind !== 'jsonl' || typeof before.location.path !== 'string' || resolve(before.location.path) !== paths.transcript))) {
    return failure('unsafe-location', '无法验证该会话的独立 JSONL 存储位置。')
  }
  let validated
  try { validated = await validateExistingLocation(paths) }
  catch (error) { return failure(missing(error) ? 'session-not-found' : 'storage-error', '读取会话存储失败，未删除任何文件。') }
  if (validated === undefined) return failure('unsafe-location', '会话存储位置未通过安全校验。')
  if (live()) return active()
  if (!archiveMatches()) return archiveChanged()
  let handle
  try {
    handle = await persistence.open(sessionId, 'write')
    ownHandle(handle)
  } catch {
    return failure('storage-state-unknown', '无法取得该会话的独占写入权限，未删除任何内容。')
  }
  const after = await persistence.stat(sessionId)
  const currentPath = await persistence.resolveCurrentLog(sessionId)
  if (after?.formatStatus !== 'current' || !sameHeader(header, after.header)
    || !sameHeader(header, handle.header) || currentPath !== transcript
    || (before.revision !== undefined && !Object.is(before.revision, after.revision))) {
    return failure('unsafe-location', '会话在取得写入权限期间发生变化，未删除任何文件。')
  }
  let revalidated
  try { revalidated = await validateExistingLocation(paths) }
  catch { return failure('unsafe-location', '会话存储在校验期间发生变化。') }
  if (revalidated === undefined || !sameDirectory(validated.directory, revalidated.directory)
    || !sameFile(validated.transcript, revalidated.transcript)) {
    return failure('unsafe-location', '会话存储身份发生变化，未删除任何文件。')
  }
  if (live()) return failure('session-reopened', '该会话在删除过程中被重新加载，已取消删除。')
  if (!archiveMatches()) return archiveChanged()
  // The lease excludes a new writer. Recheck official activity without stopping work.
  const activityUnderLease = await checkActivity()
  if (activityUnderLease) return activityUnderLease

```

</details>

**依据 7 · 源码核查**：[src/host/delete-session.mjs:229-279](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/delete-session.mjs#L229-L279)

隔离、再校验、恢复条件和清理。

<details>
<summary>查看原文（51行）</summary>

```text
  let quarantineRoot
  let quarantinedDirectory
  let detached = false
  try {
    const moveDirectory = deps.moveDirectory ?? rename
    quarantineRoot = await mkdtemp(join(dirname(validated.root), quarantinePrefix(sessionId)))
    quarantinedDirectory = join(quarantineRoot, basename(validated.resolvedDirectory))
    if (live() || !archiveMatches()) {
      await rmdir(quarantineRoot)
      return failure('session-reopened', '该会话已重新加载或归档状态已变化，已取消删除。')
    }
    await moveDirectory(validated.resolvedDirectory, quarantinedDirectory)
    detached = true

    const quarantinedTranscript = join(quarantinedDirectory, basename(paths.transcript))
    const [directoryAfter, transcriptAfter] = await Promise.all([
      lstat(quarantinedDirectory, { bigint: true }),
      lstat(quarantinedTranscript, { bigint: true }),
    ])
    if (
      directoryAfter.isSymbolicLink()
      || transcriptAfter.isSymbolicLink()
      || !sameDirectory(validated.directory, directoryAfter)
      || !sameFile(validated.transcript, transcriptAfter)
    ) {
      if (await pathExists(validated.resolvedDirectory)) {
        return failure('storage-partial', '原路径已被重新占用，隔离区已保留，无法确认删除成功。')
      }
      await moveDirectory(quarantinedDirectory, validated.resolvedDirectory)
      detached = false
      await rmdir(quarantineRoot)
      return failure('unsafe-location', '会话目录在删除期间发生了身份变化，未删除任何文件。')
    }

    if (live() || !archiveMatches()) {
      if (await pathExists(validated.resolvedDirectory)) {
        return failure('storage-partial', '会话已重新加载且原路径被占用，隔离区已保留。')
      }
      await moveDirectory(quarantinedDirectory, validated.resolvedDirectory)
      detached = false
      await rmdir(quarantineRoot)
      return failure('session-reopened', '该会话已重新加载或归档状态已变化，已恢复原目录。')
    }
    const removeDirectory = deps.removeDirectory
      ?? (directory => rm(directory, { recursive: true, force: false }))
    await removeDirectory(quarantinedDirectory)
    if (await pathExists(quarantinedDirectory)) {
      return failure('storage-partial', '会话目录已移入隔离区，但存储清理未完成，不能确认永久删除成功。')
    }
    await rmdir(quarantineRoot)
    return { ok: true, value: { deleted: true } }
```

</details>

**依据 8 · 源码核查**：[src/host/delete-session.mjs:280-297](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/delete-session.mjs#L280-L297)

隔离残留和已清理的区别。

<details>
<summary>查看原文（18行）</summary>

```text
  } catch (error) {
    if (detached && quarantinedDirectory !== undefined) {
      let remains = true
      try {
        remains = await pathExists(quarantinedDirectory)
      } catch {
        // Inaccessible storage is not proof of cleanup; retain the quarantine.
      }
      if (remains) {
        return failure('storage-partial', '会话目录已移入隔离区，但存储清理未完成，不能确认永久删除成功。')
      }
      if (quarantineRoot !== undefined) await rmdir(quarantineRoot).catch(() => undefined)
      return { ok: true, value: { deleted: true } }
    }
    if (quarantineRoot !== undefined) await rmdir(quarantineRoot).catch(() => undefined)
    if (missing(error)) return failure('session-not-found', '会话不存在或已经删除。')
    return failure('storage-error', '存储删除失败，未删除任何文件。')
  }
```

</details>

**依据 9 · 源码核查**：[src/host/delete-session.mjs:311-346](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/delete-session.mjs#L311-L346)

宿主围栏、确认和错误状态。

<details>
<summary>查看原文（36行）</summary>

```text
 * Require the Host's own request fence (authority, cross-site, and Host session cookie checks).
 * The official desktop app forwards dsh-app:// requests to the Host without an Origin header, so a
 * plain same-origin check cannot replace admission. Refuse until the official fence is ready.
 * Return true only for admission; preserve the Host's 401/403 rejection status for the HTTP boundary.
 */
export function hostRequestFence(connection) {
  if (typeof connection?.requestRejection !== 'function') return () => false
  return req => {
    const rejection = connection.requestRejection(req)
    return rejection === undefined ? true : rejection
  }
}

export function createDeleteRequestHandler({ deleteSession, isTrustedRequest = () => false }) {
  return async (req, res) => {
    const body = await readPluginPost(req, res, isTrustedRequest, 'delete-session')
    if (body === undefined) return
    if (
      typeof body?.sessionId !== 'string'
      || body.sessionId.length === 0
      || body.sessionId.length > 512
      || body.sessionId.includes('\0')
    ) {
      sendJson(res, 400, failure('invalid-session-id', '会话 ID 无效。'))
      return
    }

    if (body.expectedArchived !== undefined && typeof body.expectedArchived !== 'boolean') {
      sendJson(res, 400, failure('invalid-archive-state', '会话归档状态无效。'))
      return
    }
    try {
      const result = await deleteSession(body.sessionId, body.expectedArchived)
      sendJson(res, result.ok ? 200 : 409, result)
    } catch {
      sendJson(res, 500, failure('internal', '删除过程中发生未预期错误，未确认删除成功。'))
```

</details>

**依据 10 · 源码核查**：[src/host/archive-manager.mjs:71-85](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/archive-manager.mjs#L71-L85)

档案标记更新失败的结果。

<details>
<summary>查看原文（15行）</summary>

```text
/** Keep DSH's archive registry free of ids whose storage was permanently removed. */
export async function reconcileDeletedArchive({ workspaceRegistry, warn = console.warn }, sessionId, result) {
  if (result?.ok !== true) return result
  try {
    await restoreArchivedSession(workspaceRegistry, sessionId)
    return { ok: true, value: { ...result.value, archiveReconciled: true } }
  } catch (error) {
    if (result.value?.alreadyAbsent === true) {
      warn('absent session archive marker could not be reconciled:', error)
      return { ok: false, error: { code: 'archive-reconcile-failed', message: '会话记录已不存在，但归档列表清理失败，请重试。' } }
    }
    warn('session storage was deleted but its archive marker could not be reconciled:', error)
    return { ok: true, value: { ...result.value, archiveReconciled: false } }
  }
}
```

</details>

**依据 11 · 源码核查**：[lib/client.js:24-47](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/lib/client.js#L24-L47)

浏览器请求取消与标记失败提示。

<details>
<summary>查看原文（24行）</summary>

```text
  async function confirm() {
    if (disposed || state.busy || !state.target) return
    const target = state.target
    publish({ busy: true, error: '' })
    try {
      const response = await fetch('/plugins/dsh-session-delete/delete', {
        method: 'POST', signal: controller.signal,
        headers: { 'content-type': 'application/json', 'x-dsh-session-delete-confirmation': 'delete-session' },
        body: JSON.stringify({ sessionId: target.id, expectedArchived: target.archived }),
      })
      const result = await response.json()
      if (!response.ok || result?.ok !== true) throw Error(result?.error?.message || `HTTP ${response.status}`)
      if (disposed) return
      const sessions = ctx.get('sessions')
      // Archive changes arrive through the official observable; only sessions expose refresh.
      const refreshed = await Promise.allSettled([sessions.refresh()])
      if (result.value?.archiveReconciled === false) {
        publish({ error: text('记录已删除，但归档列表未完成更新。请刷新列表后重试清理归档标记。', 'The record was deleted, but its archive marker could not be cleared. Refresh and retry marker cleanup.') })
      }
      else if (result.value?.pinReconciled === false) {
        publish({ error: text('记录已删除，但置顶状态未能清理。', 'The record was deleted, but its pin could not be cleared.') })
      }
      else publish({ target: null })
      for (const item of refreshed) if (item.status === 'rejected') console.warn('Session deleted; list refresh failed:', item.reason)
```

</details>

**依据 12 · 作者声明**：[README.md:38-42](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/README.md#L38-L42)

作者列明不覆盖其他存储。

```text
## 永久删除

永久删除无法撤销。仅支持未被宿主加载、采用当前 JSONL 格式的本机会话。插件使用官方独占写入句柄核验目标。运行中、有待处理活动、已被宿主加载或被其他写入者占用的会话均会被拒绝，旧格式也会被拒绝。清理未完成时会报告隔离区状态，并保留已有的归档标记。

清理范围不含外部附件、缓存、备份、云端副本和其他存储格式。卸载插件会保留会话。
```

#### 缺口

- 未执行租约竞争、故障中断、归档或未归档的宿主并发用例。
  **影响**：当前可核对拒绝与部分失败语义，无法保证所有真实存储后端或外部操作的并发行为。
  **进一步探讨**：在隔离会话注入拒绝、移动失败和部分删除，分别核对目录、原始会话、租约释放和注册表。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合隔离试用，验收与退出怎样做？

**研究主题**：采用判断、依赖、兼容与流程、效果与总成本

#### 完整回答

建议已有 DSH 0.2.2-rc.1、经常找回老归档内容的用户，在隔离 profile 用合成归档试用搜索和取消归档。固定插件包、宿主版本和 Node，确认官方 Session 列表依然可用，再用标题不含关键词的合成对话检查正文片段。需要验收删除时只处理一次性样本，确认弹窗名称、取消无副作用、加载或旧格式拒绝和已冷却目标的真实目录。关闭界面或请求失败后查目录和状态，见隔离残留先核对真实文件，不把 UI 不见当成功。未能确认目标或宿主版本就回到原生归档和检索。卸载应核对原有会话仍在，已成功删除的记录须从事先保有的备份恢复。部署需要兼容版本和检索负载，永久操作额外需要专用样本和人工确认。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-17](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/README.md#L9-L17)

作者安装的精确版本。

````text
## 安装与更新

在官方 DeepSeek Harness 0.2.2-rc.1 中打开 **插件 → 添加插件**，粘贴以下包名和版本：

```text
dsh-chat-manager@2.0.1
```

更新到后续 v2 版本前，可查看[已验收的 DSH 版本](compatibility.json)。旧版说明见 [v1 维护分支](https://github.com/WSL043/dsh-chat-manager/tree/stable)。
````

**依据 2 · 源码核查**：[compatibility.json:1-14](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/compatibility.json#L1-L14)

目标宿主和 Cordis。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "releaseTargets": [
    "0.2.2-rc.1"
  ],
  "latestTested": "0.2.2-rc.1",
  "upstream": [
    {
      "version": "0.2.2-rc.1",
      "commit": "66491b05e3f05ad35bcdd4f6cd7ed26041d9e3db",
      "integrity": "sha512-ijR9UEVYkG15Q/Q79JzvzLBzQOQfc63VLr9n6flpwHPhr5IKn2UxthnSoto/P9l7qGd7pPvI1Ra6TW7LH3oKpg==",
      "cordis": "4.1.0"
    }
  ]
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:51-63](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/lib/client.js#L51-L63)

目标名称、取消和确认。

<details>
<summary>查看原文（13行）</summary>

```text
  function DeleteDialog() {
    const current = React.useSyncExternalStore(subscribe, snapshot, snapshot)
    if (!current.target) return null
    const close = () => { if (!state.busy) publish({ target: null, error: '' }) }
    return h(ui.Modal, {
      open: true, onClose: close, closeLabel: text('取消', 'Cancel'),
      title: text('永久删除会话？', 'Permanently delete session?'),
      description: text('只删除未加载的本机会话记录，无法恢复。已加载或运行中的会话会被拒绝。', 'Only an unloaded local session can be deleted. This cannot be undone. Loaded or running sessions are refused.'),
      footer: h('div', { style: { display: 'flex', gap: 8 } },
        h(ui.Button, { variant: 'outline', disabled: current.busy, onClick: close }, text('取消', 'Cancel')),
        h(ui.Button, { variant: 'outline', style: danger, disabled: current.busy, onClick: confirm },
          current.busy ? text('正在删除…', 'Deleting…') : text('确认永久删除', 'Confirm permanent deletion'))),
    }, h('p', null, current.target.title), current.error && h('p', { role: 'alert' }, current.error))
```

</details>

**依据 4 · 源码核查**：[src/host/archive-manager.mjs:87-115](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/archive-manager.mjs#L87-L115)

可单独试验归档正文检索。

<details>
<summary>查看原文（29行）</summary>

```text
/** Search current user/assistant message history inside the archive set only. */
export async function searchArchivedSessions({ workspaceRegistry, sessionQuery }, query, signal) {
  signal?.throwIfAborted()
  const normalized = typeof query === 'string' ? query.trim() : ''
  if (normalized.length === 0 || normalized.length > 500 || normalized.includes('\0')) {
    throw new TypeError('invalid archive search query')
  }
  if (typeof sessionQuery?.searchSessions !== 'function') {
    throw new Error('archived history search is unavailable')
  }

  const archivedSessionIds = archiveIds(workspaceRegistry)
  if (archivedSessionIds.length === 0) return { items: [], hasMore: false }

  let page
  try {
    page = await sessionQuery.searchSessions({
      query: normalized,
      sessionFilters: [{ kind: 'id', values: archivedSessionIds }],
      eventFilters: [
        { kind: 'type', values: ['user/message', 'assistant/message'] },
        { kind: 'surface', values: ['current'] },
      ],
      limit: SEARCH_LIMIT,
    }, { signal })
    signal?.throwIfAborted()
  } catch (error) {
    if (error?.code !== 'SESSION_QUERY_SEARCH_DISABLED') throw error
    return scanArchivedEvents(sessionQuery, archivedSessionIds, normalized, signal)
```

</details>

**依据 5 · 源码核查**：[tests/delete-session-host.test.mjs:93-143](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/tests/delete-session-host.test.mjs#L93-L143)

源码用例覆盖待处理活动、已加载、旧格式和写者占用。

<details>
<summary>查看原文（51行）</summary>

```text
test('unarchived deletion refuses queued activity, unavailable activity, and a stale archive choice', async t => {
  const paths = await fixture(); t.after(() => rm(paths.base, { recursive: true, force: true }))
  const deps = dependencies({ transcript: paths.transcript })
  deps.workspaceRegistry = { archivedSessionIds: [], unpinSession: () => assert.fail('no pin write on refusal') }
  const target = { ...args(paths), expectedArchived: false }
  deps.sessionActivity = async () => { throw Error('activity unavailable') }
  assert.equal((await deleteSessionSafely(deps, target)).error.code, 'activity-unknown')
  let checks = 0
  deps.sessionActivity = async () => ++checks === 1 ? [] : [{ kind: 'job' }]
  assert.equal((await deleteSessionSafely(deps, target)).error.code, 'session-active')
  deps.workspaceRegistry.archivedSessionIds = [HEADER.id]
  assert.equal((await deleteSessionSafely(deps, target)).error.code, 'archive-state-changed')
  assert.match(await readFile(paths.transcript, 'utf8'), /session-delete-test/)
})

test('refuses loaded idle and running sessions without touching foreign owner capabilities', async t => {
  const paths = await fixture(); t.after(() => rm(paths.base, { recursive: true, force: true }))
  for (const status of ['idle', 'running']) {
    const deps = dependencies({ transcript: paths.transcript, agentGet: () => ({ status }),
      open: () => { throw Error('must not claim live storage') } })
    Object.defineProperty(deps.agents, 'dispose', { get() { throw Error('foreign ownership') } })
    assert.equal((await deleteSessionSafely(deps, args(paths))).error.code, 'session-active')
  }
  const deps = dependencies({ transcript: paths.transcript, sessionGet: () => ({ id: HEADER.id }) })
  assert.equal((await deleteSessionSafely(deps, args(paths))).error.code, 'session-active')
  assert.match(await readFile(paths.transcript, 'utf8'), /session-delete-test/)
})

test('refuses historical and unknown format before write open can migrate anything', async t => {
  const paths = await fixture(); t.after(() => rm(paths.base, { recursive: true, force: true }))
  for (const formatStatus of ['migration-required', null, 'future']) {
    let opens = 0
    const deps = dependencies({ transcript: paths.transcript, formatStatus, open: () => { opens++; throw Error('must not migrate') } })
    assert.equal((await deleteSessionSafely(deps, args(paths))).error.code, 'unsupported-format')
    assert.equal(opens, 0)
  }
  const deps = dependencies({ transcript: paths.transcript })
  deps.sessionPersistence.stat = async () => ({ header: HEADER })
  assert.equal((await deleteSessionSafely(deps, args(paths))).error.code, 'unsupported-format')
  assert.match(await readFile(paths.transcript, 'utf8'), /session-delete-test/)
})

test('a busy writer preserves all bytes and permits a later retry after refusal', async t => {
  const paths = await fixture(); t.after(() => rm(paths.base, { recursive: true, force: true }))
  const deps = dependencies({ transcript: paths.transcript, open: async () => { throw Error('another writer owns this session') } })
  assert.equal((await deleteSessionSafely(deps, args(paths))).error.code, 'storage-state-unknown')
  assert.match(await readFile(paths.transcript, 'utf8'), /session-delete-test/)
  deps.sessionPersistence.open = async () => ({ header: HEADER, close: async () => {} })
  assert.equal((await deleteSessionSafely(deps, args(paths))).ok, true)
})

```

</details>

**依据 6 · 源码核查**：[tests/delete-session-host.test.mjs:273-310](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/tests/delete-session-host.test.mjs#L273-L310)

源码用例覆盖部分清理和成功后报错。

<details>
<summary>查看原文（38行）</summary>

```text
test('reports an incomplete cleanup honestly after the live directory was atomically detached', async (t) => {
  const paths = await fixture()
  t.after(() => rm(paths.base, { recursive: true, force: true }))

  const deps = dependencies({
      transcript: paths.transcript,
      removeDirectory: async (directory) => {
        await rm(join(directory, 'session.jsonl'))
        throw new Error('simulated cleanup failure')
      },
  })
  const result = await deleteSessionSafely(deps, args(paths))
  assert.equal(result.error.code, 'storage-partial')
  deps.sessionPersistence.stat = async () => undefined
  deps.reconcileArchive = () => assert.fail('Partial storage must retain its archive marker')
  assert.equal((await deleteSessionSafely(deps, args(paths))).error.code, 'storage-partial')
  await assert.rejects(readFile(paths.transcript), { code: 'ENOENT' })
})

test('recognizes a complete deletion even if the remover throws after cleanup', async (t) => {
  const paths = await fixture()
  t.after(() => rm(paths.base, { recursive: true, force: true }))

  const result = await deleteSessionSafely(
    dependencies({
      transcript: paths.transcript,
      removeDirectory: async (directory) => {
        await rm(directory, { recursive: true, force: false })
        throw new Error('late remover failure')
      },
    }),
    { sessionRoot: paths.root, sessionId: HEADER.id },
  )

  assert.deepEqual(result, { ok: true, value: { deleted: true } })
  await assert.rejects(readFile(paths.transcript), { code: 'ENOENT' })
})

```

</details>

**依据 7 · 作者声明**：[README.md:38-42](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/README.md#L38-L42)

删除不可逆、卸载保留记录。

```text
## 永久删除

永久删除无法撤销。仅支持未被宿主加载、采用当前 JSONL 格式的本机会话。插件使用官方独占写入句柄核验目标。运行中、有待处理活动、已被宿主加载或被其他写入者占用的会话均会被拒绝，旧格式也会被拒绝。清理未完成时会报告隔离区状态，并保留已有的归档标记。

清理范围不含外部附件、缓存、备份、云端副本和其他存储格式。卸载插件会保留会话。
```

#### 缺口

- 未验证实际卸载、不同客户端确认和宿主兼容。
  **影响**：采用只覆盖合成样本的短试，不能保证真实数据删除与恢复。
  **进一步探讨**：固定版本按拒绝、成功、部分成功和退出四条路径核对宿主和磁盘。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判断归档内搜索节省检索时间？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

假设先限定归档范围的正文搜索，比原生全局搜索后人工筛档案或按标题逐个打开，能更快找回目标旧会话。固定宿主和会话集合，混合活动命中与归档命中，并加入只出现在正文的关键词。分别测启用索引、关闭索引与手工基线，交错任务顺序。按每个正确找回的会话记录秒数、误选率、漏选率、搜索请求与实际扫描次数。把点击后核对正文的时间也计入。若结果超过上限，按既有 UI 缩小关键词，记录追加轮次。只有正确率持平或更高且总耗时下降，才支持持续使用。若大量扫描等待、歧义或重复缩小查询抵消定位优势，则推翻该场景收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/archive-manager.mjs:30-54](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/archive-manager.mjs#L30-L54)

扫描与批次上限的可观察指标。

<details>
<summary>查看原文（25行）</summary>

```text
const scanArchivedEvents = async (sessionQuery, archivedSessionIds, query, signal) => {
  if (typeof sessionQuery?.filterEvents !== 'function') {
    throw new Error('archived history scan is unavailable')
  }
  const filters = [
    { kind: 'type', values: ['user/message', 'assistant/message'] },
    { kind: 'surface', values: ['current'] },
    { kind: 'text', text: query },
  ]
  const items = []
  for (let offset = 0; offset < archivedSessionIds.length && items.length <= SEARCH_LIMIT; offset += 4) {
    signal?.throwIfAborted()
    const batch = archivedSessionIds.slice(offset, offset + 4)
    const matches = await Promise.all(batch.map(sessionId => sessionQuery.filterEvents(sessionId, filters)))
    signal?.throwIfAborted()
    for (let index = 0; index < batch.length; index += 1) {
      const match = Array.isArray(matches[index])
        ? matches[index].find(event => typeof event?.text === 'string' && event.text.trim().length > 0)
        : undefined
      if (match !== undefined) items.push({ sessionId: batch[index], snippet: plainSnippet(match.text, query) })
      if (items.length > SEARCH_LIMIT) break
    }
  }
  return { items: items.slice(0, SEARCH_LIMIT), hasMore: items.length > SEARCH_LIMIT }
}
```

</details>

**依据 2 · 源码核查**：[src/host/archive-manager.mjs:98-138](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/src/host/archive-manager.mjs#L98-L138)

归档限定、内容验证和分页信号。

<details>
<summary>查看原文（41行）</summary>

```text
  const archivedSessionIds = archiveIds(workspaceRegistry)
  if (archivedSessionIds.length === 0) return { items: [], hasMore: false }

  let page
  try {
    page = await sessionQuery.searchSessions({
      query: normalized,
      sessionFilters: [{ kind: 'id', values: archivedSessionIds }],
      eventFilters: [
        { kind: 'type', values: ['user/message', 'assistant/message'] },
        { kind: 'surface', values: ['current'] },
      ],
      limit: SEARCH_LIMIT,
    }, { signal })
    signal?.throwIfAborted()
  } catch (error) {
    if (error?.code !== 'SESSION_QUERY_SEARCH_DISABLED') throw error
    return scanArchivedEvents(sessionQuery, archivedSessionIds, normalized, signal)
  }

  const archived = new Set(archivedSessionIds)
  const items = []
  const included = new Set()
  for (const hit of Array.isArray(page?.items) ? page.items : []) {
    const sessionId = hit?.header?.id
    const match = hit?.bestMatch
    if (
      typeof sessionId !== 'string'
      || !archived.has(sessionId)
      || included.has(sessionId)
      || match?.sessionId !== sessionId
      || match?.surface !== 'current'
      || !MESSAGE_TYPES.has(match?.type)
      || typeof match?.snippet !== 'string'
    ) continue
    included.add(sessionId)
    items.push({ sessionId, snippet: plainSnippet(match.snippet, normalized) })
    if (items.length >= SEARCH_LIMIT) break
  }

  return { items, hasMore: page?.nextCursor !== undefined }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:132-159](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/lib/client.js#L132-L159)

UI 元数据与内容合并及限额提示。

<details>
<summary>查看原文（28行）</summary>

```text
    const owners = new Map()
    for (const workspace of workspaces.items) for (const id of workspace.sessionIds) owners.set(id, workspace.title)
    const snippets = new Map(result.items.map(item => [item.sessionId, item.snippet]))
    const rows = [...workspaces.archivedSessionIds].reverse().map(id => ({
      id, title: sessions.byId[id]?.displayTitle || id,
      workspace: owners.get(id) || text('未分组', 'Ungrouped'),
    })).filter(row => !normalized || (row.title + ' ' + row.workspace).toLowerCase().includes(normalized.toLowerCase())
      || snippets.has(row.id))
    async function restore(row) {
      if (restoring.current) return
      restoring.current = true
      setBusy(true); setError('')
      try {
        await ctx.workspaces.unarchiveSession(row.id)
      } catch (reason) { if (mounted.current) setError(String(reason.message || reason)) }
      finally { restoring.current = false; if (mounted.current) setBusy(false) }
    }
    const card = { border: '.5px solid var(--dsw-alias-settings-card-stroke)', background: 'var(--dsw-alias-settings-card-fill)', borderRadius: 'var(--dsw-radius-xl)', padding: '0 14px' }
    return h('div', { style: { display: 'grid', gap: 16 } },
      h('h2', { style: { margin: 0, fontSize: 16 } }, text('归档内容搜索与清理', 'Archive content search and cleanup')),
      h('p', { style: { margin: 0, fontSize: 14 } }, text('按归档范围搜索聊天内容。此处仅列出已归档的会话。已加载或运行中的会话会被拒绝删除。', 'Search messages within archives. Only archived sessions are listed here. Loaded or running sessions cannot be deleted.')),
      h('input', { type: 'search', value: query, maxLength: 500,
        'aria-label': text('搜索已归档会话', 'Search archived sessions'),
        placeholder: text('搜索名称、工作区或聊天内容', 'Search names, workspaces or messages'),
        onChange: e => { setQuery(e.target.value); setError('') },
        style: { width: '100%', boxSizing: 'border-box', height: 36, padding: '0 14px', borderRadius: 'var(--dsw-radius-md)', background: 'var(--dsw-alias-bg-base)', color: 'inherit', border: '1px solid var(--dsw-alias-border-l2)' } }),
      searching && h('p', { role: 'status' }, text('正在搜索归档内容…', 'Searching archived messages…')),
      result.hasMore && h('p', { role: 'status' }, text('仅显示前 20 条内容匹配，请缩小搜索范围。', 'Showing the first 20 content matches. Narrow your search.')),
```

</details>

**依据 4 · 源码核查**：[tests/archive-manager-host.test.mjs:382-403](https://github.com/WSL043/dsh-chat-manager/blob/3bacad0ec81828efbf652920e7462dd816a32715/tests/archive-manager-host.test.mjs#L382-L403)

可复用的混合命中与索引关闭测试构型。

<details>
<summary>查看原文（22行）</summary>

```text
test('archive ID pushdown finds archives beyond a full page of active matches', async () => {
  const corpus = [...Array.from({ length: 25 }, (_, index) => 'active-' + index), A]
  const result = await searchArchivedSessions({ workspaceRegistry: registry([A]), sessionQuery: {
    searchSessions: async request => {
      const allowed = request.sessionFilters?.find(filter => filter.kind === 'id')?.values
      const visible = corpus.filter(id => !allowed || allowed.includes(id))
      return { items: visible.slice(0, request.limit).map(id => ({ header: { id }, bestMatch: { sessionId: id, type: 'assistant/message', surface: 'current', snippet: 'needle' } })) }
    },
  } }, 'needle')
  assert.deepEqual(result.items, [{ sessionId: A, snippet: 'needle' }])
})

test('index-disabled fallback uses at most four concurrent scans and bounds results', async () => {
  let concurrent = 0, maximum = 0, calls = 0
  const result = await searchArchivedSessions({ workspaceRegistry: registry(Array.from({ length: 40 }, (_, i) => 'archive-' + i)), sessionQuery: {
    searchSessions: async () => { throw Object.assign(Error('disabled'), { code: 'SESSION_QUERY_SEARCH_DISABLED' }) },
    filterEvents: async id => { calls++; concurrent++; maximum = Math.max(maximum, concurrent); await Promise.resolve(); concurrent--
      return [{ sessionId: id, type: 'user/message', surface: 'current', text: 'needle' }] },
  } }, 'needle')
  assert.equal(maximum, 4); assert.equal(calls, 24)
  assert.equal(result.items.length, 20); assert.equal(result.hasMore, true)
})
```

</details>

#### 缺口

- 无真实检索任务的耗时与准确率对照。
  **影响**：只能提出可检验的收益，不能量化效率改善。
  **进一步探讨**：用含已知正确答案的数据分别比较有索引与无索引，统计按正确会话计的耗时与错误。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
