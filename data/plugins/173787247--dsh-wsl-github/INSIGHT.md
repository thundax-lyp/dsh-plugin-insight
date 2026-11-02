# dsh-wsl-github

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[320b5f5](https://github.com/173787247/dsh-wsl-github/tree/320b5f5026c280d81e8f018d972dcd27dd799c42)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-github)
<!-- END META -->

> **功能**：以GitHub App或token回退查询仓库open PR和最新Actions，并提供凭据存在性提示，不处理git push。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) App最小字段提示/只读状态工具与API/push分工明确，正常路径不返回PEM/token；认证协议属于GitHub。

> **主要限制**：[Q03](#research-q03) 单槽token不比owner/安装/凭据版本，未匹配可取首安装；子查询失败仍ok/none，latest run也非目标PR检查全貌。

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
  - [Q01 · 只读GitHub状态工具解决什么任务？](#detail-section-11)
  - [Q02 · App凭据、目标仓库与API如何接线？](#detail-section-12)
  - [Q03 · 缓存和部分成功会否误导仓库/CI判断？](#detail-section-13)
  - [Q04 · 怎样限定采用并验证隔离缓存和部分状态？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH开发Agent只读查看明确GitHub仓库PR/Actions状态，需核目标ref和权限，不替代PR合并检查。

GitHub网页或手工gh/api与密钥接线；本包集中小范围API调用，不是完整GitHub连接器或push认证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| App hint | 配置存在性和角色分工 | 不读PEM、不证认证 |
| App/token API | PR/Actions小范围状态 | App安装权限/网络，非push |
| 内存缓存 | 减重复签发 | 单槽未隔owner/安装/轮换 |
| 状态报告 | 给URL和部分错误 | none可能伴错误，最新run非PR完整检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/prompt、Node>=18 | 必需 | 两工具与fetch/签名 | 宿主signal兼容未验 |
| App ID/PEM/安装权限 | App模式必需 | JWT换token | hint存在不证认证 |
| GH_TOKEN/GITHUB_TOKEN | 可选回退 | 直接API | 权限不等App最小只读 |
| 明确repo或Git/exec.cwd | 必需其一 | 目标归属 | origin失败应显式传repo |
| api.github.com网络/配额 | 必需 | PR/Actions | 子错误须查，不能当none |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 单安装最小只读、PEM不进聊天 | hint仅存在检查 |
| 查询 | 明确repo核PR/Actions各notes | 目标与权限真实符合 |
| 核CI | 回页面核PR head检查 | latest仓库run非合并依据 |
| 多账号/失败 | 隔离进程或先修缓存，核权限 | 不自动增权 |
| 退出 | 禁用并处理key/App授权 | 停工具不等撤授权 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | App/PEM/Node/宿主 | 注册安装/最小权限与目标核验 | 价格/工时未知 |
| 持续 | 三类API/签发/模型token | 子错误和head/权限核对 | 配额与规模未验 |
| 失败恢复 | 重试/重启缓存/轮换key | 分权限/目标/缓存/网络 | 耗时与跨安装恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 凭据提示 | 存在性布尔与env路径 | key可读/认证成功 |
| PR/Actions | 小范围REST与精选字段 | 全PR/目标head检查覆盖 |
| token复用 | 到期内存缓存 | 跨安装/凭据轮换正确性 |

> **思考**：[Q03](#research-q03) 单槽token不比owner/安装/凭据版本，未匹配可取首安装；子查询失败仍ok/none，latest run也非目标PR检查全貌。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) App最小字段提示/只读状态工具与API/push分工明确，正常路径不返回PEM/token；认证协议属于GitHub。

[Q02](#research-q02) hint/API分层、正常结果不返token与signal传递可借鉴；[Q03](#research-q03) 缓存键应匹配权限上下文，空结果与未知应区别，注释只读不强制凭据授权。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 单槽token不比owner/安装/凭据版本，未匹配可取首安装；子查询失败仍ok/none，latest run也非目标PR检查全貌。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 单账号固定安装最小权限可试，明确repo并核两子字段/notes；多账号先隔离或修缓存，关键CI回目标PR页核head，不自动增权。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态复核正式findings及固定入口/auth/api/git/渲染；无真实PEM读取/App注册/API调用或目标测试，多安装缺陷未现网复现。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/api.js、lib/auth.js、lib/github.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整认证/REST/解析/最终渲染及工具接线；不运行注册App脚本、不读取真实PEM、不核现时服务价格与配额，相关值保持未知。
- 下一步：[Q04](#research-q04) 两owner/轮换/子403/不同head假API对照，再单安装真实宿主验收，均尚未执行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-github](https://github.com/173787247/dsh-wsl-github)
- **版本号**：0.2.0（[固定提交 320b5f5](https://github.com/173787247/dsh-wsl-github/tree/320b5f5026c280d81e8f018d972dcd27dd799c42)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 待验证是按安装/凭据版本缓存、owner不匹配拒绝与逐子状态/head绑定，对照已有note/error降低错误复用和误CI判断。

[Q04](#research-q04) 两owner/轮换/子403/不同head假API对照，再单安装真实宿主验收，均尚未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 347 | — | — | 2201 |
| .js | source | 5 | 597 | 560 | 6 | — |
| .mjs | source | 1 | 145 | 132 | 15 | — |
| .js | test | 1 | 193 | 178 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-github/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-github/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-github/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：只读GitHub状态查询的认证、缓存和部分结果能支持什么判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 只读GitHub状态工具解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向DSH开发Agent在当前仓库查看最多5条最近更新open PR及仓库最新1次Actions run，无需把PAT贴聊天。相对手工浏览GitHub或gh api，它提供App配置提示和小范围状态查询，区分API权限与git push/GCM；Windows打开返回URL由另一插件负责。没有写PR、rerun CI、合并或任意GitHub API功能。

“最新run”是整个仓库runs第一项，不是指定提交/PR检查全覆盖；用户问某PR能否合并时不能把这个字段当答案。正确结果要仓库、目标ref和各子查询权限匹配。App token生命周期来自GitHub，本包贡献在认证接线与最小化结果，不是新认证协议。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-43](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/README.md#L39-L43)

作者小范围与密钥目标。

```text
WSL agents already have [`dsh-wsl-cred`](https://github.com/173787247/dsh-wsl-cred) (`cred_hint`) for **git push** credentials. They still need the **GitHub API** for “what PRs are open?” and “did CI pass?”—without dumping a PAT into chat.

This plugin mints a short-lived **GitHub App installation token** in memory. Tool output never includes the private key, JWT, or token. Pair with [`dsh-wsl-browser`](https://github.com/173787247/dsh-wsl-browser) (`win_open_url`) to open returned `html_url`s on Windows.

It is intentionally small. It is **not** a 40-tool GitHub connector.
```

**依据 2 · 作者声明**：[README.md:65-72](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/README.md#L65-L72)

查询限制和无live App CI。

```text
## Tools

| Tool | Role |
|------|------|
| `github_app_hint` | Whether App credentials / `~/.dsh/dsh-wsl-github.env` exist (existence only), setup + role split vs cred/ssh/`win_open_url` (no secrets) |
| `github_repo_status` | Open PRs (up to 5) + latest Actions run. `repo` optional; default is `git origin` |

After configuring the env file, self-check with `github_app_hint` (no live App e2e in CI — needs your PEM).
```

**依据 3 · 源码核查**：[lib/api.js:81-119](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/lib/api.js#L81-L119)

PR/Actions具体查询参数。

<details>
<summary>查看原文（39行）</summary>

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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · App凭据、目标仓库与API如何接线？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

github_app_hint只看配置/env的存在性布尔和env文件路径是否存在，不读PEM内容或验证App。status接受显式repo或用exec.cwd跑git remote get-url origin，解析后固定api.github.com。App ID+PEM优先，否则GITHUB_TOKEN/GH_TOKEN回退；真正status才读PEM，用RS256签JWT，列安装/按owner选或指定安装，POST换installation token，内存提前5分钟过期缓存。

repo元数据GET成功后再顺序查pulls和runs，返回有限字段；token和PEM不作为正常成功输出字段。fetch传宿主signal，但无组件本地deadline；git origin五秒有cwd却不带signal。注册isConcurrencySafe true而cache为单槽，无inflight共享。固定API与结果选择、提示/API查询分层值得借鉴，hint存在性不能等认证验收，App权限/安装范围/网络与配额都要独立核。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:143-162](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/index.js#L143-L162)

目标cwd、signal及结果接线。

<details>
<summary>查看原文（20行）</summary>

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
      }
      return {
        ...status,
        mode: access.mode,
        advice: access.note || "Open html_url with win_open_url if you want the Windows browser.",
      };
```

</details>

**依据 2 · 源码核查**：[index.js:190-258](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/index.js#L190-L258)

认证与单槽缓存。

<details>
<summary>查看原文（69行）</summary>

```text
async function originRepo(cwd) {
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
```

</details>

**依据 3 · 源码核查**：[lib/auth.js:6-27](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/lib/auth.js#L6-L27)

来源和仅存在性status。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/auth.js:42-62](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/lib/auth.js#L42-L62)

PEM读取和JWT签名。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 5 · 源码核查**：[lib/api.js:14-34](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/lib/api.js#L14-L34)

fetch/signal与API错误。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 缓存和部分成功会否误导仓库/CI判断？

**研究主题**：缺陷与关键质疑

#### 完整回答

cache命中仅看token和exp，不比较owner、installationId、App/凭据版本；切换账号/配置后可在过期前复用原安装token，导致错误权限/失败，不能说按仓库隔离。选安装owner无匹配时仍回第一项，list未分页；note仅初次签发返回，缓存命中note空可能失去错安装线索。此控制流已定位，未真实App复现，不声称突破GitHub服务端权限或泄漏token。

repo GET成功便整体ok=true，即使pulls/actions失败也用空数组/空run再附error；format先打印none再notes，读者/模型若忽略notes可能把无权限当无PR/无CI。最高5条PR与仓库最新run限制同样使“CI都过”不成立。正常输出不含密钥是积极证据，但API错误文本/PR标题仍外部数据，looksLikeSecret函数未接在最终输出路径，不可扩大成全输出零敏感保证。

应用不是WSL专属进程调用，无WSL检测是可移植设计，不因名字认定非WSL拒绝。默认App建议只读权限也不强制实际安装权限；工具只读查询不等持有的凭据一定只读。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:203-214](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/index.js#L203-L214)

缓存无owner/安装/凭据键。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[index.js:238-258](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/index.js#L238-L258)

选择与缓存写入。

<details>
<summary>查看原文（21行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/api.js:37-64](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/lib/api.js#L37-L64)

未分页和未匹配退首项。

<details>
<summary>查看原文（28行）</summary>

```text
export async function listInstallations(jwt, { fetchFn = fetch, signal, apiBase = API_BASE } = {}) {
  const res = await ghJson(`${apiBase}/app/installations`, { token: jwt, fetchFn, signal });
  if (!res.ok) return res;
  const rows = Array.isArray(res.data) ? res.data : [];
  return {
    ok: true,
    status: res.status,
    installations: rows.map((row) => ({
      id: String(row.id ?? ""),
      account: String(row.account?.login ?? ""),
    })),
  };
}

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

**依据 4 · 源码核查**：[lib/api.js:81-119](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/lib/api.js#L81-L119)

部分失败仍ok和有限范围。

<details>
<summary>查看原文（39行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/github.js:71-107](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/lib/github.js#L71-L107)

none与notes、未接入secret检测。

<details>
<summary>查看原文（37行）</summary>

```text
export function formatStatusReport(value) {
  if (!value.ok) {
    return `github_repo_status failed: ${value.error || "unknown error"}`;
  }
  const lines = [
    `repo: ${value.repo}`,
    `url: ${value.html_url}`,
    `default_branch: ${value.default_branch || "(unknown)"}`,
    `auth: ${value.mode}`,
  ];
  const prs = value.open_prs || [];
  if (prs.length === 0) {
    lines.push("open_prs: (none)");
  } else {
    lines.push("open_prs:");
    for (const pr of prs) {
      lines.push(`  #${pr.number} ${pr.title} ${pr.html_url}`);
    }
  }
  const run = value.latest_run || {};
  if (run.html_url) {
    lines.push(
      `latest_run: ${run.name} ${run.status}/${run.conclusion || "pending"} ${run.html_url}`,
    );
  } else {
    lines.push("latest_run: (none)");
  }
  if (value.pulls_error) lines.push(`pulls_note: ${value.pulls_error}`);
  if (value.actions_error) lines.push(`actions_note: ${value.actions_error}`);
  if (value.advice) lines.push(value.advice);
  return lines.join("\n");
}

export function looksLikeSecret(text) {
  return /BEGIN [A-Z ]*PRIVATE KEY|eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}|ghp_|github_pat_|ghs_/i.test(
    String(text || ""),
  );
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定采用并验证隔离缓存和部分状态？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可在单账号、单固定安装、最小只读权限和明确repo下试用，两子字段连notes一起核，并用GitHub页面确认目标PR/head对应检查；不要据仓库latest run作合并判断。多账号先隔离进程或修缓存，不让共享单槽跨安装。App hint只证明来源存在，真实权限成功需单独验，注册App/PEM生成非本次执行。

首次有App注册安装、PEM权限与环境/重启；持续为元数据/PR/Actions网络配额、token签发和模型结果，价格/调用规模未知；失败需区分权限/目标/缓存/网络，可能重启清缓存、轮换key/撤销App，不能自动增权。退出禁用、处理实际凭据/安装授权，停工具不等撤销GitHub访问权。

未验证方向是以App/installation/凭据版本做缓存键、owner不匹配显式拒绝、每子查询状态明确并绑定目标head。相对已有note/error字段，增量是避免把未知折叠none并阻止错安装复用。隔离假API/两owner、key轮换、子403与空列表、不同PR head测错误复用/误判及签发增量；若现有状态足够或缓存复杂度/调用成本抵消收益则不加。

#### 证据与依据

**依据 1 · 源码核查**：[lib/github.js:15-23](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/lib/github.js#L15-L23)

作者只读权限建议。

```text
export function buildAppHint(status, { envFile = null } = {}) {
  const advice = [
    "Never paste a GitHub App private key, JWT, or access token into chat or the system prompt.",
    "Prefer a GitHub App (this plugin) over a personal access token.",
    "Division of labor: github_app_hint/github_repo_status = read-only App API (PRs/Actions). cred_hint = HTTPS git push (GCM). ssh_agent_hint = SSH remotes. win_open_url = open html_url in Windows browser.",
    "Create the app at https://github.com/settings/apps/new — Homepage URL can be https://github.com/173787247/dsh-wsl-kit.",
    "Disable webhooks. Permissions: Metadata read, Pull requests read, Actions read. Install on your account.",
    "Set GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY_PATH (PEM file, not in git). Optional: GITHUB_APP_INSTALLATION_ID.",
    "After github_repo_status, open html_url with win_open_url to view the PR or Actions run in the Windows browser.",
```

**依据 2 · 源码核查**：[index.js:212-258](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/index.js#L212-L258)

缓存与轮换验证来源。

<details>
<summary>查看原文（47行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/api.js:93-119](https://github.com/173787247/dsh-wsl-github/blob/320b5f5026c280d81e8f018d972dcd27dd799c42/lib/api.js#L93-L119)

子状态与空结果对照来源。

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

#### 缺口

- 未真实App/权限范围/多安装/配额或修复对照
  **影响**：不能保证现网兼容、跨账号正确或净节省
  **进一步探讨**：单安装最小权限验repo和每子字段，再假API比较缓存/部分失败，记录签发与人工成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
