# dsh-skill-explorer

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer)

<!-- BEGIN META -->
[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 116,190](https://img.shields.io/static/v1?label=npm+30d&message=116%2C190&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)
<!-- END META -->

> **功能**：在 DSH 中按来源浏览、创建、编辑和导入 Skill，并提供文件启用标记与回收站管理。

> **亮点**：相对文件管理器逐目录查找，它合并文件系统与 registry 元数据、用来源优先级解决同名项，并让写操作重新扫描匹配名称与路径，避免陈旧面板把变更写到同名的其他来源。导入只创建不覆盖，提供逐项跳过理由。这是管理工作流与身份边界的增量，Skill 解析和加载权威仍在宿主。[Q02](#research-q02)

> **主要限制**：插件来源行的“关闭”仅改变面板本地显示，模型仍收到对应 Skill；preset 专属目录也不在完整覆盖内。因此不能把该面板的启用状态或缺项当作实际会话权限事实。README 已明确该限制，源码亦只在采集结果应用本地 toggle，没有看到 registry 策略写入。这直接限制其作为统一控制中心的价值。[Q03](#research-q03)

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
  - [Q01 · 它是文件目录还是会话权限控制，怎样验收？](#detail-section-11)
  - [Q02 · 文件与registry如何合并，写入身份如何核对？](#detail-section-12)
  - [Q03 · 开关显示为关闭时模型真的收不到吗？](#detail-section-13)
  - [Q04 · 文件管理需要什么条件，失败恢复有什么负担？](#detail-section-14)
  - [Q05 · 如何避免面板偏好被误认成有效策略，谁值得先用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在多个项目、用户目录和插件来源维护 Skill 的 DSH 用户，集中浏览、搜索、创建、编辑与导入文件。合格产物是准确区分来源与实际会话可用性的目录，以及写入到正确文件的变更；它不是统一的权限控制器。

终端编辑或文件管理器是基线，官方skill工具catalog是会话可用性权威。不能把更集中界面解释为更强授权控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多来源浏览 | 集中定位文件与registry条目 | preset专属源覆盖有限，非完整会话catalog |
| 文件管理 | 创建、编辑、修改frontmatter和回收站 | 写前fresh scan；链接编辑/删除拒绝 |
| 批量导入 | 从目录或zip创建Skill | 不覆盖，资源文件不随Skill正文导入 |
| Provider显示开关 | 保存面板调用偏好 | 不撤销模型实际收到的Skill |

<a id="dependencies-and-flow"></a>

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.2.1-rc.3 与 Web 客户端 | 启动必需 | 挂载 Skill Center | 本轮未验证具体桌面版本 |
| webServer、skills、sessions | 宿主必需 | 路由、registry 与工作区判断 | 不能挂载相应服务 |
| 本地Skill根目录写权限 | 管理操作必需 | 创建、编辑、开关与移动回收站 | 只读或插件来源不能当普通文件修改 |
| 实际会话 skill catalog | 判断模型可用性必需 | 复核preset与provider有效状态 | 面板状态不能代替此事实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装并刷新 Skill Center | 来源分组与工作区正确 |
| 2 | 用户按来源查找或导入 | 无效、同名遮蔽与已有文件逐项跳过 |
| 3 | 用户修改文件或面板偏好 | 明确写入对象；链接文件编辑/删除被拒绝 |
| 4 | 用户在目标会话查实际 catalog | 核对模型是否真正可用；差异不能靠面板开关消除 |

<a id="cost-and-value"></a>

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件与文件扫描资源；金额未知 | 核对根目录、来源与会话范围 | 无完整兼容实测 |
| 持续使用 | 扫描与读取、导入存储 | 编辑、同名冲突和有效状态复核 | 扫描时延及管理收益未知 |
| 失败恢复 | .trash与文件副本 | 恢复误改、重新查询真正会话状态 | in-place编辑非完整版本管理，恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 来源汇总 | 文件扫描加registry补充 | preset专属源全覆盖不成立 |
| 文件管理 | 新鲜扫描匹配、导入不覆盖、回收站 | 并发写入与崩溃后恢复完整性 |
| 模型可用性控制 | 文件frontmatter可改 | provider关闭仅面板偏好，不能撤销模型Skill |

> **思考**：插件来源行的“关闭”仅改变面板本地显示，模型仍收到对应 Skill；preset 专属目录也不在完整覆盖内。因此不能把该面板的启用状态或缺项当作实际会话权限事实。README 已明确该限制，源码亦只在采集结果应用本地 toggle，没有看到 registry 策略写入。这直接限制其作为统一控制中心的价值。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对文件管理器逐目录查找，它合并文件系统与 registry 元数据、用来源优先级解决同名项，并让写操作重新扫描匹配名称与路径，避免陈旧面板把变更写到同名的其他来源。导入只创建不覆盖，提供逐项跳过理由。这是管理工作流与身份边界的增量，Skill 解析和加载权威仍在宿主。[Q02](#research-q02)

来源rank与fresh scan身份核对值得借鉴；导入有明确资源上限和不覆盖规则。编辑writeFile与回收站只覆盖不同恢复条件，不能称完整事务管理；面板本地策略必须明确标识。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

插件来源行的“关闭”仅改变面板本地显示，模型仍收到对应 Skill；preset 专属目录也不在完整覆盖内。因此不能把该面板的启用状态或缺项当作实际会话权限事实。README 已明确该限制，源码亦只在采集结果应用本地 toggle，没有看到 registry 策略写入。这直接限制其作为统一控制中心的价值。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

需要频繁浏览和管理普通文件型 Skill 的用户，可在备份的测试目录试用导入、同名处理、编辑与回收站。先在目标会话核对真实 catalog；若目的是撤销插件提供的能力，应从 provider 配置处理，不能依赖面板关闭。需要全局权限治理或完整preset视图的场景先观察。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持文件与目录管理机制；provider关闭不是模型撤权，preset覆盖有限；未运行宿主，对有效策略分层展示的假设未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-skill-explorer/README.md、packages/dsh-skill-explorer/package.json、packages/dsh-skill-explorer/src/index.ts、packages/dsh-skill-explorer/src/routes.ts、packages/dsh-skill-explorer/src/collect.ts、packages/dsh-skill-explorer/src/import.ts 及固定范围 inventory；组件：packages/dsh-skill-explorer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查宿主接线、采集、主要写路由和导入边界；未完整审计zip解析器、共享鉴权或所有前端，不执行目标代码。
- 下一步：用备份测试目录构造普通、provider、preset和链接Skill，比对面板、文件与真实会话catalog，并验证导入跳过、编辑和回收站恢复。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.8（[固定提交 6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把界面状态拆为“面板偏好”“文件声明”“会话有效策略”，对每个来源回读实际 skill catalog 后显示差异，避免一个开关表达三种含义。以同名多来源、preset独占、插件提供和链接文件样本比较误判断率及修正时间；若有效策略无法可靠查询，就只显示明确未知并停止制作全局开关。[Q05](#research-q05)

用备份测试目录构造普通、provider、preset和链接Skill，比对面板、文件与真实会话catalog，并验证导入跳过、编辑和回收站恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：packages/dsh-skill-explorer；内容摘要：2e1b87925a454e82af80836a701212acf063a8eb7a6f5041407e2ebab0f81dad。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 225 | — | — | 2151 |
| .ts | source | 4 | 1762 | 1159 | 512 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Skill集中管理、来源身份和实际会话策略之间的边界及可控采用方式。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是文件目录还是会话权限控制，怎样验收？

**研究主题**：场景与需求

#### 完整回答

作者提供来源分组的可视化Skill管理，包括普通文件和registry补充。实际需求是减少用户跨项目与用户目录查找文件，并把创建、导入和编辑集中。基线是文件管理器或终端编辑SKILL.md。合格结果要检查工作区、来源、被修改路径与目标会话实际catalog，而不是面板能列出很多条目；该插件明确不改变官方加载或注入语义，因此不能将其当作所有会话的策略控制。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-skill-explorer/README.md:18-39](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/README.md#L18-L39)

作者功能与开关声明

<details>
<summary>查看原文（22行）</summary>

```text
A visual Skill Explorer for DeepSeek Harness (DSH) Web GUI and desktop client: browse loaded skills tiered by source origin, toggle model invocation permissions, author new skills, and manage files through a safe trash mechanism.

## What it does

- **Sidebar row** "Skill Center" opens a native center-column page — a row in
  the shell's own panel list, beside Plugins, Schedule and the task board —
  with a tab bar. The row opens the page, and opening any session (or a new
  chat) returns the center column to the conversation, exactly like the shell's
  own Plugins and Schedule pages; the page carries no back control of its own.
- **Skills tab**: skills grouped by source (system bundled / project
  `.dsh/skills` / project `.agents/skills` / custom directories / user
  `~/.dsh/skills` / user `~/.agents/skills` / runtime registered), with a
  search box that filters by name or description as you type (name hits listed
  first; Escape clears it) and stacks with the workspace picker. Each row shows
  description, when-to-use, invocation marks, an enable/disable switch
  (rewrites `disable-model-invocation` in the SKILL.md frontmatter,
  hot-refreshed by the model catalog; a plugin-provided file has no such path,
  so its switch is recorded in the panel's own store instead), a duplicate
  action (a copy of the skill as a starting point in the create form), an edit
  action and a delete button
  (moves the file into `.trash`, recoverable). The refresh control hides while
  a load runs.
```

</details>

**依据 2 · 作者声明**：[packages/dsh-skill-explorer/README.md:61-87](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/README.md#L61-L87)

来源合并与官方加载语义边界

<details>
<summary>查看原文（27行）</summary>

```text
- Data comes from a filesystem scan following the official
  dsh-skill-filesystem root conventions, merged with the `ctx.skills`
  registry (bundled / runtime entries). The scan reads `customSkillDirs`
  from this plugin's own config **and** from every live `skill-filesystem`
  loader row, so the documented placement (the provider row in a profile
  patch) is manageable too. The plugin never changes the skill loading or
  injection semantics — it is a pure GUI management layer.
- A skill the write routes cannot serve is badged by what actually backs
  it, instead of silently missing its controls. A plugin provider that
  reports a real instruction file (the official `SkillSummary.path`) is
  listed as **"Provided by plugin"** — the file exists, it just sits outside
  the skill roots this panel scans. Only a registration that reports no file
  at all is listed as **"No local file"**. Both stay pathless, so neither row
  offers an edit or delete control that would answer 404. A **"Provided by
  plugin"** row does carry the enable switch (#1854): because the file belongs
  to the provider, the host records the switch in the panel's own store and
  the row reads as switched off (see the known limitations). Only a
  **"No local file"** row has no switch at all.
- A skill is listed only when the official provider would load it: its
  SKILL.md declares a non-empty `name` and `description`, and the name
  satisfies the official skill-name grammar. A file the official provider
  discards is absent from the panel too, so the panel never shows a skill the
  model cannot receive.
- A duplicate skill name resolves by the official source rank (project
  `.dsh/skills` 100, project `.agents/skills` 200, runtime 250, custom 300,
  user `~/.dsh/skills` 400, user `.agents/skills` 500, bundled 600), so
  the row shown names the same skill the model receives.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件与registry如何合并，写入身份如何核对？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

宿主从活动会话cwd、用户根与custom目录构造采集选项，collect并发扫描文件，再逐cwd查询registry。registry根据来源rank覆盖较弱同名项，并只在明确提供时修正调用标记。写路由先 fresh scan，解析同一名称和路径；编辑保留当前disable-model-invocation，不允许编辑链接Skill，删除改为.trash移动。导入另外限制为只新建、不覆盖并报告shadowed。相对直接文件编辑，增量在来源优先级与新鲜身份核对，真实加载仍归官方provider。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:76-112](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/index.ts#L76-L112)

custom来源和活动会话cwd进入路由

<details>
<summary>查看原文（37行）</summary>

```text
  const customSkillDirs = (): string[] => {
    const own = Array.isArray(config?.customSkillDirs) ? config.customSkillDirs : []
    let fromRows: string[] = []
    try {
      // Non-strict read: the loader is present in every real composition but
      // is not a declared dependency of this plugin, so a shell without one
      // must degrade to the plugin's own config instead of failing the mount.
      const loader = (ctx as unknown as { get(name: string, strict?: boolean): unknown }).get('loader', false) as LoaderSurface | undefined
      if (typeof loader?.entries === 'function') fromRows = customSkillDirsFromLoader(loader.entries())
    } catch {
      fromRows = []
    }
    return normalizeSkillRoots([...own, ...fromRows])
  }

  /** Active session workspace cwds (degraded to [] when the registry is unavailable). */
  const activeSessionCwds = (): string[] => {
    try {
      const sessions = skillCtx.sessions as SessionList | undefined
      if (typeof sessions?.list !== 'function') return []
      return sessions
        .list()
        .map((session) => session.header?.cwd)
        .filter((cwd): cwd is string => typeof cwd === 'string' && cwd !== '')
    } catch {
      return []
    }
  }

  const routes = makeRoutes(ctx, {
    dshHome,
    agentsHome,
    customSkillDirs,
    registry: skillCtx.skills,
    activeSessionCwds,
    logger: { warn: (error: unknown) => ctx.logger.warn(error) },
  })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:500-560](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/collect.ts#L500-L560)

扫描与registry按rank合并

<details>
<summary>查看原文（61行）</summary>

```text
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

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:502-514](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/routes.ts#L502-L514)

新鲜解析、拒绝链接编辑与保留启用字段

<details>
<summary>查看原文（13行）</summary>

```text
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // A linked skill lives behind a symlink: rewriting it would edit a
          // file outside this skill root, so the panel must not offer it.
          if (skill.linked === true) {
            writeJson(res, 400, { error: `skill ${name} is a linked skill and cannot be edited` })
            return
          }
          // The enabled state is not part of the edit form: carry it over so an
          // edit never silently re-enables a disabled skill.
          const disabled = parseFrontmatter(readFileSync(skill.path, 'utf8')).disableModelInvocation === true
          const target = await overwriteSkillFile(skill.path, name, description.trim(), typeof whenToUse === 'string' ? whenToUse : undefined, content, disabled)
          writeJson(res, 200, { ok: true, name, path: target, disabled })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:11-25](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/import.ts#L11-L25)

导入的只创建和shadow规则

<details>
<summary>查看原文（15行）</summary>

```text
 * - the only files it ever reads are `<dir>/<name>/SKILL.md`,
 *   `<dir>/<name>.md` (one level, the same convention the panel's scan uses)
 *   or the archive the browser posted;
 * - the only files it ever writes are `<skill root>/<name>/SKILL.md` under the
 *   documented user/project root, and only when that file does not exist yet;
 * - symbolic links in the source are skipped rather than followed, so an
 *   import cannot be pointed at content through a planted link;
 * - a candidate the official provider would not load (no name/description
 *   frontmatter, a name outside the official grammar) is skipped, so the
 *   panel never creates a skill the model cannot receive.
 *
 * Collisions resolve by the official source rank (the same table the list
 * route uses): importing into a root that is *weaker* than an existing
 * same-name skill would produce a file the model never receives, so that
 * candidate is reported as shadowed instead of written.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 开关显示为关闭时模型真的收不到吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

对普通文件，路由改写disable-model-invocation，依赖宿主后续读取该声明。对provider-file，路由只持久化(provider,name)到面板自己的store，collect在结果末尾applyProviderToggles，未在所读链路改变官方registry。因此作者在Known limitations中明确模型仍收到该Skill。另有preset专属custom目录或作用域provider不在面板全覆盖内，缺项不等于模型没有。最强支持是管理层确实避免直接写插件所有文件；限制则是同一开关视觉可能暗示更强权力。它适合文件维护而不宜作为统一授权控制。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:347-366](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/routes.ts#L347-L366)

provider开关只增删本地记录

<details>
<summary>查看原文（20行）</summary>

```text
          if (enabled) {
            // Enabling only ever drops a record, so it stays allowed for a
            // skill the panel no longer lists: a plugin can be uninstalled
            // while its record is still stored, and that record must remain
            // removable. Nothing is written when it is already absent.
            await setProviderSkillEnabled(dshHome, identity, true)
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
          writeJson(res, 200, { ok: true, name: identity.name, provider: identity.provider, disabled: true })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:551-560](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/collect.ts#L551-L560)

toggle仅应用于面板采集结果

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 3 · 作者声明**：[packages/dsh-skill-explorer/README.md:196-209](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/README.md#L196-L209)

作者明确preset覆盖和provider关闭非有效撤权

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

- 未对同版本宿主实际catalog做对照
  **影响**：尚未测量用户误读程度和文件开关热刷新结果
  **进一步探讨**：建立四类来源样本，逐项比较面板显示、frontmatter、registry和会话skill工具

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 文件管理需要什么条件，失败恢复有什么负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明最低DSH版本，宿主注入webServer、skills和sessions。文件型写操作需要正确根目录和写权限；registry不足时采集标记complete=false，不应将部分结果宣称完整。导入限制4MB archive、512项、64KB单Skill及4MB总文本，并跳过符号链接；编辑本身是writeFile覆写，不提供每次变更的版本历史。因而先备份目录再试用，删除回收站与编辑恢复不是同一能力。首次目录核对、日常有效策略复核及误改恢复都应计入管理成本，金额和时间尚无样本。分阶段表见[成本与效果](#cost-and-value)，运行条件见[依赖与流程](#dependencies-and-flow)。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/package.json:21-35](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/package.json#L21-L35)

宿主和client依赖

<details>
<summary>查看原文（15行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
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

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:23-24](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/index.ts#L23-L24)

硬注入服务

```text
/** Services required before the skill center routes can mount. */
export const inject = ['webServer', 'skills', 'sessions']
```

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:35-45](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/import.ts#L35-L45)

导入资源界限

<details>
<summary>查看原文（11行）</summary>

```text
/** Hard bounds on one import, so a hostile archive cannot exhaust the host. */
export const IMPORT_LIMITS = {
  /** Largest archive the route accepts (a base64 body is larger on the wire). */
  archiveBytes: 4 * 1024 * 1024,
  /** Most entries one archive may carry. */
  entries: 512,
  /** Largest one imported SKILL.md (the same cap the create/edit routes use). */
  skillBytes: 64 * 1024,
  /** Largest total uncompressed skill text one import may produce. */
  totalBytes: 4 * 1024 * 1024,
} as const
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:592-603](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/collect.ts#L592-L603)

覆写与回收站机制不同

<details>
<summary>查看原文（12行）</summary>

```text
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
}

/** Move a skill file into its .trash sibling directory (recoverable delete). */
export async function trashSkillFile(path: string): Promise<string> {
  const trashDir = join(dirname(path), '.trash')
  await mkdir(trashDir, { recursive: true })
  const trashTarget = join(trashDir, `${Date.now()}-SKILL.md`)
  await rename(path, trashTarget)
  return trashTarget
```

</details>

#### 缺口

- 大目录扫描、并发写和恢复成本未知
  **影响**：不能量化比终端编辑更高效或更安全
  **进一步探讨**：在备份测试目录测导入、冲突、外部同时修改与崩溃恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何避免面板偏好被误认成有效策略，谁值得先用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由provider开关仅在面板生效推导三层状态展示，分别标注面板偏好、文件声明和目标会话生效状态，查询不足时明确未知。改进不应静默修改provider配置，否则会越过本组件文件管理边界。以同名多来源和preset独占样本让用户执行“确保模型不能调用”任务，比较当前开关和分层显示的误判断及修正时间。无法获得可靠会话catalog时应停止做全局撤权承诺。当前可控试用是有备份的普通文件管理，而不是权限治理。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-skill-explorer/README.md:196-214](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/README.md#L196-L214)

作者声明三种加载/面板/链接边界

<details>
<summary>查看原文（19行）</summary>

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
- Linked skills cannot be deleted (see the security model); enable/disable works
  normally on them (rewriting the target's `SKILL.md` frontmatter). Both
  directory and single-file links list normally; a single-file link (pointing
  at one `.md`) is replaced by a plain file during the atomic rewrite — the link
  is not kept and the target file is left untouched.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:347-366](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-skill-explorer/src/routes.ts#L347-L366)

现有本地开关支持分层状态假设

<details>
<summary>查看原文（20行）</summary>

```text
          if (enabled) {
            // Enabling only ever drops a record, so it stays allowed for a
            // skill the panel no longer lists: a plugin can be uninstalled
            // while its record is still stored, and that record must remain
            // removable. Nothing is written when it is already absent.
            await setProviderSkillEnabled(dshHome, identity, true)
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
          writeJson(res, 200, { ok: true, name: identity.name, provider: identity.provider, disabled: true })
```

</details>

#### 缺口

- 有效策略查询接口与误读用户案例尚缺
  **影响**：方案为未验证设计，不能当当前可靠治理能力
  **进一步探讨**：核实官方会话catalog接口并做用户对照任务，若仍误读则取消全局开关形态

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
