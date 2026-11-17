# DSH Skill Explorer

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5cdf871](https://github.com/zhu1090093659/dsh-web/tree/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer)

<!-- BEGIN META -->
[![GitHub ★ 10,442](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C442&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 160,579](https://img.shields.io/static/v1?label=npm+30d&message=160%2C579&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)
<!-- END META -->

> **功能**：在 DSH Web 按来源浏览、编辑、创建、导入或停用 Skill。

> **亮点**：[Q01](#research-q01) 借扫描和 registry 优先级提供来源视图。[Q02](#research-q02) 再扫描可拒绝同名目标切换后的写入，明确区分普通文件和 provider 记录。

> **主要限制**：[Q02](#research-q02) 面板记录可影响呈现，真实 provider 仍可能被模型读取。[Q03](#research-q03) 存在回环、配对及宿主连接准入路径，真实部署要查实际通过条件。

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
  - [Q01 · 如何定位多个工作区里的同名 Skill？](#detail-section-11)
  - [Q02 · 普通开关和提供者开关分别改哪里？](#detail-section-12)
  - [Q03 · 网站访问通过哪几个准入条件？](#detail-section-13)
  - [Q04 · 一次修改怎样确认生效并能退回？](#detail-section-14)
  - [Q05 · 如何证明标出开关作用范围能减少错判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合维护多个 DSH 工作区的开发者，查同名 Skill 的获选来源，再修改一条可恢复的项目文件。

[Q01](#research-q01) 手工打开文件与使用会话目录可以交叉定位。面板将多层来源放在同一处，使用时仍应核对真实目标会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 来源视图 | 理清项目、用户与注册表来源 | 预设作用域需要查目标会话 |
| 文件编辑 | 修改普通 SKILL.md 或排他导入 | 依据当前项目与实际获选路径 |
| 提供者开关 | 改变面板上的可调用状态 | 真实停用还须查提供者配置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH >=0.2.2-rc.3 与所需 Web 服务 | 必需 | 注册宿主路由与面板 | 旧宿主或注入不足会影响装载 |
| 可读项目、用户目录和注册表 | 代表任务必需 | 获取当前有效 Skill | 读取不完整要从会话确认 |
| 宿主连接认证或配对 | 远端按需 | 通过路由访问边界 | 路由还检查回环与其他有效入口 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对独立项目、宿主与原 Skill 文件 | 记录项目根和当前会话来源 |
| 修改 | 完成一次普通文件开关或编辑 | 文件路径及差异正确 |
| 验收 | 在目标会话核对实际目录 | 不符时回到编辑器和原生目录 |
| 退出 | 恢复原文件并移除试用配置 | 重查会话与网络，区分面板状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 软件与环境资源未知 | 核对版本、项目根和可撤回文件 | 远端认证额外核查 |
| 持续使用 | 扫描耗用未知 | 比对同名来源、会话上下文 | 未测减少的切换次数 |
| 失败恢复 | 重载耗用未知 | 回查冲突与缓存并恢复文件 | 同路径并发仍应独立确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 来源定位 | 扫描与 registry 按层级合并 | 预设下的实际发现和节时 |
| 真实编辑 | 对普通文件执行防陈旧路径的写入 | 外部并发和加载时机 |
| 提供者开关 | 面板保存独立状态 | 会话真实权限仍需查提供者 |

> **思考**：[Q02](#research-q02) 面板记录可影响呈现，真实 provider 仍可能被模型读取。[Q03](#research-q03) 存在回环、配对及宿主连接准入路径，真实部署要查实际通过条件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 借扫描和 registry 优先级提供来源视图。[Q02](#research-q02) 再扫描可拒绝同名目标切换后的写入，明确区分普通文件和 provider 记录。

[Q02](#research-q02) 使用重新扫描及排他创建分别处理陈旧目标和覆盖冲突。[Q03](#research-q03) 可选宿主认证通过作用域取得子服务，其他准入仍按原分支判断。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 面板记录可影响呈现，真实 provider 仍可能被模型读取。[Q03](#research-q03) 存在回环、配对及宿主连接准入路径，真实部署要查实际通过条件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅用一条可恢复的普通项目 Skill 在隔离环境试用。先核对项目与文件，再检查写入和目标会话。出现不一致时撤回文件并回到编辑器与原生会话目录。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码验证了来源聚合、真实文件修改和走不同语义的提供者开关。连接桥、已发布产物与实际会话效果待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-skill-explorer/src/collect.ts、packages/dsh-skill-explorer/README.md、packages/dsh-skill-explorer/src/routes.ts、packages/dsh-skill-explorer/src/import.ts、packages/dsh-skill-explorer/package.json、packages/dsh-skill-explorer/cordis.patch.yml、packages/dsh-skill-explorer/src/index.ts、packages/dsh-skill-explorer/src/access.ts、packages/dsh-skill-explorer/src/client/index.ts、packages/dsh-skill-explorer/src/client/telemetry.ts 及固定范围 inventory；组件：packages/dsh-skill-explorer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定子包的扫描、写入、会话目录、宿主连接桥、心跳和代表性导入。未执行目标及实际宿主、远端与打包产物。
- 下一步：[Q05](#research-q05) 在同宿主、同项目与预设分别对照文件变化、面板状态和实际会话目录。另查真实网络路径和准入。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.19（[固定提交 5cdf871](https://github.com/zhu1090093659/dsh-web/tree/5cdf8717475b6cbf85604f3c5428f332416c978b)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将作用范围、写入对象和会话回读并列提示，用同名、预设和提供者反例比较误停用。

[Q05](#research-q05) 在同宿主、同项目与预设分别对照文件变化、面板状态和实际会话目录。另查真实网络路径和准入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 481 | — | — | 6455 |
| .ts | source | 23 | 4070 | 2498 | 1328 | — |
| .tsx | source | 6 | 1148 | 886 | 201 | — |
| .ts | test | 16 | 4484 | 3303 | 706 | — |
| .tsx | test | 2 | 1026 | 780 | 159 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=155&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 152](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=152&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多工作区里如何找对并修改目标 Skill，面板状态和真实会话可调用性各能证明什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何定位多个工作区里的同名 Skill？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合在多个项目维护同名 SKILL.md、要找出当前面板为什么选中一条的开发者。服务扫描当前及其他有效项目的 .dsh 和 .agents、用户根以及自定义路径，再按各 cwd 查全局 registry。低排名序号的声明可替换弱来源，等序位可补描述和调用元数据。注册表失败时仍返回文件扫描结果，但以 complete 区分缺项。相对手工逐目录打开，面板提供同一查找入口和来源。会话实际能加载什么还受预设作用域影响，作者明确把仅预设内的 provider 列为范围外。合格任务要在编辑器及真实目标会话都核对来源。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:492-525](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/collect.ts#L492-L525)

项目与用户扫描和注册表快照。

<details>
<summary>查看原文（34行）</summary>

```text
export async function collectSkills(options: CollectOptions): Promise<CollectResult> {
  const { cwd, customSkillDirs, dshHome, agentsHome, registry } = options
  const byName = new Map<string, SkillEntry>()
  const activeProjectRoot = findProjectRoot(cwd)
  const roots = new Set<string>(options.projectRoots !== undefined && options.projectRoots.length > 0 ? [activeProjectRoot, ...options.projectRoots] : [activeProjectRoot])
  // Each root scans independently, in parallel (Map writes are atomic under the single thread).
  const scanTasks: Array<Promise<void>> = []
  for (const root of roots) {
    const isActive = root === activeProjectRoot || root === cwd
    const wsInfo = {
      root,
      name: basename(root) || root,
      active: isActive,
    }
    scanTasks.push(scanSkillRoot(join(root, '.dsh', 'skills'), 'project-dsh', byName, wsInfo))
    scanTasks.push(scanSkillRoot(join(root, '.agents', 'skills'), 'project-agents', byName, wsInfo))
  }
  for (const dir of normalizeSkillRoots(customSkillDirs ?? [])) scanTasks.push(scanSkillRoot(dir, 'custom', byName))
  scanTasks.push(scanSkillRoot(join(dshHome, 'skills'), 'user-dsh', byName, undefined, true))
  scanTasks.push(scanSkillRoot(join(agentsHome, 'skills'), 'user-agents', byName))
  await Promise.all(scanTasks)

  // Registry supplement: same-name skills get whenToUse / invocation flags
  // filled in; registry-only skills (bundled / runtime) join as-is.
  // Query the registry for primary cwd and any other active project roots so
  // project-level providers are captured.
  const snapshotCwds = new Set<string>([cwd, ...roots])
  let complete = true
  for (const snapshotCwd of snapshotCwds) {
    try {
      const snapshot = await registry.snapshot({ cwd: snapshotCwd })
      if (snapshot.complete !== true) complete = false
      for (const skill of snapshot.skills) {
        const existing = byName.get(skill.name)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:526-560](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/collect.ts#L526-L560)

按相对优先级合并并保留不完整标志。

<details>
<summary>查看原文（35行）</summary>

```text
        const serialized = serializeRegistry(skill)
        if (existing === undefined) {
          byName.set(skill.name, serialized)
          continue
        }
        // The registry outranks a scanned entry of a weaker source, the way
        // the official registry resolves a duplicate by rank. Without this an
        // unquestioned filesystem entry would win even when the official
        // winner is a runtime registration, so the panel would name a different
        // skill than the model receives.
        if (rankOf(serialized.level) < rankOf(existing.level)) {
          byName.set(skill.name, serialized)
          continue
        }
        if (rankOf(serialized.level) > rankOf(existing.level)) continue
        if (serialized.whenToUse !== undefined) existing.whenToUse = serialized.whenToUse
        if (serialized.provider !== undefined) existing.provider = serialized.provider
        // Only let the registry refine invocation when it actually states a
        // policy. scanSkillRoot() already resolved the file frontmatter with
        // the official rule (omitted => allowed), so overwriting it with the
        // serialized default would re-introduce the false-negative that made
        // every skill render as not invocable.
        if (skill.invocation?.modelInvocable !== undefined) existing.modelInvocable = skill.invocation.modelInvocable
        if (skill.invocation?.userInvocable !== undefined) existing.userInvocable = skill.invocation.userInvocable
      }
    } catch {
      // Registry unavailable: the filesystem result still stands.
      complete = false
    }
  }
  // The panel's own provider-skill switches close the collection: a row the
  // user switched off reads as not model invocable here, exactly like a
  // skill whose own frontmatter disables model invocation.
  applyProviderToggles(byName.values(), options.providerDisabledSkills ?? [])
  return { skills: [...byName.values()], complete }
```

</details>

**依据 3 · 作者声明**：[packages/dsh-skill-explorer/README.md:198-211](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/README.md#L198-L211)

作者说明作用域与提供者开关边界。

<details>
<summary>查看原文（14行）</summary>

```text
- The panel covers the filesystem roots it scans plus the global layer of the
  `ctx.skills` registry (bundled and runtime entries). `customSkillDirs`
  declared on a host-plane `skill-filesystem` row are scanned, because the
  host reads that row's config; a skill that reaches an agent only through an
  **agent preset's** own `customSkillDirs` or a preset-scoped provider is
  outside that coverage, because the panel reads the registry without a
  viewing scope. A skill absent from the panel is therefore not necessarily
  absent from the model: the official `skill` tool catalog is the authority on
  what a session can load.
- The switch on a **"Provided by plugin"** row is a panel-local view
  decision: it changes what this panel lists as invocable, not what the host
  registry loads, so the model still receives the skill. Taking such a skill
  away from the model for real means removing or disabling it where its
  provider gets it.
```

</details>

#### 缺口

- 缺实际多预设运行。
  **影响**：面板缺行不能代表真实会话找不到。
  **进一步探讨**：对同名项目和预设条目比较面板与会话目录。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 普通开关和提供者开关分别改哪里？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

普通开关在当下查一次工作区扫描，只有请求的路径和此时同名获选文件一致才写 disable-model-invocation。缺可编辑文件返回未找到，陈旧路径返回冲突。这个比较限定目标文件身份，未比较文件内容哈希或外部并发变更。提供者开关将 provider 与 name 存进面板记录，关闭暂时改变面板的可调用投影；真实宿主仍可将它提供给模型，要从其供应配置撤回。写入后尽量失效宿主与预设缓存并提示目录变化，缓存读取或失效报错不会回滚已写的文件。导入沿当前工作区来检查遮挡并选择目标根，写入采用排他创建。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:195-243](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L195-L243)

工作区定位、重新扫描与缓存失效。

<details>
<summary>查看原文（49行）</summary>

```text
  const panelCwd = (override?: string): string =>
    (override !== undefined && override.trim() !== '' ? override : undefined)
    ?? safeSessionCwds()[0]
    ?? DEFAULT_CWD()

  /** Find a skill by name from a fresh collection pass (trusts scanned paths only). */
  const findSkill = async (name: string, cwd: string): Promise<SkillEntry | undefined> => {
    const { skills } = await collectSkills(await collectOptions(cwd))
    return skills.find((candidate) => candidate.name === name)
  }

  /**
   * Drop host and preset-scoped skill registry caches and signal the client
   * slash-menu cache after any disk write commits (#2041). Never emits session
   * events or touches session history.
   */
  const notifySkillCatalogChanged = (): void => {
    const skillTargets = new Set<unknown>()
    try {
      const liveSkills = (ctx as unknown as {
        get?(name: string, strict?: boolean): unknown
      }).get?.('skills', false) ?? (ctx as unknown as { skills?: unknown }).skills ?? registry
      if (liveSkills !== undefined && liveSkills !== null) skillTargets.add(liveSkills)
    } catch {
      // Cache lookup stays best-effort after the skill file mutation succeeded.
    }
    try {
      const store = (ctx as unknown as {
        reflect?: { store?: Record<symbol, { name?: string; value?: unknown }> }
      }).reflect?.store
      if (store !== undefined && store !== null) {
        for (const sym of Object.getOwnPropertySymbols(store)) {
          const entry = store[sym]
          if (entry?.name === 'skills' && entry.value !== undefined && entry.value !== null) {
            skillTargets.add(entry.value)
          }
        }
      }
    } catch {
      // Preset-scoped cache discovery stays best-effort.
    }
    for (const target of skillTargets) {
      try {
        ;(target as { invalidateCache?(): void }).invalidateCache?.()
      } catch {
        // Cache invalidation stays best-effort after the skill file mutation succeeded.
      }
    }
    try {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:271-287](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L271-L287)

路径不匹配拒绝。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Resolve the exact file the panel showed, rejecting stale same-name fallbacks. */
  const resolveScannedSkill = async (
    name: string,
    expectedPath: string,
    cwd: string,
    res: ServerResponse,
  ): Promise<(SkillEntry & { path: string }) | undefined> => {
    const skill = await findSkill(name, cwd)
    if (skill?.path === undefined) {
      writeJson(res, 404, { error: `skill ${name} has no editable file` })
      return undefined
    }
    if (skill.path !== expectedPath) {
      writeJson(res, 409, { error: `skill ${name} changed since the panel loaded; refresh and retry` })
      return undefined
    }
    return skill as SkillEntry & { path: string }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:354-375](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L354-L375)

普通开关写 frontmatter 并通知。

<details>
<summary>查看原文（22行）</summary>

```text
          }
          const payload = body as Record<string, unknown>
          const { name, path, enabled } = payload
          if (typeof name !== 'string' || !isSkillName(name) || typeof path !== 'string' || path.trim() === '' || typeof enabled !== 'boolean') {
            writeJson(res, 400, { error: 'expected { name, path, enabled }' })
            return
          }
          // The client path is only an identity claim: a fresh scan must
          // resolve the same effective skill before any file is touched.
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // Disabled = disable-model-invocation: true; enabled = false.
          const frontmatter = setFrontmatterField(skill.path, 'disable-model-invocation', !enabled)
          notifySkillCatalogChanged()
          writeJson(res, 200, {
            name,
            enabled: frontmatter.disableModelInvocation !== true,
            modelInvocable: frontmatter.disableModelInvocation !== true,
            path: skill.path,
          })
        } catch (error) {
          logger.warn(error)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:394-423](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L394-L423)

提供者开关按记录操作。

<details>
<summary>查看原文（30行）</summary>

```text
            writeJson(res, 400, { error: 'expected { name, provider, enabled }' })
            return
          }
          const identity = providerSkillIdentity(name, provider)
          if (identity === undefined) {
            writeJson(res, 400, { error: 'name must be kebab-case (lowercase letters/digits first) and provider a short provider id' })
            return
          }
          if (enabled) {
            // Enabling only ever drops a record, so it stays allowed for a
            // skill the panel no longer lists: a plugin can be uninstalled
            // while its record is still stored, and that record must remain
            // removable. Nothing is written when it is already absent.
            await setProviderSkillEnabled(dshHome, identity, true)
            notifySkillCatalogChanged()
            writeJson(res, 200, { ok: true, name: identity.name, provider: identity.provider, disabled: false })
            return
          }
          // Disabling creates a record the panel will honor from the next list
          // on, so it must address a skill a fresh collection still lists as
          // plugin-provided — the same "only what the panel showed" rule the
          // file write routes follow, here with the identity instead of a path.
          const skill = await findProviderSkill(identity, panelCwd())
          if (skill === undefined) {
            writeJson(res, 404, { error: `skill ${identity.name} is not a plugin-provided skill with a local file` })
            return
          }
          await setProviderSkillEnabled(dshHome, identity, false)
          notifySkillCatalogChanged()
          writeJson(res, 200, { ok: true, name: identity.name, provider: identity.provider, disabled: true })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:501-519](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L501-L519)

同一个面板工作区规划导入。

<details>
<summary>查看原文（19行）</summary>

```text
            writeJson(res, 400, { error: 'cwd is required (the workspace shown by the panel)' })
            return
          }
          const resolved = resolveImportSource(source)
          if (typeof resolved === 'string') {
            writeJson(res, 400, { error: resolved })
            return
          }
          // The conflict rule reads the catalog of the workspace the panel is
          // showing, resolved exactly like the list route (and like create):
          // a different base workspace would rank a project skill against the
          // wrong root and import a file that is immediately shadowed.
          const workspace = panelCwd(cwd)
          const targetLevel = root === 'user' ? 'user-dsh' : 'project-dsh'
          const baseDir = root === 'user' ? userSkillRoot(dshHome) : projectSkillRoot(findProjectRoot(cwd))
          const { skills } = await collectSkills(await collectOptions(workspace))
          const report = await importSkills({ baseDir, targetLevel, source: resolved, existing: skills })
          notifySkillCatalogChanged()
          writeJson(res, 200, { ok: true, ...report })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:371-399](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/import.ts#L371-L399)

排他创建保已有文件。

<details>
<summary>查看原文（29行）</summary>

```text
 * Write the planned candidates into one skill root. Every write is a new file:
 * an existing SKILL.md is never overwritten, and a failure after the first
 * file leaves the earlier imports in place (each one is individually valid and
 * the panel simply lists them — the report says which succeeded).
 * @param plan - the plan from planImport.
 * @param baseDir - the target skill root.
 * @returns one outcome per plan item, in plan order.
 */
export async function executeImport(plan: readonly ImportPlanItem[], baseDir: string): Promise<ImportOutcome[]> {
  const outcomes: ImportOutcome[] = []
  for (const item of plan) {
    const { candidate } = item
    if (item.decision === 'skip') {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: item.reason })
      continue
    }
    const targetDir = join(baseDir, candidate.name)
    const target = join(targetDir, 'SKILL.md')
    if (existsSync(target)) {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: 'exists' })
      continue
    }
    // The name is a validated kebab-case skill name, so this can only ever
    // create one directory directly under the target root. The write itself
    // uses O_EXCL ('wx'), so two concurrent imports of the same name cannot
    // both win even if both pass the existsSync check above.
    await mkdir(targetDir, { recursive: true })
    await writeFile(target, candidate.content, { encoding: 'utf8', flag: 'wx' })
    outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'imported', path: target })
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:556-560](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/collect.ts#L556-L560)

仅在面板投影施加 provider 开关。

```text
  // The panel's own provider-skill switches close the collection: a row the
  // user switched off reads as not model invocable here, exactly like a
  // skill whose own frontmatter disables model invocation.
  applyProviderToggles(byName.values(), options.providerDisabledSkills ?? [])
  return { skills: [...byName.values()], complete }
```

#### 缺口

- 未运行编辑冲突、缓存失效与重载。
  **影响**：同路径编辑和宿主加载时间未知。
  **进一步探讨**：用临时项目分别做同路径编辑、路径替换、提供者开关和会话回查。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 网站访问通过哪几个准入条件？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

包通过 Cordis 挂载自身，宿主依赖 skills、sessions 和 webServer，客户端依赖布局、插槽和本地化。清单声明 DSH >=0.2.2-rc.3。实际路由先校验宿主 connection，要求 admit 返回有 peer 且无 rejection，兼容接口以没有 requestRejection 为通过。可选注入同时请求 connection 和 connection.authentication；宿主不能回答时仍落到既有配对或回环检查。拒绝的 HTTP 请求进不了路由主体，检查还限制 HTTP 方法。宿主认证只是多个可独立放行的分支之一。Web apply 另尝试外发心跳，普通安装应审查 dsh-market 端点及本地浏览器标识。Web 挂载成功与发布成品／远端请求是否实际发生仍需分别检查。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/package.json:9-37](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/package.json#L9-L37)

入口分发及宿主门槛。

<details>
<summary>查看原文（29行）</summary>

```text
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/cordis.patch.yml:5-7](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/cordis.patch.yml#L5-L7)

实际挂载声明。

```text
- insert:
    - id: ui-skill-explorer
      name: '@linxin666/dsh-client-ui-skill-explorer'
```

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:109-125](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/index.ts#L109-L125)

将可选连接桥交给真实路由。

<details>
<summary>查看原文（17行）</summary>

```text
  const connection = captureConnection(ctx)
  const routes = makeRoutes(ctx, {
    dshHome,
    agentsHome,
    customSkillDirs,
    registry: skillCtx.skills,
    activeSessionCwds,
    logger: { warn: (error: unknown) => ctx.logger.warn(error) },
    connection,
  })

  ctx.effect(() => {
    const disposers = routes.map((route) => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'skill-explorer: routes')
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/access.ts:52-103](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/access.ts#L52-L103)

准入、降级与可选注入。

<details>
<summary>查看原文（52行）</summary>

```text
function connectionAdmits(connection: HostConnectionService, request: IncomingMessage): boolean {
  try {
    if (typeof connection.admit === 'function') {
      const admission = connection.admit(request)
      return admission.rejection === undefined && 'peer' in admission && admission.peer !== undefined
    }
    if (typeof connection.requestRejection === 'function') return connection.requestRejection(request) === undefined
    return false
  } catch {
    return false
  }
}

/**
 * Whether this request may enter any /api/dsh-skill-explorer route.
 * @param ctx - host context; may expose remoteWebUiPairing or connection.
 * @param request - the incoming HTTP request.
 * @returns true for loopback, a live paired-device cookie, or an admitted host connection.
 */
export function isSkillExplorerAllowed(
  ctx: Context,
  request: IncomingMessage,
  connection: HostConnectionService | undefined = resolveConnection(ctx),
): boolean {
  if (connection !== undefined && connectionAdmits(connection, request)) return true
  return isPairedOrLoopbackAllowed(ctx, request)
}

/**
 * Capture the host connection service in a scope that injects BOTH
 * `connection` and `connection.authentication`, the two services its
 * `admit(request)` bridge reads. The row's own `inject` list stays unchanged
 * (the service stays optional), and a cohort whose connection has no
 * authentication sub-service never activates this scope, so the reader keeps
 * returning whatever a bare lookup finds.
 * @param ctx - the plugin context.
 * @returns a reader of the captured service, undefined before it activates.
 */
export function captureConnection(ctx: Context): () => HostConnectionService | undefined {
  let captured: HostConnectionService | undefined
  const inject = (ctx as { inject?: (names: readonly string[], callback: (scoped: Context) => unknown) => unknown }).inject
  if (typeof inject === 'function') {
    inject.call(ctx, ['connection', 'connection.authentication'], (scoped: Context) => {
      scoped.effect(() => {
        captured = resolveConnection(scoped)
        return () => {
          captured = undefined
        }
      }, 'skill-explorer: connection trust')
    })
  }
  return () => captured ?? resolveConnection(ctx)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:138-149](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L138-L149)

守卫拒绝并约束方法。

<details>
<summary>查看原文（12行）</summary>

```text
  /** Guard helper: fence + method check. */
  const guard = (req: IncomingMessage, res: ServerResponse, method: string): boolean => {
    if (!isSkillExplorerAllowed(ctx, req, connection())) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: `method not allowed: ${req.method}` })
      return false
    }
    return true
  }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/client/index.ts:50-61](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/client/index.ts#L50-L61)

启动尝试心跳和注册词典。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-client-ui-skill-explorer' }])

  ctx.effect(() => {
    try {
      return ctx.locale.register(NS, { zh, en })
    } catch {
      return () => {}
    }
  }, 'skill-explorer: dictionaries')
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/client/index.ts:75-103](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/client/index.ts#L75-L103)

布局与真实面板注册。

<details>
<summary>查看原文（29行）</summary>

```text
  const controller = new PanelController({
    panel: {
      select: panelId => {
        const layout = (ctx as unknown as { get?(name: string): unknown }).get?.('layout') as { selectPanel?: (id: string | null) => void } | undefined
        layout?.selectPanel?.(panelId)
      },
    },
  })
  const disposers: Array<() => void> = []
  try {
    disposers.push(registerSkillExplorerPanel(ctx, controller, api))
    // The layout's panel selection is reconciled back into the controller, so
    // the panel follows the user clicking another panel row.
    const layoutFace = (ctx as unknown as { get?(name: string): unknown }).get?.('layout') as { panelInfo?: { subscribe(listener: () => void): () => void; getSnapshot(): { activePanelId: unknown } } } | undefined
    if (layoutFace?.panelInfo !== undefined) {
      const sync = (): void => {
        const active = layoutFace.panelInfo!.getSnapshot().activePanelId
        controller.syncPanelSelection(active === SKILL_EXPLORER_PANEL_ID ? SKILL_EXPLORER_PANEL_ID : null)
      }
      sync()
      disposers.push(layoutFace.panelInfo.subscribe(sync))
    }
  } catch (error) {
    // Registration failures degrade the panel, never the GUI.
    console.warn('[skill-explorer] panel registration failed:', error)
  }
  ctx.effect(() => () => {
    for (const dispose of disposers.splice(0)) dispose()
  }, 'skill-explorer: ui mounts')
```

</details>

**依据 8 · 源码核查**：[packages/dsh-skill-explorer/src/client/telemetry.ts:119-150](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/client/telemetry.ts#L119-L150)

存储、自动化跳过、请求正文与发送。

<details>
<summary>查看原文（32行）</summary>

```text
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
}
```

</details>

#### 缺口

- 真实配对和代理环境未核实。
  **影响**：不能以接口名字假定所有部署的鉴权或数据发送相同。
  **进一步探讨**：在目标本机、配对客户端和无凭据请求分别观测。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一次修改怎样确认生效并能退回？

**研究主题**：采用判断、效果与总成本、缺陷与关键质疑

#### 完整回答

先有一个独立项目和可恢复的普通 SKILL.md，记下原文和实际会话看到的条目。打开面板选中项目及同名技能，核对来源后切一次，再比较磁盘差异和目标会话实际可调用范围。若路径不同或来源变动，刷新并手工查；若文件写对但会话仍显示旧范围，先核查官方目录与预设。涉及 provider 的开关不能用作安全控制。首次负担是确认版本、配对或本机权限，持续负担是同名及并发编辑的回查。错误发生时恢复原文件与原工作方式；移除 UI 后也要独立复核先前已写文件和请求。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:271-287](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L271-L287)

约束目标路径，陈旧时给明确冲突。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Resolve the exact file the panel showed, rejecting stale same-name fallbacks. */
  const resolveScannedSkill = async (
    name: string,
    expectedPath: string,
    cwd: string,
    res: ServerResponse,
  ): Promise<(SkillEntry & { path: string }) | undefined> => {
    const skill = await findSkill(name, cwd)
    if (skill?.path === undefined) {
      writeJson(res, 404, { error: `skill ${name} has no editable file` })
      return undefined
    }
    if (skill.path !== expectedPath) {
      writeJson(res, 409, { error: `skill ${name} changed since the panel loaded; refresh and retry` })
      return undefined
    }
    return skill as SkillEntry & { path: string }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:361-373](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L361-L373)

实际写入可人工回读。

<details>
<summary>查看原文（13行）</summary>

```text
          // The client path is only an identity claim: a fresh scan must
          // resolve the same effective skill before any file is touched.
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // Disabled = disable-model-invocation: true; enabled = false.
          const frontmatter = setFrontmatterField(skill.path, 'disable-model-invocation', !enabled)
          notifySkillCatalogChanged()
          writeJson(res, 200, {
            name,
            enabled: frontmatter.disableModelInvocation !== true,
            modelInvocable: frontmatter.disableModelInvocation !== true,
            path: skill.path,
          })
```

</details>

**依据 3 · 作者声明**：[packages/dsh-skill-explorer/README.md:198-211](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/README.md#L198-L211)

会话目录及 provider 限制。

<details>
<summary>查看原文（14行）</summary>

```text
- The panel covers the filesystem roots it scans plus the global layer of the
  `ctx.skills` registry (bundled and runtime entries). `customSkillDirs`
  declared on a host-plane `skill-filesystem` row are scanned, because the
  host reads that row's config; a skill that reaches an agent only through an
  **agent preset's** own `customSkillDirs` or a preset-scoped provider is
  outside that coverage, because the panel reads the registry without a
  viewing scope. A skill absent from the panel is therefore not necessarily
  absent from the model: the official `skill` tool catalog is the authority on
  what a session can load.
- The switch on a **"Provided by plugin"** row is a panel-local view
  decision: it changes what this panel lists as invocable, not what the host
  registry loads, so the model still receives the skill. Taking such a skill
  away from the model for real means removing or disabling it where its
  provider gets it.
```

</details>

#### 缺口

- 无源码以外的费用和误操作时间。
  **影响**：采用只限独立项目可撤回的试用。
  **进一步探讨**：定时记录定位、编辑、目标会话回读与复原时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何证明标出开关作用范围能减少错判？

**研究主题**：新假设与验证

#### 完整回答

假设面板若在确认前显示当前项目根、文件写入或面板记录，完成后显示目标会话的实际加载状态，会减少把面板隐藏当成禁用。用项目与用户同名 Skill、预设专属 Skill 和 provider 三种反例比较现有界面与带提示的草稿。两组同样要定位并撤回某条可调用 Skill，以实际文件和会话目录作真值。记录改错文件次数、误以为安全控制生效的次数与核验时间。如果错误不下降，或提示负担明显盖过收益，停止该方向。该设计待验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:354-373](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L354-L373)

普通开关的文件写入。

<details>
<summary>查看原文（20行）</summary>

```text
          }
          const payload = body as Record<string, unknown>
          const { name, path, enabled } = payload
          if (typeof name !== 'string' || !isSkillName(name) || typeof path !== 'string' || path.trim() === '' || typeof enabled !== 'boolean') {
            writeJson(res, 400, { error: 'expected { name, path, enabled }' })
            return
          }
          // The client path is only an identity claim: a fresh scan must
          // resolve the same effective skill before any file is touched.
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // Disabled = disable-model-invocation: true; enabled = false.
          const frontmatter = setFrontmatterField(skill.path, 'disable-model-invocation', !enabled)
          notifySkillCatalogChanged()
          writeJson(res, 200, {
            name,
            enabled: frontmatter.disableModelInvocation !== true,
            modelInvocable: frontmatter.disableModelInvocation !== true,
            path: skill.path,
          })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:402-423](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-skill-explorer/src/routes.ts#L402-L423)

另一条记录开关。

<details>
<summary>查看原文（22行）</summary>

```text
          if (enabled) {
            // Enabling only ever drops a record, so it stays allowed for a
            // skill the panel no longer lists: a plugin can be uninstalled
            // while its record is still stored, and that record must remain
            // removable. Nothing is written when it is already absent.
            await setProviderSkillEnabled(dshHome, identity, true)
            notifySkillCatalogChanged()
            writeJson(res, 200, { ok: true, name: identity.name, provider: identity.provider, disabled: false })
            return
          }
          // Disabling creates a record the panel will honor from the next list
          // on, so it must address a skill a fresh collection still lists as
          // plugin-provided — the same "only what the panel showed" rule the
          // file write routes follow, here with the identity instead of a path.
          const skill = await findProviderSkill(identity, panelCwd())
          if (skill === undefined) {
            writeJson(res, 404, { error: `skill ${identity.name} is not a plugin-provided skill with a local file` })
            return
          }
          await setProviderSkillEnabled(dshHome, identity, false)
          notifySkillCatalogChanged()
          writeJson(res, 200, { ok: true, name: identity.name, provider: identity.provider, disabled: true })
```

</details>

#### 缺口

- 没有受控实测。
  **影响**：收益推演仅立于已查到的语义差异。
  **进一步探讨**：以三个同名和作用域样例做盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
