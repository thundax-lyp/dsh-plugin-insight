# MemSearch DSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[926ba5b](https://github.com/zilliztech/memsearch/tree/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh)

<!-- BEGIN META -->
[![GitHub ★ 2,797](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C797&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch) [![npm 30d 3,358](https://img.shields.io/static/v1?label=npm+30d&message=3%2C358&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh)
<!-- END META -->

> **功能**：为DSH接入共享Markdown记忆、会话摘要、检索注入、记忆Skill及候选评审面板。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的增量是把DSH事件转换成跨Agent共同Markdown与原会话锚点，并通过原生Skill和pre-step候选注入减去手工复制环节。检索算法来自外部MemSearch核心，适配器贡献是数据和流程接线。候选评审与主动安装分开，但不是强制审批门禁。

> **主要限制**：[Q03](#research-q03)显示摘要失败写入unavailable占位后仍带捕获锚点，事件重放先按锚点去重而不会重新摘要。幂等只能保证这一条记录不重复，不能保证里面已有可用知识；原会话可追溯也不等于已自动恢复。该源码限制尚未运行复现，试用应检查占位而非只检查日记存在。

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
  - [Q01 · 跨Agent记忆适配器改变什么任务，边界是什么？](#detail-section-11)
  - [Q02 · 检索注入与异步写入如何围绕同一项目接线？](#detail-section-12)
  - [Q03 · 失败摘要写入锚点后，事件重放能否补齐知识？](#detail-section-13)
  - [Q04 · 用户全周期需要维护什么，退出后留下什么？](#detail-section-14)
  - [Q05 · Skill评审与安装是否是强制审批门禁？](#detail-section-15)
  - [Q06 · 把捕获成功与失败占位分开，是否更适合可靠记忆积累？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：它面向在同一项目中交替使用DSH和其他编码Agent、需要找回既有决策的开发者。合格交付是从历史中找出正确的项目决策并能下钻到原会话，而非仅搜索到相似文字。DSH组件将完成轮次摘要成共享Markdown，借助外部MemSearch CLI索引和检索，再把候选接到DSH模型步骤；Python检索核心和Milvus能力属于其依赖，不算DSH适配器独创。

人工维护项目笔记，用文本搜索并复制约束；比较同一组决策查回的正确性、人工时间和恢复负担，不作其他插件效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话捕获 | 摘要写日记并索引 | 失败写占位，锚点去重不重试失败摘要 |
| pre-step注入 | 将候选历史送入首步 | 需已有记忆、CLI与索引，有候选才注入 |
| memory-recall | 搜索、展开、下钻原会话 | 原日志必须仍可达 |
| memory-config | 引导诊断配置 | 是Skill指导，操作需相应CLI能力 |
| memory-to-skill | 组织候选提炼及安装 | 维护默认关闭，不自动安装 |
| web评审面板 | 查看候选、排队评审或安装 | 依赖认证，review不是install前置门禁 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH及Node>=22.19 | 是 | profile、事件与Skill接口 | 需固定实际版本验收 |
| MemSearch CLI及Python | 是 | 检索、配置、摘要助手 | 显式无效命令报告错误 |
| embedding及Milvus配置 | 检索需要 | 共享日记影子索引 | 文件存在不等于可查 |
| DSH headless或custom-llm | 默认摘要需要 | 生成日记摘要 | 失败写占位，无自动切换后端 |
| webServer及connection | 面板需要 | 认证后的候选查看和安装 | 无认证服务返回503，headless无面板 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定宿主、CLI与包，检查命令和项目目录 | 独立项目可恢复，范围清晰 |
| 2 | 用户配置摘要路由并加载bundle | Skill入口可见不等于摘要成功 |
| 3 | 完成少量任务后检查日记与原日志锚点 | 若是unavailable先修复，不只看文件存在 |
| 4 | 发起历史问题并核对原事实 | 错误召回回退手工笔记 |
| 5 | 人检查候选再主动安装 | 核对目标文件与实际加载，不以started放行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Python/CLI、embedding及Milvus；金额未知 | profile、命令与索引配置，耗时未知 | 多运行时，headless另需DSH CLI |
| 持续使用 | 摘要模型与索引计算，费用未知 | 检查日记保真、候选和项目范围 | auto模式可启动headless，不表示零成本 |
| 失败恢复 | 重试摘要与索引可能重复计费 | 查unavailable、原会话、补摘要 | 锚点去重不自动修复失败摘要 |
| 退出 | 保留日记、索引与已安装Skill | 移除profile依赖，另清点Skill目标 | 不自动删除历史，耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 共享记忆 | 同格式日记和锚点、项目collection | 跨Agent实际目录对齐与召回质量 |
| 候选注入 | 有chunks才追加历史 | 相似chunks是否正确，15秒预算内实际体验 |
| 摘要恢复 | 失败写明确占位和原日志锚点 | 事件重放不补失败摘要，人工成本未知 |
| Skill安装 | 人主动触发后台安装 | started不等于完成或强制审核通过 |

> **思考**：[Q03](#research-q03)显示摘要失败写入unavailable占位后仍带捕获锚点，事件重放先按锚点去重而不会重新摘要。幂等只能保证这一条记录不重复，不能保证里面已有可用知识；原会话可追溯也不等于已自动恢复。该源码限制尚未运行复现，试用应检查占位而非只检查日记存在。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的增量是把DSH事件转换成跨Agent共同Markdown与原会话锚点，并通过原生Skill和pre-step候选注入减去手工复制环节。检索算法来自外部MemSearch核心，适配器贡献是数据和流程接线。候选评审与主动安装分开，但不是强制审批门禁。

不是。review动作把来源标记消息排入活跃Agent的next-turn inbox；install动作独立启动memsearch skills install并立即返回started。代码没有要求该候选先通过review，也没有把后台进程完成等同HTTP成功。用户可以主动安装，但“有评审面板”不代表存在强制安全放行或已完成验收。

路由在每次请求解析connection.requestRejection，复用宿主的认证与Host/Origin策略，认证服务不可用时返回503。这一设计优于直接开放写入接口，但不证明候选内容可信，也不代替安装后检查。默认安装目标可落在~/.agents/skills，由filesystem provider加载；这会扩大到当前聊天以外的环境。

可借鉴处是把候选生成与人主动安装分开、保持原会话来源和明确的下一轮评审队列。移植仍要管理认证、候选路径、安装目标与命令完成状态。当前index承载检索、写入、摘要、路由及维护多种职责，读者不能由纯ESM免构建推断维护成本低；本轮未执行测试或热重载，因此不宣称生命周期完全可靠。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)显示摘要失败写入unavailable占位后仍带捕获锚点，事件重放先按锚点去重而不会重新摘要。幂等只能保证这一条记录不重复，不能保证里面已有可用知识；原会话可追溯也不等于已自动恢复。该源码限制尚未运行复现，试用应检查占位而非只检查日记存在。

<a id="detail-section-6"></a>

### 1.5 使用建议

采用结论为有界试用。已有Python/MemSearch环境、允许项目日记持久化的DSH用户，可先测试少量跨会话决策查回；相对手工笔记多了自动摘要和下钻，但仍需检查失败占位。摘要失败长期不修复、跨项目串数据或安装状态无法确认时停止，禁用capture/inject并回到手工笔记，独立清点已安装Skill。 见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持DSH接线、共享锚点和候选评审流程；摘要失败占位的自动恢复存在明确路径限制，效果与宿主兼容未运行验证。

- 已检查：作者 README、包清单、源码路径 plugins/dsh/README.md、plugins/dsh/package.json、plugins/dsh/index.js、plugins/dsh/runtime.js、plugins/dsh/client.js 及固定范围 inventory；组件：plugins/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查plugins/dsh组件；根Python核心属于外部运行依赖，本轮未执行插件、测试、模型或宿主。静态能力不代表运行验收。
- 下一步：后续以隔离项目检查同版本安装、摘要失败后恢复、跨项目隔离、候选安装完成及退出，再记录同模型任务的正确率、费用和人工时间。

**分析版本**

- **仓库**：[zilliztech/memsearch](https://github.com/zilliztech/memsearch)
- **版本号**：0.1.7（[固定提交 926ba5b](https://github.com/zilliztech/memsearch/tree/926ba5b7c3d53ae0f424fba9029c29e88718b687)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)推导未验证的分状态捕获方案。保留原会话锚点，单列摘要失败/完成，并允许原位重试与索引更新；用摘要超时、退出和索引故障对照人工笔记。若出现重复、旧内容或人工时间未减少则停止，新增并发和版本维护成本必须计入。

后续以隔离项目检查同版本安装、摘要失败后恢复、跨项目隔离、候选安装完成及退出，再记录同模型任务的正确率、费用和人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 2312 | 1741 | 451 | — |
| .md | source | 14 | 1221 | — | — | 7677 |
| .js | test | 4 | 1816 | 1653 | 72 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/zilliztech/memsearch/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：MemSearch DSH适配如何形成共享且可追溯的项目记忆，摘要失败后能否恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨Agent记忆适配器改变什么任务，边界是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向在同一项目中交替使用DSH和其他编码Agent、需要找回既有决策的开发者。合格交付是从历史中找出正确的项目决策并能下钻到原会话，而非仅搜索到相似文字。DSH组件将完成轮次摘要成共享Markdown，借助外部MemSearch CLI索引和检索，再把候选接到DSH模型步骤；Python检索核心和Milvus能力属于其依赖，不算DSH适配器独创。

简单基线是人工维护项目笔记并用文本搜索。适配器的增量是自动捕获、保持跨Agent共同锚点格式，并把search→expand→transcript下钻写成可调用Skill。相比每次整理笔记减少主动记录步骤，但摘要可能遗漏约束，跨Agent存储约定也不保证同一物理目录、路径或模型下的实际共享。实际节时与正确率没有独立对照，不能把“zero effort”作者描述当采用结论。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:3-12](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/README.md#L3-L12)

作者给出共享存储、捕获、注入和下钻范围。

<details>
<summary>查看原文（10行）</summary>

````text
MemSearch plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH).
It gives DSH persistent, cross-agent memory on the same `.memsearch/memory/`
markdown store used by the Claude Code, Codex, OpenClaw, and OpenCode plugins,
backed by a Milvus hybrid search index.

```
capture  ── session/event turn/end ──> summarize (dsh-headless agent default, or custom-llm) ──> memory/YYYY-MM-DD.md
inject   ── agent/pre-step step 1  ──> memsearch search ──> returned chunks injected (zero cost otherwise)
recall   ── ctx.skills.register(memory-recall) ──> search → expand → transcript
review   ── web UI dock panel ──> GET/POST /memsearch-dsh/* ──> list candidates / queue review / install
````

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1114-1125](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L1114-L1125)

原生Skill注册允许用户与模型调用。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.skills.register({
    name: 'memory-recall',
    description:
      'Search memsearch persistent memory for context relevant to the user\'s question. ' +
      'Use when the question could benefit from past sessions, decisions, or work in this project.',
    whenToUse:
      'The user references past work, asks what was done before, or the task could reuse ' +
      'earlier context. Cheap to check; costs one index search.',
    content,
    source: 'runtime',
    invocation: { modelInvocable: true, userInvocable: true },
  })
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/index.js:873-884](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L873-L884)

共享日记格式和原会话锚点实际写入。

<details>
<summary>查看原文（12行）</summary>

```text
/** Append a captured turn to the daily memory file (shared 4-platform format). */
function writeCapture(memoryDir, body, sessionId, turn, dbPath) {
  mkdirSync(memoryDir, { recursive: true })
  const today = todayStr()
  const hhmm = hhmmStr()
  const file = join(memoryDir, `${today}.md`)
  if (!existsSync(file)) {
    writeFileSync(file, `# ${today}\n\n## Session ${hhmm}\n\n`, 'utf-8')
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} db:${dbPath} -->\n`
  const entry = `### ${hhmm}\n${anchor}${body}\n\n`
  appendFileSync(file, entry, 'utf-8')
```

</details>

#### 缺口

- 同一项目跨Agent召回正确率及实际用户重复需求未知
  **影响**：不能证明自动捕获优于少量手工笔记
  **进一步探讨**：固定历史、模型和问题，对比人工笔记与自动摘要下钻的正确事实和人工时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 检索注入与异步写入如何围绕同一项目接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口依赖agents、skills与sessionPersistence，完成前先执行next()，拒绝和非第一步直接返回。它取接受消息中第一个非空文本，长度至少三字且项目已有记忆文件时，按会话cwd推导目录和collection，运行外部CLI查询，只有有chunks才创建来源标记的历史消息。SEARCH_TIMEOUT_MS为15000，不能套用其他记忆组件的三秒界限。无命中不加上下文并不等于没有进程、索引或模型成本。

写入方向在turn/end进入一个Promise链，先渲染该会话轮次再去重，默认摘要成功写入日记，随后异步索引。collection由物理项目路径加哈希派生，防同名项目碰撞；显式MEMSEARCH_DIR可以改变默认范围，用户需要有意管理共享边界。后台串行避免同一实例摘要并发，但链是进程内状态，源码不等于持久任务队列。

默认摘要auto读取MemSearch配置，未配置provider时启动DSH headless。MEMSEARCH_DSH_SUMMARIZE=1使该子进程中的插件保持不活动，避免摘要递归捕获。它使用部署的默认模型，不应误以为插件中的provider/model字段自动控制headless。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:58-69](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L58-L69)

服务依赖和15秒查询预算。

<details>
<summary>查看原文（12行）</summary>

```text
/** Services this plugin needs before `apply()` runs. */
export const inject = ['agents', 'skills', 'sessionPersistence']

const DEFAULT_AGENT_NAME = 'DeepSeek Harness'
const MEMSEARCH_MARKER = '[memsearch] Retrieved memory context attached.'
const SEARCH_TOP_K = 5
const SEARCH_TIMEOUT_MS = 15000
const SUMMARIZE_TIMEOUT_MS = 30000
const CAPTURE_MAX_CHARS = 6000
const INJECT_SNIPPET_CHARS = 180
const DAILY_FILE_RE = /^\d{4}-\d{2}-\d{2}\.md$/
const MAINTENANCE_INTERVAL_MS = 6 * 60 * 60 * 1000 // 6h; runner's due-state gates actual runs
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:156-176](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L156-L176)

物理路径哈希collection。

<details>
<summary>查看原文（21行）</summary>

```text
/** Preserve derive-collection.sh's physical path and collection naming. */
function deriveCollection(projectDir, override) {
  if (override) return override
  const absoluteInput = isAbsolute(projectDir) ? projectDir : `${process.cwd()}${sep}${projectDir}`
  let absolute
  try {
    // Preserve symlink/.. semantics before any lexical normalization.
    absolute = realpathSync.native(absoluteInput)
  } catch {
    absolute = parse(absoluteInput).root
    const parts = absoluteInput.slice(absolute.length).split(process.platform === 'win32' ? /[\\/]/ : /\//)
    for (const part of parts) {
      const candidate = join(absolute, part)
      try { absolute = realpathSync.native(candidate) } catch { absolute = candidate }
    }
  }
  const sanitized = basename(absolute)
    .replace(/[A-Z]/g, letter => letter.toLowerCase())
    .replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').slice(0, 40)
  const hash = createHash('sha256').update(absolute).digest('hex').slice(0, 8)
  return `ms_${sanitized}_${hash}`
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/index.js:1272-1324](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L1272-L1324)

接受输入后检索及进程内串行链。

<details>
<summary>查看原文（53行）</summary>

```text
  // --- Pre-step injection: returned memory candidates, zero context otherwise ---
  ctx.on(
    'agent/pre-step',
    async ({ agent, turn, step, signal }, next) => {
      const decision = await next()
      if (!opts.injectEnabled) return decision
      if (decision.kind === 'reject' || signal.aborted) return decision
      if (step !== 1) return decision

      const question = (decision.messages || [])
        .map((message) => textFromContent(message.content))
        .find((text) => text.length > 0)
      if (!question || question.length < 3) return decision

      const projectDir = projectDirFor(agent.session)
      const memoryDir = memoryDirFor(projectDir)
      if (!hasMemoryFiles(memoryDir)) return decision

      const collection = resolveCollection(projectDir)
      if (!collection) return decision
      const { chunks, error } = await runSearch(
        memsearchCmd,
        question,
        collection,
        projectDir,
        opts.milvusUri,
      )
      if (error) ctx.logger.warn(`[memsearch] search failed: ${error}`)
      if (!chunks || chunks.length === 0) return decision

      const text = renderMemoryBlock(chunks)
      const memoryMessage = await createMemoryMessage(ctx, text)
      return {
        kind: 'enter',
        messages: [...decision.messages, memoryMessage],
      }
    },
    { prepend: true },
  )

  // --- Capture: summarize + write each completed turn, fire-and-forget ---
  // Each turn is processed against its *own* project directory (from
  // `session.header.cwd`), which on a long-lived web surface is not
  // necessarily `process.cwd()` — the boot directory. Turns are serialized
  // through a promise chain so LLM summarize calls never overlap, and the
  // `captureExists` dedup keeps a turn idempotent if its event replays.
  const dependencyWarnings = new Set()
  let captureChain = Promise.resolve()
  const enqueueCapture = (work) => {
    captureChain = captureChain
      .then(work)
      .catch((error) => ctx.logger.warn(`[memsearch] capture failed: ${error.message}`))
  }
```

</details>

**依据 4 · 源码核查**：[plugins/dsh/index.js:1326-1364](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L1326-L1364)

按会话写入、摘要与索引次序。

<details>
<summary>查看原文（39行）</summary>

```text
  const processTurn = async (session, turnEndEvent) => {
    const projectDir = projectDirFor(session)
    const render = renderTurn(session, turnEndEvent)
    if (!render) return
    const sessionId = session.id
    const turn = turnEndEvent.data.turn
    const dbPath = sessionLogPath(ctx, session)
    const memoryDir = memoryDirFor(projectDir)
    if (captureExists(memoryDir, sessionId, turn)) return

    let body = render
    if (opts.summarizeEnabled) {
      try {
        const summary = await summarizeTurn(ctx, opts, render, projectDir)
        if (summary) {
          body = summary
        } else {
          ctx.logger.warn('[memsearch] summarizer returned empty output; wrote unavailable note')
          body = '- Memory summary unavailable: summarizer returned empty output. Use the transcript anchor for progressive disclosure.'
        }
      } catch (error) {
        // Collapse newlines so the reason stays a single `- ` bullet in the
        // daily file (summarize.py stderr can span lines).
        const reason = String(error.message).replace(/\s+/g, ' ').trim()
        if (error.code !== 'MEMSEARCH_DEPENDENCY_MISSING' || !dependencyWarnings.has(reason)) {
          ctx.logger.warn(`[memsearch] summarization failed (${reason}); wrote unavailable note`)
          if (error.code === 'MEMSEARCH_DEPENDENCY_MISSING') dependencyWarnings.add(reason)
        }
        body = `- Memory summary unavailable: ${reason}; transcript content was omitted. Use the transcript anchor for progressive disclosure.`
      }
    }
    writeCapture(memoryDir, body, sessionId, turn, dbPath)
    // Index right after the write so the memory is searchable by the next
    // session (or by this one's later turns) instead of waiting for a future
    // boot-time index. The index is idempotent via chunk_hash dedup.
    const collection = resolveCollection(projectDir)
    if (collection && hasMemoryFiles(memoryDir)) {
      indexMemory(ctx, memsearchCmd, memoryDir, collection, projectDir, opts.milvusUri)
    }
```

</details>

**依据 5 · 源码核查**：[plugins/dsh/index.js:1201-1208](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L1201-L1208)

headless递归保护。

```text
export function apply(ctx, config = {}) {
  // Recursion guard: when DSH booted this plugin as the summarizer's own
  // headless sub-agent (`summarizeMode: dsh-headless` sets this flag), stay
  // inert — no capture, no injection, no skill. Otherwise the summarizer's
  // session would itself be captured and re-summarized forever.
  if (process.env.MEMSEARCH_DSH_SUMMARIZE === '1') {
    ctx.logger?.debug?.('[memsearch] summarize sub-agent: plugin inert')
    return
```

**依据 6 · 源码核查**：[plugins/dsh/index.js:1025-1056](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L1025-L1056)

headless子进程及三十秒摘要超时。

<details>
<summary>查看原文（32行）</summary>

```text
function summarizeHeadless(ctx, opts, render, projectDir) {
  const dshCmd = detectDshCmd()
  if (!dshCmd) {
    return Promise.reject(dependencyError('dsh CLI not found; enable the Desktop Manage dsh Command entry or set DSH_CLI for summarizeMode=dsh-headless'))
  }
  try {
    const promptFile = join(PLUGIN_DIR, 'prompts', 'summarize.txt')
    let systemPrompt
    try {
      systemPrompt = readFileSync(promptFile, 'utf-8').replaceAll('{{AGENT_NAME}}', opts.agentName)
    } catch {
      systemPrompt = `You are a third-person note-taker for {{AGENT_NAME}}. Record the following transcript as 2-10 bullet points in the same language as the [User] text. Output ONLY bullet points.`.replaceAll('{{AGENT_NAME}}', opts.agentName)
    }
    const task = `${systemPrompt}\n\nTranscript:\n${sanitizeSurrogates(render)}`

    // Windows command launchers have a small command-line limit; the public
    // headless stdin interface also keeps transcript text out of shell parsing.
    const useStdin = process.platform === 'win32'
    const args = ['--profile', 'headless', ...(useStdin ? [] : [task])]

    const child = spawnCommand(dshCmd, args, {
      cwd: projectDir,
      env: { ...process.env, MEMSEARCH_DSH_SUMMARIZE: '1' },
      detached: process.platform !== 'win32',
      // collectSummarizerChild writes and closes piped input immediately.
      stdio: [useStdin ? 'pipe' : 'ignore', 'pipe', 'pipe'],
    })
    return collectSummarizerChild(child, {
      input: useStdin ? task : undefined,
      timeoutMs: opts.summarizeTimeoutMs ?? SUMMARIZE_TIMEOUT_MS,
      timeoutMessage: 'dsh headless summarization timed out',
      exitMessage: 'dsh headless summarize exited with status',
```

</details>

#### 缺口

- 当前宿主对重入和中途取消的实际行为未核对
  **影响**：同轮重复检索及取消后迟到结果的影响未知
  **进一步探讨**：同版本宿主以重入、取消和慢CLI核对查询次数、注入与时延

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败摘要写入锚点后，事件重放能否补齐知识？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能依据当前去重路径承诺事件重放能修复失败摘要。processTurn先执行captureExists，只要对应session与turn锚点已存在即返回；摘要异常或空输出会生成unavailable说明，但随后仍通过writeCapture写入相同锚点。因此再次重放同一事件会把失败占位视为已经捕获，跳过重新摘要。该判断来自明确源码次序，本轮没有运行故障复现，也不推断所有历史恢复机制都失效。

作者避免在摘要失败时把原始会话全部写进日记，是一个有意义的数据负担取舍。原始内容可由transcript锚点继续定位，不是完全不可追溯；但人工发现占位、打开原日志、补写摘要和重索引的责任留给用户。若原日志已不可达，Markdown中只有故障原因而没有原任务知识，影子索引重建也不能恢复遗漏内容。

所以“幂等一次”与“内容成功且可恢复”应分开验收。对于需要连续积累关键约束的工作，长时间不可见的失败占位会削弱跨轮贡献；试用时应把占位检查纳入验收，而非只检查日记文件存在。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:855-884](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L855-L884)

去重只按锚点存在判定，写入没有成功状态差异。

<details>
<summary>查看原文（30行）</summary>

```text
/** True when a session/turn anchor already exists in any daily memory file. */
function captureExists(memoryDir, sessionId, turn) {
  let files
  try {
    files = readdirSync(memoryDir)
  } catch {
    return false
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} `
  for (const file of files) {
    if (!DAILY_FILE_RE.test(file)) continue
    try {
      if (readFileSync(join(memoryDir, file), 'utf-8').includes(anchor)) return true
    } catch { /* skip unreadable file */ }
  }
  return false
}

/** Append a captured turn to the daily memory file (shared 4-platform format). */
function writeCapture(memoryDir, body, sessionId, turn, dbPath) {
  mkdirSync(memoryDir, { recursive: true })
  const today = todayStr()
  const hhmm = hhmmStr()
  const file = join(memoryDir, `${today}.md`)
  if (!existsSync(file)) {
    writeFileSync(file, `# ${today}\n\n## Session ${hhmm}\n\n`, 'utf-8')
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} db:${dbPath} -->\n`
  const entry = `### ${hhmm}\n${anchor}${body}\n\n`
  appendFileSync(file, entry, 'utf-8')
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1326-1357](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L1326-L1357)

去重先于摘要，摘要失败后仍写入同一锚点。

<details>
<summary>查看原文（32行）</summary>

```text
  const processTurn = async (session, turnEndEvent) => {
    const projectDir = projectDirFor(session)
    const render = renderTurn(session, turnEndEvent)
    if (!render) return
    const sessionId = session.id
    const turn = turnEndEvent.data.turn
    const dbPath = sessionLogPath(ctx, session)
    const memoryDir = memoryDirFor(projectDir)
    if (captureExists(memoryDir, sessionId, turn)) return

    let body = render
    if (opts.summarizeEnabled) {
      try {
        const summary = await summarizeTurn(ctx, opts, render, projectDir)
        if (summary) {
          body = summary
        } else {
          ctx.logger.warn('[memsearch] summarizer returned empty output; wrote unavailable note')
          body = '- Memory summary unavailable: summarizer returned empty output. Use the transcript anchor for progressive disclosure.'
        }
      } catch (error) {
        // Collapse newlines so the reason stays a single `- ` bullet in the
        // daily file (summarize.py stderr can span lines).
        const reason = String(error.message).replace(/\s+/g, ' ').trim()
        if (error.code !== 'MEMSEARCH_DEPENDENCY_MISSING' || !dependencyWarnings.has(reason)) {
          ctx.logger.warn(`[memsearch] summarization failed (${reason}); wrote unavailable note`)
          if (error.code === 'MEMSEARCH_DEPENDENCY_MISSING') dependencyWarnings.add(reason)
        }
        body = `- Memory summary unavailable: ${reason}; transcript content was omitted. Use the transcript anchor for progressive disclosure.`
      }
    }
    writeCapture(memoryDir, body, sessionId, turn, dbPath)
```

</details>

#### 缺口

- 另有运维工具能否定向识别并补回失败摘要尚未检查
  **影响**：限制结论是本DSH事件重放路径，不是整个MemSearch无法恢复
  **进一步探讨**：给同一轮制造一次摘要失败，恢复provider后重放并检查人工修复工具和索引内容

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 用户全周期需要维护什么，退出后留下什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

它不是只装一个npm包即可独立完成记忆。需要可用MemSearch CLI、Python、DSH profile及其Node环境，检索依赖Milvus配置和embedding。摘要可选custom-llm或headless，两者不能自动当作相同费用或路由。显式命令设置无效时报告错误而不悄悄改用别的安装，便于定位；相反，多运行时与默认模型仍增加排障负担。

用户先确认CLI和项目目录、固定包及宿主，再用少量会话检查摘要和原始锚点、候选检索以及空结果。后台维护PROJECT、USER和Skill默认关闭，启用意味着额外模型调用和持久文件更新。退出移除profile依赖后Markdown和Milvus索引保留；已安装的Skill可能位于独立目标目录，需要另外检查，不能把卸载插件当作撤销全部副作用。

成本按合格任务而非单次索引查询计量。首次涉及CLI、Python、embedding和索引配置；持续涉及摘要调用、索引更新及人工复核；失败需查占位、还原会话并补索引。金额、频率、人工时间及合格率均未知。源码支持可回查和自动接线，不支持固定节时、零成本或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:15-25](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/README.md#L15-L25)

启动运行时依赖。

<details>
<summary>查看原文（11行）</summary>

````text
## Prerequisites

- Install memsearch:

  ```bash
  uv tool install "memsearch[onnx]"
  ```

- A DSH profile (web / headless / tui) you want to attach memory to.
- Node >= 22.19 (DSH's requirement).
- Python 3 on the profile's `PATH` (`python3`, `python`, or the Windows `py -3` launcher).
````

</details>

**依据 2 · 作者声明**：[plugins/dsh/README.md:98-117](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/README.md#L98-L117)

维护默认关闭，候选不自动安装。

<details>
<summary>查看原文（20行）</summary>

````text
### Maintenance tasks (PROJECT.md / USER.md / skills)

Optional background upkeep, aligned with the other platform plugins. Each task
is disabled by default; enable the ones you want in `~/.memsearch/config.toml`:

```toml
[plugins.dsh.project_review]
enabled = true            # maintain .memsearch/PROJECT.md
[plugins.dsh.user_profile]
enabled = true            # maintain .memsearch/USER.md
[plugins.dsh.memory_to_skill]
enabled = true            # distill recurring workflows into skill candidates
min_occurrences = 3       # how often a workflow must recur before distilling
```

Common settings per task: `provider` (`native` = a one-shot DSH headless
agent, default), `model`, `min_interval_hours` (default 24), `input_dir`,
`output_file`. Candidates land in `.memsearch/skill-candidates/` (git-tracked)
and are **never installed automatically** — installing is a human step (see
the `memory-to-skill` skill in the other platform plugins).
````

</details>

**依据 3 · 作者声明**：[plugins/dsh/README.md:237-244](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/README.md#L237-L244)

卸载保留Markdown与索引。

````text
## Uninstall

```bash
dsh plugin --profile web remove @zilliz/memsearch-dsh
```

Removing the dependency drops the profile-layer entry; the memory markdown
files and the Milvus index are left untouched.
````

**依据 4 · 源码核查**：[plugins/dsh/runtime.js:48-79](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/runtime.js#L48-L79)

子进程超时和终止树的实现。

<details>
<summary>查看原文（32行）</summary>

```text
/** cross-spawn handles Windows command shims and escaping their arguments. */
export function spawnCommand(command, args = [], options = {}) {
  const [file, ...prefix] = parseCommand(command)
  const { timeout, ...spawnOptions } = options
  const child = spawn(file, [...prefix, ...args], { windowsHide: true, ...spawnOptions })
  if (timeout) {
    const timer = setTimeout(() => {
      child.timedOut = true
      killProcessTree(child)
    }, timeout)
    timer.unref()
    child.once('close', () => clearTimeout(timer))
  }
  return child
}

/** Terminate a command and its descendants, including Windows batch launchers. */
export function killProcessTree(child) {
  if (!child.pid) return
  if (process.platform === 'win32') {
    try {
      execFileSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore', windowsHide: true })
      return
    } catch { /* Fall back to the direct child. */ }
  } else {
    try {
      process.kill(-child.pid, 'SIGKILL')
      return
    } catch { /* Fall back to the direct child. */ }
  }
  try { child.kill('SIGKILL') } catch { /* Already exited. */ }
}
```

</details>

**依据 5 · 作者声明**：[plugins/dsh/README.md:264-282](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/README.md#L264-L282)

命令显式设置及故障解释边界。

<details>
<summary>查看原文（19行）</summary>

```text
### Command setup

The plugin uses explicit command settings first.
`DSH_CLI` selects the headless DSH entry, `MEMSEARCH_CMD` selects MemSearch,
and `MEMSEARCH_PYTHON` selects the Python interpreter for helper scripts.
Use an executable path, a quoted command with arguments, or a JSON argument
array; a path containing spaces must remain one argument. An invalid explicit
setting is reported rather than replaced with another installation.

Without an explicit setting, DSH is resolved from `PATH`, then
`~/.local/share/pnpm/dsh`. MemSearch uses `memsearch` on `PATH`, then
`~/.local/bin/uvx`, then `uvx` on `PATH`.

A missing DSH or Python command produces a dependency warning. Enable Desktop's
CLI entry or configure the required command, then restart the profile. A command
that starts but fails reports its execution error; check that command's profile,
provider, and model configuration. The plugin does not change these settings or
switch summary backends automatically. The Markdown journal retains the existing
unavailable note and transcript anchor when summarization fails.
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · Skill评审与安装是否是强制审批门禁？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

不是。review动作把来源标记消息排入活跃Agent的next-turn inbox；install动作独立启动memsearch skills install并立即返回started。代码没有要求该候选先通过review，也没有把后台进程完成等同HTTP成功。用户可以主动安装，但“有评审面板”不代表存在强制安全放行或已完成验收。

路由在每次请求解析connection.requestRejection，复用宿主的认证与Host/Origin策略，认证服务不可用时返回503。这一设计优于直接开放写入接口，但不证明候选内容可信，也不代替安装后检查。默认安装目标可落在~/.agents/skills，由filesystem provider加载；这会扩大到当前聊天以外的环境。

可借鉴处是把候选生成与人主动安装分开、保持原会话来源和明确的下一轮评审队列。移植仍要管理认证、候选路径、安装目标与命令完成状态。当前index承载检索、写入、摘要、路由及维护多种职责，读者不能由纯ESM免构建推断维护成本低；本轮未执行测试或热重载，因此不宣称生命周期完全可靠。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:545-566](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L545-L566)

每次请求复用认证策略，不可用时失败关闭。

<details>
<summary>查看原文（22行）</summary>

```text
  const registerAuthenticatedRoute = (route) => webServer.register({
    ...route,
    handler: (req, res) => {
      let rejection
      try {
        // The connection service mounts after this plugin. Resolve it for each
        // request and reuse DSH's authentication and Host/Origin policy.
        const connection = ctx.get('connection')
        rejection = typeof connection?.requestRejection === 'function'
          ? connection.requestRejection({ headers: req.headers })
          : 503
      } catch {
        rejection = 503
      }
      if (rejection !== undefined) {
        return sendJson(res, rejection, {
          error: rejection === 503 ? 'authentication unavailable' : 'request rejected',
        })
      }
      return route.handler(req, res)
    },
  })
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:587-631](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L587-L631)

review与install独立分支；返回started不等于安装完成。

<details>
<summary>查看原文（45行）</summary>

```text
  registerAuthenticatedRoute({
    kind: 'exact',
    path: '/memsearch-dsh/skill-review',
    handler: async (req, res) => {
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'method not allowed' })
      const body = await readJsonBody(req)
      const { sessionId, name, action } = body
      if (!name || (action !== 'review' && action !== 'install')) {
        return sendJson(res, 400, { error: 'name and action (review|install) are required' })
      }
      if (action === 'review') {
        // Non-blocking: queue a user message into the live agent's inbox.
        // The agent picks it up on the next turn (never interrupts a running
        // turn, never asks the human via a blocking dialog).
        const agent = ctx.agents?.get?.(sessionId)
        if (!agent) {
          return sendJson(res, 404, { error: `no live agent for session ${sessionId}` })
        }
        const text =
          `[memsearch] Skill candidate "${name}" is ready for review.\n\n` +
          `Read the candidate at .memsearch/skill-candidates/${name}/ (SKILL.md plus meta.json), ` +
          `verify it against the cited memory journals, decide whether it is worth installing, ` +
          `and report your recommendation to the user. Installation stays a manual step: ` +
          `memsearch skills install ${name} --path <dir>.`
        const message = await createMemoryMessage(ctx, text)
        agent.inbox.append('next-turn', message)
        return sendJson(res, 200, { ok: true, action, name, injected: true })
      }
      // install: background `memsearch skills install` to the resolved target.
      // Detached + unref so the install survives the DSH process; the
      // skill-filesystem watcher picks up the new SKILL.md automatically.
      const projectDir = projectDirForSession(sessionId)
      const target = resolveSkillInstallTarget(memsearchCmd, projectDir)
      const child = execCommand(memsearchCmd, ['skills', 'install', name, '--path', target], {
        cwd: projectDir,
        timeout: 60000,
        maxBuffer: 4 * 1024 * 1024,
        detached: true,
        stdio: 'ignore',
        env: { ...process.env, MEMSEARCH_NO_WATCH: '1' },
      }, (error) => {
        if (error) ctx.logger.warn(`[memsearch] skill install failed: ${error.message}`)
      })
      child.unref()
      return sendJson(res, 200, { ok: true, action, name, started: true, target })
```

</details>

**依据 3 · 作者声明**：[plugins/dsh/client.js:1-18](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/client.js#L1-L18)

浏览器面板提供两个动作，属于作者设计说明。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * memsearch-dsh — browser half (skill review panel).
 *
 * A non-blocking dock strip above the composer that lists MemSearch skill
 * candidates distilled from memory journals and lets the human review or
 * install them:
 *
 *   - data:   GET  /memsearch-dsh/skill-candidates
 *   - review: POST /memsearch-dsh/skill-review  { sessionId, name, action: 'review' }
 *             queues a user message into the live agent's inbox; the agent
 *             reviews the candidate on the next turn (non-blocking).
 *   - install:POST /memsearch-dsh/skill-review  { sessionId, name, action: 'install' }
 *             runs `memsearch skills install` in the background to the
 *             resolved target (paths config, else ~/.agents/skills).
 *
 * The bundle is a prebuilt client-module artifact: it registers its factory
 * with `window.__ModuleLoader__.load({ id, factory })` (lazy CJS table —
 * nothing runs until the shell materializes the module), and exports the
```

</details>

#### 缺口

- 候选安装失败后的前端呈现和已安装状态是否可靠
  **影响**：不能将一次按钮成功视为Skill已加载
  **进一步探讨**：跟踪后台失败、目标目录文件和filesystem provider实际加载状态

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 把捕获成功与失败占位分开，是否更适合可靠记忆积累？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是保留“已见原会话”锚点，同时独立记录摘要pending、failed、completed，并允许恢复provider后只重试失败摘要，再按相同turn原位替换而不是重复追加。由Q03的失败占位与存在即去重可推导，这能兼顾幂等和知识恢复，但会引入并发写锁、旧摘要版本及索引同步成本。

最小验证使用同一组含敏感约束与显式纠错的会话，注入摘要超时、进程退出和索引失败。对比当前写占位路径、人工补笔记和状态化恢复，测未恢复任务数、重复记录、最终召回正确性和人工时间；如恢复引入重复/旧内容或未减少人工处理，则否定该方案。本轮没有实现或验证。

采用结论为有界试用。已有Python/MemSearch环境、允许项目日记持久化的DSH用户，可先测试少量跨会话决策查回；相对手工笔记多了自动摘要和下钻，但仍需检查失败占位。摘要失败长期不修复、跨项目串数据或安装状态无法确认时停止，禁用capture/inject并回到手工笔记，独立清点已安装Skill。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:855-884](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L855-L884)

存在锚点与append的状态粒度是推导依据。

<details>
<summary>查看原文（30行）</summary>

```text
/** True when a session/turn anchor already exists in any daily memory file. */
function captureExists(memoryDir, sessionId, turn) {
  let files
  try {
    files = readdirSync(memoryDir)
  } catch {
    return false
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} `
  for (const file of files) {
    if (!DAILY_FILE_RE.test(file)) continue
    try {
      if (readFileSync(join(memoryDir, file), 'utf-8').includes(anchor)) return true
    } catch { /* skip unreadable file */ }
  }
  return false
}

/** Append a captured turn to the daily memory file (shared 4-platform format). */
function writeCapture(memoryDir, body, sessionId, turn, dbPath) {
  mkdirSync(memoryDir, { recursive: true })
  const today = todayStr()
  const hhmm = hhmmStr()
  const file = join(memoryDir, `${today}.md`)
  if (!existsSync(file)) {
    writeFileSync(file, `# ${today}\n\n## Session ${hhmm}\n\n`, 'utf-8')
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} db:${dbPath} -->\n`
  const entry = `### ${hhmm}\n${anchor}${body}\n\n`
  appendFileSync(file, entry, 'utf-8')
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1334-1357](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/plugins/dsh/index.js#L1334-L1357)

失败摘要仍被记录，支持问题定位但不证明新方案收益。

<details>
<summary>查看原文（24行）</summary>

```text
    if (captureExists(memoryDir, sessionId, turn)) return

    let body = render
    if (opts.summarizeEnabled) {
      try {
        const summary = await summarizeTurn(ctx, opts, render, projectDir)
        if (summary) {
          body = summary
        } else {
          ctx.logger.warn('[memsearch] summarizer returned empty output; wrote unavailable note')
          body = '- Memory summary unavailable: summarizer returned empty output. Use the transcript anchor for progressive disclosure.'
        }
      } catch (error) {
        // Collapse newlines so the reason stays a single `- ` bullet in the
        // daily file (summarize.py stderr can span lines).
        const reason = String(error.message).replace(/\s+/g, ' ').trim()
        if (error.code !== 'MEMSEARCH_DEPENDENCY_MISSING' || !dependencyWarnings.has(reason)) {
          ctx.logger.warn(`[memsearch] summarization failed (${reason}); wrote unavailable note`)
          if (error.code === 'MEMSEARCH_DEPENDENCY_MISSING') dependencyWarnings.add(reason)
        }
        body = `- Memory summary unavailable: ${reason}; transcript content was omitted. Use the transcript anchor for progressive disclosure.`
      }
    }
    writeCapture(memoryDir, body, sessionId, turn, dbPath)
```

</details>

#### 缺口

- 状态化重试是否减少人工时间且不破坏幂等
  **影响**：只作为未来假设，不计已有贡献
  **进一步探讨**：对照故障任务，核对重复、错误召回与人工处理时间

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
