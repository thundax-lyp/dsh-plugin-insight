# Codex Taskboard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bdf7698](https://github.com/chuspeeism/dashi-taskboard/tree/bdf7698f6c3f3737a65377814dbb9db7ce81ea38)

<!-- BEGIN META -->
[![GitHub ★ 3,475](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C475&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chuspeeism/dashi-taskboard)
<!-- END META -->

> **功能**：提供可在浏览器或 Codex 中使用的本地优先任务看板，并让界面和 taskctl 共用 HTTP API。

> **亮点**：把读取当前要求、乐观版本认领和人类验收接入看板与 CLI 共用的记录，减少由代理另写一套交接说明的需要。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：带版本写入防止陈旧覆盖，不能凭此判断操作者是否有权关闭任务。Skill 明确的认领与完成约定也不等同于所有 HTTP 客户端都遵守它。[Q02](#research-q02)

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
  - [Q01 · 与独立看板加会话链接相比，任务交接增加什么？](#detail-section-11)
  - [Q02 · 认领和并发写入如何保护，哪些约束依赖客户端？](#detail-section-12)
  - [Q03 · 本地与共享部署需要什么，升级和退出有何负担？](#detail-section-13)
  - [Q04 · 什么团队值得试，怎样验证额外的认领约束？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在开发者与 Codex 间反复交接 issue 的项目可以共用看板、任务评论、验收状态和 CLI。

普通看板加会话链接也可组织工作，代理需要重复同步当前要求和认领状态。仅有会话历史时，人和其他会话不易看到同一验收状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地任务记录 | 管理 issue、活动与验收状态 | 服务与数据库可用 |
| 版本更新 | 防止陈旧写入覆盖 | 客户端带正确版本，冲突需重新核对 |
| 代理交接 | 按归属和验收状态推进任务 | 使用配套 Skill 或等价流程 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| Node 与本地 SQLite | 启动项目并存任务 | 包要求 22.22.3 起的 22.x 或 24.8 起 |
| 浏览器和 taskctl | 共用任务 API | 根服务可独立启动，Codex 嵌入可选 |
| 云资源与 companion | 协作与设备路径映射 | 共享云路径需要单独设置和验证 |

| 阶段 | 操作 | 异常处理 |
| --- | --- | --- |
| 首次 | 以 loopback 启动独立试用，创建一次性项目 | 无法启动则检查 Node 与实际监听地址 |
| 持续 | 按任务当前版本认领、核查并提交复核 | 遇冲突先读新版本和要求，确认合法才重试 |
| 退出 | 停止服务并备份本地数据库与附件 | 云端与本地路径独立，不能依赖自动合并 |

**效果与成本**

| 成本 | 承担者与口径 | 限制 |
| --- | --- | --- |
| 配置与运维 | 使用者配置服务与工作区，管理员处理共享部署 | 本地与云负担不同 |
| 人工 | 每次合格交接的更新、冲突核对与验收时间 | 未测量，不推算节省 |
| 退出 | 保存任务数据和附件，验证可恢复性 | 云和本地分别处理 |

| 效果 | 验证单位 | 限制 |
| --- | --- | --- |
| 交接一致性 | 一个 issue 的 UI、CLI 状态和验收记录一致 | 不同来源路径另测 |
| 防止陈旧覆盖 | 两客户端同版本提交仅一个生效 | 不覆盖操作者授权 |

> **思考**：带版本写入防止陈旧覆盖，不能凭此判断操作者是否有权关闭任务。Skill 明确的认领与完成约定也不等同于所有 HTTP 客户端都遵守它。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把读取当前要求、乐观版本认领和人类验收接入看板与 CLI 共用的记录，减少由代理另写一套交接说明的需要。[Q01](#research-q01) [Q02](#research-q02)

版本条件与活动记录同事务值得复用。浏览器 E2E 源码覆盖协作动作，但对多个真实用户以及不同宿主的覆盖需要另查。

<a id="detail-section-5"></a>

### 1.4 主要限制

带版本写入防止陈旧覆盖，不能凭此判断操作者是否有权关闭任务。Skill 明确的认领与完成约定也不等同于所有 HTTP 客户端都遵守它。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在 loopback 的独立项目试两方交接，用小任务验证只一次认领、可查看评论、显式确认后完结。若出现错项目、覆盖或未经预期的共享访问，停止并使用原看板。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持共用工作流和本地版本保护。目标宿主、多人授权、云故障恢复和交接收益仍待验证。

- 已检查：作者 README、包清单、源码路径 server/database.mjs、server/app.mjs、skills/manage-taskboard/SKILL.md、cli/taskctl.mjs、package.json、docs/cloud-collaboration.md、tests/collaboration.e2e.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根服务、CLI、Codex Skill 与本地数据库路径的定向源码核查；DSH 接入子包由独立条目研究。未执行项目或测试。
- 下一步：在隔离本机服务上对照 UI 与 CLI 同版本争抢，再验证正常验收、失联恢复和对未授权请求的响应。

**分析版本**

- **仓库**：[chuspeeism/dashi-taskboard](https://github.com/chuspeeism/dashi-taskboard)
- **版本号**：1.1.27（[固定提交 bdf7698](https://github.com/chuspeeism/dashi-taskboard/tree/bdf7698f6c3f3737a65377814dbb9db7ce81ea38)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把操作者和允许转换与版本校验一起放到提交路径，比较双认领、直接关闭及合法续接。若权限冲突不降或合法续接大量受阻，停止这个改法。[Q04](#research-q04)

在隔离本机服务上对照 UI 与 CLI 同版本争抢，再验证正常验收、失联恢复和对未授权请求的响应。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1516 | — | — | 17240 |
| .mjs | source | 50 | 23738 | 22372 | 66 | — |
| .ts | source | 17 | 3155 | 2867 | 21 | — |
| .js | source | 3 | 2347 | 2182 | 24 | — |
| .mjs | test | 33 | 12723 | 11798 | 159 | — |
| .tsx | example | 1 | 62 | 56 | 0 | — |
| .ts | test | 4 | 367 | 312 | 38 | — |
| .tsx | source | 31 | 20219 | 19220 | 30 | — |
| .tsx | test | 1 | 139 | 118 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立看板能否让人和 Codex 共用带版本的交接记录，权限边界及运行负担是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 与独立看板加会话链接相比，任务交接增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常在 Codex 和人工检查之间移交软件任务的人，可把 issue、当前需求、认领会话及验收记录放在一处。人工看板加会话链接也可交接，但每次读取旧要求、附验收结果与同步状态需要手工协调。Taskboard 的浏览器和 taskctl 共用 HTTP 服务，配套 Skill 给出先读评论和附件、按版本认领、回写验证再交复核、用户接受后完成的步骤。合格交接是下一操作者能定位相同问题与最近要求，并区分等待验收和已经完成。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-5](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/README.md#L3-L5)

作者说明本地独立服务、浏览器与 Codex 嵌入，以及 CLI 和 UI 共用 API。

```text
# Codex Taskboard

A local-first issue board that runs in a browser and can be embedded in Codex through the standalone CDP launcher or its injection script. The same HTTP API powers the React UI and the `taskctl` CLI used by the bundled Codex Skill.
```

**依据 2 · 源码核查**：[skills/manage-taskboard/SKILL.md:30-38](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/skills/manage-taskboard/SKILL.md#L30-L38)

项目交付的 Skill 对认领、冲突、验证和人验收明确分工。

```text
## Core workflow

1. For an existing issue, first run `issue get` and `comment list`. Also run `attachment list --task`. On the first handoff, omit `--after` and read the full results. Keep the separate `nextCursor` from each list. When the same task resumes, run `issue get` again, then pass each saved cursor to its matching list with `--after` so only new or modified entries are returned. Comment lists include the attachments on returned comments; use `attachment list --comment` with its own cursor when a known comment attachment list can grow. Read the description and latest comments before deciding whether to start. Treat comments as current requirements, including returned work. If they say to wait, not execute, or not start now, stop and report without changing the status.
2. Treat `backlog` as not approved for execution. Unless the user explicitly authorizes that issue, do not claim it, move it to another status, or perform task work; its assignee alone is not authorization. If work may start, claim it before reading code, downloading attachments, analyzing the implementation, or doing any other task work. Move a claimable `todo` to `in_progress` with its current `version`; do not continue until the move succeeds. If it is already `in_progress`, continue only when it is bound to the current conversation. Never move an issue claimed by another conversation.
3. If the move conflicts because the `version` is stale, run `issue get` and `comment list` again. Retry once with the latest `version` only when the issue is still a claimable `todo`, is not bound to another conversation, is not archived, and its description and latest comments are unchanged. If it was claimed, its status or requirements changed, it is archived, the service is unavailable, a permanent API error occurs, or the retry fails, stop and report. Never loop or take over another agent's claim.
4. For a new durable requirement, run `context current`. Treat its project as a workspace match only when `project.workspacePath` is the current directory or one of its ancestors. An unmatched `local` project is the documented fallback, not proof that the requirement belongs in the global project. If the user named a target project or the working directory identifies one, run `project list`, select that exact project by id or name, and stop to ask if the result is ambiguous. Search existing project issues before creating one in that confirmed project, then pass its explicit id to `issue create`. Update a matching issue instead of creating a duplicate. Use the fallback only when the user explicitly wants the global project. Do not track trivial requests.
5. Execute only the requested work in the issue's branch or worktree when one is bound.
6. Verify the requested operation path. Add a comment with the changes, verification result, outcome, and remaining risks. Read the issue again, then move it to `in_review` with its current `version`.
7. Move an issue to `done` only after the user explicitly accepts it or asks to complete it. Use `blocked` when work cannot continue and `canceled` when it will not continue.
```

#### 缺口

- 未量化相对独立看板的人工重复同步
  **影响**：不能外推为团队效率提升
  **进一步探讨**：同一组任务对比来回切换、补充提问、丢失验收条件数

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 认领和并发写入如何保护，哪些约束依赖客户端？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Skill 要求写入五字段会话归属并带当前版本，另一会话已认领时不接管。CLI 更新把解析出的版本放入请求；本地数据库先校验记录，在事务内以 id 和 version 作更新条件，同时写入活动并递增版本，更新失败回滚。同版本竞争只有满足当前条件的写入可成立。版本比较解决陈旧写入，不能证明任务状态转换由正确用户授权；这里只看到 Skill 对何时结束的行为约定、以及数据库持久化归属与比较版本。持有新版本的通用客户端仍需独立核查路由授权和业务转换校验，不能把 Skill 遵守规则等同于所有调用方受限。

#### 证据与依据

**依据 1 · 源码核查**：[skills/manage-taskboard/SKILL.md:46-49](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/skills/manage-taskboard/SKILL.md#L46-L49)

Skill 指定归属字段、保留原绑定和版本冲突处理。

```text
- For Codex controller attribution, let `taskctl` read `CODEX_THREAD_ID` or pass the exact Codex conversation ID with `--thread-id`. This value alone is not a complete task binding. For Claude Code, Pi, AGY, or Grok session traceability, pass `--agent-platform claude|pi|agy|grok --session-id ID` instead; see [CLI session traceability](references/cli.md#external-toolsession-traceability). External metadata is not a Codex ownership binding and never substitutes for the five fields below.
- Any issue that the current conversation claims or continues must store a complete `threadBinding`: `threadId`, `codexProjectId`, `codexProjectKind`, `codexHostId`, and `workspacePath`. For an unbound local issue launched with injected Taskboard context, use the current `CODEX_THREAD_ID`, the injected project id and workspace path, `local` project kind, and `local` host id. Pass all five explicit `--binding-*` options on the claim and every later `issue move` that retains ownership. If any identity field is unavailable, stop before moving the issue to `in_progress`; never create a legacy binding containing only `threadId`.
- When an issue already has a complete `threadBinding`, preserve its exact five saved values on every status write. Do not rebuild or replace it from the current context, and never take over a binding owned by another conversation.
- Use the latest returned `version` with `--if-version` for concurrent updates. On conflict, read the issue again and reconcile before retrying.
```

**依据 2 · 源码核查**：[cli/taskctl.mjs:883-914](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/cli/taskctl.mjs#L883-L914)

CLI 将解析的版本带入任务补丁。

<details>
<summary>查看原文（32行）</summary>

```text
async function updateIssue(api, taskId, options, overrides) {
  if (options.status !== undefined) assertStatus(options.status);
  if (options.priority !== undefined) assertPriority(options.priority);

  const developmentContext = developmentContextFromOptions(options, overrides);
  const recurrence = recurrenceFromOptions(options);
  const attribution = resolveConversationAttribution(options, overrides);
  const patch = {
    ...optionalField("projectId", options.project),
    ...optionalField("title", options.title),
    ...optionalField("status", options.status),
    ...optionalField("priority", options.priority),
    ...optionalField("labels", options.labels === undefined ? undefined : parseLabels(options.labels)),
    ...optionalField("developmentContext", developmentContext),
    ...optionalField("startDate", options["start-date"]),
    ...optionalField("dueDate", options["due-date"]),
    ...optionalField("recurrence", recurrence),
  };
  if (options.description !== undefined || options["description-file"] !== undefined) {
    patch.description = await resolveDescription(options, overrides);
  }

  if (Object.keys(patch).length === 0 && attribution.agentSession === undefined) {
    throw usageError("issue update requires at least one field to update");
  }
  Object.assign(patch, attribution);
  patch.version = await resolveVersion(api, taskId, options["if-version"]);
  return api.request("PATCH", taskPath(taskId), patch);
}

async function moveIssue(api, taskId, options, overrides) {
  const status = requiredOption(options, "status");
```

</details>

**依据 3 · 源码核查**：[server/database.mjs:1997-2024](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/server/database.mjs#L1997-L2024)

写入归属字段并以版本作条件，变化行数异常进入冲突分支。

<details>
<summary>查看原文（28行）</summary>

```text
    const storedBinding = storedThreadBindingForExisting(current, threadBinding, threadId);
    if (storedBinding && !Object.hasOwn(changes, "projectId")) {
      assignments.push(
        "thread_id = ?",
        "thread_codex_project_id = ?",
        "thread_codex_project_kind = ?",
        "thread_codex_host_id = ?",
        "thread_workspace_path = ?",
      );
      values.push(...storedBinding);
    }
    if (agentSession !== undefined) {
      assignments.push("agent_session = ?");
      values.push(agentSession ? JSON.stringify(agentSession) : null);
    }
    assignments.push("version = version + 1", "updated_at = ?");
    const timestamp = now();
    values.push(timestamp, current.id, version);

    this.database.exec("BEGIN IMMEDIATE");
    try {
      const result = this.database.prepare(`
        UPDATE tasks SET ${assignments.join(", ")} WHERE id = ? AND version = ?
      `).run(...values);
      if (result.changes !== 1) {
        this.#throwMissingOrConflict(id, version);
      }
      if (Object.hasOwn(changes, "description")) {
```

</details>

**依据 4 · 源码核查**：[server/database.mjs:2044-2050](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/server/database.mjs#L2044-L2050)

活动写入同事务，失败回滚。

```text
      this.#recordTaskActivity(current.id, actor, activityChanges, timestamp);
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getTask(current.id);
```

**依据 5 · 源码核查**：[server/app.mjs:2912-2925](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/server/app.mjs#L2912-L2925)

本地任务分支调用数据库更新；不同来源走独立路径。

<details>
<summary>查看原文（14行）</summary>

```text
            if (recurrence && !dueDate) {
              throw new ApiError(400, "INVALID_FIELD", "A recurring issue requires a due date");
            }
            jiraChanged = await jira.updateTask(current, changes);
          }
          if (assigneeTarget !== undefined) {
            changes.assignee = resolveAssignee(assigneeTarget, actor);
          }
          let task;
          try {
            task = database.updateTask(id, version, changes, threadId, threadBinding, actor, agentSession);
          } catch (error) {
            if (jiraChanged) {
              try {
```

</details>

#### 缺口

- 未覆盖各 API 入口的完整状态转换授权矩阵
  **影响**：不能将本地版本校验当作组织权限或代理隔离
  **进一步探讨**：用两个独立调用者请求同版、最新版、不同绑定和完成操作，比较 CLI 和直接请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地与共享部署需要什么，升级和退出有何负担？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

根包是带浏览器 UI、HTTP 服务、SQLite 和 CLI 的独立产品，Node 版本由 package.json 约束；Codex 嵌入另有启动方式。直接启动默认绑定 0.0.0.0，README 从浏览器使用 127.0.0.1 不会改变监听范围。服务在有实例 token 时才加路径前缀，并单独检查网络请求及本机能力路由。云模式文档把业务数据交给 D1，设备映射留在 loopback companion，失败不切换 SQLite；共享密码和本机路径维护另有负担。本提交带浏览器测试脚本与协作场景断言，可借用作回归用例，但没有运行。退出需先停止服务、备份数据库和附件，独立评估云数据与设备映射，不能期待注销时自动合并。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-15](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/package.json#L2-L15)

根包为 private 独立包，提供 CLI 和启动脚本。

<details>
<summary>查看原文（14行）</summary>

```text
  "name": "codex-taskboard",
  "version": "1.1.27",
  "private": true,
  "type": "module",
  "engines": {
    "node": "^22.22.3 || >=24.8.0"
  },
  "bin": {
    "taskctl": "./cli/taskctl.mjs"
  },
  "scripts": {
    "codex": "node scripts/codex-injector.mjs --launch --watch --open --port 9231",
    "codex:inject": "node scripts/codex-injector.mjs --watch",
    "codex:daemon": "node scripts/codex-injector.mjs --daemon --open",
```

</details>

**依据 2 · 源码核查**：[server/app.mjs:1367-1382](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/server/app.mjs#L1367-L1382)

默认监听地址、实例路由前缀和数据库初始化。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveHost(value = process.env.CODEX_TASKBOARD_HOST ?? "0.0.0.0") {
  const host = String(value).trim();
  if (host !== "127.0.0.1" && host !== "0.0.0.0") {
    throw new Error("CODEX_TASKBOARD_HOST must be 127.0.0.1 or 0.0.0.0");
  }
  return host;
}

export function createTaskboardServer(options = {}) {
  const resolved = resolveServerOptions(options);
  const codexProcessEnvironment = withoutTaskboardLauncherEnvironment(
    options.processEnv ?? process.env,
  );
  const routePrefix = resolved.instanceToken ? `/${resolved.instanceToken}` : "";
  const database = new TaskboardDatabase(resolved.databasePath);
  const events = new EventHub();
```

</details>

**依据 3 · 源码核查**：[server/app.mjs:1731-1755](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/server/app.mjs#L1731-L1755)

实例 token 前缀和可信网络请求检查。

<details>
<summary>查看原文（25行）</summary>

```text
      const incomingUrl = new URL(request.url, "http://127.0.0.1");
      if (resolved.instanceToken && incomingUrl.pathname !== "/health") {
        if (incomingUrl.pathname === routePrefix) {
          response.writeHead(301, { location: `${incomingUrl.pathname}/${incomingUrl.search}` });
          response.end();
          return;
        }
        if (
          incomingUrl.pathname !== routePrefix
          && !incomingUrl.pathname.startsWith(`${routePrefix}/`)
        ) {
          throw new ApiError(404, "NOT_FOUND", "Route not found");
        }
        request.url = `${incomingUrl.pathname.slice(routePrefix.length) || "/"}${incomingUrl.search}`;
      }

      const configuredTrustedRequest = assertTrustedNetworkRequest(
        request,
        Boolean(resolved.instanceToken),
        resolved.trustedOrigins,
      );
      const origin = request.headers.origin;
      const trustedEmbedOrigin = TRUSTED_EMBED_ORIGINS.has(origin)
        || (Boolean(resolved.instanceToken) && origin === "null");
      if (trustedEmbedOrigin) {
```

</details>

**依据 4 · 作者声明**：[docs/cloud-collaboration.md:23-29](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/docs/cloud-collaboration.md#L23-L29)

项目文档定义设备与云业务数据边界和不回落策略。

```text
## What stays local

The cloud stores project, issue, comment, relation, and attachment data. It does not store a device's absolute project or worktree paths.

Each collaborator runs the **local companion**: a **device-local loopback service** (not a chat persona) for Codex, Git/worktree scanning, installed Skill/MCP discovery, and project path mapping. The companion keeps the cloud URL, actor name, shared password, and device-specific project mappings in `.data/cloud-companion.json` with mode `0600`. Ordinary Taskboard HTTP routes (tasks, comments, attachments) are the shared API; they are not a separate “companion API”.

When cloud mode is active, the cloud is the only business-data source. A failed cloud request fails visibly. The companion does not fall back to the local SQLite database and does not write to both databases. `taskctl cloud logout` returns that device to its separate local mode; it does not merge local and cloud data.
```

**依据 5 · 源码核查**：[tests/collaboration.e2e.ts:6-43](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/tests/collaboration.e2e.ts#L6-L43)

测试源码覆盖评论变更和附件下载内容的断言。

<details>
<summary>查看原文（38行）</summary>

```text
test('comment create, edit, delete and issue attachment upload, download, delete', async ({ app, screen, browser }) => {
  await app.open('/?lang=en');
  await createProject(screen, 'E2E comments and files');
  await createIssue(screen, 'Discussion issue');
  await openIssue(screen, 'Discussion issue');
  await screen.getByRole('textbox', 'Leave a comment').fill('Initial comment');
  await screen.getByRole('button', 'Comment').tap();
  await expect(screen.getByText('Initial comment')).toBeVisible();
  await screen.getByRole('button', 'Comment actions').tap();
  await screen.getByRole('menuitem', 'Edit comment').tap();
  await screen.getByRole('textbox', 'Edit comment').fill('Updated comment');
  await screen.getByRole('button', 'Save').tap();
  await expect(screen.getByText('Updated comment')).toBeVisible();
  await browser.reload();
  await expect(screen.getByText('Updated comment')).toBeVisible();
  // Issue attachments live inline in the description: add the file in the
  // description composer, then leave the composer (the Activity heading is a
  // neutral blur target) so it saves and renders as an attachment card.
  await screen.getByRole('button', 'Edit issue description').tap();
  await browser.locator('.issue-description-composer input[type=file]').setInputFiles(attachmentFixture);
  // The chip's remove control is revealed on chip hover, like the relation rows.
  await browser.locator('.inline-media-attachment').filter({ hasText: 'attachment.txt' }).hover();
  await expect(screen.getByRole('button', 'Remove attachment.txt')).toBeVisible();
  await screen.getByRole('heading', 'Activity').tap();
  await expect(screen.getByRole('link', /attachment\.txt/)).toBeVisible();
  const downloaded = await browser.waitForDownload(() => screen.getByRole('link', /attachment\.txt/).tap());
  expect(await readFile(downloaded.absolutePath, 'utf8')).toBe('Dashi E2E attachment fixture\n');
  // The saved card fills the read view, so a tap would land on its link; open
  // the editor through the read view's own Enter shortcut instead.
  await screen.getByRole('button', 'Edit issue description').press('Enter');
  await browser.locator('.inline-media-attachment').filter({ hasText: 'attachment.txt' }).hover();
  await screen.getByRole('button', 'Remove attachment.txt').tap();
  await screen.getByRole('heading', 'Activity').tap();
  await expect(screen.getByRole('link', /attachment\.txt/)).toBeHidden();
  await screen.getByRole('button', 'Comment actions').tap();
  await screen.getByRole('menuitem', 'Delete comment').tap();
  await screen.getByRole('alertdialog').getByRole('button', 'Delete comment').tap();
  await expect(screen.getByText('Updated comment')).toBeHidden();
```

</details>

#### 缺口

- 未运行局域网、云或浏览器测试
  **影响**：不确定不同部署环境的防护与故障恢复
  **进一步探讨**：隔离配置验证远端来源拒绝、断网行为和附件备份恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么团队值得试，怎样验证额外的认领约束？

**研究主题**：采用判断、新假设与验证

#### 完整回答

使用 Codex 且反复在人工和代理间交接任务的小团队，可在本机 loopback 的一次性项目试用共享 UI 与 CLI。第一轮只做两个调用方的同版本认领、补充验收及显式完结；若无法解释直接请求的权限或同版本失败后数据出现分歧，停止试用并沿用原看板。进一步可尝试由服务端绑定操作者、当前任务版本和允许的状态转换，补足客户端自律边界。对照现状重放双认领、更新要求和恶意用最新版关闭三种情况；若合法接续受损而越权状态变化未减少，假设失败。

#### 证据与依据

**依据 1 · 源码核查**：[server/database.mjs:2012-2024](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/server/database.mjs#L2012-L2024)

当前约束是版本比较与条件写入，可作对照。

<details>
<summary>查看原文（13行）</summary>

```text
    assignments.push("version = version + 1", "updated_at = ?");
    const timestamp = now();
    values.push(timestamp, current.id, version);

    this.database.exec("BEGIN IMMEDIATE");
    try {
      const result = this.database.prepare(`
        UPDATE tasks SET ${assignments.join(", ")} WHERE id = ? AND version = ?
      `).run(...values);
      if (result.changes !== 1) {
        this.#throwMissingOrConflict(id, version);
      }
      if (Object.hasOwn(changes, "description")) {
```

</details>

**依据 2 · 源码核查**：[skills/manage-taskboard/SKILL.md:32-38](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/skills/manage-taskboard/SKILL.md#L32-L38)

客户端现行规范界定认领与人验收语义。

```text
1. For an existing issue, first run `issue get` and `comment list`. Also run `attachment list --task`. On the first handoff, omit `--after` and read the full results. Keep the separate `nextCursor` from each list. When the same task resumes, run `issue get` again, then pass each saved cursor to its matching list with `--after` so only new or modified entries are returned. Comment lists include the attachments on returned comments; use `attachment list --comment` with its own cursor when a known comment attachment list can grow. Read the description and latest comments before deciding whether to start. Treat comments as current requirements, including returned work. If they say to wait, not execute, or not start now, stop and report without changing the status.
2. Treat `backlog` as not approved for execution. Unless the user explicitly authorizes that issue, do not claim it, move it to another status, or perform task work; its assignee alone is not authorization. If work may start, claim it before reading code, downloading attachments, analyzing the implementation, or doing any other task work. Move a claimable `todo` to `in_progress` with its current `version`; do not continue until the move succeeds. If it is already `in_progress`, continue only when it is bound to the current conversation. Never move an issue claimed by another conversation.
3. If the move conflicts because the `version` is stale, run `issue get` and `comment list` again. Retry once with the latest `version` only when the issue is still a claimable `todo`, is not bound to another conversation, is not archived, and its description and latest comments are unchanged. If it was claimed, its status or requirements changed, it is archived, the service is unavailable, a permanent API error occurs, or the retry fails, stop and report. Never loop or take over another agent's claim.
4. For a new durable requirement, run `context current`. Treat its project as a workspace match only when `project.workspacePath` is the current directory or one of its ancestors. An unmatched `local` project is the documented fallback, not proof that the requirement belongs in the global project. If the user named a target project or the working directory identifies one, run `project list`, select that exact project by id or name, and stop to ask if the result is ambiguous. Search existing project issues before creating one in that confirmed project, then pass its explicit id to `issue create`. Update a matching issue instead of creating a duplicate. Use the fallback only when the user explicitly wants the global project. Do not track trivial requests.
5. Execute only the requested work in the issue's branch or worktree when one is bound.
6. Verify the requested operation path. Add a comment with the changes, verification result, outcome, and remaining risks. Read the issue again, then move it to `in_review` with its current `version`.
7. Move an issue to `done` only after the user explicitly accepts it or asks to complete it. Use `blocked` when work cannot continue and `canceled` when it will not continue.
```

#### 缺口

- 尚未验证身份绑定能否覆盖本地与云两套角色
  **影响**：无法估计集成成本或续接阻塞
  **进一步探讨**：先用两类调用者构造权限矩阵，再测合法移交和可恢复故障

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
