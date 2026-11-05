# dsh-auto-memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[f0492ed](https://github.com/AskTheWay/dsh-auto-memory/tree/f0492ede583e2d1406a71bfeba921c51a8fde815)

<!-- BEGIN META -->
[![GitHub ★ 122](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=122&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AskTheWay/dsh-auto-memory) [![npm 30d 9,671](https://img.shields.io/static/v1?label=npm+30d&message=9%2C671&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-memory) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-memory)
<!-- END META -->

> **功能**：将项目和用户记忆写入本地文件并注入索引，可选结束时固化。

> **亮点**：[Q01](#research-q01) 在会话步骤注入工作区索引并提供记忆工具。

> **主要限制**：[Q02](#research-q02) 防护为启发式，固定 API 文件含 NUL，网页权限未覆盖。

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
  - [Q01 · 跨编码会话时怎样复用偏好和项目事实？](#detail-section-11)
  - [Q02 · 存储和提示防护覆盖哪些路径？](#detail-section-12)
  - [Q03 · 怎样知道召回收益超过污染与提示成本？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：编码用户在多个会话中反复提供相同项目背景和偏好。

每次手工重述，或用项目指令文件维护共同事实。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆工具 | 读写少量长期事实 | 本地文件及作用域 |
| 提示注入 | 跨会话带入索引 | 预算和状态过滤 |
| 固化 | 提取候选记忆 | 默认关闭，依赖模型路由 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与本地文件系统 | 核心必需 | 注册工具与持久化 | 实际宿主未验 |
| 模型路由 | 自动固化启用时 | 提取会话候选 | 默认关闭 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 创建独立工作区和无敏感数据的记忆 | 先关闭跨项目用户层 |
| 使用 | 通过工具写入再新建会话 | 检查实际注入 |
| 评估 | 加入冲突和更新场景 | 比对正确率和污染 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 定义范围和测试材料 | 需区分手工与自动 |
| 持续 | 提示和可选模型开销未知 | 审查和清理记录 | 限制注入预算 |
| 失败 | 恢复耗时未知 | 关插件并核对本地文件 | 用原项目指令接续 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨会话复用 | 减少重复输入少量项目事实 | 真实正确率和提示成本 |

> **思考**：[Q02](#research-q02) 防护为启发式，固定 API 文件含 NUL，网页权限未覆盖。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在会话步骤注入工作区索引并提供记忆工具。

[Q02](#research-q02) 文件锁及写入状态已静态核对，网页 API 的固定源有 NUL 未覆盖。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 防护为启发式，固定 API 文件含 NUL，网页权限未覆盖。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只在测试项目验收核心工具和提示，随后对照自动固化。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定工具和存储源码支持核心路径；作者评测未复跑，网页 API 未覆盖。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/tools.ts、src/store.ts、evals/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 src/memory-api.ts 原始 blob 含 NUL，不作行证据。覆盖工具、索引、存储和作者评测文档，未运行目标。
- 下一步：两个项目和用户层对照召回、污染、更新与提示预算。网页 API 待可读版本另验。

**分析版本**

- **仓库**：[AskTheWay/dsh-auto-memory](https://github.com/AskTheWay/dsh-auto-memory)
- **版本号**：1.3.0（[固定提交 f0492ed](https://github.com/AskTheWay/dsh-auto-memory/tree/f0492ede583e2d1406a71bfeba921c51a8fde815)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 比较启用前后的拒答、污染和注入成本。

两个项目和用户层对照召回、污染、更新与提示预算。网页 API 待可读版本另验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1597 | — | — | 14668 |
| .ts | test | 16 | 2415 | 2034 | 239 | — |
| .ts | source | 17 | 4745 | 3539 | 1012 | — |
| .mjs | source | 6 | 844 | 684 | 106 | — |
| .tsx | source | 2 | 1533 | 1333 | 138 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-auto-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-auto-memory/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-auto-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：编码代理能否把少量跨会话事实留在本地并在合适项目召回？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨编码会话时怎样复用偏好和项目事实？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件注册模型记忆工具及动态提示段。当前会话 cwd 决定项目索引，用户层可跨会话，默认启用。自动总结默认关闭，需要模型路由才运行。相对每次手工重述，文件化索引和工具把复用放在宿主流程里，仍需核对跨项目边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:25-55](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/index.ts#L25-L55)

配置默认及作用域。

<details>
<summary>查看原文（31行）</summary>

```text
export const inject = ['tools', 'systemPrompt']

/** 插件配置(schemastery 声明,默认值写在 schema;用户经 profile patch 覆盖,整表替换)。 */
export interface Config {
  /** 注入索引段(含写入指导)的字节预算。 */
  maxBytes: number
  /** 记忆根目录;缺省 $DSH_HOME/memory(跟随 $DSH_HOME > ~/.dsh)。 */
  memoryDir?: string
  /** 是否启用用户级作用域(_user 目录注入所有会话)。 */
  enableUserScope: boolean
  /** P1:会话结束自动总结固化(需要可用模型路由;失败静默不影响会话)。 */
  autoSummarize: boolean
  /** 单次固化最多写入的新记忆数。 */
  autoSummarizeMaxMemories: number
  /** 固化模型调用的输出 token 上限。 */
  autoSummarizeMaxTokens: number
  /** #17 固化价值门槛:候选有效分(importance ?? 类型缺省)低于此值直接丢弃,不落盘。 */
  minImportance: number
  /** P1:软淘汰阈值(天)——超过且从未被读取的记忆在索引重建时从注入索引隐藏(文件保留)。0 禁用。 */
  staleAfterDays: number
}

export const Config: z<Config> = z.object({
  maxBytes: z.number().default(4096),
  memoryDir: z.string(),
  enableUserScope: z.boolean().default(true),
  autoSummarize: z.boolean().default(false),
  autoSummarizeMaxMemories: z.number().default(5),
  autoSummarizeMaxTokens: z.number().default(2048),
  minImportance: z.number().default(4),
  staleAfterDays: z.number().default(0),
```

</details>

**依据 2 · 源码核查**：[src/index.ts:77-99](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/index.ts#L77-L99)

固化和惰性刷新。

<details>
<summary>查看原文（23行）</summary>

```text
  // P1:会话结束自动固化(autoSummarize=false 时 no-op);
  // 同时把会话捕获查询器交给注入侧(#18 相关性截断的词集来源)
  const consolidation = registerConsolidation(ctx, store, {
    autoSummarize: config.autoSummarize,
    autoSummarizeMaxMemories: config.autoSummarizeMaxMemories,
    autoSummarizeMaxTokens: config.autoSummarizeMaxTokens,
    enableUserScope: config.enableUserScope,
    minImportance: config.minImportance,
  })

  // P1:软淘汰的会话启动评估(审查 major 修复):淘汰是索引重建时的惰性评估,
  // 无新写入的仓库永远等不到重建——每个会话首 agent 创建时刷新一次两层索引。
  if (config.staleAfterDays > 0) {
    const refreshed = new Set<string>()
    ctx.on('agent/created', ({ agent }) => {
      const cwd = agent.session.header.cwd
      if (cwd === undefined) return
      if (refreshed.has(agent.session.id)) return
      refreshed.add(agent.session.id)
      void store.refreshIndex('project', cwd)
      if (config.enableUserScope) void store.refreshIndex('user')
    })
    ctx.on('session/disposed', session => { refreshed.delete(session.id) })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:102-120](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/index.ts#L102-L120)

动态提示注入。

<details>
<summary>查看原文（19行）</summary>

```text
  // 唯一注入段:动态 text,每个 step 重组装时按当前 agent 的 cwd 重新求值;
  // 两层均无记忆时返回空串(整段消失,对齐 Claude Code"有记忆才注入")。
  // memory_write/delete 改动 MEMORY.md 后,下一个请求自动带上新索引(无需失效通知)。
  // 注意:0.1.5-rc.2 的 PromptSection 尚无 interpolate 开关(0.1.6-alpha.2 才有),
  // 严格插值下记忆内容含字面 {{ }} 会炸组装 —— 由 renderMemoryIndexText 内部中和;
  // peer 升级到 >=0.1.6 后可改用 interpolate: false 并去掉中和逻辑。
  // 0.9.0:注入经 registerInjectionAudit 包装——注入集合(按会话)变化时追加
  // audit.jsonl(注入审计 #11);返回值即注入文本,审计纯副作用绝不影响注入。
  // 1.3.0(#18):固化 handle 的 getQueryText 传入——注入侧冻结会话词集,
  // 超预算时按相关性截断(词集由 audit 层冻结,KV-safe)
  const audit = registerInjectionAudit(store, config, rootDir, consolidation.getQueryText)
  ctx.systemPrompt.section({
    name: MEMORY_SECTION,
    order: 4000,
    text: context => audit.text(context.agent?.session.header.cwd, context.agent?.session.id),
  })
  ctx.on('session/disposed', session => {
    audit.cleanup(session.id)
    consolidation.cleanup(session.id)
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:62-90](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/tools.ts#L62-L90)

模型工具的用户与项目参数。

<details>
<summary>查看原文（29行）</summary>

```text
        type: 'string', required: true,
        description: 'One-line summary shown in the injected memory index; keep it under ~160 chars',
      },
      type: {
        type: 'string', required: true, enum: ['user', 'feedback', 'project', 'reference'],
        description: 'user=who the user is; feedback=how to work (Why/How to apply); project=ongoing work/goals; reference=external pointers',
      },
      body: {
        type: 'string', required: true,
        description: 'The fact itself, in markdown. Cross-link with [[other-name]]. feedback type: end with **Why:** and **How to apply:** lines',
      },
      title: {
        type: 'string',
        description: 'Optional human-readable heading shown in the index (any language); defaults to name',
      },
      pinned: {
        type: 'boolean',
        description: 'Pin this memory: it sorts first in the index, survives budget truncation, and is never hidden by staleness eviction. Use when the user explicitly says to keep something forever; unpin by passing false',
      },
      disabled: {
        type: 'boolean',
        description: 'Soft-mute: keep the file but exclude it from the injected index (the memory stops reaching the model without being deleted). Use when the user says "stop bringing this up" or similar; unmute by passing false',
      },
      scope: {
        type: 'string', enum: ['project', 'user'],
        description: "project: only this workspace's sessions; user: all sessions of this user. Default: update the layer where this name already exists, else project",
      },
    },
    output: {
```

</details>

#### 缺口

- 实际宿主与跨工作区未运行
  **影响**：不能证明命中正确或隔离无遗漏
  **进一步探讨**：在两个工作区加入同名冲突记忆并比较注入

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 存储和提示防护覆盖哪些路径？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

模型工具通过 store 写本地 Markdown。写入在索引锁内处理重名与状态，再原子写条目及重建索引。注入过滤掉 disputed 和 superseded，脱敏和指令模式只是启发式。固定 src/memory-api.ts 原始 blob 含 NUL，本轮不作行证据，无法核查网页路由的鉴权和状态操作，结论限工具、store 与注入。

#### 证据与依据

**依据 1 · 源码核查**：[src/store.ts:289-305](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/store.ts#L289-L305)

不注入争议和被替换记忆。

<details>
<summary>查看原文（17行）</summary>

```text
 * 天粒度衰减保证当日稳定,不破坏 KV 前缀缓存)→ name 字典序稳定 tiebreak。
 */
export function renderIndexBody(records: MemoryRecord[]): string {
  const now = Date.now()
  // 软停用(#10):不注入但文件保留——与软淘汰同款"隐藏不删除"语义;
  // memory_list 与 memory_read 仍可见/可读,取消停用即恢复注入
  // 可信状态过滤(1.0.0):disputed(争议)与 superseded(被取代)不注入——
  // 与 disabled 同款"隐藏不删除"语义,文件保留、面板可见、可恢复;
  // candidate 照常注入(固化产物零行为破坏,验证引导交给体检榜)
  const visible = records.filter(record =>
    record.disabled !== true
    && record.status !== 'disputed'
    && record.status !== 'superseded')
  const ordered = [...visible].sort((a, b) => {
    const pa = a.pinned === true ? 0 : 1
    const pb = b.pinned === true ? 0 : 1
    if (pa !== pb) return pa - pb
```

</details>

**依据 2 · 源码核查**：[src/store.ts:512-552](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/store.ts#L512-L552)

锁、状态和清洗。

<details>
<summary>查看原文（41行）</summary>

```text
  /**
   * 写入(同名覆盖=更新),并在文件锁内重建该作用域索引。
   * 锁对象是索引文件:同一 workspace 的写/删串行化,跨进程安全;
   * 孤儿锁(Ctrl+C/崩溃残留)自动回收(见 withLockRecovery)。
   */
  async write(record: MemoryWriteInput, scope: MemoryScope, cwd?: string): Promise<MemoryRecord | null> {
    const dir = this.dir(scope, cwd)
    const file = join(dir, `${record.name}.md`)
    // withFileLock 要求父目录已存在,先建目录再取锁
    await fsp.mkdir(dir, { recursive: true, mode: 0o700 })
    let written: MemoryRecord | undefined
    await withLockRecovery(join(dir, INDEX_FILENAME), async () => {
      // 锁内读旧记录拿生命周期基线(created/读取计数跨更新保留)
      const existing = parseMemory(
        await fsp.readFile(file, 'utf8').catch(() => ''),
        scope,
      )
      // onlyIfAbsent(导入桥):同名判定下沉锁内,杜绝锁外快照的 TOCTOU
      // (导入期间并发写入的同名记忆会被覆盖);命中即放弃本次写入,返回 null
      // 固化候选显式带 status(sanitize 恒带 candidate)不允许复活 superseded
      // 文件(审查 major:同名候选 create 路径会覆写 superseded 文件使其重新
      // 注入)——superseded 只能经用户面板 restore 离开
      if (record.onlyIfAbsent === true && existing !== null) return
      // 可信状态与证据链(1.0.0,审查后统一单点语义):
      // - 调用方显式传 status → 按传入值(面板 verify/dispute/restore 是唯一
      //   人工流转入口;固化候选自带 candidate/disputed)
      // - 调用方未传且内容相对 existing **发生变化** → 信任重评:
      //   verified/candidate 降回 candidate(内容变了,旧验证不覆盖新内容);
      //   undefined(用户手写信任态)保持;disputed/superseded 保留(fail-closed)
      //   同时旧 evidence 失效(逐字引用罩不住新内容)
      // - 内容未变(纯 echo 刷新/置顶停用等元数据写) → 原样继承,verified
      //   不被常规流量冲掉(审查 major:复述刷新剥验证)
      // - 注入扫描在 store 单点:body/description 命中指令注入模式 → disputed。
      //   只挂固化路径会被 memory_write 直写绕过(审查 major:guard 整体可绕)
      const pinned = record.pinned ?? existing?.pinned
      const disabled = record.disabled ?? existing?.disabled
      const importance = record.importance ?? existing?.importance
      const title = record.title ?? existing?.title
      // 安全包:所有写入路径统一过脱敏 + 协议标签防护(单点拦截,含 title——
      // title 进索引行即注入内容,绕过即穿透壳/泄密,审查 blocker)
      const description = sanitizeContent(record.description)
```

</details>

**依据 3 · 源码核查**：[src/store.ts:550-569](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/store.ts#L550-L569)

内容变化和指令模式。

<details>
<summary>查看原文（20行）</summary>

```text
      // 安全包:所有写入路径统一过脱敏 + 协议标签防护(单点拦截,含 title——
      // title 进索引行即注入内容,绕过即穿透壳/泄密,审查 blocker)
      const description = sanitizeContent(record.description)
      const body = sanitizeContent(record.body)
      const contentChanged = existing !== null
        && (existing.description !== description || existing.body !== body || existing.type !== record.type)
      // #19 superseded 复活守卫(审查 major):固化候选(sanitize 恒带 status
      // 'candidate')不允许覆写 superseded 文件——create 路径的同名候选会把它
      // 复活重新注入,与谱系语义矛盾。superseded 只能经用户面板显式 restore
      // 离开(显式传其它 status)。放在内容计算后:面板 restore 传 'candidate'
      // 是显式传值(record.status !== undefined),不受此守卫影响——守卫只拦
      // "status === 'candidate' 且内容变化"的固化形态。
      if (existing?.status === 'superseded' && record.status === 'candidate' && contentChanged) return
      let status = record.status ?? existing?.status
      if (record.status === undefined && contentChanged) {
        if (existing?.status === 'verified' || existing?.status === 'candidate') status = 'candidate'
      }
      if (record.status === undefined && (detectDirectivePattern(body) === true || detectDirectivePattern(description) === true)) status = 'disputed'
      // evidence.quote 是自由文本(固化模型提供),与 description/body 同过
      // sanitizeContent 单点清洗;内容变化且调用方未带新证据 → 旧证据失效
```

</details>

**依据 4 · 源码核查**：[src/store.ts:605-611](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/store.ts#L605-L611)

条目写入与索引重建。

```text
        scope,
      }
      written = next
      await writeFileAtomic(file, serializeMemory(next), { mode: 0o600, dirMode: 0o700 })
      await this.rebuildIndex(scope, cwd)
    })
    // onlyIfAbsent 命中(锁内提前 return)时 written 未赋值 → null 表示未写入
```

**依据 5 · 源码核查**：[src/index.ts:65-75](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/index.ts#L65-L75)

可见的连接服务注册调用。

<details>
<summary>查看原文（11行）</summary>

```text
  registerMemoryTools(ctx, store, config.enableUserScope)

  // P2-2:Web 面板 API(宿主半路由)。connection 服务由 web-app 组合提供,
  // 加载顺序晚于本插件——用 inject 回调等待服务就绪再注册(非 web 组合永不回调)。
  // 回调使用框架给的 fiber ctx 注册,依赖消失时路由 effect 随作用域自动回收。
  ctx.inject(['connection'], fiberCtx => {
    registerMemoryApi(fiberCtx, store, rootDir, {
      maxBytes: config.maxBytes,
      staleAfterDays: config.staleAfterDays,
    })
  })
```

</details>

#### 缺口

- 固定 blob src/memory-api.ts 含 NUL，网页 API 内部未覆盖
  **影响**：无法给出网页操作权限、路由安全和运行可用性结论
  **进一步探讨**：待有可读固定版本时单独核对 API 权限和状态变更

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样知道召回收益超过污染与提示成本？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

用测试项目的手工记忆开始，关闭用户层和自动固化，记录同一组任务有无记忆的准确率、拒答、跨项目串扰和提示体积。作者的 L1 为金标直写上界；编码合成任务报告正 lift，但 LongMemEval-S 小样本 overall 23.3%，后者跨会话与时间项均为 0/8，协议也有 judge 差异。若过时或冲突记忆导致错误扩大，保留手工文件。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:47-55](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/src/index.ts#L47-L55)

可配置预算、作用域和自动固化。

```text
export const Config: z<Config> = z.object({
  maxBytes: z.number().default(4096),
  memoryDir: z.string(),
  enableUserScope: z.boolean().default(true),
  autoSummarize: z.boolean().default(false),
  autoSummarizeMaxMemories: z.number().default(5),
  autoSummarizeMaxTokens: z.number().default(2048),
  minImportance: z.number().default(4),
  staleAfterDays: z.number().default(0),
```

**依据 2 · 源码核查**：[evals/README.md:8-18](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/evals/README.md#L8-L18)

不同评测层次及成本。

<details>
<summary>查看原文（11行）</summary>

```text
## 分层

| 层 | 内容 | 依赖 | 状态 |
|---|---|---|---|
| **L0 确定性指标** | 注入预算曲线 / 信噪比 / 淘汰零误杀 / 链接展开边界 | 无(纯计算) | ✅ `l0/`,随 CI 跑 |
| **L1 注入召回** | 合成数据集金标直写 → 逐 probe 注入可达性 | 无 API | ✅ `runners/l1-retrieval.mjs`(mini 与 standard 均 100%,完美固化上界) |
| **L3 固化精度** | recall / precision / 污染率 / 更新正确率(真实 LLM 固化) | `DEEPSEEK_API_KEY`,≈会话数次调用 | ✅ `runners/l3-consolidation.mjs`(结果入 `results/`) |
| **L2 端到端** | 固化 → 注入 → 双组(带/无记忆)探针问答 → 盲判;lift = 记忆净贡献 | `DEEPSEEK_API_KEY`,≈探针数×3 次调用 | ✅ `runners/l2-e2e.mjs`(结果入 `results/`) |
| **L2-LongMemEval** | 行业基准对齐:LongMemEval-S cleaned 子集(30 题分层抽样),官方 5 套 judge 模板 | `DEEPSEEK_API_KEY`,30 题≈1560 次调用 | ✅ `runners/l2-longmemeval.mjs`(结果入 `results/`) |

**数据集**:`datasets/harness-sessions/`(`schema.md` 格式与质量红线;`mini` 手写 3 会话/12 题;`standard` 合成 10 会话/30 题含 6 拒答、4 ephemeral 陷阱、2 updated 推翻)。与 L0 的合成记忆构造器不同,这里的数据是**带金标标签的完整会话剧本**——coding-agent 语境(四类型记忆、双工作区、跨会话引用),LoCoMo/LongMemEval 均不覆盖。
```

</details>

**依据 3 · 源码核查**：[evals/README.md:67-86](https://github.com/AskTheWay/dsh-auto-memory/blob/f0492ede583e2d1406a71bfeba921c51a8fde815/evals/README.md#L67-L86)

作者结果和基准限制。

<details>
<summary>查看原文（20行）</summary>

```text
## L2 结果(2026-10-25,deepseek-chat)

### 端到端双组对比(harness-sessions)

| 数据集 | with 记忆 | baseline(无记忆) | **lift(净贡献)** | 拒答(with/without) |
|---|---|---|---|---|
| mini(3 会话/12 题) | 100% | 33.3% | **+66.7%** | 100% / 100% |
| standard(10 会话/30 题) | 95.8% | 16.7% | **+79.2%** | 83.3% / 100% |

baseline 的正确题几乎全是通用知识可蒙对的(psycopg2 常见坑/中文偏好);项目特定事实(压测预热/夜猫子时间/部署目标)无记忆时全错——lift 即记忆系统的净贡献。

### LongMemEval-S 30 题分层抽样(接入官方协议的第一跑)

Task-averaged **33.9%** / Overall **23.3%** / Abstention **100%**(分项:ss-user 1/1,multi-session 0/8,temporal 0/8,knowledge-update 1/5,ss-assistant 1/3,ss-pref 1/2)。

**低分是实测发现而非事故**——根因与本插件的设计边界完全一致:

1. **场景错配**:LongMemEval 是"122k token 闲聊海捞针"(每题 ~50 会话),本插件的固化管线为编码会话的 durable 事实设计,在闲聊海上产出 ~109 条低价值记忆/题,4KB 预算只放 top 30 行,目标事实被挤出注入——**预算纪律在错误场景下就是错的**;
2. **证据碎片化**:答案事实散在多会话,每会话独立固化导致碎片化,无跨会话合并;
3. judge=deepseek-chat(官方 gpt-4o-2024-08-06),与官方数字不可比。
```

</details>

#### 缺口

- 作者评测未独立重跑
  **影响**：真实项目正确率和新增调用成本未知
  **进一步探讨**：做盲评并单列拒答、冲突更新、污染与提示预算

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
