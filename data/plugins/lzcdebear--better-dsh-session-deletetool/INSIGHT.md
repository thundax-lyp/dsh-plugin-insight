# Better DSH Session Delete Tool

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a630039](https://github.com/Lzcdebear/better-dsh-session-deletetool/tree/a6300399996f7b41beec34f25b505f39c5ad7e23)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Lzcdebear/better-dsh-session-deletetool) [![npm 30d 5,490](https://img.shields.io/static/v1?label=npm+30d&message=5%2C490&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/better-dsh-session-deletetool) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/better-dsh-session-deletetool)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中查看会话家族、用量与目录，并支持单个或批量物理清理。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将家族选择、活动检查及清理结果放在同一流程。

> **主要限制**：[Q03](#research-q03) 多步清理可留下部分副作用，来源头校验需要宿主网络边界共同约束。

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
  - [Q01 · 什么情况下需要会话家族清理？](#detail-section-11)
  - [Q02 · 删除前怎样确定范围与活动？](#detail-section-12)
  - [Q03 · 失败是否保证原日志未改？](#detail-section-13)
  - [Q04 · 何时可以观察，何时退出？](#detail-section-14)
  - [Q05 · 隔离保留期能否降低不可恢复错误？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要整理已废弃会话及其后代的本机 DSH 管理者，可先核查家族与活动。

使用原生归档，或独立核查每个会话的日志和关联状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话检查 | 查看家族和活动 | 需宿主持久化支持 |
| 物理清理 | 移除选定会话及关联状态 | 操作可部分失败，需要备份和核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 持久化服务 | 必需 | 定位和读取会话 | 缺失时拒绝 |
| 隔离环境和备份 | 观测或验证前必需 | 限制损失 | 保持归档 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 记录合成家族和备份 | 可逐项对账 |
| 观察 | 查看家族与活动 | 确认目标范围 |
| 退出 | 边界不明时停止 | 回宿主归档 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 合成环境和备份 | 验证宿主监听与数据 | 用时未知 |
| 持续 | 日志与索引资源 | 核查选择和活动 | 清理收益未知 |
| 失败 | 备份或恢复空间 | 对账并恢复 | 目录删除可能不可逆 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 家族管理 | 选择和活动检查 | 真实血缘完整性 |
| 物理清理 | 按步骤删除和记账 | 失败后的恢复保证 |

> **思考**：[Q03](#research-q03) 多步清理可留下部分副作用，来源头校验需要宿主网络边界共同约束。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将家族选择、活动检查及清理结果放在同一流程。

[Q02](#research-q02) 用宿主血缘校验请求。[Q03](#research-q03) 步骤边界决定需要失败后读回。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 多步清理可留下部分副作用，来源头校验需要宿主网络边界共同约束。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先观察一次性环境的家族清单。入口或恢复有疑问时回归档。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定宿主删除和活动分支，真实权限、血缘与恢复尚未运行。

- 已检查：作者 README、包清单、源码路径 host.js、README.zh-CN.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查宿主单项和家族路径，未运行目标、真实删除或全量审计目录鉴权。
- 下一步：在一次性环境验证目标选择、来源拒绝、活动与终端、副作用顺序以及备份恢复。

**分析版本**

- **仓库**：[Lzcdebear/better-dsh-session-deletetool](https://github.com/Lzcdebear/better-dsh-session-deletetool)
- **版本号**：0.7.2（[固定提交 a630039](https://github.com/Lzcdebear/better-dsh-session-deletetool/tree/a6300399996f7b41beec34f25b505f39c5ad7e23)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 保留区和确认摘要可测试是否能缩小物理删除后的恢复损失。

在一次性环境验证目标选择、来源拒绝、活动与终端、副作用顺序以及备份恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 658 | — | — | 6412 |
| .js | source | 3 | 5035 | 3684 | 1104 | — |
| .mjs | test | 1 | 849 | 712 | 69 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/Lzcdebear/better-dsh-session-deletetool/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：管理废弃 DSH 会话的用户能否确认家族删除范围、活动中止及失败后的实际状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么情况下需要会话家族清理？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

有废弃会话及派生子代理的本机 DSH 管理者，可能希望核对家族用量并清掉记录。归档只能组织列表，手工删目录还要自己核对工作区、缓存和血缘。合格结果是只移除明确选择的会话，并在原日志、列表及状态中逐项对账。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:3-19](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/README.zh-CN.md#L3-L19)

作者说明管理和清理范围。

<details>
<summary>查看原文（17行）</summary>

```text
**在 DeepSeek Harness 里真正删除一个会话，并管理它带出的整个家族。**

DSH 自带的只有归档。这个插件补上删除：会话日志目录、工作区记录、归档与置顶成员、投影缓存记录一起清掉，同时把判断要删什么的用量与目录摆在眼前。

[English](README.md)

---

## 功能

- **真删除。** 删除会话自己的日志目录，从工作区记录里移除，清掉归档与置顶成员，再删投影缓存记录。DSH 原生只有归档。
- **会话家族树。** 主会话、它的 Fork 子会话与子智能体，按 `parentSession` 逐层嵌套；子智能体再派生的子智能体自然更深一层。单会话窗口里单击父节点只选它自己（未选中为空白，选中后按后代显示绿 / 黄 / 红），整个家族用顶部全选。
- **每个会话的用量。** 一个节点只统计它自己发起的请求。主会话额外显示“自身/家族”，斜杠后是整个家族的合计。
- **三色 Token 条。** 缓存命中输入（绿）、缓存未命中输入（蓝）、输出（黄），下面列三条百分比。缓存命中率 = 命中 ÷（命中 + 未命中 + 写缓存）。
- **Fork 去重。** Fork 子会话继承的日志前缀会被跳过，请求再按消息 id 去重，不会把父会话过去的消耗重复计到子会话头上。
- **本地目录。** 每行右侧的文件夹按钮打开该节点自己的目录。路径由 Host 通过 `sessionPersistence.locate` 解析，不按会话名拼路径。
- **批量管理。** 每个家族一张卡片，支持按名称搜索、按最后活跃 / Token / 命中率排序、按类型与工作区筛选、分页、本页全选、删除选中，以及二次确认后的删除全部。
```

</details>

**依据 2 · 源码核查**：[host.js:1014-1024](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L1014-L1024)

返回目标、后代及活动信息。

<details>
<summary>查看原文（11行）</summary>

```text
  return {
    ok: true,
    sessionId,
    removed,
    descendants: removedDescendants,
    kept: gathered.length - selected.length,
    stoppedActivity: removal.stoppedActivity,
    terminalsKilled: removal.terminalsKilled,
    warnings: removal.warnings,
    runtime,
    activity: busy.get(sessionId) ?? [],
```

</details>

#### 缺口

- 没有实际空间和维护频率测量。
  **影响**：无法证明值得承担不可恢复删除。
  **进一步探讨**：在合成数据测家族识别与清理准确性。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 删除前怎样确定范围与活动？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主删除路由只接 POST，通过同源函数后验证会话 ID。处理器读取持久化记录，收集后代，并由宿主家族检查请求的子 ID。每个目标逐项查询活动，有工作且未提交 stop 时拒绝。之后可停止活动、结束所属终端并按后代优先处理。省略 descendants 表示全部，而空数组表示只删根。

#### 证据与依据

**依据 1 · 源码核查**：[host.js:236-264](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L236-L264)

POST、来源检查和参数。

<details>
<summary>查看原文（29行）</summary>

```text
async function serveDelete(ctx, request, response) {
  if (request.method !== 'POST') {
    send(response, 405, { ok: false, code: 'method-not-allowed', message: 'only POST is accepted' })
    return
  }
  if (!sameOrigin(request)) {
    send(response, 403, { ok: false, code: 'untrusted-origin', message: 'the request did not come from this Harness page' })
    return
  }
  let body
  try {
    body = JSON.parse(await readBody(request))
  } catch (error) {
    send(response, 400, { ok: false, code: 'bad-request', message: messageOf(error) })
    return
  }
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : ''
  if (!SESSION_ID.test(sessionId)) {
    send(response, 400, { ok: false, code: 'bad-request', message: 'sessionId is missing or malformed' })
    return
  }
  try {
    send(response, 200, await deleteSession(ctx, sessionId, {
      stop: body?.stop === true,
      descendants: body?.descendants,
    }))
  } catch (error) {
    answer(ctx, response, error, sessionId)
  }
```

</details>

**依据 2 · 源码核查**：[host.js:962-1012](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L962-L1012)

目标、活动与后代顺序。

<details>
<summary>查看原文（51行）</summary>

```text
  // The family is gathered first and the caller's selection is validated against
  // it, so a crafted request can never name a Session outside this lineage.
  const gathered = await gatherDescendants(ctx, sessionId, removal.warnings)
  const selected = selectDescendants(gathered, options.descendants)
  if (selected.length > MAX_DESCENDANTS) {
    throw new DeleteRefusal(
      409,
      'too-many-descendants',
      `一次最多删除 ${MAX_DESCENDANTS} 个子会话，当前选中 ${selected.length} 个，请分批删除。`,
    )
  }

  // Every Session in the set is asked about its own work. The shipped admission
  // answers for the Session it is asked about, so a descendant's running turn or
  // background job would be invisible if only the target were asked.
  const targets = [sessionId, ...selected.map((entry) => entry.id)]
  const busy = await gatherActivities(ctx, targets)
  if (busy.size > 0 && options.stop !== true) {
    const busyList = [...busy.entries()].map(([id, activity]) => ({ sessionId: id, activity }))
    const labels = [...new Set(busyList.flatMap((entry) => entry.activity.map((item) => item.label)))].join('、')
    throw new DeleteRefusal(
      409,
      'session-active',
      busy.size === 1 && busy.has(sessionId)
        ? `这个会话还有未结束的工作（${labels}）。确认后会先停掉它们再删除。`
        : `选中的会话里还有未结束的工作（${labels}，共 ${busy.size} 个会话）。确认后会先停掉它们再删除。`,
      { activity: busy.get(sessionId) ?? [], activeSessions: busyList },
    )
  }

  // Running work goes first, the way the shipped archive's stopActivity does.
  if (busy.size > 0) {
    for (const id of busy.keys()) await stopSessionActivity(ctx, id, removal)
    removal.stoppedActivity = true
  }

  // A deleted Session's shells go with it. Terminals are not part of the shipped
  // archive admission, and the service's own owner cleanup only fires once the
  // Agent is released, which can be long after the log is gone.
  for (const id of targets) removal.terminalsKilled += await killOwnedTerminals(ctx, id, removal)

  // Descendants are Sessions of their own with their own logs: deepest first, so
  // no child outlives its parent by more than one call.
  const removedDescendants = []
  for (const child of selected) {
    const report = await removeSession(ctx, child.id, { dropCache: options.cleanCache !== false })
    report.kind = child.kind
    removedDescendants.push(report)
  }

  const removed = await removeSession(ctx, sessionId, { artifactDirectory, dropCache: options.cleanCache !== false })
```

</details>

**依据 3 · 源码核查**：[host.js:1093-1122](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L1093-L1122)

后代选择默认和验证。

<details>
<summary>查看原文（30行）</summary>

```text
/**
 * Turn a caller's selection into the descendant entries to delete.
 *
 * The selection is validated against the lineage the Host itself gathered, so a
 * crafted request can only ever name Sessions in this family. An omitted field
 * means "all of them"; an empty array means "only the Session itself".
 * @param {Array<{ id: string, depth: number, kind: string }>} gathered - the family.
 * @param {unknown} requested - the ids the Client sent, when it sent any.
 * @returns {Array<{ id: string, depth: number, kind: string }>} deepest first.
 */
function selectDescendants(gathered, requested) {
  if (requested === undefined || requested === null) return gathered
  if (!Array.isArray(requested)) {
    throw new DeleteRefusal(400, 'bad-request', 'descendants 必须是会话 id 数组。')
  }
  const byId = new Map(gathered.map((entry) => [entry.id, entry]))
  const seen = new Set()
  const selected = []
  for (const raw of requested) {
    const id = typeof raw === 'string' ? raw.trim() : ''
    if (id === '' || seen.has(id)) continue
    const entry = byId.get(id)
    if (entry === undefined) {
      throw new DeleteRefusal(
        400,
        'unknown-descendant',
        `${id} 不是这个会话的子会话，已中止，没有删除任何东西。`,
        { sessionId: id },
      )
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败是否保证原日志未改？

**研究主题**：缺陷与关键质疑

#### 完整回答

流程先停止活动和终端，再逐项删除后代和根。单项又先 rm 目录，后更新工作区、投影和通知。后续异常不会从这段代码恢复已删除目录。路由来源校验依据 Host、Origin 与 fetch-site，Host 或 Origin 缺失有放行路径，实际暴露仍依赖宿主监听与认证。不能用此函数作为通用访问隔离证明。

#### 证据与依据

**依据 1 · 源码核查**：[host.js:992-1012](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L992-L1012)

活动和后代先执行。

<details>
<summary>查看原文（21行）</summary>

```text
  // Running work goes first, the way the shipped archive's stopActivity does.
  if (busy.size > 0) {
    for (const id of busy.keys()) await stopSessionActivity(ctx, id, removal)
    removal.stoppedActivity = true
  }

  // A deleted Session's shells go with it. Terminals are not part of the shipped
  // archive admission, and the service's own owner cleanup only fires once the
  // Agent is released, which can be long after the log is gone.
  for (const id of targets) removal.terminalsKilled += await killOwnedTerminals(ctx, id, removal)

  // Descendants are Sessions of their own with their own logs: deepest first, so
  // no child outlives its parent by more than one call.
  const removedDescendants = []
  for (const child of selected) {
    const report = await removeSession(ctx, child.id, { dropCache: options.cleanCache !== false })
    report.kind = child.kind
    removedDescendants.push(report)
  }

  const removed = await removeSession(ctx, sessionId, { artifactDirectory, dropCache: options.cleanCache !== false })
```

</details>

**依据 2 · 源码核查**：[host.js:1057-1082](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L1057-L1082)

rm 早于工作区与投影清理。

<details>
<summary>查看原文（26行）</summary>

```text
  // The Session's own directory: the current log, every retained historical
  // generation, and any future session-local artifact live in it.
  if (directory !== undefined) {
    report.artifactDirectory = directory
    await rm(directory, { recursive: true, force: true })
    report.removed = true
  }

  // Workspace accounting: the sidebar groups Sessions by Workspace records, and
  // the registry-global archive/pin sets are Session id arrays.
  await detachFromWorkspaces(ctx, sessionId, report)

  // The projection checkpoint is a fold shortcut and disposable; leaving it
  // would keep a record for a Session that no longer exists. A caller that
  // asked to keep the cache skips this, so the two choices stay separate.
  if (known.dropCache !== false) {
    report.projectionCheckpoint = await dropProjectionCheckpoint(ctx, sessionId, report)
  } else {
    report.cacheKept = true
  }

  // Connected Clients drop the row from their session list, exactly as they do
  // when the Session controller reports a disposed Session.
  ctx.emit('api-session/removed', sessionId)

  return report
```

</details>

**依据 3 · 源码核查**：[host.js:1811-1837](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L1811-L1837)

基于请求头的来源判断。

<details>
<summary>查看原文（27行）</summary>

```text
 * attack apart. An absent `Host` or `Origin` is not a cross-site request — the
 * Desktop build's proxy strips both, and only a non-page client omits them.
 * @param {import('node:http').IncomingMessage} request - the request.
 * @returns {boolean} whether the request may proceed.
 */
function sameOrigin(request) {
  const host = request.headers.host
  if (host !== undefined && !loopbackAuthority(host)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/**
 * Whether a `Host` header names a loopback authority.
 * @param {string} host - the request's Host header.
 * @returns {boolean} whether it is loopback.
 */
function loopbackAuthority(host) {
  const lower = host.toLowerCase()
  const name = lower.startsWith('[') ? lower.slice(0, lower.indexOf(']') + 1) : lower.split(':')[0]
  return name === '127.0.0.1' || name === 'localhost' || name === '[::1]'
```

</details>

#### 缺口

- 真实宿主监听和认证、活动变化以及中途失败未验收。
  **影响**：当前无法保证生产会话安全清理。
  **进一步探讨**：在隔离环境验证非允许访问、活动变化和故障后真实磁盘状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时可以观察，何时退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

有明确本机隔离、兼容宿主和可恢复数据副本的管理者，可以先观察家族清单与活动判断，核对合成父子会话、保持原始数据。读取不到定位、出现非预期后代或入口访问边界未核对，就停止并回宿主归档。持续成本包括手工核对和备份，删除后的恢复取决于是否有可靠副本。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:39-61](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/README.zh-CN.md#L39-L61)

作者说明家族界面、路由和活动。

<details>
<summary>查看原文（23行）</summary>

```text
## 用法

**单个会话。** 在会话的 `⋯` 菜单里选「删除会话」。对话框会画出家族树，显示这个会话自身的用量与家族合计、缓存分布，每一行都有文件夹按钮。

**批量。** 点工作区标题栏里的垃圾桶图标（在搜索图标左侧）。每个家族是一张卡片，可以勾选、筛选、排序、翻页，然后删除选中或删除全部。

删除前会先问 DSH 自己的活动准入：有正在运行的工作会先提示，确认后才停掉。

## HTTP 接口

挂在 `ctx.webServer` 上的同源路由：

| 路由 | 方法 | 用途 |
|---|---|---|
| `/better-dsh-session-deletetool/inspect?sessionId=…` | GET | 状态、家族行、每行用量与目录 |
| `/better-dsh-session-deletetool/delete` | POST | `{ sessionId, stop?, descendants? }` |
| `/better-dsh-session-deletetool/catalog` | GET | 全部会话及用量与目录，附全局汇总 |
| `/better-dsh-session-deletetool/delete-batch` | POST | `{ roots: [{ sessionId, descendants? }], stop?, cleanCache? }` |
| `/better-dsh-session-deletetool/open-directory` | POST | `{ sessionId }`，打开该会话目录 |
| `/better-dsh-session-deletetool/open-cache` | POST | 打开 DSH 的投影缓存目录 |
| `/better-dsh-session-deletetool/refresh-stats` | POST | 清空插件的用量缓存 |

所有路由都带回环与同源校验，别的页面访问不到。
```

</details>

**依据 2 · 源码核查**：[host.js:942-957](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L942-L957)

缺少后端定位时拒绝。

<details>
<summary>查看原文（16行）</summary>

```text
async function deleteSession(ctx, sessionId, options) {
  const persistence = ctx.get('sessionPersistence')
  if (persistence === undefined || typeof persistence.stat !== 'function') {
    throw new DeleteRefusal(503, 'persistence-unavailable', 'sessionPersistence is not mounted in this profile')
  }

  const snapshot = await persistence.stat(sessionId)
  const header = snapshot?.header
  if (header === undefined) {
    throw new DeleteRefusal(404, 'session-not-found', `找不到会话 ${sessionId} 的持久化记录。`)
  }

  const artifactDirectory = locateDirectory(persistence, header)
  if (artifactDirectory === undefined) {
    throw new DeleteRefusal(501, 'no-artifact', '当前持久化后端不提供会话工件路径，无法删除文件。')
  }
```

</details>

**依据 3 · 源码核查**：[host.js:1057-1075](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L1057-L1075)

物理删除及后续清理。

<details>
<summary>查看原文（19行）</summary>

```text
  // The Session's own directory: the current log, every retained historical
  // generation, and any future session-local artifact live in it.
  if (directory !== undefined) {
    report.artifactDirectory = directory
    await rm(directory, { recursive: true, force: true })
    report.removed = true
  }

  // Workspace accounting: the sidebar groups Sessions by Workspace records, and
  // the registry-global archive/pin sets are Session id arrays.
  await detachFromWorkspaces(ctx, sessionId, report)

  // The projection checkpoint is a fold shortcut and disposable; leaving it
  // would keep a record for a Session that no longer exists. A caller that
  // asked to keep the cache skips this, so the two choices stay separate.
  if (known.dropCache !== false) {
    report.projectionCheckpoint = await dropProjectionCheckpoint(ctx, sessionId, report)
  } else {
    report.cacheKept = true
```

</details>

#### 缺口

- 跨宿主和备份恢复未测。
  **影响**：无法预测失败后的恢复代价。
  **进一步探讨**：在一次性会话复制上核查家族与故障恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 隔离保留期能否降低不可恢复错误？

**研究主题**：新假设与验证

#### 完整回答

可试验先将确认的日志放入隔离保留区，保存选定家族、确认摘要和后续清理结果，再延迟永久清除。当前直接 rm 后更新记账，适合作为比较基线。比较中途错误、恢复成功和存储负担；若宿主无法可靠停用或重新关联会话，保留期不能承诺恢复。

#### 证据与依据

**依据 1 · 源码核查**：[host.js:1057-1075](https://github.com/Lzcdebear/better-dsh-session-deletetool/blob/a6300399996f7b41beec34f25b505f39c5ad7e23/host.js#L1057-L1075)

当前顺序给出对照点。

<details>
<summary>查看原文（19行）</summary>

```text
  // The Session's own directory: the current log, every retained historical
  // generation, and any future session-local artifact live in it.
  if (directory !== undefined) {
    report.artifactDirectory = directory
    await rm(directory, { recursive: true, force: true })
    report.removed = true
  }

  // Workspace accounting: the sidebar groups Sessions by Workspace records, and
  // the registry-global archive/pin sets are Session id arrays.
  await detachFromWorkspaces(ctx, sessionId, report)

  // The projection checkpoint is a fold shortcut and disposable; leaving it
  // would keep a record for a Session that no longer exists. A caller that
  // asked to keep the cache skips this, so the two choices stay separate.
  if (known.dropCache !== false) {
    report.projectionCheckpoint = await dropProjectionCheckpoint(ctx, sessionId, report)
  } else {
    report.cacheKept = true
```

</details>

#### 缺口

- 保留期方案未实现。
  **影响**：恢复正确性和存储成本未知。
  **进一步探讨**：对合成树模拟后续记账失败并比较恢复。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
