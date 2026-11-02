# dsh-wsl-cred

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[332c03a](https://github.com/173787247/dsh-wsl-cred/tree/332c03ae2e733493b3add24eb54a0ddf7535598c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-cred)
<!-- END META -->

> **功能**：将Git credential.helper、Windows GCM路径和origin协议线索汇成模型报告，不执行认证或修改凭据。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 两命令和路径线索加协议建议合成模型可读报告，remote仅host回传、固定execFile可借鉴；价值限配置提示而非登录成功。

> **主要限制**：[Q03](#research-q03) 内联helper可能带敏感片段却原样进入helper/advice/render，绝对不回秘密主张不成立；[Q02](#research-q02) 错误当未配置、宿主cwd非会话仓库使诊断可误归属。

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
  - [Q01 · 配置线索报告解决谁的任务？](#detail-section-11)
  - [Q02 · 执行范围、cwd和错误怎样进模型输出？](#detail-section-12)
  - [Q03 · never returns secrets是否覆盖最终输出？](#detail-section-13)
  - [Q04 · 成本和采用应如何收缩，怎样验证最小化输出？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL用户配置Git HTTPS/SSH或排错时需要辨认helper与origin，报告准确归属不等认证已通过。

在本地目标仓库手工查git config/remote与GCM位置；插件将线索聚成单报告，不新增认证/凭据管理能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| helper/GCM线索 | 判断HTTPS配置候选 | 原串可敏感，存在不证可用 |
| origin分类 | 分SSH/HTTPS建议 | 宿主cwd与URL方案分类有限 |
| 只读报告 | 少手工拼提示 | 不fill、不改配置但输出进入模型 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/systemPrompt、Node>=18 | 必需 | 注册报告 | 宿主兼容未验 |
| PATH git/正确宿主cwd | 诊断必需 | 读配置与origin | 错误会归空，不当未配证明 |
| Windows GCM候选路径 | 按需线索 | 文件存在检测 | 不存在不等无其他安装 |
| 预读helper敏感性 | 当前输出前提 | 防原串入模型 | 未核不直接调用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 预检 | 本地确认目标cwd与helper内容 | 不用真实秘密测试 |
| 修边界 | 明确cwd/错误和最小化输出 | JSON和render均无敏感片段 |
| 核诊断 | 一次性夹具对照手工命令 | 分类/归属正确，非认证成功 |
| 停止 | 未核敏感性或归属则不用 | 回本地人工最小诊断 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/Git | 核cwd/helper敏感性 | 时间未知 |
| 持续 | 两进程/结果token | 诊断与错因复核 | 无插件网络不等模型无费用 |
| 失败恢复 | 无插件写入，输出可留聊天/模型 | 查外发范围/处置实际敏感值 | 停用不能撤回已外发内容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 配置线索 | helper/三路径/origin报告 | 目标仓库归属及真实认证 |
| 输出最小化 | remote仅host且不fill | helper无秘密保证不成立 |
| 排障 | 协议建议 | 错误归空时准确性 |

> **思考**：[Q03](#research-q03) 内联helper可能带敏感片段却原样进入helper/advice/render，绝对不回秘密主张不成立；[Q02](#research-q02) 错误当未配置、宿主cwd非会话仓库使诊断可误归属。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 两命令和路径线索加协议建议合成模型可读报告，remote仅host回传、固定execFile可借鉴；价值限配置提示而非登录成功。

[Q02](#research-q02) 固定参数execFile值得保留；[Q03](#research-q03) 安全应检查最终JSON/advice/render，测试userinfo不能代表整个报告脱敏；错误必须保留类别。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 内联helper可能带敏感片段却原样进入helper/advice/render，绝对不回秘密主张不成立；[Q02](#research-q02) 错误当未配置、宿主cwd非会话仓库使诊断可误归属。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先观察并补明确目标与最小化输出；当前不要未经预检把内联helper交给模型，回本地手工检查，不自动运行global修改建议。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

重新核固定入口、完整cred与wsl-host及现有测试范围，复核正式旧findings；无目标执行/真实凭据/认证检查，输出缺陷为条件性源码判断。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、index.js、lib/cred.js、test/cred.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定全部入口、105行cred模块、57行wsl-host、55行测试及README/SECURITY/package；只读材料，不查真实配置。
- 下一步：[Q04](#research-q04) 用假秘密夹具核最终输出、错误层级和cwd归属及人工负担，未执行不写收益。

**分析版本**

- **仓库**：[173787247/dsh-wsl-cred](https://github.com/173787247/dsh-wsl-cred)
- **版本号**：0.2.0（[固定提交 332c03a](https://github.com/173787247/dsh-wsl-cred/tree/332c03ae2e733493b3add24eb54a0ddf7535598c)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证方向是明确目标并只回类型/状态，区分执行失败与未配置，以假内联helper等夹具比较最终输出和诊断，不重复计已有remote最小化。

[Q04](#research-q04) 用假秘密夹具核最终输出、错误层级和cwd归属及人工负担，未执行不写收益。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 154 | — | — | 768 |
| .js | source | 3 | 235 | 210 | 3 | — |
| .js | test | 1 | 55 | 49 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-cred/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-cred/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-cred/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：cred_hint能否给正确且最小披露的配置诊断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 配置线索报告解决谁的任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

cred_hint服务于WSL用户排查Git origin是HTTPS还是SSH、credential.helper和Windows GCM路径。相比手工执行git config/remote并找GCM，它把两类配置线索与解释集中成模型可读报告，区分GitHub App API token不等git push凭据。没有执行认证、登录、push或修改config，因此成功判据是报告指向正确仓库且线索准确，不能是“已能push”。

需求集中在环境搭建/故障诊断，可能是偶发便利而非持续工作流改变。SSH/GCM只是建议分流，其他套件ssh_agent_hint/github_app_hint不属于本组件已实现能力；本包也不桥接agent、不管理凭据存储。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-41](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/README.md#L39-L41)

作者HTTPS配置痛点。

```text
## Why

HTTPS git from WSL often fails until credential helper points at Windows GCM (or `gh auth` on Windows). This tool explains the setup without dumping secrets into the chat or prompt.
```

**依据 2 · 源码核查**：[index.js:24-59](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/index.js#L24-L59)

工具输出与实际执行。

<details>
<summary>查看原文（36行）</summary>

```text
  ctx.tools.register({
    name: "cred_hint",
    description:
      "Report git credential.helper, detect Windows GCM path, classify origin HTTPS vs SSH (never returns secrets).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wsl: { type: "boolean" },
          helper: { type: "string" },
          gcmPath: { type: "string" },
          remoteKind: { type: "string" },
          remoteHost: { type: "string" },
          advice: { type: "array", items: { type: "string" } },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatCredReport(value) }],
    },
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

**依据 3 · 源码核查**：[lib/cred.js:83-96](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/lib/cred.js#L83-L96)

协议与API/push建议区别。

<details>
<summary>查看原文（14行）</summary>

```text
  if (remote?.kind === "https") {
    tips.push(
      `origin is HTTPS (${remote.host || "host"}) — GCM / gh auth login on Windows usually covers WSL git push.`,
    );
    tips.push("GitHub App API tokens (github_app_hint) do not replace git push credentials.");
  } else if (remote?.kind === "ssh") {
    tips.push(`origin is SSH (${remote.host || "host"}) — use ssh_agent_hint / ssh-add, not GCM.`);
  } else if (remote?.kind === "none") {
    tips.push("No git origin in cwd — advice is environment-wide only.");
  }

  tips.push("For HTTPS GitHub, `gh auth login` on Windows + GCM often covers WSL git pushes.");
  tips.push("Pair with github_app_hint for read-only PR/Actions API (separate from push auth).");
  return tips;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 执行范围、cwd和错误怎样进模型输出？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

入口依赖tools/systemPrompt，注册cred_hint并注入使用提示。工具无输入参数，在宿主进程当前cwd执行固定git config --get credential.helper和git remote get-url origin，每个子进程五秒，未传cwd、signal或用户session仓库，工具timeoutMs与内部5秒不是同一取消链。findGcmPath只查三个固定路径exists，不验证可执行/登录。detectWsl只是报告字段，不阻止非WSL调用Git。

remote输出只回kind/host而非URL，是确实的最小化；但分类将任何可解析URL归https，而非检查protocol，git@与ssh样式有限。helper读取异常一律ok:true/helper空，remote失败变空；入口不消费ok，最终“unset/no origin”可能掩盖Git缺失、超时、权限或cwd错误。固定execFile参数避免把模型输入拼shell是工程优点，诊断错误与未配置必须另分。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-28](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/index.js#L11-L28)

注册与无参数接口。

<details>
<summary>查看原文（18行）</summary>

```text
export const name = "dsh-wsl-cred";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 10_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:cred_hint",
    order: 122,
    text: "Use cred_hint for Git/GitHub credential setup between Windows and WSL (GCM vs SSH). Never dump secrets; pair with ssh_agent_hint / github_app_hint.",
  });

  ctx.tools.register({
    name: "cred_hint",
    description:
      "Report git credential.helper, detect Windows GCM path, classify origin HTTPS vs SSH (never returns secrets).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
```

</details>

**依据 2 · 源码核查**：[index.js:44-59](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/index.js#L44-L59)

执行不携带会话cwd/错误状态。

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

**依据 3 · 源码核查**：[lib/cred.js:7-48](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/lib/cred.js#L7-L48)

固定命令、超时、异常归并和URL分类。

<details>
<summary>查看原文（42行）</summary>

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
}

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

**依据 4 · 源码核查**：[lib/cred.js:51-60](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/lib/cred.js#L51-L60)

仅固定候选存在性。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · never returns secrets是否覆盖最终输出？

**研究主题**：缺陷与关键质疑

#### 完整回答

没有。git credential.helper可为路径/普通helper名称，也可为!内联shell片段和附带参数，不能假定其中无敏感内容。读取后原样helper进入结构化工具输出，buildCredAdvice再插一次，formatCredReport又直接显示；无脱敏/白名单判断。虽然不调用credential fill、不读凭据库、不外发完整remote URL，仍不足支持“never returns secrets”的绝对主张。

这不是说普通manager字符串就是秘密，也不声称已泄漏用户凭据；确认的是可携敏感内容的配置字符串存在原样入模型路径，具体用户配置与模型外发链未执行。SECURITY要求不返回秘密与当前实现存在条件性冲突。现有测试检remote userinfo，但不覆盖最终helper/advice报告敏感片段，不可据测试文件存在宣称这个风险已防。宿主cwd不等会话仓库和吞错还可给错误诊断归属。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:47-58](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/index.js#L47-L58)

helper原串返回。

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

**依据 2 · 源码核查**：[lib/cred.js:63-68](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/lib/cred.js#L63-L68)

advice再次插原串。

```text
export function buildCredAdvice(helper, { remote = null, gcmPath = "" } = {}) {
  const tips = [
    "This tool never prints tokens or passwords. Do not paste secrets into chat or the system prompt.",
  ];
  if (helper) tips.push(`Current credential.helper: ${helper}`);
  else tips.push("credential.helper is unset in this environment.");
```

**依据 3 · 源码核查**：[lib/cred.js:99-105](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/lib/cred.js#L99-L105)

最终渲染不脱敏。

```text
export function formatCredReport(report) {
  const lines = ["cred_hint", `helper: ${report.helper || "(none)"}`];
  if (report.gcmPath) lines.push(`gcm: ${report.gcmPath}`);
  if (report.remoteKind) lines.push(`origin: ${report.remoteKind}${report.remoteHost ? ` ${report.remoteHost}` : ""}`);
  for (const tip of report.advice || []) lines.push(`- ${tip}`);
  return lines.join("\n");
}
```

**依据 4 · 作者声明**：[SECURITY.md:1-5](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/SECURITY.md#L1-L5)

作者明确安全要求。

```text
# Security

`dsh-wsl-cred` must not log, print, or return secrets (tokens, passwords, PEM keys).

Report issues via GitHub Issues on this repository.
```

**依据 5 · 源码核查**：[test/cred.test.js:10-20](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/test/cred.test.js#L10-L20)

现有userinfo测试局限，未执行。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本和采用应如何收缩，怎样验证最小化输出？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议观察，先补明确目标cwd、区分错误和未配置，并将helper限制为类型/状态后再评估。当前若要核配置，应在本地人工用已知目标检查，不直接让模型读取尚未预读的内联helper；只读本地不代表输出不会进入模型。插件未执行认证，不应为“修复”自动运行建议的global修改。

首次需要宿主/Git和人工确认cwd及配置敏感性；持续两次进程、GCM路径检查和结果token/复核，未见独立订阅不等总费用0。失败无插件持久写，但已进入聊天/模型的敏感值无法靠停用撤回，可能需按实际凭据另行处置，时间损失未知。停用工具后回本地最小诊断并确认范围。

未验证假设是只回helper类型/是否配置及可区分错误，再在一次性配置夹具比较普通manager、含秘密占位的内联helper、Git不存在/超时、宿主cwd和会话cwd不同；测最终JSON及render是否含片段、归属是否正确、诊断够不够用。当前已有remote host最小化和fixed execFile，不能重复计新贡献；若删原串使必要诊断无法完成或错误未减且人工更重则否定。未用真实秘密做试验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/cred.js:7-27](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/lib/cred.js#L7-L27)

两次进程及错误吞并是成本/验证来源。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/cred.js:99-105](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/lib/cred.js#L99-L105)

需验证最终render而非仅分类。

```text
export function formatCredReport(report) {
  const lines = ["cred_hint", `helper: ${report.helper || "(none)"}`];
  if (report.gcmPath) lines.push(`gcm: ${report.gcmPath}`);
  if (report.remoteKind) lines.push(`origin: ${report.remoteKind}${report.remoteHost ? ` ${report.remoteHost}` : ""}`);
  for (const tip of report.advice || []) lines.push(`- ${tip}`);
  return lines.join("\n");
}
```

**依据 3 · 源码核查**：[index.js:18-28](https://github.com/173787247/dsh-wsl-cred/blob/332c03ae2e733493b3add24eb54a0ddf7535598c/index.js#L18-L28)

systemPrompt与工具主张。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:cred_hint",
    order: 122,
    text: "Use cred_hint for Git/GitHub credential setup between Windows and WSL (GCM vs SSH). Never dump secrets; pair with ssh_agent_hint / github_app_hint.",
  });

  ctx.tools.register({
    name: "cred_hint",
    description:
      "Report git credential.helper, detect Windows GCM path, classify origin HTTPS vs SSH (never returns secrets).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
```

</details>

#### 缺口

- 未在真实宿主/目标仓库及最小化输出版本比较
  **影响**：不能支持当前常规采用、修复成功或净节省
  **进一步探讨**：隔离假配置测最终输出/归属和错误层级，不含真实凭据，修复后再宿主验收。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
