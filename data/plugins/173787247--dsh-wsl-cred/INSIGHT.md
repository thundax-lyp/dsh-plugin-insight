# dsh-wsl-cred

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[1c45da3](https://github.com/173787247/dsh-wsl-cred/tree/1c45da3969a109959783373175150c87a3a33fa0)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred)
<!-- END META -->

> **实现功能**：汇总Git helper配置、Windows GCM候选路径与origin类型，但原样helper输出存在敏感配置外发边界。

> **核心亮点**：把常用Git凭据配置线索放入单一模型报告。详见[Q01](#research-q01)。

> **风险与缺陷**：内联helper可能含敏感值却原样输出，错误吞成未配，宿主cwd不等会话仓库。详见[Q03](#research-q03)。

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
  - [Q01 · 凭据提示工具实际检查什么，能证明认证成功吗？](#detail-section-11)
  - [Q02 · 仓库和配置作用域如何确定？](#detail-section-12)
  - [Q03 · 为什么不返回完整remote仍可能暴露秘密？](#detail-section-13)
  - [Q04 · 工程与成本如何评估？](#detail-section-14)
  - [Q05 · 当前推荐结论及继续探讨方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL Git HTTPS/SSH配置排障，先区分配置线索与认证成功。详见[Q01](#research-q01)。

手工本地git config/remote检查，插件不登录或验证push。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 配置读取 | helper/origin | 进程cwd/原串 |
| GCM候选 | 路径存在 | 非认证状态 |
| 建议文本 | HTTPS/SSH排查 | 不执行修复 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=18/tools | 运行工具 | ABI匹配 |
| PATH git/进程cwd | 配置与origin | 可能非会话仓库 |
| 固定GCM路径 | 候选存在 | 其他盘布局遗漏 |
| 安全helper配置 | 结果可外发 | 内联值原样输出 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 本地核helper | 用户 | 不含敏感内联值 |
| 核实际目标cwd | 用户 | 与目标仓一致 |
| 看类型与建议 | 用户 | 非认证成功证据 |
| 独立决定改配置 | 用户 | 全局影响有备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | git/宿主 | 核cwd及helper敏感性 | 先核host cwd和内联helper敏感性；工时未知 |
| 持续使用 | 两本地进程/结果token | 预检与错误复核 | 无插件网络请求；宿主结果token及人工预检金额未知 |
| 失败恢复 | 无插件持久写入；已发送结果留在宿主/模型流程 | 核外发范围并处理敏感值 | 停用不撤回已外发敏感值；处置工时与损失未知 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 配置线索 | helper/GCM路径 | 非有效凭据认证 |
| 协议建议 | origin分类 | scheme/SSH样式有限 |
| 避免秘密 | 无fill/remote只host | helper原串未脱敏 |

> **思考**：内联helper可能含敏感值却原样输出，错误吞成未配，宿主cwd不等会话仓库。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把常用Git凭据配置线索放入单一模型报告。详见[Q01](#research-q01)。

把常用Git凭据配置线索放入单一模型报告。详见[Q01](#research-q01)。

固定execFile优点明确，需最终输出脱敏测试与可区分错误。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

内联helper可能含敏感值却原样输出，错误吞成未配，宿主cwd不等会话仓库。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，补最小化输出/明确目标再评估。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

无fill/无自动配置，但helper原串进结果/advice且未绑定会话cwd，安全承诺需收窄。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、package.json、index.js、lib/cred.js、lib/wsl-host.js、test/cred.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整入口/105行cred/57行wsl-host/55行生产测试/README/SECURITY/package，只读不查真实凭据。
- 下一步：以虚构helper敏感占位值和A/B仓库反例核输出与作用域。

**分析版本**

- **仓库**：[173787247/dsh-wsl-cred](https://github.com/173787247/dsh-wsl-cred)
- **版本号**：0.2.0（[固定提交 1c45da3](https://github.com/173787247/dsh-wsl-cred/tree/1c45da3969a109959783373175150c87a3a33fa0)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究只回类型/状态的最小化输出及明确cwd/错误层级，比较敏感片段和归属误判，尚未验证。详见[Q05](#research-q05)。

以虚构helper敏感占位值和A/B仓库反例核输出与作用域。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 154 | — | — | 768 |
| .js | source | 3 | 235 | 210 | 3 | — |
| .js | test | 1 | 55 | 49 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred/issues?q=is%3Aissue+created%3A2026-09-22T07%3A15%3A35.391Z..2026-10-22T07%3A15%3A35.391Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A15%3A35.391Z..2026-10-22T07%3A15%3A35.391Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：凭据诊断读取/输出什么，秘密最小化和当前会话仓库归属是否成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 凭据提示工具实际检查什么，能证明认证成功吗？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

给WSL里Git HTTPS/SSH认证排障者汇总credential.helper配置、三处Windows GCM候选路径存在性、origin协议/host及固定建议。贡献是把常用只读检查接到模型工具，基线是手工git config与remote get-url；不调用credential fill，不登录/取token、不验证凭据能用或git push授权。GCM exe存在不等安装完整或有当前账户凭据，helper配置存在也不等实际远端会采用它。

README和工具说明“never returns secrets”是作者目标，当前原样输出helper字符串不能支撑该无条件承诺，需按具体数据流评估。SSH建议用ssh_agent_hint、HTTPS建议GCM/gh，不核这些工具/登录状态。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-9](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/README.md#L5-L9)

作者承诺。

```text
DeepSeek Harness tool: **`cred_hint`** — report `git credential.helper` and safe guidance for **Windows Git Credential Manager** from WSL.

**Never returns tokens or passwords.**

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.
```

**依据 2 · 源码核查**：[index.js:46-58](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/index.js#L46-L58)

输出字段。

<details>
<summary>查看原文（13行）</summary>

```text
    async execute() {
      const helperInfo = await gitCredentialHelper();
      const helper = helperInfo.helper || "";
      const gcmPath = findGcmPath();
      const remoteInfo = await gitRemoteUrl();
      const remote = classifyRemote(remoteInfo.url);
      return {
        wsl,
        helper,
        gcmPath,
        remoteKind: remote.kind,
        remoteHost: remote.host,
        advice: buildCredAdvice(helper, { remote, gcmPath }),
```

</details>

**依据 3 · 源码核查**：[lib/cred.js:7-28](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L7-L28)

只读两命令。

<details>
<summary>查看原文（22行）</summary>

```text
export async function gitCredentialHelper({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("git", ["config", "--get", "credential.helper"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    return { ok: true, helper: String(stdout || "").trim() };
  } catch {
    return { ok: true, helper: "" };
  }
}

export async function gitRemoteUrl({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    return { ok: true, url: String(stdout || "").trim() };
  } catch {
    return { ok: false, url: "" };
  }
```

</details>

**依据 4 · 源码核查**：[lib/cred.js:51-61](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L51-L61)

GCM候选存在。

<details>
<summary>查看原文（11行）</summary>

```text
export function findGcmPath({ exists = existsSync } = {}) {
  const candidates = [
    "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe",
    "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager-core.exe",
    "/mnt/c/Program Files (x86)/Git/mingw64/bin/git-credential-manager.exe",
  ];
  for (const p of candidates) {
    if (exists(p)) return p;
  }
  return "";
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 仓库和配置作用域如何确定？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

固定execFile调用git config --get credential.helper与git remote get-url origin，无shell、不执行helper本身。入口execute不接agent/session上下文，两次execFile均未给cwd，实际用宿主进程cwd及继承环境，不能保证检查的是当前会话工作区。工具参数为空，读者无法显式指定目标；多仓使用容易把一个仓的origin建议给另一个仓。

读取helper异常全部返回ok=true和空字符串，既可能确实未配也可能git不可执行/超时/权限失败；origin异常变none，原因未透出输出。两次命令各5秒、外层默认10秒且无signal传递，不是统一总预算。detectWsl只影响报告字段，不阻止非WSL运行。Node>=18 ESM、宿主tools/systemPrompt、PATH git和固定/mnt/c候选为依赖，无独立网络访问。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:14-21](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/index.js#L14-L21)

配置/提示。

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 10_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:cred_hint",
    order: 122,
    text: "Use cred_hint for Git/GitHub credential setup between Windows and WSL (GCM vs SSH). Never dump secrets; pair with ssh_agent_hint / github_app_hint.",
```

**依据 2 · 源码核查**：[index.js:44-59](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/index.js#L44-L59)

execute无上下文。

<details>
<summary>查看原文（16行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      const helperInfo = await gitCredentialHelper();
      const helper = helperInfo.helper || "";
      const gcmPath = findGcmPath();
      const remoteInfo = await gitRemoteUrl();
      const remote = classifyRemote(remoteInfo.url);
      return {
        wsl,
        helper,
        gcmPath,
        remoteKind: remote.kind,
        remoteHost: remote.host,
        advice: buildCredAdvice(helper, { remote, gcmPath }),
      };
```

</details>

**依据 3 · 源码核查**：[lib/cred.js:7-28](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L7-L28)

无cwd与异常吞。

<details>
<summary>查看原文（22行）</summary>

```text
export async function gitCredentialHelper({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("git", ["config", "--get", "credential.helper"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    return { ok: true, helper: String(stdout || "").trim() };
  } catch {
    return { ok: true, helper: "" };
  }
}

export async function gitRemoteUrl({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    return { ok: true, url: String(stdout || "").trim() };
  } catch {
    return { ok: false, url: "" };
  }
```

</details>

**依据 4 · 源码核查**：[lib/wsl-host.js:21-27](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/wsl-host.js#L21-L27)

WSL探测。

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

**依据 5 · 源码核查**：[package.json:14-17](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/package.json#L14-L17)

运行条件。

```text
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/cred.test.js" },
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么不返回完整remote仍可能暴露秘密？

**研究主题**：缺陷与关键质疑

#### 完整回答

返回remote只带kind/host，不透redacted完整URL，这能避免普通https userinfo直接输出。可是credential.helper是任意Git配置字符串，可能是含内联敏感值的!shell helper、URL或命令参数。gitCredentialHelper直接读stdout，入口把它放helper，buildCredAdvice又复制“Current credential.helper”，format再打印helper和advice，没有任何脱敏。即使不调用凭据读取命令，只要配置把秘密嵌在helper，这条静态数据流就会把它交给模型结果/轨迹；本次不读取用户真实Git配置，也不复现真实秘密。

classifyRemote将所有可new URL解析且非ssh的scheme归https，http/file等会被误归类；SSH正则只覆盖git@或ssh://，非git用户的scp样式可能other。GCM路径固定C盘Program Files，其他盘/安装布局会漏，helper识别仅字符串credential-manager，不是执行或配置优先级验证。建议的全局git config是文本而非自动执行，若照做会影响其他仓库，须先核目标与现有多helper配置。

#### 证据与依据

**依据 1 · 源码核查**：[lib/cred.js:7-15](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L7-L15)

helper原样读取。

```text
export async function gitCredentialHelper({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("git", ["config", "--get", "credential.helper"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    return { ok: true, helper: String(stdout || "").trim() };
  } catch {
    return { ok: true, helper: "" };
```

**依据 2 · 源码核查**：[index.js:47-58](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/index.js#L47-L58)

helper原样返回。

<details>
<summary>查看原文（12行）</summary>

```text
      const helperInfo = await gitCredentialHelper();
      const helper = helperInfo.helper || "";
      const gcmPath = findGcmPath();
      const remoteInfo = await gitRemoteUrl();
      const remote = classifyRemote(remoteInfo.url);
      return {
        wsl,
        helper,
        gcmPath,
        remoteKind: remote.kind,
        remoteHost: remote.host,
        advice: buildCredAdvice(helper, { remote, gcmPath }),
```

</details>

**依据 3 · 源码核查**：[lib/cred.js:31-48](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L31-L48)

协议分类和userinfo。

<details>
<summary>查看原文（18行）</summary>

```text
/** Classify remote without exposing tokens (strip userinfo). */
export function classifyRemote(url) {
  const raw = String(url || "").trim();
  if (!raw) return { kind: "none", host: "", redacted: "" };
  if (/^git@/i.test(raw) || /^ssh:\/\//i.test(raw)) {
    const host = (raw.match(/git@([^:]+):/) || raw.match(/ssh:\/\/(?:[^@]+@)?([^/]+)/) || [])[1] || "";
    return { kind: "ssh", host, redacted: raw.replace(/:[^@]+@/, ":***@") };
  }
  try {
    const u = new URL(raw);
    if (u.username || u.password) {
      u.username = "***";
      u.password = "";
    }
    return { kind: "https", host: u.hostname, redacted: u.toString() };
  } catch {
    return { kind: "other", host: "", redacted: raw.slice(0, 80) };
  }
```

</details>

**依据 4 · 源码核查**：[lib/cred.js:64-76](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L64-L76)

advice复制原helper。

<details>
<summary>查看原文（13行）</summary>

```text
  const tips = [
    "This tool never prints tokens or passwords. Do not paste secrets into chat or the system prompt.",
  ];
  if (helper) tips.push(`Current credential.helper: ${helper}`);
  else tips.push("credential.helper is unset in this environment.");

  if (gcmPath) {
    tips.push(`Found Windows GCM at ${gcmPath}`);
    if (!/credential-manager/i.test(helper || "")) {
      tips.push(
        `Wire it from WSL: git config --global credential.helper "${gcmPath.replace(/ /g, "\\ ")}"`,
      );
    }
```

</details>

**依据 5 · 源码核查**：[lib/cred.js:99-105](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L99-L105)

render再次输出。

```text
export function formatCredReport(report) {
  const lines = ["cred_hint", `helper: ${report.helper || "(none)"}`];
  if (report.gcmPath) lines.push(`gcm: ${report.gcmPath}`);
  if (report.remoteKind) lines.push(`origin: ${report.remoteKind}${report.remoteHost ? ` ${report.remoteHost}` : ""}`);
  for (const tip of report.advice || []) lines.push(`- ${tip}`);
  return lines.join("\n");
}
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程与成本如何评估？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

生产模块可注入execFile/exists，现有55行测试直接检查协议、普通URL token redaction、建议分流、GCM候选与文本格式。优点是固定命令不走shell、不读取密码库且remote只交host；但脱敏测试仅针对classifyRemote.redacted，没有覆盖最终helper/advice输出，对README无秘密承诺的关键路径未守住。异常丢失也使“未配”和“查询失败”难区分。本次只读测试，不执行目标。

首次核实际host cwd、helper配置是否含敏感值后才考虑调用；持续两次本地进程和候选exists，报告占模型上下文，无插件网络费用。恢复无插件持久写入，但若输出已含配置秘密，停用不能抹去已发送模型/会话数据，需由凭据所有者按实际泄露范围处置；不能用“没调用fill”否认这种影响。照建议改全局helper是外部动作，需自己备份恢复。

#### 证据与依据

**依据 1 · 源码核查**：[test/cred.test.js:1-55](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/test/cred.test.js#L1-L55)

脱敏只测remote。

<details>
<summary>查看原文（55行）</summary>

```text
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCredAdvice,
  classifyRemote,
  findGcmPath,
  formatCredReport,
} from "../lib/cred.js";

describe("classifyRemote", () => {
  it("detects https and ssh", () => {
    assert.equal(classifyRemote("https://github.com/a/b.git").kind, "https");
    assert.equal(classifyRemote("git@github.com:a/b.git").kind, "ssh");
  });

  it("redacts userinfo", () => {
    const r = classifyRemote("https://user:token@github.com/a/b.git");
    assert.equal(r.kind, "https");
    assert.ok(!/token/.test(r.redacted));
  });
});

describe("buildCredAdvice", () => {
  it("routes SSH remotes to ssh_agent_hint", () => {
    const tips = buildCredAdvice("manager", {
      remote: { kind: "ssh", host: "github.com" },
      gcmPath: "",
    });
    assert.ok(tips.some((t) => /ssh_agent_hint/i.test(t)));
  });

  it("suggests GCM when found", () => {
    const gcm = "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe";
    const tips = buildCredAdvice("", { remote: { kind: "https", host: "github.com" }, gcmPath: gcm });
    assert.ok(tips.some((t) => /Found Windows GCM/i.test(t)));
  });
});

describe("findGcmPath", () => {
  it("returns first existing candidate", () => {
    const p = findGcmPath({
      exists: (x) => x.includes("git-credential-manager.exe"),
    });
    assert.match(p, /git-credential-manager\.exe$/);
  });
});

describe("formatCredReport", () => {
  it("includes origin kind", () => {
    assert.match(
      formatCredReport({ helper: "manager", remoteKind: "https", remoteHost: "github.com", advice: [] }),
      /origin: https github.com/,
    );
  });
});
```

</details>

**依据 2 · 源码核查**：[lib/cred.js:7-28](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L7-L28)

本地进程范围。

<details>
<summary>查看原文（22行）</summary>

```text
export async function gitCredentialHelper({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("git", ["config", "--get", "credential.helper"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    return { ok: true, helper: String(stdout || "").trim() };
  } catch {
    return { ok: true, helper: "" };
  }
}

export async function gitRemoteUrl({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    return { ok: true, url: String(stdout || "").trim() };
  } catch {
    return { ok: false, url: "" };
  }
```

</details>

**依据 3 · 源码核查**：[lib/cred.js:64-81](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L64-L81)

全局配置仅建议。

<details>
<summary>查看原文（18行）</summary>

```text
  const tips = [
    "This tool never prints tokens or passwords. Do not paste secrets into chat or the system prompt.",
  ];
  if (helper) tips.push(`Current credential.helper: ${helper}`);
  else tips.push("credential.helper is unset in this environment.");

  if (gcmPath) {
    tips.push(`Found Windows GCM at ${gcmPath}`);
    if (!/credential-manager/i.test(helper || "")) {
      tips.push(
        `Wire it from WSL: git config --global credential.helper "${gcmPath.replace(/ /g, "\\ ")}"`,
      );
    }
  } else {
    tips.push(
      "Prefer Windows Git Credential Manager from WSL when installed under Program Files\\Git\\mingw64\\bin\\.",
    );
  }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前推荐结论及继续探讨方向？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察。常见只含可执行路径的helper场景可提供便捷线索，但秘密安全是本插件核心承诺，原样helper外发与会话cwd不绑定是当前具体缺陷，不宜把它作为无需预检的安全凭据诊断直接启用。读者可先在本机可信终端检查配置，避免将含内联值的helper交给模型，并明确目标仓库；这不是要求在研究中运行凭据命令。

可继续研究最小化输出，只返回helper类型/是否疑似内联而不返回原串，以明确cwd和错误状态代替隐式进程环境，区分协议/路径存在/认证成功层级。基线为当前原串复制，反例包括虚构!helper含敏感占位值、非https URL、多helper、git缺失、A/B会话cwd、其他盘GCM与总超时。比较输出敏感片段数、仓库归属误判和恢复工时；该方向尚未实现/验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:46-58](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/index.js#L46-L58)

输出/作用域基线。

<details>
<summary>查看原文（13行）</summary>

```text
    async execute() {
      const helperInfo = await gitCredentialHelper();
      const helper = helperInfo.helper || "";
      const gcmPath = findGcmPath();
      const remoteInfo = await gitRemoteUrl();
      const remote = classifyRemote(remoteInfo.url);
      return {
        wsl,
        helper,
        gcmPath,
        remoteKind: remote.kind,
        remoteHost: remote.host,
        advice: buildCredAdvice(helper, { remote, gcmPath }),
```

</details>

**依据 2 · 源码核查**：[lib/cred.js:64-68](https://github.com/173787247/dsh-wsl-cred/blob/1c45da3969a109959783373175150c87a3a33fa0/lib/cred.js#L64-L68)

原串复制基线。

```text
  const tips = [
    "This tool never prints tokens or passwords. Do not paste secrets into chat or the system prompt.",
  ];
  if (helper) tips.push(`Current credential.helper: ${helper}`);
  else tips.push("credential.helper is unset in this environment.");
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
