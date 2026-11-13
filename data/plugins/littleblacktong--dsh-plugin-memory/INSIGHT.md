# DSH Plugin Memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[5a3f94c](https://github.com/LittleBlackTong/dsh-plugin-memory/tree/5a3f94c59a8966565778ff01d24649558e0ca7f1)

<!-- BEGIN META -->
[![GitHub ★ 35](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LittleBlackTong/dsh-plugin-memory) [![npm 30d 40,221](https://img.shields.io/static/v1?label=npm+30d&message=40%2C221&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-memory) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-memory)
<!-- END META -->

> **功能**：用 Markdown 保存 DSH 跨会话记忆和角色设定，提供启动注入、回顾和整理。

> **亮点**：启动与近期上下文分开，使用字符预算、会话和活动条件控制注入。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：会话 off 默认会过期，持久化失败可能静默。自动 Git 提交会保存已写内容，停用不会撤回历史。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 跨会话连续性从何而来，文件内容在何时进入模型上下文？](#detail-section-11)
  - [Q02 · 关闭某个会话或工作区能否形成持久的保密边界？](#detail-section-12)
  - [Q03 · 日常回顾和 Git 保存增加什么负担，怎样验证更强的隐私退出？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常在不同 DSH 会话重复提供项目背景与个人工作约定的用户。

手工维护项目笔记，每个会话显式选择文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 启动上下文 | 恢复项目背景 | 可见于所选模型 |
| 会话门控 | 改变当前会话注入 | 覆盖可能过期 |
| Git 历史 | 保留记忆目录变更 | 本地提交会留存内容 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH Prompt、Skill、Agent 服务 | 必需 | 注入和回顾 | 手工笔记 |
| 独立可写记忆目录 | 持久化需要 | 保存 Markdown | 观察错误并退出 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选择隔离目录及无敏感笔记 | 核对打开的功能 |
| 退出 | 确认下一轮未注入并检查文件和 Git | 单独清理不需要的历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地文件存储 | 整理术语和权限 | 目录不宜混用 |
| 持续 | 注入、回顾和模型 token 费用未知 | 复核质量与过期设置 | 可能需清理 Git 历史 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨会话上下文 | 启动与近期注入 | 质量和费用未验证 |

> **思考**：会话 off 默认会过期，持久化失败可能静默。自动 Git 提交会保存已写内容，停用不会撤回历史。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：启动与近期上下文分开，使用字符预算、会话和活动条件控制注入。[Q01](#research-q01) [Q02](#research-q02)

拆分启动及近期上下文能减少部分重读，异常降级可能隐藏未注入与未保存。

<a id="detail-section-5"></a>

### 1.4 主要限制

会话 off 默认会过期，持久化失败可能静默。自动 Git 提交会保存已写内容，停用不会撤回历史。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

仅以隔离低敏笔记观察，关闭不需要的自动记录与提交，验证模型收到的上下文。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码支持提示词、门控及本地提交；实际隐私、缓存和效果未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/boot.js、lib/session-gate.js、lib/autocommit.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定注入、会话门控、回顾注册与自动提交。未运行宿主或写记忆。
- 下一步：对照文件修改、过期重启、持久化失败和 Git 退出。

**分析版本**

- **仓库**：[LittleBlackTong/dsh-plugin-memory](https://github.com/LittleBlackTong/dsh-plugin-memory)
- **版本号**：0.19.5（[固定提交 5a3f94c](https://github.com/LittleBlackTong/dsh-plugin-memory/tree/5a3f94c59a8966565778ff01d24649558e0ca7f1)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将隐私禁用设为显式持久规则并回报落盘状态，可能减少恢复后的非预期注入。[Q03](#research-q03)

对照文件修改、过期重启、持久化失败和 Git 退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1639 | — | — | 22539 |
| .js | source | 29 | 9033 | 6384 | 2110 | — |
| .mjs | source | 1 | 636 | 525 | 74 | — |
| .mjs | test | 40 | 7249 | 6237 | 406 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/LittleBlackTong/dsh-plugin-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/LittleBlackTong/dsh-plugin-memory/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/LittleBlackTong/dsh-plugin-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Markdown 记忆如何进入宿主提示词，哪些设置能限制继续注入，关闭后哪些内容还会保留？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话连续性从何而来，文件内容在何时进入模型上下文？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

有持续项目和跨会话术语的用户可以将必要背景保存在 Markdown，避免每次手抄。Host 用 memory-boot 注入限额材料，memory-recent 单独读取变化较快的日志；有 Agent 时会检查会话开关和活动门。session 快照可复用首次渲染文本，live 路径重新读文件。异常返回空字符串，其他对话可继续。Skill 将工作流和文件资源注册给宿主，实际回忆、写入和正确性仍取决于 Agent 与文件内容。注入到系统提示意味着所选模型路由可以看到这些文字。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:447-510](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/index.js#L447-L510)

启动与近期上下文、会话快照、失败返回空。

<details>
<summary>查看原文（64行）</summary>

```text
      bootDispose = ctx.systemPrompt.context({
        name: 'memory-boot',
        order: -200,
        text: (context) => {
          // A throwing runtime-context callback fails the whole prompt build and
          // makes every session unusable. Swallow errors: worst case memory is
          // not injected, the session keeps working.
          try {
            // Per-agent gate: no agent context (e.g. a global preview) injects
            // unconditionally; an agent injects only once it has spoken and is
            // the active session.
            const resolved = store.get()
            const agent = context?.agent
            // User intent first (the session switch), then the two polite gates.
            if (agent && !sessionEnabled(agent, resolved)) return ''
            if (agent && !tracker.shouldInject(agent.id, resolved)) return ''
            // Tone drift rides on the boot block (charged to its budget). Read
            // live from the store so the Settings select applies on the next
            // prompt build without a reload.
            const toneGuide = resolved.toneGuideEnabled
              ? buildToneGuide({ intensity: resolved.toneIntensity, language: 'zh' })
              : ''
            const options = {
              bootFiles,
              bootMaxChars,
              bootFileBudgets,
              toneGuide,
              // The volatile log tail is injected by `memory-recent` instead.
              includeRecentActivity: false,
            }
            if (agent && resolved.bootSnapshot === 'session') {
              const signature = snapshotSignature(resolved, memoryDir)
              const hit = bootSnapshots.get(agent.id)
              if (hit !== undefined && hit.signature === signature) return hit.text
              const text = renderBootBlock(memoryDir, options)
              bootSnapshots.set(agent.id, { text, signature })
              if (bootSnapshots.size > 64) bootSnapshots.delete(bootSnapshots.keys().next().value)
              return text
            }
            return renderBootBlock(memoryDir, options)
          } catch (error) {
            ctx.logger?.warn?.(`memory: boot context failed: ${error instanceof Error ? error.message : String(error)}`)
            return ''
          }
        },
      })
      // The volatile tail (recent log entries) lives in its own segment with a
      // late order, so a mid-session digest changes only that suffix.
      recentDispose = ctx.systemPrompt.context({
        name: 'memory-recent',
        order: 900,
        text: (context) => {
          try {
            const resolved = store.get()
            const agent = context?.agent
            if (agent && !sessionEnabled(agent, resolved)) return ''
            if (agent && !tracker.shouldInject(agent.id, resolved)) return ''
            return renderRecentActivity(memoryDir)
          } catch (error) {
            ctx.logger?.warn?.(`memory: recent context failed: ${error instanceof Error ? error.message : String(error)}`)
            return ''
          }
        },
      })
```

</details>

**依据 2 · 源码核查**：[lib/index.js:515-524](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/index.js#L515-L524)

注册记忆 Skill 和资源目录。

<details>
<summary>查看原文（10行）</summary>

```text
    if (wantSkill) {
      disposeSkill()
      skillDispose = ctx.skills.register({
        name: MEMORY_SKILL_NAME,
        description: MEMORY_SKILL_DESCRIPTION,
        whenToUse: MEMORY_SKILL_WHEN_TO_USE,
        content: memorySkillContent(),
        source: 'dsh-plugin-memory',
        resourceBase: { kind: 'directory', path: memoryDir },
      })
```

</details>

**依据 3 · 源码核查**：[lib/boot.js:273-299](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/boot.js#L273-L299)

按总字符预算构建启动上下文。

<details>
<summary>查看原文（27行）</summary>

```text
export function renderBootBlock(memoryDir, options = {}) {
  const bootFiles = options.bootFiles && options.bootFiles.length > 0
    ? options.bootFiles
    : DEFAULT_BOOT_FILES
  const total = Math.max(512, options.bootMaxChars ?? 6000)
  // The tone section rides along on every request, so it is charged to the
  // same budget as the store files: without this the persona paragraph would
  // silently push the end of `index.md` out of the block.
  const toneSection = typeof options.toneGuide === 'string' && options.toneGuide.trim().length > 0
    ? options.toneGuide.trim()
    : ''
  const toneCost = toneSection.length > 0 ? toneSection.length + SECTION_SEPARATOR.length : 0
  const fileBudget = Math.max(512, total - toneCost)
  const caps = allocateBootBudget(memoryDir, {
    files: bootFiles,
    total: fileBudget,
    perFile: options.bootFileBudgets,
  })

  const sections = []
  let toneInjected = false
  for (const fileName of bootFiles) {
    const path = join(memoryDir, fileName)
    const cap = caps.get(fileName) ?? 0
    const text = cap > 0 ? readCapped(path, cap) : undefined
    if (text === undefined || text.trim() === '') continue
    // Placeholder lines are noise once a basic soul exists; the file keeps
```

</details>

#### 缺口

- 未运行宿主和模型验证上下文送达与复用
  **影响**：不能量化答复质量或缓存节省
  **进一步探讨**：隔离两次会话比较相同项目、空记忆和改过的 Markdown

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 关闭某个会话或工作区能否形成持久的保密边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

全局 off 优先，其次显式会话 override，再比较工作区路径。会话 override 保存但默认 7 天，读取时过期即删，落盘失败只在当前进程生效，所以会话 off 可能在恢复后回到默认。路径匹配使用规范化路径和目录边界，未体现实体路径所有权。Web 会话配置无 sessionId 时用活动会话或挂载回退，实际操作需读回会话。无 Agent 的全局预览走不同分支。禁止注入不会撤回此前送出的内容，也不清理 Markdown 或 Git 历史。

#### 证据与依据

**依据 1 · 源码核查**：[lib/session-gate.js:32-40](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/session-gate.js#L32-L40)

默认路径及 7 天 TTL。

```text
/** File name of the session-override store, next to the plugin's memory.json. */
export const SESSION_STATE_FILENAME = 'memory-sessions.json'

/** Days an override stays valid before it is pruned. */
export const DEFAULT_TTL_DAYS = 7

/** Absolute path of the session-override store. */
export function defaultSessionStatePath() {
  return join(process.env.DSH_HOME || join(homedir(), '.dsh'), SESSION_STATE_FILENAME)
```

**依据 2 · 源码核查**：[lib/session-gate.js:64-77](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/session-gate.js#L64-L77)

按解析路径和目录边界匹配。

<details>
<summary>查看原文（14行）</summary>

```text
export function matchesWorkspace(cwd, patterns, options = {}) {
  if (typeof cwd !== 'string' || cwd.trim().length === 0) return false
  // Windows paths are case-insensitive: `C:\\Users\\X` and `c:\\users\\x` are
  // the same workspace, so compare lowercased paths there.
  const platform = options.platform ?? process.platform
  const normalizeCase = (value) => (platform === 'win32' ? value.toLowerCase() : value)
  const target = normalizeCase(resolve(cwd))
  if (!Array.isArray(patterns)) return false
  return patterns.some((pattern) => {
    const expanded = expandHome(pattern)
    if (expanded === undefined || expanded.length === 0) return false
    const root = normalizeCase(resolve(expanded))
    return target === root || target.startsWith(root.endsWith(sep) ? root : `${root}${sep}`)
  })
```

</details>

**依据 3 · 源码核查**：[lib/session-gate.js:139-155](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/session-gate.js#L139-L155)

过期回到无选择。

<details>
<summary>查看原文（17行）</summary>

```text
  /**
   * The session's explicit choice, or `undefined` when it has none.
   * Expired entries count as "no choice" and are pruned.
   *
   * @param {string} sessionId
   * @returns {boolean | undefined}
   */
  getOverride(sessionId) {
    const entry = this.sessions.get(sessionId)
    if (entry === undefined) return undefined
    const cutoff = this.now() - this.ttlDays * 24 * 60 * 60 * 1000
    if (entry.updatedAt < cutoff) {
      this.sessions.delete(sessionId)
      this.persist()
      return undefined
    }
    return entry.enabled
```

</details>

**依据 4 · 源码核查**：[lib/session-gate.js:204-229](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/session-gate.js#L204-L229)

实际开关优先级，原子重命名失败静默降级。

<details>
<summary>查看原文（26行）</summary>

```text
  effectiveEnabled(sessionId, cwd, config = {}) {
    if (config.globalEnabled === false) return false
    const override = this.getOverride(sessionId)
    if (override !== undefined) return override
    if (matchesWorkspace(cwd, config.disabledWorkspaces)) return false
    return true
  }

  /** Current on-disk session count (debugging / diagnostics). */
  get size() {
    return this.sessions.size
  }

  /** Persist atomically; failures are best-effort and never break a turn. */
  persist() {
    try {
      mkdirSync(dirname(this.path), { recursive: true })
      const payload = {
        version: 1,
        sessions: Object.fromEntries(this.sessions),
      }
      const tmp = `${this.path}.tmp`
      writeFileSync(tmp, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
      renameSync(tmp, this.path)
    } catch {
      // best effort: the in-memory gate still works for this process
```

</details>

**依据 5 · 源码核查**：[lib/index.js:449-465](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/index.js#L449-L465)

提示词门控要求 Agent 上下文。

<details>
<summary>查看原文（17行）</summary>

```text
        order: -200,
        text: (context) => {
          // A throwing runtime-context callback fails the whole prompt build and
          // makes every session unusable. Swallow errors: worst case memory is
          // not injected, the session keeps working.
          try {
            // Per-agent gate: no agent context (e.g. a global preview) injects
            // unconditionally; an agent injects only once it has spoken and is
            // the active session.
            const resolved = store.get()
            const agent = context?.agent
            // User intent first (the session switch), then the two polite gates.
            if (agent && !sessionEnabled(agent, resolved)) return ''
            if (agent && !tracker.shouldInject(agent.id, resolved)) return ''
            // Tone drift rides on the boot block (charged to its budget). Read
            // live from the store so the Settings select applies on the next
            // prompt build without a reload.
```

</details>

**依据 6 · 源码核查**：[lib/index.js:849-861](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/index.js#L849-L861)

会话路由默认解析活动会话。

<details>
<summary>查看原文（13行）</summary>

```text
    const disposeSessionRoute = webCtx.webServer.register({
      kind: 'exact',
      path: SESSION_ROUTE_PATH,
      handler: async (req, res) => {
        try {
          const url = new URL(req.url ?? '/', 'http://localhost')
          const resolveAgent = (sessionId) => {
            const id = typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : tracker.activeId()
            const roots = rootAgents()
            if (id !== undefined) {
              const direct = ctx.agents.get?.(id)
              if (direct !== undefined) return direct
              // Some hosts key the registry differently from the session id the
```

</details>

**依据 7 · 源码核查**：[lib/index.js:910-930](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/index.js#L910-L930)

可改写会话及工作区设置。

<details>
<summary>查看原文（21行）</summary>

```text
            const agent = resolveAgent(typeof body?.sessionId === 'string' ? body.sessionId : undefined)
            if (agent === undefined) {
              sendJson(200, { ok: false, reason: 'no-session' })
              return
            }
            const action = typeof body?.action === 'string' ? body.action : ''
            const resolved = store.get()
            const cwd = sessionCwd(agent)
            if (action === 'toggle') sessionGate.toggle(agent.id, undefined, cwd)
            else if (action === 'on' || action === 'off') sessionGate.setOverride(agent.id, action === 'on', cwd)
            else if (action === 'clear') sessionGate.clearOverride(agent.id)
            else if (action === 'workspace-off' || action === 'workspace-on') {
              if (!setWorkspaceDefault(resolved, cwd, action === 'workspace-off')) {
                sendJson(400, { error: 'this session has no workspace directory' })
                return
              }
            } else {
              sendJson(400, { error: `unknown action ${JSON.stringify(action)}` })
              return
            }
            sendJson(200, { ok: true, ...describeSession(agent, store.get()) })
```

</details>

#### 缺口

- 未用真实 Profile 验证工作区别名、重启和未鉴权入口
  **影响**：不能把本功能当作账户隔离或数据删除
  **进一步探讨**：受控重启并模拟过期、无会话和磁盘不可写，检查下一次模型请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 日常回顾和 Git 保存增加什么负担，怎样验证更强的隐私退出？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可选提示会安排会话回顾，可能增加模型调用及人工审查。默认启用的提交器仅在记忆目录有 .git 且 git 可用时工作，启动检查已有改动，执行 add -A 和本地 commit。应使用独立记忆目录，避免把无关文件带进历史；研究未发现这段提交路径自动 push。先用无敏感笔记测试注入、关停和改文。可对照一种持久拒绝规则，让隐私关闭不因会话 TTL 恢复并显式显示失效与落盘状态；如果误关闭其他会话或工作区维护复杂度抵消收益，则回到全局禁用和手工笔记。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:429-442](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/index.js#L429-L442)

创建提交器的实际接线。

<details>
<summary>查看原文（14行）</summary>

```text
    // Auto-commit follows the store dir: create on first build, restart
    // when the dir changes. (The first rebuild must create it too — the
    // dir only "changes" on a later config edit.)
    if (committer === undefined || memoryDir !== currentMemoryDir) {
      currentMemoryDir = memoryDir
      disposeCommitter()
      if (resolved.enabled && config.autoCommit !== false) {
        committer = new AutoCommitter(memoryDir, {
          quietSeconds: config.autoCommitQuietSeconds,
          intervalSeconds: config.autoCommitIntervalSeconds,
          logger: ctx.logger,
        })
        committer.start()
      }
```

</details>

**依据 2 · 源码核查**：[lib/autocommit.js:100-121](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/autocommit.js#L100-L121)

只有 Git 仓库与工具可用才启动并首查。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Begin polling; no-op when disabled or the store isn't a git repo. */
  start() {
    if (this.disposed || !this.enabled) return
    if (!existsSync(join(this.memoryDir, '.git'))) {
      this.logger?.info?.(`memory: auto-commit skipped — ${this.memoryDir} is not a git repository`)
      return
    }
    if (!gitAvailable()) {
      this.logger?.warn?.('memory: auto-commit skipped — git binary not found on PATH')
      return
    }
    this.gitOk = true
    // Flush changes that predate this plugin start (e.g. written last
    // session and never committed) instead of leaving them unversioned.
    this.check(true)
    this.timer = setInterval(() => {
      try {
        this.check(false)
      } catch (error) {
        this.warn(`check failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }, this.intervalMs)
```

</details>

**依据 3 · 源码核查**：[lib/autocommit.js:143-169](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/autocommit.js#L143-L169)

实际 Git 操作是全部暂存与本地 commit。

<details>
<summary>查看原文（27行）</summary>

```text
    if (this.disposed || !this.gitOk || this.committing) return
    const dirty = this.isDirty()
    if (!dirty) {
      this.dirtySince = 0
      return
    }
    const now = Date.now()
    if (this.dirtySince === 0) this.dirtySince = now
    if (!initial && now - this.dirtySince < this.quietMs) return

    this.committing = true
    try {
      execFileSync('git', ['-C', this.memoryDir, 'add', '-A'], { stdio: 'pipe' })
      if (!this.hasStaged()) {
        // Everything changed is ignored (e.g. .DS_Store, tarballs): nothing
        // to commit — treat as clean so the poll loop stays quiet.
        this.dirtySince = 0
        return
      }
      const stamp = new Date().toISOString()
      execFileSync('git', ['-C', this.memoryDir, 'commit', '-m', `digest: auto-commit memory store ${stamp}`], { stdio: 'pipe' })
      this.dirtySince = 0
      this.logger?.info?.(`memory: auto-committed store at ${this.memoryDir}`)
    } catch (error) {
      this.warn(`auto-commit failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      this.committing = false
```

</details>

**依据 4 · 源码核查**：[lib/index.js:637-669](https://github.com/LittleBlackTong/dsh-plugin-memory/blob/5a3f94c59a8966565778ff01d24649558e0ca7f1/lib/index.js#L637-L669)

挂载 DigestGuard 及会话开关。

<details>
<summary>查看原文（33行）</summary>

```text
  // Digest guard: one per live ROOT agent, so a skipped end-of-session
  // digest is caught mechanically instead of relying on the agent's
  // self-discipline. Independent of dsh-plugin-heartbeat — the nudge is
  // a plugin-source followup, queued behind whatever else the agent does.
  if (config.digestNudgeEnabled !== false) {
    ctx.effect(() => {
      const stopCreated = ctx.on('agent/created', ({ agent }) => {
        try {
          if (!isRootAgent(agent)) return
          const guard = new DigestGuard(agent, {
            readConfig: () => {
              const resolved = store.get()
              return {
                enabled: resolved.enabled && sessionEnabled(agent, resolved),
                afterMinutes: config.digestNudgeAfterMinutes,
                cooldownMinutes: config.digestNudgeCooldownMinutes,
                maxPerSession: config.digestNudgeMaxPerSession,
                deferUntilUserSpeaks: resolved.deferUntilUserSpeaks,
                activeSessionOnly: resolved.activeSessionOnly,
                proactiveCooldownSeconds: resolved.proactiveCooldownSeconds,
              }
            },
            getMemoryDir: () => currentMemoryDir,
            agents: ctx.agents,
            tracker,
            logger: ctx.logger,
            claimLock: claimSharedProactiveLock,
          })
          agent.ctx.effect(() => {
            guard.start()
            return () => {
              guard.dispose()
            }
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
