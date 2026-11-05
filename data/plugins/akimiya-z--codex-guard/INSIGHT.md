# codex-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[87e138c](https://github.com/Akimiya-z/codex-guard/tree/87e138cdcca2e2929073bb913212dc06769087fc)

<!-- BEGIN META -->
[![GitHub ★ 131](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=131&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Akimiya-z/codex-guard) [![npm 30d 169](https://img.shields.io/static/v1?label=npm+30d&message=169&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/codex-guard) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/codex-guard)
<!-- END META -->

> **功能**：为 DSH 注册本地 Git 差异扫描工具，仓库同时提供独立 PR 检查。

> **亮点**：[Q01](#research-q01) 把静态问题前移到代理可调用入口。

> **主要限制**：[Q02](#research-q02) npx 版本未固定，扫描目录是进程 cwd，结果是文本。

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
  - [Q01 · 代理作者和维护者分别能在哪一步拦截提交问题？](#detail-section-11)
  - [Q02 · 本地调用的可重复性与 Windows 兼容依赖什么？](#detail-section-12)
  - [Q03 · 怎样比较本地预检与直接等待 CI？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：代理作者提交前需要发现 TODO、疑似密钥和提交标题问题。

直接等 CI 或人工检查 Git diff。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH 扫描 | 提前发现规则问题 | 使用进程 cwd 和外部 CLI |
| PR 门禁 | 按条件设置检查结果 | 需 Action 与事件权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node、npm、Git | 本地检查必需 | 运行 CLI | 首次包获取需网络或缓存 |
| GitHub token | Action 使用 | 读取数据及按需回写 | fork 权限需校验 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定测试差异 | 确认进程目录 |
| 预检 | 读取本地工具报告 | 区分命中和执行失败 |
| 核对 | 比较 Action | 记录误报 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 安装和配置检查规则 | 核对 ref 与分支 |
| 持续 | 用时未知 | 更新规则与扫描版本 | 跟踪误报 |
| 失败 | 用时未知 | 回到原 CI | 保留日志与输入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 提交卫生 | 在提交前定位机械问题 | 实际 CI 首轮通过率 |

> **思考**：[Q02](#research-q02) npx 版本未固定，扫描目录是进程 cwd，结果是文本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把静态问题前移到代理可调用入口。

[Q02](#research-q02) npx 版本及 stdout 文本带来复验约束。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) npx 版本未固定，扫描目录是进程 cwd，结果是文本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用测试仓库对照本地报告与 PR 检查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持本地调用及 Action，未复跑。

- 已检查：作者 README、包清单、源码路径 dsh/index.js、src/main.js、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 DSH 适配及 PR 入口源码；未调用 GitHub、npx 或宿主。
- 下一步：固定差异在多种执行目录、版本、标记和权限下对照。

**分析版本**

- **仓库**：[Akimiya-z/codex-guard](https://github.com/Akimiya-z/codex-guard)
- **版本号**：1.16.0（[固定提交 87e138c](https://github.com/Akimiya-z/codex-guard/tree/87e138cdcca2e2929073bb913212dc06769087fc)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 用同一差异验证本地预检能否减少首轮 CI 失败。

固定差异在多种执行目录、版本、标记和权限下对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1353 | — | — | 8150 |
| .js | source | 17 | 2757 | 2289 | 245 | — |
| .js | test | 20 | 2675 | 2397 | 55 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Akimiya-z/codex-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Akimiya-z/codex-guard/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Akimiya-z/codex-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：能否让代理在提交前发现基础交付问题，并把最终检查交回 PR 流程？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 代理作者和维护者分别能在哪一步拦截提交问题？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

DSH 模型工具调用本地 Git 扫描，可传比较 ref 和 JSON 开关。独立 PR Action 有 agent 标识、忽略标签和 CI 检查，能在托管侧发出检查结果。相对 PR 才发现问题，本地工具提供预提交反馈。Action 识别依赖标签、分支和关键字，覆盖受仓库约定限制。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:70-95](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L70-L95)

DSH 工具注册。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/main.js:205-250](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/main.js#L205-L250)

Action 条件与检查结果。

<details>
<summary>查看原文（46行）</summary>

```text
  }

  const ignoreLabel = (inputs.ignoreLabel || '').toLowerCase();
  if (pr.labels.some((l) => l.toLowerCase() === ignoreLabel)) {
    coreImpl.info(
      `codex-guard: PR carries the "${inputs.ignoreLabel}" label — skipping all checks.`
    );
    coreImpl.setOutput('result', 'pass');
    coreImpl.setOutput('detected-agent', 'false');
    coreImpl.setOutput('failed-checks', '');
    coreImpl.setOutput('findings-json', '{}');
    return { result: 'pass', detectedAgent: false, groups: emptyGroups() };
  }

  const detected = detectAgent(
    { labels: pr.labels, headBranch: pr.headRef, title: pr.title },
    {
      labels: inputs.agentLabels,
      branchPrefixes: inputs.agentBranchPrefixes,
      keywords: inputs.agentKeywords,
    }
  );

  if (inputs.gateAgentsOnly && !detected.agent) {
    coreImpl.info(
      'codex-guard: PR does not appear to be AI-generated — passing without checks.'
    );
    coreImpl.setOutput('result', 'pass');
    coreImpl.setOutput('detected-agent', 'false');
    coreImpl.setOutput('findings-json', '{}');
    return { result: 'pass', detectedAgent: false, groups: emptyGroups() };
  }

  if (!octokit) {
    throw new Error('No GitHub token available. Set input github-token.');
  }

  const { groups, triggered } = await inspectPr(octokit, ctx, inputs);

  const passed = triggered.length === 0;
  const outcome = inputs.softFail ? 'pass' : passed ? 'pass' : 'fail';
  const incompleteCoverage = isCoverageIncomplete(groups.coverage);
  const incompleteCiVisibility = inputs.checkCi && groups.ci.complete === false;
  const pendingCi = inputs.checkCi && groups.ci.settled === false;

  // ---- Reporting ----------------------------------------------------------
```

</details>

#### 缺口

- 无真实 PR 数据
  **影响**：覆盖和误报率未知
  **进一步探讨**：准备代理标记、未标记和忽略标签三类 PR

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地调用的可重复性与 Windows 兼容依赖什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

DSH 使用未固定版本的 npx codex-guard 并等待子进程，执行目录取 Host 的 cwd。Windows 寻找 npm 的 npx-cli.js 交由 Node 启动，避免通过 cmd 解释 ref。返回优先取 stdout，发现阻断项的退出码仍作为文本报告；空输出才回退 stderr 或退出码，调用方不能单凭工具返回成功判断扫描通过。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:15-35](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L15-L35)

Windows 查找 npm 脚本。

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

npx 参数、当前目录和结果映射。

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

#### 缺口

- 未复跑各系统和网络条件
  **影响**：不能验证真实 profile 的工作目录和版本稳定性
  **进一步探讨**：在隔离仓库核对 cwd、缓存、离线、命中和进程失败

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样比较本地预检与直接等待 CI？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在非关键仓库用示例差异验证 DSH 工具报告，并比对同一差异的 Action 输出。可对照仅 Action 的流程，记录首轮失败、重复运行和规则误报。fork Action 采用写权限时先审阅事件与执行路径。出现扫描遗漏或版本变化导致裁决不一致时暂停加门禁。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:48-67](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js#L48-L67)

本地版本与输入边界。

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

**依据 2 · 作者声明**：[README.md:438-442](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/README.md#L438-L442)

作者的 fork 事件与权限指引。

```text
**Keep gating agent PRs from forks:**

Use `pull_request_target` so the check runs with your repo's write token. The
action reads the fork PR's files, commits and head SHA from the event payload —
no extra config. Copy-paste at [`examples/forks.yml`](examples/forks.yml).
```

**依据 3 · 源码核查**：[src/main.js:245-267](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/src/main.js#L245-L267)

Action soft fail 和检查状态。

<details>
<summary>查看原文（23行）</summary>

```text
  const outcome = inputs.softFail ? 'pass' : passed ? 'pass' : 'fail';
  const incompleteCoverage = isCoverageIncomplete(groups.coverage);
  const incompleteCiVisibility = inputs.checkCi && groups.ci.complete === false;
  const pendingCi = inputs.checkCi && groups.ci.settled === false;

  // ---- Reporting ----------------------------------------------------------
  const checkName = 'Codex Guard';
  const annotations = toAnnotations(groups);
  let markdown = buildMarkdown({
    passed,
    observing: inputs.softFail,
    groups,
    detected: detected.agent ? detected.signal : '',
  });
  if (!passed && inputs.notifyUsers.length) {
    markdown += `\n\n---\n${inputs.notifyUsers.map((u) => `@${u}`).join(' ')} — please review the findings above.`;
  }

  await gqlClient
    .createCheckRun(octokit, ctx, {
      name: checkName,
      conclusion: !passed
        ? inputs.softFail ? 'neutral' : 'failure'
```

</details>

#### 缺口

- 没有实际维护流程对照
  **影响**：发布效率和误报成本未知
  **进一步探讨**：测试库对照同一 diff 的两路结果

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
