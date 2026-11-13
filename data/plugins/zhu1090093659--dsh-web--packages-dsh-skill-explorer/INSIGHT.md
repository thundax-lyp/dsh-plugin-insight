# DSH Skill Explorer

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer)

<!-- BEGIN META -->
[![GitHub ★ 10,353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 161,812](https://img.shields.io/static/v1?label=npm+30d&message=161%2C812&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)
<!-- END META -->

> **功能**：在 DSH Web 面板中按来源浏览、查找和管理 Skill。

> **亮点**：把工作区、来源优先级和可操作文件汇到同一个面板，减少逐目录核对。写入目标用重新扫描的路径约束，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：隐藏提供者 Skill 后，宿主仍可能把它交给模型。预设内的 Skill 也可能未出现在面板中，见 [Q02](#research-q02)。

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
  - [Q01 · 跨项目管理同名 Skill 时，面板比手动改文件多解决什么？](#detail-section-11)
  - [Q02 · 哪些开关影响 SKILL.md，哪些只影响面板？](#detail-section-12)
  - [Q03 · 浏览器怎样接入文件写入，哪些风险由宿主接管？](#detail-section-13)
  - [Q04 · 怎样试用一次可验收的跨工作区 Skill 管理？](#detail-section-14)
  - [Q05 · 把开关作用域放在操作前能否减少误以为禁用了 Skill？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合维护多个 DSH 工作区、要辨认同名 Skill 来自何处的开发者，见 [Q01](#research-q01)。

直接用编辑器定位 SKILL.md，并在目标会话检查官方 Skill 目录。只有一个目录时，这条路线已经清楚。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Skill 中心 | 按来源筛选与定位 | 仅覆盖扫描和注册表范围 |
| 文件操作 | 变更或移入回收区 | 链接拒删 |
| 批量导入 | 读入 Skill 定义 | 同级冲突跳过 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、宿主 skills 和 sessions | 必需 | 挂载和识别有效来源 | 面板或列表缺失 |
| 可写工作区或用户目录 | 文件变更时 | 修改 Skill | 操作失败，保留原文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在测试项目保留副本 | 目标 Skill 可恢复 |
| 核对 | 打开面板选工作区 | 名称和来源符合预期 |
| 试用 | 切换后查看文件和会话 | 两者不符则恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包和本地环境 | 准备测试文件 | 费用与耗时未量化 |
| 持续 | 本地文件和面板 | 核对来源 | 多预设需查看官方目录 |
| 失败恢复 | 回收区及备份 | 回滚文件或调整提供者 | 同路径并发未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 来源定位 | 扫描和注册表合并 | 预设覆盖率 |
| 变更 | 文件和面板分开写 | 目标会话刷新时序 |

> **思考**：隐藏提供者 Skill 后，宿主仍可能把它交给模型。预设内的 Skill 也可能未出现在面板中，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把工作区、来源优先级和可操作文件汇到同一个面板，减少逐目录核对。写入目标用重新扫描的路径约束，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

优先级合并、陈旧目标拒绝和排他导入解决不同冲突。路径校验不能说明同路径内容未被并发修改，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

隐藏提供者 Skill 后，宿主仍可能把它交给模型。预设内的 Skill 也可能未出现在面板中，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在独立工作区用一条可回退的普通 Skill 核对来源、文件变更和目标会话；发现三者不符时回到编辑器和官方目录，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工作区与来源浏览和管理。目标会话可调用范围及部署权限需要宿主复核。

- 已检查：作者 README、包清单、源码路径 packages/dsh-skill-explorer/README.md、packages/dsh-skill-explorer/src/collect.ts、packages/dsh-skill-explorer/src/routes.ts、packages/dsh-skill-explorer/package.json、packages/dsh-skill-explorer/cordis.patch.yml、packages/dsh-skill-explorer/src/index.ts、packages/dsh-skill-explorer/src/client/index.ts、packages/dsh-skill-explorer/src/access.ts、packages/dsh-skill-explorer/src/import.ts 及固定范围 inventory；组件：packages/dsh-skill-explorer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对 Web 注册、来源合并、开关、导入和访问边界；未实测配对、预设范围和部署。
- 下一步：两工作区放同名 Skill 并使用不同预设，分别查看面板、源文件及官方会话目录，然后恢复文件。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.16（[固定提交 971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在开关前后显示写入对象与生效范围，观察是否能减少把面板隐藏当成会话禁用，见 [Q05](#research-q05)。

两工作区放同名 Skill 并使用不同预设，分别查看面板、源文件及官方会话目录，然后恢复文件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 481 | — | — | 6455 |
| .ts | source | 23 | 3945 | 2419 | 1284 | — |
| .tsx | source | 6 | 1148 | 886 | 201 | — |
| .ts | test | 16 | 4168 | 3046 | 676 | — |
| .tsx | test | 2 | 1026 | 780 | 159 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=155&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 156](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=156&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Skill Explorer 能否帮助多项目用户找到生效的 Skill，并让用户分辨文件变更与面板显示？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨项目管理同名 Skill 时，面板比手动改文件多解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

频繁维护项目、用户和插件来源 Skill 的 DSH 用户，可以按工作区观察同名项的有效来源。源码把文件扫描和注册表快照合并，以来源 rank 处理重复，也保留显式调用标记。相比手动遍历目录，能在一处看到不同来源并复用工作区上下文。官方 Skill 工具才说明会话能加载什么。快照未带预设查看范围，预设专属 Skill 可能缺席，因此用户要用目标会话核对。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-skill-explorer/README.md:20-37](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/README.md#L20-L37)

作者介绍面板与来源分组。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:514-554](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/collect.ts#L514-L554)

注册表快照覆盖范围、优先级及不完整标记。

<details>
<summary>查看原文（41行）</summary>

```text
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
```

</details>

**依据 3 · 作者声明**：[packages/dsh-skill-explorer/README.md:194-206](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/README.md#L194-L206)

作者说明预设范围限制与官方目录对照。

<details>
<summary>查看原文（13行）</summary>

```text
- Frontmatter parsing is a lightweight zero-dependency implementation
  (block scalars, booleans, input nested block); exotic YAML features are not
  supported — the official dsh-skill-filesystem provider remains the
  authoritative parser.
- The panel covers the filesystem roots it scans plus the global layer of the
  `ctx.skills` registry (bundled and runtime entries). `customSkillDirs`
  declared on a host-plane `skill-filesystem` row are scanned, because the
  host reads that row's config; a skill that reaches an agent only through an
  **agent preset's** own `customSkillDirs` or a preset-scoped provider is
  outside that coverage, because the panel reads the registry without a
  viewing scope. A skill absent from the panel is therefore not necessarily
  absent from the model: the official `skill` tool catalog is the authority on
  what a session can load.
```

</details>

#### 缺口

- 预设限定和同名项的面板覆盖率未经宿主对照
  **影响**：无法把面板清单当可调用全集
  **进一步探讨**：在两个不同预设的会话核同名文件与官方目录

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些开关影响 SKILL.md，哪些只影响面板？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

普通文件开关按名称和预期路径重新扫描，路径不符返回 409，通过后写入 disable-model-invocation。插件提供的文件走另一条路由，禁用前按提供者和名称复核，之后修改面板开关记录。重新启用只删记录，即使提供者已卸载也可清理。这个开关能改变面板的调用标记，不能从代码推断宿主会撤下工具。相同路径校验能挡住同名路径替换，源码片段没有用文件内容摘要校验同路径并发改动。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:217-234](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/routes.ts#L217-L234)

以重新扫描的名称和路径拒绝陈旧项。

<details>
<summary>查看原文（18行）</summary>

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
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:296-318](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/routes.ts#L296-L318)

普通文件写入调用标记。

<details>
<summary>查看原文（23行）</summary>

```text
          const body = await readJsonBody(req, { maxBytes: 128 * 1024, objectOnly: true })
          if (body === null) {
            writeJson(res, 400, { error: 'invalid JSON body' })
            return
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
          const frontmatter = setFrontmatterField(skill.path, 'disable-model-invocation', enabled ? false : true)
          writeJson(res, 200, {
            name,
            enabled: frontmatter.disableModelInvocation !== true,
            modelInvocable: frontmatter.disableModelInvocation !== true,
            path: skill.path,
          })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:337-366](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/routes.ts#L337-L366)

提供者开关写面板记录。

<details>
<summary>查看原文（30行）</summary>

```text
          const { name, provider, enabled } = payload
          if (typeof name !== 'string' || typeof enabled !== 'boolean' || (provider !== undefined && typeof provider !== 'string')) {
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

**依据 4 · 作者声明**：[packages/dsh-skill-explorer/README.md:207-216](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/README.md#L207-L216)

作者说明模型仍可收到插件 Skill 及符号链接边界。

<details>
<summary>查看原文（10行）</summary>

```text
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

#### 缺口

- 同路径并发编辑与宿主重新扫描顺序未验证
  **影响**：面板保存成功后仍可能与目标会话不同
  **进一步探讨**：并行编辑同一测试文件，并核对目标会话的调用目录

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 浏览器怎样接入文件写入，哪些风险由宿主接管？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

补丁挂载包，宿主依赖 webServer、skills、sessions，浏览器另依赖槽位和界面服务。HTTP 访问允许宿主连接服务接受的请求，否则转配对或回环判断。错误文案写 loopback-only，但不能用文案证明只接受本机。普通写目标需重新扫描，链接文件拒绝删除，普通删除移到回收区。导入发现同名同优先级或更强来源时跳过，写入使用排他创建；这控制覆盖风险，导入内容仍会成为可用的 Skill，需先人工审阅可信度。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/package.json:23-48](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/package.json#L23-L48)

声明 Web 面与宿主最低版本。

<details>
<summary>查看原文（26行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
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
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json && tsdown",
    "prepare": "tsdown",
    "watch": "tsdown --watch",
    "test": "vitest run",
    "typecheck": "tsgo --noEmit"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.1",
    "react": "^18.2.0"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/cordis.patch.yml:5-7](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/cordis.patch.yml#L5-L7)

补丁插入实际入口。

```text
- insert:
    - id: ui-skill-explorer
      name: '@linxin666/dsh-client-ui-skill-explorer'
```

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:103-128](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/index.ts#L103-L128)

组装依赖并注册路由。

<details>
<summary>查看原文（26行）</summary>

```text
  }

  const routes = makeRoutes(ctx, {
    dshHome,
    agentsHome,
    customSkillDirs,
    registry: skillCtx.skills,
    activeSessionCwds,
    logger: { warn: (error: unknown) => ctx.logger.warn(error) },
  })

  ctx.effect(() => {
    const disposers = routes.map((route) => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'skill-explorer: routes')
}

/**
 * Single-instance guard shared by the plugin family: the aggregate bundle
 * (dsh-web-all) and a standalone install of this package can coexist in
 * one profile, so the second host apply must be a no-op instead of
 * re-registering the same routes and failing the boot.
 */
export const apply = mountOnce('@linxin666/dsh-client-ui-skill-explorer', applyImpl)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/client/index.ts:72-91](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/client/index.ts#L72-L91)

注册面板。

<details>
<summary>查看原文（20行）</summary>

```text
  // issued before the service settles still lands once it does, and the face
  // throws by contract before the layout root entry mounts, which the
  // controller tolerates.
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
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/access.ts:23-47](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/access.ts#L23-L47)

宿主连接服务优先，另有配对或回环判断。

<details>
<summary>查看原文（25行）</summary>

```text
function resolveConnection(ctx: Context): HostConnectionService | undefined {
  try {
    const candidate = typeof ctx.get === 'function'
      ? (ctx.get('connection', false) ?? ctx.get('connection'))
      : (ctx as { connection?: HostConnectionService }).connection
    return candidate !== undefined && candidate !== null && typeof candidate.requestRejection === 'function'
      ? candidate
      : undefined
  } catch {
    return undefined
  }
}

/**
 * Whether this request may enter any /api/dsh-skill-explorer route.
 * @param ctx - host context; may expose remoteWebUiPairing or connection.
 * @param request - the incoming HTTP request.
 * @returns true for loopback, a live paired-device cookie, or an admitted host connection.
 */
export function isSkillExplorerAllowed(ctx: Context, request: IncomingMessage): boolean {
  const connection = resolveConnection(ctx)
  if (connection !== undefined && connection.requestRejection?.(request) === undefined) {
    return true
  }
  return isPairedOrLoopbackAllowed(ctx, request)
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:538-548](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/routes.ts#L538-L548)

链接拒删，普通文件移回收区。

<details>
<summary>查看原文（11行）</summary>

```text
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // A linked skill lives behind a symlink (mount-of-intent content, not
          // created under this root). Deleting it would move the target's real
          // SKILL.md out of place, escaping this skill root — refuse deletion.
          if (skill.linked === true) {
            writeJson(res, 400, { error: `skill ${name} is a linked skill and cannot be deleted` })
            return
          }
          const moved = await trashSkillFile(skill.path)
          writeJson(res, 200, { ok: true, name, moved })
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:343-367](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/import.ts#L343-L367)

拒绝重复或被遮蔽名称。

<details>
<summary>查看原文（25行）</summary>

```text
  const targetRank = rankOf(targetLevel)
  const byName = new Map(existing.map(skill => [skill.name, skill]))
  const seen = new Set<string>()
  const plan: ImportPlanItem[] = []
  for (const candidate of candidates) {
    if (seen.has(candidate.name)) {
      plan.push({ candidate, decision: 'skip', reason: 'duplicate' })
      continue
    }
    seen.add(candidate.name)
    const current = byName.get(candidate.name)
    if (current !== undefined) {
      const currentRank = rankOf(current.level)
      if (currentRank < targetRank) {
        plan.push({ candidate, decision: 'skip', reason: 'shadowed' })
        continue
      }
      if (currentRank === targetRank) {
        plan.push({ candidate, decision: 'skip', reason: 'exists' })
        continue
      }
    }
    plan.push({ candidate, decision: 'import' })
  }
  return plan
```

</details>

**依据 8 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:387-400](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/import.ts#L387-L400)

排他创建。

<details>
<summary>查看原文（14行）</summary>

```text
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
  }
```

</details>

#### 缺口

- 反向代理后的宿主 connection 策略和配对边界未实测
  **影响**：无法从插件自身断言部署授权范围
  **进一步探讨**：在独立 profile 对未配对、已配对及拒绝请求核查读写权限

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用一次可验收的跨工作区 Skill 管理？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合同时维护多个项目 Skill 的用户。先在测试项目留一份普通 Skill，记下当前 Git 内容与目标会话目录，打开面板核对同名来源并切换一次。手工方法用编辑器改 frontmatter 后核对宿主目录。试用成功需面板位置正确、写入可回退且目标会话的可调用变化符合文件策略。按一次成功定位和调整计人工时间，另记备份、导入和冲突复核。固定核查没有相关现金或节时实测。若改到非目标路径、会话仍与面板不同或只能操作提供者面板开关，回到原文件及提供者管理流程。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-skill-explorer/README.md:89-104](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/README.md#L89-L104)

作者的安装渠道。

<details>
<summary>查看原文（16行）</summary>

````text
## Install

### From npm (recommended)

```sh
dsh plugin --profile web add @linxin666/dsh-client-ui-skill-explorer@latest
```

### From the repository (development)

```sh
git clone https://github.com/zhu1090093659/dsh-web.git
cd dsh-web
pnpm install
pnpm -r build
dsh plugin --profile web add link:$(pwd)/packages/dsh-skill-explorer
````

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:217-233](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/routes.ts#L217-L233)

写入前精确路径核对。

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

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:536-549](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/collect.ts#L536-L549)

有来源优先级和调用标记。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 4 · 作者声明**：[packages/dsh-skill-explorer/README.md:198-211](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/README.md#L198-L211)

面板与实际宿主可见性不同的具体情形。

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

- 同样任务下的耗时和误选率未知
  **影响**：无法量化 GUI 的长期节省
  **进一步探讨**：记录各十次来源定位、切换、复核和失败恢复的时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 把开关作用域放在操作前能否减少误以为禁用了 Skill？

**研究主题**：新假设与验证

#### 完整回答

可以让按钮在变更前明确展示会写项目文件还是只改面板，并在反馈中给出打开目标会话核查的入口。现有设计已有提供者标记，待验证的增量是动作发生前和结果之后都展示写入对象及目标范围。用包含普通文件、提供者文件和预设私有 Skill 的任务，盲比分组提示是否减少把面板隐藏认作会话禁用的次数。若理解错误不下降，或用户操作耗时显著增加，就不扩大提示。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-skill-explorer/README.md:207-211](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/README.md#L207-L211)

提供者开关的真实作用域。

```text
- The switch on a **"Provided by plugin"** row is a panel-local view
  decision: it changes what this panel lists as invocable, not what the host
  registry loads, so the model still receives the skill. Taking such a skill
  away from the model for real means removing or disabling it where its
  provider gets it.
```

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:301-318](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/routes.ts#L301-L318)

普通文件写入。

<details>
<summary>查看原文（18行）</summary>

```text
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
          const frontmatter = setFrontmatterField(skill.path, 'disable-model-invocation', enabled ? false : true)
          writeJson(res, 200, {
            name,
            enabled: frontmatter.disableModelInvocation !== true,
            modelInvocable: frontmatter.disableModelInvocation !== true,
            path: skill.path,
          })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:347-366](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-skill-explorer/src/routes.ts#L347-L366)

面板记录写入。

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

- 已有提供者提示是否已足够未知
  **影响**：无法从接口差异推断额外提示有效
  **进一步探讨**：用相同任务比较现有提示与动作前后提示

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
