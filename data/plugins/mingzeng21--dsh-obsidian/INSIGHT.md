# dsh-obsidian

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[6cdb93f](https://github.com/mingzeng21/dsh-obsidian/tree/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70)

<!-- BEGIN META -->
[![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mingzeng21/dsh-obsidian) [![npm 30d 3,836](https://img.shields.io/static/v1?label=npm+30d&message=3%2C836&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-obsidian) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-obsidian)
<!-- END META -->

> **功能**：将 DSH 连接到本地 Obsidian 笔记库，提供搜索、反链、属性和文件操作。

> **亮点**：把搜索结果、YAML 属性及反链接到同一个 DSH 会话工具集，移动后还会自动尝试改写匹配的 wiki 链接。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：词法根检查和扫描排除不能限制实际符号链接与直接读取。移动和逐篇重写分开，属性工具也可能在实际写入后返回读回错误。失败后应核对磁盘上的笔记、链接和回收站。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 已有 Obsidian vault 的 DSH 用户为什么需要它，调用经过哪些组件？](#detail-section-11)
  - [Q02 · vault 路径检查、排除目录和 workspace 限制分别能保证什么？](#detail-section-12)
  - [Q03 · 移动、回收和改属性失败时会留下什么状态？](#detail-section-13)
  - [Q04 · 配置、启用与退出如何影响笔记，适合在什么条件下试用？](#detail-section-14)
  - [Q05 · 为重命名增加改动清单和结果确认，能减少半更新后的误判吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Obsidian vault 的 DSH 用户经常在会话内找回笔记、属性和相关链接。[Q01](#research-q01)

手动在 Obsidian 搜索、查看反链，或使用 DSH 原生文件工具及本地解析脚本。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地查询与反链 | 在 DSH 找到原笔记与匹配链接 | 排除仅用于扫描，路径不是物理授权边界 |
| 读写、改属性与回收 | 整理本地 Markdown | 并发与跨文件失败须查实际结果 |
| Web 配置页 | 按宿主表单管理目标与限制 | 即时刷新取决于宿主 volatile 接口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH tools 与 agents 服务 | 必需 | 注册工具 | 工具无法加载 |
| Node >=22.12 | 包声明要求 | 执行插件 | 另核宿主实际 Node 下限 |
| 低权限账户、非敏感 vault 副本 | 本试用必需 | 限定实际文件范围 | 回原生查看 |
| Obsidian CLI、ripgrep | 可选 | 属性委派、搜索加速 | 未启用 CLI 或命令失败时走文件路径，搜索可回退扫描 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在独立配置指定无链接的副本路径 | 宿主日志与目标一致 |
| 试用 | 用户发起已知结果的查询与反链 | 路径和匹配与原文一致 |
| 退出 | 用户停用插件并检查已发生的改动 | 回 Obsidian 或备份核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- |
| 首次使用 | 本地存储和宿主资源未测 | 创建副本并核对目录 | Node 与宿主门槛不同 |
| 持续使用 | 扫描和文件重写开销未测 | 对照链接与同步状态 | 结果条数不代表扫描成本上限 |
| 失败恢复 | 副本和备份需要空间 | 查源、目标、反链和回收站 | 停用不能撤销写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 查询 | 搜索行、YAML 和反链接线 | 实际速度和复杂链接覆盖 |
| 改名 | 移动后匹配并重写链接 | 多文件失败的恢复时间 |
| 停用 | 撤销后续注册入口 | 在途操作和平台实际表现 |

> **思考**：词法根检查和扫描排除不能限制实际符号链接与直接读取。移动和逐篇重写分开，属性工具也可能在实际写入后返回读回错误。失败后应核对磁盘上的笔记、链接和回收站。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把搜索结果、YAML 属性及反链接到同一个 DSH 会话工具集，移动后还会自动尝试改写匹配的 wiki 链接。[Q01](#research-q01) [Q03](#research-q03)

用宿主工具注册、本地文件访问和可选 CLI 分层。配置重建有代数防护，但文件范围依赖词法检查，跨文件动作没有一致提交边界。CLI 属性读回失败会传给调用方，命令可能已完成。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

词法根检查和扫描排除不能限制实际符号链接与直接读取。移动和逐篇重写分开，属性工具也可能在实际写入后返回读回错误。失败后应核对磁盘上的笔记、链接和回收站。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在独立低权限环境使用无符号链接的非敏感副本，仅核对查询与反链。打开写工具前单独检查范围、备份与故障恢复。出现意外路径或不一致时停用并回原生应用。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持宿主工具接线、读写与刷新。路径物理隔离、并发改动和固定版本宿主尚未执行验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/tools.ts、src/search.ts、src/fs-access.ts、src/vault-path.ts、src/workspace.ts、src/rename.ts、src/wikilink.ts、src/link-update.ts、src/cli-access.ts、src/frontmatter.ts、src/detect.ts、src/client.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽核固定入口、配置、读写、链接和后端降级。未验证真实 Obsidian CLI、宿主权限和平台差异。
- 下一步：未安装或执行目标插件，未读真实 vault。作者的 0.2.6 宿主试验独立标明。对照和故障注入见 [Q05](#research-q05)。

**分析版本**

- **仓库**：[mingzeng21/dsh-obsidian](https://github.com/mingzeng21/dsh-obsidian)
- **版本号**：0.2.8（[固定提交 6cdb93f](https://github.com/mingzeng21/dsh-obsidian/tree/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证方向是先显示改名影响，再逐文件确认写入，测试能否减少异常时的误重试与手动恢复。[Q05](#research-q05)

未安装或执行目标插件，未读真实 vault。作者的 0.2.6 宿主试验独立标明。对照和故障注入见 [Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 3259 | — | — | 17380 |
| .ts | source | 19 | 1186 | 1069 | 12 | — |
| .tsx | source | 1 | 158 | 149 | 0 | — |
| .ts | test | 14 | 1102 | 963 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mingzeng21/dsh-obsidian/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/mingzeng21/dsh-obsidian/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/mingzeng21/dsh-obsidian/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户通过 dsh-obsidian 整理本地笔记时，哪些 Obsidian 语义由插件补齐，怎样确认笔记范围、部分写入和退出状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 Obsidian vault 的 DSH 用户为什么需要它，调用经过哪些组件？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标是经常在 DSH 会话查找已有笔记、读取 YAML 属性和核对反链的个人用户。原办法是切到 Obsidian 搜索，或用宿主文件工具和脚本读 Markdown。插件通过 Cordis 插入 obsidian 行，宿主依赖 tools 和 agents。它把相对路径、标题、属性、搜索行号与反链等结果接到一组专用工具，默认为本地文件读写，可不依赖 MCP 服务或 OAuth。读取笔记先解析 YAML，反链遍历可见 Markdown 并按 wiki 链接解析器找匹配。搜索尝试 ripgrep，失败时用 JavaScript 扫描，生成结构化结果时再核对行匹配和上下文。它能减少反复切换及编写小解析脚本，对一次普通文本读写的增量有限。合格试用应在副本中验证同名笔记、回车换行和相对路径，再确认宿主返回给模型的内容与人工查找一致。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-16](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/README.md#L1-L16)

作者描述本地 vault 和免独立服务定位。

<details>
<summary>查看原文（16行）</summary>

```text
# dsh-obsidian

把 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）连接到本地 [Obsidian](https://obsidian.md) vault。因为一个 Obsidian vault 本质上就是磁盘上的一堆 Markdown 文件，所以你的 `dsh` agent 可以直接搜索、读取、写入、移动和删除（移入回收站）笔记——**不需要 MCP server，也不需要 OAuth**。

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Node: >=22.12.0](https://img.shields.io/badge/Node-%3E%3D22.12.0-339933.svg)](https://nodejs.org) [![dsh: v0.2.2-rc.1 verified](https://img.shields.io/badge/dsh-v0.2.2--rc.1%20verified-2ea44f.svg)](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-rc.1)

中文 | [English](README.en.md)

## 它能帮你做什么

装上 `dsh-obsidian` 后，你的 `dsh` agent 就能直接读写本地 Obsidian vault。插件会在启动时自动探测你的 vault（或读取你显式配置的路径），然后把 12 个 `obsidian_*` 工具挂载给 agent，覆盖搜索、读取、写入、追加、移动、删除和反链查询等日常操作。

## 特性

- **零依赖服务器** —— 直接读写 vault 文件系统，无需 Local REST API 社区插件，也无需常驻 MCP server。
- **默认安全** —— 删除只把笔记移入 `.trash/`（可逆）、路径无法越出 vault 根目录、绝不触碰 `.obsidian/`。
```

</details>

**依据 2 · 源码核查**：[package.json:30-46](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/package.json#L30-L46)

Web 客户端和 Cordis 接线。

<details>
<summary>查看原文（17行）</summary>

```text
  "dsh": {
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-ui-plugin-manager"]
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-agent": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/schemastery": "*"
  },
  "dependencies": {
    "yaml": "^2.7.0"
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/cordis.patch.yml#L1-L3)

插入真实宿主插件。

```text
- insert:
    - id: obsidian
      name: dsh-obsidian
```

**依据 4 · 源码核查**：[src/index.ts:9-17](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/index.ts#L9-L17)

宿主依赖和默认配置。

```text
export const name = 'dsh-obsidian'
export const inject = ['tools', 'agents']

const schema = z.object({
  vaultPath: z.string().default('').description('Absolute path to the Obsidian vault; leave empty to auto-detect from obsidian.json'),
  useCli: z.boolean().default(false).description('Delegate set/delete property to the obsidian CLI when available'),
  vaultWorkspaceOnly: z.boolean().default(false).description('Expose Obsidian tools only to agents whose session working directory is inside the vault'),
  excludeDirs: z.array(z.string()).default(['.obsidian', '.git', '.trash']).description('Directories excluded from search and list'),
})
```

**依据 5 · 源码核查**：[src/tools.ts:32-59](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/tools.ts#L32-L59)

搜索真实注册与执行委派。

<details>
<summary>查看原文（28行）</summary>

```text
  unregister.push(ctx.tools.register(defineTool({
    name: 'obsidian_search',
    description: 'Full-text search the Obsidian vault. Returns matching lines with surrounding context.',
    parameters: {
      query: { type: 'string', required: true, description: 'Case-insensitive substring to search for.' },
      dir: { type: 'string', description: 'Subdirectory to limit the search to.' },
      context: { type: 'integer', description: 'Lines of context before/after each match (default 1).' },
      limit: { type: 'integer', description: 'Maximum matches to return (default 50).' },
    },
    output: {
      schema: {
        type: 'array',
        items: {
          type: 'object', additionalProperties: false,
          properties: {
            path: { type: 'string', required: true },
            line: { type: 'integer', required: true },
            lineText: { type: 'string', required: true },
            contextBefore: { type: 'array', required: true, items: { type: 'string' } },
            contextAfter: { type: 'array', required: true, items: { type: 'string' } },
          },
        },
      },
      render: (_args: any, value: any) => value.length === 0
        ? [{ type: 'text', text: 'No matches.' }]
        : [{ type: 'text', text: value.map((h: any) => `${h.path}:${h.line}: ${h.lineText}`).join('\n') }],
    },
    execute: (args, execution) => access.search(args.query, { dir: args.dir, context: args.context, limit: args.limit }, execution.signal),
```

</details>

**依据 6 · 源码核查**：[src/search.ts:26-49](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/search.ts#L26-L49)

排序、取上下文及复核文本匹配。

<details>
<summary>查看原文（24行）</summary>

```text
  const context = opts.context ?? 1
  const limit = opts.limit ?? 50
  const base = opts.dir ? guardPath(vaultRoot, opts.dir) : vaultRoot
  const matches = await rawMatches(base, excludeDirs, query, signal)
  signal?.throwIfAborted()
  matches.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1))
  const hits: SearchHit[] = []
  const cache = new Map<string, string[]>()
  for (const { file, line } of matches) {
    if (hits.length >= limit) break
    let lines = cache.get(file)
    if (!lines) {
      lines = (await readFile(file, { encoding: 'utf8', signal })).split(/\r?\n/)
      cache.set(file, lines)
    }
    const idx = line - 1
    if (!includesFolded(lines[idx] ?? '', query)) continue
    hits.push({
      path: normalizeVaultPath(path.relative(vaultRoot, file)),
      line,
      lineText: lines[idx] ?? '',
      contextBefore: lines.slice(Math.max(0, idx - context), idx),
      contextAfter: lines.slice(idx + 1, idx + 1 + context),
    })
```

</details>

**依据 7 · 源码核查**：[src/search.ts:78-93](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/search.ts#L78-L93)

可选 ripgrep 和扫描回退。

<details>
<summary>查看原文（16行）</summary>

```text
async function rawMatches(base: string, excludeDirs: string[], query: string, signal?: AbortSignal): Promise<RawMatch[]> {
  try {
    if (await binaryAvailable('rg', signal)) {
      return await rgMatches(base, excludeDirs, query, signal)
    }
  } catch {
    signal?.throwIfAborted()
    // Fall through to the JS scan if the optional command failed.
  }
  return jsMatches(base, excludeDirs, query, signal)
}

export function rgArgs(query: string, excludeDirs: string[]): string[] {
  const args = ['--json', '-n', '-i', '-F', '--no-heading', '--with-filename', '--no-ignore', '-e', query]
  for (const d of excludeDirs) args.push('-g', `!**/${d}/**`)
  return args
```

</details>

**依据 8 · 源码核查**：[src/fs-access.ts:35-73](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/fs-access.ts#L35-L73)

笔记内容、属性与反链的实现。

<details>
<summary>查看原文（39行）</summary>

```text
  async read(filePath: string): Promise<ReadResult> {
    const abs = guardPath(this.vaultRoot, filePath)
    const content = await readFile(abs, 'utf8')
    const { data } = parseFrontmatter(content)
    return {
      path: normalizeVaultPath(path.relative(this.vaultRoot, abs)),
      title: noteTitleFromPath(filePath),
      frontmatter: data,
      content,
    }
  }

  async frontmatter(filePath: string): Promise<FrontmatterData> {
    const abs = guardPath(this.vaultRoot, filePath)
    const content = await readFile(abs, 'utf8')
    const { data, raw } = parseFrontmatter(content)
    return { path: normalizeVaultPath(path.relative(this.vaultRoot, abs)), data, raw }
  }

  async backlinks(notePath: string, signal?: AbortSignal): Promise<Backlink[]> {
    const targetAbs = guardPath(this.vaultRoot, notePath)
    const files = await walkMarkdownFiles(this.vaultRoot, this.excludeDirs, signal)
    const resolveLink = createLinkResolver(files.map((file) => path.relative(this.vaultRoot, file)))
    const targetPath = normalizeVaultPath(path.relative(this.vaultRoot, targetAbs))
    const target = stripMd(targetPath)
    const out: Backlink[] = []
    for (const file of files) {
      const content = await readFile(file, { encoding: 'utf8', signal })
      const targets = extractLinkTargets(content)
      if (!targets.some((t) => {
        const resolved = resolveLink(t)
        return resolved !== null && sameNotePath(resolved, target)
      })) continue
      out.push({
        path: normalizeVaultPath(path.relative(this.vaultRoot, file)),
        title: noteTitleFromPath(file),
        snippet: this.snippetFor(content, targetPath),
      })
    }
```

</details>

#### 缺口

- 没有同一组笔记的 Obsidian 搜索、宿主原生文件工具和本插件对照。
  **影响**：无法断言速度、反链覆盖率和真实任务收益。
  **进一步探讨**：以人工标注的复制 vault 比较同名笔记、Unicode、CRLF 和不同链接形态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · vault 路径检查、排除目录和 workspace 限制分别能保证什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

路径守卫把反斜杠转为斜杠，拒绝绝对路径、盘符和相对根越界，计算的是词法位置。直接读取和写入使用这一结果，没有先解析实际路径。vault 内指向外部的符号链接可使直接读取得到外部文件，父目录是链接时还可能把写入落到外部。该结论来自 guardPath 和真实 fs 调用，未执行攻击路径。默认排除目录只用于扫描的目录项过滤，不能保护直接点名的 .obsidian 或其他被排除目录。扫描本身在收到一个显式目录时从该位置开始，不能由默认排除名单推出该根不可读。workspaceOnly 默认关闭，开启时只按会话头中的绝对 cwd 词法判断工具是否注册，不能代替逐次访问授权。路径工具参数只声明类型与描述，直接 write 实现也未强制 .md 后缀。因此插件不应承担隔离多用户、含不信任链接或敏感配置的职责。可控试用限低权限账户能访问的无敏感复制目录。

#### 证据与依据

**依据 1 · 源码核查**：[src/vault-path.ts:49-65](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/vault-path.ts#L49-L65)

只检查字符串解析和相对根。

<details>
<summary>查看原文（17行）</summary>

```text
export function normalizeVaultPath(p: string): string {
  return p.replace(/\\/g, '/')
}

export function guardPath(vaultRoot: string, rel: string): string {
  if (typeof rel !== 'string' || rel.trim() === '') throw new Error('path must be a non-empty string')
  const normalized = normalizeVaultPath(rel)
  if (normalized.startsWith('/') || /^[A-Za-z]:/.test(normalized)) {
    throw new Error(`path escapes vault root: ${rel}`)
  }
  const root = path.resolve(vaultRoot)
  const abs = path.resolve(root, normalized)
  const relative = path.relative(root, abs)
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`path escapes vault root: ${rel}`)
  }
  return abs
```

</details>

**依据 2 · 源码核查**：[src/fs-access.ts:35-49](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/fs-access.ts#L35-L49)

直接读取将词法解析路径交给 fs。

<details>
<summary>查看原文（15行）</summary>

```text
  async read(filePath: string): Promise<ReadResult> {
    const abs = guardPath(this.vaultRoot, filePath)
    const content = await readFile(abs, 'utf8')
    const { data } = parseFrontmatter(content)
    return {
      path: normalizeVaultPath(path.relative(this.vaultRoot, abs)),
      title: noteTitleFromPath(filePath),
      frontmatter: data,
      content,
    }
  }

  async frontmatter(filePath: string): Promise<FrontmatterData> {
    const abs = guardPath(this.vaultRoot, filePath)
    const content = await readFile(abs, 'utf8')
```

</details>

**依据 3 · 源码核查**：[src/fs-access.ts:77-88](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/fs-access.ts#L77-L88)

写入及追加同样使用词法目标。

<details>
<summary>查看原文（12行）</summary>

```text
  async write(filePath: string, content: string): Promise<WriteResult> {
    const abs = guardPath(this.vaultRoot, filePath)
    const existed = await this.exists(abs)
    await this.atomicWrite(abs, content)
    return { path: normalizeVaultPath(path.relative(this.vaultRoot, abs)), created: !existed }
  }

  async append(filePath: string, content: string): Promise<AppendResult> {
    const abs = guardPath(this.vaultRoot, filePath)
    const existing = (await this.exists(abs)) ? await readFile(abs, 'utf8') : ''
    const separator = existing && !existing.endsWith('\n') ? '\n' : ''
    await this.atomicWrite(abs, existing + separator + content)
```

</details>

**依据 4 · 源码核查**：[src/fs-access.ts:163-167](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/fs-access.ts#L163-L167)

临时文件在目标的父目录中创建。

```text
  private async atomicWrite(abs: string, content: string): Promise<void> {
    await mkdir(path.dirname(abs), { recursive: true })
    const tmp = path.join(path.dirname(abs), `.${path.basename(abs)}.${process.pid}.${Date.now()}.tmp`)
    await writeFile(tmp, content, 'utf8')
    await rename(tmp, abs)
```

**依据 5 · 源码核查**：[src/search.ts:54-74](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/search.ts#L54-L74)

排除目录只参与遍历的目录项过滤。

<details>
<summary>查看原文（21行）</summary>

```text
export async function walkMarkdownFiles(dir: string, excludeDirs: string[], signal?: AbortSignal): Promise<string[]> {
  const files: string[] = []
  await visit(dir)
  return files

  async function visit(directory: string): Promise<void> {
    signal?.throwIfAborted()
    let entries
    try {
      entries = await readdir(directory, { withFileTypes: true })
    } catch {
      signal?.throwIfAborted()
      return
    }
    signal?.throwIfAborted()
    for (const entry of entries) {
      if (entry.name.startsWith('.') || excludeDirs.includes(entry.name)) continue
      const full = path.join(directory, entry.name)
      if (entry.isDirectory()) await visit(full)
      else if (isMarkdownFile(entry.name)) files.push(full)
    }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:12-16](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/index.ts#L12-L16)

默认 workspaceOnly 关闭，排除目录用途是搜索和列出。

```text
const schema = z.object({
  vaultPath: z.string().default('').description('Absolute path to the Obsidian vault; leave empty to auto-detect from obsidian.json'),
  useCli: z.boolean().default(false).description('Delegate set/delete property to the obsidian CLI when available'),
  vaultWorkspaceOnly: z.boolean().default(false).description('Expose Obsidian tools only to agents whose session working directory is inside the vault'),
  excludeDirs: z.array(z.string()).default(['.obsidian', '.git', '.trash']).description('Directories excluded from search and list'),
```

**依据 7 · 源码核查**：[src/index.ts:33-47](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/index.ts#L33-L47)

工作区判定发生在按 Agent 注册时。

<details>
<summary>查看原文（15行）</summary>

```text
function registerVaultTools(ctx: Context, { vaultRoot, access }: AccessSetup, workspaceOnly?: boolean): () => void {
  if (!workspaceOnly) return registerTools(ctx, access)

  const registrations = new Map<Agent, () => void>()
  const registerForAgent = (agent: Agent) => {
    if (registrations.has(agent) || !isWorkspaceInVault(vaultRoot, agent.session.header.cwd)) return
    registrations.set(agent, registerTools(agent.ctx, access))
  }
  const onCreated = ctx.on('agent/created', ({ agent }) => registerForAgent(agent))
  const onDisposed = ctx.on('agent/disposed', ({ agent }) => { registrations.delete(agent) })
  for (const agent of ctx.agents.list()) registerForAgent(agent)
  return () => {
    onCreated()
    onDisposed()
    for (const unregister of registrations.values()) unregister()
```

</details>

**依据 8 · 源码核查**：[src/workspace.ts:3-6](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/workspace.ts#L3-L6)

cwd 采用 path.resolve 与 relative。

```text
export function isWorkspaceInVault(vaultRoot: string, cwd: string | undefined): boolean {
  if (!cwd || !path.isAbsolute(cwd)) return false
  const relative = path.relative(path.resolve(vaultRoot), path.resolve(cwd))
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
```

**依据 9 · 源码核查**：[src/tools.ts:129-145](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/tools.ts#L129-L145)

写入工具未声明后缀验证器。

<details>
<summary>查看原文（17行）</summary>

```text
    name: 'obsidian_write',
    description: 'Create or overwrite a note at the given path. Parent directories are created as needed.',
    parameters: {
      path: { type: 'string', required: true, description: 'Path relative to the vault root, ending in .md.' },
      content: { type: 'string', required: true, description: 'Full Markdown content to write.' },
    },
    output: {
      schema: {
        type: 'object', additionalProperties: false,
        properties: {
          path: { type: 'string', required: true },
          created: { type: 'boolean', required: true },
        },
      },
      render: (_args: any, value: any) => [{ type: 'text', text: `${value.created ? 'Created' : 'Updated'} ${value.path}` }],
    },
    execute: (args) => access.write(args.path, args.content),
```

</details>

#### 缺口

- 未测试具体平台上符号链接、链接父目录和并发替换。
  **影响**：不能把词法根检查认定为操作系统隔离。
  **进一步探讨**：在无敏感内容且低权限的独立目录验收符号链接、显式排除目录、workspace 与真实读取。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 移动、回收和改属性失败时会留下什么状态？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

普通写入使用同目录临时文件再 rename，可以避免正常单文件替换途中读取半段。追加和改属性仍是先读后整文件写，没有内容版本或锁，因此并发编辑可丢更新。重命名先构建旧路径解析表，再移动目标，之后逐篇重写命中的 wiki 链接。解析器对同名后缀歧义不选目标，重写保留标题锚点和别名，但用正则替换文本而非完整 Obsidian 解析。移动之后任一后续重写失败时未见补偿，可能保留新位置及部分新链接，接口只返回布尔标记而非清单。删除笔记走继承的文件删除方法，等待移动到 vault 下 .trash，冲突时换名，随后返回路径。跨设备移动的降级是复制后 unlink，后者失败可能保留两份。可选 Obsidian CLI 只做属性设置和删除。等待 CLI 命令抛错才转文件操作。CLI 成功后直接返回异步属性读回的 Promise，读回拒绝会传给调用方，磁盘可能已经修改。文件路径也在写入后读回，故工具报错时应先核对磁盘。文件方式修改 YAML 时遇到非对象头会拒绝。发生异常应先查源、目标、反链和回收站，再决定是否重试或从备份恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/fs-access.ts:77-113](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/fs-access.ts#L77-L113)

追加的读改写与移动后逐篇更新。

<details>
<summary>查看原文（37行）</summary>

```text
  async write(filePath: string, content: string): Promise<WriteResult> {
    const abs = guardPath(this.vaultRoot, filePath)
    const existed = await this.exists(abs)
    await this.atomicWrite(abs, content)
    return { path: normalizeVaultPath(path.relative(this.vaultRoot, abs)), created: !existed }
  }

  async append(filePath: string, content: string): Promise<AppendResult> {
    const abs = guardPath(this.vaultRoot, filePath)
    const existing = (await this.exists(abs)) ? await readFile(abs, 'utf8') : ''
    const separator = existing && !existing.endsWith('\n') ? '\n' : ''
    await this.atomicWrite(abs, existing + separator + content)
    return { path: normalizeVaultPath(path.relative(this.vaultRoot, abs)) }
  }

  async move(from: string, to: string): Promise<MoveResult> {
    const normalizedFrom = normalizeVaultPath(from)
    const normalizedTo = normalizeVaultPath(to)
    const fromAbs = guardPath(this.vaultRoot, normalizedFrom)
    const toAbs = guardPath(this.vaultRoot, normalizedTo)
    const canonicalFrom = normalizeVaultPath(path.relative(this.vaultRoot, fromAbs))
    const canonicalTo = normalizeVaultPath(path.relative(this.vaultRoot, toAbs))
    const notePaths = (await walkMarkdownFiles(this.vaultRoot, this.excludeDirs))
      .map((f) => path.relative(this.vaultRoot, f))
    const resolveLink = createLinkResolver(notePaths)
    await mkdir(path.dirname(toAbs), { recursive: true })
    await renameAcrossDevices(fromAbs, toAbs)
    let linksUpdated = false
    for (const file of await walkMarkdownFiles(this.vaultRoot, this.excludeDirs)) {
      const content = await readFile(file, 'utf8')
      const { content: next, changed } = rewriteNoteLinks(content, canonicalFrom, canonicalTo, resolveLink)
      if (changed) {
        await this.atomicWrite(file, next)
        linksUpdated = true
      }
    }
    return { from: canonicalFrom, to: canonicalTo, linksUpdated }
```

</details>

**依据 2 · 源码核查**：[src/fs-access.ts:116-143](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/fs-access.ts#L116-L143)

笔记删除等待移动后返回路径。文件方式的属性改写完成后读回。

<details>
<summary>查看原文（28行）</summary>

```text
  async delete(filePath: string): Promise<DeleteResult> {
    const abs = guardPath(this.vaultRoot, filePath)
    const rel = normalizeVaultPath(path.relative(this.vaultRoot, abs))
    const trashDir = path.join(this.vaultRoot, '.trash')
    await mkdir(trashDir, { recursive: true })
    let target = path.join(trashDir, rel)
    if (await this.exists(target)) {
      const ext = path.extname(rel)
      const stem = ext ? rel.slice(0, -ext.length) : rel
      target = path.join(trashDir, `${stem}.${Date.now()}.${++this.deleteCounter}${ext}`)
    }
    await mkdir(path.dirname(target), { recursive: true })
    await renameAcrossDevices(abs, target)
    return { path: rel, trashedTo: normalizeVaultPath(path.relative(this.vaultRoot, target)) }
  }

  async setProperty(filePath: string, key: string, value: JsonValue): Promise<FrontmatterData> {
    const abs = guardPath(this.vaultRoot, filePath)
    const content = await readFile(abs, 'utf8')
    await this.atomicWrite(abs, setFrontmatterProperty(content, key, value))
    return this.frontmatter(filePath)
  }

  async deleteProperty(filePath: string, key: string): Promise<FrontmatterData> {
    const abs = guardPath(this.vaultRoot, filePath)
    const content = await readFile(abs, 'utf8')
    await this.atomicWrite(abs, deleteFrontmatterProperty(content, key))
    return this.frontmatter(filePath)
```

</details>

**依据 3 · 源码核查**：[src/fs-access.ts:163-167](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/fs-access.ts#L163-L167)

单文件临时写入后 rename。

```text
  private async atomicWrite(abs: string, content: string): Promise<void> {
    await mkdir(path.dirname(abs), { recursive: true })
    const tmp = path.join(path.dirname(abs), `.${path.basename(abs)}.${process.pid}.${Date.now()}.tmp`)
    await writeFile(tmp, content, 'utf8')
    await rename(tmp, abs)
```

**依据 4 · 源码核查**：[src/rename.ts:3-10](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/rename.ts#L3-L10)

跨设备回退先复制再移除来源。

```text
export async function renameAcrossDevices(from: string, to: string): Promise<void> {
  try {
    await rename(from, to)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'EXDEV') throw err
    await copyFile(from, to)
    await unlink(from)
  }
```

**依据 5 · 源码核查**：[src/wikilink.ts:38-52](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/wikilink.ts#L38-L52)

后缀命中歧义时返回空。

<details>
<summary>查看原文（15行）</summary>

```text
export function createLinkResolver(notePaths: string[]): LinkResolver {
  const pathsBySuffix = new Map<string, string | null>()
  for (const notePath of notePaths) {
    const candidate = stripMd(notePath)
    const key = notePathKey(candidate)
    // Full paths and shorter suffixes share the same ambiguity rules.
    for (let start = 0; ; ) {
      const suffix = key.slice(start)
      pathsBySuffix.set(suffix, pathsBySuffix.has(suffix) ? null : candidate)
      const slash = key.indexOf('/', start)
      if (slash === -1) break
      start = slash + 1
    }
  }
  return (target) => pathsBySuffix.get(notePathKey(stripMd(target))) ?? null
```

</details>

**依据 6 · 源码核查**：[src/link-update.ts:11-27](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/link-update.ts#L11-L27)

链接正则、锚点和别名处理。

<details>
<summary>查看原文（17行）</summary>

```text
export function rewriteNoteLinks(content: string, from: string, to: string, resolveLink: LinkResolver): LinkRewriteResult {
  const normalizedFrom = normalizeVaultPath(from)
  const normalizedTo = normalizeVaultPath(to)
  const fromBase = noteTitleFromPath(normalizedFrom)
  const toBase = noteTitleFromPath(normalizedTo)
  const fromPath = stripMd(normalizedFrom)
  const toPath = stripMd(normalizedTo)
  let changed = false
  const out = content.replace(WIKILINK_RE, (match, target: string, heading?: string, alias?: string) => {
    const resolved = resolveLink(target)
    if (!resolved || !sameNotePath(resolved, fromPath)) return match
    const newTarget = sameNotePath(stripMd(target), fromBase) ? toBase : toPath
    const replacement = `[[${newTarget}${heading ?? ''}${alias ?? ''}]]`
    if (replacement !== match) changed = true
    return replacement
  })
  return { content: out, changed }
```

</details>

**依据 7 · 源码核查**：[src/cli-access.ts:11-31](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/cli-access.ts#L11-L31)

仅等待的 CLI 命令异常触发文件回退。直接返回的异步属性读回拒绝向外传播。

<details>
<summary>查看原文（21行）</summary>

```text
export class CliAccess extends FsAccess {
  async setProperty(notePath: string, key: string, value: JsonValue): Promise<FrontmatterData> {
    const normalizedPath = normalizeVaultPath(notePath)
    guardPath(this.vaultRoot, normalizedPath)
    try {
      await run('obsidian', ['property:set', `name=${key}`, `value=${cliValue(value)}`, `path=${normalizedPath}`], { cwd: this.vaultRoot })
      return this.frontmatter(normalizedPath)
    } catch {
      return super.setProperty(normalizedPath, key, value)
    }
  }

  async deleteProperty(notePath: string, key: string): Promise<FrontmatterData> {
    const normalizedPath = normalizeVaultPath(notePath)
    guardPath(this.vaultRoot, normalizedPath)
    try {
      await run('obsidian', ['property:remove', `name=${key}`, `path=${normalizedPath}`], { cwd: this.vaultRoot })
      return this.frontmatter(normalizedPath)
    } catch {
      return super.deleteProperty(normalizedPath, key)
    }
```

</details>

**依据 8 · 源码核查**：[src/frontmatter.ts:29-49](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/frontmatter.ts#L29-L49)

拒绝修改已有非对象 YAML。

<details>
<summary>查看原文（21行）</summary>

```text
export function setFrontmatterProperty(content: string, key: string, value: JsonValue): string {
  const { data, raw, body } = parseFrontmatter(content)
  assertEditableFrontmatter(data, raw)
  const doc = parseDocument(raw ?? '')
  doc.set(key, value)
  return renderDocument(doc, body)
}

export function deleteFrontmatterProperty(content: string, key: string): string {
  const { data, raw, body } = parseFrontmatter(content)
  assertEditableFrontmatter(data, raw)
  if (raw === null) return content
  const doc = parseDocument(raw)
  doc.delete(key)
  return renderDocument(doc, body)
}

function assertEditableFrontmatter(data: JsonValue | null, raw: string | null): void {
  if (data === null && raw !== null) {
    throw new Error('cannot modify a note whose frontmatter is not a YAML object')
  }
```

</details>

**依据 9 · 源码核查**：[src/fs-access.ts:47-52](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/fs-access.ts#L47-L52)

属性读回异步读取并解析 YAML。

```text
  async frontmatter(filePath: string): Promise<FrontmatterData> {
    const abs = guardPath(this.vaultRoot, filePath)
    const content = await readFile(abs, 'utf8')
    const { data, raw } = parseFrontmatter(content)
    return { path: normalizeVaultPath(path.relative(this.vaultRoot, abs)), data, raw }
  }
```

**依据 10 · 源码核查**：[src/tools.ts:188-205](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/tools.ts#L188-L205)

删除笔记工具调用 access.delete。

<details>
<summary>查看原文（18行）</summary>

```text
  unregister.push(ctx.tools.register(defineTool({
    name: 'obsidian_delete',
    description: 'Move a note to the vault trash (.trash/). Reversible; never permanently deletes.',
    parameters: {
      path: { type: 'string', required: true, description: 'Path relative to the vault root.' },
    },
    output: {
      schema: {
        type: 'object', additionalProperties: false,
        properties: {
          path: { type: 'string', required: true },
          trashedTo: { type: 'string', required: true },
        },
      },
      render: (_args: any, value: any) => [{ type: 'text', text: `Trashed ${value.path} to ${value.trashedTo}` }],
    },
    execute: (args) => access.delete(args.path),
  })))
```

</details>

#### 缺口

- 未执行并发改动、失败中断或 Windows 重命名场景，也未注入 CLI 成功后读回拒绝。
  **影响**：不能保证单次执行、同名目标安全或跨文件恢复。
  **进一步探讨**：在只含合成 Markdown 的副本里制造目标冲突、跨盘及中途写失败，回读每一项差异，并模拟 CLI 成功后读文件失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置、启用与退出如何影响笔记，适合在什么条件下试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

宿主需能加载 tools 与 agents，包要求 Node 至少 22.12，作者给出的 DSH 宿主门槛和测试另有环境条件。显式 vaultPath 优先于自动探测结果，不过代码仍会调用探测函数。未配置时按平台寻找 obsidian.json，取第一个打开项或首项。使用临时副本时宜显式选路径并查宿主日志，避免自动发现实际库。Web 端使用宿主的配置表单，草稿绑定 revision 并在冲突时禁止保存，保存成功后宿主监听 volatile-update，先撤旧工具，再异步探测，代数检查避免旧配置晚注册。旧宿主无 volatile 时不能沿用实时刷新判断。停用入口使代数失效并撤销工具注册，没有逆转磁盘写入，也没有在该处分支取消已开始的所有工具操作。作者报告的真实宿主验证针对 0.2.6，不能转给 0.2.8。首次负担是备份与配置，持续负担是全库扫描、并发同步和回读。使用低权限账户、无符号链接的非敏感副本，先验证查询和反链，发现宿主超范围访问或结果不一致即停用并回 Obsidian。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-16](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/package.json#L2-L16)

固定包版本与 Node 要求。

<details>
<summary>查看原文（15行）</summary>

```text
  "name": "dsh-obsidian",
  "version": "0.2.8",
  "description": "Connect DeepSeek Harness (dsh) to a local Obsidian vault: search, read, write, move, and trash notes.",
  "engines": {
    "node": ">=22.12.0"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js"
```

</details>

**依据 2 · 源码核查**：[src/detect.ts:32-40](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/detect.ts#L32-L40)

探测、显式路径优先与可选 CLI。

```text
export async function setupAccess(
  config: AccessConfig,
  deps: SetupDeps = { detectVaultRoot: detectVaultRootFromAppConfig, cliAvailable: obsidianCliAvailable },
): Promise<AccessSetup> {
  const detected = await deps.detectVaultRoot()
  const vaultRoot = resolveVaultRoot(config.vaultPath, detected)
  const useCli = config.useCli && (await deps.cliAvailable())
  const access = useCli ? new CliAccess(vaultRoot, config.excludeDirs) : new FsAccess(vaultRoot, config.excludeDirs)
  return { vaultRoot, access }
```

**依据 3 · 源码核查**：[src/vault-path.ts:24-46](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/vault-path.ts#L24-L46)

自动发现和显式配置选择。

<details>
<summary>查看原文（23行）</summary>

```text
export async function detectVaultRootFromAppConfig(
  read: (p: string, enc: string) => Promise<string> = readFile as any,
): Promise<string | null> {
  for (const file of appConfigCandidates()) {
    try {
      const raw = await read(file, 'utf8')
      const cfg = JSON.parse(raw) as ObsidianAppConfig
      const entries = Object.values(cfg.vaults ?? {})
      const found = entries.find((v) => v.open) ?? entries[0]
      if (found?.path) return found.path
    } catch {
      // try the next candidate
    }
  }
  return null
}

export class VaultNotConfiguredError extends Error {}

export function resolveVaultRoot(configVaultPath: string | undefined, detected: string | null): string {
  if (configVaultPath) return path.resolve(configVaultPath)
  if (detected) return detected
  throw new VaultNotConfiguredError('Obsidian vault not configured: set `vaultPath` in plugin config, or open a vault in Obsidian')
```

</details>

**依据 4 · 源码核查**：[src/client.tsx:68-75](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/client.tsx#L68-L75)

Web 配置组件挂接到宿主 slot。

```text
export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(namespace, { en, zh }))
  ctx.slots.inject(slot, () => ctx.slots.register(
    { name: slot, key: 'dsh-obsidian#obsidian', locale: namespace },
    ({ view, form, t }) => view === 'summary' ? t('summary') : <Settings form={form} t={t} />,
  ))
```

**依据 5 · 源码核查**：[src/client.tsx:90-115](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/client.tsx#L90-L115)

用草稿 revision 保存，拒绝冲突。

<details>
<summary>查看原文（26行）</summary>

```text
  const { revision, value } = state
  const fields: Fields = { ...value, vaultPath: value.vaultPath ?? '', excludeDirs: value.excludeDirs.join('\n'), ...draft?.changes }
  const conflict = draft !== undefined && draft.revision !== revision
  const disabled = !state.writable || status === 'saving'

  function edit<K extends keyof Fields>(field: K, value: Fields[K]): void {
    setDraft(previous => ({ revision: previous?.revision ?? revision, changes: { ...previous?.changes, [field]: value } }))
    setStatus(undefined)
  }

  async function save(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (draft === undefined || conflict || disabled || form === undefined) return
    const ops: Operation[] = Object.entries(draft.changes).map(([key, value]) => ({
      op: 'set', path: [key], value: key === 'excludeDirs' ? fields.excludeDirs.split(/\r?\n/).filter(Boolean) : value,
    }))
    setStatus('saving')
    try {
      if (await form.mutate(ops, draft.revision)) {
        setDraft(undefined)
        setStatus('saved')
      } else {
        setStatus('failed')
      }
    } catch {
      setStatus('failed')
```

</details>

**依据 6 · 源码核查**：[src/index.ts:51-80](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/index.ts#L51-L80)

撤旧工具、代数校验、停止与配置更新。

<details>
<summary>查看原文（30行）</summary>

```text
export async function apply(ctx: Context, source: Cfg | LiveCfg): Promise<void> {
  const live = 'get' in source
  let unregister: (() => void) | undefined
  let generation = 0

  const refresh = async () => {
    const request = ++generation
    unregister?.()
    unregister = undefined
    const config = live ? source.get() : source
    try {
      const setup = await setupAccess({ ...config, excludeDirs: [...config.excludeDirs] })
      if (request !== generation) return
      unregister = registerVaultTools(ctx, setup, config.vaultWorkspaceOnly)
      ctx.logger.info('Using Obsidian vault %s', setup.vaultRoot)
    } catch (error) {
      if (request !== generation) return
      if (!live || !(error instanceof VaultNotConfiguredError)) throw error
      ctx.logger.warn(error.message)
    }
  }

  ctx.effect(() => () => {
    ++generation
    unregister?.()
  })
  if (live) ctx.on('loader/volatile-update', () => {
    void refresh().catch(error => ctx.logger.error(error))
  })
  await refresh()
```

</details>

**依据 7 · 源码核查**：[src/tools.ts:250-274](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/tools.ts#L250-L274)

扫描类工具接收取消信号，注册表支持撤销。

<details>
<summary>查看原文（25行）</summary>

```text
  unregister.push(ctx.tools.register(defineTool({
    name: 'obsidian_tags',
    description: 'List all tags in the vault with usage counts.',
    parameters: {
      dir: { type: 'string', description: 'Subdirectory relative to the vault root.' },
    },
    output: {
      schema: {
        type: 'array',
        items: {
          type: 'object', additionalProperties: false,
          properties: {
            tag: { type: 'string', required: true },
            count: { type: 'integer', required: true },
          },
        },
      },
      render: (_args: any, value: any) => value.length === 0
        ? [{ type: 'text', text: 'No tags found.' }]
        : [{ type: 'text', text: value.map((t: any) => `${t.tag} (${t.count})`).join('\n') }],
    },
    execute: (args, execution) => access.listTags({ dir: args.dir }, execution.signal),
  })))
  return () => { for (const remove of unregister.reverse()) remove() }
}
```

</details>

**依据 8 · 作者声明**：[README.md:105-112](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/README.md#L105-L112)

作者报告 0.2.6 的宿主验证。

```text
## 环境要求

- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）
- 插件需要 Node.js ≥ 22.12.0。通过 npm 或源码启动 [dsh v0.2.2-rc.1](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-rc.1) 时，宿主需要 Node.js ≥ 24.9.0。

已在 macOS 上使用 npm 发布的 [dsh v0.2.2-rc.1](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-rc.1) 验证 `dsh-obsidian@0.2.6`。默认模式下 12 个工具均成功注册，`obsidian_write`、`obsidian_list` 和 `obsidian_read` 在临时 vault 上调用成功。Web profile 也验证了 `vaultWorkspaceOnly`，仅初始工作目录位于 vault 内的会话能看到工具。本项目的类型检查、构建和 112 项测试均通过。

此前在 `dsh` v0.2.1-alpha.3 上验证过 Web profile 加载，也在 v0.2.0-rc.2 上验证过 bundle 加载、12 个工具注册和临时 vault 的列出与读取。更早的验证覆盖 v0.1.7-rc.2、v0.1.5-alpha.1、v0.1.3-alpha.2、v0.1.3-alpha.1、v0.1.2-rc.1、v0.1.2-alpha.5、v0.1.2-alpha.4、v0.1.2-alpha.3、v0.1.2-alpha.2、v0.1.2-alpha.1、v0.1.1-rc.2 与 v0.1.0-rc.8。
```

#### 缺口

- 未验证本固定版本的宿主设置接线、已运行工具停用或实际笔记恢复。
  **影响**：不能据源码断言停用立即撤回在途动作。
  **进一步探讨**：用副本对照无配置、快速切 vault、停用期间在途调用，以及停用后磁盘状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 为重命名增加改动清单和结果确认，能减少半更新后的误判吗？

**研究主题**：新假设与验证

#### 完整回答

可检验方向是先展示命中的旧路径、目标、将修改的笔记和排除理由，实际写入后按文件回读并区分成功、失败和未知。现有实现能自动匹配 wiki 链接并保留锚点，但先移动、再写入若干文件，只有总体布尔量。原型应与原生 Obsidian 改名和当前插件对照，用相同的同名笔记、无法写入的链接页、并发内容变化和跨设备模拟条件，比较错误链接、重复恢复动作、写入前确认时长与最终合格率。若加清单不能降低误恢复，或扫描成本导致大量正常任务无法及时完成，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/fs-access.ts:92-113](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/fs-access.ts#L92-L113)

迁移先于逐条链接写入，返回总体标记。

<details>
<summary>查看原文（22行）</summary>

```text
  async move(from: string, to: string): Promise<MoveResult> {
    const normalizedFrom = normalizeVaultPath(from)
    const normalizedTo = normalizeVaultPath(to)
    const fromAbs = guardPath(this.vaultRoot, normalizedFrom)
    const toAbs = guardPath(this.vaultRoot, normalizedTo)
    const canonicalFrom = normalizeVaultPath(path.relative(this.vaultRoot, fromAbs))
    const canonicalTo = normalizeVaultPath(path.relative(this.vaultRoot, toAbs))
    const notePaths = (await walkMarkdownFiles(this.vaultRoot, this.excludeDirs))
      .map((f) => path.relative(this.vaultRoot, f))
    const resolveLink = createLinkResolver(notePaths)
    await mkdir(path.dirname(toAbs), { recursive: true })
    await renameAcrossDevices(fromAbs, toAbs)
    let linksUpdated = false
    for (const file of await walkMarkdownFiles(this.vaultRoot, this.excludeDirs)) {
      const content = await readFile(file, 'utf8')
      const { content: next, changed } = rewriteNoteLinks(content, canonicalFrom, canonicalTo, resolveLink)
      if (changed) {
        await this.atomicWrite(file, next)
        linksUpdated = true
      }
    }
    return { from: canonicalFrom, to: canonicalTo, linksUpdated }
```

</details>

**依据 2 · 源码核查**：[src/wikilink.ts:38-52](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/wikilink.ts#L38-L52)

后缀歧义可成为预览的排除理由。

<details>
<summary>查看原文（15行）</summary>

```text
export function createLinkResolver(notePaths: string[]): LinkResolver {
  const pathsBySuffix = new Map<string, string | null>()
  for (const notePath of notePaths) {
    const candidate = stripMd(notePath)
    const key = notePathKey(candidate)
    // Full paths and shorter suffixes share the same ambiguity rules.
    for (let start = 0; ; ) {
      const suffix = key.slice(start)
      pathsBySuffix.set(suffix, pathsBySuffix.has(suffix) ? null : candidate)
      const slash = key.indexOf('/', start)
      if (slash === -1) break
      start = slash + 1
    }
  }
  return (target) => pathsBySuffix.get(notePathKey(stripMd(target))) ?? null
```

</details>

**依据 3 · 源码核查**：[src/rename.ts:3-10](https://github.com/mingzeng21/dsh-obsidian/blob/6cdb93fc27f0031a582ad0c79e05a7eea08c2f70/src/rename.ts#L3-L10)

跨设备存在需要独立核查的两次写动作。

```text
export async function renameAcrossDevices(from: string, to: string): Promise<void> {
  try {
    await rename(from, to)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'EXDEV') throw err
    await copyFile(from, to)
    await unlink(from)
  }
```

#### 缺口

- 没有预览原型、对照和用户决策时间。
  **影响**：不能证明更精细记录能减少部分故障或带来净收益。
  **进一步探讨**：做可丢弃 vault 的故障注入与操作者盲测，记录是否正确识别半更新。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
