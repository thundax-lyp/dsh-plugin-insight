# dsh-session-manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[37d7517](https://github.com/dream12347/dsh-session-manager/tree/37d751721b28464b4985168243e06df73adb06bd)

<!-- BEGIN META -->
[![GitHub ★ 107](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=107&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dream12347/dsh-session-manager) [![npm 30d 15,242](https://img.shields.io/static/v1?label=npm+30d&message=15%2C242&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-session-manager) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-session-manager)
<!-- END META -->

> **功能**：为 DSH Web 提供会话整理、回收站恢复、清除和工作区管理。

> **亮点**：[Q01](#research-q01) 把归档、恢复和目录清理集中到面板。

> **主要限制**：[Q02](#research-q02) 溢出和冲突会清理副本，永久清除没有二次运行检查。

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
  - [Q01 · 此插件如何从官方归档推进到回收站？](#detail-section-11)
  - [Q02 · 恢复和清除遇到冲突时做什么？](#detail-section-12)
  - [Q03 · 什么时候回收站值得替代手工整理？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用多个工作区的用户需要管理累积会话。

使用官方归档与手工查找日志。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 回收站 | 保存并恢复近期删除 | 十条上限 |
| 清除 | 移除日志目录 | 应在可弃用数据演练 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 插槽及 Host 服务 | 必需 | 列会话和修改状态 | 版本变化需验收 |
| 本地会话存储 | 回收站必需 | 搬移和恢复记录 | 无可定位目录会失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 整理 | 从面板选择测试会话 | 区分归档和回收站 |
| 恢复 | 从回收站选中条目 | 核对原路径和侧栏 |
| 复验 | 重启或切浏览器 | 检查条目和日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 验证会话类型和版本 | 准备日志副本 |
| 持续 | 成本未知 | 留意十条上限及工作区状态 | 按需要归档 |
| 失败 | 恢复时间未知 | 恢复独立日志副本 | 永久清除无恢复入口 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话整理 | 集中归档恢复和清理 | 实际找回时间与一致性 |

> **思考**：[Q02](#research-q02) 溢出和冲突会清理副本，永久清除没有二次运行检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把归档、恢复和目录清理集中到面板。

[Q02](#research-q02) 插件有 mutation lock 和补偿，持久化与目录仍是分步操作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 溢出和冲突会清理副本，永久清除没有二次运行检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先验收恢复、溢出和重新打开会话。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态确认主要状态路径，未执行宿主。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 删除恢复清除和 README；未运行目标。
- 下一步：以活动、关闭、冲突、溢出和重启覆盖恢复。

**分析版本**

- **仓库**：[dream12347/dsh-session-manager](https://github.com/dream12347/dsh-session-manager)
- **版本号**：0.2.3（[固定提交 37d7517](https://github.com/dream12347/dsh-session-manager/tree/37d751721b28464b4985168243e06df73adb06bd)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照官方归档测找回和清理的耗时与丢失。

以活动、关闭、冲突、溢出和重启覆盖恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 448 | — | — | 6480 |
| .js | source | 2 | 3659 | 3543 | 130 | — |
| .ts | source | 5 | 4382 | 3798 | 397 | — |
| .ts | test | 1 | 16 | 13 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/dream12347/dsh-session-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/dream12347/dsh-session-manager/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/dream12347/dsh-session-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：回收站能否让整理 DSH 会话时的恢复行为可预期？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 此插件如何从官方归档推进到回收站？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面板把官方会话列表和插件回收站放到同一处。Host 在 mutation lock 内拒绝状态为 running 的 Agent，归档后只移动非 live 会话目录，live 空闲会话仅记录条目。与官方归档相比，回收站支持恢复和显式清除目录，但当前进程内状态仍要区分。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:93-97](https://github.com/dream12347/dsh-session-manager/blob/37d751721b28464b4985168243e06df73adb06bd/README.md#L93-L97)

作者列实际交互。

```text
3. 主列表为未归档会话；底部「已归档会话」折叠区可展开查看、**恢复**或删除归档会话
4. 删除会话 → 进入底部「回收站」折叠区（保留最近 10 条）
5. 回收站内可 **恢复**（回到会话列表）或 **彻底删除**（永久清除，不可恢复）
6. 每行操作：**继续会话**（打开并进入对话）、**暂停**（停止正在运行的回合）、**统计**（展开近期活动）、**文件夹**（打开日志目录）、**删除**
7. 工作区标题右侧（悬停显示）：**置于顶部**（挪到最前）、**重命名**、**删除**（红色，二次确认）
```

**依据 2 · 源码核查**：[src/index.ts:441-469](https://github.com/dream12347/dsh-session-manager/blob/37d751721b28464b4985168243e06df73adb06bd/src/index.ts#L441-L469)

持久记录、活动 Agent 与拒绝。

<details>
<summary>查看原文（29行）</summary>

```text
        try {
          await withMutationLock(async () => {
            const headers = (await ctx.sessionPersistence.list()).map(compatHeader)
            const meta = headers.find((header) => header.id === id)
            const agent = ctx.agents.get(id)
            const live = agent !== undefined

            if (agent?.status === 'running') {
              respond(res, 409, { ok: false, error: 'session-live' })
              return
            }

            let originalPath: string | undefined
            if (meta !== undefined) {
              const location = locateSession(ctx, meta)
              if (location === undefined) {
                respond(res, 500, { ok: false, error: 'no-artifact-location' })
                return
              }
              originalPath = dirname(location.path)
            }

            const workspace = ctx.storageDomain.get('workspace')
            const wasArchived = workspace !== undefined
              && (workspace.global.get() as { archivedSessionIds: string[] }).archivedSessionIds.includes(id)
            const trashPath = trashSessionDir(id)
            let archiveStarted = false
            let artifactMoved = false
            let failureCode = 'delete-failed'
```

</details>

**依据 3 · 源码核查**：[src/index.ts:470-495](https://github.com/dream12347/dsh-session-manager/blob/37d751721b28464b4985168243e06df73adb06bd/src/index.ts#L470-L495)

归档与有条件搬移。

<details>
<summary>查看原文（26行）</summary>

```text

            try {
              failureCode = 'archive-failed'
              archiveStarted = true
              await workspaceRegistry(ctx).archiveSession(id)
              failureCode = 'delete-failed'

              {
                const currentWorkspace = ctx.storageDomain.get('workspace')
                if (currentWorkspace !== undefined) {
                  const current = currentWorkspace.global.get() as { archivedSessionIds: string[] }
                  if (!current.archivedSessionIds.includes(id)) {
                    const next = { ...current, archivedSessionIds: [...current.archivedSessionIds, id] }
                    await currentWorkspace.global.set(next)
                    syncRegistryState(ctx, next)
                    ctx.logger.debug(`[dsh-session-manager] patched archived set for ${id} (stale registry cache)`)
                  }
                }
              }

              if (!live && originalPath !== undefined && existsSync(originalPath)) {
                await mkdir(trashRoot(), { recursive: true })
                await rm(trashPath, { recursive: true, force: true })
                await rename(originalPath, trashPath)
                artifactMoved = true
                ctx.logger.debug(`[dsh-session-manager] moved ${id} artifact to trash`)
```

</details>

#### 缺口

- 未在不同 Host 构建复验
  **影响**：会话状态和侧栏一致性未知
  **进一步探讨**：分别测试非 live、live 空闲及运行会话

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 恢复和清除遇到冲突时做什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

新条目超过十条时裁剪列表，尝试清理旧的 trash 目录；清理失败被吞掉。恢复发现原始目录已被重建会删掉回收站副本。永久清除处理回收站和原始目录，然后删记录；与初次删除不同，这段没有再检查 Agent running。锁只证实插件内串行，跨标签页重新打开或部分文件删除后的实际结果待验。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:498-534](https://github.com/dream12347/dsh-session-manager/blob/37d751721b28464b4985168243e06df73adb06bd/src/index.ts#L498-L534)

溢出清理及补偿。

<details>
<summary>查看原文（37行）</summary>

```text
              const entries = getEntries()
              const existingIndex = entries.findIndex((entry) => entry.sessionId === id)
              let next: TrashEntry[]
              let overflow: TrashEntry[] = []
              if (existingIndex >= 0) {
                next = entries.map((entry, index) => index === existingIndex ? { ...entry, deletedAt: Date.now() } : entry)
              } else {
                next = [...entries, { sessionId: id, cwd: meta?.cwd, originalPath, deletedAt: Date.now() }]
                if (next.length > TRASH_LIMIT) {
                  overflow = next.slice(0, next.length - TRASH_LIMIT)
                  next = next.slice(next.length - TRASH_LIMIT)
                }
              }
              await setEntries(next)
              for (const entry of overflow) {
                await rm(trashSessionDir(entry.sessionId), { recursive: true, force: true }).catch(() => {})
              }

              respond(res, 200, { ok: true })
            } catch (error) {
              if (artifactMoved && originalPath !== undefined && existsSync(trashPath) && !existsSync(originalPath)) {
                try {
                  await mkdir(dirname(originalPath), { recursive: true })
                  await rename(trashPath, originalPath)
                } catch (rollbackError) {
                  ctx.logger.warn(`[dsh-session-manager] artifact rollback failed for ${id}:`, rollbackError)
                }
              }
              if (archiveStarted && !wasArchived) {
                try {
                  await unarchive(ctx, id)
                } catch (rollbackError) {
                  ctx.logger.warn(`[dsh-session-manager] archive rollback failed for ${id}:`, rollbackError)
                }
              }
              ctx.logger.warn(`[dsh-session-manager] ${failureCode} for ${id}:`, error)
              respond(res, 500, { ok: false, error: failureCode })
```

</details>

**依据 2 · 源码核查**：[src/index.ts:578-606](https://github.com/dream12347/dsh-session-manager/blob/37d751721b28464b4985168243e06df73adb06bd/src/index.ts#L578-L606)

恢复时的原目录冲突。

<details>
<summary>查看原文（29行）</summary>

```text
            // Move the artifact back only when the trash actually holds one; a
            // live session's artifact was never moved, so nothing to do here.
            const from = trashSessionDir(id)
            if (existsSync(from)) {
              if (entry.originalPath === undefined) {
                ctx.logger.warn(`[dsh-session-manager] restore ${id}: artifact exists in trash but entry has no original path`)
                return respond(res, 500, { ok: false, error: 'no-original-path' })
              }
              if (existsSync(entry.originalPath)) {
                // The original location was recreated (a live session kept
                // writing there): keep the newer file, discard the trash copy.
                await rm(from, { recursive: true, force: true })
                ctx.logger.warn(`[dsh-session-manager] restore ${id}: original path already exists, discarding trash copy`)
              } else {
                await mkdir(dirname(entry.originalPath), { recursive: true })
                await rename(from, entry.originalPath)
                ctx.logger.debug(`[dsh-session-manager] restored ${id} artifact from trash`)
              }
            } else {
              ctx.logger.debug(`[dsh-session-manager] restore ${id}: no artifact in trash (live or blank session)`)
            }

            // Only now — artifact safely back — un-archive and drop the entry.
            await unarchive(ctx, id)
            await setEntries(entries.filter((candidate) => candidate.sessionId !== id))
            respond(res, 200, { ok: true })
          })
        } catch (error) {
          ctx.logger.warn('[dsh-session-manager] restore failed:', error)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:624-647](https://github.com/dream12347/dsh-session-manager/blob/37d751721b28464b4985168243e06df73adb06bd/src/index.ts#L624-L647)

永久清除与落盘顺序。

<details>
<summary>查看原文（24行）</summary>

```text
        const id = parseSessionId(body)
        if (id === undefined) return respond(res, 400, { ok: false, error: 'invalid-session-id' })

        try {
          await withMutationLock(async () => {
            const entries = getEntries()
            const entry = entries.find((candidate) => candidate.sessionId === id)
            if (entry === undefined) {
              respond(res, 404, { ok: false, error: 'trash-entry-not-found' })
              return
            }

            // Remove the artifact: from the trash if it was moved there, and from
            // the original location too (a live session's artifact stayed put).
            await rm(trashSessionDir(id), { recursive: true, force: true })
            if (entry.originalPath !== undefined) {
              await rm(entry.originalPath, { recursive: true, force: true })
            }
            await setEntries(entries.filter((candidate) => candidate.sessionId !== id))
            respond(res, 200, { ok: true })
          })
        } catch (error) {
          ctx.logger.warn('[dsh-session-manager] purge failed:', error)
          respond(res, 500, { ok: false, error: 'purge-failed' })
```

</details>

#### 缺口

- 未复现文件恢复冲突和正在使用时 purge
  **影响**：不能证明无日志损失或残留
  **进一步探讨**：用副本复现恢复冲突、清除部分失败和重新激活

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么时候回收站值得替代手工整理？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在独立 profile 以无关会话演练删除恢复、超限和重启，保持待保留日志的独立副本。与官方归档对照，比较找到目标会话和恢复的用时。若两个浏览器状态不一致或副本恢复不清楚，则使用官方归档。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:122-142](https://github.com/dream12347/dsh-session-manager/blob/37d751721b28464b4985168243e06df73adb06bd/README.md#L122-L142)

Host 服务、浏览器状态及作者兼容声明。

<details>
<summary>查看原文（21行）</summary>

```text
| Host | `src/index.ts` 注册 7 条路由：`POST /delete`（归档 + 非 live 会话文件移入回收站 + 记录条目）、`POST /restore`（文件移回 + 取消归档 + 删除条目）、`POST /purge`（清除回收站与原位置文件 + 删除条目）、`GET /trash`（回收站列表）、`POST /open-folder`（打开日志目录）、`POST /pause`（暂停运行中会话）、`GET|POST /compaction-threshold`（读写全局压缩阈值）。通过 `ctx.sessionPersistence` 定位会话、`ctx.workspaceRegistry` 归档/取消归档、`ctx.storageDomain` 持久化回收站条目、归档集合与阈值；`ctx.agents` 检测运行中的会话并拒绝删除 |
| Client | `src/client/index.ts` 通过官方 `settings.section` 插槽注册独立分栏，用 `useSessions` / `useWorkspaces` 标准数据源列出会话（含归档/回收站分组），删除/恢复/彻底删除调用 host 路由；抽屉通过 `sessions.list`（ObservableSnapshot）订阅实时列表；彻底删除的会话 id 记录在浏览器 localStorage，避免 live 会话删除后刷新「复活」 |

- **未读机制**：手动未读集保存在浏览器 localStorage 的共享 key `dsh.session-unread.v1`（`{version:1, ids:[]}` 格式，与其他会话管理插件互通）；官方状态点（琥珀/绿色/转圈）由官方 `SessionSummary` 的 `pendingInteraction` / `completed` / `running` 字段驱动，点击就地已读通过清除官方提醒标记实现，无需打开会话；侧边栏的蓝色未读点由 MutationObserver 装饰官方树节点（官方行元素没有会话 id 属性，故按标题文本匹配）
- **压缩阈值全局生效**：保存在存储域（`dsh_delete_session` 的 `thresholdRatio`）；如果默认 Agent 预设是用户预设，则同时写入 agent-presets 服务解析出的 `agent.cordis.yml`，系统预设文件保持只读。host 在每个 `agent/pre-step` 钩子里把阈值写入所有预设的压缩引擎配置，因此对所有 Agent 预设的会话统一生效，重启后依然有效
- 删除时先走官方归档通道：侧边栏立即隐藏该会话
- 回收站条目持久化在 DSH 存储域（`~/.dsh/storages/dsh_delete_session.json`），文件在 `~/.dsh/dsh-delete-session-trash/`
- 工作区记账（`sessionIds` 槽位）在下次启动时由 registry 重建索引自动对账，无需手动编辑文件
- 无系统提示词改动、无模型工具新增，对 token 与模型行为零影响

## 限制

- **不能删除正在运行的会话**（按钮禁用并拒绝删除），多标签页场景请先在别处确认该会话已停止
- **子代理会话可删除**（非运行中），包括主会话已删除的「孤儿子代理」——不会再有无法清理的残留会话
- live 会话（当前进程内打开的会话）删除后，其内存状态由 DSH 在重启时彻底清理
- 已彻底删除的会话 id 会保留在浏览器 localStorage（防止刷新后重新出现）与归档集合中（无害残留，不显示）
- 侧边栏未读点按标题文本匹配，存在重复标题的会话时两者会共享同一个点（会话管理抽屉内不受影响，按真实会话 id 精确标记）

## 兼容性

当前版本适配 DSH `0.1.1-rc.1` 与 `0.2.0-rc.2`（依赖 `settings.section` / `settings.general.item` / `conversation.session.header.utilities` 插槽与 `ctx.sessionPersistence` / `ctx.workspaceRegistry` / `ctx.agents` / `ctx.storageDomain` / `ctx.agentPresets` 服务）。DSH 版本升级后如插槽或服务 API 变化，需要同步适配。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:498-514](https://github.com/dream12347/dsh-session-manager/blob/37d751721b28464b4985168243e06df73adb06bd/src/index.ts#L498-L514)

回收站上限的触发。

<details>
<summary>查看原文（17行）</summary>

```text
              const entries = getEntries()
              const existingIndex = entries.findIndex((entry) => entry.sessionId === id)
              let next: TrashEntry[]
              let overflow: TrashEntry[] = []
              if (existingIndex >= 0) {
                next = entries.map((entry, index) => index === existingIndex ? { ...entry, deletedAt: Date.now() } : entry)
              } else {
                next = [...entries, { sessionId: id, cwd: meta?.cwd, originalPath, deletedAt: Date.now() }]
                if (next.length > TRASH_LIMIT) {
                  overflow = next.slice(0, next.length - TRASH_LIMIT)
                  next = next.slice(next.length - TRASH_LIMIT)
                }
              }
              await setEntries(next)
              for (const entry of overflow) {
                await rm(trashSessionDir(entry.sessionId), { recursive: true, force: true }).catch(() => {})
              }
```

</details>

#### 缺口

- 缺少用户操作和恢复用时数据
  **影响**：不能量化收益
  **进一步探讨**：比较两个标签页、重启和超限测试结果

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
