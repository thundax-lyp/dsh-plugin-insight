# dsh-codex-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[87e138c](https://github.com/Akimiya-z/codex-guard/tree/87e138cdcca2e2929073bb913212dc06769087fc/dsh)

<!-- BEGIN META -->
[![GitHub ★ 133](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=133&color=yellow&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard)
<!-- END META -->

> **实现功能**：在 DSH 中调用 codex-guard，对 Git 变更进行提交前卫生检查。

> **核心亮点**：将既有 CLI 接入 DSH 工具链，并在 Windows 绕过 cmd shell 传参。增量是接线便利和平台适配，扫描算法归属原 CLI。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：工具描述包含提交主题检查，但调用未传 --commits；同时将执行状态折叠成字符串，不能承担可靠放行。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要本地 hygiene 工具，DSH 子组件相对独立 CLI 增加什么？](#detail-section-11)
  - [Q02 · 参数如何到达扫描器，Windows 调用与结果保留的边界是什么？](#detail-section-12)
  - [Q03 · 工具声称的提交主题检查和可靠放行是否实际成立？](#detail-section-13)
  - [Q04 · 从启用到故障恢复有哪些依赖与成本，谁承担？](#detail-section-14)
  - [Q05 · 如何提高该接线的可信度，当前何时值得试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望在DSH编码会话中扫描未提交Git变更的开发者，交付由人复核的TODO/密钥候选报告；需要强制合并门槛时，本组件的字符串报告不足以担当放行依据。

直接运行固定版本 CLI 或独立 CI 是简单参照；本组件减少手工接线，不替代 CI 规则。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| codex_guard | 本地 Git 变更 hygiene 候选 | 依赖 cwd/npm；输出非结构化放行 |
| Windows 入口定位 | 避免 cmd shell 解释 ref | 依赖 npm 路径可定位 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools、Cordis peer | 启动必需 | 注册工具 | 改独立CLI |
| Node/npm/npx、Git仓库 | 扫描必需 | 执行和生成diff | 无法扫描，人工检查 |
| npm网络/缓存 | 获取CLI必需 | 下载包 | 预先固定包或停止 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户启用 patch | 工具注册；失败查 peer |
| 2 | 用户核 cwd/ref 与版本 | 目标仓库正确；错误先停 |
| 3 | Agent 调工具、用户审报告 | 区分 findings/执行失败；修正后复查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | npm 下载与缓存，金额未知 | 启用、核对版本/cwd | 首次网络等待未测 |
| 持续使用 | 同步扫描与 Agent 解读，费用未知 | 判断候选、修正误报 | 设备/diff/模型决定成本 |
| 失败恢复 | 重试下载/扫描 | 区分执行错误与 findings | 恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工具接线 | 单工具调用本地 CLI | 宿主兼容与等待 |
| 内容检查 | --git 进入 CLI | 实际发布包与误报漏报 |
| 提交门槛 | 可读报告 | 无独立退出状态，不能认定自动放行 |

> **思考**：工具描述包含提交主题检查，但调用未传 --commits；同时将执行状态折叠成字符串，不能承担可靠放行。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将既有 CLI 接入 DSH 工具链，并在 Windows 绕过 cmd shell 传参。增量是接线便利和平台适配，扫描算法归属原 CLI。参见[Q01](#research-q01)、[Q02](#research-q02)。

将既有 CLI 接入 DSH 工具链，并在 Windows 绕过 cmd shell 传参。增量是接线便利和平台适配，扫描算法归属原 CLI。参见[Q01](#research-q01)、[Q02](#research-q02)。

参数数组和Windows直接调用npm JavaScript入口值得同类CLI接线借鉴；移植前须核npm布局。同步执行、未锁发布CLI及非结构化错误提高恢复负担，不能因execute为async就认定不阻塞。详见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

工具描述包含提交主题检查，但调用未传 --commits；同时将执行状态折叠成字符串，不能承担可靠放行。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察；先核实际 CLI 版本、cwd 和覆盖，再对六类场景隔离验证，不能将字符串成功返回当提交放行。参见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具接线与 Windows 参数路径有源码支持；提交主题覆盖和机读状态存在边界，未执行真实宿主验收；收据设计是假设。

- 已检查：作者 README、包清单、源码路径 dsh/index.js、dsh/package.json、dsh/cordis.patch.yml、src/cli.js 及固定范围 inventory；组件：dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查 dsh 子组件及根 README/CLI 的直接契约，未执行目标代码或宿主，不把根 Action 能力计入子组件。
- 下一步：未运行目标。下一步隔离记录版本、cwd、覆盖率与六类退出/超时场景，比较状态误判和人工时间。

**分析版本**

- **仓库**：[Akimiya-z/codex-guard](https://github.com/Akimiya-z/codex-guard)
- **版本号**：1.9.0（[固定提交 87e138c](https://github.com/Akimiya-z/codex-guard/tree/87e138cdcca2e2929073bb913212dc06769087fc)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是固定 CLI 版本并输出覆盖与退出状态收据，受限异步执行可能减少 Agent 把调用完成误作检查通过；需六类故障对照，失败时否定。参见[Q05](#research-q05)。

未运行目标。下一步隔离记录版本、cwd、覆盖率与六类退出/超时场景，比较状态误判和人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 96 | 75 | 17 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Akimiya-z/codex-guard/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的 DSH codex-guard 接线能否提供可信提交前检查，贡献与采用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要本地 hygiene 工具，DSH 子组件相对独立 CLI 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有 Node/Git 环境、希望在 DSH 编码会话中反复扫描未提交变更的开发者。输入是可选 Git ref 和 JSON 开关，合格交付是可追溯检查范围的 TODO/密钥候选报告，由开发者判断并修正。作者根 README 将产品定位为 PR 质量门槛，但 DSH 子组件只提供 codex_guard 工具，没有注册 Action、CI 检查或 PR 评论。

相对直接运行 npx codex-guard --git，增量是把调用和报告放进 Agent 工具链，省去人工切终端和粘贴输出。扫描算法属于已有 CLI，不能归为子组件原创。对本已用终端或 CI 的用户，收益仅是接线便利；对需要强制阻止合并的团队，这个入口不足以交付门槛。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:70-96](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L70-L96)

工具注册只暴露 ref/json 与字符串输出。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx) {
  ctx.tools.register(
    defineTool({
      name: 'codex_guard',
      description:
        'Run pre-submit hygiene checks on the current repository: TODO/FIXME leftovers, hardcoded secrets, and non-conventional commit subjects. Exit code 0 means clean; a report is returned either way.',
      parameters: {
        ref: {
          type: 'string',
          description:
            'Git ref to diff against, e.g. origin/main. Omit to scan uncommitted changes.',
        },
        json: {
          type: 'boolean',
          description: 'Return the machine-readable JSON report.',
        },
      },
      output: {
        schema: { type: 'string' },
        render: (_args, value) => [{ type: 'text', text: value }],
      },
      async execute(args) {
        return runGuard(args.ref, args.json)
      },
    })
  )
}
```

</details>

**依据 2 · 源码核查**：[README.md:14-24](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/README.md#L14-L24)

根作者宣称 PR 门槛，须与子组件范围区分。

<details>
<summary>查看原文（11行）</summary>

```text
leaked secrets, sloppy commits and red CI from reaching `main` — with zero review
bandwidth spent on the obvious stuff.

Works with **OpenAI Codex** (cloud & CLI), **Claude Code**, **Copilot**, and any
other agent that opens PRs against your repo.

> 🐕 **Dogfooding:** this repo gates its own AI-generated PRs. See a real failing
> example on [PR #6](https://github.com/Akimiya-z/codex-guard/pull/6) and the
> workflow behind it in `.github/workflows/codex-guard.yml`.

---
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 参数如何到达扫描器，Windows 调用与结果保留的边界是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 注册一个 codex_guard 工具，execute 调用 runGuard，后者在 process.cwd() 下同步执行 npx --yes codex-guard --git [ref]，可追加 --json。Windows 分支查找 npm 的 npx-cli.js 并用当前 node 二进制执行，避免经 cmd.exe 把 ref 当 shell 文本解析。这是可复用的平台适配，仍依赖标准或可定位的 npm 布局。

参数以数组传递是有利的工程选择；但同步子进程没有显式 timeout/maxBuffer，execute 标成 async 不能消除 spawnSync 对事件循环的等待。返回优先取 stdout，随后 stderr/状态提示；res.status 没有作为独立机读字段传给宿主。故报告可读与执行状态可靠可辨是两件事，不能把字符串正常返回当检查通过。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:15-35](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L15-L35)

Windows 从 npm 路径定位 JavaScript 入口。

<details>
<summary>查看原文（21行）</summary>

```text
export function npxInvocation({
  platform = process.platform,
  nodePath = process.execPath,
  env = process.env,
  fileExists = existsSync,
} = {}) {
  if (platform !== 'win32') return { command: 'npx', prefix: [] }

  const pathApi = win32
  const fromNpm = env.npm_execpath
    ? pathApi.join(pathApi.dirname(env.npm_execpath), 'npx-cli.js')
    : null
  const bundled = pathApi.join(
    pathApi.dirname(nodePath),
    'node_modules',
    'npm',
    'bin',
    'npx-cli.js'
  )
  const cli = [fromNpm, bundled].find((candidate) => candidate && fileExists(candidate))
  return cli ? { command: nodePath, prefix: [cli] } : null
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:48-67](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L48-L67)

固定参数、cwd、同步执行及返回策略。

<details>
<summary>查看原文（20行）</summary>

```text
function runGuard(ref, asJson) {
  const invocation = npxInvocation()
  if (!invocation) {
    return 'codex-guard failed: could not locate npm npx-cli.js next to the active Node installation'
  }
  const args = [...invocation.prefix, '--yes', 'codex-guard']
  if (ref) {
    args.push('--git', ref)
  } else {
    args.push('--git') // default: uncommitted changes in the current repo
  }
  if (asJson) args.push('--json')
  const res = spawnSync(invocation.command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  })
  if (res.error) return `codex-guard failed: ${res.error.message}`
  const out = (res.stdout || '').trim()
  if (out) return out
  return (res.stderr || '').trim() || `codex-guard exited with status ${res.status}`
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工具声称的提交主题检查和可靠放行是否实际成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键的限制是检查范围与描述不完全一致。工具描述同时列 TODO、密钥与 non-conventional commit subjects，但 runGuard 只添加 --git 和 --json，没有 --commits；固定根 CLI 将 --commits 作为独立开关，并仅在相应条件下读取提交主题。因此在这一固定源码组合中，不能把该工具宣称为已经完成提交主题检查。实际 npx 安装的版本未锁定，更不能默认等同于所读根 CLI。

其次，发现阻断项的退出码 1 被当正常报告处理可以理解，然而执行错误、用法错误与有 findings 都被折叠成字符串。Agent 若只依据工具没有抛错就继续提交，会误把完成调用当作通过检查。这里确认的是参数和状态契约缺口，没有运行复现真实漏检，也不能断言所有检查都无效。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:53-67](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L53-L67)

未传 commits，退出码不形成独立输出。

<details>
<summary>查看原文（15行）</summary>

```text
  const args = [...invocation.prefix, '--yes', 'codex-guard']
  if (ref) {
    args.push('--git', ref)
  } else {
    args.push('--git') // default: uncommitted changes in the current repo
  }
  if (asJson) args.push('--json')
  const res = spawnSync(invocation.command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  })
  if (res.error) return `codex-guard failed: ${res.error.message}`
  const out = (res.stdout || '').trim()
  if (out) return out
  return (res.stderr || '').trim() || `codex-guard exited with status ${res.status}`
```

</details>

**依据 2 · 源码核查**：[src/cli.js:15-25](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/cli.js#L15-L25)

根 CLI 明确 commits 开关与退出码。

<details>
<summary>查看原文（11行）</summary>

```text
 * Options:
 *   --patterns TODO,FIXME,XXX   markers to flag (default: TODO,FIXME,XXX,HACK,WIP)
 *   --exclude docs/,test/       file path substrings to skip in the secret scan
 *   --fail-on todos,secrets,... which checks block (default: legacy — todos &
 *                               secrets block, commits block when checked)
 *   --warn-todos                TODO findings are non-blocking
 *   --commits                   with --git: also check commit subjects in range
 *   --json                      print the raw report as JSON, nothing else
 *   -h, --help                  this help
 *
 * Exit codes: 0 = no blocking findings, 1 = blocking findings, 2 = usage error.
```

</details>

**依据 3 · 源码核查**：[src/cli.js:476-503](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/cli.js#L476-L503)

提交主题读取有独立条件。

<details>
<summary>查看原文（28行）</summary>

```text
  let commits = null;
  let localConfig = null;
  let repoRoot = null;
  let untracked = { files: [], skipped: [] };
  if (opts.diffFile) {
    diff = readFile(opts.diffFile);
  } else {
    const ref = opts.gitRef || 'HEAD';
    // Removed files cannot contain added-line findings. Excluding them keeps
    // large dependency-removal PRs from filling child_process output buffers.
    try {
      diff = execGit(['diff', '--unified=0', '--diff-filter=ACMR', ref]);
      repoRoot = execGit(['rev-parse', '--show-toplevel']).trim();
      if (!repoRoot) throw new Error('Git returned an empty repository root');
      untracked = collectUntrackedFiles({
        execGit,
        root: repoRoot,
        readBuffer: io.readBuffer,
        statFile: io.statFile,
      });
      if (opts.checkCommits) {
        const subjects = execGit(['log', '--format=%s', `${ref}..HEAD`])
          .split('\n')
          .filter(Boolean);
        commits = subjects.map((message, i) => ({ sha: `local${i}`, message, author: 'local' }));
      }
    } catch (err) {
      process.stderr.write(`codex-guard: Git scan failed: ${normalizeInline(err.message)}\n`);
```

</details>

#### 缺口

- npx 实际解析的发布版本未与源码绑定
  **影响**：运行时可能与本次固定 CLI 的契约不同
  **进一步探讨**：在隔离环境固定已审阅 CLI 版本，记录 resolved version 与三类退出场景

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 从启用到故障恢复有哪些依赖与成本，谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

启动需要 DSH 的 tools 注入服务、Cordis/dsh-tools peer、Node/npm/npx 和可用 Git 工作目录。patch 仅插入插件；没有自动安装 Git、配置 CI 或选择项目根。第一次 npx 可能需要网络与下载，扫描在宿主进程 cwd 执行，因此使用者须先确认目标仓库。无专用数据库不等于无持久状态，npm 下载缓存属于运行环境。

首次成本是核版本、安装并确认 cwd；持续成本是同步扫描等待、人工判断误报与修改；故障成本是区分 npm/网络失败、Git 用法错误与真实 findings，再重试。普通静态扫描没有强制模型请求，但 Agent 解读报告可产生其自身模型费用。缺少包缓存、diff 规模、设备与任务结果，不能给金额、毫秒或节省比例。对提交前短扫描可接受，对共享宿主长任务需优先约束等待。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/package.json:19-27](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/package.json#L19-L27)

peer 与 bundle 配置界定启动依赖。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=0.1.0-rc.1 <0.2.0 || >=0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.1 <0.2.0 || >=0.2.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

**依据 2 · 源码核查**：[dsh/index.js:48-67](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L48-L67)

npx 与 cwd 决定网络/工作目录/等待成本。

<details>
<summary>查看原文（20行）</summary>

```text
function runGuard(ref, asJson) {
  const invocation = npxInvocation()
  if (!invocation) {
    return 'codex-guard failed: could not locate npm npx-cli.js next to the active Node installation'
  }
  const args = [...invocation.prefix, '--yes', 'codex-guard']
  if (ref) {
    args.push('--git', ref)
  } else {
    args.push('--git') // default: uncommitted changes in the current repo
  }
  if (asJson) args.push('--json')
  const res = spawnSync(invocation.command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  })
  if (res.error) return `codex-guard failed: ${res.error.message}`
  const out = (res.stdout || '').trim()
  if (out) return out
  return (res.stderr || '').trim() || `codex-guard exited with status ${res.status}`
```

</details>

**依据 3 · 源码核查**：[dsh/cordis.patch.yml:1-3](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/cordis.patch.yml#L1-L3)

patch 只插入插件。

```text
- insert:
    - id: codex-guard
      name: dsh-codex-guard
```

#### 缺口

- 首次下载与大 diff 等待未测
  **影响**：总时间与共享宿主影响未知
  **进一步探讨**：按冷/热缓存及小/大 diff 记录总耗时、宿主响应与人工复核分钟数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何提高该接线的可信度，当前何时值得试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证设计假设是把执行接线升级为带版本、覆盖率和结构化状态的本地检查收据。推导来自参数不含 commits、CLI 可提供 JSON、stdout 与退出码折叠这三点。相比当前只回字符串，显式固定 CLI、异步受限执行、区分 clean/findings/execution_error，并注明哪些检查启用，可能减少 Agent 错判放行；新增版本维护和适配成本必须计入。

最小验证用同一固定版本 CLI 构造干净变更、含 TODO/伪密钥、坏 ref、npm 不可用、提交主题不规范以及超时六类场景，比较原接口与收据接口的状态误判和人工时间。若结构化后仍把未扫描当 clean，或维护负担超过直接 CLI，则否定当前设计收益。以上实验未执行。

当前结论为观察。对需要本地候选提示的单人仓库可先隔离验证，必须看实际报告、CLI 版本和扫描范围；先不要把它接为自动提交/合并条件。若能证明工作目录正确、故障可区分、扫描在可接受时间内返回，再进入小范围试用；CI 与人工审阅仍需独立配置。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:48-67](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L48-L67)

版本、执行状态和超时缺口导出改进假设。

<details>
<summary>查看原文（20行）</summary>

```text
function runGuard(ref, asJson) {
  const invocation = npxInvocation()
  if (!invocation) {
    return 'codex-guard failed: could not locate npm npx-cli.js next to the active Node installation'
  }
  const args = [...invocation.prefix, '--yes', 'codex-guard']
  if (ref) {
    args.push('--git', ref)
  } else {
    args.push('--git') // default: uncommitted changes in the current repo
  }
  if (asJson) args.push('--json')
  const res = spawnSync(invocation.command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  })
  if (res.error) return `codex-guard failed: ${res.error.message}`
  const out = (res.stdout || '').trim()
  if (out) return out
  return (res.stderr || '').trim() || `codex-guard exited with status ${res.status}`
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:70-96](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L70-L96)

目前工具输出契约为字符串。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx) {
  ctx.tools.register(
    defineTool({
      name: 'codex_guard',
      description:
        'Run pre-submit hygiene checks on the current repository: TODO/FIXME leftovers, hardcoded secrets, and non-conventional commit subjects. Exit code 0 means clean; a report is returned either way.',
      parameters: {
        ref: {
          type: 'string',
          description:
            'Git ref to diff against, e.g. origin/main. Omit to scan uncommitted changes.',
        },
        json: {
          type: 'boolean',
          description: 'Return the machine-readable JSON report.',
        },
      },
      output: {
        schema: { type: 'string' },
        render: (_args, value) => [{ type: 'text', text: value }],
      },
      async execute(args) {
        return runGuard(args.ref, args.json)
      },
    })
  )
}
```

</details>

#### 缺口

- 改进收益与兼容性未验证
  **影响**：不能升级为值得安装或可靠门槛
  **进一步探讨**：执行所列六类隔离对照并记录误判、耗时和退出恢复

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
