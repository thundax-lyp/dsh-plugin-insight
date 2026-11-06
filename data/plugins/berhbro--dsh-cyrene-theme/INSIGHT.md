# dsh-cyrene-theme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[47cf4bf](https://github.com/berhbro/dsh-cyrene-theme/tree/47cf4bf307f52906028b422f30568a52c1ef8f87)

<!-- BEGIN META -->
[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/berhbro/dsh-cyrene-theme) [![npm 30d 2,652](https://img.shields.io/static/v1?label=npm+30d&message=2%2C652&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cyrene-theme) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cyrene-theme)
<!-- END META -->

> **功能**：昔涟主题与可编辑人格，集成表情背景管理、长期记忆工具和世界书关键词查询。

> **亮点**：把表达外观和可见的记忆/资料管理接在一处，主题与数据生命周期分离；底层Agent/section/工具继承DSH。见 [Q03](#research-q03)。

> **主要限制**：持久化吞错仍可能回已记住，home级共享缺session范围；关闭注入不撤工具访问，上传rev非完整事务，异步卸载仍待核。见 [Q02](#research-q02)。

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
  - [Q01 · 外观、人格、记忆与世界书怎样真正进入模型和界面？](#detail-section-11)
  - [Q02 · “已保存/已记住”、共享范围、上传和卸载保证在哪里失效？](#detail-section-12)
  - [Q03 · 比默认UI加提示文件多提供什么，真实采用成本如何分摊？](#detail-section-13)
  - [Q04 · 什么场景值得试，怎样证伪更可信的记忆方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：单用户角色爱好者在DSH中个性化界面、偏好记忆和游戏设定查询。见 [Q01](#research-q01)。

默认DSH UI加短人格文件、独立笔记和手工wiki查询，先比较是否需要自动写记忆。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 人格section | 后续轮次口吻 | home共享、非只改外观 |
| 记忆三工具 | 写/找/忘 | 300条截断、保存吞错 |
| 最新记忆注入 | 背景偏好 | 时间优先、非语义召回 |
| 世界书工具 | 游戏设定关键词查 | 来源/预算/无命中边界 |
| 素材管理 | 表情/背景上传删除 | 本地路径与安装目录 |
| Web管理 | 槽位/样式/数据面板 | Host/Client合同需核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/systemPrompt | Host必需 | 路由与section | 无法完整加载 |
| tools服务 | 模型记忆/世界书所需 | 注册四工具 | 静默/日志跳过但索引可留 |
| Web Client slots/React等 | 管理UI所需 | 侧栏/设置/hero | 注册失败局部跳过 |
| Node>=18 | 声明必需 | 文件/网络 | 无精确DSH兼容矩阵 |
| 独立可写DSH_HOME | 数据所需 | 人格/记忆/世界书 | 同home跨profile共享 |
| 可写custom素材目录 | 上传所需 | 自传图片 | 包更新/迁移需备份 |
| 固定wiki接口/网络 | 首次世界书fetch | 内容构建 | 失败502/已有库另读 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立home备份数据/素材 | 不与其他皮肤叠用 |
| 外观/人格 | UI保存并Host重挂section | 核后续对话/不改正文事实 |
| 记忆 | 人/模型add/search/forget | 核文件和重启非只看ok |
| 世界书 | fetch→本地库→关键词工具 | 查来源/无命中/截断 |
| 退出 | 撤工具/section/客户端 | 数据保留，off非撤权 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Host/图片/网络未知 | 备份、分项核范围 | 先非敏感数据 |
| 持续使用 | 提示token/工具/磁盘未知 | 记忆纠错/更新wiki/兼容 | 2600字非总预算 |
| 失败恢复 | 重试模型/文件未知 | 对账ok与磁盘/重启 | 假成功可丢新记录 |
| 退出 | home数据与素材保留 | 备份/显式遗忘与卸载 | 不撤回已写信息 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 角色风格 | section与UI接线 | 回答正确性/偏好收益 |
| 长期记忆 | CRUD与最新条目注入 | 正确召回/可靠落盘 |
| 资料查询 | 关键词/正文兜底预算 | 无命中不证事实不存在 |
| 并发 | rev拒旧与写链 | 非全部mutation事务 |
| 退出 | disposer与数据分离 | 异步初始化后不重挂 |

> **思考**：持久化吞错仍可能回已记住，home级共享缺session范围；关闭注入不撤工具访问，上传rev非完整事务，异步卸载仍待核。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把表达外观和可见的记忆/资料管理接在一处，主题与数据生命周期分离；底层Agent/section/工具继承DSH。见 [Q03](#research-q03)。

可见数据管理与索引/正文分离可借鉴；提交成功、注入关闭和数据访问必须区分。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

持久化吞错仍可能回已记住，home级共享缺session范围；关闭注入不撤工具访问，上传rev非完整事务，异步卸载仍待核。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

独立home分项观察，先故意写盘失败核回执/重启；错忆/串范围就停工具和插件回独立笔记。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核Host/Client/记忆与世界书关键主链；未运行固定Host、抓wiki或测真实回忆/图像效果。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、lib/index.js、lib/worldbook.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核Host section/状态/记忆工具/世界书构建与关键词检索、资源上传删除/rev/持久化/异步卸载，Client API/槽位/清理主链；未全审全部CSS/素材、Host访问围栏和wiki结构现实可用性，未运行目标。
- 下一步：五故障对照手工笔记/现插件/范围回执原型，检查错报保存、跨范围和恢复；未执行。

**分析版本**

- **仓库**：[berhbro/dsh-cyrene-theme](https://github.com/berhbro/dsh-cyrene-theme)
- **版本号**：0.4.1（[固定提交 47cf4bf](https://github.com/berhbro/dsh-cyrene-theme/tree/47cf4bf307f52906028b422f30568a52c1ef8f87)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先补记忆提交回执、来源/范围和三个不同开关，五故障对照；人工笔记够用或Host已有等价则不另造库。见 [Q04](#research-q04)。

五故障对照手工笔记/现插件/范围回执原型，检查错报保存、跨范围和恢复；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 5613 | 4588 | 744 | — |
| .md | source | 1 | 486 | — | — | 17011 |
| .mjs | test | 3 | 2743 | 2414 | 179 | — |
| .mjs | source | 3 | 146 | 111 | 19 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/berhbro/dsh-cyrene-theme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/berhbro/dsh-cyrene-theme/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/berhbro/dsh-cyrene-theme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：角色外观、人格、记忆与世界书怎样进入上下文，持久化与共享范围支持什么保证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 外观、人格、记忆与世界书怎样真正进入模型和界面？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向希望在DSH里使用昔涟角色风格、保留个人偏好并查询游戏设定的单用户。基线是默认UI加手工人格文件/笔记/关键词查wiki；成功应同时做到任务正文准确、个人信息可控、已记内容可找回，而不只是粉白界面。真实范围是Host+Web客户端插件，新增三种记忆工具与一个世界书工具，不是另建自主Agent循环。

Host注册cyrene:persona section，把可编辑人格和贴图说明作为纯字符串；保存后先卸再挂，顺序跟部署人格前缀之后。人格off使该section正文为空，贴图说明也消失；主题开关只管外观，不等于关闭人格/记忆。贴图是提示模型输出包内素材绝对路径，数量/时机属提示，不像Host流转写有程序层限量；图片可读还依赖Host附件/工作区与Client渲染。

记忆存在DSH_HOME/cyrene-memory.json，由工具add/search/forget和管理路由共同改。add截为600字、最多300条，超上限直接截掉最旧条目；提示section取最新记忆，按名义2600字预算逐条加入，旧条目未注入不等于都仍保存。search是正文/标签子串匹配，空查询给最近条目；没有向量语义检索。关闭memory.enabled只停自动section注入，工具注册及其读写没有同开关门控。

世界书从固定wiki接口抓取，解析data.content_list并清理/分段，写独立JSON；只把角色索引放进提示，正文靠cyrene_worldbook_search。检索先关键词触发key，完全无命中才退正文子串，按简单分值排序，输出有条数/总预算和单条截断；不是知识真伪验证，没查到不能说明原设定没有。tools服务缺席或注册失败只日志跳过，索引仍可能告诉模型调用不存在工具。

客户端注册CSS/body作用域、侧栏/设置/hero槽，fetch同源Host路由更新设置；API响应错误会抛出，记忆写带自己的rev。背景轮换与DOM诊断定时器有disposer。源码支持这些接线，但实际模型调用、图像路径、正确回忆和答案一致性均未运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1459-1503](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1459-L1503)

人格与贴图提示实际拼接。

<details>
<summary>查看原文（45行）</summary>

```text
function stickerText() {
  if (state.stickers !== true || stickers.items.length === 0) return ''
  const lines = [
    '',
    '【表情包】',
    `你有一套自己的表情包（${stickers.items.length} 张）。想贴一张的时候，在回复的最后单独占一行，原样写下面对应的整行（**路径连尖括号一起复制**，不要改写、不要自己拼）：`,
    '',
  ]
  for (const item of stickers.items) {
    const use = item.when === '' ? '' : `｜${item.when}`
    lines.push(`- ${item.label}${use} → ![昔涟·${item.label}](<${item.abs}>)`)
  }
  lines.push(
    '',
    `贴的规矩：一次回复最多 ${stickers.maxPerTurn} 张；只在情绪真的到了的时候贴（事情做成了、想鼓励你、想撒个娇、要道歉、被夸了）；代码、命令、报错和技术结论旁边不要贴；拿不准就不贴。`,
  )
  return lines.join('\n')
}

/** 关掉人格、或设定被清空时，交出空字符串（空 section 会被渲染阶段丢掉）。 */
function personaText() {
  if (state.enabled !== true || state.persona.trim() === '') return ''
  return state.persona + stickerText()
}

/**
 * 挂载（或重挂）人格 section。
 * 用「先卸再挂 + 纯字符串正文」而不是「正文写成函数」：
 * 前者只依赖最基础的那一版 API，任何 DSH 版本都成立，
 * 而每次保存后重挂同样能让新设定立刻生效。
 */
function remountPersona(prompt) {
  if (disposeSection !== null) {
    try {
      disposeSection()
    } catch {
      // 旧的已经跟着插件 fiber 一起消失了，忽略
    }
    disposeSection = null
  }
  disposeSection = prompt.section({
    name: SECTION_NAME,
    order: resolvePersonaOrder(prompt),
    text: personaText(),
  })
```

</details>

**依据 2 · 源码核查**：[lib/index.js:699-741](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L699-L741)

时间倒序记忆提示。

<details>
<summary>查看原文（43行）</summary>

```text
function memoryText() {
  if (memoryStore.enabled !== true || memoryStore.items.length === 0) return ''
  const head = [
    '',
    '【昔涟 · 长期记忆】',
    '下面这些是你和用户在过去对话里攒下来的记忆（时间倒序）。它们是背景资料：和本轮对话冲突时以本轮为准；用得上时才自然地带出来，不要逐条复述，也不要假装记得没写在这里的事。',
  ]
  let used = head.join('\n').length
  const ordered = [...memoryStore.items].sort((a, b) => (a.created < b.created ? 1 : -1))
  for (const item of ordered) {
    const tags = item.tags.length === 0 ? '' : `（${item.tags.join('、')}）`
    const line = `- ${item.created.slice(0, 10)}${tags} ${item.text}`
    if (used + line.length > MEMORY_SECTION_BUDGET) break
    head.push(line)
    used += line.length + 1
  }
  head.push(
    '',
    '要记住新的事：调用 cyrene_memory_add；要翻旧事：调用 cyrene_memory_search。写记忆要短、要具体、要能被未来的自己看懂。',
  )
  return head.join('\n')
}

let disposeMemorySection = null

/** 和人格 section 同一套「先卸再挂 + 纯字符串正文」，任何 DSH 版本都成立。 */
function remountMemory(prompt) {
  if (disposeMemorySection !== null) {
    try {
      disposeMemorySection()
    } catch {
      // 旧 section 已经跟着 fiber 消失
    }
    disposeMemorySection = null
  }
  const text = memoryText()
  if (text === '') return
  disposeMemorySection = prompt.section({
    name: MEMORY_SECTION_NAME,
    order: resolvePersonaOrder(prompt) + 20,
    text,
  })
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:744-772](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L744-L772)

300条截断与子串搜索。

<details>
<summary>查看原文（29行）</summary>

```text
function addMemory(text, tags) {
  const clean = cleanMemoryText(text)
  if (clean === '') return null
  const item = {
    id: newMemoryId(),
    text: clean,
    tags: cleanMemoryTags(tags),
    importance: 3,
    created: new Date().toISOString(),
  }
  memoryStore.items.unshift(item)
  if (memoryStore.items.length > MEMORY_LIMIT) memoryStore.items.length = MEMORY_LIMIT
  return item
}

/** 搜索：不区分大小写的子串匹配，命中 text 或 tags 都算；空关键词给最近的一批。 */
function searchMemories(query, limit) {
  const max = Math.min(MEMORY_LIMIT, Math.max(1, Number.isFinite(Number(limit)) ? Math.round(Number(limit)) : MEMORY_TOOL_DEFAULT))
  const needle = typeof query === 'string' ? query.trim().toLowerCase() : ''
  const items = [...memoryStore.items].sort((a, b) => (a.created < b.created ? 1 : -1))
  if (needle === '') return items.slice(0, max)
  return items
    .filter((item) => item.text.toLowerCase().includes(needle)
      || item.tags.some((tag) => tag.toLowerCase().includes(needle)))
    .slice(0, max)
}

/**
 * 把记忆能力交给模型：三个工具（写 / 找 / 忘）。
```

</details>

**依据 4 · 源码核查**：[lib/index.js:801-864](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L801-L864)

三个模型记忆工具。

<details>
<summary>查看原文（64行）</summary>

```text
  register({
    name: 'cyrene_memory_add',
    description: '往昔涟的长期记忆里存一条。只在真的值得以后还记得时用：用户的偏好、约定、长期事实、踩过的坑。一条只说一件事，不超过 600 字；别存对话过程、别存临时状态、别存能从代码里读到的东西。',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: '要记住的那件事，主语明确、能独立读懂（例如"用户偏好深色主题，屏幕是 2560×1600"）。' },
        tags: { type: 'array', items: { type: 'string' }, description: '可选标签，最多 8 个，用于以后检索（例如 ["偏好","环境"]）。' },
      },
      required: ['text'],
      additionalProperties: false,
    },
    async execute(args) {
      const item = addMemory(args?.text, args?.tags)
      if (item === null) return { ok: false, error: 'nothing-to-remember' }
      memoryStore.rev += 1
      await persistMemories(ctx)
      remountMemory(ctx.systemPrompt)
      return { ok: true, id: item.id, count: memoryStore.items.length }
    },
  })
  register({
    name: 'cyrene_memory_search',
    description: '在昔涟的长期记忆里找旧事（不区分大小写的子串匹配，命中正文或标签都算）。不确定用户以前说过什么、做过什么约定时先用它翻一遍，别凭印象猜。',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '关键词；留空则返回最近记住的几条。' },
        limit: { type: 'integer', description: '最多返回几条（默认 8）。' },
      },
      additionalProperties: false,
    },
    async execute(args) {
      const items = searchMemories(args?.query, args?.limit)
      return {
        total: memoryStore.items.length,
        returned: items.length,
        items: items.map((item) => ({
          id: item.id,
          text: item.text,
          tags: [...item.tags],
          created: item.created,
        })),
      }
    },
  })
  register({
    name: 'cyrene_memory_forget',
    description: '从长期记忆里删掉一条（用 cyrene_memory_search 拿到的 id）。用户说"忘掉这个"、或发现记错了时用。',
    parameters: {
      type: 'object',
      properties: { id: { type: 'string', description: '记忆条目的 id。' } },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(args) {
      const id = typeof args?.id === 'string' ? args.id : ''
      const index = memoryStore.items.findIndex((item) => item.id === id)
      if (index < 0) return { ok: false, error: 'not-found' }
      memoryStore.items.splice(index, 1)
      memoryStore.rev += 1
      await persistMemories(ctx)
      remountMemory(ctx.systemPrompt)
      return { ok: true, count: memoryStore.items.length }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1257-1325](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1257-L1325)

世界书索引和有预算检索。

<details>
<summary>查看原文（69行）</summary>

```text
function worldbookText() {
  if (worldbookStore.entries.length === 0) return ''
  const stats = summarizeEntries(worldbookStore.entries)
  const names = stats.characters.map((row) => `${row.name}（${row.total}）`).join('、')
  const version = worldbookStore.version === '' ? '' : `（版本 ${worldbookStore.version}）`
  const lines = [
    '',
    '【昔涟 · 世界书】',
    `这里有一份整理自官方 wiki 的翁法罗斯设定库${version}，共 ${stats.count} 条，覆盖：${names}。`,
    '聊到这些角色、他们的故事、彼此的关系，或者翁法罗斯的地理与设定时，先调用 cyrene_worldbook_search 查一遍再回答；查到什么说什么，查不到就直说记不准——不要凭印象编设定。',
  ]
  const text = lines.join('\n')
  return text.length > WORLDBOOK_SECTION_BUDGET ? text.slice(0, WORLDBOOK_SECTION_BUDGET) : text
}

let disposeWorldbookSection = null
let mountedWorldbookText = null

/** 和人格、记忆同一套「先卸再挂」，正文为空就不注册；正文没变就不折腾。 */
function remountWorldbook(prompt) {
  const text = worldbookText()
  if (disposeWorldbookSection !== null && text === mountedWorldbookText) return
  if (disposeWorldbookSection !== null) {
    try {
      disposeWorldbookSection()
    } catch {
      // 旧 section 已经跟着 fiber 消失
    }
    disposeWorldbookSection = null
  }
  mountedWorldbookText = text === '' ? null : text
  if (text === '') return
  disposeWorldbookSection = prompt.section({
    name: WORLDBOOK_SECTION_NAME,
    order: resolvePersonaOrder(prompt) + 10,
    text,
  })
}

/** 按关键词取条目：总预算有限，放不下的那几条只报个数。 */
function searchWorldbook(query, limit) {
  const hits = matchEntries(worldbookStore.entries, query, limit)
  const blocks = []
  const list = []
  let used = 0
  let dropped = 0
  for (const hit of hits) {
    const head = `## ${hit.name}（命中：${hit.matched.join('、')}）`
    let body = hit.content
    if (body.length > WORLDBOOK_ENTRY_SHOWN) body = `${body.slice(0, WORLDBOOK_ENTRY_SHOWN)}…（已截断）`
    const block = `${head}\n${body}`
    if (used + block.length > WORLDBOOK_TOOL_BUDGET) {
      dropped += 1
      continue
    }
    blocks.push(block)
    used += block.length + 2
    list.push({
      id: hit.id,
      name: hit.name,
      character: hit.character,
      category: hit.category,
      matched: hit.matched,
    })
  }
  const parts = blocks.join('\n\n---\n\n')
  const tail = dropped === 0 ? '' : `\n\n（还有 ${dropped} 条没放进预算：换个更具体的关键词再查，或者调小 limit 只看最相关的。）`
  return { hits: list, text: `${parts}${tail}`.trim(), count: hits.length, dropped };
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1346-1384](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1346-L1384)

实际世界书工具注册/缺命中。

<details>
<summary>查看原文（39行）</summary>

```text
    const dispose = tools.register({
      name: 'cyrene_worldbook_search',
      description: '查昔涟的世界书（翁法罗斯的角色档案、角色故事、角色关系、角色解析）。问到某个角色的生平、设定、彼此关系，或者拿不准的剧情细节时先查这里，别凭印象编。关键词写角色名或专有名词效果最好；一次只给最相关的几条。',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '要查的关键词，通常是角色名（如「白厄」「昔涟」）或专有名词；可以带上想问的方面（如「白厄 童年」）。' },
          limit: { type: 'integer', description: `最多给几条，默认 ${WORLDBOOK_TOOL_DEFAULT}，上限 20。` },
        },
        required: ['query'],
        additionalProperties: false,
      },
      output: textOutput,
      execute: async (args) => {
        await ensureWorldbook(ctx)
        const query = String(args?.query || '')
        const result = searchWorldbook(args?.query, args?.limit)
        // 必须返回对象：宿主的 output.schema 是 object，返回裸字符串会报
        // `"value" must be an object`（真踩过，工具当场用不了）。
        if (result.count === 0) {
          return {
            text: `世界书里没有命中「${query}」的条目。可以换个角色名或专有名词再试；确实没有就直说记不准，不要编。`,
            count: 0,
            dropped: 0,
            hits: [],
          }
        }
        return {
          text: `命中 ${result.count} 条（关键词：${query}）\n\n${result.text}`,
          count: result.count,
          dropped: result.dropped,
          hits: result.hits,
        }
      },
    })
    if (typeof dispose === 'function') disposers.push(dispose)
  } catch (error) {
    ctx.logger?.warn?.(`${PACKAGE_ID}: 注册 cyrene_worldbook_search 失败`, error)
  }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1397-1425](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1397-L1425)

网络抓取到文件。

<details>
<summary>查看原文（29行）</summary>

```text
async function fetchWorldbook() {
  if (typeof fetch !== 'function') throw new Error('这个 Node 运行时没有内置 fetch')
  const url = `${WORLDBOOK_WIKI_URL}?lang=zh-cn`
  const response = await fetch(url, { headers: { accept: 'application/json' } })
  if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`)
  const raw = await response.json()
  if (raw?.retcode !== 0 || raw?.data === null || raw?.data === undefined) {
    throw new Error(`接口没给数据：${raw?.message || `retcode ${raw?.retcode}`}`)
  }
  const entries = buildEntries(raw.data)
  if (entries.length === 0) throw new Error('一条条目都没切出来，可能接口结构变了')
  const document = packWorldbook(entries, {
    source: url,
    sourceVersion: String(raw.data.current_version || ''),
  })
  // 先写临时文件再原子改名：抓取中断时不会留下半份坏 json。
  const target = worldbookPath()
  const staging = `${target}.tmp`
  await writeFile(staging, `${JSON.stringify(document, null, 2)}\n`, 'utf8')
  await rename(staging, target)
  worldbookStore = {
    entries: sanitizeEntries(document.entries),
    source: document.source,
    version: document.sourceVersion,
    fetchedAt: document.fetchedAt,
    error: null,
  }
  worldbookLoaded = true
  return worldbookStore
```

</details>

**依据 8 · 源码核查**：[lib/worldbook.js:280-304](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/worldbook.js#L280-L304)

content_list构造条目。

<details>
<summary>查看原文（25行）</summary>

```text
export function buildEntries(data) {
  const list = Array.isArray(data?.content_list) ? data.content_list : [];
  // 同一个角色在 content_list 里可能出现两次（其中一份只有几行占位文本），
  // 按资料量留最完整的那份，否则关系条目会成对重复。
  const best = new Map();
  for (const raw of list) {
    const info = raw?.base_info || {};
    const name = cleanName(info.name);
    if (name === '') continue;
    const weight = weighCharacter(raw);
    const kept = best.get(name);
    if (!kept || weight > kept.weight) best.set(name, { raw, weight });
  }
  const out = [];
  for (const [name, { raw }] of best) {
    const info = raw?.base_info || {};
    const character = { name, cid: String(raw.content_id || info.avatarId || '') };
    if (character.cid === '') continue;
    out.push(...archiveEntry(character, sheet(raw.character_info)));
    out.push(...storyEntries(character, sheet(raw.character_story)));
    out.push(...relationEntries(character, sheet(raw.character_relation)));
    out.push(...analysisEntries(character, sheet(raw.character_analysis)));
  }
  return out;
}
```

</details>

**依据 9 · 源码核查**：[lib/worldbook.js:381-445](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/worldbook.js#L381-L445)

关键词优先和正文兜底排序。

<details>
<summary>查看原文（65行）</summary>

```text
export function matchEntries(entries, query, limit = 6) {
  const list = Array.isArray(entries) ? entries : [];
  const terms = splitTerms(query);
  if (terms.length === 0) return [];
  const hint = categoryHint(query);

  const scored = [];
  for (const item of list) {
    const matched = [];
    let termHits = 0;
    let weight = 0;
    for (const term of terms) {
      let hitKey = '';
      for (const key of item.keys) {
        const folded = key.toLowerCase();
        if (folded === '' || !(folded.includes(term) || term.includes(folded))) continue;
        hitKey = key;
        if (folded === term) weight += 8;
        break;
      }
      if (hitKey === '') continue;
      termHits += 1;
      matched.push(hitKey);
    }
    if (termHits === 0) continue;
    const nameHit = terms.some((term) => item.name.toLowerCase().includes(term) || String(item.character).toLowerCase().includes(term));
    scored.push({
      item,
      score: termHits * 20 + weight + (nameHit ? 3 : 0) + (DEFAULT_BONUS[item.category] || 0) + (hint !== '' && item.category === hint ? 14 : 0),
      hits: matched,
    });
  }

  // 触发词一个都没中：退回正文子串检索（只在前一种完全没结果时发生）。
  if (scored.length === 0) {
    for (const item of list) {
      const content = item.content.toLowerCase();
      const found = [];
      let weight = 0;
      for (const term of terms) {
        let count = 0;
        let from = content.indexOf(term);
        while (from !== -1 && count < 3) {
          count += 1;
          from = content.indexOf(term, from + term.length);
        }
        if (count === 0) continue;
        found.push(term);
        weight += count;
      }
      if (found.length === 0) continue;
      scored.push({
        item,
        score: found.length * 10 + Math.min(weight, 6) + (DEFAULT_BONUS[item.category] || 0) + (hint !== '' && item.category === hint ? 14 : 0),
        hits: found,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.item.content.length - b.item.content.length);
  return scored.slice(0, Math.max(1, Math.min(20, Number(limit) || 6))).map((row) => ({
    ...row.item,
    matched: row.hits,
    score: row.score,
  }));
```

</details>

**依据 10 · 源码核查**：[lib/client.js:2981-3038](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/client.js#L2981-L3038)

CSS/作用域/同步/背景清理。

<details>
<summary>查看原文（58行）</summary>

```text
    function apply(ctx) {
      hostCtx = ctx;

      // 样式表：随插件卸载自动移除。
      ctx.effect(() => {
        const tag = document.createElement("style");
        tag.setAttribute("data-plugin-css", PACKAGE_ID);
        tag.textContent = CSS;
        document.head.appendChild(tag);
        return () => tag.remove();
      }, PACKAGE_ID + ": stylesheet");

      // body 作用域：卸载时还原（含主题开关属性）。
      ctx.effect(() => {
        document.body.setAttribute(BODY_ATTR, "");
        return () => {
          document.body.removeAttribute(BODY_ATTR);
          document.body.removeAttribute(SKIN_ATTR);
        };
      }, PACKAGE_ID + ": body scope");

      // 客户端 loader 会把没有 data-plugin 的 <style> 盖上本插件 id，
      // 卸载时会连带删掉别的插件的运行时样式；把不属于本包的标记摘掉。
      ctx.effect(() => () => {
        const claimed = document.querySelectorAll('style[data-plugin="' + PACKAGE_ID + '"]:not([data-plugin-css])');
        for (const tag of claimed) tag.removeAttribute("data-plugin");
      }, PACKAGE_ID + ": release styles claimed by the loader");

      // 页面重新可见 / 重新获得焦点时，从宿主同步一次：外部或其他窗口改过的
      // 设定不必刷新页面就能对上；有未保存的编辑时跳过，免得盖掉正在写的内容。
      // 背景清单也一起重扫：往 Background/ 里新丢一张图，切回来就看得见。
      ctx.effect(() => {
        const resync = () => {
          if (document.visibilityState === "hidden") return;
          if (pendingEdits.size > 0) return;
          void load(true);
          void loadBackgrounds();
        };
        document.addEventListener("visibilitychange", resync);
        window.addEventListener("focus", resync);
        return () => {
          document.removeEventListener("visibilitychange", resync);
          window.removeEventListener("focus", resync);
        };
      }, PACKAGE_ID + ": resync on focus");

      // 背景层：body 上挂一层（z-index:-1、pointer-events:none，不参与布局也不接指针），
      // 开机就把清单读回来；卸载时把层和轮换定时器一起收走。
      // 深浅色和背景图**不绑定**：切外观不重铺背景，换背景也不动外观。
      ctx.effect(() => {
        ensureBackgroundLayer();
        void loadBackgrounds();
        return () => {
          stopRotation();
          if (backgroundLayer !== null) backgroundLayer.el.remove();
          backgroundLayer = null;
          backgroundAnchor = null;
          backgroundItems = [];
```

</details>

**依据 11 · 源码核查**：[lib/client.js:3079-3102](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/client.js#L3079-L3102)

三处槽位真实注册。

<details>
<summary>查看原文（24行）</summary>

```text
        safeInject("sidebar.footer.action", () => ctx.slots.register({
          name: "sidebar.footer.action",
          id: "cyrene-persona",
          order: 20,
          label: () => "昔涟",
        }, components.CyreneAction));

        safeInject("settings.section", () => ctx.slots.register({
          name: "settings.section",
          id: "cyrene-theme",
          order: 30,
          label: () => "昔涟 · 主题",
        }, components.CyreneSettings));

        // 单占位槽位。契约里官方示例只传 { name }，可宿主不一定让这个槽空着：DSH Desktop
        // 的 dsh-desktop-client-ui 就在 priority 0 占了它（内容就是那条鱼）。契约原文是
        // "register at a different priority to shadow it (lowest renders)"，所以用 -1 去盖住
        // p0；槽位真空着时 -1 也是唯一的一个，照常渲染。
        safeInject("conversation.hero.brand.mark", () => ctx.slots.register({
          name: "conversation.hero.brand.mark",
          priority: -1,
        }, components.CyreneHero));
      }

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · “已保存/已记住”、共享范围、上传和卸载保证在哪里失效？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

状态和记忆持久化都先串行写临时文件再rename，这是避免半JSON的机制；但catch只warn并吞掉错误，调用者await随后仍回ok:true、更新section。磁盘写失败时“记住”可能只在当前进程有效，重启即丢；rev增加也不等于落盘提交成功。客户端检查ok无法识别这个Host层假成功。读坏文件则告警用默认/旧内存，不能把没有报错当数据完整。

rev拒绝缺失/旧版本，有用但并非所有mutation的事务锁。上传在rev检查后await写文件，随后才push状态/rev++，并发请求可同读旧rev后都进入；同进程saveChain只串文件落盘，不把检查/文件/内存变更包为原子事务。worldbook fetch/clear没有这套rev。模型记忆工具也不需要管理页rev或逐次用户确认，删除/上限截断无撤销队列。

文件按DSH_HOME而非session/workspace/principal划分，独立profile若共用home会共享人格/记忆/世界书；不能用于多用户或多租户隔离。memory.enabled只控制提示注入，search/add/forget仍可调用，off不是数据访问撤权或删除。私密偏好不应因“长期记忆”名字就默认可写入；模型摘要也可能记错，具体事实需用户复核。

图片上传校验data URL MIME、大小与生成文件名，未完整解码/验证内容；sticker8MiB、背景24MiB，文件落在插件安装目录旁custom目录，更新/迁移包时要另备份，删除会真实删自传字节并影响旧绝对路径图片。路由通过webServer.register kind=prefix，没有在处理器自行认证；“fenced”是注释，不是此对象新增的身份字段，实际Host访问围栏需固定版本核验，不能声称独立认证或已证未授权访问。

Host异步ensureMemories/ensureWorldbook及Promise.all回调没有disposed守卫；若卸载先于读取完成，后续仍可能重挂section/注册工具，是否由Host fiber拒绝需核。正常退出会调用已取得disposer和清客户端层，但不删除数据、不回滚模型已写/忘的记忆。世界书抓取失败返回502，来源内容清理HTML不等于事实与提示注入安全已验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:491-514](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L491-L514)

状态保存吞错。

<details>
<summary>查看原文（24行）</summary>

```text
function persist(ctx) {
  const payload = JSON.stringify({
    persona: state.persona,
    enabled: state.enabled,
    theme: state.theme,
    stickers: state.stickers,
    stickerSize: state.stickerSize,
    customStickers: state.customStickers.map((entry) => ({ ...entry })),
    customBackgrounds: state.customBackgrounds.map((entry) => ({ ...entry })),
    background: { ...state.background },
    hero: { image: state.hero.image, title: state.hero.title },
    rev: state.rev,
  }, null, 2)
  saveChain = saveChain.then(async () => {
    const target = statePath()
    const temp = `${target}.${process.pid}.tmp`
    await mkdir(dirname(target), { recursive: true })
    await writeFile(temp, payload, 'utf8')
    await rename(temp, target)
  }).catch((error) => {
    ctx.logger?.warn?.(`${PACKAGE_ID}: 保存设定失败`, error)
  })
  return saveChain
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:668-683](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L668-L683)

记忆保存吞错。

<details>
<summary>查看原文（16行）</summary>

```text
function persistMemories(ctx) {
  const payload = JSON.stringify({
    enabled: memoryStore.enabled,
    rev: memoryStore.rev,
    items: memoryStore.items.map((item) => ({ ...item })),
  }, null, 2)
  memorySaveChain = memorySaveChain.then(async () => {
    const target = memoryPath()
    const temp = `${target}.${process.pid}.tmp`
    await mkdir(dirname(target), { recursive: true })
    await writeFile(temp, payload, 'utf8')
    await rename(temp, target)
  }).catch((error) => {
    ctx?.logger?.warn?.(`${PACKAGE_ID}: 保存记忆失败`, error)
  })
  return memorySaveChain
```

</details>

**依据 3 · 源码核查**：[lib/index.js:813-819](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L813-L819)

写记忆await后直接ok。

```text
    async execute(args) {
      const item = addMemory(args?.text, args?.tags)
      if (item === null) return { ok: false, error: 'nothing-to-remember' }
      memoryStore.rev += 1
      await persistMemories(ctx)
      remountMemory(ctx.systemPrompt)
      return { ok: true, id: item.id, count: memoryStore.items.length }
```

**依据 4 · 源码核查**：[lib/index.js:906-925](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L906-L925)

rev闸门。

<details>
<summary>查看原文（20行）</summary>

```text
function revRejected(res, body, rev = state.rev) {
  if (!Number.isInteger(body?.rev)) {
    noteWrite(body, 'client-outdated')
    sendJson(res, 400, {
      ok: false,
      error: { code: 'client-outdated', message: '这个页面还是旧版本，请按 F5 刷新后重试' },
    })
    return true
  }
  if (body.rev !== rev) {
    noteWrite(body, 'stale')
    sendJson(res, 409, {
      ok: false,
      error: { code: 'stale', message: '设定已在别处改动，已为你重新载入最新版本，请再操作一次' },
    })
    return true
  }
  return false
}

```

</details>

**依据 5 · 源码核查**：[lib/index.js:1629-1680](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1629-L1680)

上传先检查rev再await写字节。

<details>
<summary>查看原文（52行）</summary>

```text
          if (route === '/stickers' && req.method === 'POST') {
            await ensureLoaded(ctx)
            const body = await readJsonBody(req, MAX_UPLOAD_BYTES)
            if (revRejected(res, body)) return
            const parsed = parseDataUrl(body?.data)
            if (parsed === null) {
              sendJson(res, 400, {
                ok: false,
                error: { code: 'bad-image', message: '图片数据读不出来（只接受 data:image/*;base64,…）' },
              })
              return
            }
            // 扩展名优先信 data URL 里的 mime（浏览器给的最准），
            // 认不出来时退回文件名后缀。
            const named = ASSET_TYPES[extname(typeof body?.name === 'string' ? body.name : '').toLowerCase()]
            const ext = MIME_EXT[parsed.mime] ?? named
            if (ext === undefined) {
              sendJson(res, 400, {
                ok: false,
                error: { code: 'bad-type', message: `不认识的图片类型：${parsed.mime}` },
              })
              return
            }
            if (parsed.bytes.length > MAX_ASSET_BYTES) {
              sendJson(res, 400, {
                ok: false,
                error: {
                  code: 'too-large',
                  message: `图片太大（${parsed.bytes.length} 字节，上限 ${MAX_ASSET_BYTES}）`,
                },
              })
              return
            }
            const id = newStickerId()
            const file = `${id}${ext}`
            await mkdir(CUSTOM_STICKER_DIR, { recursive: true })
            await writeFile(join(CUSTOM_STICKER_DIR, file), parsed.bytes)
            state.customStickers.push({
              id,
              file,
              label: typeof body.label === 'string' && body.label.trim() !== ''
                ? body.label.trim().slice(0, 40)
                : file,
              when: typeof body.when === 'string' ? body.when.trim().slice(0, 200) : '',
            })
            state.rev += 1
            await persist(ctx)
            await ensureStickers(ctx, true)
            // 新贴纸要立刻能贴：人格正文里的清单跟着重挂。
            remountPersona(ctx.systemPrompt)
            noteWrite(body, 'ok')
            sendJson(res, 200, { ok: true, value: { state: publicState(), stickers: publicStickers() } })
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1765-1833](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1765-L1833)

记忆开关与worldbook无rev动作。

<details>
<summary>查看原文（69行）</summary>

```text
          if (route === '/memory' && req.method === 'POST') {
            await ensureMemories(ctx)
            const body = await readJsonBody(req)
            // 记忆有自己的版本号：它和主题设定是两份数据，别互相把 rev 顶掉。
            if (revRejected(res, body, memoryStore.rev)) return
            const action = typeof body?.action === 'string' ? body.action : ''
            if (action === 'toggle') {
              memoryStore.enabled = body?.enabled !== false
            } else if (action === 'add') {
              if (addMemory(body?.text, body?.tags) === null) {
                sendJson(res, 400, { ok: false, error: { code: 'empty-text', message: '先写点要记的东西' } })
                return
              }
            } else if (action === 'remove') {
              const id = typeof body?.id === 'string' ? body.id : ''
              const index = memoryStore.items.findIndex((item) => item.id === id)
              if (index < 0) {
                sendJson(res, 404, { ok: false, error: { code: 'not-found', message: '这条记忆已经不在了' } })
                return
              }
              memoryStore.items.splice(index, 1)
            } else if (action === 'clear') {
              memoryStore.items = []
            } else {
              sendJson(res, 400, { ok: false, error: { code: 'bad-action', message: `不认识的动作：${action}` } })
              return
            }
            memoryStore.rev += 1
            await persistMemories(ctx)
            remountMemory(ctx.systemPrompt)
            sendJson(res, 200, { ok: true, value: publicMemories() })
            return
          }
          if (route === '/worldbook' && req.method === 'GET') {
            await ensureWorldbook(ctx, url.searchParams.get('reload') === '1')
            // 磁盘上的库变了（用户自己换了文件）也要跟着挂/卸那一行索引，
            // remountWorldbook 里有正文比对，正文没变不会反复重挂。
            remountWorldbook(ctx.systemPrompt)
            sendJson(res, 200, { ok: true, value: publicWorldbook() })
            return
          }
          if (route === '/worldbook' && req.method === 'POST') {
            await ensureWorldbook(ctx)
            const body = await readJsonBody(req)
            const action = typeof body?.action === 'string' ? body.action : ''
            if (action === 'reload') {
              await ensureWorldbook(ctx, true)
            } else if (action === 'clear') {
              // 只删这份资料库；人格、记忆、主题设定都不受影响。
              await rm(worldbookPath(), { force: true })
              worldbookStore = { ...EMPTY_WORLDBOOK }
              worldbookLoaded = true
            } else if (action === 'fetch') {
              try {
                await fetchWorldbook()
              } catch (error) {
                sendJson(res, 502, {
                  ok: false,
                  error: { code: 'fetch-failed', message: String(error?.message || error) },
                })
                return
              }
            } else {
              sendJson(res, 400, { ok: false, error: { code: 'bad-action', message: `不认识的动作：${action}` } })
              return
            }
            remountWorldbook(ctx.systemPrompt)
            sendJson(res, 200, { ok: true, value: publicWorldbook() })
            return
```

</details>

**依据 7 · 源码核查**：[lib/index.js:244-250](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L244-L250)

home级状态路径。

```text
function statePath() {
  const home = typeof process.env.DSH_HOME === 'string' && process.env.DSH_HOME.trim() !== ''
    ? process.env.DSH_HOME.trim()
    : join(homedir(), '.dsh')
  return join(home, 'cyrene-theme.json')
}

```

**依据 8 · 源码核查**：[lib/index.js:526-537](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L526-L537)

记忆共享路径和限制。

<details>
<summary>查看原文（12行）</summary>

```text
const MEMORY_FILE = 'cyrene-memory.json'
const MEMORY_TEXT_MAX = 600
const MEMORY_TAG_MAX = 8
const MEMORY_LIMIT = 300
const MEMORY_SECTION_BUDGET = 2600
const MEMORY_TOOL_DEFAULT = 8
const MEMORY_SECTION_NAME = 'cyrene:memory'

/** 和主题设定放同一个目录（`%USERPROFILE%\.dsh`），但用另一个文件。 */
function memoryPath() {
  return join(dirname(statePath()), MEMORY_FILE)
}
```

</details>

**依据 9 · 源码核查**：[lib/index.js:394-406](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L394-L406)

base64不解码图片内容。

<details>
<summary>查看原文（13行）</summary>

```text
function parseDataUrl(data) {
  if (typeof data !== 'string') return null
  const match = /^data:([a-z0-9.+/-]+);base64,([A-Za-z0-9+/=]+)$/i.exec(data.trim())
  if (match === null) return null
  let bytes
  try {
    bytes = Buffer.from(match[2], 'base64')
  } catch {
    return null
  }
  if (bytes.length === 0) return null
  return { mime: match[1].toLowerCase(), bytes }
}
```

</details>

**依据 10 · 源码核查**：[lib/index.js:1683-1703](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1683-L1703)

删除自传字节。

<details>
<summary>查看原文（21行）</summary>

```text
          if (route === '/stickers/remove' && req.method === 'POST') {
            await ensureLoaded(ctx)
            const body = await readJsonBody(req)
            if (revRejected(res, body)) return
            const id = typeof body?.id === 'string' ? body.id.trim() : ''
            const index = state.customStickers.findIndex((entry) => entry.id === id)
            if (index === -1) {
              sendJson(res, 404, {
                ok: false,
                error: { code: 'not-found', message: `没有这张自定义表情包：${id}` },
              })
              return
            }
            const [removed] = state.customStickers.splice(index, 1)
            await rm(join(CUSTOM_STICKER_DIR, removed.file), { force: true })
            state.rev += 1
            await persist(ctx)
            await ensureStickers(ctx, true)
            remountPersona(ctx.systemPrompt)
            noteWrite(body, 'ok')
            sendJson(res, 200, { ok: true, value: { state: publicState(), stickers: publicStickers() } })
```

</details>

**依据 11 · 源码核查**：[lib/index.js:1526-1586](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1526-L1586)

异步初始化与卸载回调。

<details>
<summary>查看原文（61行）</summary>

```text
  ctx.effect(() => {
    let disposeTools = null
    void ensureMemories(ctx).then(() => {
      remountMemory(ctx.systemPrompt)
      disposeTools = registerMemoryTools(ctx)
    })
    return () => {
      if (disposeTools !== null) {
        try {
          disposeTools()
        } catch {
          // 交由插件 fiber 回收
        }
        disposeTools = null
      }
      if (disposeMemorySection !== null) {
        try {
          disposeMemorySection()
        } catch {
          // 同上
        }
        disposeMemorySection = null
      }
    }
  }, `${PACKAGE_ID}: memory`)

  // 世界书：数据 + 一行索引 section + 检索工具。资料库不存在就安静地什么都不挂。
  ctx.effect(() => {
    let disposeWorldbookTools = null
    void ensureWorldbook(ctx).then(() => {
      remountWorldbook(ctx.systemPrompt)
      disposeWorldbookTools = registerWorldbookTools(ctx)
    })
    return () => {
      if (disposeWorldbookTools !== null) {
        try {
          disposeWorldbookTools()
        } catch {
          // 交由插件 fiber 回收
        }
        disposeWorldbookTools = null
      }
      if (disposeWorldbookSection !== null) {
        try {
          disposeWorldbookSection()
        } catch {
          // 同上
        }
        disposeWorldbookSection = null
      }
    }
  }, `${PACKAGE_ID}: worldbook`)

  // 设定与表情包清单都就绪之后再重挂一次：文件里的版本盖过默认底稿，
  // 人格正文也顺带带上表情包约定。
  void Promise.all([ensureLoaded(ctx), ensureStickers(ctx), ensureBackgrounds(ctx), ensureHero(ctx), ensureMemories(ctx), ensureWorldbook(ctx)]).then(() => {
    remountPersona(ctx.systemPrompt)
    remountMemory(ctx.systemPrompt)
    remountWorldbook(ctx.systemPrompt)
    ctx.logger?.info?.(`${PACKAGE_ID}: 表情包 ${stickers.items.length} 张（清单 ${STICKER_FILE}）；欢迎页形象 ${heroAsset.ready === true ? state.hero.image : '未就绪（' + heroAsset.reason + '）'}`)
  })
```

</details>

**依据 12 · 源码核查**：[lib/index.js:1588-1621](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1588-L1621)

prefix路由及state回ok。

<details>
<summary>查看原文（34行）</summary>

```text
  // fenced 状态路由。GET /cyrene/state 读，POST /cyrene/state 写。
  ctx.effect(
    () => ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE_PREFIX,
      handler: async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const route = url.pathname.slice(ROUTE_PREFIX.length) || '/'
        try {
          if (route === '/state' && req.method === 'GET') {
            await Promise.all([ensureLoaded(ctx), ensureHero(ctx)])
            sendJson(res, 200, { ok: true, value: publicState() })
            return
          }
          if (route === '/state' && req.method === 'POST') {
            await ensureLoaded(ctx)
            const body = await readJsonBody(req)
            // 写入必须声明"我读到的是哪一版"：旧版客户端半（或任何不带 rev 的脚本）
            // 一律拒绝，版本对不上就交回最新快照让客户端自己重来。
            if (revRejected(res, body)) return
            const changed = applyPatch(body)
            if (changed) {
              state.rev += 1
              // 换了欢迎页形象就重新解析一次（同一份路径可能只是换了张图）。
              if (body.hero !== undefined) {
                heroPromise = null
                await ensureHero(ctx)
              }
              await persist(ctx)
              // 立刻按新设定重挂 section：从下一轮对话起就是新口吻。
              remountPersona(ctx.systemPrompt)
            }
            noteWrite(body, changed ? 'ok' : 'noop')
            sendJson(res, 200, { ok: true, value: publicState() })
```

</details>

#### 缺口

- 固定Host的认证围栏、fiber异步失活和工具可见范围未运行核验。
  **影响**：不能保证访问控制、卸载后不重挂或所有模型可用工具；本项源码已支持持久化假成功判断。
  **进一步探讨**：固定Host隔离profile做写盘拒绝/双上传/工具缺失/初始化即卸载和同home双profile矩阵。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 比默认UI加提示文件多提供什么，真实采用成本如何分摊？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

可归因增量是把角色外观、可编辑人格、可见记忆CRUD和按需世界书查询放进一个可操作界面，记忆与主题重置分文件处理，减少手工改文件接线。系统提示section、工具执行、槽位/主题服务和模型判断来自DSH；临时文件/rename与关键词检索是常规实现，不以功能数或JSON大小推技术创新。纯工程任务或不想持久角色信息的用户，用默认UI和短提示更简单。

Host硬依赖webServer/systemPrompt，工具服务可选，客户端slots/React等缺失可局部跳过；包Node>=18，无精确DSH peer支持矩阵。README记过桌面0.10.0槽位冲突和自检，属于作者环境证据，本次未独立验收这些宿主版本。素材需完整包/本地可读路径，自传素材需要安装目录写权限；worldbook fetch依赖网络与固定响应结构，离线时已有库可用，首次无库不能生成内容。

首次需备份三个home级文件与custom素材，先只开外观再逐项人格/记忆/世界书，确认共享范围；持续有提示token、模型记忆工具调用、图片/背景、JSON磁盘与wiki更新，未测总费用。人工成本是纠错/遗忘、查漏、升级兼容和验证假成功，不能把“2600字预算”当全插件上下文成本上限；人格/全贴图清单与检索输出另占预算。失败回原始JSON/独立笔记核记忆，退出保留磁盘，删除需明确备份后另做。

业务增量是管理便利与表达体验，仍由同一用户提供模型/本机存储并承担信息正确性，未识别供给、计价、资源池化或服务责任经济结构变化。角色资料与美术素材不因代码MIT自动获得独立商用授权；作者明确非官方同人/非商业使用，不能把其权属说明当本次法律核验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-31](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/package.json#L1-L31)

版本、bundle与Web形态。

<details>
<summary>查看原文（31行）</summary>

```text
{
  "name": "dsh-cyrene-theme",
  "version": "0.4.1",
  "description": "昔涟（Cyrene）主题：粉白渐变毛玻璃 UI + 侧边栏可编辑的人格设定 + 表情包 / 背景图 / 长期记忆 / 世界书管理 | A Cyrene (Honkai: Star Rail) theme for DeepSeek Harness",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
  "files": [
    "lib/*.js",
    "cordis.patch.yml",
    "stickers.json",
    "Background",
    "meme/*.png",
    "meme/*.jpeg",
    "tools/*.mjs",
    "test",
    "README.md",
    "LICENSE"
```

</details>

**依据 2 · 源码核查**：[package.json:50-54](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/package.json#L50-L54)

Node与代码许可证声明。

```text
  "engines": {
    "node": ">=18"
  },
  "license": "MIT"
}
```

**依据 3 · 源码核查**：[lib/index.js:1506-1515](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1506-L1515)

Host硬依赖与section。

<details>
<summary>查看原文（10行）</summary>

```text
export const inject = ['webServer', 'systemPrompt']

export function apply(ctx, config) {
  // 人格 section：名字用本包自己的，绝不使用注册表保留的
  // `deployment:persona-prefix` / `deployment:persona-suffix`。
  ctx.effect(() => {
    remountPersona(ctx.systemPrompt)
    return () => {
      if (disposeSection !== null) {
        try {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:776-800](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L776-L800)

tools可选/注册失败降级。

<details>
<summary>查看原文（25行）</summary>

```text
function registerMemoryTools(ctx) {
  const tools = typeof ctx.get === 'function' ? ctx.get('tools') : undefined
  if (tools === undefined || tools === null || typeof tools.register !== 'function') return null
  const disposers = []
  const textOutput = {
    // 宿主校验的是 value 的整体形状：工具必须返回对象（不能返回裸字符串），
    // 否则调用会报 "value" must be an object。这里宽松到「对象里带 text 就用 text」。
    schema: { type: 'object', properties: { text: { type: 'string' } }, additionalProperties: true },
    render: (_args, value) => [{
      type: 'text',
      text: typeof value === 'string'
        ? value
        : (value !== null && typeof value === 'object' && typeof value.text === 'string')
          ? value.text
          : JSON.stringify(value, null, 2),
    }],
  }
  const register = (definition) => {
    try {
      const dispose = tools.register({ ...definition, output: textOutput })
      if (typeof dispose === 'function') disposers.push(dispose)
    } catch (error) {
      ctx.logger?.warn?.(`${PACKAGE_ID}: 注册工具 ${definition.name} 失败`, error)
    }
  }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:3060-3078](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/client.js#L3060-L3078)

槽位错误局部捕获。

<details>
<summary>查看原文（19行）</summary>

```text
      if (components !== null) {
        // 槽位注册的失败必须留在自己这一层。single 槽不允许同优先级重复注册，抛出去会被
        // 算到「声明这个槽位的宿主入口」头上——在 DSH Desktop 上就是整个客户端入口激活失败、
        // GUI 起不来（issue #1）。所以每处 inject 的回调内部单独兜住，只记一条 warn。
        const safeInject = (name, register) => {
          try {
            ctx.slots.inject(name, () => {
              try {
                return register();
              } catch (error) {
                log("warn", `槽位 ${name} 注册失败，跳过（主题其余部分照常）`, error);
                return () => {};
              }
            });
          } catch (error) {
            log("warn", `槽位 ${name} 注入失败，跳过（主题其余部分照常）`, error);
          }
        };

```

</details>

**依据 6 · 源码核查**：[README.md:407-415](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/README.md#L407-L415)

共存与桌面作者环境边界。

```text
## 与其他皮肤共存

本包的作用域是 `body[data-dsh-cyrene]`，别的皮肤（例如 `maid-atelier` 的 `body[data-dsh-maid-atelier]`）会同时生效。两者都开时 token 会互相竞争（本包选择器多一个属性，同 token 上通常占优），但背景图/装饰仍可能叠加，视觉会乱——建议同一时间只开一个。

不过在这台机器的 desktop profile 里，`maid-atelier` 只是 `node_modules` 里的残留依赖，**并不在 `dsh.profile.bundles` 或任何 patch 里，宿主半的路由也不存在**（`GET /skin-assets/` 返回 404），所以实际上并没有第二个皮肤在跑。想清干净可以：`dsh plugin --profile desktop remove @smalltailqwq/dsh-client-ui-skin-maid-atelier`。

## 已知坑

- **单占位槽（`kind: single`）千万别用默认优先级抢位——会把宿主入口一起带下去。** `conversation.hero.brand.mark` 在 DSH Desktop 0.10.0 上已经被桌面模块 `dsh-desktop-client-ui` 用 `priority 0` 占了（内容就是那条鱼）；本包若也用默认 p0 注册，槽位服务会抛 `single slot "..." already has a registration at priority 0`，而这个错误会被算到**声明这个槽位的宿主入口**头上 → `web boot: 1 entry did not activate` / `Failed to load plugins` → 整个 GUI 起不来（issue #1）。注意本包那层 `try/catch` 兜不住：日志里两行是同时出现的（既有本包的 warn，也有宿主入口 failed）。所以要两件事一起做：① 注册带 `priority: -1` 去盖住宿主（契约：`lowest renders`）；② 把 `try/catch` 放进 `inject` 回调**内部**（回调可能在稍后异步执行，包在外层只挡得住同步那一次）。`test/client.smoke.mjs` 有两条回归断言盯着这两点。
```

**依据 7 · 源码核查**：[README.md:450-457](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/README.md#L450-L457)

素材和代码许可不同。

```text
## 版权与致谢

- **代码**：本仓库的代码（宿主半、客户端半、自检脚本、工具脚本）以 **MIT** 许可发布，见 [`LICENSE`](LICENSE)，可以自由使用、修改、再分发。
- **角色与美术素材**：昔涟（Cyrene）以及《崩坏：星穹铁道》的角色形象、名称与美术素材，版权归**米哈游（miHoYo / HoYoverse）**所有。`meme/`、`Background/` 里的图片，以及界面上出现的角色相关文字，都是本主题的**二次创作 / 同人使用**，不是官方素材发布，也不代表官方立场。
- **非官方**：这是一个爱好者作品，与米哈游、HoYoverse、DeepSeek 及其关联方**没有隶属、合作或背书关系**。主题**免费、非商业**：不售卖、不含付费内容，素材只用于美化本地界面。
- **侵权请联系删除**：如果权利人认为本仓库中任何素材的使用不妥，请在本仓库的 [Issues](https://github.com/berhbro/dsh-cyrene-theme/issues) 里说明，我会在收到通知后**尽快删除相应素材**，必要时连同整个仓库一起下线。
- **致谢**：主题、人格与表情包文案的灵感来自《崩坏：星穹铁道》与昔涟；插槽与样式约定来自 DeepSeek Harness 的插件体系。感谢官方把这些做得足够好看，也感谢把它开放到能被改造的程度。

```

#### 缺口

- 长期准确回忆、上下文干扰、真实偏好与总成本未测。
  **影响**：不能承诺提高工作效率或稳定人格/准确设定。
  **进一步探讨**：固定非敏感偏好与角色问答比较默认提示文件、插件与手工笔记，记错忆/遗漏、token和纠错时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么场景值得试，怎样证伪更可信的记忆方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前观察：单用户已有DSH环境的角色爱好者可在独立DSH_HOME测试副本逐项开功能，先外观，再非敏感人工记忆，再worldbook查询；避免与其他皮肤同时开启。特别先故意让记忆文件不可写，核工具回执与重启是否一致，再判断能否保存真正偏好。若回执假成功、上下文跑偏、跨profile信息混入或图片路径失效，关闭人格/记忆注入并卸载插件，回默认UI和独立笔记；注意仅关记忆注入不禁止工具读写。

更值得验证的方向是记忆提交回执和范围契约：写盘成功后才返回committed，给记录标用户/工作区与来源，区分注入关闭、工具访问关闭和删除；继续沿用现有文件与Host工具而不先上向量库。依据是当前假成功、home共享和开关语义差异；语义检索并不能修复这些问题。最小实验对默认手工笔记、现插件和合同原型做写盘拒绝、300条边界、双profile、off后工具访问、初始化即卸载五种故障，比较错说已保存、跨范围召回和人工恢复。若用户只要可见笔记，不需要模型自动写，则保留人工确认CRUD；若原Host已有同等记忆服务就组合该服务，避免再维护第二份。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:668-683](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L668-L683)

提交回执的缺口依据。

<details>
<summary>查看原文（16行）</summary>

```text
function persistMemories(ctx) {
  const payload = JSON.stringify({
    enabled: memoryStore.enabled,
    rev: memoryStore.rev,
    items: memoryStore.items.map((item) => ({ ...item })),
  }, null, 2)
  memorySaveChain = memorySaveChain.then(async () => {
    const target = memoryPath()
    const temp = `${target}.${process.pid}.tmp`
    await mkdir(dirname(target), { recursive: true })
    await writeFile(temp, payload, 'utf8')
    await rename(temp, target)
  }).catch((error) => {
    ctx?.logger?.warn?.(`${PACKAGE_ID}: 保存记忆失败`, error)
  })
  return memorySaveChain
```

</details>

**依据 2 · 源码核查**：[lib/index.js:744-772](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L744-L772)

容量与查询机制。

<details>
<summary>查看原文（29行）</summary>

```text
function addMemory(text, tags) {
  const clean = cleanMemoryText(text)
  if (clean === '') return null
  const item = {
    id: newMemoryId(),
    text: clean,
    tags: cleanMemoryTags(tags),
    importance: 3,
    created: new Date().toISOString(),
  }
  memoryStore.items.unshift(item)
  if (memoryStore.items.length > MEMORY_LIMIT) memoryStore.items.length = MEMORY_LIMIT
  return item
}

/** 搜索：不区分大小写的子串匹配，命中 text 或 tags 都算；空关键词给最近的一批。 */
function searchMemories(query, limit) {
  const max = Math.min(MEMORY_LIMIT, Math.max(1, Number.isFinite(Number(limit)) ? Math.round(Number(limit)) : MEMORY_TOOL_DEFAULT))
  const needle = typeof query === 'string' ? query.trim().toLowerCase() : ''
  const items = [...memoryStore.items].sort((a, b) => (a.created < b.created ? 1 : -1))
  if (needle === '') return items.slice(0, max)
  return items
    .filter((item) => item.text.toLowerCase().includes(needle)
      || item.tags.some((tag) => tag.toLowerCase().includes(needle)))
    .slice(0, max)
}

/**
 * 把记忆能力交给模型：三个工具（写 / 找 / 忘）。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:801-864](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L801-L864)

工具不受注入开关控制。

<details>
<summary>查看原文（64行）</summary>

```text
  register({
    name: 'cyrene_memory_add',
    description: '往昔涟的长期记忆里存一条。只在真的值得以后还记得时用：用户的偏好、约定、长期事实、踩过的坑。一条只说一件事，不超过 600 字；别存对话过程、别存临时状态、别存能从代码里读到的东西。',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: '要记住的那件事，主语明确、能独立读懂（例如"用户偏好深色主题，屏幕是 2560×1600"）。' },
        tags: { type: 'array', items: { type: 'string' }, description: '可选标签，最多 8 个，用于以后检索（例如 ["偏好","环境"]）。' },
      },
      required: ['text'],
      additionalProperties: false,
    },
    async execute(args) {
      const item = addMemory(args?.text, args?.tags)
      if (item === null) return { ok: false, error: 'nothing-to-remember' }
      memoryStore.rev += 1
      await persistMemories(ctx)
      remountMemory(ctx.systemPrompt)
      return { ok: true, id: item.id, count: memoryStore.items.length }
    },
  })
  register({
    name: 'cyrene_memory_search',
    description: '在昔涟的长期记忆里找旧事（不区分大小写的子串匹配，命中正文或标签都算）。不确定用户以前说过什么、做过什么约定时先用它翻一遍，别凭印象猜。',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '关键词；留空则返回最近记住的几条。' },
        limit: { type: 'integer', description: '最多返回几条（默认 8）。' },
      },
      additionalProperties: false,
    },
    async execute(args) {
      const items = searchMemories(args?.query, args?.limit)
      return {
        total: memoryStore.items.length,
        returned: items.length,
        items: items.map((item) => ({
          id: item.id,
          text: item.text,
          tags: [...item.tags],
          created: item.created,
        })),
      }
    },
  })
  register({
    name: 'cyrene_memory_forget',
    description: '从长期记忆里删掉一条（用 cyrene_memory_search 拿到的 id）。用户说"忘掉这个"、或发现记错了时用。',
    parameters: {
      type: 'object',
      properties: { id: { type: 'string', description: '记忆条目的 id。' } },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(args) {
      const id = typeof args?.id === 'string' ? args.id : ''
      const index = memoryStore.items.findIndex((item) => item.id === id)
      if (index < 0) return { ok: false, error: 'not-found' }
      memoryStore.items.splice(index, 1)
      memoryStore.rev += 1
      await persistMemories(ctx)
      remountMemory(ctx.systemPrompt)
      return { ok: true, count: memoryStore.items.length }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1526-1586](https://github.com/berhbro/dsh-cyrene-theme/blob/47cf4bf307f52906028b422f30568a52c1ef8f87/lib/index.js#L1526-L1586)

卸载故障矩阵依据。

<details>
<summary>查看原文（61行）</summary>

```text
  ctx.effect(() => {
    let disposeTools = null
    void ensureMemories(ctx).then(() => {
      remountMemory(ctx.systemPrompt)
      disposeTools = registerMemoryTools(ctx)
    })
    return () => {
      if (disposeTools !== null) {
        try {
          disposeTools()
        } catch {
          // 交由插件 fiber 回收
        }
        disposeTools = null
      }
      if (disposeMemorySection !== null) {
        try {
          disposeMemorySection()
        } catch {
          // 同上
        }
        disposeMemorySection = null
      }
    }
  }, `${PACKAGE_ID}: memory`)

  // 世界书：数据 + 一行索引 section + 检索工具。资料库不存在就安静地什么都不挂。
  ctx.effect(() => {
    let disposeWorldbookTools = null
    void ensureWorldbook(ctx).then(() => {
      remountWorldbook(ctx.systemPrompt)
      disposeWorldbookTools = registerWorldbookTools(ctx)
    })
    return () => {
      if (disposeWorldbookTools !== null) {
        try {
          disposeWorldbookTools()
        } catch {
          // 交由插件 fiber 回收
        }
        disposeWorldbookTools = null
      }
      if (disposeWorldbookSection !== null) {
        try {
          disposeWorldbookSection()
        } catch {
          // 同上
        }
        disposeWorldbookSection = null
      }
    }
  }, `${PACKAGE_ID}: worldbook`)

  // 设定与表情包清单都就绪之后再重挂一次：文件里的版本盖过默认底稿，
  // 人格正文也顺带带上表情包约定。
  void Promise.all([ensureLoaded(ctx), ensureStickers(ctx), ensureBackgrounds(ctx), ensureHero(ctx), ensureMemories(ctx), ensureWorldbook(ctx)]).then(() => {
    remountPersona(ctx.systemPrompt)
    remountMemory(ctx.systemPrompt)
    remountWorldbook(ctx.systemPrompt)
    ctx.logger?.info?.(`${PACKAGE_ID}: 表情包 ${stickers.items.length} 张（清单 ${STICKER_FILE}）；欢迎页形象 ${heroAsset.ready === true ? state.hero.image : '未就绪（' + heroAsset.reason + '）'}`)
  })
```

</details>

#### 缺口

- 范围/提交回执原型未实现，用户是否需要自动写未知。
  **影响**：新方向不能计已有创新，采用仍需隔离观察。
  **进一步探讨**：先复核Host现成记忆服务和真实错忆案例，再决定原型必要性。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
