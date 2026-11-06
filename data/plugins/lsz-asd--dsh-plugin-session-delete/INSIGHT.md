# dsh-plugin-session-delete

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[352510e](https://github.com/lsz-asd/dsh-plugin-session-delete/tree/352510e552983dcfcb993cf9124181c55e2070f5)

<!-- BEGIN META -->
[![GitHub ★ 50](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=50&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lsz-asd/dsh-plugin-session-delete)
<!-- END META -->

> **功能**：提供 Web 删除会话入口及模型工具，清理日志目录、投影缓存和工作区记账。

> **亮点**：把物理日志与活动缓存/工作区多处清理接成UI和模型工具，依赖Host存储内部。见 [Q03](#research-q03)。

> **主要限制**：UI确认不覆盖工具/HTTP；超时/flush失败仍删，存储吞错可部分成功；标题猜ID和DOM卸载残留。见 [Q02](#research-q02)。

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
  - [Q01 · 从删除按钮到磁盘到底删什么，Agent是否也要确认？](#detail-section-11)
  - [Q02 · 运行任务与数据一致性是否真被安全兜住？](#detail-section-12)
  - [Q03 · 相比归档和人工清理有什么价值，需要承担什么耦合？](#detail-section-13)
  - [Q04 · 目前采用结论与最小验证方向是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：清理损坏/废弃会话的本机管理者；归档或停Host备份人工清理是基线。见 [Q01](#research-q01)。

Host归档用于整理列表；物理清理先停机备份再走正式API/人工路径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 顶部删除 | 精确ID开弹窗 | UI确认非服务端证明 |
| 侧栏删除 | 不切会话选目标 | 标题歧义不拒绝 |
| 删除工具 | Agent调用 | 无工具内人工确认 |
| 日志清理 | raw/prefixed所有slug | 超时仍删/无undo |
| 缓存记账 | 活动域清理 | 吞错可部分成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20/tools^0.1.0-rc.6 | 声明/硬依赖 | Host工具 | 不保证其他Host版 |
| webServer | UI可选 | HTTP列表/删除 | 仍注册模型工具 |
| sessions/agents内部store | 可靠关闭所需 | 停止/flush/detach | 可缺/吞错仍继续 |
| storageDomain特定表形状 | 一致性所需 | 缓存/记账 | 缺或错误可部分成功 |
| React/ui-primitives/slots/sessions列表 | UI所需 | 对话框/目标 | Web套壳兼容未验 |
| DSH_HOME JSONL目录约定 | 实现前提 | 扫描所有slug | 非当前workspace范围 |
| 完整备份/隔离副本 | 研究前提 | 恢复误删 | 不用于日常试删 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 原办法 | 归档或停Host备份 | 先保留可恢复性 |
| 副本研究 | 固定Host/合成ID | 不接日常日志 |
| 选目标 | 顶部ID优于侧栏标题 | 同名必须拒绝猜测 |
| 执行 | cancel/flush/detach/rm/表清 | 当前实现不保证全成功 |
| 恢复 | 停Host保全副本 | 分日志/缓存/记账核对 |
| 退出 | 移路由工具并刷新 | observer/已删数据不回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 备份空间/环境费未知 | 固定Host/备份/权限审查 | 不直接试日常profile |
| 持续使用 | 磁盘扫描资源未知 | 私有合同升级维护 | 无新增模型链不等免费 |
| 失败恢复 | 数据恢复成本未知 | 停机/逐域取证 | 无内建undo |
| 退出 | 已删日志不可回滚 | 清UI/重启/备份恢复 | DOM observer残留 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 物理删除 | rm所有匹配目录 | writer已停/以后不复活 |
| 缓存记账 | 活动域删除/更新 | 吞错后的全部一致 |
| UI确认 | 勾选+显示ID | 标题匹配可能错目标 |
| 模型工具 | 直接核心调用 | Host审批/授权未核 |
| 退出恢复 | Host路由effect | observer/已删数据不恢复 |

> **思考**：UI确认不覆盖工具/HTTP；超时/flush失败仍删，存储吞错可部分成功；标题猜ID和DOM卸载残留。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把物理日志与活动缓存/工作区多处清理接成UI和模型工具，依赖Host存储内部。见 [Q03](#research-q03)。

活动存储更新意识有用，但重复扫盘与私有store不替代writer关闭/事务/权限。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

UI确认不覆盖工具/HTTP；超时/flush失败仍删，存储吞错可部分成功；标题猜ID和DOM卸载残留。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

日常profile不推荐；副本审删除合同，真实清理先停机备份/正式API或归档。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

UI/HTTP/工具到磁盘与活动存储清理源码已核；未删除数据或运行Host。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client.js、src/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核全部Host删除/列表/HTTP/工具和Client目标匹配/Modal/菜单/observer生命周期；未审固定Host内部认证/持久服务，未运行目标或删除真实数据。
- 下一步：固定Host隔离副本五故障对照，未执行。

**分析版本**

- **仓库**：[lsz-asd/dsh-plugin-session-delete](https://github.com/lsz-asd/dsh-plugin-session-delete)
- **版本号**：0.3.1（[固定提交 352510e](https://github.com/lsz-asd/dsh-plugin-session-delete/tree/352510e552983dcfcb993cf9124181c55e2070f5)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用正式删除API做稳定ID预览/人工确认/逐阶段回执，五故障证伪；可靠合同缺则归档。见 [Q04](#research-q04)。

固定Host隔离副本五故障对照，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 69 | — | — | 942 |
| .js | source | 2 | 1008 | 780 | 168 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/lsz-asd/dsh-plugin-session-delete/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/lsz-asd/dsh-plugin-session-delete/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/lsz-asd/dsh-plugin-session-delete/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：UI与模型删除是否精确授权、等任务结束并保持日志/缓存/记账一致？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从删除按钮到磁盘到底删什么，Agent是否也要确认？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向需要清掉损坏/废弃DSH日志而归档只隐藏的本机管理者，基线是归档或停Host后人工备份、核路径清理。合格需精确目标、明确授权、任务已停、日志/缓存/记账一致且可识别部分失败，不以列表消失代物理删除。

Client有顶部按sessionId打开的垃圾桶和DOM注入侧栏项，共用Modal展示标题/ID与运行提示，勾选后POST同源/__chameleon/session/delete；成功refreshList并可open下一会话，实际不整页reload，和Host旧注释不同。失败留对话框错误。侧栏只带title，先客户端列表精确/去fork后缀/包含匹配，失败再Host列表首个近似匹配；不是唯一ID定位，重复标题可选错，弹窗ID是用户最后复核线索。

Host还无条件注册workbench_session_delete模型工具，直接同deleteSessionCore，没有UI勾选/确认token或edit-mode条件；HTTP也只接sessionId，不验证UI曾勾选。工具description写edit-mode不等注册范围限制。可达者/Agent是否需要审批依赖Host，没有在插件定义中声明人工确认。

核心只收UUID或session-UUID，取DSH_HOME或~/.dsh，扫描sessions所有slug目录并清raw/prefixed两种ID。顺序是cancel原ID Agent并最多等15秒、flush两种ID的live Session、detach内部store，再rmSync日志；清活动session_projcache后再扫两遍确认无目录，最后改workspace表sessionIds和global.archivedSessionIds。返回stopped/detached/dirRemoved/projRemoved/workspaceRemoved布尔，工具只输出删除字符串与三种移除结果；既不删工作区实际项目文件，也不删所有下游模型/备份内容。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:320-359](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/client.js#L320-L359)

真实POST及成功原地刷新。

<details>
<summary>查看原文（40行）</summary>

```text
      const confirm = useCallback(() => {
        if (busy || !acknowledged || !target) return
        setBusy(true)
        setError(null)
        fetch('/__chameleon/session/delete', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId: target.sessionId }),
        })
          .then(async (res) => {
            let data = {}
            try { data = await res.json() } catch { /* keep {} */ }
            if (!res.ok || !data.ok) {
              throw new Error(data.error || `delete failed (HTTP ${res.status})`)
            }
            // Deleted. Refresh the sidebar list in place — NO page reload —
            // and if the current session was deleted, open the first
            // remaining session so the user can keep working.
            const svc = __sessionsSvc
            const deletedCurrent = svc && svc.list
              ? svc.list.getSnapshot().current === target.sessionId
              : false
            setTarget(null)
            if (svc && typeof svc.refreshList === 'function') {
              const done = svc.refreshList()
              if (deletedCurrent) {
                Promise.resolve(done).then(() => {
                  try {
                    const snap = svc.list.getSnapshot()
                    const next = (snap && snap.ids || []).find((id) => id !== target.sessionId)
                    if (next && typeof svc.open === 'function') svc.open(next)
                  } catch { /* ignore */ }
                })
              }
            }
          })
          .catch((reason) => {
            setBusy(false)
            setError(reason && reason.message ? reason.message : String(reason))
          })
```

</details>

**依据 2 · 源码核查**：[src/client.js:385-413](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/client.js#L385-L413)

UI勾选门控和可见ID/错误。

<details>
<summary>查看原文（29行）</summary>

```text
          React.createElement('button', {
            key: 'confirm',
            type: 'button',
            disabled: busy || !acknowledged || !target.sessionId,
            onClick: confirm,
            style: { ...dangerBtnStyle, ...(busy || !acknowledged || !target.sessionId ? { opacity: 0.5, cursor: 'default' } : {}) },
          }, busy ? t('dialog.confirming') : t('dialog.confirm')),
        ],
      }, [
        React.createElement('div', { key: 'meta', style: metaStyle },
          t('dialog.session'), name,
          target.sessionId
            ? React.createElement(React.Fragment, null,
                React.createElement('br'),
                t('dialog.sessionId'), target.sessionId)
            : null),
        target.running
          ? React.createElement('div', { key: 'warn', style: warnStyle }, t('dialog.runningWarn'))
          : null,
        React.createElement('label', { key: 'ack', style: optStyle },
          React.createElement('input', {
            type: 'checkbox',
            checked: acknowledged,
            disabled: busy,
            onChange: (e) => setAcknowledged(e.target.checked),
          }),
          t('dialog.ack')),
        busy ? React.createElement('div', { key: 'busy', style: statusStyle }, t('dialog.deleting')) : null,
        error ? React.createElement('div', { key: 'err', style: errStyle, role: 'alert' }, error) : null,
```

</details>

**依据 3 · 源码核查**：[src/client.js:212-249](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/client.js#L212-L249)

侧栏多级标题匹配。

<details>
<summary>查看原文（38行）</summary>

```text
    function resolveTargetFromStore(detail) {
      let sessionId = detail.sessionId || null
      let title = detail.title || null
      let running = detail.running === true
      if (sessionId) return { sessionId, title, running }
      const want = normalizeTitle(title)
      if (!want) return null
      const wantBase = stripForkSuffix(want)
      const svc = __sessionsSvc
      if (svc && svc.list) {
        try {
          const snap = svc.list.getSnapshot()
          const byId = snap && snap.byId ? snap.byId : {}
          const ids = Object.keys(byId)
          for (const id of ids) {
            const s = byId[id]
            if (s && normalizeTitle(s.title) === want) {
              return { sessionId: id, title: s.title, running: s.running === true }
            }
          }
          if (wantBase) {
            for (const id of ids) {
              const s = byId[id]
              if (s && stripForkSuffix(s.title) === wantBase) {
                return { sessionId: id, title: s.title, running: s.running === true }
              }
            }
          }
          let best = null
          for (const id of ids) {
            const s = byId[id]
            if (!s || !s.title) continue
            const t = normalizeTitle(s.title)
            if (t && (t.indexOf(want) >= 0 || want.indexOf(t) >= 0)) {
              best = { sessionId: id, title: s.title, running: s.running === true }
            }
          }
          if (best) return best
```

</details>

**依据 4 · 源码核查**：[src/client.js:279-302](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/client.js#L279-L302)

Host fallback首个近似匹配。

<details>
<summary>查看原文（24行）</summary>

```text
          fetch('/__chameleon/session/list')
            .then(function (r) { return r.json() })
            .then(function (data) {
              let m = null
              if (data && data.ok && Array.isArray(data.sessions)) {
                const wantBase = stripForkSuffix(want)
                for (const s of data.sessions) {
                  if (!s.title) continue
                  const t = normalizeTitle(s.title)
                  if (t === want || (wantBase && stripForkSuffix(t) === wantBase) || t.indexOf(want) >= 0 || want.indexOf(t) >= 0) {
                    m = s
                    break
                  }
                }
              }
              if (m) {
                setTarget({ sessionId: m.sessionId, title: m.title, running: m.running === true })
              } else {
                setTarget({ sessionId: null, title: want, running: false, notFound: true })
              }
              setAcknowledged(false)
              setError(null)
              setBusy(false)
            })
```

</details>

**依据 5 · 源码核查**：[src/index.js:350-379](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L350-L379)

HTTP仅ID调用。

<details>
<summary>查看原文（30行）</summary>

```text
    targetCtx.effect(() => host.register({
      kind: 'exact',
      path: '/__chameleon/session/delete',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'method not allowed' })
          return
        }
        let args = {}
        try {
          const body = await readBody(req)
          if (body) args = JSON.parse(body)
        } catch {
          sendJson(res, 400, { error: 'bad json body' })
          return
        }
        const sessionId = String(args.sessionId || '').trim()
        if (!sessionId) {
          sendJson(res, 400, { error: 'sessionId required' })
          return
        }
        try {
          const result = await deleteSessionCore(ctx, sessionId)
          sendJson(res, 200, { ok: true, removed: [sessionId], ...result })
        } catch (e) {
          const status = e instanceof DeleteError && e.status ? e.status : 500
          sendJson(res, status, { error: e.message })
        }
      },
    }))
```

</details>

**依据 6 · 源码核查**：[src/index.js:393-421](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L393-L421)

模型工具无确认条件。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'workbench_session_delete',
    description: 'Permanently delete one session of this workbench: stops the agent if it is running (cancel + quiescence), then removes its persisted log, projection-cache row and workspace accounting. After deletion the client reloads; the edit-mode caller should verify with workbench_status or the session list.',
    parameters: {
      sessionId: {
        type: 'string',
        required: true,
        description: 'The session id to delete (uuid or session-<uuid> form).',
      },
    },
    output: {
      schema: { type: 'string' },
      render(_args, value) { return [{ type: 'text', text: value }] },
    },
    async execute(args) {
      const sessionId = String(args.sessionId || '').trim()
      try {
        const result = await deleteSessionCore(ctx, sessionId)
        return [
          `deleted: ${sessionId}`,
          `log dir removed: ${result.dirRemoved}`,
          `projection row removed: ${result.projRemoved}`,
          `workspace accounting removed: ${result.workspaceRemoved}`,
        ].join('\n')
      } catch (e) {
        return `delete failed: ${e.message}`
      }
    },
  }))
```

</details>

**依据 7 · 源码核查**：[src/index.js:233-268](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L233-L268)

实际删除步骤与返回。

<details>
<summary>查看原文（36行）</summary>

```text
async function deleteSessionCore(ctx, sessionId) {
  if (!SESSION_ID_RE.test(sessionId)) {
    throw new DeleteError(`invalid session id: ${sessionId}`, 400)
  }
  const stopped = await stopAgentIfRunning(ctx, sessionId)
  await flushSessionIfLive(ctx, sessionId)
  const detached = detachLiveSession(ctx, sessionId)

  // Remove every on-disk log directory first.  If the filesystem refuses, fail
  // before touching workspace accounting so a half-deleted session cannot fall
  // out of its group into "Ungrouped".
  const firstDirRemoved = removeSessionDirs(sessionId)

  // Remove projection rows now (they are not the grouping authority), then
  // sweep again: the dispose path may have been mid-flight and could have
  // re-created a directory after the first removal.
  const projStorage = await stripStorageDomains(ctx, sessionId, { workspace: false })
  const secondDirRemoved = removeSessionDirs(sessionId)
  await new Promise((resolve) => setImmediate(resolve))
  const thirdDirRemoved = removeSessionDirs(sessionId)

  const remainingDirs = findSessionDirs(sessionId)
  if (remainingDirs.length > 0) {
    throw new DeleteError(`session files could not be fully removed: ${remainingDirs.join(', ')}`, 500)
  }

  // Only after the log is confirmed gone do we detach the session from its
  // workspace/archive accounting.
  const workspaceStorage = await stripStorageDomains(ctx, sessionId, { workspace: true })
  const dirRemoved = firstDirRemoved || secondDirRemoved || thirdDirRemoved
  const projRemoved = projStorage.projRemoved || workspaceStorage.projRemoved
  const workspaceRemoved = workspaceStorage.workspaceRemoved
  if (!dirRemoved && !projRemoved && !workspaceRemoved) {
    throw new DeleteError(`session not found: ${sessionId}`, 404)
  }
  return { stopped, detached, dirRemoved, projRemoved, workspaceRemoved }
```

</details>

**依据 8 · 源码核查**：[src/index.js:44-97](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L44-L97)

home/所有slug/两种ID与真实rm。

<details>
<summary>查看原文（54行）</summary>

```text
function dshHome() {
  return process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
}

function sessionsRoot() {
  return path.join(dshHome(), 'sessions')
}

// Session ids may appear in two spellings in different stores: the raw id
// (`<uuid>`) and the prefixed form (`session-<uuid>`).  The on-disk JSONL
// backend encodes the exact session id, while older/workspace/projcache rows
// can carry either spelling.  Return every unique spelling we should clean up.
function sessionIdVariants(sessionId) {
  const variants = new Set([sessionId])
  if (sessionId.startsWith('session-')) {
    variants.add(sessionId.slice('session-'.length))
  } else if (SESSION_ID_RE.test(sessionId)) {
    variants.add(`session-${sessionId}`)
  }
  return [...variants]
}

// Locate ~/.dsh/sessions/<slug>/<sessionId>/ by scanning every slug dir, so
// the workspace-path encoding never has to be re-derived here.  Returns every
// matching directory (both id spellings, if both exist).
function findSessionDirs(sessionId) {
  const root = sessionsRoot()
  const variants = sessionIdVariants(sessionId)
  let entries = []
  try {
    entries = fs.readdirSync(root, { withFileTypes: true })
  } catch {
    return []
  }
  const found = []
  for (const e of entries) {
    if (!e.isDirectory()) continue
    for (const variant of variants) {
      const candidate = path.join(root, e.name, variant)
      try {
        if (fs.statSync(candidate).isDirectory() && !found.includes(candidate)) found.push(candidate)
      } catch { /* keep scanning */ }
    }
  }
  return found
}

// Remove every on-disk session directory for both id spellings.
function removeSessionDirs(sessionId) {
  const dirs = findSessionDirs(sessionId)
  for (const dir of dirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  return dirs.length > 0
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 运行任务与数据一致性是否真被安全兜住？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能沿README“安全彻底”作保证。stopAgent只按传入原ID查询，不遍历raw/prefixed别名；cancel异常吞掉，whenIdle超时或拒绝也继续并返回stopped=true，未重验idle。flush异常同样吞掉，detachEntered不await且替代路径直接删store/attachments，无正式持久层关闭合同；仍运行或延迟dispose写可能在三次扫盘后重新建日志。三遍目录扫描不是等待所有writer结束，更没有同Session删除锁/禁止新Agent resume。

storageDomain不是硬依赖，缺就返回false；projcache/workspace表和global写异常全部catch忽略。只要任一日志/记录移除就可能返回整体成功，不能从HTTP200或工具deleted断言五环节全清。findSessionDirs把readdir/stat错误都当没找到，权限问题也可被当“不存在”；若记账被清而日志因扫描错误没识别，可能失去可见入口。先删日志再记账减少一类脱组，却没有事务/备份/undo，半删后重试也可能404，不是幂等成功回执。

删除范围是同DSH_HOME下所有slug的同ID两种写法，不按工作区/当前会话/profile所属做核验。UUID格式防直接路径穿越，但不等对象授权；HTTP没有本地Origin/CSRF/用户验证，Host webServer外层合同未核，不能宣称公网暴露已发生。Agent工具可填任意合法ID甚至自身；没有工具内审批/白名单/只管理会话限制，当前注册者获得的工具面是实质扩大，不只是按钮换入口。

侧栏DOM依赖class sessionRow/menuOpen与第一个role=menu；重名/后缀/包含匹配不拒歧义，是误删风险条件。sidebar observer安装后不持有disposer，window全局installed标记不复位，卸载仍可保留observer与旧项/闭包，重装也可能跳过安装；正常Host路由通过ctx.effect清理，但客户端DOM非全生命周期归属。不能以移除插件恢复已删日志。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:165-181](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L165-L181)

cancel/15秒等待失败仍继续。

<details>
<summary>查看原文（17行）</summary>

```text
async function stopAgentIfRunning(ctx, sessionId) {
  const agents = ctx.get('agents')
  if (!agents || typeof agents.get !== 'function') return false
  const agent = agents.get(sessionId)
  if (!agent) return false
  if (typeof agent.cancel === 'function') {
    try { agent.cancel({ kind: 'user' }) } catch { /* agent may already be settling */ }
  }
  if (typeof agent.whenIdle === 'function') {
    try {
      await Promise.race([
        agent.whenIdle(),
        new Promise((resolve) => setTimeout(resolve, 15000)),
      ])
    } catch { /* ignore: proceed with deletion anyway */ }
  }
  return true
```

</details>

**依据 2 · 源码核查**：[src/index.js:188-230](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L188-L230)

flush吞错与内部detach。

<details>
<summary>查看原文（43行）</summary>

```text
async function flushSessionIfLive(ctx, sessionId) {
  const sessions = ctx.get('sessions')
  if (!sessions || typeof sessions.get !== 'function') return false
  let flushed = false
  for (const variant of sessionIdVariants(sessionId)) {
    const session = sessions.get(variant)
    if (!session) continue
    if (typeof sessions.flush === 'function') {
      try {
        await sessions.flush(session)
        flushed = true
      } catch { /* ignore: deletion proceeds and removes the log anyway */ }
    }
  }
  return flushed
}

// Remove the session from the in-memory store so host session lists stop
// returning it and no flush can re-materialize its files. The store has no
// public remove API; detachEntered is the store's own teardown path (deletes
// the entry and emits session/disposed). Try every id spelling defensively.
function detachLiveSession(ctx, sessionId) {
  const sessions = ctx.get('sessions')
  if (!sessions) return false
  let detached = false
  try {
    const store = sessions.store
    for (const variant of sessionIdVariants(sessionId)) {
      const entry = store && typeof store.get === 'function' ? store.get(variant) : undefined
      if (entry === undefined) continue
      if (typeof sessions.detachEntered === 'function') {
        sessions.detachEntered(entry)
        detached = true
      } else if (store && typeof store.delete === 'function') {
        store.delete(variant)
        if (sessions.attachments && entry.session && typeof sessions.attachments.delete === 'function') {
          sessions.attachments.delete(entry.session)
        }
        detached = true
      }
    }
  } catch { /* ignore */ }
  return detached
```

</details>

**依据 3 · 源码核查**：[src/index.js:109-157](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L109-L157)

所有存储清理吞错/可缺。

<details>
<summary>查看原文（49行）</summary>

```text
async function stripStorageDomains(ctx, sessionId, { workspace = true } = {}) {
  const sd = ctx.get('storageDomain')
  if (!sd) return { projRemoved: false, workspaceRemoved: false }
  const variants = sessionIdVariants(sessionId)
  let projRemoved = false
  let workspaceRemoved = false

  const proj = sd.get('session_projcache')
  if (proj && typeof proj.table === 'function') {
    try {
      const sessions = proj.table('sessions')
      for (const variant of variants) {
        if (sessions.get(variant) !== undefined) {
          await sessions.delete(variant)
          projRemoved = true
        }
      }
    } catch { /* unit closed or table absent: nothing to clean */ }
  }

  if (workspace) {
    const ws = sd.get('workspace')
    if (ws && typeof ws.table === 'function') {
      try {
        const workspaces = ws.table('workspaces')
        for (const [wid, rec] of workspaces.entries()) {
          if (rec && Array.isArray(rec.sessionIds) && variants.some((v) => rec.sessionIds.includes(v))) {
            await workspaces.put(wid, {
              ...rec,
              sessionIds: rec.sessionIds.filter((x) => !variants.includes(x)),
            })
            workspaceRemoved = true
          }
        }
      } catch { /* unit closed or table absent */ }
      try {
        const g = ws.global
        if (g && typeof g.get === 'function' && typeof g.set === 'function') {
          const state = g.get()
          if (state && Array.isArray(state.archivedSessionIds) && variants.some((v) => state.archivedSessionIds.includes(v))) {
            await g.set({ ...state, archivedSessionIds: state.archivedSessionIds.filter((x) => !variants.includes(x)) })
            workspaceRemoved = true
          }
        }
      } catch { /* no global slot or unit closed */ }
    }
  }

  return { projRemoved, workspaceRemoved }
```

</details>

**依据 4 · 源码核查**：[src/index.js:69-88](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L69-L88)

目录查找吞权限/IO错误。

<details>
<summary>查看原文（20行）</summary>

```text
function findSessionDirs(sessionId) {
  const root = sessionsRoot()
  const variants = sessionIdVariants(sessionId)
  let entries = []
  try {
    entries = fs.readdirSync(root, { withFileTypes: true })
  } catch {
    return []
  }
  const found = []
  for (const e of entries) {
    if (!e.isDirectory()) continue
    for (const variant of variants) {
      const candidate = path.join(root, e.name, variant)
      try {
        if (fs.statSync(candidate).isDirectory() && !found.includes(candidate)) found.push(candidate)
      } catch { /* keep scanning */ }
    }
  }
  return found
```

</details>

**依据 5 · 源码核查**：[src/index.js:233-268](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L233-L268)

扫盘/成功判据无事务锁。

<details>
<summary>查看原文（36行）</summary>

```text
async function deleteSessionCore(ctx, sessionId) {
  if (!SESSION_ID_RE.test(sessionId)) {
    throw new DeleteError(`invalid session id: ${sessionId}`, 400)
  }
  const stopped = await stopAgentIfRunning(ctx, sessionId)
  await flushSessionIfLive(ctx, sessionId)
  const detached = detachLiveSession(ctx, sessionId)

  // Remove every on-disk log directory first.  If the filesystem refuses, fail
  // before touching workspace accounting so a half-deleted session cannot fall
  // out of its group into "Ungrouped".
  const firstDirRemoved = removeSessionDirs(sessionId)

  // Remove projection rows now (they are not the grouping authority), then
  // sweep again: the dispose path may have been mid-flight and could have
  // re-created a directory after the first removal.
  const projStorage = await stripStorageDomains(ctx, sessionId, { workspace: false })
  const secondDirRemoved = removeSessionDirs(sessionId)
  await new Promise((resolve) => setImmediate(resolve))
  const thirdDirRemoved = removeSessionDirs(sessionId)

  const remainingDirs = findSessionDirs(sessionId)
  if (remainingDirs.length > 0) {
    throw new DeleteError(`session files could not be fully removed: ${remainingDirs.join(', ')}`, 500)
  }

  // Only after the log is confirmed gone do we detach the session from its
  // workspace/archive accounting.
  const workspaceStorage = await stripStorageDomains(ctx, sessionId, { workspace: true })
  const dirRemoved = firstDirRemoved || secondDirRemoved || thirdDirRemoved
  const projRemoved = projStorage.projRemoved || workspaceStorage.projRemoved
  const workspaceRemoved = workspaceStorage.workspaceRemoved
  if (!dirRemoved && !projRemoved && !workspaceRemoved) {
    throw new DeleteError(`session not found: ${sessionId}`, 404)
  }
  return { stopped, detached, dirRemoved, projRemoved, workspaceRemoved }
```

</details>

**依据 6 · 源码核查**：[src/index.js:350-379](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L350-L379)

HTTP无确认/对象权限。

<details>
<summary>查看原文（30行）</summary>

```text
    targetCtx.effect(() => host.register({
      kind: 'exact',
      path: '/__chameleon/session/delete',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'method not allowed' })
          return
        }
        let args = {}
        try {
          const body = await readBody(req)
          if (body) args = JSON.parse(body)
        } catch {
          sendJson(res, 400, { error: 'bad json body' })
          return
        }
        const sessionId = String(args.sessionId || '').trim()
        if (!sessionId) {
          sendJson(res, 400, { error: 'sessionId required' })
          return
        }
        try {
          const result = await deleteSessionCore(ctx, sessionId)
          sendJson(res, 200, { ok: true, removed: [sessionId], ...result })
        } catch (e) {
          const status = e instanceof DeleteError && e.status ? e.status : 500
          sendJson(res, status, { error: e.message })
        }
      },
    }))
```

</details>

**依据 7 · 源码核查**：[src/index.js:393-421](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L393-L421)

工具任意ID。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'workbench_session_delete',
    description: 'Permanently delete one session of this workbench: stops the agent if it is running (cancel + quiescence), then removes its persisted log, projection-cache row and workspace accounting. After deletion the client reloads; the edit-mode caller should verify with workbench_status or the session list.',
    parameters: {
      sessionId: {
        type: 'string',
        required: true,
        description: 'The session id to delete (uuid or session-<uuid> form).',
      },
    },
    output: {
      schema: { type: 'string' },
      render(_args, value) { return [{ type: 'text', text: value }] },
    },
    async execute(args) {
      const sessionId = String(args.sessionId || '').trim()
      try {
        const result = await deleteSessionCore(ctx, sessionId)
        return [
          `deleted: ${sessionId}`,
          `log dir removed: ${result.dirRemoved}`,
          `projection row removed: ${result.projRemoved}`,
          `workspace accounting removed: ${result.workspaceRemoved}`,
        ].join('\n')
      } catch (e) {
        return `delete failed: ${e.message}`
      }
    },
  }))
```

</details>

**依据 8 · 源码核查**：[src/client.js:458-504](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/client.js#L458-L504)

DOM标题注入与menu识别。

<details>
<summary>查看原文（47行）</summary>

```text
    function openDeleteFlow(row) {
      if (!row) return
      var titleEl = row.querySelector('[class*=title]')
      var title = titleEl ? String(titleEl.innerText || '').trim() : ''
      if (!title) return
      window.dispatchEvent(new CustomEvent(EVENT, { detail: { title } }))
    }

    function ensureSidebarDeleteItem() {
      var menu = document.querySelector('[role=menu]')
      if (!menu) return
      if (menu.querySelector('[data-chameleon-delete]')) return
      var row = findOpenSessionRow()
      if (!row) return // not a session-row menu
      var item = document.createElement('button')
      item.type = 'button'
      item.setAttribute('role', 'menuitem')
      item.setAttribute('data-chameleon-delete', '1')
      item.style.cssText = [
        'display:flex', 'align-items:center', 'gap:8px', 'width:100%',
        'padding:6px 12px', 'border:none', 'background:transparent',
        'color:var(--dsw-alias-state-error-primary,#e5484d)',
        'font:inherit', 'font-size:13px', 'line-height:20px',
        'text-align:left', 'border-radius:6px', 'cursor:pointer',
      ].join(';')
      item.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex:none"><path d="' + TRASH_PATH + '" fill="currentColor"/></svg><span></span>'
      item.querySelector('span').textContent = __t('menu.delete')
      item.addEventListener('mouseenter', function () {
        item.style.background = 'var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.14))'
      })
      item.addEventListener('mouseleave', function () {
        item.style.background = 'transparent'
      })
      item.addEventListener('click', function () { openDeleteFlow(row) })
      var sep = document.createElement('div')
      sep.style.cssText = 'height:1px;margin:4px 8px;background:var(--dsw-alias-border-l1,rgba(128,128,128,.2))'
      menu.appendChild(sep)
      menu.appendChild(item)
    }

    function findOpenSessionRow() {
      var rows = document.querySelectorAll('[class*=sessionRow]')
      for (var i = 0; i < rows.length; i++) {
        if (String(rows[i].className || '').indexOf('menuOpen') >= 0) return rows[i]
      }
      return null
    }
```

</details>

**依据 9 · 源码核查**：[src/client.js:516-524](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/client.js#L516-L524)

observer未释放/全局标记。

```text
    function installSidebarDelete() {
      if (window.__chameleonSidebarDeleteInstalled) return
      window.__chameleonSidebarDeleteInstalled = true
      try { ensureSidebarDeleteItem() } catch (e) { /* never crash the UI */ }
      var observer = new MutationObserver(function () {
        try { ensureSidebarDeleteItem() } catch (e) { /* never crash the UI */ }
      })
      observer.observe(document.body, { childList: true, subtree: true })
    }
```

#### 缺口

- 固定Host webServer认证/审批、内部store/dispose合同、磁盘IO/并发故障未运行。
  **影响**：不能证明被利用、实际误删频率或可靠永久删除；已知控制流缺口足以收窄采用。
  **进一步探讨**：仅在隔离副本用合成UUID核超时/flush失败/扫描权限/别名活跃/同名/重装，再审正式删除API。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比归档和人工清理有什么价值，需要承担什么耦合？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

真实增量是将原本停机查目录与多份记账清理接入UI及模型工具，并尝试经活动storageDomain减少下次flush复活；不是全新的存储删除机制。归档仍是只想整理列表的低损失基线，停Host后备份/人工清理更慢却便于精确恢复。当前实现越过公开Session删除API直接耦合sessions/<slug>/<id>、session_projcache/workspace表形状及store内部，升级可能悄然返回部分成功。

包0.3.1 MIT，Node>=20，tools peer^0.1.0-rc.6；仅tools硬依赖，webServer可选，agents/sessions/storageDomain均运行时探测。UI仍需Host slots、sessions列表、React和ui-primitives Modal/Icon，package只声明client-runtime注入不足以证明任意web套壳兼容。源码直接发布src无构建产物环节，README仅本地路径安装/重启；版本日志的修复说明是作者主张，不是本次真实Host验收。

首次必须备份整个相关DSH_HOME，记录当前Host/存储实现与目标ID，在隔离副本审工具权限，不能拿真实日常日志试删。持续负担是Host内部变更、双ID/多slug与存储表一致性维护；失败要分目录/内存/缓存/工作区逐项取证，误删依赖已有备份恢复，无法原样撤回模型侧已接收内容或已执行工作副作用。现金/人工时间/资源未知，无新增模型执行链不等无成本。

任务仍由同管理者决定保留/删除，界面和工具都未成立新的组织责任、交付成果、准入人群或供给/计价/服务模式结构；不把少手工操作或不可测存储节约加业务创新。可学的是活跃存储一致性意识，生产采用先应复用Host正式删除/归档能力，不能用模型能调用来抵消权限和不可逆负担。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-25](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/package.json#L1-L25)

版本许可/Node/直接src入口。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "@huanlin/dsh-plugin-session-delete",
  "version": "0.3.1",
  "description": "Delete sessions of a DeepSeek Harness profile from the UI: header danger button + session-row menu item with a risk-consent dialog; host endpoint + tool delete the log, projection cache and workspace accounting. Works in web and the desktop client alike.",
  "type": "module",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "keywords": ["dsh-plugin"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/lsz-asd/dsh-plugin-session-delete.git"
  },
  "files": [
    "src/",
    "cordis.patch.yml"
  ],
  "engines": {
    "node": ">=20"
  },
  "main": "src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./client": "./src/client.js",
```

</details>

**依据 2 · 源码核查**：[package.json:28-42](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/package.json#L28-L42)

Web及tools peer声明。

<details>
<summary>查看原文（15行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6"
  }
}
```

</details>

**依据 3 · 源码核查**：[src/index.js:29-33](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L29-L33)

仅tools硬依赖。

```text
const name = 'chameleon-session-delete'
// Only `tools` is a hard dependency; webServer is optional (see apply).
const inject = ['tools']

const SESSION_ID_RE = /^(session-)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
```

**依据 4 · 源码核查**：[src/index.js:109-157](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L109-L157)

活动存储形状耦合。

<details>
<summary>查看原文（49行）</summary>

```text
async function stripStorageDomains(ctx, sessionId, { workspace = true } = {}) {
  const sd = ctx.get('storageDomain')
  if (!sd) return { projRemoved: false, workspaceRemoved: false }
  const variants = sessionIdVariants(sessionId)
  let projRemoved = false
  let workspaceRemoved = false

  const proj = sd.get('session_projcache')
  if (proj && typeof proj.table === 'function') {
    try {
      const sessions = proj.table('sessions')
      for (const variant of variants) {
        if (sessions.get(variant) !== undefined) {
          await sessions.delete(variant)
          projRemoved = true
        }
      }
    } catch { /* unit closed or table absent: nothing to clean */ }
  }

  if (workspace) {
    const ws = sd.get('workspace')
    if (ws && typeof ws.table === 'function') {
      try {
        const workspaces = ws.table('workspaces')
        for (const [wid, rec] of workspaces.entries()) {
          if (rec && Array.isArray(rec.sessionIds) && variants.some((v) => rec.sessionIds.includes(v))) {
            await workspaces.put(wid, {
              ...rec,
              sessionIds: rec.sessionIds.filter((x) => !variants.includes(x)),
            })
            workspaceRemoved = true
          }
        }
      } catch { /* unit closed or table absent */ }
      try {
        const g = ws.global
        if (g && typeof g.get === 'function' && typeof g.set === 'function') {
          const state = g.get()
          if (state && Array.isArray(state.archivedSessionIds) && variants.some((v) => state.archivedSessionIds.includes(v))) {
            await g.set({ ...state, archivedSessionIds: state.archivedSessionIds.filter((x) => !variants.includes(x)) })
            workspaceRemoved = true
          }
        }
      } catch { /* no global slot or unit closed */ }
    }
  }

  return { projRemoved, workspaceRemoved }
```

</details>

**依据 5 · 源码核查**：[src/index.js:205-230](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L205-L230)

内部store清理。

<details>
<summary>查看原文（26行）</summary>

```text
// Remove the session from the in-memory store so host session lists stop
// returning it and no flush can re-materialize its files. The store has no
// public remove API; detachEntered is the store's own teardown path (deletes
// the entry and emits session/disposed). Try every id spelling defensively.
function detachLiveSession(ctx, sessionId) {
  const sessions = ctx.get('sessions')
  if (!sessions) return false
  let detached = false
  try {
    const store = sessions.store
    for (const variant of sessionIdVariants(sessionId)) {
      const entry = store && typeof store.get === 'function' ? store.get(variant) : undefined
      if (entry === undefined) continue
      if (typeof sessions.detachEntered === 'function') {
        sessions.detachEntered(entry)
        detached = true
      } else if (store && typeof store.delete === 'function') {
        store.delete(variant)
        if (sessions.attachments && entry.session && typeof sessions.attachments.delete === 'function') {
          sessions.attachments.delete(entry.session)
        }
        detached = true
      }
    }
  } catch { /* ignore */ }
  return detached
```

</details>

**依据 6 · 源码核查**：[src/client.js:25-32](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/client.js#L25-L32)

Host React/Modal/Icon依赖。

```text
    const React = require('react')
    const { useCallback, useEffect, useState } = React
    const { IconTrashOutline16, Modal } = require('@deepseek-ai/dsh-client-ui-primitives')

    const SLOT = 'conversation.session.header.actions'
    const ROW_ID = 'session-delete'
    const OVERLAY_SLOT = 'shell.overlay'
    const DIALOG_ID = 'session-delete-dialog'
```

**依据 7 · 源码核查**：[README.md:8-14](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/README.md#L8-L14)

作者本地安装/重启。

````text
## 安装

```sh
dsh plugin --profile <profile> add file:C:/path/to/dsh-plugin-session-delete
```

重启 profile 生效。
````

#### 缺口

- Host跨版、删除完整性与故障恢复工时/备份成本无独立数据。
  **影响**：不能证明优于归档或可恢复人工清理，也不能推荐持续安装。
  **进一步探讨**：固定Host和隔离备份副本核正式API可替代性，再决定是否修复此实现。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 目前采用结论与最小验证方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前不推荐安装到日常profile。需要物理清理的管理者先保持Host归档或停机备份后按正式路径/API管理；研究本包仅用隔离副本与合成会话。比原生归档多做物理删除是清晰能力，但无确认工具、模糊标题选择、超时仍删和部分失败成功回执使不可逆负担超过当前入口便利。不要把按钮勾选当Agent工具已获人工授权；出现部分清理也别继续乱删，先停Host保全副本。

候选方向是组合Host正式deleteSession能力与一个管理端预览/执行合同：用稳定sessionId解析目录/权限，强制真实idle，返回每阶段结果，缺能力拒绝；工具只生成清理计划或要求单次人工确认，侧栏不猜标题。先审现有Host是否已有删除能力，不另造会话存储实现。最小实验在可丢弃profile测同名标题、别名活跃Agent、取消超时、扫描/表写失败、删除中重新打开五种情况，对当前实现与正式API比较误目标/复活/部分失败误报和恢复步骤。若正式API已覆盖，直接薄封装；若没有可靠关闭writer/备份恢复合同，保持归档，不为“彻底删除”牺牲数据可靠性。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:165-181](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L165-L181)

idle不成立仍继续的方向依据。

<details>
<summary>查看原文（17行）</summary>

```text
async function stopAgentIfRunning(ctx, sessionId) {
  const agents = ctx.get('agents')
  if (!agents || typeof agents.get !== 'function') return false
  const agent = agents.get(sessionId)
  if (!agent) return false
  if (typeof agent.cancel === 'function') {
    try { agent.cancel({ kind: 'user' }) } catch { /* agent may already be settling */ }
  }
  if (typeof agent.whenIdle === 'function') {
    try {
      await Promise.race([
        agent.whenIdle(),
        new Promise((resolve) => setTimeout(resolve, 15000)),
      ])
    } catch { /* ignore: proceed with deletion anyway */ }
  }
  return true
```

</details>

**依据 2 · 源码核查**：[src/index.js:393-421](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L393-L421)

工具确认缺口。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'workbench_session_delete',
    description: 'Permanently delete one session of this workbench: stops the agent if it is running (cancel + quiescence), then removes its persisted log, projection-cache row and workspace accounting. After deletion the client reloads; the edit-mode caller should verify with workbench_status or the session list.',
    parameters: {
      sessionId: {
        type: 'string',
        required: true,
        description: 'The session id to delete (uuid or session-<uuid> form).',
      },
    },
    output: {
      schema: { type: 'string' },
      render(_args, value) { return [{ type: 'text', text: value }] },
    },
    async execute(args) {
      const sessionId = String(args.sessionId || '').trim()
      try {
        const result = await deleteSessionCore(ctx, sessionId)
        return [
          `deleted: ${sessionId}`,
          `log dir removed: ${result.dirRemoved}`,
          `projection row removed: ${result.projRemoved}`,
          `workspace accounting removed: ${result.workspaceRemoved}`,
        ].join('\n')
      } catch (e) {
        return `delete failed: ${e.message}`
      }
    },
  }))
```

</details>

**依据 3 · 源码核查**：[src/client.js:212-249](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/client.js#L212-L249)

稳定ID替代模糊匹配依据。

<details>
<summary>查看原文（38行）</summary>

```text
    function resolveTargetFromStore(detail) {
      let sessionId = detail.sessionId || null
      let title = detail.title || null
      let running = detail.running === true
      if (sessionId) return { sessionId, title, running }
      const want = normalizeTitle(title)
      if (!want) return null
      const wantBase = stripForkSuffix(want)
      const svc = __sessionsSvc
      if (svc && svc.list) {
        try {
          const snap = svc.list.getSnapshot()
          const byId = snap && snap.byId ? snap.byId : {}
          const ids = Object.keys(byId)
          for (const id of ids) {
            const s = byId[id]
            if (s && normalizeTitle(s.title) === want) {
              return { sessionId: id, title: s.title, running: s.running === true }
            }
          }
          if (wantBase) {
            for (const id of ids) {
              const s = byId[id]
              if (s && stripForkSuffix(s.title) === wantBase) {
                return { sessionId: id, title: s.title, running: s.running === true }
              }
            }
          }
          let best = null
          for (const id of ids) {
            const s = byId[id]
            if (!s || !s.title) continue
            const t = normalizeTitle(s.title)
            if (t && (t.indexOf(want) >= 0 || want.indexOf(t) >= 0)) {
              best = { sessionId: id, title: s.title, running: s.running === true }
            }
          }
          if (best) return best
```

</details>

**依据 4 · 源码核查**：[src/index.js:254-268](https://github.com/lsz-asd/dsh-plugin-session-delete/blob/352510e552983dcfcb993cf9124181c55e2070f5/src/index.js#L254-L268)

分阶段真实结果与整体成功差异。

<details>
<summary>查看原文（15行）</summary>

```text
  const remainingDirs = findSessionDirs(sessionId)
  if (remainingDirs.length > 0) {
    throw new DeleteError(`session files could not be fully removed: ${remainingDirs.join(', ')}`, 500)
  }

  // Only after the log is confirmed gone do we detach the session from its
  // workspace/archive accounting.
  const workspaceStorage = await stripStorageDomains(ctx, sessionId, { workspace: true })
  const dirRemoved = firstDirRemoved || secondDirRemoved || thirdDirRemoved
  const projRemoved = projStorage.projRemoved || workspaceStorage.projRemoved
  const workspaceRemoved = workspaceStorage.workspaceRemoved
  if (!dirRemoved && !projRemoved && !workspaceRemoved) {
    throw new DeleteError(`session not found: ${sessionId}`, 404)
  }
  return { stopped, detached, dirRemoved, projRemoved, workspaceRemoved }
```

</details>

#### 缺口

- 正式Host删除API/确认方案未固定审查，隔离故障实验未执行。
  **影响**：候选不计当前贡献，当前保持不推荐。
  **进一步探讨**：先核Host官方能力，再做五条件副本对照，未满足则保留归档。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
