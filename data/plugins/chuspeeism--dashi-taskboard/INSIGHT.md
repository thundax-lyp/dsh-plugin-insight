# Codex Taskboard 本地任务看板

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[9aa1f4e](https://github.com/chuspeeism/dashi-taskboard/tree/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc)

<!-- BEGIN META -->
[![GitHub ★ 3,401](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C401&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chuspeeism/dashi-taskboard)
<!-- END META -->

> **实现功能**：本地优先任务看板，通过浏览器、taskctl和Skill管理项目与AI任务交接。

> **核心亮点**：[Q03](#research-q03) 把成熟的乐观并发和AI会话绑定、需求重读、待审/接受边界组织成任务交接协议，相对手工列表增加责任与状态追溯；不以任务记录宣称软件交付正确。

> **风险与缺陷**：[Q03](#research-q03) 数据库保护写入版本，不能保护交付真实性；Skill约束依赖执行者遵守，done与评论不能替代代码和用户验收证据。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 本地看板怎样支持AI任务交接，何为办结？](#detail-section-15)
  - [Q02 · 持久化和乐观版本如何连接到任务写入？](#detail-section-16)
  - [Q03 · 任务协议的增量是什么，能否约束成果质量？](#detail-section-17)
  - [Q04 · 本地服务和可选桌面注入需要承担哪些成本？](#detail-section-18)
  - [Q05 · 绑定交付证据和任务版本能否降低错误办结？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有跨AI会话交接需求的开发者维护任务、需求、附件和当前责任，用户验收后才办结。

聊天记录、手工任务表或已有外部跟踪器是简单基线；没有跨会话交接摩擦时，本地服务不一定值得引入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地任务服务 | 保存项目、任务和版本 | 独立工程，需维护数据库 |
| 交接Skill | 约束领取与用户接受 | 依赖执行者遵守，非成果证明 |
| taskctl入口 | 脚本化任务操作 | 本轮未执行CLI |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 失效与退路 |
|---|---|---|
| Node>=22.5与依赖 | 运行服务和构建Web | 先核对版本 |
| SQLite目录可写且备份 | 保存任务状态 | 隔离数据库并先验证恢复 |
| 可选Codex/桌面/CDP | 嵌入与会话联动 | 退回独立浏览器服务 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与完成判据 | 失败处理 |
|---|---|---|
| 构建启动服务 | 用户直接URL可打开 | 查Node与数据库路径 |
| 配置项目与Skill | 用户确认工作区绑定 | 不猜项目与任务身份 |
| 读取并领取任务 | 执行者版本写入成功 | 重读协调，禁止循环抢占 |
| 验证后待审 | 执行者留交付和风险 | 用户接受前不done |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | 本地Node与数据库资源，费用未知 | 构建、配置项目/Skill，分钟未知 |
| 持续 | 服务、AI调用或可选云资源，未知 | 维护任务、权限与备份，未知 |
| 失败恢复 | 重试与备份资源，未知 | 重读冲突、核对外部同步和恢复库，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 合格任务 | 源码支持 | 未验证部分 |
|---|---|---|
| 会话任务交接 | Skill的领取、重读、待审和接受协议 | 执行者遵守与真实用户收益 |
| 防旧版本覆盖 | 数据库409冲突 | 多客户端端到端、Jira补偿 |

> **思考**：[Q03](#research-q03) 数据库保护写入版本，不能保护交付真实性；Skill约束依赖执行者遵守，done与评论不能替代代码和用户验收证据。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q03](#research-q03) 把成熟的乐观并发和AI会话绑定、需求重读、待审/接受边界组织成任务交接协议，相对手工列表增加责任与状态追溯；不以任务记录宣称软件交付正确。

[Q03](#research-q03) 把成熟的乐观并发和AI会话绑定、需求重读、待审/接受边界组织成任务交接协议，相对手工列表增加责任与状态追溯；不以任务记录宣称软件交付正确。

数据库与HTTP状态处理有清晰接口，成熟乐观并发可复用；迁移时必须保留身份绑定、版本错误语义和外部写入后reconcile，不能只复制状态枚举。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) 数据库保护写入版本，不能保护交付真实性；Skill约束依赖执行者遵守，done与评论不能替代代码和用户验收证据。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q01](#research-q01)、[Q04](#research-q04) 先在非关键项目试用浏览器与CLI，验证任务版本冲突和待审接受；有明确同步收益后才考虑桌面注入或云模式，不把根目录作为DSH可装插件。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已检查本地数据库、任务PATCH、版本冲突与Skill协议；未运行服务或桌面注入，接受包是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、skills/manage-taskboard/SKILL.md、server/database.mjs、server/app.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根工程定位为独立本地任务服务；DSH integration只是单独薄入口。本轮抽读核心状态链路，不是全API权限和平台审计。
- 下一步：隔离数据库用两客户端同版本更新验证冲突，再核对备份恢复与需求变更后接受流程，记录错配及人工分钟；尚未执行。

**分析版本**

- **仓库**：[chuspeeism/dashi-taskboard](https://github.com/chuspeeism/dashi-taskboard)
- **版本号**：1.1.27（[固定提交 9aa1f4e](https://github.com/chuspeeism/dashi-taskboard/tree/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是把需求版本、代码revision和验证结果绑定为接受包，用五个需求变动任务对照错配办结与人工成本；无改善或维护更重即停止。

隔离数据库用两客户端同版本更新验证冲突，再核对备份恢复与需求变更后接受流程，记录错配及人工分钟；尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1516 | — | — | 17217 |
| .mjs | source | 50 | 23738 | 22372 | 66 | — |
| .js | source | 3 | 2347 | 2182 | 24 | — |
| .mjs | test | 32 | 12686 | 11771 | 151 | — |
| .tsx | example | 1 | 62 | 56 | 0 | — |
| .ts | source | 16 | 3130 | 2846 | 16 | — |
| .tsx | source | 31 | 20219 | 19220 | 30 | — |
| .tsx | test | 1 | 139 | 118 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查本地任务状态与AI会话交接的贡献、并发边界及验收缺口。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 本地看板怎样支持AI任务交接，何为办结？

**研究主题**：场景与需求、采用判断

#### 完整回答

根工程是本地优先的任务看板服务、React界面、taskctl CLI与Codex Skill，不能统称可直接安装的DSH插件。适合在多个AI会话间维护任务、需求、附件和责任归属的开发者；原办法是聊天记录加手工任务表。合格结果是任务记录与项目、会话、版本和交付说明对应，并由用户确认成果后办结。Skill要求先读取任务与评论、领取后执行、验证后进入in_review，只有用户接受才done，这改变交接责任而非自动证明代码正确。没有跨会话任务交接需求的人可继续用简单列表，避免维护本地服务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-5](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/README.md#L3-L5)

作者定位根工程为本地服务，HTTP API同时驱动界面和CLI。

```text
# Codex Taskboard

A local-first issue board that runs in a browser and can be embedded in Codex through the standalone CDP launcher or its injection script. The same HTTP API powers the React UI and the `taskctl` CLI used by the bundled Codex Skill.
```

**依据 2 · 源码核查**：[skills/manage-taskboard/SKILL.md:30-38](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/skills/manage-taskboard/SKILL.md#L30-L38)

领取、验证、待审与done接受边界。

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

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 持久化和乐观版本如何连接到任务写入？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Node进程通过node:sqlite的DatabaseSync建立数据库，启用外键、WAL和busy_timeout再迁移。HTTP PATCH解析version、变更和threadBinding，最终调用database.updateTask；数据库先读取当前记录并检查传入版本，不等则返回409 VERSION_CONFLICT及两个版本。因此浏览器或CLI不能安全地把旧读到的数据当最新状态写回，应重新读并协调冲突。Skill把五字段会话绑定与每次当前版本作为操作前提，但文本协议的存在不等于模型必然遵守，也不证明所有API变更都受同样的授权门控。Jira分支存在外部更新后本地失败的reconcile处理，分布式一致性不由本地SQLite事务单独保证。

#### 证据与依据

**依据 1 · 源码核查**：[server/database.mjs:258-264](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/server/database.mjs#L258-L264)

数据库初始化与持久化设置。

```text
export class TaskboardDatabase {
  constructor(filename) {
    mkdirSync(path.dirname(filename), { recursive: true });
    this.database = new DatabaseSync(filename);
    this.database.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
    this.#migrate();
    this.interruptAbandonedAiChatRuns();
```

**依据 2 · 源码核查**：[server/database.mjs:1908-1916](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/server/database.mjs#L1908-L1916)

写任务首先核对当前版本。

```text
  updateTask(id, version, changes, threadId, threadBinding, actor, agentSession) {
    const current = this.#requireTaskRecord(id);
    this.#requireVersion(current, version);
    const activityChanges = taskFieldChanges(current, changes);
    const targetProject = Object.hasOwn(changes, "projectId")
      ? this.database.prepare("SELECT id, name, workspace_path, labels FROM projects WHERE id = ?").get(changes.projectId)
      : null;
    if (Object.hasOwn(changes, "projectId") && !targetProject) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${changes.projectId}' does not exist`);
```

**依据 3 · 源码核查**：[server/database.mjs:2856-2862](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/server/database.mjs#L2856-L2862)

409版本冲突携带期望与实际值。

```text
  #requireVersion(task, expectedVersion) {
    if (task.version !== expectedVersion) {
      throw new ApiError(409, "VERSION_CONFLICT", "Task was changed by another client", {
        expectedVersion,
        actualVersion: task.version,
      });
    }
```

**依据 4 · 源码核查**：[server/app.mjs:2871-2882](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/server/app.mjs#L2871-L2882)

HTTP输入到任务来源与绑定解析。

<details>
<summary>查看原文（12行）</summary>

```text
        if (!action && request.method === "PATCH") {
          const actor = actorFromRequest(request);
          const {
            version,
            changes,
            threadId,
            threadBinding,
            agentSession,
            assigneeTarget,
          } = resolveInputThreadBinding(parseTaskPatch(await readJson(request), parseDevelopmentContext));
          const source = database.getTaskSource(id);
          if (!source) throw new ApiError(404, "TASK_NOT_FOUND", `Task '${id}' does not exist`);
```

</details>

**依据 5 · 源码核查**：[server/app.mjs:2915-2935](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/server/app.mjs#L2915-L2935)

外部Jira写入与本地失败的补偿边界。

<details>
<summary>查看原文（21行）</summary>

```text
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
                await jira.reconcile();
              } catch {
                throw new ApiError(
                  502,
                  "JIRA_RECONCILE_FAILED",
                  "Jira 已更新，但 Taskboard 重新同步失败，请手动同步",
                );
              }
            }
            throw error;
```

</details>

#### 缺口

- 没有实际启动并发客户端或CLI操作
  **影响**：不能确认端到端冲突处理和外部补偿正确性
  **进一步探讨**：隔离数据库中用两客户端同版本更新并回读，再注入远端成功本地失败

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 任务协议的增量是什么，能否约束成果质量？

**研究主题**：贡献与相对优势、缺陷与关键质疑、工程质量与复用

#### 完整回答

相对手工列表，源码与Skill把版本冲突、会话占有、需求重读和用户接受明确拆开，尤其把in_review与done区分，能减少会话间接手时不知谁在做及旧状态覆盖的风险。乐观并发是成熟机制，这里的贡献是将它与AI任务交接约束连接，不能算新数据库算法。最关键质疑是成果是否合格仍取决于真实验证和用户接受；状态值与评论并不自动包含代码、测试、验收的充分证据。绕过Skill直接写API或模型不遵守流程都可能使记录与实际进展偏离。把任务改为done不代表测试通过，数据库的VERSION_CONFLICT只保护读写版本，不保护业务结论真实。

#### 证据与依据

**依据 1 · 源码核查**：[skills/manage-taskboard/SKILL.md:32-49](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/skills/manage-taskboard/SKILL.md#L32-L49)

交接边界、有限重试和五字段绑定明确体现流程贡献。

<details>
<summary>查看原文（18行）</summary>

```text
1. For an existing issue, first run `issue get` and `comment list`. Also run `attachment list --task`. On the first handoff, omit `--after` and read the full results. Keep the separate `nextCursor` from each list. When the same task resumes, run `issue get` again, then pass each saved cursor to its matching list with `--after` so only new or modified entries are returned. Comment lists include the attachments on returned comments; use `attachment list --comment` with its own cursor when a known comment attachment list can grow. Read the description and latest comments before deciding whether to start. Treat comments as current requirements, including returned work. If they say to wait, not execute, or not start now, stop and report without changing the status.
2. Treat `backlog` as not approved for execution. Unless the user explicitly authorizes that issue, do not claim it, move it to another status, or perform task work; its assignee alone is not authorization. If work may start, claim it before reading code, downloading attachments, analyzing the implementation, or doing any other task work. Move a claimable `todo` to `in_progress` with its current `version`; do not continue until the move succeeds. If it is already `in_progress`, continue only when it is bound to the current conversation. Never move an issue claimed by another conversation.
3. If the move conflicts because the `version` is stale, run `issue get` and `comment list` again. Retry once with the latest `version` only when the issue is still a claimable `todo`, is not bound to another conversation, is not archived, and its description and latest comments are unchanged. If it was claimed, its status or requirements changed, it is archived, the service is unavailable, a permanent API error occurs, or the retry fails, stop and report. Never loop or take over another agent's claim.
4. For a new durable requirement, run `context current`. Treat its project as a workspace match only when `project.workspacePath` is the current directory or one of its ancestors. An unmatched `local` project is the documented fallback, not proof that the requirement belongs in the global project. If the user named a target project or the working directory identifies one, run `project list`, select that exact project by id or name, and stop to ask if the result is ambiguous. Search existing project issues before creating one in that confirmed project, then pass its explicit id to `issue create`. Update a matching issue instead of creating a duplicate. Use the fallback only when the user explicitly wants the global project. Do not track trivial requests.
5. Execute only the requested work in the issue's branch or worktree when one is bound.
6. Verify the requested operation path. Add a comment with the changes, verification result, outcome, and remaining risks. Read the issue again, then move it to `in_review` with its current `version`.
7. Move an issue to `done` only after the user explicitly accepts it or asks to complete it. Use `blocked` when work cannot continue and `canceled` when it will not continue.

## Other operations

- Run `taskctl project readme get [PROJECT_ID]` to inspect project architecture, constraints, and conventions before planning or executing complex tasks.
- Keep the project README focused on root overview and conventions; store detailed multi-page documentation in the local repository's `docs/` folder.
- Preserve existing issue scope when adding requirements or acceptance details.
- Add only relations that the work requires. Use parent for contained work, blocks or blocked_by for dependencies, and related for close association.
- For Codex controller attribution, let `taskctl` read `CODEX_THREAD_ID` or pass the exact Codex conversation ID with `--thread-id`. This value alone is not a complete task binding. For Claude Code, Pi, AGY, or Grok session traceability, pass `--agent-platform claude|pi|agy|grok --session-id ID` instead; see [CLI session traceability](references/cli.md#external-toolsession-traceability). External metadata is not a Codex ownership binding and never substitutes for the five fields below.
- Any issue that the current conversation claims or continues must store a complete `threadBinding`: `threadId`, `codexProjectId`, `codexProjectKind`, `codexHostId`, and `workspacePath`. For an unbound local issue launched with injected Taskboard context, use the current `CODEX_THREAD_ID`, the injected project id and workspace path, `local` project kind, and `local` host id. Pass all five explicit `--binding-*` options on the claim and every later `issue move` that retains ownership. If any identity field is unavailable, stop before moving the issue to `in_progress`; never create a legacy binding containing only `threadId`.
- When an issue already has a complete `threadBinding`, preserve its exact five saved values on every status write. Do not rebuild or replace it from the current context, and never take over a binding owned by another conversation.
- Use the latest returned `version` with `--if-version` for concurrent updates. On conflict, read the issue again and reconcile before retrying.
```

</details>

**依据 2 · 源码核查**：[server/database.mjs:2856-2862](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/server/database.mjs#L2856-L2862)

版本校验只有写入一致性，不能外推为成果质量校验。

```text
  #requireVersion(task, expectedVersion) {
    if (task.version !== expectedVersion) {
      throw new ApiError(409, "VERSION_CONFLICT", "Task was changed by another client", {
        expectedVersion,
        actualVersion: task.version,
      });
    }
```

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 本地服务和可选桌面注入需要承担哪些成本？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

首次最小路径是Node 22.5以上、安装依赖、构建并启动本地HTTP服务，数据落在.data/taskboard.sqlite；桌面Tauri构建、Rust与平台SDK、CDP注入或云companion是不同可选路径，不应全压给只用浏览器者，也不能把源码发布脚本存在当构建成功。持续需维护数据库备份、服务和客户端兼容；AI任务调用费取决于接入模型，本轮没有价格和调用量。失败后首先确认服务与数据库位置，版本冲突按Skill重读协调且最多一次条件重试，不循环接管；浏览器直用是嵌入故障的退路。现金、人工、迁移和数据库恢复耗时未测，因此只适合有跨会话交接需求且能维护本地服务的人隔离试用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-28](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/README.md#L9-L28)

Node和本地运行最小路径及SQLite位置。

<details>
<summary>查看原文（20行）</summary>

````text
## Requirements

- Node.js 22.5 or newer
- macOS App and DMG builds: Xcode Command Line Tools and Rust 1.88 or newer with the `aarch64-apple-darwin` and `x86_64-apple-darwin` targets. `npm install` installs the Tauri CLI used by this project.
- Windows NSIS builds: the Microsoft Store Codex App, Rust 1.88 or newer, and Visual Studio Build Tools with the C++ workload and Windows SDK.

## Run locally

```bash
npm install
npm run build
npm start
```

Open <http://127.0.0.1:47823>. The SQLite database is stored at `.data/taskboard.sqlite`.

For development with live frontend reload:

```bash
npm run dev
````

</details>

**依据 2 · 作者声明**：[README.md:74-101](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/README.md#L74-L101)

CDP和启动器为可选嵌入路径，声明未运行。

<details>
<summary>查看原文（28行）</summary>

````text
```

After the new Codex window appears, run the injector in another terminal:

```bash
CODEX_TASKBOARD_HOST=127.0.0.1 \
npm run codex:inject -- --port 9231 --open
```

Keep the injector terminal running while using the embedded panel. The original Codex window remains unchanged, and the new window receives the Taskboard sidebar entry. If port `9231` is occupied, use another port in both commands.

### Recommended: launch an independent Taskboard window with one command

Keep existing Codex windows open and run:

```bash
CODEX_TASKBOARD_HOST=127.0.0.1 npm run codex
```

This starts the local Taskboard service when needed. It reuses an open Codex with a reachable CDP renderer, opens Taskboard in the native browser panel of an ordinary Codex without CDP, or launches the official macOS Codex app with an independent profile and loopback-only port `9231` when no Codex is open. It injects a native-looking Taskboard entry after Plugins when CDP is available and keeps watching both the service and replacement renderers. Keep this command running while using the embedded panel. The launcher does not modify `ChatGPT.app` or its `app.asar`.

The source launcher writes its authenticated endpoint to `.data/launcher-runtime.json`. A `taskctl` command installed with `npm link` reads this file by default, so a normal shell and a Codex task opened from the panel use the same Taskboard service without an extra environment variable.

### macOS App: open and inject without a terminal

For Tauri development, run:

```bash
````

</details>

**依据 3 · 源码核查**：[skills/manage-taskboard/SKILL.md:33-38](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/skills/manage-taskboard/SKILL.md#L33-L38)

冲突重读、有限重试及失败停止。

```text
2. Treat `backlog` as not approved for execution. Unless the user explicitly authorizes that issue, do not claim it, move it to another status, or perform task work; its assignee alone is not authorization. If work may start, claim it before reading code, downloading attachments, analyzing the implementation, or doing any other task work. Move a claimable `todo` to `in_progress` with its current `version`; do not continue until the move succeeds. If it is already `in_progress`, continue only when it is bound to the current conversation. Never move an issue claimed by another conversation.
3. If the move conflicts because the `version` is stale, run `issue get` and `comment list` again. Retry once with the latest `version` only when the issue is still a claimable `todo`, is not bound to another conversation, is not archived, and its description and latest comments are unchanged. If it was claimed, its status or requirements changed, it is archived, the service is unavailable, a permanent API error occurs, or the retry fails, stop and report. Never loop or take over another agent's claim.
4. For a new durable requirement, run `context current`. Treat its project as a workspace match only when `project.workspacePath` is the current directory or one of its ancestors. An unmatched `local` project is the documented fallback, not proof that the requirement belongs in the global project. If the user named a target project or the working directory identifies one, run `project list`, select that exact project by id or name, and stop to ask if the result is ambiguous. Search existing project issues before creating one in that confirmed project, then pass its explicit id to `issue create`. Update a matching issue instead of creating a duplicate. Use the fallback only when the user explicitly wants the global project. Do not track trivial requests.
5. Execute only the requested work in the issue's branch or worktree when one is bound.
6. Verify the requested operation path. Add a comment with the changes, verification result, outcome, and remaining risks. Read the issue again, then move it to `in_review` with its current `version`.
7. Move an issue to `done` only after the user explicitly accepts it or asks to complete it. Use `blocked` when work cannot continue and `canceled` when it will not continue.
```

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 绑定交付证据和任务版本能否降低错误办结？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把in_review时的代码revision、验证结果与需求版本作为一次接受包，并在任务随后修改时要求重新确认，可以减少“状态完成但交付对应旧需求”的错误。推导来自Q02的版本控制与Q03的成果语义缺口，增量在验收交接，不是再发明状态字段。最小试验取五个有中途需求变动的脱敏任务，对比现有评论流程和带版本的接受包，记录错配办结、人工修订时间与漏验项。若本来评论足够、接受包不减少错配或维护负担更高，停止产品化；尚无真实需求和付费意愿依据。

#### 证据与依据

**依据 1 · 源码核查**：[skills/manage-taskboard/SKILL.md:35-38](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/skills/manage-taskboard/SKILL.md#L35-L38)

要求验证评论和用户接受，但没有从状态直接证明交付。

```text
4. For a new durable requirement, run `context current`. Treat its project as a workspace match only when `project.workspacePath` is the current directory or one of its ancestors. An unmatched `local` project is the documented fallback, not proof that the requirement belongs in the global project. If the user named a target project or the working directory identifies one, run `project list`, select that exact project by id or name, and stop to ask if the result is ambiguous. Search existing project issues before creating one in that confirmed project, then pass its explicit id to `issue create`. Update a matching issue instead of creating a duplicate. Use the fallback only when the user explicitly wants the global project. Do not track trivial requests.
5. Execute only the requested work in the issue's branch or worktree when one is bound.
6. Verify the requested operation path. Add a comment with the changes, verification result, outcome, and remaining risks. Read the issue again, then move it to `in_review` with its current `version`.
7. Move an issue to `done` only after the user explicitly accepts it or asks to complete it. Use `blocked` when work cannot continue and `canceled` when it will not continue.
```

**依据 2 · 源码核查**：[server/database.mjs:1908-1916](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/server/database.mjs#L1908-L1916)

任务版本可作为绑定点，新增接受包尚未实现。

```text
  updateTask(id, version, changes, threadId, threadBinding, actor, agentSession) {
    const current = this.#requireTaskRecord(id);
    this.#requireVersion(current, version);
    const activityChanges = taskFieldChanges(current, changes);
    const targetProject = Object.hasOwn(changes, "projectId")
      ? this.database.prepare("SELECT id, name, workspace_path, labels FROM projects WHERE id = ?").get(changes.projectId)
      : null;
    if (Object.hasOwn(changes, "projectId") && !targetProject) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${changes.projectId}' does not exist`);
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
