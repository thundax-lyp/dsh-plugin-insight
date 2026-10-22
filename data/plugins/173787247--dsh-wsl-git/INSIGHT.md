# dsh-wsl-git

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[79fa248](https://github.com/173787247/dsh-wsl-git/tree/79fa248103904f63b552e92c9655be0d3c6e4981)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-git)
<!-- END META -->

> **实现功能**：提供固定Git状态、历史与diff stat摘要，限制返回长度并可设允许目录根。

> **核心亮点**：把常用Git摘要、返回上限与路径根配置接入模型工具。详见[Q01](#research-q01)。

> **风险与缺陷**：porcelain失败仍计数ok，文本render漏截断，allowRoots只守cwd非父仓/Git环境范围。详见[Q03](#research-q03)。

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
  - [Q01 · 摘要工具比直接Git命令多什么？](#detail-section-11)
  - [Q02 · 路径允许范围怎样判定，Git是否只看这个目录？](#detail-section-12)
  - [Q03 · 输出截断和成功状态有哪些陷阱？](#detail-section-13)
  - [Q04 · 测试和使用成本如何评估？](#detail-section-14)
  - [Q05 · 采用条件和继续探讨方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发任务先看仓库摘要，减少整段diff进入模型。详见[Q01](#research-q01)。

手工git status/log/diff stat，插件不是提交或审查判定器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| `git_tool_status` | 查询Git位置/版本与允许根数量 | 依bash/PATH，ok不代表仓库可读，which无自身超时 |
| `git_status_summary` | 分支、短状态与变更条目数 | 指定cwd/allowRoots；porcelain失败未独立验收，非原子快照 |
| `git_log_oneline` | 有限条提交摘要 | 默认20最多100；字段count不等切片后可见行数，核truncated |
| `git_diff_stat` | 工作树或暂存区变更量 | 不含完整patch；核结构化truncated，不代替代码审查 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=18/tools | 入口 | ABI匹配 |
| git/bash PATH | 查询/which | 不同环境/缺bash |
| allowRoots仓库根 | 来源边界 | 默认any/父仓差异 |
| 输出复核 | 完整性 | 部分摘要可能ok |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 配仓库根 | 用户 | 物理根和Git根一致 |
| 请求摘要 | 工具 | 指定cwd |
| 看truncated/错误 | 用户 | 部分结果不误读 |
| 按需读具体diff | 用户/模型 | 不按摘要完成审查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/宿主、git/bash与配置资源，金额未知 | 配明确仓库根、核Git环境，耗时未知 | allowRoots默认any，允许子目录不等父仓数据隔离 |
| 持续使用 | status最多三Git两bash，log/stat一Git；过程缓冲/stderr与结果上下文 | 核截断、错误和完整diff，实际工时未知 | 无独立远端API或额外模型请求不等宿主总费为零；token节省无基准 |
| 失败恢复 | 重查消耗本地进程资源；无commit/push恢复功能 | 先查部分输出/错误，再人工复核后续提交判断 | 插件不替用户回滚仓库；重查金额与恢复工时未知 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 少上下文 | 截断摘要 | render可能不标截断 |
| 路径限制 | realpath前缀 | 非仓库/环境隔离 |
| 变更概览 | status/log/stat | 非一致快照/强文件计数 |

> **思考**：porcelain失败仍计数ok，文本render漏截断，allowRoots只守cwd非父仓/Git环境范围。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把常用Git摘要、返回上限与路径根配置接入模型工具。详见[Q01](#research-q01)。

把常用Git摘要、返回上限与路径根配置接入模型工具。详见[Q01](#research-q01)。

物理路径/固定argv可复用，补全子命令失败与显式partial更关键。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

porcelain失败仍计数ok，文本render漏截断，allowRoots只守cwd非父仓/Git环境范围。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

摘要入口试用，完整审查另读变更，确认根与截断。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定命令/物理路径检查可查，但Git仓库范围不等cwd范围，部分状态和截断render存在缺口。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/git.js、test/git.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整136行入口/136行Git模块/17行测试及README/package，不执行目标或查询真实工作区Git状态。
- 下一步：从父仓范围/porcelain cap/缺bash/工作树并发反例核。

**分析版本**

- **仓库**：[173787247/dsh-wsl-git](https://github.com/173787247/dsh-wsl-git)
- **版本号**：0.1.1（[固定提交 79fa248](https://github.com/173787247/dsh-wsl-git/tree/79fa248103904f63b552e92c9655be0d3c6e4981)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究仓库来源约束/统一预算和显式partial摘要，比较误判断与token，尚未验证。详见[Q05](#research-q05)。

从父仓范围/porcelain cap/缺bash/工作树并发反例核。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 469 |
| .js | source | 2 | 272 | 256 | 1 | — |
| .js | test | 1 | 17 | 16 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-git/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-git/issues?q=is%3Aissue+created%3A2026-09-22T07%3A26%3A46.081Z..2026-10-22T07%3A26%3A46.081Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-git/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A26%3A46.081Z..2026-10-22T07%3A26%3A46.081Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Git摘要的路径/截断/成功语义是否足以支持模型判断，怎样保留部分结果边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 摘要工具比直接Git命令多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向模型要了解工作树/提交历史而不想整段diff占上下文的开发场景，提供git_tool_status、status摘要、diff stat和oneline log四工具。默认status/log最多12000字符，stat8000，log最多100条；无commit/push工具，不生成补丁、不自动修改仓库业务内容。README工具表漏列log且前部版本0.1.0与package0.1.1不一致，按当前入口代码评估。

贡献是常用只读Git固定命令、大小限制和可选路径根规则接进模型工具，基线是手工Git摘要命令，不是新版本控制。摘要不足以审查代码语义或证明仓库干净/可发布，使用者仍需按任务读具体变更。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:21-136](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/index.js#L21-L136)

四个实际注册。

<details>
<summary>查看原文（116行）</summary>

```text
  ctx.tools.register({
    name: "git_tool_status",
    description: "Whether git is on PATH; version string.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return { ...(await gitToolStatus()), allowRootsCount: allowRoots.length };
    },
    presentCall: () => ({ card: "generic", title: "git tool" }),
    presentResult: (_a, r) => ({ card: "generic", title: "git tool", content: r.content }),
  });

  ctx.tools.register({
    name: "git_status_summary",
    description: "Short git status (-sb) + changed file count for a repo. Caps size.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["cwd"],
      properties: { cwd: { type: "string", description: "Git work tree path" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : `repo=${v.repo}\nbranch=${v.branch}\nchangedFiles=${v.changedFiles}\n${v.status}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await gitStatusSummary({ cwd: args.cwd, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "git status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "git status", content: r.content }),
  });

  ctx.tools.register({
    name: "git_log_oneline",
    description: "git log --oneline -n N (capped, default 20, max 100). Read-only.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["cwd"],
      properties: {
        cwd: { type: "string" },
        limit: { type: "number", description: "Commit count (default 20, max 100)" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.log || "(empty)" }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await gitLogOneline({ cwd: args.cwd, limit: args.limit, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "git log" }),
    presentResult: (_a, r) => ({ card: "generic", title: "git log", content: r.content }),
  });

  ctx.tools.register({
    name: "git_diff_stat",
    description: "git diff --stat (or --cached) only — never full patch. Caps size.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["cwd"],
      properties: {
        cwd: { type: "string" },
        staged: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stat }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await gitDiffStat({
          cwd: args.cwd,
          staged: args.staged === true,
          allowRoots,
          timeoutMs,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "git diff --stat" }),
    presentResult: (_a, r) => ({ card: "generic", title: "git diff --stat", content: r.content }),
  });
}

function positive(v, fb) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fb;
}
```

</details>

**依据 2 · 源码核查**：[lib/git.js:57-106](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/lib/git.js#L57-L106)

输出限制。

<details>
<summary>查看原文（50行）</summary>

```text

export async function gitStatusSummary({ cwd, allowRoots, timeoutMs, maxOut = 12_000 }) {
  const repo = resolveRepo(cwd, allowRoots);
  const bin = (await which("git")) || "git";
  if (!(await which("git"))) {
    /* still try git on PATH via spawn */
  }
  void bin;
  const branch = await runGit(repo, ["rev-parse", "--abbrev-ref", "HEAD"], timeoutMs);
  const short = await runGit(repo, ["status", "-sb", "--untracked-files=no"], timeoutMs);
  const porcelain = await runGit(repo, ["status", "--porcelain"], timeoutMs);
  if (short.code !== 0) throw new Error(`git status failed: ${short.stderr || short.code}`);
  const lines = porcelain.stdout.split("\n").filter(Boolean);
  const summary = short.stdout.slice(0, maxOut);
  return {
    ok: true,
    repo,
    branch: branch.code === 0 ? branch.stdout.trim() : null,
    changedFiles: lines.length,
    status: summary,
    truncated: short.stdout.length > maxOut,
  };
}

export async function gitDiffStat({ cwd, allowRoots, timeoutMs, staged = false, maxOut = 8_000 }) {
  const repo = resolveRepo(cwd, allowRoots);
  const args = staged ? ["diff", "--cached", "--stat"] : ["diff", "--stat"];
  const { code, stdout, stderr } = await runGit(repo, args, timeoutMs);
  if (code !== 0) throw new Error(`git diff --stat failed: ${stderr || code}`);
  return {
    ok: true,
    repo,
    staged: !!staged,
    truncated: stdout.length > maxOut,
    stat: stdout.slice(0, maxOut),
  };
}

export async function gitLogOneline({ cwd, allowRoots, timeoutMs, limit = 20, maxOut = 12_000 } = {}) {
  const repo = resolveRepo(cwd, allowRoots);
  const n = Math.min(100, Math.max(1, Number(limit) || 20));
  const { code, stdout, stderr } = await runGit(repo, ["log", `--oneline`, `-n`, String(n), "--no-decorate"], timeoutMs);
  if (code !== 0) throw new Error(`git log failed: ${stderr || code}`);
  const lines = stdout.split("\n").filter(Boolean);
  return {
    ok: true,
    repo,
    count: lines.length,
    truncated: stdout.length > maxOut,
    log: stdout.slice(0, maxOut),
```

</details>

**依据 3 · 作者声明**：[README.md:9-34](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/README.md#L9-L34)

作者版本/工具表。

<details>
<summary>查看原文（26行）</summary>

````text
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-git
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-git
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `git_tool_status` | git 是否可用 |
| `git_status_summary` | status -sb + 变更数 |
| `git_diff_stat` | 仅 --stat |

## 配置要点

`allowRoots / timeoutMs`

不提供 commit / push。
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路径允许范围怎样判定，Git是否只看这个目录？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

cwd必填但核心resolve对空值也回进程cwd，存在则realpath；allowRoots存在也realpath后用相等或分隔符前缀比较，能拒普通../或符号链接出根，空数组默认any。规则约束传给git -C的目录，不绑定agent session scope，也未查询仓库toplevel或Git环境变量覆盖。允许目录若只是更大仓库里的子目录，status/log可能仍看整个父仓，不能将allowRoots当完整Git数据隔离。

Git命令走spawn固定argv，不把cwd拼shell；which则用bash -lc command-v安全清洗名，status调用两次which但结果bin没实际用，最终spawn git仍用进程PATH。缺bash或登录shell行为与实际PATH差异可使诊断异常，which未设error监听/超时。Node>=18、PATH git/bash、宿主tools/systemPrompt为依赖，虽名wsl没有WSL门，普通Linux也可用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/git.js:6-29](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/lib/git.js#L6-L29)

which和realpath边界。

<details>
<summary>查看原文（24行）</summary>

```text
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
}

export function resolveRepo(cwd, allowRoots = []) {
  const abs = resolve(String(cwd || ".").trim() || ".");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  if (allowRoots.length) {
    const roots = allowRoots.map((r) => {
      const a = resolve(r);
      return existsSync(a) ? realpathSync(a) : a;
    });
    const ok = roots.some((root) => {
      const r = root.replace(/[/\\]+$/, "");
      return real === r || real.startsWith(r + "/") || real.startsWith(r + "\\");
    });
    if (!ok) throw new Error(`repo outside allowRoots: ${real}`);
  }
```

</details>

**依据 2 · 源码核查**：[lib/git.js:57-66](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/lib/git.js#L57-L66)

重复which/固定-C。

<details>
<summary>查看原文（10行）</summary>

```text

export async function gitStatusSummary({ cwd, allowRoots, timeoutMs, maxOut = 12_000 }) {
  const repo = resolveRepo(cwd, allowRoots);
  const bin = (await which("git")) || "git";
  if (!(await which("git"))) {
    /* still try git on PATH via spawn */
  }
  void bin;
  const branch = await runGit(repo, ["rev-parse", "--abbrev-ref", "HEAD"], timeoutMs);
  const short = await runGit(repo, ["status", "-sb", "--untracked-files=no"], timeoutMs);
```

</details>

**依据 3 · 源码核查**：[index.js:11-19](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/index.js#L11-L19)

默认any和提示。

```text
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  console.log(`[dsh-wsl-git] allowRoots=${allowRoots.length || "any"}`);

  ctx.systemPrompt.section({
    name: "tool:git-summary",
    order: 132,
    text: "dsh-wsl-git exposes git_status_summary, git_log_oneline, and git_diff_stat with capped output. Prefer these over dumping full diffs into context. Does not run commit/push.",
  });
```

**依据 4 · 源码核查**：[package.json:7-10](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/package.json#L7-L10)

Node入口。

```text
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 输出截断和成功状态有哪些陷阱？

**研究主题**：缺陷与关键质疑

#### 完整回答

runGit将stdout全部累加，超过400000字符kill进程，但不是严格内存/字节上限，也不标专门cap原因；stderr无上限。各最终工具再slice返回并给truncated，但status render只打印repo/branch/count/status，不打印truncated，diff/log render也只文本，读者可能看不到截断标记，结构化字段仍在。

status顺序执行rev-parse、status -sb --untracked-files=no与status --porcelain，只检查short退出码。porcelain若被400k kill/返回非零，仍用捕获行数当changedFiles且ok；该数本来也把未跟踪目录按Git默认条目计而非目录内每个文件，short又不列未跟踪项，故数量和显示清单不一定一一对应。log count按切片前输出算，不等可见行数。

每runGit独立timeoutMs，status可三轮，加上无超时which，外层工具timeout不传abort；宿主已超时不代表全部后续命令已停。Git查询也不是多命令原子快照，工作树变化可让branch/status/count不同刻。read-only应理解无commit/push业务操作，不能当无任何Git内部可选锁/缓存触碰。

#### 证据与依据

**依据 1 · 源码核查**：[lib/git.js:31-54](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/lib/git.js#L31-L54)

缓冲/kill/局部超时。

<details>
<summary>查看原文（24行）</summary>

```text
}

export function runGit(repo, args, timeoutMs = 20_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("git", ["-C", repo, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("git timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 400_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 2 · 源码核查**：[lib/git.js:57-77](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/lib/git.js#L57-L77)

未核porcelain状态/计数。

<details>
<summary>查看原文（21行）</summary>

```text

export async function gitStatusSummary({ cwd, allowRoots, timeoutMs, maxOut = 12_000 }) {
  const repo = resolveRepo(cwd, allowRoots);
  const bin = (await which("git")) || "git";
  if (!(await which("git"))) {
    /* still try git on PATH via spawn */
  }
  void bin;
  const branch = await runGit(repo, ["rev-parse", "--abbrev-ref", "HEAD"], timeoutMs);
  const short = await runGit(repo, ["status", "-sb", "--untracked-files=no"], timeoutMs);
  const porcelain = await runGit(repo, ["status", "--porcelain"], timeoutMs);
  if (short.code !== 0) throw new Error(`git status failed: ${short.stderr || short.code}`);
  const lines = porcelain.stdout.split("\n").filter(Boolean);
  const summary = short.stdout.slice(0, maxOut);
  return {
    ok: true,
    repo,
    branch: branch.code === 0 ? branch.stdout.trim() : null,
    changedFiles: lines.length,
    status: summary,
    truncated: short.stdout.length > maxOut,
```

</details>

**依据 3 · 源码核查**：[lib/git.js:92-107](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/lib/git.js#L92-L107)

log计数/切片。

<details>
<summary>查看原文（16行）</summary>

```text
  };
}

export async function gitLogOneline({ cwd, allowRoots, timeoutMs, limit = 20, maxOut = 12_000 } = {}) {
  const repo = resolveRepo(cwd, allowRoots);
  const n = Math.min(100, Math.max(1, Number(limit) || 20));
  const { code, stdout, stderr } = await runGit(repo, ["log", `--oneline`, `-n`, String(n), "--no-decorate"], timeoutMs);
  if (code !== 0) throw new Error(`git log failed: ${stderr || code}`);
  const lines = stdout.split("\n").filter(Boolean);
  return {
    ok: true,
    repo,
    count: lines.length,
    truncated: stdout.length > maxOut,
    log: stdout.slice(0, maxOut),
  };
```

</details>

**依据 4 · 源码核查**：[index.js:44-55](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/index.js#L44-L55)

status render漏truncated。

<details>
<summary>查看原文（12行）</summary>

```text
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : `repo=${v.repo}\nbranch=${v.branch}\nchangedFiles=${v.changedFiles}\n${v.status}`,
        },
      ],
    },
```

</details>

**依据 5 · 源码核查**：[index.js:83-88](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/index.js#L83-L88)

log render。

```text
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.log || "(empty)" }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
```

**依据 6 · 源码核查**：[index.js:111-114](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/index.js#L111-L114)

stat render。

```text
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stat }],
    },
    timeoutMs,
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 测试和使用成本如何评估？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

17行测试仅真调用resolveRepo临时目录以及复制一段limit夹值表达式，没有生产Git执行/allowRoots反例、丢失分支、截断、missing bash或取消测试。正面是realpath+分隔符边界、固定spawn参数、超时kill和结构化truncated；但测试不能守住这些关键链，本次只读不运行。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/宿主、git/bash与配置资源，金额未知 | 配明确仓库根、核Git环境，耗时未知 | allowRoots默认any，允许子目录不等父仓数据隔离 |
| 持续使用 | status最多三Git两bash，log/stat一Git；过程缓冲/stderr与结果上下文 | 核截断、错误和完整diff，实际工时未知 | 无独立远端API或额外模型请求不等宿主总费为零；token节省无基准 |
| 失败恢复 | 重查消耗本地进程资源；无commit/push恢复功能 | 先查部分输出/错误，再人工复核后续提交判断 | 插件不替用户回滚仓库；重查金额与恢复工时未知 |


#### 证据与依据

**依据 1 · 源码核查**：[test/git.test.js:1-17](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/test/git.test.js#L1-L17)

生产路径与复制limit测试。

<details>
<summary>查看原文（17行）</summary>

```text
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveRepo } from "../lib/git.js";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("git resolve", () => {
  it("resolves cwd", () => {
    const d = mkdtempSync(join(tmpdir(), "dsh-git-"));
    assert.ok(resolveRepo(d).includes("dsh-git-"));
  });
  it("clamps log limit", () => {
    const n = Math.min(100, Math.max(1, Number(999) || 20));
    assert.equal(n, 100);
  });
});
```

</details>

**依据 2 · 源码核查**：[lib/git.js:16-54](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/lib/git.js#L16-L54)

路径/执行正向工程。

<details>
<summary>查看原文（39行）</summary>

```text
export function resolveRepo(cwd, allowRoots = []) {
  const abs = resolve(String(cwd || ".").trim() || ".");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  if (allowRoots.length) {
    const roots = allowRoots.map((r) => {
      const a = resolve(r);
      return existsSync(a) ? realpathSync(a) : a;
    });
    const ok = roots.some((root) => {
      const r = root.replace(/[/\\]+$/, "");
      return real === r || real.startsWith(r + "/") || real.startsWith(r + "\\");
    });
    if (!ok) throw new Error(`repo outside allowRoots: ${real}`);
  }
  return real;
}

export function runGit(repo, args, timeoutMs = 20_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("git", ["-C", repo, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("git timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 400_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 3 · 源码核查**：[index.js:11-13](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/index.js#L11-L13)

默认根配置。

```text
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  console.log(`[dsh-wsl-git] allowRoots=${allowRoots.length || "any"}`);
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用条件和继续探讨方向？

**研究主题**：新假设与验证、采用判断

#### 完整回答

明确仓库根且愿意看结构化截断字段者可试用摘要入口，完整审查仍读实际diff。别按changedFiles作强计数或按只读无push推安全隔离；大仓/频繁并发改动时核porcelain返回和快照时点，配置allowRoots前确认git发现的仓库根不会出范围。

可研究canonical仓库toplevel和Git环境隔离、统一deadline/输出字节预算，所有子命令结果分层并显式渲染partial/truncated，计数区分tracked条目/未跟踪目录。基线是cwd根守卫和short单退出检查，反例为允许子目录内父仓、GIT_DIR覆盖、porcelain输出超cap、stderr洪流、缺bash、status间工作树变化。比较漏显示/误干净判断、token和超时后残留执行，尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/git.js:16-54](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/lib/git.js#L16-L54)

根/缓冲基线。

<details>
<summary>查看原文（39行）</summary>

```text
export function resolveRepo(cwd, allowRoots = []) {
  const abs = resolve(String(cwd || ".").trim() || ".");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  if (allowRoots.length) {
    const roots = allowRoots.map((r) => {
      const a = resolve(r);
      return existsSync(a) ? realpathSync(a) : a;
    });
    const ok = roots.some((root) => {
      const r = root.replace(/[/\\]+$/, "");
      return real === r || real.startsWith(r + "/") || real.startsWith(r + "\\");
    });
    if (!ok) throw new Error(`repo outside allowRoots: ${real}`);
  }
  return real;
}

export function runGit(repo, args, timeoutMs = 20_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("git", ["-C", repo, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("git timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 400_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 2 · 源码核查**：[lib/git.js:57-77](https://github.com/173787247/dsh-wsl-git/blob/79fa248103904f63b552e92c9655be0d3c6e4981/lib/git.js#L57-L77)

摘要基线。

<details>
<summary>查看原文（21行）</summary>

```text

export async function gitStatusSummary({ cwd, allowRoots, timeoutMs, maxOut = 12_000 }) {
  const repo = resolveRepo(cwd, allowRoots);
  const bin = (await which("git")) || "git";
  if (!(await which("git"))) {
    /* still try git on PATH via spawn */
  }
  void bin;
  const branch = await runGit(repo, ["rev-parse", "--abbrev-ref", "HEAD"], timeoutMs);
  const short = await runGit(repo, ["status", "-sb", "--untracked-files=no"], timeoutMs);
  const porcelain = await runGit(repo, ["status", "--porcelain"], timeoutMs);
  if (short.code !== 0) throw new Error(`git status failed: ${short.stderr || short.code}`);
  const lines = porcelain.stdout.split("\n").filter(Boolean);
  const summary = short.stdout.slice(0, maxOut);
  return {
    ok: true,
    repo,
    branch: branch.code === 0 ? branch.stdout.trim() : null,
    changedFiles: lines.length,
    status: summary,
    truncated: short.stdout.length > maxOut,
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
