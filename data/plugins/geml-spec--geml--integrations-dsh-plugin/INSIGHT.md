# GEML for DeepSeek Harness

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[1272823](https://github.com/geml-spec/geml/tree/1272823e78ef2854b6a4b0621ece1f9667b25556/integrations/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/geml-spec/geml) [![npm 30d 987](https://img.shields.io/static/v1?label=npm+30d&message=987&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@geml/dsh-plugin) [![最新发布 2026-09-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@geml/dsh-plugin)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中加入 GEML 文档块 MCP 与文档、调用图技能。

> **亮点**：把已存在的 GEML 工具与两份技能组合进 DSH profile，减少手工配置；按块定位属于 GEML 的既有能力。[Q01](#research-q01)

> **主要限制**：未固定 npm 版本和实际工作目录让源码保护难以直接外推到运行。写入成功后还要检查未预期的文档改动。[Q02](#research-q02)

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
  - [Q01 · DSH 用户从 GEML bundle 得到什么，什么时候直接查文件更简单？](#detail-section-11)
  - [Q02 · 从配置到服务的文件读写边界是什么，默认启动是否固定到这份实现？](#detail-section-12)
  - [Q03 · 如何验证长文档按块操作有收益，哪里应退出？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护长规范的 DSH 用户可以在会话中找出目标文档块并按地址读它。

直接按关键词定位、分段读取与使用 Git 管的普通编辑，也可单独配置同一 MCP。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文档块 MCP | 按地址取块或写入授权段 | 依赖真实 npm 版本与工作目录 |
| 文档和调用图技能 | 按任务选择上下文 | 图缺边需原始源码复查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH MCP client、文件 Skill provider | 必需 | 加载原生扩展 | 无工具或技能 |
| Node/npx 和 npm 包 | MCP 必需 | 启动 GEML | 固定已知版本后再试 |
| 工作目录与 Git 副本 | 受控操作需 | 圈定文档与恢复 | 只读检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对实际解析版本和 cwd | 用非敏感副本 |
| 查找 | 按命中地址读取段落 | 返回可回源 |
| 退出 | 关闭无可靠来源的 MCP | 退普通文件工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | npm 与实际资源未知 | 检查实际版本和权限 | 包未固定 CLI |
| 持续 | 模型上下文和查询资源未测 | 验证地址及正文 | 短文件可能不划算 |
| 恢复 | 重新读取和回退成本未知 | 恢复副本并复查 diff | 工具历史记录可能失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 宿主配置 | 技能与 MCP 双接入 | 宿主与网络可用 |
| 小范围读写 | 同仓实现具备块命令 | 真实节时、token 与正确率 |

> **思考**：未固定 npm 版本和实际工作目录让源码保护难以直接外推到运行。写入成功后还要检查未预期的文档改动。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把已存在的 GEML 工具与两份技能组合进 DSH profile，减少手工配置；按块定位属于 GEML 的既有能力。[Q01](#research-q01)

配置型插件把安装封装与通用实现拆开，测试和权限论证仍要固定跨包依赖。

<a id="detail-section-5"></a>

### 1.4 主要限制

未固定 npm 版本和实际工作目录让源码保护难以直接外推到运行。写入成功后还要检查未预期的文档改动。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察已知 CLI 版本和实际 cwd 后的只读定位，同仓规范作对照。未经用户授权不进入写入，版本无法 pin 或结果不完整则退出 MCP。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

确定有宿主组合配置；同仓 MCP 行为可追查，默认远端解析与实际用途待验证。

- 已检查：作者 README、包清单、源码路径 geml-parser/package.json、geml-parser/src/mcp-core.ts、geml-parser/src/mcp.ts、integrations/dsh-plugin/README.md、integrations/dsh-plugin/cordis.patch.yml、integrations/dsh-plugin/package.json、integrations/dsh-plugin/skills/geml-code-graph/SKILL.md、integrations/dsh-plugin/skills/geml/SKILL.md 及固定范围 inventory；组件：integrations/dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件及同仓同提交 MCP 实现。没有将同仓实现视为默认 npm 本次安装字节。
- 下一步：用相同文件和查询，比较用量、已知准确的引用和未修改文件范围。

**分析版本**

- **仓库**：[geml-spec/geml](https://github.com/geml-spec/geml)
- **版本号**：1.0.4（[固定提交 1272823](https://github.com/geml-spec/geml/tree/1272823e78ef2854b6a4b0621ece1f9667b25556)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用已查章节的块地址，可能比多次全量重读或手工翻查节省长文档诊断时间，需用同一章节任务和直接分段读取对照。[Q03](#research-q03)

用相同文件和查询，比较用量、已知准确的引用和未修改文件范围。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 674 | — | — | 5558 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/geml-spec/geml/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/geml-spec/geml/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/geml-spec/geml/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护长文档的人能否通过 DSH 对一段内容读写并保全其他内容，哪些保证来自随包配置、实际 CLI 或用户约束？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 用户从 GEML bundle 得到什么，什么时候直接查文件更简单？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

经常修改长 Markdown 规范的 DSH 用户，可把阅读缩到一个地址，并让后续工具复用该地址。组件挂接原生 MCP client 运行 stdio 服务，另用文件 Skill 提供器读取包内目录，不遮蔽默认技能根。作者技能建议先用 list/find/get 找到段落，短文件或已知字符串直接处理，普通编辑默认仍用已有工具，只有用户明确需要按块修改再考虑 set。这个工作负载边界决定是否划算。

插件本身新增的是安装即配好同名 MCP 与两个技能。GEML 的分块、验证及调用图来自现有 CLI、MCP 与提示参考。手工配置同一 MCP 或直接用 ripgrep、文件编辑工具也能实现相近功能。调用图技能依赖已有生成的 codemap 或外部生成能力，未解析边须归为未知。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/package.json:21-30](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/integrations/dsh-plugin/package.json#L21-L30)

组件分发补丁和技能。

<details>
<summary>查看原文（10行）</summary>

```text
  "files": [
    "cordis.patch.yml",
    "skills",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:4-27](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/integrations/dsh-plugin/cordis.patch.yml#L4-L27)

MCP 和 Skill 的挂载输入。

<details>
<summary>查看原文（24行）</summary>

```text
- insert:
    # The geml MCP server, one stdio connection per session. `--root .` confines
    # it to the session's own project directory. The model sees the tools as
    # `mcp__geml__geml_get`, `mcp__geml__geml_set`, … — server-qualified names.
    - id: mcp-geml
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: geml
        transport: stdio
        command: npx
        args: ['-y', '@geml/geml', 'mcp', '--root', '.']

    # The skills travel with this package rather than being copied into the
    # user's skill root: `baseUrl` is this patch file's own directory, so the
    # root resolves wherever the bundle is installed. An isolated provider
    # (`includeDefaultRoots: false`, own `providerName`) contributes these two
    # skills without shadowing or duplicating the user's own roots.
    - id: skill-geml
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: geml
        includeDefaultRoots: false
        customSkillDirs:
          - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('skills/', baseUrl))"
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-plugin/skills/geml/SKILL.md:20-54](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/integrations/dsh-plugin/skills/geml/SKILL.md#L20-L54)

适用条件和编辑许可在 Skill 中声明。

<details>
<summary>查看原文（35行）</summary>

```text
## A document that is NOT GEML — use this as a read layer

`geml list`, `geml find` and `geml get` read **Markdown** directly. Use them to
locate and read one block of a long document. Nothing is converted, nothing is
written, and the file stays exactly the Markdown it already was.

**Only when you would otherwise read the whole file to change part of it.** If
the file is short, or you already know the exact string to replace, open it the
ordinary way — the round trip costs more than it saves. What is saved is only
ever the part you did not have to read: on this project's own docs a `list` map
runs 5–11% of the file it maps, but on a changelog of many small sections it is
37%.

1. `geml list <file>` — every block: address, kind, line range.
2. `geml find "<text>" <file>` — which block holds those words, answered as an
   ADDRESS rather than a line number, so it survives the next edit. (On a file
   that is not `.geml` this needs 1.7.5 or newer; older builds report no match
   rather than an error, so if a search you expect to hit comes back empty,
   use `list`.)
3. `geml get <file> '<address>'` — that block and nothing else.
4. Change it. Two ways, and the choice is about **consent**, not capability:
   - **Ordinary file-editing tool**, using the text from step 3 as the string to
     replace. The default: a document nobody asked to address by block is edited
     the way its author edits it.
   - **`geml set <file> '#id' …`**, when block-addressed editing is what was
     asked for — a knowledge base, a generated index, a log that only grows.
     Measured on a real vault: the frontmatter and every block you did not
     address come out **byte-for-byte unchanged**, and the body you write lands
     verbatim — no escaping, no reflowing. Read
     [`references/markdown-writes.md`](references/markdown-writes.md) first; two
     of its rules are silent when broken.

Never convert a document to GEML, never leave a `.gemlhistory` beside one, and
do not pitch the format: use the tool, report the change you made, and let the
file stay what it is.
```

</details>

**依据 4 · 源码核查**：[integrations/dsh-plugin/skills/geml-code-graph/SKILL.md:42-57](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/integrations/dsh-plugin/skills/geml-code-graph/SKILL.md#L42-L57)

调用图对不确定和未解析条目给出回退说明。

<details>
<summary>查看原文（16行）</summary>

````text
geml get .geml/codemap/hashtable.c.geml '#called-by'
```

A reference is `#id` (same document) or `sibling.geml#id` (that document, that
block) — `geml get` it the same way. `index.geml` holds the repo-level view:
app entries in its meta, `#modules` / `#module-edges` aggregate tables.

## Reading the tables

| Line | Meaning |
|---|---|
| `#calls` row, empty confidence | resolved at the document's `resolution-default`, high confidence |
| `#calls` row `kind=candidate` | dispatch ambiguity: one of several implementations, right after its main `call` row. Treat the SET as the answer, never just the first |
| `#calls` row confidence `medium`/`low` | the extractor is less sure — say so when reporting |
| `#unresolved` rows (hidden table) | calls the extractor could NOT resolve — **blind spots, not evidence of absence**; fall back to grep when one matters |
| `#called-by` absent for a method | no *resolved* callers. Under `resolution-default = heuristic` that means little; under `cpg` it is strong (but pointer/dynamic dispatch still lands in `#unresolved`) |
````

</details>

#### 缺口

- 原生 DSH 模块、npm 网络和技能加载未在目标 profile 验证。
  **影响**：真实宿主可能只有技能或只有 MCP 功能。
  **进一步探讨**：用隔离 profile 先查看两类能力是否都出现，再读一个非敏感长文件。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从配置到服务的文件读写边界是什么，默认启动是否固定到这份实现？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

补丁直接运行 npx -y @geml/geml mcp --root .，没有固定 npm 版本。用户从当前 Git 提交核查同仓 1.13.1 的实现，只能据此了解同仓对应代码，不能证明每次启动实际运行该版本或拥有相同保护。根约束还取决于启动进程 cwd。配置正确时应在实际目标工作区验证。

固定源码中的文档服务通过路径解析、真实路径及 document 扩展限制选择文件，再由具体工具修改所选块。跨文档读取以当前文档邻接为基础，真实目标须在 root 下；写入先产生修改结果、做文档校验，实际保存使用 writeFileSync，非文档真实路径拒绝。可写并不代表语义正确，多个调用者并行修改时源码未展示文件版本控制。带 history 的保存点失败时盘上写入仍可发生，工程上要留 Git 或外部副本。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:4-14](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/integrations/dsh-plugin/cordis.patch.yml#L4-L14)

实际 npm 未固定，. 来自执行工作目录。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    # The geml MCP server, one stdio connection per session. `--root .` confines
    # it to the session's own project directory. The model sees the tools as
    # `mcp__geml__geml_get`, `mcp__geml__geml_set`, … — server-qualified names.
    - id: mcp-geml
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: geml
        transport: stdio
        command: npx
        args: ['-y', '@geml/geml', 'mcp', '--root', '.']
```

</details>

**依据 2 · 源码核查**：[geml-parser/package.json:1-24](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/geml-parser/package.json#L1-L24)

同仓可核查版本及 Node 声明。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "@geml/geml",
  "version": "1.13.1",
  "mcpName": "io.github.geml-spec/geml",
  "publishConfig": {
    "access": "public"
  },
  "description": "Read and edit long Markdown by block instead of by file — geml list/find/get address any .md, nothing is converted. Plus GEML, a plain-text format where blocks carry ids for validated writes, reference checks and per-block history. Ships an MCP server.",
  "type": "module",
  "bin": {
    "geml": "dist/cli.js"
  },
  "main": "dist/geml.js",
  "types": "dist/geml.d.ts",
  "files": [
    "dist",
    "codemap",
    "skill",
    "README.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=22"
  },
```

</details>

**依据 3 · 源码核查**：[geml-parser/src/mcp.ts:141-173](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/geml-parser/src/mcp.ts#L141-L173)

回滚点写失败可继续；引用真路径受 root 检查。

<details>
<summary>查看原文（33行）</summary>

```text
// Save the file's CURRENT bytes as a revision, so the about-to-happen write
// has something to revert to. A file already identical to its tip needs no
// second revision.
function snapshot(realPath: string, summary: string): string | undefined {
  const historyPath = realPath.replace(/\.geml$/, "") + ".gemlhistory";
  try {
    if (existsSync(historyPath) && isCurrent(historyPath, realPath)) return undefined;
    return save({ gemlPath: realPath, historyPath, summary }).id;
  } catch {
    // A sidecar that cannot be written must not cost the caller their edit;
    // the write still proceeds, just without a revert point.
    return undefined;
  }
}

// A cross-document reference resolves FROM THE DOCUMENT'S OWN DIRECTORY, which is
// what the CLI resolver and the renderer both do. Resolving from the server root
// instead made the validator inspect a different file than the renderer expands:
// for `sub/a.geml` naming `b.geml`, it validated `<root>/b.geml` while the render
// pulled in `<root>/sub/b.geml` — phantom errors in one direction, and in the other
// a write signed off against a file that was never the target. The root stays the
// confinement boundary.
function docResolver(root: string, fromFile: string): (doc: string) => string | null {
  const base = dirname(fromFile);
  return (doc: string) => {
    try {
      const target = realpathSync(resolve(base, doc));
      if (target !== root && !target.startsWith(root + sep)) return null;
      return readFileSync(target, "utf8");
    } catch {
      return null;
    }
  };
```

</details>

**依据 4 · 源码核查**：[geml-parser/src/mcp.ts:214-241](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/geml-parser/src/mcp.ts#L214-L241)

读取及实际扩展名检查和同步保存。

<details>
<summary>查看原文（28行）</summary>

```text
const fsHost: McpHost = {
  docArg: "path",
  docNote: "",
  unchangedHint: UNCHANGED,
  open(args): OpenedDoc {
    const real = resolveInRoot(args.file);
    const root = rootReal();
    const notes: string[] = [];
    return {
      text: readFileSync(real, "utf8"),
      file: args.file,
      label: real,
      ctx: ctxFor(root, notes),
      notes,
      validate: { ...markdownOpts(real, root), resolveDoc: docResolver(root, real), sourcePath: targetFor(real, root), ...readerOpts() },
      root,
    };
  },
  write(doc, text, summary) {
    // A write lands only in a document. A client is a model whose arguments a
    // page it read can steer, and `.git/config` takes an appended
    // `[core] fsmonitor = "<command>"` as valid GEML; git runs that command on
    // the next `git status`. Judged on the real path, so a `notes.geml` linked
    // to it is refused too, and before the sidecar is touched.
    if (!isDocumentPath(doc.label)) throw new Error(`this server writes only GEML and Markdown documents: ${doc.file}`);
    const revision = summary && OPTS.history ? snapshot(doc.label, summary) : undefined;
    writeFileSync(doc.label, text, "utf8");
    return { revision };
```

</details>

**依据 5 · 源码核查**：[geml-parser/src/mcp-core.ts:500-534](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/geml-parser/src/mcp-core.ts#L500-L534)

set 从读到定位、生成、验证，并限制附带的外部来源写。

<details>
<summary>查看原文（35行）</summary>

```text
      name: "geml_set",
      description:
        "Replace ONE block and leave every other byte untouched — prefer this to rewriting a file. For content that does not exist yet use geml_add; to remove a block, geml_delete. The replacement is validated before it is written: if it would break the document, nothing is written and the diagnostics come back — fix the body rather than resending it. Removing content is not refused: if the replacement drops blocks, the write goes through and the result names each one, so check it after shortening a section; geml_revert puts one back. `part` replaces the whole block (default), its head line, a section's `intro`, or its body. In a Markdown file a heading's anchor is its text, as on GitHub: new heading text gives the heading a new address, and the document's links to the old one follow in the same write. GEML content written over a Markdown heading or prose is converted to Markdown, as in geml_add; a GEML block already in the file stays GEML. An `id` that matches no block, or several, is refused." + WRITE_RESULT + note,
      inputSchema: schema({
        id: {
          type: "string",
          description: "Which block to replace: an id (with or without `#`), a `@<hex>` content address from `geml_list` for a block with no id, or `L27`/`L27-58` for the smallest block holding those lines. Must match exactly one block",
        },
        body: { type: "string", description: "The replacement text" },
        part: { type: "string", enum: [...PARTS], description: "What to replace (default: whole). `intro` replaces a section's opening — everything under the heading up to its first subheading — and leaves every subsection byte-identical, which is what makes a read-edit-write cycle on a long section safe. An empty intro (a subheading follows the heading immediately) is written into, so this also adds an opening where there was none." },
      }, ["id", "body"]),
      annotations: writes("Replace one block", { destructive: true, idempotent: true }),
      run: (args) => {
        const doc = host.open(args);
        const part = partArg(args.part);
        const flag = partFlagOf(part);
        let external: SetResult["external"];
        const result = applyWrite(host, {
          doc,
          produce: () => {
            const r = set(doc.text, doc.label, selectorArg(args.id), { part, named: flag ? [flag] : [], content: raw(args.body) }, doc.ctx);
            external = r.external;
            return r.text;
          },
          summary: `mcp: before write to ${selectorArg(args.id)}`,
        });
        if (external === undefined || !result.ok) return result;
        // §8.2(10): the edit landed in the block's `src=` file, not the document.
        // A model's arguments can be steered by a page it read, so only a file a
        // reader this server was STARTED with claims is written — never a built-in
        // json/yaml file, which could as well be a package.json.
        if (host.writeSource === undefined || host.readerClaims?.(external.path) !== true) {
          return refuse(doc.file, [], `this value lives in the block's \`src=\` file, and this server writes such a file only through a reader it was started with (--reader). ${host.unchangedHint}`, "bad-address");
        }
        host.writeSource(external.path, external.text);
```

</details>

#### 缺口

- 默认 npx 实际拉到的版本、宿主 cwd 以及同名重现性未核。
  **影响**：不能给当前资料的安全保证绑定实际运行包。
  **进一步探讨**：在许可的隔离环境以确切的已核包版本确认实际进程根，再测超界、重复 ID 与别名链接。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何验证长文档按块操作有收益，哪里应退出？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

先观察并固定 CLI 版本，以非敏感规范做读任务，不把首次使用直接扩展到写整套文档。对照原方案 ripgrep、有限读片段和手工编辑，用相同问题分别验证章节、引用和修改前后 diff。计算合格答案数与输入字节、耗时和人工复验；目录映射、查找和文件验证都会有开销，短文档或已知精确位置时可能重复做工。第一次写入应使用可恢复副本，并检查其他段、引用和输入范围。若 npx 版本、目录或写入结果无法吻合，则停用 MCP 路由回文件工具。

可验证的假设是用块地址复用读结果能让反复回查长文档少复制上下文。若基线已经能通过分段读取得到同样证据，或标注地址在编辑后重选增加成本，则不支持。源码没有同任务的 token 节省数据。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/skills/geml/SKILL.md:20-49](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/integrations/dsh-plugin/skills/geml/SKILL.md#L20-L49)

已有长短文件和普通编辑取舍，可构造基线。

<details>
<summary>查看原文（30行）</summary>

```text
## A document that is NOT GEML — use this as a read layer

`geml list`, `geml find` and `geml get` read **Markdown** directly. Use them to
locate and read one block of a long document. Nothing is converted, nothing is
written, and the file stays exactly the Markdown it already was.

**Only when you would otherwise read the whole file to change part of it.** If
the file is short, or you already know the exact string to replace, open it the
ordinary way — the round trip costs more than it saves. What is saved is only
ever the part you did not have to read: on this project's own docs a `list` map
runs 5–11% of the file it maps, but on a changelog of many small sections it is
37%.

1. `geml list <file>` — every block: address, kind, line range.
2. `geml find "<text>" <file>` — which block holds those words, answered as an
   ADDRESS rather than a line number, so it survives the next edit. (On a file
   that is not `.geml` this needs 1.7.5 or newer; older builds report no match
   rather than an error, so if a search you expect to hit comes back empty,
   use `list`.)
3. `geml get <file> '<address>'` — that block and nothing else.
4. Change it. Two ways, and the choice is about **consent**, not capability:
   - **Ordinary file-editing tool**, using the text from step 3 as the string to
     replace. The default: a document nobody asked to address by block is edited
     the way its author edits it.
   - **`geml set <file> '#id' …`**, when block-addressed editing is what was
     asked for — a knowledge base, a generated index, a log that only grows.
     Measured on a real vault: the frontmatter and every block you did not
     address come out **byte-for-byte unchanged**, and the body you write lands
     verbatim — no escaping, no reflowing. Read
     [`references/markdown-writes.md`](references/markdown-writes.md) first; two
```

</details>

**依据 2 · 源码核查**：[geml-parser/src/mcp.ts:232-241](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/geml-parser/src/mcp.ts#L232-L241)

实际落盘机制确定写试验须备份。

<details>
<summary>查看原文（10行）</summary>

```text
  write(doc, text, summary) {
    // A write lands only in a document. A client is a model whose arguments a
    // page it read can steer, and `.git/config` takes an appended
    // `[core] fsmonitor = "<command>"` as valid GEML; git runs that command on
    // the next `git status`. Judged on the real path, so a `notes.geml` linked
    // to it is refused too, and before the sidecar is touched.
    if (!isDocumentPath(doc.label)) throw new Error(`this server writes only GEML and Markdown documents: ${doc.file}`);
    const revision = summary && OPTS.history ? snapshot(doc.label, summary) : undefined;
    writeFileSync(doc.label, text, "utf8");
    return { revision };
```

</details>

**依据 3 · 作者声明**：[integrations/dsh-plugin/README.md:33-47](https://github.com/geml-spec/geml/blob/1272823e78ef2854b6a4b0621ece1f9667b25556/integrations/dsh-plugin/README.md#L33-L47)

作者列出移除与装载命令。

<details>
<summary>查看原文（15行）</summary>

````text
## Install

```sh
dsh plugin --profile web add @geml/dsh-plugin
```

Verify the layer without booting, then boot:

```sh
dsh --profile web --dump-config   # shows a "# == @geml/dsh-plugin" layer
dsh --profile web
```

`dsh plugin --profile web remove @geml/dsh-plugin` removes both the
dependency and the layer.
````

</details>

#### 缺口

- 真实文档定位用时、token 与误编辑率未知。
  **影响**：无法将作者所称节省直接归入采用收益。
  **进一步探讨**：同任务用长文、短文与改过标题文件做交叉验证。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
