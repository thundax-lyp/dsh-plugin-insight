# dsh-codex-sync

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[75bbca8](https://github.com/Walvez/dsh-codex-sync/tree/75bbca80457eb5743a8fd293e1315f45a0771427)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Walvez/dsh-codex-sync) [![npm 30d 1,427](https://img.shields.io/static/v1?label=npm+30d&message=1%2C427&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-sync) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-sync)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中导入和导出 Codex 会话，并按设置共享指令、技能和 MCP 服务。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，插件把源 ID、会话转换、工作区和反向新建副本组合起来，便于在两个工具查回同一项目的文字。

> **主要限制**：[Q02](#research-q02) 显示反向只转文字，文件和索引可能分别成功；[Q03](#research-q03) 显示默认 MCP 镜像还可能引入当前环境中的命令和凭据。

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
  - [Q01 · Codex 会话怎样成为可以回读的 DSH 记录？](#detail-section-11)
  - [Q02 · 反向导出保留什么，什么条件会留下部分状态？](#detail-section-12)
  - [Q03 · MCP 和 Skill 接线什么时候会扩大可见能力？](#detail-section-13)
  - [Q04 · 何时值得试用，怎样验证可恢复迁移？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：交替使用 Codex 与 DSH 的开发者可以选取熟悉的项目会话，并在另一个工具回查文字与工作区。

手工复制摘要或对话文字可以继续项目工作，避免触碰持久索引。插件增加按会话选择、追加转换和挂接。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 导入记录 | 转入 Codex 会话并挂接工作区 | 依赖匹配数据和宿主格式，前缀差异可能跳过 |
| 反向导出 | 创建 Codex 文本会话副本 | 不保留全部工具事件，索引可能失败 |
| 同步设置 | 管理提示、技能及 MCP 来源 | 需要明确数据目录和允许项 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
| --- | --- | --- | --- |
| DSH Cordis 命令、技能及持久化服务 | 相关能力需要 | 暴露命令、读写会话 | 部分能力不可用 |
| Codex 会话目录与匹配的 DSH 迁移格式 | 迁移需要 | 解析记录和转换事件 | 报错或跳过 |
| 可读的 Codex 索引与本机 sqlite3 | 反向索引需要 | 尝试注册新会话 | 可能只写 JSONL |
| 匹配官方 MCP 客户端及已批准服务器 | 镜像需要 | 装载经筛选的工具 | 缺少客户端会跳过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户用合成数据区并关辅助自动接线 | 能从原目录恢复 |
| 预览 | 操作者按明确 ID 预览迁移 | 确认工作区和计划写入 |
| 回读 | 用户检查文本、工作区及索引后再决定继续 | 不一致时停在原有工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 合成记录及本地存储 | 准备两端隔离环境与备份 | 实际建环境时间未知 |
| 持续 | 扫描、转换、索引及可能的额外工具进程 | 核验版本、选中条目及落点 | 真实耗时与开支未知 |
| 失败恢复 | 复读及重建占本机资源 | 检查部分文件、索引和挂接后恢复 | 未实测恢复时间 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 上下文迁移 | 会话选择、格式转换与工作区挂接 | 真实续跑及全部内容保留 |
| 反向回读 | JSONL 产物和独立索引更新 | 客户端格式与实际权限 |
| 能力共享 | Skill 与符合规则的 MCP 可接入 | 运行状态、最终权限及端点可用 |

> **思考**：[Q02](#research-q02) 显示反向只转文字，文件和索引可能分别成功；[Q03](#research-q03) 显示默认 MCP 镜像还可能引入当前环境中的命令和凭据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，插件把源 ID、会话转换、工作区和反向新建副本组合起来，便于在两个工具查回同一项目的文字。

导入与导出可独立选择，预览与实际持久状态分离。工作区挂接可能比本次选择更宽，反向写文件与索引有独立失败点。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示反向只转文字，文件和索引可能分别成功；[Q03](#research-q03) 显示默认 MCP 镜像还可能引入当前环境中的命令和凭据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用独立目录和一段合成记录做手动预览，关闭自动导入、镜像和反向桥。待能解释实际写入、来源和结果之后，再考虑是否继续。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认与两端存储和运行配置接线，未验证真实客户端格式、MCP 服务或无损续跑。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/import-service.js、lib/export-codex.js、lib/bridge.js、lib/mcp.js、bin/dsh-codex-sync.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖固定源码的会话、命令与镜像主要路径；未验证真实宿主、客户端索引与第三方 MCP。
- 下一步：用合成会话比较预览、反向新建与索引失败，核对文件摘要、实际工作区、允许的工具及回读状态。

**分析版本**

- **仓库**：[Walvez/dsh-codex-sync](https://github.com/Walvez/dsh-codex-sync)
- **版本号**：1.6.2（[固定提交 75bbca8](https://github.com/Walvez/dsh-codex-sync/tree/75bbca80457eb5743a8fd293e1315f45a0771427)）
- **版本日期**：2026-10-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出用经过核对的预览摘要绑定实际迁移与恢复记录，对照历史分歧和部分失败。

用合成会话比较预览、反向新建与索引失败，核对文件摘要、实际工作区、允许的工具及回读状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 963 | — | — | 7117 |
| .js | source | 9 | 6019 | 5136 | 625 | — |
| .mjs | source | 9 | 1544 | 995 | 482 | — |
| .mjs | test | 11 | 2207 | 1776 | 263 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Walvez/dsh-codex-sync/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/Walvez/dsh-codex-sync/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Walvez/dsh-codex-sync/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：同用 Codex 与 DSH 的开发者能转移哪些会话文本和工具能力，哪些动作会改写持久状态或扩大信任范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Codex 会话怎样成为可以回读的 DSH 记录？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在同一个项目轮流使用 Codex 与 DSH 的开发者，想重读上个工具中的排查过程，可以挑选已知会话，并在 DSH 工作区中检查导入记录。手工复制会话摘要不会保留同样的条目和时间，也避免了跨版本读写存储。这一实现的可追踪增量是选取本机记录、映射事件、去重追加及工作区挂接。合格结果仍需人工对照记录内容和正确工作区。

导入器扫描 Codex sessions 文件，跳过无法读、超限以及默认的子代理记录，再按源 ID 合并分页文件和后续增量。过滤可用 ID、项目和时间。它创建 codex- 前缀 ID，转换所解析的消息，尝试用宿主迁移包将 header 和 events 升到当前格式。没有现存 ID 则创建并写入，重复导入依据用户消息前缀与助手条数定位后缀，旧用户前缀不匹配时跳过。这个追加规则假定既有前缀稳定，无法保证修正同一前缀里的历史工具事件。预览跳过写会话及工作区操作；真实导入完成后还对全部已导入记录执行一次挂接，不止本次选中的会话。

#### 证据与依据

**依据 1 · 源码核查**：[lib/import-service.js:220-253](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/import-service.js#L220-L253)

候选解析和子代理、大小过滤。

<details>
<summary>查看原文（34行）</summary>

```text
  for (const file of listCodexSessions(join(codexHome, 'sessions'))) {
    let size
    try {
      size = statSync(file).size
    } catch {
      unreadable += 1
      continue
    }
    if (size > maxBytes) {
      skippedBig += 1
      continue
    }
    let parsed
    try {
      parsed = parseCodexSession(file)
    } catch {
      unreadable += 1
      continue
    }
    if (parsed.header.id === undefined) continue
    // Sub-agent threads (parent_thread_id set) dominate rollouts (~half in
    // real usage) and only clutter the session list; filter them out unless
    // explicitly requested.
    if (isSubagentThread(parsed.header) && options.importSubagents !== true && !(Array.isArray(options.ids) && options.ids.length > 0)) {
      skippedSubagent += 1
      continue
    }
    candidates.push({
      file,
      id: `codex-${parsed.header.id}`,
      cwd: parsed.header.cwd,
      createdAt: parsed.header.createdAt,
      parsed,
    })
```

</details>

**依据 2 · 源码核查**：[lib/import-service.js:263-284](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/import-service.js#L263-L284)

合并分段并按请求筛选。

<details>
<summary>查看原文（22行）</summary>

```text
  const mergedById = new Map()
  for (const candidate of candidates) {
    const prev = mergedById.get(candidate.id)
    if (prev === undefined) mergedById.set(candidate.id, candidate)
    else prev.parsed.messages.push(...candidate.parsed.messages)
  }
  const deduped = [...mergedById.values()]

  let selected = deduped
  if (Array.isArray(options.ids) && options.ids.length > 0) {
    const want = new Set(options.ids)
    selected = selected.filter((c) => want.has(c.id) || want.has(c.parsed.header.id))
  }
  if (options.project !== undefined) {
    selected = selected.filter((c) => typeof c.cwd === 'string' && c.cwd.includes(options.project))
  }
  if (options.since !== undefined) {
    selected = selected.filter((c) => typeof c.createdAt === 'number' && c.createdAt >= options.since)
  }
  if (options.limit !== undefined) {
    selected = [...selected].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).slice(0, options.limit)
  }
```

</details>

**依据 3 · 源码核查**：[lib/import-service.js:297-325](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/import-service.js#L297-L325)

事件转换和宿主当前格式迁移失败处理。

<details>
<summary>查看原文（29行）</summary>

```text
    const events = buildDshEvents(messages, {
      toolEvents: true,
      title: deriveImportTitle(candidate.parsed.header.title, messages, 'codex'),
      titlePinned: true,
    }).map((event, seq) => ({ ...event, seq }))
    // DSH 0.9.0 session-persistence now *writes* only the current (v3) format:
    // encodeCurrentHeader throws "encodeCurrent requires Session format v3" for a
    // v0 header, so the importer must migrate the imported v0 header + events
    // through the real v0->v1->v2->v3 chain before create/append (issue #2).
    const importHeader = {
      version: 0,
      id: candidate.id,
      createdAt: candidate.createdAt ?? messages[0].time,
      ...(candidate.cwd !== undefined ? { cwd: candidate.cwd } : {}),
      agentPreset: typeof options.agentPreset === 'string' && options.agentPreset.length > 0
        ? options.agentPreset
        : 'cordis',
    }
    // Fail LOUDLY instead of falling back to a v0 write: real DSH persistence
    // rejects v0 anyway ("encodeCurrent requires Session format v3"/"v4"), so
    // a silent fallback would break the import while hiding the root cause
    // (missing migration packages / data-dependent migration failure).
    const { header: currentHeader, events: currentEvents } = (() => {
      try {
        return migrateToCurrent(importHeader, events)
      } catch (error) {
        throw new Error(`import-codex: session ${candidate.id} could not be migrated to the current session format: ${error.message}`)
      }
    })()
```

</details>

**依据 4 · 源码核查**：[lib/import-service.js:326-356](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/import-service.js#L326-L356)

真实写入与预览分支。

<details>
<summary>查看原文（31行）</summary>

```text
    if (existing.has(candidate.id)) {
      let oldEvents = []
      try {
        oldEvents = (await persistence.inspect(candidate.id)).events ?? []
      } catch {
        skipped += 1
        continue
      }
      const suffix = diffImportEvents(oldEvents, currentEvents)
      if (suffix.length === 0) {
        skipped += 1
        continue
      }
      if (dryRun) {
        updated += 1
        lines.push(`  [would-update] ${candidate.id}  +${suffix.length} events`)
        continue
      }
      await persistence.append(candidate.id, suffix)
      updated += 1
      lines.push(`  [updated] ${candidate.id}  +${suffix.length} events`)
      continue
    }
    if (dryRun) {
      imported += 1
      lines.push(`  [would-import] ${candidate.id}  ${candidate.cwd ?? '(no cwd)'}  ${messages.length} messages -> ${currentEvents.length} events`)
      continue
    }
    await persistence.createAndAppend(currentHeader, currentEvents)
    imported += 1
    lines.push(`  [imported] ${candidate.id}  ${candidate.cwd ?? '(no cwd)'}  ${messages.length} messages -> ${currentEvents.length} events`)
```

</details>

**依据 5 · 源码核查**：[lib/import-service.js:112-157](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/import-service.js#L112-L157)

重复导入比较用户前缀及助手计数。

<details>
<summary>查看原文（46行）</summary>

```text
export function diffImportEvents(oldEvents, nextEvents) {
  const oldUsers = oldEvents.filter((e) => e.type === 'user/message').map(userTextOf)
  const nextUsers = nextEvents.filter((e) => e.type === 'user/message').map(userTextOf)
  let match = 0
  while (match < oldUsers.length && match < nextUsers.length && oldUsers[match] === nextUsers[match]) match += 1
  if (match < oldUsers.length) return []

  const last = oldEvents[oldEvents.length - 1]
  const baseSeq = (typeof last?.seq === 'number' ? last.seq : oldEvents.length - 1) + 1
  const oldTurn = lastTurnNumber(oldEvents)

  const remap = (slice, turnOffset, seqBase) => slice
    .filter((e) => e.type !== 'session/title')
    .map((event, i) => {
      const data = event.data && typeof event.data === 'object' ? { ...event.data } : event.data
      if (data && typeof data.turn === 'number') data.turn = data.turn + turnOffset
      const copy = { ...event, data, seq: seqBase + i }
      return copy
    })

  // Locate the first event of `next` that the previous import did not store.
  // Rollouts are append-only, so `old`'s users and assistants are PREFIXES of
  // `next`'s: the (oldAssistants)-th assistant (0-based) and the (match)-th
  // user are the first NEW ones. The zero cases matter — `oldAssistants === 0`
  // is the reply to a question that was still pending at the previous import
  // (counting the current event BEFORE comparing; the old code incremented
  // first and never matched, silently dropping the answer), and a new user
  // may arrive while old's last turn also gained its (first) assistant.
  const oldAssistants = oldEvents.filter((e) => e.type === 'assistant/message').length
  let firstNewAssistant = -1
  let firstNewUser = -1
  let assistants = 0
  let seenUsers = -1
  for (let i = 0; i < nextEvents.length; i += 1) {
    const type = nextEvents[i].type
    if (type === 'assistant/message') {
      if (firstNewAssistant === -1) {
        if (assistants === oldAssistants) firstNewAssistant = i
        else assistants += 1
      }
    } else if (type === 'user/message') {
      seenUsers += 1
      if (seenUsers === match) firstNewUser = i
    }
  }
  if (firstNewAssistant === -1 && firstNewUser === -1) return []
```

</details>

**依据 6 · 源码核查**：[lib/import-service.js:367-371](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/import-service.js#L367-L371)

非 dry run 会挂接全部已导入集。

```text
  // ── workspace attach: the whole imported set, not just this batch ─────────
  if (!dryRun) {
    const attached = await attachAllImported(ctx, persistence)
    lines.push(...attached)
  }
```

#### 缺口

- 没有对真实宿主当前格式和会话重放做对照。
  **影响**：无法保证导入会话可继续推进，或所有工具历史都保留。
  **进一步探讨**：用带多段增量和工具事件的合成样本对照事件、回显、不同工作区挂接。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 反向导出保留什么，什么条件会留下部分状态？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

反向导出按请求 ID 与已知 Codex 工作区筛选，已从 Codex 导入的条目通常跳过。用户显式选择且比较认为 DSH 已更新时才可导出这类条目。转换仅提取用户及助手的非空文本，并生成新的会话标识、时间和 rollout。工具状态、附件、推理以及原审批上下文不在这一转换中；不能把新出现的会话当原执行现场继续。反复执行导出还会再次生成不同标识，不能把导入的增量去重规则套用到反向。

输出实际先写 JSONL，再尝试调用 sqlite3 写 Codex 索引，并尝试追加另一份索引文件。固定代码以已知 state_5.sqlite 和 threads 列为依据；索引失败时文件仍可能存在，并在摘要标为 jsonl only。索引中的权限相关元字段由代码固定填充，不能据此推断运行时如何选择权限。文件写成功、索引成功、客户端能打开和能继续会话需要分别验证。使用两个真实工作区尝试前应先保留数据目录的可恢复副本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/export-codex.js:563-593](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/export-codex.js#L563-L593)

显式选择及工作区、来源过滤。

<details>
<summary>查看原文（31行）</summary>

```text
  for (const meta of metas) {
    if (want && !want.has(meta.id)) continue
    if (meta.cwd && knownCodexCwds.size > 0 && !knownCodexCwds.has(meta.cwd)) {
      skipped += 1
      lines.push(`  [skip-workspace] ${meta.id} (workspace not recognized in Codex: ${meta.cwd})`)
      continue
    }
    const isCodex = String(meta.id).startsWith('codex-')
    let isCodexExportAllowed = false

    if (isCodex) {
      if (want && want.has(meta.id)) {
        let events = []
        try {
          events = (await persistence.inspect(meta.id)).events ?? []
        } catch {
          skipped += 1
          continue
        }
        const rawId = String(meta.id).replace(/^codex-/u, '')
        const sourceInfo = getCodexSourceMap().get(rawId)
        const comparison = compareDshWithCodexSource(events, sourceInfo)
        if (comparison.dshUpdated) {
          isCodexExportAllowed = true
        }
      }
      if (!isCodexExportAllowed) {
        skipped += 1
        lines.push(`  [skip-source] ${meta.id} (already a codex session)`)
        continue
      }
```

</details>

**依据 2 · 源码核查**：[lib/export-codex.js:77-89](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/export-codex.js#L77-L89)

反向仅搬运用户和助手文本。

<details>
<summary>查看原文（13行）</summary>

```text
export function dshEventsToCodexMessages(events) {
  const out = []
  for (const event of events ?? []) {
    if (event.type === 'user/message') {
      const text = eventUserText(event).trim()
      if (text && !skipUserText(text)) out.push({ role: 'user', text, time: event.time ?? Date.now() })
    } else if (event.type === 'assistant/message') {
      const text = eventAssistantText(event).trim()
      if (text) out.push({ role: 'assistant', text, time: event.time ?? Date.now() })
    }
  }
  return out
}
```

</details>

**依据 3 · 源码核查**：[lib/export-codex.js:603-635](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/export-codex.js#L603-L635)

新会话 ID、预览、先写文件后索引。

<details>
<summary>查看原文（33行）</summary>

```text
    const messages = dshEventsToCodexMessages(events)
    if (messages.length === 0) {
      empty += 1
      continue
    }
    const uuid = uuidv7()
    const createdAt = Date.now()
    const path = rolloutPath(codexHome, createdAt, uuid)
    const title = titleOf(events, meta.id)
    const body = buildRolloutJsonl({
      uuid,
      cwd: meta.cwd,
      createdAt,
      messages,
    })
    const copyNote = isCodex ? ' (new copy; original Codex thread not overwritten)' : ''
    if (dryRun) {
      exported += 1
      lines.push(`  [would-export] ${meta.id}  ${messages.length} messages -> ${path}${copyNote}`)
      continue
    }
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, body)
    const indexed = indexCodexThread(codexHome, {
      uuid,
      path,
      cwd: meta.cwd || '',
      createdAt,
      title,
      firstUser: firstUserPreview(messages),
    })
    exported += 1
    lines.push(`  [exported] ${meta.id}  ${messages.length} messages -> ${path}${copyNote}${indexed ? '  (indexed)' : '  (jsonl only — restart Codex)'}`)
```

</details>

**依据 4 · 源码核查**：[lib/export-codex.js:358-402](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/export-codex.js#L358-L402)

SQLite 插入和文件索引独立尝试；失败时并无回滚。

<details>
<summary>查看原文（45行）</summary>

```text
export function indexCodexThread(codexHome, { uuid, path, cwd, createdAt, title, firstUser }) {
  const nowSec = Math.floor((createdAt || Date.now()) / 1000)
  const nowMs = createdAt || Date.now()
  const preview = (firstUser || title || '').slice(0, 200)
  const db = join(codexHome, 'state_5.sqlite')
  let ok = false
  if (existsSync(db)) {
    const sql = `INSERT OR REPLACE INTO threads (
      id, rollout_path, created_at, updated_at, source, model_provider, cwd, title,
      sandbox_policy, approval_mode, tokens_used, has_user_event, archived,
      cli_version, first_user_message, thread_source, preview, recency_at,
      recency_at_ms, history_mode, created_at_ms, updated_at_ms
    ) VALUES (
      ${sqlQuote(uuid)},
      ${sqlQuote(path)},
      ${nowSec}, ${nowSec},
      'vscode', 'openai',
      ${sqlQuote(cwd || '')},
      ${sqlQuote(title || 'Imported from DSH')},
      '{"type":"disabled"}', 'never',
      0, 1, 0,
      '0.149.0-alpha.4',
      ${sqlQuote(preview)},
      'user',
      ${sqlQuote(preview)},
      ${nowSec}, ${nowMs},
      'legacy', ${nowMs}, ${nowMs}
    );`
    try {
      execFileSync('sqlite3', [db, sql], { stdio: 'pipe' })
      ok = true
    } catch {
      ok = false
    }
  }
  try {
    appendFileSync(join(codexHome, 'session_index.jsonl'), `${JSON.stringify({
      id: uuid,
      thread_name: title || 'Imported from DSH',
      updated_at: iso(nowMs),
    })}\n`)
  } catch {
    /* index file optional */
  }
  return ok
```

</details>

#### 缺口

- 目标客户端具体索引格式及导出后格式兼容未验证。
  **影响**：不能声称正式存储可双向无损或可继续执行。
  **进一步探讨**：对同一合成会话两次导出，检查文本、唯一 ID、索引和客户端回读。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · MCP 和 Skill 接线什么时候会扩大可见能力？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

在 DSH 挂载时，代码注册 Codex Skill provider 与系统提示区。设置默认开启时，读取用户指定或默认 Codex 主目录中的 instructions.md，缺失则尝试 AGENTS.md，直接拼接内容后转义插值标记；配置摘要只提取模型和供应商字段。带私有指令的默认目录和用来试迁移的合成目录不该混用。自动会话导入有独立选项，启用后在首次 startup 会话触发。

MCP 镜像由独立开关控制，默认开启。配置更新经 watcher 后重新解析，禁用、拒绝列表、允许名单与显式同名服务器都会影响筛选。stdio 配置保留命令、参数、环境和目录；HTTP 配置可把当前进程环境中的 token 作为 Bearer，再注册官方 MCP 客户端。mount 状态表示挂载调用完成，不能证明远端服务已经稳定提供工具。配置不可读时保留已有挂载；缺官方客户端则只记录原因。对于现有信任边界，用户需先核对允许名单、宿主读取的环境变量和实际启动的命令。

反向 MCP 是独立 CLI 操作。它会在需要时浅克隆第三方仓库并用 pnpm 安装构建，向本地 Codex 配置写托管段，默认含允许安装选项；运行开关另行显式指定。源码只对当前组件读写与启动准备负责，未证明被克隆的第三方制品行为。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:193-223](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/index.js#L193-L223)

注册 Skill provider 与可切换提示区。

<details>
<summary>查看原文（31行）</summary>

```text
  // ── 1. first-class skills from ~/.codex/skills ────────────────────────────
  // Provider stays mounted; its list() consults the persisted toggle so the
  // Switch in Sync settings takes effect without re-applying the plugin.
  const skills = ctx.get('skills')
  if (skills !== undefined) {
    ctx.effect(
      () => skills.registerProvider((control) => registerPluginSkillProvider(codexHome, config, control)),
      'codex-sync.plugin-skills()',
    )
    ctx.effect(
      () => skills.registerProvider((control) => registerCodexSkillProvider(
        codexHome, config, control,
        () => ef('enableSkills', config.enableSkills !== false),
      )),
      'codex-sync.skills()',
    )
  }

  // ── 2. system-prompt sections (instructions + config summary) ─────────────
  // Sections always mount; their text() is gated by the persisted toggle, so
  // disabling emits an empty section and re-enabling needs no restart.
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'codex-sync:instructions',
    order: 122,
    text: () => ef('enableInstructions', config.enableInstructions !== false) ? bridgeInstructionsSection(codexHome) : '',
  }), 'codex-sync.instructions()')
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'codex-sync:config',
    order: 123,
    text: () => ef('enableConfig', config.enableConfig !== false) ? bridgeConfigSection(codexHome) : '',
  }), 'codex-sync.config()')
```

</details>

**依据 2 · 源码核查**：[lib/bridge.js:77-90](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/bridge.js#L77-L90)

拼接指令与限字段配置摘要。

<details>
<summary>查看原文（14行）</summary>

```text
export function bridgeInstructionsSection(codexHome) {
  const found = loadInstructions(codexHome)
  if (!found) return ''
  return sanitize(`# Codex Instructions (${found.file})\n\n${found.content}`)
}

/** systemPrompt section text for the codex config summary ('' = skip section). */
export function bridgeConfigSection(codexHome) {
  const cfg = loadConfigSummary(codexHome)
  if (!cfg) return ''
  const parts = ['# Codex Configuration']
  if (cfg.model) parts.push(`Model: ${cfg.model}`)
  if (cfg.model_provider) parts.push(`Provider: ${cfg.model_provider}`)
  return sanitize(parts.join('\n'))
```

</details>

**依据 3 · 源码核查**：[lib/index.js:490-512](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/index.js#L490-L512)

自动导入与默认镜像分别激活。

<details>
<summary>查看原文（23行）</summary>

```text
  // ── autoImport: run once at the first startup session ────────────────────
  if (store.get()) {
    let ran = false
    ctx.effect(() => ctx.on('agent/session-start', ({ source }) => {
      if (ran || source !== 'startup') return
      ran = true
      void runImport().then((result) => {
        ctx.logger?.info?.('dsh-codex-sync: auto import\n' + result.text)
      }).catch((error) => {
        ctx.logger?.warn?.(`dsh-codex-sync: auto import failed: ${error?.message ?? error}`)
      })
    }), 'codex-sync.auto-import()')
  }

  // ── 4. MCP: explicit servers + auto mirror of ~/.codex/config.toml ────────
  if (config.mcpServers && typeof config.mcpServers === 'object') {
    const servers = Object.entries(config.mcpServers)
    if (servers.length > 0) {
      void mountMcpServers(ctx, servers)
    }
  }
  if (ef('mcpMirror', config.mcpMirror !== false)) setMirror(true)
  ctx.effect(() => () => { try { mirrorHandle?.dispose?.() } catch { /* ignore */ } }, 'codex-sync.mcp-mirror()')
```

</details>

**依据 4 · 源码核查**：[lib/mcp.js:174-201](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/mcp.js#L174-L201)

映射 stdio 和流式 HTTP，包括环境凭据。

<details>
<summary>查看原文（28行）</summary>

```text
export function toMcpClientConfig(name, srv) {
  if (srv.enabled === false) return null
  if (srv.command !== undefined) {
    const env = {}
    for (const [k, v] of Object.entries(srv.env ?? {})) env[k] = interpolate(v)
    return {
      transport: 'stdio',
      serverName: name,
      command: srv.command,
      args: Array.isArray(srv.args) ? srv.args : [],
      ...(Object.keys(env).length > 0 ? { env } : {}),
      ...(typeof srv.cwd === 'string' && srv.cwd.length > 0 ? { cwd: interpolate(srv.cwd) } : {}),
    }
  }
  if (srv.url !== undefined) {
    const headers = {}
    if (typeof srv.bearer_token_env_var === 'string' && srv.bearer_token_env_var.length > 0) {
      const token = process.env[srv.bearer_token_env_var]
      if (token) headers.Authorization = `Bearer ${token}`
    }
    return {
      transport: 'streamable-http',
      serverName: name,
      url: srv.url,
      headers,
    }
  }
  return null
```

</details>

**依据 5 · 源码核查**：[lib/mcp.js:291-331](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/mcp.js#L291-L331)

读取失败、缺客户端与各级筛选。

<details>
<summary>查看原文（41行）</summary>

```text
  async function sync() {
    if (stopped) return
    const McpClient = await loadMcpClient()
    if (McpClient === undefined) {
      ctx.logger?.warn?.('dsh-codex-sync: @deepseek-ai/dsh-mcp-client not installed; MCP mirror disabled')
      return
    }
    let text
    try {
      text = readFileSync(configPath, 'utf8')
    } catch {
      return // config not readable; keep current state
    }
    const parsed = parseCodexMcpServers(text)
    const wanted = new Map()
    const seen = new Set()
    for (const [name, srv] of parsed) {
      seen.add(name)
      const base = { name, transport: describeTransport(srv), silent: silent?.has(name) ?? false }
      if (srv.enabled === false) {
        status.set(name, { ...base, reason: 'disabled' })
        continue
      }
      if (deny.has(name)) {
        status.set(name, { ...base, reason: 'denied' })
        continue
      }
      if (only && !only.has(name)) {
        status.set(name, { ...base, reason: 'only-filtered' })
        continue
      }
      // Per-server sync preference (UI / /codex-mcp): user-off hides the
      // mirror without touching codex config. Read live so toggles hot-apply.
      if (!effectiveItemSync('mcp', name)) {
        status.set(name, { ...base, reason: 'user-disabled' })
        continue
      }
      if (explicitNames.has(name)) {
        status.set(name, { ...base, reason: 'explicit-wins' })
        continue
      }
```

</details>

**依据 6 · 源码核查**：[lib/mcp.js:349-372](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/mcp.js#L349-L372)

卸载变更并尝试实际挂载。

<details>
<summary>查看原文（24行）</summary>

```text
    // unmount removed or changed
    for (const [name, entry] of mounted) {
      const next = wanted.get(name)
      if (!next || JSON.stringify(next) !== entry.cfgJson) {
        try {
          entry.dispose()
        } catch {
          /* already disposed */
        }
        mounted.delete(name)
        ctx.logger?.info?.(`dsh-codex-sync: unmounted mirrored MCP "${name}"`)
      }
    }
    // mount new
    for (const [name, cfg] of wanted) {
      if (mounted.has(name)) continue
      try {
        const dispose = await ctx.plugin(McpClient, { ...cfg, failOnStartupError: false })
        mounted.set(name, { cfgJson: JSON.stringify(cfg), dispose })
        status.set(name, { name, transport: cfg.transport, silent: silent?.has(name) ?? false, reason: 'mounted' })
        ctx.logger?.info?.(`dsh-codex-sync: mirrored MCP "${name}" from ~/.codex/config.toml`)
      } catch (error) {
        status.set(name, { name, transport: cfg.transport, silent: silent?.has(name) ?? false, reason: 'failed', error: error?.message ?? String(error) })
        ctx.logger?.warn?.(`dsh-codex-sync: failed to mirror MCP "${name}": ${error?.message ?? error}`)
```

</details>

**依据 7 · 源码核查**：[bin/dsh-codex-sync.js:82-118](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/bin/dsh-codex-sync.js#L82-L118)

反向启动参数和托管配置写入。

<details>
<summary>查看原文（37行）</summary>

```text
/** Build the managed config.toml block for the reverse MCP server. */
function buildManagedBlock(cliPath, profile, allowRuntime) {
  const args = allowRuntime
    ? ['--profile', profile, '--allow-install', '--allow-runtime']
    : ['--profile', profile, '--allow-install']
  const lines = []
  lines.push(MARKER_START)
  lines.push('# Reverse bridge: let Codex discover/inspect/install dsh plugins')
  lines.push('# (--allow-runtime off by default to avoid spawning a second dsh instance)')
  lines.push('[mcp_servers.dsh-plugins]')
  lines.push(`command = "${cliPath}"`)
  lines.push(`args = [${args.map((a) => `"${a}"`).join(', ')}]`)
  lines.push('startup_timeout_sec = 120')
  lines.push('')
  lines.push('[mcp_servers.dsh-plugins.env]')
  lines.push(`PATH = "${serverEnvPath()}"`)
  lines.push(MARKER_END)
  return lines.join('\n')
}

/** Insert or replace the managed block in ~/.codex/config.toml. */
export function upsertCodexConfig(block) {
  let content = ''
  try {
    content = readFileSync(CODEX_CONFIG, 'utf8')
  } catch {
    content = ''
  }
  const start = content.indexOf(MARKER_START)
  const end = content.indexOf(MARKER_END)
  if (start >= 0 && end > start) {
    content = content.slice(0, start) + block + content.slice(end + MARKER_END.length)
  } else {
    content = content.replace(/\s*$/u, '\n') + '\n' + block + '\n'
  }
  writeFileSync(CODEX_CONFIG, content)
}
```

</details>

**依据 8 · 源码核查**：[bin/dsh-codex-sync.js:121-150](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/bin/dsh-codex-sync.js#L121-L150)

反向依赖构建及写入时机。

<details>
<summary>查看原文（30行）</summary>

```text
export function ensureReverseServer(dir, noBuild) {
  const cliPath = join(dir, 'dist', 'cli.js')
  if (existsSync(cliPath)) {
    log(`✓ reverse MCP server already built: ${cliPath}`)
    return cliPath
  }
  log(`→ cloning ${REVERSE_REPO} into ${dir}`)
  execFileSync('git', ['clone', '--depth', '1', REVERSE_REPO, dir], { stdio: 'inherit' })
  if (noBuild) {
    log('! --no-build: server cloned but not built; run `pnpm install && pnpm build` inside the dir')
    return cliPath
  }
  log('→ pnpm install')
  execFileSync('pnpm', ['install'], { cwd: dir, stdio: 'inherit' })
  log('→ pnpm build')
  execFileSync('pnpm', ['build'], { cwd: dir, stdio: 'inherit' })
  if (!existsSync(cliPath)) {
    throw new Error(`build finished but ${cliPath} is missing`)
  }
  log(`✓ built: ${cliPath}`)
  return cliPath
}

async function cmdCodexInstall(args) {
  const dir = args.dir ?? join(HOME, '.dsh-bridge', 'deepseek-harness-plugin-mcp')
  const profile = args.profile ?? 'web'
  const cliPath = ensureReverseServer(dir, args['no-build'] === true)
  const block = buildManagedBlock(cliPath, profile, args['allow-runtime'] === true)
  upsertCodexConfig(block)
  log(`✓ wired [mcp_servers.dsh-plugins] into ${CODEX_CONFIG}`)
```

</details>

#### 缺口

- 未执行任何镜像服务器或反向依赖。
  **影响**：不能推断启动成功、连接可用或权限满足预期。
  **进一步探讨**：用仅读取合成配置的宿主，逐个检查显式允许项的进程或 HTTP 连接及开关后的状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得试用，怎样验证可恢复迁移？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

经常在两个工具间继续阅读项目上下文的开发者，可以考虑在独立 Codex 与 DSH 数据目录中试一段合成记录，只启用手动导入。先禁用提示、MCP 镜像、自动导入和反向桥，执行预览后核对源 ID、工作区、转换事件及备份；如果不能隔离已有记录或回读，继续手工摘录。只迁移两三段文字时，附加初始化、索引与人工核查成本可能超过手工复制。需要保留工具回执、真实权限和连续执行时须逐项确认，不能依据成功日志接受。

由导入前缀匹配、反向新建与索引分步可推导一项待验证改进。预览输出完整的目标写入及依赖表，执行时逐项使用同一摘要绑定，并保留已写文件、索引与工作区回滚点。将其与现有预览及手工复制对照，用有历史分歧、索引异常和重新执行的样本比较重复记录、遗漏字段、恢复时间与人工核对。若回执与可观察文件不一致或不能降低恢复成本，不能把这个设计当成已验证增量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/import-service.js:326-356](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/import-service.js#L326-L356)

现有导入写入与预览分支供对照。

<details>
<summary>查看原文（31行）</summary>

```text
    if (existing.has(candidate.id)) {
      let oldEvents = []
      try {
        oldEvents = (await persistence.inspect(candidate.id)).events ?? []
      } catch {
        skipped += 1
        continue
      }
      const suffix = diffImportEvents(oldEvents, currentEvents)
      if (suffix.length === 0) {
        skipped += 1
        continue
      }
      if (dryRun) {
        updated += 1
        lines.push(`  [would-update] ${candidate.id}  +${suffix.length} events`)
        continue
      }
      await persistence.append(candidate.id, suffix)
      updated += 1
      lines.push(`  [updated] ${candidate.id}  +${suffix.length} events`)
      continue
    }
    if (dryRun) {
      imported += 1
      lines.push(`  [would-import] ${candidate.id}  ${candidate.cwd ?? '(no cwd)'}  ${messages.length} messages -> ${currentEvents.length} events`)
      continue
    }
    await persistence.createAndAppend(currentHeader, currentEvents)
    imported += 1
    lines.push(`  [imported] ${candidate.id}  ${candidate.cwd ?? '(no cwd)'}  ${messages.length} messages -> ${currentEvents.length} events`)
```

</details>

**依据 2 · 源码核查**：[lib/import-service.js:367-371](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/import-service.js#L367-L371)

实际挂接可涉及先前导入。

```text
  // ── workspace attach: the whole imported set, not just this batch ─────────
  if (!dryRun) {
    const attached = await attachAllImported(ctx, persistence)
    lines.push(...attached)
  }
```

**依据 3 · 源码核查**：[lib/export-codex.js:618-635](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/export-codex.js#L618-L635)

反向真实写入与索引结果分离。

<details>
<summary>查看原文（18行）</summary>

```text
    const copyNote = isCodex ? ' (new copy; original Codex thread not overwritten)' : ''
    if (dryRun) {
      exported += 1
      lines.push(`  [would-export] ${meta.id}  ${messages.length} messages -> ${path}${copyNote}`)
      continue
    }
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, body)
    const indexed = indexCodexThread(codexHome, {
      uuid,
      path,
      cwd: meta.cwd || '',
      createdAt,
      title,
      firstUser: firstUserPreview(messages),
    })
    exported += 1
    lines.push(`  [exported] ${meta.id}  ${messages.length} messages -> ${path}${copyNote}${indexed ? '  (indexed)' : '  (jsonl only — restart Codex)'}`)
```

</details>

**依据 4 · 源码核查**：[lib/mcp.js:270-276](https://github.com/Walvez/dsh-codex-sync/blob/75bbca80457eb5743a8fd293e1315f45a0771427/lib/mcp.js#L270-L276)

允许范围可在独立验证中收窄。

```text
export function startMcpMirror(ctx, codexHome = join(homedir(), '.codex'), config = {}) {
  const configPath = join(codexHome, 'config.toml')
  const deny = new Set(HARD_DENY)
  for (const name of config.mcpMirrorDeny ?? []) deny.add(name)
  const only = config.mcpMirrorOnly ? new Set(config.mcpMirrorOnly) : null
  const silent = config.mcpMirrorSilent ? new Set(config.mcpMirrorSilent) : null
  const explicitNames = new Set(Object.keys(config.mcpServers ?? {}))
```

#### 缺口

- 没有实施绑定预览与恢复记录，也未量化重复迁移。
  **影响**：无法估计比摘录节省多少。
  **进一步探讨**：以同一段预先裁定的合成会话比较信息保留、重复条目和操作成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
