# harness-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9808ab7](https://github.com/988hj7tczd-oss/harness-desktop/tree/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/harness-desktop) [![npm 30d 187](https://img.shields.io/static/v1?label=npm+30d&message=187&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/harness-memory) [![最新发布 2026-04-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-04-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/harness-memory)
<!-- END META -->

> **功能**：通过 DSH 存储域保存、删除长期记忆，并按标签注入后续会话系统提示。

> **亮点**：相比每次复制个人偏好，增量是宿主存储域与系统提示的轻量闭环；采用全表近期选择而非检索，适合少量资料，不应归为语义记忆系统。[Q01](#research-q01)

> **主要限制**：表记录没有项目字段，注入函数也没有会话过滤，project标签只负责显示分类；多项目混用可能交叉污染。按文本完全相等去重不能处理改写、矛盾和过期事实。[Q03](#research-q03)

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
  - [Q01 · 轻量长期偏好闭环相对手动上下文的价值是什么？](#detail-section-11)
  - [Q02 · 保存、召回和删除如何组成闭环？](#detail-section-12)
  - [Q03 · project分类是否隔离项目并解决矛盾？](#detail-section-13)
  - [Q04 · 少量偏好什么时候比AGENTS更划算？](#detail-section-14)
  - [Q05 · 作用域与失效时间能否减少错误召回？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向单用户持续使用DSH、需要跨会话保留偏好和约定的人；合格结果是准确、可删的少量长期记忆，而非自动知识库检索。

项目AGENTS文件或人工粘贴提供可审阅偏好，但跨会话更新需自己维护；复杂向量记忆增加检索与服务负担，本组件选择轻量全表近期策略。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| memory_save | 保存偏好和约定 | 完整文本去重，不做矛盾合并 |
| memory_forget | 按id或全文删除 | 需知道精确对象 |
| 近期记忆注入 | 跨会话提供上下文 | 默认50条，无项目过滤或语义检索 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| storageDomain、systemPrompt、tools | 必需 | 存储、注入与操作 | 缺服务不加载；表未就绪工具报错 |
| 有边界的长期信息 | 效果必需 | 避免误注入 | 矛盾/敏感记录需用户复核 |
| 单一或隔离项目使用环境 | 建议条件 | 缩小混用风险 | project标签不提供隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 加载组件并等存储域就绪 | 保存工具不报未就绪 |
| 2 | 让Agent保存一条明确偏好与标签 | 新会话能看到相应注入 |
| 3 | 修改约定先查旧记录并删除 | 不靠重存改写自动去除矛盾 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储，金额未知 | 整理可信偏好 | 需验证域隔离 |
| 持续使用 | 每次提示携带近期记忆的token | 纠正矛盾与过期文本 | maxMemories限条数不限制字符 |
| 失败恢复 | 存储排查与上下文重建 | 按完整文本删除错误记录 | 无自动语义合并/冲突治理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨会话召回 | 每次systemPrompt读取表 | 模型遵循率和任务质量 |
| 简单管理 | 保存/删除与完全文本去重 | 多项目隔离和矛盾纠正质量 |

> **思考**：表记录没有项目字段，注入函数也没有会话过滤，project标签只负责显示分类；多项目混用可能交叉污染。按文本完全相等去重不能处理改写、矛盾和过期事实。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相比每次复制个人偏好，增量是宿主存储域与系统提示的轻量闭环；采用全表近期选择而非检索，适合少量资料，不应归为语义记忆系统。[Q01](#research-q01)

依托宿主domain存储避免额外数据库服务，失败就绪状态明确，生命周期关闭句柄。实现短且易移植，但全表排序、无文本长度预算、无作用域和版本修订机制限制规模。可借鉴小型配置记忆闭环，不能直接复用成多租户知识库。

<a id="detail-section-5"></a>

### 1.4 主要限制

表记录没有项目字段，注入函数也没有会话过滤，project标签只负责显示分类；多项目混用可能交叉污染。按文本完全相等去重不能处理改写、矛盾和过期事实。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可在单项目或隔离profile保存少量非敏感偏好试用。不要依赖project标签隔离信息，约定变更时手工删除旧文本并检查新会话提示。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、plugins/harness-memory/index.js、plugins/harness-memory/package.json 及固定范围 inventory；组件：plugins/harness-memory。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读取该组件218行Host实现及manifest；未验证存储域后端隔离或真实模型遵循。
- 下一步：在隔离域用两个项目保存相互冲突约定，检查各自提示与删除行为；再比较人工AGENTS文件的正确引用与token，未执行。

**分析版本**

- **仓库**：[988hj7tczd-oss/harness-desktop](https://github.com/988hj7tczd-oss/harness-desktop)
- **版本号**：0.1.0（[固定提交 9808ab7](https://github.com/988hj7tczd-oss/harness-desktop/tree/9808ab77392c7cd285f87de094daff1fcd322109)）
- **版本日期**：2026-08-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是增加workspace作用域和显式失效时间，在召回前过滤，减少跨项目误用；用同名不同约定的项目对照错误引用率和人工维护时间，无改善则否定。[Q05](#research-q05)

在隔离域用两个项目保存相互冲突约定，检查各自提示与删除行为；再比较人工AGENTS文件的正确引用与token，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 218 | 172 | 32 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/harness-desktop/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：988hj7tczd-oss/harness-desktop 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 轻量长期偏好闭环相对手动上下文的价值是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者定义的目标是保存偏好、项目约定与成功做法。以少量可信资料为范围，存储表加系统提示能避免每次复制。这不是语义检索，renderMemories只按updatedAt排序截取最近条目，分类只决定显示块。因此贡献成立于小型人工可管记忆，不成立于自动知识库、项目事实发现或高覆盖历史搜索。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/harness-memory/index.js:1-9](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L1-L9)

组件职责。

```text
/**
 * harness-memory —— dsh 记忆插件（dsh-memory）。
 *
 * 职责：
 *  - 用 ctx.storage 的 domain 能力持久化记忆（表：memories）
 *  - 注册 system-prompt section，把已保存的记忆注入模型上下文（跨会话召回）
 *  - 提供 memory.save / memory.forget 工具，让 agent 在对话中自行存取记忆
 *
 * 加载方式：作为 dsh bundle（声明 dsh.bundle.patch）安装进 profile。
```

**依据 2 · 源码核查**：[plugins/harness-memory/index.js:62-85](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L62-L85)

近期排序和分类注入决定范围。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * 生成系统提示中的记忆段落（按分类分组注入）。
 * @param table - 记忆表。
 * @param maxMemories - 最多展示条数。
 */
function renderMemories(table, maxMemories) {
  const entries = [...table.entries()].sort((a, b) => b[1].updatedAt - a[1].updatedAt)
  const recent = entries.slice(0, maxMemories)
  if (recent.length === 0) return ''
  const groups = new Map()
  for (const [, m] of recent) {
    const cat = categoryOf(m.tags)
    const key = cat ? cat.key : 'other'
    if (!groups.has(key)) groups.set(key, { label: cat ? cat.label : '其他', items: [] })
    groups.get(key).items.push(m)
  }
  const blocks = []
  for (const [key, g] of groups) {
    if (g.items.length === 0) continue
    const lines = g.items.map((m) => `- ${m.text}`)
    blocks.push(`【${g.label}】\n${lines.join('\n')}`)
  }
  if (blocks.length === 0) return ''
  return `以下是用户保存的长期记忆，供你在后续对话中随时引用（跨会话生效）：\n\n${blocks.join('\n\n')}`
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 保存、召回和删除如何组成闭环？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply异步打开domain，table未就绪时提示为空、工具报错；成功后每次systemPrompt组装重新读表。save将文本trim，并只用完全相同文本查重，更新标签和时间；新文本生成随机id。forget优先id，否则完整文本定位后删除。生命周期最终关闭domain句柄。必要服务写在inject中，不能因没有额外数据库就推断任意宿主都可用。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/harness-memory/index.js:93-121](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L93-L121)

打开、关闭和提示section。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx, config) {
  // 打开记忆域（生命周期由本插件的 effect 管理）
  const domainHandlePromise = ctx.storageDomain.open(MemoryDomain)
  let table = null

  ctx.effect(() => {
    domainHandlePromise
      .then((domain) => {
        table = domain.table('memories')
      })
      .catch((err) => {
        ctx.logger?.error(`harness-memory: 打开存储域失败: ${err?.message ?? err}`)
      })
    return () => {
      domainHandlePromise
        .then((domain) => domain.close())
        .catch(() => undefined)
    }
  })

  // system-prompt section：注入记忆（函数形式，每次组装时求值）
  ctx.systemPrompt.section({
    name: 'memory:recall',
    order: config.sectionOrder,
    text: () => {
      if (!table) return ''
      return renderMemories(table, config.maxMemories)
    },
  })
```

</details>

**依据 2 · 源码核查**：[plugins/harness-memory/index.js:157-170](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L157-L170)

完整文本去重写入。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args) {
      if (!table) throw new Error('memory_save: 记忆存储尚未就绪')
      const text = String(args.text).trim()
      if (!text) throw new Error('memory_save: 内容不能为空')
      const now = Date.now()
      const tags = Array.isArray(args.tags) ? args.tags.map((t) => String(t)) : []
      const existing = [...table.entries()].find(([, m]) => m.text === text)
      if (existing) {
        await table.put(existing[0], { ...existing[1], tags, updatedAt: now })
      } else {
        const id = `mem-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`
        await table.put(id, { id, text, tags, createdAt: now, updatedAt: now })
      }
      return { saved: true, total: table.size }
```

</details>

**依据 3 · 源码核查**：[plugins/harness-memory/index.js:204-214](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L204-L214)

删除优先级。

<details>
<summary>查看原文（11行）</summary>

```text
    async execute(args) {
      if (!table) throw new Error('memory_forget: 记忆存储尚未就绪')
      let removed = false
      if (args.id) {
        removed = await table.delete(String(args.id))
      } else if (args.text) {
        const entry = [...table.entries()].find(([, m]) => m.text === String(args.text).trim())
        if (entry) removed = await table.delete(entry[0])
      }
      return { removed, total: table.size }
    },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · project分类是否隔离项目并解决矛盾？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

没有。schema仅含id、text、tags和时间；renderMemories不接收会话或cwd，project标签只是显示分组。这支持多项目混用风险的源码判断，但本轮未运行后端，不能断言不同profile实际共库。完全文本查重也会保留“使用A”和“改用B”两条矛盾，用户需显式删除。代码短有利维护，缺少语义合并却让正确性责任留在用户。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/harness-memory/index.js:30-59](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L30-L59)

字段和分类没有项目作用域。

<details>
<summary>查看原文（30行）</summary>

```text
/** 记忆记录 schema。 */
const memorySchema = zod.object({
  id: zod.string(),
  text: zod.string(),
  tags: zod.array(zod.string()).default([]),
  createdAt: zod.number(),
  updatedAt: zod.number(),
})

/** 记忆域的声明。 */
const MemoryDomain = defineDomain({
  name: 'harness_memory',
  version: 1,
  tables: {
    memories: domainTable(memorySchema),
  },
})

/** 记忆分类组（按 tag 归类，让 agent 明确区分偏好/约定/做法）。 */
const CATEGORIES = [
  { key: 'preference', label: '用户偏好', match: ['preference', '偏好'] },
  { key: 'project', label: '项目约定', match: ['project', '约定'] },
  { key: 'practice', label: '成功做法', match: ['practice', '做法'] },
]

function categoryOf(tags) {
  for (const c of CATEGORIES) {
    if (tags.some((t) => c.match.includes(String(t).toLowerCase()))) return c
  }
  return null
```

</details>

**依据 2 · 源码核查**：[plugins/harness-memory/index.js:67-85](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L67-L85)

召回无会话过滤。

<details>
<summary>查看原文（19行）</summary>

```text
function renderMemories(table, maxMemories) {
  const entries = [...table.entries()].sort((a, b) => b[1].updatedAt - a[1].updatedAt)
  const recent = entries.slice(0, maxMemories)
  if (recent.length === 0) return ''
  const groups = new Map()
  for (const [, m] of recent) {
    const cat = categoryOf(m.tags)
    const key = cat ? cat.key : 'other'
    if (!groups.has(key)) groups.set(key, { label: cat ? cat.label : '其他', items: [] })
    groups.get(key).items.push(m)
  }
  const blocks = []
  for (const [key, g] of groups) {
    if (g.items.length === 0) continue
    const lines = g.items.map((m) => `- ${m.text}`)
    blocks.push(`【${g.label}】\n${lines.join('\n')}`)
  }
  if (blocks.length === 0) return ''
  return `以下是用户保存的长期记忆，供你在后续对话中随时引用（跨会话生效）：\n\n${blocks.join('\n\n')}`
```

</details>

**依据 3 · 源码核查**：[plugins/harness-memory/index.js:159-168](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L159-L168)

文本相等不等于事实去重。

<details>
<summary>查看原文（10行）</summary>

```text
      const text = String(args.text).trim()
      if (!text) throw new Error('memory_save: 内容不能为空')
      const now = Date.now()
      const tags = Array.isArray(args.tags) ? args.tags.map((t) => String(t)) : []
      const existing = [...table.entries()].find(([, m]) => m.text === text)
      if (existing) {
        await table.put(existing[0], { ...existing[1], tags, updatedAt: now })
      } else {
        const id = `mem-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`
        await table.put(id, { id, text, tags, createdAt: now, updatedAt: now })
```

</details>

#### 缺口

- 存储domain的profile隔离和真实错误引用未测
  **影响**：约束多项目采用范围
  **进一步探讨**：用两个冲突项目核对提示来源与profile间表数据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 少量偏好什么时候比AGENTS更划算？

**研究主题**：效果与总成本、采用判断

#### 完整回答

频繁重复个人偏好且愿意维护的人可试用，固定项目规范已有AGENTS时未必需要多一层状态。每次注入近期条目增加提示token；maxMemories默认50只限制条数，长文本仍可能扩大开销。出错时需按id或全文删除，未提供语义冲突治理。采用验收应关注正确引用和过期事实清除，而不是成功保存的条目数量。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/harness-memory/index.js:23-27](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L23-L27)

条数限制配置。

```text
export const Config = z.object({
  /** 最多注入多少条记忆到系统提示。 */
  maxMemories: z.number().default(50),
  /** system-prompt section 的排序位置（越小越靠前）。 */
  sectionOrder: z.number().default(150),
```

**依据 2 · 源码核查**：[plugins/harness-memory/index.js:174-185](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L174-L185)

删除需要明确对象。

<details>
<summary>查看原文（12行）</summary>

```text
  // 工具：删除一条记忆
  ctx.tools.register(defineTool({
    name: 'memory_forget',
    description: '删除一条已保存的长期记忆（必须提供记忆 id 或完整内容文本）。',
    parameters: {
      id: {
        type: 'string',
        description: '要删除的记忆 id（可从系统提示中的记忆列表获得）。',
      },
      text: {
        type: 'string',
        description: '或提供完整内容文本来删除。',
```

</details>

#### 缺口

- token、正确引用率和人工清理时间未知
  **影响**：不能量化减少重复输入后的净收益
  **进一步探讨**：以相同偏好集对照人工文件和插件的总token及错误。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 作用域与失效时间能否减少错误召回？

**研究主题**：新假设与验证

#### 完整回答

未验证假设从缺少项目字段和近期排序推导。新记录加入workspace作用域、适用类型和可选到期时间，在召回前过滤；全局偏好仍需显式声明，不能默认跨项目共享。最小实验用同名但冲突的项目规则观察误用和维护时间；若用户维护作用域更易出错，或实际任务正确性没有改善，就不应默认增加复杂度。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/harness-memory/index.js:30-45](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L30-L45)

当前schema是新增作用域的参照。

<details>
<summary>查看原文（16行）</summary>

```text
/** 记忆记录 schema。 */
const memorySchema = zod.object({
  id: zod.string(),
  text: zod.string(),
  tags: zod.array(zod.string()).default([]),
  createdAt: zod.number(),
  updatedAt: zod.number(),
})

/** 记忆域的声明。 */
const MemoryDomain = defineDomain({
  name: 'harness_memory',
  version: 1,
  tables: {
    memories: domainTable(memorySchema),
  },
```

</details>

**依据 2 · 源码核查**：[plugins/harness-memory/index.js:67-85](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js#L67-L85)

过滤需在召回前生效。

<details>
<summary>查看原文（19行）</summary>

```text
function renderMemories(table, maxMemories) {
  const entries = [...table.entries()].sort((a, b) => b[1].updatedAt - a[1].updatedAt)
  const recent = entries.slice(0, maxMemories)
  if (recent.length === 0) return ''
  const groups = new Map()
  for (const [, m] of recent) {
    const cat = categoryOf(m.tags)
    const key = cat ? cat.key : 'other'
    if (!groups.has(key)) groups.set(key, { label: cat ? cat.label : '其他', items: [] })
    groups.get(key).items.push(m)
  }
  const blocks = []
  for (const [key, g] of groups) {
    if (g.items.length === 0) continue
    const lines = g.items.map((m) => `- ${m.text}`)
    blocks.push(`【${g.label}】\n${lines.join('\n')}`)
  }
  if (blocks.length === 0) return ''
  return `以下是用户保存的长期记忆，供你在后续对话中随时引用（跨会话生效）：\n\n${blocks.join('\n\n')}`
```

</details>

#### 缺口

- 新字段及收益未实现验证
  **影响**：不能视为当前项目隔离能力
  **进一步探讨**：原型对照冲突资料集与实际提示。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
