# dsh-office-tools

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[5ec874b](https://github.com/kw78/dsh-office-tools/tree/5ec874b0b164c5eac878554ff078d23eae27299f)

<!-- BEGIN META -->
[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kw78/dsh-office-tools) [![npm 30d 12,871](https://img.shields.io/static/v1?label=npm+30d&message=12%2C871&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-office-tools) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-office-tools)
<!-- END META -->

> **功能**：为 DSH 会话工作区提供 Word、Excel 与 PowerPoint 文件创建、读取和部分更新工具。

> **亮点**：用 ASCII STORE 包适配宿主文本写通道，给模型提供三种文件的结构化生成和提取。见 [Q02](#research-q02)。

> **主要限制**：Excel 更新会重建工作簿，受改单元格所在表中的缓存公式可能退化为值。PPT 图像使用外链，Word 追加会拒绝其余部件中含非 ASCII 字节的文件。见 [Q03](#research-q03)。

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
  - [Q01 · 实际加载什么，文件写入如何限制在当前工作区？](#detail-section-11)
  - [Q02 · 文本通道如何写 Office 文件，读包防护覆盖什么？](#detail-section-12)
  - [Q03 · 哪些 Office 操作会改变保真、便携或公式语义？](#detail-section-13)
  - [Q04 · 哪些办公交付可控试用，怎样验收与退出？](#detail-section-14)
  - [Q05 · 何时会减少办公交付的总成本？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要从同一季度数据写简报、预算和汇报稿的 DSH 用户，可让代理直接生成低复杂度 Office 初稿。见 [Q01](#research-q01)。

手工 Office 模板可生成同样三类工件，并直接检视排版与公式。插件把常用生成和回读留在 DSH 会话中，接收端保真仍需核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Word | 创建、读取和追加 | 追加重封包，其他部件须 ASCII 安全 |
| Excel | 创建、读取、换表和 A1 写入 | 更新重建，需复核公式和样式 |
| PPT | 创建及读取版式几何 | 无更新，图片为外链 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 tools、fs | 必需 | 注入并注册工具 | 核对版本和 profile |
| 活跃会话与可写工作区 | 必需 | 解析和写入 Office 文件 | 宿主或插件拒绝 |
| sandboxPolicy | 沙箱写入需要 | 解析当前会话写策略 | 沙箱后端下缺服务会报错 |
| Office 收件应用 | 交付验收需要 | 看布局、公式和外链 | 工具回读仅覆盖提取 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 操作者在隔离 profile 核对工具与版本 | 重启并确认无工具名冲突 |
| 2 | 代理以合成数据和新路径创建并回读 | 对照数字、章节和页数 |
| 3 | 操作者在收件应用打开工件 | 查看公式、版式和随附资源 |
| 4 | 操作者必要时恢复原 profile | 保留原件并逐个核对已写结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | DSH 与收件应用的环境成本未知 | 安装、重启、检查配置 | 未量化 |
| 持续 | 模型交互和包处理资源 | 排版、公式及外链复核 | 尚无单位工件用量 |
| 失败恢复 | 副本重做与验证资源 | 核对目标文件和宿主结果 | 并发与取消恢复待测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文件生成 | 三类 Office 工件由会话工具写出 | 外部应用打开和跨机保真 |
| 结构回读 | 提取内容、表格和版式几何 | 完整样式与公式正确性 |
| 批量办公 | 一个会话内生成三件套有源码用例 | 时间节省与真实交付质量 |

> **思考**：Excel 更新会重建工作簿，受改单元格所在表中的缓存公式可能退化为值。PPT 图像使用外链，Word 追加会拒绝其余部件中含非 ASCII 字节的文件。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用 ASCII STORE 包适配宿主文本写通道，给模型提供三种文件的结构化生成和提取。见 [Q02](#research-q02)。

文件调用集中于宿主 fs，ZIP 目录和解压有预算。覆盖检查与写入分离，Excel 重建及 PPT 外链需按收件环境验收。见 [Q01](#research-q01) 至 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Excel 更新会重建工作簿，受改单元格所在表中的缓存公式可能退化为值。PPT 图像使用外链，Word 追加会拒绝其余部件中含非 ASCII 字节的文件。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在隔离 profile 试用新建简报、预算表和轻量 PPT，用收件环境打开核对并保留源文件。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持根插件接线、文本写入机制、部分重建和外链边界。兼容性、并发和收件质量待验。

- 已检查：作者 README、包清单、源码路径 README.md、build.mjs、cordis.patch.yml、package.json、src/asciizip.ts、src/fschannel.ts、src/index.ts、src/tools/excel.ts、src/tools/ppt.ts、src/tools/shared.ts、src/tools/word-update.ts、tests/demo-trio.spec.ts、tests/sandbox-write.spec.ts、tests/zip-guard.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定根插件、文件访问、OOXML 读写、三组工具和部分用例。未执行目标代码、测试、宿主或外部 Office。
- 下一步：固定工件和宿主，跑工作区拒绝、中文写读、公式与富格式副本、异机外链、同名并发和写入取消；用收件应用复核。

**分析版本**

- **仓库**：[kw78/dsh-office-tools](https://github.com/kw78/dsh-office-tools)
- **版本号**：1.0.8（[固定提交 5ec874b](https://github.com/kw78/dsh-office-tools/tree/5ec874b0b164c5eac878554ff078d23eae27299f)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

同源季度数据同时生成低复杂度三件套，可能减少录入和核对。以每组合格文件和收件端返工做对照。见 [Q05](#research-q05)。

固定工件和宿主，跑工作区拒绝、中文写读、公式与富格式副本、异机外链、同名并发和写入取消；用收件应用复核。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 105 | 83 | 11 | — |
| .md | source | 8 | 1077 | — | — | 19251 |
| .js | source | 1 | 2403 | 2370 | 52 | — |
| .ts | source | 10 | 3572 | 2882 | 452 | — |
| .ts | test | 13 | 2141 | 1783 | 170 | — |
| .mjs | test | 2 | 330 | 261 | 47 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-10），可前往 [GitHub Issues](https://github.com/kw78/dsh-office-tools/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：需要在 DSH 内交付简报、账表和演示稿的团队，哪些任务可用工作区内 OOXML 工具完成，哪些结果必须在收件环境验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 实际加载什么，文件写入如何限制在当前工作区？

**研究主题**：场景与需求、依赖、兼容与流程、功能与机制

#### 完整回答

已有 DSH、希望由代理在会话中产出 Office 初稿的团队可用该根插件。manifest 指向 lib/index.js 与 Cordis patch，patch 挂入 dsh-office-tools。主机注入 tools 和 fs，按 fiber 生命周期注册和卸载 Word、Excel 各创建、读取和更新，以及 PPT 创建和读取，共八个。enablePptTools 默认开，关闭后只保留 Word 和 Excel，可避开其他提供者的 PPT 名称冲突。文件路径需要活跃 Session 的 cwd，沙箱写策略提供 workspaceRoot 时写目标改用该根。代码先检查词法路径和扩展名，再交 fs.resolve 与 fs.contains，读取现有目标还检查普通文件。沙箱后端启用时向 sandboxPolicy 请求本次会话策略，服务缺失会报错，旧服务缺 resolve 时允许无显式策略而依赖后端。创建默认先 stat 拒绝既存文件，但检查和最终 writeText 分开，未看到原子不覆盖条件。取消也可能发生在 writeText 成功后、结果返回前。真实权限、并发创建和重试结果需以宿主后端验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-32](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/package.json#L2-L32)

包、构建入口、补丁和作者声明版本。

<details>
<summary>查看原文（31行）</summary>

```text
  "name": "dsh-office-tools",
  "version": "1.0.8",
  "description": "DSH model-facing Office tools: create, read, and update Word (.docx), Excel (.xlsx), and PowerPoint (.pptx) files inside the session workspace, entirely through the official DSH filesystem service.",
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dsh": "^0.1.0-rc.6 || ^0.1.1-rc.0 || ^0.1.2-alpha.0 || ^0.1.5-alpha.0 || ^0.2.0-rc.1 || ^0.2.1-rc.3",
      "dshReleases": {
        "0.1.1-rc.2": "compatible",
        "0.1.2-alpha.4": "compatible",
        "0.1.2-alpha.5": "compatible",
        "0.1.2-rc.1": "compatible",
        "0.1.5-rc.1": "compatible",
        "0.1.5-rc.2": "compatible",
        "0.2.0-rc.1": "compatible",
        "0.2.1-rc.3": "compatible"
      }
    }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/cordis.patch.yml#L1-L6)

根插件宿主挂载。

```text
# dsh-office-tools bundle patch: mount the host plugin under its package name,
# resolved through the profile's node_modules.

- insert:
    - id: dsh-office-tools
      name: dsh-office-tools
```

**依据 3 · 源码核查**：[src/index.ts:4-19](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/index.ts#L4-L19)

工具清单及名称冲突说明。

<details>
<summary>查看原文（16行）</summary>

```text
 * Registers eight model-facing tools on `ctx.tools`:
 *
 *   word_create / word_read / word_update
 *   excel_create / excel_read / excel_update
 *   ppt_create / ppt_read
 *
 * All file access is confined to the calling agent's session workspace and
 * flows exclusively through the official `ctx.fs` service — reads as raw
 * bytes, writes as UTF-8 text (generated packages are pure ASCII by
 * construction). Every registration is wrapped in `ctx.effect` so Cordis
 * disposes the tools with the plugin fiber.
 *
 * The PowerPoint pair is config-gated: dedicated presentation plugins such
 * as dsh-ppt register a colliding `ppt_create`, and DSH refuses duplicate tool
 * names at startup, so profiles running one of those set `enablePptTools: false`
 * to load this plugin for Word/Excel only.
```

</details>

**依据 4 · 源码核查**：[src/index.ts:28-55](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/index.ts#L28-L55)

运行依赖、开关和 fiber 注册。

<details>
<summary>查看原文（28行）</summary>

```text
/** Plugin identity for cordis.yml rows. */
export const name = 'dsh-office-tools'

/** The tool registry and the official filesystem service are the only runtime services required. */
export const inject = ['tools', 'fs']

/** Host plugin configuration, validated at load by the Loader. */
export interface Config {
  /** Register `ppt_create` / `ppt_read`. */
  enablePptTools: boolean
}

/** Configuration schema; the callable form applies schema defaults. */
export const Config = z.object({
  enablePptTools: z.boolean().default(true)
    .description('register ppt_create / ppt_read (set to false to coexist with a dedicated PPT plugin such as dsh-ppt)'),
})

export function apply(ctx: Context, config?: Config): void {
  const resolved = Config(config ?? {})
  ctx.effect(() => {
    const disposers = [
      registerWordTools(ctx),
      registerExcelTools(ctx),
      ...(resolved.enablePptTools ? [registerPptTools(ctx)] : []),
    ]
    return () => disposers.forEach(dispose => dispose())
  })
```

</details>

**依据 5 · 源码核查**：[src/fschannel.ts:63-77](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/fschannel.ts#L63-L77)

沙箱策略及旧服务分支。

<details>
<summary>查看原文（15行）</summary>

```text
 * Resolve the per-call write policy the way the official fs tool layer does:
 * skip when the mounted backend does not confine (`fs.sandboxMode` undefined),
 * otherwise ask the shared `sandboxPolicy` service for the calling session.
 */
export async function resolveWritePolicy(ctx: Context & FsContext, exec: ToolRunContext): Promise<OfficeWritePolicy | undefined> {
  if (ctx.fs.sandboxMode === undefined) return undefined
  const service = typeof ctx.get === 'function'
    ? ctx.get('sandboxPolicy') as SandboxPolicyService | undefined
    : undefined
  if (service === undefined || service === null) {
    throw new Error('office tools: the mounted filesystem confines but ctx.sandboxPolicy is missing')
  }
  if (typeof service.resolve !== 'function') return undefined
  return service.resolve(exec.agent === undefined ? {} : { session: exec.agent.session })
}
```

</details>

**依据 6 · 源码核查**：[src/fschannel.ts:129-164](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/fschannel.ts#L129-L164)

工作区根、扩展名和双重路径检查。

<details>
<summary>查看原文（36行）</summary>

```text
export async function resolveOfficePath(
  exec: ToolRunContext,
  ctx: FsContext,
  rawPath: string,
  allowedExts: readonly string[],
  mustExist: boolean,
  writePolicy?: OfficeWritePolicy,
): Promise<ResolvedOfficePath> {
  exec.signal.throwIfAborted()
  if (rawPath.trim() === '') throw new Error('path must be a non-empty string')

  const root = workspaceRootOf(exec)
  const effectiveRoot = writePolicy?.workspaceRoot ? resolve(writePolicy.workspaceRoot) : root
  const candidate = resolve(isAbsolute(rawPath) ? rawPath : join(effectiveRoot, rawPath))
  assertLexicallyWithin(effectiveRoot, candidate)

  const ext = extname(candidate).toLowerCase()
  if (!allowedExts.includes(ext)) {
    throw new Error(`expected ${allowedExts.join(' or ')} file, got extension "${ext || '(none)'}"`)
  }

  const fs = ctx.fs
  const rootTarget = await fs.resolve('.', { cwd: effectiveRoot, signal: exec.signal })
  const target = await fs.resolve(rawPath, { cwd: effectiveRoot, signal: exec.signal })
  if (!fs.contains(rootTarget, target)) {
    throw new Error(`path "${rawPath}" escapes the session workspace "${root}"`)
  }
  const absolute = fs.processPath(target)

  if (mustExist) {
    const info = await fs.stat(target, exec.signal)
    if (info === undefined) throw new Error(`"${absolute}" does not exist`)
    if (info.type !== 'file') throw new Error(`"${absolute}" is not a regular file`)
  }

  return { input: rawPath, target, absolute, display: displayPathOf(root, absolute), ext }
```

</details>

**依据 7 · 源码核查**：[src/fschannel.ts:197-220](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/fschannel.ts#L197-L220)

写入、返回前取消和独立创建检查。

<details>
<summary>查看原文（24行）</summary>

```text
export async function saveOfficeText(
  exec: ToolRunContext,
  ctx: FsContext,
  target: FsTarget,
  text: string,
  writePolicy?: OfficeWritePolicy,
): Promise<number> {
  exec.signal.throwIfAborted()
  await ctx.fs.writeText(target, text, undefined, exec.signal, writePolicy)
  exec.signal.throwIfAborted()
  return Buffer.byteLength(text, 'utf-8')
}

/**
 * Reject an overwrite when `overwrite` is false and the target already
 * exists. Callers use this BEFORE doing expensive generation so the model
 * gets a fast refusal instead of wasted work.
 */
export async function assertMayCreate(exec: ToolRunContext, ctx: FsContext, target: FsTarget, overwrite: boolean): Promise<void> {
  if (overwrite) return
  const info = await ctx.fs.stat(target, exec.signal)
  if (info !== undefined) {
    throw new Error('the target already exists; pass overwrite: true to replace it')
  }
```

</details>

**依据 8 · 源码核查**：[tests/sandbox-write.spec.ts:193-231](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/tests/sandbox-write.spec.ts#L193-L231)

测试源码覆盖策略根不同和越界拒绝。

<details>
<summary>查看原文（39行）</summary>

```text
  test('writes anchor to the policy workspace root when it differs from the session cwd', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-office-sbx-out-'))
    const elsewhere = await mkdtemp(join(tmpdir(), 'dsh-office-sbx-out-elsewhere-'))
    try {
      const fs = new SandboxedFileSystem(testFileSystem(), {
        mode: 'workspace-write',
        workspaceRoot: elsewhere,
      })
      const tools = mountTools(undefined, { fs: fs as unknown as FileSystem, sandboxPolicy: fixedPolicyService({ mode: 'workspace-write', workspaceRoot: elsewhere }) })
      const created = await run(tools, 'excel_create', { path: 'budget.xlsx', sheets: [{ name: 'S1', rows: [['a']] }] }, root) as any
      expect(created.sizeBytes).toBeGreaterThan(0)
      // Relative paths resolve against the effective (policy) workspace, the
      // way the official fs tools resolve them — not the session cwd.
      expect((await stat(join(elsewhere, 'budget.xlsx'))).isFile()).toBe(true)
      await expect(stat(join(root, 'budget.xlsx'))).rejects.toThrow()
    } finally {
      await rm(root, { recursive: true, force: true })
      await rm(elsewhere, { recursive: true, force: true })
    }
  })

  test('an absolute path outside the policy workspace root is refused before the write', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-office-sbx-abs-'))
    const elsewhere = await mkdtemp(join(tmpdir(), 'dsh-office-sbx-abs-elsewhere-'))
    try {
      const fs = new SandboxedFileSystem(testFileSystem(), {
        mode: 'workspace-write',
        workspaceRoot: elsewhere,
      })
      const tools = mountTools(undefined, { fs: fs as unknown as FileSystem, sandboxPolicy: fixedPolicyService({ mode: 'workspace-write', workspaceRoot: elsewhere }) })
      await expect(run(tools, 'word_create', { path: join(root, 'report.docx'), paragraphs: ['x'] }, root))
        .rejects.toThrow(/escapes the session workspace/)
      expect(fs.policiesSeen).toEqual([])
    } finally {
      await rm(root, { recursive: true, force: true })
      await rm(elsewhere, { recursive: true, force: true })
    }
  })

```

</details>

#### 缺口

- 未运行并发同路径、符号链接或写入后取消。
  **影响**：无法从独立 stat 和写入确认排他创建，取消也不能证明文件未落盘。
  **进一步探讨**：在目标后端以合成文件检查两次并发、越界与写后取消，然后读取路径和哈希。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文本通道如何写 Office 文件，读包防护覆盖什么？

**研究主题**：贡献与相对优势、功能与机制、工程质量与复用

#### 完整回答

相对依赖可执行脚本或完整 Office 应用来写二进制，插件自行生成 OOXML，把非 ASCII 文本转换为 XML 字符引用，将 ZIP 的长度、偏移和 CRC 字段安排为 ASCII 安全字节。CRC 通过变换 XML 末尾空白求出可用值。STORE 包整个作为 ASCII 字符串通过宿主 writeText，UTF-8 编码保持字节。读取走 readBytes，支持 STORE 和 DEFLATE，磁盘文件预算 50 MiB，ZIP 默认按目录限制 100000 条、单条解压 256 MiB 和总解压 512 MiB，并限制实际 inflate 输出。被解析的 XML 部件拒绝 DOCTYPE 和 ENTITY。生成包也有 50 MiB 上限。静态检查支持已有防线，仍需实际观察压缩输入的内存峰值、并发阻塞和不同收件应用是否可以正常打开。此路径复用了 DSH 文件服务，能否继承部署的访问控制由真实宿主提供。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/shared.ts:54-78](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/shared.ts#L54-L78)

非 ASCII 与 XML 转义。

<details>
<summary>查看原文（25行）</summary>

```text
export function encodeXmlText(value: string): string {
  let out = ''
  for (const char of value) {
    const code = char.codePointAt(0)!
    if (char === '&') out += '&amp;'
    else if (char === '<') out += '&lt;'
    else if (char === '>') out += '&gt;'
    else out += encodeXmlChar(code)
  }
  return out
}

/** Escape text for a double-quoted XML attribute value, keeping it pure ASCII. */
export function encodeXmlAttribute(value: string): string {
  let out = ''
  for (const char of value) {
    const code = char.codePointAt(0)!
    if (char === '&') out += '&amp;'
    else if (char === '<') out += '&lt;'
    else if (char === '>') out += '&gt;'
    else if (char === '"') out += '&quot;'
    else out += encodeXmlChar(code)
  }
  return out
}
```

</details>

**依据 2 · 源码核查**：[src/asciizip.ts:22-35](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/asciizip.ts#L22-L35)

输入文件与解压预算。

<details>
<summary>查看原文（14行）</summary>

```text
import { inflateRawSync } from 'node:zlib'

/** Hard cap for reading an existing Office file into memory. */
export const MAX_OFFICE_FILE_BYTES = 50 * 1024 * 1024

/** Declared uncompressed ceiling for one zip entry inside an Office file. */
export const MAX_ZIP_ENTRY_BYTES = 256 * 1024 * 1024

/** Declared uncompressed ceiling summed over all entries of one archive. */
export const MAX_ZIP_TOTAL_BYTES = 512 * 1024 * 1024

/** Maximum entries (files + directories) in one archive. */
export const MAX_ZIP_ENTRIES = 100_000

```

</details>

**依据 3 · 源码核查**：[src/asciizip.ts:158-174](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/asciizip.ts#L158-L174)

CRC 空白后缀枚举。

<details>
<summary>查看原文（17行）</summary>

```text
 * Eight trailing XML whitespace bytes vary the CRC without changing length.
 * The space/tab toggles span all four CRC high-bit constraints, so at least
 * one of these 256 suffixes is byte-safe for every incoming CRC state.
 */
function safeCrcSuffix(state: number): { suffix: string; crc: number } {
  for (let variant = 0; variant < 256; variant += 1) {
    let folded = state
    let suffix = ''
    for (let bit = 0; bit < CRC_SUFFIX_BYTES; bit += 1) {
      const byte = variant & (1 << bit) ? 0x09 : 0x20
      suffix += String.fromCharCode(byte)
      folded = crcFold(folded, byte)
    }
    const crc = (folded ^ 0xffffffff) >>> 0
    if (safeField(crc)) return { suffix, crc }
  }
  throw new Error('internal error: trailing XML whitespace cannot produce a byte-safe CRC')
```

</details>

**依据 4 · 源码核查**：[src/asciizip.ts:206-245](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/asciizip.ts#L206-L245)

ASCII 安全 STORE 偏移和大小。

<details>
<summary>查看原文（40行）</summary>

```text
 * Contiguous ASCII-safe planner.
 *
 * Entries are laid out back to back with NO gaps: each local header starts
 * exactly where the previous entry's data ends, because Microsoft Office's
 * OPC reader refuses a package whose local entries are not contiguous (the
 * old slot-alignment design wrote inert NUL gaps that Python's zipfile
 * tolerated but Word/Excel/PowerPoint rejected). Every zip field must still
 * be ASCII-safe so the archive can travel through the UTF-8 text channel:
 * Choose a safe size and offset first, using legal XML whitespace and a
 * valid local extra field. Then vary eight trailing space/tab bytes to make
 * the CRC safe without changing that layout. CRC search no longer competes
 * with size/offset search. Never insert gaps between entries.
 */
function planEntries(parts: ZipPart[]): PlannedArchive {
  const planned: PlannedEntry[] = []
  let offset = 0
  for (const part of parts) {
    assertAscii(part.name, 'zip entry name')
    assertAscii(part.content, 'zip entry content')
    const nameLength = part.name.length
    const headerSize = LOCAL_HEADER_BYTES + nameLength
    const baseLength = part.content.length
    if (!safeField(nameLength) || nameLength > MAX_SAFE_U16) {
      throw new Error(`zip entry name is too long or has a non-byte-safe length: "${part.name}"`)
    }
    let length = nextSafeField(baseLength + CRC_SUFFIX_BYTES)
    let extraLength: number | undefined
    for (;;) {
      const end = offset + headerSize + length
      if (end > MAX_OFFICE_FILE_BYTES) throw new Error('generated Office package exceeds the 50 MiB write budget')
      extraLength = feasibleExtraLength(end)
      if (extraLength !== undefined) break
      // A long unsafe offset band may not fit in a 16-bit extra field.
      // Move the payload to the next feasible band while keeping size safe.
      length = nextSafeField(length + Math.max(1, nextSafeField(end) - end - MAX_SAFE_U16))
    }
    const pad = length - baseLength - CRC_SUFFIX_BYTES
    let state = contentCrcState(part.content)
    for (let index = 0; index < pad; index += 1) state = crcFold(state, 0x0a)
    const { suffix, crc } = safeCrcSuffix(state)
```

</details>

**依据 5 · 源码核查**：[src/asciizip.ts:329-355](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/asciizip.ts#L329-L355)

中央目录与 50 MiB 写出上限。

<details>
<summary>查看原文（27行）</summary>

```text
      u32(entry.crc), u32(length), u32(length), u16(nameLength), u16(entry.localExtraLength),
      entry.name, extraField(entry.localExtraLength), entry.content,
    )
    central.push(
      'PK\x01\x02', u16(20), u16(20), u16(0), u16(0), u16(DOS_TIME), u16(DOS_DATE),
      u32(entry.crc), u32(length), u32(length), u16(nameLength), u16(entry.centralExtraLength),
      u16(entry.commentLength), u16(0), u16(0), u32(0), u32(entry.offset),
      entry.name, extraField(entry.centralExtraLength), 'd'.repeat(entry.commentLength),
    )
    cursor = entry.offset + LOCAL_HEADER_BYTES + nameLength + entry.localExtraLength + length
  }
  const directorySize = central.reduce((sum, chunk) => sum + chunk.length, 0)
  const directoryOffset = plan.directoryOffset
  if (directoryOffset !== cursor) {
    throw new Error(`internal error: the central directory does not follow the last entry (planned ${directoryOffset}, actual ${cursor})`)
  }
  if (!safeField(directorySize) || !safeField(directoryOffset)) {
    throw new Error('internal error: the planned central directory fields are not ASCII-safe')
  }
  if (directoryOffset + directorySize + EOCD_BYTES > MAX_OFFICE_FILE_BYTES) {
    throw new Error('generated Office package exceeds the 50 MiB write budget')
  }
  const eocd = ['PK\x05\x06', u16(0), u16(0), u16(planned.length), u16(planned.length),
    u32(directorySize), u32(directoryOffset), u16(0)].join('')
  const output = [...local, central.join(''), eocd].join('')
  assertAscii(output, 'zip output')
  return output
```

</details>

**依据 6 · 源码核查**：[src/asciizip.ts:408-419](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/asciizip.ts#L408-L419)

限定实际解压输出。

<details>
<summary>查看原文（12行）</summary>

```text
  /** Inflated (stored or decompressed) bytes of one entry, bounded by its declared size. */
  private entryData(name: string): Uint8Array {
    const entry = this.entries.get(name)
    if (entry === undefined) throw new Error(`zip archive has no "${name}" entry`)
    const raw = this.entryBytes(name)
    const data = entry.method === 0
      ? raw
      : inflateRawSync(raw, { maxOutputLength: entry.uncompressedSize + 1 })
    if (data.length > entry.uncompressedSize) {
      throw new Error(`zip entry "${name}" produced more bytes than its declared size; refusing it`)
    }
    return data
```

</details>

**依据 7 · 源码核查**：[src/asciizip.ts:451-480](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/asciizip.ts#L451-L480)

读取 ZIP 的预算与目录入口。

<details>
<summary>查看原文（30行）</summary>

```text
export function readZip(bytes: Uint8Array, limits?: ZipGuardLimits): ZipArchive {
  const maxEntryBytes = limits?.maxEntryBytes ?? MAX_ZIP_ENTRY_BYTES
  const maxTotalBytes = limits?.maxTotalBytes ?? MAX_ZIP_TOTAL_BYTES
  const maxEntries = limits?.maxEntries ?? MAX_ZIP_ENTRIES

  if (bytes.length < EOCD_BYTES + 4) {
    throw new Error('not a readable zip archive (Office files must be valid .docx/.xlsx/.pptx zips): too short')
  }
  let eocd = -1
  const scanStart = Math.max(0, bytes.length - EOCD_BYTES - 0xffff)
  for (let index = bytes.length - EOCD_BYTES; index >= scanStart; index -= 1) {
    if (bytes[index] === 0x50 && bytes[index + 1] === 0x4b && bytes[index + 2] === 0x05 && bytes[index + 3] === 0x06) {
      eocd = index
      break
    }
  }
  if (eocd === -1) {
    throw new Error('not a readable zip archive (Office files must be valid .docx/.xlsx/.pptx zips): no end-of-central-directory record')
  }
  const entryTotal = readU16(bytes, eocd + 10)
  const directorySize = readU32(bytes, eocd + 12)
  const directoryOffset = readU32(bytes, eocd + 16)
  if (entryTotal > maxEntries) {
    throw new Error(`zip archive holds ${entryTotal} entries; office tools refuse archives with more than ${maxEntries}`)
  }
  if (directoryOffset + directorySize > bytes.length) {
    throw new Error('not a readable zip archive (Office files must be valid .docx/.xlsx/.pptx zips): central directory out of bounds')
  }

  const entries = new Map<string, ZipEntryInfo>()
```

</details>

**依据 8 · 源码核查**：[src/asciizip.ts:504-544](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/asciizip.ts#L504-L544)

逐条与累计限制、重复项拒绝和 XML 防护。

<details>
<summary>查看原文（41行）</summary>

```text
    }
    if (uncompressedSize > maxEntryBytes) {
      throw new Error(`zip entry "${name}" declares ${uncompressedSize} uncompressed bytes; office tools refuse entries above ${maxEntryBytes} bytes`)
    }
    const previous = entries.get(name)
    if (previous !== undefined) {
      throw new Error(`zip archive declares the entry "${name}" twice; refusing it`)
    }
    entries.set(name, { name, method, compressedSize, uncompressedSize, localOffset })
  }

  let totalBytes = 0
  for (const entry of entries.values()) {
    totalBytes += entry.uncompressedSize
    if (totalBytes > maxTotalBytes) {
      throw new Error(`zip archive declares more than ${maxTotalBytes} uncompressed bytes in total (at least ${totalBytes} after "${entry.name}"); refusing to inflate it`)
    }
  }
  return new ZipArchive(bytes, entries)
}

/**
 * OOXML parts are plain element trees; a DOCTYPE/ENTITY declaration is never
 * legitimate in one. Our extractors never resolve entities, but we refuse to
 * look at such a part at all so entity-expansion payloads die at the door.
 */
export function assertNoXmlDtd(xml: string, label: string): void {
  if (/<!\s*(?:DOCTYPE|ENTITY)\b/i.test(xml)) {
    throw new Error(`${label} contains a DOCTYPE/ENTITY declaration; office tools refuse such XML parts`)
  }
}

/**
 * Read one zip part as text and refuse DTD/entity-bearing XML before any
 * caller parses it. Returns null when the archive has no such part.
 */
export function readZipXmlPart(zip: ZipArchive, name: string): string | null {
  if (!zip.has(name)) return null
  const xml = zip.entryText(name)
  assertNoXmlDtd(xml, name)
  return xml
```

</details>

**依据 9 · 源码核查**：[src/fschannel.ts:171-207](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/fschannel.ts#L171-L207)

宿主二进制读取和 UTF-8 写入。

<details>
<summary>查看原文（37行）</summary>

```text
export async function readOfficeBytes(
  exec: ToolRunContext,
  ctx: FsContext,
  target: FsTarget,
): Promise<{ bytes: Uint8Array; sizeBytes: number }> {
  exec.signal.throwIfAborted()
  const fs = ctx.fs
  const info = await fs.stat(target, exec.signal)
  if (info === undefined) throw new Error('the file disappeared before it could be read')
  if (info.type !== 'file') throw new Error('the path is not a regular file')
  const declared = info.size ?? 0
  if (declared > MAX_OFFICE_FILE_BYTES) {
    throw new Error(`the file is ${declared} bytes; office tools refuse files larger than ${MAX_OFFICE_FILE_BYTES} bytes`)
  }
  const bytes = await fs.readBytes(target, exec.signal, MAX_OFFICE_FILE_BYTES)
  exec.signal.throwIfAborted()
  return { bytes, sizeBytes: bytes.byteLength }
}

/**
 * Publish one generated package: the text is pure ASCII (asserted by the zip
 * planner), so the backend's atomic UTF-8 write lands it on disk
 * byte-identical. The per-call write policy rides along as `writeText`'s
 * fifth parameter so a sandboxing backend fences the write by the session's
 * effective policy instead of its deployment default. Returns the on-disk size.
 */
export async function saveOfficeText(
  exec: ToolRunContext,
  ctx: FsContext,
  target: FsTarget,
  text: string,
  writePolicy?: OfficeWritePolicy,
): Promise<number> {
  exec.signal.throwIfAborted()
  await ctx.fs.writeText(target, text, undefined, exec.signal, writePolicy)
  exec.signal.throwIfAborted()
  return Buffer.byteLength(text, 'utf-8')
```

</details>

**依据 10 · 源码核查**：[tests/zip-guard.spec.ts:57-73](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/tests/zip-guard.spec.ts#L57-L73)

测试源码覆盖伪 ZIP 拒绝及 CRC 回读。

<details>
<summary>查看原文（17行）</summary>

```text
  test('pseudo-zip bytes get a friendly refusal', () => {
    const buffer = Buffer.from('this is obviously not a zip archive'.repeat(8))
    expect(() => readZip(buffer)).toThrow('not a readable zip archive')
  })

  test('writer output round-trips through the reader with valid CRCs', async () => {
    const zip = new JSZip()
    zip.file('[Content_Types].xml', '<?xml version="1.0"?><Types/>')
    const buffer = await zip.generateAsync({ type: 'nodebuffer' })
    const read = readZip(buffer)
    expect(read.entryNames()).toEqual(['[Content_Types].xml'])
    // The writer may pad parts with trailing newlines (legal after the XML root).
    expect(read.entryText('[Content_Types].xml').replace(/\n+$/, '')).toBe('<?xml version="1.0"?><Types/>')
  })
})

describe('tools route hostile archives through the guard', () => {
```

</details>

#### 缺口

- 未量测解压和生成内存，未用外部 Office 打开文件。
  **影响**：不能从文件预算推断宿主资源峰值或通用应用兼容。
  **进一步探讨**：以有界压缩边界、中文和特殊字符工件，对照进程峰值及真实 Office 打开结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些 Office 操作会改变保真、便携或公式语义？

**研究主题**：缺陷与关键质疑、功能与机制、效果与总成本

#### 完整回答

Word 更新把追加片段插在末尾节属性之前，并尝试用旧条目加更新正文重新封包。其余条目中含大于 0x7f 的字节会被拒绝，所以连真实 UTF-8 多字节文本也可能触发，不能只按是否有图片或字体判断。Excel 更新虽支持只写某 A1 地址，实际上解析工作表后重组工作簿，把被改表重渲染成网格 XML，整包只输出预设样式、固定关系和工作表等部件。外部工作簿的样式、图表、关系及共享字符串可能丢失或失效。读取公式采用已有缓存或等号字符串，重建受改单元格所在工作表时，带缓存公式读进网格可退化为值，等号开头输入会被创建为公式。这要求对来自外部数据的等号文本与预期计算分别验收。PPT 仅创建和读取，返回几何线框可帮检查布局，图片保留外链。图片在演示目录旁或下级时用相对路径，需要向上访问时退为绝对路径，可能暴露本地目录且不随工件移动。读回文本和几何不能代替收件端打开检查。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/word-update.ts:88-120](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/word-update.ts#L88-L120)

Word 追加与其余部件的 ASCII 守门。

<details>
<summary>查看原文（33行）</summary>

```text
    async execute(args: WordUpdateArgs, exec: ToolRunContext) {
      const writePolicy = await resolveWritePolicy(ctx, exec)
      const target = await resolveOfficePath(exec, ctx, args.path, ['.docx'], true, writePolicy)
      const { paragraphs: paragraphCount, cells } = wordCreateCounts(args)
      if ((args.paragraphs?.length ?? 0) === 0 && (args.bullets?.length ?? 0) === 0 && args.table === undefined) {
        throw new Error('word_update needs at least one of paragraphs, bullets, or table')
      }
      if (paragraphCount > 10_000) throw new Error('too many paragraphs/bullets/table rows (maximum 10000)')
      if (cells > 200_000) throw new Error('too many table cells (maximum 200000)')
      exec.signal.throwIfAborted()

      const { bytes } = await readOfficeBytes(exec, ctx, target.target)
      const zip = readZip(bytes)
      const documentXml = readZipXmlPart(zip, 'word/document.xml')
      if (documentXml === null) {
        throw new Error('the .docx has no word/document.xml part; is this a valid Word file?')
      }
      const fragment = buildAppendFragment(args)
      const updated = appendBeforeSectPr(documentXml, fragment)
      const parts: ZipPart[] = []
      for (const name of zip.entryNames()) {
        if (name === 'word/document.xml') {
          parts.push({ name, content: updated })
          continue
        }
        if (!zip.entryIsAsciiSafe(name)) {
          throw new Error(`zip entry "${name}" contains binary (non-ASCII) bytes; the update path re-publishes through the official UTF-8 text channel and cannot round-trip binary parts`)
        }
        parts.push({ name, content: zip.entryText(name) })
      }
      const text = buildAsciiZip(parts)
      exec.signal.throwIfAborted()
      const sizeBytes = await saveOfficeText(exec, ctx, target.target, text, writePolicy)
```

</details>

**依据 2 · 源码核查**：[src/asciizip.ts:427-433](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/asciizip.ts#L427-L433)

ASCII 检查按字节而非按媒体类型。

```text
  /** True when an entry's INFLATED content can round-trip an ASCII-safe rewrite. */
  entryIsAsciiSafe(name: string): boolean {
    const data = this.entryData(name)
    for (let index = 0; index < data.length; index += 1) {
      if (data[index]! > 0x7f) return false
    }
    return true
```

**依据 3 · 源码核查**：[src/tools/excel.ts:221-232](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/excel.ts#L221-L232)

等号字符串写成公式。

<details>
<summary>查看原文（12行）</summary>

```text
 * an uncached formula cell, everything else is a plain scalar.
 */
function gridCellOf(value: CellValue): GridCell {
  if (typeof value === 'string' && value.startsWith('=')) {
    return { kind: 'formula', formula: value.slice(1) }
  }
  return { kind: 'value', value }
}

function cellXml(address: string, cell: NonNullable<GridCell>): string {
  if (cell.kind === 'formula') {
    return `<c r="${address}" t="e"><f>${encodeXmlText(cell.formula)}</f></c>`
```

</details>

**依据 4 · 源码核查**：[src/tools/excel.ts:301-326](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/excel.ts#L301-L326)

重建固定部件的工作簿。

<details>
<summary>查看原文（26行）</summary>

```text
/** Assemble the full workbook package for the given ordered sheet models. */
function buildXlsxText(models: SheetModel[]): string {
  const workbookSheets = models.map((model, index) =>
    `<sheet name="${encodeXmlAttribute(model.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join('')
  const workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
    + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
    + `<sheets>${workbookSheets}</sheets></workbook>`
  const workbookRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + models.map((model, index) =>
      `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="${encodeXmlAttribute(model.part)}"/>`).join('')
    + '</Relationships>'
  const parts: ZipPart[] = [
    { name: '[Content_Types].xml', content: XLSX_CONTENT_TYPES },
    { name: '_rels/.rels', content: XLSX_ROOT_RELS },
    { name: 'xl/workbook.xml', content: workbook },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRels },
    { name: 'xl/styles.xml', content: XLSX_STYLES },
    { name: 'docProps/core.xml', content: XLSX_CORE_PROPS },
    { name: 'docProps/app.xml', content: XLSX_APP_PROPS },
  ]
  for (const model of models) {
    parts.push({ name: `xl/${model.part}`, content: model.content })
  }
  return buildAsciiZip(parts)
```

</details>

**依据 5 · 源码核查**：[src/tools/excel.ts:398-424](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/excel.ts#L398-L424)

有缓存的公式被解成值，支持解析共享字符串。

<details>
<summary>查看原文（27行）</summary>

```text
      const attributes = cellMatch[1] ?? ''
      const body = cellMatch[2] ?? ''
      const ref = (attributes).match(CELL_REF)
      if (ref === null) continue
      const address = `${ref[1]!}${ref[2]!}`
      const type = (attributes).match(CELL_TYPE)?.[1]
      const rawValue = (body).match(CELL_VALUE)?.[1]
      const formula = (body).match(CELL_FORMULA)?.[1]
      const inlineText = (body).match(CELL_INLINE_TEXT)?.[1]
      let cell: GridCell
      if (formula !== undefined) {
        if (rawValue !== undefined && type !== 'e') {
          cell = { kind: 'value', value: decodeXmlEntities(rawValue) }
        } else {
          cell = { kind: 'formula', formula: decodeXmlEntities(formula) }
        }
      } else if (type === 's') {
        const index = rawValue === undefined ? -1 : Number.parseInt(rawValue, 10)
        cell = { kind: 'value', value: sharedStrings[index] ?? '' }
      } else if (type === 'inlineStr') {
        cell = { kind: 'value', value: inlineText === undefined ? '' : decodeXmlEntities(inlineText) }
      } else if (type === 'b') {
        cell = { kind: 'value', value: rawValue === '1' ? 'TRUE' : 'FALSE' }
      } else if (type === 'str') {
        cell = { kind: 'value', value: rawValue === undefined ? '' : decodeXmlEntities(rawValue) }
      } else if (rawValue !== undefined) {
        cell = { kind: 'value', value: decodeXmlEntities(rawValue) }
```

</details>

**依据 6 · 源码核查**：[src/tools/excel.ts:718-764](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/excel.ts#L718-L764)

全包 ASCII 检查及写入后重建。

<details>
<summary>查看原文（47行）</summary>

```text
      const { bytes } = await readOfficeBytes(exec, ctx, target.target)
      const zip = readZip(bytes)
      // Touch every part once: the re-emit refuses binary parts up front
      // instead of failing halfway through a rewrite.
      void asciiPartsOf(zip)
      const workbook = parseWorkbook(zip)
      const names = [...workbook.names]
      const models = new Map(workbook.sheets)
      const updatedSheets: string[] = []

      for (const spec of sheetSpecs) {
        const grid = gridOf(spec.rows)
        const last = gridAddresses(grid).at(-1)
        if (!names.includes(spec.name)) names.push(spec.name)
        models.set(spec.name, {
          name: spec.name,
          part: models.get(spec.name)?.part ?? `worksheets/sheet${names.length}.xml`,
          content: sheetXml(grid),
          grid,
          maxRow: last?.row ?? -1,
          maxColumn: last?.column ?? -1,
        })
        updatedSheets.push(spec.name)
      }

      const cellUpdates: Array<{ sheet: string; cell: string }> = []
      for (const update of args.cell_updates ?? []) {
        const model = models.get(update.sheet)
        if (model === undefined) throw new Error(`sheet "${update.sheet}" not found for cell update; available sheets: ${names.join(', ')}`)
        const { row, column } = parseCellAddress(update.cell)
        if (row < 0 || column < 0 || row >= 1_048_576) {
          throw new Error(`invalid cell address "${update.cell}"; use A1 notation such as "B2"`)
        }
        model.grid.set(update.cell.toUpperCase(), gridCellOf(update.value))
        model.maxRow = Math.max(model.maxRow, row)
        model.maxColumn = Math.max(model.maxColumn, column)
        model.content = sheetXml(model.grid)
        cellUpdates.push({ sheet: update.sheet, cell: update.cell })
      }

      exec.signal.throwIfAborted()
      const orderedModels = names
        .map(name => models.get(name))
        .filter((model): model is SheetModel => model !== undefined)
        .map((model, index) => ({ ...model, part: `worksheets/sheet${index + 1}.xml` }))
      const text = buildXlsxText(orderedModels)
      const sizeBytes = await saveOfficeText(exec, ctx, target.target, text, writePolicy)
```

</details>

**依据 7 · 源码核查**：[src/tools/ppt.ts:107-112](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/ppt.ts#L107-L112)

可输出外部关系标记。

```text
const REL_NS = 'xmlns="http://schemas.openxmlformats.org/package/2006/relationships"'
const CT_NS = 'xmlns="http://schemas.openxmlformats.org/package/2006/content-types"'

function relationshipXml(id: string, type: string, target: string, external: boolean): string {
  return `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/${type}" Target="${encodeXmlAttribute(target)}"${external ? ' TargetMode="External"' : ''}/>`
}
```

**依据 8 · 源码核查**：[src/tools/ppt.ts:346-381](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/ppt.ts#L346-L381)

图片链接选择与工作区读取。

<details>
<summary>查看原文（36行）</summary>

```text
/**
 * Posix-style link target for one image: relative to the deck's directory
 * when the image sits beside or below it (portable within the workspace),
 * otherwise the absolute path with forward slashes.
 */
function imageLinkTarget(deck: ResolvedOfficePath, image: ResolvedOfficePath): string {
  const deckPath = deck.absolute.replace(/\\/g, '/')
  const imagePath = image.absolute.replace(/\\/g, '/')
  const deckParts = deckPath.split('/').filter(Boolean).slice(0, -1)
  const imageParts = imagePath.split('/').filter(Boolean)
  let common = 0
  while (common < deckParts.length && common < imageParts.length - 1 && deckParts[common] === imageParts[common]) common += 1
  const up = deckParts.length - common
  const relative = [...Array.from({ length: up }, () => '..'), ...imageParts.slice(common)].join('/')
  return relative.startsWith('../') || relative === '' ? imagePath : relative
}

/**
 * Resolve one slide image: verify the workspace path, sniff intrinsic pixel
 * size, then compute the placed box — explicit w/h wins, a single dimension
 * scales by aspect, and full omission uses natural size. `contain` fits the
 * image inside the box; `cover` keeps the box and crops via srcRect.
 */
async function placeImage(exec: ToolRunContext, ctx: FsContext, deck: ResolvedOfficePath, image: SlideImageSpec, slideIndex: number, imageIndex: number): Promise<PlacedImage> {
  const resolved = await resolveOfficePath(exec, ctx, image.path, IMAGE_EXTENSIONS, true)
  const info = await ctx.fs.stat(resolved.target, exec.signal)
  if (info !== undefined && (info.size ?? 0) > MAX_IMAGE_BYTES) {
    throw new Error(`slide ${slideIndex + 1} image ${imageIndex + 1} "${image.path}" is ${info.size} bytes; maximum linked image size is ${MAX_IMAGE_BYTES} bytes`)
  }
  // readBytes rejects any file larger than its cap, and sniffImageSize only
  // needs the first 1 KiB; cap at the real file size so ordinary images
  // (always well above 4 KiB) are not rejected before sniffing.
  const head = await ctx.fs.readBytes(resolved.target, exec.signal, Math.max(1024, info?.size ?? 0))
  const intrinsic = sniffImageSize(head.subarray(0, Math.min(head.byteLength, 1024)))

  const target = imageLinkTarget(deck, resolved)
```

</details>

**依据 9 · 源码核查**：[src/tools/ppt.ts:993-1011](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/ppt.ts#L993-L1011)

PPT 生成回执返回布局元素。

<details>
<summary>查看原文（19行）</summary>

```text
      const { text, layout } = await buildPptxText(args, exec, ctx, target)
      exec.signal.throwIfAborted()
      const sizeBytes = await saveOfficeText(exec, ctx, target.target, text, writePolicy)
      const result: {
        path: string
        sizeBytes: number
        title?: string
        slideCount: number
        slideWidthInches: number
        slideHeightInches: number
        slides: Array<{ index: number; elements: SlideElementBox[] }>
      } = {
        path: target.display,
        sizeBytes,
        slideCount: layout.length,
        slideWidthInches: Math.round(SLIDE_WIDTH_INCHES * 100) / 100,
        slideHeightInches: SLIDE_HEIGHT_INCHES,
        slides: layout,
      }
```

</details>

#### 缺口

- 未拿富格式 Word/Excel 或异机 PowerPoint 验证具体损失。
  **影响**：不能从本工具读取成功判断 Office 原应用中的视觉、公式和关系保真。
  **进一步探讨**：用副本放入样式、缓存公式、图表、外链图片和注释，从目标应用打开并复核差异。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些办公交付可控试用，怎样验收与退出？

**研究主题**：采用判断、依赖、兼容与流程、效果与总成本

#### 完整回答

合适的起点是同一 DSH Web 会话中由结构化数据新建一份季度简报、一张预算表和一套轻量汇报稿。用专用目录与新路径，按作者安装指引和版本表核对工具，先用少量中文、数字和普通公式生成。工具回读检查段落、表格、公式与页数，随后由收件人预定的 Office 软件重新打开并核对格式与公式重算。携图交付应检查随包相对路径和目标信任策略，优先用无外链的测试稿。对已有富格式文件只处理副本。已存在的目标内容、命名冲突和失败的生成应核对实际工件再重试。PPT 冲突可以关闭该组，退出用原 profile 和保留的原文件重做。首次需要核对宿主、重启和检查真实 Office，持续负担是人工复核、清点配套图与处理转换失败。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-69](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/README.md#L45-L69)

作者安装、重启和开关说明。

<details>
<summary>查看原文（25行）</summary>

````text
## Install

```bash
dsh plugin --profile web add dsh-office-tools              # npm (recommended)
dsh plugin --profile web add github:kw78/dsh-office-tools  # from source
```

Restart DSH after installing. Requires a profile that provides the `fs` service (every profile with built-in read/write tools does).

## Notes

- All paths are confined to the session workspace; `overwrite` defaults to `false`.
- Reads accept any real package (STORE/DEFLATE) with zip-bomb guards; updates refuse packages with binary parts instead of corrupting them.
- PPT images are **linked, not embedded**: the sanctioned `ctx.fs` write channel is UTF-8 text only, so a package cannot carry binary image parts. Keep image files next to the deck when moving it, and note that PowerPoint blocks external content by default — a linked picture renders as a "blocked automatic download" placeholder until you enable external content (File → Info → Enable Content, or add the folder under Trust Center → Trusted Locations). This is a PowerPoint security policy, not a package defect.
- `ppt_create` echoes every element's landing position; `ppt_read` returns the same geometry for any deck.

## Configuration

One option: `enablePptTools` (default `true`) — set it to `false` to coexist with a dedicated presentation plugin such as dsh-ppt:

```yaml
- insert:
    - id: dsh-office-tools
      config:
        enablePptTools: false
````

</details>

**依据 2 · 作者声明**：[README.md:72-83](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/README.md#L72-L83)

作者开发和兼容性说明。

<details>
<summary>查看原文（12行）</summary>

````text
## Development

```bash
pnpm install && pnpm run check   # typecheck + tests + build
pnpm run test:e2e                # real-composition E2E (sandbox-policy + fs-sandbox + tools)
```

<!-- compatibility:start -->
Compatibility: `^0.1.0-rc.6 || ^0.1.1-rc.0 || ^0.1.2-alpha.0 || ^0.1.5-alpha.0 || ^0.2.0-rc.1 || ^0.2.1-rc.3`; exact tested releases live in `package.json` (`dsh.compatibility.dshReleases`). CI exercises 0.1.2-rc.1, 0.2.0-rc.1, and 0.2.1-rc.3. DSH 0.3.x is not declared supported.
<!-- compatibility:end -->

Generated packages are limited to 50 MiB. Up to 200 PPT slides (including an optional title slide) are accepted; linked images remain external. See [architecture and migration plan](docs/ARCHITECTURE.zh.md) for the binary-write seam needed for true embedding.
````

</details>

**依据 3 · 源码核查**：[tests/demo-trio.spec.ts:45-90](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/tests/demo-trio.spec.ts#L45-L90)

源码用例定义同一会话创建与回读三份工件。

<details>
<summary>查看原文（46行）</summary>

```text
  test('one session: create report.docx + budget.xlsx + deck.pptx, read all three back', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-office-trio-'))
    try {
      const tools = mountTools()

      await run(tools, 'word_create', {
        path: 'report.docx',
        title: 'Q3 2026 Quarterly Report',
        paragraphs: [
          'Revenue grew 12% quarter over quarter, led by the enterprise segment.',
          'Operating margin held steady despite the mid-quarter pricing change.',
        ],
        bullets: [
          'Enterprise ARR up 18%',
          'Churn down to 2.1%',
          'Two new regional partners signed',
        ],
        table: {
          headers: ['Metric', 'Q2 2026', 'Q3 2026'],
          rows: [
            ['Revenue', '4.10M', '4.59M'],
            ['Gross margin', '61%', '62%'],
            ['Net churn', '2.6%', '2.1%'],
          ],
        },
      }, root)

      await run(tools, 'excel_create', {
        path: 'budget.xlsx',
        sheets: [
          {
            name: 'Budget',
            rows: [
              ['Category', 'Plan', 'Actual', 'Variance'],
              ['Engineering', 120000, 118500, '=C2-B2'],
              ['Marketing', 45000, 51200, '=C3-B3'],
              ['Operations', 35000, 33800, '=C4-B4'],
              ['Total', '=SUM(B2:B4)', '=SUM(C2:C4)', '=C5-B5'],
            ],
          },
          {
            name: 'Summary',
            rows: [['Headline', 'Value'], ['Marketing overrun', '=C3-B3']],
          },
        ],
      }, root)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:40-55](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/index.ts#L40-L55)

PPT 工具条件注册。

<details>
<summary>查看原文（16行）</summary>

```text
/** Configuration schema; the callable form applies schema defaults. */
export const Config = z.object({
  enablePptTools: z.boolean().default(true)
    .description('register ppt_create / ppt_read (set to false to coexist with a dedicated PPT plugin such as dsh-ppt)'),
})

export function apply(ctx: Context, config?: Config): void {
  const resolved = Config(config ?? {})
  ctx.effect(() => {
    const disposers = [
      registerWordTools(ctx),
      registerExcelTools(ctx),
      ...(resolved.enablePptTools ? [registerPptTools(ctx)] : []),
    ]
    return () => disposers.forEach(dispose => dispose())
  })
```

</details>

**依据 5 · 源码核查**：[src/tools/ppt.ts:515-539](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/ppt.ts#L515-L539)

PPT 页数限制及图片处理入口。

<details>
<summary>查看原文（25行）</summary>

```text
export async function buildPptxText(
  args: PptCreateArgs,
  exec: ToolRunContext,
  ctx: FsContext,
  deck: ResolvedOfficePath,
): Promise<{ text: string; layout: Array<{ index: number; elements: SlideElementBox[] }> }> {
  const builds: SlideBuild[] = []
  if (args.title !== undefined && args.title.trim() !== '') {
    builds.push({ spec: { title: args.title }, first: true, images: [] })
  }
  const slides = args.slides ?? []
  let first = args.title === undefined || args.title.trim() === ''
  for (const spec of slides) {
    builds.push({ spec, first, images: [] })
    first = false
  }
  const slideCount = builds.length
  if (slideCount === 0) throw new Error('ppt_create needs a title or at least one slide')
  if (slideCount > 200) throw new Error('too many slides including the title slide (maximum 200)')

  for (const [slideIndex, build] of builds.entries()) {
    const images = build.spec.images ?? []
    build.images = []
    for (const [imageIndex, image] of images.entries()) {
      build.images.push(await placeImage(exec, ctx, deck, image, slideIndex, imageIndex))
```

</details>

**依据 6 · 源码核查**：[src/fschannel.ts:197-220](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/fschannel.ts#L197-L220)

创建检查与写入边界。

<details>
<summary>查看原文（24行）</summary>

```text
export async function saveOfficeText(
  exec: ToolRunContext,
  ctx: FsContext,
  target: FsTarget,
  text: string,
  writePolicy?: OfficeWritePolicy,
): Promise<number> {
  exec.signal.throwIfAborted()
  await ctx.fs.writeText(target, text, undefined, exec.signal, writePolicy)
  exec.signal.throwIfAborted()
  return Buffer.byteLength(text, 'utf-8')
}

/**
 * Reject an overwrite when `overwrite` is false and the target already
 * exists. Callers use this BEFORE doing expensive generation so the model
 * gets a fast refusal instead of wasted work.
 */
export async function assertMayCreate(exec: ToolRunContext, ctx: FsContext, target: FsTarget, overwrite: boolean): Promise<void> {
  if (overwrite) return
  const info = await ctx.fs.stat(target, exec.signal)
  if (info !== undefined) {
    throw new Error('the target already exists; pass overwrite: true to replace it')
  }
```

</details>

#### 缺口

- 未验收实际版本、Office 跨机渲染和配置恢复。
  **影响**：推荐只覆盖新建低复杂度工件的隔离试用。
  **进一步探讨**：在目标宿主及 Office 版本检查安装、拒绝同名、收件端打开与停用退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时会减少办公交付的总成本？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

假设由同一份结构化输入自动生成三个简单 Office 工件，能减少重复录入及一致性核对。以人工 Office 模板为基线，用相同季度数据、标注和接收应用，交错执行两条路径。合格以交叉核对关键数字、版式、公式可重算和独立收件端打开为准。记录每组合格工件耗时、人工返工分钟、生成失败、模型交互次数、需带外部资源数和收件端修复率。把写入成功后的回读和失败恢复时间都计入。若总人工时间减少且关键数字与收件侧质量持平，才支持在低复杂度批量交付继续采用。如果节省被富格式重做、公式失真或外链修复抵消，则推翻该工作流的净收益假设。

#### 证据与依据

**依据 1 · 源码核查**：[tests/demo-trio.spec.ts:45-90](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/tests/demo-trio.spec.ts#L45-L90)

作者用例可作为可重复输入起点。

<details>
<summary>查看原文（46行）</summary>

```text
  test('one session: create report.docx + budget.xlsx + deck.pptx, read all three back', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-office-trio-'))
    try {
      const tools = mountTools()

      await run(tools, 'word_create', {
        path: 'report.docx',
        title: 'Q3 2026 Quarterly Report',
        paragraphs: [
          'Revenue grew 12% quarter over quarter, led by the enterprise segment.',
          'Operating margin held steady despite the mid-quarter pricing change.',
        ],
        bullets: [
          'Enterprise ARR up 18%',
          'Churn down to 2.1%',
          'Two new regional partners signed',
        ],
        table: {
          headers: ['Metric', 'Q2 2026', 'Q3 2026'],
          rows: [
            ['Revenue', '4.10M', '4.59M'],
            ['Gross margin', '61%', '62%'],
            ['Net churn', '2.6%', '2.1%'],
          ],
        },
      }, root)

      await run(tools, 'excel_create', {
        path: 'budget.xlsx',
        sheets: [
          {
            name: 'Budget',
            rows: [
              ['Category', 'Plan', 'Actual', 'Variance'],
              ['Engineering', 120000, 118500, '=C2-B2'],
              ['Marketing', 45000, 51200, '=C3-B3'],
              ['Operations', 35000, 33800, '=C4-B4'],
              ['Total', '=SUM(B2:B4)', '=SUM(C2:C4)', '=C5-B5'],
            ],
          },
          {
            name: 'Summary',
            rows: [['Headline', 'Value'], ['Marketing overrun', '=C3-B3']],
          },
        ],
      }, root)
```

</details>

**依据 2 · 源码核查**：[src/tools/excel.ts:718-764](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/excel.ts#L718-L764)

表格重建及实际验收的风险来源。

<details>
<summary>查看原文（47行）</summary>

```text
      const { bytes } = await readOfficeBytes(exec, ctx, target.target)
      const zip = readZip(bytes)
      // Touch every part once: the re-emit refuses binary parts up front
      // instead of failing halfway through a rewrite.
      void asciiPartsOf(zip)
      const workbook = parseWorkbook(zip)
      const names = [...workbook.names]
      const models = new Map(workbook.sheets)
      const updatedSheets: string[] = []

      for (const spec of sheetSpecs) {
        const grid = gridOf(spec.rows)
        const last = gridAddresses(grid).at(-1)
        if (!names.includes(spec.name)) names.push(spec.name)
        models.set(spec.name, {
          name: spec.name,
          part: models.get(spec.name)?.part ?? `worksheets/sheet${names.length}.xml`,
          content: sheetXml(grid),
          grid,
          maxRow: last?.row ?? -1,
          maxColumn: last?.column ?? -1,
        })
        updatedSheets.push(spec.name)
      }

      const cellUpdates: Array<{ sheet: string; cell: string }> = []
      for (const update of args.cell_updates ?? []) {
        const model = models.get(update.sheet)
        if (model === undefined) throw new Error(`sheet "${update.sheet}" not found for cell update; available sheets: ${names.join(', ')}`)
        const { row, column } = parseCellAddress(update.cell)
        if (row < 0 || column < 0 || row >= 1_048_576) {
          throw new Error(`invalid cell address "${update.cell}"; use A1 notation such as "B2"`)
        }
        model.grid.set(update.cell.toUpperCase(), gridCellOf(update.value))
        model.maxRow = Math.max(model.maxRow, row)
        model.maxColumn = Math.max(model.maxColumn, column)
        model.content = sheetXml(model.grid)
        cellUpdates.push({ sheet: update.sheet, cell: update.cell })
      }

      exec.signal.throwIfAborted()
      const orderedModels = names
        .map(name => models.get(name))
        .filter((model): model is SheetModel => model !== undefined)
        .map((model, index) => ({ ...model, part: `worksheets/sheet${index + 1}.xml` }))
      const text = buildXlsxText(orderedModels)
      const sizeBytes = await saveOfficeText(exec, ctx, target.target, text, writePolicy)
```

</details>

**依据 3 · 源码核查**：[src/tools/ppt.ts:993-1011](https://github.com/kw78/dsh-office-tools/blob/5ec874b0b164c5eac878554ff078d23eae27299f/src/tools/ppt.ts#L993-L1011)

工件布局回执可辅助检查。

<details>
<summary>查看原文（19行）</summary>

```text
      const { text, layout } = await buildPptxText(args, exec, ctx, target)
      exec.signal.throwIfAborted()
      const sizeBytes = await saveOfficeText(exec, ctx, target.target, text, writePolicy)
      const result: {
        path: string
        sizeBytes: number
        title?: string
        slideCount: number
        slideWidthInches: number
        slideHeightInches: number
        slides: Array<{ index: number; elements: SlideElementBox[] }>
      } = {
        path: target.display,
        sizeBytes,
        slideCount: layout.length,
        slideWidthInches: Math.round(SLIDE_WIDTH_INCHES * 100) / 100,
        slideHeightInches: SLIDE_HEIGHT_INCHES,
        slides: layout,
      }
```

</details>

#### 缺口

- 无人工 Office 基线、真实交付时长或复核数据。
  **影响**：当前只能判断如何测量，不能量化节省或稳定性。
  **进一步探讨**：用多批次相同输入和不同人员交错比较，预设验收项与收益阈值。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
