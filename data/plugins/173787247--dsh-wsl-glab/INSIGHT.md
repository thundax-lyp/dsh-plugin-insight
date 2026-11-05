# dsh-wsl-glab

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f85a58a](https://github.com/173787247/dsh-wsl-glab/tree/f85a58aff0935896a3bc4f864f1adcd72e4ca01b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-glab)
<!-- END META -->

> **功能**：在 DSH 中查看 GitLab 合并请求、问题与流水线状态。

> **亮点**：[Q01](#research-q01) 在会话内取得项目条目和流水线线索，便于跟进原件。

> **主要限制**：[Q02](#research-q02) 项目范围沿用宿主认证，issue 文本会将部分解析失败呈现为空，CI 状态需看实际退出和结果。

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
  - [Q01 · GitLab 项目成员能从会话取得哪些交付线索？](#detail-section-11)
  - [Q02 · 默认项目、认证和错误如何进入结果？](#detail-section-12)
  - [Q03 · 如何验收列表和 CI，并区分空数据与查询失败？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：项目成员需要从交付会话快速定位待处理 MR、issue 和 CI 线索。

直接使用已认证的 glab 或 GitLab 网页查看相同项目。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MR 与 issue | 查找交付条目链接 | 列表有限，解析失败时需回原件 |
| CI 状态 | 定位流水线线索 | 工具级成功不证明流水线成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| glab 及已认证的测试项目 | 必需 | 读取 MR、issue 和 CI | 未认证或默认项目不符时结果无效 |
| 受限账号 | 受控验收必需 | 限制可读项目 | 插件未校验项目授权范围 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择明确测试项目和账号 | 权限只限测试数据 |
| 查询 | 用户传 repo 并对照网页 | 检查 URL 和流水线状态 |
| 退出 | 用户改回 glab 或网页 | 空列表先检查失败原因 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | CLI 和服务成本未知 | 配置测试认证与项目 | 需核对返回的认证摘要 |
| 持续 | 查询资源未知 | 确认分页、截断与状态 | 列表只用于初筛 |
| 失败 | 排障开销未知 | 回原件区分红灯与命令错误 | 需检查认证与项目解析 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 交付初筛 | 可获取条目链接和 CI 文本 | 真实用户节时 |
| 认证状态 | 部分正则遮蔽及摘要 | 不同 CLI 输出格式的保密性 |

> **思考**：[Q02](#research-q02) 项目范围沿用宿主认证，issue 文本会将部分解析失败呈现为空，CI 状态需看实际退出和结果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在会话内取得项目条目和流水线线索，便于跟进原件。

[Q02](#research-q02) 结构化 raw 与 exitCode 在不同文本渲染中的保留不一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 项目范围沿用宿主认证，issue 文本会将部分解析失败呈现为空，CI 状态需看实际退出和结果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用只读测试项目核对空列表和失败样本，持续以项目原件确认关键决策。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认固定命令和投影差异。实际认证与诊断收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/glab.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码审查 glab 调用及输出。未执行 GitLab 请求、CLI、宿主或目标测试。
- 下一步：在受控项目核对认证、状态筛选、跨页、非 JSON、权限拒绝与失败流水线。

**分析版本**

- **仓库**：[173787247/dsh-wsl-glab](https://github.com/173787247/dsh-wsl-glab)
- **版本号**：0.1.1（[固定提交 f85a58a](https://github.com/173787247/dsh-wsl-glab/tree/f85a58aff0935896a3bc4f864f1adcd72e4ca01b)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 显示查询目标和格式状态，比较是否减少空列表与流水线结果误判。

在受控项目核对认证、状态筛选、跨页、非 JSON、权限拒绝与失败流水线。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 485 |
| .js | source | 2 | 320 | 299 | 4 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-glab/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-glab/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-glab/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：GitLab 项目成员能否从 DSH 查找工作线索，并区分空数据、截断与命令失败？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · GitLab 项目成员能从会话取得哪些交付线索？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

处理 MR 或缺陷前，可读合并请求与 issue 的标题、状态及 URL，并查看当前流水线的文本。与直接 glab 或网页相比，插件新增在会话内填写仓库、状态和条数的入口，范围仅是初筛，不替代代码评审或合并。列表结果按 limit 截到最多 50 项，不能据列表长度断言项目只有这些记录。合格结果是定位真实项目、条目和流水线，再用原页面查细节。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/README.md#L5-L15)

作者范围与安装。

<details>
<summary>查看原文（11行）</summary>

````text
GitLab CLI（glab）只读：MR / issue / ci status。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-glab
````

</details>

**依据 2 · 源码核查**：[lib/glab.js:106-133](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/lib/glab.js#L106-L133)

MR 参数和字段投影。

<details>
<summary>查看原文（28行）</summary>

```text
export async function glabMrList({ state = "opened", limit = 20, repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const args = ["mr", "list", "--per-page", String(n), "-F", "json"];
  const st = String(state || "opened");
  if (!/^(opened|closed|merged|all)$/.test(st)) throw new Error("invalid mr state");
  if (st !== "all") args.push("--state", st);
  if (repo) {
    if (!/^[A-Za-z0-9._/-]+$/.test(repo)) throw new Error("invalid repo");
    args.push("-R", repo);
  }
  const r = await run(bin, args, { timeoutMs, maxOut });
  if (r.code !== 0) throw new Error(`glab mr list failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, raw: r.stdout, truncated: r.truncated };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, n).map((m) => ({
    iid: m.iid,
    title: m.title,
    state: m.state,
    web_url: m.web_url,
    source_branch: m.source_branch,
    target_branch: m.target_branch,
  }));
  return { ok: true, count: list.length, mrs: list };
```

</details>

**依据 3 · 源码核查**：[lib/glab.js:136-178](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/lib/glab.js#L136-L178)

CI 与 issue 结果。

<details>
<summary>查看原文（43行）</summary>

```text
export async function glabCiStatus({ repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const args = ["ci", "status"];
  if (repo) {
    if (!/^[A-Za-z0-9._/-]+$/.test(repo)) throw new Error("invalid repo");
    args.push("-R", repo);
  }
  const r = await run(bin, args, { timeoutMs, maxOut });
  // ci status may exit non-zero when failed — still return output
  return {
    ok: true,
    exitCode: r.code,
    truncated: r.truncated,
    output: (r.stdout || r.stderr).trim(),
  };
}

export async function glabIssueList({ state = "opened", limit = 20, repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const args = ["issue", "list", "--per-page", String(n), "-F", "json"];
  const st = String(state || "opened");
  if (!/^(opened|closed|all)$/.test(st)) throw new Error("invalid issue state");
  if (st !== "all") args.push("--state", st);
  if (repo) {
    if (!/^[A-Za-z0-9._/-]+$/.test(repo)) throw new Error("invalid repo");
    args.push("-R", repo);
  }
  const r = await run(bin, args, { timeoutMs, maxOut });
  if (r.code !== 0) throw new Error(`glab issue list failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, raw: r.stdout };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, n).map((i) => ({
    iid: i.iid,
    title: i.title,
    state: i.state,
    web_url: i.web_url,
  }));
  return { ok: true, count: list.length, issues: list };
```

</details>

#### 缺口

- 未验证真实项目分页和会话节时
  **影响**：不能判断返回范围或实际省时
  **进一步探讨**：用有多页条目和不同流水线的测试项目对照原 CLI

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 默认项目、认证和错误如何进入结果？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

指定 repo 时仅做字符规则检查，未维护项目允许表，省略参数则交由 glab 的当前上下文和凭据解析。子进程继承环境。认证探测以正则替换 token/oauth/pat 片段及过滤部分已知前缀，仍保留通过筛选的其他行，不能承诺任意格式的敏感数据都被消除。列表 JSON 解析失败时库返回 raw 且 ok=true，MR 文本可显示 raw，issue 文本却忽略 raw 并可显示 none。CI 对非零退出仍返回 ok=true 和 exitCode，文本只显示输出，调用者需另核对真实流水线状态与命令错误。

#### 证据与依据

**依据 1 · 源码核查**：[lib/glab.js:14-38](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/lib/glab.js#L14-L38)

环境继承与截断。

<details>
<summary>查看原文（25行）</summary>

```text
export function run(bin, args, { timeoutMs = 30_000, maxOut = 80_000, env } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, ...(env || {}) },
    });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOut * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        code,
        stdout: stdout.slice(0, maxOut),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOut,
      });
```

</details>

**依据 2 · 源码核查**：[lib/glab.js:70-97](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/lib/glab.js#L70-L97)

认证输出的启发式过滤。

<details>
<summary>查看原文（28行）</summary>

```text
export async function glabStatus() {
  const glab = (await which("glab")) || null;
  if (!glab) return { ok: true, glab: null, version: null, auth: null };
  let version = null;
  let auth = null;
  try {
    const ver = await glabVersion({ timeoutMs: 8_000 });
    version = ver.output || null;
  } catch {
    /* ignore */
  }
  try {
    const r = await run(glab, ["auth", "status"], { timeoutMs: 10_000, maxOut: 8_000 });
    // Strip anything that looks like a token; keep host/user lines only
    const lines = (r.stdout || r.stderr || "")
      .split("\n")
      .map((l) => l.replace(/(token|oauth|pat)[^\s]*/gi, "[redacted]"))
      .filter((l) => l.trim() && !/ghp_|glpat-|gho_|ghu_/i.test(l))
      .slice(0, 20);
    auth = {
      exitCode: r.code,
      loggedIn: r.code === 0 || /Logged in to/i.test(lines.join("\n")),
      summary: lines.join("\n").slice(0, 1500),
    };
  } catch (e) {
    auth = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
  return { ok: true, glab, version, auth };
```

</details>

**依据 3 · 源码核查**：[lib/glab.js:106-123](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/lib/glab.js#L106-L123)

目标语法及 MR 解析失败。

<details>
<summary>查看原文（18行）</summary>

```text
export async function glabMrList({ state = "opened", limit = 20, repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const args = ["mr", "list", "--per-page", String(n), "-F", "json"];
  const st = String(state || "opened");
  if (!/^(opened|closed|merged|all)$/.test(st)) throw new Error("invalid mr state");
  if (st !== "all") args.push("--state", st);
  if (repo) {
    if (!/^[A-Za-z0-9._/-]+$/.test(repo)) throw new Error("invalid repo");
    args.push("-R", repo);
  }
  const r = await run(bin, args, { timeoutMs, maxOut });
  if (r.code !== 0) throw new Error(`glab mr list failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, raw: r.stdout, truncated: r.truncated };
```

</details>

**依据 4 · 源码核查**：[lib/glab.js:136-178](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/lib/glab.js#L136-L178)

CI 非零退出及 issue raw 路径。

<details>
<summary>查看原文（43行）</summary>

```text
export async function glabCiStatus({ repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const args = ["ci", "status"];
  if (repo) {
    if (!/^[A-Za-z0-9._/-]+$/.test(repo)) throw new Error("invalid repo");
    args.push("-R", repo);
  }
  const r = await run(bin, args, { timeoutMs, maxOut });
  // ci status may exit non-zero when failed — still return output
  return {
    ok: true,
    exitCode: r.code,
    truncated: r.truncated,
    output: (r.stdout || r.stderr).trim(),
  };
}

export async function glabIssueList({ state = "opened", limit = 20, repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const args = ["issue", "list", "--per-page", String(n), "-F", "json"];
  const st = String(state || "opened");
  if (!/^(opened|closed|all)$/.test(st)) throw new Error("invalid issue state");
  if (st !== "all") args.push("--state", st);
  if (repo) {
    if (!/^[A-Za-z0-9._/-]+$/.test(repo)) throw new Error("invalid repo");
    args.push("-R", repo);
  }
  const r = await run(bin, args, { timeoutMs, maxOut });
  if (r.code !== 0) throw new Error(`glab issue list failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, raw: r.stdout };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, n).map((i) => ({
    iid: i.iid,
    title: i.title,
    state: i.state,
    web_url: i.web_url,
  }));
  return { ok: true, count: list.length, issues: list };
```

</details>

**依据 5 · 源码核查**：[index.js:46-57](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/index.js#L46-L57)

MR 文本读取 raw。

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
              : (v.mrs || []).map((m) => `!${m.iid} ${m.state} ${m.title}\n${m.web_url}`).join("\n\n") ||
                v.raw ||
                "(none)",
        },
```

</details>

**依据 6 · 源码核查**：[index.js:85-96](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/index.js#L85-L96)

issue 文本不读取 raw。

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
              : (v.issues || []).map((i) => `#${i.iid} ${i.state} ${i.title}\n${i.web_url}`).join("\n\n") || "(none)",
        },
      ],
    },
```

</details>

**依据 7 · 源码核查**：[index.js:110-126](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/index.js#L110-L126)

CI 文本未回显 exitCode。

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.tools.register({
    name: "glab_ci_status",
    description: "glab ci status for current pipeline (read-only summary text).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { repo: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await glabCiStatus({ repo: args?.repo, timeoutMs });
```

</details>

#### 缺口

- 未以真实 glab 版本检验输出差异、项目推断和遮蔽
  **影响**：无法保证认证信息不会通过其他格式返回
  **进一步探讨**：用虚拟认证输出与无敏感测试项目核对不同失败和截断

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何验收列表和 CI，并区分空数据与查询失败？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在独立 profile 配置 glab 和仅可读测试项目，显式传仓库，核对每个列表的 URL、空结果与流水线。若状态不符、认证摘要含敏感内容或输出疑似截断，停用并回原生 glab 或网页。可验证在工具投影中区分查询错误、格式未知、已截断和确实无记录，同时显示解析目标与退出码。以相同有条目、无条目、截断、拒绝和 CI 红灯样本对照，记录正确分类与重复查询次数。无改善或误判增加则舍弃。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-28](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/index.js#L11-L28)

运行配置和认证状态入口。

<details>
<summary>查看原文（18行）</summary>

```text
  const timeoutMs = positive(config.timeoutMs, 30_000);
  console.log("[dsh-wsl-glab] read-only list tools (mr/issue/ci status)");

  ctx.systemPrompt.section({
    name: "tool:glab",
    order: 124,
    text: "dsh-wsl-glab wraps GitLab CLI (glab) for read-only MR/issue lists and ci status. Complements dsh-wsl-github. Does not create/merge MRs. Auth via glab's own config — never paste tokens into chat.",
  });

  ctx.tools.register({
    name: "glab_status",
    description: "Whether glab is on PATH; version + auth status summary (never returns tokens).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
      return glabStatus();
```

</details>

**依据 2 · 源码核查**：[index.js:85-96](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/index.js#L85-L96)

现有 issue 文本路径。

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
              : (v.issues || []).map((i) => `#${i.iid} ${i.state} ${i.title}\n${i.web_url}`).join("\n\n") || "(none)",
        },
      ],
    },
```

</details>

**依据 3 · 源码核查**：[lib/glab.js:136-178](https://github.com/173787247/dsh-wsl-glab/blob/f85a58aff0935896a3bc4f864f1adcd72e4ca01b/lib/glab.js#L136-L178)

CI 与 issue 原始失败条件。

<details>
<summary>查看原文（43行）</summary>

```text
export async function glabCiStatus({ repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const args = ["ci", "status"];
  if (repo) {
    if (!/^[A-Za-z0-9._/-]+$/.test(repo)) throw new Error("invalid repo");
    args.push("-R", repo);
  }
  const r = await run(bin, args, { timeoutMs, maxOut });
  // ci status may exit non-zero when failed — still return output
  return {
    ok: true,
    exitCode: r.code,
    truncated: r.truncated,
    output: (r.stdout || r.stderr).trim(),
  };
}

export async function glabIssueList({ state = "opened", limit = 20, repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const args = ["issue", "list", "--per-page", String(n), "-F", "json"];
  const st = String(state || "opened");
  if (!/^(opened|closed|all)$/.test(st)) throw new Error("invalid issue state");
  if (st !== "all") args.push("--state", st);
  if (repo) {
    if (!/^[A-Za-z0-9._/-]+$/.test(repo)) throw new Error("invalid repo");
    args.push("-R", repo);
  }
  const r = await run(bin, args, { timeoutMs, maxOut });
  if (r.code !== 0) throw new Error(`glab issue list failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, raw: r.stdout };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, n).map((i) => ({
    iid: i.iid,
    title: i.title,
    state: i.state,
    web_url: i.web_url,
  }));
  return { ok: true, count: list.length, issues: list };
```

</details>

#### 缺口

- 未测试不同部署的 CLI、认证配置与诊断收益
  **影响**：无法判断项目接入开销和可用性
  **进一步探讨**：以只读账号在测试项目验证拒绝、空列表和 CI 非零返回

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
