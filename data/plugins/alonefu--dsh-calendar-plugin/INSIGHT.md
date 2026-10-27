# DSH Calendar

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6ce4095](https://github.com/AloneFu/dsh-calendar-plugin/tree/6ce4095ef800838f91abc162aa6d6646435f7605)

<!-- BEGIN META -->
[![npm 30d 5,639](https://img.shields.io/static/v1?label=npm+30d&message=5%2C639&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-calendar) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-calendar)
<!-- END META -->

> **功能**：在DSH侧栏展示Obsidian日记、月历、时间块与待办，并将局部编辑写回Markdown。

> **亮点**：相对另建日程库，增量是复用Markdown单一真源并把日记/待办交接放到DSH内；局部更新与原格式保留有源码依据，业务节时未测。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：服务端expect检查是可选条件，进程内队列也不能锁住Obsidian；原子替换不等于无外部并发覆盖。单文件真源价值必须与写入竞争风险一起判断。[Q03](#research-q03)

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
  - [Q01 · Obsidian内联日历相对直接打开笔记改变了什么？](#detail-section-11)
  - [Q02 · 任务如何从Markdown解析并受控写回？](#detail-section-12)
  - [Q03 · 乐观并发承诺在缺expect或外部编辑竞争时成立吗？](#detail-section-13)
  - [Q04 · 怎样收紧写入契约并界定可控试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Markdown日记的用户在DSH中查看和更新待办，合格结果是展示正确且文件非目标内容保持。

直接打开Obsidian或手动修改Markdown为简单替代；本轮未做真实任务切换次数/耗时比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 日记任务视图 | 按日期显示任务和Day Planner时间块 | 语法解析子集，扫描可截断，不是远程日历同步 |
| 局部写回 | 勾选、描述、时间块和新增待办 | 窄root与备份；expect服务端未强制 |
| 配置发现 | 寻找vault并保存日记根 | 有限路径扫描；未发现可手动选择 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node≥20、DSH web服务与前端 | 启动必需 | 路由和内联面板 | 无真实宿主验收，声明兼容需核对 |
| Markdown日记根与权限 | 核心必需 | 扫描与写回原文件 | 窄root并备份，权限失败不盲重试 |
| Day Planner/Calendar配置 | 可选 | 对齐时间轴和字数点 | 使用默认配置，不承诺全部插件语义兼容 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 备份并连接 | 用户选择日记子目录 | root与文件数吻合，先关闭写入 |
| 只读核对 | 用户比较月历/任务与原文 | 日期与时间正确，注意truncated |
| 小范围写回 | 用户操作，插件比较原行并替换 | 核对整文件diff；stale刷新后人工处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地安装、扫描与备份存储 | 选root及格式核对 | 金额与耗时未测，30秒为作者说法 |
| 持续使用 | 轮询扫描与本地文件IO | 复核任务日期、元数据与写回 | 无模型费主张，资源与节时未测 |
| 失败恢复 | 保留备份/临时文件与重扫 | 查看磁盘diff、恢复冲突和重新确认 | 审计可失败，恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 单文件真源 | 直接读写Markdown，无另建任务库 | 真实语法覆盖与双编辑器一致性 |
| 写回防护 | 真实路径、可选原行比较与rename | 不保证外部并发无覆盖 |
| 使用便利 | 内联月历与待办作者材料 | 端到端耗时/错误率没有独立数据 |

> **思考**：服务端expect检查是可选条件，进程内队列也不能锁住Obsidian；原子替换不等于无外部并发覆盖。单文件真源价值必须与写入竞争风险一起判断。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对另建日程库，增量是复用Markdown单一真源并把日记/待办交接放到DSH内；局部更新与原格式保留有源码依据，业务节时未测。[Q01](#research-q01) [Q02](#research-q02)

路径realpath校验、保BOM/换行和回读目标行具有可借鉴性；expect非必填、进程内队列与吞掉审计失败须显式说明。移植文件真源交互要先定义跨编辑器一致性契约。

<a id="detail-section-5"></a>

### 1.4 主要限制

服务端expect检查是可选条件，进程内队列也不能锁住Obsidian；原子替换不等于无外部并发覆盖。单文件真源价值必须与写入竞争风险一起判断。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

备份小vault中可先只读试用，再核对每次局部写回的整文件差异；存在频繁外部编辑或无恢复能力时先观察。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查解析、真实路径与写回关键路径；跨进程并发安全不成立为保证，实际丢更新未复现。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的作者材料与关键源码只读核查；未安装或执行目标代码，未运行作者测试，未安排真实宿主验收。引用的既有作者运行记录不视为本轮独立验证。
- 下一步：副本上覆盖缺expect、同行/异行竞写、CRLF/BOM及符号链接，记录冲突显式性和恢复量；当前只读源码，没有执行写入。

**分析版本**

- **仓库**：[AloneFu/dsh-calendar-plugin](https://github.com/AloneFu/dsh-calendar-plugin)
- **版本号**：1.1.0（[固定提交 6ce4095](https://github.com/AloneFu/dsh-calendar-plugin/tree/6ce4095ef800838f91abc162aa6d6646435f7605)）
- **版本日期**：2026-10-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是强制原文/版本前置条件并协调外部编辑，降低静默覆盖；单加mtime仍有竞态。以同一行/其他行/缺expect的受控竞写检验冲突可见性和恢复成本。[Q04](#research-q04)

副本上覆盖缺expect、同行/异行竞写、CRLF/BOM及符号链接，记录冲突显式性和恢复量；当前只读源码，没有执行写入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 769 | — | — | 11344 |
| .js | source | 2 | 2002 | 1561 | 320 | — |
| .mjs | test | 5 | 984 | 786 | 131 | — |
| .mjs | source | 5 | 1077 | 838 | 169 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AloneFu/dsh-calendar-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AloneFu/dsh-calendar-plugin/issues?q=is%3Aissue+created%3A2026-09-23T07%3A58%3A08.707Z..2026-10-23T07%3A58%3A08.707Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AloneFu/dsh-calendar-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T07%3A58%3A08.707Z..2026-10-23T07%3A58%3A08.707Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Obsidian日记如何解析与受控写回，文件并发承诺在哪里成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Obsidian内联日历相对直接打开笔记改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对象是已有Markdown日记/Obsidian任务习惯、又在DSH中工作的个人用户。交付是日记日期、任务与时间块能正确展示，勾选或编辑后原文件与元数据保持可接受；它不是远程日历同步服务，也没有在本轮材料中证明系统通知能力。作者将单文件日历HTML嵌入DSH侧栏，读取Day Planner/Calendar设置以减少两边显示不一致，主要业务增量是把查看与局部更新放在对话旁，避免维护另一套任务数据库。相对直接开Obsidian，收益是交接便利而非新增任务语义或确认节时；是否值得多一套解析器，取决于实际格式兼容和写回可靠性。作者“30秒首次使用”不是独立时间测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-13](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/README.md#L1-L13)

作者明确Markdown单一真源与内联使用场景。

<details>
<summary>查看原文（13行）</summary>

```text
# dsh-calendar · 把 Obsidian 内联进 DSH

[![CI](https://github.com/AloneFu/dsh-calendar-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/AloneFu/dsh-calendar-plugin/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

在 DeepSeek Harness 的**右侧栏**里打开你的 Obsidian 日记：月历、当天时间轴（Day Planner 风格）、
待办列表与日记正文，勾选完成 / 改内容 / 改时间都会**写回你的 Markdown 原文件**。

- 零运行时依赖：host 半边只用 Node 内建模块，client 半边只用平台自带的 React
- 单文件真源：日历页是一个零依赖 HTML（`standalone/calendar.html`），面板只是把它内嵌进来
- 只读扫描 + 受控写回：默认只在你自己指定的文件夹里活动，写回带乐观并发与审计

---

```

</details>

**依据 2 · 源码核查**：[lib/index.js:144-179](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L144-L179)

任务行保留raw和日期/时间/元数据，支持显示及原行更新。

<details>
<summary>查看原文（36行）</summary>

```text
function parseTaskLine(line, file, lineNumber) {
  const m = TASK_LINE.exec(line)
  if (!m) return null
  const raw = m[2] || ''
  const state = m[1] === ' ' ? 'todo' : m[1] === '-' ? 'cancelled' : 'done'
  // 行首时间头（Day Planner 语法）从正文里摘出来单独存，改写时才能原样保留
  const time = parseTimePrefix(raw)
  const body = time ? raw.slice(time.length) : raw
  const task = {
    file,
    line: lineNumber,
    raw: line,                       // 原始行：写回时的乐观并发凭据（expect）
    state,
    text: cleanText(body),
    timeText: time ? time.text : null,
    startTime: time ? minutesToClock(time.start) : null,
    endTime: time && time.end !== null ? minutesToClock(time.end) : null,
    startMinutes: time ? time.start : null,
    endMinutes: time && time.end !== null ? time.end : null,
    durationMinutes: time && time.end !== null ? Math.max(0, time.end - time.start) : null,
    due: readDateField(raw, '📅'),
    scheduled: readDateField(raw, '⏳'),
    start: readDateField(raw, '🛫'),
    created: readDateField(raw, '➕'),
    done: readDateField(raw, '✅'),
    cancelled: readDateField(raw, '❌'),
    priority: null,
    recurrence: readTextField(raw, RECURRENCE),
    tags: raw.match(TAG) || [],
  }
  for (const [level, emoji] of PRIORITY_FIELDS) {
    if (raw.includes(emoji)) { task.priority = level; break }
  }
  task.date = task.due || task.scheduled || task.start || null
  task.dateSource = task.date === null ? null : (task.due ? 'due' : task.scheduled ? 'scheduled' : 'start')
  return task
```

</details>

#### 缺口

- 真实vault格式覆盖和切换时间未独立对照
  **影响**：不能量化比直接使用Obsidian更有效
  **进一步探讨**：以用户原vault副本比较同批查看/勾选/改时间任务及文件差异

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 任务如何从Markdown解析并受控写回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

解析从复选框任务行抽取时间、日期、优先级和标签，并保留raw原行及行号；Markdown扫描会跳过围栏代码块，日记文件中的无日期任务回落到文件日期。缓存按root保存短期结果，扫描返回truncated标记，不能把截断列表当全部任务。现有任务更新先realpath确认目标在root内且为Markdown，再串行读取、计算单行转换、写同目录临时文件并rename，随后回读目标行验证、清缓存、写审计。这种单文件真源避免复制同步，是可复用的集成方式；但原子rename解决半文件写入，不能独立证明外部并发不丢更新。审计写失败被吞掉，不应将日志说成必然完整的审计账本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:144-197](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L144-L197)

保留原行并跳过围栏任务，解析有明确语法范围。

<details>
<summary>查看原文（54行）</summary>

````text
function parseTaskLine(line, file, lineNumber) {
  const m = TASK_LINE.exec(line)
  if (!m) return null
  const raw = m[2] || ''
  const state = m[1] === ' ' ? 'todo' : m[1] === '-' ? 'cancelled' : 'done'
  // 行首时间头（Day Planner 语法）从正文里摘出来单独存，改写时才能原样保留
  const time = parseTimePrefix(raw)
  const body = time ? raw.slice(time.length) : raw
  const task = {
    file,
    line: lineNumber,
    raw: line,                       // 原始行：写回时的乐观并发凭据（expect）
    state,
    text: cleanText(body),
    timeText: time ? time.text : null,
    startTime: time ? minutesToClock(time.start) : null,
    endTime: time && time.end !== null ? minutesToClock(time.end) : null,
    startMinutes: time ? time.start : null,
    endMinutes: time && time.end !== null ? time.end : null,
    durationMinutes: time && time.end !== null ? Math.max(0, time.end - time.start) : null,
    due: readDateField(raw, '📅'),
    scheduled: readDateField(raw, '⏳'),
    start: readDateField(raw, '🛫'),
    created: readDateField(raw, '➕'),
    done: readDateField(raw, '✅'),
    cancelled: readDateField(raw, '❌'),
    priority: null,
    recurrence: readTextField(raw, RECURRENCE),
    tags: raw.match(TAG) || [],
  }
  for (const [level, emoji] of PRIORITY_FIELDS) {
    if (raw.includes(emoji)) { task.priority = level; break }
  }
  task.date = task.due || task.scheduled || task.start || null
  task.dateSource = task.date === null ? null : (task.due ? 'due' : task.scheduled ? 'scheduled' : 'start')
  return task
}

/** 逐行解析一个 Markdown 文件；跳过围栏代码块里的伪任务行。 */
function parseTasksInMarkdown(source, file) {
  const tasks = []
  let fence = null
  const lines = String(source).split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fenceMatch = /^\s*(```|~~~)/.exec(line)
    if (fenceMatch) {
      fence = fence === null ? fenceMatch[1] : null
      continue
    }
    if (fence !== null) continue
    const task = parseTaskLine(line, file, i + 1)
    if (task) tasks.push(task)
  }
````

</details>

**依据 2 · 源码核查**：[lib/index.js:578-611](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L578-L611)

无日期日记任务回落及截断返回。

<details>
<summary>查看原文（34行）</summary>

```text
    // 日记（文件名带日期）里的待办没有显式日期时，算作那一天 —— 这是日记工作流的默认预期：
    // 在 2026-09-16.md 里写 `- [ ] 睡觉`，它就该出现在 9/16 那天，而不是"未排期"。
    const noteDate = dateKeyFromBasename(basename(entry.full, '.md'))
    const parsed = parseTasksInMarkdown(source, rel)
    for (const task of parsed) {
      if (!task.date && noteDate) {
        task.date = noteDate
        task.dateSource = 'note'
      }
    }
    for (const task of parsed) {
      if (tasks.length >= MAX_TASKS) { clipped = true; break }
      tasks.push(task)
    }
    if (noteDate && !notes[noteDate] && entry.size <= MAX_NOTE_BYTES) {
      let mtime = null
      try { mtime = (await stat(entry.full)).mtime.toISOString() } catch { /* 忽略 */ }
      notes[noteDate] = {
        date: noteDate,
        file: rel,
        title: basename(entry.full),
        bytes: entry.size,
        words: countWords(source),
        mtime,
        excerpt: noteExcerpt(source, EXCERPT_CHARS),
        taskCount: parsed.length,
      }
    }
  }

  const { buckets, undated } = groupByDate(tasks)
  return {
    root,
    scanned: { files: files.length, bytes, truncated: clipped },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:647-691](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L647-L691)

进程内队列、真实路径、原子替换和审计失败语义。

<details>
<summary>查看原文（45行）</summary>

```text
/** 每个文件一条写队列：同一文件的写串行，避免并发读改写互相覆盖。 */
const writeChains = new Map()

function withFileLock(file, task) {
  const previous = writeChains.get(file) || Promise.resolve()
  const run = previous.then(task, task)
  writeChains.set(file, run.then(() => undefined, () => undefined))
  return run
}

/** 目标必须真实落在 root 之内、且是 .md 文件（挡 ../ 与符号链接逃逸）。 */
async function resolveInsideRoot(root, relative) {
  const rootReal = await realpath(root).catch(() => null)
  if (!rootReal) return { error: 'root-missing' }
  const candidate = resolve(rootReal, String(relative || ''))
  let real
  try {
    real = await realpath(candidate)
  } catch {
    return { error: 'file-missing' }
  }
  const inside = real === rootReal || real.startsWith(rootReal + sep)
  if (!inside) return { error: 'outside-root' }
  if (!/\.md$/i.test(real)) return { error: 'not-markdown' }
  try {
    if (!(await stat(real)).isFile()) return { error: 'not-a-file' }
  } catch {
    return { error: 'file-missing' }
  }
  return { file: real }
}

/** 原子写：同目录临时文件 + rename 覆盖（Windows 上 rename 会替换目标）。 */
async function writeTextAtomic(target, text) {
  const tmp = join(dirname(target), `.dsh-calendar-${process.pid}-${Date.now().toString(36)}.tmp`)
  await writeFile(tmp, text, 'utf8')
  await rename(tmp, target)
}

/** 追加一条审计记录（失败不影响主流程）。 */
async function audit(record) {
  try {
    await mkdir(dirname(auditPath()), { recursive: true })
    await writeFile(auditPath(), JSON.stringify(record) + '\n', { encoding: 'utf8', flag: 'a' })
  } catch { /* 审计失败不阻断 */ }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:703-756](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L703-L756)

单行转换、回读验证与缓存失效流程。

<details>
<summary>查看原文（54行）</summary>

```text
async function mutateTaskLine(root, body, transform) {
  const target = await resolveInsideRoot(root, body.file)
  if (target.error) return target

  return withFileLock(target.file, async () => {
    let raw
    try {
      raw = await readFile(target.file)
    } catch {
      return { error: 'file-missing' }
    }
    const hasBom = raw.length >= 3 && raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf
    const decoded = raw.toString('utf8')
    const content = hasBom ? decoded.slice(1) : decoded
    const eol = content.includes('\r\n') ? '\r\n' : '\n'
    const lines = content.split(/\r?\n/)

    const index = Number(body.line) - 1
    if (!Number.isInteger(index) || index < 0 || index >= lines.length) return { error: 'line-out-of-range' }
    const before = lines[index]
    if (typeof body.expect === 'string' && body.expect !== before) {
      return { error: 'stale', current: before }
    }
    if (!TASK_LINE.test(before)) return { error: 'not-a-task' }

    const outcome = transform(before, {
      date: typeof body.date === 'string' && isIsoDate(body.date) ? body.date : new Date().toISOString().slice(0, 10),
      line: index + 1,
    })
    if (!outcome || outcome.error) return outcome || { error: 'bad-request' }
    const after = outcome.after
    if (typeof after !== 'string') return { error: 'bad-request' }
    if (after === before) {
      return { ok: true, changed: false, line: index + 1, before, after: before, action: outcome.action }
    }

    lines[index] = after
    try {
      await writeTextAtomic(target.file, (hasBom ? '\uFEFF' : '') + lines.join(eol))
    } catch (error) {
      return { error: 'write-failed', message: String((error && error.message) || error) }
    }

    // 写后回读校验：不一致就是没写成功（例如被编辑器锁住/回滚）
    let verify
    try {
      verify = (await readFile(target.file, 'utf8')).replace(/^\uFEFF/, '').split(/\r?\n/)[index]
    } catch {
      verify = undefined
    }
    if (verify !== after) return { error: 'verify-failed', expected: after, actual: verify }

    scanCache.delete(root)
    await audit({ at: new Date().toISOString(), action: outcome.action, file: body.file, line: index + 1, before, after })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 乐观并发承诺在缺expect或外部编辑竞争时成立吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

源码只在body.expect为字符串且不同于当前行时返回stale；缺少expect或类型不符不会触发比较。因此作者“每次写都带客户端原文”的说明是正常客户端路径约定，不是服务端强制所有请求满足的保证。withFileLock只串行本进程写，Obsidian可在插件读取之后、rename之前改变文件；即使目标行匹配，其他行更新仍可能被旧整文件覆盖。当前检查不能推出跨进程无丢失更新，这一点最影响“单文件真源”的采用价值。写请求还要专用header并校验存在的Origin为本机，需配置窄root；这些控制来源和路径，不解决并发。首次需选vault/日记根并核对语法，持续轮询与人工复核有成本，失败需刷新后看磁盘差异而非盲重试。金额、CPU负载、复核和恢复时间均未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:720-741](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L720-L741)

expect条件可选且转换后按整文件写回，是并发承诺的明确边界。

<details>
<summary>查看原文（22行）</summary>

```text
    const index = Number(body.line) - 1
    if (!Number.isInteger(index) || index < 0 || index >= lines.length) return { error: 'line-out-of-range' }
    const before = lines[index]
    if (typeof body.expect === 'string' && body.expect !== before) {
      return { error: 'stale', current: before }
    }
    if (!TASK_LINE.test(before)) return { error: 'not-a-task' }

    const outcome = transform(before, {
      date: typeof body.date === 'string' && isIsoDate(body.date) ? body.date : new Date().toISOString().slice(0, 10),
      line: index + 1,
    })
    if (!outcome || outcome.error) return outcome || { error: 'bad-request' }
    const after = outcome.after
    if (typeof after !== 'string') return { error: 'bad-request' }
    if (after === before) {
      return { ok: true, changed: false, line: index + 1, before, after: before, action: outcome.action }
    }

    lines[index] = after
    try {
      await writeTextAtomic(target.file, (hasBom ? '\uFEFF' : '') + lines.join(eol))
```

</details>

**依据 2 · 源码核查**：[lib/index.js:647-654](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L647-L654)

队列在进程内Map中，不能锁外部编辑器。

```text
/** 每个文件一条写队列：同一文件的写串行，避免并发读改写互相覆盖。 */
const writeChains = new Map()

function withFileLock(file, task) {
  const previous = writeChains.get(file) || Promise.resolve()
  const run = previous.then(task, task)
  writeChains.set(file, run.then(() => undefined, () => undefined))
  return run
```

**依据 3 · 源码核查**：[lib/index.js:1139-1148](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L1139-L1148)

写header和本机Origin检查只解决请求来源的一部分。

<details>
<summary>查看原文（10行）</summary>

```text
  return raw === '' ? {} : JSON.parse(raw)
}

/** 写操作闸门：要求自定义头 + Origin 是本机，挡掉跨站表单式误触。 */
function writeGuard(req) {
  if (req.headers['x-dsh-calendar'] !== 'write') return 'missing-write-header'
  const origin = req.headers.origin
  if (origin && !/^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(origin)) return 'bad-origin'
  return null
}
```

</details>

**依据 4 · 作者声明**：[README.md:166-178](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/README.md#L166-L178)

作者声称每次原文比较和原子写，需与实际条件区分。

<details>
<summary>查看原文（13行）</summary>

```text
| 键 | 作用 |
|---|---|
| `roots` | 数据源，**第一个是主数据源**；最多保留 3 个（新加的排最前） |
| `allowAnyRoot` | 是否允许 `?root=` 传任意绝对路径（默认 `false`：只认 `roots` 与 DSH 已注册工作区） |
| `autoOpen` | 进入会话时自动展开日历 tab（默认 `true`；手动关掉后同一会话不会弹回来） |
| `write.enabled` | 关掉后完全只读 |
| `write.appendDoneDate` | 标完成时是否追加 `✅ YYYY-MM-DD`（关掉则只翻 `[ ]`↔`[x]`） |
| `create` | 是否允许在 DSH 里新建日记 / 待办 |
| `dayPlanner.*` | 与 Obsidian 的 Day Planner 对齐（标题、起始小时、默认时长…） |
| `calendar.wordsPerDot` | 与 Obsidian 的 Calendar 对齐（每多少字一个点） |

## 8. 排错

```

</details>

#### 缺口

- 外部编辑竞争窗口的具体后果未执行复现
  **影响**：不能声称已发生用户数据丢失，也不能给出强并发安全保证
  **进一步探讨**：在vault副本受控交错读写，核对目标及非目标行是否丢失

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样收紧写入契约并界定可控试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是服务端强制expect并加入整文件版本前置条件，可以更早拒绝过期更新，减少正常客户端之外的盲写；但比较后再rename仍存在竞态，若要覆盖外部编辑器，需要所有写入者遵循锁协议，或在提交时采取具备外部协调的版本化写入。不能把新增mtime检查说成完全解决问题。最小验证在vault副本交错两个插件请求和一次外部编辑，覆盖同一行、其他行、缺expect、CRLF/BOM、符号链接；以未授权覆盖次数、冲突可见性和人工恢复分钟为标准。当前建议trial仅限备份的小vault或先只读使用，核对正常UI每次请求带原文；发生stale时刷新后人工确认，遇到非目标行丢失即停止写回。无备份或必须与其他编辑器高频并发写入的人，应先观察。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:720-741](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L720-L741)

可选expect为服务端契约改进提供直接接点。

<details>
<summary>查看原文（22行）</summary>

```text
    const index = Number(body.line) - 1
    if (!Number.isInteger(index) || index < 0 || index >= lines.length) return { error: 'line-out-of-range' }
    const before = lines[index]
    if (typeof body.expect === 'string' && body.expect !== before) {
      return { error: 'stale', current: before }
    }
    if (!TASK_LINE.test(before)) return { error: 'not-a-task' }

    const outcome = transform(before, {
      date: typeof body.date === 'string' && isIsoDate(body.date) ? body.date : new Date().toISOString().slice(0, 10),
      line: index + 1,
    })
    if (!outcome || outcome.error) return outcome || { error: 'bad-request' }
    const after = outcome.after
    if (typeof after !== 'string') return { error: 'bad-request' }
    if (after === before) {
      return { ok: true, changed: false, line: index + 1, before, after: before, action: outcome.action }
    }

    lines[index] = after
    try {
      await writeTextAtomic(target.file, (hasBom ? '\uFEFF' : '') + lines.join(eol))
```

</details>

**依据 2 · 源码核查**：[lib/index.js:679-691](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js#L679-L691)

rename和非阻断审计说明仍需外部并发协调。

<details>
<summary>查看原文（13行）</summary>

```text
/** 原子写：同目录临时文件 + rename 覆盖（Windows 上 rename 会替换目标）。 */
async function writeTextAtomic(target, text) {
  const tmp = join(dirname(target), `.dsh-calendar-${process.pid}-${Date.now().toString(36)}.tmp`)
  await writeFile(tmp, text, 'utf8')
  await rename(tmp, target)
}

/** 追加一条审计记录（失败不影响主流程）。 */
async function audit(record) {
  try {
    await mkdir(dirname(auditPath()), { recursive: true })
    await writeFile(auditPath(), JSON.stringify(record) + '\n', { encoding: 'utf8', flag: 'a' })
  } catch { /* 审计失败不阻断 */ }
```

</details>

#### 缺口

- 更严格契约和外部编辑协调未实现
  **影响**：假设不等同现有文件安全保证
  **进一步探讨**：在受控竞写矩阵中检验零静默覆盖并报告人工恢复量

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
