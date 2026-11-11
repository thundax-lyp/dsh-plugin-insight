# Minecraft Dev

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0fef2ba](https://github.com/sikadi233-hub/minecraft-dev/tree/0fef2ba9514b5c8cad62c36b05c85bc54d50047c)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sikadi233-hub/minecraft-dev) [![npm 30d 4,332](https://img.shields.io/static/v1?label=npm+30d&message=4%2C332&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/minecraft-dev) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/minecraft-dev)
<!-- END META -->

> **功能**：Minecraft 开发技能与工具集，用契约、清单审计和错误归属辅助多分片集成。

> **亮点**：把共享接口、文件所有权与生命周期排序转换成可检查的项目材料。[Q02](#research-q02)

> **主要限制**：缺清单时仍可继续合并，常规写入无事务，未解析诊断可能被结果摘要掩盖。[Q03](#research-q03)

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
  - [Q01 · 何时值得引入分片仲裁？](#detail-section-11)
  - [Q02 · 契约怎样进入分片，合并怎样处理冲突？](#detail-section-12)
  - [Q03 · 哪些输出仍需要人核对和真正编译？](#detail-section-13)
  - [Q04 · 怎样验证重复冲突能否提前处理？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向同时维护多个 Minecraft 插件或模组模块、需要共享接口和注册资源的开发者。

一名开发者用 Git、手工接口审查和 Gradle 串行集成；多人时可自行规范目录与清单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Skill | Minecraft 平台、构建和分片指导 | 按工作区 provider 条件呈现 |
| 模型工具 | 脚手架、Gradle、仲裁、Codex 入口 | 外部工具有额外运行与写入边界 |
| Agent/Preset | 角色预设由 bundle 加载 | 实际宿主兼容未测 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH/Cordis | 加载 bundle 与工具 | 版本按 package peer 范围核验 |
| Java、Gradle | 真实构建 | 索引和合成日志试验无需真实构建 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 冻结 | 构造 stub、契约和 brief | freeze 会镜像源码 |
| 合并 | 清单排序与 dryRun | 无效清单仍可生成部分计划 |
| 错误定位 | 解析日志与所有权匹配 | 未知格式回人工 |

**效果与成本**

| 成本 | 单位 | 限制 |
| --- | --- | --- |
| 集成 | 每片一份清单 | 清单和锚点维护 |
| 构建 | 每轮进程和依赖成本 | 本轮未测 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 冲突 | 重叠所有权拒写 | 缺清单仅计错误 |
| 写入预演 | 核对计划与 diff | 无实际写入成功证明 |

> **思考**：缺清单时仍可继续合并，常规写入无事务，未解析诊断可能被结果摘要掩盖。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把共享接口、文件所有权与生命周期排序转换成可检查的项目材料。[Q02](#research-q02)

把生命周期先后和所有权预先显式化，错误按清单和路径归属，跨片共同缺符号可提出契约问题。

<a id="detail-section-5"></a>

### 1.4 主要限制

缺清单时仍可继续合并，常规写入无事务，未解析诊断可能被结果摘要掩盖。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可试用临时虚拟项目的契约、brief 与 dryRun，只喂合成日志；不开 Codex、不启动 Gradle，不使用真实仓库。[Q01](#research-q01) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已走读工具入口及冻结、合并与日志路由，真实宿主、Gradle 和并行效果未核验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、skills.js、tools.js、codex.js、lib/gradle.js、lib/arbitration/tool.js、lib/arbitration/contract.js、lib/arbitration/merge.js、lib/arbitration/route.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只走读固定源码。冻结会写 Java stub，合并默认写共享文件，Gradle 与 Codex 均未启动。
- 下一步：比较同一两片样本的手工审查、dryRun 计划和合成路由。

**分析版本**

- **仓库**：[sikadi233-hub/minecraft-dev](https://github.com/sikadi233-hub/minecraft-dev)
- **版本号**：0.13.2（[固定提交 0fef2ba](https://github.com/sikadi233-hub/minecraft-dev/tree/0fef2ba9514b5c8cad62c36b05c85bc54d50047c)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用两片虚拟项目与合成日志核对拒写、变更计划和漏诊断，估计相对手工的定位成本。[Q04](#research-q04)

比较同一两片样本的手工审查、dryRun 计划和合成路由。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 77 | 49798 | — | — | 385554 |
| .js | source | 33 | 7051 | 4855 | 1688 | — |
| .mjs | source | 5 | 1742 | 1259 | 399 | — |
| .js | test | 33 | 5510 | 4629 | 476 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/sikadi233-hub/minecraft-dev/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/sikadi233-hub/minecraft-dev/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/sikadi233-hub/minecraft-dev/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 Minecraft 多模块协作的静态契约、合并和错误定位能否缩减人工集成工作，复核写入及构建边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时值得引入分片仲裁？

**研究主题**：场景与需求、采用判断

#### 完整回答

有多个模块共用 Java 接口、依赖和入口类时，单线任务能由同一人手工维护接口，分片后需反复协调所有权和注册顺序。此插件用宿主发起分片，仲裁工具负责契约、brief、审计及合并；现有小型单人项目仍适合普通分支和编译。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:313-318](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/README.md#L313-L318)

作者描述三模块以上，并明确并发由 host 驱动。

```text
## 分片并发与三级仲裁（v0.12.0）

当任务跨 **3 个以上模块**（指令 + 监听 + 存储 + GUI…）时，单线串行容易上下文腐化。v0.12.0 增加一个**确定性仲裁引擎**（工具 `mc_arbitrate`，7 个 action，**全部不调用模型**），把"契约冻结 → 分片并发 → 逐片审计 → 合并 → 编译 → 定点修复"固化成流程；并发本身由 host 用既有 `subagent_mc_content` 驱动（插件不实现调度器）。

| action | 作用 | 产物 |
|---|---|---|
```

**依据 2 · 源码核查**：[tools.js:194-205](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/tools.js#L194-L205)

工具注册说明七个动作，仲裁自身不调模型。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'mc_arbitrate',
    description: 'Deterministic sharded-development engine for Minecraft projects: contract freeze, per-shard briefs, '
      + 'manifest validation, static audit, merge and compile-error routing. Actions: '
      + 'freeze (frozen interface/DTO stubs with thread model and doc, contract.json, API allowlist from the bundled index plus host-verified extras), '
      + 'brief (per-shard three-block task with a shared prefix), audit (8 high-confidence rules + retry counter), '
      + 'merge (dependencies, plugin.yml commands/permissions, lifecycle statements, JSON mod metadata), '
      + 'route (compiler errors -> responsible shard, with contract-collapse detection), '
      + 'escalate (materials for the upstream orchestrator) and status (progress, retries, orchestrator). '
      + 'All actions write under <projectDir>/.mcdev and never call a model. '
      + 'Use when a Minecraft task spans three or more modules; single-file changes should stay on the plain scaffold+build path.',
    parameters: {
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-26](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/cordis.patch.yml#L1-L26)

bundle 组装技能、工具及预设组件。

<details>
<summary>查看原文（26行）</summary>

```text
- insert:
    - id: minecraft-skills
      name: minecraft-dev/skills
      config:
        # auto: list in Minecraft workspaces (and in empty ones), stay out of other stacks
        skillScope: auto
        # listed mode only: newline/comma separated workspace roots
        skillWorkspaces: ""

    - id: minecraft-tools
      name: minecraft-dev/tools
      config:
        gradleTimeoutMs: 600000
        outputTailChars: 12000
        shardedArbitration: auto
        maxAuditRetries: 3
        maxCompileRounds: 3

    # ── agent preset 自动安装（v0.6.0）──────────────────────────────────────
    # `dsh plugin add` 只装 cordis 插件，不会把 preset 放进 roster 扫描的
    # $DSH_HOME/.agent-presets/。此插件在每次 dsh 启动（挂载）时自动复制
    # preset/minecraft/ 过去；目标已有 agent.cordis.yml 则跳过（不覆盖本地
    # 修改）。可用配置 autoInstallPreset: false 关闭（见 README）。
    - id: minecraft-preset
      name: minecraft-dev/preset

```

</details>

#### 缺口

- 真实冲突与返工频率未知
  **影响**：收益对小项目可能被流程成本抵消
  **进一步探讨**：在一次两片同任务人工基线后比较变更与定位

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 契约怎样进入分片，合并怎样处理冲突？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

冻结生成契约 JSON、允许列表、Java stub，并镜像到项目编译路径；brief 返回共享前缀哈希。合并按排序读取并验证 manifest，重复文件所有权立即中止，重复命令/权限采用先见值并保留冲突；普通缺失或无效 manifest 会计入错误并跳过，已通过清单仍进入合并。初始化按优先级正序、关闭反序。

#### 证据与依据

**依据 1 · 源码核查**：[lib/arbitration/contract.js:358-397](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/contract.js#L358-L397)

冻结已有契约需要 force，写契约、白名单及 Java stub 镜像。

<details>
<summary>查看原文（40行）</summary>

```text
export function freezeContract(options) {
  const { projectDir, force = false } = options
  if (!projectDir) throw new Error('projectDir is required')
  const paths = arbitrationPaths(projectDir)
  if (existsSync(paths.contractFile) && !force) {
    const error = new Error(`contract already frozen at ${paths.contractFile}; pass force=true to replace it`)
    error.code = 'E_CONTRACT_EXISTS'
    throw error
  }
  const allowlist = options.allowlist ?? loadApiAllowlist({
    platform: options.platform,
    minecraftVersion: options.minecraftVersion,
    repoRoot: options.repoRoot ?? REPO,
    indexPath: options.indexPath,
    extraAllowlist: options.extraAllowlist,
  })
  const previous = existsSync(paths.contractFile) ? JSON.parse(readFileSync(paths.contractFile, 'utf8')) : null
  if (previous && force) cleanupStubs(projectDir, previous)
  const { model, stubs, warnings } = buildContractModel({ ...options, allowlist })
  model.apiAllowlist.partial = allowlist.partial === true
  if (options.allowlistNote) model.apiAllowlist.note = String(options.allowlistNote)
  ensureArbitrationLayout(projectDir)
  ensureDir(join(paths.contractDir, ...model.packageName.split('.')))
  // The canonical copy lives under .mcdev (diffable, one owner), and a mirror
  // goes into the compile source set: a shard cannot implement an interface that
  // javac never sees, and a superagent worktree needs the same files present.
  const mirrored = []
  for (const stub of stubs) {
    const target = resolveInside(projectDir, '.mcdev', 'contract', stub.file)
    ensureDir(join(target, '..'))
    writeFileSync(target, stub.content, 'utf8')
    const mirror = resolveInside(projectDir, 'src', 'main', 'java', stub.file)
    ensureDir(join(mirror, '..'))
    if (!existsSync(mirror) || readFileSync(mirror, 'utf8') !== stub.content) writeFileSync(mirror, stub.content, 'utf8')
    mirrored.push(relative(projectDir, mirror).split('\\').join('/'))
  }
  writeFileSync(paths.contractFile, `${JSON.stringify(model, null, 2)}\n`, 'utf8')
  writeFileSync(
    paths.allowlistFile,
    `${JSON.stringify({ source: model.apiAllowlist.source, sha1: model.apiAllowlist.sha1, count: model.apiAllowlist.count, partial: model.apiAllowlist.partial, note: model.apiAllowlist.note, classes: allowlist.classes }, null, 2)}\n`,
```

</details>

**依据 2 · 源码核查**：[lib/arbitration/tool.js:93-110](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/tool.js#L93-L110)

构建 brief，返回前缀一致性。

<details>
<summary>查看原文（18行）</summary>

```text
  if (NEEDS_CONTRACT.has(action) && !existsSync(arbitrationPaths(projectDir).contractFile)) {
    throw new Error(`no frozen contract under ${projectDir}; run action=freeze first`)
  }

  if (action === 'brief') {
    const contract = readContract(projectDir)
    const shards = args.shard ? [args.shard] : (contract.modules ?? []).map(module => module.id)
    const briefs = shards.map(shard => buildBrief({ projectDir, shard, contract }))
    const fingerprints = prefixFingerprints({ projectDir, contract })
    const same = new Set(briefs.map(brief => brief.prefixHash)).size === 1
    return result({
      action,
      ok: true,
      summary: `Wrote ${briefs.length} brief(s); shared prefix ${same ? 'identical' : 'DIFFERS'} (${briefs[0].prefixHash.slice(0, 16)}…).`,
      paths: briefs.map(brief => brief.path).filter(Boolean),
      counts: { shards: briefs.length },
      extra: `prefix-shared-across-all-shards=${fingerprints.sharedPrefix}`,
    })
```

</details>

**依据 3 · 源码核查**：[lib/arbitration/merge.js:149-202](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/merge.js#L149-L202)

清单过滤、所有权短路和有序汇总。

<details>
<summary>查看原文（54行）</summary>

```text
export function mergeProject({ projectDir, dryRun = false }) {
  const contract = readContract(projectDir)
  const paths = arbitrationPaths(projectDir)
  const errors = []
  const shardEntries = []

  if (existsSync(paths.shardsDir)) {
    for (const shardId of readdirSync(paths.shardsDir).sort()) {
      const manifestPath = join(paths.shardsDir, shardId, MANIFEST_NAME)
      if (!existsSync(manifestPath)) { errors.push({ shard: shardId, error: 'missing-manifest' }); continue }
      let raw
      try { raw = JSON.parse(readFileSync(manifestPath, 'utf8')) } catch (error) {
        errors.push({ shard: shardId, error: `invalid-json: ${error.message}` })
        continue
      }
      const verdict = validateManifest(raw, { contract })
      if (!verdict.ok) { errors.push({ shard: shardId, error: 'invalid-manifest', details: verdict.errors }); continue }
      shardEntries.push({ shardId: verdict.value.shardId, manifest: verdict.value, dir: shardId })
    }
  }

  const conflicts = crossValidate(shardEntries.map(entry => ({ shardId: entry.shardId, manifest: entry.manifest })))
  if (conflicts.ownedFiles.length > 0) {
    return { ok: false, aborted: 'ownership-conflict', written: [], skipped: [], conflicts, errors, report: renderReport({ aborted: 'ownership-conflict', conflicts, errors, written: [], skipped: [] }) }
  }

  // Combined registrations: first shard wins, duplicates reported by crossValidate.
  const commandByName = new Map()
  const permissionByNode = new Map()
  const dependencies = []
  const dependencyKeys = new Set()
  const init = []
  const shutdown = []
  const modMetadata = {}

  for (const entry of shardEntries) {
    const { manifest } = entry
    for (const command of manifest.bukkitRegistrations.commands) if (!commandByName.has(command.name)) commandByName.set(command.name, command)
    for (const permission of manifest.bukkitRegistrations.permissions) if (!permissionByNode.has(permission.node)) permissionByNode.set(permission.node, permission)
    for (const dep of manifest.mavenDependencies) {
      const key = `${dep.group}:${dep.name}:${dep.version}:${dep.scope}`
      if (dependencyKeys.has(key)) continue
      dependencyKeys.add(key)
      dependencies.push(dep)
    }
    const priority = manifest.lifecycleHooks.onEnablePriority
    for (const statement of manifest.lifecycleHooks.initStatements) init.push({ shardId: entry.shardId, priority, statement })
    for (const statement of manifest.lifecycleHooks.onDisableStatements) shutdown.push({ shardId: entry.shardId, priority, statement })
    Object.assign(modMetadata, mergeJsonMetadata(modMetadata, manifest.modMetadata ?? {}))
  }

  init.sort((a, b) => a.priority - b.priority || a.shardId.localeCompare(b.shardId))
  // Teardown runs in reverse: what initialized last is disposed first.
  shutdown.sort((a, b) => b.priority - a.priority || b.shardId.localeCompare(a.shardId))
```

</details>

#### 缺口

- 未测合并失败的复原
  **影响**：真实多人工作区可能留下部分写入
  **进一步探讨**：先看 dryRun 再模拟后续文件写失败

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些输出仍需要人核对和真正编译？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

缺索引会标为 partial 并降级，附加类由调用参数输入。编译路由用正则识别诊断，未解析行被保留在内部结果但工具输出的 ok 用 routes 数或 totalErrors 为 0 推断，不能当构建成功；本轮没有路由的旧分片文件也没有在所读循环中删除。常规 merge 逐个改真实项目文件，无事务回滚；Gradle 调项目 wrapper，离线索引不约束该进程或依赖解析。

#### 证据与依据

**依据 1 · 源码核查**：[lib/arbitration/contract.js:111-139](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/contract.js#L111-L139)

缺索引与截断分别标记，参数补充类。

<details>
<summary>查看原文（29行）</summary>

```text
export function loadApiAllowlist({ platform, minecraftVersion, repoRoot = REPO, indexPath, extraAllowlist = [] }) {
  const extra = Array.isArray(extraAllowlist) ? extraAllowlist.map(String) : []
  if (!SKILL_OF_PLATFORM[platform]) return { source: null, sha1: null, classes: [...new Set(extra)].sort(), count: extra.length, partial: true, warning: `unknown platform ${platform}` }
  const relative = indexPath ?? posix.join('assets', 'skills', SKILL_OF_PLATFORM[platform], 'references', 'api-index', `${minecraftVersion}.md`)
  const absolute = indexPath ?? join(repoRoot, ...relative.split('/'))
  if (!existsSync(absolute)) {
    return {
      source: null,
      sha1: null,
      classes: [...new Set(extra)].sort(),
      count: extra.length,
      partial: true,
      warning: `no API index for ${platform} ${minecraftVersion}; the allowlist audit degrades to package prefixes`,
    }
  }
  const text = readFileSync(absolute, 'utf8')
  const classes = parseApiIndex(text)
  // Generated indexes are truncated by design; a class missing from a partial
  // index is not proof that the class does not exist.
  const ratio = /classes=(\d+)\/(\d+)/.exec(text)
  const partial = Boolean(ratio && Number(ratio[1]) < Number(ratio[2])) || /TRUNCATED/.test(text)
  const merged = [...new Set([...classes, ...extra])].sort()
  return {
    source: indexPath ? absolute : relative,
    sha1: createHash('sha1').update(text).digest('hex'),
    classes: merged,
    count: merged.length,
    partial,
  }
```

</details>

**依据 2 · 源码核查**：[lib/arbitration/route.js:56-83](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/route.js#L56-L83)

识别规定诊断格式，部分行进入 unparsed。

<details>
<summary>查看原文（28行）</summary>

```text
export function parseCompileErrors(log, projectDir = '') {
  const errors = []
  const unparsed = []
  const lines = String(log).split(/\r?\n/)
  let pending = null
  for (const line of lines) {
    const match = ERROR_LINE.exec(line.trim())
    if (match) {
      pending = {
        file: normalizePath(match.groups.file, projectDir),
        line: Number(match.groups.line),
        column: match.groups.column ? Number(match.groups.column) : undefined,
        message: match.groups.message.trim(),
        symbol: undefined,
      }
      errors.push(pending)
      continue
    }
    const symbol = SYMBOL_LINE.exec(line)
    if (symbol && pending) {
      pending.symbol = symbol.groups.symbol
      continue
    }
    if (/\berror\b|错误/i.test(line) && !/^\s*(?:\d+\s+errors?|FAILURE:|BUILD FAILED|> Task)/i.test(line)) {
      if (line.trim() !== '') unparsed.push(line.trim())
    }
  }
  return { errors, unparsed }
```

</details>

**依据 3 · 源码核查**：[lib/arbitration/route.js:219-231](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/route.js#L219-L231)

只写有路线的分片。

<details>
<summary>查看原文（13行）</summary>

```text
export function routeCompileLog({ projectDir, compileLog, write = false }) {
  const contract = readContract(projectDir)
  const parsed = parseCompileErrors(compileLog, projectDir)
  const result = routeErrors({ projectDir, errors: parsed.errors })
  const output = { ...result, unparsed: parsed.unparsed, platform: contract.platform, minecraftVersion: contract.minecraftVersion }
  if (write && existsSync(arbitrationPaths(projectDir).shardsDir)) {
    for (const route of output.routes) {
      const target = join(arbitrationPaths(projectDir).shardsDir, route.shard, 'compile-routes.json')
      if (!existsSync(join(arbitrationPaths(projectDir).shardsDir, route.shard))) continue
      writeFileSync(target, `${JSON.stringify(route, null, 2)}\n`, 'utf8')
    }
  }
  return output
```

</details>

**依据 4 · 源码核查**：[lib/arbitration/tool.js:175-188](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/tool.js#L175-L188)

工具结果以已解析数量判定，未输出 unparsed。

<details>
<summary>查看原文（14行）</summary>

```text
  if (action === 'route') {
    if (typeof args.compileLog !== 'string' || args.compileLog.trim() === '') throw new Error('route requires compileLog (the mc_gradle output)')
    const routing = routeCompileLog({ projectDir, compileLog: args.compileLog, write: true })
    const lines = []
    for (const route of routing.routes) lines.push(`${route.shard}: ${route.count} error(s) — ${route.errors.slice(0, 3).map(error => `${error.file}:${error.line}`).join(', ')}`)
    for (const error of routing.unowned.slice(0, 5)) lines.push(`unowned: ${error.file}:${error.line} ${error.message}`)
    return result({
      action,
      ok: routing.routes.length > 0 || routing.totalErrors === 0,
      summary: `${routing.totalErrors} compiler error(s) → ${routing.routes.length} shard(s), ${routing.unowned.length} unowned (this replaces the previous routing, it is not a tally)`
        + `${routing.contractCollapse ? `; CONTRACT COLLAPSE on ${routing.contractCollapse.symbol} (${Math.round(routing.contractCollapse.ratio * 100)}% of shards)` : ''}.`,
      paths: routing.routes.map(route => join(arbitrationPaths(projectDir).shardsDir, route.shard, 'compile-routes.json')),
      counts: { errors: routing.totalErrors, shards: routing.routes.length, unowned: routing.unowned.length },
      extra: lines.join('\n'),
```

</details>

**依据 5 · 源码核查**：[lib/arbitration/merge.js:321-345](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/merge.js#L321-L345)

非 dryRun 顺序写文件并生成报告。

<details>
<summary>查看原文（25行）</summary>

```text
  // A second merge must report nothing to write: identical content is not a change.
  const changed = []
  const unchanged = []
  for (const file of pending) {
    const existing = existsSync(file.path) ? readFileSync(file.path, 'utf8') : null
    if (existing === file.content) unchanged.push(relative(projectDir, file.path).split('\\').join('/'))
    else changed.push(file)
  }
  const changedPaths = new Set(changed.map(file => relative(projectDir, file.path).split('\\').join('/')))
  const writtenFinal = written.filter(item => changedPaths.has(item.file))

  let reportPath
  if (!dryRun) {
    for (const file of changed) {
      ensureDir(join(file.path, '..'))
      writeFileSync(file.path, file.content, 'utf8')
    }
    ensureDir(paths.reportsDir)
    reportPath = paths.mergeReport
    writeFileSync(reportPath, renderReport({ contract, written: writtenFinal, skipped, conflicts, errors, notes, unchanged, shards: shardEntries.map(entry => entry.shardId) }), 'utf8')
  }

  return {
    ok: errors.length === 0,
    dryRun,
```

</details>

**依据 6 · 源码核查**：[lib/gradle.js:79-91](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/gradle.js#L79-L91)

以指定项目为 cwd 跑 wrapper。

<details>
<summary>查看原文（13行）</summary>

```text
export function runGradle(options) {
  const { projectDir, task, args = [], timeoutMs, signal, tailChars, internals = {} } = options
  const platform = internals.platform ?? process.platform
  const argv = gradleArgv({ platform, projectDir, task, args })
  return runProcess({
    argv,
    cwd: projectDir,
    timeoutMs,
    tailChars,
    signal,
    labels: { program: 'gradlew', abort: 'mc_gradle' },
    internals,
  })
```

</details>

#### 缺口

- 真实 Gradle 和诊断格式未经验证
  **影响**：可能漏错、遗留旧路由或出现部分落盘
  **进一步探讨**：用人工构造日志并检查真实项目文件差异

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证重复冲突能否提前处理？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

用不含可执行 wrapper 的两片虚拟项目，先在临时项目冻契约；分别注入重叠所有权、缺清单和两种诊断格式。只跑 dryRun 合并和合成日志路由，核对文件树和真实路由输出。将计划和手工复核比较，若漏诊断或手工定位更直接，就收窄采用范围。

#### 证据与依据

**依据 1 · 源码核查**：[tools.js:224-232](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/tools.js#L224-L232)

提供外部验证的类名提示、force 和 dryRun。

```text
        description: 'freeze: extra fully-qualified classes to allow (e.g. classes you verified with javap against the real jar when the bundled index is truncated).',
      },
      allowlistNote: {
        type: 'string',
        description: 'freeze: why the allowlist was extended; stored in api-allowlist.json next to the class list.',
      },
      shard: { type: 'string', description: 'brief/audit: limit the action to one shard id.' },
      force: { type: 'boolean', description: 'freeze: replace an existing frozen contract (also overrides shardedArbitration=off).' },
      dryRun: { type: 'boolean', description: 'merge: report the planned writes without touching the project.' },
```

**依据 2 · 源码核查**：[lib/arbitration/merge.js:155-173](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/merge.js#L155-L173)

能构造清单缺失与重叠所有权对照。

<details>
<summary>查看原文（19行）</summary>

```text
  if (existsSync(paths.shardsDir)) {
    for (const shardId of readdirSync(paths.shardsDir).sort()) {
      const manifestPath = join(paths.shardsDir, shardId, MANIFEST_NAME)
      if (!existsSync(manifestPath)) { errors.push({ shard: shardId, error: 'missing-manifest' }); continue }
      let raw
      try { raw = JSON.parse(readFileSync(manifestPath, 'utf8')) } catch (error) {
        errors.push({ shard: shardId, error: `invalid-json: ${error.message}` })
        continue
      }
      const verdict = validateManifest(raw, { contract })
      if (!verdict.ok) { errors.push({ shard: shardId, error: 'invalid-manifest', details: verdict.errors }); continue }
      shardEntries.push({ shardId: verdict.value.shardId, manifest: verdict.value, dir: shardId })
    }
  }

  const conflicts = crossValidate(shardEntries.map(entry => ({ shardId: entry.shardId, manifest: entry.manifest })))
  if (conflicts.ownedFiles.length > 0) {
    return { ok: false, aborted: 'ownership-conflict', written: [], skipped: [], conflicts, errors, report: renderReport({ aborted: 'ownership-conflict', conflicts, errors, written: [], skipped: [] }) }
  }
```

</details>

**依据 3 · 源码核查**：[lib/arbitration/route.js:155-185](https://github.com/sikadi233-hub/minecraft-dev/blob/0fef2ba9514b5c8cad62c36b05c85bc54d50047c/lib/arbitration/route.js#L155-L185)

所有权、路径范围和注入语句定位，重复符号按启发阈值升级。

<details>
<summary>查看原文（31行）</summary>

```text
  }
  const routes = new Map()
  const unowned = []
  for (const error of errors) {
    let shard = byFile.get(error.file)
    if (!shard) shard = byScope.find(entry => error.file.startsWith(entry.scope))?.shard
    if (!shard) {
      // A shared file: the error may still be an injected statement's fault.
      const injected = injectedFor(error)
      if (injected) { shard = injected; error.origin = 'injected-statement' }
    }
    if (!shard) { unowned.push(error); continue }
    if (!routes.has(shard)) routes.set(shard, [])
    routes.get(shard).push(error)
  }

  // Contract collapse: one missing symbol that most shards cannot see is a
  // contract problem, not N independent mistakes.
  const symbolShards = new Map()
  for (const error of errors) {
    if (!error.symbol) continue
    if (!symbolShards.has(error.symbol)) symbolShards.set(error.symbol, new Set())
    const shard = byFile.get(error.file) ?? byScope.find(entry => error.file.startsWith(entry.scope))?.shard
    if (shard) symbolShards.get(error.symbol).add(shard)
  }
  const totalShards = new Set([...byFile.values(), ...byScope.map(entry => entry.shard)]).size
  let contractCollapse
  for (const [symbol, shards] of symbolShards) {
    if (shards.size >= 2 && totalShards > 0 && shards.size / totalShards >= 0.5) {
      contractCollapse = { symbol, shards: [...shards].sort(), ratio: Number((shards.size / totalShards).toFixed(2)) }
      break
```

</details>

#### 缺口

- 减少返工是假设
  **影响**：尚无实测定量收益
  **进一步探讨**：比较定位回合、漏诊断和实际写入差异

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
