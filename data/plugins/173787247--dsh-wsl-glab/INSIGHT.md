# dsh-wsl-glab

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[305794f](https://github.com/173787247/dsh-wsl-glab/tree/305794fc429ad5fa43be6e6e6f3fb9abd80c135f)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-glab)
<!-- END META -->

> **实现功能**：将glab认证概览、MR/issue单页列表和CI文本接入模型工具，脱敏与错误展示仍有缺口。

> **核心亮点**：把常见GitLab读取命令统一到模型摘要入口。详见[Q01](#research-q01)。

> **风险与缺陷**：auth正则可能漏空格分隔秘密，issue parse失败render假空，CI错误包装ok，项目和CLI版本隐式。详见[Q03](#research-q03)。

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
  - [Q01 · GitLab封装面向什么场景，是否能写远端？](#detail-section-11)
  - [Q02 · 目标GitLab与返回内容如何确定？](#detail-section-12)
  - [Q03 · 脱敏、解析和成功状态有哪些风险？](#detail-section-13)
  - [Q04 · 测试、超时和使用成本如何判断？](#detail-section-14)
  - [Q05 · 当前是否推荐，继续研究从哪里着手？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已认证GitLab开发者查询项目协作状态。详见[Q01](#research-q01)。

官方glab/连接器只读查询，插件不完成评审发布。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| `glab_status` | 查CLI版本与认证摘要 | 依本地CLI/账户；有限脱敏不保证任意格式无秘密 |
| `glab_mr_list` | 查询MR单页字段摘要 | 核host/repo和CLI版本；JSON失败回raw，最多50非完整清单 |
| `glab_issue_list` | 查询issue单页摘要 | JSON失败可能在render显示none，不能直接断言无issue |
| `glab_ci_status` | 读取CI状态文本和退出码 | 任意非零仍包装ok，需区分管线失败/认证/网络错误 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node/tools | 入口 | ABI匹配 |
| glab/bash版本 | CLI/定位 | flag/JSON依版本 |
| host/account/repo | 目标 | 隐式环境可能错 |
| GitLab网络/权限 | 查询 | 非零不可当业务正常 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 本地核认证摘要 | 用户 | 无敏感值外发 |
| 指定目标/版本 | 用户 | host/project清楚 |
| 查列表/CI | 工具 | 看原始状态/parse |
| 业务判断 | 用户 | 不按ok或空列表断言 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | glab/bash、认证与网络资源，金额未知 | 核host/account/repo/固定CLI版本及摘要可外发性，工时未知 | 先核最小GitLab权限，不把认证结果当公开数据 |
| 持续使用 | CLI/API网络、JSON上下文；不新增插件独立模型调用 | 复核单页完整性、parse与CI退出状态，实际耗时未知 | 最多50项不保证完整；API额度/企业访问费用未知，未有节时对照 |
| 失败恢复 | 核目标与版本后重新查询；插件不写glab认证配置 | 排查错项目/错误状态；已外发敏感摘要需另行纠正 | 停用无法撤回模型/会话结果；重查金额与纠错工时未知 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 列表概览 | 单页挑字段 | parse失败可假空 |
| CI查询 | 输出/exitCode | ok非通过 |
| 认证提示 | 有限正则 | 非无秘密保证 |

> **思考**：auth正则可能漏空格分隔秘密，issue parse失败render假空，CI错误包装ok，项目和CLI版本隐式。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把常见GitLab读取命令统一到模型摘要入口。详见[Q01](#research-q01)。

把常见GitLab读取命令统一到模型摘要入口。详见[Q01](#research-q01)。

固定读命令边界明确，测试不足以守脱敏/CLI/降级，需显式状态。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

auth正则可能漏空格分隔秘密，issue parse失败render假空，CI错误包装ok，项目和CLI版本隐式。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，补输出和状态契约再重评。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定读入口可核，auth有限正则、issue假空降级与CI非零ok需改善。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/glab.js、test/glab.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整139行入口/181行glab/6行测试及README/package；不执行CLI/真实认证或访问GitLab。
- 下一步：以虚构token格式/截断JSON/非零CI及多项目反例核状态契约。

**分析版本**

- **仓库**：[173787247/dsh-wsl-glab](https://github.com/173787247/dsh-wsl-glab)
- **版本号**：0.1.1（[固定提交 305794f](https://github.com/173787247/dsh-wsl-glab/tree/305794fc429ad5fa43be6e6e6f3fb9abd80c135f)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究白名单认证摘要/显式项目来源与parse-partial状态契约，对照假空和敏感外发，尚未验证。详见[Q05](#research-q05)。

以虚构token格式/截断JSON/非零CI及多项目反例核状态契约。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 485 |
| .js | source | 2 | 320 | 299 | 4 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-glab/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-glab/issues?q=is%3Aissue+created%3A2026-09-22T07%3A29%3A09.128Z..2026-10-22T07%3A29%3A09.128Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-glab/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A29%3A09.128Z..2026-10-22T07%3A29%3A09.128Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**固定glab只读封装能否可靠呈现目标/认证/列表/CI状态，脱敏和降级边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · GitLab封装面向什么场景，是否能写远端？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

面向已装并认证glab的开发者，让模型查MR/issue列表和CI状态，不开放创建、合并、评论或通用api命令。入口只构造专用读命令，认证走既有CLI环境，插件不要求把token作为工具参数。贡献是把常用列表挑字段接进模型工具，基线是手动glab或连接器，不是新的GitLab协作/审核机制。

所谓read-only来自暴露的固定命令，不是WRITE集合的动态拦截；WRITE最终void未被检查，但也没有通用执行工具，不能据此声称已有写入入口。CI查询返回进程输出和exitCode，ok不是流水线成功或发布验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-34](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/README.md#L5-L34)

作者用途和不写边界。

<details>
<summary>查看原文（30行）</summary>

````text
GitLab CLI（glab）只读：MR / issue / ci status。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-glab
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-glab
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `glab_status` | glab 版本 |
| `glab_mr_list` | MR 列表 |
| `glab_issue_list` | Issue 列表 |
| `glab_ci_status` | 流水线状态 |

## 配置要点

`timeoutMs`

````

</details>

**依据 2 · 源码核查**：[index.js:20-137](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/index.js#L20-L137)

四固定工具。

<details>
<summary>查看原文（118行）</summary>

```text
  ctx.tools.register({
    name: "glab_status",
    description: "Whether glab is on PATH; version + auth status summary (never returns tokens).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
      return glabStatus();
    },
    presentCall: () => ({ card: "generic", title: "glab status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "glab status", content: r.content }),
  });

  ctx.tools.register({
    name: "glab_mr_list",
    description: "List merge requests (json summary). Optional repo path group/project.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        state: { type: "string" },
        limit: { type: "number" },
        repo: { type: "string" },
      },
    },
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
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await glabMrList({ ...args, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "glab mr list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "glab mr list", content: r.content }),
  });

  ctx.tools.register({
    name: "glab_issue_list",
    description: "List issues (json summary).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        state: { type: "string" },
        limit: { type: "number" },
        repo: { type: "string" },
      },
    },
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
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await glabIssueList({ ...args, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "glab issue list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "glab issue list", content: r.content }),
  });

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
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "glab ci" }),
    presentResult: (_a, r) => ({ card: "generic", title: "glab ci", content: r.content }),
  });
}

function positive(v, fb) {
  const n = Number(v);
```

</details>

**依据 3 · 源码核查**：[lib/glab.js:48-70](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L48-L70)

未使用WRITE。

<details>
<summary>查看原文（23行）</summary>

```text
  "mr",
  "issue",
  "release",
  "repo",
  "label",
  "milestone",
  "snippet",
  "schedule",
  "variable",
  "securefile",
  "deploy-key",
  "ssh-key",
  "token",
  "user",
  "alias",
  "config",
  "auth",
  "api",
  "ci",
]);

// Read-ish glab verbs we expose as dedicated tools; block generic shell-out of write commands.
export async function glabStatus() {
```

</details>

**依据 4 · 源码核查**：[lib/glab.js:141-156](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L141-L156)

CI结果。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目标GitLab与返回内容如何确定？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

通过bash -lc command-v找glab再spawn固定argv，MR/issue限制state枚举与repo字符，limit夹1到50但未取整，单次--per-page并无翻页。repo未填时依赖宿主进程cwd/继承glab环境推当前项目，没有agent cwd/scope、GitLab host或项目允许名单；填repo也只给-R group/project字符形式，具体host由CLI配置决定。用户必须核目标账户/主机，不把当前session等同CLI项目。

版本/认证工具读取CLI version与auth status，auth只汇总而不新登录。MR/issue用-F json和--state等参数，state=all则不加state参数，不显式请求全状态；项目未固定glab版本，实际命令flag及默认状态要与所装版本核对，不能从源码枚举all推已拿全部。Node>=18、gitlab可达网络、glab/bash、既有账户与宿主tools/systemPrompt为依赖，无WSL门。

#### 证据与依据

**依据 1 · 源码核查**：[lib/glab.js:3-16](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L3-L16)

定位与spawn。

<details>
<summary>查看原文（14行）</summary>

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((r) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => r(c === 0 ? out.trim() : ""));
  });
}

export function run(bin, args, { timeoutMs = 30_000, maxOut = 80_000, env } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, {
```

</details>

**依据 2 · 源码核查**：[lib/glab.js:105-139](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L105-L139)

MR参数/解析。

<details>
<summary>查看原文（35行）</summary>

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
}

export async function glabCiStatus({ repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const args = ["ci", "status"];
  if (repo) {
```

</details>

**依据 3 · 源码核查**：[lib/glab.js:158-181](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L158-L181)

issue参数。

<details>
<summary>查看原文（24行）</summary>

```text
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
}

void WRITE;
```

</details>

**依据 4 · 源码核查**：[index.js:33-44](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/index.js#L33-L44)

模型repo/state输入。

<details>
<summary>查看原文（12行）</summary>

```text

  ctx.tools.register({
    name: "glab_mr_list",
    description: "List merge requests (json summary). Optional repo path group/project.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        state: { type: "string" },
        limit: { type: "number" },
        repo: { type: "string" },
      },
```

</details>

**依据 5 · 源码核查**：[package.json:6-10](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/package.json#L6-L10)

Node。

```text
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-glab.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
```

#### 缺口

- 目标glab版本的-F/--state/all默认语义及自建GitLab主机解析
  **影响：**工具生成参数不等已验证兼容或全状态查询
  **进一步探讨：**读明确版本CLI官方命令契约并用保存的无凭据输出核schema，不凭泛化glab名称推兼容

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 脱敏、解析和成功状态有哪些风险？

**研究主题：**缺陷与关键质疑

#### 完整回答

auth摘要将包含token/oauth/pat的非空白连续串替换，再丢含常见ghp/glpat前缀行，但没有只允许host/user行。若秘密以“Token: 敏感值”空格分隔且无已知前缀，正则只删Token:，后面的值仍留；固定数据流不能支持never returns tokens的无条件说明。本次不调用真实认证、不采任何秘密；这是格式覆盖缺陷。loggedIn还可在exit非0但文字匹配Logged in to时true，需看完整exitCode。

run先缓冲再截stdout，超过2*maxOut kill，stderr也先无界缓冲后截4000。JSON截断/输出格式变化会parse失败：MR返回ok+raw+truncated，issue返回ok+raw但renderer只读issues，结果可能显示(none)掩盖真实错误原文；parse成功非数组也静默当空。成功列表不保留run.truncated，且只是单页，不是完整清单。

CI任意非零仍ok=true以保失败流水线输出，但认证/网络/未知命令非零也同样包装，render不显示exitCode/truncated。应把“命令结果已返回”和“业务状态正常”分开，不能按工具ok判CI通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/glab.js:81-104](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L81-L104)

有限正则和loggedIn。

<details>
<summary>查看原文（24行）</summary>

```text
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
}

export async function glabVersion({ timeoutMs } = {}) {
  const bin = (await which("glab")) || "glab";
  const r = await run(bin, ["version"], { timeoutMs: timeoutMs || 10_000, maxOut: 5_000 });
  return { ok: true, output: (r.stdout || r.stderr).trim() };
}
```

</details>

**依据 2 · 源码核查**：[lib/glab.js:14-45](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L14-L45)

缓冲/截断。

<details>
<summary>查看原文（32行）</summary>

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
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}
```

</details>

**依据 3 · 源码核查**：[lib/glab.js:122-139](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L122-L139)

MR降级。

<details>
<summary>查看原文（18行）</summary>

```text
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
}

export async function glabCiStatus({ repo, timeoutMs, maxOut = 40_000 } = {}) {
  const bin = (await which("glab")) || "glab";
  const args = ["ci", "status"];
  if (repo) {
```

</details>

**依据 4 · 源码核查**：[lib/glab.js:168-181](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L168-L181)

issue降级。

<details>
<summary>查看原文（14行）</summary>

```text
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
}

void WRITE;
```

</details>

**依据 5 · 源码核查**：[index.js:82-93](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/index.js#L82-L93)

issue render丢raw。

<details>
<summary>查看原文（12行）</summary>

```text
        repo: { type: "string" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : (v.issues || []).map((i) => `#${i.iid} ${i.state} ${i.title}\n${i.web_url}`).join("\n\n") || "(none)",
```

</details>

**依据 6 · 源码核查**：[lib/glab.js:141-156](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L141-L156)

非零CI仍ok。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 测试、超时和使用成本如何判断？

**研究主题：**效果与总成本、工程质量与复用

#### 完整回答

6行测试直接调用glabStatus只断言ok=true，机器缺glab时也ok，因此不验证真实列表/CI、CLI参数、脱敏和解析。固定argv与参数字符约束是积极工程边界；没有shell拼用户repo，但which本身无error监听/timeout，缺bash或登录脚本卡住可能先于run预算。status版本最多8秒、auth10秒，加两次which，外层15秒，未统一deadline/取消signal。列表每个CLI局部timeout也没有宿主abort透传。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | glab/bash、认证与网络资源，金额未知 | 核host/account/repo/固定CLI版本及摘要可外发性，工时未知 | 先核最小GitLab权限，不把认证结果当公开数据 |
| 持续使用 | CLI/API网络、JSON上下文；不新增插件独立模型调用 | 复核单页完整性、parse与CI退出状态，实际耗时未知 | 最多50项不保证完整；API额度/企业访问费用未知，未有节时对照 |
| 失败恢复 | 核目标与版本后重新查询；插件不写glab认证配置 | 排查错项目/错误状态；已外发敏感摘要需另行纠正 | 停用无法撤回模型/会话结果；重查金额与纠错工时未知 |


#### 证据与依据

**依据 1 · 源码核查**：[test/glab.test.js:1-6](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/test/glab.test.js#L1-L6)

仅status ok。

```text
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { glabStatus } from "../lib/glab.js";
describe("glab", () => {
  it("status shape", async () => { assert.equal((await glabStatus()).ok, true); });
});
```

**依据 2 · 源码核查**：[lib/glab.js:3-11](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L3-L11)

which无error/timeout。

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((r) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => r(c === 0 ? out.trim() : ""));
  });
```

**依据 3 · 源码核查**：[lib/glab.js:73-104](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L73-L104)

status串联预算。

<details>
<summary>查看原文（32行）</summary>

```text
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
}

export async function glabVersion({ timeoutMs } = {}) {
  const bin = (await which("glab")) || "glab";
  const r = await run(bin, ["version"], { timeoutMs: timeoutMs || 10_000, maxOut: 5_000 });
  return { ok: true, output: (r.stdout || r.stderr).trim() };
}
```

</details>

**依据 4 · 源码核查**：[index.js:20-27](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/index.js#L20-L27)

外层15秒。

```text
  ctx.tools.register({
    name: "glab_status",
    description: "Whether glab is on PATH; version + auth status summary (never returns tokens).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前是否推荐，继续研究从哪里着手？

**研究主题：**新假设与验证、采用判断

#### 完整回答

先观察。常见列表封装便利，但认证摘要有限脱敏、issue解析失败假空和CI非零ok的展示语义，会使“安全只读概览”不够可靠；无需拿未冒烟当理由。若读者仅查明确非敏感项目，也先核CLI固定版本、host/repo和原始状态，别按(none)/ok当无事项或CI通过。

继续可研究auth输出严格最小字段白名单或仅结构化布尔、显式项目来源/host、parse-error与partial状态以及CLI版本契约。基线为当前正则/空数组降级，反例为虚构空格分隔token、非数组JSON、超长截断、CLI参数不支持、all默认、认证失败CI与A/B项目切换。比较敏感片段泄露、假空/假绿和查询恢复时间，尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/glab.js:81-104](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L81-L104)

脱敏基线。

<details>
<summary>查看原文（24行）</summary>

```text
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
}

export async function glabVersion({ timeoutMs } = {}) {
  const bin = (await which("glab")) || "glab";
  const r = await run(bin, ["version"], { timeoutMs: timeoutMs || 10_000, maxOut: 5_000 });
  return { ok: true, output: (r.stdout || r.stderr).trim() };
}
```

</details>

**依据 2 · 源码核查**：[lib/glab.js:122-181](https://github.com/173787247/dsh-wsl-glab/blob/305794fc429ad5fa43be6e6e6f3fb9abd80c135f/lib/glab.js#L122-L181)

解析/状态基线。

<details>
<summary>查看原文（60行）</summary>

```text
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
}

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
}

void WRITE;
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
