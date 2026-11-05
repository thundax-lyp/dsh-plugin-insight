# dsh-wsl-git

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7bee9d6](https://github.com/173787247/dsh-wsl-git/tree/7bee9d60c207354fd19d2abeed9e3befe5b8e96a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-git)
<!-- END META -->

> **功能**：在 DSH 中查看 Git 仓库状态、差异统计和最近提交。

> **亮点**：[Q01](#research-q01) 从会话直接取有限状态摘要，帮助选择随后要读的变更。

> **主要限制**：[Q02](#research-q02) 输入路径检查未绑定实际仓库顶层，多次状态读取可能不一致。

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
  - [Q01 · 维护者能用这些 Git 工具判断哪些仓库变化？](#detail-section-11)
  - [Q02 · 仓库和摘要在什么情况下可能被误认？](#detail-section-12)
  - [Q03 · 如何验收轻量摘要，并减少目录和计数误读？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者接手工作区时需要快速判断分支和变更规模。

直接用 git status、diff --stat 和 log，必要时查看完整差异。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态摘要 | 检查当前分支和变更量 | 摘要不列未跟踪文件，计数可能包含 |
| 差异统计与日志 | 定位变更范围与历史 | 有限字符输出，细节需回原命令 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 和 Git | 必需 | 运行查询 | 命令或注册失败 |
| 明确的仓库根 | 受控使用必需 | 核对仓库范围 | 可能发现不同仓库 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选测试仓库和允许根 | 确认实际顶层 |
| 查询 | 用户对照状态、统计与历史 | 核对未跟踪和截断 |
| 退出 | 用户回原生命令 | 按需看完整差异 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 设置根并核对版本 | 依赖现有 Git |
| 持续 | 输出资源未知 | 校验计数和摘要 | 多次读取非同一时点 |
| 失败 | 排障开销未知 | 用 Git 检查仓库顶层 | 工具可停用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 初步评估 | 固定参数和摘要大小限制 | 实际节约时间和上下文 |
| 仓库范围 | 检查传入 cwd | 真实顶层和配置影响 |

> **思考**：[Q02](#research-q02) 输入路径检查未绑定实际仓库顶层，多次状态读取可能不一致。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 从会话直接取有限状态摘要，帮助选择随后要读的变更。

[Q02](#research-q02) 行数计数和面向读者的摘要来自不同查询，消费端应保留字段语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 输入路径检查未绑定实际仓库顶层，多次状态读取可能不一致。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在测试仓库先比对含未跟踪内容的摘要；需要代码级变更时改用原生 Git。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认查询与截断。实际兼容、节时和顶层复核方案未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/git.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码的命令、输入与结果核查。未运行目标代码、宿主或该插件的 Git 命令。
- 下一步：使用可弃用仓库验证顶层、状态异步变化、超时、无 HEAD 和截断。

**分析版本**

- **仓库**：[173787247/dsh-wsl-git](https://github.com/173787247/dsh-wsl-git)
- **版本号**：0.1.1（[固定提交 7bee9d6](https://github.com/173787247/dsh-wsl-git/tree/7bee9d60c207354fd19d2abeed9e3befe5b8e96a)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 复核并显示 Git 顶层并统一状态输入，比较对错仓库和错误计数判断。

使用可弃用仓库验证顶层、状态异步变化、超时、无 HEAD 和截断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 469 |
| .js | source | 2 | 272 | 256 | 1 | — |
| .js | test | 1 | 17 | 16 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-git/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护者能否从 DSH 的精简 Git 摘要判断应深入核查哪些仓库变化？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 维护者能用这些 Git 工具判断哪些仓库变化？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

任务开始前可读分支、状态摘要、最近提交和暂存或未暂存的 diff 统计，判断需深入看哪些文件。相较把原始 diff 送入会话，工具只取 --stat 或有限单行历史，减少输出范围。status 摘要隐藏未跟踪文件，但计数另来自 porcelain，两个值可以不同。工具不能显示某段差异、测试结果或证明可以安全提交，合格结果是正确识别仓库和状态后再核实所需细节。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/README.md#L5-L15)

作者目标为减少完整 diff 输入。

<details>
<summary>查看原文（11行）</summary>

````text
截断版 git status / diff --stat，避免巨型 diff 灌上下文。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-git
````

</details>

**依据 2 · 源码核查**：[lib/git.js:58-78](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/lib/git.js#L58-L78)

状态摘要与计数使用不同命令。

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
  };
```

</details>

**依据 3 · 源码核查**：[lib/git.js:81-107](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/lib/git.js#L81-L107)

暂存或未暂存统计与日志的输出边界。

<details>
<summary>查看原文（27行）</summary>

```text
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
  };
```

</details>

#### 缺口

- 缺少相同仓库任务的对照
  **影响**：实际节约的上下文和误读未知
  **进一步探讨**：对含未跟踪、暂存和未暂存修改的仓库核对原命令

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 仓库和摘要在什么情况下可能被误认？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

工具把 cwd 解析到现存目录的 realpath，allowRoots 非空才检查范围。它只校验传入目录，之后用 git -C 运行，未要求该目录就是仓库顶层，也未在仓库解析后复核顶层。若允许的是父仓库中的子目录，实际结果范围要按 Git 的仓库发现行为核实。状态、分支和 porcelain 分三次取得，期间改文件会使它们不在同一瞬间。计数基于行数而非结构化文件记录，porcelain 退出码也未检查。stdout 超限可能杀进程，最终只会返回截断摘要或失败。git status 等固定参数未调用 commit/push，但从代码只能确认操作入口，不能推出隔离或宿主配置无副作用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/git.js:16-35](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/lib/git.js#L16-L35)

只检查入参目录并交给 git -C。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/git.js:37-54](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/lib/git.js#L37-L54)

子进程超时与硬输出上限。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/git.js:65-77](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/lib/git.js#L65-L77)

多次查询和 porcelain 行数计算。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 4 · 源码核查**：[index.js:44-63](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/index.js#L44-L63)

状态读取调用实际接线。

<details>
<summary>查看原文（20行）</summary>

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
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await gitStatusSummary({ cwd: args.cwd, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
```

</details>

#### 缺口

- 未运行嵌套目录、父仓库、异步改文件和配置差异
  **影响**：不能保证 cwd 校验等同仓库授权或快照一致
  **进一步探讨**：以测试仓库验收顶层、未跟踪、重命名、无 HEAD 及截断

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何验收轻量摘要，并减少目录和计数误读？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

使用独立 WSL profile 与已安装 Git，配置精确允许根，先在测试仓库对比 status、两种 diff stat 和 log。原命令是恢复入口，遇到计数不符、顶层不明或摘要截断时直接核查，停用工具无需修改 Git 历史。可验证将实际仓库顶层显示并复核，再以一次机器格式状态生成摘要和计数，能否减少对错仓库及未跟踪状态的误判。用相同 fixture 比较当前输出和改版的误读率、诊断时间及新增调用代价。若顶层越界仍可读，或用户错误未降低，则放弃该改法。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-25](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/index.js#L6-L25)

配置、退出和版本探测。

<details>
<summary>查看原文（20行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-git] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  console.log(`[dsh-wsl-git] allowRoots=${allowRoots.length || "any"}`);

  ctx.systemPrompt.section({
    name: "tool:git-summary",
    order: 132,
    text: "dsh-wsl-git exposes git_status_summary, git_log_oneline, and git_diff_stat with capped output. Prefer these over dumping full diffs into context. Does not run commit/push.",
  });

  ctx.tools.register({
    name: "git_tool_status",
    description: "Whether git is on PATH; version string.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
```

</details>

**依据 2 · 源码核查**：[lib/git.js:16-30](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/lib/git.js#L16-L30)

路径校验基线。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/git.js:58-78](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/lib/git.js#L58-L78)

现有多次查询及语义。

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
  };
```

</details>

**依据 4 · 源码核查**：[lib/git.js:110-135](https://github.com/173787247/dsh-wsl-git/blob/7bee9d60c207354fd19d2abeed9e3befe5b8e96a/lib/git.js#L110-L135)

版本探测不证明仓库有效。

<details>
<summary>查看原文（26行）</summary>

```text
export async function gitToolStatus() {
  const git = (await which("git")) || null;
  if (!git) return { ok: true, git: null };
  return new Promise((resolvePromise) => {
    const child = spawn("git", ["--version"], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      resolvePromise({ ok: true, git, version: null });
    }, 5_000);
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        ok: true,
        git,
        version: code === 0 ? (stdout || stderr).trim() : null,
      });
    });
    child.on("error", () => {
      clearTimeout(t);
      resolvePromise({ ok: true, git, version: null });
    });
  });
```

</details>

#### 缺口

- 未运行真实宿主及改版对照
  **影响**：无法确认用户节时或改法可接受
  **进一步探讨**：用不同仓库边界和变更组合复查结果

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
