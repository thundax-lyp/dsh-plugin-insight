# dsh-session-manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b5f1887](https://github.com/hkkz9522/dsh-session-manager/tree/b5f188735bbb8b7c041b1f3d6c156c51f08615ba)

<!-- BEGIN META -->
[![GitHub ★ 106](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hkkz9522/dsh-session-manager) [![npm 30d 15,242](https://img.shields.io/static/v1?label=npm+30d&message=15%2C242&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-session-manager) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-session-manager)
<!-- END META -->

> **功能**：管理工作区与会话，支持批量整理、跨工作区迁移、预设改写和标注。

> **亮点**：[Q01](#research-q01) 保留会话历史并调整工作目录和归属。

> **主要限制**：[Q02](#research-q02) 改写跨文件、运行时和注册表，崩溃恢复需验证。

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
  - [Q01 · 怎样在工作区调整后继续原会话？](#detail-section-11)
  - [Q02 · 发布失败怎样保留会话文件？](#detail-section-12)
  - [Q03 · 应怎样验证迁移的价值？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户重组工作区或预设后希望继续现有会话。

官方归档或新建会话后手工转移上下文。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 移动会话 | 保留历史并更新 cwd | 依赖工件和运行时能力 |
| 会话整理 | 归档、标注和批处理 | 涉及文件操作先演练 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 及工件布局 | 必需 | 读取历史、投影和索引 | 版本变化需复验 |
| 可重绑持久化写入者 | live 迁移需要 | 保持现有会话写入 | 不支持则拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 使用测试副本 | 保存独立日志 |
| 迁移 | 在面板选目标路径 | 检查拒绝或迁移结果 |
| 复核 | 重开并比对历史和 cwd | 检查注册表和写入者 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 确认日志格式和宿主 | 准备恢复副本 |
| 持续 | 工时未知 | 核对批量结果与活动任务 | 处理格式及版本差异 |
| 失败 | 工时未知 | 按保留路径恢复 | 对照工件和成员关系 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工作区重组 | 保留历史并更改归属 | 实际恢复成功率和节时 |

> **思考**：[Q02](#research-q02) 改写跨文件、运行时和注册表，崩溃恢复需验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 保留会话历史并调整工作目录和归属。

[Q02](#research-q02) 发布与 rollback 分开，失败保留可恢复路径。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 改写跨文件、运行时和注册表，崩溃恢复需验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先验证冷会话，再验证 live 和异常。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认主要发布回滚步骤，未运行 Host。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/session-files.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定移动、写入和恢复代码，未执行宿主。
- 下一步：核对原件、目标工件、writer 与工作区映射及异常恢复。

**分析版本**

- **仓库**：[hkkz9522/dsh-session-manager](https://github.com/hkkz9522/dsh-session-manager)
- **版本号**：0.7.5（[固定提交 b5f1887](https://github.com/hkkz9522/dsh-session-manager/tree/b5f188735bbb8b7c041b1f3d6c156c51f08615ba)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照新会话测上下文保留和恢复。

核对原件、目标工件、writer 与工作区映射及异常恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 609 | — | — | 9116 |
| .js | source | 8 | 12439 | 10804 | 1204 | — |
| .mjs | source | 4 | 292 | 222 | 49 | — |
| .mjs | test | 47 | 16869 | 13001 | 1711 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/hkkz9522/dsh-session-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=21&color=737b86&logo=github)](https://github.com/hkkz9522/dsh-session-manager/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/hkkz9522/dsh-session-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何迁移现有会话和 Agent 预设并保住历史？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 怎样在工作区调整后继续原会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面板提供批量归档、标注、预设和工作区移动。实际跨工作区移动不只是改列表，代码重写冷日志工作目录并准备新路径，同时更新运行时 header 与 writer。相对新建会话，用户可沿用已有历史。已有相同 cwd 时可单独修复成员关系，路径冲突则提示处理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-43](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/README.md#L20-L43)

用户入口和能力范围。

<details>
<summary>查看原文（24行）</summary>

```text

- **Delete** is irreversible and always asks for confirmation. Subagent sessions and transient blank placeholders (no persisted artifact) cannot be deleted.
- **Archive / Unarchive** moves a session in and out of the active list without touching its disk content.
- **Move to workspace** keeps history, title, archive state and derived-session relationships intact, rewrites the session's `cwd` to the target workspace, synchronizes the runtime `workingDirectory` projection for active agents, and updates the live writer's header in place so any pending tool calls keep landing on the new path. When the session's `cwd` already equals the target workspace path but its membership was never recorded, only the missing membership is repaired: no `cwd` rewrite, no artifact rewrite or move, and no session restart.
- **Migrate Agent preset** rewrites the latest `agent-preset/selected` event (or the session header if no such event exists) so a session whose preset was renamed or removed can resume. Message history is never altered.

### 1.2 Session shortcuts

- **Favorites / Review-later** are manual flags that survive archive and session end; neither is cleared automatically.
- **Search** matches title, session ID, note and tags case-insensitively, trims whitespace, and never reads chat history.
- **Filters and sorting** combine a workspace selector (All / Ungrouped / specific) with an archive filter (All / Active / Archived), then layer favorites / review, tag and priority filters on top. Sort by recently updated (default), least recently updated, newest created, oldest created, name ascending (A-Z), name descending (Z-A), or **priority (1 → 5)**.
- **Priority** is a dropdown **1 Highest, 2 High, 3 Normal, 4 Low, 5 Lowest**, default **3 (Normal)**; legacy `null` priorities are normalized to 3.
- **Tags / Notes**: up to 20 tags per session (≤ 32 characters each) and a 2000-character note. Both English `,` and Chinese `，` are separators, whitespace is trimmed, duplicate tags are merged case-insensitively.
- **AI-assisted tagging** is manual and opt-in: **Copy Prompt** writes a structured prompt (Chinese or English, matched to the active UI) to the clipboard; **Import** parses the clipboard JSON (tolerating Markdown fences, conversational wrappers, smart quotes, stray backslashes and a leading BOM), validates it against the same limits, and populates the editor fields. Neither button calls a model automatically.
- Annotations live in plain text under the DSH home (`dsh-session-manager/annotations.v1.json`), keyed by session ID. Same-origin client instances stay in sync via `BroadcastChannel`. Saves are durable across crashes; revision conflicts surface a "load latest" prompt.

### 1.3 Bulk management

- **Batch process mode**: click the toggle in the panel header to reveal row checkboxes, a **Select all in filter / Clear selection** toolbar pair, and the bulk action bar. Exiting batch process clears the current selection.
- **Action bar** lists every batch action:
  - **Annotation toggles**: **Archive / Unarchive / Favorite / Unfavorite / Mark for review / Clear review flag**.
  - **Mutating actions**: **Add tags / Clear tags / Set priority / Move to workspace / Migrate preset / Delete session**.
- **Confirmation flow**:
  - Non-destructive actions (archive / unarchive / favorite / unfavorite / review / unreview / add-tags / clear-tags / set-priority / move / preset-migrate) fire immediately and report per-session results in a **result dialog** with **Success / Failed / Skipped** groups and a one-click **Retry failed** that re-arms the failed IDs into the selection.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:938-964](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/lib/index.js#L938-L964)

相同路径与真实移动分界。

<details>
<summary>查看原文（27行）</summary>

```text
     * already lives under the target workspace path (same-path move). DSH 0.2.x
     * keeps "cwd matches the workspace path" and "the workspace accounts for
     * the session" as separate facts, so a matching cwd alone must not be
     * reported as success.
     *
     * Conservative policy. The official domain offers no cross-record
     * transaction (single-record updates on one serialized storage unit), and
     * attachSession() validates the session cwd against the workspace path --
     * so an account held by a DIFFERENT workspace can never be restored
     * through the official API once it is removed. Automatic migration would
     * therefore risk destroying the only remaining account if the target
     * attach then failed. Hence:
     *   - no workspace accounts for the session: complete the target
     *     membership through attachSession(), after pre-checking every
     *     condition it validates so a predictable rejection fails before any
     *     write;
     *   - already accounted by the target and by nobody else: idempotent
     *     no-op, no write;
     *   - accounted by another workspace: refuse with a membership-conflict
     *     error; no automatic cross-record migration;
     *   - membership state cannot be confirmed: refuse.
     *
     * No artifact is rewritten, no cwd is touched, and no live session is
     * restarted. A true cross-workspace move re-homes the artifact first and
     * is a separate, unchanged path.
     *
     * @returns {status: "already-member"|"attached", attached: boolean}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1300-1318](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/lib/index.js#L1300-L1318)

工件和 cwd 投影。

<details>
<summary>查看原文（19行）</summary>

```text
        if (typeof expectedVersion === "number") newHeader.version = expectedVersion;
        const root = typeof dshHomePath === "function" ? dshHomePath("sessions") : undefined;
        await assertSessionDirectory(root, dirname(oldPath), sessionId);
        await assertSessionDirectory(root, dirname(newPath), sessionId, { allowMissing: true });
        try {
          await lstat(newPath);
          throw new Error("目标位置已有会话工件，拒绝覆盖");
        } catch (error) { if (error.code !== "ENOENT") throw error; }
        if (oldPath === newPath) throw new Error("会话源路径与目标路径相同，但 cwd 不一致，拒绝覆盖");
        // Issue #42: a cold log is the only authority its working-directory
        // projection folds from on the next resume, so re-home it together
        // with the artifact header. Live sessions get the equivalent event
        // through the host path once the artifact has been published.
        const bodyRehome = liveSession === void 0
          ? rehomeColdWorkingDirectory(rest, targetPath)
          : { rest, status: "live" };
        const bytes = await encodeArtifact(JSON.stringify(newHeader), bodyRehome.rest, newPath.endsWith(".zstd"));
        await mkdir(dirname(newPath), { recursive: true });
        const tempNew = await writeTempFile(newPath, bytes);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1356-1375](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/lib/index.js#L1356-L1375)

活跃写入者及工作区更新。

<details>
<summary>查看原文（20行）</summary>

```text
        try {
          if (state !== void 0) {
            state.meta = { ...state.meta, ...newHeader, cwd: targetPath };
            state.materialized = true;
          }
          coordinator?.preparations?.invalidate?.(sessionId);
          if (liveSession !== void 0) {
            liveSession.header = Object.freeze({ ...newHeader });
            rebindLiveWriter(persistence, sessionId, newHeader);
          }
          registry.headers?.set?.(sessionId, { ...newHeader });
          registry.sessionPaths?.set?.(sessionId, targetPath);
          registry.invalidSessionPaths?.delete?.(sessionId);

          await registry.enqueueOperation(async () => {
            for (const id of fromWorkspaceIds) {
              const entity = registry.list().find((candidate) => candidate.id === id);
              if (entity === void 0) continue;
              await entity.detachSession(sessionId);
              detachedFrom.push(id);
```

</details>

#### 缺口

- 未验证真实活跃任务迁移
  **影响**：不能确定在途工具落点和恢复体验
  **进一步探讨**：在隔离工作区验证新工具 cwd、历史和重开

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 发布失败怎样保留会话文件？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

移动先写临时文件并隐藏旧工件，再发布新路径；失败尝试还原。owner 不一致时拒绝，后续注册表出错会试图逆向恢复并报告不完整。冷重写另有备份、发布和回滚阶段，回滚失败保留恢复文件。依赖 Host 可重绑 writer、能处理实际日志格式，源码可见故障补偿，未证明崩溃中间点全部可恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:76-84](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/lib/index.js#L76-L84)

不具备可重绑 writer 时拒绝。

```text
function rebindLiveWriter(persistence, sessionId, newHeader) {
  const writer = liveWriterOf(persistence, sessionId);
  if (writer === undefined || writer === null) {
    throw new Error("当前 DSH 运行时未暴露可重绑定的 live persistence writer，无法安全迁移运行中的会话；请先关闭会话后重试");
  }
  if (typeof writer.header !== "object" || writer.header === null) {
    throw new Error("当前持久化后端的 live writer 不支持安全重绑定；请先关闭会话后重试");
  }
  const reboundHeader = Object.freeze({ ...newHeader });
```

**依据 2 · 源码核查**：[lib/index.js:1316-1342](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/lib/index.js#L1316-L1342)

发布及 owner 失败。

<details>
<summary>查看原文（27行）</summary>

```text
        const bytes = await encodeArtifact(JSON.stringify(newHeader), bodyRehome.rest, newPath.endsWith(".zstd"));
        await mkdir(dirname(newPath), { recursive: true });
        const tempNew = await writeTempFile(newPath, bytes);
        const oldHidden = `${oldPath}.${randomBytes(6).toString("hex")}.tmp`;
        try {
          await rename(oldPath, oldHidden);
        } catch (error) {
          await rm(tempNew, { force: true });
          throw new Error(`移动失败（无法隐藏旧会话工件，已取消，会话保持原状）: ${String(error)}`);
        }
        try {
          await rename(tempNew, newPath);
        } catch (error) {
          try { await rename(oldHidden, oldPath); }
          catch (rollbackError) {
            throw new AggregateError([error, rollbackError], "移动发布失败且回滚失败；原始会话保留在 " + oldHidden + "，新文件保留在 " + tempNew);
          }
          try { await rm(tempNew, { force: true }); } catch { /* original restored */ }
          throw new Error("移动发布失败，原始会话已恢复: " + safeErrorMessage(error), { cause: error });
        }

        const state = coordinator?.states?.get?.(sessionId);
        if (state?.owner !== void 0 && liveSession !== void 0 && state.owner !== liveSession) {
          await rm(newPath, { force: true });
          await rename(oldHidden, oldPath);
          throw new Error(`会话 ${sessionId} 的持久化 owner 与当前 live session 不一致，已回滚`);
        }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1391-1407](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/lib/index.js#L1391-L1407)

后续回滚。

<details>
<summary>查看原文（17行）</summary>

```text

          const rollbackErrors = [];
          try { if (targetAttached) await target.detachSession(sessionId); } catch (e) { rollbackErrors.push(e); }
          for (const id of detachedFrom) {
            try {
              const entity = registry.list().find((candidate) => candidate.id === id);
              if (entity !== void 0) await entity.attachSession(sessionId);
            } catch (e) { rollbackErrors.push(e); }
          }
          try { await rm(newPath, { force: true }); } catch (e) { rollbackErrors.push(e); }
          try { await rename(oldHidden, oldPath); } catch (e) { rollbackErrors.push(e); }
          if (rollbackErrors.length > 0) {
            throw new AggregateError([error, ...rollbackErrors], "移动失败且回滚不完整");
          }
          throw error;
        }

```

</details>

**依据 4 · 源码核查**：[lib/session-files.js:252-277](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/lib/session-files.js#L252-L277)

冷重写恢复语义。

<details>
<summary>查看原文（26行）</summary>

```text
/** Backup, publish, and rollback are distinct phases. Never remove the source
 * when creating its backup failed. A failed rollback leaves the backup intact
 * and reports its exact recovery path rather than silently swallowing failure.
 */
export async function replaceSessionFile(path, bytes, io = fs) {
  const temp = await writeTempFile(path, bytes, io);
  const backup = `${path}.${randomBytes(6).toString("hex")}.bak`;
  try {
    await io.rename(path, backup);
  } catch (error) {
    try { await io.rm(temp, { force: true }); } catch { /* uncommitted temp only */ }
    throw new Error(`无法备份会话工件，未删除原文件: ${error.message}`, { cause: error });
  }
  try {
    await io.rename(temp, path);
  } catch (error) {
    try {
      await io.rename(backup, path);
    } catch (rollbackError) {
      throw new AggregateError([error, rollbackError], `发布失败且回滚失败；原始会话保留在 ${backup}，新文件保留在 ${temp}`);
    }
    try { await io.rm(temp, { force: true }); } catch { /* original already restored */ }
    throw new Error(`发布失败，原始会话已恢复: ${error.message}`, { cause: error });
  }
  try { await io.rm(backup, { force: true }); }
  catch { return { backupPath: backup }; }
```

</details>

#### 缺口

- 未注入断电、文件锁与注册表失败
  **影响**：无法证明跨步骤原子性
  **进一步探讨**：中断各发布步骤并核对日志哈希、工件位置和恢复提示

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 应怎样验证迁移的价值？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在可弃用工作区对照官方归档或新会话，用非活动测试会话验证同路径修复和真实移动。再测试 live、压缩损坏、已占用目标和预设迁移。比较上下文保留、切换耗时和恢复难度；目标已占用或日志损坏时维持源会话与独立备份。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:131-138](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/README.md#L131-L138)

作者列出支持及拒绝边界。

```text
## 4 Safety and behavior

- **Deletion is permanent**, so the UI always asks for confirmation. The API checks the session ID, directory boundary and artifact header before deletion; traversal, symlinks and junctions are refused.
- Move and preset migration keep the live session / agent alive; only deletion cancels and disposes the session. Move updates the stored `cwd` and the existing live writer's header.
- The management list hides subagent sessions and the move API rejects them. Blank sessions without a persisted artifact cannot be moved.
- Cold rewrites preserve the artifact's stored format (V1 / V2 / V3 / V4 are all readable; the plugin never forces an upgrade). Moves and rewrites refuse corrupt / truncated Zstd logs or JSONL logs with incomplete final lines instead of publishing partial history.
- Preset migration separates backup, publication and rollback. If rollback fails, recovery files are retained and their paths are included in the error; do not remove them.
- **Workspace archiving rollback protection**: archiving is refused if active sessions are present, and batch session archiving automatically rolls back on partial failures to preserve state consistency.
```

**依据 2 · 源码核查**：[lib/index.js:1300-1335](https://github.com/hkkz9522/dsh-session-manager/blob/b5f188735bbb8b7c041b1f3d6c156c51f08615ba/lib/index.js#L1300-L1335)

覆盖和发布的控制。

<details>
<summary>查看原文（36行）</summary>

```text
        if (typeof expectedVersion === "number") newHeader.version = expectedVersion;
        const root = typeof dshHomePath === "function" ? dshHomePath("sessions") : undefined;
        await assertSessionDirectory(root, dirname(oldPath), sessionId);
        await assertSessionDirectory(root, dirname(newPath), sessionId, { allowMissing: true });
        try {
          await lstat(newPath);
          throw new Error("目标位置已有会话工件，拒绝覆盖");
        } catch (error) { if (error.code !== "ENOENT") throw error; }
        if (oldPath === newPath) throw new Error("会话源路径与目标路径相同，但 cwd 不一致，拒绝覆盖");
        // Issue #42: a cold log is the only authority its working-directory
        // projection folds from on the next resume, so re-home it together
        // with the artifact header. Live sessions get the equivalent event
        // through the host path once the artifact has been published.
        const bodyRehome = liveSession === void 0
          ? rehomeColdWorkingDirectory(rest, targetPath)
          : { rest, status: "live" };
        const bytes = await encodeArtifact(JSON.stringify(newHeader), bodyRehome.rest, newPath.endsWith(".zstd"));
        await mkdir(dirname(newPath), { recursive: true });
        const tempNew = await writeTempFile(newPath, bytes);
        const oldHidden = `${oldPath}.${randomBytes(6).toString("hex")}.tmp`;
        try {
          await rename(oldPath, oldHidden);
        } catch (error) {
          await rm(tempNew, { force: true });
          throw new Error(`移动失败（无法隐藏旧会话工件，已取消，会话保持原状）: ${String(error)}`);
        }
        try {
          await rename(tempNew, newPath);
        } catch (error) {
          try { await rename(oldHidden, oldPath); }
          catch (rollbackError) {
            throw new AggregateError([error, rollbackError], "移动发布失败且回滚失败；原始会话保留在 " + oldHidden + "，新文件保留在 " + tempNew);
          }
          try { await rm(tempNew, { force: true }); } catch { /* original restored */ }
          throw new Error("移动发布失败，原始会话已恢复: " + safeErrorMessage(error), { cause: error });
        }
```

</details>

#### 缺口

- 缺少实际运维成本与任务效果
  **影响**：迁移收益未知
  **进一步探讨**：逐步对照两种流程并分离工件和运行时验收

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
