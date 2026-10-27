# dsh-skill-manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fb45203](https://github.com/AKS1st/dsh-skill-manager/tree/fb452031031ea50a3287292d22b54e765d1039dc)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dsh-skill-manager) [![npm 30d 994](https://img.shields.io/static/v1?label=npm+30d&message=994&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-manager) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-manager)
<!-- END META -->

> **实现功能**：在Harness设置页分层浏览、编辑技能，支持zip导入导出、删除与启停。

> **核心亮点**：用宿主分层registry和可写目录边界组织图形技能管理，把格式校验放在保存前，减少“编辑器能显示但宿主不加载”的差异；属于管理流程与校验集成。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：zip导入的归属映射仅为SKILL.md及顶层Markdown登记，但提取循环要求每个entry都在该映射中，scripts/references等附属文件会被continue跳过。静态代码支持完整性缺陷，尚未执行归档复现；这直接削弱技能搬迁承诺。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要Skill目录管理，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · 文件读写、目录隔离与宿主更新如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使Skill目录管理的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从文件读写、目录隔离与宿主更新的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用Skill目录管理，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为不愿手工操作技能目录的Harness维护者提供分层浏览与编辑入口，交付应是技能及附属资源可用、系统目录保持只读，而非仅出现导入成功提示。

文件编辑器及zip命令提供同类能力但需人工识别层级；本插件主要减少发现与格式判断负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分层目录与文件树 | 识别技能归属和资源 | 以会话scope及registry完整度为准 |
| 编辑 | 更新可写技能文件 | 系统/预设只读，SKILL格式门 |
| zip导入/导出 | 搬迁和备份 | 展开上限，导入附属资源缺口 |
| 删除/启停 | 管理可写技能 | 删除无回收站，启停通过rename |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24、Harness Web与connection | 必需 | 设置页和鉴权端点 | 无法提供管理页 |
| skills registry、会话/工作区服务 | 目录完整性必需 | 确定可见层及导入目的地 | list可返回complete:false |
| fs/Node目录权限 | 写入操作必需 | 编辑、zip、删除和rename | 权限/边界错误返回RPC错误 |
| fflate、yaml、immer | 包依赖 | 归档、格式和客户端状态 | 缺失无法构建/加载对应模块 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 安装重启，打开技能管理页并选会话 | 目录分层与complete状态合理 |
| 2 | 导出备份后编辑或导入低风险技能 | SKILL.md格式通过且附属文件齐全 |
| 3 | 重新读取宿主目录并实际核对可见技能 | 管理页保存成功不等于registry加载成功 |
| 4 | 异常时恢复备份或目录名 | 删除无内置回收站，启停可rename恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包与本地存储资源，金额未知 | 对齐宿主API、备份技能目录 | 无外部模型必需调用 |
| 持续使用 | 目录扫描、zip内存和文件IO | 内容审核及导入后资源核对 | 8MB base64/100MB展开等上限 |
| 失败恢复 | 备份与重复导入资源 | 恢复删除/覆盖内容及技能依赖 | 未见事务回滚或自动备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可视管理 | 分层目录、编辑与受限写路径 | 真实复杂scope下目录完整性 |
| 格式保护 | SKILL.md写入前严格YAML校验 | 语义正确和附属资源完整性 |
| zip迁移 | 导入/导出接口与资源上限 | 当前导入循环疑似丢弃附属文件，未运行复现 |

> **思考**：zip导入的归属映射仅为SKILL.md及顶层Markdown登记，但提取循环要求每个entry都在该映射中，scripts/references等附属文件会被continue跳过。静态代码支持完整性缺陷，尚未执行归档复现；这直接削弱技能搬迁承诺。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用宿主分层registry和可写目录边界组织图形技能管理，把格式校验放在保存前，减少“编辑器能显示但宿主不加载”的差异；属于管理流程与校验集成。参见[Q01](#research-q01)、[Q02](#research-q02)。

用宿主分层registry和可写目录边界组织图形技能管理，把格式校验放在保存前，减少“编辑器能显示但宿主不加载”的差异；属于管理流程与校验集成。参见[Q01](#research-q01)、[Q02](#research-q02)。

canonical路径白名单、zip解压前预算及保存前同YAML解析器可借鉴；导入需完整manifest、写入事务与回滚，客户端两步确认不能替代服务端恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

zip导入的归属映射仅为SKILL.md及顶层Markdown登记，但提取循环要求每个entry都在该映射中，scripts/references等附属文件会被continue跳过。静态代码支持完整性缺陷，尚未执行归档复现；这直接削弱技能搬迁承诺。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察；有编辑需求者可先只读浏览并备份后改单文件，不应依赖当前zip导入迁移复杂技能。导入后必须逐文件与宿主可见性核对，缺资源或覆盖异常立即恢复备份。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

管理、边界与格式门可核；静态发现zip附属资源归属缺口，未运行复现。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh-CN.md、package.json、src/index.ts、src/invariant.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读Host目录/白名单、SKILL校验、zip、删除与端点，客户端依据固定README，未运行目标测试。
- 下一步：构造含SKILL.md/scripts/references的最小归档和只读/可写目录，核对导入前后逐文件摘要、冲突和恢复；本轮不执行。

**分析版本**

- **仓库**：[AKS1st/dsh-skill-manager](https://github.com/AKS1st/dsh-skill-manager)
- **版本号**：0.3.2（[固定提交 fb45203](https://github.com/AKS1st/dsh-skill-manager/tree/fb452031031ea50a3287292d22b54e765d1039dc)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可先构造按顶层skill归属的完整文件清单，严格校验并在暂存目录完成后原子rename，返回文件摘要与未导入原因；用含scripts/references及名称冲突的zip往返比对，若缺文件、覆盖不可回滚或目录越界即否定。假设未验证且增加暂存/备份空间。参见[Q05](#research-q05)。

构造含SKILL.md/scripts/references的最小归档和只读/可写目录，核对导入前后逐文件摘要、冲突和恢复；本轮不执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 2708 | 2450 | 392 | — |
| .md | source | 2 | 141 | — | — | 1233 |
| .ts | source | 7 | 2300 | 1570 | 614 | — |
| .tsx | source | 2 | 621 | 529 | 59 | — |
| .ts | test | 5 | 968 | 811 | 78 | — |
| .mjs | source | 1 | 17 | 9 | 7 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AKS1st/dsh-skill-manager/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 fb452031031ea50a3287292d22b54e765d1039dc 和截止 2026-10-23T01:41:11Z 范围内，Skill目录管理能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要Skill目录管理，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Harness维护者在用户、项目及预设技能间管理内容时，原办法是文件编辑器/命令行和手工zip。该插件以分层设置页交付浏览、编辑和迁移入口，成功标准为宿主能发现并正确使用完整技能，而非页内状态变更。系统和预设只读能降低误改，但不代表技能内容可信。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:9-15](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/README.zh-CN.md#L9-L15)

作者管理用途与操作主张

```text
一个 DSH Web 插件，在设置面板（从侧边栏底部的「设置」入口打开）中新增「技能管理」页面。它展示当前部署可见的全部技能，按 **系统 / 用户 / 工作区 / 预设** 四类分组，无需手动操作文件系统即可管理：

- **浏览** — 展开技能查看其目录文件树；系统（bundled）技能只读，用户与工作区技能可完整管理。
- **编辑** — 点击文件打开查看/编辑窗口，直接修改技能内容。
- **导入** — 上传 zip 技能包，安装到你的用户技能目录或任意工作区（空白工作区也显示，排在最后）。
- **导出** — 将任意技能下载为 zip，只读技能也可导出。
- **删除** — 两步确认后删除可写技能。
```

**依据 2 · 源码核查**：[src/index.ts:273-286](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L273-L286)

来源与管理层映射

<details>
<summary>查看原文（14行）</summary>

```text
function tierFor(source: string, provider?: string): SkillManagerEntry['tier'] {
  switch (source) {
    case 'bundled':
      // The deployment's own bundled roots (default filesystem provider, the
      // dsh-badge provider) are system skills; any other provider mounting a
      // bundled root is a plugin contribution.
      return provider !== undefined && SYSTEM_BUNDLED_PROVIDERS.has(provider) ? 'system' : 'plugin'
    case 'user-dsh':
    case 'user-agents': return 'user'
    case 'project-dsh':
    case 'project-agents': return 'project'
    // custom (preset-provided dirs) and runtime-registered skills belong to
    // the preset/deployment plane, not to a project workspace.
    default: return 'custom'
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件读写、目录隔离与宿主更新如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

客户端请求经鉴权connection fetch端点分派至service；list按session preset/cwd读registry并保存known/writable canonical目录，write先边界校验再对SKILL.md做YAML校验后写入。导入走Node文件系统并要求登记工作区。需Web/connection/skills和对应读写权限，用户应先列目录、备份、修改，再核宿主目录；无服务时complete:false或错误，不能当空生态。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:589-623](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L589-L623)

canonical路径与白名单校验

<details>
<summary>查看原文（35行）</summary>

```text
  async function resolveCanonical(rawPath: string): Promise<string> {
    const fs = fsOf()
    if (fs !== undefined) {
      try {
        const target = await fs.resolve(rawPath)
        return (target as { targetKey?: string }).targetKey ?? target.displayPath
      } catch {
        // fall through to node realpath
      }
    }
    try {
      return await nodeRealpath(rawPath)
    } catch {
      return rawPath
    }
  }

  /**
   * Resolve a client-supplied path to its canonical key and verify it sits
   * inside one of the given directory prefixes (or equals it).
   * @param requestPath - the raw client path.
   * @param prefixes - canonical directory keys to allow.
   * @param what - action label for the refusal message (`write to`, `delete`, …).
   * @param refusal - the category word for the refusal message (`writable` / `known`).
   * @returns the canonical key of `requestPath`.
   * @throws when the path is outside every allowed prefix.
   */
  async function assertInside(requestPath: string, prefixes: string[], what: string, refusal: string): Promise<string> {
    const key = await resolveCanonical(requestPath)
    const allowed = prefixes.some(prefix =>
      key === prefix || key.startsWith(`${prefix}/`) || key.startsWith(`${prefix}\\`))
    if (!allowed) {
      throw new Error(`refusing to ${what}: path is outside a ${refusal} skill directory (${requestPath})`)
    }
    return key
```

</details>

**依据 2 · 源码核查**：[src/index.ts:936-956](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L936-L956)

写前校验链

<details>
<summary>查看原文（21行）</summary>

```text
    async write(request) {
      // Only paths inside a non-read-only skill directory (collected by the
      // last catalog read) may be written; system/bundled and unknown paths
      // are refused before touching the filesystem. The path is canonicalized
      // first so `..` segments and symlinks cannot escape the whitelist.
      const key = await assertInside(request.path, writableSkillDirs, 'write to', 'writable')
      const fs = fsOf()
      if (fs === undefined) throw new Error('filesystem service is unavailable')
      // Save-time gate for SKILL.md: the Harness drops a skill whose frontmatter
      // does not parse, with nothing but a host-stdout warning, so an unvalidated
      // save can make a whole skill disappear from every agent's catalog. Other
      // files in the directory (references, scripts) are written as-is.
      if (key.split(/[\\/]/).pop() === 'SKILL.md') {
        const problems = validateSkillDocument(request.content)
        if (problems.length > 0) {
          throw new Error('SKILL.md 校验未通过，未写入：\n- ' + problems.join('\n- '))
        }
      }
      const target = await fs.resolve(key)
      await fs.writeText(target, request.content)
      return { ok: true }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1152-1183](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L1152-L1183)

八类端点和分派

<details>
<summary>查看原文（32行）</summary>

```text
/** Endpoints this channel serves; each becomes one exact Fetch route under `/api`. */
const SKILL_MANAGER_ENDPOINTS = [
  'list', 'files', 'read', 'write', 'importSkill', 'exportSkill', 'deleteSkill', 'toggleSkill',
] as const

export const inject = ['connection']

export function apply(ctx: Context): void {
  const service = buildService(ctx)
  ctx.provide('skillManager', service)

  const connection = ctx.get('connection') as HostConnectionHandle
  // Dedicated plugin channels ride the shared `/api` carrier. The generic RPC
  // caller's channel must be a single path segment, so the logical channel
  // travels as the endpoint's first segment instead. Exact Fetch routes only
  // touch this service's own route table, and the carrier applies trusted-host
  // and browser authentication before these handlers run — which also leaves
  // the single-slot `/api` interceptor to the Typert gateway.
  /** Serve one decoded endpoint from a JSON RPC envelope. */
  async function dispatchSkillManager(endpoint: string, payload: unknown): Promise<RpcResult<unknown>> {
    const request = (payload ?? {}) as Record<string, unknown>
    try {
      let value: unknown
      switch (endpoint) {
        case 'list': value = await service.list(request as unknown as SkillManagerListRequest); break
        case 'files': value = await service.files(request as unknown as SkillManagerFilesRequest); break
        case 'read': value = await service.read(request as unknown as SkillManagerReadRequest); break
        case 'write': value = await service.write(request as unknown as SkillManagerWriteRequest); break
        case 'importSkill': value = await service.importSkill(request as unknown as SkillManagerImportRequest); break
        case 'exportSkill': value = await service.exportSkill(request as unknown as SkillManagerExportRequest); break
        case 'deleteSkill': value = await service.deleteSkill(request as unknown as SkillManagerDeleteRequest); break
        case 'toggleSkill': value = await service.toggleSkill(request as unknown as SkillManagerToggleRequest); break
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使Skill目录管理的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最关键问题是导入是否保存完整技能树。归属映射只给SKILL.md及顶层md填值，提取循环对每一entry查map并跳过undefined，因此多层资源不随SKILL.md提取；未经执行只报告静态推导。可借鉴canonical边界、zip展开预算与同yaml parser校验，不能把这些保护当完整迁移验证；直接覆盖写入亦缺事务回滚。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1028-1035](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L1028-L1035)

只有技能入口/顶层md建立归属映射

```text
        const fileName = parts[parts.length - 1] ?? ''
        if (fileName === 'SKILL.md') {
          // <name>/SKILL.md → skill name; bare SKILL.md → read the frontmatter name.
          if (parts.length >= 2) skillNameByEntry.set(normalizedPath, parts[0]!)
          else skillNameByEntry.set(normalizedPath, '')
        } else if (parts.length === 1 && fileName.endsWith('.md')) {
          // A single loose .md file is a one-file skill named after the file.
          skillNameByEntry.set(normalizedPath, fileName.slice(0, -3))
```

**依据 2 · 源码核查**：[src/index.ts:1057-1078](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L1057-L1078)

每entry查归属，附属文件被跳过

<details>
<summary>查看原文（22行）</summary>

```text
      await nodeMkdir(targetDir, { recursive: true })
      // Extract every normalized entry belonging to an imported skill.
      const seen = new Set<string>()
      for (const [entryPath, data] of normalized) {
        const parts = entryPath.split('/').filter(Boolean)
        const skillName = skillNameByEntry.get(entryPath)
        if (skillName === undefined || !imported.includes(skillName)) continue
        // A single top-level file (bare SKILL.md or <name>.md) becomes the
        // skill's own file inside <skill>/.
        if (parts.length === 1) {
          const outPath = nodeJoinSafe(targetDir, `${skillName}/${parts[0]}`)
          if (outPath === undefined) continue
          await nodeMkdir(outPath.split('/').slice(0, -1).join('/'), { recursive: true })
          await nodeWriteFile(outPath, data)
          continue
        }
        const outPath = nodeJoinSafe(targetDir, entryPath)
        if (outPath === undefined) continue
        if (seen.has(entryPath)) continue
        seen.add(entryPath)
        await nodeMkdir(outPath.split('/').slice(0, -1).join('/'), { recursive: true })
        await nodeWriteFile(outPath, data)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:991-1007](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L991-L1007)

解压前尺寸与条目上限

<details>
<summary>查看原文（17行）</summary>

```text
      if (request.zipBase64.length > 8 * 1024 * 1024) {
        throw new Error('uploaded package exceeds the 8 MB size limit')
      }
      const bytes = Buffer.from(request.zipBase64, 'base64')
      let seenEntries = 0
      let declaredBytes = 0
      const entries = unzipSync(new Uint8Array(bytes), {
        filter(entry) {
          seenEntries += 1
          if (seenEntries > MAX_ZIP_ENTRIES) {
            throw new Error(`uploaded package has too many entries (${seenEntries} > ${MAX_ZIP_ENTRIES})`)
          }
          declaredBytes += entry.originalSize
          if (declaredBytes > MAX_ZIP_BYTES) {
            throw new Error(`uploaded package expands beyond the ${Math.round(MAX_ZIP_BYTES / 1024 / 1024)} MB limit`)
          }
          return true
```

</details>

#### 缺口

- 附属资源丢失与宿主重载尚未运行复现
  **影响**：复杂技能导入可靠性不能通过
  **进一步探讨**：以含脚本/引用的最小zip逐文件往返比对，并观察宿主registry

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次成本为安装、宿主接口对齐和目录备份；持续成本是扫描、压缩与人工审内容；失败恢复需要还原被覆盖/删除文件，当前删除是recursive rm没有回收站。无额外模型调用不代表零总成本，时间和资源实测均未知。效果只支持可视操作和格式门，语义正确及资源完整仍需验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:393-396](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L393-L396)

树和zip预算

```text
/** Cap on file-tree nodes and on zip entries, guarding against unbounded memory use. */
const MAX_TREE_NODES = 5000
const MAX_ZIP_ENTRIES = 2000
const MAX_ZIP_BYTES = 100 * 1024 * 1024
```

**依据 2 · 源码核查**：[src/index.ts:1097-1104](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L1097-L1104)

直接递归删除

```text
    async deleteSkill(request) {
      // Only writable skill directories (project/user) may be deleted. The
      // request names the skill directory itself, so it matches the prefix
      // exactly (or sits under it). The path is canonicalized first so `..`
      // segments and symlinks cannot make node:rm delete outside the whitelist.
      const key = await assertInside(request.path, writableSkillDirs, 'delete', 'writable')
      await nodeRm(key, { recursive: true, force: true })
      return { ok: true }
```

**依据 3 · 源码核查**：[src/index.ts:948-955](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L948-L955)

校验只限制SKILL.md格式

```text
      if (key.split(/[\\/]/).pop() === 'SKILL.md') {
        const problems = validateSkillDocument(request.content)
        if (problems.length > 0) {
          throw new Error('SKILL.md 校验未通过，未写入：\n- ' + problems.join('\n- '))
        }
      }
      const target = await fs.resolve(key)
      await fs.writeText(target, request.content)
```

#### 缺口

- 操作工时和恢复成功率未量化
  **影响**：不能证明比文件管理器更省成本
  **进一步探讨**：对照完整技能的编辑/迁移/恢复任务，计入人工复核

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从文件读写、目录隔离与宿主更新的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

假设为manifest驱动的暂存导入：完整归属每个文件、拒绝冲突或备份旧树、校验后一次rename，并提供可对照的摘要。依据是当前入口映射与逐文件直写之间的缺口；对照原版测试多目录、碰撞、非法frontmatter和写中断，缺文件、越界或恢复失败均推翻改进主张。此方案未实现，代价为暂存空间及失败清理。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1046-1078](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L1046-L1078)

当前发现入口后逐文件直写流程

<details>
<summary>查看原文（33行）</summary>

```text
      const imported: string[] = []
      const validName = (name: string): boolean => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)
      for (const name of skillNameByEntry.values()) {
        if (!validName(name)) continue
        if (imported.includes(name)) continue
        imported.push(name)
      }
      if (imported.length === 0) {
        const sample = [...normalized.keys()].slice(0, 5).join(', ')
        throw new Error(`no valid skills found in the uploaded package (expected <skill>/SKILL.md entries); archive contains: ${sample || '(empty)'}`)
      }
      await nodeMkdir(targetDir, { recursive: true })
      // Extract every normalized entry belonging to an imported skill.
      const seen = new Set<string>()
      for (const [entryPath, data] of normalized) {
        const parts = entryPath.split('/').filter(Boolean)
        const skillName = skillNameByEntry.get(entryPath)
        if (skillName === undefined || !imported.includes(skillName)) continue
        // A single top-level file (bare SKILL.md or <name>.md) becomes the
        // skill's own file inside <skill>/.
        if (parts.length === 1) {
          const outPath = nodeJoinSafe(targetDir, `${skillName}/${parts[0]}`)
          if (outPath === undefined) continue
          await nodeMkdir(outPath.split('/').slice(0, -1).join('/'), { recursive: true })
          await nodeWriteFile(outPath, data)
          continue
        }
        const outPath = nodeJoinSafe(targetDir, entryPath)
        if (outPath === undefined) continue
        if (seen.has(entryPath)) continue
        seen.add(entryPath)
        await nodeMkdir(outPath.split('/').slice(0, -1).join('/'), { recursive: true })
        await nodeWriteFile(outPath, data)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:349-390](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L349-L390)

可复用的格式校验门

<details>
<summary>查看原文（42行）</summary>

```text
export function validateSkillDocument(content: string): string[] {
  const lines = content.split('\n')
  if ((lines[0] ?? '').replace(/\r$/, '') !== '---') {
    return ['frontmatter 必须以单独一行 `---` 开头（Harness 靠它解析 name/description）']
  }
  let closing = -1
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].replace(/\r$/, '') === '---') {
      closing = index
      break
    }
  }
  if (closing < 0) return ['frontmatter 缺少结束的 `---` 行']
  let data: unknown
  try {
    data = parseYaml(lines.slice(1, closing).join('\n'))
  } catch (error) {
    const position = (error as { linePos?: { line: number; col: number }[] }).linePos?.[0]
    const where = position === undefined ? '' : `（第 ${position.line} 行第 ${position.col} 列）`
    const reason = error instanceof Error ? error.message.split('\n')[0] : String(error)
    return [
      `frontmatter 不是合法 YAML${where}：${reason}`,
      '最常见的原因：值里出现「冒号+空格」（例如 `github: ` / `link: ` / `location: `）。'
      + 'YAML 会把它当成映射分隔符，整个技能会被丢弃。给这个值加双引号、并把内部的双引号转义即可。',
    ]
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return ['frontmatter 必须是键值映射（至少含 name 与 description）']
  }
  const record = data as Record<string, unknown>
  const problems: string[] = []
  const name = record.name
  const description = record.description
  if (typeof name !== 'string' || name.trim() === '') {
    problems.push('缺少 name（必须是字符串）')
  } else if (!SKILL_NAME.test(name)) {
    problems.push(`name「${name}」不合法：只允许小写字母、数字与连字符，例如 writing-skills`)
  }
  if (typeof description !== 'string' || description.trim() === '') {
    problems.push('缺少 description（必须是字符串）')
  }
  return problems
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用Skill目录管理，何时应停止？

**研究主题**：采用判断

#### 完整回答

建议观察，用户若只是查看和编辑，可在备份低风险技能后受控评估；依赖复杂脚本资源的批量迁移用户应等导入完整性修复。成功必须是文件树与原包一致、系统目录仍只读、宿主能加载；出现资源缺失、错误工作区或删除不可恢复就停用并还原备份。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1057-1078](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L1057-L1078)

导入完整性影响迁移建议

<details>
<summary>查看原文（22行）</summary>

```text
      await nodeMkdir(targetDir, { recursive: true })
      // Extract every normalized entry belonging to an imported skill.
      const seen = new Set<string>()
      for (const [entryPath, data] of normalized) {
        const parts = entryPath.split('/').filter(Boolean)
        const skillName = skillNameByEntry.get(entryPath)
        if (skillName === undefined || !imported.includes(skillName)) continue
        // A single top-level file (bare SKILL.md or <name>.md) becomes the
        // skill's own file inside <skill>/.
        if (parts.length === 1) {
          const outPath = nodeJoinSafe(targetDir, `${skillName}/${parts[0]}`)
          if (outPath === undefined) continue
          await nodeMkdir(outPath.split('/').slice(0, -1).join('/'), { recursive: true })
          await nodeWriteFile(outPath, data)
          continue
        }
        const outPath = nodeJoinSafe(targetDir, entryPath)
        if (outPath === undefined) continue
        if (seen.has(entryPath)) continue
        seen.add(entryPath)
        await nodeMkdir(outPath.split('/').slice(0, -1).join('/'), { recursive: true })
        await nodeWriteFile(outPath, data)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:936-956](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts#L936-L956)

单文件编辑的可控边界

<details>
<summary>查看原文（21行）</summary>

```text
    async write(request) {
      // Only paths inside a non-read-only skill directory (collected by the
      // last catalog read) may be written; system/bundled and unknown paths
      // are refused before touching the filesystem. The path is canonicalized
      // first so `..` segments and symlinks cannot escape the whitelist.
      const key = await assertInside(request.path, writableSkillDirs, 'write to', 'writable')
      const fs = fsOf()
      if (fs === undefined) throw new Error('filesystem service is unavailable')
      // Save-time gate for SKILL.md: the Harness drops a skill whose frontmatter
      // does not parse, with nothing but a host-stdout warning, so an unvalidated
      // save can make a whole skill disappear from every agent's catalog. Other
      // files in the directory (references, scripts) are written as-is.
      if (key.split(/[\\/]/).pop() === 'SKILL.md') {
        const problems = validateSkillDocument(request.content)
        if (problems.length > 0) {
          throw new Error('SKILL.md 校验未通过，未写入：\n- ' + problems.join('\n- '))
        }
      }
      const target = await fs.resolve(key)
      await fs.writeText(target, request.content)
      return { ok: true }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
