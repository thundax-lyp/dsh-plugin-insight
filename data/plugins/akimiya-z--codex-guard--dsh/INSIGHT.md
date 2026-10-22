# dsh-codex-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[87e138c](https://github.com/Akimiya-z/codex-guard/tree/87e138cdcca2e2929073bb913212dc06769087fc/dsh)

<!-- BEGIN META -->
[![GitHub ★ 133](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=133&color=yellow&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard)
<!-- END META -->

> **实现功能**：DSH 单工具包装 codex-guard CLI，执行提交前本地 diff hygiene 扫描。

> **核心亮点**：把已有 codex-guard CLI 作为 DSH 工具暴露，并避免 Windows cmd shell 解析 ref。详见[Q02](#research-q02)。

> **风险与缺陷**：未传 --commits 却描述会查提交主题；同步 npx 无超时/版本锁，运行失败也只返回字符串。详见[Q03](#research-q03)。

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
  - [Q01 · DSH 子组件能在提交前检查什么，与仓库 GitHub Action 有何不同？](#detail-section-11)
  - [Q02 · 工具怎样启动 CLI、传 ref 并返回结果？](#detail-section-12)
  - [Q03 · 工具描述的 commit/CI 保障是否由实际调用提供？](#detail-section-13)
  - [Q04 · 使用本地 guard 的依赖与代价是什么？](#detail-section-14)
  - [Q05 · 怎样把这个工具用于可复核的提交前门槛？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent 提交前检查未完成标记和密钥候选；不得取代 PR CI/人工审阅。

独立 codex-guard CLI 或 git diff + secret/TODO 扫描；DSH 包仅缩短入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| codex_guard | 提交前扫描 | 不查 CI/PR |
| --git ref | 比较变更 | 不传 --commits |
| npx 调用 | 获取 CLI | 未锁版本/同步无超时 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH tools/dsh-tools | 注册 | 工具不可见 |
| npm/npx/网络或缓存 | CLI 获取 | 阻塞/失败 |
| Git 仓库/diff | 扫描 | 无效结果 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 调用 | 指定 ref 或未提交变更 | CLI 成功运行 |
| 审核 | 看 findings/coverage | 无漏扫且候选被核 |
| CI | 独立远端门槛 | 正式状态为绿 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 安装 | DSH 子包与 npm/Git | 版本漂移 |
| 扫描 | 同步 npx/本地 diff | 首次等待/阻塞 |
| 审阅 | 核 findings 与 skipped | 误报/漏报 |

| 结果 | 源码支持 | 不支持/未证实 |
| --- | --- | --- |
| 本地扫描 | --git diff | PR CI/评论不在子包 |
| 提交主题 | 描述提及 | 没传 --commits |
| 机读 | --json 可选 | 错误仍字符串 |

> **思考**：未传 --commits 却描述会查提交主题；同步 npx 无超时/版本锁，运行失败也只返回字符串。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把已有 codex-guard CLI 作为 DSH 工具暴露，并避免 Windows cmd shell 解析 ref。详见[Q02](#research-q02)。

把已有 codex-guard CLI 作为 DSH 工具暴露，并避免 Windows cmd shell 解析 ref。详见[Q02](#research-q02)。

参数数组避免 shell 拼接；spawnSync 无 timeout/maxBuffer 且 npx --yes 未锁 CLI 版本；返回内容不是结构化通过/失败信号。

<a id="detail-section-5"></a>

### 1.4 主要限制

未传 --commits 却描述会查提交主题；同步 npx 无超时/版本锁，运行失败也只返回字符串。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

作为提交前提示使用，始终看扫描覆盖和命令状态；CI 保护单独配置。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持本地扫描包装；描述中的提交主题检查未传 --commits，CI/PR 能力不在该组件内。

- 已检查：作者 README、包清单、源码路径 dsh/package.json、dsh/index.js、dsh/cordis.patch.yml、src/cli.js、src/local-files.js、README.md 及固定范围 inventory；组件：dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交 dsh/ 子组件及直接调用的根 CLI 参数/未跟踪文件源码；未运行目标工具。
- 下一步：隔离 Git 样本含 TODO、密钥、坏提交主题和大/二进制未跟踪文件，模拟 npm 缺网/长输出，核错误和覆盖状态。

**分析版本**

- **仓库**：[Akimiya-z/codex-guard](https://github.com/Akimiya-z/codex-guard)
- **版本号**：1.9.0（[固定提交 87e138c](https://github.com/Akimiya-z/codex-guard/tree/87e138cdcca2e2929073bb913212dc06769087fc)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

绑定 CLI 版本、带覆盖率的结构化状态及受限异步执行可把提醒变成可靠本地门槛；尚未实现。详见[Q05](#research-q05)。

隔离 Git 样本含 TODO、密钥、坏提交主题和大/二进制未跟踪文件，模拟 npm 缺网/长输出，核错误和覆盖状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 96 | 75 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard/issues?q=is%3Aissue+created%3A2026-09-22T05%3A52%3A26.306Z..2026-10-22T05%3A52%3A26.306Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A52%3A26.306Z..2026-10-22T05%3A52%3A26.306Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：把 DSH 子包的本地 CLI 包装与主仓 GitHub Action 能力清楚分开。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 子组件能在提交前检查什么，与仓库 GitHub Action 有何不同？

**研究主题**：场景与需求

#### 完整回答

这里的目标是 codex-guard 仓库 dsh/ 子组件，只向 DSH 注册 codex_guard 工具，调用本地 CLI 扫当前仓库未提交改动或相对 ref 的 diff。仓库主 README 讲 GitHub PR Action 的 CI 状态、评论、注释等能力不能迁移给这个 DSH 工具；本组件没有 GitHub API 访问或 PR 评论。合格结果是本地候选报告被人工阅读后决定是否提交，基线是 git diff + secret/TODO 扫描和常规 CI。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/package.json:1-27](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/package.json#L1-L27)

子包身份。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "dsh-codex-guard",
  "version": "1.9.0",
  "description": "DeepSeek Harness tool: pre-submit hygiene checks (TODO leftovers, hardcoded secrets, commit subjects) for agent-authored pull requests.",
  "type": "module",
  "main": "index.js",
  "files": [
    "index.js",
    "cordis.patch.yml"
  ],
  "keywords": [
    "dsh",
    "deepseek-harness",
    "codex-guard",
    "code-review",
    "quality-gate"
  ],
  "license": "MIT",
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

</details>

**依据 2 · 源码核查**：[dsh/index.js:38-68](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L38-L68)

本地 CLI 调用。

<details>
<summary>查看原文（31行）</summary>

```text
/**
 * Run the codex-guard pre-submit checks inside DeepSeek Harness.
 *
 * The tool shells out to the published CLI (`npx --yes codex-guard`) so the
 * harness only needs a network connection on first use; the checks themselves
 * are the same deterministic TODO/secret/commit scans the GitHub Action runs.
 *
 * Note: the CLI exits 1 when *blocking findings exist* — that is a normal
 * report, not a crash — so we never throw on a nonzero exit code.
 */
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
}
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:70-96](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L70-L96)

只注册一个工具。

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

**依据 4 · 作者声明**：[README.md:42-55](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/README.md#L42-L55)

根仓 Action 功能说明，非 DSH 功能。

<details>
<summary>查看原文（14行）</summary>

```text
## How it works

Codex Guard runs on `pull_request`, figures out whether the PR looks
agent-generated (via label, branch prefix, or title), and then:

| Check | What it flags |
| --- | --- |
| 🧹 TODO scan | `TODO` / `FIXME` / `XXX` / `HACK` / `WIP` markers on **added lines only** |
| 🔐 Secret scan | AWS (access + secret keys), GitHub, Google, OpenAI, Anthropic, Slack, Stripe, npm, SendGrid, Telegram, Azure connection strings, JWTs, hardcoded credentials, connection strings (values are redacted in reports) |
| 💬 Commit hygiene | Subjects that don't match conventional commits, empty subjects |
| 🧪 CI status | Failing status checks **or** check runs on the PR head commit |

Each finding is posted as a GitHub **check-run annotation at the exact file and
line**, plus a human-readable summary comment on the PR.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具怎样启动 CLI、传 ref 并返回结果？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

runGuard 在非 Windows 直接调用 npx，在 Windows 定位 npx-cli.js 后用当前 node 运行，避免通过 cmd.exe 解析 ref；使用 spawnSync 参数数组，拼 --yes codex-guard --git [ref] [--json]，cwd 为 DSH 进程当前工作目录。CLI 非零退出不抛异常，而是把 stdout/stderr 文本当工具结果。增量是让 agent 在 DSH 对话中调用现成 CLI；TODO/secret 规则来自主仓 CLI，不是 DSH 子包独有。Windows/其他平台实际安装和 PATH 尚未试。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:9-36](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L9-L36)

Windows npx 启动安全设计。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * On Windows, invoke npm's JavaScript entry point through the active Node
 * binary. Calling the npx.cmd shim directly would require cmd.exe, which
 * would turn a user-provided git ref into shell input. Standard Node installs
 * ship this script alongside node.exe; npm_execpath handles managed installs.
 */
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
}
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:48-68](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L48-L68)

同步 spawn 和输出选择。

<details>
<summary>查看原文（21行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:70-96](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L70-L96)

工具注册。

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

**依据 4 · 源码核查**：[src/cli.js:267-331](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/cli.js#L267-L331)

CLI 参数语义。

<details>
<summary>查看原文（65行）</summary>

```text
function parseArgs(argv) {
  const opts = {
    diffFile: null,
    git: false,
    gitRef: null,
    patterns: null,
    exclude: [],
    excludeExplicit: false,
    failOn: [],
    failOnExplicit: false,
    preset: null,
    configPath: '.github/codex-guard.yml',
    configExplicit: false,
    noConfig: false,
    checkCommits: false,
    warnTodos: false,
    json: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) throw new UsageError(`missing value for ${arg}`);
      return argv[++i];
    };
    switch (arg) {
      case '--diff': opts.diffFile = next(); break;
      case '--git':
        // `--git` with no ref scans uncommitted changes (git diff HEAD).
        opts.git = true;
        if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opts.gitRef = argv[++i];
        break;
      case '--patterns': opts.patterns = next().split(',').map((s) => s.trim()).filter(Boolean); break;
      case '--commit-pattern':
        opts.commitPattern = next();
        opts.commitPatternExplicit = true;
        break;
      case '--exclude':
        opts.exclude = next().split(',').map((s) => s.trim()).filter(Boolean);
        opts.excludeExplicit = true;
        break;
      case '--fail-on':
        opts.failOn = next().split(',').map((s) => s.trim()).filter(Boolean);
        opts.failOnExplicit = true;
        break;
      case '--preset':
        opts.preset = next().toLowerCase();
        if (!PRESET_NAMES.includes(opts.preset)) {
          throw new UsageError(`unknown preset: ${opts.preset}`);
        }
        break;
      case '--config':
        opts.configPath = next();
        opts.configExplicit = true;
        break;
      case '--no-config': opts.noConfig = true; break;
      case '--commits': opts.checkCommits = true; break;
      case '--warn-todos': opts.warnTodos = true; break;
      case '--json': opts.json = true; break;
      case '-h':
      case '--help': opts.help = true; break;
      default: throw new UsageError(`unknown option: ${arg}`);
    }
  }
  if (!opts.help && !opts.diffFile && !opts.git) {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工具描述的 commit/CI 保障是否由实际调用提供？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

DSH 工具描述声称检查非规范提交主题，但 runGuard 没有传 CLI 的 --commits；根 CLI 说明该标志才启用提交主题检查，因此该工具默认只检查本地内容而不会按描述检查 commit 主题。它也不调用 GitHub Action CI 状态检查，不能据此宣称 PR 绿灯。spawnSync 未设超时或 CLI 版本，也未显式配置输出缓冲策略，使用运行时默认设置，npx --yes 首次可能下载最新 CLI，若网络卡住会阻塞宿主线程；失败时返回字符串，用户难从结构上区分“无问题”与运行故障。无 ref 时 CLI 包含 tracked/untracked，但大文件/二进制和超限文件会跳过，报告覆盖率须看清。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:38-68](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L38-L68)

调用参数无 --commits 和无 timeout。

<details>
<summary>查看原文（31行）</summary>

```text
/**
 * Run the codex-guard pre-submit checks inside DeepSeek Harness.
 *
 * The tool shells out to the published CLI (`npx --yes codex-guard`) so the
 * harness only needs a network connection on first use; the checks themselves
 * are the same deterministic TODO/secret/commit scans the GitHub Action runs.
 *
 * Note: the CLI exits 1 when *blocking findings exist* — that is a normal
 * report, not a crash — so we never throw on a nonzero exit code.
 */
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
}
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:70-96](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L70-L96)

工具描述包含 commit。

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

**依据 3 · 源码核查**：[src/cli.js:13-21](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/cli.js#L13-L21)

CLI 说明 --commits 才查主题。

```text
 *   node src/cli.js --git origin/main [--commits] [options]
 *
 * Options:
 *   --patterns TODO,FIXME,XXX   markers to flag (default: TODO,FIXME,XXX,HACK,WIP)
 *   --exclude docs/,test/       file path substrings to skip in the secret scan
 *   --fail-on todos,secrets,... which checks block (default: legacy — todos &
 *                               secrets block, commits block when checked)
 *   --warn-todos                TODO findings are non-blocking
 *   --commits                   with --git: also check commit subjects in range
```

**依据 4 · 源码核查**：[src/local-files.js:26-82](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/local-files.js#L26-L82)

untracked 跳过边界。

<details>
<summary>查看原文（57行）</summary>

```text
/**
 * Read Git-ignored-aware untracked files as all-added patches.
 *
 * `git diff` does not include untracked files, but those are exactly where a
 * newly-created secret or unfinished-work marker often lives before the first
 * commit. NUL output keeps unusual filenames (spaces/newlines) unambiguous.
 */
function collectUntrackedFiles({ execGit, root, readBuffer, statFile } = {}) {
  const read = readBuffer || ((filename) => fs.readFileSync(filename));
  const stat = statFile || ((filename) => fs.lstatSync(filename));
  const output = execGit(['ls-files', '--others', '--exclude-standard', '-z']);
  const names = String(output).split('\0').filter(Boolean);
  const files = [];
  const skipped = [];

  for (const filename of names) {
    const absolute = safeRepoPath(root, filename);
    if (!absolute) {
      skipped.push({ file: filename, reason: 'path escapes repository root' });
      continue;
    }

    let info;
    try {
      info = stat(absolute);
    } catch {
      skipped.push({ file: filename, reason: 'file became unavailable while scanning' });
      continue;
    }
    if (!info.isFile()) {
      skipped.push({ file: filename, reason: 'not a regular file' });
      continue;
    }
    if (info.size > MAX_UNTRACKED_BYTES) {
      skipped.push({
        file: filename,
        reason: `larger than ${MAX_UNTRACKED_BYTES / 1024 / 1024} MiB local safety limit`,
      });
      continue;
    }

    let buffer;
    try {
      buffer = read(absolute);
    } catch {
      skipped.push({ file: filename, reason: 'file could not be read' });
      continue;
    }
    const bytes = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    if (bytes.includes(0)) {
      skipped.push({ file: filename, reason: 'binary file' });
      continue;
    }
    files.push({ filename, patch: addedFilePatch(bytes.toString('utf8')), untracked: true });
  }

  return { files, skipped };
```

</details>

#### 缺口

- 未执行本地 CLI/DSH。
  **影响**：实际下载、阻塞和输出呈现未知。
  **进一步探讨**：隔离假 npm/仓库测试缺网、超长输出、提交主题。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用本地 guard 的依赖与代价是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

子包 1.9.0 MIT，peer 要 Cordis 与 dsh-tools，但 CLI 通过未锁版本的 npx 调用外部 npm 包；需要 Node/npm/npx、可用网络或本地缓存、Git 工作树及可读 diff。首次下载和同步扫描有等待与供应链更新成本；规则扫描误报/漏报、未跟踪文件 8MiB 上限等决定复核成本。与 GitHub Action 的远端 PR 保护是另一部署路径。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/package.json:1-27](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/package.json#L1-L27)

子包 peer 和许可。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "dsh-codex-guard",
  "version": "1.9.0",
  "description": "DeepSeek Harness tool: pre-submit hygiene checks (TODO leftovers, hardcoded secrets, commit subjects) for agent-authored pull requests.",
  "type": "module",
  "main": "index.js",
  "files": [
    "index.js",
    "cordis.patch.yml"
  ],
  "keywords": [
    "dsh",
    "deepseek-harness",
    "codex-guard",
    "code-review",
    "quality-gate"
  ],
  "license": "MIT",
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

</details>

**依据 2 · 源码核查**：[dsh/index.js:48-68](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L48-L68)

npx 未锁版本。

<details>
<summary>查看原文（21行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[src/local-files.js:6-82](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/local-files.js#L6-L82)

本地未跟踪文件限制。

<details>
<summary>查看原文（77行）</summary>

```text
const MAX_UNTRACKED_BYTES = 8 * 1024 * 1024;

function addedFilePatch(text) {
  if (!text) return '';
  const normalized = String(text).replace(/\r\n?/g, '\n');
  const lines = normalized.endsWith('\n')
    ? normalized.slice(0, -1).split('\n')
    : normalized.split('\n');
  if (!lines.length) return '';
  return `@@ -0,0 +1,${lines.length} @@\n${lines.map((line) => `+${line}`).join('\n')}\n`;
}

function safeRepoPath(root, filename) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, filename);
  return resolved === resolvedRoot || resolved.startsWith(`${resolvedRoot}${path.sep}`)
    ? resolved
    : null;
}

/**
 * Read Git-ignored-aware untracked files as all-added patches.
 *
 * `git diff` does not include untracked files, but those are exactly where a
 * newly-created secret or unfinished-work marker often lives before the first
 * commit. NUL output keeps unusual filenames (spaces/newlines) unambiguous.
 */
function collectUntrackedFiles({ execGit, root, readBuffer, statFile } = {}) {
  const read = readBuffer || ((filename) => fs.readFileSync(filename));
  const stat = statFile || ((filename) => fs.lstatSync(filename));
  const output = execGit(['ls-files', '--others', '--exclude-standard', '-z']);
  const names = String(output).split('\0').filter(Boolean);
  const files = [];
  const skipped = [];

  for (const filename of names) {
    const absolute = safeRepoPath(root, filename);
    if (!absolute) {
      skipped.push({ file: filename, reason: 'path escapes repository root' });
      continue;
    }

    let info;
    try {
      info = stat(absolute);
    } catch {
      skipped.push({ file: filename, reason: 'file became unavailable while scanning' });
      continue;
    }
    if (!info.isFile()) {
      skipped.push({ file: filename, reason: 'not a regular file' });
      continue;
    }
    if (info.size > MAX_UNTRACKED_BYTES) {
      skipped.push({
        file: filename,
        reason: `larger than ${MAX_UNTRACKED_BYTES / 1024 / 1024} MiB local safety limit`,
      });
      continue;
    }

    let buffer;
    try {
      buffer = read(absolute);
    } catch {
      skipped.push({ file: filename, reason: 'file could not be read' });
      continue;
    }
    const bytes = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    if (bytes.includes(0)) {
      skipped.push({ file: filename, reason: 'binary file' });
      continue;
    }
    files.push({ filename, patch: addedFilePatch(bytes.toString('utf8')), untracked: true });
  }

  return { files, skipped };
```

</details>

**依据 4 · 作者声明**：[README.md:99-165](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/README.md#L99-L165)

Action 安装与保护路径。

<details>
<summary>查看原文（67行）</summary>

````text
## Quick start

From the root of your Git repository:

```bash
npx --yes codex-guard init
git add .github/workflows/codex-guard.yml
git commit -m "ci: add Codex Guard"
```

The installer starts in **observe mode**: findings are annotated, but they do
not fail the workflow while you tune the policy. Three setup presets keep the
rollout explicit:

| Preset | Command | Behavior |
| --- | --- | --- |
| Observe | `npx --yes codex-guard init` | Report everything without blocking. |
| Balanced | `npx --yes codex-guard init --preset balanced` | Block secrets, commit hygiene, and red CI; warn on unfinished markers. |
| Strict | `npx --yes codex-guard init --preset strict` | Block every default finding. `--strict` remains an alias. |

Prefer to add it by hand? The generated workflow is:

```yaml
# Generated by codex-guard init
name: Codex Guard
on:
  pull_request:

permissions:
  contents: read
  statuses: read
  pull-requests: write
  checks: write

jobs:
  codex-guard:
    runs-on: ubuntu-latest
    steps:
      - uses: Akimiya-z/codex-guard@v1
        with:
          preset: 'observe'
```

That's it. Codex Guard now reports on matching PRs without blocking them.

> Upgrading an existing workflow? Add `statuses: read` to its `permissions`
> block. `checks: write` already includes read access for check runs. Without
> status access, Codex Guard reports incomplete CI visibility and returns a
> neutral result instead of claiming every check is green.

One-click from the [GitHub Actions Marketplace](https://github.com/marketplace/actions/codex-guard-pr-quality-gate).

### Turn on enforcement

After a few representative PRs, choose how strongly to enforce:

```yaml
- uses: Akimiya-z/codex-guard@v1
  with:
    preset: 'balanced' # or 'strict'
```

`balanced` warns on unfinished markers while blocking secrets, commit hygiene,
and red CI. `strict` blocks every default finding. For a custom mix, use
`fail-on` and the individual inputs. Then require the status check under
**Settings → Branches → Require status checks → `Codex Guard`**. A blocking
finding will prevent the PR from merging until it is resolved (or the PR is
````

</details>

#### 缺口

- 未测性能和 npm 版本一致性。
  **影响**：本地检查可重现性未知。
  **进一步探讨**：固定 CLI 版本及大小矩阵对照结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样把这个工具用于可复核的提交前门槛？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合当提交前提醒：运行后明确核 CLI 是否启动、扫描了哪些文件、遗漏哪些文件，再由人工检查；不要把工具文本当作 CI/PR 放行。未实现的改进是假设子包绑定同版本 CLI、显式传 --commits（仅有 ref 才查）、异步进程设置超时/输出上限，并返回结构化状态/覆盖率/规则结果；比较当前与改进版的误判、阻塞时间、版本漂移和未检文件数。正式保护仍在 CI 侧配置独立 Action。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:48-96](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L48-L96)

当前字符串输出/未锁 npx。

<details>
<summary>查看原文（49行）</summary>

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
}

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

**依据 2 · 源码核查**：[src/cli.js:294-297](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/cli.js#L294-L297)

--git 默认。

```text
      case '--git':
        // `--git` with no ref scans uncommitted changes (git diff HEAD).
        opts.git = true;
        if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opts.gitRef = argv[++i];
```

**依据 3 · 源码核查**：[src/local-files.js:26-82](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/local-files.js#L26-L82)

覆盖边界。

<details>
<summary>查看原文（57行）</summary>

```text
/**
 * Read Git-ignored-aware untracked files as all-added patches.
 *
 * `git diff` does not include untracked files, but those are exactly where a
 * newly-created secret or unfinished-work marker often lives before the first
 * commit. NUL output keeps unusual filenames (spaces/newlines) unambiguous.
 */
function collectUntrackedFiles({ execGit, root, readBuffer, statFile } = {}) {
  const read = readBuffer || ((filename) => fs.readFileSync(filename));
  const stat = statFile || ((filename) => fs.lstatSync(filename));
  const output = execGit(['ls-files', '--others', '--exclude-standard', '-z']);
  const names = String(output).split('\0').filter(Boolean);
  const files = [];
  const skipped = [];

  for (const filename of names) {
    const absolute = safeRepoPath(root, filename);
    if (!absolute) {
      skipped.push({ file: filename, reason: 'path escapes repository root' });
      continue;
    }

    let info;
    try {
      info = stat(absolute);
    } catch {
      skipped.push({ file: filename, reason: 'file became unavailable while scanning' });
      continue;
    }
    if (!info.isFile()) {
      skipped.push({ file: filename, reason: 'not a regular file' });
      continue;
    }
    if (info.size > MAX_UNTRACKED_BYTES) {
      skipped.push({
        file: filename,
        reason: `larger than ${MAX_UNTRACKED_BYTES / 1024 / 1024} MiB local safety limit`,
      });
      continue;
    }

    let buffer;
    try {
      buffer = read(absolute);
    } catch {
      skipped.push({ file: filename, reason: 'file could not be read' });
      continue;
    }
    const bytes = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    if (bytes.includes(0)) {
      skipped.push({ file: filename, reason: 'binary file' });
      continue;
    }
    files.push({ filename, patch: addedFilePatch(bytes.toString('utf8')), untracked: true });
  }

  return { files, skipped };
```

</details>

**依据 4 · 作者声明**：[README.md:99-165](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/README.md#L99-L165)

CI 侧部署说明。

<details>
<summary>查看原文（67行）</summary>

````text
## Quick start

From the root of your Git repository:

```bash
npx --yes codex-guard init
git add .github/workflows/codex-guard.yml
git commit -m "ci: add Codex Guard"
```

The installer starts in **observe mode**: findings are annotated, but they do
not fail the workflow while you tune the policy. Three setup presets keep the
rollout explicit:

| Preset | Command | Behavior |
| --- | --- | --- |
| Observe | `npx --yes codex-guard init` | Report everything without blocking. |
| Balanced | `npx --yes codex-guard init --preset balanced` | Block secrets, commit hygiene, and red CI; warn on unfinished markers. |
| Strict | `npx --yes codex-guard init --preset strict` | Block every default finding. `--strict` remains an alias. |

Prefer to add it by hand? The generated workflow is:

```yaml
# Generated by codex-guard init
name: Codex Guard
on:
  pull_request:

permissions:
  contents: read
  statuses: read
  pull-requests: write
  checks: write

jobs:
  codex-guard:
    runs-on: ubuntu-latest
    steps:
      - uses: Akimiya-z/codex-guard@v1
        with:
          preset: 'observe'
```

That's it. Codex Guard now reports on matching PRs without blocking them.

> Upgrading an existing workflow? Add `statuses: read` to its `permissions`
> block. `checks: write` already includes read access for check runs. Without
> status access, Codex Guard reports incomplete CI visibility and returns a
> neutral result instead of claiming every check is green.

One-click from the [GitHub Actions Marketplace](https://github.com/marketplace/actions/codex-guard-pr-quality-gate).

### Turn on enforcement

After a few representative PRs, choose how strongly to enforce:

```yaml
- uses: Akimiya-z/codex-guard@v1
  with:
    preset: 'balanced' # or 'strict'
```

`balanced` warns on unfinished markers while blocking secrets, commit hygiene,
and red CI. `strict` blocks every default finding. For a custom mix, use
`fail-on` and the individual inputs. Then require the status check under
**Settings → Branches → Require status checks → `Codex Guard`**. A blocking
finding will prevent the PR from merging until it is resolved (or the PR is
````

</details>

#### 缺口

- 版本锁/结构化状态/超时未实现。
  **影响**：不能视为当前能力。
  **进一步探讨**：隔离实现后与基线比较。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
