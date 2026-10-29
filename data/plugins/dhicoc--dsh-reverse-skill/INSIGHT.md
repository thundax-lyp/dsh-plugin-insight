# DSH Reverse Skill

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f1b61cf](https://github.com/dhicoc/dsh-reverse-skill/tree/f1b61cf3deec370198ae81a23b8512338002d073)

<!-- BEGIN META -->
[![GitHub ★ 306](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=306&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dhicoc/dsh-reverse-skill) [![npm 30d 2,563](https://img.shields.io/static/v1?label=npm+30d&message=2%2C563&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dhicoc/dsh-reverse-skill) [![最新发布 2026-08-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dhicoc/dsh-reverse-skill)
<!-- END META -->

> **功能**：将上游逆向与安全研究技能目录递归注册进 DSH skills 服务的适配插件。

> **亮点**：提供DSH递归发现、生命周期和partial语义适配，研究技术来自上游，技能数量不是效果证据。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：provider不执行路由/授权/权限约束，未投影的frontmatter被get剥离；Windows/Bash入口均存在，但tool-index及领域环境需本机生成/准备，正常list不代表任务就绪。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 是内容封装还是执行Agent，谁有什么增量？](#detail-section-11)
  - [Q02 · scanner/provider怎样装载，约束是否执行？](#detail-section-12)
  - [Q03 · 实际一条技能流程需要哪些依赖与工程维护？](#detail-section-13)
  - [Q04 · 如何计算试用成本和验收，哪些方向值得验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有授权范围及已有领域工具的安全研究者，需要在DSH发现根路由和嵌套技能；不是自动完成研究的Agent。见[Q01](#research-q01)。

直接读上游技能或挂customSkillDirs，手工找嵌套入口和资源。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 递归发现 | 根和嵌套技能进入DSH候选 | 不代表全部内容质量验证 |
| 完整性/生命周期 | 目录partial不缓存，signal停止遍历 | 单文件读错仍可失败 |
| 按需正文 | get提供技能资源基目录 | frontmatter其它字段不强制权限 |
| 路由工作流 | 通过正文/Bash指向领域路线 | 需本机工具与授权，非独立执行引擎 |

**流程与依赖**

宿主契约、资源目录、shell/Python与所选领域工具分开准备；表见[Q04](#research-q04)。

先核资源和离线样本，再list/get、路由与真实证据回读，未就绪退回选定技能手工分析；表见[Q04](#research-q04)。

**效果与成本**

模型、工具准备与路由/内容校对成本未知，退出不撤脚本环境变更；阶段表见[Q04](#research-q04)。

发现接线有依据；误路由、分析正确率与节时未知，不能按数量推断；效果见[Q04](#research-q04)。

> **思考**：provider不执行路由/授权/权限约束，未投影的frontmatter被get剥离；Windows/Bash入口均存在，但tool-index及领域环境需本机生成/准备，正常list不代表任务就绪。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：提供DSH递归发现、生命周期和partial语义适配，研究技术来自上游，技能数量不是效果证据。见[Q01](#research-q01)、[Q02](#research-q02)。

partial目录不缓存、注册生命周期与resourceBase值得迁移；文件读错仍可抛异常、完整缓存不热更新，文档路由和宿主权限需分开验。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

provider不执行路由/授权/权限约束，未投影的frontmatter被get剥离；Windows/Bash入口均存在，但tool-index及领域环境需本机生成/准备，正常list不代表任务就绪。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察。有授权且工具成熟的研究者可主动在隔离宿主/已知离线样本验根与嵌套get、实际资源路径及证据；缺资源、路径未知或无证据结论时停止自动链，退回直接读技能/手工分析。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生provider、发现/缓存/正文路径有源码依据；全部技能质量、宿主版本兼容和任务成果未独立执行。当前观察，假设不计入现有效果。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、src/index.ts、lib/index.js、skills/SKILL.md、skills/ghidra-reverse/SKILL.md、skills/scripts/master-route.sh、skills/scripts/case-init.sh、skills/scripts/refresh-tool-index.sh、skills/scripts/bootstrap-reverse.sh、skills/scripts/master-route.ps1、skills/scripts/case-init.ps1、skills/scripts/bootstrap-reverse.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整阅读src provider并核lib对应链；检查根路由、Ghidra代表技能、Bash路由与case-init关键段、索引和bootstrap安装路径，并经固定git show检查三份未物化PowerShell入口关键链。不声称通读88技能，不执行安全脚本、安装或目标任务。
- 下一步：后续在临时宿主验证目录partial、单文件错误、卸载取消、块描述与平台资源，再做已知离线样本路由和成果回读。

**分析版本**

- **仓库**：[dhicoc/dsh-reverse-skill](https://github.com/dhicoc/dsh-reverse-skill)
- **版本号**：1.2.0（[固定提交 f1b61cf](https://github.com/dhicoc/dsh-reverse-skill/tree/f1b61cf3deec370198ae81a23b8512338002d073)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是技能打开前的环境/资源就绪清单，以离线样本比较误启动、准备与纠错；普通链接检查足够则止于共享工具。见[Q04](#research-q04)。

后续在临时宿主验证目录partial、单文件错误、卸载取消、块描述与平台资源，再做已知离线样本路由和成果回读。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 154 | 121 | 16 | — |
| .md | source | 409 | 119460 | — | — | 737651 |
| .js | source | 1 | 265 | 183 | 82 | — |
| .ts | source | 1 | 297 | 198 | 82 | — |

</details>

**活跃度**

[![Issue 未关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/dhicoc/dsh-reverse-skill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=737b86&logo=github)](https://github.com/dhicoc/dsh-reverse-skill/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/dhicoc/dsh-reverse-skill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：内容封装如何变成可选技能，任务就绪和宿主约束差距在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 是内容封装还是执行Agent，谁有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是有真实apply与bundle的DSH插件，主要工作是把上游安全研究Skill目录装入宿主skills服务。apply只registerProvider，未实现自己的模型循环、子Agent队列或测试工具执行器。用户可以从路由技能选领域，然后由现有宿主模型/工具执行文档里的流程；88是作者的打包规模说明，不是88项能力独立验收，也不证明安全任务完成率。

目标是有授权范围、已有安全工具环境的逆向/安全研究者，需要少手工寻找/挂载嵌套技能。基线是直接读上游Skill或用customSkillDirs，再人工确认资源路径。增量是递归注册含根路由/嵌套条目、修正BOM/CRLF与块描述、给资源目录定位，使DSH能选用内容。安全技术内容来自上游，不能把所有逆向方法视作封装者原创。

路由正文要求平台router→case-init→PRIMARY技能，并以scope和证据流程约束工作。它是程序辅助的文档路线，而非插件强制执行这串动作。即使provider正常列出技能，实际Agent是否遵守、外部工具是否可用、报告结论是否有证据，仍需另验。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:289-297](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/src/index.ts#L289-L297)

apply只注册provider。

```text
/** Cordis plugin name. */
export const name = 'reverse-skill'
/** Service required by this provider. */
export const inject = ['skills']

/** Register the bundled reverse-skill provider on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider((control) => createProvider(control))
}
```

**依据 2 · 源码核查**：[src/index.ts:237-265](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/src/index.ts#L237-L265)

候选列表与invocation。

<details>
<summary>查看原文（29行）</summary>

```text
    const candidates = [...skills.items, ...ctf.items].map(({ path, fm }) => {
      const userInv = fm['user-invocable']
      return {
        name: fm['name'],
        description: fm['description'] ?? '',
        invocation: {
          modelInvocable: true,
          userInvocable: userInv === undefined ? true : userInv !== 'false',
        },
        provider: PROVIDER_NAME,
        source: 'bundled',
        resourceBase: { kind: 'directory', path: dirname(path) },
        path,
        rank: 0,
        locator: pathToFileURL(path),
      } as SkillCandidate
    })
    const catalog: Catalog = { candidates, complete: skills.complete && ctf.complete }
    // Only memoize a trustworthy catalog; a partial walk is retried on the next list().
    if (catalog.complete) cache = catalog
    return catalog
  }

  return {
    name: PROVIDER_NAME,
    async list(options: SkillLookupOptions = {}): Promise<SkillProviderObservation> {
      throwIfAborted(control.signal, options)
      const catalog = await build(options)
      return { candidates: catalog.candidates, complete: catalog.complete }
```

</details>

**依据 3 · 源码核查**：[skills/SKILL.md:1-20](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/SKILL.md#L1-L20)

路由工作契约。

<details>
<summary>查看原文（20行）</summary>

```text
---
name: reverse-skill-router
description: Routes reverse engineering, exploitation, penetration testing, malware, mobile, firmware, browser automation, documentation, and security tasks to the appropriate specialist skill. Use when a task spans modules or the correct reverse-skill entrypoint is unclear.
---
# Reverse Engineering Skills Master Control

本目录收录了一系列逆向工程相关的技能模块，每个子目录是一个独立模块，内含 `SKILL.md` 描述其适用场景、工具链和工作流程。

## CRITICAL: 路由执行契约（必须立即执行）

读完本文件后，不允许只回复“已读/已理解”。必须按顺序执行：

1. `NOW`：跑平台原生 router（Windows `scripts/master-route.ps1`；Linux/macOS/Kali `scripts/master-route.sh`），从 `config/routing.json` 定 PRIMARY；疑难再读 `routing.md` 三轴附录。
2. `NOW`：平台原生 `case-init` 落地当前分析项目的 `work/<case>/scope.md`；**auth 未 granted 禁止对目标 ACT**。本地离线样本使用 `offline-sample` preset + explicit sample；Force 不得绕过硬门。
3. `ACT`：立即打开 PRIMARY `SKILL.md` 执行 ACTION REQUIRED。
4. `NEXT`：工具路径只认 `tool-index.md`；缺工具 → 平台原生 bootstrap（仅 manifest）。
5. 结论用 Evidence→Finding→Path。报告/journal 是 SHOULD，除非用户要交付物。

**身份**：见 `ops/IDENTITY.md`（轻量路由包 + 工具自举 + journal；**不是** Z3r0 式平台）。

```

</details>

**依据 4 · 源码核查**：[README.md:14-18](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/README.md#L14-L18)

上游内容封装说明。

```text

> **reverse-skill 的完整 DeepSeek Harness（dsh）插件版。**
> 把上游 [`zhaoxuya520/reverse-skill`](https://github.com/zhaoxuya520/reverse-skill)（27k★，MIT）全部 **88 个 SKILL.md** 原样封装成一个 dsh Cordis 插件，随包分发、随插件加载，无需手动维护候选清单。

---
```

#### 缺口

- 未做真实授权样本任务对比
  **影响**：不能根据技能数量判断任务准确度或节时
  **进一步探讨**：用本地已知样本对比直接挂目录与provider路径的误路由/纠错。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · scanner/provider怎样装载，约束是否执行？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

模块从import.meta.url解析skills及CTF根，非file URL解析失败保留undefined；遍历目录失败标complete:false，不缓存截断目录，下一次list重试。完整目录只在本次registration闭包缓存；dispose或调用signal会在遍历/list/get入口检查。该完整性机制可以借鉴，但readFile失败没有按条目转换partial，会直接使调用失败，不应说任何缺资源都能优雅返回部分列表。

首次list递归readFile每个SKILL.md解析name/description，构造resourceBase为该技能所在目录、locator为文件URL。get再读目标文件，返回去掉前导matter的body。因而是正文按需交给模型，不是首次发现完全不读正文；并且完整目录缓存期间不invalidate，文件增删需重新注册，已有候选摘要与get新正文可短暂不同步。

元数据解析器只把少数信息投影到candidate：modelInvocable固定true，userInvocable缺失默认true，仅字符串false关闭用户调用；metadata.user-invocable还会覆盖顶层。allowed-tools/disallowed-tools没有变成工具权限。更具体地，parseFrontmatter把整个frontmatter从body剥掉，get只返回body，故README“其余字段作为技能正文一并返回”不符合此链：这些字段可以被解析到内部fm，但没有返回到SkillDefinition，也不会由此实现限制。正文里的授权scope只是模型/脚本流程，不是这个provider提供的宿主级安全沙箱。

get直接接受宿主传入的candidate.path/locator读取，没另做“必须位于两个根内”的校验；候选来源可信与调用边界由宿主registry管理，本轮没有构造外部候选测试，不能据此宣布宿主可被任意读文件。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:58-78](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/src/index.ts#L58-L78)

根解析与生命周期检查。

<details>
<summary>查看原文（21行）</summary>

```text
// #9). A resolved-but-missing root still yields a partial observation, so the
// registry never caches it as authoritative; an unresolvable root disables
// that root's discovery the same way.
function resolveBundledRoot(relative: string): string | undefined {
  try {
    return fileURLToPath(new URL(relative, import.meta.url))
  } catch {
    return undefined
  }
}
const SKILLS_ROOT = resolveBundledRoot('../skills')
const CTF_ROOT = resolveBundledRoot('../CTF-Sandbox-Orchestrator')

const PROVIDER_NAME = 'reverse-skill'

/**
 * Stop discovery when either the registration or the caller has been cancelled,
 * so a disposed plugin or a superseded lookup cannot keep walking the tree.
 */
function throwIfAborted(registration: AbortSignal, options: SkillLookupOptions): void {
  if (registration.aborted) throw registration.reason
```

</details>

**依据 2 · 源码核查**：[src/index.ts:132-175](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/src/index.ts#L132-L175)

frontmatter剥离与元数据读取。

<details>
<summary>查看原文（44行）</summary>

```text
function parseFrontmatter(text: string): { fm: Record<string, string>; body: string } {
  // Strip an optional UTF-8 BOM and normalize CRLF -> LF so the delimiter search
  // and line regex are consistent across editor encodings and Windows checkouts.
  const src = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  if (!src.startsWith('---')) return { fm: {}, body: text }
  const end = src.indexOf('\n---', 3)
  if (end === -1) return { fm: {}, body: text }
  const fmText = src.slice(3, end)
  const body = src.slice(end + 4)
  const fm: Record<string, string> = {}
  let metaUserInvocable: string | undefined
  const lines = fmText.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === 'metadata:') {
      let j = i + 1
      while (j < lines.length && /^\s/.test(lines[j])) {
        const m = lines[j].match(/user-invocable:\s*"?([^"\n]+)"?/)
        if (m) metaUserInvocable = m[1].trim()
        j++
      }
      i = j - 1
      continue
    }
    const m = line.match(/^([A-Za-z0-9_-]+):[ \t]*(.*)$/)
    if (m) {
      const key = m[1]
      const value = m[2].trim()
      if (BLOCK_SCALAR.test(value)) {
        const block = readBlockScalar(lines, i + 1, value[0])
        fm[key] = block.value
        i = block.next - 1
        continue
      }
      fm[key] = value.replace(/^["']|["']$/g, '')
    }
  }
  if (metaUserInvocable !== undefined) fm['user-invocable'] = metaUserInvocable
  return { fm, body }
}

interface Collected {
  path: string
  fm: Record<string, string>
```

</details>

**依据 3 · 源码核查**：[src/index.ts:180-210](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/src/index.ts#L180-L210)

目录失败partial，文件读取直接抛错。

<details>
<summary>查看原文（31行）</summary>

```text
async function collect(
  root: string,
  registration: AbortSignal,
  options: SkillLookupOptions,
): Promise<{ items: Collected[]; complete: boolean }> {
  const items: Collected[] = []
  let complete = true
  async function walk(dir: string): Promise<void> {
    throwIfAborted(registration, options)
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      // An unreadable directory means this catalog is a partial view; surface that
      // through the observation instead of pretending discovery succeeded.
      complete = false
      return
    }
    for (const e of entries) {
      throwIfAborted(registration, options)
      const p = join(dir, e.name)
      if (e.isDirectory()) await walk(p)
      else if (e.name === 'SKILL.md') {
        const text = await readFile(p, 'utf8')
        const { fm, body } = parseFrontmatter(text)
        if (fm['name']) items.push({ path: p, fm, body })
      }
    }
  }
  await walk(root)
  return { items, complete }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:223-284](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/src/index.ts#L223-L284)

缓存、candidate和get输出。

<details>
<summary>查看原文（62行）</summary>

```text
function createProvider(control: SkillProviderControl): SkillProvider {
  let cache: Catalog | null = null

  async function build(options: SkillLookupOptions): Promise<Catalog> {
    if (cache !== null) return cache
    const registration = control.signal
    // An unresolvable root (non-file: loader URL) reads as incomplete discovery
    // for that root only — never as an authoritative empty catalog.
    const skills = SKILLS_ROOT === undefined
      ? { items: [], complete: false }
      : await collect(SKILLS_ROOT, registration, options)
    const ctf = CTF_ROOT === undefined
      ? { items: [], complete: false }
      : await collect(CTF_ROOT, registration, options)
    const candidates = [...skills.items, ...ctf.items].map(({ path, fm }) => {
      const userInv = fm['user-invocable']
      return {
        name: fm['name'],
        description: fm['description'] ?? '',
        invocation: {
          modelInvocable: true,
          userInvocable: userInv === undefined ? true : userInv !== 'false',
        },
        provider: PROVIDER_NAME,
        source: 'bundled',
        resourceBase: { kind: 'directory', path: dirname(path) },
        path,
        rank: 0,
        locator: pathToFileURL(path),
      } as SkillCandidate
    })
    const catalog: Catalog = { candidates, complete: skills.complete && ctf.complete }
    // Only memoize a trustworthy catalog; a partial walk is retried on the next list().
    if (catalog.complete) cache = catalog
    return catalog
  }

  return {
    name: PROVIDER_NAME,
    async list(options: SkillLookupOptions = {}): Promise<SkillProviderObservation> {
      throwIfAborted(control.signal, options)
      const catalog = await build(options)
      return { candidates: catalog.candidates, complete: catalog.complete }
    },
    async get(
      candidate: SkillCandidate,
      options: SkillLookupOptions = {},
    ): Promise<SkillDefinition | undefined> {
      throwIfAborted(control.signal, options)
      const source = candidate.path ?? candidate.locator
      const text = await readFile(source as string | URL, 'utf8')
      const { body } = parseFrontmatter(text)
      return {
        name: candidate.name,
        description: candidate.description,
        invocation: candidate.invocation,
        provider: candidate.provider,
        source: candidate.source,
        resourceBase: candidate.resourceBase,
        path: candidate.path,
        content: body,
      } as SkillDefinition
```

</details>

**依据 5 · 源码核查**：[README.md:131-137](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/README.md#L131-L137)

作者限制及其它字段正文说法。

```text
## 已知限制（诚实告知）

- **`agents/*.yaml` 不可移植**：上游 43 个 OpenAI Agents SDK 的 agent 定义无法映射到 dsh 的 `ctx.subagent`（dsh 仅支持拉起 Codex / Claude Code CLI）。这些 agent 定义未纳入插件。
- **`allowed-tools` / `disallowed-tools` 不被 dsh 强制**：dsh 当前把这两项视为未知字段，延迟执行。技能内的工具约束需自行在 harness 层保证。
- **前导 matter 仅依赖 `name` / `description` / `user-invocable`**：本仓库 scanner 只读这三个字段，上游原始文件原样打包（CRLF / BOM 在运行时归一化），无需改写；其余字段作为技能正文一并随 `get()` 返回。
- **MCP 工具（如 burp-mcp）需另行配置**：技能正文里引用的外部 MCP server 不在本插件范围内，请按 dsh 的 `mcp.servers` 自行接入。
- **文档链接已重写**：正文内相对链接已改为 `../`（及 CTF 相关为 `../../CTF-Sandbox-Orchestrator/`），以适配 dsh 扁平挂载路径。
```

#### 缺口

- 目标DSH版本非file加载、卸载取消和候选信任边界未执行
  **影响**：不能认定宿主兼容/权限隔离已通过
  **进一步探讨**：隔离环境验证missing root、单文件读取失败、dispose及宿主candidate来源。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 实际一条技能流程需要哪些依赖与工程维护？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

最小插件启动需兼容Cordis/skills契约与包内目录；完整任务另需shell/Python、样本和选中领域工具/MCP。以Ghidra技能为例，它要求读field-journal、查tool-index、导入真实样本并导出函数/地址；没有Ghidra或MCP时注册成功也不能反编译。

Bash master-route确实读取routing.json，以关键词规则计分再按priority选PRIMARY，无命中fallback并提示低信心。这是确定性路由启发式，不是模型理解任务或已验证最佳路线。case-init会在当前project/work下建evidence/notes/report和scope等材料；offline-sample/ctf/own-system preset设置授权元数据，不是独立审查用户真的拥有授权。真实范围必须由用户和宿主权限确认。

包内tool-index不是已提供的本机事实：固定git tree跟踪的是tool-index.md.template，refresh-tool-index.sh默认生成当前本机索引并探测路径/版本，不能照抄上游机器端口。必须区分sparse checkout与包内真实清单：本轮本机未物化.ps1不代表仓库缺失。固定git show确认Windows master-route.ps1、case-init.ps1和bootstrap-reverse.ps1均存在；前者读同一routing.json按规则/priority选PRIMARY并写项目route-scope，case-init解析项目根/样本和preset后建work及授权元数据，bootstrap按manifest解析能力并有安装/服务路径。三份关键链有源码依据，不能再称Windows入口缺文件；它们仍不是本轮Windows实际运行验收。

bootstrap脚本具备apt/brew/pip等安装/启动路径，插件apply本身不会自动安装它们，但Agent遵从技能后可能触发环境变更。停用provider不会撤销已装工具、服务、work目录或外部分析输出。可借鉴资源目录定位、partial不缓存与注册生命周期绑定；升级要同时检查内容链接、路由和工具环境，不只数SKILL.md。

#### 证据与依据

**依据 1 · 源码核查**：[skills/ghidra-reverse/SKILL.md:8-19](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/ghidra-reverse/SKILL.md#L8-L19)

领域工具和资源依赖。

<details>
<summary>查看原文（12行）</summary>

```text
## ACTION REQUIRED（读完后立刻执行）

1. `NOW`: 读取 `../field-journal/precedent-reverse.md`
2. `NOW`: 确认需要 **Ghidra**（无 IDA / 偏好开源 / 批量 headless）
3. `NEXT`: 读 `../tool-index.md` 查 ghidra / ghidra-mcp 路径
4. `NEXT`: 缺工具 → bootstrap `ghidra-mcp`（若 manifest 支持）或按手动步骤装 Ghidra
5. `ACT`: 导入样本 → 自动分析 → 导出关键函数反编译

## 适用场景

- 无 IDA 许可证时的主逆向入口
- 批量 headless 分析 / CI 中反编译
```

</details>

**依据 2 · 源码核查**：[skills/scripts/master-route.sh:27-55](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/master-route.sh#L27-L55)

路由配置和Python依赖。

<details>
<summary>查看原文（29行）</summary>

```text
SKILLS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PACKAGE_ROOT="$(cd "$SKILLS_ROOT/.." && pwd)"
CONFIG_PATH="$SKILLS_ROOT/config/routing.json"

PYTHON=""
for candidate in python3 python; do
  if command -v "$candidate" >/dev/null 2>&1; then
    PYTHON="$candidate"
    break
  fi
done
if [[ -z "$PYTHON" ]]; then
  echo 'ERROR: Python 3 is required by the Bash structured router.' >&2
  exit 2
fi
if [[ ! -f "$CONFIG_PATH" ]]; then
  echo "ERROR: routing config missing: $CONFIG_PATH" >&2
  exit 2
fi

# Match the PowerShell entrypoint: by default, route artifacts belong to the
# caller's current project rather than the installed reverse-skill package.
if [[ -z "$PROJECT_ROOT" ]]; then PROJECT_ROOT="$(pwd -P)"; fi
if [[ -z "$OUT_DIR" ]]; then
  OUT_DIR="$PROJECT_ROOT/work/master-route-$(date +%Y%m%d-%H%M%S)"
fi

"$PYTHON" - "$CONFIG_PATH" "$SKILLS_ROOT" "$PROJECT_ROOT" "$OUT_DIR" "$HINT" <<'PY'
import datetime
```

</details>

**依据 3 · 源码核查**：[skills/scripts/master-route.sh:86-127](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/master-route.sh#L86-L127)

关键词评分/priority与fallback。

<details>
<summary>查看原文（42行）</summary>

```text
    return bool(re.search(pattern, text, flags=re.IGNORECASE))

try:
    for route_id, route in routes.items():
        for rule in route.get("keywords", []):
            must = rule.get("must")
            hit = bool(must and matches(must))
            must_all = rule.get("mustAll") or []
            if isinstance(must_all, str):
                must_all = [must_all]
            if hit and any(not matches(pattern) for pattern in must_all):
                hit = False
            exclude = rule.get("exclude")
            if hit and exclude and matches(exclude):
                hit = False
            if hit:
                scores[route_id] = scores.get(route_id, 0) + 1
                if route_id not in selected_order:
                    selected_order.append(route_id)
except re.error as exc:
    print(f"ERROR: invalid regex in routing.json: {exc}", file=sys.stderr)
    raise SystemExit(2)

primary = None
max_score = -1
for route_id in priority:
    score = scores.get(route_id)
    if score is not None and score > max_score:
        primary = route_id
        max_score = score

notes = []
if primary is None:
    primary = fallback
    confidence = "low"
    notes.append("No strong keyword hit; open routing.md full matrix" if text else "Empty hint; provide task text")
else:
    confidence = "high" if len(selected_order) == 1 else "medium"

if primary not in routes:
    print(f"ERROR: fallback/primary route is missing: {primary}", file=sys.stderr)
    raise SystemExit(2)
```

</details>

**依据 4 · 源码核查**：[skills/scripts/case-init.sh:73-103](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/case-init.sh#L73-L103)

preset授权元数据。

<details>
<summary>查看原文（31行）</summary>

```text
    AUTH_GRANTED=1
    AUTH_STATUS="granted"
    AUTH_BASIS="own_system"
    NETWORK_PROFILE="${NETWORK_PROFILE:-offline}"
    EVIDENCE_OF_AUTH="${EVIDENCE_OF_AUTH:-preset:offline-sample (owner-operated local file)}"
    if [[ -n "$SAMPLE" ]]; then IN_SCOPE_ASSETS+=("$SAMPLE"); fi
    ;;
  ctf-public|ctf)
    AUTH_GRANTED=1
    AUTH_STATUS="granted"
    AUTH_BASIS="ctf_public"
    NETWORK_PROFILE="${NETWORK_PROFILE:-authorized_target_only}"
    EVIDENCE_OF_AUTH="${EVIDENCE_OF_AUTH:-preset:ctf-public}"
    ;;
  own-system|lab-only)
    AUTH_GRANTED=1
    AUTH_STATUS="granted"
    AUTH_BASIS="own_system"
    NETWORK_PROFILE="${NETWORK_PROFILE:-lab_only}"
    EVIDENCE_OF_AUTH="${EVIDENCE_OF_AUTH:-preset:own-system/lab}"
    ;;
  *)
    echo "ERROR: invalid --preset '$PRESET' (allowed: offline-sample|ctf-public|own-system)" >&2
    exit 2
    ;;
esac

if [[ -z "$CASE_NAME" ]]; then
  slug="$(printf '%s' "$HINT" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/^$/case/' | cut -c1-40)"
  CASE_NAME="$(date +%Y%m%d-%H%M%S)-${slug}"
fi
```

</details>

**依据 5 · 源码核查**：[skills/scripts/case-init.sh:127-133](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/case-init.sh#L127-L133)

project工作目录副作用。

```text
CASE_ROOT="$PROJECT_ROOT/work/$CASE_NAME"
mkdir -p "$CASE_ROOT/evidence" "$CASE_ROOT/notes" "$CASE_ROOT/report"

auth_status_resolved="pending"
if [[ $AUTH_GRANTED -eq 1 ]]; then auth_status_resolved="granted"; fi
if [[ -n "$AUTH_STATUS" ]]; then
  candidate="$(printf '%s' "$AUTH_STATUS" | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]')"
```

**依据 6 · 源码核查**：[skills/scripts/refresh-tool-index.sh:1-17](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/refresh-tool-index.sh#L1-L17)

工具索引默认生成路径。

<details>
<summary>查看原文（17行）</summary>

```text
#!/usr/bin/env bash
# refresh-tool-index.sh — generic Linux/macOS tool index refresh
#
# This script is intentionally detection-only. It does not install tools.
# Output defaults:
#   skills/tool-index.md
#   skills/tool-index.json

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SKILL_ROOT/.." && pwd)"

OUTPUT_MD="${1:-${SKILL_ROOT}/tool-index.md}"
OUTPUT_JSON="${2:-${SKILL_ROOT}/tool-index.json}"
GENERATED_AT="$(date '+%Y-%m-%d %H:%M:%S %z')"
```

</details>

**依据 7 · 源码核查**：[skills/scripts/bootstrap-reverse.sh:220-257](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/bootstrap-reverse.sh#L220-L257)

安装工具的实际分支。

<details>
<summary>查看原文（38行）</summary>

```text
install_apt() {
  local package="$1"
  log_info "apt install $package"
  sudo_cmd apt-get update -qq
  sudo_cmd apt-get install -y "$package"
}

install_brew() {
  local package="$1"
  if ! has_cmd brew; then
    log_err "Homebrew is required. Install it first: https://brew.sh/"
    return 1
  fi
  log_info "brew install $package"
  brew install "$package"
}

install_brew_cask() {
  local package="$1"
  if ! has_cmd brew; then
    log_err "Homebrew is required. Install it first: https://brew.sh/"
    return 1
  fi
  log_info "brew install --cask $package"
  brew install --cask "$package"
}

ensure_python_runtime() {
  ensure_python_interpreter || return 1
  local pipx_package pipx_version current_version
  pipx_package=$(manifest_dependency pipx package) || return 1
  pipx_version=$(manifest_dependency pipx version) || return 1
  current_version=""
  if has_cmd pipx; then
    current_version=$(pipx --version 2>/dev/null | head -n1 | tr -d '[:space:]')
  fi
  if [[ "$current_version" != "$pipx_version" ]]; then
    python3 -m pip install --user --upgrade "$pipx_package" || return 1
```

</details>

**依据 8 · 源码核查**：[skills/scripts/master-route.ps1:19-36](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/master-route.ps1#L19-L36)

Windows从同一routing.json读配置。

<details>
<summary>查看原文（18行）</summary>

```text
$packageRoot = Split-Path -Parent $skillsRoot
$configPath = Join-Path $skillsRoot 'config/routing.json'

# --- 读取路由配置（单一事实源） ---
if (-not (Test-Path -LiteralPath $configPath)) {
    Write-Host ("ERROR: routing config missing: {0}" -f $configPath) -ForegroundColor Red
    Write-Host 'Restore skills/config/routing.json (git checkout / git pull) and retry.' -ForegroundColor Yellow
    exit 2
}
try {
    $cfg = Get-Content -LiteralPath $configPath -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-Host ("ERROR: routing config is not valid JSON: {0}" -f $_.Exception.Message) -ForegroundColor Red
    exit 2
}

# --- 规则匹配：每条 keyword 规则命中则计入候选集（与旧版逐条 if 行为一致） ---
$sel = New-Object System.Collections.Generic.List[string]
```

</details>

**依据 9 · 源码核查**：[skills/scripts/master-route.ps1:105-125](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/master-route.ps1#L105-L125)

解析项目根并检查PRIMARY资源。

<details>
<summary>查看原文（21行）</summary>

```text
# 复用当前主线的项目工作根解析，避免把路由产物写进 skill 包。
$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path }
$skillsRoot = Split-Path -Parent $scriptDir
$packageRoot = Split-Path -Parent $skillsRoot
. (Join-Path (Join-Path $scriptDir 'lib') 'WorkRoot.ps1')
$projectRoot = Resolve-ReverseProjectRoot -RequestedRoot $ProjectRoot

if ([string]::IsNullOrWhiteSpace($OutDir)) {
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $workRoot = Join-Path $projectRoot 'work'
    $OutDir = Join-Path $workRoot ("master-route-{0}" -f $stamp)
}

$primaryPath = $cfg.routes.$primary.skill
$primaryLabel = $cfg.routes.$primary.label
$skillAbs = Join-Path $skillsRoot ($primaryPath -replace '/', [IO.Path]::DirectorySeparatorChar)
if (-not (Test-Path -LiteralPath $skillAbs)) {
    Write-Host ("ERROR: PRIMARY skill missing: {0}" -f $skillAbs) -ForegroundColor Red
    exit 2
}
```

</details>

**依据 10 · 源码核查**：[skills/scripts/case-init.ps1:55-80](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/case-init.ps1#L55-L80)

Windows样本校验及preset元数据。

<details>
<summary>查看原文（26行）</summary>

```text

# Cross-platform case presets. Keep semantics aligned with case-init.sh.
$presetNormalized = $Preset.Trim().ToLowerInvariant()
if ($presetNormalized -in @('offline-sample', 'own-sample', 'local-sample')) {
    $AuthGranted = $true
    $AuthStatus = 'granted'
    $AuthBasis = 'own_system'
    if ([string]::IsNullOrWhiteSpace($NetworkProfile)) { $NetworkProfile = 'offline' }
    if ([string]::IsNullOrWhiteSpace($EvidenceOfAuth)) {
        $EvidenceOfAuth = 'preset:offline-sample (owner-operated local file)'
    }
} elseif ($presetNormalized -in @('ctf-public', 'ctf')) {
    $AuthGranted = $true
    $AuthStatus = 'granted'
    $AuthBasis = 'ctf_public'
    if ([string]::IsNullOrWhiteSpace($NetworkProfile)) { $NetworkProfile = 'authorized_target_only' }
    if ([string]::IsNullOrWhiteSpace($EvidenceOfAuth)) { $EvidenceOfAuth = 'preset:ctf-public' }
} elseif ($presetNormalized -in @('own-system', 'lab-only')) {
    $AuthGranted = $true
    $AuthStatus = 'granted'
    $AuthBasis = 'own_system'
    if ([string]::IsNullOrWhiteSpace($NetworkProfile)) { $NetworkProfile = 'lab_only' }
    if ([string]::IsNullOrWhiteSpace($EvidenceOfAuth)) { $EvidenceOfAuth = 'preset:own-system/lab' }
} elseif (-not [string]::IsNullOrWhiteSpace($Preset)) {
    throw ("Invalid -Preset '{0}'. Allowed: offline-sample|ctf-public|own-system" -f $Preset)
}
```

</details>

**依据 11 · 源码核查**：[skills/scripts/case-init.ps1:103-130](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/case-init.ps1#L103-L130)

项目案例目录与授权字段。

<details>
<summary>查看原文（28行）</summary>

```text
$workRoot = Join-Path $projectRoot 'work'
$caseRoot = Join-Path $workRoot $CaseName
$dirs = @('evidence', 'notes', 'report')
New-Item -ItemType Directory -Force -Path $caseRoot | Out-Null
foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path (Join-Path $caseRoot $d) | Out-Null
}

# Resolve auth / network / assets
# Priority: explicit -AuthStatus (only if bound) > -AuthGranted > pending.
# Never let a stray positional string overwrite AuthGranted.
$authStatusResolved = 'pending'
if ($AuthGranted) { $authStatusResolved = 'granted' }
if ($PSBoundParameters.ContainsKey('AuthStatus') -and -not [string]::IsNullOrWhiteSpace($AuthStatus)) {
    $candidate = $AuthStatus.Trim().ToLowerInvariant()
    $allowedAuth = @('pending', 'granted', 'denied', 'unknown')
    if ($allowedAuth -contains $candidate) {
        $authStatusResolved = $candidate
    } else {
        Write-Host ("WARN: ignoring invalid -AuthStatus '{0}' (allowed: pending|granted|denied|unknown)" -f $AuthStatus) -ForegroundColor Yellow
        # if user also passed AuthGranted, keep granted; else stay pending
    }
}

$evidenceAuth = if (-not [string]::IsNullOrWhiteSpace($EvidenceOfAuth)) {
    $EvidenceOfAuth
} elseif ($AuthGranted -or $authStatusResolved -eq 'granted') {
    'cli-flag AuthGranted or AuthStatus=granted'
```

</details>

**依据 12 · 源码核查**：[skills/scripts/bootstrap-reverse.ps1:25-36](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/bootstrap-reverse.ps1#L25-L36)

Windows依赖及manifest能力解析。

<details>
<summary>查看原文（12行）</summary>

```text
. (Join-Path $PSScriptRoot 'lib\ToolDiscovery.ps1')
. (Join-Path $PSScriptRoot 'lib\BootstrapSupplyChain.ps1')

function Get-BootstrapDependency {
    param([Parameter(Mandatory = $true)][string]$Name)

    $manifest = Get-Content -LiteralPath (Get-ReverseBootstrapManifestPath) -Raw -Encoding UTF8 | ConvertFrom-Json
    $dependency = $manifest.bootstrapDependencies.PSObject.Properties[$Name].Value
    if ($null -eq $dependency -or [string]::IsNullOrWhiteSpace([string]$dependency.package) -or [string]::IsNullOrWhiteSpace([string]$dependency.version)) {
        throw "bootstrapDependencies.$Name must define package and version."
    }
    return $dependency
```

</details>

**依据 13 · 源码核查**：[skills/scripts/bootstrap-reverse.ps1:854-901](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/bootstrap-reverse.ps1#L854-L901)

Windows按定义检查现有工具及分派安装类型。

<details>
<summary>查看原文（48行）</summary>

```text
function Ensure-Capability {
    param([Parameter(Mandatory = $true)][string]$Name)

    $definition = Get-ReverseBootstrapDefinition -Name $Name
    if ($null -eq $definition) {
        throw "No bootstrap definition for capability: $Name"
    }

    # If capability is marked as not auto-installable, output guidance and skip
    if ($definition.PSObject.Properties['canAutoInstall'] -and $definition.canAutoInstall -eq $false) {
        $hint = if ($definition.PSObject.Properties['manualInstallHint']) { $definition.manualInstallHint } else { "Please install $Name manually. Docs: $($definition.docsUrl)" }
        Write-Warning "MANUAL_INSTALL_REQUIRED: $Name — $hint"
        # Still try to register MCP URL if applicable and a host was explicitly selected.
        if ($definition.PSObject.Properties['mcpNames'] -and $definition.PSObject.Properties['mcpUrl']) {
            Ensure-McpServer -ServerName $definition.mcpNames[0] -ServerDefinition @{ url = $definition.mcpUrl }
        }
        return $false
    }

    $existingState = Get-ReverseCapabilityState -Name $Name
    if ($existingState -and -not $definition.PSObject.Properties['mcpNames'] -and $definition.bootstrapKind -ne 'git-clone') {
        $toolSpec = $null
        try {
            $toolSpec = Resolve-ReverseToolSpec -Name $Name
        }
        catch {
            $toolSpec = $null
        }

        if ($toolSpec -and $toolSpec.Available) {
            return $toolSpec
        }
    }

    switch ($definition.bootstrapKind) {
        'github-release-zip' {
            # Generic handler for all github-release-zip capabilities
            $verifyName = if ($definition.PSObject.Properties['verifyCommand'] -and -not [string]::IsNullOrWhiteSpace($definition.verifyCommand)) {
                $definition.verifyCommand
            } else { $Name }
            return Ensure-GitHubZipInstall -Definition $definition -TargetPath $definition.installDir -VerifyName $verifyName
        }
        'git-clone' {
            return Ensure-GitCloneInstall -Definition $definition -TargetPath $definition.installDir
        }
        'github-release-jar-wrapper' {
            return Ensure-ApktoolInstall -Definition $definition
        }
```

</details>

**依据 14 · 源码核查**：[skills/scripts/bootstrap-reverse.ps1:980-1008](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/bootstrap-reverse.ps1#L980-L1008)

凭据/MCP配置及显式StartServices路径。

<details>
<summary>查看原文（29行）</summary>

```text
                $env:ANYTHING_ANALYZER_MCP_TOKEN = $authToken
                try {
                    [Environment]::SetEnvironmentVariable('ANYTHING_ANALYZER_MCP_TOKEN', $authToken, 'User')
                }
                catch {
                    Write-Warning "Could not persist ANYTHING_ANALYZER_MCP_TOKEN for future MCP clients: $($_.Exception.Message)"
                }
                $serverDefinition = @{
                    url                  = $definition.mcpUrl
                    headers              = @{ Authorization = "Bearer $authToken" }
                    bearer_token_env_var = 'ANYTHING_ANALYZER_MCP_TOKEN'
                }
                Ensure-McpServer -ServerName 'anything-analyzer' -ServerDefinition $serverDefinition
                if ($StartServices) {
                    Start-AnythingAnalyzerService -Definition $definition -AuthToken $authToken
                }
                return $true
            }
            if ($Name -eq 'idapro') {
                Ensure-Capability -Name 'idalib-mcp'
                Ensure-McpServer -ServerName 'idapro' -ServerDefinition @{ url = $definition.mcpUrl }
                if ($StartServices) {
                    Start-IdaProService -Definition $definition
                }
                return $true
            }
        }
        'go-install' {
            if (-not $definition.PSObject.Properties['goPackage'] -or [string]::IsNullOrWhiteSpace($definition.goPackage)) {
```

</details>

#### 缺口

- Windows和Bash入口有源码但未跨平台执行，当前工具索引仍需生成
  **影响**：不能把存在的脚本当目标机器工具已就绪
  **进一步探讨**：先确认平台运行时、生成本机索引，再做已知离线样本，不猜路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何计算试用成本和验收，哪些方向值得验证？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

现阶段观察更合适；有授权且已配置工具的熟练研究者可主动用已知离线样本验证发现/路由/资源完整性，再决定是否采用。采用对象是DSH内容入口适配，不是新增安全Agent引擎。不能因为许多技能可list就让整包获得持续运行推荐。

#### 启动与依赖

| 条件 | 是否必需 | 用途 | 缺失边界 |
|---|---|---|---|
| 兼容DSH/Cordis skills服务 | 插件启动必需 | provider注册 | README版本声明未独立加载验证 |
| 包内两目录和资源 | 技能可用必需 | 递归发现与get | 目录缺失partial，文件读错可抛异常 |
| 对应平台PowerShell或Bash/Python及本机索引 | router流程必需 | PRIMARY/本机路径 | 两平台入口均跟踪存在，实际运行和本机路径仍需验 |
| 已授权样本及领域工具/MCP | 任务必需 | 实际分析和证据 | provider不提供安装或权限沙箱 |

#### 步骤

| 阶段 | 操作者/动作 | 合格结果 |
|---|---|---|
| 准备 | 人确认版本、资源、离线样本和范围 | 不依赖未知公网目标 |
| 加载 | 在隔离宿主检查完整list/get | 根和嵌套技能可读，partial可见 |
| 路由 | 明确运行环境和本机索引 | PRIMARY匹配预期，不把fallback当确定 |
| 任务 | 仅用已知样本做小分析 | 函数/地址/证据可回读而非只有报告 |
| 退出 | 停用provider并核对工具/输出 | 脚本安装和work副本另处理 |

#### 成本

| 阶段 | 现金/资源 | 人工与时间 | 当前证据边界 |
|---|---|---|---|
| 首次 | 工具、依赖、模型资源未知 | 版本/平台/索引与范围校对 | 安装入口不是端到端成功 |
| 持续 | 模型读技能和分析费用未知 | 证据复核、误路由纠正 | 不以88推定效果 |
| 升级 | 上游内容和宿主适配未知 | 链接/路由/元数据一致性 | 完整缓存不实时发现增删 |
| 恢复退出 | 外部工具和案例输出未知 | 卸服务/删副本/保留证据 | disable不撤环境变更 |

#### 效果

| 效果 | 已有依据 | 未确定 |
|---|---|---|
| 发现 | 递归provider和resourceBase | 目标宿主实际加载 |
| 不完整目录 | complete:false且不缓存 | 单文件失败体验 |
| 研究路线 | router规则和领域工作文档 | 误路由、结论正确率 |
| 权限 | 正文scope及脚本材料 | 不提供宿主强制allowed-tools |

若缺资源、候选不完整却被当完整、环境路径不明或结论无样本证据，应停止自动任务，退回直接读选定技能/手工分析。不要在结果不明时自动安装整套工具。

由生成式工具索引、外部领域依赖及未投影权限元数据推导一个未验证方向：在打开技能前给出当前环境的资源就绪清单，只核对入口/引用/工具实际路径和宿主支持字段，缺失即标明，不把正文成功加载当任务就绪。比较直接读Skill与此预检在离线样本上的误启动次数、准备时间和人工纠错；若简单链接检查和本机索引足够，止于共享检查工具，不独立做新研究Agent。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:180-210](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/src/index.ts#L180-L210)

发现失败语义。

<details>
<summary>查看原文（31行）</summary>

```text
async function collect(
  root: string,
  registration: AbortSignal,
  options: SkillLookupOptions,
): Promise<{ items: Collected[]; complete: boolean }> {
  const items: Collected[] = []
  let complete = true
  async function walk(dir: string): Promise<void> {
    throwIfAborted(registration, options)
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      // An unreadable directory means this catalog is a partial view; surface that
      // through the observation instead of pretending discovery succeeded.
      complete = false
      return
    }
    for (const e of entries) {
      throwIfAborted(registration, options)
      const p = join(dir, e.name)
      if (e.isDirectory()) await walk(p)
      else if (e.name === 'SKILL.md') {
        const text = await readFile(p, 'utf8')
        const { fm, body } = parseFrontmatter(text)
        if (fm['name']) items.push({ path: p, fm, body })
      }
    }
  }
  await walk(root)
  return { items, complete }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:237-284](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/src/index.ts#L237-L284)

候选与正文边界。

<details>
<summary>查看原文（48行）</summary>

```text
    const candidates = [...skills.items, ...ctf.items].map(({ path, fm }) => {
      const userInv = fm['user-invocable']
      return {
        name: fm['name'],
        description: fm['description'] ?? '',
        invocation: {
          modelInvocable: true,
          userInvocable: userInv === undefined ? true : userInv !== 'false',
        },
        provider: PROVIDER_NAME,
        source: 'bundled',
        resourceBase: { kind: 'directory', path: dirname(path) },
        path,
        rank: 0,
        locator: pathToFileURL(path),
      } as SkillCandidate
    })
    const catalog: Catalog = { candidates, complete: skills.complete && ctf.complete }
    // Only memoize a trustworthy catalog; a partial walk is retried on the next list().
    if (catalog.complete) cache = catalog
    return catalog
  }

  return {
    name: PROVIDER_NAME,
    async list(options: SkillLookupOptions = {}): Promise<SkillProviderObservation> {
      throwIfAborted(control.signal, options)
      const catalog = await build(options)
      return { candidates: catalog.candidates, complete: catalog.complete }
    },
    async get(
      candidate: SkillCandidate,
      options: SkillLookupOptions = {},
    ): Promise<SkillDefinition | undefined> {
      throwIfAborted(control.signal, options)
      const source = candidate.path ?? candidate.locator
      const text = await readFile(source as string | URL, 'utf8')
      const { body } = parseFrontmatter(text)
      return {
        name: candidate.name,
        description: candidate.description,
        invocation: candidate.invocation,
        provider: candidate.provider,
        source: candidate.source,
        resourceBase: candidate.resourceBase,
        path: candidate.path,
        content: body,
      } as SkillDefinition
```

</details>

**依据 3 · 源码核查**：[skills/ghidra-reverse/SKILL.md:8-19](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/ghidra-reverse/SKILL.md#L8-L19)

样本任务准备。

<details>
<summary>查看原文（12行）</summary>

```text
## ACTION REQUIRED（读完后立刻执行）

1. `NOW`: 读取 `../field-journal/precedent-reverse.md`
2. `NOW`: 确认需要 **Ghidra**（无 IDA / 偏好开源 / 批量 headless）
3. `NEXT`: 读 `../tool-index.md` 查 ghidra / ghidra-mcp 路径
4. `NEXT`: 缺工具 → bootstrap `ghidra-mcp`（若 manifest 支持）或按手动步骤装 Ghidra
5. `ACT`: 导入样本 → 自动分析 → 导出关键函数反编译

## 适用场景

- 无 IDA 许可证时的主逆向入口
- 批量 headless 分析 / CI 中反编译
```

</details>

**依据 4 · 源码核查**：[skills/scripts/refresh-tool-index.sh:1-17](https://github.com/dhicoc/dsh-reverse-skill/blob/f1b61cf3deec370198ae81a23b8512338002d073/skills/scripts/refresh-tool-index.sh#L1-L17)

索引生成。

<details>
<summary>查看原文（17行）</summary>

```text
#!/usr/bin/env bash
# refresh-tool-index.sh — generic Linux/macOS tool index refresh
#
# This script is intentionally detection-only. It does not install tools.
# Output defaults:
#   skills/tool-index.md
#   skills/tool-index.json

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SKILL_ROOT/.." && pwd)"

OUTPUT_MD="${1:-${SKILL_ROOT}/tool-index.md}"
OUTPUT_JSON="${2:-${SKILL_ROOT}/tool-index.json}"
GENERATED_AT="$(date '+%Y-%m-%d %H:%M:%S %z')"
```

</details>

#### 缺口

- 未运行宿主/样本对照或新预检方案
  **影响**：建议限观察，未来收益不计入当前评分
  **进一步探讨**：临时宿主用已知样本统计误启动/纠错，再决定是否扩展。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
