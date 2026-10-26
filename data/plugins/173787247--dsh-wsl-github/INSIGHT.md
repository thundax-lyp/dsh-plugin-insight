# dsh-wsl-github

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[60345a0](https://github.com/173787247/dsh-wsl-github/tree/60345a0269abaa476131fc06b9e1e8eb6409c724)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-github)
<!-- END META -->

> **实现功能**：WSL 场景下用 GitHub App 或 token 回退查询当前仓库的 open PR 与最近 Actions run，另提供配置提示。

> **核心亮点**：把 GitHub App 最小只读状态查询封装为两模型工具，并区分 API 与推送凭据。详见[Q01](#research-q01)。

> **风险与缺陷**：installation token 缓存未按仓库/owner 隔离，跨账号查询可复用错误 token；子请求失败仍 ok=true。详见[Q02](#research-q02)。

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
  - [Q01 · 两个模型工具提供何种 GitHub 状态？](#detail-section-11)
  - [Q02 · 多 installation 下 token 缓存是否按仓库隔离？](#detail-section-12)
  - [Q03 · 凭据、网络和采用条件是什么？](#detail-section-13)
  - [Q04 · 首次、持续及失败恢复怎样核算成本效果？](#detail-section-14)
  - [Q05 · 怎样证伪按安装作用域缓存能改善跨账号诊断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Agent 在 WSL 开发，需要只读查看当前 GitHub 仓库的 PR 和 CI 状态。

用 gh CLI/GitHub 页面查看 PR 和 Actions；本包把有限只读状态暴露给 DSH Agent。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| App hint | 配置指引 | 非认证验证 |
| repo status | PR/Actions | 只读且部分失败 |
| token 缓存 | 减少签发 | 跨 installation 风险 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| App ID+PEM+安装 | 正式认证 | 可 token 回退 |
| GitHub API 网络 | 状态查询 | 失败 |
| git origin 或 repo | 目标解析 | 需显式指定 |

#### 试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| hint | 核对凭据存在 | 不暴露 secret |
| status | 指定 repo | PR/Actions 对齐页面 |
| 故障 | 权限缺失 | error 不被空列表掩盖 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | App注册/安装、PEM与Node/DSH本地资源，实际价格未知 | 授只读权限、配环境/安装范围并核仓库身份，工时未知 | token回退与App不同；存在性不证明认证成功 |
| 持续使用 | 仓库/PR/Actions API网络与配额，过期后JWT/签发；量未知 | 核部分错误和跨账号范围，工时未知 | token内存复用减少签发，但单槽跨安装可能误用 |
| 失败恢复 | 重试API、重启清缓存/轮换PEM与重新授权资源，金额未知 | 区分权限/目标/缓存/网络，核PR与CI真实状态，工时未知 | 无自动增权/事务写入；本地timeout依宿主signal，恢复时长未知 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 凭据提示 | 仅存在性 | 实际配置成功 |
| PR/Actions | 只读 API | 真实权限覆盖 |
| token 缓存 | 内存/到期 | 跨安装误用 |

> **思考**：installation token 缓存未按仓库/owner 隔离，跨账号查询可复用错误 token；子请求失败仍 ok=true。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 GitHub App 最小只读状态查询封装为两模型工具，并区分 API 与推送凭据。详见[Q01](#research-q01)。

把 GitHub App 最小只读状态查询封装为两模型工具，并区分 API 与推送凭据。详见[Q01](#research-q01)。

Cordis 注册两工具和提示段；JWT 签名、installation token 交换，API 查询仓库/PR/Actions。

<a id="detail-section-5"></a>

### 1.4 主要限制

installation token 缓存未按仓库/owner 隔离，跨账号查询可复用错误 token；子请求失败仍 ok=true。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先以单账号最小权限 App 试用，确认 repo 与 PR/Actions 两字段；多账号需隔离进程或修复缓存。详见[Q02](#research-q02)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核只读查询与不在正常响应中返回密钥；单槽 token 缓存跨 installation 可能误用，真实 API 未验。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、index.js、lib/auth.js、lib/api.js、lib/git.js、lib/github.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交 README、工具注册、认证与 API 源码；未读取真实密钥或调用 GitHub。
- 下一步：隔离 App 的真实私有/公开仓库查询、部分权限失败和双 installation 交替查询。

**分析版本**

- **仓库**：[173787247/dsh-wsl-github](https://github.com/173787247/dsh-wsl-github)
- **版本号**：0.2.0（[固定提交 60345a0](https://github.com/173787247/dsh-wsl-github/tree/60345a0269abaa476131fc06b9e1e8eb6409c724)）
- **版本日期**：2026-10-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按安装与凭据版本缓存、明确不匹配和部分结果，反证及维护代价见[Q05](#research-q05)。

隔离 App 的真实私有/公开仓库查询、部分权限失败和双 installation 交替查询。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 347 | — | — | 2201 |
| .js | source | 5 | 597 | 560 | 6 | — |
| .mjs | source | 1 | 145 | 132 | 15 | — |
| .js | test | 1 | 193 | 178 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-github/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-github/issues?q=is%3Aissue+created%3A2026-09-22T06%3A43%3A23.129Z..2026-10-22T06%3A43%3A23.129Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-github/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A43%3A23.129Z..2026-10-22T06%3A43%3A23.129Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 GitHub App 凭据边界、只读 PR/Actions 查询与多 installation token 缓存行为。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两个模型工具提供何种 GitHub 状态？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件注册 github_app_hint 与 github_repo_status；前者只返回 App ID/私钥路径/token 是否配置及 env 文件是否存在，后者由显式 owner/repo 或当前 git origin 解析仓库，通过 GitHub API 查询最多五个 open PR 和最近一个 Actions run，并给出浏览器 URL。systemPrompt 提醒区分 API 状态与 git push 凭据。接口代码未把 PEM/JWT/installation token 放入正常工具响应；但仓库名称、PR 标题与运行状态会返回给模型。pulls/Actions 子请求失败时仍 ok=true，分别在 error 字段标注。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-70](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/README.md#L37-L70)

作者定义工具职责和不返回密钥。

<details>
<summary>查看原文（34行）</summary>

```text
## Why this plugin exists

WSL agents already have [`dsh-wsl-cred`](https://github.com/173787247/dsh-wsl-cred) (`cred_hint`) for **git push** credentials. They still need the **GitHub API** for “what PRs are open?” and “did CI pass?”—without dumping a PAT into chat.

This plugin mints a short-lived **GitHub App installation token** in memory. Tool output never includes the private key, JWT, or token. Pair with [`dsh-wsl-browser`](https://github.com/173787247/dsh-wsl-browser) (`win_open_url`) to open returned `html_url`s on Windows.

It is intentionally small. It is **not** a 40-tool GitHub connector.

## How it fits dsh-wsl-kit

DSH in **WSL** + Chat in a **Windows** browser is the kit’s home turf. GitHub work splits across plugins:

| Job | Plugin | Tool |
|-----|--------|------|
| Push / HTTPS credentials | [dsh-wsl-cred](https://github.com/173787247/dsh-wsl-cred) | `cred_hint` |
| API: open PRs + latest Actions | **this plugin** | `github_app_hint`, `github_repo_status` |
| Open PR / Actions in Windows | [dsh-wsl-browser](https://github.com/173787247/dsh-wsl-browser) | `win_open_url` |
| Proxy / Node 24 fetch issues | [dsh-wsl-net](https://github.com/173787247/dsh-wsl-net) | `net_doctor` |

**Why the kit path is convenient**

- One install pack (`dsh-wsl-kit` / `install.sh`) instead of ad-hoc PAT wiring.
- Secrets stay on disk under `~/.dsh/` and in process memory—not in Trajectory.
- Same mental model as the rest of the kit: small tools, clear OS boundary.
- Enough of a real GitHub App integration to join the [GitHub Developer Program](https://docs.github.com/en/integrations/concepts/github-developer-program).

Suite overview: [dsh-wsl-kit README](https://github.com/173787247/dsh-wsl-kit#readme).

## Tools

| Tool | Role |
|------|------|
| `github_app_hint` | Whether App credentials / `~/.dsh/dsh-wsl-github.env` exist (existence only), setup + role split vs cred/ssh/`win_open_url` (no secrets) |
| `github_repo_status` | Open PRs (up to 5) + latest Actions run. `repo` optional; default is `git origin` |
```

</details>

**依据 2 · 源码核查**：[index.js:25-83](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/index.js#L25-L83)

hint 工具注册与存在性输出。

<details>
<summary>查看原文（59行）</summary>

```text
export const name = "dsh-wsl-github";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const cache = { token: "", exp: 0, installationId: "" };

  ctx.systemPrompt.section({
    name: "tool:github_repo_status",
    order: 123,
    text: [
      "Use github_app_hint when GitHub API auth is missing or unclear.",
      "Use github_repo_status for the current GitHub repo's open PRs and latest Actions run.",
      "Never paste App private keys, JWTs, or tokens into chat.",
      "Open returned html_url values with win_open_url in the Windows browser.",
      "git push credentials are a different problem — use cred_hint.",
    ].join(" "),
  });

  ctx.tools.register({
    name: "github_app_hint",
    description: "Report whether a GitHub App (or token fallback) is configured and how to set it up. Never returns secrets.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mode: { type: "string" },
          appIdSet: { type: "boolean" },
          privateKeySet: { type: "boolean" },
          installationIdSet: { type: "boolean" },
          tokenFallbackSet: { type: "boolean" },
          envFilePath: { type: "string" },
          envFileExists: { type: "boolean" },
          advice: { type: "array", items: { type: "string" } },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatHintReport(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    execute() {
      const status = publicAuthStatus(resolveAuthSources(config));
      const envFile = detectGithubEnvFile();
      return {
        ...status,
        envFilePath: envFile.path,
        envFileExists: envFile.exists,
        advice: buildAppHint(status, { envFile }),
      };
    },
    presentCall: () => ({ card: "generic", title: "GitHub App hint" }),
    presentResult: (_args, result) => (
      result.isError
        ? { card: "generic", title: "GitHub App hint failed", content: result.content }
        : { card: "generic", title: "GitHub App hint", content: result.content }
    ),
  });
```

</details>

**依据 3 · 源码核查**：[index.js:85-163](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/index.js#L85-L163)

repo_status 工具和源解析。

<details>
<summary>查看原文（79行）</summary>

```text
  ctx.tools.register({
    name: "github_repo_status",
    description: "Show a GitHub repo's open pull requests and latest Actions run via GitHub App (or GH_TOKEN fallback). Defaults to git origin. Never returns secrets.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        repo: {
          type: "string",
          description: "owner/name or GitHub URL. Default: git remote origin.",
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean" },
          mode: { type: "string" },
          repo: { type: "string" },
          html_url: { type: "string" },
          default_branch: { type: "string" },
          private: { type: "boolean" },
          open_prs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                number: { type: "integer" },
                title: { type: "string" },
                html_url: { type: "string" },
                user: { type: "string" },
              },
            },
          },
          latest_run: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              status: { type: "string" },
              conclusion: { type: "string" },
              html_url: { type: "string" },
              head_branch: { type: "string" },
            },
          },
          pulls_error: { type: "string" },
          actions_error: { type: "string" },
          advice: { type: "string" },
          error: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatStatusReport(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const parsed = args?.repo
        ? parseGithubRepo(args.repo)
        : await originRepo(exec?.cwd);
      if (!parsed.ok) {
        return fail("missing", parsed.error || "could not resolve owner/repo");
      }
      const access = await getAccessToken(config, cache, parsed.owner, exec?.signal);
      if (!access.ok) {
        return fail(access.mode || "missing", access.error);
      }
      const status = await fetchRepoStatus(parsed.full, access.token, { signal: exec?.signal });
      if (!status.ok) {
        return fail(access.mode, status.error || "GitHub API request failed");
      }
      return {
        ...status,
        mode: access.mode,
        advice: access.note || "Open html_url with win_open_url if you want the Windows browser.",
      };
    },
```

</details>

**依据 4 · 源码核查**：[lib/api.js:81-120](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/lib/api.js#L81-L120)

仓库/PR/Actions API 与部分失败输出。

<details>
<summary>查看原文（40行）</summary>

```text
export async function fetchRepoStatus(full, token, { fetchFn = fetch, signal, apiBase = API_BASE } = {}) {
  const repoRes = await ghJson(`${apiBase}/repos/${full}`, { token, fetchFn, signal });
  if (!repoRes.ok) return repoRes;
  const pullsRes = await ghJson(
    `${apiBase}/repos/${full}/pulls?state=open&per_page=5&sort=updated`,
    { token, fetchFn, signal },
  );
  const runsRes = await ghJson(
    `${apiBase}/repos/${full}/actions/runs?per_page=1`,
    { token, fetchFn, signal },
  );
  const repo = repoRes.data || {};
  const pulls = pullsRes.ok && Array.isArray(pullsRes.data) ? pullsRes.data : [];
  const runs = runsRes.ok && Array.isArray(runsRes.data?.workflow_runs) ? runsRes.data.workflow_runs : [];
  const run = runs[0] || null;
  return {
    ok: true,
    repo: String(repo.full_name || full),
    html_url: String(repo.html_url || ""),
    default_branch: String(repo.default_branch || ""),
    private: Boolean(repo.private),
    open_prs: pulls.map((pr) => ({
      number: Number(pr.number) || 0,
      title: String(pr.title || ""),
      html_url: String(pr.html_url || ""),
      user: String(pr.user?.login || ""),
    })),
    latest_run: run
      ? {
        name: String(run.name || ""),
        status: String(run.status || ""),
        conclusion: String(run.conclusion || ""),
        html_url: String(run.html_url || ""),
        head_branch: String(run.head_branch || ""),
      }
      : { name: "", status: "", conclusion: "", html_url: "", head_branch: "" },
    pulls_error: pullsRes.ok ? "" : pullsRes.error,
    actions_error: runsRes.ok ? "" : runsRes.error,
  };
}
```

</details>

#### 缺口

- 未以真实 App 安装查询私有仓库。
  **影响**：权限配置与实际响应正确性未知。
  **进一步探讨**：隔离 App 最小权限安装后对照 GitHub 页面和部分权限失败。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多 installation 下 token 缓存是否按仓库隔离？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

getAccessToken 首次根据 owner 选择 installation 并缓存 token、expiry 和 installationId；后续只判断 token 非空且未过期，就直接复用，没有比较当前 owner/repo 与缓存 installationId。若同一 DSH 进程先查 A 账号仓库，再查 B 账号仓库，而 App 在两者分别安装，第二次可能复用 A 的 installation token，得到 404/403，直到过期或重启。pickInstallation 在 owner 不匹配时还回退到安装列表第一项，可能把权限问题误显成仓库不存在。建议缓存按 installation/repo 作用域，owner 不匹配直接要求用户选 installation。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:203-259](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/index.js#L203-L259)

单槽 token cache 未比较 owner。

<details>
<summary>查看原文（57行）</summary>

```text
async function getAccessToken(config, cache, owner, signal) {
  const sources = resolveAuthSources(config);
  const status = publicAuthStatus(sources);
  if (status.mode === "token") {
    return { ok: true, token: sources.token, mode: "token", note: "Using GH_TOKEN/GITHUB_TOKEN fallback." };
  }
  if (status.mode !== "github-app") {
    return { ok: false, mode: "missing", error: "GitHub App credentials missing" };
  }
  if (cache.token && Date.now() < cache.exp) {
    return { ok: true, token: cache.token, mode: "github-app", note: "" };
  }
  let pem;
  try {
    pem = loadPrivateKey(sources);
  } catch (err) {
    return {
      ok: false,
      mode: "github-app",
      error: `Could not read private key file: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  if (!pem) {
    return { ok: false, mode: "github-app", error: "GitHub App private key is empty" };
  }
  let jwt;
  try {
    jwt = createAppJwt(sources.appId, pem);
  } catch (err) {
    return {
      ok: false,
      mode: "github-app",
      error: `Could not sign GitHub App JWT: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  let installationId = sources.installationId;
  let note = "";
  if (!installationId) {
    const listed = await listInstallations(jwt, { signal });
    if (!listed.ok) {
      return { ok: false, mode: "github-app", error: listed.error || "failed to list installations" };
    }
    const picked = pickInstallation(listed.installations, owner);
    if (!picked.ok) return { ok: false, mode: "github-app", error: picked.error };
    installationId = picked.installation.id;
    note = picked.note || "";
  }
  const minted = await mintInstallationToken(jwt, installationId, { signal });
  if (!minted.ok) {
    return { ok: false, mode: "github-app", error: minted.error || "failed to mint installation token" };
  }
  const exp = minted.expiresAt ? Date.parse(minted.expiresAt) : Date.now() + 50 * 60 * 1000;
  cache.token = minted.token;
  cache.exp = Number.isFinite(exp) ? exp - 5 * 60 * 1000 : Date.now() + 50 * 60 * 1000;
  cache.installationId = installationId;
  return { ok: true, token: minted.token, mode: "github-app", note };
}
```

</details>

**依据 2 · 源码核查**：[lib/api.js:51-64](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/lib/api.js#L51-L64)

owner 不匹配回退首个 installation。

<details>
<summary>查看原文（14行）</summary>

```text
export function pickInstallation(installations, owner = "") {
  const rows = Array.isArray(installations) ? installations.filter((i) => i.id) : [];
  if (rows.length === 0) return { ok: false, error: "GitHub App is not installed on any account" };
  const want = String(owner || "").toLowerCase();
  if (want) {
    const match = rows.find((i) => i.account.toLowerCase() === want);
    if (match) return { ok: true, installation: match, note: "" };
  }
  const first = rows[0];
  const note = rows.length > 1
    ? `Multiple installations; using ${first.account || first.id}. Set installationId to pin one.`
    : "";
  return { ok: true, installation: first, note };
}
```

</details>

**依据 3 · 源码核查**：[index.js:143-156](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/index.js#L143-L156)

每次请求沿用 access token 查询仓库。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args, exec) {
      const parsed = args?.repo
        ? parseGithubRepo(args.repo)
        : await originRepo(exec?.cwd);
      if (!parsed.ok) {
        return fail("missing", parsed.error || "could not resolve owner/repo");
      }
      const access = await getAccessToken(config, cache, parsed.owner, exec?.signal);
      if (!access.ok) {
        return fail(access.mode || "missing", access.error);
      }
      const status = await fetchRepoStatus(parsed.full, access.token, { signal: exec?.signal });
      if (!status.ok) {
        return fail(access.mode, status.error || "GitHub API request failed");
```

</details>

#### 缺口

- 未在两个真实 GitHub App 安装中复现。
  **影响**：表现取决于 App 安装覆盖范围。
  **进一步探讨**：用两个 installation 的隔离 API stub/账号交替查询验证缓存误用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据、网络和采用条件是什么？

**研究主题**：依赖、兼容与流程、采用判断

#### 完整回答

推荐路径需注册 GitHub App、保管 PEM、授予 metadata/PR/Actions 只读权限并在 DSH 启动前加载环境变量；可用 GH_TOKEN/GITHUB_TOKEN 作本地烟测回退。App JWT 与 installation token 在进程内生成、短期缓存，GitHub API 网络和速率限制由外部承担。错误处理不会自动请求额外权限；若只缺 Actions 权限，状态依然 ok=true 但 actions_error 有内容。采用时先用 github_app_hint 核对配置，再对固定 repo 测 GitHub URL/PR/Actions，避免把空列表误当无 PR。此包不提供 push，也不替代 git 凭据管理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:74-132](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/README.md#L74-L132)

App 创建、权限及环境加载步骤。

<details>
<summary>查看原文（59行）</summary>

````text
## End-to-end usage (WSL)

1. **Install the plugin** (with the kit or alone):

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-github
```

2. **Register the GitHub App once** (permissions are pre-filled from [`github-app-manifest.json`](./github-app-manifest.json)):

```sh
npm run register-app
```

On GitHub: keep or rename the app → **Create GitHub App**. The script writes App ID + PEM to `~/.dsh/` and does **not** print secrets.

| Permission | Access | Why |
|------------|--------|-----|
| **Metadata** | Read | Repo name, default branch |
| **Pull requests** | Read | List open PRs |
| **Actions** | Read | Latest workflow run |
| Webhook | Off | This plugin polls the API; it does not receive events |
| Install scope | Private app (`public: false`) | Install on your account while developing |

3. **Install the App** on your GitHub account (link printed by the script, or [apps/dsh-wsl-github](https://github.com/apps/dsh-wsl-github)). Choose **All repositories** or only the repos you need.

4. **Load env before `dsh web`** (WSL / bash):

```sh
set -a
source "$HOME/.dsh/dsh-wsl-github.env"
set +a
dsh web
```

Windows PowerShell (if you start DSH from Windows):

```powershell
Get-Content "$HOME\.dsh\dsh-wsl-github.env" | ForEach-Object {
  if ($_ -match '^(GITHUB_[A-Z_]+)=(.*)$') { Set-Item -Path "Env:$($matches[1])" -Value $matches[2] }
}
```

5. Open a **new** session. Ask the agent:

   - “Run `github_app_hint`.”
   - “Run `github_repo_status` for this repo.”
   - “Open that `html_url` with `win_open_url`.”

If HTTPS to GitHub fails, run `net_doctor`. If `git push` fails, run `cred_hint`—that is a different problem from this plugin.

Manual App creation (no script): [Register a GitHub App](https://github.com/settings/apps/new), Homepage `https://github.com/173787247/dsh-wsl-kit`, same permissions as the table, webhook off, then:

```sh
export GITHUB_APP_ID=123456
export GITHUB_APP_PRIVATE_KEY_PATH="$HOME/.dsh/dsh-wsl-github.pem"
```

`GITHUB_TOKEN` / `GH_TOKEN` is a last-resort smoke-test fallback, not the intended auth.
````

</details>

**依据 2 · 源码核查**：[lib/auth.js:6-62](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/lib/auth.js#L6-L62)

凭据来源和 JWT 签名。

<details>
<summary>查看原文（57行）</summary>

```text
export function resolveAuthSources(config = {}, env = process.env) {
  return {
    appId: String(config.appId || env.GITHUB_APP_ID || "").trim(),
    keyPath: String(config.privateKeyPath || env.GITHUB_APP_PRIVATE_KEY_PATH || "").trim(),
    keyInline: String(env.GITHUB_APP_PRIVATE_KEY || "").trim(),
    installationId: String(config.installationId || env.GITHUB_APP_INSTALLATION_ID || "").trim(),
    token: String(env.GITHUB_TOKEN || env.GH_TOKEN || "").trim(),
  };
}

export function publicAuthStatus(sources) {
  const privateKeySet = Boolean(sources.keyInline || sources.keyPath);
  let mode = "missing";
  if (sources.appId && privateKeySet) mode = "github-app";
  else if (sources.token) mode = "token";
  return {
    mode,
    appIdSet: Boolean(sources.appId),
    privateKeySet,
    installationIdSet: Boolean(sources.installationId),
    tokenFallbackSet: Boolean(sources.token),
  };
}

export function expandPath(p, home = homedir()) {
  const raw = String(p || "").trim();
  if (!raw) return "";
  if (raw === "~") return home;
  if (raw.startsWith("~/") || raw.startsWith("~\\")) return resolve(home, raw.slice(2));
  return raw;
}

export function normalizePem(raw) {
  return String(raw || "").replace(/\\n/g, "\n").trim();
}

export function loadPrivateKey(sources, { readFile = readFileSync } = {}) {
  if (sources.keyInline) return normalizePem(sources.keyInline);
  if (sources.keyPath) {
    const path = expandPath(sources.keyPath);
    return normalizePem(readFile(path, "utf8"));
  }
  return "";
}

export function createAppJwt(appId, privateKeyPem, nowSec = Math.floor(Date.now() / 1000)) {
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iat: nowSec - 60,
    exp: nowSec + 540,
    iss: String(appId),
  };
  const h = Buffer.from(JSON.stringify(header)).toString("base64url");
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const data = `${h}.${p}`;
  const sig = sign("sha256", Buffer.from(data), privateKeyPem);
  return `${data}.${sig.toString("base64url")}`;
```

</details>

**依据 3 · 源码核查**：[lib/api.js:1-35](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/lib/api.js#L1-L35)

GitHub API Bearer 请求及错误解析。

<details>
<summary>查看原文（35行）</summary>

```text
export const API_BASE = "https://api.github.com";
export const USER_AGENT = "dsh-wsl-github";

export function ghHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": USER_AGENT,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function ghJson(url, { token, method = "GET", fetchFn = fetch, signal, body } = {}) {
  const res = await fetchFn(url, {
    method,
    headers: ghHeaders(token),
    signal,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.slice(0, 200) };
    }
  }
  if (!res.ok) {
    const message = data && typeof data.message === "string" ? data.message : `HTTP ${res.status}`;
    return { ok: false, status: res.status, error: message };
  }
  return { ok: true, status: res.status, data };
}
```

</details>

**依据 4 · 源码核查**：[lib/api.js:81-120](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/lib/api.js#L81-L120)

部分 API 失败与 error 字段。

<details>
<summary>查看原文（40行）</summary>

```text
export async function fetchRepoStatus(full, token, { fetchFn = fetch, signal, apiBase = API_BASE } = {}) {
  const repoRes = await ghJson(`${apiBase}/repos/${full}`, { token, fetchFn, signal });
  if (!repoRes.ok) return repoRes;
  const pullsRes = await ghJson(
    `${apiBase}/repos/${full}/pulls?state=open&per_page=5&sort=updated`,
    { token, fetchFn, signal },
  );
  const runsRes = await ghJson(
    `${apiBase}/repos/${full}/actions/runs?per_page=1`,
    { token, fetchFn, signal },
  );
  const repo = repoRes.data || {};
  const pulls = pullsRes.ok && Array.isArray(pullsRes.data) ? pullsRes.data : [];
  const runs = runsRes.ok && Array.isArray(runsRes.data?.workflow_runs) ? runsRes.data.workflow_runs : [];
  const run = runs[0] || null;
  return {
    ok: true,
    repo: String(repo.full_name || full),
    html_url: String(repo.html_url || ""),
    default_branch: String(repo.default_branch || ""),
    private: Boolean(repo.private),
    open_prs: pulls.map((pr) => ({
      number: Number(pr.number) || 0,
      title: String(pr.title || ""),
      html_url: String(pr.html_url || ""),
      user: String(pr.user?.login || ""),
    })),
    latest_run: run
      ? {
        name: String(run.name || ""),
        status: String(run.status || ""),
        conclusion: String(run.conclusion || ""),
        html_url: String(run.html_url || ""),
        head_branch: String(run.head_branch || ""),
      }
      : { name: "", status: "", conclusion: "", html_url: "", head_branch: "" },
    pulls_error: pullsRes.ok ? "" : pullsRes.error,
    actions_error: runsRes.ok ? "" : runsRes.error,
  };
}
```

</details>

#### 缺口

- 未做真实 API 调用，也未测速率限制。
  **影响**：运营成本与私有仓库覆盖未知。
  **进一步探讨**：隔离只读 App 和双仓库验证 token 作用域、部分权限故障。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续及失败恢复怎样核算成本效果？

**研究主题**：效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | App注册/安装、PEM与Node/DSH本地资源，实际价格未知 | 授只读权限、配环境/安装范围并核仓库身份，工时未知 | token回退与App不同；存在性不证明认证成功 |
| 持续使用 | 仓库/PR/Actions API网络与配额，过期后JWT/签发；量未知 | 核部分错误和跨账号范围，工时未知 | token内存复用减少签发，但单槽跨安装可能误用 |
| 失败恢复 | 重试API、重启清缓存/轮换PEM与重新授权资源，金额未知 | 区分权限/目标/缓存/网络，核PR与CI真实状态，工时未知 | 无自动增权/事务写入；本地timeout依宿主signal，恢复时长未知 |

以同一仓库目标上可区分完整/部分结果的只读状态为单位，不将ok=true或凭据存在当CI业务通过。相比人工gh CLI/页面检查，模型工具减少切换但仍有App管理；PR最多五条和最新一条Actions不等全仓检查。Git origin有5秒execFile timeout，API透传调用signal，没有本helper独立网络期限/响应字节上限；不能把工具注册timeoutMs直接推成所有层都受硬预算。实际配额、网络、模型和配置/恢复工时未知。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:191-259](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/index.js#L191-L259)

origin预算与token复用

<details>
<summary>查看原文（69行）</summary>

```text
  try {
    const { stdout } = await execFileAsync("git", ["remote", "get-url", "origin"], {
      cwd,
      encoding: "utf8",
      timeout: 5_000,
    });
    return parseGithubRepo(String(stdout || "").trim());
  } catch {
    return { ok: false, error: "no git origin; pass repo as owner/name" };
  }
}

async function getAccessToken(config, cache, owner, signal) {
  const sources = resolveAuthSources(config);
  const status = publicAuthStatus(sources);
  if (status.mode === "token") {
    return { ok: true, token: sources.token, mode: "token", note: "Using GH_TOKEN/GITHUB_TOKEN fallback." };
  }
  if (status.mode !== "github-app") {
    return { ok: false, mode: "missing", error: "GitHub App credentials missing" };
  }
  if (cache.token && Date.now() < cache.exp) {
    return { ok: true, token: cache.token, mode: "github-app", note: "" };
  }
  let pem;
  try {
    pem = loadPrivateKey(sources);
  } catch (err) {
    return {
      ok: false,
      mode: "github-app",
      error: `Could not read private key file: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  if (!pem) {
    return { ok: false, mode: "github-app", error: "GitHub App private key is empty" };
  }
  let jwt;
  try {
    jwt = createAppJwt(sources.appId, pem);
  } catch (err) {
    return {
      ok: false,
      mode: "github-app",
      error: `Could not sign GitHub App JWT: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  let installationId = sources.installationId;
  let note = "";
  if (!installationId) {
    const listed = await listInstallations(jwt, { signal });
    if (!listed.ok) {
      return { ok: false, mode: "github-app", error: listed.error || "failed to list installations" };
    }
    const picked = pickInstallation(listed.installations, owner);
    if (!picked.ok) return { ok: false, mode: "github-app", error: picked.error };
    installationId = picked.installation.id;
    note = picked.note || "";
  }
  const minted = await mintInstallationToken(jwt, installationId, { signal });
  if (!minted.ok) {
    return { ok: false, mode: "github-app", error: minted.error || "failed to mint installation token" };
  }
  const exp = minted.expiresAt ? Date.parse(minted.expiresAt) : Date.now() + 50 * 60 * 1000;
  cache.token = minted.token;
  cache.exp = Number.isFinite(exp) ? exp - 5 * 60 * 1000 : Date.now() + 50 * 60 * 1000;
  cache.installationId = installationId;
  return { ok: true, token: minted.token, mode: "github-app", note };
}
```

</details>

**依据 2 · 源码核查**：[lib/api.js:14-35](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/lib/api.js#L14-L35)

网络signal和完整响应读取

<details>
<summary>查看原文（22行）</summary>

```text
export async function ghJson(url, { token, method = "GET", fetchFn = fetch, signal, body } = {}) {
  const res = await fetchFn(url, {
    method,
    headers: ghHeaders(token),
    signal,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.slice(0, 200) };
    }
  }
  if (!res.ok) {
    const message = data && typeof data.message === "string" ? data.message : `HTTP ${res.status}`;
    return { ok: false, status: res.status, error: message };
  }
  return { ok: true, status: res.status, data };
}
```

</details>

**依据 3 · 源码核查**：[lib/api.js:81-120](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/lib/api.js#L81-L120)

三查询及部分结果

<details>
<summary>查看原文（40行）</summary>

```text
export async function fetchRepoStatus(full, token, { fetchFn = fetch, signal, apiBase = API_BASE } = {}) {
  const repoRes = await ghJson(`${apiBase}/repos/${full}`, { token, fetchFn, signal });
  if (!repoRes.ok) return repoRes;
  const pullsRes = await ghJson(
    `${apiBase}/repos/${full}/pulls?state=open&per_page=5&sort=updated`,
    { token, fetchFn, signal },
  );
  const runsRes = await ghJson(
    `${apiBase}/repos/${full}/actions/runs?per_page=1`,
    { token, fetchFn, signal },
  );
  const repo = repoRes.data || {};
  const pulls = pullsRes.ok && Array.isArray(pullsRes.data) ? pullsRes.data : [];
  const runs = runsRes.ok && Array.isArray(runsRes.data?.workflow_runs) ? runsRes.data.workflow_runs : [];
  const run = runs[0] || null;
  return {
    ok: true,
    repo: String(repo.full_name || full),
    html_url: String(repo.html_url || ""),
    default_branch: String(repo.default_branch || ""),
    private: Boolean(repo.private),
    open_prs: pulls.map((pr) => ({
      number: Number(pr.number) || 0,
      title: String(pr.title || ""),
      html_url: String(pr.html_url || ""),
      user: String(pr.user?.login || ""),
    })),
    latest_run: run
      ? {
        name: String(run.name || ""),
        status: String(run.status || ""),
        conclusion: String(run.conclusion || ""),
        html_url: String(run.html_url || ""),
        head_branch: String(run.head_branch || ""),
      }
      : { name: "", status: "", conclusion: "", html_url: "", head_branch: "" },
    pulls_error: pullsRes.ok ? "" : pullsRes.error,
    actions_error: runsRes.ok ? "" : runsRes.error,
  };
}
```

</details>

#### 缺口

- 账号安装范围、调用频率、宿主signal时限及响应规模未知
  **影响**：无法估算连续使用成本和故障恢复时长
  **进一步探讨**：从固定目标的查询量、部分错误与凭据维护记录入手

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪按安装作用域缓存能改善跨账号诊断？

**研究主题**：新假设与验证、工程质量与复用、采用判断

#### 完整回答

固定实现先用单槽未过期token，未核owner和缓存installationId；owner无匹配又回退首项。相对当前缓存，设计假设是先精确选择installation，以App身份/安装ID及配置版本缓存token，owner不匹配时明确要求选择，并给PR/Actions标独立成功状态，可减少跨账号误404/403与空列表误读。条件是安装映射可靠、凭据轮换能使旧缓存失效，代价是映射查询、更多token槽及权限信息维护。最小对照用两个安装、相同仓库短名不同owner、凭据轮换、安装撤回、PR或Actions单项403、过期边界与并发请求的受控API响应，对照原版/隔离原型实际Bearer归属、错误归因、签发请求数和响应时间。若仍复用错误安装、权限失败仍被当无PR/无run，或管理开销超过节省签发，则假设被证伪。方案未实现/执行；缓存修正不增加App本身授权，也不证明CI结论的业务验收。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:203-259](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/index.js#L203-L259)

单槽缓存及安装选择

<details>
<summary>查看原文（57行）</summary>

```text
async function getAccessToken(config, cache, owner, signal) {
  const sources = resolveAuthSources(config);
  const status = publicAuthStatus(sources);
  if (status.mode === "token") {
    return { ok: true, token: sources.token, mode: "token", note: "Using GH_TOKEN/GITHUB_TOKEN fallback." };
  }
  if (status.mode !== "github-app") {
    return { ok: false, mode: "missing", error: "GitHub App credentials missing" };
  }
  if (cache.token && Date.now() < cache.exp) {
    return { ok: true, token: cache.token, mode: "github-app", note: "" };
  }
  let pem;
  try {
    pem = loadPrivateKey(sources);
  } catch (err) {
    return {
      ok: false,
      mode: "github-app",
      error: `Could not read private key file: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  if (!pem) {
    return { ok: false, mode: "github-app", error: "GitHub App private key is empty" };
  }
  let jwt;
  try {
    jwt = createAppJwt(sources.appId, pem);
  } catch (err) {
    return {
      ok: false,
      mode: "github-app",
      error: `Could not sign GitHub App JWT: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  let installationId = sources.installationId;
  let note = "";
  if (!installationId) {
    const listed = await listInstallations(jwt, { signal });
    if (!listed.ok) {
      return { ok: false, mode: "github-app", error: listed.error || "failed to list installations" };
    }
    const picked = pickInstallation(listed.installations, owner);
    if (!picked.ok) return { ok: false, mode: "github-app", error: picked.error };
    installationId = picked.installation.id;
    note = picked.note || "";
  }
  const minted = await mintInstallationToken(jwt, installationId, { signal });
  if (!minted.ok) {
    return { ok: false, mode: "github-app", error: minted.error || "failed to mint installation token" };
  }
  const exp = minted.expiresAt ? Date.parse(minted.expiresAt) : Date.now() + 50 * 60 * 1000;
  cache.token = minted.token;
  cache.exp = Number.isFinite(exp) ? exp - 5 * 60 * 1000 : Date.now() + 50 * 60 * 1000;
  cache.installationId = installationId;
  return { ok: true, token: minted.token, mode: "github-app", note };
}
```

</details>

**依据 2 · 源码核查**：[lib/api.js:51-64](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/lib/api.js#L51-L64)

无匹配回退首项

<details>
<summary>查看原文（14行）</summary>

```text
export function pickInstallation(installations, owner = "") {
  const rows = Array.isArray(installations) ? installations.filter((i) => i.id) : [];
  if (rows.length === 0) return { ok: false, error: "GitHub App is not installed on any account" };
  const want = String(owner || "").toLowerCase();
  if (want) {
    const match = rows.find((i) => i.account.toLowerCase() === want);
    if (match) return { ok: true, installation: match, note: "" };
  }
  const first = rows[0];
  const note = rows.length > 1
    ? `Multiple installations; using ${first.account || first.id}. Set installationId to pin one.`
    : "";
  return { ok: true, installation: first, note };
}
```

</details>

**依据 3 · 源码核查**：[lib/api.js:81-120](https://github.com/173787247/dsh-wsl-github/blob/60345a0269abaa476131fc06b9e1e8eb6409c724/lib/api.js#L81-L120)

部分查询状态

<details>
<summary>查看原文（40行）</summary>

```text
export async function fetchRepoStatus(full, token, { fetchFn = fetch, signal, apiBase = API_BASE } = {}) {
  const repoRes = await ghJson(`${apiBase}/repos/${full}`, { token, fetchFn, signal });
  if (!repoRes.ok) return repoRes;
  const pullsRes = await ghJson(
    `${apiBase}/repos/${full}/pulls?state=open&per_page=5&sort=updated`,
    { token, fetchFn, signal },
  );
  const runsRes = await ghJson(
    `${apiBase}/repos/${full}/actions/runs?per_page=1`,
    { token, fetchFn, signal },
  );
  const repo = repoRes.data || {};
  const pulls = pullsRes.ok && Array.isArray(pullsRes.data) ? pullsRes.data : [];
  const runs = runsRes.ok && Array.isArray(runsRes.data?.workflow_runs) ? runsRes.data.workflow_runs : [];
  const run = runs[0] || null;
  return {
    ok: true,
    repo: String(repo.full_name || full),
    html_url: String(repo.html_url || ""),
    default_branch: String(repo.default_branch || ""),
    private: Boolean(repo.private),
    open_prs: pulls.map((pr) => ({
      number: Number(pr.number) || 0,
      title: String(pr.title || ""),
      html_url: String(pr.html_url || ""),
      user: String(pr.user?.login || ""),
    })),
    latest_run: run
      ? {
        name: String(run.name || ""),
        status: String(run.status || ""),
        conclusion: String(run.conclusion || ""),
        html_url: String(run.html_url || ""),
        head_branch: String(run.head_branch || ""),
      }
      : { name: "", status: "", conclusion: "", html_url: "", head_branch: "" },
    pulls_error: pullsRes.ok ? "" : pullsRes.error,
    actions_error: runsRes.ok ? "" : runsRes.error,
  };
}
```

</details>

#### 缺口

- 实际多安装映射及凭据轮换/撤回时间语义未知
  **影响**：缓存与目标绑定方案尚无对照证据
  **进一步探讨**：从固定安装真值和假API失败矩阵入手

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
