# DSH Skill Hub

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0d0f2ec](https://github.com/cheshireez/dsh-skill-hub/tree/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cheshireez/dsh-skill-hub) [![npm 30d 8,875](https://img.shields.io/static/v1?label=npm+30d&message=8%2C875&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-hub) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-hub)
<!-- END META -->

> **功能**：在 DSH 中浏览、筛查、安装、更新和恢复本地 Skill。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，来源、审核和回收被放在同一管理流程。

> **主要限制**：[Q02](#research-q02) 显示首次导入仍可能按移动 ref 下载，记录的 SHA 不必然证明字节；[Q03](#research-q03) 也显示阻断前可能已移走旧占位。

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
  - [Q01 · 相对手工管理 Skill 目录，新增了什么？](#detail-section-11)
  - [Q02 · 下载安装如何定位和筛查材料？](#detail-section-12)
  - [Q03 · 权限、审计与恢复有哪些边界？](#detail-section-13)
  - [Q04 · 如何验证单个非关键 Skill 的管理收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常维护多套 Skill 的 DSH 用户可在设置和侧栏查看来源并管理安装。

手工维护 Skill Git 目录保留原始变更历史，插件增加界面内管理与回收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 导入与更新 | 拉取和安装 Skill | 初导须自行核对固定 ref |
| 静态审核 | 发现已知模式或超限 | 通过不代表安全 |
| 回收 | 恢复被移动技能 | 目标占用会拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与技能服务 | 必需 | 管理目录和界面 | 无对应功能 |
| GitHub 可达及明确来源 | 远程导入所需 | 获取包 | 查询或下载失败 |
| 可写测试目录 | 安装恢复所需 | 落盘与回收 | 不能完成试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 使用固定自控来源和测试目录 | 可核对实际字节 |
| 导入 | 核对审核结果、版本与内容 | 与固定源码一致 |
| 退出 | 检查回收及恢复 | 异常时退回 Git |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载和磁盘未知 | 设置来源和试验目录 | 耗时未知 |
| 持续 | 请求及存储开销未知 | 审阅 Skill 与更新 | 收益待测 |
| 恢复 | 备份空间未知 | 核查占位与标签 | 失败可能需手工复位 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 导入 | 暂存及静态审核 | 全部风险覆盖 |
| 追溯 | 保存来源与哈希 | 移动 ref 初导的一致性 |
| 退出 | 回收和恢复 | 不同冲突下实际效果 |

> **思考**：[Q02](#research-q02) 显示首次导入仍可能按移动 ref 下载，记录的 SHA 不必然证明字节；[Q03](#research-q03) 也显示阻断前可能已移走旧占位。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，来源、审核和回收被放在同一管理流程。

首次导入和同步对版本使用方式不同。静态审核后再发布目录，恢复另检查目标冲突。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示首次导入仍可能按移动 ref 下载，记录的 SHA 不必然证明字节；[Q03](#research-q03) 也显示阻断前可能已移走旧占位。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只建议先用自控固定来源完成单个试验并核对文件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认挂载、导入和回收路径；未进行 DSH 使用或攻击验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、tsdown.config.ts、src/index.ts、src/client/index.tsx、src/routes.ts、src/routes/repo-import.ts、src/routes/sources.ts、src/repo/install.ts、src/repo/api.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 0.3.32，核查主要 GitHub 导入、鉴权与回收。未运行目标代码。
- 下一步：固定单个 Skill 完成导入与退出，记录哈希、来源和总耗时。

**分析版本**

- **仓库**：[cheshireez/dsh-skill-hub](https://github.com/cheshireez/dsh-skill-hub)
- **版本号**：0.3.32（[固定提交 0d0f2ec](https://github.com/cheshireez/dsh-skill-hub/tree/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 比较多版本管理的人工返工。若追溯与撤销耗时高于手工 Git，放弃假设。

固定单个 Skill 完成导入与退出，记录哈希、来源和总耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 369 | — | — | 6568 |
| .ts | test | 24 | 7161 | 6131 | 400 | — |
| .ts | source | 85 | 14290 | 10109 | 3346 | — |
| .tsx | source | 31 | 4085 | 3302 | 601 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/cheshireez/dsh-skill-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/cheshireez/dsh-skill-hub/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/cheshireez/dsh-skill-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 界面安装或更新 Skill 时，如何看清来源、审核范围与撤销条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对手工管理 Skill 目录，新增了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

常在 DSH 维护多个技能的用户可从设置或侧栏浏览、导入、更新和撤销部分技能。相对手动复制目录，它显示来源与本地编辑线索并把内容规则审核接入导入流程。对于只管理一个自写 Skill 的用户，直接维护 Git 目录仍易追溯且无额外管理层。作者说明停用策略可保留显式命令，不应把停用理解为删除。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-46](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/README.md#L38-L46)

作者说明扫描、策略开关、导入和更新。

```text
- **Content audit** — enabled skills' bodies (`SKILL.md`) are checked too: raw ESC control characters, Unicode tag characters, and bidirectional controls (these three make "reviewed" not equal "seen" — a market import carrying them is refused outright), zero-width characters, `curl … | sh` remote execution, SSH/cloud-credential/keychain paths, over-long descriptions, and the 2 MiB per-file / 10 MiB per-skill / 500-file limits. Pure local static matching: no model call, no network. A market import scans the whole bundle (including `scripts/`); the standing check only reads `SKILL.md` — it runs on every 5-second poll, and walking every directory would slow the panel down.
- **Announcement budget** — the name + description total that the first progressive-disclosure layer injects comes back with the catalog, so the panel can show characters and an estimated token count; past 8000 characters it turns red (clients truncate the tail there, which shows up as "installed but never triggers").
- **Toggle** — per-skill switches and per-group tri-state switches with a conflict dialog (close all / keep on). Disabling is a sidecar policy: the discovery file is never renamed or deleted; an invocation override turns off model auto-invocation while `/name` keeps working. Paused skills stay in the catalog, are inspectable and re-enableable, and can be moved to trash from edit mode. Only `~/.dsh/skills` & `~/.agents/skills` are writable; everything else is read-only.
- **Organize** — three independent axes: **source** (the upstream repo a skill was installed from), **location** (the discovery root, e.g. `~/.dsh/skills` / `Codex`), and **roles** (user-curated skill sets). Source collections auto-aggregate; locations get their own **by location** view, one card per discovery root with a whole-root switch (when a skill is discovered in several roots, it belongs to the registry's winning root — the same one the row badge shows); roles are manual and drag-reorderable, and support **switch to role** — enable the members, pause every other switchable skill (the confirm dialog lists them so you can keep any of them on), with the previous switch states saved for a one-click restore. Skills not assigned to any role stay reachable from the collapsed "Unassigned" card. Role cards always show their full rosters and ignore the source/status filters (search and invocation still apply). Roles and source collections persist in `~/.dsh/dsh-skill-hub.json`; the restore snapshot lives in browser localStorage. Edit mode reveals delete/reorder without cluttering the read view.
- **Diagnose & fix** — files the provider skips (missing frontmatter, bad YAML, name mismatch, short description) show up with reasons; auto-fixable ones (e.g. unquoted `:` in descriptions) get a one-click Fix button.
- **Scaffold** — new-skill wizard writing to `~/.dsh/skills` or `~/.agents/skills` (`SKILL.md` template below).
- **Market** — built-in curated repos plus custom `owner/repo` sources. Any top-level directory containing `SKILL.md` scans as a root (no allowlist), and a `SKILL.md` at the repo root itself scans as a single skill named after the repo (minus repo tooling such as `.github/`). Async import with byte-level progress and cancel. Each source pins a version — click the ref badge to switch between releases, branches, or a custom ref. Every import passes the content audit first: a skill with a blocking finding is refused as a whole and its temp directory is removed (nothing left on disk).
- **skills.sh search** — beyond the built-in catalog, search the [skills.sh](https://skills.sh) index by skill name; results show the hosting repo and its install count, with two actions per row: **Install** pulls that one skill straight in (one step, but it does **not** track upstream — the index gives a skill directory name, never its path inside the repo, so no source record can be registered), while **Add source** registers the repo and scans it, after which update tracking, version pinning and trash behave exactly like a hand-added source. Both paths pass the same content audit. Requests are proxied server-side — the upstream sends no CORS headers, and a search should not hand the user's egress IP to a third party — and both `source` and package paths are validated against strict shapes before use.
- **Track updates** — imported skills record a repo + commit snapshot. Check all / update-all (covering both new releases and skill updates), per-source badges (installed / updatable / deleted upstream / new release). When a new release is out, **Update** re-pins to that release first and then syncs (pin the version badge by hand to stay on an older one). The sync dialog preselects only skills that actually changed upstream and marks locally edited ones before they are overwritten; upstream deletions move into a restorable trash that keeps source and role membership.
```

**依据 2 · 源码核查**：[src/client/index.tsx:114-148](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/client/index.tsx#L114-L148)

实际挂入设置和侧栏。

<details>
<summary>查看原文（35行）</summary>

```text
  // Top-level Settings section: the skill management page.
  ctx.effect(
    () => ctx.slots.inject('settings.section', () => ctx.slots.register({
      name: 'settings.section',
      id: 'skill-hub',
      order: 12,
      label: () => t('entry.label'),
      locale: NS,
      inject: () => ({}),
    }, () => <SkillHubPanel api={api} />)),
    'dsh-skill-hub: settings section',
  )

  // Wide sidebar main panel: same hub surface, 960px shell. The settings page
  // remains the canonical place for configuration; this panel is the sidebar
  // companion for browsing skills without leaving the conversation.
  ctx.effect(
    () => ctx.slots.inject('main', () => ctx.slots.register({
      name: 'main',
      key: 'skill-hub',
      locale: NS,
      inject: () => ({}),
    }, () => <SkillHubPanel api={api} mode='sidebar' />)),
    'dsh-skill-hub: sidebar main panel',
  )

  // Sidebar entry icon, directly under 插件 in the left rail.
  ctx.effect(
    () => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
      name: 'sidebar.panellist',
      id: 'skill-hub',
      order: 30,
      label: () => t('entry.label'),
      locale: NS,
    }, IconSkillOutline16)),
```

</details>

#### 缺口

- 未运行实际宿主管理任务
  **影响**：无法确认面板比手工 Git 流程更省时
  **进一步探讨**：用同一个样例完成安装和退出对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 下载安装如何定位和筛查材料？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

初次 GitHub 导入用解析出的 ref 获取 tree，再单独尝试取得 commit 作为记录；下载仍用 resolvedRef，若它是可移动分支则三次查询可能跨过移动，不能把记录的 commit 当作字节证明。更新路径明确用 latest.commitSha 下载。下载先进行声明尺寸预检，再核验实际字节和 SKILL.md 结构，对集合做静态审核，阻断后清理暂存，成功才重命名到目标目录。

#### 证据与依据

**依据 1 · 源码核查**：[src/repo/api.ts:10-27](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/repo/api.ts#L10-L27)

resolvedRef 可直接是默认分支。

<details>
<summary>查看原文（18行）</summary>

```text
export async function loadRepoTree(repo: string, ref?: string, fetchImpl: typeof fetch = fetch): Promise<{ ref: string; tree: RepoTreeItem[]; truncated: boolean }> {
  const metaUrl = `https://api.github.com/repos/${repo}`
  const { json: metaJson } = await fetchJsonCached(metaUrl, fetchImpl, 'github repo not found or unavailable')
  let meta: unknown = metaJson
  const record = typeof meta === 'object' && meta !== null ? meta as Record<string, unknown> : {}
  const defaultBranch = typeof record.default_branch === 'string' && record.default_branch !== '' ? record.default_branch : 'main'
  const treeRef = ref !== undefined && ref !== '' ? ref : defaultBranch

  const treeUrl = `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(treeRef)}?recursive=1`
  const { json: payload } = await fetchJsonCached(treeUrl, fetchImpl, 'github tree not found')
  const treeRecord = typeof payload === 'object' && payload !== null ? payload as Record<string, unknown> : {}
  const truncated = treeRecord.truncated === true
  const tree = Array.isArray(treeRecord.tree) ? treeRecord.tree as RepoTreeItem[] : []
  // Report the ref the tree was actually fetched at: downloaders must use
  // this exact value so an explicit branch import never mixes trees.
  // When truncated is true GitHub returned a partial tree; callers should
  // surface a warning but still allow the partial discovery (mirrors codex walk_truncated).
  return { ref: treeRef, tree, truncated }
```

</details>

**依据 2 · 源码核查**：[src/routes/repo-import.ts:119-139](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/routes/repo-import.ts#L119-L139)

取树和单独取提交。

<details>
<summary>查看原文（21行）</summary>

```text
        if (parsed === null) { writeError(res, 400, 'repo must be owner/repo or a github.com URL'); return }
        const repo = repoSlug(parsed)
        const requestedRef = readString(body, 'ref')
        const ref = requestedRef !== '' ? requestedRef : parsed.ref
        const { ref: resolvedRef, tree } = await loadRepoTree(repo, ref)
        // 导入去重同 discover：已禁用不算「已存在」（issue #16）。
        const existing = await knownSkillNames(deps, { includeDisabled: false })
        const entries = discoverRepoEntries(tree, repo, existing)
        // truncated tree is still usable for the selected paths the user already picked from the prior discover response
        const byPath = new Map(entries.map((entry) => [entry.path, entry]))
        const selected = paths.map((path) => byPath.get(path)).filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)
        if (selected.length === 0) { writeError(res, 400, 'no matching skills for selected paths'); return }
        if (selected.length > 500) { writeError(res, 400, 'select at most 500 skills per import'); return }
        const totalBytes = selected.reduce((sum, entry) => sum + entry.totalBytes, 0)
        if (totalBytes > 200 * 1024 * 1024) { writeError(res, 400, 'selected skills exceed the 200MB import limit'); return }

        let commitSha = ''
        try {
          const latest = await getLatestCommit(repo, resolvedRef)
          commitSha = latest.commitSha
        } catch {
```

</details>

**依据 3 · 源码核查**：[src/routes/repo-import.ts:205-217](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/routes/repo-import.ts#L205-L217)

初导以 ref 下载，另存 commit/hash。

<details>
<summary>查看原文（13行）</summary>

```text
            if (controller.signal.aborted) break
            const files = collectRepoSkillFiles(tree, entry.dir)
            try {
              const result = await downloadRepoSkill(repo, resolvedRef, entry, files, targetRoot, fetch, controller.signal, (bytes, file) => {
                job.downloadedBytes += bytes
                job.currentFile = skillPathIn(entry.dir, file)
              })
              await deps.store.addSourceSkill(repo, entry.root, commitSha, resolvedRef, entry.name)
              await deps.store.mergeSourceManifest(repo, skillManifest(tree, entry.dir), entry.dir)
              // 采集刚落盘内容的哈希：这是之后区分「上游变了」与「本地改过」的唯一依据。
              const hash = await hashSkillAt(result.skillPath)
              if (hash !== undefined) await deps.store.setSourceSkillHash(repo, entry.name, hash)
              if (defaultTag !== undefined) await deps.store.addSkillToTag(defaultTag.id, entry.name)
```

</details>

**依据 4 · 源码核查**：[src/repo/install.ts:107-149](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/repo/install.ts#L107-L149)

实际字节审核、重命名与清理。

<details>
<summary>查看原文（43行）</summary>

```text
    const audited: AuditBundleFile[] = []
    await mapConcurrent(files, 6, async (file) => {
      if (signal?.aborted) throw new DOMException('aborted', 'AbortError')
      const relative = relativeToSkillDir(entry.dir, file.path)
      if (relative === '' || relative.includes('..')) throw new RepoFetchError('unsafe repo path: ' + file.path)
      const target = join(tempDir, relative)
      const buffer = await downloadGitHubFile(repo, ref, file.path, fetchImpl, signal)
      // tree 的 size 是声明值，可以撒谎；实际字节才是硬约束。
      if (buffer.length > MAX_SKILL_FILE_BYTES) {
        throw new RepoFetchError(`skill rejected by content audit: ${relative} is ${buffer.length} bytes, over the per-file limit`, 422)
      }
      const text = asAuditText(buffer)
      audited.push({ path: relative, size: buffer.length, ...(text !== undefined ? { text } : {}) })
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, buffer)
      onProgress?.(buffer.length, relative)
    })

    if (signal?.aborted) throw new DOMException('aborted', 'AbortError')

    let text: string
    try {
      text = await readFile(join(tempDir, 'SKILL.md'), 'utf8')
    } catch {
      throw new RepoFetchError('downloaded skill has no SKILL.md')
    }
    const parsed = parseFrontmatter(text)
    if ('error' in parsed) throw new RepoFetchError('downloaded skill rejected: ' + parsed.error, 422)
    if (parsed.value.name !== entry.name) {
      throw new RepoFetchError('downloaded skill declares name "' + parsed.value.name + '", expected "' + entry.name + '"', 422)
    }

    const blocked = blockingReason(auditSkillBundle(audited, parsed.value.description))
    if (blocked !== undefined) throw new RepoFetchError(blocked, 422)

    await rename(tempDir, targetDir)
    renamed = true
    return { targetDir, skillPath: join(targetDir, 'SKILL.md') }
  } finally {
    if (!renamed) {
      // 尽力清理临时目录，失败只打日志，不再静默吞掉；finally 保证 abort/异常都能清理
      try {
        await rm(tempDir, { recursive: true, force: true })
```

</details>

**依据 5 · 源码核查**：[src/routes/sources.ts:185-210](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/routes/sources.ts#L185-L210)

同步使用具体 commit 并检查覆盖线索。

<details>
<summary>查看原文（26行）</summary>

```text
            // 上游可能用分类子目录（skills/engineering/<name>/）且目录会移动：
            // 先在上游 tree 里搜真实位置，manifest 兜底，否则嵌套技能会 404。
            entry.dir = skillDirOf(source, name, tree.map((item) => item.path))
            entry.path = skillFileAt(entry.dir)
            const files = collectRepoSkillFiles(tree, entry.dir)
            if (files.length === 0) { failed.push({ name, error: 'skill missing upstream' }); continue }
            const targetDir = join(targetRoot, name)
            const record = await deps.store.getDisabled(name)
            const occupancy = await occupancyOf(targetRoot, name)
            // 落盘位置永远是目录包，所以本地无论是目录包还是扁平文件（启用或禁用）
            // 都得先让开，否则同名两形态会并存（issue #16 类）。
            const download = () => downloadRepoSkill(repo, latest.commitSha, entry, files, targetRoot)
            // 覆盖前的如实上报：本地内容与记录不符时，这次同步会丢掉用户的改动。
            // 是否继续由调用方（GUI 确认弹窗）决定，这里只负责不隐瞒。
            const expectedHash = source.localHashes?.[name]
            const localPath = occupancy.enabled[0]
            if (expectedHash !== undefined && localPath !== undefined) {
              const actualHash = await hashSkillAt(localPath)
              if (actualHash !== undefined && actualHash !== expectedHash) overwritten.push(name)
            }
            // 1) 禁用件与空壳让位（顺带清掉 sidecar 禁用记录）。
            await retireNamePlaceholders(deps, targetRoot, name)
            // 2) 启用件按「替换」语义处理：先挪到点前缀备份，下载失败则原样恢复。
            const enabled = occupancy.enabled[0]
            if (enabled !== undefined) {
              await replaceInPlace(trashSourceOf(enabled), download)
```

</details>

#### 缺口

- 未复现分支在首次导入时移动
  **影响**：不能估计版本不一致出现概率
  **进一步探讨**：使用测试仓库在获取树与下载间移动分支并核对记录和内容

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限、审计与恢复有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

路由动态获取宿主 connection 进行请求检查，异常时 403，服务缺失走本地围栏。内容审核以规则和容量检查为主，不覆盖所有可执行或恶意语义。首次导入可能在下载前把禁用占位移入回收站；随后失败也会报告已移动。恢复要求目标路径未被占用，然后恢复来源与标签记录。不可把一次导入的失败或阻断理解为全流程没有状态变化。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:53-70](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/routes.ts#L53-L70)

宿主围栏、缺服务回退与异常拒绝。

<details>
<summary>查看原文（18行）</summary>

```text
export function hostTrustFence(read: () => HostConnectionHandle | undefined, onMissing?: () => void): RouteFence {
  let missingReported = false
  return (request) => {
    const connection = read()
    if (connection === undefined) {
      if (!missingReported) {
        missingReported = true
        onMissing?.()
      }
      return loopbackOnlyFence(request)
    }
    try {
      return connection.requestRejection(request)
    } catch {
      // Fail closed: a broken fence must never open file-mutating routes.
      return 403
    }
  }
```

</details>

**依据 2 · 源码核查**：[src/repo/install.ts:127-149](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/repo/install.ts#L127-L149)

下载后实际审核与文件写入顺序。

<details>
<summary>查看原文（23行）</summary>

```text
    let text: string
    try {
      text = await readFile(join(tempDir, 'SKILL.md'), 'utf8')
    } catch {
      throw new RepoFetchError('downloaded skill has no SKILL.md')
    }
    const parsed = parseFrontmatter(text)
    if ('error' in parsed) throw new RepoFetchError('downloaded skill rejected: ' + parsed.error, 422)
    if (parsed.value.name !== entry.name) {
      throw new RepoFetchError('downloaded skill declares name "' + parsed.value.name + '", expected "' + entry.name + '"', 422)
    }

    const blocked = blockingReason(auditSkillBundle(audited, parsed.value.description))
    if (blocked !== undefined) throw new RepoFetchError(blocked, 422)

    await rename(tempDir, targetDir)
    renamed = true
    return { targetDir, skillPath: join(targetDir, 'SKILL.md') }
  } finally {
    if (!renamed) {
      // 尽力清理临时目录，失败只打日志，不再静默吞掉；finally 保证 abort/异常都能清理
      try {
        await rm(tempDir, { recursive: true, force: true })
```

</details>

**依据 3 · 源码核查**：[src/routes/repo-import.ts:184-208](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/routes/repo-import.ts#L184-L208)

禁用占位可在下载之前移入回收站。

<details>
<summary>查看原文（25行）</summary>

```text
            // 磁盘上有同名占位。若它只是一个已禁用的占位（目录包或扁平）或一个空壳
            // 目录，先把旧东西移入回收站再继续导入；有启用的同名技能时退回「跳过」
            // （issue #16）。
            const occupancy = await occupancyOf(targetRoot, entry.name)
            if (occupancy.enabled.length > 0 || occupancy.disabled.length > 0 || occupancy.bareDir !== undefined) {
              let cleared = false
              try {
                cleared = await clearDisabledPlaceholder(deps, targetRoot, entry.name)
              } catch {
                cleared = false
              }
              if (!cleared) {
                job.skipped.push({ name: entry.name, reason: 'exists' })
                job.downloadedBytes += entry.totalBytes
                job.done += 1
                continue
              }
              // 占位已经进了回收站（可恢复）。即使随后的下载失败也必须如实
              // 上报，否则用户不知道自己的占位被挪走了。
              job.replaced.push(entry.name)
            }
            if (controller.signal.aborted) break
            const files = collectRepoSkillFiles(tree, entry.dir)
            try {
              const result = await downloadRepoSkill(repo, resolvedRef, entry, files, targetRoot, fetch, controller.signal, (bytes, file) => {
```

</details>

**依据 4 · 源码核查**：[src/routes/sources.ts:347-370](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/routes/sources.ts#L347-L370)

恢复冲突、源归属和标签回写。

<details>
<summary>查看原文（24行）</summary>

```text
      jsonBody: true,
      handler: async ({ res, body }) => {
        const name = readString(body, 'name')
        if (name === '') { writeError(res, 400, 'name is required'); return }
        const entry = await deps.store.getTrash(name)
        if (entry === undefined) { writeError(res, 404, 'trash entry not found: ' + name); return }
        const home = homeOf(deps)
        const target = entry.sourcePath ?? join(rootPath('user-dsh', home), name)
        if (await pathExists(target)) {
          writeError(res, 409, 'skill already exists: ' + name)
          return
        }
        const path = await restoreSkill(entry, home)
        // 恢复来源归属（入回收站前快照的来源记录）与角色成员，否则恢复后
        // 的技能会变成「个人技能」并脱离原角色。
        if (entry.origin !== undefined) {
          await deps.store.addSourceSkill(entry.origin.repo, entry.origin.root, entry.origin.commitSha, entry.origin.ref, name)
        }
        for (const tagId of entry.tagIds ?? []) {
          await deps.store.addSkillToTag(tagId, name)
        }
        await deps.store.removeTrash(entry.path)
        deps.invalidate?.()
        writeJson(res, 200, { ok: true, name, path } satisfies SourceRestoreResponse)
```

</details>

#### 缺口

- 未验证宿主请求鉴权及所有恶意 Skill 绕过
  **影响**：不能将静态通过视作安全承诺
  **进一步探讨**：仅导入自控内容，对阻断、占位和恢复分别核验

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证单个非关键 Skill 的管理收益？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

在专用测试 home 或无已有技能的环境，选择内容自控的一个小 Skill，使用固定提交作为来源，手工核对已安装字节。与直接复制同一版本对照，分别计入导入、查版本、恢复及删除的时间。假设是来源和回收站能减少多版本维护的返工；若无法追溯实际内容、回收状态异常或单个技能更适合直接管理，就停止并回到 Git 目录流程。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes/repo-import.ts:119-139](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/routes/repo-import.ts#L119-L139)

可以指定来源 ref，需检查它是否固定。

<details>
<summary>查看原文（21行）</summary>

```text
        if (parsed === null) { writeError(res, 400, 'repo must be owner/repo or a github.com URL'); return }
        const repo = repoSlug(parsed)
        const requestedRef = readString(body, 'ref')
        const ref = requestedRef !== '' ? requestedRef : parsed.ref
        const { ref: resolvedRef, tree } = await loadRepoTree(repo, ref)
        // 导入去重同 discover：已禁用不算「已存在」（issue #16）。
        const existing = await knownSkillNames(deps, { includeDisabled: false })
        const entries = discoverRepoEntries(tree, repo, existing)
        // truncated tree is still usable for the selected paths the user already picked from the prior discover response
        const byPath = new Map(entries.map((entry) => [entry.path, entry]))
        const selected = paths.map((path) => byPath.get(path)).filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)
        if (selected.length === 0) { writeError(res, 400, 'no matching skills for selected paths'); return }
        if (selected.length > 500) { writeError(res, 400, 'select at most 500 skills per import'); return }
        const totalBytes = selected.reduce((sum, entry) => sum + entry.totalBytes, 0)
        if (totalBytes > 200 * 1024 * 1024) { writeError(res, 400, 'selected skills exceed the 200MB import limit'); return }

        let commitSha = ''
        try {
          const latest = await getLatestCommit(repo, resolvedRef)
          commitSha = latest.commitSha
        } catch {
```

</details>

**依据 2 · 源码核查**：[src/routes/sources.ts:347-370](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/routes/sources.ts#L347-L370)

恢复可独立检查目标冲突。

<details>
<summary>查看原文（24行）</summary>

```text
      jsonBody: true,
      handler: async ({ res, body }) => {
        const name = readString(body, 'name')
        if (name === '') { writeError(res, 400, 'name is required'); return }
        const entry = await deps.store.getTrash(name)
        if (entry === undefined) { writeError(res, 404, 'trash entry not found: ' + name); return }
        const home = homeOf(deps)
        const target = entry.sourcePath ?? join(rootPath('user-dsh', home), name)
        if (await pathExists(target)) {
          writeError(res, 409, 'skill already exists: ' + name)
          return
        }
        const path = await restoreSkill(entry, home)
        // 恢复来源归属（入回收站前快照的来源记录）与角色成员，否则恢复后
        // 的技能会变成「个人技能」并脱离原角色。
        if (entry.origin !== undefined) {
          await deps.store.addSourceSkill(entry.origin.repo, entry.origin.root, entry.origin.commitSha, entry.origin.ref, name)
        }
        for (const tagId of entry.tagIds ?? []) {
          await deps.store.addSkillToTag(tagId, name)
        }
        await deps.store.removeTrash(entry.path)
        deps.invalidate?.()
        writeJson(res, 200, { ok: true, name, path } satisfies SourceRestoreResponse)
```

</details>

**依据 3 · 源码核查**：[src/repo/install.ts:134-149](https://github.com/cheshireez/dsh-skill-hub/blob/0d0f2ec52c50c8b6980bcee15bf4da0f738dc2ff/src/repo/install.ts#L134-L149)

落盘前内容审核和暂存处理。

<details>
<summary>查看原文（16行）</summary>

```text
    if ('error' in parsed) throw new RepoFetchError('downloaded skill rejected: ' + parsed.error, 422)
    if (parsed.value.name !== entry.name) {
      throw new RepoFetchError('downloaded skill declares name "' + parsed.value.name + '", expected "' + entry.name + '"', 422)
    }

    const blocked = blockingReason(auditSkillBundle(audited, parsed.value.description))
    if (blocked !== undefined) throw new RepoFetchError(blocked, 422)

    await rename(tempDir, targetDir)
    renamed = true
    return { targetDir, skillPath: join(targetDir, 'SKILL.md') }
  } finally {
    if (!renamed) {
      // 尽力清理临时目录，失败只打日志，不再静默吞掉；finally 保证 abort/异常都能清理
      try {
        await rm(tempDir, { recursive: true, force: true })
```

</details>

#### 缺口

- 未测实际管理时间与恢复完整性
  **影响**：不能量化维护收益
  **进一步探讨**：同样内容与版本跑一次完整安装、删除和恢复对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
