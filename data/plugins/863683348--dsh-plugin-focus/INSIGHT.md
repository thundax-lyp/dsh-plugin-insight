# dsh-plugin-focus

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[6aabf70](https://github.com/863683348/dsh-plugin-focus/tree/6aabf70615a191a14c7a1e25141b4d15560f3a47)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-focus) [![npm 30d 867](https://img.shields.io/static/v1?label=npm+30d&message=867&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus)
<!-- END META -->

> **实现功能**：为DSH提供工作区内的持久焦点板，模型可记录目标、约束和决定，按标签汇总，并在每轮或内容变化时自动注入上下文。

> **核心亮点**：以透明MD和标签把工作区笔记接到focus工具、会话投影及pre-step快照，减少压缩后手工提醒；不提供真相判断或新检索算法。详见[Q02](#research-q02)。

> **风险与缺陷**：新增后裁剪到同条数，changed=false便跳过保存，默认60条满额后新增不持久化；无版本写入、无cwd跳过contains也限制承诺，未运行复现。详见[Q03](#research-q03)。

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
  - [Q01 · 焦点板解决什么问题，成功如何判断？](#detail-section-11)
  - [Q02 · 笔记、标签、投影和注入怎样连接？](#detail-section-12)
  - [Q03 · 达到条目上限、并发和路径有什么限制？](#detail-section-13)
  - [Q04 · 安装和持续使用依赖什么？](#detail-section-14)
  - [Q05 · 工程恢复与资源成本是什么？](#detail-section-15)
  - [Q06 · 采用和未验证假设是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在DSH里持续完成长任务、经历上下文压缩和跨会话交接的用户。普通todo记录下一步，focus板记录目标、硬约束和决定，以工作区内的MD让后续Agent能重新读取。它按工作区共享，不是每个会话私有或跨设备云记忆。

合格结果应包括关键约束确实落盘、后续正确工作区读取、被重新注入可见上下文，以及Agent最终按约束完成任务。前面属于存储/接线，最后的遵循需要任务结果对照；插件并不判定笔记真实、陈旧或相互矛盾，也不保证模型看到后执行正确。

基线是手工维护AGENTS/任务笔记并提醒模型读，或依赖宿主压缩摘要。插件减少手工找文件和每轮提醒的成本，适合小量短笔记。多人/多Agent同一工作区、长期超过条目上限和需要强可追溯约束变更时，应先理解共享、写入和截断边界。

手动工作区笔记/AGENTS和宿主压缩摘要；增量是模型维护与每轮重注入，不是自动可靠的事实记忆。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 笔记写读 | 目标/约束/决定留工作区 | set也追加，满额新增不保存 |
| 标签summary | kind/status计数分组 | 没有item状态更新，非业务完成率 |
| 自动注入 | 每轮首步和内容变化时读板 | 新到旧，不是约束优先；读取错误静默跳过 |
| clear归档 | 累加bak后清板 | 两次写入不事务，归档持续增长 |
| 只读面板 | 显示投影当前板 | 旧投影字段与loader兼容待核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH/Cordis及tools/fs/systemPrompt/agents | host硬注入 | 工具、文件和自动上下文 | 仅MD文件不代表注入服务就绪 |
| zod与宿主peer | 包声明 | 配置/投影schema | 具体版本按固定package核对 |
| 正确session cwd与可写工作区 | 隔离/持久化前提 | 定位板和归档 | 无cwd退默认fs，跳过包围检查 |
| sessionProjections | UI投影需要 | focus/write到浏览器 | 延迟注入，可选服务未到则无面板数据 |
| Web runtime/locale/conversation及React | 只读UI需要 | loader与dock slot | optional peer不保证任何宿主代际可显示 |
| 笔记短小且不含秘密 | 使用约束 | 每轮发给模型 | 文件本地不代表不外发 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/宿主，备份focus和archive，明确共享工作区 | 多任务别误用同一焦点板 |
| 安装 | 加bundle或复制独立preset挂载并重启 | 工具与fs服务正确接线 |
| 写入 | 模型短写目标/约束与决定，读取确认 | 不把changed=false误当已记住新增 |
| 使用 | get/summary检查陈旧项与注入上限 | 标签计数不等于业务完成 |
| 结束 | 明确归档/clear影响共享工作区 | 失败先保留原板，核对两份写入 |

包未声明最低Node，不硬填版本。README将只读Web面板标experimental，投影仍用旧schema/view字段，本轮不验证具体宿主UI兼容，也不执行普通冒烟。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 插件/peer、板文件 | 整理短目标并核对cwd/宿主schema | 未测接入耗时 |
| 持续使用 | 每step读文件、每turn/变化注入、归档增长 | 模型维护条目与人工清理冲突 | 默认8000字符不等于固定token费用 |
| 失败恢复 | 文件备份与可能重写 | 查满额未落盘、并发覆盖、归档失败 | 无版本链，恢复工时未知 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 持久记录 | MD读写与归档链 | 满额新增和并发不丢失，源码有缺口 |
| 上下文恢复 | 首step/变化时snapshot | 是否减少目标漂移和返工 |
| 标签视图 | kind/status分组计数 | 条目状态是否真实/陈旧 |
| UI | 只读projection面板代码 | 当前宿主实际wire与slot兼容 |

> **思考**：新增后裁剪到同条数，changed=false便跳过保存，默认60条满额后新增不持久化；无版本写入、无cwd跳过contains也限制承诺，未运行复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：以透明MD和标签把工作区笔记接到focus工具、会话投影及pre-step快照，减少压缩后手工提醒；不提供真相判断或新检索算法。详见[Q02](#research-q02)。

以透明MD和标签把工作区笔记接到focus工具、会话投影及pre-step快照，减少压缩后手工提醒；不提供真相判断或新检索算法。详见[Q02](#research-q02)。

纯board模块没有宿主依赖，解析/序列化/归档/标签可独立理解，工具与pre-step共用loadBoard，归档先于clear避免先清空再备份。这些接线比较简单透明。但没有内容版本或事务，写工具日志和板文件也分两步；归档无限累积，maxEntries只约束当前条目数，不限制单条note长度或读取文件字节。

renderBoard按最新优先，某条过长时直接停止并报告遗漏，不部分截取，因此最大一条也可能让可用板只有标题和遗漏脚注。maxChars不是严格最终长度上限，附加标题/遗漏说明可超预算。每轮首步重新注入、变化时再注入，会增加token；本地网络请求为零不等于模型服务看不到板内容。读取失败被autoInject catch静默跳过，模型可能在未看到约束时继续。

<a id="detail-section-5"></a>

### 1.4 主要限制

新增后裁剪到同条数，changed=false便跳过保存，默认60条满额后新增不持久化；无版本写入、无cwd跳过contains也限制承诺，未运行复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。继续探讨从maxEntries=1的连续新增、同工作区交错写入和无cwd调用，再查投影代际；少量笔记也需读回确认，不把标签当任务事实。详见[Q06](#research-q06)。

合格结果应包括关键约束确实落盘、后续正确工作区读取、被重新注入可见上下文，以及Agent最终按约束完成任务。前面属于存储/接线，最后的遵循需要任务结果对照；插件并不判定笔记真实、陈旧或相互矛盾，也不保证模型看到后执行正确。

基线是手工维护AGENTS/任务笔记并提醒模型读，或依赖宿主压缩摘要。插件减少手工找文件和每轮提醒的成本，适合小量短笔记。多人/多Agent同一工作区、长期超过条目上限和需要强可追溯约束变更时，应先理解共享、写入和截断边界。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持文件板/工具/注入接线；满额后新增不落盘、共享并发和路径前提限制持久承诺，任务遵循改善未测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/board.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定lib的纯board、模型工具、fs路径、归档、投影与自动注入全链；未执行目标。仓库dsh-factory开发Skill未由本插件运行入口注册，不当focus能力或独立验证材料。
- 下一步：进一步探讨可用满额连续新增、两个Agent交错和旧约束撤销的固定任务，比较磁盘保全、注入内容、违约与token。

**分析版本**

- **仓库**：[863683348/dsh-plugin-focus](https://github.com/863683348/dsh-plugin-focus)
- **版本号**：1.1.2（[固定提交 6aabf70](https://github.com/863683348/dsh-plugin-focus/tree/6aabf70615a191a14c7a1e25141b4d15560f3a47)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索稳定item ID、supersedes/CAS和约束优先注入收据，比较保全、违约、token与维护开销；未实现。详见[Q06](#research-q06)。

进一步探讨可用满额连续新增、两个Agent交错和旧约束撤销的固定任务，比较磁盘保全、注入内容、违约与token。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 602 | — | — | 5337 |
| .js | source | 4 | 665 | 462 | 163 | — |
| .mjs | source | 1 | 30 | 18 | 6 | — |
| .mjs | test | 1 | 247 | 223 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-focus/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-focus/issues?q=is%3Aissue+created%3A2026-09-22T05%3A31%3A43.494Z..2026-10-22T05%3A31%3A43.494Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-focus/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A31%3A43.494Z..2026-10-22T05%3A31%3A43.494Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断固定版本工作区焦点板的持久化和自动注入价值，重点核查满额、并发、路径及陈旧约束。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 焦点板解决什么问题，成功如何判断？

**研究主题：**场景与需求

#### 完整回答

面向在DSH里持续完成长任务、经历上下文压缩和跨会话交接的用户。普通todo记录下一步，focus板记录目标、硬约束和决定，以工作区内的MD让后续Agent能重新读取。它按工作区共享，不是每个会话私有或跨设备云记忆。

合格结果应包括关键约束确实落盘、后续正确工作区读取、被重新注入可见上下文，以及Agent最终按约束完成任务。前面属于存储/接线，最后的遵循需要任务结果对照；插件并不判定笔记真实、陈旧或相互矛盾，也不保证模型看到后执行正确。

基线是手工维护AGENTS/任务笔记并提醒模型读，或依赖宿主压缩摘要。插件减少手工找文件和每轮提醒的成本，适合小量短笔记。多人/多Agent同一工作区、长期超过条目上限和需要强可追溯约束变更时，应先理解共享、写入和截断边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-3](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/README.md#L1-L3)

作者定位目标、约束、跨压缩及工作区共享。

```text
# dsh-plugin-focus — Focus Board for DeepSeek Harness agents

A real, installable **DSH plugin** (DeepSeek Harness / Cordis profile bundle) that gives the agent a `focus` tool and a durable **focus board** — a small note file (default `.dsh/focus.md`) in the session workspace that pins **the objective, hard constraints, and decisions** across context compaction and across sessions on the same workspace. The todo list tracks *what to do next*; the focus board tracks *why we are doing it and what must not drift*.
```

**依据 2 · 源码核查**：[lib/index.js:58-58](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L58-L58)

提示词指引要求模型主动set/append/get，非自动真相判断。

```text
const FOCUS_SECTION_TEXT = "The `focus` tool maintains a durable focus board for the current task: a small note file (`.dsh/focus.md` by default) persisted in this session's workspace. Unlike the todo list (what to do next), the board pins what must NOT drift — the objective, hard constraints, and decisions.\n\nUse it deliberately:\n- At task start, or whenever the objective changes, call `focus set` with the current objective and any hard constraints.\n- While working, `focus append` decisions, reversals, and discoveries worth remembering.\n- After an interruption, before switching subtasks, or when context was compacted, call `focus get` to re-read the board.\n- When the task is done or the board is stale, `focus clear`.\n\nThe board is also injected into your context automatically at each turn start. Keep notes terse — a line or two. The board is working context, not documentation.";
```

**依据 3 · 源码核查**：[lib/index.js:192-195](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L192-L195)

实际按Agent session cwd读共享文件。

```text
      const cwd = exec.agent?.session?.header?.cwd;
      const board = await loadBoard(ctx, file, cwd, exec.signal);
      const before = board.entries.length;
      let updated = board;
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 笔记、标签、投影和注入怎样连接？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

一个focus模型工具提供set/append/get/summary/clear。set与append在纯board逻辑中都追加时间条目，不真正替换旧目标；kind/status以笔记前缀保存，summary按标签计数和分组，completion只是open/done条目的比例，不是任务真实完成率。clear先追加旧板到archiveFile，再写空板。

读写通过ctx.fs，默认.dsh/focus.md。成功写后向会话追加focus/write事件，sessionProjection显示最后板文本，turn/start清空投影。autoInject在pre-step调用后继，非reject/abort则读取磁盘，首step或文本变化时追加plugin snapshot与focus/write；WeakMap按Agent缓存上次注入文本。浏览器只读面板订阅focusBoard显示字符串，不直接读磁盘或编辑。

贡献是将透明MD、模型维护、宿主工具/提示词/投影/自动注入连接起来。标签summary帮助人看重点，但autoInject调用的是renderBoard按新到旧输出，不是renderSummary或constraint优先排序；不能从工具描述“prioritise constraints”推断真正实现了约束优先。纯逻辑与宿主适配分开可借鉴，不是新长期记忆检索算法。

#### 证据与依据

**依据 1 · 源码核查**：[lib/board.js:109-117](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/board.js#L109-L117)

set和append同为追加，clear清空。

```text
export function applyAction(board, action, note, now, meta = {}) {
  if (action === "set" || action === "append") {
    if (typeof note !== "string" || note.trim().length === 0) {
      throw new Error('focus: "note" is required for action "' + action + '"');
    }
    const composed = composeNote({ kind: meta.kind ?? null, status: meta.status ?? null, text: note });
    return { entries: board.entries.concat([{ time: now, kind: action, note: composed }]) };
  }
  if (action === "clear") return emptyBoard();
```

**依据 2 · 源码核查**：[lib/board.js:162-192](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/board.js#L162-L192)

统计标签和completion比例。

<details>
<summary>查看原文（31行）</summary>

```text
  const entries = tagEntries(board);
  const byKind = { objective: 0, constraint: 0, decision: 0, note: 0, untagged: 0 };
  let open = 0;
  let done = 0;
  for (const entry of entries) {
    const key = entry.tagKind ?? "untagged";
    byKind[key] = (byKind[key] || 0) + 1;
    if (entry.status === "open") open += 1;
    else if (entry.status === "done") done += 1;
  }
  const tracked = open + done;
  return {
    total: entries.length,
    byKind,
    open,
    done,
    completionRate: tracked > 0 ? Math.round((done / tracked) * 1000) / 10 : null,
    entries,
  };
}

/** Compact markdown summary: counts, open items, constraints and decisions. */
export function renderSummary(board, { maxItems = 8 } = {}) {
  const stats = summarizeBoard(board);
  const latest = (kind, status) => stats.entries
    .filter((e) => (kind === undefined || e.tagKind === kind) && (status === undefined || e.status === status))
    .slice(-Math.max(1, maxItems))
    .reverse();
  const lines = [
    "# Focus summary",
    "",
```

</details>

**依据 3 · 源码核查**：[lib/index.js:199-214](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L199-L214)

归档、写入和focus/write事件。

<details>
<summary>查看原文（16行）</summary>

```text
        updated = trimEntries(applyAction(board, action, note, new Date().toISOString(), { kind: args.kind ?? null, status: args.status ?? null }), maxEntries);
      } else if (action === "clear") {
        if (config.archive && before > 0) {
          const target = await appendArchive(ctx, config.archiveFile, buildArchiveText(board, new Date().toISOString()), cwd, exec.signal);
          archived = true;
          archivePath = ctx.fs.processPath(target);
        }
        updated = emptyBoard();
      }

      const changed = updated.entries.length !== before;
      if (action !== "get" && changed) {
        const target = await resolveTarget(ctx, file, cwd, exec.signal);
        await ctx.fs.writeText(target, serializeBoard(updated), undefined, exec.signal);
        if (exec.agent?.session) {
          exec.agent.session.append("focus/write", boardEvent(action, updated, renderBoard(updated, maxChars)));
```

</details>

**依据 4 · 源码核查**：[lib/index.js:244-263](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L244-L263)

投影事件与turn/start reset。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.inject(["sessionProjections"], (projectionCtx) => {
    projectionCtx.sessionProjections.register({
      key: "focusBoard",
      schema: zod.union([
        zod.object({
          board: zod.string(),
          entries: zod.number(),
          action: zod.string(),
        }),
        zod.null(),
      ]),
      init: () => null,
      apply: (state, event) => {
        if (event.type === "focus/write") return event.data;
        if (event.type === "turn/start") return null;
        return state;
      },
      view: (state) => state,
      stateVersion: 1,
    });
```

</details>

**依据 5 · 源码核查**：[lib/index.js:271-299](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L271-L299)

每Agent注入去重和snapshot。

<details>
<summary>查看原文（29行）</summary>

```text
    const lastInjected = new WeakMap();
    ctx.on("agent/pre-step", async ({ agent, turn, step, signal }, next) => {
      const decision = await next();
      if (decision.kind === "reject" || signal.aborted) return decision;
      const cwd = agent.session?.header?.cwd;
      let board;
      try {
        board = await loadBoard(ctx, file, cwd, signal);
      } catch {
        return decision;
      }
      if (board.entries.length === 0) return decision;
      const text = renderBoard(board, maxChars);
      const last = lastInjected.get(agent);
      if (step !== 1 && last === text) return decision;
      lastInjected.set(agent, text);
      agent.session.append("focus/write", boardEvent("auto", board, text));
      return {
        kind: "enter",
        messages: decision.messages.concat([createUserMessage({
          content: [{ type: "text", text: "Focus board (current):\n\n" + text }],
          source: {
            kind: "plugin",
            plugin: name,
            form: "snapshot",
            sections: [{ name: "focus:board", text }],
          },
        })]),
      };
```

</details>

**依据 6 · 源码核查**：[lib/client.js:34-61](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/client.js#L34-L61)

只读面板订阅投影。

<details>
<summary>查看原文（28行）</summary>

```text

    /** Read-only dock entry: the session's current focus board text. */
    function FocusPanel(props) {
      var useProjection = props.useProjection;
      var projection = useProjection("focusBoard");
      if (projection == null || projection.board.length === 0) {
        return react.createElement(
          "div",
          { className: "dshfp-dock", "data-focus-panel": true },
          react.createElement("div", { className: "dshfp-empty" }, "Focus board is empty — ask the agent to pin it with the focus tool.")
        );
      }
      return react.createElement(
        "div",
        { className: "dshfp-dock", "data-focus-panel": true },
        react.createElement("div", { className: "dshfp-head" }, "Focus board (" + projection.entries + " entr" + (projection.entries === 1 ? "y" : "ies") + ")"),
        react.createElement("pre", { className: "dshfp-body" }, projection.board)
      );
    }

    /** Browser plugin body: register the dock entry into the composer dock. */
    function apply(ctx) {
      ctx.slots.inject("conversation.input.dock", function () {
        return ctx.slots.register({
          name: "conversation.input.dock",
          id: "focus-board",
          order: 20,
        }, FocusPanel);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 达到条目上限、并发和路径有什么限制？

**研究主题：**缺陷与关键质疑

#### 完整回答

核心持久化判断有静态缺陷。set/append先追加再trimEntries(maxEntries)，changed仅比较updated.entries.length与before。默认60条时，第61条使裁剪后的长度仍60，changed=false，于是不writeText也不发focus/write；后续同样停在旧磁盘内容。工具回报unchanged，不会把新内容写进去。这个反例由两个函数直接组成，未执行目标测试或生产复现。

即使未满，也是在loadBoard后无版本参数地writeText整板，两个Agent同工作区读同一旧值后各追加，后写可能覆盖另一新增。archive同样读再写，无锁；clear涉及先归档后清空两个写入，后一步失败可留旧板/重复归档。标签没有稳定item ID或update动作，写“done”新条目不会自动把先前open条目改状态，旧约束和新目标会并存，必须由模型自己解释撤销关系。

路径检查仅在cwd!==undefined时resolve根并contains；没有Agent/session cwd时退fs默认，并不检查工作区包围。contains的真实物理路径/符号链接和policy语义取决于宿主fs，本轮没有读对应宿主实现，不能重复README/SECURITY“永不逃逸”的绝对保证。板是可手工编辑的文件，内容作为plugin snapshot进入模型，不自动区分可信硬约束和外来指令。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:192-214](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L192-L214)

长度判断使满额后的新增不持久化，writeText无版本参数。

<details>
<summary>查看原文（23行）</summary>

```text
      const cwd = exec.agent?.session?.header?.cwd;
      const board = await loadBoard(ctx, file, cwd, exec.signal);
      const before = board.entries.length;
      let updated = board;
      let archived = false;
      let archivePath;
      if (action === "set" || action === "append") {
        updated = trimEntries(applyAction(board, action, note, new Date().toISOString(), { kind: args.kind ?? null, status: args.status ?? null }), maxEntries);
      } else if (action === "clear") {
        if (config.archive && before > 0) {
          const target = await appendArchive(ctx, config.archiveFile, buildArchiveText(board, new Date().toISOString()), cwd, exec.signal);
          archived = true;
          archivePath = ctx.fs.processPath(target);
        }
        updated = emptyBoard();
      }

      const changed = updated.entries.length !== before;
      if (action !== "get" && changed) {
        const target = await resolveTarget(ctx, file, cwd, exec.signal);
        await ctx.fs.writeText(target, serializeBoard(updated), undefined, exec.signal);
        if (exec.agent?.session) {
          exec.agent.session.append("focus/write", boardEvent(action, updated, renderBoard(updated, maxChars)));
```

</details>

**依据 2 · 源码核查**：[lib/board.js:93-95](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/board.js#L93-L95)

裁剪保留maxEntries导致长度不变。

```text
export function trimEntries(board, maxEntries) {
  if (board.entries.length <= maxEntries) return board;
  return { entries: board.entries.slice(-maxEntries) };
```

**依据 3 · 源码核查**：[lib/index.js:78-86](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L78-L86)

无cwd跳过contains。

```text
async function resolveTarget(ctx, file, cwd, signal) {
  const target = await ctx.fs.resolve(file, cwd !== undefined ? { cwd, signal } : { signal });
  if (cwd !== undefined) {
    const cwdTarget = await ctx.fs.resolve(".", { cwd, signal });
    if (!ctx.fs.contains(cwdTarget, target)) {
      throw new Error('focus: configured file "' + file + '" escapes the session workspace');
    }
  }
  return target;
```

**依据 4 · 源码核查**：[lib/index.js:114-121](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L114-L121)

archive读后整体写，无CAS。

```text
async function appendArchive(ctx, archiveFile, archiveText, cwd, signal) {
  const target = await resolveTarget(ctx, archiveFile, cwd, signal);
  const info = await ctx.fs.stat(target, signal);
  const existing = info !== undefined ? await ctx.fs.readText(target, signal) : "";
  const content = existing.length === 0 || existing.endsWith("\n")
    ? existing + archiveText
    : existing + "\n" + archiveText;
  await ctx.fs.writeText(target, content, undefined, signal);
```

**依据 5 · 源码核查**：[lib/board.js:109-117](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/board.js#L109-L117)

没有按item更新状态，set也追加。

```text
export function applyAction(board, action, note, now, meta = {}) {
  if (action === "set" || action === "append") {
    if (typeof note !== "string" || note.trim().length === 0) {
      throw new Error('focus: "note" is required for action "' + action + '"');
    }
    const composed = composeNote({ kind: meta.kind ?? null, status: meta.status ?? null, text: note });
    return { entries: board.entries.concat([{ time: now, kind: action, note: composed }]) };
  }
  if (action === "clear") return emptyBoard();
```

#### 缺口

- 满额丢新增、并发覆盖和归档部分失败未执行复现。
  **影响：**静态路径足以限制持久化承诺，但不推断所有已有笔记已丢失。
  **进一步探讨：**从maxEntries=1的两次追加及两个同工作区Agent交错写入的固定序列检查磁盘收据。
- 宿主fs.contains的真实路径、版本和权限契约未核查。
  **影响：**不能给物理路径隔离或并发保存验收。
  **进一步探讨：**沿固定宿主fs.resolve/contains/writeText实现核对symlink与CAS语义。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装和持续使用依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH/Cordis及tools/fs/systemPrompt/agents | host硬注入 | 工具、文件和自动上下文 | 仅MD文件不代表注入服务就绪 |
| zod与宿主peer | 包声明 | 配置/投影schema | 具体版本按固定package核对 |
| 正确session cwd与可写工作区 | 隔离/持久化前提 | 定位板和归档 | 无cwd退默认fs，跳过包围检查 |
| sessionProjections | UI投影需要 | focus/write到浏览器 | 延迟注入，可选服务未到则无面板数据 |
| Web runtime/locale/conversation及React | 只读UI需要 | loader与dock slot | optional peer不保证任何宿主代际可显示 |
| 笔记短小且不含秘密 | 使用约束 | 每轮发给模型 | 文件本地不代表不外发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/宿主，备份focus和archive，明确共享工作区 | 多任务别误用同一焦点板 |
| 安装 | 加bundle或复制独立preset挂载并重启 | 工具与fs服务正确接线 |
| 写入 | 模型短写目标/约束与决定，读取确认 | 不把changed=false误当已记住新增 |
| 使用 | get/summary检查陈旧项与注入上限 | 标签计数不等于业务完成 |
| 结束 | 明确归档/clear影响共享工作区 | 失败先保留原板，核对两份写入 |

包未声明最低Node，不硬填版本。README将只读Web面板标experimental，投影仍用旧schema/view字段，本轮不验证具体宿主UI兼容，也不执行普通冒烟。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:38-69](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/package.json#L38-L69)

zod、client声明与宿主peer条件。

<details>
<summary>查看原文（32行）</summary>

```text
    "zod": "^4.4.3"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-runtime": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-fs": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-session-projection": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-system-prompt": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-client-locale": {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:35-54](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L35-L54)

硬依赖与默认条目/字数设置。

<details>
<summary>查看原文（20行）</summary>

```text
const inject = ["tools", "fs", "systemPrompt", "agents"];

/** Composition-row configuration for the plugin entry. */
const Config = z.object({
  /** Board file path, relative to the agent's session workspace. */
  file: z.string().default(".dsh/focus.md"),
  /** Archive file path (clear moves the old board here). */
  archiveFile: z.string().default(".dsh/focus.md.bak"),
  /** Keep an archive of the cleared board. */
  archive: z.boolean().default(true),
  /** Keep at most this many entries on disk (oldest dropped). */
  maxEntries: z.number().default(60),
  /** Render cap for the model-facing board text (get / injection). */
  maxChars: z.number().default(8000),
  /** Inject the board into the model context at turn start and on changes. */
  autoInject: z.boolean().default(true),
  /** Register the focus prompt-guidance section. */
  personaSection: z.boolean().default(true),
  /** Order of the focus prompt section (ascending; persona is 0). */
  sectionOrder: z.number().default(5),
```

</details>

**依据 3 · 源码核查**：[lib/index.js:244-263](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L244-L263)

投影使用schema/view，未见wire块。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.inject(["sessionProjections"], (projectionCtx) => {
    projectionCtx.sessionProjections.register({
      key: "focusBoard",
      schema: zod.union([
        zod.object({
          board: zod.string(),
          entries: zod.number(),
          action: zod.string(),
        }),
        zod.null(),
      ]),
      init: () => null,
      apply: (state, event) => {
        if (event.type === "focus/write") return event.data;
        if (event.type === "turn/start") return null;
        return state;
      },
      view: (state) => state,
      stateVersion: 1,
    });
```

</details>

**依据 4 · 作者声明**：[lib/client.js:1-10](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/client.js#L1-L10)

作者明确浏览器模块实验性。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-plugin-focus — browser face: a read-only focus-board panel docked above
 * the composer, rendered from the `focusBoard` session projection.
 *
 * EXPERIMENTAL: this hand-written module mirrors the loader format emitted by
 * the in-repo client bundles (window.__ModuleLoader__.load with a CommonJS
 * factory). It is served to the browser on demand via the client-modules
 * roster (/plugins/<id>/client.js) when this package's composition row is
 * mounted on a web profile. React is required through the app's module
 * table; no JSX, no bundler, no TS.
```

</details>

**依据 5 · 源码核查**：[lib/index.js:78-86](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L78-L86)

cwd条件。

```text
async function resolveTarget(ctx, file, cwd, signal) {
  const target = await ctx.fs.resolve(file, cwd !== undefined ? { cwd, signal } : { signal });
  if (cwd !== undefined) {
    const cwdTarget = await ctx.fs.resolve(".", { cwd, signal });
    if (!ctx.fs.contains(cwdTarget, target)) {
      throw new Error('focus: configured file "' + file + '" escapes the session workspace');
    }
  }
  return target;
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程恢复与资源成本是什么？

**研究主题：**工程质量与复用、效果与总成本

#### 完整回答

纯board模块没有宿主依赖，解析/序列化/归档/标签可独立理解，工具与pre-step共用loadBoard，归档先于clear避免先清空再备份。这些接线比较简单透明。但没有内容版本或事务，写工具日志和板文件也分两步；归档无限累积，maxEntries只约束当前条目数，不限制单条note长度或读取文件字节。

renderBoard按最新优先，某条过长时直接停止并报告遗漏，不部分截取，因此最大一条也可能让可用板只有标题和遗漏脚注。maxChars不是严格最终长度上限，附加标题/遗漏说明可超预算。每轮首步重新注入、变化时再注入，会增加token；本地网络请求为零不等于模型服务看不到板内容。读取失败被autoInject catch静默跳过，模型可能在未看到约束时继续。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 插件/peer、板文件 | 整理短目标并核对cwd/宿主schema | 未测接入耗时 |
| 持续使用 | 每step读文件、每turn/变化注入、归档增长 | 模型维护条目与人工清理冲突 | 默认8000字符不等于固定token费用 |
| 失败恢复 | 文件备份与可能重写 | 查满额未落盘、并发覆盖、归档失败 | 无版本链，恢复工时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 持久记录 | MD读写与归档链 | 满额新增和并发不丢失，源码有缺口 |
| 上下文恢复 | 首step/变化时snapshot | 是否减少目标漂移和返工 |
| 标签视图 | kind/status分组计数 | 条目状态是否真实/陈旧 |
| UI | 只读projection面板代码 | 当前宿主实际wire与slot兼容 |


#### 证据与依据

**依据 1 · 源码核查**：[lib/board.js:213-244](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/board.js#L213-L244)

新到旧渲染、整条超限停止与遗漏脚注。

<details>
<summary>查看原文（32行）</summary>

```text
 * Render the board for the model: newest entry first, capped at `maxChars`.
 * Older entries are omitted from the view (never deleted from the file) with
 * a footer stating how many were omitted.
 * @param board - the board to render.
 * @param maxChars - maximum output characters.
 * @returns the rendered markdown text.
 */
export function renderBoard(board, maxChars = 8000) {
  const entries = board.entries.slice().reverse(); // newest first
  const blocks = [];
  let total = HEADER.length;
  let omitted = 0;
  for (let i = 0; i < entries.length; i++) {
    const tag = parseNoteTag(entries[i].note);
    const mark = tag.status === "done" ? " ✅" : tag.status === "open" ? " ⏳" : "";
    const shown = tag.kind ? "[" + tag.kind + "]" + mark + " " + tag.text : entries[i].note;
    const block = "## [" + entries[i].time + "] " + entries[i].kind + "\n" + shown;
    const separator = blocks.length === 0 ? 1 : 2;
    if (total + block.length + separator > maxChars) {
      omitted = entries.length - i;
      break;
    }
    blocks.push(block);
    total += block.length + separator;
  }
  const lines = [HEADER];
  for (const block of blocks) lines.push("", block);
  if (omitted > 0) {
    lines.push("", "(... " + omitted + " older entr" + (omitted === 1 ? "y" : "ies") + " omitted from this view; the file on disk is complete)");
  }
  return lines.join("\n");
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:274-287](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L274-L287)

每step读取，异常静默跳过与每turn重注入。

<details>
<summary>查看原文（14行）</summary>

```text
      if (decision.kind === "reject" || signal.aborted) return decision;
      const cwd = agent.session?.header?.cwd;
      let board;
      try {
        board = await loadBoard(ctx, file, cwd, signal);
      } catch {
        return decision;
      }
      if (board.entries.length === 0) return decision;
      const text = renderBoard(board, maxChars);
      const last = lastInjected.get(agent);
      if (step !== 1 && last === text) return decision;
      lastInjected.set(agent, text);
      agent.session.append("focus/write", boardEvent("auto", board, text));
```

</details>

**依据 3 · 源码核查**：[lib/index.js:114-121](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L114-L121)

归档读旧文件整体拼接，未做上限。

```text
async function appendArchive(ctx, archiveFile, archiveText, cwd, signal) {
  const target = await resolveTarget(ctx, archiveFile, cwd, signal);
  const info = await ctx.fs.stat(target, signal);
  const existing = info !== undefined ? await ctx.fs.readText(target, signal) : "";
  const content = existing.length === 0 || existing.endsWith("\n")
    ? existing + archiveText
    : existing + "\n" + archiveText;
  await ctx.fs.writeText(target, content, undefined, signal);
```

**依据 4 · 源码核查**：[lib/index.js:199-214](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L199-L214)

文件先写再追加事件，未用版本。

<details>
<summary>查看原文（16行）</summary>

```text
        updated = trimEntries(applyAction(board, action, note, new Date().toISOString(), { kind: args.kind ?? null, status: args.status ?? null }), maxEntries);
      } else if (action === "clear") {
        if (config.archive && before > 0) {
          const target = await appendArchive(ctx, config.archiveFile, buildArchiveText(board, new Date().toISOString()), cwd, exec.signal);
          archived = true;
          archivePath = ctx.fs.processPath(target);
        }
        updated = emptyBoard();
      }

      const changed = updated.entries.length !== before;
      if (action !== "get" && changed) {
        const target = await resolveTarget(ctx, file, cwd, exec.signal);
        await ctx.fs.writeText(target, serializeBoard(updated), undefined, exec.signal);
        if (exec.agent?.session) {
          exec.agent.session.append("focus/write", boardEvent(action, updated, renderBoard(updated, maxChars)));
```

</details>

#### 缺口

- 没有相同压缩任务下的约束遵循率、返工时间和token对照。
  **影响：**只能肯定注入接线，不能证明“减少漂移”净收益。
  **进一步探讨：**固定目标/约束和压缩点，比较手工笔记、宿主摘要与focus的遗漏/违约和成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 采用和未验证假设是什么？

**研究主题：**采用判断、新假设与验证

#### 完整回答

建议观察。透明工作区笔记、模型工具与自动注入适合长任务，基础组件也便于理解；但达到默认条目上限后新内容不保存，直接影响核心“持久焦点”承诺。先核实长度变更判断和写入版本，再考虑少量非敏感笔记；不要把UI标签或changed回报当任务事实。

继续探讨可从maxEntries=1两次追加的磁盘结果、同工作区两个Agent交错写入及无cwd调用入手，再检查新宿主投影wire兼容。普通宿主冒烟不属于本轮未知清单；本轮结论是已检查源码，未把测试目录存在说成测试通过。

未验证假设是把笔记改为稳定item ID、显式supersedes/状态修订与文件CAS版本，持久化依据内容而非数量变化；注入按活跃约束和未完成项选取，并给省略/冲突收据。相较单纯append+新到旧，可能减少满额丢新增、并发覆盖和陈旧约束，但需要迁移和模型维护开销。最小对照固定两Agent、满额、撤销旧约束和压缩点，比较已确认写入保全、实际注入约束、任务违约率及token；若省略关键信息或状态维护更混乱，则不支持。未实现，不计既有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:199-214](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js#L199-L214)

满额changed判断和无版本写入是设计起点。

<details>
<summary>查看原文（16行）</summary>

```text
        updated = trimEntries(applyAction(board, action, note, new Date().toISOString(), { kind: args.kind ?? null, status: args.status ?? null }), maxEntries);
      } else if (action === "clear") {
        if (config.archive && before > 0) {
          const target = await appendArchive(ctx, config.archiveFile, buildArchiveText(board, new Date().toISOString()), cwd, exec.signal);
          archived = true;
          archivePath = ctx.fs.processPath(target);
        }
        updated = emptyBoard();
      }

      const changed = updated.entries.length !== before;
      if (action !== "get" && changed) {
        const target = await resolveTarget(ctx, file, cwd, exec.signal);
        await ctx.fs.writeText(target, serializeBoard(updated), undefined, exec.signal);
        if (exec.agent?.session) {
          exec.agent.session.append("focus/write", boardEvent(action, updated, renderBoard(updated, maxChars)));
```

</details>

**依据 2 · 源码核查**：[lib/board.js:109-117](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/board.js#L109-L117)

append无稳定item更新语义。

```text
export function applyAction(board, action, note, now, meta = {}) {
  if (action === "set" || action === "append") {
    if (typeof note !== "string" || note.trim().length === 0) {
      throw new Error('focus: "note" is required for action "' + action + '"');
    }
    const composed = composeNote({ kind: meta.kind ?? null, status: meta.status ?? null, text: note });
    return { entries: board.entries.concat([{ time: now, kind: action, note: composed }]) };
  }
  if (action === "clear") return emptyBoard();
```

**依据 3 · 源码核查**：[lib/board.js:213-244](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/board.js#L213-L244)

仅新到旧、不做约束优先。

<details>
<summary>查看原文（32行）</summary>

```text
 * Render the board for the model: newest entry first, capped at `maxChars`.
 * Older entries are omitted from the view (never deleted from the file) with
 * a footer stating how many were omitted.
 * @param board - the board to render.
 * @param maxChars - maximum output characters.
 * @returns the rendered markdown text.
 */
export function renderBoard(board, maxChars = 8000) {
  const entries = board.entries.slice().reverse(); // newest first
  const blocks = [];
  let total = HEADER.length;
  let omitted = 0;
  for (let i = 0; i < entries.length; i++) {
    const tag = parseNoteTag(entries[i].note);
    const mark = tag.status === "done" ? " ✅" : tag.status === "open" ? " ⏳" : "";
    const shown = tag.kind ? "[" + tag.kind + "]" + mark + " " + tag.text : entries[i].note;
    const block = "## [" + entries[i].time + "] " + entries[i].kind + "\n" + shown;
    const separator = blocks.length === 0 ? 1 : 2;
    if (total + block.length + separator > maxChars) {
      omitted = entries.length - i;
      break;
    }
    blocks.push(block);
    total += block.length + separator;
  }
  const lines = [HEADER];
  for (const block of blocks) lines.push("", block);
  if (omitted > 0) {
    lines.push("", "(... " + omitted + " older entr" + (omitted === 1 ? "y" : "ies") + " omitted from this view; the file on disk is complete)");
  }
  return lines.join("\n");
}
```

</details>

#### 缺口

- 稳定ID/CAS与约束优先注入未实现或对照。
  **影响：**只是可证伪设计，不提升当前可靠性。
  **进一步探讨：**以满额、交错写入、旧约束撤销和固定压缩任务测保全/违约/token。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
