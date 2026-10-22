# dsh-codevault

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[14dcb88](https://github.com/1014029855/dsh-codevault/tree/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault)
<!-- END META -->

> **实现功能**：把源码阅读认识按仓库/文件/符号合并为Markdown对象卡，以JSONL保存条目并可选关联本地vault。

> **核心亮点**：稳定对象卡、快记展开与回访/历史接线使记录可积累，标准文本易迁移；内容依据仍由读者核查。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：vault仅词法守卫且stat递归跟链接、全文读后裁剪；expand/delete改旧行限制历史，整体JSONL与多派生文件非事务。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 适用什么阅读任务，事件怎样变成对象卡？](#detail-section-11)
  - [Q02 · 相对普通笔记增量与历史/隐私边界是什么？](#detail-section-12)
  - [Q03 · 依赖、退出和三阶段成本效果怎么判断？](#detail-section-13)
  - [Q04 · 哪些工程可复用，可追溯修订假设如何验证？](#detail-section-14)
  - [Q05 · 谁适合采用，什么情况停止？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：读者保存源码认识并重复回访，要求对象/版本坐标、真实依据和档案恢复可解释。

普通Markdown/Obsidian加人工索引可替代；对象卡接线减少归并但增模型审查、重建和隐私管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 对象卡 | 合并重复阅读认识 | subject坐标/依据需核，ref可选 |
| 历史/展开 | 回放与升级快记 | 改旧行/删除不可还原原认识 |
| vault检索 | 关联旧笔记 | 默认关闭，词法边界不挡链接 |
| 标准档案 | JSONL/Markdown可迁移 | 单写者、备份与多视图一致性责任 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、DSH tools/commands/skills及peer | 主链必需 | 工具/命令/技能接线 | 不等普通Obsidian插件 |
| 可写dataDir | 归档必需 | JSONL及派生Markdown | 启动还有迁移，需备份与单写者 |
| Obsidian软件 | 可选 | 打开标准Markdown/JSONL | 未装也能归档 |
| vaultDir | 旧笔记检索可选 | 让模型读本地笔记片段 | 不配置即不开放，配置前排除敏感/链接 |
| 模型与源码材料 | 自动撰写时 | 填充阅读认识 | 插件存储不自动验证内容正确 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定包，备份独占dataDir | 一个进程写，默认不配置整vault |
| 加载 | 安装web profile并核对目录/迁移日志 | 已加载不等历史/投影无损 |
| 记录 | 读者核对repo/ref/path/symbol和内容再保存 | 卡片和JSONL条目对应，模型说法有依据 |
| 退出/恢复 | 停用包，单独备份/清理档案与vault授权 | 卸载不删除数据，卡片从保留条目重建 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/DSH和档案空间，金额未知 | 定目录、备份、对象命名/词表与迁移 | Obsidian可选 |
| 持续使用 | 全JSONL读改写、多Markdown重建及可选全vault同步扫描 | 审核模型认识、标签与链接 | 返回截断不等读取量有上限 |
| 失败恢复 | JSONL/派生卡重建与备份恢复 | 判断已提交条目和卡片/Hubs部分完成 | 多进程最后写者赢，坏行跳过有丢记录风险 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 知识归并 | 同repo/path/symbol汇总为卡片 | 长期记忆/检索实际改善 |
| 回放 | 从保留事件子集重建 | expand/delete前认识能否保留 |
| 旧笔记关联 | 本地搜索/推荐/链接工具 | 相关性、隐私边界与大vault负担 |

> **思考**：vault仅词法守卫且stat递归跟链接、全文读后裁剪；expand/delete改旧行限制历史，整体JSONL与多派生文件非事务。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：稳定对象卡、快记展开与回访/历史接线使记录可积累，标准文本易迁移；内容依据仍由读者核查。详见[Q01](#research-q01)与[Q02](#research-q02)。

稳定对象卡、快记展开与回访/历史接线使记录可积累，标准文本易迁移；内容依据仍由读者核查。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是subject归一化/稳定对象key、固定卡名、原始条目与派生卡分层、UUID暂存加rename和以现存条目纯重建视图。ref不进key让对象随版本成长，也意味着需在每条认识保留版本；模块级配置根在同一进程多上下文时共享，应视为部署约束而非天然profile隔离。删除confirm布尔是调用约定，不能独立证明读者已同意。

<a id="detail-section-5"></a>

### 1.4 主要限制

vault仅词法守卫且stat递归跟链接、全文读后裁剪；expand/delete改旧行限制历史，整体JSONL与多派生文件非事务。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

单人单写者独立备份档案可试用，vaultDir先不配置；广泛vault读取前优先修边界。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持结构笔记、派生卡片/索引和可选vault检索的组织贡献；整文件重写不等不可变历史，vault扫描未有完整物理路径与资源围栏。修订日志和最小vault能力入口尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/domain.ts、src/store.ts、src/vault.ts、package.json、src/tools.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index/domain/store关键捕获/展开/删除和vault搜索/读取、删除工具门槛；不运行迁移/工具，不读取真实vault，不全面审计全部Markdown渲染。
- 下一步：进一步探讨可用假档案研究展开/删除回放、坏行、同写、链接环和巨型笔记，比较可恢复性与检索质量。

**分析版本**

- **仓库**：[1014029855/dsh-codevault](https://github.com/1014029855/dsh-codevault)
- **版本号**：0.3.0（[固定提交 14dcb88](https://github.com/1014029855/dsh-codevault/tree/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9)）
- **版本日期**：2026-09-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨修订/tombstone日志与最小vault入口，固定source ref并加realpath/扫描预算；涉及迁移、擦除与日志增长取舍，未验证。详见[Q04](#research-q04)。

进一步探讨可用假档案研究展开/删除回放、坏行、同写、链接环和巨型笔记，比较可恢复性与检索质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 631 | — | — | 9752 |
| .js | source | 7 | 2634 | 2320 | 316 | — |
| .mjs | source | 1 | 390 | 335 | 27 | — |
| .ts | source | 7 | 3048 | 2463 | 394 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault/issues?q=is%3Aissue+created%3A2026-09-22T05%3A49%3A06.961Z..2026-10-22T05%3A49%3A06.961Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A49%3A06.961Z..2026-10-22T05%3A49%3A06.961Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核查源码阅读对象归档、历史修订/持久化与可选vault访问边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适用什么阅读任务，事件怎样变成对象卡？

**研究主题：**场景与需求、功能与机制

#### 完整回答

适合读源码后希望按仓库/文件/符号保存认识、回访问题和旧笔记关联的人。输入是读者/模型提交的subject、认识与正文，输出JSONL条目及合并Markdown卡、仓库hub和总索引，可用Obsidian打开。合格交付既要归属/版本坐标正确，也要认识受源码支持；插件是知识记录工具，不会自动读取并证明所有笔记结论。

Host配置dataDir/vaultDir后ensureStore并迁移旧文件，注册工具、code-reading Skill和/codevault命令。domain以repo/path/symbol最深坐标组成对象key，ref是可选证据元数据且不分组。commit读取所有条目后原子替换JSONL，再重建对象卡/hub/MOC，查询/历史从条目重放；旧笔记访问仅在vaultDir配置后启用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-9](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/README.md#L7-L9)

作者问题与对象卡目标。

```text
读开源代码的时候，我们经常"这次懂了，下次又忘了"。这个插件干的事很简单：在读懂的那一刻记一笔，按仓库、文件、符号归档，以后想回看随时能翻出来。

档案就是 Markdown + JSONL 文件，可以直接用 Obsidian 打开。同一个对象（比如 `plugin.ts` 的 `apply` 机制）读多少次都记在同一张卡上，卡片会随着你的阅读长起来，不是一条条碎片流水账。
```

**依据 2 · 源码核查**：[src/index.ts:62-78](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/index.ts#L62-L78)

配置/迁移/注册。

<details>
<summary>查看原文（17行）</summary>

```text
  const root = dataRoot()
  // Vault access is read-only; archive root feeds in-archive separation.
  configureVaultRoot(config.vaultDir, root)
  ensureStore()
  // One-time migration of pre-title archives (idempotent; 0 when nothing to do).
  const migrated = migrateLegacyNoteFiles()
  for (const tool of TOOLS) {
    ctx.tools.register(tool)
  }
  ctx.skills.register(CODE_READING_SKILL)
  registerCodevaultCommand(ctx)
  console.log(
    `[${name}] loaded: skill=code-reading tools=${TOOLS.map((t) => t.name).join(',')} command=/codevault dataDir=${root}` +
      (vaultRoot() ? ` vaultDir=${vaultRoot()}` : ' (vault 检索未启用)') +
      (migrated > 0 ? ` migratedCards=${migrated}` : ''),
  )
}
```

</details>

**依据 3 · 源码核查**：[src/domain.ts:18-26](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/domain.ts#L18-L26)

坐标含可选ref。

```text
export interface ReadingSubject {
  /** owner/name (e.g. deepseek-ai/deepseek-harness) or a local folder name. */
  readonly repo: string
  /** Optional version / commit / branch the read happened against. */
  readonly ref?: string
  /** Optional file path relative to the repo root. */
  readonly path?: string
  /** Optional function/class/module/symbol that was read. */
  readonly symbol?: string
```

**依据 4 · 源码核查**：[src/domain.ts:220-232](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/domain.ts#L220-L232)

对象key不含版本。

<details>
<summary>查看原文（13行）</summary>

```text
 * Canonical grouping key of a reading OBJECT — the deepest coordinate given:
 * `symbol` (repo+path+symbol) > `path` (repo+path) > `repo`. Events that share
 * the same key are the same object and project onto ONE card (object card).
 * The key is derived ONLY from the deepest granularity actually provided, so
 * "same file re-read" and "same symbol re-read" each stay one card.
 */
export function objectKey(s: ReadingSubject): string {
  const repo = normalizeRepo(s.repo)
  const path = s.path?.trim()
  const symbol = s.symbol?.trim()
  if (symbol) return `S\u0000${repo}\u0000${path ?? ''}\u0000${symbol}`
  if (path) return `P\u0000${repo}\u0000${path}`
  return `R\u0000${repo}`
```

</details>

**依据 5 · 源码核查**：[src/store.ts:163-174](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L163-L174)

写JSONL后派生卡。

<details>
<summary>查看原文（12行）</summary>

```text
export function commitEntry(entry: ReadingEntry): { notePath: string; hubPath: string; mocPath: string } {
  const root = ensureStore()
  const rows = readEntries()
  const key = entryObjectKey(entry)
  const siblings = rows.filter((e) => entryObjectKey(e) === key)
  const noteFile = objectFileName([...siblings, entry], rows)
  const stored: ReadingEntry = { ...entry, noteFile }
  atomicWrite(libraryFile(root), [...rows, stored].map((e) => JSON.stringify(e)).join('\n') + '\n')
  const notePath = writeObjectCard(key)
  const hubPath = refreshHub(stored.subject.repo)
  const mocPath = refreshMOC()
  return { notePath, hubPath, mocPath }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对普通笔记增量与历史/隐私边界是什么？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

增量是稳定对象卡、重复阅读累计、快记展开、回访问题与可重放派生视图，让模型记笔记能按源码坐标组织。Markdown/JSONL与本地检索都易迁移，但不自动保证source ref不可变、原材料保留或结论正确，同卡跨版本更需要读者识别演变。

关键限制是vault所谓path-confined仅resolve加字符串前缀，递归stat会跟随符号链接，没有realpath/visited集合或深度/扫描上限。目录内链接可通到root外笔记，循环链接也可导致扫描失控；readVaultNote原生读全文后才裁剪返回，不能把8000字符输出上限理解为I/O/内存上限。纯本地只读也不等笔记不会进入模型上下文/对话记录。

历史也不是不可变事件账本。新增会整体读改写JSONL，expand原地改旧行，delete物理移除行；之后历史只能回放仍保留的数据，不能恢复被覆盖/删除的认识。单文件tmp+rename后再写多份派生视图不是跨文件事务，坏行读取被跳过，跨进程last-writer-wins是作者明确边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/vault.ts:63-96](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/vault.ts#L63-L96)

跟随stat递归与词法边界。

<details>
<summary>查看原文（34行）</summary>

```text
/** Recursively collect .md paths under root (relative), sorted for determinism. */
function collectMarkdown(root: string, dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    if (isIgnoredDir(name)) continue
    const full = join(dir, name)
    let stat: ReturnType<typeof statSync>
    try {
      stat = statSync(full)
    } catch {
      continue // broken symlink / permission race
    }
    if (stat.isDirectory()) collectMarkdown(root, full, out)
    else if (stat.isFile() && isMarkdown(name)) out.push(relative(root, full))
  }
}

/** All markdown note paths under the vault (relative). */
export function listNotes(): string[] {
  if (!configuredVault) return []
  if (!existsSync(configuredVault)) return []
  const out: string[] = []
  collectMarkdown(configuredVault, configuredVault, out)
  return out.sort()
}

/** Safely resolve a vault-relative path to absolute; throws when escaping. */
export function resolveVaultPath(relPath: string): string {
  if (!configuredVault) throw new Error('vaultDir 未配置：请先在 cordis.patch.yml 里给 dsh-codevault 设置 vaultDir')
  const target = resolve(configuredVault, relPath)
  const rootPrefix = configuredVault.endsWith(sep) ? configuredVault : configuredVault + sep
  if (target !== configuredVault && !target.startsWith(rootPrefix)) {
    throw new Error(`路径越界：${relPath} 不在 vault 目录 ${configuredVault} 内`)
  }
  return target
```

</details>

**依据 2 · 源码核查**：[src/vault.ts:215-225](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/vault.ts#L215-L225)

全文读取后裁剪。

<details>
<summary>查看原文（11行）</summary>

```text
/** Read a vault note by relative path (clipped). Throws outside vault / missing. */
export function readVaultNote(relPath: string, maxChars = 8000): { path: string; content: string } {
  const rel = relPath.trim().replace(/^[/\\]+/u, '')
  const full = resolveVaultPath(rel)
  if (!existsSync(full) || !statSync(full).isFile()) throw new Error(`vault 里没有这个笔记：${rel}`)
  const text = readFileSync(full, 'utf8')
  const chars = [...text]
  return {
    path: rel,
    content: chars.length <= maxChars ? text : `${chars.slice(0, maxChars).join('')}\n…（已截断，全文 ${chars.length} 字符）`,
  }
```

</details>

**依据 3 · 源码核查**：[src/store.ts:24-25](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L24-L25)

跨进程最后写者赢。

```text
 * Concurrency (V1 note still holds): all I/O synchronous, atomic tmp+rename;
 * cross-process writers: last writer wins (documented, accepted).
```

**依据 4 · 源码核查**：[src/store.ts:100-110](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L100-L110)

坏行容错读取。

<details>
<summary>查看原文（11行）</summary>

```text
/** Read every event row on disk (tolerant of missing/corrupt lines). */
export function readEntries(): ReadingEntry[] {
  const file = libraryFile(dataRoot())
  if (!existsSync(file)) return []
  const raw = readFileSync(file, 'utf8')
  const entries: ReadingEntry[] = []
  for (const line of raw.split(/\r?\n/u)) {
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      const parsed = JSON.parse(trimmed) as ReadingEntry
```

</details>

**依据 5 · 源码核查**：[src/store.ts:163-174](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L163-L174)

整体替换后派生重建。

<details>
<summary>查看原文（12行）</summary>

```text
export function commitEntry(entry: ReadingEntry): { notePath: string; hubPath: string; mocPath: string } {
  const root = ensureStore()
  const rows = readEntries()
  const key = entryObjectKey(entry)
  const siblings = rows.filter((e) => entryObjectKey(e) === key)
  const noteFile = objectFileName([...siblings, entry], rows)
  const stored: ReadingEntry = { ...entry, noteFile }
  atomicWrite(libraryFile(root), [...rows, stored].map((e) => JSON.stringify(e)).join('\n') + '\n')
  const notePath = writeObjectCard(key)
  const hubPath = refreshHub(stored.subject.repo)
  const mocPath = refreshMOC()
  return { notePath, hubPath, mocPath }
```

</details>

**依据 6 · 源码核查**：[src/store.ts:198-225](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L198-L225)

expand更新旧条目。

<details>
<summary>查看原文（28行）</summary>

```text
export function expandEntry(
  id: string,
  patch: { context?: string; bodyMarkdown: string; takeaway: readonly string[]; revisit?: readonly unknown[] },
): ReadingEntry {
  const root = ensureStore()
  const file = libraryFile(root)
  if (!existsSync(file)) throw new Error('档案为空，找不到要升级的记录')
  const rows = readEntries()
  const target = rows.find((e) => e.id === id)
  if (!target) throw new Error(`档案里没有 id=${id} 的记录`)
  if (target.bodyMarkdown) throw new Error(`id=${id} 已经是深读笔记（有正文），如需改写请删后重建`)

  const body = patch.bodyMarkdown.trim()
  if ([...body].length < MIN_NOTE_BODY) {
    throw new Error(`bodyMarkdown 需至少 ${MIN_NOTE_BODY} 字（当前 ${[...body].length}）——请按阅读框架写足再升级`)
  }
  const takeaway = patch.takeaway.map((t) => String(t).trim()).filter((t) => t.length > 0)
  if (takeaway.length === 0) throw new Error('升级为深读笔记至少要有 1 条 takeaway')

  const context = patch.context?.trim() || target.context
  const updated: ReadingEntry = {
    ...target,
    kind: 'note',
    ...(context ? { context } : {}),
    bodyMarkdown: body,
    takeaway,
    revisit: patch.revisit !== undefined ? normalizeRevisit(patch.revisit) : (target.revisit ?? []),
    updatedAt: new Date().toISOString(),
```

</details>

**依据 7 · 源码核查**：[src/store.ts:259-278](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L259-L278)

物理删除行与卡片。

<details>
<summary>查看原文（20行）</summary>

```text
export function deleteEntry(id: string): boolean {
  const root = dataRoot()
  const file = libraryFile(root)
  if (!existsSync(file)) return false
  const before = readEntries()
  const removed = before.find((e) => e.id === id)
  if (!removed) return false
  const after = before.filter((e) => e.id !== id)
  atomicWrite(file, after.map((e) => JSON.stringify(e)).join('\n') + (after.length > 0 ? '\n' : ''))
  const key = entryObjectKey(removed)
  const survivors = after.filter((e) => entryObjectKey(e) === key)
  const noteFile = removed.noteFile
  if (survivors.length > 0) {
    writeObjectCard(key)
  } else if (noteFile) {
    const card = join(root, 'notes', `${noteFile}.md`)
    if (existsSync(card)) rmSync(card, { force: true })
  }
  refreshHub(removed.subject.repo)
  refreshMOC()
```

</details>

#### 缺口

- 链接逃逸/循环、巨型vault及多实例同写未做运行复现。
  **影响：**不能把词法守卫/原子rename称物理隔离或并发无损。
  **进一步探讨：**可先用假笔记、链接环和独占临时目录夹具核查，不接触真实vault；对同写和坏行保留恢复副本。
- 源码ref与笔记依据没有自动固定/校验完整链。
  **影响：**同卡可汇总不同版本认识，不能把历史卡片当同一版本事实。
  **进一步探讨：**可核对每条subject.ref和引用原材料，优先固定commit与路径再解释认识变化。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、退出和三阶段成本效果怎么判断？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

package0.3.0要求Node>=22及DSH内部peer；直接使用源码或安装只改变包，不改变数据授权。dataDir默认DSH_HOME下路径、可改Obsidian子目录，vaultDir另行可选，宜把单独归档与广泛旧笔记访问分开。启动可能迁移卡片，先备份而非认为启动完全只读。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、DSH tools/commands/skills及peer | 主链必需 | 工具/命令/技能接线 | 不等普通Obsidian插件 |
| 可写dataDir | 归档必需 | JSONL及派生Markdown | 启动还有迁移，需备份与单写者 |
| Obsidian软件 | 可选 | 打开标准Markdown/JSONL | 未装也能归档 |
| vaultDir | 旧笔记检索可选 | 让模型读本地笔记片段 | 不配置即不开放，配置前排除敏感/链接 |
| 模型与源码材料 | 自动撰写时 | 填充阅读认识 | 插件存储不自动验证内容正确 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定包，备份独占dataDir | 一个进程写，默认不配置整vault |
| 加载 | 安装web profile并核对目录/迁移日志 | 已加载不等历史/投影无损 |
| 记录 | 读者核对repo/ref/path/symbol和内容再保存 | 卡片和JSONL条目对应，模型说法有依据 |
| 退出/恢复 | 停用包，单独备份/清理档案与vault授权 | 卸载不删除数据，卡片从保留条目重建 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/DSH和档案空间，金额未知 | 定目录、备份、对象命名/词表与迁移 | Obsidian可选 |
| 持续使用 | 全JSONL读改写、多Markdown重建及可选全vault同步扫描 | 审核模型认识、标签与链接 | 返回截断不等读取量有上限 |
| 失败恢复 | JSONL/派生卡重建与备份恢复 | 判断已提交条目和卡片/Hubs部分完成 | 多进程最后写者赢，坏行跳过有丢记录风险 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 知识归并 | 同repo/path/symbol汇总为卡片 | 长期记忆/检索实际改善 |
| 回放 | 从保留事件子集重建 | expand/delete前认识能否保留 |
| 旧笔记关联 | 本地搜索/推荐/链接工具 | 相关性、隐私边界与大vault负担 |

比较应是同一阅读对象、过一段时间正确找到并解释认识的任务，计模型撰写/审查、检索和故障恢复，不按卡片数承诺学会。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:50-74](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/package.json#L50-L74)

引擎与DSH peer。

<details>
<summary>查看原文（25行）</summary>

```text
    "node": ">=22.0.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-commands": "^0.1.2-rc.1",
    "@deepseek-ai/dsh-home-paths": "^0.1.2-rc.1",
    "@deepseek-ai/dsh-skill": "^0.1.2-rc.1",
    "@deepseek-ai/dsh-tools": "^0.1.2-rc.1",
    "@deepseek-ai/schemastery": "^3.18.2"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.2",
    "@deepseek-ai/dsh-commands": "0.1.2-rc.1",
    "@deepseek-ai/dsh-home-paths": "0.1.2-rc.1",
    "@deepseek-ai/dsh-skill": "0.1.2-rc.1",
    "@deepseek-ai/dsh-tools": "0.1.2-rc.1",
    "@deepseek-ai/schemastery": "3.18.2",
    "@types/node": "^22.10.0",
    "typescript": "^5.6.3"
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:62-78](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/index.ts#L62-L78)

目录配置与启动迁移。

<details>
<summary>查看原文（17行）</summary>

```text
  const root = dataRoot()
  // Vault access is read-only; archive root feeds in-archive separation.
  configureVaultRoot(config.vaultDir, root)
  ensureStore()
  // One-time migration of pre-title archives (idempotent; 0 when nothing to do).
  const migrated = migrateLegacyNoteFiles()
  for (const tool of TOOLS) {
    ctx.tools.register(tool)
  }
  ctx.skills.register(CODE_READING_SKILL)
  registerCodevaultCommand(ctx)
  console.log(
    `[${name}] loaded: skill=code-reading tools=${TOOLS.map((t) => t.name).join(',')} command=/codevault dataDir=${root}` +
      (vaultRoot() ? ` vaultDir=${vaultRoot()}` : ' (vault 检索未启用)') +
      (migrated > 0 ? ` migratedCards=${migrated}` : ''),
  )
}
```

</details>

**依据 3 · 源码核查**：[src/vault.ts:176-190](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/vault.ts#L176-L190)

搜索逐笔记原生全文读取。

<details>
<summary>查看原文（15行）</summary>

```text
  const scope = params.scope ?? 'user'
  const hits: VaultNoteHit[] = []
  for (const rel of listNotes()) {
    if (folderNeedle && !rel.startsWith(folderNeedle.replace(/\\/g, '/')) && !rel.startsWith(folderNeedle)) continue
    const inArchive = isArchiveNote(rel)
    if (scope === 'user' && inArchive) continue
    if (scope === 'archive' && !inArchive) continue
    const full = resolveVaultPath(rel)
    let text: string
    try {
      text = readFileSync(full, 'utf8')
    } catch {
      continue
    }
    const { fm, body } = parseFrontMatter(text)
```

</details>

**依据 4 · 源码核查**：[src/store.ts:163-174](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L163-L174)

全量读改写与派生多文件成本。

<details>
<summary>查看原文（12行）</summary>

```text
export function commitEntry(entry: ReadingEntry): { notePath: string; hubPath: string; mocPath: string } {
  const root = ensureStore()
  const rows = readEntries()
  const key = entryObjectKey(entry)
  const siblings = rows.filter((e) => entryObjectKey(e) === key)
  const noteFile = objectFileName([...siblings, entry], rows)
  const stored: ReadingEntry = { ...entry, noteFile }
  atomicWrite(libraryFile(root), [...rows, stored].map((e) => JSON.stringify(e)).join('\n') + '\n')
  const notePath = writeObjectCard(key)
  const hubPath = refreshHub(stored.subject.repo)
  const mocPath = refreshMOC()
  return { notePath, hubPath, mocPath }
```

</details>

#### 缺口

- 没有长期回访、查找正确率、大档案/大vault资源及恢复人时对照。
  **影响：**不能量化提高记忆或降低阅读总成本。
  **进一步探讨：**可对同对象笔记比较普通Markdown与对象卡方案，统计隔周回忆/检索、错误认识修订和完整维护人时。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些工程可复用，可追溯修订假设如何验证？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

可复用的是subject归一化/稳定对象key、固定卡名、原始条目与派生卡分层、UUID暂存加rename和以现存条目纯重建视图。ref不进key让对象随版本成长，也意味着需在每条认识保留版本；模块级配置根在同一进程多上下文时共享，应视为部署约束而非天然profile隔离。删除confirm布尔是调用约定，不能独立证明读者已同意。

可探讨未验证的“可追溯修订日志与最小vault入口”。expand/link/delete写新修订或tombstone而不物理改旧行，记录固定source ref/文件与变化理由；vault访问realpath并拒链接逃逸/循环、设扫描预算，必要时只索引明确选定文件。相对当前物理改行与广泛同步扫描，目标是可解释历史变化并限制私有内容。代价是旧格式迁移、日志增长、擦除需求与检索索引维护。可用修订/删除后回放、坏行、并发写、链接环及大笔记夹具，比较历史完整性、越界读取和恢复人时；若不能同时满足删除隐私与审计需求，应明确取舍而非宣称永远append-only。

#### 证据与依据

**依据 1 · 源码核查**：[src/domain.ts:220-232](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/domain.ts#L220-L232)

稳定对象key。

<details>
<summary>查看原文（13行）</summary>

```text
 * Canonical grouping key of a reading OBJECT — the deepest coordinate given:
 * `symbol` (repo+path+symbol) > `path` (repo+path) > `repo`. Events that share
 * the same key are the same object and project onto ONE card (object card).
 * The key is derived ONLY from the deepest granularity actually provided, so
 * "same file re-read" and "same symbol re-read" each stay one card.
 */
export function objectKey(s: ReadingSubject): string {
  const repo = normalizeRepo(s.repo)
  const path = s.path?.trim()
  const symbol = s.symbol?.trim()
  if (symbol) return `S\u0000${repo}\u0000${path ?? ''}\u0000${symbol}`
  if (path) return `P\u0000${repo}\u0000${path}`
  return `R\u0000${repo}`
```

</details>

**依据 2 · 源码核查**：[src/store.ts:89-97](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L89-L97)

UUID暂存rename。

```text
/** Atomically replace `file` with `content` (same-dir temp + rename). */
function atomicWrite(file: string, content: string): void {
  const tmp = `${file}.tmp-${randomUUID()}`
  try {
    writeFileSync(tmp, content, 'utf8')
    renameSync(tmp, file)
  } finally {
    if (existsSync(tmp)) rmSync(tmp, { force: true })
  }
```

**依据 3 · 源码核查**：[src/vault.ts:21-36](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/vault.ts#L21-L36)

模块级root配置。

<details>
<summary>查看原文（16行）</summary>

```text
/** Vault root configured by the plugin Config (`vaultDir`). Empty = unset. */
let configuredVault: string | undefined
/**
 * Archive root (the plugin's own dataDir). When it lives INSIDE the vault,
 * notes under it are "the archive" (plugin-written cards/hub/MOC) and are
 * separated from the user's own notes in search results.
 */
let configuredArchive: string | undefined

/**
 * Apply the plugin Config's vaultDir (+ the archive dataDir for separation).
 * Either root may be empty to disable the respective feature.
 */
export function configureVaultRoot(vaultDir: string | undefined, archiveRoot?: string): void {
  configuredVault = vaultDir?.trim() ? resolve(vaultDir.trim()) : undefined
  configuredArchive = archiveRoot?.trim() ? resolve(archiveRoot.trim()) : undefined
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:1107-1114](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/tools.ts#L1107-L1114)

删除依赖confirm参数。

```text
    if (args.confirm !== true) {
      throw new Error('删除不可恢复：请先向用户确认，再以 confirm=true 调用')
    }
    const before = readEntries().find((e) => e.id === args.id)
    if (!before) throw new Error(`档案里没有 id=${args.id} 的记录`)
    const key = entryObjectKey(before)
    const cardPath = noteFilePath(before)
    const removed = deleteEntry(args.id)
```

**依据 5 · 源码核查**：[src/store.ts:259-278](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L259-L278)

修订假设的物理删除起点。

<details>
<summary>查看原文（20行）</summary>

```text
export function deleteEntry(id: string): boolean {
  const root = dataRoot()
  const file = libraryFile(root)
  if (!existsSync(file)) return false
  const before = readEntries()
  const removed = before.find((e) => e.id === id)
  if (!removed) return false
  const after = before.filter((e) => e.id !== id)
  atomicWrite(file, after.map((e) => JSON.stringify(e)).join('\n') + (after.length > 0 ? '\n' : ''))
  const key = entryObjectKey(removed)
  const survivors = after.filter((e) => entryObjectKey(e) === key)
  const noteFile = removed.noteFile
  if (survivors.length > 0) {
    writeObjectCard(key)
  } else if (noteFile) {
    const card = join(root, 'notes', `${noteFile}.md`)
    if (existsSync(card)) rmSync(card, { force: true })
  }
  refreshHub(removed.subject.repo)
  refreshMOC()
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁适合采用，什么情况停止？

**研究主题：**采用判断

#### 完整回答

推荐trial，限单人单进程、已备份的独立dataDir，先保持vaultDir未配置。对象归档和标准文本格式有实用价值，重点在读者自己理解与后续回访，不把模型生成笔记当审过源码的事实。广泛接入真实Obsidian vault应先修物理路径/扫描边界，再研究是否值得启用。

继续探讨可先用假笔记查看捕获、展开、删除后的JSONL/卡片和历史，核对版本坐标，再研究链接/循环及多文件失败。遇到未预期vault内容被读取、版本认识混淆、坏行被静默遗漏、多个写者覆盖或派生视图与事件不一致，应停止写入并先保存备份盘点。Q02历史边界与Q03完整任务效果影响扩大采用，本轮不写真实档案。

#### 证据与依据

**依据 1 · 源码核查**：[src/vault.ts:34-36](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/vault.ts#L34-L36)

vault可保持未配置。

```text
export function configureVaultRoot(vaultDir: string | undefined, archiveRoot?: string): void {
  configuredVault = vaultDir?.trim() ? resolve(vaultDir.trim()) : undefined
  configuredArchive = archiveRoot?.trim() ? resolve(archiveRoot.trim()) : undefined
```

**依据 2 · 源码核查**：[src/store.ts:24-25](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L24-L25)

单写者约束。

```text
 * Concurrency (V1 note still holds): all I/O synchronous, atomic tmp+rename;
 * cross-process writers: last writer wins (documented, accepted).
```

**依据 3 · 源码核查**：[src/store.ts:163-174](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/src/store.ts#L163-L174)

多文件更新链。

<details>
<summary>查看原文（12行）</summary>

```text
export function commitEntry(entry: ReadingEntry): { notePath: string; hubPath: string; mocPath: string } {
  const root = ensureStore()
  const rows = readEntries()
  const key = entryObjectKey(entry)
  const siblings = rows.filter((e) => entryObjectKey(e) === key)
  const noteFile = objectFileName([...siblings, entry], rows)
  const stored: ReadingEntry = { ...entry, noteFile }
  atomicWrite(libraryFile(root), [...rows, stored].map((e) => JSON.stringify(e)).join('\n') + '\n')
  const notePath = writeObjectCard(key)
  const hubPath = refreshHub(stored.subject.repo)
  const mocPath = refreshMOC()
  return { notePath, hubPath, mocPath }
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
