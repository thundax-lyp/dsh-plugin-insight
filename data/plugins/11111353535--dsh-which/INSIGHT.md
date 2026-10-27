# dsh-which

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7894da8](https://github.com/11111353535/dsh-which/tree/7894da833582b46526b251348cd8993b70a5ce85)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。

> **核心亮点**：把胜出文件、遮蔽项和PATH异常组织成同一结构化诊断流程，并以可注入文件系统支持固定反例核查；增量是取证接线和解释，不是新的shell解析规则。详见[Q03](#research-q03)。

> **风险与缺陷**：报告是否对应实际shell仍受建模边界限制，Windows解析默认cmd表而环境可显示PowerShell；版本旗标也不能保证候选程序无副作用。这些为静态核查所得，未做运行复现。详见[Q04](#research-q04)。

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
  - [Q01 · 哪些环境故障值得使用解析取证？](#detail-section-11)
  - [Q02 · PATH、候选和版本报告怎样形成？](#detail-section-12)
  - [Q03 · 相对which与人工拼接新增什么？](#detail-section-13)
  - [Q04 · 报告是否真代表实际shell选择，探测是否安全？](#detail-section-14)
  - [Q05 · 启动和诊断依赖什么，如何恢复？](#detail-section-15)
  - [Q06 · 读目录和逐个探测的成本如何？](#detail-section-16)
  - [Q07 · 注入文件系统与测试设计能借鉴什么？](#detail-section-17)
  - [Q08 · 如何让模拟解析与实际shell契约更一致？](#detail-section-18)
  - [Q09 · 谁适合试用，何时停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多版本工具链出现命令找错、版本不一致时，开发者可收集胜出路径和遮蔽原因；结果是诊断材料，不是自动修复。详见[Q01](#research-q01)。

简单替代是shell原生命令查询、环境变量和绝对路径版本检查的人工组合；本插件汇总报告，不宣称比完整shell解释更权威。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 命令解析与遮蔽报告 | 解释实际文件候选 | 是模型结果，动态shell能力未全覆盖 |
| PATH与环境诊断 | 发现重复、缺目录和多版本 | 以插件进程环境为基础 |
| 目录扫描 | 发现脚本被其他路径遮蔽 | 先读取全部目录再截处理项 |
| 可选版本探测 | 对比候选输出版本 | 执行本机程序，需可信路径 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必要性及用途 | 失效影响 |
| --- | --- | --- |
| Node ^22.19.0或>=24 | manifest运行时 | 不满足不能承诺启动 |
| dsh-tools、schemastery及tools/commands | 导入与注册 | 依宿主包解析 |
| workspaceRegistry | 可选会话cwd | 缺失回退进程cwd |
| 文件读取及可选执行权限 | 诊断或probe | 读取失败可能表现为缺失 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| profile安装并核查依赖 | 维护者 | 五工具和which命令注册 |
| 保持probe关闭并核对cwd | 维护者 | 报告对应目标会话 |
| 查询PATH和已知遮蔽样例 | 用户/Agent | 与真实shell交叉一致 |
| 单独决定可信候选探测 | 用户 | 不执行陌生脚本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无独立付费服务，依赖宿主运行时 | 安装及环境/cwd核对，耗时未知 | 无独立付费服务不等宿主总费为零；安装耗时未知 |
| 持续使用 | PATH候选同步stat；可选probe逐个执行 | 阅读报告和交叉核对，时间未知 | PATH/网络盘/runtime数决定扫描与串行probe成本；实际用量未知 |
| 失败恢复 | probe可能执行程序，副作用依候选 | 回到原生shell核查、处理误判与潜在副作用 | probe候选可有副作用；人工排查及资源金额未知 |


#### 效果

| 目标 | 源码支持 | 效果边界 |
| --- | --- | --- |
| 解释遮蔽 | 保留全部候选与胜出路径 | 不覆盖全部动态shell规则 |
| 检查PATH | 重复、缺目录和变量提示 | 空条目和变量解释可能偏离执行环境 |
| 比较版本 | 可选execFile及版本行抽取 | 不证明程序可信，耗时与误判未测 |

> **思考**：报告是否对应实际shell仍受建模边界限制，Windows解析默认cmd表而环境可显示PowerShell；版本旗标也不能保证候选程序无副作用。这些为静态核查所得，未做运行复现。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把胜出文件、遮蔽项和PATH异常组织成同一结构化诊断流程，并以可注入文件系统支持固定反例核查；增量是取证接线和解释，不是新的shell解析规则。详见[Q03](#research-q03)。

把胜出文件、遮蔽项和PATH异常组织成同一结构化诊断流程，并以可注入文件系统支持固定反例核查；增量是取证接线和解释，不是新的shell解析规则。详见[Q03](#research-q03)。

host事实读取、纯解析器与render分层值得借鉴，fixture和Proxy stub便于反例及接线核查；移植主要成本在shell语义和宿主依赖。测试材料仅阅读。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

报告是否对应实际shell仍受建模边界限制，Windows解析默认cmd表而环境可显示PowerShell；版本旗标也不能保证候选程序无副作用。这些为静态核查所得，未做运行复现。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议在可信工具链环境限定试用只读报告，关闭默认probe，关键决策用真实shell交叉核对；一旦builtin、别名或cwd不一致，停止据此修改环境。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

文件候选诊断和结构化报告有源码依据；真实shell等价性有限。shell契约分层方向未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/host.js、lib/pathlist.js、lib/resolve.js、lib/probe.js、test/unit.test.mjs、test/plugin.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的入口、解析、环境、探测与测试材料；不运行插件或probe，不将作者演示当执行证明。
- 下一步：进一步探讨可从PowerShell builtin、PATH空项、相对cwd和未知程序探测四组反例入手，先界定模型与真实shell差异，再比较诊断耗时和误判恢复负担。

**分析版本**

- **仓库**：[11111353535/dsh-which](https://github.com/11111353535/dsh-which)
- **版本号**：0.1.0（[固定提交 7894da8](https://github.com/11111353535/dsh-which/tree/7894da833582b46526b251348cd8993b70a5ce85)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可从shell种类的显式传递和模型边界标注入手，将文件候选与实际shell事实分层；先用固定反例对照，再决定是否增加受控适配，当前未验证。详见[Q08](#research-q08)。

进一步探讨可从PowerShell builtin、PATH空项、相对cwd和未知程序探测四组反例入手，先界定模型与真实shell差异，再比较诊断耗时和误判恢复负担。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 1776 | 1003 | 641 | — |
| .md | source | 2 | 508 | — | — | 4302 |
| .mjs | source | 1 | 155 | 88 | 51 | — |
| .mjs | test | 4 | 1425 | 1091 | 197 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/11111353535/dsh-which/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/11111353535/dsh-which/issues?q=is%3Aissue+created%3A2026-09-22T04%3A40%3A44.438Z..2026-10-22T04%3A40%3A44.438Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/11111353535/dsh-which/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A40%3A44.438Z..2026-10-22T04%3A40%3A44.438Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本dsh-which如何解释命令遮蔽和版本差异，其报告边界、探测风险及采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些环境故障值得使用解析取证？

**研究主题**：场景与需求

#### 完整回答

面向在 DSH 中安装多个 Node、Python 或脚本工具链的开发者和环境维护者。典型任务是解释“终端看见的版本与 Agent 所用版本不一致”“安装成功却找不到命令”“目录脚本被全局同名工具遮蔽”。合格交付应把胜出文件、其他候选、PATH顺序与不能执行原因联系起来，让用户可以决定是否使用绝对路径或修复环境，而不是自动修改PATH。

简单替代是人工组合 shell 的 command/type/where 类查询、环境变量和各绝对路径的版本输出。本插件把这些材料接入五个结构化工具与一个命令入口，降低分散查询负担。它不能证明构建已经成功，也不负责环境修复。对于单一且稳定的工具链，一次现有shell查询可能已够用；对于有别名、函数、缓存或自定义shell策略的环境，还必须核对真实shell语义。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:11-30](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L11-L30)

入口注释明确多安装、PATH残留和遮蔽的诊断任务。

<details>
<summary>查看原文（20行）</summary>

```text
 * The failures this exists to name, all of which are silent:
 *
 * - A tool is installed twice, and the older copy is earlier on PATH. The
 *   version you see in your terminal is not the version the agent runs.
 * - An installer prepended itself to PATH on every upgrade, so one directory
 *   now appears three times and editing "the" entry leaves two behind.
 * - An uninstalled toolchain left a dead PATH entry. Shells skip those without
 *   a word, so the hole only surfaces when the command that lived there fails.
 * - A PATH entry contains a literal `%USERPROFILE%` that nothing ever expands,
 *   so it can never resolve.
 * - On Windows, a `.cmd` shim sits in front of a real binary, or a `.ps1`
 *   exists that `cmd` will never run — same name, different behaviour per
 *   shell.
 * - A file exists, has the right name, and is not executable. `ls` shows it;
 *   the shell walks past it to a later PATH entry, or fails.
 *
 * Each of those is a fact about the machine, and none of them is visible from
 * a plain `which`. This plugin reports the resolution *and* what it shadowed,
 * the shape of PATH itself, and — on request — what each copy reports as its
 * version.
```

</details>

**依据 2 · 作者声明**：[README.md:29-37](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/README.md#L29-L37)

作者说明与简单which的比较和不修改PATH的定位。

````text
2. **`which` inherits the rules under investigation.** Shelling out to a resolver to explain resolution means trusting the resolver you are debugging. The rules here are reimplemented as pure functions over an injected filesystem (`lib/resolve.js`), so they are testable against fixtures instead of against whatever is installed on the test machine.
3. **Shell builtins are not files.** `which cd` on most systems walks every PATH entry to report something that has nothing to do with what runs. This plugin says `builtin` and explains that PATH was never consulted.
4. **The interesting output is the shadowed copy.** "What runs" is one line. "What else answers to this name, and why is it not running" is the diagnosis — a stale global install behind a fresh local one, a `.cmd` shim in front of a real binary, a file that exists but was never made executable.
5. **Reporting is the whole job.** There is no PATH-editing tool here. A plugin that silently rewrites PATH is a plugin that breaks a machine.

## Install

```sh
dsh plugin add https://github.com/11111353535/dsh-which
````

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · PATH、候选和版本报告怎样形成？

**研究主题**：功能与机制

#### 完整回答

resolveOnHost 从当前进程环境读PATH和PATHEXT，将文件状态查询注入 resolveCommand。解析器先以平台默认的builtin表短路，再处理显式路径，否则按PATH条目与扩展名枚举所有存在候选，选择第一个可运行者，保留其余用于遮蔽报告。POSIX根据执行位判断，Windows按扩展名分类。路径诊断另外检测重复、缺目录和未解析环境变量；环境报告收集平台、shell与常见runtime解析；sweep检查指定目录的脚本是否会被别处同名候选取代。

入口注册 which_resolve、which_path、which_env、which_sweep、which_probe，并注册 /which。workspaceRegistry 可选，缺少时相对路径使用进程工作目录。只有请求探测或配置开启默认探测时，probeResolution 才用 execFile 对胜出候选执行版本参数，可选串行探测遮蔽项。单次设置超时和8KB输出上限，结果格式化为可读报告，不执行PATH编辑。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:119-130](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L119-L130)

真实环境转为注入式解析器输入。

<details>
<summary>查看原文（12行）</summary>

```text
export function resolveOnHost(command, options = {}) {
  const env = options.env ?? process.env
  const platform = options.platform ?? process.platform
  const path = readPath(env, { platform })
  const pathExt = options.pathExt ?? readPathExt(env, { platform })

  return resolveCommand(command, {
    entries: path.entries,
    pathExt,
    platform,
    statFile: (candidate) => statFile(qualify(candidate, options.cwd)),
  })
```

</details>

**依据 2 · 源码核查**：[lib/resolve.js:163-215](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/resolve.js#L163-L215)

builtin、显式路径与按序候选的完整分支。

<details>
<summary>查看原文（53行）</summary>

```text
export function resolveCommand(command, options) {
  const platform = options.platform ?? process.platform
  const pathExt = options.pathExt ?? []
  const statFile = options.statFile
  const entries = options.entries ?? []

  if (isBuiltin(command, { platform })) {
    return { command, kind: 'builtin', winner: null, candidates: [], searched: 0, note: 'handled by the shell; PATH is never consulted' }
  }

  /* A path is used as written: no PATH, no PATHEXT. */
  if (isPathCommand(command) || isAbsolute(command)) {
    const facts = statFile(command)
    const candidate = facts === undefined ? null : buildCandidate(command, command, -1, '', facts, platform)
    const runnable = candidate !== null && isRunnable(candidate, { platform })
    return {
      command,
      kind: 'absolute',
      winner: runnable ? candidate : null,
      candidates: candidate === null ? [] : [candidate],
      searched: 0,
      ...(runnable ? {} : { note: candidate === null ? 'no such file' : 'the file exists but is not runnable' }),
    }
  }

  const names = candidateNames(command, pathExt, { platform })
  const candidates = []
  const seen = new Set()
  let searched = 0

  for (const entry of entries) {
    searched += 1
    for (const name of names) {
      const absolute = joinEntry(entry.path, name)
      const facts = statFile(absolute)
      if (facts === undefined) continue
      /* A PATH entry that appears twice yields the same file twice. The
       * duplication is worth reporting, but by `which_path`, not here: this
       * list is "every distinct file that answers to the name", and counting
       * one file twice would misreport how many copies exist. */
      if (seen.has(absolute)) continue
      seen.add(absolute)
      candidates.push(buildCandidate(absolute, name, entry.index, entry.path, facts, platform))
    }
  }

  const winner = candidates.find((candidate) => isRunnable(candidate, { platform })) ?? null
  return {
    command,
    kind: winner === null ? 'missing' : 'path',
    winner,
    candidates,
    searched,
```

</details>

**依据 3 · 源码核查**：[lib/probe.js:66-86](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/probe.js#L66-L86)

探测是实际execFile，设超时、输出限制和取消信号。

<details>
<summary>查看原文（21行）</summary>

```text
export async function probeVersion(file, options = {}) {
  const flag = options.flag ?? VERSION_FLAGS[0]
  const timeoutMs = options.timeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS
  const platform = options.platform ?? process.platform
  const runner = options.run ?? run

  try {
    const { stdout, stderr } = await runner(file, [flag], {
      timeout: timeoutMs,
      maxBuffer: MAX_OUTPUT,
      windowsHide: true,
      ...(options.signal === undefined ? {} : { signal: options.signal }),
    })
    const combined = `${stdout ?? ''}${stderr ?? ''}`
    const version = extractVersion(combined)
    return version === undefined
      ? { path: file, flag, ok: false, reason: 'ran, but printed nothing that looks like a version' }
      : { path: file, flag, ok: true, version }
  } catch (error) {
    return { path: file, flag, ok: false, ...describeFailure(error, platform) }
  }
```

</details>

**依据 4 · 源码核查**：[lib/probe.js:148-173](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/probe.js#L148-L173)

候选逐个探测并比较成功版本。

<details>
<summary>查看原文（26行）</summary>

```text
export async function probeResolution(resolution, options = {}) {
  const shared = {
    flag: options.flag,
    timeoutMs: options.timeoutMs,
    signal: options.signal,
    platform: options.platform,
    run: options.run,
  }

  const winner = resolution.winner === null ? null : await probeVersion(resolution.winner.path, shared)

  const shadowed = []
  if (options.includeShadowed === true) {
    for (const candidate of resolution.candidates) {
      if (candidate.path === resolution.winner?.path) continue
      shadowed.push({ candidate, probe: await probeVersion(candidate.path, shared) })
    }
  }

  const versions = new Set()
  if (winner?.ok === true) versions.add(winner.version)
  for (const entry of shadowed) {
    if (entry.probe.ok === true) versions.add(entry.probe.version)
  }

  return { winner, shadowed, divergent: versions.size > 1 }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对which与人工拼接新增什么？

**研究主题**：贡献与相对优势

#### 完整回答

贡献主要是把胜出结果之外的遮蔽证据提升为一等输出，并将PATH健康检查、目录脚本归属和可选版本比较组织成同一诊断流程。与“文件存在”相比，保留不可执行候选并解释继续寻找下一条PATH的机制，更接近开发者要追问的失败原因。源码中解析器可注入文件系统，使规则能够被固定fixture检查，而不是依赖研究机器碰巧装了什么。

PATH顺序、PATHEXT、文件状态和版本旗标是已有系统概念，不能计作原创。对照人工组合type/where和绝对路径探测，本插件增加的是接线、解释和结构化报告，不是更权威的shell解析器。它也没有覆盖所有shell动态功能，故“实际运行什么”的主张应限于实现建模的文件查找规则；不能从报告更丰富推导准确率一定高于宿主工具。

#### 证据与依据

**依据 1 · 源码核查**：[lib/resolve.js:193-215](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/resolve.js#L193-L215)

保留全部候选并选首个可运行文件。

<details>
<summary>查看原文（23行）</summary>

```text
  for (const entry of entries) {
    searched += 1
    for (const name of names) {
      const absolute = joinEntry(entry.path, name)
      const facts = statFile(absolute)
      if (facts === undefined) continue
      /* A PATH entry that appears twice yields the same file twice. The
       * duplication is worth reporting, but by `which_path`, not here: this
       * list is "every distinct file that answers to the name", and counting
       * one file twice would misreport how many copies exist. */
      if (seen.has(absolute)) continue
      seen.add(absolute)
      candidates.push(buildCandidate(absolute, name, entry.index, entry.path, facts, platform))
    }
  }

  const winner = candidates.find((candidate) => isRunnable(candidate, { platform })) ?? null
  return {
    command,
    kind: winner === null ? 'missing' : 'path',
    winner,
    candidates,
    searched,
```

</details>

**依据 2 · 源码核查**：[test/unit.test.mjs:277-310](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/test/unit.test.mjs#L277-L310)

fixture同时断言胜出和不可执行候选，展示可测试的诊断设计。

<details>
<summary>查看原文（34行）</summary>

```text
test('resolveCommand picks the first PATH entry that holds a runnable file', () => {
  const statFile = fixture({
    '/first/node': { size: 100, executable: true },
    '/second/node': { size: 200, executable: true },
  })
  const resolution = resolveCommand('node', {
    entries: [{ index: 0, path: '/first' }, { index: 1, path: '/second' }],
    pathExt: [''],
    platform: POSIX,
    statFile,
  })
  assert.equal(resolution.kind, 'path')
  assert.equal(resolution.winner.path, '/first/node')
  assert.equal(resolution.winner.directoryIndex, 0)
  assert.equal(resolution.candidates.length, 2)
})

test('resolveCommand walks past a file that is not executable', () => {
  const statFile = fixture({
    '/first/node': { size: 100, executable: false },
    '/second/node': { size: 200, executable: true },
  })
  const resolution = resolveCommand('node', {
    entries: [{ index: 0, path: '/first' }, { index: 1, path: '/second' }],
    pathExt: [''],
    platform: POSIX,
    statFile,
  })
  /* The winner is the second entry, and the first is still reported — that
   * pair is the whole diagnosis. */
  assert.equal(resolution.winner.path, '/second/node')
  assert.equal(resolution.candidates.length, 2)
  assert.equal(resolution.candidates[0].executable, false)
})
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 报告是否真代表实际shell选择，探测是否安全？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能把该报告无条件当成真实shell的执行决策。环境报告调用detectShell记录shell信息，但resolveCommand只向isBuiltin传platform，Windows默认走cmd表；即使环境显示PowerShell，其特有builtin也没有被传入解析链。另一方面splitPath会丢空条目且trim路径，可能偏离将空PATH项解释为当前目录、或路径空格有意义的环境。别名、函数与shell命令缓存也未进入当前输入模型。这些静态差异可导致诊断偏差，不是已复现宿主故障。

“只运行版本旗标”也不是副作用安全保证。探测对任何解析选中的候选文件执行--version，代码并不验证程序可信度，任意程序可忽略参数执行自身逻辑；超时和输出上限只限制时长与返回大小。默认探测关闭是合理边界，涉及未知仓库脚本或不可信PATH时应坚持只解析而不执行。版本提取只寻找带数字和点的首行或其他首行，不能等同于经过认证的版本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:167-193](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L167-L193)

环境报告识别shell但runtime解析只传platform。

<details>
<summary>查看原文（27行）</summary>

```text
export function buildEnvReport(config, options = {}) {
  const env = options.env ?? process.env
  const platform = options.platform ?? process.platform
  const shell = detectShell(env, { platform })
  const pathAnalysis = analyzeHostPath({ env, platform })

  const runtimes = []
  for (const runtime of config.runtimes ?? []) {
    const resolution = resolveOnHost(runtime, { cwd: options.cwd, env, platform })
    const groups = shadowGroups(resolution)
    runtimes.push({
      name: runtime,
      winner: resolution.winner?.path,
      shadowCount: groups.reduce((total, group) => total + group.entries.length, 0),
    })
  }

  return {
    platform,
    arch: process.arch,
    node: process.version,
    shell: shell.name,
    shellPath: shell.path,
    shellKind: shell.kind,
    cwd: options.cwd ?? process.cwd(),
    path: pathAnalysis,
    ...(platform === 'win32' ? { pathext: readPathExt(env, { platform }) } : {}),
```

</details>

**依据 2 · 源码核查**：[lib/resolve.js:75-81](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/resolve.js#L75-L81)

isBuiltin默认按平台选表。

```text
export function isBuiltin(command, options = {}) {
  const platform = options.platform ?? process.platform
  const shell = options.shell ?? (platform === 'win32' ? 'cmd' : 'posix')
  const table = BUILTINS[shell]
  if (table === undefined) return false
  const key = foldCase(command, platform)
  return table.has(key)
```

**依据 3 · 源码核查**：[lib/resolve.js:163-170](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/resolve.js#L163-L170)

实际解析没有将探测到的shell传入。

```text
export function resolveCommand(command, options) {
  const platform = options.platform ?? process.platform
  const pathExt = options.pathExt ?? []
  const statFile = options.statFile
  const entries = options.entries ?? []

  if (isBuiltin(command, { platform })) {
    return { command, kind: 'builtin', winner: null, candidates: [], searched: 0, note: 'handled by the shell; PATH is never consulted' }
```

**依据 4 · 源码核查**：[lib/pathlist.js:58-64](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/pathlist.js#L58-L64)

空PATH条目丢弃且条目被trim。

```text
export function splitPath(raw, separator = delimiter) {
  if (typeof raw !== 'string' || raw === '') return []
  return raw
    .split(separator)
    .map((entry) => stripQuotes(entry.trim()))
    .filter((entry) => entry !== '')
}
```

**依据 5 · 源码核查**：[lib/probe.js:66-86](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/probe.js#L66-L86)

任意选中路径执行固定旗标，缺少程序可信度校验。

<details>
<summary>查看原文（21行）</summary>

```text
export async function probeVersion(file, options = {}) {
  const flag = options.flag ?? VERSION_FLAGS[0]
  const timeoutMs = options.timeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS
  const platform = options.platform ?? process.platform
  const runner = options.run ?? run

  try {
    const { stdout, stderr } = await runner(file, [flag], {
      timeout: timeoutMs,
      maxBuffer: MAX_OUTPUT,
      windowsHide: true,
      ...(options.signal === undefined ? {} : { signal: options.signal }),
    })
    const combined = `${stdout ?? ''}${stderr ?? ''}`
    const version = extractVersion(combined)
    return version === undefined
      ? { path: file, flag, ok: false, reason: 'ran, but printed nothing that looks like a version' }
      : { path: file, flag, ok: true, version }
  } catch (error) {
    return { path: file, flag, ok: false, ...describeFailure(error, platform) }
  }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动和诊断依赖什么，如何恢复？

**研究主题**：依赖、兼容与流程

#### 完整回答

入口直接导入@deepseek-ai/dsh-tools和@deepseek-ai/schemastery，注入tools和commands；manifest没有列出对应runtime dependencies，因此实际可加载性依赖宿主解析这些包。Node引擎要求^22.19.0或>=24，安装GitHub来源后还需在profile加载补丁。workspaceRegistry通过ctx.get可选访问，并捕获异常回退；这个容错避免缺服务导致诊断全停，但相对路径含义可能从会话目录变为进程目录。

普通诊断需要读取本机PATH和文件元数据；sweep需要读指定目录；版本探测还需要对候选程序执行权限。插件不保存诊断数据库或修改PATH，退出无需数据迁移，用户仍需通过宿主禁用/移除插件。恢复流程应先核对工作目录、PATH和权限，再用绝对路径隔离歧义；若probe挂起或失败，返回原因不代表PATH本身坏了。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:51-86](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L51-L86)

宿主包导入与服务注入。

<details>
<summary>查看原文（36行）</summary>

```text
import { join as joinPath, resolve as resolvePath } from 'node:path'

import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

import {
  renderEnv,
  renderPath,
  renderProbe,
  renderProblem,
  renderResolve,
  renderSweep,
} from './format.js'
import {
  RUNTIME_CANDIDATES,
  detectShell,
  listDirectory,
  readPath,
  readPathExt,
  statFile,
} from './host.js'
import { analyzePath, foldCase } from './pathlist.js'
import { probeResolution } from './probe.js'
import { isPathCommand, resolveCommand, shadowGroups } from './resolve.js'

/** Plugin name, as the profile's patch file refers to it. */
export const name = 'dsh-which'

/**
 * Services this plugin needs.
 *
 * A static array, not a function: the harness disables a whole bundle whose
 * `inject` is a function, and the failure is silent. Everything else this
 * plugin wants (`workspaceRegistry`) is optional and reached through `ctx.get`.
 */
export const inject = ['tools', 'commands']
```

</details>

**依据 2 · 源码核查**：[lib/index.js:277-297](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L277-L297)

可选工作区服务的查找和静默回退。

<details>
<summary>查看原文（21行）</summary>

```text
function workspaceRootFor(ctx, exec) {
  try {
    const registry = typeof ctx.get === 'function' ? ctx.get('workspaceRegistry') : undefined
    if (registry === undefined) return undefined
    const session = exec?.agent?.session
    if (session !== undefined && typeof registry.forSession === 'function') {
      const root = registry.forSession(session)
      if (typeof root === 'string' && root !== '') return root
    }
    if (typeof registry.current === 'function') {
      const current = registry.current()
      if (typeof current === 'string' && current !== '') return current
    }
    if (typeof registry.defaultRoot === 'function') {
      const root = registry.defaultRoot()
      if (typeof root === 'string' && root !== '') return root
    }
  } catch {
    /* An optional service that throws is the same as one that is absent. */
  }
  return undefined
```

</details>

**依据 3 · 源码核查**：[package.json:1-30](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/package.json#L1-L30)

模块入口与发布资源。

<details>
<summary>查看原文（30行）</summary>

```text
{
  "name": "dsh-which",
  "version": "0.1.0",
  "description": "Command resolution forensics for DeepSeek Harness: what actually runs when a command is typed 鈥?which PATH entry wins, what it shadowed, what shape PATH is in, and whether the copies behind one name agree on a version.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "locale",
    "icon.svg",
    "README.md",
    "README.zh.md",
    "LICENSE",
    "scripts"
  ],
  "scripts": {
    "test": "node --test \"test/**/*.test.mjs\"",
    "test:live": "node test/live-which.mjs",
    "setup:deps": "node scripts/link-host-deps.mjs"
  },
```

</details>

**依据 4 · 源码核查**：[lib/host.js:26-39](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/host.js#L26-L39)

读取状态异常被归为不存在，权限失败可能影响诊断。

<details>
<summary>查看原文（14行）</summary>

```text
export function statFile(path) {
  try {
    const stats = statSync(path)
    return {
      size: stats.size,
      mtimeMs: stats.mtimeMs,
      directory: stats.isDirectory(),
      /* Windows has no executable bit; resolution there is decided by
       * extension instead, so this only matters on POSIX. */
      executable: process.platform === 'win32' ? true : (stats.mode & 0o111) !== 0,
    }
  } catch {
    return undefined
  }
```

</details>

#### 缺口

- 宿主包实际解析来源及部署shell/工作目录配置未固定。
  **影响**：影响能否加载和报告是否对应目标会话。
  **进一步探讨**：以目标宿主固定版本检查包解析、命令执行环境和workspaceRegistry返回契约。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 读目录和逐个探测的成本如何？

**研究主题**：效果与总成本

#### 完整回答

首次成本是安装和检查宿主包、运行时、工作目录，再选择是否允许probe。持续只读解析会按PATH和候选扩展名做同步stat，环境报告再对配置runtime重复解析。sweep虽将处理的名称截到maxSweepFiles，仍先读取并排序整个目录，因此这个上限不等于目录I/O完全有界。成本取决于PATH长度、网络盘延迟、runtime数和目录规模。

probe对候选串行执行，每个默认四秒上限；遮蔽候选越多，总等待可能接近单次上限之和，外层工具超时不应被当成每个后代进程都可靠终止的证明。收益是减少人工拼接与发现错版本的诊断时间，本仓库没有同任务计时、误判率或费用记录。失败恢复应计入人工核对真实shell、检查被探测程序可能的副作用，以及重新收集环境；没有材料支持写零成本或节省比例。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:211-247](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L211-L247)

sweep先listDirectory后slice再逐项解析。

<details>
<summary>查看原文（37行）</summary>

```text
export function sweepDirectory(directory, config, options = {}) {
  const env = options.env ?? process.env
  const platform = options.platform ?? process.platform
  const absolute = qualify(directory, options.cwd)
  const names = listDirectory(absolute).slice(0, config.maxSweepFiles ?? 400)
  const rows = []

  for (const entry of names) {
    if (entry.startsWith('.')) continue
    const facts = statFile(joinPath(absolute, entry))
    if (facts === undefined || facts.directory) continue
    /* Only files that carry an extension Windows would run, or that are
     * executable elsewhere, look like commands at all. */
    const looksRunnable = platform === 'win32'
      ? /\.(exe|com|cmd|bat|ps1)$/iu.test(entry)
      : facts.executable
    if (!looksRunnable) continue

    const resolution = resolveOnHost(entry, { cwd: options.cwd, env, platform })
    const here = joinPath(absolute, entry)
    const winnerPath = resolution.winner?.path
    /* The sweep answers one question per file: if this directory is on PATH,
     * does its own copy run, or does something earlier win? A row is marked
     * only when the answer is "something earlier" — which is why the test is
     * against this directory, not merely "a winner exists". Comparing folded
     * paths keeps Windows, where case does not distinguish files, honest. */
    const resolvesElsewhere = winnerPath !== undefined
      && foldCase(winnerPath, platform) !== foldCase(here, platform)
    rows.push({
      name: entry,
      winner: winnerPath,
      shadowedBy: resolvesElsewhere ? winnerPath : undefined,
      note: resolution.note,
    })
  }

  return { directory: absolute, rows }
```

</details>

**依据 2 · 源码核查**：[lib/host.js:48-53](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/host.js#L48-L53)

读整个目录并排序。

```text
export function listDirectory(directory) {
  try {
    return readdirSync(directory).sort()
  } catch {
    return []
  }
```

**依据 3 · 源码核查**：[lib/probe.js:148-164](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/probe.js#L148-L164)

探测逐项等待，耗时随候选叠加。

<details>
<summary>查看原文（17行）</summary>

```text
export async function probeResolution(resolution, options = {}) {
  const shared = {
    flag: options.flag,
    timeoutMs: options.timeoutMs,
    signal: options.signal,
    platform: options.platform,
    run: options.run,
  }

  const winner = resolution.winner === null ? null : await probeVersion(resolution.winner.path, shared)

  const shadowed = []
  if (options.includeShadowed === true) {
    for (const candidate of resolution.candidates) {
      if (candidate.path === resolution.winner?.path) continue
      shadowed.push({ candidate, probe: await probeVersion(candidate.path, shared) })
    }
```

</details>

#### 缺口

- 缺少长PATH、网络盘和多候选场景的耗时及诊断结果对照。
  **影响**：无法判定报告收益能否抵销同步I/O和人工复核。
  **进一步探讨**：用同一冻结环境比较人工查询与只读报告的合格诊断时间，单独核算probe。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 注入文件系统与测试设计能借鉴什么？

**研究主题**：工程质量与复用

#### 完整回答

值得复用的是把系统读取收拢在host模块，再让解析和PATH分析接受外部事实；固定fixture可构造同名遮蔽、不可执行和扩展名优先级反例，容易定位规则错误。工具schema、结构化结果与render分离，也能让模型调用和人类阅读共用同一事实对象。移植代价主要在各shell语义、文件系统大小写和宿主API，而不是复制格式化函数。

unit测试源码对首个可执行候选、保留不可执行文件有明确断言；plugin测试用Proxy限制未声明服务访问，能检查接线范围。它们证明的是作者已编写哪些验证条件，本轮未执行，不应转写成通过。fixture建模若与真实shell同样错误，测试仍会自洽，尤其当前shell识别没有回传解析器。需要把模型边界写进报告，不能用88个测试的作者计数代替准确性评估。

#### 证据与依据

**依据 1 · 源码核查**：[test/unit.test.mjs:264-310](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/test/unit.test.mjs#L264-L310)

builtin及候选选择的fixture断言。

<details>
<summary>查看原文（47行）</summary>

```text
test('resolveCommand answers a builtin without touching PATH', () => {
  const resolution = resolveCommand('cd', {
    entries: [{ index: 0, path: '/usr/bin' }],
    pathExt: [''],
    platform: POSIX,
    statFile: () => undefined,
  })
  assert.equal(resolution.kind, 'builtin')
  assert.equal(resolution.winner, null)
  assert.equal(resolution.searched, 0)
  assert.match(resolution.note, /shell/)
})

test('resolveCommand picks the first PATH entry that holds a runnable file', () => {
  const statFile = fixture({
    '/first/node': { size: 100, executable: true },
    '/second/node': { size: 200, executable: true },
  })
  const resolution = resolveCommand('node', {
    entries: [{ index: 0, path: '/first' }, { index: 1, path: '/second' }],
    pathExt: [''],
    platform: POSIX,
    statFile,
  })
  assert.equal(resolution.kind, 'path')
  assert.equal(resolution.winner.path, '/first/node')
  assert.equal(resolution.winner.directoryIndex, 0)
  assert.equal(resolution.candidates.length, 2)
})

test('resolveCommand walks past a file that is not executable', () => {
  const statFile = fixture({
    '/first/node': { size: 100, executable: false },
    '/second/node': { size: 200, executable: true },
  })
  const resolution = resolveCommand('node', {
    entries: [{ index: 0, path: '/first' }, { index: 1, path: '/second' }],
    pathExt: [''],
    platform: POSIX,
    statFile,
  })
  /* The winner is the second entry, and the first is still reported — that
   * pair is the whole diagnosis. */
  assert.equal(resolution.winner.path, '/second/node')
  assert.equal(resolution.candidates.length, 2)
  assert.equal(resolution.candidates[0].executable, false)
})
```

</details>

**依据 2 · 源码核查**：[test/plugin.test.mjs:30-54](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/test/plugin.test.mjs#L30-L54)

Proxy stub限制未声明的宿主服务。

<details>
<summary>查看原文（25行）</summary>

```text
  const tools = []
  const commands = []
  const listeners = []
  const state = { effects: 0 }

  const base = {
    tools: { register: (tool) => tools.push(tool) },
    commands: { register: (command) => commands.push(command) },
    on: (event, handler) => listeners.push({ event, handler }),
    effect: (factory) => {
      state.effects += 1
      return factory()
    },
    get: () => undefined,
    logger: { warn: () => {}, info: () => {}, error: () => {} },
  }

  const ctx = new Proxy(base, {
    get(target, property, receiver) {
      if (property in target) return Reflect.get(target, property, receiver)
      throw new Error(`plugin touched undeclared service "${String(property)}"`)
    },
  })

  return { ctx, tools, commands, listeners, get effects() { return state.effects } }
```

</details>

**依据 3 · 源码核查**：[lib/host.js:26-39](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/host.js#L26-L39)

文件系统事实边界集中，读取失败会回退。

<details>
<summary>查看原文（14行）</summary>

```text
export function statFile(path) {
  try {
    const stats = statSync(path)
    return {
      size: stats.size,
      mtimeMs: stats.mtimeMs,
      directory: stats.isDirectory(),
      /* Windows has no executable bit; resolution there is decided by
       * extension instead, so this only matters on POSIX. */
      executable: process.platform === 'win32' ? true : (stats.mode & 0o111) !== 0,
    }
  } catch {
    return undefined
  }
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 如何让模拟解析与实际shell契约更一致？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把报告拆成明确的文件查找模型与宿主shell事实两层，先将已识别shell种类传入解析器，再为别名、函数和缓存提供独立、有权限的事实适配。推导来自当前环境报告有shell信息而解析器仍用平台默认表的接线断层。相对重做通用shell执行器，先修明确参数传递并在报告标出未建模项，可能更低成本且减少过度承诺。

最小比较用固定cmd、PowerShell和POSIX事件样例，包括同名builtin、PATH空条目、相对目录和未知脚本；逐项对照权威shell决策与报告模型。若传shell参数后仍大量偏离，或为了覆盖别名而引入不受控命令执行，则否定“完整取证”方向并收窄为文件候选诊断。这不是当前功能，不能计入插件创新分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:167-193](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L167-L193)

shell元数据与runtime查询并列但没有共享shell参数。

<details>
<summary>查看原文（27行）</summary>

```text
export function buildEnvReport(config, options = {}) {
  const env = options.env ?? process.env
  const platform = options.platform ?? process.platform
  const shell = detectShell(env, { platform })
  const pathAnalysis = analyzeHostPath({ env, platform })

  const runtimes = []
  for (const runtime of config.runtimes ?? []) {
    const resolution = resolveOnHost(runtime, { cwd: options.cwd, env, platform })
    const groups = shadowGroups(resolution)
    runtimes.push({
      name: runtime,
      winner: resolution.winner?.path,
      shadowCount: groups.reduce((total, group) => total + group.entries.length, 0),
    })
  }

  return {
    platform,
    arch: process.arch,
    node: process.version,
    shell: shell.name,
    shellPath: shell.path,
    shellKind: shell.kind,
    cwd: options.cwd ?? process.cwd(),
    path: pathAnalysis,
    ...(platform === 'win32' ? { pathext: readPathExt(env, { platform }) } : {}),
```

</details>

**依据 2 · 源码核查**：[lib/resolve.js:75-81](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/resolve.js#L75-L81)

解析函数已具有shell参数入口，可支持小范围契约修正。

```text
export function isBuiltin(command, options = {}) {
  const platform = options.platform ?? process.platform
  const shell = options.shell ?? (platform === 'win32' ? 'cmd' : 'posix')
  const table = BUILTINS[shell]
  if (table === undefined) return false
  const key = foldCase(command, platform)
  return table.has(key)
```

#### 缺口

- 各shell真实决策与候选模型的系统性对照未建立。
  **影响**：无法宣称假设会提高诊断准确度。
  **进一步探讨**：先设计固定反例矩阵，限定只读事实采集，再逐项验证。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 谁适合试用，何时停止？

**研究主题**：采用判断

#### 完整回答

建议为有多版本工具链故障的维护者限定试用只读解析和PATH报告，先确认工具报告的cwd与目标会话一致，保持probeByDefault和probeShadowedByDefault关闭。不将报告当作自动修复授权，也不据其直接执行陌生候选。对于不使用复杂shell动态功能的受控环境，候选和遮蔽列表有可核查的实用价值。

验收应检查已知双版本安装能否列出正确绝对路径和遮蔽原因，并用真实shell输出交叉核对；若PowerShell builtin、PATH空项、别名或相对目录导致关键判断不一致，应停止依据此报告作环境更改，先使用宿主原生查询。只有源码检查不能给值得安装的结论。probe仍是单独信任决策，不因为默认关闭就把其执行风险忽略。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:94-109](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L94-L109)

默认探测关闭及可配置资源上限。

<details>
<summary>查看原文（16行）</summary>

```text
export const Config = Schema.object({
  probeTimeoutMs: Schema.number()
    .description('How long a version probe may take before it is abandoned.')
    .default(4000),
  probeByDefault: Schema.boolean()
    .description('Run a version probe on every resolve, without asking. Slower, but the report explains more.')
    .default(false),
  probeShadowedByDefault: Schema.boolean()
    .description('Probe every shadowed copy too, not just the winner. Multiplies the process spawns.')
    .default(false),
  maxSweepFiles: Schema.number()
    .description('Files examined in one sweep of a directory, so a huge directory cannot stall a session.')
    .default(400),
  runtimes: Schema.array(Schema.string())
    .description('Commands the environment report resolves.')
    .default([...RUNTIME_CANDIDATES]),
```

</details>

**依据 2 · 源码核查**：[lib/resolve.js:163-215](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/resolve.js#L163-L215)

静态模型可解释候选，但其shell边界明确。

<details>
<summary>查看原文（53行）</summary>

```text
export function resolveCommand(command, options) {
  const platform = options.platform ?? process.platform
  const pathExt = options.pathExt ?? []
  const statFile = options.statFile
  const entries = options.entries ?? []

  if (isBuiltin(command, { platform })) {
    return { command, kind: 'builtin', winner: null, candidates: [], searched: 0, note: 'handled by the shell; PATH is never consulted' }
  }

  /* A path is used as written: no PATH, no PATHEXT. */
  if (isPathCommand(command) || isAbsolute(command)) {
    const facts = statFile(command)
    const candidate = facts === undefined ? null : buildCandidate(command, command, -1, '', facts, platform)
    const runnable = candidate !== null && isRunnable(candidate, { platform })
    return {
      command,
      kind: 'absolute',
      winner: runnable ? candidate : null,
      candidates: candidate === null ? [] : [candidate],
      searched: 0,
      ...(runnable ? {} : { note: candidate === null ? 'no such file' : 'the file exists but is not runnable' }),
    }
  }

  const names = candidateNames(command, pathExt, { platform })
  const candidates = []
  const seen = new Set()
  let searched = 0

  for (const entry of entries) {
    searched += 1
    for (const name of names) {
      const absolute = joinEntry(entry.path, name)
      const facts = statFile(absolute)
      if (facts === undefined) continue
      /* A PATH entry that appears twice yields the same file twice. The
       * duplication is worth reporting, but by `which_path`, not here: this
       * list is "every distinct file that answers to the name", and counting
       * one file twice would misreport how many copies exist. */
      if (seen.has(absolute)) continue
      seen.add(absolute)
      candidates.push(buildCandidate(absolute, name, entry.index, entry.path, facts, platform))
    }
  }

  const winner = candidates.find((candidate) => isRunnable(candidate, { platform })) ?? null
  return {
    command,
    kind: winner === null ? 'missing' : 'path',
    winner,
    candidates,
    searched,
```

</details>

**依据 3 · 源码核查**：[lib/probe.js:66-86](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/probe.js#L66-L86)

可选执行必须单独评估信任。

<details>
<summary>查看原文（21行）</summary>

```text
export async function probeVersion(file, options = {}) {
  const flag = options.flag ?? VERSION_FLAGS[0]
  const timeoutMs = options.timeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS
  const platform = options.platform ?? process.platform
  const runner = options.run ?? run

  try {
    const { stdout, stderr } = await runner(file, [flag], {
      timeout: timeoutMs,
      maxBuffer: MAX_OUTPUT,
      windowsHide: true,
      ...(options.signal === undefined ? {} : { signal: options.signal }),
    })
    const combined = `${stdout ?? ''}${stderr ?? ''}`
    const version = extractVersion(combined)
    return version === undefined
      ? { path: file, flag, ok: false, reason: 'ran, but printed nothing that looks like a version' }
      : { path: file, flag, ok: true, version }
  } catch (error) {
    return { path: file, flag, ok: false, ...describeFailure(error, platform) }
  }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
