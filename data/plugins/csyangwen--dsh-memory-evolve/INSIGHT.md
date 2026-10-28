# dsh-memory-evolve

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e6f6b84](https://github.com/csyangwen/dsh-memory-evolve/tree/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b)

<!-- BEGIN META -->
[![GitHub ★ 451](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=451&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/csyangwen/dsh-memory-evolve)
<!-- END META -->

> **功能**：为 DSH 提供分层记忆、确认队列、待办与可选会话协作能力的组合插件

> **亮点**：[Q02](#research-q02) 将关键记忆的候选、确认与注入连成可读本地文件流程，并保留项目和分支标签。

> **主要限制**：[Q03](#research-q03) 用户确认主要约束key add，其他轨有直接写入；分支无法解析时项目key全部注入，不构成严格分支隔离。

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
  - [Q01 · 谁在什么重复任务中使用它？](#detail-section-11)
  - [Q02 · 关键记忆如何从工具进入快照？](#detail-section-12)
  - [Q03 · 确认和分支范围是否适用于所有记忆与所有失败？](#detail-section-13)
  - [Q04 · 如何试用并证伪严格分支控制的改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向多项目开发者，把长期事实、项目关键记忆与日志分轨，在DSH会话中按项目取回上下文。

AGENTS.md与手工项目日志；动态确认与上下文接线是增量，不是模型训练或所有协作能力已验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 关键记忆确认 | 控制key候选生效 | 其它轨有直接写路径 |
| 项目/分支快照 | 按上下文取回事实 | 分支未知回退全注入 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH与bundle profile | 必需 | 工具/快照注册 | 避免重复insert，异常禁用 |
| 可读写数据目录与备份 | 必需 | 保存与恢复记忆 | 先副本库试用 |
| 项目cwd和可解析Git分支 | 分支筛选必需 | scope匹配 | 当前未知会回退全注入，需人工限制 |
| Git远端和凭据 | 同步可选 | 跨设备共享 | 保持本地，不假定已同步 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户独立profile只启记忆并备份 | 工具与快照可用 |
| 2 | Agent提key建议，用户确认 | 队列/目标文件/快照一致 |
| 3 | 用户切分支并归档/禁用 | 不误注入；异常退人工日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地文件和备份 | 配置profile/项目路径 | 耗时未测 |
| 持续 | 模型注入token，可选同步 | 审阅队列与纠错 | 总费用/节时未测 |
| 失败恢复 | 备份/重试/同步资源 | 核队列与正式记忆一致性 | 跨文件恢复未知 |
| 退出 | 保留原文数据 | 禁用快照并导出文件 | 卸载与删除数据分开核实 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用户控制关键记忆 | key确认队列接线 | 中断恢复及其他轨误用 |
| 分支适用性 | 解析成功时按scope筛选 | 未知分支回退的任务影响 |

> **思考**：[Q03](#research-q03) 用户确认主要约束key add，其他轨有直接写入；分支无法解析时项目key全部注入，不构成严格分支隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将关键记忆的候选、确认与注入连成可读本地文件流程，并保留项目和分支标签。

[Q02](#research-q02) 队列与锁内重读可借鉴；[Q03](#research-q03)应明确单文件原子性不代表确认流程整体原子。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 用户确认主要约束key add，其他轨有直接写入；分支无法解析时项目key全部注入，不构成严格分支隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在独立profile/备份库验证关键记忆确认和分支切换；若未知分支造成错引用或队列状态不明，停用自动快照并回AGENTS.md/人工日志。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

本地队列、保存和快照接线有源码支持；跨文件恢复、同步和严格分支控制效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/review.js、lib/store.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查记忆工具、批准、store写盘与snapshot分支；未全面审计全部可选模块、同步远端、外部CLI与自演化主张。
- 下一步：在独立库运行双分支/分支未知/批准中断任务，对比当前与严格scope策略，记录错引用、漏用、人工纠错和总耗时。

**分析版本**

- **仓库**：[csyangwen/dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve)
- **版本号**：0.1.0（[固定提交 e6f6b84](https://github.com/csyangwen/dsh-memory-evolve/tree/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导分支未知时暂停scope记忆自动注入并提示状态的未验证改进；同时测错引用和漏用，若漏用损失更大则推翻。

在独立库运行双分支/分支未知/批准中断任务，对比当前与严格scope策略，记录错引用、漏用、人工纠错和总耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 2880 | — | — | 79424 |
| .js | source | 65 | 50741 | 38115 | 13109 | — |
| .mjs | source | 3 | 558 | 411 | 110 | — |
| .ts | source | 17 | 6215 | 3730 | 2220 | — |
| .tsx | source | 27 | 15673 | 13208 | 1837 | — |
| .js | test | 72 | 23908 | 19174 | 3381 | — |

</details>

**活跃度**

[![Issue 未关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/csyangwen/dsh-memory-evolve/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=737b86&logo=github)](https://github.com/csyangwen/dsh-memory-evolve/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/csyangwen/dsh-memory-evolve/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：记忆确认队列和分支过滤是否足以让用户控制自动上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么重复任务中使用它？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

真实类型plugin，bundle随profile挂载。面向多项目开发者，把全局偏好、项目关键事实和日志分轨，换会话时减少重复说明；待办、同步和外部Agent调度是可选额外模块，本轮不因模块多就推定形成完整协作流水线。合格结果是正确项目/分支读取到用户确认的关键事实，修改与归档可解释。基线是项目AGENTS.md和人工维护日志，增量是工具、确认队列与动态快照接线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-40](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/README.md#L13-L40)

bundle加载及重复insert的启动风险

<details>
<summary>查看原文（28行）</summary>

````text
插件包内自带 `cordis.patch.yml`（`dsh.bundle.patch` 声明），`dsh plugin add` 安装后 **host 端自动注册，无需任何手动配置**。以 web profile 为例，两步装好：

```sh
# 1. 安装到 profile（本地目录用 link:，也可用 git/registry 包地址）
dsh plugin --profile web add github:csyangwen/dsh-memory-evolve

# 2. 重启 dsh web 即生效
```

> ⚠️ **不要再往 `~/.dsh/profiles/web/cordis.patch.yml` 手动 insert 本插件**：bundle patch 已自动注册，重复 insert 同 id 会让加载器报 duplicate loader entry id 无法启动。完整说明见 [详细功能说明](README-详细说明.md)「标准安装」章节。

**修改默认配置**（如开启回合内记忆审查）：在 profile 的 `cordis.patch.yml` 用 id 覆盖（顶层写法，非 insert）：

```yaml
- id: dsh-memory-evolve
  config:
    reviewEnabled: true      # 开启回合内记忆审查（默认关）
    reviewInterval: 10       # 每 10 个用户回合审查一次
```

**插件异常导致 DSH 无法启动时，临时禁用**（等修复后取消）：同样在 profile 的 `cordis.patch.yml` 加一行即可，无需卸载：

```yaml
- id: dsh-memory-evolve
  disabled: true
```

**从旧版本升级**：若你此前按旧文档手动 insert 过本插件，请删除 profile patch 里的 insert 行（否则与 bundle 自动注册重复）。
````

</details>

**依据 2 · 作者声明**：[README.md:56-75](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/README.md#L56-L75)

五轨记忆和用户确认场景

<details>
<summary>查看原文（20行）</summary>

```text
## 场景一：让 AI 真正记住你（长期记忆）

**适合谁**：所有人。这是插件的核心，也是其他一切功能的地基。

AI 的对话是「一次性」的：换项目、隔几天、开新会话，它就忘了你是谁。插件的五轨记忆让 AI 拥有**跨会话的长期工作记忆**：

- **用户档案**：你的偏好、公司、沟通习惯——AI 每回合都能看到；
- **全局事实**：环境、工具、惯例等长期知识；
- **项目关键记忆**：当前项目的约定、决策、架构、踩坑，自动注入上下文，重要结论可标记**只在某个 git 分支生效**；
- **项目日志 / 每日日志**：每回合自动记录进展，按需读取，历史可追溯。

**怎么用**：

1. 正常和 AI 对话即可——每回合结束时它会自动把进展写进项目日志和今日日志；
2. 发现重要事实时对它说「**记一下：这个项目的部署端口是 8080**」，它会写入项目关键记忆，**你确认后**才生效——AI 不会擅自往记忆里写东西；
3. 过几天、换了个会话，直接问「**查一下记忆，上次我们定下的架构决策是什么**」——它能无缝衔接；
4. 记忆多了之后，让 AI「**把 XX 那条记忆归档**」——归档条目不再注入上下文，随时可转回；
5. **情绪反馈记录**：你对工作结果的评价（如「太好了」「怎么还没改对」）会被 AI 记入当日与项目日志（`【反馈】` 行，含情绪、任务分类、你的原话）——积累后随时可以让 AI「**分析一下最近我对哪些方面不满意**」，判断它在哪类任务上做得好/不好。

**会得到什么**：AI 从一个「每次会话都失忆」的对话机器，变成了解你全盘工作的长期伙伴——隔天继续开发，它直接引用昨天的结论，不用你复述。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 关键记忆如何从工具进入快照？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

memoryTool的key add进入SuggestionQueue，不直接写正式关键记忆；其它轨调用store.add。approveSuggestions在队列锁内按原建议cwd决定写入目标，失败保留建议、成功或重复则移除；store.add持目录锁重读、去重并写临时文件rename。系统上下文注册memory:snapshot，每次渲染读取当前store，按会话cwd定位项目key并按分支scope筛选。因此关键记忆的候选/确认/生效有实际链路，保存机制是本地文件组织而非模型自我训练。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:941-973](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/index.js#L941-L973)

key入队与其它轨直接add

<details>
<summary>查看原文（33行）</summary>

```text
  async function addOne(target, content, feedback, exec, summary) {
    const fbLine = target === 'daily' || target === 'project' ? buildFeedbackLine(feedback) : ''
    let finalContent = String(content ?? '').trim()
    if (fbLine !== '') finalContent = finalContent === '' ? fbLine : `${finalContent}\n${fbLine}`
    if (finalContent === '') return { ok: false, message: mt('msg.emptyContent'), target }
    // 渐进式披露：key 轨支持 summary 参数，拼入 [summary:...] 标签。
    // 清洗（审查修复）：换行会让标签跨行、']' 会让解析正则 [^\]]* 提前
    // 截断（剩余文字漏进正文、stripEntrySummary 失配）——都是 LLM 自由
    // 文本参数常见的字符，必须先去掉再截断。
    if (target === 'key' && summary) {
      const sanitized = String(summary).replace(/[\n\r\t\]]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120)
      if (sanitized !== '') {
        const summaryTag = `[summary:${sanitized}]`
        finalContent = `${summaryTag}\n${finalContent}`
      }
    }
    if (target === 'key') {
      const outcome = enqueueSuggestion(queue, 'key', finalContent, mt('msg.keySuggestReason'), exec?.agent)
      if (outcome.ok) {
        outcome.message = mt('msg.keySuggestionQueued', { queued: outcome.queued })
      }
      // queued 不在输出 schema 内（additionalProperties:false），剥离
      const { queued: _queued, ...rest } = outcome
      return outcomeOnly(rest)
    }
    const addResult = store.add(target, finalContent, exec.agent)
    // 写入看门狗：daily/project 写入成功即重置该会话的连续未写计数
    // （memory/user/key 不算——看门狗盯的是每轮进展日志的欠账；key 走
    // 确认队列、memory/user 是慢变轨，都不承载"本轮做了什么"）。
    if (addResult.ok && (target === 'daily' || target === 'project')) {
      writeGap?.noteWrite?.(exec?.agent)
    }
    return outcomeOnly(addResult)
```

</details>

**依据 2 · 源码核查**：[lib/review.js:421-475](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/review.js#L421-L475)

确认写入、cwd归属及失败保留

<details>
<summary>查看原文（55行）</summary>

```text
export function approveSuggestions(store, todoStore, queue, indices, agent, edits, targets, options = {}) {
  const isTodoEnabled = options.isTodoEnabled ?? (() => true)
  return queue.mutate((entries) => {
    const kept = []
    const lines = []
    entries.forEach((entry, index) => {
      const number = index + 1
      if (!indices.includes(number)) {
        kept.push(entry)
        return
      }
      // 待办建议只能留在待办轨（待办不能变成记忆）；记忆建议才可改分类
      const target = entry.target.startsWith('todo-')
        ? entry.target
        : (targets?.get(number) ?? entry.target)
      const writeAgent = entry.cwd
        ? { session: { header: { cwd: entry.cwd } } }
        : agent
      // An edit that is empty (or whitespace) means "no edit": fall back to the
      // suggested content instead of attempting to write an empty entry.
      const edited = edits?.get(number)?.trim()
      const content = edited ? edited : entry.content
      const isTodo = target.startsWith('todo-')
      if (isTodo && !isTodoEnabled()) {
        lines.push(`✗ #${number} [${target}] TODO_DISABLED：待办功能未启用`)
        kept.push(entry)
        return
      }
      let outcome
      if (isTodo) {
        outcome = todoStore.addTodo(target.slice(5), content, {}, entry.cwd ?? agent?.session?.header?.cwd)
      } else {
        try {
          // key 轨无 cwd 时 resolveTarget 会抛错——兜住并保留建议
          outcome = store.add(target, content, writeAgent)
        } catch (error) {
          outcome = { ok: false, message: error instanceof Error ? error.message : String(error) }
        }
      }
      if (outcome.duplicate === true || (!outcome.ok && (outcome.message.includes('已存在') || outcome.message.includes('already exists')))) {
        // Duplicate detection is locale-neutral: store.add returns
        // ok:true + duplicate:true for a dup, so the duplicate check must
        // come FIRST; the message-substring fallbacks cover older flows
        // that only carry localized text.
        lines.push(rct('reviewcmd.existsSkip', { n: number, target }))
      } else if (outcome.ok) {
        lines.push(rct(isTodo ? 'reviewcmd.writtenTodo' : 'reviewcmd.writtenMemory', { n: number, target }))
      } else {
        lines.push(rct('reviewcmd.failed', { n: number, target, detail: outcome.message }))
        kept.push(entry)
      }
    })
    entries.length = 0
    entries.push(...kept)
    return { lines, remaining: kept.length }
```

</details>

**依据 3 · 源码核查**：[lib/store.js:850-883](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/store.js#L850-L883)

锁内重读/去重/写入

<details>
<summary>查看原文（34行）</summary>

```text
    const stamped = this.stampEntry(target, text, agent)
    return withLock(loc.dir, () => {
      const reload = this.reloadForAppend(target, agent)
      if (reload.kind === 'read-failed') {
        return { ok: false, message: st('store.fileUnreadableWrite'), target }
      }
      const entries = reload.entries
      // entryIdMode=on（启用了 Git 同步的项目）：新条目前置随机身份证
      // （施工图 §4.2；未启用项目不处理，行为零变化）。一期同步范围 = 项目
      // 轨（key + project 日志），全局轨（memory/user/daily）二期才共享，
      // 一期不生成 ID —— 磁盘格式保持现状。PROVENANCE 存在 = 该项目已完成
      // bootstrap（未初始化项目即使全局开关打开也不生成 ID）。
      const syncedTrack = this.entryIdMode === 'on' && (target === 'key' || target === 'project')
        && isProjectSyncEnabled(loc.dir)
      const withId = syncedTrack && !/^\[id:[0-9a-f]{8}\]\s*/.test(stamped)
        ? `[id:${genEntryId()}] ${stamped}`
        : stamped
      // 去重比较：on 模式剥离身份证后比较（身份证每次随机，直接 includes
      // 会永远不命中，导致重复内容被反复添加）；off 模式维持原行为。
      const dup = syncedTrack
        ? entries.some((entry) => stripEntryId(entry) === stripEntryId(withId))
        : entries.includes(stamped)
      if (dup) {
        return {
          ok: true, duplicate: true, message: st('store.duplicate'), target,
          entries: [...entries], chars: this.charsOf(target, agent),
        }
      }
      const next = [...entries, withId]
      this.write(target, next, agent)
      return {
        ok: true, message: st('store.added', { target, before: entries.length, after: next.length }), target,
        entries: [...next], chars: next.join(ENTRY_DELIMITER).length,
      }
```

</details>

**依据 4 · 源码核查**：[lib/store.js:812-817](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/store.js#L812-L817)

临时文件rename

```text
  /** Atomically write entries to one target's file. */
  write(target, entries, agent) {
    const path = this.pathOf(target, agent)
    const tmp = `${path}.tmp.${process.pid}`
    writeFileSync(tmp, serializeEntries(entries))
    renameSync(tmp, path)
```

**依据 5 · 源码核查**：[lib/index.js:1689-1720](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/index.js#L1689-L1720)

快照与工具真实注册

<details>
<summary>查看原文（32行）</summary>

```text
  // 1. Memory snapshot injection (frozen-ish: live reads, change-detected
  //    materialization keeps the cache prefix stable).
  if (config.injectMemory) {
    ctx.effect(() => {
      try {
        return ctx.systemPrompt.context({
          name: 'memory:snapshot',
          order: config.snapshotOrder,
          text: (context) => {
            const runtime = getRuntime()
            // 记忆同步无快照状态行（2026-08-13 用户拍板：AI 不参与同步，见
            // renderSnapshot 内注释）
            return renderSnapshot(runtime, store, context.agent, counter, ctx.sessionTitle, writeGap)
          },
        })
      } catch (error) {
        // 幂等保护（issue #23）：DSH 0.1.x 的 loader 曾把插件在无 scope 标签的
        // ctx 上装配两次，system-prompt 的 global 层同名重复插入会抛
        // "already registered"（该层本就该只有一份注册，DSH 报错文案也提示应走
        // per-agent 注册）。命中重复时跳过并告警，避免整个 apply 失败连带
        // 快照注入失效 + /memory-evolve/api/* 404；其余异常照抛。
        if (error instanceof Error && error.message.includes('already registered')) {
          console.warn('[memory-evolve] memory:snapshot 已注册，跳过重复注册（issue #23 幂等保护）')
          return () => {}
        }
        throw error
      }
    }, 'dsh-memory-evolve: memory snapshot')
  }

  // 2. The memory tool (always registered; subagent writes are gated).
  ctx.effect(() => ctx.tools.register(memoryTool(ctx, config, store, queue, getRuntime, archive, writeGap)), 'dsh-memory-evolve: memory tool')
```

</details>

**依据 6 · 源码核查**：[lib/index.js:588-604](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/index.js#L588-L604)

项目/分支筛选

<details>
<summary>查看原文（17行）</summary>

```text
  // Project KEY facts are injected for the agent's own project only (its
  // session cwd). Same live-read/change-detected mechanism as the global
  // tracks: a KEY write (tool or web tab) surfaces in the next step's tail.
  // When the project is a git worktree and keyBranchFilter is on, the
  // current branch is resolved live and ONLY entries whose scope covers it
  // are injected (untagged entries = "全部" always qualify). Outside git,
  // or when the branch cannot be resolved, every entry is injected — the
  // conservative choice that never hides memory. The branch name itself is
  // injected alongside, so the model knows which branch it is on.
  const keyAgent = agent?.session?.header?.cwd ? agent : undefined
  const branch = keyAgent && config.keyBranchFilter !== false ? gitBranch(keyAgent.session.header.cwd) : undefined
  let keyEntries = keyAgent ? store.entriesOf('key', keyAgent) : []
  if (branch !== undefined) {
    keyEntries = keyEntries.filter((entry) => {
      const scope = parseEntryBranches(entry)
      return scope === null || scope.includes(branch)
    })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 确认和分支范围是否适用于所有记忆与所有失败？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能把“你确认后才生效”扩大到全部轨道：key add走确认，其它target在该实现直接store.add，日志可自动写；用户必须知道各轨写入权限。分支过滤只有gitBranch成功解析时运行，无法解析或不在Git时所有项目key都注入，是优先不隐藏记忆的取舍，不能视为严格分支隔离。存储锁和rename支持局部并发与文件完整性，但审批队列到记忆文件不是本轮已验证的跨文件事务；进程中断后的重复/遗漏及同步远端仍需独立核查。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:957-973](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/index.js#L957-L973)

确认范围仅key分支

<details>
<summary>查看原文（17行）</summary>

```text
    if (target === 'key') {
      const outcome = enqueueSuggestion(queue, 'key', finalContent, mt('msg.keySuggestReason'), exec?.agent)
      if (outcome.ok) {
        outcome.message = mt('msg.keySuggestionQueued', { queued: outcome.queued })
      }
      // queued 不在输出 schema 内（additionalProperties:false），剥离
      const { queued: _queued, ...rest } = outcome
      return outcomeOnly(rest)
    }
    const addResult = store.add(target, finalContent, exec.agent)
    // 写入看门狗：daily/project 写入成功即重置该会话的连续未写计数
    // （memory/user/key 不算——看门狗盯的是每轮进展日志的欠账；key 走
    // 确认队列、memory/user 是慢变轨，都不承载"本轮做了什么"）。
    if (addResult.ok && (target === 'daily' || target === 'project')) {
      writeGap?.noteWrite?.(exec?.agent)
    }
    return outcomeOnly(addResult)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:588-604](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/index.js#L588-L604)

分支未知时无过滤

<details>
<summary>查看原文（17行）</summary>

```text
  // Project KEY facts are injected for the agent's own project only (its
  // session cwd). Same live-read/change-detected mechanism as the global
  // tracks: a KEY write (tool or web tab) surfaces in the next step's tail.
  // When the project is a git worktree and keyBranchFilter is on, the
  // current branch is resolved live and ONLY entries whose scope covers it
  // are injected (untagged entries = "全部" always qualify). Outside git,
  // or when the branch cannot be resolved, every entry is injected — the
  // conservative choice that never hides memory. The branch name itself is
  // injected alongside, so the model knows which branch it is on.
  const keyAgent = agent?.session?.header?.cwd ? agent : undefined
  const branch = keyAgent && config.keyBranchFilter !== false ? gitBranch(keyAgent.session.header.cwd) : undefined
  let keyEntries = keyAgent ? store.entriesOf('key', keyAgent) : []
  if (branch !== undefined) {
    keyEntries = keyEntries.filter((entry) => {
      const scope = parseEntryBranches(entry)
      return scope === null || scope.includes(branch)
    })
```

</details>

**依据 3 · 源码核查**：[lib/review.js:449-475](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/review.js#L449-L475)

写入后修改队列的先后顺序

<details>
<summary>查看原文（27行）</summary>

```text
      let outcome
      if (isTodo) {
        outcome = todoStore.addTodo(target.slice(5), content, {}, entry.cwd ?? agent?.session?.header?.cwd)
      } else {
        try {
          // key 轨无 cwd 时 resolveTarget 会抛错——兜住并保留建议
          outcome = store.add(target, content, writeAgent)
        } catch (error) {
          outcome = { ok: false, message: error instanceof Error ? error.message : String(error) }
        }
      }
      if (outcome.duplicate === true || (!outcome.ok && (outcome.message.includes('已存在') || outcome.message.includes('already exists')))) {
        // Duplicate detection is locale-neutral: store.add returns
        // ok:true + duplicate:true for a dup, so the duplicate check must
        // come FIRST; the message-substring fallbacks cover older flows
        // that only carry localized text.
        lines.push(rct('reviewcmd.existsSkip', { n: number, target }))
      } else if (outcome.ok) {
        lines.push(rct(isTodo ? 'reviewcmd.writtenTodo' : 'reviewcmd.writtenMemory', { n: number, target }))
      } else {
        lines.push(rct('reviewcmd.failed', { n: number, target, detail: outcome.message }))
        kept.push(entry)
      }
    })
    entries.length = 0
    entries.push(...kept)
    return { lines, remaining: kept.length }
```

</details>

**依据 4 · 源码核查**：[lib/store.js:1343-1372](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/store.js#L1343-L1372)

队列原子文件与锁范围

<details>
<summary>查看原文（30行）</summary>

```text
  /** Atomically write the full suggestion list. */
  write(entries) {
    mkdirSync(dirname(this.file), { recursive: true })
    const tmp = `${this.file}.tmp.${process.pid}`
    writeFileSync(tmp, entries.map((entry) => JSON.stringify(entry)).join('\n') + (entries.length > 0 ? '\n' : ''))
    renameSync(tmp, this.file)
  }

  /** Append one suggestion under the directory lock. */
  append(entry) {
    return withLock(dirname(this.file), () => {
      const entries = this.read()
      entries.push(entry)
      this.write(entries)
      return { ok: true, queued: entries.length }
    })
  }

  /**
   * Mutate the suggestion list under the directory lock.
   * @param {(entries: object[]) => T} fn - the mutation; return value is passed through.
   * @returns {T} the mutation's return value.
   * @template T
   */
  mutate(fn) {
    return withLock(dirname(this.file), () => {
      const entries = this.read()
      const result = fn(entries)
      this.write(entries)
      return result
```

</details>

#### 缺口

- 审批跨文件中断与同步后分支归属效果未验收
  **影响**：不能保证整个确认/同步流程原子且不误注入
  **进一步探讨**：中断批准流程并令git分支不可读，核对队列、记忆文件和实际上下文

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用并证伪严格分支控制的改进？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

已有跨项目记忆维护需求者先在独立profile与数据备份上只启用记忆主线，确认key入队、批准、分支切换和归档；不要把默认关闭的模块当已生效。首次有profile/路径配置，持续增加注入token、队列审阅和错误纠正，开启Git同步还承担远端与冲突处理；退出前保留文件而非相信“一切效果清理”等于数据销毁。由分支未知回退推导未验证假设：分支未知时不自动注入带scope条目，同时展示待确认状态，可减少错分支上下文。对同项目双分支与分支解析失败做同任务比较，测错误引用、漏用有效事实、人工纠错和总耗时；若漏用损失更大而错引用不降则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-52](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/README.md#L48-L52)

模块开关条件

```text
装上插件后，打开任意会话，你会多出一排能力标签：**记忆 · 技能 · 待办 · 无限画板 · COI 调度 · 会话广播 · 提示词 · 记忆同步 · 模型设置 · 书签 · 会话评审 · Web UI 设置 · Memory Evolve 设置**。AI 侧则多了一批工具：记忆读写、待办、技能管理、本地文件搜索、会话编排、会话广播、外部 AI 派单、提示词注入、模型查询……

一句话概括这些能力：**让 AI 记住你、替你管、替你做、互相配合做。**

> 小提示：插件里很多能力默认关闭（不占 AI 的工具清单），需要时在「Memory Evolve 设置」里打开即可。下面的场景大多是组合玩法——**把相关功能都打开，才能串成完整的流水线**。
```

**依据 2 · 作者声明**：[README.md:79-90](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/README.md#L79-L90)

同步是另行配置并有冲突

<details>
<summary>查看原文（12行）</summary>

```text
## 场景：多台电脑共享项目记忆（记忆同步）

**适合谁**：办公室和家里两台电脑干活、或有同事协作同一个项目的人——不想在每台电脑上把重要结论重新讲一遍。

**怎么用**（详见 [记忆同步](docs/记忆同步.md)）：

1. 「Memory Evolve 设置 → 配置」打开「**记忆同步**」模块开关（这只是让功能可见）；
2. 在项目会话的「**记忆同步**」Tab 打开「**本项目同步**」——点「开始同步」即可（记忆远端默认用你的代码仓库，自动存进专属分支，不污染代码），再点「同步并推送」完成首次推送；**代码公开（如 GitHub 开源）但记忆想私藏**？填一个**共享记忆仓库**地址——一个仓库装所有项目的记忆（每项目一条专属分支），记忆与代码彻底隔离；
3. 另一台电脑 clone 项目后打开——**自动认亲**（同一仓库地址 = 同一项目），拉下来即可继续用；
4. 平时照常写记忆（实时落盘、零延迟），攒一批点一次「同步」；两台电脑都改了同一条记忆才会出现冲突，Tab 里选「采用本机 / 采用远端 / 两者都要」即可。

**会得到什么**：项目关键记忆、项目日志、归档、项目待办跨设备一致；填了共享记忆仓库后，**全局记忆（用户档案/每日日志/待办）也能跨设备**（四个独立轨开关，开哪个同步哪个）——换电脑不换记忆。**没开同步的项目完全不受影响**（保持纯本地状态）。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:588-604](https://github.com/csyangwen/dsh-memory-evolve/blob/e6f6b84c56f0fc18ba4a6a1a5959fbf86ea9ec8b/lib/index.js#L588-L604)

分支未知回退为假设依据

<details>
<summary>查看原文（17行）</summary>

```text
  // Project KEY facts are injected for the agent's own project only (its
  // session cwd). Same live-read/change-detected mechanism as the global
  // tracks: a KEY write (tool or web tab) surfaces in the next step's tail.
  // When the project is a git worktree and keyBranchFilter is on, the
  // current branch is resolved live and ONLY entries whose scope covers it
  // are injected (untagged entries = "全部" always qualify). Outside git,
  // or when the branch cannot be resolved, every entry is injected — the
  // conservative choice that never hides memory. The branch name itself is
  // injected alongside, so the model knows which branch it is on.
  const keyAgent = agent?.session?.header?.cwd ? agent : undefined
  const branch = keyAgent && config.keyBranchFilter !== false ? gitBranch(keyAgent.session.header.cwd) : undefined
  let keyEntries = keyAgent ? store.entriesOf('key', keyAgent) : []
  if (branch !== undefined) {
    keyEntries = keyEntries.filter((entry) => {
      const scope = parseEntryBranches(entry)
      return scope === null || scope.includes(branch)
    })
```

</details>

#### 缺口

- 分支控制对任务质量/漏召回及全周期成本未测
  **影响**：不能把更严格过滤当已证实收益
  **进一步探讨**：固定模型和事实集，对比当前回退与严格模式，含失败恢复和全部人工时间

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
